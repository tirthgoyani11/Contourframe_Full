// Füze — dikey, +y (yukarı) yönüne bakar
const bodyCol = '#dfe3e9', noseCol = '#c0392b', band = '#b23a2e';
const finCol = '#3f444c', tailCol = '#b9bec6', nozzleCol = '#2a2a2e', ringCol = '#9aa0aa';
const R = 0.5;

// ---- gövde ----
const body = mesh(new THREE.CylinderGeometry(R, R, 4.0, 28), bodyCol, { rough: 0.5, metal: 0.1, name: 'govde' });
body.position.y = 2.8;        // 0.80 -> 4.80
modelGroup.add(body);

// ---- burun konisi ----
const cone = mesh(new THREE.ConeGeometry(R, 1.4, 28), noseCol, { rough: 0.5, name: 'burun' });
cone.position.y = 5.5;        // 4.80 -> 6.20
modelGroup.add(cone);

const tip = mesh(new THREE.SphereGeometry(0.05, 12, 12), noseCol, { name: 'burun_ucu' });
tip.position.y = 6.2;
modelGroup.add(tip);

// ---- alt daralma (boattail) + nozül ----
const boat = mesh(new THREE.CylinderGeometry(R, 0.4, 0.55, 28), tailCol, { rough: 0.5, metal: 0.2, name: 'boattail' });
boat.position.y = 0.55;       // 0.275 -> 0.825
modelGroup.add(boat);

const noz = mesh(new THREE.CylinderGeometry(0.24, 0.34, 0.4, 20), nozzleCol, { metal: 0.6, rough: 0.35, name: 'nozul' });
noz.position.y = 0.28;        // 0.08 -> 0.48
modelGroup.add(noz);

// ---- detay bantları ----
[1.4, 3.6].forEach((y, i) => {
  const b = mesh(new THREE.CylinderGeometry(R + 0.03, R + 0.03, 0.16, 28), band, { rough: 0.5, name: 'bant_' + (i + 1) });
  b.position.y = y;
  modelGroup.add(b);
});

// ---- guidance halkası (üst) ----
const gring = mesh(new THREE.CylinderGeometry(R + 0.02, R + 0.02, 0.3, 28), ringCol, { metal: 0.3, rough: 0.5, name: 'guidance' });
gring.position.y = 4.45;
modelGroup.add(gring);

// Füze kanadı profili — süpürülmüş (swept) clipped-delta.
// Yerel düzlem: x = dışa açıklık (span), y = dikey kiriş (chord), z = kalınlık.
function finGeo(rootChord, span, leadSweep, tipChord, thick) {
  const s = new THREE.Shape();
  s.moveTo(0, 0);                                       // kök arka-alt
  s.lineTo(span, rootChord - leadSweep - tipChord);    // uç arka-alt (hafif süpürme)
  s.lineTo(span, rootChord - leadSweep);               // uç ön-üst
  s.lineTo(0, rootChord);                               // kök ön-üst
  s.closePath();
  const g = new THREE.ExtrudeGeometry(s, { depth: thick, bevelEnabled: false, steps: 1 });
  g.translate(0, 0, -thick / 2);                        // kalınlığı ortala
  return g;
}

// ---- kuyruk kanatları (4 adet) ----
for (let i = 0; i < 4; i++) {
  const a = i * Math.PI / 2;
  const fin = mesh(finGeo(1.4, 0.95, 0.85, 0.4, 0.06), finCol, { flat: true, name: 'kanat_' + (i + 1) });
  fin.position.set(Math.cos(a) * 0.42, 0.0, Math.sin(a) * 0.42);
  fin.rotation.y = -a;
  modelGroup.add(fin);
}

// ---- ön kanatçıklar / canard (4 adet) ----
for (let i = 0; i < 4; i++) {
  const a = i * Math.PI / 2 + Math.PI / 4;
  const c = mesh(finGeo(0.55, 0.45, 0.3, 0.16, 0.05), finCol, { flat: true, name: 'canard_' + (i + 1) });
  c.position.set(Math.cos(a) * 0.46, 3.75, Math.sin(a) * 0.46);
  c.rotation.y = -a;
  modelGroup.add(c);
}
