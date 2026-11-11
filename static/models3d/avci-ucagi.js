// Avcı uçağı — tek motorlu, tek kişilik çok amaçlı avcı (F-16C sınıfı).
// Modern Warfare grubunun altıncı modeli.
//
// ⚠️ KÜTÜPHANEDE `savas-ucagi` ADLI ESKİ BİR MODEL VAR ve id DOLU. Bu model
// onun yerine geçmek üzere YENİ bir id ile (`avci-ucagi`) kuruldu; eskisine
// hiç dokunulmadı.
//
// NEYE BENZEMEMESİ GEREKİYOR (sette ikisi de var):
//   * `yolcu-ucagi` — uzun silindirik gövde, 26° ok açılı kanat, kanat
//     altında iki turbofan, klasik kuyruk. Buradaki uçağın ayırt edici
//     işaretleri: KIRPIK DELTA kanat (hücum kenarı 40°, firar kenarı DÜZ),
//     TEK büyük egzoz nozulu, TEK dikey stabilize, karın altında hava alığı.
//   * `sabit-kanat-iha` (Bayraktar TB2 sınıfı) — ince, düz, çok yüksek
//     en-boy oranlı kanat, ince gövde, pervane. Buradaki kanadın en-boy
//     oranı 3.2 (TB2'de 12'nin üstünde) ve gövde kanat kadar geniş.
//   Tepe bakışında ayrım `avci_siluet.py` ile ÖLÇÜLDÜ; sayılar §0'da.
//
// GERÇEK ÖLÇÜLER — HEPSİ DOĞRULANDI, ezberden yazılmadı.
// Kaynak 1: USAF "F-16 Emergency Extraction" kartı (uçağın üstüne basılı
//           resmî ölçü çizimi):
//     LENGTH 49.5 FEET .................... 15.09 m
//     WING SPAN 31.0 FEET (W/O MISSILES) ..  9.45 m
//     WING SPAN 32.8 FEET W/MISSILES ...... 10.00 m
//     HEIGHT 16.7 FEET ....................  5.09 m
//     TAIL SPAN 18.3 FEET .................  5.58 m
//     WING AREA 300 SQ.FT ................. 27.87 m²
//     LEADING EDGE SWEEP 40 DEGREES
//     WHEEL BASE 7.8 FEET (iz) ............  2.38 m
//     13.1 FEET (dingil arası) ............  3.99 m
// Kaynak 2: Wikipedia "Specifications (F-16C Block 50/52)", USAF fact sheet
//           ve F-16C/D uçuş el kitabına dayalı: length 49 ft 5 in, span
//           32 ft 8 in, height 16 ft, wing area 300 sq ft, kanat profili
//           NACA 64A204, kırpık delta + gövdeye kaynaşmış kanat kökü.
// Kaynak 3: F-16C/D uçuş el kitabı lastik ölçüleri — ana takım
//           27.75 x 8.75-14.5 (çap 0.705 m), burun takımı 18 x 5.7-8
//           (çap 0.457 m).
//
// ⚠️ ÜÇ GÖRÜNÜŞ ÇİZİMİNDEN İSTASYON ÖLÇÜMÜ. Gövde boyunca hangi şeyin
// nerede olduğu (kanat kökü, hava alığı dudağı, kanopi, stabilize, nozul)
// Wikimedia'daki resmî tip 3-görünüş çiziminin PİKSELLERİNDEN ölçüldü:
// çizim 300 dpi'ye basıldı, üç görünüş bağlantılı bileşenle birbirinden
// ayrıldı ve her görünüşün kendi burun-kuyruk boyuna göre ORAN alındı.
//   ⚠️ Çizimin MUTLAK ölçeği güvenilmez: kendi içinde boy/kuyruk açıklığı
//   oranı yayımlanmış sayılarla %0.2 tutuyor ama kanat açıklığı %5.5
//   sapıyor. Bu yüzden MUTLAK boyutlar yayımlanmış sayılardan, İSTASYON
//   ORANLARI çizimden alındı. Çizimden okunan başlıca oranlar (burundan,
//   metre):
//     radom tepesi 1.24 · kanopi tepesi 4.44 · hava alığı dudağı 4.77
//     burun tekeri 5.36 · kanat firar kenarı 11.03 · ana teker 9.49
//     stabilize kökü 12.11 · stabilize ucu 13.63..14.28 · nozul 14.71
//
// ⚠️ KANAT PLANFORMU DÖRT SAYIDAN KAPALI ÇÖZÜLDÜ, göz kararı yok:
// açıklık 9.45 · alan 27.87 m² · hücum kenarı 40° · firar kenarı DÜZ.
// Bu dört koşul yamuğu tek türlü belirler:
//     yarı açıklık 4.725, uçtaki geri kayma 4.725·tan40° = 3.965
//     (kök + uç)/2 · 9.45 = 27.87  →  kök + uç = 5.899
//     kök − uç = 3.965             →  kök 4.932, uç 0.967
// Çizimin kendi planformu %6 daha büyük çıkıyor (kök 5.20, uç 1.30); dört
// yayımlanmış SAYI, piksel ölçümüne tercih edildi. Fark uçağın boyunun
// %2'si.
//
// ⚠️ PİTO ÇUBUĞU MODELLENMEDİ. Çizimde burnun ucundaki iğne uçağın boyunun
// %5-6'sı kadar. `sizeKm` max(box.x, box.z)'a bakıyor; iğneyi eklemek
// uçağın haritadaki gövdesini görünmeyen bir çubuk uğruna %6 küçültürdü.
// Kutu tam 15.09 m'de bitiyor (yayımlanmış boy).
//
// PARÇALAR (Studio3D bu adları arar, DEĞİŞTİRME):
//   govde, kanat, strake_1/2, stabilize, karin_yuzge_1/2
//                            → BİRİNCİL RENK (_TINT.parts)
//   kuyruk_dikey, kuyruk_bant → İKİNCİL RENK (_TINT.parts2)
//   takim                     → GRUP. Davranış irtifa eşiğinin üstünde
//                               visible=false yapar (takım toplanır).
//   teker_on_1                → burun tekeri (yuvarlanır)
//   teker_arka_1/2            → ana takım (yuvarlanır)
//   turbin                    → spin() ile dönen türbin diski (axis 'x')
//
// YÖN: burun +x, üst +y, sol kanat +z. Taban y=0 (lastiklerin değdiği yer).

// ===========================================================================
// 0. RENKLER
// ===========================================================================
// ⚠️ AÇIK RENK PATLAMASI ÖLÇÜLEREK KAÇINILDI. `parlaklik.py` (tepe bakışı,
// bakis.py ile birebir aynı ışık) yolcu uçağında '#e8eaed'in model
// pikselinin %77.8'ini TAM BEYAZA doyurduğunu ölçmüştü. Gerçek F-16 boyası
// FS36270 (koyu hayalet grisi) + FS36375 (açık hayalet grisi) ikilisi;
// koyu olanı taban aldık, açık olanı yalnız karın kaplamasında.
// ⚠️ metalness'i DÜŞÜRMEK patlamayı ARTIRIR (difüz = albedo·(1−metalness)).
// Uçakta ölçülmüştü: 0.22 → 0.10 yapılınca tam beyaz %0.9 → %16.2. Bu
// yüzden gövdede metalness 0.22'nin altına inilmedi.
const C_GOVDE   = '#6f7883';   // _TINT varsayılanı — FS36270 koyu hayalet grisi
const C_KANAT   = '#6f7883';   // kanat gövdeyle AYNI ton: gerçek F-16'da üst
                               // yüzeyler tek renk boyanır. Yolcu uçağındaki
                               // "kanat bir tık koyu" kuralı burada TERS
                               // olurdu — bir avcı uçağının kanadı gövdeden
                               // ayrı renkte olsaydı sivil boyama okunurdu.
                               // Tepe bakışında kanadı gövdeden ayıran şey
                               // ton değil, kumanda yüzeyi çizgileri (§8).
const C_KARIN   = '#9aa3ac';   // alt gövde + hava alığı dış yüzü: FS36375
const C_KUYRUK  = '#3a4453';   // dikey stabilize — İKİNCİL RENK varsayılanı
const C_BANT    = '#20262f';   // kuyruk bandı (filo işareti) — ikincil renk
const C_RADOM   = '#4b525a';   // radom: gerçek F-16'da gövdeden koyu, mat
const C_KANOPI  = '#4a3f1e';   // altın kaplamalı kanopi (F-16'nın imzası).
                               // Mavi cam DENENMEDİ: gerçekte altın-sarı ve
                               // uçağı tepe bakışında tanıtan tek parlak leke
                               // bu; mavi olsaydı yolcu uçağının kokpitiyle
                               // aynı okunurdu.
const C_KANOPI_C = '#565f69';  // kanopi çerçevesi / kızak
const C_KOYU    = '#171b21';   // hava alığı boğazı, nozul içi, gölgeli oyuk
const C_NOZUL   = '#7c7168';   // nozul dilimleri: ısıdan kararmış metal
const C_TURBIN  = '#565049';
const C_LASTIK  = '#17181b';
const C_JANT    = '#a7aeb5';
const C_BACAK   = '#8d949b';
const C_PILON   = '#77808a';
const C_YUK     = '#8d949b';   // harici yük gövdesi (tank / bomba)
const C_YUK_UC  = '#3f454c';   // yük burnu / arayıcı başlığı
const C_FUZE    = '#aab1b9';   // hava-hava füzesi: gerçekte açık gri/beyaz,
                               // gövdeden AÇIK olması yükün orada olduğunu
                               // tepe bakışında okutan tek şey.
                               // ⚠️ İLK DEĞER '#c8ccd0' PATLIYORDU. parlaklik.py
                               // ile bütün palet tarandı (her sabit sırayla
                               // koyuya çekilip ölçüldü): tam beyaz piksellerin
                               // 2237/2643'ü TEK BAŞINA bu sabitten geliyordu,
                               // yani kanat ucu füzelerinin tepeden görünen
                               // alanının ~%58'i düz beyazdı. Ton taraması:
                               //   #c8ccd0 → 2643 (%1.72)   #bfc4c9 → 2248
                               //   #b6bcc2 →  893 (%0.58)   #aab1b9 →  406 (%0.26)
                               // 406 kalan zemin (nozul/kanopi speküleri);
                               // #aab1b9'da füzenin katkısı SIFIR. Gövdeden
                               // (#6f7883) hâlâ belirgin açık, okuma bozulmuyor.
                               // Aynı ton yolcu uçağında da kullanılmıştı.
const C_PANEL   = '#5c646e';   // kumanda yüzeyi / panel çizgisi
const C_KIRMIZI = '#8f2b26';   // sol kanat ucu seyir feneri
const C_YESIL   = '#256b42';   // sağ kanat ucu seyir feneri

// ===========================================================================
// 1. TEMEL ÖLÇÜLER (hepsi yukarıdaki doğrulanmış kaynaklardan)
// ===========================================================================
const UZUN      = 7.545;    // yarı uzunluk → 15.09 m
const YARI_ACIK = 4.725;    // kanat paneli yarı açıklığı → 9.45 m
const UC_DIS    = 5.000;    // kanat ucu füzesi dış yüzü → 10.00 m
const TEPE      = 5.090;    // dikey stabilize tepesi (kutu yüksekliği)

const OK_TAN    = 0.83910;  // tan(40°) — hücum kenarı ok açısı
const KANAT_TE  = -3.490;   // kanat firar kenarı (DÜZ, açıklık boyunca sabit)
const KOK_KIRIS = 4.932;    // kök kirişi (§0'daki kapalı çözüm)
const UC_KIRIS  = 0.967;    // uç kirişi
const KANAT_Y   = 1.720;    // kanat düzlemi (dihedral 0° — F-16'da yok).
                            // Gövdenin karın hattı (1.02) ile sırtı (2.57)
                            // arasında %45'te: F-16 kanadı orta-alçak.

const R_TEKER   = 0.352;    // ana teker yarıçapı (27.75 in çap) — _WHEELS.radius
                            // ile BİREBİR aynı olmak zorunda
const R_BURUN_T = 0.229;    // burun tekeri (18 in çap)
const TAKIM_X   = -1.890;   // ana takım aksı
const TAKIM_Z   = 1.190;    // ana takım izi (±) → iz 2.38 m ✓
const BURUN_X   = 2.100;    // burun takımı aksı → dingil arası 3.99 m ✓
// ⚠️ ANA TAKIM ROTASYON PAYI (oleo açılması). Davranış uçağı ANA TAKIM DEĞME
// NOKTASINDA sabit duran bir pivottan döndürüyor; katı bir tekerlek böyle bir
// dönüşte zorunlu olarak zemine batar. ÖLÇÜLDÜ (560119 durumluk ızgara,
// `avci_kirpma_dogrula.js`):
//   ham hâl                       −0.0108 m   (pitch 10.16° = yerdeki en büyük açı)
//   çokgen sayısı 14→64           −0.0055 m   ihlal SÜRÜYOR + kutu 5.084→5.090,
//                                             üçgen 11868→13368
//   lastik 3 mm gömülü            −0.0067 m   (41 karelik iz; ihlal BÜYÜYOR)
//   ana teker +0.010 m            −0.0009 m
//   ana teker +0.014 m            +0.0000 m   TEMİZ, ana lastikte 3.0 mm pay
// Sebep sayıyla: teker merkezinin zemin düzlemine uzaklığı R_TEKER − ZEMIN =
// 0.3463 m, yarıçap ise 0.352 m. Pivot zeminde olduğu için θ açısında en
// alçak nokta 0.3463·cos θ − 0.352·cos δ; θ = 10.16°'de bu negatif. Koşul
// merkez yüksekliği ≥ R·cos δ / cos θ = 0.3572 m, yani en az 0.0109 m
// kaldırma. Çokgen sayısını artırmak δ'yı KÜÇÜLTTÜĞÜ için durumu kötüleştirir,
// gömmek merkez yüksekliğini düşürdüğü için daha da kötüleştirir.
// Gerçek uçakta da doğru: ağırlık ana takımdan kalkarken oleo açılır ve uçak
// birkaç santim yükselir — burada onun 14 mm'lik statik karşılığı.
// Kutuya etkisi YOK: en alçak nokta burun lastiği (0.0057) olarak kalıyor.
const TEKER_KALDIR = 0.014; // ana tekerin rotasyon payı (yalnız ana takım)

const NV        = 13;       // yarı kesitteki örnek (halka 2·NV−2 = 24)

// ===========================================================================
// 2. MONOTON KÜBİK EĞRİ (PCHIP)
// ===========================================================================
// Evin standart eğrisi (otomobil/otobüs/yolcu-ucagi ile aynı). Catmull-Rom
// denendi ve bırakıldı: eğimin hızla değiştiği yerde taşıyor. Burada taşma
// özellikle pahalı: kanopinin oturduğu sırt 3 metrede iki kez yön
// değiştiriyor, taşan bir eğri orada kambur üretir.
function egriYap(kp) {
    const n = kp.length, h = [], d = [], m = [];
    for (let i = 0; i < n - 1; i++) {
        h.push(kp[i + 1][0] - kp[i][0]);
        d.push((kp[i + 1][1] - kp[i][1]) / h[i]);
    }
    m.push(d[0]);
    for (let i = 1; i < n - 1; i++) {
        if (d[i - 1] * d[i] <= 0) { m.push(0); continue; }
        const w1 = 2 * h[i] + h[i - 1], w2 = h[i] + 2 * h[i - 1];
        m.push((w1 + w2) / (w1 / d[i - 1] + w2 / d[i]));
    }
    m.push(d[n - 2]);
    return function (x) {
        if (x <= kp[0][0]) return kp[0][1];
        if (x >= kp[n - 1][0]) return kp[n - 1][1];
        let i = 0;
        while (i < n - 2 && x > kp[i + 1][0]) i++;
        const t = (x - kp[i][0]) / h[i], t2 = t * t, t3 = t2 * t;
        return (2 * t3 - 3 * t2 + 1) * kp[i][1] + (t3 - 2 * t2 + t) * h[i] * m[i]
             + (-2 * t3 + 3 * t2) * kp[i + 1][1] + (t3 - t2) * h[i] * m[i + 1];
    };
}

// ---- gövdenin dört uzunlamasına eğrisi ------------------------------------
// ⚠️ YOLCU UÇAĞINDAN EN BÜYÜK AYRIM BURADA. Yolcu uçağının gövdesi 21 metre
// boyunca SABİT çaplı bir tüptür (basınç kabini). Avcı uçağında sabit kesitli
// tek bir santim yoktur: kesit burunda dar oval, kokpitte yükselir, kanat
// kökünde yassılaşıp genişler, motor bölmesinde yeniden daireye döner.
// Bu dört eğri o değişimi taşıyor.
// ⚠️ ÜST VE ALT HAT AYRI AYRI ÖLÇÜLDÜ, sonra merkez/yarıçapa çevrildi.
// İlk kurulumda merkez ve yarıçap doğrudan yazılmıştı ve ÖLÇÜM (kutu_olc.js)
// gövdenin altını hava alığının ÜSTÜNE çıkardı: alık gövdeye tamamen gömülüp
// yandan bakışta kayboldu, ayırıcı levha da gövdenin içinde kaldı. Doğrusu
// çizimden okunan iki hattan türetmek:
//   üst hat  (burundan m → yerden m): 1.24→2.11 · 2.75→2.43 · 4.44→2.99
//            (kanopi) · 6.62→2.68 · 7.63→2.57 · 8.64→2.55 · 9.82→2.60
//   alt hat: 1.63→1.68 · 3.10→1.49 · 4.60→1.46 (alık dudağı) · 4.77→0.92
//            (alığın altı) · 7.6→0.94
// Kanopi tepesi 2.99 ile sırt 2.55 arasındaki 0.44 m'lik fark, F-16'nın
// kabarık kanopisinin gövdeden ne kadar yükseldiğinin ta kendisi.
const _UST = egriYap([         // gövdenin sırt hattı (yerden)
    [-7.545, 2.400], [-6.300, 2.500], [-4.500, 2.580], [-2.280, 2.600],
    [ 0.000, 2.570], [ 1.500, 2.550], [ 2.300, 2.530], [ 3.350, 2.500],
    [ 4.200, 2.470], [ 4.800, 2.430], [ 5.600, 2.200], [ 6.310, 2.110],
    [ 6.700, 2.100], [ 7.100, 2.090], [ 7.350, 2.060], [ 7.545, 2.000]
]);
const _ALT = egriYap([         // gövdenin karın hattı (yerden)
    [-7.545, 1.520], [-6.300, 1.400], [-4.500, 1.120], [-2.280, 1.000],
    [ 0.000, 1.020], [ 1.500, 1.250], [ 2.300, 1.440], [ 3.350, 1.490],
    [ 4.200, 1.480], [ 4.800, 1.480], [ 5.600, 1.550], [ 6.310, 1.680],
    [ 6.700, 1.740], [ 7.100, 1.820], [ 7.350, 1.880], [ 7.545, 1.960]
]);
function R_Y(x) { return (_UST(x) - _ALT(x)) / 2; }
function YC(x)  { return (_UST(x) + _ALT(x)) / 2; }
// Kesitin yarı GENİŞLİĞİ — plan görünüşünden. ⚠️ Bu YALNIZ gövde; strake'in
// eklediği genişlik ayrı parçada (§9). Çizimin kanat önündeki toplam
// genişliği (burundan 3.12 m'de 0.70 · 4.47 m'de 0.85 · 5.28 m'de 1.02)
// gövde + strake toplamıdır.
const R_Z = egriYap([
    [-7.545, 0.430], [-6.300, 0.670], [-5.000, 0.870], [-3.900, 0.930],
    [-2.300, 0.900], [ 0.000, 0.800], [ 1.500, 0.730], [ 2.300, 0.690],
    [ 3.350, 0.640], [ 4.200, 0.600], [ 4.800, 0.560], [ 5.600, 0.470],
    [ 6.200, 0.380], [ 6.600, 0.300], [ 7.000, 0.190], [ 7.300, 0.100],
    [ 7.545, 0.020]
]);
// SÜPERELİPS ÜSSÜ. 2 = tam elips, büyüdükçe kesit KÖŞELENİR. Motor
// bölmesinde ve burunda daire (2.0-2.1), kanat kökünde yassı-köşeli (2.8):
// gerçek F-16'nın gövdesi orada yuvarlak değil, köşeleri yumuşatılmış bir
// dikdörtgendir ve tepe bakışında uçağa "gövde de taşıyor" görüntüsünü
// veren şey budur. Daire denendi ve bırakıldı: kanat kökü gövdeye bir boru
// gibi saplanıyor, kaynaşma (blended) okunmuyordu.
const N_KESIT = egriYap([
    [-7.545, 2.00], [-6.300, 2.05], [-4.800, 2.30], [-3.000, 2.70],
    [-1.200, 2.80], [ 0.500, 2.75], [ 2.300, 2.55], [ 4.200, 2.30],
    [ 5.600, 2.15], [ 7.545, 2.00]
]);

// ===========================================================================
// 3. GÖVDE KESİTİ (süperelips)
// ===========================================================================
// Fonksiyon adları kasten otobüs/otomobil/yolcu-ucagi ile AYNI (kesitPar /
// kesitNokta / nokta3 / normal3 / vYukseklik): tezgâhtaki `kesit_olc.js` bu
// adları arıyor, ölçüm aracı bu modelde de çalışsın diye.
function kesitPar(x) {
    return { ry: R_Y(x), rz: R_Z(x), yc: YC(x), n: N_KESIT(x) };
}
// v ∈ [0,1]: 0 = kesitin en altı, 1 = en üstü. Dönen [z, y].
// y v ile MONOTON artıyor (vYukseklik'in ikili araması buna dayanıyor).
function kesitNokta(P, v) {
    const th = Math.PI * v, s = Math.sin(th), c = Math.cos(th), p = 2 / P.n;
    const sz = Math.pow(s < 0 ? 0 : s, p);
    const cy = (c < 0 ? -1 : 1) * Math.pow(Math.abs(c), p);
    return [P.rz * sz, P.yc - P.ry * cy];
}
// Yüzey noktası. w ∈ [-1,1]: 0 = üst orta hat, ±1 = alt orta hat.
function nokta3(x, w) {
    const p = kesitNokta(kesitPar(x), 1 - Math.abs(w));
    return [x, p[1], (w < 0 ? -p[0] : p[0])];
}
// Sayısal yüzey normali (dışa bakar). Panelleri bu yönde ötelüyoruz.
function normal3(x, w) {
    const h = 0.006;
    const hx = (x > UZUN - 0.02) ? -h : h;
    const hw = (Math.abs(w) > 0.99) ? -h : h;
    const a = nokta3(x, w), b = nokta3(x + hx, w), c = nokta3(x, w + hw);
    const ux = b[0] - a[0], uy = b[1] - a[1], uz = b[2] - a[2];
    const vx = c[0] - a[0], vy = c[1] - a[1], vz = c[2] - a[2];
    let nx = uy * vz - uz * vy, ny = uz * vx - ux * vz, nz = ux * vy - uy * vx;
    const L = Math.sqrt(nx * nx + ny * ny + nz * nz) || 1;
    nx /= L; ny /= L; nz /= L;
    const yc = kesitPar(x).yc;
    if (ny * (a[1] - yc) + nz * a[2] < 0) { nx = -nx; ny = -ny; nz = -nz; }
    return [nx, ny, nz];
}
// Verilen yükseklikteki v (y, v ile monoton arttığı için ikili arama).
function vYukseklik(x, y) {
    const P = kesitPar(x);
    let a = 0, b = 1;
    for (let i = 0; i < 24; i++) {
        const m = (a + b) / 2;
        if (kesitNokta(P, m)[1] < y) a = m; else b = m;
    }
    return (a + b) / 2;
}

// ===========================================================================
// 4. GENEL LOFT — bu modeldeki BÜTÜN kütleler bundan çıkıyor
// ===========================================================================
// Gövde, kanat, stabilizeler, strake'ler, hava alığı, pilonlar ve harici
// yükler aynı makineden geçiyor: sıralı KAPALI halkalar birbirine dikiliyor,
// iki uç yelpaze ile kapanıyor. Extrude bu modelde kütle için HİÇ
// kullanılmadı — bir avcı uçağında sabit kesitli hiçbir kütle yoktur.
//
// ⚠️ SARIM YÖNÜ GÖZLE KOVALANMIYOR, ÖLÇÜLÜYOR. Aynalanan parçalarda (sol
// kanat, sol strake) halka sırası kendiliğinden ters dönüyor ve normaller
// içeri bakıyor. Kapalı kabuğun İŞARETLİ HACMİ hesaplanıyor, negatifse
// bütün üçgenler ters çevriliyor. Bir kez yazıldı, bütün parçalarda doğru.
function loftKur(ad, halkalar, renk, opts) {
    opts = opts || {};
    const n = halkalar[0].length, P = [], IDX = [];
    for (const h of halkalar) for (const p of h) P.push(p[0], p[1], p[2]);
    for (let i = 0; i < halkalar.length - 1; i++) {
        for (let j = 0; j < n; j++) {
            const j2 = (j + 1) % n;
            const a = i * n + j, b = i * n + j2;
            const c = (i + 1) * n + j, d = (i + 1) * n + j2;
            IDX.push(a, c, d, a, d, b);
        }
    }
    // Uç kapakları: halka köşeleri KOPYALANIYOR ki computeVertexNormals
    // kapağın normalini yan yüzeyinkiyle ortalamasın (kapak yumuşarsa uç
    // balon gibi görünür — otobüsün ön yüzünde ölçülmüştü).
    function kapak(h, ileri) {
        let mx = 0, my = 0, mz = 0;
        for (const p of h) { mx += p[0]; my += p[1]; mz += p[2]; }
        const merkez = P.length / 3;
        P.push(mx / n, my / n, mz / n);
        const bas = merkez + 1;
        for (const p of h) P.push(p[0], p[1], p[2]);
        for (let j = 0; j < n; j++) {
            const a = bas + j, b = bas + (j + 1) % n;
            if (ileri) IDX.push(merkez, b, a); else IDX.push(merkez, a, b);
        }
    }
    if (!opts.kapaksiz) {
        kapak(halkalar[halkalar.length - 1], true);
        kapak(halkalar[0], false);
    }
    let hac = 0;
    for (let i = 0; i < IDX.length; i += 3) {
        const a = IDX[i] * 3, b = IDX[i + 1] * 3, c = IDX[i + 2] * 3;
        hac += P[a] * (P[b + 1] * P[c + 2] - P[b + 2] * P[c + 1])
             - P[a + 1] * (P[b] * P[c + 2] - P[b + 2] * P[c])
             + P[a + 2] * (P[b] * P[c + 1] - P[b + 1] * P[c]);
    }
    if (hac < 0) for (let i = 0; i < IDX.length; i += 3) {
        const t = IDX[i + 1]; IDX[i + 1] = IDX[i + 2]; IDX[i + 2] = t;
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.Float32BufferAttribute(P, 3));
    geo.setIndex(IDX);
    geo.computeVertexNormals();
    const m = mesh(geo, renk, {
        metal: opts.metal == null ? 0.22 : opts.metal,
        rough: opts.rough == null ? 0.68 : opts.rough, name: ad
    });
    modelGroup.add(m);
    return m;
}

// ===========================================================================
// 5. GÖVDE KABUĞU
// ===========================================================================
// İstasyonlar burunda, kanopi altında ve kuyrukta SIK; kanat kökü boyunca
// daha SEYREK (orada kesit yavaş değişiyor).
const IST = [
    -7.545, -7.420, -7.250, -7.050, -6.800, -6.500, -6.100, -5.600,
    -5.000, -4.400, -3.800, -3.100, -2.400, -1.700, -1.000, -0.300,
     0.400,  1.100,  1.800,  2.500,  3.100,  3.700,  4.200,  4.700,
     5.100,  5.500,  5.900,  6.250,  6.550,  6.850,  7.100,  7.300,
     7.430,  7.545
];
const R_HALKA = 2 * NV - 2;

function govdeHalka(x) {
    const P = kesitPar(x), yarim = [];
    for (let i = 0; i < NV; i++) yarim.push(kesitNokta(P, i / (NV - 1)));
    // 0 = alt orta → +z yanı yukarı → NV−1 = üst orta → −z yanı aşağı.
    // Kapalı halka, kutup yok, bozuk üçgen yok.
    const r = [];
    for (let i = 0; i < NV; i++) r.push([x, yarim[i][1], yarim[i][0]]);
    for (let i = NV - 2; i >= 1; i--) r.push([x, yarim[i][1], -yarim[i][0]]);
    return r;
}
loftKur('govde', IST.map(govdeHalka), C_GOVDE, { metal: 0.22, rough: 0.72 });

// ===========================================================================
// 6. GÖVDEYE OTURAN PANELLER
// ===========================================================================
// Aynı yardımcı yolcu uçağındakiyle birebir: gövde yüzeyi x1..x2 ve w1..w2
// aralığında yeniden örnekleniyor ve normal boyunca `disari` kadar
// öteleniyor. Düz bir levha olsaydı burun konisinde yüzeyin içine girerdi.
//
// Bant biçimi: [x1, x2, w1, w2]            → w = kesit parametresi
//              [x1, x2, y1, y2, taraf]     → y YÜKSEKLİK
//
// ⚠️ `nx` bandın x, `nw` w yönündeki bölüntüsü. UZUN kenara ÇOK verilir;
// ters verilirse şerit gövdenin kavisini takip edemeyip içine girer ve
// KAYBOLUR (otobüste ölçülmüş tuzak).
function yuzeyYama(ad, bantlar, nx, nw, disari, renk, opts) {
    opts = opts || {};
    const P = [], IDX = [];
    for (const bant of bantlar) {
        const x1 = bant[0], x2 = bant[1], a1 = bant[2], a2 = bant[3];
        const taraf = bant.length > 4 ? bant[4] : 0;
        const taban = P.length / 3, S = nw + 1;
        for (let i = 0; i <= nx; i++) {
            const x = x1 + (x2 - x1) * i / nx;
            for (let j = 0; j <= nw; j++) {
                const a = a1 + (a2 - a1) * j / nw;
                const w = taraf ? taraf * (1 - vYukseklik(x, a)) : a;
                const p = nokta3(x, w), n = normal3(x, w);
                P.push(p[0] + n[0] * disari, p[1] + n[1] * disari, p[2] + n[2] * disari);
            }
        }
        for (let i = 0; i < nx; i++) {
            for (let j = 0; j < nw; j++) {
                const a = taban + i * S + j;
                IDX.push(a, a + S, a + S + 1, a, a + S + 1, a + 1);
            }
        }
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.Float32BufferAttribute(P, 3));
    geo.setIndex(IDX);
    geo.computeVertexNormals();
    const m = mesh(geo, renk, {
        metal: opts.metal == null ? 0.2 : opts.metal,
        rough: opts.rough == null ? 0.6 : opts.rough, name: ad
    });
    m.material.side = THREE.DoubleSide;
    // Kalınlıksız paneller GÖLGE DÜŞÜRMEZ: gövdeye 2-3 cm mesafede
    // duruyorlar, gölge haritasında kendi gölgelerini gövdenin üstüne basıp
    // benek (acne) üretiyorlardı.
    m.castShadow = false;
    modelGroup.add(m);
    return m;
}

// ---- RADOM ----------------------------------------------------------------
// Burun konisi gövdeden KOYU. Gerçek F-16'da radom boyanmaz, mat koyu gri
// kalır ve uçağın yandan silüetinde ilk okunan ayrım budur.
yuzeyYama('radom', [
    [5.60, 7.500,  0.00,  1.00],
    [5.60, 7.500, -1.00,  0.00]
], 20, 10, 0.008, C_RADOM, { metal: 0.12, rough: 0.85 });

// ---- ALT GÖVDE (açık gri karın) -------------------------------------------
// w 0.62 → 1.00, kesitin alt %38'i. Gerçek F-16'nın alt yüzeyleri FS36375
// (açık hayalet grisi), üstü FS36270. İki tonun sınırı gövdenin yanağında;
// bu şerit alçak bakışta uçağın yuvarlaklığını okutan tek işaret.
// ⚠️ RENK ALMIYOR: _TINT yalnız üst yüzeyleri boyuyor, tıpkı gerçek boyama
// şemasında olduğu gibi. Kullanıcı gövdeyi kırmızı yapsa da karnı gri kalır.
// ⚠️ x 5.55'te BİTİYOR, radomun 5.60'ta başladığı yerde. İlk kurulumda
// 6.30'a kadar gidiyordu ve ikisi 0.75 metre çakışıyordu: karın şeridi
// (0.014 dışarıda) radomun (0.008) ÜSTÜNE biniyor, burnun altı gövde
// renginde kalıyordu. Ölçüldü, `kutu_olc.js`: alt_govde x 6.302 / radom
// x 5.600.
yuzeyYama('alt_govde', [
    [-7.30, 5.55,  0.62,  1.00],
    [-7.30, 5.55, -1.00, -0.62]
], 40, 4, 0.014, C_KARIN, { metal: 0.14, rough: 0.78 });

// ---- SIRT PANEL HATTI -----------------------------------------------------
// Kanopinin arkasından dikey stabilizenin köküne kadar uzanan ince çizgi
// (yakıt/aviyonik sırt kapağı). Tepe bakışı haritanın ANA bakışı; gövdenin
// sırtı boş bırakılırsa 15 metrelik düz bir levha oluyor.
yuzeyYama('sirt_hat', [
    [-6.10, 1.90,  0.030,  0.075],
    [-6.10, 1.90, -0.075, -0.030]
], 26, 1, 0.016, C_PANEL, { metal: 0.2, rough: 0.6 });

// ---- MOTOR BÖLMESİ PANEL ÇİZGİSİ ------------------------------------------
// Gövdenin arka üçte birinde iki enine çizgi: motor sökme paneli.
yuzeyYama('motor_panel', [
    [-4.02, -3.96, -0.62,  0.62],
    [-6.34, -6.28, -0.62,  0.62]
], 1, 22, 0.014, C_PANEL, { metal: 0.2, rough: 0.6 });

// ===========================================================================
// 7. KANAT PROFİLİ
// ===========================================================================
// NACA dört haneli kalınlık dağılımı + basit kamber çizgisi. F-16'nın
// gerçek profili NACA 64A204: %4 kalınlık, %2 kamber. Elips kesit denendi
// ve bırakıldı (yolcu uçağında da): elipsin hücum kenarı da firar kenarı
// kadar küt, kanat yandan bakışta yassı bir levhaya düşüyor.
const KAMBER = 0.020, KAMBER_P = 0.40;   // 64A204'ün kamber değerleri
function profilKalinlik(u, tc) {
    return 5 * tc * (0.2969 * Math.sqrt(u) - 0.1260 * u - 0.3516 * u * u
                   + 0.2843 * u * u * u - 0.1015 * u * u * u * u);
}
function profilKamber(u) {
    if (u < KAMBER_P) return KAMBER / (KAMBER_P * KAMBER_P) * (2 * KAMBER_P * u - u * u);
    const q = 1 - KAMBER_P;
    return KAMBER / (q * q) * ((1 - 2 * KAMBER_P) + 2 * KAMBER_P * u - u * u);
}
// Halka: üst yüzey hücum→firar, sonra alt yüzey firar→hücum. Kosinüs
// örneklemesi hücum kenarında sıklaştırıyor (orada eğrilik en yüksek).
const KN = 10;                      // yüzey başına örnek → halka 2·KN−2 = 18
function profilHalka(K, yerlestir, simetrik) {
    const pts = [];
    const kam = simetrik ? function () { return 0; } : profilKamber;
    for (let i = 0; i < KN; i++) {
        const u = (1 - Math.cos(Math.PI * i / (KN - 1))) / 2;
        pts.push(yerlestir(u, kam(u) + profilKalinlik(u, K.tc)));
    }
    for (let i = KN - 2; i >= 1; i--) {
        const u = (1 - Math.cos(Math.PI * i / (KN - 1))) / 2;
        pts.push(yerlestir(u, kam(u) - profilKalinlik(u, K.tc)));
    }
    return pts;
}
// Yatay taşıyıcı yüzey (kanat, stabilize, strake): açıklık z boyunca.
function yatayHalka(K) {
    const kiris = K.xle - K.te;
    return profilHalka({ tc: K.tc }, function (u, t) {
        return [K.xle - u * kiris, K.y + t * kiris, K.z];
    }, K.simetrik);
}
// Düşey yüzey (dikey stabilize, pilon): açıklık y boyunca.
function duseyHalka(K) {
    const kiris = K.xle - K.te;
    return profilHalka({ tc: K.tc }, function (u, t) {
        return [K.xle - u * kiris, K.y, (K.z || 0) + t * kiris];
    }, true);
}

// ===========================================================================
// 8. KANAT — kırpık delta, gövdenin İÇİNDEN geçen TEK kabuk
// ===========================================================================
// z = −4.725'ten +4.725'e tek loft. İki ayrı kanat yapmak denenmedi: kök
// kesitinin gövde içinde birleşmesi gerekiyor ve tek kabuk hem o sorunu
// hem de aynalanan yarıda sarımın ters dönmesini kökünden kaldırıyor.
//
// PLANFORM §0'daki kapalı çözümden: hücum kenarı xle = 1.442 − 0.8391·|z|
// (TAM 40°), firar kenarı |z|'den BAĞIMSIZ −3.490 (düz). Kök kirişi 4.932,
// uç kirişi 0.967.
// ⚠️ FİRAR KENARININ DÜZ OLMASI yolcu uçağından en kolay ayıran işaret:
// orada firar kenarı 6.40'ta kırılıp süpürülüyor ve altında üç flap rayı
// kılıfı var. Burada firar kenarı tek bir düz çizgi.
const KANAT_KOK_LE = KANAT_TE + KOK_KIRIS;         // +1.442
function kanatKesit(z) {
    const xle = KANAT_KOK_LE - OK_TAN * Math.abs(z);
    // Kalınlık oranı kökte %5.5, uçta %4.0 (gerçek profil %4; kök gövdeye
    // kaynaştığı için biraz kalın). Kirişe ORAN olduğu için uçta mutlak
    // kalınlık 0.039 m'ye düşüyor — kanat ucu gerçekten bıçak gibi.
    const f = Math.abs(z) / YARI_ACIK;
    return { z: z, xle: xle, te: KANAT_TE, tc: 0.055 - 0.015 * f, y: KANAT_Y };
}
(function kanatKur() {
    const zler = [0.00, 0.80, 1.60, 2.40, 3.10, 3.75, 4.25, 4.60, 4.725];
    const tam = [];
    for (let i = zler.length - 1; i >= 1; i--) tam.push(kanatKesit(-zler[i]));
    for (const z of zler) tam.push(kanatKesit(z));
    loftKur('kanat', tam.map(yatayHalka), C_KANAT, { metal: 0.22, rough: 0.72 });
})();

// ---- kumanda yüzeyi çizgileri ---------------------------------------------
// Tepe bakışı haritanın ANA bakışı ve kanat 27 m²'lik düz bir levha.
// Gerçek F-16 kanadının üstünde üç çizgi okunur: hücum kenarı flabının
// menteşesi, flaperonun menteşesi ve iki flaperon arasındaki ayrım.
// ⚠️ Çizgiler kanat YÜZEYİNE oturuyor (profil fonksiyonundan yeniden
// örneklenip 2 cm yukarı ötelenerek), düz levha olarak değil.
// ⚠️ Kanat gövdeyle AYNI renkte olduğu için bu çizgiler kanadı gövdeden
// ayıran TEK şey. Yolcu uçağında bu işi ton farkı yapıyordu.
function kanatSerit(ad, u1, u2, z1, z2, renk) {
    const P = [], IDX = [], N = 8;
    for (const yon of [1, -1]) {
        const taban = P.length / 3;
        for (let i = 0; i <= N; i++) {
            const z = z1 + (z2 - z1) * i / N, K = kanatKesit(z);
            const kiris = K.xle - K.te;
            for (const u of [u1, u2]) {
                const t = profilKamber(u) + profilKalinlik(u, K.tc);
                P.push(K.xle - u * kiris, K.y + t * kiris + 0.020, yon * z);
            }
        }
        for (let i = 0; i < N; i++) {
            const a = taban + i * 2;
            IDX.push(a, a + 2, a + 3, a, a + 3, a + 1);
        }
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.Float32BufferAttribute(P, 3));
    geo.setIndex(IDX);
    geo.computeVertexNormals();
    const m = mesh(geo, renk, { metal: 0.2, rough: 0.6, name: ad });
    m.material.side = THREE.DoubleSide;
    m.castShadow = false;
    modelGroup.add(m);
}
kanatSerit('kanat_on_flap', 0.075, 0.105, 0.95, 4.60, C_PANEL);   // hücum kenarı flabı
kanatSerit('kanat_flaperon', 0.760, 0.790, 0.95, 4.55, C_PANEL);  // flaperon menteşesi
kanatSerit('kanat_ayrim', 0.800, 0.985, 2.72, 2.80, C_PANEL);     // iki flaperon arası

// ---- kanat ucu seyir fenerleri --------------------------------------------
// Sol kırmızı, sağ yeşil (gerçek kural: sol=port=kırmızı). Model +z SOL yan.
// ⚠️ FİRAR KENARINDA, hücum kenarında DEĞİL. İlk kurulumda x −3.19'a
// konmuştu ve kanat ucu fırlatma rampasının (x −3.325..−1.375) tam
// İÇİNDE kalıyordu — ölçüldü, `kutu_olc.js`. Gerçek F-16'da da kanat ucu
// fenerleri rampanın arkasındadır.
[[1, C_KIRMIZI], [-1, C_YESIL]].forEach(function (a, i) {
    const g = new THREE.SphereGeometry(0.062, 7, 5);
    g.scale(1.4, 0.9, 0.9);
    g.translate(KANAT_TE + 0.06, KANAT_Y, a[0] * 4.690);
    modelGroup.add(mesh(g, a[1], { metal: 0.1, rough: 0.35,
                                   name: 'fener_' + (i + 1) }));
});

// ===========================================================================
// 9. STRAKE (LERX) — gövdeye kaynaşmış kanat kökü
// ===========================================================================
// F-16'nın imzası: kanat kökünden ÖNE doğru, kokpitin altına kadar uzanan
// keskin kenarlı ince üçgen. Görevi girdap kaldırması üretmek; görsel işi
// gövde ile kanadın arasında kesik bir omuz kalmaması.
// ⚠️ Tepe bakışında uçağı yolcu uçağından ayıran ikinci işaret: yolcu
// uçağında kanat gövdeye bir dik açıyla saplanır, burada gövdenin yanağı
// kanada doğru YUMUŞAKÇA genişler.
// ⚠️ Strake'in İÇ kenarı gövdenin İÇİNDE (z gövde yarı genişliğinden 12 cm
// küçük): dışarıda bıraksaydık gövde ile strake arasında ince bir yarık
// kalır ve alçak bakışta öbür tarafın zemini görünürdü.
// ⚠️ İLK KURULUM ÖLÇÜMLE ÇÜRÜDÜ. Strake'in dış kenarı gövdenin yarı
// genişliğinden yalnız 4-10 cm dışarıdaydı; tepe bakışında hiç okunmuyordu.
// Çizimden ölçülen gerçek plan yarı genişliği (burundan): 3.12 m'de 0.70 ·
// 4.47 m'de 0.85 · 5.28 m'de 1.02 — yani strake gövdeyi kanat kökünde
// neredeyse İKİ KATINA çıkarıyor. Aşağıdaki dış kenar eğrisi o üç ölçüme
// oturtuldu (model x = 7.545 − istasyon).
//
// GEOMETRİ: her kesit z'de duruyor, hücum kenarı `xle(z)` dış kenar
// eğrisinden, firar kenarı KANADIN HÜCUM KENARINDAN 0.20 m içeride. Böylece
// strake ile kanat 20 cm çakışıyor ve aralarında dikiş kalmıyor.
// Dış kenarın ok açısı içeride 61°, dışarıda 87°'ye çıkıyor — LERX'in
// karakteristik "kobra başlığı" biçimi budur ve 40°'lik kanat ok açısıyla
// arasındaki kırık, uçağı tepeden tanıtan ikinci işaret.
const STRAKE_KENAR = [
    // [z, hücum kenarı x]
    [0.00, 5.10], [0.56, 4.80], [0.70, 4.43], [0.85, 3.35],
    [1.00, 2.70], [1.15, 2.27], [1.22, 1.10], [1.25, 0.393]
];
[1, -1].forEach(function (s, i) {
    const kesitler = STRAKE_KENAR.map(function (p) {
        const z = p[0], xle = p[1];
        // firar kenarı kanadın hücum kenarının 0.20 m gerisinde (çakışma)
        const te = KANAT_KOK_LE - OK_TAN * z - 0.20;
        const kiris = xle - te;
        // Kalınlık MUTLAK isteniyor (kökte 0.26 m, dış kenarda 0.05 m);
        // profil fonksiyonu ORAN aldığı için kirişe bölünüyor.
        const kal = 0.26 - 0.21 * (z / 1.25);
        return { z: s * z, xle: xle, te: te,
                 tc: Math.min(0.30, kal / Math.max(kiris, 0.12)),
                 y: KANAT_Y + 0.08, simetrik: true };
    });
    loftKur('strake_' + (i + 1), kesitler.map(yatayHalka), C_KANAT,
            { metal: 0.22, rough: 0.72 });
});

// ===========================================================================
// 10. KUYRUK
// ===========================================================================
// TEK dikey stabilize (yolcu uçağıyla aynı sayıda ama oran bambaşka: burada
// kuyruk gövdenin dörtte birinden uzun bir kirişe oturuyor) + TAM HAREKETLİ
// yatay stabilizeler (stabilator) + iki karın yüzgeci.
//
// DİKEY STABİLİZE: kök y=2.35'te, yani gövdenin İÇİNDE başlıyor (x=−4'te
// gövde sırtı 2.51). Kökü sırtın üstünde başlatmak DENENDİ ve bırakıldı:
// sırt çizgisi hafif kavisli, kök çizgisi düz; arada 3-4 cm'lik bir yarık
// kalıyordu. Gömmek hem ucuz hem doğru.
// Hücum kenarı ok açısı: (−3.30 → −6.30) / (2.35 → 5.09) = 47.6°.
const DIKEY_KESIT = [
    { y: 2.35, xle: -3.30, te: -7.30, tc: 0.055 },
    { y: 3.00, xle: -3.98, te: -7.36, tc: 0.052 },
    { y: 3.70, xle: -4.72, te: -7.42, tc: 0.048 },
    { y: 4.35, xle: -5.40, te: -7.47, tc: 0.044 },
    { y: 4.85, xle: -5.98, te: -7.50, tc: 0.040 },
    { y: 5.05, xle: -6.22, te: -7.49, tc: 0.032 },
    { y: 5.09, xle: -6.30, te: -7.47, tc: 0.020 }
];
loftKur('kuyruk_dikey', DIKEY_KESIT.map(duseyHalka), C_KUYRUK,
        { metal: 0.2, rough: 0.66 });

// KUYRUK BANDI: dikey stabilizenin tepesine yakın enine şerit (filo
// işareti). ⚠️ YAZI YOK — harita modeli soldan sağa AYNALIYOR (OKU.md'deki
// ölçülmüş tuzak, det(projection) < 0); kuyruğa kod yazsaydık ters çıkardı.
// Kimliği yazı yerine RENK taşıyor: bant _TINT'in İKİNCİL rengini alıyor.
(function () {
    const P = [], IDX = [];
    const A = { y: 4.42, xle: -5.47, te: -7.47, tc: 0.043 };
    const B = { y: 4.86, xle: -6.00, te: -7.50, tc: 0.040 };
    for (const K of [A, B]) {
        const kiris = K.xle - K.te;
        for (const yon of [1, -1]) {
            for (let i = 0; i <= 6; i++) {
                const u = i / 6;
                const t = yon * profilKalinlik(u, K.tc);
                P.push(K.xle - u * kiris, K.y, t * kiris + yon * 0.006);
            }
        }
    }
    // iki yan yüz ayrı ayrı dikiliyor (7 nokta x 2 taraf x 2 kesit)
    for (const off of [0, 7]) {
        for (let i = 0; i < 6; i++) {
            const a = off + i, b = a + 14;
            IDX.push(a, b, b + 1, a, b + 1, a + 1);
        }
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.Float32BufferAttribute(P, 3));
    geo.setIndex(IDX);
    geo.computeVertexNormals();
    const m = mesh(geo, C_BANT, { metal: 0.2, rough: 0.55, name: 'kuyruk_bant' });
    m.material.side = THREE.DoubleSide;
    m.castShadow = false;
    modelGroup.add(m);
})();

// YATAY STABİLİZE (stabilator): kanatla aynı makine, tek kabuk, gövdenin
// içinden geçer. ⚠️ 10° ANHEDRAL — gerçek F-16'da stabilizeler aşağı
// eğiktir ve önden bakışta uçağı tanıtan ilk işaret budur. Yolcu uçağının
// yatay kuyruğu ise 6° YUKARI eğiktir.
// Açıklık 5.58 m (USAF kartındaki TAIL SPAN 18.3 FEET).
const STAB_ANHEDRAL = 0.176;     // tan(10°)
function stabKesit(z) {
    const a = Math.abs(z);
    return { z: z, xle: -3.90 - 0.785 * a, te: -7.05 + 0.111 * a,
             tc: 0.050, y: 1.80 - STAB_ANHEDRAL * a, simetrik: true };
}
(function () {
    const zler = [0.00, 0.70, 1.40, 2.05, 2.55, 2.790];
    const tam = [];
    for (let i = zler.length - 1; i >= 1; i--) tam.push(stabKesit(-zler[i]));
    for (const z of zler) tam.push(stabKesit(z));
    loftKur('stabilize', tam.map(yatayHalka), C_KANAT, { metal: 0.22, rough: 0.72 });
})();

// KARIN YÜZGEÇLERİ: gövdenin altında, kanat firar kenarının arkasında iki
// küçük yüzgeç, dışa doğru ~25° eğik. Alçak bakışta uçağın altını dolduran
// ve onu tek başına "avcı uçağı" yapan ayrıntılardan biri.
[1, -1].forEach(function (s, i) {
    // ⚠️ ALT KENAR ARKAYA DOĞRU YÜKSELİYOR, düz değil. İlk kurulumda alt
    // kenar x −4.50'den −6.15'e kadar y=0.52'de DÜZ gidiyordu ve KUYRUK
    // SÜRTME AÇISINI 6.88 dereceye düşürüyordu (ölçüldü,
    // avci_kuyruk_olc.js): uçak burnunu 7 dereceden fazla kaldıramıyordu.
    // Çizimin yan görünüşünde yüzgecin en alçak noktası burundan 11.9 m'de
    // (model x −4.4) 0.54 m ve arkaya doğru 5.6 m'de 1.08 m'ye çıkıyor.
    // O biçim geri konunca sürtme açısı gerçek F-16'nın rotasyon sınırına
    // (12-15 derece) oturuyor.
    const KES = [
        { y: 1.20, xle: -3.90, te: -5.90, tc: 0.075, z: s * 0.56 },
        { y: 0.90, xle: -3.98, te: -5.45, tc: 0.070, z: s * 0.72 },
        { y: 0.72, xle: -4.10, te: -5.05, tc: 0.062, z: s * 0.86 },
        { y: 0.66, xle: -4.20, te: -4.86, tc: 0.050, z: s * 0.93 }
    ];
    loftKur('karin_yuzge_' + (i + 1), KES.map(duseyHalka), C_KANAT,
            { metal: 0.22, rough: 0.72 });
});

// ===========================================================================
// 11. KANOPİ — çerçevesiz kabarık (bubble) kanopi
// ===========================================================================
// F-16'nın en tanınır ayrıntısı. Tek parça, çerçevesiz, öne menteşeli;
// gövdenin sırtından 0.50 m yükseliyor ve pilotun etrafında 360° görüş
// veriyor. ⚠️ Yolcu uçağının kokpitiyle kıyaslanabilir bir şey değil: orada
// cam gövdenin yüzeyine oturan düz bir yamadır, burada kanopi kendi
// KÜTLESİ olan bir kabuk.
//
// ⚠️ ALTIN KAPLAMA. Gerçek F-16 kanopisi radar kesitini düşürmek için altın
// kaplamalıdır ve gün ışığında sarı-turuncu parlar. Koyu mavi cam DENENDİ
// ve bırakıldı: mavi kanopi tepe bakışında yolcu uçağının kokpit camıyla
// aynı lekeyi veriyor, altın olan uçağı tek başına tanıtıyor.
(function kanopiKur() {
    // [x, kanopi tepesi y, yarı genişlik, taban y] — sırttan yukarı
    // ⚠️ TEPE 2.99, çizimden ölçülmüş değerin ta kendisi (burundan 4.44 m'de
    // yerden 2.99 m). Taban her istasyonda gövdenin sırt hattının 6 cm
    // altında: kanopi gövdeye OTURUYOR, üstünde durmuyor.
    const KP = [
        [ 5.02, 2.47, 0.06],
        [ 4.80, 2.72, 0.26],
        [ 4.45, 2.88, 0.40],
        [ 3.95, 2.97, 0.48],
        [ 3.35, 2.99, 0.50],
        [ 2.80, 2.96, 0.50],
        [ 2.30, 2.89, 0.48],
        [ 1.90, 2.78, 0.42],
        [ 1.62, 2.66, 0.32],
        [ 1.48, 2.56, 0.18]
    ].map(function (p) { return [p[0], p[1], p[2], _UST(p[0]) - 0.06]; });
    const halkalar = KP.map(function (p) {
        const x = p[0], ust = p[1], rz = p[2], taban = p[3];
        const ry = ust - taban, r = [];
        // yarım kubbe: taban → tepe → taban (kapalı halka, alt kenar düz)
        for (let i = 0; i < NV; i++) {
            const th = Math.PI * (i / (NV - 1)) * 0.5;
            r.push([x, taban + ry * Math.sin(th), rz * Math.cos(th)]);
        }
        for (let i = NV - 2; i >= 0; i--) {
            const th = Math.PI * (i / (NV - 1)) * 0.5;
            r.push([x, taban + ry * Math.sin(th) * 0.94, -rz * Math.cos(th)]);
        }
        return r;
    });
    // ⚠️ rough 0.14 DENENDİ ve bırakıldı: kanopi tepe bakışında tek bir
    // beyaz şerit halinde parlıyor ve altın rengi kayboluyordu. 0.24'te
    // renk okunuyor, parlaklık ölçümü de düşüyor (parlaklik.py).
    loftKur('kanopi', halkalar, C_KANOPI, { metal: 0.38, rough: 0.24 });
})();
// Kanopi kızağı / arka peri: kanopinin gövdeye oturduğu ince kuşak.
yuzeyYama('kanopi_kizak', [
    [1.48, 5.02,  0.010,  0.062],
    [1.48, 5.02, -0.062, -0.010]
], 14, 1, 0.012, C_KANOPI_C, { metal: 0.3, rough: 0.5 });
// Ön cam bölme çubuğu (kanopinin önündeki tek çerçeve).
(function () {
    const g = new THREE.BoxGeometry(0.16, 0.30, 0.09);
    g.translate(5.00, 2.47, 0);
    modelGroup.add(mesh(g, C_KANOPI_C, { metal: 0.35, rough: 0.4,
                                         name: 'kanopi_bow' }));
})();
// Koltuk başlığı — kanopinin altında koyu bir leke. Boş bir kanopi cam
// küresi gibi duruyordu.
(function () {
    const g = new THREE.SphereGeometry(0.22, 8, 6);
    g.scale(1.3, 1.0, 0.9);
    g.translate(3.55, 2.58, 0);
    modelGroup.add(mesh(g, C_KOYU, { metal: 0.2, rough: 0.8, name: 'koltuk' }));
})();

// ===========================================================================
// 12. HAVA ALIĞI — karın altında, sabit geometrili pitot tipi
// ===========================================================================
// F-16'nın ikinci imzası ve tek motorlu olduğunu tek başına söyleyen şey.
// Gövdenin ALTINDA, kokpitin biraz gerisinde başlar; ağzı gövdeden bir
// AYIRICI LEVHA (splitter plate) ile ayrılmıştır — sınır tabakası motora
// girmesin diye. Model bunu 6 cm'lik gerçek bir boşlukla kuruyor.
//
// ⚠️ İKİ AYRI LOFT: dış kabuk (açık gri, karınla aynı ton) ve iç boğaz
// (koyu). Tek parça olsaydı ağız koyu olamazdı ve alık tepe bakışında
// gövdenin altında düz bir kutu gibi kalırdı (yolcu uçağının motor
// kaportasında ölçülen aynı ayrım).
// ⚠️ AYIRICI BOŞLUĞU ÖLÇÜLEREK KURULDU. İlk kurulumda alığın üstü 1.415'te,
// gövdenin altı ise 1.381'deydi — yani alık gövdenin İÇİNE 3 cm giriyordu ve
// yandan bakışta hiç görünmüyordu (bakis.py, "yan" paneli). Şimdi her
// istasyonda alığın üstü gövdenin karın hattının ALTINDA:
//     x  2.90: gövde altı 1.485 / alık üstü 1.430 → boşluk 0.055
//     x  2.40: 1.455 / 1.400 → 0.055
//     x  1.80: 1.330 / 1.300 → 0.030
//     x  1.20: 1.190 / 1.190 → 0.000  (kaynaşma başlıyor)
//     x  0.60: 1.080 / 1.070 → kaynaşmış
// Gerçek F-16'da da ayırıcı yalnız dudağın çevresinde açıktır; kanal
// birkaç metre sonra gövdeye kaynar.
const ALIK_DUDAK = 2.900;      // ağız düzlemi (çizimden: burundan 4.65 m)
function alikHalka(x, yust, yalt, rz, kose) {
    // Köşeleri yuvarlatılmış dikdörtgen kesit: F-16 alığı daire değil,
    // altı yuvarlak üstü düz bir "D".
    const yc = (yust + yalt) / 2, ry = (yust - yalt) / 2, r = [];
    for (let i = 0; i < NV; i++) {
        const th = Math.PI * i / (NV - 1), s = Math.sin(th), c = Math.cos(th);
        const p = 2 / kose;
        r.push([x, yc - ry * ((c < 0 ? -1 : 1) * Math.pow(Math.abs(c), p)),
                rz * Math.pow(s, p)]);
    }
    for (let i = NV - 2; i >= 1; i--) {
        const th = Math.PI * i / (NV - 1), s = Math.sin(th), c = Math.cos(th);
        const p = 2 / kose;
        r.push([x, yc - ry * ((c < 0 ? -1 : 1) * Math.pow(Math.abs(c), p)),
                -rz * Math.pow(s, p)]);
    }
    return r;
}
// [x, üst y, alt y, yarı genişlik, köşe üssü]
const ALIK = [
    [ ALIK_DUDAK, 1.430, 0.920, 0.520, 2.9],
    [ 2.400,      1.400, 0.905, 0.545, 2.9],
    [ 1.800,      1.300, 0.900, 0.575, 2.8],
    [ 1.200,      1.190, 0.910, 0.590, 2.7],
    [ 0.600,      1.070, 0.950, 0.575, 2.5],
    [ 0.150,      1.010, 0.995, 0.500, 2.4]
];
loftKur('hava_alici', ALIK.map(function (a) {
    return alikHalka(a[0], a[1], a[2], a[3], a[4]);
}), C_KARIN, { metal: 0.2, rough: 0.7 });
// İç boğaz: dudağın 6 cm içinden başlayıp geriye. Ağzın koyu görünmesini
// sağlayan tek şey; DoubleSide, çünkü içeriden bakılıyor.
(function () {
    const IC = [
        [ ALIK_DUDAK - 0.02, 1.390, 0.960, 0.480, 2.9],
        [ 2.300,             1.360, 0.945, 0.500, 2.8],
        [ 1.600,             1.280, 0.945, 0.530, 2.7],
        [ 0.900,             1.170, 0.955, 0.530, 2.5]
    ];
    const m = loftKur('hava_agiz', IC.map(function (a) {
        return alikHalka(a[0], a[1], a[2], a[3], a[4]);
    }), C_KOYU, { metal: 0.15, rough: 0.9, kapaksiz: true });
    m.material.side = THREE.DoubleSide;
})();
// AYIRICI LEVHA (splitter plate): alığın üstü ile gövdenin altı arasındaki
// 6 cm'lik boşluğu tutan ince levha. Gerçekte de görünen bir parçadır ve
// alığın gövdeye YAPIŞIK olmadığını okutan tek işaret.
(function () {
    const g = new THREE.BoxGeometry(1.30, 0.060, 1.02);
    g.translate(2.42, 1.460, 0);
    modelGroup.add(mesh(g, C_KARIN, { metal: 0.2, rough: 0.7,
                                      name: 'ayirici_levha' }));
})();

// ===========================================================================
// 13. EGZOZ NOZULU — tek, büyük, yakınsak-ıraksak
// ===========================================================================
// Yolcu uçağından en uzaktaki parça: orada kanat altında iki KISA ve GENİŞ
// turbofan var (boy/çap 1.7), burada gövdenin ucunda TEK ve büyük bir
// nozul. Nozul çapı (0.90 m) gövdenin arka kesitinin neredeyse tamamı.
//
// LatheGeometry: nozul tam bir dönel yüzey ve profili elle yazmak (dilimler
// içeri sonra dışarı kıvrılıyor) loft halkalarından kısa.
// ⚠️ rotateZ(−π/2) lathe'in ekseni olan +y'yi model +x'ine taşıyor.
function lathe(ad, profil, renk, x, y, z, opts) {
    const pts = profil.map(function (p) { return new THREE.Vector2(p[0], p[1]); });
    const geo = new THREE.LatheGeometry(pts, 20);
    geo.rotateZ(-Math.PI / 2);
    geo.translate(x, y, z);
    const m = mesh(geo, renk, opts || { metal: 0.25, rough: 0.5 });
    m.name = ad;
    m.material.side = THREE.DoubleSide;
    modelGroup.add(m);
    return m;
}
const NOZ_Y = YC(-7.2);
// Dış dilimler: gövde kesitinden (x −6.55) çıkışa (x −7.545) kadar.
lathe('nozul', [
    [0.590, 0.995], [0.560, 0.700], [0.505, 0.400], [0.452, 0.150],
    [0.428, 0.000], [0.437, -0.180], [0.455, -0.345]
], C_NOZUL, -7.20, NOZ_Y, 0, { metal: 0.55, rough: 0.35 });
// İç yüzey (koyu boğaz) — çıkıştan içeri.
lathe('nozul_ic', [
    [0.425, -0.345], [0.400, -0.170], [0.382, 0.020], [0.395, 0.260],
    [0.430, 0.520], [0.470, 0.800]
], C_KOYU, -7.20, NOZ_Y, 0, { metal: 0.2, rough: 0.85 });
// TÜRBİN DİSKİ: nozulun içinde, spin() grubunda. Uçağın tek dönen parçası;
// arkadan bakışta nozulun dibindeki ışıltıyı veriyor.
// ⚠️ 180 dev/dak gerçek türbin hızının çok altı. Motor rpm'i doğrudan açıya
// çeviriyor ve gerçek hızda disk her karede birkaç tur atıp stroboskop
// etkisiyle DURUYOR gibi görünüyor (bisiklet aynakolunda öğrenilen ders).
(function () {
    const tg = spin({ pivot: [-7.02, NOZ_Y, 0], axis: 'x', rpm: 180 });
    const P = [], IDX = [], n = 18, r1 = 0.085, r2 = 0.360;
    for (let i = 0; i < n; i++) {
        const a = i * Math.PI * 2 / n, c = Math.cos(a), s = Math.sin(a);
        const gen = 0.5 * Math.sin(0.60), der = 0.5 * Math.cos(0.60);
        const kose = [[-gen * 0.18, r1, -der * 0.18], [gen * 0.18, r1, der * 0.18],
                      [gen * 0.30, r2, der * 0.30], [-gen * 0.30, r2, -der * 0.30]];
        const t = P.length / 3;
        for (const k of kose) P.push(k[0], k[1] * c - k[2] * s, k[1] * s + k[2] * c);
        IDX.push(t, t + 1, t + 2, t, t + 2, t + 3);
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.Float32BufferAttribute(P, 3));
    geo.setIndex(IDX);
    geo.computeVertexNormals();
    const m = mesh(geo, C_TURBIN, { metal: 0.6, rough: 0.3, name: 'turbin' });
    m.material.side = THREE.DoubleSide;
    tg.add(m);
})();
// HAVA FRENİ: nozulun etrafında dört kanat (F-16'da iki üst iki alt).
// Kapalı hâlde bile kenarları okunuyor ve kuyruğu doldurmuş gösteriyor.
[[1, 1], [1, -1], [-1, 1], [-1, -1]].forEach(function (a, i) {
    const g = new THREE.BoxGeometry(0.86, 0.055, 0.52);
    g.translate(0, 0, 0);
    g.rotateX(a[1] * (a[0] > 0 ? 0.62 : -0.62) + (a[0] > 0 ? 0 : Math.PI));
    g.translate(-6.55, NOZ_Y + a[0] * 0.44, a[1] * 0.40);
    modelGroup.add(mesh(g, C_GOVDE, { metal: 0.22, rough: 0.7,
                                      name: 'hava_freni_' + (i + 1) }));
});

// ===========================================================================
// 14. İNİŞ TAKIMI
// ===========================================================================
// ⚠️ HEPSİ 'takim' ADLI TEK GRUPTA. Davranış irtifa eşiğinin üstünde bu
// grubun visible'ını false yapıyor. Yuvaları kapatan kapaklar da grubun
// içinde: takım kalkarken kapaklar da kalkmalı.
// ⚠️ TEKERLER GRUBUN İÇİNDE OLABİLİR çünkü _WHEELS.front YOK — motorun
// front mekanizması parçayı kendi steer grubuna taşıyor ve bunu yaparken
// inner.add(sg) diyor; o zaman takım gizlenince tekerler havada kalırdı.
//
// Üç noktalı takım, gerçek F-16 ölçüleriyle: iz 2.38 m, dingil arası
// 3.99 m, ana lastik 27.75 in (yarıçap 0.352), burun lastiği 18 in (0.229).
const takim = new THREE.Group();
takim.name = 'takim';
modelGroup.add(takim);

function tekerlek(ad, x, y, z, R, genislik) {
    const g = new THREE.Group();
    g.name = ad;
    g.position.set(x, y, z);
    g.rotation.x = Math.PI / 2;      // aks ±z'ye bakar; rotation.y motorun
    const et = R * 0.30;             // lastik kesiti (avcı lastiği yüksek yanaklı)
    const lastik = new THREE.TorusGeometry(R - et, et, 5, 14);
    lastik.rotateX(Math.PI / 2);
    lastik.scale(1, genislik / (et * 2), 1);
    g.add(mesh(lastik, C_LASTIK, { rough: 0.95, name: ad + '_lastik' }));
    const jant = mesh(new THREE.CylinderGeometry(R - et * 1.9, R - et * 1.9,
                                                 genislik * 0.92, 12),
                      C_JANT, { metal: 0.4, rough: 0.4, name: ad + '_jant' });
    g.add(jant);
    takim.add(g);
}

// ---- burun takımı ---------------------------------------------------------
// TEK teker (gerçek F-16 burun takımı tekli), bacak hafif öne eğik.
// ⚠️ Hava alığının HEMEN ARKASINDA: gerçekte de dudaktan 0.67 m geride
// (çizimden ölçüldü). Alığın önüne koysaydık motor kalkışta kendi
// tekerinin girdabını yutardı — ve daha önemlisi uçak F-16'ya benzemezdi.
(function () {
    const b = mesh(new THREE.CylinderGeometry(0.062, 0.075, 0.90, 9),
                   C_BACAK, { metal: 0.45, rough: 0.3, name: 'burun_bacak' });
    b.position.set(BURUN_X - 0.04, 0.68, 0);
    b.rotation.z = 0.07;
    takim.add(b);
    // makas (torsiyon kolu)
    const mk = mesh(new THREE.BoxGeometry(0.07, 0.32, 0.05), C_BACAK,
                    { metal: 0.4, rough: 0.35, name: 'burun_makas' });
    mk.position.set(BURUN_X + 0.13, 0.46, 0);
    mk.rotation.z = 0.55;
    takim.add(mk);
    const ak = mesh(new THREE.CylinderGeometry(0.045, 0.045, 0.28, 8), C_BACAK,
                    { metal: 0.45, rough: 0.3, name: 'burun_aks' });
    ak.rotation.x = Math.PI / 2;
    ak.position.set(BURUN_X, R_BURUN_T, 0);
    takim.add(ak);
    tekerlek('teker_on_1', BURUN_X, R_BURUN_T, 0, R_BURUN_T, 0.145);
    // Yuva kapakları: yuvanın iki yanında, alığın yanağına yatık.
    [1, -1].forEach(function (s, i) {
        // ⚠️ Alığın DIŞINDA: ilk kurulumda z ±0.36'daydı ve alığın (yarı
        // genişlik 0.58) içinde kalıp hiç görünmüyordu.
        // ⚠️ Kapak alığın ALT KÖŞESİNDE, yanında değil: z ±0.60'ta havada
        // duran bir levha gibi görünüyordu (bakis.py "yan" ve "on"). Alığın
        // o istasyondaki yarı genişliği 0.585, altı 0.905; kapak oraya
        // menteşelenip aşağı sarkıyor.
        const k = mesh(new THREE.BoxGeometry(0.90, 0.030, 0.24), C_KARIN,
                       { metal: 0.15, rough: 0.7, name: 'burun_kapak_' + (i + 1) });
        k.position.set(BURUN_X - 0.06, 0.845, s * 0.455);
        k.rotation.x = s * 0.95;
        takim.add(k);
    });
})();

// ---- ana takım ------------------------------------------------------------
// İki bacak, her birinde TEK teker. Bacak dışa doğru eğik (üstte ±0.62,
// akslarda ±1.19): gerçek F-16 ana takımı gövdenin altından çıkıp dışa açılır
// ve öne doğru toplanır.
const TAKIM_UST_Z = 0.62;
[1, -1].forEach(function (s, i) {
    const ust = 1.32, alt = R_TEKER;
    const dz = TAKIM_Z - TAKIM_UST_Z;
    const boy = Math.sqrt((ust - alt) * (ust - alt) + dz * dz);
    const b = mesh(new THREE.CylinderGeometry(0.070, 0.088, boy, 9), C_BACAK,
                   { metal: 0.45, rough: 0.3, name: 'ana_bacak_' + (i + 1) });
    b.position.set(TAKIM_X, (ust + alt) / 2, s * (TAKIM_UST_Z + TAKIM_Z) / 2);
    b.rotation.x = -s * Math.atan2(dz, ust - alt);
    takim.add(b);
    // yan destek (drag strut) — öne doğru
    const d = mesh(new THREE.CylinderGeometry(0.042, 0.042, 0.82, 7), C_BACAK,
                   { metal: 0.4, rough: 0.35, name: 'ana_destek_' + (i + 1) });
    d.position.set(TAKIM_X + 0.34, 0.86, s * 1.04);
    d.rotation.z = 0.80;
    takim.add(d);
    const ak = mesh(new THREE.CylinderGeometry(0.048, 0.048, 0.30, 8), C_BACAK,
                    { metal: 0.45, rough: 0.3, name: 'ana_aks_' + (i + 1) });
    ak.rotation.x = Math.PI / 2;
    // ⚠️ TEKER_KALDIR: rotasyon payı (yukarıdaki gerekçe). Aks da teker de
    // aynı miktarda kalkar; bacağın alt ucu 14 mm göbeğin (yarıçap 0.151)
    // içinde kalır, yani görünürde bir boşluk açılmaz.
    ak.position.set(TAKIM_X, R_TEKER + TEKER_KALDIR, s * TAKIM_Z);
    takim.add(ak);
    tekerlek('teker_arka_' + (i + 1), TAKIM_X, R_TEKER + TEKER_KALDIR, s * TAKIM_Z,
             R_TEKER, 0.222);
    // Yuva kapağı: gövdenin karnına yatık, iç kenarı gövdenin içinde.
    const k = mesh(new THREE.BoxGeometry(1.45, 0.04, 0.52), C_KARIN,
                   { metal: 0.15, rough: 0.7, name: 'ana_kapak_' + (i + 1) });
    k.position.set(TAKIM_X - 0.10, 1.00, s * 0.62);
    k.rotation.x = s * 0.42;
    takim.add(k);
});

// ===========================================================================
// 15. HARİCİ YÜK — kanat altı ve uç istasyonları
// ===========================================================================
// F-16'nın dokuz istasyonu var: altısı kanat altında, ikisi kanat ucunda,
// biri gövde altında. Model altı kanat altı + iki kanat ucu istasyonunu
// dolduruyor; gövde altı BOŞ bırakıldı (orada ana takım yuvası ve merkez
// pilon çakışıyor, ve gerçek görevlerde çoğu zaman boştur).
//
// ⚠️ HARİCİ YÜK BU MODELİN İŞİNİN YARISI. Tepe bakışında (haritanın ana
// bakışı) kanadın altındaki sekiz uzun cisim, uçağı hem yolcu uçağından hem
// de SİHA'dan tek bakışta ayırıyor: ikisinde de kanat altı BOŞ.
// Ölçüldü, `avci_siluet.py`: yükler kapatılınca tepe silüetinin alanı
// %__SILUET__ düşüyor.
function yukKur(ad, x, y, z, boy, cap, renk, ucRenk, kanat) {
    // gövde: lathe (burun konisi + silindir + kuyruk konisi)
    const r = cap / 2, b = boy / 2;
    lathe(ad, [
        [0.02, b], [r * 0.55, b - cap * 0.35], [r * 0.88, b - cap * 0.9],
        [r, b - cap * 1.7], [r, -b + cap * 1.3], [r * 0.86, -b + cap * 0.5],
        [r * 0.72, -b]
    ], renk, x, y, z, { metal: 0.3, rough: 0.55 });
    // burun başlığı (arayıcı / burun konisi) — koyu, gövdeden ayrı okunsun
    const bg = new THREE.SphereGeometry(r * 0.62, 9, 7);
    bg.scale(1.9, 1, 1);
    bg.translate(x + b - cap * 0.30, y, z);
    modelGroup.add(mesh(bg, ucRenk, { metal: 0.25, rough: 0.5,
                                      name: ad + '_burun' }));
    if (!kanat) return;
    // dört kuyruk kanatçığı (+ işareti): tek geometride, ayrı mesh değil
    const P = [], IDX = [], kx = -b + cap * 1.0, kl = kanat[0], kh = kanat[1];
    for (let i = 0; i < 4; i++) {
        const a = i * Math.PI / 2, c = Math.cos(a), s = Math.sin(a);
        const kose = [[kx, r * 0.85, 0], [kx + kl, r * 0.85, 0],
                      [kx + kl * 0.55, r * 0.85 + kh, 0], [kx, r * 0.85 + kh, 0]];
        const t = P.length / 3;
        for (const k of kose)
            P.push(x + k[0], y + k[1] * c - k[2] * s, z + k[1] * s + k[2] * c);
        IDX.push(t, t + 1, t + 2, t, t + 2, t + 3);
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.Float32BufferAttribute(P, 3));
    geo.setIndex(IDX);
    geo.computeVertexNormals();
    const m = mesh(geo, renk, { metal: 0.3, rough: 0.55, name: ad + '_kanatcik' });
    m.material.side = THREE.DoubleSide;
    m.castShadow = false;
    modelGroup.add(m);
}
// Kanadın o z'deki alt yüzeyi (pilon oraya oturacak).
function kanatAlt(z) {
    const K = kanatKesit(z), kiris = K.xle - K.te;
    // en kalın yerin (u≈0.3) alt yüzeyi
    return K.y + (profilKamber(0.3) - profilKalinlik(0.3, K.tc)) * kiris;
}
// [z, pilon x, yük boyu, yük çapı, gövde rengi, uç rengi, kanatçık, pilon boyu]
const ISTASYON = [
    [1.850, -1.25, 4.35, 0.600, C_YUK,  C_YUK_UC, [0.55, 0.30], 1.30],  // 370 gal yakıt tankı
    [2.850, -0.85, 3.33, 0.273, C_YUK,  C_YUK_UC, [0.42, 0.20], 1.00],  // güdümlü bomba
    [3.850, -1.55, 3.65, 0.178, C_FUZE, C_YUK_UC, [0.38, 0.16], 0.80]   // hava-hava füzesi
];
ISTASYON.forEach(function (S, k) {
    [1, -1].forEach(function (s, i) {
        const z = s * S[0], no = k * 2 + i + 1;
        const yAlt = kanatAlt(z);
        const yukY = yAlt - 0.30 - S[3] * 0.5;
        // PİLON: kanadın altına yükü bağlayan kısa kulak. Üst ucu kanadın
        // İÇİNDE (yoksa pilon havada durur, kanat kalınlığı 4-5 cm).
        loftKur('pilon_' + no, [
            { y: yAlt + 0.10, xle: S[1] + S[7] * 0.5, te: S[1] - S[7] * 0.5,
              tc: 0.13, z: z },
            { y: yAlt - 0.16, xle: S[1] + S[7] * 0.46, te: S[1] - S[7] * 0.46,
              tc: 0.12, z: z },
            { y: yukY + S[3] * 0.42, xle: S[1] + S[7] * 0.40,
              te: S[1] - S[7] * 0.40, tc: 0.11, z: z }
        ].map(duseyHalka), C_PILON, { metal: 0.25, rough: 0.55 });
        yukKur('yuk_' + no, S[1] + 0.15, yukY, z, S[2], S[3], S[4], S[5], S[6]);
    });
});

// ---- kanat ucu istasyonu --------------------------------------------------
// Fırlatma rampası + hava-hava füzesi. ⚠️ AÇIKLIK BURADAN GELİYOR:
// USAF kartı iki açıklık veriyor — "31.0 FEET (W/O MISSILES)" = 9.45 m ve
// "32.8 FEET W/MISSILES" = 10.00 m. Kanat paneli 9.45'te bitiyor; kalan
// 0.55 m'nin tamamı kanat ucu füzesinin kuyruk kanatçıklarına kadar olan
// mesafe. Yani kutunun z'si TAM 10.000 olmalı ve ölçüm bunun kanıtıdır.
// ⚠️ İlk kurulumda füze ekseni ±4.910'a, kanatçık yüksekliği 0.16'ya
// yazılmıştı ve ÖLÇÜLEN kutu 10.291 çıktı (%2.9 fazla). Kanatçık ucu
// eksenden r·0.85 + kh kadar dışarıda; eksen ±4.790'a çekilip kh 0.134'e
// indirilerek dış nokta 5.000'e oturtuldu. Gerçek AIM-120'nin kuyruk
// kanatçık açıklığı 0.447 m, buradaki 0.419 — %6 fark, 15 metrelik bir
// uçakta 1.4 santim.
[1, -1].forEach(function (s, i) {
    const z = s * YARI_ACIK, no = i + 1;
    // rampa: kanadın ucunun üstüne oturan ince kutu (LAU-129 fırlatma rayı)
    const rg = new THREE.BoxGeometry(1.95, 0.11, 0.13);
    rg.translate(-2.35, KANAT_Y + 0.09, z + s * 0.045);
    modelGroup.add(mesh(rg, C_PILON, { metal: 0.3, rough: 0.5,
                                       name: 'uc_rampa_' + no }));
    // füze: burnu kanat ucu hücum kenarının 2.6 m önünde, kuyruğu firar
    // kenarının hizasında (gerçek AIM-120 yerleşimi).
    yukKur('uc_fuze_' + no, -1.52, KANAT_Y + 0.245, z + s * 0.065,
           3.65, 0.178, C_FUZE, C_YUK_UC, [0.38, 0.134]);
});

// ===========================================================================
// 16. KÜÇÜK PARÇALAR
// ===========================================================================
// TOP AĞZI: kokpitin SOL tarafında, strake'in kökünde. M61 Vulcan'ın namlu
// ağzı gerçekten oradadır ve F-16'nın simetrisini bozan tek dış işarettir.
(function () {
    // ⚠️ z gövdenin O İSTASYONDAKİ yarı genişliğinden hesaplanıyor, sabit
    // yazılmıyor: sabit 0.545 yazılmıştı ve R_Z(3.62)=0.626 olduğu için top
    // ağzı gövdenin İÇİNDE kalıyordu.
    const g = new THREE.CylinderGeometry(0.075, 0.075, 0.10, 8);
    g.rotateZ(Math.PI / 2);
    g.translate(3.62, 2.20, R_Z(3.62) - 0.015);
    modelGroup.add(mesh(g, C_KOYU, { metal: 0.3, rough: 0.7, name: 'top_agzi' }));
    // ---- DAVRANIŞIN OKUDUĞU AĞIZ NOKTASI (ateş efekti) --------------------
    // ⚠️ Motor ateş alevini `getObjectByName('namlu')`dan çıkarıyor; bu
    // modelde 'namlu' adlı parça YOK, o yüzden yedek dala düşüyor:
    // `box.max.x`, yani UÇAĞIN BURNU (model x = +7.545, y = 2.802). Gerçek
    // ağız 3.875 m GERİDE ve 0.608 m AŞAĞIDA — ölçüldü (ates_kesif.py).
    // Davranış alevi buraya oturtuyor. TEK KAYNAK burası: sayı
    // studio-3d.js'e kopyalanmıyor, R_Z ile birlikte buradan türüyor.
    modelGroup.userData.avciTop = {
        x: 3.62 + 0.05,              // silindirin +x ucu (namlu ağzı)
        y: 2.20,
        z: R_Z(3.62) - 0.015,
        r: 0.075                     // ağız yarıçapı (alev ölçeği için)
    };
})();
// YAKIT ALMA KAPAĞI: sırtta, kanopinin hemen arkasında koyu bir dikdörtgen.
yuzeyYama('yakit_kapak', [
    [0.95, 1.55, -0.055, 0.055]
], 3, 3, 0.010, C_KOYU, { metal: 0.2, rough: 0.8 });
// SIRT ANTENLERİ: iki bıçak anten (biri sırtta, biri karında).
// ⚠️ Karın anteni x −3.30'da: ilk kurulumda 0.10'daydı ve hava alığının
// (x −2.90..2.77) tam İÇİNDE kalıyordu, hiç görünmüyordu.
[[-2.40, 1], [-3.30, -1]].forEach(function (a, i) {
    const x = a[0], yon = a[1];
    const sh = new THREE.Shape();
    sh.moveTo(-0.17, 0); sh.lineTo(0.15, 0); sh.lineTo(0.06, 0.17);
    sh.lineTo(-0.10, 0.15); sh.closePath();
    const g = new THREE.ExtrudeGeometry(sh, { depth: 0.03, bevelEnabled: false });
    g.translate(0, 0, -0.015);
    if (yon < 0) g.rotateX(Math.PI);
    g.translate(x, yon > 0 ? YC(x) + R_Y(x) - 0.02 : YC(x) - R_Y(x) + 0.02, 0);
    modelGroup.add(mesh(g, C_KARIN, { metal: 0.25, rough: 0.55,
                                      name: 'anten_' + (i + 1) }));
});
// PİTO / HÜCUM AÇISI SENSÖRLERİ: radomun iki yanında küçük koniler. Uzun
// burun çubuğu MODELLENMEDİ (gerekçe §0), bunlar 12 cm.
[1, -1].forEach(function (s, i) {
    const g = new THREE.ConeGeometry(0.030, 0.12, 7);
    g.rotateZ(Math.PI / 2);
    g.translate(6.32, 1.90, s * (R_Z(6.32) + 0.04));
    modelGroup.add(mesh(g, C_KOYU, { metal: 0.35, rough: 0.4,
                                     name: 'hucum_sensor_' + (i + 1) }));
});
// ÇARPIŞMA IŞIĞI: dikey stabilizenin firar kenarında ve karında.
[[-7.35, 4.60, C_KIRMIZI], [-3.60, _ALT(-3.60) + 0.02, '#c9ccd0']].forEach(function (a, i) {
    const g = new THREE.SphereGeometry(0.055, 7, 5);
    g.scale(1.2, 1.0, 0.9);
    g.translate(a[0], a[1], 0);
    modelGroup.add(mesh(g, a[2], { metal: 0.1, rough: 0.35,
                                   name: 'isik_' + (i + 1) }));
});
