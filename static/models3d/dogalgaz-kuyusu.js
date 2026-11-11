// Doğalgaz kuyubaşı (Christmas tree).
const steel = '#8a8f96', flange = '#7c8084', valveR = '#b23a2e', wheel = '#1c1c1f';
const gauge = '#dcdfe2', pipe = '#7c8084', choke = '#d2a93a', pad = '#6b6f6a', rail = '#9aa0a6', ground = '#5a6147';

const box = (w, h, d) => new THREE.BoxGeometry(w, h, d);
const cyl = (rt, rb, h, s) => new THREE.CylinderGeometry(rt, rb, h, s || 14);
const torus = (r, t) => new THREE.TorusGeometry(r, t, 8, 16);

// zemin + platform
const g0 = mesh(box(6, 0.1, 6), ground, { flat: true, rough: 1, name: 'zemin' });
g0.position.set(0, 0.05, 0); modelGroup.add(g0);
const platform = mesh(box(3, 0.2, 3), pad, { flat: true, rough: 0.95, name: 'platform' });
platform.position.set(0, 0.2, 0); modelGroup.add(platform);

// kasing flanşı
const casing = mesh(cyl(0.42, 0.52, 0.35, 16), flange, { flat: true, name: 'kasing_flansi' });
casing.position.set(0, 0.45, 0); modelGroup.add(casing);

// flanşlı vana kulesi (spool + flanş + ana vana)
let y = 0.62;
function spool(h) {
  const sp = mesh(cyl(0.18, 0.18, h, 14), steel, { flat: false, metal: 0.4, name: 'spool' });
  sp.position.set(0, y + h / 2, 0); modelGroup.add(sp); y += h;
  const fl = mesh(cyl(0.27, 0.27, 0.07, 14), flange, { name: 'flans' });
  fl.position.set(0, y + 0.035, 0); modelGroup.add(fl); y += 0.07;
}
spool(0.3);
// ana vana (kırmızı) + üst el çarkı
const master = mesh(box(0.42, 0.42, 0.42), valveR, { flat: true, name: 'ana_vana' });
master.position.set(0, y + 0.21, 0); modelGroup.add(master); y += 0.42;
const mStem = mesh(cyl(0.04, 0.04, 0.3, 8), steel, { metal: 0.5, name: 'ana_vana_mil' });
mStem.position.set(0, y + 0.15, 0); modelGroup.add(mStem);
const mWheel = mesh(torus(0.18, 0.025), wheel, { name: 'ana_el_carki' });
mWheel.rotation.x = Math.PI / 2; mWheel.position.set(0, y + 0.32, 0); modelGroup.add(mWheel);
y += 0.07;
spool(0.35);

// yan vanalar (her iki yan) + el çarkı + manometre
[-1, 1].forEach((s, i) => {
  const wingY = 1.45;
  const wv = mesh(cyl(0.14, 0.14, 0.55, 12), valveR, { flat: false, name: 'yan_vana_' + (i + 1) });
  wv.rotation.z = Math.PI / 2; wv.position.set(s * 0.4, wingY, 0); modelGroup.add(wv);
  const hw = mesh(torus(0.15, 0.022), wheel, { name: 'yan_el_carki_' + (i + 1) });
  hw.rotation.y = Math.PI / 2; hw.position.set(s * 0.72, wingY, 0); modelGroup.add(hw);
  const gg = mesh(cyl(0.1, 0.1, 0.05, 12), gauge, { name: 'manometre_' + (i + 1) });
  gg.rotation.x = Math.PI / 2; gg.position.set(s * 0.45, wingY + 0.3, 0); modelGroup.add(gg);
});

// tepe kapağı + vent
const cap = mesh(cyl(0.2, 0.16, 0.18, 14), flange, { flat: true, name: 'tepe_kapagi' });
cap.position.set(0, y + 0.09, 0); modelGroup.add(cap);
const vent = mesh(cyl(0.03, 0.03, 0.4, 8), steel, { metal: 0.5, name: 'vent' });
vent.position.set(0, y + 0.38, 0); modelGroup.add(vent);

// akış hattı (sağ yan vanadan dışa) + choke
const fl1 = mesh(cyl(0.1, 0.1, 0.7, 10), pipe, { metal: 0.3, name: 'akis_hatti' });
fl1.rotation.z = Math.PI / 2; fl1.position.set(1.1, 1.45, 0); modelGroup.add(fl1);
const ch = mesh(box(0.3, 0.3, 0.3), choke, { flat: true, name: 'choke_vana' });
ch.position.set(1.5, 1.45, 0); modelGroup.add(ch);
const fl2 = mesh(cyl(0.1, 0.1, 1.3, 10), pipe, { metal: 0.3, name: 'akis_hatti_2' });
fl2.position.set(1.5, 0.85, 0); modelGroup.add(fl2);
const fl3 = mesh(cyl(0.1, 0.1, 0.9, 10), pipe, { metal: 0.3, name: 'akis_hatti_3' });
fl3.rotation.z = Math.PI / 2; fl3.position.set(1.95, 0.3, 0); modelGroup.add(fl3);

// güvenlik korkuluğu
[[1.4, 1.4], [1.4, -1.4], [-1.4, 1.4], [-1.4, -1.4]].forEach((p, i) => {
  const post = mesh(box(0.06, 0.7, 0.06), rail, { name: 'korkuluk_direk_' + (i + 1) });
  post.position.set(p[0], 0.55, p[1]); modelGroup.add(post);
});
