import { Resend } from 'resend';
import BlogEmail from '../emails/BlogEmail.jsx';

// Check for API key
if (!process.env.VITE_RESEND_API_KEY) {
  console.error('❌ VITE_RESEND_API_KEY not found in environment variables');
}

const resend = new Resend(process.env.VITE_RESEND_API_KEY);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { title, content, author, featuredImage, subscriberEmails } = req.body;

    // Validate required fields
    if (!title || !content || !subscriberEmails || !Array.isArray(subscriberEmails)) {
      return res.status(400).json({
        error: 'Missing required fields: title, content, subscriberEmails (array)'
      });
    }

    // Check if Resend is configured
    if (!process.env.VITE_RESEND_API_KEY) {
      console.error('❌ VITE_RESEND_API_KEY not configured');
      return res.status(500).json({
        error: 'Email service not configured. Please check VITE_RESEND_API_KEY environment variable.'
      });
    }

    // Send email to all subscribers
    const emailPromises = subscriberEmails.map(email => {
      console.log(`📧 Sending blog email to: ${email}`);
      return resend.emails.send({
        from: 'Biovance <noreply@biovance.com>',
        to: email,
        subject: `🧬 ${title}`,
        react: BlogEmail({
          title,
          content,
          author: author || 'Biovance Team',
          featuredImage: featuredImage || 'https://rwwmyvrjvlibpzyqzxqg.supabase.co/storage/v1/object/public/test-bucket/myanmar_tm5_2004349_lrg.jpg'
        }),
      });
    });

    const results = await Promise.allSettled(emailPromises);

    // Count successes and failures
    const successful = results.filter(result => result.status === 'fulfilled').length;
    const failed = results.filter(result => result.status === 'rejected').length;

    console.log(`📧 Email campaign sent: ${successful} successful, ${failed} failed`);

    if (failed > 0) {
      const failedResults = results.filter(r => r.status === 'rejected');
      console.error('Failed sends:', failedResults.map(r => r.reason));
    }

    res.status(200).json({
      success: true,
      message: `Email sent to ${successful} subscribers`,
      stats: { successful, failed, total: subscriberEmails.length }
    });

  } catch (error) {
    console.error('Error sending blog email:', error);
    res.status(500).json({
      error: 'Failed to send email',
      details: error.message
    });
  }
}