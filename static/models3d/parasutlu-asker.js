// Paraşütlü asker — havada süzülür. Kubbe üstte, asker altta, ipler arada.
const canopyCol = '#5a6340', canopyDk = '#4a5234', line = '#c9c3b2';
const uniform = '#6b6f4e', vest = '#4a4d3a', helmet = '#4f5340', boot = '#241f18';
const skin = '#caa074', reserve = '#5a5237', rifle = '#1c1c1f', metal = '#7e8378';
modelGroup.userData.noGround = true;

const box = (w, h, d) => new THREE.BoxGeometry(w, h, d);
const cyl = (rt, rb, h, s) => new THREE.CylinderGeometry(rt, rb, h, s || 12);
const sph = (r, s) => new THREE.SphereGeometry(r, s || 14, s || 12);

function limb(p1, p2, r, color, name) {
  const a = new THREE.Vector3(p1[0], p1[1], p1[2]);
  const b = new THREE.Vector3(p2[0], p2[1], p2[2]);
  const dir = new THREE.Vector3().subVectors(b, a);
  const m = mesh(cyl(r, r * 1.05, dir.length(), 10), color, { rough: 0.8, name: name });
  m.position.set((p1[0] + p2[0]) / 2, (p1[1] + p2[1]) / 2, (p1[2] + p2[2]) / 2);
  m.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir.normalize());
  modelGroup.add(m);
  return m;
}

// ---- paraşüt kubbesi (üst kep, çift taraflı) ----
const CY = 4.0, CR = 1.85;
const canopyGeo = new THREE.SphereGeometry(CR, 20, 12, 0, Math.PI * 2, 0, Math.PI * 0.56);
const canopy = mesh(canopyGeo, canopyCol, { rough: 0.85, flat: false, name: 'parasut' });
canopy.material.side = THREE.DoubleSide;
canopy.position.y = CY;
modelGroup.add(canopy);
// gore çizgileri (meridyenler)
for (let i = 0; i < 8; i++) {
  const a = i * Math.PI / 4;
  const gore = mesh(box(0.04, 0.04, CR * 1.05), canopyDk, { name: 'gore' });
  gore.position.set(Math.cos(a) * CR * 0.5, CY + 0.55, Math.sin(a) * CR * 0.5);
  gore.rotation.y = -a;
  gore.rotation.x = Math.PI / 2 * 0.0;
  modelGroup.add(gore);
}
// apeks bacası
const vent = mesh(cyl(0.18, 0.22, 0.16, 14), canopyDk, { name: 'apeks_bacasi' });
vent.position.set(0, CY + CR - 0.05, 0);
modelGroup.add(vent);

// rim (kubbe alt kenarı) parametreleri
const rimY = CY + CR * Math.cos(Math.PI * 0.56); // ~3.72
const rimR = CR * Math.sin(Math.PI * 0.56);       // ~1.78
const conv = [0, 2.95, 0]; // ip toplanma noktası (askerin üstü)

// ---- askı ipleri (12) ----
for (let i = 0; i < 12; i++) {
  const a = i * Math.PI * 2 / 12;
  limb(conv, [Math.cos(a) * rimR * 0.95, rimY, Math.sin(a) * rimR * 0.95], 0.012, line, 'ip_' + (i + 1));
}
// risalar (toplanma -> omuzlar)
limb(conv, [0.2, 2.45, 0.05], 0.025, line, 'risa_1');
limb(conv, [-0.2, 2.45, 0.05], 0.025, line, 'risa_2');

// ---- asker (asılı pozisyon) ----
const pelvis = mesh(box(0.34, 0.24, 0.44), uniform, { flat: true, name: 'kalca' });
pelvis.position.set(0, 1.92, 0);
modelGroup.add(pelvis);
const torso = mesh(box(0.36, 0.55, 0.5), uniform, { flat: true, name: 'govde' });
torso.position.set(0, 2.2, 0);
modelGroup.add(torso);
// yedek paraşüt (önde)
const res = mesh(box(0.34, 0.32, 0.22), reserve, { flat: true, name: 'yedek_parasut' });
res.position.set(0.2, 2.05, 0);
modelGroup.add(res);
// sırt çantası
const pack = mesh(box(0.26, 0.4, 0.4), vest, { flat: true, name: 'sirt_cantasi' });
pack.position.set(-0.24, 2.2, 0);
modelGroup.add(pack);

// bacaklar (asılı, hafif bükük)
[-1, 1].forEach((s, i) => {
  const z = s * 0.14;
  limb([0, 1.9, z], [0.12, 1.45, z + s * 0.01], 0.11, uniform, 'ust_bacak_' + (i + 1));
  limb([0.12, 1.45, z], [0.16, 1.02, z], 0.09, uniform, 'alt_bacak_' + (i + 1));
  const bt = mesh(box(0.26, 0.13, 0.18), boot, { flat: true, name: 'postal_' + (i + 1) });
  bt.position.set(0.22, 0.97, z);
  modelGroup.add(bt);
});
// kollar (yukarı, risaları tutar)
[-1, 1].forEach((s, i) => {
  const sh = s * 0.24;
  limb([0, 2.42, sh], [0.05, 2.65, sh * 0.7], 0.075, uniform, 'ust_kol_' + (i + 1));
  limb([0.05, 2.65, sh * 0.7], [0.16, 2.85, s * 0.06], 0.065, uniform, 'on_kol_' + (i + 1));
  const hand = mesh(sph(0.07), skin, { name: 'el_' + (i + 1) });
  hand.position.set(0.16, 2.85, s * 0.06);
  modelGroup.add(hand);
});
// boyun + kafa + kask
const neck = mesh(cyl(0.07, 0.07, 0.09, 10), skin, { name: 'boyun' });
neck.position.set(0, 2.53, 0);
modelGroup.add(neck);
const head = mesh(sph(0.14), skin, { name: 'kafa' });
head.position.set(0.02, 2.64, 0);
modelGroup.add(head);
const helm = mesh(sph(0.17), helmet, { flat: true, name: 'kask' });
helm.scale.set(1, 0.85, 1);
helm.position.set(0, 2.69, 0);
modelGroup.add(helm);

// ---- omuza asılı tüfek ----
const gun = mesh(box(0.6, 0.1, 0.06), rifle, { flat: true, name: 'tufek' });
gun.rotation.z = 0.5;
gun.position.set(-0.05, 2.1, 0.32);
modelGroup.add(gun);
