import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Box, Container, Typography } from "@mui/material";
import PageRenderer from "@src/pages/admin/components/builder/Renderer";
import { Preloader } from "@src/components/preloader";
import NotFoundPage from "./NotFoundPage";
import { ResearchAmplifyRepository } from "@core/infrastructure/repositories/ResearchAmplifyRepository";
import { InstitutionAmplifyRepository } from "@core/infrastructure/repositories/InstitutionAmplifyRepository";
import { ArticleAmplifyRepository } from "@core/infrastructure/repositories/ArticleAmplifyRepository";
import { TemplateAmplifyRepository } from "@core/infrastructure/repositories/TemplateAmplifyRepository";
import { generateClient } from "aws-amplify/data";

const researchRepository = new ResearchAmplifyRepository();
const institutionRepository = new InstitutionAmplifyRepository();
const articleRepository = new ArticleAmplifyRepository();
const templateRepository = new TemplateAmplifyRepository();
const client = generateClient();

const getInstitutionPathCandidates = (path) => {
  const candidates = [
    path,
    path.replace(/^colegio\//, ""),
    path.replace(/^colegios\//, ""),
  ];

  return [...new Set(candidates.filter(Boolean))];
};

const normalizePath = (path) => (path || "").replace(/^\/+|\/+$/g, "");

const resolveByListFallback = async (cleanPath) => {
  const [researchs, institutions, articles] = await Promise.all([
    researchRepository.get().catch(() => []),
    institutionRepository.list().catch(() => []),
    articleRepository.get().catch(() => []),
  ]);

  const foundResearch = researchs.find(
    (research) => normalizePath(research.path) === cleanPath,
  );

  if (foundResearch) {
    return { data: foundResearch, dataType: "research" };
  }

  const institutionPathCandidates = getInstitutionPathCandidates(cleanPath);
  const foundInstitution = institutions.find((institution) =>
    institutionPathCandidates.includes(normalizePath(institution.path)),
  );

  if (foundInstitution) {
    const { data: currentInstitution } = await client.models.Institution.get(
      { id: foundInstitution.id },
      { authMode: "apiKey" },
    );

    return {
      data: currentInstitution || foundInstitution,
      dataType: "institution",
    };
  }

  const foundArticle = articles.find(
    (article) => normalizePath(article.slug) === cleanPath,
  );

  if (foundArticle) {
    return { data: foundArticle, dataType: "article" };
  }

  return null;
};

const TemplateDetail = () => {
  const params = useParams();
  const fullPath = params["*"];

  const [data, setData] = useState(null);
  const [dataType, setDataType] = useState(null);
  const [error, setError] = useState(null);
  const [resolvingData, setResolvingData] = useState(true);

  const [templateSections, setTemplateSections] = useState([]);
  const [templateLoading, setTemplateLoading] = useState(false);

  /* ================= 1. BUSCAR PATH COMPLETO ================= */
  useEffect(() => {
    let isMounted = true;

    const resolveData = async () => {
      if (!fullPath) {
        if (isMounted) setResolvingData(false);
        return;
      }

      if (isMounted) {
        setResolvingData(true);
        setError(null);
      }

      // Limpiamos el path por si acaso (quitamos slashes al inicio o final si la DB no los tiene)
      // Esto asegura que "colegios/mi-colegio" coincida con "colegios/mi-colegio"
      const cleanPath = normalizePath(fullPath);
      const institutionPathCandidates = getInstitutionPathCandidates(cleanPath);

      const [foundResearch, foundInstitutionResults, foundArticle] =
        await Promise.all([
          researchRepository.findByPath(cleanPath),
          Promise.all(
            institutionPathCandidates.map((candidate) =>
              institutionRepository.findByPath(candidate),
            ),
          ),
          articleRepository.findBySlug(cleanPath),
        ]);
      const foundInstitution = foundInstitutionResults.find(Boolean);

      if (foundResearch) {
        if (!isMounted) return;
        setData(foundResearch);
        setDataType("research");
        setError(null);
        setResolvingData(false);
        return;
      }

      if (foundInstitution) {
        const { data: currentInstitution } = await client.models.Institution.get(
          { id: foundInstitution.id },
          { authMode: "apiKey" },
        );

        if (!isMounted) return;
        setData(currentInstitution || foundInstitution);
        setDataType("institution");
        setError(null);
        setResolvingData(false);
        return;
      }

      if (foundArticle) {
        if (!isMounted) return;
        setData(foundArticle);
        setDataType("article");
        setError(null);
        setResolvingData(false);
        return;
      }

      const fallbackResult = await resolveByListFallback(cleanPath);

      if (fallbackResult) {
        if (!isMounted) return;
        setData(fallbackResult.data);
        setDataType(fallbackResult.dataType);
        setError(null);
        setResolvingData(false);
        return;
      }

      // 3. No encontrado
      if (!isMounted) return;
      setData(null);
      setDataType(null);
      setError("Página no encontrada");
      setResolvingData(false);
    };

    resolveData().catch((error) => {
      console.error("Error resolving template data", error);
      if (!isMounted) return;
      setData(null);
      setDataType(null);
      setError("Página no encontrada");
      setResolvingData(false);
    });

    return () => {
      isMounted = false;
    };
  }, [fullPath]);

  /* ================= 2. CARGAR TEMPLATE ================= */
  useEffect(() => {
    let isMounted = true;

    const loadTemplate = async () => {
      if (!data?.id || !dataType) {
        setTemplateSections([]);
        return;
      }

      setTemplateLoading(true);

      try {
        let template = null;

        if (dataType === "research") {
          template = await templateRepository.getByResearchId(data.id);
        } else if (dataType === "institution") {
          template = await templateRepository.getByInstitutionId(data.id);
        } else if (dataType === "article") {
          template = await templateRepository.getByArticlenId(data.id);
        }

        if (!template?.themeSettings) {
          if (isMounted) setTemplateSections([]);
          return;
        }

        const parsed = JSON.parse(template.themeSettings);

        if (isMounted) {
          setTemplateSections(Array.isArray(parsed) ? parsed : []);
        }
      } catch (e) {
        console.error("Error loading template", e);
        if (isMounted) setTemplateSections([]);
      } finally {
        if (isMounted) setTemplateLoading(false);
      }
    };

    loadTemplate();

    return () => {
      isMounted = false;
    };
  }, [data, dataType]);

  /* ================= RENDERIZADO ================= */
  if (resolvingData) {
    return (
      <Box className="flex justify-center items-center min-h-screen">
        <Preloader />
      </Box>
    );
  }

  if (error || !data) {
    return <NotFoundPage />;
  }

  // 🟢 RENDER DE CONTENIDO
  return (
    <Container maxWidth={false} disableGutters className="">
      {/* Header */}
      {/* <Box className="md:flex items-center gap-6 mb-4">
                <Box className="flex items-center gap-2">
                    <Typography variant="h4" className="font-bold text-red-700">
                        {data.title || data.name}
                    </Typography>

                    {data.dateRange && (
                        <Chip label={data.dateRange} color="primary" />
                    )}
                    {dataType === 'institution' && (
                        <Chip label={data.type || "Institución"} color="secondary" variant="outlined" />
                    )}
                </Box>
            </Box> */}

      {/* Template / Builder */}
      {templateLoading && (
        <Box className="flex justify-center my-6">
          <Preloader />
        </Box>
      )}

      {!templateLoading && templateSections.length > 0 ? (
        // Asegúrate que tu PageRenderer acepte "research" (por legacy) o "data"
        // Si tu componente interno espera 'research', le pasamos 'data' en ese prop
        <PageRenderer sections={templateSections} research={data} />
      ) : (
        !templateLoading && (
          <Box className="py-10 border-2 border-dashed border-gray-200 rounded-xl bg-gray-50 text-center">
            <Typography color="text.secondary">
              Este sitio existe pero aún no tiene diseño configurado.
            </Typography>
          </Box>
        )
      )}

      {/* <Box className='mt-3' sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 2, justifyContent: 'center' }}>
                <Button
                    variant="outlined"
                    size="large"
                    startIcon={<ArrowLeft size={20} />}
                    onClick={() => navigate(-1)}
                    sx={{
                        textTransform: 'none',
                        borderRadius: 2,
                        borderColor: '#cbd5e1',
                        color: '#475569',
                        '&:hover': { borderColor: '#94a3b8', bgcolor: '#f1f5f9' }
                    }}
                >
                    Regresar
                </Button>

                <Button
                    variant="contained"
                    size="large"
                    startIcon={<Home size={20} />}
                    onClick={() => navigate('/')}
                    disableElevation
                    sx={{
                        textTransform: 'none',
                        borderRadius: 2,
                        bgcolor: '#dc2626', // Rojo
                        '&:hover': { bgcolor: '#b91c1c' }
                    }}
                >
                    Ir al Inicio
                </Button>
            </Box> */}
    </Container>
  );
};

export default TemplateDetail;
