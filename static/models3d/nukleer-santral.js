// Nükleer santral.
const towerCol = '#8f938c', reactor = '#cfd2cd', aux = '#b3a87f', turbine = '#9a9a92';
const pad = '#6b6f6a', grass = '#46523a', steam = '#e8eaec', metal = '#7e848c', wire = '#1a1c20', waterC = '#2a5a72';
const accentR = '#c23a2e', accentY = '#d2a93a', stackW = '#e2e4e6', xfmr = '#7c8084', ctrlBlue = '#34617f';

const box = (w, h, d) => new THREE.BoxGeometry(w, h, d);
const cyl = (rt, rb, h, s) => new THREE.CylinderGeometry(rt, rb, h, s || 18);
const sph = (r) => new THREE.SphereGeometry(r, 16, 12);

// ---- zemin ----
const ground = mesh(box(20, 0.1, 15), grass, { flat: true, rough: 1, name: 'arazi' });
ground.position.set(0, 0.05, 0);
modelGroup.add(ground);
const concrete = mesh(box(13, 0.12, 13), pad, { flat: true, rough: 0.95, name: 'beton_saha' });
concrete.position.set(-1, 0.11, 0);
modelGroup.add(concrete);

// ---- soğutma kuleleri (hiperboloid lathe + buhar) ----
function coolingTower(px, pz, idx) {
  const prof = [[2.0, 0], [1.75, 0.8], [1.45, 1.7], [1.2, 2.7], [1.08, 3.4], [1.18, 4.2], [1.4, 4.9]];
  const pts = prof.map((p) => new THREE.Vector2(p[0], p[1]));
  const geo = new THREE.LatheGeometry(pts, 28);
  const m = mesh(geo, towerCol, { flat: false, rough: 0.92, name: 'sogutma_kulesi_' + idx });
  m.material.side = THREE.DoubleSide;
  m.position.set(px, 0, pz);
  modelGroup.add(m);
  // üst halka
  const rim = mesh(cyl(1.42, 1.42, 0.15, 28), '#7c8079', { name: 'kule_halka_' + idx });
  rim.position.set(px, 4.92, pz); modelGroup.add(rim);
  // kırmızı ikaz bantları (üst)
  [[4.55, 1.33], [4.15, 1.22]].forEach((s, b) => {
    const band = mesh(cyl(s[1], s[1], 0.12, 28), accentR, { name: 'kule_band_' + idx + '_' + (b + 1) });
    band.position.set(px, s[0], pz); modelGroup.add(band);
  });
  // buhar
  [[0, 0.7, 5.4], [0.5, 0.9, 5.9], [-0.4, 1.1, 6.4], [0.2, 1.3, 7.0]].forEach((s, i) => {
    const puff = mesh(sph(s[1]), steam, { flat: false, rough: 0.9, name: 'buhar' });
    puff.position.set(px + s[0], s[2], pz + (i % 2 ? 0.3 : -0.2));
    puff.material.transparent = true; puff.material.opacity = 0.7 - i * 0.12;
    modelGroup.add(puff);
  });
}
coolingTower(-4.2, -3.4, 1);
coolingTower(-4.2, 3.4, 2);

// ---- reaktör binası (kubbeli) + yardımcı ----
function reactorBldg(px, pz, idx) {
  const cont = mesh(cyl(1.3, 1.3, 2.0, 22), reactor, { flat: false, rough: 0.7, name: 'reaktor_bina_' + idx });
  cont.position.set(px, 1.1, pz); modelGroup.add(cont);
  const dome = mesh(new THREE.SphereGeometry(1.3, 22, 12, 0, Math.PI * 2, 0, Math.PI / 2), reactor, { flat: false, rough: 0.7, name: 'reaktor_kubbe_' + idx });
  dome.position.set(px, 2.1, pz); modelGroup.add(dome);
}
reactorBldg(1.6, -3.2, 1);
reactorBldg(1.6, -0.4, 2);
// yardımcı bina
const auxB = mesh(box(2.2, 1.4, 2.0), aux, { flat: true, name: 'yardimci_bina' });
auxB.position.set(1.6, 0.8, 2.3); modelGroup.add(auxB);

// ---- türbin salonu ----
const hall = mesh(box(2.0, 1.5, 5.5), turbine, { flat: true, rough: 0.85, name: 'turbin_salonu' });
hall.position.set(4.4, 0.85, 0); modelGroup.add(hall);
const hallRoof = mesh(box(2.2, 0.2, 5.7), ctrlBlue, { flat: true, name: 'turbin_cati' });
hallRoof.position.set(4.4, 1.7, 0); modelGroup.add(hallRoof);

// ---- enerji nakil direği + hatlar ----
const pyG = new THREE.Group();
const mast = mesh(cyl(0.12, 0.3, 4.5, 4), metal, { flat: true, metal: 0.3, name: 'direk' });
mast.rotation.y = Math.PI / 4; mast.position.set(0, 2.25, 0); pyG.add(mast);
[1.6, 2.4].forEach((y, i) => {
  const arm = mesh(box(2.6, 0.12, 0.12), metal, { name: 'capraz_kol_' + (i + 1) });
  arm.position.set(0, y + 1.2, 0); pyG.add(arm);
});
// izolatörler + hatlar (uçlardan sarkar)
[[-1.2, 3.6], [1.2, 3.6], [-1.2, 2.8], [1.2, 2.8]].forEach((p, i) => {
  const ins = mesh(cyl(0.04, 0.04, 0.2, 6), '#cfd2cd', { name: 'izolator' });
  ins.position.set(p[0], p[1] - 0.1, 0); pyG.add(ins);
});
pyG.position.set(7.5, 0, 0); modelGroup.add(pyG);
// hatlar: direkten türbin salonuna doğru sarkan teller
[[-1.2, 3.5], [1.2, 3.5]].forEach((p, i) => {
  const a = new THREE.Vector3(7.5 + p[0], p[1], 0), b = new THREE.Vector3(5.0, 2.0, p[0] * 0.5);
  const dir = new THREE.Vector3().subVectors(b, a);
  const ln = mesh(cyl(0.02, 0.02, dir.length(), 5), wire, { name: 'hat_' + (i + 1) });
  ln.position.set((a.x + b.x) / 2, (a.y + b.y) / 2 - 0.2, (a.z + b.z) / 2);
  ln.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir.normalize());
  modelGroup.add(ln);
});

// ---- soğutma suyu kanalı ----
const water = mesh(box(13, 0.06, 1.6), waterC, { flat: true, rough: 0.3, metal: 0.15, name: 'sogutma_suyu' });
water.position.set(-1, 0.12, 6.2); modelGroup.add(water);

// ---- kırmızı-beyaz baca (vent) ----
for (let s = 0; s < 6; s++) {
  const seg = mesh(cyl(0.22, 0.24, 0.62, 12), s % 2 ? accentR : stackW, { name: 'baca_seg_' + (s + 1) });
  seg.position.set(3.4, 0.3 + s * 0.6, -3.2);
  modelGroup.add(seg);
}

// ---- trafo merkezi (renkli sanayi) ----
[[6.2, 3.4], [7.0, 3.4], [6.6, 4.5]].forEach((p, i) => {
  const tx = mesh(box(0.9, 0.85, 0.8), xfmr, { flat: true, name: 'trafo_' + (i + 1) });
  tx.position.set(p[0], 0.53, p[1]); modelGroup.add(tx);
  [-0.25, 0, 0.25].forEach((dx) => {
    const bush = mesh(cyl(0.06, 0.08, 0.38, 8), accentY, { name: 'trafo_busing' });
    bush.position.set(p[0] + dx, 1.1, p[1]); modelGroup.add(bush);
  });
  const rad = mesh(box(0.12, 0.7, 0.7), ctrlBlue, { flat: true, name: 'trafo_radyator' });
  rad.position.set(p[0] - 0.5, 0.53, p[1]); modelGroup.add(rad);
});

// ---- renkli borular (kuleler -> türbin) ----
[[ctrlBlue, 0.85], [accentY, 1.15]].forEach((p, i) => {
  const pipe = mesh(cyl(0.13, 0.13, 8.0, 10), p[0], { metal: 0.2, name: 'boru_' + (i + 1) });
  pipe.rotation.z = Math.PI / 2; pipe.position.set(0.5, p[1], 5.0 + i * 0.4);
  modelGroup.add(pipe);
  // boru ayakları
  [-3, 0, 3].forEach((x) => {
    const leg = mesh(box(0.1, p[1], 0.1), metal, { name: 'boru_ayak' });
    leg.position.set(x + 0.5, p[1] / 2, 5.0 + i * 0.4); modelGroup.add(leg);
  });
});
