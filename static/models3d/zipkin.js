// Zıpkın arbaleti — NİŞANCISIYLA BİRLİKTE, yürüyüş hâlinde.
// Historical Warfare grubunun ikinci turundan.
//
// ⚠️ ID `zipkin`. Kütüphanede boştu (`ok`, `okcu`, `plaj-topu` başka
// modeller). EN adı "Harpoon Crossbow".
//
// ============================================================================
// VARSAYIM — MODEL NİŞANCISIYLA BİRLİKTE KURULDU
// ============================================================================
// Furkan'ın tarifi: "arbalet gibi görünen, büyük, İKİ ELLE NİŞAN ALINIP
// ATEŞLENEN zıpkın". Bu bir EL SİLAHI; sette tek başına duran bir silah
// tuhaf kaçar (kütüphanedeki her model haritada kendi başına bir işaret) ve
// "iki elle nişan alınıyor" bilgisi silahın kendisinde değil TUTAN FİGÜRDE
// okunur. Bu yüzden model silah + nişancı olarak kuruldu; yan fayda,
// `piyade`nin kanıtlanmış yürüyüş makinesinin doğrudan kullanılabilmesi.
// Varsayım ana oturumda Furkan'a bildirildi, itiraz gelmedi.
//
// ============================================================================
// REFERANS VE ÖLÇÜLERİN KAYNAĞI  (hiçbiri ezberden değil)
// ============================================================================
// Silah GERÇEK BİR MÜZE PARÇASI DEĞİL — kaynaklarda "arbalet + zıpkın +
// halat tamburu" birleşimi yok. BİRLEŞİM tasarım, ama HER ÖLÇÜ ölçülmüş bir
// parçadan geliyor ve nereden geldiği aşağıda yazılı.
//
//  * KUNDAK (tiller) 0.955 m. Metropolitan Museum 29.158.647, Orta Avrupa
//    (muhtemelen Avusturya), yak. 1425-75 arbaleti: L. 95.6 cm; W. 75.5 cm;
//    ağırlık 3989 g. Kundak boyu bu kaydın L'si.
//
//  * YAY KOLLARI AÇIKLIĞI (prod span) 0.762 m. Üç ölçülmüş Met kaydının EN
//    GENİŞİ: 48.149.36a (yak. 1560-80, Bavyera) W. 60.9 cm; 29.158.647
//    W. 75.5 cm; 29.16.14 (15. yy, Alman/Avusturya) W. 30 in = 76.2 cm.
//    "Büyük" isteğinin ölçülmüş ÜST SINIRI bu; uydurmayla büyütülmedi.
//
//  * ÇEKİŞ YOLU (power stroke) 0.150 m. Çelik yaylı arbaletin ayırt edici
//    özelliği: çekiş ağırlığı 500-1200 lb'ye çıkarken çekiş yolu yaklaşık
//    15 cm'de kalır (uzun yayın 75 cm'i yanında).
//
//  * KURMA KRİKOSU (cranequin) L. 0.359 m, W. 0.088 m, 2.343 kg.
//    Met 48.149.36b katalog ölçüsü (16. yy ilk yarısı, Güney Almanya).
//    Kriko KURMADAN SONRA SÖKÜLÜR — modelde nişancının kemerinde asılı,
//    silahın üstünde değil. Denge hesabına da bu yüzden GİRMİYOR.
//
//  * ZIPKIN BAŞI iki-yüzgeçli (two-flue) kalıp: geriye süpürülmüş iki
//    çengel + yarık kovan. BİÇİM oradan; ÖLÇÜ oradan ALINAMAZ ve sebebi
//    ölçülü: New Bedford'lu gemi demircisi James Durfee kalıbındaki
//    iki-yüzgeçli balina zıpkını demiri uçtan yarık kovanın sonuna
//    36¾ in = 0.933 m ve el zıpkını 5-6 ft (1.5-1.8 m) ahşap bir sırığa
//    geçiyor. 0.933 m'lik bir demir 0.955 m'lik bir kundağın oluğuna
//    girmez. Bu yüzden zıpkının TOPLAM BOYU silah geometrisinden çözüldü
//    (aşağıda); kalıptan yalnız başın biçimi alındı.
//
//  * HALAT çapı 0.017 m. Melville, Moby-Dick 60. bölüm: balina halatı
//    "only two thirds of an inch in thickness" = 16.9 mm. Kenevir/manila.
//
//  * NİŞANCININ BOYU 1.715 m. Steckel'in 9.-19. yy Kuzey Avrupa iskelet
//    serisinde ortaçağ erkek ortalaması ~171 cm. (Karşılaştırma: modern
//    `piyade` 1.800 m, `mizrakli-piyade` 1.705 m — Klasik dönem Yunan
//    ortalaması. Üç figürün boyu üç ayrı dönem ölçüsünden geliyor.)
//    Uzuv oranları antropometrik: femur başı boyun %53'ü, uyluk %24.5,
//    baldır %23.9, ayak %14.3.
//
// ============================================================================
// ZIPKININ BOYU — SİLAH GEOMETRİSİNDEN ÇÖZÜLDÜ
// ============================================================================
// Kundak ekseni üzerinde τ, dipçik arka yüzünden ölçülüyor (metre):
//   τ = 0.845  yay kolları (prod) ekseni
//   τ = 0.785  kirişin BOŞ (brace) konumu   = 0.845 - 0.060 brace yüksekliği
//   τ = 0.635  CEVİZ (nut) = kurulu kirişin yeri = 0.785 - 0.150 çekiş yolu
//   τ = 0.955  kundak burnu
// Zıpkının kertiği cevizde durmak zorunda (τ = 0.635). Uç kundak burnunu
// 0.540 m geçiyor — okunur bir zıpkın için gereken en kısa taşma; daha azı
// arbalet oku gibi görünüyor, daha çoğu figürün önünde sallanan bir sırık.
// Toplam boy = 0.955 - 0.635 + 0.540 = 0.860 m. Bölüntü (kertikten):
//   0.000-0.045 kertik kütüğü      0.045-0.305 dişbudak arka sap
//   0.305-0.605 demir şank         0.605-0.660 kovan + halat halkası
//   0.660-0.860 iki-yüzgeçli baş (yüzgeç açıklığı 0.078 m)
//
// ============================================================================
// TUTUŞ NOKTASI EZBERDEN YAZILMADI — DENGE NOKTASI HESAPLANDI
// ============================================================================
// Her parçanın kütlesi hacim x yoğunluktan, ağırlık merkezi τ'dan:
//   kundak (ceviz 660)           2.752 kg   τ 0.362
//   yay çeliği (7850)            2.477 kg   τ 0.845
//   zıpkın (demir 7870+dişbudak) 1.527 kg   τ 1.195
//   halat tamburu + 9.2 m halat  2.661 kg   τ 0.430
//   üzengi (demir)               0.374 kg   τ 0.945
//   tetik + ceviz + aksam        0.520 kg   τ 0.240
//   TOPLAM 10.311 kg  (kriko HARİÇ — kurmadan sonra kemere asılıyor)
//   x_denge = 6.5346 / 10.311 = 0.634 m
// ÖN EL tam burada: dipçikten 0.634 m ileride. ARKA EL tetik kabzasında,
// τ = 0.252. İki el arası 0.382 m — omuzdan ateşlenen bir silahın el arası
// (modern tüfekte 0.30-0.40 m).
// ⚠️ TAMBURUN YERİ BU HESABIN SONUCU. Tambur çıkarılınca denge τ 0.705'e
// kayıyor (+0.071 m) ve el arası 0.453 m'ye çıkıyor — iki elle rahat
// tutulamayacak kadar açık. Tambur kundağın ALTINA ve ön elin GERİSİNE
// (τ 0.430) konarak dengeyi 71 mm geri çekiyor. Yani halat tamburu yalnız
// halatı taşımıyor, silahı tutulabilir kılıyor.
//
// ============================================================================
// YAY KOLLARININ AÇISI — KİRİŞ UZUNLUĞUNDAN ÇÖZÜLDÜ
// ============================================================================
// Kol yarım açıklığı a = 0.381 m, kök etrafında rijit dönüyor (θ = geriye
// süpürme açısı). Kiriş uzamaz.
//   BOŞ (brace):  θ0 = 2.00°, kiriş tepesi yay ekseninin 0.060 m gerisinde
//                 -> L/2 = sqrt(a² cos²θ0 + (0.060 - a sinθ0)²) = 0.383623 m
//   KURULU:       tepe 0.150 m daha geride (çekiş yolu). Aynı denklem
//                 sinθ1 için LİNEER çıkıyor:
//                   0.147167 = 0.189261 - 0.16002 sinθ1  ->  sinθ1 = 0.26305
//                 θ1 = 15.25°.  Uç a(sinθ1 - sinθ0) = 0.0869 m geri gidiyor.
// Model KURULU pozda (θ1) kuruluyor: taşınan silah dolu ve kurulu.
// Ateşleme çevriminde kollar θ1 -> θ0 boşalıp kriko ile θ0 -> θ1 geriliyor;
// kirişin tepe noktası HER KAREDE aynı denklemden çözülüyor, ayrı bir
// animasyon eğrisi YOK.
//
// ============================================================================
// TAMBUR KAPASİTESİ — ÖLÇÜLDÜ, UYDURULMADI
// ============================================================================
// Göbek Ø0.090, yanak Ø0.190, iç genişlik 0.130 m. Sarım halkası derinliği
// (0.190-0.090)/2 = 0.050 m -> 0.017 m'lik halattan ~2.9 kat. Kat başına
// 0.130/0.017 = 7 sarım, ortalama çevre π x 0.140 = 0.440 m.
//   3 x 7 x 0.440 = 9.2 m halat.
// Ateşlemede tambur bu 9.2 m boyunca dönüyor (toplam 131.4 rad = 7530°),
// sonra duruyor: halat bitti.
//
// ============================================================================
// AYIRT EDİCİ ÇİZGİLER (sette üç yaya insan var)
// ============================================================================
//   piyade          kutu 1.010 x 1.800 x 0.517  (uzun ekseni TÜFEK)
//   mizrakli-piyade kutu ~2.43 x ~1.82 x ~0.90  (uzun ekseni MIZRAK)
//   zipkin          kutu ~1.46 x ~1.72 x ~0.73
// Zıpkının imzası tepeden bakışta ENİNE bir çizgi: yay kolları kundağa DİK
// ve 0.762 m'lik bir T kolu veriyor. Mızrak ve tüfek gövdeyle AYNI
// doğrultuda; okçunun yayı DÜŞEY düzlemde, yani tepeden yine kısa bir leke.
// Enine kolu olan tek figür bu. Sayılar zipkin_tepe_kiyas.py'de.
//
// ============================================================================
// PARÇA / GRUP SÖZLEŞMESİ (studio-3d.js `registerBehavior('zipkin')`)
// ============================================================================
//   kalca_grup   : bütün figür. Davranış YALNIZ position.y yazar.
//   bacak_1/2    : kalça mafsalı. rotation.z = uyluk açısı (+ = ileri).
//   diz_1/2      : diz mafsalı (bacak_i'nin çocuğu). rotation.z = -diz bükümü.
//   ayak_1/2     : bilek mafsalı (diz_i'nin çocuğu). rotation.z = ayak eğimi.
//   omuz_grup    : omuz kuşağı + iki kol + SİLAH. rotation.y = yürüyüşün
//                  karşı-dönüşü + NİŞAN dönüşü (TOPLANIYOR, ikisi de mutlak).
//                  rotation.z = geri tepmede geri yaslanma.
//   silah_grup   : silahın tamamı. omuz_grup'un çocuğu, KENDİ DÖNMÜYOR —
//                  "silah gövdeyle birlikte gider" şartının taşıyıcısı ve
//                  aynı zamanda ELİN SİLAH ÜZERİNDE KAYMAMASININ garantisi.
//   yay_grup_1/2 : yay kolları. quaternion = axisAngle(WV, ±θ).
//   tetik_grup   : tetik kolu. quaternion = axisAngle(WE, açı).
//   tambur_grup  : halat tamburu. quaternion = axisAngle(WE, açı).
//   zipkin_grup  : zıpkın. position + quaternion (uçuş).
//   kiris_1/2    : birim silindir, her karede iki uç noktadan kuruluyor.
//   halat        : birim silindir, tambur çıkışından zıpkın halkasına.
//   userData.zipkin      : bacak zincirinin ölçüleri (adım buradan çözülür)
//   userData.zipkinSilah : silah çerçevesi + çevrimin okuduğu bütün sayılar
//
// ⚠️ 1/2 numaralandırması: bacak_1 = model +z tarafı, _2 = -z tarafı.
// ⚠️ HARİTA SOLDAN SAĞA AYNALIYOR (devir §5.3, det(projection) < 0). Ham
// koordinatta -z ürünün SAĞI. Dipçik ham -z omzunda, tetik eli ham -z,
// destek eli ham +z kolundan gövdeyi çaprazlayarak geliyor — ürün bunu
// aynalayıp sağ omuz / sağ el tetik / sol el destek yapıyor, yani SAĞ ELLİ
// bir nişancı. Düz bir THREE sahnesinde ters görünür, o NORMALDİR.
// ⚠️ SİLAHA HARF/YAZI KOYULMADI (aynalanır, ters okunur).
//
// YÖN: burun +x, üst +y, taban y=0. Ölçüler gerçek metre.
//
// ============================================================================
// 0. RENKLER
// ============================================================================
// ⚠️ metalness KURALI (devir §5.1, iki uçlu): 0.85+ neredeyse SİYAH (sahnede
// environment map yok), ama metalness'i DÜŞÜRMEK açık renkte patlamayı
// ARTIRIR. Burada tepe pikselinin büyük kısmı YAY ÇELİĞİ + zıpkın demiri:
// metal 0.40 / rough 0.32'de oturdu. Palet parlaklik.py ile TARANDI — tek
// renk değil, PALETİN TAMAMI (zipkin_palet_tara.py).
// Palet bilerek kardeşlerinden UZAK: mizrakli-piyade #8c4a3c, sovalye
// #8e3a34, kadirga #6d4a31 — üçü de sıcak kırmızı/kahve. Bu figür woad
// mavisi (Avrupa'da halkın en yaygın boyası) ile ayrılıyor.
const C_TUNIK   = '#3f5a6b';   // denizci ceketi (woad) — _TINT birincil varsayılanı
const C_TUNIK_K = '#33495a';   // ceketin koyu yakası
const C_BASLIK  = '#7c3f34';   // örgü başlık
const C_PANTOL  = '#6b6152';   // diz altı pantolon (kaba yün)
const C_AHSAP   = '#7a5233';   // kundak + zıpkın sapı — _TINT ikincil varsayılanı
const C_AHSAP_K = '#5e3f27';   // koyu ahşap (oluk, tambur göbeği, yanak)
const C_CELIK   = '#6b7078';   // yay çeliği, zıpkın demiri, üzengi
const C_CELIK_K = '#4d5259';   // koyu demir aksam (tetik, bilezik, kriko)
const C_PIRINC  = '#9a7c43';   // pirinç bilezik, tambur yanağı, kemer tokası
const C_DERI    = '#6b543c';   // kemer, omuz pedi, ayakkabı
const C_DERI_K  = '#493a2a';   // koyu deri, sakal
const C_HALAT   = '#b0a179';   // kenevir halat + kiriş + ceviz
const C_TEN     = '#ac8368';   // yüz, kollar, baldırlar
const C_KOYU    = '#1d1e21';   // göz yarığı

// ============================================================================
// 1. TEMEL ÖLÇÜLER
// ============================================================================
const BOY       = 1.715;
const HIP_Y     = 0.909;   // femur başı (boyun %53'ü)
const HIP_Z     = 0.094;
const UYLUK     = 0.4195;  // kalça → diz  (%24.5)
const BALDIR    = 0.4094;  // diz → bilek  (%23.9)
const BILEK_Y   = HIP_Y - UYLUK - BALDIR;   // = 0.0801
const TABAN_DY  = -BILEK_Y;                 // taban TAM y=0'da
const TOPUK_X   = -0.070;
const BURUN_X   = 0.1753;  // ayak boyu 0.2453 = boyun %14.3'ü
const AYAK_W    = 0.053;
const OMUZ_Y    = 1.348;
const OMUZ_Z    = 0.168;

// ---- SİLAH ÇERÇEVESİ -------------------------------------------------------
// Dipçik arka yüzü B; eksen WU; WE yay kolu ekseni; WV silahın "üst"ü.
// (WU, WE, WV) sağ el üçlüsü: WU x WE = WV.
// WU, dipçiği sağ kaburganın DIŞINDA (ham -z) tutup ön eli gövde ortasına
// getiren doğrultu: yaw +16.14°, pitch -4.09°. Yaw'ın gerekçesi geometrik:
// daha küçük bir yaw'da kundak τ≈0.25 civarında gövdenin İÇİNDEN geçiyor
// (gövde yarı eni belde 0.150 m, dipçik z'si -0.215 m).
const B_X = -0.150, B_Y = 1.145, B_Z = -0.215;
const WU = [0.958142, -0.071319, 0.277269];
const WE = [0.277977,  0.000000, -0.960588];
const WV = [0.068508,  0.997453,  0.019823];
const NWV = [-WV[0], -WV[1], -WV[2]];
const NWE = [-WE[0], -WE[1], -WE[2]];
// Nişan dönüşü: gövde bu kadar dönünce silah ekseninin YATAY izdüşümü +x
// oluyor (atan2(WU.z, WU.x) = 16.14°). Kalan -4.09° namlunun doğal düşük
// duruşu. ⚠️ Nişan alma neden GÖVDE dönüşü: silah omuz_grup'un içinde ve
// eller silahta; gövde dönerse el silah üzerinde HİÇ kaymaz (ölçüldü:
// 0.000 m). Silahı kendi başına döndürseydik arka el 0.35 m kolun ucunda
// santimetrelerce kayardı.
const NISAN_YAW = Math.atan2(WU[2], WU[0]);

const T_DIPCIK  = 0.120;   // dipçik bloğunun bittiği yer
const T_TETIK   = 0.240;   // tetik mili
const T_EL_ARKA = 0.252;   // ARKA EL (tetik kabzası)
const T_TAMBUR  = 0.430;   // tambur ekseni (kundağın altında)
const T_EL_ON   = 0.634;   // ÖN EL = DENGE NOKTASI (hesap yukarıda)
const T_CEVIZ   = 0.635;   // ceviz (nut) = kurulu kirişin tepesi
const T_YAY     = 0.845;   // yay kolları ekseni
const T_UZENGI  = 0.945;
const T_BURUN   = 0.955;   // kundak burnu

// ⚠️ İLK KURULUMDA ÖLÇÜLDÜ VE DÜZELTİLDİ: oluk 0.038'de, zıpkın 0.048'de
// iken kundağın üst yüzü (0.055) zıpkını yarısına kadar YUTUYORDU — dişbudak
// sap hiç görünmüyordu, yani ikincil rengin silah-ahşabı yüzeyi de yoktu.
// Sıra yukarıdan aşağı: zıpkın ekseni 0.064, oluk sırtı 0.060, kundak üstü
// 0.055, kiriş/yay ekseni 0.040.
const V_EKSEN   = 0.040;   // kirişin ve yayın kundak ekseninden yüksekliği
const V_OLUK    = 0.064;   // zıpkın ekseninin yüksekliği

const YAY_A     = 0.381;   // yay kolu yarım açıklığı (0.762 / 2)
const KIRIS_L2  = 0.383623;// yarım kiriş boyu (yukarıda çözüldü)
const TETA_BOS  = 2.00  * Math.PI / 180;
const TETA_KURU = 15.25 * Math.PI / 180;

const TAMBUR_R  = 0.095;   // yanak yarıçapı
const TAMBUR_RG = 0.045;   // göbek yarıçapı
const TAMBUR_W  = 0.130;   // iç genişlik
const TAMBUR_RM = 0.070;   // sarımın ortalama yarıçapı (halat çıkışı)
const TAMBUR_V  = -0.092;  // tambur ekseninin kundak ekseninden derinliği
const HALAT_R   = 0.0085;  // halat yarıçapı (çap 0.017)
const HALAT_KAP = 9.20;    // tamburun aldığı halat (m) — hesabı yukarıda

const Z_BOY     = 0.860;   // zıpkın toplam boyu (silah geometrisinden)
const Z_FLU     = 0.048;   // yüzgeç yarı açıklığı (açıklık 0.096)
const Z_HALKA   = 0.632;   // halat halkasının zıpkın üzerindeki yeri

// ============================================================================
// 2. MONOTON KÜBİK EĞRİ (PCHIP) — otomobil.js §2 ile aynı gerekçe
// ============================================================================
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

// ============================================================================
// 3. LOFT MAKİNESİ (piyade.js §3 ile aynı — insan gövdesi kutu yığınıyla olmaz)
// ============================================================================
function halkaNokta(s, a) {
    const ca = Math.cos(a), sa = Math.sin(a);
    const us = s.us == null ? 1.0 : s.us;
    const sx = ca < 0 ? -1 : 1, sz = sa < 0 ? -1 : 1;
    let x = s.d * sx * Math.pow(Math.abs(ca), us);
    const z = s.w * sz * Math.pow(Math.abs(sa), us);
    if (s.bomb) x += s.bomb * Math.max(0, ca) * Math.max(0, ca);
    if (s.yassi && x < 0) x *= s.yassi;
    return [x + (s.ox || 0), z + (s.oz || 0)];
}

function loft(ad, n, ist, renk, opts) {
    opts = opts || {};
    const P = [], IDX = [], M = ist.length;
    for (let i = 0; i < M; i++) {
        const s = ist[i];
        for (let j = 0; j < n; j++) {
            const p = halkaNokta(s, 2 * Math.PI * j / n);
            P.push(p[0], s.y, p[1]);
        }
    }
    for (let i = 0; i < M - 1; i++) {
        for (let j = 0; j < n; j++) {
            const j2 = (j + 1) % n;
            const a = i * n + j, b = i * n + j2;
            const c = (i + 1) * n + j, d2 = (i + 1) * n + j2;
            IDX.push(a, c, d2, a, d2, b);
        }
    }
    if (!opts.acikAlt) kapakEkle(P, IDX, ist[0], n, false);
    if (!opts.acikUst) kapakEkle(P, IDX, ist[M - 1], n, true);
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.Float32BufferAttribute(P, 3));
    geo.setIndex(IDX);
    geo.computeVertexNormals();
    const m = mesh(geo, renk, {
        metal: opts.metal == null ? 0.08 : opts.metal,
        rough: opts.rough == null ? 0.86 : opts.rough,
        flat: !!opts.flat, name: ad
    });
    (opts.ebeveyn || modelGroup).add(m);
    return m;
}

function kapakEkle(P, IDX, s, n, ust) {
    let mx = 0, mz = 0;
    const h = [];
    for (let j = 0; j < n; j++) { const p = halkaNokta(s, 2 * Math.PI * j / n); h.push(p); mx += p[0]; mz += p[1]; }
    const merkez = P.length / 3;
    P.push(mx / n, s.y, mz / n);
    const bas = merkez + 1;
    for (let j = 0; j < n; j++) P.push(h[j][0], s.y, h[j][1]);
    for (let j = 0; j < n; j++) {
        const a = bas + j, b = bas + (j + 1) % n;
        if (ust) IDX.push(merkez, b, a); else IDX.push(merkez, a, b);
    }
}

function istUret(y0, y1, N, eD, eW, opts) {
    opts = opts || {};
    const ist = [];
    for (let i = 0; i < N; i++) {
        const y = y0 + (y1 - y0) * i / (N - 1);
        ist.push({ y: y, d: eD(y), w: eW(y),
                   us: opts.eUs ? opts.eUs(y) : (opts.us == null ? 1.0 : opts.us),
                   ox: opts.eOx ? opts.eOx(y) : (opts.ox || 0),
                   oz: opts.oz || 0,
                   bomb: opts.eBomb ? opts.eBomb(y) : (opts.bomb || 0),
                   yassi: opts.yassi || 0 });
    }
    return ist;
}

// İKİ NOKTA ARASI UZUV — kol/bacak/boyun/çubuk. r = [[t, yarıçap, yassılık]].
function uzuv(ad, A, B, r, n, renk, opts) {
    opts = opts || {};
    const vx = B[0] - A[0], vy = B[1] - A[1], vz = B[2] - A[2];
    const L = Math.sqrt(vx * vx + vy * vy + vz * vz) || 1;
    const ux = vx / L, uy = vy / L, uz = vz / L;
    let ax = 0, ay = 0, az = 1;
    if (Math.abs(uz) > 0.9) { ax = 1; ay = 0; az = 0; }
    let ex = ay * uz - az * uy, ey = az * ux - ax * uz, ez = ax * uy - ay * ux;
    const e = Math.sqrt(ex * ex + ey * ey + ez * ez) || 1;
    ex /= e; ey /= e; ez /= e;
    const fx = uy * ez - uz * ey, fy = uz * ex - ux * ez, fz = ux * ey - uy * ex;
    const P = [], IDX = [], M = r.length;
    for (let i = 0; i < M; i++) {
        const t = r[i][0], rr = r[i][1], sq = r[i][2] == null ? 1 : r[i][2];
        const cx = A[0] + ux * L * t, cy = A[1] + uy * L * t, cz = A[2] + uz * L * t;
        for (let j = 0; j < n; j++) {
            const a = 2 * Math.PI * j / n, ca = Math.cos(a), sa = Math.sin(a);
            const p = rr * ca, q = rr * sa * sq;
            P.push(cx + ex * p + fx * q, cy + ey * p + fy * q, cz + ez * p + fz * q);
        }
    }
    for (let i = 0; i < M - 1; i++) {
        for (let j = 0; j < n; j++) {
            const j2 = (j + 1) % n;
            const a = i * n + j, b = i * n + j2;
            const c = (i + 1) * n + j, d2 = (i + 1) * n + j2;
            // ⚠️ SARIM: burada uclu (e, f, u) SAG ellidir (e x f = u), yani
            // halka u etrafinda CCW ilerliyor; CCW halkada (a, c, d2)
            // sirasinin normali U x T = -radyal, ICE bakar. Ayni sira bu
            // dosyanin loft'unda DOGRU calisiyor cunku oradaki halka +y
            // etrafinda CW yaziliyor. Sira ters cevrildi.
            IDX.push(a, d2, c, a, b, d2);
        }
    }
    for (let uc = 0; uc < 2; uc++) {
        const i = uc ? M - 1 : 0;
        const t = r[i][0];
        const cx = A[0] + ux * L * t, cy = A[1] + uy * L * t, cz = A[2] + uz * L * t;
        const merkez = P.length / 3;
        P.push(cx, cy, cz);
        const bas = merkez + 1;
        const rr = r[i][1], sq = r[i][2] == null ? 1 : r[i][2];
        for (let j = 0; j < n; j++) {
            const a = 2 * Math.PI * j / n;
            const p = rr * Math.cos(a), q = rr * Math.sin(a) * sq;
            P.push(cx + ex * p + fx * q, cy + ey * p + fy * q, cz + ez * p + fz * q);
        }
        for (let j = 0; j < n; j++) {
            const a = bas + j, b = bas + (j + 1) % n;
            // ⚠️ Kapaklar da yan yuzeylerle ayni sebeple ters.
            if (uc) IDX.push(merkez, a, b); else IDX.push(merkez, b, a);
        }
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.Float32BufferAttribute(P, 3));
    geo.setIndex(IDX);
    geo.computeVertexNormals();
    const m = mesh(geo, renk, {
        metal: opts.metal == null ? 0.08 : opts.metal,
        rough: opts.rough == null ? 0.86 : opts.rough, name: ad
    });
    (opts.ebeveyn || modelGroup).add(m);
    return m;
}

function kure(ad, r, pos, renk, opts) {
    opts = opts || {};
    const geo = new THREE.SphereGeometry(r, opts.seg || 12, opts.seg2 || 8);
    if (opts.olcek) geo.scale(opts.olcek[0], opts.olcek[1], opts.olcek[2]);
    geo.translate(pos[0], pos[1], pos[2]);
    const m = mesh(geo, renk, {
        metal: opts.metal == null ? 0.08 : opts.metal,
        rough: opts.rough == null ? 0.86 : opts.rough, name: ad
    });
    (opts.ebeveyn || modelGroup).add(m);
    return m;
}

function kutu(ad, sx, sy, sz, pos, renk, opts) {
    opts = opts || {};
    const geo = new THREE.BoxGeometry(sx, sy, sz);
    geo.translate(pos[0], pos[1], pos[2]);
    const m = mesh(geo, renk, {
        metal: opts.metal == null ? 0.30 : opts.metal,
        rough: opts.rough == null ? 0.55 : opts.rough,
        flat: opts.flat !== false, name: ad
    });
    (opts.ebeveyn || modelGroup).add(m);
    return m;
}

// ============================================================================
// 3b. EĞİK EKSENDE SÜRME — silahın TAMAMI bununla kuruluyor
// ============================================================================
// ⚠️ NEDEN AYRI BİR MAKİNE: `loft` kesiti +y boyunca sürüyor, `uzuv` ise
// dairesel. Kundak, oluk, yay kolu, tambur ve zıpkın EĞİK bir eksende ve
// DİKDÖRTGENE yakın kesitli; ikisiyle de kurulamıyor. Burada kesit (E, V)
// düzleminde süper-elips, sürme ekseni U.
//
// SARIM TÜRETİMİ (loft'unkinin TERSİ, kanıtı burada):
//   P = O + U t + E e cosθ + V v sinθ,  ve triad U x E = V (ŞART).
//   (a,c,d2) sırasının normali ∝ U x T,  T = dP/dθ = -E e sinθ + V v cosθ.
//   U x E = V, U x V = -E  =>  U x T = -(v cosθ) E - (e sinθ) V.
//   Dış radyal yön (e cosθ) E + (v sinθ) V ile iç çarpım = -e v < 0: İÇE
//   bakıyor. Bu yüzden sarım TERS yazıldı: (a,d2,c) + (a,b,d2). Kapaklar da
//   aynı sebeple loft'un tersi.
// ⚠️ ÇAĞIRIRKEN U x E = V ŞARTINI SAĞLA. WE ekseninde sürerken V = -WV,
// -WE ekseninde sürerken V = +WV (aşağıda NWV/NWE bunun için var).
function surme(ad, O, U, E, V, ist, n, renk, opts) {
    opts = opts || {};
    const P = [], IDX = [], M = ist.length;
    // ⚠️ SARIM UCLUNUN ELLIGINE BAGLI, SABIT DEGIL. Halka E'den V'ye
    // ilerliyor; ETKIN surme ekseni U * sign(t sonu - t basi), cunku
    // istasyonlar azalan t ile de yazilabiliyor. (a, c, d2) sirasinin normali
    // Uetkin x T'dir: (E x V) . Uetkin > 0 (sag elli) ise halka CCW ve normal
    // ICE bakar, < 0 ise DISA. Isaret asagida bir kez hesaplanip hem yan
    // yuzeylerde hem kapaklarda kullaniliyor.
    const sag = ((E[1] * V[2] - E[2] * V[1]) * U[0]
               + (E[2] * V[0] - E[0] * V[2]) * U[1]
               + (E[0] * V[1] - E[1] * V[0]) * U[2])
              * (ist[M - 1].t - ist[0].t) > 0;
    function nokta(s, a) {
        const ca = Math.cos(a), sa = Math.sin(a);
        const us = s.us == null ? 1.0 : s.us;
        const se = ca < 0 ? -1 : 1, sv = sa < 0 ? -1 : 1;
        const pe = s.e * se * Math.pow(Math.abs(ca), us) + (s.oe || 0);
        const pv = s.v * sv * Math.pow(Math.abs(sa), us) + (s.ov || 0);
        return [O[0] + U[0] * s.t + E[0] * pe + V[0] * pv,
                O[1] + U[1] * s.t + E[1] * pe + V[1] * pv,
                O[2] + U[2] * s.t + E[2] * pe + V[2] * pv];
    }
    for (let i = 0; i < M; i++)
        for (let j = 0; j < n; j++) {
            const p = nokta(ist[i], 2 * Math.PI * j / n);
            P.push(p[0], p[1], p[2]);
        }
    for (let i = 0; i < M - 1; i++)
        for (let j = 0; j < n; j++) {
            const j2 = (j + 1) % n;
            const a = i * n + j, b = i * n + j2;
            const c = (i + 1) * n + j, d2 = (i + 1) * n + j2;
            if (sag) IDX.push(a, d2, c, a, b, d2);
            else IDX.push(a, c, d2, a, d2, b);
        }
    for (let uc = 0; uc < 2; uc++) {
        if (uc === 0 && opts.acikAlt) continue;
        if (uc === 1 && opts.acikUst) continue;
        const s = ist[uc ? M - 1 : 0];
        const oe = s.oe || 0, ov = s.ov || 0;
        const merkez = P.length / 3;
        P.push(O[0] + U[0] * s.t + E[0] * oe + V[0] * ov,
               O[1] + U[1] * s.t + E[1] * oe + V[1] * ov,
               O[2] + U[2] * s.t + E[2] * oe + V[2] * ov);
        const bas = merkez + 1;
        for (let j = 0; j < n; j++) {
            const p = nokta(s, 2 * Math.PI * j / n);
            P.push(p[0], p[1], p[2]);
        }
        for (let j = 0; j < n; j++) {
            const a = bas + j, b = bas + (j + 1) % n;
            // Kapaklar da ayni isarete bagli: sol elli ucluda yelpazenin
            // normali isaret degistirir, iki kapak da yer degistirir.
            if (sag === !!uc) IDX.push(merkez, a, b);
            else IDX.push(merkez, b, a);
        }
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.Float32BufferAttribute(P, 3));
    geo.setIndex(IDX);
    geo.computeVertexNormals();
    const m = mesh(geo, renk, {
        metal: opts.metal == null ? 0.20 : opts.metal,
        rough: opts.rough == null ? 0.70 : opts.rough,
        flat: !!opts.flat, name: ad
    });
    (opts.ebeveyn || modelGroup).add(m);
    return m;
}

// Silah çerçevesinde nokta: τ ileri (WU), e yanal (WE), v yukarı (WV).
function SP(t, e, v) {
    e = e || 0; v = v || 0;
    return [B_X + WU[0] * t + WE[0] * e + WV[0] * v,
            B_Y + WU[1] * t + WE[1] * e + WV[1] * v,
            B_Z + WU[2] * t + WE[2] * e + WV[2] * v];
}

// ============================================================================
// 4. GRUPLAR — pivot-ofset ikilisi (motorun _WHEELS.front mekanizması uzuvda
// KULLANILAMAZ: o her parçayı kendi merkezinde döndürür, uzuv ise mafsaldan)
// ============================================================================
const kalca = new THREE.Group(); kalca.name = 'kalca_grup';
modelGroup.add(kalca);

const omuz = new THREE.Group(); omuz.name = 'omuz_grup';
// Konumu (0,0,0): yürüyüşün karşı-dönüşü ve nişan dönüşü DÜŞEY eksende,
// x/z sıfır olmak ZORUNDA (orta hat). Geri tepme yaslanması (rotation.z) da
// buradan, yani kalçadan — omuzdan değil.
kalca.add(omuz);

const silah = new THREE.Group(); silah.name = 'silah_grup';
omuz.add(silah);                       // ⚠️ silah gövdenin ÇOCUĞU

const bacaklar = [], dizler = [], ayaklar = [];
for (let i = 0; i < 2; i++) {
    const s = i === 0 ? 1 : -1;
    const b = new THREE.Group(); b.name = 'bacak_' + (i + 1);
    b.position.set(0, HIP_Y, s * HIP_Z);
    kalca.add(b);
    const d = new THREE.Group(); d.name = 'diz_' + (i + 1);
    d.position.set(0, -UYLUK, 0);
    b.add(d);
    const a = new THREE.Group(); a.name = 'ayak_' + (i + 1);
    a.position.set(0, -BALDIR, 0);
    d.add(a);
    bacaklar.push(b); dizler.push(d); ayaklar.push(a);
}

// Davranışın okuduğu zincir ölçüleri. TEK KAYNAK burası: adım uzunluğu ve
// zemin kilidi bu sayılardan çözülüyor, studio-3d.js'e kopyalanmıyor.
modelGroup.userData.zipkin = {
    hipY: HIP_Y, hipZ: HIP_Z, uyluk: UYLUK, baldir: BALDIR,
    bilekY: BILEK_Y, tabanDy: TABAN_DY, topukX: TOPUK_X, burunX: BURUN_X,
    boy: BOY
};

// ============================================================================
// 5. GÖVDE — kesitten loft (kasık → boyun dibi). Bu yüzey CEKET'tir.
// ============================================================================
// ⚠️ Alt uç 0.712'ye kadar sivriltildi: düz kapakla biterse arkadan bakışta
// iki uyluk arasından o disk görünüyor (piyadede ölçülmüş tuzak).
const G_W = egriYap([
    [0.712, 0.042], [0.730, 0.076], [0.748, 0.101], [0.812, 0.140], [0.878, 0.158],
    [0.944, 0.150], [1.010, 0.147], [1.076, 0.156], [1.142, 0.172], [1.208, 0.183],
    [1.274, 0.180], [1.330, 0.163], [1.372, 0.128], [1.396, 0.088]
]);
const G_D = egriYap([
    [0.712, 0.038], [0.730, 0.068], [0.748, 0.090], [0.812, 0.113], [0.878, 0.120],
    [0.944, 0.114], [1.010, 0.111], [1.076, 0.116], [1.142, 0.124], [1.208, 0.128],
    [1.274, 0.125], [1.330, 0.114], [1.372, 0.092], [1.396, 0.066]
]);
const G_OX = egriYap([
    [0.712, 0.006], [0.878, 0.000], [1.076, -0.008], [1.208, -0.014],
    [1.330, -0.010], [1.396, 0.000]
]);
loft('tunik', 26, istUret(0.712, 1.396, 34, G_D, G_W, { us: 0.88, eOx: G_OX }),
     C_TUNIK, { ebeveyn: omuz, rough: 0.88, metal: 0.05 });
// Ceketin eteği: belden aşağı ayrı bir kabuk (gövde 0.712'de sivriliyor,
// etek onu kapatıyor ve figüre denizci silueti veriyor).
loft('tunik_etek', 24, [
    { y: 0.690, d: 0.140, w: 0.196, us: 0.90, ox: -0.002 },
    { y: 0.712, d: 0.136, w: 0.190, us: 0.90, ox: -0.002 },
    { y: 0.782, d: 0.126, w: 0.176, us: 0.90, ox: 0.000 },
    { y: 0.852, d: 0.120, w: 0.164, us: 0.90, ox: 0.002 },
    { y: 0.922, d: 0.118, w: 0.156, us: 0.90, ox: 0.002 }
], C_TUNIK, { ebeveyn: omuz, rough: 0.88, metal: 0.05, acikUst: true });
// Yaka: ceketin üst kenarı çizilmezse boyun gövdeden çıkan bir boru gibi.
loft('tunik_yaka', 22, [
    { y: 1.352, d: 0.104, w: 0.140, us: 0.92, ox: -0.006 },
    { y: 1.382, d: 0.092, w: 0.124, us: 0.92, ox: -0.004 },
    { y: 1.404, d: 0.070, w: 0.096, us: 0.92, ox: 0.000 }
], C_TUNIK_K, { ebeveyn: omuz, rough: 0.90, metal: 0.05, acikAlt: true, acikUst: true });

// ============================================================================
// 6. KEMER + KURMA KRİKOSU (kemerde asılı) + OMUZ PEDİ
// ============================================================================
loft('kemer', 24, [
    { y: 0.938, d: 0.152, w: 0.156, us: 0.92 },
    { y: 0.966, d: 0.156, w: 0.160, us: 0.92 },
    { y: 0.994, d: 0.152, w: 0.156, us: 0.92 }
], C_DERI, { ebeveyn: omuz, rough: 0.92, metal: 0.04, acikAlt: true, acikUst: true });
kutu('kemer_toka', 0.030, 0.048, 0.052, [0.152, 0.966, 0.000], C_PIRINC,
     { ebeveyn: omuz, metal: 0.40, rough: 0.32 });
// Omuz pedi: dipçiğin dayandığı yer (ham -z omzu = ürünün SAĞ omzu).
loft('omuz_pedi', 16, [
    { y: 1.286, d: 0.092, w: 0.070, us: 0.85, ox: -0.010, oz: -0.176 },
    { y: 1.330, d: 0.100, w: 0.078, us: 0.85, ox: -0.008, oz: -0.180 },
    { y: 1.372, d: 0.088, w: 0.068, us: 0.85, ox: -0.006, oz: -0.176 }
], C_DERI, { ebeveyn: omuz, rough: 0.90, metal: 0.05 });
// KURMA KRİKOSU (cranequin) — Met 48.149.36b: L 0.359, W 0.088, 2.343 kg.
// Kurmadan sonra sökülüp kemere asılıyor; SİLAHIN ÜSTÜNDE DEĞİL, bu yüzden
// denge hesabına da girmiyor. Ham -z kalçasında (ürünün sağ kalçası).
uzuv('kriko_govde', [0.052, 0.952, -0.178], [0.014, 0.606, -0.198],
     [[0.00, 0.030, 0.42], [0.20, 0.032, 0.42], [0.80, 0.030, 0.42],
      [1.00, 0.026, 0.42]], 8, C_AHSAP_K,
     { ebeveyn: omuz, rough: 0.80, metal: 0.08 });
kutu('kriko_dis', 0.040, 0.296, 0.014, [0.050, 0.780, -0.200], C_CELIK_K,
     { ebeveyn: omuz, metal: 0.38, rough: 0.42 });
uzuv('kriko_kol', [0.050, 0.930, -0.212], [0.134, 0.930, -0.238],
     [[0, 0.009, 1], [1, 0.009, 1]], 8, C_CELIK_K,
     { ebeveyn: omuz, rough: 0.40, metal: 0.38 });
kure('kriko_disli', 0.042, [0.050, 0.930, -0.200], C_CELIK_K,
     { ebeveyn: omuz, olcek: [1.0, 1.0, 0.40], rough: 0.40, metal: 0.38 });

// ============================================================================
// 7. BOYUN + KAFA + ÖRGÜ BAŞLIK
// ============================================================================
uzuv('boyun', [-0.006, 1.352, 0], [0.004, 1.472, 0],
     [[0, 0.058, 0.94], [1, 0.052, 0.94]], 12, C_TEN,
     { ebeveyn: omuz, rough: 0.74, metal: 0.05 });
loft('kafa', 18, [
    { y: 1.460, d: 0.068, w: 0.062, us: 0.95, ox: 0.004 },
    { y: 1.492, d: 0.088, w: 0.076, us: 0.95, ox: 0.008 },
    { y: 1.532, d: 0.098, w: 0.082, us: 0.95, ox: 0.010 },
    { y: 1.578, d: 0.096, w: 0.080, us: 0.95, ox: 0.006 },
    { y: 1.618, d: 0.082, w: 0.070, us: 0.95, ox: 0.000 },
    { y: 1.642, d: 0.056, w: 0.050, us: 0.95, ox: -0.004 }
], C_TEN, { ebeveyn: omuz, rough: 0.76, metal: 0.04 });
// Sakal: miğfersiz bir kafa harita ölçeğinde tek renk bir yumurtaya iniyor;
// sakal ona ön/arka verir.
loft('sakal', 14, [
    { y: 1.466, d: 0.062, w: 0.058, us: 0.95, ox: 0.014 },
    { y: 1.500, d: 0.082, w: 0.072, us: 0.95, ox: 0.018 },
    { y: 1.530, d: 0.082, w: 0.072, us: 0.95, ox: 0.016 }
], C_DERI_K, { ebeveyn: omuz, rough: 0.94, metal: 0.03 });
kutu('goz_yarik', 0.016, 0.012, 0.076, [0.092, 1.560, 0.000], C_KOYU,
     { ebeveyn: omuz, metal: 0.10, rough: 0.80 });
// Örgü başlık (thrum cap): kabuk + kalın kenar.
// ⚠️ Tepe noktası 1.715: BOY ile BİREBİR. İlk kurulumda taç 1.660'taydı
// ve kutu 55 mm eksik ölçüyordu — adım hesabı BOY'u kullandığı için model
// kendi boyundan kısa görünmemeli.
loft('baslik', 18, [
    { y: 1.596, d: 0.100, w: 0.086, us: 0.95, ox: 0.006 },
    { y: 1.634, d: 0.098, w: 0.084, us: 0.95, ox: 0.000 },
    { y: 1.670, d: 0.086, w: 0.074, us: 0.95, ox: -0.006 },
    { y: 1.700, d: 0.058, w: 0.050, us: 0.95, ox: -0.012 },
    { y: 1.715, d: 0.026, w: 0.024, us: 0.95, ox: -0.016 }
], C_BASLIK, { ebeveyn: omuz, rough: 0.92, metal: 0.03 });
loft('baslik_kenar', 18, [
    { y: 1.588, d: 0.104, w: 0.090, us: 0.95, ox: 0.006 },
    { y: 1.604, d: 0.108, w: 0.094, us: 0.95, ox: 0.004 },
    { y: 1.620, d: 0.102, w: 0.088, us: 0.95, ox: 0.002 }
], C_BASLIK, { ebeveyn: omuz, rough: 0.92, metal: 0.03 });

// ============================================================================
// 8. BACAKLAR — mafsal gruplarının İÇİNDE, yerel çerçevede
// ============================================================================
for (let i = 0; i < 2; i++) {
    const g = bacaklar[i], gd = dizler[i], ga = ayaklar[i];
    // Uyluk: PANTOLONLU (diz altı pantolon; baldır çıplak).
    loft('ust_bacak_' + (i + 1), 16, [
        { y: -UYLUK - 0.016, d: 0.070, w: 0.068, us: 1.0 },
        { y: -UYLUK + 0.030, d: 0.074, w: 0.072, us: 1.0 },
        { y: -0.278,         d: 0.078, w: 0.076, us: 1.0 },
        { y: -0.182,         d: 0.082, w: 0.080, us: 1.0 },
        { y: -0.086,         d: 0.086, w: 0.084, us: 1.0 },
        { y:  0.018,         d: 0.086, w: 0.083, us: 1.0 },
        { y:  0.068,         d: 0.076, w: 0.074, us: 1.0 }
    ], C_PANTOL, { ebeveyn: g, rough: 0.90, metal: 0.04 });
    // Paçanın büzgülü ağzı: pantolonun bittiği yer çizilmezse kumaş ve ten
    // tek yüzey gibi okunuyor.
    loft('paca_' + (i + 1), 16, [
        { y: -UYLUK - 0.020, d: 0.076, w: 0.074, us: 1.0 },
        { y: -UYLUK - 0.002, d: 0.080, w: 0.078, us: 1.0 },
        { y: -UYLUK + 0.016, d: 0.072, w: 0.070, us: 1.0 }
    ], C_PANTOL, { ebeveyn: g, rough: 0.92, metal: 0.04 });
    // Baldır: çıplak.
    loft('alt_bacak_' + (i + 1), 16, [
        { y: -BALDIR - 0.006, d: 0.044, w: 0.042, us: 1.0 },
        { y: -BALDIR + 0.056, d: 0.047, w: 0.045, us: 1.0 },
        { y: -0.278,          d: 0.053, w: 0.050, us: 1.0 },
        { y: -0.192,          d: 0.061, w: 0.058, us: 1.0 },
        { y: -0.116,          d: 0.068, w: 0.065, us: 1.0, ox: -0.006 },
        { y: -0.052,          d: 0.067, w: 0.065, us: 1.0, ox: -0.004 },
        { y:  0.012,          d: 0.059, w: 0.057, us: 1.0 }
    ], C_TEN, { ebeveyn: gd, rough: 0.74, metal: 0.05 });
    kure('diz_kure_' + (i + 1), 0.058, [0, 0, 0], C_TEN,
         { ebeveyn: gd, olcek: [1.0, 0.95, 0.92], rough: 0.74, metal: 0.05 });
    // Ayakkabı: yumuşak deri.
    loft('ayak_et_' + (i + 1), 14, [
        { y: TABAN_DY + 0.018, d: 0.112, w: AYAK_W,         us: 0.80, ox: 0.050 },
        { y: TABAN_DY + 0.046, d: 0.108, w: AYAK_W - 0.002, us: 0.82, ox: 0.044 },
        { y:  0.000,           d: 0.086, w: 0.050,          us: 0.88, ox: 0.018 },
        { y:  0.034,           d: 0.052, w: 0.046,          us: 0.95, ox: -0.006 }
    ], C_DERI, { ebeveyn: ga, rough: 0.90, metal: 0.05 });
    // Taban: ayağın ALTINDAKİ ince levha. ⚠️ Ölçüsü TOPUK_X/BURUN_X ile
    // BİREBİR tutmak zorunda: zemin kilidi (davranış) bu iki noktayı
    // kullanıyor. ox - d = -0.070 = TOPUK_X, ox + d = 0.1753 = BURUN_X.
    loft('ayakkabi_' + (i + 1), 14, [
        { y: TABAN_DY,         d: 0.12265, w: AYAK_W + 0.003, us: 0.55, ox: 0.05265 },
        { y: TABAN_DY + 0.012, d: 0.12465, w: AYAK_W + 0.005, us: 0.55, ox: 0.05265 },
        { y: TABAN_DY + 0.020, d: 0.12065, w: AYAK_W + 0.002, us: 0.60, ox: 0.05165 }
    ], C_DERI_K, { ebeveyn: ga, rough: 0.94, metal: 0.03 });
    kutu('ayakkabi_bag_' + (i + 1), 0.036, 0.010, 0.116, [0.022, -0.032, 0], C_DERI_K,
         { ebeveyn: ga, metal: 0.05, rough: 0.90 });
}

// ============================================================================
// 9. OMUZ KUŞAĞI — kollar (İKİSİ DE SİLAHTA)
// ============================================================================
// ⚠️ İki el de silahta olduğu için SERBEST KOL SALINIMI YOK. Yürüyüşün
// "karşı salınım" okuması OMUZ KUŞAĞININ dönüşünden geliyor (gerçek
// yürüyüşte de pelvis bir yöne, göğüs kafesi öbür yöne döner). Silah bu
// grubun İÇİNDE, yani gövdeyle birlikte gidiyor ve eller ondan hiç
// ayrılmıyor.
for (let i = 0; i < 2; i++) {
    const s = i ? -1 : 1;
    kure('omuz_kapak_' + (i + 1), 0.068, [0.004, OMUZ_Y + 0.006, s * OMUZ_Z],
         C_TUNIK, { ebeveyn: omuz, olcek: [1.02, 0.92, 0.94], rough: 0.88, metal: 0.05 });
}
// ---- ARKA EL KOLU (ham -z = ürünün SAĞI): tetik kabzası, τ 0.252.
const OMZ_R = [0.004, OMUZ_Y, -OMUZ_Z];
const EL_R  = SP(T_EL_ARKA, 0, -0.036);
const DIR_R = [-0.024, 1.158, -0.248];
// ---- ÖN EL KOLU (ham +z = ürünün SOLU): denge noktası, τ 0.634. Gövdeyi
// çaprazlıyor — iki elle tutan her nişancıda böyle.
const OMZ_L = [0.004, OMUZ_Y, OMUZ_Z];
const EL_L  = SP(T_EL_ON, 0, -0.048);
const DIR_L = [0.170, 1.128, 0.170];

const KOL = [[OMZ_L, DIR_L, EL_L, 1], [OMZ_R, DIR_R, EL_R, -1]];
for (let i = 0; i < 2; i++) {
    const K = KOL[i], s = K[3];
    uzuv('ust_kol_' + (i + 1), K[0], K[1],
         [[0, 0.060], [0.25, 0.055], [0.65, 0.048], [1, 0.043]], 14, C_TEN,
         { ebeveyn: omuz, rough: 0.74, metal: 0.05 });
    kure('dirsek_' + (i + 1), 0.045, K[1], C_TEN,
         { ebeveyn: omuz, rough: 0.74, metal: 0.05 });
    uzuv('alt_kol_' + (i + 1), K[1], K[2],
         [[0, 0.045], [0.35, 0.042], [0.80, 0.035], [1, 0.032]], 14, C_TEN,
         { ebeveyn: omuz, rough: 0.74, metal: 0.05 });
    kure('el_' + (i + 1), 0.043,
         [K[2][0] + 0.004, K[2][1] + 0.014, K[2][2] + s * 0.004], C_TEN,
         { ebeveyn: omuz, olcek: [1.18, 0.90, 0.84], rough: 0.72, metal: 0.05 });
}

// ============================================================================
// 10. KUNDAK — kalın gövde + dipçik/omuzluk + oluk
// ============================================================================
const O0 = [B_X, B_Y, B_Z];
surme('kundak', O0, WU, WE, WV, [
    { t: 0.000, e: 0.052, v: 0.070, us: 0.55, ov: -0.004 },
    { t: T_DIPCIK, e: 0.050, v: 0.068, us: 0.55, ov: -0.004 },
    { t: 0.200, e: 0.040, v: 0.052, us: 0.58, ov: -0.002 },
    { t: T_TETIK, e: 0.038, v: 0.050, us: 0.58, ov: 0.000 },
    { t: 0.380, e: 0.036, v: 0.046, us: 0.60, ov: 0.004 },
    { t: T_EL_ON, e: 0.035, v: 0.043, us: 0.62, ov: 0.010 },
    { t: T_YAY,  e: 0.038, v: 0.041, us: 0.60, ov: 0.014 },
    { t: T_BURUN, e: 0.030, v: 0.034, us: 0.62, ov: 0.014 }
], 14, C_AHSAP, { ebeveyn: silah, rough: 0.78, metal: 0.08 });
// DİPÇİK / OMUZLUK: omuza dayanan geniş kütük. Furkan'ın istediği "kalın
// kundak ve omuzluk" bu; aynı zamanda dengeyi geri çeken kütlelerden biri.
surme('dipcik', O0, WU, WE, WV, [
    { t: -0.022, e: 0.040, v: 0.058, us: 0.50, ov: -0.006 },
    { t: -0.012, e: 0.056, v: 0.076, us: 0.45, ov: -0.006 },
    { t:  0.030, e: 0.058, v: 0.078, us: 0.45, ov: -0.006 },
    { t:  0.086, e: 0.054, v: 0.072, us: 0.48, ov: -0.006 },
    { t: T_DIPCIK, e: 0.046, v: 0.060, us: 0.52, ov: -0.005 }
], 14, C_AHSAP, { ebeveyn: silah, rough: 0.80, metal: 0.07 });
// Dipçik plakası: omuza değen deri yüz.
surme('dipcik_plaka', O0, WU, WE, WV, [
    { t: -0.030, e: 0.052, v: 0.072, us: 0.45, ov: -0.006 },
    { t: -0.020, e: 0.058, v: 0.078, us: 0.45, ov: -0.006 }
], 14, C_DERI_K, { ebeveyn: silah, rough: 0.92, metal: 0.05 });
// Yanak levhaları: kundağın iki yüzünde ayrı panel.
for (let i = 0; i < 2; i++) {
    const s = i ? -1 : 1;
    surme('kundak_yanak_' + (i + 1), O0, WU, WE, WV, [
        { t: 0.150, e: 0.005, v: 0.038, us: 0.50, oe: s * 0.045, ov: -0.004 },
        { t: 0.250, e: 0.005, v: 0.042, us: 0.50, oe: s * 0.042, ov: 0.000 },
        { t: 0.380, e: 0.005, v: 0.038, us: 0.50, oe: s * 0.040, ov: 0.004 }
    ], 10, C_AHSAP_K, { ebeveyn: silah, rough: 0.80, metal: 0.08 });
}
// OLUK: zıpkının yattığı kanal. Cevizin gerisinden burna, kundağın ÜSTÜNDE.
surme('oluk', O0, WU, WE, WV, [
    { t: T_CEVIZ - 0.040, e: 0.030, v: 0.013, us: 0.35, ov: V_OLUK - 0.017 },
    { t: T_EL_ON, e: 0.029, v: 0.013, us: 0.35, ov: V_OLUK - 0.017 },
    { t: T_YAY,  e: 0.030, v: 0.012, us: 0.35, ov: V_OLUK - 0.016 },
    { t: T_BURUN, e: 0.026, v: 0.011, us: 0.35, ov: V_OLUK - 0.016 }
], 10, C_AHSAP_K, { ebeveyn: silah, rough: 0.84, metal: 0.06 });
// CEVİZ (nut): kirişi tutan geyik boynuzu makara.
kure('ceviz', 0.026, SP(T_CEVIZ, 0, V_EKSEN + 0.006), C_HALAT,
     { ebeveyn: silah, olcek: [1.0, 1.0, 1.30], rough: 0.62, metal: 0.10 });
// Yay bileziği: yayı kundağa bağlayan demir kuşak.
surme('yay_bilezik', O0, WU, WE, WV, [
    { t: T_YAY - 0.024, e: 0.046, v: 0.052, us: 0.50, ov: 0.010 },
    { t: T_YAY + 0.024, e: 0.046, v: 0.052, us: 0.50, ov: 0.010 }
], 12, C_CELIK_K, { ebeveyn: silah, rough: 0.40, metal: 0.38 });
// ÜZENGİ: ayağın geçtiği demir kemer (kriko yokken ayakla basılıyor).
uzuv('uzengi_1', SP(T_UZENGI, 0.030, -0.026), SP(T_UZENGI + 0.008, 0.042, -0.152),
     [[0, 0.008, 1], [1, 0.008, 1]], 8, C_CELIK,
     { ebeveyn: silah, rough: 0.36, metal: 0.40 });
uzuv('uzengi_2', SP(T_UZENGI, -0.030, -0.026), SP(T_UZENGI + 0.008, -0.042, -0.152),
     [[0, 0.008, 1], [1, 0.008, 1]], 8, C_CELIK,
     { ebeveyn: silah, rough: 0.36, metal: 0.40 });
uzuv('uzengi_alt', SP(T_UZENGI + 0.008, 0.042, -0.152), SP(T_UZENGI + 0.008, -0.042, -0.152),
     [[0, 0.008, 1], [1, 0.008, 1]], 8, C_CELIK,
     { ebeveyn: silah, rough: 0.36, metal: 0.40 });

// ============================================================================
// 11. YAY KOLLARI — yatay, arbaletin imzası
// ============================================================================
// ⚠️ Kolun sürme ekseni WE (yanal), kesiti (WU, WV) düzleminde: çelik yaprak
// yay eğilme yönünde İNCE (WU boyunca 12 -> 6 mm), dik yönde GENİŞ (WV
// boyunca 55 -> 28 mm). Ters yazılsaydı yay dikey değil yatay yaprak olur
// ve arbalet gibi değil, dikey yaylı bir şey gibi görünürdü.
// ⚠️ surme'nin U x E = V şartı: WE x WU = -WV, -WE x WU = +WV.
// Geometri θ=0'da (düz yanal) kuruluyor; grup quaternion'u kurulu açıya
// getiriyor. Davranış aynı ekseni (WV) kullanıp θ'yı değiştiriyor,
// GEOMETRİ HİÇ YENİDEN KURULMUYOR.
const yayGrup = [];
for (let i = 0; i < 2; i++) {
    const s = i ? -1 : 1;
    const g = new THREE.Group();
    g.name = 'yay_grup_' + (i + 1);
    const c = SP(T_YAY, 0, V_EKSEN);
    g.position.set(c[0], c[1], c[2]);
    silah.add(g);
    yayGrup.push(g);
    const U = s > 0 ? WE : NWE;
    const V = s > 0 ? NWV : WV;
    const ist = [];
    const N = 8;
    for (let k = 0; k <= N; k++) {
        const u = k / N;
        // İleri kavis: uçlar kökten 0.030 m önde (boş çelik yayın doğal arkı).
        // ⚠️ Kalınlık (WU boyunca) 18 -> 9 mm. Gerçek çelik yay 12 -> 6 mm
        // olurdu ve TEPEDEN bakışta 12 mm'lik bir çizgi haritada kayboluyor;
        // tepe silueti bu modelin AYIRT EDİCİ ölçüsü olduğu için kol
        // %50 kalınlaştırıldı. Yükseklik (WV) 55 -> 28 mm katalog oranında.
        ist.push({ t: YAY_A * u, e: 0.009 - 0.0045 * u, v: 0.0275 - 0.0135 * u,
                   us: 0.45, oe: 0.030 * u * u });
    }
    surme('yay_kol_' + (i + 1), [0, 0, 0], U, WU, V, ist, 8, C_CELIK,
          { ebeveyn: g, rough: 0.32, metal: 0.40 });
    // Uç boynuzu (kirişin oturduğu kertik).
    surme('yay_ucluk_' + (i + 1), [0, 0, 0], U, WU, V, [
        { t: YAY_A - 0.008, e: 0.007, v: 0.015, us: 0.55, oe: 0.029 },
        { t: YAY_A, e: 0.009, v: 0.017, us: 0.55, oe: 0.030 },
        { t: YAY_A + 0.010, e: 0.005, v: 0.011, us: 0.55, oe: 0.026 }
    ], 8, C_CELIK_K, { ebeveyn: g, rough: 0.36, metal: 0.38 });
    g.quaternion.setFromAxisAngle(new THREE.Vector3(WV[0], WV[1], WV[2]), s * TETA_KURU);
}
// KİRİŞ: iki birim silindir, her karede iki uçtan kuruluyor. Geometri +x
// boyunca 0..1; davranış position + quaternion + scale.x yazıyor.
const kirisMesh = [];
for (let i = 0; i < 2; i++) {
    const geo = new THREE.CylinderGeometry(0.0055, 0.0055, 1, 6, 1);
    geo.rotateZ(-Math.PI / 2);
    geo.translate(0.5, 0, 0);
    const m = mesh(geo, C_HALAT, { metal: 0.06, rough: 0.72, name: 'kiris_' + (i + 1) });
    silah.add(m);
    kirisMesh.push(m);
}

// ============================================================================
// 12. TETİK — kundağın altındaki uzun kol
// ============================================================================
const tetikGrup = new THREE.Group();
tetikGrup.name = 'tetik_grup';
(function () {
    const c = SP(T_TETIK, 0, -0.030);
    tetikGrup.position.set(c[0], c[1], c[2]);
    silah.add(tetikGrup);
    surme('tetik_kolu', [0, 0, 0], WU, WE, WV, [
        { t: 0.014, e: 0.010, v: 0.016, us: 0.45 },
        { t: -0.056, e: 0.009, v: 0.014, us: 0.45, ov: -0.026 },
        { t: -0.126, e: 0.008, v: 0.012, us: 0.45, ov: -0.056 },
        { t: -0.168, e: 0.007, v: 0.010, us: 0.45, ov: -0.074 }
    ], 8, C_CELIK_K, { ebeveyn: tetikGrup, rough: 0.40, metal: 0.38 });
})();

// ============================================================================
// 13. HALAT TAMBURU — zıpkını arbaletten ayıran parça
// ============================================================================
// ⚠️ Tamburun ekseni WE; surme'nin U x E = V şartı için V = -WV.
const tamburGrup = new THREE.Group();
tamburGrup.name = 'tambur_grup';
(function () {
    const c = SP(T_TAMBUR, 0, TAMBUR_V);
    tamburGrup.position.set(c[0], c[1], c[2]);
    silah.add(tamburGrup);
    surme('tambur_govde', [0, 0, 0], WE, WU, NWV, [
        { t: -TAMBUR_W / 2, e: TAMBUR_RG, v: TAMBUR_RG, us: 1.0 },
        { t:  TAMBUR_W / 2, e: TAMBUR_RG, v: TAMBUR_RG, us: 1.0 }
    ], 16, C_AHSAP_K, { ebeveyn: tamburGrup, rough: 0.80, metal: 0.08 });
    // Sarılı halat: göbeğin üstünde daha kalın bir silindir (9.2 m halat).
    surme('halat_kangal', [0, 0, 0], WE, WU, NWV, [
        { t: -TAMBUR_W / 2 + 0.006, e: TAMBUR_RM, v: TAMBUR_RM, us: 1.0 },
        { t:  TAMBUR_W / 2 - 0.006, e: TAMBUR_RM, v: TAMBUR_RM, us: 1.0 }
    ], 16, C_HALAT, { ebeveyn: tamburGrup, rough: 0.90, metal: 0.04 });
    for (let i = 0; i < 2; i++) {
        const s = i ? -1 : 1;
        surme('tambur_yanak_' + (i + 1), [0, 0, 0], WE, WU, NWV, [
            { t: s * (TAMBUR_W / 2), e: TAMBUR_R, v: TAMBUR_R, us: 1.0 },
            { t: s * (TAMBUR_W / 2 + 0.012), e: TAMBUR_R, v: TAMBUR_R, us: 1.0 }
        ], 16, C_PIRINC, { ebeveyn: tamburGrup, rough: 0.34, metal: 0.40 });
        // Kranç kolu: yanağın dışında kısa bir çubuk (tamburun döndüğü
        // ateşleme çevriminde en okunur işaret).
        surme('tambur_kol_' + (i + 1), [0, 0, 0], WE, WU, NWV, [
            { t: s * (TAMBUR_W / 2 + 0.012), e: 0.008, v: 0.008, us: 1.0, oe: 0.062 },
            { t: s * (TAMBUR_W / 2 + 0.046), e: 0.008, v: 0.008, us: 1.0, oe: 0.062 }
        ], 8, C_CELIK_K, { ebeveyn: tamburGrup, rough: 0.40, metal: 0.38 });
    }
})();
// Tambur askısı: tamburu kundağa bağlayan iki demir kulak.
for (let i = 0; i < 2; i++) {
    const s = i ? -1 : 1;
    uzuv('tambur_aski_' + (i + 1),
         SP(T_TAMBUR - 0.008, s * (TAMBUR_W / 2 + 0.014), -0.030),
         SP(T_TAMBUR, s * (TAMBUR_W / 2 + 0.014), TAMBUR_V),
         [[0, 0.010, 0.35], [1, 0.010, 0.35]], 6, C_CELIK_K,
         { ebeveyn: silah, rough: 0.40, metal: 0.38 });
}
// HALAT — İKİ PARÇA. ⚠️ İLK KURULUMDA TEK PARÇAYDI ve tamburdan doğrudan
// zıpkının halkasına gidiyordu: o düz çizgi kundağın, yay bileziğinin ve
// yay kollarının İÇİNDEN geçiyordu. Gerçek düzen de zaten iki parçalı —
// halat tamburdan çıkar, kundağın ALTINDAN burun makarasına gider, oradan
// zıpkına. `halat_1` sabit (tambur -> makara), `halat_2` zıpkınla uzar.
const HALAT_CIKIS  = SP(T_TAMBUR + TAMBUR_RM, 0, TAMBUR_V);   // tamburun ön teğeti
const HALAT_MAKARA = SP(T_BURUN + 0.012, 0, -0.026);          // burun makarası
// Burun makarası: halatın döndüğü küçük pirinç kasnak.
surme('halat_makara', HALAT_MAKARA, WE, WU, NWV, [
    { t: -0.013, e: 0.021, v: 0.021, us: 1.0 },
    { t:  0.013, e: 0.021, v: 0.021, us: 1.0 }
], 12, C_PIRINC, { ebeveyn: silah, rough: 0.34, metal: 0.40 });
uzuv('halat_1', HALAT_CIKIS, HALAT_MAKARA,
     [[0, HALAT_R], [1, HALAT_R]], 6, C_HALAT,
     { ebeveyn: silah, rough: 0.90, metal: 0.04 });
const halatMesh = (function () {
    const geo = new THREE.CylinderGeometry(HALAT_R, HALAT_R, 1, 6, 1);
    geo.rotateZ(-Math.PI / 2);
    geo.translate(0.5, 0, 0);
    const m = mesh(geo, C_HALAT, { metal: 0.04, rough: 0.90, name: 'halat_2' });
    silah.add(m);
    return m;
})();

// ============================================================================
// 14. ZIPKIN — iki-yüzgeçli baş + halat halkası
// ============================================================================
// ⚠️ YEREL ÇERÇEVEDE kuruluyor: +x kertikten uca, geniş (yassı) yön ±z.
// Davranış grubun position ve quaternion'unu yazıyor (uçuş). Dinlenmede
// kertik cevizde, eksen WU. surme çağrılarında U=+x, E=+z, V=-y (x̂ x ẑ = -ŷ).
const zipkinGrup = new THREE.Group();
zipkinGrup.name = 'zipkin_grup';
silah.add(zipkinGrup);
(function () {
    const EX = [1, 0, 0], EE = [0, 0, 1], EV = [0, -1, 0];
    surme('zipkin_kertik', [0, 0, 0], EX, EE, EV, [
        { t: 0.000, e: 0.014, v: 0.016, us: 0.55 },
        { t: 0.018, e: 0.016, v: 0.018, us: 0.55 },
        { t: 0.045, e: 0.014, v: 0.015, us: 0.60 }
    ], 8, C_AHSAP_K, { ebeveyn: zipkinGrup, rough: 0.82, metal: 0.06 });
    // Dişbudak arka sap (ikincil rengin silah-ahşabı yüzeyi).
    surme('zipkin_sap', [0, 0, 0], EX, EE, EV, [
        { t: 0.040, e: 0.013, v: 0.013, us: 1.0 },
        { t: 0.120, e: 0.014, v: 0.014, us: 1.0 },
        { t: 0.260, e: 0.014, v: 0.014, us: 1.0 },
        { t: 0.310, e: 0.011, v: 0.011, us: 1.0 }
    ], 8, C_AHSAP, { ebeveyn: zipkinGrup, rough: 0.80, metal: 0.07 });
    surme('zipkin_sank', [0, 0, 0], EX, EE, EV, [
        { t: 0.298, e: 0.010, v: 0.010, us: 1.0 },
        { t: 0.360, e: 0.009, v: 0.009, us: 1.0 },
        { t: 0.560, e: 0.009, v: 0.009, us: 1.0 },
        { t: 0.608, e: 0.011, v: 0.011, us: 1.0 }
    ], 8, C_CELIK, { ebeveyn: zipkinGrup, rough: 0.36, metal: 0.40 });
    // Kovan + halat halkası (yarık kovan, two-flue kalıbı).
    surme('zipkin_kovan', [0, 0, 0], EX, EE, EV, [
        { t: 0.598, e: 0.017, v: 0.017, us: 1.0 },
        { t: 0.640, e: 0.018, v: 0.018, us: 1.0 },
        { t: 0.664, e: 0.014, v: 0.014, us: 1.0 }
    ], 10, C_CELIK_K, { ebeveyn: zipkinGrup, rough: 0.38, metal: 0.38 });
    uzuv('zipkin_halka', [Z_HALKA, 0.020, 0], [Z_HALKA, -0.020, 0],
         [[0, 0.010, 0.45], [1, 0.010, 0.45]], 8, C_CELIK_K,
         { ebeveyn: zipkinGrup, rough: 0.38, metal: 0.38 });
    // BAŞ: yassı, iki-yüzgeçli. `us` 0.32 ile bıçak gibi.
    surme('zipkin_bas', [0, 0, 0], EX, EE, EV, [
        { t: 0.660, e: 0.013, v: 0.013, us: 0.60 },
        { t: 0.700, e: 0.019, v: 0.007, us: 0.35 },
        { t: 0.790, e: 0.021, v: 0.007, us: 0.32 },
        { t: 0.838, e: 0.012, v: 0.005, us: 0.35 },
        { t: 0.860, e: 0.002, v: 0.002, us: 0.50 }
    ], 8, C_CELIK, { ebeveyn: zipkinGrup, rough: 0.34, metal: 0.42 });
    // İKİ ÇENGEL (flue): geriye süpürülmüş, zıpkının geri çıkmasını
    // engelleyen parça. Zıpkını OKTAN ayıran şey bu.
    for (let i = 0; i < 2; i++) {
        const s = i ? -1 : 1;
        uzuv('zipkin_cengel_' + (i + 1),
             [0.734, 0, s * 0.010], [0.664, 0, s * Z_FLU],
             [[0, 0.011, 0.40], [0.6, 0.008, 0.40], [1, 0.004, 0.40]], 6, C_CELIK,
             { ebeveyn: zipkinGrup, rough: 0.34, metal: 0.42 });
    }
})();

// ============================================================================
// 15. DAVRANIŞIN OKUDUĞU SİLAH SÖZLEŞMESİ
// ============================================================================
// ⚠️ TEK KAYNAK BURASI. studio-3d.js'e hiçbir ölçü kopyalanmıyor; davranış
// kirişin tepe noktasını, tamburun kapasitesini, zıpkının yerini hep bu
// sayılardan çözüyor.
modelGroup.userData.zipkinSilah = {
    WU: WU, WE: WE, WV: WV,
    nisanYaw: NISAN_YAW,
    yayA: YAY_A, kirisL2: KIRIS_L2,
    tetaBos: TETA_BOS, tetaKuru: TETA_KURU,
    tamburR: TAMBUR_RM, halatKap: HALAT_KAP,
    zBoy: Z_BOY, zHalka: Z_HALKA,
    halatCikis: HALAT_MAKARA,
    // Kirişin ve zıpkın kertiğinin yerini veren fonksiyonun sabitleri:
    // uc(θ)  = SP(T_YAY - a sinθ, ±a cosθ, V_EKSEN)
    // tepe(θ)= SP(T_YAY - a sinθ - sqrt(L2² - (a cosθ)²), 0, V_EKSEN + 0.006)
    tYay: T_YAY, vEksen: V_EKSEN, vOluk: V_OLUK, tBurun: T_BURUN
};
// Silah çerçevesini davranışa fonksiyon olarak da veriyoruz: aynı SP
// hesabının iki yerde iki ayrı kopyası olmasın.
modelGroup.userData.zipkinSP = function (t, e, v) { return SP(t, e, v); };

// ⚠️ KURULU POZ DAVRANIŞSIZ DA DOĞRU OLMALI (kütüphane kapağı, `onden.py`,
// davranışın henüz koşmadığı ilk kare). Kiriş, halat ve zıpkın burada bir
// kez yerleştiriliyor; davranış her karede AYNI kuralla mutlak durumdan
// yeniden kuruyor, yani ψ=0'da tam bu poza dönüyor.
(function kuruluPoz() {
    const V3 = THREE.Vector3;
    const EX = new V3(1, 0, 0);
    const teta = TETA_KURU;
    const tipT = T_YAY - YAY_A * Math.sin(teta);
    const yanal = YAY_A * Math.cos(teta);
    const geri = Math.sqrt(Math.max(0, KIRIS_L2 * KIRIS_L2 - yanal * yanal));
    const tepe = SP(tipT - geri, 0, V_EKSEN + 0.006);
    for (let i = 0; i < 2; i++) {
        const s = i ? -1 : 1;
        const uc = SP(tipT, s * yanal, V_EKSEN);
        const A = new V3(uc[0], uc[1], uc[2]);
        const d = new V3(tepe[0], tepe[1], tepe[2]).sub(A);
        const L = d.length() || 1e-6;
        kirisMesh[i].position.copy(A);
        kirisMesh[i].quaternion.setFromUnitVectors(EX, d.multiplyScalar(1 / L));
        kirisMesh[i].scale.set(L, 1, 1);
    }
    const kn = SP(T_CEVIZ, 0, V_OLUK);
    zipkinGrup.position.set(kn[0], kn[1], kn[2]);
    zipkinGrup.quaternion.setFromUnitVectors(EX, new V3(WU[0], WU[1], WU[2]));
    const hr = new V3(Z_HALKA, 0, 0).applyQuaternion(zipkinGrup.quaternion)
        .add(zipkinGrup.position);
    const A = new V3(HALAT_MAKARA[0], HALAT_MAKARA[1], HALAT_MAKARA[2]);
    const d = hr.sub(A);
    const L = d.length() || 1e-6;
    halatMesh.position.copy(A);
    halatMesh.quaternion.setFromUnitVectors(EX, d.multiplyScalar(1 / L));
    halatMesh.scale.set(L, 1, 1);
})();
