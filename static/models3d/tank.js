// Tank — LEOPARD 2A7 siluetinde ana muharebe tankı.
//
// ⚠️ BU DOSYA BİR KEZ YENİDEN YAZILDI. Önceki sürüm (models/tank.js.LEOPARD-ONCE,
// 51 mesh / 2308 üçgen) BoxGeometry yığınıydı: düz bir kutu gövde, üstüne
// eğik bir levha, sekizgen bir taret ve iki yandan geçen düz palet kirişleri.
// Teşhis motosiklet dersinin aynısı:
//
//   Uç uca dizilen sabit kesitli kutular matematiksel olarak örtüşse bile
//   GÖRSEL SÜREKLİLİK vermiyor. Çamurluk, gövde ve palet üç ayrı levha gibi
//   okunuyor; aralarındaki geçiş yok, kütle tek bir araç gibi durmuyor.
//
// ÇÖZÜM — KESİTTEN LOFT (devir §3): gövde de kule de, kendi eksenleri
// boyunca ayrı ayrı hesaplanan KAPALI KESİTLERİN birbirine dikilmesiyle
// kuruluyor. Her kesitin köşe noktaları x boyunca kendi monoton kübik
// (PCHIP) eğrisinden okunuyor; köşeler pahlanıp SABİT sayıda örnekleniyor.
// Böylece glasi ile tavan arasındaki kırılma, motor güvertesinin basamağı ve
// kulenin ok başı (Pfeilform) ön zırhı TEK SÜREKLİ YÜZEY olarak çıkıyor.
//
// ⚠️ OTOMOBİLDEN AYRILAN YER: otomobilde cam/dikiş/far `yuzeyYama` ile gövde
// yüzeyine oturan KALINLIKSIZ panellerdi. Tankta öyle bir şey yok — bir tankın
// üstündeki her şey (ızgara, kapak, kutu, sis atar) cıvatalanmış GERÇEK HACİM.
// Bu yüzden burada `yuzeyYama` HİÇ kullanılmadı ve aynı yüzeye oturan
// panellerin derinlik kavgası (devir §5.2) baştan doğmadı.
//
// ---------------------------------------------------------------------------
// ÖLÇÜLER — EZBERDEN DEĞİL, KAYNAKTAN DOĞRULANDI (2026-09-03)
//   Wikipedia "Leopard 2" · armyrecognition Leopard 2A7 ·
//   army-technology Leopard 2A7+ · weaponsystems.net Leopard 2A4
//
//   uzunluk namlu ileride  10.97 m   (2A6/2A7, L/55 topla)
//   gövde uzunluğu          7.72 m
//   genişlik etekle         3.70 m (A4) · 3.75 (A6) · 3.81 (2A7)
//   kule tavanı             2.64 m ; PERI / silah istasyonuyla ~3.03 m
//   palet genişliği         0.635 m ; Diehl 570F, palet başına 82 bakla
//   yerden yükseklik        0.537 m ön · 0.487 m arka (inetres.com)
//   gövde yanları           DÜZ ve DİK ("sides of hull are flat and vertical
//                           (squared)", inetres.com) — burna doğru DARALMIYOR
//   etek zırhı              ön üç panel DÜZ, arka üçü ince kauçuk
//                           ("front three panels of track sideskirting are
//                            straight", inetres.com)
//   yürüyüş takımı          yanda YEDİ çift lastikli yol tekeri + DÖRT üst
//                           makara ; ⚠️ GERGİ TEKERİ ÖNDE, TAHRİK DİŞLİSİ
//                           ARKADA (iki bağımsız kaynakta doğrulandı —
//                           brief'teki "önde tahrik" ifadesi YANLIŞTI)
//   top                     Rh-120 L/55, 120 mm yivsiz, 6.60 m namlu.
//                           ⚠️ L/55'te NAMLU FRENİ YOK (aş. `namlu_freni`)
//   ikincil silah           FLW 200 uzaktan kumandalı istasyon (yükleyici
//                           kapağında) + MG3A1 eş eksenli
//   gözetleme               PERI RTWL komutan periskopu, EMES 15 nişancı bakacı
//   sis atar                kulenin HER İKİ yanında 8'er adet 76 mm
//
// MODELDEKİ KARŞILIKLARI (ham model metresi; burun +x, üst +y, taban y=0):
//   gövde          x ∈ [-3.860, +3.860]  = 7.72 m
//   arka teçhizat  x = -3.930 (egzoz panjuru) — en arka nokta
//   namlu ucu      x = +7.040             → toplam 10.97 m
//   üst gövde yarı genişliği 1.762        → çamurluk hattı 3.524 m
//   etek dış yüzü  z = ±1.850             → 3.70 m
//   kule tavanı    y = 2.620 ; PERI tepesi 2.980 ; anten tepesi 3.240
//   palet merkezi  z = ±1.320 (merkez aralığı 2.64 m), genişlik 0.635
//                  → palet üstü 3.275 m ; çamurluk paletin 12 cm dışında
//   palet üst kolu y = 1.155 (en yüksek nokta) — çamurluk altı BUNUN ÜSTÜNDE
//   çamurluk altı  y = 1.290 (boydan boya SABİT)
//   etek zırhı     y ∈ [0.868, 1.300] ; iç yüz 1.740, ön modül dış yüz 1.850
//   yol tekeri yarıçapı 0.350  → ⚠️ _WHEELS.radius = 0.35 İLE BİREBİR AYNI
//                                 OLMAK ZORUNDA (devir §6.1)
//
// ---------------------------------------------------------------------------
// ⚠️ 2026-09-04 — İKİ GEOMETRİ KUSURU ÖLÇÜLÜP DÜZELTİLDİ (tank_kesisim.js)
//
//   1. ÖN GÖVDE PALETİN VE GERGİ TEKERİNİN İÇİNE GİRİYORDU. Glasi burna
//      doğru 0.960'a, çamurluk altı 0.930'a iniyordu; oysa paletin üst kolu
//      1.155'te, gergi tekerinin tepesi 1.070'te. Ölçülen batma:
//        palet ↔ gövde        111.76 mm   (x = 2.897)
//        gergi tekeri ↔ gövde  97.96 mm   (x = 3.125)
//        gövde ↔ palet         37.18 mm   (bütün boy, sponson iç köşesi)
//      KAYNAK (Leopard 2A6M yan fotoğrafı, Wikimedia Commons Leo2A6M_li.jpg,
//      yol tekeri adımı 0.79 m ile ölçeklenerek okundu): gerçek araçta
//      çamurluk hattı BOYDAN BOYA YATAY, burunda AŞAĞI İNMİYOR; glasi
//      burnun ucunda çamurluk hattına oturuyor (yatayla ~7°, "sloped" =
//      yataya yakın demek). Fotoğraftan okunan yükseklikler: güverte 1.583,
//      etek üstü 1.266, etek altı 0.848, tekerlek ekseni 0.443 —
//      modeldeki 1.590 / 1.300 / 0.868 / 0.435 ile birebir uyumlu.
//
//   2. ETEK ZIRHLARI GÖVDENİN 22 cm DIŞINDA HAVADA DURUYORDU. Üst gövde
//      1.630'da bitiyor, etek 1.740'ta başlıyordu: aradaki 110 mm hava
//      boşluğu ön bakışta iki ayrı levha gibi okunuyordu, üstelik gövde
//      burna doğru 1.440'a daralırken etek 1.850'de kaldığı için taşma
//      x = 3.32'de 286.6 mm'ye çıkıyordu. Gerçekte etek gövde yanına
//      CIVATALANMIŞ (fotoğrafta tek düzlem, ince bir basamak). Üst gövde
//      1.762'ye genişletildi, etek iç yüzü 22 mm gövdenin İÇİNDE kaldı;
//      taşma her yerde 88 mm (ön ağır modül) / 33 mm (arka ince modül).
//      Kutu 10.970 × 3.239 × 3.700 DEĞİŞMEDİ (genişliği hâlâ etek veriyor).
//
// ---------------------------------------------------------------------------
// MOTOR SÖZLEŞMESİ — DEĞİŞMEYEN ADLAR. studio-3d.js bunları arıyor, kayıtlı
// kullanıcı projeleri bunlara bağlı: SİLME, YENİDEN ADLANDIRMA.
//   _TURRETS eski adlar : taret · mantle · namlu · namlu_freni · sandik ·
//                         kapak · mg · anten
//   _TURRETS yeni adlar : namlu_kovan · tahliye · kapak_yukleyici · peri ·
//                         peri_cam · nisangah · nisangah_cam · rws ·
//                         rws_kaide · sis_1 · sis_2 · anten_2
//                         (kule dönerken yerinde kalmasınlar diye listeye
//                          eklendiler; eski adların hiçbiri değişmedi)
//   _MODEL_ANIMS        : ['classic', 'drive', 'fire'] — DEĞİŞMEDİ
//   ⚠️ `namlu` TEK MESH olmak zorunda: motor `getObjectByName('namlu')`ın
//      kutusundan ağız alevinin ve merminin çıkış noktasını okuyor.
//
// ⚠️ HARİTA MODELİ SOLDAN SAĞA AYNALIYOR (devir §5.3). Asimetrik parçalar
// (komutan periskopu, nişancı bakacı, sürücü kapağı, silah istasyonu) bu
// yüzden model uzayında TERS tarafa yazıldı: `SAG` sabiti aracın gerçek SAĞ
// tarafının model-z işaretini tutuyor, tek karakterle çevrilebilir.

// ===========================================================================
// 0. RENKLER VE MALZEME
// ===========================================================================
const C_GOVDE  = '#5b6650';   // NATO yeşili — _TINT birincil varsayılanı
const C_ETEK   = '#4c5644';   // etek zırhı  — _TINT ikincil varsayılanı
const C_KOYU   = '#454f3d';   // gölgeli kaynaklı ekler
const C_PALET  = '#2b2d31';   // palet çeliği
const C_LASTIK = '#191a1d';   // yol tekeri lastiği
const C_CELIK  = '#4b5057';   // namlu, göbek, çıplak çelik
const C_KARA   = '#141619';   // ızgara içi, oyuk
const C_CAM    = '#10141a';   // periskop / bakaç camı
const C_FAR    = '#c3ccd4';
const C_STOP   = '#8e2b23';

// ⚠️ metalness'i DÜŞÜRMEK açık renkte patlamayı ARTIRIR (difüz =
// albedo × (1−metalness), devir §5.1). Mat askeri boya için yüksek
// roughness + ORTA metalness; ölçümü `parlaklik.py` yapıyor.
const MAL_GOVDE = { metal: 0.28, rough: 0.72 };
const MAL_PALET = { metal: 0.42, rough: 0.62 };

// ===========================================================================
// 1. TEMEL ÖLÇÜLER
// ===========================================================================
const GOV_ON    =  3.860;
const GOV_ARKA  = -3.860;   // → gövde 7.72 m
const NAMLU_UC  =  7.035;   // namlu ucu; bilezik 5 mm geçiyor → toplam 10.97
const NAMLU_Y   =  2.050;   // top ekseni yüksekliği
const TZ        =  1.320;   // palet merkezi z (merkez aralığı 2.64 m)
const PAL_YARI  =  0.3175;  // palet yarı genişliği (0.635 m)
const PAL_KAL   =  0.0425;  // palet yarı kalınlığı (85 mm bakla)
const R_TEKER   =  0.350;   // ⚠️ yol tekeri yarıçapı = _WHEELS.radius
const RB        = R_TEKER + PAL_KAL;      // palet orta çizgisinin sarım yarıçapı
const YOL_Y     = R_TEKER + 2 * PAL_KAL;  // yol tekeri aks yüksekliği = 0.435
const UST_Y     =  0.720;   // gergi ve tahrik dişlisi aks yüksekliği
const GERGI_X   =  3.300;   // ⚠️ GERGİ ÖNDE
const DISLI_X   = -3.300;   // ⚠️ TAHRİK ARKADA
const YOL_X     = [2.550, 1.760, 0.970, 0.180, -0.610, -1.400, -2.190];
const MAKARA_X  = [2.250, 0.850, -0.550, -1.950];
const MAKARA_Y  =  0.945;
const R_MAKARA  =  0.125;
const KULE_X    = -0.550;   // ⚠️ kule yatağının merkezi = _TURRETS.pivot[0]
const SAG       = -1;       // aracın SAĞ tarafı model uzayında -z (ayna notu)

// ===========================================================================
// 2. MONOTON KÜBİK EĞRİ (PCHIP) — otomobil.js ile aynı gerekçe
// ===========================================================================
// Catmull-Rom taşma yapıyor: glasi ile tavan arasında eğim sert değiştiği
// için tavan çizgisi glasinin üzerine tümsek atardı. Fritsch-Carlson
// teğetleri yerel uç noktalarda sıfırlanır → taşma yok.
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
// 3. ORTAK YARDIMCILAR
// ===========================================================================
// Birden çok basit gövdeyi TEK BufferGeometry'de toplar. İki gerekçe:
//   1. `_applyTint` `getObjectByName` kullanıyor — aynı adlı meshlerden
//      yalnız İLKİ renk alır (devir §5.2). Sekiz sis atar tüpü ayrı mesh
//      olsaydı ya sekiz ayrı ad ya da yedi boyanmayan tüp olurdu.
//   2. Çizim çağrısı: 16 tüp + 24 ızgara çıtası + 11 sepet çubuğu = 51 ayrı
//      mesh yerine 4 mesh.
function birlestir(parcalar) {
    const P = [], N = [], IDX = [];
    for (const g of parcalar) {
        const gp = g.attributes.position, gn = g.attributes.normal;
        const taban = P.length / 3;
        for (let i = 0; i < gp.count; i++) {
            P.push(gp.getX(i), gp.getY(i), gp.getZ(i));
            N.push(gn.getX(i), gn.getY(i), gn.getZ(i));
        }
        if (g.index) {
            for (let i = 0; i < g.index.count; i++) IDX.push(taban + g.index.getX(i));
        } else {
            for (let i = 0; i < gp.count; i++) IDX.push(taban + i);
        }
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.Float32BufferAttribute(P, 3));
    geo.setAttribute('normal', new THREE.Float32BufferAttribute(N, 3));
    geo.setIndex(IDX);
    return geo;
}

// Eksene hizalı kutu, VERİLEN ARALIĞA oturur.
// ⚠️ Aralıklar sıralanıyor: aynalanan parçalar `s * a` ... `s * b` biçiminde
// yazıldığı için s=-1'de sınırlar ters dönüyor; sıralamasaydık BoxGeometry
// NEGATİF boyutla kurulur ve yüzey normalleri içeri bakardı (parça kaybolur).
function kutuGeo(x1, x2, y1, y2, z1, z2) {
    const ax = Math.min(x1, x2), bx = Math.max(x1, x2);
    const ay = Math.min(y1, y2), by = Math.max(y1, y2);
    const az = Math.min(z1, z2), bz = Math.max(z1, z2);
    const g = new THREE.BoxGeometry(bx - ax, by - ay, bz - az);
    g.translate((ax + bx) / 2, (ay + by) / 2, (az + bz) / 2);
    return g;
}

// Köşeleri PAHLANMIŞ yarım kesit. Köşe listesi [z, y, pah, örnek].
// ⚠️ Dönen dizi HER İSTASYONDA AYNI UZUNLUKTA olmak zorunda — loft halkaları
// ancak öyle birbirine dikilebilir. Bu yüzden örnek sayıları x'e BAĞLI DEĞİL.
// (Yay uzunluğuna göre örneklemek düz bölümlerde nokta israfı olurdu, daha
// kötüsü topolojiyi istasyondan istasyona kaydırır ve yüzeyi BURARDI.)
function pahliKesit(K) {
    const P = [];
    for (let i = 0; i < K.length; i++) {
        const k = K[i];
        if (i === 0 || i === K.length - 1 || k[3] < 2) { P.push([k[0], k[1]]); continue; }
        const p0 = K[i - 1], p1 = k, p2 = K[i + 1];
        const d1z = p1[0] - p0[0], d1y = p1[1] - p0[1];
        const d2z = p2[0] - p1[0], d2y = p2[1] - p1[1];
        const l1 = Math.sqrt(d1z * d1z + d1y * d1y) || 1e-6;
        const l2 = Math.sqrt(d2z * d2z + d2y * d2y) || 1e-6;
        const rr = Math.min(k[2], l1 * 0.45, l2 * 0.45);
        const az = p1[0] - d1z / l1 * rr, ay = p1[1] - d1y / l1 * rr;
        const bz = p1[0] + d2z / l2 * rr, by = p1[1] + d2y / l2 * rr;
        for (let j = 0; j < k[3]; j++) {
            const t = j / (k[3] - 1), u = 1 - t;
            P.push([u * u * az + 2 * u * t * p1[0] + t * t * bz,
                    u * u * ay + 2 * u * t * p1[1] + t * t * by]);
        }
    }
    return P;
}

// KESİTTEN LOFT. `kesitFn(x)` yarım kesiti [z, y] noktaları olarak veriyor;
// halka taban orta hattından +z tarafıyla tepeye çıkıp -z tarafından iniyor
// (kutup yok, bozuk üçgen yok). Uçlar düz üçgen yelpazeyle kapatılıyor ve
// halka köşeleri KOPYALANIYOR: computeVertexNormals kapağın normalini yan
// yüzeyinkiyle ortalasaydı arka plaka ile yan arasındaki keskin kaynak
// kenarı yumuşayıp kaybolurdu.
function loftKur(ad, IST, kesitFn, renk, opts) {
    const NY = kesitFn(IST[0]).length;
    const NR = 2 * NY - 2;
    function halka(x) {
        const y = kesitFn(x), r = [];
        for (let i = 0; i < NY; i++) r.push([y[i][1], y[i][0]]);
        for (let i = NY - 2; i >= 1; i--) r.push([y[i][1], -y[i][0]]);
        return r;
    }
    const P = [], IDX = [];
    for (let i = 0; i < IST.length; i++) {
        const h = halka(IST[i]);
        for (let j = 0; j < NR; j++) P.push(IST[i], h[j][0], h[j][1]);
    }
    for (let i = 0; i < IST.length - 1; i++) {
        for (let j = 0; j < NR; j++) {
            const j2 = (j + 1) % NR;
            const a = i * NR + j, b = i * NR + j2;
            const c = (i + 1) * NR + j, d = (i + 1) * NR + j2;
            IDX.push(a, c, d, a, d, b);
        }
    }
    function kapak(x, onYuz) {
        const h = halka(x);
        let ym = 0;
        for (const p of h) ym += p[0];
        ym /= h.length;
        const merkez = P.length / 3;
        P.push(x, ym, 0);
        const bas = merkez + 1;
        for (let j = 0; j < NR; j++) P.push(x, h[j][0], h[j][1]);
        for (let j = 0; j < NR; j++) {
            const a = bas + j, b = bas + (j + 1) % NR;
            if (onYuz) IDX.push(merkez, b, a); else IDX.push(merkez, a, b);
        }
    }
    kapak(IST[IST.length - 1], true);
    kapak(IST[0], false);
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.Float32BufferAttribute(P, 3));
    geo.setIndex(IDX);
    geo.computeVertexNormals();
    const m = mesh(geo, renk, Object.assign({ name: ad }, opts || {}));
    modelGroup.add(m);
    return m;
}

// ===========================================================================
// 4. GÖVDE — kesitten loft
// ===========================================================================
// Yarım kesitin köşeleri (z ≥ 0):
//   A (0,  yT)      karın orta hattı
//   B (wT, yT)      karın dış köşesi
//   C (wT, ySA)     tekne yanının üstü        ← paletin arkasında kalır
//   D (wU, ySB)     sponson (çamurluk) dış alt kenarı — paletin ÜSTÜNÜ örter
//   E (wU, yC−p)    üst gövde yanının tepesi
//   F (wC, yC)      tavan pahı
//   G (0,  yC)      tavan orta hattı
// Beş uzunlamasına eğri bu köşeleri x boyunca gezdiriyor.

// TAVAN / GÜVERTE. x ∈ [−1.35, 1.15] muharebe bölmesi tavanı (1.590);
// x < −1.55 motor güvertesi (1.500 — 9 cm ALÇAK, Leopard 2'nin en tanıdık
// yan siluet basamağı); x > 1.40 GLASİ, burna doğru iniyor.
// ⚠️ GLASİ EĞİMİ DÜZELTİLDİ (2026-09-04): eskiden (1.400, 1.578) →
// (3.860, 0.960), yani yatayla 14.1° ve burun ucu 0.960'ta. Leopard 2'nin
// üst ön plakası dikeyle ~82°, yani YATAYLA ~8° — "çok eğimli glasi" ifadesi
// yataya yakın demek. Eski eğim burnu paletin (üst kol 1.155) ve gergi
// tekerinin (tepe 1.070) İÇİNE sokuyordu. Yeni: (1.400, 1.580) →
// (3.860, 1.288), yatayla 6.8°; burun ucu çamurluk hattının 5 cm üstünde.
const Y_CATI = egriYap([
    [-3.860, 1.380], [-3.700, 1.452], [-3.480, 1.492], [-3.100, 1.500],
    [-1.900, 1.500], [-1.620, 1.502], [-1.500, 1.545], [-1.380, 1.583],
    [-1.150, 1.590], [ 0.600, 1.592], [ 1.150, 1.590], [ 1.400, 1.580],
    [ 1.700, 1.552], [ 2.200, 1.498], [ 2.800, 1.428], [ 3.300, 1.362],
    [ 3.620, 1.322], [ 3.780, 1.300], [ 3.860, 1.288]
]);
// KARIN. Yerden yükseklik doğrulandı: 0.54 ön / 0.48 arka. Uçlarda yanaşma
// ve rampa açısı için hızla kalkıyor.
const Y_TABAN = egriYap([
    [-3.860, 0.640], [-3.660, 0.540], [-3.400, 0.492], [-2.900, 0.480],
    [-1.000, 0.486], [ 1.000, 0.505], [ 2.400, 0.532], [ 3.050, 0.548],
    [ 3.360, 0.582], [ 3.620, 0.700], [ 3.780, 0.842], [ 3.860, 0.900]
]);
// TEKNE yarı genişliği (paletlerin ARASINDA kalan gövde). Palet iç kenarı
// z = 1.0025; tekne 1.000'de bitiyor, arada 2.5 mm hava.
const W_TEKNE = egriYap([
    [-3.860, 0.940], [-3.560, 1.000], [ 3.200, 1.000], [ 3.600, 0.980],
    [ 3.860, 0.920]
]);
// SPONSON alt kenarı — çamurluğun altı. Paletin üst kolu y = 1.155'te
// bittiği için bunun altına inilemez, yoksa çamurluk paletin içine girer.
// ⚠️ ESKİDEN BURUNDA 0.930'A İNİYORDU ve tam bu oluyordu (ölçüldü:
// palet↔gövde 111.76 mm, gergi↔gövde 97.96 mm). Gerçek araçta çamurluk
// hattı boydan boya YATAY (yan fotoğraftan ölçüldü). Etek zırhlarının
// bulunduğu x ∈ [−3.44, +3.36] aralığında BİLEREK TAM SABİT: etek üst
// kenarı 1.300 ve orada çamurluk köşesi kıpırdarsa etek gövdeden çıkar.
const Y_SPON = egriYap([
    [-3.860, 1.302], [-3.500, 1.292], [-1.000, 1.290], [ 1.400, 1.290],
    [ 2.700, 1.290], [ 3.400, 1.288], [ 3.620, 1.262], [ 3.860, 1.240]
]);
// ÜST GÖVDE yarı genişliği. ⚠️ 1.630 → 1.762 (2026-09-04). Eski değerde
// çamurluk kenarı paletin dış yüzüyle (1.6375) aynı hizadaydı ve etek
// zırhı onun 110 mm DIŞINDA, havada başlıyordu — ön bakışta iki ayrı
// levha. Gerçekte etek gövde yanına cıvatalı: tek düzlem, ince basamak.
// Şimdi etek iç yüzü (1.740) gövdenin 22 mm İÇİNDE. Kaynak: "sides of
// hull are flat and vertical (squared)" — bu yüzden burun daralması da
// eteğin BİTTİĞİ yerin (3.36) ilerisine atıldı, yalnız uçta küçük bir pah.
const W_UST = egriYap([
    [-3.860, 1.665], [-3.600, 1.742], [-2.500, 1.762], [ 2.100, 1.762],
    [ 3.100, 1.762], [ 3.450, 1.755], [ 3.650, 1.700], [ 3.860, 1.590]
]);

function govdeKesit(x) {
    const yT = Y_TABAN(x);
    const yC = Math.max(Y_CATI(x), yT + 0.060);
    // Sıra ZORLANIYOR: burunda kesit incecik bir dilime düşüyor ve ham
    // değerler birbirini geçebiliyor; geçseydi kesit kendi üstüne katlanır,
    // loft da düğümlenirdi.
    // ⚠️ SPONSON BASAMAĞI 0.130 → 0.075 (2026-09-04). C köşesi (wT, ySA)
    // paletin İÇ kenarının (z = 1.0025) tam üstünde duruyor; pahlanmış hâli
    // ySA − pah kadar aşağı sarkıyor. Eski değerlerde (ySA = 1.108, pah
    // 0.055) yüzey 1.053'e iniyor, paletin üst kolu ise 1.155'te: ölçülen
    // 37.18 mm'lik gövde→palet batmasının kaynağı buydu. Yeni: ySA = 1.215,
    // pah 0.030 → en alçak nokta 1.185, paletin 30 mm üstünde.
    const ySA = Math.min(Math.max(Y_SPON(x) - 0.075, yT + 0.020), yC - 0.040);
    const ySB = Math.min(Math.max(Y_SPON(x), ySA + 0.020), yC - 0.020);
    const wT = W_TEKNE(x);
    const wU = Math.max(W_UST(x), wT + 0.020);
    const wC = Math.max(wU - 0.075, 0.030);
    return pahliKesit([
        [0,  yT,         0.000, 1],
        [wT, yT,         0.070, 3],
        [wT, ySA,        0.030, 3],
        [wU, ySB,        0.055, 3],
        [wU, yC - 0.070, 0.050, 3],
        [wC, yC,         0.045, 3],
        [0,  yC,         0.000, 1]
    ]);
}

// İstasyonlar KIRILMA YERLERİNDE sık, düz bölümlerde seyrek: motor güvertesi
// basamağı (−1.68..−1.31), glasi başlangıcı (1.08..1.54), burun (3.40..3.86)
// ve kıç (−3.86..−3.42). Düz bölümde kesit neredeyse hiç değişmiyor, sık
// örneklemek yalnız üçgen harcar.
const GOV_IST = [
    -3.860, -3.790, -3.700, -3.610, -3.520, -3.420, -3.280, -3.080,
    -2.750, -2.400, -2.050, -1.780, -1.680, -1.620, -1.560, -1.500,
    -1.440, -1.380, -1.310, -1.150, -0.850, -0.450,  0.000,  0.450,
     0.850,  1.080,  1.190,  1.280,  1.360,  1.440,  1.540,  1.680,
     1.880,  2.120,  2.400,  2.700,  3.000,  3.230,  3.400,  3.530,
     3.630,  3.720,  3.800,  3.860
];
loftKur('govde', GOV_IST, govdeKesit, C_GOVDE, MAL_GOVDE);

// ===========================================================================
// 5. KULE — kesitten loft (ok başı / "Pfeilform" ön zırh)
// ===========================================================================
// Leopard 2A5'ten itibaren kulenin ayırt edici çizgisi budur: iki büyük kama
// zırh modülü tepeden bakışta ÖNE BAKAN BİR OK oluşturuyor ve top namlusu
// tam ucundan çıkıyor. W_KULE'deki 0.360'taki küçük tepe noktası, modüllerin
// kule yanından 4 cm DIŞARI taştığı gerçek basamağı veriyor.
const Y_KULE_UST = egriYap([
    [-2.700, 2.455], [-2.500, 2.480], [-1.500, 2.498], [-1.280, 2.560],
    [-1.120, 2.608], [ 0.200, 2.620], [ 0.420, 2.612], [ 0.700, 2.560],
    [ 1.000, 2.470], [ 1.250, 2.348], [ 1.450, 2.235]
]);
const Y_KULE_ALT = egriYap([
    [-2.700, 1.660], [-2.400, 1.612], [-1.600, 1.600], [-1.300, 1.566],
    [ 0.300, 1.560], [ 0.650, 1.640], [ 1.050, 1.800], [ 1.450, 1.930]
]);
const W_KULE = egriYap([
    [-2.700, 1.145], [-2.480, 1.230], [-1.400, 1.258], [ 0.120, 1.258],
    [ 0.290, 1.262], [ 0.360, 1.300], [ 0.430, 1.284], [ 0.700, 1.020],
    [ 1.000, 0.740], [ 1.250, 0.470], [ 1.450, 0.320]
]);

function kuleKesit(x) {
    const yA = Y_KULE_ALT(x);
    const yU = Math.max(Y_KULE_UST(x), yA + 0.050);
    const w = Math.max(W_KULE(x), 0.040);
    const wC = Math.max(w - 0.060, 0.020);
    return pahliKesit([
        [0,  yA,         0.000, 1],
        [w,  yA,         0.045, 3],
        [w,  yU - 0.060, 0.045, 3],
        [wC, yU,         0.040, 3],
        [0,  yU,         0.000, 1]
    ]);
}

const KULE_IST = [
    -2.700, -2.620, -2.540, -2.450, -2.280, -2.000, -1.700, -1.450,
    -1.340, -1.270, -1.200, -1.140, -1.060, -0.880, -0.560, -0.220,
     0.120,  0.230,  0.290,  0.330,  0.360,  0.395,  0.430,  0.500,
     0.620,  0.780,  0.940,  1.090,  1.220,  1.330,  1.400,  1.450
];
loftKur('taret', KULE_IST, kuleKesit, C_GOVDE, MAL_GOVDE);

// Kule yatağı: kule ile gövde tavanı arasındaki bilezik. GÖVDEYE ait, yani
// _TURRETS listesine GİRMİYOR — kule dönerken altındaki boşluk her açıda
// kapalı kalıyor. (Silindir dönme simetrik olduğu için hangi tarafta durduğu
// görüntüyü değiştirmiyor; gövdede kalması doğru olan.)
(function () {
    const g = new THREE.CylinderGeometry(1.215, 1.248, 0.150, 26, 1, true);
    g.translate(KULE_X, 1.545, 0);
    const m = mesh(g, C_KOYU, { metal: 0.3, rough: 0.75, name: 'taret_yatak' });
    m.material.side = THREE.DoubleSide;
    modelGroup.add(m);
})();

// ===========================================================================
// 6. PALET — kasnak zinciri üzerine sarılmış GERÇEK bant
// ===========================================================================
// ⚠️ Eski modelde palet bir kutu + iki silindir uçtu; yandan "stadyum" gibi
// görünüyordu ama gergi/tahrik ayrımı yoktu ve tekerlere değmiyordu. Burada
// bant, kasnakların DIŞ TEĞET ZARFI olarak hesaplanıyor:
//     d̂·n = (rA − rB)/L   → iki daireye de aynı taraftan teğet birim normal
//     yay yönü saat yönünün TERSİ (alt kol +x, önde yukarı, üst kol −x)
// Zincire yalnız EN ÖN ve EN ARKA yol tekeri giriyor: aradaki beş tekerin
// merkezleri aynı doğruda olduğu için zarfı değiştirmiyorlar. Üst makaralar
// da dışarıda — bandın üst kolunun 5 mm altında duruyorlar, zincire
// sokulsalardı zarf onların üstünden geçmek için gereksiz bir çukur yapardı.
// ==== PALET DONME BASLANGIC ====
// ⚠️ 2026-09-06: bant artık FAZLI. `paletHatti()` sık poligonu ve yay
// uzunluklarını SAKLIYOR; `paletOrnek(faz)` istenen yay ofsetinde bakla
// noktalarını üretiyor. Kapalı eğri aynı kaldığı için bandin ŞEKLİ
// değişmiyor — yalnız baklalar ve kabartma deseni bant boyunca kayıyor.
// Motor her karede `mesh.userData.paletKaydir(yolModelM)` çağırıyor
// (studio-3d.js, teker yuvarlanmasının hemen altında). Üçgen sayısı
// DEĞİŞMİYOR, malzeme `flat` olduğu için normaller de yeniden
// hesaplanmıyor (flat shading normali ekran türevinden üretir).
//
// ⚠️ TESTERE DİŞİ İÇERİ KESİLİR, DIŞARI ÇIKMAZ. Ölçüler:
//   palet üst kolu y = 1.155, sponson altı y = 1.185 → 30 mm boşluk
//   palet alt kolu y = 0.000 → yere değiyor (YOL_Y = R_TEKER + 2*PAL_KAL)
// En kalın bakla PAL_KAL'da bırakılıp incelenler oyuluyor: kutu, yere
// oturma ve çamurluk boşluğu BİREBİR eskisi gibi kalıyor.
//
// PAL_DERZ 7 mm → 34 mm. Gerekçe ölçüldü: haritada 200 px çizilen
// 10.97 m'lik tankta 1 px = 55 mm, yani 7 mm = 0.13 px — hiçbir
// ölçekte görünmüyordu. Kabartmayı görünür yapan şey yer değiştirme
// değil YUZEY NORMALİ: 34 mm'lik diş, 0.1875 m'lik bakla adımında dış
// yüzeyi 10.3° yatırıyor → 50° ışıkta %55 parlaklık farkı.
const PAL_DERZ = 0.034;   // testere dişi derinliği (m) — desen kontrastı
const PAL_PER  = 3;       // desen periyodu (bakla). Bkz. palet_yama.py notu.

function paletHatti() {
    const K = [
        [YOL_X[0], YOL_Y, RB],   // en ön yol tekeri
        [GERGI_X,  UST_Y, RB],   // gergi (ÖNDE)
        [DISLI_X,  UST_Y, RB],   // tahrik dişlisi (ARKADA)
        [YOL_X[6], YOL_Y, RB]    // en arka yol tekeri
    ];
    const n = K.length, N = [];
    for (let i = 0; i < n; i++) {
        const A = K[i], B = K[(i + 1) % n];
        const dx = B[0] - A[0], dy = B[1] - A[1];
        const L = Math.sqrt(dx * dx + dy * dy);
        const ux = dx / L, uy = dy / L;
        const c = (A[2] - B[2]) / L, s = Math.sqrt(Math.max(0, 1 - c * c));
        N.push([ux * c + uy * s, uy * c - ux * s]);
    }
    // Sık örneklenmiş kapalı poligon: yaylar 0.05 rad adımla.
    const kaba = [];
    for (let i = 0; i < n; i++) {
        const C = K[i];
        const nin = N[(i - 1 + n) % n], nout = N[i];
        const a0 = Math.atan2(nin[1], nin[0]);
        let a1 = Math.atan2(nout[1], nout[0]);
        while (a1 < a0) a1 += Math.PI * 2;
        const adim = Math.max(1, Math.ceil((a1 - a0) / 0.05));
        for (let k = 0; k <= adim; k++) {
            const a = a0 + (a1 - a0) * k / adim;
            kaba.push([C[0] + C[2] * Math.cos(a), C[1] + C[2] * Math.sin(a)]);
        }
    }
    // Yay uzunluğuna göre EŞİT ARALIKLI yeniden örnekleme → her örnek bir
    // BAKLA. Bakla sayısı çevreden ÇIKIYOR, uydurulmuyor: Diehl 570F'te
    // palet başına 82 bakla, adım ~0.19 m.
    const cum = [0];
    for (let i = 1; i <= kaba.length; i++) {
        const a = kaba[i - 1], b = kaba[i % kaba.length];
        cum.push(cum[i - 1] + Math.sqrt((b[0] - a[0]) * (b[0] - a[0]) +
                                        (b[1] - a[1]) * (b[1] - a[1])));
    }
    const cevre = cum[kaba.length];
    // ⚠️ Bakla sayısı desen periyodunun KATI olmalı: olmazsa bandin dikis
    // yerinde (i = bakla-1 → 0) desen kırılır ve orada sabit bir çentik
    // durur. 84 zaten 3'ün katı, yani bu tankta sayı değişmiyor.
    const ham = Math.max(60, Math.round(cevre / 0.1875));
    const bakla = PAL_PER * Math.max(20, Math.round(ham / PAL_PER));
    return { kaba: kaba, cum: cum, cevre: cevre, bakla: bakla };
}
const PALET_HAT = paletHatti();

// Yay uzunluğu FAZI kadar ötelenmiş bakla noktaları. `cikti` yeniden
// kullanılan bir dizi (kare başına çöp üretmemek için). Arama artan s
// boyunca tek geçiş: sarma noktasında j sıfırlanıyor, yani O(n+m).
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

function paletKur(ad, z0) {
    const m = PALET_HAT.bakla, HW = PAL_YARI, NS = 6;
    const yol = [];
    for (let i = 0; i < m; i++) yol.push([0, 0]);
    // ⚠️ Float32BufferAttribute KURUCUSU DIZIYI KOPYALAR (three r128:
    // super(new Float32Array(array), ...)). Kendi dizimizi tutup ona
    // yazsaydık GPU'ya giden tamponu hiç değiştirmemiş olurduk; canlı
    // tampon `attr.array`.
    const attr = new THREE.Float32BufferAttribute(new Float32Array(m * NS * 3), 3);
    if (attr.setUsage && THREE.DynamicDrawUsage != null) attr.setUsage(THREE.DynamicDrawUsage);
    const P = attr.array;
    function yaz(faz) {
        paletOrnek(faz, yol);
        for (let i = 0; i < m; i++) {
            const p = yol[i], a = yol[(i - 1 + m) % m], b = yol[(i + 1) % m];
            let tx = b[0] - a[0], ty = b[1] - a[1];
            const L = Math.sqrt(tx * tx + ty * ty) || 1;
            tx /= L; ty /= L;
            const nx = ty, ny = -tx;              // gidiş yönünün SAĞI = DIŞARI
            // Testere dişi: bakla i'nin dış yüzeyi periyot boyunca düzgün
            // iniyor, periyot başında dikine yükseliyor. Yükselen kenar
            // paletin GIDİŞ YÖNÜNÜ de okutuyor (simetrik bir desen yön
            // vermezdi).
            const kal = PAL_KAL - PAL_DERZ * (i % PAL_PER) / (PAL_PER - 1);
            const S = [
                [-HW + 0.045,  kal],
                [ HW - 0.045,  kal],
                [ HW,          kal - 0.034],
                [ HW,         -PAL_KAL],
                [-HW,         -PAL_KAL],
                [-HW,          kal - 0.034]
            ];
            let o = i * NS * 3;
            for (let k = 0; k < NS; k++) {
                const s = S[k];
                P[o++] = p[0] + nx * s[1];
                P[o++] = p[1] + ny * s[1];
                P[o++] = z0 + s[0];
            }
        }
    }
    yaz(0);
    const IDX = [];
    for (let i = 0; i < m; i++) {
        const i2 = (i + 1) % m;
        for (let j = 0; j < NS; j++) {
            const j2 = (j + 1) % NS;
            const a = i * NS + j, b = i * NS + j2;
            const c = i2 * NS + j, d = i2 * NS + j2;
            IDX.push(a, c, d, a, d, b);
        }
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', attr);
    geo.setIndex(IDX);
    geo.computeVertexNormals();
    const par = mesh(geo, C_PALET, Object.assign({ name: ad, flat: true }, MAL_PALET));
    // MOTOR KONTRATI: yolModelM = araç kalkıştan beri kaç MODEL METRESİ
    // ilerledi. İleri giderken bandin ALT kolu gövdeye göre GERİ gitmeli,
    // hat ise artan indekste alt kolda +x'e ilerliyor → faz = -yol.
    par.userData.paletKaydir = function (yolM) {
        yaz(-yolM);
        attr.needsUpdate = true;
    };
    modelGroup.add(par);
}
paletKur('palet_1', TZ);
paletKur('palet_2', -TZ);
// ==== PALET DONME SON ====

// ===========================================================================
// 7. YÜRÜYÜŞ TAKIMI
// ===========================================================================
// ⚠️ GRUP deseni: parça motorun `_WHEELS` listesine giriyor ve motor
// `getObjectByName(ad).rotation.y` yazıyor. Grubun rotation.x'i π/2 olduğu
// için Euler 'XYZ' sırasında matris R = Rx(90°)·Ry(dönüş) oluyor — yani Ry
// ÖNCE ve tekerin KENDİ mili etrafında uygulanıyor, istenen tam bu.
// (Otomobildeki desenin aynısı; mesh olsalardı da dönerlerdi ama grup
// sayesinde iki lastik + göbek BİRLİKTE dönüyor.)
function tekerGrubu(ad, x, y, z, r, lastikGen, aralik) {
    const g = new THREE.Group();
    g.name = ad;
    g.position.set(x, y, z);
    g.rotation.x = Math.PI / 2;
    // Leopard 2'nin yol tekerleri ÇİFT lastikli: ortadaki boşluk paletin
    // kılavuz dişleri için. Tek disk yapmak aracı jenerik bir paletliye
    // düşürürdü.
    const par = [];
    for (const s of [1, -1]) {
        const t = new THREE.CylinderGeometry(r, r, lastikGen, 12);
        t.translate(0, s * aralik, 0);
        par.push(t);
    }
    g.add(mesh(birlestir(par), C_LASTIK, { rough: 0.95, name: ad + '_lastik' }));
    g.add(mesh(new THREE.CylinderGeometry(r * 0.42, r * 0.42, aralik * 2 + lastikGen * 0.6, 9),
               C_CELIK, { metal: 0.45, rough: 0.45, name: ad + '_gobek' }));
    modelGroup.add(g);
}

// Yedi yol tekeri × iki taraf → teker_1..teker_14 (_WHEELS.parts)
for (let i = 0; i < 7; i++) {
    tekerGrubu('teker_' + (i + 1), YOL_X[i], YOL_Y, TZ, R_TEKER, 0.145, 0.155);
    tekerGrubu('teker_' + (i + 8), YOL_X[i], YOL_Y, -TZ, R_TEKER, 0.145, 0.155);
}
// GERGİ TEKERİ — ÖNDE. Yarıçapı bilerek yol tekeriyle AYNI (0.350): motor tek
// bir `_WHEELS.radius` kullanıyor, farklı yarıçaplı bir kasnağı aynı listeye
// koymak onu yolla uyumsuz döndürürdü.
tekerGrubu('gergi_1', GERGI_X, UST_Y, TZ, R_TEKER, 0.130, 0.150);
tekerGrubu('gergi_2', GERGI_X, UST_Y, -TZ, R_TEKER, 0.130, 0.150);

// TAHRİK DİŞLİSİ — ARKADA. 11 diş; adım yarıçapı (0.385+0.315)/2 = 0.350,
// yani yol tekeriyle aynı → aynı `_WHEELS.radius` ile tutarlı dönüyor.
function disliGrubu(ad, z) {
    const g = new THREE.Group();
    g.name = ad;
    g.position.set(DISLI_X, UST_Y, z);
    g.rotation.x = Math.PI / 2;
    const N = 11, ro = 0.385, ri = 0.315, adim = Math.PI * 2 / N, pts = [];
    for (let k = 0; k < N; k++) {
        const a0 = k * adim;
        pts.push([ro * Math.cos(a0 - 0.11), ro * Math.sin(a0 - 0.11)]);
        pts.push([ro * Math.cos(a0 + 0.11), ro * Math.sin(a0 + 0.11)]);
        pts.push([ri * Math.cos(a0 + 0.20), ri * Math.sin(a0 + 0.20)]);
        pts.push([ri * Math.cos(a0 + adim - 0.20), ri * Math.sin(a0 + adim - 0.20)]);
    }
    const sh = new THREE.Shape();
    sh.moveTo(pts[0][0], pts[0][1]);
    for (let i = 1; i < pts.length; i++) sh.lineTo(pts[i][0], pts[i][1]);
    sh.closePath();
    const geo = new THREE.ExtrudeGeometry(sh, { depth: 0.330, bevelEnabled: false });
    geo.rotateX(-Math.PI / 2);
    geo.translate(0, -0.165, 0);
    g.add(mesh(geo, C_CELIK, { metal: 0.45, rough: 0.55, flat: true, name: ad + '_disk' }));
    g.add(mesh(new THREE.CylinderGeometry(0.145, 0.145, 0.360, 9), C_KOYU,
               { metal: 0.4, rough: 0.55, name: ad + '_gobek' }));
    modelGroup.add(g);
}
disliGrubu('disli_1', TZ);
disliGrubu('disli_2', -TZ);

// ÜST MAKARALAR — yanda DÖRT adet (doğrulandı). ⚠️ `_WHEELS` listesine
// GİRMİYORLAR: yarıçapları 0.125, tek bir `radius` değeriyle yol tekeriyle
// aynı açıda döndürülselerdi yolla uyumsuz dönerlerdi. Zaten etek zırhının
// arkasında kalıyorlar.
(function () {
    const par = [];
    for (const z of [TZ, -TZ]) {
        for (const x of MAKARA_X) {
            const g = new THREE.CylinderGeometry(R_MAKARA, R_MAKARA, 0.300, 9);
            g.rotateX(Math.PI / 2);
            g.translate(x, MAKARA_Y, z);
            par.push(g);
        }
    }
    modelGroup.add(mesh(birlestir(par), C_LASTIK, { rough: 0.9, name: 'makara' }));
})();

// ===========================================================================
// 8. ETEK ZIRHLARI — _TINT ikincil rengi
// ===========================================================================
// 2A5'ten itibaren ön yarıdaki etekler AĞIR modüler zırh (kalın, dışa
// basamaklı), arka yarıdakiler ince. Modüller AYRI PLAKA kuruluyor: tek
// levhaya derz çizmek yerine aralarındaki 4 cm boşluk gerçek bir ayrım
// veriyor ve aynı yüzeye oturan panelin derinlik kavgası hiç doğmuyor.
const ETEK_ON = [[2.330, 3.360], [1.330, 2.310], [0.330, 1.310], [-0.670, 0.310]];
const ETEK_ARKA = [[-1.690, -0.690], [-2.660, -1.710], [-3.440, -2.680]];
// ⚠️ ETEK ARTIK GÖVDE KENARINI İZLİYOR (2026-09-04).
//   ETEK_IC = 1.740 ve üst gövde yanı 1.762 → iç yüz 22 mm gövdenin İÇİNDE.
//   Eskiden gövde 1.630'da bitiyordu, yani etek 110 mm havada asılıydı ve
//   gövde burna doğru daraldığı için taşma x = 3.32'de 286.6 mm'ye çıkıyordu
//   (ölçüm: tank_kesisim.js). İç yüzü gövdenin içine sokmak hem boşluğu
//   kapatıyor hem de EŞ DÜZLEM olmadığı için derinlik kavgası doğmuyor.
//   ETEK_UST = 1.300, çamurluk alt köşesi 1.290 → etek fender dudağından
//   sarkıyor; yan fotoğraftan ölçülen gerçek değer 1.266.
//   ETEK_ALT = 0.868 (fotoğraftan 0.848) — yol tekerlerinin tepesi 0.785.
const ETEK_UST   = 1.300;
const ETEK_ALT   = 0.868;
const ETEK_ALT_A = 0.905;
const ETEK_IC    = 1.740;
(function () {
    let k = 0;
    for (const s of [1, -1]) {
        for (const r of ETEK_ON) {
            // En öndeki modülün ön kenarı EĞİK: fotoğrafta (Leo2A6M_li)
            // etek, gergi tekerinin önünde 0.20 m'de 0.32 m yükselerek
            // kesiliyor — paletin ön sarımı açıkta kalsın diye. Eski
            // modeldeki "ön kenarı 15 cm yukarıdan başlat" basamağı bunun
            // kaba bir taklidiydi.
            const onModul = r[1] > 3.2;
            const sh = new THREE.Shape();
            sh.moveTo(r[0] + 0.02, ETEK_ALT);
            sh.lineTo(r[1] - (onModul ? 0.255 : 0.020), ETEK_ALT);
            sh.lineTo(r[1] - 0.020, ETEK_UST);
            sh.lineTo(r[0] + 0.02, ETEK_UST);
            sh.closePath();
            const g = new THREE.ExtrudeGeometry(sh, { depth: 0.110, bevelEnabled: false });
            g.translate(0, 0, s > 0 ? ETEK_IC : -(ETEK_IC + 0.110));
            k++;
            modelGroup.add(mesh(g, C_ETEK, { metal: 0.28, rough: 0.72, flat: true,
                                             name: 'etek_' + k }));
        }
        for (const r of ETEK_ARKA) {
            const sh = new THREE.Shape();
            sh.moveTo(r[0] + 0.02, ETEK_ALT_A);
            sh.lineTo(r[1] - 0.02, ETEK_ALT_A);
            sh.lineTo(r[1] - 0.02, ETEK_UST);
            sh.lineTo(r[0] + 0.02, ETEK_UST);
            sh.closePath();
            const g = new THREE.ExtrudeGeometry(sh, { depth: 0.055, bevelEnabled: false });
            g.translate(0, 0, s > 0 ? ETEK_IC : -(ETEK_IC + 0.055));
            k++;
            modelGroup.add(mesh(g, C_ETEK, { metal: 0.28, rough: 0.74, flat: true,
                                             name: 'etek_' + k }));
        }
    }
})();

// Çamurluk lastikleri: paletin önünde ve arkasında sarkan kauçuk perdeler.
// ⚠️ İlk kurulumda z 1.42..1.82 arasındaydı, yani paletin DIŞ yarısında ve
// y 0.56'ya kadar iniyordu: önden bakışta iki siyah bacak gibi okunuyor,
// tank sanki tekerlekli duruyordu. Perde artık paletin TAMAMINI (z 1.01..1.74)
// örtüyor ve daha kısa — gerçek çamurluk gibi.
// ⚠️ x DEĞİŞTİ (2026-09-04): 3.395..3.470 ve −3.545..−3.470 paletin ÖN/ARKA
// SARIMININ İÇİNDEYDİ (sarımın dış zarfı x = ±3.735'e kadar gidiyor), yani
// perde paletin içinden geçiyordu. Ölçüldü, düzeltildi: perde artık sarımın
// ÖNÜNDE/ARKASINDA — gerçek çamurlukta olduğu gibi.
(function () {
    const par = [];
    for (const s of [1, -1]) {
        par.push(kutuGeo(3.748, 3.818, 0.640, 1.238, s * 1.010, s * 1.740));
        par.push(kutuGeo(-3.818, -3.748, 0.600, 1.238, s * 1.010, s * 1.740));
    }
    modelGroup.add(mesh(birlestir(par), '#2a2d31',
                        { rough: 0.95, flat: true, name: 'camurluk' }));
})();

// ===========================================================================
// 9. GÖVDE ÜSTÜ — motor güvertesi, glasi, arka plaka
// ===========================================================================
// Motor güvertesi y = 1.500'de YATAY, o yüzden ızgaralar ve kapak düz
// kutularla kuruluyor. Hepsinin tabanı gövdenin İÇİNDE (1.462'den başlıyor):
// böylece hiçbir alt yüzey gövdeninkiyle çakışmıyor, z-kavgası doğmuyor.
(function () {
    modelGroup.add(mesh(kutuGeo(-3.060, -1.740, 1.462, 1.535, -0.740, 0.740),
                        C_KOYU, { metal: 0.3, rough: 0.7, flat: true,
                                  name: 'motor_kapak' }));
    const par = [];
    for (const s of [1, -1]) {
        par.push(kutuGeo(-3.140, -1.700, 1.462, 1.512, s * 0.780, s * 1.560));
        for (let i = 0; i < 9; i++) {
            const x = -3.100 + i * 0.155;
            par.push(kutuGeo(x, x + 0.080, 1.500, 1.548, s * 0.800, s * 1.540));
        }
    }
    modelGroup.add(mesh(birlestir(par), C_KARA,
                        { metal: 0.35, rough: 0.6, flat: true, name: 'motor_izgara' }));
    // Arka güverte köşelerindeki alet kutuları. Buraya konuyorlar çünkü
    // kulenin süpürme dairesinin (pivotdan 2.44 m) DIŞINDA kalıyorlar —
    // çamurluk üstüne konsalardı kule 90° döndüğünde bagaj sepeti onların
    // içinden geçerdi.
    for (const [i, s] of [[1, 1], [2, -1]]) {
        modelGroup.add(mesh(kutuGeo(-3.700, -3.180, 1.430, 1.690, s * 0.880, s * 1.560),
                            C_GOVDE,
                            Object.assign({ flat: true, name: 'alet_kutu_' + i }, MAL_GOVDE)));
    }
})();

// Arka plaka: egzoz panjuru, römork kancaları, stop lambaları.
(function () {
    const par = [];
    for (let i = 0; i < 5; i++) {
        const y = 0.760 + i * 0.100;
        par.push(kutuGeo(-3.930, -3.845, y, y + 0.058, -0.760, 0.760));
    }
    modelGroup.add(mesh(birlestir(par), C_KARA,
                        { metal: 0.3, rough: 0.75, flat: true, name: 'egzoz' }));

    const kanca = [];
    for (const s of [1, -1]) {
        kanca.push(kutuGeo(-3.920, -3.800, 0.680, 0.840, s * 0.900, s * 1.120));
        // ⚠️ ÖN çekme kancaları x 3.620..3.800 / y 0.860..1.020'de gövdenin
        // İÇİNDE KALIYORDU: burun yükseltilince o hacim artık gövdeye ait.
        // Gerçekteki yerine, alt ön plakanın üstüne alındı (burun ucundan
        // 7 cm taşıyor; arka kancalar da zaten −3.920'ye taşıyordu).
        kanca.push(kutuGeo(3.845, 3.930, 0.980, 1.140, s * 0.480, s * 0.700));
    }
    modelGroup.add(mesh(birlestir(kanca), C_CELIK,
                        { metal: 0.5, rough: 0.5, flat: true, name: 'cekme' }));

    const lamba = [];
    for (const s of [1, -1]) lamba.push(kutuGeo(-3.900, -3.845, 1.150, 1.290,
                                                s * 1.230, s * 1.430));
    modelGroup.add(mesh(birlestir(lamba), C_STOP,
                        { metal: 0.2, rough: 0.35, name: 'stop' }));
})();

// Glasi üstü: sürücü kapağı ve üç periskobu. Sürücü Leopard 2'de SAĞDA —
// ⚠️ harita aynaladığı için model uzayında SAG (= −z) tarafına yazılıyor.
(function () {
    // Glasi eğimi: iki tavan anahtarından ölçülüyor, göz kararı değil.
    // ⚠️ Glasi yeniden eğimlendiği için buradaki iki sayı da GÜNCELLENDİ;
    // eski değerlerle kapak yüzeyin 15 cm içine gömülürdü.
    const egim = Math.atan2(1.580 - 1.288, 3.860 - 1.400);
    const kap = new THREE.CylinderGeometry(0.310, 0.310, 0.075, 16);
    kap.rotateZ(-egim);                       // eksen glasi normaline dönüyor
    kap.translate(2.480, 1.455, SAG * 0.560);
    modelGroup.add(mesh(kap, C_GOVDE,
                        Object.assign({ flat: true, name: 'surucu_kapak' }, MAL_GOVDE)));
    const par = [];
    for (let i = -1; i <= 1; i++) {
        // Kapağın YEREL çerçevesinde yazılıp sonra glasi eğimine döndürülüyor.
        const b = kutuGeo(0.150, 0.255, 0.032, 0.092, -0.070 + i * 0.190,
                          0.070 + i * 0.190);
        b.rotateZ(-egim);
        b.translate(2.480, 1.455, SAG * 0.560);
        par.push(b);
    }
    modelGroup.add(mesh(birlestir(par), C_CAM,
                        { metal: 0.4, rough: 0.15, name: 'surucu_periskop' }));
})();

// Farlar — iki tarafta, glasinin ön köşesinde (simetrik, ayna sorunu yok).
// ⚠️ y ve z GÜNCELLENDİ (2026-09-04): glasi yükselince eski kutu (1.075..
// 1.315) tamamen yüzeyin altında kalıyordu, yani far görünmez oluyordu.
// Yeni kutu glasinin 3 cm içine oturup 15 cm dışarı çıkıyor; z de üst
// gövde genişleyince kenardan içeri alındı (gerçekte far çamurluk
// köşesinin İÇİNDE, kenara taşmıyor).
(function () {
    const kasa = [], cam = [];
    for (const s of [1, -1]) {
        kasa.push(kutuGeo(3.230, 3.410, 1.315, 1.505, s * 1.290, s * 1.560));
        cam.push(kutuGeo(3.405, 3.443, 1.345, 1.475, s * 1.315, s * 1.535));
    }
    modelGroup.add(mesh(birlestir(kasa), C_KOYU,
                        { metal: 0.3, rough: 0.7, flat: true, name: 'far_kasa' }));
    modelGroup.add(mesh(birlestir(cam), C_FAR,
                        { metal: 0.1, rough: 0.12, name: 'far' }));
})();

// ===========================================================================
// 10. TOP — Rh-120 L/55
// ===========================================================================
// Namlu ekseni y = 2.050; kama zırhın ucu 1.930..2.235 arasında olduğu için
// namlu tam okun ucundan çıkıyor.
(function () {
    // ⚠️ `namlu` TEK MESH ve max.x = NAMLU_UC: motor ağız alevini ve merminin
    // çıkış noktasını bu kutudan okuyor.
    const n = new THREE.CylinderGeometry(0.084, 0.099, NAMLU_UC - 1.150, 16);
    n.rotateZ(-Math.PI / 2);                  // ince uç (+x) = namlu ağzı
    n.translate((NAMLU_UC + 1.150) / 2, NAMLU_Y, 0);
    modelGroup.add(mesh(n, C_CELIK, { metal: 0.45, rough: 0.45, name: 'namlu' }));

    // Isı kılıfı — namlunun ilk yarısını kaplayan kalın kovan. Leopard 2'nin
    // yandan en tanıdık namlu detayı.
    const k = new THREE.CylinderGeometry(0.124, 0.146, 3.350, 14);
    k.rotateZ(-Math.PI / 2);
    k.translate(1.550 + 3.350 / 2, NAMLU_Y, 0);
    modelGroup.add(mesh(k, C_CELIK, { metal: 0.4, rough: 0.55, name: 'namlu_kovan' }));

    // Gaz tahliyecisi (bore evacuator) — namlunun ortasındaki şişkinlik.
    const t = new THREE.CylinderGeometry(0.176, 0.176, 0.620, 14);
    t.rotateZ(-Math.PI / 2);
    t.translate(4.150, NAMLU_Y, 0);
    modelGroup.add(mesh(t, C_CELIK, { metal: 0.4, rough: 0.5, name: 'tahliye' }));

    // ⚠️ SÖZLEŞME ADI KORUNUYOR — ama L/55'te NAMLU FRENİ YOKTUR. `namlu_freni`
    // adı kayıtlı projelerdeki kule listesinde geçtiği için silinemez; parça
    // burada namlu ucundaki GERÇEK bilezik (namlu referans halkası) olarak
    // modellendi ve namlu ağzını 5 mm geçiyor.
    const f = new THREE.CylinderGeometry(0.107, 0.107, 0.230, 14);
    f.rotateZ(-Math.PI / 2);
    f.translate(NAMLU_UC - 0.110, NAMLU_Y, 0);
    modelGroup.add(mesh(f, C_CELIK, { metal: 0.5, rough: 0.4, name: 'namlu_freni' }));

    // Mantlet — kama zırhın ucundaki top yatağı. Kamayı 11 cm geçiyor ki top
    // ağzı bir delik değil, gerçek bir yuva gibi okunsun.
    const par = [kutuGeo(1.180, 1.510, 1.855, 2.265, -0.285, 0.285)];
    const c = new THREE.CylinderGeometry(0.190, 0.205, 0.180, 14);
    c.rotateZ(-Math.PI / 2);
    c.translate(1.560, NAMLU_Y, 0);
    par.push(c);
    modelGroup.add(mesh(birlestir(par), C_GOVDE,
                        Object.assign({ flat: true, name: 'mantle' }, MAL_GOVDE)));
})();

// ===========================================================================
// 11. KULE ÜSTÜ
// ===========================================================================
// Komutan SAĞDA (kapak + PERI RTWL periskobu), yükleyici SOLDA (kapak +
// FLW 200 silah istasyonu), nişancının EMES 15 bakacı sağ önde.
// ⚠️ Hepsi SAG ile yazıldı — harita aynalaması için (devir §5.3).
(function () {
    const kk = new THREE.CylinderGeometry(0.315, 0.315, 0.075, 16);
    kk.translate(-0.980, 2.645, SAG * 0.545);
    modelGroup.add(mesh(kk, C_GOVDE,
                        Object.assign({ flat: true, name: 'kapak' }, MAL_GOVDE)));

    const yk = new THREE.CylinderGeometry(0.290, 0.290, 0.070, 16);
    yk.translate(-0.980, 2.642, -SAG * 0.585);
    modelGroup.add(mesh(yk, C_GOVDE,
                        Object.assign({ flat: true, name: 'kapak_yukleyici' }, MAL_GOVDE)));

    // PERI RTWL — komutan panoramik periskobu. Tepesi 2.980, yani doğrulanmış
    // "silah istasyonuyla ~3.03 m" ölçüsüne oturuyor.
    modelGroup.add(mesh(kutuGeo(-0.640, -0.290, 2.600, 2.980,
                                SAG * 0.380, SAG * 0.720),
                        C_GOVDE, Object.assign({ flat: true, name: 'peri' }, MAL_GOVDE)));
    modelGroup.add(mesh(kutuGeo(-0.302, -0.268, 2.740, 2.910,
                                SAG * 0.420, SAG * 0.680),
                        C_CAM, { metal: 0.45, rough: 0.12, name: 'peri_cam' }));

    // EMES 15 — nişancı ana bakacı, kulenin ön sağ omzunda.
    modelGroup.add(mesh(kutuGeo(0.230, 0.620, 2.560, 2.760,
                                SAG * 0.560, SAG * 0.930),
                        C_GOVDE, Object.assign({ flat: true, name: 'nisangah' }, MAL_GOVDE)));
    modelGroup.add(mesh(kutuGeo(0.618, 0.652, 2.610, 2.730,
                                SAG * 0.610, SAG * 0.880),
                        C_CAM, { metal: 0.45, rough: 0.12, name: 'nisangah_cam' }));

    // FLW 200 uzaktan kumandalı silah istasyonu — yükleyici kapağının üstünde.
    const kaide = new THREE.CylinderGeometry(0.175, 0.205, 0.190, 12);
    kaide.translate(-0.980, 2.740, -SAG * 0.585);
    modelGroup.add(mesh(kaide, C_KOYU,
                        { metal: 0.35, rough: 0.6, flat: true, name: 'rws_kaide' }));
    modelGroup.add(mesh(kutuGeo(-1.180, -0.780, 2.830, 3.075,
                                -SAG * 0.430, -SAG * 0.745),
                        C_KOYU, { metal: 0.35, rough: 0.62, flat: true, name: 'rws' }));
    const mgb = new THREE.CylinderGeometry(0.032, 0.038, 0.620, 8);
    mgb.rotateZ(-Math.PI / 2);
    mgb.translate(-0.520, 2.912, -SAG * 0.585);
    modelGroup.add(mesh(mgb, C_CELIK, { metal: 0.5, rough: 0.45, name: 'mg' }));

    // Sis atarlar — kulenin HER İKİ yanında 8'er adet 76 mm (doğrulandı).
    // Tüpler öne-yukarı-dışa bakıyor; 8 tüp + taban plakası TEK mesh
    // (aynı adlı sekiz mesh olsaydı _applyTint yalnız ilkini boyardı).
    for (const [i, s] of [[1, 1], [2, -1]]) {
        const par = [kutuGeo(-0.240, 0.240, -0.055, 0.010, -0.165, 0.165)];
        for (let r = 0; r < 2; r++) {
            for (let c2 = 0; c2 < 4; c2++) {
                const t = new THREE.CylinderGeometry(0.049, 0.049, 0.270, 7);
                t.translate(-0.165 + c2 * 0.110, 0.150, -0.085 + r * 0.170);
                par.push(t);
            }
        }
        const g = birlestir(par);
        const q = new THREE.Quaternion().setFromUnitVectors(
            new THREE.Vector3(0, 1, 0),
            new THREE.Vector3(0.60, 0.66, s * 0.45).normalize());
        g.applyMatrix4(new THREE.Matrix4().makeRotationFromQuaternion(q));
        g.translate(0.180, 2.290, s * 1.215);
        modelGroup.add(mesh(g, C_KOYU,
                            { metal: 0.3, rough: 0.7, flat: true, name: 'sis_' + i }));
    }

    // Bagaj sepeti (sözleşme adı: sandik) — kule kıçındaki büyük kafes.
    // 2A7'nin en belirgin arka ayrıntısı; çubuklar tek mesh'te birleştirildi.
    const sp = [];
    sp.push(kutuGeo(-3.180, -2.700, 1.760, 1.830, -1.060, 1.060));
    for (const z of [-1.060, 1.060]) sp.push(kutuGeo(-3.180, -2.700, 1.760, 2.420,
                                                     z - 0.035, z + 0.035));
    sp.push(kutuGeo(-3.180, -3.110, 1.760, 2.420, -1.060, -0.980));
    sp.push(kutuGeo(-3.180, -3.110, 1.760, 2.420, 0.980, 1.060));
    for (const y of [2.060, 2.360]) {
        sp.push(kutuGeo(-3.180, -3.110, y - 0.033, y + 0.033, -1.060, 1.060));
        sp.push(kutuGeo(-3.180, -2.700, y - 0.030, y + 0.030, -1.060, -0.980));
        sp.push(kutuGeo(-3.180, -2.700, y - 0.030, y + 0.030, 0.980, 1.060));
    }
    // ⚠️ Arka yüzde yalnız iki YATAY çubuk varken sepet, arkadan bakışta
    // kapkara bir boşluk gibi okunuyordu. Üç DÜŞEY çubuk kafesi tamamlıyor.
    for (const z of [-0.520, 0.000, 0.520]) {
        sp.push(kutuGeo(-3.180, -3.115, 1.790, 2.420, z - 0.030, z + 0.030));
    }
    modelGroup.add(mesh(birlestir(sp), C_GOVDE,
                        Object.assign({ flat: true, name: 'sandik' }, MAL_GOVDE)));

    // Antenler — kule kıçının iki köşesinde. Tepe 3.240; doğrulanmış "genel
    // yükseklik 3.64 m"in altında bırakıldı, daha uzunu harita ölçeğinde
    // görünmez bir kıl olurdu. Eğim ORİJİNDE veriliyor, yoksa rotation.z
    // parçayı kendi tabanı yerine modelin merkezi etrafında savururdu.
    for (const [ad, s] of [['anten', 1], ['anten_2', -1]]) {
        const a = new THREE.CylinderGeometry(0.016, 0.024, 0.760, 6);
        a.translate(0, 0.380, 0);
        a.rotateZ(-s * 0.06);
        a.translate(-2.480, 2.480, s * 0.930);
        modelGroup.add(mesh(a, '#1e1f22', { rough: 0.8, name: ad }));
    }
})();
