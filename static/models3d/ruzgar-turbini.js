// Tekli rüzgâr türbini — rotor +x'e bakar, yatay eksende döner.
const towerC = '#e4e6e3', nacelleC = '#cfd2cd', bladeC = '#eef0ee', hubC = '#c0c3be';
const baseC = '#7e8279', door = '#34383c', grass = '#46523a';

const box = (w, h, d) => new THREE.BoxGeometry(w, h, d);
const cyl = (rt, rb, h, s) => new THREE.CylinderGeometry(rt, rb, h, s || 16);

// zemin
const ground = mesh(box(7, 0.1, 7), grass, { flat: true, rough: 1, name: 'zemin' });
ground.position.set(0, 0.05, 0);
modelGroup.add(ground);

// temel + kule + kapı
const found = mesh(cyl(0.55, 0.7, 0.3, 16), baseC, { flat: true, name: 'temel' });
found.position.set(0, 0.25, 0); modelGroup.add(found);
const H = 7.0;
const tower = mesh(cyl(0.16, 0.4, H, 16), towerC, { flat: false, rough: 0.6, name: 'kule' });
tower.position.set(0, H / 2 + 0.1, 0); modelGroup.add(tower);
const dr = mesh(box(0.3, 0.5, 0.08), door, { name: 'kapi' });
dr.position.set(0, 0.45, 0.36); modelGroup.add(dr);

// nacelle (hafif geride, hub öne taşar)
const nac = mesh(box(1.3, 0.55, 0.55), nacelleC, { flat: true, rough: 0.6, name: 'nacelle' });
nac.position.set(-0.15, H + 0.2, 0); modelGroup.add(nac);

// rotor (dönen): göbek konisi + 3 kanat
const HUBX = 0.65, HY = H + 0.2;
const rotor = spin({ pivot: [HUBX, HY, 0], axis: 'x', rpm: 24 });
const hubCone = mesh(cyl(0.0, 0.28, 0.55, 16), hubC, { flat: false, name: 'gobek' });
hubCone.rotation.z = -Math.PI / 2; // sivri uç +x
hubCone.position.set(0.2, 0, 0); rotor.add(hubCone);

// kanat geometrisi: kökte geniş, uca daralan; x'te ince (rüzgâra dik yüzey)
const bs = new THREE.Shape();
bs.moveTo(-0.22, 0); bs.lineTo(0.22, 0); bs.lineTo(0.05, 4.0); bs.lineTo(-0.05, 4.0); bs.closePath();
const bladeGeo = new THREE.ExtrudeGeometry(bs, { depth: 0.07, bevelEnabled: false, steps: 1 });
bladeGeo.translate(0, 0, -0.035);
bladeGeo.rotateY(Math.PI / 2); // kalınlık x ekseninde
for (let i = 0; i < 3; i++) {
  const bl = mesh(bladeGeo, bladeC, { flat: false, rough: 0.5, name: 'kanat_' + (i + 1) });
  bl.rotation.x = i * 2 * Math.PI / 3;
  rotor.add(bl);
}
