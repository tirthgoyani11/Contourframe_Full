// Stealth bombardıman (B-2 Spirit) — burun +x. Referans 3-görünüşe göre. Havada.
const skin = '#0a0b0d', glass = '#040507', vent = '#060709'; // neredeyse siyah: studio ışığı gri'yi çok açıyor
const YC = 1.6;
modelGroup.userData.noGround = true;

const box = (w, h, d) => new THREE.BoxGeometry(w, h, d);
const sph = (r) => new THREE.SphereGeometry(r, 22, 14);

// pahlı (beveled) düz kanat: ince keskin kenar + dolgun orta -> airfoil
function wingShape(pts, depth, bevel, color, name) {
  const s = new THREE.Shape();
  s.moveTo(pts[0][0], pts[0][1]);
  for (let i = 1; i < pts.length; i++) s.lineTo(pts[i][0], pts[i][1]);
  s.closePath();
  const g = new THREE.ExtrudeGeometry(s, {
    depth: depth, bevelEnabled: true, bevelThickness: bevel, bevelSize: bevel, bevelSegments: 2, steps: 1
  });
  g.translate(0, 0, -(depth / 2 + bevel));
  const m = mesh(g, color, { flat: false, rough: 0.85, metal: 0.04, name: name });
  m.rotation.x = -Math.PI / 2;
  return m;
}
// basık-uzun tümsek (kokpit / motor alıkları) — yuvarlak balon DEĞİL
function hump(sx, sy, sz, px, py, pz, color, name) {
  const m = mesh(sph(1.0), color, { flat: false, rough: 0.8, metal: 0.04, name: name });
  m.scale.set(sx, sy, sz); m.position.set(px, py, pz);
  modelGroup.add(m); return m;
}

// ---- ana uçan kanat: çift-W testere-dişi firar kenarı (B-2) ----
// span/uzunluk ~2.3 (gerçek 2.49). Burun +x, kanat ucu z=±4.6.
const PTS = [
  [2.4, 0], [-0.6, 4.6],                 // burun -> sağ kanat ucu (33° ön kenar)
  [-1.4, 3.6], [-0.7, 2.6], [-1.45, 1.6], [-0.75, 0.6], [-1.6, 0.0], // çift-W (merkez geriye sivri)
  [-0.75, -0.6], [-1.45, -1.6], [-0.7, -2.6], [-1.4, -3.6], [-0.6, -4.6]
];
const wing = wingShape(PTS, 0.08, 0.06, skin, 'ucan_kanat'); // daha ince gövde
wing.position.y = YC;
modelGroup.add(wing);
const topY = YC + 0.10; // kanat üst yüzeyi

// ---- merkez sırt (çok alçak harman) ----
hump(1.9, 0.08, 0.42, 0.2, topY - 0.05, 0, skin, 'merkez_sirt');

// ---- kokpit tümseği (daha yüksek + daha belirgin oval) + cam ----
hump(1.05, 0.22, 0.56, 1.3, topY, 0, skin, 'kokpit_tumsegi');
const canopy = mesh(sph(1.0), glass, { flat: false, rough: 0.12, metal: 0.4, name: 'kokpit_cam' });
canopy.scale.set(0.46, 0.1, 0.34); // basık oval ön cam
canopy.position.set(1.82, topY + 0.08, 0); // hafif ileri + kokpit içine gömük
modelGroup.add(canopy);

// ---- motor alık tümsekleri (yarısı gömülü, basık-uzun) + alık ağzı ----
[-1, 1].forEach((s, i) => {
  hump(1.15, 0.11, 0.48, 0.15, topY - 0.05, s * 0.62, skin, 'motor_tumsegi_' + (i + 1));
  const lip = mesh(box(0.1, 0.09, 0.46), vent, { flat: true, name: 'alik_agzi_' + (i + 1) });
  lip.position.set(0.92, topY + 0.04, s * 0.62);
  modelGroup.add(lip);
});

// ---- arka egzoz yarıkları (gömülü, koyu) ----
[-1, 1].forEach((s, i) => {
  const exh = mesh(box(0.6, 0.05, 0.5), vent, { flat: true, name: 'egzoz_' + (i + 1) });
  exh.position.set(-1.05, topY + 0.04, s * 0.6);
  modelGroup.add(exh);
});
