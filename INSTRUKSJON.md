# Skribleriforetaket.no — Instruksjon for opplasting og vedlikehold

## Innholdsfortegnelse

1. [Filstruktur](#filstruktur)
2. [Opplasting til Hostinger](#opplasting-til-hostinger)
3. [Slik legger du til nye artikler og anmeldelser](#slik-legger-du-til-nye-artikler-og-anmeldelser)
4. [Slik legger du til nye underkategorier](#slik-legger-du-til-nye-underkategorier)
5. [Slik bytter du ut logoen eller bilder](#slik-bytter-du-ut-logoen-eller-bilder)
6. [Slik oppdaterer du Om-siden](#slik-oppdaterer-du-om-siden)
7. [SEO og Google Search Console](#seo-og-google-search-console)
8. [Vanlige spørsmål](#vanlige-spørsmål)

---

## Filstruktur

```
skribleriforetaket/
├── index.html          ← Forsiden
├── artikler.html       ← Artikkelsiden
├── anmeldelser.html    ← Anmeldelsessiden
├── om.html             ← Om-siden
├── kontakt.html        ← Kontaktsiden
├── 404.html            ← Feilside (ikke funnet)
├── .htaccess           ← Apache-konfigurasjon (bufring, sikkerhet)
├── robots.txt          ← Søkemotordirektiver
├── sitemap.xml         ← Nettstedskart for Google
│
├── css/
│   └── style.css       ← Alt design og layout
│
├── js/
│   ├── komponenter.js  ← Header og footer (felles for alle sider)
│   ├── main.js         ← Meny og filterlogikk
│   ├── forside.js      ← Fremhevede kort på forsiden
│   └── liste.js        ← Kortvisning på artikkel- og anmeldelsessider
│
├── data/
│   └── innhold.js      ← ★ ALLE ARTIKLER OG ANMELDELSER LEGGES HER ★
│
└── assets/
    └── images/
        └── logo.png    ← Logoen
```

---

## Opplasting til Hostinger

### Alternativ 1: Via Hostinger File Manager (enklest)

1. Logg inn på [hPanel](https://hpanel.hostinger.com)
2. Gå til **Filer → Filbehandler**
3. Naviger til `public_html`-mappen
4. Klikk **Last opp** og velg alle filene fra `skribleriforetaket/`-mappen
5. Pass på at filstrukturen er identisk med den over
6. Gå til `https://skribleriforetaket.no` for å verifisere

### Alternativ 2: Via FTP (anbefalt for større oppdateringer)

1. I hPanel: gå til **Filer → FTP-kontoer** og opprett eller finn FTP-bruker
2. Bruk et FTP-program som [FileZilla](https://filezilla-project.org/) (gratis)
3. Koble til med:
   - **Vert:** `ftp.skribleriforetaket.no`
   - **Brukernavn:** FTP-brukernavnet fra hPanel
   - **Passord:** FTP-passordet
   - **Port:** 21
4. Last opp alt innholdet i `skribleriforetaket/` til `public_html/`

### Viktig: Domenetilkobling

Sørg for at domenet `skribleriforetaket.no` peker til Hostingers navnetjenere.
Dette gjøres i hPanel under **Domener → DNS-soner** eller hos domeneregistraren.

---

## Slik legger du til nye artikler og anmeldelser

All innhold styres fra én enkelt fil: **`data/innhold.js`**

### Mal for ny artikkel

Åpne `data/innhold.js` i en teksteditor (f.eks. Notepad++, VS Code eller Sublime Text).
Finn `artikler:`-arrayen og legg til et nytt objekt **øverst** i listen (slik at det nyeste vises først):

```javascript
{
  id: 7,                          // Øk med 1 fra forrige oppføring
  tittel: "Din artikkeltittel",
  beskrivelse: "Kort ingress på én til to setninger.",
  publisert: "Navn på publikasjon",
  dato: "DD.MM.ÅÅÅÅ",             // F.eks. "15.03.2026" eller bare "2026"
  lenke: "https://eksempel.no/artikkel",  // Full URL, eller "#" hvis ikke tilgjengelig
  bilde: "",                      // Sti til bilde, f.eks. "assets/images/artikkel7.jpg"
                                  // La stå tom ("") for plassholder
  kategori: "artikkel",           // Ikke endre denne
  underkategori: "samfunn",       // Se liste over underkategorier nedenfor
  fremhevet: false                // Sett til true for å vise på forsiden
},
```

### Mal for ny anmeldelse

Finn `anmeldelser:`-arrayen og legg til tilsvarende:

```javascript
{
  id: 107,
  tittel: "«Boktittel» — undertittel",
  beskrivelse: "Kort beskrivelse av anmeldelsen.",
  publisert: "Publikasjon",
  dato: "DD.MM.ÅÅÅÅ",
  lenke: "https://eksempel.no/anmeldelse",
  bilde: "",
  kategori: "anmeldelse",         // Ikke endre denne
  underkategori: "bok",           // Se liste over underkategorier
  fremhevet: false
},
```

### Tilgjengelige underkategorier

| Artikler   | Anmeldelser |
|------------|-------------|
| `historie` | `bok`       |
| `samfunn`  | `film`      |
| `kultur`   | `tv`        |
| `intervju` | `musikk`    |
| `essay`    | `teater`    |
| `reise`    | `utstilling`|

---

## Slik legger du til nye underkategorier

Underkategorier er fleksible og kan utvides uten å bygge om siden.

### Steg 1: Legg til i datafilen

I `data/innhold.js`, bruk den nye underkategorien direkte i `underkategori`-feltet:
```javascript
underkategori: "podcast",
```

### Steg 2: Legg til filterknapp

Åpne `artikler.html` (eller `anmeldelser.html`) og finn `<div class="filterbar-indre">`.
Legg til en ny knapp:
```html
<button class="filter-knapp" data-kategori="podcast">Podcast</button>
```

Det er alt. Filtreringen fungerer automatisk.

---

## Slik bytter du ut logoen eller bilder

- **Logo:** Erstatt filen `assets/images/logo.png` med din nye logo.
  Behold filnavnet `logo.png` for å unngå å måtte oppdatere HTML-koden.

- **Artikkelbilder:** Legg bilder i `assets/images/` og referer til dem i `data/innhold.js`:
  ```javascript
  bilde: "assets/images/artikkel7.jpg",
  ```
  Anbefalt bildestørrelse: **800×450 px** (16:9-format), maks 200 KB.

- **Portrettbilde (Om-siden):** Åpne `om.html` og erstatt `<div class="om-bilde-placeholder">` med:
  ```html
  <img src="assets/images/portrett.jpg" alt="Ditt navn" class="om-bilde">
  ```
  Legg til i `css/style.css`:
  ```css
  .om-bilde { width: 100%; border-radius: 4px; }
  ```

---

## Slik oppdaterer du Om-siden

Åpne `om.html` og rediger teksten direkte i HTML-filen.
Finn seksjonen mellom `<div class="om-tekst">` og `</div>` og endre paragrafene etter behov.

---

## SEO og Google Search Console

### Oppdater meta-beskrivelser

Hver side har sin egen `<meta name="description">` i `<head>`. Disse kan redigeres direkte i HTML-filene.

### Registrer i Google Search Console

1. Gå til [Google Search Console](https://search.google.com/search-console)
2. Legg til eiendommen `https://skribleriforetaket.no`
3. Verifiser via HTML-fil: last opp verifiseringsfilen til `public_html/`
4. Send inn `https://skribleriforetaket.no/sitemap.xml`

### Oppdater sitemap.xml

Når du legger til mange nye sider, oppdater `sitemap.xml` med de nye URL-ene.

---

## Vanlige spørsmål

**Siden vises ikke etter opplasting?**
Sjekk at `index.html` ligger direkte i `public_html/`, ikke i en undermappe.

**Fonter lastes ikke?**
Fontene hentes fra Google Fonts og krever internettforbindelse. De fungerer alltid i produksjon.

**Filtreringen fungerer ikke?**
Sjekk at `data/innhold.js` er lastet inn i HTML-filen og at `underkategori`-feltet er stavet likt i datafilen og filterknappen.

**Kan jeg bruke et CMS som WordPress i stedet?**
Ja, men da må hele strukturen bygges om. Denne løsningen er bevisst valgt for å være enkel, rask og uten avhengigheter.

---

*Sist oppdatert: mars 2026*
