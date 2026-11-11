// Kale — ortaçağ concentric kalesinin İÇ AVLUSU (inner ward).
//
// REFERANS VE ÖLÇÜ KAYNAĞI (ezberden yazılmadı; hepsi yayınlanmış ölçü):
//   * Harlech Castle, Gwynedd (1283-89, Master James of St George) —
//     medievalheritage.eu/en/main-page/heritage/wales/harlech-castle/
//       avlu 39 m genişlik x 47 m (batı) / 53 m (doğu) uzunluk
//       iç sur ~3 m kalınlık
//       dört köşe burcu, çap ~10 m
//       GB burcu 15.8 m, KB burcu 15.1 m; her birinin üstünde 5.8 m'lik
//       ayrı SİLİNDİRİK kule
//       çift kuleli kapı yapısı 24 x 16 m (80 x 54 ft)
//   * Bodiam Castle (1385) — anglotopia.net / great-castles.com
//       sur 5.5 m kalın, 18 m yüksek; tambur köşe burçları 18 m
//       kapı kulesi ÜÇ KATLI, surdan ve avlu binalarından yüksek;
//       kapı üstünde makuliye (machicolation) galerisi, üç portkulis
//   * Dover Castle büyük kulesi (1180-85) — English Heritage / Country Life
//       ~30 m kare plan, 25.3 m yüksek, duvarlar 6.4 m'ye kadar kalın
//     Harlech'te AYRI BİR DONJON YOK (kapı kulesinin kendisi baş kule
//     işlevi görüyor: "keep-gatehouse"). Kütüphanenin "baş kule" çizgisi
//     için avluya Norman büyük kulesi ORANIYLA (kare plan, boy/kenar
//     ~1.3) bir donjon konuldu ve Harlech avlusuna sığacak biçimde
//     küçültüldü: 17 m kare, 22.5 m gövde.
//
// ÖLÇEK: 1 model birimi = 1 GERÇEK METRE. Kutu ~53.6 x 70.7 m,
// maxHoriz ~70.7 m (motor sizeKm'i buna göre ölçekliyor).
// Gerekçe LEGİBİLİTE: mazgal dişi 1.29 m, yani en uzun kenarın %1.8'i.
// Pierrefonds/Krak ölçeğinde (130-210 m) aynı diş %0.6-0.9'a düşüyor ve
// haritadaki tipik çizimde 1-2 piksele iniyor — tepeden bakışın İMZASI
// olan mazgal okunmaz oluyor. 70 m aynı zamanda Harlech'in GERÇEK iç
// avlusudur (45 x 56 m sur dikdörtgeni + dışa taşan köşe burçları) ve
// 50-150 m bandının alt ucudur.
//
// AYNALAMA: harita her modeli soldan sağa aynalıyor (det(projection)
// negatif). Kalede yazı/arma YOK. Kapı kulesi, baş kule, burçlar ve avlu
// kanatları x'te SİMETRİK; asimetrik tek öge baş kulenin merdiven kulesi
// ve o da aynalanınca öbür köşeye geçiyor — kale kimliği değişmiyor.
// Bayrak bezi, masa bayrağının geometrisiyle BİREBİR aynı kuruluyor
// (PlaneGeometry + rotateY(-90) + DoubleSide), yani bayrak dokusunun
// yönü kütüphanedeki mevcut sözleşmeyle aynı kalıyor.
//
// YÜZEY DETAYI `yuzeyYama` İLE YAPILMADI: o yardımcı gövde kesitinin
// çevresinde (w) ilerliyor ve DİKEY yüzeyde çalışmıyor (ölçülmüş tuzak,
// zırhlı SUV bagaj camı). Kale duvarlarının hepsi dikey; mazgal, ok
// deliği, silme ve taş örneği GERÇEK GEOMETRİ olarak, yüzeyden 0.06-0.15 m
// dışarı taşan ayrı kütlelerle kuruldu (+ polygonOffset).
//
// ÜÇGEN BÜTÇESİ: yüzlerce mazgal dişi ve taş bloğu tek tek mesh olsaydı
// hem mesh sayısı hem "aynı adlı mesh yalnız ilki renk alır" tuzağı
// patlardı. Hepsi aşağıdaki `yigin` ile TEK BufferGeometry'de toplanıyor;
// böylece 250+ diş, 100+ konsol ve 90 taş bloğu toplam 7 mesh'e sığıyor.

// ---------------------------------------------------------------------
// GEOMETRİ YIĞINI — düz normalli, elle dikilen BufferGeometry.
// Sarım kuralı (birim küple tek tek doğrulandı):
//   * xz çokgeni POZİTİF işaretli alanla verilir (θ artan çember, ya da
//     [x0,z0]->[x1,z0]->[x1,z1]->[x0,z1] dikdörtgeni).
//   * y yönünde loft: alt kapak -y, üst kapak +y, yanlar DIŞA bakar.
//   * xy çokgeni de pozitif alanla verilir; z yönünde loft edilir.
// ---------------------------------------------------------------------
function yigin() {
  const P = [], N = [], I = [];

  function ekle(pts) {                         // düzlemsel çokgen (3+ nokta)
    const a = pts[0], b = pts[1], c = pts[2];
    const ux = b[0] - a[0], uy = b[1] - a[1], uz = b[2] - a[2];
    const vx = c[0] - a[0], vy = c[1] - a[1], vz = c[2] - a[2];
    let nx = uy * vz - uz * vy, ny = uz * vx - ux * vz, nz = ux * vy - uy * vx;
    const L = Math.sqrt(nx * nx + ny * ny + nz * nz) || 1;
    nx /= L; ny /= L; nz /= L;
    const o = P.length / 3;
    for (let i = 0; i < pts.length; i++) {
      P.push(pts[i][0], pts[i][1], pts[i][2]);
      N.push(nx, ny, nz);
    }
    for (let i = 1; i < pts.length - 1; i++) I.push(o, o + i, o + i + 1);
  }

  // Üç boyutlu iki halka arasında loft (her köşenin y'si ayrı olabilir).
  function kat3(A, B, altKapak, ustKapak) {
    const n = A.length;
    for (let i = 0; i < n; i++) {
      const j = (i + 1) % n;
      ekle([A[j], A[i], B[i], B[j]]);
    }
    if (altKapak !== false) ekle(A.slice());
    if (ustKapak !== false) ekle(B.slice().reverse());
  }
  // xz çokgeninden y ekseninde loft (alt/üst çokgen farklı olabilir: pah).
  function kat(alt, ust, y0, y1, altKapak, ustKapak) {
    const A = [], B = [];
    for (let i = 0; i < alt.length; i++) {
      A.push([alt[i][0], y0, alt[i][1]]);
      B.push([ust[i][0], y1, ust[i][1]]);
    }
    kat3(A, B, altKapak, ustKapak);
  }
  function prizma(pts, y0, y1, altKapak, ustKapak) {
    kat(pts, pts, y0, y1, altKapak, ustKapak);
  }
  // xz çokgeninden tek tepeye koni/piramit.
  function koni(pts, y0, tepe, altKapak) {
    const n = pts.length, A = [];
    for (let i = 0; i < n; i++) A.push([pts[i][0], y0, pts[i][1]]);
    for (let i = 0; i < n; i++) ekle([A[(i + 1) % n], A[i], tepe]);
    if (altKapak !== false) ekle(A.slice());
  }
  // xy çokgeninden z ekseninde loft (kemerli kapı yüzü, kemer taşları).
  function prizmaZ(pts, z0, z1) {
    const n = pts.length, A = [], B = [];
    for (let i = 0; i < n; i++) { A.push([pts[i][0], pts[i][1], z0]); B.push([pts[i][0], pts[i][1], z1]); }
    for (let i = 0; i < n; i++) {
      const j = (i + 1) % n;
      ekle([A[i], A[j], B[j], B[i]]);
    }
    ekle(A.slice().reverse());
    ekle(B.slice());
  }

  return {
    ekle: ekle, kat3: kat3, kat: kat, prizma: prizma, koni: koni, prizmaZ: prizmaZ,
    geo: function () {
      const g = new THREE.BufferGeometry();
      g.setAttribute('position', new THREE.Float32BufferAttribute(P, 3));
      g.setAttribute('normal', new THREE.Float32BufferAttribute(N, 3));
      g.setIndex(I);
      g.computeBoundingSphere();
      return g;
    }
  };
}

// ---- çokgen fabrikaları (hepsi POZİTİF işaretli alan) -----------------
function dik(x0, x1, z0, z1) { return [[x0, z0], [x1, z0], [x1, z1], [x0, z1]]; }
function cember(cx, cz, r, n) {
  const p = [];
  for (let i = 0; i < n; i++) {
    const a = i * 2 * Math.PI / n;
    p.push([cx + r * Math.cos(a), cz + r * Math.sin(a)]);
  }
  return p;
}
// (dx,dz) yönünde uzanan, (cx,cz) merkezli kutu tabanı.
function kutuEksen(cx, cz, dx, dz, uzun, kalin) {
  const a = uzun / 2, b = kalin / 2, ex = -dz, ez = dx;
  return [
    [cx - dx * a - ex * b, cz - dz * a - ez * b],
    [cx + dx * a - ex * b, cz + dz * a - ez * b],
    [cx + dx * a + ex * b, cz + dz * a + ez * b],
    [cx - dx * a + ex * b, cz - dz * a + ez * b]
  ];
}
// Deterministik gürültü: taş örneğinin yerleşimi her kurulumda AYNI olsun
// (kapak, stüdyo önizlemesi ve haritadaki çizim ayrışmasın).
let _tohum = 20260904;
function rst() { _tohum = (_tohum * 1103515245 + 12345) & 0x7fffffff; return _tohum / 0x7fffffff; }

// ---------------------------------------------------------------------
// PALET.  ⚠️ Açık taş büyük düz yüzeylerde beyaza patlar (ölçülmüş kural:
// difüz = albedo x (1-metalness), metalness'i DÜŞÜRMEK patlamayı ARTIRIR).
// Taş bu yüzden orta tonda ve az miktarda metalness taşıyor.
// ---------------------------------------------------------------------
const C_TAS   = '#8e887c';   // sur/burç/kule — BİRİNCİL renk (kireç taşı)
const C_TAS_K = '#7d776b';   // silme + köşe taşı + moloz taş (aynı tonun koyusu)
const C_CATI  = '#5d4238';   // çatılar — İKİNCİL renk (kiremit)
const C_KOYU  = '#161511';   // ok deliği / kapı boşluğu / pencere
const C_DEMIR = '#2f3134';   // portkulis
const C_AHSAP = '#4a3423';   // kapı kanatları
const C_ZEMIN = '#6f675b';   // avlu döşemesi (tint'e dahil değil)
const C_BEZ   = ['#a83232', '#2f5ea8', '#c9a227'];   // doku gelmeden önceki bayrak renkleri

// ---------------------------------------------------------------------
// PLAN (metre) — Harlech iç avlusu
// ---------------------------------------------------------------------
const SUR_K   = 3.0;                 // sur kalınlığı (Harlech ~3 m)
const X0      = 22.5, Z0 = 28.0;     // sur DIŞ yüzü -> 45 x 56 m dikdörtgen
const XI      = X0 - SUR_K;          // 19.5 -> avlu 39 m (Harlech)
const ZI      = Z0 - SUR_K;          // 25.0 -> avlu 50 m (Harlech 47-53)
const Y_YOL   = 14.0;                // seğirdim (wall-walk)
const Y_MAZ   = 15.8;                // mazgal tepesi = Harlech GB burcu 15.8 m
const ETEK    = 1.0, ETEK_Y = 4.5;   // pah (batter)
const PRP     = 0.9;                 // korkuluk kalınlığı
const MZ_PER  = 2.05;                // diş + boşluk adımı
const MZ_ORAN = 0.63;                // diş 1.29 m, boşluk 0.76 m

const RB      = 5.0;                 // köşe burcu yarıçapı (çap 10 m — Harlech)
const BX      = 21.0, BZ = 26.5;     // köşe burcu merkezleri
const Y_BURC  = 17.6, Y_BMAZ = 19.4;
const RK      = 2.4;                 // burç üstü silindirik kule (Harlech)
const Y_KULE  = 22.8, Y_KMAZ = 24.2;

const KX      = 12.0;                // kapı kulesi yarı genişliği (24 m — Harlech)
const KZ_ON   = -34.0, KZ_ARKA = -21.0;
const Y_KAPI  = 18.0, Y_KMZ = 20.0;
const RD      = 3.6, DX = 8.4, DZ = -34.0;
const Y_DRM   = 20.5, Y_DMAZ = 22.3, Y_KONI = 27.2;

const BK_YARI = 8.5, BK_Z = 11.5;    // baş kule 17 m kare
const Y_BK    = 22.5, Y_BKMAZ = 24.8, Y_BKCATI = 29.0;
const MK_YARI = 2.3, MK_X = 9.9, MK_Z = 20.4;   // merdiven kulesi
const Y_MK    = 26.5, Y_MKMAZ = 28.3, Y_MKCATI = 30.8;

// Köşe burcunun sur korkuluğu çizgisini kestiği yarı-kiriş.
const KES = Math.sqrt(RB * RB - Math.pow(X0 - PRP / 2 - BX, 2));   // ~4.888

// =====================================================================
// 1) SUR DUVARLARI — pah + gövde + seğirdim
// =====================================================================
{
  const y = yigin();
  // (disX,disZ): dış yüzün normali. Pah yalnız DIŞ yüzde, 1.0 m taşar.
  function kol(x0, x1, z0, z1, disX, disZ) {
    const ust = dik(x0, x1, z0, z1);
    const alt = [
      [x0 - (disX < 0 ? ETEK : 0), z0 - (disZ < 0 ? ETEK : 0)],
      [x1 + (disX > 0 ? ETEK : 0), z0 - (disZ < 0 ? ETEK : 0)],
      [x1 + (disX > 0 ? ETEK : 0), z1 + (disZ > 0 ? ETEK : 0)],
      [x0 - (disX < 0 ? ETEK : 0), z1 + (disZ > 0 ? ETEK : 0)]
    ];
    y.kat(alt, ust, 0, ETEK_Y, true, false);
    y.prizma(ust, ETEK_Y, Y_YOL, false, true);
  }
  kol(-BX, BX, -Z0, -ZI, 0, -1);        // güney (ortasını kapı kulesi örter)
  kol(-BX, BX,  ZI,  Z0, 0,  1);        // kuzey
  kol(-X0, -XI, -BZ, BZ, -1, 0);        // batı
  kol( XI,  X0, -BZ, BZ,  1, 0);        // doğu
  modelGroup.add(mesh(y.geo(), C_TAS, { rough: 0.94, metal: 0.05, name: 'sur' }));
}

// =====================================================================
// 2) MAZGALLI KORKULUKLAR — tepeden bakışın imzası
// =====================================================================
const yM = yigin();
// Düz koşuda diş dizisi (korkuluk DIŞ kenara oturur, seğirdim arkada kalır).
function mazgalDuz(ax, az, bx, bz, y0, y1, kal) {
  const L = Math.hypot(bx - ax, bz - az);
  if (L < MZ_PER) return;
  const dx = (bx - ax) / L, dz = (bz - az) / L;
  const n = Math.max(1, Math.round(L / MZ_PER));
  const adim = L / n, w = adim * MZ_ORAN;
  for (let i = 0; i < n; i++) {
    const s = (i + 0.5) * adim, cx = ax + dx * s, cz = az + dz * s;
    // Dişin tepesi hafif dar: yağmur atsın, siluet de düz levha olmasın.
    yM.kat(kutuEksen(cx, cz, dx, dz, w, kal),
           kutuEksen(cx, cz, dx, dz, w - 0.16, kal - 0.14), y0, y1, false, true);
  }
}
// Halka koşuda diş dizisi (yuvarlak burç ve tambur korkulukları).
function mazgalHalka(cx, cz, rDis, kal, y0, y1, n) {
  // K = dişin dış yayının bölüntü sayısı. 4'ten 2'ye indirildi: 126 halka
  // dişinde diş başına 34 -> 16 üçgen, toplamda 2268 üçgen tasarrufu ve
  // 63 derecelik yay iki bölüntüyle zaten yuvarlak okunuyor.
  const rIc = rDis - kal, K = 2;
  for (let i = 0; i < n; i++) {
    const a0 = (i + 0.5 - MZ_ORAN / 2) * 2 * Math.PI / n;
    const a1 = (i + 0.5 + MZ_ORAN / 2) * 2 * Math.PI / n;
    const alt = [], ust = [];
    for (let k = 0; k <= K; k++) {
      const a = a0 + (a1 - a0) * k / K;
      alt.push([cx + rDis * Math.cos(a), cz + rDis * Math.sin(a)]);
      ust.push([cx + (rDis - 0.08) * Math.cos(a), cz + (rDis - 0.08) * Math.sin(a)]);
    }
    for (let k = K; k >= 0; k--) {
      const a = a0 + (a1 - a0) * k / K;
      alt.push([cx + rIc * Math.cos(a), cz + rIc * Math.sin(a)]);
      ust.push([cx + (rIc + 0.08) * Math.cos(a), cz + (rIc + 0.08) * Math.sin(a)]);
    }
    yM.kat(alt, ust, y0, y1, false, true);
  }
}
// Dikdörtgen çevre boyunca diş (kapı kulesi, baş kule, merdiven kulesi).
function mazgalDikdortgen(x0, x1, z0, z1, y0, y1, kal, atla) {
  atla = atla || [];
  const kenar = [
    ['G', x0 + kal, z0 + kal / 2, x1 - kal, z0 + kal / 2],
    ['D', x1 - kal / 2, z0 + kal, x1 - kal / 2, z1 - kal],
    ['K', x1 - kal, z1 - kal / 2, x0 + kal, z1 - kal / 2],
    ['B', x0 + kal / 2, z1 - kal, x0 + kal / 2, z0 + kal]
  ];
  for (let i = 0; i < kenar.length; i++) {
    const k = kenar[i];
    if (atla.indexOf(k[0]) === -1) mazgalDuz(k[1], k[2], k[3], k[4], y0, y1, kal);
  }
  const kose = [[x0 + kal / 2, z0 + kal / 2], [x1 - kal / 2, z0 + kal / 2],
                [x1 - kal / 2, z1 - kal / 2], [x0 + kal / 2, z1 - kal / 2]];
  for (let i = 0; i < 4; i++)
    yM.prizma(dik(kose[i][0] - kal / 2, kose[i][0] + kal / 2,
                  kose[i][1] - kal / 2, kose[i][1] + kal / 2), y0, y1, false, true);
}
// --- sur korkulukları (burç gövdesinin kestiği yaylar dışarıda) ---
mazgalDuz(-BX + KES, -Z0 + PRP / 2, -KX, -Z0 + PRP / 2, Y_YOL, Y_MAZ, PRP);
mazgalDuz(KX, -Z0 + PRP / 2, BX - KES, -Z0 + PRP / 2, Y_YOL, Y_MAZ, PRP);
mazgalDuz(-BX + KES, Z0 - PRP / 2, BX - KES, Z0 - PRP / 2, Y_YOL, Y_MAZ, PRP);
mazgalDuz(-X0 + PRP / 2, -BZ + KES, -X0 + PRP / 2, BZ - KES, Y_YOL, Y_MAZ, PRP);
mazgalDuz(X0 - PRP / 2, -BZ + KES, X0 - PRP / 2, BZ - KES, Y_YOL, Y_MAZ, PRP);
// --- burç + burç üstü kule korkulukları ---
const KOSE = [[-1, -1], [1, -1], [-1, 1], [1, 1]];
for (let i = 0; i < 4; i++) {
  mazgalHalka(KOSE[i][0] * BX, KOSE[i][1] * BZ, RB, PRP, Y_BURC, Y_BMAZ, 16);
  mazgalHalka(KOSE[i][0] * BX, KOSE[i][1] * BZ, RK, 0.7, Y_KULE, Y_KMAZ, 9);
}
// --- kapı kulesi + tamburlar ---
mazgalDikdortgen(-KX, KX, KZ_ON, KZ_ARKA, Y_KAPI, Y_KMZ, PRP, ['G']);
mazgalHalka(-DX, DZ, RD, PRP, Y_DRM, Y_DMAZ, 13);
mazgalHalka(DX, DZ, RD, PRP, Y_DRM, Y_DMAZ, 13);
// --- baş kule + merdiven kulesi ---
mazgalDikdortgen(-BK_YARI, BK_YARI, BK_Z - BK_YARI, BK_Z + BK_YARI, Y_BK, Y_BKMAZ, 1.05);
mazgalDikdortgen(MK_X - MK_YARI, MK_X + MK_YARI, MK_Z - MK_YARI, MK_Z + MK_YARI,
                 Y_MK, Y_MKMAZ, 0.8);
modelGroup.add(mesh(yM.geo(), C_TAS, { rough: 0.94, metal: 0.05, name: 'mazgal' }));

// =====================================================================
// 3) KÖŞE BURÇLARI (çap 10 m — Harlech) + üstlerindeki silindirik kuleler
// =====================================================================
for (let i = 0; i < 4; i++) {
  const cx = KOSE[i][0] * BX, cz = KOSE[i][1] * BZ;
  const y = yigin();
  y.kat(cember(cx, cz, RB + 0.8, 24), cember(cx, cz, RB, 24), 0, ETEK_Y, true, false);
  y.prizma(cember(cx, cz, RB, 24), ETEK_Y, Y_BURC, false, true);
  y.prizma(cember(cx, cz, RK, 16), Y_BURC, Y_KULE, false, true);
  modelGroup.add(mesh(y.geo(), C_TAS, { rough: 0.94, metal: 0.05, name: 'burc_' + (i + 1) }));
}

// =====================================================================
// 4) KAPI KULESİ — çift tamburlu, kemerli giriş, portkulis, makuliye
// =====================================================================
{
  const y = yigin();
  y.kat(dik(-KX - 0.9, KX + 0.9, KZ_ON - 0.9, KZ_ARKA), dik(-KX, KX, KZ_ON, KZ_ARKA),
        0, ETEK_Y, true, false);
  y.prizma(dik(-KX, KX, KZ_ON, KZ_ARKA), ETEK_Y, Y_KAPI, false, true);
  for (let s = -1; s <= 1; s += 2) {
    y.kat(cember(s * DX, DZ, RD + 0.7, 20), cember(s * DX, DZ, RD, 20), 0, ETEK_Y, true, false);
    y.prizma(cember(s * DX, DZ, RD, 20), ETEK_Y, Y_DRM, false, true);
  }
  modelGroup.add(mesh(y.geo(), C_TAS, { rough: 0.94, metal: 0.05, name: 'kapi_govde' }));
}

// --- kemerli giriş yüzü: tamburların arasını kapatan duvar, ortasında
//     yarım daire kemerli boşluk. ExtrudeGeometry, bevel KAPALI:
//     bevelSize konturu DIŞARI itiyor (motokaravanda ölçülmüş tuzak).
const GY = 5.6, GKZ0 = -36.2, GKZ1 = -34.0;
const AG = 1.9, AG_Y = 3.1;          // kemer açıklığı 3.8 m, omuz kotu 3.1 m
{
  const s = new THREE.Shape();
  s.moveTo(-GY, 0);
  s.lineTo(-AG, 0);
  s.lineTo(-AG, AG_Y);
  for (let i = 1; i < 14; i++) {
    const a = Math.PI - i * Math.PI / 14;
    s.lineTo(AG * Math.cos(a), AG_Y + AG * Math.sin(a));
  }
  s.lineTo(AG, AG_Y);
  s.lineTo(AG, 0);
  s.lineTo(GY, 0);
  s.lineTo(GY, Y_KAPI);
  s.lineTo(-GY, Y_KAPI);
  s.closePath();
  const g = new THREE.ExtrudeGeometry(s, { depth: GKZ1 - GKZ0, bevelEnabled: false, curveSegments: 3 });
  g.translate(0, 0, GKZ0);
  g.computeVertexNormals();
  modelGroup.add(mesh(g, C_TAS, { rough: 0.94, metal: 0.05, name: 'kapi_on' }));
}
// --- kemer taşları (voussoir) + söveler: giriş yüzünden 0.15 m dışarıda
{
  const y = yigin(), N = 13;
  for (let i = 0; i < N; i++) {
    const a0 = Math.PI * i / N, a1 = Math.PI * (i + 1) / N, p = [];
    for (let k = 0; k <= 2; k++) {
      const a = a0 + (a1 - a0) * k / 2;
      p.push([AG * Math.cos(a), AG_Y + AG * Math.sin(a)]);
    }
    for (let k = 2; k >= 0; k--) {
      const a = a0 + (a1 - a0) * k / 2;
      p.push([(AG + 0.55) * Math.cos(a), AG_Y + (AG + 0.55) * Math.sin(a)]);
    }
    y.prizmaZ(p.reverse(), GKZ0 - 0.15, GKZ0);
  }
  // söveler (kemer ayakları) — CCW sıra elle yazıldı
  y.prizmaZ([[AG, 0], [AG + 0.55, 0], [AG + 0.55, AG_Y], [AG, AG_Y]], GKZ0 - 0.15, GKZ0);
  y.prizmaZ([[-AG - 0.55, 0], [-AG, 0], [-AG, AG_Y], [-AG - 0.55, AG_Y]], GKZ0 - 0.15, GKZ0);
  modelGroup.add(mesh(y.geo(), C_TAS_K, { rough: 0.9, metal: 0.05, name: 'kapi_kemer' }));
}
// --- makuliye galerisi + burç/tambur konsol dizileri (kirpi saçak)
{
  const y = yigin();
  for (let i = 0; i < 9; i++) {
    const cx = -4.4 + i * 1.1;
    y.prizma(dik(cx - 0.28, cx + 0.28, GKZ0 - 0.95, GKZ0), 15.2, 17.0, true, true);
  }
  y.prizma(dik(-5.2, 5.2, GKZ0 - 0.95, GKZ0), 17.0, 17.75, true, true);
  for (let s = -1; s <= 1; s += 2) {
    for (let i = 0; i < 12; i++) {
      const a = i * 2 * Math.PI / 12;
      y.prizma(kutuEksen(s * DX + (RD + 0.33) * Math.cos(a), DZ + (RD + 0.33) * Math.sin(a),
                         Math.cos(a), Math.sin(a), 0.88, 0.5), Y_DRM - 1.4, Y_DRM, true, true);
    }
  }
  for (let j = 0; j < 4; j++) {
    for (let i = 0; i < 14; i++) {
      const a = i * 2 * Math.PI / 14;
      y.prizma(kutuEksen(KOSE[j][0] * BX + (RB + 0.33) * Math.cos(a),
                         KOSE[j][1] * BZ + (RB + 0.33) * Math.sin(a),
                         Math.cos(a), Math.sin(a), 0.88, 0.5), Y_BURC - 1.4, Y_BURC, true, true);
    }
  }
  modelGroup.add(mesh(y.geo(), C_TAS_K, { rough: 0.92, metal: 0.05, name: 'konsol' }));
}
// --- geçit karanlığı + portkulis + ahşap kanatlar
{
  const g = new THREE.BoxGeometry(2 * AG - 0.12, AG_Y + AG - 0.12, 0.16);
  g.translate(0, (AG_Y + AG) / 2 - 0.06, KZ_ARKA + 0.07);
  modelGroup.add(mesh(g, C_KOYU, { rough: 1.0, name: 'kapi_bosluk' }));
}
{
  const y = yigin(), yUst = AG_Y + AG - 0.35;
  for (let i = 0; i < 7; i++) {
    const cx = -1.62 + i * 0.54;
    y.prizma(dik(cx - 0.075, cx + 0.075, GKZ1 + 0.17, GKZ1 + 0.32), 0.0, yUst, false, true);
  }
  for (let i = 0; i < 4; i++)
    y.prizma(dik(-1.75, 1.75, GKZ1 + 0.19, GKZ1 + 0.30), 0.9 + i * 1.25, 1.06 + i * 1.25, true, true);
  modelGroup.add(mesh(y.geo(), C_DEMIR, { rough: 0.55, metal: 0.42, name: 'portkulis' }));
}
{
  const y = yigin(), zk = GKZ1 + 0.95;
  for (let s = -1; s <= 1; s += 2) {
    const a = s > 0 ? 0.04 : -1.84, b = s > 0 ? 1.84 : -0.04;
    y.prizma(dik(a, b, zk - 0.09, zk + 0.09), 0, 4.5, true, true);
    for (let i = 0; i < 3; i++)
      y.prizma(dik(a + 0.02, b - 0.02, zk - 0.16, zk - 0.09), 0.7 + i * 1.5, 0.94 + i * 1.5, true, true);
  }
  modelGroup.add(mesh(y.geo(), C_AHSAP, { rough: 0.9, name: 'kapi_kanat' }));
}

// =====================================================================
// 5) BAŞ KULE (donjon) — Norman büyük kulesi oranında
// =====================================================================
{
  const y = yigin(), a = BK_YARI, z0 = BK_Z - BK_YARI, z1 = BK_Z + BK_YARI;
  y.kat(dik(-a - 1.1, a + 1.1, z0 - 1.1, z1 + 1.1), dik(-a, a, z0, z1), 0, ETEK_Y, true, false);
  y.prizma(dik(-a, a, z0, z1), ETEK_Y, Y_BK, false, true);
  modelGroup.add(mesh(y.geo(), C_TAS, { rough: 0.94, metal: 0.05, name: 'bas_kule' }));
}
{
  // Norman payandaları: DÖRT KÖŞEDE saran (clasping) payanda + her yüzde
  // TEK orta pilaster. İlk kurulumda yüz başına üç şerit vardı ve kule
  // 3/4 bakışta bir demet dikey çubuk gibi okunuyordu; köşeye ağırlık
  // veren bu düzen Rochester/White Tower'ın gerçek düzenidir.
  const y = yigin(), a = BK_YARI, z0 = BK_Z - BK_YARI, z1 = BK_Z + BK_YARI, P = 0.8, W = 2.4;
  function bar(x0, x1, zz0, zz1) {
    y.prizma(dik(Math.min(x0, x1), Math.max(x0, x1), Math.min(zz0, zz1), Math.max(zz0, zz1)),
             0, Y_BK, false, true);
  }
  for (let sx = -1; sx <= 1; sx += 2) {
    for (let tz = -1; tz <= 1; tz += 2) {
      const cx = sx * a, cz = BK_Z + tz * BK_YARI;
      bar(cx, cx + sx * P, cz, cz - tz * W);
      bar(cx, cx - sx * W, cz, cz + tz * P);
    }
  }
  bar(a, a + P, BK_Z - W / 2, BK_Z + W / 2);
  bar(-a, -a - P, BK_Z - W / 2, BK_Z + W / 2);
  bar(-W / 2, W / 2, z1, z1 + P);
  bar(-W / 2, W / 2, z0, z0 - P);
  modelGroup.add(mesh(y.geo(), C_TAS, { rough: 0.94, metal: 0.05, name: 'bas_kule_payanda' }));
}
{
  // Kırma çatı — korkuluğun ARKASINDA kalır, dışarıdan görünmez ama
  // haritanın ana bakışı tepeden olduğu için EN ÇOK görünen yüzeydir.
  const y = yigin(), a = BK_YARI - 1.05;
  const z0 = BK_Z - BK_YARI + 1.05, z1 = BK_Z + BK_YARI - 1.05;
  const A = [[-a, Y_BK, z0], [a, Y_BK, z0], [a, Y_BK, z1], [-a, Y_BK, z1]];
  const M0 = [0, Y_BKCATI, z0 + 4.0], M1 = [0, Y_BKCATI, z1 - 4.0];
  y.ekle([A[1], A[0], M0]);
  y.ekle([A[3], A[2], M1]);
  y.ekle([A[0], A[3], M1, M0]);
  y.ekle([A[2], A[1], M0, M1]);
  modelGroup.add(mesh(y.geo(), C_CATI, { rough: 0.85, metal: 0.05, name: 'cati_bas_kule' }));
}
{
  const y = yigin();
  y.prizma(dik(MK_X - MK_YARI, MK_X + MK_YARI, MK_Z - MK_YARI, MK_Z + MK_YARI), 0, Y_MK, true, true);
  modelGroup.add(mesh(y.geo(), C_TAS, { rough: 0.94, metal: 0.05, name: 'merdiven_kule' }));
  const y2 = yigin();
  y2.koni(dik(MK_X - MK_YARI + 0.65, MK_X + MK_YARI - 0.65,
              MK_Z - MK_YARI + 0.65, MK_Z + MK_YARI - 0.65),
          Y_MK, [MK_X, Y_MKCATI, MK_Z], true);
  modelGroup.add(mesh(y2.geo(), C_CATI, { rough: 0.85, metal: 0.05, name: 'cati_merdiven' }));
}

// =====================================================================
// 6) KAPI TAMBURLARININ KONİK ÇATILARI
// =====================================================================
for (let s = -1; s <= 1; s += 2) {
  const y = yigin();
  y.koni(cember(s * DX, DZ, RD - 0.55, 20), Y_DMAZ - 0.4, [s * DX, Y_KONI, DZ], true);
  modelGroup.add(mesh(y.geo(), C_CATI, { rough: 0.85, metal: 0.05,
                                         name: 'cati_kapi_' + (s > 0 ? 2 : 1) }));
}

// =====================================================================
// 7) AVLU KANATLARI — sura yaslanan iki katlı binalar (Bodiam/Harlech)
// =====================================================================
for (let s = -1; s <= 1; s += 2) {
  const xd = s * XI, xi = s * (XI - 6.3), z0 = -17.0, z1 = 1.0;
  const y = yigin();
  y.prizma(dik(Math.min(xd, xi), Math.max(xd, xi), z0, z1), 0, 8.6, false, true);
  modelGroup.add(mesh(y.geo(), C_TAS, { rough: 0.94, metal: 0.05,
                                        name: 'avlu_bina_' + (s > 0 ? 2 : 1) }));
  // Tek eğimli (lean-to) çatı: sura yaslanan kenar yüksek, saçak 0.5 m taşar.
  const y2 = yigin();
  const xs = s * (XI - 6.8);                 // saçak ucu
  const p = dik(Math.min(xd, xs), Math.max(xd, xs), z0 - 0.4, z1 + 0.4);
  const A = [], B = [];
  for (let i = 0; i < 4; i++) {
    const yy = (Math.abs(p[i][0]) > (XI - 3.2)) ? 12.2 : 8.9;
    A.push([p[i][0], yy - 0.55, p[i][1]]);
    B.push([p[i][0], yy, p[i][1]]);
  }
  y2.kat3(A, B, true, true);
  modelGroup.add(mesh(y2.geo(), C_CATI, { rough: 0.85, metal: 0.05,
                                          name: 'cati_' + (s > 0 ? 2 : 1) }));
}

// =====================================================================
// 8) AVLU: taş döşeme + seğirdime çıkan merdiven + kuyu
// =====================================================================
{
  // Avlu döşemesi. TİNT'E DAHİL DEĞİL: kullanıcı sura renk verdiğinde
  // avlu toprak/taş tonunda kalsın, yoksa tepeden bakışta kalenin
  // %60'ı tek düz renge dönüyor ve kütle okunmuyor. Ayrıca döşeme
  // olmasaydı avlunun içinden harita görünürdü.
  const y = yigin();
  y.prizma(dik(-XI, XI, -ZI, ZI), 0, 0.40, false, true);
  modelGroup.add(mesh(y.geo(), C_ZEMIN, { rough: 0.98, metal: 0.02, name: 'avlu_zemin' }));
}
{
  const y = yigin(), N = 16, x0 = -XI + 0.2, gen = 2.6;
  for (let i = 0; i < N; i++) {
    const z = 22.0 - i * 1.0;
    y.prizma(dik(x0, x0 + gen, z - 1.0, z), 0, Y_YOL * (i + 1) / N, true, true);
  }
  modelGroup.add(mesh(y.geo(), C_TAS, { rough: 0.95, metal: 0.04, name: 'avlu_merdiven' }));
}
{
  const y = yigin();
  y.prizma(cember(-6.0, -12.0, 1.7, 12), 0, 1.3, false, true);
  y.prizma(cember(-6.0, -12.0, 1.35, 12), 1.3, 1.45, false, true);
  modelGroup.add(mesh(y.geo(), C_TAS, { rough: 0.95, metal: 0.04, name: 'kuyu' }));
}

// =====================================================================
// 9) TAŞ DOKUSU — silme kuşakları, köşe taşları, dağınık moloz taş
// =====================================================================
{
  const y = yigin();
  // ⚠️ DOLU dikdörtgen kuşak AVLUYU KAPATIYOR. İlk kurulumda sur kuşağı
  // `dik(-X0..X0, -Z0..Z0)` prizmasıyla yazılmıştı: 45 x 56 m'lik SOLID
  // bir krep, avlu binalarının (tepesi 12.2 m) tam üstüne (12.95 m)
  // oturuyor ve onları YOK EDİYORDU. Tepeden bakışta ölçüldü: doluluk
  // 0.824, avlu tamamen dolu. İçi boş yapılarda kuşak dört ayrı kenar.
  function kusak(x0, x1, z0, z1, yy, d) {          // DOLU (kule/gövde içi)
    y.prizma(dik(x0 - d, x1 + d, z0 - d, z1 + d), yy, yy + 0.42, true, true);
  }
  function kusakHalka(x0, x1, z0, z1, yy, d, kal) {   // İÇİ BOŞ (sur)
    y.prizma(dik(x0 - d, x1 + d, z0 - d, z0 + kal), yy, yy + 0.42, true, true);
    y.prizma(dik(x0 - d, x1 + d, z1 - kal, z1 + d), yy, yy + 0.42, true, true);
    y.prizma(dik(x0 - d, x0 + kal, z0 + kal, z1 - kal), yy, yy + 0.42, true, true);
    y.prizma(dik(x1 - kal, x1 + d, z0 + kal, z1 - kal), yy, yy + 0.42, true, true);
  }
  kusakHalka(-X0, X0, -Z0, Z0, ETEK_Y - 0.42, 0.16, SUR_K);
  kusakHalka(-X0, X0, -Z0, Z0, Y_YOL - 1.05, 0.16, SUR_K);
  kusak(-KX, KX, KZ_ON, KZ_ARKA, ETEK_Y - 0.42, 0.16);
  kusak(-BK_YARI, BK_YARI, BK_Z - BK_YARI, BK_Z + BK_YARI, ETEK_Y - 0.42, 0.16);
  kusak(-BK_YARI, BK_YARI, BK_Z - BK_YARI, BK_Z + BK_YARI, 12.6, 0.16);
  for (let i = 0; i < 4; i++) {
    y.prizma(cember(KOSE[i][0] * BX, KOSE[i][1] * BZ, RB + 0.16, 24), ETEK_Y - 0.42, ETEK_Y, true, true);
    y.prizma(cember(KOSE[i][0] * BX, KOSE[i][1] * BZ, RB + 0.16, 24), 11.4, 11.82, true, true);
  }
  for (let s = -1; s <= 1; s += 2)
    y.prizma(cember(s * DX, DZ, RD + 0.16, 20), ETEK_Y - 0.42, ETEK_Y, true, true);
  modelGroup.add(mesh(y.geo(), C_TAS_K, { rough: 0.95, metal: 0.04, name: 'silme' }));
}
{
  // Köşe taşı (quoin): kapı kulesinin ve baş kulenin dikey köşelerinde,
  // uzun-kısa değişimli sıra. Taş işçiliği bunlarla okunuyor.
  const y = yigin();
  function quoin(cx, cz, dx, dz, y0, y1) {
    let yy = y0, i = 0;
    while (yy < y1 - 0.6) {
      const h = 0.62, u = (i % 2) ? 1.35 : 0.85;
      y.prizma(kutuEksen(cx + dx * u / 2, cz + dz * u / 2, dx, dz, u, 0.86), yy, yy + h, true, true);
      yy += h + 0.16; i++;
    }
  }
  // ⚠️ Baş kulenin köşelerine köşe taşı KONULMADI: oraya zaten saran
  // (clasping) payanda oturuyor, taşlar payandanın İÇİNDE kalıyordu.
  // Ölçüldü: dört köşe için 92 blok = 1104 üçgen, tamamı görünmez.
  for (let s = -1; s <= 1; s += 2) {
    quoin(s * KX, KZ_ARKA, -s, 0, ETEK_Y, Y_KAPI);
    quoin(s * KX, KZ_ARKA, 0, -1, ETEK_Y, Y_KAPI);
  }
  modelGroup.add(mesh(y.geo(), C_TAS_K, { rough: 0.95, metal: 0.04, name: 'kose_tas' }));
}
{
  // Kaba yonu / moloz taş örneği: yüzeyden 0.13 m taşan dağınık bloklar.
  // TİNT'E DAHİL — kullanıcı renk verince taş BÜTÜN kalır, doku yalnız
  // KABARTI olarak (ışık/gölge) okunmaya devam eder.
  const y = yigin();
  function serp(x0, x1, z0, z1, yy0, yy1, dx, dz, n) {
    for (let i = 0; i < n; i++) {
      const u = rst(), v = rst();
      const cx = x0 + (x1 - x0) * u, cz = z0 + (z1 - z0) * u;
      const yy = yy0 + (yy1 - yy0) * v;
      const w = 0.9 + rst() * 1.7, h = 0.45 + rst() * 0.5;
      y.prizma(kutuEksen(cx + dx * 0.07, cz + dz * 0.07, -dz, dx, w, 0.26), yy, yy + h, true, true);
    }
  }
  serp(-BX + KES, -KX, -Z0, -Z0, ETEK_Y, Y_YOL - 1.7, 0, -1, 5);
  serp(KX, BX - KES, -Z0, -Z0, ETEK_Y, Y_YOL - 1.7, 0, -1, 5);
  serp(-BX + KES, BX - KES, Z0, Z0, ETEK_Y, Y_YOL - 1.7, 0, 1, 12);
  serp(-X0, -X0, -BZ + KES, BZ - KES, ETEK_Y, Y_YOL - 1.7, -1, 0, 13);
  serp(X0, X0, -BZ + KES, BZ - KES, ETEK_Y, Y_YOL - 1.7, 1, 0, 13);
  serp(-KX, KX, KZ_ARKA, KZ_ARKA, ETEK_Y, Y_KAPI - 1.5, 0, 1, 8);
  for (let s = -1; s <= 1; s += 2)
    serp(s * KX, s * KX, KZ_ON, KZ_ARKA, ETEK_Y, Y_KAPI - 1.5, s, 0, 7);
  for (let j = 0; j < 4; j++) {
    for (let i = 0; i < 9; i++) {
      const a = rst() * 2 * Math.PI, yy = ETEK_Y + rst() * (Y_BURC - 2.6 - ETEK_Y);
      const cx = KOSE[j][0] * BX + (RB + 0.07) * Math.cos(a);
      const cz = KOSE[j][1] * BZ + (RB + 0.07) * Math.sin(a);
      const w = 0.9 + rst() * 1.3, h = 0.45 + rst() * 0.45;
      y.prizma(kutuEksen(cx, cz, -Math.sin(a), Math.cos(a), w, 0.26), yy, yy + h, true, true);
    }
  }
  modelGroup.add(mesh(y.geo(), C_TAS_K, { rough: 0.96, metal: 0.04, name: 'tas_ornek' }));
}

// =====================================================================
// 10) OK MAZGALLARI — söveli, haç biçimli (arbalestina)
// =====================================================================
const yOC = yigin(), yOD = yigin();
function okMazgali(cx, cz, dx, dz, ym) {
  const ex = -dz, ez = dx;
  yOC.prizma(kutuEksen(cx + dx * 0.05, cz + dz * 0.05, ex, ez, 0.95, 0.20), ym - 1.15, ym + 1.15, true, true);
  yOD.prizma(kutuEksen(cx + dx * 0.13, cz + dz * 0.13, ex, ez, 0.19, 0.10), ym - 0.85, ym + 0.85, true, true);
  yOD.prizma(kutuEksen(cx + dx * 0.13, cz + dz * 0.13, ex, ez, 0.80, 0.10), ym + 0.30, ym + 0.49, true, true);
}
for (let i = 0; i < 9; i++)
  okMazgali(-BX + KES + 0.8 + i * ((BX - KES) * 2 - 1.6) / 8, Z0, 0, 1, 8.6);
for (let i = 0; i < 10; i++) {
  const t = -BZ + KES + 0.8 + i * ((BZ - KES) * 2 - 1.6) / 9;
  okMazgali(-X0, t, -1, 0, 8.6);
  okMazgali(X0, t, 1, 0, 8.6);
}
okMazgali(-16.4, -Z0, 0, -1, 8.6); okMazgali(-13.4, -Z0, 0, -1, 8.6);
okMazgali(16.4, -Z0, 0, -1, 8.6);  okMazgali(13.4, -Z0, 0, -1, 8.6);
for (let j = 0; j < 4; j++) {
  for (let k = 0; k < 3; k++) {
    const a = Math.atan2(KOSE[j][1], KOSE[j][0]) + (k - 1) * 0.62;
    okMazgali(KOSE[j][0] * BX + RB * Math.cos(a), KOSE[j][1] * BZ + RB * Math.sin(a),
              Math.cos(a), Math.sin(a), 7.2 + (k === 1 ? 5.4 : 0));
  }
}
for (let s = -1; s <= 1; s += 2) {
  okMazgali(s * KX, -30.0, s, 0, 9.0);
  okMazgali(s * KX, -24.5, s, 0, 13.0);
  const sap = [-0.75, 0, 0.75];
  for (let k = 0; k < 3; k++) {
    const a = -Math.PI / 2 + sap[k] + s * 0.35;
    okMazgali(s * DX + RD * Math.cos(a), DZ + RD * Math.sin(a), Math.cos(a), Math.sin(a), 10.5);
  }
  for (let t = -1; t <= 1; t += 2) {
    okMazgali(s * BK_YARI, BK_Z + t * 4.4, s, 0, 10.0);
    okMazgali(s * BK_YARI, BK_Z + t * 4.4, s, 0, 16.4);
    okMazgali(s * 4.4, BK_Z + t * BK_YARI, 0, t, 13.2);
  }
}
okMazgali(-2.6, GKZ0, 0, -1, 9.2); okMazgali(2.6, GKZ0, 0, -1, 9.2);
{
  // ⚠️ Aynı yüzeye oturan panellerde derinlik kavgası: söve ve yarık aynı
  // duvar yüzünden çıkıyor, katman katman polygonOffset veriliyor.
  const m1 = mesh(yOC.geo(), C_TAS, { rough: 0.9, metal: 0.05, name: 'mazgal_sove' });
  m1.material.polygonOffset = true;
  m1.material.polygonOffsetFactor = -1; m1.material.polygonOffsetUnits = -1;
  modelGroup.add(m1);
  const m2 = mesh(yOD.geo(), C_KOYU, { rough: 1.0, name: 'ok_deligi' });
  m2.material.polygonOffset = true;
  m2.material.polygonOffsetFactor = -2; m2.material.polygonOffsetUnits = -2;
  modelGroup.add(m2);
}
{
  const y = yigin();
  for (let s = -1; s <= 1; s += 2) {
    const xa = s > 0 ? XI - 6.42 : -XI + 6.30, xb = s > 0 ? XI - 6.30 : -XI + 6.42;
    for (let i = 0; i < 5; i++) {
      const cz = -14.5 + i * 3.4;
      y.prizma(dik(xa, xb, cz - 0.55, cz + 0.55), 2.2, 4.2, true, true);
      y.prizma(dik(xa, xb, cz - 0.55, cz + 0.55), 5.4, 7.4, true, true);
    }
  }
  y.prizma(dik(-1.5, 1.5, BK_Z - BK_YARI - 0.14, BK_Z - BK_YARI), 0, 4.0, true, true);
  const m = mesh(y.geo(), C_KOYU, { rough: 1.0, name: 'pencere' });
  m.material.polygonOffset = true;
  m.material.polygonOffsetFactor = -2; m.material.polygonOffsetUnits = -2;
  modelGroup.add(m);
}

// =====================================================================
// 11) BAYRAK DİREKLERİ — Studio3D `_BAYRAK` sözleşmesi
// ---------------------------------------------------------------------
// Motor şu adları arıyor (AD DEĞİŞTİRME):
//   direkGrup_n  -> rotation.y = YÖN; grubun TAMAMI gizlenebilir, yani
//                   kullanıcı 1 bayrak seçince 2. ve 3. direk de kaybolur
//   direkEgim_n  -> rotation.x = EĞİM, rotation.z = YATIŞ
//   bayrakGrup_n -> bezin asıldığı nokta (motor rotation.x/z'yi SIFIRLAR)
//   bayrakYon_n  -> rotation.y = bezin uzanma yönü
//   bayrak_n     -> bez mesh'i; doku (ülke bayrağı) buraya giydirilir
// Sıra ÖNEMLİ: adet=1 iken yalnız 1. direk açık kalıyor, o da BAŞ KULENİN
// tepesindeki ana sancak. 2 ve 3 kapı kulesinin tamburlarında.
//
// Direkler DİK (eğim/yatış 0), yön 90: bez doğuya uzanır, yüzü varsayılan
// güney kamerasına döner — masa bayrağının tek-bayrak kuralının aynısı.
// DALGALANMA GEOMETRİDE PİŞİRİLİYOR, davranışta değil: registerBehavior
// eklenen modeli motor HER KARE animasyonlu sayıyor (studio-3d.js:1669) ve
// duran bir yapı için o bedel ödenmez — otomobilde de bilerek ödenmemişti.
// Yan sonuç: sahne zaten mutlak durumdan kuruluyor, t=0/t=1 sınırında
// biriken hiçbir durum yok.
// =====================================================================
const DIREK = [
  [MK_X, MK_Z, Y_MKCATI - 0.15, 5.6, 5.4, 3.5],   // baş kule / merdiven kulesi
  [-DX, DZ, Y_KONI - 0.15, 4.4, 4.0, 2.6],        // batı kapı tamburu
  [DX, DZ, Y_KONI - 0.15, 4.4, 4.0, 2.6]          // doğu kapı tamburu
];
for (let i = 0; i < 3; i++) {
  const n = i + 1, d = DIREK[i];

  const yon = new THREE.Group();
  yon.name = 'direkGrup_' + n;
  yon.position.set(d[0], d[2], d[1]);
  yon.rotation.y = Math.PI / 2;              // varsayılan YÖN 90 (motor ezer)
  modelGroup.add(yon);

  const eg = new THREE.Group();
  eg.name = 'direkEgim_' + n;
  yon.add(eg);

  const direk = mesh(new THREE.CylinderGeometry(0.085, 0.115, d[3], 8), '#3a2c1e',
                     { rough: 0.9, name: 'direk_' + n });
  direk.position.set(0, d[3] / 2, 0);
  eg.add(direk);

  const topuz = mesh(new THREE.SphereGeometry(0.19, 10, 8), '#a8862e',
                     { metal: 0.45, rough: 0.3, name: 'topuz_' + n });
  topuz.position.set(0, d[3] + 0.14, 0);
  eg.add(topuz);

  const bg = new THREE.Group();
  bg.name = 'bayrakGrup_' + n;
  bg.position.set(0, d[3] - 0.28, 0);
  eg.add(bg);

  const by = new THREE.Group();
  by.name = 'bayrakYon_' + n;
  bg.add(by);

  // Bez masa bayrağıyla BİREBİR aynı kuruluyor: düzlem +x'te açılır,
  // rotateY(-90) ile +z'ye çevrilir, bağlantı kenarı direkte kalır,
  // serbest uç kendi ağırlığıyla sarkar, rüzgâr dalgası u boyunca pişirilir.
  const EN = d[4], BOY = d[5];
  const geo = new THREE.PlaneGeometry(EN, BOY, 14, 3);
  geo.rotateY(-Math.PI / 2);
  const pos = geo.attributes.position;
  for (let k = 0; k < pos.count; k++) {
    const u = (pos.getZ(k) + EN / 2) / EN;    // 0 = direk yanı, 1 = serbest uç
    pos.setX(k, pos.getX(k) + Math.sin(u * Math.PI * 1.9) * 0.10 * EN * u);
    pos.setY(k, pos.getY(k) - 0.085 * BOY * u * u);
  }
  pos.needsUpdate = true;
  geo.computeVertexNormals();
  const bez = mesh(geo, C_BEZ[i], { rough: 0.86, name: 'bayrak_' + n });
  bez.material.side = THREE.DoubleSide;
  bez.position.set(0, -BOY / 2, EN / 2 + 0.10);
  by.add(bez);
}
