# Multi-Location Architecture — Dental Chain

## Overview

A dental chain with multiple locations requires a two-tier schema architecture:

```
Tier 1: Brand Entity (Organization)
         — Lives on the homepage
         — Declares all branch @ids via subOrganization

Tier 2: Location Entities (Dentist)
         — Lives on each dedicated location page
         — Each has unique @id, address, geo, phone
         — References brand via parentOrganization
```

---

## Entity Connection Map

```
                    ┌──────────────────────────────┐
                    │    Organization (Brand)       │
                    │    @id: /es/#Organization     │
                    │    subOrganization: [A, B, C] │
                    └──────────┬───────────────────┘
                               │
          ┌────────────────────┼────────────────────┐
          │                    │                    │
          ▼                    ▼                    ▼
┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐
│ Dentist: Madrid │  │ Dentist: Barna  │  │ Dentist: Sevilla│
│ @id: /mad/#Den  │  │ @id: /bcn/#Den  │  │ @id: /sev/#Den  │
│ parentOrg → Org │  │ parentOrg → Org │  │ parentOrg → Org │
│ employee → Dr.A │  │ employee → Dr.B │  │ employee → Dr.C │
│ geo: 40.xxxxx   │  │ geo: 41.xxxxx   │  │ geo: 37.xxxxx   │
│ aggregRating    │  │ aggregRating    │  │ aggregRating    │
└─────────────────┘  └─────────────────┘  └─────────────────┘
         │
         ▼
┌─────────────────────────────┐
│  OfferCatalog (Madrid)      │
│  ├── Implantología          │
│  │    └── Implante, All-on-4│
│  ├── Ortodoncia             │
│  └── Estética               │
└─────────────────────────────┘
```

---

## URL Structure Requirements

| Entity | URL Pattern | Example |
|--------|------------|---------|
| Brand homepage | `/` | `clinicadental.es/` |
| Madrid Salamanca | `/madrid-salamanca/` | `clinicadental.es/madrid-salamanca/` |
| Madrid Centro | `/madrid-centro/` | `clinicadental.es/madrid-centro/` |
| Service (per location) | `/madrid-salamanca/implantes/` | Location-specific service page |
| Doctor | `/equipo/dr-nombre/` | `clinicadental.es/equipo/dr-garcia/` |

---

## @id Naming Convention

| Entity | @id Pattern |
|--------|------------|
| Brand Organization | `https://www.DOMAIN.es/#Organization` |
| Madrid Salamanca Dentist | `https://www.DOMAIN.es/madrid-salamanca/#Dentist` |
| Doctor/Person | `https://www.DOMAIN.es/equipo/dr-NOMBRE/#Person` |
| Service | `https://www.DOMAIN.es/madrid-salamanca/implantes/#Service` |

---

## What Goes on Each Page Type

### Homepage

```json
{
  "@type": "Organization",           // Brand entity
  "subOrganization": [...],          // All branch @ids
  "founder": { ... },                // Leadership E-E-A-T
  "sameAs": [...]                    // Social + directories (global)
}
// + WebSite + SearchAction
```

### Location Page

```json
{
  "@type": "Dentist",                // Full location entity
  "@id": "unique-per-location",      // Never duplicated
  "address": { ... },                // This location's address
  "geo": { ... },                    // This location's GPS
  "telephone": "...",                // This location's phone
  "openingHoursSpecification": [],   // This location's hours
  "aggregateRating": { ... },        // This location's reviews
  "hasOfferCatalog": { ... },        // This location's services
  "employee": [...],                 // This location's doctors
  "sameAs": [GBP-CID-THIS-LOCATION], // This location's GBP
  "parentOrganization": { "@id": "Organization" }
}
```

### Service Page (per location)

```json
[
  { "@type": "WebPage", "provider": { "@id": "Dentist @id" } },
  { "@type": "Service", "areaServed": [...] },
  { "@type": "FAQPage", "mainEntity": [...] }
]
```

---

## When to Use `department` vs `subOrganization`

| Scenario | Use |
|----------|-----|
| Multiple physical locations (branches) | `subOrganization` on Organization |
| Multiple specialties within ONE location | `department` on Dentist |

```json
// Example: Multi-specialty single clinic
{
  "@type": "Dentist",
  "department": [
    {
      "@type": "MedicalClinic",
      "name": "Unidad de Implantología",
      "medicalSpecialty": "Dentistry"
    },
    {
      "@type": "MedicalClinic",
      "name": "Unidad de Ortodoncia",
      "medicalSpecialty": "Dentistry"
    }
  ]
}
```

---

## GBP (Google Business Profile) Alignment

| Schema Property | Must Match GBP |
|----------------|----------------|
| `name` | Business name in GBP |
| `address.streetAddress` | Address in GBP |
| `address.postalCode` | Postal code in GBP |
| `telephone` | Primary phone in GBP |
| `openingHoursSpecification` | Hours in GBP |
| `url` | Website URL in GBP |

NAP mismatch between schema and GBP = schema signals discounted.
