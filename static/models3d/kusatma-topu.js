// Kuşatma topu (bombard) — TEKERLEKLİ KUNDAK. Historical Warfare.
//
// ⚠️ BU TUR ÖLÇÜT DEĞİŞTİ. Önceki model tarihsel olarak doğruydu (Mons Meg,
// kazıklı ahşap ateş yatağı, tekerleksiz — "wheeled carriages could not
// withstand the recoil") ama haritada TOP OLARAK OKUNMUYORDU: tepeden bakışta
// 5.22 x 4.10 m'lik, gülle yığını + fıçı + harbi ile dolu bir kereste kümesi
// çıkıyordu. Bu turda ölçüt OKUNABİLİRLİK: kullanıcı haritadaki minik cisme
// bakıp "bu bir top" diyebilmeli. Kaynağa sadakat ikinci sırada.
//
// KUNDAK TİPİ ÖLÇÜLEREK SEÇİLDİ (kusatma_topu_okunabilirlik.py; iki aday aynı
// namluyla kuruldu, sayılar rapordadır):
//   A) SAHRA/KUŞATMA KUNDAĞI — iki büyük parmaklıklı tekerlek + kuyruk kızağı
//   B) GARNİZON ARABASI      — dört küçük masif tekerlek, alçak kompakt kundak
// Seçilen: A. ÖLÇÜLEN GEREKÇE (tepe siluetleri, haritadaki sizeKm kadrajı):
//   * TEKER PAYI (tekerlek gizlenince kaybolan siluet): A %10.0 · B %5.2.
//     16 piksele indirildiğinde A %15.8, B %0.0 — B'nin tekerlekleri harita
//     ölçeğinde HİÇ okunmuyor, A'nınki büyüyerek okunuyor.
//   * DOLULUK: A 0.448 · B 0.654 · koçbaşı 0.712 · eski top 0.609. Düşük
//     doluluk = parmaklık aralarından zemin görünüyor, siluet boşluklu.
//   * KOÇBAŞIYLA KARIŞMA (IoU, 32 px): eski top 0.601 · B 0.503 · A 0.401.
//     Eski modelin şikâyeti tam buydu: tepeden koçbaşıyla aynı dikdörtgen.
//   * LEKE SAYISI (bağlantılı bileşen): A 1/1/2/2 (48/32/24/16 px), eski
//     model 3/4/3/2 — gülle yığını ve fıçılar silueti parçalıyordu.
//
// KORUNAN KAYNAK ÖLÇÜLER (namlu birebir eskisi):
//   * MONS MEG (Edinburgh Castle, 1449): TAM BOY 406 cm · NAMLU 280 cm ·
//     KALİBRE 20 inç = 510 mm · DIŞ ÇAP 0.63–0.75 m · gülle 175 kg / ~490 mm.
//     L_TOP 4.06 · L_HAZNE 1.26 = 4.06-2.80 · R_ICI 0.255 · R_HAZNE 0.315
//     (0.63'ün yarısı) · R_NAMLU 0.375 (0.75'in yarısı).
//   * PUMHART VON STEYR balistik hesabı: ATIŞ AÇISI 10 DERECE. Namlunun
//     yükselişi bu; göz kararı değil.
//   * MUYLU (trunnion) YENİ ve kaynağa AYKIRI: Mons Meg'de muylu yok. Tekerlekli
//     kundakta namluyu tutan tek klasik mekanizma bu ve topun siluetini
//     "namlu + iki yanak + iki tekerlek" hâline getiren menteşe de bu.
//     Okunabilirlik ölçütü gereği eklendi, gerekçesi kaynak değil OKUMA.
//
// TÜRETİLEN KUNDAK ÖLÇÜLERİ (aritmetik, varsayım değil):
//   R_TEKER 0.72  → Ø 1.44 m. Yanak ALT kenarı aks üstüne oturuyor:
//        alt(AKS_X) = R_TEKER + AKS_YARI = 0.72 + 0.085 = 0.805; kuyruk ucu
//        (YAN_ARKA_X, 0.00) yere değiyor. İki noktadan eğim 0.26393 = 14.8
//        derece — kuyruk kızağı ile tekerlek arasındaki klasik rakı.
//   MUYLU_Y 1.30 = namlunun ALTI (1.30 - 0.375 = 0.925) yanak alt kenarının
//        aks hizasındaki değerinden (0.805) YÜKSEKTE kalsın diye seçildi.
//        1.20 ile HESAPLANDI ve elendi: yanağın alt kenarı 0.24098 eğimle,
//        namlunun altı 0.17633 ile yükseldiği için x=0.80'de namlu yanağın
//        0.016 m altına düşüyordu (namlu kundağın altından sarkardı).
//   YAN_ON_UST 1.48 → muylu ekseninin (1.30) yanağın üst kenarına 0.079 m
//        GÖMÜLMESİNİ veriyor (yatak çentiği okunuyor, muylu havada durmuyor).
//   GERI_ACI 6.0 derece = geri tepmede namlunun muylu etrafında kalkışı.
//        SEÇİM GÖRSEL GENLİK, sınır değil: kusatma_topu_zemin_tara.js'in açı
//        taraması 20 dereceye kadar hiçbir yerde temas bulmuyor (en dar yer
//        0.093 m). 6 derecenin ÖLÇÜLEN karşılığı: ağız 0.2254 m yükseliyor
//        (kutu yüksekliğinin %10.8'i) ve motorun gövdeye uyguladığı 0.2646
//        model metrelik geri tepmeyle (boyun %5.0'i) aynı fazda tepe yapıyor.
//
// ⚠️ DİNLENME POZU = ATEŞE HAZIR. Çevrim bu pozdan başlayıp bu poza dönüyor,
// t=0 ile t=1 BİREBİR aynı.
//
// ⚠️ `_TURRETS` YOK: kundak dönmüyor, motor GÖVDEYİ `rotationDeg`e döndürüyor.
// 'fire' modu yine ŞART ama taret için değil: çevrim `item.fireT`
// penceresinden okunuyor ve o pencere yalnız 'fire' _MODEL_ANIMS'te varken
// üretiliyor.
//
// ⚠️ `_WHEELS.radius` = R_TEKER (0.72) BİREBİR olmalı. Tekerlek DIŞ yarıçapı
// halka ile kuruluyor (`halkaY`), kiriş yığınıyla DEĞİL: koçbaşında kirişle
// kurulan tekerin gerçek yarıçapı 0.36 yerine 0.4303 çıkmıştı.
//
// PARÇALAR (Studio3D bu adları arar, DEĞİŞTİRME):
//   kundak_1/2 · kundak_bag · dingil · teker_1/2 (+_govde)  → BİRİNCİL RENK
//   namlu · bilezik · muylu                                 → İKİNCİL RENK
//   namlu_agiz · kundak_demir · teker_N_cember              → renk dışı
//   top_kok    → namlunun muylu etrafındaki geri tepme grubu
//   duman      → ağız dumanı
//   gulle_ucan → uçan gülle
//   ⚠️ `namlu` adı ZORUNLU: motor ağız alevini `getObjectByName('namlu')`
//   ile buluyor (studio-3d.js:1214).
//
// YÖN: atış yönü +x, üst +y, taban y=0. Ölçüler gerçek metre.

// ===========================================================================
// 0. RENKLER VE MALZEME
// ===========================================================================
const C_MESE     = '#7a5c3c';   // _TINT varsayılanı — kundak meşesi
const C_MESE_K   = '#5a442c';   // koyu kereste: dingil, kuyruk pabucu
const C_DEMIR    = '#565d66';   // _TINT.varsayilan2 — namlu
const C_DEMIR_A  = '#727a83';   // bilezik: namludan bir ton açık
const C_DEMIR_P  = '#7d858e';   // parlak demir: kapak kayışı, kuşak, şina
const C_AGIZ     = '#15181b';   // namlu ağzının içi
const C_TAS      = '#7a7770';   // gülle

const M_AHSAP = { metal: 0.12, rough: 0.82 };
const M_DEMIR = { metal: 0.38, rough: 0.46 };
const M_TAS   = { metal: 0.06, rough: 0.90 };
const M_AGIZ  = { metal: 0.20, rough: 0.95 };

// ===========================================================================
// 1. TEMEL ÖLÇÜLER
// ===========================================================================
const ACI      = 10.0 * Math.PI / 180;   // Pumhart balistik hesabının açısı
const CA = Math.cos(ACI), SA = Math.sin(ACI);
const L_TOP    = 4.06;    // Mons Meg tam boy
const L_HAZNE  = 1.26;    // 4.06 - 2.80 (vidalı ekin yeri)
const R_HAZNE  = 0.315;   // dış çap aralığının ALT ucu (0.63 m)
const R_NAMLU  = 0.375;   // dış çap aralığının ÜST ucu (0.75 m)
const R_ICI    = 0.255;   // 510 mm kalibre
const N_YUZ    = 20;      // namlu prizma kenar sayısı (eski model 25'ti)
const GULLE_R  = 0.245;   // 490 mm gülle

// Muylu: namlunun kundağa oturduğu tek nokta. u = eksen boyunca hazneden
// uzaklık; 1.85 / 4.06 = %45.6 — klasik kundakta muylu ağırlık merkezinin
// hemen önündedir.
const U_MUYLU  = 1.85;
const L_AGIZ   = L_TOP - U_MUYLU;        // muyludan ağza kalan boy (2.21)
const R_MUYLU  = 0.115;

const MUYLU_X  = 0.25;
const MUYLU_Y  = 1.30;

// Yanak (bracket) profili — dışbükey dörtgen (prizma tek fanla üçgenleniyor).
const YAN_ON_X     = 1.05;
const YAN_ARKA_X   = -2.80;
const YAN_ON_UST   = 1.48;
const YAN_ARKA_UST = 0.44;
const YANAK_IC     = 0.44;               // yanağın iç yüzü (namlu 0.375, boşluk var)
const YANAK_KAL    = 0.15;               // yanak kalınlığı
const YANAK_DIS    = YANAK_IC + YANAK_KAL;

const R_TEKER  = 0.72;    // ⚠️ _WHEELS.radius ile BİREBİR
const TEKER_K  = 0.17;    // tekerlek kalınlığı (aks doğrultusunda)
const TEKER_Z  = 1.00;    // iz yarı genişliği
const N_PARMAK = 10;      // parmaklık (spoke) sayısı
const AKS_YARI = 0.085;   // dingil kesitinin yarısı
const AKS_X    = 0.25;    // tek dingil, muylunun tam altında

// Yanağın ALT kenarı: aks üstünden (dingilin tepesi) kuyruk ucuna (yer) inen
// TEK doğru. İki noktadan TÜRETİLDİ, elle yazılmadı — eğim 0.26393 (14.8°).
const ALT_AKS  = R_TEKER + AKS_YARI;                       // 0.805
const ALT_EGIM = (0 - ALT_AKS) / (YAN_ARKA_X - AKS_X);     // 0.26393
function yanakAlt(x) { return ALT_AKS + (x - AKS_X) * ALT_EGIM; }
const UST_EGIM = (YAN_ARKA_UST - YAN_ON_UST) / (YAN_ARKA_X - YAN_ON_X);
function yanakUst(x) { return YAN_ON_UST + (x - YAN_ON_X) * UST_EGIM; }

// Geri tepmede namlunun muylu etrafında kalkışı. ⚠️ SINIR DEĞİL GENLİK:
// açı taraması (kusatma_topu_zemin_tara.js) 0/4/6/8/.../20 derecede namlu ile
// kundak arasındaki en küçük mesafeyi ölçüyor ve 20 derecede bile 0.093 m
// kalıyor — yani geometri kısıtlamıyor. 6 derece, ağzı 0.2254 m kaldırdığı
// (kutu yüksekliğinin %10.8'i) için seçildi.
const GERI_ACI = 6.0 * Math.PI / 180;

// ===========================================================================
// 2. GEOMETRİ TEZGÂHI — üçgen yığını
// ===========================================================================
// Bütün gövde ELDE, indekssiz üçgen çorbası olarak kuruluyor: her üçgen kendi
// yüz normalini taşıyor, `computeVertexNormals` komşu yüzleri ortalayamıyor —
// kereste ve dövme demir DÜZ YÜZLÜ okunuyor. Aynı renk grubundaki parçalar
// TEK mesh'te birleşiyor (`_applyTint` `getObjectByName` kullanıyor).
function Yigin() { this.p = []; this.n = []; }
Yigin.prototype.uc = function (a, b, c, ic) {
    let nx = (b[1] - a[1]) * (c[2] - a[2]) - (b[2] - a[2]) * (c[1] - a[1]);
    let ny = (b[2] - a[2]) * (c[0] - a[0]) - (b[0] - a[0]) * (c[2] - a[2]);
    let nz = (b[0] - a[0]) * (c[1] - a[1]) - (b[1] - a[1]) * (c[0] - a[0]);
    const l = Math.sqrt(nx * nx + ny * ny + nz * nz);
    if (!(l > 1e-12)) return;
    nx /= l; ny /= l; nz /= l;
    let B = b, C = c;
    const mx = (a[0] + b[0] + c[0]) / 3 - ic[0];
    const my = (a[1] + b[1] + c[1]) / 3 - ic[1];
    const mz = (a[2] + b[2] + c[2]) / 3 - ic[2];
    if (nx * mx + ny * my + nz * mz < 0) { B = c; C = b; nx = -nx; ny = -ny; nz = -nz; }
    this.p.push(a[0], a[1], a[2], B[0], B[1], B[2], C[0], C[1], C[2]);
    this.n.push(nx, ny, nz, nx, ny, nz, nx, ny, nz);
};
Yigin.prototype.ucy = function (a, b, c, yon) {
    let nx = (b[1] - a[1]) * (c[2] - a[2]) - (b[2] - a[2]) * (c[1] - a[1]);
    let ny = (b[2] - a[2]) * (c[0] - a[0]) - (b[0] - a[0]) * (c[2] - a[2]);
    let nz = (b[0] - a[0]) * (c[1] - a[1]) - (b[1] - a[1]) * (c[0] - a[0]);
    const l = Math.sqrt(nx * nx + ny * ny + nz * nz);
    if (!(l > 1e-12)) return;
    nx /= l; ny /= l; nz /= l;
    let B = b, C = c;
    if (nx * yon[0] + ny * yon[1] + nz * yon[2] < 0) {
        B = c; C = b; nx = -nx; ny = -ny; nz = -nz;
    }
    this.p.push(a[0], a[1], a[2], B[0], B[1], B[2], C[0], C[1], C[2]);
    this.n.push(nx, ny, nz, nx, ny, nz, nx, ny, nz);
};
Yigin.prototype.dort = function (a, b, c, d, ic) { this.uc(a, b, c, ic); this.uc(a, c, d, ic); };
Yigin.prototype.dorty = function (a, b, c, d, y) { this.ucy(a, b, c, y); this.ucy(a, c, d, y); };
Yigin.prototype.geo = function () {
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.BufferAttribute(new Float32Array(this.p), 3));
    g.setAttribute('normal', new THREE.BufferAttribute(new Float32Array(this.n), 3));
    return g;
};
function birim(v) { const l = Math.hypot(v[0], v[1], v[2]) || 1; return [v[0] / l, v[1] / l, v[2] / l]; }
function capraz(a, b) {
    return [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
}
function ortas(a, b) { return [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2, (a[2] + b[2]) / 2]; }

// Sekizgen (pahlı) kereste kesiti.
function kesit8(w, h, pah) {
    const p = Math.min(pah, w * 0.55, h * 0.55);
    return [[w, h - p], [w - p, h], [-(w - p), h], [-w, h - p],
            [-w, -(h - p)], [-(w - p), -h], [w - p, -h], [w, -(h - p)]];
}
function loft(Y, yol, pah) {
    const n = yol.length;
    const kesitler = [], eksenler = [];
    for (let k = 0; k < n; k++) {
        const a = yol[Math.max(0, k - 1)][0], b = yol[Math.min(n - 1, k + 1)][0];
        const T = birim([b[0] - a[0], b[1] - a[1], b[2] - a[2]]);
        const up = Math.abs(T[1]) > 0.985 ? [1, 0, 0] : [0, 1, 0];
        const S = birim(capraz(up, T));
        eksenler.push([S, capraz(T, S)]);
        kesitler.push(kesit8(yol[k][1], yol[k][2], pah));
    }
    const p = function (k, q) {
        const c = yol[k][0], S = eksenler[k][0], U = eksenler[k][1];
        return [c[0] + S[0] * q[0] + U[0] * q[1],
                c[1] + S[1] * q[0] + U[1] * q[1],
                c[2] + S[2] * q[0] + U[2] * q[1]];
    };
    for (let k = 0; k < n - 1; k++) {
        const ic = ortas(yol[k][0], yol[k + 1][0]);
        for (let i = 0; i < 8; i++) {
            const j = (i + 1) % 8;
            Y.dort(p(k, kesitler[k][i]), p(k, kesitler[k][j]),
                   p(k + 1, kesitler[k + 1][j]), p(k + 1, kesitler[k + 1][i]), ic);
        }
    }
    const ic0 = ortas(yol[0][0], yol[n - 1][0]);
    for (let i = 1; i < 7; i++) {
        Y.uc(p(0, kesitler[0][0]), p(0, kesitler[0][i]), p(0, kesitler[0][i + 1]), ic0);
        Y.uc(p(n - 1, kesitler[n - 1][0]), p(n - 1, kesitler[n - 1][i]),
             p(n - 1, kesitler[n - 1][i + 1]), ic0);
    }
}
function kiris(Y, p0, p1, w0, h0, w1, h1, pah) {
    loft(Y, [[p0, w0, h0], [p1, w1 === undefined ? w0 : w1, h1 === undefined ? h0 : h1]],
         pah === undefined ? 0.05 : pah);
}
function kutu(Y, cx, cy, cz, sx, sy, sz) {
    const a = sx / 2, b = sy / 2, c = sz / 2, ic = [cx, cy, cz];
    const v = [];
    for (let i = 0; i < 8; i++)
        v.push([cx + ((i & 1) ? a : -a), cy + ((i & 2) ? b : -b), cz + ((i & 4) ? c : -c)]);
    Y.dort(v[0], v[1], v[3], v[2], ic); Y.dort(v[4], v[5], v[7], v[6], ic);
    Y.dort(v[0], v[1], v[5], v[4], ic); Y.dort(v[2], v[3], v[7], v[6], ic);
    Y.dort(v[0], v[2], v[6], v[4], ic); Y.dort(v[1], v[3], v[7], v[5], ic);
}
// (x,y) düzleminde DIŞBÜKEY çokgenin z boyunca prizması. Yanağın üst ve alt
// kenarı farklı eğimde olduğu için kutu/kiriş yetmiyor; gerçek yamuk.
function prizma(Y, pts, z0, z1) {
    const n = pts.length;
    let cx = 0, cy = 0;
    for (const p of pts) { cx += p[0]; cy += p[1]; }
    cx /= n; cy /= n;
    const ic = [cx, cy, (z0 + z1) / 2];
    for (let i = 0; i < n; i++) {
        const j = (i + 1) % n;
        Y.dort([pts[i][0], pts[i][1], z0], [pts[j][0], pts[j][1], z0],
               [pts[j][0], pts[j][1], z1], [pts[i][0], pts[i][1], z1], ic);
    }
    for (let i = 1; i < n - 1; i++) {
        Y.uc([pts[0][0], pts[0][1], z0], [pts[i][0], pts[i][1], z0],
             [pts[i + 1][0], pts[i + 1][1], z0], ic);
        Y.uc([pts[0][0], pts[0][1], z1], [pts[i][0], pts[i][1], z1],
             [pts[i + 1][0], pts[i + 1][1], z1], ic);
    }
}
function silindir(Y, p0, p1, r0, r1, n, kapak) {
    const T = birim([p1[0] - p0[0], p1[1] - p0[1], p1[2] - p0[2]]);
    const up = Math.abs(T[1]) > 0.985 ? [1, 0, 0] : [0, 1, 0];
    const S = birim(capraz(up, T)), U = capraz(T, S);
    const ic = ortas(p0, p1);
    const q = function (c, r, i) {
        const a = i * Math.PI * 2 / n, cs = Math.cos(a) * r, sn = Math.sin(a) * r;
        return [c[0] + S[0] * cs + U[0] * sn, c[1] + S[1] * cs + U[1] * sn,
                c[2] + S[2] * cs + U[2] * sn];
    };
    for (let i = 0; i < n; i++) {
        const j = (i + 1) % n;
        Y.dort(q(p0, r0, i), q(p0, r0, j), q(p1, r1, j), q(p1, r1, i), ic);
    }
    if (kapak !== false) for (let i = 1; i < n - 1; i++) {
        Y.uc(q(p0, r0, 0), q(p0, r0, i), q(p0, r0, i + 1), ic);
        Y.uc(q(p1, r1, 0), q(p1, r1, i), q(p1, r1, i + 1), ic);
    }
}
// Y ekseni etrafında halka (tekerlek ayı ve demir şinası).
// ⚠️ DIŞ YARIÇAP TAM `rd`: köşeler tam o yarıçapta. Tekerleği kiriş yığınıyla
// kurmak koçbaşında ÖLÇÜLDÜ ve ELENDİ — kirişin yarı genişliği yarıçapa dik
// eklendiği için gerçek dış yarıçap %6.2 büyüyordu ve model zeminin altına
// iniyordu. `_WHEELS.radius` ile birebir tutmanın tek yolu halka.
function halkaY(Y, ric, rd, h, n) {
    for (let i = 0; i < n; i++) {
        const a0 = i * Math.PI * 2 / n, a1 = (i + 1) * Math.PI * 2 / n;
        const c0 = Math.cos(a0), s0 = Math.sin(a0), c1 = Math.cos(a1), s1 = Math.sin(a1);
        const y0 = -h / 2, y1 = h / 2;
        const dis = [(c0 + c1) / 2, 0, (s0 + s1) / 2];
        Y.dorty([rd * c0, y0, rd * s0], [rd * c1, y0, rd * s1],
                [rd * c1, y1, rd * s1], [rd * c0, y1, rd * s0], dis);
        if (ric > 0) {
            Y.dorty([ric * c0, y0, ric * s0], [ric * c1, y0, ric * s1],
                    [ric * c1, y1, ric * s1], [ric * c0, y1, ric * s0],
                    [-dis[0], 0, -dis[2]]);
        }
        Y.dorty([ric * c0, y1, ric * s0], [ric * c1, y1, ric * s1],
                [rd * c1, y1, rd * s1], [rd * c0, y1, rd * s0], [0, 1, 0]);
        Y.dorty([ric * c0, y0, ric * s0], [ric * c1, y0, ric * s1],
                [rd * c1, y0, rd * s1], [rd * c0, y0, rd * s0], [0, -1, 0]);
    }
}
function bitir(Y, ad, renk, mat, ebeveyn) {
    const o = { name: ad };
    if (mat) { o.metal = mat.metal; o.rough = mat.rough; }
    const m = mesh(Y.geo(), renk, o);
    (ebeveyn || modelGroup).add(m);
    return m;
}

// ===========================================================================
// 3. KUNDAK — iki yanak + traversler + kuyruk kızağı
// ===========================================================================
// Yanak dışbükey bir yamuk: ÖNDE derin (muyluyu taşıyor), ARKADA sığ (kuyruk).
// Sahrada alt kenar aks üstünden yere iniyor — kuyruk ucu y=0'da zemine
// değiyor, tekerlek de y=0'da: model iki noktadan oturuyor.
[-1, 1].forEach(function (s, k) {
    const Y = new Yigin();
    prizma(Y, [[YAN_ON_X, yanakAlt(YAN_ON_X)], [YAN_ON_X, YAN_ON_UST],
               [YAN_ARKA_X, YAN_ARKA_UST], [YAN_ARKA_X, yanakAlt(YAN_ARKA_X)]],
           s * YANAK_IC, s * YANAK_DIS);
    bitir(Y, 'kundak_' + (k + 1), C_MESE, M_AHSAP);
});

// TRAVERSLER + KUYRUK PABUCU. İki travers yeter: biri kuyrukta, biri ortada.
// ⚠️ ORTA TRAVERSİN ÜSTÜ (0.56) namlunun altındaki açıklığı belirliyor.
// ÖLÇÜLDÜ (kusatma_topu_zemin_tara.js): namlu ile bu parça arasındaki en
// küçük mesafe dinlenmede 0.3250 m, 6 derecelik kalkışın tepesinde 0.2031 m;
// yanaklarla (kundak_1) en dar yer 0.0955 m. Namlu kundağa hiç değmiyor.
const TRAVERS = [[-2.45, 0.14, 0.46], [-1.10, 0.46, 0.56]];
(function () {
    const Y = new Yigin();
    TRAVERS.forEach(function (t) {
        kutu(Y, t[0], (t[1] + t[2]) / 2, 0, 0.30, t[2] - t[1], 2 * YANAK_IC + 0.02);
    });
    // Kuyruk pabucu: iki yanağı arkada birleştiren masif blok. Tepeden bakışta
    // kuyruğu TEK çubuk yapan parça bu — iki ince çizgi olarak okunmuyordu.
    kutu(Y, -2.57, 0.11, 0, 0.46, 0.22, 2 * YANAK_DIS);
    bitir(Y, 'kundak_bag', C_MESE, M_AHSAP);
}());

// DİNGİL: yanakların ALTINA cıvatalanmış kare kesitli meşe dingil. Tekerlek
// merkezleri tam bunun ekseninde (y = R_TEKER).
(function () {
    const Y = new Yigin();
    kutu(Y, AKS_X, R_TEKER, 0, 2 * AKS_YARI, 2 * AKS_YARI, 2 * (TEKER_Z + 0.09));
    bitir(Y, 'dingil', C_MESE_K, M_AHSAP);
}());

// ===========================================================================
// 4. TEKERLEKLER
// ===========================================================================
// ⚠️ GRUP DESENİ (koçbaşı/askeri kamyon deseni): grup `rotation.x = π/2` ile
// yatırılıyor, `rotation.y` MOTORA bırakılıyor — motor yuvarlanmayı oradan
// yazıyor (studio-3d.js: `w.rotation.y = -yol / wheelR`). Grup içinde aks
// ekseni yerel y, disk yerel x-z düzleminde.
// ⚠️ HALKA KÖŞE SAYISI 20 — SEÇİM ÖLÇÜMLE. Halkanın DIŞ yarıçapı tam R_TEKER
// ama en alçak NOKTA ancak bir köşe 270 dereceye denk gelirse tam -R_TEKER
// olur. 18 köşede 270/20° = 13.5 (denk gelmiyor) ve tekerlek zeminden 0.011 m
// yukarıda kalıyordu; 20 köşede 270/18° = 15, tam oturuyor.
const N_HALKA = 20;
function tekerlek(ad, z) {
    const g = new THREE.Group();
    g.name = ad;
    g.position.set(AKS_X, R_TEKER, z);
    g.rotation.x = Math.PI / 2;
    const yk = TEKER_K / 2;
    // Göbek + on parmak + ay dilimi kuşağı (felloe). Parmaklar küçük ölçekte
    // tek tek okunmuyor ama aralarındaki BOŞLUK okunuyor: tepeden doluluk
    // 0.448'de kalıyor, masif tekerlekli garnizon adayında 0.654'e çıkıyordu.
    const Y = new Yigin();
    silindir(Y, [0, -yk - 0.055, 0], [0, yk + 0.055, 0], 0.145, 0.145, 12);
    for (let i = 0; i < N_PARMAK; i++) {
        const a = i * Math.PI * 2 / N_PARMAK;
        const c = Math.cos(a), s = Math.sin(a);
        kiris(Y, [c * 0.12, 0, s * 0.12], [c * (R_TEKER - 0.105), 0, s * (R_TEKER - 0.105)],
              0.048, yk * 0.72, 0.042, yk * 0.72, 0.018);
    }
    halkaY(Y, R_TEKER - 0.175, R_TEKER - 0.048, TEKER_K, N_HALKA);
    g.add(mesh(Y.geo(), C_MESE, { name: ad + '_govde', metal: 0.10, rough: 0.86 }));
    // DEMİR ŞİNA — DIŞ YARIÇAP TAM R_TEKER (_WHEELS.radius ile birebir).
    const Z = new Yigin();
    halkaY(Z, R_TEKER - 0.044, R_TEKER, TEKER_K + 0.022, N_HALKA);
    g.add(mesh(Z.geo(), C_DEMIR_P, { name: ad + '_cember', metal: 0.55, rough: 0.44 }));
    modelGroup.add(g);
}
tekerlek('teker_1', TEKER_Z);
tekerlek('teker_2', -TEKER_Z);

// ===========================================================================
// 5. NAMLU — muylu etrafında dönen grup
// ===========================================================================
// ⚠️ GRUP ORİJİNİ MUYLUDA. Geri tepme davranışı yalnız `rotation.z` yazıyor;
// namlu muylunun etrafında kalkıyor. Eski modelde namlu kundakta EKSEN
// BOYUNCA 0.52 m kayıyordu — muylulu kundakta bu OLAMAZ: muylu yatağından
// 0.52 m ayrılır, yani namlu kundaktan çıkardı (ölçüldü, ELENDİ).
const topKok = new THREE.Group();
topKok.name = 'top_kok';
topKok.position.set(MUYLU_X, MUYLU_Y, 0);
modelGroup.add(topKok);

// Muylu-yerel eksen: u = hazneden uzaklık, muylu u = U_MUYLU'da.
function nok(u) { return [(u - U_MUYLU) * CA, (u - U_MUYLU) * SA, 0]; }

// Namlu profili: u -> dış yarıçap. Hazne 0.315 sabit → vidalı ek bileziği →
// namlu 0.375, uçta hafif incelip ağız kuşağında yine kalınlaşıyor.
const PROFIL = [
    [0.00, R_HAZNE], [0.10, R_HAZNE + 0.030], [0.22, R_HAZNE],
    [L_HAZNE - 0.06, R_HAZNE], [L_HAZNE, R_HAZNE + 0.028],
    [L_HAZNE + 0.10, R_NAMLU], [2.60, R_NAMLU], [3.60, R_NAMLU - 0.022],
    [3.88, R_NAMLU - 0.036], [3.96, R_NAMLU + 0.022], [L_TOP, R_NAMLU]
];
function profilR(u) {
    if (u <= PROFIL[0][0]) return PROFIL[0][1];
    for (let i = 1; i < PROFIL.length; i++) {
        if (u <= PROFIL[i][0]) {
            const a = PROFIL[i - 1], b = PROFIL[i];
            return a[1] + (b[1] - a[1]) * ((u - a[0]) / (b[0] - a[0]));
        }
    }
    return PROFIL[PROFIL.length - 1][1];
}
const NS = [-SA, CA, 0];                    // namlu eksenine dik (xy düzleminde)
function cevre(p, r, k, n) {
    const a = k * Math.PI * 2 / n, cs = Math.cos(a) * r, sn = Math.sin(a) * r;
    return [p[0] + NS[0] * cs, p[1] + NS[1] * cs, p[2] + sn];
}
(function () {
    const Y = new Yigin();
    for (let i = 1; i < PROFIL.length; i++) {
        silindir(Y, nok(PROFIL[i - 1][0]), nok(PROFIL[i][0]),
                 PROFIL[i - 1][1], PROFIL[i][1], N_YUZ, false);
    }
    const p0 = nok(0);                       // hazne dip yüzü (vidalı kapak)
    for (let i = 1; i < N_YUZ - 1; i++) {
        Y.ucy(cevre(p0, R_HAZNE, 0, N_YUZ), cevre(p0, R_HAZNE, i, N_YUZ),
              cevre(p0, R_HAZNE, i + 1, N_YUZ), [-CA, -SA, 0]);
    }
    const pa = nok(L_TOP), ra = profilR(L_TOP);   // ağız halkası
    for (let i = 0; i < N_YUZ; i++) {
        const j = (i + 1) % N_YUZ;
        Y.dorty(cevre(pa, R_ICI, i, N_YUZ), cevre(pa, R_ICI, j, N_YUZ),
                cevre(pa, ra, j, N_YUZ), cevre(pa, ra, i, N_YUZ), [CA, SA, 0]);
    }
    bitir(Y, 'namlu', C_DEMIR, M_DEMIR, topKok);
}());
(function () {
    const Y = new Yigin();     // ağzın İÇİ: iç duvar (normaller içe) + dip disk
    const dip = nok(L_TOP - 0.80), agz = nok(L_TOP - 0.004);
    for (let i = 0; i < N_YUZ; i++) {
        const j = (i + 1) % N_YUZ;
        const a = i * Math.PI * 2 / N_YUZ;
        const ice = [-NS[0] * Math.cos(a), -NS[1] * Math.cos(a), -Math.sin(a)];
        Y.dorty(cevre(dip, R_ICI, i, N_YUZ), cevre(dip, R_ICI, j, N_YUZ),
                cevre(agz, R_ICI, j, N_YUZ), cevre(agz, R_ICI, i, N_YUZ), ice);
        Y.ucy(dip, cevre(dip, R_ICI, i, N_YUZ), cevre(dip, R_ICI, j, N_YUZ), [CA, SA, 0]);
    }
    bitir(Y, 'namlu_agiz', C_AGIZ, M_AGIZ, topKok);
}());
// BİLEZİKLER: eski modelde 33 taneydi ve küçük ölçekte tek tek okunmuyor,
// namluyu gri bir tarama hâline getiriyordu. ALTIYA indi ve her biri klasik
// top namlusunun ayırt edici kuşağı: kaide bileziği, hazne kuşağı, VİDALI EK
// (Mons Meg'in iki bölümlü siluetinin tanığı), orta kuşak, gövde kuşağı,
// ağız kuşağı.
const BILEZIK_U = [0.055, 0.62, L_HAZNE, 2.30, 3.30, 3.985];
const W_BILEZIK = 0.10, D_BILEZIK = 0.032;
(function () {
    const Y = new Yigin();
    BILEZIK_U.forEach(function (u) {
        const r = profilR(u) + D_BILEZIK;
        silindir(Y, nok(u - W_BILEZIK / 2), nok(u + W_BILEZIK / 2), r, r, N_YUZ, true);
    });
    bitir(Y, 'bilezik', C_DEMIR_A, M_DEMIR, topKok);
}());
// MUYLULAR: namluyu kundağa bağlayan iki kısa silindir. Yanağın iç yüzünden
// (0.44) dış yüzünün 0.03 ötesine (0.62) uzanıyor — kapak kayışı orada.
(function () {
    const Y = new Yigin();
    const c = nok(U_MUYLU);
    [-1, 1].forEach(function (s) {
        silindir(Y, [c[0], c[1], s * (R_NAMLU - 0.06)], [c[0], c[1], s * (YANAK_DIS + 0.03)],
                 R_MUYLU, R_MUYLU, 12, true);
    });
    bitir(Y, 'muylu', C_DEMIR, M_DEMIR, topKok);
}());

// ===========================================================================
// 6. DEMİR AKSAM — kapak kayışları ve kundak kuşakları
// ===========================================================================
// Kapak kayışı (capsquare) muyluyu yatağında tutan demir; onsuz namlu
// kundağın üstünde duruyormuş gibi okunuyor.
(function () {
    const Y = new Yigin();
    [-1, 1].forEach(function (s) {
        kutu(Y, MUYLU_X, MUYLU_Y + R_MUYLU + 0.028, s * (YANAK_IC + YANAK_KAL / 2),
             0.30, 0.056, YANAK_KAL + 0.03);
        // yanağı çepeçevre saran iki kuşak
        [-1.30, -2.30].forEach(function (x) {
            const y0 = yanakAlt(x), y1 = yanakUst(x);
            kutu(Y, x, (y0 + y1) / 2, s * (YANAK_DIS + 0.014),
                 0.10, y1 - y0 + 0.02, 0.028);
        });
    });
    // Kuyruk halkası: çekme kancasının geçtiği demir kulp. ⚠️ x = -2.72,
    // yanağın arka yüzünün (-2.80) İÇİNDE: dışarı taşsaydı kutuyu 0.10 m
    // büyütür, model boyunca hiç okunmayan tek bir diken bırakırdı.
    silindir(Y, [-2.72, 0.30, -0.13], [-2.72, 0.30, 0.13], 0.035, 0.035, 8);
    bitir(Y, 'kundak_demir', C_DEMIR_P, M_DEMIR);
}());

// ===========================================================================
// 7. ATEŞ ÖĞELERİ — duman ve uçan gülle
// ===========================================================================
// ⚠️ İKİSİ DE DİNLENME POZUNDA KUTUYU BÜYÜTMEMELİ. `Box3.setFromObject`
// görünürlüğe BAKMADAN bütün geometriyi sayıyor (three r128), yani "gizle,
// yeter" işe yaramaz. Model kodu ikisini de KUTUNUN İÇİNE, duman için ölçek
// ~0 ile kuruyor; davranış her karede mutlak durumdan yeniden yazıyor.
const AGIZ_X = MUYLU_X + L_AGIZ * CA;        // ağız — model uzayında
const AGIZ_Y = MUYLU_Y + L_AGIZ * SA;
function kure(Y, c, r, nu, nv) {
    const q = function (i, j) {
        const th = j * Math.PI / nv, ph = i * Math.PI * 2 / nu;
        return [c[0] + r * Math.sin(th) * Math.cos(ph), c[1] + r * Math.cos(th),
                c[2] + r * Math.sin(th) * Math.sin(ph)];
    };
    for (let j = 0; j < nv; j++) for (let i = 0; i < nu; i++) {
        const a = q(i, j), b = q(i + 1, j), d = q(i + 1, j + 1), e = q(i, j + 1);
        if (j === 0) Y.uc(a, d, e, c);
        else if (j === nv - 1) Y.uc(a, b, d, c);
        else Y.dort(a, b, d, e, c);
    }
}
(function () {
    const Y = new Yigin();
    [[0, 0, 0, 1.00], [0.62, 0.30, 0.18, 0.72], [-0.48, 0.26, -0.22, 0.66],
     [0.30, -0.34, 0.40, 0.58], [-0.24, 0.52, 0.30, 0.54]].forEach(function (q) {
        kure(Y, [q[0], q[1], q[2]], q[3], 9, 6);
    });
    const m = bitir(Y, 'duman', '#b9b4ab', { metal: 0.0, rough: 1.0 });
    m.castShadow = false; m.receiveShadow = false;
    m.material.transparent = true;
    m.material.depthWrite = false;
    m.material.opacity = 0;
    // ⚠️ _baseOp'u BURADA sabitle. `_applyOpacity` ilk çalıştığında malzemenin
    // O ANKİ opaklığını taban kabul ediyor; davranış çoktan soldurmuşsa taban
    // yanlış yakalanır ve duman bir daha hiç tam görünmez.
    m.material.userData._baseOp = 1;
    m.material.userData._hepSaydam = true;
    m.scale.set(0.001, 0.001, 0.001);
    m.position.set(AGIZ_X, AGIZ_Y, 0);
    m.visible = false;
}());
const YUVA_U = L_AGIZ - 0.34;                // gülle yuvası (ağızdan 0.34 geride)
const YUVA_X = MUYLU_X + YUVA_U * CA;
const YUVA_Y = MUYLU_Y + YUVA_U * SA;
(function () {
    const Y = new Yigin();
    kure(Y, [0, 0, 0], GULLE_R, 12, 8);
    const m = bitir(Y, 'gulle_ucan', C_TAS, M_TAS);
    // Dinlenmede namlunun İÇİNDE duruyor (ağızdan 0.34 m geride) ve gizli.
    m.position.set(YUVA_X, YUVA_Y, 0);
    m.visible = false;
}());

// Motorun davranışı ölçüleri BURADAN okuyor — iki yerde iki sayı olmasın.
// AGIZ_L*: ağzın TOP_KOK YERELİNDEKİ yeri (ağız alevi oraya oturuyor);
// AGIZ_*/YUVA_*: aynı noktaların MODEL uzayındaki dinlenme değerleri —
// davranış dinlenme dalında bu sayıları BİREBİR geri yazıyor, t=0 ile t=1
// karesi bu yüzden bit bit aynı çıkıyor.
modelGroup.userData.kusatmaTopu = {
    ACI: ACI, CA: CA, SA: SA, L_TOP: L_TOP, GERI_ACI: GERI_ACI,
    MUYLU_X: MUYLU_X, MUYLU_Y: MUYLU_Y, L_AGIZ: L_AGIZ, YUVA_U: YUVA_U,
    R_NAMLU: R_NAMLU, R_ICI: R_ICI, GULLE_R: GULLE_R, R_TEKER: R_TEKER,
    AGIZ_LX: L_AGIZ * CA, AGIZ_LY: L_AGIZ * SA,
    AGIZ_X: AGIZ_X, AGIZ_Y: AGIZ_Y, YUVA_X: YUVA_X, YUVA_Y: YUVA_Y
};
