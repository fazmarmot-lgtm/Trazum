import { test } from 'node:test';
import assert from 'node:assert/strict';
import { DEFAULTS, SAMPLE_COUNT, jointAngles, simulate, summarize } from './simulation.js';

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
