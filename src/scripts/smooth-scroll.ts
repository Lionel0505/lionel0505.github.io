const EASE = 0.085,
  THRESHOLD = 0.35;
// Mode statique (data-motion, Base.astro) traité comme un mouvement réduit.
const reduce =
  matchMedia('(prefers-reduced-motion: reduce)').matches ||
  document.documentElement.dataset.motion === 'lite';
const fine = matchMedia('(pointer: fine)').matches;
const active = fine && !reduce;

let target = 0,
  current = 0,
  running = false;
const max = () => document.documentElement.scrollHeight - innerHeight;
const clamp = (v: number) => Math.max(0, Math.min(max(), v));

function loop() {
  const diff = target - current;
  if (Math.abs(diff) < THRESHOLD) {
    current = target;
    running = false;
  } else {
    current += diff * EASE;
  }
  scrollTo(0, current);
  if (running) requestAnimationFrame(loop);
}
function start() {
  if (!running) {
    running = true;
    requestAnimationFrame(loop);
  }
}

export function to(y: number) {
  if (!active) {
    scrollTo({ top: y, behavior: reduce ? 'auto' : 'smooth' });
    return;
  }
  target = clamp(y);
  start();
}

if (active) {
  target = current = scrollY;
  // `smooth` combattrait notre propre scrollTo par frame ; scrollBehavior
  // reste sur auto tant que ce chemin pilote la molette.
  document.documentElement.style.scrollBehavior = 'auto';
  addEventListener(
    'wheel',
    (e) => {
      if (e.ctrlKey) return; // le pinch-zoom doit rester natif
      e.preventDefault();
      const unit = e.deltaMode === 1 ? 16 : e.deltaMode === 2 ? innerHeight : 1;
      target = clamp(target + e.deltaY * unit);
      start();
    },
    { passive: false },
  );
  // Resynchronise quand le visiteur défile autrement : glissière, clavier,
  // recherche dans la page. L'événement scroll est asynchrone donc `running`
  // est déjà retombé à false avant que cet écouteur ne s'exécute.
  addEventListener(
    'scroll',
    () => {
      if (!running) target = current = scrollY;
    },
    { passive: true },
  );
  addEventListener(
    'resize',
    () => {
      target = clamp(target);
    },
    { passive: true },
  );
}

// Le lien d'évitement est hors sélection : le saut natif y déplace le focus
// dans #main, ce que preventDefault empêcherait, et c'est toute sa raison
// d'être (WCAG 2.4.1).
for (const a of document.querySelectorAll<HTMLAnchorElement>('a[href^="#"]:not(.skip)')) {
  a.addEventListener('click', (e) => {
    const href = a.getAttribute('href');
    if (!href || href === '#') return;
    const el = document.querySelector<HTMLElement>(href);
    // Sans amortissement, le saut natif fait mieux que nous : il respecte
    // scroll-padding-top, déplace le focus et écrit le hash tout seul.
    if (!el || !active) return;
    e.preventDefault();
    // 58 = hauteur de la barre collante, la même valeur que scroll-padding-top
    // dans base.css. Les deux suivent `.hdr` (SiteHeader.astro) et bougent ensemble.
    to(el.getBoundingClientRect().top + scrollY - 58);
    history.pushState(null, '', href);
    // Le défilement seul ne déplace pas le focus : sans ça, la tabulation
    // suivante repartirait de l'en-tête au lieu de la section atteinte.
    el.tabIndex = -1;
    el.focus({ preventScroll: true });
  });
}
