// Karargâh çadırı — OSMANLI OTAĞI: iki direkli (dwumasztowy), OVAL planlı
// komuta/otağ çadırı. Historical Warfare grubunun ikinci turundan.
//
// ⚠️ ID `karargah-cadiri`. Kütüphanede çadır YOK; `askeri-us`, `checkpoint`,
// `hangar` başka (ve gizli) Modern Warfare modelleri. EN adı "Command Tent".
//
// ============================================================================
// REFERANS VE ÖLÇÜLERİN KAYNAĞI  (hiçbiri ezberden değil)
// ============================================================================
// Tip: 17. yy Osmanlı iki direkli oval otağı — düşey kanat (duvar) + üstünde
// iki direğin arasına gerilmiş sırtlı/konik çatı, girişte sayeban (tente),
// çepeçevre gergi halatı ve kazık dizisi, direk tepesinde alem/sancak.
//
//  * WAWEL KRALİYET ŞATOSU'NDAKİ TÜRK ÇADIRI (Viyana, 12 Eylül 1683'te ele
//    geçirildi; Avrupa'nın en büyük Osmanlı çadırı koleksiyonu Wawel'de).
//    Müzenin kendi sayfası ve PAP/dzieje.pl bülteni şu ÖLÇÜLERİ veriyor:
//      - "dwumasztowy owalny namiot"  → İKİ DİREKLİ, OVAL plan
//      - kanat ("płot") YÜKSEKLİĞİ 3,6 m, her kanat 18 m uzunluğunda (iki adet)
//      - "jego obwód u dołu to ponad 36 m"  → ALT ÇEVRE 36 m'den fazla
//      - "obwód dachu – 27,6 m"             → çatı çevresi 27,6 m
//    Kaynak: wawel.krakow.pl (Namiot turecki w zbiorach wawelskich) ve
//    dzieje.pl / PAP haberi.
//
//  * DRESDEN "TÜRCKISCHE CAMMER" ÜÇ DİREKLİ OSMANLI ÇADIRI (17. yy, ipek +
//    yaldızlı deri; 1729'dan beri Dresden'de). Müzenin kendi sayfası
//    (ruestkammer.skd.museum): "twenty metres long, eight metres wide and
//    six metres high" → 20 m boy × 8 m EN × 6 m YÜKSEKLİK.
//
// PLANIN ÇÖZÜMÜ (iki kaynağın kesişimi, uydurma yok):
//   Oval = stadyum planı: iki yarım daire (yarıçap R) + aralarında düz koşu (L).
//   Çevre  = 2L + 2πR = 36.00 m                       (Wawel: alt çevre 36 m)
//   Genişlik 2R = 8.00 m                              (Dresden: en 8 m)
//     → R = 4.000 m,  L = (36.00 − 2π·4)/2 = 5.4336 m
//     → plan 13.434 × 8.000 m,  iki direk arası (sırt) 5.434 m
//   Kanat (duvar) yüksekliği 3.600 m                  (Wawel)
//   Sırt yüksekliği 6.000 m                           (Dresden)
//     → çatı yükselmesi 6.00 − 3.60 = 2.40 m; 4.00 m yarı-genişliğe karşı
//       eğim atan(2.40/4.00) = 30.96°. İki bağımsız kaynak BİRBİRİNİ
//       DOĞRULUYOR: Wawel'in kanat yüksekliği + Dresden'in toplam yüksekliği
//       çadır çatısı için gerçekçi tek bir eğim veriyor. Modelin çatı profili
//       (aşağıdaki CATI tablosu) tam bu 31°'de yürüyor; yalnız saçak ucunda
//       47°'ye kırılıyor (bez duvarın üstünden aşağı kıvrılıyor) ve tepede
//       21°'ye yatıyor (bez direğin başlığı üzerinde yuvarlanıyor).
//
// ============================================================================
// ÖLÇEK — neden maxHoriz ~22 m
// ============================================================================
// 1 model birimi = 1 GERÇEK METRE. Bezin kendi ayak izi 13.43 × 8.00 m, yani
// görevin verdiği "gerçek bir otağ 8–15 m" bandının tam içinde. Kutuyu 22 m'ye
// çıkaran şey UYDURMA BÜYÜTME DEĞİL, çadırın KURULMUŞ hâli:
//   * saçak duvarı 0.34 m aşıyor              → 14.11 × 8.68 m
//   * gergi halatları saçaktan 2.90 m dışarı kazığa iniyor (kazık üstü
//     3.42 m yükseklikteki saçaktan 49.7° ile aşağı) → 14.94 m en
//   * girişte 3.60 m derinliğinde sayeban ve onun iki direği + gergisi
// `maxHoriz = max(box.x, box.z)` = box.z ≈ 22.2 m; `sizeKm` onu ölçekliyor.
// LEGİBİLİTE gerekçesi (kalenin mazgal dişi hesabının aynısı): tepeden
// bakışın en küçük imzası KAZIK (0.53 m) = en uzun kenarın %2.4'ü; kalede
// aynı oran %1.8 (1.29 m diş / 70.67 m). Yani çadırın imzası kaleninkinden
// bir tık DAHA iyi okunuyor. Çadırı yalnız bezine kırpsaydık (13.4 m) kazık
// ve halat dizisi kutunun DIŞINDA kalırdı; tepeden çadırı çadır yapan asıl
// desen o dizidir.
//
// ============================================================================
// KALE İLE KARIŞMAMASI (tepeden siluet)
// ============================================================================
// Kale: kutu 53.60 × 70.67, siluet 3122.68 m², en-boy 1.60, doluluk 0.824.
// Bir DAİRE kesitinde tepeden en-boy 4/π = 1.27, doluluk π/4 = 0.785 — yani
// düz bir konik çadır kaleye doluluk bakımından YAKIN düşerdi. Ayrımı yapan
// şey burada üç sayıda birden aranmış:
//   (a) ALAN — çadır ~120 m², kalenin 1/26'sı;
//   (b) DOLULUK — halat/kazık halkası kutuyu büyütüp içini BOŞ bıraktığı için
//       ~0.38; kale 0.824, daire 0.785;
//   (c) EN-BOY — sayeban + kazık halkası kutuyu z'de uzattığı için ~3.9;
//       kale 1.60, daire 1.27.
// Ölçümü cadir_tepe_kiyas.py'de.
//
// ============================================================================
// AYNALAMA
// ============================================================================
// Harita her modeli soldan sağa aynalıyor (det(projection) negatif, devir
// §5.3). Çadırda YAZI ve ARMA YOK — bilerek: mızraklı piyade ajanı da aynı
// sebeple kalkana harf koymadı, taksinin tepe lambasında "IXAT" çıkmıştı.
// Çadırın bütün kütlesi x'te SİMETRİK (oval, sayeban, kapı, direkler,
// kazık dizisi); aynalanınca hiçbir şey değişmiyor. Bayrak bezi masa
// bayrağının/kalenin geometrisiyle BİREBİR aynı kuruluyor (PlaneGeometry +
// rotateY(-90) + DoubleSide + geometriye pişirilmiş sarkma), yani aynalama
// sözleşmesi MİRASLA geliyor ve TR bayrağında hilal serbest uca bakıyor.
//
// ============================================================================
// YÜZEY DETAYI `yuzeyYama` İLE YAPILMADI
// ============================================================================
// O yardımcı gövde kesitinin ÇEVRESİNDE (w) ilerliyor ve DİKEY yüzeyde
// çalışmıyor (ölçülmüş tuzak, zırhlı SUV bagaj camı). Çadırın kanadı tam
// dikey, çatısı 31° eğik. Şeritler, desen, söve ve sırt kapağı GERÇEK
// GEOMETRİ olarak, yüzeyden 0.04–0.06 m dışarı taşan ayrı kütlelerle
// kuruldu (+ polygonOffset).
//
// ============================================================================
// DAVRANIŞ YAZILMADI (kalenin kararının aynısı)
// ============================================================================
// `registerBehavior` eklenen modeli motor HER KARE animasyonlu sayıyor
// (studio-3d.js:1669); duran bir çadır için o bedel ödenmez — otomobilde de
// bilerek ödenmemişti. Bayrağın dalgası GEOMETRİYE pişirildi. Bez sarkması da
// geometride: sahne her karede mutlak durumdan kuruluyor, t=0/t=1 sınırında
// biriken hiçbir durum yok.
//
// YÖN: giriş −z'de (kalenin kapı kulesi gibi; varsayılan harita kamerası ve
// kapak kamerası oraya bakıyor). Sırt ±z boyunca. Üst +y, taban y=0.

// ===========================================================================
// 0. GEOMETRİ YIĞINI — düz normalli, elle dikilen BufferGeometry
// ---------------------------------------------------------------------------
// kale.js'ten alındı (orada birim küple tek tek doğrulanmış sarım kuralı):
//   * xz çokgeni POZİTİF işaretli alanla verilir;
//   * y yönünde loft: alt kapak −y, üst kapak +y, yanlar DIŞA bakar.
// Kural tek satırda: bir kenarın dış normali `u × kenar` (u = loft yönü).
// ===========================================================================
function yigin() {
    const P = [], N = [], I = [];

    function ekle(pts) {                        // düzlemsel çokgen (3+ nokta)
        const a = pts[0], b = pts[1], c = pts[2];
        const ux = b[0] - a[0], uy = b[1] - a[1], uz = b[2] - a[2];
        const vx = c[0] - a[0], vy = c[1] - a[1], vz = c[2] - a[2];
        let nx = uy * vz - uz * vy, ny = uz * vx - ux * vz, nz = ux * vy - uy * vx;
        const L = Math.sqrt(nx * nx + ny * ny + nz * nz) || 1;
        nx /= L; ny /= L; nz /= L;
        const o = P.length / 3;
        for (let i = 0; i < pts.length; i++) {
            P.push(pts[i][0], pts[i][1], pts[i][2]);
            N.push(nx, ny, nz);
        }
        for (let i = 1; i < pts.length - 1; i++) I.push(o, o + i, o + i + 1);
    }

    function kat3(A, B, altKapak, ustKapak) {
        const n = A.length;
        for (let i = 0; i < n; i++) {
            const j = (i + 1) % n;
            ekle([A[j], A[i], B[i], B[j]]);
        }
        if (altKapak !== false) ekle(A.slice());
        if (ustKapak !== false) ekle(B.slice().reverse());
    }
    function kat(alt, ust, y0, y1, altKapak, ustKapak) {
        const A = [], B = [];
        for (let i = 0; i < alt.length; i++) {
            A.push([alt[i][0], y0, alt[i][1]]);
            B.push([ust[i][0], y1, ust[i][1]]);
        }
        kat3(A, B, altKapak, ustKapak);
    }
    function prizma(pts, y0, y1, altKapak, ustKapak) {
        kat(pts, pts, y0, y1, altKapak, ustKapak);
    }
    function koni(pts, y0, tepe, altKapak) {
        const n = pts.length, A = [];
        for (let i = 0; i < n; i++) A.push([pts[i][0], y0, pts[i][1]]);
        for (let i = 0; i < n; i++) ekle([A[(i + 1) % n], A[i], tepe]);
        if (altKapak !== false) ekle(A.slice());
    }
    // A→B ekseninde kare kesitli çubuk (halat, kazık, gergi, bağ).
    // ⚠️ Halka −90°' şer ilerliyor: +90° verilirse `u × kenar` İÇERİ bakıyor
    // ve çubuğun yüzeyleri arka-yüz ayıklamasına takılıp KAYBOLUYOR.
    function cubuk(A, B, kalin, kapak) {
        const dx = B[0] - A[0], dy = B[1] - A[1], dz = B[2] - A[2];
        const L = Math.sqrt(dx * dx + dy * dy + dz * dz) || 1;
        const ux = dx / L, uy = dy / L, uz = dz / L;
        let ax = 0, ay = 1, az = 0;
        if (Math.abs(uy) > 0.9) { ax = 1; ay = 0; az = 0; }
        let ex = ay * uz - az * uy, ey = az * ux - ax * uz, ez = ax * uy - ay * ux;
        const en = Math.sqrt(ex * ex + ey * ey + ez * ez) || 1;
        ex /= en; ey /= en; ez /= en;
        const fx = uy * ez - uz * ey, fy = uz * ex - ux * ez, fz = ux * ey - uy * ex;
        const h = kalin / 2, A4 = [], B4 = [];
        for (let k = 0; k < 4; k++) {
            const c = Math.cos(-k * Math.PI / 2) * h, s = Math.sin(-k * Math.PI / 2) * h;
            A4.push([A[0] + ex * c + fx * s, A[1] + ey * c + fy * s, A[2] + ez * c + fz * s]);
            B4.push([B[0] + ex * c + fx * s, B[1] + ey * c + fy * s, B[2] + ez * c + fz * s]);
        }
        kat3(A4, B4, kapak !== false, kapak !== false);
    }

    return {
        ekle: ekle, kat3: kat3, kat: kat, prizma: prizma, koni: koni, cubuk: cubuk,
        geo: function () {
            const g = new THREE.BufferGeometry();
            g.setAttribute('position', new THREE.Float32BufferAttribute(P, 3));
            g.setAttribute('normal', new THREE.Float32BufferAttribute(N, 3));
            g.setIndex(I);
            g.computeBoundingSphere();
            return g;
        }
    };
}

// ===========================================================================
// 0b. KABUK — halka loft'u, PAYLAŞILAN köşe noktalarıyla YUMUŞAK normal
// ---------------------------------------------------------------------------
// ⚠️ Neden `yigin` değil: `yigin` yüz başına düz normal üretiyor. Bez yüzeyi
// (kanat, çatı, saçak eteği, sayeban) fasetli görünemez — 31°'lik çatının
// 80 bölüntüsü tek tek yüz olarak parlarsa çadır bir çadır olmaktan çıkıp
// katlanmış bir metal şemsiyeye dönüyor. Burada köşeler paylaşılıyor ve
// `computeVertexNormals` yüzeyi yumuşatıyor.
// halkalar: eşit uzunlukta [x,y,z] dizileri, ARTAN y sırasında.
// ===========================================================================
function kabuk(halkalar, kapali) {
    const P = [], I = [], n = halkalar[0].length;
    for (let j = 0; j < halkalar.length; j++)
        for (let i = 0; i < n; i++)
            P.push(halkalar[j][i][0], halkalar[j][i][1], halkalar[j][i][2]);
    const son = kapali ? n : n - 1;
    for (let j = 0; j < halkalar.length - 1; j++) {
        for (let i = 0; i < son; i++) {
            const i2 = (i + 1) % n;
            const a = j * n + i, b = j * n + i2, c = (j + 1) * n + i, d = (j + 1) * n + i2;
            I.push(a, c, d, a, d, b);
        }
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.Float32BufferAttribute(P, 3));
    g.setIndex(I);
    g.computeVertexNormals();
    return g;
}

// ===========================================================================
// 0c. MONOTON KÜBİK EĞRİ (PCHIP) — askeri kamyonun branda sarkmasından
// ---------------------------------------------------------------------------
// Kamyonda ölçülmüş gerekçe: dua/boşluk sırası bir SALINIM dizisi;
// Catmull-Rom her yerel uçta taşıp dalgayı büyütüyor. Fritsch-Carlson
// tegetleri yerel uçlarda SIFIRLANIR, yani istenen sarkma tam istenen
// değerde kalıyor (kamyonda 27 mm). Çadır bezinde aynı fikir: bez iki gergi
// halatının ARASINDA sarkıyor, halatın üstünde tam gergin.
// ===========================================================================
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
// 1. PALET
// ---------------------------------------------------------------------------
// ⚠️ metalness iki uçlu kural (devir §5.1): 0.85+ neredeyse SİYAH, ama
// metalness'i DÜŞÜRMEK açık renkte patlamayı ARTIRIR (difüz = albedo ×
// (1−metalness)). Buradaki risk parçası BÜYÜK AÇIK BEZ YÜZEYİ: çatı 106 m²
// ve tepeden bakışın neredeyse tamamı o. Bu yüzden bez orta tonda ve az
// miktarda metalness taşıyor; palet tek renk değil TOPTAN tarandı
// (cadir_palet_tara.py — hem palet merdiveni, hem suç bulma, hem eşik).
const C_BEZ    = '#9e4238';   // otağ bezi — BİRİNCİL renk (Osmanlı kırmızısı)
const C_BEZ_K  = '#873830';   // bezin gölge tonu (kapı kanadı ruloları, iç yüz)
const C_SERIT  = '#c2b189';   // aplike şerit/söve — İKİNCİL renk ('Trim')
const C_DESEN  = '#2f5c52';   // aplike sarkıt deseni (Wawel çadırının mavi-yeşili)
const C_AHSAP  = '#6b4f33';   // direkler, sayeban direkleri
const C_KAZIK  = '#4a3423';   // kazıklar
const C_HALAT  = '#9a8d70';   // gergi halatları
const C_ALEM   = '#a8862e';   // alem / topuz (pirinç)
const C_HALI   = '#5b2b24';   // iç zemin halısı (tint'e dahil DEĞİL)
const C_ESIK   = '#5c452c';   // giriş eşiği (ahşap platform)
const C_FLAMA  = ['#a83232', '#2f5ea8', '#c9a227'];  // doku gelmeden bayrak renkleri

// ===========================================================================
// 2. PLAN (metre) — Wawel + Dresden'den çözülmüş stadyum
// ===========================================================================
const R_UC     = 4.0000;                 // oval uç yarıçapı → en 8.00 m (Dresden)
const L_SIRT   = 5.4336;                 // 2L + 2πR = 36.00 m (Wawel alt çevre)
const L2       = L_SIRT / 2;             // 2.7168 — direkler ±L2'de
const H_DUVAR  = 3.6000;                 // kanat yüksekliği (Wawel)
const H_SIRT   = 6.0000;                 // sırt yüksekliği (Dresden)
const SACAK_R  = R_UC + 0.34;            // 4.34 — bezin duvarı aşan payı
const SARK     = 0.160;                  // halatlar ARASINDA bezin sarkması (m)

const P_DUZ    = L_SIRT;                 // her düz kenarın uzunluğu
const P_YAY    = Math.PI * R_UC;         // her yarım dairenin uzunluğu
const CEVRE    = 2 * P_DUZ + 2 * P_YAY;  // 35.9999… m

const N_YAY    = 28;                     // yarım daire başına bölüntü
const N_DUZ    = 12;                     // düz kenar başına bölüntü (yay adımına yakın)
const N_IST    = 2 * N_DUZ + 2 * N_YAY;  // 80 istasyon
const DIKIS    = 4;                      // her 4 istasyonda bir DİKİŞ → 20 dikiş
const YAY0     = 2 * N_DUZ + N_YAY;      // 52 — ön yayın ilk istasyonu
const TEPE_IST = YAY0 + N_YAY / 2;       // 66 — ön uç (−z) tam burada
const KAPI_A   = TEPE_IST - 4;           // 62 — kapı sol sövesi
const KAPI_B   = TEPE_IST + 4;           // 70 — kapı sağ sövesi

// İSTASYON EKSENİ. Stadyumun her noktası (0, cz) merkezinden dış normal (n)
// yönünde r kadar uzakta: nokta = (n.x·r, y, cz + n.z·r). r=0'da bütün halka
// SIRT ÇİZGİSİNE çöküyor — konik çadır (L=0) bu makinenin özel hâli.
const EKSEN = (function () {
    const a = [];
    for (let i = 0; i < N_DUZ; i++)
        a.push({ cz: -L2 + P_DUZ * i / N_DUZ, nx: 1, nz: 0 });
    for (let i = 0; i < N_YAY; i++) {
        const t = Math.PI * i / N_YAY;
        a.push({ cz: L2, nx: Math.cos(t), nz: Math.sin(t) });
    }
    for (let i = 0; i < N_DUZ; i++)
        a.push({ cz: L2 - P_DUZ * i / N_DUZ, nx: -1, nz: 0 });
    for (let i = 0; i < N_YAY; i++) {
        const t = Math.PI + Math.PI * i / N_YAY;
        a.push({ cz: -L2, nx: Math.cos(t), nz: Math.sin(t) });
    }
    return a;
})();

// DALGA — istasyonun kendi dikişine göre gerginliği. 0 = dikiş/halat üstü
// (bez tam gergin), 1 = iki halatın tam ortası (bez en çok sarkmış).
// PCHIP tegeti yerel uçlarda sıfırladığı için değerler TAM 0 ve TAM 1;
// aradaki iki örnek de 0.5. Kamyonun brandasında gözde DÖRT örnek vardı
// ("iki örnekle dalga zikzak çıkardı"), burada da dört.
const _dalgaEgri = egriYap([[-0.5, 1], [0, 0], [0.5, 1], [1, 0], [1.5, 1]]);
const DALGA = (function () {
    const a = [];
    for (let i = 0; i < N_IST; i++) a.push(_dalgaEgri((i % DIKIS) / DIKIS));
    return a;
})();

function dikisMi(i) { return i % DIKIS === 0; }
function kapidaMi(i) { return i > KAPI_A && i < KAPI_B; }

// ÇATI PROFİLİ — [yarıçap, yükseklik]. Saçaktan sırta.
// Orta gövde 31°'de (Wawel kanat + Dresden yükseklikten çözülen eğim);
// saçak ucu 47°'ye kırılıyor (bez duvarın üstünden aşağı kıvrılıyor),
// tepe 21°'ye yatıyor (bez direk başlığının üstünde yuvarlanıyor).
const CATI = [
    [4.340, 3.420],
    [4.185, 3.585],
    [3.900, 3.780],
    [3.380, 4.110],
    [2.820, 4.460],
    [2.240, 4.815],
    [1.660, 5.170],
    [1.090, 5.510],
    [0.560, 5.805],
    [0.060, 6.000]
];
const CATI_N = CATI.length;

// Çatı yüzeyinin (i, j) noktası — sarkma DAHİL.
// Sarkma ağırlığı saçakta 1, sırtta 0: bez halatlarla saçaktan çekiliyor,
// sırtta direk üstünde. Yani en derin sarkma tam saçak çizgisinde ve
// tepeden bakışta ORADA okunuyor.
function catiNokta(i, j) {
    const e = EKSEN[i], t = j / (CATI_N - 1);
    const w = Math.pow(1 - t, 1.15), d = DALGA[i];
    const r = CATI[j][0] - 0.055 * d * w;
    const y = CATI[j][1] - SARK * d * w;
    return [e.nx * r, y, e.cz + e.nz * r];
}
// Çatı yüzeyinin KESİRLİ kot noktası — çepeçevre kuşak buradan kuruluyor.
// ⚠️ Kuşağı sabit yarıçapta yazmak YANLIŞ olurdu: 31°'lik yüzeyde 0.45 m'lik
// bir yükseklik farkı 0.75 m yarıçap farkı demek, kuşağın alt kenarı bezin
// 0.2 m İÇİNDE kalıyordu. Kuşak yüzeyin kendisinden okunuyor.
function catiAraNokta(i, tj) {
    const j0 = Math.max(0, Math.min(CATI_N - 2, Math.floor(tj))), f = tj - j0;
    const a = catiNokta(i, j0), b = catiNokta(i, j0 + 1);
    return [a[0] + (b[0] - a[0]) * f, a[1] + (b[1] - a[1]) * f,
            a[2] + (b[2] - a[2]) * f];
}

// ===========================================================================
// 3. KANAT (duvar) — düşey bez, girişte AÇIK
// ---------------------------------------------------------------------------
// Üç halka: taban (kazıklar arasında bez hafif kalkıyor), orta (bez şişkin),
// üst (sırt kirişine bağlı, gergin). Bu üç halka bezi "gerilmiş kumaş"
// yapıyor; tek prizma olsaydı teneke bir silindir olurdu.
// ⚠️ ÇİFT YÜZ: kapı gerçek bir AÇIKLIK; tek yüzle karşı kanadın içi arka-yüz
// ayıklamasına takılır ve kapıdan HARİTA görünürdü.
const DUVAR_SIRA = (function () {          // kapı hariç, 62 → 70 arası atlanır
    const a = [];
    for (let k = 0; k <= N_IST - (KAPI_B - KAPI_A); k++)
        a.push((KAPI_B + k) % N_IST);
    return a;
})();
{
    function duvarHalka(y, dr) {
        const h = [];
        for (let k = 0; k < DUVAR_SIRA.length; k++) {
            const i = DUVAR_SIRA[k], e = EKSEN[i], d = DALGA[i];
            const r = R_UC + dr * d;
            h.push([e.nx * r, y + (y === 0 ? 0.05 * d : 0), e.cz + e.nz * r]);
        }
        return h;
    }
    const m = mesh(kabuk([duvarHalka(0, 0.010), duvarHalka(1.85, 0.055),
                          duvarHalka(H_DUVAR, 0.008)], false),
                   C_BEZ, { rough: 0.92, metal: 0.05, name: 'duvar' });
    m.material.side = THREE.DoubleSide;
    modelGroup.add(m);
}

// ===========================================================================
// 4. ÇATI + SIRT KAPAĞI
// ===========================================================================
{
    const halkalar = [];
    for (let j = 0; j < CATI_N; j++) {
        const h = [];
        for (let i = 0; i < N_IST; i++) h.push(catiNokta(i, j));
        halkalar.push(h);
    }
    const m = mesh(kabuk(halkalar, true), C_BEZ,
                   { rough: 0.92, metal: 0.05, name: 'cati' });
    m.material.side = THREE.DoubleSide;
    modelGroup.add(m);
}
{
    // Sırt kapağı: en üst halka 0.06 m yarıçapta kapanıyor, aradaki ince
    // yarığı ve iki direğin çıkış noktasını örten bez şerit.
    const y = yigin();
    y.prizma([[-0.115, -L2 - 0.20], [0.115, -L2 - 0.20],
              [0.115, L2 + 0.20], [-0.115, L2 + 0.20]], 5.955, 6.065, true, true);
    modelGroup.add(mesh(y.geo(), C_BEZ, { rough: 0.92, metal: 0.05, name: 'sirt_kapak' }));
}

// ===========================================================================
// 5. SAÇAK ETEĞİ — tepeden bakışın ikinci imzası
// ---------------------------------------------------------------------------
// Saçaktan sarkan, DİLİMLİ (scalloped) bez eteği. Dilimler dikişlerin
// ARASINDA derinleşiyor: bez orada zaten sarkıyor, etek onu abartıyor.
// Çadırı çadır yapan siluet bu.
// ⚠️ ETEK SAYEBANIN ÖNÜNDE KESİLİYOR. İlk kurulumda halka KAPALIYDI ve
// eteğin dilimleri sayebanın arka köşelerini DELİYORDU: etek saçaktan
// 0.42 m aşağı sarkıyor, sayebanın arka kenarı ise saçak eğrisinde, yani
// ikisi kaçınılmaz olarak kesişiyor. Gerçek otağda da sayebanın bağlandığı
// yerde saçak eteği yoktur. Kesit DUVAR_SIRA ile alınıyor ve bu tam olarak
// sayebanın genişliğine denk düşüyor: 62. ve 70. istasyon x = ∓1.909'da,
// sayeban ise x = ±1.900'de bitiyor.
{
    const ust = [], orta = [], alt = [];
    for (let k = 0; k < DUVAR_SIRA.length; k++) {
        const i = DUVAR_SIRA[k];
        const p = catiNokta(i, 0), d = DALGA[i];
        const derin = 0.20 + 0.22 * d;
        const e = EKSEN[i];
        ust.push([p[0], p[1], p[2]]);
        orta.push([e.nx * (SACAK_R + 0.02), p[1] - derin * 0.55, e.cz + e.nz * (SACAK_R + 0.02)]);
        alt.push([e.nx * (SACAK_R + 0.05), p[1] - derin, e.cz + e.nz * (SACAK_R + 0.05)]);
    }
    const m = mesh(kabuk([alt, orta, ust], false), C_BEZ,
                   { rough: 0.92, metal: 0.05, name: 'etek' });
    m.material.side = THREE.DoubleSide;
    modelGroup.add(m);
}

// ===========================================================================
// 6. APLİKE ŞERİTLER — İKİNCİL RENK
// ---------------------------------------------------------------------------
// Osmanlı otağının yüzeyi düz bez değil: kanadın üstünde geniş bir aplike
// kuşak, panel eklerinde düşey dikiş şeritleri, çatıda sırta koşan ışın
// dikişleri ve bir de çepeçevre kuşak var. Hepsi yüzeyden 0.04–0.06 m dışarı
// taşıyor (⚠️ aynı yüzeye oturan panellerde derinlik kavgası → polygonOffset).
function ofsetli(m, kat) {
    m.material.polygonOffset = true;
    m.material.polygonOffsetFactor = -kat;
    m.material.polygonOffsetUnits = -kat;
    return m;
}
// Kanadın (i, y) noktasındaki GERÇEK yarıçapı. Kanat üç halkalı olduğu için
// şeritlerin nereye oturacağı göz kararıyla yazılamaz: kuşağın alt kenarı
// bezin içine girerse şerit kaybolur, ölçülmüş tuzağın (yüzey yaması kavisi
// takip edemeyince yüzeyin içine girer) düz duvardaki karşılığı budur.
function duvarR(i, yy) {
    const d = DALGA[i];
    const a = [[0.000, 0.010], [1.850, 0.055], [H_DUVAR, 0.008]];
    let k = 0;
    while (k < a.length - 2 && yy > a[k + 1][0]) k++;
    const f = (yy - a[k][0]) / (a[k + 1][0] - a[k][0]);
    return R_UC + (a[k][1] + (a[k + 1][1] - a[k][1]) * f) * d;
}
{
    // 6a. Kanat üstü geniş aplike kuşağı (kapı hariç). Kabartma kesiti:
    // içeri → dışarı → dışarı → içeri, yani gerçek bir bordür.
    function kusakHalka(yy, dr) {
        const h = [];
        for (let k = 0; k < DUVAR_SIRA.length; k++) {
            const i = DUVAR_SIRA[k], e = EKSEN[i];
            const r = duvarR(i, yy) + dr;
            h.push([e.nx * r, yy, e.cz + e.nz * r]);
        }
        return h;
    }
    // ⚠️ KOT 2.05–2.81. İlk kurulumda 2.52–3.31'deydi ve saçak eteği
    // (2.84–3.42, r 4.34–4.39) frizin üst %60'ını ÖRTÜYORDU: önden bakışta
    // kalan şey eteğin kırmızı dilimlerinin altından sızan bir kırpıntıydı.
    // Friz artık eteğin tamamen altında, kendi bordürüyle okunuyor.
    const m = mesh(kabuk([kusakHalka(2.050, 0.000), kusakHalka(2.115, 0.070),
                          kusakHalka(2.745, 0.070), kusakHalka(2.810, 0.000)], false),
                   C_SERIT, { rough: 0.88, metal: 0.05, name: 'serit_yatay' });
    m.material.side = THREE.DoubleSide;
    modelGroup.add(ofsetli(m, 1));
}
{
    // 6b. Kanat dibinde ince kuşak — bezin yere değen kenarını okutuyor.
    function altHalka(yy, dr) {
        const h = [];
        for (let k = 0; k < DUVAR_SIRA.length; k++) {
            const i = DUVAR_SIRA[k], e = EKSEN[i];
            const r = duvarR(i, yy) + dr;
            h.push([e.nx * r, yy + 0.05 * DALGA[i] * (1 - yy / 1.2),
                    e.cz + e.nz * r]);
        }
        return h;
    }
    const m = mesh(kabuk([altHalka(0.240, 0.000), altHalka(0.300, 0.055),
                          altHalka(0.560, 0.055), altHalka(0.620, 0.000)], false),
                   C_SERIT, { rough: 0.88, metal: 0.05, name: 'serit_alt' });
    m.material.side = THREE.DoubleSide;
    modelGroup.add(ofsetli(m, 1));
}
// Düşey şerit fabrikası. Hedef yığın PARAMETRE: dikiş şeritleri ile kapı
// söveleri ayrı mesh olmak zorunda (ikisi farklı kalınlıkta ve söve duvarı
// ortalayarak straddle ediyor).
function seritDik(yig, i, kal, r0, y0, y1) {
    const e = EKSEN[i];
    const cx = e.nx * r0, cz = e.cz + e.nz * r0;
    const tx = -e.nz, tz = e.nx;                 // çevre boyunca teğet
    const a = 0.052, b = kal / 2;
    const ex = -tz, ez = tx;
    yig.prizma([[cx - tx * a - ex * b, cz - tz * a - ez * b],
                [cx + tx * a - ex * b, cz + tz * a - ez * b],
                [cx + tx * a + ex * b, cz + tz * a + ez * b],
                [cx - tx * a + ex * b, cz - tz * a + ez * b]], y0, y1, true, true);
}
{
    // 6c. Düşey dikiş şeritleri. Dikiş istasyonlarında bez TAM GERGİN
    // (DALGA = 0) olduğu için kanadın yarıçapı orada tam R_UC; şerit
    // R_UC..R_UC+0.05 aralığını kaplıyor.
    const y = yigin();
    for (let i = 0; i < N_IST; i++) {
        if (!dikisMi(i) || kapidaMi(i)) continue;
        seritDik(y, i, 0.050, R_UC + 0.025, 0.040, 3.560);
    }
    modelGroup.add(ofsetli(mesh(y.geo(), C_SERIT,
                                { rough: 0.88, metal: 0.05, name: 'serit_dikey' }), 1));
}
{
    // 6c-2. KAPI SÖVELERİ. Kalın (0.10 m) ve duvarı ORTALAYARAK straddle
    // ediyor: kapı gerçek bir KESİK olduğu için bezin sıfır kalınlıktaki
    // kenarı orada görünürdü; söve onu iki yandan örtüyor.
    const y = yigin();
    seritDik(y, KAPI_A, 0.100, R_UC, 0.000, H_DUVAR);
    seritDik(y, KAPI_B, 0.100, R_UC, 0.000, H_DUVAR);
    modelGroup.add(ofsetli(mesh(y.geo(), C_SERIT,
                                { rough: 0.88, metal: 0.05, name: 'kapi_sove' }), 2));
}
{
    // 6d. Çatı ışın dikişleri — saçaktan sırta koşan şeritler. Yüzeye
    // dik ötelemek yerine 0.05 m YUKARI ötelendi: çatı her yerde ~31°
    // eğimli olduğu için bu, yüzeyden 0.043 m dik yükseklik demek ve tek
    // satırda çalışıyor.
    const P = [], I = [];
    let sayac = 0;
    for (let i = 0; i < N_IST; i++) {
        if (!dikisMi(i)) continue;
        const e = EKSEN[i], tx = -e.nz, tz = e.nx;
        const taban = sayac * CATI_N * 2;
        for (let j = 0; j < CATI_N; j++) {
            const p = catiNokta(i, j);
            const t = j / (CATI_N - 1);
            const w = 0.052 * (0.35 + 0.65 * (1 - t));
            P.push(p[0] - tx * w, p[1] + 0.040, p[2] - tz * w);
            P.push(p[0] + tx * w, p[1] + 0.040, p[2] + tz * w);
        }
        for (let j = 0; j < CATI_N - 1; j++) {
            const a = taban + j * 2, b = a + 1, c = a + 2, d = a + 3;
            I.push(a, c, d, a, d, b);
        }
        sayac++;
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.Float32BufferAttribute(P, 3));
    g.setIndex(I);
    g.computeVertexNormals();
    const m = mesh(g, C_SERIT, { rough: 0.88, metal: 0.05, name: 'serit_cati' });
    m.material.side = THREE.DoubleSide;
    modelGroup.add(ofsetli(m, 2));
}
{
    // 6e. Çatıyı çepeçevre saran kuşak. Kotlar KESİRLİ SEVİYE olarak veriliyor
    // ve nokta yüzeyin kendisinden okunuyor (bkz. catiAraNokta'nın başındaki
    // uyarı); 0.05 m YUKARI öteleme 31°'lik yüzeyde 0.043 m dik kabartma.
    function catiKusak(tj, dy) {
        const h = [];
        for (let i = 0; i < N_IST; i++) {
            const p = catiAraNokta(i, tj);
            h.push([p[0], p[1] + dy, p[2]]);
        }
        return h;
    }
    const m = mesh(kabuk([catiKusak(3.55, 0.000), catiKusak(3.55, 0.050),
                          catiKusak(4.45, 0.050), catiKusak(4.45, 0.000)], true),
                   C_SERIT, { rough: 0.88, metal: 0.05, name: 'serit_cati_kusak' });
    m.material.side = THREE.DoubleSide;
    modelGroup.add(ofsetli(m, 1));
}
{
    // 6f. Aplike SARKIT deseni — kanat kuşağının altına asılı üçgen dilimler.
    // Wawel çadırının mavi-yeşili. ⚠️ TİNT'E DAHİL DEĞİL: kullanıcı bezi ve
    // şeridi boyadığında bu aksan kalsın, yoksa çadır iki düz renge iniyor.
    // ⚠️ r = R_UC + 0.095: bu istasyonlarda DALGA 0 ya da 1 olabiliyor ve
    // d=1'de kanat 2.0 m kotunda R_UC + 0.051'e şişiyor — 0.03'lük bir
    // öteleme sarkıtı bezin İÇİNDE bırakırdı (ölçüldü, duvarR ile).
    const y = yigin();
    for (let i = 0; i < N_IST; i++) {
        if (i % (DIKIS / 2) !== 0 || kapidaMi(i)) continue;
        const e = EKSEN[i], r = R_UC + 0.095;
        const cx = e.nx * r, cz = e.cz + e.nz * r;
        const tx = -e.nz, tz = e.nx, a = 0.30;
        y.ekle([[cx - tx * a, 2.030, cz - tz * a],
                [cx, 1.560, cz],
                [cx + tx * a, 2.030, cz + tz * a]]);
        y.ekle([[cx + tx * a, 2.030, cz + tz * a],
                [cx, 1.560, cz],
                [cx - tx * a, 2.030, cz - tz * a]]);
    }
    modelGroup.add(ofsetli(mesh(y.geo(), C_DESEN,
                                { rough: 0.90, metal: 0.05, name: 'desen' }), 2));
}

// ===========================================================================
// 7. GİRİŞ — açılıp yanlara bağlanmış kanatlar + eşik
// ===========================================================================
for (let s = -1; s <= 1; s += 2) {
    // Kapı bezi rulo yapılıp sövenin yanına bağlanmış. Hafif dışa yatık.
    const i = s < 0 ? KAPI_A : KAPI_B;
    const e = EKSEN[i], r = R_UC + 0.26;
    const cx = e.nx * r, cz = e.cz + e.nz * r;
    const g = new THREE.CylinderGeometry(0.155, 0.205, 3.30, 9);
    const m = mesh(g, C_BEZ_K, { rough: 0.94, metal: 0.04,
                                 name: 'kanat_' + (s > 0 ? 2 : 1) });
    m.position.set(cx, 1.66, cz);
    m.rotation.z = -s * 0.055;
    modelGroup.add(m);
}
{
    const y = yigin();
    for (let s = -1; s <= 1; s += 2) {
        const i = s < 0 ? KAPI_A : KAPI_B;
        const e = EKSEN[i];
        for (let k = 0; k < 2; k++) {
            const yy = 0.95 + k * 1.45;
            y.cubuk([e.nx * (R_UC - 0.02), yy, e.cz + e.nz * (R_UC - 0.02)],
                    [e.nx * (R_UC + 0.44), yy, e.cz + e.nz * (R_UC + 0.44)], 0.050);
        }
    }
    modelGroup.add(mesh(y.geo(), C_HALAT, { rough: 0.90, name: 'kanat_bag' }));
}
{
    // Giriş eşiği: alçak ahşap platform. Kapının önünde 1.15 m dışarı taşıyor.
    const y = yigin();
    const z0 = -L2 - R_UC - 1.15, z1 = -L2 - R_UC + 0.55;
    y.prizma([[-1.80, z0], [1.80, z0], [1.80, z1], [-1.80, z1]], 0, 0.150, false, true);
    modelGroup.add(mesh(y.geo(), C_ESIK, { rough: 0.95, metal: 0.03, name: 'esik' }));
}

// ===========================================================================
// 8. İÇ ZEMİN — kapıdan harita görünmesin
// ---------------------------------------------------------------------------
// ⚠️ Kalede avlu döşemesinin gerekçesiyle aynı, ama burada ek bir sebep var:
// kanat ÇİFT YÜZ ve kapı gerçek bir açıklık; zemin olmasaydı kapıdan doğrudan
// harita karosu görünürdü. TİNT'E DAHİL DEĞİL — halı bezle aynı renge
// düşseydi kapı boşluğu kaybolurdu.
{
    const y = yigin(), pts = [];
    for (let i = 0; i < N_IST; i++) {
        const e = EKSEN[i], r = R_UC - 0.04;
        pts.push([e.nx * r, e.cz + e.nz * r]);
    }
    y.prizma(pts, 0.020, 0.120, false, true);
    modelGroup.add(mesh(y.geo(), C_HALI, { rough: 0.97, metal: 0.02, name: 'ic_zemin' }));
}

// ===========================================================================
// 9. ANA DİREKLER — iki direk (Wawel: "dwumasztowy")
// ===========================================================================
for (let s = -1; s <= 1; s += 2) {
    const g = new THREE.CylinderGeometry(0.105, 0.150, 6.06, 12);
    const m = mesh(g, C_AHSAP, { rough: 0.86, metal: 0.06,
                                 name: 'ana_direk_' + (s > 0 ? 2 : 1) });
    m.position.set(0, 3.13, s * L2);
    modelGroup.add(m);
}
{
    // ARKA direğin tepesinde ALEM. Ön direğin tepesinde ana sancak var
    // (aşağıda `_BAYRAK`), bu yüzden alem yalnız arkada: iki tepe süsü
    // üst üste binmesin.
    const kure = mesh(new THREE.SphereGeometry(0.155, 10, 8), C_ALEM,
                      { metal: 0.45, rough: 0.30, name: 'alem' });
    kure.position.set(0, 6.34, L2);
    modelGroup.add(kure);
    const m = mesh(new THREE.ConeGeometry(0.075, 0.62, 8), C_ALEM,
                   { metal: 0.45, rough: 0.30, name: 'alem_ucu' });
    m.position.set(0, 6.79, L2);
    modelGroup.add(m);
}

// ===========================================================================
// 10. GERGİ HALATLARI + KAZIKLAR — tepeden bakışın ASIL imzası
// ---------------------------------------------------------------------------
// Uzun gergiler saçaktan (r 4.34, y 3.42) 2.90 m dışarıdaki kazığa iniyor;
// kazık çadırdan UZAKLAŞA yatık çakılı (halatın çekişi onu çıkarmasın diye).
// Halatlar dikiş istasyonlarında: bez tam orada gergin, aradaki gözlerde
// sarkıyor (SARK). Girişin önündeki üç istasyonda halat YOK — orada sayeban
// var ve gergiler kapının önünü keserdi.
const HALAT_IST = [];
for (let i = 0; i < N_IST; i++)
    if (dikisMi(i) && !(i >= KAPI_A - 2 && i <= KAPI_B + 2)) HALAT_IST.push(i);
{
    const yH = yigin(), yK = yigin();
    for (let k = 0; k < HALAT_IST.length; k++) {
        const i = HALAT_IST[k], e = EKSEN[i];
        const p = catiNokta(i, 0);
        const rk = SACAK_R + 2.90;
        yH.cubuk([p[0], p[1] - 0.03, p[2]],
                 [e.nx * rk, 0.360, e.cz + e.nz * rk], 0.055);
        // ⚠️ Gömülü uç 0.000'da DEĞİL 0.0371'de bitiyor: `cubuk` kare kesitli
        // ve eğik; uç kapağının alt köşesi eksenden 0.065·(0.32/0.560) = 0.037 m
        // aşağı taşıyor. 0.000 yazılınca kutu min y = −0.0371 ölçüldü ve
        // _centerAndGround bütün çadırı 37 mm HAVAYA kaldırıyordu.
        yK.cubuk([e.nx * (rk + 0.06), 0.4971, e.cz + e.nz * (rk + 0.06)],
                 [e.nx * (rk - 0.26), 0.0371, e.cz + e.nz * (rk - 0.26)], 0.130);
    }
    modelGroup.add(mesh(yH.geo(), C_HALAT, { rough: 0.92, metal: 0.04, name: 'halat' }));
    modelGroup.add(mesh(yK.geo(), C_KAZIK, { rough: 0.94, metal: 0.04, name: 'kazik' }));
}
{
    // ETEK KAZIKLARI: kanadın dibini yere tutturan kısa dizi. Saçağın hemen
    // DIŞINDA (r 4.52) duruyorlar ki tepeden bakışta örtülmesinler — çadırın
    // çevresindeki noktalı halka bunlar.
    const y = yigin();
    for (let i = 0; i < N_IST; i++) {
        if (!dikisMi(i) || kapidaMi(i)) continue;
        const e = EKSEN[i], rk = SACAK_R + 0.18;
        y.cubuk([e.nx * (rk + 0.05), 0.3468, e.cz + e.nz * (rk + 0.05)],
                [e.nx * (rk - 0.14), 0.0268, e.cz + e.nz * (rk - 0.14)], 0.105);
        y.cubuk([e.nx * (R_UC + 0.02), 0.120, e.cz + e.nz * (R_UC + 0.02)],
                [e.nx * rk, 0.280, e.cz + e.nz * rk], 0.045);
    }
    modelGroup.add(mesh(y.geo(), C_KAZIK, { rough: 0.94, metal: 0.04, name: 'etek_kazik' }));
}

// ===========================================================================
// 11. SAYEBAN (giriş tentesi) — "girişte açılan kanat/tente"
// ---------------------------------------------------------------------------
// Arka kenarı SAÇAK EĞRİSİNİ takip ediyor (düz olsaydı saçağın altından
// çıkmak yerine önüne asılırdı); öne doğru düz bir kenara açılıyor ve iki
// direkle tutuluyor. Ortası sarkıyor: dört noktadan asılı bezin doğal hâli.
const TEN_X = 1.90, TEN_Z = -10.55, TEN_Y_ON = 2.850;
const TEN_Y_ARKA = 3.240;   // saçağın en çok sarktığı kottan (3.260) da AŞAĞIDA
{
    const NU = 10, NV = 6, satirlar = [];
    function tenteNokta(u, v) {
        const x = -TEN_X + 2 * TEN_X * u;
        const zArka = -L2 - Math.sqrt(Math.max(0, SACAK_R * SACAK_R - x * x));
        const z = zArka + (TEN_Z - zArka) * v;
        const sag = 0.150 * Math.sin(Math.PI * u) * Math.pow(v, 0.6);
        return [x, TEN_Y_ARKA + (TEN_Y_ON - TEN_Y_ARKA) * v - sag, z];
    }
    for (let j = 0; j <= NV; j++) {
        const s = [];
        for (let i = 0; i <= NU; i++) s.push(tenteNokta(i / NU, j / NV));
        satirlar.push(s);
    }
    const m = mesh(kabuk(satirlar, false), C_BEZ,
                   { rough: 0.92, metal: 0.05, name: 'tente' });
    m.material.side = THREE.DoubleSide;
    modelGroup.add(m);

    // Sayebanın ön kenarındaki dilimli etek (İKİNCİL renk).
    const on = satirlar[NV], alt = [], ust = [];
    for (let i = 0; i <= NU; i++) {
        const d = _dalgaEgri(((i % 2) === 0) ? 0 : 0.5);
        ust.push([on[i][0], on[i][1], on[i][2]]);
        alt.push([on[i][0], on[i][1] - 0.16 - 0.14 * d, on[i][2] + 0.02]);
    }
    const m2 = mesh(kabuk([alt, ust], false), C_SERIT,
                    { rough: 0.88, metal: 0.05, name: 'tente_etek' });
    m2.material.side = THREE.DoubleSide;
    modelGroup.add(m2);

    // Sayebanın ÜST yüzündeki kenar bordürü. Gerekçe TEPEDEN BAKIŞ: sayeban
    // yukarıdan bakınca düz bir kırmızı dikdörtgene iniyordu ve çadırın
    // yanında bir masa gibi duruyordu; bordür ona kenar veriyor.
    // Bordür (u,v) parametre uzayında içeri kaydırılarak kuruluyor: 0.14 m
    // dünya payı → u'da 0.037, v'de 0.036.
    const dis = [], ic = [];
    for (let j = 0; j <= NV; j++) { dis.push(tenteNokta(0, j / NV)); ic.push(tenteNokta(0.037, j / NV)); }
    for (let i = 1; i <= NU; i++) { dis.push(tenteNokta(i / NU, 1)); ic.push(tenteNokta(i / NU, 0.964)); }
    for (let j = NV - 1; j >= 0; j--) { dis.push(tenteNokta(1, j / NV)); ic.push(tenteNokta(0.963, j / NV)); }
    for (let k = 0; k < dis.length; k++) { dis[k][1] += 0.030; ic[k][1] += 0.030; }
    const m3 = mesh(kabuk([ic, dis], false), C_SERIT,
                    { rough: 0.88, metal: 0.05, name: 'tente_serit' });
    m3.material.side = THREE.DoubleSide;
    modelGroup.add(ofsetli(m3, 2));
}
for (let s = -1; s <= 1; s += 2) {
    const g = new THREE.CylinderGeometry(0.058, 0.078, TEN_Y_ON, 9);
    const m = mesh(g, C_AHSAP, { rough: 0.86, metal: 0.06,
                                 name: 'tente_direk_' + (s > 0 ? 2 : 1) });
    m.position.set(s * TEN_X, TEN_Y_ON / 2, TEN_Z);
    modelGroup.add(m);
}
{
    const yH = yigin(), yK = yigin();
    for (let s = -1; s <= 1; s += 2) {
        const px = s * (TEN_X + 1.15), pz = TEN_Z - 1.15;
        yH.cubuk([s * TEN_X, TEN_Y_ON - 0.10, TEN_Z], [px, 0.320, pz], 0.050);
        yK.cubuk([px + s * 0.05, 0.4490, pz - 0.05], [px - s * 0.12, 0.0290, pz + 0.12], 0.115);
    }
    modelGroup.add(mesh(yH.geo(), C_HALAT, { rough: 0.92, metal: 0.04, name: 'tente_halat' }));
    modelGroup.add(mesh(yK.geo(), C_KAZIK, { rough: 0.94, metal: 0.04, name: 'tente_kazik' }));
}

// ===========================================================================
// 12. BAYRAK DİREKLERİ — Studio3D `_BAYRAK` sözleşmesi
// ---------------------------------------------------------------------------
// Motor şu adları arıyor (AD DEĞİŞTİRME):
//   direkGrup_n  -> rotation.y = YÖN; grubun TAMAMI gizlenebilir
//   direkEgim_n  -> rotation.x = EĞİM, rotation.z = YATIŞ
//   bayrakGrup_n -> bezin asıldığı nokta (motor rotation.x/z'yi SIFIRLAR)
//   bayrakYon_n  -> rotation.y = bezin uzanma yönü
//   bayrak_n     -> bez mesh'i; ülke bayrağı dokusu buraya giydiriliyor
//
// SIRA ÖNEMLİ: `adet=1` iken motor yalnız 1. grubu açık bırakıyor (kale
// ajanının gerçek motorda ölçtüğü davranış). Bu yüzden 1 = ÖN ANA DİREĞİN
// tepesindeki sancak — çadırın en yüksek ve en görünür noktası. 2 ve 3
// girişin iki yanına dikilmiş serbest sancak direkleri; onlar kaybolunca
// çadırın kendi yapısından hiçbir şey eksilmiyor (bu yüzden sayeban
// direkleri BİLEREK bu gruplara konmadı — 1 bayrak seçen kullanıcı
// sayebanı kaybederdi).
//
// Direkler DİK (eğim/yatış 0), yön 90: bez doğuya uzanır, yüzü varsayılan
// güney kamerasına döner — masa bayrağının ve kalenin tek-bayrak kuralı.
const DIREK = [
    [0.00, -L2, 6.060, 2.80, 2.30, 1.50],   // ana sancak — ÖN direğin tepesi
    [-3.30, -8.30, 0.000, 4.40, 1.95, 1.28],
    [3.30, -8.30, 0.000, 4.40, 1.95, 1.28]
];
for (let i = 0; i < 3; i++) {
    const n = i + 1, d = DIREK[i];

    const yon = new THREE.Group();
    yon.name = 'direkGrup_' + n;
    yon.position.set(d[0], d[2], d[1]);
    yon.rotation.y = Math.PI / 2;               // varsayılan YÖN 90 (motor ezer)
    modelGroup.add(yon);

    const eg = new THREE.Group();
    eg.name = 'direkEgim_' + n;
    yon.add(eg);

    const direk = mesh(new THREE.CylinderGeometry(0.055, 0.075, d[3], 8), '#3a2c1e',
                       { rough: 0.9, name: 'bayrak_direk_' + n });
    direk.position.set(0, d[3] / 2, 0);
    eg.add(direk);

    const topuz = mesh(new THREE.SphereGeometry(0.115, 10, 8), C_ALEM,
                       { metal: 0.45, rough: 0.3, name: 'bayrak_topuz_' + n });
    topuz.position.set(0, d[3] + 0.09, 0);
    eg.add(topuz);

    const bg = new THREE.Group();
    bg.name = 'bayrakGrup_' + n;
    bg.position.set(0, d[3] - 0.18, 0);
    eg.add(bg);

    const by = new THREE.Group();
    by.name = 'bayrakYon_' + n;
    bg.add(by);

    // Bez masa bayrağı/kale ile BİREBİR aynı: düzlem +x'te açılır,
    // rotateY(-90) ile +z'ye çevrilir, bağlantı kenarı direkte kalır,
    // serbest uç kendi ağırlığıyla sarkar, rüzgâr dalgası u boyunca
    // GEOMETRİYE PİŞİRİLİR (davranış yok).
    const EN = d[4], BOY = d[5];
    const geo = new THREE.PlaneGeometry(EN, BOY, 14, 3);
    geo.rotateY(-Math.PI / 2);
    const pos = geo.attributes.position;
    for (let k = 0; k < pos.count; k++) {
        const u = (pos.getZ(k) + EN / 2) / EN;    // 0 = direk yanı, 1 = serbest uç
        pos.setX(k, pos.getX(k) + Math.sin(u * Math.PI * 1.9) * 0.10 * EN * u);
        pos.setY(k, pos.getY(k) - 0.085 * BOY * u * u);
    }
    pos.needsUpdate = true;
    geo.computeVertexNormals();
    const bez = mesh(geo, C_FLAMA[i], { rough: 0.86, name: 'bayrak_' + n });
    bez.material.side = THREE.DoubleSide;
    bez.position.set(0, -BOY / 2, EN / 2 + 0.08);
    by.add(bez);
}
