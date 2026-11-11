// Mancınık — karşı ağırlıklı trebuchet. Historical Warfare temasının
// kuşatma makinesi.
//
// KAYNAK ÖLÇÜLER (ezberden DEĞİL; hangi sayının nereden geldiği tek tek yazılı):
//   * Villard de Honnecourt'un (yak. 1230-35) sehpa çerçeveli karşı ağırlıklı
//     trebuchet'i, Robert Willis rekonstrüksiyonu:
//       TABAN ÇERÇEVESİ 8.5 x 12.5 m · KALKIK KOL 18 m yüksekliğe erişiyor ·
//       karşı ağırlık sandığı ~18 m³, 30 tona kadar yük.
//   * Warwick Castle 2005 (Carpenter Oak; 13.-14. yy çizimlerinden,
//     Middelaldercentret'ten Peter Vemming danışmanlığında):
//       18 m boy · 22 ton · 300+ parça MEŞE, kol DİŞBUDAK ·
//       36 kg mermi, 300 m menzil.
//   * Middelaldercentret (Nykøbing Falster) 2011: yeni atış kolu Warwick'in
//     kolundan yalnız 5 cm uzun — iki makine aynı sınıfta.
//   * Oran kuralları: uzun kol / kısa kol ~ 4:1 · karşı ağırlık / mermi ~ 100:1.
//
// MODELİN ÖLÇÜLERİ BU KAYNAKLARDAN TÜRETİLDİ (varsayım değil, aritmetik):
//   18.00 m tam kalkık boy = MİL YÜKSEKLİĞİ + UZUN KOL
//        → mil 8.60 m, uzun kol 9.40 m  (8.60 + 9.40 = 18.00 tam)
//   4:1 oranı → kısa kol 2.35 m, KİRİŞİN TAMAMI 11.75 m
//   taban kızağı 12.50 x 8.50 m — Villard'ın taban çerçevesi, birebir
//   karşı ağırlık sandığı 1.70 x 1.70 x 1.30 m = 3.76 m³; moloz taş
//        (~1.6 t/m³) ile ≈ 6.0 t. 36 kg'lık Warwick mermisine oran 167:1 —
//        100:1 alt sınırı ile Villard'ın 30 tonluk üst sınırı arasında.
//   sapan 2.35 m (= kısa kol). Sapan boyu kaynaklarda makineye göre değişiyor;
//        burada kısa kola eşitlendi ki kesenin DİNLENME yeri oluğun üstünde
//        kalsın (kutu ölçüsü buna bağlı).
//
// ÖLÇÜLEN DEĞERLER (hepsi araçla, göz kararı yok):
//   KUTU (ucgen_say.js)      15.850 x 10.707 x 8.500 — z birebir Villard'ın
//        8.50 m'si; x'in 15.85'i kızak (12.50) + oluğun arkaya taşan 3.35 m'si.
//   AĞIRLIK (ucgen_say.js)   46 mesh / 6284 üçgen.
//        (ZEMİN SADELEŞTİRMESİ ÖNCESİ 49 / 8700 idi; -%27.8. Ne çıktığı ve
//         hangi ölçekte okunmadığı aşağıdaki §3-§6 bloklarında tek tek
//         yazılı, ölçen betik mancinik_zemin_secim.py.)
//        Kıyas: otomobil 84/12968 · roketatar 109/8924 · tank 87/11008.
//        Mesh sayısı düşük çünkü kereste RENK GRUBUNA GÖRE tek mesh'te
//        birleşiyor (gerekçe §2); üçgen bütçesi kıyas aralığında.
//   ZEMİN (mancinik_zemin_tara.js, 501 faz x 24 azimut): bütün parçalar
//        y >= 0; en alçak nokta y = 0.000000 (kızak, sabit). HAREKET EDEN
//        parçaların en alçağı 0.580 m (kese, oluğun üstünde). 24 azimutta
//        en alçak y sapması 0.000000000 m.
//   UÇ SÜREKLİLİK: fireT=0 ile fireT=1 arasında en büyük tepe noktası farkı
//        0.000000000 m (aynı ölçüm gerçek motorda da 0.000000 derece).
//   ÇEVRİMİN KUTUSU: x [-11.904, 6.678] · y [0, 20.710]. Dinlenme kutusunun
//        dışına taşan tek şey savrulan SAPAN ve kolun ucu; ölçek dinlenme
//        pozundan geldiği için bu bilinçli (gölge erişimi davranışta telafi
//        ediliyor).
//   PARLAKLIK (mancinik_palet_tara.py, tepe bakışı, tam beyaz piksel oranı):
//        varsayılan %0.0 · kum #c2b280 %0.0 · #dcd3c0 %49.7 · beyaz %68.1.
//        (metalness 0.12 -> 0.32 yapılınca #dcd3c0 da %0.0'a düşüyor ama
//         varsayılan ton %15 koyulaşıyor; varsayılan bırakıldı.)
//   TEPEDEN AYRIM (mancinik_tepe_kiyas.py): siluet 64.09 m², DOLULUK 0.476.
//        (sadeleştirme öncesi 70.55 m² / 0.524 — aynı betikle ölçüldü.)
//        Kıyas: roketatar 0.997 · askeri-kamyon 0.847 · tank 0.674.
//        Mancınık bir İSKELET; ayak izi de tankınkinin 3.3 katı.
//        KUŞATMA ÜÇLÜSÜ, tepeden (aynı betik, 2026-09-04):
//          mancınık     15.850 x 8.500 · 64.09 m² · doluluk 0.476
//          koçbaşı       8.685 x 4.719 · 29.04 m² · doluluk 0.709 (KAPALI
//                        sundurma — dolu bir dikdörtgen, mancınık iskelet)
//          kuşatma topu  5.292 x 2.280 ·  5.46 m² · doluluk 0.453 (tek
//                        namlu + kundak; ayak izi mancınığın 1/12'si)
//   KOL (gerçek motorda, sabitlenmiş fireT): 58.186 .. 230.565 derece
//        (172.379 derecelik süpürme); sandığın şakulden sapması -1.9 .. +20.4.
//
// ⚠️ DİNLENME POZU = KURULU (germe bitmiş, mermi kesede, kol aşağı, karşı
// ağırlık yukarı). Üç gerekçe:
//   1. Haritadaki durağan işaret bir SİLAH; boşalmış makine değil kurulu
//      makine okunuyor.
//   2. Çevrim kurulu pozdan başlayıp kurulu poza dönüyor: serbest bırakma →
//      savrulma → sallanıp durma → germe → kurulu. Anlatı sırası doğru ve
//      t=0 ile t=1 BİREBİR aynı poz.
//   3. Tepeden siluet uzun bir omurga (oluk + kol) + geniş bir kızak veriyor;
//      ikinci turda gelecek KOÇBAŞI (kapalı sundurma) ve KUŞATMA TOPU
//      (yatakta namlu) ile karışmıyor.
//
// ⚠️ NEDEN `_TURRETS` YOK. Motor taretli modelde gövdeyi `aimBase`de sabit
// tutup farkı tarete döndürüyor. Mancınıkta dönecek "üst yapı" ile duracak
// "kaide" arasında dürüst bir ayrım YOK: sehpayı döndürürsen oluk ile sapan
// da dönmek zorunda, geriye yalnız kızak kalıyor ve 3.35 m dışarı taşan oluk
// kızağın üstünde süpürüyor. Gerçekte de makine manivelalarla BÜTÜN olarak
// çevriliyordu. Taret yokken motor `aimBase`i yok sayıyor ve GÖVDE
// `rotationDeg`e dönüyor (studio-3d.js: `_aiming = inst.turret && ...`) —
// istenen davranış tam bu. 'fire' modu yine ŞART ama taret için değil: kolu
// savuran faz `item.fireT` penceresinden okunuyor ve o pencere yalnız 'fire'
// listedeyken üretiliyor (geçişte F1..F2 dilimi, beklemede `_m3dIdleFire`).
//
// PARÇALAR (Studio3D bu adları arar, DEĞİŞTİRME):
//   kaide · kazik_1..4 · oluk · oluk_kizak_1/2 · sehpa_1/2 · sehpa_bag ·
//   sehpa_capraz · merdiven · vinc_govde · kol → BİRİNCİL RENK (_TINT.parts)
//   ⚠️ Zemin sadeleştirmesinde YALNIZ _TINT DIŞINDAKİ üç ad kayboldu:
//   `kavela_kaide` (kızak kavelaları, tamamı çıktı) ve `vinc_kol_5/6`
//   (manivela 6 -> 4). _TINT listelerindeki adların HEPSİ duruyor.
//   sandik                                  → İKİNCİL RENK (_TINT.parts2)
//   kol_kok      → kolun dönme grubu   (davranış rotation.z = ALFA yazar)
//   agirlik_kok  → sandığın asılma grubu (davranış -ALFA + yalpa yazar)
//   vinc_kok     → vinç tamburu        (davranış halat boyundan açı yazar)
//   halat_vinc · halat_sapan_1/2 · kese · tas → davranış konumlandırıyor
//
// YÖN: atış yönü +x (motorun burun yönü), üst +y, taban y=0. Ölçüler gerçek
// metre. Model z'de simetrik (merdiven hariç) — harita her modeli soldan sağa
// aynalıyor (devir §5.3); simetride görünür sonucu yok, tek yana yazı YOK.

// ===========================================================================
// 0. RENKLER VE MALZEME
// ===========================================================================
// ⚠️ metalness 0.85+ neredeyse SİYAH (sahnede environment map yok). Ahşapta
// zaten mat isteniyor; ama metalness SIFIRA da indirilmiyor — kullanıcı
// gövdeyi beyaza boyayabiliyor ve az miktarda metalness açık renkte patlamayı
// TERBİYE ediyor (uçakta ölçüldü, devir §5.1).
const C_MESE     = '#7d5f3e';   // _TINT varsayılanı — yağlanmış meşe
const C_MESE_K   = '#5d472e';   // gölgeli aralık, merdiven, mil
const C_DISBUDAK = '#94724a';   // kol: Warwick'te kol dişbudak, gövde meşe
const C_DEMIR    = '#3d4247';   // dövme demir bilezik, kuşak, kanca
const C_DEMIR_A  = '#585f66';   // parlak demir (mil yatağı, mandal)
const C_HALAT    = '#b0a077';   // kenevir halat
const C_DERI     = '#4a3826';   // sapan kesesi
const C_TAS      = '#7a7770';   // mermi ve safra taşı
const C_TAHTA    = '#6a563c';   // oluk tabanı: aşınmış, boyanmayan yüzey
const C_SANDIK   = '#6b5941';   // karşı ağırlık sandığı — _TINT.varsayilan2

const M_AHSAP = { metal: 0.12, rough: 0.82 };
const M_DEMIR = { metal: 0.55, rough: 0.44 };
const M_HALAT = { metal: 0.03, rough: 0.95 };
const M_TAS   = { metal: 0.06, rough: 0.90 };
const M_DERI  = { metal: 0.05, rough: 0.88 };

// ===========================================================================
// 1. TEMEL ÖLÇÜLER  (bkz. başlıktaki kaynak listesi)
// ===========================================================================
const H_MIL    = 8.60;    // mil (dönme ekseni) yerden yüksekliği
const L_UZUN   = 9.40;    // uzun kol — 8.60 + 9.40 = 18.00 m tam kalkık boy
const L_KISA   = 2.35;    // kısa kol — 9.40 / 4 (4:1 oranı)
const UC_Y0    = 1.34;    // kurulu pozda kol ucunun yüksekliği
const KAIDE_X  = 6.25;    // kızak yarı uzunluğu  → 12.50 m (Villard)
const KAIDE_Z  = 4.25;    // kızak yarı genişliği →  8.50 m (Villard)
const KAIDE_H  = 0.46;    // kızak kirişlerinin yüksekliği
const SEHPA_Z  = 1.90;    // iki sehpanın orta hattı (aralık 3.80 m)
const AYAK_X   = 3.55;    // sehpa ayaklarının kızaktaki basma noktası
const TEPE_X   = 0.55;    // ayakların mil hizasında birleştiği x
const OLUK_Y   = 0.58;    // oluk tabanının üst yüzeyi
const OLUK_Z   = 0.62;    // oluk iç yarı genişliği
const OLUK_ARKA = -9.60;  // oluğun arka ucu
const OLUK_ON  = 1.70;    // oluğun ön ucu
const TAS_R    = 0.30;    // mermi yarıçapı
const KESE_D   = 0.36;    // kesenin merkezinden alt ucuna
const TAS_Y    = OLUK_Y + KESE_D;   // kese oluğun tabanına oturuyor → 0.94
const L_SAPAN  = 2.35;    // sapan boyu (= kısa kol, bkz. başlık)
const R_ANKRAJ = L_UZUN + 0.06;     // sapanın kola bağlandığı yarıçap
const SANDIK_X = 0.85, SANDIK_Z = 0.85, SANDIK_H = 1.30;  // 1.70x1.70x1.30
const ASKI_H   = 0.45;    // kolun ucundan sandık miline kadar
const VINC_X = -3.30, VINC_Y = 2.30, VINC_R = 0.36;
// Kurulu pozdaki kiriş açısı: uzun kol ucu TAM UC_Y0 yüksekliğinde.
// Türetilmiş, elle yazılmadı — UC_Y0 değişirse kendi kendine düzeliyor.
const ALFA0 = Math.PI + Math.asin((H_MIL - UC_Y0) / L_UZUN);
// Sapanın kolla hizalandığı (merminin bırakıldığı) açı. 115°'de kol ucunun
// hız yönü yatayla ~25° yapıyor, sapanın eklediği açıyla mermi lob atıyor.
const ATIS_ACI = 115 * Math.PI / 180;
// Kesenin oluktan kalktığı açı: sapan tam dikey olduğu an.
const KALKIS_ACI = Math.PI + Math.asin((H_MIL - TAS_Y - L_SAPAN) / R_ANKRAJ);

// ===========================================================================
// 2. GEOMETRİ TEZGÂHI — üçgen yığını
// ===========================================================================
// ⚠️ Bütün gövde ELDE, indekssiz üçgen çorbası olarak kuruluyor. Üç gerekçe:
//   1. Kereste DÜZ YÜZLÜ okunmalı; her üçgen kendi yüz normalini taşıyınca
//      `computeVertexNormals` komşu yüzleri ortalayamıyor, kirişin sırtı
//      keskin kalıyor (yumuşatılsa sabun kalıbı olurdu).
//   2. Aynı renk grubundaki onlarca kereste TEK mesh'te birleşiyor:
//      `_applyTint` `getObjectByName` ile çalıştığı için her kirişi ayrı mesh
//      yapsaydık `_TINT.parts` altmış ad tutardı; ad paylaşmak da çözüm değil
//      (devir §5.2: aynı adlı meshlerden yalnız İLKİ renk alır).
//   3. `bevelSize` tuzağı (devir §5.2) hiç doğmuyor: pah kesitin İÇİNDE
//      yazılıyor, kontur dışarı itilmiyor.
function Yigin() { this.p = []; this.n = []; }
// İç referans NOKTASI ile: normal merkezden dışarı bakmıyorsa sarım çevriliyor.
// Dışbükey parçalarda bu, ters yüz ayıklamasına takılıp KAYBOLAN yüzeyi
// imkânsız kılıyor (tren süpürme sarımında iki tur bu hataya harcanmıştı).
Yigin.prototype.uc = function (a, b, c, ic) {
    let nx = (b[1] - a[1]) * (c[2] - a[2]) - (b[2] - a[2]) * (c[1] - a[1]);
    let ny = (b[2] - a[2]) * (c[0] - a[0]) - (b[0] - a[0]) * (c[2] - a[2]);
    let nz = (b[0] - a[0]) * (c[1] - a[1]) - (b[1] - a[1]) * (c[0] - a[0]);
    const l = Math.sqrt(nx * nx + ny * ny + nz * nz);
    if (!(l > 1e-12)) return;                       // yozlaşmış üçgen: atla
    nx /= l; ny /= l; nz /= l;
    let B = b, C = c;
    const mx = (a[0] + b[0] + c[0]) / 3 - ic[0];
    const my = (a[1] + b[1] + c[1]) / 3 - ic[1];
    const mz = (a[2] + b[2] + c[2]) / 3 - ic[2];
    if (nx * mx + ny * my + nz * mz < 0) { B = c; C = b; nx = -nx; ny = -ny; nz = -nz; }
    this.p.push(a[0], a[1], a[2], B[0], B[1], B[2], C[0], C[1], C[2]);
    this.n.push(nx, ny, nz, nx, ny, nz, nx, ny, nz);
};
// İç referans YÖNÜ ile (halka gibi içbükey parçalarda nokta işe yaramıyor).
Yigin.prototype.ucy = function (a, b, c, yon) {
    let nx = (b[1] - a[1]) * (c[2] - a[2]) - (b[2] - a[2]) * (c[1] - a[1]);
    let ny = (b[2] - a[2]) * (c[0] - a[0]) - (b[0] - a[0]) * (c[2] - a[2]);
    let nz = (b[0] - a[0]) * (c[1] - a[1]) - (b[1] - a[1]) * (c[0] - a[0]);
    const l = Math.sqrt(nx * nx + ny * ny + nz * nz);
    if (!(l > 1e-12)) return;
    nx /= l; ny /= l; nz /= l;
    let B = b, C = c;
    if (nx * yon[0] + ny * yon[1] + nz * yon[2] < 0) {
        B = c; C = b; nx = -nx; ny = -ny; nz = -nz;
    }
    this.p.push(a[0], a[1], a[2], B[0], B[1], B[2], C[0], C[1], C[2]);
    this.n.push(nx, ny, nz, nx, ny, nz, nx, ny, nz);
};
Yigin.prototype.dort = function (a, b, c, d, ic) { this.uc(a, b, c, ic); this.uc(a, c, d, ic); };
Yigin.prototype.dorty = function (a, b, c, d, y) { this.ucy(a, b, c, y); this.ucy(a, c, d, y); };
Yigin.prototype.geo = function () {
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.BufferAttribute(new Float32Array(this.p), 3));
    g.setAttribute('normal', new THREE.BufferAttribute(new Float32Array(this.n), 3));
    return g;
};

function birim(v) { const l = Math.hypot(v[0], v[1], v[2]) || 1; return [v[0] / l, v[1] / l, v[2] / l]; }
function capraz(a, b) {
    return [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
}
function ortas(a, b) { return [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2, (a[2] + b[2]) / 2]; }

// Sekizgen (pahlı) kereste kesiti. Yontma kereste arrisinden pahlıdır; 4 yüz
// yerine 8 yüz ışığı çok daha iyi okuyor ve maliyet kesit başına 16 üçgen.
function kesit8(w, h, pah) {
    const p = Math.min(pah, w * 0.55, h * 0.55);
    return [[w, h - p], [w - p, h], [-(w - p), h], [-w, h - p],
            [-w, -(h - p)], [-(w - p), -h], [w - p, -h], [w, -(h - p)]];
}

// KESİTTEN LOFT: yol boyunca istasyonlarda kesit hesaplanıp dikiliyor.
// yol = [[x,y,z], yariGenislik, yariYukseklik] üçlüleri.
function loft(Y, yol, pah) {
    const n = yol.length;
    const kesitler = [], eksenler = [];
    for (let k = 0; k < n; k++) {
        const a = yol[Math.max(0, k - 1)][0], b = yol[Math.min(n - 1, k + 1)][0];
        const T = birim([b[0] - a[0], b[1] - a[1], b[2] - a[2]]);
        const up = Math.abs(T[1]) > 0.985 ? [1, 0, 0] : [0, 1, 0];
        const S = birim(capraz(up, T));
        eksenler.push([S, capraz(T, S)]);
        kesitler.push(kesit8(yol[k][1], yol[k][2], pah));
    }
    const nok = function (k, q) {
        const c = yol[k][0], S = eksenler[k][0], U = eksenler[k][1];
        return [c[0] + S[0] * q[0] + U[0] * q[1],
                c[1] + S[1] * q[0] + U[1] * q[1],
                c[2] + S[2] * q[0] + U[2] * q[1]];
    };
    for (let k = 0; k < n - 1; k++) {
        const ic = ortas(yol[k][0], yol[k + 1][0]);
        for (let i = 0; i < 8; i++) {
            const j = (i + 1) % 8;
            Y.dort(nok(k, kesitler[k][i]), nok(k, kesitler[k][j]),
                   nok(k + 1, kesitler[k + 1][j]), nok(k + 1, kesitler[k + 1][i]), ic);
        }
    }
    const ic0 = ortas(yol[0][0], yol[n - 1][0]);
    for (let i = 1; i < 7; i++) {
        Y.uc(nok(0, kesitler[0][0]), nok(0, kesitler[0][i]), nok(0, kesitler[0][i + 1]), ic0);
        Y.uc(nok(n - 1, kesitler[n - 1][0]), nok(n - 1, kesitler[n - 1][i]),
             nok(n - 1, kesitler[n - 1][i + 1]), ic0);
    }
}

// Tek parça kereste: iki uç, iki kesit. (İnce uzun kirişi kutu yığınıyla
// kurmak devir §3'te reddedildi — kesit loftu okunuyor, kutu yığını değil.)
function kiris(Y, p0, p1, w0, h0, w1, h1, pah) {
    loft(Y, [[p0, w0, h0], [p1, w1 === undefined ? w0 : w1, h1 === undefined ? h0 : h1]],
         pah === undefined ? 0.05 : pah);
}
// Eksene hizalı kutu (tahta, levha, kama, kuşak).
function kutu(Y, cx, cy, cz, sx, sy, sz) {
    const a = sx / 2, b = sy / 2, c = sz / 2, ic = [cx, cy, cz];
    const v = [];
    for (let i = 0; i < 8; i++)
        v.push([cx + ((i & 1) ? a : -a), cy + ((i & 2) ? b : -b), cz + ((i & 4) ? c : -c)]);
    Y.dort(v[0], v[1], v[3], v[2], ic); Y.dort(v[4], v[5], v[7], v[6], ic);
    Y.dort(v[0], v[1], v[5], v[4], ic); Y.dort(v[2], v[3], v[7], v[6], ic);
    Y.dort(v[0], v[2], v[6], v[4], ic); Y.dort(v[1], v[3], v[7], v[5], ic);
}
// İki nokta arasında n köşeli silindir (mil, tambur, halat, kazık başı).
function silindir(Y, p0, p1, r0, r1, n, kapak) {
    const T = birim([p1[0] - p0[0], p1[1] - p0[1], p1[2] - p0[2]]);
    const up = Math.abs(T[1]) > 0.985 ? [1, 0, 0] : [0, 1, 0];
    const S = birim(capraz(up, T)), U = capraz(T, S);
    const ic = ortas(p0, p1);
    const nok = function (c, r, i) {
        const a = i * Math.PI * 2 / n, cs = Math.cos(a) * r, sn = Math.sin(a) * r;
        return [c[0] + S[0] * cs + U[0] * sn, c[1] + S[1] * cs + U[1] * sn,
                c[2] + S[2] * cs + U[2] * sn];
    };
    for (let i = 0; i < n; i++) {
        const j = (i + 1) % n;
        Y.dort(nok(p0, r0, i), nok(p0, r0, j), nok(p1, r1, j), nok(p1, r1, i), ic);
    }
    if (kapak !== false) for (let i = 1; i < n - 1; i++) {
        Y.uc(nok(p0, r0, 0), nok(p0, r0, i), nok(p0, r0, i + 1), ic);
        Y.uc(nok(p1, r1, 0), nok(p1, r1, i), nok(p1, r1, i + 1), ic);
    }
}
// Küre (mermi, safra taşı).
function kure(Y, c, r, nu, nv) {
    const nok = function (i, j) {
        const th = j * Math.PI / nv, ph = i * Math.PI * 2 / nu;
        return [c[0] + r * Math.sin(th) * Math.cos(ph), c[1] + r * Math.cos(th),
                c[2] + r * Math.sin(th) * Math.sin(ph)];
    };
    for (let j = 0; j < nv; j++) for (let i = 0; i < nu; i++) {
        const a = nok(i, j), b = nok(i + 1, j), d = nok(i + 1, j + 1), e = nok(i, j + 1);
        if (j === 0) Y.uc(a, d, e, c);
        else if (j === nv - 1) Y.uc(a, b, d, c);
        else Y.dort(a, b, d, e, c);
    }
}
// Y ekseni etrafında halka (kazık başlığı, tambur çemberi).
function halka(Y, cx, cy, cz, ric, rd, h, n) {
    for (let i = 0; i < n; i++) {
        const a0 = i * Math.PI * 2 / n, a1 = (i + 1) * Math.PI * 2 / n;
        const c0 = Math.cos(a0), s0 = Math.sin(a0), c1 = Math.cos(a1), s1 = Math.sin(a1);
        const y0 = cy - h / 2, y1 = cy + h / 2;
        const dis = [(c0 + c1) / 2, 0, (s0 + s1) / 2];
        Y.dorty([cx + rd * c0, y0, cz + rd * s0], [cx + rd * c1, y0, cz + rd * s1],
                [cx + rd * c1, y1, cz + rd * s1], [cx + rd * c0, y1, cz + rd * s0], dis);
        Y.dorty([cx + ric * c0, y0, cz + ric * s0], [cx + ric * c1, y0, cz + ric * s1],
                [cx + ric * c1, y1, cz + ric * s1], [cx + ric * c0, y1, cz + ric * s0],
                [-dis[0], 0, -dis[2]]);
        Y.dorty([cx + ric * c0, y1, cz + ric * s0], [cx + ric * c1, y1, cz + ric * s1],
                [cx + rd * c1, y1, cz + rd * s1], [cx + rd * c0, y1, cz + rd * s0], [0, 1, 0]);
        Y.dorty([cx + ric * c0, y0, cz + ric * s0], [cx + ric * c1, y0, cz + ric * s1],
                [cx + rd * c1, y0, cz + rd * s1], [cx + rd * c0, y0, cz + rd * s0], [0, -1, 0]);
    }
}
function bitir(Y, ad, renk, mat, ebeveyn) {
    const o = { name: ad };
    if (mat) { o.metal = mat.metal; o.rough = mat.rough; }
    const m = mesh(Y.geo(), renk, o);
    (ebeveyn || modelGroup).add(m);
    return m;
}

// ===========================================================================
// 3. KIZAK (sabit taban) — Villard'ın 12.50 x 8.50 m taban çerçevesi
// ===========================================================================
// İki dış boy kirişi, iki iç boy kirişi (sehpa ayakları bunlara basıyor),
// DÖRT enine kiriş. Kereste geçmeleri gerçekte yarım-boğaz; burada hacimler
// birbirinin içine giriyor — z-kavgası YOK, çünkü çakışan şey iki DOLU hacim,
// aynı düzlemde iki yüzey değil (devir §5.2).
//
// ⚠️ SADELEŞTİRME (2026-09-04, mancinik_zemin_secim.py ile ÖLÇÜLDÜ):
//   * Enine kiriş 6 -> 4: x = ±1.00 çifti çıkarıldı. O çift tam oluğun ve
//     milin altında kalıyor; ortadaki 7.10 m'lik açıklığı zaten oluk
//     dolduruyor. Bedeli tepe bakışında 128 px genişlikte 388, 56 px'te 98
//     piksel — yani ölçek düştükçe dört kiriş de altı kiriş de aynı ızgarayı
//     veriyor, altıncısı yalnız kalabalık ediyor.
//   * Dört köşe çaprazı ÇIKARILDI (231 px @128, 59 px @56, 18 px @28).
//     Kızağın dış hattını kıran tek şey onlardı; gitmesiyle taban temiz bir
//     12.50 x 8.50 çerçeve olarak okunuyor.
(function () {
    const Y = new Yigin(), p = 0.06, hy = KAIDE_H / 2;
    [-3.85, 3.85].forEach(function (z) {
        kiris(Y, [-KAIDE_X, hy, z], [KAIDE_X, hy, z], 0.25, hy, 0.25, hy, p);
    });
    [-SEHPA_Z, SEHPA_Z].forEach(function (z) {
        kiris(Y, [-KAIDE_X, hy, z], [KAIDE_X, hy, z], 0.23, hy, 0.23, hy, p);
    });
    [-5.60, -AYAK_X, AYAK_X, 5.60].forEach(function (x) {
        kiris(Y, [x, hy, -KAIDE_Z], [x, hy, KAIDE_Z], 0.21, hy - 0.01, 0.21, hy - 0.01, p);
    });
    bitir(Y, 'kaide', C_MESE, M_AHSAP);
}());

// Dört köşe kazığı: yere çakılan, demir başlıklı meşe kazıklar. Makine atarken
// kızak geri tepiyor (motor 'fire' penceresinin ilk %20'sinde gövdeyi -x'e
// itiyor, studio-3d.js `item.fireT` dalı); kazıklar onu tutuyor.
//
// ⚠️ SADELEŞTİRMEDE DÖRDÜ DE KALDI. Geri tepme okumasının taşıyıcısı bunlar:
// kazık yoksa sarsılan makine hiçbir şeye bağlı görünmez. Yalnız DEMİRİ
// ucuzladı: başlık halkası 10 -> 6 kenar (33 px @128 tepe, aynen okunuyor),
// yatay demir kayışlar ÇIKARILDI — ölçümde tepe bakışında 512 px'te bile
// 0 piksel, harita bakışında 72 px'ten aşağıda 0 piksel değiştiriyorlardı.
const KAZIK = [[-1, -1], [1, -1], [-1, 1], [1, 1]];
KAZIK.forEach(function (s, k) {
    const Y = new Yigin();
    const x = s[0] * (KAIDE_X - 0.55), z = s[1] * (KAIDE_Z - 0.42);
    kiris(Y, [x + s[0] * 0.30, 0.15, z + s[1] * 0.26], [x - s[0] * 0.10, 1.10, z - s[1] * 0.09],
          0.13, 0.13, 0.09, 0.09, 0.04);
    bitir(Y, 'kazik_' + (k + 1), C_MESE, M_AHSAP);
});
(function () {
    const Y = new Yigin();
    KAZIK.forEach(function (s) {
        const x = s[0] * (KAIDE_X - 0.55) - s[0] * 0.10, z = s[1] * (KAIDE_Z - 0.42) - s[1] * 0.09;
        halka(Y, x, 1.07, z, 0.085, 0.135, 0.11, 6);
    });
    bitir(Y, 'kaide_demir', C_DEMIR, M_DEMIR);
}());

// ===========================================================================
// 4. OLUK — sapanın ve merminin kızağı
// ===========================================================================
// Mermi kesede, oluğun üstünde duruyor; kol kalkarken sapan gerginleşiyor ve
// keseyi oluk boyunca sürüklüyor. Oluk kızağın 3.35 m ARKASINA taşıyor
// (gerçek makinelerde de taşar); oradaki iki traversle yere basıyor.
// Oluk tabanı AYRI mesh ve _TINT DIŞINDA: mermi burada sürtüyor, aşınmış
// tahta boyalı gövdeyle aynı tonda olmuyor. Kullanıcı gövdeyi boyadığında da
// bu şerit koyu kalıyor ve oluk okunmaya devam ediyor.
(function () {
    const Y = new Yigin();
    for (let x = OLUK_ARKA; x < OLUK_ON - 0.01; x += 0.42) {
        const u = Math.min(0.40, OLUK_ON - x);
        kutu(Y, x + u / 2, OLUK_Y - 0.06, 0, u, 0.12, OLUK_Z * 2);
    }
    bitir(Y, 'oluk_taban', C_TAHTA, M_AHSAP);
}());
(function () {
    const Y = new Yigin();
    [-1, 1].forEach(function (s) {
        kiris(Y, [OLUK_ARKA, OLUK_Y + 0.17, s * (OLUK_Z + 0.08)],
                 [OLUK_ON, OLUK_Y + 0.17, s * (OLUK_Z + 0.08)], 0.08, 0.17, 0.08, 0.17, 0.04);
        kiris(Y, [OLUK_ARKA, OLUK_Y - 0.18, s * (OLUK_Z - 0.06)],
                 [OLUK_ON, OLUK_Y - 0.18, s * (OLUK_Z - 0.06)], 0.09, 0.12, 0.09, 0.12, 0.04);
    });
    bitir(Y, 'oluk', C_MESE, M_AHSAP);
}());
[-7.30, -9.10].forEach(function (x, k) {
    const Y = new Yigin();
    kiris(Y, [x, KAIDE_H / 2, -1.40], [x, KAIDE_H / 2, 1.40],
          0.19, KAIDE_H / 2, 0.19, KAIDE_H / 2, 0.05);
    bitir(Y, 'oluk_kizak_' + (k + 1), C_MESE, M_AHSAP);
});
// Oluğun demir kelepçeleri. 14 -> 8 (adım 1.55 -> 2.90 m). Ölçüm: on dördü
// birden tepe bakışında 128 px'te yalnız 23, 56 px'te 8, 28 px'te 1 piksel
// değiştiriyordu; sekizi aynı "demirle kuşaklı oluk" okumasını veriyor.
(function () {
    const Y = new Yigin();
    for (let x = OLUK_ARKA + 0.7; x < OLUK_ON; x += 2.90)
        [-1, 1].forEach(function (s) {
            kutu(Y, x, OLUK_Y + 0.06, s * (OLUK_Z + 0.08), 0.10, 0.42, 0.20);
        });
    bitir(Y, 'oluk_demir', C_DEMIR, M_DEMIR);
}());

// ===========================================================================
// 5. SEHPALAR — iki A çerçevesi ve aralarındaki mil
// ===========================================================================
function sehpaKur(Y, z) {
    const p = 0.05;
    kiris(Y, [AYAK_X, KAIDE_H, z], [TEPE_X, H_MIL + 0.05, z], 0.23, 0.27, 0.19, 0.21, p);
    kiris(Y, [-AYAK_X, KAIDE_H, z], [-TEPE_X, H_MIL + 0.05, z], 0.23, 0.27, 0.19, 0.21, p);
    [[4.60, 2.150], [2.50, 2.990]].forEach(function (k) {
        kiris(Y, [-k[1], k[0], z], [k[1], k[0], z], 0.15, 0.17, 0.15, 0.17, 0.04);
    });
    [[2.150, 4.60, 1.05, 6.50], [-2.150, 4.60, -1.05, 6.50]].forEach(function (q) {
        kiris(Y, [q[0], q[1], z], [q[2], q[3], z], 0.11, 0.13, 0.11, 0.13, 0.035);
    });
    kiris(Y, [-1.05, H_MIL, z], [1.05, H_MIL, z], 0.25, 0.34, 0.25, 0.34, 0.05);
    [-1, 1].forEach(function (s) { kutu(Y, s * AYAK_X, KAIDE_H + 0.09, z, 0.86, 0.18, 0.62); });
}
(function () { const Y = new Yigin(); sehpaKur(Y, SEHPA_Z); bitir(Y, 'sehpa_1', C_MESE, M_AHSAP); }());
(function () { const Y = new Yigin(); sehpaKur(Y, -SEHPA_Z); bitir(Y, 'sehpa_2', C_MESE, M_AHSAP); }());

// İki sehpayı bağlayan enine takım.
// ⚠️ MİL ÇEVRESİ BOŞ KALMALI. Sandık milden en fazla 4.19 m uzağa savruluyor
// (2.35 kısa kol + 0.45 askı + 1.30 sandık, x'te 0.85 pay); kol ise 9.40 m
// yarıçapta 58°..230.6° arasını süpürüyor. Aşağıdaki bağların hepsi bu iki
// kümenin DIŞINDA: (0, 2.30) milden 6.30 m aşağıda ve kol 270° yönüne hiç
// dönmüyor; (±2.99, 2.50) bağları milden 6.79 m uzakta.
(function () {
    const Y = new Yigin();
    kiris(Y, [0, 2.30, -SEHPA_Z], [0, 2.30, SEHPA_Z], 0.16, 0.19, 0.16, 0.19, 0.04);
    [-2.990, 2.990].forEach(function (x) {
        kiris(Y, [x, 2.50, -SEHPA_Z], [x, 2.50, SEHPA_Z], 0.13, 0.15, 0.13, 0.15, 0.04);
    });
    [[-1, -1], [1, -1], [-1, 1], [1, 1]].forEach(function (s) {
        kiris(Y, [s[0] * 1.30, 5.60, s[1] * SEHPA_Z],
                 [s[0] * 2.60, KAIDE_H, s[1] * (KAIDE_Z - 0.30)], 0.13, 0.15, 0.13, 0.15, 0.04);
    });
    bitir(Y, 'sehpa_bag', C_MESE, M_AHSAP);
}());

// Boyuna (x-y düzleminde) çaprazlar. Sehpa yanlamasına `sehpa_bag` ile
// tutuluyor ama makine ATIŞ YÖNÜNDE (x) de yükleniyor: karşı ağırlık öne
// düşerken sehpayı öne deviriyor. Bu DÖRT çapraz o kuvveti kızağa aktarıyor.
// Hepsi z = ±SEHPA_Z düzleminde, yani kolun (|z| < 0.32) ve sandığın
// (|z| < 0.95) süpürme koridorlarının DIŞINDA.
//
// ⚠️ SADELEŞTİRME: 12 çubuktan 4'ü kaldı, ikisi ÖLÇÜMLE çıkarıldı.
//   * ÜST dörtlü (2.72 -> 1.55): tepe bakışında 512 px'te bile yalnız 18,
//     128 px'te 5, 72 px'ten aşağıda 0 piksel. A çerçevesinin ayağı onları
//     tamamen kapatıyordu — 112 üçgen hiçbir ölçekte hiçbir şey çizmiyordu.
//   * AYAK DİBİ TAKOZLARI (4): 105 px @128 ile okunuyorlardı ama tam
//     zeminde, kızağın üstünde duruyorlardı; kalabalığın büyük kısmı oydu.
//   * ALT dörtlü kaldı: 440 px @128, 81 px @56 — makinenin öne devrilmeye
//     karşı payandası bu, siluetin okunan parçası.
(function () {
    const Y = new Yigin();
    [-SEHPA_Z, SEHPA_Z].forEach(function (z) {
        [1, -1].forEach(function (s) {
            kiris(Y, [s * 5.95, KAIDE_H, z], [s * 3.00, 2.72, z], 0.12, 0.15, 0.12, 0.15, 0.035);
        });
    });
    bitir(Y, 'sehpa_capraz', C_MESE, M_AHSAP);
}());

// Ağaç çiviler (kavela). Gerçek bir mancınıkta her geçme kavela ile
// kilitleniyor.
//
// ⚠️ SADELEŞTİRME — kavela sayısı 56'dan 12'ye indi, gerekçe ÖLÇÜM:
//   * `kavela_kaide` (kızak güvertesindeki 24 kavela) TAMAMEN ÇIKARILDI.
//     672 üçgendi ve tepe bakışında 512 px genişlikte 100, 128 px'te 15,
//     40 px'te 4, 28 px'te 0 piksel değiştiriyordu. Modelin üçgen
//     bütçesinin %7.7'si, karenin binde biri kadar mürekkep.
//   * `kavela_sehpa` 32 -> 12: yalnız GÖĞE KARŞI okunan üç geçme kaldı
//     (kuşaklar 4.60 ve 6.50, mil hizası 8.58). Zemin hizasındaki
//     (±AYAK_X ve ±4.90, y≈0.6) kavelalar çıktı — kalabalığın olduğu yer
//     orasıydı ve 32'sinin tamamı 128 px'te toplam 35 piksel ediyordu.
(function () {
    const Y = new Yigin();
    [-SEHPA_Z, SEHPA_Z].forEach(function (z) {
        [[2.150, 4.60], [-2.150, 4.60],
         [1.05, 6.50], [-1.05, 6.50],
         [0.72, H_MIL - 0.02], [-0.72, H_MIL - 0.02]].forEach(function (q) {
            silindir(Y, [q[0], q[1], z + (z > 0 ? 0.22 : -0.22)],
                        [q[0], q[1], z + (z > 0 ? 0.34 : -0.34)], 0.055, 0.047, 8);
        });
    });
    bitir(Y, 'kavela_sehpa', C_MESE_K, M_AHSAP);
}());

// Sehpa geçmelerindeki demir bağ levhaları. 16 -> 8: kuşak geçmelerindeki
// sekiz orta levha (±2.05 @4.60 ve ±2.90 @2.50) çıktı; ayak dibindeki dört
// büyük levha (0.80 x 0.34, kirişin kızağa bastığı yer) ve mil altındaki
// dördü kaldı. Çıkanların ölçüsü: 89 px @128, 23 px @56, 7 px @28 — ayak
// dibindekiler kadar bile okunmuyorlardı ve A çerçevesinin gövdesine
// gömülüydüler.
(function () {
    const Y = new Yigin();
    [-SEHPA_Z, SEHPA_Z].forEach(function (z) {
        const zz = z + (z > 0 ? 0.29 : -0.29);
        [[AYAK_X - 0.10, KAIDE_H + 0.22, 0.80, 0.34], [-AYAK_X + 0.10, KAIDE_H + 0.22, 0.80, 0.34],
         [0.80, H_MIL - 0.30, 0.44, 0.40], [-0.80, H_MIL - 0.30, 0.44, 0.40]].forEach(function (q) {
            kutu(Y, q[0], q[1], zz, q[2], q[3], 0.05);
        });
    });
    bitir(Y, 'sehpa_demir', C_DEMIR, M_DEMIR);
}());

// Cephane: makinenin yanındaki hazır mermi yığını ve tahta kasası.
// Kızağın AYAK İZİNİN İÇİNDE duruyor, kutu ölçüsünü büyütmüyor.
// SADELEŞTİRME: 6 küre 10x6 -> 4 küre 8x5 (600 -> 256 üçgen). Yığın hâlâ
// üç taş + tepesinde bir taş; 128 px'te altı kürenin tamamı 110 piksel
// ediyordu, yani ayrı ayrı sayılabildikleri bir ölçek zaten yok.
const CEP_X = 5.10, CEP_Z = 3.10, CEP_R = 0.95;
(function () {
    const Y = new Yigin();
    [[0, 0, 0], [0.50, 0.12, 0], [-0.46, 0.28, 0], [0.24, -0.06, 0.48]].forEach(function (q) {
        kure(Y, [CEP_X + q[0], KAIDE_H + 0.28 + q[2], CEP_Z + q[1]], 0.28, 8, 5);
    });
    bitir(Y, 'cephane', C_TAS, M_TAS);
}());
(function () {
    const Y = new Yigin();
    [-1, 1].forEach(function (s) {
        kiris(Y, [CEP_X - CEP_R, KAIDE_H + 0.14, CEP_Z + s * CEP_R],
                 [CEP_X + CEP_R, KAIDE_H + 0.14, CEP_Z + s * CEP_R], 0.09, 0.14, 0.09, 0.14, 0.03);
        kiris(Y, [CEP_X + s * CEP_R, KAIDE_H + 0.14, CEP_Z - CEP_R],
                 [CEP_X + s * CEP_R, KAIDE_H + 0.14, CEP_Z + CEP_R], 0.09, 0.14, 0.09, 0.14, 0.03);
    });
    bitir(Y, 'cephane_kasa', C_MESE_K, M_AHSAP);
}());

// Merdiven — sandığı doldurmak için arka sehpaya dayalı.
(function () {
    const Y = new Yigin(), z = SEHPA_Z + 0.55;
    [-1, 1].forEach(function (s) {
        kiris(Y, [-3.20, 0.06, z + s * 0.24], [-1.15, 4.55, z + s * 0.24], 0.06, 0.09, 0.06, 0.09, 0.02);
    });
    for (let i = 1; i <= 7; i++) {
        const u = i / 8;
        kiris(Y, [-3.20 + 2.05 * u, 0.06 + 4.49 * u, z - 0.26],
                 [-3.20 + 2.05 * u, 0.06 + 4.49 * u, z + 0.26], 0.05, 0.045, 0.05, 0.045, 0.015);
    }
    bitir(Y, 'merdiven', C_MESE_K, M_AHSAP);
}());

// Mil: demir bilezikli meşe mil. Kol bunun üstünde dönüyor.
(function () {
    const Y = new Yigin();
    silindir(Y, [0, H_MIL, -2.40], [0, H_MIL, 2.40], 0.24, 0.24, 14);
    bitir(Y, 'mil', C_MESE_K, M_AHSAP);
}());
[-1, 1].forEach(function (s, k) {
    const Y = new Yigin();
    silindir(Y, [0, H_MIL, s * (SEHPA_Z - 0.30)], [0, H_MIL, s * (SEHPA_Z + 0.30)], 0.31, 0.31, 14);
    kutu(Y, 0, H_MIL - 0.36, s * SEHPA_Z, 0.62, 0.12, 0.66);
    kutu(Y, 0, H_MIL + 0.36, s * SEHPA_Z, 0.62, 0.12, 0.66);
    bitir(Y, 'mil_yatak_' + (k + 1), C_DEMIR_A, M_DEMIR);
});
(function () {
    const Y = new Yigin();
    [-1, 1].forEach(function (s) {
        silindir(Y, [0, H_MIL, s * 2.40], [0, H_MIL, s * 2.58], 0.30, 0.22, 12);
    });
    bitir(Y, 'mil_topuz', C_DEMIR, M_DEMIR);
}());

// ===========================================================================
// 6. GERME VİNCİ — kolu aşağı çeken bocurgat
// ===========================================================================
(function () {
    const Y = new Yigin();
    [-1, 1].forEach(function (s) {
        kiris(Y, [VINC_X, KAIDE_H, s * 1.62], [VINC_X, VINC_Y + 0.60, s * 1.62],
              0.19, 0.19, 0.15, 0.15, 0.04);
        kiris(Y, [VINC_X - 1.10, KAIDE_H, s * 1.62], [VINC_X, VINC_Y + 0.14, s * 1.62],
              0.11, 0.13, 0.11, 0.13, 0.03);
        kiris(Y, [VINC_X + 1.10, KAIDE_H, s * 1.62], [VINC_X, VINC_Y + 0.14, s * 1.62],
              0.11, 0.13, 0.11, 0.13, 0.03);
    });
    kiris(Y, [VINC_X, VINC_Y + 0.68, -1.62], [VINC_X, VINC_Y + 0.68, 1.62],
          0.14, 0.14, 0.14, 0.14, 0.035);
    bitir(Y, 'vinc_govde', C_MESE, M_AHSAP);
}());
const vincKok = new THREE.Group();
vincKok.name = 'vinc_kok';
vincKok.position.set(VINC_X, VINC_Y, 0);
modelGroup.add(vincKok);
(function () {
    const Y = new Yigin();
    silindir(Y, [0, 0, -1.48], [0, 0, 1.48], VINC_R, VINC_R, 14);
    [-1, 1].forEach(function (s) {
        silindir(Y, [0, 0, s * 1.48], [0, 0, s * 1.58], VINC_R + 0.07, VINC_R + 0.07, 14);
    });
    bitir(Y, 'vinc_tambur', C_MESE_K, M_AHSAP, vincKok);
}());
(function () {
    const Y = new Yigin();     // tambura sarılmış halat: yan yana ince halkalar
    for (let i = 0; i < 13; i++)
        silindir(Y, [0, 0, -0.72 + i * 0.118], [0, 0, -0.66 + i * 0.118],
                 VINC_R + 0.055, VINC_R + 0.055, 10, false);
    bitir(Y, 'vinc_sarim', C_HALAT, M_HALAT, vincKok);
}());
(function () {
    const Y = new Yigin(), n = 10;   // dişli çark (mandal buna takılıyor)
    for (let i = 0; i < n; i++) {
        const a = i * Math.PI * 2 / n;
        kutu(Y, Math.cos(a) * (VINC_R + 0.16), Math.sin(a) * (VINC_R + 0.16), 1.66, 0.11, 0.11, 0.09);
    }
    silindir(Y, [0, 0, 1.61], [0, 0, 1.70], VINC_R + 0.13, VINC_R + 0.13, 14);
    bitir(Y, 'vinc_disli', C_DEMIR, M_DEMIR, vincKok);
}());
// Manivelalar: her yanda ÜÇ yerine İKİ (karşılıklı). Ölçüm: altısının
// tamamı 128 px'te 12 piksel değiştiriyordu ve tepe/harita bakışlarında
// üçü hiçbir zaman 0 pikselin üstüne çıkmadı (karşı yandakinin arkasında).
for (let i = 0; i < 4; i++) {
    const Y = new Yigin(), a = (i % 2) * Math.PI + 0.35, z = i < 2 ? -1.66 : 1.78;
    kiris(Y, [Math.cos(a) * 0.20, Math.sin(a) * 0.20, z],
             [Math.cos(a) * 1.18, Math.sin(a) * 1.18, z], 0.060, 0.060, 0.048, 0.048, 0.02);
    bitir(Y, 'vinc_kol_' + (i + 1), C_MESE_K, M_AHSAP, vincKok);
}
(function () {
    const Y = new Yigin();     // mandal (pawl) — çarkın geri kaçmasını tutuyor
    kiris(Y, [VINC_X - 0.68, VINC_Y + 0.90, 1.66], [VINC_X + 0.05, VINC_Y + 0.48, 1.66],
          0.05, 0.07, 0.05, 0.07, 0.02);
    bitir(Y, 'vinc_mandal', C_DEMIR_A, M_DEMIR);
}());
// Germe halatı — davranış her karede tamburla kol ucu arasına oturtuyor.
// Birim uzunlukta (+x boyunca) kuruluyor, sonra konum/açı/ölçek yazılıyor.
(function () {
    const Y = new Yigin();
    silindir(Y, [0, 0, 0], [1, 0, 0], 0.05, 0.05, 8, false);
    bitir(Y, 'halat_vinc', C_HALAT, M_HALAT);
}());

// ===========================================================================
// 7. KİRİŞ (kol) — kısa ucunda karşı ağırlık, uzun ucunda sapan
// ===========================================================================
// Grup MİLDE duruyor ve `rotation.z = ALFA` ile dönüyor. Kurulumda ALFA0
// yazılıyor: modelin KURULU pozu geometriden değil AÇIDAN geliyor, davranış
// aynı değeri yazınca hiçbir şey değişmiyor (bekleme karesi bit bit aynı).
const kolKok = new THREE.Group();
kolKok.name = 'kol_kok';
kolKok.position.set(0, H_MIL, 0);
kolKok.rotation.z = ALFA0;
modelGroup.add(kolKok);
(function () {
    // Kiriş milde en derin, iki uca doğru inceliyor. Dokuz istasyon: düz bir
    // prizma dişbudak kirişi gibi okunmuyordu.
    const Y = new Yigin();
    loft(Y, [[[-L_KISA, 0, 0], 0.24, 0.27], [[-1.20, 0, 0], 0.27, 0.36],
             [[0, 0, 0], 0.30, 0.46], [[1.60, 0, 0], 0.28, 0.44],
             [[3.40, 0, 0], 0.26, 0.40], [[5.20, 0, 0], 0.23, 0.35],
             [[7.00, 0, 0], 0.20, 0.30], [[8.40, 0, 0], 0.17, 0.25],
             [[L_UZUN, 0, 0], 0.14, 0.19]], 0.055);
    bitir(Y, 'kol', C_DISBUDAK, M_AHSAP, kolKok);
}());
(function () {
    const Y = new Yigin();     // demir bilezikler + mil yanağı + uç başlığı
    [[-1.65, 0.30, 0.33], [-0.62, 0.30, 0.42], [1.20, 0.30, 0.47],
     [3.60, 0.28, 0.42], [6.00, 0.24, 0.35], [8.15, 0.20, 0.28]].forEach(function (b) {
        kiris(Y, [b[0] - 0.07, 0, 0], [b[0] + 0.07, 0, 0], b[1], b[2], b[1], b[2], 0.03);
    });
    [-1, 1].forEach(function (s) { kutu(Y, 0, 0, s * 0.36, 1.10, 0.86, 0.07); });
    kiris(Y, [L_UZUN - 0.10, 0, 0], [L_UZUN + 0.06, 0, 0], 0.17, 0.22, 0.15, 0.19, 0.03);
    bitir(Y, 'kol_demir', C_DEMIR, M_DEMIR, kolKok);
}());
(function () {
    const Y = new Yigin();     // halat sarımları (kirişin çatlamasını önler)
    [2.40, 4.70, 7.30].forEach(function (x) {
        const w = 0.26 - (x - 2.40) * 0.011, h = 0.41 - (x - 2.40) * 0.021;
        for (let i = 0; i < 5; i++)
            kiris(Y, [x + i * 0.075 - 0.15, 0, 0], [x + i * 0.075 - 0.115, 0, 0],
                  w + 0.035, h + 0.035, w + 0.035, h + 0.035, 0.03);
    });
    bitir(Y, 'kol_sarim', C_HALAT, M_HALAT, kolKok);
}());
(function () {
    const Y = new Yigin();     // SERBEST BIRAKMA KANCASI (parmak) + sapan pimi
    kiris(Y, [L_UZUN - 0.02, 0.14, 0], [L_UZUN + 0.34, 0.32, 0], 0.035, 0.045, 0.030, 0.038, 0.012);
    kiris(Y, [L_UZUN + 0.34, 0.32, 0], [L_UZUN + 0.40, 0.12, 0], 0.030, 0.038, 0.026, 0.032, 0.012);
    silindir(Y, [R_ANKRAJ, 0, -0.17], [R_ANKRAJ, 0, 0.17], 0.05, 0.05, 8);
    bitir(Y, 'kanca', C_DEMIR_A, M_DEMIR, kolKok);
}());

// ---- karşı ağırlık: MAFSALLI sandık --------------------------------------
// Sandık kolun kısa ucuna asılı; grup kolun dönüşünü GERİ ALARAK sandığı
// şakulde tutuyor (kurulumda rotation.z = -ALFA0). Davranış buna savrulma
// yalpası ekliyor.
const agirlikKok = new THREE.Group();
agirlikKok.name = 'agirlik_kok';
agirlikKok.position.set(-L_KISA, 0, 0);
agirlikKok.rotation.z = -ALFA0;
kolKok.add(agirlikKok);
(function () {
    const Y = new Yigin();     // askı: iki demir kayış + mil
    [-1, 1].forEach(function (s) {
        kutu(Y, 0, -ASKI_H / 2, s * (SANDIK_Z + 0.10), 0.20, ASKI_H + 0.22, 0.07);
    });
    silindir(Y, [0, 0, -(SANDIK_Z + 0.20)], [0, 0, SANDIK_Z + 0.20], 0.075, 0.075, 10);
    bitir(Y, 'agirlik_aski', C_DEMIR_A, M_DEMIR, agirlikKok);
}());
(function () {
    const Y = new Yigin();     // sandık: dikey tahtalardan, tabanı kalın
    const t = -ASKI_H, b = -ASKI_H - SANDIK_H, n = 7;
    for (let i = 0; i < n; i++) {
        const x = -SANDIK_X + (i + 0.5) * (SANDIK_X * 2 / n);
        const z = -SANDIK_Z + (i + 0.5) * (SANDIK_Z * 2 / n);
        [-1, 1].forEach(function (s) {
            kutu(Y, x, (t + b) / 2, s * SANDIK_Z, SANDIK_X * 2 / n - 0.02, SANDIK_H, 0.09);
            kutu(Y, s * SANDIK_X, (t + b) / 2, z, 0.09, SANDIK_H, SANDIK_Z * 2 / n - 0.02);
        });
    }
    kutu(Y, 0, b + 0.07, 0, SANDIK_X * 2 + 0.16, 0.14, SANDIK_Z * 2 + 0.16);
    [-1, 1].forEach(function (s) {
        kiris(Y, [-SANDIK_X - 0.05, t, s * (SANDIK_Z + 0.05)],
                 [SANDIK_X + 0.05, t, s * (SANDIK_Z + 0.05)], 0.09, 0.08, 0.09, 0.08, 0.025);
        kiris(Y, [s * (SANDIK_X + 0.05), t, -SANDIK_Z - 0.05],
                 [s * (SANDIK_X + 0.05), t, SANDIK_Z + 0.05], 0.09, 0.08, 0.09, 0.08, 0.025);
    });
    bitir(Y, 'sandik', C_SANDIK, M_AHSAP, agirlikKok);
}());
(function () {
    const Y = new Yigin();     // demir kuşaklar
    [-ASKI_H - 0.28, -ASKI_H - 1.02].forEach(function (y) {
        [-1, 1].forEach(function (s) {
            kutu(Y, 0, y, s * (SANDIK_Z + 0.06), SANDIK_X * 2 + 0.18, 0.11, 0.05);
            kutu(Y, s * (SANDIK_X + 0.06), y, 0, 0.05, 0.11, SANDIK_Z * 2 + 0.18);
        });
    });
    bitir(Y, 'sandik_kusak', C_DEMIR, M_DEMIR, agirlikKok);
}());
(function () {
    const Y = new Yigin();     // safra: sandığın ağzından görünen moloz taş
    [[-0.48, -0.30], [0.10, -0.52], [0.55, -0.12], [-0.12, 0.34],
     [0.40, 0.46], [-0.55, 0.42], [0.00, 0.02]].forEach(function (q, i) {
        kure(Y, [q[0], -ASKI_H - 0.14 - (i % 3) * 0.05, q[1]], 0.22 + (i % 3) * 0.03, 8, 5);
    });
    bitir(Y, 'sandik_yuk', C_TAS, M_TAS, agirlikKok);
}());

// ===========================================================================
// 8. SAPAN — iki halat, deri kese, mermi
// ===========================================================================
// Halatlar birim uzunlukta (+x) kurulup davranış tarafından iki nokta arasına
// oturtuluyor; kese ve taş yalnız konumlanıyor.
[1, 2].forEach(function (k) {
    const Y = new Yigin();
    silindir(Y, [0, 0, 0], [1, 0, 0], 0.028, 0.028, 6, false);
    bitir(Y, 'halat_sapan_' + k, C_HALAT, M_HALAT);
});
(function () {
    const Y = new Yigin();     // kese: taşı alttan saran deri beşik
    const w = 0.34, l = 0.42;
    const ust = [[-l, 0.02, 0], [-l * 0.55, 0.02, -w], [l * 0.55, 0.02, -w],
                 [l, 0.02, 0], [l * 0.55, 0.02, w], [-l * 0.55, 0.02, w]];
    const alt = [[-l * 0.90, -0.16, 0], [-l * 0.48, -KESE_D, -w * 0.80],
                 [l * 0.48, -KESE_D, -w * 0.80], [l * 0.90, -0.16, 0],
                 [l * 0.48, -KESE_D, w * 0.80], [-l * 0.48, -KESE_D, w * 0.80]];
    for (let i = 0; i < 6; i++) {
        const j = (i + 1) % 6;
        Y.dort(ust[i], ust[j], alt[j], alt[i], [0, -0.10, 0]);
    }
    for (let i = 1; i < 5; i++) Y.uc(alt[0], alt[i], alt[i + 1], [0, 0.30, 0]);
    bitir(Y, 'kese', C_DERI, M_DERI);
}());
(function () {
    const Y = new Yigin();
    kure(Y, [0, 0, 0], TAS_R, 12, 8);
    bitir(Y, 'tas', C_TAS, M_TAS);
}());

// ===========================================================================
// 9. SAPANIN KONUMU — TEK KAYNAK, hem kurulumda hem davranışta
// ===========================================================================
// ⚠️ builder.js / kutu_olc.js / kapak.py davranış ÇALIŞTIRMIYOR. Sapan halatı
// birim uzunlukta bırakılırsa kapakta bir çubuk gibi görünür ve KUTU ÖLÇÜSÜ
// yanlış çıkar. Bu yüzden kurulu pozun sapanı burada, davranışın kullandığı
// AYNI kuralla bir kez kuruluyor; kural ayrıca userData ile motora veriliyor.
//
// KURAL (yalnız ALFA'nın fonksiyonu — birikme YOK):
//   * SÜRÜKLEME: kese oluğun üstünde (y = TAS_Y) ve halat GERGİN, yani kese
//     ankraj noktasından tam L_SAPAN uzakta. Geri kök seçiliyor (kese kol
//     ucunun ARKASINDA) — gerçekte de mermi makinenin arkasında başlar ve
//     kol tepeden aşarken öne savrulur.
//   * SAVRULMA: kalkış anında sapan TAM DİKEY, bırakma açısında kolun
//     UZANTISINDA; arası düzgünleştirilmiş (smoothstep) tek bir açıyla
//     geçiliyor. İki uçta da süreklilik birebir.
function sapanNokta(alfa) {
    const ax = R_ANKRAJ * Math.cos(alfa), ay = H_MIL + R_ANKRAJ * Math.sin(alfa);
    const dy = ay - TAS_Y;
    let kx, ky;
    if (dy < L_SAPAN) {
        kx = ax - Math.sqrt(L_SAPAN * L_SAPAN - dy * dy);
        ky = TAS_Y;
    } else {
        let u = (alfa - ATIS_ACI) / (KALKIS_ACI - ATIS_ACI);
        u = u < 0 ? 0 : (u > 1 ? 1 : u);
        const d0 = Math.PI * 1.5 - KALKIS_ACI;      // kalkışta sapan tam dikey
        const g = alfa + d0 * (u * u * (3 - 2 * u));
        kx = ax + L_SAPAN * Math.cos(g);
        ky = ay + L_SAPAN * Math.sin(g);
    }
    return [ax, ay, kx, ky];
}
function sapanKur(alfa) {
    const q = sapanNokta(alfa);
    const uz = Math.hypot(q[2] - q[0], q[3] - q[1]);
    const ac = Math.atan2(q[3] - q[1], q[2] - q[0]);
    [-1, 1].forEach(function (s, k) {
        const o = modelGroup.getObjectByName('halat_sapan_' + (k + 1));
        o.position.set(q[0], q[1], s * 0.12);
        o.rotation.z = ac;
        o.scale.set(uz, 1, 1);
    });
    modelGroup.getObjectByName('kese').position.set(q[2], q[3], 0);
    modelGroup.getObjectByName('tas').position.set(q[2], q[3], 0);
    // germe halatı: tamburun üstünden kol ucundaki pime
    const hx = VINC_X, hy = VINC_Y + VINC_R;
    const hh = modelGroup.getObjectByName('halat_vinc');
    hh.position.set(hx, hy, 0);
    hh.rotation.z = Math.atan2(q[1] - hy, q[0] - hx);
    hh.scale.set(Math.hypot(q[0] - hx, q[1] - hy), 1, 1);
}
sapanKur(ALFA0);

// Motorun davranışı ölçüleri BURADAN okuyor — iki yerde iki sayı olmasın.
modelGroup.userData.mancinik = {
    H_MIL: H_MIL, L_UZUN: L_UZUN, L_KISA: L_KISA, ALFA0: ALFA0,
    ATIS_ACI: ATIS_ACI, KALKIS_ACI: KALKIS_ACI, R_ANKRAJ: R_ANKRAJ,
    L_SAPAN: L_SAPAN, TAS_Y: TAS_Y, TAS_R: TAS_R,
    VINC_X: VINC_X, VINC_Y: VINC_Y, VINC_R: VINC_R
};
