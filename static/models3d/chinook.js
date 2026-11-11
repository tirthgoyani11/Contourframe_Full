// Chinook (CH-47 tandem rotor) — burun +x. İki rotor üstte ters yönde döner.
const body = '#5a5f43', bodyDk = '#4a4e36', blade = '#28291f', hubC = '#3a3b30';
const glass = '#16201f', engineC = '#3f4334', metal = '#7e8378', tire = '#1b1b1e';

const box = (w, h, d) => new THREE.BoxGeometry(w, h, d);
const cyl = (rt, rb, h, s) => new THREE.CylinderGeometry(rt, rb, h, s || 14);

function rod(p1, p2, r, color, name) {
  const a = new THREE.Vector3(p1[0], p1[1], p1[2]);
  const b = new THREE.Vector3(p2[0], p2[1], p2[2]);
  const dir = new THREE.Vector3().subVectors(b, a);
  const m = mesh(cyl(r, r, dir.length(), 8), color, { metal: 0.4, name: name });
  m.position.set((p1[0] + p2[0]) / 2, (p1[1] + p2[1]) / 2, (p1[2] + p2[2]) / 2);
  m.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir.normalize());
  modelGroup.add(m);
}
// tandem rotor: 3 palet, dönen göbek; mil statik
function rotor(px, py, pz, dir, name) {
  const mast = mesh(cyl(0.1, 0.12, 0.5, 10), metal, { metal: 0.4, name: name + '_mil' });
  mast.position.set(px, py - 0.25, pz);
  modelGroup.add(mast);
  const r = spin({ pivot: [px, py, pz], axis: 'y', rpm: dir * 130 });
  const hub = mesh(cyl(0.2, 0.2, 0.18, 12), hubC, { flat: true, name: name + '_gobek' });
  r.add(hub);
  for (let i = 0; i < 3; i++) {
    const a = i * 2 * Math.PI / 3;
    const bl = mesh(box(2.2, 0.05, 0.28), blade, { flat: true, name: name + '_pal_' + (i + 1) });
    bl.position.set(Math.cos(a) * 1.1, 0, Math.sin(a) * 1.1);
    bl.rotation.y = -a;
    r.add(bl);
  }
}

// ---- gövde ----
const fus = mesh(box(5.4, 1.2, 1.3), body, { flat: true, rough: 0.8, name: 'govde' });
fus.position.set(0, 1.25, 0); // 0.65 .. 1.85
modelGroup.add(fus);
// kokpit (ön, hafif eğik) + camlar
const cockpit = mesh(box(0.7, 1.0, 1.25), body, { flat: true, name: 'kokpit' });
cockpit.position.set(2.85, 1.15, 0);
modelGroup.add(cockpit);
const ws = mesh(box(0.1, 0.5, 1.1), glass, { rough: 0.2, metal: 0.3, name: 'on_cam' });
ws.rotation.z = 0.25;
ws.position.set(3.18, 1.35, 0);
modelGroup.add(ws);
[-1, 1].forEach((s, i) => {
  const side = mesh(box(0.5, 0.34, 0.06), glass, { rough: 0.2, metal: 0.3, name: 'yan_cam_' + (i + 1) });
  side.position.set(2.95, 1.4, s * 0.63);
  modelGroup.add(side);
});
// arka yükleme rampası (eğik alt)
const ramp = mesh(box(1.0, 0.9, 1.25), bodyDk, { flat: true, name: 'rampa' });
ramp.rotation.z = -0.5;
ramp.position.set(-2.6, 1.0, 0);
modelGroup.add(ramp);

// ---- yan sponsonlar (yakıt + iniş takımı) ----
[-1, 1].forEach((s, i) => {
  const spon = mesh(box(3.4, 0.4, 0.4), bodyDk, { flat: true, name: 'sponson_' + (i + 1) });
  spon.position.set(0.2, 0.95, s * 0.85);
  modelGroup.add(spon);
});

// ---- iniş takımı (4 tekerlek) ----
[[1.3, 0.85], [1.3, -0.85], [-1.3, 0.85], [-1.3, -0.85]].forEach((p, i) => {
  rod([p[0], 0.9, p[1]], [p[0], 0.3, p[1] * 1.05], 0.05, metal, 'takim_' + (i + 1));
  const w = mesh(cyl(0.28, 0.28, 0.2, 14), tire, { name: 'teker_' + (i + 1) });
  w.rotation.x = Math.PI / 2;
  w.position.set(p[0], 0.28, p[1] * 1.05);
  modelGroup.add(w);
});

// ---- ön rotor pilonu (alçak) ----
const fp = mesh(box(0.7, 0.5, 0.7), bodyDk, { flat: true, name: 'on_pilon' });
fp.position.set(1.7, 2.0, 0);
modelGroup.add(fp);

// ---- arka motor hump'ı (yüksek) + egzozlar ----
const rp = mesh(box(1.2, 1.1, 1.1), bodyDk, { flat: true, name: 'arka_hump' });
rp.position.set(-2.0, 2.25, 0);
modelGroup.add(rp);
[-1, 1].forEach((s, i) => {
  const eng = mesh(cyl(0.22, 0.22, 1.0, 12), engineC, { flat: true, metal: 0.3, name: 'motor_' + (i + 1) });
  eng.rotation.z = Math.PI / 2;
  eng.position.set(-2.1, 2.1, s * 0.62);
  modelGroup.add(eng);
  const exh = mesh(cyl(0.12, 0.14, 0.3, 10), '#202020', { metal: 0.4, name: 'egzoz_' + (i + 1) });
  exh.rotation.z = Math.PI / 2;
  exh.position.set(-2.7, 2.1, s * 0.62);
  modelGroup.add(exh);
});

// ---- iki rotor (ters yönde, farklı yükseklik -> paletler çakışmaz) ----
rotor(1.7, 2.35, 0, 1, 'on_rotor');
rotor(-2.0, 2.95, 0, -1, 'arka_rotor');
