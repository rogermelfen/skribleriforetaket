/**
 * Skribleriforetaket.no — Gjenbrukbare komponenter
 * ===================================================
 * Injiserer header og footer på alle sider.
 * Slik slipper du å vedlikeholde navigasjonen på tvers av alle HTML-filer.
 *
 * BRUK: Inkluder dette skriptet i <head> eller før </body> på alle sider.
 * Legg til <div id="nettsted-header"></div> og <div id="nettsted-footer"></div>
 * der du vil ha dem i HTML-en.
 */
(function () {
  'use strict';

  // ---- HEADER ----
  const headerHTML = `
<header class="nettsted-header" role="banner">
  <div class="header-indre">
    <a href="index.html" class="logo-lenke" aria-label="Skribleriforetaket – til forsiden">
      <img src="assets/images/logo.png" alt="Skribleriforetaket logo" class="logo-bilde" width="36" height="36">
      <div class="logo-tekst">
        <span class="logo-navn">Skribleriforetaket</span>
        <span class="logo-slagord">Words do come easy</span>
      </div>
    </a>
    <button class="meny-knapp" id="meny-knapp" aria-controls="hoved-nav" aria-expanded="false" aria-label="Åpne meny">
      <span></span><span></span><span></span>
    </button>
    <nav class="hoved-nav" id="hoved-nav" aria-label="Hovednavigasjon">
      <a href="index.html">Hjem</a>
      <a href="artikler.html">Artikler</a>
      <a href="blogg.html">Blogg</a>
      <a href="om.html">Om</a>
      <a href="testimonials.html">Referanser</a>
      <a href="kontakt.html">Kontakt</a>
    </nav>
  </div>
</header>`;

  // ---- FOOTER ----
  const footerHTML = `
<footer class="nettsted-footer" role="contentinfo">
  <div class="footer-indre">
    <div>
      <p class="footer-logo-navn">Skribleriforetaket</p>
      <p class="footer-slagord">Words do come easy</p>
    </div>
    <nav class="footer-nav" aria-label="Fotnavigasjon">
      <a href="index.html">Hjem</a>
      <a href="artikler.html">Artikler</a>
      <a href="blogg.html">Blogg</a>
      <a href="om.html">Om</a>
      <a href="testimonials.html">Referanser</a>
      <a href="kontakt.html">Kontakt</a>
    </nav>
    <div>
      <p style="font-size:0.85rem;">
        <a href="mailto:kontakt@skribleriforetaket.no" style="color:var(--farge-linje);">
          kontakt@skribleriforetaket.no
        </a>
      </p>
    </div>
  </div>
  <div class="footer-bunn container">
    <p>&copy; <span id="footer-aar"></span> Skribleriforetaket. Alle rettigheter forbeholdt.</p>
  </div>
</footer>`;

  // ---- Injiser header ----
  const headerEl = document.getElementById('nettsted-header');
  if (headerEl) headerEl.outerHTML = headerHTML;

  // ---- Injiser footer ----
  const footerEl = document.getElementById('nettsted-footer');
  if (footerEl) footerEl.outerHTML = footerHTML;

  // ---- Sett årstall i footer ----
  const aarEl = document.getElementById('footer-aar');
  if (aarEl) aarEl.textContent = new Date().getFullYear();

  // NB: Hamburger-meny og aktiv navigasjonslenke håndteres av main.js.

})();