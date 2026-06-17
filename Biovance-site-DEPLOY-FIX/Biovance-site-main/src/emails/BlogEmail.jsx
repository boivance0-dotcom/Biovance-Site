import React from 'react';
import {
  Html,
  Head,
  Body,
  Container,
  Section,
  Text,
  Img,
  Link,
  Hr,
} from '@react-email/components';

const BlogEmail = ({
  title = "Exploring the Intelligence of Nature",
  content = "<p>This is a sample blog post about AI and nature conservation.</p>",
  author = "Biovance Team",
  featuredImage = "https://rwwmyvrjvlibpzyqzxqg.supabase.co/storage/v1/object/public/test-bucket/myanmar_tm5_2004349_lrg.jpg"
}) => {
  return (
    <Html>
      <Head>
        <title>{title}</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>
      <Body style={{
        margin: 0,
        padding: 0,
        backgroundColor: '#f8fafc',
        fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
      }}>
        <Container style={{
          maxWidth: '600px',
          margin: '0 auto',
          backgroundColor: '#ffffff'
        }}>
          {/* Header */}
          <Section style={{
            backgroundColor: '#0b593e',
            padding: '40px 30px',
            textAlign: 'center'
          }}>
            <Text style={{
              fontSize: '28px',
              fontWeight: 'bold',
              color: '#ffffff',
              margin: '0 0 10px 0',
              lineHeight: '1.2'
            }}>
              🧬 Biovance
            </Text>
            <Text style={{
              fontSize: '16px',
              color: '#a7f3d0',
              margin: '0',
              fontWeight: '300'
            }}>
              AI That Learns from Nature
            </Text>
          </Section>

          {/* Featured Image */}
          {featuredImage && (
            <Section style={{ padding: '0' }}>
              <Img
                src={featuredImage}
                alt="Blog featured image"
                style={{
                  width: '100%',
                  height: 'auto',
                  maxHeight: '300px',
                  objectFit: 'cover',
                  borderRadius: '8px 8px 0 0'
                }}
              />
            </Section>
          )}

          {/* Content */}
          <Section style={{
            padding: '40px 30px',
            backgroundColor: '#ffffff'
          }}>
            <Text style={{
              fontSize: '24px',
              fontWeight: 'bold',
              color: '#1f2937',
              margin: '0 0 20px 0',
              lineHeight: '1.3'
            }}>
              {title}
            </Text>

            <Text style={{
              fontSize: '14px',
              color: '#6b7280',
              margin: '0 0 30px 0',
              fontStyle: 'italic'
            }}>
              By {author} • {new Date().toLocaleDateString()}
            </Text>

            <div
              style={{
                fontSize: '16px',
                lineHeight: '1.7',
                color: '#374151'
              }}
              dangerouslySetInnerHTML={{ __html: content }}
            />
          </Section>

          {/* CTA Section */}
          <Section style={{
            backgroundColor: '#f0fdf4',
            padding: '30px',
            textAlign: 'center',
            borderTop: '1px solid #d1fae5'
          }}>
            <Text style={{
              fontSize: '18px',
              fontWeight: '600',
              color: '#065f46',
              margin: '0 0 15px 0'
            }}>
              Ready to explore the intelligence of nature?
            </Text>
            <Link
              href="https://biovance.com"
              style={{
                display: 'inline-block',
                backgroundColor: '#059669',
                color: '#ffffff',
                padding: '12px 30px',
                textDecoration: 'none',
                borderRadius: '8px',
                fontWeight: '600',
                fontSize: '16px',
                marginTop: '10px'
              }}
            >
              Learn More About Biovance
            </Link>
          </Section>

          {/* Footer */}
          <Section style={{
            backgroundColor: '#f9fafb',
            padding: '30px',
            textAlign: 'center',
            borderTop: '1px solid #e5e7eb'
          }}>
            <Text style={{
              fontSize: '14px',
              color: '#6b7280',
              margin: '0 0 15px 0',
              lineHeight: '1.5'
            }}>
              You're receiving this because you're part of our community exploring AI and nature conservation.
            </Text>

            <Link
              href="#"
              style={{
                color: '#059669',
                textDecoration: 'none',
                fontSize: '14px',
                fontWeight: '500'
              }}
            >
              Read more on our website →
            </Link>

            <Hr style={{
              border: 'none',
              borderTop: '1px solid #e5e7eb',
              margin: '20px 0'
            }} />

            <Text style={{
              fontSize: '12px',
              color: '#9ca3af',
              margin: '0',
              lineHeight: '1.4'
            }}>
              © 2024 Biovance. All rights reserved.<br />
              <Link href="#" style={{ color: '#9ca3af', textDecoration: 'underline' }}>Unsubscribe</Link> •
              <Link href="#" style={{ color: '#9ca3af', textDecoration: 'underline', marginLeft: '10px' }}>Privacy Policy</Link>
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
};

export default BlogEmail;