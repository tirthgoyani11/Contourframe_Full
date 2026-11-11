// Asker figürü — yüzü +x'e dönük, tüfeği önde tutuyor.
const uniform = '#7d7651', vest = '#5f5a3c', helmet = '#4f5340', boot = '#241f18';
const skin = '#caa074', rifle = '#1c1c1f', gear = '#3a3625', pack = '#5a5237';

const box = (w, h, d) => new THREE.BoxGeometry(w, h, d);
const cyl = (rt, rb, h, s) => new THREE.CylinderGeometry(rt, rb, h, s || 12);
const sph = (r, s) => new THREE.SphereGeometry(r, s || 14, s || 12);

// uzuv (eklemler arası konik silindir)
function limb(p1, p2, r, color, name) {
  const a = new THREE.Vector3(p1[0], p1[1], p1[2]);
  const b = new THREE.Vector3(p2[0], p2[1], p2[2]);
  const dir = new THREE.Vector3().subVectors(b, a);
  const m = mesh(cyl(r, r * 1.05, dir.length(), 10), color, { flat: false, rough: 0.8, name: name });
  m.position.set((p1[0] + p2[0]) / 2, (p1[1] + p2[1]) / 2, (p1[2] + p2[2]) / 2);
  m.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir.normalize());
  modelGroup.add(m);
  return m;
}

// ---- bacaklar ----
[-1, 1].forEach((s, i) => {
  const z = s * 0.15;
  limb([0, 1.0, z], [0.04, 0.55, z + s * 0.01], 0.11, uniform, 'ust_bacak_' + (i + 1)); // uyluk
  limb([0.04, 0.55, z], [0.0, 0.12, z], 0.09, uniform, 'alt_bacak_' + (i + 1)); // baldır
  const bt = mesh(box(0.28, 0.13, 0.18), boot, { flat: true, name: 'postal_' + (i + 1) });
  bt.position.set(0.06, 0.065, z);
  modelGroup.add(bt);
});
// kalça
const pelvis = mesh(box(0.34, 0.24, 0.46), uniform, { flat: true, name: 'kalca' });
pelvis.position.set(0, 1.02, 0);
modelGroup.add(pelvis);

// ---- gövde + yelek ----
const torso = mesh(box(0.34, 0.55, 0.52), uniform, { flat: true, name: 'govde' });
torso.position.set(0, 1.33, 0);
modelGroup.add(torso);
const plate = mesh(box(0.14, 0.5, 0.5), vest, { flat: true, name: 'plaka_yelek' });
plate.position.set(0.16, 1.33, 0);
modelGroup.add(plate);
// fişeklik pouch'ları
[[1.35, 0.16], [1.2, 0.16], [1.35, -0.16], [1.2, -0.16]].forEach((p, i) => {
  const po = mesh(box(0.08, 0.14, 0.14), gear, { flat: true, name: 'fiseklik_' + (i + 1) });
  po.position.set(0.22, p[0], p[1]);
  modelGroup.add(po);
});
// sırt çantası
const backpack = mesh(box(0.26, 0.46, 0.42), pack, { flat: true, name: 'sirt_cantasi' });
backpack.position.set(-0.26, 1.34, 0);
modelGroup.add(backpack);

// ---- omuz / kollar (önde tüfek tutar) ----
[-1, 1].forEach((s, i) => {
  const sh = s * 0.27;
  const grip = (s > 0) ? [0.5, 1.28, 0.05] : [0.32, 1.2, -0.02]; // sağ el namluda, sol el kabzada
  limb([0, 1.5, sh], [0.28, 1.32, sh * 0.7], 0.08, uniform, 'ust_kol_' + (i + 1)); // üst kol
  limb([0.28, 1.32, sh * 0.7], grip, 0.07, uniform, 'on_kol_' + (i + 1)); // ön kol
  const hand = mesh(sph(0.07), skin, { name: 'el_' + (i + 1) });
  hand.position.set(grip[0], grip[1], grip[2]);
  modelGroup.add(hand);
});

// ---- boyun + kafa + kask ----
const neck = mesh(cyl(0.07, 0.07, 0.1, 10), skin, { name: 'boyun' });
neck.position.set(0, 1.63, 0);
modelGroup.add(neck);
const head = mesh(sph(0.14), skin, { name: 'kafa' });
head.position.set(0.02, 1.74, 0);
modelGroup.add(head);
const helm = mesh(sph(0.17), helmet, { flat: true, name: 'kask' });
helm.scale.set(1, 0.85, 1);
helm.position.set(0, 1.79, 0);
modelGroup.add(helm);
// kask siperi
const brim = mesh(box(0.12, 0.05, 0.32), helmet, { flat: true, name: 'kask_siperi' });
brim.position.set(0.16, 1.78, 0);
modelGroup.add(brim);
// NVG montajı (kask ön)
const nvg = mesh(box(0.08, 0.08, 0.1), gear, { flat: true, name: 'nvg_montaj' });
nvg.position.set(0.18, 1.84, 0);
modelGroup.add(nvg);

// ---- tüfek (önde, +x'e bakar) ----
const body = mesh(box(0.5, 0.1, 0.06), rifle, { flat: true, name: 'tufek_govde' });
body.position.set(0.42, 1.26, 0.02);
modelGroup.add(body);
const barrel = mesh(cyl(0.022, 0.022, 0.42, 10), rifle, { metal: 0.4, name: 'tufek_namlu' });
barrel.rotation.z = Math.PI / 2;
barrel.position.set(0.82, 1.27, 0.02);
modelGroup.add(barrel);
const mag = mesh(box(0.07, 0.2, 0.05), rifle, { flat: true, name: 'sarjor' });
mag.rotation.z = 0.25;
mag.position.set(0.44, 1.12, 0.02);
modelGroup.add(mag);
const stock = mesh(box(0.22, 0.11, 0.05), rifle, { flat: true, name: 'dipcik' });
stock.position.set(0.13, 1.26, 0.02);
modelGroup.add(stock);
const optic = mesh(box(0.12, 0.08, 0.04), gear, { flat: true, name: 'nisangah' });
optic.position.set(0.4, 1.34, 0.02);
modelGroup.add(optic);
const grip2 = mesh(box(0.06, 0.12, 0.05), rifle, { flat: true, name: 'kabza' });
grip2.rotation.z = -0.2;
grip2.position.set(0.3, 1.14, 0.02);
modelGroup.add(grip2);
