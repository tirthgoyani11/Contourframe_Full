// Motokaravan — 7 m alkovlu, Ducato şasi üzerine kabin-üstü yataklı
// motokaravan. Ulaşım temasının altıncı modeli.
//
// NEDEN ALKOV: kütüphanede zaten `karavan` (Camper Van, minibüs boyu) ve
// `cekmeli-karavan` (Travel Trailer, motorsuz römork) var. Bu üçüncüsü
// KENDİNDEN MOTORLU BÜYÜK karavan ve ilk bakışta o ikisiyle karışmamalı.
// Bunu sağlayan en güçlü tek işaret ALKOV'dur: kabinin ÜSTÜNE taşan yatak
// bölmesi. Siluette burnun üstünü çıkıntılı yapan o kutu, uzaktan bile
// "motokaravan" diye okunur; ne minibüsün ne römorkun öyle bir şeyi var.
//
// GÖVDE MAKİNESİ `otobus.js` / `otomobil.js` ile AYNI: x ekseni boyunca
// istasyonlarda ayrı ayrı hesaplanan KAPALI KESİTLER birbirine dikiliyor
// (loft), her kesit parametresi kendi monoton kübik eğrisinden (PCHIP)
// okunuyor, paneller `yuzeyYama` ile gövde yüzeyine oturuyor, ön/arka yüz
// parçaları `yuzParca` ile kapağa extrude ediliyor.
//
// AMA ÜÇ KÜTLESİ VAR VE İKİSİ TEK LOFT'TA:
//   1. YAŞAM KUTUSU + ALKOV -> TEK loft kabuğu ('govde'). Alkov ayrı bir
//      kutu olarak DEĞİL, loft'un alt kenarı (ESIK eğrisi) x=1.53
//      civarında 0.40'tan 2.20'ye DİKİNE fırlayarak kuruluyor. Böylece
//      yaşam kutusunun ön duvarı ile alkovun altı aynı yüzeyin parçası:
//      aralarında dikiş, bindirme ya da z-fighting yok. Ayrı kutu denendi
//      ve bırakıldı — iki kutunun köşe yarıçapları tutmuyor, birleşme
//      yerinde her bakışta bir çizgi kalıyordu.
//   2. KABİN -> ayrı bir extrude (yan profil x-y düzleminde, z boyunca
//      itiliyor). Loft'un içine 9 cm gömülü (arkası x=1.44'te, ön duvarın
//      dibinde), yani havada duran parça değil.
//
// GERÇEK ÖLÇÜLER (metre):
//   uzunluk 7.00 · genişlik 2.30 · yükseklik 3.05 (çatı öğeleri hariç)
//   dingil arası 4.04 · ön aks +2.55 (ön çıkma 0.95)
//                     · arka aks -1.49 (arka çıkma 2.01)
//   teker 225/75 R16 -> yarıçap 0.372, genişlik 0.225, jant 16" (0.203)
//   iz ±0.90, arka TEKİL teker (ikiz değil — 3.5 t sınıfı Ducato şasi)
//   yaşam bölmesi zemini 0.72 · alkov tabanı 2.20 · alkov çatısı 2.95
//
// TEKER YARIÇAPI ARİTMETİĞİ: 16 x 25.4 / 2 + 0.75 x 225 = 203 + 169 =
// 372 mm. `_WHEELS.radius` DA 0.372 olmak zorunda — motor kat edilen yolu
// yarıçapa bölerek yuvarlanmayı hesaplıyor, model kodundaki R_TEKER ile
// tutmazsa teker yolla uyumsuz döner (patinaj gibi görünür).
//
// ⚠️ YAN YÜZ ÖĞELERİ İKİ TARAFTA DA VAR — BİLEREK, kusur değil. Gerçek
// motokaravanda giriş kapısı, tente ve büyük pencere yalnız bir taraftadır
// (Avrupa'da sağ). Buna rağmen simetrik kuruldu: harita modeli soldan sağa
// AYNALIYOR (OKU.md) ve model haritada serbestçe dönüyor; tek taraflı
// kurgu bakışların yarısında bomboş bir yan yüz — yani kapalı kasa kamyon
// — demekti. Okunabilirlik gerçekçiliği yeniyor. (Otobüste verilen kararın
// aynısı, Furkan, 2026-09-01.)
//
// ⚠️ YAZI YOK. Harita modeli soldan sağa aynalıyor; taksinin tepe
// lambasında "IXAT" çıkmıştı. Bu modelde yazıya ihtiyaç da yok.
//
// PARÇALAR (Studio3D bu adları arar, DEĞİŞTİRME):
//   teker_on_1/2, teker_arka_1/2 -> GRUP. Dördü de yuvarlanır; yalnız ön
//                                   ikisi _WHEELS.front ile direksiyon kırar.
//   govde                        -> RENK ALIR (_TINT), tek parça.
//   kabin, etek, cam_*, ...      -> renk ALMAZ; bkz. aşağıdaki not.
//
// ⚠️ KABİN VE ALT ETEK RENK ALMAZ. Gerçek motokaravanların çoğunda kabin
// gri/koyu (araç üreticisinin rengi), yaşam bölmesi beyaz/kremdir. İkisini
// ayrı tutmak hem gerçekçi hem de kullanıcı gövde rengini değiştirdiğinde
// aracın iki tonlu okunmasını sürdürüyor: tek renk olsaydı 7 metrelik düz
// bir blok kalırdı.
//
// YÖN: burun +x, üst +y, taban y=0. Ölçüler gerçek metre.

// ===========================================================================
// 0. RENKLER
// ===========================================================================
// ⚠️⚠️ GÖVDE RENGİ ÖLÇÜLEREK KOYULTULDU: #d5d1c6 -> #a09c91.
// İlk kurulum krem/kırık beyaz (#d5d1c6 = 213,209,198) idi ve TEPEDEN
// BAKIŞTA BEYAZA YANIYORDU. Ölçüm (bakis.py tepe panelinde piksel sayımı):
// gövdenin parlak piksellerinin %80'i TAM BEYAZ (255,255,255) çıkıyordu —
// çatı düpedüz düz bir levha, hiç gölge geçişi yok. Karşılaştırma:
// aynı sahnede taksi %2, otobüs %13.
// Sahnenin pozlaması ÖLÇÜLDÜ: gövde geçici olarak #808080 (128) yapılıp
// çatı 196 okundu -> doğrusal uzayda 2.44x kazanç. 213'lük krem 1.61
// doğrusal değere, yani sert kırpmaya karşılık geliyor.
// #a09c91 (160,156,145) ile çatı 243-245'e oturuyor; kırpılan tek şey
// yuvarlak çatı kenarındaki parlama benekleri (%7.2, yalnız R kanalı,
// TAM BEYAZ piksel SIFIR). Ara değer #a5a196 de denendi: %19 R kırpması.
// Malzeme de MAT: metal 0.12, rough 0.62 (otobüste 0.40/0.36 idi, orada
// gövde koyu maviydi). Boyalı GRP panelin gerçek karşılığı da bu.
const C_GOVDE   = '#a09c91';   // _TINT varsayılanı — sıcak kırık beyaz
const C_KABIN   = '#4e555d';   // kabin — koyu gri, RENK ALMAZ
const C_ETEK    = '#41474e';   // alt bordür (zemin altı etek), RENK ALMAZ
const C_CAM     = '#161d26';
const C_CERCEVE = '#9aa0a6';   // pencere çerçevesi — motokaravan pencereleri
                               // açık gri plastik çerçevelidir; koyu camı
                               // gövdeden ayıran şey bu ince açık şerit
const C_KAPI    = '#c9c5ba';   // giriş kapısı kanadı — gövdeden bir tık koyu
const C_DERZ    = '#3a3f45';   // kapak/kapı derzi (gölge çizgisi)
const C_LUK     = '#b9bcc0';   // bagaj kapağı — açık gri, koyu eteğin içinde
const C_DIREK   = '#0f1216';
const C_LASTIK  = '#1b1b1e';
const C_JANT    = '#aeb5bd';
const C_JANT_K  = '#5f666e';
// ⚠️ KROM DİYE metalness 0.85-0.95 VERİLMEZ. MeshStandardMaterial'da
// metalness=1 difüz bileşeni sıfırlar; environment map olmadığı için metal
// parça yalnız doğrudan ışığın yansımasını gösterir, açı tutmayan yüzler
// kapkara çıkar. Düşük metalness + açık taban rengi hem parlar hem okunur.
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
// Çatı öğeleri. ⚠️ PARLAK OLMAZ — haritanın ana bakışı tepeden ve otobüste
// ölçüldü: '#9aa3ac' çatı kapakları iki beyaz kare gibi patlayıp gözü
// araçtan çalıyordu. Güneş paneli zaten koyu olmalı (gerçekte de öyle),
// bacalar orta gri + yüksek rough.
const C_PANEL   = '#1c2028';   // güneş paneli camı
const C_PANEL_C = '#6b737c';   // panel alüminyum çerçevesi
const C_BACA_A  = '#3d444c';   // baca kaidesi
const C_BACA_U  = '#6b737c';   // baca kapağı
const C_TENTE   = '#6f767d';   // tente kutusu — orta gri; krem gövdenin
                               // üstünde yatay bir çizgi olarak okunsun diye
                               // (beyaz denendi, gövdede kayboluyordu)

// ===========================================================================
// 1. TEMEL ÖLÇÜLER
// ===========================================================================
const UZUN      = 3.50;     // yarı uzunluk -> 7.00 m (kabin burnu +3.50)
const YARI_GEN  = 1.15;     // 2.30 m
const CATI      = 3.05;     // yaşam kutusu çatısı
const ZEMIN     = 0.72;     // yaşam bölmesi zemini (iç döşeme)
const ESIK_YAS  = 0.40;     // yaşam kutusunun ALT kenarı — zeminin 32 cm
                            // altı; aradaki etek gerçek motokaravanda
                            // bagaj/garaj bölmesinin kaportasıdır
const ALKOV_ALT = 2.20;     // alkov tabanı = kabin çatısı hizası
const ALKOV_UST = 2.95;     // alkov çatısı — yaşam çatısından 10 cm alçak
const R_TEKER   = 0.372;    // 225/75 R16. _WHEELS.radius ile BİREBİR aynı
                            // olmak zorunda (yuvarlanma hızını o belirliyor)
const R_JANT    = 0.203;    // 16 inç jant -> çap 406.4 mm
const AKS_Y     = R_TEKER;
const ON_X      = 2.55;     // ön çıkma 0.95
const ARKA_X    = -1.49;    // arka çıkma 2.01 -> dingil arası 4.04
const AKS_X     = [ARKA_X, ON_X];
const IZ_Z      = 0.90;
const LASTIK_GEN = 0.225;
const KEMER_R   = 0.50;     // kemer yarıçapı -> ağzın tepesi yerden 0.872,
                            // lastikten 128 mm açık
// ⚠️ KEMER ETEĞİ YOK (otobüste 0.075 idi). Sebep ölçülebilir: aks yüksekliği
// 0.372, gövdenin alt kenarı 0.400 — yani AKS EŞİĞİN ALTINDA. Kemer dairesi
// y=0.400'ü dx=0.4992'de kesiyor, eşiğe kendiliğinden iniyor. Otobüste eşik
// (0.252) aksın (0.478) ALTINDAYDI, orada dairenin ucunda 226 mm'lik dikey
// bir duvar kalıyordu ve onu kapatmak için çeyrek elips (etek) gerekiyordu.
// Burada etek eklemek yalnız eşiğin altına inen bir çıkıntı üretirdi.
const KEMER_KES = Math.sqrt(KEMER_R * KEMER_R -
                            (ESIK_YAS - AKS_Y) * (ESIK_YAS - AKS_Y)); // 0.4992

// Loft'un uçları. Model 7.00 m ama LOFT 6.85 m: burun kabine, kuyruk
// tampon/merdivene bırakılıyor.
const L_ARKA    = -3.50;    // yaşam kutusunun arka duvarı
const L_ON      =  3.35;    // ALKOV BURNU (kabin burnu 3.50, alkov 15 cm geride)
const PAH_A     = 0.22;     // arka köşe yuvarlatma boyu
const PAH_O     = 0.42;     // alkov burnu — daha uzun, aerodinamik olsun diye
const PAH_UC_A  = 0.965;    // arka kesit ölçeği: arka duvar neredeyse dik
                            // (0.92 denendi ve bırakıldı — arka yüz 14 %
                            // daralıyor, kutu değil kayık gibi oluyordu)
const PAH_UC_O  = 0.875;    // alkov burnu belirgin yuvarlak
const BOMBE     = 0.006;
const US_YANAK  = 0.55;     // alt köşe süper-elips üssü
const US_CATI   = 0.48;     // çatı köşesi üssü — küçük değer = ORTADA DÜZ,
                            // kenarda ~0.20 yarıçaplı köşe. Motokaravan
                            // çatısı düzdür (panel konur), otobüsteki gibi
                            // kubbeli değil.
const NV        = 18;       // yarı kesitteki örnek sayısı (halka 2*NV-2 = 34)

// Kabin (Ducato benzeri hafif ticari araç kabini).
const KABIN_ARKA = 1.44;    // ön duvarın DİBİNE kadar geri gidiyor: son 9 cm
                            // yaşam kutusunun içinde kalıyor, böylece iki
                            // kütle arasında boşluk kalmıyor
const KABIN_ON   = 3.50;    // aracın burnu
const KABIN_ALT  = 0.48;
const KABIN_UST  = 2.22;    // kabin çatısı — alkov tabanının (2.20) 2 cm
                            // ÜSTÜNDE: alkov kabine oturuyor, değmiyor değil
const KABIN_Z    = 1.02;    // kabin yarı genişliği (2.04 m). Yaşam kutusu
                            // 2.30 — alkov kabinin iki yanından 13 cm taşar,
                            // gerçek alkovda da öyledir
const KABIN_PAH  = 0.03;    // extrude bevel'i: kabin kenarları yuvarlak

// Yan yüz öğelerinin x aralıkları.
const KAPI_X    = [0.52, 1.18];    // giriş kapısı — dar (0.66 m)
const KAPI_ALT  = 0.76, KAPI_UST = 2.58;
const PEN_B     = [-0.75, 0.32];   // büyük yan pencere (yaşam alanı)
const PEN_K     = [-2.90, -2.52];  // küçük pencere (banyo)
const PEN_ALT   = 1.42, PEN_UST = 2.10;
const PEN_K_ALT = 1.52, PEN_K_UST = 2.00;

// ⚠️ Kemerin ETKİ ALANI: x = ARKA_X ± (KEMER_R + 0.02) = -2.01 .. -0.97.
// Alt yüzeye oturan YATAY bantlar (etek, bagaj kapakları) bu aralığı
// ATLAMAK ZORUNDA. Sebep otobüste ölçüldü: kemer ağzında kesitin TABANI
// 0.872'ye çıkıyor, yani y=0.50 kesitin altında kalıyor; `vYukseklik`in
// ikili araması v=0'a düşüyor ve bandın iki kenarı da kemer dudağının ORTA
// HATTINA (z=0) çöküyor — gövdenin içinde yassı, dejenere üçgenler.
// Dışarıdan görünmüyor ama gölge haritasında duruyor.
const KEMER_BOS = [ARKA_X - 0.53, ARKA_X + 0.53];   // -2.02 .. -0.96

// ===========================================================================
// 2. MONOTON KÜBİK EĞRİ (PCHIP)
// ===========================================================================
// Catmull-Rom otomobilde denendi ve BIRAKILDI: eğimin hızla değiştiği
// yerlerde taşma yapıyor. Burada taşma çok daha pahalı olurdu — ESIK eğrisi
// x=1.50..1.58 arasında 0.40'tan 2.20'ye fırlıyor (ön duvar); taşan bir
// eğri o duvarın dibinde gövdenin altına sarkan bir dil üretirdi.
// Fritsch-Carlson tegetleri yerel uç noktalarda sıfırlanır -> taşma yok.
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
// EŞİK — gövdenin ALT kenarı. Bu eğri modelin en önemli tek parçası:
// x=1.50 .. 1.58 arasında 0.404'ten 2.20'ye fırlıyor. O 8 cm'lik fırlama
// YAŞAM KUTUSUNUN ÖN DUVARI; ondan sonrası (2.20'de düz giden bölüm)
// ALKOVUN ALTIDIR. Yani alkov ayrı bir kutu değil, aynı loft'un tabanı
// yükselmiş hâli.
// ⚠️ 0.20 m'lik yumuşak geçiş ÖNCE denendi ve bırakıldı: duvar 7.6° yatık
// çıkıyor, kabinin arkasıyla arasında üçgen bir çentik açılıyordu. 8 cm'de
// (87.5°) gözle dik.
const ESIK = egriYap([
    [-3.50, 0.450], [-3.40, 0.418], [-3.26, 0.404], [-3.05, 0.400],
    [ 1.42, 0.400], [ 1.50, 0.404], [ 1.53, 1.100], [ 1.56, 2.000],
    [ 1.62, 2.190], [ 1.75, 2.200], [ 3.35, 2.200]
]);
// EN GENİŞ NOKTANIN YÜKSEKLİĞİ.
// ⚠️ 0.95 — eşiğin 55 cm üstünde, ve bu KEMER AĞZININ TEPESİNDEN (0.872)
// YÜKSEK olmak zorunda. `kesitPar` yA'yı `yO - 0.030`a kırpıyor; Y_OMUZ
// 0.545 yazılmıştı (eşik + 14 cm) ve kemer ağzı 0.515'e kırpılıp TAMAMEN
// KAYBOLMUŞTU. Yan yüz zaten 0.50'den itibaren dik olduğu için omuzu
// yukarı almanın görsel bedeli yok.
const Y_OMUZ = egriYap([
    [-3.50, 1.000], [-3.40, 0.968], [-3.26, 0.954], [-3.05, 0.950],
    [ 1.42, 0.950], [ 1.50, 0.954], [ 1.53, 1.650], [ 1.56, 2.320],
    [ 1.62, 2.410], [ 1.75, 2.420], [ 3.35, 2.420]
]);
// ÇATI ORTA HATTI. Yaşam kutusunda 3.05'te DÜMDÜZ, alkovda 2.95.
// ⚠️ Aradaki 10 cm BASAMAK DEĞİL, x=1.10..2.30 arasına yayılmış yumuşak
// bir iniş. Basamak denendi ve bırakıldı: çatının ortasında boydan boya
// bir raf oluşuyor, tepeden bakışta aracı ikiye bölüyordu.
const Y_UST = egriYap([
    [-3.50, 2.945], [-3.40, 3.005], [-3.26, 3.038], [-3.05, 3.049],
    [-2.60, 3.050], [ 1.10, 3.050], [ 1.70, 2.998], [ 2.30, 2.958],
    [ 3.00, 2.950], [ 3.14, 2.936], [ 3.26, 2.902], [ 3.35, 2.845]
]);
// ÇATI KÖŞESİNİN DERİNLİĞİ (yU - yC). Ortada 0.16 -> düz çatı, 16 cm'lik
// yuvarlak kenar. Uçlarda daha derin (köşe orada iki yönde birden dönüyor).
const KUBBE = egriYap([
    [-3.50, 0.250], [-3.32, 0.196], [-3.05, 0.166], [-2.60, 0.160],
    [ 2.55, 0.160], [ 3.00, 0.170], [ 3.20, 0.200], [ 3.35, 0.250]
]);
// TUMBLEHOME'UN BAŞLADIĞI YÜKSEKLİK = dik yan yüzün bittiği yer.
// Yaşam kutusunda 2.79, alkovda 2.70 (alkov 10 cm alçak olduğu için).
const Y_BEL = egriYap([
    [-3.50, 2.640], [-3.34, 2.748], [-3.08, 2.784], [-2.60, 2.790],
    [ 1.10, 2.790], [ 1.70, 2.742], [ 2.30, 2.704], [ 3.00, 2.700],
    [ 3.16, 2.676], [ 3.35, 2.610]
]);
// EN GENİŞ YARI GENİŞLİK — 1.15 (2.30 m). Otobüste olduğu gibi ŞİŞME YOK:
// gövde boydan boya aynı genişlikte, yalnız burun ve kuyruk köşesi planda
// yuvarlanıyor.
const W_OMUZ = egriYap([
    [-3.50, 1.085], [-3.40, 1.115], [-3.26, 1.138], [-3.05, 1.148],
    [-2.70, 1.150], [ 2.55, 1.150], [ 2.90, 1.145], [ 3.10, 1.130],
    [ 3.24, 1.098], [ 3.35, 1.038]
]);
// Yan yüzün üst kenarında genişliğin omuzdan ne kadar içeri çekildiği.
// Ortada 4 mm: 1.84 m boyunca 4 mm, yani 0.1° — levha gibi dik duvar.
const D_BEL = egriYap([
    [-3.50, 0.042], [-3.20, 0.014], [-2.70, 0.004],
    [ 2.70, 0.004], [ 3.10, 0.014], [ 3.35, 0.042]
]);
// ÇATI KENARI GENİŞLİĞİ — 1.09, yani yan yüzün üstünden 6 cm içeride.
const W_CATI = egriYap([
    [-3.50, 0.930], [-3.36, 1.010], [-3.18, 1.058], [-2.95, 1.082],
    [-2.55, 1.090], [ 2.50, 1.090], [ 2.90, 1.084], [ 3.10, 1.068],
    [ 3.24, 1.036], [ 3.35, 0.972]
]);
// EŞİK GENİŞLİĞİ (kesitin en altı) — omuzdan 30 mm içeride.
const W_ESIK = egriYap([
    [-3.50, 1.058], [-3.40, 1.086], [-3.26, 1.108], [-3.05, 1.118],
    [-2.70, 1.120], [ 2.55, 1.120], [ 2.90, 1.115], [ 3.10, 1.100],
    [ 3.24, 1.068], [ 3.35, 1.008]
]);

// ===========================================================================
// 3. KESİT
// ===========================================================================
// Çamurluk kemeri YALNIZ ARKA AKSTA. Ön aks (x=+2.55) KABİNİN içinde kalıyor
// ve kabin ayrı bir extrude olduğu için ön kemer oraya, şeklin konturuna
// oyuk olarak işleniyor (§6). Loft'a ön kemer koymak boşuna olurdu: loft o
// x'te zaten yerden 2.20 yukarıda (alkovun altı).
function kemerUst(x) {
    const e = ESIK(x);
    const dx = Math.abs(x - ARKA_X);
    if (dx < KEMER_KES) {
        return Math.max(e, AKS_Y + Math.sqrt(KEMER_R * KEMER_R - dx * dx));
    }
    return e;
}

// Bir istasyonun dokuz parametresi.
function kesitPar(x) {
    const e = ESIK(x);
    let yA = kemerUst(x);
    let yO = Y_OMUZ(x);
    let yU = Y_UST(x);
    yA = Math.min(yA, yO - 0.030);                       // taban omuzun ALTINDA
    let yB = Math.min(Y_BEL(x), yO + (yU - yO) * 0.94);
    let yC = Math.max(yB + 0.022, yU - KUBBE(x));
    const wO = W_OMUZ(x);
    const wB = Math.max(0.03, wO - D_BEL(x));
    let wC = Math.min(W_CATI(x), wB - 0.008);
    // Kemer ağzı açıldıkça kesitin tabanı eşikten dışa, kemer dudağına kadar
    // genişliyor. Motokaravanda çamurluk çıkıntısı YOK (kaporta düz iniyor),
    // o yüzden dudak yan yüzle neredeyse flush: wO - 10 mm.
    const pay = Math.min(1, Math.max(0, (yA - e) / 0.47));
    const wRock = W_ESIK(x);
    let wA = wRock + (wO - 0.010 - wRock) * pay;
    wA = Math.min(wA, wO - 0.008);

    // Burun/kuyruk yuvarlatması. ⚠️ İKİ UÇ AYRI: otobüste gövde x'te
    // simetrikti (|x| yetiyordu), burada loft -3.50 .. +3.35 ve iki ucun
    // hem boyu hem yuvarlaklığı farklı — arka duvar dik (0.965), alkov
    // burnu belirgin yuvarlak (0.875).
    let uc = -1, ucUc = 1;
    if (x > L_ON - PAH_O) { uc = (x - (L_ON - PAH_O)) / PAH_O; ucUc = PAH_UC_O; }
    else if (x < L_ARKA + PAH_A) { uc = ((L_ARKA + PAH_A) - x) / PAH_A; ucUc = PAH_UC_A; }
    if (uc > 0) {
        const f = ucUc + (1 - ucUc) * Math.sqrt(Math.max(0, 1 - uc * uc));
        const yc = (yA + yU) / 2;
        yA = yc + (yA - yc) * f; yO = yc + (yO - yc) * f;
        yB = yc + (yB - yc) * f; yC = yc + (yC - yc) * f; yU = yc + (yU - yc) * f;
        return { yA: yA, wA: wA * f, yO: yO, wO: wO * f, yB: yB, wB: wB * f,
                 yC: yC, wC: wC * f, yU: yU };
    }
    return { yA: yA, wA: wA, yO: yO, wO: wO, yB: yB, wB: wB,
             yC: yC, wC: wC, yU: yU };
}

// Kesit parametresi v'nin bölüm sınırları:
//   A [0 .. VA]   taban (kemer ağzının dudağı ya da eşik altı) — DÜZ
//   B [VA .. VB]  alt köşe: tabandan en geniş noktaya
//   C [VB .. VC]  DİK YAN YÜZ (2.25 m) — motokaravanın levha yanı
//   D [VC .. VD]  yan yüzün üstündeki hafif içe yatma
//   E [VD .. 1]   ÇATI — düz ortası + yuvarlak kenarı
// ⚠️ Örneklerin en büyük payı (%38) ÇATIYA verildi, otobüste %34 idi.
// Sebep: haritanın ana bakışı tepeden; çatı kenarının yuvarlaklığı burada
// yan yüzden daha çok görünüyor. Dik yan yüz gerçekten düz bir çizgi,
// oraya harcanan her örnek boşa gidiyor.
const VA = 0.09, VB = 0.24, VC = 0.50, VD = 0.62;

// Yarı kesitin v parametresindeki noktası -> [z, y].
function kesitNokta(P, v) {
    if (v <= VA) return [P.wA * (v / VA), P.yA];
    if (v <= VB) {
        // Süper-elips çeyreği: (wA,yA) köşesinden çıkıp (wO,yO)'da DİKEY
        // tegetle bitiyor. Üs 0.55 -> gövde eşikten hemen açılıp dikleşiyor.
        const t = (v - VA) / (VB - VA), th = t * Math.PI / 2;
        return [P.wA + (P.wO - P.wA) * Math.pow(Math.sin(th), US_YANAK),
                P.yO - (P.yO - P.yA) * Math.pow(Math.cos(th), US_YANAK)];
    }
    if (v <= VC) {
        // DİK YAN YÜZ. Karakter çizgisi YOK — motokaravanın yanı gerçekten
        // düz bir GRP levhadır. Çizgi işini pencereler, kapı, tente kutusu
        // ve alttaki koyu etek görüyor.
        const t = (v - VB) / (VC - VB);
        const e = t * t * (3 - 2 * t);
        return [P.wO + (P.wB - P.wO) * e, P.yO + (P.yB - P.yO) * t];
    }
    if (v <= VD) {
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
    const hx = (x > L_ON - 0.004) ? -h : h;
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
// 4. GÖVDE KABUĞU (loft) — yaşam kutusu + alkov, TEK parça
// ===========================================================================
const IST = (function () {
    // İstasyonlar üç yerde SIKLAŞIYOR:
    //   1. arka kemer ağzının uçlarında (dairenin türevi orada dikey),
    //   2. ÖN DUVARDA (x 1.50..1.62) — ESIK orada 1.8 m fırlıyor,
    //      seyrek örneklenirse duvar merdiven gibi çıkıyor,
    //   3. iki uçtaki pah bölümlerinde.
    // Aradaki düz bölümlerde kesit hiç değişmiyor, sık örneklemek yalnız
    // üçgen harcar.
    const kemerIst = [-0.520, -0.505, -0.4992, -0.492, -0.470, -0.420,
                      -0.330, -0.180, 0, 0.180, 0.330, 0.420, 0.470,
                       0.492, 0.4992, 0.505, 0.520]
                     .map(d => +(ARKA_X + d).toFixed(4));
    const arkaPah = [1.0, 0.74, 0.50, 0.28, 0.12]
                    .map(k => +(L_ARKA + PAH_A * (1 - k)).toFixed(4));
    const onPah = [0.12, 0.26, 0.42, 0.59, 0.76, 0.90, 1.0]
                  .map(k => +(L_ON - PAH_O + PAH_O * k).toFixed(4));
    const orta = [-3.28, -3.18, -3.02, -2.80, -2.55, -2.30];
    const govde = [-0.72, -0.40, 0.00, 0.42, 0.85, 1.20, 1.36, 1.44];
    const duvar = [1.47, 1.50, 1.515, 1.53, 1.545, 1.56, 1.58, 1.62, 1.70, 1.82];
    const alkov = [2.00, 2.25, 2.50, 2.75, 2.93];
    const hepsi = arkaPah.concat(orta, kemerIst, govde, duvar, alkov, onPah);
    // Savunma amaçlı: kemer istasyonları aks konumundan türetildiği için
    // KEMER_R değişirse listeye komşularının içine düşebilirler. Sıralı ve
    // tekil olmayan bir istasyon listesi loft'ta ters çevrilmiş üçgen üretir.
    hepsi.sort((a, b) => a - b);
    return hepsi.filter((v, i) => i === 0 || v - hepsi[i - 1] > 1e-4);
})();

const R_HALKA = 2 * NV - 2;

function halka(x) {
    const P = kesitPar(x), yarim = [];
    for (let i = 0; i < NV; i++) yarim.push(kesitNokta(P, i / (NV - 1)));
    // 0 = taban ortası -> +z tarafı yukarı -> NV-1 = tepe ortası ->
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
    // Ön (alkov burnu) ve arka (arka duvar) kapak: düz üçgen yelpaze. Halka
    // köşeleri KOPYALANIYOR ki computeVertexNormals kapağın normalini yan
    // yüzeyinkiyle ortalamasın — ortalasaydı motokaravanın dik arka duvarı
    // ile yan yüzü arasındaki köşe yumuşayıp kuyruk balon gibi görünürdü.
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
    modelGroup.add(mesh(geo, C_GOVDE, { metal: 0.12, rough: 0.62, name: 'govde' }));
})();

// ===========================================================================
// 5. YÜZEYE OTURAN PANELLER
// ===========================================================================
// Pencereler, kapı, etek, bagaj kapakları — hepsi aynı yardımcıdan çıkıyor:
// gövde yüzeyi x1..x2 ve w1..w2 aralığında yeniden örnekleniyor ve normal
// boyunca `disari` kadar öteleniyor. Böylece panel gövdenin kavisine BİREBİR
// oturuyor; düz bir levha olsaydı köşede yüzeyin içine girerdi.
// Bant biçimi: [x1, x2, a1, a2]           -> a, kesit parametresi w.
//              [x1, x2, y1, y2, taraf]    -> a YÜKSEKLİK; her x'te o
//              yüksekliğin w'si aranıyor.
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

// ---- YAN PENCERELER -------------------------------------------------------
// Motokaravan penceresi KÖŞELERİ YUVARLAK bir akrilik camdır; `yuzeyYama`
// yalnız dikdörtgen bant üretebiliyor.
// ⚠️ ÇÖZÜM: her pencere ÜÇ BANTTAN kuruluyor — dar bir alt bant, tam
// genişlikte orta bant, dar bir üst bant. Ortaya çıkan sekizgen, köşeleri
// pahlanmış cam olarak okunuyor. Tek dikdörtgen bant denendi ve bırakıldı:
// keskin köşeler pencereyi otobüs camı gibi gösteriyordu, motokaravan
// penceresinin karakteri tam da o yumuşak köşe.
// Her pencerede iki katman var: altta AÇIK GRİ ÇERÇEVE, üstte KOYU CAM.
// Çerçeve olmasa koyu cam krem gövdenin üstünde sınırsız bir leke olurdu;
// gerçek motokaravan penceresinin de kalın açık plastik çerçevesi vardır.
(function () {
    const cerceve = [], cam = [];
    const P = 0.035;                       // çerçevenin cam dışına taşması
    const K = 0.055;                       // köşe pahının x'teki boyu
    [1, -1].forEach(function (s) {
        // büyük yan pencere (yaşam alanı)
        cam.push([PEN_B[0] + K, PEN_B[1] - K, PEN_ALT, PEN_ALT + 0.06, s]);
        cam.push([PEN_B[0], PEN_B[1], PEN_ALT + 0.06, PEN_UST - 0.06, s]);
        cam.push([PEN_B[0] + K, PEN_B[1] - K, PEN_UST - 0.06, PEN_UST, s]);
        cerceve.push([PEN_B[0] + K - P, PEN_B[1] - K + P, PEN_ALT - P, PEN_ALT + 0.06, s]);
        cerceve.push([PEN_B[0] - P, PEN_B[1] + P, PEN_ALT + 0.06, PEN_UST - 0.06, s]);
        cerceve.push([PEN_B[0] + K - P, PEN_B[1] - K + P, PEN_UST - 0.06, PEN_UST + P, s]);
        // küçük pencere (banyo)
        cam.push([PEN_K[0] + K, PEN_K[1] - K, PEN_K_ALT, PEN_K_ALT + 0.05, s]);
        cam.push([PEN_K[0], PEN_K[1], PEN_K_ALT + 0.05, PEN_K_UST - 0.05, s]);
        cam.push([PEN_K[0] + K, PEN_K[1] - K, PEN_K_UST - 0.05, PEN_K_UST, s]);
        cerceve.push([PEN_K[0] + K - P, PEN_K[1] - K + P, PEN_K_ALT - P, PEN_K_ALT + 0.05, s]);
        cerceve.push([PEN_K[0] - P, PEN_K[1] + P, PEN_K_ALT + 0.05, PEN_K_UST - 0.05, s]);
        cerceve.push([PEN_K[0] + K - P, PEN_K[1] - K + P, PEN_K_UST - 0.05, PEN_K_UST + P, s]);
    });
    // Bantlar x'te uzun (0.4-1.1 m), y'de kısa (0.05-0.56 m) -> nx > nw.
    // Yan yüz burada dümdüz olduğu için ikisi de küçük kalabiliyor.
    yuzeyYama('pencere_cerceve', cerceve, 5, 2, 0.009, C_CERCEVE,
              { metal: 0.15, rough: 0.60 });
    yuzeyYama('cam_yan', cam, 5, 2, 0.015, C_CAM, { metal: 0.35, rough: 0.16 });
})();

// ---- GİRİŞ KAPISI ---------------------------------------------------------
// Dar (0.66 m), üst yarısı camlı. Motokaravan kapısı otobüsünkinden dardır
// ve gövdeyle AYNI panelin parçası gibi durur; onu okutan şey çevresindeki
// koyu derz çizgisi.
(function () {
    const derz = [], kanat = [], kcam = [];
    [1, -1].forEach(function (s) {
        derz.push([KAPI_X[0] - 0.022, KAPI_X[1] + 0.022,
                   KAPI_ALT - 0.022, KAPI_UST + 0.022, s]);
        kanat.push([KAPI_X[0], KAPI_X[1], KAPI_ALT, KAPI_UST, s]);
        kcam.push([KAPI_X[0] + 0.075, KAPI_X[1] - 0.075, 1.72, KAPI_UST - 0.10, s]);
    });
    // Bant y'de UZUN (1.82 m), x'te kısa (0.66 m) -> nw > nx. Ters verilirse
    // şerit kapının üst ucunda çatı kavisine giremeyip gövdenin içine girer.
    yuzeyYama('kapi_derz', derz, 2, 9, 0.007, C_DERZ, { metal: 0.15, rough: 0.72 });
    yuzeyYama('kapi_kanat', kanat, 2, 9, 0.013, C_KAPI, { metal: 0.12, rough: 0.62 });
    yuzeyYama('kapi_cam', kcam, 2, 4, 0.019, C_CAM, { metal: 0.35, rough: 0.16 });
})();
// Kapı kolu — küçük ama kapıyı "kapı" yapan son ayrıntı.
[1, -1].forEach(function (s, i) {
    const kol = mesh(new THREE.BoxGeometry(0.115, 0.045, 0.030), C_CERCEVE,
                     { metal: 0.35, rough: 0.42, name: 'kapi_kol_' + (i + 1) });
    kol.position.set(KAPI_X[0] + 0.11, 1.52, s * 1.163);
    modelGroup.add(kol);
});

// ---- ALT ETEK (koyu bordür) ----------------------------------------------
// Zeminin (0.72) altındaki kaporta. Gövdeden KOYU ve _TINT'e girmiyor:
// kullanıcı gövdeyi kırmızı yapsa bile etek koyu gri kalıyor, araç iki
// tonlu okunmaya devam ediyor.
// ⚠️ ÜÇ AYRI BANT, boydan boya tek bant DEĞİL — ortadaki kemer ağzının
// etki alanı (KEMER_BOS) atlanıyor. Sebep §1'de yazılı (dejenere üçgenler).
// ⚠️ Bandın ALTI 0.43'te, eşiğin (0.400) tam üstünde değil: eşikte
// `vYukseklik` v=0'a yakınsıyor ve bant kesitin taban ortasına doğru
// kayıyor.
[1, -1].forEach(function (s, i) {
    yuzeyYama('etek_' + (i + 1), [
        [-3.20, KEMER_BOS[0], 0.430, 0.700, s],
        [KEMER_BOS[1], 1.38, 0.430, 0.700, s]
    ], 9, 3, 0.008, C_ETEK, { metal: 0.15, rough: 0.72 });
});

// ---- BAGAJ KAPAKLARI ------------------------------------------------------
// Zeminin altında, koyu eteğin içinde iki dikdörtgen. Motokaravanın dış
// bagaj/garaj kapakları bunlar.
// ⚠️ "ÇUKUR" GÖRÜNÜMÜ NEGATİF `disari` İLE YAPILAMAZ: gövde kapalı bir
// kabuk, içeri ötelenen panel kabuğun içinde kalıp tamamen kayboluyor
// (denendi, ölçüldü). Doğrusu iki katman: önce KOYU çerçeve (gölge
// çizgisi), onun üstünde 6 mm daha dışarıda AÇIK kapak yüzü. Göz aradaki
// koyu şeridi gölge sanıyor ve kapak çukur okunuyor.
(function () {
    const cerceve = [], kapak = [];
    [1, -1].forEach(function (s) {
        [[-3.15, -2.30], [-0.60, 0.25]].forEach(function (b) {
            cerceve.push([b[0] - 0.020, b[1] + 0.020, 0.442, 0.678, s]);
            kapak.push([b[0], b[1], 0.462, 0.658, s]);
        });
    });
    yuzeyYama('bagaj_derz', cerceve, 4, 4, 0.011, '#23272c',
              { metal: 0.15, rough: 0.78 });
    yuzeyYama('bagaj_kapak', kapak, 4, 4, 0.017, C_LUK,
              { metal: 0.25, rough: 0.48 });
})();

// ---- TENTE KUTUSU ---------------------------------------------------------
// Çatı kenarının hemen altında boydan boya yatay kutu. MOTOKARAVANIN EN
// BELİRGİN YAN İŞARETİ: yandan bakışta düz beyaz duvarı boydan boya kesen
// tek çizgi bu; onsuz gövde kapalı kasa kamyona benziyor.
// ⚠️ `yuzeyYama` ile DEĞİL, gerçek hacimli bir extrude ile kuruluyor —
// kalınlıksız bir şerit tepeden bakışta (haritanın ana bakışı) kaybolur ve
// gölge de düşürmez. Kutu z 1.10 -> 1.27: iç yüzü gövdenin İÇİNDE (yan yüz
// 1.15), yani havada durmuyor; dışa 12 cm taşıyor.
// Kurulumu §6'daki `yuzParca` ile (şekil (z,y) düzleminde, +x'e extrude).

// ===========================================================================
// 6. EXTRUDE YARDIMCILARI + KABİN
// ===========================================================================
// Köşeleri yuvarlatılmış kapalı şekil. Her köşe, komşu kenarların yarısını
// geçmeyen bir yarıçapla kuadratik eğriye çevriliyor.
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

// ExtrudeGeometry şekli XY düzleminde kurup +Z'ye itiyor. Ön/arka yüz
// parçaları için şekil (z,y) düzleminde yazılıp +X'e itilmeli:
// rotateY(π/2) (x,y,z)'yi (z,y,-x)'e taşıyor, yani şeklin x'i model -z'ye
// düşüyor — bu yüzden noktalar önce negatifleniyor ve sırası ters çevriliyor
// (yön korunsun diye). Parça model x'inde `x`ten `x+derinlik`e uzanır.
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

// ---- KABİN ----------------------------------------------------------------
// Ducato benzeri hafif ticari araç kabini: eğik ön cam, kısa eğimli kaput,
// dik ön yüz, ön tekerlek kemeri.
//
// ⚠️ LOFT'A DEĞİL, AYRI BİR EXTRUDE'A kuruldu. Loft'a katmak denendi ve
// bırakıldı: kabin x'inde kesitin iki ayrı gövdesi olması gerekiyor (altta
// dar kabin, üstte geniş alkov, ikisinin arasında genişlik basamağı) ve
// `kesitNokta`nın tek parametreli, y'de monoton sözleşmesi bunu taşımıyor —
// `vYukseklik`in ikili araması basamakta kilitleniyordu.
//
// ⚠️ ŞEKİL YAN PROFİL (x-y), İTİŞ Z BOYUNCA. Yani extrude'un KAPAKLARI
// aracın yan yüzleri oluyor; `bevelEnabled` ile kenarlar yuvarlanıyor,
// keskin köşeli kutu gövdenin yanında oyuncak duruyordu.
// Bevel şeklin konturunu kapaklarda `bevelSize` kadar içeri çekiyor: kabin
// yan yüzüne konan her şey (cam, kapı derzi) konturdan en az 3 cm içeride
// olmak zorunda.
//
// ⚠️ ÖN KEMER burada, şeklin konturuna OYUK olarak işleniyor — loft'ta
// değil. Ön aks (+2.55) kabinin altında; loft o x'te zaten yerden 2.20
// yukarıda (alkovun altı).
//
// ⚠️⚠️ BEVEL TELAFİSİ — ÖLÇÜLDÜ, TAHMİN DEĞİL. THREE'nin ExtrudeGeometry'si
// `bevelSize`ı şeklin ana gövdesine DIŞARI doğru uyguluyor, içeri değil:
// ilk kurulumda şeklin burnu 3.50'de yazılmıştı ve `node kutu_olc.js`
// kabinin kutusunu 3.530 ölçtü (= şekil + bevelSize). Aynı ölçümde kemer
// yarıçapı 0.4659 çıktı (= 0.50 - bevel; oyuk bölgede "dışarı" oyuğun İÇİ
// demek, yani ağız KÜÇÜLÜYOR).
// SONUCU: ön yüze konan far/ızgara/tamponun hepsi (x <= 3.522) kabinin
// İÇİNDE kalmıştı, önden çizimde kabin kocaman boş bir levha görünüyordu.
// Çözüm: şeklin her kenarı, İSTENEN DIŞ YÜZEYDEN malzeme normali boyunca
// KABIN_PAH kadar içeri yazılıyor. Böylece bitmiş kabin tam olarak
// x 1.44..3.50, y 0.48..2.22, kemer yarıçapı 0.50 oluyor.
(function kabinKur() {
    const KP = KABIN_PAH;
    const pts = [];
    pts.push([KABIN_ARKA + KP, KABIN_ALT + KP]);
    // Kemer yayı: merkez (ON_X, AKS_Y), yarıçap KEMER_R. Yalnız kabinin alt
    // kenarının (0.48) ÜSTÜNDE kalan bölümü; kesişim açısı tam hesaplanıyor.
    // ⚠️ Yayın başlangıcına elle `lineTo` yazılmıyor: kayan noktada elle
    // yazılan kesişim x'i hesaplananla birebir eşit olmayabilir, arada sıfır
    // uzunlukta kenar kalır ve `yuvarlakSekil` orada sıfıra bölerdi.
    // Kemer: şekilde KEMER_R + KP yarıçapla yazılıyor ki bevel'den sonra
    // gerçek ağız 0.50 kalsın (arka kemerle birebir aynı).
    const KR = KEMER_R + KP;
    const kes = Math.sqrt(KR * KR -
                          (KABIN_ALT + KP - AKS_Y) * (KABIN_ALT + KP - AKS_Y));
    // Yay th0'dan (π - th0)'a iniyor: soldaki kesişimden tepeyi aşıp
    // sağdaki kesişime. th0 ~ 2.92 rad, bitişi ~ 0.22 rad.
    const th0 = Math.acos(-kes / KR);
    const N = 10;
    for (let i = 0; i <= N; i++) {
        const th = th0 - (2 * th0 - Math.PI) * i / N;
        pts.push([ON_X + KR * Math.cos(th), AKS_Y + KR * Math.sin(th)]);
    }
    pts.push([3.22 - KP, 0.470 + KP]);
    pts.push([KABIN_ON - KP, 0.520 + KP]);   // ön yüzün alt köşesi
    pts.push([KABIN_ON - KP, 1.360 - KP]);   // ön yüzün üst köşesi
    pts.push([3.40 - KP, 1.520 - KP]);       // kaput ön dudağı
    pts.push([3.02 - KP, 1.600 + KP]);       // kaput arkası = ön camın dibi
    pts.push([2.36 + KP, KABIN_UST - KP]);   // ön camın tepesi
    pts.push([KABIN_ARKA + KP, KABIN_UST - KP]);   // kabin çatısının arkası

    const geo = new THREE.ExtrudeGeometry(yuvarlakSekil(pts, 0.045), {
        depth: 2 * KABIN_Z - 2 * KABIN_PAH, bevelEnabled: true,
        bevelThickness: KABIN_PAH, bevelSize: KABIN_PAH, bevelSegments: 1,
        curveSegments: 3
    });
    geo.translate(0, 0, -(KABIN_Z - KABIN_PAH));   // z: -1.02 .. +1.02
    modelGroup.add(mesh(geo, C_KABIN, { metal: 0.30, rough: 0.44, name: 'kabin' }));
})();

// ---- ÖN CAM ---------------------------------------------------------------
// Kabinin eğik yüzüne oturan iki plaka (çerçeve + cam). Kutu, yüzün
// doğrultusuna `rotation.z` ile çevriliyor ve yüzey normali boyunca dışarı
// itiliyor; yüzeyin kendisi (3.02,1.60)-(2.36,2.22) doğrusu.
(function () {
    const a = [3.02, 1.600], b = [2.36, KABIN_UST];
    const dx = b[0] - a[0], dy = b[1] - a[1];
    const L = Math.sqrt(dx * dx + dy * dy);
    const th = Math.atan2(dy, dx);                 // plakanın uzun ekseni
    const nx = dy / L, ny = -dx / L;               // DIŞA bakan normal
    const mx = (a[0] + b[0]) / 2, my = (a[1] + b[1]) / 2;
    function plaka(ad, boy, kal, gen, ofs, renk, opts) {
        const m = mesh(new THREE.BoxGeometry(boy, kal, gen), renk,
                       Object.assign({ name: ad }, opts));
        m.position.set(mx + nx * ofs, my + ny * ofs, 0);
        m.rotation.z = th;
        modelGroup.add(m);
    }
    plaka('cam_on_cerceve', L - 0.03, 0.030, 1.940, 0.015, C_DIREK,
          { metal: 0.2, rough: 0.55 });
    plaka('cam_on', L - 0.13, 0.028, 1.820, 0.030, C_CAM,
          { metal: 0.35, rough: 0.14 });
    // Silecekler — kabinin ön camını "araç camı" yapan küçük ayrıntı.
    [-0.36, 0.30].forEach(function (o, i) {
        const s = mesh(new THREE.BoxGeometry(0.030, 0.022, 0.560), '#15181c',
                       { metal: 0.25, rough: 0.60, name: 'silecek_' + (i + 1) });
        // ⚠️ İşaret NEGATİF: th vektörü camın dibinden tepesine bakıyor,
        // pozitif katsayı silecekleri camın TEPESİNE koyuyordu.
        s.position.set(mx + nx * 0.044 - Math.cos(th) * (L * 0.30),
                       my + ny * 0.044 - Math.sin(th) * (L * 0.30), o);
        s.rotation.z = th;
        modelGroup.add(s);
    });
})();

// ---- KABİN YAN YÜZÜ: KAPI VE CAM ------------------------------------------
// Kabinin yan yüzü z=±1.02'de düz bir kapak; oraya konan her şey düz kutu
// olabiliyor (loft'taki gibi yüzey yaması gerekmiyor).
// ⚠️ Kapı derzi ÜÇ ŞERİT (ön, arka, alt) — dört kenarlı tam çerçeve değil:
// üst kenar zaten kabinin cam/çatı çizgisiyle örtüşüyor, oraya konan
// dördüncü şerit ön camın çerçevesiyle çakışıyordu.
[1, -1].forEach(function (s, i) {
    const zz = s * (KABIN_Z + 0.002);
    // kapı camı: çerçeve + cam
    const cerc = mesh(new THREE.BoxGeometry(0.640, 0.440, 0.014), C_DIREK,
                      { metal: 0.2, rough: 0.55, name: 'kabin_cam_cerceve_' + (i + 1) });
    cerc.position.set(2.010, 1.870, zz);
    modelGroup.add(cerc);
    const cam = mesh(new THREE.BoxGeometry(0.580, 0.380, 0.020), C_CAM,
                     { metal: 0.35, rough: 0.14, name: 'kabin_cam_' + (i + 1) });
    cam.position.set(2.010, 1.870, s * (KABIN_Z + 0.008));
    modelGroup.add(cam);
    // kapı derzi
    [[1.640, 0.028, 1.180, 1.545], [2.590, 0.028, 1.180, 1.545],
     [2.115, 0.950, 0.028, 0.990]].forEach(function (d, k) {
        const b = mesh(new THREE.BoxGeometry(d[1], d[2], 0.012), '#2a2f35',
                       { metal: 0.2, rough: 0.68, name: 'kabin_derz_' + (i * 3 + k + 1) });
        b.position.set(d[0], d[3], zz);
        modelGroup.add(b);
    });
    // kapı kolu
    const kol = mesh(new THREE.BoxGeometry(0.120, 0.040, 0.028), C_KROM,
                     Object.assign({ name: 'kabin_kol_' + (i + 1) }, KROM_MAL));
    kol.position.set(2.470, 1.560, s * (KABIN_Z + 0.014));
    modelGroup.add(kol);
});

// ---- ÖN YÜZ ---------------------------------------------------------------
// Kabinin ön kapağı x=3.50'de, y 0.52..1.36 arasında dik bir yüz (köşeler
// `yuvarlakSekil` ile 45 mm yuvarlatıldığı için parçalar 0.55..1.33
// zarfının içinde duruyor). z'de sınır ±0.99: kabin extrude'unun bevel'i
// (KABIN_PAH=0.03) konturu yan kapaklarda içeri çekiyor, ±1.02 yalnız
// yuvarlatılmış kenarın kendisi. Parçalar ±0.975'i geçmiyor.
// ⚠️ `yuzParca` geometriyi `x`ten `x+derinlik`e uzatıyor. Her parçanın
// `x + derinlik`i ön kapağı 5-30 mm GEÇMELİ; yoksa parça havada kalır ve
// kutu ölçüsü şişer. Ön yüzdeki en ileri nokta 3.515.
yuzParca('tampon_on',
         [[-0.985, 0.540], [0.985, 0.540], [0.985, 0.830], [-0.985, 0.830]],
         0.075, 3.430, 0.085, C_FASYA, { metal: 0.15, rough: 0.70 });
yuzParca('plaka_on',
         [[-0.205, 0.600], [0.205, 0.600], [0.205, 0.730], [-0.205, 0.730]],
         0.012, 3.500, 0.032, C_PLAKA, { metal: 0.05, rough: 0.85 });
// Izgara: iki farın arasında, ortada. Ducato yüzünün ana öğesi.
yuzParca('izgara_on',
         [[-0.470, 0.890], [0.470, 0.890], [0.470, 1.230], [-0.470, 1.230]],
         0.045, 3.455, 0.055, '#191d23', { metal: 0.3, rough: 0.60, flat: true });
yuzParca('izgara_cita',
         [[-0.430, 1.030], [0.430, 1.030], [0.430, 1.078], [-0.430, 1.078]],
         0.014, 3.492, 0.028, '#576069', { metal: 0.35, rough: 0.40 });
[1, -1].forEach(function (s, i) {
    yuzParca('far_' + (i + 1),
             [[s * 0.520, 0.870], [s * 0.955, 0.870], [s * 0.955, 1.240],
              [s * 0.520, 1.240]],
             0.045, 3.450, 0.062, C_FAR_IC, { metal: 0.5, rough: 0.30 });
    yuzParca('far_lens_' + (i + 1),
             [[s * 0.545, 0.895], [s * 0.800, 0.895], [s * 0.800, 1.215],
              [s * 0.545, 1.215]],
             0.032, 3.484, 0.038, C_FAR, { metal: 0.1, rough: 0.10 });
    yuzParca('sinyal_' + (i + 1),
             [[s * 0.818, 0.895], [s * 0.935, 0.895], [s * 0.935, 1.215],
              [s * 0.818, 1.215]],
             0.026, 3.484, 0.038, C_SINYAL, { metal: 0.2, rough: 0.28 });
    // Sis lambası — tamponun içinde, yüzü üç katlı yapan alt sıra.
    yuzParca('sis_' + (i + 1),
             [[s * 0.560, 0.600], [s * 0.760, 0.600], [s * 0.760, 0.740],
              [s * 0.560, 0.740]],
             0.026, 3.486, 0.036, '#8f9aa5', { metal: 0.2, rough: 0.22 });
});

// ---- ALKOV BURNU: YATAK BÖLMESİ PENCERESİ ---------------------------------
// Alkovun ön yüzündeki pencere. ⚠️ Koordinatlar GÖZ KARARI DEĞİL, loft'un
// ön kapağının ÖLÇÜLMÜŞ zarfından çıkarıldı (node kesit_olc.js --z 3.35 ...):
// kapak y 2.24..2.91 arasında, en geniş yeri yarı 1.03. Pencere o zarfın
// içinde, çevresinde boyalı kenar kalacak payla duruyor.
// Bu pencere alkovu "yatak bölmesi" olarak okutan tek işaret — onsuz burun
// kör bir kutu.
// ÖLÇÜLDÜ (node kesit_olc.js models/motokaravan.js --z 3.35 ...):
//   y=2.30 -> 0.906 · 2.40 -> 0.908 (en geniş) · 2.60 -> 0.871 ·
//   2.68 -> 0.849 · 2.72 -> 0.834 · 2.76 -> 0.776 · 2.79 -> 0.632
// ⚠️ İlk kurulum y=2.79'a kadar çıkıyor ve z=±0.680 idi: 2.79'da zarf
// yalnız 0.632, pencerenin üst köşeleri gövdenin DIŞINA taşıyordu. Üst
// kenar 2.72'ye indirildi (orada zarf 0.834, 17 cm pay var).
yuzParca('alkov_cerceve',
         [[-0.660, 2.380], [0.660, 2.380], [0.660, 2.720], [-0.660, 2.720]],
         0.070, 3.300, 0.062, C_CERCEVE, { metal: 0.15, rough: 0.60 });
yuzParca('alkov_cam',
         [[-0.598, 2.415], [0.598, 2.415], [0.598, 2.685], [-0.598, 2.685]],
         0.058, 3.336, 0.044, C_CAM, { metal: 0.35, rough: 0.16 });

// ---- TENTE KUTUSU (gövde yanında, hacimli) --------------------------------
// §5'te anlatılan sebeple yüzey yaması DEĞİL, gerçek hacim. z 1.10 -> 1.27:
// iç yüzü yan yüzün (1.15) İÇİNDE, yani havada durmuyor; dışa 12 cm taşıyor.
// Uçları `yuvarlakSekil` ile 5.5 cm yuvarlatıldı — keskin köşeli çubuk
// gövdenin yanında yapıştırma duruyordu.
[1, -1].forEach(function (s, i) {
    yuzParca('tente_' + (i + 1),
             [[s * 1.100, 2.660], [s * 1.272, 2.660],
              [s * 1.272, 2.850], [s * 1.100, 2.850]],
             0.055, -3.050, 4.400, C_TENTE, { metal: 0.25, rough: 0.55 });
});

// ---- ARKA YÜZ -------------------------------------------------------------
// Arka duvar kapağı x=-3.50'de. Ölçülmüş zarf: y 0.49..2.90, en geniş yarı
// 1.047 (gövdenin 1.15'i pah ile %9 daralmış). Parçalar bu zarfın içinde.
// ⚠️ Her parçanın x'i -3.545 civarında ve `x + derinlik` kapağı 3-8 cm
// geçiyor (parçalar kapağın İÇİNE gömülü kalsın, havada durmasın diye
// tersine değil: burada kapak arkada, parça ondan DAHA arkada başlıyor).
[1, -1].forEach(function (s, i) {
    // Stop grupları DİKEY ve UZUN — kamyon/karavan imzası.
    yuzParca('stop_' + (i + 1),
             [[s * 0.620, 0.880], [s * 0.965, 0.880], [s * 0.965, 1.560],
              [s * 0.620, 1.560]],
             0.050, -3.532, 0.058, C_STOP, { metal: 0.25, rough: 0.22 });
    yuzParca('stop_ic_' + (i + 1),
             [[s * 0.648, 0.910], [s * 0.940, 0.910], [s * 0.940, 1.210],
              [s * 0.648, 1.210]],
             0.038, -3.540, 0.040, C_STOP_K, { metal: 0.1, rough: 0.35 });
    yuzParca('stop_sinyal_' + (i + 1),
             [[s * 0.648, 1.255], [s * 0.940, 1.255], [s * 0.940, 1.530],
              [s * 0.648, 1.530]],
             0.038, -3.540, 0.040, C_SINYAL, { metal: 0.2, rough: 0.28 });
    // Arka pencereler İKİ TANE, merdivenin iki yanında. Tek geniş pencere
    // denendi ve bırakıldı: merdiven tam ortasından geçip camı ikiye
    // bölüyordu, "kırık cam" gibi okunuyordu.
    yuzParca('cam_arka_cerceve_' + (i + 1),
             [[s * 0.400, 1.780], [s * 0.960, 1.780], [s * 0.960, 2.350],
              [s * 0.400, 2.350]],
             0.070, -3.524, 0.052, C_CERCEVE, { metal: 0.15, rough: 0.60 });
    yuzParca('cam_arka_' + (i + 1),
             [[s * 0.440, 1.818], [s * 0.922, 1.818], [s * 0.922, 2.312],
              [s * 0.440, 2.312]],
             0.058, -3.548, 0.042, C_CAM, { metal: 0.35, rough: 0.16 });
    yuzParca('reflektor_' + (i + 1),
             [[s * 0.640, 0.560], [s * 0.840, 0.560], [s * 0.840, 0.670],
              [s * 0.640, 0.670]],
             0.022, -3.540, 0.030, '#8c2a24', { metal: 0.2, rough: 0.35 });
});
yuzParca('tampon_arka',
         [[-1.000, 0.500], [1.000, 0.500], [1.000, 0.790], [-1.000, 0.790]],
         0.075, -3.535, 0.075, C_FASYA, { metal: 0.15, rough: 0.70 });
yuzParca('plaka_arka',
         [[-0.205, 0.560], [0.205, 0.560], [0.205, 0.690], [-0.205, 0.690]],
         0.012, -3.542, 0.032, C_PLAKA, { metal: 0.05, rough: 0.85 });

// ===========================================================================
// 7. TEKERLEKLER
// ===========================================================================
// Grup deseni: grup rotation.x = π/2 ile yatırılıyor, rotation.y motora
// bırakılıyor. DÖRDÜ de modelGroup'un DOĞRUDAN çocuğu — motor ön tekerleri
// kendi steer grubuna alırken `inner.add(sg)` yapıyor, daha derinde
// olsalardı yerlerinden sökülürlerdi.
//
// ⚠️ ARKA AKS TEKİL (ikiz değil). Otobüste ikizdi; 3.5 tonluk Ducato şasi
// üzerine kurulan alkovlu motokaravanda arka aks tek tekerlidir ve bu, aracı
// kamyondan/otobüsten ayıran gerçek bir işaret. İkiz denendi ve bırakıldı:
// arkadan bakışta araç hafif ticariden çıkıp kamyona dönüşüyordu.
function tekerlek(ad, x, z) {
    const g = new THREE.Group();
    g.name = ad;
    g.position.set(x, AKS_Y, z);
    g.rotation.x = Math.PI / 2;
    const dis = (z > 0 ? 1 : -1);          // tekerin DIŞ yüzünün yönü

    // Lastik: torusun kesiti daire olduğu için et kalınlığı genişliği de
    // belirliyor; kamyonet lastiği (225/75) YÜKSEK YANAKLIDIR -> aks
    // doğrultusunda ölçekleniyor, kesit elipse dönüyor.
    const et = (R_TEKER - R_JANT) / 2;     // 0.0845 — 16" jantta kalın yanak
    const lastik = new THREE.TorusGeometry(R_TEKER - et, et, 6, 22);
    lastik.rotateX(Math.PI / 2);
    lastik.scale(1, LASTIK_GEN / (et * 2), 1);
    g.add(mesh(lastik, C_LASTIK, { rough: 0.95, name: ad + '_lastik' }));

    // Jant kovanı: AÇIK uçlu silindir (kapaklı olsaydı kapağı örterdi).
    const jant = mesh(new THREE.CylinderGeometry(R_JANT, R_JANT, LASTIK_GEN * 0.88,
                                                 16, 1, true),
                      C_JANT_K, { metal: 0.35, rough: 0.45, name: ad + '_jant' });
    jant.material.side = THREE.DoubleSide;
    g.add(jant);

    // Kamyonet janti: düz çelik disk + poyra kapağı. Yıldız kollu döküm
    // denendi ve bırakıldı — 16" jantta kol arası boşluk lastiğin gölgesinde
    // kalıyor, haritada hiç okunmuyor, yalnız üçgen harcıyordu.
    const disk = mesh(new THREE.CylinderGeometry(R_JANT * 0.96, R_JANT * 0.96,
                                                 0.018, 14),
                      C_JANT, { metal: 0.38, rough: 0.36, name: ad + '_kapak' });
    disk.position.y = dis * (LASTIK_GEN * 0.44);
    g.add(disk);
    const gobek = mesh(new THREE.CylinderGeometry(0.062, 0.062, 0.048, 10),
                       C_JANT_K, { metal: 0.4, rough: 0.34, name: ad + '_gobek' });
    gobek.position.y = dis * (LASTIK_GEN * 0.46);
    g.add(gobek);
    modelGroup.add(g);
}
tekerlek('teker_on_1', ON_X, IZ_Z);
tekerlek('teker_on_2', ON_X, -IZ_Z);
tekerlek('teker_arka_1', ARKA_X, IZ_Z);
tekerlek('teker_arka_2', ARKA_X, -IZ_Z);

// ---- davlumbaz (iç çamurluk) ----------------------------------------------
// ⚠️ Yay lastiğin İÇİNDE değil, lastikten HEMEN DIŞARIDA (yarıçap 0.386 ..
// 0.483; lastik 0.372, kemer dudağı 0.500). İçeride kalsaydı lastikle kemer
// dudağı arasındaki 128 mm'lik boşluk açık kalır, kemer ağzından öbür
// tarafın zemini görünür ve ağız kocaman bir delik gibi okunurdu.
// ⚠️ Halka dilimi EXTRUDE ediliyor, kısmi silindir DEĞİL: kalınlıksız kabuk
// aks doğrultusundan bakınca saç teli inceliğine düşüp kayboluyor.
// ⚠️ Dış yarıçap kemer dudağını GEÇMİYOR (17 mm içinde bitiyor): geçseydi
// koyu davlumbaz ile koyu lastik tek bir siyah leke halinde birleşip kemer
// ağzını yutardı (otobüste yakın plan çiziminde ölçüldü).
// Ön davlumbaz kabinin genişliğinde (1.02), arka gövdeninkinde (1.15).
[[ARKA_X, 0.40, 1.150], [ON_X, 0.40, 1.020]].forEach(function (a, k) {
    const ax = a[0], z1 = a[1], z2 = a[2];
    [1, -1].forEach(function (s, i) {
        const sh = new THREE.Shape();
        sh.absarc(0, 0, 0.483, -0.14, Math.PI + 0.14, false);
        sh.absarc(0, 0, 0.386, Math.PI + 0.14, -0.14, true);
        const geo = new THREE.ExtrudeGeometry(sh, {
            depth: z2 - z1, bevelEnabled: false, curveSegments: 8
        });
        geo.translate(0, 0, s > 0 ? z1 : -z2);
        geo.translate(ax, AKS_Y, 0);
        modelGroup.add(mesh(geo, C_DIP, { metal: 0.1, rough: 0.9,
                                          name: 'davlumbaz_' + (k * 2 + i + 1) }));
    });
});

// ---- kemer kuşağı (ağzın kenarını çizen koyu plastik) ---------------------
// ⚠️ Kemer ağzının kenarı yüzey yaması OLMAZ. Otobüste denendi ve
// GÖRÜNMEDİĞİ ÖLÇÜLDÜ: kesitin v ∈ [0, VA] bölümü kemer ağzının AŞAĞI bakan
// tavanıdır, şerit o rafın içine düşüyor ve dışarıdan hiç görünmüyor.
// Doğrusu gövdenin DIŞINDA duran gerçek bir halka dilimi.
// Yarıçap 0.489 -> 0.541: dudağın (0.500) 11 mm altından başlayıp 41 mm
// üstüne, gövdenin yanağına taşıyor. z: arka 1.146 -> 1.162 (gövde 1.150,
// dudak 1.139), ön 1.008 -> 1.026 (kabin 1.020). Kuşak her noktada 4-12 mm
// DIŞARIDA kalıyor, kenarında kendi ışık çizgisi oluşuyor — kemer ağzının
// okunmasını sağlayan tek şey bu.
[[ARKA_X, 1.146], [ON_X, 1.008]].forEach(function (a, k) {
    const ax = a[0], z1 = a[1];
    [1, -1].forEach(function (s, i) {
        const sh = new THREE.Shape();
        sh.absarc(0, 0, 0.541, -0.05, Math.PI + 0.05, false);
        sh.absarc(0, 0, 0.489, Math.PI + 0.05, -0.05, true);
        const geo = new THREE.ExtrudeGeometry(sh, {
            depth: 0.016, bevelEnabled: false, curveSegments: 9
        });
        geo.translate(0, 0, s > 0 ? z1 : -(z1 + 0.016));
        geo.translate(ax, AKS_Y, 0);
        modelGroup.add(mesh(geo, '#15191e', { metal: 0.15, rough: 0.80,
                                              name: 'kemer_kusak_' + (k * 2 + i + 1) }));
    });
});

// ---- alt taban ------------------------------------------------------------
// Düşük bakış açısında kemer ağzından ve eteğin altından altı görünmesin
// diye. Üst yüzü eşiğin (0.400) tam hizasında.
// ⚠️ PLAKA TEKERLERİN İÇİNDEN GEÇİYORDU — ÖLÇÜLDÜ VE DÜZELTİLDİ.
// Eski hâli tek kutuydu: 6.30 x 0.050 x 2.10, merkez (-0.30, 0.380, 0),
// yani z ±1.050. Lastiğin iç yüzü z=0.803, DIŞ yüzü 0.997 — plaka lastiği
// baştan sona kesip 53 mm dışına taşıyordu ve tam aks hizasında (y=0.372,
// plaka 0.355..0.405) kesiyordu, yani tekerin en geniş yerinde. Ölçüm: 16
// teker mesh'inin tepe noktaları plakanın içinde, en derin batma 17.00 mm.
// Ön/arka dört tekerde de aynı.
//
// ÇÖZÜM: plaka artık dikdörtgen değil, tekerleklerin hizasında ÇENTİKLİ.
// Tek mesh olarak kalıyor (ad `taban` değişmedi) çünkü plan konturu kapalı
// bir çokgen ve `ExtrudeGeometry` onu tek gövdede veriyor.
//   * çentiksiz bölümlerde yarı genişlik 1.050 (gövde o yükseklikte 1.135
//     yarı genişlikte — plaka gövdenin 85 mm içinde kalıyor)
//   * teker bölgelerinde 0.780 → lastiğin iç yüzüne 23 mm açıklık
//   * çentikler akstan ±0.450: lastik akstan ±0.372, yani 78 mm pay
// ⚠️ ÇENTİK GENİŞLİĞİ DAVLUMBAZA GÖRE, LASTİĞE GÖRE DEĞİL. Lastik akstan
// ±0.372, ama iç çamurluk (`davlumbaz_*`) ±0.482. Çentik ±0.520 seçildi ki
// plaka davlumbazın yayını da kesmesin (ölçüldü: eski plaka davlumbazın
// içine 4.52 mm giriyordu).
// ⚠️ ŞEKİL (x,z) DÜZLEMİNDE YAZILIR, extrude +z'ye gider; `rotateX(-π/2)`
// şeklin y'sini model −z'sine, extrude derinliğini model +y'sine çeviriyor.
// Kontur z'de simetrik olduğu için işaret dönmesi görüntüyü etkilemiyor.
(function () {
    const X1 = -3.45, X2 = 2.85;   // plakanın x uçları (eskisiyle aynı)
    const W = 1.050;               // çentiksiz yarı genişlik (eskisiyle aynı)
    const D = 0.780;               // çentikte yarı genişlik
    const C = 0.520;               // çentiğin akstan yarım boyu
    const A1 = AKS_X[0] - C, B1 = AKS_X[0] + C;   // arka teker çentiği
    const A2 = AKS_X[1] - C;       // ön teker çentiği plakanın ucuna kadar
    // Plan konturu (x, z). Saat yönünün TERSİ: önce −z kenarı soldan sağa,
    // sonra ön kenar, sonra +z kenarı sağdan sola.
    const KON = [
        [X1, -W], [A1, -W], [A1, -D], [B1, -D], [B1, -W],
        [A2, -W], [A2, -D], [X2, -D],
        [X2,  D], [A2,  D], [A2,  W], [B1,  W],
        [B1,  D], [A1,  D], [A1,  W], [X1,  W]
    ];
    const sh = new THREE.Shape();
    sh.moveTo(KON[0][0], KON[0][1]);
    for (let i = 1; i < KON.length; i++) sh.lineTo(KON[i][0], KON[i][1]);
    sh.closePath();
    const geo = new THREE.ExtrudeGeometry(sh, {
        depth: 0.050, bevelEnabled: false
    });
    geo.rotateX(-Math.PI / 2);
    geo.translate(0, 0.355, 0);
    modelGroup.add(mesh(geo, '#15181c',
                        { metal: 0.1, rough: 0.95, name: 'taban' }));
})();

// ===========================================================================
// 8. ÇATI — haritanın ANA bakışı burası
// ===========================================================================
// Haritada en çok kullanılan bakış yüksek eğimli (pitch 45-60), yani çatı
// yan yüz kadar görünür bir yüzey. 4.5 m'lik düz bir levha boş bırakılırsa
// araç tepeden bir konteyner gibi okunuyor. Ama ⚠️ ÇATI ÖĞELERİ PARLAK
// OLMAZ: otobüste açık gri ('#9aa3ac') kapaklar tepeden iki beyaz kare gibi
// patlayıp gözü araçtan çalmıştı. Çatı, gövde rengi + KOYU öğeler olarak
// okunmalı.

// ---- GÜNEŞ PANELLERİ ------------------------------------------------------
// İki panel, koyu, hafif yükseltilmiş. GERÇEK GÖLGE DÜŞÜRÜYORLAR
// (`yuzeyYama` değil, gerçek hacim; mesh varsayılan olarak castShadow açık).
// ⚠️ Tabanı çatının içine gömülü (3.020), tepesi belirgin biçimde üstünde
// (3.075). Çatı kubbeli olduğu için düz bir levhayı çatının ÜSTÜNE oturtmak
// ortada değdirip kenarlarda havada bırakıyor; gömmek şart. Ama çok gömmek
// de olmaz — otobüste ölçüldü, 6 cm kalınca panel çatıya BOYANMIŞ gibi
// duruyor, gölgesi bile olmuyordu. Burada panel z=±0.39'da duruyor, orada
// çatı 3.047; görünen kalınlık 28 mm + 20 mm çerçeve.
// ⚠️ YERLEŞİM ÖLÇÜLEREK DÜZELTİLDİ. İlk kurulumda paneller -2.55/-1.25'te
// (her biri 1.10 uzun, yani -3.10..-2.00 ve -1.80..-0.70) ve bacalar
// -2.85/0.65'teydi: baca 1 (-3.07..-2.63) panel 1'in TAM İÇİNDE kalıyordu,
// tepeden çizimde çatıda iki panel + TEK baca görünüyordu. Şimdi dördü de
// ayrık: panel -3.125..-2.175 ve -2.025..-1.075, baca -0.77..-0.33 ve
// 0.38..0.82. Hepsi çatının düz bölümünde (-3.15 .. 1.10).
[-2.65, -1.55].forEach(function (px, i) {
    const sh = yuvarlakSekil([[-0.475, -0.390], [0.475, -0.390],
                              [0.475, 0.390], [-0.475, 0.390]], 0.05);
    const geo = new THREE.ExtrudeGeometry(sh, {
        depth: 0.055, bevelEnabled: false, curveSegments: 3
    });
    geo.rotateX(-Math.PI / 2);      // (x,y,z) -> (x,z,-y): plan x-z'ye, itiş +y
    geo.translate(px, 3.020, 0);
    modelGroup.add(mesh(geo, C_PANEL_C, { metal: 0.35, rough: 0.55,
                                          name: 'gunes_cerceve_' + (i + 1) }));
    const cam = mesh(new THREE.BoxGeometry(0.860, 0.022, 0.680), C_PANEL,
                     { metal: 0.30, rough: 0.30, name: 'gunes_panel_' + (i + 1) });
    cam.position.set(px, 3.080, 0);
    modelGroup.add(cam);
    // Orta çıta: paneli ikiye bölüyor. ⚠️ Çıtasız panel tepeden bakışta
    // düpedüz bir PENCERE gibi okunuyordu (koyu, çerçeveli dikdörtgen);
    // gerçek güneş panelini panel yapan şey bölünmüş yüzeyidir.
    const cita = mesh(new THREE.BoxGeometry(0.030, 0.026, 0.680), C_PANEL_C,
                      { metal: 0.35, rough: 0.50, name: 'gunes_cita_' + (i + 1) });
    cita.position.set(px, 3.082, 0);
    modelGroup.add(cita);
});

// ---- HAVALANDIRMA BACALARI ------------------------------------------------
// Kapaklı kutular: koyu kaide + bir tık açık kapak. Motokaravan çatısının
// güneş panelinden sonraki ikinci imzası (biri banyo, biri yaşam alanı).
[-0.55, 0.60].forEach(function (bx, i) {
    const kaide = mesh(new THREE.BoxGeometry(0.440, 0.055, 0.440), C_BACA_A,
                       { metal: 0.10, rough: 0.82, name: 'baca_kaide_' + (i + 1) });
    kaide.position.set(bx, 3.030, 0);
    modelGroup.add(kaide);
    const kapak = mesh(new THREE.BoxGeometry(0.390, 0.038, 0.390), C_BACA_U,
                       { metal: 0.10, rough: 0.80, name: 'baca_kapak_' + (i + 1) });
    kapak.position.set(bx, 3.082, 0);
    modelGroup.add(kapak);
});

// ===========================================================================
// 9. ARKA MERDİVEN
// ===========================================================================
// Çatıya (panellere/bacalara) çıkan merdiven — motokaravanın arka yüzünün
// vazgeçilmez öğesi. İki ince dikey ray + dört basamak.
// ⚠️ Raylar arka duvardan 3-5 cm AÇIKTA duruyor (gerçek merdiven de öyle
// monte edilir) ve duvara ARA TAKOZLARLA bağlanıyor. Takozsuz denendi:
// raylar arka kapağın 22 mm önünde havada kalıyordu.
// ⚠️ Rayların TEPESİ 2.86'da bitiyor, çatıya (3.05) kadar çıkmıyor: arka
// kapağın ölçülmüş üst kenarı 2.90 ve ondan yukarısı boşluk. Çatıya bağlantı
// yatay bir üst çubukla yapılıyor, o çubuk x=-3.28'de gövdenin İÇİNE
// giriyor — gerçek merdivenin çatıya dönen kolu da budur.
(function () {
    const RX = -3.532;
    [1, -1].forEach(function (s, i) {
        const ray = mesh(new THREE.BoxGeometry(0.042, 1.840, 0.042), '#7b838c',
                         { metal: 0.40, rough: 0.42, name: 'merdiven_ray_' + (i + 1) });
        ray.position.set(RX, 1.940, s * 0.240);
        modelGroup.add(ray);
        // takozlar: rayı arka duvara bağlıyor
        [1.220, 2.560].forEach(function (ty, k) {
            const t = mesh(new THREE.BoxGeometry(0.090, 0.030, 0.030), '#5d646c',
                           { metal: 0.35, rough: 0.50,
                             name: 'merdiven_takoz_' + (i * 2 + k + 1) });
            t.position.set(RX + 0.042, ty, s * 0.240);
            modelGroup.add(t);
        });
    });
    [1.240, 1.700, 2.160, 2.620].forEach(function (by, k) {
        const b = mesh(new THREE.BoxGeometry(0.034, 0.030, 0.520), '#7b838c',
                       { metal: 0.40, rough: 0.42, name: 'merdiven_basamak_' + (k + 1) });
        b.position.set(RX, by, 0);
        modelGroup.add(b);
    });
    // üst kol: rayların tepesinden gövdenin içine giren yatay çubuk
    [1, -1].forEach(function (s, i) {
        const k = mesh(new THREE.BoxGeometry(0.290, 0.038, 0.038), '#7b838c',
                       { metal: 0.40, rough: 0.42, name: 'merdiven_kol_' + (i + 1) });
        k.position.set(RX + 0.130, 2.880, s * 0.240);
        modelGroup.add(k);
    });
})();

// ===========================================================================
// 10. AYNALAR
// ===========================================================================
// Motokaravan aynası UZUNDUR: yaşam kutusu kabinden 13 cm geniş olduğu için
// standart Ducato aynası arkayı göstermez, karavan aynası takılır. Kol
// gövdeden dışa uzanıyor, ucunda DÜŞEY dikdörtgen kasa, kasanın içinde İKİ
// GÖZ (üstte ana ayna, altta geniş açı aynası).
//
// ⚠️⚠️ KOL X=3.00'DEN X=2.45'E ALINDI — ÖLÇÜLDÜ. İlk kurulumda kol
// (3.000, 1.925) idi ve HAVADA DURUYORDU: kabinin o x'teki yüzeyi ön camın
// üstünde, y = 1.60 + (3.02-3.00)/0.66*0.62 = 1.619. Yani kol kaputun 30 cm
// üstünde, hiçbir şeye değmeden asılıydı (burun 3/4 çiziminde ölçüldü).
// x=2.45'te kabin y=2.135'e kadar var, kolun 1.95..2.01 aralığı gövdenin
// İÇİNDE kalıyor. Gerçek Ducato aynası da A direğine, kapı çerçevesinin
// üstüne bağlanır.
// ⚠️ KOL İLE KASA DEĞİYOR (kolun altı 1.950, kasanın üstü 1.985 -> 35 mm
// örtüşme). Otobüste ölçülmüştü: aradaki 79 mm'lik boşluk aynayı havada
// duran bir damla gibi gösteriyordu.
// ⚠️ Kasa KUTU, elipsoit değil: ölçeklenmiş küre önden bakışta damla
// veriyor, araç aynası ise NET BİR DİKDÖRTGEN olarak okunmalı.
// ⚠️ Aynalar direksiyonla DÖNMEZ, o yüzden teker gruplarının dışında,
// doğrudan modelGroup'un çocuğu. _TINT'e de girmiyorlar: her renkte koyu
// plastik kalsınlar.
[1, -1].forEach(function (s, i) {
    const kol = mesh(new THREE.BoxGeometry(0.075, 0.060, 0.260), C_DIREK,
                     { metal: 0.3, rough: 0.50, name: 'ayna_kol_' + (i + 1) });
    kol.position.set(2.450, 1.980, s * 1.150);   // z 1.020 .. 1.280
    modelGroup.add(kol);

    const kasa = mesh(new THREE.BoxGeometry(0.085, 0.460, 0.155), '#33383f',
                      { metal: 0.30, rough: 0.52, name: 'ayna_kasa_' + (i + 1) });
    kasa.position.set(2.440, 1.755, s * 1.245);  // y 1.525 .. 1.985
    modelGroup.add(kasa);

    // İki göz. Aralarındaki 45 mm'lik kasa yüzü onları ayırıyor — tek büyük
    // cam konsaydı kasa bir aynadan çok koyu bir levha gibi okunurdu.
    const anaCam = mesh(new THREE.BoxGeometry(0.018, 0.250, 0.112), C_CAM,
                        { metal: 0.4, rough: 0.08, name: 'ayna_cam_' + (i + 1) });
    anaCam.position.set(2.396, 1.855, s * 1.245);
    modelGroup.add(anaCam);
    const genisCam = mesh(new THREE.BoxGeometry(0.018, 0.130, 0.112), C_CAM,
                          { metal: 0.4, rough: 0.08,
                            name: 'ayna_cam_alt_' + (i + 1) });
    genisCam.position.set(2.396, 1.600, s * 1.245);
    modelGroup.add(genisCam);
});
