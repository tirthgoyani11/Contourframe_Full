// Kadırga — 16. yüzyıl Akdeniz kürekli savaş gemisi (Lepanto sınıfı kadırga).
// Historical Warfare temasının deniz aracı.
//
// ÖLÇÜLERİN KAYNAĞI (ezberden DEĞİL; hangi sayı nereden geldiği tek tek yazılı)
// ---------------------------------------------------------------------------
// [K1] Wikipedia "Galley" makalesinin Lepanto bölümü (arşiv kopyası
//      en-academic.com/dic.nsf/enwiki/924749), STANDART savaş kadırgası:
//        "42 m long and 5.1 m wide (6.7 m with the rowing frame), had a
//         draught of 1.7 m and a freeboard of 1.0 m, and weighed empty
//         about 140 tons"
//        "24 rowing benches on each side, with three rowers to a bench"
//        "one 50-pound cannon or a 32-pound culverin at the bow as well as
//         four lighter cannons and four swivel guns"
//      -> BOY 42.0 · EN 5.10 · APOSTİS ÜZERİNDEN 6.70 · SU ÇEKİMİ 1.70 ·
//         FREEBOARD 1.00 · 24 KÜREK/BORDA · BAŞ TOPU + yan toplar + prangılar.
// [K2] en.wikipedia.org/wiki/Tarihi_Kadırga — İstanbul Deniz Müzesi'ndeki,
//      dünyada ayakta kalan TEK kadırga (16. yy sonu / 17. yy başı):
//        boy 39.64 m · en 5.72 m · "24 pairs of oars" · "144 oarsmen"
//      -> 144/48 = kürek başına ÜÇ kürekçi, yani "a scaloccio" düzeni:
//         bank başına ÜÇ ADAM TEK KÜREK. Modeldeki 24+24 kürek buradan.
//      ⚠️ Tarihi Kadırga'nın kendisi SALTANAT KAYIĞI (kaynakta "top
//         mevzii ve savaşçı oturağı yok"), o yüzden ÖLÇÜ değil DÜZEN
//         kaynağı olarak kullanıldı; boyutlar [K1]'den.
// [K3] Kürek boyu: "a scaloccio" düzeninde BEŞ kürekçilik bir küreğin
//      rekonstrüksiyonu 12 m / 130 kg (academia.edu, "Rowing a scaloccio"
//      üzerinden aktarılan ölçü). ÜÇ kürekçilik kürek daha kısa; buradaki
//      8.80 m TÜRETİLMİŞTİR (aşağıda §6'da geometrik gerekçesi var), o
//      kaynaktan alınmadı. Ayrımı bilerek yazıyorum.
// [K4] Direk/seren yüksekliği KAYNAKTAN DEĞİL, oranla seçildi (§9) —
//      iddia edilmiyor, türetildiği yazılıyor.
//
// MODELDE 1 birim = 1 GERÇEK METRE.
// YÖN: pruva +x, üst +y, taban y=0 (OMURGA). Su hattı y=1.70.
// Tekne 36.6 m (kıç aynası x=-21.0 -> baş bodoslama x=+15.6); mahmuzla
// birlikte tam boy 42.0 m — [K1]'in "42 m long"u BOYDAN BOYA ölçüdür.
//
// ===========================================================================
// FIRKATEYN VE YOLCU GEMİSİNDEN NEREDE AYRIŞIYOR (tepeden karışmama şartı)
// ===========================================================================
// Dün ölçüldü ve dürüstçe raporlandı: fırkateyn 0.14 en-boy / 0.920 doluluk,
// yolcu gemisi 0.16 / 0.931 — bu iki sayı ikisini AYIRMIYOR, ikisi de tekne.
// Kadırga onlardan ÜÇ ölçülebilir şeyle ayrılıyor:
//   1. GÖVDE NARİNLİĞİ. 42.0 / 5.10 = 8.24. Fırkateyn 113.2/14.40 = 7.86,
//      kruvaziyer 160/24.0 = 6.67. Kütüphanedeki EN NARİN tekne bu.
//   2. KÜREKLER — asıl imza. Kürek ucu bordadan 5.8 m dışarı taşıyor;
//      tepeden bakışta gövdenin iki yanında 8'er dişli bir TARAK var
//      (2026-09-04'e kadar 24'er dişliydi; sayı görsel kararla üçte bire
//      indirildi, gerekçesi §1'de N_KUREK'in yanında). Tam modelin kutusu
//      bu yüzden 42.0 x ~18.3, yani narin tekne GENİŞ bir kürek
//      yelpazesinin içinde duruyor — KUTU DEĞİŞMEDİ, çünkü kürek bölgesi
//      ve kürek boyu aynı kaldı, yalnız diş SAYISI azalıp dişler
//      KALINLAŞTI. Fırkateynde ve kruvaziyerde gövdenin dışında HİÇBİR ŞEY
//      yok; ayrım tek bakışta okunuyor.
//   3. SİLUET DOLULUĞU. Ötekiler dolu birer levha (0.92-0.93); kadırganın
//      silueti ince bir çizgi + boşluklu tarak, doluluğu çok daha düşük.
// Ayrıca renk/yapı deseni de karşılıklı: ötekiler gri/beyaz çelik, bu
// AHŞAP; ötekilerde üst yapı kütlesi var, burada güverte BOŞ ve ortada tek
// bir yürüme yolu (corsia) ile 16 kürekçi bankı görünüyor (bank sayısı
// kürek sayısına BAĞLI: her küreğin bir bankı var; 24'ten 8'e inince
// banklar da 48'den 16'ya indi — banksız kürek ya küreksiz bank olmasın).
//
// ===========================================================================
// PARÇALAR (Studio3D bu adları arar, DEĞİŞTİRME)
// ===========================================================================
//   govde, mahmuz, mahmuz_ucu, kic_kosk, kic_perde, rambade, corsia,
//   dumen, dumen_yeke, direk, seren_alt, seren_ust   -> BİRİNCİL renk (tekne)
//   kalkan_1/2, kupeste_1/2                          -> İKİNCİL renk ('Shields')
//   kurek_1/2, pala_1/2                              -> KÜREK ANİMASYONU
//   taret, taret_ust, namlu, namlu_agiz              -> _TURRETS grubu
// ⚠️ AYNI ADLI İKİ MESH YAPMA: _applyTint getObjectByName kullanıyor,
//    yalnız İLKİ renk alır. Kürekte bu tuzağa düşmek çok kolay olurdu —
//    bu yüzden bir bordadaki BÜTÜN kürekler TEK mesh'te birleşti (§6).
//    Sayı 24'ten 8'e inince de tek mesh KALDI (kural sayıdan bağımsız).

// ===========================================================================
// 0. RENKLER
// ===========================================================================
// ⚠️ YATAY YÜZEY DÜŞEY YÜZEYDEN KOYU. Haritanın ana bakışı tepeden,
// motorun ışığı yukarıdan. Güverte ve corsia bilerek borda ahşabından koyu.
// ⚠️ metalness 0.85+ neredeyse SİYAH (environment map yok); ama metalness'i
// DÜŞÜRMEK açık renkte patlamayı ARTIRIYOR (difüz = albedo x (1-metalness)).
// Ahşapta 0.02-0.10, demirde 0.35-0.45.
const C_TEKNE   = '#6d4a31';   // borda ahşabı (BİRİNCİL renk varsayılanı)
const C_GUVERTE = '#4a3524';   // güverte + corsia (YATAY, koyu)
const C_KATRAN  = '#2b2320';   // su altı katranı
const C_SU_HAT  = '#3b302a';   // su hattı bandı
const C_KUSAK   = '#523622';   // kuşak (wale) — bordadaki koyu kalın kirişler
const C_KALKAN  = '#8c3b34';   // kalkan sırası (İKİNCİL renk varsayılanı)
const C_KUREK   = '#9a8259';   // kürek loması (açık ahşap — tepeden okunsun)
const C_PALA    = '#b09468';   // kürek palası (bir tık daha açık)
const C_YELKEN  = '#a9a08d';   // latin yelken
// ⚠️ #d8d2c4 DENENDİ VE BIRAKILDI: yelken modelin en büyük tek yüzeyi ve
// tepeden bakışta motorun ışığını dik alıyor. Palet taraması (§ raporda)
// bu sabitle tam beyaz piksellerin çoğunun tek başına yelkenden geldiğini
// gösterdi; motokaravan (#d5d1c6) ve uçak (#e8eaed) ile aynı desen.
const C_HALAT   = '#7b6b4e';   // halat
const C_DEMIR   = '#454a50';   // demir teçhizat
const DEMIR_MAL = { metal: 0.40, rough: 0.42 };
const C_TUNC    = '#8a6b3a';   // tunç top namlusu
const C_ALTIN   = '#a8874a';   // kıç köşkü süslemesi + fener
// ⚠️ C_KOPUK ('#8b939c') KALDIRILDI — köpük şeridinin kendisi kaldırıldı,
//    gerekçesi ve ölçümü §8'de. Bu modelinki kütüphanedeki en parlakıydı:
//    360 görünür pikselin 340'ı L>=230, ortalama luma 234.0.
const C_BAYRAK  = '#8f2f2f';   // sancak

// ===========================================================================
// 1. TEMEL ÖLÇÜLER (hepsi gerçek metre, kaynak yukarıda)
// ===========================================================================
const UZUN     = 21.00;   // yarı boy -> tam boy 42.0 m [K1]
const TEKNE_ON = 15.60;   // baş bodoslamanın en ön noktası
const KIC      = -21.00;  // kıç aynası
const YARI_EN  =  2.55;   // kuşakta yarı genişlik -> 5.10 m [K1]
const APOSTIS  =  3.35;   // kürek çemberi yarı genişliği -> 6.70 m [K1]
const SU       =  1.70;   // su çekimi [K1]
const KUP_ORTA =  2.70;   // orta gövdede küpeşte kotu (freeboard 1.00) [K1]
const KUREK_Y  =  3.05;   // iskarmoz (kürek dönme noktası) yüksekliği
// ⚠️ KÜREK SAYISI: KAYNAK 24, MODELDE 8 — BİLEREK VE GÖRSEL KARARLA.
// [K1] "24 rowing benches on each side" ve [K2] "24 pairs of oars" diyor;
// model önce öyle kuruldu ve tarihsel doğrusu odur. Ama 24+24 kürek tepeden
// bakışta OKUNMAYI BOZUYOR: 1.10 m aralıkta 0.44 m'lik palalar birbirine
// girip tarağı gri bir şeride çeviriyor, tek tek kürek seçilemiyor.
// Ölçüt burada OKUNABİLİRLİK, kaynağa sadakat DEĞİL ("doğru gözükmeleri,
// iyi gözüktükleri anlamına gelmiyor" — 2026-09-04). Sayı ÜÇTE BİRE indi.
// GERÇEĞİ 24'TÜ; GÖRSEL KARAR 8. Bu satır o ayrımı saklamasın diye burada.
const N_KUREK  = 8;       // borda başına kürek — GÖRSEL karar (kaynak: 24)
const KUREK_X0 = -13.40;  // en kıçtaki küreğin iskarmoz x'i
// KÜREK BÖLGESİ DEĞİŞMEDİ: kıç köşkü x=-13.9'da bitiyor, rambade x=+12.2'de
// başlıyor -> kürek bölgesi 25.30 m; ilk iskarmoz -13.40, son iskarmoz
// +11.90. Kürekler bu bölgeye EŞİT yayılıyor, kümelenmiyor.
// İNTERSKALMİO artık sayıdan TÜRETİLİYOR (elle yazılmıyor ki sayı
// değişince aralık geride kalmasın):
//    24 kürek -> 25.30 / 23 = 1.10 m   (eski, kaynağa sadık)
//     8 kürek -> 25.30 /  7 = 3.6143 m (bugünkü, görsel)
// Not: 3.61 m gerçek bir kadırganın interskalmiosu DEĞİLDİR (~1.2 m'dir);
// bu sayı bir tarih iddiası değil, sekiz küreğin eşit dağılımıdır.
const KUREK_BOLGE = 25.30;                     // kürek bölgesinin boyu
const KUREK_DX = KUREK_BOLGE / (N_KUREK - 1);  // interskalmio (türetilmiş)
const RAMB_X   = 13.60;   // baş topunun dönme ekseni (_TURRETS pivotu)
const KOSK_X1  = -20.40;  // kıç köşkü arka sınırı
const KOSK_X2  = -13.90;  // kıç köşkü ön sınırı
const KOSK_Y   =   4.42;  // kıç köşkü güvertesi (DÜZ, sheer'in üstünde)

// ===========================================================================
// 2. MONOTON KÜBİK EĞRİ (PCHIP)
// ===========================================================================
// otomobil.js / firkateyn.js'ten. Catmull-Rom BIRAKILMIŞTI: eğim çok değişen
// yerlerde taşma yapıp çizgiyi komşusunun üstüne tümsek attırıyor. Burada
// kritik: baş bölgesinde yarı genişlik 5 metrede 2.44'ten 0.10'a iniyor,
// taşan bir eğri tekneyi dışa şişirir ve "5.10 m genişlik" iddiası yalan olur.
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

// ---- teknenin uzunlamasına çizgileri --------------------------------------
// KUŞAK YARI GENİŞLİĞİ — kesitin EN GENİŞ noktası, yani [K1]'in "5.1 m wide"
// ölçüsünü tanımlayan eğri (tepe 2.55). Fırkateynde bu çizgi su hattının
// üstündeki KIRIM HATTI (knuckle) idi; kadırgada gerçek yapı elemanı olan
// KUŞAK (wale) — küpeştenin 0.45 m altındaki kalın boyuna kiriş.
const W_KUS = egriYap([
    [-21.0, 1.62], [-19.5, 2.02], [-17.5, 2.31], [-15.0, 2.46],
    [-11.0, 2.54], [ -4.0, 2.55], [  2.0, 2.54], [  6.0, 2.46],
    [  9.0, 2.26], [ 11.5, 1.92], [ 13.2, 1.48], [ 14.6, 0.86],
    [ 15.6, 0.22]
]);
// KUŞAK YÜKSEKLİĞİ — küpeştenin 0.45 m altı, sheer'i izliyor.
const Y_KUS = egriYap([
    [-21.0, 3.85], [-18.0, 3.10], [-14.0, 2.55], [ -8.0, 2.33],
    [  0.0, 2.25], [  6.0, 2.35], [ 10.0, 2.60], [ 13.0, 3.00],
    [ 15.6, 3.60]
]);
// KÜPEŞTE (SHEER) YÜKSEKLİĞİ. Ortada 2.70 = su hattının 1.00 m üstü,
// yani [K1]'in freeboard'u. Kıçta 4.30'a, başta 4.05'e çıkıyor: alçak
// freeboard kadırganın en tanıdık yan çizgisi, iki ucun yükselmesi de öyle.
const Y_KUP = egriYap([
    [-21.0, 4.30], [-18.0, 3.55], [-14.0, 3.00], [ -8.0, 2.78],
    [  0.0, 2.70], [  6.0, 2.80], [ 10.0, 3.05], [ 13.0, 3.45],
    [ 15.6, 4.05]
]);
// TUMBLEHOME — küpeştenin kuşaktan ne kadar içeride olduğu. Kadırgada
// FIRKATEYNDEKİNDEN ÇOK KÜÇÜK (orada orta gövdede 1.00 m / 13 derece):
// burada 0.18 m / 0.45 m yükseklikte, yani ~21 derece ama yalnız son 45
// santimde. Gerekçe: kürek bordadan çıkacak, borda dışa taşamaz.
const TUMBLE = egriYap([
    [-21.0, 0.10], [-14.0, 0.17], [ -4.0, 0.18], [  6.0, 0.18],
    [ 11.0, 0.14], [ 14.0, 0.06], [ 15.6, 0.02]
]);
// OMURGA (kesitin en alt noktası). Ortada 0 = modelin tabanı.
// ⚠️ BAŞ BODOSLAMA BURADAN ÇIKIYOR, ayrı parça YOK. Su hattı y=1.70'e
// varan x ikili aramayla çözülüyor (aşağıda ölçülüp yorumda yazıldı).
const Y_OMURGA = egriYap([
    [-21.0, 2.30], [-19.5, 1.42], [-17.5, 0.72], [-15.0, 0.28],
    [-11.0, 0.05], [ -4.0, 0.00], [  4.0, 0.00], [  8.0, 0.09],
    [ 11.0, 0.38], [ 13.0, 0.88], [ 14.4, 1.62], [ 15.2, 2.55],
    [ 15.6, 3.30]
]);
// DÜZ DİP YARI GENİŞLİĞİ. Kadırga çok sığdır (omurgadan küpeşteye 2.70 m,
// yarı genişlik 2.55) — kesit bu yüzden GENİŞ ve YAYVAN, dip neredeyse düz.
const W_DIP = egriYap([
    [-21.0, 0.42], [-18.0, 0.86], [-14.0, 1.28], [ -8.0, 1.52],
    [  0.0, 1.56], [  6.0, 1.34], [ 10.0, 0.88], [ 13.0, 0.34],
    [ 15.6, 0.05]
]);
// SİNTİNE KIVRIMININ Bezier denetim noktaları (dip -> kuşak).
// ⚠️ SÜPER-ELİPS BIRAKILMIŞTI (yolcu-gemisi §2, firkateyn §3): sin/cos
// üssüyle yazılan çeyrek HER ZAMAN dışbükey çıkıyor, baştaki DÜZ V kenarı
// üretilemiyor. Kuadratik Bezier'de kz≈ky -> düz V, kz büyük + ky küçük ->
// yuvarlak sintine. Kadırgada orta gövde yuvarlak-yayvan (kz 0.88 / ky 0.24),
// baş bölgesi keskin V (kz≈ky≈0.52) — hızlı ve narin bir tekne bu.
const KZ = egriYap([
    [-21.0, 0.78], [-14.0, 0.86], [  0.0, 0.88], [  8.0, 0.78],
    [ 12.0, 0.62], [ 15.6, 0.52]
]);
const KY = egriYap([
    [-21.0, 0.20], [-14.0, 0.22], [  0.0, 0.24], [  8.0, 0.34],
    [ 12.0, 0.46], [ 15.6, 0.52]
]);
// KÜPEŞTE YARI GENİŞLİĞİ = kuşak - tumblehome.
function W_KUP(x) { return Math.max(0.04, W_KUS(x) - TUMBLE(x)); }

// ⚠️ `G_KOPUK` (köpüğün kuşaktan dışarı taşma eğrisi) KALDIRILDI.
// Köpük şeridinin kendisi kaldırıldığı için tek kullanıcısı kalmadı;
// gerekçe ve ölçüm §8'de. Geri getirilecekse eski değerler:
//   [-20.5,0.34] [-18,0.22] [-15,0.08] [-12,0.00] [8,0.00]
//   [11,0.18] [13,0.48] [14.4,0.62] [15.3,0.30] [15.6,0.06]
// ⚠️ O eğri yazılırken ölçülmüş kısıt hâlâ geçerlidir: toplam
// (W_KUS + taşma) 2.55'i AŞMAMALI, aşarsa "genişlik 5.10 m" iddiası yalan
// olur. (Kutunun z'sini kürekler belirliyor ama TEKNE genişliği ayrıca
// ölçülüp raporlanıyor.)

// ===========================================================================
// 3. KESİT
// ===========================================================================
// Üç bölüm:
//   A [0 .. VA]   düz dip
//   B [VA .. VB]  sintine kıvrımı (Bezier), dipten KUŞAĞA
//   C [VB .. 1]   kuşaktan küpeşteye DÜZ tumblehome
// ⚠️ VB fırkateyndekinden BÜYÜK (0.50 vs 0.42): kadırganın kesitinin
// neredeyse tamamı sintine kıvrımıdır (derinlik 2.70, yarı genişlik 2.55),
// üstteki düz parça yalnız 0.45 m. Örnekleri oraya vermek gerekiyor.
const VA = 0.10, VB = 0.50;

function kesitPar(x) {
    const yK = Y_OMURGA(x);
    const yS = Math.max(yK + 0.05, Y_KUS(x));
    const yD = Math.max(yS + 0.04, Y_KUP(x));
    const wS = W_KUS(x);
    const wD = Math.max(0.04, wS - TUMBLE(x));
    // Düz dip kuşaktan dar olmak zorunda, yoksa kesit kendi içine döner.
    const wK = Math.min(W_DIP(x), wS * 0.90);
    return { yK: yK, yS: yS, yD: yD, wK: wK, wS: wS, wD: wD,
             kz: KZ(x), ky: KY(x) };
}

// Yarı kesitin v parametresindeki noktası -> [z, y]. y, v ile MONOTON
// artıyor; vYukseklik'in ikili araması buna dayanıyor.
function kesitNokta(P, v) {
    if (v <= VA) return [P.wK * (v / VA), P.yK];
    if (v <= VB) {
        const t = (v - VA) / (VB - VA), u = 1 - t;
        const cz = P.wK + (P.wS - P.wK) * P.kz;
        const cy = P.yK + (P.yS - P.yK) * P.ky;
        return [u * u * P.wK + 2 * u * t * cz + t * t * P.wS,
                u * u * P.yK + 2 * u * t * cy + t * t * P.yS];
    }
    const t = (v - VB) / (1 - VB);
    return [P.wS + (P.wD - P.wS) * t, P.yS + (P.yD - P.yS) * t];
}

// Yüzey noktası. w in [-1,1]: |w| = v, işaret hangi borda.
// ⚠️ ŞERİTLER BU PARAMETREYLE YAZILIYOR, "y" ile değil (otobüste ön cam
// köşe bandı sabit y ile yazıldığı için kavisin içine girip yırtılmıştı).
function nokta3(x, w) {
    const p = kesitNokta(kesitPar(x), Math.abs(w));
    return [x, p[1], (w < 0 ? -p[0] : p[0])];
}

// Sayısal yüzey normali (dışa bakar).
function normal3(x, w) {
    const h = 0.02;
    const hx = (x > TEKNE_ON - 0.05) ? -h : h;
    const hw = (Math.abs(w) > 0.99) ? -h : h;
    const a = nokta3(x, w), b = nokta3(x + hx, w), c = nokta3(x, w + hw);
    const ux = b[0] - a[0], uy = b[1] - a[1], uz = b[2] - a[2];
    const vx = c[0] - a[0], vy = c[1] - a[1], vz = c[2] - a[2];
    let nx = uy * vz - uz * vy, ny = uz * vx - ux * vz, nz = ux * vy - uy * vx;
    const L = Math.sqrt(nx * nx + ny * ny + nz * nz) || 1;
    nx /= L; ny /= L; nz /= L;
    const P = kesitPar(x), yc = (P.yK + P.yD) / 2;
    if (ny * (a[1] - yc) + nz * a[2] < 0) { nx = -nx; ny = -ny; nz = -nz; }
    return [nx, ny, nz];
}

// Verilen yükseklikteki v (y, v ile monoton arttığı için ikili arama).
function vYukseklik(x, y) {
    const P = kesitPar(x);
    let a = 0, b = 1;
    for (let i = 0; i < 26; i++) {
        const m = (a + b) / 2;
        if (kesitNokta(P, m)[1] < y) a = m; else b = m;
    }
    return (a + b) / 2;
}

// ===========================================================================
// 4. TEKNE KABUĞU (loft)
// ===========================================================================
// ⚠️ ÜÇGENİ TEKNEYE VER, detay parçasına değil (fırkateynde ölçülmüştü).
// Modelin görülen yüzeyinin çoğu tekne kabuğu; ayrıca kadırganın kimliği
// olan "iğne gibi ince gövde" ancak yeterli kesit çözünürlüğünde okunuyor.
const NV = 17;    // yarı kesitteki örnek sayısı
const ND = 5;     // güverte geçişinin bölüntüsü
const R_HALKA = 2 * NV + ND - 2;   // 37

// İstasyonlar baş ve kıçta SIK, orta gövdede seyrek.
const IST = [
    -21.0, -20.5, -19.9, -19.2, -18.4, -17.5, -16.5, -15.4, -14.2,
    -12.8, -11.2,  -9.4,  -7.4,  -5.2,  -2.8,  -0.2,   2.4,   4.8,
      6.9,   8.6,  10.0,  11.1,  12.0,  12.7,  13.3,  13.8,  14.2,
     14.55, 14.85, 15.10, 15.30, 15.46, 15.60
];

function halka(x) {
    const P = kesitPar(x), yarim = [];
    for (let i = 0; i < NV; i++) yarim.push(kesitNokta(P, i / (NV - 1)));
    // 0 = omurga orta hattı -> +z bordası yukarı -> küpeşte -> güverte
    // üstünden karşıya -> -z bordası aşağı. Kapalı halka, kutup yok.
    // Güverte KAPALI: tepeden bakışta teknenin içi görünmesin diye.
    const r = [];
    for (let i = 0; i < NV; i++) r.push([yarim[i][1], yarim[i][0]]);
    for (let j = 1; j < ND; j++) r.push([P.yD, P.wD - 2 * P.wD * j / ND]);
    for (let i = NV - 1; i >= 1; i--) r.push([yarim[i][1], -yarim[i][0]]);
    return r;
}

(function tekneKur() {
    const P = [], IDX = [];
    for (let i = 0; i < IST.length; i++) {
        const h = halka(IST[i]);
        for (let j = 0; j < R_HALKA; j++) P.push(IST[i], h[j][0], h[j][1]);
    }
    for (let i = 0; i < IST.length - 1; i++) {
        for (let j = 0; j < R_HALKA; j++) {
            const j2 = (j + 1) % R_HALKA;
            const a = i * R_HALKA + j, b = i * R_HALKA + j2;
            const c = (i + 1) * R_HALKA + j, d = (i + 1) * R_HALKA + j2;
            IDX.push(a, c, d, a, d, b);
        }
    }
    // Baş ve kıç kapağı: düz üçgen yelpaze. Halka köşeleri KOPYALANIYOR ki
    // computeVertexNormals kapağın normalini bordanınkiyle ortalamasın —
    // kadırganın kıç aynası (transom) KESKİN kesiktir.
    function kapak(ist, onYuz) {
        const h = halka(ist);
        let ym = 0;
        for (const p of h) ym += p[0];
        ym /= h.length;
        const merkez = P.length / 3;
        P.push(ist, ym, 0);
        const bas = merkez + 1;
        for (let j = 0; j < R_HALKA; j++) P.push(ist, h[j][0], h[j][1]);
        for (let j = 0; j < R_HALKA; j++) {
            const a = bas + j, b = bas + (j + 1) % R_HALKA;
            if (onYuz) IDX.push(merkez, b, a); else IDX.push(merkez, a, b);
        }
    }
    kapak(IST[IST.length - 1], true);
    kapak(IST[0], false);

    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.Float32BufferAttribute(P, 3));
    geo.setIndex(IDX);
    geo.computeVertexNormals();
    // Katranlı ahşap: mat.
    modelGroup.add(mesh(geo, C_TEKNE, { metal: 0.04, rough: 0.78, name: 'govde' }));
})();

// ===========================================================================
// 5. GENEL YARDIMCILAR
// ===========================================================================
// ---- 5a. KUTU YIĞINI: çok sayıda küçük kutuyu TEK mesh'te toplar --------
// Mesh sayısı ekonomisi ve "aynı adlı mesh" tuzağının kökten çözümü.
const KUTU_YUZ = [[4, 5, 6], [4, 6, 7], [1, 0, 3], [1, 3, 2],
                  [1, 2, 6], [1, 6, 5], [0, 4, 7], [0, 7, 3],
                  [7, 6, 2], [7, 2, 3], [0, 1, 5], [0, 5, 4]];
function kutuGeo(kutular) {
    const P = [], IDX = [];
    for (const b of kutular) {
        const hx = b[3] / 2, hy = b[4] / 2, hz = b[5] / 2;
        const v = [[-hx, -hy, -hz], [hx, -hy, -hz], [hx, hy, -hz], [-hx, hy, -hz],
                   [-hx, -hy,  hz], [hx, -hy,  hz], [hx, hy,  hz], [-hx, hy,  hz]];
        const t = P.length / 3;
        for (const q of v) P.push(b[0] + q[0], b[1] + q[1], b[2] + q[2]);
        for (const f of KUTU_YUZ) IDX.push(t + f[0], t + f[1], t + f[2]);
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.Float32BufferAttribute(P, 3));
    g.setIndex(IDX);
    g.computeVertexNormals();
    return g;
}
function kutular(ad, liste, renk, opts) {
    opts = opts || {};
    const m = mesh(kutuGeo(liste), renk, {
        flat: opts.flat !== false,
        rough: opts.rough == null ? 0.76 : opts.rough,
        metal: opts.metal == null ? 0.05 : opts.metal, name: ad });
    modelGroup.add(m);
    return m;
}

// ---- 5b. EĞİK KUTU YIĞINI (yaw + pitch ile) -----------------------------
// Banklar corsia'dan apostise EĞİK uzanıyor; kürek yatakları da öyle.
function egikKutu(P, IDX, mx, my, mz, sx, sy, sz, yaw, pitch) {
    const cy = Math.cos(yaw), sy2 = Math.sin(yaw);
    const cp = Math.cos(pitch), sp = Math.sin(pitch);
    const hx = sx / 2, hy = sy / 2, hz = sz / 2;
    const v = [[-hx, -hy, -hz], [hx, -hy, -hz], [hx, hy, -hz], [-hx, hy, -hz],
               [-hx, -hy,  hz], [hx, -hy,  hz], [hx, hy,  hz], [-hx, hy,  hz]];
    const t = P.length / 3;
    for (const q of v) {
        // önce pitch (z ekseni), sonra yaw (y ekseni)
        const ax = q[0] * cp - q[1] * sp, ay = q[0] * sp + q[1] * cp, az = q[2];
        P.push(mx + ax * cy + az * sy2, my + ay, mz - ax * sy2 + az * cy);
    }
    for (const f of KUTU_YUZ) IDX.push(t + f[0], t + f[1], t + f[2]);
}

// ---- 5c. KÜPEŞTEYİ İZLEYEN ŞERİT (güverte / küpeşte kapağı) ------------
// ⚠️ Kadırgada sheer VAR (kıç 4.30, orta 2.70, baş 4.05); düz bir levha
// uçlarda teknenin İÇİNE gömülür, ortada HAVADA kalırdı. Bu yüzden şerit
// Y_KUP eğrisini izleyen bir SÜPÜRME (fırkateyndeki guverteSerit deseni).
function kupSerit(ad, x1, x2, pay, dy, kalin, N, renk, opts) {
    opts = opts || {};
    const P = [], IDX = [];
    for (let i = 0; i <= N; i++) {
        const x = x1 + (x2 - x1) * i / N;
        const w = Math.max(0.05, W_KUP(x) - pay), y = Y_KUP(x) + dy;
        P.push(x, y + kalin,  w);
        P.push(x, y,          w);
        P.push(x, y,         -w);
        P.push(x, y + kalin, -w);
    }
    for (let i = 0; i < N; i++) {
        for (let j = 0; j < 4; j++) {
            const a = i * 4 + j, b = i * 4 + (j + 1) % 4;
            IDX.push(a, a + 4, b + 4, a, b + 4, b);
        }
    }
    IDX.push(0, 2, 1, 0, 3, 2);
    const s = N * 4;
    IDX.push(s, s + 1, s + 2, s, s + 2, s + 3);
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.Float32BufferAttribute(P, 3));
    geo.setIndex(IDX);
    geo.computeVertexNormals();
    const m = mesh(geo, renk, {
        flat: opts.flat !== false,
        rough: opts.rough == null ? 0.82 : opts.rough,
        metal: opts.metal == null ? 0.04 : opts.metal, name: ad });
    modelGroup.add(m);
    return m;
}

// ---- 5d. TEK BORDADA KÜPEŞTEYİ İZLEYEN ÇUBUK (küpeşte kapağı, kuşak) ---
function bordaSerit(ad, s, x1, x2, wf, yf, kalinZ, kalinY, N, renk, opts) {
    opts = opts || {};
    const P = [], IDX = [];
    for (let i = 0; i <= N; i++) {
        const x = x1 + (x2 - x1) * i / N;
        const w = wf(x), y = yf(x);
        P.push(x, y + kalinY, s * (w + kalinZ));
        P.push(x, y,          s * (w + kalinZ));
        P.push(x, y,          s * (w - kalinZ));
        P.push(x, y + kalinY, s * (w - kalinZ));
    }
    for (let i = 0; i < N; i++) {
        for (let j = 0; j < 4; j++) {
            const a = i * 4 + j, b = i * 4 + (j + 1) % 4;
            IDX.push(a, a + 4, b + 4, a, b + 4, b);
        }
    }
    IDX.push(0, 2, 1, 0, 3, 2);
    const e = N * 4;
    IDX.push(e, e + 1, e + 2, e, e + 2, e + 3);
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.Float32BufferAttribute(P, 3));
    geo.setIndex(IDX);
    geo.computeVertexNormals();
    const m = mesh(geo, renk, {
        flat: opts.flat !== false,
        rough: opts.rough == null ? 0.80 : opts.rough,
        metal: opts.metal == null ? 0.05 : opts.metal, name: ad });
    modelGroup.add(m);
    return m;
}

// ---- 5d2. SHEER'İ İZLEYEN ORTA HAT ŞERİDİ (corsia, sabit genişlik) -----
// ⚠️ Sabit y ile yazılamaz: güverte kıçta 4.30, ortada 2.70, başta 4.05.
// Sabit yükseklikli bir corsia orta gövdede havada kalır, uçlarda güvertenin
// içine gömülürdü (fırkateynde güverte levhasında ölçülmüş aynı tuzak).
function merkezSerit(ad, x1, x2, yariZ, dy, kalin, N, renk, opts) {
    opts = opts || {};
    const P = [], IDX = [];
    for (let i = 0; i <= N; i++) {
        const x = x1 + (x2 - x1) * i / N;
        const y = Y_KUP(x) + dy;
        P.push(x, y + kalin,  yariZ);
        P.push(x, y,          yariZ);
        P.push(x, y,         -yariZ);
        P.push(x, y + kalin, -yariZ);
    }
    for (let i = 0; i < N; i++)
        for (let j = 0; j < 4; j++) {
            const a = i * 4 + j, b = i * 4 + (j + 1) % 4;
            IDX.push(a, a + 4, b + 4, a, b + 4, b);
        }
    IDX.push(0, 2, 1, 0, 3, 2);
    const e = N * 4;
    IDX.push(e, e + 1, e + 2, e, e + 2, e + 3);
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.Float32BufferAttribute(P, 3));
    geo.setIndex(IDX);
    geo.computeVertexNormals();
    const m = mesh(geo, renk, {
        flat: opts.flat !== false,
        rough: opts.rough == null ? 0.84 : opts.rough,
        metal: opts.metal == null ? 0.04 : opts.metal, name: ad });
    modelGroup.add(m);
    return m;
}

// ---- 5e. TEKNE YÜZEYİNE OTURAN ŞERİT (yuzeyYama) -----------------------
// ⚠️ nx / nw: nx bandın UZUN kenarındaki (x) bölüntü, nw İNCE kenarındaki.
// Ters verilirse şerit yüzeyin kavisini takip edemeyip teknenin içine girer
// ve KAYBOLUR.
// ⚠️ yuzeyYama DİKEY yüzeyde çalışmaz (zırhlı SUV'un bagaj camında
// ölçüldü) — burada bütün bantlar teknenin EĞİK sintine bölgesinde.
function yuzeyYama(ad, bantlar, nx, nw, disari, renk, opts) {
    opts = opts || {};
    const P = [], IDX = [];
    for (const bant of bantlar) {
        const x1 = bant[0], x2 = bant[1], y1 = bant[2], y2 = bant[3];
        const taraf = bant[4];
        const taban = P.length / 3, S = nw + 1;
        for (let i = 0; i <= nx; i++) {
            const x = x1 + (x2 - x1) * i / nx;
            for (let j = 0; j <= nw; j++) {
                const y = y1 + (y2 - y1) * j / nw;
                const w = taraf * vYukseklik(x, y);
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
        metal: opts.metal == null ? 0.05 : opts.metal,
        rough: opts.rough == null ? 0.80 : opts.rough, name: ad });
    m.material.side = THREE.DoubleSide;
    // Kalınlıksız paneller GÖLGE DÜŞÜRMEZ: tekneye 5 cm mesafede duruyorlar,
    // gölge haritasında kendi gölgelerini teknenin üstüne basıp benek
    // üretiyorlardı (trende ölçülmüştü).
    m.castShadow = false;
    modelGroup.add(m);
    return m;
}

// ===========================================================================
// 6. KÜREKLER — modelin İMZASI
// ===========================================================================
// KAYNAK: [K1] 24 bank/borda, [K2] kürek başına üç kürekçi ("a scaloccio")
// -> bir bordada 24 kürek, toplam 48. MODELDE 8+8 = 16. Fark bilerek:
// ölçüt okunabilirlik (bkz. §1, N_KUREK).
//
// KÜREK BOYU TÜRETİLDİ (kaynaktan alınmadı, [K3]):
//   * İskarmoz apostisin üstünde: z = 3.35, y = 3.05 (küpeştenin 0.35 üstü).
//   * Palanın suya girmesi lazım: su hattı y = 1.70, yani dış uç iskarmozdan
//     1.35 m AŞAĞIDA olmalı.
//   * Kürekçinin tutuş payı: üç adam yan yana, adam başına ~0.80 m loma +
//     0.45 m sap = 2.85 m iç kol.
//   * Dış kol, palanın su hattına ~13 derecelik eğimle inmesiyle çözülüyor:
//     1.35 / sin(13 derece) = 6.00 m; palayla birlikte 5.95 alındı.
//   * TOPLAM 8.80 m. Kaynaktaki 12 m BEŞ kürekçilik kürek içindir [K3];
//     üç kürekçilik kürek daha kısadır, o sayı buraya AKTARILMADI.
//   * İç/dış kol oranı 32/68 — "a scaloccio" düzeninde beklenen oran.
//
// ÇEKİŞ UZUNLUĞU (bir strokta geminin aldığı yol) DA TÜRETİLDİ — ve artık
// ELLE YAZILMIYOR, palanın KENDİ profilinden hesaplanıyor (aşağıda
// palaMerkez()). Sebep: kürek geometrisi değiştiğinde (2026-09-04'te
// değişti: sayı 24->8, kürek kalınlaştı) elle yazılmış bir sabit sessizce
// eskiyor ve kürek hızı gemi hızıyla tutmaz.
//   yarıçap = palanın ALAN AĞIRLIK MERKEZİNİN iskarmoza uzaklığı;
//   yay     = yarıçap * süpürme (2 * 20 derece = 0.6981 rad);
//   çekiş   = yay * kayma katsayısı (slip 0.83).
// ⚠️ SAYI DEĞİŞTİ: 3.01 -> 3.04. Gerekçe DÜRÜSTÇE: kalınlaşma merkezi
//   yalnız 0.001 m oynattı (5.2453 -> 5.2440; profil neredeyse düzgün
//   ölçeklendi). Farkın tamamı, eski türetmenin ağırlık merkezi yerine
//   palanın ORTA NOKTASINI (5.20) kullanmasından geliyor; şimdi gerçek
//   merkez hesaplanıyor: 5.2440 * 0.6981 = 3.6610, * 0.83 = 3.0387.
//   Çapraz denetim: 26 strok/dk * 3.04 m = 79 m/dk = 1.32 m/s = 2.6 knot;
//   kadırganın uzun süreli kürek hızı için makul (kaynaklar kısa süreli
//   sürat için 5-7 knot veriyor, o da ~50 strok/dk eder).
// ⚠️ KÜREK SAYISI BU HESABA GİRMEZ, girmemeli: kadırgada bütün kürekler
//   BİRLİKTE çeker, yani bir strokta gemi BİR KÜREK YAYI kadar ilerler;
//   kürek sayısı o yayı değil, onu SÜRDÜREBİLECEK kuvveti belirler.
// ⚠️ Bu sayı ANİMASYONUN FAZINI belirliyor: faz = kat edilen yol / ÇEKİŞ.
//    Model büyütülüp küçültülse bile faz model metresinde hesaplandığı için
//    kürek hızı gemi hızıyla tutarlı kalıyor.
const KUREK_BOY   = 8.80;
const KUREK_IC    = 2.85;    // iskarmozdan içeri
const KUREK_DIS   = 5.95;    // iskarmozdan dışarı
const PALA_BOY    = 1.55;
// ---- KÜREK SAYISI ÜÇTE BİRE İNİNCE KÜREK KALINLAŞTI ---------------------
// Çarpan GÖZLE SEÇİLMEDİ, ÖLÇÜLDÜ. Betik: kadirga_kurek8_kiyas.py — tepeden
// ortografik, ortak kadraj, 0.0759 metre/piksel; YALNIZ kürek mesh'leri
// çizilip en yoğun piksel satırındaki "diş" (kesiksiz dizi) ve "boşluk"
// sayılıyor, yani tarak okunabilirliği bir sayı:
//     sürüm            diş  diş eni        boşluk        boşluk/diş
//     24 kürek (eski)   24  6.5 px 0.49 m  13.3 px 1.01 m    2.1
//      8 kürek, x1.00    8  6.5 px 0.49 m  53.7 px 4.08 m    8.3
//      8 kürek, x1.25    8  8.0 px 0.61 m  52.4 px 3.98 m    6.6
//      8 kürek, x1.45    8  8.9 px 0.67 m  51.7 px 3.92 m    5.8   <- SEÇİLDİ
//      8 kürek, x1.70    8 10.1 px 0.77 m  50.4 px 3.83 m    5.0
// Okuma: x1.00'da diş eni eskisiyle AYNI kalıyor ama boşluk dört katına
// çıkıyor — kürek "çubuk" değil "çizik" gibi duruyor, tarak dağılıyor.
// x1.70'te loma kürek olmaktan çıkıp SIRIK gibi görünüyor (tepeden bakışta
// pala ile loma arasındaki incelme kayboluyor). x1.45 ikisinin arası:
// loma çapı 0.27 -> 0.39 m, pala eni 0.44 -> 0.62 m; tek kürek eskisinden
// KALIN okunuyor, komşuya uzaklık 3.61 m olduğu için tarak yine de
// boşluklu. Toplam kürek silueti 125.4 -> 56.5 m2, yani kalabalık
// gerçekten üçte bire indi, tek kürek ise büyüdü — istenen tam buydu.
// ⚠️ KÜREK UZATILMADI, YALNIZ KALINLAŞTI. Uzatma denenmedi çünkü ölçüsü
// bağlı: iskarmoz y=3.05, su hattı 1.70 -> palanın düşümü 1.35 m SABİT
// (teknenin freeboard'u belirliyor). KUREK_DIS'i büyütmek palayı suyun
// altına sokar; düzeltmek için eğimi küçültmek gerekir ve o da modelin
// kutusunu z'de 18.31'den ~20.2 m'ye çıkarırdı. Okunabilirlik kalınlıkla
// zaten çözüldü; kutuyu büyütmek bedava değil (gölge kapsamı, tepe kıyası,
// haritadaki ölçek). ÖLÇÜLDÜ: kalınlaşma kutuyu z'de 18.307 -> 18.311
// oynattı, yani kutu pratikte AYNI kaldı.
const KUREK_KALIN = 1.45;    // loma yarıçap çarpanı (yalnız GÖRSEL)
const PALA_EN     = 0.62;    // eski 0.44
const PALA_KAL    = 0.061;   // pala levha kalınlığı (eski 0.045)
const KUREK_SAPMA = 20.0;    // süpürme genliği (derece, +-)
const KUREK_EGIM_SU   = 13.0;   // çekişte palanın aşağı eğimi (derece)
const KUREK_EGIM_HAVA = 5.5;    // dönüşte (pala sudan çıkar)
// DURUŞ VE DÖNÜŞ PALA AÇISI: 90 derece = pala YATAY (feather). Çekişte 0,
// yani pala dikey. Duruşta yatık olması hem doğru (kürekçi dinlenirken
// küreği yatırır) hem TEPEDEN OKUMAYI koruyor: dikey pala tepeden ince bir
// çizgidir, yatık pala geniş bir uç.
const KUREK_ROLL = Math.PI / 2;
const KUREK_SLIP  = 0.83;    // kayma katsayısı (su palayı bırakır)
// Palanın alan ağırlık merkezinin iskarmoza uzaklığı — pala PROFİLİNDEN
// hesaplanıyor (palaProfil aşağıda; fonksiyon bildirimleri yukarı çekilir).
const KUREK_MERKEZ = palaMerkez();
const KUREK_CEKIS = KUREK_MERKEZ * (2 * KUREK_SAPMA * Math.PI / 180) * KUREK_SLIP;
const KUREK_DUTY  = 0.46;    // çekiş evresinin çevrimdeki payı

// Kürek pivot x'leri.
const KUREK_PX = [];
for (let i = 0; i < N_KUREK; i++) KUREK_PX.push(KUREK_X0 + i * KUREK_DX);

// ---- kürek şablonu: TEK küreğin iskarmoza göre yerel köşeleri -----------
// Yerel eksen: a = kürek ekseni (dışarı +), b = küreğin "yukarı"sı,
// c = yatayda küreğe dik. Davranış her karede bu üçlüyü döndürüp
// iskarmoz noktasına ekliyor — biriktirme YOK, MUTLAK kurulum.
function kurekSablon() {
    // Altıgen kesitli, dışa doğru incelen loma.
    const N = 6, kesit = [];
    for (let i = 0; i < N; i++) {
        const t = (i + 0.5) * 2 * Math.PI / N;
        kesit.push([Math.cos(t), Math.sin(t)]);
    }
    // a boyunca dört halka: sap ucu, iskarmoz, orta, pala boynu.
    // ⚠️ Yarıçaplar KUREK_KALIN ile ölçekleniyor: kürek sayısı üçte bire
    // inince tek kürek kalınlaştı (gerekçe ve ölçüm §6 başında).
    const halkalar = [[-KUREK_IC, 0.115 * KUREK_KALIN],
                      [-0.10, 0.135 * KUREK_KALIN],
                      [0.10, 0.135 * KUREK_KALIN],
                      [KUREK_DIS - PALA_BOY, 0.085 * KUREK_KALIN]];
    const P = [], IDX = [];
    for (const h of halkalar)
        for (const k of kesit) P.push(h[0], k[1] * h[1], k[0] * h[1]);
    for (let i = 0; i < halkalar.length - 1; i++)
        for (let j = 0; j < N; j++) {
            const j2 = (j + 1) % N;
            const a = i * N + j, b = i * N + j2;
            const c = (i + 1) * N + j, d = (i + 1) * N + j2;
            IDX.push(a, c, d, a, d, b);
        }
    // iki uç kapağı
    for (const [taban, onYuz] of [[0, false], [(halkalar.length - 1) * N, true]]) {
        const c = P.length / 3;
        let ma = 0;
        for (let j = 0; j < N; j++) ma += P[(taban + j) * 3];
        P.push(ma / N, 0, 0);
        for (let j = 0; j < N; j++) {
            const a = taban + j, b = taban + (j + 1) % N;
            if (onYuz) IDX.push(c, a, b); else IDX.push(c, b, a);
        }
    }
    return { P: P, IDX: IDX };
}

// ---- pala profili: TEK KAYNAK -------------------------------------------
// Hem palanın mesh'i hem ÇEKİŞ UZUNLUĞU bu profilden çıkıyor. İkisi ayrı
// yerde yazılırsa biri değişince öteki sessizce eskir; 3.01'in eskimesi de
// tam böyle olurdu. [a boyunca konum, YARI en, YARI kalınlık]
function palaProfil() {
    const a0 = KUREK_DIS - PALA_BOY, a1 = KUREK_DIS;
    const yari = PALA_EN / 2, kal = PALA_KAL;
    return [[a0, 0.085 * KUREK_KALIN, kal],
            [a0 + PALA_BOY * 0.30, yari * 0.85, kal],
            [a1 - 0.14, yari,        kal * 0.75],
            [a1,        yari * 0.72, kal * 0.6]];
}

// Palanın PLAN ALANININ ağırlık merkezi (a ekseninde, iskarmozdan uzaklık).
// Yamuk yamuk toplanıyor; bir yamuğun ağırlık merkezi
//   a0 + L * (w0 + 2*w1) / (3 * (w0 + w1)).
// Suyu iten yüzey bu, dolayısıyla süpürme yayının yarıçapı da bu.
function palaMerkez() {
    const k = palaProfil();
    let A = 0, M = 0;
    for (let i = 0; i < k.length - 1; i++) {
        const a0 = k[i][0], a1 = k[i + 1][0];
        const w0 = k[i][1], w1 = k[i + 1][1], L = a1 - a0;
        const al = L * (w0 + w1);                    // 2x yamuk alanı
        A += al;
        M += al * (a0 + L * (w0 + 2 * w1) / (3 * (w0 + w1)));
    }
    return M / A;
}

function palaSablon() {
    // Yassı kürek palası. ⚠️ GENİŞ EKSEN b (küreğin YUKARISI), İNCE EKSEN c
    // (süpürme yönü). Yani pala ÇEKİŞTE DİKEY duruyor ve geniş yüzü suyu
    // kıça itiyor -- gemiyi yürüten şey bu. İlk kurulumda tersiydi (geniş
    // eksen c): pala YATAY bir levhaydı, yani suyu yarıyordu, itmiyordu.
    // Dönüşte ve duruşta pala AYNALANIYOR (roll = 90 derece, aşağıdaki
    // kurekYaz) -- gerçek kürekçinin "palayı yatırma" (feather) hareketi.
    const P = [], IDX = [];
    // Kökte dar, uçta geniş. Kök yarı eni loma yarıçapına bağlı: pala
    // boynunda levha lomadan İNCE kalmasın (kalınlaşan lomada göze
    // çarpardı). Profil palaProfil()'de — çekiş uzunluğu da oradan.
    const k = palaProfil();
    for (const q of k) {
        P.push(q[0],  q[1],  q[2]);
        P.push(q[0], -q[1],  q[2]);
        P.push(q[0], -q[1], -q[2]);
        P.push(q[0],  q[1], -q[2]);
    }
    for (let i = 0; i < k.length - 1; i++)
        for (let j = 0; j < 4; j++) {
            const a = i * 4 + j, b = i * 4 + (j + 1) % 4;
            IDX.push(a, a + 4, b + 4, a, b + 4, b);
        }
    IDX.push(0, 2, 1, 0, 3, 2);
    const e = (k.length - 1) * 4;
    IDX.push(e, e + 1, e + 2, e, e + 2, e + 3);
    return { P: P, IDX: IDX };
}

// ---- şablonu verilen duruşta N_KUREK kez yazan makine -------------------
// psi   : süpürme açısı (radyan, + = pala KIÇA doğru)
// egim  : küreğin aşağı eğimi (radyan, dış uç aşağıda)
// taraf : +1 / -1 borda
// hedef : Float32Array (N_KUREK * nv * 3)
// ⚠️ Bir bordadaki küreklerin duruşu AYNI (kadırgada hepsi birlikte çeker).
// Bu yüzden döndürme BİR KEZ yapılıp N_KUREK kez ÖTELENİYOR: kare başına iş
// N kat değil, 1 döndürme + N toplama. (N 24'ten 8'e indi; bu döngü kare
// başına maliyetin tamamı olduğu için maliyet de onunla birlikte düştü.)
// ⚠️ ÜÇLÜ DİK VE SAĞ ELLİ OLMAK ZORUNDA (det = +1). İlk kurulumda b ekseni
// a'ya DİK DEĞİLDİ (a.b = -2*sin(egim)*cos(egim)) ve üçlünün işareti bordaya
// göre değişiyordu; öyle bir taban hem pala kesitini eğri gösterir hem
// üçgen sarımını bir bordada TERS çevirir (arka-yüz ayıklaması o kürekleri
// görünmez yapardı). Doğrusu: yatay birim ĥ = (-sin psi, 0, taraf*cos psi),
//   a = cos(egim)*ĥ - sin(egim)*ŷ     (kürek ekseni, dışarı ve aşağı)
//   b = sin(egim)*ĥ + cos(egim)*ŷ     (küreğin yukarısı, a'ya dik)
//   c = a x b                          (süpürme yönü; sağ elli olsun diye)
// ⚠️ NORMALLER GÜNCELLENMİYOR: kürek meshleri `flat: true` ile kuruluyor,
// yani malzeme flatShading; three.js yüzey normalini shader'da türevden
// üretiyor ve tepe normalleri HİÇ okunmuyor. Kare başına normal yazmak
// bedava iş olurdu (ölçülmedi diye değil, kullanılmadığı için).
function kurekYaz(sablonP, hedef, psi, egim, roll, taraf) {
    const sp = Math.sin(psi), cp = Math.cos(psi);
    const se = Math.sin(egim), ce = Math.cos(egim);
    const hx = -sp, hz = taraf * cp;
    let ax = ce * hx, ay = -se, az = ce * hz;
    let bx = se * hx, by = ce, bz = se * hz;
    // c = a x b
    let cx = ay * bz - az * by, cy = az * bx - ax * bz, cz = ax * by - ay * bx;
    // PALA YATIRMA (feather): b ve c, a ekseni etrafında roll kadar dönüyor.
    if (roll) {
        const sr = Math.sin(roll), cr = Math.cos(roll);
        const nbx = bx * cr + cx * sr, nby = by * cr + cy * sr, nbz = bz * cr + cz * sr;
        const ncx = -bx * sr + cx * cr, ncy = -by * sr + cy * cr, ncz = -bz * sr + cz * cr;
        bx = nbx; by = nby; bz = nbz; cx = ncx; cy = ncy; cz = ncz;
    }
    const nv = sablonP.length / 3;
    let o = 0;
    for (let k = 0; k < N_KUREK; k++) {
        const px = KUREK_PX[k], py = KUREK_Y, pz = taraf * APOSTIS;
        for (let i = 0; i < nv; i++) {
            const a = sablonP[i * 3], b = sablonP[i * 3 + 1], c = sablonP[i * 3 + 2];
            hedef[o++] = px + a * ax + b * bx + c * cx;
            hedef[o++] = py + a * ay + b * by + c * cy;
            hedef[o++] = pz + a * az + b * bz + c * cz;
        }
    }
}

// ---- kürekleri kur -----------------------------------------------------
// DURUŞ POZU: psi = 0 (kürekler bordaya DİK), egim = çekiş eğimi. Bu aynı
// zamanda kutunun EN GENİŞ hâli — animasyon sırasında kürekler bu kutunun
// dışına ÇIKMIYOR (psi büyüdükçe z küçülüyor). Gölge kapsamı bu yüzden
// hiçbir karede yetersiz kalmıyor.
const KUREK_VERI = {};
(function kurekleriKur() {
    const sab = { kurek: kurekSablon(), pala: palaSablon() };
    for (const tip of ['kurek', 'pala']) {
        const s = sab[tip], nv = s.P.length / 3;
        for (let taraf = 1; taraf >= -1; taraf -= 2) {
            const ad = tip + '_' + (taraf > 0 ? 1 : 2);
            const pos = new Float32Array(N_KUREK * nv * 3);
            kurekYaz(s.P, pos, 0, KUREK_EGIM_SU * Math.PI / 180, KUREK_ROLL, taraf);
            const IDX = [];
            for (let k = 0; k < N_KUREK; k++)
                for (const q of s.IDX) IDX.push(k * nv + q);
            const g = new THREE.BufferGeometry();
            g.setAttribute('position', new THREE.BufferAttribute(pos, 3));
            g.setIndex(IDX);
            g.computeVertexNormals();
            const m = mesh(g, tip === 'kurek' ? C_KUREK : C_PALA,
                           { flat: true, rough: 0.80, metal: 0.03, name: ad });
            // ⚠️ FRUSTUM AYIKLAMASI KAPALI. Geometri her karede yeniden
            // yazılıyor ama boundingSphere KURULUM pozundan kalıyor;
            // süpürmede kürek ucu x'te +-2 m oynadığı için küre eskiyor ve
            // kürekler kadrajın kenarında ANİDEN KAYBOLABİLİRDİ.
            m.frustumCulled = false;
            modelGroup.add(m);
            KUREK_VERI[ad] = { sablon: s.P, taraf: taraf, nv: nv };
        }
    }
})();

// Davranışın okuduğu TEK KAYNAK. studio-3d.js'e sayı kopyalanmıyor:
// kürek geometrisi burada, faz mantığı orada.
modelGroup.userData.kadirga = {
    parcalar: ['kurek_1', 'kurek_2', 'pala_1', 'pala_2'],
    veri: KUREK_VERI,
    yaz: kurekYaz,
    roll: KUREK_ROLL,
    sapma: KUREK_SAPMA,
    egimSu: KUREK_EGIM_SU,
    egimHava: KUREK_EGIM_HAVA,
    cekis: KUREK_CEKIS,
    duty: KUREK_DUTY,
    apostis: APOSTIS,
    freeboard: KUP_ORTA - SU,
    // Olcum kancasi: ilk kuregin iskarmoz x'i. kadirga_kurek_probu.py
    // supurme acisini GEOMETRIDEN buna gore cozuyor.
    pivotX0: KUREK_PX[0],
    boy: 2 * UZUN, en: 2 * YARI_EN
};

// ===========================================================================
// 7. TEKNE ŞERİTLERİ — katran + su hattı bandı
// ===========================================================================
// ⚠️ x ARALIKLARI OMURGAYA GÖRE SEÇİLDİ (kruvaziyerde ölçülmüş tuzak):
// omurga uçlarda yükseldiği için bandın istenen yüksekliği teknenin ALTINDA
// kalıyor ve vYukseklik tabana yapışıp bandı omurga hattına tırmandırıyor.
// Bantlar omurganın hâlâ alt sınırın altında olduğu yere kadar sürüyor.
[1, -1].forEach(function (s, i) {
    // SU ALTI KATRANI. Model tabanı omurga olduğu için gemi haritada su altı
    // gövdesiyle duruyor; bu bant onu bir "gemi" yapan şey.
    yuzeyYama('katran_' + (i + 1),
              [[-17.5, 13.0, 0.10, 1.45, s]], 42, 4, 0.035, C_KATRAN,
              { metal: 0.03, rough: 0.90 });
    // SU HATTI BANDI. Renk ALMAZ: kullanıcı tekneyi boyadığında geminin
    // nereye kadar suya girdiği okunmaya devam etsin.
    yuzeyYama('su_hatti_' + (i + 1),
              [[-19.0, 14.2, 1.45, 1.95, s]], 50, 1, 0.035, C_SU_HAT,
              { metal: 0.04, rough: 0.78 });
});

// KUŞAK (wale) — bordadaki iki koyu kalın kiriş. Yandan bakışta kadırganın
// uzun ince gövdesini ÇİZEN şey bu; ayrıca kalkan sırasının oturduğu yer.
// ⚠️ SABİT y İLE YAZILAMAZ: kuşak yüksekliği x boyunca 2.25'ten 3.85'e
// çıkıyor. Doğrudan KESİT PARAMETRESİNDEN süpürülüyor (fırkateyndeki
// knuckle şeridi dersinin aynısı).
(function kusakSerit() {
    for (let s = -1; s <= 1; s += 2) {
        const P = [], IDX = [], N = 56, x1 = -20.2, x2 = 15.0;
        for (let k = 0; k <= N; k++) {
            const x = x1 + (x2 - x1) * k / N;
            const pa = kesitNokta(kesitPar(x), VB - 0.075);
            const pb = kesitNokta(kesitPar(x), VB + 0.030);
            const n = normal3(x, s * VB);
            // ⚠️ z YARI_EN'e KIRPILIYOR: kuşak kesitin EN GENİŞ yeri, dışa
            // öteleme oradan taşıp "genişlik 5.10 m" iddiasını bozardı.
            const za = s * pa[0] + n[2] * 0.055, zb = s * pb[0] + n[2] * 0.055;
            P.push(x, pa[1] + n[1] * 0.055, Math.max(-YARI_EN, Math.min(YARI_EN, za)));
            P.push(x, pb[1] + n[1] * 0.055, Math.max(-YARI_EN, Math.min(YARI_EN, zb)));
        }
        for (let k = 0; k < N; k++) {
            const a = k * 2;
            IDX.push(a, a + 2, a + 3, a, a + 3, a + 1);
        }
        const g = new THREE.BufferGeometry();
        g.setAttribute('position', new THREE.Float32BufferAttribute(P, 3));
        g.setIndex(IDX);
        g.computeVertexNormals();
        const m = mesh(g, C_KUSAK, { rough: 0.8, metal: 0.05,
                                     name: 'kusak_' + (s < 0 ? 1 : 2) });
        m.material.side = THREE.DoubleSide;
        m.castShadow = false;
        modelGroup.add(m);
    }
})();

// ===========================================================================
// 8. KÖPÜK — KALDIRILDI (2026-09-07)
// ===========================================================================
// Burada bir "baş dalgası / dümen suyu" şeridi vardı: y = SU + 0.14
// kotunda, x = -20.5..15.4 boyunca uzanan, SIFIR KALINLIKTA, `DoubleSide`
// iki levha (`kopuk_1`, `kopuk_2`).
//
// KÖK SEBEP — yolcu gemisindeki ve fırkateyndeki `kopuk_1/2` ile BİREBİR
// aynı kusur sınıfı: levha TAM YATAY (tek y kotu, kesit yok), `DoubleSide`
// + `computeVertexNormals` yüzünden THREE arka yüzün normalini çevirdiği
// için HER İKİ taraftan da tam aydınlık; anahtar ışık yukarıdan geldiğinden
// yatay yüzey ışığın tamamını alıyor ve gövdedeki gibi bir gölge geçişi
// hiç olmuyor. Su hattı bandının hemen üstünde durduğu için "şeridin
// üzerindeki beyaz şerit" olarak okunuyor.
//
// ⚠️ KÜTÜPHANEDEKİ EN PARLAĞI BUYDU. Gerçek studio karesinde ölçüldü:
// `kopuk_1` 360 görünür pikselin 340'ı L>=230, ortalama luma 234.0;
// `kopuk_2` 1348 piksel, ortalama 98.8. Karşılaştırma: yolcu gemisinde
// kaldırılan şeridin aynı ölçümdeki ortalaması 114.8'di.
//
// ⚠️ TEZGÂH IŞIĞI VE `parlaklik.py` BU KUSURA KÖR (DEVİR §4.3): tepe luma
// 250 eşiğini hiç geçmiyor. Teşhis ancak GERÇEK STUDIO karesinde,
// mesh'e atamalı kimlik pasıyla konulabiliyor (`gemi_studio_probu.py`).
//
// NEDEN KALDIRILDI: şeridin orta gövdedeki kısmı zaten teknenin içinde ve
// görünmüyor; geriye kalan tek görsel katkısı baş/kıçtaki taşma, yani
// şikâyetin kendisi. Kapalı katıya çevirmek onu gölgeli bir ikinci
// bodoslama yapardı.
//
// KUTU DEĞİŞMEDİ: kutunun z ölçüsünü KÜREKLER belirliyor, şerit
// |YARI_EN| ile zaten kırpılıyordu.
//

// ===========================================================================
// 9. GÜVERTE, CORSIA VE KÜREKÇİ BANKLARI — tepeden okunan desen
// ===========================================================================
// Teknenin kapalı üst yüzü gövde ahşabı. Onun üstüne 0.18 içeriden başlayan
// koyu bir döşeme oturuyor: kalan çerçeve KÜPEŞTE olarak okunuyor.
kupSerit('guverte', -20.4, 15.2, 0.18, 0.02, 0.10, 40, C_GUVERTE);

// CORSIA — orta hattaki yükseltilmiş yürüme yolu. Kadırganın tepeden
// bakışta gövdeyi ikiye bölen ÇİZGİSİ; kruvaziyerin havuzunun, fırkateynin
// uçuş güvertesinin karşılığı burada bu.
merkezSerit('corsia', KOSK_X2 + 0.1, 12.2, 0.52, 0.12, 0.24, 30, C_GUVERTE);
merkezSerit('corsia_kapak', KOSK_X2 + 0.1, 12.2, 0.60, 0.34, 0.16, 30, C_KUSAK);

// KÜREKÇİ BANKLARI. [K1]: borda başına 24 bank, bank başına üç kürekçi.
// ⚠️ BANK SAYISI KÜREK SAYISINA BAĞLI (N_KUREK): kürek 24'ten 8'e inince
// bank da 48'den 16'ya indi. Bilerek: bank, o küreği çeken adamların
// oturağıdır — küreksiz bank (ya da banksız kürek) yazmak modeli kendi
// içinde tutarsız yapardı, hem tepeden aynı kalabalık şikâyeti bu kez
// güvertenin İÇİNDE tekrarlanırdı.
// Banklar corsia'dan apostise doğru KIÇA EĞİK uzanır (kürekçilerin
// birbirini kesmemesi için) — tepeden bakışta gövdenin içindeki 16 çizgi
// bu; kürek tarağıyla birlikte kadırganın imzasını tamamlıyor.
// ⚠️ TEK MESH (§5a): ayrı ayrı mesh hem bütçeyi yakardı hem "aynı adlı
// mesh yalnız bir kez renk alır" tuzağına düşerdi.
// ⚠️ YÜKSEKLİK VE AYAK KONUMU SHEER'DEN OKUNUYOR: sabit y ile yazılan bir
// bank başta güvertenin içine gömülür (Y_KUP orada 3.45'e çıkıyor), ayak da
// sabit z ile yazılırsa baş tarafta teknenin DIŞINDA kalırdı (W_KUP orada
// 1.72'ye iniyor).
(function banklar() {
    const P = [], IDX = [];
    const egim = -24 * Math.PI / 180;      // bankın plandaki eğimi
    for (let s = -1; s <= 1; s += 2)
        for (let k = 0; k < N_KUREK; k++) {
            const x = KUREK_PX[k] - 0.58;
            const yB = Math.max(KUP_ORTA + 0.42, Y_KUP(x) + 0.20);
            egikKutu(P, IDX, x, yB, s * 1.82, 0.32, 0.13, 2.30, s * egim, 0);
            // bankın ayağı — güverteye oturuyor
            const zA = s * Math.min(2.10, Math.max(0.9, W_KUP(x) - 0.28));
            const yA = Y_KUP(x) + 0.06;
            egikKutu(P, IDX, x, (yA + yB) / 2, zA, 0.20, yB - yA, 0.20, 0, 0);
        }
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.Float32BufferAttribute(P, 3));
    g.setIndex(IDX);
    g.computeVertexNormals();
    const m = mesh(g, C_KUSAK, { flat: true, rough: 0.82, metal: 0.04,
                                 name: 'bank' });
    m.castShadow = false;
    modelGroup.add(m);
})();

// ===========================================================================
// 10. APOSTİS — kürek çemberi
// ===========================================================================
// [K1]: "6.7 m with the rowing frame". Bordadan 0.80 m dışarı taşan, kürek
// yataklarını (iskarmoz) taşıyan boyuna kiriş. Kürekler bunun üstünden
// çıkıyor; kadırgayı öteki teknelerden ayıran YAPI elemanı bu.
(function apostisKur() {
    for (let s = -1; s <= 1; s += 2) {
        const i = s < 0 ? 1 : 2;
        // ana kiriş
        const P = [], IDX = [], N = 26;
        const x1 = KUREK_X0 - 0.85, x2 = KUREK_PX[N_KUREK - 1] + 0.85;
        for (let k = 0; k <= N; k++) {
            const x = x1 + (x2 - x1) * k / N;
            const y = KUREK_Y - 0.20;
            P.push(x, y + 0.24, s * (APOSTIS + 0.14));
            P.push(x, y,        s * (APOSTIS + 0.14));
            P.push(x, y,        s * (APOSTIS - 0.14));
            P.push(x, y + 0.24, s * (APOSTIS - 0.14));
        }
        for (let k = 0; k < N; k++)
            for (let j = 0; j < 4; j++) {
                const a = k * 4 + j, b = k * 4 + (j + 1) % 4;
                IDX.push(a, a + 4, b + 4, a, b + 4, b);
            }
        IDX.push(0, 2, 1, 0, 3, 2);
        const e = N * 4;
        IDX.push(e, e + 1, e + 2, e, e + 2, e + 3);
        const g = new THREE.BufferGeometry();
        g.setAttribute('position', new THREE.Float32BufferAttribute(P, 3));
        g.setIndex(IDX);
        g.computeVertexNormals();
        modelGroup.add(mesh(g, C_KUSAK, { flat: true, rough: 0.80, metal: 0.05,
                                          name: 'apostis_' + i }));
        // Apostisi bordaya bağlayan dirsekler + iskarmoz kazıkları (tek mesh).
        const L = [];
        for (let k = 0; k < N_KUREK; k++) {
            const x = KUREK_PX[k];
            L.push([x, KUREK_Y - 0.26, s * (APOSTIS - 0.55), 0.16, 0.16, 1.30]);
            L.push([x + 0.30, KUREK_Y + 0.10, s * APOSTIS, 0.13, 0.42, 0.13]);
        }
        const d = kutular('iskarmoz_' + i, L, C_DEMIR,
                          Object.assign({ flat: true }, DEMIR_MAL));
        d.castShadow = false;
    }
})();

// ===========================================================================
// 11. KÜPEŞTE KAPAĞI VE KALKAN SIRASI (İKİNCİL RENK)
// ===========================================================================
// Kalkan sırası (impavesata) gerçek kadırgada küpeştenin dışına asılırdı.
// ⚠️ KONUM ÖLÇÜLEREK SEÇİLDİ: kalkanların üst kenarı 2.95, iskarmoz 3.05.
// Küreğin iç kolu iskarmozdan İÇERİ doğru YÜKSELDİĞİ için (13 derece) hiçbir
// duruşta kalkanlara girmiyor; dış kol da apostisin dışında kalıyor.
[1, -1].forEach(function (s, i) {
    bordaSerit('kupeste_' + (i + 1), s, -20.4, 15.2,
               function (x) { return W_KUP(x); },
               function (x) { return Y_KUP(x); },
               0.10, 0.13, 44, C_KALKAN);
});
(function kalkanlar() {
    // Yuvarlak kalkan: sekizgen levha, bordadan dışa taşan hafif kubbeli.
    // ⚠️ İKİ ÖLÇÜ SINIRI VAR, İKİSİ DE HESAPLANDI:
    //  1. ÜSTTE İSKARMOZ. Kalkanın tepesi Y_KUS(x)+0.37; iskarmoz 3.05.
    //     Dizi x=+8.4'te bitiyor çünkü orada Y_KUS 2.50, tepe 2.87 — daha
    //     ileride sheer yükseliyor ve kalkan küreğin loması ile çakışırdı.
    //  2. ALTTA SU HATTI. Kalkanın altı Y_KUS(x)-0.47; orta gövdede 1.78,
    //     su hattı 1.70 — kalkanlar suya girmiyor. Freeboard 1.00 m olduğu
    //     için bu bant 0.84 m'lik kalkanı ancak alıyor; yarıçapı büyütmek
    //     kalkanı ya suya sokar ya iskarmoza çıkarır.
    // ⚠️ DIŞA TAŞMA 0.16 -> 0.28: ilk kurulumda yandan bakışta kalkanlar
    //     bordada ince KIRMIZI BİR ÇİZGİ gibi okunuyordu, kalkan gibi değil.
    //     İkincil rengin görünür olması buna bağlı.
    const P = [], IDX = [], N = 8, R = 0.42;
    for (let s = -1; s <= 1; s += 2)
        for (let k = 0; k < 19; k++) {
            const x = -12.0 + k * 1.133;
            const v = vYukseklik(x, Y_KUS(x) - 0.05);
            const p = nokta3(x, s * v), n = normal3(x, s * v);
            const taban = P.length / 3;
            for (let d = 0; d < 2; d++) {
                const dis = d === 0 ? 0.03 : 0.28;
                for (let j = 0; j < N; j++) {
                    const a = (j + 0.5) * 2 * Math.PI / N;
                    const rr = d === 0 ? R : R * 0.72;
                    P.push(p[0] + Math.cos(a) * rr + n[0] * dis,
                           p[1] + Math.sin(a) * rr * 0.98 + n[1] * dis,
                           p[2] + n[2] * dis + Math.sin(a) * rr * 0.02);
                }
            }
            for (let j = 0; j < N; j++) {
                const j2 = (j + 1) % N;
                IDX.push(taban + j, taban + N + j, taban + N + j2,
                         taban + j, taban + N + j2, taban + j2);
            }
            const c = P.length / 3;
            P.push(p[0] + n[0] * 0.34, p[1] + n[1] * 0.34, p[2] + n[2] * 0.34);
            for (let j = 0; j < N; j++)
                IDX.push(c, taban + N + j, taban + N + (j + 1) % N);
        }
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.Float32BufferAttribute(P, 3));
    g.setIndex(IDX);
    g.computeVertexNormals();
    const m = mesh(g, C_KALKAN, { flat: true, rough: 0.70, metal: 0.10,
                                  name: 'kalkan' });
    m.castShadow = false;
    modelGroup.add(m);
})();

// ===========================================================================
// 12. MAHMUZ (SPERONE) — öne uzanan çarpma burnu
// ===========================================================================
// ⚠️ TARİHSEL NOT, ÖNEMLİ: SU ALTI KOÇBAŞI (rostrum) ANTİK TRİREMEYE
// aittir. 16. yy kadırgasının mahmuzu su hattının HEMEN ÜSTÜNDE, öne uzanan
// bir kirişti; işi delmek değil düşmanın küreklerini kırmak ve borda
// etmede köprü olmaktı. Model 16. yy tipini seçtiği için mahmuz da öyle:
// kökü su hattının 0.5 m üstünde (y=2.20), ucu 3.15'te. Yani alçak açılı
// bakışta "su hattında öne uzanan burun" olarak okunuyor ama antik koçbaşı
// gibi suya gömülü değil.
// Uzunluk: kökü x=13.0'da, ucu x=21.0 -> 8.0 m; teknenin baş bodoslaması
// x=15.6'da bittiği için DIŞARIDA kalan kısmı 5.4 m.
(function mahmuz() {
    const P = [], IDX = [];
    // [x, y, yarıGenişlik, yarıYükseklik]
    const k = [[12.6, 2.05, 0.62, 0.46], [14.2, 2.32, 0.50, 0.40],
               [16.4, 2.62, 0.38, 0.32], [18.6, 2.90, 0.27, 0.24],
               [20.3, 3.08, 0.17, 0.16], [21.0, 3.15, 0.09, 0.10]];
    for (const q of k) {
        P.push(q[0], q[1] + q[3],  q[2]);
        P.push(q[0], q[1] - q[3],  q[2]);
        P.push(q[0], q[1] - q[3], -q[2]);
        P.push(q[0], q[1] + q[3], -q[2]);
    }
    for (let i = 0; i < k.length - 1; i++)
        for (let j = 0; j < 4; j++) {
            const a = i * 4 + j, b = i * 4 + (j + 1) % 4;
            IDX.push(a, a + 4, b + 4, a, b + 4, b);
        }
    IDX.push(0, 2, 1, 0, 3, 2);
    const e = (k.length - 1) * 4;
    IDX.push(e, e + 1, e + 2, e, e + 2, e + 3);
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.Float32BufferAttribute(P, 3));
    g.setIndex(IDX);
    g.computeVertexNormals();
    modelGroup.add(mesh(g, C_TEKNE, { flat: true, rough: 0.76, metal: 0.04,
                                      name: 'mahmuz' }));
    // Ucundaki demir bilezik + mahmuzu bodoslamaya bağlayan payanda.
    const u = mesh(new THREE.CylinderGeometry(0.17, 0.13, 0.36, 8), C_DEMIR,
                   Object.assign({ flat: true, name: 'mahmuz_ucu' }, DEMIR_MAL));
    u.rotation.z = Math.PI / 2 - 0.13;
    u.position.set(20.55, 3.10, 0);
    modelGroup.add(u);
    kutular('mahmuz_payanda',
            [[15.2, 2.05, 0, 5.10, 0.14, 0.30],
             [13.6, 2.62, 0, 1.20, 1.05, 0.24]],
            C_KUSAK, { rough: 0.80 }).castShadow = false;
})();

// ===========================================================================
// 13. RAMBADE — baş savaş platformu ve topları
// ===========================================================================
// [K1]: "one 50-pound cannon or a 32-pound culverin at the bow as well as
// four lighter cannons and four swivel guns". Kadırganın bütün ağır ateş
// gücü PRUVADA ve İLERİ bakar.
// RAMBADE GÜVERTESİ. Düz ve yatay (y = 3.95), teknenin baş sheer'inin
// (3.30-4.05) hemen üstünde; kürek bölgesinin bittiği x=12.2'den bodoslama
// başına kadar.
const RAMB_Y = 3.95;
kutular('rambade',
        [[13.85, RAMB_Y, 0, 3.30, 0.20, 2.90],
         [12.25, RAMB_Y - 0.52, 0, 0.26, 0.95, 2.90]],
        C_GUVERTE, { rough: 0.82 });
// Rambade korkuluğu.
(function rambadeKorkuluk() {
    const L = [];
    for (let s = -1; s <= 1; s += 2) {
        for (let i = 0; i < 4; i++) {
            const x = 12.5 + i * 0.90;
            L.push([x, RAMB_Y + 0.44, s * 1.38, 0.11, 0.58, 0.11]);
        }
        L.push([13.85, RAMB_Y + 0.70, s * 1.38, 3.30, 0.11, 0.11]);
    }
    kutular('rambade_korkuluk', L, C_KUSAK, { rough: 0.80 }).castShadow = false;
})();
// PRANGILAR (swivel guns) — dört adet [K1], korkuluk yataklarında, DÖNMEZ.
(function prangi() {
    const L = [];
    for (let s = -1; s <= 1; s += 2)
        for (let i = 0; i < 2; i++) {
            const x = 12.6 + i * 1.90;
            L.push([x, RAMB_Y + 0.86, s * 1.38, 0.14, 0.32, 0.14]);
            L.push([x + 0.40, RAMB_Y + 1.06, s * 1.38, 1.00, 0.13, 0.13]);
        }
    kutular('prangi', L, C_TUNC, { rough: 0.44, metal: 0.42 }).castShadow = false;
})();

// BAŞ TOPU (_TURRETS grubu).
// ⚠️ TARİHSEL NOT: gerçek kadırgada baş topu SABİTTİ, nişan GEMİYİ
// DÖNDÜREREK alınırdı. Modelde kundağa sınırlı bir dönüş verildi ki
// motorun 'fire' sözleşmesi (hold sırasında hedefe nişan) işleyebilsin.
// Bu BİLİNÇLİ bir model serbestliğidir; kadırganın kendi ekseninde
// dönebilmesi (bir bordanın küreğini geri çekerek) zaten belgelidir ve
// motorun 'fire' modu tam olarak bunu yapıyor.
// ⚠️ _TURRETS PARÇALARI KENDİ ORİJİNİNDE MERKEZLİ OLMALI: motor parçaları
// pivota taşırken `o.position.x -= pivot[0]` yazıyor (studio-3d.js:1087).
(function basTopu() {
    const yG = RAMB_Y + 0.10;
    // Sabit yatak — DÖNMEZ, _TURRETS dışında.
    kutular('top_yatak', [[RAMB_X, yG + 0.16, 0, 3.10, 0.32, 1.30]],
            C_KUSAK, { rough: 0.80 });
    // Kundak (dönen parça).
    const k = mesh(kutuGeo([[0, 0, -0.42, 2.70, 0.46, 0.20],
                            [0, 0,  0.42, 2.70, 0.46, 0.20],
                            [-0.65, 0.26, 0, 1.20, 0.34, 0.90]]), C_KUSAK,
                   { flat: true, rough: 0.78, name: 'taret' });
    k.position.set(RAMB_X, yG + 0.55, 0);
    modelGroup.add(k);
    // Namlu. Adı TAM `namlu`: motor ağız alevini
    // inner.getObjectByName('namlu') ile buluyor (studio-3d.js:1022).
    const n = mesh(new THREE.CylinderGeometry(0.115, 0.165, 3.20, 10), C_TUNC,
                   { rough: 0.42, metal: 0.44, name: 'namlu' });
    n.rotation.z = -Math.PI / 2;
    n.position.set(RAMB_X + 1.05, yG + 0.72, 0);
    modelGroup.add(n);
    const na = mesh(new THREE.CylinderGeometry(0.155, 0.155, 0.30, 10), C_DEMIR,
                    Object.assign({ name: 'namlu_agiz' }, DEMIR_MAL));
    na.rotation.z = -Math.PI / 2;
    na.position.set(RAMB_X + 2.72, yG + 0.72, 0);
    modelGroup.add(na);
    // Kundak arkasındaki kuyruk topuzu — taretle birlikte döner.
    const t = mesh(new THREE.SphereGeometry(0.16, 8, 6), C_TUNC,
                   { rough: 0.42, metal: 0.44, name: 'taret_ust' });
    t.position.set(RAMB_X - 0.85, yG + 0.72, 0);
    modelGroup.add(t);
})();

// ===========================================================================
// 14. KIÇ KÖŞKÜ (POPPA) — yükseltilmiş kıç, tenteli
// ===========================================================================
// Kadırganın yandan silueti: alçak uzun gövde + arkada yükselen köşk.
// Kruvaziyerin yedi katlı beyaz duvarının, fırkateynin hangarının karşılığı;
// ama burada kütle DEĞİL, açık ve tenteli bir platform.
// ⚠️ KÖŞK GÜVERTESİ DÜZ VE YATAY (y = KOSK_Y = 4.42). Teknenin kendi sheer'i
// kıçta zaten 4.30'a çıkıyor; slab onun 0.12 üstünde oturuyor ve öne doğru
// yükseklik farkı büyüdüğü için önü bir perdeyle kapanıyor. Sheer'i izleyen
// bir köşk güvertesi EĞİK olurdu — kadırganın kıç köşkü düzdür.
kutular('kic_kosk',
        [[(KOSK_X1 + KOSK_X2) / 2, KOSK_Y, 0, KOSK_X2 - KOSK_X1, 0.20, 3.05],
         [KOSK_X2 - 0.13, (Y_KUP(KOSK_X2) + KOSK_Y - 0.10) / 2, 0, 0.26,
          KOSK_Y - 0.10 - Y_KUP(KOSK_X2), 4.55]],
        C_GUVERTE, { rough: 0.82 });
// Köşkün kıç perdesi ve yan korkulukları.
(function koskCevre() {
    const L = [];
    for (let s = -1; s <= 1; s += 2) {
        for (let i = 0; i < 6; i++) {
            const x = KOSK_X1 + 0.45 + i * 1.15;
            L.push([x, KOSK_Y + 0.45, s * Math.min(1.48, W_KUP(x) - 0.14),
                    0.12, 0.68, 0.12]);
        }
        L.push([(KOSK_X1 + KOSK_X2) / 2, KOSK_Y + 0.76, s * 1.42,
                KOSK_X2 - KOSK_X1 - 0.7, 0.11, 0.11]);
    }
    kutular('kosk_korkuluk', L, C_KUSAK, { rough: 0.80 }).castShadow = false;
})();
kutular('kic_perde', [[KOSK_X1 - 0.06, KOSK_Y + 0.85, 0, 0.26, 1.60, 2.55]],
        C_TEKNE, { rough: 0.76 });
// Kıç süslemesi (yaldızlı bordür) — kadırganın kıçındaki tek parlak leke.
kutular('kic_suslu',
        [[KOSK_X1 - 0.19, KOSK_Y + 1.56, 0, 0.16, 0.22, 2.45],
         [KOSK_X1 - 0.19, KOSK_Y + 0.24, 0, 0.16, 0.18, 2.30],
         [(KOSK_X1 + KOSK_X2) / 2, KOSK_Y + 0.13, -1.48, KOSK_X2 - KOSK_X1, 0.14, 0.14],
         [(KOSK_X1 + KOSK_X2) / 2, KOSK_Y + 0.13,  1.48, KOSK_X2 - KOSK_X1, 0.14, 0.14]],
        C_ALTIN, { rough: 0.46, metal: 0.38 }).castShadow = false;
// TENTE (tenda) — köşkü örten kumaş çatı, altı direkli.
(function tente() {
    const L = [];
    for (let s = -1; s <= 1; s += 2)
        for (let i = 0; i < 3; i++) {
            const x = KOSK_X1 + 0.9 + i * 2.35;
            L.push([x, KOSK_Y + 1.45, s * 1.30, 0.14, 2.70, 0.14]);
        }
    kutular('tente_direk', L, C_KUSAK, { rough: 0.80 });
    // Kumaş: hafif bombeli levha.
    const P = [], IDX = [], NX = 8, NZ = 5;
    for (let i = 0; i <= NX; i++) {
        const x = KOSK_X1 + 0.3 + (KOSK_X2 - KOSK_X1 - 0.8) * i / NX;
        for (let j = 0; j <= NZ; j++) {
            const u = j / NZ * 2 - 1;
            P.push(x, KOSK_Y + 2.80 + 0.28 * (1 - u * u), u * 1.62);
        }
    }
    for (let i = 0; i < NX; i++)
        for (let j = 0; j < NZ; j++) {
            const a = i * (NZ + 1) + j;
            IDX.push(a, a + NZ + 1, a + NZ + 2, a, a + NZ + 2, a + 1);
        }
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.Float32BufferAttribute(P, 3));
    g.setIndex(IDX);
    g.computeVertexNormals();
    const m = mesh(g, C_KALKAN, { rough: 0.92, metal: 0.0, name: 'tente' });
    m.material.side = THREE.DoubleSide;
    modelGroup.add(m);
})();
// KIÇ FENERİ — kadırganın en tanıdık kıç detayı.
(function fener() {
    const f = mesh(new THREE.CylinderGeometry(0.30, 0.24, 0.80, 8), C_ALTIN,
                   { flat: true, rough: 0.45, metal: 0.40, name: 'fener' });
    f.position.set(KOSK_X1 - 0.05, KOSK_Y + 2.60, 0);
    modelGroup.add(f);
    const c = mesh(new THREE.ConeGeometry(0.34, 0.42, 8), C_ALTIN,
                   { flat: true, rough: 0.45, metal: 0.40, name: 'fener_kulah' });
    c.position.set(KOSK_X1 - 0.05, KOSK_Y + 3.21, 0);
    modelGroup.add(c);
    kutular('fener_ayak', [[KOSK_X1 - 0.05, KOSK_Y + 1.90, 0, 0.16, 0.62, 0.16]],
            C_KUSAK, { rough: 0.80 });
})();

// DÜMEN (kıç dümeni) ve yekesi. 16. yy kadırgasında bodoslama dümeni var
// (Tarihi Kadırga'da da öyle) — antik triremenin iki yan küreği DEĞİL.
(function dumen() {
    const P = [], IDX = [];
    // ⚠️ EN ALT NOKTA 0.06 > 0. İlk kurulumda -0.05 idi ve ÖLÇÜLDÜ: kutu
    // min y = -0.0500, yani dümen omurga hattının 5 cm altına iniyordu.
    // _centerAndGround tabanı y=0'a oturttuğu için BÜTÜN gemi 5 cm havaya
    // kalkıyor ve kutu y'si şişiyordu (fırkateynde pervanede ölçülmüştü).
    // ⚠️ x DEĞERLERİ MERKEZ, GENİŞLİK DE KİRİŞ (yarısı değil): ilk kurulumda
    // merkez -21.00 / kiriş 1.35 idi ve dümen x=-21.675'e taşıp kutuyu
    // 42.675'e çıkardı. Merkezler kirişin YARISI kadar öne alındı.
    const k = [[-20.28, 2.55, 1.10], [-20.30, 1.40, 1.35], [-20.35, 0.40, 1.05],
               [-20.45, 0.06, 0.55]];
    // Dümen dikey bir levha; z kalınlığı 0.14.
    for (const q of k) {
        P.push(q[0] + q[2] * 0.5, q[1],  0.07);
        P.push(q[0] - q[2] * 0.5, q[1],  0.07);
        P.push(q[0] - q[2] * 0.5, q[1], -0.07);
        P.push(q[0] + q[2] * 0.5, q[1], -0.07);
    }
    for (let i = 0; i < k.length - 1; i++)
        for (let j = 0; j < 4; j++) {
            const a = i * 4 + j, b = i * 4 + (j + 1) % 4;
            IDX.push(a, a + 4, b + 4, a, b + 4, b);
        }
    IDX.push(0, 2, 1, 0, 3, 2);
    const e = (k.length - 1) * 4;
    IDX.push(e, e + 1, e + 2, e, e + 2, e + 3);
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.Float32BufferAttribute(P, 3));
    g.setIndex(IDX);
    g.computeVertexNormals();
    modelGroup.add(mesh(g, C_TEKNE, { flat: true, rough: 0.78, name: 'dumen' }));
    const y = mesh(new THREE.CylinderGeometry(0.09, 0.11, 2.90, 8), C_KUSAK,
                   { rough: 0.80, name: 'dumen_yeke' });
    y.rotation.z = Math.PI / 2 - 0.12;
    y.position.set(-19.40, KOSK_Y + 0.45, 0);
    modelGroup.add(y);
})();

// SANCAK — kıç gönderinde.
// ⚠️ GÖNDER İLERİ KAYDIRILDI (x = -18.6). İlk kurulumda gönder KOSK_X1'de
// (-20.2) idi ve bayrak kıça doğru 2.30 m sarkınca kutu ÖLÇÜLDÜ:
// x = 43.500, yani "tam boy 42.0 m" iddiası yalan olmuştu ve sizeKm en
// büyük yatay kenarı okuduğu için gemi haritada olduğundan küçük çizilirdi.
// Kruvaziyer ve fırkateynde dümen suyu aynı gerekçeyle kısaltılmıştı.
const SANCAK_X = -18.60;
(function sancak() {
    const d = mesh(new THREE.CylinderGeometry(0.07, 0.10, 3.30, 8), C_KUSAK,
                   { rough: 0.80, name: 'sancak_gonder' });
    d.position.set(SANCAK_X, KOSK_Y + 1.65, 0);
    modelGroup.add(d);
    const P = [], IDX = [], NX = 6, NY = 3;
    for (let i = 0; i <= NX; i++)
        for (let j = 0; j <= NY; j++) {
            const x = SANCAK_X - i / NX * 2.30;
            const y = KOSK_Y + 3.10 - j / NY * 1.30;
            P.push(x, y, 0.10 * Math.sin(i / NX * 3.6));
        }
    for (let i = 0; i < NX; i++)
        for (let j = 0; j < NY; j++) {
            const a = i * (NY + 1) + j;
            IDX.push(a, a + NY + 1, a + NY + 2, a, a + NY + 2, a + 1);
        }
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.Float32BufferAttribute(P, 3));
    g.setIndex(IDX);
    g.computeVertexNormals();
    const m = mesh(g, C_BAYRAK, { rough: 0.90, name: 'sancak' });
    m.material.side = THREE.DoubleSide;
    m.castShadow = false;
    modelGroup.add(m);
})();

// ===========================================================================
// 15. DİREK VE LATİN YELKEN
// ===========================================================================
// [K2] Tarihi Kadırga İKİ direkli; brief tek direk istedi ve ikinci (küçük
// pruva direği/trinketto) BİLEREK yapılmadı: rambade'nin üstüne oturur ve
// tepeden bakışta baş topunu kapatır — kadırganın imzası kürekler, oraya
// ikinci bir kütle konmuyor.
// [K4] DİREK YÜKSEKLİĞİ KAYNAKTAN DEĞİL: güverteden 12.9 m (su hattından
// 14.0 m) seçildi, yani tam boyun 0.33'ü. Kaynak bulunamadı, uydurulmadı —
// türetildiği burada yazıyor.
// ⚠️ YELKEN NEDEN TEPEDEN OKUMAYI BOZMUYOR: latin yelken NEREDEYSE DİKEY
// bir düzlemde, gemi orta hattı boyunca duruyor. Tepeden bakışta plan
// izdüşümü ~1.4 m'lik ince bir şerit — kürek tarağını KAPATMIYOR. (Kare
// yelken olsaydı gövdeyi tamamen örterdi; kadırganın latin yelkeni bu
// yüzden hem tarihsel hem model olarak doğru seçim.)
const DIREK_X = 2.60;
const DIREK_TEPE = 15.70;         // direk başı (su hattından 14.0 m)
// ⚠️ SEREN AÇISI 48 DERECE, 33 DEĞİL. 33'te serenin ÖN ucu y=11.6'da,
// yani havada kalıyordu; latin serende ön uç pruvaya doğru neredeyse
// güverteye kadar iner. 48 derecede ön uç (12.17, 5.07) — rambade'nin
// 1.1 m üstü, doğru duruş. Toplam seren 25.9 m = tam boyun 0.62'si.
const SEREN_ACI = 48 * Math.PI / 180;   // serenin yatayla açısı
const SEREN_ALT = 14.30;          // direk başından aşağı-ileri kol
const SEREN_UST = 11.60;          // direk başından yukarı-geri kol
(function direkKur() {
    const d = mesh(new THREE.CylinderGeometry(0.26, 0.46, DIREK_TEPE - 2.20, 10),
                   C_TEKNE, { rough: 0.74, metal: 0.04, name: 'direk' });
    d.position.set(DIREK_X, (DIREK_TEPE + 2.20) / 2, 0);
    modelGroup.add(d);
    // Direk kaidesi ve çemberleri.
    const L = [[DIREK_X, 3.05, 0, 1.35, 0.55, 1.15]];
    for (let i = 0; i < 5; i++)
        L.push([DIREK_X, 4.6 + i * 2.4, 0, 0.62, 0.13, 0.62]);
    kutular('direk_cember', L, C_DEMIR,
            Object.assign({ flat: true }, DEMIR_MAL)).castShadow = false;

    // SEREN (antenna) — iki parçadan bindirmeli, klasik latin seren.
    const cx = Math.cos(SEREN_ACI), sy = Math.sin(SEREN_ACI);
    function seren(ad, uz1, uz2, r1, r2) {
        const g = new THREE.CylinderGeometry(r2, r1, uz1 + uz2, 8);
        const m = mesh(g, C_TEKNE, { rough: 0.74, name: ad });
        m.rotation.z = Math.PI / 2 - SEREN_ACI;
        // merkez, direk başından (uz2-uz1)/2 kadar yukarı-geri
        const o = (uz2 - uz1) / 2;
        m.position.set(DIREK_X - o * cx, DIREK_TEPE + o * sy, 0);
        modelGroup.add(m);
        return m;
    }
    seren('seren_alt', SEREN_ALT, SEREN_UST * 0.30, 0.20, 0.13);
    seren('seren_ust', SEREN_ALT * 0.22, SEREN_UST, 0.16, 0.07);
})();

// LATİN YELKEN — üçgen. Serenden aşağı sarkıyor, alt köşesi (iskota) kıçta.
(function yelken() {
    const cx = Math.cos(SEREN_ACI), sy = Math.sin(SEREN_ACI);
    // Serendeki üst kenar: direk başından +uz kadar yukarı-geri.
    function serenNok(u) {
        return [DIREK_X - u * cx, DIREK_TEPE + u * sy];
    }
    const A = serenNok(-SEREN_ALT * 0.94);   // seren ön ucu (aşağı-ileri)
    const B = serenNok(SEREN_UST * 0.97);    // seren arka ucu (yukarı-geri)
    const C = [-12.60, 5.10];                // iskota köşesi (kıç köşkü önü)
    const NX = 10, NY = 7;
    const P = [], IDX = [];
    for (let i = 0; i <= NX; i++) {
        const u = i / NX;
        // seren boyunca A -> B
        const sx = A[0] + (B[0] - A[0]) * u, syy = A[1] + (B[1] - A[1]) * u;
        for (let j = 0; j <= NY; j++) {
            const v = j / NY;
            const x = sx + (C[0] - sx) * v, y = syy + (C[1] - syy) * v;
            // Karın: rüzgârla şişmiş yelken, +z'ye doğru.
            const k = Math.sin(Math.PI * u) * Math.sin(Math.PI * v);
            P.push(x, y, 1.35 * k);
        }
    }
    for (let i = 0; i < NX; i++)
        for (let j = 0; j < NY; j++) {
            const a = i * (NY + 1) + j;
            IDX.push(a, a + NY + 1, a + NY + 2, a, a + NY + 2, a + 1);
        }
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.Float32BufferAttribute(P, 3));
    g.setIndex(IDX);
    g.computeVertexNormals();
    const m = mesh(g, C_YELKEN, { rough: 0.94, metal: 0.0, name: 'yelken' });
    m.material.side = THREE.DoubleSide;
    modelGroup.add(m);

    // HALATLAR: serenin mantilyası, iskota ve yan ıstralyalar. Tek mesh.
    const HP = [], HI = [];
    function halat(p1, p2, r) {
        const dx = p2[0] - p1[0], dy = p2[1] - p1[1], dz = p2[2] - p1[2];
        const uz = Math.hypot(dx, dy, dz);
        const yaw = Math.atan2(dz, dx), pit = Math.atan2(dy, Math.hypot(dx, dz));
        egikKutu(HP, HI, (p1[0] + p2[0]) / 2, (p1[1] + p2[1]) / 2,
                 (p1[2] + p2[2]) / 2, uz, r, r, -yaw, pit);
    }
    halat([C[0], C[1], 0], [B[0], B[1], 0], 0.075);
    halat([DIREK_X, DIREK_TEPE, 0], [B[0], B[1], 0], 0.065);
    for (let s = -1; s <= 1; s += 2) {
        halat([DIREK_X, DIREK_TEPE - 0.3, 0], [-1.2, Y_KUP(-1.2) + 0.2, s * 2.30], 0.06);
        halat([DIREK_X, DIREK_TEPE - 0.3, 0], [7.4, Y_KUP(7.4) + 0.2, s * 2.10], 0.06);
        halat([DIREK_X, DIREK_TEPE - 0.3, 0], [-8.0, Y_KUP(-8.0) + 0.2, s * 2.20], 0.06);
    }
    halat([DIREK_X, DIREK_TEPE - 0.2, 0], [12.4, RAMB_Y + 0.7, 0], 0.06);
    const hg = new THREE.BufferGeometry();
    hg.setAttribute('position', new THREE.Float32BufferAttribute(HP, 3));
    hg.setIndex(HI);
    hg.computeVertexNormals();
    const hm = mesh(hg, C_HALAT, { flat: true, rough: 0.92, metal: 0.0,
                                   name: 'halat' });
    hm.castShadow = false;
    modelGroup.add(hm);
})();

// ===========================================================================
// 16. GÜVERTE TEÇHİZATI
// ===========================================================================
// Boş bir güverte 27 metrelik yassı bir levhaya düşer (otobüste ölçülmüş
// "düz yan yüz" hatası). Filika, ırgat, ambar ağızları ve varil dizisi hem
// ölçek veriyor hem tepeden bakışta corsia'yı dokulandırıyor.
(function techizat() {
    const L = [];
    // ambar ağızları (corsia üzerinde)
    for (const x of [-6.0, 4.2])
        L.push([x, Y_KUP(x) + 0.42, 0, 1.30, 0.13, 0.82]);
    // ırgat (bocurgat) — baş tarafta
    L.push([10.6, Y_KUP(10.6) + 0.38, 0, 0.85, 0.76, 0.85]);
    // varil dizisi. ⚠️ İLK KURULUMDA x = -12.6..-14.3 idi ve variller kıç
    // köşkü güvertesinin ALTINDA kalıyordu (köşk x=-13.9'da başlıyor,
    // tabanı 4.32; varil tepesi 4.01) — yani hiç görünmüyorlardı.
    for (let i = 0; i < 3; i++) {
        const x = 6.6 + i * 0.86;
        L.push([x, Y_KUP(x) + 0.68, 0, 0.70, 0.62, 0.70]);
    }
    kutular('guverte_techizat', L, C_KUSAK, { rough: 0.82 }).castShadow = false;
    // FİLİKA (caicco) — kıç köşkünün önünde, corsia'nın üstünde.
    const f = mesh(kutuGeo([[0, 0, 0, 4.20, 0.62, 1.15],
                            [1.75, 0.18, 0, 1.20, 0.42, 0.55],
                            [-1.75, 0.18, 0, 1.20, 0.42, 0.62]]), C_KUSAK,
                   { flat: true, rough: 0.80, name: 'filika' });
    f.position.set(-9.8, Y_KUP(-9.8) + 0.66, 0);
    modelGroup.add(f);
    // Baş tarafta demir ve loça.
    const L2 = [];
    for (let s = -1; s <= 1; s += 2) {
        const x = 11.4, v = vYukseklik(x, Y_KUP(x) - 0.60);
        const p = nokta3(x, s * v), n = normal3(x, s * v);
        L2.push([p[0], p[1], p[2] + n[2] * 0.10, 0.95, 0.70, 0.16]);
    }
    kutular('demir', L2, C_DEMIR,
            Object.assign({ flat: true }, DEMIR_MAL)).castShadow = false;
})();
