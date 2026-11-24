import { SAMPLE_COUNT, resampleTrace } from './simulation.js';

export const EXAMPLE_STROKE = resampleTrace(Array.from({ length: SAMPLE_COUNT }, (_, index) => {
  const progress = index / (SAMPLE_COUNT - 1);
  return {
    x: 2.08 + 0.93 * progress,
    y: 0.78 + 0.13 * Math.sin(5 * Math.PI * progress) + 0.04 * Math.sin(27 * Math.PI * progress),
  };
}));

function smoothStroke(points) {
  let current = points;
  for (let pass = 0; pass < 4; pass++) {
    current = current.map((point, index) => {
      if (index === 0 || index === current.length - 1) return point;
      const before = current[Math.max(0, index - 3)];
      const after = current[Math.min(current.length - 1, index + 3)];
      return {
        x: (before.x + 2 * point.x + after.x) / 4,
        y: (before.y + 2 * point.y + after.y) / 4,
      };
    });
  }
  return current;
}

export function assistStroke(points, intent) {
  const first = points[0];
  const last = points.at(-1);
  const dx = last.x - first.x;
  const dy = last.y - first.y;
  const span = Math.max(...points.map((point) => Math.hypot(point.x - first.x, point.y - first.y)));
  const applied = intent === 'line' && Math.hypot(dx, dy) > 0.10 * span ? 'line' : 'smooth';
  const smoothed = applied === 'smooth' ? smoothStroke(points) : undefined;
  const samples = points.map((baseline, index) => {
    if (smoothed) return { baseline, filtered: smoothed[index], target: null };
    const progress = index / (points.length - 1);
    const target = index === points.length - 1
      ? last
      : { x: first.x + dx * progress, y: first.y + dy * progress };
    return { baseline, filtered: target, target };
  });
  const distances = samples.map(({ baseline, filtered }) => {
    if (applied === 'smooth') return Math.hypot(filtered.x - baseline.x, filtered.y - baseline.y);
    const position = ((baseline.x - first.x) * dx + (baseline.y - first.y) * dy) / (dx * dx + dy * dy);
    const along = Math.max(0, Math.min(1, position));
    return Math.hypot(baseline.x - (first.x + along * dx), baseline.y - (first.y + along * dy));
  });
  return {
    samples,
    applied,
    displacement: {
      rms: Math.sqrt(distances.reduce((sum, distance) => sum + distance ** 2, 0) / distances.length),
      peak: Math.max(...distances),
    },
  };
}
