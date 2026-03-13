# Schema.org Entity Hierarchy — Dental & Medical Clinics

## Type Inheritance Chain

```
Thing
 └── Organization
      └── LocalBusiness
           └── MedicalBusiness         ← 24 subtypes
                └── Dentist            ← USE THIS for dental clinics
```

```
Thing
 └── Person
      └── Physician                    ← For doctors with medical specialties
```

```
Thing
 └── Intangible
      └── Service                      ← For treatment landing pages
           └── Offer                   ← Pricing wrapper
                └── OfferCatalog       ← Service categories
```

---

## MedicalBusiness Subtypes (24)

| Subtype | Use case |
|---------|---------|
| `Dentist` | Dental clinics (general and specialist) |
| `MedicalClinic` | General medical clinics |
| `Physician` | Individual doctor practices |
| `Physiotherapy` | Physiotherapy clinics |
| `Optician` / `Optometric` | Eye care |
| `PlasticSurgery` | Aesthetic surgery |
| `Pediatric` | Pediatrics |
| `Psychiatry` | Mental health |
| `Pharmacy` | Pharmacies |
| `Emergency` | Emergency services |

---

## Core Property Map: Dentist

```
Dentist
 ├── @id                       ← Canonical identifier (URL#Dentist)
 ├── name
 ├── legalName
 ├── description
 ├── url                       ← Location-specific URL
 ├── telephone
 ├── email
 ├── priceRange                ← "€€" (max 100 chars)
 ├── isAcceptingNewPatients    ← Boolean (important for AI Search)
 ├── medicalSpecialty          ← "Dentistry"
 │
 ├── address → PostalAddress
 │    ├── streetAddress
 │    ├── addressLocality
 │    ├── addressRegion
 │    ├── postalCode
 │    └── addressCountry       ← "ES"
 │
 ├── geo → GeoCoordinates
 │    ├── latitude             ← 5+ decimal places
 │    └── longitude            ← 5+ decimal places
 │
 ├── hasMap                    ← Google Maps URL
 │
 ├── openingHoursSpecification → OpeningHoursSpecification[]
 │    ├── dayOfWeek[]
 │    ├── opens
 │    └── closes
 │
 ├── logo → ImageObject
 │    ├── url
 │    ├── width
 │    └── height
 │
 ├── image                     ← Clinic photo URL
 │
 ├── aggregateRating → AggregateRating
 │    ├── ratingValue
 │    ├── reviewCount
 │    ├── bestRating
 │    └── worstRating
 │
 ├── review[] → Review
 │    ├── author → Person
 │    ├── reviewRating → Rating
 │    ├── reviewBody
 │    └── datePublished
 │
 ├── hasOfferCatalog → OfferCatalog
 │    └── itemListElement[] → OfferCatalog (category)
 │         └── itemListElement[] → Offer
 │              └── itemOffered → Service
 │                   ├── name
 │                   ├── description
 │                   └── url
 │
 ├── employee[] → [Person, Physician]
 │    ├── @id
 │    ├── name
 │    ├── jobTitle
 │    ├── medicalSpecialty
 │    ├── image
 │    ├── url
 │    └── worksFor → @id (Dentist)
 │
 ├── sameAs[]
 │    ├── Google Maps (CID URL)
 │    ├── Doctoralia
 │    ├── Top Doctors
 │    ├── Facebook
 │    └── Instagram
 │
 └── parentOrganization → @id (Organization)    ← For chain locations
```

---

## Multi-Location Entity Graph

```
Organization (brand homepage)
 ├── @id: https://brand.es/#Organization
 ├── sameAs[]
 └── subOrganization[]
      ├── Dentist Madrid
      │    ├── @id: https://brand.es/madrid/#Dentist
      │    ├── parentOrganization → Organization @id
      │    ├── employee[] → Person/Physician
      │    └── hasOfferCatalog → OfferCatalog
      │
      ├── Dentist Barcelona
      │    ├── @id: https://brand.es/barcelona/#Dentist
      │    └── parentOrganization → Organization @id
      │
      └── Dentist Sevilla
           ├── @id: https://brand.es/sevilla/#Dentist
           └── parentOrganization → Organization @id
```

---

## WebPage Hierarchy

```
WebSite (homepage)
 └── BreadcrumbList
      ├── WebPage (location page)
      │    └── BreadcrumbList
      │         ├── WebPage (service page)
      │         │    ├── Service
      │         │    ├── Offer
      │         │    └── FAQPage
      │         └── WebPage (team member page)
      │              └── Person + Physician
      └── WebPage (blog post)
           └── BlogPosting / Article
```

---

## Key Relationships: Summary

| From | Relationship | To |
|------|-------------|-----|
| `Organization` | `subOrganization` | `Dentist` (each branch) |
| `Dentist` | `parentOrganization` | `Organization` |
| `Dentist` | `employee` | `Person` + `Physician` |
| `Person` | `worksFor` | `Dentist` |
| `Dentist` | `hasOfferCatalog` | `OfferCatalog` |
| `OfferCatalog` | `itemListElement` | `Offer` |
| `Offer` | `itemOffered` | `Service` |
| `Service` | `url` | Service landing `WebPage` |
| `Dentist` | `aggregateRating` | `AggregateRating` |
| `Dentist` | `sameAs` | GBP, Doctoralia, Social |
