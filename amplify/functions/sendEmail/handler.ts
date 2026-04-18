type SendEmailPayload = {
  emailTitle?: string;
  institutionName?: string;
  description?: string;
  formData?: Record<string, unknown>;
  to?: string[];
  subject?: string;
};

const json = (statusCode: number, body: Record<string, unknown>) => ({
  statusCode,
  headers: {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "*",
    "Access-Control-Allow-Methods": "POST,OPTIONS",
  },
  body: JSON.stringify(body),
});

const escapeHtml = (value: unknown): string => {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
};

const formatLabel = (key: string): string => {
  return key
    .replace(/[_-]+/g, " ")
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/^./, (c) => c.toUpperCase());
};

const formatValue = (value: unknown): string => {
  if (value === null || value === undefined || value === "") {
    return "No enviado";
  }

  if (Array.isArray(value)) {
    return escapeHtml(value.join(", "));
  }

  if (typeof value === "object") {
    return escapeHtml(JSON.stringify(value, null, 2));
  }

  return escapeHtml(value);
};

const buildRows = (formData: Record<string, unknown>) => {
  return Object.entries(formData)
    .filter(([_, value]) => value !== undefined && value !== null && value !== "")
    .map(([key, value], index) => {
      const bg = index % 2 === 0 ? "#ffffff" : "#fafafa";

      return `
        <tr>
          <td style="
            padding: 14px 16px;
            border-bottom: 1px solid #eeeeee;
            background: ${bg};
            width: 38%;
            font-weight: 700;
            color: #222222;
            font-size: 14px;
            vertical-align: top;
          ">
            ${escapeHtml(formatLabel(key))}
          </td>
          <td style="
            padding: 14px 16px;
            border-bottom: 1px solid #eeeeee;
            background: ${bg};
            color: #444444;
            font-size: 14px;
            line-height: 1.5;
          ">
            ${formatValue(value)}
          </td>
        </tr>
      `;
    })
    .join("");
};

const buildHtmlEmail = ({
  emailTitle,
  institutionName,
  description,
  formData,
}: {
  emailTitle: string;
  institutionName: string;
  description: string;
  formData: Record<string, unknown>;
}) => {
  const rows = buildRows(formData);

  return `
  <!DOCTYPE html>
  <html lang="es">
    <head>
      <meta charset="UTF-8" />
      <title>${escapeHtml(emailTitle)}</title>
    </head>
    <body style="
      margin: 0;
      padding: 0;
      background: #f4f4f4;
      font-family: Arial, Helvetica, sans-serif;
      color: #222222;
    ">
      <div style="padding: 32px 16px;">
        <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="max-width: 760px; margin: 0 auto; background: #ffffff; border-radius: 18px; overflow: hidden; box-shadow: 0 8px 30px rgba(0,0,0,0.08);">
          <tr>
            <td style="background: #c00002; padding: 24px 28px;">
              <div style="font-size: 13px; letter-spacing: 2px; text-transform: uppercase; color: rgba(255,255,255,0.82); font-weight: 700;">
                Sapiens Research
              </div>
              <div style="margin-top: 8px; font-size: 28px; line-height: 1.2; color: #ffffff; font-weight: 800;">
                ${escapeHtml(emailTitle)}
              </div>
              <div style="margin-top: 8px; font-size: 15px; color: rgba(255,255,255,0.92);">
                ${escapeHtml(institutionName)}
              </div>
              <div style="margin-top: 8px; font-size: 15px; color: rgba(255,255,255,0.92);">
                ${escapeHtml(description)}
              </div>
            </td>
          </tr>

          <tr>
            <td style="padding: 26px 28px 10px 28px;">
              <div style="font-size: 16px; color: #1f2937; font-weight: 700; margin-bottom: 14px;">
                Información enviada desde el formulario
              </div>

              <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="
                border: 1px solid #eeeeee;
                border-radius: 14px;
                overflow: hidden;
                border-collapse: separate;
                border-spacing: 0;
              ">
                ${rows || `
                  <tr>
                    <td style="padding: 18px; color: #666666; font-size: 14px;">
                      No se recibieron campos del formulario.
                    </td>
                  </tr>
                `}
              </table>
            </td>
          </tr>

          <tr>
            <td style="padding: 22px 28px 28px 28px;">
              <div style="
                border-top: 1px solid #eeeeee;
                padding-top: 18px;
                text-align: center;
                font-size: 13px;
                color: #6b7280;
              ">
                Research conectado siempre
              </div>
            </td>
          </tr>
        </table>
      </div>
    </body>
  </html>
  `;
};

export const handler = async (event: any) => {
  try {
    if (event.httpMethod === "OPTIONS") {
      return json(200, { ok: true });
    }

    const body: SendEmailPayload =
      typeof event.body === "string" ? JSON.parse(event.body) : event.body || {};

    const {
      emailTitle = "Nuevo formulario recibido",
      institutionName = "Sapiens Research",
      description = "",
      formData = {},
      to = [],
      subject,
    } = body;

    if (!Array.isArray(to) || to.length === 0) {
      return json(400, {
        success: false,
        message: "Debes enviar al menos un correo destino",
      });
    }

    if (!formData || typeof formData !== "object" || Array.isArray(formData)) {
      return json(400, {
        success: false,
        message: "formData debe ser un objeto",
      });
    }

    const toFormatted = to.map((email) => ({ email }));

    const htmlContent = buildHtmlEmail({
      emailTitle,
      institutionName,
      description,
      formData,
    });
    
    const response = await fetch("https://api.brevo.com/v3/smtp/email", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "api-key": process.env.BREVO_API_KEY!,
      },
      body: JSON.stringify({
        sender: {
          email: process.env.BREVO_SENDER_EMAIL!,
          name: process.env.BREVO_SENDER_NAME || "Sapiens Research",
        },
        to: toFormatted,
        subject: subject || emailTitle,
        htmlContent,
      }),
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      console.error("Brevo error:", data);

      return json(502, {
        success: false,
        message: "Error enviando correo",
        provider: "brevo",
        error: data,
      });
    }

    return json(200, {
      success: true,
      message: "Correo enviado correctamente",
      provider: "brevo",
    });
  } catch (error) {
    console.error("sendEmail error:", error);

    return json(500, {
      success: false,
      message: "Error interno al enviar el correo",
    });
  }
};