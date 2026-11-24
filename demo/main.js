import './style.css';
import { DURATION, DEFAULTS, SAMPLE_COUNT, simulate, summarize } from './simulation.js';
import { createView } from './view.js';

const byId = (id) => document.getElementById(id);
const seek = byId('seek');
seek.max = SAMPLE_COUNT - 1;
const mode = byId('mode');
const noise = byId('noise');
const gain = byId('gain');
const play = byId('play');
const chart = byId('trace');
const context = chart.getContext('2d');
let view;
try {
  view = createView(byId('viewport'));
} catch {
  byId('view-status').textContent = '3D needs WebGL. The trace, timeline, and measurements are still available.';
  for (const id of ['camera', 'zoom-in', 'zoom-out']) byId(id).disabled = true;
}

let samples;
let frame = 0;
let animation;
let start;
const colors = { target: '#7dd8c5', baseline: '#ffac84', guided: '#75b4ff' };
const project = ({ x, y }) => [(x - 1.65) * 172, chart.height - (y + 0.25) * 99];

function drawTrace() {
  context.clearRect(0, 0, chart.width, chart.height);
  for (const [kind, color] of Object.entries(colors)) {
    context.beginPath();
    context.strokeStyle = color;
    context.lineWidth = 2.5;
    context.setLineDash(kind === 'target' ? [5, 4] : []);
    for (const [index, sample] of samples.entries()) {
      const [x, y] = project(sample[kind]);
      if (index === 0) context.moveTo(x, y);
      else context.lineTo(x, y);
    }
    context.stroke();
  }
  context.beginPath();
  context.fillStyle = colors[mode.value];
  context.arc(...project(samples[frame][mode.value]), 5, 0, 2 * Math.PI);
  context.fill();
}

function render(index) {
  frame = index;
  seek.value = frame;
  byId('time').textContent = (DURATION * frame / (SAMPLE_COUNT - 1)).toFixed(2) + ' s';
  view?.move(samples[frame][mode.value]);
  drawTrace();
}

function refresh() {
  byId('noise-value').textContent = (+noise.value / 100).toFixed(2) + ' vu';
  byId('gain-value').textContent = gain.value + '%';
  samples = simulate({ disturbance: +noise.value / 100, strength: +gain.value / 100 });
  view?.setTarget(samples);
  for (const kind of ['baseline', 'guided']) {
    for (const [metric, value] of Object.entries(summarize(samples, kind))) {
      byId(kind + '-' + metric).textContent = value.toFixed(3);
    }
  }
  render(frame);
}

function pause() {
  cancelAnimationFrame(animation);
  animation = undefined;
  play.textContent = frame === SAMPLE_COUNT - 1 ? 'Run again' : 'Run';
}

function tick(now) {
  const next = Math.min(SAMPLE_COUNT - 1, Math.floor((now - start) * (SAMPLE_COUNT - 1) / (DURATION * 1000)));
  render(next);
  if (next === SAMPLE_COUNT - 1) pause();
  else animation = requestAnimationFrame(tick);
}

play.addEventListener('click', () => {
  if (animation !== undefined) {
    pause();
    return;
  }
  if (frame === SAMPLE_COUNT - 1) render(0);
  start = performance.now() - frame * DURATION * 1000 / (SAMPLE_COUNT - 1);
  play.textContent = 'Pause';
  animation = requestAnimationFrame(tick);
});
seek.addEventListener('input', () => { pause(); render(+seek.value); });
mode.addEventListener('change', () => render(frame));
for (const input of [noise, gain]) input.addEventListener('input', refresh);
byId('reset').addEventListener('click', () => {
  pause();
  frame = 0;
  mode.value = 'baseline';
  noise.value = DEFAULTS.disturbance * 100;
  gain.value = DEFAULTS.strength * 100;
  play.textContent = 'Run';
  refresh();
});
byId('camera').addEventListener('click', () => view?.resetCamera());
byId('zoom-in').addEventListener('click', () => view?.zoom(0.8));
byId('zoom-out').addEventListener('click', () => view?.zoom(1.25));
refresh();
