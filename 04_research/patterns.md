# Schema Patterns — Top-Ranking Dental Clinics

**Last updated:** 2026-03-13

---

## PATTERN 1: Full Dentist Entity Block (Universal Pattern)

Every top-ranking dental clinic implements a complete `Dentist` block with:

```
@type: Dentist (NEVER just LocalBusiness)
@id: [canonical-url]#Dentist
name, url, telephone, address (PostalAddress)
geo (GeoCoordinates, 5+ decimals)
openingHoursSpecification (per-day, not string)
aggregateRating (real reviews only)
hasOfferCatalog (two-level hierarchy)
sameAs (GBP CID + Doctoralia + Top Doctors minimum)
```

**Prevalence:** ~100% of top-3 Local Pack results

---

## PATTERN 2: Hierarchical OfferCatalog (Two Levels)

```json
OfferCatalog "Tratamientos"
  OfferCatalog "Implantología"     ← category
    Offer → Service "Implante Individual"
    Offer → Service "All-on-4"
  OfferCatalog "Ortodoncia"        ← category
    Offer → Service "Alineadores"
    Offer → Service "Brackets"
```

**Why it works:** Mirrors site architecture, creates semantic category→service relationships.
**Prevalence:** Common among established dental chains (Vitaldent, Sanitas Dental, etc.)

---

## PATTERN 3: Multi-location Chain Architecture

```
Homepage: Organization + subOrganization[]
Each location: Dentist + parentOrganization → Organization @id
```

**Key:** Each location has a **dedicated URL** and **unique @id**.
**Prevalence:** All major Spanish dental chains (Vitaldent, Asisa Dental, Sanitas Dental)

---

## PATTERN 4: Practitioner Multi-Type

```json
"@type": ["Person", "Physician"]
```

Combined with:
- `medicalSpecialty: "Dentistry"`
- `hasCredential[]` (university degrees)
- `memberOf` (Colegio de Dentistas)
- `sameAs` (Top Doctors, Doctoralia profiles)

**Why it works:** Unlocks medical-specific properties and builds E-E-A-T.
**Prevalence:** Premium dental clinics (Clínica Dental Colosseum, Institut Marquès, etc.)

---

## PATTERN 5: Service + FAQPage Combination

```
Service page URL
 ├── Service schema (treatment description + AreaServed)
 ├── Offer/OfferCatalog (pricing options)
 └── FAQPage (4-7 questions targeting long-tail commercial queries)
```

**Why it works:** Service+FAQ combo creates two potential SERP appearances (organic + FAQ expandable).
**Prevalence:** Growing, especially for high-value treatments (implants, invisalign)

---

## PATTERN 6: Spanish Directory sameAs Cluster

For Spain, the winning `sameAs` cluster is:

```json
"sameAs": [
  "https://www.google.com/maps?cid=[GBP_CID]",
  "https://www.doctoralia.es/[slug]",
  "https://www.topdoctors.es/[slug]",
  "https://www.facebook.com/[page]",
  "https://www.instagram.com/[profile]"
]
```

Optional additions:
- `paginasamarillas.es`
- `yelp.es`
- `trustpilot.com`

**Why it works:** Google cross-references these to confirm business identity and entity trust.

---

## PATTERN 7: @graph Multi-Schema per Page

Top sites use `@graph` to output multiple schema types in a single JSON-LD block:

```json
{
  "@context": "https://schema.org",
  "@graph": [
    { "@type": "Dentist", ... },
    { "@type": "WebPage", ... },
    { "@type": "BreadcrumbList", ... }
  ]
}
```

**Benefit:** Cleaner JSON-LD, explicit entity relationships, single script tag.

---

## PATTERN 8: BreadcrumbList on All Inner Pages

Every service page, doctor page, and blog post includes:

```json
{
  "@type": "BreadcrumbList",
  "itemListElement": [
    { "position": 1, "name": "Inicio", "item": "/" },
    { "position": 2, "name": "[Section]", "item": "/section/" },
    { "position": 3, "name": "[Page]", "item": "/section/page/" }
  ]
}
```

**Why it works:** Breadcrumbs appear in SERP URL display, improving CTR and navigation understanding.

---

## PATTERN 9: WebPage connecting all entities

```json
{
  "@type": "WebPage",
  "isPartOf": { "@id": "[WebSite @id]" },
  "about": { "@id": "[Service or Person @id]" },
  "provider": { "@id": "[Dentist @id]" }
}
```

The `about` and `provider` properties create explicit entity connections between the page and the business/service/person it describes.

---

## PATTERN 10: OpeningHoursSpecification (Not String)

Top-ranking sites always use the structured form:
```json
"openingHoursSpecification": [
  {
    "@type": "OpeningHoursSpecification",
    "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
    "opens": "09:00",
    "closes": "20:00"
  }
]
```

NOT the legacy string form:
```json
"openingHours": ["Mo-Fr 09:00-20:00"]  ← Deprecated, avoid
```

---

## Anti-Patterns (What to Avoid)

| Anti-Pattern | Why It Fails |
|-------------|-------------|
| `@type: LocalBusiness` for dental | Too generic, misses medical entity signals |
| Flat OfferCatalog (no categories) | No semantic service hierarchy |
| `aggregateRating` with <5 reviews | Appears manipulative, may be discounted |
| Same @id for multiple locations | Entity collision in Knowledge Graph |
| Schema on page that contradicts page content | Google discounts contradictory markup |
| `review` with "Author: Admin" | Fake review signal, quality risk |
| Duplicate schema blocks on the same page | Confusing to parsers, may cause errors |
| Missing `@id` on Person entities | Entities cannot be de-duplicated or referenced |
