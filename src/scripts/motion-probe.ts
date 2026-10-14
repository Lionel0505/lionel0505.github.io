// Sonde GPU, après le chargement et au repos : un contexte WebGL refusé avec
// failIfMajorPerformanceCaveat signale un rendu logiciel. Sur un tel appareil, la
// page passe en version statique à la volée (motion.css, [data-motion='lite']) et
// le verdict est gardé pour les visites suivantes, que Base.astro lit avant le
// premier affichage. Le coût de la sonde ne tombe donc jamais sur le rendu.
const root = document.documentElement;
let known: string | null = null;
try {
  known = localStorage.getItem('weak');
} catch {}

function probe() {
  let weak = true;
  try {
    const gl = document
      .createElement('canvas')
      .getContext('webgl', { failIfMajorPerformanceCaveat: true });
    weak = !gl;
    gl?.getExtension('WEBGL_lose_context')?.loseContext();
  } catch {}
  try {
    localStorage.setItem('weak', weak ? '1' : '0');
  } catch {}
  if (weak && root.dataset.motion !== 'lite') {
    root.dataset.motion = 'lite';
    root.classList.remove('js-motion');
  }
}

if (known === null && root.dataset.motion !== 'lite') {
  const idle = () =>
    'requestIdleCallback' in window
      ? requestIdleCallback(probe, { timeout: 3000 })
      : setTimeout(probe, 1);
  if (document.readyState === 'complete') idle();
  else addEventListener('load', idle, { once: true });
}
