import * as THREE from 'three';
import { radius, segmentCount } from './wheel.js';

export const ball = new THREE.Mesh(
  new THREE.SphereGeometry(0.2, 32, 32),
  new THREE.MeshStandardMaterial({ color: 0xffffff })
);

let spinning = false;
let angle = 0;
let targetSegment = null;

export function startSpin(segment) {
  targetSegment = segment;
  angle = 0;
  spinning = true;
}

export function updateBall() {
  if (!spinning) return;

  angle += 0.15;
  const r = radius - 0.2;
  ball.position.set(Math.cos(angle) * r, 0.3, Math.sin(angle) * r);

  if (angle >= Math.PI * 6) { // environ 3 tours
    const finalAngle = targetSegment * ((2 * Math.PI) / segmentCount) + ((2 * Math.PI) / segmentCount) / 2;
    ball.position.set(Math.cos(finalAngle) * r, 0.3, Math.sin(finalAngle) * r);
    spinning = false;
  }
}
