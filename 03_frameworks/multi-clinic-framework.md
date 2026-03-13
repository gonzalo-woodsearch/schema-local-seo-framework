# Framework de Implementación: Cadena de Clínicas (Multi-Ubicación)

## Principio Central

Cada ubicación es una entidad independiente en el grafo de conocimiento de Google.
La homepage actúa como nodo padre que conecta todas las entidades.

---

## Arquitectura de URLs Requerida

```
https://www.CLINICA.es/                    ← Página de marca (Organization)
https://www.CLINICA.es/madrid-salamanca/   ← Página de sucursal (Dentist)
https://www.CLINICA.es/madrid-centro/      ← Página de sucursal (Dentist)
https://www.CLINICA.es/madrid-norte/       ← Página de sucursal (Dentist)
```

**Regla:** Cada sucursal DEBE tener su propia URL. Sin páginas de ubicación dedicadas = sin señales locales independientes.

---

## Arquitectura de Schema por Tipo de Página

### Homepage (Página de Marca)

```json
{
  "@type": "Organization",
  "@id": "https://www.CLINICA.es/#Organization",
  "subOrganization": [
    { "@id": "https://www.CLINICA.es/madrid-salamanca/#Dentist" },
    { "@id": "https://www.CLINICA.es/madrid-centro/#Dentist" },
    { "@id": "https://www.CLINICA.es/madrid-norte/#Dentist" }
  ]
}
```

### Página de Sucursal

```json
{
  "@type": "Dentist",
  "@id": "https://www.CLINICA.es/madrid-salamanca/#Dentist",
  "parentOrganization": {
    "@id": "https://www.CLINICA.es/#Organization"
  }
}
```

---

## Reglas Críticas Multi-Ubicación

### 1. @id único por sucursal
```
CORRECTO:
  Madrid Salamanca: https://www.CLINICA.es/madrid-salamanca/#Dentist
  Madrid Centro:    https://www.CLINICA.es/madrid-centro/#Dentist
  Madrid Norte:     https://www.CLINICA.es/madrid-norte/#Dentist

INCORRECTO:
  Las tres sucursales con el mismo @id
```

### 2. URL específica por sucursal
Cada sucursal debe tener su propio `url` apuntando a su página dedicada.
NO usar la homepage para todas las ubicaciones.

### 3. NAP diferente por sucursal
- `telephone` diferente por sucursal (o al menos número de extensión)
- `address` completamente diferente por sucursal
- `geo` con coordenadas propias de cada ubicación

### 4. subOrganization vs branchOf
| Propiedad | Dónde | Cuándo |
|-----------|-------|--------|
| `subOrganization` | Organization (homepage) | Siempre que haya páginas dedicadas por sucursal |
| `parentOrganization` | Dentist (cada sucursal) | Para conectar de vuelta al nodo padre |
| `branchOf` | Dentist | Solo si NO hay páginas dedicadas (fallback) |

### 5. Employee/Physicians por sucursal
Cada doctor debe tener `worksFor` apuntando al `@id` de SU sucursal,
no al `@id` de la Organization general.

---

## Diagrama de Entidades

```
[Organization: CLINICA]
   @id: /es/#Organization
   ├── subOrganization → [Dentist: Madrid Salamanca]
   │                        @id: /madrid-salamanca/#Dentist
   │                        parentOrganization → /es/#Organization
   │                        employee → [Person: Dr. García]
   │                        hasOfferCatalog → Servicios
   │
   ├── subOrganization → [Dentist: Madrid Centro]
   │                        @id: /madrid-centro/#Dentist
   │                        parentOrganization → /es/#Organization
   │                        employee → [Person: Dra. López]
   │                        hasOfferCatalog → Servicios
   │
   └── subOrganization → [Dentist: Madrid Norte]
                            @id: /madrid-norte/#Dentist
                            parentOrganization → /es/#Organization
                            employee → [Person: Dr. Martín]
                            hasOfferCatalog → Servicios
```

---

## Schema de OfferCatalog: Enfoque por Sucursal vs Global

### Opción A: OfferCatalog en cada sucursal (recomendado)
Cada Dentist tiene su propio `hasOfferCatalog`. Ventaja: señales de relevancia local específicas.

### Opción B: OfferCatalog centralizado en Organization
La Organization tiene el catálogo global y cada Dentist hace referencia vía `@id`.
Útil cuando todos los centros ofrecen exactamente los mismos servicios.

```json
{
  "@type": "Organization",
  "@id": "https://www.CLINICA.es/#Organization",
  "hasOfferCatalog": {
    "@type": "OfferCatalog",
    "@id": "https://www.CLINICA.es/#GlobalServices",
    "name": "Tratamientos Dentales"
  }
}

{
  "@type": "Dentist",
  "@id": "https://www.CLINICA.es/madrid-salamanca/#Dentist",
  "hasOfferCatalog": {
    "@id": "https://www.CLINICA.es/#GlobalServices"
  }
}
```

---

## Checklist Multi-Ubicación

### Arquitectura:
- [ ] URL dedicada por cada sucursal
- [ ] `@id` único por cada sucursal (no duplicados)
- [ ] Organization con `subOrganization[]` listando todos los `@id` de sucursales
- [ ] Cada Dentist con `parentOrganization` apuntando a Organization `@id`

### Por cada sucursal:
- [ ] `address` único (dirección exacta)
- [ ] `telephone` único o distinto
- [ ] `geo` con coordenadas propias (5+ decimales)
- [ ] `openingHoursSpecification` propio (pueden variar por sucursal)
- [ ] `aggregateRating` propio (reseñas de ESA sucursal específica)
- [ ] `sameAs` con GBP CID de ESA sucursal (no el GBP general)
- [ ] `employee` con doctores de ESA sucursal
- [ ] `hasOfferCatalog` propio

### GBP (Google Business Profile):
- [ ] GBP independiente por sucursal
- [ ] NAP del GBP IDÉNTICO al del schema
- [ ] URL del GBP apuntando a la página dedicada de la sucursal
- [ ] `sameAs` en schema incluye `google.com/maps?cid=` de CADA sucursal

---

## Errores Frecuentes en Multi-Ubicación

| Error | Impacto | Corrección |
|-------|---------|-----------|
| Schema genérico en homepage para todas las sucursales | Google no puede diferenciar ubicaciones | Páginas dedicadas + schema único por sucursal |
| Mismo `@id` en todas las sucursales | Colisión de entidades en Knowledge Graph | `@id` único basado en URL de cada sucursal |
| `aggregateRating` global para todas las ubicaciones | Datos incorrectos, posible penalización | AggregateRating específico por sucursal |
| `sameAs` general (sin CID de la sucursal específica) | Señales locales débiles | CID de GBP específico por sucursal |
| Sin `parentOrganization` en las sucursales | Desconexión del grafo de conocimiento | Siempre conectar sucursal → Organization |
