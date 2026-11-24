import './style.css';
import { DURATION, DEFAULTS, SAMPLE_COUNT, simulate, summarize } from './simulation.js';
import { createView } from './view.js';
import { setupDrawing } from './drawing.js';
import { english, localize, phrase } from './language.js';

localize();
const byId = (id) => document.getElementById(id);
const seek = byId('seek');
seek.max = SAMPLE_COUNT - 1;
const mode = byId('mode');
const noise = byId('noise');
const alpha = byId('alpha');
const play = byId('play');
const chart = byId('trace');
const context = chart.getContext('2d');
const number = new Intl.NumberFormat(english ? 'en' : 'es-AR', { minimumFractionDigits: 3, maximumFractionDigits: 3 });
let view;
try {
  view = createView(byId('viewport'));
} catch {
  byId('view-status').textContent = phrase('Tu navegador no pudo abrir la vista 3D. Podés seguir usando el gráfico.', 'Your browser could not open the 3D view. You can still use the plot.');
  for (const id of ['camera', 'zoom-in', 'zoom-out']) byId(id).disabled = true;
}

let samples;
let reference;
let frame = 0;
let animation;
let start;
const colors = { baseline: '#ffac84', filtered: '#75b4ff', target: '#7dd8c5' };
let project;

function fitTrace(samples) {
  const points = samples.flatMap(({ baseline, filtered, target }) => [baseline, filtered, target]);
  const xs = points.map(({ x }) => x);
  const ys = points.map(({ y }) => y);
  const minX = Math.min(...xs);
  const maxX = Math.max(...xs);
  const minY = Math.min(...ys);
  const maxY = Math.max(...ys);
  const scale = Math.min((chart.width - 72) / Math.max(0.2, maxX - minX),
    (chart.height - 60) / Math.max(0.2, maxY - minY));
  return ({ x, y }) => [chart.width / 2 + (x - (minX + maxX) / 2) * scale,
    chart.height / 2 - (y - (minY + maxY) / 2) * scale];
}

function drawTrace() {
  context.clearRect(0, 0, chart.width, chart.height);
  for (const [kind, color] of Object.entries(colors)) {
    context.beginPath();
    context.strokeStyle = color;
    context.lineWidth = kind === 'target' ? 3.2 : 2.5;
    context.setLineDash(kind === 'target' ? [5, 4] : []);
    for (const [index, sample] of samples.entries()) {
      const [x, y] = project(sample[kind]);
      if (index === 0) context.moveTo(x, y);
      else context.lineTo(x, y);
    }
    context.stroke();
  }
  for (const kind of ['baseline', 'filtered']) {
    context.beginPath();
    context.fillStyle = colors[kind];
    context.arc(...project(samples[frame][kind]), 5, 0, 2 * Math.PI);
    context.fill();
  }
}

function render(index) {
  frame = index;
  seek.value = frame;
  byId('time').textContent = (DURATION * frame / (SAMPLE_COUNT - 1)).toFixed(2) + ' s';
  view?.move(samples[frame][mode.value]);
  drawTrace();
}

function refresh() {
  byId('noise-value').textContent = (+noise.value / 100).toFixed(2);
  byId('alpha-value').textContent = alpha.value + '%';
  byId('current-reference').textContent = reference
    ? phrase('Objetivo: tu trazo.', 'Target: your stroke.')
    : phrase('Objetivo: trazo de ejemplo.', 'Target: example stroke.');
  samples = simulate({ ...DEFAULTS, disturbance: +noise.value / 100, alpha: +alpha.value / 100 }, reference);
  project = fitTrace(samples);
  view?.setTarget(samples);
  const measures = { baseline: summarize(samples, 'baseline'), filtered: summarize(samples, 'filtered') };
  for (const [kind, metrics] of Object.entries(measures)) {
    for (const [metric, value] of Object.entries(metrics)) byId(kind + '-' + metric).textContent = number.format(value);
  }
  const difference = measures.filtered.rms - measures.baseline.rms;
  const result = byId('interpretation');
  if (Math.abs(difference) < 0.0005) {
    result.textContent = phrase('El error RMS es prácticamente igual.', 'RMS error is effectively the same.');
  } else if (difference < 0) {
    result.textContent = phrase('El filtro queda más cerca del objetivo en esta prueba (menor RMS).', 'The filter stays closer to the target in this test (lower RMS).');
  } else {
    result.textContent = phrase('El filtro se aleja más del objetivo en esta prueba (mayor RMS).', 'The filter strays farther from the target in this test (higher RMS).');
  }
  render(frame);
}

function pause() {
  cancelAnimationFrame(animation);
  animation = undefined;
  play.textContent = phrase('Reproducir comparación', 'Play comparison');
}

function tick(now) {
  const elapsed = Math.max(0, now - start);
  const next = Math.min(SAMPLE_COUNT - 1, Math.floor(elapsed * (SAMPLE_COUNT - 1) / (DURATION * 1000)));
  render(next);
  if (next === SAMPLE_COUNT - 1) pause();
  else animation = requestAnimationFrame(tick);
}

function run() {
  if (frame === SAMPLE_COUNT - 1) render(0);
  start = performance.now() - frame * DURATION * 1000 / (SAMPLE_COUNT - 1);
  play.textContent = phrase('Pausar', 'Pause');
  animation = requestAnimationFrame(tick);
}

play.addEventListener('click', () => {
  if (animation !== undefined) pause();
  else run();
});
seek.addEventListener('input', () => { pause(); render(+seek.value); });
mode.addEventListener('change', () => render(frame));
for (const input of [noise, alpha]) input.addEventListener('input', refresh);
byId('reset').addEventListener('click', () => {
  pause();
  frame = 0;
  mode.value = 'filtered';
  noise.value = DEFAULTS.disturbance * 100;
  alpha.value = DEFAULTS.alpha * 100;
  refresh();
});

const toggle = byId('toggle-draw');
const drawing = byId('drawing');
function showDrawing(show) {
  drawing.hidden = !show;
  toggle.setAttribute('aria-expanded', String(show));
}
toggle.addEventListener('click', () => {
  showDrawing(drawing.hidden);
  if (!drawing.hidden) byId('draw-pad').focus();
});
setupDrawing({
  onReference(nextReference) {
    pause();
    reference = nextReference;
    frame = 0;
    refresh();
    showDrawing(false);
    play.focus();
    run();
  },
});

byId('camera').addEventListener('click', () => view?.resetCamera());
byId('zoom-in').addEventListener('click', () => view?.zoom(0.8));
byId('zoom-out').addEventListener('click', () => view?.zoom(1.25));
refresh();
