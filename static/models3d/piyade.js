// Piyade — modern muharebe eri, yürüyüş hâlinde. Modern Warfare grubunun
// ONUNCU modeli ve kütüphanenin İLK insan figürü.
//
// ⚠️ ID `asker` DEĞİL `piyade`. `asker` DOLU (eski Modern Warfare grubundan
// "Soldier"), bu yüzden yeni ve boş bir id alındı; EN adı yine "Soldier"
// (aynı desen `savas-ucagi`/`avci-ucagi` ikilisinde de var).
//
// ============================================================================
// NEDEN KESİTTEN LOFT
// ============================================================================
// Otomobilde ölçülen ders burada daha da acımasız: bir ExtrudeGeometry'nin
// KESİTİ DERİNLİK BOYUNCA SABİTTİR, kutu yığını ise (motosiklet dersi)
// "matematiksel olarak değen ama görsel olarak ayrı duran levhalar" veriyor.
// İnsan gövdesinin kesiti her yükseklikte BAŞKA: kalça geniş ve yuvarlak,
// bel dar, göğüs geniş ve öne bombeli, omuz düzleşiyor. Bu yüzden gövde,
// bacaklar, kollar, boyun, kafa, kask ve sırt çantası — HEPSİ y (ya da uzuv)
// ekseni boyunca istasyon istasyon hesaplanan KAPALI KESİTLERİN dikilmesiyle
// kuruluyor. Kesit yarı-genişlik/yarı-derinlik/üs üçlüsünden üretiliyor ve
// üçü de kendi monoton kübik (PCHIP) eğrisinden okunuyor.
//
// Kutu YALNIZ imalat ürünü parçalarda kullanıldı (tüfek gövdesi, şarjör,
// dürbün, plaka, toka) — orada kutu DOĞRU cevap, çünkü nesnenin kendisi
// prizmatik.
//
// ============================================================================
// PARÇA / GRUP SÖZLEŞMESİ (studio-3d.js `registerBehavior('piyade')` bunları arar)
// ============================================================================
//   kalca_grup      : bütün figür. Davranış YALNIZ position.y yazar (düşey
//                     salınım + zemin kilidi).
//   bacak_1/2       : kalça mafsalı. rotation.z = uyluk açısı (+ = ileri).
//   diz_1/2         : diz mafsalı (bacak_i'nin çocuğu). rotation.z = -diz bükümü.
//   ayak_1/2        : bilek mafsalı (diz_i'nin çocuğu). rotation.z = ayak eğimi.
//   omuz_grup       : omuz kuşağı + iki kol + TÜFEK. rotation.y = gövde
//                     karşı-dönüşü (kollar bacaklarla ZIT fazda).
//   userData.piyade : bacak zincirinin ÖLÇÜLERİ. Davranış adım uzunluğunu ve
//                     zemin kilidini BU sayılardan çözer; geometri değişirse
//                     yürüyüş kendiliğinden uyar (sabit kopyalanmaz).
//
// ⚠️ 1/2 numaralandırması: bacak_1 / kol_1 = model +z tarafı, _2 = -z tarafı.
// ⚠️ HARİTA SOLDAN SAĞA AYNALIYOR (devir §5.3, det(projection) < 0). Bu yüzden
// tüfek ham koordinatta -z omzuna dayalı kuruldu; ürün onu aynalayıp SAĞ
// omuzda gösteriyor. Tezgâhın bakis.py/kapak.py çizimleri de aynalı olduğu
// için orada doğru (sağ elli) görünür — düz bir THREE sahnesinde ters görünür,
// o NORMALDİR.
//
// YÖN: burun +x, üst +y, taban y=0. Ölçüler gerçek metre. Boy 1.80 m.
//
// ============================================================================
// 0. RENKLER
// ============================================================================
// ⚠️ metalness KURALI (devir §5.1, iki uçlu): 0.85+ neredeyse SİYAH (sahnede
// environment map yok), ama metalness'i DÜŞÜRMEK açık renkte patlamayı
// ARTIRIR (difüz = albedo × (1−metalness)). Kumaş için 0.06-0.10 arası az
// bir metalness bırakıldı: hem mat duruyor hem tepe bakışında beyaza
// doymuyor. Palet parlaklik.py ile TARANDI (tek renk değil, PALET).
const C_UNIF    = '#918d73';   // üniforma — _TINT birincil varsayılanı
const C_UNIF_K  = '#7c7861';   // üniformanın gölgeli/ikinci kumaşı (kol ağzı, paça)
const C_TECH    = '#6a6754';   // yelek + fişeklik + çanta — _TINT ikincil varsayılanı
const C_TECH_K  = '#5a5744';   // teçhizat koyu detay (kayış, toka yatağı)
const C_KASK    = '#847f68';   // kask kılıfı (üniformayla aynı aileden, bir ton koyu)
const C_BOT     = '#4e4437';   // postal
const C_BOT_T   = '#322b25';   // postal tabanı
const C_TEN     = '#ac8368';   // yüzün görünen küçük alanı
const C_ELDIVEN = '#413e35';   // eldiven
const C_SILAH   = '#2b2c2e';   // tüfek gövdesi (kompozit)
const C_SILAH_M = '#3b3d40';   // tüfek metal aksam
const C_CAM     = '#20303a';   // gözlük / dürbün camı
const C_SIYAH   = '#191a1c';   // kayış, lastik, derin oyuk

// ============================================================================
// 1. TEMEL ÖLÇÜLER — bacak zinciri buradan çıkıyor
// ============================================================================
const BOY       = 1.800;
const HIP_Y     = 0.955;   // femur başı yüksekliği (boyun %53'ü — antropometrik)
const HIP_Z     = 0.098;   // kalça mafsalının yanal ofseti
const UYLUK     = 0.440;   // kalça → diz
const BALDIR     = 0.430;  // diz → bilek
const BILEK_Y   = HIP_Y - UYLUK - BALDIR;   // = 0.085, ayakta bilek yüksekliği
const TABAN_DY  = -0.085;  // bilekten tabana (ayak yerel çerçevesi)
const TOPUK_X   = -0.070;  // taban arka ucu (bilek yerel)
const BURUN_X   = 0.180;   // taban ön ucu  (bilek yerel)
const AYAK_W    = 0.056;   // postal yarı genişliği
const OMUZ_Y    = 1.415;   // omuz mafsalı (akromiyon 1.47, glenohumeral ~4 cm altı)
const OMUZ_Z    = 0.176;

// ============================================================================
// 2. MONOTON KÜBİK EĞRİ (PCHIP) — otomobil.js §2 ile aynı gerekçe
// ============================================================================
// Catmull-Rom denendi ve BIRAKILDI: bel ile göğüs arasında eğim çok değiştiği
// için göğüs eğrisi belin üstüne tümsek atıyordu. Fritsch-Carlson teğetleri
// yerel uç noktalarda sıfırlandığı için taşma yok.
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
// 3. LOFT MAKİNESİ
// ============================================================================
// Kapalı bir süper-elips halkası: yarı-derinlik d (x), yarı-genişlik w (z),
// üs `us`. us=1 tam elips (uzuv), us<1 gitgide dikdörtgene yaklaşır (plaka
// taşıyıcı yelek, sırt çantası), us>1 sivrilir.
//   ⚠️ ÜS TEK BAŞINA YETMEZ: gövde kesiti öne bombeli, arkaya düz olmalı.
//   Bunun için her istasyona bir `ox` (kesiti öne kaydırma) ve `bomb` (ön
//   yarıyı ek şişirme) verildi; ikisi de x'e uygulanıyor, z'ye değil.
function halkaNokta(s, a) {
    const ca = Math.cos(a), sa = Math.sin(a);
    const us = s.us == null ? 1.0 : s.us;
    const sx = ca < 0 ? -1 : 1, sz = sa < 0 ? -1 : 1;
    let x = s.d * sx * Math.pow(Math.abs(ca), us);
    const z = s.w * sz * Math.pow(Math.abs(sa), us);
    if (s.bomb) x += s.bomb * Math.max(0, ca) * Math.max(0, ca);
    if (s.yassi && x < 0) x *= s.yassi;             // sırtı düzleştir
    return [x + (s.ox || 0), z + (s.oz || 0)];
}

// ist: [{y, d, w, us, ox, oz, bomb, yassi}] — ARTAN y sırasında.
// Sarım: istasyonlar +y'ye, halka +x'ten +z'ye ilerlerken dış normal çıkar
// (otomobil.js'teki halka/kapak sarımının aynı türetimi).
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
    // Kapaklar. Halka köşeleri KOPYALANIYOR ki computeVertexNormals kapağın
    // normalini yan yüzeyinkiyle ortalamayıp uç keskinliğini yumuşatmasın.
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

// Eğrilerden istasyon dizisi üret: y0..y1 arasında N örnek.
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

// İKİ NOKTA ARASI UZUV. Kol gibi animasyonsuz parçalarda gruplarla uğraşmak
// yerine doğrudan A→B arası konik tüp kuruluyor; halka, eksene dik düzlemde.
// ⚠️ Uçlar KAPALI ve yarıçaplar mafsalda EŞLEŞTİRİLİYOR; motosiklet dersi
// (uçları matematiksel olarak değen ama görsel olarak kopuk parçalar) burada
// mafsal küreleriyle kapatılıyor.
function uzuv(ad, A, B, r, n, renk, opts) {
    opts = opts || {};
    const vx = B[0] - A[0], vy = B[1] - A[1], vz = B[2] - A[2];
    const L = Math.sqrt(vx * vx + vy * vy + vz * vz) || 1;
    const ux = vx / L, uy = vy / L, uz = vz / L;
    // eksene dik iki birim vektör
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
            // ⚠️ SARIM loft()'unkinin TERSI. Burada uclu (e, f, u) SAG
            // ellidir (e x f = u); halka e'den f'ye, yani u etrafinda CCW
            // ilerliyor. CCW halkada (a, c, d2) normali U x T = -radyal:
            // ICE bakar, kol yuzeyleri ayiklanip icleri gorunur. loft()
            // ayni sirayla DOGRU calisiyor cunku oradaki halka (x, z)
            // duzleminde +y etrafinda CW. (Ayni turetim zipkin.js
            // `surme()` yorumunda da yazili.)
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
            // ⚠️ Kapaklar da yan yuzeylerle ayni sebeple ters (loft'un
            // kapakEkle'sinin TERSI).
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

// Küçük mafsal küresi — uzuvların kesişimini organik kapatır.
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

// İmalat parçası: köşesi yuvarlatılmış prizma (tüfek, şarjör, dürbün, plaka).
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

function silindir(ad, r1, r2, h, pos, renk, opts) {
    opts = opts || {};
    const geo = new THREE.CylinderGeometry(r1, r2, h, opts.seg || 12, 1, !!opts.acik);
    if (opts.rot) {
        if (opts.rot[0]) geo.rotateX(opts.rot[0]);
        if (opts.rot[1]) geo.rotateY(opts.rot[1]);
        if (opts.rot[2]) geo.rotateZ(opts.rot[2]);
    }
    geo.translate(pos[0], pos[1], pos[2]);
    const m = mesh(geo, renk, {
        metal: opts.metal == null ? 0.30 : opts.metal,
        rough: opts.rough == null ? 0.55 : opts.rough, name: ad
    });
    (opts.ebeveyn || modelGroup).add(m);
    return m;
}

// ============================================================================
// 4. GRUPLAR — pivot-ofset ikilisi
// ============================================================================
// ⚠️ Motorun `_WHEELS.front` mekanizması BURADA KULLANILAMAZ: o, listedeki her
// parçayı KENDİ merkezinden geçen dikey eksende döndürüyor. Uzuv ise
// KALÇADAN / DİZDEN / OMUZDAN döner. Bisiklet ve motosikletteki çözümün
// aynısı: dönen her şey model kodunda bir GRUBUN içinde, grubun konumu
// mafsalın ta kendisi, geometri o mafsala göre yazılıyor.
const kalca = new THREE.Group(); kalca.name = 'kalca_grup';
modelGroup.add(kalca);

const omuz = new THREE.Group(); omuz.name = 'omuz_grup';
// ⚠️ Konumu (0,0,0): dönüş DÜŞEY eksende olduğu için pivotun y'si sonucu
// değiştirmiyor, ama x/z sıfır olmak ZORUNDA — gövdenin orta hattı.
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
modelGroup.userData.piyade = {
    hipY: HIP_Y, hipZ: HIP_Z, uyluk: UYLUK, baldir: BALDIR,
    bilekY: BILEK_Y, tabanDy: TABAN_DY, topukX: TOPUK_X, burunX: BURUN_X,
    boy: BOY
};

// ============================================================================
// 5. GÖVDE — kesitten loft (crotch → boyun dibi)
// ============================================================================
// Dokuz anahtar yükseklik; genişlik ve derinlik ayrı eğrilerden. Kesitin
// üssü de yükseklikle değişiyor: kalçada ve göğüste elipse yakın (yuvarlak),
// belde biraz daha dolgun. Sırt `yassi` ile düzleştirildi — insan sırtı
// öndeki kadar bombeli değildir ve sırt çantası oraya oturuyor.
// ⚠️ Alt uç 0.745'e kadar sivriltildi. İlk kurulumda gövde y=0.780'de DÜZ
// kapakla bitiyordu ve arkadan bakışta iki uyluğun arasından o düz disk
// görünüyordu (siluette yatay bir çentik). Kasık, kapak yerine daralan
// kesitle kapanıyor.
const G_W = egriYap([
    [0.745, 0.044], [0.762, 0.078], [0.780, 0.104], [0.850, 0.148], [0.920, 0.169], [1.000, 0.161],
    [1.080, 0.147], [1.160, 0.150], [1.250, 0.163], [1.340, 0.176],
    [1.420, 0.184], [1.470, 0.176], [1.500, 0.140]
]);
const G_D = egriYap([
    [0.745, 0.042], [0.762, 0.070], [0.780, 0.092], [0.850, 0.116], [0.920, 0.126], [1.000, 0.119],
    [1.080, 0.108], [1.160, 0.111], [1.250, 0.121], [1.340, 0.129],
    [1.420, 0.132], [1.470, 0.124], [1.500, 0.094]
]);
const G_OX = egriYap([
    [0.745, 0.010], [0.780, 0.008], [0.920, 0.002], [1.080, 0.004], [1.250, 0.010],
    [1.420, 0.008], [1.500, 0.000]
]);
const G_US = egriYap([
    [0.745, 1.10], [0.780, 1.05], [0.920, 1.00], [1.080, 0.92], [1.250, 0.90],
    [1.420, 0.86], [1.500, 0.95]
]);
loft('govde', 24,
     istUret(0.745, 1.500, 16, G_D, G_W, { eOx: G_OX, eUs: G_US, yassi: 0.90 }),
     C_UNIF, { ebeveyn: kalca, rough: 0.90, metal: 0.07 });

// Kalça/kasık geçişi: gövde loftu bacak dipleriyle kesişsin diye küçük bir
// köprü. Olmadığında uyluk üstünde 2-3 cm'lik açık kalıyordu (siluette
// kopukluk olarak okunuyordu).
for (let i = 0; i < 2; i++) {
    kure('kasik_' + (i + 1), 0.088, [0.004, 0.928, (i ? -1 : 1) * 0.088], C_UNIF,
         { ebeveyn: kalca, olcek: [1.12, 1.0, 1.0], rough: 0.90, metal: 0.07 });
}

// ---- kemer -----------------------------------------------------------------
// Gövde loftunun belini saran ayrı bir loft. Fişeklikler ve kılıf buna oturuyor.
const K_W = egriYap([[1.010, 0.160], [1.040, 0.168], [1.070, 0.165], [1.095, 0.156]]);
const K_D = egriYap([[1.010, 0.120], [1.040, 0.128], [1.070, 0.126], [1.095, 0.118]]);
loft('kemer', 22, istUret(1.010, 1.095, 5, K_D, K_W, { us: 0.85, ox: 0.004 }),
     C_TECH_K, { ebeveyn: kalca, rough: 0.72, metal: 0.14 });
kutu('kemer_toka', 0.026, 0.044, 0.062, [0.128, 1.052, 0.004], '#8d8a7a',
     { ebeveyn: kalca, metal: 0.42, rough: 0.34 });

// ---- plaka taşıyıcı yelek --------------------------------------------------
// KUTU DEĞİL, LOFT — ama üssü 0.55: plaka taşıyıcı gerçekten prizmatiktir,
// göğüs ve sırt plakası düz, yanlar kayışla toplanmış. Üs eğrisiyle bu
// "yumuşak köşeli dikdörtgen" tam olarak çıkıyor.
const Y_W = egriYap([
    [1.030, 0.168], [1.080, 0.178], [1.160, 0.176], [1.270, 0.182],
    [1.360, 0.191], [1.420, 0.191], [1.455, 0.176]
]);
const Y_D = egriYap([
    [1.030, 0.126], [1.080, 0.134], [1.160, 0.132], [1.270, 0.140],
    [1.360, 0.147], [1.420, 0.145], [1.455, 0.132]
]);
loft('yelek', 22, istUret(1.030, 1.455, 9, Y_D, Y_W, { us: 0.55, ox: 0.006 }),
     C_TECH, { ebeveyn: kalca, rough: 0.80, metal: 0.10 });
// Yaka/boyun koruması — yeleğin üstünü kapatan ince bant.
loft('yelek_yaka', 20, [
    { y: 1.432, d: 0.133, w: 0.177, us: 0.60, ox: 0.006 },
    { y: 1.468, d: 0.126, w: 0.168, us: 0.62, ox: 0.006 },
    { y: 1.482, d: 0.112, w: 0.150, us: 0.68, ox: 0.004 }
], C_TECH_K, { ebeveyn: kalca, rough: 0.82, metal: 0.10 });

// ---- göğüs fişeklikleri ----------------------------------------------------
// Üç şarjör cebi + bir yardımcı cep. Her biri AYRI ADLA (aynı adlı meshlerden
// yalnız İLKİ renk alıyor — devir §5.2).
const FIS = [
    ['fisek_1', 0.152, 1.272, 0.088], ['fisek_2', 0.152, 1.272, -0.004],
    ['fisek_3', 0.150, 1.272, -0.096], ['fisek_4', 0.148, 1.366, 0.096]
];
for (let i = 0; i < FIS.length; i++) {
    const f = FIS[i];
    loft(f[0], 14, [
        { y: f[2] - 0.062, d: 0.028, w: 0.040, us: 0.55, ox: f[1], oz: f[3] },
        { y: f[2] - 0.050, d: 0.034, w: 0.043, us: 0.55, ox: f[1], oz: f[3] },
        { y: f[2] + 0.038, d: 0.035, w: 0.043, us: 0.55, ox: f[1], oz: f[3] },
        { y: f[2] + 0.056, d: 0.031, w: 0.040, us: 0.60, ox: f[1] - 0.004, oz: f[3] }
    ], C_TECH, { ebeveyn: kalca, rough: 0.80, metal: 0.10 });
    kutu('fisek_kapak_' + (i + 1), 0.012, 0.030, 0.078,
         [f[1] + 0.030, f[2] + 0.040, f[3]], C_TECH_K,
         { ebeveyn: kalca, metal: 0.10, rough: 0.80 });
}
// Sırttaki telsiz + anten
kutu('radyo', 0.052, 0.132, 0.086, [-0.152, 1.312, -0.070], C_TECH_K,
     { ebeveyn: kalca, metal: 0.22, rough: 0.62 });
silindir('anten', 0.006, 0.004, 0.220, [-0.152, 1.492, -0.100], C_SIYAH,
         { ebeveyn: kalca, seg: 6, rot: [0.14, 0, 0.10], metal: 0.20, rough: 0.60 });
// Bel arkasındaki matara kılıfı ve yan çanta
loft('bel_canta', 14, [
    { y: 1.020, d: 0.042, w: 0.056, us: 0.55, ox: -0.128, oz: 0.108 },
    { y: 1.048, d: 0.048, w: 0.060, us: 0.55, ox: -0.132, oz: 0.108 },
    { y: 1.110, d: 0.046, w: 0.058, us: 0.55, ox: -0.132, oz: 0.108 }
], C_TECH, { ebeveyn: kalca, rough: 0.80, metal: 0.10 });
loft('kilif', 14, [
    { y: 0.855, d: 0.038, w: 0.030, us: 0.60, ox: 0.020, oz: -0.150 },
    { y: 0.900, d: 0.046, w: 0.036, us: 0.60, ox: 0.020, oz: -0.152 },
    { y: 0.980, d: 0.046, w: 0.036, us: 0.60, ox: 0.020, oz: -0.152 }
], C_TECH_K, { ebeveyn: kalca, rough: 0.78, metal: 0.14 });
kutu('kilif_kapak', 0.058, 0.026, 0.046, [0.020, 0.992, -0.152], C_TECH,
     { ebeveyn: kalca, metal: 0.10, rough: 0.80 });

// ============================================================================
// 6. SIRT ÇANTASI
// ============================================================================
// Gövdenin sırtına (yassı tarafına) oturan ayrı loft. Üs 0.5: sırt çantası
// yumuşak köşeli bir prizmadır.
const C_W = egriYap([
    [1.060, 0.130], [1.120, 0.152], [1.270, 0.158], [1.400, 0.152], [1.450, 0.128]
]);
const C_D = egriYap([
    [1.060, 0.070], [1.120, 0.090], [1.270, 0.098], [1.400, 0.092], [1.450, 0.070]
]);
loft('canta', 20, istUret(1.060, 1.450, 8, C_D, C_W, { us: 0.50, ox: -0.208 }),
     C_TECH, { ebeveyn: kalca, rough: 0.84, metal: 0.09 });
loft('canta_kapak', 20, [
    { y: 1.400, d: 0.094, w: 0.154, us: 0.50, ox: -0.206 },
    { y: 1.438, d: 0.096, w: 0.156, us: 0.50, ox: -0.212 },
    { y: 1.466, d: 0.082, w: 0.136, us: 0.55, ox: -0.216 }
], C_TECH_K, { ebeveyn: kalca, rough: 0.84, metal: 0.09 });
// Uyku tulumu rulosu — çantanın altına bağlı
silindir('canta_rulo', 0.048, 0.048, 0.260, [-0.238, 1.078, 0],
         C_TECH_K, { ebeveyn: kalca, seg: 12, rot: [Math.PI / 2, 0, 0],
                     metal: 0.08, rough: 0.88 });
for (let i = 0; i < 2; i++) {
    const s = i ? -1 : 1;
    // Omuz kayışları çantadan göğse dolanıyor — omuz_grup'ta DEĞİL, gövdede:
    // kayış gövdeye dikilidir, omuzla birlikte dönmez.
    uzuv('canta_kayis_' + (i + 1), [-0.150, 1.420, s * 0.108], [0.110, 1.196, s * 0.130],
         [[0, 0.020, 0.45], [0.5, 0.022, 0.40], [1, 0.019, 0.45]], 8, C_TECH_K,
         { ebeveyn: kalca, rough: 0.84, metal: 0.09 });
}
kutu('canta_matara', 0.052, 0.096, 0.062, [-0.238, 1.262, 0.142], C_TECH_K,
     { ebeveyn: kalca, metal: 0.12, rough: 0.80 });

// ============================================================================
// 7. BOYUN + KAFA + KASK
// ============================================================================
// Antropometri (1.80 m): diz 0.515 · kalça 0.955 · bel 1.08 · omuz 1.415 ·
// çene 1.535 · göz 1.640 · kafa tepesi 1.760 · kask tepesi 1.800.
loft('boyun', 14, [
    { y: 1.462, d: 0.054, w: 0.060, ox: 0.004 },
    { y: 1.505, d: 0.052, w: 0.056, ox: 0.008 },
    { y: 1.548, d: 0.054, w: 0.057, ox: 0.012 }
], C_UNIF_K, { ebeveyn: kalca, rough: 0.88, metal: 0.06 });

// Kafa: çene 1.535 → tepe 1.760. Çene dar, kafatası geniş ve arkaya taşkın.
const H_W = egriYap([
    [1.535, 0.052], [1.570, 0.068], [1.610, 0.078], [1.660, 0.082],
    [1.710, 0.078], [1.745, 0.058], [1.760, 0.028]
]);
const H_D = egriYap([
    [1.535, 0.062], [1.570, 0.080], [1.610, 0.092], [1.660, 0.097],
    [1.710, 0.092], [1.745, 0.068], [1.760, 0.032]
]);
loft('kafa', 18, istUret(1.535, 1.760, 10, H_D, H_W, { us: 1.05, ox: 0.012 }),
     C_TEN, { ebeveyn: kalca, rough: 0.72, metal: 0.05 });
// Boyunluk: modern piyade yüzün alt yarısını kapatır. Açık kalan ten alanı
// 1.585-1.622 arası ince bir bant — figür haritada 3-4 piksel olsa da yakın
// planda "insan" okumasını bu bant veriyor.
loft('boyunluk', 18, [
    { y: 1.512, d: 0.066, w: 0.062, us: 1.0, ox: 0.010 },
    { y: 1.545, d: 0.084, w: 0.074, us: 1.0, ox: 0.012 },
    { y: 1.572, d: 0.094, w: 0.082, us: 1.0, ox: 0.014 },
    { y: 1.586, d: 0.088, w: 0.078, us: 1.05, ox: 0.014 }
], C_UNIF_K, { ebeveyn: kalca, rough: 0.90, metal: 0.05, acikUst: true });

// Kask: kafayı 2 cm boşlukla saran kabuk (gerçek kaskın iç dolgusu kadar).
const KS_W = egriYap([
    [1.652, 0.100], [1.684, 0.104], [1.716, 0.101], [1.748, 0.092],
    [1.776, 0.074], [1.800, 0.034]
]);
const KS_D = egriYap([
    [1.652, 0.114], [1.684, 0.118], [1.716, 0.114], [1.748, 0.104],
    [1.776, 0.083], [1.800, 0.038]
]);
loft('kask', 20, istUret(1.652, 1.800, 8, KS_D, KS_W, { us: 1.02, ox: 0.010 }),
     C_KASK, { ebeveyn: kalca, rough: 0.76, metal: 0.12 });
// Kenar bandı — kabuğun bittiği yeri çizmezsek kask ile kafa tek bir yumru
// gibi okunuyor (ilk kurulumda öyleydi).
loft('kask_kenar', 20, [
    { y: 1.642, d: 0.116, w: 0.102, us: 1.02, ox: 0.010 },
    { y: 1.656, d: 0.119, w: 0.105, us: 1.02, ox: 0.010 },
    { y: 1.670, d: 0.116, w: 0.102, us: 1.02, ox: 0.010 }
], C_TECH_K, { ebeveyn: kalca, rough: 0.74, metal: 0.14 });
// NVG montaj yuvası + katlanmış kol
kutu('nvg_montaj', 0.034, 0.038, 0.052, [0.126, 1.712, 0.010], C_SILAH,
     { ebeveyn: kalca, metal: 0.34, rough: 0.48 });
kutu('nvg_kol', 0.058, 0.018, 0.028, [0.152, 1.742, 0.010], C_SILAH_M,
     { ebeveyn: kalca, metal: 0.38, rough: 0.44 });
// Aktif koruma kulaklığı — iki yanda, kaskın altından
for (let i = 0; i < 2; i++) {
    const s = i ? -1 : 1;
    loft('kulaklik_' + (i + 1), 12, [
        { y: 1.598, d: 0.044, w: 0.016, us: 0.9, ox: 0.006, oz: s * 0.096 },
        { y: 1.620, d: 0.050, w: 0.024, us: 0.9, ox: 0.006, oz: s * 0.100 },
        { y: 1.646, d: 0.044, w: 0.016, us: 0.9, ox: 0.006, oz: s * 0.096 }
    ], C_SIYAH, { ebeveyn: kalca, rough: 0.62, metal: 0.16 });
    uzuv('kask_kayis_' + (i + 1), [0.066, 1.646, s * 0.094], [0.056, 1.560, s * 0.052],
         [[0, 0.008, 0.5], [1, 0.008, 0.5]], 6, C_TECH_K,
         { ebeveyn: kalca, rough: 0.80, metal: 0.10 });
}
// Gözlük: kask kenarının HEMEN ALTINDA, göz hizasında. `yassi` ile arka yarısı
// içeri çekildi — bant kafanın arkasında kalır, dışarı taşmaz.
loft('gozluk', 16, [
    { y: 1.620, d: 0.104, w: 0.092, us: 1.0, ox: 0.014, yassi: 0.45 },
    { y: 1.634, d: 0.108, w: 0.095, us: 1.0, ox: 0.016, yassi: 0.45 },
    { y: 1.648, d: 0.103, w: 0.091, us: 1.0, ox: 0.014, yassi: 0.45 }
], C_CAM, { ebeveyn: kalca, rough: 0.22, metal: 0.32 });

// ============================================================================
// 8. BACAKLAR — mafsal gruplarının İÇİNDE, yerel çerçevede
// ============================================================================
// Uyluk: kalça (y=0) → diz (y=-UYLUK). Kesit üstte kalın, dizde daralıyor;
// dizin hemen üstünde küçük bir kas şişkinliği var (düz koni cansız duruyordu).
for (let i = 0; i < 2; i++) {
    const g = bacaklar[i], gd = dizler[i], ga = ayaklar[i];
    loft('ust_bacak_' + (i + 1), 16, [
        { y: -UYLUK - 0.010, d: 0.061, w: 0.058, us: 1.0 },
        { y: -UYLUK + 0.055, d: 0.066, w: 0.063, us: 1.0 },
        { y: -0.290,         d: 0.072, w: 0.070, us: 1.0 },
        { y: -0.190,         d: 0.079, w: 0.077, us: 1.0 },
        { y: -0.090,         d: 0.084, w: 0.082, us: 1.0 },
        { y:  0.020,         d: 0.086, w: 0.083, us: 1.0 },
        { y:  0.070,         d: 0.078, w: 0.076, us: 1.0 }
    ], C_UNIF, { ebeveyn: g, rough: 0.90, metal: 0.07 });
    // Paça manşeti — botun üstüne toplanan kumaş
    loft('paca_' + (i + 1), 14, [
        { y: -0.372, d: 0.070, w: 0.067, us: 1.0 },
        { y: -0.330, d: 0.076, w: 0.073, us: 1.0 },
        { y: -0.300, d: 0.070, w: 0.067, us: 1.0 }
    ], C_UNIF_K, { ebeveyn: gd, rough: 0.90, metal: 0.06 });
    // Baldır: diz (y=0) → bilek (y=-BALDIR). Baldır kası üst üçte birde.
    loft('alt_bacak_' + (i + 1), 16, [
        { y: -BALDIR - 0.006, d: 0.046, w: 0.044, us: 1.0 },
        { y: -BALDIR + 0.060, d: 0.049, w: 0.046, us: 1.0 },
        { y: -0.290,          d: 0.055, w: 0.052, us: 1.0 },
        { y: -0.200,          d: 0.064, w: 0.060, us: 1.0 },
        { y: -0.120,          d: 0.071, w: 0.068, us: 1.0, ox: -0.006 },
        { y: -0.055,          d: 0.070, w: 0.068, us: 1.0, ox: -0.004 },
        { y:  0.012,          d: 0.062, w: 0.060, us: 1.0 }
    ], C_UNIF, { ebeveyn: gd, rough: 0.90, metal: 0.07 });
    kure('diz_kure_' + (i + 1), 0.062, [0, 0, 0], C_UNIF,
         { ebeveyn: gd, olcek: [1.0, 0.95, 0.92], rough: 0.90, metal: 0.07 });
    // Dizlik — dizin ÖN yüzüne oturan kabuk
    // ⚠️ `yassi` ile arka yarı içeri çekildi: dizlik dizin ÖNÜNDE olmalı,
    // kapalı halka olduğu için aksi hâlde diz arkasında da bir kabuk kalıyordu.
    loft('dizlik_' + (i + 1), 14, [
        { y: -0.048, d: 0.070, w: 0.062, us: 0.75, ox: 0.006, yassi: 0.45 },
        { y: -0.010, d: 0.078, w: 0.068, us: 0.75, ox: 0.008, yassi: 0.45 },
        { y:  0.036, d: 0.072, w: 0.062, us: 0.75, ox: 0.006, yassi: 0.45 }
    ], C_TECH_K, { ebeveyn: gd, rough: 0.62, metal: 0.16 });

    // Postal: bilek (y=0) → taban (y=TABAN_DY). Konç yukarı doğru uzuyor.
    loft('bot_' + (i + 1), 16, [
        { y: TABAN_DY + 0.014, d: 0.118, w: AYAK_W,        us: 0.72, ox: 0.052 },
        { y: TABAN_DY + 0.048, d: 0.122, w: AYAK_W + 0.002, us: 0.70, ox: 0.050 },
        { y:  0.000,           d: 0.098, w: 0.056,         us: 0.80, ox: 0.024 },
        { y:  0.048,           d: 0.062, w: 0.052,         us: 0.90, ox: -0.004 },
        { y:  0.096,           d: 0.060, w: 0.051,         us: 0.95, ox: -0.006 }
    ], C_BOT, { ebeveyn: ga, rough: 0.68, metal: 0.12 });
    // Taban: postalın ALTINDAKİ düz levha. Zemin kilidi bunun köşelerini
    // ölçüyor (davranıştaki topuk/burun noktaları buradan geliyor).
    loft('bot_taban_' + (i + 1), 16, [
        { y: TABAN_DY,         d: 0.124, w: AYAK_W + 0.003, us: 0.55, ox: 0.055 },
        { y: TABAN_DY + 0.016, d: 0.126, w: AYAK_W + 0.005, us: 0.55, ox: 0.055 },
        { y: TABAN_DY + 0.028, d: 0.122, w: AYAK_W + 0.002, us: 0.60, ox: 0.054 }
    ], C_BOT_T, { ebeveyn: ga, rough: 0.94, metal: 0.03 });
    kutu('bot_bag_' + (i + 1), 0.052, 0.010, 0.046, [0.028, 0.040, 0], C_SIYAH,
         { ebeveyn: ga, metal: 0.06, rough: 0.90 });
    kutu('bot_bag2_' + (i + 1), 0.048, 0.009, 0.044, [0.020, 0.070, 0], C_SIYAH,
         { ebeveyn: ga, metal: 0.06, rough: 0.90 });
}

// ============================================================================
// 9. OMUZ KUŞAĞI — kollar + TÜFEK (omuz_grup)
// ============================================================================
// ⚠️ İki kol da tüfeği tuttuğu için SERBEST SALINAMAZ. Yürüyüşün "kollar
// bacaklarla zıt fazda" okuması bu yüzden OMUZ KUŞAĞININ karşı-dönüşüyle
// veriliyor: gerçek yürüyüşte de pelvis bir yöne, göğüs kafesi öbür yöne
// döner ve silah taşıyan erin kolları tam olarak böyle salınır. Tüfek de bu
// grupta olduğu için "tüfek gövdeyle birlikte" şartı sağlanıyor ve eller
// silahtan hiç ayrılmıyor.
for (let i = 0; i < 2; i++) {
    const s = i ? -1 : 1;
    // Omuz kapağı (deltoid + omuz pedi): gövde ile kolun birleştiği yeri
    // ÖRTÜYOR. Kuşak döndüğünde açık kalan hiçbir yer olmasın diye gövdenin
    // omuz genişliğinden (0.183) belirgin biçimde geniş (0.176+0.072).
    // ⚠️ Küre DEĞİL, YASSI omuz başlığı. İlk kurulumda tam küreydi ve tepe
    // bakışında kafayla birlikte "üç top" gibi okunuyordu (ölçüldü: tepe
    // siluetinde omuz genişliği kafanınkiyle aynı yuvarlaklıkta).
    kure('omuz_kapak_' + (i + 1), 0.070, [0.004, OMUZ_Y + 0.006, s * OMUZ_Z],
         C_UNIF, { ebeveyn: omuz, olcek: [1.02, 0.92, 0.94], rough: 0.90, metal: 0.07 });
    kure('omuz_ped_' + (i + 1), 0.054, [-0.002, OMUZ_Y + 0.030, s * (OMUZ_Z + 0.004)],
         C_TECH, { ebeveyn: omuz, olcek: [1.12, 0.50, 1.02], rough: 0.80, metal: 0.10 });
}

// ---- kol duruşu (göğüs ÖNÜNDE, namlu aşağı taşıma) -------------------------
// ⚠️ İLK KURULUM ÖLÇÜLDÜ VE YANLIŞTI. Dipçik x = -0.100'deydi, yani gövde
// merkezinin ARKASINDA; namlu ise önde. Eksen böylece gövdenin İÇİNDEN
// geçiyordu. piyade_kesisim.py GERÇEK motorda ölçtü (kutu değil, kol/tüfek
// tepe noktaları tek tek gövde üçgenlerine karşı): tüfek dipçiği yeleğin
// 96.9 mm içinde, üst ray 98.2 mm, ön kol 59.2 mm, eldiven 45.6 mm.
// ⚠️ KUSUR DURUŞTA DA VARDI (dipçik duruşta da 96.9 mm; omuz salınımının
// kattığı en fazla 12.5 mm). Yani sebep salınım genliği DEĞİL geometriydi —
// `_PY_OMUZ` oranına dokunulmadı.
// ⚠️ TÜFEK BOYU (eksen uzunluğu 0.8474 m) DEĞİŞMEDİ: parçalar eksen üzerine
// t oranıyla oturduğu, kutu ölçüleri ise mutlak olduğu için boy değişseydi
// bütün yerleşim (dipçik/gövde/el kundağı aralıkları) bozulurdu. Değişen
// yalnız silahın gövdeye göre YERİ ve AÇISI: dipçik -z omuz cebine ama
// yeleğin ÖNÜNE alındı, namlu 46° aşağı / 30° içe çevrildi. Sayılar göz
// kararı değil piyade_silah_lab.py taramasından (aday duruşlar, ölçüt
// "kol+tüfek yüzeyinin gövde içinde kalan en derin noktası").
// (Ayna yüzünden üründe SAĞ omuza dayalı görünür — dosya başındaki not.)
const T_DIP = [0.1500, 1.4000, -0.1900];   // dipçik: omuz cebi, yeleğin ÖNÜNDE
const T_AGZ = [0.6598, 0.7904,  0.1043];   // namlu ağzı: 46° aşağı, öne-içe
function tNokta(t) {
    return [T_DIP[0] + (T_AGZ[0] - T_DIP[0]) * t,
            T_DIP[1] + (T_AGZ[1] - T_DIP[1]) * t,
            T_DIP[2] + (T_AGZ[2] - T_DIP[2]) * t];
}
// Kabza eli (dipçik tarafı) ve el kundağı eli (ileri). Ölçüler tüfek
// ekseninden türetildi, göz kararı değil: eller silahın KENDİ çerçevesinde
// eskisiyle aynı yerde duruyor — kabza eli eksenin 9.16 cm altında t=0.352'de,
// destek eli 4.67 cm altında t=0.47'de. Eksen döndüğü için yalnız dünya
// koordinatları değişti, "eller silahtan ayrılmıyor" şartı korundu.
const EL_1 = [0.2724, 1.1218, -0.1193];
const EL_2 = [0.3605, 1.0811, -0.0685];
const OMZ_1 = [0.006, OMUZ_Y, -OMUZ_Z];
const OMZ_2 = [0.006, OMUZ_Y,  OMUZ_Z];
// Dirsekler aşağı-dışa. ⚠️ Elle konmadılar: omuz-el doğrusunun etrafındaki
// DAİRE üzerinde çözüldüler, böylece üst kol (0.2914 / 0.3001) ve ön kol
// (0.2458 / 0.2856) uzunlukları eskisiyle BİREBİR aynı kaldı — uzuv geometrisi
// hiç değişmedi, yalnız yerleri değişti. Kabza kolu belirgin bükülü (omuz-el
// arası 0.40 m, iki uzuv toplamı 0.54), destek kolu daha açık (0.54 / 0.59).
// Destek dirseğinin dışa payı göğüs fişekliğine değmeyecek biçimde ÖLÇÜLDÜ.
const DIR_1 = [0.0596, 1.1362, -0.2416];
const DIR_2 = [0.2175, 1.2042,  0.1459];
const KOL = [[OMZ_1, DIR_1, EL_1, -1], [OMZ_2, DIR_2, EL_2, 1]];
for (let i = 0; i < 2; i++) {
    const K = KOL[i], s = K[3];
    uzuv('ust_kol_' + (i + 1), K[0], K[1],
         [[0, 0.062], [0.25, 0.058], [0.65, 0.050], [1, 0.045]], 14, C_UNIF,
         { ebeveyn: omuz, rough: 0.90, metal: 0.07 });
    kure('dirsek_' + (i + 1), 0.047, K[1], C_UNIF,
         { ebeveyn: omuz, rough: 0.90, metal: 0.07 });
    kure('dirseklik_' + (i + 1), 0.050,
         [K[1][0] + 0.016, K[1][1] - 0.008, K[1][2] + s * 0.010],
         C_TECH_K, { ebeveyn: omuz, olcek: [0.90, 0.90, 0.85], rough: 0.62, metal: 0.16 });
    uzuv('alt_kol_' + (i + 1), K[1], K[2],
         [[0, 0.047], [0.35, 0.044], [0.80, 0.036], [1, 0.033]], 14, C_UNIF,
         { ebeveyn: omuz, rough: 0.90, metal: 0.07 });
    // Eldivenli el — avuç silahı sardığı için basık elipsoit
    kure('eldiven_' + (i + 1), 0.045,
         [K[2][0] + 0.010, K[2][1] + 0.008, K[2][2]], C_ELDIVEN,
         { ebeveyn: omuz, olcek: [1.25, 0.86, 0.80], rough: 0.72, metal: 0.10 });
}

// ---- tüfek ------------------------------------------------------------------
// İmalat ürünü: kutu ve silindirin DOĞRU yeri burası (dosya başındaki not).
// Parçalar T_DIP → T_AGZ ekseni üzerinde t oranıyla, eksene göre yönlenmiş
// olarak yerleşiyor.
const TV = [T_AGZ[0] - T_DIP[0], T_AGZ[1] - T_DIP[1], T_AGZ[2] - T_DIP[2]];
const TL = Math.sqrt(TV[0] * TV[0] + TV[1] * TV[1] + TV[2] * TV[2]);
const TU = [TV[0] / TL, TV[1] / TL, TV[2] / TL];
const T_YAW = Math.atan2(-TU[2], TU[0]);
const T_PIT = Math.asin(TU[1]);
function tufekKutu(ad, boy, yuk, en, t, dy, renk, opts) {
    opts = opts || {};
    const geo = new THREE.BoxGeometry(boy, yuk, en);
    if (dy) geo.translate(0, dy, 0);
    geo.rotateZ(T_PIT);
    geo.rotateY(T_YAW);
    const p = tNokta(t);
    geo.translate(p[0], p[1], p[2]);
    const m = mesh(geo, renk, {
        metal: opts.metal == null ? 0.34 : opts.metal,
        rough: opts.rough == null ? 0.50 : opts.rough, flat: true, name: ad
    });
    omuz.add(m);
    return m;
}
tufekKutu('tufek_dipcik', 0.150, 0.078, 0.042, 0.078, 0.006, C_SILAH);
tufekKutu('tufek_dipcik_pad', 0.020, 0.086, 0.044, 0.008, 0.006, C_SIYAH,
          { metal: 0.10, rough: 0.84 });
tufekKutu('tufek_boru', 0.110, 0.036, 0.032, 0.192, 0.010, C_SILAH_M);
tufekKutu('tufek_govde', 0.200, 0.070, 0.044, 0.330, 0.000, C_SILAH);
tufekKutu('tufek_ust_ray', 0.330, 0.014, 0.026, 0.360, 0.040, C_SILAH_M,
          { metal: 0.40, rough: 0.42 });
tufekKutu('tufek_elkundagi', 0.262, 0.052, 0.040, 0.600, -0.002, C_SILAH);
tufekKutu('tufek_kabza', 0.038, 0.098, 0.034, 0.268, -0.070, C_SILAH,
          { metal: 0.16, rough: 0.72 });
tufekKutu('tufek_sarjor', 0.046, 0.148, 0.032, 0.380, -0.090, C_SILAH,
          { metal: 0.20, rough: 0.66 });
tufekKutu('tufek_tetik', 0.048, 0.028, 0.024, 0.318, -0.040, C_SILAH_M);
tufekKutu('tufek_nisan', 0.086, 0.048, 0.046, 0.400, 0.070, C_SILAH,
          { metal: 0.36, rough: 0.44 });
tufekKutu('tufek_nisan_cam', 0.010, 0.038, 0.036, 0.455, 0.070, C_CAM,
          { metal: 0.30, rough: 0.18 });
(function () {
    // ⚠️ Namlu el kundağının İÇİNDEN başlıyor. İlk kurulumda t=0.80'de
    // başlıyordu ve kundakla arasında 6 cm'lik boşluk kalmıştı: yan bakışta
    // namlu havada duran ayrı bir çubuk gibi okunuyordu (motosiklet dersi).
    const nam = new THREE.CylinderGeometry(0.011, 0.010, 0.290, 10, 1);
    nam.rotateZ(-Math.PI / 2);
    nam.rotateZ(T_PIT);
    nam.rotateY(T_YAW);
    const p = tNokta(0.835);
    nam.translate(p[0], p[1], p[2]);
    omuz.add(mesh(nam, C_SILAH_M, { metal: 0.42, rough: 0.38, name: 'tufek_namlu' }));
    const agz = new THREE.CylinderGeometry(0.019, 0.017, 0.058, 10, 1, true);
    agz.rotateZ(-Math.PI / 2);
    agz.rotateZ(T_PIT);
    agz.rotateY(T_YAW);
    const q = tNokta(0.985);
    agz.translate(q[0], q[1], q[2]);
    const am = mesh(agz, C_SILAH_M, { metal: 0.44, rough: 0.36, name: 'tufek_agiz' });
    am.material.side = THREE.DoubleSide;
    omuz.add(am);
})();
// Askı iki bacaklı: gerçek askı da tüfeğin arka bağlantılarından alınıp
// boyundan dolanır.
// ⚠️ ASKININ ÜST UÇLARI DA ÖLÇÜLDÜ. Eskiden (x = 0.034 / 0.062) uçlar yeleğin
// TAM İÇİNDEYDİ (71.6 mm / 64.5 mm). Yeni uçlar yeleğin üst kenarının üstünde
// (y = 1.486) ve önünde. İkinci kayış da tüfeğin ARKA yarısına (t = 0.368)
// bağlandı: silah aşağı sarktığı için eski ön bağlantı (t = 0.640) göğsün
// önünden geçen DÜZ bir tüp gerektiriyordu ve göğüs bombesini kesiyordu
// (uzuv düz bir tüptür, gövdeyi saramaz).
uzuv('tufek_kayis_1', [0.125, 1.486, -0.118], tNokta(0.128),
     [[0, 0.010, 0.35], [1, 0.010, 0.35]], 6, C_TECH_K, { ebeveyn: omuz, rough: 0.84 });
uzuv('tufek_kayis_2', [0.125, 1.486, 0.118], tNokta(0.368),
     [[0, 0.010, 0.35], [1, 0.010, 0.35]], 6, C_TECH_K, { ebeveyn: omuz, rough: 0.84 });

// ---- DAVRANIŞIN OKUDUĞU NİŞAN GEOMETRİSİ (ateş) ----------------------------
// TEK KAYNAK burası: studio-3d.js hiçbir sayıyı kopyalamıyor, hepsi tüfek
// ekseninden (TU) türüyor. Duruşta namlu 46° AŞAĞI ve 30° İÇE bakıyor
// (yukarıdaki taşıma duruşu); ateş için silahın YATAY ve +x'e bakması
// gerekiyor. İki dönüşle çözülüyor ve SIRA ÖNEMLİ — grup hiyerarşisi
// omuz_grup(rotation.y) → nisan_grup(rotation.z), yani R = Ry(yaw)·Rz(pitch):
//   nisanZ = −atan2(TU.y, TU.x)            eksenin x-y düzlemindeki açısı
//   nisanY = atan2(TU.z, hypot(TU.x,TU.y)) döndükten SONRA kalan yan açı
// Rz(nisanZ)·TU = (hypot(TU.x,TU.y), 0, TU.z), sonra Ry(nisanY) onu tam
// (1,0,0)'a getiriyor.
//
// ⚠️ PİVOT İKİ OMUZ MAFSALINDAN GEÇEN EKSEN (x = 0.006, y = OMUZ_Y). Nişan
// dönüşü kolları ve tüfeği birlikte kaldırıyor; iki omuz mafsalı da bu
// eksenin ÜSTÜNDE olduğu için dönerken YERİNDE kalıyorlar, yani kol kökü
// omuz kapağından hiç ayrılmıyor. Başka bir pivot (örneğin dipçik) namluyu
// daha az kaldırırdı ama kolları omuzdan koparırdı.
const T_UC = [T_DIP[0] + (0.985 * TL + 0.029) * TU[0],
              T_DIP[1] + (0.985 * TL + 0.029) * TU[1],
              T_DIP[2] + (0.985 * TL + 0.029) * TU[2]];
modelGroup.userData.piyadeSilah = {
    dip: T_DIP.slice(), agz: T_AGZ.slice(), u: TU.slice(), boy: TL,
    uc: T_UC,                                   // namlu ağzının UÇ noktası
    pivot: [0.006, OMUZ_Y],                     // omuz ekseni (x, y)
    nisanZ: -Math.atan2(TU[1], TU[0]),
    nisanY: Math.atan2(TU[2], Math.hypot(TU[0], TU[1])),
    // Nişan grubuna TAŞINACAK parçalar: iki kol + eldivenler + bütün tüfek
    // + askı. omuz_kapak / omuz_ped / arma DIŞARIDA — onlar gövdenin omuz
    // kuşağı, silahla birlikte kalkmazlar (mafsalı örtmeye devam ederler).
    parca: ['ust_kol_1', 'ust_kol_2', 'dirsek_1', 'dirsek_2',
            'dirseklik_1', 'dirseklik_2', 'alt_kol_1', 'alt_kol_2',
            'eldiven_1', 'eldiven_2',
            'tufek_dipcik', 'tufek_dipcik_pad', 'tufek_boru', 'tufek_govde',
            'tufek_ust_ray', 'tufek_elkundagi', 'tufek_kabza', 'tufek_sarjor',
            'tufek_tetik', 'tufek_nisan', 'tufek_nisan_cam',
            'tufek_namlu', 'tufek_agiz', 'tufek_kayis_1', 'tufek_kayis_2']
};

// ============================================================================
// 10. KÜÇÜK İŞARETLER
// ============================================================================
// Kol arması ve göğüs bandı — tek renkli üniformada ölçek hissi veriyor.
kutu('ad_bandi', 0.010, 0.020, 0.062, [0.154, 1.362, -0.030], C_TECH_K,
     { ebeveyn: kalca, metal: 0.08, rough: 0.88 });
for (let i = 0; i < 2; i++) {
    const s = i ? -1 : 1;
    // Kol armasi: kolun DIS yuzeyine oturmali. Ilk kurulumda |z| = 0.218
    // idi ve ust kolun yaricapi (0.058, merkezi 0.180) yuzunden parcanin
    // ICINDE kaliyordu -- hic gorunmuyordu.
    kure('arma_' + (i + 1), 0.032,
         [0.026, OMUZ_Y - 0.062, s * (OMUZ_Z + 0.058)], C_TECH_K,
         { ebeveyn: omuz, olcek: [1.0, 1.25, 0.34], rough: 0.88, metal: 0.06 });
}
