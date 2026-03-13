# Schema.org Local SEO Framework — Dental & Medical Clinics

**Version:** 1.0
**Last updated:** 2026-03-13
**Target:** Dental clinics, medical clinics, local service businesses (Spain/Madrid)

---

## Framework Structure

```
Schema-Local-SEO-Framework/
│
├── 01_architecture/
│   ├── entity-hierarchy.md          ← Schema type hierarchy & relationships
│   ├── multi-location-architecture.md ← Multi-location design patterns
│   └── entity-graph.md              ← Entity relationship map
│
├── 02_json-ld/
│   ├── dentist-single-location.json ← Complete single-location Dentist schema
│   ├── organization-parent.json     ← Parent Organization (chain homepage)
│   ├── dentist-branch.json          ← Branch location Dentist schema
│   ├── person-practitioner.json     ← Doctor/Dentist Person schema
│   ├── service-page.json            ← Service landing page schema
│   ├── faq-page.json                ← FAQ structured data
│   ├── breadcrumb.json              ← BreadcrumbList schema
│   ├── website-searchaction.json    ← WebSite + SearchAction
│   └── article-blogpost.json        ← Blog / Article schema
│
├── 03_frameworks/
│   ├── single-clinic-framework.md   ← Full implementation guide (single clinic)
│   ├── multi-clinic-framework.md    ← Full implementation guide (chain)
│   └── service-page-framework.md    ← Service page schema strategy
│
├── 04_research/
│   ├── discoveries.md               ← Research findings & insights
│   ├── patterns.md                  ← Schema patterns from top-ranking sites
│   └── testing-ideas.md             ← Validation & testing approaches
│
└── README.md                        ← This file
```

---

## Quick Reference: Schema Types by Page

| Page Type | Primary Schema | Supporting Schemas |
|-----------|---------------|-------------------|
| Brand homepage | `Organization` | `WebSite`, `SearchAction` |
| Location page | `Dentist` | `AggregateRating`, `OfferCatalog` |
| Service page | `Service` + `Offer` | `FAQPage`, `BreadcrumbList` |
| Doctor/team page | `Person` + `Physician` | `BreadcrumbList` |
| Blog post | `BlogPosting` / `Article` | `BreadcrumbList` |
| Contact page | `Dentist` (lite) | `PostalAddress`, `GeoCoordinates` |

---

## Critical Rules

1. **Always use `Dentist`** — most specific type, never just `LocalBusiness`
2. **Unique `@id` per location** — never reuse identifiers across branches
3. **NAP consistency** — name/address/phone must match GBP, Doctoralia, Top Doctors
4. **No fabricated reviews** — `review` and `aggregateRating` only if genuinely collected
5. **`geo` minimum 5 decimal places** — precision matters for local signals
6. **`sameAs` includes Spanish directories** — Doctoralia, Top Doctors, GBP CID URL
7. **Multi-location: dedicated page per branch** — each branch needs its own URL
