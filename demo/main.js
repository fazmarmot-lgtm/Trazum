import './style.css';
import { DURATION, DEFAULTS, SAMPLE_COUNT, simulate, summarize } from './simulation.js';
import { createView } from './view.js';
import { setupDrawing } from './drawing.js';
import { english, localize, phrase } from './language.js';

localize();
const byId = (id) => document.getElementById(id);
const seek = byId('seek');
const motion = byId('mode');
const noise = byId('noise');
const alpha = byId('alpha');
const play = byId('play');
const toggle = byId('toggle-mode');
const steps = [...byId('steps').querySelectorAll('[data-step]')];

const colors = { baseline: '#ffad82', filtered: '#93c6ff', target: '#79d8c5' };
const plots = [
  ['baseline-trace', ['baseline']],
  ['filtered-trace', ['filtered']],
  ['trace', ['baseline', 'filtered']],
].map(([id, paths]) => {
  const canvas = byId(id);
  return { canvas, paths, context: canvas.getContext('2d') };
});
const number = new Intl.NumberFormat(english ? 'en' : 'es-AR', {
  minimumFractionDigits: 3,
  maximumFractionDigits: 3,
});
const seconds = new Intl.NumberFormat(english ? 'en' : 'es-AR', {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

let stage = 'intro';
let advanced = false;
let samples;
let reference;
let frame = 0;
let animation;
let startedAt;
let project;
let view;
let viewAttempted = false;

function showView() {
  if (viewAttempted) return;
  viewAttempted = true;
  try {
    view = createView(byId('viewport'));
    view.setTarget(samples);
  } catch {
    byId('view-status').textContent = phrase(
      'La vista 3D requiere WebGL. Podés seguir usando los gráficos.',
      'The 3D view needs WebGL. You can still use the plots.',
    );
    for (const id of ['camera', 'zoom-in', 'zoom-out']) byId(id).disabled = true;
  }
}

function fitTrace(run) {
  const points = run.flatMap(({ baseline, filtered, target }) => [baseline, filtered, target]);
  const xs = points.map(({ x }) => x);
  const ys = points.map(({ y }) => y);
  const minX = Math.min(...xs);
  const maxX = Math.max(...xs);
  const minY = Math.min(...ys);
  const maxY = Math.max(...ys);
  const { width, height } = plots[0].canvas;
  const scale = Math.min((width - 66) / Math.max(0.025, maxX - minX),
    (height - 48) / Math.max(0.025, maxY - minY));
  return ({ x, y }) => [
    width / 2 + (x - (minX + maxX) / 2) * scale,
    height / 2 - (y - (minY + maxY) / 2) * scale,
  ];
}

function drawPath(context, kind, end) {
  context.beginPath();
  context.strokeStyle = colors[kind];
  context.lineWidth = kind === 'target' ? 2 : 3.6;
  context.lineJoin = 'round';
  context.lineCap = 'round';
  context.setLineDash(kind === 'target' ? [5, 6] : []);
  context.globalAlpha = kind === 'target' ? 0.75 : 1;
  context.moveTo(...project(samples[0][kind]));
  for (let index = 1; index <= end; index++) context.lineTo(...project(samples[index][kind]));
  context.stroke();
  context.globalAlpha = 1;
}

function drawPlots() {
  if (byId('results').hidden) return;
  const preview = !advanced && stage === 'intro';
  const end = preview ? SAMPLE_COUNT - 1 : frame;
  for (const { canvas, context, paths } of plots) {
    if (canvas.id === 'trace' && !advanced) continue;
    context.clearRect(0, 0, canvas.width, canvas.height);
    for (const kind of paths) drawPath(context, kind, end);
    drawPath(context, 'target', SAMPLE_COUNT - 1);
    for (const kind of paths) {
      if (preview) continue;
      context.beginPath();
      context.fillStyle = colors[kind];
      context.arc(...project(samples[frame][kind]), 5.5, 0, 2 * Math.PI);
      context.fill();
    }
  }
}

function render(index) {
  frame = index;
  seek.value = frame;
  byId('time').textContent = seconds.format(DURATION * frame / (SAMPLE_COUNT - 1)) + ' s';
  if (!byId('visualization').hidden) view?.move(samples[frame], motion.value, frame);
  drawPlots();
}

function refresh() {
  byId('noise-value').textContent = noise.value + '%';
  byId('alpha-value').textContent = alpha.value + '%';
  byId('current-reference').textContent = reference
    ? phrase('Objetivo: tu trazo.', 'Target: your stroke.')
    : phrase('Objetivo: trazo de ejemplo.', 'Target: example stroke.');
  samples = simulate({ ...DEFAULTS, disturbance: +noise.value / 100, alpha: +alpha.value / 100 }, reference);
  project = fitTrace(samples);
  view?.setTarget(samples);
  const before = summarize(samples, 'baseline');
  const after = summarize(samples, 'filtered');
  for (const [kind, metrics] of [['baseline', before], ['filtered', after]]) {
    for (const [metric, value] of Object.entries(metrics)) byId(kind + '-' + metric).textContent = number.format(value);
  }
  const difference = after.rms - before.rms;
  const result = byId('interpretation');
  if (Math.abs(difference) < 0.0005) {
    result.textContent = phrase('El error RMS es prácticamente igual.', 'RMS error is effectively the same.');
  } else if (difference < 0) {
    result.textContent = phrase('Menor error RMS después del filtro en esta prueba.', 'Lower RMS error after filtering in this test.');
  } else {
    result.textContent = phrase('Mayor error RMS después del filtro en esta prueba.', 'Higher RMS error after filtering in this test.');
  }
  render(frame);
}

function setStage(nextStage, focus) {
  stage = nextStage;
  document.body.dataset.stage = stage;
  document.body.dataset.mode = advanced ? 'advanced' : 'demo';
  byId('steps').hidden = advanced;
  byId('drawing').hidden = !advanced && stage !== 'draw';
  byId('results').hidden = !advanced && stage !== 'compare' && stage !== 'intro';
  byId('visualization').hidden = !advanced && stage !== 'visualize';
  byId('transport').hidden = !advanced && stage !== 'compare' && stage !== 'visualize';
  byId('settings').hidden = !advanced;
  byId('overlay').hidden = !advanced;
  byId('go-3d').hidden = advanced || stage !== 'compare';
  byId('back-compare').hidden = advanced || stage !== 'visualize';
  const activeStep = stage === 'intro' ? 'draw' : stage;
  for (const step of steps) {
    if (step.dataset.step === activeStep) step.setAttribute('aria-current', 'step');
    else step.removeAttribute('aria-current');
  }
  byId('view-description').textContent = advanced
    ? phrase('Mecanismo de dos articulaciones. La punta sigue las coordenadas del recorrido.', 'Two-joint mechanism. Its tip follows the path coordinates.')
    : phrase('Mano y lápiz conceptuales. La punta sigue el recorrido simulado que elijas.', 'Conceptual hand and stylus. The tip follows the selected simulated path.');
  byId('viewport').setAttribute('aria-label', advanced
    ? phrase('Mecanismo articulado', 'Articulated mechanism')
    : phrase('Mano conceptual con lápiz virtual', 'Conceptual hand with virtual stylus'));
  if (!byId('visualization').hidden) {
    showView();
    view?.setConceptual(!advanced);
  }
  if (focus) byId(focus).focus({ preventScroll: false });
  render(frame);
}

function pause() {
  cancelAnimationFrame(animation);
  animation = undefined;
  play.textContent = phrase('Reproducir', 'Play');
}

function tick(now) {
  const elapsed = Math.max(0, now - startedAt);
  const next = Math.min(SAMPLE_COUNT - 1, Math.floor(elapsed * (SAMPLE_COUNT - 1) / (DURATION * 1000)));
  render(next);
  if (next === SAMPLE_COUNT - 1) pause();
  else animation = requestAnimationFrame(tick);
}

function run() {
  if (frame === SAMPLE_COUNT - 1) render(0);
  startedAt = performance.now() - frame * DURATION * 1000 / (SAMPLE_COUNT - 1);
  play.textContent = phrase('Pausar', 'Pause');
  animation = requestAnimationFrame(tick);
}

function compare(nextReference) {
  pause();
  reference = nextReference;
  frame = 0;
  refresh();
  setStage('compare', 'result-title');
  run();
}
const drawing = setupDrawing({ onReference: compare });

byId('start-demo').addEventListener('click', () => setStage('draw', 'draw-title'));
byId('quick-example').addEventListener('click', () => compare(undefined));
byId('go-3d').addEventListener('click', () => {
  setStage('visualize', 'stage-title');
  if (animation === undefined) run();
});
byId('back-compare').addEventListener('click', () => setStage('compare', 'result-title'));
toggle.addEventListener('click', () => {
  pause();
  advanced = !advanced;
  toggle.setAttribute('aria-pressed', String(advanced));
  toggle.textContent = advanced ? phrase('Modo demostración', 'Demonstration mode') : phrase('Modo avanzado', 'Advanced mode');
  setStage(advanced || stage === 'intro' ? 'compare' : stage);
});
play.addEventListener('click', () => {
  if (animation !== undefined) pause();
  else run();
});
seek.addEventListener('input', () => { pause(); render(+seek.value); });
motion.addEventListener('change', () => render(frame));
for (const input of [noise, alpha]) input.addEventListener('input', refresh);
byId('reset').addEventListener('click', () => {
  pause();
  frame = 0;
  motion.value = 'filtered';
  noise.value = DEFAULTS.disturbance * 100;
  alpha.value = DEFAULTS.alpha * 100;
  if (!advanced) {
    reference = undefined;
    drawing.reset();
  }
  refresh();
  setStage(advanced ? 'compare' : 'draw', advanced ? undefined : 'draw-title');
});
byId('camera').addEventListener('click', () => view?.resetCamera());
byId('zoom-in').addEventListener('click', () => view?.zoom(0.8));
byId('zoom-out').addEventListener('click', () => view?.zoom(1.25));

refresh();
setStage('intro');
