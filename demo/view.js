import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { jointAngles } from './simulation.js';

export function createView(container) {
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x131f33);
  const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 50);
  const renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
  container.append(renderer.domElement);

  const controls = new OrbitControls(camera, renderer.domElement);
  controls.minDistance = 2.5;
  controls.maxDistance = 14;
  controls.target.set(1.75, 0.82, 0);
  camera.position.set(3.95, -2.6, 6.8);
  controls.update();
  controls.saveState();

  const draw = () => renderer.render(scene, camera);
  controls.addEventListener('change', draw);
  const fit = () => {
    const { clientWidth, clientHeight } = container;
    if (!clientWidth || !clientHeight) return;
    camera.aspect = clientWidth / clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(clientWidth, clientHeight);
    draw();
  };

  scene.add(new THREE.HemisphereLight(0xe0efff, 0x4b5d83, 2.5));
  const key = new THREE.DirectionalLight(0xfff4dc, 3);
  key.position.set(1, 4, 6);
  scene.add(key);
  const board = new THREE.GridHelper(12, 24, 0x2c4260, 0x27364d);
  board.rotation.x = Math.PI / 2;
  board.position.z = -0.025;
  scene.add(board);

  const upper = 2.18;
  const lower = 1.77;
  const armMaterial = new THREE.MeshStandardMaterial({ color: 0x72b3fa, metalness: 0.12, roughness: 0.46 });
  const jointMaterial = new THREE.MeshStandardMaterial({ color: 0xe4efff, roughness: 0.36 });
  function mesh(parent, geometry, material, x = 0) {
    const part = new THREE.Mesh(geometry, material);
    part.position.x = x;
    parent.add(part);
    return part;
  }
  function link(parent, length) {
    const geometry = new THREE.Group();
    parent.add(geometry);
    const segment = mesh(geometry, new THREE.CapsuleGeometry(0.14, length - 0.28), armMaterial, length / 2);
    segment.rotation.z = Math.PI / 2;
    mesh(geometry, new THREE.SphereGeometry(0.21, 24, 16), jointMaterial);
    return geometry;
  }
  const base = new THREE.Group();
  const hinge = new THREE.Group();
  scene.add(base);
  const proximalLink = link(base, upper);
  base.add(hinge);
  hinge.position.x = upper;
  const distalLink = link(hinge, lower);
  const tip = mesh(distalLink, new THREE.SphereGeometry(0.12, 20, 12),
    new THREE.MeshStandardMaterial({ color: 0xffba87 }), lower);

  const grip = new THREE.Group();
  grip.position.x = lower;
  hinge.add(grip);
  const handMaterial = new THREE.MeshStandardMaterial({ color: 0x669bcb, roughness: 0.58 });
  const pencilMaterial = new THREE.MeshStandardMaterial({ color: 0xffbc83, roughness: 0.42 });
  const graphite = new THREE.MeshStandardMaterial({ color: 0x37455c });
  const wood = new THREE.MeshStandardMaterial({ color: 0xffddb2 });

  const palm = mesh(grip, new THREE.SphereGeometry(1, 28, 18), handMaterial, -0.53);
  palm.position.z = 0.38;
  palm.scale.set(0.39, 0.30, 0.15);
  const wrist = mesh(grip, new THREE.CapsuleGeometry(0.16, 0.29), handMaterial, -0.85);
  wrist.position.z = 0.36;
  wrist.rotation.z = Math.PI / 2;
  for (const [index, y] of [-0.21, -0.10, 0.01, 0.12].entries()) {
    const finger = mesh(grip, new THREE.CapsuleGeometry(0.062, 0.31 - index * 0.04), handMaterial, -0.25);
    finger.position.y = y;
    finger.position.z = 0.35;
    finger.rotation.z = Math.PI / 2 - y;
  }
  const thumb = mesh(grip, new THREE.CapsuleGeometry(0.075, 0.23), handMaterial, -0.18);
  thumb.position.set(-0.18, 0.17, 0.46);
  thumb.rotation.z = -Math.PI / 3;
  function pencilPart(geometry, material, z) {
    const part = mesh(grip, geometry, material);
    part.position.z = z;
    part.rotation.x = Math.PI / 2;
  }
  pencilPart(new THREE.CylinderGeometry(0.050, 0.050, 0.94, 10), pencilMaterial, 0.60);
  pencilPart(new THREE.CylinderGeometry(0.050, 0.018, 0.10, 10), wood, 0.08);
  pencilPart(new THREE.CylinderGeometry(0.018, 0, 0.03, 10), graphite, 0.015);
  grip.visible = false;
  let conceptual = false;

  const targetMaterial = new THREE.LineBasicMaterial({ color: 0x75d6c5 });
  const targetLine = new THREE.Line(new THREE.BufferGeometry(), targetMaterial);
  scene.add(targetLine);
  const trailMaterial = new THREE.LineBasicMaterial({ color: 0x93c6ff });
  const trails = {
    filtered: new THREE.Line(new THREE.BufferGeometry(), trailMaterial),
    baseline: new THREE.Line(new THREE.BufferGeometry(), new THREE.LineBasicMaterial({ color: 0xffad82 })),
  };
  scene.add(trails.filtered, trails.baseline);
  new ResizeObserver(fit).observe(container);
  fit();

  return {
    move(sample, kind, index) {
      const { shoulder, elbow } = jointAngles(sample[kind], upper, lower);
      base.rotation.z = shoulder;
      hinge.rotation.z = elbow;
      for (const [name, trail] of Object.entries(trails)) {
        trail.visible = conceptual && name === kind;
        if (trail.visible) trail.geometry.setDrawRange(0, index + 1);
      }
      draw();
    },
    setTarget(samples) {
      targetLine.geometry.dispose();
      targetLine.geometry = new THREE.BufferGeometry().setFromPoints(samples.map(({ target }) =>
        new THREE.Vector3(target.x, target.y, -0.015),
      ));
      for (const [name, trail] of Object.entries(trails)) {
        trail.geometry.dispose();
        trail.geometry = new THREE.BufferGeometry().setFromPoints(samples.map((sample) =>
          new THREE.Vector3(sample[name].x, sample[name].y, -0.008),
        ));
        trail.geometry.setDrawRange(0, 0);
      }
      draw();
    },
    setConceptual(value) {
      if (conceptual === value) return;
      conceptual = value;
      proximalLink.visible = !value;
      distalLink.visible = !value;
      tip.visible = !value;
      grip.visible = value;
      if (value) {
        controls.target.set(2.56, 0.95, 0.17);
        camera.position.set(3.45, -1.15, 3.30);
      } else {
        controls.target.set(1.75, 0.82, 0);
        camera.position.set(3.95, -2.6, 6.8);
      }
      controls.update();
      controls.saveState();
      fit();
    },
    resetCamera() { controls.reset(); },
    zoom(factor) {
      const distance = camera.position.distanceTo(controls.target);
      const next = THREE.MathUtils.clamp(distance * factor, controls.minDistance, controls.maxDistance);
      camera.position.sub(controls.target).setLength(next).add(controls.target);
      controls.update();
    },
  };
}
