// Otobüs — modern 12 m alçak tabanlı şehir otobüsü (Mercedes Citaro /
// Otokar Kent sınıfı). Ulaşım temasının beşinci modeli.
//
// Gövde, `otomobil.js`teki MAKİNENİN AYNISIYLA kuruluyor: x ekseni boyunca
// istasyonlarda ayrı ayrı hesaplanan KAPALI KESİTLER birbirine dikiliyor
// (loft), her kesit parametresi kendi monoton kübik eğrisinden (PCHIP)
// okunuyor, paneller `yuzeyYama` ile gövde yüzeyine oturuyor, ön/arka yüz
// parçaları `yuzParca` ile kapağa extrude ediliyor. Sebep otomobilinkiyle
// aynı: sabit kesitli tek bir extrude, tavan kubbesini ve yanların içe
// yatmasını anlatamıyor.
//
// AMA OTOBÜS OTOMOBİL DEĞİL — kesitin karakteri baştan farklı kuruldu:
//   * YANLAR NEREDEYSE DİK. Otomobilde bel ile çatı arasında 24° tumblehome
//     var; burada 7.6°, ve o da yalnız cam bandının ÜSTÜNDE. Cam bandı
//     boyunca (y 1.35 → 2.45) yarı genişlik 1.2726'dan 1.268'e iniyor:
//     1.10 m yükseklikte 5 mm, yani gözle dümdüz. Şehir otobüsünün yan
//     yüzü levhadır, otomobilinki gibi heykel değil.
//   * ÇAMURLUK KEMERİ KÜÇÜK VE DİK. Kemer yarıçapı 0.62, lastik 0.521 →
//     açıklık 99 mm (otomobilde 84 mm ama lastik yarı boyda). Kemerin
//     eşiğe inişi 55 mm'de bitiyor: gövde tekerin üstünde neredeyse düz
//     iniyor.
//   * KARAKTER ÇİZGİSİ YOK. Otomobilde kesite işlenmiş bir pres hattı var;
//     otobüste yan yüz gerçekten düz bir paneldir, çizgi rolünü CAM BANDI
//     ile alttaki koyu bordür şeridi görüyor. Kesite kavis eklemek yalnız
//     yanlış bir "şişkin" gövde üretirdi.
//
// GERÇEK ÖLÇÜLER (metre):
//   uzunluk 12.00 · genişlik 2.55 · yükseklik 3.10 (klima hariç)
//   dingil arası 5.90 · ön aks +3.30 · arka aks -2.60
//   ön çıkma 2.70 · arka çıkma 3.40 · taban (zemin) 0.34
//   teker yarıçapı 0.478 · lastik genişliği 0.275
//   ön iz ±1.05 (tekil) · arka İKİZ: ±1.05 ve ±0.73
//   cam bandı: alt 1.35 · üst 2.45
//
// ⚠️ TEKER YARIÇAPI 0.521'DEN 0.478'E DÜZELTİLDİ. Görev tanımındaki
// "275/70 R22.5 → çap 1.043" aritmetik olarak yanlıştı: 22.5 inç jant
// 571.5 mm, yanak 275x0.70 = 192.5 mm, çap = 571.5 + 2x192.5 = 956.5 mm,
// yarıçap 0.478. (1.043 çapı 295/80 R22.5'e denk geliyor.) Doğrusu
// kuruldu; `_WHEELS.radius` DA 0.478 olmak zorunda — motor kat edilen
// yolu yarıçapa bölerek yuvarlanmayı hesapladığı için gövdeyle tutmazsa
// teker yolla uyumsuz döner.
// Sonuç: aks 43 mm alçaldı, gövde de onunla birlikte indi (ESIK 0.295 →
// 0.252, alt taban plakası 0.275 → 0.232). Çatı 3.10'da KALDI — gerçek
// alçak tabanlı otobüste süspansiyon zemini 0.34'te tutar, lastik değişse
// bile tavan yüksekliği aynı kalır (Citaro: lastik 0.956 çap, zemin 0.34,
// yükseklik 3.12). Cam bandı da 1.35/2.45'te kaldı.
//
// KUTU (ÖLÇÜLDÜ): 12.056 x 3.191 x 2.965. x'teki 56 mm fazlalık tampon ve
// far parçalarının kapağı geçen payı; y'deki 91 mm çatıdaki klima ünitesi
// (gövdenin kendisi tam 3.10); z ise AYNALARLA birlikte (gövde 2.55).
//
// AĞIRLIK: 84 mesh / 12420 üçgen. Otomobil 12968, motosiklet 5808. Gövde
// tek parça bir loft kabuğu (62 istasyon x 38'lik halka = 4712 üçgen) ama
// otobüs kesiti otomobilinkinden BASİT olduğu için birim başına daha ucuz:
// yan yüz düz, örnekler çatı kubbesine ve alt yanağa toplandı. Sık istasyon
// yalnız kemer ağızlarında; iki aks arasındaki 4.5 m'de kesit hiç
// değişmediği için orada beş istasyon yetiyor.
//
// PARÇALAR (Studio3D bu adları arar, DEĞİŞTİRME):
//   teker_on_1/2, teker_arka_1..4 → GRUP. ALTISI da yuvarlanır; yalnız ön
//                                   ikisi _WHEELS.front ile direksiyon kırar.
//   govde, motor_kapak            → RENK ALIR (_TINT).
//   cam_*, kapi_*                 → koyu cam/kapı, renk almaz.
//
// ⚠️ KAPILAR İKİ TARAFTA DA VAR — BİLEREK, kusur değil. Gerçek otobüste
// kapılar yalnız kaldırım tarafındadır; buna rağmen simetrik kuruldu çünkü
// harita modeli soldan sağa AYNALIYOR (OKU.md) ve model haritada serbestçe
// dönüyor: tek taraflı kapı, bakışların yarısında bomboş bir yan yüz —
// yani kapalı kasa kamyon — demekti. Okunabilirlik gerçekçiliği yeniyor.
// (Furkan'ın kararı, 2026-09-01.)
//
// ⚠️ GÜZERGÂH TABELASINA YAZI KONMADI. Harita modeli soldan sağa aynalıyor
// (OKU.md'deki ölçülmüş tuzak: det(projection) negatif); taksinin tepe
// lambasında "IXAT" çıkmıştı. Aynalanarak kurulan yazı işi burada bedeli
// hak etmiyor — boş aydınlık panel zaten gerçekçi, gerçek otobüslerin
// tabelası uzaktan da okunmaz.
//
// YÖN: burun +x, üst +y, taban y=0. Ölçüler gerçek metre.

// ===========================================================================
// 0. RENKLER
// ===========================================================================
const C_GOVDE   = '#2f6fb0';   // _TINT varsayılanı
const C_CAM     = '#161d26';
const C_KAPI    = '#0d1117';   // kapı kanadı — camdan bir tık KOYU olsun ki
                               // cam bandının içinden geçerken ayırt edilsin
const C_RAY     = '#69727c';   // kapı rayı / kanat kenarı
const C_DIREK   = '#0f1216';
const C_LASTIK  = '#1b1b1e';
const C_JANT    = '#aeb5bd';
const C_JANT_K  = '#5f666e';
// ⚠️ KROM DİYE metalness 0.85-0.95 VERİLMEZ. MeshStandardMaterial'da
// metalness=1 difüz bileşeni sıfırlar; sahnede environment map olmadığı için
// metal parça YALNIZ doğrudan ışığın yansımasını gösterir ve açı tutmayan
// yüzler kapkara çıkar. Düşük metalness + açık taban rengi hem parlar hem
// gövdeyi okutur.
const C_KROM    = '#b9c1ca';
const KROM_MAL  = { metal: 0.45, rough: 0.26 };
const C_DIP     = '#0d0f12';   // davlumbaz, gölgeli oyuklar
const C_FASYA   = '#2b2f35';   // boyasız tampon
const C_FAR     = '#c9d6e4';
const C_FAR_IC  = '#3b434c';
const C_SINYAL  = '#c1832a';
const C_STOP    = '#a82f27';
const C_STOP_K  = '#5a1512';
const C_PLAKA   = '#dde2e8';
// Işıklı güzergâh tabelası. LED tabela gerçekte koyu bir panelin üstünde
// kehribar yazıdır; yazı KONULAMADIĞI için (ayna tuzağı) panelin kendisi
// donuk kehribara boyandı — uzaktan "ışıklı tabela" okuyan tek işaret bu.
const C_TABELA  = '#8c7524';

// ===========================================================================
// 1. TEMEL ÖLÇÜLER
// ===========================================================================
const UZUN      = 6.00;     // yarı uzunluk → 12.00 m
const PAH       = 0.24;     // burun/kuyruk yuvarlatma boyu (x ekseninde)
const PAH_UC    = 0.955;    // pahın sonundaki kesit ölçeği. Otomobilde 0.92
                            // idi; otobüste 0.955 çünkü ön/arka yüz
                            // NEREDEYSE DİKEY olmalı. 0.92 denendi ve
                            // bırakıldı: burun bir minibüs gibi sivriliyor,
                            // ön cam sığmayacak kadar daralıyordu.
const R_TEKER   = 0.478;    // 275/70 R22.5 → çap 956.5 mm (bkz. başlıktaki
                            // düzeltme). _WHEELS.radius ile BİREBİR aynı
                            // olmak zorunda — yuvarlanma hızını o belirliyor.
const R_JANT    = 0.286;    // 22.5 inç jant → çap 571.5 mm; yanak 0.192 —
                            // kamyon lastiğinin gerçek oranı (jant/çap %60)
const AKS_Y     = R_TEKER;
const ON_X      = 3.30;     // ön çıkma 2.70
const ARKA_X    = -2.60;    // arka çıkma 3.40 → dingil arası 5.90
const AKS_X     = [ARKA_X, ON_X];
const IZ_Z      = 1.05;     // dış teker merkezi (ön tekil, arka ikizin dışı)
const IKIZ_Z    = 0.73;     // arka ikizin İÇ tekeri
const LASTIK_GEN = 0.275;
const KEMER_R   = 0.595;    // kemer yarıçapı — lastikten 117 mm açık, ağzın
                            // tepesi yerden 1.073. Citaro'nun kemer ağzı
                            // 1.05-1.10 arasındadır.
const KEMER_ETEK = 0.075;   // kemer uçlarının eşiğe inişi. Otomobilde 0.105;
                            // burada daha kısa çünkü otobüs gövdesi tekerin
                            // yanında DİK iner, kavisli bir etek atmaz.
                            // ⚠️ 0.055 denendi ve bırakıldı: ağzın ucundaki
                            // 226 mm'lik düşüş 55 mm'ye sıkışınca istasyon
                            // örneklemesi yetişemiyor, kenar merdiven gibi
                            // çıkıyordu.
const BOMBE     = 0.008;    // cam bandı üstündeki yüzeyin dışa şişmesi
const US_YANAK  = 0.42;     // alt yanak süper-elips üssü. Küçük değer =
                            // eşikten hemen açılıp DİKLEŞEN yanak. Otobüste
                            // alt gövde 40 mm içeri tuck yapıp dikleşiyor.
const US_CATI   = 0.62;     // çatı kubbesi süper-elips üssü. Otomobilde 0.77
                            // (yuvarlak tavan); burada 0.62 → ortada DÜZ,
                            // kenarda ~0.30 yarıçaplı köşe. Şehir otobüsünün
                            // çatısı hafif kubbeli, yuvarlak değil.
const NV        = 20;       // yarı kesitteki örnek sayısı (halka 2*NV-2 = 38)
const CAM_ALT   = 1.35;     // cam bandı alt kenarı
const CAM_UST   = 2.45;     // cam bandı üst kenarı
const ZEMIN     = 0.34;     // alçak taban yolcu zemini — kapı eşiği buna göre

// Kapılar. Ön kapı ön aksın HEMEN ARKASINDA: kemerin etki alanı
// 3.30 - 0.675 = 2.625'te bitiyor, kapı 2.58'de bitiyor → 45 mm pay.
const KAPI_ON   = [1.78, 2.58];   // tek kanat, 0.80 m
const KAPI_ORTA = [-0.85, 0.45];  // ÇİFT kanat, 1.30 m, gövdenin ortasında
const KAPI_ALT  = 0.33;           // eşik — alçak taban zemini (0.34) hizası
const KAPI_UST  = CAM_UST;

// Kesit parametresi v'nin bölüm sınırları. Bir kesit beş parçadan oluşuyor:
//   A [0 .. VA]   taban (kemer ağzının dudağı ya da eşik altı)
//   B [VA .. VB]  alt yanak: tabandan en geniş noktaya (eşik kıvrımı)
//   C [VB .. VC]  omuz → cam bandı üstü: DİK yan yüz
//   D [VC .. VD]  tumblehome — yalnız cam bandının üstünde, 7.6°
//   E [VD .. 1]   çatı kubbesi, orta hatta kapanır
// ⚠️ Sınırlar otomobilinkinden BAŞKA. Otobüste eğrilik iki yerde toplanmış:
// alt yanak kıvrımı ve ÇATI. Aradaki 1.26 m'lik dik duvar düz bir çizgi,
// örnek harcamasın diye ona az, çatıya (0.34 → 6.5 örnek) çok pay verildi.
const VA = 0.030, VB = 0.240, VC = 0.520, VD = 0.660;

// ===========================================================================
// 2. MONOTON KÜBİK EĞRİ (PCHIP)
// ===========================================================================
// Catmull-Rom otomobilde denendi ve BIRAKILDI: eğimin hızla değiştiği
// yerlerde taşma yapıp tavan çizgisini kaputun üstüne tümsek attırıyordu.
// Fritsch-Carlson tegetleri yerel uç noktalarda sıfırlanır → taşma yok.
// Otobüste taşma daha da pahalı olurdu: 11 m'lik düz bir çatı çizgisinin
// ortasında 2 cm'lik bir tümsek yandan bakışta hemen okunur.
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
// ÇATI ORTA HATTI. 3.10'da DÜMDÜZ; yalnız son 0.6 m'de burun/kuyruk çatı
// köşesi için iniyor. Otomobilde bu eğri aracın bütün profilini (kaput, ön
// cam, tavan, bagaj) taşıyordu; otobüste tek işi düz çatıyı düz tutmak.
const Y_UST = egriYap([
    [-6.00, 2.86], [-5.86, 2.96], [-5.68, 3.03], [-5.40, 3.072],
    [-4.90, 3.092], [-2.00, 3.100], [ 2.00, 3.100], [ 4.90, 3.092],
    [ 5.40, 3.072], [ 5.68, 3.03], [ 5.86, 2.96], [ 6.00, 2.86]
]);
// EŞİK: gövdenin alt kenarı. Alçak tabanlı otobüste çok alçak (0.252) ve
// uçlarda yalnız 57 mm kalkıyor — şehir otobüsünün yaklaşma açısı yok,
// tamponu neredeyse yere kadar iner.
// ⚠️ Bütün eğri, teker yarıçapı 0.521'den 0.478'e düzeltilince 43 mm
// AŞAĞI kaydırıldı: aks alçalınca gövde de onunla iner. Göz kararı
// düzeltilmedi, tek tek çıkarıldı. Zemin (0.34) ve çatı (3.10) yerinde
// kaldı; değişen yalnız gövdenin yerden yüksekliği.
const ESIK = egriYap([
    [-6.00, 0.309], [-5.78, 0.275], [-5.40, 0.257], [-4.60, 0.252],
    [ 4.60, 0.252], [ 5.40, 0.257], [ 5.78, 0.275], [ 6.00, 0.309]
]);
// EN GENİŞ NOKTANIN YÜKSEKLİĞİ. Cam bandının hemen altında (1.30): gövde
// eşikten buraya kadar 40 mm açılıyor, buradan yukarısı dik.
const Y_OMUZ = egriYap([
    [-6.00, 1.22], [-5.50, 1.28], [-4.80, 1.30],
    [ 4.80, 1.30], [ 5.50, 1.28], [ 6.00, 1.22]
]);
// ÇATI KUBBESİNİN DERİNLİĞİ (yU - yC). Ortada 0.22, uçlarda daha derin:
// burun/kuyruk çatı köşesi orada daha çok yuvarlanıyor.
const KUBBE = egriYap([
    [-6.00, 0.34], [-5.70, 0.28], [-5.20, 0.235], [-4.40, 0.22],
    [ 4.40, 0.22], [ 5.20, 0.235], [ 5.70, 0.28], [ 6.00, 0.34]
]);
// EN GENİŞ YARI GENİŞLİK — 1.275 (2.55 m yasal sınır). Otomobilde aksların
// üstünde şişip kalça yapıyordu; OTOBÜSTE ŞİŞME YOK, gövde boydan boya aynı
// genişlikte. Yalnız burun ve kuyruk köşesi planda yuvarlanıyor.
const W_OMUZ = egriYap([
    [-6.00, 1.160], [-5.86, 1.200], [-5.66, 1.240], [-5.36, 1.265],
    [-4.90, 1.273], [-3.00, 1.275], [ 3.00, 1.275], [ 4.90, 1.273],
    [ 5.36, 1.265], [ 5.66, 1.240], [ 5.86, 1.200], [ 6.00, 1.160]
]);
// TUMBLEHOME'UN BAŞLADIĞI YÜKSEKLİK = cam bandının üst kenarı (2.46).
// Otobüste yan yüz tam buraya kadar dik; çatı kavisi burada başlıyor.
const Y_BEL = egriYap([
    [-6.00, 2.33], [-5.70, 2.41], [-5.20, 2.448], [-4.40, 2.460],
    [ 4.40, 2.460], [ 5.20, 2.448], [ 5.70, 2.41], [ 6.00, 2.33]
]);
// Cam bandı üstünde genişliğin omuzdan ne kadar içeri çekildiği. Ortada
// 7 mm: 1.16 m boyunca 7 mm, yani 0.3° — dik duvar.
const D_BEL = egriYap([
    [-6.00, 0.052], [-5.60, 0.020], [-4.80, 0.007],
    [ 4.80, 0.007], [ 5.60, 0.020], [ 6.00, 0.052]
]);
// ÇATI KENARI GENİŞLİĞİ. 1.212 → cam bandı üstündeki 1.268'den 7.6°
// tumblehome. Otomobilde 24° idi; otobüste o kadar yatırmak gövdeyi
// otobüs olmaktan çıkarır.
const W_CATI = egriYap([
    [-6.00, 1.020], [-5.80, 1.075], [-5.50, 1.145], [-5.10, 1.190],
    [-4.60, 1.208], [-3.00, 1.212], [ 3.00, 1.212], [ 4.60, 1.208],
    [ 5.10, 1.190], [ 5.50, 1.145], [ 5.80, 1.075], [ 6.00, 1.020]
]);
// EŞİK GENİŞLİĞİ (kesitin en altı) — omuzdan 40 mm içeride.
const W_ESIK = egriYap([
    [-6.00, 1.115], [-5.80, 1.165], [-5.50, 1.208], [-5.00, 1.230],
    [-4.40, 1.235], [ 4.40, 1.235], [ 5.00, 1.230], [ 5.50, 1.208],
    [ 5.80, 1.165], [ 6.00, 1.115]
]);

// ===========================================================================
// 3. KESİT
// ===========================================================================
// Çamurluk kemerinin üst kenarı: lastikle EŞ MERKEZLİ daire (99 mm açıklık
// her yerde aynı) ve uçlarında çeyrek elipsle eşiğe iniyor. Yarım daire tek
// başına bırakılsaydı uçlarda 0.226'lık dikey duvar kalırdı.
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
    yA = Math.min(yA, yO - 0.030);                       // taban omuzun ALTINDA
    // ⚠️ Otomobilde bu tavan 0.64 idi (bel hattı kabinin ortasından geçsin
    // diye). Otobüste cam bandı gövdenin ÜST ÜÇTE BİRİNE kadar çıkıyor;
    // 0.64 ile burun/kuyruk kesitinde bandın üstü kırpılıyor ve cam bandı
    // uçlarda aşağı kayıyordu. 0.92 ile hiçbir istasyonda kırpılmıyor.
    let yB = Math.min(Y_BEL(x), yO + (yU - yO) * 0.92);
    let yC = Math.max(yB + 0.022, yU - KUBBE(x));
    const wO = W_OMUZ(x);
    const wB = Math.max(0.03, wO - D_BEL(x));
    let wC = Math.min(W_CATI(x), wB - 0.008);
    // Kemer ağzı açıldıkça kesitin tabanı eşikten dışa, kemer dudağına kadar
    // genişliyor. Otomobilde bölen 0.42 ve pay `wO - 0.026` idi; otobüste
    // kemer dudağı gövdenin yan yüzüyle NEREDEYSE FLUSH (10 mm), çünkü
    // otobüste çamurluk çıkıntısı yoktur.
    const pay = Math.min(1, Math.max(0, (yA - e) / 0.50));
    const wRock = W_ESIK(x);
    let wA = wRock + (wO - 0.010 - wRock) * pay;
    wA = Math.min(wA, wO - 0.008);

    // Burun/kuyruk yuvarlatması: son PAH kadarlık bölümde kesit kendi
    // merkezine doğru daire yayıyla küçülüyor → tampon köşeleri hem planda
    // hem düşeyde yuvarlanıyor. Düz bir kapak keskin köşe bırakırdı.
    const uc = Math.abs(x) - (UZUN - PAH);
    if (uc > 0) {
        const f = PAH_UC + (1 - PAH_UC) * Math.sqrt(Math.max(0, 1 - (uc / PAH) * (uc / PAH)));
        const yc = (yA + yU) / 2;
        yA = yc + (yA - yc) * f; yO = yc + (yO - yc) * f;
        yB = yc + (yB - yc) * f; yC = yc + (yC - yc) * f; yU = yc + (yU - yc) * f;
        return { yA: yA, wA: wA * f, yO: yO, wO: wO * f, yB: yB, wB: wB * f,
                 yC: yC, wC: wC * f, yU: yU };
    }
    return { yA: yA, wA: wA, yO: yO, wO: wO, yB: yB, wB: wB,
             yC: yC, wC: wC, yU: yU };
}

// Yarı kesitin v parametresindeki noktası → [z, y]. v: 0 = taban ortası,
// 1 = tepe ortası.
function kesitNokta(P, v) {
    if (v <= VA) return [P.wA * (v / VA), P.yA];
    if (v <= VB) {
        // Süper-elips çeyreği: (wA,yA) köşesinden çıkıp (wO,yO)'da DİKEY
        // tegetle bitiyor. Üs 0.42 olduğu için gövde eşikten hemen açılıp
        // dikleşiyor — otobüsün alt kenarındaki hafif tuck bu.
        const t = (v - VA) / (VB - VA), th = t * Math.PI / 2;
        return [P.wA + (P.wO - P.wA) * Math.pow(Math.sin(th), US_YANAK),
                P.yO - (P.yO - P.yA) * Math.pow(Math.cos(th), US_YANAK)];
    }
    if (v <= VC) {
        // DİK YAN YÜZ. Otomobilde burada karakter çizgisi (pres hattı)
        // vardı; otobüste YOK — yan yüz gerçekten düz bir paneldir ve
        // kesite kavis işlemek şişkin, otobüs olmayan bir gövde üretiyordu.
        // Çizgi işini cam bandı ile alttaki koyu bordür görüyor.
        const t = (v - VB) / (VC - VB);
        const e = t * t * (3 - 2 * t);
        return [P.wO + (P.wB - P.wO) * e, P.yO + (P.yB - P.yO) * t];
    }
    if (v <= VD) {
        // Tumblehome: cam bandı üstü ile çatı kenarı arasında ikinci derece
        // Bezier. Denetim noktası dışa itiliyor → yüzey hafif bombeli.
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
    // yay köşe köşe çıkar. İki aks arasında ise kesit HİÇ değişmiyor
    // (bütün eğriler orada düz), sık örneklemek yalnız üçgen harcar —
    // otobüste bu bölge 4.5 m, otomobildekinin iki katı.
    // ⚠️ Kemer istasyonları akstan olan UZAKLIĞA göre üretiliyor, elle
    // yazılmıyor: kemer yarıçapı ya da eteği değişince liste kendiliğinden
    // doğru yere kayıyor. Dizi ±KEMER_R'de (0.595) SIKLAŞIYOR — dairenin
    // türevi orada dikey, seyrek örneklenirse ağzın ucu merdiven gibi
    // çıkar. İlk kurulumda istasyonlar elle yazılıydı ve kemer yarıçapı
    // 0.620'den 0.595'e inince hepsi 25 mm kaymış oldu.
    const kemerIst = function (ax) {
        return [-0.670, -0.630, -0.612, -0.595, -0.578, -0.510, -0.360,
                -0.180, 0, 0.180, 0.360, 0.510, 0.578, 0.595, 0.612,
                 0.630, 0.670].map(d => +(ax + d).toFixed(4));
    };
    const orta = [].concat(
        [-5.76, -5.70, -5.62, -5.52, -5.38, -5.20, -4.95, -4.60, -4.15],
        kemerIst(ARKA_X),                     // -3.270 .. -1.930
        [-1.50, -0.60, 0.50, 1.50, 2.05],
        kemerIst(ON_X),                       //  2.630 ..  3.970
        [4.35, 4.70, 5.00, 5.22, 5.40, 5.54, 5.66, 5.76]
    );
    const pahlar = [0.26, 0.50, 0.71, 0.88, 1.0].map(k => UZUN - PAH + PAH * k);
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
    // ortalasaydı otobüsün dik ön yüzü ile yan yüzü arasındaki köşe
    // yumuşayıp burun balon gibi görünürdü.
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
    modelGroup.add(mesh(geo, C_GOVDE, { metal: 0.40, rough: 0.36, name: 'govde' }));
})();

// ===========================================================================
// 5. YÜZEYE OTURAN PANELLER
// ===========================================================================
// Cam bandı, kapılar, bordür, kemer kenarı — hepsi aynı yardımcıdan çıkıyor:
// gövde yüzeyi x1..x2 ve w1..w2 aralığında yeniden örnekleniyor ve normal
// boyunca `disari` kadar öteleniyor. Böylece panel gövdenin kavisine BİREBİR
// oturuyor; düz bir levha olsaydı burun köşesinde yüzeyin içine girerdi.
// Bant biçimi: [x1, x2, a1, a2]           → a, kesit parametresi w.
//              [x1, x2, y1, y2, taraf]    → a YÜKSEKLİK; her x'te o
//              yüksekliğin w'si aranıyor. Cam bandı ve kapılar YATAY bir
//              çizgiyi izliyor, kesit topolojisini değil: sabit w ile
//              yazılsalardı burun köşesinde yukarı kayarlardı.
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
    // Kalınlıksız paneller GÖLGE DÜŞÜRMEZ: gövdeye 5-20 mm mesafede
    // duruyorlar, gölge haritasında kendi gölgelerini gövdenin üstüne basıp
    // benek (acne) üretiyorlardı.
    m.castShadow = false;
    modelGroup.add(m);
    return m;
}

// ---- CAM BANDI — otobüsü otobüs yapan ana işaret --------------------------
// Gövdeyi boydan boya kesen koyu şerit. Haritada 40-60 piksele düşen bir
// aracın otobüs olduğunu söyleyen tek şey bu banttır: siluet zaten bir kutu,
// ayırt eden şey kutunun üst yarısını boydan boya kesen koyu çizgi.
//
// ⚠️ İKİ AYRI ÇAĞRI, tek çağrı DEĞİL. Bandın gövde boyu bölümü 10.85 m,
// burun köşesi ise 0.435 m içinde kesitin tamamen değiştiği yer. Tek
// çağrıda burun köşesi tek adımın içinde kalıyor ve panel köşeyi
// kirişleyip gövdenin içine giriyordu.
//
// ⚠️ VE İKİ BANT İKİ FARKLI BİÇİMDE yazılıyor — burun bandı YÜKSEKLİK
// biçiminde DEĞİL, w (kesit parametresi) biçiminde. Sebep ölçüldü: burun
// bandı da yükseklik biçiminde (1.35 → 2.45) kurulmuştu ve önden çizimde
// üst kenarı YIRTIK çıkıyordu — testere dişi gibi gövdenin içine girip
// çıkıyordu. Kök sebep: sabit y=2.45, x=5.55'te gövdenin dik yan yüzünde
// (yB=2.444), x=5.985'te ise ÇATI KAVİSİNİN içinde kalıyor (yB=2.297,
// yC=2.478). Yani bandın üst kenarı 43 cm içinde yüzeyin tamamen başka
// bir bölgesine geçiyor ve panel oradaki hızlı eğriliği kirişliyor.
// w biçiminde kenarlar kesit TOPOLOJİSİNİ izliyor: üst kenar çatı kavisi
// alçaldıkça kendiliğinden alçalıyor (burunda y≈2.30'a iniyor) — gerçek
// sarmalayan ön camın yaptığı da tam bu.
// w değerleri x=5.55'te ÖLÇÜLDÜ (kesit_olc.js --z 5.55 1.35 2.45):
// y=1.35 → w=0.742, y=2.45 → w=0.471. İki bant o noktada birebir aynı
// kenarı paylaşıyor, dikiş yok.
const W_CAM_ALT = 0.742, W_CAM_UST = 0.471;
[1, -1].forEach(function (s, i) {
    yuzeyYama('cam_bant_' + (i + 1),
              [[5.55, -5.30, CAM_ALT, CAM_UST, s]], 30, 3, 0.012, C_CAM,
              { metal: 0.35, rough: 0.18 });
    // Sarmalayan bölüm: burun köşesini dolanıyor. Modern şehir otobüsünün
    // ön camı A direğini dönüp yan yüze taşar; bu bant o taşmayı veriyor.
    yuzeyYama('cam_kose_' + (i + 1),
              [[5.55, 5.985, s * W_CAM_ALT, s * W_CAM_UST]], 9, 6, 0.012,
              C_CAM, { metal: 0.35, rough: 0.18 });
});

// ---- KAPILAR --------------------------------------------------------------
// Ön kapı ön aksın hemen arkasında (tek kanat), orta kapı gövdenin ortasında
// ve ÇİFT KANAT genişliğinde. İkisi de cam bandının altına inip eşiğe kadar
// sürüyor — alçak tabanlı otobüsün kapısı zemine kadar iner, basamak yoktur.
//
// ⚠️ KAPILAR İKİ TARAFTA DA VAR. Gerçek otobüste kapılar yalnız kaldırım
// tarafındadır. Buna rağmen iki tarafa da konuldu, sebebi ölçülmüş: harita
// modeli soldan sağa AYNALIYOR (OKU.md), yani model uzayındaki +z tarafı
// üründe hangi tarafa düşeceği kullanıcının döndürmesine kalıyor. Tek
// taraflı kapı, bakışların yarısında bomboş bir yan yüz (kamyonet/kapalı
// kasa) demekti.
[1, -1].forEach(function (s, i) {
    yuzeyYama('kapi_' + (i + 1), [
        [KAPI_ON[0], KAPI_ON[1], KAPI_ALT, KAPI_UST, s],
        [KAPI_ORTA[0], KAPI_ORTA[1], KAPI_ALT, KAPI_UST, s]
    ], 3, 8, 0.016, C_KAPI, { metal: 0.25, rough: 0.30 });
});
// Kanat kenarları (ray/lastik fitil). Bunlar olmadan kapı, cam bandının
// içinde kaybolan bir ton farkından ibaret kalıyordu; açık gri dikmeler
// kapıyı gövdeden ayıran tek şey. Orta kapının ORTASINDAKİ dikme, çift
// kanadın birleşme yeri.
(function () {
    const dikmeler = [];
    [1, -1].forEach(function (s) {
        [KAPI_ON[0], KAPI_ON[1], KAPI_ORTA[0], KAPI_ORTA[1],
         (KAPI_ORTA[0] + KAPI_ORTA[1]) / 2].forEach(function (kx) {
            dikmeler.push([kx - 0.020, kx + 0.020, KAPI_ALT, KAPI_UST, s]);
        });
    });
    yuzeyYama('kapi_dikme', dikmeler, 1, 9, 0.021, C_RAY,
              { metal: 0.35, rough: 0.42 });
})();

// ---- ALT BORDÜR -----------------------------------------------------------
// Gövde boyunca süren koyu şerit (gerçekte darbe bandı). Otomobildeki
// karakter çizgisinin otobüsteki karşılığı: kesite kavis işlemek yerine
// düz yüzeye YATAY bir çizgi koyuyor, ve renk değişse bile koyu kalıyor.
// ⚠️ ÜÇ AYRI BANT, boydan boya TEK bant DEĞİL. Bant yükseklik biçiminde
// yazılıyor (`taraf`), yani her x'te 0.66 ve 0.72 yüksekliklerinin w'si
// aranıyor. Kemer ağızlarında kesitin TABANI 1.141'e çıkıyor, yani 0.66
// kesitin altında kalıyor; ikili arama v=0'a düşüyor ve bandın iki kenarı
// da kemer dudağının ORTA HATTINA (z≈0) çöküyordu — gövdenin içinde
// yassı, dejenere üçgenler. Dışarıdan görünmüyordu ama gölge haritasında
// duruyordu. Bant kemerlerin etki alanını (ön 2.625..3.975, arka
// -3.275..-1.925) atlıyor.
[1, -1].forEach(function (s, i) {
    yuzeyYama('bant_alt_' + (i + 1), [
        [ 5.70,  4.00, 0.66, 0.72, s],
        [ 2.60, -1.90, 0.66, 0.72, s],
        [-3.30, -5.70, 0.66, 0.72, s]
    ], 10, 1, 0.010, '#1c2027', { metal: 0.15, rough: 0.70 });
});

// ---- ÇAMURLUK KEMERİ KUŞAĞI (§7'de, extrude ile) --------------------------
// ⚠️ Kemer ağzının kenarı ÖNCE `yuzeyYama` ile w cinsinden bir şerit olarak
// kurulmuştu (otomobildeki `kemer_kenar` deseni) ve GÖRÜNMEDİĞİ ÖLÇÜLDÜ.
// Sebep: kesitin v ∈ [0, VA] bölümü kemer ağzının TAVANI, yani AŞAĞI bakan
// yatay bir raf (aks istasyonunda z 0'dan 1.263'e kadar, 2.53 m genişliğinde).
// Şerit o rafın içine düşüyor, dışarıdan hiç görünmüyordu. Ayrıca sabit v
// aralığı, kemerin tepesinde 5 mm'lik, eşikte 128 mm'lik bir bant veriyor —
// aynı şerit iki uçta iki başka şey oluyor.
// Doğrusu: ağzın kenarını gövde YÜZEYİNDE değil, gövdenin DIŞINDA duran
// gerçek bir kuşakla (extrude halka dilimi) çizmek. Gerçek şehir otobüsünde
// de kemer ağzının kenarında siyah plastik bir kuşak vardır. Kurulumu §7'de,
// davlumbazın hemen yanında.

// ---- YAN İŞARET LAMBALARI -------------------------------------------------
// Uzun araçlarda zorunlu kehribar yan işaretler. Küçük ama düz yan yüze
// ölçek veriyor: haritada otobüsün 12 m olduğunu söyleyen ayrıntı.
(function () {
    const isaret = [];
    [1, -1].forEach(function (s) {
        [4.60, -1.55, -4.90].forEach(function (mx) {
            isaret.push([mx - 0.075, mx + 0.075, 1.06, 1.16, s]);
        });
    });
    yuzeyYama('yan_isaret', isaret, 1, 1, 0.011, C_SINYAL,
              { metal: 0.2, rough: 0.35 });
})();

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

// ---- ÖN YÜZ ---------------------------------------------------------------
// ⚠️ Koordinatlar GÖZ KARARI DEĞİL, kapağın ÖLÇÜLMÜŞ profilinden çıkarıldı
// (node kesit_olc.js models/otobus.js --z 6.00 ...). Kapak y 0.408..2.804
// arasında; yarı genişlik y=0.45'te 1.096 · 0.90'da 1.108 (en geniş) ·
// 1.55'te 1.097 · 2.05'te 1.065 · 2.40'ta 1.015 · 2.50'de 0.974 ·
// 2.60'ta 0.961 · 2.70'te 0.876. Her parça bu zarfın İÇİNDE, etrafında
// boyalı kenar kalacak kadar payla duruyor.
//
// ⚠️ `yuzParca` geometriyi `x`ten `x+derinlik`e uzatıyor. Her parçanın
// `x + derinlik`i ön kapağı (x=6.00) 5-30 mm geçmeli; yoksa parça havada
// kalır ve kutu ölçüsü şişer. Ön yüzdeki en ileri nokta 6.028.
//
// Şehir otobüsünün yüzü ÜÇ KATLIDIR ve otomobilinkinin tersine ızgara
// değil CAM baskındır: altta boydan boya tampon + far bandı, ortada dev
// dik ön cam, üstte güzergâh tabelası.

// Tampon: boydan boya, alçak. Şehir otobüsünün yaklaşma açısı derdi yok.
yuzParca('tampon_on',
         [[-1.035, 0.400], [1.035, 0.400], [1.035, 0.800], [-1.035, 0.800]],
         0.090, 5.955, 0.062, C_FASYA, { metal: 0.15, rough: 0.70 });
// Tamponun içindeki koyu hava girişi (motor değil, klima yoğuşturucusu —
// arka motorlu otobüste ön ızgara soğutma için değildir).
yuzParca('on_hava',
         [[-0.620, 0.460], [0.620, 0.460], [0.620, 0.705], [-0.620, 0.705]],
         0.045, 5.975, 0.048, '#1b1f25', { metal: 0.3, rough: 0.62, flat: true });
yuzParca('plaka_on',
         [[-0.225, 0.495], [0.225, 0.495], [0.225, 0.640], [-0.225, 0.640]],
         0.012, 5.990, 0.038, C_PLAKA, { metal: 0.05, rough: 0.85 });

// Far grupları: dikdörtgen, dış köşelerde, tamponun HEMEN ÜSTÜNDE. Otobüste
// farlar otomobildeki gibi çamurluğa dolanmaz — ön yüz dikey olduğu için
// yüzün üstünde düz durur.
[1, -1].forEach(function (s, i) {
    yuzParca('far_' + (i + 1),
             [[s * 0.600, 0.880], [s * 1.030, 0.880], [s * 1.030, 1.225],
              [s * 0.600, 1.225]],
             0.045, 5.955, 0.062, C_FAR_IC, { metal: 0.5, rough: 0.30 });
    yuzParca('far_lens_' + (i + 1),
             [[s * 0.625, 0.905], [s * 0.870, 0.905], [s * 0.870, 1.200],
              [s * 0.625, 1.200]],
             0.032, 5.982, 0.042, C_FAR, { metal: 0.1, rough: 0.10 });
    // Sinyal, far grubunun DIŞ ucunda — kehribar dilim.
    yuzParca('sinyal_' + (i + 1),
             [[s * 0.890, 0.905], [s * 1.008, 0.905], [s * 1.008, 1.200],
              [s * 0.890, 1.200]],
             0.026, 5.982, 0.042, C_SINYAL, { metal: 0.2, rough: 0.28 });
});
// İki far arasındaki orta panel: koyu, yatay çıtalı.
yuzParca('izgara_on',
         [[-0.545, 0.880], [0.545, 0.880], [0.545, 1.225], [-0.545, 1.225]],
         0.050, 5.968, 0.050, '#191d23', { metal: 0.3, rough: 0.60, flat: true });
yuzParca('izgara_cita',
         [[-0.500, 1.030], [0.500, 1.030], [0.500, 1.072], [-0.500, 1.072]],
         0.014, 5.995, 0.030, '#576069', { metal: 0.35, rough: 0.40 });

// ÖN CAM: dik, büyük, köşelerde yana dolanan. Yüzün yarısını kaplıyor.
// Yana dolanma işini `cam_kose_*` yüzey yaması yapıyor (bkz. §5): burada
// yalnız düz kapak bölümü var, ikisi burun köşesinde buluşuyor.
// ⚠️ Üst kenar alt kenardan DAR: kapağın zarfı 1.52'de 1.098, 2.40'ta 1.015.
// Dikdörtgen yazılsaydı üst köşeler gövdenin dışına taşardı.
yuzParca('cam_on_cerceve',
         [[-1.030, 1.470], [1.030, 1.470], [0.985, 2.440], [-0.985, 2.440]],
         0.070, 5.960, 0.050, C_DIREK, { metal: 0.2, rough: 0.55 });
yuzParca('cam_on',
         [[-0.985, 1.520], [0.985, 1.520], [0.935, 2.395], [-0.935, 2.395]],
         0.065, 5.972, 0.048, C_CAM, { metal: 0.35, rough: 0.15 });

// GÜZERGÂH TABELASI: ön camın üstünde ışıklı panel. ⚠️ YAZI YOK — harita
// modeli soldan sağa aynaladığı için yazı ters çıkardı (OKU.md). Boş
// aydınlık panel hem gerçekçi hem de o tuzağı hiç açmıyor.
yuzParca('tabela_cerceve',
         [[-0.815, 2.460], [0.815, 2.460], [0.775, 2.660], [-0.775, 2.660]],
         0.035, 5.962, 0.052, C_DIREK, { metal: 0.2, rough: 0.55 });
yuzParca('tabela',
         [[-0.775, 2.482], [0.775, 2.482], [0.742, 2.638], [-0.742, 2.638]],
         0.026, 5.980, 0.045, C_TABELA, { metal: 0.10, rough: 0.30 });

// ---- ARKA YÜZ -------------------------------------------------------------
// Kapak profili ön kapakla BİREBİR AYNI (bütün eğriler x'te simetrik;
// kesit_olc.js ile x=-6.00'da doğrulandı). Ama yüzün düzeni bambaşka:
// şehir otobüsünün motoru ARKADADIR, arka yüzün ortasını dev bir motor
// kapağı ve panjurlar kaplar, cam yukarıda küçük kalır.
[1, -1].forEach(function (s, i) {
    // Stop grupları DİKEY ve UZUN — kamyon/otobüs imzası. Otomobildeki
    // yatay lamba burada yanlış okunuyordu.
    yuzParca('stop_' + (i + 1),
             [[s * 0.700, 0.900], [s * 1.030, 0.900], [s * 1.030, 1.720],
              [s * 0.700, 1.720]],
             0.055, -6.018, 0.058, C_STOP, { metal: 0.25, rough: 0.22 });
    yuzParca('stop_ic_' + (i + 1),
             [[s * 0.725, 0.930], [s * 1.005, 0.930], [s * 1.005, 1.325],
              [s * 0.725, 1.325]],
             0.040, -6.026, 0.042, C_STOP_K, { metal: 0.1, rough: 0.35 });
    // Üst dilim kehribar (sinyal), alt dilim kırmızı — gerçek düzen bu.
    yuzParca('stop_sinyal_' + (i + 1),
             [[s * 0.725, 1.375], [s * 1.005, 1.375], [s * 1.005, 1.690],
              [s * 0.725, 1.690]],
             0.040, -6.026, 0.042, C_SINYAL, { metal: 0.2, rough: 0.28 });
    yuzParca('reflektor_' + (i + 1),
             [[s * 0.720, 0.480], [s * 0.930, 0.480], [s * 0.930, 0.600],
              [s * 0.720, 0.600]],
             0.024, -6.026, 0.032, '#8c2a24', { metal: 0.2, rough: 0.35 });
});
yuzParca('tampon_arka',
         [[-1.035, 0.400], [1.035, 0.400], [1.035, 0.800], [-1.035, 0.800]],
         0.090, -6.017, 0.062, C_FASYA, { metal: 0.15, rough: 0.70 });
yuzParca('plaka_arka',
         [[-0.225, 0.495], [0.225, 0.495], [0.225, 0.640], [-0.225, 0.640]],
         0.012, -6.028, 0.038, C_PLAKA, { metal: 0.05, rough: 0.85 });

// MOTOR KAPAĞI — arka yüzün ortasını kaplayan büyük kapak. Gövde rengini
// ALIYOR (_TINT.parts'ta): gerçekte de boyalıdır. Çevresindeki koyu çerçeve
// olmasaydı gövdeyle aynı renkte kaybolurdu; kapağın kenarını o çiziyor.
yuzParca('motor_cerceve',
         [[-0.640, 0.880], [0.640, 0.880], [0.640, 1.870], [-0.640, 1.870]],
         0.060, -6.008, 0.048, '#1a1e24', { metal: 0.2, rough: 0.60 });
yuzParca('motor_kapak',
         [[-0.600, 0.920], [0.600, 0.920], [0.600, 1.830], [-0.600, 1.830]],
         0.050, -6.016, 0.048, C_GOVDE, { metal: 0.40, rough: 0.36 });
// Panjurlar: motor havalandırma dilimleri. Düz kapağı bölen tek şey.
[1.05, 1.29, 1.53].forEach(function (py, i) {
    yuzParca('panjur_' + (i + 1),
             [[-0.500, py], [0.500, py], [0.500, py + 0.075], [-0.500, py + 0.075]],
             0.020, -6.024, 0.030, '#12161b', { metal: 0.25, rough: 0.65 });
});

// ARKA CAM: küçük ve yüksek — altındaki yeri motor kaplıyor.
yuzParca('cam_arka_cerceve',
         [[-0.960, 1.940], [0.960, 1.940], [0.925, 2.455], [-0.925, 2.455]],
         0.060, -6.010, 0.050, C_DIREK, { metal: 0.2, rough: 0.55 });
yuzParca('cam_arka',
         [[-0.915, 1.985], [0.915, 1.985], [0.882, 2.412], [-0.882, 2.412]],
         0.050, -6.022, 0.048, C_CAM, { metal: 0.35, rough: 0.15 });

// ===========================================================================
// 7. TEKERLEKLER
// ===========================================================================
// Grup deseni: grup rotation.x = π/2 ile yatırılıyor, rotation.y motora
// bırakılıyor. ALTISI da modelGroup'un DOĞRUDAN çocuğu — motor ön tekerleri
// kendi steer grubuna alırken `inner.add(sg)` yapıyor, daha derinde
// olsalardı yerlerinden sökülürlerdi.
//
// ARKA AKS İKİZ (çift) TEKERLİ. Şehir otobüsünün arkadan bakışta en belirgin
// işareti bu: dört lastik yan yana. İç tekerlerin DIŞ yüzü ikizin arasında
// kalıp görünmediği için oralara jant kapağı/göbek konmuyor (`tam=false`) —
// görünmeyen ayrıntı yalnız üçgen harcar.
function tekerlek(ad, x, z, tam) {
    const g = new THREE.Group();
    g.name = ad;
    g.position.set(x, AKS_Y, z);
    g.rotation.x = Math.PI / 2;
    const dis = (z > 0 ? 1 : -1);          // tekerin DIŞ yüzünün yönü

    // Lastik: torusun kesiti daire olduğu için et kalınlığı genişliği de
    // belirliyor; kamyon/otobüs lastiği DAR ve YÜKSEK yanaklıdır → aks
    // doğrultusunda ölçekleniyor, kesit elipse dönüyor.
    const et = (R_TEKER - R_JANT) / 2;     // 0.1175 — 22.5" jantta kalın yanak
    const lastik = new THREE.TorusGeometry(R_TEKER - et, et, 6, 22);
    lastik.rotateX(Math.PI / 2);
    lastik.scale(1, LASTIK_GEN / (et * 2), 1);
    g.add(mesh(lastik, C_LASTIK, { rough: 0.95, name: ad + '_lastik' }));

    // Jant kovanı: AÇIK uçlu silindir (kapaklı olsaydı kapağı örterdi).
    const jant = mesh(new THREE.CylinderGeometry(R_JANT, R_JANT, LASTIK_GEN * 0.88,
                                                 18, 1, true),
                      C_JANT_K, { metal: 0.35, rough: 0.45, name: ad + '_jant' });
    jant.material.side = THREE.DoubleSide;
    g.add(jant);

    if (tam) {
        // Otobüs janti otomobilinki gibi beş kollu döküm DEĞİL: düz çelik
        // disk, ortada büyük poyra kapağı. Yıldız extrude denendi ve
        // bırakıldı — 22.5" jantta kol arası boşluk lastiğin gölgesinde
        // kalıyor, yalnız üçgen harcıyordu.
        const disk = mesh(new THREE.CylinderGeometry(R_JANT * 0.96, R_JANT * 0.96,
                                                     0.020, 16),
                          C_JANT, { metal: 0.38, rough: 0.36, name: ad + '_kapak' });
        disk.position.y = dis * (LASTIK_GEN * 0.44);
        g.add(disk);
        const gobek = mesh(new THREE.CylinderGeometry(0.085, 0.085, 0.055, 10),
                           C_JANT_K, { metal: 0.4, rough: 0.34, name: ad + '_gobek' });
        gobek.position.y = dis * (LASTIK_GEN * 0.46);
        g.add(gobek);
    }
    modelGroup.add(g);
}
tekerlek('teker_on_1', ON_X, IZ_Z, true);
tekerlek('teker_on_2', ON_X, -IZ_Z, true);
tekerlek('teker_arka_1', ARKA_X, IZ_Z, true);
tekerlek('teker_arka_2', ARKA_X, IKIZ_Z, false);
tekerlek('teker_arka_3', ARKA_X, -IKIZ_Z, false);
tekerlek('teker_arka_4', ARKA_X, -IZ_Z, true);

// ---- davlumbaz (iç çamurluk) ----------------------------------------------
// ⚠️ Yay lastiğin İÇİNDE değil, lastikten HEMEN DIŞARIDA (yarıçap 0.492 ..
// 0.578; lastik 0.478, kemer dudağı 0.595). İçeride kalsaydı lastikle kemer
// dudağı arasındaki 117 mm'lik boşluk açık kalır, kemer ağzından öbür
// tarafın zemini görünür ve ağız kocaman bir delik gibi okunurdu.
// ⚠️ Halka dilimi EXTRUDE ediliyor, kısmi silindir DEĞİL: kalınlıksız kabuk
// aks doğrultusundan bakınca saç teli inceliğine düşüp kayboluyor.
// ⚠️ Halka İNCE tutuldu (86 mm). İlk kurulumda 70 mm etli ama lastiğe 14 mm
// yakındı ve dışa doğru kemer dudağını 15 mm geçiyordu: koyu davlumbaz ile
// koyu lastik tek bir siyah leke halinde birleşip kemer ağzını yutuyordu
// (yakın plan çiziminde ölçüldü). Şimdi davlumbaz dudağın 17 mm İÇİNDE
// bitiyor, aradaki farkı da aşağıdaki KUŞAK çiziyor.
// Arka davlumbaz İKİZİN TAMAMINI kapsıyor (z 0.30 → 1.22), önki tek tekeri.
[[ARKA_X, 0.30, 1.22], [ON_X, 0.42, 1.22]].forEach(function (a, k) {
    const ax = a[0], z1 = a[1], z2 = a[2];
    [1, -1].forEach(function (s, i) {
        const sh = new THREE.Shape();
        sh.absarc(0, 0, 0.578, -0.16, Math.PI + 0.16, false);
        sh.absarc(0, 0, 0.492, Math.PI + 0.16, -0.16, true);
        const geo = new THREE.ExtrudeGeometry(sh, {
            depth: z2 - z1, bevelEnabled: false, curveSegments: 9
        });
        geo.translate(0, 0, s > 0 ? z1 : -z2);
        geo.translate(ax, AKS_Y, 0);
        modelGroup.add(mesh(geo, C_DIP, { metal: 0.1, rough: 0.9,
                                          name: 'davlumbaz_' + (k * 2 + i + 1) }));
    });
});

// ---- kemer kuşağı (ağzın kenarını çizen koyu plastik) ---------------------
// §5'te anlatılan sebeple bu bir yüzey yaması DEĞİL, gövdenin dışında duran
// gerçek bir halka dilimi. Yarıçap 0.584 → 0.646, yani kemer dudağının
// (0.595) 11 mm altından başlayıp 51 mm üstüne, gövdenin yanağına taşıyor —
// gerçek kemer kuşağı da dudağı böyle sarar.
// z: 1.268 → 1.284. Gövdenin en geniş yeri 1.275, kemer ağzının dudağı ise
// 1.263; kuşak her noktada 5-12 mm DIŞARIDA kalıyor, yani kenarında kendi
// ışık çizgisi oluşuyor. Kemer ağzının okunmasını sağlayan tek şey bu.
// Yay -0.06 .. π+0.06 arasında: uçları gövdenin alt kenarının 19 mm üstünde
// bitiyor (ölçüldü), yani havada kalan parça yok.
AKS_X.forEach(function (ax, k) {
    [1, -1].forEach(function (s, i) {
        const sh = new THREE.Shape();
        sh.absarc(0, 0, 0.646, -0.06, Math.PI + 0.06, false);
        sh.absarc(0, 0, 0.584, Math.PI + 0.06, -0.06, true);
        const geo = new THREE.ExtrudeGeometry(sh, {
            depth: 0.016, bevelEnabled: false, curveSegments: 10
        });
        geo.translate(0, 0, s > 0 ? 1.268 : -1.284);
        geo.translate(ax, AKS_Y, 0);
        modelGroup.add(mesh(geo, '#15191e', { metal: 0.15, rough: 0.80,
                                              name: 'kemer_kusak_' + (k * 2 + i + 1) }));
    });
});

// ---- alt taban ------------------------------------------------------------
// Düşük bakış açısında kemer ağzından ve eşiğin altından altı görünmesin diye.
(function () {
    // Üst yüzü eşiğin (0.252) tam hizasında; gövde 43 mm inince plaka da indi.
    const t = mesh(new THREE.BoxGeometry(10.20, 0.050, 2.24), '#15181c',
                   { metal: 0.1, rough: 0.95, name: 'taban' });
    t.position.set(0, 0.232, 0);
    modelGroup.add(t);
})();

// ===========================================================================
// 8. ÇATI VE KÜÇÜK PARÇALAR
// ===========================================================================
// KLİMA ÜNİTESİ — tepeden bakışta otobüsü otobüs yapan tek işaret. Haritada
// en çok kullanılan bakış yüksek eğimli (pitch 45-60) olduğu için çatı,
// yan yüz kadar görünür bir yüzey; boş bırakılırsa 12 m'lik düz bir levha
// kalıyor.
// ⚠️ Kütlenin TABANI çatının içine gömülü (2.970), TEPESİ çatının belirgin
// biçimde üstünde (3.196). Kutunun altını çatının üstüne oturtmak denendi ve
// bırakıldı: çatı kubbeli olduğu için kutu ortada oturup kenarlarda 13 cm
// havada kalıyordu. Ama ilk kurulumda ters yöne kaçıldı — kutu ÇOK gömüldü,
// çatı kubbesinin üstünde yalnız 6 cm kalıyordu ve tepeden bakışta çatıya
// BOYANMIŞ gri bir dikdörtgen gibi duruyordu, gölgesi bile yoktu.
// Şimdi görünen yükseklik: çatı tepesinde (3.10) 96 mm, klimanın kendi
// kenarlarında (çatı z=±0.88'de 3.072) 124 mm — gerçek bir kütle, gerçek
// gölge.
// Kenarları `bevelEnabled` ile yuvarlatıldı: keskin köşeli kutu çatının
// yumuşak kubbesinin üstünde yapıştırma duruyordu.
(function () {
    // ExtrudeGeometry şekli XY'de kurup +Z'ye itiyor. rotateX(-π/2) ile
    // (x,y,z) → (x,z,-y): şeklin planı model x-z düzlemine, itiş +y'ye.
    const sh = yuvarlakSekil([[-1.30, -0.88], [1.30, -0.88],
                              [1.30, 0.88], [-1.30, 0.88]], 0.15);
    const geo = new THREE.ExtrudeGeometry(sh, {
        depth: 0.170, bevelEnabled: true, bevelThickness: 0.020,
        bevelSize: 0.020, bevelSegments: 2, curveSegments: 5
    });
    geo.rotateX(-Math.PI / 2);
    geo.translate(2.10, 2.990, 0);       // y 2.970 .. 3.180 (bevel dahil)
    modelGroup.add(mesh(geo, '#20242a', { metal: 0.2, rough: 0.62, name: 'klima' }));
    // Üstteki fan ızgarası — kütleyi tek düze bir blok olmaktan çıkarıyor.
    const iz = mesh(new THREE.BoxGeometry(1.86, 0.024, 1.26), '#3b424a',
                    { metal: 0.25, rough: 0.55, name: 'klima_izgara' });
    iz.position.set(2.10, 3.184, 0);
    modelGroup.add(iz);
})();
// Çatı kapakları (acil çıkış / havalandırma). Klimanın arkasında iki tane.
// ⚠️ RENK KOYU. İlk kurulumda '#9aa3ac' idi ve haritanın ANA BAKIŞI tepeden
// olduğu için iki kapak çatının en baskın öğesi oluyordu: göz otobüsü değil
// iki beyaz kareyi görüyordu. Gerçek tavan kapağı füme camdır; koyu gri ve
// yüksek rough ile parlamıyor, çatı artık gövde rengi + koyu klima + koyu
// kapak olarak okunuyor.
[-0.70, -3.60].forEach(function (kx, i) {
    const h = mesh(new THREE.BoxGeometry(0.70, 0.057, 0.86), '#3d444c',
                   { metal: 0.10, rough: 0.78, name: 'cati_kapak_' + (i + 1) });
    h.position.set(kx, 3.0835, 0);
    modelGroup.add(h);
});

// AYNALAR — otobüs aynası şöyledir: ön camın iki yanında gövdeden DIŞA
// uzanan yatay bir kol, kolun ucunda DÜŞEY dikdörtgen bir kasa, kasanın
// içinde İKİ GÖZ (üstte büyük ana ayna, altta küçük geniş açı aynası).
//
// ⚠️ BU ÜÇÜNCÜ KURULUM. Önceki ikisi de ölçülüp bırakıldı:
//   1. Yalnız yatay kol + elipsoit kabuk: kolun alt yüzü 2.463, kabuğun
//      üstü 2.384 → 79 mm BOŞLUK, ayna havada duran bir damla gibiydi.
//   2. Kol + dikme + elipsoit kabuk: boşluk kapandı ama siluet hâlâ
//      düzensizdi. Ölçeklenmiş küre önden bakışta damla veriyor; otobüs
//      aynası ise NET BİR DİKDÖRTGEN olarak okunmalı. Kabuk kutuya
//      çevrildi, dikme gereksiz kaldı (kasa zaten kola değiyor: kasanın
//      üstü 2.435, kolun altı 2.405 → 30 mm örtüşme).
//
// ⚠️ Aynalar direksiyonla DÖNMEZ, o yüzden teker gruplarının dışında,
// doğrudan modelGroup'un çocuğu.
[1, -1].forEach(function (s, i) {
    // Kol: gövdeden (x=5.50'de yüzey z≈1.238) dışa uzanan boru.
    const kol = mesh(new THREE.BoxGeometry(0.080, 0.070, 0.300), C_DIREK,
                     { metal: 0.3, rough: 0.50, name: 'ayna_kol_' + (i + 1) });
    kol.position.set(5.50, 2.440, s * 1.300);
    modelGroup.add(kol);

    // Kasa: DÜŞEY dikdörtgen, 0.195 x 0.700. Koyu gri — şehir otobüsünde
    // ayna kasası gövde rengine boyanmaz, siyah/gri plastiktir; _TINT'e de
    // bu yüzden girmiyor (kullanıcı gövdeyi sarı yapınca aynalar koyu
    // kalsın).
    const kasa = mesh(new THREE.BoxGeometry(0.085, 0.700, 0.195), '#33383f',
                      { metal: 0.30, rough: 0.52, name: 'ayna_kasa_' + (i + 1) });
    kasa.position.set(5.455, 2.085, s * 1.385);
    modelGroup.add(kasa);

    // İki göz. Aralarındaki 62 mm'lik kasa yüzü onları ayırıyor — tek büyük
    // cam konsaydı kasa bir aynadan çok koyu bir levha gibi okunurdu.
    const anaCam = mesh(new THREE.BoxGeometry(0.020, 0.400, 0.150), C_CAM,
                        { metal: 0.4, rough: 0.08, name: 'ayna_cam_' + (i + 1) });
    anaCam.position.set(5.4045, 2.205, s * 1.385);
    modelGroup.add(anaCam);
    const genisCam = mesh(new THREE.BoxGeometry(0.020, 0.185, 0.150), C_CAM,
                          { metal: 0.4, rough: 0.08,
                            name: 'ayna_cam_alt_' + (i + 1) });
    genisCam.position.set(5.4045, 1.850, s * 1.385);
    modelGroup.add(genisCam);
});
