/**
 * Skribleriforetaket.no — Artikkel-listeskript
 * Brukes av artikler.html for å rendre artikkelkort.
 * Artikler lenker eksternt til publikasjonens nettside.
 */

/**
 * Viser artikler i et grid-element.
 * @param {string} gridId   – ID til container-elementet
 * @param {string} kategori – "artikkel"
 */
function visInnhold(gridId, kategori) {
  const grid = document.getElementById(gridId);
  if (!grid || typeof INNHOLD === 'undefined') return;

  const data = (INNHOLD.artikler || [])
    .filter(function (i) { return i.publisertSort !== false; })
    .sort(function (a, b) {
      if (!a.datoSort) return 1;
      if (!b.datoSort) return -1;
      return new Date(b.datoSort) - new Date(a.datoSort);
    });

  if (data.length === 0) {
    grid.innerHTML = '<p class="ingen-treff tekst-myk">Ingen artikler ennå.</p>';
    return;
  }

  grid.innerHTML = data.map(function (item) {
    return lagKortHTML(item);
  }).join('');

  // Kategorifiltrering
  const filterKnapper = document.querySelectorAll('.filter-knapp');
  filterKnapper.forEach(function (knapp) {
    knapp.addEventListener('click', function () {
      filterKnapper.forEach(function (k) {
        k.classList.remove('aktiv');
        k.setAttribute('aria-pressed', 'false');
      });
      knapp.classList.add('aktiv');
      knapp.setAttribute('aria-pressed', 'true');
      const valgt = knapp.dataset.kategori;
      const kort = grid.querySelectorAll('.kort');
      kort.forEach(function (kort) {
        if (valgt === 'alle' || kort.dataset.underkategori === valgt) {
          kort.style.display = '';
        } else {
          kort.style.display = 'none';
        }
      });
    });
  });
}

/** Genererer HTML for et artikkelkort med ekstern lenke */
function lagKortHTML(item) {
  const bildeHTML = item.bilde
    ? `<img src="${escHTML(item.bilde)}" alt="${escHTML(item.tittel)}" class="kort-bilde" loading="lazy">`
    : `<div class="kort-bilde-placeholder" aria-hidden="true">Illustrasjon</div>`;
  const underkategoriLabel = item.underkategori
    ? `<span class="merke">${escHTML(item.underkategori)}</span>`
    : '';
  const href = item.lenke && item.lenke !== '#' ? item.lenke : '#';
  const eksternAttr = href !== '#' ? 'target="_blank" rel="noopener noreferrer"' : '';
  return `
<article class="kort"
  data-kategori="artikkel"
  data-underkategori="${escHTML(item.underkategori || '')}">
  <a href="${href}" ${eksternAttr} tabindex="-1" aria-hidden="true">
    ${bildeHTML}
  </a>
  <div class="kort-innhold">
    <div class="kort-meta">
      ${underkategoriLabel}
      <span class="kort-dato">${escHTML(item.dato)}</span>
    </div>
    <h2 class="kort-tittel">
      <a href="${href}" ${eksternAttr}>
        ${escHTML(item.tittel)}
      </a>
    </h2>
    <p class="kort-beskrivelse">${escHTML(item.beskrivelse)}</p>
    <p class="kort-publisert">Publisert i: <em>${escHTML(item.publisert)}</em></p>
    <a href="${href}" class="kort-lenke" ${eksternAttr}>
      Les artikkelen
    </a>
  </div>
</article>`;
}

function escHTML(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}