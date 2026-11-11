// Koçbaşı — çatılı, tekerlekli kuşatma koçu (testudo arietaria / "cat", "sow").
// Historical Warfare. 2026-09-04 SADELEŞTİRME turu.
//
// ⚠️ BU TURDA ÖLÇÜT DEĞİŞTİ: OKUNABİLİRLİK, KAYNAĞA SADAKATİN ÖNÜNE GEÇTİ.
// Önceki sürüm tarihsel olarak doğruydu (Vitruvius X.13 çatı eğimi 25.017°,
// X.15 kütük kesiti, 8 dikme, 9 çift mertek, 7 parçalı ön kemer, iki kat
// kuşak, çapraz payandalar, taşıma kolları, kavelalar, demir bağ levhaları)
// ama HARİTADA KOÇBAŞI OLARAK OKUNMUYORDU: küçük bir kulübe gibi görünüyordu.
// Ölçüm bunu sayıyla da gösteriyordu — tepeden doluluk 0.878 (kale 0.824,
// mancınık 0.519), yani siluet neredeyse dolu bir dikdörtgen.
//
// TEŞHİS (mesh başına üçgen dökümü, eski sürüm, 8964 üçgen):
//   kutuk_bilezik 1600 · tutamak 672 · kavela 672 · demir_bag 240 ·
//   cati_baglama 144        →  3328 üçgen (%37) küçük ölçekte HİÇ okunmayan
//                              hırdavata gidiyordu,
//   KÜTÜĞÜN KENDİSİ ise      →    88 üçgen (%1.0).
// Yani model, kendisini koçbaşı yapan organa bütçesinin yüzde birini,
// görünmeyen ayrıntıya otuz yedisini ayırmıştı.
//
// BU TURDA YAPILAN — üç şey büyüdü, gerisi çıktı:
//   1. KÜTÜK kalınlaştı ve uzadı: Ø 0.373 → 0.720 m (dip), Ø 0.264 → 0.600
//      (uç), boy 6.10 → 6.80 m. Uçtaki kalınlaşma daha büyük (2.27 kat):
//      dışarıda kalan parça kütüğün EN İNCE yeriydi.
//   2. DEMİR KOÇ BAŞI büyüdü ve KÜTLEŞTİ: boy 0.86 → 1.00 m, en kalın yeri
//      Ø 0.41 → 0.84 m, uç Ø 0.11 → 0.52 (sivri değil küt), boynuz sarmalı
//      R 0.30 → 0.62, boynuz açıklığı z'de 0.64 → 1.06 m. Baş artık kütüğün
//      ucundan 1.40 kat kalın ve yan siluette 1.38 x 1.01 m'lik AYRI BİR
//      KÜTLE.
//   3. KÜTÜK ÇATININ ÖNÜNDEN 3.00 m ÇIKIYOR (eskiden 1.21 m). Toplam
//      uzunluğun %34.5'i çatı dışında kalan kütük; eskiden %13.6 idi.
//      Dışarı taşan kütük siluetin imzası.
//   ÇIKANLAR: ön kemer çerçevesi (7 parça + 2 söve), taşıma kolları,
//      kavelalar, demir bağ levhaları, çatı bağlama halatları, saçak önlüğü,
//      arka post perdesi, aşıklar, çapraz payandalar, alt kuşak sırası.
//   AZALANLAR: dikme 8 → 4 · mertek 9 çift → 5 çift · çatı post şeridi
//      8 → 5 · tekerlek parmağı 8 → 6 · kütük bileziği 4 lofted halka
//      (1600 üçgen) → 3 kısa demir kovan + 4 asma halkası (324 üçgen).
//
// KORUNAN ÖLÇÜLER (kaynak hâlâ okunuyor, yalnız artık tek başına karar
// vermiyor):
//   * Vitruvius X.13 (Diades): saçak = güverte + (16/30) × genişlik.
//   * Vitruvius X.15 kütük kesiti: uç alanı dip alanının YARISI
//     (0.05465 / 0.10930) — modelde R_UC = R_DIP × √0.5 ile birebir.
//   * Vitruvius X.15: DÖRT asma halatı, iki ayrı boyunduruktan.
//   * Hegetor'un tekerlek oranları: Ø 0.81 m, kalınlık = 0.4444 × Ø.
//   * Smith, "Aries": kiriş çam/dişbudak, ucunda tunç/demir KOÇ BAŞI;
//     gelişmiş biçim (aries suspensus) enine kirişten halatla asılı.
//   * Ortaçağ "chat"/"truie": taze yüzülmüş, sulanmış post kaplama — çatıda.
//
// ⚠️ ÇATI EĞİMİ BİLEREK DEĞİŞTİRİLDİ: 25.017° (Diades'in 7/30 yükselişi)
// → 32.74°. Gerekçe ölçüm: mahya yükselişi / çatı yarı genişliği 0.4667 →
// 0.6429. 25°'lik çatı küçük ölçekte "kapaklı kutu", 33°'lik çatı üçgen
// okunuyor; koçbaşını koçbaşı yapan üç işaretten biri koruma çatısı ve
// onun ÜÇGEN olması gerekiyor. Saçak yüksekliği Diades'in 16/30'unda kaldı.
//
// ⚠️ YANLAR AÇIK, ÜSTELİK DAHA AÇIK. Önceki turda alınan karar (kapalı
// kutuda kütük görünmüyor) doğruydu; bu turda daha da açıldı: ön kemer
// çerçevesi, çapraz payandalar, alt kuşak sırası ve arka perde kalktı.
// Güverte üstü (1.14 m) ile tek kuşak (2.80 m) arasında 1.66 m'lik kesintisiz
// açıklık kaldı; kütük (ekseni 1.95, Ø 0.60) tam ortasında ve önünde HİÇBİR
// kereste yok.
//
// ⚠️ DİNLENME POZU = KÜTÜK ŞAKULDE (theta = 0). Üç gerekçe eski turdan aynen
// geçerli: (1) dışarı taşan kütük modelin tek ayırt edici işareti, geri
// çekilmiş pozda kısalırdı; (2) çevrim dinlenmeden dinlenmeye kapanıyor,
// t=0 ile t=1 birebir aynı poz; (3) halatların paralel/gergin olduğu poz
// budur.
//
// ÖLÇÜLEN DEĞERLER — hepsi araçla, göz kararı yok. Parantez içindekiler
// SADELEŞTİRME ÖNCESİ değerler (models/kocbasi.js.SADE-ONCE).
//   KUTU (ucgen_say.js)     8.685 x 4.940 x 4.719 m   (8.965 x 4.792 x 5.165)
//        maxHoriz 8.685 (8.965) — model haritada %3.2 BÜYÜK çiziliyor.
//   AĞIRLIK (ucgen_say.js)  20 mesh / 3200 üçgen   (28 mesh / 8964 üçgen)
//        yani üçgen -%64.3, mesh -%28.6. Mesh başına döküm:
//        cati_kiris 476 · dikme 336 · kutuk_bilezik 324 · bas 316 ·
//        teker_N_govde 4x196 · kizak 168 · cati_deri 156 · aks 104 ·
//        teker_N_cember 4x96 · kutuk 88 · halat_N 4x16.
//        Kıyas: mancınık 49/8700 · kale 42/13198 · otomobil 84/12968.
//   ZEMİN (kocbasi_zemin_tara.js, 501 faz x 24 azimut): bütün parçalar
//        y >= 0; en alçak nokta y = 0.000000 ("teker_1_cember", sabit).
//        HAREKET EDEN parçaların en alçağı 1.509748 m ("bas" — boynuzun
//        alt kıvrımı). 24 azimutta en alçak y sapması 0.000000000 m.
//   EN YÜKSEK NOKTA: dinlenmede 4.940000 m ("cati_deri"), çevrimin
//        tamamında en çok 4.940000 m → fark 0.000000 m. Gölge erişimi
//        telafisi GEREKMİYOR.
//   UÇ SÜREKLİLİK: psi=0 ile psi=1 arasında en büyük tepe farkı
//        0.0000000000 m (açı farkı 0.0000000000 rad); gerçek motorda
//        fireT yok / 0 / 1 üçlüsünde 0.000000 m ve 0.000000 derece.
//   MUTLAK DURUM: aynı 42 fazlık liste iki farklı saatte ölçüldü, en büyük
//        fark 0.0000000000 (kocbasi_probu.py olc).
//   STROK: kütük -0.3933 .. +0.3554 m öteleniyor (toplam 0.7487 m); demir
//        başın ucu 5.407 .. 6.155 m arasında geziyor. Yükselme en fazla
//        0.0681 m — modelin EN YÜKSEK noktası hiç değişmiyor.
//   GERİ TEPME (motorun): en büyük -0.4342 model metre ve TAM psi = 0.100'de,
//        yani çarpma anında (maxHoriz x 0.05 = 0.4343).
//        ⚠️ kocbasi_probu.py'deki MAXH sabiti de 8.965 -> 8.685 güncellendi;
//        güncellenmeseydi hem bu sayı hem yuvarlanma oranı 1.0322 kat
//        yanlış çıkardı.
//   ATEŞ EFEKTİ: alev + mermi + patlama = 5 mesh; 41 fazın hepsinde GÖRÜNÜR
//        olan 0.
//   TEKERLEK: yuvarlanma/yol oranı 21 ayrı glide.t'de 1.000000; dört tekerin
//        açı farkı 0.0000000000 rad. (_WHEELS.radius = R_TEKER = 0.405 birebir.)
//   HALAT: dört halatın açı farkı 41 fazda en çok 0.0000000000 derece.
//   TINT (ikincil_probu.py, ÜÇ örnek aynı sahnede): 1. örnek 'dikme'
//        #7d5f3e / 'cati_deri' #8b7a5c · 2. örnekte gövde rengi verilince
//        'dikme' #2e86de, 'cati_deri' DEĞİŞMİYOR · 3. örnekte ikincil renk
//        verilince 'cati_deri' #e8a33d, 'dikme' DEĞİŞMİYOR. Çapraz bulaşma
//        yok, tint ikinci ve üçüncü örnekte de çalışıyor.
//   PARLAKLIK (kocbasi_palet_tara.py, tepe bakışı, tam beyaz piksel oranı):
//        varsayılan %0.4 · birincil kum #c2b280 %0.4 · birincil #dcd3c0 %8.3 ·
//        birincil #ffffff %14.2 · İKİNCİL (çatı) #c2b280 %0.4 ·
//        İKİNCİL #dcd3c0 %44.3  (ESKİ MODELDE %77.8) · İKİNCİL #ffffff %80.7 ·
//        ikisi de #dcd3c0 %52.2 · ikisi de #ffffff %94.5.
//        Çatının payı küçüldüğü için en riskli palette patlama YARIYA indi.
//        M_POST.metal 0.06 -> 0.30 takası yine ölçüldü: ikincil #dcd3c0
//        patlaması %44.3'te KALIYOR ama varsayılanın ortalama parlaklığı
//        169.2 -> 145.2'ye (%14 koyu) düşüyor. Varsayılan yine korundu.
//   TEPEDEN AYRIM (kocbasi_tepe_kiyas.py): siluet 29.12 m² (40.64),
//        DOLULUK 0.711 (0.878). Kıyas aynı koşuda: mancınık 0.471
//        (63.52 m²) · kuşatma topu 0.448 (5.41 m²) · kale 0.824 · ev 0.252.
//        ⚠️ mancınık ve kuşatma topu bu ölçüm sırasında kardeş ajanlar
//        tarafından değiştiriliyordu; sayıları o günkü hâlleri.
//   OKUNABİLİRLİK (kocbasi_okunabilirlik.py, iki model AYNI kadrajda):
//        bakış        doluluk        burun boyu      burun kalınlığı
//                     eski -> yeni   eski -> yeni    (gövde yüksekliğinin %'si)
//        harita 3/4   0.636 -> 0.579  %12.2 -> %16.7   %25.5 -> %24.7
//        yan          0.645 -> 0.568  %14.4 -> %33.6   %16.9 -> %22.4
//        tepe         0.878 -> 0.707  %12.7 -> %33.6    %7.9 -> %15.9
//        "Burun" = siluetin ucundaki, gövde tepesinin %45'inin altında kalan
//        kesintisiz sütun dizisi — yani çatının önünden çıkan kütük.
//
// PARÇALAR (Studio3D bu adları arar, DEĞİŞTİRME):
//   kizak · aks · dikme · cati_kiris · kutuk        → BİRİNCİL (_TINT.parts)
//   cati_deri                                       → İKİNCİL (_TINT.parts2)
//   teker_1..4      → _WHEELS.parts (grup; motor rotation.y yazıyor, R=0.405)
//   kutuk_kok       → kütüğün ÖTELEME grubu (davranış position yazar)
//   halat_kok_1..4  → dört asma halatının dönme grubu (davranış rotation.z)
//   kutuk_bilezik · bas · halat_1..4 · teker_*_govde/_cember → boyanmaz
// ⚠️ ESKİ TURDAN KALKAN AD'LAR: kusak, payanda, on_cerceve, kiris_asma,
//   tutamak (parçalar dikme/cati_kiris içinde birleşti ya da tamamen çıktı),
//   demir_bag, kavela, cati_baglama (çıktı). _TINT listesi buna göre
//   güncellendi (kocbasi_tablolar.py).
//
// YÖN: vuruş yönü +x, üst +y, taban y=0. Ölçüler gerçek metre.

// ===========================================================================
// 0. RENKLER VE MALZEME
// ===========================================================================
// ⚠️ metalness 0.85+ neredeyse SİYAH (sahnede environment map yok). Ahşapta
// mat isteniyor; ama metalness SIFIRA da indirilmiyor — kullanıcı gövdeyi
// açık bir renge boyayabiliyor ve az miktarda metalness açık renkte
// patlamayı TERBİYE ediyor.
const C_MESE     = '#7d5f3e';   // _TINT varsayılanı — yağlanmış meşe iskelet
const C_MESE_K   = '#5d472e';   // gölgeli aralık: akslar
const C_DISBUDAK = '#a8834f';   // kütük: Smith "of a fir or an ash"
const C_POST     = '#8b7a5c';   // _TINT.varsayilan2 — taze yüzülmüş post
const C_DEMIR    = '#3d4247';   // dövme demir: kovan, çember
const C_DEMIR_A  = '#767f88';   // parlak demir: KOÇ BAŞI
// ⚠️ Koç başı C_DEMIR (#3d4247, metal 0.55) iken önden bakışta SİYAH bir
// yumruya düşüyordu (difüz = albedo x (1-metal), environment map yok). Baş
// kendi malzemesine alındı: daha açık taban + DÜŞÜK metalness. Baş bu turda
// büyüdüğü için bu ayrım daha da önemli: siluetteki ikinci kütle o.
const C_HALAT    = '#b0a077';   // kenevir halat
const C_TEKER    = '#7c6444';   // tekerlek keresteesi — çamurlanan, boyanmaz

const M_AHSAP = { metal: 0.12, rough: 0.82 };
const M_DEMIR = { metal: 0.55, rough: 0.44 };
const M_HALAT = { metal: 0.03, rough: 0.95 };
const M_POST  = { metal: 0.06, rough: 0.62 };   // ıslak post hafif parlak
const M_BAS   = { metal: 0.34, rough: 0.38 };   // dövme demir koç başı

// ===========================================================================
// 1. TEMEL ÖLÇÜLER
// ===========================================================================
const W_KUL    = 4.20;          // kulübe genişliği
const KIZ_Z    = W_KUL / 2;     // 2.10
const KIZ_X    = 2.60;          // şase yarı uzunluğu → 5.20 m
const R_TEKER  = 0.405;         // Ø 0.81  (⚠️ _WHEELS.radius ile BİREBİR)
const TEKER_K  = 0.36;          // kalınlık = 0.4444 x Ø  (Hegetor)
const SILL_ALT = 0.82, SILL_UST = 1.14;         // şase kirişi alt/üst yüzü
const SACAK_Y  = SILL_UST + (16 / 30) * W_KUL;  // 3.38  (Diades 16/30)
const CATI_YUK = 1.35;                          // mahya yükselişi (bkz. eğim notu)
const EGIM     = CATI_YUK / KIZ_Z;              // 0.642857 → 32.74 derece
const TEPE_Y   = SACAK_Y + CATI_YUK;            // 4.73
const CIKMA    = 0.20;                          // çatı saçak çıkması
const SAC_Z    = KIZ_Z + CIKMA;                 // 2.30
const SAC_X    = KIZ_X + CIKMA;                 // 2.80
const DIK_Z    = KIZ_Z - 0.17;                  // 1.93 — dikme ekseni
const DIK_X    = [-2.35, 2.35];                 // her yanda İKİ dikme (eskiden dört)

// --- kütük ve baş: modelin okunan üç organından ikisi ---
const D_KUTUK  = 6.80;                  // 22.3 ayak (ortaçağ aralığı 20-120)
const R_DIP    = 0.36;                  // Ø 0.72 — eski Ø 0.373'ün 1.93 katı
// ⚠️ DARALMA BİLEREK YUMUŞATILDI. Vitruvius X.15'te uç kesitinin ALANI dibin
// YARISI (0.05465 / 0.10930), yani R_UC = R_DIP x √0.5 = 0.255. İlk sade
// sürüm bunu birebir uyguladı ve ÖLÇÜLDÜ: çatının önünde kalan 3.00 m'lik
// parça kütüğün EN İNCE yeri oluyordu — siluetin imzası olması gereken şey
// bir sopaya düşüyordu. Daralma alan oranı 0.50 → 0.69'a getirildi
// (Ø 0.72 → 0.60); kütük hâlâ uca doğru inceliyor ama dışarıdaki parça
// artık kalın.
const R_UC     = 0.30;                  // Ø 0.60
const BAS_L    = 1.00;                  // demir koç başı boyu
const UC_X     = 5.80;                  // dinlenmede başın ucu
const KUTUK_ON = UC_X - BAS_L;          // 4.80
const KUTUK_AR = KUTUK_ON - D_KUTUK;    // -2.00
const KUTUK_Y  = 2.05;                  // kütük ekseni
const KIRIS_Y  = 3.20;                  // askı boyunduruğunun ekseni
const L_HALAT  = KIRIS_Y - KUTUK_Y;     // 1.15 — asma halatı boyu
const R_HALAT  = 0.055;                 // Ø 0.110 (eski 0.090; kalın kütüğe oranlı)
const KUT_ORT  = (KUTUK_ON + KUTUK_AR) / 2;     // 1.40
const ANK_X1   = KUT_ORT - 1.15;                // 0.25
const ANK_X2   = KUT_ORT + 1.15;                // 2.55
const ANK_Z    = 0.55;                          // halat çifti aralığı

// ===========================================================================
// 2. GEOMETRİ TEZGÂHI — üçgen yığını
// ===========================================================================
// ⚠️ Gövde ELDE, indekssiz üçgen çorbası: (1) kereste DÜZ YÜZLÜ okunmalı,
// her üçgen kendi yüz normalini taşıyor; (2) aynı renk grubundaki onlarca
// kereste TEK mesh'te birleşiyor — `_applyTint` `getObjectByName` ile
// çalıştığı için her kirişi ayrı mesh yapmak _TINT'i onlarca adla şişirirdi
// (aynı adlı meshlerden yalnız İLKİ renk alır).
function Yigin() { this.p = []; this.n = []; }
// İç referans NOKTASI ile: normal merkezden dışarı bakmıyorsa sarım çevrilir.
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

// Sekizgen (pahlı) kereste kesiti — yontma kereste arrisinden pahlıdır.
function kesit8(w, h, pah) {
    const p = Math.min(pah, w * 0.55, h * 0.55);
    return [[w, h - p], [w - p, h], [-(w - p), h], [-w, h - p],
            [-w, -(h - p)], [-(w - p), -h], [w - p, -h], [w, -(h - p)]];
}
// KESİTTEN LOFT: yol boyunca istasyonlarda kesit hesaplanıp dikiliyor.
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
// Tek parça kereste: iki uç, iki kesit.
function kiris(Y, p0, p1, w0, h0, w1, h1, pah) {
    loft(Y, [[p0, w0, h0], [p1, w1 === undefined ? w0 : w1, h1 === undefined ? h0 : h1]],
         pah === undefined ? 0.05 : pah);
}
// Eksene hizalı kutu (levha, mahya postu, saçak alınlığı).
function kutu(Y, cx, cy, cz, sx, sy, sz) {
    const a = sx / 2, b = sy / 2, c = sz / 2, ic = [cx, cy, cz];
    const v = [];
    for (let i = 0; i < 8; i++)
        v.push([cx + ((i & 1) ? a : -a), cy + ((i & 2) ? b : -b), cz + ((i & 4) ? c : -c)]);
    Y.dort(v[0], v[1], v[3], v[2], ic); Y.dort(v[4], v[5], v[7], v[6], ic);
    Y.dort(v[0], v[1], v[5], v[4], ic); Y.dort(v[2], v[3], v[7], v[6], ic);
    Y.dort(v[0], v[2], v[6], v[4], ic); Y.dort(v[1], v[3], v[7], v[5], ic);
}
// İki nokta arasında n köşeli silindir/koni (kütük, aks, halat, kovan, boynuz).
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
// Y ekseni etrafında halka (tekerlek demir çemberi).
// ⚠️ DIŞ YARIÇAP TAM `rd` — köşeler tam o yarıçapta. Tekerleği kiriş
// yığınıyla kurmak DENENDİ ve ÖLÇÜLDÜ: kirişin yarı genişliği yarıçapa dik
// eklendiği için gerçek dış yarıçap 0.4303 çıktı, yani `_WHEELS.radius`tan
// %6.2 büyük ve kutu tabanı -0.0253 m oldu. Halka ile ikisi de tam.
function halkaY(Y, cx, cy, cz, ric, rd, h, n) {
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
// Z ekseni etrafında halka (kütüğün asma halkaları).
function halkaZ(Y, cx, cy, cz, ric, rd, kal, n) {
    for (let i = 0; i < n; i++) {
        const a0 = i * Math.PI * 2 / n, a1 = (i + 1) * Math.PI * 2 / n;
        const c0 = Math.cos(a0), s0 = Math.sin(a0), c1 = Math.cos(a1), s1 = Math.sin(a1);
        const z0 = cz - kal / 2, z1 = cz + kal / 2;
        const dis = [(c0 + c1) / 2, (s0 + s1) / 2, 0];
        Y.dorty([cx + rd * c0, cy + rd * s0, z0], [cx + rd * c1, cy + rd * s1, z0],
                [cx + rd * c1, cy + rd * s1, z1], [cx + rd * c0, cy + rd * s0, z1], dis);
        Y.dorty([cx + ric * c0, cy + ric * s0, z0], [cx + ric * c1, cy + ric * s1, z0],
                [cx + ric * c1, cy + ric * s1, z1], [cx + ric * c0, cy + ric * s0, z1],
                [-dis[0], -dis[1], 0]);
        Y.dorty([cx + ric * c0, cy + ric * s0, z1], [cx + ric * c1, cy + ric * s1, z1],
                [cx + rd * c1, cy + rd * s1, z1], [cx + rd * c0, cy + rd * s0, z1], [0, 0, 1]);
        Y.dorty([cx + ric * c0, cy + ric * s0, z0], [cx + ric * c1, cy + ric * s1, z0],
                [cx + rd * c1, cy + rd * s1, z0], [cx + rd * c0, cy + rd * s0, z0], [0, 0, -1]);
    }
}
function bitir(Y, ad, renk, mat, ebeveyn) {
    const o = { name: ad };
    if (mat) { o.metal = mat.metal; o.rough = mat.rough; }
    const m = mesh(Y.geo(), renk, o);
    (ebeveyn || modelGroup).add(m);
    return m;
}
// Çatı düzlemi: y = TEPE_Y - EGIM * |z|.
function catiY(z) { return TEPE_Y - EGIM * Math.abs(z); }
// Çatı düzlemine OTURAN kalın levha (post şeridi). Kalınlık düzlemin
// normali boyunca dışarı veriliyor.
function catiPlaka(Y, x0, x1, z0, z1, kal) {
    const s = (z0 + z1) >= 0 ? 1 : -1;
    const nl = Math.hypot(1, EGIM);
    const nx = 0, ny = 1 / nl, nz = s * EGIM / nl;   // düzlemin dış normali
    const t = [[x0, z0], [x1, z0], [x1, z1], [x0, z1]];
    const alt = t.map(q => [q[0], catiY(q[1]), q[1]]);
    const ust = alt.map(q => [q[0] + nx * kal, q[1] + ny * kal, q[2] + nz * kal]);
    const ic = [(x0 + x1) / 2, (catiY(z0) + catiY(z1)) / 2 + kal / 2, (z0 + z1) / 2];
    Y.dort(alt[0], alt[1], alt[2], alt[3], ic);
    Y.dort(ust[0], ust[1], ust[2], ust[3], ic);
    for (let i = 0; i < 4; i++) {
        const j = (i + 1) % 4;
        Y.dort(alt[i], alt[j], ust[j], ust[i], ic);
    }
}

// ===========================================================================
// 3. ŞASE — 5.20 x 4.20 m kızak çerçevesi (eskiden 7.20 x 4.60, 12 kereste)
// ===========================================================================
// İki boy kirişi + dört enine kiriş. İç boy kirişleri, köşe pahları ve
// güverte kaplaması ÇIKTI: hiçbiri tepeden ya da yandan küçük ölçekte
// okunmuyor, tekerlek hattının üstünde kalan tek şey silüette bir çizgi.
const SILL_Y = (SILL_ALT + SILL_UST) / 2, SILL_H = (SILL_UST - SILL_ALT) / 2;
const AKS_X = [-1.70, 1.70];
(function () {
    const Y = new Yigin(), p = 0.05;
    [-KIZ_Z + 0.15, KIZ_Z - 0.15].forEach(function (z) {
        kiris(Y, [-KIZ_X, SILL_Y, z], [KIZ_X, SILL_Y, z], 0.16, SILL_H, 0.16, SILL_H, p);
    });
    [-2.45, AKS_X[0], AKS_X[1], 2.45].forEach(function (x) {
        kiris(Y, [x, SILL_Y, -KIZ_Z], [x, SILL_Y, KIZ_Z], 0.14, SILL_H - 0.02, 0.14, SILL_H - 0.02, p);
    });
    bitir(Y, 'kizak', C_MESE, M_AHSAP);
}());

// Akslar: iki meşe aks + dört yatak takozu.
// ⚠️ AKS ŞASEDEN DIŞARI TAŞIYOR (±2.15; kızak kirişi ±1.95). Tekerlekler
// kirişin DIŞINA alındı — ilk sade sürümde içerideydi ve yan ortografik
// bakışta kızak kirişi tekerleği TAMAMEN kapatıyordu; "tekerlekli kuşatma
// arabası" okumasının yarısı kayboluyordu. Dış kenar 2.243 m, çatı saçağı
// 2.30 m: tekerlek kutuyu BÜYÜTMÜYOR.
(function () {
    const Y = new Yigin();
    AKS_X.forEach(function (x) {
        silindir(Y, [x, R_TEKER, -(KIZ_Z + 0.05)], [x, R_TEKER, KIZ_Z + 0.05], 0.11, 0.11, 8);
        [-1, 1].forEach(function (s) {
            kutu(Y, x, (R_TEKER + SILL_ALT) / 2, s * (KIZ_Z - 0.15),
                 0.32, SILL_ALT - R_TEKER + 0.14, 0.28);
        });
    });
    bitir(Y, 'aks', C_MESE_K, M_AHSAP);
}());

// ===========================================================================
// 4. TEKERLEKLER — dört ağır kuşatma tekerleği (parmak 8 → 6, ay dilimi ÇIKTI)
// ===========================================================================
// ⚠️ GRUP DESENİ: grup `rotation.x = π/2` ile yatırılıyor, `rotation.y`
// MOTORA bırakılıyor (studio-3d.js: `w.rotation.y = -yol / wheelR`).
// ⚠️ `_WHEELS.radius` = R_TEKER (0.405) BİREBİR; uyuşmazsa teker yolla
// orantısız döner.
// Ay dilimi (felloe) kuşağı çıkarıldı: demir çemberin hemen altındaki ikinci
// halka küçük ölçekte demir çemberden ayırt edilmiyordu, tekerlek başına
// 96 üçgen tutuyordu. Yerine ÇEMBER KALINLAŞTIRILDI (0.055 → 0.115 m
// radyal): felloe + şina tek halkada. Ölçüldü — ince çemberli sürümde
// tekerlek yandan altı köşeli bir YILDIZ gibi okunuyordu, kalın çemberle
// dolu bir disk okunuyor; maliyet aynı (halka başına 96 üçgen).
function tekerlek(ad, x, z) {
    const g = new THREE.Group();
    g.name = ad;
    g.position.set(x, R_TEKER, z);
    g.rotation.x = Math.PI / 2;
    const yk = TEKER_K / 2;
    // ⚠️ Grup içinde AKS EKSENİ y; disk x-z düzleminde.
    const Y = new Yigin();
    silindir(Y, [0, -yk - 0.05, 0], [0, yk + 0.05, 0], 0.155, 0.155, 8);
    const N = 6;
    for (let i = 0; i < N; i++) {
        const a = i * Math.PI * 2 / N;
        const c = Math.cos(a), s = Math.sin(a);
        kiris(Y, [c * 0.13, 0, s * 0.13], [c * (R_TEKER - 0.095), 0, s * (R_TEKER - 0.095)],
              0.075, yk * 0.80, 0.068, yk * 0.80, 0.02);
    }
    g.add(mesh(Y.geo(), C_TEKER, { name: ad + '_govde', metal: 0.10, rough: 0.86 }));
    // demir çember (şina) — DIŞ YARIÇAP TAM R_TEKER
    const Z = new Yigin();
    halkaY(Z, 0, 0, 0, R_TEKER - 0.115, R_TEKER, TEKER_K + 0.026, 12);
    g.add(mesh(Z.geo(), C_DEMIR, { name: ad + '_cember', metal: 0.55, rough: 0.44 }));
    modelGroup.add(g);
}
const TEKER_Z = KIZ_Z - 0.05;           // 2.05 — kızak kirişinin DIŞINDA
tekerlek('teker_1', AKS_X[0], TEKER_Z);
tekerlek('teker_2', AKS_X[0], -TEKER_Z);
tekerlek('teker_3', AKS_X[1], TEKER_Z);
tekerlek('teker_4', AKS_X[1], -TEKER_Z);

// ===========================================================================
// 5. İSKELET — DÖRT dikme, duvar tabanı, TEK kuşak, dört diz payandası
// ===========================================================================
// ⚠️ Bu blok eski turdaki `dikme` + `kusak` + `payanda` bloklarının yerine
// geçiyor ve ÜÇÜ DE tek mesh'te. Çıkanlar ve gerekçeleri:
//   * dikme 8 → 4: ara dikmeler tam kütüğün önüne düşüyordu.
//   * YAN KUŞAKLARIN İKİSİ DE ÇIKTI (eskiden 1.62 ve 2.72'de iki sıra).
//     Sebep ölçülebilir: yan siluette kütük (Ø 0.72) ile aynı yönde uzanan
//     her kereste onunla YARIŞIYOR. Kuşaklar kalkınca güverte üstü (1.14) ile
//     saçak (3.38) arasındaki 2.24 m'lik bantta uzanan TEK yatay kütle kütük
//     kalıyor; bandın içindeki başka her şey (dört dikme) DİKEY.
//   * çapraz payandalar ÇIKTI: iskeleti tutan çaprazlar tam orta gözden,
//     yani kütüğün okunduğu yerden geçiyordu. Yerine dört DİZ PAYANDASI
//     kondu — hepsi saçağın hemen altında, kütük hattının tamamen dışında.
//   * demir bağ levhaları ve kavelalar ÇIKTI (912 üçgen; en yakın planda
//     bile bir piksellik aksan).
// Çerçeveyi kapatan bağ, saçak hizasındaki DİKDÖRTGEN halka: iki duvar
// tabanı (x boyunca) + iki alın bağı (z boyunca), dördü de kütüğün üstünde.
(function () {
    const Y = new Yigin();
    const UST = catiY(DIK_Z);                    // 3.4893 — merteğin alt yüzü
    [-DIK_Z, DIK_Z].forEach(function (z) {
        DIK_X.forEach(function (x) {
            kiris(Y, [x, SILL_UST - 0.06, z], [x, UST - 0.02, z], 0.165, 0.18, 0.145, 0.16, 0.045);
        });
        // duvar tabanı (wall plate) — mertek ayakları bunun üstüne oturuyor
        kiris(Y, [-KIZ_X, UST - 0.11, z], [KIZ_X, UST - 0.11, z],
              0.15, 0.10, 0.15, 0.10, 0.035);
        // diz payandaları: dikme başından duvar tabanına
        DIK_X.forEach(function (x) {
            kiris(Y, [x, UST - 0.62, z], [x - Math.sign(x) * 0.75, UST - 0.13, z],
                  0.08, 0.095, 0.08, 0.095, 0.025);
        });
    });
    // iki alın bağı (ön ve arka), duvar tabanı hizasında
    DIK_X.forEach(function (x) {
        kiris(Y, [x, UST - 0.11, -DIK_Z], [x, UST - 0.11, DIK_Z],
              0.13, 0.11, 0.13, 0.11, 0.03);
    });
    bitir(Y, 'dikme', C_MESE, M_AHSAP);
}());

// ===========================================================================
// 6. ÇATI İSKELETİ + ASKI BOYUNDURUKLARI  (tek mesh)
// ===========================================================================
// Mertek 9 çift → 5 çift (aralık 0.96 → 1.40 m), aşıklar ÇIKTI. Aşık, post
// kaplamanın ALTINDA kalan bir kirişti: kaplama takılınca hiçbir bakıştan
// görünmüyordu.
// Askı boyundurukları (eski `kiris_asma`) buraya taşındı — aynı renk, aynı
// malzeme, ayrı mesh olmasının tek sebebi eski _TINT listesiydi.
const MERTEK_X = [-2.80, -1.40, 0, 1.40, 2.80];
(function () {
    const Y = new Yigin();
    MERTEK_X.forEach(function (x) {
        [-1, 1].forEach(function (s) {
            kiris(Y, [x, catiY(SAC_Z) - 0.055, s * SAC_Z], [x, TEPE_Y - 0.05, 0],
                  0.085, 0.11, 0.085, 0.11, 0.028);
        });
    });
    // mahya kirişi
    kiris(Y, [-SAC_X, TEPE_Y - 0.11, 0], [SAC_X, TEPE_Y - 0.11, 0], 0.11, 0.13, 0.11, 0.13, 0.03);
    // ---- ASKI BOYUNDURUKLARI: kütüğün asıldığı İKİ enine kiriş ----
    // Smith, "Aries": kiriş enine bir kirişten halatla asılıyor. Burada İKİ
    // enine kiriş var — PARALELKENAR askı (tek kirişten asılan kütük
    // savrulurken burnunu kaldırır).
    [ANK_X1, ANK_X2].forEach(function (x) {
        kiris(Y, [x, KIRIS_Y, -1.30], [x, KIRIS_Y, 1.30], 0.14, 0.16, 0.14, 0.16, 0.04);
        [-1, 1].forEach(function (s) {
            kiris(Y, [x, KIRIS_Y + 0.10, s * 1.15], [x, catiY(1.15) - 0.06, s * 1.15],
                  0.085, 0.095, 0.085, 0.095, 0.025);
        });
    });
    bitir(Y, 'cati_kiris', C_MESE, M_AHSAP);
}());

// ===========================================================================
// 7. POST KAPLAMA — çatı + mahya + saçak alınlığı   (İKİNCİL RENK)
// ===========================================================================
// "peaux de bêtes fraîchement écorchées et soigneusement arrosées": taze
// yüzülmüş, sulanan postlar. Şeritler bindirmeli (her şerit bir öncekinin
// üstüne 0.06 m biniyor).
// ÇIKANLAR: saçak önlüğü (saçaktan 0.42 m sarkan post şeridi) ve arka perde.
// İkisi de kulübeyi KAPATIYORDU; önlük yan görünüşte kütüğün üstündeki bandı
// doldurup silueti düz bir kutuya çeviriyordu. Yerine 0.20 m'lik ince bir
// SAÇAK ALINLIĞI kondu: ikincil renk yandan hâlâ yatay bir çizgi olarak
// okunuyor ama hiçbir şeyi kapatmıyor.
// ⚠️ MAHYA POSTUNUN BOYU ÖLÇÜYLE SEÇİLDİ, göz kararıyla değil: eğim 32.74°
// olunca sırt şeridinin ALT yüzü, kenarında çatı yüzeyinin altında kalmalı
// yoksa mahyada bir yarık açılır. Yarı genişlik 0.19 m'de çatı yüzeyi
// y = TEPE_Y - EGIM*0.19 + 0.038 = 4.646; şeridin alt yüzü 4.640 — 0.006 m
// içeride, yani yarık YOK.
(function () {
    const Y = new Yigin();
    const N = 5, adim = (2 * SAC_X) / N;
    for (let i = 0; i < N; i++) {
        const x0 = -SAC_X + i * adim, x1 = x0 + adim + (i < N - 1 ? 0.06 : 0);
        [-1, 1].forEach(function (s) {
            catiPlaka(Y, x0, x1, s * 0.02, s * SAC_Z, 0.045 + (i % 2) * 0.008);
        });
    }
    // mahya postu: iki yamacı örten sırt şeridi (tek parça)
    kutu(Y, 0, TEPE_Y + 0.06, 0, 2 * SAC_X, 0.30, 0.38);
    // saçak alınlığı: saçak kenarına inen ince post şeridi
    [-1, 1].forEach(function (s) {
        kutu(Y, 0, catiY(SAC_Z) - 0.07, s * (SAC_Z - 0.035), 2 * SAC_X, 0.20, 0.07);
    });
    bitir(Y, 'cati_deri', C_POST, M_POST);
}());

// ===========================================================================
// 8. KÜTÜK — asılı koç kirişi  (ÖTELEME grubu)
// ===========================================================================
// ⚠️ MEKANİZMA PARALELKENAR. Dört halat EŞİT boyda ve iki AYRI x'teki
// boyunduruktan iniyor; kütük savrulurken YATAY kalıyor ve yalnız ÖTELENİYOR.
// Bu yüzden grup `position` ile sürülüyor: konum = L_HALAT * (sin θ, 1-cos θ, 0).
// Aynı θ halat gruplarının `rotation.z`si olunca halatların alt ucu tam
// kütüğün eksenine düşüyor — halatlar HER FAZDA GERGİN ve düz.
const kutukKok = new THREE.Group();
kutukKok.name = 'kutuk_kok';
modelGroup.add(kutukKok);
(function () {
    const Y = new Yigin();
    silindir(Y, [KUTUK_AR, KUTUK_Y, 0], [KUTUK_ON, KUTUK_Y, 0], R_DIP, R_UC, 12);
    // arka topuz: kütüğün kuyruğu kalın bırakılır (denge + halat tutamağı)
    silindir(Y, [KUTUK_AR - 0.18, KUTUK_Y, 0], [KUTUK_AR, KUTUK_Y, 0],
             R_DIP - 0.04, R_DIP + 0.03, 12);
    bitir(Y, 'kutuk', C_DISBUDAK, M_AHSAP, kutukKok);
}());
(function () {
    // ⚠️ Eski turda bilezikler 12 ayrı kısa kerestenin loft'uyla kuruluyordu:
    // bilezik başına 528, dört bilezikte 1600 üçgen — modelin en pahalı
    // parçası, üstelik 40 pikselde tek bir koyu halka olarak okunuyor. Yerine
    // KISA DEMİR KOVAN (12 köşeli silindir, 44 üçgen) kondu; okunan şey aynı,
    // maliyet %92 düştü. Bilezik sayısı da 4 → 3.
    const Y = new Yigin();
    function kovan(x, r) {
        silindir(Y, [x - 0.075, KUTUK_Y, 0], [x + 0.075, KUTUK_Y, 0], r, r, 12);
    }
    function yaricap(x) {          // kütüğün o istasyondaki yarıçapı
        const u = (x - KUTUK_AR) / (KUTUK_ON - KUTUK_AR);
        return R_DIP + (R_UC - R_DIP) * u;
    }
    kovan(KUTUK_AR + 0.70, yaricap(KUTUK_AR + 0.70) + 0.022);
    kovan(ANK_X1, yaricap(ANK_X1) + 0.022);
    kovan(ANK_X2, yaricap(ANK_X2) + 0.022);
    // asma halkaları: halatların bağlandığı dört halka
    [ANK_X1, ANK_X2].forEach(function (x) {
        [-1, 1].forEach(function (s) {
            halkaZ(Y, x, KUTUK_Y + yaricap(x) + 0.11, s * ANK_Z, 0.058, 0.092, 0.036, 6);
        });
    });
    bitir(Y, 'kutuk_bilezik', C_DEMIR, M_DEMIR, kutukKok);
}());
(function () {
    // DEMİR KOÇ BAŞI — modelin en uzaktan okunan ikinci işareti.
    // Smith: "a mass of bronze or iron ... which resembled in its form the
    // head of a ram". Bu turda BÜYÜDÜ: boy 0.86 → 1.00 m, en kalın yeri
    // Ø 0.41 → 0.84 (kütüğün ucundan 1.40 kat kalın), boynuz sarmalı
    // R 0.30 → 0.62 ve z'de açıklığı 0.64 → 1.06 m. Baş artık kütüğün ucuna
    // geçmiş bir kovan değil, siluette AYRI BİR KÜTLE.
    // Alın kabarası ÇIKTI: burnun üstünde 0.16 m'lik bir çıkıntıydı, en
    // yakın planda bile burnun kendi hacmiyle karışıyordu.
    const Y = new Yigin();
    // ⚠️ UÇ KÜT, SİVRİ DEĞİL. İlk sade sürümde burun 0.075 m yarıçapa kadar
    // inceliyordu ve model yandan bir MIZRAK gibi okunuyordu (koçbaşı temas
    // silahı; delmez, ezer). Uç yarıçapı 0.26'da bırakıldı: baş artık ucu
    // kesik ağır bir demir kütle.
    silindir(Y, [KUTUK_ON - 0.34, KUTUK_Y, 0], [KUTUK_ON + 0.10, KUTUK_Y, 0],
             R_UC + 0.035, R_UC + 0.085, 12);
    silindir(Y, [KUTUK_ON + 0.10, KUTUK_Y, 0], [UC_X - 0.25, KUTUK_Y, 0],
             0.42, 0.36, 12);
    silindir(Y, [UC_X - 0.25, KUTUK_Y, 0], [UC_X, KUTUK_Y, 0], 0.36, 0.26, 10);
    // ⚠️ BOYNUZUN SARMAL YÖNÜ ÖNEMLİ. Koç boynuzu başın TEPESİNDEN başlar,
    // ARKAYA döner, altından öne kıvrılır: sarmalın merkezi başın gerisinde,
    // sarmal yukarıdan (a0 = 1.25 rad) saat yönünün TERSİNE 4.6 rad süpürüyor.
    // Merkez burnun ÖNÜNE alınırsa boynuz burnu sarıyor ve yakın planda
    // "iki gri levha" gibi okunuyor (eski turda ölçülüp düzeltilmişti).
    // ⚠️ BOYNUZUN KÖKÜ BAŞA DEĞMELİ. Eski sürümde sarmalın ilk noktası
    // y = 2.406, burnun o istasyondaki tepesi ise 2.254 idi: boynuz başın
    // 0.09 m ÜSTÜNDE havada duruyordu ve önden bakışta "iki ayrı gri parça"
    // gibi okunuyordu. Bu turda merkez aşağı alınıp (cy = KUTUK_Y - 0.20)
    // R0 büyütüldü: kök noktası y = 2.338, boru yarıçapı 0.095 ile alt yüzü
    // 2.338; burnun aynı istasyondaki tepesi 2.459 — kök başın İÇİNDE.
    // ⚠️ z KAYMASI DA ÖLÇÜLDÜ: sarmalın en geri noktası (a = π) kütüğün
    // eksenine 0.433 m uzakta, kütük yarıçapı + boynuz borusu ise 0.371 m —
    // boynuz kütüğün içinden GEÇMİYOR (pay 0.062 m).
    [-1, 1].forEach(function (s) {
        const cx = KUTUK_ON + 0.02, cy = KUTUK_Y - 0.20, R0 = 0.62, k = Math.log(3.0);
        const N = 6;
        for (let i = 0; i < N; i++) {
            const t0 = i / N, t1 = (i + 1) / N;
            const a0 = 1.25 + t0 * 4.6, a1 = 1.25 + t1 * 4.6;
            const r0 = R0 * Math.exp(-k * t0), r1 = R0 * Math.exp(-k * t1);
            const p0 = [cx + Math.cos(a0) * r0, cy + Math.sin(a0) * r0, s * (0.32 + 0.16 * t0)];
            const p1 = [cx + Math.cos(a1) * r1, cy + Math.sin(a1) * r1, s * (0.32 + 0.16 * t1)];
            silindir(Y, p0, p1, 0.100 - 0.050 * t0, 0.100 - 0.050 * t1, 8, false);
        }
    });
    bitir(Y, 'bas', C_DEMIR_A, M_BAS, kutukKok);
}());

// ===========================================================================
// 9. DÖRT ASMA HALATI — Vitruvius X.15 "four stout ropes"
// ===========================================================================
// Her halat KENDİ ankrajındaki bir grubun içinde ve birim yönü -y. Grup
// `rotation.z = θ` alınca halatın alt ucu (0,-L) → (L sinθ, -L cosθ) oluyor;
// kütük grubunun ötelemesiyle BİREBİR aynı nokta. Halat boyu SABİT, yani
// halat her fazda GERGİN görünüyor.
// Uçlardaki sarım halkaları ÇIKTI (halat başına 32 üçgen); halat çapı
// 0.090 → 0.110 m'ye çıkarıldığı için sarım olmadan da okunuyor.
[[ANK_X1, ANK_Z], [ANK_X1, -ANK_Z], [ANK_X2, ANK_Z], [ANK_X2, -ANK_Z]]
    .forEach(function (q, k) {
        const g = new THREE.Group();
        g.name = 'halat_kok_' + (k + 1);
        g.position.set(q[0], KIRIS_Y, q[1]);
        modelGroup.add(g);
        const Y = new Yigin();
        silindir(Y, [0, 0, 0], [0, -L_HALAT, 0], R_HALAT, R_HALAT, 8, false);
        bitir(Y, 'halat_' + (k + 1), C_HALAT, M_HALAT, g);
    });

// ===========================================================================
// 10. MOTORA VERİLEN ÖLÇÜLER
// ===========================================================================
// Davranış ölçüleri BURADAN okuyor — iki yerde iki sayı olmasın.
modelGroup.userData.kocbasi = {
    L_HALAT: L_HALAT, KUTUK_Y: KUTUK_Y, KIRIS_Y: KIRIS_Y,
    KUTUK_ON: KUTUK_ON, KUTUK_AR: KUTUK_AR, UC_X: UC_X,
    ANK_X1: ANK_X1, ANK_X2: ANK_X2, ANK_Z: ANK_Z,
    R_TEKER: R_TEKER, KIZ_X: KIZ_X, TEPE_Y: TEPE_Y
};
