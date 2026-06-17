export default {
  async fetch(request, env) {
    // Handle CORS preflight
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        status: 204,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "POST, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type"
        }
      });
    }

    // Only allow POST
    if (request.method !== 'POST') {
      return new Response('Method Not Allowed', { status: 405 });
    }

    try {
      const body = await request.json();

      // Check API key
      if (!env.RESEND_API_KEY) {
        return new Response(JSON.stringify({ error: 'API key missing' }), {
          status: 500,
          headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" }
        });
      }

      // Send email
      const { Resend } = await import('resend');
      const resend = new Resend(env.RESEND_API_KEY);

      // Generate HTML content with featured image
      const htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>${body.title}</title>
        </head>
        <body style="margin: 0; padding: 0; font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #f8fafc;">
          <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #f8fafc;">
            <tr>
              <td align="center" style="padding: 40px 20px;">
                <table width="600" cellpadding="0" cellspacing="0" border="0" style="background-color: #ffffff; border-radius: 12px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
                  <!-- Header -->
                  <tr>
                    <td style="padding: 40px 40px 20px 40px; text-align: center; border-bottom: 1px solid #e2e8f0;">
                      <h1 style="margin: 0; font-size: 28px; font-weight: 700; color: #0f593e;">🧬 Biovance</h1>
                      <p style="margin: 8px 0 0 0; font-size: 16px; color: #64748b;">Exploring the Intelligence of Nature</p>
                    </td>
                  </tr>

                  <!-- Featured Image -->
                  ${body.featuredImage ? `
                  <tr>
                    <td style="padding: 0;">
                      <img src="${body.featuredImage}" alt="${body.title}" style="width: 100%; height: 250px; object-fit: cover; border-radius: 8px 8px 0 0;" />
                    </td>
                  </tr>
                  ` : ''}

                  <!-- Content -->
                  <tr>
                    <td style="padding: 40px;">
                      <h2 style="margin: 0 0 16px 0; font-size: 24px; font-weight: 600; color: #1e293b; line-height: 1.3;">${body.title}</h2>
                      <p style="margin: 0 0 24px 0; font-size: 16px; line-height: 1.6; color: #475569;">${body.excerpt}</p>

                      <table cellpadding="0" cellspacing="0" border="0" style="margin-top: 32px;">
                        <tr>
                          <td>
                            <a href="${body.url}" style="display: inline-block; padding: 14px 28px; background: linear-gradient(135deg, #0f593e 0%, #15803d 100%); color: #ffffff; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 16px; box-shadow: 0 4px 12px rgba(15, 89, 62, 0.3); transition: all 0.2s ease;">
                              Read Full Article →
                            </a>
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>

                  <!-- Footer -->
                  <tr>
                    <td style="padding: 32px 40px; background-color: #f8fafc; border-top: 1px solid #e2e8f0; text-align: center; border-radius: 0 0 12px 12px;">
                      <p style="margin: 0; font-size: 14px; color: #64748b;">
                        Stay connected with Biovance for the latest in AI-powered conservation research.
                      </p>
                      <p style="margin: 8px 0 0 0; font-size: 12px; color: #94a3b8;">
                        You're receiving this because you're on our waitlist. <a href="#" style="color: #0f593e; text-decoration: underline;">Unsubscribe</a>
                      </p>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        </body>
        </html>
      `;

      const result = await resend.emails.send({
        from: 'Biovance <no-reply@biovance.ai>',
        to: [body.to],
        subject: body.subject || `🧬 ${body.title}`,
        html: htmlContent
      });

      return new Response(JSON.stringify({
        success: true,
        result,
        stats: { successful: 1, failed: 0 }
      }), {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*"
        }
      });

    } catch (error) {
      console.error('Email send error:', error);
      return new Response(JSON.stringify({ error: error.message }), {
        status: 500,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*"
        }
      });
    }
  }
};