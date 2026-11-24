import { test } from 'node:test';
import assert from 'node:assert/strict';
import { EXAMPLE, LINKS, MODEL, simulateAssistance } from './assistance.js';
import { DRAW_AREA, DURATION, SAMPLE_COUNT, jointAngles, resampleTrace, summarize } from './simulation.js';

test('the virtual motors only respond after a new measurement arrives', () => {
  const run = simulateAssistance(EXAMPLE);
  assert.deepEqual(run[0].motor, { shoulder: 0, elbow: 0 });
  assert.deepEqual(run[1].motor, run[0].motor);
  assert.deepEqual(run[1].measured, run[0].measured);
  const prefix = simulateAssistance(EXAMPLE.slice(0, 45));
  assert.deepEqual(prefix, run.slice(0, 45));
});

test('encoder output is quantized and motor travel and speed are bounded', () => {
  const step = 2 * Math.PI / 2 ** MODEL.encoderBits;
  const maxStep = MODEL.maxMotorRate * DURATION / (SAMPLE_COUNT - 1);
  const corners = resampleTrace([
    { x: DRAW_AREA.minX, y: DRAW_AREA.minY }, { x: DRAW_AREA.maxX, y: DRAW_AREA.maxY },
    { x: DRAW_AREA.minX, y: DRAW_AREA.maxY }, { x: DRAW_AREA.maxX, y: DRAW_AREA.minY },
  ]);
  const run = simulateAssistance(corners.map((baseline) => ({ baseline, target: null })));
  for (const [index, sample] of run.entries()) {
    for (const axis of ['shoulder', 'elbow']) {
      const value = sample.measured[axis] / step;
      assert.ok(Math.abs(value - Math.round(value)) < 1e-9);
      assert.ok(Math.abs(sample.motor[axis]) <= MODEL.maxMotorAngle + 1e-12);
      if (index) assert.ok(Math.abs(sample.motor[axis] - run[index - 1].motor[axis]) <= maxStep + 1e-12);
    }
    const { shoulder, elbow } = jointAngles(sample.filtered, LINKS.upper, LINKS.lower);
    const x = LINKS.upper * Math.cos(shoulder) + LINKS.lower * Math.cos(shoulder + elbow);
    const y = LINKS.upper * Math.sin(shoulder) + LINKS.lower * Math.sin(shoulder + elbow);
    assert.ok(Math.hypot(x - sample.filtered.x, y - sample.filtered.y) < 1e-10);
  }
});

test('zero assistance preserves the input, and the example keeps measurable residual error', () => {
  const disabled = simulateAssistance(EXAMPLE, 0);
  assert.deepEqual(disabled.map(({ filtered }) => filtered), EXAMPLE.map(({ baseline }) => baseline));
  const run = simulateAssistance(EXAMPLE);
  const before = summarize(run, 'baseline');
  const after = summarize(run, 'filtered');
  assert.ok(after.rms < before.rms, JSON.stringify({ before, after }));
  assert.ok(after.rms > 0.005);
});

test('the controller never sees the ideal letter or a user-supplied target', () => {
  const input = EXAMPLE.map(({ baseline }) => ({ baseline, target: null }));
  const result = simulateAssistance(input);
  assert.ok(result.every(({ target }) => target === null));
  assert.deepEqual(result.map(({ filtered }) => filtered), simulateAssistance(EXAMPLE).map(({ filtered }) => filtered));
});
