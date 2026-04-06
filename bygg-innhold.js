/**
 * bygg-innhold.js
 * Kjøres av GitHub Actions hver natt.
 * Leser alle JSON-filer i /innlegg, filtrerer ut fremtidige innlegg,
 * og bygger en ny innhold.js som lastes opp til Hostinger.
 */

const fs = require('fs');
const path = require('path');

// Les eksisterende innhold.js for å hente artikler (de endres ikke automatisk)
const eksisterendeInnhold = fs.readFileSync('data/innhold.js', 'utf8');

// Trekk ut artikler-arrayen fra eksisterende fil
const artiklerMatch = eksisterendeInnhold.match(/artikler:\s*(\[[\s\S]*?\n  \])/);
const artiklerTekst = artiklerMatch ? artiklerMatch[1] : '[]';

// Les alle JSON-filer fra innlegg-mappen
const innleggMappe = path.join(__dirname, 'innlegg');
const filer = fs.readdirSync(innleggMappe)
  .filter(f => f.endsWith('.json'))
  .sort()
  .reverse(); // Nyeste først

const dagensdato = new Date();
dagensdato.setHours(0, 0, 0, 0);

const publiserteInnlegg = [];

filer.forEach(fil => {
  // Filnavnet starter med dato: ÅÅÅÅ-MM-DD-slug.json
  const datoStreng = fil.substring(0, 10);
  const publiseringsdato = new Date(datoStreng);
  publiseringsdato.setHours(0, 0, 0, 0);

  // Bare ta med innlegg der publiseringsdato er i dag eller tidligere
  if (publiseringsdato <= dagensdato) {
    const innhold = JSON.parse(fs.readFileSync(path.join(innleggMappe, fil), 'utf8'));
    publiserteInnlegg.push(innhold);
  }
});

// Bygg blogg-arrayen som JavaScript
function tilJS(obj) {
  // Håndter brodtekst med template literals
  const kopi = { ...obj };
  const brodtekst = kopi.brodtekst || '';
  delete kopi.brodtekst;

  let js = JSON.stringify(kopi, null, 6);
  // Fjern siste }
  js = js.slice(0, -1);
  // Legg til brodtekst med template literal
  js += `,\n      brodtekst: \`${brodtekst}\`\n    }`;
  return js;
}

const bloggJS = publiserteInnlegg.map(tilJS).join(',\n    ');

// Les header-kommentaren fra eksisterende innhold.js
const headerMatch = eksisterendeInnhold.match(/(\/\*\*[\s\S]*?\*\/)\s*\n/);
const header = headerMatch ? headerMatch[1] : '';

// Bygg komplett innhold.js
const nyInnholdJS = `${header}

const INNHOLD = {

  /* ══════════════════════════════════════════════════════════
     ARTIKLER — publiserte tekster i norske medier
     Legg nye artikler øverst i listen.
     ══════════════════════════════════════════════════════════ */
  artikler: ${artiklerTekst},

  /* ══════════════════════════════════════════════════════════
     BLOGG — egne innlegg for synlighet og faglig profil
     Automatisk generert av bygg-innhold.js
     ══════════════════════════════════════════════════════════ */
  blogg: [
    ${bloggJS}
  ]

};

// Eksporter for bruk i andre skript (Node.js-kompatibilitet)
if (typeof module !== 'undefined' && module.exports) {
  module.exports = INNHOLD;
}
`;

// Skriv til dist-mappen (lastes opp til Hostinger)
if (!fs.existsSync('dist')) fs.mkdirSync('dist');
fs.writeFileSync('dist/innhold.js', nyInnholdJS, 'utf8');

console.log(`✅ Bygget innhold.js med ${publiserteInnlegg.length} publiserte blogginnlegg.`);
