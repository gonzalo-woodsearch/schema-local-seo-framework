# Entity Relationship Graph — Schema Architecture

## Complete Entity Graph (Dental Chain)

```
══════════════════════════════════════════════════════════════════
NIVEL 0: BRAND / IDENTITY
══════════════════════════════════════════════════════════════════

[Organization]                          ← Brand entity (homepage)
 ├── @id: domain.es/#Organization
 ├── name: "BRAND NAME"
 ├── legalName
 ├── sameAs: [social, directories]
 ├── founder → [Person]                 ← Leadership trust signal
 └── subOrganization: [@ids of all locations]


══════════════════════════════════════════════════════════════════
NIVEL 1: LOCATIONS
══════════════════════════════════════════════════════════════════

[Dentist] (location page)
 ├── @id: domain.es/CITY/#Dentist       ← Unique per location
 ├── parentOrganization → Organization  ← Connects to brand
 ├── address → [PostalAddress]
 ├── geo → [GeoCoordinates]
 ├── telephone
 ├── openingHoursSpecification[]
 ├── aggregateRating → [AggregateRating]
 ├── hasOfferCatalog → [OfferCatalog]
 ├── employee → [Person+Physician][]
 ├── areaServed → [City/Place][]
 └── sameAs → [GBP CID, Doctoralia, etc.]


══════════════════════════════════════════════════════════════════
NIVEL 2: SERVICES
══════════════════════════════════════════════════════════════════

[OfferCatalog] (service categories)
 └── itemListElement:
      [OfferCatalog] "Implantología"
       └── [Offer] → [Service] "Implante Dental"   → URL (service page)
       └── [Offer] → [Service] "All-on-4"           → URL (service page)
      [OfferCatalog] "Ortodoncia"
       └── [Offer] → [Service] "Alineadores"        → URL (service page)
      [OfferCatalog] "Estética Dental"
       └── [Offer] → [Service] "Blanqueamiento"     → URL (service page)


══════════════════════════════════════════════════════════════════
NIVEL 2: PRACTITIONERS
══════════════════════════════════════════════════════════════════

[Person + Physician]
 ├── @id: domain.es/equipo/DR-SLUG/#Person
 ├── worksFor → Dentist @id               ← Connects to location
 ├── medicalSpecialty: "Dentistry"
 ├── hasCredential → [EducationalOccupationalCredential][]
 ├── memberOf → [Organization]            ← Colegio de Dentistas
 ├── knowsAbout: [...]
 └── sameAs: [Top Doctors, Doctoralia]


══════════════════════════════════════════════════════════════════
NIVEL 3: WEB STRUCTURE
══════════════════════════════════════════════════════════════════

[WebSite]
 ├── @id: domain.es/#WebSite
 ├── publisher → Organization @id
 └── potentialAction → [SearchAction]

[WebPage] (location page)
 ├── isPartOf → WebSite
 ├── about → Dentist @id
 └── breadcrumb → [BreadcrumbList]

[WebPage] (service page)
 ├── isPartOf → WebSite
 ├── about → Service @id
 ├── provider → Dentist @id
 └── breadcrumb → [BreadcrumbList]

[WebPage] (doctor page)
 ├── isPartOf → WebSite
 ├── about → Person @id
 └── breadcrumb → [BreadcrumbList]

[BlogPosting / Article] (blog)
 ├── author → Person @id              ← Doctor as author (E-E-A-T)
 ├── publisher → Organization @id
 ├── about → [MedicalCondition]
 └── breadcrumb → [BreadcrumbList]
```

---

## Cross-Entity Reference Map

| Entity | References | Via property |
|--------|-----------|--------------|
| Organization | Dentist locations | `subOrganization` |
| Dentist | Organization | `parentOrganization` |
| Dentist | Person/Physician | `employee` |
| Dentist | OfferCatalog | `hasOfferCatalog` |
| Person | Dentist | `worksFor` |
| Offer | Service | `itemOffered` |
| Service | WebPage (service URL) | `url` |
| WebPage | WebSite | `isPartOf` |
| WebPage | Dentist/Service/Person | `about` |
| BlogPosting | Person | `author` |
| BlogPosting | MedicalCondition | `about` |

---

## Signal Flow: How Entities Reinforce Each Other

```
Google Maps Reviews
        ↓
GBP (Google Business Profile)
        ↓ ← sameAs reconciliation
[Dentist Entity]
        ↓
 ┌──────┴──────┐
 ↓             ↓
[Services]  [Practitioners]
 ↓             ↓
[FAQs]     [Blog Posts]     ← Doctor-authored content
 ↓             ↓
AI Overviews + Featured Snippets + SERP Rich Results
```

The stronger each entity node and the clearer each connection,
the more confidently Google can place the business in local and organic results.
