// Palmiye (tekli, zeminsiz). Yukarı +y, hafif +x eğimli.
const wood = '#9c7a4a', woodDk = '#7e6038', leaf = '#3f8f3a', leafDk = '#347a33', coco = '#6a4a2a';

function tri(a, b, c, color, name) {
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.Float32BufferAttribute(
    [a[0], a[1], a[2], b[0], b[1], b[2], c[0], c[1], c[2]], 3));
  g.computeVertexNormals();
  const m = mesh(g, color, { flat: true, name: name });
  m.material.side = THREE.DoubleSide;
  return m;
}

// ---- gövde (eğik, segmentli, sivrilen) ----
const H = 3.2, NSEG = 8, lean = 0.75;
const pts = [];
for (let i = 0; i <= NSEG; i++) { const t = i / NSEG; pts.push([lean * t * t, t * H, 0]); }
function seg(p1, p2, rBot, rTop, color, name) {
  const a = new THREE.Vector3(p1[0], p1[1], p1[2]), b = new THREE.Vector3(p2[0], p2[1], p2[2]);
  const dir = new THREE.Vector3().subVectors(b, a);
  const m = mesh(new THREE.CylinderGeometry(rTop, rBot, dir.length() + 0.03, 10), color, { name: name });
  m.position.set((p1[0] + p2[0]) / 2, (p1[1] + p2[1]) / 2, (p1[2] + p2[2]) / 2);
  m.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir.normalize());
  modelGroup.add(m);
}
for (let i = 0; i < NSEG; i++) {
  const r0 = 0.26 - 0.13 * (i / NSEG), r1 = 0.26 - 0.13 * ((i + 1) / NSEG);
  seg(pts[i], pts[i + 1], r0, r1, i % 2 ? wood : woodDk, 'govde_' + (i + 1));
}
const crown = pts[NSEG];

// ---- hindistan cevizi salkımı ----
[[0.13, -0.05, 0.12], [-0.12, -0.06, 0.1], [0.02, -0.13, -0.14], [0.15, -0.14, -0.04]].forEach((o, i) => {
  const c = mesh(new THREE.SphereGeometry(0.13, 8, 6), coco, { flat: false, rough: 0.8, name: 'hindistan_cevizi_' + (i + 1) });
  c.position.set(crown[0] + o[0], crown[1] + o[1], crown[2] + o[2]); modelGroup.add(c);
});

// ---- taç çekirdeği (sapların birleştiği nokta) ----
const core = mesh(new THREE.SphereGeometry(0.18, 8, 6), leafDk, { flat: true, name: 'tac' });
core.position.set(crown[0], crown[1] + 0.06, crown[2]); modelGroup.add(core);

// ---- yapraklar (dolu tüylü/pinnat: orta sap + bitişik yaprakçık dizisi) ----
function frond(a, reach, up, droop, maxLen, color, nm) {
  const ca = Math.cos(a), sa = Math.sin(a);
  const rad = [ca, 0, sa], perp = [-sa, 0, ca];
  const P0 = [crown[0] + rad[0] * 0.1, crown[1] + 0.08, crown[2] + rad[2] * 0.1];
  const Pm = [crown[0] + rad[0] * reach * 0.5, crown[1] + up, crown[2] + rad[2] * reach * 0.5];
  const P1 = [crown[0] + rad[0] * reach, crown[1] + up - droop, crown[2] + rad[2] * reach];
  const bez = (t) => { const u = 1 - t; return [
    u * u * P0[0] + 2 * u * t * Pm[0] + t * t * P1[0],
    u * u * P0[1] + 2 * u * t * Pm[1] + t * t * P1[1],
    u * u * P0[2] + 2 * u * t * Pm[2] + t * t * P1[2]]; };
  // örnek noktalar
  const N = 8, sample = [];
  for (let i = 0; i <= N; i++) sample.push(bez(i / N));
  // orta sap
  for (let i = 0; i < N; i++) {
    const p1 = sample[i], p2 = sample[i + 1];
    const A = new THREE.Vector3(p1[0], p1[1], p1[2]), B = new THREE.Vector3(p2[0], p2[1], p2[2]);
    const dir = new THREE.Vector3().subVectors(B, A);
    const r = mesh(new THREE.CylinderGeometry(0.028 * (1 - i / N * 0.8), 0.038 * (1 - i / N * 0.7), dir.length() + 0.02, 6), color, { name: nm + '_sap' });
    r.position.set((p1[0] + p2[0]) / 2, (p1[1] + p2[1]) / 2, (p1[2] + p2[2]) / 2);
    r.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir.normalize());
    modelGroup.add(r);
  }
  // dolu yaprakçıklar: ardışık sap noktaları (p1,p2) tabanlı, dışa açılan üçgenler (boşluk kalmaz)
  for (let i = 0; i < N; i++) {
    const p1 = sample[i], p2 = sample[i + 1], tm = (i + 0.5) / N;
    const len = maxLen * Math.pow(Math.sin(Math.PI * tm), 0.5);
    const dwn = 0.05 + 0.5 * tm;
    let tg = [p2[0] - p1[0], p2[1] - p1[1], p2[2] - p1[2]];
    const tl = Math.hypot(tg[0], tg[1], tg[2]) || 1; tg = [tg[0] / tl, tg[1] / tl, tg[2] / tl];
    const mid = [(p1[0] + p2[0]) / 2, (p1[1] + p2[1]) / 2, (p1[2] + p2[2]) / 2];
    [1, -1].forEach((s) => {
      const tip = [mid[0] + perp[0] * s * len + tg[0] * len * 0.5, mid[1] - dwn, mid[2] + perp[2] * s * len + tg[2] * len * 0.5];
      modelGroup.add(tri(p1, p2, tip, color, nm));
    });
  }
  // uç yaprakçık
  const pe = sample[N], pe2 = sample[N - 1];
  modelGroup.add(tri(pe2, pe, [pe[0] + (pe[0] - pe2[0]) * 1.3, pe[1] - 0.1, pe[2] + (pe[2] - pe2[2]) * 1.3], color, nm + '_uc'));
}
const L1 = 8;
for (let i = 0; i < L1; i++) frond(i / L1 * Math.PI * 2 + 0.1, 1.95, 0.45, 1.55, 0.6, i % 2 ? leaf : leafDk, 'yaprak_alt');
const L2 = 5;
for (let i = 0; i < L2; i++) frond(i / L2 * Math.PI * 2 + 0.4, 1.35, 0.85, 0.55, 0.46, i % 2 ? leafDk : leaf, 'yaprak_ust');
