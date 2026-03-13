# Discoveries — Schema.org & Local SEO Research

**Last updated:** 2026-03-13

---

## DISCOVERY 1: `Dentist` type activates MedicalBusiness signals

Using `@type: "Dentist"` instead of `LocalBusiness` or `MedicalBusiness` activates:
- Medical entity classification in Knowledge Graph
- YMYL (Your Money or Your Life) content signals
- Eligibility for medical-specific rich results
- `medicalSpecialty` and `isAcceptingNewPatients` properties

**Impact:** More specific type = more precise entity classification = stronger local pack relevance.

---

## DISCOVERY 2: `isAcceptingNewPatients` is increasingly important

As Google integrates AI (AI Overviews, Gemini) into search, conversational queries like
"dentist near me accepting new patients" are filtered by this boolean property.

**Impact:** Clinics with `"isAcceptingNewPatients": true` gain advantage in AI-filtered results.

---

## DISCOVERY 3: `sameAs` with Spanish medical directories creates entity authority

For Spanish dental clinics, the highest-authority `sameAs` links are:
1. `google.com/maps?cid=` (GBP CID URL) — highest trust signal
2. `doctoralia.es` — dominant medical directory in Spain
3. `topdoctors.es` — premium medical directory
4. `facebook.com` — social identity
5. `instagram.com` — additional identity

**Impact:** Google reconciles these external signals to build entity confidence.

---

## DISCOVERY 4: Two-level OfferCatalog architecture outperforms flat lists

Top-ranking dental sites use a hierarchy:
```
OfferCatalog (catalog root: "Tratamientos Dentales")
 └── OfferCatalog (category: "Implantología")
      └── Offer → Service (specific: "Implante Individual")
 └── OfferCatalog (category: "Ortodoncia")
      └── Offer → Service (specific: "Ortodoncia Invisible")
```

This mirrors the website's navigation structure, reinforcing service category understanding.

**Impact:** Stronger service-to-query relevance mapping.

---

## DISCOVERY 5: `AggregateRating` directly increases CTR in SERPs

Star ratings displayed in organic results consistently increase click-through rate.
Top dental clinics with `reviewCount: 100+` dominate SERP CTR.

Key finding: `reviewCount` must reflect only **third-party verified reviews** (Google, Doctoralia).
Self-authored or staff reviews can trigger quality actions.

**Impact:** Real reviews + correct markup = SERP CTR advantage.

---

## DISCOVERY 6: Multi-typing `["Person", "Physician"]` for practitioners

Using multi-type `["Person", "Physician"]` unlocks a broader property set vs using `Person` alone:
- `medicalSpecialty`
- `isAcceptingNewPatients`
- Medical directory `sameAs` links
- E-E-A-T authority signals for YMYL content

**Impact:** Doctor profiles with `Physician` type directly reinforce E-E-A-T signals.

---

## DISCOVERY 7: Schema consistency with GBP is non-negotiable

Any mismatch between:
- Schema `name` vs GBP business name
- Schema `address` vs GBP address
- Schema `telephone` vs GBP phone
- Schema `openingHoursSpecification` vs GBP hours

Results in:
- Schema signals being discounted
- Potential local ranking instability
- Knowledge Panel inconsistencies

**Impact:** NAP consistency across all channels is the foundation of local SEO schema.

---

## DISCOVERY 8: `geo` precision affects local pack accuracy

GeoCoordinates with fewer than 5 decimal places introduce geographic imprecision.
Coordinates should be:
```json
"geo": {
  "latitude": "40.41865",
  "longitude": "-3.69136"
}
```
Not:
```json
"geo": {
  "latitude": "40.4",
  "longitude": "-3.6"
}
```

**Impact:** High-precision coordinates improve Google's ability to rank for hyper-local queries.

---

## DISCOVERY 9: `hasCredential` on Physician entities strengthens E-E-A-T

For YMYL industries (dental/medical), Google's quality raters look for:
- Professional credentials
- Medical degrees
- Specialty certifications
- Association memberships

Schema properties that support this:
- `hasCredential` → `EducationalOccupationalCredential`
- `memberOf` → `Organization` (professional associations)
- `alumniOf` → `EducationalOrganization`
- `award`

**Impact:** Doctor pages with full credential markup reduce YMYL risk signals.

---

## DISCOVERY 10: `FAQPage` on service pages targets featured snippets and AI Overviews

Dental service pages (implants, orthodontics, whitening) with FAQPage schema are eligible for:
- Expandable FAQ rich results (direct SERP real estate)
- AI Overview citations
- Featured snippet consideration

Optimal: 4-7 questions per service page, targeting commercial-intent long-tail queries.

**Impact:** FAQPage increases SERP visibility beyond the standard organic listing.

---

## NEXT RESEARCH QUESTIONS

1. Does `areaServed` with `GeoShape` (polygon) improve local pack radius for dental clinics?
2. Does including `MedicalProcedure` schema on treatment pages improve AI Overview inclusion?
3. Does `department` schema (for multi-specialty within a single clinic) improve category relevance?
4. What is the impact of `openingHoursSpecification` with `validFrom`/`validThrough` on holiday periods?
5. How does schema consistency between GBP and website interact with the Local Pack 3-box?
6. Does `founder` on Organization schema contribute to brand authority?
7. What is the ranking impact of `hasMap` pointing to Google Maps vs Apple Maps vs Waze?
