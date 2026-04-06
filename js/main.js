/**
 * Skribleriforetaket.no — Hoved-JavaScript
 * Versjon: 1.1
 *
 * Innhold:
 * 1. Hamburger-meny (mobil)
 * 2. Aktiv navigasjonslenke
 * 3. Kategorifiltrering (artikler/blogg)
 */

/* ============================================================
   1. Hamburger-meny
   ============================================================ */
document.addEventListener('DOMContentLoaded', function () {
  const menyKnapp = document.getElementById('meny-knapp');
  const nav = document.getElementById('hoved-nav');
  if (menyKnapp && nav) {
    menyKnapp.addEventListener('click', function () {
      const erApen = nav.classList.toggle('open');
      menyKnapp.classList.toggle('open', erApen);
      menyKnapp.setAttribute('aria-expanded', String(erApen));
    });
    // Lukk menyen ved klikk utenfor
    document.addEventListener('click', function (e) {
      if (!menyKnapp.contains(e.target) && !nav.contains(e.target)) {
        nav.classList.remove('open');
        menyKnapp.classList.remove('open');
        menyKnapp.setAttribute('aria-expanded', 'false');
      }
    });
  }

  /* ============================================================
     2. Aktiv navigasjonslenke
     ============================================================ */
  const gjeldendeSide = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.hoved-nav a, .footer-nav a').forEach(function (lenke) {
    const href = lenke.getAttribute('href');
    if (href === gjeldendeSide || (gjeldendeSide === '' && href === 'index.html')) {
      lenke.classList.add('aktiv');
      lenke.setAttribute('aria-current', 'page');
    }
  });

  /* ============================================================
     3. Kategorifiltrering
     ============================================================ */
  const filterKnapper = document.querySelectorAll('.filter-knapp');
  const kortListe = document.querySelectorAll('.innhold-grid .kort');
  if (filterKnapper.length > 0 && kortListe.length > 0) {
    filterKnapper.forEach(function (knapp) {
      knapp.addEventListener('click', function () {
        const kategori = knapp.dataset.kategori || knapp.dataset.filter;
        // Oppdater aktiv knapp
        filterKnapper.forEach(function (k) {
          k.classList.remove('aktiv');
          k.setAttribute('aria-pressed', 'false');
        });
        knapp.classList.add('aktiv');
        knapp.setAttribute('aria-pressed', 'true');
        // Filtrer kort
        let synlige = 0;
        kortListe.forEach(function (kort) {
          const kortKategori = kort.dataset.kategori || '';
          const kortUnderkategori = kort.dataset.underkategori || '';
          if (kategori === 'alle' || kortKategori === kategori || kortUnderkategori === kategori) {
            kort.style.display = '';
            synlige++;
          } else {
            kort.style.display = 'none';
          }
        });
        // Vis "ingen treff"-melding
        const ingenTreff = document.querySelector('.ingen-treff');
        if (ingenTreff) {
          ingenTreff.style.display = synlige === 0 ? '' : 'none';
        }
      });
    });
  }
});