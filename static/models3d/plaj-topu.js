// Plaj topu (tekli) — 6 renkli dilim (gore).
const ballCols = ['#e23b3b', '#f2f2f2', '#f0c020', '#2f8fc0', '#36a85a', '#f2f2f2'];
const BR = 0.45;
for (let i = 0; i < 6; i++) {
  const seg = mesh(new THREE.SphereGeometry(BR, 8, 12, i * Math.PI / 3, Math.PI / 3), ballCols[i],
    { flat: false, rough: 0.4, name: 'dilim_' + (i + 1) });
  seg.position.set(0, BR, 0); modelGroup.add(seg);
}
// tepe ve dip kutupçuk (valf/kapak)
const valve = mesh(new THREE.CylinderGeometry(0.05, 0.05, 0.05, 8), '#cfcfcf', { name: 'valf' });
valve.position.set(0, BR * 2 - 0.01, 0); modelGroup.add(valve);
