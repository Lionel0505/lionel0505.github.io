const KEY = 'theme';
const root = document.documentElement;
const mq = matchMedia('(prefers-color-scheme: dark)');
const sys = (): 'light' | 'dark' => (mq.matches ? 'dark' : 'light');

export type Pref = 'system' | 'light' | 'dark';
const NEXT: Record<Pref, Pref> = { system: 'light', light: 'dark', dark: 'system' };

function apply(pref: Pref) {
  root.classList.add('no-tr');
  root.dataset.theme = pref === 'system' ? sys() : pref;
  root.dataset.themePref = pref;
  try {
    if (pref === 'system') localStorage.removeItem(KEY);
    else localStorage.setItem(KEY, pref);
  } catch {}
  requestAnimationFrame(() => requestAnimationFrame(() => root.classList.remove('no-tr')));
  label();
}

function label() {
  const btn = document.getElementById('theme-toggle');
  if (!btn) return;
  const pref = (root.dataset.themePref ?? 'system') as Pref;
  btn.textContent = pref === 'light' ? '☀' : pref === 'dark' ? '☾' : '⌁';
  btn.setAttribute('aria-label', `${btn.dataset.labelPrefix} ${pref}`);
}

document
  .getElementById('theme-toggle')
  ?.addEventListener('click', () => apply(NEXT[(root.dataset.themePref ?? 'system') as Pref]));

mq.addEventListener('change', () => {
  if ((root.dataset.themePref ?? 'system') === 'system') apply('system');
});

label();
