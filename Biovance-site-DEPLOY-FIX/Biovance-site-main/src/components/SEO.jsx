import { useEffect } from 'react'

const SEO = ({
  title,
  description,
  keywords,
  image,
  url,
  type = 'website',
  author,
  published,
  modified,
  section,
  tags,
  articleData
}) => {
  // Base configuration
  const siteName = 'Biovance'
  const siteUrl = 'https://biovance.ai'
  const defaultImage = 'https://biovance.ai/assets/myanmar_tm5_2004349_lrg.jpg'
  const defaultDescription = 'Exploring the intelligence of nature through AI-powered conservation research. Join our mission to protect biodiversity using cutting-edge machine learning and ecological insights.'

  // Construct full title
  const fullTitle = title ? `${title} | ${siteName}` : `${siteName} - AI That Learns from Nature | Conservation Research`

  // Construct full URL
  const fullUrl = url ? `${siteUrl}${url}` : siteUrl

  // Construct full image URL
  const fullImage = image ? (image.startsWith('http') ? image : `${siteUrl}${image}`) : defaultImage

  // Use provided description or default
  const metaDescription = description || defaultDescription

  // Keywords
  const metaKeywords = keywords || 'AI conservation, biodiversity research, machine learning ecology, nature intelligence, environmental technology, conservation AI, ecological research'

  // Generate structured data
  const generateStructuredData = () => {
    const baseData = {
      "@context": "https://schema.org",
      "@type": type,
      "name": title || siteName,
      "url": fullUrl,
      "description": metaDescription,
      "image": fullImage
    }

    if (type === 'article' && articleData) {
      return {
        ...baseData,
        "@type": "Article",
        "headline": title,
        "author": {
          "@type": "Person",
          "name": author || "Biovance Team"
        },
        "publisher": {
          "@type": "Organization",
          "name": siteName,
          "logo": {
            "@type": "ImageObject",
            "url": defaultImage
          }
        },
        "datePublished": published,
        "dateModified": modified || published,
        "mainEntityOfPage": {
          "@type": "WebPage",
          "@id": fullUrl
        },
        "articleSection": section || "Conservation Research",
        "keywords": tags || []
      }
    }

    if (type === 'website') {
      return {
        ...baseData,
        "publisher": {
          "@type": "Organization",
          "name": siteName,
          "logo": {
            "@type": "ImageObject",
            "url": defaultImage
          }
        },
        "potentialAction": {
          "@type": "SearchAction",
          "target": `${siteUrl}/search?q={search_term_string}`,
          "query-input": "required name=search_term_string"
        }
      }
    }

    return baseData
  }

  useEffect(() => {
    // Update document title
    document.title = fullTitle

    // Helper function to update or create meta tag
    const updateMetaTag = (name, content, property = false) => {
      const attribute = property ? 'property' : 'name'
      let element = document.querySelector(`meta[${attribute}="${name}"]`)

      if (element) {
        element.setAttribute('content', content)
      } else {
        element = document.createElement('meta')
        element.setAttribute(attribute, name)
        element.setAttribute('content', content)
        document.head.appendChild(element)
      }
    }

    // Helper function to update or create link tag
    const updateLinkTag = (rel, href) => {
      let element = document.querySelector(`link[rel="${rel}"]`)

      if (element) {
        element.setAttribute('href', href)
      } else {
        element = document.createElement('link')
        element.setAttribute('rel', rel)
        element.setAttribute('href', href)
        document.head.appendChild(element)
      }
    }

    // Basic Meta Tags
    updateMetaTag('description', metaDescription)
    updateMetaTag('keywords', metaKeywords)
    updateMetaTag('author', author || siteName)

    // Canonical URL
    updateLinkTag('canonical', fullUrl)

    // Open Graph
    updateMetaTag('og:title', fullTitle, true)
    updateMetaTag('og:description', metaDescription, true)
    updateMetaTag('og:image', fullImage, true)
    updateMetaTag('og:url', fullUrl, true)
    updateMetaTag('og:type', type, true)
    updateMetaTag('og:site_name', siteName, true)
    updateMetaTag('og:locale', 'en_US', true)

    // Twitter Cards
    updateMetaTag('twitter:card', 'summary_large_image')
    updateMetaTag('twitter:title', fullTitle)
    updateMetaTag('twitter:description', metaDescription)
    updateMetaTag('twitter:image', fullImage)

    // Article specific meta tags
    if (type === 'article') {
      if (published) updateMetaTag('article:published_time', published, true)
      if (modified) updateMetaTag('article:modified_time', modified, true)
      if (author) updateMetaTag('article:author', author, true)
      if (section) updateMetaTag('article:section', section, true)
      if (tags) {
        tags.forEach(tag => {
          updateMetaTag('article:tag', tag, true)
        })
      }
    }

    // Additional SEO meta tags
    updateMetaTag('robots', 'index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1')
    updateMetaTag('googlebot', 'index, follow')

    // Mobile optimization
    updateMetaTag('format-detection', 'telephone=no')
    updateMetaTag('mobile-web-app-capable', 'yes')
    updateMetaTag('apple-mobile-web-app-capable', 'yes')
    updateMetaTag('apple-mobile-web-app-status-bar-style', 'default')
    updateMetaTag('apple-mobile-web-app-title', siteName)

    // Theme color
    updateMetaTag('theme-color', '#36A476')
    updateMetaTag('msapplication-TileColor', '#36A476')

    // Structured Data
    let structuredDataScript = document.querySelector('script[type="application/ld+json"]')
    if (structuredDataScript) {
      structuredDataScript.textContent = JSON.stringify(generateStructuredData())
    } else {
      structuredDataScript = document.createElement('script')
      structuredDataScript.type = 'application/ld+json'
      structuredDataScript.textContent = JSON.stringify(generateStructuredData())
      document.head.appendChild(structuredDataScript)
    }

    // Breadcrumbs structured data for articles
    if (type === 'article') {
      const breadcrumbsData = {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": [
          {
            "@type": "ListItem",
            "position": 1,
            "name": "Home",
            "item": siteUrl
          },
          {
            "@type": "ListItem",
            "position": 2,
            "name": "Updates",
            "item": `${siteUrl}/updates`
          },
          {
            "@type": "ListItem",
            "position": 3,
            "name": title,
            "item": fullUrl
          }
        ]
      }

      let breadcrumbsScript = document.querySelector('script[data-breadcrumbs]')
      if (breadcrumbsScript) {
        breadcrumbsScript.textContent = JSON.stringify(breadcrumbsData)
      } else {
        breadcrumbsScript = document.createElement('script')
        breadcrumbsScript.type = 'application/ld+json'
        breadcrumbsScript.setAttribute('data-breadcrumbs', 'true')
        breadcrumbsScript.textContent = JSON.stringify(breadcrumbsData)
        document.head.appendChild(breadcrumbsScript)
      }
    }

  }, [title, description, keywords, image, url, type, author, published, modified, section, tags])

  return null // This component doesn't render anything
}

export default SEO