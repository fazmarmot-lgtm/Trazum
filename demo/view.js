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
  board.position.z = -0.25;
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
    const segment = mesh(parent, new THREE.CapsuleGeometry(0.14, length - 0.28), armMaterial, length / 2);
    segment.rotation.z = Math.PI / 2;
    mesh(parent, new THREE.SphereGeometry(0.21, 24, 16), jointMaterial);
  }
  const base = new THREE.Group();
  const hinge = new THREE.Group();
  scene.add(base);
  link(base, upper);
  base.add(hinge);
  hinge.position.x = upper;
  link(hinge, lower);
  mesh(hinge, new THREE.SphereGeometry(0.12, 20, 12), new THREE.MeshStandardMaterial({ color: 0xffba87 }), lower);

  const targetMaterial = new THREE.LineBasicMaterial({ color: 0x75d6c5 });
  const targetLine = new THREE.Line(new THREE.BufferGeometry(), targetMaterial);
  scene.add(targetLine);
  new ResizeObserver(fit).observe(container);
  fit();

  return {
    move(point) {
      const { shoulder, elbow } = jointAngles(point, upper, lower);
      base.rotation.z = shoulder;
      hinge.rotation.z = elbow;
      draw();
    },
    setTarget(samples) {
      targetLine.geometry.dispose();
      targetLine.geometry = new THREE.BufferGeometry().setFromPoints(samples.map(({ target }) =>
        new THREE.Vector3(target.x, target.y, -0.18),
      ));
      draw();
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
