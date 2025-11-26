import { useEffect } from 'react';

/**
 * SEO Component - Manages dynamic meta tags and structured data
 * Updates document head elements dynamically for better SEO
 */
const SEO = ({ 
  title, 
  description, 
  image, 
  url,
  type = 'website',
  structuredData
}) => {
  const defaultTitle = 'Impact Point Church | Kenyan Church in Indianapolis, IN - Where Faith Meets Purpose';
  const defaultDescription = 'Impact Point Church - A vibrant Kenyan church in Indianapolis, IN. Join our welcoming community for inspiring worship services, engaging sermons, community events, and meaningful ministries. Making a lasting impact in our community through faith and purpose.';

  // Update meta tags dynamically
  useEffect(() => {
    // Get base URL safely
    const getBaseUrl = () => {
      if (typeof window !== 'undefined') {
        return window.location.origin;
      }
      return 'https://impactpointchurch.org';
    };
    
    const defaultUrl = getBaseUrl();
    const defaultImage = `${defaultUrl}/assets/logo-header.png`;
    
    const seoTitle = title ? `${title} | Impact Point Church` : defaultTitle;
    const seoDescription = description || defaultDescription;
    const seoImage = image || defaultImage;
    const seoUrl = url || defaultUrl;

    // Organization structured data
    const organizationSchema = {
      '@context': 'https://schema.org',
      '@type': 'Church',
      '@id': `${defaultUrl}#organization`,
      name: 'Impact Point Church',
      alternateName: 'Kenyan Church Indianapolis',
      url: defaultUrl,
      logo: {
        '@type': 'ImageObject',
        url: `${defaultUrl}/assets/logo-header.png`,
        width: 512,
        height: 512
      },
      image: seoImage,
      description: 'Impact Point Church - A vibrant Kenyan church in Indianapolis, IN. Making a lasting impact in our community through faith and purpose.',
      address: {
        '@type': 'PostalAddress',
        streetAddress: '546 E 17th St #100',
        addressLocality: 'Indianapolis',
        addressRegion: 'IN',
        postalCode: '46202',
        addressCountry: 'US'
      },
      contactPoint: {
        '@type': 'ContactPoint',
        telephone: '+1-317-555-7729',
        contactType: 'Customer Service',
        email: 'info@impactpointchurch.org',
        availableLanguage: 'English'
      },
      sameAs: [
        // Add social media URLs here when available
        // 'https://www.facebook.com/impactpointchurch',
        // 'https://www.instagram.com/impactpointchurch',
        // 'https://www.youtube.com/@impactpointchurch'
      ],
      openingHours: [
        'Mo-Fr 09:00-17:00',
        'Sa 10:00-14:00'
      ],
      priceRange: 'Free',
      areaServed: {
        '@type': 'City',
        name: 'Indianapolis'
      }
    };

    // LocalBusiness schema for better local SEO
    const localBusinessSchema = {
      '@context': 'https://schema.org',
      '@type': 'LocalBusiness',
      '@id': `${defaultUrl}#localbusiness`,
      name: 'Impact Point Church - Kenyan Church in Indianapolis',
      image: seoImage,
      telephone: '+1-317-555-7729',
      priceRange: 'Free',
      address: {
        '@type': 'PostalAddress',
        streetAddress: '546 E 17th St #100',
        addressLocality: 'Indianapolis',
        addressRegion: 'IN',
        postalCode: '46202',
        addressCountry: 'US'
      },
      geo: {
        '@type': 'GeoCoordinates',
        latitude: 39.790563,
        longitude: -86.150016
      },
      openingHoursSpecification: [
        {
          '@type': 'OpeningHoursSpecification',
          dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
          opens: '09:00',
          closes: '17:00'
        },
        {
          '@type': 'OpeningHoursSpecification',
          dayOfWeek: 'Saturday',
          opens: '10:00',
          closes: '14:00'
        }
      ],
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: '5',
        reviewCount: '10'
      }
    };

    // Place of Worship schema
    const placeOfWorshipSchema = {
      '@context': 'https://schema.org',
      '@type': 'PlaceOfWorship',
      name: 'Impact Point Church - Kenyan Church in Indianapolis',
      url: defaultUrl,
      address: {
        '@type': 'PostalAddress',
        streetAddress: '546 E 17th St #100',
        addressLocality: 'Indianapolis',
        addressRegion: 'IN',
        postalCode: '46202',
        addressCountry: 'US'
      },
      geo: {
        '@type': 'GeoCoordinates',
        latitude: 39.790563,
        longitude: -86.150016
      },
      openingHours: [
        'Mo-Fr 09:00-17:00',
        'Sa 10:00-14:00',
        'Su 09:00-12:00'
      ]
    };

    // Breadcrumb schema for navigation
    const breadcrumbSchema = {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: 'Home',
          item: defaultUrl
        }
      ]
    };

    // Combine all schemas
    const allSchemas = [
      organizationSchema,
      localBusinessSchema,
      placeOfWorshipSchema,
      breadcrumbSchema,
      ...(structuredData || [])
    ];
    // Update document title
    document.title = seoTitle;

    // Helper function to update or create meta tag
    const updateMetaTag = (attribute, value, content) => {
      let element = document.querySelector(`meta[${attribute}="${value}"]`);
      if (!element) {
        element = document.createElement('meta');
        element.setAttribute(attribute, value);
        document.head.appendChild(element);
      }
      element.setAttribute('content', content);
    };

    // Update primary meta tags
    updateMetaTag('name', 'title', seoTitle);
    updateMetaTag('name', 'description', seoDescription);
    updateMetaTag('name', 'keywords', 'Kenyan church, Kenyan church Indianapolis, Kenyan church in Indiana, Impact Point Church, church Indianapolis, worship services, Christian church, church in Indiana, faith community, sermons, Bible study, community outreach, church ministries, Sunday service, Indianapolis church, Christian community, church events, African church Indianapolis, Kenyan Christian community');

    // Update Open Graph tags
    updateMetaTag('property', 'og:title', seoTitle);
    updateMetaTag('property', 'og:description', seoDescription);
    updateMetaTag('property', 'og:image', seoImage);
    updateMetaTag('property', 'og:url', seoUrl);
    updateMetaTag('property', 'og:type', type);

    // Update Twitter Card tags
    updateMetaTag('name', 'twitter:card', 'summary_large_image');
    updateMetaTag('name', 'twitter:title', seoTitle);
    updateMetaTag('name', 'twitter:description', seoDescription);
    updateMetaTag('name', 'twitter:image', seoImage);

    // Update canonical URL
    let canonicalLink = document.querySelector('link[rel="canonical"]');
    if (!canonicalLink) {
      canonicalLink = document.createElement('link');
      canonicalLink.setAttribute('rel', 'canonical');
      document.head.appendChild(canonicalLink);
    }
    canonicalLink.setAttribute('href', seoUrl);

    // Add structured data (JSON-LD)
    const existingScripts = document.querySelectorAll('script[type="application/ld+json"]');
    existingScripts.forEach(script => {
      // Remove old structured data scripts that we added
      if (script.dataset.seoComponent === 'true') {
        script.remove();
      }
    });

    allSchemas.forEach((schema, index) => {
      const script = document.createElement('script');
      script.type = 'application/ld+json';
      script.dataset.seoComponent = 'true';
      script.textContent = JSON.stringify(schema);
      document.head.appendChild(script);
    });

    // Cleanup function
    return () => {
      // Clean up structured data scripts on unmount
      const scriptsToRemove = document.querySelectorAll('script[data-seo-component="true"]');
      scriptsToRemove.forEach(script => script.remove());
    };
  }, [title, description, image, url, type, structuredData, defaultTitle, defaultDescription]);

  // This component doesn't render anything visible
  return null;
};

export default SEO;

