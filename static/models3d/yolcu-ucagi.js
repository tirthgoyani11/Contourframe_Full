// Yolcu uçağı — dar gövdeli iki motorlu kısa/orta menzil jeti
// (Airbus A320 / Boeing 737 sınıfı). Ulaşım temasının yedinci modeli.
//
// KÜTÜPHANEDE ZATEN ASKERİ UÇAKLAR VAR (`savas-ucagi`, `stealth-bombardiman`,
// `awacs`, `sabit-kanat-iha`). Bu modelin işi SİVİL okunmak. Sivil silueti
// kuran şeyler, önem sırasıyla:
//   1. UZUN SİLİNDİRİK GÖVDE — sabit çaplı bir tüp, önde koni burun, arkada
//      YUKARI KIVRILAN kuyruk konisi. Askeri uçakta gövde kesiti değişken ve
//      yassıdır; yolcu uçağında daireden hiç sapmaz (basınç kabini).
//   2. YOLCU PENCERELERİ SIRASI — 25 küçük koyu dikdörtgen, gövde boyunca
//      tek hizada. Uzaktan kesik çizgiye, yakında pencereye düşer.
//   3. KANAT ALTINDA İKİ TURBOFAN — kısa, geniş, ağzı koyu, içinde fan diski.
//   4. KLASİK KUYRUK (T DEĞİL) — dikey stabilizatör gövdenin sırtında,
//      yatay stabilizatörler kuyruk konisinin İÇİNDEN geçer.
//   5. İNİŞ TAKIMI — burunda ikiz, kanat kökünde ikiz+ikiz.
//
// GERÇEK ÖLÇÜLER (metre, A320-200 + sharklet):
//   gövde uzunluğu 37.60 (UZUN 18.80) · kanat açıklığı 35.80 (z ±17.90)
//   gövde çapı 3.95 (yarıçap 1.975) · yükseklik 11.80 (dikey kuyruk tepesi)
//   gövde ekseni yerden 3.60 · kanat kökü y 2.30 · dihedral 5°
//   motor merkezi x +2.40, z ±5.90 · burun takımı x +13.50
//   ana takım x −0.80, z ±3.80 · teker yarıçapı burun 0.36 / ana 0.56
//
// ⚠️ KANAT OK AÇISI: görev tanımı "kanat kökü x ≈ +0.6, uç x ≈ −4.2 (ok açısı
// ~25°)" diyordu, ama o iki nokta 17.90 m yarı açıklıkta 15° verir — kendi
// içinde tutarsız. Gerçek A320 hücum kenarı 26-27°, çeyrek kiriş 25°. Ok
// açısı yazılı niyet olduğu için ÖLÇÜ o tutuldu: hücum kenarı boydan boya
// TAM 26° (xle = 3.40 − 0.4877·|z|), çeyrek kiriş 22.4°. Kanat kökünün FİRAR
// kenarı −4.20 çıkıyor — görev tanımındaki −4.2 sayısı büyük olasılıkla oydu.
//
// KUTU (ÖLÇÜLDÜ): 37.600 x 11.791 x 35.793. `sizeKm` max(box.x, box.z)'a
// bakıyor → burada x hâkim (37.600). Çeyrek kiriş ok açısı da ölçüldü:
// kök c/4 = +1.500, uç c/4 = −5.438, yarı açıklık 17.30 → 21.8°.
//
// AĞIRLIK: 64 mesh / 9448 üçgen. Otobüs 84/12420, otomobil 12968. Uçak
// daha ucuz çünkü gövdesi TEK bir dönel loft (35 istasyon x 26'lık halka)
// ve kanat kesiti otomobil kesitinden basit; buna karşılık altı tekerlek,
// iki motor kaportası ve iki fan taşıyor.
//
// PARÇALAR (Studio3D bu adları arar, DEĞİŞTİRME):
//   govde                    → RENK ALIR (_TINT), varsayılan '#dfe3e8'
//   takim                    → GRUP. Davranış altKm eşiğinin üstünde
//                              visible=false yapar (takım toplanır).
//   teker_on_1/2             → burun ikizi (yuvarlanır)
//   teker_arka_1..4          → ana takım, iki bacakta ikişer (yuvarlanır)
//   fan_1/2                  → spin() ile dönen fan diskleri (axis 'x')
//
// ⚠️ YAZI YOK. Harita modeli soldan sağa AYNALIYOR (OKU.md'deki ölçülmüş
// tuzak: det(projection) < 0); gövdeye havayolu adı yazsaydık ters çıkardı.
// Havayolu kimliğini yazı yerine RENK taşıyor: koyu dikey kuyruk + gövde
// boyunca ince koyu şerit + gri karın.
//
// ⚠️ AÇIK RENK PATLADI, ÖLÇÜLDÜ VE KOYULTULDU. Görev tanımındaki '#e8eaed'
// ile kurulan ilk sürümde tepe bakışında (haritanın ana bakışı) model
// pikselinin %82.8'i parlak (L>230) ve %77.8'i TAM BEYAZ (>=250) çıktı —
// yani gövdenin ve kanadın üstündeki bütün kavis, panel çizgisi ve gölge
// yok olmuştu. Ölçüm `parlaklik.py` ile, `bakis.py`nin tepe bakışıyla
// birebir aynı ışık altında. Ayrıntı ve karşılaştırma §0'da.
//
// YÖN: burun +x, üst +y, sol kanat +z. Taban y=0 (lastiklerin değdiği yer).

// ===========================================================================
// 0. RENKLER
// ===========================================================================
// ⚠️ RENK KOYULTMA ÖLÇÜMÜ (parlaklik.py, tepe bakışı, 900x900):
//
//   gövde     malzeme            ortalama  parlak(L>230)  TAM BEYAZ(>=250)
//   #e8eaed   metal .22 rough .68   236.7       %82.8          %77.8
//   #b8bec6   metal .22 rough .80   227.4       %72.7          %50.5
//   #aab1b9   metal .10 rough .80   222.9       %71.0          %16.2
//   #aab1b9   metal .22 rough .80   203.9       %20.1           %0.9   ← SEÇİLEN
//   #aab1b9   metal .32 rough .80   187.7        %3.5           %0.9
//
// Kıyas: aynı ölçüm motokaravanda (Furkan'ın kabul ettiği açık renkli
// model) 203.4 / %58.7 / %0.1. Yani seçilen ayar kabul edilmiş bir modelle
// AYNI ortalama parlaklıkta ve doygunluk sınırının altında.
//
// ⚠️ METALNESS'İ DÜŞÜRMEK PATLAMAYI ARTIRIYOR, azaltmıyor. Sezgiye ters ama
// ölçüldü (yukarıdaki üçüncü satır): standart PBR'de difüz bileşen
// albedo·(1−metalness), yani metalness 0.22'den 0.10'a inince difüz %13
// artıyor ve tam beyaz oranı %0.9'dan %16.2'ye fırlıyor. Metalness burada
// "krom görünsün" için değil, açık gövdeyi doygunluk sınırının altında
// tutmak için 0.22.
const C_GOVDE   = '#aab1b9';   // _TINT varsayılanı — kırık beyaz gövde
const C_KANAT   = '#9aa1a9';   // kanat/stabilizatör: gövdeden bir tık koyu.
                               // Aynı ton olsaydı kanat kökü gövdeye kaynar,
                               // tepe bakışında uçak tek parça bir levhaya
                               // düşerdi (motokaravanda ölçülen aynı tuzak).
const C_KARIN   = '#868d95';   // kanat-gövde karın kaplaması + alt gövde.
                               // Gerçek yolcu uçağında alt gövde boyasızdır.
const C_KUYRUK  = '#2f4257';   // dikey kuyruk — RENK ALMAZ (görev tanımı).
const C_SERIT   = '#2f4257';   // gövde boyu ince şerit, kuyrukla aynı ton
const C_CAM     = '#12171e';   // yolcu penceresi
const C_KOKPIT  = '#171e28';   // kokpit camı — pencereden bir tık AÇIK:
                               // ikisi aynı olsaydı burun tek koyu leke olurdu
const C_CERCEVE = '#c3cad2';   // kokpit camı çerçevesi. Gövdeden bir tık AÇIK:
                               // referansta (oncam-ref-1/2/3) çerçeve açık gri
                               // metal ve camla arasındaki kontrast yüksek.
                               // Eskiden '#4a545f' idi — camdan yalnız bir tık
                               // açık olduğu için kuşak tek koyu leke okunuyordu.
const C_KAPI    = '#9ba2aa';   // kapı hattı: gövdeden koyu ama şeritten açık
const C_MOTOR   = '#a8afb7';   // motor kaportası
const C_MOTOR_IC = '#191d23';  // hava girişi ağzı (koyu boğaz)
const C_FAN     = '#7e868f';
const C_GOBEK   = '#20252b';   // fan göbeği / çıkış konisi
const C_LASTIK  = '#17181b';
const C_JANT    = '#a9b0b7';
const C_BACAK   = '#8e959c';   // iniş takımı bacağı
const C_DIP     = '#0e1114';   // gölgeli oyuklar, takım yuvası
const C_PANEL   = '#8f959c';   // kanat üstü panel çizgisi
const C_KIRMIZI = '#8f2b26';   // sol kanat seyir feneri
const C_YESIL   = '#256b42';   // sağ kanat seyir feneri
// ⚠️ KROM DİYE metalness 0.85+ VERİLMEZ: sahnede environment map yok,
// metalness=1 difüzü sıfırlar ve açı tutmayan yüz kapkara çıkar. Düşük
// metalness + açık taban rengi hem parlar hem parçayı okutur.
const METAL_MAL = { metal: 0.45, rough: 0.28 };

// ===========================================================================
// 1. TEMEL ÖLÇÜLER
// ===========================================================================
const UZUN      = 18.80;    // yarı uzunluk → 37.60 m
const R_GOVDE   = 1.975;    // gövde yarıçapı (çap 3.95)
const YC0       = 3.60;     // gövde ekseninin yerden yüksekliği
const NV        = 14;       // yarı kesitteki örnek (halka 2·NV−2 = 26)

const OK_TAN    = 0.4877;   // tan(26°) — kanat hücum kenarı ok açısı
const KANAT_Y0  = 2.30;     // kanat kökünün yüksekliği (alçak kanat)
const DIHEDRAL  = 0.0875;   // tan(5°)
const KANAT_UC  = 17.30;    // düz kanadın bittiği |z| (sonrası winglet kavisi)
const ACIKLIK   = 17.90;    // en dış nokta (winglet tepesi) → açıklık 35.80

const MOTOR_Z   = 5.90;     // motor ekseni
const MOTOR_X   = 2.40;     // motor ekseninin orta noktası
const MOTOR_Y   = 1.80;     // motor ekseninin yerden yüksekliği
const MOTOR_R   = 1.24;     // kaporta en geniş yarıçapı (çap 2.48)

const R_TEKER   = 0.56;     // ana teker — _WHEELS.radius ile BİREBİR aynı
const R_BURUN_T = 0.36;     // burun tekeri (motor tek yarıçap kullanır, bkz.
                            // ucak_tablolar.py'deki gerekçe)
const TAKIM_X   = -0.80;    // ana takım aksı
const TAKIM_Z   = 3.80;     // ana takım izi (±) → iz 7.60
const BURUN_X   = 13.50;    // burun takımı

// ===========================================================================
// 2. MONOTON KÜBİK EĞRİ (PCHIP)
// ===========================================================================
// Evin standart eğrisi (otomobil/otobüs ile aynı). Catmull-Rom denendi ve
// bırakıldı: eğimin hızla değiştiği yerde taşıyor. Burada taşma özellikle
// pahalı olurdu — 21 metrelik SABİT çaplı gövde bölümünün ortasında 2 cm'lik
// bir şişme, yandan bakışta hemen okunur.
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

// ---- gövdenin üç uzunlamasına eğrisi --------------------------------------
// YARIÇAP. −9.0 ile +12.4 arasında SABİT 1.975: basınçlı kabin gövdesi
// gerçekten sabit kesitlidir, "kavis katalım" diye şişirmek uçağı balığa
// çevirirdi. Kavis yalnız iki uçta.
const R_GOV = egriYap([
    [-18.80, 0.150], [-18.45, 0.330], [-17.90, 0.590], [-17.10, 0.930],
    [-16.10, 1.270], [-14.70, 1.610], [-13.00, 1.820], [-11.20, 1.930],
    [ -9.00, 1.975], [ 12.40, 1.975], [ 13.70, 1.955], [ 14.90, 1.890],
    [ 15.90, 1.780], [ 16.80, 1.605], [ 17.55, 1.360], [ 18.20, 1.020],
    [ 18.55, 0.680], [ 18.80, 0.240]
]);
// KESİT MERKEZİNİN YÜKSEKLİĞİ. Kuyruk konisi YUKARI kıvrılır (arkadan
// yükleme/kalkışta kuyruk sürtmesin diye) — yolcu uçağının yandan
// silüetindeki en tanınır çizgi bu. Burunda ise hafif AŞAĞI düşer
// (kokpitten aşağı görüş).
const YC = egriYap([
    [-18.80, 5.15], [-17.60, 4.98], [-16.20, 4.73], [-14.60, 4.42],
    [-13.00, 4.13], [-11.40, 3.88], [-10.00, 3.71], [ -9.00, 3.64],
    [ -8.00, 3.60], [ 12.40, 3.60], [ 14.40, 3.585], [ 16.10, 3.520],
    [ 17.30, 3.400], [ 18.20, 3.245], [ 18.80, 3.120]
]);
// YATAY/DÜŞEY ORAN (rz/ry). Ortada tam daire. Kuyruk konisinde 0.86: gerçek
// kuyruk konisi yandan bakışta hâlâ dolgun, üstten bakışta İNCE biter.
// ⚠️ 1.00 (daire) denendi ve bırakıldı — üstten bakışta kuyruk kalın bir
// sosis gibi kalıyor, dikey kuyruğun kökü belirsizleşiyordu.
const ORAN = egriYap([
    [-18.80, 0.84], [-16.00, 0.88], [-13.00, 0.94], [-10.50, 1.00],
    [ 16.00, 1.00], [ 17.60, 0.97], [ 18.80, 0.92]
]);

// ===========================================================================
// 3. GÖVDE KESİTİ
// ===========================================================================
// Fonksiyon adları kasten otobüs/otomobil ile AYNI (kesitPar / kesitNokta /
// nokta3 / vYukseklik): tezgâhtaki `kesit_olc.js` bu dört adı arıyor, ölçüm
// aracı bu modelde de çalışsın diye.
function kesitPar(x) {
    const r = R_GOV(x);
    return { ry: r, rz: r * ORAN(x), yc: YC(x) };
}
// v ∈ [0,1]: 0 = kesitin en altı, 1 = en üstü. Dönen [z, y].
// y v ile MONOTON artıyor (vYukseklik'in ikili araması buna dayanıyor).
function kesitNokta(P, v) {
    const th = Math.PI * v;
    return [P.rz * Math.sin(th), P.yc - P.ry * Math.cos(th)];
}
// Yüzey noktası. w ∈ [-1,1]: 0 = üst orta hat, ±1 = alt orta hat.
function nokta3(x, w) {
    const p = kesitNokta(kesitPar(x), 1 - Math.abs(w));
    return [x, p[1], (w < 0 ? -p[0] : p[0])];
}
// Sayısal yüzey normali (dışa bakar). Panelleri bu yönde ötelüyoruz.
function normal3(x, w) {
    const h = 0.006;
    const hx = (x > UZUN - 0.02) ? -h : h;
    const hw = (Math.abs(w) > 0.99) ? -h : h;
    const a = nokta3(x, w), b = nokta3(x + hx, w), c = nokta3(x, w + hw);
    const ux = b[0] - a[0], uy = b[1] - a[1], uz = b[2] - a[2];
    const vx = c[0] - a[0], vy = c[1] - a[1], vz = c[2] - a[2];
    let nx = uy * vz - uz * vy, ny = uz * vx - ux * vz, nz = ux * vy - uy * vx;
    const L = Math.sqrt(nx * nx + ny * ny + nz * nz) || 1;
    nx /= L; ny /= L; nz /= L;
    const yc = kesitPar(x).yc;
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
// ---- METREDEN `w`YE İKİ ÇÖZÜCÜ -------------------------------------------
// Kokpit camı METRE cinsinden yazılıyor (aşağıda §6 KOKPİT). Sebebi ölçülmüş
// bir tuzak: sabit `w` ile yazılan bir bant, kesitin oranı x boyunca
// değiştikçe kayıyor — burun konisinde kesit 16.20'de 3.46 m, 17.55'te
// 2.64 m genişlikte, yani aynı `w` iki istasyonda bambaşka bir yüksekliğe
// denk geliyor. (Aynı tuzak otobüsün ön cam köşe bandında ve SİHA'nın
// burnunda iki kez ölçüldü.) Zırhlı SUV'da bunun için `wIcin` yazılmıştı;
// bu iki fonksiyon onun uçak karşılığı.
//   wYuk(x, y) → o istasyonda `y` YÜKSEKLİĞİNİN w'si
//   wIcin(x, z) → o istasyonda `z` YARI GENİŞLİĞİNİN w'si (tepeye yakın
//                 taraf; kesitin üst yarısı)
function wYuk(x, y) { return 1 - vYukseklik(x, y); }
function wIcin(x, z) {
    const P = kesitPar(x);
    // ⚠️ ARALIK [0, 0.5]. z(w) = rz·sin(πw), yani w=0.5'te (kesitin en geniş
    // yeri) tepe yapıp geri iniyor; [0,1]'de ikili arama YANLIŞ kök bulur.
    let a = 0, b = 0.5;
    for (let i = 0; i < 30; i++) {
        const m = (a + b) / 2;
        if (kesitNokta(P, 1 - m)[0] < z) a = m; else b = m;
    }
    return (a + b) / 2;
}

// ===========================================================================
// 4. GENEL LOFT — bu modeldeki BÜTÜN kütleler bundan çıkıyor
// ===========================================================================
// Gövde, kanat, kuyruklar, motor pilonu ve karın kaplaması aynı makineden
// geçiyor: sıralı KAPALI halkalar birbirine dikiliyor, iki uç yelpaze ile
// kapanıyor. Extrude bu modelde gövde kütlesi için HİÇ kullanılmadı (devir
// notu §4.3: extrude yalnız gerçekten yassı parçalar içindir) — bir uçakta
// sabit kesitli hiçbir kütle yoktur.
//
// ⚠️ SARIM YÖNÜ GÖZLE KOVALANMIYOR, ÖLÇÜLÜYOR. Aynalanan parçalarda (sol
// kanat, sol winglet) halka sırası kendiliğinden ters dönüyor ve normaller
// içeri bakıyor; bunu her parçada elle düzeltmek yerine kapalı kabuğun
// İŞARETLİ HACMİ hesaplanıyor, negatifse bütün üçgenler ters çevriliyor.
// Bir kez yazıldı, bütün parçalarda doğru.
function loftKur(ad, halkalar, renk, opts) {
    opts = opts || {};
    const n = halkalar[0].length, P = [], IDX = [];
    for (const h of halkalar) for (const p of h) P.push(p[0], p[1], p[2]);
    for (let i = 0; i < halkalar.length - 1; i++) {
        for (let j = 0; j < n; j++) {
            const j2 = (j + 1) % n;
            const a = i * n + j, b = i * n + j2;
            const c = (i + 1) * n + j, d = (i + 1) * n + j2;
            IDX.push(a, c, d, a, d, b);
        }
    }
    // Uç kapakları: halka köşeleri KOPYALANIYOR ki computeVertexNormals
    // kapağın normalini yan yüzeyinkiyle ortalamasın (kapak yumuşarsa uç
    // balon gibi görünür — otobüsün ön yüzünde ölçülmüştü).
    function kapak(h, ileri) {
        let mx = 0, my = 0, mz = 0;
        for (const p of h) { mx += p[0]; my += p[1]; mz += p[2]; }
        const merkez = P.length / 3;
        P.push(mx / n, my / n, mz / n);
        const bas = merkez + 1;
        for (const p of h) P.push(p[0], p[1], p[2]);
        for (let j = 0; j < n; j++) {
            const a = bas + j, b = bas + (j + 1) % n;
            if (ileri) IDX.push(merkez, b, a); else IDX.push(merkez, a, b);
        }
    }
    if (!opts.kapaksiz) {
        kapak(halkalar[halkalar.length - 1], true);
        kapak(halkalar[0], false);
    }
    // İşaretli hacim: kapalı kabukta pozitifse sarım dışa bakıyor demektir.
    let hac = 0;
    for (let i = 0; i < IDX.length; i += 3) {
        const a = IDX[i] * 3, b = IDX[i + 1] * 3, c = IDX[i + 2] * 3;
        hac += P[a] * (P[b + 1] * P[c + 2] - P[b + 2] * P[c + 1])
             - P[a + 1] * (P[b] * P[c + 2] - P[b + 2] * P[c])
             + P[a + 2] * (P[b] * P[c + 1] - P[b + 1] * P[c]);
    }
    if (hac < 0) for (let i = 0; i < IDX.length; i += 3) {
        const t = IDX[i + 1]; IDX[i + 1] = IDX[i + 2]; IDX[i + 2] = t;
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.Float32BufferAttribute(P, 3));
    geo.setIndex(IDX);
    geo.computeVertexNormals();
    const m = mesh(geo, renk, {
        metal: opts.metal == null ? 0.18 : opts.metal,
        rough: opts.rough == null ? 0.62 : opts.rough, name: ad
    });
    modelGroup.add(m);
    return m;
}

// ===========================================================================
// 5. GÖVDE KABUĞU
// ===========================================================================
// İstasyonlar burun ve kuyruk konisinde SIK, sabit kesitli 21 metrede
// SEYREK: orada kesit hiç değişmiyor, sık örneklemek yalnız üçgen harcar.
const IST = [
    -18.80, -18.60, -18.35, -18.05, -17.70, -17.30, -16.80, -16.20,
    -15.50, -14.70, -13.80, -12.80, -11.60, -10.30,  -9.00,  -6.80,
     -3.80,  -0.40,   3.00,   6.40,   9.40,  11.60,  12.40,  13.30,
     14.20,  15.00,  15.70,  16.35,  16.90,  17.40,  17.85,  18.20,
     18.45,  18.65,  18.80
];
const R_HALKA = 2 * NV - 2;

function govdeHalka(x) {
    const P = kesitPar(x), yarim = [];
    for (let i = 0; i < NV; i++) yarim.push(kesitNokta(P, i / (NV - 1)));
    // 0 = alt orta → +z yanı yukarı → NV−1 = üst orta → −z yanı aşağı.
    // Kapalı halka, kutup yok, bozuk üçgen yok.
    const r = [];
    for (let i = 0; i < NV; i++) r.push([x, yarim[i][1], yarim[i][0]]);
    for (let i = NV - 2; i >= 1; i--) r.push([x, yarim[i][1], -yarim[i][0]]);
    return r;
}
loftKur('govde', IST.map(govdeHalka), C_GOVDE, { metal: 0.22, rough: 0.80 });

// ===========================================================================
// 6. GÖVDEYE OTURAN PANELLER
// ===========================================================================
// Pencereler, kapı hatları, karın kaplaması ve şerit — hepsi aynı
// yardımcıdan: gövde yüzeyi x1..x2 ve w1..w2 aralığında yeniden örnekleniyor
// ve normal boyunca `disari` kadar öteleniyor. Düz bir levha olsaydı burun
// konisinde yüzeyin içine girerdi.
//
// Bant biçimi: [x1, x2, w1, w2]            → w = kesit parametresi
//              [x1, x2, y1, y2, taraf]     → y YÜKSEKLİK; her x'te o
//              yüksekliğin w'si aranır. Kapılar yatay bir çizgiyi izler;
//              sabit w ile yazılsalardı burun konisinde yukarı kayarlardı.
//              [x1, x2, a1, a2, 0, b1, b2] → YAMUK (konik) bant: w aralığı
//              x boyunca (a1,a2)'den (b1,b2)'ye doğrusal geçer.
//              [xA,wA, xB,wB, xC,wC, xD,wD] → DÖRTLÜ (quad) bant: dört köşe
//              de bağımsız, (u,v) çift doğrusal. Yalnız kokpit camı kullanıyor.
//
// ⚠️ YAMUK BİÇİM KOKPİT CAMI İÇİN EKLENDİ (zırhlı SUV'un ön camında ölçülmüş
// reçetenin uçak karşılığı). Dikdörtgen bant `w`yi sabit tutuyor; `w`nin
// karşılığı olan yükseklik ise kesitten geliyor ve burun konisinde kesit
// 1.35 metre içinde 3.46 m'den 2.64 m'ye düşüyor. Sabit-w bir ön cam bu
// yüzden burna doğru SARKIYORDU (ölçüldü: üst kenar 16.55'te y=5.087,
// 17.70'te y=4.589 — 0.50 m'lik düşüş, "üzgün ağız").
//
// ⚠️ `nx` bandın x, `nw` w yönündeki bölüntüsü. UZUN kenara ÇOK verilir;
// ters verilirse şerit gövdenin kavisini takip edemeyip içine girer ve
// KAYBOLUR (otobüste ölçülmüş tuzak).
function yuzeyYama(ad, bantlar, nx, nw, disari, renk, opts) {
    opts = opts || {};
    const P = [], IDX = [];
    for (const bant of bantlar) {
        // ⚠️ DÖRTLÜ (quad) BİÇİM — uzunluk 8: [xA,wA, xB,wB, xC,wC, xD,wD]
        // A = iç-üst, B = iç-alt, C = dış-üst, D = dış-alt. Dört köşe de
        // BAĞIMSIZ; yamuk bant iki uç kenarı SABİT x'te tutuyordu ve kokpit
        // camının iç kenarı (orta direk) sabit x'te DEĞİL — burun konisinde
        // sabit |z| çizgisi tepe hattını izler, yani x boyunca ilerler.
        // Ölçüldü: sabit-x iç kenar, ön camı burnun bir ÇEYREK DİLİMİNE
        // çeviriyordu (alt kenar merkezden uca 0.358 m sarkıyordu).
        const dortlu = bant.length === 8;
        const x1 = bant[0], x2 = bant[1], a1 = bant[2], a2 = bant[3];
        const taraf = (!dortlu && bant.length > 4) ? bant[4] : 0;
        const konik = !dortlu && bant.length > 6;
        const b1 = konik ? bant[5] : a1, b2 = konik ? bant[6] : a2;
        const taban = P.length / 3, S = nw + 1;
        for (let i = 0; i <= nx; i++) {
            const u = i / nx;
            const x = dortlu ? 0 : x1 + (x2 - x1) * u;
            const c1 = a1 + (b1 - a1) * u, c2 = a2 + (b2 - a2) * u;
            for (let j = 0; j <= nw; j++) {
                const v = j / nw;
                let xx, w;
                if (dortlu) {
                    xx = (1 - u) * ((1 - v) * bant[0] + v * bant[2])
                       +      u  * ((1 - v) * bant[4] + v * bant[6]);
                    w  = (1 - u) * ((1 - v) * bant[1] + v * bant[3])
                       +      u  * ((1 - v) * bant[5] + v * bant[7]);
                } else {
                    xx = x;
                    const a = c1 + (c2 - c1) * v;
                    w = taraf ? taraf * (1 - vYukseklik(xx, a)) : a;
                }
                const p = nokta3(xx, w), n = normal3(xx, w);
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
        rough: opts.rough == null ? 0.55 : opts.rough, name: ad
    });
    m.material.side = THREE.DoubleSide;
    // Kalınlıksız paneller GÖLGE DÜŞÜRMEZ: gövdeye 2-4 cm mesafede
    // duruyorlar, gölge haritasında kendi gölgelerini gövdenin üstüne basıp
    // benek (acne) üretiyorlardı.
    m.castShadow = false;
    modelGroup.add(m);
    return m;
}

// ---- ALT GÖVDE (boyasız gri karın) ---------------------------------------
// w 0.60 → 1.00, yani kesitin alt %40'ı. Gerçek yolcu uçağında alt gövde
// boyanmaz; bu şerit gövdeyi iki tona bölüyor ve alçak bakışta uçağın
// yuvarlaklığını okutan tek işaret oluyor (tek renk tüp düz görünüyordu).
yuzeyYama('alt_govde', [
    [-16.60, 17.60,  0.60,  1.00],
    [-16.60, 17.60, -1.00, -0.60]
], 46, 4, 0.020, C_KARIN, { metal: 0.12, rough: 0.78 });

// ---- GÖVDE ŞERİDİ --------------------------------------------------------
// Pencere hattının hemen ALTINDA ince koyu çizgi. Havayolu kimliğini yazı
// olmadan taşıyan iki işaretten biri (öbürü dikey kuyruk). Genişliği
// Δw=0.030 → gövde çevresinde ~0.19 m.
yuzeyYama('serit', [
    [-16.20, 17.30,  0.505,  0.535],
    [-16.20, 17.30, -0.535, -0.505]
], 44, 1, 0.026, C_SERIT, { metal: 0.2, rough: 0.5 });

// ---- KAPILAR VE ÇIKIŞLAR -------------------------------------------------
// Dört ana kapı (önde ve arkada, iki yanda) + kanat üstü iki acil çıkış.
// Kapı YÜKSEKLİK biçiminde yazıldı: kabin zemini (2.92) ile kapı üstü (4.72)
// gerçek yatay çizgilerdir, gövde inceldikçe kesit parametresi kayar.
// Kapı KANADI değil, kapı HATTI çiziliyor: gövdeden yalnız 8 mm dışarıda,
// gövdeden hafif koyu. Gerçek uçakta da kapı gövdeyle aynı renge boyanır,
// görünen şey yalnız kenarındaki ince gölge çizgisidir.
const KAPILAR = [
    [ 11.35,  12.25, 2.92, 4.72],
    [ -9.55,  -8.65, 2.92, 4.72],
    [  1.55,   2.15, 3.10, 4.35],    // kanat üstü acil çıkış
    [ -0.55,   0.05, 3.10, 4.35]
];
(function () {
    const b = [];
    for (const k of KAPILAR) {
        b.push([k[0], k[1], k[2], k[3],  1]);
        b.push([k[0], k[1], k[2], k[3], -1]);
    }
    yuzeyYama('kapilar', b, 3, 6, 0.008, C_KAPI, { metal: 0.15, rough: 0.7 });
})();

// ---- YOLCU PENCERELERİ ---------------------------------------------------
// 0.85 m arayla, x +10.55'ten geriye. Pencere hattı gövde ekseninin ~0.60 m
// üstünde (w 0.372..0.432 → y 4.02..4.38).
// ⚠️ HEPSİ TEK MESH. Ayrı ayrı mesh olsalardı 50 çizim çağrısı ederdi ve
// `_applyTint` gibi ada bakan mekanizmalar için 50 ayrı ad gerekirdi.
// yuzeyYama zaten bant LİSTESİ alıyor: bir geometri, bir mesh.
// ⚠️ KAPIYA DENK GELEN PENCERE ATLANIYOR. Kapı yaması 8 mm, pencere 24 mm
// dışarıda; atlanmasaydı pencere kapının ÜSTÜNE çizilir ve kapı hattının
// ortasında kocaman bir yolcu penceresi dururdu (gerçek kapı penceresi
// bunun üçte biri kadardır ve hizası da başka).
(function () {
    const bantlar = [];
    const W1 = 0.372, W2 = 0.432;
    for (let i = 0; i < 25; i++) {
        const x = 10.55 - i * 0.85;
        let cakisma = false;
        for (const k of KAPILAR)
            if (x + 0.15 > k[0] - 0.10 && x - 0.15 < k[1] + 0.10) cakisma = true;
        if (cakisma) continue;
        bantlar.push([x - 0.15, x + 0.15,  W1,  W2]);
        bantlar.push([x - 0.15, x + 0.15, -W2, -W1]);
    }
    yuzeyYama('pencereler', bantlar, 1, 1, 0.024, C_CAM, { metal: 0.3, rough: 0.18 });
})();

// ---- KOKPİT ---------------------------------------------------------------
// REFERANS: AIRBUS A320. Model zaten A320 ölçülerinde — gövde çapı 3.95 m,
// uzunluk 37.6 m, ikisi de A320-200'ün gerçek değerleri. Cam düzeni de
// oradan alındı: her yanda BİR büyük ön cam (No.1), onun arkasında KAYAR
// pencere (No.2) ve en arkada küçük KÖŞE penceresi (No.3); iki ön camın
// arasında dar bir ORTA DİREK; camların altında burnu tanımlayan yatay derz.
//
// ⚠️ İKİ KEZ YENİDEN KURULDU. Kusurun adı her seferinde "üzgün ağız"dı ama
// SEBEBİ farklıydı; ikisini de yazıyorum ki üçüncü kez aynı yoldan girilmesin.
//
//   1. TUR — SABİT `w` BANDI. Ön cam [16.55, 17.70, 0.085, 0.360] idi.
//      Sabit w'nin karşılığı olan yükseklik kesitten gelir; burun konisinde
//      kesit 16.55'te 3.310 m, 17.70'te 2.508 m genişlikte. Bandın üst kenarı
//      y=5.090'dan y=4.589'a düşüyordu — 0.50 m'lik sarkma.
//      Çözüm: cam METRE cinsinden yazıldı, bant YAMUK (konik) yapıldı.
//
//   2. TUR — YAMUK BANT DA YETMEDİ, çünkü bandın İKİ UÇ KENARI SABİT x'te.
//      Ön camın üst kenarı YARI GENİŞLİKTEN (wIcin), alt kenarı YÜKSEKLİKTEN
//      (wYuk) çözülüyordu; bu iki eğri kesitin üstünde birbirine neredeyse
//      DİK. Sonuç kuşak değil, burnun ÇEYREK DİLİMİ:
//        arka uç x=16.20: üst köşe (y=5.144, |z|=0.585), alt köşe (4.395, 1.490)
//        ön  uç x=17.55: üst köşe (y=4.716, |z|=0.135), alt köşe (4.310, 0.949)
//      Panel yüksekliği 1.175 m — burun yarıçapının %68'i. Önden bakışta
//      iki panel aşağı-dışa açılan bir YARASA MASKESİ oluyordu; ölçüldü:
//        alt kenar merkezden uca −0.358 m, üst kenar −0.458 m (ikisi de SARKMA)
//
// ÇÖZÜM (bu tur): `yuzeyYama`ya DÖRTLÜ (quad) bant eklendi — dört köşe de
// bağımsız. Böylece paneller REFERANSTAKİ dört kenarla yazılabiliyor:
//   * ORTA DİREK ve A DİREĞİ sabit |z| çizgileridir (wIcin ile), yani önden
//     bakışta DİKEY. Sabit |z| çizgisi burun konisinde x boyunca ilerler —
//     sabit x'te YAZILAMAZ, ikinci turun kusuru tam olarak buydu.
//   * ÜST ve ALT EŞİK, iki direğin uçlarını birleştirir. Alt eşik dışa
//     doğru YUKARI kalkar (referansta da öyle: yan panellerin alt kenarı
//     ortadakinden yüksekte), üst eşik hafifçe düşer.
// Ölçülen sonuç (oncam_kusak_olc.js, mesh köşelerinden):
//   alt kenar merkezden uca  −0.381 m  →  +0.042 m   (işaret DÖNDÜ)
//   üst kenar merkezden uca  −0.456 m  →  −0.180 m
//   orta direk genişliği      0.275 m  →   0.173 m
//   kuşak yüksekliği    0.011..0.616 m →  0.218..0.441 m (düzgün incelen)
//   cam/çerçeve kontrastı       2.83x  →   6.88x
//
// PANEL TANIMI — hepsi METRE, hepsi ÖNDEN GÖRÜNÜŞ koordinatı:
//   [ad, zIc, zDis, ustIc, ustDis, altIc, altDis]
//   zIc / zDis      = iç ve dış direğin YARI GENİŞLİĞİ. İkisi de sabit, yani
//                     direkler önden bakışta DİK (referansta da öyle).
//   ustIc..altDis   = üst ve alt eşiğin iki ucunun YÜKSEKLİĞİ. Eşikler
//                     (|z|, y) düzleminde DÜZ ÇİZGİ olarak isteniyor;
//                     istasyon `xIcin` ile çözülüyor.
//
// ⚠️ EŞİK NEDEN İSTASYONLA DEĞİL YÜKSEKLİKLE YAZILIYOR. Panel köşelerini
// (x, |z|) ile yazmayı denedim; eşik o zaman (x, w) uzayında düz oluyor ama
// ÖNDEN GÖRÜNÜŞTE kamburlaşıyor: ön camın alt eşiği uçlarda 4.568/4.632
// iken ortada 4.703'e çıkıyordu — 0.10 m'lik kambur, kuşak yüksekliğinin
// dörtte biri. Gözle "direğin dibinde gaga" olarak okunuyordu.
// Çözüm: her panel OC_KOLON dilime bölünüyor, dilim sınırları eşiğin DÜZ
// çizgisi üzerinden (z, y) olarak alınıyor ve istasyon oradan çözülüyor.
// Kalan sapma dilim sayısıyla kareli azalıyor (6 dilimde 0.005 m altı).
// ⚠️ ÇERÇEVE payı yalnız panelin DIŞ sınırında açılıyor; dilimler arası
// sınırda açılsaydı camın ortasından çerçeve şeridi geçerdi.
const OC_CERCEVE = 0.055;   // çerçevenin camdan taşması (m, yüzey üzerinde)
const OC_KOLON   = 6;       // panel başına dilim
const KOKPIT = [
    // ad         zIc    zDis   ustIc  ustDis altIc  altDis
    ['on',       0.085, 0.975,  5.006, 4.939, 4.568, 4.632],  // No.1 ön cam
    ['kayar',    1.045, 1.230,  4.923, 4.898, 4.622, 4.641],  // No.2 kayar
    ['kose',     1.290, 1.420,  4.862, 4.821, 4.613, 4.619]   // No.3 köşe
];
// Verilen yarı genişlik ve yükseklikteki İSTASYON. Sabit |z|'de y, x ile
// MONOTON AZALIR (kesit burna doğru küçülüyor) — ikili arama güvenli.
function xIcin(z, y) {
    let a = 13.00, b = 17.95;
    for (let i = 0; i < 40; i++) {
        const m = (a + b) / 2;
        if (z > kesitPar(m).rz) { b = m; continue; }
        if (nokta3(m, wIcin(m, z))[1] > y) a = m; else b = m;
    }
    return (a + b) / 2;
}
(function () {
    // Panelin bir kolonu: verilen u oranında (|z|, üst y, alt y) → iki (x,w).
    function kolon(p, u) {
        const z  = p[1] + (p[2] - p[1]) * u;
        const yU = p[3] + (p[4] - p[3]) * u;
        const yA = p[5] + (p[6] - p[5]) * u;
        const xU = xIcin(z, yU), xA = xIcin(z, yA);
        return [[xU, wIcin(xU, z)], [xA, wIcin(xA, z)]];
    }
    const uzun = (a, b) => {
        const p1 = nokta3(a[0], a[1]), p2 = nokta3(b[0], b[1]);
        return Math.hypot(p1[0] - p2[0], p1[1] - p2[1], p1[2] - p2[2]) || 1;
    };
    const cam = [], crc = [];
    for (const p of KOKPIT) {
        const K = [];
        for (let i = 0; i <= OC_KOLON; i++) K.push(kolon(p, i / OC_KOLON));
        // ⚠️ ÇERÇEVE PAYI (u,v) BİRİMİNDE DEĞİL, METRE cinsinden isteniyor:
        // panellerin kenar uzunlukları çok farklı (ön camda 1.15 m üst eşik,
        // köşe penceresinde 0.57 m). Sabit bir (u,v) payı dar panelde kalın,
        // geniş panelde ince çerçeve verirdi.
        const evUc = OC_CERCEVE / uzun(K[0][0], K[0][1]);
        const euUc = OC_CERCEVE / (uzun(K[0][0], K[K.length - 1][0]) / OC_KOLON);
        for (let i = 0; i < OC_KOLON; i++) {
            const A = K[i], B = K[i + 1];
            const e0 = (i === 0) ? euUc : 0;
            const e1 = (i === OC_KOLON - 1) ? euUc : 0;
            // (u,v) çift doğrusal — [0,1] dışına taşarak ÇERÇEVE köşeleri çıkar.
            const nokta = (u, v) => [
                (1 - u) * ((1 - v) * A[0][0] + v * A[1][0])
                    + u  * ((1 - v) * B[0][0] + v * B[1][0]),
                (1 - u) * ((1 - v) * A[0][1] + v * A[1][1])
                    + u  * ((1 - v) * B[0][1] + v * B[1][1])];
            const bant = (eu0, eu1, ev, s) => {
                const q = [nokta(-eu0, -ev), nokta(-eu0, 1 + ev),
                           nokta(1 + eu1, -ev), nokta(1 + eu1, 1 + ev)];
                const b = [];
                for (const k of q) { b.push(k[0], s * k[1]); }
                return b;
            };
            for (const s of [1, -1]) {
                cam.push(bant(0, 0, 0, s));
                crc.push(bant(e0, e1, evUc, s));
            }
        }
    }
    // ⚠️ ÇERÇEVE CAMDAN İÇERİDE (0.016 < 0.030): aynı yüzeye oturan iki panel
    // derinlik kavgası ediyor; ayrı ötelemeler katman sırasını garantiliyor.
    // ⚠️ BÖLÜNTÜ DÜŞÜK TUTULDU: kuşak zaten OC_KOLON dilime bölünmüş durumda
    // (36 bant), üstüne yoğun bölüntü üçgeni boşa harcıyor. Kesitin kirişten
    // sapması ölçüldü: kuşak yüksekliği 0.44 m, burun yarıçapı 1.7 m →
    // toplam sarkma 14.2 mm, dört dilimde dilim başına 0.9 mm. 4×8'den
    // 3×4'e inince ön cam + çerçeve 4608 üçgenden 1728'e düştü.
    yuzeyYama('kokpit_cerceve', crc, 3, 4, 0.016, C_CERCEVE,
              { metal: 0.25, rough: 0.55 });
    yuzeyYama('kokpit_cam', cam, 3, 4, 0.030, C_KOKPIT,
              { metal: 0.35, rough: 0.12 });
})();
// ---- BURUN HATTI ----------------------------------------------------------
// Camların ALTINDAN geçen yatay derz + burnun ucundaki RADOM birleşimi.
// Gerçek yolcu uçağında burnu "burun" yapan iki çizgi bunlar: kokpit
// yanağının alt derzi ve radomun gövdeye oturduğu çevresel ek yeri. İkisi
// olmadan burun tek parça bir yumurta gibi okunuyordu.
// ⚠️ RADOM HALKASI `nw` AĞIRLIKLI: bant kesitin ÇEVRESİNDE ilerliyor, x'te
// yalnız 5 cm. Bölüntü ters verilseydi halka gövdenin kavisini takip edemez
// ve yüzeyin içine girip kaybolurdu (otobüste ölçülmüş tuzak).
(function () {
    const b = [];
    for (const s of [1, -1]) {
        b.push([15.000, 17.620, s * wYuk(15.000, 4.085), s * wYuk(15.000, 4.041),
                0, s * wYuk(17.620, 4.000), s * wYuk(17.620, 3.956)]);
    }
    yuzeyYama('burun_derz', b, 26, 1, 0.012, C_KAPI, { metal: 0.2, rough: 0.6 });
    yuzeyYama('radom_derz', [[17.905, 17.955, -0.840, 0.840]],
              1, 56, 0.012, C_KAPI, { metal: 0.2, rough: 0.6 });
})();

// ===========================================================================
// 7. KANAT PROFİLİ
// ===========================================================================
// NACA dört haneli kalınlık dağılımı + basit kamber çizgisi. Elips kesit
// denendi ve bırakıldı: elipsin hücum kenarı da firar kenarı kadar küt,
// kanat yandan bakışta yassı bir levhaya düşüyordu. Gerçek kanat profili
// önde yuvarlak, arkada sivridir ve uçağı uçak yapan şey de budur.
const KAMBER = 0.020, KAMBER_P = 0.40;
function profilKalinlik(u, tc) {
    return 5 * tc * (0.2969 * Math.sqrt(u) - 0.1260 * u - 0.3516 * u * u
                   + 0.2843 * u * u * u - 0.1015 * u * u * u * u);
}
function profilKamber(u) {
    if (u < KAMBER_P) return KAMBER / (KAMBER_P * KAMBER_P) * (2 * KAMBER_P * u - u * u);
    const q = 1 - KAMBER_P;
    return KAMBER / (q * q) * ((1 - 2 * KAMBER_P) + 2 * KAMBER_P * u - u * u);
}
// Halka: üst yüzey hücum→firar, sonra alt yüzey firar→hücum. Kosinüs
// örneklemesi hücum kenarında sıklaştırıyor (orada eğrilik en yüksek).
const KN = 10;                      // yüzey başına örnek → halka 2·KN−2 = 18
function profilHalka(K, yerlestir, simetrik) {
    const pts = [];
    const kam = simetrik ? function () { return 0; } : profilKamber;
    for (let i = 0; i < KN; i++) {
        const u = (1 - Math.cos(Math.PI * i / (KN - 1))) / 2;
        pts.push(yerlestir(u, kam(u) + profilKalinlik(u, K.tc)));
    }
    for (let i = KN - 2; i >= 1; i--) {
        const u = (1 - Math.cos(Math.PI * i / (KN - 1))) / 2;
        pts.push(yerlestir(u, kam(u) - profilKalinlik(u, K.tc)));
    }
    return pts;
}
// Yatay taşıyıcı yüzey (kanat, yatay stabilizatör): açıklık z boyunca.
// `fi` kesitin x ekseni etrafında dönmesi — winglet'e KAVİSLE geçmek için.
function yatayHalka(K) {
    const c = Math.cos(K.fi || 0), s = Math.sin(K.fi || 0);
    const kiris = K.xle - K.te;
    return profilHalka({ tc: K.tc }, function (u, t) {
        return [K.xle - u * kiris,
                K.y + t * kiris * c,
                K.z + t * kiris * s];
    }, K.simetrik);
}
// Düşey yüzey (dikey kuyruk, motor pilonu): açıklık y boyunca.
function duseyHalka(K) {
    const kiris = K.xle - K.te;
    return profilHalka({ tc: K.tc }, function (u, t) {
        return [K.xle - u * kiris, K.y, (K.z || 0) + t * kiris];
    }, true);
}

// ===========================================================================
// 8. KANAT (winglet'e KAVİSLE bağlanan tek kabuk)
// ===========================================================================
// Kanat gövdenin İÇİNDEN geçen TEK bir loft: z = −17.90'dan +17.90'a. İki
// ayrı kanat yapmak denenmedi, çünkü kök kesitinin gövde içinde birleşmesi
// gerekiyor; tek kabuk hem o sorunu hem de aynalanan yarıda sarımın ters
// dönmesini kökünden kaldırıyor.
//
// WINGLET AYRI PARÇA DEĞİL: son beş kesit x ekseni etrafında 0°'den 88°'ye
// dönüyor, yani kanat ucu yukarı KIVRILIYOR (blended winglet). Ayrı bir
// dikey kanatçık denendi ve bırakıldı — kanat ucu kapağı ile winglet kökü
// kapağı dik açıyla çakışıyor, birleşme yerinde kesik bir omuz kalıyordu.
//
// Hücum kenarı: xle = 3.40 − 0.4877·|z| (TAM 26°). Firar kenarı içeride
// neredeyse düz (flap bölgesi), 6.40'taki kırıktan sonra süpürülüyor —
// yolcu uçağı kanadının plan görünüşündeki imza kırığı budur.
const KANAT_YARIM = [
    { z:  0.00, xle:  3.400, te: -4.200, tc: 0.150, fi: 0 },
    { z:  1.98, xle:  2.434, te: -4.340, tc: 0.145, fi: 0 },
    { z:  3.60, xle:  1.644, te: -4.450, tc: 0.140, fi: 0 },
    { z:  6.40, xle:  0.279, te: -4.620, tc: 0.126, fi: 0 },   // firar kırığı
    { z:  9.60, xle: -1.282, te: -5.100, tc: 0.119, fi: 0 },
    { z: 12.80, xle: -2.843, te: -5.620, tc: 0.113, fi: 0 },
    { z: 15.60, xle: -4.208, te: -6.200, tc: 0.108, fi: 0 },
    { z: 17.30, xle: -5.037, te: -6.640, tc: 0.105, fi: 0 },   // düz kanadın ucu
    { z: 17.60, xle: -5.250, te: -6.760, tc: 0.104, fi: 0.44 },
    { z: 17.74, xle: -5.520, te: -6.860, tc: 0.102, fi: 0.96 },
    { z: 17.80, xle: -5.860, te: -6.960, tc: 0.098, fi: 1.36 },
    { z: 17.84, xle: -6.200, te: -7.030, tc: 0.094, fi: 1.50 },
    { z: 17.86, xle: -6.520, te: -7.100, tc: 0.090, fi: 1.54 }
];
// ⚠️ WINGLET KESİTLERİNİN z'Sİ AÇIKLIK DEĞİL, KESİT MERKEZİ. Kesit dikleştikçe
// (fi → 90°) profilin kalınlığı z'ye düşüyor, yani dış yüzey merkezden
// kalınlık kadar DAHA DIŞARIDA. İlk kurulumda merkezler 17.90'a yazılmıştı ve
// ölçülen açıklık 35.908 çıktı (kabul ölçütü 35.80). Merkezler kalınlık
// kadar içeri çekildi, ölçülen açıklık 35.793 oldu.
// Winglet kesitlerinin YÜKSEKLİĞİ dihedral çizgisinden AYRI: kanat ucundan
// sonra kesit merkezi yukarı tırmanıyor.
const WINGLET_Y = [null, null, null, null, null, null, null,
                   null, 3.95, 4.40, 5.05, 5.65, 6.20];
(function kanatKur() {
    const kesitler = [];
    for (const K of KANAT_YARIM) {
        const y = WINGLET_Y[KANAT_YARIM.indexOf(K)];
        kesitler.push({ z: K.z, xle: K.xle, te: K.te, tc: K.tc, fi: K.fi,
                        y: y != null ? y : KANAT_Y0 + DIHEDRAL * K.z });
    }
    // Tam kanat: sol yarı (aynalanmış, ters sırada) + sağ yarı.
    const tam = [];
    for (let i = kesitler.length - 1; i >= 1; i--) {
        const K = kesitler[i];
        tam.push({ z: -K.z, xle: K.xle, te: K.te, tc: K.tc, y: K.y, fi: -K.fi });
    }
    for (const K of kesitler) tam.push(K);
    loftKur('kanat', tam.map(yatayHalka), C_KANAT, { metal: 0.22, rough: 0.80 });
})();

// ---- kanat üstü panel çizgileri ------------------------------------------
// Üstten bakış haritanın ANA bakışı; boş bırakılan kanat üstü 100 m²'lik düz
// bir levha oluyor. Gerçek kanadın üstünde görünen iki çizgi var: spoiler
// önü ve flap/aileron ayrımı. İkisi de kirişin sabit bir oranında.
// ⚠️ Çizgiler kanat YÜZEYİNE oturuyor (profil fonksiyonundan yeniden
// örneklenip 2.5 cm yukarı ötelenerek), düz levha olarak değil: kanat
// dihedralli ve burulmalı, düz levha uçta havada kalırdı.
function kanatSerit(ad, u1, u2, renk) {
    const P = [], IDX = [];
    const list = KANAT_YARIM.filter(function (K) { return K.fi === 0; });
    for (const yon of [1, -1]) {
        const taban = P.length / 3;
        for (let i = 0; i < list.length; i++) {
            const K = list[i], kiris = K.xle - K.te;
            const y = KANAT_Y0 + DIHEDRAL * K.z;
            for (const u of [u1, u2]) {
                const t = profilKamber(u) + profilKalinlik(u, K.tc);
                P.push(K.xle - u * kiris, y + t * kiris + 0.025, yon * K.z);
            }
        }
        for (let i = 0; i < list.length - 1; i++) {
            const a = taban + i * 2;
            IDX.push(a, a + 2, a + 3, a, a + 3, a + 1);
        }
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.Float32BufferAttribute(P, 3));
    geo.setIndex(IDX);
    geo.computeVertexNormals();
    const m = mesh(geo, renk, { metal: 0.2, rough: 0.6, name: ad });
    m.material.side = THREE.DoubleSide;
    m.castShadow = false;
    modelGroup.add(m);
}
kanatSerit('kanat_spoiler', 0.575, 0.605, C_PANEL);
kanatSerit('kanat_flap', 0.735, 0.765, C_PANEL);

// ---- flap rayı kılıfları --------------------------------------------------
// Kanadın firar kenarının ALTINDAN geriye taşan üç kılıf (yan yan). Yolcu
// uçağını üstten bakışta askeri uçaktan ayıran en ucuz işaret: firar kenarı
// düz değil, üç çıkıntıyla tırtıklı. Küre ölçeklenerek yapıldı (mekik biçimi);
// silindir denendi ve bırakıldı, ucu küt kalıyordu.
[[3.60, 0.62], [6.90, 0.55], [10.60, 0.48]].forEach(function (a, k) {
    const zz = a[0], boy = a[1];
    [1, -1].forEach(function (s, i) {
        // kılıfın oturduğu firar kenarı noktası (kesitler arasında lineer)
        let te = 0, y = 0;
        for (let j = 0; j < KANAT_YARIM.length - 1; j++) {
            const A = KANAT_YARIM[j], B = KANAT_YARIM[j + 1];
            if (zz >= A.z && zz <= B.z) {
                const t = (zz - A.z) / (B.z - A.z);
                te = A.te + (B.te - A.te) * t;
                y = KANAT_Y0 + DIHEDRAL * zz;
            }
        }
        const g = new THREE.SphereGeometry(1, 9, 6);
        g.scale(boy * 2.6, boy * 0.42, boy * 0.42);
        g.translate(te + boy * 1.5, y - 0.16, s * zz);
        modelGroup.add(mesh(g, C_KANAT, { metal: 0.2, rough: 0.62,
                                          name: 'flap_kilif_' + (k * 2 + i + 1) }));
    });
});

// ---- kanat ucu seyir fenerleri -------------------------------------------
// Sol kırmızı, sağ yeşil (gerçek kural: sol=port=kırmızı). Model +z SOL yan
// (burun +x, üst +y → sağ el üçlüsü). Yalnız yakın planda okunur, ama uçağın
// sivil olduğunu söyleyen küçük işaretlerden biri.
[[1, C_KIRMIZI], [-1, C_YESIL]].forEach(function (a, i) {
    const g = new THREE.SphereGeometry(0.16, 7, 5);
    g.scale(1.5, 0.7, 0.8);
    g.translate(-5.20, 3.90, a[0] * 17.42);
    modelGroup.add(mesh(g, a[1], { metal: 0.1, rough: 0.35,
                                   name: 'fener_' + (i + 1) }));
});

// ===========================================================================
// 9. KUYRUK
// ===========================================================================
// KLASİK kuyruk, T DEĞİL: yatay stabilizatörler kuyruk konisinin İÇİNDEN
// geçiyor, dikey kuyruk sırtın üstünde. T kuyruk (yatay yüzeyler dikeyin
// tepesinde) bölgesel jet / iş jeti işaretidir; A320-737 sınıfı klasiktir.
//
// DİKEY KUYRUK: kök y=4.60'ta, yani gövdenin İÇİNDE başlıyor (gövde sırtı
// x=−13'te 5.95). Kökü sırtın üstünde başlatmak denendi ve bırakıldı:
// kuyruk konisi yukarı kıvrıldığı için kök çizgisi ile sırt çizgisi tutmuyor,
// arada boşluk kalıyordu. Gömmek hem ucuz hem doğru.
const DIKEY_KESIT = [
    { y:  4.60, xle:  -9.30, te: -17.30, tc: 0.130 },
    { y:  5.60, xle:  -9.90, te: -17.45, tc: 0.120 },
    { y:  7.20, xle: -11.20, te: -17.70, tc: 0.110 },
    { y:  9.00, xle: -12.70, te: -17.95, tc: 0.100 },
    { y: 10.60, xle: -14.10, te: -18.15, tc: 0.095 },
    { y: 11.45, xle: -14.90, te: -18.22, tc: 0.090 },
    { y: 11.72, xle: -15.20, te: -18.18, tc: 0.070 },
    { y: 11.80, xle: -15.45, te: -18.05, tc: 0.050 }
];
loftKur('kuyruk_dikey', DIKEY_KESIT.map(duseyHalka), C_KUYRUK,
        { metal: 0.2, rough: 0.6 });

// ⚠️ DORSAL (sırt dolgusu) DENENDİ VE KALDIRILDI. Gerekçesi ölçüm: kuyruk
// konisi yukarı kıvrıldığı için gövdenin sırtı x=−9.9'da 5.64'e çıkıyor,
// dikey kuyruğun hücum kenarı ise aynı x'te y=5.60 — yani kuyruk gövdeden
// zaten 4 cm farkla, kendiliğinden çıkıyor. Dolgunun dolduracağı boşluk yok;
// eklenen parça yalnız x −10..−14 arasında görünüp öncesinde gövdenin içinde
// kayboluyordu, yani sırtta ortadan başlayan bir kabartı gibi duruyordu.

// YATAY STABİLİZATÖR: kanatla aynı makine, tek kabuk, gövdenin içinden geçer.
// Kirişleri kanadınkinin yarısından küçük; ok açısı 25°, dihedral 6°.
(function () {
    const yarim = [
        { z: 0.00, xle: -13.40, te: -17.30, tc: 0.105, y: 4.95 },
        { z: 1.20, xle: -13.72, te: -17.36, tc: 0.102, y: 5.07 },
        { z: 3.00, xle: -14.42, te: -17.55, tc: 0.100, y: 5.26 },
        { z: 5.00, xle: -15.51, te: -17.82, tc: 0.098, y: 5.47 },
        { z: 6.22, xle: -16.28, te: -18.02, tc: 0.095, y: 5.60 }
    ];
    const tam = [];
    for (let i = yarim.length - 1; i >= 1; i--) {
        const K = yarim[i];
        tam.push({ z: -K.z, xle: K.xle, te: K.te, tc: K.tc, y: K.y, simetrik: true });
    }
    for (const K of yarim) tam.push({ z: K.z, xle: K.xle, te: K.te, tc: K.tc,
                                      y: K.y, simetrik: true });
    loftKur('kuyruk_yatay', tam.map(yatayHalka), C_KANAT, { metal: 0.22, rough: 0.80 });
})();

// APU EGZOZU: kuyruk konisinin tam ucundaki koyu delik. Yolcu uçağının
// kuyruğu sivri bitmez, kesik bir boru ile biter — bu 30 cm'lik koyu daire
// silüeti askeri uçaktan ayıran ayrıntılardan biri.
// ⚠️ x −18.80'i GEÇMEMELİ: kutu ölçüsü (37.60) modelin en uzun kenarı ve
// `sizeKm` onu okuyor. Merkez −18.60, boy 0.40 → tam −18.80'de bitiyor.
(function () {
    const g = new THREE.CylinderGeometry(0.24, 0.30, 0.40, 12, 1, true);
    g.rotateZ(Math.PI / 2);
    g.translate(-18.60, YC(-18.60), 0);
    const m = mesh(g, C_GOBEK, { metal: 0.3, rough: 0.5, name: 'apu' });
    m.material.side = THREE.DoubleSide;
    modelGroup.add(m);
})();

// ===========================================================================
// 10. MOTORLAR
// ===========================================================================
// Kısa ve GENİŞ turbofan (CFM56 sınıfı): kaporta çapı 2.48 m, boy 4.30 m,
// yani boy/çap = 1.7. Askeri jet motoru uzun ve incedir (oran 5+); bu oran
// tek başına "yolcu uçağı" diyor.
//
// LatheGeometry kullanıldı, loft değil: kaporta tam bir dönel yüzey ve
// profili elle yazmak (ağız dudağı içeri kıvrılıyor) loft halkalarından
// kısa. Kaporta ile hava girişi AYRI iki lathe: biri açık gri dış kabuk,
// öbürü koyu iç boğaz. Tek parça olsaydı ağız koyu olamazdı.
//
// ⚠️ rotateZ(−π/2) lathe'in ekseni olan +y'yi model +x'ine taşıyor
// ((x,y) → (y,−x)). Dönel yüzey eksene göre simetrik olduğu için radyal
// yönün nereye düştüğü önemsiz.
function lathe(ad, profil, renk, x, y, z, opts) {
    const pts = profil.map(function (p) { return new THREE.Vector2(p[0], p[1]); });
    const geo = new THREE.LatheGeometry(pts, 20);
    geo.rotateZ(-Math.PI / 2);
    geo.translate(x, y, z);
    const m = mesh(geo, renk, opts || { metal: 0.25, rough: 0.5 });
    m.name = ad;
    m.material.side = THREE.DoubleSide;
    modelGroup.add(m);
    return m;
}
// Fan diski: TEK geometride 14 düz kanat + göbek halkası. Kutu kanat denendi
// ve bırakıldı — 14 kutu = 14 mesh ya da elle birleştirme, oysa fan yalnız
// eksen doğrultusundan (hava girişinden) görülüyor ve orada düz kanat ile
// kutu kanat arasında fark yok. Kanatlar hatveli (0.55 rad) ki dönerken
// ışığı farklı yakalasınlar.
function fanDiski(r1, r2, n, hatve) {
    const P = [], IDX = [];
    for (let i = 0; i < n; i++) {
        const a = i * Math.PI * 2 / n, c = Math.cos(a), s = Math.sin(a);
        const gen = 0.5 * Math.sin(hatve), der = 0.5 * Math.cos(hatve);
        // Kanat dörtgeni: kökte dar, uçta geniş; hatve ile x'e eğik.
        const kose = [[-gen * 0.30, r1, -der * 0.30], [gen * 0.30, r1, der * 0.30],
                      [gen * 0.55, r2, der * 0.55], [-gen * 0.55, r2, -der * 0.55]];
        const t = P.length / 3;
        for (const k of kose) P.push(k[0], k[1] * c - k[2] * s, k[1] * s + k[2] * c);
        IDX.push(t, t + 1, t + 2, t, t + 2, t + 3);
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.Float32BufferAttribute(P, 3));
    geo.setIndex(IDX);
    geo.computeVertexNormals();
    return geo;
}
[1, -1].forEach(function (yon, i) {
    const z = yon * MOTOR_Z, n = i + 1;
    // dış kaporta: ağız dudağından (x +2.15) egzoza (x −2.15)
    lathe('motor_' + n, [
        [1.190,  2.150], [1.228,  1.700], [1.240,  0.900], [1.228,  0.000],
        [1.170, -0.900], [1.075, -1.600], [0.980, -2.150]
    ], C_MOTOR, MOTOR_X, MOTOR_Y, z, { metal: 0.28, rough: 0.42 });
    // iç boğaz: dudağın etrafından dönüp geriye
    lathe('motor_agiz_' + n, [
        [1.190,  2.150], [1.120,  2.235], [1.010,  2.230], [0.930,  2.130],
        [0.885,  1.850], [0.870,  1.000], [0.880,  0.000], [0.930, -1.300]
    ], C_MOTOR_IC, MOTOR_X, MOTOR_Y, z, { metal: 0.2, rough: 0.75 });
    // egzoz konisi (sıcak çekirdek çıkışı)
    lathe('motor_egzoz_' + n, [
        [0.560, -1.900], [0.480, -2.400], [0.330, -2.850], [0.120, -3.150]
    ], C_GOBEK, MOTOR_X, MOTOR_Y, z, { metal: 0.35, rough: 0.45 });

    // FAN: spin() grubunun içinde. Eksen 'x' — uçağın ekseni +x.
    // 1650 dev/dak gerçek rölanti hızının çok altı; motor rpm'i doğrudan
    // açıya çeviriyor ve gerçek hızda fan her karede birkaç tur atıp
    // stroboskop etkisiyle DURUYOR gibi görünüyordu (bisiklet aynakolunda
    // öğrenilen ders: göz için doğru hız, gerçek hız değil).
    const fg = spin({ pivot: [MOTOR_X + 1.55, MOTOR_Y, z], axis: 'x', rpm: 220 });
    const fan = mesh(fanDiski(0.20, 0.845, 14, 0.55), C_FAN,
                     { metal: 0.42, rough: 0.32, name: 'fan_' + n });
    fan.material.side = THREE.DoubleSide;
    fg.add(fan);
    const gob = mesh(new THREE.ConeGeometry(0.21, 0.62, 10), C_GOBEK,
                     { metal: 0.4, rough: 0.35, name: 'fan_gobek_' + n });
    gob.rotation.z = -Math.PI / 2;
    gob.position.x = 0.30;
    fg.add(gob);

    // PİLON: motoru kanadın altına bağlayan kısa kulak. İki ucu da GÖMÜLÜ
    // (altta kaportanın, üstte kanadın içinde) — gerçek pilonun görünen
    // kısmı da yalnız aradaki 40 cm'dir.
    loftKur('pilon_' + n, [
        { y: 2.55, xle:  3.55, te: -0.90, tc: 0.16, z: z },
        { y: 2.85, xle:  3.30, te: -1.35, tc: 0.15, z: z },
        { y: 3.10, xle:  2.90, te: -1.60, tc: 0.14, z: z }
    ].map(duseyHalka), C_MOTOR, { metal: 0.25, rough: 0.5 });
});

// ===========================================================================
// 11. KANAT-GÖVDE KARIN KAPLAMASI
// ===========================================================================
// Kanat kökünün gövdeyle birleştiği yeri örten büyük karın. Gerçek uçakta
// iniş takımı yuvası, klima paketleri ve kanat kutusu burada. Görsel işi:
// kanat gövdeye çıplak saplanmasın ve alçak bakışta uçağın altı boş bir tüp
// gibi durmasın. Gövdeden 61 cm geniş (yarı genişlik 2.28 / gövde 1.975) ve
// 62 cm aşağıda biter.
loftKur('karin', [
    [  6.60, 3.30, 0.75, 0.55], [  5.20, 2.95, 1.15, 1.35],
    [  3.20, 2.70, 1.42, 1.95], [  0.50, 2.55, 1.55, 2.28],
    [ -2.60, 2.55, 1.55, 2.28], [ -5.00, 2.70, 1.45, 2.05],
    [ -7.00, 3.00, 1.25, 1.55], [ -8.60, 3.35, 0.85, 0.80]
].map(function (a) {
    const x = a[0], yc = a[1], ry = a[2], rz = a[3], r = [];
    for (let i = 0; i < NV; i++) {
        const th = Math.PI * i / (NV - 1);
        r.push([x, yc - ry * Math.cos(th), rz * Math.sin(th)]);
    }
    for (let i = NV - 2; i >= 1; i--) {
        const th = Math.PI * i / (NV - 1);
        r.push([x, yc - ry * Math.cos(th), -rz * Math.sin(th)]);
    }
    return r;
}), C_KARIN, { metal: 0.15, rough: 0.72 });

// ===========================================================================
// 12. İNİŞ TAKIMI
// ===========================================================================
// ⚠️ HEPSİ 'takim' ADLI TEK GRUPTA. Davranış (registerBehavior) altKm
// eşiğinin üstünde bu grubun visible'ını false yapıyor — takım toplanmış
// oluyor. Yuvaları kapatan gerçek kapaklar da grubun içinde: takım
// kalkarken kapaklar da kalkmalı, yoksa havada duran uçağın altında dört
// levha kalırdı.
// ⚠️ AMA KAPAKLAR ARTIK 'takim'İN DOĞRUDAN ÇOCUĞU DEĞİL: her biri kendi
// menteşe grubunda (kapak_burun_1/2, kapak_ana_1/2). Eskiden doğrudan
// çocuktular ve hiç dönmüyorlardı; grup gizlenince tek karede yok
// oluyorlardı. Gerekçe ve sayılar aşağıda K_BURUN_* bloğunda.
//
// ⚠️ TEKERLER GRUBUN İÇİNDE OLABİLİR: motorun `_WHEELS.front` mekanizması
// parçayı KENDİ steer grubuna taşıyor ve bunu yaparken `inner.add(sg)`
// diyor — o yüzden direksiyon kıran tekerler modelGroup'un DOĞRUDAN çocuğu
// olmak zorunda. Uçakta `front` YOK (burun tekeri de yalnız yuvarlanıyor),
// bu yüzden tekerler rahatça 'takim' grubunun altında durabiliyor ve
// grup gizlenince onlar da gizleniyor.
const takim = new THREE.Group();
takim.name = 'takim';
modelGroup.add(takim);

// ---- TOPLANMA MEKANİZMASI (pivot-ofset ikilisi) ---------------------------
// ⚠️ Takım eskiden TEK düz gruptu ve davranış onu `visible = false` ile bir
// karede yok ediyordu — Yusuf: "Uçak tekerleri aniden aç kapa yapıyor."
// Toplanmanın bir SÜREYE yayılabilmesi için bacakların kendi menteşesi
// olması şart; bir grubu kendi ekseninde döndürmenin tek yolu grubun
// konumunu MENTEŞEYE koyup çocukları menteşeye göre yazmak (bisiklette ve
// trende kullanılan aynı pivot-ofset ikilisi).
//
// GERÇEK A320 KİNEMATİĞİ:
//   * burun takımı ÖNE toplanır  → menteşe z ekseni, bacağın gövdeye
//     bağlandığı nokta (BURUN_X-0.06, 1.82)
//   * ana takım İÇERİ toplanır   → menteşe x ekseni, bacağın kanat arka
//     kirişine bağlandığı nokta (2.05, ±TAKIM_UST_Z); tekerler karın
//     kaplamasının içine giriyor. Kanat 0.5 m'den ince olduğu için gerçek
//     A320'de de tekerler kanada değil KARNA toplanır.
// Yuva kapakları bilerek DÖNEN GRUPLARIN DIŞINDA: kapak bacakla birlikte
// dönseydi ana kapak kanadın üstüne çıkardı (rel. konumdan hesaplandı,
// 95 derecede y=3.48 — kanat üst yüzeyi 2.9).
function takimGrup(ad, px, py, pz) {
    const g = new THREE.Group();
    g.name = ad;
    g.position.set(px, py, pz);
    takim.add(g);
    g.userData.ekle = function (m, x, y, z) {
        m.position.set(x - px, y - py, z - pz);
        g.add(m);
        return m;
    };
    return g;
}
// ---- YUVA KAPAKLARININ MENTEŞESİ -----------------------------------------
// ⚠️ KAPAK BACAKLA BİRLİKTE DÖNMEZ, KENDİ MENTEŞESİ VAR. Bacaklar üç ayrı
// menteşe grubunda toplanıyor (yukarıda); kapaklar o gruplardan BAĞIMSIZ,
// çünkü kapak bacakla dönseydi ana kapak kanadın üstüne çıkardı (95°'de
// y=3.48, kanat üst yüzeyi 2.90 — hesaplandı).
//
// KURULUM DURUŞU = KAPALI DURUŞ. Kapak menteşesi kapağın DIŞ kenarında;
// mesh menteşeden İÇERİ uzanıyor, yani menteşe açısı KÜÇÜLDÜKÇE kapağın iç
// kenarı aşağı iniyor (kapak açılıyor). Menteşe konumları, kapağın kurulum
// duruşundaki dış kenarının tam yeri:
//     dış kenar = merkez + Rx(s·açı)·(0, 0, s·yarıDerinlik)
// Sayılar buradan çıktı; kurulum karesinde kapağın dünya konumu ESKİSİYLE
// BİREBİR aynı (ölçüldü: 0.000000 m).
const K_BURUN_Y = 1.374, K_BURUN_Z = 0.6774, K_BURUN_ACI = 0.42;
const K_ANA_Y   = 1.487, K_ANA_Z   = 2.4799, K_ANA_ACI   = 0.30;
// Geçiş sırasında kapağın AÇILMA genliği (rad). Menteşeye eklenir, işaret
// tarafa göre. ⚠️ GENLİK AÇISAL HIZ TAVANINDAN geldi, gözden değil:
// 0.61/0.55 ile ölçülen en büyük hız 247 deg/sn idi ve bu bacakların
// kendi hızını (burun 200, ana 225 deg/sn) AŞIYORDU. 0.52/0.47 +
// motordaki daha geniş zaman profili ile 197 deg/sn'ye indi.
const K_BURUN_ACILMA = 0.52, K_ANA_ACILMA = 0.47;
const TAKIM_UST_Z = 3.45;        // bacağın gövdeye bağlandığı z (aks 3.80)
const T_BURUN = takimGrup('takim_burun', BURUN_X - 0.06, 1.82, 0);
const T_ANA = [1, -1].map(function (s, i) {
    return takimGrup('takim_ana_' + (i + 1), TAKIM_X, 2.05, s * TAKIM_UST_Z);
});

function tekerlek(hedef, ad, x, y, z, R, genislik) {
    const g = new THREE.Group();
    g.name = ad;
    g.rotation.x = Math.PI / 2;      // aks ±z'ye bakar; rotation.y motorun
    const et = R * 0.30;             // lastik kesiti (uçak lastiği YÜKSEK yanaklı)
    const lastik = new THREE.TorusGeometry(R - et, et, 5, 14);
    lastik.rotateX(Math.PI / 2);
    lastik.scale(1, genislik / (et * 2), 1);
    g.add(mesh(lastik, C_LASTIK, { rough: 0.95, name: ad + '_lastik' }));
    const jant = mesh(new THREE.CylinderGeometry(R - et * 1.9, R - et * 1.9,
                                                 genislik * 0.92, 12),
                      C_JANT, { metal: 0.4, rough: 0.4, name: ad + '_jant' });
    g.add(jant);
    hedef.userData.ekle(g, x, y, z);
}

// ---- burun takımı ---------------------------------------------------------
// İKİZ teker (gerçek A320 burun takımı da ikizdir), bacak öne eğik.
(function () {
    const b = mesh(new THREE.CylinderGeometry(0.115, 0.135, 1.45, 9),
                   C_BACAK, { metal: 0.45, rough: 0.3, name: 'burun_bacak' });
    b.rotation.z = 0.06;
    T_BURUN.userData.ekle(b, BURUN_X - 0.06, 1.10, 0);
    // makas (torsiyon kolu) — bacağı çıplak boru olmaktan çıkarır
    const mk = mesh(new THREE.BoxGeometry(0.10, 0.52, 0.07), C_BACAK,
                    { metal: 0.4, rough: 0.35, name: 'burun_makas' });
    mk.rotation.z = 0.55;
    T_BURUN.userData.ekle(mk, BURUN_X + 0.20, 0.72, 0);
    // aks
    const ak = mesh(new THREE.CylinderGeometry(0.075, 0.075, 0.72, 8), C_BACAK,
                    { metal: 0.45, rough: 0.3, name: 'burun_aks' });
    ak.rotation.x = Math.PI / 2;
    T_BURUN.userData.ekle(ak, BURUN_X, R_BURUN_T, 0);
    tekerlek(T_BURUN, 'teker_on_1', BURUN_X, R_BURUN_T,  0.235, R_BURUN_T, 0.26);
    tekerlek(T_BURUN, 'teker_on_2', BURUN_X, R_BURUN_T, -0.235, R_BURUN_T, 0.26);
    // Yuva kapakları: yuvanın iki yanında, gövdeye yatık. y gövdenin ALT
    // kenarının altında (x=13.5'te gövde dibi 1.63) — 1.72'de kalsaydı
    // gövdenin İÇİNDE kalır, hiç görünmezdi.
    // ⚠️ KAPAK ARTIK KENDİ MENTEŞESİNDE (kapak_burun_1/2). Eskiden kapaklar
    // doğrudan `takim`in çocuğuydu ve HİÇ dönmüyordu: bacaklar bir süreye
    // yayılarak toplanırken kapaklar sabit kalıyor, sonra grup gizlenince
    // TEK KAREDE yok oluyorlardı — Yusuf: "uçak kapağı aniden kapanıyor".
    // Menteşe kapağın DIŞ kenarında; kapak mesh'i menteşeden İÇERİ uzanıyor,
    // yani dönme kapağı yuvanın üstüne kapatıyor (gerçek A320 kinematiği).
    [1, -1].forEach(function (s, i) {
        const men = new THREE.Group();
        men.name = 'kapak_burun_' + (i + 1);
        men.position.set(BURUN_X - 0.10, K_BURUN_Y, s * K_BURUN_Z);
        men.rotation.x = s * K_BURUN_ACI;      // KAPALI = kurulum duruşu
        men.userData.kapakAci = -s * K_BURUN_ACILMA;   // tam açıkta eklenecek
        takim.add(men);
        const k = mesh(new THREE.BoxGeometry(1.90, 0.045, 0.52), C_KARIN,
                       { metal: 0.15, rough: 0.7, name: 'burun_kapak_' + (i + 1) });
        k.position.set(0, 0, -s * 0.26);       // menteşeden İÇERİ
        men.add(k);
    });
})();

// ---- ana takım ------------------------------------------------------------
// İki bacak, her birinde İKİZ teker. Bacak dışa doğru hafif eğik (üstte
// ±3.15, akslarda ±3.80): gerçek takım da gövdeye yakın bağlanıp dışa açılır.
[1, -1].forEach(function (s, i) {
    const ust = 2.05, alt = R_TEKER;
    const dz = TAKIM_Z - TAKIM_UST_Z;
    const boy = Math.sqrt((ust - alt) * (ust - alt) + dz * dz);
    const b = mesh(new THREE.CylinderGeometry(0.135, 0.165, boy, 9), C_BACAK,
                   { metal: 0.45, rough: 0.3, name: 'ana_bacak_' + (i + 1) });
    b.rotation.x = -s * Math.atan2(dz, ust - alt);
    T_ANA[i].userData.ekle(b, TAKIM_X, (ust + alt) / 2,
                           s * (TAKIM_UST_Z + TAKIM_Z) / 2);
    // yan destek (drag strut) — öne doğru
    const d = mesh(new THREE.CylinderGeometry(0.075, 0.075, 1.35, 7), C_BACAK,
                   { metal: 0.4, rough: 0.35, name: 'ana_destek_' + (i + 1) });
    d.rotation.z = 0.85;
    T_ANA[i].userData.ekle(d, TAKIM_X + 0.55, 1.42, s * 3.55);
    // aks
    const ak = mesh(new THREE.CylinderGeometry(0.095, 0.095, 1.05, 8), C_BACAK,
                    { metal: 0.45, rough: 0.3, name: 'ana_aks_' + (i + 1) });
    ak.rotation.x = Math.PI / 2;
    T_ANA[i].userData.ekle(ak, TAKIM_X, R_TEKER, s * TAKIM_Z);
    tekerlek(T_ANA[i], 'teker_arka_' + (i * 2 + 1), TAKIM_X, R_TEKER,
             s * (TAKIM_Z - 0.27), R_TEKER, 0.40);
    tekerlek(T_ANA[i], 'teker_arka_' + (i * 2 + 2), TAKIM_X, R_TEKER,
             s * (TAKIM_Z + 0.27), R_TEKER, 0.40);
    // Yuva kapağı. z ±2.05: karının o yükseklikteki (1.62) yüzeyi ±1.82'de,
    // yani kapağın iç kenarı karının içinde, dış kenarı dışarıda kalıyor —
    // kapak karına BAĞLI görünüyor. ±2.55'te havada duruyordu.
    // ⚠️ Menteşe kapağın DIŞ kenarında (gerekçe yukarıda, K_ANA_*).
    const men = new THREE.Group();
    men.name = 'kapak_ana_' + (i + 1);
    men.position.set(TAKIM_X - 0.05, K_ANA_Y, s * K_ANA_Z);
    men.rotation.x = s * K_ANA_ACI;            // KAPALI = kurulum duruşu
    men.userData.kapakAci = -s * K_ANA_ACILMA;
    takim.add(men);
    const k = mesh(new THREE.BoxGeometry(2.30, 0.05, 0.90), C_KARIN,
                   { metal: 0.15, rough: 0.7, name: 'ana_kapak_' + (i + 1) });
    k.position.set(0, 0, -s * 0.45);           // menteşeden İÇERİ
    men.add(k);
});

// ===========================================================================
// 13. KÜÇÜK PARÇALAR
// ===========================================================================
// Sırt antenleri: gövde sırtındaki iki bıçak anten + karında bir tane.
// Tepe bakışında gövdenin düz sırtına ölçek veren tek şey.
[[8.20, 1], [-4.60, 1], [2.00, -1]].forEach(function (a, i) {
    const x = a[0], yon = a[1];
    const sh = new THREE.Shape();
    sh.moveTo(-0.34, 0); sh.lineTo(0.30, 0); sh.lineTo(0.12, 0.34);
    sh.lineTo(-0.20, 0.30); sh.closePath();
    const g = new THREE.ExtrudeGeometry(sh, { depth: 0.05, bevelEnabled: false });
    g.translate(0, 0, -0.025);
    if (yon < 0) g.rotateX(Math.PI);
    g.translate(x, yon > 0 ? YC(x) + R_GOV(x) - 0.03 : YC(x) - R_GOV(x) + 0.03, 0);
    modelGroup.add(mesh(g, C_KARIN, { metal: 0.25, rough: 0.55,
                                      name: 'anten_' + (i + 1) }));
});

// Karın kaplamasının yanağındaki klima paketi kabartısı. z ±2.05: karının
// o yükseklikteki (2.05) yüzeyi ±2.16'da, yani tümsek 31 cm dışarı taşıyor.
// ±1.72'de kurulduğunda tamamen karının İÇİNDE kalıyor, hiç görünmüyordu.
[1, -1].forEach(function (s, i) {
    const g = new THREE.SphereGeometry(1, 8, 6);
    g.scale(1.90, 0.30, 0.42);
    g.translate(-1.40, 2.05, s * 2.05);
    modelGroup.add(mesh(g, C_KARIN, { metal: 0.15, rough: 0.7,
                                      name: 'paket_' + (i + 1) }));
});
