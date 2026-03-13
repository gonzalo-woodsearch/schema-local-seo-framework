# Framework de Implementación: Clínica Dental Única

## Visión General

Este framework cubre la arquitectura completa de schema para una clínica dental individual (no cadena) con:
- Página principal
- Páginas de servicios
- Página del equipo / doctores
- Blog / contenido

---

## 1. Página Principal de la Clínica (Homepage / Location Page)

### Schema a implementar:
1. `Dentist` (completo — ver `02_json-ld/dentist-single-location.json`)
2. `WebSite` + `SearchAction`

### Propiedades críticas:
| Propiedad | Obligatoria | Notas |
|-----------|-------------|-------|
| `@type: Dentist` | SI | Nunca usar solo `LocalBusiness` |
| `@id` | SI | URL canónica + `#Dentist` |
| `name` | SI | Nombre exacto de la clínica |
| `address` | SI | PostalAddress completo |
| `telephone` | SI | Con prefijo +34 |
| `geo` | SI | 5+ decimales |
| `openingHoursSpecification` | SI | Cada día por separado |
| `aggregateRating` | SI | Si tienes reseñas reales |
| `hasOfferCatalog` | SI | Dos niveles: categoría → servicio |
| `sameAs` | SI | GBP CID, Doctoralia, Top Doctors |
| `isAcceptingNewPatients` | Recomendado | Para AI Search |
| `medicalSpecialty` | Recomendado | "Dentistry" |
| `employee` | Recomendado | Al menos el director clínico |

---

## 2. Páginas de Servicios

### Schema a implementar (por página de tratamiento):
1. `WebPage` (con `breadcrumb`)
2. `Service` (con `areaServed`)
3. `FAQPage` (4-7 preguntas por servicio)

### Ejemplo de estructura por servicio:

```
/implantes-dentales/
 ├── WebPage
 ├── Service → provider: Dentist @id
 ├── Service.hasOfferCatalog → Offer[] (tipos de implante)
 └── FAQPage (preguntas frecuentes de implantes)

/ortodoncia-invisible/
 ├── WebPage
 ├── Service → provider: Dentist @id
 └── FAQPage (preguntas frecuentes de alineadores)

/blanqueamiento-dental/
 ├── WebPage
 ├── Service
 └── FAQPage
```

### Servicios a crear páginas con schema:

**Implantología:**
- Implantes dentales (página principal)
- All-on-4
- All-on-6

**Ortodoncia:**
- Ortodoncia invisible / alineadores
- Brackets metálicos
- Brackets de zafiro

**Estética:**
- Blanqueamiento dental
- Carillas de porcelana
- Diseño de sonrisa

**Odontología General:**
- Limpieza dental
- Empastes
- Endodoncia

**Especialidades:**
- Periodoncia
- Odontopediatría

---

## 3. Página del Equipo / Doctores

### Schema a implementar por doctor:
1. `Person` + `Physician` (multi-tipo)
2. `WebPage` (con `breadcrumb`)

### Propiedades clave por doctor:
- `@id` único (URL del perfil + `#Person`)
- `medicalSpecialty`
- `knowsAbout[]` — lista de especialidades
- `hasCredential[]` — titulaciones
- `worksFor` → Dentist `@id`
- `sameAs` → Top Doctors, Doctoralia, LinkedIn
- `honorificPrefix` ("Dr." / "Dra.")

---

## 4. Blog / Contenido de Salud Dental

### Schema a implementar por artículo:
1. `BlogPosting` o `Article`
2. `BreadcrumbList`

### Propiedades clave para E-E-A-T:
- `author` → Person `@id` (el doctor, no "admin")
- `datePublished` + `dateModified`
- `about` → `MedicalCondition` o `MedicalProcedure`
- `publisher` → Organization `@id`

---

## 5. Checklist de Implementación

### Pre-lanzamiento:
- [ ] Schema Dentist en página principal validado en Rich Results Test
- [ ] GBP sincronizado: nombre, dirección, teléfono y horario IGUAL que en schema
- [ ] NAP idéntico en Doctoralia, Top Doctors, Páginas Amarillas
- [ ] `sameAs` con URL de GBP (google.com/maps?cid=...)
- [ ] `geo` con mínimo 5 decimales
- [ ] `aggregateRating` solo si las reseñas son reales y verificables
- [ ] `isAcceptingNewPatients: true` activo

### Post-lanzamiento:
- [ ] Verificar en Google Search Console → Sección Mejoras
- [ ] Confirmar que aparece en Google Rich Results para el nombre de la clínica
- [ ] Monitorizar errores de schema en GSC cada 30 días

---

## 6. Errores Comunes a Evitar

| Error | Corrección |
|-------|-----------|
| Usar `@type: LocalBusiness` | Usar siempre `@type: Dentist` |
| Un solo schema para todas las páginas | Schema diferente por tipo de página |
| `geo` con 2-3 decimales | Mínimo 5 decimales de precisión |
| `aggregateRating` sin reseñas reales | Solo markup si hay reseñas verificables |
| NAP diferente al de GBP | NAP 100% idéntico en todos los canales |
| `employee` sin `@id` | Siempre incluir `@id` único por persona |
| Sin `sameAs` | Incluir al menos GBP + Doctoralia |
| `hasOfferCatalog` plano (sin categorías) | Dos niveles: categoría → servicio |
