/**
 * Skribleriforetaket.no — Blogg-listeskript
 * Viser alle blogginnlegg på blogg.html med kategorifiltrering.
 * Hvert kort lenker internt til blogg-innlegg.html?slug=...
 */
document.addEventListener('DOMContentLoaded', function () {
  if (typeof INNHOLD === 'undefined') return;
  const grid = document.getElementById('blogg-grid');
  if (!grid) return;
  const data = INNHOLD.blogg || [];
  function visInnlegg(filter) {
    const filtrert = filter === 'alle'
      ? data
      : data.filter(function (i) { return i.underkategori === filter; });
    if (filtrert.length === 0) {
      grid.innerHTML = '<p class="ingen-treff tekst-myk">Ingen innlegg i denne kategorien ennå.</p>';
      return;
    }
    grid.innerHTML = filtrert.map(lagKortHTML).join('');
  }
  // Første visning
  visInnlegg('alle');
  // Kategorifilter
  const filterKnapper = document.querySelectorAll('.filter-knapp');
  filterKnapper.forEach(function (knapp) {
    knapp.addEventListener('click', function () {
      filterKnapper.forEach(function (k) {
        k.classList.remove('aktiv');
        k.removeAttribute('aria-current');
      });
      knapp.classList.add('aktiv');
      knapp.setAttribute('aria-current', 'true');
      visInnlegg(knapp.dataset.filter);
    });
  });
});
function lagKortHTML(item) {
  const bildeHTML = item.bilde
    ? `<a href="blogg-innlegg.html?slug=${escHTML(item.slug)}" tabindex="-1" aria-hidden="true">
         <img src="${escHTML(item.bilde)}" alt="${escHTML(item.tittel)}" class="kort-bilde" loading="lazy">
       </a>`
    : '';
  const underkategoriLabel = item.underkategori
    ? `<span class="merke">${escHTML(item.underkategori)}</span>`
    : '';
  return `
<article class="kort"
  data-kategori="blogg"
  data-underkategori="${escHTML(item.underkategori || '')}">
  ${bildeHTML}
  <div class="kort-innhold">
    <div class="kort-meta">
      ${underkategoriLabel}
      <span class="kort-dato">${escHTML(item.dato)}</span>
    </div>
    <h2 class="kort-tittel">
      <a href="blogg-innlegg.html?slug=${escHTML(item.slug)}">
        ${escHTML(item.tittel)}
      </a>
    </h2>
    <p class="kort-beskrivelse">${escHTML(item.beskrivelse)}</p>
    <a href="blogg-innlegg.html?slug=${escHTML(item.slug)}" class="kort-lenke">
      Les innlegget
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