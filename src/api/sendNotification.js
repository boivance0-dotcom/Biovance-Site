import { supabase } from '../lib/supabase';
import { Resend } from 'resend';
import BlogEmailTemplate from '../emails/BlogEmailTemplate';

export async function notifyAllMembers(blog) {
  console.log('🚀 Sending blog notification to all waitlist members:', blog.title);

  try {
    // Fetch all waitlist member emails
    const { data: members, error } = await supabase
      .from('waitlist')
      .select('email, name')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('❌ Error fetching waitlist members:', error);
      throw new Error('Failed to fetch waitlist member emails');
    }

    if (!members || members.length === 0) {
      console.warn('⚠️ No waitlist members found in database.');
      return { success: true, message: 'No waitlist members to notify', count: 0 };
    }

    console.log(`📧 Found ${members.length} waitlist members to notify`);

    // Initialize Resend with API key
    const resend = new Resend(import.meta.env.VITE_RESEND_API_KEY);

    let successCount = 0;
    let failureCount = 0;
    const failedEmails = [];

    // Send email to each member with 200ms delay between sends
    for (let i = 0; i < members.length; i++) {
      const { email } = members[i];

      try {
        console.log(`📤 Sending to ${email}...`);

        await resend.emails.send({
          from: 'Biovance <no-reply@biovance.ai>',
          to: email,
          subject: `🧬 New Blog: ${blog.title}`,
          react: BlogEmailTemplate({
            title: blog.title,
            excerpt: generateExcerpt(blog.content),
            image: blog.featured_image || 'https://rwwmyvrjvlibpzyqzxqg.supabase.co/storage/v1/object/public/test-bucket/myanmar_tm5_2004349_lrg.jpg',
            url: `https://biovance.ai/blog/${generateSlug(blog.title)}`,
          }),
        });

        console.log(`✅ Successfully sent to ${email}`);
        successCount++;

        // Wait 200ms between sends to prevent throttling
        if (i < members.length - 1) {
          await new Promise(resolve => setTimeout(resolve, 200));
        }

      } catch (err) {
        console.error(`❌ Failed to send to ${email}:`, err.message);
        failureCount++;
        failedEmails.push(email);
      }
    }

    const result = {
      success: failureCount === 0,
      message: `Notifications sent: ${successCount} successful, ${failureCount} failed`,
      count: members.length,
      successful: successCount,
      failed: failureCount,
      failedEmails: failedEmails.length > 0 ? failedEmails : undefined
    };

    console.log(`🎉 Notification campaign complete:`, result);
    return result;

  } catch (error) {
    console.error('💥 Error in notifyAllMembers:', error);
    throw error;
  }
}

// Helper function to generate excerpt from HTML content
function generateExcerpt(content) {
  if (!content) return 'Check out our latest insights on AI and nature conservation.';

  // Remove HTML tags and get first 150 characters
  const textContent = content.replace(/<[^>]*>/g, '').trim();
  const excerpt = textContent.substring(0, 150);

  // Add ellipsis if truncated
  return excerpt.length < textContent.length ? excerpt + '...' : excerpt;
}

// Helper function to generate URL slug from title
function generateSlug(title) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single
    .trim();
}