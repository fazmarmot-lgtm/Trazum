import { DURATION, SAMPLE_COUNT, jointAngles } from './simulation.js';

export const LINKS = Object.freeze({ upper: 2.18, lower: 1.77 });
export const MODEL = Object.freeze({
  encoderBits: 12,
  sensorDelaySamples: 1,
  estimationTau: 0.07,
  motorTau: 0.045,
  maxMotorAngle: 0.06,
  maxMotorRate: 0.7,
});
const DT = DURATION / (SAMPLE_COUNT - 1);
const ENCODER_STEP = 2 * Math.PI / 2 ** MODEL.encoderBits;
const estimateWeight = 1 - Math.exp(-DT / MODEL.estimationTau);
const motorWeight = 1 - Math.exp(-DT / MODEL.motorTau);
const axes = ['shoulder', 'elbow'];
const clamp = (value, limit) => Math.max(-limit, Math.min(limit, value));

export const EXAMPLE = Array.from({ length: SAMPLE_COUNT }, (_, index) => {
  const progress = index / (SAMPLE_COUNT - 1);
  const bend = 0.57;
  const vertical = progress < bend;
  const local = vertical ? progress / bend : (progress - bend) / (1 - bend);
  const target = vertical
    ? { x: 2.35, y: 1.47 - 0.87 * local }
    : { x: 2.35 + 0.72 * local, y: 0.60 };
  const wobble = 0.072 * Math.sin(2 * Math.PI * 7 * progress) * Math.min(1, 6 * local, 6 * (1 - local));
  const baseline = vertical
    ? { x: target.x + wobble, y: target.y }
    : { x: target.x, y: target.y + wobble };
  return { target, baseline };
});

function position({ shoulder, elbow }) {
  const { upper, lower } = LINKS;
  return {
    x: upper * Math.cos(shoulder) + lower * Math.cos(shoulder + elbow),
    y: upper * Math.sin(shoulder) + lower * Math.sin(shoulder + elbow),
  };
}

export function simulateAssistance(input, gain = 1) {
  const unassisted = input.map(({ baseline }) => jointAngles(baseline, LINKS.upper, LINKS.lower));
  const estimate = { shoulder: 0, elbow: 0 };
  const motor = { shoulder: 0, elbow: 0 };
  return input.map(({ baseline, target }, index) => {
    const sensed = unassisted[Math.max(0, index - MODEL.sensorDelaySamples)];
    const measured = {};
    const assisted = {};
    const command = {};
    for (const axis of axes) {
      measured[axis] = Math.round(sensed[axis] / ENCODER_STEP) * ENCODER_STEP;
      estimate[axis] = index === 0 ? measured[axis]
        : estimate[axis] + estimateWeight * (measured[axis] - estimate[axis]);
      command[axis] = clamp(gain * (estimate[axis] - measured[axis]), MODEL.maxMotorAngle);
      const step = clamp(motorWeight * (command[axis] - motor[axis]), MODEL.maxMotorRate * DT);
      motor[axis] += step;
      assisted[axis] = unassisted[index][axis] + motor[axis];
    }
    // With no motor displacement, retain the input exactly.
    const filtered = motor.shoulder === 0 && motor.elbow === 0 ? baseline : position(assisted);
    return { baseline, target, filtered, measured, command, motor: { ...motor } };
  });
}
