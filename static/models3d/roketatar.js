// Çoklu roketatar — M270 MLRS. Modern Warfare temasının paletli aracı.
//
// KAYNAK ÖLÇÜLER (ezberden değil; her biri kaynaktan alınıp doğrulandı):
//   uzunluk 274.5 in = 6.97 m · genişlik 117 in = 2.97 m
//   yükseklik (lançer seyir hâlinde) 102 in = 2.59 m · yerden yükseklik 17 in = 0.43 m
//   palet ayağı 21 in = 0.533 m geniş, adımı 6 in = 0.1524 m (T157I)
//   yere basan palet uzunluğu 170.5 in = 4.331 m
//   yanda ALTI çift lastikli yol tekeri · ÖNDE 11 dişli tahrik çarkı ·
//   ARKADA ayarlı gergi tekeri · burulma çubuğu süspansiyon
//   şasi: uzatılmış Bradley (M993); gövde 5083, kabin 7039 alüminyum
//   roket 227 mm · her kapsülde (LPC) 6 tüp, iki kapsül = 12 tüp
//   kapsül 4.04 m uzun (kızaksız) · 1.05 m geniş · 0.72 m yüksek
//
// NEDEN HIMARS DEĞİL: sette ayrıca bir askeri kamyon var; tekerlekli HIMARS
// tepeden bakışta ondan ayrışmıyordu. Paletli M270 hem şasisiyle hem 12
// tüplük lançer paketiyle kütüphanede eşsiz kalıyor.
//
// GÖVDE MAKİNESİ — KESİTTEN LOFT (referans: models/otomobil.js). Gövde, x
// boyunca 45 istasyonda ayrı ayrı hesaplanan KAPALI KESİTLERİN dikilmesiyle
// kuruluyor. Otomobilden tek farkı kesitin KAVİSLİ değil KIRIKLI olması:
// zırhlı araç düz plakalardan kaynaklıdır, kavis değil KESKİN KENAR ister.
//   * kesit 12 KÖŞEden (12 düz kenar) oluşuyor,
//   * her kenarın uçları halkada İKİ KEZ yazılıyor → computeVertexNormals
//     komşu plakaların normalini ORTALAYAMIYOR, kaynak sırtı keskin kalıyor.
//     (Tek kez yazılsaydı kutu ölçüsü aynı kalır ama gövde sabun kalıbı gibi
//      yumuşar, zırh plakası hiç okunmazdı.)
//   * kesit parametreleri (eşik, alt gövde, sponson, güverte — yükseklik ve
//     genişlikleri) x boyunca kendi MONOTON KÜBİK (PCHIP) eğrisinden okunuyor.
//
// ⚠️ Gövdeyi küçük kutuları uç uca dizerek kurmak DENENMEDİ: motosiklet dersi
// (devir §3) matematiksel örtüşmenin görsel süreklilik vermediğini ölçtü.
// Burun · glasi · kabin · güverte TEK kabuk; kabin ayrı bir kutu değil,
// güverte eğrisinin öne doğru 66°'lik tek parça yükselişi.
//
// PARÇALAR (Studio3D bu adları arar, DEĞİŞTİRME):
//   teker_1..12          → yol tekerleri (GRUP). _WHEELS.radius = R_TEKER = 0.305
//   disli_1/2, gergi_1/2 → tahrik çarkı ve gergi tekeri (GRUP), onlar da döner
//   govde, etek_1/2, kapi_1/2 → BİRİNCİL RENK (_TINT.parts)
//   paket_1/2            → İKİNCİL RENK (_TINT.parts2), roket kapsülleri
//   lanser_taret · kafes · kafes_koruma · paket_1/2 · tup_agiz · krik_1/2
//                        → _TURRETS grubu (lançerin yatay dönüşü)
//
// ⚠️ TARET PARÇALARI modelGroup'un DOĞRUDAN çocuğu olmak ZORUNDA. Motor
// `_TURRETS`teki her parçayı pivottaki bir gruba TAŞIYOR ve taşırken
// `o.position.x -= pivot[0]` yapıyor; parça bir alt grubun içinde olsaydı
// position'ı o grubun yereline göre olur, taret dönerken parça aracın
// yanına fırlardı.
//
// KUTU (ÖLÇÜLDÜ, ucgen_say.js): 6.995 x 2.590 x 2.970.
//   yükseklik ve genişlik katalog değerinin TAM üstünde; x'teki 25 mm fazla
//   çeki kancaları ile stop lambalarının kıç levhasını geçen payı.
// AĞIRLIK (ÖLÇÜLDÜ): 109 mesh / 8924 üçgen. Kıyas: otomobil 84 / 12968.
//   Daha az üçgen ama daha çok mesh: zırhlı araç düz plakalardan kurulu,
//   otomobil ise kavisli tek bir kabuk. Dağılım (ÖLÇÜLDÜ):
//     16 teker/dişli/gergi 2952 (%33) · lançer modülü 2052 (%23) ·
//     iki palet 1472 (%17) · paneller ve yüz parçaları 1176 (%13) ·
//     gövde loft kabuğu 1080 (%12) · etek + sandık 192 (%2)
//   Yani bütçenin yarısı YÜRÜYEN TAKIMDA; gövde kabuğu ucuz, çünkü kesit
//   12 düz kenardan ve kenar başına tek dörtgenden oluşuyor.
// YUVARLANMA (ÖLÇÜLDÜ, gerçek motorda, sabitlenmiş glide.t ile): 16 dönen
//   parçanın altı ayrı t değerindeki açısı, kat edilen yol / 0.305'ten
//   en fazla 0.000032 derece sapıyor.
// PARLAKLIK (ÖLÇÜLDÜ, parlaklik.py): tepe bakışında tam beyaz piksel %0.0
//   (kıyas taksi %2, otobüs %13). Kum rengine (#c2b280) boyandığında da
//   %0.0. Beyaza yakın bir tonda (#efece2) patlıyor — ama bu her modelde
//   kullanıcının seçimine bağlı, varsayılanda sorun yok.
//
// YÖN: burun +x, üst +y, taban y=0. Ölçüler gerçek metre.
// SİMETRİ: model z'de tam simetrik. Harita her modeli soldan sağa AYNALIYOR
// (det(projection) negatif — devir §5.3); simetrik modelde bu tuzağın
// görünür bir sonucu yok, bu yüzden tek yana yazı/asimetrik kapak KOYULMADI.

// ===========================================================================
// 0. RENKLER
// ===========================================================================
const C_GOVDE  = '#4c5545';   // _TINT varsayılanı — NATO yeşili
const C_KOYU   = '#1e2119';   // oyuk, ızgara dibi, gölgeli aralık
const C_PALET  = '#292b2d';   // palet zinciri
const C_LASTIK = '#2b2e2c';   // yol tekeri kaplaması
const C_JANT   = '#5c6553';
const C_CAM    = '#161b1f';
const C_KAFES  = '#414937';   // lançer kafesi (gövdeden bir ton koyu)
const C_PAKET  = '#59624c';   // roket kapsülü — _TINT.varsayilan2
const C_TUP    = '#0d0f11';   // tüp içi
const C_FAR    = '#c6d0da';
const C_STOP   = '#8f2b23';
const C_CELIK  = '#6d7566';   // kaynaklı ek, tutamak, çeki demiri
// ⚠️ metalness 0.85+ neredeyse SİYAH (sahnede environment map yok, metal
// malzemenin difüz bileşeni sıfır). Askeri araçta zaten mat boya isteniyor:
// düşük metalness + yüksek roughness. Ama metalness SIFIRA da indirilmiyor —
// açık renkte patlamayı terbiye eden şey o (uçakta ölçüldü, devir §5.1) ve
// kullanıcı gövdeyi beyaz/kum rengi yapabiliyor.
const MAT_GOVDE = { metal: 0.26, rough: 0.70 };
const MAT_PALET = { metal: 0.44, rough: 0.58, flat: true };

// ===========================================================================
// 1. TEMEL ÖLÇÜLER
// ===========================================================================
const UZUN      = 3.485;    // yarı uzunluk → 6.97 m
const R_TEKER   = 0.305;    // YOL TEKERİ YARIÇAPI
                            // ⚠️ _WHEELS.radius ile BİREBİR aynı olmalı:
                            // motor kat edilen yolu bu sayıya bölüyor.
                            // (Otobüste 0.521→0.478 düzeltmesi tam bu
                            //  yüzden yapıldı — devir §6.1.)
const PALET_ET  = 0.048;    // palet baklasının en kalın yeri
const AKS_Y     = R_TEKER + PALET_ET;        // 0.353 — palet yerdeyken aks
const PALET_GEN = 0.533;    // T157I ayak genişliği
const PALET_ADIM = 0.1524;  // T157I adımı — baklalar GERÇEK adımda
const IZ_Z      = (2.970 - PALET_GEN) / 2;   // 1.2185 — palet orta hattı
const PALET_DIS = IZ_Z + PALET_GEN / 2;      // 1.4850 — aracın EN GENİŞ yeri
// Altı yol tekeri. İlk ve son tekerin arası = yere basan uzunluk 4.330 m.
const TEKER_X = [2.100, 1.234, 0.368, -0.498, -1.364, -2.230];
const DISLI_X = 2.980, DISLI_Y = 0.640, R_DISLI = 0.300;   // önde tahrik
// Gergi tekeri yol tekeriyle AYNI yarıçapta (Bradley türevinde de öyle).
// Bu tesadüf değil, gerekçe: motor `_WHEELS`teki BÜTÜN parçalara AYNI dönme
// açısını yazıyor. Yarıçapı farklı olsaydı gergi yanlış hızda dönerdi.
const GERGI_X = -3.060, GERGI_Y = 0.520, R_GERGI = R_TEKER;  // arkada gergi

// Lançer (M269 yükleyici-lançer modülü): kaide (sabit) · taret (döner) · kafes
const KAFES_X0 = -3.400, KAFES_X1 = 0.800;   // kafes boyu 4.20 m
const KAFES_Z  = 1.180;                      // kafes yarı genişliği
const KAFES_Y0 = 1.720, KAFES_Y1 = 2.590;    // 2.590 = seyir yüksekliği
const PIVOT_X  = (KAFES_X0 + KAFES_X1) / 2;  // -1.300 → _TURRETS.pivot [-1.3, 0]
const PAKET_X0 = -3.360, PAKET_X1 = 0.680;   // kapsül boyu 4.04 m
const PAKET_Y0 = 1.780, PAKET_Y1 = 2.500;    // kapsül ZARFI — yüksekliği 0.72 m
                            // (demet bu zarfın içinde: alt teğet 1.790,
                            //  üst teğet 2.490; kuşaklar 1.780–2.500'e taşıyor)
const TUP_Z = [0.875, 0.525, 0.175, -0.175, -0.525, -0.875];  // 6 sütun
const TUP_Y = [1.960, 2.320];                                 // 2 sıra
// ⚠️ TÜP ÇAPI DÜZELTİLDİ (2026-09-04). Eskiden R_TUP = 0.1135, yani ağzın
// deliği 227 mm — ama 227 mm ROKETİN çapı, tüpün değil: bir fırlatma tüpü
// içindeki roketten zorunlu olarak BÜYÜK olmak durumunda (roket dört kızak
// pabucuyla tüpün içinde yürür). Kapsülün kendi ölçüsü de eski çapı
// açıklamıyordu: 1.05 / 3 = 0.350 ve 0.72 / 2 = 0.360, yani gözenek adımı
// 350 × 360 mm; eski 271 mm'lik dış çap bir gözeneğin ancak %77'sini
// dolduruyor ve kapsül yüzünün %64'ü boş levha kalıyordu — ölçülen "blob".
// Ayrıca aynı LP/C'ye altı roket yerine TEK bir 610 mm'lik ATACMS giriyor;
// üst üste iki tüp 2 × 271 = 542 mm ile onu alamazdı.
const R_TUP     = 0.1400;   // tüp DELİĞİ — çap 280 mm (227 mm roket + pabuç payı)
const R_TUP_DIS = 0.1700;   // tüp DIŞI  — çap 340 mm; adımın (350) 10 mm altı,
                            // yani tüpler demet hâlinde neredeyse teğet.
                            // Demetin zarfı: z 3 × 0.350 = 1.050, y 0.360 +
                            // 0.340 = 0.700 → kapsülün katalog kesiti
                            // (1.05 × 0.72) tam olarak bu demetin kabuğu.
const TUP_ALT = TUP_Y[0] - R_TUP_DIS;     // 1.790 — demetin alt teğeti (kızak)

// ---- YÜKSELİŞ MAFSALI (2026-09-04) ---------------------------------------
// ⚠️ ESKİ KURULUMDA LANÇER HİÇ KALKAMAZDI. Yükseliş kulakları kafesin TAM
// ORTASINDAydı (x = PIVOT_X = −1.300). Kafes 4.20 m ve ağızlar arkada, yani
// ateş için ARKA ucun kalkması gerekiyor; ortadan mafsallı bir kirişte arka
// kalkarken ÖN ucu aynı kadar iner. Ölçüldü: ön alt köşe (0.800, 1.720)
// güverteye (1.400) daha 9.4 derecede değiyor. Mafsal bu yüzden kafesin ÖN
// UCUNA taşındı; tabla ondan öne uzanan iki kolla mafsalı taşıyor.
const MAFSAL_X = 0.640, MAFSAL_Y = 1.800;   // yükseliş ekseni (model uzayı)
// Yükseliş krikosu: ALT ucu tablanın kolunda (kalkmaz), ÜST ucu kafeste
// (kalkar). Aradaki mesafe açıyla değiştiği için kriko geometrisi BİRİM
// uzunlukta kuruluyor ve davranış her karede geriyor (mancınıktaki halat
// deseni). Dinlenmede boy 0.732 m, 45 derecede 1.463 m — iki katı, gerçek
// bir hidrolik silindirin stroku.
const KRIK_X0 = -0.900, KRIK_Y0 = 1.640;    // sabit uç (lanser_taret kolu)
const KRIK_X1 = -0.300, KRIK_Y1 = 2.060;    // kafesteki uç, DİNLENME pozunda
const KRIK_Z = 1.240, R_KRIK = 0.060;
// Rampada ateşlenen roketler (M26: 3.94 m boy, 227 mm çap). ÜÇÜ birden
// değil, salvo hâlinde sırayla çıkıyorlar; dinlenmede tüpün İÇİNDE ve
// görünmezler — ölçü kutusunu büyütmesinler diye tam tüp boyunca park
// ediyorlar (kuyruk x = PAKET_X0 + ROKET_BOY = 0.580, burun ağızda).
const ROKET_BOY = 3.940, R_ROKET = 0.1135;
const ROKET_TUP = [0, 2, 4];                // TUP_Z indisleri (üst sıra)

// ===========================================================================
// 2. MONOTON KÜBİK EĞRİ (PCHIP) — otomobil.js ile birebir
// ===========================================================================
// Catmull-Rom BIRAKILDI: eğimin sert değiştiği yerde (burada glasi ile kabin
// tavanının birleştiği köşe) taşma yapıyor ve tavan öne doğru tümsek atıyor.
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
// GÜVERTE / TAVAN çizgisi. Burundan geriye: kısa bir burun dudağı (0.745),
// sonra 66°'lik TEK PARÇA glasi ta kabin tavanına kadar (2.240), 1.19 m düz
// tavan, kabinin dik arka duvarı ve arkada 1.400'lük alçak lançer güvertesi.
// ⚠️ Kabin ile glasi AYRI KUTU DEĞİL. M270'in yüzü tek bir eğik levhadır;
// camlar o levhanın üstüne oturur. İki ayrı kutu olsaydı aradaki ek yeri
// her bakışta yapay bir çizgi olarak okunurdu.
const Y_DECK = egriYap([
    [-3.485, 1.330], [-3.330, 1.400], [-2.400, 1.400], [-0.600, 1.400],
    [ 0.900, 1.400], [ 1.160, 1.400], [ 1.250, 1.640], [ 1.340, 2.080],
    [ 1.430, 2.240], [ 2.620, 2.240], [ 2.720, 2.205], [ 2.860, 1.885],
    [ 3.020, 1.520], [ 3.180, 1.155], [ 3.340, 0.900], [ 3.485, 0.745]
]);
// EŞİK / GÖVDE TABANI. Ortada 0.430 (yerden yükseklik ölçüsü), uçlarda
// yaklaşma-ayrılma açısı için kalkıyor.
const Y_BELLY = egriYap([
    [-3.485, 0.620], [-3.280, 0.500], [-3.000, 0.440], [-2.600, 0.430],
    [ 2.600, 0.430], [ 3.060, 0.462], [ 3.300, 0.545], [ 3.485, 0.640]
]);
// SPONSON TABANI — üst gövdenin paletin üstüne taşan çıkıntısının ALT yüzü.
// Burna doğru yükselip güverteyle birleşiyor; orada çıkıntı için yer kalmıyor
// ve kesit kendiliğinden yalın bir yamuğa düşüyor (kelepçe aşağıda).
const Y_SPONSON = egriYap([
    [-3.485, 1.060], [-3.200, 1.000], [-2.000, 1.000], [ 2.000, 1.000],
    [ 2.900, 1.020], [ 3.200, 1.100], [ 3.485, 1.300]
]);
// TABAN DÜZ KISMININ yarı genişliği (gövdenin en altı, paletlerin arası).
const W_BELLY = egriYap([
    [-3.485, 0.550], [-3.150, 0.680], [-2.500, 0.720], [ 2.500, 0.720],
    [ 3.150, 0.680], [ 3.485, 0.560]
]);
// ALT GÖVDE yarı genişliği. 0.950 = paletin İÇ yüzü (1.2185 − 0.2665) ile
// tam hizada: alt gövde paletlerin ARASINA oturuyor.
const W_LOWER = egriYap([
    [-3.485, 0.780], [-3.150, 0.900], [-2.500, 0.950], [ 2.500, 0.950],
    [ 3.100, 0.940], [ 3.485, 0.860]
]);
// ÜST GÖVDE (sponson) yarı genişliği 1.400; paletin dış yüzü 1.485, yani
// aracın en geniş yeri PALET. Ölçü kutusunun z'si buradan 2.97 çıkmalı.
// ⚠️ Burunda genişlik BİLEREK geç daralıyor. İlk kurulumda 3.25'te 1.230,
// uçta 0.980 idi ve ön siluet küvet gibi yuvarlanıyordu; M270'in glasisi
// paletlerin ÜSTÜNE taşan neredeyse tam genişlikte bir levhadır.
const W_SPONSON = egriYap([
    [-3.485, 1.240], [-3.300, 1.360], [-3.000, 1.400], [ 2.600, 1.400],
    [ 3.150, 1.390], [ 3.340, 1.320], [ 3.485, 1.180]
]);

const PAH_UST = 0.075;   // güverte üst pahının yüksekliği
const PAH_ALT = 0.100;   // taban pahının yüksekliği
const SPON_EGIM = 0.060; // sponson alt yüzünün dışa doğru yükselmesi

// ===========================================================================
// 3. KESİT — 12 köşeli kapalı poligon
// ===========================================================================
// Köşe sırası (+z yarısı aşağıdan yukarı, güverteden -z yarısı aşağı,
// tabandan kapanır):
//   c0 ( wb, yb        )  taban düz kısmın ucu
//   c1 ( wl, yb+pAlt   )  taban pahının üstü
//   c2 ( wl, ys        )  alt gövde yan yüzünün üstü
//   c3 ( ws, ys+sEg    )  sponson alt yüzünün dış ucu
//   c4 ( ws, yd-pUst   )  üst gövde yan yüzünün üstü
//   c5 ( wd, yd        )  güverte kenarı
//   c6..c11 = c5..c0'ın -z aynası
// Kenar (segment) sayısı 12; s5 = GÜVERTE (orta hattı geçer), s11 = TABAN.
function kesitPar(x) {
    const yb = Y_BELLY(x);
    let yd = Y_DECK(x);
    if (yd < yb + 0.06) yd = yb + 0.06;
    let ys = Y_SPONSON(x);
    const alt = yb + 0.08, ust = yd - 0.10;
    // ⚠️ Burunda kesit o kadar alçalıyor ki sponson için yer kalmıyor
    // (ust < alt). Orada sponson orta yüksekliğe çekiliyor; genişlik farkı da
    // kapandığı için kesit kendiliğinden basit bir yamuğa düşüyor. Kelepçe
    // olmasaydı köşeler birbirinin üstünden atlar ve kabuk kendi içine katlanırdı.
    ys = (ust <= alt) ? (yb + yd) / 2 : Math.min(Math.max(ys, alt), ust);
    const wb = W_BELLY(x);
    const wl = Math.max(W_LOWER(x), wb + 0.02);
    const ws = Math.max(W_SPONSON(x), wl);
    const wd = Math.max(0.04, ws - 0.10);
    const pAlt = Math.min(PAH_ALT, (ys - yb) * 0.45);
    const sEg  = Math.min(SPON_EGIM, (yd - ys) * 0.25);
    const pUst = Math.min(PAH_UST, (yd - ys) * 0.30);
    return [
        [ wb, yb], [ wl, yb + pAlt], [ wl, ys], [ ws, ys + sEg],
        [ ws, yd - pUst], [ wd, yd],
        [-wd, yd], [-ws, yd - pUst], [-ws, ys + sEg], [-wl, ys],
        [-wl, yb + pAlt], [-wb, yb]
    ];
}

// KÖŞE UZAYI (S). S = j + f → j numaralı kenarın f kadarında bir nokta.
// ⚠️ Otomobilde paneller ya sabit kesit parametresiyle ya sabit YÜKSEKLİKLE
// yazılıyordu. Kırıklı kesitte ikisi de yetmiyor: aynı plakanın üstünde
// kalması gereken bir bant, kesitin oranları x boyunca değişince plakadan
// kayıyor (kapı camı sponsonun alt kenarına doğru sürükleniyordu). Köşe
// uzayı bunu kökünden çözüyor — S=3.2 HER x'te "sponson yan yüzünün %20'si"
// demek, plaka ne kadar büyürse büyüsün.
function kesitNoktaS(K, S) {
    const n = K.length;
    let j = Math.floor(S); const f = S - j;
    j = ((j % n) + n) % n;
    const a = K[j], b = K[(j + 1) % n];
    return [a[0] + (b[0] - a[0]) * f, a[1] + (b[1] - a[1]) * f];
}
function nokta3(x, S) {
    const p = kesitNoktaS(kesitPar(x), S);
    return [x, p[1], p[0]];
}
// Sayısal yüzey normali (dışa bakar). Panelleri yüzeyden bu yönde ötelüyoruz.
// ⚠️ Bandı bir KÖŞENİN üstüne yazma: sonlu fark iki plakanın normalini
// karıştırır ve panel yüzeyin içine girer. Bantlar plakanın içinde kalsın.
function normal3(x, S) {
    const hx = (x > UZUN - 0.006) ? -0.004 : 0.004, hs = 0.006;
    const a = nokta3(x, S), b = nokta3(x + hx, S), c = nokta3(x, S + hs);
    const ux = b[0] - a[0], uy = b[1] - a[1], uz = b[2] - a[2];
    const vx = c[0] - a[0], vy = c[1] - a[1], vz = c[2] - a[2];
    let nx = uy * vz - uz * vy, ny = uz * vx - ux * vz, nz = ux * vy - uy * vx;
    const L = Math.sqrt(nx * nx + ny * ny + nz * nz) || 1;
    nx /= L; ny /= L; nz /= L;
    const K = kesitPar(x), yc = (K[0][1] + K[5][1]) / 2;
    if (ny * (a[1] - yc) + nz * a[2] < 0) { nx = -nx; ny = -ny; nz = -nz; }
    return [nx, ny, nz];
}
// Verilen yükseklikteki S. y, S ile [0..6] aralığında monoton arttığı için
// ikili arama yeterli. taraf +1 → +z yanı, −1 → -z yanı (aynası 11−S).
function sYukseklik(x, y, taraf) {
    const K = kesitPar(x);
    let a = 0, b = 5.999;
    for (let i = 0; i < 26; i++) {
        const m = (a + b) / 2;
        if (kesitNoktaS(K, m)[1] < y) a = m; else b = m;
    }
    const s = (a + b) / 2;
    return taraf < 0 ? (11 - s) : s;
}

// ===========================================================================
// 4. GÖVDE KABUĞU (loft)
// ===========================================================================
// İstasyonlar eğrilerin KIRILDIĞI yerde sık: glasi, kabin tavanının ön ve
// arka kenarı, kabin arka duvarı, kıç. Düz güvertede seyrek — orada kesit
// hiç değişmiyor, sık örneklemek yalnız üçgen harcar.
// ⚠️ İSTASYONLAR ARTAN x SIRASINDA OLMAK ZORUNDA. Loft üçgeninin normali
//   n = (0, −dz, dy) · dx
// ile çıkıyor; dx negatifse BÜTÜN kabuk içe döner. İlk kurulumda liste
// burundan kıça (azalan) yazılmıştı ve ölçüldü: `govde`nin işaretli hacmi
// −14.59 (dışa dönük bir kabukta POZİTİF olmalı). Sonuç ekranda hemen belli
// olmuyordu çünkü builder.js sahneyi `scale.z = −1` ile aynalıyor ve sarımı
// bir kez daha çeviriyor — ama gerçek motorda ve gölgede yanlış.
const IST = [
    -3.485, -3.420, -3.360, -3.270, -3.150, -3.000, -2.750,
    -2.450, -2.100, -1.700, -1.200, -0.700, -0.200, 0.300, 0.700, 1.000,
    1.160, 1.200, 1.250, 1.300, 1.345, 1.390,
    1.430, 1.470, 1.560, 1.700, 1.900, 2.150, 2.400,
    2.620, 2.670, 2.720, 2.770, 2.825, 2.890, 2.955, 3.020, 3.085, 3.150,
    3.215, 3.280, 3.340, 3.395, 3.440, 3.485
];

function halka(x) {
    // 12 kenar × 2 uç = 24 nokta. Kenar uçları BİLEREK iki kez yazılıyor
    // (2m = m'inci kenarın başı, 2m+1 = sonu) → computeVertexNormals komşu
    // plakaların normalini ortalayamıyor, zırh plakasının sırtı keskin kalıyor.
    const K = kesitPar(x), r = [];
    for (let m = 0; m < 12; m++) { r.push(K[m]); r.push(K[(m + 1) % 12]); }
    return r;
}

(function govdeKur() {
    const P = [], IDX = [];
    for (let i = 0; i < IST.length; i++) {
        const h = halka(IST[i]);
        for (let j = 0; j < 24; j++) P.push(IST[i], h[j][1], h[j][0]);
    }
    for (let i = 0; i < IST.length - 1; i++) {
        for (let m = 0; m < 12; m++) {
            // YALNIZ kenarın kendi çifti arasında dörtgen kur. Kopya noktalar
            // arasında da kurulsaydı sıfır alanlı (dejenere) üçgenler çıkardı:
            // çizim maliyeti var, pikseli yok.
            const j = 2 * m, j2 = 2 * m + 1;
            const a = i * 24 + j, b = i * 24 + j2;
            const c = (i + 1) * 24 + j, d = (i + 1) * 24 + j2;
            IDX.push(a, c, d, a, d, b);
        }
    }
    // Ön ve arka kapak: 12 köşe üstünde üçgen yelpaze. Köşeler yine
    // KOPYALANIYOR ki kapağın normali yan yüzeyinkiyle ortalanmasın.
    function kapak(ist, onYuz) {
        const K = kesitPar(ist);
        let ym = 0;
        for (const p of K) ym += p[1];
        ym /= K.length;
        const merkez = P.length / 3;
        P.push(ist, ym, 0);
        const bas = merkez + 1;
        for (let j = 0; j < 12; j++) P.push(ist, K[j][1], K[j][0]);
        for (let j = 0; j < 12; j++) {
            const a = bas + j, b = bas + (j + 1) % 12;
            // Ön yüzden (+x) bakışta halka bir yönde, arka yüzden bakışta
            // ters ilerliyor; sarım buna göre ayrılıyor.
            if (onYuz) IDX.push(merkez, b, a); else IDX.push(merkez, a, b);
        }
    }
    kapak(IST[IST.length - 1], true);     // burun (+x)
    kapak(IST[0], false);                 // kıç (−x)

    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.Float32BufferAttribute(P, 3));
    geo.setIndex(IDX);
    geo.computeVertexNormals();
    modelGroup.add(mesh(geo, C_GOVDE, { metal: MAT_GOVDE.metal,
                                        rough: MAT_GOVDE.rough, name: 'govde' }));
})();

// ===========================================================================
// 5. YÜZEYE OTURAN PANELLER
// ===========================================================================
// Cam, kapı, ızgara, kaynak hattı, far — hepsi aynı yardımcıdan. Gövde yüzeyi
// x1..x2 ve S1..S2 aralığında yeniden örnekleniyor ve normal boyunca `disari`
// kadar öteleniyor. Düz levha olsalardı glasi gibi eğik yüzeylerde yer yer
// batar yer yer havada kalırlardı.
// Bant biçimi: [x1, x2, S1, S2]           → köşe uzayı (yukarı bak)
//              [x1, x2, y1, y2, taraf]    → YÜKSEKLİK; her x'te o yüksekliğin
//              S'si aranır. Yatay bir çizgiyi izleyen parçalar (kaynak hattı)
//              böyle yazılır; sabit S ile yazılsalardı burna doğru kayarlardı.
function yuzeyYama(ad, bantlar, nx, ns, disari, renk, opts) {
    opts = opts || {};
    const P = [], IDX = [];
    for (const bant of bantlar) {
        const x1 = bant[0], x2 = bant[1], a1 = bant[2], a2 = bant[3];
        const taraf = bant.length > 4 ? bant[4] : 0;
        const taban = P.length / 3, S = ns + 1;
        for (let i = 0; i <= nx; i++) {
            const x = x1 + (x2 - x1) * i / nx;
            for (let j = 0; j <= ns; j++) {
                const a = a1 + (a2 - a1) * j / ns;
                const s = taraf ? sYukseklik(x, a, taraf) : a;
                const p = nokta3(x, s), n = normal3(x, s);
                P.push(p[0] + n[0] * disari, p[1] + n[1] * disari, p[2] + n[2] * disari);
            }
        }
        for (let i = 0; i < nx; i++) {
            for (let j = 0; j < ns; j++) {
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
        metal: opts.metal == null ? 0.24 : opts.metal,
        rough: opts.rough == null ? 0.62 : opts.rough,
        flat: !!opts.flat, name: ad
    });
    m.material.side = THREE.DoubleSide;
    // ⚠️ Aynı yüzeye oturan panellerde DERİNLİK KAVGASI (trende ölçüldü):
    // castShadow/receiveShadow kapatmak ÇÖZMÜYOR (sorun z-tamponu, gölge
    // değil), öteleme büyütmek kutu ölçüsünü bozuyor. Çözüm polygonOffset,
    // katman katman: kapı 1, kapı hattı 3, cam 4.
    const kat = opts.kat == null ? 1 : opts.kat;
    m.material.polygonOffset = true;
    m.material.polygonOffsetFactor = -kat;
    m.material.polygonOffsetUnits = -kat;
    // Kalınlıksız paneller gövdeye 4-18 mm mesafede: gölge haritasına
    // girerlerse kendi gölgelerini gövdenin üstüne basıp benek üretiyorlar.
    m.castShadow = false;
    modelGroup.add(m);
    return m;
}

// ---- kabin camları --------------------------------------------------------
// Glasi tek parça eğik levha; camlar onun ÜST bölümünde. Güverte kenarı
// S=5 (+z) → S=6 (−z), yani S=5.5 tam orta hat.
// ⚠️ Gerçek M270'de camların önünde panjurlu zırh kapağı var; modelde cam
// koyu, çevresinde gövde renginde bir çerçeve kalıyor — o çerçeve panjur payı.
yuzeyYama('cam_on_1', [[2.760, 2.950, 5.130, 5.400]], 5, 5, 0.010, C_CAM,
          { metal: 0.34, rough: 0.16, kat: 3 });
yuzeyYama('cam_on_2', [[2.760, 2.950, 5.600, 5.870]], 5, 5, 0.010, C_CAM,
          { metal: 0.34, rough: 0.16, kat: 3 });
yuzeyYama('cam_cerceve', [
    [2.740, 2.970, 5.100, 5.135], [2.740, 2.970, 5.395, 5.430],
    [2.740, 2.970, 5.570, 5.605], [2.740, 2.970, 5.865, 5.900]
], 4, 1, 0.006, C_KOYU, { metal: 0.15, rough: 0.85, kat: 2 });
// Panjurlu zırh kepengi: camların önündeki üç yatay çıta. Gerçek M270'de
// camlar sahada bu kepengin arkasında durur; modelde hem doğru hem de
// kabinin yüzündeki iki büyük siyah dikdörtgeni bölüyor.
yuzeyYama('panjur', [
    [2.802, 2.826, 5.130, 5.400], [2.858, 2.882, 5.130, 5.400],
    [2.914, 2.938, 5.130, 5.400],
    [2.802, 2.826, 5.600, 5.870], [2.858, 2.882, 5.600, 5.870],
    [2.914, 2.938, 5.600, 5.870]
], 1, 4, 0.016, '#3f4739', { metal: 0.2, rough: 0.8, kat: 4 });

// ---- kabin yan kapıları ---------------------------------------------------
// Sponson yan yüzü: +z tarafında S∈[3,4], −z tarafında aynası S∈[7,8].
[[1, 3.10, 3.90], [-1, 7.10, 7.90]].forEach(function (t, i) {
    const S0 = t[1], S1 = t[2];
    yuzeyYama('kapi_' + (i + 1), [[1.560, 2.480, S0, S1]], 6, 4, 0.005, C_GOVDE,
              { metal: MAT_GOVDE.metal, rough: MAT_GOVDE.rough, kat: 1 });
    yuzeyYama('kapi_hat_' + (i + 1), [
        [1.560, 1.596, S0, S1], [2.444, 2.480, S0, S1],
        [1.560, 2.480, S0, S0 + 0.04], [1.560, 2.480, S1 - 0.04, S1]
    ], 3, 3, 0.009, C_KOYU, { metal: 0.1, rough: 0.9, kat: 3 });
    yuzeyYama('cam_yan_' + (i + 1),
              [[1.740, 2.320, S0 + 0.46, S0 + 0.74]], 4, 3, 0.011, C_CAM,
              { metal: 0.34, rough: 0.16, kat: 4 });
    // Kapı kolu + basamak tutamağı
    yuzeyYama('tutamak_' + (i + 1), [
        [2.330, 2.420, S0 + 0.30, S0 + 0.36]
    ], 2, 1, 0.020, C_CELIK, { metal: 0.42, rough: 0.42, kat: 5 });
});

// ---- güverte ayrıntıları --------------------------------------------------
// Kabin tavanındaki iki kapak (bölük komutanı + nişancı).
yuzeyYama('tavan_kapak_1', [[1.640, 2.060, 5.150, 5.470]], 3, 3, 0.008, '#3f4739',
          { kat: 2 });
yuzeyYama('tavan_kapak_2', [[1.640, 2.060, 5.530, 5.850]], 3, 3, 0.008, '#3f4739',
          { kat: 2 });
// Motor/soğutma ızgarası: kabinin hemen arkasında, alçak güvertede.
yuzeyYama('izgara', [[0.480, 1.060, 5.140, 5.860]], 4, 8, 0.006, C_KOYU,
          { metal: 0.30, rough: 0.55, flat: true, kat: 2 });
yuzeyYama('izgara_cita', [
    [0.560, 0.600, 5.150, 5.850], [0.700, 0.740, 5.150, 5.850],
    [0.840, 0.880, 5.150, 5.850], [0.980, 1.020, 5.150, 5.850]
], 1, 6, 0.011, C_CELIK, { metal: 0.38, rough: 0.45, kat: 3 });
// Gövde boyunca süren kaynak/plaka hattı: sponsonun üst kenarının hemen
// altında. YÜKSEKLİK biçiminde yazıldı — sabit S ile yazılsaydı burna doğru
// kesit daraldıkça çizgi yukarı tırmanırdı.
[1, -1].forEach(function (s, i) {
    yuzeyYama('kaynak_hat_' + (i + 1),
              [[-3.180, 1.140, 1.292, 1.238, s]], 22, 1, 0.006, '#3d4438',
              { metal: 0.15, rough: 0.9, kat: 1 });
});

// ---- ön farlar (glasinin alt ucunda) --------------------------------------
// Glasi eğik olduğu için farlar yüzey yaması: düz levha olsalardı biri gövdeye
// batar, öteki havada kalırdı.
[[1, 5.040, 5.190], [-1, 5.960, 5.810]].forEach(function (t, i) {
    const a = t[1], b = t[2], yon = t[0];
    yuzeyYama('far_yuva_' + (i + 1), [[3.170, 3.350, a, b]], 2, 2, 0.008, C_KOYU,
              { metal: 0.2, rough: 0.8, kat: 2 });
    yuzeyYama('far_' + (i + 1),
              [[3.190, 3.330, a + yon * 0.022, b - yon * 0.022]], 2, 2, 0.020,
              C_FAR, { metal: 0.12, rough: 0.10, kat: 3 });
    // Far koruma kafesi: üç ince çubuk, farın önünde.
    yuzeyYama('far_kafes_' + (i + 1), [
        [3.190, 3.212, a, b], [3.256, 3.278, a, b], [3.320, 3.342, a, b]
    ], 1, 2, 0.036, C_CELIK, { metal: 0.42, rough: 0.45, kat: 4 });
});

// ===========================================================================
// 6. KATI PARÇA YARDIMCILARI (kutu / prizma birleştirme)
// ===========================================================================
// ⚠️ Bunlar TEK MESH içinde birden çok gövde toplamak için. İki sebep:
//   1. `_applyTint` `getObjectByName` kullanıyor — aynı adlı meshlerden yalnız
//      İLKİ renk alır. Kafesi 20 ayrı "kafes" mesh'i yapsaydık 19'u boyasız
//      kalırdı.
//   2. `_TURRETS` her parçayı ADIYLA taşıyor; 20 parça 20 satır demek.
function kutuEkle(P, IDX, x0, x1, y0, y1, z0, z1) {
    const b = P.length / 3;
    P.push(x0, y0, z0, x1, y0, z0, x1, y1, z0, x0, y1, z0,
           x0, y0, z1, x1, y0, z1, x1, y1, z1, x0, y1, z1);
    IDX.push(b + 0, b + 3, b + 2, b + 0, b + 2, b + 1);   // −z
    IDX.push(b + 4, b + 5, b + 6, b + 4, b + 6, b + 7);   // +z
    IDX.push(b + 0, b + 1, b + 5, b + 0, b + 5, b + 4);   // −y
    IDX.push(b + 3, b + 7, b + 6, b + 3, b + 6, b + 2);   // +y
    IDX.push(b + 0, b + 4, b + 7, b + 0, b + 7, b + 3);   // −x
    IDX.push(b + 1, b + 2, b + 6, b + 1, b + 6, b + 5);   // +x
}
// (z,y) düzlemindeki kapalı çokgeni x boyunca süpürür.
// `ters` = yüzeyler İÇERİ baksın (tüp ağzı gibi oyuklar için).
function prizmaEkle(P, IDX, kesit, x0, x1, kapakOn, kapakArka, ters) {
    const n = kesit.length, b = P.length / 3;
    for (const p of kesit) P.push(x0, p[1], p[0]);
    for (const p of kesit) P.push(x1, p[1], p[0]);
    for (let j = 0; j < n; j++) {
        const j2 = (j + 1) % n;
        const a = b + j, bb = b + j2, c = b + n + j, d = b + n + j2;
        if (ters) IDX.push(a, d, c, a, bb, d); else IDX.push(a, c, d, a, d, bb);
    }
    let zm = 0, ym = 0;
    for (const p of kesit) { zm += p[0]; ym += p[1]; }
    zm /= n; ym /= n;
    if (kapakOn) {           // x1 yüzü, normal +x
        const m = P.length / 3; P.push(x1, ym, zm);
        for (let j = 0; j < n; j++) IDX.push(m, b + n + (j + 1) % n, b + n + j);
    }
    if (kapakArka) {         // x0 yüzü, normal −x
        const m = P.length / 3; P.push(x0, ym, zm);
        for (let j = 0; j < n; j++) IDX.push(m, b + j, b + (j + 1) % n);
    }
}
// x = sabit düzleminde HALKA kapak (iç yarıçap ri, dış yarıçap rd).
// `yon` +1 → normal +x, −1 → normal −x.
function halkaKapak(P, IDX, x, cz, cy, ri, rd, n, yon) {
    const b = P.length / 3;
    for (let i = 0; i < n; i++) {
        const t = i * Math.PI * 2 / n;
        P.push(x, cy + ri * Math.sin(t), cz + ri * Math.cos(t));
        P.push(x, cy + rd * Math.sin(t), cz + rd * Math.cos(t));
    }
    for (let i = 0; i < n; i++) {
        const j = (i + 1) % n;
        const a = b + 2 * i, aa = a + 1, c = b + 2 * j, cc = c + 1;
        if (yon > 0) IDX.push(a, cc, aa, a, c, cc);
        else IDX.push(a, aa, cc, a, cc, c);
    }
}
// (z,y) düzleminde daire / yay. a0 verilmezse kapalı çember.
function daire(cz, cy, r, n, a0, a1) {
    const p = [], kapali = (a0 == null);
    const b0 = kapali ? 0 : a0, b1 = kapali ? Math.PI * 2 : a1;
    const adet = kapali ? n : n + 1;
    for (let i = 0; i < adet; i++) {
        const t = b0 + (b1 - b0) * i / n;
        p.push([cz + r * Math.cos(t), cy + r * Math.sin(t)]);
    }
    return p;
}
function meshYap(ad, P, IDX, renk, opts) {
    opts = opts || {};
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.Float32BufferAttribute(P, 3));
    geo.setIndex(IDX);
    geo.computeVertexNormals();
    const m = mesh(geo, renk, {
        metal: opts.metal == null ? 0.26 : opts.metal,
        rough: opts.rough == null ? 0.70 : opts.rough,
        flat: !!opts.flat, name: ad
    });
    modelGroup.add(m);
    return m;
}

// ===========================================================================
// 7. ARKA VE ÖN YÜZ PARÇALARI
// ===========================================================================
// Kıç levhası GERÇEKTEN dik (x = −3.485, y 0.62..1.33), yani düz extrude
// burada DOĞRU araç: kesitin derinlik boyunca sabit olması sorun değil.
// Ön yüzde durum tersiydi — orası 66°'lik eğik levha, oraya yüzey yaması
// kondu. Ayrımı iki kez düşünmemek için gerekçe burada yazılı.
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
// ⚠️ `yuzParca` geometriyi x'ten x+derinlik'e uzatır; her parçanın
// x+derinlik'i kapağı 5-30 mm GEÇMELİ, yoksa parça havada kalır — ama
// fazlası da doğrudan ÖLÇÜ KUTUSUNU büyütür. Aşağıdakiler kıç levhasını
// 10-15 mm geçiyor.
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
        metal: opts.metal == null ? 0.26 : opts.metal,
        rough: opts.rough == null ? 0.62 : opts.rough, name: ad
    });
    modelGroup.add(m);
    return m;
}
[1, -1].forEach(function (s, i) {
    yuzParca('stop_' + (i + 1),
             [[s * 0.560, 0.770], [s * 0.790, 0.770], [s * 0.790, 0.965], [s * 0.560, 0.965]],
             0.03, -3.500, 0.050, C_STOP, { metal: 0.2, rough: 0.30 });
    yuzParca('kanca_' + (i + 1),
             [[s * 0.310, 0.665], [s * 0.470, 0.665], [s * 0.470, 0.790], [s * 0.310, 0.790]],
             0.03, -3.495, 0.075, C_CELIK, { metal: 0.42, rough: 0.42 });
});
yuzParca('kic_kapak', [[-0.520, 0.700], [0.520, 0.700], [0.520, 1.230], [-0.520, 1.230]],
         0.04, -3.492, 0.032, '#454d3e', { metal: 0.2, rough: 0.75 });
// Burun dudağında çeki gözü (ön kapak y 0.640..0.745; parça onu geçiyor).
yuzParca('on_kanca', [[-0.300, 0.652], [0.300, 0.652], [0.300, 0.738], [-0.300, 0.738]],
         0.02, 3.430, 0.065, C_CELIK, { metal: 0.42, rough: 0.42 });

// ===========================================================================
// 8. YÜRÜYEN TAKIM — palet, yol tekerleri, tahrik çarkı, gergi, etek zırhı
// ===========================================================================
// PALET YOLU, gerdirilmiş bir kayışın tekerlerin ETRAFINDAKİ hâlidir; bu da
// dairelerin DIŞBÜKEY ZARFIDIR. Elle poligon yazmak yerine daireler
// örnekleniyor ve zarf alınıyor: teker yeri/yarıçapı değişince palet
// kendiliğinden düzeliyor, hiçbir yerde çakışma ya da kopukluk kalmıyor.
// ⚠️ Alt koşu KENDİLİĞİNDEN düz çıkıyor (altı yol tekeri aynı yarıçapta ve
// aynı yükseklikte), yani "paleti yere oturt" diye ayrı bir düzeltme YOK.
function disbukeyZarf(nk) {
    nk = nk.slice().sort((a, b) => a[0] - b[0] || a[1] - b[1]);
    const capraz = (o, a, b) =>
        (a[0] - o[0]) * (b[1] - o[1]) - (a[1] - o[1]) * (b[0] - o[0]);
    const alt = [], ust = [];
    for (const p of nk) {
        while (alt.length >= 2 && capraz(alt[alt.length - 2], alt[alt.length - 1], p) <= 0) alt.pop();
        alt.push(p);
    }
    for (let i = nk.length - 1; i >= 0; i--) {
        const p = nk[i];
        while (ust.length >= 2 && capraz(ust[ust.length - 2], ust[ust.length - 1], p) <= 0) ust.pop();
        ust.push(p);
    }
    alt.pop(); ust.pop();
    return alt.concat(ust);      // saat yönünün TERSİ (CCW)
}

// ==== PALET DONME BASLANGIC ====
// ⚠️ 2026-09-06: bant FAZLI. Ayrıntılı gerekçe tank.js'te (aynı
// mekanizma, orada kesit 6 noktalı). Özet: zarfın yay uzunluğu tablosu
// SAKLANIYOR, `paletOrnek(faz)` istenen ofsette bakla noktaları veriyor,
// motor her karede `mesh.userData.paletKaydir(yolModelM)` çağırıyor.
// Bandin kapalı eğrisi aynı kaldığı için yalnız baklalar kayıyor.
//
// ⚠️ Kabartma DIŞARI çıkmıyor, İÇERİ oyuluyor: en kalın bakla PALET_ET'te
// kalıyor ki y=0'a değmeye devam etsin (AKS_Y = R_TEKER + PALET_ET).
// Eski desen 48/26 mm dönüşümlüydü (Δ 22 mm, 0.1524 m adımda 8.2°);
// yeni desen 3 baklalık testere dişi, Δ 30 mm → 11.1°.
const PALET_DERZ = 0.030;   // testere dişi derinliği (m)
const PALET_PER  = 3;       // desen periyodu (bakla)

const PALET_HAT = (function () {
    const nk = [], daireler = [[DISLI_X, DISLI_Y, R_DISLI], [GERGI_X, GERGI_Y, R_GERGI]];
    for (const tx of TEKER_X) daireler.push([tx, AKS_Y, R_TEKER]);
    for (const d of daireler) {
        for (let i = 0; i < 40; i++) {
            const a = i * Math.PI * 2 / 40;
            nk.push([d[0] + d[2] * Math.cos(a), d[1] + d[2] * Math.sin(a)]);
        }
    }
    const zarf = disbukeyZarf(nk);
    const cum = [0];
    for (let i = 0; i < zarf.length; i++) {
        const a = zarf[i], b = zarf[(i + 1) % zarf.length];
        cum.push(cum[i] + Math.hypot(b[0] - a[0], b[1] - a[1]));
    }
    const cevre = cum[zarf.length];
    // ⚠️ Bakla sayısı desen periyodunun KATI (dikis yerinde desen kırılmasın).
    const ham = Math.max(24, Math.round(cevre / PALET_ADIM));
    const bakla = PALET_PER * Math.max(8, Math.round(ham / PALET_PER));
    return { kaba: zarf, cum: cum, cevre: cevre, bakla: bakla };
})();

function paletOrnek(faz, cikti) {
    const K = PALET_HAT.kaba, C = PALET_HAT.cum, cevre = PALET_HAT.cevre;
    const n = K.length, m = PALET_HAT.bakla;
    let j = 0;
    for (let i = 0; i < m; i++) {
        let s = cevre * i / m + faz;
        s -= Math.floor(s / cevre) * cevre;
        if (s < C[j]) j = 0;
        while (j < n - 1 && C[j + 1] < s) j++;
        const t = (s - C[j]) / Math.max(C[j + 1] - C[j], 1e-9);
        const a = K[j], b = K[(j + 1) % n];
        const o = cikti[i];
        o[0] = a[0] + (b[0] - a[0]) * t;
        o[1] = a[1] + (b[1] - a[1]) * t;
    }
    return cikti;
}

// Faz 0'daki bakla noktaları (ölçüm betikleri bu adı okuyor).
const PALET_YOL = paletOrnek(0, (function () {
    const a = [];
    for (let i = 0; i < PALET_HAT.bakla; i++) a.push([0, 0]);
    return a;
})());

function paletKur(ad, zc) {
    const m = PALET_HAT.bakla, hw = PALET_GEN / 2;
    const z0 = zc - hw, z1 = zc + hw;
    const yol = [];
    for (let i = 0; i < m; i++) yol.push([0, 0]);
    // ⚠️ Float32BufferAttribute kurucusu diziyi KOPYALAR; canlı tampon
    // `attr.array`.
    const attr = new THREE.Float32BufferAttribute(new Float32Array(m * 4 * 3), 3);
    if (attr.setUsage && THREE.DynamicDrawUsage != null) attr.setUsage(THREE.DynamicDrawUsage);
    const P = attr.array;
    function yaz(faz) {
        paletOrnek(faz, yol);
        for (let i = 0; i < m; i++) {
            const p = yol[i], a = yol[(i - 1 + m) % m], b = yol[(i + 1) % m];
            let tx = b[0] - a[0], ty = b[1] - a[1];
            const L = Math.hypot(tx, ty) || 1; tx /= L; ty /= L;
            // CCW poligonda DIŞ normal = (ty, −tx)
            const nx = ty, ny = -tx;
            const t = PALET_ET - PALET_DERZ * (i % PALET_PER) / (PALET_PER - 1);
            let o = i * 12;
            P[o++] = p[0];           P[o++] = p[1];           P[o++] = z0;   // 4i+0 iç −z
            P[o++] = p[0];           P[o++] = p[1];           P[o++] = z1;   // 4i+1 iç +z
            P[o++] = p[0] + nx * t;  P[o++] = p[1] + ny * t;  P[o++] = z0;   // 4i+2 dış −z
            P[o++] = p[0] + nx * t;  P[o++] = p[1] + ny * t;  P[o++] = z1;   // 4i+3 dış +z
        }
    }
    yaz(0);
    const IDX = [];
    for (let i = 0; i < m; i++) {
        const j = (i + 1) % m;
        const a0 = 4 * i, a1 = a0 + 1, b0 = a0 + 2, b1 = a0 + 3;
        const c0 = 4 * j, c1 = c0 + 1, d0 = c0 + 2, d1 = c0 + 3;
        IDX.push(b0, d0, d1, b0, d1, b1);   // dış yüz
        IDX.push(a0, a1, c1, a0, c1, c0);   // iç yüz
        IDX.push(a1, b1, d1, a1, d1, c1);   // +z yanı
        IDX.push(a0, d0, b0, a0, c0, d0);   // −z yanı
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', attr);
    geo.setIndex(IDX);
    geo.computeVertexNormals();
    const par = mesh(geo, C_PALET, { metal: MAT_PALET.metal, rough: MAT_PALET.rough,
                                     flat: true, name: ad });
    // MOTOR KONTRATI: ileri giderken bandin ALT kolu gövdeye göre GERİ
    // gider; zarf artan indekste alt kolda +x'e ilerliyor → faz = -yol.
    par.userData.paletKaydir = function (yolM) {
        yaz(-yolM);
        attr.needsUpdate = true;
    };
    modelGroup.add(par);
}
paletKur('palet_1', IZ_Z);
paletKur('palet_2', -IZ_Z);
// ==== PALET DONME SON ====

// ---- yol tekerleri, tahrik çarkı, gergi -----------------------------------
// Grup deseni: grup rotation.x = π/2 ile yatırılıyor, rotation.y motora
// bırakılıyor (motor `getObjectByName(ad).rotation.y = −yol/yarıçap` yazıyor).
// Grubun İÇİNDEKİ silindirlerin ekseni yerel Y; Rx(90) onu dünya Z'sine, yani
// aks doğrultusuna taşıyor. Parçalar grubun içinde olduğu için hepsi BİRLİKTE
// dönüyor — ayrı mesh olsalardı her biri kendi merkezinde dönerdi.
function tekerlek(ad, x, z, r, tip) {
    const g = new THREE.Group();
    g.name = ad;
    g.position.set(x, tip === 'disli' ? DISLI_Y : (tip === 'gergi' ? GERGI_Y : AKS_Y), z);
    g.rotation.x = Math.PI / 2;
    const gen = PALET_GEN * 0.72;

    if (tip === 'disli') {
        // Tahrik çarkı: 11 diş. Dişler gerçekten modelleniyor çünkü DÖNMENİN
        // EN AÇIK GÖRÜLDÜĞÜ yer burası; düz bir disk dönerken hiçbir şey
        // değişmiyor gibi durur.
        const pts = [];
        for (let i = 0; i < 11; i++) {
            const a = i * Math.PI * 2 / 11;
            pts.push([r * Math.cos(a - 0.10), r * Math.sin(a - 0.10)]);
            pts.push([r * Math.cos(a + 0.10), r * Math.sin(a + 0.10)]);
            pts.push([(r - 0.078) * Math.cos(a + 0.20), (r - 0.078) * Math.sin(a + 0.20)]);
            pts.push([(r - 0.078) * Math.cos(a + 0.37), (r - 0.078) * Math.sin(a + 0.37)]);
        }
        const sh = new THREE.Shape();
        sh.moveTo(pts[0][0], pts[0][1]);
        for (let i = 1; i < pts.length; i++) sh.lineTo(pts[i][0], pts[i][1]);
        sh.closePath();
        const geo = new THREE.ExtrudeGeometry(sh, { depth: gen, bevelEnabled: false });
        geo.rotateX(-Math.PI / 2);   // yıldız yerel x-z düzlemine, itiş +y'ye
        // ⚠️ ExtrudeGeometry derinliği 0..depth arasına yazar, ORTALAMAZ.
        // Ortalanmadığında çark palet şeridinin dışına taşıyor: ilk ölçümde
        // dünya kutusu z'de 3.279 çıktı (olması gereken 2.970) ve çark
        // paletin 0.31 m dışında havada duruyordu.
        geo.translate(0, -gen / 2, 0);
        g.add(mesh(geo, C_JANT, { metal: 0.42, rough: 0.48, name: ad + '_dis' }));
    } else {
        // Çift lastikli teker: iki disk, aralarında merkez kılavuz boşluğu.
        [-1, 1].forEach(function (s, k) {
            const c = new THREE.CylinderGeometry(r, r, gen * 0.40, 12);
            c.translate(0, s * gen * 0.28, 0);
            g.add(mesh(c, C_LASTIK, { metal: 0.10, rough: 0.92,
                                      name: ad + '_lastik_' + (k + 1) }));
        });
        g.add(mesh(new THREE.CylinderGeometry(r * 0.52, r * 0.52, gen * 0.72, 10), C_JANT,
                   { metal: 0.36, rough: 0.50, name: ad + '_gobek' }));
    }
    // Göbek kolları: üç kollu levha, dış yüzde. Yuvarlanmanın gözle görüldüğü
    // yer bu; düz bir silindir dönerken duruyor gibi okunur.
    const kol = [];
    for (let i = 0; i < 3; i++) {
        const a = i * Math.PI * 2 / 3;
        kol.push([0.045 * Math.cos(a - 0.90), 0.045 * Math.sin(a - 0.90)]);
        kol.push([(r * 0.70) * Math.cos(a - 0.24), (r * 0.70) * Math.sin(a - 0.24)]);
        kol.push([(r * 0.70) * Math.cos(a + 0.24), (r * 0.70) * Math.sin(a + 0.24)]);
        kol.push([0.045 * Math.cos(a + 0.90), 0.045 * Math.sin(a + 0.90)]);
    }
    const ks = new THREE.Shape();
    ks.moveTo(kol[0][0], kol[0][1]);
    for (let i = 1; i < kol.length; i++) ks.lineTo(kol[i][0], kol[i][1]);
    ks.closePath();
    const kg = new THREE.ExtrudeGeometry(ks, { depth: 0.030, bevelEnabled: false });
    kg.rotateX(-Math.PI / 2);
    kg.translate(0, (z > 0 ? 1 : -1) * (gen * 0.50 + 0.004), 0);
    g.add(mesh(kg, '#6f7767', { metal: 0.40, rough: 0.42, name: ad + '_kol' }));
    modelGroup.add(g);
}
TEKER_X.forEach(function (tx, k) {
    tekerlek('teker_' + (2 * k + 1), tx, IZ_Z, R_TEKER, 'yol');
    tekerlek('teker_' + (2 * k + 2), tx, -IZ_Z, R_TEKER, 'yol');
});
tekerlek('disli_1', DISLI_X, IZ_Z, R_DISLI, 'disli');
tekerlek('disli_2', DISLI_X, -IZ_Z, R_DISLI, 'disli');
tekerlek('gergi_1', GERGI_X, IZ_Z, R_GERGI, 'gergi');
tekerlek('gergi_2', GERGI_X, -IZ_Z, R_GERGI, 'gergi');

// ---- yan etek zırhı -------------------------------------------------------
// Beş ayrı panel, aralarında 25 mm boşluk — M270'in eteği tek levha değil,
// sökülebilir plakalar dizisidir. Etek TAHRİK ÇARKI İLE GERGİ ARASINDA
// kalıyor: ikisi de açıkta, yani dönen parçaların en belirginleri görünür.
// Alt kenarı 0.700'de, yol tekerlerinin tepesi 0.658'de — tekerler tamamen
// açıkta, yuvarlanma gizlenmiyor.
// ⚠️ Eteğin dış yüzü 1.470'te, paletin dış yüzü 1.485'te. Eşitlenselerdi iki
// yüzey aynı düzleme düşer ve derinlik kavgası çıkardı; ayrıca gerçek araçta
// da en geniş yer PALETTİR.
[1, -1].forEach(function (s, i) {
    const P = [], IDX = [];
    const z0 = Math.min(s * 1.435, s * 1.470), z1 = Math.max(s * 1.435, s * 1.470);
    for (let k = 0; k < 5; k++) {
        const x0 = -2.650 + k * 1.040;
        kutuEkle(P, IDX, x0, x0 + 1.015, 0.700, 1.020, z0, z1);
    }
    // Eteği sponsonun alt kenarına bağlayan üst kuşak.
    const b0 = Math.min(s * 1.360, s * 1.470), b1 = Math.max(s * 1.360, s * 1.470);
    kutuEkle(P, IDX, -2.660, 2.560, 1.000, 1.062, b0, b1);
    meshYap('etek_' + (i + 1), P, IDX, C_GOVDE,
            { metal: MAT_GOVDE.metal, rough: MAT_GOVDE.rough });
});

// ---- sponson yan sandıkları ----------------------------------------------
[1, -1].forEach(function (s, i) {
    const P = [], IDX = [];
    const z0 = Math.min(s * 1.395, s * 1.468), z1 = Math.max(s * 1.395, s * 1.468);
    kutuEkle(P, IDX, -0.240, 0.420, 1.080, 1.305, z0, z1);
    kutuEkle(P, IDX, 0.470, 0.960, 1.080, 1.250, z0, z1);
    meshYap('sandik_' + (i + 1), P, IDX, '#454d3e', { metal: 0.22, rough: 0.78 });
});

// ---- kabin tavanı: anten yuvası -------------------------------------------
// ⚠️ Uzun kırbaç anten DENENDİ VE KALDIRILDI. 0.86 m'lik çubuk modelin
// yüksekliğini 2.59'dan 3.10'a çıkarıyordu; oysa 2.59 aracın KATALOG
// yüksekliği ve gerçek M270'de antenler seyir hâlinde katlı duruyor.
// Yerine yalnız yuva kaldı (tepesi 2.42, kutuyu büyütmüyor).
[0.980, -0.980].forEach(function (z, i) {
    const g = new THREE.CylinderGeometry(0.026, 0.034, 0.180, 6);
    g.translate(1.520, 2.240 + 0.070, z);
    modelGroup.add(mesh(g, '#20241d', { metal: 0.25, rough: 0.8,
                                        name: 'anten_yuva_' + (i + 1) }));
});

// ===========================================================================
// 9. LANÇER MODÜLÜ (M269) — kaide · taret · kafes · kapsüller · tüpler
// ===========================================================================
// Düşey dizilim (toplam 2.590 = seyir yüksekliği):
//   güverte 1.400 · kaide 1.395-1.500 (SABİT) · yatak bileziği 1.500-1.590
//   taret 1.590-1.720 (DÖNER) · kafes 1.720-2.590 · kapsül 1.780-2.500
//   kapsül sırtları 2.548 · kafes tepe kirişleri 2.552-2.590

// ---- kaide (SABİT — gövdeye kaynaklı, dönmez) -----------------------------
(function () {
    const P = [], IDX = [];
    kutuEkle(P, IDX, -2.300, -0.300, 1.395, 1.500, -1.100, 1.100);
    meshYap('lanser_kaide', P, IDX, '#414937', { metal: 0.30, rough: 0.70 });
})();
(function () {
    const g = new THREE.CylinderGeometry(0.985, 0.985, 0.090, 22, 1, true);
    g.translate(PIVOT_X, 1.545, 0);
    const m = mesh(g, '#333a2c', { metal: 0.40, rough: 0.55, name: 'lanser_yatak' });
    m.material.side = THREE.DoubleSide;
    modelGroup.add(m);
})();

// ---- taret + YÜKSELİŞ KOLLARI (DÖNER, yalnız yatayda) ---------------------
// Tabla yatayda döner; kafes onun ÖN ucundaki mafsala oturur ve orada
// yükselir. Kollar tablanın ön dudağından MAFSAL_X'e uzanıyor.
// z aralığı 1.190-1.310: kapsüllerin (|z| ≤ 1.050) ve kafesin (±1.180)
// DIŞINDA, krikonun oturduğu 1.240 düzlemini içine alıyor.
(function () {
    const P = [], IDX = [];
    kutuEkle(P, IDX, PIVOT_X - 0.780, PIVOT_X + 0.760, 1.590, 1.720, -1.020, 1.020);
    // Ön dudak: kolların oturduğu genişleme (tablanın |z| ≤ 1.020'sinden
    // kolların 1.310'una köprü). Kapsüllerin ALTINDA (y ≤ 1.720 < 1.790).
    kutuEkle(P, IDX, PIVOT_X + 0.480, PIVOT_X + 0.760, 1.590, 1.720, -1.310, 1.310);
    [1, -1].forEach(function (s) {
        const z0 = Math.min(s * 1.190, s * 1.310), z1 = Math.max(s * 1.190, s * 1.310);
        kutuEkle(P, IDX, PIVOT_X + 0.480, MAFSAL_X + 0.120, 1.560, 1.700, z0, z1);
        // Mafsal kulağı: pim MAFSAL_Y'de, kafesin alt kuşağının içinden geçer.
        kutuEkle(P, IDX, MAFSAL_X - 0.130, MAFSAL_X + 0.120, 1.640, MAFSAL_Y + 0.130,
                 z0, z1);
    });
    meshYap('lanser_taret', P, IDX, C_KAFES, { metal: 0.30, rough: 0.68 });
})();

// ---- yükseliş krikoları (DÖNER ama YÜKSELMEZ) -----------------------------
// ⚠️ GEOMETRİ BİRİM UZUNLUKTA: +x boyunca 0 → 1 arası bir silindir; kuyruğu
// yerel orijinde. Davranış her karede position / rotation.z / scale.x yazıp
// onu iki ucun arasına geriyor. Bir ucu SABİT tablada, öbürü KALKAN kafeste
// olduğu için kriko yükselen alt gruba konamaz: uzayan tek parça o.
[1, -1].forEach(function (s, i) {
    const g = new THREE.CylinderGeometry(R_KRIK, R_KRIK, 1, 8);
    g.rotateZ(-Math.PI / 2);        // eksen +y → +x
    g.translate(0.5, 0, 0);         // kuyruk orijinde, uç x = 1'de
    const m = mesh(g, C_CELIK, { metal: 0.45, rough: 0.42, name: 'krik_' + (i + 1) });
    m.position.set(KRIK_X0, KRIK_Y0, s * KRIK_Z);
    m.rotation.z = Math.atan2(KRIK_Y1 - KRIK_Y0, KRIK_X1 - KRIK_X0);
    m.scale.set(Math.hypot(KRIK_X1 - KRIK_X0, KRIK_Y1 - KRIK_Y0), 1, 1);
    modelGroup.add(m);
});

// ---- kafes (DÖNER) --------------------------------------------------------
// AÇIK çerçeve: iki yanda alt/üst kuşak + beş dikme, önde-arkada ve tepede
// enine kirişler. Kapalı levha yapılsaydı kapsüller hiç görünmezdi; gerçek
// M269 kafesi de açık bir iskelet.
// ⚠️ Arka enine bağlantı KİRİŞ, levha değil: tam levha olsaydı tüp ağızlarını
// (x ≈ −3.36) kapatırdı.
(function () {
    const P = [], IDX = [];
    const dikme = [KAFES_X0 + 0.06, -2.300, -1.300, -0.300, KAFES_X1 - 0.20];
    [1, -1].forEach(function (s) {
        const z0 = Math.min(s * KAFES_Z, s * (KAFES_Z - 0.070));
        const z1 = Math.max(s * KAFES_Z, s * (KAFES_Z - 0.070));
        kutuEkle(P, IDX, KAFES_X0, KAFES_X1, KAFES_Y0, KAFES_Y0 + 0.090, z0, z1);
        kutuEkle(P, IDX, KAFES_X0, KAFES_X1, KAFES_Y1 - 0.090, KAFES_Y1, z0, z1);
        for (const dx of dikme) kutuEkle(P, IDX, dx, dx + 0.120, KAFES_Y0, KAFES_Y1, z0, z1);
    });
    // Enine kirişler: arka ve ön uçta alt+üst, tepede iki ara kiriş.
    for (const ex of [KAFES_X0, KAFES_X1 - 0.090]) {
        kutuEkle(P, IDX, ex, ex + 0.090, KAFES_Y0, KAFES_Y0 + 0.090, -KAFES_Z, KAFES_Z);
        kutuEkle(P, IDX, ex, ex + 0.090, KAFES_Y1 - 0.090, KAFES_Y1, -KAFES_Z, KAFES_Z);
    }
    kutuEkle(P, IDX, -2.320, -2.200, 2.552, KAFES_Y1, -KAFES_Z, KAFES_Z);
    kutuEkle(P, IDX, -0.320, -0.200, 2.552, KAFES_Y1, -KAFES_Z, KAFES_Z);
    // Kapsüllerin oturduğu iki kızak. Üst yüzü TUP_ALT (1.790): demetin alt
    // sırası tam buraya oturuyor. (Eskiden PAKET_Y0 = 1.780 idi; kapsül dolu
    // bir kutuyken tabanı oradaydı, tüp demetinde ise en alt teğet 1.790.)
    [1, -1].forEach(function (s) {
        const z0 = Math.min(s * 0.980, s * 0.820), z1 = Math.max(s * 0.980, s * 0.820);
        kutuEkle(P, IDX, KAFES_X0, KAFES_X1, KAFES_Y0 + 0.030, TUP_ALT, z0, z1);
    });
    meshYap('kafes', P, IDX, C_KAFES, { metal: 0.32, rough: 0.62 });
})();

// ---- roket kapsülleri = ALTI TÜPLÜK DEMET (DÖNER, İKİNCİL RENK) -----------
// Her kapsül (LP/C) 4.04 × 1.05 × 0.72 m ve içinde 3×2 = 6 tüp; ikisi yan
// yana = 12.
//
// ⚠️ KAPSÜL ARTIK DOLU BİR KUTU DEĞİL, TÜPLERİN KENDİSİ (2026-09-04).
// Furkan: "roketlerin boyutları tam ayarlanmamış, sanki koca bir blob var".
// ÖLÇÜLDÜ (roketatar_tup_olcum.py — kaynaktan blok çıkarıp aynı kamerayla
// değişen pikseli sayma): eski kurulumda `tup_agiz` bloğu üretimin harita
// bakışında (42° yükseklik, ön çeyrek) 512 px'te **0 piksel** değiştiriyordu,
// tepeden 512 px'te 118 px / 96 px'in altında 0. Yani 12 tüpün tamamı TEK
// yüzde (kıç levhasında) duruyordu ve haritanın baktığı iki yönde HİÇ
// çizilmiyordu; geriye iki büyük düz kutu kalıyordu — "blob" tam olarak bu.
// Arka çeyrekten bile 128 px'te 3, 72 px'in altında 1 lekeye düşüyordu.
//
// Çözüm: tüpü kapsülün İÇİNE saklamak yerine KAPSÜLÜ TÜPLERDEN kurmak.
// Kesit artık altı dairenin demeti; tepeden üç sırt (kapsül başına), yandan
// iki kat, arkadan on iki ağız — üç bakışın üçünde de aynı tüp düzeni
// okunuyor. Zarf yine 1.05 × 0.72'nin içinde (bkz. R_TUP_DIS gerekçesi),
// yani ölçü kutusu değişmiyor.
//
// Boyuna 0.048'lik sırtlar KALDIRILDI: onlar tüpün TEMSİLİYDİ ve ölçüldüğü
// gibi okunmuyordu; artık tüpün kendisi orada.
[1, -1].forEach(function (s, i) {
    const P = [], IDX = [];
    for (const cy of TUP_Y) {
        for (let k = 0; k < 3; k++) {
            const cz = TUP_Z[s > 0 ? k : k + 3];
            // Tüpün DIŞ gövdesi: ağzı AÇIK (oyuk `tup_agiz`ta), önü kapalı.
            prizmaEkle(P, IDX, daire(cz, cy, R_TUP_DIS, 12),
                       PAKET_X0, PAKET_X1, true, false, false);
            // Ağız düzleminde halka = tüpün et kalınlığı. GÖVDE renginde
            // bırakıldı ki on iki koyu delik birbirinden AYRIŞSIN; halka da
            // koyu olsaydı bitişik ağızlar tek bir koyu şeride kaynardı.
            halkaKapak(P, IDX, PAKET_X0, cz, cy, R_TUP, R_TUP_DIS, 12, -1);
        }
    }
    // Demeti saran kuşaklar. Kesitin tepesindeki üç sırtı kesip "demet"
    // hissini veren şey bunlar; ayrıca tüpler arasındaki 10-20 mm'lik
    // boşlukları kapatıyorlar (kapsül kabuğunun kaldığı yer).
    // ⚠️ Bunlar DOLU kutu ve demetin kesitini tamamen kaplıyor. Tüp oyuğu
    // (`tup_agiz`) 0.30 m derinde dip kapağıyla bitiyor, yani kuşakların
    // hepsi kapağın ÖNÜNDE; ağızdan bakışta hiçbirini görmüyoruz.
    const bz0 = s > 0 ? 0.002 : -1.048, bz1 = s > 0 ? 1.048 : -0.002;
    for (const bx of [-2.560, -1.340, -0.120, 0.560]) {
        kutuEkle(P, IDX, bx, bx + 0.090, TUP_ALT - 0.010, PAKET_Y1, bz0, bz1);
    }
    // AĞIZ ÇERÇEVESİ. Kapsülün kıç kuşağı; tüp uçları 55 mm önünde kalıyor.
    // ⚠️ DOLU KUTU DEĞİL, DÖRT ÇUBUK. Dolu olsaydı ağızla dip kapağı
    // arasında kalır ve on iki oyuğun HEPSİNİ kapatırdı — ilk denemede tam
    // bu oldu, arka bakışta ağızlar gövde renginde diskler olarak çıktı.
    const cx0 = -3.305, cx1 = -3.215;
    kutuEkle(P, IDX, cx0, cx1, PAKET_Y1 - 0.022, PAKET_Y1, bz0, bz1);            // üst
    kutuEkle(P, IDX, cx0, cx1, TUP_ALT - 0.010, TUP_ALT + 0.012, bz0, bz1);      // alt
    kutuEkle(P, IDX, cx0, cx1, TUP_ALT - 0.010, PAKET_Y1, bz0, bz0 + 0.022);     // yan
    kutuEkle(P, IDX, cx0, cx1, TUP_ALT - 0.010, PAKET_Y1, bz1 - 0.022, bz1);     // yan
    meshYap('paket_' + (i + 1), P, IDX, C_PAKET, { metal: 0.20, rough: 0.76 });
});

// ---- tüp oyukları (DÖNER) -------------------------------------------------
// Seyir hâlinde tüpler ARKAYA bakıyor.
// ⚠️ İKİ KEZ DÜZELTİLDİ. İlk kurulumda ağızlar kapsül KUTUSUNUN içine
// yazılmıştı ve arka bakışta hiçbiri görünmüyordu. İkinci kurulum ağızları
// kıç yüzünden dışarı taşırdı; o da ÖLÇÜLDÜ ve yetmedi — ayrıntının tamamı
// TEK yüzde kaldığı için haritanın kendi bakışında 0 piksel değiştiriyordu
// (gerekçe kapsül bloğunda). Şimdiki kurulumda kapsül zaten tüplerden
// yapılı; burada yalnız tüplerin İÇİ var:
//   1. ağızdan 0.30 m içeri ters sarımlı oyuk — 42°'lik harita bakışında
//      ışın 0.14 / tan42° = 0.155 m'de yan duvara çarptığı için oyuk her
//      açıdan kapkara okunuyor; 12 diski ayıran şey bu.
//   2. dipte kapak (normal −x). Kapaksız bırakılsaydı tüpün içinden
//      gökyüzü görünürdü (dış gövdenin ön kapağı arka yüzünden ayıklanır).
//   ⚠️ Oyuk BİLEREK kısa: kuşaklar demetin kesitini dolduran kutular ve
//   hepsi x > −3.06'da; oyuk daha derin olsaydı ilk kuşak on iki ağzın
//   hepsini kapatırdı (ölçüldü: arka bakışta ağızlar gövde rengine düştü).
// Halka (et kalınlığı) burada DEĞİL, kapsül mesh'inde: gövde renginde
// kalması bitişik ağızları birbirinden ayırıyor.
(function () {
    const P = [], IDX = [];
    const xAgiz = PAKET_X0 - 0.002, xDip = PAKET_X0 + 0.300;
    for (const cy of TUP_Y) {
        for (const cz of TUP_Z) {
            prizmaEkle(P, IDX, daire(cz, cy, R_TUP, 12), xAgiz, xDip, false, false, true);
            prizmaEkle(P, IDX, daire(cz, cy, R_TUP, 12), xDip, xDip + 0.014, false, true, false);
        }
    }
    meshYap('tup_agiz', P, IDX, C_TUP, { metal: 0.18, rough: 0.85 });
})();

// ---- kafes arka koruma çerçevesi (DÖNER) ----------------------------------
// ⚠️ ORTADAKİ ÇUBUK İNCELTİLDİ (0.036 → 0.028). Tüp çapı büyüyünce en içteki
// iki tüpün oyuğu z = ±0.035'e kadar geldi; çubuk 0.036'da kalsaydı iki
// ağzın kenarını kesmeye başlıyordu (ağızların ÖNÜNDE duruyor, x −3.470).
(function () {
    const P = [], IDX = [];
    // ⚠️ Çerçeve KAFES_X0 − 0.070'te bitiyor (−3.470). İlk kurulumda −0.110
    // idi ve ölçü kutusunu kıç levhasının 25 mm gerisine taşıyordu.
    kutuEkle(P, IDX, KAFES_X0 - 0.070, KAFES_X0 - 0.010, 1.900, 2.470, -0.028, 0.028);
    kutuEkle(P, IDX, KAFES_X0 - 0.070, KAFES_X0 - 0.010, 2.470, 2.530, -KAFES_Z, KAFES_Z);
    meshYap('kafes_koruma', P, IDX, C_CELIK, { metal: 0.40, rough: 0.50 });
})();

// ===========================================================================
// 10. ATEŞLENEN ROKETLER (DÖNER; davranış uçuruyor)
// ===========================================================================
// M26: 3.94 m boy, 227 mm çap. Üçü üst sıranın üç ayrı tüpünde; salvo
// hâlinde sırayla çıkıyorlar (bkz. registerBehavior('roketatar')).
// ⚠️ DİNLENMEDE TÜPÜN İÇİNDE ve `visible = false`. Görünmez olmaları ölçü
// kutusunu KÜÇÜLTMEZ — `Box3.setFromObject` görünürlüğe bakmıyor — bu yüzden
// park pozu tüpün tam içi: kuyruk x = PAKET_X0 + ROKET_BOY = 0.580, burun
// ağızda. Kutu böylece 6.995 × 2.590 × 2.970'te kalıyor (ölçüldü).
// ⚠️ `castShadow = false`: uçan roket 30 m uzağa gidiyor, gölge kamerası ise
// aracın kendi kapsamına oturtulmuş; gölgesi zaten kırpılırdı.
function konikEkle(P, IDX, cz, cy, x0, x1, r0, r1, n, kapak) {
    const b = P.length / 3;
    for (let i = 0; i < n; i++) {
        const t = i * Math.PI * 2 / n;
        P.push(x0, cy + r0 * Math.sin(t), cz + r0 * Math.cos(t));
    }
    for (let i = 0; i < n; i++) {
        const t = i * Math.PI * 2 / n;
        P.push(x1, cy + r1 * Math.sin(t), cz + r1 * Math.cos(t));
    }
    for (let j = 0; j < n; j++) {
        const j2 = (j + 1) % n;
        IDX.push(b + j, b + n + j, b + n + j2, b + j, b + n + j2, b + j2);
    }
    if (kapak) {                     // x0 yüzü, normal −x (kuyruk)
        const m = P.length / 3; P.push(x0, cy, cz);
        for (let j = 0; j < n; j++) IDX.push(m, b + j, b + (j + 1) % n);
    }
}
ROKET_TUP.forEach(function (k, i) {
    const P = [], IDX = [];
    konikEkle(P, IDX, 0, 0, 0.000, ROKET_BOY - 0.460, R_ROKET, R_ROKET, 8, true);
    konikEkle(P, IDX, 0, 0, ROKET_BOY - 0.460, ROKET_BOY, R_ROKET, 0.012, 8, false);
    const m = meshYap('roket_' + (i + 1), P, IDX, '#adb5bc', { metal: 0.30, rough: 0.55 });
    m.castShadow = false;
    m.visible = false;
    m.position.set(PAKET_X0 + ROKET_BOY, TUP_Y[1], TUP_Z[k]);
    m.rotation.z = Math.PI;          // burun −x: tüpün içinde, ağza dönük
});

// Davranışın (registerBehavior('roketatar')) okuduğu ölçüler. İki yerde iki
// sayı olmasın diye model kodunun KENDİ sabitleri dışarı veriliyor.
modelGroup.userData.roketatar = {
    MAFSAL_X: MAFSAL_X, MAFSAL_Y: MAFSAL_Y, PIVOT_X: PIVOT_X,
    KRIK_X0: KRIK_X0, KRIK_Y0: KRIK_Y0, KRIK_X1: KRIK_X1, KRIK_Y1: KRIK_Y1,
    KRIK_Z: KRIK_Z, AGIZ_X: PAKET_X0, ROKET_BOY: ROKET_BOY,
    ROKET_Y: TUP_Y[1], ROKET_Z: ROKET_TUP.map(function (k) { return TUP_Z[k]; }),
    KAFES_X0: KAFES_X0, KAFES_Y1: KAFES_Y1, KAFES_X1: KAFES_X1,
    KAFES_Y0: KAFES_Y0
};
