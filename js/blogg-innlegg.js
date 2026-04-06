/**
 * Skribleriforetaket.no — Enkelt blogginnlegg
 * =============================================
 * Leser ?slug=... fra URL-en og viser riktig blogginnlegg.
 * Eksempel: blogg-innlegg.html?slug=hvorfor-jeg-skriver
 */
document.addEventListener('DOMContentLoaded', function () {
  if (typeof INNHOLD === 'undefined') return;
  const params = new URLSearchParams(window.location.search);
  const slug = params.get('slug');
  const container = document.getElementById('innlegg-innhold');
  if (!slug || !container) {
    visIkkeFunnet(container);
    return;
  }
  const innlegg = (INNHOLD.blogg || []).find(function (i) {
    return i.slug === slug;
  });
  if (!innlegg) {
    visIkkeFunnet(container);
    return;
  }

  const baseUrl = 'https://skribleriforetaket.no/';
  const innleggUrl = baseUrl + 'blogg-innlegg.html?slug=' + slug;
  const beskrivelse = innlegg.beskrivelse || innlegg.ingress || '';
  const bilde = innlegg.bilde
    ? baseUrl + innlegg.bilde
    : baseUrl + 'assets/images/portrett.webp';

  // Oppdater <title>, canonical og meta
  document.title = innlegg.tittel + ' — Skribleriforetaket';
  oppdaterMeta('description', beskrivelse);
  oppdaterCanonical(innleggUrl);

  // Open Graph
  oppdaterOG('og:title', innlegg.tittel + ' — Skribleriforetaket');
  oppdaterOG('og:description', beskrivelse);
  oppdaterOG('og:url', innleggUrl);
  oppdaterOG('og:image', bilde);

  // Twitter Card
  oppdaterMeta('twitter:title', innlegg.tittel + ' — Skribleriforetaket');
  oppdaterMeta('twitter:description', beskrivelse);
  oppdaterMeta('twitter:image', bilde);

  // Schema.org BlogPosting
  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Person",
        "@id": baseUrl + "#person",
        "name": "Rolf Sunde",
        "url": baseUrl,
        "jobTitle": "Frilansjournalist og skribent",
        "sameAs": ["https://www.linkedin.com/in/oversetter-rolf-sunde/"]
      },
      {
        "@type": "WebSite",
        "@id": baseUrl + "#website",
        "url": baseUrl,
        "name": "Skribleriforetaket"
      },
      {
        "@type": "BlogPosting",
        "@id": innleggUrl + "#innlegg",
        "url": innleggUrl,
        "headline": innlegg.tittel,
        "description": beskrivelse,
        "image": bilde,
        "datePublished": innlegg.dato || '',
        "author": { "@id": baseUrl + "#person" },
        "isPartOf": { "@id": baseUrl + "#website" }
      }
    ]
  };
  const schemaEl = document.getElementById('schema-innlegg');
  if (schemaEl) schemaEl.textContent = JSON.stringify(schema);

  // Bilde
  const bildeHTML = innlegg.bilde
    ? `<img src="${escHTML(innlegg.bilde)}" alt="${escHTML(innlegg.tittel)}" class="innlegg-bilde" loading="eager">`
    : '';

  // Ingress
  const ingressHTML = innlegg.ingress
    ? `<p class="innlegg-ingress">${escHTML(innlegg.ingress)}</p>`
    : '';

  // Brødtekst (tillater enkel HTML fra datafilen)
  const brodtekstHTML = innlegg.brodtekst || '';

  // Tags
  let tagsHTML = '';
  if (innlegg.tags) {
    const tagListe = innlegg.tags.split(',').map(function (t) { return t.trim(); }).filter(Boolean);
    if (tagListe.length > 0) {
      tagsHTML = `<div class="innlegg-tags">
        <span class="innlegg-tags-etikett">Emner:</span>
        ${tagListe.map(function (t) { return `<span class="tag-merke">${escHTML(t)}</span>`; }).join('')}
      </div>`;
    }
  }

  container.innerHTML = `
    <div class="innlegg-meta">
      <span class="merke">${escHTML(innlegg.underkategori || 'blogg')}</span>
      <span class="kort-dato">${escHTML(innlegg.dato)}</span>
    </div>
    <h1 class="innlegg-tittel">${escHTML(innlegg.tittel)}</h1>
    ${ingressHTML}
    ${bildeHTML}
    <div class="innlegg-brodtekst">
      ${brodtekstHTML}
    </div>
    ${tagsHTML}
  `;
});

function visIkkeFunnet(container) {
  if (!container) return;
  container.innerHTML = `
    <div class="feil-melding">
      <p style="font-size:1.1rem; margin-bottom:1rem;">Innlegget ble ikke funnet.</p>
      <a href="blogg.html" class="knapp knapp-primær">Gå til bloggen</a>
    </div>`;
  document.title = 'Innlegg ikke funnet — Skribleriforetaket';
}

function oppdaterMeta(name, content) {
  const el = document.querySelector('meta[name="' + name + '"]');
  if (el) el.setAttribute('content', content);
}

function oppdaterCanonical(href) {
  const el = document.querySelector('link[rel="canonical"]');
  if (el) el.setAttribute('href', href);
}

function oppdaterOG(property, content) {
  const el = document.querySelector('meta[property="' + property + '"]');
  if (el) el.setAttribute('content', content);
}

function escHTML(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}