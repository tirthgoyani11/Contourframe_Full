// Taksi — otomobilin taksi sürümü. Ulaşım temasının dördüncü modeli.
//
// ⚠️ BU DOSYA ELLE DÜZENLENMEZ. `taksi_uret.py` tarafından
// `models/otomobil.js`ten üretiliyor; elle yapılan değişiklik bir sonraki
// üretimde kaybolur. Gövdede düzeltme gerekiyorsa otomobil.js'e yaz, sonra:
//     python taksi_uret.py
//
// NEDEN ÜRETİLİYOR: model kodu sözleşmesinde `import` yok — her model kendi
// kendine yeten tek bir JS gövdesi. Yani taksi, otomobilin ~900 satırlık
// gövdesini AYNEN taşımak zorunda. Elle kopyalansaydı gövdedeki her düzeltme
// (kesit eğrileri, kemer, davlumbaz, yüz parçaları) iki dosyada ayrı ayrı
// yapılmak zorunda kalır ve er ya da geç ayrışırlardı.
//
// Otomobilden TEK farkı: gövde rengi taksi sarısı ve tavanda tepe lambası.
// Kasa, kesit eğrileri, kemer, cam yerleşimi, yüz parçaları ve tekerlekler
// birebir aynı — yani `_WHEELS` satırı da otomobilinkiyle aynı olmalı
// (radius 0.316, `front` listesi aynı iki teker).
//

// ===========================================================================
// 0. RENKLER
// ===========================================================================
const C_GOVDE   = '#eeb01a';   // taksi sarisi — _TINT varsayilani da ayni
const C_CAM     = '#141a22';
const C_DIREK   = '#0f1216';   // B direği / cam çevresi karartması
const C_LASTIK  = '#1b1b1e';
const C_JANT    = '#a9b0b8';
const C_JANT_K  = '#666d75';
// ⚠️ KROM DİYE metalness 0.85-0.95 VERİLMEZ. MeshStandardMaterial'da
// metalness=1 difüz bileşeni sıfırlar; sahnede environment map olmadığı
// için metal parça YALNIZ doğrudan ışığın yansımasını gösterir — açı
// tutmayan yüzler kapkara çıkar. Izgara çıtaları ve logo bu yüzden
// görünmüyordu, cam üstü çıtası ise tek bir beyaz şerit gibi patlıyordu.
// Düşük metalness + açık taban rengi hem parlıyor hem de gövdeyi okutuyor.
const C_KROM    = '#b9c1ca';
const KROM_MAL  = { metal: 0.45, rough: 0.26 };
const C_DIP     = '#0d0f12';   // ızgara içi, davlumbaz, gölgeli oyuklar
const C_FASYA   = '#2b2f35';   // boyasız alt tampon
const C_FAR     = '#c9d6e4';
const C_FAR_IC  = '#3b434c';
const C_STOP    = '#a82f27';
const C_STOP_K  = '#5a1512';
const C_PLAKA   = '#dde2e8';

// ===========================================================================
// 1. TEMEL ÖLÇÜLER
// ===========================================================================
const UZUN      = 2.266;    // yarı uzunluk → 4.532 m
const PAH       = 0.062;    // burun/kuyruk yuvarlatma boyu (x ekseninde)
const PAH_UC    = 0.92;     // pahın sonundaki kesit ölçeği
const R_TEKER   = 0.316;    // 205/55 R16 → çap 632 mm
const AKS_Y     = R_TEKER;
const ON_X      = 1.386;    // ön çıkma 880
const ARKA_X    = -1.252;   // arka çıkma 1014 → dingil arası 2.638
const AKS_X     = [ARKA_X, ON_X];
const IZ_Z      = 0.760;    // iz 1520; dış yüz 0.8625
const LASTIK_GEN = 0.205;
const KEMER_R   = 0.400;    // kemer yarıçapı — lastikten 0.084 açık. Egea'nın
                            // kemer boşluğu bilerek CÖMERT: yüksek süspansiyon
                            // ve 16 inç jantla gelen dik duruş buradan.
const KEMER_ETEK = 0.105;   // kemerin uçlarının eşiğe inişi
const BOMBE     = 0.020;    // cam yüzeyinin dışa şişmesi
const KARAKTER  = 0.018;    // gövde boyunca süren karakter çizgisi çıkıntısı
const US_YANAK  = 0.48;     // alt yanak süper-elips üssü — küçüldükçe yanak
                            // marşpiyelden hemen açılıp DİKLEŞİYOR. 0.66'da
                            // alt gövde sabun kalıbı gibi yuvarlak kalıyordu.
                            // Egea'nın yanağı belirgin biçimde YASSI.
const US_CATI   = 0.77;     // çatı kubbesi süper-elips üssü (2/2.6)
const NV        = 24;       // yarı kesitteki örnek sayısı (halka 2*NV-2)

// Kesit parametresi v'nin bölüm sınırları. Bir kesit beş parçadan oluşuyor:
//   A [0 .. VA]   taban (kemer ağzı ya da eşik altı)
//   B [VA .. VB]  alt yanak: tabandan en geniş noktaya (marşpiyel kıvrımı)
//   C [VB .. VC]  omuz → bel: neredeyse dikey kapı yüzeyi
//   D [VC .. VD]  bel → çatı kenarı: TUMBLEHOME (camın içe yatması)
//   E [VD .. 1]   çatı/kaput kubbesi, orta hatta kapanır
const VA = 0.055, VB = 0.340, VC = 0.455, VD = 0.735;

// ===========================================================================
// 2. MONOTON KÜBİK EĞRİ (PCHIP)
// ===========================================================================
// Catmull-Rom önce denendi ve BIRAKILDI: ön cam ile tavan arasında eğim çok
// değiştiği için tavan çizgisi kaputun üzerine tümsek atıyordu (taşma).
// Fritsch-Carlson tegetleri yerel uç noktalarda sıfırlanır → taşma yok.
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

// ---- gövdenin uzunlamasına çizgileri -------------------------------------
// ÜST ÇİZGİ: kuyruktan buruna kadar aracın orta hattı. Ön cam eğimi
// (1.010, 1.100) → (0.200, 1.438) = yatayla 22.6°, arka cam
// (-1.420, 1.126) → (-0.520, 1.436) = 19.0°. İkisi de modern sedan değeri;
// Şahin'inki 35-40° idi, "kutu" hissi oradan geliyordu.
// Egea'nın profili: DİK ön cam (27.8°), UZUN DÜZ tavan (1.02 m), 24.7°'lik
// arka cam ve YÜKSEK, KESİK bagaj. Jenerik sedanda ön cam 22.6°, düz tavan
// 0.72 m ve kuyruk daha yatıktı — o siluet fastback'e kayıyordu.
const Y_UST = egriYap([
    [-2.266, 1.032], [-2.150, 1.092], [-2.020, 1.118], [-1.800, 1.112],
    [-1.600, 1.118], [-1.400, 1.130], [-1.150, 1.246], [-0.900, 1.360],
    [-0.660, 1.470], [-0.200, 1.495], [ 0.360, 1.476], [ 0.560, 1.372],
    [ 0.820, 1.230], [ 1.050, 1.112], [ 1.250, 1.086], [ 1.600, 1.062],
    [ 1.900, 1.032], [ 2.130, 0.985], [ 2.266, 0.930]
]);
// EŞİK: marşpiyelin alt kenarı. Uçlarda yaklaşma/ayrılma açısı için kalkıyor.
const ESIK = egriYap([
    [-2.266, 0.286], [-2.080, 0.222], [-1.880, 0.196], [-0.950, 0.188],
    [ 0.950, 0.188], [ 1.880, 0.196], [ 2.090, 0.226], [ 2.266, 0.292]
]);
// EN GENİŞ NOKTANIN YÜKSEKLİĞİ. Uçlarda aşağı iner (tampon en geniş yer).
const Y_OMUZ = egriYap([
    [-2.266, 0.605], [-2.040, 0.756], [-1.780, 0.806], [-1.400, 0.822],
    [-0.300, 0.828], [ 0.900, 0.828], [ 1.500, 0.822], [ 1.860, 0.796],
    [ 2.100, 0.712], [ 2.266, 0.605]
]);
// ÇATI/KAPUT KUBBESİNİN DERİNLİĞİ. Tavanda sığ (26 mm), kaput ve bagajda
// daha derin: oralarda kubbe yüzeyin yarısını kaplıyor, sığ bırakılsaydı
// çamurluk ile kaput arasındaki geçiş bıçak sırtı gibi çıkardı.
const KUBBE = egriYap([
    [-2.266, 0.050], [-1.800, 0.042], [-1.450, 0.026], [-0.700, 0.023],
    [ 0.360, 0.023], [ 1.050, 0.028], [ 1.650, 0.042], [ 2.266, 0.052]
]);
// EN GENİŞ YARI GENİŞLİK. İki aksın üstünde şişiyor → KALÇA.
const W_OMUZ = egriYap([
    [-2.266, 0.808], [-2.100, 0.855], [-1.900, 0.878], [-1.650, 0.890],
    [-1.252, 0.896], [-0.650, 0.884], [ 0.300, 0.880], [ 0.900, 0.886],
    [ 1.386, 0.894], [ 1.850, 0.882], [ 2.100, 0.856], [ 2.266, 0.818]
]);
// BEL HATTI (yan camın dibi).
// Egea'nın bel hattı KABİN BOYUNCA DÜZ: 1.006 ile 1.012 arası. Yükselen,
// kavisli bel hattı sportif sedanların işi; Egea'da yoktur.
const Y_BEL = egriYap([
    [-2.266, 0.720], [-2.020, 0.930], [-1.620, 0.990], [-1.100, 1.012],
    [ 0.000, 1.006], [ 1.050, 1.010], [ 1.480, 0.965], [ 1.950, 0.862],
    [ 2.266, 0.700]
]);
// Bel hattında genişliğin omuzdan ne kadar içeri çekildiği.
const D_BEL = egriYap([
    [-2.266, 0.126], [-2.050, 0.056], [-1.620, 0.018], [ 0.000, 0.012],
    [ 1.050, 0.014], [ 1.620, 0.042], [ 2.050, 0.096], [ 2.266, 0.146]
]);
// ÇATI KENARI GENİŞLİĞİ. Tavanda 0.700 (1.40 m) → bel 0.894'ten 24° tumblehome.
const W_CATI = egriYap([
    [-2.266, 0.575], [-2.100, 0.648], [-1.900, 0.700], [-1.620, 0.732],
    [-1.410, 0.748], [-1.050, 0.720], [-0.700, 0.694], [-0.200, 0.686],
    [ 0.360, 0.692], [ 0.620, 0.712], [ 0.900, 0.740], [ 1.060, 0.760],
    [ 1.400, 0.776], [ 1.800, 0.772], [ 2.100, 0.732], [ 2.200, 0.686],
    [ 2.266, 0.640]
]);
// MARŞPİYEL GENİŞLİĞİ (kesitin en altı). Omuzdan ~0.15 içeride → kıvrım.
// ⚠️ Uçlarda 0.54'e kadar daralıyordu ve araç önden armut gibi görünüyordu:
// tampon dibi dar, üstü geniş, tekerlekler yanlardan cırlak çıkıyordu.
const W_ESIK = egriYap([
    [-2.266, 0.690], [-2.050, 0.710], [-1.820, 0.730], [-0.950, 0.746],
    [ 0.950, 0.746], [ 1.820, 0.730], [ 2.050, 0.712], [ 2.266, 0.692]
]);
// Karakter çizgisinin uçlarda sönmesi.
const KAR_GUC = egriYap([
    [-2.16, 0.0], [-1.90, 0.70], [-1.25, 1.0], [0.0, 1.0],
    [ 1.25, 1.0], [ 1.90, 0.70], [ 2.16, 0.0]
]);

// ===========================================================================
// 3. KESİT
// ===========================================================================
// Çamurluk kemerinin üst kenarı. Lastikle EŞ MERKEZLİ bir daire (0.063
// açıklık her yerde aynı) ve uçlarında çeyrek elipsle eşiğe iniyor.
// Yarım daire tek başına bırakılsaydı uçlarda 0.16'lık dikey duvar kalırdı.
function kemerUst(x) {
    const e = ESIK(x);
    let y = e;
    for (let k = 0; k < 2; k++) {
        const dx = Math.abs(x - AKS_X[k]);
        if (dx < KEMER_R) {
            y = Math.max(y, AKS_Y + Math.sqrt(KEMER_R * KEMER_R - dx * dx));
        } else if (dx < KEMER_R + KEMER_ETEK) {
            const u = (dx - KEMER_R) / KEMER_ETEK;
            y = Math.max(y, e + (AKS_Y - e) * Math.sqrt(Math.max(0, 1 - u * u)));
        }
    }
    return y;
}

// Bir istasyonun dokuz parametresi.
function kesitPar(x) {
    const e = ESIK(x);
    let yA = kemerUst(x);
    let yO = Y_OMUZ(x);
    let yU = Y_UST(x);
    yA = Math.min(yA, yO - 0.030);                       // taban omuzun ALTINDA kalmalı
    let yB = Math.min(Y_BEL(x), yO + (yU - yO) * 0.64);
    let yC = Math.max(yB + 0.022, yU - KUBBE(x));
    const wO = W_OMUZ(x);
    const wB = Math.max(0.03, wO - D_BEL(x));
    let wC = Math.min(W_CATI(x), wB - 0.008);
    // Kemer ağzı açıldıkça kesitin tabanı marşpiyelden dışa, kemer dudağına
    // kadar genişliyor: tek bir "pay" değeri iki şeyi birden yönetiyor.
    const pay = Math.min(1, Math.max(0, (yA - e) / 0.42));
    const wRock = W_ESIK(x);
    let wA = wRock + (wO - 0.026 - wRock) * pay;
    wA = Math.min(wA, wO - 0.012);
    const kar = KARAKTER * KAR_GUC(x);

    // Burun/kuyruk yuvarlatması: son PAH kadarlık bölümde kesit, kendi
    // merkezine doğru daire yayıyla küçülüyor. Böylece tampon köşeleri hem
    // planda hem düşeyde yuvarlanıyor; düz bir kapak keskin köşe bırakırdı.
    const uc = Math.abs(x) - (UZUN - PAH);
    if (uc > 0) {
        const f = PAH_UC + (1 - PAH_UC) * Math.sqrt(Math.max(0, 1 - (uc / PAH) * (uc / PAH)));
        const yc = (yA + yU) / 2;
        yA = yc + (yA - yc) * f; yO = yc + (yO - yc) * f;
        yB = yc + (yB - yc) * f; yC = yc + (yC - yc) * f; yU = yc + (yU - yc) * f;
        return { yA: yA, wA: wA * f, yO: yO, wO: wO * f, yB: yB, wB: wB * f,
                 yC: yC, wC: wC * f, yU: yU, kar: kar * f };
    }
    return { yA: yA, wA: wA, yO: yO, wO: wO, yB: yB, wB: wB,
             yC: yC, wC: wC, yU: yU, kar: kar };
}

// Yarı kesitin v parametresindeki noktası → [z, y]. v: 0 = taban ortası,
// 1 = tepe ortası.
function kesitNokta(P, v) {
    if (v <= VA) return [P.wA * (v / VA), P.yA];
    if (v <= VB) {
        // Süper-elips çeyreği: (wA,yA) köşesinden çıkıp (wO,yO)'da DİKEY
        // tegetle bitiyor. Üs 2/3 olduğu için yanak hemen dışa açılıp
        // dikleşiyor — marşpiyel kıvrımı böyle çıkıyor.
        const t = (v - VA) / (VB - VA), th = t * Math.PI / 2;
        return [P.wA + (P.wO - P.wA) * Math.pow(Math.sin(th), US_YANAK),
                P.yO - (P.yO - P.yA) * Math.pow(Math.cos(th), US_YANAK)];
    }
    if (v <= VC) {
        const t = (v - VB) / (VC - VB);
        const e = t * t * (3 - 2 * t);
        // Karakter çizgisi: kapı yüzeyinde, gövde boyunca süren yumuşak
        // çıkıntı. Ayrı bir parça olarak konsaydı havada duran bir çıta
        // gibi okunurdu (motosiklet dersi); kesite işlenince gerçek bir
        // pres hattı gibi ışık alıyor.
        // Egea'da pres hattı YÜKSEK: ön çamurluktan kapı kollarının hemen
        // altından geçip stop lambasına dayanıyor. Merkez 0.55'ten 0.72'ye
        // alındı — omuz ile bel arasının üst dörtlüğüne.
        const kar = P.kar * Math.exp(-Math.pow((t - 0.72) / 0.26, 2));
        return [P.wO + (P.wB - P.wO) * e + kar, P.yO + (P.yB - P.yO) * t];
    }
    if (v <= VD) {
        // Tumblehome: bel ile çatı kenarı arasında ikinci derece Bezier.
        // Denetim noktası dışa itiliyor → cam yüzeyi hafif BOMBELİ.
        const t = (v - VC) / (VD - VC), u = 1 - t;
        const cz = (P.wB + P.wC) / 2 + BOMBE, cy = (P.yB + P.yC) / 2;
        return [u * u * P.wB + 2 * u * t * cz + t * t * P.wC,
                u * u * P.yB + 2 * u * t * cy + t * t * P.yC];
    }
    const t = (v - VD) / (1 - VD), th = t * Math.PI / 2;
    return [P.wC * Math.pow(Math.cos(th), US_CATI),
            P.yC + (P.yU - P.yC) * Math.pow(Math.sin(th), US_CATI)];
}

// Yüzey noktası. w ∈ [-1,1]: 0 = tepe orta hattı, +1 = +z tarafında taban,
// -1 = -z tarafında taban. (v = 1 - |w|.) Panelleri bu parametreyle
// yerleştirmek kolay: yan cam w≈0.28..0.52, ön cam w≈-0.23..0.23.
function nokta3(x, w) {
    const p = kesitNokta(kesitPar(x), 1 - Math.abs(w));
    return [x, p[1], (w < 0 ? -p[0] : p[0])];
}

// Sayısal yüzey normali (dışa bakar). Panelleri yüzeyden bu yönde ötelüyoruz.
function normal3(x, w) {
    const h = 0.0035;
    const hx = (x > UZUN - 0.004) ? -h : h;
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
// 4. GÖVDE KABUĞU (loft)
// ===========================================================================
const IST = (function () {
    // İstasyonlar KEMER AĞIZLARINDA sık, düz bölümlerde seyrek. Kemer
    // eğrisinin türevi ağzın uçlarında kırılıyor; orada seyrek örneklenirse
    // yay köşe köşe çıkar. Kapı ortasında ise kesit neredeyse hiç
    // değişmiyor, sık örneklemek yalnız üçgen harcıyor.
    const orta = [
        -2.204, -2.150, -2.085, -2.015, -1.940, -1.860,
        -1.795, -1.757, -1.712, -1.655, -1.585, -1.500, -1.415, -1.335,
        -1.252, -1.180, -1.100, -1.020, -0.940, -0.865, -0.800, -0.760,
        -0.715, -0.620, -0.470, -0.300, -0.110,
         0.090,  0.290,  0.480,  0.660,  0.800,  0.845,
         0.885,  0.935,  0.995,  1.065,  1.145,  1.230,  1.315,  1.386,
         1.470,  1.555,  1.645,  1.735,  1.825,  1.895,  1.945,  2.000,
         2.065,  2.130,  2.180,  2.204
    ];
    const pahlar = [0.28, 0.53, 0.74, 0.90, 1.0].map(k => UZUN - PAH + PAH * k);
    const bas = pahlar.slice().reverse().map(v => -v);
    return bas.concat(orta, pahlar);
})();

const R_HALKA = 2 * NV - 2;

function halka(x) {
    const P = kesitPar(x), yarim = [];
    for (let i = 0; i < NV; i++) yarim.push(kesitNokta(P, i / (NV - 1)));
    // 0 = taban ortası → +z tarafı yukarı → NV-1 = tepe ortası →
    // -z tarafı aşağı. Kapalı halka, kutup yok, bozuk üçgen yok.
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
    // Ön ve arka kapak: düz üçgen yelpaze. Halka köşeleri KOPYALANIYOR ki
    // computeVertexNormals kapağın normalini yan yüzeyinkiyle ortalamasın —
    // ortalasaydı burun kenarındaki keskinlik yumuşayıp kaput ile tampon
    // arasındaki ayrım kaybolurdu.
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
            // Ön yüzden (+x) bakışta halka SAAT YÖNÜNDE ilerliyor, arka
            // yüzden (-x) bakışta ters. Sarım buna göre ayrılıyor.
            if (onYuz) IDX.push(merkez, b, a); else IDX.push(merkez, a, b);
        }
    }
    kapak(IST[IST.length - 1], true);
    kapak(IST[0], false);

    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.Float32BufferAttribute(P, 3));
    geo.setIndex(IDX);
    geo.computeVertexNormals();
    modelGroup.add(mesh(geo, C_GOVDE, { metal: 0.42, rough: 0.34, name: 'govde' }));
})();

// ===========================================================================
// 5. YÜZEYE OTURAN PANELLER
// ===========================================================================
// Cam, far, dikiş, sunroof — hepsi aynı yardımcıdan çıkıyor: gövde yüzeyi
// x1..x2 ve w1..w2 aralığında yeniden örnekleniyor ve normal boyunca
// `disari` kadar öteleniyor. Böylece panel gövdenin kavisine BİREBİR
// oturuyor; düz bir levha olsaydı kavisli yüzeyden yer yer batar yer yer
// havada kalırdı.
// Bant biçimi: [x1, x2, a1, a2]  → a, kesit parametresi w.
//              [x1, x2, y1, y2, taraf]  → a YÜKSEKLİK; her x'te o yüksekliğin
//              w'si aranıyor. Stop ve far gibi parçalar gövdenin kesit
//              topolojisini değil YATAY bir çizgiyi izliyor; sabit w ile
//              yazılsalardı buruna doğru yukarı kayarlardı (ilk denemede
//              stop lambaları çamurluğun üstünde havada duran kırmızı
//              dilimlere dönüşmüştü).
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
        metal: opts.metal == null ? 0.3 : opts.metal,
        rough: opts.rough == null ? 0.35 : opts.rough, name: ad
    });
    m.material.side = THREE.DoubleSide;
    // Kalınlıksız paneller GÖLGE DÜŞÜRMEZ: gövdeye 8-12 mm mesafede
    // duruyorlar, gölge haritasında kendi gölgelerini gövdenin üstüne
    // basıp benek (acne) üretiyorlardı.
    m.castShadow = false;
    modelGroup.add(m);
    return m;
}

// ---- camlar ---------------------------------------------------------------
// Ön cam: çatı kenarından çatı kenarına, orta hattın üstünden geçen bant.
// Kenarlarda gövde rengi kalıyor → A direği kendiliğinden çıkıyor.
// ⚠️ Sınır ±0.232 idi ve A direği 10 mm kalıyordu: kubbe bölümünde z, w ile
// ÇOK YAVAŞ değişiyor (süper-elips), yani w'deki eşit adım tavanın ortasında
// büyük, kenarında minicik bir mesafeye karşılık geliyor. ±0.185, çatı
// kenarında ~60 mm'lik gerçek bir direk bırakıyor (ölçüldü).
yuzeyYama('cam_on', [[1.052, 0.365, -0.185, 0.185]], 8, 14, 0.012, C_CAM,
          { metal: 0.35, rough: 0.18 });
yuzeyYama('cam_arka', [[-1.398, -0.668, -0.190, 0.190]], 8, 14, 0.012, C_CAM,
          { metal: 0.35, rough: 0.18 });

// Yan camlar. Alt kenar bel hattının (VC → w=0.545) hemen üstünde, üst kenar
// çatı kenarının (VD → w=0.265) hemen altında.
const W_CAM_ALT = 0.528, W_CAM_UST = 0.286;
[1, -1].forEach(function (s, i) {
    yuzeyYama('cam_yan_' + (i * 2 + 1),
              [[0.842, -0.098, s * W_CAM_ALT, s * W_CAM_UST]], 4, 9, 0.011, C_CAM,
              { metal: 0.35, rough: 0.18 });
    yuzeyYama('cam_yan_' + (i * 2 + 2),
              [[-0.022, -0.795, s * W_CAM_ALT, s * W_CAM_UST]], 4, 9, 0.011, C_CAM,
              { metal: 0.35, rough: 0.18 });
    // Arka çeyrek cam: C direğinin önünde küçük üçgen.
    yuzeyYama('cam_ucgen_' + (i + 1),
              [[-0.832, -1.075, s * W_CAM_ALT, s * 0.322]], 5, 9, 0.011,
              C_CAM, { metal: 0.35, rough: 0.18 });
    // B direği KOYU: modern sedanlarda gövde renginde değil.
    yuzeyYama('direk_b_' + (i + 1),
              [[-0.096, -0.024, s * (W_CAM_ALT + 0.012), s * (W_CAM_UST - 0.010)]],
              1, 12, 0.010, C_DIREK, { metal: 0.2, rough: 0.5 });
    // Bel hattı kromu ve cam üstü çıtası — camın çerçevesini tamamlıyor.
    yuzeyYama('krom_bel_' + (i + 1),
              [[0.850, -1.085, s * 0.545, s * 0.529]], 14, 1, 0.013, C_KROM,
              KROM_MAL);
    yuzeyYama('krom_cati_' + (i + 1),
              [[0.300, -1.070, s * 0.281, s * 0.264]], 12, 1, 0.013, C_KROM,
              KROM_MAL);
});

// ---- kaput/bagaj ayrım çizgileri ------------------------------------------
// ⚠️ İKİ AYRI ÇAĞRI, tek çağrı DEĞİL. `nx` bandın x yönündeki, `nw` ise w
// yönündeki bölüntü sayısı. Enine dikişler x'te 18 mm ama w'de 0.38
// uzunlukta; tek çağrıda nx=10 / nw=2 ile üretilince dikişin UZUN kenarı
// yalnız iki parçaya bölünüyor, şerit gövdenin kavisini takip edemeyip
// ortasından yüzeyin içine giriyor ve kayboluyordu. Kaputun YAN dikişleri
// ise tersi: x'te uzun, w'de ince.
//
// ÇIKARILANLAR (Furkan): kapının üç ayrım çizgisi (ön kapı ön kenarı, iki
// kapı arası, arka kapı arka kenarı — yanda toplam üç çizgi) ve kaputun
// orta hattına yakın iki pres çizgisi. Gövdenin yan yüzeyi artık kesintisiz;
// kalan tek yatay çizgi bel hattı kromu, kalan tek düşey ayrım ise kemer
// ağzının kenarı.
yuzeyYama('dikis_enine', [
    // kaputun arka (ön cam dibi) ve bagajın ön kenarı
    [1.068, 1.086, -0.190, 0.190], [-1.478, -1.462, -0.196, 0.196]
], 1, 12, 0.005, C_DIREK, { metal: 0.1, rough: 0.85 });
yuzeyYama('dikis_kaput', [
    // kaputun iki YAN dikişi — çamurluk kenarının (çatı kenarı w=0.265)
    // hemen içinden geçiyor, gerçek kaput/çamurluk ayrımı orada
    [1.108, 2.108, 0.250, 0.262], [1.108, 2.108, -0.250, -0.262]
], 16, 1, 0.004, C_DIREK, { metal: 0.1, rough: 0.85 });

// ---- çamurluk kemerinin ağız kenarı ---------------------------------------
// Kemer ağzını çevreleyen ince koyu şerit. Kemer sadece gövdenin alt
// kenarındaki bir kesikti ve boyalı yüzeyle aynı renk olduğu için siluetten
// başka bir şey söylemiyordu; bu şerit ağzın sınırını çiziyor.
yuzeyYama('kemer_kenar', [
    [ON_X - 0.515,   ON_X + 0.515,   0.928, 0.988],
    [ON_X - 0.515,   ON_X + 0.515,  -0.928, -0.988],
    [ARKA_X - 0.515, ARKA_X + 0.515, 0.928, 0.988],
    [ARKA_X - 0.515, ARKA_X + 0.515, -0.928, -0.988]
], 16, 1, 0.004, '#191d22', { metal: 0.1, rough: 0.85 });

// ---- tavan penceresi: BİLEREK YOK -----------------------------------------
// Jenerik sedanda vardı, burada KALDIRILDI. Egea'nın Türkiye'de satılan
// donanımlarında cam tavan yok; tavan boydan boya boyalı. Modelde de öyle
// duruyor — üstelik tepeden bakışta uzun düz tavan Egea'nın en tanıdık
// yüzeyi, siyah bir dikdörtgen onu bölüyordu.

// ---- stop lambalarının çamurluğa dolanan kanadı ---------------------------
// YÜKSEKLİKLE tanımlı: arka yüzdeki lambanın hizasını koruyarak köşeyi
// dolanıp çamurluğun üstünde bitiyor.
[1, -1].forEach(function (s, i) {
    yuzeyYama('stop_kanat_' + (i + 1),
              [[-2.264, -2.030, 0.790, 0.930, s]], 8, 3, 0.009, C_STOP,
              { metal: 0.25, rough: 0.25 });
});

// ===========================================================================
// 6. ÖN VE ARKA YÜZ PARÇALARI
// ===========================================================================
// ExtrudeGeometry şekli XY düzleminde kurup +Z'ye itiyor. Ön/arka yüz
// parçaları için şekil (z,y) düzleminde yazılıp +X'e itilmeli:
// rotateY(π/2) (x,y,z)'yi (z,y,-x)'e taşıyor, yani şeklin x'i model -z'ye
// düşüyor — bu yüzden noktalar önce negatifleniyor ve sırası ters çevriliyor
// (yön korunsun diye).
function yuvarlakSekil(pts, r) {
    const s = new THREE.Shape(), n = pts.length;
    for (let i = 0; i < n; i++) {
        const p0 = pts[(i - 1 + n) % n], p1 = pts[i], p2 = pts[(i + 1) % n];
        const d1x = p1[0] - p0[0], d1y = p1[1] - p0[1];
        const d2x = p2[0] - p1[0], d2y = p2[1] - p1[1];
        const l1 = Math.sqrt(d1x * d1x + d1y * d1y) || 1;
        const l2 = Math.sqrt(d2x * d2x + d2y * d2y) || 1;
        const rr = Math.min(r, l1 / 2, l2 / 2);
        const ax = p1[0] - d1x / l1 * rr, ay = p1[1] - d1y / l1 * rr;
        const bx = p1[0] + d2x / l2 * rr, by = p1[1] + d2y / l2 * rr;
        if (i === 0) s.moveTo(ax, ay); else s.lineTo(ax, ay);
        s.quadraticCurveTo(p1[0], p1[1], bx, by);
    }
    s.closePath();
    return s;
}

function yuzParca(ad, pts, r, x, derinlik, renk, opts) {
    opts = opts || {};
    const q = pts.map(p => [-p[0], p[1]]);
    q.reverse();
    const geo = new THREE.ExtrudeGeometry(yuvarlakSekil(q, r), {
        depth: derinlik, bevelEnabled: false, curveSegments: 4
    });
    geo.rotateY(Math.PI / 2);
    geo.translate(x, 0, 0);
    const m = mesh(geo, renk, {
        metal: opts.metal == null ? 0.3 : opts.metal,
        rough: opts.rough == null ? 0.45 : opts.rough, name: ad
    });
    modelGroup.add(m);
    return m;
}

// ---- ön yüz: EGEA -----------------------------------------------------------
// ⚠️ Koordinatlar GÖZ KARARI DEĞİL, kapağın ölçülmüş profilinden çıkarıldı
// (kesit_olc.js --z 2.266). Kapak y 0.318..0.905 arasında; yarı genişlik
// y=0.34'te 0.723 · 0.46'da 0.751 · 0.58'de 0.753 (en geniş) · 0.66'da 0.661
// · 0.74'te 0.618 · 0.82'de 0.602 · 0.88'de 0.552. Her parça bu zarfın
// İÇİNDE kalıyor ki etrafında boyalı kenar görünsün.
//
// ⚠️ `yuzParca` geometriyi `x`ten `x+derinlik`e uzatıyor. Kasa kısalınca
// kapak 2.425'ten 2.266'ya geldi; x değerlerini eski yerinde bırakınca
// farlar burnun 16 cm ÖNÜNDE havada kaldı ve kutu 4.53 yerine 4.89 ölçtü.
// Her parçanın `x + derinlik`i kapağı 5-30 mm geçecek şekilde ayarlı.
//
// EGEA'NIN YÜZÜ (makyaj öncesi Tipo/Egea): İKİ KATLI. Üstte, farların
// ARASINDA duran İNCE bir ızgara şeridi; altta, tamponu boydan boya kaplayan
// GENİŞ TRAPEZ hava girişi. Jenerik sedanda tek bir altıgen ızgara vardı ve
// farlar onun üstünde kalıyordu — Egea'da tam tersi, farlar ızgara şeridiyle
// AYNI HİZADA ve yüzü boydan boya kesiyor.
yuzParca('izgara_cerceve',
         [[-0.352, 0.716], [0.352, 0.716], [0.352, 0.830], [-0.352, 0.830]],
         0.028, 2.224, 0.048, '#9aa2ac', { metal: 0.45, rough: 0.30 });
yuzParca('izgara',
         [[-0.330, 0.728], [0.330, 0.728], [0.330, 0.818], [-0.330, 0.818]],
         0.020, 2.230, 0.048, '#14181d', { metal: 0.3, rough: 0.6, flat: true });
// Izgaranın üst kenarındaki krom şerit: Egea'da farların üst hattını
// birbirine bağlayan çizgi budur.
yuzParca('izgara_cita_1',
         [[-0.344, 0.810], [0.344, 0.810], [0.344, 0.832], [-0.344, 0.832]],
         0.008, 2.242, 0.044, C_KROM, KROM_MAL);
// Farlar: ızgara şeridinin iki yanından çamurluk köşesine kadar. Dış ucu
// hafif yukarı kalkık, iç ucu ızgaraya dayalı.
[1, -1].forEach(function (s, i) {
    yuzParca('far_' + (i + 1),
             [[s * 0.348, 0.714], [s * 0.610, 0.726], [s * 0.578, 0.840], [s * 0.348, 0.838]],
             0.020, 2.204, 0.070, C_FAR_IC, { metal: 0.5, rough: 0.3 });
    yuzParca('far_lens_' + (i + 1),
             [[s * 0.362, 0.728], [s * 0.588, 0.740], [s * 0.560, 0.824], [s * 0.362, 0.822]],
             0.016, 2.232, 0.050, C_FAR, { metal: 0.1, rough: 0.10 });
});
// ALT HAVA GİRİŞİ: Egea'nın yüzündeki en büyük kütle. Trapez, üstte geniş.
// ⚠️ İlk denemede y 0.362..0.588 arası ve neredeyse dikdörtgendi; ön yüz
// kamyonet ağzı gibi çıkıyordu. Egea'nın girişi ÜSTTE GENİŞ, ALTA DOĞRU
// DARALAN bir trapez ve daha alçak.
yuzParca('hava_giris',
         [[-0.532, 0.358], [0.532, 0.358], [0.658, 0.462], [0.640, 0.556],
          [-0.640, 0.556], [-0.658, 0.462]],
         0.05, 2.218, 0.052, '#23282f', { metal: 0.3, rough: 0.62, flat: true });
// Alt dudak: fasyanın en altında ince koyu şerit.
yuzParca('tampon_on', [[-0.700, 0.322], [0.700, 0.322], [0.688, 0.368], [-0.688, 0.368]],
         0.022, 2.224, 0.052, C_FASYA, { metal: 0.15, rough: 0.7 });
// Girişin ortasındaki yatay bölme: kapkara bir oyuk yerine ızgara okunsun.
// ⚠️ Bu satır bir kez YANLIŞLIKLA aşağıdaki sis farı döngüsünün içine
// yazıldı ve `izgara_cita_2` iki kez üretildi — aynı yerde çakışan iki mesh,
// hem fazladan çizim çağrısı hem z-kavgası. Parça dökümünde adın iki kez
// geçmesinden yakalandı; DÖNGÜNÜN DIŞINDA olmalı.
yuzParca('izgara_cita_2',
         [[-0.600, 0.452], [0.600, 0.452], [0.600, 0.476], [-0.600, 0.476]],
         0.010, 2.244, 0.030, '#575f69', { metal: 0.35, rough: 0.4 });
// Sis farları: hava girişinin iki dış ucunda küçük yuvalar. Açık gri
// denendi ve bırakıldı — ikinci bir far çifti gibi okunuyor, yüzde dört göz
// oluyordu.
[1, -1].forEach(function (s, i) {
    yuzParca('sis_' + (i + 1),
             [[s * 0.492, 0.404], [s * 0.598, 0.436], [s * 0.590, 0.512], [s * 0.486, 0.500]],
             0.020, 2.246, 0.030, '#454c55', { metal: 0.25, rough: 0.45 });
});
yuzParca('plaka_on', [[-0.150, 0.392], [0.150, 0.392], [0.150, 0.492], [-0.150, 0.492]],
         0.010, 2.268, 0.020, '#9aa2ab', { metal: 0.05, rough: 0.85 });
yuzParca('logo', [[-0.058, 0.744], [0.058, 0.744], [0.058, 0.804], [-0.058, 0.804]],
         0.024, 2.264, 0.032, C_KROM, KROM_MAL);

// ---- arka yüz: EGEA ---------------------------------------------------------
// Kapak y 0.316..1.002 (öndekinden 0.10 daha YÜKSEK — Egea'nın kesik, dik
// kuyruğu); yarı genişlik y=0.42'de 0.739 · 0.62'de 0.740 · 0.74'te 0.621 ·
// 0.86'da 0.578 · 0.96'da 0.529.
//
// Egea'nın stopları BÜYÜK ve YÜKSEK: bagaj kapağının hemen altından başlayıp
// tampon hizasına kadar iniyor ve köşeyi dolanıp çamurluğa taşıyor. Jenerik
// sedandaki "iki stopu birleştiren ince ışık çubuğu" KALDIRILDI — o modern
// bir imza, Egea'da yok; onun yerine iki lamba arasındaki panel boyalı.
[1, -1].forEach(function (s, i) {
    yuzParca('stop_' + (i + 1),
             [[s * 0.258, 0.752], [s * 0.592, 0.744], [s * 0.534, 0.944], [s * 0.272, 0.952]],
             0.030, -2.272, 0.052, C_STOP, { metal: 0.25, rough: 0.22 });
    yuzParca('stop_ic_' + (i + 1),
             [[s * 0.282, 0.776], [s * 0.562, 0.768], [s * 0.512, 0.920], [s * 0.294, 0.928]],
             0.024, -2.286, 0.042, C_STOP_K, { metal: 0.1, rough: 0.35 });
    // Tampon köşesindeki reflektör
    yuzParca('reflektor_' + (i + 1),
             [[s * 0.512, 0.422], [s * 0.624, 0.432], [s * 0.618, 0.492], [s * 0.508, 0.484]],
             0.018, -2.278, 0.030, '#8c2a24', { metal: 0.2, rough: 0.35 });
});
yuzParca('tampon_arka', [[-0.694, 0.318], [0.694, 0.318], [0.682, 0.388], [-0.682, 0.388]],
         0.026, -2.268, 0.052, C_FASYA, { metal: 0.15, rough: 0.7 });
yuzParca('plaka_arka', [[-0.190, 0.508], [0.190, 0.508], [0.190, 0.622], [-0.190, 0.622]],
         0.010, -2.288, 0.024, '#9aa2ab', { metal: 0.05, rough: 0.85 });
yuzParca('logo_arka', [[-0.058, 0.860], [0.058, 0.860], [0.058, 0.918], [-0.058, 0.918]],
         0.024, -2.280, 0.030, C_KROM, KROM_MAL);

// Egzoz: TEK ve KROMSUZ, tamponun altında sol tarafta. Egea'da parlak çift
// egzoz ucu yok; jenerik sedandaki iki krom boru buraya uymuyordu.
(function () {
    const e = mesh(new THREE.CylinderGeometry(0.038, 0.038, 0.12, 12, 1, true), '#3c4148',
                   { metal: 0.3, rough: 0.55, name: 'egzoz' });
    e.material.side = THREE.DoubleSide;
    e.rotation.z = Math.PI / 2;
    e.position.set(-2.216, 0.286, -0.470);
    modelGroup.add(e);
})();

// ===========================================================================
// 7. TEKERLEKLER
// ===========================================================================
// Grup deseni: grup rotation.x = π/2 ile yatırılıyor, rotation.y motora
// bırakılıyor. Dördü de modelGroup'un DOĞRUDAN çocuğu — motor ön tekerleri
// kendi steer grubuna alırken `inner.add(sg)` yapıyor, daha derinde
// olsalardı yerlerinden sökülürlerdi.
// 16 inç jant (406 mm) → yarıçap 0.203. Yanak yüksekliği 0.113 —
// jenerik sedanın 19 inçlik jantında 0.102 idi. Egea'nın lastiği
// GÖRÜNÜR ölçüde kalın yanaklı, o da dik duruşunun bir parçası.
const R_JANT = 0.203;

function tekerlek(ad, x, z) {
    const g = new THREE.Group();
    g.name = ad;
    g.position.set(x, AKS_Y, z);
    g.rotation.x = Math.PI / 2;

    // Lastik: torusun kesiti daire olduğu için et kalınlığı genişliği de
    // belirliyor; otomobil lastiği geniş ve basıktır → aks doğrultusunda
    // (yerel y) ölçekleniyor, kesit elipse dönüyor.
    const et = (R_TEKER - R_JANT) / 2;
    const lastik = new THREE.TorusGeometry(R_TEKER - et, et, 8, 26);
    lastik.rotateX(Math.PI / 2);
    lastik.scale(1, LASTIK_GEN / (et * 2), 1);
    g.add(mesh(lastik, C_LASTIK, { rough: 0.95, name: ad + '_lastik' }));

    // Jant kovanı: AÇIK uçlu silindir (kapaklı olsaydı kolları örterdi).
    const jant = mesh(new THREE.CylinderGeometry(R_JANT, R_JANT, LASTIK_GEN * 0.86, 24, 1, true),
                      C_JANT_K, { metal: 0.35, rough: 0.42, name: ad + '_jant' });
    jant.material.side = THREE.DoubleSide;
    g.add(jant);

    // Beş kollu döküm jant TEK parça: yıldız şeklinde extrude. Beş ayrı
    // kutu olsaydı beş çizim çağrısı ederdi (dört tekerde yirmi).
    const pts = [];
    for (let i = 0; i < 5; i++) {
        const a = i * Math.PI * 2 / 5;
        pts.push([0.048 * Math.cos(a - 0.44), 0.048 * Math.sin(a - 0.44)]);
        pts.push([0.191 * Math.cos(a - 0.185), 0.191 * Math.sin(a - 0.185)]);
        pts.push([0.191 * Math.cos(a + 0.185), 0.191 * Math.sin(a + 0.185)]);
        pts.push([0.048 * Math.cos(a + 0.44), 0.048 * Math.sin(a + 0.44)]);
    }
    const yildiz = new THREE.Shape();
    yildiz.moveTo(pts[0][0], pts[0][1]);
    for (let i = 1; i < pts.length; i++) yildiz.lineTo(pts[i][0], pts[i][1]);
    yildiz.closePath();
    const kolGeo = new THREE.ExtrudeGeometry(yildiz, { depth: 0.042, bevelEnabled: false });
    kolGeo.rotateX(-Math.PI / 2);      // yıldız yerel x-z düzlemine, itiş +y'ye
    kolGeo.translate(0, (z > 0 ? 1 : -1) * (LASTIK_GEN * 0.40 - 0.042 / 2), 0);
    g.add(mesh(kolGeo, C_JANT, { metal: 0.38, rough: 0.34, name: ad + '_kollar' }));

    g.add(mesh(new THREE.CylinderGeometry(0.054, 0.054, LASTIK_GEN * 0.92, 12), C_JANT,
               { metal: 0.38, rough: 0.34, name: ad + '_gobek' }));

    // Jant bileziği: dış yüzdeki parlak halka. Jant tek düz yıldız levhaydı
    // ve oyuncak gibi duruyordu; bilezik lastikle jant arasına gerçek bir
    // kenar koyuyor.
    const bilezik = mesh(new THREE.CylinderGeometry(0.206, 0.206, 0.024, 24, 1, true),
                         C_KROM, { metal: 0.45, rough: 0.28, name: ad + '_bilezik' });
    bilezik.material.side = THREE.DoubleSide;
    bilezik.position.y = (z > 0 ? 1 : -1) * (LASTIK_GEN * 0.43);
    g.add(bilezik);

    // Fren diski: AÇIK uçlu ince halka, jantın kolları arasından görünür.
    const disk = mesh(new THREE.CylinderGeometry(0.160, 0.160, 0.013, 18, 1, true),
                      '#7b828a', { metal: 0.6, rough: 0.42, name: ad + '_disk' });
    disk.material.side = THREE.DoubleSide;
    disk.position.y = (z > 0 ? 1 : -1) * LASTIK_GEN * 0.20;
    g.add(disk);

    modelGroup.add(g);
}
tekerlek('teker_on_1', ON_X, IZ_Z);
tekerlek('teker_on_2', ON_X, -IZ_Z);
tekerlek('teker_arka_1', ARKA_X, IZ_Z);
tekerlek('teker_arka_2', ARKA_X, -IZ_Z);

// ---- davlumbaz (iç çamurluk) ----------------------------------------------
// ⚠️ İlk denemede davlumbaz lastiğin İÇ yanında (z 0.30..0.635) duruyordu ve
// lastiğin ÜSTÜNDEKİ 0.063'lük boşluk açık kalıyordu: kemer ağzından öbür
// tarafın zemini görünüyor, ağız kocaman bir delik gibi okunuyordu.
// Şimdi yay lastikten HEMEN DIŞARIDA (yarıçap 0.322..0.402 — lastik 0.316) ve
// izin TAMAMINI kaplıyor; yani lastikle kemer dudağı arasındaki aralığı
// kapatan gerçek bir davlumbaz.
// ⚠️ Halka dilimi EXTRUDE ediliyor, kısmi silindir değil: kalınlıksız kabuk
// aks doğrultusundan bakınca saç teli inceliğine düşüp kayboluyor (bisiklet
// çamurluğunda ölçüldü).
AKS_X.forEach(function (ax, k) {
    [1, -1].forEach(function (s, i) {
        const sh = new THREE.Shape();
        sh.absarc(0, 0, 0.402, -0.20, Math.PI + 0.20, false);
        sh.absarc(0, 0, 0.322, Math.PI + 0.20, -0.20, true);
        const geo = new THREE.ExtrudeGeometry(sh, {
            depth: 0.596, bevelEnabled: false, curveSegments: 13
        });
        geo.translate(0, 0, s > 0 ? 0.302 : -0.898);
        geo.translate(ax, AKS_Y, 0);
        const m = mesh(geo, C_DIP, { metal: 0.1, rough: 0.9,
                                     name: 'davlumbaz_' + (k * 2 + i + 1) });
        modelGroup.add(m);
    });
});

// ---- alt taban ------------------------------------------------------------
// Düşük bakış açısında kemer ağzından altı görünmesin diye.
// ⚠️ PLAKA LASTİKLERİN İÇİNDEN GEÇİYORDU — ÖLÇÜLDÜ VE DÜZELTİLDİ.
// Eski hâli tek kutuydu: 3.60 x 0.035 x 1.34, merkez (0.05, 0.200, 0), yani
// z ±0.670. Lastiğin İÇ yüzü z = IZ_Z − LASTIK_GEN/2 = 0.760 − 0.1025 =
// 0.6575; plaka onu 12.50 mm geçiyordu ve tam plakanın yüksekliğinde
// (y 0.1825..0.2175) lastiğin en geniş halkası oradan geçiyor. Dört
// lastikte ikişer tepe noktası plakanın içinde kaldı.
// (Aynı kusur motokaravanda 17.00 mm ölçülmüş ve aynı reçeteyle çözülmüştü.)
//
// ÇÖZÜM: plaka dikdörtgen değil, tekerleklerin hizasında ÇENTİKLİ. Tek mesh
// olarak kalıyor (ad `taban` değişmedi) çünkü plan konturu kapalı bir çokgen
// ve `ExtrudeGeometry` onu tek gövdede veriyor.
//   * çentiksiz yarı genişlik 0.670 (eskisiyle aynı)
//   * çentikte 0.630 → lastiğin iç yüzüne 27.5 mm açıklık
//   * çentiğin akstan yarım boyu 0.400 = davlumbazın dış yarıçapı (0.402).
//     Lastik plakanın yüksekliğinde akstan en fazla ±0.270 uzanıyor
//     (torusun kesiti çözülerek), yani 130 mm pay var.
// ⚠️ ÇENTİK DAVLUMBAZA DEĞMİYOR ama ona göre boyutlandı: davlumbazın en
// alçak noktası y=0.236, plakanın üstü 0.2175 — arada 18.5 mm var, yani
// davlumbaz çentiğe İHTİYAÇ duymuyordu; çentik yine de onun yayı kadar
// geniş ki plaka kemer ağzının içine hiç girmesin.
// ⚠️ ŞEKİL (x,z) DÜZLEMİNDE YAZILIR, extrude +z'ye gider; `rotateX(-π/2)`
// şeklin y'sini model −z'sine, extrude derinliğini model +y'sine çeviriyor.
// Kontur z'de simetrik olduğu için işaret dönmesi görüntüyü etkilemiyor.
(function () {
    const X1 = -1.75, X2 = 1.85;   // plakanın x uçları (eskisiyle aynı)
    const W = 0.670;               // çentiksiz yarı genişlik (eskisiyle aynı)
    const D = 0.630;               // çentikte yarı genişlik
    const C = 0.400;               // çentiğin akstan yarım boyu
    const A1 = AKS_X[0] - C, B1 = AKS_X[0] + C;   // arka teker çentiği
    const A2 = AKS_X[1] - C, B2 = AKS_X[1] + C;   // ön teker çentiği
    // Plan konturu (x, z). Önce −z kenarı soldan sağa, sonra +z kenarı geri.
    const KON = [
        [X1, -W], [A1, -W], [A1, -D], [B1, -D], [B1, -W],
        [A2, -W], [A2, -D], [B2, -D], [B2, -W], [X2, -W],
        [X2,  W], [B2,  W], [B2,  D], [A2,  D], [A2,  W],
        [B1,  W], [B1,  D], [A1,  D], [A1,  W], [X1,  W]
    ];
    const sh = new THREE.Shape();
    sh.moveTo(KON[0][0], KON[0][1]);
    for (let i = 1; i < KON.length; i++) sh.lineTo(KON[i][0], KON[i][1]);
    sh.closePath();
    const geo = new THREE.ExtrudeGeometry(sh, { depth: 0.035, bevelEnabled: false });
    geo.rotateX(-Math.PI / 2);
    geo.translate(0, 0.1825, 0);
    modelGroup.add(mesh(geo, '#15181c',
                        { metal: 0.1, rough: 0.95, name: 'taban' }));
})();

// ===========================================================================
// 8. KÜÇÜK PARÇALAR
// ===========================================================================
// Aynalar KAPIDA, çatalda değil: otomobilde ayna direksiyonla DÖNMEZ.
// (İki tekerlide aynalar gidona bağlıydı ve dönen takımın içindeydi.)
[1, -1].forEach(function (s, i) {
    const x = 0.818, y = 1.038;
    const w = s * (1 - vYukseklik(x, y));
    const p = nokta3(x, w), n = normal3(x, w);

    const kol = mesh(new THREE.BoxGeometry(0.055, 0.038, 0.075), C_DIREK,
                     { metal: 0.3, rough: 0.5, name: 'ayna_kol_' + (i + 1) });
    kol.position.set(p[0], p[1] - 0.010, p[2] + s * 0.036);
    modelGroup.add(kol);

    const kutu = new THREE.SphereGeometry(0.094, 10, 7);
    kutu.scale(0.66, 0.50, 0.68);
    const gov = mesh(kutu, C_GOVDE, { metal: 0.42, rough: 0.34,
                                      name: 'ayna_govde_' + (i + 1) });
    gov.position.set(p[0] - 0.012, p[1] + 0.012, p[2] + s * 0.105);
    gov.rotation.y = -s * 0.12;
    modelGroup.add(gov);

    const cam = new THREE.BoxGeometry(0.020, 0.070, 0.096);
    const ac = mesh(cam, C_CAM, { metal: 0.4, rough: 0.08, name: 'ayna_cam_' + (i + 1) });
    ac.position.set(p[0] - 0.058, p[1] + 0.014, p[2] + s * 0.108);
    ac.rotation.y = -s * 0.12;
    modelGroup.add(ac);

    // Kapı kolları: gövdeye gömülü ince kulplar, bel hattının hemen altında.
    [0.400, -0.360].forEach(function (kx, j) {
        const kw = s * (1 - vYukseklik(kx, 0.958));
        const kp = nokta3(kx, kw), kn = normal3(kx, kw);
        const kg = mesh(new THREE.BoxGeometry(0.148, 0.030, 0.026), C_KROM,
                        { metal: 0.45, rough: 0.26, name: 'kapi_kolu_' + (i * 2 + j + 1) });
        kg.position.set(kp[0] + kn[0] * 0.012, kp[1] + kn[1] * 0.012, kp[2] + kn[2] * 0.012);
        modelGroup.add(kg);
    });
});

// Silecekler DENENDİ VE KALDIRILDI (Furkan). Ön camın dibinde iki eğik ince
// çubuktular; haritadaki ölçekte camın üstünde iki çizik gibi okunuyorlardı.

// Köpekbalığı yüzgeci anten: çatının arka ucunda.
// ⚠️ İKİ KUSUR ÖLÇÜLEREK DÜZELTİLDİ (Furkan: "arka camında rengi değişmeyen
// bir yarım daire").
//   1. KONUM. Yüzgeç x -0.857..-0.644'teydi; arka cam yaması (`cam_arka`)
//      x=-0.668'de başlıyor. Yani yüzgecin 0.213 m'lik tabanının 0.189'u,
//      yani %89'u, CAMIN ÜSTÜNDE duruyordu — üstelik orası çatının düz
//      bölümü değil, bagaj camına inen kavis (düz tavan 0.360..-0.660).
//      Yeni konum -0.520 → taban -0.635..-0.422, camın ön kenarından 33 mm
//      önde ve tamamı düz tavanda.
//   2. RENK. Gövde rengi sabitiyle (`C_GOVDE`) boyanıyordu ama `anten`
//      `_TINT.parts` listesinde DEĞİL: kullanıcı gövdeyi boyayınca yüzgeç
//      VARSAYILAN tonda kalıyor ve camın üstünde yamalı bir leke oluyordu.
//      Taksi otomobilden üretildiği için aynı leke orada sarı çıkıyordu.
//      Artık direk/derz karartmasıyla (`C_DIREK`) aynı ton: gerçek araçların
//      çoğunda da yüzgeç siyahtır ve hangi gövde renginde olursa olsun
//      anten gibi okunuyor.
//      ⚠️ İkinci seçenek `anten`'i `_TINT.parts`'a eklemekti; o tabloya bu
//      işte bilerek dokunulmadı (renk kapsamı ayrı bir işin konusu).
(function () {
    const sh = new THREE.Shape();
    sh.moveTo(-0.115, 0);
    sh.lineTo(0.098, 0);
    sh.quadraticCurveTo(0.052, 0.062, -0.020, 0.070);
    sh.quadraticCurveTo(-0.078, 0.074, -0.115, 0);
    const geo = new THREE.ExtrudeGeometry(sh, { depth: 0.052, bevelEnabled: false, curveSegments: 10 });
    geo.translate(0, 0, -0.026);
    const a = mesh(geo, C_DIREK, { metal: 0.42, rough: 0.34, name: 'anten' });
    a.position.set(-0.520, Y_UST(-0.520) - 0.012, 0);
    modelGroup.add(a);
})();


// ===========================================================================
// 9. TAKSİ TEPE LAMBASI
// ===========================================================================
// Taksinin otomobilden TEK yapısal farkı bu, o yüzden tek kutuyla geçilmedi.
// Gerçek bir tepe lambasında olan her şey var:
//
//   AYAKLAR      iki kısa takoz; kutu tavana YAPIŞIK değil, 26 mm yukarıda.
//                Yapışık bırakılsaydı gövdeden çıkan bir tümsek gibi okunur,
//                sonradan takılmış bir aksesuar gibi durmazdı.
//   KAİDE        koyu alt çerçeve
//   IŞIK KUTUSU  sıcak beyaz, planda yuvarlatılmış dikdörtgen (uçları küt
//                değil, gerçek lamba gövdeleri gibi kavisli)
//   KAPAK        kutudan 4 mm geniş koyu üst kapak — hem çerçeve dudağı
//                veriyor hem de TEPEDEN BAKIŞTA sarı tavanın üstünde koyu
//                bir çubuk olarak seçiliyor (haritanın ana bakışı bu)
//   YAZI         ön ve arka yüzde gerçek harflerle "TAXI"
//
// ⚠️ HARFLER FONTLA DEĞİL, GEOMETRİYLE. Model kodunun elinde yalnız THREE,
// modelGroup, mesh, Math ve spin var; TextGeometry bir font dosyası ister ve
// onu getirecek bir yol yok (fetch yasak). Bu yüzden harfler düz çubuklardan
// kuruluyor: "TAXI"nin dördü de eğri içermiyor — T iki dikdörtgen, A iki eğik
// çubuk + kiriş, X iki eğik çubuk, I tek dikdörtgen. Sekiz şeklin tamamı TEK
// ExtrudeGeometry'ye veriliyor (THREE şekil DİZİSİ kabul ediyor), yani yüz
// başına tek çizim çağrısı.
//
// ⚠️ YAZI YÖNÜ. Şekiller (u,v) düzleminde kuruluyor; u soldan sağa okunacak
// yön. rotateY(+π/2) sonrası model z = -u, rotateY(-π/2) sonrası model z = +u.
// +x yüzüne bakarken ekranın sağı model -z, -x yüzüne bakarken +z. Bu yüzden
// ön yüz +π/2, arka yüz -π/2 ile döndürülüyor — ikisinde de yazı DÜZ okunuyor.
// Tek geometriyi iki kez kullansaydık arka yüzdeki "TAXI" ayna gibi çıkardı.
//
// Konum x=0.105: düz tavan 0.360 ile -0.660 arasında, yani lamba tam ortanın
// biraz önünde — gerçek tepe lambaları ön koltukların üzerinde durur.
// (x=0.200 denendi, çatının ön kenarına fazla yakın kalıyordu.)
// Tavan orada orta hatta y=1.4898, z=±0.32'de 1.4885 — 1.3 mm kubbe; ayak
// tabanı 1.4825'e oturunca takozlar tavana 6 mm gömülüyor, boşluk kalmıyor.
(function () {
    const X = 0.105;
    const TABAN = 1.4825;                       // ayakların oturduğu düzlem
    const AYAK = 0.026, KAIDE = 0.018, KUTU = 0.086, KAPAK = 0.014;
    const DER = 0.196, GEN = 0.640;             // planda derinlik (x) x genişlik (z)

    // Planda yuvarlatılmış dikdörtgen bir katman. Şekil (x,z) düzleminde
    // kuruluyor, rotateX(-π/2) itiş yönünü +y yapıyor.
    function katman(ad, der, gen, r, taban, yuk, renk, opts) {
        const geo = new THREE.ExtrudeGeometry(
            yuvarlakSekil([[-der / 2, -gen / 2], [der / 2, -gen / 2],
                           [der / 2, gen / 2], [-der / 2, gen / 2]], r),
            { depth: yuk, bevelEnabled: false, curveSegments: 6 });
        geo.rotateX(-Math.PI / 2);
        geo.translate(X, taban, 0);
        modelGroup.add(mesh(geo, renk, {
            metal: opts.metal, rough: opts.rough, name: ad }));
    }

    // ---- ayaklar ----
    [0.215, -0.215].forEach(function (z, i) {
        const a = mesh(new THREE.BoxGeometry(0.108, AYAK + 0.010, 0.050), '#1d2127',
                       { metal: 0.3, rough: 0.5, name: 'tepe_ayak_' + (i + 1) });
        a.position.set(X, TABAN + (AYAK - 0.010) / 2, z);
        modelGroup.add(a);
    });

    const y1 = TABAN + AYAK;                    // kaide altı
    const y2 = y1 + KAIDE;                      // ışık kutusu altı
    const y3 = y2 + KUTU;                       // kapak altı
    katman('tepe_kaide', DER, GEN, 0.072, y1, KAIDE, '#23272e', { metal: 0.3, rough: 0.5 });
    katman('tepe_lamba', DER - 0.008, GEN - 0.008, 0.068, y2, KUTU, '#f2ede1',
           { metal: 0.05, rough: 0.38 });
    katman('tepe_kapak', DER + 0.006, GEN + 0.006, 0.075, y3, KAPAK, '#23272e',
           { metal: 0.3, rough: 0.5 });

    // ---- "TAXI" ----
    // ARA 0.028 idi ve kelime seyrek okunuyordu (T A X I gibi).
    const H = 0.056, KAL = 0.0125, ARA = 0.020;

    // ⚠️⚠️ HARFLER AYNALANARAK KURULUYOR. HARİTA MODELİ SOLDAN SAĞA
    // TERS ÇEVİRİYOR — bu, kütüphanedeki HER model için geçerli, ama yalnız
    // yazı olan modelde belli oluyor.
    //
    // ÖLÇÜLDÜ (ayna_probu.py): haritada `camera.projectionMatrix`in
    // determinantı NEGATİF (-1.19e13). Sebep MapLibre'nin mercator tabanı:
    // x doğu, y GÜNEY, z yukarı. Model buraya yalnız DÖNDÜRÜLEREK
    // (`_rx90`) yerleştiği için model→ekran dönüşümü yön çeviren bir
    // dönüşüm oluyor. Motorun `_flipY`'si bunu yalnız SARIM için düzeltiyor
    // (sonra tuval CSS'te `scaleY(-1)` ile geri çevriliyor); aynalama
    // olduğu gibi duruyor.
    //
    // KANIT İKİ YERDEN: (1) ilk kurulumda tabelada "IXAT" yazıyordu, dört
    // yönde de ölçüldü. (2) Motorun KENDİ `uc-boyutlu-yazi` modeli de
    // harfleri x-y düzleminde kurup +z'ye itiyor ve haritada harflerin ARKA
    // yüzü kameraya bakarken DÜZ okunuyor — normal bir sahnede ters
    // okunması gerekirdi. Yani ev kuralı bu aynalamayı kabul etmek.
    //
    // Saf dönmeyle düzeltilemez: (u,v,w) → (model x=w, y=v, z=+u) bir
    // permütasyon aynası, determinantı -1. Bu yüzden aynalama ŞEKİL
    // düzeyinde yapılıyor: u negatifleniyor VE nokta sırası ters çevriliyor
    // (yalnız negatifleme sarımı CW yapardı, ikisi birlikte CCW bırakıyor).
    //
    // ⚠️ TEZGÂH ÇİZİMLERİ (bakis.py, kapak) da bu yüzden AYNALI çiziyor;
    // ikisi de haritanın gösterdiğini göstersin diye. Düz bir THREE
    // sahnesinde bakarsan yazı ters görünür — o normaldir, DÜZELTME.
    function sekil(pts) {
        const s = new THREE.Shape();
        for (let i = pts.length - 1; i >= 0; i--) {
            const p = pts[i];
            if (i === pts.length - 1) s.moveTo(-p[0], p[1]);
            else s.lineTo(-p[0], p[1]);
        }
        s.closePath();
        return s;
    }
    function dikdortgen(u0, v0, u1, v1) {
        return sekil([[u0, v0], [u1, v0], [u1, v1], [u0, v1]]);
    }
    function egikCubuk(ua, va, ub, vb, k) {
        const dx = ub - ua, dy = vb - va;
        const L = Math.sqrt(dx * dx + dy * dy) || 1;
        const nx = -dy / L * k / 2, ny = dx / L * k / 2;
        return sekil([[ua + nx, va + ny], [ub + nx, vb + ny],
                      [ub - nx, vb - ny], [ua - nx, va - ny]]);
    }
    const HARFLER = [
        { en: 0.074, ciz: function (u) { return [
            dikdortgen(u, H - KAL, u + 0.074, H),
            dikdortgen(u + (0.074 - KAL) / 2, 0, u + (0.074 + KAL) / 2, H - KAL)]; } },
        { en: 0.084, ciz: function (u) { return [
            egikCubuk(u + 0.008, 0, u + 0.042, H, KAL),
            egikCubuk(u + 0.076, 0, u + 0.042, H, KAL),
            dikdortgen(u + 0.016, H * 0.30, u + 0.068, H * 0.30 + KAL * 0.9)]; } },
        { en: 0.078, ciz: function (u) { return [
            egikCubuk(u + 0.005, 0, u + 0.073, H, KAL),
            egikCubuk(u + 0.073, 0, u + 0.005, H, KAL)]; } },
        { en: 0.024, ciz: function (u) { return [
            dikdortgen(u + (0.024 - KAL) / 2, 0, u + (0.024 + KAL) / 2, H)]; } }
    ];
    let toplam = ARA * (HARFLER.length - 1);
    HARFLER.forEach(function (h) { toplam += h.en; });
    const sekiller = [];
    let u = -toplam / 2;
    HARFLER.forEach(function (h) {
        h.ciz(u).forEach(function (s) { sekiller.push(s); });
        u += h.en + ARA;
    });

    const YAZI_Y = y2 + (KUTU - H) / 2;
    const ON_X = X + (DER - 0.008) / 2;
    [1, -1].forEach(function (s, i) {
        const geo = new THREE.ExtrudeGeometry(sekiller, {
            depth: 0.006, bevelEnabled: false, curveSegments: 2 });
        geo.rotateY(s * Math.PI / 2);
        geo.translate(s > 0 ? ON_X - 0.001 : -(ON_X - 0.001) + 2 * X, YAZI_Y, 0);
        modelGroup.add(mesh(geo, '#191c21',
                            { metal: 0.05, rough: 0.6, name: 'tepe_yazi_' + (i + 1) }));
    });
})();
