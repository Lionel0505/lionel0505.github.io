const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
const native = CSS.supports('animation-timeline: view()') && !reduce;

/* ---------- Repli : IntersectionObserver + scroll, pour les navigateurs sans
   timelines de défilement natives. Si `native` est vrai, motion.css pilote
   tout et ce bloc ne fait rien de plus. */
if (!native) {
  const io = new IntersectionObserver(
    (entries) => {
      for (const e of entries) {
        if (e.isIntersecting) {
          e.target.classList.add('in');
          io.unobserve(e.target);
        }
      }
    },
    { threshold: 0.14, rootMargin: '0px 0px -6% 0px' },
  );
  for (const el of document.querySelectorAll('.rv')) io.observe(el);

  const chain = document.querySelector<HTMLElement>('#chain i');
  if (chain) {
    let ticking = false;
    addEventListener(
      'scroll',
      () => {
        if (ticking) return;
        ticking = true;
        requestAnimationFrame(() => {
          const h = document.documentElement.scrollHeight - innerHeight;
          chain.style.width = `${h > 0 ? (scrollY / h) * 100 : 0}%`;
          ticking = false;
        });
      },
      { passive: true },
    );
  }
}

/* ---------- Planche : le contour est déjà posé par Plate.astro (tâche 6) ;
   ce script ne fait que jouer le tracé puis le coloriage, une fois au
   chargement. Repris de la maquette de référence, moins splitHeading() (le
   brief l'interdit : le h1 porte le LCP et est déjà dans #heroB, qui a
   .stagger) et le mécanisme de rejeu qui ne servait qu'à son panneau de
   démonstration. Les pages sans planche (les études de cas) laissent ces
   listes vides : settle()/drawPlate() n'y font rien. */
const lines = [...document.querySelectorAll<SVGPathElement>('#lines path')];
const labels = [...document.querySelectorAll<SVGElement>('[data-lbl]')];
const parcels = [...document.querySelectorAll<SVGElement>('.parcel')];
const ticks = document.querySelector<SVGElement>('#ticks');
const annos = document.querySelector<SVGElement>('#annos');

function settle() {
  for (const p of parcels) p.style.fillOpacity = p.dataset.op ?? '';
  for (const t of labels) {
    t.style.opacity = '1';
    t.style.transform = 'none';
  }
  if (ticks) ticks.style.opacity = '1';
  if (annos) annos.style.opacity = '1';
  for (const p of lines) {
    p.style.strokeDasharray = 'none';
    p.style.strokeDashoffset = '0';
  }
}

function drawPlate() {
  // Pas de planche sur cette page (études de cas), ou mouvement réduit :
  // rien à cacher, rien à jouer.
  if (reduce || !ticks || !annos) return settle();

  for (const p of parcels) {
    p.style.transition = 'none';
    p.style.fillOpacity = '0';
  }
  for (const t of labels) {
    t.style.transition = 'none';
    t.style.opacity = '0';
    t.style.transform = 'translateY(5px)';
  }
  ticks.style.transition = annos.style.transition = 'none';
  ticks.style.opacity = annos.style.opacity = '0';

  lines.forEach((p, i) => {
    const L = p.getTotalLength();
    p.style.transition = 'none';
    p.style.strokeDasharray = `${L}`;
    p.style.strokeDashoffset = `${L}`;
    void p.getBoundingClientRect();
    const dur = p.classList.contains('outer') ? 1000 : 700;
    p.style.transition = `stroke-dashoffset ${dur}ms cubic-bezier(0.16,1,0.3,1) ${120 + i * 95}ms`;
    p.style.strokeDashoffset = '0';
  });

  setTimeout(
    () => {
      // le plan se colorie, parcelle par parcelle : c'est le pic
      parcels.forEach((p, i) => {
        p.style.transition = `fill-opacity .6s cubic-bezier(0.16,1,0.3,1) ${i * 110}ms`;
        p.style.fillOpacity = p.dataset.op ?? '';
      });
      labels.forEach((t, i) => {
        const d = 200 + i * 60;
        t.style.transition = `opacity .55s cubic-bezier(0.16,1,0.3,1) ${d}ms, transform .55s cubic-bezier(0.16,1,0.3,1) ${d}ms`;
        t.style.opacity = '1';
        t.style.transform = 'none';
      });
      [ticks, annos].forEach((g, i) => {
        g.style.transition = `opacity .7s cubic-bezier(0.16,1,0.3,1) ${280 + i * 130}ms`;
        g.style.opacity = '1';
      });
    },
    120 + lines.length * 95 + 380,
  );
}

function playHero() {
  (['#heroA', '#heroB'] as const).forEach((sel, i) => {
    const el = document.querySelector(sel);
    if (el) setTimeout(() => el.classList.add('in'), 70 + i * 100);
  });
  drawPlate();
}

// Appelé directement, pas sur `load` : le script est un module différé, donc
// il s'exécute une fois le DOM analysé, ce qui suffit à getTotalLength(). Le
// h1 porte le LCP et vit dans #heroB : attendre `load` (polices, images)
// coûterait la métrique pour rien.
playHero();
