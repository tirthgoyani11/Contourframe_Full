// Masa bayrağı — krom konik kaide, direkler tepeden ÜÇ AYRI YÖNE açılır.
// Referans: klasik masa bayrağı seti.
//
// YAPI (iki katlı grup, çünkü iki ayrı dönüş var):
//   direkGrup_n  → rotation.y = YÖN (azimut). Direğin hangi pusula yönüne
//                  doğru açılacağı. Üç bayrakta aralarında 120°.
//   direkEgim_n  → rotation.x = EĞİM. Direğin o yöne doğru yatma açısı.
// İkisi ayrı katta çünkü tek bir Euler ile sıra karışıyor; bu haliyle
// önce yön seçiliyor, sonra o yöne yatırılıyor.
//
// BAYRAK YÜZÜ DIŞARI BAKAR: bez XY düzleminde (normal ±z) ve direk +z'ye
// doğru yatıyor, yani bezin yüzü direğin açıldığı yöne bakıyor. Bez +x'e
// (teğet yönde) uzanıyor, böylece komşu bayrakla çakışmıyor.
//
// Studio3D bu adları arar — AD DEĞİŞTİRME: direkGrup_1..3, direkEgim_1..3,
// bayrak_1..3.
// MERKEZ: bayrakların çıktığı nokta (direk kökü) modelin merkezidir.
// Varsayılan kutu-ortalama burada yanlış oluyordu, çünkü bayraklar dışa
// taşıyor ve kutu merkezi kaideden kayıyordu.
modelGroup.userData.noCenter = true;

const krom = '#e6eaf0', kromKoyu = '#aab2bd';
const bez = ['#c94b4b', '#e8e8e8', '#3f7fd4'];   // doku gelmeden önceki renkler

const cyl = (rt, rb, h, s) => new THREE.CylinderGeometry(rt, rb, h, s || 28);
const sph = (r, w, h) => new THREE.SphereGeometry(r, w || 16, h || 12);

const KAIDE_UST = 0.20;
const BEZ_EN = 0.62;
const BEZ_BOY = 0.42;
const BEZ_UST = 1.34;   // bezin bağlandığı yükseklik (direk ucuna yakın)
// Varsayılan (üç bayrak) yerleşim — Studio3D bayrak sayısına göre ezer.
// Modelde durmasının sebebi: modeli ham kuran yollar (kapak üretimi,
// stüdyo önizlemesi) üç direği üst üste göstermesin.
const VARSAYILAN_YON = [180, 300, 60];
const VARSAYILAN_EGIM = 20;

// ---- kaide: küçük ve YUVARLAK krom kubbe (koni değil) ----
const tabla = mesh(cyl(0.30, 0.32, 0.025, 32), krom, { metal: 0.55, rough: 0.16, name: 'kaide_tabla' });
tabla.position.set(0, 0.013, 0);
modelGroup.add(tabla);

const kubbe = mesh(sph(0.30, 32, 18), krom, { metal: 0.55, rough: 0.13, name: 'kaide' });
kubbe.scale.set(1, 0.62, 1);
kubbe.position.set(0, 0.025, 0);
modelGroup.add(kubbe);

const bilezik = mesh(cyl(0.07, 0.095, 0.045, 24), kromKoyu, { metal: 0.5, rough: 0.2, name: 'kaide_bilezik' });
bilezik.position.set(0, 0.195, 0);
modelGroup.add(bilezik);

for (let i = 0; i < 3; i++) {
  const n = i + 1;

  const yon = new THREE.Group();
  yon.name = 'direkGrup_' + n;
  yon.position.set(0, KAIDE_UST, 0);
  yon.rotation.y = VARSAYILAN_YON[i] * Math.PI / 180;
  modelGroup.add(yon);

  const eg = new THREE.Group();
  eg.name = 'direkEgim_' + n;
  eg.rotation.x = VARSAYILAN_EGIM * Math.PI / 180;   // +z yönüne yat
  yon.add(eg);

  const direk = mesh(cyl(0.022, 0.022, 1.42, 12), krom, { metal: 0.5, rough: 0.2, name: 'direk_' + n });
  direk.position.set(0, 0.71, 0);
  eg.add(direk);

  const topuz = mesh(sph(0.046), krom, { metal: 0.55, rough: 0.14, name: 'topuz_' + n });
  topuz.position.set(0, 1.45, 0);
  eg.add(topuz);

  // ---- bayrak bezi ----
  // Bez KENDI GRUBUNDA; Studio3D o grubu direğin eğimi kadar TERS
  // döndürüyor, böylece bez yerçekimiyle DİK asılı kalıyor (eskiden
  // direğe dik duruyor, sanki yerçekimi yokmuş gibi görünüyordu).
  // Düzlem: eğim doğrultusunda (+z'ye uzanır), yüzü teğet yönde (±x).
  const bg = new THREE.Group();
  bg.name = 'bayrakGrup_' + n;             // yerçekimi: direğin yatışını ters çevirir
  bg.position.set(0, BEZ_UST, 0);          // direğe bağlandığı nokta
  eg.add(bg);

  // Bezin hangi yöne uzanacağı: direk hangi yöne yatıyorsa o yöne.
  // Üçlüde direk kendi yönüne (+z) yatar, bez de +z'ye uzanır. İkili
  // doğrusal dizilimde direk YANA yatar, bez de yana uzanmalı — yoksa
  // kameraya doğru uzanıp kenardan görünüyor. Açıyı Studio3D veriyor.
  const by = new THREE.Group();
  by.name = 'bayrakYon_' + n;
  bg.add(by);

  // Bez, DİREĞE BAĞLANDIĞI DİKEY KENARDAN asılı kalır (iki bağlantı
  // noktası: o kenarın üstü ve altı). Çevirme direğin kendi ekseni
  // etrafında: bez eğim doğrultusunda (+z) uzanır, direğe dik değil.
  // Sarkma bayrakGrup'un ters dönüşünden geliyor — direk ne kadar yatarsa
  // yatsın bez dik kalır (yerçekimi).
  const geo = new THREE.PlaneGeometry(BEZ_EN, BEZ_BOY, 12, 2);
  geo.rotateY(-Math.PI / 2);               // uzanım +x -> +z (direğin yattığı yön)
  const pos = geo.attributes.position;
  for (let k = 0; k < pos.count; k++) {
    const u = (pos.getZ(k) + BEZ_EN / 2) / BEZ_EN;    // 0 = direk yanı, 1 = serbest uç
    pos.setX(k, pos.getX(k) + Math.sin(u * Math.PI * 1.7) * 0.055 * u);
    // Serbest uç aşağı düşer: bez kendi ağırlığıyla sarkar. Bağlantı
    // kenarında (u=0) sıfır, yani o kenar direğe YAPIŞIK kalır.
    pos.setY(k, pos.getY(k) - 0.11 * u * u);
  }
  pos.needsUpdate = true;
  geo.computeVertexNormals();
  const bayrak = mesh(geo, bez[i], { rough: 0.82, name: 'bayrak_' + n });
  bayrak.material.side = THREE.DoubleSide;
  bayrak.position.set(0, -BEZ_BOY / 2, BEZ_EN / 2 + 0.02);   // bağlantı kenarı direkte
  by.add(bayrak);
}
