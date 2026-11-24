import { test } from 'node:test';
import assert from 'node:assert/strict';
import { DEFAULTS, DRAW_AREA, SAMPLE_COUNT, filterMeasurements, jointAngles, resampleTrace, simulate, summarize } from './simulation.js';

test('a run uses the same deterministic input and target at each sample', () => {
  const run = simulate(DEFAULTS);
  assert.equal(run.length, SAMPLE_COUNT);
  assert.deepEqual(run, simulate(DEFAULTS));
  assert.ok(Math.abs(run[0].target.x - run.at(-1).target.x) < 1e-12);
});

test('full sample weight bypasses filtering, including after initialization', () => {
  const run = simulate({ ...DEFAULTS, alpha: 1 });
  assert.deepEqual(run.map(({ filtered }) => filtered), run.map(({ baseline }) => baseline));
  const stable = simulate({ ...DEFAULTS, disturbance: 0 });
  assert.deepEqual(summarize(stable, 'baseline'), { rms: 0, peak: 0 });
  assert.ok(summarize(stable, 'filtered').rms > 0);
});

test('filter uses only the input prefix and has the expected step response', () => {
  const start = { x: 0, y: 0 };
  const step = { x: 8, y: 4 };
  const points = [start, step, step, step];
  const filtered = filterMeasurements(points, 0.5);
  assert.deepEqual(filtered, [start, { x: 4, y: 2 }, { x: 6, y: 3 }, { x: 7, y: 3.5 }]);
  assert.deepEqual(filterMeasurements(points.slice(0, 3), 0.5), filtered.slice(0, 3));
});

test('metrics measure same-time Euclidean error without time alignment', () => {
  assert.deepEqual(summarize([{ target: { x: 0, y: 0 }, baseline: { x: 3, y: 4 } }], 'baseline'), { rms: 5, peak: 5 });
  const run = simulate(DEFAULTS);
  assert.ok(summarize(run, 'filtered').rms < summarize(run, 'baseline').rms);
});

test('the stylus reaches each sample across the full allowed disturbance range', () => {
  const upper = 2.18;
  const lower = 1.77;
  for (const sample of simulate({ disturbance: 0.30, alpha: 0.35 })) {
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
      for (const { baseline, filtered } of simulate({ ...DEFAULTS, disturbance: 0.30 }, path)) {
        for (const point of [baseline, filtered]) {
          const distance = Math.hypot(point.x, point.y);
          assert.ok(distance > upper - lower && distance < upper + lower);
        }
      }
    }
  }
});
