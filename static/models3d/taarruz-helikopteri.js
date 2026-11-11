// Taarruz helikopteri — AH-64 Apache sınıfı (AH-64D/E, mast üstü radarlı).
// Modern Warfare grubunun modeli. Burun +x, üst +y, taban y=0, +z SOL yan.
// Ölçüler GERÇEK METRE ve hepsi kaynaklı (aşağıda).
//
// ---------------------------------------------------------------------------
// ÖLÇÜ KAYNAĞI (ezberden yazılmadı, iki bağımsız kaynakta doğrulandı)
// ---------------------------------------------------------------------------
//   gövde boyu (burun→dengeleyici firar)  14.97 m   flugzeuginfo.net "49 ft 1 in"
//                                        (15.06 m = 49 ft 5 in ikinci kaynak)
//   toplam boy (rotor dönerken)           17.73 m   simviation "58.17 ft"
//   ana rotor çapı                        14.63 m   48 ft (Boeing/ordu verisi)
//                                        (14.60 m flugzeuginfo)
//   kuyruk rotoru çapı                     2.79 m   flugzeuginfo "9 ft 2 in"
//   kısa kanat (stub wing) açıklığı        5.227 m  simviation "17.15 ft"
//   yükseklik (rotor başlığı tepesi)       3.87 m   12 ft 8 in
//   yükseklik (Longbow radom tepesi)       4.95 m   simviation "16.25 ft"
//   ana pal veteri                         0.53 m   21 inç
//   ana iniş takımı izi                    2.03 m   6 ft 8 in
//
// ---------------------------------------------------------------------------
// KUTU — SAYILARIN TUTMASI TASARIM KARARIDIR
// ---------------------------------------------------------------------------
// Motor ölçeği `maxHoriz = max(box.x, box.z)` üzerinden kuruyor, yani kutunun
// gerçek uçağın yayınlanmış ölçüleriyle tutması gerekir. Model uzayında ana
// rotor mili x=0'a konduğunda:
//   box.x = [-10.415, +7.315] = 17.730  → yayınlanmış TOPLAM BOY, birebir
//   box.z = [ -7.315, +7.315] = 14.630  → yayınlanmış ROTOR ÇAPI, birebir
// Bunun için üç şey aynı anda tutturuldu:
//   * burun (TADS taretinin ön yüzü)         x = +4.555
//   * en arka nokta (dengeleyici firar ucu)  x = -10.415  → 14.97 gövde boyu
//   * kuyruk rotoru göbeği x = -9.02, R = 1.395 → 180°'deki pal ucu TAM
//     -10.415'te biter, yani dönerken kutuyu BÜYÜTMÜYOR.
// ⚠️ Pal fazı 0 (ilk pal +x'te, dördü 90°'de): dört palin sin/cos değerleri
// bu fazda simetrik olduğu için kutu hem x'te hem z'de rotor diskinin tam
// kendisi. Sivil helikopterde BEŞ pal vardı ve düzgün beşgenin sınır kutusu
// hiçbir fazda kare olmadığı için orada kutu rotor çapına ERİŞEMİYORDU
// (11.0 istenmiş, 10.45 çıkmıştı); dört palde bu sorun yok.
//
// ---------------------------------------------------------------------------
// SİVİL HELİKOPTERDEN AYRIŞMA (id `helikopter`) — madde madde
// ---------------------------------------------------------------------------
// İkisinin de büyük bir ana rotoru var; TEPEDEN karışma riski gerçek. Ayrım
// göz kararı değil, ölçülebilir farklarla kuruldu:
//   1. KISA KANAT + DÖRT İSTASYON. Sivilde hiç yok. Tepeden bakışta gövdenin
//      iki yanından çıkan 5.23 m'lik levha ve altındaki roket kovanı /
//      güdümlü mermi demeti siluetin ortasını dolduruyor.
//   2. UZUN İNCE KUYRUK. Gövde 14.97 m ama rotor diski 14.63; kuyruk diskin
//      ARKASINDAN 3.10 m taşıyor (17.73 - 14.63 = 3.10). Sivil helikopterde
//      gövde (11.0) rotorla (11.0) aynı, hiçbir şey taşmıyor.
//   3. DAR GÖVDE. Kabinde yarı genişlik 0.50 (gövde 1.00 m); sivilde 0.975
//      (1.95 m). Tepeden doluluk oranı bu yüzden düşük.
//   4. DÖRT PAL / BEŞ PAL.
//   5. TANDEM BASAMAKLI KOKPİT: nişancı önde ve ALÇAK (tavan 2.54), pilot
//      arkada ve YÜKSEK (2.92); aradaki 0.32 m'lik basamak 0.12 m'de
//      iniyor. Sivilde tek parça, yerden tavana dolanan geniş cam.
//   6. ÇENE TARETİ (30 mm), burun altı; sivilde orası aşağı bakış camı.
//   7. TEKERLEKLİ iniş takımı + kuyruk tekeri; sivilde kızak.
//   8. Rotor başında Longbow radomu; sivilde çıplak göbek.
//   9. Renk: askeri koyu zeytin `#616b5b`; sivil mavi `#2f6fb0`.
//
// ---------------------------------------------------------------------------
// GÖVDE NEDEN LOFT (DEVIR §3)
// ---------------------------------------------------------------------------
// ExtrudeGeometry'nin kesiti derinlik boyunca SABİTTİR. Apache gövdesi baştan
// sona kesit değiştiriyor: burunda küçük ve yuvarlak, kokpitte yassı yanaklı
// ve dar, motor güvertesinde geniş ve tepesi tümsekli, kuyruk kirişinde ince
// ve TAM DAİRESEL. Bu yüzden gövde x boyunca 44 istasyonda ayrı ayrı
// hesaplanan kapalı kesitlerin dikilmesiyle kuruluyor; altı parametrenin her
// biri kendi monoton kübik (PCHIP) eğrisinden okunuyor.
//
// ---------------------------------------------------------------------------
// PARÇA ADLARI (Studio3D bunları arar, DEĞİŞTİRME)
// ---------------------------------------------------------------------------
//   govde, kanat_*, efab_*, motor_*, dikey_kuyruk, yatay_stabilize,
//   pilon_*                                   → BİRİNCİL renk (_TINT.parts)
//   roket_kovan_*, fuze_1..8, fuze_ray_*      → İKİNCİL renk (_TINT.parts2)
//   cene_taret, top_govde, namlu, namlu_ucu   → _TURRETS (çene tareti döner)
//   cam_*                                     → koyu cam, renk almaz
//   pal_1..4, kuyruk_pal_1..4                 → AYRI ADLAR. _applyTint
//                                               getObjectByName kullanıyor,
//                                               aynı adlı meshlerden yalnız
//                                               İLKİ bulunur.
//
// ⚠️ YAZI YOK. Harita modeli soldan sağa aynalıyor (OKU.md §5.3).

// ===========================================================================
// 0. RENKLER
// ===========================================================================
const C_GOVDE  = '#616b5b';   // _TINT varsayılanı — helikopter zeytin drabı
const C_CAM    = '#141a17';
const C_CERC   = '#33392f';   // kanopi çerçevesi (gövdeden bir ton koyu)
const C_ROTOR  = '#26282a';   // pal
const C_GOBEK  = '#3a3d40';   // rotor göbeği
const C_KOYU   = '#111311';   // egzoz içi, kovan ağzı, lens
const C_STOK   = '#57604f';   // _TINT ikincil varsayılanı — mühimmat
const C_LASTIK = '#1b1d1e';
// ⚠️ KROM DİYE metalness 0.85+ VERİLMEZ: sahnede environment map yok, difüz
// bileşen sönüyor ve açı tutmayan yüzler kapkara çıkıyor (otomobilin ızgara
// çıtalarında ölçüldü). Düşük metalness + açık taban rengi hem parlıyor hem
// parçayı okutuyor.
const KROM_MAL = { metal: 0.45, rough: 0.28 };
const C_METAL  = '#9aa1a6';
const C_KIRMIZI = '#a83226';
const C_YESIL  = '#2f8f52';
const C_FAR    = '#dde6ef';

// ===========================================================================
// 1. TEMEL ÖLÇÜLER
// ===========================================================================
const ROTOR_R  = 7.315;   // ana rotor yarıçapı → çap 14.63
const MAST_X   = 0.0;     // ana rotor mili (kutu gerekçesi dosya başında)
const GOBEK_Y  = 3.52;    // göbek merkezi
const PAL_KOK  = 0.55;    // palin göbeğe bağlandığı yarıçap
const PAL_VET  = 0.53;    // pal veteri (21 inç)
const KT_X     = -9.02;   // kuyruk rotoru göbeği (pal ucu tam -10.415'te)
const KT_Y     = 2.45;
const KT_Z     = 0.26;    // fin'in +z (sol) yüzünde — gerçek makinede de solda
const KT_R     = 1.395;   // kuyruk rotoru yarıçapı → çap 2.79
const KANAT_Z  = 2.6135;  // kısa kanat yarı açıklığı → 5.227
const KANAT_Y  = 1.62;    // kanat orta hattı
const TAKIM_X  = 1.05;    // ana iniş takımı aksı (davranışın dönme pivotu)
const TAKIM_Z  = 1.015;   // ana takım izi 2.03
const R_TEKER  = 0.33;
const KUYRUK_TEKER_X = -8.20;
const R_KT_TEKER = 0.15;
const BURUN_X  = 4.555;   // TADS taretinin ön yüzü = gövde boyunun ön ucu
const KUYRUK_X = -10.415; // dengeleyici firar ucu = gövde boyunun arka ucu

// Kesitin omuz (en geniş nokta) parametresi. v=0 karın ortası, v=1 tepe
// ortası; VO en geniş yer. w = 1 - v olduğu için |w|=0.56 omuz çizgisidir.
const VO = 0.44;
const NV = 22;            // yarı kesitteki örnek sayısı (halka 2*NV-2 = 42)

// ===========================================================================
// 2. MONOTON KÜBİK EĞRİ (PCHIP)
// ===========================================================================
// Catmull-Rom BIRAKILDI (sivil helikopterde ölçüldü): kuyruk kirişinin
// gövdeye bağlandığı yerde eğim çok hızlı değiştiği için genişlik eğrisi
// kirişin üstünde tümsek atıyor. Fritsch-Carlson teğetleri yerel uç
// noktalarda sıfırlanır, taşma olmaz. Basamaklı kokpit tavanı da ancak
// monoton bir eğriyle yazılabilir: Catmull-Rom basamağın iki yanında
// çukur/tümsek üretirdi.
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

// ---- gövdenin uzunlamasına çizgileri --------------------------------------
// KARIN. Kokpitin altında 0.95 (çene tareti oraya asılıyor), kuyruk kirişinde
// 1.74'e YÜKSELİYOR. Kirişin yükselmesi helikopterin en tanıdık profil
// özelliği; düz bir kutuyla anlatılamaz.
const Y_ALT = egriYap([
    [-8.30, 1.74], [-7.80, 1.73], [-6.90, 1.71], [-5.80, 1.68],
    [-4.60, 1.64], [-3.70, 1.58], [-3.00, 1.44], [-2.40, 1.26],
    [-1.80, 1.12], [-1.20, 1.04], [-0.60, 1.00], [ 0.00, 0.98],
    [ 0.90, 0.96], [ 1.72, 0.95], [ 2.30, 0.96], [ 2.90, 1.00],
    [ 3.35, 1.08], [ 3.70, 1.22], [ 3.98, 1.42], [ 4.12, 1.60]
]);
// TEPE — BASAMAKLI TANDEM KOKPİT. Bu eğri modelin sivil helikopterden en
// keskin ayrıldığı yer:
//   x=+2.30  2.54  nişancı (ÖN) kanopisinin tepesi
//   x=+1.90  2.56  basamağın alt ucu
//   x=+1.78  2.88  basamağın üst ucu  → 0.32 m'lik düşüş 0.12 m'de, ~69° yüz
//   x=+0.90  2.92  pilot (ARKA) kanopisinin tepesi — kokpitin en yüksek yeri
//   x= 0.00  2.96  ana dişli kutusu kaportası
// Sivil helikopterde tepe çizgisi kabin boyunca DÜZ (2.55) ve tek tümseği
// motor güvertesinde; burada iki ayrı kabarcık ve aralarında basamak var.
const Y_UST = egriYap([
    [-8.30, 2.26], [-7.80, 2.28], [-6.90, 2.31], [-5.80, 2.34],
    [-4.60, 2.38], [-3.70, 2.48], [-3.00, 2.61], [-2.40, 2.71],
    [-1.80, 2.78], [-1.20, 2.83], [-0.60, 2.89], [ 0.00, 2.96],
    [ 0.45, 2.94], [ 0.90, 2.92], [ 1.45, 2.92], [ 1.78, 2.88],
    [ 1.90, 2.56], [ 2.30, 2.54], [ 2.90, 2.50], [ 3.35, 2.36],
    [ 3.70, 2.14], [ 3.98, 1.92], [ 4.12, 1.74]
]);
// EN GENİŞ NOKTANIN YÜKSEKLİĞİ. Kokpitte kanopi eşiğinin hemen altında
// (1.76-1.82) — böylece eşiğin altındaki yanaklar NEREDEYSE DİKEY kalıyor,
// Apache'nin levha gibi yan yüzü çıkıyor.
const Y_OMUZ = egriYap([
    [-8.30, 2.00], [-6.90, 2.01], [-5.80, 2.01], [-4.60, 2.01],
    [-3.70, 2.00], [-3.00, 1.98], [-2.40, 1.95], [-1.80, 1.92],
    [-1.20, 1.90], [-0.60, 1.89], [ 0.00, 1.88], [ 0.90, 1.86],
    [ 1.72, 1.82], [ 1.90, 1.78], [ 2.30, 1.76], [ 2.90, 1.73],
    [ 3.35, 1.71], [ 3.70, 1.70], [ 3.98, 1.68], [ 4.12, 1.67]
]);
// YARI GENİŞLİK. Kokpitte 0.50 → gövde 1.00 m. Bu SAYI ayrışmanın üçüncü
// maddesi: sivil helikopterde 0.975 (1.95 m). Motor güvertesinde 0.58'e
// açılıyor, kuyruk kirişinde 0.19'a düşüyor.
// ⚠️ Daralma -1.80 ile -4.60 arasına TOPLANDI. Sivil helikopterde ölçülen
// tuzak: daralma uzun bir aralığa yayılırsa yandan bakışta araç tek bir
// mercek siluetine düşüyor, "kabin bitti, kiriş başladı" sınırı okunmuyor.
const W_GOV = egriYap([
    [-8.30, 0.190], [-7.80, 0.200], [-6.90, 0.220], [-5.80, 0.250],
    [-4.60, 0.290], [-3.70, 0.340], [-3.00, 0.440], [-2.40, 0.530],
    [-1.80, 0.575], [-1.20, 0.580], [-0.60, 0.570], [ 0.00, 0.560],
    [ 0.90, 0.530], [ 1.72, 0.500], [ 1.90, 0.495], [ 2.30, 0.480],
    [ 2.90, 0.450], [ 3.35, 0.410], [ 3.70, 0.340], [ 3.98, 0.220],
    [ 4.12, 0.110]
]);
// ALT SÜPER-ELİPS ÜSSÜ. Kokpitte 0.58 → yanak karından hemen açılıp
// DİKLEŞİYOR (Apache'nin levha yan yüzü). Kuyruk kirişinde 1.0 → tam elips.
const N_ALT = egriYap([
    [-8.30, 1.00], [-6.90, 1.00], [-4.60, 0.92], [-3.00, 0.80],
    [-1.80, 0.68], [-0.60, 0.63], [ 0.90, 0.60], [ 1.90, 0.58],
    [ 2.90, 0.58], [ 3.35, 0.64], [ 3.70, 0.76], [ 3.98, 0.92],
    [ 4.12, 1.00]
]);
// ÜST SÜPER-ELİPS ÜSSÜ. Kanopi bölgesinde 0.66 → kabarcık yayvan, kanopinin
// düz panelli görüntüsüne yaklaşıyor.
const N_UST = egriYap([
    [-8.30, 1.00], [-6.90, 1.00], [-4.60, 0.94], [-3.00, 0.86],
    [-1.80, 0.76], [-0.60, 0.72], [ 0.90, 0.70], [ 1.90, 0.66],
    [ 2.90, 0.66], [ 3.35, 0.72], [ 3.70, 0.82], [ 3.98, 0.94],
    [ 4.12, 1.00]
]);

// ===========================================================================
// 3. KESİT
// ===========================================================================
function kesitPar(x) {
    const yA = Y_ALT(x), yU = Y_UST(x);
    let yO = Y_OMUZ(x);
    // Omuz iki uç arasında KALMALI, yoksa süper-elips ters dönüp kesit kendi
    // içine katlanıyor (burun ucunda birkaç mm için düğümlenir).
    yO = Math.max(yA + 0.02, Math.min(yU - 0.02, yO));
    return { yA: yA, yU: yU, yO: yO, w: Math.max(0.02, W_GOV(x)),
             nA: N_ALT(x), nU: N_UST(x) };
}

// Yarı kesitin v parametresindeki noktası → [z, y].
function kesitNokta(P, v) {
    if (v <= VO) {
        const th = (v / VO) * Math.PI / 2;
        return [P.w * Math.pow(Math.sin(th), P.nA),
                P.yO - (P.yO - P.yA) * Math.pow(Math.cos(th), P.nA)];
    }
    const th = ((v - VO) / (1 - VO)) * Math.PI / 2;
    return [P.w * Math.pow(Math.cos(th), P.nU),
            P.yO + (P.yU - P.yO) * Math.pow(Math.sin(th), P.nU)];
}

// Yüzey noktası. w ∈ [-1,1]: 0 = tepe orta hattı, +1 = +z tarafında karın.
function nokta3(x, w) {
    const p = kesitNokta(kesitPar(x), 1 - Math.abs(w));
    return [x, p[1], (w < 0 ? -p[0] : p[0])];
}

// Sayısal yüzey normali (dışa bakar). Paneller yüzeyden bu yönde ötelenir.
function normal3(x, w) {
    const h = 0.0035;
    const hx = (x > 4.12 - 0.004) ? -h : h;
    const hw = (Math.abs(w) > 0.996) ? -h : h;
    const a = nokta3(x, w), b = nokta3(x + hx, w), c = nokta3(x, w + hw);
    const ux = b[0] - a[0], uy = b[1] - a[1], uz = b[2] - a[2];
    const vx = c[0] - a[0], vy = c[1] - a[1], vz = c[2] - a[2];
    let nx = uy * vz - uz * vy, ny = uz * vx - ux * vz, nz = ux * vy - uy * vx;
    const L = Math.sqrt(nx * nx + ny * ny + nz * nz) || 1;
    nx /= L; ny /= L; nz /= L;
    const P = kesitPar(x), yc = (P.yA + P.yU) / 2;
    if (ny * (a[1] - yc) + nz * a[2] < 0) { nx = -nx; ny = -ny; nz = -nz; }
    return [nx, ny, nz];
}

// ===========================================================================
// 4. GÖVDE KABUĞU (loft)
// ===========================================================================
// İstasyonlar KESİTİN HIZLI DEĞİŞTİĞİ yerlerde sık: kanopi basamağı
// (1.62-2.05 arasında altı istasyon), burun kavisi ve kirişin gövdeden
// ayrıldığı bölge. Kirişin düz yerinde sık örneklemek yalnız üçgen harcar.
const IST = [
    -8.300, -8.100, -7.800, -7.400, -6.900, -6.400, -5.800, -5.200,
    -4.600, -4.100, -3.700, -3.350, -3.000, -2.700, -2.400, -2.100,
    -1.800, -1.500, -1.200, -0.900, -0.600, -0.300,  0.000,  0.300,
     0.600,  0.900,  1.100,  1.300,  1.450,  1.560,  1.620,  1.680,
     1.720,  1.770,  1.800,  1.840,  1.900,  1.970,  2.050,  2.170,
     2.300,  2.450,  2.600,  2.750,  2.900,  3.030,  3.150,  3.260,
     3.350,  3.450,  3.550,  3.630,  3.700,  3.780,  3.850,  3.920,
     3.980,  4.030,  4.080,  4.120
];
const R_HALKA = 2 * NV - 2;

function halka(x) {
    const P = kesitPar(x), yarim = [];
    for (let i = 0; i < NV; i++) yarim.push(kesitNokta(P, i / (NV - 1)));
    const r = [];
    for (let i = 0; i < NV; i++) r.push([yarim[i][1], yarim[i][0]]);
    for (let i = NV - 2; i >= 1; i--) r.push([yarim[i][1], -yarim[i][0]]);
    return r;
}

(function govdeKur() {
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
    // Ön/arka kapak: düz üçgen yelpaze. Halka köşeleri KOPYALANIYOR ki
    // computeVertexNormals kapağın normalini yanınkiyle ortalamasın.
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
    modelGroup.add(mesh(geo, C_GOVDE, { metal: 0.30, rough: 0.52, name: 'govde' }));
})();

// ===========================================================================
// 5. YÜZEYE OTURAN PANELLER (kanopi camları + çerçeveler)
// ===========================================================================
// Gövde yüzeyi x1..x2 ve w1..w2 aralığında yeniden örnekleniyor ve normal
// boyunca `disari` kadar ötelenıyor; panel gövdenin kavisine BİREBİR oturuyor.
// ⚠️ nx / nw: bandın UZUN kenarına çok bölüntü verilmezse şerit yüzeyin
// kavisini takip edemeyip İÇİNE girer ve KAYBOLUR (otobüste ölçüldü).
function yuzeyYama(ad, bantlar, nx, nw, disari, renk, opts) {
    opts = opts || {};
    const P = [], IDX = [];
    for (const bant of bantlar) {
        const x1 = bant[0], x2 = bant[1], a1 = bant[2], a2 = bant[3];
        const taban = P.length / 3, S = nw + 1;
        for (let i = 0; i <= nx; i++) {
            const x = x1 + (x2 - x1) * i / nx;
            for (let j = 0; j <= nw; j++) {
                const w = a1 + (a2 - a1) * j / nw;
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
        metal: opts.metal == null ? 0.3 : opts.metal,
        rough: opts.rough == null ? 0.35 : opts.rough, name: ad
    });
    m.material.side = THREE.DoubleSide;
    // Kalınlıksız paneller GÖLGE DÜŞÜRMEZ: gövdeye 6-12 mm mesafede
    // duruyorlar, gölge haritasında kendi gölgelerini gövdeye basıp benek
    // (acne) üretiyorlardı.
    m.castShadow = false;
    modelGroup.add(m);
    return m;
}

// ---- TANDEM KANOPİ --------------------------------------------------------
// Apache'yi Apache yapan birinci şey. Sivil helikopterde kanopi TEK PARÇA ve
// yerden tavana dolanıyor; burada İKİ AYRI KABARCIK var, arkadaki (pilot)
// öndekinden 0.30 m yüksek ve aralarında dik bir basamak yüzü duruyor.
// Camlar w=±0.055'ten başlıyor: aradaki şerit gövde renginde kalıyor ve
// kanopi ORTA KİRİŞİ kendiliğinden çıkıyor (ayrı bir çıta koysaydık havada
// duran bir levha gibi okunurdu — motosiklet dersi).
[1, -1].forEach(function (s, i) {
    // NİŞANCI (ÖN) KANOPİSİ: alçak, uzun, öne doğru daralan.
    yuzeyYama('cam_nisanci_' + (i + 1), [
        [1.95, 3.52, s * 0.180, s * 0.520],   // yan panel
        [2.05, 3.46, s * 0.055, s * 0.180]    // tavan paneli
    ], 14, 8, 0.011, C_CAM, { metal: 0.35, rough: 0.16 });
    // ÖN CAM (nişancının önü) — burna doğru kavisli, kısa.
    yuzeyYama('cam_on_' + (i + 1),
              [[3.52, 3.90, s * 0.070, s * 0.480]], 6, 9, 0.011, C_CAM,
              { metal: 0.35, rough: 0.16 });
    // PİLOT (ARKA) KANOPİSİ: yüksek, kısa, basamağın üstünde.
    yuzeyYama('cam_pilot_' + (i + 1), [
        [0.72, 1.70, s * 0.180, s * 0.500],
        [0.80, 1.66, s * 0.055, s * 0.180]
    ], 9, 8, 0.011, C_CAM, { metal: 0.35, rough: 0.16 });
});

// ---- KANOPİ ÇERÇEVELERİ ---------------------------------------------------
// Apache kanopisi DÜZ PANELLERDEN kurulur (kavisli cam yansıma yapıp
// helikopteri ele verdiği için); paneller arası kalın çerçevelerle ayrılır.
// Loft yüzeyi kavisli olduğu için panelleri gerçekten düzleştiremiyoruz;
// çerçeveler o okumayı veriyor.
[1, -1].forEach(function (s, i) {
    // dikey bölmeler (nişancı kanopisi üç panele bölünüyor)
    yuzeyYama('cerceve_nis_' + (i + 1), [
        [2.44, 2.50, s * 0.055, s * 0.525],
        [2.98, 3.04, s * 0.055, s * 0.525],
        [3.49, 3.55, s * 0.055, s * 0.525]
    ], 1, 12, 0.013, C_CERC, { metal: 0.2, rough: 0.62 });
    // pilot kanopisinin dikey bölmesi + basamak yüzünün kenarı
    yuzeyYama('cerceve_pil_' + (i + 1), [
        [1.20, 1.26, s * 0.055, s * 0.510],
        [1.67, 1.73, s * 0.055, s * 0.510],
        [0.69, 0.75, s * 0.055, s * 0.510]
    ], 1, 12, 0.013, C_CERC, { metal: 0.2, rough: 0.62 });
    // eşik (yatay) çerçeve: iki kanopinin altını boydan boya çeviriyor
    yuzeyYama('cerceve_esik_' + (i + 1), [
        [0.69, 1.73, s * 0.510, s * 0.545],
        [1.95, 3.55, s * 0.520, s * 0.556]
    ], 18, 1, 0.012, C_CERC, { metal: 0.2, rough: 0.62 });
});

// ===========================================================================
// 6. HACİMLİ PARÇALAR — yardımcılar
// ===========================================================================
const cyl = (rt, rb, h, s) => new THREE.CylinderGeometry(rt, rb, h, s || 14);
const box = (w, h, d) => new THREE.BoxGeometry(w, h, d);

// İki nokta arasına silindir (iniş takımı bacakları, antenler).
function boru(ad, p1, p2, r, renk, opts) {
    opts = opts || {};
    const a = new THREE.Vector3(p1[0], p1[1], p1[2]);
    const b = new THREE.Vector3(p2[0], p2[1], p2[2]);
    const d = new THREE.Vector3().subVectors(b, a);
    const m = mesh(cyl(r, r, d.length(), opts.seg || 10), renk, {
        metal: opts.metal == null ? 0.4 : opts.metal,
        rough: opts.rough == null ? 0.4 : opts.rough, name: ad
    });
    m.position.set((p1[0] + p2[0]) / 2, (p1[1] + p2[1]) / 2, (p1[2] + p2[2]) / 2);
    m.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), d.normalize());
    modelGroup.add(m);
    return m;
}

// Yassı, süpürülmüş yüzey: şekil (x,y) düzleminde yazılır, z'de kalınlaşır.
// ⚠️ Kalınlıksız kabuk aks doğrultusundan görünmez (çamurlukta ölçüldü):
// tam yandan bakışta saç teli inceliğinde bir çizgiye düşer → EXTRUDE.
// ⚠️ bevelEnabled: false. THREE'nin bevelSize'ı konturu DIŞARI iter
// (motokaravanda ölçüldü: şekil 3.50'de yazılıyken kutu 3.530 ölçtü).
function levha(ad, pts, kalin, renk, opts) {
    opts = opts || {};
    const s = new THREE.Shape();
    s.moveTo(pts[0][0], pts[0][1]);
    for (let i = 1; i < pts.length; i++) s.lineTo(pts[i][0], pts[i][1]);
    s.closePath();
    const g = new THREE.ExtrudeGeometry(s, { depth: kalin, bevelEnabled: false, steps: 1 });
    g.translate(0, 0, -kalin / 2);
    const m = mesh(g, renk, {
        metal: opts.metal == null ? 0.3 : opts.metal,
        rough: opts.rough == null ? 0.5 : opts.rough,
        flat: !!opts.flat, name: ad
    });
    modelGroup.add(m);
    return m;
}

// ===========================================================================
// 7. ÖN GÖVDE YAN KUTULARI (EFAB) + BURUN SENSÖRLERİ + ÇENE TARETİ
// ===========================================================================
// EFAB (genişletilmiş ön aviyonik bölmesi): nişancı kabininin iki yanındaki
// yassı kutular. Apache'nin ön gövdesini "omuzlu" gösteren şey bunlar ve
// hiçbir sivil helikopterde yok.
[1, -1].forEach(function (s, i) {
    const ef = levha('efab_' + (i + 1),
        [[1.82, 1.40], [3.28, 1.52], [3.34, 1.86], [3.20, 2.00], [1.88, 2.04]],
        0.30, C_GOVDE, { metal: 0.30, rough: 0.52 });
    ef.position.z = s * 0.66;   // gövde yarı genişliği burada 0.45-0.50
});

// BURUN SENSÖR TARETİ (TADS — hedefleme/nişan) : modelin EN ÖN noktası.
// Merkez 4.26, yarıçap 0.30 → ön yüz 4.56 ≈ gövde boyunun ön ucu (4.555).
const tads = mesh(cyl(0.30, 0.30, 0.52, 18), '#3d443b',
                  { metal: 0.35, rough: 0.45, name: 'tads' });
tads.rotation.x = Math.PI / 2;      // ekseni z → yanal, taret gibi
tads.position.set(4.26, 1.72, 0);
modelGroup.add(tads);
const tadsLens = mesh(cyl(0.17, 0.17, 0.06, 14), C_KOYU,
                      { metal: 0.2, rough: 0.25, name: 'tads_lens' });
tadsLens.rotation.z = Math.PI / 2;
tadsLens.position.set(4.55, 1.72, 0);
modelGroup.add(tadsLens);
// GECE GÖRÜŞ TARETİ (PNVS): burnun ÜSTÜNDE, ön camın hemen önünde. TADS ile
// birlikte "nişan + gece görüş" ikilisini kuruyor; ikisinin ayrı ayrı burun
// altında ve burun üstünde durması Apache'nin imzası.
const pnvs = mesh(cyl(0.19, 0.19, 0.34, 14), '#3d443b',
                  { metal: 0.35, rough: 0.45, name: 'pnvs' });
pnvs.rotation.x = Math.PI / 2;
pnvs.position.set(4.02, 2.02, 0);
modelGroup.add(pnvs);
const pnvsLens = mesh(cyl(0.10, 0.10, 0.05, 12), C_KOYU,
                      { metal: 0.2, rough: 0.25, name: 'pnvs_lens' });
pnvsLens.rotation.z = Math.PI / 2;
pnvsLens.position.set(4.20, 2.02, 0);
modelGroup.add(pnvsLens);

// ---- ÇENE TARETİ (30 mm zincirli top) -------------------------------------
// _TURRETS['taarruz-helikopteri'] bu dört parçayı pivot [2.95, 0] etrafında
// dönen bir gruba taşıyor; ateş modunda gövde sabit kalırken taret hedefe
// dönüyor. Parçalar modelGroup'un DOĞRUDAN çocuğu ve konumları `position`
// ile veriliyor — motor `o.position.x -= pivot[0]` yapıyor, geometriye
// gömülü ötelemeyle çalışmazdı.
// ⚠️ Namlunun adı TAM `namlu`: motor ağız alevini `getObjectByName('namlu')`
// ile buluyor, başka adla alev gövdenin burnundan çıkardı.
const taretYoke = mesh(box(0.44, 0.34, 0.62), '#3f463c',
                       { metal: 0.35, rough: 0.5, name: 'cene_taret' });
taretYoke.position.set(2.95, 0.98, 0);
modelGroup.add(taretYoke);
const topGovde = mesh(box(0.62, 0.30, 0.34), '#33382f',
                      { metal: 0.4, rough: 0.42, name: 'top_govde' });
topGovde.position.set(3.02, 0.74, 0);
modelGroup.add(topGovde);
const namlu = mesh(cyl(0.052, 0.052, 1.30, 12), '#2b2e2a',
                   { metal: 0.45, rough: 0.35, name: 'namlu' });
namlu.rotation.z = Math.PI / 2;
namlu.position.set(3.94, 0.74, 0);
modelGroup.add(namlu);
const namluUcu = mesh(cyl(0.072, 0.072, 0.14, 12), '#242723',
                      { metal: 0.45, rough: 0.35, name: 'namlu_ucu' });
namluUcu.rotation.z = Math.PI / 2;
namluUcu.position.set(4.36, 0.74, 0);
modelGroup.add(namluUcu);

// ===========================================================================
// 8. KISA KANATLAR (STUB WINGS) + DÖRT İSTASYON
// ===========================================================================
// Sivil helikopterden ayrışmanın BİRİNCİ maddesi ve tepeden bakışın anahtarı.
// Açıklık 5.227 m (yayınlanmış), veter 1.35, kalınlık 0.22.
// Kanat `levha` ile kuruluyor: şekil (x,y) düzleminde bir mercek kesiti,
// z'de kanat açıklığı kadar uzatılıyor. Sabit veterli — gerçek Apache kanadı
// da neredeyse dikdörtgen.
[1, -1].forEach(function (s, i) {
    const kn = levha('kanat_' + (i + 1), [
        [ 0.35, KANAT_Y],
        [ 0.26, KANAT_Y + 0.085], [-0.20, KANAT_Y + 0.110],
        [-1.00, KANAT_Y + 0.020], [-1.00, KANAT_Y - 0.020],
        [-0.20, KANAT_Y - 0.110], [ 0.26, KANAT_Y - 0.085]
    ], KANAT_Z - 0.50, C_GOVDE, { metal: 0.30, rough: 0.52 });
    kn.position.z = s * (0.50 + (KANAT_Z - 0.50) / 2);
    kn.rotation.x = s * 0.045;      // hafif anhedral (uçlar aşağı)

    // PİLONLAR — dördü de kanat altında, iç 1.05 dış 2.10.
    [[1.05, 'ic'], [2.10, 'dis']].forEach(function (p) {
        const pl = mesh(box(0.88, 0.40, 0.17), C_GOVDE,
                        { metal: 0.30, rough: 0.52,
                          name: 'pilon_' + p[1] + '_' + (i + 1) });
        pl.position.set(-0.24, KANAT_Y - 0.24, s * p[0]);
        modelGroup.add(pl);
    });

    // İÇ İSTASYON: 19 tüplü roket kovanı (Hydra 70).
    const kov = mesh(cyl(0.245, 0.245, 1.72, 18), C_STOK,
                     { metal: 0.3, rough: 0.5, name: 'roket_kovan_' + (i + 1) });
    kov.rotation.z = Math.PI / 2;
    kov.position.set(-0.22, KANAT_Y - 0.60, s * 1.05);
    modelGroup.add(kov);
    // Kovanın ağzı: tüpler görünsün diye koyu bir disk. Kovanın ön yüzünden
    // 5 mm ÖNDE — tam üstünde olsaydı derinlik kavgası benek yapardı.
    const agz = mesh(cyl(0.225, 0.225, 0.05, 18), C_KOYU,
                     { metal: 0.2, rough: 0.9, name: 'kovan_agiz_' + (i + 1) });
    agz.rotation.z = Math.PI / 2;
    agz.position.set(0.665, KANAT_Y - 0.60, s * 1.05);
    modelGroup.add(agz);

    // DIŞ İSTASYON: dörtlü güdümlü mermi rampası.
    const ray = mesh(box(1.50, 0.16, 0.44), C_STOK,
                     { metal: 0.35, rough: 0.45, name: 'fuze_ray_' + (i + 1) });
    ray.position.set(-0.24, KANAT_Y - 0.40, s * 2.10);
    modelGroup.add(ray);
    // Dört mermi: altta iki, yanlarda iki (M299 dörtlü rampanın dizilişi).
    // ⚠️ HER BİRİNE AYRI AD: _applyTint getObjectByName kullanıyor, aynı
    // adlı meshlerden yalnız İLKİ renk alır.
    const yer = [[-0.166, -0.66], [0.166, -0.66], [-0.240, -0.34], [0.240, -0.34]];
    for (let k = 0; k < 4; k++) {
        // Uçtan sivrilen gövde: rt (+x ucu) küçük → burun konisi.
        const fz = mesh(cyl(0.052, 0.089, 1.63, 14), C_STOK,
                        { metal: 0.35, rough: 0.42,
                          name: 'fuze_' + (i * 4 + k + 1) });
        fz.rotation.z = -Math.PI / 2;
        fz.position.set(-0.20, KANAT_Y + yer[k][1], s * (2.10 + yer[k][0]));
        modelGroup.add(fz);
    }
});

// ===========================================================================
// 9. MOTOR NASELLERİ + EGZOZ
// ===========================================================================
// İki turboşaft gövdenin iki yanında, kanat kökünün üstünde. Sivil
// helikopterde motorlar gövde İÇİNDE (sırtta tümsek); burada dışarıda, ayrı
// iki silindir — yandan ve tepeden bakışta belirgin.
[1, -1].forEach(function (s, i) {
    const mtr = mesh(cyl(0.50, 0.50, 3.30, 20), C_GOVDE,
                     { metal: 0.30, rough: 0.52, name: 'motor_' + (i + 1) });
    mtr.rotation.z = Math.PI / 2;
    mtr.position.set(-0.95, 2.12, s * 0.86);
    modelGroup.add(mtr);
    // Hava girişi: nasellerin önünde, parçacık ayırıcı ağzı.
    const gir = mesh(cyl(0.42, 0.46, 0.26, 14), '#3a403a',
                     { metal: 0.3, rough: 0.55, name: 'hava_girisi_' + (i + 1) });
    gir.rotation.z = Math.PI / 2;
    gir.position.set(0.78, 2.12, s * 0.86);
    modelGroup.add(gir);
    const girIc = mesh(cyl(0.33, 0.33, 0.06, 14), C_KOYU,
                       { rough: 0.9, name: 'giris_ic_' + (i + 1) });
    girIc.rotation.z = Math.PI / 2;
    girIc.position.set(0.86, 2.12, s * 0.86);
    modelGroup.add(girIc);
    // KIZILÖTESİ BASTIRMALI EGZOZ: Apache'nin arka gövdesindeki köşeli
    // kutular. Yuvarlak boru DEĞİL — bastırıcı gerçekten dikdörtgen ve
    // yukarı-dışa bakıyor; siluetteki köşeli kütle tanınma işareti.
    const egz = mesh(box(0.86, 0.50, 0.60), '#3c423a',
                     { metal: 0.35, rough: 0.5, name: 'egzoz_' + (i + 1) });
    egz.position.set(-2.68, 2.28, s * 0.90);
    egz.rotation.z = -0.12;
    egz.rotation.y = -s * 0.16;
    modelGroup.add(egz);
    const egzIc = mesh(box(0.06, 0.36, 0.44), C_KOYU,
                       { rough: 0.95, name: 'egzoz_ic_' + (i + 1) });
    egzIc.position.set(-3.10, 2.23, s * 0.97);
    egzIc.rotation.z = -0.12;
    egzIc.rotation.y = -s * 0.16;
    modelGroup.add(egzIc);
});
// Ana dişli kutusu kaportası (mast'ın oturduğu kaide)
const mgb = mesh(cyl(0.46, 0.58, 0.34, 18), '#42483f',
                 { metal: 0.35, rough: 0.45, name: 'disli_kaporta' });
mgb.position.set(MAST_X, 3.02, 0);
modelGroup.add(mgb);

// ===========================================================================
// 10. ANA ROTOR — DÖRT PAL
// ===========================================================================
// Pal sayısı ayrışmanın dördüncü maddesi: sivil helikopterde BEŞ pal.
// ⚠️ FAZ 0 (ilk pal +x'te, dördü 90° arayla): kutu hem x'te hem z'de tam
// rotor diski oluyor (dosya başındaki kutu gerekçesi).
const mast = mesh(cyl(0.135, 0.155, 0.44, 12), C_METAL,
                  { metal: 0.45, rough: 0.3, name: 'rotor_mili' });
mast.position.set(MAST_X, 3.28, 0);
modelGroup.add(mast);

const rotor = spin({ pivot: [MAST_X, GOBEK_Y, 0], axis: 'y', rpm: 180 });
// Göbek + başlık: spin grubunun İÇİNDE (mil sabit, göbek döner).
const gobek = mesh(cyl(0.40, 0.42, 0.32, 18), C_GOBEK,
                   { metal: 0.4, rough: 0.35, name: 'rotor_gobek' });
rotor.add(gobek);
const baslik = mesh(cyl(0.20, 0.36, 0.22, 18), C_GOBEK,
                    { metal: 0.4, rough: 0.35, name: 'rotor_baslik' });
baslik.position.y = 0.24;   // tepesi 3.52 + 0.24 + 0.11 = 3.87 = yayınlanmış
rotor.add(baslik);          // "rotor başlığı tepesi" yüksekliği
// Swashplate (hatve bileziği): göbeğin altındaki ince halka.
const bilezik = mesh(cyl(0.44, 0.44, 0.08, 18), C_METAL,
                     { metal: 0.45, rough: 0.3, name: 'rotor_bilezik' });
bilezik.position.y = -0.24;
rotor.add(bilezik);

for (let i = 0; i < 4; i++) {
    const a = i * Math.PI / 2;
    // Pal kalınlığı 0.11: kalınlıksız levha tepeden ve dönerken kaybolur.
    // ⚠️ HATVE (feathering) GEOMETRİYE İŞLENİYOR, mesh.rotation ile DEĞİL:
    // Euler XYZ sırasında Rx en DIŞTA uygulanır, `rotation.x` palin kendi
    // uzun ekseni yerine MODELİN x ekseni etrafında dönerdi ve +z'ye bakan
    // palin ucu havalanıp kutunun y'sini büyütürdü (sivil helikopterde
    // ölçüldü). rotateX → translate → rotateY sırası belirsizliği kaldırıyor.
    const bg = box(ROTOR_R - PAL_KOK, 0.11, PAL_VET);
    bg.rotateX(0.05);
    bg.translate((PAL_KOK + ROTOR_R) / 2, 0, 0);
    bg.rotateY(-a);
    const bl = mesh(bg, C_ROTOR,
                    { metal: 0.15, rough: 0.55, name: 'pal_' + (i + 1) });
    rotor.add(bl);
    // KÖK MANŞONU: palin göbeğe girdiği yer.
    const kok = mesh(cyl(0.095, 0.095, 0.34, 8), C_METAL,
                     { metal: 0.45, rough: 0.3, name: 'pal_kok_' + (i + 1) });
    kok.rotation.z = Math.PI / 2;
    kok.rotation.y = -a;
    kok.position.set(Math.cos(a) * 0.36, 0, Math.sin(a) * 0.36);
    rotor.add(kok);
}

// ---- MAST ÜSTÜ ATIŞ KONTROL RADOMU (Longbow) ------------------------------
// Rotor başının ÜSTÜNDE, dönmeyen bir sütunun ucunda duran mantar biçimli
// kutu. Tepeden bakışta rotor merkezinde bir disk bırakıyor — sivil
// helikopterde orada yalnız küçük bir göbek var. Model yüksekliğini
// yayınlanmış AH-64D Longbow değerine (4.95 m) çıkaran parça da bu.
// ⚠️ spin grubunun DIŞINDA: gerçek makinede de radom dönmez, rotor onun
// altından geçer.
const radomMil = mesh(cyl(0.095, 0.095, 0.80, 10), C_METAL,
                      { metal: 0.45, rough: 0.32, name: 'radom_mil' });
radomMil.position.set(MAST_X, 4.05, 0);
modelGroup.add(radomMil);
const radom = mesh(cyl(0.52, 0.50, 0.50, 22), '#4b5249',
                   { metal: 0.28, rough: 0.55, name: 'radom' });
radom.position.set(MAST_X, 4.70, 0);   // tepesi 4.95 = yayınlanmış yükseklik
modelGroup.add(radom);

// ===========================================================================
// 11. KUYRUK: FİN + DENGELEYİCİ + KUYRUK ROTORU
// ===========================================================================
// FİN. Kökü (y 1.90-2.00) kirişin tepesinin (2.26-2.31) ALTINDA kalıyor ki
// parçalar birbirine GİRSİN: matematiksel olarak değmek görsel sürekliliği
// vermiyor (motosiklet dersi).
// ⚠️ İLK SÜRÜMDE FİN ÇOK DOLUYDU: firar kenarı tabanda x=-10.30'a kadar
// gidiyordu ve yandan bakışta kuyruk, kiriş+fin+dengeleyici tek bir kama
// kütlesine düşüyordu (cikti/bakis'te görüldü). Firar kenarı yukarıdan
// aşağı ÖNE kaçırıldı (-9.72 → -9.55) ve taban kısaltıldı: kirişin alt
// yarısı fin'in altından görünüyor.
levha('dikey_kuyruk', [
    [-6.75, 1.99], [-8.35, 2.96], [-9.16, 3.26], [-9.66, 3.12],
    [-9.72, 2.62], [-9.55, 2.06], [-8.70, 1.90], [-7.40, 1.90]
], 0.16, C_GOVDE, { metal: 0.30, rough: 0.52 });
// KUYRUK DİŞLİ KUTUSU KAPORTASI: rotor göbeğinin oturduğu kabartı.
const ktKaporta = mesh(cyl(0.26, 0.30, 0.30, 14), '#42483f',
                       { metal: 0.35, rough: 0.45, name: 'kuyruk_kaporta' });
ktKaporta.rotation.x = Math.PI / 2;
ktKaporta.position.set(KT_X, KT_Y, 0.06);
modelGroup.add(ktKaporta);

// KUYRUK KONİSİ: loft x=-8.30'da bitiyor, ama gerçek makinede kiriş fin'in
// ALTINDAN devam edip dengeleyiciyi taşıyor. Bu koni olmadan dengeleyici
// fin'in arkasında havada kalıyordu.
const ktKoni = mesh(cyl(0.20, 0.11, 1.95, 14), C_GOVDE,
                    { metal: 0.30, rough: 0.52, name: 'kuyruk_koni' });
ktKoni.rotation.z = -Math.PI / 2;    // geniş uç +x'te (öne), ince uç arkada
ktKoni.position.set(-9.275, 2.00, 0);
modelGroup.add(ktKoni);

// YATAY DENGELEYİCİ (stabilator): TEK PARÇA, kuyruğun EN ARKASINDA.
// Sivil helikopterde kirişin iki yanında iki ayrı kanatçık + uç levhası
// vardı; Apache'de tek yüzey ve kuyruk konisinin ucunda. Firar ucu
// x=-10.415 = gövde boyunun (14.97 m) arka sınırı.
// ⚠️ Veter 1.10 denendi ve tepeden bakışta dengeleyici kuyruğun ucunda
// KARE bir levha gibi okunuyordu; 0.85 ile açıklık/veter oranı 4.0 oluyor,
// gerçek makinedeki oranla aynı.
const stab = levha('yatay_stabilize', [
    [-9.565, 1.98], [-9.66, 2.05], [-10.05, 2.05], [-10.415, 1.99],
    [-10.415, 1.95], [-10.05, 1.90], [-9.66, 1.90]
], 3.40, C_GOVDE, { metal: 0.30, rough: 0.52 });
stab.position.z = 0;

// KUYRUK ROTORU. Ekseni YANAL (z): itişi yana bakar, gövdeyi döndüren torku
// dengeler. spin({axis:'z'}) tam bunu veriyor.
// ⚠️ APACHE'NİN İMZASI: dört pal DİK DEĞİL, 55°'lik "X" düzeninde iki ayrı
// çift. Faz öyle seçildi ki bir pal tam -x'e bakıyor: pal ucu -10.415'te,
// yani dönerken kutuyu BÜYÜTMÜYOR (dosya başındaki kutu gerekçesi).
const ktMil = mesh(cyl(0.075, 0.075, 0.30, 10), C_METAL,
                   { metal: 0.45, rough: 0.3, name: 'kuyruk_mili' });
ktMil.rotation.x = Math.PI / 2;
ktMil.position.set(KT_X, KT_Y, KT_Z - 0.12);
modelGroup.add(ktMil);

const ktRotor = spin({ pivot: [KT_X, KT_Y, KT_Z], axis: 'z', rpm: 740 });
const ktGobek = mesh(cyl(0.16, 0.16, 0.15, 12), C_GOBEK,
                     { metal: 0.4, rough: 0.35, name: 'kuyruk_gobek' });
ktGobek.rotation.x = Math.PI / 2;
ktRotor.add(ktGobek);
const KT_ACI = [0, 55, 180, 235];
for (let i = 0; i < 4; i++) {
    const a = KT_ACI[i] * Math.PI / 180;
    const bl = mesh(box(KT_R - 0.16, 0.22, 0.06), C_ROTOR,
                    { metal: 0.15, rough: 0.55, name: 'kuyruk_pal_' + (i + 1) });
    const rm = (0.16 + KT_R) / 2;
    bl.position.set(Math.cos(a) * rm, Math.sin(a) * rm, 0);
    bl.rotation.z = a;
    ktRotor.add(bl);
}

// ===========================================================================
// 12. İNİŞ TAKIMI — TEKERLEKLİ (ayrışmanın yedinci maddesi)
// ===========================================================================
// Sivil helikopter KIZAKLA iner; Apache'nin sabit, çekilmeyen tekerlekli
// takımı var: iki ana teker önde (iz 2.03) ve arkada bir kuyruk tekeri.
[1, -1].forEach(function (s, i) {
    const z = s * TAKIM_Z;
    const tk = mesh(cyl(R_TEKER, R_TEKER, 0.20, 20), C_LASTIK,
                    { metal: 0.1, rough: 0.85, name: 'teker_' + (i + 1) });
    tk.rotation.x = Math.PI / 2;
    tk.position.set(TAKIM_X, R_TEKER, z);
    modelGroup.add(tk);
    const jn = mesh(cyl(0.155, 0.155, 0.22, 12), '#6d747a',
                    { metal: 0.4, rough: 0.4, name: 'jant_' + (i + 1) });
    jn.rotation.x = Math.PI / 2;
    jn.position.set(TAKIM_X, R_TEKER, z);
    modelGroup.add(jn);
    // Çekme kollu bacak: aks gövdeye ARKADAN bağlanıyor (gerçek makinedeki
    // trailing-link düzeni). Uçları gövdenin İÇİNDE bitiyor — parçalar
    // birbirine GİRMELİ, matematiksel değme görsel süreklilik vermiyor.
    boru('bacak_' + (i + 1), [TAKIM_X, R_TEKER, z], [0.28, 1.10, s * 0.52],
         0.075, '#7b8288', Object.assign({ seg: 10 }, KROM_MAL));
    // Amortisör: aksın üstünden gövdeye
    boru('amortisor_' + (i + 1), [TAKIM_X + 0.06, R_TEKER + 0.06, z],
         [1.28, 1.24, s * 0.56], 0.055, '#9aa1a6',
         Object.assign({ seg: 8 }, KROM_MAL));
});
// KUYRUK TEKERİ: uzun çekme kolunun ucunda, fin'in dibinde.
const ktTeker = mesh(cyl(R_KT_TEKER, R_KT_TEKER, 0.12, 14), C_LASTIK,
                     { metal: 0.1, rough: 0.85, name: 'kuyruk_teker' });
ktTeker.rotation.x = Math.PI / 2;
ktTeker.position.set(KUYRUK_TEKER_X, R_KT_TEKER, 0);
modelGroup.add(ktTeker);
boru('kuyruk_bacak', [KUYRUK_TEKER_X, R_KT_TEKER, 0], [-7.42, 1.80, 0],
     0.062, '#7b8288', Object.assign({ seg: 8 }, KROM_MAL));
boru('kuyruk_destek', [KUYRUK_TEKER_X, R_KT_TEKER + 0.02, 0], [-8.62, 1.92, 0],
     0.045, '#7b8288', Object.assign({ seg: 6 }, KROM_MAL));

// ===========================================================================
// 13. KÜÇÜK PARÇALAR
// ===========================================================================
// İNİŞ FARI: burnun altında, YARISI karnın dışında. Karın x=3.55'te 1.14;
// merkez 1.10 ve yarıçap 0.10 → alt yarısı taşıyor. Tamamen içeride
// bıraksaydık hiç görünmezdi, tamamen dışarıda havada duran bir disk olurdu.
const far = mesh(cyl(0.10, 0.10, 0.06, 14), C_FAR,
                 { metal: 0.2, rough: 0.15, name: 'far' });
far.rotation.z = Math.PI / 2;
far.position.set(3.55, 1.10, 0);
modelGroup.add(far);
// Seyir lambaları: +z SOL taraf (motorun kuralı: sağ taraf -z) → kırmızı.
const lmpS = mesh(new THREE.SphereGeometry(0.065, 10, 8), C_KIRMIZI,
                  { metal: 0.2, rough: 0.25, name: 'seyir_lambasi_1' });
lmpS.position.set(-0.30, KANAT_Y + 0.02, KANAT_Z - 0.02);
modelGroup.add(lmpS);
const lmpG = mesh(new THREE.SphereGeometry(0.065, 10, 8), C_YESIL,
                  { metal: 0.2, rough: 0.25, name: 'seyir_lambasi_2' });
lmpG.position.set(-0.30, KANAT_Y + 0.02, -(KANAT_Z - 0.02));
modelGroup.add(lmpG);
// Çakar (anti-collision) — kuyruk kirişinin sırtında
const cakar = mesh(cyl(0.05, 0.065, 0.10, 10), C_KIRMIZI,
                   { metal: 0.2, rough: 0.25, name: 'cakar' });
cakar.position.set(-4.60, 2.42, 0);
modelGroup.add(cakar);
// Anten bıçağı — kirişin altında. Üst kenarı karnın (x=-5.2'de 1.66) ÜSTÜNDE
// kalsın diye 1.72: aksi hâlde kirişin altında havada duruyor.
levha('anten', [[-5.05, 1.72], [-5.45, 1.72], [-5.34, 1.48], [-5.14, 1.48]],
      0.045, '#2a2d2a', { metal: 0.3, rough: 0.5 });
// PITOT TÜPLERİ: ön gövdenin iki yanında, EFAB kutularının önünde.
[1, -1].forEach(function (s, i) {
    boru('pitot_' + (i + 1), [3.30, 2.06, s * 0.42], [3.92, 2.06, s * 0.42],
         0.021, C_METAL, { seg: 6, metal: 0.45, rough: 0.3 });
});
// KANAT UCU ELEKTRONİK HARP KUTULARI: kanat uçlarındaki küçük kapsüller.
// Kanadın ucunu bitiren şey; olmazsa levha kesilmiş gibi duruyordu.
[1, -1].forEach(function (s, i) {
    const uc = mesh(cyl(0.10, 0.10, 0.74, 12), '#454c42',
                    { metal: 0.3, rough: 0.5, name: 'kanat_uc_' + (i + 1) });
    uc.rotation.z = Math.PI / 2;
    uc.position.set(-0.34, KANAT_Y - 0.06, s * (KANAT_Z - 0.05));
    modelGroup.add(uc);
});
