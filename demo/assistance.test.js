import { test } from 'node:test';
import assert from 'node:assert/strict';
import { assistStroke, EXAMPLE_STROKE } from './assistance.js';
import { resampleTrace, SAMPLE_COUNT } from './simulation.js';

test('line assistance preserves the drawing and makes a straight path between its endpoints', () => {
  const points = resampleTrace([{ x: 2, y: 0 }, { x: 2.4, y: 0.5 }, { x: 3, y: 0 }]);
  const result = assistStroke(points, 'line');
  assert.equal(result.applied, 'line');
  assert.equal(result.samples.length, SAMPLE_COUNT);
  assert.deepEqual(result.samples.map(({ baseline }) => baseline), points);
  assert.deepEqual(result.samples[0].filtered, points[0]);
  assert.deepEqual(result.samples.at(-1).filtered, points.at(-1));
  assert.ok(result.samples.every(({ filtered, target }) => filtered.y === 0 && filtered === target));
  assert.ok(result.displacement.rms > 0);
});

test('line errors measure distance to the segment, independent of the sample timing', () => {
  const points = [{ x: 2, y: 0 }, { x: 2.1, y: 0 }, { x: 3, y: 0 }];
  assert.deepEqual(assistStroke(points, 'line').displacement, { rms: 0, peak: 0 });
});

test('curve assistance preserves endpoints, has no assumed target, and handles closed strokes', () => {
  const closed = resampleTrace([{ x: 2, y: 0 }, { x: 3, y: 0.5 }, { x: 2, y: 0 }]);
  for (const points of [closed, EXAMPLE_STROKE]) {
    const result = assistStroke(points, points === closed ? 'line' : 'smooth');
    assert.equal(result.applied, 'smooth');
    assert.deepEqual(result.samples[0].filtered, points[0]);
    assert.deepEqual(result.samples.at(-1).filtered, points.at(-1));
    assert.ok(result.samples.every(({ target }) => target === null));
    assert.ok(result.displacement.peak > 0);
  }
});
