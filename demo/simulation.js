export const SAMPLE_COUNT = 121;
export const DURATION = 4;
export const DEFAULTS = Object.freeze({ disturbance: 0.20, strength: 0.65 });

export const DRAW_AREA = Object.freeze({ minX: 2.00, maxX: 3.05, minY: 0.05, maxY: 1.65 });

export function resampleTrace(points) {
  const segments = [];
  let length = 0;
  for (let index = 1; index < points.length; index++) {
    const from = points[index - 1];
    const to = points[index];
    const distance = Math.hypot(to.x - from.x, to.y - from.y);
    if (distance === 0) continue;
    segments.push({ from, to, distance, start: length });
    length += distance;
  }
  if (length < 0.05) return null;
  let segmentIndex = 0;
  return Array.from({ length: SAMPLE_COUNT }, (_, index) => {
    const position = length * index / (SAMPLE_COUNT - 1);
    while (segmentIndex < segments.length - 1) {
      const segment = segments[segmentIndex];
      if (position <= segment.start + segment.distance) break;
      segmentIndex++;
    }
    const { from, to, start, distance } = segments[segmentIndex];
    const portion = Math.min(1, (position - start) / distance);
    return { x: from.x + (to.x - from.x) * portion, y: from.y + (to.y - from.y) * portion };
  });
}

export function simulate({ disturbance, strength }, reference) {
  return Array.from({ length: SAMPLE_COUNT }, (_, index) => {
    const phase = 2 * Math.PI * index / (SAMPLE_COUNT - 1);
    const target = reference?.[index] ?? { x: 2.65 + 0.55 * Math.sin(phase), y: 0.90 + 0.85 * Math.cos(phase) };
    const dx = disturbance * Math.sin(7 * phase);
    const dy = disturbance * 0.75 * Math.sin(11 * phase + 0.4);
    return {
      target,
      baseline: { x: target.x + dx, y: target.y + dy },
      guided: { x: target.x + dx * (1 - strength), y: target.y + dy * (1 - strength) },
    };
  });
}

export function summarize(samples, mode) {
  const errors = samples.map(({ target, [mode]: actual }) =>
    Math.hypot(target.x - actual.x, target.y - actual.y),
  );
  const squared = errors.reduce((sum, error) => sum + error ** 2, 0);
  return { rms: Math.sqrt(squared / errors.length), peak: Math.max(...errors) };
}

export function jointAngles({ x, y }, upper, lower) {
  const cosine = (x ** 2 + y ** 2 - upper ** 2 - lower ** 2) / (2 * upper * lower);
  const elbow = -Math.acos(Math.max(-1, Math.min(1, cosine)));
  const shoulder = Math.atan2(y, x) - Math.atan2(lower * Math.sin(elbow), upper + lower * Math.cos(elbow));
  return { shoulder, elbow };
}
