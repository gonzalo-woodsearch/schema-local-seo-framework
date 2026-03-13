#!/usr/bin/env node
/**
 * Schema JSON-LD Generator — CLI
 * Uso: node schema-gen.js <config.json> [--output ./carpeta-salida]
 *
 * Genera todos los schemas JSON-LD para una clínica dental
 * basándose en un archivo de configuración JSON.
 */

const fs   = require('fs');
const path = require('path');

// ─── CLI ARGS ────────────────────────────────────────────────
const args = process.argv.slice(2);
if (!args.length || args[0] === '--help' || args[0] === '-h') {
  console.log(`
  ╔══════════════════════════════════════════════════════╗
  ║   Schema JSON-LD Generator — CLI                    ║
  ║   Clínicas Dentales · Local SEO                     ║
  ╚══════════════════════════════════════════════════════╝

  Uso:
    node schema-gen.js <config.json>
    node schema-gen.js <config.json> --output ./mi-carpeta

  Ejemplos:
    node schema-gen.js config-cleardent-salamanca.json
    node schema-gen.js config.json --output ./schemas-generados

  El generador crea estos archivos:
    dentist.json          ← Schema Dentist (entidad principal)
    organization.json     ← Organization + WebSite (si es cadena)
    service-[slug].json   ← Un archivo por cada servicio con URL
    person-[slug].json    ← Un archivo por cada doctor
    all-in-one.json       ← Todos los schemas en un @graph
`);
  process.exit(0);
}

const configPath = path.resolve(args[0]);
const outputIdx  = args.indexOf('--output');
const outputDir  = outputIdx >= 0 ? path.resolve(args[outputIdx + 1]) : path.join(path.dirname(configPath), 'output');

// ─── LOAD CONFIG ─────────────────────────────────────────────
if (!fs.existsSync(configPath)) {
  console.error(`\n  ✗ No se encontró el archivo: ${configPath}\n`);
  process.exit(1);
}

let config;
try {
  config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
} catch (e) {
  console.error(`\n  ✗ Error al parsear el JSON: ${e.message}\n`);
  process.exit(1);
}

// ─── UTILS ───────────────────────────────────────────────────
const slug    = s => (s || '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
const clean   = obj => JSON.parse(JSON.stringify(obj, (k, v) => v === undefined || v === null || v === '' ? undefined : v));
const baseUrl = url => { try { return new URL('/', url).href; } catch { return ''; } };

function ensureDir(dir) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

function writeSchema(filename, obj) {
  const filePath = path.join(outputDir, filename);
  const wrapped  = { '@context': 'https://schema.org', ...obj };
  fs.writeFileSync(filePath, JSON.stringify(wrapped, null, 2), 'utf8');
  console.log(`  ✓  ${filename}`);
}

// ─── BUILDERS ────────────────────────────────────────────────

function buildDentist(c) {
  const pageUrl   = c.url || '';
  const dentistId = pageUrl.replace(/\/$/, '') + '/#Dentist';
  const siteBase  = baseUrl(pageUrl);

  const obj = {
    '@type': 'Dentist',
    '@id': dentistId,
    'name': c.name,
    'legalName': c.legalName,
    'description': c.description,
    'url': pageUrl,
    'telephone': c.telephone,
    'email': c.email,
    'priceRange': c.priceRange || '€€',
    'isAcceptingNewPatients': c.isAcceptingNewPatients !== false,
    'medicalSpecialty': 'Dentistry',
    'paymentAccepted': c.paymentAccepted || 'Cash, Credit Card, Bank Transfer, Financing',
    'currenciesAccepted': 'EUR',
  };

  if (siteBase) {
    obj.logo = {
      '@type': 'ImageObject',
      'url': c.logoUrl || siteBase + 'logo.png',
      'width': 300,
      'height': 100
    };
  }

  if (c.images?.length) obj.image = c.images;

  // Address
  if (c.address) {
    obj.address = {
      '@type': 'PostalAddress',
      'streetAddress':   c.address.street,
      'addressLocality': c.address.city,
      'addressRegion':   c.address.region || 'Comunidad de Madrid',
      'postalCode':      c.address.postalCode,
      'addressCountry':  c.address.country || 'ES'
    };
  }

  // Geo
  if (c.geo?.lat && c.geo?.lng) {
    obj.geo = { '@type': 'GeoCoordinates', 'latitude': String(c.geo.lat), 'longitude': String(c.geo.lng) };
  }

  if (c.mapsUrl) obj.hasMap = c.mapsUrl;

  // Opening hours
  if (c.openingHours?.length) {
    obj.openingHoursSpecification = c.openingHours.map(h => ({
      '@type': 'OpeningHoursSpecification',
      'dayOfWeek': Array.isArray(h.days) && h.days.length === 1 ? h.days[0] : h.days,
      'opens': h.opens,
      'closes': h.closes,
      ...(h.validFrom ? { validFrom: h.validFrom } : {}),
      ...(h.validThrough ? { validThrough: h.validThrough } : {}),
    }));
  }

  // Aggregate rating
  if (c.rating?.value && c.rating?.count) {
    obj.aggregateRating = {
      '@type': 'AggregateRating',
      'ratingValue': String(c.rating.value),
      'reviewCount': String(c.rating.count),
      'bestRating':  String(c.rating.best  || 5),
      'worstRating': String(c.rating.worst || 1),
    };
  }

  // Reviews
  if (c.reviews?.length) {
    obj.review = c.reviews.map(r => ({
      '@type': 'Review',
      'author': { '@type': 'Person', 'name': r.author },
      'reviewRating': { '@type': 'Rating', 'ratingValue': String(r.rating), 'bestRating': '5' },
      'reviewBody': r.body,
      'datePublished': r.date
    }));
  }

  // OfferCatalog
  if (c.services?.length) {
    obj.hasOfferCatalog = {
      '@type': 'OfferCatalog',
      'name': c.serviceCatalogName || 'Tratamientos Dentales',
      'itemListElement': c.services.map(cat => ({
        '@type': 'OfferCatalog',
        'name': cat.category,
        'itemListElement': (cat.items || []).map(item => ({
          '@type': 'Offer',
          'itemOffered': clean({
            '@type': 'Service',
            'name': item.name,
            'description': item.description,
            'url': item.url,
          })
        }))
      }))
    };
  }

  // Employees
  if (c.employees?.length) {
    obj.employee = c.employees.map(e => {
      const empUrl = e.url || `${pageUrl}equipo/${slug(e.name)}/`;
      const empObj = clean({
        '@type': ['Person', 'Physician'],
        '@id': empUrl.replace(/\/$/, '') + '#Person',
        'name': `${e.prefix || 'Dr.'} ${e.name}`,
        'honorificPrefix': e.prefix || 'Dr.',
        'honorificSuffix': e.suffix,
        'jobTitle': e.title,
        'medicalSpecialty': e.specialty || 'Dentistry',
        'image': e.image,
        'url': empUrl,
        'worksFor': { '@id': dentistId },
        'sameAs': [e.topdoctors, e.doctoralia, e.linkedin].filter(Boolean),
      });
      return empObj;
    });
  }

  // areaServed
  if (c.areaServed?.length) {
    obj.areaServed = c.areaServed.map(a => ({
      '@type': typeof a === 'string' ? 'City' : (a.type || 'City'),
      'name': typeof a === 'string' ? a : a.name
    }));
  }

  // sameAs
  if (c.sameAs?.length) obj.sameAs = c.sameAs;

  // parentOrganization
  if (c.parentOrganizationId) {
    obj.parentOrganization = { '@id': c.parentOrganizationId };
  }

  return clean(obj);
}

function buildWebPage(c) {
  const pageUrl   = c.url || '';
  const dentistId = pageUrl.replace(/\/$/, '') + '/#Dentist';
  const siteBase  = baseUrl(pageUrl);

  const obj = {
    '@type': 'WebPage',
    '@id': pageUrl + '#WebPage',
    'url': pageUrl,
    'name': c.pageTitle || (c.name ? `Dentista en ${c.address?.city || 'Madrid'} | ${c.name}` : undefined),
    'description': c.metaDescription || c.description,
    'inLanguage': 'es',
    'isPartOf': siteBase ? { '@id': siteBase + '#WebSite' } : undefined,
    'about': dentistId ? { '@id': dentistId } : undefined,
  };

  if (c.breadcrumbs?.length) {
    obj.breadcrumb = {
      '@type': 'BreadcrumbList',
      'itemListElement': c.breadcrumbs.map((b, i) => ({
        '@type': 'ListItem',
        'position': i + 1,
        'name': b.name,
        'item': b.url
      }))
    };
  }

  return clean(obj);
}

function buildOrganization(c) {
  const orgBase = c.organizationUrl ? baseUrl(c.organizationUrl) : baseUrl(c.url);
  const orgId   = (c.organizationUrl || orgBase || '').replace(/\/$/, '') + '/#Organization';

  const obj = {
    '@type': 'Organization',
    '@id': orgId,
    'name': c.brandName || c.name,
    'legalName': c.legalName,
    'description': c.brandDescription || c.description,
    'url': c.organizationUrl || orgBase,
    'telephone': c.brandTelephone || c.telephone,
    'email': c.brandEmail || c.email,
    'foundingDate': c.foundingDate,
    'logo': orgBase ? { '@type': 'ImageObject', 'url': c.logoUrl || orgBase + 'logo.png', 'width': 300, 'height': 100 } : undefined,
    'address': c.brandAddress ? {
      '@type': 'PostalAddress',
      'addressLocality': c.brandAddress.city || 'Madrid',
      'addressRegion': c.brandAddress.region || 'Comunidad de Madrid',
      'addressCountry': 'ES'
    } : undefined,
    'founder': c.founder ? {
      '@type': ['Person', 'Physician'],
      '@id': (c.founder.url || '').replace(/\/$/, '') + '#Person',
      'name': c.founder.name,
      'jobTitle': c.founder.title || 'Fundador y Director Médico',
      'medicalSpecialty': 'Dentistry'
    } : undefined,
    'subOrganization': c.branches?.map(b => ({
      '@id': (b.url || '').replace(/\/$/, '') + '/#Dentist',
      'url': b.url,
      'name': b.name
    })),
    'sameAs': c.brandSameAs || c.sameAs,
  };

  return clean(obj);
}

function buildWebSite(c) {
  const siteBase = c.organizationUrl ? baseUrl(c.organizationUrl) : baseUrl(c.url);

  return clean({
    '@type': 'WebSite',
    '@id': siteBase + '#WebSite',
    'url': siteBase,
    'name': c.brandName || c.name,
    'inLanguage': 'es',
    'publisher': { '@id': siteBase.replace(/\/$/, '') + '/#Organization' },
    'potentialAction': {
      '@type': 'SearchAction',
      'target': { '@type': 'EntryPoint', 'urlTemplate': siteBase + '?s={search_term_string}' },
      'query-input': 'required name=search_term_string'
    }
  });
}

function buildServicePage(c, cat, item) {
  const pageUrl = item.url;
  if (!pageUrl) return null;
  const dentistId = (c.url || '').replace(/\/$/, '') + '/#Dentist';
  const siteBase  = baseUrl(c.url);

  return clean({
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebPage',
        '@id': pageUrl + '#WebPage',
        'url': pageUrl,
        'name': `${item.name} en ${c.address?.city || 'Madrid'} | ${c.name}`,
        'description': item.description || `${item.name} en ${c.address?.city || 'Madrid'}.`,
        'inLanguage': 'es',
        'isPartOf': siteBase ? { '@id': siteBase + '#WebSite' } : undefined,
        'about': { '@id': pageUrl + '#Service' },
        'provider': { '@id': dentistId },
      },
      {
        '@type': 'Service',
        '@id': pageUrl + '#Service',
        'name': item.name,
        'serviceType': cat.category,
        'description': item.description,
        'url': pageUrl,
        'provider': { '@id': dentistId },
        'areaServed': (c.areaServed || []).map(a => ({
          '@type': 'City',
          'name': typeof a === 'string' ? a : a.name
        })),
      },
      ...(item.faqs?.length ? [{
        '@type': 'FAQPage',
        '@id': pageUrl + '#FAQPage',
        'mainEntity': item.faqs.map(faq => ({
          '@type': 'Question',
          'name': faq.q,
          'acceptedAnswer': { '@type': 'Answer', 'text': faq.a }
        }))
      }] : [])
    ]
  });
}

function buildPersonPage(c, emp) {
  const empUrl    = emp.url || `${c.url}equipo/${slug(emp.name)}/`;
  const dentistId = (c.url || '').replace(/\/$/, '') + '/#Dentist';
  const siteBase  = baseUrl(c.url);

  return clean({
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': ['Person', 'Physician'],
        '@id': empUrl.replace(/\/$/, '') + '#Person',
        'name': `${emp.prefix || 'Dr.'} ${emp.name}`,
        'honorificPrefix': emp.prefix || 'Dr.',
        'honorificSuffix': emp.suffix,
        'jobTitle': emp.title,
        'description': emp.bio,
        'medicalSpecialty': emp.specialty || 'Dentistry',
        'image': emp.image ? {
          '@type': 'ImageObject',
          'url': emp.image,
          'width': 400,
          'height': 400
        } : undefined,
        'url': empUrl,
        'telephone': emp.telephone,
        'email': emp.email,
        'knowsAbout': emp.knowsAbout,
        'worksFor': { '@type': 'Dentist', '@id': dentistId, 'name': c.name },
        'hasCredential': emp.credentials?.map(cr => ({
          '@type': 'EducationalOccupationalCredential',
          'credentialCategory': cr.category || 'degree',
          'name': cr.name,
          'issuedBy': cr.issuedBy ? { '@type': 'EducationalOrganization', 'name': cr.issuedBy } : undefined
        })),
        'memberOf': emp.memberOf?.map(org => ({
          '@type': 'Organization',
          'name': org.name,
          'url': org.url
        })),
        'alumniOf': emp.alumniOf?.map(edu => ({
          '@type': 'EducationalOrganization',
          'name': edu
        })),
        'award': emp.award,
        'sameAs': [emp.topdoctors, emp.doctoralia, emp.linkedin].filter(Boolean),
      },
      {
        '@type': 'WebPage',
        '@id': empUrl + '#WebPage',
        'url': empUrl,
        'name': `${emp.prefix || 'Dr.'} ${emp.name} — Dentista en ${c.address?.city || 'Madrid'} | ${c.name}`,
        'inLanguage': 'es',
        'isPartOf': siteBase ? { '@id': siteBase + '#WebSite' } : undefined,
        'about': { '@id': empUrl.replace(/\/$/, '') + '#Person' },
      }
    ]
  });
}

// ─── MAIN ────────────────────────────────────────────────────
console.log(`
  ╔══════════════════════════════════════════════════════╗
  ║   Schema JSON-LD Generator                          ║
  ╚══════════════════════════════════════════════════════╝

  Config:  ${configPath}
  Salida:  ${outputDir}
`);

ensureDir(outputDir);
const c = config;
const allGraph = [];

// 1. dentist.json
const dentistSchema = buildDentist(c);
writeSchema('dentist.json', { '@graph': [dentistSchema] });
allGraph.push(dentistSchema);

// 2. webpage.json
const webPageSchema = buildWebPage(c);
writeSchema('webpage.json', { '@graph': [webPageSchema] });
allGraph.push(webPageSchema);

// 3. organization.json (si tiene organizationUrl o isChain)
if (c.organizationUrl || c.isChain || c.branches) {
  const orgSchema     = buildOrganization(c);
  const webSiteSchema = buildWebSite(c);
  writeSchema('organization.json', { '@graph': [orgSchema, webSiteSchema] });
  allGraph.push(orgSchema, webSiteSchema);
}

// 4. service-[slug].json por cada tratamiento con URL
if (c.services?.length) {
  c.services.forEach(cat => {
    (cat.items || []).forEach(item => {
      if (item.url) {
        const svcSchema = buildServicePage(c, cat, item);
        if (svcSchema) {
          writeSchema(`service-${slug(item.name)}.json`, svcSchema);
        }
      }
    });
  });
}

// 5. person-[slug].json por cada doctor
if (c.employees?.length) {
  c.employees.forEach(emp => {
    const personSchema = buildPersonPage(c, emp);
    writeSchema(`person-${slug(emp.name)}.json`, personSchema);
  });
}

// 6. all-in-one.json
const allInOne = { '@context': 'https://schema.org', '@graph': allGraph };
fs.writeFileSync(path.join(outputDir, 'all-in-one.json'), JSON.stringify(allInOne, null, 2), 'utf8');
console.log(`  ✓  all-in-one.json`);

console.log(`
  ✅  Generación completada — ${outputDir}
`);
