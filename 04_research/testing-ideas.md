# Testing & Validation — Schema Performance

**Last updated:** 2026-03-13

---

## VALIDATION TOOLS (Use Before Every Deployment)

### 1. Google Rich Results Test
URL: https://search.google.com/test/rich-results

**What to check:**
- No critical errors
- All recommended properties present
- Rich result eligibility confirmed (LocalBusiness, FAQ, Article)

**When to use:** Before and after any schema change

---

### 2. Schema.org Validator
URL: https://validator.schema.org/

**What to check:**
- Property correctness
- Type inheritance validation
- Missing required properties

**When to use:** For deep validation of complex @graph structures

---

### 3. Google Search Console
Path: Enhancements → Local Business / FAQ / Article

**What to check:**
- Number of indexed schema items
- Validation errors and warnings
- Impressions from rich results

**When to use:** Weekly monitoring; daily after major changes

---

## TESTING IDEAS

### TEST 1: Dentist vs LocalBusiness Type Comparison
**Hypothesis:** `@type: Dentist` achieves better local pack positioning vs `@type: LocalBusiness`

**Test setup:**
- Two similar clinics (same city, comparable GBP metrics)
- Clinic A: `@type: Dentist`
- Clinic B: `@type: LocalBusiness`
- Track local pack positions for 60 days

**Metrics:**
- Local Pack appearances (GSC)
- GBP views and clicks
- Organic impressions for dental queries

---

### TEST 2: AggregateRating Impact on CTR
**Hypothesis:** Adding `aggregateRating` markup increases SERP CTR

**Test setup:**
- Single clinic
- Week 1-4: No aggregateRating in schema
- Week 5-8: Add aggregateRating with real review data
- Compare CTR before/after in GSC

**Metrics:**
- CTR (GSC)
- Clicks
- Impressions (to control for ranking changes)

---

### TEST 3: FAQPage on Service Pages
**Hypothesis:** Adding FAQPage schema to treatment pages generates FAQ rich result appearances

**Test setup:**
- Add FAQPage schema to implant page (control: orthodontics page without FAQ schema)
- Track 60 days

**Metrics:**
- FAQ rich result appearances in GSC
- SERP click data
- Featured snippet appearances

---

### TEST 4: isAcceptingNewPatients for AI Search Visibility
**Hypothesis:** `isAcceptingNewPatients: true` improves visibility in AI Overview results

**Test setup:**
- Monitor Google Search for conversational queries: "dentista en [ciudad] aceptando pacientes"
- Track which clinics appear in AI Overview results
- Check if schema has `isAcceptingNewPatients`

**Metrics:**
- Presence in AI Overview results
- Correlation with schema property

---

### TEST 5: hasCredential on Physician Pages for E-E-A-T
**Hypothesis:** Adding `hasCredential` to doctor profiles reduces YMYL risk signals and improves article ranking

**Test setup:**
- Add full `hasCredential` + `memberOf` + `alumniOf` to doctor profiles
- Monitor blog/article rankings for informational dental queries where the doctor is the author
- Compare ranking before/after

**Metrics:**
- Organic ranking of articles where doctor is `author`
- Position in AI Overview citations

---

### TEST 6: sameAs Cluster vs Minimal sameAs
**Hypothesis:** Full sameAs cluster (GBP + Doctoralia + Top Doctors) improves entity authority vs minimal sameAs

**Test setup:**
- Clinic A: `sameAs` with GBP CID only
- Clinic B: `sameAs` with GBP CID + Doctoralia + Top Doctors + social
- Track Knowledge Panel richness and branded query SERP

**Metrics:**
- Knowledge Panel displayed (yes/no)
- Knowledge Panel completeness
- Branded query SERP features

---

## MONITORING CADENCE

| Task | Frequency |
|------|-----------|
| Rich Results Test all key pages | Monthly |
| GSC Enhancements report review | Weekly |
| NAP consistency audit (schema vs GBP vs Doctoralia) | Quarterly |
| Schema update after business changes (hours, address) | Immediately after change |
| Review `aggregateRating` reviewCount accuracy | Monthly |
| New doctor pages: validate schema before publish | Before each publish |

---

## EXPECTED OUTCOMES BY SCHEMA INVESTMENT LEVEL

### Level 1 (Basic):
- Dentist schema on location page
- AggregateRating
- OpeningHoursSpecification

→ Expected: GBP integration, rich snippets for brand queries

### Level 2 (Intermediate):
- Level 1 +
- Service + FAQPage on treatment pages
- Person + Physician on doctor pages
- BreadcrumbList on all inner pages

→ Expected: FAQ rich results, improved E-E-A-T, broader SERP features

### Level 3 (Advanced):
- Level 2 +
- Full @graph architecture with explicit entity connections
- Complete sameAs cluster (GBP, Doctoralia, Top Doctors, social)
- hasCredential on all practitioners
- OfferCatalog two-level hierarchy
- BlogPosting with Physician author markup

→ Expected: Knowledge Panel activation, AI Overview citations, maximum SERP feature coverage
