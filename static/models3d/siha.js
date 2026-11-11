// SİHA — silahlı insansız hava aracı (Bayraktar TB2 sınıfı, orta irtifa,
// uzun havada kalışlı, itici pervaneli taktik İHA). Modern Warfare grubunun
// sekizinci modeli.
//
// KÜTÜPHANEDE ZATEN UÇAN ASKERİ ŞEYLER VAR. Bu modelin işi, tepeden bakışta
// (haritanın ana bakışı) hiçbiriyle karışmamak. Silueti kuran dört şey, önem
// sırasıyla:
//   1. İNCE, UZUN, DÜZ KANAT. Açıklık 12.00, kanat alanı 8.892 m² (kesit
//      tablosunun trapez toplamı) → KANAT EN-BOY ORANI 16.19. Hücum kenarı
//      boydan boya neredeyse düz: 1.050° geriye.
//      ⚠️ TEPEDEN AYRIMI ÖLÇÜLDÜ (siha_tepe_kiyas.py, ortografik tepe
//      bakışı, siluet pikseli sayılarak):
//        model         kutu x·z      siluet    siluet en-boy   doluluk
//        siha          6.50 x 12.00  13.10 m²     10.99         0.168
//        avci-ucagi   15.09 x 10.00  51.52 m²      1.94         0.341
//        savas-ucagi   6.50 x  4.42   9.91 m²      1.97         0.345
//      Siluet en-boy oranı 5.6 KAT, doluluk 2.0 kat farklı. (Siluet oranı
//      kanat oranından küçük çünkü siluete gövde, kirişler, kuyruk ve
//      mühimmat da giriyor.)
//   2. TERS V (Λ) KUYRUK, İKİ KUYRUK KİRİŞİNİN ÜSTÜNDE. Kirişler kanadın
//      altından geriye uzanıyor, kuyruk yüzeyleri onlardan yukarı-içeri
//      gelip tepede birleşiyor. Yatayla 46.7° (aşağıda türetildi).
//   3. ARKADA İTİCİ PERVANE, kirişlerin ARASINDA. İki pal, spin() ile döner.
//   4. BURUNDA KÜRESEL ELEKTRO-OPTİK TARET, gövdenin altına asılı.
// Beşincisi: SABİT İNİŞ TAKIMI. Yolcu uçağından farkı bu — takım hiçbir
// zaman toplanmıyor, davranışta o dal HİÇ YOK.
//
// GERÇEK ÖLÇÜLER (üreticinin kendi teknik tablosundan, baykartech.com;
// Wikipedia ve army-technology.com ile karşılaştırıldı):
//   kanat açıklığı 12.00 m · uzunluk 6.4-6.5 m · yükseklik 2.20 m
//   azami kalkış ağırlığı 700 kg · faydalı yük 150 kg · motor 100 hp
//   iki palli DEĞİŞKEN HATVELİ pervane, İTİCİ (pusher) yerleşim
//   ters V kuyruk, iki kuyruk kirişi arasında motor
//   sabit üç tekerli (tricycle) iniş takımı — havada TOPLANMAZ
//   dört istasyon; MAM sınıfı hafif akıllı mühimmat
// ⚠️ militaryfactory.com "uzunluk 11.20 m" diyor; üreticinin kendi tablosu
// ve Wikipedia 6.4/6.5 m diyor. Üretici esas alındı.
//
// KUTU (ÖLÇÜLDÜ, ucgen_say.js): x 6.500 · y 2.200 · z 12.000.
// `sizeKm` max(box.x, box.z)'a bakıyor → burada z HÂKİM (12.000). Yolcu
// uçağında x hâkimdi; davranıştaki bütün "kendi boyu" oranları bu yüzden
// AÇIKLIĞA göre okunur, uzunluğa göre değil.
//
// YÖN: burun +x, üst +y, sol kanat +z. Taban y=0 (lastiklerin değdiği yer).
//
// PARÇALAR (Studio3D bu adları arar, DEĞİŞTİRME):
//   govde        → RENK ALIR (_TINT), varsayılan '#b6b4a7'
//   pal_1 / pal_2→ spin() grubunun içindeki pervane palleri (axis 'x')
// ⚠️ 'takim' ADLI GRUP YOK ve OLMAYACAK. Yolcu uçağında o grubun varlığı
// davranışa "havada gizle" hakkı veriyor; SİHA'nın takımı sabit.
//
// ⚠️ YAZI YOK ve ASİMETRİK PARÇA YOK. Harita modeli soldan sağa AYNALIYOR
// (ölçülmüş tuzak, det(projection) < 0). Taret gövde merkez çizgisinde,
// mühimmat iki kanatta simetrik: aynalama modeli hiç değiştirmiyor
// (ayna_probu.py ile ölçüldü).

// ===========================================================================
// 0. RENKLER
// ===========================================================================
// ⚠️ AÇIK RENK PATLAMASI — GÖZ KARARI DEĞİL, ÖLÇÜLDÜ. TB2 açık gri-bej
// boyalıdır ve bu, ölçülmüş tuzağın tam ortası: sahnede environment map yok,
// difüz bileşen albedo·(1−metalness), yani metalness'i DÜŞÜRMEK açık gövdede
// tam beyaz piksel oranını ARTIRIYOR (uçakta ölçüldü: 0.22 → 0.10 yapılınca
// %0.9 → %16.2). Bu yüzden gövde metalness'i 0.22'de tutuldu ve renk
// taranarak seçildi.
//
// ⚠️ ÖLÇÜLEN ŞEY TEK RENK DEĞİL, PALET. İlk tarama yalnız C_GOVDE'yi
// değiştirdi ve dördü de %0.0 tam beyaz verdi (195.4 → 198.0); yanıltıcıydı,
// çünkü TEPE bakışında pikselin çoğu KANAT'tır, gövde değil. Palet bütün
// olarak tarandı (siha_palet_tara.py):
//
//   palet   gövde / kanat        ortalama   PARLAK(L>230)   TAM BEYAZ(>=250)
//   KOYU    #a8a79b / #9b9a8f      195.4        %0.3            %0.0
//   ORTA    #b6b4a7 / #a6a599      209.5        %4.7            %0.0  ← SEÇİLEN
//   AÇIK    #c2c0b2 / #b3b1a4      224.1       %68.7            %0.0
//
// Kıyas: yolcu uçağı (kabul edilmiş) 203.9 / %20.1 / %0.9; motokaravan
// (kabul edilmiş) 203.4 / %58.7 / %0.1. ORTA, kabul edilmiş iki modelle AYNI
// ortalama parlaklıkta, onlardan AZ parlak pikselli ve tam beyazı HİÇ yok.
// AÇIK'ta tam beyaz hâlâ %0.0 ama parlak piksel %68.7'ye fırlıyor: kanadın
// üstündeki kumanda yüzeyi çizgileri o noktada okunmaz oluyor.
const C_GOVDE   = '#b6b4a7';   // _TINT varsayılanı — açık gri-bej
const C_KANAT   = '#a6a599';   // kanat/kuyruk: gövdeden bir tık koyu. Aynı ton
                               // olsaydı tepe bakışında gövde ile kanat tek
                               // levhaya kaynardı (motokaravanda ve uçakta
                               // ölçülmüş aynı tuzak).
const C_KIRIS   = '#9a998e';   // kuyruk kirişleri — kanattan da bir tık koyu
const C_KARIN   = '#96958b';   // kanat-gövde birleşim kaplaması (blended body)
const C_TARET   = '#3a3d42';   // elektro-optik taret küresi (koyu, gövde
                               // rengiyle en yüksek karşıtlığı taşıyan parça:
                               // burun bu leke sayesinde okunuyor)
const C_CAM     = '#111419';   // taret penceresi
const C_PAL     = '#2b2b2c';   // kompozit pervane pali
const C_PAL_UC  = '#c9c6bd';   // pal ucu şeridi (gerçek pervanelerde görünürlük
                               // bandı; dönerken diski okutan tek işaret)
const C_KAPAK   = '#9a998e';   // pervane göbeği kaportası
const C_LASTIK  = '#17181b';
const C_JANT    = '#aeaaa0';
const C_BACAK   = '#999891';
const C_MUHIM   = '#85847c';   // mühimmat gövdesi
const C_MUH_BAS = '#33363b';   // mühimmat arayıcı başlığı (koyu cam)
const C_PANEL   = '#9c9a90';   // kanat üstü kumanda yüzeyi çizgisi
const C_DIP     = '#0e1114';   // koyu oyuk / egzoz ağzı

// ===========================================================================
// 1. TEMEL ÖLÇÜLER
// ===========================================================================
const UZUN      = 3.25;     // yarı uzunluk → 6.50 m
const ACIKLIK   = 6.00;     // yarı açıklık → 12.00 m
const NV        = 13;       // yarı kesitteki örnek (gövde halkası 2·NV−2 = 24)

const KANAT_Y0  = 1.220;    // kanat kiriş düzleminin kökteki yüksekliği
const DIHEDRAL  = 0.0349;   // tan(2°) — TB2'nin kanadı neredeyse düz

const KIRIS_Z   = 0.95;     // kuyruk kirişi ekseni (±) → aralık 1.90
const KIRIS_Y   = 1.150;    // kuyruk kirişi ekseni yüksekliği
const KIRIS_R   = 0.075;    // kuyruk kirişi yarıçapı

const PERV_X    = -1.620;   // pervane diski (itici, gövdenin arkasında)
const PERV_Y    = 1.030;    // pervane ekseni = gövde arka kesitinin merkezi
const PERV_R    = 0.720;    // pal ucu yarıçapı → disk çapı 1.44
                            // ⚠️ KIRIS_Z (0.95) ile arasında 0.23 m açıklık
                            // var: pervane kirişlere değmiyor. Yerden
                            // açıklık PERV_Y − PERV_R = 0.31 m.

const R_ANA     = 0.135;    // ana teker yarıçapı
const R_BURUN   = 0.115;    // burun tekeri
const TAKIM_X   = -0.150;   // ana takım aksı (davranıştaki dönme pivotu)
const TAKIM_Z   = 0.800;    // ana takım izi (±) → iz 1.60
const BURUN_X   = 2.100;    // burun takımı — ana takımdan 2.25 m ileride

// ===========================================================================
// 2. MONOTON KÜBİK EĞRİ (PCHIP)
// ===========================================================================
// Evin standart eğrisi (otomobil/otobüs/uçak ile aynı). Catmull-Rom denendi
// ve bırakıldı: eğimin hızla değiştiği yerde taşıyor, ve 65 cm çaplı bir
// gövdede 1 cm'lik taşma yandan bakışta hemen okunuyor.
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
// YARIÇAP (yarı yükseklik). Gövde kısa bir pod: önde uzun konik bir burun,
// ortada en kalın yer (kanat kutusu), arkada motor bölmesi. Sabit kesitli
// bölüm YOK — yolcu uçağının tersine bu bir basınç kabini değil.
const R_GOV = egriYap([
    [-1.550, 0.150], [-1.420, 0.196], [-1.250, 0.242], [-1.020, 0.286],
    [-0.700, 0.318], [-0.300, 0.336], [ 0.150, 0.340], [ 0.700, 0.335],
    [ 1.250, 0.322], [ 1.720, 0.300], [ 2.100, 0.272], [ 2.420, 0.234],
    [ 2.700, 0.186], [ 2.940, 0.130], [ 3.120, 0.076], [ 3.250, 0.022]
]);
// KESİT MERKEZİNİN YÜKSEKLİĞİ. Arkada hafif YUKARI (motor/pervane ekseni
// kanadın üstünden geçsin, pervane yere yaklaşmasın), önde hafif AŞAĞI
// (taretin görüş konisi burnun altında açık kalsın).
const YC = egriYap([
    [-1.550, 1.030], [-1.020, 1.008], [-0.300, 0.985], [ 0.400, 0.972],
    [ 1.250, 0.958], [ 2.100, 0.948], [ 2.700, 0.946], [ 3.250, 0.952]
]);
// YATAY/DÜŞEY ORAN (rz/ry). Gövde her yerde yüksekten DAR: TB2'nin gövdesi
// yandan bakışta dolgun, üstten bakışta bıçak gibi ince. Kanat kökünde
// 0.95'e açılıyor — "blended wing body" dedikleri şeyin okunan hâli bu.
// ⚠️ 1.00 (tam daire) denendi ve bırakıldı: üstten bakışta gövde kalın bir
// sosise düşüyor ve ince kanadın uzunluğu kayboluyordu.
const ORAN = egriYap([
    [-1.550, 0.680], [-1.020, 0.780], [-0.400, 0.900], [ 0.200, 0.950],
    [ 0.900, 0.910], [ 1.720, 0.855], [ 2.420, 0.820], [ 3.250, 0.800]
]);

// ===========================================================================
// 3. GÖVDE KESİTİ
// ===========================================================================
// Fonksiyon adları kasten otomobil/otobüs/uçak ile AYNI (kesitPar /
// kesitNokta / nokta3 / vYukseklik): tezgâhtaki `kesit_olc.js` bu dört adı
// arıyor, ölçüm aracı bu modelde de çalışsın diye.
function kesitPar(x) {
    const r = R_GOV(x);
    return { ry: r, rz: r * ORAN(x), yc: YC(x) };
}
// v ∈ [0,1]: 0 = kesitin en altı, 1 = en üstü. Dönen [z, y].
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
    const h = 0.004;
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

// ===========================================================================
// 4. GENEL LOFT — bu modeldeki BÜTÜN kütleler bundan çıkıyor
// ===========================================================================
// Gövde, kanat, ters V kuyruk, karın kaplaması ve PERVANE PALLERİ aynı
// makineden geçiyor: sıralı KAPALI halkalar birbirine dikiliyor, iki uç
// yelpaze ile kapanıyor. Extrude gövde kütlesi için HİÇ kullanılmadı
// (kesiti derinlik boyunca sabittir; bu modelde sabit kesitli tek bir kütle
// bile yok).
//
// ⚠️ SARIM YÖNÜ GÖZLE KOVALANMIYOR, ÖLÇÜLÜYOR: aynalanan yarılarda halka
// sırası kendiliğinden ters dönüyor. Kapalı kabuğun İŞARETLİ HACMİ
// hesaplanıyor, negatifse bütün üçgenler ters çevriliyor.
function loftGeo(halkalar, kapaksiz) {
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
    // balon gibi görünür).
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
    if (!kapaksiz) {
        kapak(halkalar[halkalar.length - 1], true);
        kapak(halkalar[0], false);
    }
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
    return geo;
}
function loftKur(ad, halkalar, renk, opts) {
    opts = opts || {};
    const m = mesh(loftGeo(halkalar, opts.kapaksiz), renk, {
        metal: opts.metal == null ? 0.18 : opts.metal,
        rough: opts.rough == null ? 0.62 : opts.rough, name: ad
    });
    modelGroup.add(m);
    return m;
}

// ===========================================================================
// 5. GÖVDE KABUĞU
// ===========================================================================
// İstasyonlar burun konisinde SIK (orada kesit 1.1 m içinde tamamen
// değişiyor), kanat kutusu bölgesinde SEYREK.
const IST = [
    -1.550, -1.450, -1.330, -1.190, -1.030, -0.850, -0.640, -0.400,
    -0.120,  0.180,  0.500,  0.820,  1.130,  1.420,  1.680,  1.910,
     2.110,  2.290,  2.450,  2.590,  2.710,  2.820,  2.910,  2.990,
     3.060,  3.120,  3.170,  3.210,  3.235,  3.250
];
const R_HALKA = 2 * NV - 2;

function govdeHalka(x) {
    const P = kesitPar(x), yarim = [];
    for (let i = 0; i < NV; i++) yarim.push(kesitNokta(P, i / (NV - 1)));
    // 0 = alt orta → +z yanı yukarı → NV−1 = üst orta → −z yanı aşağı.
    const r = [];
    for (let i = 0; i < NV; i++) r.push([x, yarim[i][1], yarim[i][0]]);
    for (let i = NV - 2; i >= 1; i--) r.push([x, yarim[i][1], -yarim[i][0]]);
    return r;
}
loftKur('govde', IST.map(govdeHalka), C_GOVDE, { metal: 0.22, rough: 0.80 });

// ===========================================================================
// 6. GÖVDEYE OTURAN PANELLER
// ===========================================================================
// Gövde yüzeyi x1..x2 ve w1..w2 aralığında yeniden örnekleniyor ve normal
// boyunca `disari` kadar öteleniyor. Düz bir levha olsaydı burun konisinde
// yüzeyin içine girerdi.
// Bant biçimi: [x1, x2, w1, w2]  ya da  [x1, x2, y1, y2, taraf] (y YÜKSEKLİK).
// ⚠️ `nx` bandın x, `nw` w yönündeki bölüntüsü; UZUN kenara ÇOK verilir.
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
        metal: opts.metal == null ? 0.2 : opts.metal,
        rough: opts.rough == null ? 0.6 : opts.rough, name: ad
    });
    m.material.side = THREE.DoubleSide;
    // Kalınlıksız paneller GÖLGE DÜŞÜRMEZ: gövdeye 5-15 mm mesafedeler ve
    // gölge haritasında kendi gölgelerini gövdenin üstüne basıp benek
    // (acne) üretiyorlardı.
    m.castShadow = false;
    modelGroup.add(m);
    return m;
}

// ---- ALT GÖVDE (boyasız açık gri karın) -----------------------------------
// Kesitin alt %35'i. Tek renk bir tüp alçak bakışta düz görünüyordu; bu
// şerit gövdeyi iki tona bölüp yuvarlaklığı okutuyor.
yuzeyYama('alt_govde', [
    [-1.40, 2.85,  0.65,  1.00],
    [-1.40, 2.85, -1.00, -0.65]
], 34, 3, 0.006, C_KARIN, { metal: 0.12, rough: 0.78 });

// ---- SERVİS KAPAKLARI -----------------------------------------------------
// Aviyonik bölmesi ve yakıt kapağı. Kapı KANADI değil, kapı HATTI: gövdeden
// 4 mm dışarıda, gövdeden hafif koyu. Gerçek uçakta da görünen şey yalnız
// kenardaki ince gölge çizgisidir.
// ⚠️ ÜST KENAR YÜKSEKLİĞİ GÖVDENİN TEPESİNE GÖRE SEÇİLİR — ÖLÇÜLDÜ.
// Bant YÜKSEKLİK biçiminde ([x1,x2,y1,y2,taraf]), yani her x'te o yüksekliğin
// `w`'si aranıyor. Ön bandın üst kenarı 1.26 idi; gövdenin tepesi ise
// x=1.35'te 1.2750, x=2.05'te 1.2247. x≈1.60'tan sonra 1.26 tepenin ÜSTÜNDE
// kalıyor, `vYukseklik` v=1'e doyuyor ve w=0 çıkıyor: bandın üst kenarı
// burnun SIRTINA (z=0) yapışıyor, iki yanın paneli orta hatta buluşuyor ve
// aralarından gövde kama gibi görünüyor. Dokuz istasyonun ALTISINDA w=0
// ölçüldü. Üst kenar 1.16'ya indirildi: w hiçbir istasyonda 0.22'nin altına
// inmiyor, tepeyle arada 65-115 mm boya kalıyor (arka bantta bu pay 84-101).
// Alt kenar 0.98 → 0.94: panelin boyu 0.22 m, arka bandınkine (0.27) yakın.
// ⚠️ `nx` 4 → 8: bant 0.70 m uzunlukta ve burun konisine doğru kesit
// daralıyor; 175 mm'lik düz adımlar yüzeyin kirişini kesiyordu.
yuzeyYama('kapaklar', [
    [ 1.35, 2.05, 0.94, 1.16,  1], [ 1.35, 2.05, 0.94, 1.16, -1],
    [-0.90, -0.30, 0.95, 1.22,  1], [-0.90, -0.30, 0.95, 1.22, -1]
], 8, 4, 0.004, C_KARIN, { metal: 0.15, rough: 0.7 });

// ===========================================================================
// 7. KANAT PROFİLİ
// ===========================================================================
// NACA dört haneli kalınlık dağılımı + basit kamber çizgisi. Elips kesit
// denendi ve bırakıldı: elipsin hücum kenarı da firar kenarı kadar küt,
// 12 metrelik ince bir kanat yandan bakışta düz bir cetvele düşüyor.
// ⚠️ İNCE UZUN PARÇADA KESİT HER ŞEYDİR (motosiklet dersi): 0.86 m kirişli
// bir kanadı dikdörtgen kesitle yapmak "ilkokul çizimi" etkisi verir.
// KAMBER 0.025 — uzun havada kalışlı bir İHA kanadı yolcu uçağınınkinden
// daha kamberlidir (düşük hız, yüksek taşıma katsayısı).
const KAMBER = 0.025, KAMBER_P = 0.40;
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
const KN = 11;                      // yüzey başına örnek → halka 2·KN−2 = 20
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
// Yatay/eğik taşıyıcı yüzey (kanat, ters V kuyruk): açıklık z-y düzleminde.
// `fi` kesitin KALINLIK yönünün x ekseni etrafında dönmesi: fi=0'da kalınlık
// tam düşey (yatay kanat), fi arttıkça yüzey dikleşir.
function yatayHalka(K) {
    const c = Math.cos(K.fi || 0), s = Math.sin(K.fi || 0);
    const kiris = K.xle - K.te;
    return profilHalka({ tc: K.tc }, function (u, t) {
        return [K.xle - u * kiris,
                K.y + t * kiris * c,
                K.z + t * kiris * s];
    }, K.simetrik);
}

// ===========================================================================
// 8. KANAT — tek kabuk, gövdenin İÇİNDEN geçiyor
// ===========================================================================
// z = −6.00'dan +6.00'a TEK loft. İki ayrı kanat yapmak denenmedi: kök
// kesitinin gövde içinde birleşmesi gerekiyor ve tek kabuk hem onu hem de
// aynalanan yarıda sarımın ters dönmesini kökünden kaldırıyor.
//
// HÜCUM KENARI NEREDEYSE DÜZ: xle 0.410 → 0.300, yani 6.00 m yarı açıklıkta
// 0.11 m geriye = 1.05°. Daralma yalnız FİRAR kenarında (te −0.450 → +0.090).
// Bu, savaş uçağının ok kanadından ayrılmanın en ucuz ve en güvenilir yolu:
// tepeden bakışta iki silueti karıştırmak imkânsız hâle geliyor.
//
// KANAT ALANI (trapez toplamı, aşağıdaki tablodan): yarı 4.394 m² → tam
// 8.788 m². EN-BOY ORANI = 12.00² / 8.788 = 16.4.
// Kıyas: F-16'nın en-boy oranı 3.0 civarındadır.
const KANAT_YARIM = [
    { z: 0.00, xle: 0.410, te: -0.450, tc: 0.150 },
    { z: 1.05, xle: 0.410, te: -0.445, tc: 0.147 },
    { z: 2.40, xle: 0.405, te: -0.410, tc: 0.142 },
    { z: 3.80, xle: 0.398, te: -0.340, tc: 0.134 },
    { z: 5.00, xle: 0.388, te: -0.235, tc: 0.125 },
    { z: 5.70, xle: 0.375, te: -0.120, tc: 0.118 },
    { z: 5.90, xle: 0.360, te: -0.040, tc: 0.112 },
    { z: 5.98, xle: 0.335, te:  0.020, tc: 0.104 },
    { z: 6.00, xle: 0.300, te:  0.090, tc: 0.090 }   // yuvarlatılmış uç
];
(function kanatKur() {
    const kesitler = KANAT_YARIM.map(function (K) {
        return { z: K.z, xle: K.xle, te: K.te, tc: K.tc, fi: 0,
                 y: KANAT_Y0 + DIHEDRAL * K.z };
    });
    const tam = [];
    for (let i = kesitler.length - 1; i >= 1; i--) {
        const K = kesitler[i];
        tam.push({ z: -K.z, xle: K.xle, te: K.te, tc: K.tc, y: K.y, fi: 0 });
    }
    for (const K of kesitler) tam.push(K);
    loftKur('kanat', tam.map(yatayHalka), C_KANAT, { metal: 0.22, rough: 0.80 });
})();

// ---- kanat üstü kumanda yüzeyi çizgileri ----------------------------------
// Tepeden bakış haritanın ANA bakışı; 12 metrelik boş bir kanat üstü düz bir
// çubuk oluyor. Gerçek kanatta görünen iki çizgi var: flaperon menteşesi ve
// kanat kutusunun arka kirişi. İkisi de kirişin sabit bir oranında.
// ⚠️ Çizgiler kanat YÜZEYİNE oturuyor (profil fonksiyonundan yeniden
// örneklenip 8 mm yukarı ötelenerek), düz levha olarak değil.
function kanatSerit(ad, u1, u2, renk, z1, z2) {
    const P = [], IDX = [];
    const list = KANAT_YARIM.filter(function (K) { return K.z >= z1 && K.z <= z2; });
    for (const yon of [1, -1]) {
        const taban = P.length / 3;
        for (let i = 0; i < list.length; i++) {
            const K = list[i], kiris = K.xle - K.te;
            const y = KANAT_Y0 + DIHEDRAL * K.z;
            for (const u of [u1, u2]) {
                const t = profilKamber(u) + profilKalinlik(u, K.tc);
                P.push(K.xle - u * kiris, y + t * kiris + 0.008, yon * K.z);
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
kanatSerit('kanat_kiris_hatti', 0.640, 0.660, C_PANEL, 0.00, 6.00);
kanatSerit('kanat_flaperon',    0.740, 0.762, C_PANEL, 1.05, 5.98);

// ===========================================================================
// 9. KANAT-GÖVDE BİRLEŞİM KAPLAMASI (blended wing body)
// ===========================================================================
// Kanadın gövdeye girdiği yeri örten kaplama. Gerçek TB2'de kanat kutusu,
// yakıt ve iniş takımı bağlantısı burada. Görsel işi: kanat gövdeye çıplak
// saplanmasın ve alçak bakışta gövdenin altı boş bir tüpe düşmesin.
// Gövdeden 24 cm geniş (yarı genişlik 0.56 / gövde 0.323).
loftKur('karin', [
    [ 0.92, 1.010, 0.30, 0.20], [ 0.62, 0.980, 0.40, 0.42],
    [ 0.20, 0.960, 0.44, 0.56], [-0.35, 0.958, 0.44, 0.56],
    [-0.78, 0.980, 0.40, 0.44], [-1.05, 1.010, 0.30, 0.24]
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
// 10. KUYRUK KİRİŞLERİ (twin boom)
// ===========================================================================
// Kanadın altından geriye uzanan iki ince kiriş; ters V kuyruğu taşıyorlar
// ve aralarında pervaneye yer açıyorlar. Ön uçları kanadın İÇİNDE, arka
// uçları kuyruk kökünün İÇİNDE gömülü — gerçek kirişin görünen kısmı da
// yalnız aradaki bölümdür.
// Kiriş üstü (KIRIS_Y + KIRIS_R = 1.225) kanadın z=±0.95'teki alt yüzeyini
// (ölçüldü: 1.208) geçiyor, yani kiriş kanada BAĞLI görünüyor; 1.10'da
// kurulduğunda arada 3 cm boşluk kalıyordu.
[1, -1].forEach(function (s, i) {
    const g = new THREE.CylinderGeometry(0.062, KIRIS_R, 3.50, 12);
    g.rotateZ(Math.PI / 2);                     // eksen +y → +x
    g.translate(-1.400, KIRIS_Y, s * KIRIS_Z);  // x −3.15 .. +0.35
    modelGroup.add(mesh(g, C_KIRIS, { metal: 0.2, rough: 0.62,
                                      name: 'kiris_' + (i + 1) }));
    // kiriş-kanat bağlantı kulağı: kirişi kanada çıplak saplanmaktan kurtarır
    const k = new THREE.SphereGeometry(1, 9, 7);
    k.scale(0.46, 0.13, 0.10);
    k.translate(-0.02, 1.212, s * KIRIS_Z);
    modelGroup.add(mesh(k, C_KIRIS, { metal: 0.2, rough: 0.62,
                                      name: 'kiris_kulak_' + (i + 1) }));
});

// ===========================================================================
// 11. TERS V (Λ) KUYRUK — MODELİN İMZASI
// ===========================================================================
// İki yüzey, kirişlerin arka ucundan yukarı-İÇERİ gelip tepede birleşiyor.
// Kanat açıklığında olduğu gibi burada da geometri ÖLÇÜLEREK yazıldı:
//
//   kök  (kiriş üstü): z = ±0.950, y = 1.200
//   tepe (birleşme)  : z = ±0.020, y = 2.186
//   açıklık vektörü  : (Δz, Δy) = (−0.930, +0.986) → YATAYLA 46.7°
//
// KALINLIK YÖNÜ açıklık vektörüne DİK olmak zorunda, yoksa yüzey kendi
// içinde burulur. Dik vektör (nz, ny) = (0.986, 0.930)/|s| ve `yatayHalka`
// Δy = t·c·cos(fi), Δz = t·c·sin(fi) yazdığı için:
//   fi = atan2(0.986, 0.930) = 0.8145 rad (46.7°)
// Bu tam olarak yüzeyin yatayla yaptığı açı — kalınlık yönü ile açıklık
// yönü dik olduğu sürece ikisi eşit çıkar.
//
// ⚠️ TEPEDEN OKUNSUN DİYE APEKS GERİDE. Kök hücum kenarı −2.300, tepe hücum
// kenarı −2.640: yukarı çıkarken 0.34 m geriye kaçıyor. Düşey yazılsaydı
// tepe bakışında iki yüzey tek bir çizgiye düşerdi; şimdi geriye daralan
// bir Λ okunuyor.
//
// ⚠️ MODELİN EN YÜKSEK NOKTASI BURASI. Tepe kesitinin merkezi 2.186'da;
// üstüne profil kalınlığının düşey bileşeni biniyor (0.050·0.420·cos(0.8145)
// = 0.0144) → 2.2004, yani ölçülen kutu yüksekliği 2.200 m. Gerçek TB2'nin
// yüksekliği de 2.20 m.
const KUYRUK_FI = 0.8145;
const KUYRUK_KESIT = [
    { z: 0.950, y: 1.200, xle: -2.300, te: -3.250, tc: 0.115 },
    { z: 0.720, y: 1.444, xle: -2.385, te: -3.228, tc: 0.112 },
    { z: 0.470, y: 1.709, xle: -2.477, te: -3.180, tc: 0.108 },
    { z: 0.230, y: 1.964, xle: -2.565, te: -3.120, tc: 0.104 },
    { z: 0.020, y: 2.186, xle: -2.640, te: -3.060, tc: 0.100 }
];
[1, -1].forEach(function (s, i) {
    const kesit = KUYRUK_KESIT.map(function (K) {
        return { z: s * K.z, y: K.y, xle: K.xle, te: K.te, tc: K.tc,
                 fi: s * KUYRUK_FI, simetrik: true };
    });
    loftKur('kuyruk_' + (i + 1), kesit.map(yatayHalka), C_KANAT,
            { metal: 0.22, rough: 0.80 });
});
// Tepe birleşme bileziği: iki yüzeyin uçları arasında 4 cm kalıyor; bu küçük
// kütle onları tek bir eklem gibi gösteriyor. Uçları z=0'a kadar uzatmak
// denendi ve bırakıldı — iki loft kapağı tam merkez düzleminde çakışıp
// derinlik kavgası (z-tamponu benek) üretiyordu.
// ⚠️ BOYU ÖLÇÜLEREK KIRPILDI. İlk kurulumda yarı yüksekliği 0.075'ti ve
// kutu 2.220 ölçtü: modelin en yüksek noktası kuyruk apeksi değil BU
// bilezik oluyordu. 0.030'a inince kutu 2.200'e, yani gerçek TB2'nin
// yüksekliğine oturdu ve en yüksek nokta yeniden kuyruğun kendisi oldu.
(function () {
    const g = new THREE.SphereGeometry(1, 10, 8);
    g.scale(0.230, 0.030, 0.085);
    g.translate(-2.850, 2.168, 0);
    modelGroup.add(mesh(g, C_KANAT, { metal: 0.22, rough: 0.72,
                                      name: 'kuyruk_bilezik' }));
})();

// ===========================================================================
// 12. İTİCİ PERVANE
// ===========================================================================
// İki pal, DEĞİŞKEN HATVELİ. Palin kesiti kanadınkiyle AYNI makineden çıkıyor
// (profilHalka), yalnız kiriş ve hatve açısı yarıçapla değişiyor: kökte
// 35.5°, ucta 10.9°. Düz dikdörtgen pal denendi ve bırakıldı — dönerken
// ışığı hep aynı açıyla yakaladığı için disk ölü bir levha gibi duruyordu.
//
// ⚠️ PALLER spin() GRUBUNUN İÇİNDE. Grup pivotu pervane göbeği; eksen 'x'
// (aracın ekseni). Motor `_tickAnimators` içinde açıyı MUTLAK tSec'ten
// yazıyor, yani dışa aktarım deterministik.
// ⚠️ HIZ GÖZ İÇİN SEÇİLDİ, GERÇEK İÇİN DEĞİL. Gerçek pervane 2400-2700
// dev/dak döner; motor rpm'i doğrudan açıya çevirdiği için o hızda pal her
// karede birden fazla tur atıp stroboskopla DURUYOR gibi görünüyor (bisiklet
// aynakolunda ve uçak fanında öğrenilen aynı ders). 200 seçildi: iki palli
// bir diskte kare başına 40° dönüş, yani hareket okunuyor ama tur atlamıyor.
function palHalka(K) {
    const c = K.kiris, ca = Math.cos(K.aci), sa = Math.sin(K.aci);
    return profilHalka({ tc: K.tc }, function (u, t) {
        // Yerel eksen: kiriş x-z düzleminde, hatve açısı kadar döndürülmüş;
        // yarıçap +y. (0.32 − u) hücum kenarını göbeğin önüne alıyor.
        const q = (0.32 - u) * c, w = t * c;
        return [q * ca + w * sa, K.r, -q * sa + w * ca];
    }, false);
}
const PAL_KESIT = [
    { r: 0.075, kiris: 0.090, tc: 0.30, aci: 0.620 },   // göbek yakası (35.5°)
    { r: 0.180, kiris: 0.126, tc: 0.22, aci: 0.520 },
    { r: 0.320, kiris: 0.142, tc: 0.16, aci: 0.400 },
    { r: 0.460, kiris: 0.134, tc: 0.13, aci: 0.310 },
    { r: 0.590, kiris: 0.112, tc: 0.11, aci: 0.250 },
    { r: 0.680, kiris: 0.082, tc: 0.10, aci: 0.210 },
    { r: 0.720, kiris: 0.038, tc: 0.09, aci: 0.190 }    // uç (10.9°)
];
// ⚠️ İKİNCİ PAL, BİRİNCİNİN 180° DÖNDÜRÜLMÜŞÜ — parametreyle AYNALANMIŞI
// DEĞİL. İlk kurulumda ikinci pal `r` ve `aci` negatiflenerek üretilmişti;
// o dönüşüm kalınlık yönünü de ters çeviriyor, yani ikinci palin profili
// ters kamberli çıkıyor ve iki pal birbirinin tersine "itiyor". Aynı
// geometri, `rotation.x = π` ile takıldığında dönüşüm tam olarak gerçek
// pervanenin dönüşümü oluyor.
(function pervane() {
    const pg = spin({ pivot: [PERV_X, PERV_Y, 0], axis: 'x', rpm: 200 });
    // Pal ucu görünürlük bandı: dönen koyu bir pal koyu zeminde kayboluyor,
    // açık uç bandı diski okutan tek işaret. Ölçek 1.02 pal yüzeyinden 1.4 cm
    // dışarı çıkarıyor (derinlik kavgası olmasın diye).
    [0, 1].forEach(function (yon, i) {
        const m = mesh(loftGeo(PAL_KESIT.map(palHalka), false), C_PAL,
                       { metal: 0.30, rough: 0.42, name: 'pal_' + (i + 1) });
        m.rotation.x = yon * Math.PI;
        pg.add(m);
        const mu = mesh(loftGeo(PAL_KESIT.slice(5).map(palHalka), false), C_PAL_UC,
                        { metal: 0.25, rough: 0.5, name: 'pal_uc_' + (i + 1) });
        mu.rotation.x = yon * Math.PI;
        mu.scale.setScalar(1.02);
        pg.add(mu);
    });
    // Göbek kaportası (spinner). Dönen grubun İÇİNDE: gerçekte de pervaneyle
    // birlikte döner. Tabanı x −1.540'ta, yani gövdenin arka kapağının
    // (−1.550) 1 cm İÇİNDE — arada boşluk kalmasın diye; tepesi −1.810'da,
    // geriye bakıyor (İTİCİ yerleşim). Pal kökleri (r 0.075) disk düzleminde
    // koninin yarıçapının (0.106) içinde kalıyor: gerçek pervanede de pal
    // kökü göbeğin içinden çıkar.
    const s = new THREE.ConeGeometry(0.150, 0.270, 14);
    s.rotateZ(Math.PI / 2);                 // +y → −x, yani koni GERİYE bakar
    s.translate(-0.055, 0, 0);
    pg.add(mesh(s, C_KAPAK, { metal: 0.3, rough: 0.45, name: 'pervane_gobek' }));
})();

// EGZOZ: gövdenin arka altında kısa boru. Modelin "içten yanmalı motor"
// tarafını söyleyen tek işaret; askeri jetin arka ucundaki koni ile
// karıştırılmasın diye bilerek KÜÇÜK.
// ⚠️ MERKEZ ÇİZGİSİNDE. Gerçek TB2'de egzoz bir yana kaçıktır ama harita
// modeli soldan sağa aynalıyor: kaçık bir parça üründe ters tarafa geçerdi.
(function () {
    const g = new THREE.CylinderGeometry(0.038, 0.044, 0.30, 9, 1, true);
    g.rotateZ(Math.PI / 2);
    g.translate(-1.180, 0.815, 0);
    const m = mesh(g, C_DIP, { metal: 0.3, rough: 0.55, name: 'egzoz' });
    m.material.side = THREE.DoubleSide;
    modelGroup.add(m);
})();

// SOĞUTMA AĞZI: gövdenin arka sırtında motor soğutma girişi. Tepe bakışında
// gövdenin düz sırtına ölçek veren tek şey.
(function () {
    const g = new THREE.SphereGeometry(1, 9, 7);
    g.scale(0.300, 0.055, 0.115);
    g.translate(-0.900, YC(-0.900) + R_GOV(-0.900) - 0.015, 0);
    modelGroup.add(mesh(g, C_KARIN, { metal: 0.2, rough: 0.65,
                                      name: 'sogutma_agzi' }));
})();

// ===========================================================================
// 13. ELEKTRO-OPTİK TARET (burun küresi)
// ===========================================================================
// Burnun altına asılı gimbal: gündüz kamerası + termal + lazer mesafe ölçer /
// işaretleyici. TB2'yi "gözlü" yapan parça ve tepeden bakışta burnun altında
// koyu bir nokta olarak okunuyor.
// ⚠️ MERKEZ ÇİZGİSİNDE (z=0). Harita modeli soldan sağa aynalıyor; taret
// yana kaçık olsaydı üründe ters tarafa geçerdi.
// Küre merkezi 0.620'de, yarıçap 0.185 → üst 0.805. Gövde dibi x=2.35'te
// 0.663 (ölçüldü) — yani küre gövdeye 14 cm gömülü, çıplak asılı durmuyor.
(function () {
    const g = new THREE.SphereGeometry(0.185, 14, 11);
    g.scale(1.00, 0.94, 1.00);
    g.translate(2.350, 0.620, 0);
    modelGroup.add(mesh(g, C_TARET, { metal: 0.35, rough: 0.40, name: 'taret' }));
    // Boyun: küre ile gövde arasındaki kısa silindir (küre gövdeye gömülü
    // olduğu için yalnız yandan bakışta görünüyor).
    const b = new THREE.CylinderGeometry(0.098, 0.112, 0.16, 12);
    b.translate(2.350, 0.760, 0);
    modelGroup.add(mesh(b, C_TARET, { metal: 0.3, rough: 0.5, name: 'taret_boyun' }));
    // Pencere: kürenin ön-alt çeyreğinde, +x'ten 35° aşağıda. Yönü z'ye göre
    // simetrik olduğu için aynalamadan etkilenmiyor.
    const c = new THREE.SphereGeometry(1, 10, 8);
    c.scale(0.055, 0.098, 0.112);
    c.translate(2.350 + 0.152, 0.620 - 0.106, 0);
    modelGroup.add(mesh(c, C_CAM, { metal: 0.4, rough: 0.12, name: 'taret_cam' }));
})();

// PITOT: burnun ucundaki ince çubuk.
// ⚠️ KUTUYU TAŞIRMIYOR. İlk kurulumda merkezi 3.180'deydi ve ucu 3.280'e
// çıkıyordu: kutu 6.530 ölçtü, yani `sizeKm`in okuduğu uzunluk gerçek TB2'nin
// 6.50'sini 3 cm aşıyordu. Merkez 3.150'ye alındı, uç tam 3.250'de bitiyor.
(function () {
    const g = new THREE.CylinderGeometry(0.012, 0.016, 0.20, 7);
    g.rotateZ(Math.PI / 2);
    g.translate(3.150, YC(3.150), 0);
    modelGroup.add(mesh(g, C_BACAK, { metal: 0.45, rough: 0.35, name: 'pitot' }));
})();

// ANTENLER: sırtta ve karında birer bıçak anten.
[[0.95, 1], [1.60, -1]].forEach(function (a, i) {
    const x = a[0], yon = a[1];
    const sh = new THREE.Shape();
    sh.moveTo(-0.10, 0); sh.lineTo(0.09, 0); sh.lineTo(0.035, 0.10);
    sh.lineTo(-0.060, 0.088); sh.closePath();
    const g = new THREE.ExtrudeGeometry(sh, { depth: 0.016, bevelEnabled: false });
    g.translate(0, 0, -0.008);
    if (yon < 0) g.rotateX(Math.PI);
    g.translate(x, yon > 0 ? YC(x) + R_GOV(x) - 0.012 : YC(x) - R_GOV(x) + 0.012, 0);
    modelGroup.add(mesh(g, C_KARIN, { metal: 0.25, rough: 0.55,
                                      name: 'anten_' + (i + 1) }));
});

// ===========================================================================
// 14. SABİT İNİŞ TAKIMI
// ===========================================================================
// ⚠️ TOPLANMIYOR — yolcu uçağından ayrıldığı yer burası. Parçalar 'takim'
// adlı bir grupta TOPLANMADI (o ad davranışa "havada gizle" hakkı verir) ve
// davranışta iniş takımı dalı HİÇ YOK. Gerçek TB2'nin takımı da sabittir.
// ⚠️ _WHEELS tablosuna satır EKLENMEDİ: 12 metrelik bir modelde 13 cm'lik
// teker haritada yarım pikselin altında, yuvarlanma görünmüyor; buna karşılık
// yanlış yarıçap yazmanın bedeli (yolla uyumsuz dönen teker) gerçek.
function tekerlek(ad, x, y, z, R, genislik) {
    const g = new THREE.Group();
    g.name = ad;
    g.position.set(x, y, z);
    g.rotation.x = Math.PI / 2;
    const et = R * 0.32;
    const lastik = new THREE.TorusGeometry(R - et, et, 6, 16);
    lastik.rotateX(Math.PI / 2);
    lastik.scale(1, genislik / (et * 2), 1);
    g.add(mesh(lastik, C_LASTIK, { rough: 0.95, name: ad + '_lastik' }));
    const jant = mesh(new THREE.CylinderGeometry(R - et * 1.85, R - et * 1.85,
                                                 genislik * 0.9, 10),
                      C_JANT, { metal: 0.4, rough: 0.42, name: ad + '_jant' });
    g.add(jant);
    modelGroup.add(g);
}

// ---- burun takımı (tek teker, öne eğik bacak) -----------------------------
(function () {
    const ust = 0.660, alt = R_BURUN;
    const b = mesh(new THREE.CylinderGeometry(0.026, 0.032, ust - alt, 9),
                   C_BACAK, { metal: 0.45, rough: 0.32, name: 'burun_bacak' });
    b.position.set(BURUN_X - 0.020, (ust + alt) / 2, 0);
    b.rotation.z = 0.075;
    modelGroup.add(b);
    // makas (torsiyon kolu) — bacağı çıplak boru olmaktan çıkarır
    const mk = mesh(new THREE.BoxGeometry(0.030, 0.150, 0.022), C_BACAK,
                    { metal: 0.4, rough: 0.35, name: 'burun_makas' });
    mk.position.set(BURUN_X + 0.062, 0.300, 0);
    mk.rotation.z = 0.50;
    modelGroup.add(mk);
    const ak = mesh(new THREE.CylinderGeometry(0.020, 0.020, 0.145, 8), C_BACAK,
                    { metal: 0.45, rough: 0.32, name: 'burun_aks' });
    ak.rotation.x = Math.PI / 2;
    ak.position.set(BURUN_X, R_BURUN, 0);
    modelGroup.add(ak);
    tekerlek('teker_on', BURUN_X, R_BURUN, 0, R_BURUN, 0.070);
})();

// ---- ana takım (iki bacak, dışa açılan) -----------------------------------
// Üstte ±0.310, akslarda ±0.800: gerçek takım da gövdeye yakın bağlanıp dışa
// açılır. İz 1.60 m.
const TAKIM_UST_Z = 0.310;
[1, -1].forEach(function (s, i) {
    const ust = 0.720, alt = R_ANA;
    const dz = TAKIM_Z - TAKIM_UST_Z;
    const boy = Math.sqrt((ust - alt) * (ust - alt) + dz * dz);
    const b = mesh(new THREE.CylinderGeometry(0.028, 0.036, boy, 9), C_BACAK,
                   { metal: 0.45, rough: 0.32, name: 'ana_bacak_' + (i + 1) });
    b.position.set(TAKIM_X, (ust + alt) / 2, s * (TAKIM_UST_Z + TAKIM_Z) / 2);
    b.rotation.x = -s * Math.atan2(dz, ust - alt);
    modelGroup.add(b);
    // öne doğru destek (drag strut)
    const d = mesh(new THREE.CylinderGeometry(0.018, 0.018, 0.36, 7), C_BACAK,
                   { metal: 0.4, rough: 0.35, name: 'ana_destek_' + (i + 1) });
    d.position.set(TAKIM_X + 0.150, 0.400, s * 0.640);
    d.rotation.z = 0.80;
    modelGroup.add(d);
    const ak = mesh(new THREE.CylinderGeometry(0.022, 0.022, 0.160, 8), C_BACAK,
                    { metal: 0.45, rough: 0.32, name: 'ana_aks_' + (i + 1) });
    ak.rotation.x = Math.PI / 2;
    ak.position.set(TAKIM_X, R_ANA, s * TAKIM_Z);
    modelGroup.add(ak);
    tekerlek('teker_ana_' + (i + 1), TAKIM_X, R_ANA, s * TAKIM_Z, R_ANA, 0.086);
});

// ===========================================================================
// 15. MÜHİMMAT (kanat altında iki hafif akıllı mühimmat)
// ===========================================================================
// MAM sınıfı: ~1.00 m boy, 0.16 m çap, önde dört kanatçık, arkada dört
// kuyruk kanadı, burnunda lazer arayıcı camı. İki istasyon (z = ±2.40).
// ⚠️ İKİSİ SİMETRİK. Tek taraflı bir mühimmat asılsaydı haritanın soldan
// sağa aynalaması onu ters kanada geçirirdi (ölçülmüş tuzak).
// Askı yüksekliği: kanadın z=±2.40'taki ALT yüzeyi 1.261'de (ölçüldü);
// pilon 1.261'den 1.130'a iniyor, mühimmat ekseni 1.050, üstü 1.130.
const MUH_Z = 2.400, MUH_X = 0.050, MUH_Y = 1.050, MUH_R = 0.080;
[1, -1].forEach(function (s, i) {
    const n = i + 1;
    // pilon
    const p = mesh(new THREE.BoxGeometry(0.34, 0.155, 0.048), C_KANAT,
                   { metal: 0.2, rough: 0.6, name: 'pilon_' + n });
    p.position.set(MUH_X + 0.06, 1.198, s * MUH_Z);
    modelGroup.add(p);
    // gövde (silindir) + burun konisi + kuyruk konisi
    const g = new THREE.CylinderGeometry(MUH_R, MUH_R, 0.66, 12);
    g.rotateZ(Math.PI / 2);
    g.translate(MUH_X - 0.02, MUH_Y, s * MUH_Z);
    modelGroup.add(mesh(g, C_MUHIM, { metal: 0.25, rough: 0.55,
                                      name: 'muhimmat_' + n }));
    // BURUN OGİVİ KOYU: bu mühimmatın burnu lazer arayıcının cam kubbesidir.
    // ⚠️ Ayrı bir koyu "arayıcı topu" mesh'i denendi ve KALDIRILDI: ölçüldü,
    // 5.2 cm yarıçaplı küre ogivin 8 cm'lik kesitinin İÇİNDE kalıyor ve hiç
    // görünmüyordu; dışarı taşıracak kadar öne alınınca da burundan çıkmış
    // bir top gibi duruyordu. Ogivin kendisini koyu boyamak hem doğru hem de
    // harita ölçeğinde tek okunan çözüm.
    const bn = new THREE.SphereGeometry(MUH_R, 12, 9, 0, Math.PI * 2, 0, Math.PI / 2);
    bn.scale(1, 2.1, 1);
    bn.rotateZ(-Math.PI / 2);
    bn.translate(MUH_X + 0.310, MUH_Y, s * MUH_Z);
    modelGroup.add(mesh(bn, C_MUH_BAS, { metal: 0.38, rough: 0.22,
                                         name: 'muhimmat_burun_' + n }));
    // ⚠️ rotateZ(π/2) +y'yi −x'e taşıyor: silindirin ÜST yarıçapı ARKAYA
    // düşüyor. Bu yüzden kalın uç (0.080, gövdeye bakan) `radiusBottom`,
    // ince uç (0.050, kuyruğa bakan) `radiusTop` olarak yazılıyor.
    const kn = new THREE.CylinderGeometry(0.050, MUH_R, 0.16, 12);
    kn.rotateZ(Math.PI / 2);
    kn.translate(MUH_X - 0.430, MUH_Y, s * MUH_Z);
    modelGroup.add(mesh(kn, C_MUHIM, { metal: 0.25, rough: 0.55,
                                       name: 'muhimmat_kuyruk_' + n }));
    // dört kanatçık (önde) + dört kuyruk kanadı, X düzeninde
    [[0.230, 0.070, 'kanatcik'], [-0.400, 0.098, 'kuyrukkanat']].forEach(
        function (a, j) {
            const x = MUH_X + a[0], boy = a[1];
            for (let k = 0; k < 4; k++) {
                const th = Math.PI / 4 + k * Math.PI / 2;
                const f = new THREE.BoxGeometry(boy * 1.7, boy, 0.010);
                f.translate(0, MUH_R * 0.55 + boy / 2, 0);
                f.rotateX(th);
                f.translate(x, MUH_Y, s * MUH_Z);
                modelGroup.add(mesh(f, C_MUHIM, {
                    metal: 0.25, rough: 0.55,
                    name: 'muh_' + a[2] + '_' + n + '_' + (k + 1) }));
            }
        });
});
// ---- DAVRANIŞIN OKUDUĞU MÜHİMMAT ÖLÇÜLERİ (ateş = mühimmatı bırakmak) ------
// TEK KAYNAK burası: studio-3d.js sayıları kopyalamıyor, buradan okuyor.
// `parca1`/`parca2` bir mühimmatın BÜTÜN mesh adları; davranış onları
// mühimmat ekseninde açılan bir gruba taşıyıp uçuruyor. `pilon_n` LİSTEDE
// DEĞİL: pilon kanatta kalır, mühimmatla birlikte düşmez.
// KANATÇIK ALT UCU: eksenin R*0.55 + boy altında, yani kuyruk kanadı için
// 0.080*0.55 + 0.098 = 0.142 m. Davranışın "zemine girme" payı bu sayıdan.
modelGroup.userData.sihaMuh = (function () {
    const ad = function (n) {
        const a = ['muhimmat_' + n, 'muhimmat_burun_' + n, 'muhimmat_kuyruk_' + n];
        for (let k = 1; k <= 4; k++) {
            a.push('muh_kanatcik_' + n + '_' + k);
            a.push('muh_kuyrukkanat_' + n + '_' + k);
        }
        return a;
    };
    return {
        X: MUH_X, Y: MUH_Y, Z: MUH_Z, R: MUH_R,
        BURUN: MUH_X + 0.310 + MUH_R * 2.1,   // ogiv ucu (model x = 0.528)
        KUYRUK: MUH_X - 0.430 - 0.08,         // kuyruk konisinin arka ucu (-0.460)
        ALT: MUH_R * 0.55 + 0.098,            // eksenin altındaki en derin nokta
        parca1: ad(1), parca2: ad(2)
    };
})();
