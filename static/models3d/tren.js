// Tren — modern elektrikli yolcu treni (EMU), ÜÇ BİRİM. Ulaşım temasının
// yedinci modeli.
//
// Gövde `otobus.js`teki MAKİNENİN AYNISIYLA kuruluyor: x ekseni boyunca
// istasyonlarda ayrı ayrı hesaplanan KAPALI KESİTLER birbirine dikiliyor
// (loft), her kesit parametresi kendi monoton kübik eğrisinden (PCHIP)
// okunuyor, paneller `yuzeyYama` ile gövde yüzeyine oturuyor, uç yüz
// parçaları `yuzParca` ile kapağa extrude ediliyor.
//
// AMA TREN OTOBÜS DEĞİL — üç yerde ayrılıyor:
//   * ÜÇ AYRI KABUK. Vagonlar ayrı loft'lar; aralarında 0.35 m boşluk ve
//     onu kapatan körük var. Tek kabuk denenmedi bile: vagon uçlarının
//     kapağı ve körüğün akordeonu treni tren yapan ana işaret, tek kabukta
//     72 metrelik dümdüz bir tüp kalırdı.
//   * BURUN LOFT'UN KENDİSİNDE. Sürücü vagonlarının dış ucunda kesit son
//     3.2 m'de hem daralıyor hem alçalıyor (W_OMUZ 1.45 → 0.80, çatı
//     4.05 → 3.48). Burnu ayrı bir parça olarak eklemek denenmedi:
//     otobüste ön kapak dik olduğu için ayrı parça tutuyordu, burada yüzey
//     sürekli değişiyor, ek parça gövdeyle dikiş yeri verirdi.
//   * ÇAMURLUK KEMERİ YOK. Trende teker gövdenin İÇİNDE değil, gövdenin
//     ALTINDAKİ bojinin içinde. Kesitin tabanı bu yüzden boydan boya düz;
//     otobüsteki `kemerUst` makinesi buraya hiç girmedi.
//
// GERÇEK ÖLÇÜLER (metre, y = 0 ZEMİN yani balastın altı):
//   vagon adımı 24.00 · gövde uzunluğu 23.65 · boşluk 0.35
//   toplam gövde 71.65 · genişlik 2.90 · çatı 4.05 · pantograf 4.45
//   ray başı 0.30 · teker yarıçapı 0.46 · teker genişliği 0.135
//   aks yüksekliği 0.76 · ray açıklığı 1.435 → teker z = ±0.7175
//   boji merkezi vagon ucundan 3.50 içeride · aks aralığı 2.50
//   yolcu zemini ray başından 1.15 → y 1.45
//
// ⚠️ RAY MODEL UZAYINDA, VE ZEMİN ONA GÖRE. Ray isteğe bağlı (annotation
// alanı `railTrack`, motorun `_RAY` tablosu). Ray AÇIKKEN balastın altı
// y=0'a, tekerler ray başına (0.30) oturuyor. Ray KAPALIYKEN motor treni
// tam 0.30 aşağı indiriyor (`_RAY.yukseklik`), yani tekerler yine yere
// değiyor. Model kodu bayrağı GÖREMEZ; bu yüzden ölçüler tek bir tabana
// (ray açık hali) göre yazıldı ve telafi motorda.
//
// ⚠️ RAY MODELİN KUTUSUNU BÜYÜTÜR. Ray x'te ±54 (108 m), tren 71.65 m.
// `sizeKm` ölçeği max(box.x, box.z)'a bölündüğü için ham hâlde ray açılınca
// tren %66'ya küçülürdü. Çözüm motorda: `_RAY.parts`taki parçalar ÖLÇÜ
// kutusunun DIŞINDA bırakılıyor (bkz. studio-3d.js `_RAY` notu), gölge
// kutusu ise tam kalıyor ki rayın gölgesi kesilmesin.
// Rayın z'si BİLEREK gövdeyle aynı: balastın tabanı ±1.45, traversler
// ±1.30. Böylece ray açık/kapalı kutu z'si 2.90'da sabit kalıyor.
//
// PARÇALAR (Studio3D bu adları arar, DEĞİŞTİRME):
//   teker_1 .. teker_24  → GRUP. Hepsi yuvarlanır, HİÇBİRİ direksiyon
//                          kırmaz (_WHEELS.front YOK — tren raydadır).
//   govde_1/2/3          → RENK ALIR (_TINT). Üç vagon kabuğu.
//   balast, travers, ray_1, ray_2 → _RAY parçaları (görünürlüğü panelden).
//   cam_*, kapi_*, boji_*, panto_* → renk almaz.
//
// ⚠️ YAZI YOK. Harita modeli soldan sağa aynalıyor (OKU.md'deki ölçülmüş
// tuzak: det(projection) negatif); taksinin tepe lambasında "IXAT"
// çıkmıştı. Trenin hat numarası/tabelası bu bedeli hak etmiyor.
//
// ⚠️ KAPILAR İKİ TARAFTA DA VAR — gerçekte de öyle (tren her iki perona da
// yanaşır), ayrıca otobüs notundaki aynalama gerekçesi burada da geçerli.
//
// AĞIRLIK HEDEFİ: üç vagon olduğu için tavan 18000 üçgen. Kesit halkası 28
// (otobüste 38): trenin yan yüzü otobüsünkinden de düz, örnek yalnız çatı
// kubbesine ve alt yanağa gerekiyor.
//
// YÖN: burun +x, üst +y, zemin y=0. Ölçüler gerçek metre.

// ===========================================================================
// 0. RENKLER
// ===========================================================================
const C_GOVDE   = '#c0392b';   // _TINT varsayılanı — TCDD koyu kırmızısı
const C_CAM     = '#141a22';
const C_KAPI    = '#0c1016';   // kapı kanadı — camdan bir tık KOYU olsun ki
                               // cam bandının hizasında ayırt edilsin
const C_RAY_CIT = '#6d757e';   // kapı rayı / kanat kenarı
const C_DIREK   = '#0e1115';
const C_KORUK   = '#101318';   // körük akordeonu
const C_KORUK_R = '#242a31';   // körük kaburgası
const C_BOJI    = '#22262c';
const C_BOJI_K  = '#33383f';
const C_TEKER   = '#3a3f46';   // tren tekeri ÇELİKTİR, lastik değil: otobüsün
                               // '#1b1b1e' kadar koyu olsaydı bojinin içinde
                               // kaybolurdu
const C_TEKER_D = '#5a616a';   // teker göbeği/bandajı
const C_ALT     = '#191d22';   // alt ekipman kutuları
const C_CATI    = '#7d8791';   // çatı gri boyası — gövde rengini ALMAZ
const C_KLIMA   = '#242930';
const C_PANTO   = '#15181d';
const C_PANTO_K = '#2c3239';
const C_IZOLE   = '#8e9298';   // pantograf izolatörü (porselen)
const C_FAR     = '#d6e2ee';
const C_FAR_IC  = '#333a42';
const C_STOP    = '#a5302a';
const C_BANT    = '#1a1e25';   // bel/etek şeridi
// ⚠️ HAT RENKLERİ İKİ KEZ DÜZELTİLDİ, İKİSİ DE ÖLÇÜMLE.
// 1. İlk kurulum: balast '#5b5751', travers '#4a4640'. Haritada tek bir
//    BEYAZ ŞERİT olarak okunuyordu. Sebep ölçüldü: motorun ışığı yukarı
//    bakan mat bir yüzeyi ~2.8 KAT açıyor (balast pikseli örneklendi:
//    taban (59,56,51) → ekranda (163,159,153)). Gövdenin '#c0392b'si de
//    bu yüzden somon çıkıyor.
// 2. Sadece koyultmak yetmedi: balast açık, travers KOYU olduğu için
//    gerçeğin TERSİ bir desen çıkıyordu ve haritada travers hiç
//    seçilmiyordu. Gerçekte balast KOYU taş, travers AÇIK betondur.
//    İkisi takas edildi; tepeden bakışta koyu zemin üzerinde açık
//    kesikli çizgi = 'demiryolu' okuyan desen bu.
const C_BALAST  = '#2a2724';   // koyu taş
const C_TRAVERS = '#6b675f';   // acik beton travers
const C_RAY_CEL = '#7a756b';   // ray çeliği — üstü aşınmış, parlak DEĞİL:
                               // haritanın ana bakışı tepeden, parlak ray
                               // iki beyaz çizgiye dönüp treni yutuyordu

// ===========================================================================
// 1. TEMEL ÖLÇÜLER
// ===========================================================================
const VAGON     = 24.00;               // vagon adımı (merkezden merkeze)
const ARALIK    = 0.35;                // vagon arası boşluk (körük kapatır)
const GOVDE_L   = VAGON - ARALIK;      // 23.65 — bir kabuğun uzunluğu
const YARI_L    = GOVDE_L / 2;         // 11.825
const VAGON_X   = [-VAGON, 0, VAGON];  // vagon merkezleri → toplam 71.65
const YARI_W    = 1.45;                // yarı genişlik (2.90)

const RAY_UST   = 0.30;                // ray başının üstü = tekerin değdiği düzlem
const R_TEKER   = 0.46;                // çap 0.92 — _WHEELS.radius ile BİREBİR
                                       // aynı olmak zorunda; motor kat edilen
                                       // yolu yarıçapa bölerek yuvarlanmayı
                                       // hesaplıyor, tutmazsa teker patinaj
                                       // yapıyormuş gibi döner
const TEKER_GEN = 0.135;
const AKS_Y     = RAY_UST + R_TEKER;   // 0.76
const IZ_Z      = 0.71750;             // 1.435 / 2 — standart açıklık
const BOJI_IC   = 3.50;                // boji merkezi vagon ucundan içeride
const AKS_ARA   = 2.50;                // boji içindeki iki aks arası
const BOJI_L    = YARI_L - BOJI_IC;    // 8.325 — boji merkezinin yerel x'i

const CATI      = 4.05;                // gövde tepesi
const PANTO_UST = 4.45;                // pantograf tepesi → kutu y'si bu
const ZEMIN     = RAY_UST + 1.15;      // yolcu zemini 1.45
const CAM_ALT   = 2.20;                // cam bandı alt kenarı
const CAM_UST   = 3.35;                // cam bandı üst kenarı
const KAPI_ALT  = 1.38;                // kapı eşiği — yolcu zemininin 7 cm altı
const KAPI_UST  = CAM_UST;

const NV        = 15;                  // yarı kesitteki örnek → halka 2*NV-2 = 28
const US_YANAK  = 0.50;                // alt yanak süper-elips üssü (dik yanak)
const US_CATI   = 0.62;                // çatı kubbesi üssü — ortada düz, kenarda
                                       // ~0.30 yarıçaplı köşe
const BOMBE     = 0.006;               // omuz kavisinin dışa şişmesi
const PAH_B     = 0.16;                // burun ucundaki yuvarlatma boyu
const PAH_UC    = 0.86;                // ucun kesit ölçeği. 0.92 denendi ve
                                       // BIRAKILDI: uç kapağı 1.47 m genişlikte
                                       // düz bir levha gibi duruyordu, burun
                                       // aerodinamik okumuyordu.

// Kesit parametresi v'nin bölüm sınırları (otobüsteki beş bölümün aynısı):
//   A [0..VA]   taban · B [VA..VB] alt yanak · C [VB..VC] DİK yan yüz
//   D [VC..VD]  omuz kavisi · E [VD..1] çatı kubbesi
// ⚠️ Sınırlar otobüsünkinden BAŞKA. Trende dik duvar 1.82 m (yO 1.70 →
// yB 3.52), otobüste 1.15 m; ama trende alt yanak da daha uzun (0.72 m)
// çünkü gövde etekten omuza kadar açılıyor. Örnekler oraya ve çatıya
// dağıtıldı, dik duvara az verildi (düz çizgi, örnek harcamasın).
const VA = 0.028, VB = 0.190, VC = 0.560, VD = 0.720;

// ===========================================================================
// 2. MONOTON KÜBİK EĞRİ (PCHIP)
// ===========================================================================
// Catmull-Rom otomobilde denendi ve BIRAKILDI: eğimin hızla değiştiği yerde
// taşma yapıyor. Trende taşma en pahalı yer burun: 3.2 m'de çatı 57 cm
// iniyor, taşan bir eğri burnun üstüne tümsek atardı.
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

// ---- İKİ EĞRİ KÜMESİ ------------------------------------------------------
// Eğriler YEREL x (l) ile yazılıyor: l = 0 vagon ortası, l = ±11.825 vagon
// uçları. Sürücü vagonunun burnu HER ZAMAN +l ucunda; arka sürücü vagonu
// aynı kümeyle kurulup yerleştirmede x negatifleniyor (bkz. `vagonKur`).
// Böylece burun eğrileri TEK YERDE yazılıyor, iki kopya ayrışamıyor.
//
// Körük ucundaki pah (son 0.375 m): gövde kesiti orada 6 cm daralıp 6 cm
// alçalıyor. Bu, körüğü gövdenin İÇİNE oturtan yuvayı açıyor; pah olmasaydı
// körük gövdenin dışına yapıştırılmış bir kutu gibi dururdu.
function egriKumesi(burun) {
    const K = {};
    // Körük ucu (l = -11.825) değerleri — iki vagon tipinde de aynı.
    const gU = [[-11.825, 3.99], [-11.700, 4.03], [-11.450, 4.05]];
    const gA = [[-11.825, 1.04], [-11.700, 1.00], [-11.450, 0.98]];
    const gO = [[-11.825, 1.72], [-11.450, 1.70]];
    const gW = [[-11.825, 1.39], [-11.700, 1.435], [-11.450, 1.45]];
    const gB = [[-11.825, 3.47], [-11.700, 3.505], [-11.450, 3.52]];
    const gC = [[-11.825, 1.06], [-11.700, 1.105], [-11.450, 1.12]];
    const gE = [[-11.825, 1.28], [-11.700, 1.325], [-11.450, 1.34]];
    const gK = [[-11.825, 0.28], [-11.450, 0.26]];
    // +l ucu: sürücü vagonunda BURUN, orta vagonda körük pahının aynası.
    const ayna = (a) => a.slice().reverse().map(p => [-p[0], p[1]]);
    // ---- BURUN. Son 3.2 m'de kesit hem daralıyor hem alçalıyor. Değerler
    // göz kararı değil, üç kısıttan çıkarıldı:
    //   1. yB < yU - 0.10 her istasyonda (omuz kavisine yer kalsın),
    //   2. wC < wB - 0.01 (çatı kenarı yan yüzün içinde kalsın),
    //   3. burun ucunda kabin sığacak kadar genişlik (yarı 0.80 → 1.60 m
    //      kabin genişliği; 0.62 denendi, ön cam sığmıyordu).
    const bU = [[8.60, 4.05], [9.60, 4.040], [10.30, 4.010], [10.80, 3.960],
                [11.20, 3.870], [11.50, 3.740], [11.70, 3.610], [11.825, 3.480]];
    const bA = [[9.60, 0.975], [10.30, 0.955], [10.80, 0.925], [11.20, 0.880],
                [11.50, 0.825], [11.70, 0.775], [11.825, 0.735]];
    const bO = [[9.60, 1.710], [10.30, 1.740], [10.80, 1.790], [11.20, 1.860],
                [11.50, 1.940], [11.70, 2.000], [11.825, 2.040]];
    const bW = [[8.60, 1.450], [9.60, 1.445], [10.30, 1.425], [10.80, 1.380],
                [11.20, 1.310], [11.50, 1.170], [11.70, 1.000], [11.825, 0.800]];
    const bB = [[9.60, 3.515], [10.30, 3.495], [10.80, 3.450], [11.20, 3.360],
                [11.50, 3.200], [11.70, 3.020], [11.825, 2.820]];
    const bC = [[9.60, 1.115], [10.30, 1.095], [10.80, 1.055], [11.20, 0.990],
                [11.50, 0.880], [11.70, 0.750], [11.825, 0.580]];
    const bE = [[9.60, 1.335], [10.30, 1.310], [10.80, 1.255], [11.20, 1.180],
                [11.50, 1.050], [11.70, 0.890], [11.825, 0.700]];
    const bK = [[9.60, 0.265], [10.30, 0.275], [10.80, 0.290], [11.20, 0.305],
                [11.50, 0.325], [11.70, 0.340], [11.825, 0.350]];
    K.Y_UST  = egriYap(gU.concat(burun ? bU : ayna(gU)));
    K.Y_ALT  = egriYap(gA.concat(burun ? bA : ayna(gA)));
    K.Y_OMUZ = egriYap(gO.concat(burun ? bO : ayna(gO)));
    K.W_OMUZ = egriYap(gW.concat(burun ? bW : ayna(gW)));
    K.Y_BEL  = egriYap(gB.concat(burun ? bB : ayna(gB)));
    K.W_CATI = egriYap(gC.concat(burun ? bC : ayna(gC)));
    K.W_ESIK = egriYap(gE.concat(burun ? bE : ayna(gE)));
    K.KUBBE  = egriYap(gK.concat(burun ? bK : ayna(gK)));
    // Cam bandı üstünde genişliğin omuzdan içeri çekilmesi. 10 mm: 1.8 m
    // boyunca 10 mm, yani 0.3° — yan yüz gerçekten dik. Trende tumblehome
    // yoktur; kavis çatıda başlar.
    K.D_BEL  = egriYap([[-12, 0.010], [12, 0.010]]);
    K.burun  = burun;
    return K;
}

const E_SURUCU = egriKumesi(true);
const E_ORTA   = egriKumesi(false);

// ===========================================================================
// 3. KESİT
// ===========================================================================
// Vagon tanımları. `yon` = +1 ise yerel +l global +x'e, -1 ise -x'e bakar;
// arka sürücü vagonu böylece aynı eğri kümesiyle kuruluyor.
const VAGONLAR = [
    { cx: VAGON_X[0], yon: -1, E: E_SURUCU, ad: 1 },   // arka sürücü vagonu
    { cx: VAGON_X[1], yon:  1, E: E_ORTA,   ad: 2 },   // orta yolcu vagonu
    { cx: VAGON_X[2], yon:  1, E: E_SURUCU, ad: 3 }    // ön sürücü vagonu
];

// Global x hangi vagona düşüyor. Boşlukta (vagon arası 0.35 m) en yakın
// vagona düşer; yüzey yamaları oraya hiç uzanmıyor.
function vagonBul(x) {
    let en = VAGONLAR[0], d0 = 1e9;
    for (const V of VAGONLAR) {
        const d = Math.max(Math.abs(x - V.cx) - YARI_L, 0);
        if (d < d0) { d0 = d; en = V; }
    }
    return en;
}
function yerelX(V, x) { return (x - V.cx) * V.yon; }

// Bir istasyonun dokuz parametresi (yerel l ile).
function kesitParV(V, l) {
    const E = V.E;
    let yU = E.Y_UST(l);
    let yA = E.Y_ALT(l);
    let yO = E.Y_OMUZ(l);
    const wO = E.W_OMUZ(l);
    let wA = Math.min(E.W_ESIK(l), wO - 0.008);
    let yB = Math.min(E.Y_BEL(l), yU - 0.10);
    const wB = Math.max(0.03, wO - E.D_BEL(l));
    let yC = Math.max(yB + 0.020, yU - E.KUBBE(l));
    let wC = Math.min(E.W_CATI(l), wB - 0.010);

    // BURUN UCU YUVARLATMASI: son PAH_B kadarlık bölümde kesit kendi
    // merkezine doğru daire yayıyla küçülüyor → uç hem planda hem düşeyde
    // yuvarlanıyor. Düz kapak keskin bir levha bırakırdı.
    // ⚠️ Yalnız BURUN ucunda. Körük ucunda uygulanmıyor: orada kapak zaten
    // körüğün içinde kalıyor, yuvarlatmak körükle gövde arasında boşluk açardı.
    if (E.burun) {
        const uc = l - (YARI_L - PAH_B);
        if (uc > 0) {
            const f = PAH_UC + (1 - PAH_UC) *
                      Math.sqrt(Math.max(0, 1 - (uc / PAH_B) * (uc / PAH_B)));
            const yc = (yA + yU) / 2;
            yA = yc + (yA - yc) * f; yO = yc + (yO - yc) * f;
            yB = yc + (yB - yc) * f; yC = yc + (yC - yc) * f; yU = yc + (yU - yc) * f;
            return { yA: yA, wA: wA * f, yO: yO, wO: wO * f, yB: yB, wB: wB * f,
                     yC: yC, wC: wC * f, yU: yU };
        }
    }
    return { yA: yA, wA: wA, yO: yO, wO: wO, yB: yB, wB: wB,
             yC: yC, wC: wC, yU: yU };
}

// GLOBAL x ile. (kesit_olc.js bu imzayı arıyor.)
function kesitPar(x) { const V = vagonBul(x); return kesitParV(V, yerelX(V, x)); }

// Yarı kesitin v parametresindeki noktası → [z, y]. v: 0 = taban ortası,
// 1 = tepe ortası.
function kesitNokta(P, v) {
    if (v <= VA) return [P.wA * (v / VA), P.yA];
    if (v <= VB) {
        // Süper-elips çeyreği: (wA,yA) köşesinden çıkıp (wO,yO)'da DİKEY
        // teğetle bitiyor. Üs 0.50 → etek köşesi yuvarlanıp yan yüz hemen
        // dikleşiyor; trenin alt kenarındaki hafif içe çekilme bu.
        const t = (v - VA) / (VB - VA), th = t * Math.PI / 2;
        return [P.wA + (P.wO - P.wA) * Math.pow(Math.sin(th), US_YANAK),
                P.yO - (P.yO - P.yA) * Math.pow(Math.cos(th), US_YANAK)];
    }
    if (v <= VC) {
        // DİK YAN YÜZ. Trende karakter çizgisi YOK — vagon yanı düz bir
        // alüminyum panel. Çizgi işini cam bandı, bel şeridi ve etek şeridi
        // görüyor; kesite kavis işlemek şişkin, tren olmayan bir gövde verirdi.
        const t = (v - VB) / (VC - VB);
        const e = t * t * (3 - 2 * t);
        return [P.wO + (P.wB - P.wO) * e, P.yO + (P.yB - P.yO) * t];
    }
    if (v <= VD) {
        // Omuz kavisi: yan yüzün üstü ile çatı kenarı arasında ikinci derece
        // Bezier; denetim noktası dışa itiliyor → yüzey hafif bombeli.
        const t = (v - VC) / (VD - VC), u = 1 - t;
        const cz = (P.wB + P.wC) / 2 + BOMBE, cy = (P.yB + P.yC) / 2;
        return [u * u * P.wB + 2 * u * t * cz + t * t * P.wC,
                u * u * P.yB + 2 * u * t * cy + t * t * P.yC];
    }
    const t = (v - VD) / (1 - VD), th = t * Math.PI / 2;
    return [P.wC * Math.pow(Math.cos(th), US_CATI),
            P.yC + (P.yU - P.yC) * Math.pow(Math.sin(th), US_CATI)];
}

// Yüzey noktası. w ∈ [-1,1]: 0 = tepe orta hattı, ±1 = taban. (v = 1 - |w|.)
function nokta3(x, w) {
    const p = kesitNokta(kesitPar(x), 1 - Math.abs(w));
    return [x, p[1], (w < 0 ? -p[0] : p[0])];
}

// Sayısal yüzey normali (dışa bakar). Panelleri yüzeyden bu yönde ötelüyoruz.
function normal3(x, w) {
    const h = 0.0035;
    const V = vagonBul(x);
    // Vagon ucuna 4 mm'den yakınsa fark ötekİ yöne alınıyor; yoksa komşu
    // vagona ya da boşluğa taşıp normal saçmalıyor.
    const l = yerelX(V, x);
    const hx = (Math.abs(l) > YARI_L - 0.004) ? -h * V.yon * Math.sign(l || 1) : h;
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
// Verilen x ve yükseklikteki w (kesit parametresi, +z tarafı).
function wYukseklik(x, y) { return 1 - vYukseklik(x, y); }

// ===========================================================================
// 4. GÖVDE KABUKLARI (üç loft)
// ===========================================================================
const R_HALKA = 2 * NV - 2;   // 28

function halka(x) {
    const P = kesitPar(x), yarim = [];
    for (let i = 0; i < NV; i++) yarim.push(kesitNokta(P, i / (NV - 1)));
    // 0 = taban ortası → +z tarafı yukarı → NV-1 = tepe ortası → -z tarafı
    // aşağı. Kapalı halka, kutup yok, bozuk üçgen yok.
    const r = [];
    for (let i = 0; i < NV; i++) r.push([yarim[i][1], yarim[i][0]]);
    for (let i = NV - 2; i >= 1; i--) r.push([yarim[i][1], -yarim[i][0]]);
    return r;
}

// İstasyonlar. Burun bölgesinde sık (kesit orada 3.2 m'de tamamen
// değişiyor), iki boji arasındaki 16 m'de seyrek (kesit HİÇ değişmiyor,
// sık örneklemek yalnız üçgen harcar).
const IST_SURUCU = [
    -11.825, -11.750, -11.620, -11.450, -10.500, -8.000, -4.000, 0.000,
      4.000,   7.000,   8.600,   9.600,  10.300,  10.800,  11.100, 11.350,
     11.550,  11.665,  11.710,  11.755,  11.790,  11.825
];
const IST_ORTA = [
    -11.825, -11.760, -11.700, -11.620, -11.450, -9.000, -4.500, 0.000,
      4.500,   9.000,  11.450,  11.620,  11.700,  11.760, 11.825
];

function govdeKur(V, ad, istYerel) {
    // Yerel istasyonları globale çevir. yon = -1 ise global x AZALARAK
    // ilerler; listeyi ters çeviriyoruz ki dikiş sarımı (winding) korunsun.
    // ⚠️ x'i negatiflemek bir YANSIMADIR, tek başına sarımı ters çevirir;
    // istasyon sırasını da ters çevirmek onu geri alıyor. İkisi birden
    // yapılmazsa vagonun içi dışına dönüyor (culling modelin içini gösterir).
    let ist = istYerel.map(l => V.cx + V.yon * l);
    if (V.yon < 0) ist = ist.slice().reverse();

    const P = [], IDX = [];
    for (let i = 0; i < ist.length; i++) {
        const h = halka(ist[i]);
        for (let j = 0; j < R_HALKA; j++) P.push(ist[i], h[j][0], h[j][1]);
    }
    for (let i = 0; i < ist.length - 1; i++) {
        for (let j = 0; j < R_HALKA; j++) {
            const j2 = (j + 1) % R_HALKA;
            const a = i * R_HALKA + j, b = i * R_HALKA + j2;
            const c = (i + 1) * R_HALKA + j, d = (i + 1) * R_HALKA + j2;
            IDX.push(a, c, d, a, d, b);
        }
    }
    // Uç kapakları: düz üçgen yelpaze. Halka köşeleri KOPYALANIYOR ki
    // computeVertexNormals kapağın normalini yan yüzeyinkiyle ortalamasın —
    // ortalasaydı vagon ucundaki keskin köşe yumuşayıp balon gibi görünürdü.
    function kapak(x, onYuz) {
        const h = halka(x);
        let ym = 0;
        for (const p of h) ym += p[0];
        ym /= h.length;
        const merkez = P.length / 3;
        P.push(x, ym, 0);
        const bas = merkez + 1;
        for (let j = 0; j < R_HALKA; j++) P.push(x, h[j][0], h[j][1]);
        for (let j = 0; j < R_HALKA; j++) {
            const a = bas + j, b = bas + (j + 1) % R_HALKA;
            if (onYuz) IDX.push(merkez, b, a); else IDX.push(merkez, a, b);
        }
    }
    kapak(ist[ist.length - 1], true);
    kapak(ist[0], false);

    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.Float32BufferAttribute(P, 3));
    geo.setIndex(IDX);
    geo.computeVertexNormals();
    // ⚠️ metal 0.38 / rough 0.38 ile gövde üzerinde LEKELİ parlamalar
    // çıkıyordu (önden çizimde ölçüldü): sahnede environment map yok,
    // yansıyan tek şey doğrudan ışık, ve pürüzsüz metal onu dar bir
    // beyaz lekeye topluyor. 0.30/0.45 aynı boyalı sac hissini veriyor
    // ama parlama yüzeye yayılıyor.
    modelGroup.add(mesh(geo, C_GOVDE, { metal: 0.30, rough: 0.45, name: ad }));
}

govdeKur(VAGONLAR[0], 'govde_1', IST_SURUCU);
govdeKur(VAGONLAR[1], 'govde_2', IST_ORTA);
govdeKur(VAGONLAR[2], 'govde_3', IST_SURUCU);

// ===========================================================================
// 5. YÜZEYE OTURAN PANELLER
// ===========================================================================
// Cam bandı, kapılar, şeritler — hepsi aynı yardımcıdan: gövde yüzeyi
// x1..x2 ve w1..w2 aralığında yeniden örnekleniyor ve normal boyunca
// `disari` kadar ötelenıyor. Böylece panel gövdenin kavisine BİREBİR
// oturuyor; düz bir levha burun bölgesinde yüzeyin içine girerdi.
// Bant biçimi: [x1, x2, a1, a2]        → a, kesit parametresi w.
//              [x1, x2, y1, y2, taraf] → a YÜKSEKLİK; her x'te o yüksekliğin
//                                        w'si aranıyor.
//
// ⚠️ `nx` bandın x yönündeki, `nw` w yönündeki bölüntüsü. Bandın UZUN
// kenarına ÇOK, kısa kenarına AZ verilir. Ters verilirse şerit gövdenin
// kavisini takip edemeyip yüzeyin içine girer ve KAYBOLUR.
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
    // ⚠️ DERİNLİK KAVGASI (z-fighting) — TRENDE ÖLÇÜLDÜ, OTOBÜSTE YOKTU.
    // Cam bandı ilk kurulumda gövdenin üstüne serpilmiş siyah/kırmızı
    // benekler halinde çıkıyordu. Sebep gölge değil (castShadow/receiveShadow
    // kapatıldı, hiç değişmedi): DERİNLİK TAMPONU ÇÖZÜNÜRLÜĞÜ. Perspektif
    // projeksiyonda derinlik hassasiyeti uzaklığın karesiyle bozuluyor;
    // 72 metrelik bir modeli kadraja sığdıran kamera 12 mm'lik bir farkı
    // ayırt edemiyor (otobüs 12 m olduğu için aynı 12 mm rahat yetiyordu).
    // Öteleme 4 katına çıkarıldığında benek KAYBOLDU — ölçüm bu.
    //
    // Çözüm ötelemeyi büyütmek DEĞİL (4 kat = kutu z'si 2.95'ten 3.10'a
    // çıkıyor, panel de gövdeden 10 cm ayrı duran bir levhaya dönüyor):
    // polygonOffset. Parça, DÜNYA uzayında yerinde kalıp yalnız derinlik
    // tamponunda kameraya doğru kaydırılıyor. `kat` panelin katman sırası
    // (1 = gövdeye en yakın); üst katmanlar daha çok kaydırılıyor ki
    // paneller kendi aralarında da kavga etmesin.
    const kat = opts.kat == null ? 1 : opts.kat;
    m.material.polygonOffset = true;
    m.material.polygonOffsetFactor = -1.2 * kat;
    m.material.polygonOffsetUnits = -6 * kat;
    // Kalınlıksız paneller GÖLGE DÜŞÜRMEZ: gövdeye 12-56 mm mesafede
    // duruyorlar, gölge haritasında kendi gölgelerini gövdenin üstüne basıp
    // benek (acne) üretiyorlardı.
    m.castShadow = false;
    // ⚠️ VE GÖLGE ALMAZ. Bu otobüste GEREKMİYORDU, trende ŞART ve sebebi
    // ölçüldü: gölge haritası modelin TAMAMINI kapsıyor, tren 72 m (otobüs
    // 12 m). Aynı çözünürlükte texel başına düşen mesafe altı katına
    // çıkıyor, yani gövdenin kendi gölge derinliği ile 12 mm dışındaki
    // panelin derinliği aynı texele düşüyor. Sonuç: cam bandının her yerine
    // serpilmiş siyah benek (yakın plan çiziminde görüldü). Panelin gölge
    // ALMASI zaten anlamsız — 12 mm kalınlıksız bir çıkartma.
    m.receiveShadow = false;
    modelGroup.add(m);
    return m;
}

// ---- CAM BANDI — treni tren yapan ana işaret ------------------------------
// Üç vagonu boydan boya kesen kesintisiz koyu şerit. Haritada 60-120 piksele
// düşen bir aracın tren olduğunu söyleyen şey bu bant + körüklerin ritmidir.
//
// ⚠️ SÜRÜCÜ VAGONUNDA İKİ AYRI ÇAĞRI. Gövde boyu bölümü YÜKSEKLİK biçiminde
// (bant yatay bir çizgiyi izlesin), burun bölümü ise w (kesit parametresi)
// biçiminde. Sebep otobüste ölçüldü ve burada daha da keskin: burunda çatı
// 3.2 m'de 57 cm iniyor, sabit y=3.35 orada kesitin başka bir bölgesine
// (kubbenin içine) geçiyor ve panel oradaki hızlı eğriliği kirişleyip
// gövdenin içine giriyor. w biçiminde kenarlar kesit TOPOLOJİSİNİ izliyor:
// bandın üstü burunda kendiliğinden alçalıyor — sarmalayan ön camın yaptığı
// da tam bu.
//
// ⚠️ w değerleri ELLE YAZILMIYOR, birleşme noktasında HESAPLANIYOR
// (`wYukseklik`). Otobüste bu değerler kesit_olc.js ile ölçülüp elle
// yazılmıştı; burada kesit her vagonda aynı olduğu için kodun kendisi
// okuyabiliyor, ve eğriler değişince kendiliğinden doğru kalıyor.
const BURUN_BAS = 8.60;      // yerel l: burun bandının başladığı yer

VAGONLAR.forEach(function (V) {
    const gx = (l) => V.cx + V.yon * l;
    const surucu = V.E.burun;
    const l1 = -YARI_L + 0.42;                 // körük ucundaki pahtan sonra
    const l2 = surucu ? BURUN_BAS : YARI_L - 0.42;
    [1, -1].forEach(function (s, i) {
        yuzeyYama('cam_bant_' + V.ad + '_' + (i + 1),
                  [[gx(l1), gx(l2), CAM_ALT, CAM_UST, s]],
                  surucu ? 26 : 30, 2, 0.014, C_CAM, { metal: 0.35, rough: 0.16, kat: 1 });
        if (!surucu) return;
        // Sarmalayan ön cam: burun köşesini dolanıyor.
        const wAlt = wYukseklik(gx(l2), CAM_ALT);
        const wUst = wYukseklik(gx(l2), CAM_UST);
        yuzeyYama('cam_burun_' + V.ad + '_' + (i + 1),
                  [[gx(l2), gx(YARI_L - 0.30), s * wAlt, s * wUst]],
                  10, 5, 0.014, C_CAM, { metal: 0.35, rough: 0.16, kat: 1 });
    });
});

// ---- PENCERE BÖLMELERİ ----------------------------------------------------
// Cam bandını tek uzun koyu şerit olmaktan çıkaran ince dikmeler. Bunlar
// olmadan 71 m'lik kesintisiz bir çizgi kalıyor ve tren bir boruya dönüyor;
// dikmeler hem pencereleri sayılabilir yapıyor hem gövdeye ölçek veriyor.
VAGONLAR.forEach(function (V) {
    const gx = (l) => V.cx + V.yon * l;
    const surucu = V.E.burun;
    const dikme = [];
    const l1 = -YARI_L + 0.42, l2 = surucu ? BURUN_BAS : YARI_L - 0.42;
    // ⚠️ 7 bölüntü ile pencere genişliği 2.86 m çıkıyordu — gerçek bir
    // EMU penceresi 1.4-1.8 m. 12 bölüntü ile 1.67 m, yani cam bandı
    // sayılabilir pencerelere ayrılıyor ve gövdeye ölçek geliyor.
    const n = 12;
    for (let k = 1; k < n; k++) {
        const l = l1 + (l2 - l1) * k / n;
        [1, -1].forEach(function (s) {
            dikme.push([gx(l) - 0.055, gx(l) + 0.055, CAM_ALT + 0.02, CAM_UST - 0.02, s]);
        });
    }
    yuzeyYama('cam_dikme_' + V.ad, dikme, 1, 3, 0.022, C_DIREK,
              { metal: 0.25, rough: 0.45, kat: 2 });
});

// ---- KAPILAR --------------------------------------------------------------
// Çift kanatlı sürgülü kapılar; alçak tabanlı EMU'da eşik yolcu zeminiyle
// aynı hizada, basamak yok. Sürücü vagonunda burun ucunda kapı YOK (orada
// kabin var), o yüzden kapılar körük ucuna ve vagon ortasına kayıyor.
VAGONLAR.forEach(function (V) {
    const gx = (l) => V.cx + V.yon * l;
    // ⚠️ Kapılar vagonun DÖRTTE BİR / DÖRTTE ÜÇ noktasında (yerel ±5.90),
    // bojilerin (±8.325) ARASINDA. İlk kurulumda ±8.60'taydı, yani tam
    // bojinin üstünde: yandan bakışta kapı eşiği ile boji kirişi üst üste
    // düşüyor ve kapı zeminden çıkıyormuş gibi okunuyordu.
    const yerler = [-5.90, 5.90];
    const kanat = [];
    const dikme = [];
    yerler.forEach(function (kl) {
        [1, -1].forEach(function (s) {
            const a = gx(kl - 0.65), b = gx(kl + 0.65);
            kanat.push([Math.min(a, b), Math.max(a, b), KAPI_ALT, KAPI_UST, s]);
            // Kanat kenarları + ortadaki birleşme dikmesi. Bunlar olmadan
            // kapı, cam bandının hizasında kaybolan bir ton farkından
            // ibaret kalıyordu.
            [-0.65, 0, 0.65].forEach(function (d) {
                const c = gx(kl + d);
                dikme.push([c - 0.028, c + 0.028, KAPI_ALT, KAPI_UST, s]);
            });
        });
    });
    // ⚠️ ÖTELEME SIRASI (yüzeyden dışarı): şerit 0.010 → cam bandı 0.012 →
    // pencere dikmesi 0.016 → kapı kanadı 0.019 → kapı dikmesi 0.025.
    // Kapı kanadı cam bandının ÜSTÜNDE olmak zorunda: bant kapının içinden
    // geçiyor ve altta kalmazsa kapı, bandın hizasında ikiye bölünüyor.
    yuzeyYama('kapi_' + V.ad, kanat, 4, 7, 0.022, C_KAPI,
              { metal: 0.25, rough: 0.32, kat: 2 });
    yuzeyYama('kapi_dikme_' + V.ad, dikme, 1, 8, 0.030, C_RAY_CIT,
              { metal: 0.35, rough: 0.42, kat: 3 });
});

// ---- BEL VE ETEK ŞERİTLERİ ------------------------------------------------
// Trende yan yüz gerçekten düz bir paneldir; kesite kavis işlemek şişkin bir
// gövde verir (otomobilde ölçülen hata). Çizgi işini iki yatay şerit görüyor:
// cam bandının hemen altındaki bel şeridi ve eteğin üstündeki koyu bordür.
// İkisi de renk değişse bile koyu kalıyor (_TINT dışında).
VAGONLAR.forEach(function (V) {
    const gx = (l) => V.cx + V.yon * l;
    const surucu = V.E.burun;
    const l1 = -YARI_L + 0.42, l2 = surucu ? BURUN_BAS + 0.9 : YARI_L - 0.42;
    const a = Math.min(gx(l1), gx(l2)), b = Math.max(gx(l1), gx(l2));
    [1, -1].forEach(function (s, i) {
        yuzeyYama('bant_bel_' + V.ad + '_' + (i + 1),
                  [[a, b, CAM_ALT - 0.17, CAM_ALT - 0.05, s]], 12, 1, 0.014,
                  C_BANT, { metal: 0.15, rough: 0.65, kat: 1 });
        yuzeyYama('bant_etek_' + V.ad + '_' + (i + 1),
                  [[a, b, 1.09, 1.25, s]], 12, 1, 0.014,
                  C_BANT, { metal: 0.15, rough: 0.65, kat: 1 });
    });
});

// ---- ÇATI KANALI ----------------------------------------------------------
// Çatının orta hattı boyunca giden kablo/klima kanalı. Haritanın ANA BAKIŞI
// tepeden olduğu için çatı, yan yüz kadar görünür bir yüzey; boş bırakılırsa
// 71 m'lik düz bir levha kalıyor. w=0 orta hattı, bant onun iki yanında.
// ⚠️ w = ±0.040 → bant 0.88 m geniş. Önce ±0.085 yazılmıştı, ÖLÇÜLDÜ:
// kubbenin tepesi düz olduğu için o w 1.38 m'ye, yani 2.90 m'lik çatının
// yarısına karşılık geliyordu; klimalarla birlikte çatının tamamı koyu bir
// levhaya dönüşüyordu. w ile metre arasındaki bağ doğrusal DEĞİL.
VAGONLAR.forEach(function (V) {
    const gx = (l) => V.cx + V.yon * l;
    const surucu = V.E.burun;
    const l1 = -YARI_L + 0.55, l2 = surucu ? 10.20 : YARI_L - 0.55;
    const a = Math.min(gx(l1), gx(l2)), b = Math.max(gx(l1), gx(l2));
    yuzeyYama('cati_kanal_' + V.ad, [[a, b, -0.040, 0.040]], 14, 2, 0.016,
              C_KLIMA, { metal: 0.2, rough: 0.7, kat: 1 });
});

// ===========================================================================
// 6. UÇ YÜZ PARÇALARI (burun kapağı)
// ===========================================================================
// ExtrudeGeometry şekli XY düzleminde kurup +Z'ye itiyor. Uç yüz parçaları
// için şekil (z,y) düzleminde yazılıp +X'e itilmeli: rotateY(π/2) (x,y,z)'yi
// (z,y,-x)'e taşıyor, yani şeklin x'i model -z'ye düşüyor — bu yüzden
// noktalar önce negatifleniyor ve sırası ters çevriliyor (yön korunsun diye).
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
        depth: derinlik, bevelEnabled: false, curveSegments: 3
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

// ⚠️ Koordinatlar GÖZ KARARI DEĞİL, ucun ÖLÇÜLMÜŞ zarfından çıkarıldı.
// PAH_UC = 0.86 yuvarlatmasından SONRA uç kapağı y 0.927 .. 3.288 arasında
// ve yarı genişliği en fazla 0.688 (yO' = 2.049'da). Her parça bu zarfın
// İÇİNDE, etrafında boyalı kenar kalacak kadar payla duruyor:
//   y=3.05'te yarı genişlik 0.43'e düşüyor (kubbenin içi) — ön cam bu
//   yüzden 2.84'ün üstüne çıkmıyor. 3.05'e çıkarılmıştı ve üst köşeleri
//   gövdenin DIŞINA taşıyordu (ölçüldü).
//
// ⚠️ `yuzParca` geometriyi `x`ten `x+derinlik`e uzatıyor; her parçanın
// gövde kapağını 10-40 mm geçmesi lazım, yoksa parça kapağın içinde kalır.
// Ön uçta kapak x = +35.825, arka uçta x = -35.825.
const UC_X = VAGON + YARI_L;      // 35.825

[[UC_X, 1], [-UC_X, -1]].forEach(function (u, k) {
    const ux = u[0], s = u[1];
    const et = k + 1;                       // parça adı eki (1 = ön, 2 = arka)
    // ⚠️ Arka uçta parça yine +x'e doğru itiliyor (ExtrudeGeometry'nin derinliği
    // negatif olamaz) ama kapak -x'e bakıyor: başlangıç noktası kapağın DIŞINA
    // alınıyor, parça içeri doğru uzuyor. Otobüsün arka yüzündeki desenin aynısı.
    //
    // ⚠️ `cik` = parçanın kapağı GEÇTİĞİ miktar, `derin` = kalınlığı. İkisi
    // AYRI verilmek zorunda: ilk kurulumda bütün parçalar aynı x'ten başlıyordu
    // ve dış yüzleri kalınlıklarına göre sıralanıyordu — kalın çerçeve ince
    // camın ÖNÜNE geçip camı örtüyordu (ölçüldü: çerçeve 35.880, cam 35.867).
    // Şimdi katman sırası `cik` ile veriliyor: çerçeve 30 mm, cam 42 mm.
    //
    // ⚠️ VE `ux` ZATEN İŞARETLİ. İlk kurulumda arka uç için `-ux` yazılmıştı;
    // ux = -35.825 olduğu için bütün arka yüz parçaları ÖN uca gidiyordu
    // (kutu ölçümünde yakalandı: kosum_kapak_2 x = +35.775).
    const X = (derin, cik) => (s > 0 ? ux + cik - derin : ux - cik);

    // ÖN CAM ÇERÇEVESİ + CAM. Kabinin yüzü; trenin "yüz ifadesi" bu.
    yuzParca('burun_cerceve_' + et,
             [[-0.560, 1.990], [0.560, 1.990], [0.470, 2.930], [-0.470, 2.930]],
             0.110, X(0.075, 0.030), 0.075, C_DIREK, { metal: 0.2, rough: 0.55 });
    yuzParca('burun_cam_' + et,
             [[-0.500, 2.050], [0.500, 2.050], [0.420, 2.870], [-0.420, 2.870]],
             0.095, X(0.062, 0.042), 0.062, C_CAM, { metal: 0.35, rough: 0.14 });

    // FARLAR: iki yanda dikdörtgen küme. Trende far grubu ALÇAKTIR
    // (otomobilde kaputa dolanır, trende kabinin altında düz durur).
    [1, -1].forEach(function (t, i) {
        yuzParca('far_kase_' + et + '_' + (i + 1),
                 [[t * 0.155, 1.300], [t * 0.565, 1.300],
                  [t * 0.565, 1.665], [t * 0.155, 1.665]],
                 0.060, X(0.065, 0.028), 0.065, C_FAR_IC, { metal: 0.45, rough: 0.32 });
        yuzParca('far_' + et + '_' + (i + 1),
                 [[t * 0.185, 1.335], [t * 0.400, 1.335],
                  [t * 0.400, 1.630], [t * 0.185, 1.630]],
                 0.045, X(0.048, 0.042), 0.048, C_FAR, { metal: 0.1, rough: 0.10 });
        // Kırmızı kuyruk lambası — farın dış ucunda, aynı kasada.
        yuzParca('stop_' + et + '_' + (i + 1),
                 [[t * 0.425, 1.335], [t * 0.535, 1.335],
                  [t * 0.535, 1.630], [t * 0.425, 1.630]],
                 0.025, X(0.048, 0.042), 0.048, C_STOP, { metal: 0.2, rough: 0.26 });
    });

    // TAMPON / KOŞUM KAPAĞI: burnun altındaki koyu kütle. Uç kapağı
    // y 0.927'de bittiği için parça 0.96'dan başlıyor.
    yuzParca('kosum_kapak_' + et,
             [[-0.330, 0.960], [0.330, 0.960], [0.330, 1.290], [-0.330, 1.290]],
             0.070, X(0.070, 0.045), 0.070, C_ALT, { metal: 0.2, rough: 0.70 });

    // ÇATI ÖNÜ: burnun tepesindeki koyu şerit (klima girişi / anten kaidesi).
    // Çatı öğeleri PARLAK OLMAZ — haritanın ana bakışı tepeden.
    yuzParca('burun_ust_' + et,
             [[-0.330, 2.960], [0.330, 2.960], [0.330, 3.140], [-0.330, 3.140]],
             0.055, X(0.045, 0.030), 0.045, C_KLIMA, { metal: 0.15, rough: 0.75 });
});

// ===========================================================================
// 7. KÖRÜK (vagon arası akordeon)
// ===========================================================================
// Vagon uçlarını kapatan koyu akordeon. Treni tren yapan ikinci işaret:
// vagonlar arasında boşluk görünürse üç ayrı araç okunur, körük onları tek
// bir dizi yapıyor.
// ⚠️ Körük gövdeden DAR (yarı genişlik 1.24 / yükseklik 1.32 .. 3.62): gerçek
// körük vagon kesitinden küçüktür ve çevresinde gövdenin kenarı görünür.
// Gövde kadar geniş yapılmıştı ve iki vagon TEK BİR TÜP gibi okunuyordu,
// eklem yeri kayboluyordu.
[-VAGON / 2, VAGON / 2].forEach(function (kx, k) {
    // Ana akordeon kütlesi — boşluktan biraz uzun ki iki vagonun ucuna girsin.
    const sh = yuvarlakSekil([[-1.240, 1.320], [1.240, 1.320],
                              [1.240, 3.620], [-1.240, 3.620]], 0.30);
    const geo = new THREE.ExtrudeGeometry(sh, {
        depth: ARALIK + 0.30, bevelEnabled: false, curveSegments: 4
    });
    geo.rotateY(Math.PI / 2);
    geo.translate(kx - (ARALIK + 0.30) / 2, 0, 0);
    modelGroup.add(mesh(geo, C_KORUK, { metal: 0.1, rough: 0.88,
                                        name: 'koruk_' + (k + 1) }));
    // Akordeon kaburgaları: üç ince halka. Bunlar olmadan körük düz koyu bir
    // kutu; kaburgalar onu "katlanır" gösteren tek işaret.
    [-0.11, 0, 0.11].forEach(function (d, i) {
        const sh2 = yuvarlakSekil([[-1.285, 1.285], [1.285, 1.285],
                                   [1.285, 3.655], [-1.285, 3.655]], 0.30);
        const g2 = new THREE.ExtrudeGeometry(sh2, {
            depth: 0.050, bevelEnabled: false, curveSegments: 4
        });
        g2.rotateY(Math.PI / 2);
        g2.translate(kx + d - 0.025, 0, 0);
        modelGroup.add(mesh(g2, C_KORUK_R, { metal: 0.2, rough: 0.72,
                                             name: 'koruk_kaburga_' + (k * 3 + i + 1) }));
    });
});

// ===========================================================================
// 8. BOJİLER VE TEKERLER
// ===========================================================================
// Grup deseni: teker grubu rotation.x = π/2 ile yatırılıyor (aks ±z'ye
// bakar), rotation.y motora bırakılıyor. Euler XYZ sırasında Ry ÖNCE
// uygulanır: teker kendi mili etrafında döner, sonra Rx onu yatırır.
//
// ⚠️ YİRMİ DÖRT TEKER. Vagon başına 2 boji, boji başına 2 aks, aks başına
// 2 teker. _WHEELS.parts'a yirmi dördü de yazılıyor; biri eksik kalsaydı
// hareket halinde duran tek bir teker hemen göze batardı.
//
// ⚠️ _WHEELS.front YOK ve olmayacak. Motorun front mekanizması parçayı kendi
// dikey ekseninde döndürür; tren raydadır, tekerlek kırmaz. Boji dönüşü
// (gerçekte kavisde ±2°) de yazılmadı: haritada trenin yarıçapı yüzlerce
// metre, boji açısı bir pikselin altında kalıyor — bedeli (her model için
// davranış = her kare yeniden çizim) hak etmiyor.
function tekerlek(ad, x, z) {
    const g = new THREE.Group();
    g.name = ad;
    g.position.set(x, AKS_Y, z);
    g.rotation.x = Math.PI / 2;
    const dis = (z > 0 ? 1 : -1);
    // Tekerin kendisi: DÜZ ÇELİK DİSK. Otobüsteki torus (lastik) deseni
    // burada YANLIŞ olurdu — tren tekerinde lastik yoktur, monoblok çeliktir.
    const t = mesh(new THREE.CylinderGeometry(R_TEKER, R_TEKER, TEKER_GEN, 14),
                   C_TEKER, { metal: 0.45, rough: 0.42, name: ad + '_disk' });
    g.add(t);
    // FLANŞ (mahmuz): tekerin İÇ yüzündeki büyük çaplı ince bilezik. Tren
    // tekerini otomobil tekerinden ayıran tek geometrik işaret bu; onsuz
    // düz bir silindir kalıyordu.
    const f = mesh(new THREE.CylinderGeometry(R_TEKER + 0.045, R_TEKER + 0.045,
                                              0.028, 12),
                   C_TEKER_D, { metal: 0.45, rough: 0.40, name: ad + '_flans' });
    f.position.y = -dis * (TEKER_GEN / 2 + 0.014);
    g.add(f);
    modelGroup.add(g);
}

// Aks konumları: boji merkezi vagon ucundan 3.50 içeride, aks aralığı 2.50.
const AKS_X = [];
VAGONLAR.forEach(function (V) {
    [-1, 1].forEach(function (b) {
        const bx = V.cx + V.yon * (b * BOJI_L);
        AKS_X.push(bx - AKS_ARA / 2, bx + AKS_ARA / 2);
    });
});
AKS_X.sort((a, b) => a - b);
AKS_X.forEach(function (ax, i) {
    tekerlek('teker_' + (i * 2 + 1), ax, IZ_Z);
    tekerlek('teker_' + (i * 2 + 2), ax, -IZ_Z);
});

// ---- BOJİ ÇERÇEVELERİ -----------------------------------------------------
// Gövdenin altında görünür kütleler. Trenin altı boş bırakılırsa gövde
// havada duran bir tüp gibi okunuyor; bojiler hem gölge hem ölçek veriyor.
// Yan kirişler tekerlerin DIŞINDA (z ±0.93; teker z 0.65..0.785): dış
// çerçeveli boji. İç çerçeve denendi ve bırakıldı — tekerler kirişi tamamen
// örtüyor, yalnız üçgen harcıyordu.
function kutuParca(ad, cx, cy, cz, sx, sy, sz, renk, opts) {
    const m = mesh(new THREE.BoxGeometry(sx, sy, sz), renk,
                   Object.assign({ metal: 0.25, rough: 0.60, name: ad }, opts || {}));
    m.position.set(cx, cy, cz);
    modelGroup.add(m);
    return m;
}

VAGONLAR.forEach(function (V, vi) {
    [-1, 1].forEach(function (b, bi) {
        const bx = V.cx + V.yon * (b * BOJI_L);
        const n = vi * 2 + bi + 1;
        [1, -1].forEach(function (s, si) {
            kutuParca('boji_kiris_' + n + '_' + (si + 1),
                      bx, 0.80, s * 0.930, 3.10, 0.42, 0.110, C_BOJI);
        });
        // Enine kiriş + çekiş motoru kütlesi (aksların arasında).
        kutuParca('boji_gobek_' + n, bx, 0.86, 0, 1.10, 0.52, 1.70, C_BOJI_K);
        kutuParca('boji_motor_' + n, bx, 0.62, 0, 0.80, 0.34, 1.00, C_BOJI);
        // Kum kutusu / fren silindiri — bojiyi tek düze bir kutu olmaktan
        // çıkaran küçük çıkıntılar. z ±0.45: tekerin İÇİNDE (teker z
        // 0.650..0.785). ±0.62'de kurulmuştu ve tekerin içine giriyordu.
        [1, -1].forEach(function (s, si) {
            kutuParca('boji_fren_' + n + '_' + (si + 1),
                      bx + s * 0.95, 1.02, s * 0.45, 0.36, 0.22, 0.30, C_BOJI_K);
        });
    });
    // ---- ALT EKİPMAN KUTULARI ---------------------------------------------
    // İki boji arasındaki 16 m'lik boşluk. Gerçek EMU'da orada trafo,
    // çevirici ve batarya kutuları asılıdır; boş bırakılırsa gövdenin altı
    // dümdüz bir gölge oluyor.
    [-4.6, 0.6, 5.0].forEach(function (dl, i) {
        const x = V.cx + V.yon * dl;
        kutuParca('alt_kutu_' + V.ad + '_' + (i + 1),
                  x, 0.83, 0, i === 1 ? 3.60 : 2.60, 0.34, 2.10, C_ALT,
                  { rough: 0.80 });
    });
});

// ===========================================================================
// 9. ÇATI: KLİMA, PANTOGRAF
// ===========================================================================
// ⚠️ ÇATI ÖĞELERİ PARLAK OLMAZ. Haritanın ana bakışı tepeden; parlak bir
// çatı kütlesi bakışın yarısında beyaz bir leke oluyor (otobüste ölçüldü:
// açık gri tavan kapakları çatının en baskın öğesi olmuştu).
VAGONLAR.forEach(function (V) {
    const surucu = V.E.burun;
    const yerler = surucu ? [-7.4, 1.2, 7.6] : [-7.6, 0, 7.6];
    yerler.forEach(function (dl, i) {
        const x = V.cx + V.yon * dl;
        // ⚠️ Kütlenin TABANI çatının içine gömülü, TEPESİ belirgin biçimde
        // üstünde. Kutunun altını çatının üstüne oturtmak denendi ve
        // bırakıldı: çatı kubbeli olduğu için kutu ortada oturup kenarlarda
        // havada kalıyor. Şimdi z=±0.78'de çatı 4.017, kutunun tabanı 3.985.
        // ⚠️ THREE'nin bevelSize'ı konturu DIŞARI iter; şekil bu yüzden
        // istenen dış ölçüden (0.966 x 0.796) pah kadar İÇERİ yazıldı
        // (motokaravanda ölçüldü).
        const sh = yuvarlakSekil([[-0.95, -0.78], [0.95, -0.78],
                                  [0.95, 0.78], [-0.95, 0.78]], 0.14);
        const geo = new THREE.ExtrudeGeometry(sh, {
            depth: 0.130, bevelEnabled: true, bevelThickness: 0.016,
            bevelSize: 0.016, bevelSegments: 1, curveSegments: 2
        });
        // ExtrudeGeometry şekli XY'de kurup +Z'ye itiyor. rotateX(-π/2) ile
        // (x,y,z) → (x,z,-y): şeklin planı model x-z düzlemine, itiş +y'ye.
        geo.rotateX(-Math.PI / 2);
        geo.translate(x, 3.985, 0);
        modelGroup.add(mesh(geo, C_KLIMA, { metal: 0.18, rough: 0.72,
                                            name: 'klima_' + V.ad + '_' + (i + 1) }));
    });
    // Çatı havalandırma kapakları — klimaların arasında, koyu.
    [-3.2, 4.3].forEach(function (dl, i) {
        const x = V.cx + V.yon * dl;
        kutuParca('cati_kapak_' + V.ad + '_' + (i + 1),
                  x, 4.055, 0, 0.62, 0.050, 0.90, '#3a4149',
                  { metal: 0.10, rough: 0.80 });
    });
});

// ---- PANTOGRAF ------------------------------------------------------------
// Ortadaki vagonun üstünde, ÇATIYA YATIK (yarı indirilmiş) tek kollu
// pantograf. Trene "elektrikli" dedirten tek işaret bu.
// ⚠️ İki kollu (pandik) makas denendi ve bırakıldı: dört ince çubuk haritada
// tek bir gri leke oluyor, tepeden bakışta hiç okunmuyordu. Tek kollu
// (Faiveley) desende iki net çubuk var ve siluet uzaktan bile "pantograf".
// Tepe noktası 4.45 — modelin kutu yüksekliğini bu belirliyor.
(function () {
    // İki nokta arasına yatık çubuk. Kutuyu z ekseni etrafında döndürüp
    // orta noktasına oturtuyor; iki ucun matematiksel olarak buluşması
    // görsel sürekliliği vermediği için (motosiklette ölçüldü) çubuklar
    // uçlarda 4-5 cm örtüşüyor.
    function cubuk(ad, p1, p2, kalin, z, derin, renk) {
        const dx = p2[0] - p1[0], dy = p2[1] - p1[1];
        const L = Math.sqrt(dx * dx + dy * dy);
        const m = mesh(new THREE.BoxGeometry(L + 0.06, kalin, derin), renk,
                       { metal: 0.30, rough: 0.55, name: ad });
        m.position.set((p1[0] + p2[0]) / 2, (p1[1] + p2[1]) / 2, z);
        m.rotation.z = Math.atan2(dy, dx);
        modelGroup.add(m);
    }
    // Taban çerçevesi — çatıya gömülü.
    kutuParca('panto_taban', 5.90, 4.010, 0, 2.60, 0.090, 1.84, C_PANTO,
              { rough: 0.70 });
    // İzolatörler: porselen, AÇIK renk. Koyu yapılmıştı ve pantograf tek
    // parça siyah bir yığına dönüyordu; açık izolatör tabanı okutuyor.
    [[4.95, 0.72], [4.95, -0.72], [6.85, 0.72], [6.85, -0.72]].forEach(function (p, i) {
        const c = mesh(new THREE.CylinderGeometry(0.070, 0.078, 0.180, 8),
                       C_IZOLE, { metal: 0.10, rough: 0.55,
                                  name: 'panto_izole_' + (i + 1) });
        c.position.set(p[0], 4.135, p[1]);
        modelGroup.add(c);
    });
    // Alt ve üst kol (iki yanda), sonra çalan (kayar temas çubuğu).
    [0.55, -0.55].forEach(function (z, i) {
        cubuk('panto_alt_' + (i + 1), [4.95, 4.225], [7.05, 4.330],
              0.070, z, 0.060, C_PANTO_K);
        cubuk('panto_ust_' + (i + 1), [7.05, 4.330], [5.75, 4.408],
              0.055, z, 0.050, C_PANTO_K);
    });
    // ÇALAN: enine temas çubuğu. Tepesi 4.45 — kutu yüksekliği burada bitiyor.
    kutuParca('panto_calan', 5.72, 4.428, 0, 0.150, 0.045, 1.72, C_PANTO_K,
              { metal: 0.35, rough: 0.45 });
    [1, -1].forEach(function (s, i) {
        // Boynuz: çalanın uçlarındaki aşağı kıvrık parçalar.
        kutuParca('panto_boynuz_' + (i + 1), 5.72, 4.395, s * 0.885,
                  0.120, 0.110, 0.070, C_PANTO_K, { metal: 0.35, rough: 0.45 });
    });
})();

// ===========================================================================
// 10. RAY (opsiyonel — motorun _RAY tablosu görünürlüğünü yönetir)
// ===========================================================================
// ⚠️ RAY MODEL UZAYINDA KURULU, haritada rota boyunca çizilmiyor. Sebep:
// rayı rota boyunca çizmek yeni bir çizim katmanı (ve yeni bir geometri
// güncelleme yolu) isterdi; model uzayındaki uzun düz bir kesit trenle
// birlikte döndüğü için düz kesimlerde ray gibi okunuyor ve maliyeti sıfır.
// Bedeli: keskin bir kavisde ray trenin altında düz kalır. Bu bilinen ve
// kabul edilmiş sınır.
//
// ⚠️ UZUNLUK 108 m (trenin ~1.5 katı), ±54. Görev tanımındaki "ileri ve
// geriye trenin boyunun 1.5 katı" (288 m) DENENMEDİ, hesapla elendi:
//   * gölge kamerası `inst.box`a oturuyor; 288 m'lik bir kutuda 2048'lik
//     gölge haritasının trene düşen payı dörtte bire iniyor,
//   * travers sayısı 174'ten 465'e çıkıyor (üçgen bütçesinin üçte biri),
//   * ve haritada 288 m'lik rayın 216 m'si BOŞ ray oluyor — göz treni
//     değil rayı görüyor.
// 108 m'de tren rayın ortasında, iki yanda 18'er metre boş ray var: "bu
// tren bir hat üzerinde" bilgisini veren en kısa uzunluk.
//
// ⚠️ RAYIN Z'Sİ BİLEREK GÖVDEYLE AYNI. Balastın tabanı ±1.45 = gövdenin yarı
// genişliği, traversler ±1.30. Böylece ray açık/kapalı modelin kutu z'si
// 2.90'da sabit kalıyor; balast gerçek oranında (±2.30) yapılsaydı kutu z'si
// 4.60'a çıkar ve ray açıkken tren z yönünde de küçülürdü.
const RAY_YARI = 54.0;

(function rayKur() {
    // ---- BALAST: uzun trapez prizma. Tek extrude, 0.07 yüksek.
    const bs = new THREE.Shape();
    bs.moveTo(-1.450, 0.000); bs.lineTo(1.450, 0.000);
    bs.lineTo(1.215, 0.070); bs.lineTo(-1.215, 0.070);
    bs.closePath();
    const bg = new THREE.ExtrudeGeometry(bs, {
        depth: RAY_YARI * 2, bevelEnabled: false, curveSegments: 1
    });
    bg.rotateY(Math.PI / 2);
    bg.translate(-RAY_YARI, 0, 0);
    modelGroup.add(mesh(bg, C_BALAST, { metal: 0.02, rough: 0.98,
                                        flat: true, name: 'balast' }));

    // ---- TRAVERSLER: TEK MESH'te birleştirilmiş 174 kutu.
    // ⚠️ Her travers ayrı mesh OLAMAZ: 174 çizim çağrısı, 174 malzeme ve
    // 174 gölge kaydı demekti. Ayrıca `_RAY` görünürlüğü ad ile
    // yönetiliyor, tek ad = tek mesh.
    // Kutular 24 köşe ile yazılıyor (8 değil): paylaşılan köşede
    // computeVertexNormals köşeleri yuvarlayıp traversi yastığa çevirirdi.
    function kutuEkle(P, IDX, cx, cy, cz, hx, hy, hz) {
        const v = [[-hx, -hy, -hz], [hx, -hy, -hz], [hx, hy, -hz], [-hx, hy, -hz],
                   [-hx, -hy, hz], [hx, -hy, hz], [hx, hy, hz], [-hx, hy, hz]];
        // Sarım dışa bakacak biçimde seçildi (her yüzün normali dışarı).
        const yuz = [[0, 3, 2, 1], [4, 5, 6, 7], [0, 4, 7, 3],
                     [1, 2, 6, 5], [3, 7, 6, 2], [0, 1, 5, 4]];
        for (const f of yuz) {
            const b = P.length / 3;
            for (const i of f) P.push(cx + v[i][0], cy + v[i][1], cz + v[i][2]);
            IDX.push(b, b + 1, b + 2, b, b + 2, b + 3);
        }
    }
    const TP = [], TI = [];
    // Travers aralığı. Gerçekte 0.60; 0.70 seçildi çünkü 108 m'de 0.60
    // aralık 180 kutu = 2160 üçgen demek, 0.70 ile 154 kutu = 1848.
    // Haritada iki değer arasında fark okunmuyor (travers 60 m'lik bir
    // aracın yanında yarım pikselden ince).
    const ADIM = 0.70;
    const n = Math.floor((RAY_YARI * 2 - 0.4) / ADIM);
    for (let i = 0; i <= n; i++) {
        const x = -RAY_YARI + 0.2 + i * ADIM;
        // Genişlik 0.30 (gerçekte 0.26): haritada 0.5 m/piksel ölçekte
        // 0.26 travers yarım pikselin altına düşüp kesikli deseni
        // kaybettiriyordu.
        kutuEkle(TP, TI, x, 0.120, 0, 0.150, 0.050, 1.300);
    }
    const tg = new THREE.BufferGeometry();
    tg.setAttribute('position', new THREE.Float32BufferAttribute(TP, 3));
    tg.setIndex(TI);
    tg.computeVertexNormals();
    modelGroup.add(mesh(tg, C_TRAVERS, { metal: 0.03, rough: 0.94,
                                         flat: true, name: 'travers' }));

    // ---- RAY PROFİLLERİ: I kesiti, x boyunca extrude.
    // ⚠️ Kutu değil GERÇEK I PROFİLİ. Üç kutu (taban/gövde/baş) denendi ve
    // bırakıldı: üç ayrı mesh, üç ayrı ad, ve yakın planda kutuların
    // birleşme yerinde z-kavgası çıkıyordu. Tek kapalı kontur hepsini
    // çözüyor ve 52 üçgen tutuyor.
    // Profil model z'sinde simetrik olduğu için `yuzParca`daki negatifleme
    // gerekmiyor; şekil doğrudan yazılıyor.
    const rp = [[-0.075, 0.170], [0.075, 0.170], [0.075, 0.196],
                [0.016, 0.216], [0.016, 0.256], [0.036, 0.272],
                [0.036, 0.300], [-0.036, 0.300], [-0.036, 0.272],
                [-0.016, 0.256], [-0.016, 0.216], [-0.075, 0.196]];
    [1, -1].forEach(function (s, i) {
        const sh = new THREE.Shape();
        rp.forEach(function (p, k) {
            if (k === 0) sh.moveTo(p[0], p[1]); else sh.lineTo(p[0], p[1]);
        });
        sh.closePath();
        const g = new THREE.ExtrudeGeometry(sh, {
            depth: RAY_YARI * 2, bevelEnabled: false, curveSegments: 1
        });
        g.rotateY(Math.PI / 2);
        g.translate(-RAY_YARI, 0, s * IZ_Z);
        modelGroup.add(mesh(g, C_RAY_CEL, { metal: 0.42, rough: 0.44,
                                            name: 'ray_' + (i + 1) }));
    });
})();

// ==== TREN-MAFSAL-MODEL BASLANGIC ====
// ===========================================================================
// 13. MAFSAL VE RAY KÖKÜ — parçaları vagon gruplarına, rayı kendi köküne topla
// ===========================================================================
// Model buraya kadar DÜZ kuruldu: 300'den fazla parça doğrudan `modelGroup`un
// çocuğu ve her biri kendi GLOBAL model x'inde yazılı. Bu, tren bir bütün
// olarak hareket ettiği sürece doğruydu; ama Furkan trenin yolun kendi
// eğrisini takip etmesini, "her vagonun doğruca bükülerek ilerlemesini"
// istiyor. Rijit tek matris altında bu imkânsız: virajda üç vagon da aynı
// açıyı alır ve tren 72 metrelik düz bir çubuk gibi kavisin içinden geçer.
//
// Bu blok üç şey yapıyor:
//   1. RAY parçalarını (`balast`, `travers`, `ray_1`, `ray_2`) `ray_kok`
//      grubuna alıyor. Motor (studio-3d.js tren davranışı) o grubun yaw'ını
//      GERİ ALIP rayı rotanın kendi çerçevesine oturtuyor: ray artık trenle
//      birlikte dönmüyor, geçişin başlangıcından bitişine kadar YERİNDE
//      duruyor.
//   2. Kalan her parçayı en yakın vagon merkezine göre `vagon_1/2/3`
//      gruplarına dağıtıyor. Davranış her vagona kendi yay-uzunluğu
//      konumunu ve kendi açısını yazıyor.
//   3. Gruplar PİVOT-OFSET İKİLİSİ ile kuruluyor (bkz. DEVIR §5.2): dış grup
//      vagon merkezine oturuyor, iç grup aynı ötelemeyi geri alıyor. Böylece
//      parçaların yazılı koordinatları DEĞİŞMİYOR — hareketsiz hâlde model
//      bit bit eskisinin aynısı (ölçüldü: kutu ve ölçek aynı).
//
// ⚠️ DAĞITIM AD İLE DEĞİL GEOMETRİ İLE. Parça adları vagon numarası taşımıyor
// (`kapi_1`, `boji_gobek_5` gibi seri numaraları var, vagon numarası değil).
// Ada göre eşleme 40'tan fazla çağrı yerini elle etiketlemek demekti ve bir
// tanesini atlamak parçayı yanlış vagona takardı. Kutu merkezinin x'i hangi
// vagon merkezine yakınsa o vagona gidiyor: makine kendi kendini denetliyor.
//
// ⚠️ KÖRÜK vagonlar ARASINDA (x = ±12), iki merkeze de tam eşit uzaklıkta.
// `<=` karşılaştırması ilk (küçük indisli) vagonu seçiyor, yani ön körük
// vagon 1'e, arka körük vagon 2'ye gidiyor. Mafsal açısı körüğün öbür
// ucunda küçük bir açıklık bırakıyor; harita ölçeğinde körük bir pikselin
// altında olduğu için ölçülebilir bir görsel karşılığı yok. Körüğü ikiye
// bölüp yarısını her vagona vermek denenmedi: geometri tek extrude ve
// bölmek onu iki ayrı ada zorlardı.
//
// ⚠️ `_WHEELS.front` YOK (tren raydadır), o yüzden motorun "dört teker
// modelGroup'un DOĞRUDAN çocuğu olmalı" kuralı burada geçerli değil:
// direksiyon grubu hiç kurulmuyor. Teker grupları vagonların içine
// girebiliyor, yuvarlanma (`rotation.y`) yine çalışıyor.
(function mafsalKur() {
    const RAY_PARCA = ['balast', 'travers', 'ray_1', 'ray_2'];
    const rayKok = new THREE.Group();
    rayKok.name = 'ray_kok';

    const vagonlar = VAGON_X.map(function (cx, i) {
        const dis = new THREE.Group();
        dis.name = 'vagon_' + (i + 1);
        dis.position.set(cx, 0, 0);
        dis.userData.cx = cx;              // davranış okuyor: yay-uzunluğu ofseti
        const ic = new THREE.Group();
        ic.position.set(-cx, 0, 0);        // ötelemeyi geri al
        dis.add(ic);
        dis.userData.ic = ic;
        return dis;
    });

    // Kutu ölçümü dünya matrisini ister; parçalar henüz hiç güncellenmedi.
    modelGroup.updateMatrixWorld(true);
    const kutu = new THREE.Box3(), merkez = new THREE.Vector3();
    modelGroup.children.slice().forEach(function (o) {
        if (RAY_PARCA.indexOf(o.name) !== -1) { rayKok.add(o); return; }
        kutu.setFromObject(o);
        if (kutu.isEmpty()) return;
        kutu.getCenter(merkez);
        let en = 0, enYakin = Infinity;
        for (let i = 0; i < VAGON_X.length; i++) {
            const d = Math.abs(merkez.x - VAGON_X[i]);
            if (d < enYakin) { enYakin = d; en = i; }
        }
        vagonlar[en].userData.ic.add(o);   // add() eski ebeveynden söker
    });

    vagonlar.forEach(function (g) { modelGroup.add(g); });
    modelGroup.add(rayKok);
})();
// ==== TREN-MAFSAL-MODEL BITIS ====
