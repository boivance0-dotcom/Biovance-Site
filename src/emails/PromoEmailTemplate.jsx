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

const PromoEmailTemplate = ({
  title = "Limited Time Offer from Biovance",
  content = "<p>Don't miss out on this exclusive opportunity!</p>",
  image = "https://rwwmyvrjvlibpzyqzxqg.supabase.co/storage/v1/object/public/test-bucket/myanmar_tm5_2004349_lrg.jpg",
  ctaText = "Claim Your Offer",
  ctaUrl = "https://biovance.ai",
  email = ""
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
            backgroundColor: '#7c3aed',
            padding: '30px 20px',
            textAlign: 'center'
          }}>
            <Text style={{
              fontSize: '24px',
              fontWeight: 'bold',
              color: '#ffffff',
              margin: '0 0 5px 0',
              lineHeight: '1.2'
            }}>
              🧬 Biovance
            </Text>
            <Text style={{
              fontSize: '14px',
              color: '#ddd6fe',
              margin: '0',
              fontWeight: '300'
            }}>
              Exclusive Opportunity
            </Text>
          </Section>

          {/* Featured Image */}
          {image && (
            <Section style={{ padding: '0' }}>
              <Img
                src={image}
                alt="Promotional image"
                style={{
                  width: '100%',
                  height: 'auto',
                  maxHeight: '300px',
                  objectFit: 'cover',
                  borderRadius: '0'
                }}
              />
            </Section>
          )}

          {/* Content */}
          <Section style={{
            padding: '30px 20px',
            backgroundColor: '#ffffff'
          }}>
            <Text style={{
              fontSize: '24px',
              fontWeight: 'bold',
              color: '#1f2937',
              margin: '0 0 15px 0',
              lineHeight: '1.3',
              textAlign: 'center'
            }}>
              {title}
            </Text>

            <div
              style={{
                fontSize: '16px',
                lineHeight: '1.6',
                color: '#374151',
                textAlign: 'center'
              }}
              dangerouslySetInnerHTML={{ __html: content }}
            />
          </Section>

          {/* CTA Section */}
          <Section style={{
            backgroundColor: '#f3f4f6',
            padding: '30px',
            textAlign: 'center',
            borderTop: '1px solid #d1d5db'
          }}>
            <Link
              href={ctaUrl}
              style={{
                display: 'inline-block',
                backgroundColor: '#7c3aed',
                color: '#ffffff',
                padding: '16px 32px',
                textDecoration: 'none',
                borderRadius: '8px',
                fontWeight: '600',
                fontSize: '18px',
                textAlign: 'center',
                marginTop: '10px',
                boxShadow: '0 4px 6px rgba(124, 58, 237, 0.2)'
              }}
            >
              {ctaText}
            </Link>
          </Section>

          {/* Footer */}
          <Section style={{
            backgroundColor: '#f9fafb',
            padding: '20px',
            textAlign: 'center',
            borderTop: '1px solid #e5e7eb'
          }}>
            <Text style={{
              fontSize: '12px',
              color: '#9ca3af',
              margin: '0 0 10px 0',
              lineHeight: '1.4'
            }}>
              This exclusive offer is available for a limited time.
            </Text>

            <Link
              href={`https://biovance.ai/api/unsubscribe?email=${encodeURIComponent(email)}`}
              style={{
                color: '#059669',
                textDecoration: 'none',
                fontSize: '12px',
                fontWeight: '500'
              }}
            >
              Unsubscribe from promotions
            </Link>

            <Hr style={{
              border: 'none',
              borderTop: '1px solid #e5e7eb',
              margin: '15px 0'
            }} />

            <Text style={{
              fontSize: '11px',
              color: '#9ca3af',
              margin: '0'
            }}>
              © 2024 Biovance. All rights reserved.
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
};

export default PromoEmailTemplate;