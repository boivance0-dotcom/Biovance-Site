import { supabase } from '../lib/supabase';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { email } = req.query;

  if (!email) {
    return res.status(400).json({ error: 'Email parameter is required' });
  }

  try {
    // Update the member to mark as unsubscribed
    const { data, error } = await supabase
      .from('members')
      .update({ unsubscribed: true })
      .eq('email', email)
      .select();

    if (error) {
      console.error('Error unsubscribing user:', error);
      return res.status(500).json({ error: 'Failed to unsubscribe' });
    }

    if (!data || data.length === 0) {
      return res.status(404).json({ error: 'Email not found in our records' });
    }

    console.log(`✅ User unsubscribed: ${email}`);

    // Return a simple HTML page confirming unsubscription
    res.setHeader('Content-Type', 'text/html');
    res.status(200).send(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Unsubscribed - Biovance</title>
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <style>
            body {
              font-family: Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
              background-color: #f8fafc;
              margin: 0;
              padding: 20px;
              display: flex;
              justify-content: center;
              align-items: center;
              min-height: 100vh;
            }
            .container {
              background: white;
              padding: 40px;
              border-radius: 12px;
              box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
              text-align: center;
              max-width: 500px;
            }
            .logo {
              font-size: 28px;
              font-weight: bold;
              color: #0b593e;
              margin-bottom: 20px;
            }
            h1 {
              color: #1f2937;
              margin-bottom: 16px;
            }
            p {
              color: #6b7280;
              line-height: 1.6;
              margin-bottom: 24px;
            }
            .btn {
              display: inline-block;
              background: #059669;
              color: white;
              padding: 12px 24px;
              text-decoration: none;
              border-radius: 8px;
              font-weight: 500;
              transition: background 0.2s;
            }
            .btn:hover {
              background: #047857;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="logo">🧬 Biovance</div>
            <h1>Successfully Unsubscribed</h1>
            <p>You have been successfully unsubscribed from Biovance notifications. You will no longer receive email updates about our latest blog posts and research.</p>
            <p>If you change your mind, you can always join our community again through our website.</p>
            <a href="https://biovance.ai" class="btn">Visit Biovance</a>
          </div>
        </body>
      </html>
    `);

  } catch (error) {
    console.error('Unexpected error in unsubscribe:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}