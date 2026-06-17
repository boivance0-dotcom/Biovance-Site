// HTML Template for Welcome Email
function createWelcomeEmailHTML(email: string): string {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Welcome to Biovance</title>
    </head>
    <body style="margin: 0; padding: 0; font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #f8fafc;">
      <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #f8fafc;">
        <tr>
          <td align="center" style="padding: 40px 20px;">
            <table width="600" cellpadding="0" cellspacing="0" border="0" style="background-color: #ffffff; border-radius: 12px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
              <!-- Header -->
              <tr>
                <td style="padding: 40px 40px 20px 40px; text-align: center; border-bottom: 1px solid #e2e8f0;">
                  <h1 style="margin: 0; font-size: 28px; font-weight: 700; color: #36A476;">🧬 Biovance</h1>
                  <p style="margin: 8px 0 0 0; font-size: 16px; color: #64748b;">Exploring the Intelligence of Nature</p>
                </td>
              </tr>

              <!-- Content -->
              <tr>
                <td style="padding: 40px;">
                  <h2 style="margin: 0 0 16px 0; font-size: 24px; font-weight: 600; color: #1e293b; text-align: center;">Welcome to Biovance!</h2>
                  <p style="margin: 0 0 24px 0; font-size: 16px; line-height: 1.6; color: #475569; text-align: center;">
                    Thank you for joining our waitlist. You're now part of a community dedicated to exploring the intelligence of nature through AI-powered conservation research.
                  </p>
                  <p style="margin: 0 0 24px 0; font-size: 16px; line-height: 1.6; color: #475569; text-align: center;">
                    We'll keep you updated on our latest discoveries, research breakthroughs, and opportunities to get involved in protecting our planet's biodiversity.
                  </p>

                  <table cellpadding="0" cellspacing="0" border="0" style="margin: 32px auto 0 auto;">
                    <tr>
                      <td>
                        <a href="https://biovance.ai" style="display: inline-block; padding: 14px 28px; background: linear-gradient(135deg, #36A476 0%, #22c55e 100%); color: #ffffff; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 16px; box-shadow: 0 4px 12px rgba(54, 164, 118, 0.3);">
                          Explore Our Research →
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
                    You're receiving this because you joined our waitlist. <a href="#" style="color: #36A476; text-decoration: underline;">Unsubscribe</a>
                  </p>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `
}

// HTML Template for Blog Update Email
function createBlogUpdateEmailHTML(blog: { title: string; excerpt: string; featuredImageURL: string; url: string }): string {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${blog.title}</title>
    </head>
    <body style="margin: 0; padding: 0; font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #f8fafc;">
      <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #f8fafc;">
        <tr>
          <td align="center" style="padding: 40px 20px;">
            <table width="600" cellpadding="0" cellspacing="0" border="0" style="background-color: #ffffff; border-radius: 12px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
              <!-- Header -->
              <tr>
                <td style="padding: 40px 40px 20px 40px; text-align: center; border-bottom: 1px solid #e2e8f0;">
                  <h1 style="margin: 0; font-size: 28px; font-weight: 700; color: #36A476;">🧬 Biovance</h1>
                  <p style="margin: 8px 0 0 0; font-size: 16px; color: #64748b;">Exploring the Intelligence of Nature</p>
                </td>
              </tr>

              <!-- Featured Image -->
              ${blog.featuredImageURL ? `
              <tr>
                <td style="padding: 0;">
                  <img src="${blog.featuredImageURL}" alt="${blog.title}" style="width: 100%; height: 250px; object-fit: cover; border-radius: 8px 8px 0 0;" />
                </td>
              </tr>
              ` : ''}

              <!-- Content -->
              <tr>
                <td style="padding: 40px;">
                  <h2 style="margin: 0 0 16px 0; font-size: 24px; font-weight: 600; color: #36A476; line-height: 1.3;">${blog.title}</h2>
                  <p style="margin: 0 0 24px 0; font-size: 16px; line-height: 1.6; color: #475569;">${blog.excerpt}</p>

                  <table cellpadding="0" cellspacing="0" border="0" style="margin-top: 32px;">
                    <tr>
                      <td>
                        <a href="${blog.url}" style="display: inline-block; padding: 14px 28px; background: linear-gradient(135deg, #36A476 0%, #22c55e 100%); color: #ffffff; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 16px; box-shadow: 0 4px 12px rgba(54, 164, 118, 0.3);">
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
                    You're receiving this because you're on our waitlist. <a href="#" style="color: #36A476; text-decoration: underline;">Unsubscribe</a>
                  </p>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `
}

// HTML Template for Contact Form Email
function createContactFormEmailHTML(contact: { name: string; email: string; subject: string; message: string }): string {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>New Contact Form Submission</title>
    </head>
    <body style="margin: 0; padding: 0; font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #f8fafc;">
      <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #f8fafc;">
        <tr>
          <td align="center" style="padding: 40px 20px;">
            <table width="600" cellpadding="0" cellspacing="0" border="0" style="background-color: #ffffff; border-radius: 12px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
              <!-- Header -->
              <tr>
                <td style="padding: 40px 40px 20px 40px; text-align: center; border-bottom: 1px solid #e2e8f0;">
                  <h1 style="margin: 0; font-size: 28px; font-weight: 700; color: #36A476;">🧬 Biovance</h1>
                  <p style="margin: 8px 0 0 0; font-size: 16px; color: #64748b;">New Contact Form Submission</p>
                </td>
              </tr>

              <!-- Content -->
              <tr>
                <td style="padding: 40px;">
                  <h2 style="margin: 0 0 24px 0; font-size: 20px; font-weight: 600; color: #1e293b;">Contact Details</h2>

                  <table width="100%" cellpadding="0" cellspacing="0" border="0">
                    <tr>
                      <td style="padding: 8px 0; border-bottom: 1px solid #f1f5f9;">
                        <strong style="color: #475569;">Name:</strong>
                        <span style="color: #1e293b; margin-left: 8px;">${contact.name}</span>
                      </td>
                    </tr>
                    <tr>
                      <td style="padding: 8px 0; border-bottom: 1px solid #f1f5f9;">
                        <strong style="color: #475569;">Email:</strong>
                        <span style="color: #1e293b; margin-left: 8px;">${contact.email}</span>
                      </td>
                    </tr>
                    <tr>
                      <td style="padding: 8px 0; border-bottom: 1px solid #f1f5f9;">
                        <strong style="color: #475569;">Subject:</strong>
                        <span style="color: #1e293b; margin-left: 8px;">${contact.subject}</span>
                      </td>
                    </tr>
                  </table>

                  <h3 style="margin: 32px 0 16px 0; font-size: 18px; font-weight: 600; color: #1e293b;">Message:</h3>
                  <div style="background-color: #f8fafc; padding: 20px; border-radius: 8px; border-left: 4px solid #36A476;">
                    <p style="margin: 0; font-size: 16px; line-height: 1.6; color: #475569; white-space: pre-wrap;">${contact.message}</p>
                  </div>

                  <table cellpadding="0" cellspacing="0" border="0" style="margin-top: 32px;">
                    <tr>
                      <td>
                        <a href="mailto:${contact.email}" style="display: inline-block; padding: 14px 28px; background: linear-gradient(135deg, #36A476 0%, #22c55e 100%); color: #ffffff; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 16px; box-shadow: 0 4px 12px rgba(54, 164, 118, 0.3);">
                          Reply to ${contact.name} →
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
                    This message was sent from the Biovance contact form.
                  </p>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `
}

export default {
  async fetch(req: Request, env: any, ctx: any) {
    // Handle CORS
    if (req.method === 'OPTIONS') {
      return new Response(null, {
        status: 204,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type'
        }
      })
    }

    if (req.method !== 'POST') {
      return new Response(JSON.stringify({ error: 'Method not allowed' }), {
        status: 405,
        headers: { 'Content-Type': 'application/json' }
      })
    }

    try {
      const supabaseUrl = env.SUPABASE_URL
      const supabaseServiceKey = env.SUPABASE_SERVICE_ROLE_KEY

      if (!supabaseUrl || !supabaseServiceKey) {
        throw new Error('Missing Supabase environment variables')
      }

      const body = await req.json()

      console.log('📧 Processing email request:', body.type)

      if (body.type === 'welcome') {
        // Send welcome email to single user
        const html = createWelcomeEmailHTML(body.email)

        const auth = `Basic ${btoa(env.MAILJET_API_KEY + ":" + env.MAILJET_API_SECRET)}`

        const mailjetResponse = await fetch('https://api.mailjet.com/v3.1/send', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': auth
          },
          body: JSON.stringify({
            Messages: [
              {
                From: { Email: 'newsletter@biovance.ai', Name: 'Biovance' },
                To: [{ Email: body.email }],
                Subject: 'Welcome to Biovance! 🧬',
                HTMLPart: html
              }
            ]
          })
        })

        if (!mailjetResponse.ok) {
          const errorData = await mailjetResponse.text()
          console.error('❌ Welcome email failed:', errorData)
          throw new Error(`Mailjet API error: ${mailjetResponse.status} - ${errorData}`)
        }

        const result = await mailjetResponse.json()

        // Check Mailjet success status
        if (result.Messages && result.Messages[0] && result.Messages[0].Status !== 'success') {
          console.error('❌ Mailjet reported failure:', result.Messages[0])
          throw new Error('Mailjet delivery failed')
        }

        console.log('✅ Welcome email sent to:', body.email, 'Mailjet result:', result)

      } else if (body.type === 'blog_update') {
        // Fetch waitlist from Supabase REST API
        const waitlistResponse = await fetch(`${supabaseUrl}/rest/v1/waitlist?select=email,name&order=created_at.desc`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${supabaseServiceKey}`,
            'apikey': supabaseServiceKey,
            'Content-Type': 'application/json'
          }
        })

        if (!waitlistResponse.ok) {
          const errorData = await waitlistResponse.text()
          console.error('❌ Failed to fetch waitlist:', errorData)
          throw new Error(`Supabase API error: ${waitlistResponse.status} - ${errorData}`)
        }

        const waitlistMembers = await waitlistResponse.json()

        if (!waitlistMembers || waitlistMembers.length === 0) {
          console.log('⚠️ No waitlist members found')
          return new Response(JSON.stringify({
            success: true,
            message: 'No waitlist members to notify'
          }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
          })
        }

        console.log(`📧 Sending blog update to ${waitlistMembers.length} members`)

        const auth = `Basic ${btoa(env.MAILJET_API_KEY + ":" + env.MAILJET_API_SECRET)}`

        let successCount = 0
        let failureCount = 0

        // Send to each waitlist member
        for (let i = 0; i < waitlistMembers.length; i++) {
          const member = waitlistMembers[i]

          try {
            const html = createBlogUpdateEmailHTML(body.blog)

            const mailjetResponse = await fetch('https://api.mailjet.com/v3.1/send', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': auth
              },
              body: JSON.stringify({
                Messages: [
                  {
                    From: { Email: 'newsletter@biovance.ai', Name: 'Biovance' },
                    To: [{ Email: member.email }],
                    Subject: `🧬 ${body.blog.title}`,
                    HTMLPart: html
                  }
                ]
              })
            })

            if (!mailjetResponse.ok) {
              const errorData = await mailjetResponse.text()
              console.error(`❌ Failed to send to ${member.email}:`, errorData)
              failureCount++
            } else {
              const result = await mailjetResponse.json()

              // Check Mailjet success status
              if (result.Messages && result.Messages[0] && result.Messages[0].Status === 'success') {
                successCount++
                console.log(`✅ Sent to ${member.email}`, 'Mailjet result:', result)
              } else {
                console.error(`❌ Mailjet reported failure for ${member.email}:`, result.Messages[0])
                failureCount++
              }
            }

            // Small delay to prevent rate limiting
            if (i < waitlistMembers.length - 1) {
              await new Promise(resolve => setTimeout(resolve, 100))
            }

          } catch (emailError) {
            console.error(`❌ Failed to send to ${member.email}:`, emailError)
            failureCount++
          }
        }

        console.log(`🎉 Blog update campaign complete: ${successCount} successful, ${failureCount} failed`)

      } else if (body.type === 'contact_form') {
        // Send contact form submission to admin email
        const html = createContactFormEmailHTML(body.contact)

        const auth = `Basic ${btoa(env.MAILJET_API_KEY + ":" + env.MAILJET_API_SECRET)}`

        const mailjetResponse = await fetch('https://api.mailjet.com/v3.1/send', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': auth
          },
          body: JSON.stringify({
            Messages: [
              {
                From: { Email: 'newsletter@biovance.ai', Name: 'Biovance Contact Form' },
                To: [{ Email: 'boivance0@gmail.com' }],
                Subject: `New Contact Form: ${body.contact.subject}`,
                HTMLPart: html
              }
            ]
          })
        })

        if (!mailjetResponse.ok) {
          const errorData = await mailjetResponse.text()
          console.error('❌ Contact form email failed:', errorData)
          throw new Error(`Mailjet API error: ${mailjetResponse.status} - ${errorData}`)
        }

        const result = await mailjetResponse.json()

        // Check Mailjet success status
        if (result.Messages && result.Messages[0] && result.Messages[0].Status !== 'success') {
          console.error('❌ Mailjet reported failure:', result.Messages[0])
          throw new Error('Mailjet delivery failed')
        }

        console.log('✅ Contact form email sent to admin:', 'boivance0@gmail.com', 'Mailjet result:', result)

      } else {
        throw new Error('Invalid email type')
      }

      return new Response(JSON.stringify({ success: true }), {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      })

    } catch (error) {
      console.error('💥 Email function error:', error)
      return new Response(JSON.stringify({
        error: error.message,
        success: false
      }), {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      })
    }
  }
}