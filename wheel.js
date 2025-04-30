import * as THREE from 'three';

export const segmentCount = 36;
export const radius = 5;
const angleStep = (2 * Math.PI) / segmentCount;
const colors = ['#ff0000', '#000000', '#008000']; // rouge, noir, vert

export function createWheel() {
  const wheelGroup = new THREE.Group();

  for (let i = 0; i < segmentCount; i++) {
    const shape = new THREE.Shape();
    const startAngle = i * angleStep;
    const endAngle = startAngle + angleStep;

    shape.moveTo(0, 0);
    shape.arc(0, 0, radius, startAngle, endAngle, false);
    shape.lineTo(0, 0);

    const geometry = new THREE.ShapeGeometry(shape);
    const color = (i === 35) ? colors[2] : colors[i % 2];

    const material = new THREE.MeshStandardMaterial({
      color,
      roughness: 0.2,
    });

    const mesh = new THREE.Mesh(geometry, material);
    mesh.rotation.x = -Math.PI / 2;
    wheelGroup.add(mesh);
  }

  // Numéros
  for (let i = 0; i < segmentCount; i++) {
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 256;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#fff';
    ctx.font = 'bold 80px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(i.toString(), canvas.width / 2, canvas.height / 2);

    const texture = new THREE.CanvasTexture(canvas);
    texture.anisotropy = 16;
    const material = new THREE.SpriteMaterial({ map: texture });
    const sprite = new THREE.Sprite(material);

    const angle = i * angleStep + angleStep / 2;
    const x = Math.cos(angle) * (radius - 0.4);
    const z = Math.sin(angle) * (radius - 0.4);
    sprite.position.set(x, 0.1, z);
    sprite.scale.set(1, 1, 1);

    wheelGroup.add(sprite);
  }

  return wheelGroup;
}