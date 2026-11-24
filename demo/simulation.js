export const SAMPLE_COUNT = 121;
export const DURATION = 4;
export const DEFAULTS = Object.freeze({ disturbance: 0.20, strength: 0.65 });

export function simulate({ disturbance, strength }) {
  return Array.from({ length: SAMPLE_COUNT }, (_, index) => {
    const phase = 2 * Math.PI * index / (SAMPLE_COUNT - 1);
    const target = { x: 2.65 + 0.55 * Math.sin(phase), y: 0.90 + 0.85 * Math.cos(phase) };
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
