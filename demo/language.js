export const english = new URLSearchParams(location.search).get('lang') === 'en';
export const phrase = (spanish, englishText) => english ? englishText : spanish;

export function localize() {
  if (!english) return;
  document.documentElement.lang = 'en';
  document.title = 'Trazum · Writing motion test';
  for (const element of document.querySelectorAll('[data-en]')) element.textContent = element.dataset.en;
  const link = document.getElementById('language');
  link.href = './';
  link.lang = 'es-AR';
  link.textContent = 'Español';
  document.getElementById('draw-pad').setAttribute('aria-label', 'Drawing pad');
  document.getElementById('steps').setAttribute('aria-label', 'Demonstration stages');
  document.getElementById('transport').setAttribute('aria-label', 'Playback');
  document.getElementById('baseline-trace').setAttribute('aria-label', 'Input path with disturbance');
  document.getElementById('filtered-trace').setAttribute('aria-label', 'Filtered output path');
  document.getElementById('trace').setAttribute('aria-label', 'Path comparison');
  document.getElementById('viewport').setAttribute('aria-label', 'Conceptual hand with virtual stylus');
}
