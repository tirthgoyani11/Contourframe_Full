// Mızraklı piyade — KLASİK YUNAN HOPLİTİ, yürüyüş hâlinde.
// Historical Warfare grubunun ilk modeli.
//
// ⚠️ ID `mizrakli-piyade`. `asker` ve `piyade` DOLU (ikisi de Modern Warfare
// figürü); `hoplit` gibi kısa bir id yerine ne olduğunu söyleyen id seçildi.
// EN adı "Spearman".
//
// ============================================================================
// REFERANS VE ÖLÇÜLERİN KAYNAĞI  (hiçbiri ezberden değil)
// ============================================================================
// Figür: MÖ 5. yy Yunan hopliti — aspis + dory + Korint miğferi + linothorax
// + pteruges + knemides (baldır zırhı).
//
//  * BOY 1.705 m. Klasik dönem Yunan erkeğinin iskeletten kestirilen ortalama
//    boyu 170.5 cm (n=58; Korint ve Atina Kerameikos malzemesiyle
//    doğrulanmış). Modern piyade 1.800 m; aradaki 9.5 cm'lik fark rastlantı
//    değil, dönem farkı.
//    Kaynak: Stature estimation in Ancient Greece (Archaeol Anthropol Sci,
//    2023) ve aynı serideki Klasik dönem ortalamaları.
//
//  * ASPİS (kalkan): çap 0.82 m, kâse derinliği 0.10 m, ofset kenar 0.045 m.
//    Bu üç sayı DOĞRUDAN ÖLÇÜLMÜŞ tek örnekten geliyor: 1830'da Bomarzo'da
//    bulunan ve Vatikan'da (Museo Gregoriano Etrusco) duran aspis — bugüne
//    ahşap çekirdeği, deri astarı ve bronz kaplamasıyla ulaşan TEK aspis.
//    Genel aralık 0.80-1.00 m; "0.9 m'yi çoğu zaman aşardı" da deniyor, ama
//    ölçülmüş tek parçayı almak uydurmadan iyidir. Ağırlık ~7 kg.
//    ⚠️ Bu seçim aynı zamanda GEOMETRİK bir zorunluluk: 0.90 m'lik bir kalkan
//    eğik tutulduğunda üst kenarı gövdenin İÇİNE giriyordu (ölçüldü: 18°
//    eğimde üst kenar göğsün 3.4 cm içinde). 0.82 m'de kenar omzun dışından
//    geçiyor.
//
//  * DORY (mızrak): toplam 2.500 m. Kaynak aralığı 2-3 m, sap çapı 5 cm,
//    sap kütlesi 0.91-1.81 kg (kızılcık ya da dişbudak).
//    - Uç (aichme): 0.265 m boy, 0.044 m en. Bu ikisi Pitt Rivers Museum'daki
//      MARATHON mızrak ucu 1884.120.42'nin katalog ölçüsü (yaprak biçimli,
//      hafif orta sırtlı).
//    - Sauroter (dipçik/kertenkele öldüren): 0.272 m boy, 0.020 m en, kovan
//      çapı 0.022 m, 480 g — yayımlanmış bir rekonstrüksiyonun ölçüleri.
//    - TUTUŞ NOKTASI EZBERDEN YAZILMADI, DENGE NOKTASI HESAPLANDI:
//        sap  1.36 kg (0.91-1.81 ortası), ağırlık merkezi 1.250 m
//        sauroter 0.480 kg, merkezi 0.136 m
//        uç ~0.393 kg: bıçak 0.180x0.044x0.005 m mercek (2/3 dolu) = 0.208 kg
//                      + kovan ø0.026 / 0.004 et / 0.085 boy = 0.185 kg,
//                      demir 7870 kg/m3; ortak merkez 2.348 m
//        x_denge = (1.36*1.250 + 0.480*0.136 + 0.393*2.348) / 2.233 = 1.204 m
//      Yani el, dipçikten 1.204 m ileride; mızrağın 1.296 m'si elin önünde,
//      1.204 m'si arkasında. Sauroter'in var oluş sebebi tam olarak bu:
//      denge noktasını geriye çekip tek elle taşınabilir kılmak.
//
//  * DURUŞ: mızrak ÜSTTEN kavranmış (overarm) ve ucu hafif AŞAĞI eğik. Bu
//    duruş uydurma değil: Chigi vazosunun (yak. MÖ 650) hoplit sırası bu
//    tutuşu ve aşağı eğik mızrakları gösteriyor. Eğim 13°, 5° de içeri yaw.
//
//  * KORİNT MİĞFERİ: kabuk yüksekliği 0.23 m; genişlik 0.184 m, derinlik
//    0.254 m (Metropolitan Museum 256133 ve MFAH 48126 katalog ölçüleri).
//    Ağırlık 1.2-2.5 kg aralığında.
//
//  * KNEMIDES (baldır zırhı) ve SANDALET ölçüsü katalogdan değil, figürün
//    kendi zincirinden TÜRETİLDİ: zırh dizden bileğe (BALDIR = 0.407 m),
//    ayak boyu boyun %14.3'ü (0.243 m).
//
// ============================================================================
// MODERN `piyade` İLE KARIŞMAMASI
// ============================================================================
// Ölçülen fark tek bir sayıda değil, üç sayıda birden:
//   piyade           kutu 1.010 x 1.800 x 0.517   (uzun ekseni TÜFEK)
//   mizrakli-piyade  kutu ~2.43 x ~1.82 x ~0.90   (uzun ekseni MIZRAK)
// Tepeden bakışta piyade tek bir dar gövde lekesi; hoplitte 2.4 m'lik ince
// bir çizgi (mızrak) YANINDA 0.82 m'lik dolu bir elips (eğik kalkan) var.
// Kalkanın tepeden okunması için eğim ŞART: dik duran bir kalkan tepeden
// yalnız kenar çizgisi olarak görünürdü. 18° eğim onu 0.82 x 0.28 m'lik bir
// elipse çeviriyor. Sayılar mizrakli_tepe_kiyas.py'de.
//
// ============================================================================
// PARÇA / GRUP SÖZLEŞMESİ (studio-3d.js `registerBehavior('mizrakli-piyade')`)
// ============================================================================
//   kalca_grup      : bütün figür. Davranış YALNIZ position.y yazar.
//   bacak_1/2       : kalça mafsalı. rotation.z = uyluk açısı (+ = ileri).
//   diz_1/2         : diz mafsalı (bacak_i'nin çocuğu). rotation.z = -diz bükümü.
//   ayak_1/2        : bilek mafsalı (diz_i'nin çocuğu). rotation.z = ayak eğimi.
//   omuz_grup       : omuz kuşağı + iki kol + KALKAN + MIZRAK. rotation.y =
//                     gövde karşı-dönüşü.
//   userData.mizrakli : bacak zincirinin ölçüleri (adım uzunluğu buradan çözülür)
//
// ⚠️ 1/2 numaralandırması: bacak_1 = model +z tarafı, _2 = -z tarafı.
// ⚠️ HARİTA SOLDAN SAĞA AYNALIYOR (devir §5.3, det(projection) < 0). Bu yüzden
// KALKAN ham koordinatta +z kolunda, MIZRAK -z elinde kuruldu; ürün onları
// aynalayıp kalkanı SOL kola, mızrağı SAĞ ele taşıyor — hoplitin gerçek
// düzeni. Düz bir THREE sahnesinde ters görünür, o NORMALDİR.
//
// YÖN: burun +x, üst +y, taban y=0. Ölçüler gerçek metre.
//
// ============================================================================
// 0. RENKLER
// ============================================================================
// ⚠️ metalness KURALI (devir §5.1, iki uçlu): 0.85+ neredeyse SİYAH (sahnede
// environment map yok), ama metalness'i DÜŞÜRMEK açık renkte patlamayı
// ARTIRIR. Bronz burada en kritik parça (miğfer + kalkan kenarı + baldır
// zırhı tepe bakışının büyük kısmı): metal 0.42 / rough 0.34'te oturdu.
// Palet parlaklik.py ile TARANDI — tek renk değil, PALETİN TAMAMI
// (mizrakli_palet_tara.py).
const C_KALKAN  = '#8c4a3c';   // kalkan yüzü — _TINT birincil varsayılanı
const C_TUNIK   = '#9a5344';   // tunik/chiton — birincil renkle aynı aile
const C_SORGUC  = '#7e4234';   // at kılı sorguç (boyalı)
const C_BRONZ   = '#9a7c43';   // miğfer, kalkan kenarı, baldır zırhı — ikincil
const C_BRONZ_K = '#7d6234';   // bronz koyu detay (kabara, bant, yatak)
const C_KETEN   = '#b3a888';   // linothorax keteni
const C_KETEN_K = '#9a8f71';   // linothorax dikiş/omuzluk
const C_DERI    = '#6b543c';   // pteruges, kayış, sandalet
const C_DERI_K  = '#4b3b2b';   // koyu deri, kalkan iç astarı
const C_AHSAP   = '#7a5f3e';   // mızrak sapı (kızılcık)
const C_DEMIR   = '#61656b';   // mızrak ucu + sauroter (demir)
const C_TEN     = '#ac8368';   // yüzün görünen alanı, kollar, bacaklar
const C_KOYU    = '#1d1e21';   // göz/ağız yarığı, derin oyuk

// ============================================================================
// 1. TEMEL ÖLÇÜLER — bacak zinciri buradan çıkıyor
// ============================================================================
const BOY       = 1.705;
const HIP_Y     = 0.905;   // femur başı (boyun %53'ü — antropometrik)
const HIP_Z     = 0.093;
const UYLUK     = 0.417;   // kalça → diz
const BALDIR    = 0.407;   // diz → bilek
const BILEK_Y   = HIP_Y - UYLUK - BALDIR;   // = 0.081
const TABAN_DY  = -0.081;  // bilekten tabana (sandalet, postaldan ince)
const TOPUK_X   = -0.068;
const BURUN_X   = 0.175;   // ayak boyu 0.243 = boyun %14.3'ü
const AYAK_W    = 0.052;
const OMUZ_Y    = 1.340;
const OMUZ_Z    = 0.167;

// ---- kalkan (Bomarzo aspisi) ----
const K_R    = 0.410;      // yarıçap (çap 0.82 m)
const K_H    = 0.100;      // kâse derinliği
const K_F    = 0.045;      // ofset kenar genişliği
const K_CX = 0.235, K_CY = 0.985, K_CZ = 0.170;    // kalkan merkezi
const K_PIT = 18 * Math.PI / 180;                  // yukarı eğim
const K_YAW = 12 * Math.PI / 180;                  // dışa yaw
// Kalkan ekseni (dış normal): ileri + yukarı + DIŞA.
const KU = [Math.cos(K_PIT) * Math.cos(K_YAW), Math.sin(K_PIT),
            Math.cos(K_PIT) * Math.sin(K_YAW)];

// ---- mızrak (dory) ----
const M_BOY   = 2.500;     // toplam boy
const M_ON    = 1.296;     // elin ÖNÜNDE kalan kısım (2.500 - 1.204)
const M_ARKA  = 1.204;     // elin ARKASINDA kalan kısım = denge noktası
const M_SAP_R = 0.025;     // sap yarıçapı (çap 5 cm)
const M_UC    = 0.265;     // uç boyu
const M_UC_W  = 0.044;     // uç eni
const M_SAU   = 0.272;     // sauroter boyu
const M_PIT   = -13 * Math.PI / 180;
const M_YAW   = 5 * Math.PI / 180;
const MU = [Math.cos(M_PIT) * Math.cos(M_YAW), Math.sin(M_PIT),
            Math.cos(M_PIT) * Math.sin(M_YAW)];

// ============================================================================
// 2. MONOTON KÜBİK EĞRİ (PCHIP) — otomobil.js §2, piyade.js §2 ile aynı gerekçe
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
    // ⚠️ SARIM ISTASYON YONUNE BAGLI. Halka (x, z) duzleminde her zaman
    // ayni yonde (+x'ten +z'ye) yaziliyor, ama surme ekseni U = istasyonlarin
    // gittigi yon. Artan y'de U = +y ve (a, c, d2) normali U x T = +radyal
    // (disa, DOGRU); AZALAN y'de U = -y ve ayni sira ICE bakiyor. Bu dosyada
    // pteruges_1..14 azalan y ile yaziliyor (0.944 -> 0.842) ve on dorduncu
    // serit de ters sarimliydi. Isaret artik istasyonlardan turetiliyor;
    // artan cagrilarda uretilen indeksler DEGISMIYOR.
    const yukari = ist[M - 1].y >= ist[0].y;
    for (let i = 0; i < M - 1; i++) {
        for (let j = 0; j < n; j++) {
            const j2 = (j + 1) % n;
            const a = i * n + j, b = i * n + j2;
            const c = (i + 1) * n + j, d2 = (i + 1) * n + j2;
            if (yukari) IDX.push(a, c, d2, a, d2, b);
            else IDX.push(a, d2, c, a, b, d2);
        }
    }
    // kapakEkle'nin son argumani "bu kapak +y'ye mi baksin"; azalan sirada
    // ist[0] UST, ist[M-1] ALT oldugu icin ikisi de yer degistiriyor.
    if (!opts.acikAlt) kapakEkle(P, IDX, ist[0], n, !yukari);
    if (!opts.acikUst) kapakEkle(P, IDX, ist[M - 1], n, yukari);
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

// İKİ NOKTA ARASI UZUV — kol/bacak/kayış/sap. r = [[t, yarıçap, yassılık]].
function uzuv(ad, A, B, r, n, renk, opts) {
    opts = opts || {};
    const vx = B[0] - A[0], vy = B[1] - A[1], vz = B[2] - A[2];
    const L = Math.sqrt(vx * vx + vy * vy + vz * vz) || 1;
    const ux = vx / L, uy = vy / L, uz = vz / L;
    let ax = 0, ay = 0, az = 1;
    if (Math.abs(uz) > 0.9) { ax = 1; ay = 0; az = 0; }
    let ex = ay * uz - az * uy, ey = az * ux - ax * uz, ez = ax * uy - ay * ux;
    let e = Math.sqrt(ex * ex + ey * ey + ez * ez) || 1;
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
// 3b. DÖNEL YÜZEY — kalkan kâsesi, kenar halkası, kabara, sorguç yatağı
// ============================================================================
// ⚠️ NEDEN AYRI BİR MAKİNE: aspis bir DÖNEL yüzeydir (sığ küre kalotu + ofset
// kenar). Kutu ya da düz extrude ile kurulursa kâsenin bombesi kayboluyor ve
// kalkan bir levhaya iniyor — motosiklet dersinin kalkan hâli.
//
// profil: [[u, r], ...]  u = EKSEN boyunca uzaklık, r = eksene dik yarıçap.
// Eksen: O noktasından U yönüne. SARIM TÜRETİMİ: P(i,j) = O + U*u + e*r*cos +
// f*r*sin, f = U x e. (a,c,d)+(a,d,b) sarımının normali
//     r*da * ( -du*e + dr*U )
// çıkıyor. Yani profil KUTUP -> KENAR yönünde (du<0, dr>0) ilerlerken normal
// hem dışa hem ileri bakıyor: DIŞ normal. Ters yönde ilerleyen (iç yüz)
// bölüm de kendiliğinden doğru işaretleniyor. Bu yüzden dış yüz, kenar ve iç
// yüz TEK bir kapalı profille yazılabiliyor.
function donel(ad, profil, O, U, n, renk, opts) {
    opts = opts || {};
    const ux = U[0], uy = U[1], uz = U[2];
    let ax = 0, ay = 0, az = 1;
    if (Math.abs(uz) > 0.9) { ax = 1; ay = 0; az = 0; }
    let ex = ay * uz - az * uy, ey = az * ux - ax * uz, ez = ax * uy - ay * ux;
    const en = Math.sqrt(ex * ex + ey * ey + ez * ez) || 1;
    ex /= en; ey /= en; ez /= en;
    const fx = uy * ez - uz * ey, fy = uz * ex - ux * ez, fz = ux * ey - uy * ex;
    const P = [], IDX = [], M = profil.length;
    for (let i = 0; i < M; i++) {
        const u = profil[i][0], r = profil[i][1];
        const cx = O[0] + ux * u, cy = O[1] + uy * u, cz = O[2] + uz * u;
        for (let j = 0; j < n; j++) {
            const a = 2 * Math.PI * j / n, ca = Math.cos(a) * r, sa = Math.sin(a) * r;
            P.push(cx + ex * ca + fx * sa, cy + ey * ca + fy * sa, cz + ez * ca + fz * sa);
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
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.Float32BufferAttribute(P, 3));
    geo.setIndex(IDX);
    geo.computeVertexNormals();
    const m = mesh(geo, renk, {
        metal: opts.metal == null ? 0.10 : opts.metal,
        rough: opts.rough == null ? 0.80 : opts.rough,
        flat: !!opts.flat, name: ad
    });
    if (opts.ciftYuz) m.material.side = THREE.DoubleSide;
    (opts.ebeveyn || modelGroup).add(m);
    return m;
}

// Sığ küre kalotu: yarıçapı R olan dairede h kadar bombe.
// x(r) = sqrt(S^2 - r^2) - (S - h),  S = (R^2 + h^2) / (2h)
function kalot(R, h, r) {
    const S = (R * R + h * h) / (2 * h);
    const q = S * S - r * r;
    return (q > 0 ? Math.sqrt(q) : 0) - (S - h);
}

// ============================================================================
// 4. GRUPLAR — pivot-ofset ikilisi (motorun _WHEELS.front mekanizması uzuvda
// KULLANILAMAZ: o her parçayı kendi merkezinde döndürür, uzuv ise mafsaldan)
// ============================================================================
const kalca = new THREE.Group(); kalca.name = 'kalca_grup';
modelGroup.add(kalca);

const omuz = new THREE.Group(); omuz.name = 'omuz_grup';
// Konumu (0,0,0): dönüş DÜŞEY eksende, x/z sıfır olmak ZORUNDA (orta hat).
kalca.add(omuz);

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
modelGroup.userData.mizrakli = {
    hipY: HIP_Y, hipZ: HIP_Z, uyluk: UYLUK, baldir: BALDIR,
    bilekY: BILEK_Y, tabanDy: TABAN_DY, topukX: TOPUK_X, burunX: BURUN_X,
    boy: BOY
};

// ============================================================================
// 5. GÖVDE — kesitten loft (kasık → boyun dibi). Bu yüzey TUNİK'tir.
// ============================================================================
// Yükseklikler 1.705 m'ye göre; genişlikler modern piyadenin plaka taşıyıcı
// hacminden %6 dar (hoplit gövdesinin üstünde plaka yok, keten var).
// ⚠️ Alt uç 0.706'ya kadar sivriltildi: düz kapakla biterse arkadan bakışta
// iki uyluk arasından o disk görünüyor (piyadede ölçülmüş tuzak).
const G_W = egriYap([
    [0.706, 0.041], [0.722, 0.073], [0.739, 0.098], [0.805, 0.139], [0.871, 0.159],
    [0.947, 0.151], [1.023, 0.138], [1.099, 0.141], [1.184, 0.153], [1.269, 0.165],
    [1.345, 0.173], [1.392, 0.165], [1.421, 0.132]
]);
const G_D = egriYap([
    [0.706, 0.039], [0.722, 0.066], [0.739, 0.086], [0.805, 0.109], [0.871, 0.118],
    [0.947, 0.112], [1.023, 0.102], [1.099, 0.104], [1.184, 0.114], [1.269, 0.121],
    [1.345, 0.124], [1.392, 0.117], [1.421, 0.088]
]);
const G_OX = egriYap([
    [0.706, 0.010], [0.739, 0.008], [0.871, 0.002], [1.023, 0.004], [1.184, 0.010],
    [1.345, 0.008], [1.421, 0.000]
]);
const G_US = egriYap([
    [0.706, 1.10], [0.739, 1.05], [0.871, 1.00], [1.023, 0.92], [1.184, 0.90],
    [1.345, 0.86], [1.421, 0.95]
]);
loft('tunik', 24,
     istUret(0.706, 1.421, 16, G_D, G_W, { eOx: G_OX, eUs: G_US, yassi: 0.92 }),
     C_TUNIK, { ebeveyn: kalca, rough: 0.92, metal: 0.05 });

// Kasık köprüsü: gövde loftu bacak dipleriyle kesişsin diye (yoksa uyluk
// üstünde 2-3 cm'lik açık kalıyor ve siluette kopukluk okunuyor).
for (let i = 0; i < 2; i++) {
    kure('kasik_' + (i + 1), 0.084, [0.004, 0.880, (i ? -1 : 1) * 0.084], C_TUNIK,
         { ebeveyn: kalca, olcek: [1.12, 1.0, 1.0], rough: 0.92, metal: 0.05 });
}

// ---- tunik eteği: kalçadan uyluk ortasına inen kısa chiton ------------------
// ⚠️ Hem uzunluğu hem genişliği SALINIMA GÖRE seçildi: uyluk 25° savrulduğunda
// y=0.83'te ön yüzeyi x=0.117'ye çıkıyor; etek orada 0.150 → uyluk eteği
// delmiyor. Daha uzun bir etek (diz üstü) yürüyüşte uyluğu dışarı verirdi.
const E_W = egriYap([[0.940, 0.158], [0.885, 0.172], [0.830, 0.184]]);
const E_D = egriYap([[0.940, 0.126], [0.885, 0.139], [0.830, 0.150]]);
loft('tunik_etek', 22, istUret(0.830, 0.940, 5, E_D, E_W, { us: 0.95, ox: 0.006 }),
     C_TUNIK, { ebeveyn: kalca, rough: 0.92, metal: 0.05 });

// ============================================================================
// 6. LINOTHORAX — keten kompozit zırh + omuzluklar (epomides) + pteruges
// ============================================================================
// Üs 0.62: linothorax gerçekten prizmatiktir (kat kat keten yapıştırılıp
// sertleştirilmiş), göğüs ve sırt düz, yanlar kayışla toplanmış.
const Z_W = egriYap([
    [0.945, 0.160], [1.010, 0.170], [1.100, 0.167], [1.210, 0.172],
    [1.300, 0.180], [1.375, 0.176]
]);
const Z_D = egriYap([
    [0.945, 0.122], [1.010, 0.130], [1.100, 0.127], [1.210, 0.132],
    [1.300, 0.139], [1.375, 0.134]
]);
loft('zirh', 22, istUret(0.945, 1.375, 8, Z_D, Z_W, { us: 0.62, ox: 0.006 }),
     C_KETEN, { ebeveyn: kalca, rough: 0.84, metal: 0.07 });
// Göğüs bandı ve bel bandı — tek tonlu keteni ölçekleyen iki dikiş.
loft('zirh_bel', 22, [
    { y: 0.948, d: 0.126, w: 0.164, us: 0.62, ox: 0.006 },
    { y: 0.972, d: 0.133, w: 0.173, us: 0.62, ox: 0.006 },
    { y: 0.994, d: 0.128, w: 0.167, us: 0.62, ox: 0.006 }
], C_KETEN_K, { ebeveyn: kalca, rough: 0.84, metal: 0.07 });
loft('zirh_gogus', 22, [
    { y: 1.246, d: 0.134, w: 0.174, us: 0.62, ox: 0.006 },
    { y: 1.268, d: 0.141, w: 0.183, us: 0.62, ox: 0.006 },
    { y: 1.290, d: 0.136, w: 0.177, us: 0.62, ox: 0.006 }
], C_KETEN_K, { ebeveyn: kalca, rough: 0.84, metal: 0.07 });

// Omuzluklar (epomides): sırttan gelip göğse kapanan iki kanat. Gövdede
// (kalca) duruyor — omuz kuşağıyla DÖNMEZ, çünkü zırha dikilidir.
for (let i = 0; i < 2; i++) {
    const s = i ? -1 : 1;
    uzuv('omuzluk_' + (i + 1), [-0.100, 1.372, s * 0.108], [0.116, 1.300, s * 0.126],
         [[0, 0.030, 0.42], [0.35, 0.046, 0.40], [0.75, 0.048, 0.40], [1, 0.038, 0.44]],
         10, C_KETEN, { ebeveyn: kalca, rough: 0.84, metal: 0.07 });
    kutu('omuzluk_uc_' + (i + 1), 0.030, 0.010, 0.086,
         [0.124, 1.294, s * 0.126], C_KETEN_K,
         { ebeveyn: kalca, metal: 0.07, rough: 0.84 });
}

// ---- pteruges: zırhın altından sarkan deri şeritler ------------------------
// 14 şerit, zırhın bel çevresini takip ediyor. Şeritler eteğin 1.5 cm dışında
// ve eteğin kendi flaresine paralel açılıyor — yoksa alt uçları eteğin İÇİNDE
// kalıp kaybolur.
for (let i = 0; i < 14; i++) {
    const a = 2 * Math.PI * (i + 0.5) / 14;
    const ca = Math.cos(a), sa = Math.sin(a);
    loft('pteruges_' + (i + 1), 8, [
        { y: 0.944, d: 0.011, w: 0.019, us: 0.55, ox: 0.006 + 0.141 * ca, oz: 0.173 * sa },
        { y: 0.892, d: 0.012, w: 0.021, us: 0.55, ox: 0.006 + 0.155 * ca, oz: 0.188 * sa },
        { y: 0.842, d: 0.011, w: 0.019, us: 0.60, ox: 0.006 + 0.167 * ca, oz: 0.201 * sa }
    ], C_DERI, { ebeveyn: kalca, rough: 0.88, metal: 0.05 });
}

// ---- kılıç (xiphos) kını + askı kayışı -------------------------------------
// Sol kalçada, sağ omuzdan geçen bir askıdan (balteus) asılı. Kayış gövdeye
// dikilidir, omuz kuşağıyla dönmez (piyadedeki çanta kayışıyla aynı gerekçe).
loft('kin', 12, [
    { y: 0.760, d: 0.014, w: 0.032, us: 0.70, ox: -0.030, oz: 0.176 },
    { y: 0.830, d: 0.019, w: 0.042, us: 0.70, ox: -0.030, oz: 0.180 },
    { y: 0.960, d: 0.020, w: 0.044, us: 0.70, ox: -0.028, oz: 0.182 }
], C_DERI_K, { ebeveyn: kalca, rough: 0.78, metal: 0.10 });
kutu('kin_agiz', 0.048, 0.024, 0.100, [-0.028, 0.972, 0.182], C_BRONZ_K,
     { ebeveyn: kalca, metal: 0.40, rough: 0.36 });
kutu('kilic_kabza', 0.036, 0.076, 0.070, [-0.028, 1.020, 0.184], C_DERI,
     { ebeveyn: kalca, metal: 0.10, rough: 0.80 });
uzuv('balteus', [0.030, 1.352, -0.128], [-0.026, 1.000, 0.176],
     [[0, 0.016, 0.30], [0.5, 0.018, 0.28], [1, 0.016, 0.30]], 8, C_DERI,
     { ebeveyn: kalca, rough: 0.86, metal: 0.06 });

// ============================================================================
// 7. BOYUN + KAFA + KORİNT MİĞFERİ
// ============================================================================
// Antropometri (1.705 m): diz 0.488 · kalça 0.905 · bel 1.023 · omuz 1.340 ·
// çene 1.454 · göz 1.553 · kafa tepesi 1.667.
loft('boyun', 14, [
    { y: 1.385, d: 0.051, w: 0.057, ox: 0.004 },
    { y: 1.426, d: 0.049, w: 0.053, ox: 0.008 },
    { y: 1.466, d: 0.051, w: 0.054, ox: 0.012 }
], C_TEN, { ebeveyn: kalca, rough: 0.74, metal: 0.05 });

const H_W = egriYap([
    [1.454, 0.049], [1.487, 0.064], [1.525, 0.074], [1.572, 0.078],
    [1.620, 0.074], [1.653, 0.055], [1.667, 0.027]
]);
const H_D = egriYap([
    [1.454, 0.059], [1.487, 0.076], [1.525, 0.087], [1.572, 0.092],
    [1.620, 0.087], [1.653, 0.064], [1.667, 0.030]
]);
loft('kafa', 18, istUret(1.454, 1.667, 10, H_D, H_W, { us: 1.05, ox: 0.012 }),
     C_TEN, { ebeveyn: kalca, rough: 0.72, metal: 0.05 });

// ---- Korint miğferi --------------------------------------------------------
// Kabuk yüksekliği 0.248 m (katalog 0.216-0.23 aralığının üstü; alt kenar
// çeneyi geçiyor), en 0.184, derinlik 0.254 — Met 256133 / MFAH 48126.
// Kabuk kafayı 1.5-2 cm boşlukla sarıyor (iç dolgu payı) ve ÖNE taşıyor:
// Korint miğferinin ayırt edici çizgisi yüzü tamamen kapatmasıdır.
const MG_W = egriYap([
    [1.452, 0.088], [1.478, 0.092], [1.520, 0.095], [1.570, 0.094],
    [1.620, 0.090], [1.660, 0.078], [1.690, 0.052], [1.700, 0.022]
]);
const MG_D = egriYap([
    [1.452, 0.113], [1.478, 0.122], [1.520, 0.127], [1.570, 0.127],
    [1.620, 0.122], [1.660, 0.106], [1.690, 0.070], [1.700, 0.030]
]);
loft('migfer', 20, istUret(1.452, 1.700, 10, MG_D, MG_W, { us: 1.04, ox: 0.014 }),
     C_BRONZ, { ebeveyn: kalca, rough: 0.34, metal: 0.42, acikAlt: true });
// Alt kenar bandı — kabuğun bittiği yeri çizmezsek miğfer ile boyun tek bir
// yumru gibi okunuyor.
loft('migfer_kenar', 20, [
    { y: 1.440, d: 0.116, w: 0.091, us: 1.04, ox: 0.014 },
    { y: 1.452, d: 0.120, w: 0.094, us: 1.04, ox: 0.014 },
    { y: 1.466, d: 0.115, w: 0.090, us: 1.04, ox: 0.014 }
], C_BRONZ_K, { ebeveyn: kalca, rough: 0.32, metal: 0.44 });
// Burun koruyucusu: göz hizasından çeneye inen dikey bar (Korint imzası).
kutu('migfer_burun', 0.030, 0.104, 0.020, [0.132, 1.505, 0.012], C_BRONZ,
     { ebeveyn: kalca, metal: 0.42, rough: 0.34 });
// İki badem göz yarığı + ağız yarığı. Yüzeyin 3 mm dışında duruyorlar,
// yoksa derinlik kavgasına girip beneklenirdi (trendeki cam bandı tuzağı).
for (let i = 0; i < 2; i++) {
    const s = i ? -1 : 1;
    kure('migfer_goz_' + (i + 1), 0.030, [0.130, 1.556, s * 0.042], C_KOYU,
         { ebeveyn: kalca, olcek: [0.40, 0.62, 1.15], rough: 0.55, metal: 0.14 });
}
kure('migfer_agiz', 0.030, [0.124, 1.474, 0], C_KOYU,
     { ebeveyn: kalca, olcek: [0.36, 0.44, 0.95], rough: 0.55, metal: 0.14 });
// Yanak kanatlarının ayrım çizgisi
for (let i = 0; i < 2; i++) {
    const s = i ? -1 : 1;
    kutu('migfer_yanak_' + (i + 1), 0.016, 0.052, 0.010,
         [0.118, 1.482, s * 0.076], C_BRONZ_K,
         { ebeveyn: kalca, metal: 0.44, rough: 0.32 });
}
// Sorguç yatağı (uzun bir sırt) + at kılı sorguç.
// ⚠️ İlk kurulumda sorguç en fazla 0.068 yarıçaptaydı ve tepe bakışında
// miğferin üstünde küçük bir kabartıya iniyordu — Korint miğferinin en
// tanınır çizgisi kayboluyordu. Yarıçap 0.098'e çıkarıldı: sorguç artık
// modelin EN YÜKSEK noktası (1.833) ve yandan/tepeden ayrı bir kütle.
// `uzuv`un kesiti eksene dik düzlemde ve `sq` z'yi eziyor (türetme uzuv()
// içinde): sonuç y'de yüksek, z'de ince bir BIÇAK — at kılı sorgucun ta
// kendisi.
uzuv('sorguc_yatak', [-0.086, 1.688, 0], [0.112, 1.676, 0],
     [[0, 0.014, 0.55], [0.5, 0.020, 0.50], [1, 0.014, 0.55]], 8, C_BRONZ_K,
     { ebeveyn: kalca, rough: 0.32, metal: 0.44 });
uzuv('sorguc', [-0.120, 1.735, 0], [0.140, 1.718, 0],
     [[0, 0.014, 0.30], [0.12, 0.074, 0.26], [0.40, 0.098, 0.22],
      [0.72, 0.086, 0.24], [1, 0.018, 0.32]], 12, C_SORGUC,
     { ebeveyn: kalca, rough: 0.94, metal: 0.03 });

// ============================================================================
// 8. BACAKLAR — mafsal gruplarının İÇİNDE, yerel çerçevede
// ============================================================================
for (let i = 0; i < 2; i++) {
    const g = bacaklar[i], gd = dizler[i], ga = ayaklar[i];
    // Uyluk: kalça (y=0) → diz (y=-UYLUK). Çıplak bacak (hoplit pantolon
    // giymez); dizin hemen üstünde kas şişkinliği var, düz koni cansız durur.
    loft('ust_bacak_' + (i + 1), 16, [
        { y: -UYLUK - 0.010, d: 0.058, w: 0.055, us: 1.0 },
        { y: -UYLUK + 0.052, d: 0.063, w: 0.060, us: 1.0 },
        { y: -0.275,         d: 0.069, w: 0.066, us: 1.0 },
        { y: -0.180,         d: 0.075, w: 0.073, us: 1.0 },
        { y: -0.085,         d: 0.080, w: 0.078, us: 1.0 },
        { y:  0.018,         d: 0.082, w: 0.079, us: 1.0 },
        { y:  0.066,         d: 0.074, w: 0.072, us: 1.0 }
    ], C_TEN, { ebeveyn: g, rough: 0.74, metal: 0.05 });
    // Baldır: diz (y=0) → bilek (y=-BALDIR).
    loft('alt_bacak_' + (i + 1), 16, [
        { y: -BALDIR - 0.006, d: 0.043, w: 0.041, us: 1.0 },
        { y: -BALDIR + 0.056, d: 0.046, w: 0.044, us: 1.0 },
        { y: -0.275,          d: 0.052, w: 0.049, us: 1.0 },
        { y: -0.190,          d: 0.060, w: 0.057, us: 1.0 },
        { y: -0.114,          d: 0.067, w: 0.064, us: 1.0, ox: -0.006 },
        { y: -0.052,          d: 0.066, w: 0.064, us: 1.0, ox: -0.004 },
        { y:  0.012,          d: 0.058, w: 0.056, us: 1.0 }
    ], C_TEN, { ebeveyn: gd, rough: 0.74, metal: 0.05 });
    kure('diz_kure_' + (i + 1), 0.058, [0, 0, 0], C_TEN,
         { ebeveyn: gd, olcek: [1.0, 0.95, 0.92], rough: 0.74, metal: 0.05 });
    // KNEMIS (bronz baldır zırhı): dizin altından bileğe. Bacağa geçirilip
    // kendi yayıyla tutunur, yani neredeyse tam halka — `yassi` 0.80 ile
    // yalnız arkası biraz basıklaştırıldı (arkada açıklık var).
    loft('dizlik_' + (i + 1), 16, [
        { y: -0.352, d: 0.048, w: 0.046, us: 1.0, yassi: 0.80 },
        { y: -0.290, d: 0.056, w: 0.053, us: 1.0, yassi: 0.80 },
        { y: -0.196, d: 0.065, w: 0.062, us: 1.0, ox: -0.004, yassi: 0.80 },
        { y: -0.108, d: 0.072, w: 0.069, us: 1.0, ox: -0.004, yassi: 0.80 },
        { y: -0.030, d: 0.070, w: 0.067, us: 1.0, yassi: 0.80 },
        { y:  0.014, d: 0.064, w: 0.062, us: 1.0, yassi: 0.80 }
    ], C_BRONZ, { ebeveyn: gd, rough: 0.34, metal: 0.42, acikAlt: true, acikUst: true });
    // Üst kenar bileziği — greave'in bittiği yer çizilmezse zırh ile çıplak
    // baldır tek yüzey gibi okunuyor. ⚠️ +0.030'un üstüne çıkarılmadı: diz
    // büküldüğünde bilezik uyluğun içine girer.
    loft('dizlik_kenar_' + (i + 1), 16, [
        { y: 0.000, d: 0.068, w: 0.065, us: 1.0, yassi: 0.80 },
        { y: 0.016, d: 0.072, w: 0.069, us: 1.0, yassi: 0.80 },
        { y: 0.030, d: 0.066, w: 0.063, us: 1.0, yassi: 0.80 }
    ], C_BRONZ_K, { ebeveyn: gd, rough: 0.32, metal: 0.44 });

    // Sandalet: bilek (y=0) → taban (y=TABAN_DY). Ayak + ince taban + bağlar.
    loft('ayak_et_' + (i + 1), 14, [
        { y: TABAN_DY + 0.016, d: 0.112, w: AYAK_W,         us: 0.80, ox: 0.050 },
        { y: TABAN_DY + 0.044, d: 0.108, w: AYAK_W - 0.002, us: 0.82, ox: 0.044 },
        { y:  0.000,           d: 0.086, w: 0.050,          us: 0.88, ox: 0.018 },
        { y:  0.032,           d: 0.052, w: 0.046,          us: 0.95, ox: -0.006 }
    ], C_TEN, { ebeveyn: ga, rough: 0.74, metal: 0.05 });
    // Taban: ayağın ALTINDAKİ ince levha. Zemin kilidi bunun köşelerini
    // ölçüyor (davranıştaki topuk/burun noktaları buradan geliyor).
    // ⚠️ Taban ölçüsü TOPUK_X/BURUN_X ile BİREBİR tutmak zorunda: zemin
    // kilidi (davranış) bu iki noktayı kullanıyor. d ve ox buna göre seçildi:
    // ox - d = -0.068 = TOPUK_X, ox + d = 0.175 = BURUN_X.
    loft('sandalet_' + (i + 1), 14, [
        { y: TABAN_DY,         d: 0.1215, w: AYAK_W + 0.003, us: 0.55, ox: 0.0535 },
        { y: TABAN_DY + 0.011, d: 0.1235, w: AYAK_W + 0.005, us: 0.55, ox: 0.0535 },
        { y: TABAN_DY + 0.019, d: 0.1195, w: AYAK_W + 0.002, us: 0.60, ox: 0.0525 }
    ], C_DERI_K, { ebeveyn: ga, rough: 0.94, metal: 0.03 });
    // Sandalet bağları ayağın DIŞINA taşmalı; ilk kurulumda z eni 0.042 idi
    // ve ayak eti (w 0.050) bağı yutuyordu.
    kutu('sandalet_bag_' + (i + 1), 0.040, 0.010, 0.114, [0.030, -0.044, 0], C_DERI,
         { ebeveyn: ga, metal: 0.05, rough: 0.90 });
    kutu('sandalet_bag2_' + (i + 1), 0.034, 0.009, 0.106, [0.002, -0.022, 0], C_DERI,
         { ebeveyn: ga, metal: 0.05, rough: 0.90 });
}

// ============================================================================
// 9. OMUZ KUŞAĞI — kollar + KALKAN + MIZRAK (omuz_grup)
// ============================================================================
// ⚠️ Bir el kalkanı, bir el mızrağı tuttuğu için SERBEST KOL SALINIMI YOK.
// Yürüyüşün "karşı salınım" okuması OMUZ KUŞAĞININ dönüşünden geliyor
// (gerçek yürüyüşte de pelvis bir yöne, göğüs kafesi öbür yöne döner).
// Kalkan ve mızrak bu grupta olduğu için ikisi de GÖVDEYLE BİRLİKTE gidiyor
// ve eller teçhizattan hiç ayrılmıyor.
for (let i = 0; i < 2; i++) {
    const s = i ? -1 : 1;
    kure('omuz_kapak_' + (i + 1), 0.066, [0.004, OMUZ_Y + 0.006, s * OMUZ_Z],
         C_TEN, { ebeveyn: omuz, olcek: [1.02, 0.92, 0.94], rough: 0.74, metal: 0.05 });
}

// ---- SOL KOL (ham +z): aspis. Argive tutuş — önkol ortadaki porpaks'tan
// geçer, el kenardaki antilabe'yi kavrar.
const OMZ_L = [0.005, OMUZ_Y, OMUZ_Z];
const DIR_L = [0.100, 1.045, 0.255];
const EL_L  = [0.146, 0.955, 0.508];
// ---- SAĞ KOL (ham -z): dory, üstten kavrama (Chigi vazosu duruşu).
const OMZ_R = [0.005, OMUZ_Y, -OMUZ_Z];
const DIR_R = [-0.235, 1.500, -0.295];
const EL_R  = [0.020, 1.545, -0.230];

const KOL = [[OMZ_L, DIR_L, EL_L, 1], [OMZ_R, DIR_R, EL_R, -1]];
for (let i = 0; i < 2; i++) {
    const K = KOL[i], s = K[3];
    uzuv('ust_kol_' + (i + 1), K[0], K[1],
         [[0, 0.058], [0.25, 0.054], [0.65, 0.047], [1, 0.042]], 14, C_TEN,
         { ebeveyn: omuz, rough: 0.74, metal: 0.05 });
    kure('dirsek_' + (i + 1), 0.044, K[1], C_TEN,
         { ebeveyn: omuz, rough: 0.74, metal: 0.05 });
    uzuv('alt_kol_' + (i + 1), K[1], K[2],
         [[0, 0.044], [0.35, 0.041], [0.80, 0.034], [1, 0.031]], 14, C_TEN,
         { ebeveyn: omuz, rough: 0.74, metal: 0.05 });
    kure('el_' + (i + 1), 0.042,
         [K[2][0] + 0.008, K[2][1] + 0.004, K[2][2] + s * 0.006], C_TEN,
         { ebeveyn: omuz, olcek: [1.20, 0.88, 0.82], rough: 0.72, metal: 0.05 });
}

// ============================================================================
// 10. ASPİS — Bomarzo aspisinin dönel profili
// ============================================================================
// Profil KUTUPTAN başlıyor, dış yüzeyden kenara iniyor, ofset kenarı
// dolanıyor, iç yüzeyden kutba dönüyor. Tek kapalı kabuk.
const K_O = [K_CX, K_CY, K_CZ];
const K_ET = 0.020;                      // ahşap çekirdek kalınlığı
const K_BOWL = K_R - K_F;                // kâsenin bittiği yarıçap (0.365)
(function () {
    const prof = [];
    const N = 7;
    for (let i = 0; i <= N; i++) {         // dış yüz: kutup → kâse kenarı
        const r = K_BOWL * i / N;
        prof.push([kalot(K_BOWL, K_H, r), r]);
    }
    prof.push([-0.004, K_BOWL + 0.006]);   // ofset kenar: bir kademe geriye
    prof.push([-0.006, K_R - 0.006]);
    prof.push([-0.014, K_R]);              // yuvarlatılmış dış kenar
    prof.push([-0.028, K_R]);
    prof.push([-0.036, K_R - 0.008]);
    prof.push([-0.030, K_BOWL + 0.004]);   // iç yüz: kenardan kutba
    for (let i = N; i >= 0; i--) {
        const r = K_BOWL * i / N;
        prof.push([kalot(K_BOWL, K_H, r) - K_ET, r]);
    }
    donel('kalkan_govde', prof, K_O, KU, 36, C_DERI_K,
          { rough: 0.86, metal: 0.06 });
})();
// Dış kaplama — çekirdeğin 4 mm önünde ayrı bir kalot. AYRI MESH olmasının
// sebebi renk: birincil tint YALNIZ bu yüzeye gidiyor, kalkanın içi
// (deri/ahşap) ve bronz kenarı sabit kalıyor.
(function () {
    const prof = [];
    const N = 8;
    for (let i = 0; i <= N; i++) {
        const r = K_BOWL * i / N;
        prof.push([kalot(K_BOWL, K_H, r) + 0.005, r]);
    }
    donel('kalkan', prof, K_O, KU, 36, C_KALKAN, { rough: 0.72, metal: 0.10 });
})();
// Bronz kenar halkası (Bomarzo'da 0.5 mm bronz kaplama kenarın iç yüzüne
// 4 cm biniyor) — burada okunur kalınlıkta bir bilezik.
// ⚠️ Profil kâse kenarının 8 mm ÖNÜNDEN başlıyor: dış kaplama çekirdeğin
// 5 mm önünde durduğu için aradaki ince şerit yoksa açıkta kalırdı.
(function () {
    const prof = [[0.008, K_BOWL - 0.004], [-0.005, K_R - 0.006], [-0.014, K_R],
                  [-0.028, K_R], [-0.037, K_R - 0.009], [-0.032, K_BOWL - 0.010]];
    donel('kalkan_kenar', prof, K_O, KU, 36, C_BRONZ,
          { rough: 0.34, metal: 0.42, ciftYuz: true });
})();
// İki eş merkezli kabartma halka + göbek (omphalos benzeri kabara).
// ⚠️ HARF/YAZI KOYULMADI: harita modeli soldan sağa aynalıyor (devir §5.3),
// bir lambda ya da harf ters okunurdu. Eş merkezli halka aynaya duyarsız.
for (let b = 0; b < 2; b++) {
    const r0 = b ? 0.310 : 0.196;
    const prof = [];
    for (let i = 0; i <= 3; i++) {
        const r = r0 + 0.026 * i / 3;
        prof.push([kalot(K_BOWL, K_H, r) + 0.010, r]);
    }
    donel('kalkan_bant_' + (b + 1), prof, K_O, KU, 36, C_BRONZ_K,
          { rough: 0.36, metal: 0.42, ciftYuz: true });
}
// Göbek kabarası: profilin son noktası kaplamanın üstüne TAM oturuyor
// (kalot + 0.005), yani kenarında açıklık kalmıyor.
(function () {
    const prof = [];
    for (let i = 0; i <= 5; i++) {
        const r = 0.070 * i / 5;
        prof.push([kalot(K_BOWL, K_H, r) + 0.005 + 0.022 * Math.cos(Math.PI * i / 10), r]);
    }
    donel('kalkan_gobek', prof, K_O, KU, 24, C_BRONZ, { rough: 0.34, metal: 0.42 });
})();
// Porpaks (önkol bileziği) ve antilabe (kenar kayışı). Gerçekte porpaks
// kalkanın merkezindedir; burada önkolun üstünde bir bilezik + iki bağ
// olarak kuruldu — harita ölçeğinde tek okunan şey bu.
uzuv('porpaks', [0.118, 1.020, 0.298], [0.132, 1.000, 0.358],
     [[0, 0.052, 0.60], [1, 0.052, 0.60]], 12, C_BRONZ,
     { ebeveyn: omuz, rough: 0.34, metal: 0.42 });
uzuv('antilabe', [0.140, 0.966, 0.474], [0.152, 0.946, 0.540],
     [[0, 0.020, 0.55], [1, 0.020, 0.55]], 8, C_DERI,
     { ebeveyn: omuz, rough: 0.88, metal: 0.05 });

// ============================================================================
// 11. DORY — sap + uç (aichme) + sauroter
// ============================================================================
// Parçalar el noktasından mızrak ekseni boyunca t ile yerleşiyor:
//   t = 0 dipçik ucu, t = M_ARKA el, t = M_BOY mızrağın ucu.
function mNokta(t) {
    return [EL_R[0] + MU[0] * (t - M_ARKA),
            EL_R[1] + MU[1] * (t - M_ARKA),
            EL_R[2] + MU[2] * (t - M_ARKA)];
}
// Sap: sauroter kovanının bittiği yerden ucun kovanına kadar.
uzuv('mizrak_sap', mNokta(M_SAU - 0.030), mNokta(M_BOY - M_UC + 0.040),
     [[0, M_SAP_R * 0.92], [0.5, M_SAP_R], [1, M_SAP_R * 0.90]], 10, C_AHSAP,
     { ebeveyn: omuz, rough: 0.82, metal: 0.06 });
// El kavrama sargısı (deri) — tam denge noktasında.
uzuv('mizrak_sargi', mNokta(M_ARKA - 0.075), mNokta(M_ARKA + 0.075),
     [[0, M_SAP_R * 1.10], [1, M_SAP_R * 1.10]], 10, C_DERI,
     { ebeveyn: omuz, rough: 0.88, metal: 0.05 });
// Uç (aichme): 0.265 m, 0.044 m en, yaprak biçimli, hafif orta sırtlı.
uzuv('mizrak_ucu', mNokta(M_BOY - M_UC), mNokta(M_BOY),
     [[0.00, 0.013, 0.62], [0.32, 0.014, 0.62],
      [0.34, M_UC_W / 2, 0.30], [0.58, M_UC_W / 2 * 0.94, 0.28],
      [0.86, M_UC_W / 2 * 0.44, 0.30], [1.00, 0.002, 0.40]],
     10, C_DEMIR, { ebeveyn: omuz, rough: 0.36, metal: 0.44 });
// Sauroter: 0.272 m, kovan çapı 0.022, kare kesitli sivri uç.
uzuv('mizrak_sauroter', mNokta(0), mNokta(M_SAU),
     [[0.00, 0.003, 1.0], [0.16, 0.010, 1.0], [0.55, 0.012, 1.0],
      [0.86, 0.013, 1.0], [1.00, 0.012, 1.0]],
     4, C_DEMIR, { ebeveyn: omuz, rough: 0.36, metal: 0.44 });
kutu('mizrak_bilezik', 0.030, 0.030, 0.030, mNokta(M_SAU + 0.006), C_BRONZ_K,
     { ebeveyn: omuz, metal: 0.42, rough: 0.34 });



// ==== SALDIRI MZ-MODEL BASLANGIC ====

// ============================================================================
// 12. SALDIRI SÖZLEŞMESİ — `registerBehavior('mizrakli-piyade')` bunu okur
// ============================================================================
// ⚠️ GEOMETRİ EKLEMİYOR: yalnız yukarıda ZATEN yazılmış noktaları ve parça
// adlarını dışa veriyor. Kutu, mesh sayısı, üçgen sayısı DEĞİŞMİYOR.
//
// Saldırı (omuz üstünden ileri saplama) üç mafsallı: omuz → dirsek → BİLEK.
// Davranış grupları tam bu noktalarda kuruyor, sayıları buradan okuyor ve
// studio-3d.js'e KOPYALAMIYOR.
//
// ⚠️ `bilek` grubunun dönme ekseni KAVRAMA NOKTASININ TA KENDİSİ:
// mızrağın bütün parçaları `mNokta(t)` ile yazıldı ve `mNokta(M_ARKA)` tam
// olarak `EL_R`. Yani mızrak bilekte dönerken el şaftın üstünde HİÇ kaymaz —
// bu bir yaklaşıklık değil, özdeşlik.
modelGroup.userData.mizrakliSaldiri = {
    omuz:   OMZ_R,              // sağ omuz mafsalı (mızrak kolu)
    dirsek: DIR_R,
    el:     EL_R,               // = mNokta(M_ARKA), denge noktası
    yon:    MU,                 // mızrak ekseni (birim), kurulumda 13.05° aşağı
    uc:     mNokta(M_BOY),      // aichme'nin ucu
    dip:    mNokta(0),          // sauroter'in dibi
    // Gruplara TAŞINAN parçalar. `omuz_kapak_2` DIŞARIDA: o gövdenin omuz
    // kuşağı, mafsalı örtmeye devam ediyor (piyadedeki aynı karar).
    kolUst: ['ust_kol_2', 'dirsek_2'],
    kolAlt: ['alt_kol_2'],
    bilek:  ['el_2', 'mizrak_sap', 'mizrak_sargi', 'mizrak_ucu',
             'mizrak_sauroter', 'mizrak_bilezik'],
    boy: BOY
};
// ==== SALDIRI MZ-MODEL SON ====
