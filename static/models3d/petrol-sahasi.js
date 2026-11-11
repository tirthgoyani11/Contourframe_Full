// Petrol sahası — çoklu pompa + tanklar + derrick + flare.
const struct = '#46523a', weight = '#7c8084', baseC = '#6b6f6a', metal = '#9aa0a6';
const motor = '#3a3d40', dirt = '#6b6048', tankC = '#cfd2cd', tankRoof = '#9a9a92';
const derrick = '#8a8f96', flameO = '#e8622a', flameY = '#ffd24a', pipe = '#7c8084', valve = '#b23a2e';

const box = (w, h, d) => new THREE.BoxGeometry(w, h, d);
const cyl = (rt, rb, h, s) => new THREE.CylinderGeometry(rt, rb, h, s || 12);
function rod(p1, p2, r, color, name) {
  const a = new THREE.Vector3(p1[0], p1[1], p1[2]), b = new THREE.Vector3(p2[0], p2[1], p2[2]);
  const dir = new THREE.Vector3().subVectors(b, a);
  const m = mesh(cyl(r, r, dir.length(), 6), color, { metal: 0.3, name: name });
  m.position.set((p1[0] + p2[0]) / 2, (p1[1] + p2[1]) / 2, (p1[2] + p2[2]) / 2);
  m.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir.normalize());
  modelGroup.add(m);
}

// ---- zemin ----
const ground = mesh(box(18, 0.1, 14), dirt, { flat: true, rough: 1, name: 'zemin' });
ground.position.set(0, 0.05, 0);
modelGroup.add(ground);

// ---- pompa (dünya koordinatında, +x'e bakar) ----
function pumpjack(px, pz, rpm, idx) {
  const b = mesh(box(2.4, 0.22, 0.9), baseC, { flat: true, name: 'kaide_' + idx });
  b.position.set(px, 0.2, pz); modelGroup.add(b);
  [[0.4, 0.3], [0.4, -0.3], [-0.4, 0.3], [-0.4, -0.3]].forEach((p) => {
    rod([px + p[0], 0.3, pz + p[1]], [px, 2.0, pz], 0.05, struct, 'samson_' + idx);
  });
  const beam = spin({ pivot: [px, 2.0, pz], axis: 'z', nod: 0.2, rpm: rpm });
  beam.add(mesh(box(3.0, 0.16, 0.24), struct, { flat: true, name: 'kol_' + idx }));
  const head = mesh(box(0.4, 0.55, 0.26), struct, { flat: true, name: 'atbasi_' + idx });
  head.position.set(1.5, -0.2, 0); beam.add(head);
  const bw = mesh(box(0.4, 0.4, 0.32), weight, { flat: true, name: 'kol_agirlik_' + idx });
  bw.position.set(-1.5, -0.05, 0); beam.add(bw);
  const gear = mesh(box(0.6, 0.5, 0.8), motor, { flat: true, name: 'reduktor_' + idx });
  gear.position.set(px - 1.15, 0.5, pz); modelGroup.add(gear);
  [0.45, -0.45].forEach((z) => {
    const crank = spin({ pivot: [px - 1.15, 0.78, pz + z], axis: 'z', rpm: rpm });
    crank.add(mesh(box(0.9, 0.18, 0.1), weight, { flat: true, name: 'krank_' + idx }));
    const cw = mesh(box(0.34, 0.45, 0.14), weight, { flat: true, name: 'agirlik_' + idx });
    cw.position.set(0.42, 0, 0); crank.add(cw);
  });
  const wh = mesh(box(0.25, 0.3, 0.25), valve, { flat: true, name: 'kuyu_vana_' + idx });
  wh.position.set(px + 1.55, 0.35, pz); modelGroup.add(wh);
}
pumpjack(-5.5, -2.5, 11, 1);
pumpjack(-1.0, 2.0, 13, 2);
pumpjack(2.5, -3.0, 10, 3);

// ---- depolama tankları ----
[[6.0, 3.0], [6.0, 5.0], [7.6, 4.0]].forEach((p, i) => {
  const t = mesh(cyl(1.1, 1.1, 2.2, 18), tankC, { flat: false, rough: 0.6, name: 'tank_' + (i + 1) });
  t.position.set(p[0], 1.2, p[1]); modelGroup.add(t);
  const roof = mesh(cyl(1.1, 0.85, 0.4, 18), tankRoof, { flat: false, name: 'tank_cati_' + (i + 1) });
  roof.position.set(p[0], 2.5, p[1]); modelGroup.add(roof);
  const band = mesh(cyl(1.12, 1.12, 0.1, 18), tankRoof, { name: 'tank_band_' + (i + 1) });
  band.position.set(p[0], 1.6, p[1]); modelGroup.add(band);
});

// ---- sondaj kulesi (derrick) ----
const DX = -5.5, DZ = 3.5;
const corners = [[0.8, 0.8], [0.8, -0.8], [-0.8, 0.8], [-0.8, -0.8]];
const tops = [[0.22, 0.22], [0.22, -0.22], [-0.22, 0.22], [-0.22, -0.22]];
corners.forEach((c, i) => {
  rod([DX + c[0], 0.1, DZ + c[1]], [DX + tops[i][0], 5.2, DZ + tops[i][1]], 0.07, derrick, 'derrick_ayak_' + (i + 1));
});
[1.3, 2.6, 3.9].forEach((y, k) => {
  const f = 0.8 - (y / 5.2) * 0.58; // o yükseklikte yarı genişlik
  [[f, f, -f, f], [f, -f, -f, -f], [f, f, f, -f], [-f, f, -f, -f]].forEach((s) => {
    rod([DX + s[0], y, DZ + s[1]], [DX + s[2], y, DZ + s[3]], 0.03, derrick, 'derrick_kusak');
  });
});
const crown = mesh(box(0.7, 0.4, 0.7), motor, { flat: true, name: 'crown_block' });
crown.position.set(DX, 5.4, DZ); modelGroup.add(crown);
const floor = mesh(box(1.9, 0.2, 1.9), baseC, { flat: true, name: 'sondaj_platformu' });
floor.position.set(DX, 0.7, DZ); modelGroup.add(floor);

// ---- flare bacası (alevli) ----
const FX = 7.0, FZ = -3.5;
const stack = mesh(cyl(0.14, 0.18, 5.0, 10), pipe, { flat: false, metal: 0.3, name: 'flare_baca' });
stack.position.set(FX, 2.6, FZ); modelGroup.add(stack);
const flame1 = mesh(cyl(0.0, 0.32, 1.0, 10), flameO, { flat: false, name: 'alev' });
flame1.position.set(FX, 5.6, FZ); modelGroup.add(flame1);
const flame2 = mesh(cyl(0.0, 0.16, 0.6, 10), flameY, { name: 'alev_uc' });
flame2.position.set(FX, 6.0, FZ); modelGroup.add(flame2);

// ---- borular ----
[['#7c8084', 0.5], [valve, 0.75]].forEach((p, i) => {
  const pp = mesh(cyl(0.1, 0.1, 11, 8), p[0], { metal: 0.2, name: 'boru_' + (i + 1) });
  pp.rotation.z = Math.PI / 2; pp.position.set(0.5, p[1], 5.6 + i * 0.35);
  modelGroup.add(pp);
});
