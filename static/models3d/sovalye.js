// Şövalye — 14.–15. yy Batı Avrupa plaka zırhlı süvarisi, savaş atı üstünde,
// mızrak koltuk altında yatay. Historical Warfare grubunun İKİNCİ modeli ve
// kütüphanenin İLK DÖRT AYAKLISI.
//
// ⚠️ ID `sovalye`, EN adı "Knight". Etiketlerde `askeri` YOK, `tarihi` VAR —
// kategori `tarihi` → Historical Warfare eşlemesinden geliyor.
//
// ============================================================================
// ÖLÇÜLERİN KAYNAĞI (ezberden yazılmadı)
// ============================================================================
// AT — cidago (withers) 1.520 m = 15 hh.
//   Exeter "Warhorse" projesi / Ameen ve ark., 1964 at kemiği, 171 kazı alanı
//   (MS 300–1650, İngiltere): ortaçağ atları ÇOĞUNLUKLA 13–14 hh (1.32–1.42 m),
//   midilli eşiği 1.48 m; 15–16 hh olanlar 13.–14. yy'da bile NADİR. Yani
//   1.52 m bu dağılımın ÜST UCU: bir baronun tam zırhlı süvarisini taşıyan
//   seçilmiş destrier. "Shire atı kadar dev destrier" efsanesi ölçümle çürüğe
//   çıkmış durumda ve bu modelde de tekrarlanmadı.
//   Gövde uzunluğu (omuz ucu → oturak ucu) = cidago ("kare at", UMN Extension
//   konformasyon kuralı) → 1.52 m; kafa boyu = cidago/2.5 = 0.608 m; ense
//   yüksekliği = 3 kafa boyu = 1.82 m (Fransız veteriner ekolünün ölçü birimi).
//   Göğüs derinliği (cidago → dirsek) = cidago/2 = 0.76 m.
// MIZRAK — dip topuzdan uca 3.444 m (ÖLÇÜLDÜ, aşağıdaki M_DIP/M_UC'den).
//   Savaş mızrağı 9–14 ft (2.74–4.27 m) aralığında; 12 ft (3.66 m) tipik.
//   Turnuva mızrakları daha uzun (16 ft'e kadar) ama bu bir SAVAŞ harnesi,
//   turnuva takımı değil.
// BİNİCİ — ayakta 1.75 m; eyerde oturak 1.478, miğfer tepesi 2.36 m.
//
// ============================================================================
// PARÇA / GRUP SÖZLEŞMESİ (studio-3d.js `registerBehavior('sovalye')` arar)
// ============================================================================
//   at_govde        : at gövdesi + boyun + kafa + kuyruk + örtü + eyer + BİNİCİ
//                     ve dört bacağın kökü. Davranış YALNIZ position.y yazar.
//   on_bacak_1/2    : J0 kürek (scapula) dönme merkezi.  rotation.z
//   on_omuz_1/2     : J1 omuz eklemi        (on_bacak_i'nin çocuğu)
//   on_diz_1/2      : J2 karpus / ön diz    (on_omuz_i'nin çocuğu)
//   on_toynak_1/2   : J3 bilek (fetlock)    (on_diz_i'nin çocuğu)
//   arka_bacak_1/2  : J0 kalça eklemi
//   arka_diz_1/2    : J1 diz (stifle)
//   arka_cuku_1/2   : J2 çükü (hock)
//   arka_toynak_1/2 : J3 bilek (fetlock)
//   userData.sovalye: iki bacak zincirinin ÖLÇÜLERİ + ayakta duruş açıları.
//                     Adım (stride) uzunluğu BU sayılardan çözülüyor;
//                     studio-3d.js'e sabit kopyalanmıyor.
//
// ⚠️ 1/2: _1 = model +z tarafı, _2 = -z tarafı.
// ⚠️ ÖN ve ARKA ZİNCİR FARKLI. Ön: kürek–omuz–karpus–bilek, ayakta neredeyse
// düz bir sütun (at bu yüzden ayakta uyuyabiliyor). Arka: kalça–diz–çükü–bilek,
// ayakta belirgin zikzak (çükü açısı 95°). İkisi ayrı ölçülerle kuruldu.
// ⚠️ HARİTA SOLDAN SAĞA AYNALIYOR (devir §5.3, det(projection) < 0). Mızrak
// ham koordinatta -z (sol) koltuk altına kuruldu; ÜRÜN onu aynalayıp tarihsel
// olarak doğru olan SAĞ koltuk altında gösteriyor.
//
// YÖN: burun +x, üst +y, taban y=0. Ölçüler gerçek metre.

// ============================================================================
// 0. RENKLER
// ============================================================================
// ⚠️ metalness iki uçlu (devir §5.1): 0.85+ neredeyse SİYAH (sahnede envmap
// yok), ama metalness'i DÜŞÜRMEK açık renkte patlamayı ARTIRIR. Plaka zırh tam
// bu dengede duruyor — palet parlaklik.py ile TARANDI (tek renk değil, PALET).
const C_KIL     = '#6b5236';   // at donu (doru) — gövdenin görünen yerleri
const C_KIL_K   = '#3a2b1c';   // koyu uçlar: bacak, yele, kuyruk
const C_TOYNAK  = '#2b2521';   // toynak
const C_ORTU    = '#8e3a34';   // at örtüsü (caparison) — _TINT BİRİNCİL
const C_ORTU_K  = '#6a2a25';   // örtünün dilimli kenarı ve dikişi
const C_ZIRH    = '#8d949c';   // plaka zırh — _TINT İKİNCİL
const C_ZIRH_K  = '#666d75';   // zırhın gölgeli aksamı, zincir, tokalar
const C_ALTIN   = '#9c8446';   // pirinç/yaldız süs
const C_DERI    = '#4a382a';   // eyer ve koşum derisi
const C_DERI_K  = '#2f2418';
const C_MIZRAK  = '#8a6a44';   // dişbudak mızrak sapı
const C_SIYAH   = '#1b1c1e';

// ============================================================================
// 1. AT — bacak zincirlerinin ölçüleri (TEK KAYNAK)
// ============================================================================
const CIDAGO   = 1.520;
// ÖN zincir eklem noktaları (yandan, ayakta): J0 kürek merkezi, J1 omuz,
// J2 karpus, J3 bilek. Uzunluklar bu noktalardan HESAPLANDI.
const ON_J0 = [0.620, 1.380], ON_J1 = [0.780, 1.030];
const ON_J2 = [0.620, 0.460], ON_J3 = [0.620, 0.200];
// ARKA zincir: J0 kalça, J1 diz (stifle), J2 çükü (hock), J3 bilek.
const AR_J0 = [-0.600, 0.980], AR_J1 = [-0.450, 0.670];
const AR_J2 = [-0.780, 0.505], AR_J3 = [-0.660, 0.200];
const ON_Z = 0.148, AR_Z = 0.172;          // bacakların yanal ofseti
// Toynak (pastern + tırnak) — bilek çerçevesinde
const TABAN_DY = -0.200, TOPUK_X = -0.005, BURUN_X = 0.130;

function uzunluk(a, b) { return Math.sqrt((b[0]-a[0])*(b[0]-a[0]) + (b[1]-a[1])*(b[1]-a[1])); }
// Bir uzvun "aşağıdan saat yönünün tersi" açısı: 0 = tam aşağı, + = ileri.
function uzuvAci(a, b) { return Math.atan2(b[0]-a[0], a[1]-b[1]); }

const ON_A = uzunluk(ON_J0, ON_J1), ON_B = uzunluk(ON_J1, ON_J2), ON_C = uzunluk(ON_J2, ON_J3);
const AR_A = uzunluk(AR_J0, AR_J1), AR_B = uzunluk(AR_J1, AR_J2), AR_C = uzunluk(AR_J2, AR_J3);
const ON_FA = uzuvAci(ON_J0, ON_J1), ON_FB = uzuvAci(ON_J1, ON_J2), ON_FC = uzuvAci(ON_J2, ON_J3);
const AR_FA = uzuvAci(AR_J0, AR_J1), AR_FB = uzuvAci(AR_J1, AR_J2), AR_FC = uzuvAci(AR_J2, AR_J3);

modelGroup.userData.sovalye = {
    cidago: CIDAGO,
    // ön zincir
    onPx: ON_J0[0], onPy: ON_J0[1], onA: ON_A, onB: ON_B, onC: ON_C,
    onAx0: ON_J3[0], onAy0: ON_J3[1],
    onFA: ON_FA, onFB: ON_FB, onFC: ON_FC,
    onKapa0: ON_FC - ON_FB,
    onKapaMin: -2.0 * Math.PI / 180,     // karpus yük altında bu kadar açılır
    onKatla: 62.0 * Math.PI / 180,       // salınımda ek katlanma
    onKaldir: 0.085,
    // arka zincir
    arPx: AR_J0[0], arPy: AR_J0[1], arA: AR_A, arB: AR_B, arC: AR_C,
    arAx0: AR_J3[0], arAy0: AR_J3[1],
    arFA: AR_FA, arFB: AR_FB, arFC: AR_FC,
    arKapa0: AR_FC - AR_FB,
    arKapaMin: 24.0 * Math.PI / 180,
    arKatla: 46.0 * Math.PI / 180,
    arKaldir: 0.075,
    // toynak
    tabanDy: TABAN_DY, topukX: TOPUK_X, burunX: BURUN_X
};

// ============================================================================
// 2. YARDIMCILAR
// ============================================================================
// Monoton kübik (PCHIP) — otomobil.js §2 / piyade.js §2 ile aynı gerekçe.
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

function geoYap(P, IDX, renk, ad, opts) {
    opts = opts || {};
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

// ---- X EKSENİ BOYUNCA LOFT (at gövdesi, örtü, eyer) ------------------------
// ⚠️ At gövdesinin ekseni X. Piyadenin loftu Y boyunca ilerliyordu; kesit
// halkası orada (x,z) düzlemindeydi, burada (y,z). Kesit yukarı ve aşağı AYRI
// yarı-yükseklik alıyor: at sırtı ile karnı simetrik değil.
// Sarım: istasyonlar +x'e, halka +y'den -z'ye ilerlerken dış normal çıkar
//   (+x) × (-z) = +y  → halkanın tepesinde normal yukarı. ✔
function halkaX(s, a) {
    const ca = Math.cos(a), sa = Math.sin(a);
    const us = s.us == null ? 1.0 : s.us;
    const hy = ca >= 0 ? s.hyU : s.hyD;
    const y = s.cy + hy * (ca < 0 ? -1 : 1) * Math.pow(Math.abs(ca), us);
    const z = -s.hz * (sa < 0 ? -1 : 1) * Math.pow(Math.abs(sa), us) + (s.oz || 0);
    return [y, z];
}
function loftX(ad, n, ist, renk, opts) {
    opts = opts || {};
    const P = [], IDX = [], M = ist.length;
    for (let i = 0; i < M; i++) {
        const s = ist[i];
        for (let j = 0; j < n; j++) {
            const p = halkaX(s, 2 * Math.PI * j / n);
            P.push(s.x, p[0], p[1]);
        }
    }
    // ⚠️ SARIM ISTASYON YONUNE BAGLI. Halka hep ayni yonde (+y'den -z'ye)
    // yaziliyor ama surme ekseni U istasyonlarin gittigi yon. Artan x'te
    // uclu sol elli (y x -z = -x = -U) ve (a, c, d2) DISA bakiyor — dosyanin
    // yukaridaki yorumu bu durumu anlatiyor. AZALAN x'te U isaret degistirip
    // uclu sag elli oluyor ve ayni sira ICE bakiyor; `eyer` ile
    // `eyer_arka_kas` boyle yazilmis. Isaret artik istasyonlardan turetiliyor;
    // artan cagrilarda uretilen indeksler DEGISMIYOR.
    const ileri = ist[M - 1].x >= ist[0].x;
    for (let i = 0; i < M - 1; i++) {
        for (let j = 0; j < n; j++) {
            const j2 = (j + 1) % n;
            const a = i * n + j, b = i * n + j2;
            const c = (i + 1) * n + j, d2 = (i + 1) * n + j2;
            if (ileri) IDX.push(a, c, d2, a, d2, b);
            else IDX.push(a, d2, c, a, b, d2);
        }
    }
    for (let uc = 0; uc < 2; uc++) {
        if (uc === 0 && opts.acikArka) continue;
        if (uc === 1 && opts.acikOn) continue;
        const s = ist[uc ? M - 1 : 0];
        let my = 0, mz = 0;
        const h = [];
        for (let j = 0; j < n; j++) {
            const p = halkaX(s, 2 * Math.PI * j / n); h.push(p); my += p[0]; mz += p[1];
        }
        const merkez = P.length / 3;
        P.push(s.x, my / n, mz / n);
        const bas = merkez + 1;
        for (let j = 0; j < n; j++) P.push(s.x, h[j][0], h[j][1]);
        for (let j = 0; j < n; j++) {
            const a = bas + j, b = bas + (j + 1) % n;
            // ⚠️ Kapaklar HER cagride tersti (yanlardan bagimsiz kusur), ve
            // ayrica yan yuzeyler gibi surme yonune bagli. Sol elli ucluda
            // (ileri) artan aci yelpazesinin normali -U: uc=0 onu ister,
            // uc=1 tersini; azalan istasyonda ikisi de yer degistirir.
            if (ileri === !!uc) IDX.push(merkez, b, a);
            else IDX.push(merkez, a, b);
        }
    }
    return geoYap(P, IDX, renk, ad, opts);
}

// ---- EĞRİ BOYUNCA SÜPÜRME (boyun, kafa, kuyruk, yele) ---------------------
// Yol (x,y) düzleminde; halka düzlemi teğete dik. e1 = düzlem içi dik (üst
// taraf), e2 = -z. Normal = t × e2, teğet +x iken +y çıkıyor. ✔
function omurga(ad, n, ist, renk, opts) {
    opts = opts || {};
    const M = ist.length, P = [], IDX = [];
    for (let i = 0; i < M; i++) {
        const s = ist[i];
        const a = ist[Math.max(0, i - 1)].p, b = ist[Math.min(M - 1, i + 1)].p;
        let tx = b[0] - a[0], ty = b[1] - a[1];
        const tl = Math.sqrt(tx * tx + ty * ty) || 1;
        tx /= tl; ty /= tl;
        const e1x = -ty, e1y = tx;
        const us = s.us == null ? 1.0 : s.us;
        for (let j = 0; j < n; j++) {
            const ang = 2 * Math.PI * j / n;
            const ca = Math.cos(ang), sa = Math.sin(ang);
            const hh = (ca >= 0 ? (s.hU == null ? s.h : s.hU) : (s.hD == null ? s.h : s.hD));
            const u = hh * (ca < 0 ? -1 : 1) * Math.pow(Math.abs(ca), us);
            const v = -s.w * (sa < 0 ? -1 : 1) * Math.pow(Math.abs(sa), us);
            P.push(s.p[0] + e1x * u, s.p[1] + e1y * u, v + (s.oz || 0));
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
    for (let uc = 0; uc < 2; uc++) {
        if (uc === 0 && opts.acikBas) continue;
        if (uc === 1 && opts.acikUc) continue;
        const i = uc ? M - 1 : 0;
        let mx = 0, my = 0, mz = 0;
        for (let j = 0; j < n; j++) {
            mx += P[(i * n + j) * 3]; my += P[(i * n + j) * 3 + 1]; mz += P[(i * n + j) * 3 + 2];
        }
        const merkez = P.length / 3;
        P.push(mx / n, my / n, mz / n);
        const bas = merkez + 1;
        for (let j = 0; j < n; j++) {
            P.push(P[(i * n + j) * 3], P[(i * n + j) * 3 + 1], P[(i * n + j) * 3 + 2]);
        }
        for (let j = 0; j < n; j++) {
            const a = bas + j, b = bas + (j + 1) % n;
            if (uc) IDX.push(merkez, b, a); else IDX.push(merkez, a, b);
        }
    }
    return geoYap(P, IDX, renk, ad, opts);
}

// ---- İKİ NOKTA ARASI UZUV (bacak uzuvları, kollar, mızrak) ----------------
// piyade.js §3 ile birebir aynı; `sq` yanal basıklık (at bacağı yandan dar,
// önden derin).
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
    return geoYap(P, IDX, renk, ad, opts);
}

function kure(ad, r, pos, renk, opts) {
    opts = opts || {};
    const geo = new THREE.SphereGeometry(r, opts.seg || 12, opts.seg2 || 8);
    if (opts.olcek) geo.scale(opts.olcek[0], opts.olcek[1], opts.olcek[2]);
    if (opts.rot) { if (opts.rot[2]) geo.rotateZ(opts.rot[2]); if (opts.rot[1]) geo.rotateY(opts.rot[1]); }
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
    if (opts.rot) {
        if (opts.rot[0]) geo.rotateX(opts.rot[0]);
        if (opts.rot[1]) geo.rotateY(opts.rot[1]);
        if (opts.rot[2]) geo.rotateZ(opts.rot[2]);
    }
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
        if (opts.rot[2]) geo.rotateZ(opts.rot[2]);
        if (opts.rot[1]) geo.rotateY(opts.rot[1]);
        if (opts.rot[0]) geo.rotateX(opts.rot[0]);
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
// 3. GRUPLAR — pivot-ofset ikilisi (piyade §4 ile aynı gerekçe)
// ============================================================================
// ⚠️ Motorun `_WHEELS.front` mekanizması BURADA KULLANILAMAZ: her parçayı KENDİ
// merkezinden döndürüyor. Uzuv ise EKLEMDEN döner. Her mafsal bir GRUP; grubun
// konumu eklemin ta kendisi; geometri o ekleme göre yazılıyor. Kurulumdaki
// bütün rotasyonlar SIFIR — uzuvlar zaten ayakta duruş yönünde çiziliyor.
// Böylece davranış GÖRELİ açı yazıyor ve env=0'da tam sıfır oluyor.
const govde = new THREE.Group(); govde.name = 'at_govde';
modelGroup.add(govde);

const bacakGrup = {}, dizGrup = {}, cukuGrup = {}, toynakGrup = {};
for (let i = 0; i < 2; i++) {
    const s = i === 0 ? 1 : -1, no = i + 1;
    // --- ÖN ---
    const b = new THREE.Group(); b.name = 'on_bacak_' + no;
    b.position.set(ON_J0[0], ON_J0[1], s * ON_Z); govde.add(b);
    const o = new THREE.Group(); o.name = 'on_omuz_' + no;
    o.position.set(ON_J1[0] - ON_J0[0], ON_J1[1] - ON_J0[1], 0); b.add(o);
    const d = new THREE.Group(); d.name = 'on_diz_' + no;
    d.position.set(ON_J2[0] - ON_J1[0], ON_J2[1] - ON_J1[1], 0); o.add(d);
    const t = new THREE.Group(); t.name = 'on_toynak_' + no;
    t.position.set(ON_J3[0] - ON_J2[0], ON_J3[1] - ON_J2[1], 0); d.add(t);
    bacakGrup['on' + no] = b; dizGrup['on' + no] = o;
    cukuGrup['on' + no] = d; toynakGrup['on' + no] = t;
    // --- ARKA ---
    const B = new THREE.Group(); B.name = 'arka_bacak_' + no;
    B.position.set(AR_J0[0], AR_J0[1], s * AR_Z); govde.add(B);
    const D = new THREE.Group(); D.name = 'arka_diz_' + no;
    D.position.set(AR_J1[0] - AR_J0[0], AR_J1[1] - AR_J0[1], 0); B.add(D);
    const C = new THREE.Group(); C.name = 'arka_cuku_' + no;
    C.position.set(AR_J2[0] - AR_J1[0], AR_J2[1] - AR_J1[1], 0); D.add(C);
    const T = new THREE.Group(); T.name = 'arka_toynak_' + no;
    T.position.set(AR_J3[0] - AR_J2[0], AR_J3[1] - AR_J2[1], 0); C.add(T);
    bacakGrup['arka' + no] = B; dizGrup['arka' + no] = D;
    cukuGrup['arka' + no] = C; toynakGrup['arka' + no] = T;
}

// ============================================================================
// 4. AT GÖVDESİ — X boyunca kesitten loft
// ============================================================================
// On altı istasyon. Cidago (x=+0.46) 1.520; sağrı tepesi 1.500; karın altı
// 0.745; göğüs derinliği (dirsek hizası) 0.765 = cidago/2 kuralı.
// Sırt ile karın AYRI yarı-yükseklik alıyor (halkaX'in hyU/hyD'si); tek
// yarıçapla yapılsaydı at fıçı gibi çıkardı.
const GOVDE_IST = [
    { x: -0.780, cy: 1.230, hyU: 0.130, hyD: 0.130, hz: 0.062, us: 1.15 },
    { x: -0.745, cy: 1.190, hyU: 0.235, hyD: 0.225, hz: 0.128, us: 1.08 },
    { x: -0.665, cy: 1.148, hyU: 0.322, hyD: 0.288, hz: 0.192, us: 1.06 },
    { x: -0.560, cy: 1.120, hyU: 0.380, hyD: 0.290, hz: 0.224, us: 1.05 },
    { x: -0.440, cy: 1.100, hyU: 0.390, hyD: 0.292, hz: 0.234, us: 1.05 },
    { x: -0.300, cy: 1.086, hyU: 0.372, hyD: 0.320, hz: 0.240, us: 1.04 },
    { x: -0.140, cy: 1.076, hyU: 0.356, hyD: 0.331, hz: 0.242, us: 1.03 },
    { x:  0.020, cy: 1.082, hyU: 0.350, hyD: 0.327, hz: 0.238, us: 1.02 },
    { x:  0.180, cy: 1.102, hyU: 0.352, hyD: 0.332, hz: 0.230, us: 1.00 },
    { x:  0.340, cy: 1.132, hyU: 0.358, hyD: 0.367, hz: 0.216, us: 0.98 },
    { x:  0.460, cy: 1.162, hyU: 0.358, hyD: 0.397, hz: 0.198, us: 0.96 },
    { x:  0.580, cy: 1.184, hyU: 0.316, hyD: 0.414, hz: 0.174, us: 0.95 },
    { x:  0.700, cy: 1.214, hyU: 0.246, hyD: 0.434, hz: 0.132, us: 0.98 },
    { x:  0.780, cy: 1.246, hyU: 0.146, hyD: 0.424, hz: 0.074, us: 1.10 },
    { x:  0.812, cy: 1.258, hyU: 0.068, hyD: 0.382, hz: 0.032, us: 1.20 }
];
loftX('at_govde_kabuk', 20, GOVDE_IST, C_KIL, { ebeveyn: govde, rough: 0.90, metal: 0.06 });

// ---- BOYUN ------------------------------------------------------------------
// Boyun dibi (x=0.60, y=1.44) → ense (x=1.06, y=1.80). Yay yukarı-ileri.
// Kesit üstte dar aşağıda geniş (us > 1 ile yassı üçgene yaklaşıyor).
const BOYUN = [
    { p: [0.560, 1.330], hU: 0.230, hD: 0.235, w: 0.150, us: 1.05 },
    { p: [0.660, 1.430], hU: 0.190, hD: 0.215, w: 0.130, us: 1.05 },
    { p: [0.780, 1.545], hU: 0.160, hD: 0.190, w: 0.110, us: 1.05 },
    { p: [0.900, 1.650], hU: 0.132, hD: 0.166, w: 0.093, us: 1.05 },
    { p: [1.010, 1.730], hU: 0.108, hD: 0.140, w: 0.080, us: 1.05 },
    { p: [1.098, 1.784], hU: 0.090, hD: 0.112, w: 0.070, us: 1.05 }
];
omurga('at_boyun', 16, BOYUN, C_KIL, { ebeveyn: govde, rough: 0.90, metal: 0.06, acikBas: true });

// ---- KAFA -------------------------------------------------------------------
// Ense (1.10, 1.80) → burun ucu (1.492, 1.505). Kafa boyu 0.608 m
// (= cidago/2.5, Fransız ekolü ölçü birimi). Ense yüksekliği 1.80 ≈ 3 kafa.
const KAFA = [
    { p: [1.098, 1.790], hU: 0.086, hD: 0.104, w: 0.068, us: 1.05 },
    { p: [1.168, 1.752], hU: 0.088, hD: 0.118, w: 0.076, us: 1.05 },
    { p: [1.250, 1.690], hU: 0.076, hD: 0.106, w: 0.070, us: 1.05 },
    { p: [1.340, 1.618], hU: 0.062, hD: 0.086, w: 0.058, us: 1.05 },
    { p: [1.430, 1.548], hU: 0.052, hD: 0.070, w: 0.050, us: 1.05 },
    { p: [1.480, 1.512], hU: 0.048, hD: 0.058, w: 0.046, us: 1.10 },
    { p: [1.500, 1.496], hU: 0.036, hD: 0.040, w: 0.034, us: 1.20 }
];
omurga('at_kafa', 14, KAFA, C_KIL, { ebeveyn: govde, rough: 0.88, metal: 0.06 });
for (let i = 0; i < 2; i++) {
    const s = i ? -1 : 1;
    uzuv('at_kulak_' + (i + 1), [1.096, 1.826, s * 0.044], [1.076, 1.906, s * 0.058],
         [[0, 0.026, 0.55], [0.6, 0.020, 0.5], [1, 0.006, 0.5]], 8, C_KIL_K,
         { ebeveyn: govde, rough: 0.88, metal: 0.05 });
    kure('at_burun_' + (i + 1), 0.020, [1.494, 1.492, s * 0.024], C_SIYAH,
         { ebeveyn: govde, olcek: [1.0, 0.8, 0.8], rough: 0.80, metal: 0.05 });
    kure('at_goz_' + (i + 1), 0.019, [1.184, 1.744, s * 0.070], C_SIYAH,
         { ebeveyn: govde, olcek: [1.0, 1.0, 0.7], rough: 0.30, metal: 0.10 });
}

// ---- YELE ve KUYRUK ---------------------------------------------------------
// Yele boyun sırtına oturan ayrı bir süpürme; koyu uç rengi.
const YELE = [];
for (let i = 0; i < BOYUN.length; i++) {
    const b = BOYUN[i], t = i / (BOYUN.length - 1);
    // boyun üst çizgisinden 2 cm dışarı
    const a = BOYUN[Math.max(0, i - 1)].p, c = BOYUN[Math.min(BOYUN.length - 1, i + 1)].p;
    let tx = c[0] - a[0], ty = c[1] - a[1];
    const tl = Math.sqrt(tx * tx + ty * ty) || 1; tx /= tl; ty /= tl;
    const e1x = -ty, e1y = tx;
    const d = b.hU + 0.012;
    YELE.push({ p: [b.p[0] + e1x * d, b.p[1] + e1y * d],
                hU: 0.052 - 0.026 * t, hD: 0.044 - 0.020 * t, w: 0.030 - 0.012 * t, us: 0.75 });
}
omurga('at_yele', 10, YELE, C_KIL_K, { ebeveyn: govde, rough: 0.92, metal: 0.04 });
omurga('at_kuyruk', 12, [
    { p: [-0.762, 1.288], h: 0.060, w: 0.056, us: 0.95 },
    { p: [-0.828, 1.212], h: 0.072, w: 0.064, us: 0.95 },
    { p: [-0.884, 1.078], h: 0.078, w: 0.068, us: 0.95 },
    { p: [-0.918, 0.910], h: 0.072, w: 0.062, us: 0.95 },
    { p: [-0.934, 0.740], h: 0.056, w: 0.048, us: 0.95 },
    { p: [-0.938, 0.612], h: 0.030, w: 0.026, us: 1.00 }
], C_KIL_K, { ebeveyn: govde, rough: 0.92, metal: 0.04, acikBas: true });

// ============================================================================
// 5. DÖRT BACAK — gruplara göre yerel çerçevede
// ============================================================================
// ⚠️ Her uzuv KENDİ grubunun orijininden bir sonraki eklemin YEREL konumuna
// çiziliyor; kurulumdaki grup rotasyonları sıfır olduğu için yerel eksenler
// model eksenleriyle aynı hizada.
for (let i = 0; i < 2; i++) {
    const no = i + 1;
    // --- ÖN BACAK: kürek → omuz → karpus → bilek → toynak ---
    const bo = bacakGrup['on' + no], oo = dizGrup['on' + no];
    const ko = cukuGrup['on' + no], to = toynakGrup['on' + no];
    // Kürek + omuz kası: gövdenin İÇİNDE kalan kütle. Kalın çizildi ki
    // bacak öne salındığında omuz bölgesinde açıklık kalmasın.
    uzuv('on_kurek_' + no, [0, 0.052, 0], [ON_J1[0] - ON_J0[0], ON_J1[1] - ON_J0[1], 0],
         [[0, 0.104, 0.62], [0.45, 0.118, 0.60], [1, 0.100, 0.60]], 12, C_KIL,
         { ebeveyn: bo, rough: 0.90, metal: 0.06 });
    // Kol + ön kol: dirsek (yol boyunca %52) belirgin şişkin.
    uzuv('on_kol_' + no, [0, 0, 0], [ON_J2[0] - ON_J1[0], ON_J2[1] - ON_J1[1], 0],
         [[0, 0.098, 0.66], [0.30, 0.092, 0.62], [0.52, 0.082, 0.58],
          [0.78, 0.056, 0.62], [1, 0.043, 0.70]], 12, C_KIL,
         { ebeveyn: oo, rough: 0.90, metal: 0.06 });
    kure('on_dirsek_' + no, 0.072, [-0.086, -0.300, 0], C_KIL,
         { ebeveyn: oo, olcek: [1.10, 1.25, 0.62], rough: 0.90, metal: 0.06 });
    // İncik (cannon) — düz, ince, koyu uç rengi
    uzuv('on_incik_' + no, [0, 0, 0], [ON_J3[0] - ON_J2[0], ON_J3[1] - ON_J2[1], 0],
         [[0, 0.041, 0.72], [0.45, 0.032, 0.68], [1, 0.030, 0.72]], 10, C_KIL_K,
         { ebeveyn: ko, rough: 0.88, metal: 0.05 });
    kure('on_karpus_' + no, 0.045, [0, 0, 0], C_KIL_K,
         { ebeveyn: ko, olcek: [1.15, 1.05, 0.76], rough: 0.88, metal: 0.05 });
    // Bilek + bilek üstü (pastern) + tırnak
    kure('on_bilekk_' + no, 0.038, [0, 0, 0], C_KIL_K,
         { ebeveyn: to, olcek: [1.05, 1.05, 0.82], rough: 0.88, metal: 0.05 });
    uzuv('on_pastern_' + no, [0, 0, 0], [0.062, -0.128, 0],
         [[0, 0.033, 0.80], [1, 0.030, 0.82]], 8, C_KIL_K,
         { ebeveyn: to, rough: 0.88, metal: 0.05 });
    loftX('on_tirnak_' + no, 12, [
        { x: TOPUK_X,          cy: TABAN_DY + 0.052, hyU: 0.036, hyD: 0.052, hz: 0.038, us: 0.72 },
        { x: TOPUK_X + 0.052,  cy: TABAN_DY + 0.058, hyU: 0.044, hyD: 0.058, hz: 0.048, us: 0.70 },
        { x: BURUN_X - 0.030,  cy: TABAN_DY + 0.052, hyU: 0.040, hyD: 0.052, hz: 0.044, us: 0.72 },
        { x: BURUN_X,          cy: TABAN_DY + 0.040, hyU: 0.024, hyD: 0.040, hz: 0.030, us: 0.80 }
    ], C_TOYNAK, { ebeveyn: to, rough: 0.62, metal: 0.14 });

    // --- ARKA BACAK: kalça → diz(stifle) → çükü(hock) → bilek → toynak ---
    const ba = bacakGrup['arka' + no], da = dizGrup['arka' + no];
    const ca = cukuGrup['arka' + no], ta = toynakGrup['arka' + no];
    // But (femur) — gövdenin içindeki kalın kas kütlesi
    uzuv('arka_but_' + no, [0.020, 0.086, 0], [AR_J1[0] - AR_J0[0], AR_J1[1] - AR_J0[1], 0],
         [[0, 0.132, 0.68], [0.5, 0.126, 0.62], [1, 0.084, 0.60]], 12, C_KIL,
         { ebeveyn: ba, rough: 0.90, metal: 0.06 });
    // Baldır (gaskin) — dizden çüküye, üstte kalın
    uzuv('arka_baldir_' + no, [0, 0, 0], [AR_J2[0] - AR_J1[0], AR_J2[1] - AR_J1[1], 0],
         [[0, 0.096, 0.66], [0.35, 0.086, 0.60], [0.72, 0.058, 0.60], [1, 0.041, 0.68]], 12, C_KIL,
         { ebeveyn: da, rough: 0.90, metal: 0.06 });
    kure('arka_dizk_' + no, 0.070, [0, 0, 0], C_KIL,
         { ebeveyn: da, olcek: [1.05, 1.15, 0.66], rough: 0.90, metal: 0.06 });
    // İncik (metatarsus)
    uzuv('arka_incik_' + no, [0, 0, 0], [AR_J3[0] - AR_J2[0], AR_J3[1] - AR_J2[1], 0],
         [[0, 0.043, 0.72], [0.45, 0.033, 0.68], [1, 0.031, 0.72]], 10, C_KIL_K,
         { ebeveyn: ca, rough: 0.88, metal: 0.05 });
    kure('arka_cukuk_' + no, 0.052, [0, 0.004, 0], C_KIL_K,
         { ebeveyn: ca, olcek: [1.22, 1.18, 0.74], rough: 0.88, metal: 0.05 });
    kure('arka_bilekk_' + no, 0.038, [0, 0, 0], C_KIL_K,
         { ebeveyn: ta, olcek: [1.05, 1.05, 0.82], rough: 0.88, metal: 0.05 });
    uzuv('arka_pastern_' + no, [0, 0, 0], [0.062, -0.128, 0],
         [[0, 0.033, 0.80], [1, 0.030, 0.82]], 8, C_KIL_K,
         { ebeveyn: ta, rough: 0.88, metal: 0.05 });
    loftX('arka_tirnak_' + no, 12, [
        { x: TOPUK_X,          cy: TABAN_DY + 0.052, hyU: 0.034, hyD: 0.052, hz: 0.036, us: 0.72 },
        { x: TOPUK_X + 0.052,  cy: TABAN_DY + 0.058, hyU: 0.042, hyD: 0.058, hz: 0.046, us: 0.70 },
        { x: BURUN_X - 0.030,  cy: TABAN_DY + 0.052, hyU: 0.038, hyD: 0.052, hz: 0.042, us: 0.72 },
        { x: BURUN_X,          cy: TABAN_DY + 0.040, hyU: 0.022, hyD: 0.040, hz: 0.028, us: 0.80 }
    ], C_TOYNAK, { ebeveyn: ta, rough: 0.62, metal: 0.14 });
}

// ============================================================================
// 6. AT ÖRTÜSÜ (CAPARISON / TRAPPER) — birincil renk
// ============================================================================
// ⚠️ İLK KURULUM z = ±0.256'da SABİT iki düşey levhaydı ve reddedildi: at
// tepeden bakışta pano taşıyan bir masa gibi okunuyordu (ölçüldü: örtü
// silueti gövde siluetinin dışına her x'te aynı miktarda taşıyordu).
// Doğrusu gövdenin KENDİ kesitini izleyen kapalı bir kabuk: her istasyonda
// üst kenar gövdenin sırt çizgisinin 10 mm ALTINDA (kumaşın tepe kavisi
// gövdenin içinde kalıyor, yani sırtta pano yok), yan genişlik gövdeninkinin
// 16 mm dışında ama en az 0.222 — çünkü arka but kütlesi (merkez 0.172,
// yarı 0.090) 0.262'ye kadar çıkıyor ve omuz bölgesinde gövde daralırken
// örtünün bacakların dışında kalması gerekiyor.
// Alt kenar y ≈ 0.72, dilimli (dagged) kesim — dönemin trapper'ları böyle.
// Ön karpus (0.460) ve arka çükü (0.505) örtünün ALTINDA kalıyor, yani
// hareket eden eklemler kumaşa girmiyor (ölçüldü).
const B_CY = egriYap(GOVDE_IST.map(function (s) { return [s.x, s.cy]; }));
const B_HU = egriYap(GOVDE_IST.map(function (s) { return [s.x, s.hyU]; }));
const B_HZ = egriYap(GOVDE_IST.map(function (s) { return [s.x, s.hz]; }));
const ORTU_X = [-0.762, -0.700, -0.610, -0.500, -0.370, -0.230, -0.090,
                 0.050, 0.190, 0.330, 0.450, 0.560, 0.660, 0.736];
function ortuIst(dis, altEk) {
    const ist = [];
    for (let i = 0; i < ORTU_X.length; i++) {
        const x = ORTU_X[i];
        const ust = B_CY(x) + B_HU(x) - 0.010;
        const alt = 0.716 + altEk + 0.030 * Math.abs(Math.sin(i * 1.42));
        const hz = Math.max(B_HZ(x) + 0.016, 0.222) + dis;
        ist.push({ x: x, cy: (ust + alt) / 2, hyU: (ust - alt) / 2,
                   hyD: (ust - alt) / 2, hz: hz, us: 0.62 });
    }
    return ist;
}
loftX('ortu', 18, ortuIst(0, 0), C_ORTU, { ebeveyn: govde, rough: 0.94, metal: 0.05 });
// Alt kenar şeridi (kontrast dikiş): örtünün 4 mm dışında, aynı dilimli kesim.
(function () {
    const ist = ortuIst(0.004, 0), s2 = [];
    for (let i = 0; i < ist.length; i++) {
        const o = ist[i], alt = o.cy - o.hyD;
        s2.push({ x: o.x, cy: alt + 0.028, hyU: 0.028, hyD: 0.028,
                  hz: o.hz, us: 0.62 });
    }
    // ⚠️ Şerit BİLEREK _TINT dışında ve NÖTR (pirinç) bırakıldı: birincil
    // rengin koyu tonu yazılsaydı kullanıcı maviye çevirdiğinde kenar KOYU
    // KIRMIZI kalırdı. Yaldızlı kenar her livre rengiyle çalışıyor ve
    // dilimli kesim çizgisini görünür tutuyor.
    loftX('ortu_serit', 18, s2, C_ALTIN, { ebeveyn: govde, rough: 0.44, metal: 0.40 });
})();
// Boyun örtüsü (crinet kumaşı) — yelenin altında, boyun kökünde
for (let i = 0; i < 2; i++) {
    const s = i ? -1 : 1;
    omurga('ortu_boyun_' + (i + 1), 8, [
        { p: [0.600, 1.372], hU: 0.140, hD: 0.150, w: 0.010, us: 0.30, oz: s * 0.150 },
        { p: [0.700, 1.474], hU: 0.120, hD: 0.132, w: 0.010, us: 0.30, oz: s * 0.132 },
        { p: [0.820, 1.586], hU: 0.100, hD: 0.112, w: 0.010, us: 0.30, oz: s * 0.114 }
    ], C_ORTU, { ebeveyn: govde, rough: 0.94, metal: 0.05 });
}

// ============================================================================
// 7. ZIRH ve KOŞUM — chanfron, gemlik, eyer, üzengi
// ============================================================================
// Chanfron (at kafası plakası): kafanın ÜST yüzeyine oturuyor.
omurga('chanfron', 12, [
    { p: [1.128, 1.792], hU: 0.098, hD: 0.020, w: 0.078, us: 1.10 },
    { p: [1.212, 1.728], hU: 0.098, hD: 0.020, w: 0.082, us: 1.10 },
    { p: [1.312, 1.648], hU: 0.084, hD: 0.020, w: 0.072, us: 1.10 },
    { p: [1.410, 1.570], hU: 0.070, hD: 0.018, w: 0.058, us: 1.10 },
    { p: [1.470, 1.526], hU: 0.062, hD: 0.016, w: 0.050, us: 1.15 }
], C_ZIRH, { ebeveyn: govde, rough: 0.34, metal: 0.44, acikBas: true, acikUc: true });
silindir('chanfron_boynuz', 0.014, 0.004, 0.128, [1.150, 1.882, 0], C_ZIRH,
         { ebeveyn: govde, seg: 8, rot: [0, 0, -0.20], metal: 0.46, rough: 0.32 });
// Gem ve dizgin: ağızlıktan biniciye. Dizgin yularla birlikte SOL ele gidiyor.
for (let i = 0; i < 2; i++) {
    const s = i ? -1 : 1;
    uzuv('gem_yanak_' + (i + 1), [1.400, 1.588, s * 0.062], [1.452, 1.492, s * 0.052],
         [[0, 0.009, 0.6], [1, 0.009, 0.6]], 6, C_DERI_K,
         { ebeveyn: govde, rough: 0.72, metal: 0.10 });
    uzuv('dizgin_' + (i + 1), [1.436, 1.520, s * 0.058], [0.230, 1.400, s * 0.108],
         [[0, 0.008, 0.5], [0.5, 0.008, 0.5], [1, 0.008, 0.5]], 6, C_DERI,
         { ebeveyn: govde, rough: 0.74, metal: 0.10 });
    uzuv('gogus_kayis_' + (i + 1), [0.760, 1.234, s * 0.070], [0.560, 1.336, s * 0.190],
         [[0, 0.017, 0.45], [1, 0.017, 0.45]], 6, C_DERI,
         { ebeveyn: govde, rough: 0.74, metal: 0.10 });
}
silindir('gem_bilezik', 0.024, 0.024, 0.126, [1.442, 1.508, 0], C_ZIRH_K,
         { ebeveyn: govde, seg: 10, rot: [Math.PI / 2, 0, 0], metal: 0.44, rough: 0.34 });

// ---- EYER (savaş eyeri: yüksek ön kaş ve arka kaş) -------------------------
// ⚠️ Eyer örtünün ÜSTÜNE oturuyor: örtünün sırt kavisi gövdenin içinde
// kaldığı için eyerin alt yarısı kumaşın içine gömülüyor, üst yarısı
// görünüyor — gerçek eyer de yastığın içine oturur.
loftX('eyer', 16, [
    { x:  0.230, cy: 1.486, hyU: 0.028, hyD: 0.072, hz: 0.134, us: 0.62 },
    { x:  0.150, cy: 1.492, hyU: 0.034, hyD: 0.074, hz: 0.170, us: 0.62 },
    { x:  0.020, cy: 1.484, hyU: 0.026, hyD: 0.074, hz: 0.186, us: 0.62 },
    { x: -0.130, cy: 1.488, hyU: 0.028, hyD: 0.074, hz: 0.184, us: 0.62 },
    { x: -0.250, cy: 1.506, hyU: 0.034, hyD: 0.076, hz: 0.170, us: 0.62 },
    { x: -0.330, cy: 1.518, hyU: 0.032, hyD: 0.072, hz: 0.144, us: 0.62 }
], C_DERI, { ebeveyn: govde, rough: 0.66, metal: 0.12 });
// Ön kaş (pommel) — mızrak darbesinde biniciyi tutan kemer
loftX('eyer_on_kas', 14, [
    { x: 0.196, cy: 1.520, hyU: 0.062, hyD: 0.062, hz: 0.104, us: 0.75 },
    { x: 0.244, cy: 1.528, hyU: 0.070, hyD: 0.070, hz: 0.116, us: 0.72 },
    { x: 0.292, cy: 1.516, hyU: 0.058, hyD: 0.058, hz: 0.100, us: 0.78 }
], C_DERI_K, { ebeveyn: govde, rough: 0.64, metal: 0.14 });
// Arka kaş (cantle) — kalçayı saran yüksek plaka
loftX('eyer_arka_kas', 14, [
    { x: -0.318, cy: 1.560, hyU: 0.082, hyD: 0.082, hz: 0.146, us: 0.68 },
    { x: -0.368, cy: 1.566, hyU: 0.090, hyD: 0.090, hz: 0.158, us: 0.66 },
    { x: -0.412, cy: 1.548, hyU: 0.072, hyD: 0.072, hz: 0.136, us: 0.72 }
], C_DERI_K, { ebeveyn: govde, rough: 0.64, metal: 0.14 });
for (let i = 0; i < 2; i++) {
    const s = i ? -1 : 1;
    // Üzengi kayışı + üzengi (binicinin ayağı burada duruyor)
    uzuv('uzengi_kayis_' + (i + 1), [0.030, 1.452, s * 0.176], [0.176, 1.012, s * 0.286],
         [[0, 0.016, 0.32], [1, 0.014, 0.32]], 6, C_DERI,
         { ebeveyn: govde, rough: 0.74, metal: 0.10 });
    silindir('uzengi_' + (i + 1), 0.056, 0.056, 0.020, [0.180, 0.968, s * 0.290], C_ZIRH_K,
             { ebeveyn: govde, seg: 12, acik: true, rot: [Math.PI / 2, 0, 0],
               metal: 0.48, rough: 0.36 });
    kutu('uzengi_taban_' + (i + 1), 0.086, 0.011, 0.052, [0.180, 0.916, s * 0.290], C_ZIRH_K,
         { ebeveyn: govde, metal: 0.48, rough: 0.36 });
    // Kolan (eyeri bağlayan kayış)
    uzuv('kolan_' + (i + 1), [0.030, 1.430, s * 0.184], [0.055, 0.790, s * 0.150],
         [[0, 0.022, 0.30], [1, 0.020, 0.30]], 6, C_DERI_K,
         { ebeveyn: govde, rough: 0.76, metal: 0.10 });
}

// ============================================================================
// 8. BİNİCİ — tam plaka zırhlı şövalye, eyerde
// ============================================================================
// Oturak y = 1.478. Ayakta 1.75 m'lik bir adamın oturak–baş üstü mesafesi
// 0.88 m; miğferle 2.36 m'de tepe. Bacaklar dönem eyerinin gerektirdiği gibi
// UZUN: diz hafif bükülü, ayak öne, topuk aşağı.
const OTURAK = 1.478;
const BN_HIP = [0.010, OTURAK], BN_OMUZ_Y = 2.006;

// Gövde: kalça → omuz. Plaka göğüslük (cuirass) prizmatiğe yakın (us < 1),
// bel dar, göğüs geniş ve öne bombeli.
function halkaY(s, a) {
    const ca = Math.cos(a), sa = Math.sin(a);
    const us = s.us == null ? 1.0 : s.us;
    const sx = ca < 0 ? -1 : 1, sz = sa < 0 ? -1 : 1;
    let x = s.d * sx * Math.pow(Math.abs(ca), us);
    const z = s.w * sz * Math.pow(Math.abs(sa), us);
    if (s.bomb) x += s.bomb * Math.max(0, ca) * Math.max(0, ca);
    if (s.yassi && x < 0) x *= s.yassi;
    return [x + (s.ox || 0), z + (s.oz || 0)];
}
function loftY(ad, n, ist, renk, opts) {
    opts = opts || {};
    const P = [], IDX = [], M = ist.length;
    for (let i = 0; i < M; i++) {
        const s = ist[i];
        for (let j = 0; j < n; j++) {
            const p = halkaY(s, 2 * Math.PI * j / n);
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
    for (let uc = 0; uc < 2; uc++) {
        if (uc === 0 && opts.acikAlt) continue;
        if (uc === 1 && opts.acikUst) continue;
        const s = ist[uc ? M - 1 : 0];
        let mx = 0, mz = 0;
        const h = [];
        for (let j = 0; j < n; j++) {
            const p = halkaY(s, 2 * Math.PI * j / n); h.push(p); mx += p[0]; mz += p[1];
        }
        const merkez = P.length / 3;
        P.push(mx / n, s.y, mz / n);
        const bas = merkez + 1;
        for (let j = 0; j < n; j++) P.push(h[j][0], s.y, h[j][1]);
        for (let j = 0; j < n; j++) {
            const a = bas + j, b = bas + (j + 1) % n;
            if (uc) IDX.push(merkez, b, a); else IDX.push(merkez, a, b);
        }
    }
    return geoYap(P, IDX, renk, ad, opts);
}

// Jüpon (surcoat) — göğüslüğün üstündeki armalı kumaş: BİRİNCİL renk.
loftY('binici_jupon', 18, [
    { y: 1.492, d: 0.142, w: 0.196, us: 0.72, ox: 0.010 },
    { y: 1.560, d: 0.140, w: 0.184, us: 0.72, ox: 0.012 },
    { y: 1.660, d: 0.136, w: 0.172, us: 0.74, ox: 0.014 },
    { y: 1.770, d: 0.140, w: 0.176, us: 0.74, ox: 0.016, bomb: 0.014 },
    { y: 1.880, d: 0.146, w: 0.192, us: 0.76, ox: 0.014, bomb: 0.016 },
    { y: 1.960, d: 0.140, w: 0.196, us: 0.78, ox: 0.010 }
], C_ORTU, { ebeveyn: govde, rough: 0.92, metal: 0.05 });
// Göğüslük (cuirass) — jüponun üstünden çıkan plaka yaka ve omuz bölgesi
loftY('binici_gogus', 18, [
    { y: 1.930, d: 0.140, w: 0.194, us: 0.80, ox: 0.012, bomb: 0.014 },
    { y: 1.984, d: 0.132, w: 0.188, us: 0.82, ox: 0.012, bomb: 0.010 },
    { y: 2.030, d: 0.112, w: 0.152, us: 0.86, ox: 0.010 }
], C_ZIRH, { ebeveyn: govde, rough: 0.30, metal: 0.42 });
// Fauld / etek plakaları — kalçayı saran, eyere oturan bantlar
for (let i = 0; i < 3; i++) {
    const y = 1.418 + i * 0.032;
    loftY('fauld_' + (i + 1), 16, [
        { y: y,         d: 0.150 + i * 0.004, w: 0.204 + i * 0.004, us: 0.70, ox: 0.008 },
        { y: y + 0.026, d: 0.148 + i * 0.004, w: 0.202 + i * 0.004, us: 0.70, ox: 0.008 }
    ], C_ZIRH, { ebeveyn: govde, rough: 0.32, metal: 0.42, acikAlt: true, acikUst: true });
}
// Gorget (boyunluk) + miğfer
loftY('gorget', 16, [
    { y: 2.024, d: 0.096, w: 0.126, us: 0.92, ox: 0.010 },
    { y: 2.056, d: 0.084, w: 0.106, us: 0.94, ox: 0.010 },
    { y: 2.078, d: 0.076, w: 0.094, us: 0.96, ox: 0.010 }
], C_ZIRH_K, { ebeveyn: govde, rough: 0.34, metal: 0.44 });
// Miğfer: armet/büyük basinet — arkaya doğru sivri, önde vizör
loftY('migfer', 18, [
    { y: 2.070, d: 0.096, w: 0.096, us: 1.00, ox: 0.006 },
    { y: 2.116, d: 0.112, w: 0.108, us: 1.00, ox: 0.010 },
    { y: 2.170, d: 0.118, w: 0.112, us: 1.02, ox: 0.014 },
    { y: 2.240, d: 0.112, w: 0.106, us: 1.04, ox: 0.014 },
    { y: 2.310, d: 0.086, w: 0.082, us: 1.06, ox: 0.012 },
    { y: 2.356, d: 0.036, w: 0.034, us: 1.10, ox: 0.008 }
], C_ZIRH, { ebeveyn: govde, rough: 0.28, metal: 0.44 });
// Vizör: miğferin ÖN yarısına oturan çıkıntı (`yassi` ile arka yarı içeri
// çekildi; kapalı halka olduğu için aksi hâlde ensede de bir kabuk kalırdı).
loftY('migfer_vizor', 16, [
    { y: 2.128, d: 0.146, w: 0.104, us: 1.00, ox: 0.014, yassi: 0.34 },
    { y: 2.172, d: 0.152, w: 0.108, us: 1.00, ox: 0.016, yassi: 0.34 },
    { y: 2.214, d: 0.140, w: 0.100, us: 1.02, ox: 0.014, yassi: 0.34 }
], C_ZIRH_K, { ebeveyn: govde, rough: 0.30, metal: 0.46 });
kutu('migfer_yarik', 0.014, 0.012, 0.104, [0.166, 2.186, 0.004], C_SIYAH,
     { ebeveyn: govde, metal: 0.10, rough: 0.86 });

// ---- kollar --------------------------------------------------------------
// ⚠️ MIZRAK -z KOLTUK ALTINDA kuruldu; harita aynaladığı için ÜRÜNDE SAĞ
// koltuk altında görünür (dosya başındaki not). Sağ kol mızrağı sıkıştırıyor,
// sol kol dizgin ve kalkan tutuyor.
const OMZ_M = [0.014, 1.966, -0.180];   // mızrak kolu omzu (ham: -z)
const OMZ_K = [0.014, 1.966,  0.180];   // kalkan/dizgin kolu omzu
const DIR_M = [0.052, 1.760, -0.226];
const DIR_K = [0.108, 1.774,  0.216];
const EL_M  = [0.246, 1.706, -0.170];
const EL_K  = [0.244, 1.610,  0.150];
const KOLLAR = [[OMZ_M, DIR_M, EL_M, 'm'], [OMZ_K, DIR_K, EL_K, 'k']];
for (let i = 0; i < 2; i++) {
    const K = KOLLAR[i], no = i + 1;
    // Pauldron (omuz plakası) — gövde ile kolun birleştiği yeri ÖRTÜYOR.
    kure('pauldron_' + no, 0.086, [K[0][0] - 0.004, K[0][1] + 0.010, K[0][2] * 1.03],
         C_ZIRH, { ebeveyn: govde, olcek: [0.94, 0.74, 1.02], rough: 0.30, metal: 0.42 });
    kure('pauldron_ust_' + no, 0.062, [K[0][0] - 0.010, K[0][1] + 0.052, K[0][2] * 0.98],
         C_ZIRH_K, { ebeveyn: govde, olcek: [1.16, 0.52, 1.06], rough: 0.32, metal: 0.44 });
    uzuv('ust_kol_' + no, K[0], K[1],
         [[0, 0.062, 0.94], [0.35, 0.056, 0.94], [1, 0.048, 0.94]], 12, C_ZIRH,
         { ebeveyn: govde, rough: 0.30, metal: 0.42 });
    kure('couter_' + no, 0.058, K[1], C_ZIRH,
         { ebeveyn: govde, olcek: [1.0, 1.0, 1.12], rough: 0.30, metal: 0.44 });
    uzuv('alt_kol_' + no, K[1], K[2],
         [[0, 0.050, 0.94], [0.4, 0.045, 0.94], [1, 0.038, 0.94]], 12, C_ZIRH,
         { ebeveyn: govde, rough: 0.30, metal: 0.42 });
    kure('eldiven_' + no, 0.050, [K[2][0] + 0.014, K[2][1] - 0.004, K[2][2]],
         C_ZIRH_K, { ebeveyn: govde, olcek: [1.28, 0.90, 0.86], rough: 0.32, metal: 0.44 });
}

// ---- bacaklar (eyerde, SALLANMAZ) ----------------------------------------
for (let i = 0; i < 2; i++) {
    const s = i ? -1 : 1, no = i + 1;
    const kalca = [0.052, 1.446, s * 0.156];
    const diz   = [0.246, 1.140, s * 0.268];
    const bilek = [0.186, 0.962, s * 0.288];
    uzuv('cuisse_' + no, kalca, diz,
         [[0, 0.096, 0.86], [0.5, 0.084, 0.86], [1, 0.062, 0.90]], 12, C_ZIRH,
         { ebeveyn: govde, rough: 0.30, metal: 0.42 });
    kure('dizlik_' + no, 0.066, diz, C_ZIRH,
         { ebeveyn: govde, olcek: [1.06, 1.0, 1.06], rough: 0.30, metal: 0.44 });
    uzuv('greave_' + no, diz, bilek,
         [[0, 0.062, 0.86], [0.45, 0.056, 0.86], [1, 0.040, 0.86]], 12, C_ZIRH,
         { ebeveyn: govde, rough: 0.30, metal: 0.42 });
    // Sabaton (sivri uçlu demir ayakkabı) + mahmuz
    loftX('sabaton_' + no, 12, [
        { x: 0.128, cy: 0.930, hyU: 0.028, hyD: 0.024, hz: 0.044, us: 0.72, oz: s * 0.288 },
        { x: 0.196, cy: 0.932, hyU: 0.030, hyD: 0.026, hz: 0.048, us: 0.70, oz: s * 0.288 },
        { x: 0.268, cy: 0.930, hyU: 0.024, hyD: 0.022, hz: 0.036, us: 0.74, oz: s * 0.288 },
        { x: 0.322, cy: 0.928, hyU: 0.012, hyD: 0.012, hz: 0.016, us: 0.90, oz: s * 0.288 }
    ], C_ZIRH_K, { ebeveyn: govde, rough: 0.32, metal: 0.44 });
    silindir('mahmuz_' + no, 0.007, 0.005, 0.062, [0.096, 0.938, s * 0.288], C_ALTIN,
             { ebeveyn: govde, seg: 6, rot: [0, 0, Math.PI / 2], metal: 0.52, rough: 0.34 });
    kure('mahmuz_yildiz_' + no, 0.017, [0.064, 0.938, s * 0.288], C_ALTIN,
         { ebeveyn: govde, olcek: [0.34, 1.0, 1.0], rough: 0.34, metal: 0.52 });
}

// ============================================================================
// 9. MIZRAK — koltuk altında yatay (couched lance), 3.444 m
// ============================================================================
// Dip topuz binicinin arkasında, uç atın boynunun ÜSTÜNDEN karşı tarafa
// bakıyor. ÖLÇÜLDÜ (M_DIP → M_UC): boy 3.444 m, gövde eksenine göre 9.3° yaw,
// 4.0° aşağı eğim. Bu, dönemin minyatürlerindeki "couched" duruşun ta kendisi.
const M_DIP = [-0.870, 1.836, -0.238];
const M_UC  = [ 2.520, 1.598,  0.318];
function mNokta(t) {
    return [M_DIP[0] + (M_UC[0] - M_DIP[0]) * t,
            M_DIP[1] + (M_UC[1] - M_DIP[1]) * t,
            M_DIP[2] + (M_UC[2] - M_DIP[2]) * t];
}
uzuv('mizrak_sap', M_DIP, mNokta(0.955),
     [[0, 0.030], [0.10, 0.038], [0.24, 0.040], [0.30, 0.028],
      [0.62, 0.023], [1, 0.014]], 10, C_MIZRAK,
     { ebeveyn: govde, rough: 0.72, metal: 0.10 });
uzuv('mizrak_ucu', mNokta(0.945), M_UC,
     [[0, 0.019], [0.35, 0.016], [1, 0.002]], 8, C_ZIRH_K,
     { ebeveyn: govde, rough: 0.28, metal: 0.48 });
uzuv('mizrak_topuz', M_DIP, mNokta(0.028),
     [[0, 0.018], [0.5, 0.034], [1, 0.030]], 8, C_ZIRH_K,
     { ebeveyn: govde, rough: 0.32, metal: 0.46 });
// Vamplate: eli koruyan koni. Kavrama noktasının HEMEN önünde.
(function () {
    const a = mNokta(0.318), b = mNokta(0.372);
    uzuv('mizrak_vamplate', a, b, [[0, 0.030], [1, 0.104]], 14, C_ZIRH,
         { ebeveyn: govde, rough: 0.30, metal: 0.44 });
})();
// Lance rest (göğüslükteki mızrak yatağı) — mızrağın ağırlığını taşıyan çıkıntı
const M_YATAK = [0.128, 1.842, -0.156];   // SALDIRI: mızrağın dönme merkezi
kutu('mizrak_yatak', 0.062, 0.030, 0.046, M_YATAK, C_ZIRH_K,
     { ebeveyn: govde, rot: [0, 0, 0.08], metal: 0.46, rough: 0.32 });
// Flama (pennon) — birincil renk, mızrağın ucuna yakın
(function () {
    const t0 = 0.74, t1 = 0.86;
    const a = mNokta(t0), b = mNokta(t1);
    const P = [], IDX = [];
    const n = 5;
    for (let i = 0; i < n; i++) {
        const u = i / (n - 1);
        const px = a[0] + (b[0] - a[0]) * u, py = a[1] + (b[1] - a[1]) * u,
              pz = a[2] + (b[2] - a[2]) * u;
        const yuk = 0.086 * (1 - 0.72 * u);
        const dal = 0.010 * Math.sin(u * 5.2);
        for (let k = 0; k < 2; k++) {
            P.push(px + dal, py - (k ? yuk : -0.004), pz + (k ? 0.012 : -0.012) + dal);
        }
    }
    for (let i = 0; i < n - 1; i++) {
        const a0 = i * 2, b0 = i * 2 + 1, c0 = (i + 1) * 2, d0 = (i + 1) * 2 + 1;
        IDX.push(a0, c0, d0, a0, d0, b0);
        IDX.push(a0, d0, c0, a0, b0, d0);
    }
    geoYap(P, IDX, C_ORTU, 'mizrak_flama',
           { ebeveyn: govde, rough: 0.94, metal: 0.04 });
})();

// ============================================================================
// 10. KALKAN ve KILIÇ
// ============================================================================
// Heater (ütü) kalkanı — sol kolda, gövdenin +z yanında.
// ⚠️ Kalkan LOFT DEĞİL EXTRUDE: heater (ütü) kalkanı üstü düz, altı sivri
// bir levhadır — kapalı süper-elips halkası bunu VEREMEZ (ilk kurulumda
// yuvarlak bir tepsi çıktı, ölçüldü: alt uç yarıçapı 0.23, sivrilik yok).
// Extrude burada DOĞRU araç, çünkü parça gerçekten prizmatik ve yassı.
// `bevelEnabled: false` — pah konturu DIŞARI iter (devir §5.2).
(function () {
    const sh = new THREE.Shape();
    sh.moveTo(-0.148, 0.190);
    sh.lineTo( 0.148, 0.190);
    sh.bezierCurveTo(0.152, 0.060, 0.128, -0.076, 0.000, -0.250);
    sh.bezierCurveTo(-0.128, -0.076, -0.152, 0.060, -0.148, 0.190);
    const geo = new THREE.ExtrudeGeometry(sh, {
        depth: 0.024, bevelEnabled: false, curveSegments: 7 });
    geo.rotateY(-0.32);
    geo.translate(0.268, 1.716, 0.230);
    const m = mesh(geo, C_ORTU, { metal: 0.06, rough: 0.90, name: 'kalkan' });
    govde.add(m);
    // Çelik kenar bandı: aynı şeklin biraz büyüğü, kalkanın ARKASINDA.
    const sh2 = new THREE.Shape();
    sh2.moveTo(-0.160, 0.202);
    sh2.lineTo( 0.160, 0.202);
    sh2.bezierCurveTo(0.164, 0.062, 0.138, -0.080, 0.000, -0.268);
    sh2.bezierCurveTo(-0.138, -0.080, -0.164, 0.062, -0.160, 0.202);
    const g2 = new THREE.ExtrudeGeometry(sh2, {
        depth: 0.020, bevelEnabled: false, curveSegments: 7 });
    g2.rotateY(-0.32);
    g2.translate(0.262, 1.716, 0.216);
    govde.add(mesh(g2, C_ZIRH_K, { metal: 0.42, rough: 0.34, name: 'kalkan_kenar' }));
})();
// Kılıç — sol kalçada kınında
uzuv('kilic_kin', [-0.104, 1.398, 0.222], [-0.512, 1.048, 0.286],
     [[0, 0.030, 0.42], [0.85, 0.024, 0.40], [1, 0.010, 0.40]], 8, C_DERI_K,
     { ebeveyn: govde, rough: 0.70, metal: 0.14 });
kutu('kilic_kabza', 0.030, 0.100, 0.030, [-0.070, 1.462, 0.214], C_ZIRH_K,
     { ebeveyn: govde, rot: [0, 0, 0.72], metal: 0.44, rough: 0.34 });
kutu('kilic_balcak', 0.024, 0.020, 0.148, [-0.086, 1.432, 0.218], C_ALTIN,
     { ebeveyn: govde, rot: [0, 0, 0.72], metal: 0.50, rough: 0.32 });
// Kemer — jüponun üstünde
loftY('binici_kemer', 16, [
    { y: 1.498, d: 0.148, w: 0.202, us: 0.72, ox: 0.010 },
    { y: 1.530, d: 0.152, w: 0.206, us: 0.72, ox: 0.010 },
    { y: 1.556, d: 0.148, w: 0.202, us: 0.72, ox: 0.010 }
], C_DERI, { ebeveyn: govde, rough: 0.68, metal: 0.14 });
kutu('kemer_toka', 0.024, 0.038, 0.052, [0.166, 1.528, 0.006], C_ALTIN,
     { ebeveyn: govde, metal: 0.50, rough: 0.32 });



// ==== SALDIRI SV-MODEL BASLANGIC ====

// ============================================================================
// 11. SALDIRI SÖZLEŞMESİ — `registerBehavior('sovalye')` bunu okur
// ============================================================================
// ⚠️ GEOMETRİ EKLEMİYOR: yalnız yukarıda ZATEN yazılmış noktaları ve parça
// adlarını dışa veriyor. Kutu, mesh sayısı, üçgen sayısı DEĞİŞMİYOR.
//
// Couched mızrağın hücumu tek bir mafsalda dönüyor: MIZRAK YATAĞI. Gerçekte
// de şaftın ağırlığını ve çarpmanın şokunu göğüslükteki o çıkıntı taşır;
// mızrak koltuk altında ona YASLI durur. Davranış grubu bu yüzden yatağın
// noktasında kuruluyor ve mızrakla birlikte SAĞ KOL da o gruba giriyor —
// eldiven şaftın üstünde hiç kaymasın diye.
//
// ⚠️ `pauldron_1` / `pauldron_ust_1` DIŞARIDA: onlar gövdenin omuz plakası,
// kolun kökünü örtmeye devam ediyorlar (mızrak dönünce kol kökü yatağa göre
// en fazla 35 mm kayıyor, plaka yarıçapı 86 mm).
// ⚠️ `mizrak_yatak` DIŞARIDA: o göğüslüğün parçası, mızrakla dönmez.
modelGroup.userData.sovalyeMizrak = {
    yatak: M_YATAK,             // dönme merkezi (mızrak yatağı / koltuk altı)
    dip:   M_DIP,               // dip topuz
    uc:    M_UC,                // mızrağın ucu
    omuz:  OMZ_M,               // mızrak kolunun omzu (kayma ölçümü için)
    el:    EL_M,
    parca: ['ust_kol_1', 'couter_1', 'alt_kol_1', 'eldiven_1',
            'mizrak_sap', 'mizrak_ucu', 'mizrak_topuz', 'mizrak_vamplate',
            'mizrak_flama'],
    cidago: CIDAGO
};
// ==== SALDIRI SV-MODEL SON ====
