import { phrase } from './language.js';
import { DRAW_AREA, resampleTrace } from './simulation.js';

export function setupDrawing({ onReference }) {
  const pad = document.getElementById('draw-pad');
  const context = pad.getContext('2d');
  const status = document.getElementById('draw-status');
  let points = [];
  let pointer;
  const cursor = { x: pad.width / 2, y: pad.height / 2 };
  let active = phrase('trazo de ejemplo', 'example stroke');

  function draw() {
    context.clearRect(0, 0, pad.width, pad.height);
    if (points.length) {
      context.beginPath();
      context.lineWidth = 2;
      context.lineCap = 'round';
      context.strokeStyle = '#7dd8c5';
      context.moveTo(points[0].x, points[0].y);
      for (const point of points.slice(1)) context.lineTo(point.x, point.y);
      context.stroke();
    }
    if (document.activeElement === pad && pointer === undefined) {
      context.beginPath();
      context.fillStyle = '#9ac8ff';
      context.arc(cursor.x, cursor.y, 4, 0, Math.PI * 2);
      context.fill();
    }
  }

  function report(message = '') {
    status.textContent = [message, phrase('Trazo activo: ', 'Active stroke: ') + active + '.'].filter(Boolean).join(' ');
  }

  function appendPointer(event) {
    const bounds = pad.getBoundingClientRect();
    const x = (event.clientX - bounds.left) * pad.width / bounds.width;
    const y = (event.clientY - bounds.top) * pad.height / bounds.height;
    points.push({ x: Math.max(0, Math.min(pad.width, x)), y: Math.max(0, Math.min(pad.height, y)) });
    draw();
  }

  pad.addEventListener('pointerdown', (event) => {
    if (pointer !== undefined || event.button !== 0) return;
    pointer = event.pointerId;
    points = [];
    pad.setPointerCapture(pointer);
    appendPointer(event);
  });
  pad.addEventListener('pointermove', (event) => {
    if (event.pointerId === pointer) appendPointer(event);
  });
  pad.addEventListener('pointerup', (event) => {
    if (event.pointerId === pointer) appendPointer(event);
  });
  pad.addEventListener('lostpointercapture', (event) => {
    if (event.pointerId !== pointer) return;
    pointer = undefined;
    draw();
  });

  const keySteps = { ArrowLeft: [-8, 0], ArrowRight: [8, 0], ArrowUp: [0, -8], ArrowDown: [0, 8] };
  pad.addEventListener('keydown', (event) => {
    const step = keySteps[event.key];
    if (!step && event.key !== ' ') return;
    event.preventDefault();
    if (step) {
      cursor.x = Math.max(0, Math.min(pad.width, cursor.x + step[0]));
      cursor.y = Math.max(0, Math.min(pad.height, cursor.y + step[1]));
    } else {
      points.push({ ...cursor });
    }
    draw();
  });
  pad.addEventListener('focus', draw);
  pad.addEventListener('blur', draw);

  document.getElementById('use-drawing').addEventListener('click', () => {
    const { minX, maxX, minY, maxY } = DRAW_AREA;
    const target = resampleTrace(points.map(({ x, y }) => ({
      x: minX + (maxX - minX) * x / pad.width,
      y: maxY - (maxY - minY) * y / pad.height,
    })));
    if (!target) {
      report(phrase('Dibujá un trazo más largo o marcá dos puntos separados.', 'Draw a longer stroke or add two separated points.'));
      return;
    }
    onReference(target);
    active = phrase('tu dibujo', 'your drawing');
    report();
  });
  document.getElementById('clear-drawing').addEventListener('click', () => {
    points = [];
    draw();
    report(phrase('Dibujo borrado.', 'Drawing cleared.'));
  });
  document.getElementById('use-example').addEventListener('click', () => {
    onReference(undefined);
    active = phrase('trazo de ejemplo', 'example stroke');
    report();
  });
  report();
}
