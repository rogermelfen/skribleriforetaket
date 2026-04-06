/**
 * Skribleriforetaket.no — Forsideskript
 * ========================================
 * Viser fremhevede artikler og siste blogginnlegg på forsiden.
 * Artikler lenker eksternt; blogginnlegg lenker internt.
 */
document.addEventListener('DOMContentLoaded', function () {
  if (typeof INNHOLD === 'undefined') return;

  // ── Fremhevede artikler ──
  const artikkelGrid = document.getElementById('fremhevede-grid');
  if (artikkelGrid) {
    const fremhevede = (INNHOLD.artikler || [])
      .filter(function (i) { return i.fremhevet && i.publisertSort !== false; })
      .sort(function (a, b) {
        if (!a.datoSort) return 1;
        if (!b.datoSort) return -1;
        return new Date(b.datoSort) - new Date(a.datoSort);
      })
      .slice(0, 3);
    if (fremhevede.length === 0) {
      artikkelGrid.innerHTML = '<p class="tekst-myk">Ingen fremhevede artikler ennå.</p>';
    } else {
      artikkelGrid.innerHTML = fremhevede.map(lagArtikkelKort).join('');
    }
  }

  // ── Siste blogginnlegg ──
  const bloggGrid = document.getElementById('blogg-grid');
  if (bloggGrid) {
    const sisteBlogg = (INNHOLD.blogg || [])
      .slice()
      .sort(function (a, b) {
        if (!a.datoSort) return 1;
        if (!b.datoSort) return -1;
        return new Date(b.datoSort) - new Date(a.datoSort);
      })
      .slice(0, 3);
    if (sisteBlogg.length === 0) {
      bloggGrid.innerHTML = '<p class="tekst-myk">Ingen blogginnlegg ennå.</p>';
    } else {
      bloggGrid.innerHTML = sisteBlogg.map(lagBloggKort).join('');
    }
  }
});

/** Artikkelkort — lenker eksternt */
function lagArtikkelKort(item) {
  const bildeHTML = item.bilde
    ? `<img src="${esc(item.bilde)}" alt="${esc(item.tittel)}" class="kort-bilde" loading="lazy">`
    : `<div class="kort-bilde-placeholder" aria-hidden="true">Illustrasjon</div>`;
  const href = item.lenke && item.lenke !== '#' ? item.lenke : '#';
  const eksternAttr = href !== '#' ? 'target="_blank" rel="noopener noreferrer"' : '';
  return `
<article class="kort" data-kategori="artikkel" data-underkategori="${esc(item.underkategori || '')}">
  <a href="${href}" ${eksternAttr} tabindex="-1" aria-hidden="true">${bildeHTML}</a>
  <div class="kort-innhold">
    <div class="kort-meta">
      <span class="merke">${esc(item.underkategori || 'artikkel')}</span>
      <span class="kort-dato">${esc(item.dato)}</span>
    </div>
    <h3 class="kort-tittel">
      <a href="${href}" ${eksternAttr}>${esc(item.tittel)}</a>
    </h3>
    <p class="kort-beskrivelse">${esc(item.beskrivelse)}</p>
    <p class="kort-publisert">Publisert i: <em>${esc(item.publisert)}</em></p>
    <a href="${href}" class="kort-lenke" ${eksternAttr}>Les artikkelen</a>
  </div>
</article>`;
}

/** Bloggkort — lenker internt */
function lagBloggKort(item) {
  const bildeHTML = item.bilde
    ? `<img src="${esc(item.bilde)}" alt="${esc(item.tittel)}" class="kort-bilde" loading="lazy">`
    : `<div class="kort-bilde-placeholder" aria-hidden="true">Illustrasjon</div>`;
  const href = 'blogg-innlegg.html?slug=' + esc(item.slug);
  return `
<article class="kort" data-kategori="blogg" data-underkategori="${esc(item.underkategori || '')}">
  <a href="${href}" tabindex="-1" aria-hidden="true">${bildeHTML}</a>
  <div class="kort-innhold">
    <div class="kort-meta">
      <span class="merke">${esc(item.underkategori || 'blogg')}</span>
      <span class="kort-dato">${esc(item.dato)}</span>
    </div>
    <h3 class="kort-tittel">
      <a href="${href}">${esc(item.tittel)}</a>
    </h3>
    <p class="kort-beskrivelse">${esc(item.beskrivelse)}</p>
    <a href="${href}" class="kort-lenke">Les innlegget</a>
  </div>
</article>`;
}

function esc(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}