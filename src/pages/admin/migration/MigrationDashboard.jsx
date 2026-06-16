import React, { useState } from 'react';
import {
    Box,
    Typography,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Button,
    CircularProgress,
    Tabs,
    Tab,
    TablePagination
} from '@mui/material';
import { CheckCircle2, Circle } from 'lucide-react';
import { uploadData } from 'aws-amplify/storage';
import { useMigration } from './hooks/useMigration';

export default function MigrationDashboard({ type = 'article' }) {
    const {
        items,
        loading,
        saveArticle,
        savePage,
        saveTemplate,
        refreshTemplates
    } = useMigration();

    const [actionLoading, setActionLoading] = useState(null);
    const [currentTab, setCurrentTab] = useState(0);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    const isPage = type === 'page';

    const exists = (item) =>
        isPage ? item.existsInPages : item.existsInArticles;

    const cleanHtml = (html) => {
        if (!html) return '';

        const regex = new RegExp('', 'g');

        let cleaned = html.replace(regex, '').trim();

        cleaned = cleaned.replace(
            /<h[1-6][^>]*>[\s\S]*?<\/h[1-6]>/i,
            ''
        );

        return cleaned.trim();
    };

    const generateId = () =>
        Math.random().toString(36).substring(2, 15) +
        Math.random().toString(36).substring(2, 15);

    const processAndMigrateCoverImage = async (wpItem) => {
        let imageUrl = wpItem.featured_image_url;

        if (!imageUrl) {
            const match = (wpItem.content || '').match(
                /<img[^>]+src=["']([^"']+)["']/i
            );

            if (match) imageUrl = match[1];
        }

        let s3Key = null;

        if (imageUrl) {
            try {
                const proxiedUrl = imageUrl.replace(
                    /^https?:\/\/(www\.)?srg\.com\.co/,
                    '/wp-proxy'
                );

                const response = await fetch(proxiedUrl);

                if (!response.ok) {
                    throw new Error(
                        `HTTP error! status: ${response.status}`
                    );
                }

                const blob = await response.blob();

                const ext =
                    imageUrl
                        .split('.')
                        .pop()
                        ?.split(/#|\?/)[0] || 'jpg';

                const s3Path = `${type}s/${wpItem.slug}-cover.${ext}`;

                const result = await uploadData({
                    path: s3Path,
                    data: blob
                }).result;

                s3Key = result.path;
            } catch (error) {
                console.warn(
                    `Error migrando imagen [${wpItem.slug}]`,
                    error
                );
            }
        }

        return { coverKey: s3Key };
    };

    const handleCreateItem = async (wp) => {
        setActionLoading(wp.slug);

        try {
            const { coverKey } =
                await processAndMigrateCoverImage(wp);

            const data = {
                title: wp.title,
                slug: wp.slug,
                isPublished: true,
                coverImage:
                    coverKey ||
                    wp.featured_image_url ||
                    '',
                ...(isPage
                    ? {}
                    : {
                          summary:
                              wp.summary ||
                              wp.title.substring(0, 160),
                          author:
                              wp.author ||
                              'Sapiens Research',
                          category:
                              wp.category?.split(',')[0] ||
                              'General',
                          publishedAt: new Date(
                              wp.publishedAt
                          ).toISOString()
                      })
            };

            if (isPage) {
                await savePage(data);
            } else {
                await saveArticle(data);
            }

            location.reload();
        } catch (error) {
            console.error(
                'Error creando contenido:',
                error
            );
        } finally {
            setActionLoading(null);
        }
    };

    const handleProcessTemplate = async (
        wp,
        isUpdate = false
    ) => {
        const loadingKey = `${wp.slug}-template`;

        setActionLoading(loadingKey);

        try {
            const content = cleanHtml(
                (wp.content || '').replace(
                    /<img[^>]+>/gi,
                    ''
                )
            );

            const coverImageSrc =
                (isPage
                    ? wp.dbPage?.coverImage
                    : wp.dbArticle?.coverImage) ||
                wp.featured_image_url ||
                '';

            const sections = [
                {
                    type: 'ImageSection',
                    id: generateId(),
                    props: {
                        src: coverImageSrc,
                        alt: wp.title
                    }
                },
                {
                    type: 'WysiwygSection',
                    id: generateId(),
                    props: {
                        content
                    }
                }
            ];

            const templateData = {
                themeSettings: JSON.stringify(sections),
                articleId:
                    !isPage && isUpdate
                        ? wp.dbArticle?.id
                        : null,
                pageId:
                    isPage && isUpdate
                        ? wp.dbPage?.id
                        : null
            };

            await saveTemplate(
                templateData,
                isUpdate
                    ? wp.dbTemplate?.id
                    : undefined
            );

            location.reload();
        } catch (error) {
            console.error(
                'Error sincronizando template:',
                error
            );
        } finally {
            setActionLoading(null);
        }
    };

    const filteredItems = items.filter((wp) =>
        currentTab === 0
            ? !exists(wp)
            : exists(wp)
    );

    const paginatedItems = filteredItems.slice(
        page * rowsPerPage,
        page * rowsPerPage + rowsPerPage
    );

    if (loading) {
        return (
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    minHeight: '300px'
                }}
            >
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Box
            sx={{
                p: 4,
                maxWidth: '1200px',
                mx: 'auto'
            }}
        >
            <Typography
                variant="h4"
                fontWeight="bold"
                gutterBottom
            >
                Migración de{' '}
                {isPage ? 'Páginas' : 'Artículos'}
            </Typography>

            <Box
                sx={{
                    borderBottom: 1,
                    borderColor: 'divider',
                    mb: 3
                }}
            >
                <Tabs
                    value={currentTab}
                    onChange={(e, v) => {
                        setCurrentTab(v);
                        setPage(0);
                    }}
                    textColor="error"
                    indicatorColor="error"
                >
                    <Tab
                        label={`Pendientes (${
                            items.filter(
                                (i) => !exists(i)
                            ).length
                        })`}
                    />
                    <Tab
                        label={`Migrados (${
                            items.filter(
                                (i) => exists(i)
                            ).length
                        })`}
                    />
                </Tabs>
            </Box>

            <TableContainer
                component={Paper}
                variant="outlined"
                sx={{ borderRadius: 3 }}
            >
                <Table size="small">
                    <TableHead>
                        <TableRow
                            sx={{
                                bgcolor: 'grey.50'
                            }}
                        >
                            <TableCell
                                sx={{
                                    fontWeight: 'bold'
                                }}
                            >
                                Título
                            </TableCell>

                            <TableCell
                                align="center"
                                sx={{
                                    fontWeight: 'bold'
                                }}
                            >
                                Estado
                            </TableCell>

                            <TableCell
                                align="right"
                                sx={{
                                    fontWeight: 'bold'
                                }}
                            >
                                Acciones
                            </TableCell>
                        </TableRow>
                    </TableHead>

                    <TableBody>
                        {paginatedItems.map((wp) => {
                            const isMigrating =
                                actionLoading ===
                                wp.slug;

                            const isSyncing =
                                actionLoading ===
                                `${wp.slug}-template`;

                            return (
                                <TableRow
                                    key={wp.slug}
                                    hover
                                >
                                    <TableCell>
                                        {wp.title}
                                    </TableCell>

                                    <TableCell align="center">
                                        {exists(wp) ? (
                                            <Tooltip title="Ya existe en la base de datos">
                                                <CheckCircle2
                                                    size={20}
                                                    color="#2e7d32"
                                                />
                                            </Tooltip>
                                        ) : (
                                            <Circle
                                                size={20}
                                                color="#e0e0e0"
                                            />
                                        )}
                                    </TableCell>

                                    <TableCell align="right">
                                        {!exists(
                                            wp
                                        ) ? (
                                            <Button
                                                size="small"
                                                color="error"
                                                disabled={
                                                    isMigrating
                                                }
                                                onClick={() =>
                                                    handleCreateItem(
                                                        wp
                                                    )
                                                }
                                                startIcon={
                                                    isMigrating ? (
                                                        <CircularProgress
                                                            size={
                                                                14
                                                            }
                                                        />
                                                    ) : null
                                                }
                                            >
                                                {isMigrating
                                                    ? 'Migrando...'
                                                    : 'Migrar'}
                                            </Button>
                                        ) : (
                                            <Button
                                                size="small"
                                                disabled={
                                                    isSyncing
                                                }
                                                onClick={() =>
                                                    handleProcessTemplate(
                                                        wp,
                                                        true
                                                    )
                                                }
                                                startIcon={
                                                    isSyncing ? (
                                                        <CircularProgress
                                                            size={
                                                                14
                                                            }
                                                        />
                                                    ) : null
                                                }
                                            >
                                                {isSyncing
                                                    ? 'Sincronizando...'
                                                    : 'Sincronizar Diseño'}
                                            </Button>
                                        )}
                                    </TableCell>
                                </TableRow>
                            );
                        })}
                    </TableBody>
                </Table>

                <TablePagination
                    component="div"
                    count={filteredItems.length}
                    page={page}
                    rowsPerPage={rowsPerPage}
                    onPageChange={(e, p) =>
                        setPage(p)
                    }
                    onRowsPerPageChange={(e) => {
                        setRowsPerPage(
                            parseInt(
                                e.target.value,
                                10
                            )
                        );
                        setPage(0);
                    }}
                    rowsPerPageOptions={[
                        10,
                        25,
                        50,
                        100
                    ]}
                />
            </TableContainer>
        </Box>
    );
}

const Tooltip = ({ title, children }) => (
    <Box
        sx={{
            cursor: 'help',
            display: 'inline-flex'
        }}
        title={title}
    >
        {children}
    </Box>
);