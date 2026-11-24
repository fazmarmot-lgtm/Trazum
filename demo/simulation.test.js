import { test } from 'node:test';
import assert from 'node:assert/strict';
import { DEFAULTS, DRAW_AREA, SAMPLE_COUNT, jointAngles, resampleTrace, simulate, summarize } from './simulation.js';

test('a run uses the same deterministic input and target at each sample', () => {
  const run = simulate(DEFAULTS);
  assert.equal(run.length, SAMPLE_COUNT);
  assert.deepEqual(run, simulate(DEFAULTS));
  assert.ok(Math.abs(run[0].target.x - run.at(-1).target.x) < 1e-12);
});

test('zero correction matches baseline and perfect correction follows the known target', () => {
  for (const sample of simulate({ ...DEFAULTS, strength: 0 })) assert.deepEqual(sample.baseline, sample.guided);
  for (const sample of simulate({ ...DEFAULTS, strength: 1 })) assert.deepEqual(sample.target, sample.guided);
  const stable = simulate({ ...DEFAULTS, disturbance: 0 });
  assert.deepEqual(summarize(stable, 'baseline'), { rms: 0, peak: 0 });
});

test('default summary measures Euclidean trace error and reflects correction strength', () => {
  assert.deepEqual(summarize([{ target: { x: 0, y: 0 }, baseline: { x: 3, y: 4 } }], 'baseline'), { rms: 5, peak: 5 });
  const run = simulate(DEFAULTS);
  assert.ok(Math.abs(summarize(run, 'guided').rms / summarize(run, 'baseline').rms - 0.35) < 1e-12);
});

test('the stylus reaches each sample across the full allowed disturbance range', () => {
  const upper = 2.18;
  const lower = 1.77;
  for (const sample of simulate({ disturbance: 0.30, strength: 0.65 })) {
    for (const point of Object.values(sample)) {
      const { shoulder, elbow } = jointAngles(point, upper, lower);
      const x = upper * Math.cos(shoulder) + lower * Math.cos(shoulder + elbow);
      const y = upper * Math.sin(shoulder) + lower * Math.sin(shoulder + elbow);
      assert.ok(Math.hypot(x - point.x, y - point.y) < 1e-12);
    }
  }
});

test('custom paths keep their endpoints and sample by distance despite repeated points', () => {
  const a = { x: 2, y: 0.5 };
  const b = { x: 2.25, y: 0.5 };
  const c = { x: 3, y: 0.5 };
  assert.equal(resampleTrace([a, a]), null);
  const path = resampleTrace([a, b, b, c]);
  assert.equal(path.length, SAMPLE_COUNT);
  assert.deepEqual(path[0], a);
  assert.deepEqual(path[60], { x: 2.5, y: 0.5 });
  assert.deepEqual(path.at(-1), c);
  const run = simulate(DEFAULTS, path);
  assert.deepEqual(run.map(({ target }) => target), path);
  assert.deepEqual(run, simulate(DEFAULTS, path));
});

test('the drawing area remains reachable at the highest perturbation', () => {
  const { minX, maxX, minY, maxY } = DRAW_AREA;
  const upper = 2.18;
  const lower = 1.77;
  for (const x of [minX, maxX]) {
    for (const y of [minY, maxY]) {
      const path = Array.from({ length: SAMPLE_COUNT }, () => ({ x, y }));
      for (const { baseline } of simulate({ ...DEFAULTS, disturbance: 0.30 }, path)) {
        const distance = Math.hypot(baseline.x, baseline.y);
        assert.ok(distance > upper - lower && distance < upper + lower);
      }
    }
  }
});
