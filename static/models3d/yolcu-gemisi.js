// Yolcu gemisi — orta boy kruvaziyer. Ulaşım temasının beşinci modeli.
//
// ⚠️ KÜTÜPHANEDE ZATEN DÖRT GEMİ VAR ve DÖRDÜ DE ASKERÎ: korvet,
// savas-gemisi, ucak-gemisi, cikarma-gemisi. Bu model onlarla
// KARIŞMAMAK zorunda; ayrışmanın nerede olduğu ölçülerek seçildi:
//
//   1. TEKNE KESİTİ. Dört askerî geminin dördü de gövdeyi TEK BİR
//      ExtrudeGeometry ile kuruyor (`hullPiece`): sivri uçlu bir çokgen
//      alınıp yukarı itiliyor. Bir extrude'un kesiti derinlik boyunca
//      SABİTTİR — yani o teknelerin yanları dümdüz dikey, dipleri de
//      düz bir levha. Gerçek tekne kesitte değişir: baş tarafta dar ve
//      V, ortada geniş ve yuvarlak dipli, kıçta düz kesik (transom).
//      Bu model gövdeyi LOFT ile kuruyor (otomobil.js'teki makinenin
//      aynısı): 39 istasyonda ayrı hesaplanan kapalı kesitler birbirine
//      dikiliyor, her kesit parametresi x boyunca kendi PCHIP eğrisinden
//      okunuyor.
//   2. İKİ TON. Askerî gemilerin hepsi tek gri. Kruvaziyeri ilk bakışta
//      kruvaziyer yapan şey KOYU TEKNE + BEYAZ ÜST YAPI ikilisi.
//   3. KAT KAT BALKON. Yanlarda boydan boya, düzenli aralıklı yatay
//      koyu şeritler. Askerî gemide bunun karşılığı yok; ölçek ve
//      "yolcu" kimliği tamamen buradan geliyor.
//   4. SİLAH YOK, FİLİKA VAR. Top kulesi / VLS / CIWS yerine yanlarda
//      turuncu filika sırası ve üst güvertede havuz.
//
// PARÇALAR (Studio3D bu adları arar, DEĞİŞTİRME):
//   tekne          -> RENK ALIR (_TINT varsayılanı #26364a).
//   ust_kat_*      -> BEYAZ üst yapı; BİLEREK renk ALMAZ. Kullanıcı
//                     tekneyi boyadığında gemi iki tonlu kalsın diye
//                     (tek renge düşseydi 160 m'lik düz bir blok olurdu)
//                     ve beyaz üst yapı olmadan kruvaziyer okunmaz.
//   diğer her şey kendi malzemesinde.
//
// _WHEELS YOK (tekerleksiz). noGround YOK: model tabanı y=0'da, yani su
// hattının ALTI da modelde — yandan bakışta tekne tam görünsün diye.
//
// YÖN: pruva +x, üst +y, taban y=0. Ölçüler gerçek metre.
// KUTU (ÖLÇÜLDÜ): 160.0 x 40.0 x 24.009.  102 mesh / 7908 üçgen / 0 spinner.
// (2026-09-07: köpük şeridi kaldırıldı — 104/8068 idi, KUTU DEĞİŞMEDİ; §6)
//
// ===========================================================================
// "SU YOLUNU TAKİP EDEREK İLERLESİN" — ÖLÇÜM
// ===========================================================================
// İstek buydu. Motorda karşılığı ZATEN VARDI ve varsayılmadı, ölçüldü
// (`gemi_probu.py`, gerçek dev sunucusunda gerçek `previewTransition`,
// 60 ms'de bir örnek; burun yönü instance kökünün DÜNYA matrisinden,
// modelin +x ekseni mercator düzlemine düşürülerek okundu):
//
//   * Burun açısı geçiş boyunca 0° -> 60° süpürdü, toplam dönüş 121.4°.
//   * BURUN İLE HAREKET YÖNÜ ARASINDAKİ SAPMA: ortalama 0.68°,
//     EN BÜYÜK 1.57° (7 geçerli hareket örneği).
//   Yani burun her karede yol teğetinde: gemi çizilen rotayı takip ediyor.
//   Kalan 1.57° örnekleme payı (yön iki örnek arasındaki KİRİŞTEN
//   hesaplanıyor, burun ise anlık TEĞETTEN).
//
//   ⚠️ İLK KOŞUDA "en büyük sapma 171.6°" okunmuştu ve bu YANLIŞTI:
//   geçiş bitince model kaynak konuma geri atıyor, o tek adım gerçek
//   hareketin onlarca katı ve ters yönde. Adım uzunluklarının ortancası
//   alınıp 3 katını aşanlar elenince gerçek değer çıktı. Ölçüm aracının
//   kendisi de doğrulanmadan sonuca güvenilmez.
//
//   * Yatma (viraj eğimi) aynı geçişte en fazla 0.81° oldu; oran 0.067
//     olduğu için bu steerDeg = 12.1° demek. steerDeg tavanı ±30, yani
//     daha keskin bir virajda yatma 2.0°'ye çıkıyor.
//
// YAPILMAYAN: rotanın üstüne DENİZ YOLU / iz çizgisi çizmek. O, haritaya
// yeni bir çizim katmanı eklemek demek (model kodu yalnız kendi 3B
// gövdesini kurabiliyor; harita katmanları studio-map.js'in işi) ve bu
// modelin kapsamı dışında.
// ⚠️ 2026-09-07: bunun yerine konan STATİK KÖPÜK ŞERİDİ DE KALDIRILDI —
// Yusuf iki turda "gövdeyi ikiye bölen beyaz şerit / ikinci burun" diye
// şikâyet etti, ölçüldü ve kaldırıldı. Gerekçe ve sayılar §6'da.

// ===========================================================================
// 0. RENKLER
// ===========================================================================
// ⚠️⚠️ YATAY YÜZEY İLE DÜŞEY YÜZEY AYRI TONDA — ÖLÇÜLEREK.
// Haritanın ana bakışı tepeden, motorun ışığı da yukarıdan
// (-0.45,-0.45,1.25): YATAY yüzeyler ışığın tamamını, DÜŞEY duvarlar
// yalnız sıyırma payını alıyor. Motokaravanda ölçülmüştü — krem (#d5d1c6)
// bir ÇATI tepeden TAM BEYAZA yanıyordu, #a09c91'e indirilmişti.
//
// Burada bu ders üç turda uygulandı (`parlaklik.py` ile bakis.py'nin TEPE
// panelinde piksel sayımı; ölçü = parlak piksellerin (max>=200) yüzde kaçı
// TAM BEYAZ (255,255,255)). Karşılaştırma: taksi %2, otobüs %13,
// motokaravanın düzeltilmeden önceki hâli %80.
//
//   1. tur — üst yapı beyazı (#dcd8d0) her yerde:      %27.2  (R kırpma %56.2)
//   2. tur — güverteler koyultuldu (#9e968a -> #928a7e,
//            #a49c8f -> #9a9286), havuz çevresi ve salon
//            çatısı beyazdan güverte tonuna, köpük ve
//            filika örtüsü koyultuldu:                 %15.3  (R kırpma %16.2)
//   3. tur — açıkta kalan BEYAZ YATAY yüzeyler kapatıldı
//            (balkon döşemesi + baca/köprü kanadı kapağı),
//            köpük bir kez daha koyultuldu:            %5.7   (R kırpma %6.5)
//
// SONUÇ: üst yapının DÜŞEY duvarı hâlâ beyaz (#dcd8d0) — kruvaziyeri
// kruvaziyer yapan şey o ve düşey olduğu için hiç kırpmıyor. Koyultulan
// şey YALNIZ yatay yüzeyler oldu.
const C_TEKNE    = '#26364a';   // _TINT varsayılanı — koyu lacivert tekne
const C_UST      = '#dcd8d0';   // üst yapı duvarı (DÜŞEY yüzey)
const C_BALKON   = '#39434f';   // balkon boşluğu / pencere bandı (koyu)
const C_GUV      = '#928a7e';   // açık güverte (YATAY yüzey)
const C_GUV_UST  = '#9a9286';   // üst güverte
const C_GUV_IS   = '#4a5560';   // baş/kıç çalışma güvertesi (koyu)
const C_CAM      = '#151c25';   // köprüüstü camı
const C_FILIKA   = '#c9631d';   // filika — turuncu (SOLAS rengi)
const C_FILIKA_K = '#a9a59c';   // filika örtüsü
const C_BACA      = '#d3cec5';   // baca gövdesi (düşey)
const C_BACA_UST  = '#1e2a3a';   // baca kapağı — tepeden koyu oval
// ⚠️ C_KOPUK ('#8b99a3') KALDIRILDI — köpük şeridinin kendisi kaldırıldı,
//    gerekçesi ve ölçümü §6'da.
const C_SERIT    = '#cfc8b6';   // borda şeridi (bel hattı)
const C_SU_HAT   = '#6f2a26';   // su hattı bordo bandı (boot top)
const C_HAVUZ    = '#2c7a97';   // havuz suyu
const C_KROM     = '#b9c1ca';
// ⚠️ KROM DİYE metalness 0.85+ VERİLMEZ: environment map olmadığı için
// metal parça yalnız doğrudan ışığın yansımasını gösterir, açı tutmayan
// yüzler kapkara çıkar. Düşük metalness + açık taban rengi doğrusu.
const KROM_MAL   = { metal: 0.45, rough: 0.26 };
const C_DIREK    = '#8f979f';   // radar direği
const C_KOYU     = '#2b333c';   // gölgeli oyuklar, derz

// ===========================================================================
// 1. TEMEL ÖLÇÜLER
// ===========================================================================
const UZUN       = 80.0;    // yarı uzunluk -> 160 m
const GUVERTE    = 17.0;    // ana güverte (teknenin üstü)
const SU         = 8.0;     // su hattı — model tabanı y=0 olduğu için
                            // teknenin su altı kısmı da modelde
const UST_TABAN  = 17.45;   // üst yapının oturduğu kot (güverte döşemesi üstü)
const KAT_H      = 2.36;    // bir yolcu katı
const KAT_DUVAR  = 1.66;    // katın beyaz duvar (parapet) kısmı
const UST_GUV    = UST_TABAN + 7 * KAT_H;   // 33.97 — üst güverte
const BACA_TEPE  = 39.4;
const DIREK_TEPE = 40.0;    // modelin en yüksek noktası

// ===========================================================================
// 2. MONOTON KÜBİK EĞRİ (PCHIP)
// ===========================================================================
// otomobil.js'ten alındı. Catmull-Rom BIRAKILMIŞTI: eğim çok değişen
// yerlerde taşma yapıp çizgiyi komşusunun üstüne tümsek attırıyor.
// Fritsch-Carlson teğetleri yerel uçlarda sıfırlanır -> taşma yok.
// Burada özellikle kritik: pruva bölgesinde genişlik 11.95'ten 0.30'a
// 25 metrede iniyor, taşan bir eğri tekneyi dışa şişirirdi.
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

// ---- teknenin uzunlamasına çizgileri -------------------------------------
// GÜVERTE KENARI YARI GENİŞLİĞİ (kesitin EN GENİŞ noktası — aşağıdaki
// kesit fonksiyonunda hiçbir nokta bunu aşmıyor, kutu ölçüsü buna bağlı).
// Kıçta 10.30'da kesiliyor: transom DÜZ. Pruvada 0.30'a iniyor: bıçak
// gibi bir bodoslama kalıyor.
const W_GUV = egriYap([
    [-80.0, 10.30], [-76.0, 10.85], [-70.0, 11.35], [-62.0, 11.70],
    [-52.0, 11.90], [-20.0, 11.95], [ 12.0, 11.95], [ 30.0, 11.85],
    [ 42.0, 11.45], [ 50.0, 10.75], [ 58.0,  9.40], [ 64.0,  8.00],
    [ 70.0,  6.20], [ 74.0,  4.30], [ 77.0,  2.60], [ 79.0,  1.20],
    [ 80.0,  0.30]
]);
// OMURGA (kesitin en alt noktası). Ortada 0 = modelin tabanı.
// ⚠️ PRUVA BURADAN ÇIKIYOR, ayrı bir "bodoslama" parçası YOK: omurga
// x=+75'te su hattına (8.0), x=+80'de 13.0'a çıkıyor; yani teknenin
// y=8 yüksekliğindeki en ön noktası x≈75, y=17'deki ise x=80. Profilde
// bu, öne eğik bir baş bodoslama demek. Düz bir extrude'da (askerî
// gemilerin dördü) bu hiç yok: orada pruva her yükseklikte aynı yerde.
const Y_OMURGA = egriYap([
    [-80.0, 6.60], [-75.0, 4.20], [-70.0, 2.20], [-64.0, 0.80],
    [-58.0, 0.18], [-40.0, 0.00], [ 24.0, 0.00], [ 42.0, 0.15],
    [ 54.0, 0.90], [ 62.0, 2.60], [ 68.0, 5.00], [ 72.0, 6.70],
    [ 75.0, 8.00], [ 78.0, 11.20], [ 80.0, 13.00]
]);
// DÜZ DİP YARI GENİŞLİĞİ. Ortada geniş (yassı dip), pruvada sıfıra
// yaklaşıyor -> orada kesit V oluyor.
const W_DIP = egriYap([
    [-80.0, 5.20], [-70.0, 6.20], [-58.0, 6.60], [-20.0, 6.80],
    [ 20.0, 6.40], [ 44.0, 4.40], [ 58.0, 2.20], [ 68.0, 0.60],
    [ 74.0, 0.15], [ 80.0, 0.05]
]);
// SİNTİNE (dip ile bordanın buluştuğu nokta) YÜKSEKLİĞİ, kesit
// derinliğinin oranı olarak. Ortada alçak (0.24 = yuvarlak sintine),
// uçlarda yüksek (V daha yukarı çıkıyor).
const BILGE_F = egriYap([
    [-80.0, 0.55], [-60.0, 0.30], [  0.0, 0.24], [ 40.0, 0.32],
    [ 60.0, 0.44], [ 72.0, 0.56], [ 80.0, 0.60]
]);
// BORDA AÇIKLIĞI (flare): güverte kenarı ile sintine genişliği farkı.
// Ortada ~0 (borda dikey), pruvada 1.45 (baş omuzları dışa açılıyor —
// gerçek teknede baş dalgasını dışarı atan şey bu).
const FLARE = egriYap([
    [-80.0, 0.15], [-50.0, 0.10], [-10.0, 0.10], [ 20.0, 0.25],
    [ 45.0, 0.85], [ 60.0, 1.45], [ 70.0, 1.20], [ 76.0, 0.55],
    [ 80.0, 0.05]
]);
// Sintine kıvrımının Bezier denetim noktası (dip -> sintine).
// ⚠️ SÜPER-ELİPS DENENDİ VE BIRAKILDI: sin/cos üssüyle yazılan bir çeyrek
// her zaman DIŞBÜKEY çıkıyor, yani pruvadaki DÜZ V kenarı üretilemiyordu
// (üs 1'de bile çeyrek daire oluyor). Kuadratik Bezier'de denetim noktası
// köşegen üzerine gelince eğri DÜZ ÇİZGİye iniyor: kz≈ky -> V,
// kz büyük + ky küçük -> yuvarlak sintine. Tek çift eğriyle kesit
// biçimi baştan kıça sürekli değişiyor.
const KZ = egriYap([
    [-80.0, 0.88], [-40.0, 0.90], [ 10.0, 0.88], [ 40.0, 0.72],
    [ 56.0, 0.55], [ 68.0, 0.46], [ 80.0, 0.44]
]);
const KY = egriYap([
    [-80.0, 0.12], [-40.0, 0.12], [ 10.0, 0.14], [ 40.0, 0.28],
    [ 56.0, 0.45], [ 68.0, 0.50], [ 80.0, 0.50]
]);
// ⚠️ `G_KOPUK` (köpüğün bordadan dışarı taşma eğrisi) KALDIRILDI.
// Köpük şeridinin kendisi kaldırıldığı için tek kullanıcısı kalmamıştı.
// Gerekçe ve ölçüm §6'da. Geri getirilecekse eski değerler:
//   [-79.4,1.15] [-76,1.05] [-73,0.82] [-70,0.58] [-66,0.32] [-62,0.12]
//   [-56,0.00] [34,0.00] [44,0.12] [54,0.50] [64,1.10] [70,1.45]
//   [75,1.10] [78.5,0.35]
// ⚠️ O eğri yazılırken ölçülmüş kısıt hâlâ geçerlidir: toplam
// (W_GUV + G_KOPUK) 11.95'i aşarsa kutunun z ölçüsü büyür ve "24 ±1"
// ölçütü kaçar (ilk kurulumda kıçta z max 12.214 = kutu 24.43 çıkmıştı).

// ===========================================================================
// 3. KESİT
// ===========================================================================
// Bir kesit üç parçadan oluşuyor:
//   A [0 .. VA]   düz dip: orta hattan dip genişliğine
//   B [VA .. VB]  sintine kıvrımı: dipten en geniş noktaya
//   C [VB .. 1]   borda: sintineden güverte kenarına (hafif dışa açık)
const VA = 0.09, VB = 0.46;

function kesitPar(x) {
    const yK = Y_OMURGA(x);
    const yD = GUVERTE;
    const wD = W_GUV(x);
    const wB = Math.max(0.02, wD - FLARE(x));
    // Düz dip sintineden dar olmak zorunda, yoksa kesit kendi içine döner.
    const wK = Math.min(W_DIP(x), wB * 0.92);
    const yB = yK + (yD - yK) * BILGE_F(x);
    return { yK: yK, yD: yD, wD: wD, wB: wB, wK: wK, yB: yB,
             kz: KZ(x), ky: KY(x) };
}

// Yarı kesitin v parametresindeki noktası -> [z, y].
// v: 0 = omurga orta hattı, 1 = güverte kenarı. y v ile MONOTON artıyor
// (A bölümünde sabit), vYukseklik'in ikili araması buna dayanıyor.
function kesitNokta(P, v) {
    if (v <= VA) return [P.wK * (v / VA), P.yK];
    if (v <= VB) {
        const t = (v - VA) / (VB - VA), u = 1 - t;
        const cz = P.wK + (P.wB - P.wK) * P.kz;
        const cy = P.yK + (P.yB - P.yK) * P.ky;
        return [u * u * P.wK + 2 * u * t * cz + t * t * P.wB,
                u * u * P.yK + 2 * u * t * cy + t * t * P.yB];
    }
    const t = (v - VB) / (1 - VB), u = 1 - t;
    const cz = P.wB + (P.wD - P.wB) * 0.80;
    const cy = P.yB + (P.yD - P.yB) * 0.30;
    return [u * u * P.wB + 2 * u * t * cz + t * t * P.wD,
            u * u * P.yB + 2 * u * t * cy + t * t * P.yD];
}

// Yüzey noktası. w in [-1,1]: |w| = v (0 omurga, 1 güverte kenarı),
// işaret hangi bordadan olduğunu söyler.
// ⚠️ ŞERİTLER BU PARAMETREYLE YAZILIYOR, "y" ile değil. Otobüste ön cam
// köşe bandı sabit y ile yazıldığı için kavisin içine girip yırtılmıştı;
// borda da kavisli, aynı tuzak burada da var.
function nokta3(x, w) {
    const p = kesitNokta(kesitPar(x), Math.abs(w));
    return [x, p[1], (w < 0 ? -p[0] : p[0])];
}

// Sayısal yüzey normali (dışa bakar). Şeritler yüzeyden bu yönde ötelenir.
function normal3(x, w) {
    const h = 0.02;
    const hx = (x > UZUN - 0.05) ? -h : h;
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
const NV = 14;    // yarı kesitteki örnek sayısı
const ND = 4;     // güverte geçişinin bölüntüsü
const R_HALKA = 2 * NV + ND - 2;   // 30

// İstasyonlar pruvada ve kıçta SIK, orta gövdede seyrek: kesit orta
// gövdede neredeyse hiç değişmiyor, oraya istasyon koymak yalnız üçgen
// harcar; pruvada ise genişlik 25 metrede 11.95'ten 0.30'a iniyor.
const IST = [
    -80.0, -79.0, -77.5, -76.0, -74.0, -71.5, -69.0, -66.0, -63.0,
    -60.0, -56.0, -52.0, -46.0, -38.0, -28.0, -16.0, -4.0, 8.0, 20.0,
     30.0,  38.0,  44.0,  49.0,  53.0,  56.5,  60.0,  63.0,  66.0,
     68.5,  71.0,  73.0,  75.0,  76.5,  78.0,  79.0,  79.6,  80.0
];

function halka(x) {
    const P = kesitPar(x), yarim = [];
    for (let i = 0; i < NV; i++) yarim.push(kesitNokta(P, i / (NV - 1)));
    // 0 = omurga orta hattı -> +z bordası yukarı -> güverte kenarı ->
    // güverte üstünden karşıya -> -z bordası aşağı. Kapalı halka, kutup
    // yok, bozuk üçgen yok. Güverte KAPALI: tekne içi boş bir kabuk
    // değil, kapalı bir katı — tepeden bakışta içi görünmesin diye.
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
    // Pruva ve transom kapağı: düz üçgen yelpaze. Halka köşeleri
    // KOPYALANIYOR ki computeVertexNormals kapağın normalini bordanınkiyle
    // ortalamasın — ortalasaydı transomun keskin kenarı yumuşayıp kıç
    // "eriyik" görünürdü. Kruvaziyerin kıçı KESKİN kesiktir.
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
    // Boyalı çelik: hafif parlak ama ayna değil.
    modelGroup.add(mesh(geo, C_TEKNE, { metal: 0.22, rough: 0.48, name: 'tekne' }));
})();

// ===========================================================================
// 5. TEKNE YÜZEYİNE OTURAN ŞERİTLER
// ===========================================================================
// otomobil.js'teki yuzeyYama'nın gemi sürümü. Bant [x1, x2, y1, y2, taraf]
// biçiminde YÜKSEKLİK olarak yazılıyor; her x'te o yüksekliğin v'si
// aranıyor. Sabit v ile yazılsalardı şeritler pruvaya doğru YUKARI
// kayardı (kesit orada kısaldığı için aynı v çok daha yüksek bir noktaya
// denk geliyor).
//
// ⚠️ nx / nw: nx bandın UZUN kenarındaki (x) bölüntü, nw ise İNCE
// kenarındaki. Ters verilirse şerit yüzeyin kavisini takip edemeyip
// ortasından teknenin içine girer ve KAYBOLUR. Buradaki şeritler 150 m
// uzunluğunda ve 1 m yüksekliğinde: nx BÜYÜK, nw KÜÇÜK.
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
        metal: opts.metal == null ? 0.2 : opts.metal,
        rough: opts.rough == null ? 0.5 : opts.rough, name: ad
    });
    m.material.side = THREE.DoubleSide;
    // Kalınlıksız paneller GÖLGE DÜŞÜRMEZ: tekneye 6 cm mesafede
    // duruyorlar, gölge haritasında kendi gölgelerini teknenin üstüne
    // basıp benek üretiyorlardı.
    m.castShadow = false;
    modelGroup.add(m);
    return m;
}

[1, -1].forEach(function (s, i) {
    // BORDA ŞERİDİ — kruvaziyerin klasik imzası: koyu teknenin üstünde,
    // güvertenin hemen altında ince açık bir hat. Askerî gemilerde yok.
    yuzeyYama('serit_bel_' + (i + 1),
              [[-78.0, 78.0, 14.30, 15.00, s]], 34, 1, 0.06, C_SERIT,
              { metal: 0.25, rough: 0.42 });
    // TEKNE PENCERE SIRASI — alt güvertelerin lombozları. Tek tek kare
    // koymak 120 mesh demekti; uzaktan zaten sürekli bir koyu hat olarak
    // okunuyor, o yüzden tek bant.
    yuzeyYama('pencere_tekne_' + (i + 1),
              [[-70.0, 62.0, 11.20, 12.30, s]], 30, 1, 0.05, C_BALKON,
              { metal: 0.3, rough: 0.3 });
    // SU HATTI BANDI (boot top). Renk ALMAZ: kullanıcı tekneyi boyadığında
    // su hattı yerinde kalsın, geminin nereye kadar suya girdiği okunsun.
    // ⚠️ x ARALIĞI 71.5'TE BİTİYOR, 76'da DEĞİL: ilk kurulumda 76'ya kadar
    // yazılmıştı ve ÖLÇÜLDÜ — bandın y'si 8.10 yerine 8.854'e fırlıyordu.
    // Sebep: omurga pruvaya doğru yükseliyor (x=76'da 9.4), yani orada
    // 6.90-8.10 aralığı teknenin ALTINDA kalıyor; vYukseklik tabana
    // yapışıp bandı omurga hattına tırmandırıyordu. Bant, omurganın hâlâ
    // 6.90'ın altında olduğu yere kadar sürüyor.
    yuzeyYama('su_hatti_' + (i + 1),
              [[-78.0, 71.5, 6.90, 8.10, s]], 32, 1, 0.05, C_SU_HAT,
              { metal: 0.1, rough: 0.7 });
});

// ===========================================================================
// 6. KÖPÜK — KALDIRILDI (2026-09-07)
// ===========================================================================
// Burada bir "baş dalgası / dümen suyu" şeridi vardı: y = SU + 0.30 = 8.30
// kotunda, x = -79.4..78.5 (geminin tamamı) boyunca uzanan, SIFIR
// KALINLIKTA, `DoubleSide` iki levha (`kopuk_1`, `kopuk_2`; 2 mesh, 160
// üçgen). Yusuf iki turda üst üste şikâyet etti:
//   "ortasından dikeyde iki parçaya bölecek şekilde kesilmiş beyaz bir
//    parça var" · "o beyaz şerit aynen duruyor, geminin alt gövdesini
//    ikiye bölen bir şey, KIRMIZI ŞERİDİN HEMEN ÜZERİNDE İKİNCİ BİR BURUN
//    gibi duruyor".
//
// KÖK SEBEP (fırkateynin `sintine_omurga`sıyla BİREBİR aynı kusur sınıfı,
// bkz. OKU.md "Fırkateyn turu"): levha TAM YATAY (kesit yok, tek y kotu),
// `DoubleSide` ve `computeVertexNormals` yüzünden THREE arka yüzün
// normalini çevirdiği için HER İKİ taraftan da tam aydınlık. Anahtar ışık
// yukarıdan geldiğinden yatay yüzey ışığın tamamını alıyor; gövdedeki gibi
// bir gölge geçişi hiç yok. Sonuç: tekneden kopuk, keskin kenarlı parlak
// bir hat. Kırmızı boot-top bandının (`su_hatti_*`, y 6.90–8.10) hemen
// üstünde durduğu için "kırmızı şeridin üzerindeki beyaz şerit" olarak
// okunuyor; baş ve kıçta bordadan dışarı taştığı yerde de gövdenin
// siluetinin dışına çıkıp İKİNCİ BİR BAŞ BODOSLAMA çiziyor.
//
// ⚠️ BİR ÖNCEKİ TUR BU MADDEYİ KAPATTIĞINI SANDI ve şeridin ORTA GÖVDEDE
// tekneden dışarı taşmasını düzeltti (`kesit_yama.py`; `kopuk_disari.js`
// orta gövdede 0.00 m² ölçtü). Ölçüm doğruydu ama YETMİYORDU: baş ve kıç
// taşması bilerek bırakılmıştı ve Yusuf'un gördüğü şey tam olarak oydu.
//
// ⚠️ TEZGÂH IŞIĞI VE `parlaklik.py` BU KUSURA KÖR (DEVİR §4.3): şeridin en
// yüksek luması 246–249, yani 250 eşiğini hiç geçmiyor. Teşhis GERÇEK
// STUDIO karesinde, mesh'e atamalı kimlik pasıyla konuldu
// (`gemi_studio_probu.py`). Altı studio bakışında kopuk_1+kopuk_2:
//   görünür 1012 px · L>=230 91 px · ortalama luma 103.9/215.1 · en yüksek 246.2
// Baş kerterizinde (pitch 60, bearing 90) şerit teknenin çevresini saran
// parlak bir halka: 78 px L>=230, ortalama luma 174.8.
//
// NEDEN DÜZELTİLMEDİ DE KALDIRILDI: fırkateyndeki reçete (kapalı katıya
// çevir, `FrontSide`, sarımı türet) bu parçada işe yaramaz. Şeridin ORTA
// GÖVDEDEKİ kısmı zaten teknenin içinde ve görünmüyor; geriye kalan tek
// görsel katkısı baş/kıçtaki taşma, yani ŞİKÂYETİN KENDİSİ. Katıya
// çevirmek o ikinci bodoslamayı gölgeli bir ikinci bodoslama yapardı.
// Yusuf'un isteği de birebir "onu kaldır".
//
// KUTU DEĞİŞMEDİ ve değişemezdi: şerit x -79.4..78.5 (tekne ±80 içinde),
// z |11.887| (kutuyu `serit_bel` 12.005 ile belirliyor), y 8.30
// (0..40 içinde). Ölçüldü: 160.000 x 40.000 x 24.009 — önce/sonra aynı.
//
// Hareket duygusu artık YALNIZ rotanın kendisinden geliyor (motor gemiyi
// deniz rotasında yol teğetinde taşıyor, §"su yolunu takip etsin"
// ölçümü). Yeniden bir iz istenirse doğru yeri MODEL DEĞİL harita
// katmanıdır (studio-map.js) — model kodu yalnız kendi 3B gövdesini
// kurabiliyor.

// ===========================================================================
// 7. PLAN ŞEKLİ ÜRETİCİSİ (üst yapı katları)
// ===========================================================================
// Bir katın plan dış çizgisi: ortada tam genişlik, uçlarda çeyrek-elips
// ile daralıp yuvarlanıyor. ExtrudeGeometry ile yukarı itiliyor.
//
// ⚠️ NEDEN EXTRUDE, LOFT DEĞİL: üst yapı katlarının kesiti kat boyunca
// GERÇEKTEN sabit (düz beyaz duvar, dik). Loft burada yalnız üçgen
// harcardı. Kavis GEREKEN yer tekne, ve orası loft.
//
// ⚠️ rotation.x = -PI/2 ile yerel +z DÜNYA +y'ye gidiyor (ölçüldü:
// Rx(-90) (0,0,1) -> (0,1,0)), yani extrude YUKARI çıkıyor. Yerel y ise
// dünya -z'ye gidiyor; şekil simetrik olduğu için fark etmiyor.
function planSekli(xArka, xOn, w, kicPay, kicW, burunPay, burunW, N) {
    const yariW = function (x) {
        if (x <= xArka + kicPay) {
            const t = (x - xArka) / kicPay;
            const w0 = kicW * w;
            return w0 + (w - w0) * Math.sqrt(Math.max(0, t * (2 - t)));
        }
        if (x >= xOn - burunPay) {
            const t = (xOn - x) / burunPay;
            const w0 = burunW * w;
            return w0 + (w - w0) * Math.sqrt(Math.max(0, t * (2 - t)));
        }
        return w;
    };
    const pts = [];
    for (let i = 0; i <= N; i++) {
        const x = xArka + (xOn - xArka) * i / N;
        pts.push([x, Math.max(0.05, yariW(x))]);
    }
    const s = new THREE.Shape();
    s.moveTo(pts[0][0], pts[0][1]);
    for (let i = 1; i <= N; i++) s.lineTo(pts[i][0], pts[i][1]);
    for (let i = N; i >= 0; i--) s.lineTo(pts[i][0], -pts[i][1]);
    s.closePath();
    return s;
}

function katKur(sekil, y0, h, renk, ad, opts) {
    opts = opts || {};
    const g = new THREE.ExtrudeGeometry(sekil, { depth: h, bevelEnabled: false, steps: 1 });
    const m = mesh(g, renk, {
        flat: opts.flat !== false,
        rough: opts.rough == null ? 0.62 : opts.rough,
        metal: opts.metal == null ? 0.12 : opts.metal,
        name: ad
    });
    m.rotation.x = -Math.PI / 2;
    m.position.y = y0;
    modelGroup.add(m);
    return m;
}

// ===========================================================================
// 8. GÜVERTE DÖŞEMESİ
// ===========================================================================
// Teknenin kapalı üst yüzü lacivert (tekne ile aynı mesh). Onun üstüne
// 0.6 içeriden başlayan açık bir döşeme oturuyor: kalan lacivert çerçeve
// PARAPET olarak okunuyor ve tepeden bakışta geminin dış hattını çiziyor.
// Bu, tepeden bakışta gemiyi "beyaz bir blok" olmaktan kurtaran şey.
// ⚠️ GÜVERTE PARÇALARI TEKNENİN PLANINI İZLİYOR, planSekli KULLANMIYOR.
// İlk kurulumda baş çalışma güvertesi planSekli ile yazılmıştı ve
// ÖLÇÜLDÜ: x=70'te yarı genişliği 7.27 çıkıyordu, oysa teknenin oradaki
// güverte kenarı 6.20 — güverte teknenin DIŞINA taşıyordu. Sebep basit:
// planSekli sabit genişlikli bir gövde + iki uçta çeyrek-elips varsayıyor;
// teknenin plan eğrisi ise pruvaya doğru bambaşka bir hızla daralıyor.
// Doğrusu genişliği W_GUV'dan okumak.
function guverteSekli(x1, x2, pay, N) {
    const pts = [];
    for (let i = 0; i <= N; i++) {
        const x = x1 + (x2 - x1) * i / N;
        pts.push([x, Math.max(0.06, W_GUV(x) - pay)]);
    }
    const s = new THREE.Shape();
    s.moveTo(pts[0][0], pts[0][1]);
    for (let i = 1; i <= N; i++) s.lineTo(pts[i][0], pts[i][1]);
    for (let i = N; i >= 0; i--) s.lineTo(pts[i][0], -pts[i][1]);
    s.closePath();
    return s;
}

katKur(guverteSekli(-79.2, 79.2, 0.60, 30), GUVERTE - 0.02, 0.47,
       C_GUV, 'guverte', { rough: 0.78, metal: 0.12 });

// Baş ve kıç ÇALIŞMA GÜVERTESİ — koyu. Kruvaziyerin üst yapısı boydan
// boya değildir: pruvada demirleme, kıçta halat güvertesi açıkta kalır.
// Tepeden bakışta bu iki koyu alan, beyaz kütlenin iki ucunu kesip
// geminin baş/kıç yönünü okutuyor.
katKur(guverteSekli(56.0, 77.5, 0.95, 14), UST_TABAN, 0.16,
       C_GUV_IS, 'guverte_bas', { rough: 0.78, metal: 0.12 });
katKur(guverteSekli(-77.5, -56.0, 0.95, 12), UST_TABAN, 0.16,
       C_GUV_IS, 'guverte_kic', { rough: 0.78, metal: 0.12 });

// ===========================================================================
// 9. ÜST YAPI — YEDİ KAT, KAT KAT BALKONLU
// ===========================================================================
// Her kat = BEYAZ PARAPET (altta, 1.66) + KOYU BALKON BOŞLUĞU (üstte,
// 0.70, 0.34 içeri çekilmiş). Yandan bakışta bu, boydan boya süren
// düzenli yatay şerit dizisi demek: kruvaziyerin en tanıdık işareti ve
// gemiye ölçek veren tek şey. Tek düz beyaz duvar bırakılsaydı 110 m'lik
// bir kutu olurdu (otobüste ölçülen "düz yan yüz" hatası).
//
// Katlar kıça doğru KADEMELİ kısalıyor (55 -> 48 -> 42 -> 36): açıkta
// kalan çatılar kıç güverteleri oluyor. Kruvaziyerin kıçtan silueti bu.
const KATLAR = [
    { xa: -55, xo: 55, w: 10.70, kp: 9,  kw: 0.88, bp: 20, bw: 0.26 },
    { xa: -55, xo: 55, w: 10.70, kp: 9,  kw: 0.88, bp: 20, bw: 0.26 },
    { xa: -55, xo: 55, w: 10.70, kp: 9,  kw: 0.88, bp: 18, bw: 0.28 },
    { xa: -55, xo: 55, w: 10.70, kp: 9,  kw: 0.88, bp: 18, bw: 0.28 },
    { xa: -48, xo: 53, w: 10.10, kp: 8,  kw: 0.82, bp: 15, bw: 0.30 },
    { xa: -42, xo: 51, w:  9.90, kp: 8,  kw: 0.78, bp: 13, bw: 0.32 },
    { xa: -36, xo: 46, w:  9.55, kp: 8,  kw: 0.74, bp: 12, bw: 0.34 }
];
for (let k = 0; k < KATLAR.length; k++) {
    const K = KATLAR[k];
    const y0 = UST_TABAN + k * KAT_H;
    katKur(planSekli(K.xa, K.xo, K.w, K.kp, K.kw, K.bp, K.bw, 18),
           y0, KAT_DUVAR, C_UST, 'ust_kat_' + (k + 1));
    // ⚠️ BALKON DÖŞEMESİ (ince, güverte renginde). Balkon boşluğu duvardan
    // 0.34 içeri çekildiği için duvarın BEYAZ üst yüzünden 0.34'lük bir
    // halka açıkta kalıyordu; tepeden bakışta o halka TAM BEYAZ çıkıyordu
    // (ölçüldü: filikaların arasındaki kesikli beyaz dizi buydu). Halkayı
    // güverte tonuyla kapatmak hem doğrusu (balkonun döşemesi orada) hem
    // de tepeden bakışta katları birbirinden ayıran ince çizgiyi veriyor.
    katKur(planSekli(K.xa, K.xo, K.w, K.kp, K.kw, K.bp, K.bw, 18),
           y0 + KAT_DUVAR, 0.07, C_GUV, 'balkon_doseme_' + (k + 1),
           { rough: 0.78, metal: 0.12 });
    // Balkon boşluğu: hem DAR hem KISA -> gerçek bir oyuk gibi gölgeleniyor.
    katKur(planSekli(K.xa + 0.7, K.xo - 0.7, K.w - 0.34, K.kp, K.kw, K.bp, K.bw, 18),
           y0 + KAT_DUVAR, KAT_H - KAT_DUVAR, C_BALKON,
           'balkon_' + (k + 1), { rough: 0.45, metal: 0.25 });
    // Açıkta kalan çatılar = kıç güverteleri (yalnız kademe olan katlarda)
    if (k >= 3 && k <= 5) {
        const U = KATLAR[k + 1];
        katKur(planSekli(K.xa + 0.5, U.xa + 0.5, K.w - 0.5, 5, 0.86, 1.5, 0.94, 8),
               y0 + KAT_H, 0.18, C_GUV, 'kic_guverte_' + (k - 2),
               { rough: 0.78, metal: 0.12 });
    }
}

// Kıç havuzu — kademelerin en alt sahanlığında.
(function kicHavuz() {
    const y = UST_TABAN + 4 * KAT_H;
    const h = mesh(new THREE.BoxGeometry(7.0, 0.22, 7.0), C_HAVUZ,
                   { rough: 0.25, metal: 0.35, name: 'havuz_kic' });
    h.position.set(-51.5, y + 0.20, 0);
    modelGroup.add(h);
})();

// ===========================================================================
// 10. FİLİKA SIRASI
// ===========================================================================
// Dördüncü katın hizasında, üst katlardan (9.90 / 9.55) DIŞARI taşacak
// biçimde asılı: tepeden bakışta beyaz kütlenin içinde turuncu bir dizi
// olarak görünüyor. İçeri alsaydık üst katlar onları tamamen örterdi ve
// haritanın ANA bakışında hiç okunmazlardı.
// Dış kenar 10.75 + 0.72 = 11.47 < 11.95 (güverte kenarı) -> kutu ölçüsü
// büyümüyor.
(function filikalar() {
    const y = UST_TABAN + 4 * KAT_H + 0.85;
    let n = 0;
    for (let s = -1; s <= 1; s += 2) {
        for (let i = 0; i < 8; i++) {
            n++;
            const x = -33 + i * 9.4;
            const f = mesh(new THREE.BoxGeometry(5.6, 1.35, 1.44), C_FILIKA,
                           { flat: true, rough: 0.55, name: 'filika_' + n });
            f.position.set(x, y, s * 10.75);
            modelGroup.add(f);
            const o = mesh(new THREE.BoxGeometry(5.2, 0.55, 1.20), C_FILIKA_K,
                           { flat: true, rough: 0.7, name: 'filika_ortu_' + n });
            o.position.set(x, y + 0.86, s * 10.75);
            modelGroup.add(o);
        }
    }
})();

// ===========================================================================
// 11. ÜST GÜVERTE — havuz, açık alan
// ===========================================================================
katKur(planSekli(-36.0, 46.0, 9.40, 8, 0.76, 12, 0.34, 18),
       UST_GUV, 0.24, C_GUV_UST, 'ust_guverte', { rough: 0.78, metal: 0.12 });

// Ana havuz + çevresi. Tepeden bakışta beyaz kütlenin ortasındaki tek
// renkli leke; askerî gemilerin helikopter dairesi ile karışmasın diye
// DİKDÖRTGEN ve mavi (daire + yeşil olan helipad'ın tam tersi).
(function anaHavuz() {
    const y = UST_GUV + 0.24;
    // ⚠️ HAVUZ ÇEVRESİ BEYAZ (C_UST) DEĞİL. İlk kurulumda öyleydi ve
    // ölçüldü: tepeden bakışta 17x11 metrelik TAM BEYAZ (255,255,255) bir
    // dikdörtgen çıkıyordu, geminin en parlak lekesi oydu. Beyaz DÜŞEY
    // duvarda sorun değil, YATAY yüzeyde poz kırpıyor.
    const kenar = mesh(new THREE.BoxGeometry(17.0, 0.22, 11.4), C_GUV_UST,
                       { flat: true, rough: 0.8, metal: 0.12, name: 'havuz_kenar' });
    kenar.position.set(11.0, y + 0.11, 0);
    modelGroup.add(kenar);
    const su = mesh(new THREE.BoxGeometry(13.4, 0.26, 8.0), C_HAVUZ,
                    { rough: 0.22, metal: 0.35, name: 'havuz_ana' });
    su.position.set(11.0, y + 0.20, 0);
    modelGroup.add(su);
})();

// Üst güverte kütleleri: kıçta bar/salon bloğu, ortada asansör kulesi.
(function ustKutleler() {
    const y = UST_GUV + 0.24;
    const bar = mesh(new THREE.BoxGeometry(12.0, 2.60, 13.0), C_UST,
                     { flat: true, rough: 0.62, name: 'ust_salon' });
    bar.position.set(-6.0, y + 1.30, 0);
    modelGroup.add(bar);
    const barCam = mesh(new THREE.BoxGeometry(11.2, 1.10, 13.3), C_BALKON,
                        { flat: true, rough: 0.35, metal: 0.3, name: 'ust_salon_cam' });
    barCam.position.set(-6.0, y + 1.55, 0);
    modelGroup.add(barCam);
    // Salon ÇATISI ayrı ve KOYU. Kutunun kendi üst yüzü beyaz kalsaydı
    // tepeden bakışta 12x13 metrelik ikinci bir beyaz leke olurdu
    // (havuz çevresiyle aynı hata).
    const barCati = mesh(new THREE.BoxGeometry(12.2, 0.22, 13.2), C_GUV,
                         { flat: true, rough: 0.85, metal: 0.12, name: 'ust_salon_cati' });
    barCati.position.set(-6.0, y + 2.65, 0);
    modelGroup.add(barCati);
    // Güneş güvertesi çatısı (koyu tente) — tepeden bakışta beyazı kırıyor
    const tente = mesh(new THREE.BoxGeometry(9.0, 0.20, 12.0), C_KOYU,
                       { flat: true, rough: 0.9, name: 'tente_ust' });
    tente.position.set(30.0, y + 2.40, 0);
    modelGroup.add(tente);
    for (let s = -1; s <= 1; s += 2) {
        const d1 = mesh(new THREE.CylinderGeometry(0.22, 0.22, 2.30, 8), C_UST,
                        { name: 'tente_direk_' + (s < 0 ? 1 : 2) });
        d1.position.set(30.0, y + 1.15, s * 5.0);
        modelGroup.add(d1);
    }
})();

// ===========================================================================
// 12. BACA — kıça yakın, geniş ve yatık
// ===========================================================================
// Profil (x,y) düzleminde çiziliyor ve z boyunca extrude ediliyor:
// ExtrudeGeometry'nin doğal yönü zaten +z, döndürme gerekmiyor.
// Tepesi tabanından 3 m KIÇA kaymış -> yatık. Askerî gemilerin bacası
// dar ve dik kutu; kruvaziyerinki geniş ve yatıktır, siluetteki en
// belirgin fark bu.
(function baca() {
    const noktalar = [
        [-14.0, UST_GUV + 0.24], [-13.4, 36.2], [-14.8, 38.4],
        [-17.4, BACA_TEPE], [-27.6, BACA_TEPE], [-30.6, 38.2],
        [-31.6, 36.0], [-30.4, UST_GUV + 0.24]
    ];
    const s = new THREE.Shape();
    s.moveTo(noktalar[0][0], noktalar[0][1]);
    for (let i = 1; i < noktalar.length; i++) s.lineTo(noktalar[i][0], noktalar[i][1]);
    s.closePath();
    const g = new THREE.ExtrudeGeometry(s, { depth: 11.0, bevelEnabled: false, steps: 1 });
    const m = mesh(g, C_BACA, { flat: true, rough: 0.6, metal: 0.12, name: 'baca' });
    m.position.z = -5.5;
    modelGroup.add(m);
    // Baca kapağı: KOYU. Tepeden bakışta kıç yarısındaki tek koyu oval —
    // geminin hangi ucunun kıç olduğunu bu söylüyor.
    const kap = mesh(new THREE.BoxGeometry(11.0, 0.55, 11.6), C_BACA_UST,
                     { flat: true, rough: 0.75, name: 'baca_kapak' });
    kap.position.set(-22.5, BACA_TEPE + 0.20, 0);
    modelGroup.add(kap);
    // ⚠️ Baca ağızlarının tepesi 39.95'te BİTİYOR. İlk kurulumda 40.17'ye
    // çıkıyordu (ölçüldü) ve modelin en yüksek noktası direk yerine baca
    // ağzı oluyordu — kutu y'si 40.17. Ölçüt 40; direk tepesi tek başına
    // en yüksek nokta kalsın diye alçaltıldı.
    for (let s2 = -1; s2 <= 1; s2 += 2) {
        const agiz = mesh(new THREE.CylinderGeometry(1.55, 1.55, 0.50, 14), C_KOYU,
                          { rough: 0.9, name: 'baca_agiz_' + (s2 < 0 ? 1 : 2) });
        agiz.position.set(-22.5, BACA_TEPE + 0.30, s2 * 3.1);
        modelGroup.add(agiz);
    }
    // Bacanın yan kanadı — modern kruvaziyerlerde bacayı taşıyan geniş
    // ayak. Bacayı üst güverteye bağlıyor, havada durmuyor.
    for (let s3 = -1; s3 <= 1; s3 += 2) {
        const kanat = mesh(new THREE.BoxGeometry(13.0, 2.20, 1.10), C_UST,
                           { flat: true, rough: 0.62, name: 'baca_kanat_' + (s3 < 0 ? 1 : 2) });
        kanat.position.set(-22.0, UST_GUV + 1.35, s3 * 6.0);
        modelGroup.add(kanat);
        // Kanadın ÜST yüzü yatay: beyaz bırakılsaydı tepeden bakışta
        // bacanın iki yanında iki tam beyaz dikdörtgen olurdu (ölçüldü).
        const kk = mesh(new THREE.BoxGeometry(13.0, 0.08, 1.10), C_GUV,
                        { flat: true, rough: 0.78, metal: 0.12,
                          name: 'baca_kanat_kapak_' + (s3 < 0 ? 1 : 2) });
        kk.position.set(-22.0, UST_GUV + 2.49, s3 * 6.0);
        modelGroup.add(kk);
    }
})();

// ===========================================================================
// 13. KÖPRÜÜSTÜ — camlı, yanlara taşan kanatlarla
// ===========================================================================
(function kopru() {
    const y0 = UST_GUV + 0.24;
    // Gövde: üst yapının plan makinesiyle kuruluyor, yani ÖNÜ YUVARLAK.
    // Kutu olarak yazılsaydı köşeleri altındaki katın yuvarlak burnundan
    // taşardı (ölçülerek görüldü: x=44'te kat 7 yarı genişliği 6.73).
    katKur(planSekli(28.0, 45.0, 8.90, 6, 0.86, 14, 0.36, 14),
           y0, 3.30, C_UST, 'kopru_govde');
    // Cam bandı: aynı planın 0.18 büyüğü -> öne ve yanlara sarılıyor.
    katKur(planSekli(30.0, 45.18, 9.08, 6, 0.86, 14, 0.37, 14),
           y0 + 1.55, 1.30, C_CAM, 'kopru_cam',
           { rough: 0.25, metal: 0.35 });
    // Köprü kanatları: gerçek kruvaziyerde borda hizasına kadar taşar
    // (kaptan yanaşırken bordayı görecek). Dış uç 11.60 < 11.95.
    for (let s = -1; s <= 1; s += 2) {
        const kn = mesh(new THREE.BoxGeometry(7.0, 2.30, 4.60), C_UST,
                        { flat: true, rough: 0.62, name: 'kopru_kanat_' + (s < 0 ? 1 : 2) });
        kn.position.set(38.0, y0 + 1.15, s * 9.30);
        modelGroup.add(kn);
        const knc = mesh(new THREE.BoxGeometry(5.0, 0.95, 4.80), C_CAM,
                         { flat: true, rough: 0.25, metal: 0.35,
                           name: 'kopru_kanat_cam_' + (s < 0 ? 1 : 2) });
        knc.position.set(39.4, y0 + 1.60, s * 9.30);
        modelGroup.add(knc);
        const knk = mesh(new THREE.BoxGeometry(7.0, 0.08, 4.60), C_GUV,
                         { flat: true, rough: 0.78, metal: 0.12,
                           name: 'kopru_kanat_kapak_' + (s < 0 ? 1 : 2) });
        knk.position.set(38.0, y0 + 2.34, s * 9.30);
        modelGroup.add(knk);
    }
    // Köprü çatısı — koyu, tepeden beyaz kütleyi kesiyor.
    katKur(planSekli(28.5, 45.0, 8.70, 6, 0.86, 14, 0.36, 14),
           y0 + 3.30, 0.22, C_GUV, 'kopru_cati', { rough: 0.78, metal: 0.12 });

    // ---- radar direği ----
    // ⚠️ DÖNEN RADAR (spin) KOYULMADI. spin() eklenen model motor
    // tarafından "animasyonlu" sayılır ve LİMANDA DURAN gemi bile her
    // kare yeniden çizilir + gölge haritası tazelenir. Askerî dört
    // gemide dönen radar var ama onlar zaten öyle kurulmuş; burada
    // bedeli ödemeye değecek bir hareket yok. Ayrıca dönen radar tam da
    // askerî gemilerin işareti — sivil kimlikten uzaklaştırırdı.
    const taban = y0 + 3.52;
    const dk = mesh(new THREE.CylinderGeometry(0.26, 0.52, DIREK_TEPE - taban, 10),
                    C_DIREK, { metal: 0.35, rough: 0.4, name: 'direk' });
    dk.position.set(38.0, (taban + DIREK_TEPE) / 2, 0);
    modelGroup.add(dk);
    const seren = mesh(new THREE.BoxGeometry(0.30, 0.30, 7.40), C_DIREK,
                       { metal: 0.35, rough: 0.4, name: 'seren' });
    seren.position.set(38.0, taban + 1.55, 0);
    modelGroup.add(seren);
    const ant = mesh(new THREE.BoxGeometry(2.60, 0.34, 0.28), C_KROM,
                     Object.assign({ name: 'radar_anten' }, KROM_MAL));
    ant.position.set(38.0, DIREK_TEPE - 0.30, 0);
    modelGroup.add(ant);
})();

// ===========================================================================
// 14. BAŞ VE KIÇ DETAYLARI
// ===========================================================================
(function ucDetaylar() {
    const y = UST_TABAN + 0.16;
    // Irgat (demir vinci) — pruvada iki adet.
    for (let s = -1; s <= 1; s += 2) {
        const ir = mesh(new THREE.BoxGeometry(2.60, 1.10, 2.20), C_UST,
                        { flat: true, rough: 0.7, name: 'irgat_' + (s < 0 ? 1 : 2) });
        ir.position.set(68.0, y + 0.55, s * 3.4);
        modelGroup.add(ir);
    }
    // Baş direği — kısa, sivil gemide gövde direği kadar yüksek olmaz.
    const bd = mesh(new THREE.CylinderGeometry(0.16, 0.30, 6.20, 8), C_DIREK,
                    { metal: 0.3, rough: 0.45, name: 'bas_direk' });
    bd.position.set(61.0, y + 3.10, 0);
    modelGroup.add(bd);
    // Kıç bayrak gönderi (bez YOK — bayrak ayrı bir sistem, ona girmiyoruz)
    const kg = mesh(new THREE.CylinderGeometry(0.14, 0.24, 5.00, 8), C_DIREK,
                    { metal: 0.3, rough: 0.45, name: 'kic_gonder' });
    kg.position.set(-73.0, y + 2.50, 0);
    modelGroup.add(kg);
    // Kıç halat makaraları
    for (let s = -1; s <= 1; s += 2) {
        const bt = mesh(new THREE.CylinderGeometry(0.70, 0.80, 1.00, 10), C_UST,
                        { rough: 0.75, name: 'kic_baba_' + (s < 0 ? 1 : 2) });
        bt.position.set(-68.0, y + 0.50, s * 5.2);
        modelGroup.add(bt);
    }
})();
