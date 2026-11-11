// Askeri kamyon — 6x6 branda kasalı ikmal kamyonu. Modern Warfare grubunun
// dördüncü modeli.
//
// REFERANS: URAL-4320 (Miass, 1977-). Sovyet/Rus ordusunun standart 6x6
// ikmal kamyonu; kaputlu (aligator kaput), köşeli üç kişilik kabin, arkada
// dört metrelik metal kasa ve onun üstünde dua/kavis üzerine gerilmiş
// branda. Sınıfın öbür iki adayı (MAN KAT1, M939) bilerek ELENDİ:
// MAN KAT1 kabin-üstü motorlu (kaput YOK), M939 ise 8.43 m — sette zaten
// uzun olan tanka ve roketatara daha çok benziyordu. Ural'ın kaputu +
// yüksek yerden geçişi bu setteki hiçbir şeye benzemiyor.
//
// GERÇEK ÖLÇÜLER (kaynak: ru.wikipedia + gruzovo.com + truck-and-bus.ru,
// üçü de aynı sayıları veriyor — hiçbiri ezberden yazılmadı):
//   uzunluk 7366 mm · genişlik 2500 mm
//   yükseklik 2715 mm (kabin) · 3005 mm (BRANDA ile)
//   dingil arası 3525 + 1400 mm (ön → orta → arka)
//   doruk açıklığı (klirens) 400 mm · iz ön/arka 2000 mm
//   lastik 14.00-20 (370-508) OI-25 → DIŞ ÇAP 1260 mm, kesit 390 mm
//   kasa (platform) 3890 x 2330 mm · boş ağırlık 8050 kg
// Türetilenler: ön çıkma 1693 · arka çıkma 748 (toplam 2441 = 7366 - 4925).
// Arka çıkmanın KISALIĞI arazi aracının imzasıdır: kasanın arka kenarı
// arka lastiğin 35 mm gerisinde bitiyor, yani ayrılma açısı neredeyse dik.
//
// ⚠️ TEKER YARIÇAPI 0.630. `_WHEELS.radius` DA 0.630 olmak zorunda — motor
// kat edilen yolu yarıçapa bölerek yuvarlanmayı hesaplıyor, model kodundaki
// R_TEKER ile tutmazsa teker yolla uyumsuz döner. (Otobüste 0.521 → 0.478
// düzeltmesi tam bu yüzden yapılmıştı.) 14.00-20'nin metrik karşılığı
// 370-508: 370 mm kesit, 508 mm jant çapı; üreticinin verdiği dış çap
// 1260 mm → yarıçap 0.630, yanak (1260-508)/2 = 376 mm. Jant yarıçapı
// 0.254. Yanağın jantla oranı %60 — kamyon lastiğinin gerçek oranı.
//
// ---------------------------------------------------------------------------
// ÜÇ KÜTLE, İKİ AYRI LOFT
// ---------------------------------------------------------------------------
// Gövde makinesi `otomobil.js` / `otobus.js` ile AYNI: x ekseni boyunca
// istasyonlarda ayrı ayrı hesaplanan KAPALI KESİTLER birbirine dikiliyor
// (loft), her kesit parametresi kendi monoton kübik (PCHIP) eğrisinden
// okunuyor. AMA burada makine İKİ KEZ kuruluyor, çünkü kamyon otomobil gibi
// tek gövdeli değil: kabin ile kasa arasında 47 cm boşluk var ve o boşlukta
// yedek lastik duruyor. Tek loft o boşluğu DOLDURURDU.
//
//   1. KABİN + KAPUT + ÇAMURLUKLAR → `G_KABIN` loft'u, tek kabuk ('govde').
//      Neden extrude DEĞİL: kaput 1.24 m, kabin 2.35 m, çamurluklar 2.50 m
//      genişliğinde. Yan profili z boyunca iten bir extrude üçünü de AYNI
//      genişlikte yapardı — kaputu kabin kadar geniş bir kutuya çevirirdi.
//      Loft'ta kaputun darlığı `D_BEL` eğrisinden (kabinde 0.015, kaputta
//      0.630) geliyor ve aradaki geçiş kokpit duvarının GERÇEK açılışı
//      oluyor. Motokaravanın kabini extrude ile kurulmuştu; orada kabin
//      zaten yaşam kutusuyla aynı genişlikteydi, burada değil.
//   2. BRANDA → `G_BRANDA` loft'u ('branda'). Kesiti neredeyse sabit ama
//      İKİ ŞEY loft istiyor: (a) uçlarda bezin aşağı sarkarak yuvarlanması,
//      (b) DUALAR ARASINDA SARKMA. `Y_UST` ve `W_CATI` eğrilerine altı dua
//      ile beş boşluk sırayla yazıldı (dua 3.005 / boşluk 2.978, 27 mm);
//      PCHIP yerel uçlarda tegeti sıfırladığı için taşma olmadan yumuşak
//      bir dalga çıkıyor. Sabit kesitli extrude ikisini de veremezdi.
//   3. KASA (metal platform) → düz PRİZMA (extrude). Burada extrude DOĞRU
//      araç: kasa gerçekten sabit kesitli bir kutu, kesitinde kavis yok.
//      Devir §3'ün kuralı "extrude yalnız gerçekten yassı/prizmatik
//      parçalar için" — kasa tam olarak o.
//
// ⚠️ BEVEL KULLANILMADI. Motokaravanda ölçülmüştü: `bevelSize` konturu
// DIŞARI itiyor (şekil 3.50'de yazılıyken kutu 3.530 ölçtü) ve yüze konan
// parçalar gövdenin içinde kalıyor. Kasa ve tampon `bevelEnabled: false`
// ile kuruldu; köşe yuvarlaması gerektiği yerde `yuvarlakSekil` KONTURUN
// KENDİSİNE işleniyor, yani ölçü ne yazıldıysa o kalıyor.
//
// SİLUET — sette neyden ayrılıyor:
//   * zırhlı SUV'dan: 7.37 m boy (SUV ~5.5 m) ve arkadaki branda kasa.
//   * paletli çoklu roketatardan: ALTI LASTİK (palet yok) ve namlu yerine
//     branda. Tepeden bakışta ikisini ayıran şey tam olarak branda kavisi.
//   * tanktan: taret yok, gövde uzun ve dar.
//   * kütüphanedeki `otobus`ten: kabin kasadan AYRI bir kütle, arada boşluk.
//
// PARÇALAR (Studio3D bu adları arar, DEĞİŞTİRME):
//   teker_on_1/2      → ön aks (direksiyon kırar)
//   teker_arka_1/2    → ORTA aks · teker_arka_3/4 → ARKA aks
//                       Altısı da yuvarlanır; yalnız ön ikisi kırar.
//                       ⚠️ Orta aks "arka" diye adlandırıldı ki otobüsün
//                       altı tekerli probu (`otobus_probu.py`) değişmeden
//                       koşabilsin — o betik ad listesini sabit tutuyor.
//   govde, kasa, ...  → BİRİNCİL RENK (_TINT.parts)
//   branda, branda_*  → İKİNCİL RENK (_TINT.parts2, etiket 'Canopy')
//
// ⚠️ YAZI / İŞARET YOK. Harita modeli soldan sağa AYNALIYOR (OKU.md; taksinin
// tepe lambasında "IXAT" çıkmıştı). Kapıya birlik numarası ya da yıldız
// koymak aynalanarak kurulmayı gerektirirdi; bu ölçekte bedeli hak etmiyor.
//
// ⚠️ YAN ÖĞELER İKİ TARAFTA DA VAR (basamak, depo, kapı, ayna). Gerçek
// kamyonda yakıt deposu tek taraftadır. Otobüs ve motokaravanda verilen
// kararın aynısı: harita modeli aynalıyor ve model serbestçe dönüyor, tek
// taraflı kurgu bakışların yarısında bomboş bir yan yüz bırakıyor.
//
// YÖN: burun +x, üst +y, taban y=0. Ölçüler gerçek metre.

// ===========================================================================
// 0. RENKLER
// ===========================================================================
// ⚠️ AÇIK RENKTE PATLAMA TUZAĞI (motokaravanda %80 tam beyaz ölçülmüştü)
// burada AÇILMIYOR: gövde zeytin yeşili (77,84,64), branda haki (138,129,99).
// İkisi de orta ton. Yine de `parlaklik.py` ile ölçülüyor.
// ⚠️ metalness DÜŞÜK ama sıfır değil: 0'a indirmek difüzü (albedo x
// (1-metal)) tam açar ve tepe panelinde kırpma başlar (uçakta 0.22 → 0.10
// yapılınca tam beyaz %0.9 → %16.2 ölçülmüştü). Askeri boya zaten MAT:
// metal 0.14, rough 0.68.
const C_GOVDE   = '#4d5440';   // _TINT varsayılanı — zeytin yeşili boya
const C_BRANDA  = '#8a8163';   // _TINT ikincil varsayılanı — haki branda bezi
const C_BEZ_K   = '#6d6650';   // branda dikişleri / dua kayışları (koyu bez)
const C_CAM     = '#161d26';
const C_DIREK   = '#0f1216';   // cam çerçevesi / derz karartması
const C_LASTIK  = '#1b1b1e';
const C_JANT    = '#6a6f5e';   // askeri araçta jant da gövde tonunda, krom yok
const C_JANT_K  = '#42473a';
const C_DIP     = '#0d0f12';   // davlumbaz, gölgeli oyuklar
const C_SASI    = '#31352c';   // şasi, tampon, çeki demiri — boyasız koyu
const C_FAR     = '#c4cdd6';
const C_FAR_IC  = '#343a41';
const C_STOP    = '#8f2b23';
const C_SINYAL  = '#b47a26';
// ⚠️ KROM YOK. Askeri araçta parlak parça olmaz (ışık verir) ve zaten
// metalness 0.85+ bu sahnede kapkara çıkıyor (envmap yok). En parlak şey
// far camı; o da metal 0.10.
// ⚠️ ÖNCE '#7c8172' idi. Yakın plan çizimde (bakis.py yakin, 'kemer'
// paneli) yan basamak sahnedeki en parlak yüzey oluyor ve göz kamyondan
// önce basamağı görüyordu; askeri araçta parlak parça olmaz. Bir buçuk
// ton koyultuldu; ızgara çıtası ve çeki kancası da aynı rengi kullanıyor.
const C_METAL   = '#666c5f';   // basamak sacı, ızgara çıtası — donuk metal

// ===========================================================================
// 1. TEMEL ÖLÇÜLER
// ===========================================================================
const R_TEKER   = 0.630;    // 14.00-20 → dış çap 1260 mm. _WHEELS.radius ile
                            // BİREBİR aynı olmak zorunda.
const R_JANT    = 0.254;    // 20" jant → çap 508 mm
const LASTIK_GEN = 0.390;   // kesit genişliği 370 mm + omuz payı
const AKS_Y     = R_TEKER;

const UZUN      = 3.683;    // yarı uzunluk → 7.366 m (tampon → çeki demiri)
// ⚠️ AKS YERLEŞİMİ ÇİZİMLE DÜZELTİLDİ. İlk kurulumda ön çıkma 1.693 / arka
// çıkma 0.748 alınmıştı (toplam 2.441 = 7.366 - 4.925, yani uzunluk
// tutuyordu) ama ön aks x=1.990'a, yani KABİNİN ALTINA düşüyordu: kapının
// dibinde kocaman bir kemer ağzı açılıyor, çamurluk diye ayrı bir kütle
// kalmıyordu. Ural'da (ve bütün kaputlu kamyonlarda) ön aks KAPUTUN
// ALTINDA, ön cam dibinin hizasındadır. Ön aks kokpit çizgisine (2.330)
// oturtuldu; toplam yine 2.441 (1.353 + 1.088), yani kaynaktaki 7.366 ile
// dingil arası 3525+1400 aynı anda sağlanıyor.
const ON_X      =  2.330;   // ön aks   (ön çıkma 1.353)
const ORTA_X    = -1.195;   // orta aks (dingil arası 3.525)
const ARKA_X    = -2.595;   // arka aks (orta→arka 1.400; arka çıkma 1.088)
const IZ_Z      = 1.000;    // iz 2000 mm — tekil lastik, ikiz YOK
                            // (arazi 6x6'sında ikiz teker kullanılmaz:
                            //  çamurda iki lastik arası tıkanır)

const YARI_EN   = 1.250;    // gövdenin yarı genişliği → 2.500 m
const SASI_UST  = 1.100;    // şasi kirişinin üstü
const SASI_ALT  = 0.920;
const SASI_Z    = 0.420;    // şasi kirişlerinin merkez z'si (kiriş arası 840)

// Kasa (platform): 3890 x 2330 mm, sabit bordu 520 mm.
const KASA_ON   =  0.290;
const KASA_ARKA = -3.600;   // boy 3.890 ✓
const KASA_TABAN = 1.430;   // yükleme yüksekliği
const KASA_UST  = 1.950;    // sabit bordun üstü (520 mm)
const KASA_Z    = 1.226;    // metal bordun yarı genişliği. Branda (1.240)
                            // 14 mm taşıyor: gerçek brandanın eteği de
                            // bordun üstüne biner.

// Kabin loft'unun x sınırları. Kabin arkası 0.760 → kasa önüne (0.290)
// 470 mm boşluk kalıyor: YEDEK LASTİK oraya dik duruyor (kesit 390 mm).
const KAB_ARKA  = 0.760;
const KAB_ON    = 3.560;    // ızgara yüzü; tampon önünde ayrı parça
const KAB_UST   = 2.715;    // kabin tavanı — kaynaktaki "yükseklik 2715"
const KOKPIT    = 2.330;    // ön camın dibi (kaput ile kabinin sınırı)

const KEMER_R   = 0.720;    // ön çamurluk ağzı — lastikten 90 mm açık
const KEMER_ETEK = 0.100;   // ağzın uçlarının eşiğe inişi

// Branda loft'u. Kasanın metal bordunun üstüne oturuyor, 10 mm taşarak.
const BRA_ON    =  0.280;
const BRA_ARKA  = -3.590;
const BRA_TEPE  =  3.005;   // kaynaktaki "yükseklik с тентом 3005"
const BRA_DIP   =  1.900;   // bezin alt kenarı (bord üstünün 50 mm altı)

// Branda dualarının x'leri — kasa boyunca EŞİT aralıklı altı dua.
// Aralık (0.240 - (-3.550)) / 5 = 0.758 m.
const DUALAR = [0.240, -0.518, -1.276, -2.034, -2.792, -3.550];
// Duaların ORTALARI: bezin sarktığı yerler.
const SARKMA = [-0.139, -0.897, -1.655, -2.413, -3.171];

const NV_KAB    = 18;       // kabin loft'unda yarı kesit örnek sayısı
const NV_BRA    = 17;       // branda loft'unda

// ===========================================================================
// 2. MONOTON KÜBİK EĞRİ (PCHIP)
// ===========================================================================
// Catmull-Rom otomobilde denenmiş ve BIRAKILMIŞTI: eğimin hızla değiştiği
// yerlerde taşma yapıyor. Burada taşma iki yerde ölümcül olurdu:
//   (a) kokpit duvarı — tavan çizgisi 0.20 m'de 0.80 m düşüyor, taşma
//       kaputun üstüne tümsek atardı;
//   (b) BRANDA SARKMASI — dua/boşluk sırası bir salınım dizisi, Catmull-Rom
//       her yerel uçta taşıp dalgayı büyütürdü. Fritsch-Carlson tegetleri
//       yerel uç noktalarda sıfırlanır, yani 27 mm'lik sarkma tam 27 mm
//       kalıyor.
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

// ===========================================================================
// 3. LOFT MAKİNESİ — otomobil/otobüsteki kod, İKİ GÖVDE için genelleştirildi
// ===========================================================================
// Otomobil ve otobüs tek gövdeli oldukları için makineyi dosya kapsamında
// serbest fonksiyonlar olarak yazmışlardı (`kesitPar`, `nokta3`, ...).
// Kamyonda iki gövde var; makine bir FABRİKAYA çevrildi ve her gövde kendi
// eğri takımıyla kendi kopyasını alıyor. Matematik BİREBİR aynı, tek fark
// eğrilerin ve uç yuvarlatmasının nesneden okunması.
//
// Kesit beş bölümden:
//   A [0 .. VA]   taban (kemer ağzı ya da gövdenin alt levhası)
//   B [VA .. VB]  alt yanak: tabandan en geniş noktaya (süper-elips)
//   C [VB .. VC]  en geniş → kuşak: neredeyse dikey yan yüz
//   D [VC .. VD]  kuşak → çatı kenarı (tumblehome, Bezier, hafif bombeli)
//   E [VD .. 1]   çatı/branda kubbesi, orta hatta kapanır
//
// ⚠️ UÇ YUVARLATMASI İKİ UÇTA AYRI. Otomobilde gövde x=0'da simetrikti ve
// `Math.abs(x) - (UZUN - PAH)` tek satırda iki ucu birden yönetiyordu.
// Kamyonun iki gövdesi de x=0'da simetrik DEĞİL (kabin 0.76..3.56, branda
// -3.59..0.28) ve uçları da farklı: kabinin arkası DÜZ bir duvar, burnu
// yuvarlak; brandanın iki ucu da yuvarlak ama bez arkada daha çok sarkıyor.
// Bu yüzden `PAH_ON/PAH_ARKA` ve `UC_ON/UC_ARKA` ayrı ayrı veriliyor.
function loftYap(K) {
    const VA = K.VA, VB = K.VB, VC = K.VC, VD = K.VD;

    // Uç yuvarlatma çarpanı: gövdenin son PAH kadarlık bölümünde kesit kendi
    // merkezine doğru daire yayıyla küçülüyor → köşeler hem planda hem
    // düşeyde yuvarlanıyor. Düz bir kapak keskin köşe bırakırdı.
    function ucCarpani(x) {
        let f = 1;
        if (K.PAH_ON > 0) {
            const u = (x - (K.X_ON - K.PAH_ON)) / K.PAH_ON;
            if (u > 0) {
                f = Math.min(f, K.UC_ON + (1 - K.UC_ON) *
                    Math.sqrt(Math.max(0, 1 - u * u)));
            }
        }
        if (K.PAH_ARKA > 0) {
            const u = ((K.X_ARKA + K.PAH_ARKA) - x) / K.PAH_ARKA;
            if (u > 0) {
                f = Math.min(f, K.UC_ARKA + (1 - K.UC_ARKA) *
                    Math.sqrt(Math.max(0, 1 - u * u)));
            }
        }
        return f;
    }

    // Çamurluk kemerinin üst kenarı: lastikle EŞ MERKEZLİ daire (açıklık her
    // yerde aynı) ve uçlarında çeyrek elipsle eşiğe iniyor. Yarım daire tek
    // başına bırakılsaydı ağzın uçlarında dikey duvar kalırdı.
    // ⚠️ Yalnız ÖN aksta kemer var. Orta ve arka aksın üstünde kasa duruyor
    // ve kasanın tabanı (1.430) lastiğin tepesinden (1.260) 170 mm yukarıda:
    // arka lastikler tamamen AÇIKTA. Yüksek yerden geçişin görünen sebebi bu.
    function kemerUst(x) {
        const e = K.ESIK(x);
        if (!K.KEMER) return e;
        let y = e;
        for (let k = 0; k < K.KEMER.length; k++) {
            const dx = Math.abs(x - K.KEMER[k]);
            if (dx < K.KEMER_R) {
                y = Math.max(y, AKS_Y + Math.sqrt(K.KEMER_R * K.KEMER_R - dx * dx));
            } else if (dx < K.KEMER_R + K.KEMER_ETEK) {
                const u = (dx - K.KEMER_R) / K.KEMER_ETEK;
                y = Math.max(y, e + (AKS_Y - e) * Math.sqrt(Math.max(0, 1 - u * u)));
            }
        }
        return y;
    }

    // Bir istasyonun dokuz parametresi.
    function kesitPar(x) {
        const e = K.ESIK(x);
        let yA = kemerUst(x);
        let yO = K.Y_OMUZ(x);
        let yU = K.Y_UST(x);
        yA = Math.min(yA, yO - 0.030);                 // taban omuzun ALTINDA
        let yB = Math.min(K.Y_BEL(x), yO + (yU - yO) * 0.94);
        let yC = Math.max(yB + 0.020, yU - K.KUBBE(x));
        const wO = K.W_OMUZ(x);
        const wB = Math.max(0.03, wO - K.D_BEL(x));
        let wC = Math.min(K.W_CATI(x), wB - 0.006);
        // Kemer ağzı açıldıkça kesitin tabanı eşikten dışa, ağzın dudağına
        // kadar genişliyor: tek bir "pay" değeri iki şeyi birden yönetiyor.
        const pay = Math.min(1, Math.max(0, (yA - e) / K.PAY_BOL));
        const wRock = K.W_ESIK(x);
        let wA = wRock + (wO - 0.012 - wRock) * pay;
        wA = Math.min(wA, wO - 0.010);

        const f = ucCarpani(x);
        if (f < 1) {
            const yc = (yA + yU) / 2;
            yA = yc + (yA - yc) * f; yO = yc + (yO - yc) * f;
            yB = yc + (yB - yc) * f; yC = yc + (yC - yc) * f;
            yU = yc + (yU - yc) * f;
            return { yA: yA, wA: wA * f, yO: yO, wO: wO * f, yB: yB, wB: wB * f,
                     yC: yC, wC: wC * f, yU: yU };
        }
        return { yA: yA, wA: wA, yO: yO, wO: wO, yB: yB, wB: wB,
                 yC: yC, wC: wC, yU: yU };
    }

    // Yarı kesitin v parametresindeki noktası → [z, y].
    // v: 0 = taban ortası, 1 = tepe ortası.
    function kesitNokta(P, v) {
        if (v <= VA) return [P.wA * (v / VA), P.yA];
        if (v <= VB) {
            // Süper-elips çeyreği: (wA,yA) köşesinden çıkıp (wO,yO)'da DİKEY
            // tegetle bitiyor. Üs küçüldükçe yanak hemen dışa açılıp
            // dikleşiyor — kamyon sacının keskin kıvrımı bu.
            const t = (v - VA) / (VB - VA), th = t * Math.PI / 2;
            return [P.wA + (P.wO - P.wA) * Math.pow(Math.sin(th), K.US_YANAK),
                    P.yO - (P.yO - P.yA) * Math.pow(Math.cos(th), K.US_YANAK)];
        }
        if (v <= VC) {
            // Dik yan yüz. Kaput bölgesinde ise BURASI çamurluğun üst
            // yüzeyidir: genişlik 1.250'den 0.620'ye düşerken yükseklik
            // yalnız 0.23 artıyor, yani yüzey neredeyse yatay bir kanat.
            const t = (v - VB) / (VC - VB);
            const e = t * t * (3 - 2 * t);
            return [P.wO + (P.wB - P.wO) * e, P.yO + (P.yB - P.yO) * t];
        }
        if (v <= VD) {
            // Tumblehome: kuşak ile çatı kenarı arasında ikinci derece
            // Bezier. Denetim noktası dışa itiliyor → yüzey hafif bombeli.
            const t = (v - VC) / (VD - VC), u = 1 - t;
            const cz = (P.wB + P.wC) / 2 + K.BOMBE, cy = (P.yB + P.yC) / 2;
            return [u * u * P.wB + 2 * u * t * cz + t * t * P.wC,
                    u * u * P.yB + 2 * u * t * cy + t * t * P.yC];
        }
        const t = (v - VD) / (1 - VD), th = t * Math.PI / 2;
        return [P.wC * Math.pow(Math.cos(th), K.US_CATI),
                P.yC + (P.yU - P.yC) * Math.pow(Math.sin(th), K.US_CATI)];
    }

    // Yüzey noktası. w ∈ [-1,1]: 0 = tepe orta hattı, ±1 = taban. (v = 1-|w|.)
    function nokta3(x, w) {
        const p = kesitNokta(kesitPar(x), 1 - Math.abs(w));
        return [x, p[1], (w < 0 ? -p[0] : p[0])];
    }

    // Sayısal yüzey normali (dışa bakar). Panelleri bu yönde ötelüyoruz.
    function normal3(x, w) {
        const h = 0.0035;
        const hx = (x > K.X_ON - 0.004) ? -h : h;
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

    // Verilen yükseklikteki w (y, v ile monoton arttığı için ikili arama).
    function vYukseklik(x, y) {
        const P = kesitPar(x);
        let a = 0, b = 1;
        for (let i = 0; i < 24; i++) {
            const m = (a + b) / 2;
            if (kesitNokta(P, m)[1] < y) a = m; else b = m;
        }
        return (a + b) / 2;
    }

    const NV = K.NV, R_HALKA = 2 * NV - 2;
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

    function kur(ad, renk, opts) {
        const IST = K.IST, P = [], IDX = [];
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
        // computeVertexNormals kapağın normalini yan yüzeyinkiyle
        // ortalamasın — ortalasaydı kabinin dik ön yüzü ile yanağı
        // arasındaki köşe yumuşayıp burun balon gibi görünürdü.
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
                // yüzden ters. Sarım buna göre ayrılıyor.
                if (onYuz) IDX.push(merkez, b, a); else IDX.push(merkez, a, b);
            }
        }
        kapak(IST[IST.length - 1], true);
        kapak(IST[0], false);

        const geo = new THREE.BufferGeometry();
        geo.setAttribute('position', new THREE.Float32BufferAttribute(P, 3));
        geo.setIndex(IDX);
        geo.computeVertexNormals();
        modelGroup.add(mesh(geo, renk, Object.assign({ name: ad }, opts)));
    }

    return { kesitPar: kesitPar, kesitNokta: kesitNokta, nokta3: nokta3,
             normal3: normal3, vYukseklik: vYukseklik, kur: kur };
}

// ---------------------------------------------------------------------------
// YÜZEYE OTURAN PANEL — gövde yüzeyi yeniden örneklenip normal boyunca
// `disari` kadar ötelenir. Böylece panel gövdenin kavisine BİREBİR oturuyor;
// düz bir levha olsaydı kavisli yüzeyden yer yer batar yer yer havada kalırdı.
// Bant biçimi: [x1, x2, a1, a2]         → a, kesit parametresi w
//              [x1, x2, y1, y2, taraf]  → a YÜKSEKLİK; her x'te o yüksekliğin
//                                         w'si aranıyor.
// ⚠️ KAVİSİN İÇİNDEN GEÇEN BANT `w` BİÇİMİNDE YAZILIR. Otobüste ölçülmüştü:
// ön cam köşe bandı yükseklik biçiminde yazılınca üst kenarı bir x'te dik
// yanağa, başka x'te çatı kavisinin içine düşüyor ve panel YIRTILIYORDU.
// Branda kayışları bu yüzden w biçiminde (kubbenin içinden geçiyorlar).
// ⚠️ `nx` bandın x yönündeki, `nw` w yönündeki bölüntüsü. UZUN kenara ÇOK
// verilir; ters verilirse şerit kavisi takip edemeyip yüzeyin içine girer.
function yuzeyYama(G, ad, bantlar, nx, nw, disari, renk, opts) {
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
                const w = taraf ? taraf * (1 - G.vYukseklik(x, a)) : a;
                const p = G.nokta3(x, w), n = G.normal3(x, w);
                P.push(p[0] + n[0] * disari, p[1] + n[1] * disari,
                       p[2] + n[2] * disari);
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
        metal: opts.metal == null ? 0.16 : opts.metal,
        rough: opts.rough == null ? 0.60 : opts.rough, name: ad
    });
    m.material.side = THREE.DoubleSide;
    // Kalınlıksız paneller GÖLGE DÜŞÜRMEZ: gövdeye 5-20 mm mesafede
    // duruyorlar, gölge haritasında kendi gölgelerini gövdenin üstüne basıp
    // benek (acne) üretiyorlardı.
    m.castShadow = false;
    // ⚠️ Aynı yüzeye oturan panellerde DERİNLİK KAVGASI. Trende ölçülmüştü:
    // cam bandı gövdeye siyah benek serpiyordu, `castShadow=false` hiç
    // değiştirmemişti (z-tamponu, gölge değil). Çözüm polygonOffset.
    if (opts.katman) {
        m.material.polygonOffset = true;
        m.material.polygonOffsetFactor = -opts.katman;
        m.material.polygonOffsetUnits = -opts.katman;
    }
    modelGroup.add(m);
    return m;
}

// ---------------------------------------------------------------------------
// ÖN/ARKA YÜZ PARÇASI. ExtrudeGeometry şekli XY düzleminde kurup +Z'ye itiyor;
// yüz parçaları için şekil (z,y) düzleminde yazılıp +X'e itilmeli.
// rotateY(π/2) (x,y,z)'yi (z,y,-x)'e taşıyor, yani şeklin x'i model -z'ye
// düşüyor — bu yüzden noktalar önce negatifleniyor ve sırası ters çevriliyor.
// ⚠️ Geometri `x`ten `x+derinlik`e uzanır. Her parçanın `x+derinlik`i kapağı
// 5-30 mm GEÇMELİ, yoksa parça havada kalır ve kutu ölçüsü şişer.
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
        metal: opts.metal == null ? 0.16 : opts.metal,
        rough: opts.rough == null ? 0.60 : opts.rough, name: ad
    });
    modelGroup.add(m);
    return m;
}

// ---------------------------------------------------------------------------
// ÇOK KUTULU TEK MESH. Dikmeler, şasi kirişleri, derzler gibi ONLARCA küçük
// kutu var; her biri ayrı mesh olsaydı çizim çağrısı sayısı üçe katlanırdı
// (otomobil 86 mesh, otobüs 84 — bu modelde tek başına 30 dikme çıkardı).
// Kutular tek BufferGeometry'ye toplanıyor.
// ⚠️ Bu aynı zamanda AD TUZAĞININ çözümü: `_applyTint` `getObjectByName`
// kullanıyor, aynı adlı meshlerden yalnız İLKİ renk alır. Tek mesh = tek ad,
// hepsi birden renk alıyor.
// Kutu biçimi: [cx, cy, cz, sx, sy, sz]
function kutular(ad, liste, renk, opts) {
    const P = [], N = [], IDX = [];
    for (const b of liste) {
        const g = new THREE.BoxGeometry(b[3], b[4], b[5]);
        g.translate(b[0], b[1], b[2]);
        const pos = g.attributes.position.array;
        const nor = g.attributes.normal.array;
        const idx = g.index.array;
        const taban = P.length / 3;
        for (let i = 0; i < pos.length; i++) { P.push(pos[i]); N.push(nor[i]); }
        for (let i = 0; i < idx.length; i++) IDX.push(taban + idx[i]);
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.Float32BufferAttribute(P, 3));
    geo.setAttribute('normal', new THREE.Float32BufferAttribute(N, 3));
    geo.setIndex(IDX);
    const m = mesh(geo, renk, Object.assign({ name: ad }, opts || {}));
    modelGroup.add(m);
    return m;
}

// ===========================================================================
// 4. KABİN + KAPUT LOFT'U
// ===========================================================================
// Eğrilerin okunması: x arttıkça (arkadan öne) kabin → kokpit duvarı →
// kaput. Kokpit duvarı x 2.18 ile 2.38 arasında; tavan çizgisi orada
// 2.640'tan 1.845'e, yani 0.20 m'de 0.795 m düşüyor (yatayla 76°) — Ural'ın
// düz iki parçalı ön camı gerçekten bu kadar diktir.
//
// ⚠️ KAPUTUN DARLIĞI `D_BEL`DEN GELİYOR, `W_OMUZ`DAN DEĞİL. W_OMUZ (en
// geniş yer) kaput bölgesinde de 1.250'de kalıyor çünkü ORASI ÇAMURLUK.
// Kaput, kesitin daha yukarısındaki `wB = wO - D_BEL` çizgisi: kabinde
// D_BEL 0.015 (yan yüz dümdüz yukarı çıkıyor), kaputta 0.630 (çamurluğun
// üstünden 0.62'ye kadar içeri çekiliyor). Aradaki geçiş kokpitin GERÇEK
// açılışı: dar kaputtan geniş kabin ön duvarına genişleyen kalkan biçimi.
// İlk kurgu kaputu W_OMUZ'la daraltıyordu ve çamurluklar da onunla birlikte
// içeri kaçıyor, kamyonun önü minibüs gibi kalıyordu.
const G_KABIN = loftYap({
    X_ARKA: KAB_ARKA, X_ON: KAB_ON,
    PAH_ARKA: 0.030, UC_ARKA: 0.985,     // kabinin arkası DÜZ duvar
    // ⚠️ Burun 0.110/0.930 ile kurulmuştu ve önden bakışta radyatör kovanı
    // damla gibi sivriliyordu. Kamyonun burnu KÜT: 0.080/0.955.
    PAH_ON:   0.080, UC_ON:   0.955,
    VA: 0.030, VB: 0.220, VC: 0.620, VD: 0.790,
    // ⚠️ US_CATI 0.58'den 0.46'ya indirildi. 0.58 kabinin tavanini KUBBE
    // gibi yuvarlatiyordu ve onden cizimde kamyon degil minibus okunuyordu;
    // askeri kamyonun tavani DUZ, yalniz kenarlari yuvarlak. 0.46 ortada
    // duz, kenarda ~0.20 yaricapli kose veriyor. Ayni us kaputun sirtini da
    // duzlestiriyor -- Ural'in kaputu da duz sirtlidir.
    US_YANAK: 0.42, US_CATI: 0.46, BOMBE: 0.006, PAY_BOL: 0.42,
    NV: NV_KAB,
    KEMER: [ON_X], KEMER_R: KEMER_R, KEMER_ETEK: KEMER_ETEK,

    // Gövdenin alt kenarı. Kabinde 1.100 (şasi kirişinin üstü), kaputta
    // motor bölmesinin altı, burunda RADYATÖR KOVANININ DİBİ (1.020).
    // ⚠️ Burun 1.290'da bırakılmıştı ve ön yüz yalnız 0.35 m yüksekliğinde
    // kalıyordu: ızgara sığmıyor, kamyon önden bakışta ağzı kapalı bir
    // kutuya dönüyordu. 1.020'ye indirilince ön yüz 0.68 m oldu ve tamponla
    // ızgara arasında gerçek bir açıklık kaldı.
    ESIK: egriYap([
        [0.760, 1.100], [1.150, 1.100], [1.500, 1.108], [2.100, 1.140],
        [2.600, 1.150], [3.100, 1.120], [3.400, 1.060], [3.560, 1.020]
    ]),
    // EN GENİŞ NOKTANIN YÜKSEKLİĞİ: kabinde gövdenin bel altı, kaputta
    // ÇAMURLUĞUN ÜST HATTI.
    // ⚠️ BU EĞRİ YANDAN BAKIŞTAKİ SİLUETİN KENDİSİ. Kaput sırtı (1.800)
    // yalnız 0.62 yarı genişlikte, yani içeride kalıyor; yandan görünen en
    // dış nokta W_OMUZ çizgisi, onun yüksekliği de bu eğri. İlk kurulumda
    // kaputta 1.43'e iniyordu ve önden çizimde ölçüldü: çamurluk lastiğin
    // üstünde yalnız 55 mm kalıyor (ağız 1.375, çamurluk 1.430), yani
    // çamurluk diye bir şey görünmüyor; siluet kabinden buruna doğru
    // yuvarlanarak düşen bir salyangoz kabuğu oluyordu. 1.560'a çıkarıldı:
    // ağız 1.350'ye indi (KEMER_R 0.745 -> 0.720) ve çamurluk lastiğin
    // üstünde 210 mm'lik gerçek bir kuşak oldu.
    Y_OMUZ: egriYap([
        [0.760, 1.600], [1.400, 1.600], [1.800, 1.580], [2.150, 1.565],
        [2.500, 1.560], [3.050, 1.560], [3.350, 1.545], [3.560, 1.500]
    ]),
    // ORTA HATTIN YÜKSEKLİĞİ: kabin tavanı 2.715 → kokpit → kaput 1.800.
    Y_UST: egriYap([
        [0.760, 2.715], [1.900, 2.715], [2.080, 2.712], [2.180, 2.640],
        [2.260, 2.320], [2.320, 1.960], [2.380, 1.845], [2.600, 1.812],
        [3.100, 1.800], [3.360, 1.786], [3.480, 1.750], [3.560, 1.720]
    ]),
    // KUBBE DERİNLİĞİ (yU - yC). Kabin tavanı hafif kavisli, kaput sırtı da.
    KUBBE: egriYap([
        [0.760, 0.115], [2.100, 0.115], [2.400, 0.110], [3.100, 0.105],
        [3.560, 0.100]
    ]),
    // EN GENİŞ YARI GENİŞLİK: kabin 1.175 (2.35 m), çamurluklar 1.250 (2.50).
    W_OMUZ: egriYap([
        [0.760, 1.175], [1.500, 1.175], [1.700, 1.200], [1.900, 1.240],
        [2.150, 1.250], [3.050, 1.250], [3.330, 1.230], [3.470, 1.190],
        [3.560, 1.140]
    ]),
    // KUŞAK YÜKSEKLİĞİ: kabinde yan camın üstü, kaputta kaput yanağının üstü.
    Y_BEL: egriYap([
        [0.760, 2.450], [1.900, 2.450], [2.080, 2.442], [2.180, 2.380],
        [2.260, 2.100], [2.320, 1.790], [2.380, 1.690], [2.600, 1.672],
        [3.100, 1.665], [3.360, 1.650], [3.480, 1.615], [3.560, 1.580]
    ]),
    // Kuşakta genişliğin omuzdan ne kadar içeri çekildiği — KAPUTU BU YAPIYOR.
    D_BEL: egriYap([
        [0.760, 0.015], [1.900, 0.015], [2.100, 0.030], [2.240, 0.120],
        [2.320, 0.420], [2.400, 0.620], [2.700, 0.628], [3.100, 0.630],
        [3.380, 0.630], [3.560, 0.600]
    ]),
    // ÇATI/SIRT KENARI GENİŞLİĞİ.
    W_CATI: egriYap([
        [0.760, 1.090], [1.900, 1.090], [2.120, 1.084], [2.260, 1.045],
        [2.340, 0.730], [2.420, 0.566], [2.700, 0.558], [3.100, 0.552],
        [3.380, 0.524], [3.560, 0.474]
    ]),
    // KESİTİN EN ALTINDAKİ GENİŞLİK. Burunda 0.560'a daralıyor: orası
    // radyatör kovanının dibi, çamurluklar onun ÜSTÜNDE 1.140'a açılıyor.
    // 1.080'de bırakılınca burnun altı 2.16 m genişliğinde bir çene gibi
    // duruyordu.
    W_ESIK: egriYap([
        [0.760, 1.090], [1.900, 1.100], [2.400, 1.120], [2.900, 1.100],
        [3.200, 0.900], [3.420, 0.680], [3.560, 0.560]
    ]),

    // İstasyonlar: KEMER AĞZINDA ve KOKPİT DUVARINDA sık, düz bölümlerde
    // seyrek. Kemer eğrisinin türevi ağzın uçlarında kırılıyor; kokpitte ise
    // tavan çizgisi 0.20 m'de 0.80 m düşüyor — ikisi de seyrek örneklenirse
    // yüzey merdiven gibi çıkar. Kabinin ortası ise neredeyse hiç değişmiyor.
    // ⚠️ Kokpit listesi AYRI: kemer listesi orada yalnız 0.28 aralık
    // bırakıyordu (2.270 ile 2.510 arası TEK istasyon) ve ön cam tek bir
    // dörtgen bant olarak çıkıyordu.
    IST: (function () {
        // Kemer istasyonları AKSTAN OLAN UZAKLIĞA göre üretiliyor, elle
        // yazılmıyor: kemer yarıçapı değişince liste kendiliğinden doğru
        // yere kayıyor. ±KEMER_R'de sıklaşıyor (dairenin türevi orada dikey).
        const kemerIst = [-0.845, -0.800, -0.768, -0.745, -0.722, -0.660,
                          -0.520, -0.280, 0, 0.280, 0.520, 0.660, 0.722,
                          0.745, 0.768, 0.800, 0.845].map(
            function (d) { return +(ON_X + d).toFixed(4); });
        const kokpit = [2.120, 2.158, 2.192, 2.222, 2.250, 2.278, 2.304,
                        2.330, 2.354, 2.378, 2.404, 2.440, 2.490];
        return [].concat(
            [0.775, 0.800, 0.850, 0.950, 1.080],
            kemerIst,                              // 1.145 .. 2.835
            kokpit,
            [2.900, 2.980, 3.070, 3.160, 3.250, 3.330, 3.400, 3.455],
            [3.500, 3.528, 3.548, 3.560]
        ).sort(function (a, b) { return a - b; })
         .filter(function (v, i, a) { return i === 0 || v > a[i - 1] + 1e-6; });
    })()
});
G_KABIN.kur('govde', C_GOVDE, { metal: 0.14, rough: 0.68 });

// ===========================================================================
// 5. KASA (metal platform) — düz prizma
// ===========================================================================
// 3890 x 2452 x 520 mm (kaynak: iç ölçü 3890 x 2330, sabit bord 500 mm).
// Kesitinde kavis olmadığı için loft'a gerek yok;
// plan şekli (x-z düzlemi) yuvarlatılmış köşelerle extrude edilip +y'ye
// itiliyor. ⚠️ `bevelEnabled: false` — bevel konturu DIŞARI iter (motokaravan
// ölçümü) ve kasa tam 2.480 m kalmalı ki branda 20 mm taşabilsin.
(function kasaKur() {
    const sh = yuvarlakSekil([[KASA_ARKA, -KASA_Z], [KASA_ON, -KASA_Z],
                              [KASA_ON, KASA_Z], [KASA_ARKA, KASA_Z]], 0.045);
    const geo = new THREE.ExtrudeGeometry(sh, {
        depth: KASA_UST - KASA_TABAN, bevelEnabled: false, curveSegments: 3
    });
    // rotateX(-π/2): (x,y,z) → (x,z,-y). Şeklin planı model x-z düzlemine,
    // itiş +y'ye.
    geo.rotateX(-Math.PI / 2);
    geo.translate(0, KASA_TABAN, 0);
    modelGroup.add(mesh(geo, C_GOVDE, { metal: 0.14, rough: 0.68,
                                        name: 'kasa' }));
})();

// Kasa tabanı: bordun altında, şasiye oturan zemin plakası. Bordun 40 mm
// içeride kalıyor ki yandan bakışta bordun alt kenarı kendi çizgisini
// bıraksın.
kutular('kasa_taban', [
    [(KASA_ON + KASA_ARKA) / 2, 1.380, 0, KASA_ON - KASA_ARKA, 0.100,
     2 * KASA_Z - 0.080]
], C_SASI, { metal: 0.18, rough: 0.72 });

// Kasa dikmeleri: bordu bölen dikey saclar. Duaların hizasında duruyorlar —
// gerçek kamyonda dua yuvası dikmenin üstündedir.
// Tek mesh (bkz. `kutular` başlığındaki gerekçe): 12 dikme, 1 çizim çağrısı.
(function () {
    const d = [];
    DUALAR.forEach(function (dx) {
        if (dx < KASA_ARKA + 0.10 || dx > KASA_ON - 0.10) return;
        [1, -1].forEach(function (s) {
            d.push([dx, (KASA_TABAN + KASA_UST) / 2, s * (KASA_Z + 0.005),
                    0.070, KASA_UST - KASA_TABAN - 0.030, 0.010]);
        });
    });
    // Bordun üst kenarındaki kuşak — kasanın üst çizgisini çiziyor, bez
    // oraya bağlanıyor.
    [1, -1].forEach(function (s) {
        d.push([(KASA_ON + KASA_ARKA) / 2, KASA_UST - 0.045,
                s * (KASA_Z + 0.006), KASA_ON - KASA_ARKA - 0.02, 0.062, 0.012]);
    });
    kutular('kasa_dikme', d, C_SASI, { metal: 0.18, rough: 0.70 });
})();

// Arka kapak (menteşeli borda). Kasanın arka yüzünde, gövde renginde;
// çevresindeki koyu çerçeve olmasa kasayla aynı renkte kaybolurdu.
yuzParca('kasa_kapak_cerceve',
         [[-KASA_Z + 0.02, KASA_TABAN + 0.03], [KASA_Z - 0.02, KASA_TABAN + 0.03],
          [KASA_Z - 0.02, KASA_UST - 0.03], [-KASA_Z + 0.02, KASA_UST - 0.03]],
         0.040, KASA_ARKA - 0.024, 0.060, C_SASI, { metal: 0.18, rough: 0.70 });
yuzParca('kasa_kapak',
         [[-KASA_Z + 0.06, KASA_TABAN + 0.07], [KASA_Z - 0.06, KASA_TABAN + 0.07],
          [KASA_Z - 0.06, KASA_UST - 0.07], [-KASA_Z + 0.06, KASA_UST - 0.07]],
         0.032, KASA_ARKA - 0.036, 0.055, C_GOVDE, { metal: 0.14, rough: 0.68 });

// ===========================================================================
// 6. BRANDA LOFT'U — modeli tepeden okutan asıl şey
// ===========================================================================
// Kasanın üstünde, altı dua üzerine gerilmiş bez. Kesitin %67'si (v 0.33..1)
// KUBBEYE ayrıldı: brandanın tamamı o yaydır, örnekler oraya toplanmalı.
// `US_CATI = 1.0` → tam elips çeyreği (yarı genişlik 1.230, yükselme 0.805).
//
// SARKMA: `Y_UST` ve `W_CATI` eğrilerine altı dua (3.005 / 1.230) ile beş
// boşluk (2.978 / 1.221) SIRAYLA yazıldı. PCHIP yerel uçlarda tegeti
// sıfırladığı için taşma yok; dalga tam 27 mm derinlikte kalıyor.
// İstasyonlar her gözde DÖRT parçaya bölünüyor (0.19 m aralık): iki
// örnekle dalga zikzak çıkardı.
let G_BRANDA = null;
(function () {
    const ustKp = [[BRA_ARKA, BRA_TEPE - 0.048]];
    const catiKp = [[BRA_ARKA, 1.198]];
    const sirali = [];
    for (let i = 0; i < DUALAR.length; i++) {
        sirali.push([DUALAR[i], 1]);
        if (i < SARKMA.length) sirali.push([SARKMA[i], 0]);
    }
    sirali.sort(function (a, b) { return a[0] - b[0]; });
    sirali.forEach(function (p) {
        ustKp.push([p[0], p[1] ? BRA_TEPE : BRA_TEPE - 0.027]);
        catiKp.push([p[0], p[1] ? 1.230 : 1.221]);
    });
    ustKp.push([BRA_ON, BRA_TEPE - 0.040]);
    catiKp.push([BRA_ON, 1.202]);

    G_BRANDA = loftYap({
        X_ARKA: BRA_ARKA, X_ON: BRA_ON,
        // İki uç da yuvarlak: bez ön ve arka duanın üstünden aşağı sarkıyor.
        PAH_ARKA: 0.170, UC_ARKA: 0.925,
        PAH_ON:   0.140, UC_ON:   0.940,
        VA: 0.040, VB: 0.150, VC: 0.260, VD: 0.330,
        US_YANAK: 0.45, US_CATI: 1.00, BOMBE: 0.004, PAY_BOL: 0.42,
        NV: NV_BRA, KEMER: null,

        ESIK:   egriYap([[BRA_ARKA, BRA_DIP], [BRA_ON, BRA_DIP]]),
        Y_OMUZ: egriYap([[BRA_ARKA, 2.000], [BRA_ON, 2.000]]),
        Y_UST:  egriYap(ustKp),
        KUBBE:  egriYap([[BRA_ARKA, 0.805], [BRA_ON, 0.805]]),
        // ⚠️ 1.250 değil 1.240: brandanın alt kenarındaki HALAT bir yüzey
        // yaması ve normal boyunca 10 mm dışarı ötelendiği için kutuyu
        // 1.259'a taşıyordu (ölçüldü, kutu_olc.js). Genişlik 2.500 m
        // kalması gereken bir kaynak değeri; bez 1.240'ta bırakılınca
        // halat tam 1.250'ye oturuyor.
        W_OMUZ: egriYap([[BRA_ARKA, 1.240], [BRA_ON, 1.240]]),
        Y_BEL:  egriYap([[BRA_ARKA, 2.120], [BRA_ON, 2.120]]),
        D_BEL:  egriYap([[BRA_ARKA, 0.006], [BRA_ON, 0.006]]),
        W_CATI: egriYap(catiKp),
        W_ESIK: egriYap([[BRA_ARKA, 1.190], [BRA_ON, 1.190]]),

        IST: (function () {
            const a = [];
            for (let i = 0; i < DUALAR.length - 1; i++) {
                const x1 = DUALAR[i + 1], x2 = DUALAR[i];   // DUALAR azalan
                for (let k = 0; k < 4; k++) a.push(x1 + (x2 - x1) * k / 4);
            }
            a.push(DUALAR[0]);
            a.sort(function (p, q) { return p - q; });
            // Uç pahları: bezin sarktığı son 0.17/0.14 m.
            const on = [0.30, 0.58, 0.80, 0.94, 1.0].map(
                function (k) { return BRA_ON - 0.140 + 0.140 * k; });
            const arka = [1.0, 0.94, 0.80, 0.58, 0.30].map(
                function (k) { return BRA_ARKA + 0.170 - 0.170 * k; });
            return arka.concat(a, on).filter(
                function (v, i, r) { return i === 0 || v > r[i - 1] + 1e-6; });
        })()
    });

    G_BRANDA.kur('branda', C_BRANDA, { metal: 0.06, rough: 0.88 });

    // ---- DUA KAYIŞLARI ----------------------------------------------------
    // Bezin altındaki duaları dışarıdan gösteren koyu kuşaklar. Tepeden
    // bakışta brandayı "gerilmiş bez" yapan tek işaret bunlar: kavis tek
    // başına düzgün bir tünel, kayışlar onu bölüyor.
    // ⚠️ w BİÇİMİNDE. Kubbenin içinden geçiyorlar; yükseklik biçiminde
    // yazılsalardı her x'te başka bir yüzey bölgesine düşerlerdi (otobüsün
    // yırtılan ön cam bandı dersi).
    // nw büyük (uzun kenar w yönünde), nx = 1.
    (function () {
        const b = [];
        DUALAR.forEach(function (dx) {
            if (dx <= BRA_ARKA + 0.05 || dx >= BRA_ON - 0.05) return;
            b.push([dx - 0.026, dx + 0.026, -0.760, 0.760]);
        });
        yuzeyYama(G_BRANDA, 'branda_dua', b, 1, 18, 0.009, C_BEZ_K,
                  { metal: 0.05, rough: 0.90, katman: 1 });
    })();

    // ---- ALT KENAR HALATI -------------------------------------------------
    // Bezi kasaya bağlayan halat/kuşak. Brandanın alt sınırını çiziyor;
    // olmasaydı bez ile metal bord arasındaki geçiş yalnız bir renk farkı
    // olarak kalırdı.
    [1, -1].forEach(function (s, i) {
        yuzeyYama(G_BRANDA, 'branda_halat_' + (i + 1),
                  [[BRA_ARKA + 0.16, BRA_ON - 0.13, s * 0.905, s * 0.868]],
                  22, 1, 0.010, C_BEZ_K, { metal: 0.05, rough: 0.90, katman: 2 });
    });

    // ---- ARKA PERDE -------------------------------------------------------
    // Brandanın arka yüzü: çerçeve + daha koyu perde. Gerçek kamyonda arka
    // bez ayrı bir parçadır ve bağcıklıdır; koyu ton onu gövdeden ayırıyor.
    (function () {
        const kemer = [];
        const N = 14;
        for (let i = 0; i <= N; i++) {
            const th = Math.PI * i / N;
            kemer.push([1.180 * Math.cos(th), 2.180 + 0.760 * Math.sin(th)]);
        }
        kemer.push([-1.180, 1.990]);
        kemer.push([1.180, 1.990]);
        yuzParca('branda_arka_cerceve', kemer, 0.030, BRA_ARKA - 0.030, 0.075,
                 C_BEZ_K, { metal: 0.05, rough: 0.90 });
        const ic = [];
        for (let i = 0; i <= N; i++) {
            const th = Math.PI * i / N;
            ic.push([1.090 * Math.cos(th), 2.180 + 0.690 * Math.sin(th)]);
        }
        ic.push([-1.090, 2.045]);
        ic.push([1.090, 2.045]);
        yuzParca('branda_arka', ic, 0.026, BRA_ARKA - 0.044, 0.062,
                 '#7b7358', { metal: 0.05, rough: 0.90 });
    })();
})();

// ===========================================================================
// 7. ŞASİ VE ALT TAKIM
// ===========================================================================
// Kamyonu otobüsten/SUV'dan ayıran ikinci şey (birincisi branda): ALTI AÇIK.
// Kasa tabanı 1.430, lastik tepesi 1.260 — arada 170 mm boşluk var ve
// oradan öbür tarafın zemini görünüyor. Bu KUSUR DEĞİL, aracın imzası;
// otomobil ve otobüste konan kapatıcı `taban` plakası burada BİLEREK yok.
// Görünen şey gerçek bir şasi olmalı, o yüzden kirişler ve traversler var.
(function () {
    const b = [];
    // İki uzunlamasına kiriş (U profil kalınlığında kutu).
    [1, -1].forEach(function (s) {
        b.push([-0.06, (SASI_ALT + SASI_UST) / 2, s * SASI_Z,
                UZUN * 2 - 0.28, SASI_UST - SASI_ALT, 0.090]);
    });
    // Traversler.
    [3.230, ON_X, 0.520, -0.700, ORTA_X + 0.350, -3.520].forEach(function (tx) {
        b.push([tx, SASI_ALT + 0.070, 0, 0.080, 0.100, 2 * SASI_Z - 0.09]);
    });
    kutular('sasi', b, C_SASI, { metal: 0.22, rough: 0.66 });
})();

// Akslar ve diferansiyeller. Klirens 400 mm: diferansiyel kovanının ALTI
// tam 0.400'de, yani kaynaktaki değer geometriye birebir geçti.
(function () {
    [ON_X, ORTA_X, ARKA_X].forEach(function (ax, k) {
        const kiris = mesh(new THREE.CylinderGeometry(0.075, 0.075,
                                                      2 * IZ_Z - 0.34, 9),
                           C_SASI, { metal: 0.25, rough: 0.60,
                                     name: 'aks_' + (k + 1) });
        kiris.rotation.x = Math.PI / 2;
        kiris.position.set(ax, AKS_Y, 0);
        modelGroup.add(kiris);
        const dif = mesh(new THREE.SphereGeometry(0.230, 10, 7), C_SASI,
                         { metal: 0.25, rough: 0.60, name: 'diferansiyel_' + (k + 1) });
        dif.scale.set(1.0, 1.0, 0.78);
        dif.position.set(ax, AKS_Y, 0);
        modelGroup.add(dif);
    });
})();

// Yakıt deposu ve alet sandığı — şasinin iki yanında, kasanın altında.
// ⚠️ İKİ TARAFTA DA VAR (gerçekte depo tek taraftadır): harita modeli
// soldan sağa aynalıyor ve model serbestçe dönüyor; tek taraflı kurgu
// bakışların yarısında bomboş bir yan yüz bırakıyordu.
(function () {
    const b = [];
    [1, -1].forEach(function (s) {
        b.push([-0.500, 1.190, s * 0.560, 0.860, 0.400, 0.300]);   // depo
        b.push([-1.895, 1.230, s * 0.540, 0.520, 0.300, 0.260]);   // sandık
    });
    kutular('yan_kutu', b, C_SASI, { metal: 0.22, rough: 0.64 });
})();

// Egzoz: susturucu şasinin altında, boru arkaya çıkıyor.
(function () {
    const s = mesh(new THREE.CylinderGeometry(0.105, 0.105, 0.720, 10),
                   '#3a3f37', { metal: 0.30, rough: 0.55, name: 'susturucu' });
    s.rotation.z = Math.PI / 2;
    s.position.set(0.700, 0.860, -0.640);
    modelGroup.add(s);
    const bo = mesh(new THREE.CylinderGeometry(0.048, 0.048, 1.900, 8),
                    '#3a3f37', { metal: 0.30, rough: 0.55, name: 'egzoz' });
    bo.rotation.z = Math.PI / 2;
    bo.position.set(-0.700, 0.840, -0.640);
    modelGroup.add(bo);
})();

// ===========================================================================
// 8. TEKERLEKLER
// ===========================================================================
// Grup deseni: grup rotation.x = π/2 ile yatırılıyor, rotation.y motora
// bırakılıyor. ALTISI da modelGroup'un DOĞRUDAN çocuğu — motor ön tekerleri
// kendi steer grubuna alırken `inner.add(sg)` yapıyor, daha derinde
// olsalardı yerlerinden sökülürlerdi.
//
// TEKİL LASTİK, İKİZ YOK. Otobüste arka aks ikizdi; arazi 6x6'sında ikiz
// kullanılmaz (iki lastik arası çamurla dolar ve çekiş biter). Tekil ama
// ÇOK BÜYÜK lastik (çap 1.26 m — otobüsünkinin 1.32 katı, otomobilinkinin
// iki katı) bu aracın en uzaktan okunan işareti.
function tekerlek(ad, x, z) {
    const g = new THREE.Group();
    g.name = ad;
    g.position.set(x, AKS_Y, z);
    g.rotation.x = Math.PI / 2;
    const dis = (z > 0 ? 1 : -1);

    // Lastik: torusun kesiti daire olduğu için et kalınlığı genişliği de
    // belirliyor; arazi lastiği DAR ve ÇOK YÜKSEK yanaklıdır (yanak 376 mm,
    // jantın %74'ü) → aks doğrultusunda ölçekleniyor, kesit elipse dönüyor.
    const et = (R_TEKER - R_JANT) / 2;              // 0.188
    const lastik = new THREE.TorusGeometry(R_TEKER - et, et, 6, 20);
    lastik.rotateX(Math.PI / 2);
    lastik.scale(1, LASTIK_GEN / (et * 2), 1);
    // ⚠️ flatShading: arazi lastiğinin iri takozlu sırtı yumuşak gölgeyle
    // düz bir kauçuk halkaya dönüyordu. 20 dilimde düz gölgeleme kenarları
    // ayırıyor ve lastik "takozlu" okunuyor — üçgen bedeli SIFIR.
    g.add(mesh(lastik, C_LASTIK, { rough: 0.95, flat: true, name: ad + '_lastik' }));

    // Jant kovanı: AÇIK uçlu silindir (kapaklı olsaydı diski örterdi).
    const jant = mesh(new THREE.CylinderGeometry(R_JANT, R_JANT,
                                                 LASTIK_GEN * 0.86, 14, 1, true),
                      C_JANT_K, { metal: 0.30, rough: 0.55, name: ad + '_jant' });
    jant.material.side = THREE.DoubleSide;
    g.add(jant);

    // Çelik disk + poyra. Askeri kamyonda jant KROM DEĞİL, gövde tonunda
    // boyalı düz çelik disktir; kollu döküm jant denenmedi bile — 20 inçlik
    // jantta kol arası boşluk lastiğin gölgesinde kalır, yalnız üçgen harcar.
    const disk = mesh(new THREE.CylinderGeometry(R_JANT * 0.94, R_JANT * 0.94,
                                                 0.026, 14),
                      C_JANT, { metal: 0.28, rough: 0.58, name: ad + '_disk' });
    disk.position.y = dis * (LASTIK_GEN * 0.42);
    g.add(disk);
    const gobek = mesh(new THREE.CylinderGeometry(0.090, 0.090, 0.070, 8),
                       C_JANT_K, { metal: 0.30, rough: 0.55, name: ad + '_gobek' });
    gobek.position.y = dis * (LASTIK_GEN * 0.45);
    g.add(gobek);

    modelGroup.add(g);
}
// ⚠️ ADLANDIRMA: orta aks "teker_arka_1/2", arka aks "teker_arka_3/4".
// Otobüsün altı tekerli probu (`otobus_probu.py`) bu ad listesini SABİT
// tutuyor; aynı adlarla yazılınca prob değiştirilmeden koşuyor.
tekerlek('teker_on_1',   ON_X,   IZ_Z);
tekerlek('teker_on_2',   ON_X,  -IZ_Z);
tekerlek('teker_arka_1', ORTA_X,  IZ_Z);
tekerlek('teker_arka_2', ORTA_X, -IZ_Z);
tekerlek('teker_arka_3', ARKA_X,  IZ_Z);
tekerlek('teker_arka_4', ARKA_X, -IZ_Z);

// ---- YEDEK LASTİK ---------------------------------------------------------
// Kabinin arkasındaki 470 mm'lik boşlukta DİK duruyor, yüzü öne bakıyor
// (kesit 390 mm, boşluğa 40 mm payla giriyor). Tepesi 2.360'ta: kasa
// bordunun (1.950) üstünde, kabin tavanının (2.715) altında — yani tepeden
// bakışta kabin ile branda arasındaki boşlukta net bir siyah daire olarak
// görünüyor. Ayrı bir GRUP değil, TEK teker: yuvarlanmıyor, _WHEELS'e
// girmiyor.
(function () {
    const g = new THREE.Group();
    g.name = 'yedek';
    g.position.set(0.520, 1.730, 0);
    g.rotation.z = Math.PI / 2;                 // yüzü +x'e baksın
    const et = (R_TEKER - R_JANT) / 2;
    const lastik = new THREE.TorusGeometry(R_TEKER - et, et, 6, 18);
    lastik.rotateX(Math.PI / 2);
    lastik.scale(1, LASTIK_GEN / (et * 2), 1);
    g.add(mesh(lastik, C_LASTIK, { rough: 0.95, flat: true, name: 'yedek_lastik' }));
    const jant = mesh(new THREE.CylinderGeometry(R_JANT * 0.94, R_JANT * 0.94,
                                                 LASTIK_GEN * 0.80, 12),
                      C_JANT, { metal: 0.28, rough: 0.58, name: 'yedek_jant' });
    g.add(jant);
    modelGroup.add(g);
    // Taşıyıcı sepet: yedek lastiği havada bırakmayan çerçeve.
    kutular('yedek_sepet', [
        [0.520, 1.110, 0, 0.440, 0.070, 0.560],
        [0.740, 1.740, 0, 0.050, 1.300, 0.120]
    ], C_SASI, { metal: 0.22, rough: 0.66 });
})();

// ---- ön çamurluğun içi (davlumbaz) ---------------------------------------
// ⚠️ Yay lastiğin İÇİNDE değil, lastikten HEMEN DIŞARIDA (yarıçap 0.645 ..
// 0.712; lastik 0.630, kemer dudağı 0.720). İçeride kalsaydı lastikle kemer
// dudağı arasındaki 90 mm'lik boşluk açık kalır, kemer ağzından öbür
// tarafın zemini görünür ve ağız kocaman bir delik gibi okunurdu.
// ⚠️ Halka dilimi EXTRUDE ediliyor, kısmi silindir DEĞİL: kalınlıksız kabuk
// aks doğrultusundan bakınca saç teli inceliğine düşüp kayboluyor.
[1, -1].forEach(function (s, i) {
    const sh = new THREE.Shape();
    sh.absarc(0, 0, 0.712, -0.14, Math.PI + 0.14, false);
    sh.absarc(0, 0, 0.645, Math.PI + 0.14, -0.14, true);
    const geo = new THREE.ExtrudeGeometry(sh, {
        depth: 0.560, bevelEnabled: false, curveSegments: 9
    });
    geo.translate(0, 0, s > 0 ? 0.700 : -1.260);
    geo.translate(ON_X, AKS_Y, 0);
    modelGroup.add(mesh(geo, C_DIP, { metal: 0.10, rough: 0.92,
                                      name: 'davlumbaz_' + (i + 1) }));
});

// ---- çamurluk ağzının kuşağı ---------------------------------------------
// ⚠️ Ağzın kenarı YÜZEY YAMASI OLAMAZ: kesitin v ∈ [0, VA] bölümü ağzın
// AŞAĞI bakan tavanıdır, dışarıdan hiç görünmez (otobüste ölçüldü). Doğrusu
// gövdenin DIŞINDA duran gerçek bir halka dilimi. Yarıçap 0.705 → 0.775:
// kemer dudağının (0.720) 15 mm altından başlayıp 55 mm üstüne taşıyor,
// yani kenarında kendi ışık çizgisi oluşuyor.
[1, -1].forEach(function (s, i) {
    const sh = new THREE.Shape();
    sh.absarc(0, 0, 0.775, -0.05, Math.PI + 0.05, false);
    sh.absarc(0, 0, 0.705, Math.PI + 0.05, -0.05, true);
    const geo = new THREE.ExtrudeGeometry(sh, {
        depth: 0.020, bevelEnabled: false, curveSegments: 10
    });
    geo.translate(0, 0, s > 0 ? 1.244 : -1.264);
    geo.translate(ON_X, AKS_Y, 0);
    modelGroup.add(mesh(geo, '#22261d', { metal: 0.14, rough: 0.82,
                                          name: 'kemer_kusak_' + (i + 1) }));
});

// Arka akslar için paçalık (çamur eteği) — arka lastiğin hemen ardında,
// kasanın altında. Arka lastiğin arka kenarı -3.225, kasanın arka kenarı
// -3.600; paçalık ikisinin arasında (-3.320) ve kutuyu BÜYÜTMÜYOR.
kutular('pacalik', [
    [-3.320, 0.760, 0.900, 0.030, 0.520, 0.500],
    [-3.320, 0.760, -0.900, 0.030, 0.520, 0.500]
], '#1e211a', { metal: 0.08, rough: 0.94 });

// ===========================================================================
// 9. KABİNİN YÜZEY ÖĞELERİ
// ===========================================================================
// ---- YAN CAM VE KAPI ------------------------------------------------------
// Kabinin yan yüzü x 0.76 .. 2.33 arasında; kapı 0.880 ile 2.150 arasında.
// ⚠️ KAPININ ALT KENARI 1.430'DA, 1.230'DA DEĞİL. Ön çamurluk ağzı x
// 1.412..2.568 arasında kesitin TABANINI 1.375'e kadar kaldırıyor; alt
// kenar 1.230'da yazılınca `vYukseklik`in ikili araması o bölgede v=0'a
// düşüyor ve şeridin iki kenarı da kemer dudağının ORTA HATTINA çöküyor —
// gövdenin içinde yassı, dejenere üçgenler kalıyor. (Otobüsün alt bordür
// bandında ölçülmüş tuzağın aynısı; orada bant kemer bölgesini ATLAYARAK
// çözülmüştü, burada kapı bölünemeyeceği için kenar ağzın ÜSTÜNE alındı —
// gerçek kamyonda da kapı eşiği çamurluğun üstündedir.)
// ⚠️ DİKEY ve YATAY derzler AYRI çağrılarda: `nx` x yönündeki, `nw` w
// yönündeki bölüntü, ve her şeridin UZUN kenarına çok verilmeli. Tek
// çağrıda üçü birden yazılsaydı dikey şeritlerin uzun kenarı 3 parçaya
// bölünürdü.
[1, -1].forEach(function (s, i) {
    yuzeyYama(G_KABIN, 'kabin_cam_cerceve_' + (i + 1),
              [[1.000, 2.110, 1.930, 2.410, s]], 9, 3, 0.011, C_DIREK,
              { metal: 0.18, rough: 0.60, katman: 1 });
    yuzeyYama(G_KABIN, 'kabin_cam_' + (i + 1),
              [[1.048, 2.062, 1.972, 2.368, s]], 9, 3, 0.017, C_CAM,
              { metal: 0.35, rough: 0.14, katman: 2 });
    // Kapı derzi: ön ve arka DİKEY kenar + ALT kenar. Üst kenar zaten cam
    // çerçevesiyle örtüşüyor, oraya dördüncü şerit konsaydı çakışırdı.
    yuzeyYama(G_KABIN, 'kabin_derz_dik_' + (i + 1), [
        [0.880, 0.904, 1.430, 2.430, s],
        [2.126, 2.150, 1.430, 2.430, s]
    ], 1, 8, 0.010, '#2b3027', { metal: 0.12, rough: 0.80, katman: 1 });
    yuzeyYama(G_KABIN, 'kabin_derz_yat_' + (i + 1),
              [[0.880, 2.150, 1.430, 1.454, s]], 10, 1, 0.010, '#2b3027',
              { metal: 0.12, rough: 0.80, katman: 1 });
    // Kapı kolu.
    yuzeyYama(G_KABIN, 'kapi_kolu_' + (i + 1),
              [[1.910, 2.040, 1.845, 1.895, s]], 2, 1, 0.020, C_METAL,
              { metal: 0.34, rough: 0.42, katman: 3 });
});

// ---- ÖN CAM ---------------------------------------------------------------
// Ural'ın ön camı DÜZ ve İKİ PARÇALI: ortada dikey bir bölme var. Yüzey
// kokpit duvarının kendisi, yani loft'un x 2.18..2.38 arasındaki dik yüzü.
// ⚠️ Bant w BİÇİMİNDE. Yükseklik biçiminde yazılsaydı sabit bir y, x
// boyunca camın hem dibine hem tepesine denk gelirdi (duvar 76° eğimli) ve
// ikili arama iki farklı yüzey bölgesi bulurdu — otobüsün yırtılan bandının
// birebir aynısı. w biçiminde kenarlar kesit topolojisini izliyor.
// ⚠️ İKİ PARÇALI CAM DENENDİ VE BIRAKILDI. w = 0 kokpit duvarının tepe orta
// hattı olduğu için camı w 0.048..0.440 ve -0.440..-0.048 diye ikiye bölüp
// aradaki şeridi çerçeve rengine bırakmak, kâğıt üstünde Ural'ın ortadaki
// dikmesini verecekti. ÖLÇÜLDÜ (kutu_olc.js): iki cam z ±0.590'da bitiyor,
// yani 'dikme' 1.18 m genişliğinde — camın kendisinden geniş. Sebep,
// otomobilin A direği notunda yazılı olan şey: kubbe bölümünde (US_CATI
// 0.46) z, w ile ÇOK YAVAŞ değişiyor; w = 0.048 daha z = 0.61'e karşılık
// geliyor. 40 mm'lik bir dikme için w = 0.0002 yazmak gerekirdi.
// TEK PARÇA yapıldı; bu ölçekte dikme zaten görünmezdi.
// ⚠️ BOYU DA ÖLÇÜLEREK KISALTILDI. İlk kurulumda çerçeve y 1.895..2.650
// (0.755 m) ölçüldü; kaputun üstünde kalan kabin yüzü yalnız 0.915 m
// olduğu için cam yüzün %82'sini kaplıyor ve önden bakışta otobüs
// okunuyordu. Gerçek Ural'da bu oran %57 civarı. Bandın x aralığı
// kısaltıldı: yeni ölçüm çerçeve y 2.042..2.640 (0.598 m, %65),
// cam y 2.141..2.617 (0.476 m), z ±1.106 — yani her yanda 84 mm'lik
// gerçek bir A direği kalıyor (kabin o yükseklikte ±1.19).
// ⚠️ ÖNCE ÇOK BÜYÜK YAZILMIŞTI (x 2.176..2.336, w ±0.470) ve önden çizimde
// ölçüldü: cam kabinin ön yüzünün tamamını, köşeleri dolanıp yan camlara
// kadar kaplıyordu — otobüs ön camı gibi. Sebep iki katlı: (a) w ±0.470,
// yani kesitin v=0.53 çizgisine kadar iniyor ve orası kabinin YANAĞI;
// (b) x aralığı kokpit duvarının TAMAMI, oysa duvarın alt üçte biri
// gerçek kamyonda sac panel (kaputun arkasındaki göğüs). w ±0.360'a ve
// x 2.176..2.310'a çekildi: yanlarda 0.05'lik (≈60 mm) gerçek bir A
// direği, altta da boyalı bir göğüs paneli kaldı.
yuzeyYama(G_KABIN, 'cam_on_cerceve', [[2.184, 2.280, -0.290, 0.290]],
          7, 12, 0.012, C_DIREK, { metal: 0.18, rough: 0.60, katman: 1 });
yuzeyYama(G_KABIN, 'cam_on', [[2.194, 2.268, -0.250, 0.250]],
          6, 11, 0.019, C_CAM, { metal: 0.35, rough: 0.14, katman: 2 });

// ---- KAPUT ----------------------------------------------------------------
// Aligator kaput (kaynak: "капот аллигаторного типа"): menteşesi önde,
// ayrım çizgisi kaputun iki yanında, çamurlukla birleştiği yerde.
// ⚠️ Şerit w = 0.38'de. Kesitte v = VC = 0.62 çizgisi (w = 1 - v) kaputun
// yan yüzü ile çamurluğun üst yüzeyinin kırıldığı yerdir; derz oraya
// oturmazsa kaputun ortasında ya da çamurluğun düzünde asılı kalır.
// ⚠️ nx = 14, nw = 1: şeridin UZUN kenarı x yönünde (1.05 m), kısa kenarı
// w yönünde (0.02). Ters verilseydi şerit kaputun sırtındaki kavisi takip
// edemeyip yüzeyin içine girer ve kaybolurdu.
yuzeyYama(G_KABIN, 'kaput_derz', [
    [2.420, 3.470, 0.372, 0.392],
    [2.420, 3.470, -0.372, -0.392]
], 14, 1, 0.007, '#2b3027', { metal: 0.12, rough: 0.80, katman: 1 });
// Kaputun sırtındaki havalandırma dilimleri — düz sacı bölen tek şey.
// w ±0.120 → v 0.88, yani kaput kubbesinin (VD = 0.79 üstü) tam ortası.
yuzeyYama(G_KABIN, 'kaput_panjur', [
    [2.640, 2.700, -0.120, 0.120],
    [2.790, 2.850, -0.120, 0.120],
    [2.940, 3.000, -0.120, 0.120]
], 1, 6, 0.008, '#31362b', { metal: 0.18, rough: 0.70, katman: 2 });

// ---- ÇAMURLUK ÜSTÜ İŞARET LAMBASI ----------------------------------------
// w 0.63..0.70 → v 0.30..0.37, yani C bölümü: çamurluğun ÜST yüzeyi.
yuzeyYama(G_KABIN, 'gabari', [
    [3.180, 3.290, 0.630, 0.700],
    [3.180, 3.290, -0.630, -0.700]
], 2, 1, 0.014, C_SINYAL, { metal: 0.20, rough: 0.35, katman: 3 });

// ===========================================================================
// 10. ÖN YÜZ (ızgara, farlar, tampon)
// ===========================================================================
// ⚠️ Koordinatlar GÖZ KARARI DEĞİL: kapağın (x = 3.560) profili
// `kesit_olc.js --z 3.560 ...` ile ölçülüp her parça o zarfın İÇİNE yazıldı.
// Kaput sırtı 1.640'ta, çamurluk hattı ~1.380'de, gövdenin alt kenarı
// 1.290'da bitiyor.
//
// URAL'IN YÜZÜ: ortada DAR ve DİK ızgara (kaput genişliğinde, ~1.10 m),
// iki yanda ÇAMURLUĞUN ÖN YÜZÜNE oturan yuvarlak farlar, altta şasiye
// asılı dar tampon. Otomobil/otobüsteki "boydan boya fasya" burada YOK —
// kamyonun önü açıktır, tamponla ızgara arasından radyatör görünür.
// ⚠️ ÖLÇÜLDÜ, GÖZ KARARI DEĞİL: `node kesit_olc.js models/askeri-kamyon.js
// --z 3.560 ...` → kapak y 1.0445..1.6955; yarı genişlik y=1.10'da 1.002 ·
// 1.25-1.38 arasında 1.060 (çamurluk platosu) · 1.44'te 0.745 · 1.50'de
// 0.497 · 1.55'te 0.464 · 1.60'ta 0.437. Izgaranın üst kenarı önce 1.545'te
// 0.472 yazılmıştı: kapak orada yalnız 0.468, yani çerçeve gövdenin 4 mm
// DIŞINA taşıyordu. 1.505 / 0.452'ye çekildi.
yuzParca('izgara_cerceve',
         [[-0.520, 1.075], [0.520, 1.075], [0.452, 1.505], [-0.452, 1.505]],
         0.035, 3.524, 0.060, C_GOVDE, { metal: 0.14, rough: 0.68 });
yuzParca('izgara',
         [[-0.472, 1.108], [0.472, 1.108], [0.412, 1.472], [-0.412, 1.472]],
         0.026, 3.542, 0.055, '#1a1e18', { metal: 0.22, rough: 0.72, flat: true });
// Izgara çıtaları: kapkara bir oyuk yerine gerçek bir ızgara okunsun.
// Genişlikleri ızgaranın trapez konturunu izliyor (eğim 0.16), yoksa üst
// çıtalar koyu alanın dışına, çerçevenin üstüne taşıyor.
[1.160, 1.250, 1.340, 1.430].forEach(function (cy, i) {
    const yw = 0.452 - (cy - 1.108) * 0.16;
    yuzParca('izgara_cita_' + (i + 1),
             [[-yw, cy], [yw, cy], [yw, cy + 0.028], [-yw, cy + 0.028]],
             0.008, 3.566, 0.026, C_METAL, { metal: 0.30, rough: 0.48 });
});

// Farlar: ÇAMURLUĞUN ön ucunda, ızgaranın iki yanında, YUVARLAK. Ural'ın
// (ve bütün eski kaputlu askeri kamyonların) en tanıdık yüz işareti bu.
// Kaynak bunu ayrıca söylüyor: "narrow bumpers with wing-mounted headlights
// flanking the grille" — yani far tamponda değil, ÇAMURLUKTA.
// ⚠️ Konum kapağın ölçülmüş zarfına göre: y = 1.270'te kapağın yarı
// genişliği ~1.06; farın dış kenarı 0.955'te kalıyor. Daha yukarı (1.335)
// konsaydı üst kenarı çamurluğun içe dönen yüzeyini aşıyordu.
[1, -1].forEach(function (s, i) {
    const fz = s * 0.815;
    const kova = mesh(new THREE.CylinderGeometry(0.140, 0.140, 0.090, 12),
                      C_GOVDE, { metal: 0.14, rough: 0.68,
                                 name: 'far_kova_' + (i + 1) });
    kova.rotation.z = Math.PI / 2;
    // ⚠️ Kova x 3.500..3.590: ARKASI kapağın (3.560) içinde, ÖNÜ 30 mm
    // dışında. İlk kurulumda 3.463..3.553 idi, yani tamamen gövdenin
    // içindeydi ve yalnız mercek görünüyordu — far kovası diye bir şey
    // kalmıyordu.
    kova.position.set(3.545, 1.270, fz);
    modelGroup.add(kova);
    const lens = mesh(new THREE.CylinderGeometry(0.110, 0.110, 0.040, 12),
                      C_FAR, { metal: 0.10, rough: 0.12,
                               name: 'far_' + (i + 1) });
    lens.rotation.z = Math.PI / 2;
    lens.position.set(3.578, 1.270, fz);
    modelGroup.add(lens);
    // Sinyal: farın altında küçük kehribar dilim.
    const sin = mesh(new THREE.CylinderGeometry(0.052, 0.052, 0.040, 10),
                     C_SINYAL, { metal: 0.18, rough: 0.35,
                                 name: 'sinyal_' + (i + 1) });
    sin.rotation.z = Math.PI / 2;
    sin.position.set(3.565, 1.085, fz);
    modelGroup.add(sin);
});

// TAMPON: şasi kirişlerine cıvatalı DAR çelik profil (kaynak: "narrow
// bumpers"). Ön yüzü 3.643'te; aracın EN ÖN noktası tamponun kendisi değil,
// 40 mm önüne çıkan ÇEKİ KANCALARI (3.683). Uzunluk 7.366 buradan ölçülüyor.
// ⚠️ `bevelEnabled` hiç kullanılmadı: motokaravanda ölçülen tuzakta bevel
// konturu dışarı itiyor ve yazılan ölçü tutmuyor.
kutular('tampon_on', [
    [3.5755, 0.830, 0, 0.135, 0.230, 2.100],
    // Tamponu şasiye bağlayan iki kol.
    [3.380, 0.870, 0.420, 0.400, 0.110, 0.100],
    [3.380, 0.870, -0.420, 0.400, 0.110, 0.100]
], C_SASI, { metal: 0.24, rough: 0.62 });
// Çeki kancaları — tamponun önüne 40 mm çıkan iki çift kulak. Askeri
// kamyonun ön yüzünde gözle aranan ayrıntı.
kutular('ceki_kancasi', [
    [3.6455, 0.830, 0.360, 0.075, 0.180, 0.036],
    [3.6455, 0.830, -0.360, 0.075, 0.180, 0.036],
    [3.6455, 0.830, 0.290, 0.075, 0.180, 0.036],
    [3.6455, 0.830, -0.290, 0.075, 0.180, 0.036]
], C_METAL, { metal: 0.32, rough: 0.52 });

// ===========================================================================
// 11. ARKA UÇ
// ===========================================================================
// Çeki demiri (pintle) ve arka travers — kasanın altında, aracın en arka
// noktası (-3.683).
// ⚠️ Aracın EN ARKA noktası tam -3.683: travers kirişinin arka yüzü.
// Uzunluk 7.366 = 3.683 - (-3.683), yani kaynaktaki değer birebir.
kutular('arka_travers', [
    [-3.628, 1.180, 0, 0.100, 0.220, 1.400],
    [-3.643, 1.060, 0, 0.070, 0.130, 0.170]        // çeki demiri (pintle)
], C_SASI, { metal: 0.24, rough: 0.62 });
// Stop lambaları: traversin arka yüzünde, kasanın altında. DİKDÖRTGEN ve
// KÜÇÜK — askeri araçta büyük lamba yok.
[1, -1].forEach(function (s, i) {
    yuzParca('stop_' + (i + 1),
             [[s * 0.480, 1.110], [s * 0.680, 1.110], [s * 0.680, 1.270],
              [s * 0.480, 1.270]],
             0.028, -3.683, 0.058, C_STOP, { metal: 0.20, rough: 0.30 });
});

// ===========================================================================
// 12. KÜÇÜK PARÇALAR
// ===========================================================================
// YAN BASAMAK: kapının altında, gövdenin dışına taşan sac basamak. Kabin
// tabanı 1.100'de; basamak 0.760'ta, yani insan boyuna göre gerçekten
// gerekli olan yerde. Kamyonun "yüksek" okunmasının ikinci sebebi bu —
// otomobilde ve SUV'da böyle bir parça yok.
kutular('basamak', [
    [1.560, 0.770, 1.190, 0.720, 0.045, 0.230],
    [1.560, 0.770, -1.190, 0.720, 0.045, 0.230],
    // basamağı gövdeye bağlayan iki kol
    [1.290, 0.935, 1.150, 0.055, 0.360, 0.055],
    [1.830, 0.935, 1.150, 0.055, 0.360, 0.055],
    [1.290, 0.935, -1.150, 0.055, 0.360, 0.055],
    [1.830, 0.935, -1.150, 0.055, 0.360, 0.055]
], C_METAL, { metal: 0.30, rough: 0.56 });

// AYNALAR: kabinin ön köşelerinden dışa uzanan kol + DÜŞEY dikdörtgen kasa.
// ⚠️ Aynalar direksiyonla DÖNMEZ, o yüzden teker gruplarının dışında,
// doğrudan modelGroup'un çocuğu.
// ⚠️ Kolun DİBİ gövde yüzeyinde olmalı. Kabinin yan yüzü x = 2.150,
// y = 2.29'da z ≈ 1.22 (kesitin C bölümünden); kol 1.145'ten başlayıp
// 1.385'e uzanıyor, yani havada duran parça yok. Kol x = 2.240'ta
// yazılmıştı ve orada yüzey 1.13'e çekildiği için 0.11 m boşluk kalıyordu.
// ⚠️ Aynalar kutuyu z'de 1.415'e taşıyor (gövde 1.250). Ölçek
// max(box.x, box.z) ile hesaplandığı ve x = 7.366 olduğu için ölçeğe
// etkisi YOK; yalnız gölge kapsamı genişliyor.
[1, -1].forEach(function (s, i) {
    kutular('ayna_kol_' + (i + 1), [
        [2.150, 2.290, s * 1.265, 0.070, 0.060, 0.240],
        [2.150, 2.000, s * 1.330, 0.055, 0.640, 0.055]
    ], C_SASI, { metal: 0.24, rough: 0.58 });
    const kasa = mesh(new THREE.BoxGeometry(0.075, 0.560, 0.170), '#2c3128',
                      { metal: 0.24, rough: 0.58, name: 'ayna_kasa_' + (i + 1) });
    kasa.position.set(2.136, 1.990, s * 1.330);
    modelGroup.add(kasa);
    const cam = mesh(new THREE.BoxGeometry(0.020, 0.480, 0.135), C_CAM,
                     { metal: 0.40, rough: 0.10, name: 'ayna_cam_' + (i + 1) });
    cam.position.set(2.090, 1.990, s * 1.330);
    modelGroup.add(cam);
});

// ÇATI: kabin tavanı boş bırakılmıyor. Haritanın ana bakışı yüksek eğimli
// (pitch 45-60) olduğu için çatı yan yüz kadar görünür bir yüzey; askeri
// kamyonun tavanında havalandırma kapağı ve kanca vardır.
(function () {
    const l = mesh(new THREE.BoxGeometry(0.520, 0.055, 0.560), '#3b4034',
                   { metal: 0.18, rough: 0.72, name: 'tavan_kapak' });
    l.position.set(1.700, 2.700, 0);
    modelGroup.add(l);
})();

// ===========================================================================
// 13. ÖLÇÜM ARAYÜZÜ — tezgâhın `kesit_olc.js`i için
// ===========================================================================
// `kesit_olc.js` model kodunun sonuna şunu ekliyor:
//   modelGroup.userData.API = { kesitPar, kesitNokta, nokta3, vY: vYukseklik }
// yani DOSYA KAPSAMINDA bu adlarda fonksiyon arıyor. Otomobil ve otobüs tek
// gövdeli oldukları için bunlar zaten oradaydı; kamyonda ikisi de `loftYap`
// fabrikasının içinde. Aracı DEĞİŞTİRMEK yerine (o zaman otomobil ve otobüs
// için de bozardım) burada dosya kapsamına köprü yazılıyor.
// x'e göre gövde seçiliyor: iki loft'un x aralıkları AYRIK (branda
// -3.590..0.280, kabin 0.760..3.560), sınır ikisinin ortası.
// ⚠️ `kesitNokta(P, v)` x almıyor; hangi gövdeye ait olduğunu bilmesi için
// son `kesitPar` çağrısının gövdesi hatırlanıyor. Ölçüm aracı ikisini hep
// arka arkaya çağırdığı için bu yeterli.
let _sonGovde = G_KABIN;
function _govdeSec(x) { return x >= (KAB_ARKA + BRA_ON) / 2 ? G_KABIN : G_BRANDA; }
function kesitPar(x) { _sonGovde = _govdeSec(x); return _sonGovde.kesitPar(x); }
function kesitNokta(P, v) { return _sonGovde.kesitNokta(P, v); }
function nokta3(x, w) { return _govdeSec(x).nokta3(x, w); }
function vYukseklik(x, y) { return _govdeSec(x).vYukseklik(x, y); }
