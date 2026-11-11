// Balistik füze — uçuş hâlinde, kısa menzilli taktik balistik füze (SRBM).
// Modern Warfare grubunun beşinci modeli.
//
// NEDEN BU MODEL. Gruptaki öbür dokuz model TAŞIYICI: tank, zırhlı SUV, çoklu
// roketatar, askeri kamyon, savaş uçağı, taarruz helikopteri, SİHA, fırkateyn,
// asker. Hiçbiri VURUŞUN KENDİSİNİ göstermiyor. Bu model onu gösteriyor:
// yerden yere geçişte kendi balistik yayını uçuyor — dik kalkış, tepe noktası,
// dik iniş — ve burnu her karede hız vektörünü izliyor.
//
// GERÇEK ÖLÇÜLER. Iskander-M (9M723 / SS-26 "Stone") sınıfı SRBM:
//   boy 7.30 m · çap 0.92 m · fırlatma ağırlığı 3.750 kg · menzil 500 km
//   Kaynak: CSIS Missile Threat, https://missilethreat.csis.org/missile/ss-26-2/
// Kısa/orta menzil taktik füze sınıfının tam ortası; görev tanımındaki
// "boy ~7-11 m, çap ~0.6-1.0 m" aralığına oturuyor.
// ⚠️ KANATÇIK AÇIKLIĞI AÇIK KAYNAKTA YOK. Uydurulmadı, İKİ ÖLÇÜDEN türetildi:
//   1. Model zeminde İKİ ALT KANATÇIĞIN üstünde dursun (X yerleşim, aşağıda):
//      uç yarıçapı × cos45° > gövde yarıçapı (0.460) olmalı.
//   2. Tepeden siluet SİHA'dan da F-16'dan da ayrılsın (aşağıdaki tablo).
//   Seçilen: uç yarıçapı 0.950 → açıklık 1.900 m = 2.07 çap. Alt kanatçık
//   ucu gövde dibinin 0.212 m altında kalıyor.
//   ⚠️ İLK KURULUMDA 0.780 (1.70 çap) idi ve ÖLÇÜLDÜ: X yerleşimde kanatçık
//   HER eksene bakışta cos45 = 0.707 ile kısalıyor, yani 0.780 uç yarıçapı
//   gövdenin (0.460) yalnız 0.091 m dışına taşıyordu — altı bakışın hiçbirinde
//   kanatçık okunmuyordu, dört ince tel gibi duruyordu. 0.950'de taşma
//   0.212 m (gövde çapının %23'ü) ve her bakışta okunuyor.
//
// ⚠️ KANAT YOK. Sette Bayraktar TB2 (siha) ve F-16 (avci-ucagi) var; tepeden
// hiçbiriyle karışmamalı. ÖLÇÜLDÜ (siha_tepe_kiyas.py, ortografik tepe bakışı,
// siluet pikseli sayılarak — sayılar bu dosyanın altındaki ölçüm turunda):
//   model           kutu x·z        siluet en-boy   doluluk
//   siha            6.50 x 12.00        10.99        0.168
//   avci-ucagi     15.09 x 10.00         1.94        0.341
//   balistik-fuze   7.30 x  1.10   ← ölçüm raporda
// Ayrım İKİ sayıda birden: SİHA açıklık-hâkim (en-boy 11), F-16 delta (doluluk
// 0.34), füze BOY-hâkim ve DOLU (ince uzun bir çubuk). Üçü de farklı çeyrekte.
//
// KUTU: x 7.300 · y ~1.103 · z ~1.103  (ölçüldü: ucgen_say.js)
// `sizeKm` max(box.x, box.z)'a bakıyor → burada x HÂKİM (7.300). Davranıştaki
// bütün "kendi boyu" oranları BOYA göre okunur.
//
// YÖN: burun +x, üst +y, taban y=0.
//
// PARÇALAR (Studio3D bu adları arar, DEĞİŞTİRME):
//   govde                          → RENK ALIR (_TINT birincil), '#6b7267'
//   baslik, serit_1, serit_2       → RENK ALIR (_TINT ikincil, 'Nose'), '#9aa09a'
// ⚠️ 'takim' ADLI GRUP YOK, TEKER YOK, _WHEELS SATIRI YOK. Füzenin iniş
// takımı yoktur; yerdeki hâli fırlatma öncesi yatay duruşudur.
//
// ⚠️ YAZI YOK ve ASİMETRİK PARÇA YOK. Harita modeli soldan sağa AYNALIYOR
// (ölçülmüş tuzak, det(projection) < 0). Kanatçıklar dört yönde eşit, kablo
// kanalı üst orta hatta, şeritler halka: aynalama modeli hiç değiştirmiyor.

// ==== FUZE MERKEZ ANCHOR BASLANGIC ====
// ⚠️ ANCHOR TAM MERKEZDE — TABANDA DEĞİL (2026-09-06, Yusuf: "füzenin
// anchor noktası tam merkezde değil, dolayısıyla bazı rotasyonlarda
// konumda kaymış oluyor; dümdüz merkeze koy tam").
// `_centerAndGround` modeli x/z'de ortalar ama TABANINI y=0'a oturtur;
// yani dönme noktası gövdenin ortası değil ALTI oluyordu. Ölçüldü
// (dik_probu.py, 10 açı bileşimi): kutu merkezi anchor'ın her zaman
// 0.6838 model m üstünde ve o ofset MODELLE BİRLİKTE DÖNÜYOR —
// tilt 0'da yukarıda, tilt 90'da 0.684 m GERİDE, tilt -90'da önde;
// yani pitch değiştirilince füze 1.37 model m'ye varan bir yay çizerek
// kayıyordu. `noGround` tabana oturtmayı kapatıyor ve gövde ekseni
// zaten y=0'da kurulduğu için anchor kendiliğinden TAM MERKEZ oluyor
// (ölçülen fark [0, 0, 0]).
// ⚠️ Motorun KENDİ bayrağı, bu model için icat edilmedi: awacs,
// kamikaze-drone, sabit-kanat-iha gibi HAVADAKİ modeller kullanıyor.
// Füze de uçan bir cisim; irtifasını kullanıcı Z (km) ile veriyor.
// ⚠️ KUTU DEĞİŞMİYOR: yalnız grubun y ofseti. maxHoriz = max(x,z) =
// 7.2990 aynı kalıyor, yani haritadaki ölçek de aynı.
modelGroup.userData.noGround = true;
// ==== FUZE MERKEZ ANCHOR SON ====
// ===========================================================================
// 0. RENKLER
// ===========================================================================
// ⚠️ AÇIK RENK PATLAMASI — GÖZ KARARI DEĞİL, ÖLÇÜLDÜ. Sahnede environment map
// yok; difüz bileşen albedo·(1−metalness), yani metalness'i DÜŞÜRMEK açık
// gövdede tam beyaz piksel oranını ARTIRIYOR (uçakta ölçüldü: 0.22 → 0.10
// yapılınca %0.9 → %16.2). SİHA turunda ikinci ders: ölçülen şey TEK RENK
// DEĞİL PALET — tepe bakışında pikselin çoğu gövde değil kaplama olabiliyor.
// Burada gövde ile başlık BİRLİKTE tarandı (parlaklik.py); sonuç bu dosyanın
// ölçüm turunda.
const C_GOVDE   = '#6b7267';   // _TINT birincil — koyu gri-yeşil sevk gövdesi
const C_BASLIK  = '#9aa09a';   // _TINT ikincil — harp başlığı bölümü (açık gri)
const C_SERIT   = '#9aa09a';   // gövdedeki iki işaret şeridi. BAŞLIKLA AYNI
                               // varsayılan: ikinci renk seçilince başlık ve
                               // iki şerit BİRLİKTE değişiyor, yani kullanıcı
                               // tek tıkla füzenin "livery"sini boyuyor.
const C_KAYNAK  = '#5e6459';   // çevresel kaynak/ek yeri halkaları (gövdeden koyu)
const C_KANAT   = '#5f665c';   // kanatçık — gövdeden bir tık koyu. Aynı ton
                               // olsaydı tepeden bakışta kanatçık gövdenin
                               // gölgesine karışırdı (motokaravan/uçak dersi).
const C_KANAT_ON = '#8d9088';  // kanatçık hücum kenarı şeridi: 1.56 m açıklıklı
                               // ince bir yüzeyin siluetini okutan tek işaret.
const C_KANAL   = '#606659';   // kablo kanalı (raceway)
const C_LULE    = '#4a4b4c';   // lüle dış kabuğu (ısıya dayanıklı gri)
const C_LULE_IC = '#191b1d';   // lüle ağzı (koyu oyuk)
const C_METAL   = '#8e9299';   // bilezik/kulp gibi işlenmiş metal
const METAL_MAL = { metal: 0.42, rough: 0.30 };
const C_KOYU    = '#20242a';   // burun bileziği, konnektör, koyu detay
const C_ANTEN   = '#3c4147';

// ===========================================================================
// 1. TEMEL ÖLÇÜLER
// ===========================================================================
const BOY       = 7.300;                 // toplam boy (9M723)
const CAP       = 0.920;                 // gövde çapı
const R_GOV     = CAP / 2;               // 0.460
// ⚠️ X_UC nominal (sivri) burun ucu. Loft ucu 12 mm önce kesiliyor (aşağıda);
// eksik kalan pay X_UC'ye eklendi ki ÖLÇÜLEN kutu x'i tam 7.300 çıksın.
const X_UC      = 3.6645;
const X_TABAN   = X_UC - BOY;            // -3.6365 — lüle ağzı düzlemi
const BURUN_L   = 2.100;                 // teğetsel oj başlık boyu (2.28 çap)
const X_BURUN   = X_UC - BURUN_L;         // 1.5635 — ojun tabanı
const X_KUYRUK  = -2.980;                // kuyruk koniğinin (boat tail) başı
const R_TABAN   = 0.360;                 // taban yarıçapı
const NV        = 21;                    // yarı kesit örneği → halka 2·NV−2 = 40

// Kanatçıklar: X yerleşim (±45°). GEREKÇE ikili:
//   * Zeminde İKİ alt kanatçığın üstünde duruyor; artı (+) yerleşimde tek bir
//     kanatçığın bıçak sırtında dengeleniyordu.
//   * Tepeden DÖRT kanatçık birden görünüyor (her biri cos45 = 0.707 ile
//     kısalmış): 4 × 0.707 = 2.83 kanatçık alanı, artı yerleşimde 2.00.
//     Yani X yerleşim tepeden DAHA ÇOK kanatçık gösteriyor.
const KAN_UC_R  = 0.950;                 // kanatçık ucu yarıçapı → açıklık 1.900
const KAN_KOK_R = 0.300;                 // kök yarıçapı (gövdenin İÇİNDE kalıyor)
const KAN_ACI   = [45, 135, 225, 315];   // X yerleşim
const KAN_KOK_ON = -2.020, KAN_KOK_ARKA = -3.500;   // kök veteri (1.480)
const KAN_UC_ON  = -2.980, KAN_UC_ARKA  = -3.430;   // uç veteri (0.450)
const KAN_KAL_KOK = 0.062, KAN_KAL_UC = 0.034;      // en büyük kalınlık

// ===========================================================================
// 2. GÖVDE PROFİLİ — TEĞETSEL OJ + SİLİNDİR + KUYRUK KONİĞİ
// ===========================================================================
// ⚠️ EXTRUDE KULLANILMADI. ExtrudeGeometry'nin kesiti derinlik boyunca
// SABİTTİR; bu modelde sabit kesitli tek bölüm silindirdir ve o bile iki ucunda
// başka bir şeye dönüşüyor. Otomobilde ölçülmüş ders (devir §3): sabit kesitli
// extrude yığını "ilkokul çizimi" etkisi veriyor. Bütün kütleler LOFT.
//
// TEĞETSEL OJ (tangent ogive) — roket burnunun standart eğrisi. Yarıçapı
//   rho = (R² + L²) / (2R)
// olan bir dairenin yayı; taban dairesine TEĞET geldiği için oj ile silindir
// arasında kırık YOK. Koni denendi ve bırakıldı: konik burun 7.3 m'lik bir
// gövdenin ucunda kalem ucu gibi duruyor, ojun dolgun omzu yok.
const OJ_RHO = (R_GOV * R_GOV + BURUN_L * BURUN_L) / (2 * R_GOV);

function ss(x) { return x <= 0 ? 0 : x >= 1 ? 1 : x * x * (3 - 2 * x); }

// Gövde yarıçapı — x'in tek fonksiyonu (dönel gövde, kesit her yerde DAİRE).
function rGovde(x) {
    if (x >= X_BURUN) {
        const d = X_UC - x;                       // uçtan geriye mesafe
        if (d <= 0) return 0;
        const k = BURUN_L - d;
        const q = OJ_RHO * OJ_RHO - k * k;
        const y = (q > 0 ? Math.sqrt(q) : 0) - (OJ_RHO - R_GOV);
        return y > 0 ? y : 0;
    }
    if (x >= X_KUYRUK) return R_GOV;
    // Kuyruk koniği: düz koni yerine yumuşak S. Düz konide omuz keskin bir
    // halka çizgisi bırakıyor ve alçak bakışta bıçak sırtı gibi parlıyordu.
    return R_GOV + (R_TABAN - R_GOV) * ss((X_KUYRUK - x) / (X_KUYRUK - X_TABAN));
}

// Kesit fonksiyonlarının adları kasten otomobil/SİHA ile AYNI (kesitPar /
// kesitNokta / nokta3 / normal3 / vYukseklik): tezgâhtaki `kesit_olc.js` bu
// dört adı arıyor, ölçüm aracı bu modelde de çalışsın diye.
function kesitPar(x) { const r = rGovde(x); return { ry: r, rz: r, yc: 0 }; }
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
// Sayısal yüzey normali (dışa bakar). Yüzey yamaları bu yönde ötelenir.
function normal3(x, w) {
    const h = 0.004;
    const hx = (x > X_UC - 0.05) ? -h : h;
    const hw = (Math.abs(w) > 0.99) ? -h : h;
    const a = nokta3(x, w), b = nokta3(x + hx, w), c = nokta3(x, w + hw);
    const ux = b[0] - a[0], uy = b[1] - a[1], uz = b[2] - a[2];
    const vx = c[0] - a[0], vy = c[1] - a[1], vz = c[2] - a[2];
    let nx = uy * vz - uz * vy, ny = uz * vx - ux * vz, nz = ux * vy - uy * vx;
    const L = Math.sqrt(nx * nx + ny * ny + nz * nz) || 1;
    nx /= L; ny /= L; nz /= L;
    if (ny * a[1] + nz * a[2] < 0) { nx = -nx; ny = -ny; nz = -nz; }
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
// 3. GENEL LOFT — bu modeldeki BÜTÜN kütleler bundan çıkıyor
// ===========================================================================
// Gövde, başlık, dört kanatçık, kanatçık kök perdeleri, lüle ve kablo kanalı
// aynı makineden geçiyor: sıralı KAPALI halkalar birbirine dikiliyor, iki uç
// yelpaze ile kapanıyor.
//
// ⚠️ SARIM YÖNÜ GÖZLE KOVALANMIYOR, ÖLÇÜLÜYOR: döndürülen/aynalanan
// kopyalarda halka sırası kendiliğinden ters dönüyor. Kapalı kabuğun
// İŞARETLİ HACMİ hesaplanıyor, negatifse bütün üçgenler ters çevriliyor.
// `kapaksiz`: false = iki uç da kapalı · true = ikisi de açık ·
//             'bas' = YALNIZ ilk halkanın kapağı yok.
// ⚠️ KAPAKLAR HER ZAMAN KURULUYOR, sonra istenmeyen SİLİNİYOR. Sebep: sarım
// kararı işaretli HACİMDEN veriliyor ve o hesap ancak KAPALI kabukta doğru.
// Kapağı hiç kurmasaydık açık bir tüpün "hacmi" işaret değiştirebilir ve
// bütün gövde ters sarımla, yani GÖRÜNMEZ çıkardı.
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
    const YAN_SON = IDX.length;
    // Uç kapakları: halka köşeleri KOPYALANIYOR ki computeVertexNormals
    // kapağın normalini yan yüzeyinkiyle ortalamasın (kapak yumuşarsa uç
    // balon gibi görünür — otomobilde ölçülmüş aynı gerekçe).
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
    kapak(halkalar[halkalar.length - 1], true);
    const BAS_KAPAK = IDX.length;
    kapak(halkalar[0], false);
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
    // Sarım kararı verildikten SONRA istenmeyen kapağı at.
    if (kapaksiz === true) IDX.length = YAN_SON;
    else if (kapaksiz === 'bas') IDX.length = BAS_KAPAK;
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.Float32BufferAttribute(P, 3));
    geo.setIndex(IDX);
    geo.computeVertexNormals();
    return geo;
}
function loftKur(ad, halkalar, renk, opts) {
    opts = opts || {};
    const m = mesh(loftGeo(halkalar, opts.kapaksiz), renk, {
        metal: opts.metal == null ? 0.20 : opts.metal,
        rough: opts.rough == null ? 0.66 : opts.rough,
        name: ad, flat: !!opts.flat
    });
    modelGroup.add(m);
    return m;
}

// Dönel gövdenin x istasyonundaki halkası.
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

// ===========================================================================
// 4. GÖVDE VE BAŞLIK — İKİ AYRI KABUK
// ===========================================================================
// ⚠️ AYRILMA HATTINDA İKİ AYRI MESH. Gerçek balistik füzede harp başlığı
// bölümü sevk gövdesinden AYRILIR; modelde de ayrı mesh, çünkü _TINT'in
// İKİNCİ rengi ('Nose') o parçayı boyuyor. Tek mesh olsaydı ikinci renk hiç
// olmazdı — `_applyTint` `getObjectByName` ile PARÇA arıyor, yüz grubu değil.
// ⚠️ İKİSİ DE KAPALI ve UÇ UCA: govde x=1.4500'de kapanıyor, baslik aynı
// düzlemde başlıyor. Bindirme YOK (aynı yüzeyde iki kabuk z-kavgası ederdi);
// birleşme yeri `ayrilma_bilezik` ile örtülüyor.
const X_AYRIM = 1.4500;

// İstasyonlar: ojda SIK (kesit 2.1 m içinde 0.46'dan 0'a iniyor), silindirde
// SEYREK (kesit hiç değişmiyor, sık örneklemek yalnız üçgen harcar), kuyruk
// koniğinde yine SIK.
const IST_GOVDE = (function () {
    const a = [];
    // taban → kuyruk koniği (S eğrisi: 10 istasyon)
    for (let i = 0; i <= 10; i++) a.push(X_TABAN + (X_KUYRUK - X_TABAN) * i / 10);
    // silindir: kanatçık kökü ve şeritlerin olduğu yerde biraz sık
    const duz = [-2.80, -2.55, -2.20, -1.80, -1.30, -0.75, -0.15, 0.45, 0.95, 1.25];
    for (const x of duz) a.push(x);
    a.push(X_AYRIM);
    return a;
})();
// ⚠️ `kapaksiz: 'bas'` — ARKA KAPAK YOK. İlk kurulumda vardı ve ölçüldü:
// gövdenin X_TABAN'daki dolu kapak diski hem taban plakasıyla TAM AYNI
// düzlemdeydi (z-kavgası → tabanın çevresinde benekli halka) hem de
// lülenin içini ARKADAN kapatıyordu. Tabanı artık halka biçimli
// `taban_plaka` kapıyor, ortasındaki delikten lüle görünüyor.
loftKur('govde', IST_GOVDE.map(govdeHalka), C_GOVDE,
        { metal: 0.26, rough: 0.62, kapaksiz: 'bas' });

// Başlık: ayrım düzleminden burun ucuna. Son halka d = 0.012'de (yarıçap
// 5.5 mm) kesiliyor — sıfır yarıçaplı halka dejenere üçgen ve NaN normal
// üretir. Kalan 12 mm'lik pay X_UC sabitine katıldı (yukarı bak).
const IST_BASLIK = (function () {
    const a = [X_AYRIM, 1.5000, X_BURUN];
    // Ojda eşit ADIM değil, eşit YARIÇAP adımı: eğrilik uca doğru artıyor.
    for (let i = 1; i <= 20; i++) {
        const u = i / 20;
        a.push(X_BURUN + BURUN_L * (1 - Math.pow(1 - u, 1.75)));
    }
    a[a.length - 1] = X_UC - 0.012;
    return a;
})();
loftKur('baslik', IST_BASLIK.map(govdeHalka), C_BASLIK, { metal: 0.26, rough: 0.58 });

// ===========================================================================
// 5. GÖVDEYE OTURAN YÜZEY YAMALARI
// ===========================================================================
// Gövde yüzeyi x1..x2 ve w1..w2 aralığında YENİDEN ÖRNEKLENİYOR ve normal
// boyunca `disari` kadar öteleniyor. Düz bir levha olsaydı oj bölgesinde
// yüzeyin içine girerdi.
// Bant biçimi: [x1, x2, w1, w2]  ya da  [x1, x2, y1, y2, taraf] (y YÜKSEKLİK).
// ⚠️ `nx` bandın x, `nw` w yönündeki bölüntüsü; UZUN kenara ÇOK verilir
// (ters verilirse şerit gövdenin kavisini takip edemeyip yüzeyin içine girip
// KAYBOLUYOR — otobüste ölçülmüş tuzak).
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
    // Kalınlıksız paneller GÖLGE DÜŞÜRMEZ: gövdeye 4-8 mm mesafedeler ve
    // gölge haritasında kendi gölgelerini gövdenin üstüne basıp benek (acne)
    // üretiyorlardı (ölçülmüş tuzak, trende de görüldü).
    m.castShadow = false;
    modelGroup.add(m);
    return m;
}

// ---- İKİ İŞARET ŞERİDİ (ikinci renk) --------------------------------------
// Gerçek füzelerde gövdeyi çevreleyen boyalı bantlar vardır (yuvarlanma
// işareti / bölüm ayrımı). Burada işlevleri okunaklılık: 7.3 metrelik tek
// tonlu bir silindir haritada ölçek vermiyor, iki halka onu üçe bölüyor.
// TAM HALKA: w −1..1 kesitin tamamını dolaşıyor.
yuzeyYama('serit_1', [[0.560, 0.760, -1, 1]], 2, 30, 0.005, C_SERIT,
          { metal: 0.16, rough: 0.72 });
yuzeyYama('serit_2', [[-1.760, -1.560, -1, 1]], 2, 30, 0.005, C_SERIT,
          { metal: 0.16, rough: 0.72 });

// ---- ÇEVRESEL KAYNAK / EK YERİ HALKALARI ----------------------------------
// Gövde bölümlerinin birleştiği yerdeki ince koyu çizgiler. Gerçek bir
// gövdede görünen tek şey de zaten kenardaki ince gölgedir.
yuzeyYama('kaynak_1', [[-0.100, -0.060, -1, 1]], 1, 30, 0.003, C_KAYNAK,
          { metal: 0.12, rough: 0.86 });
yuzeyYama('kaynak_2', [[-2.480, -2.440, -1, 1]], 1, 30, 0.003, C_KAYNAK,
          { metal: 0.12, rough: 0.86 });
yuzeyYama('kaynak_3', [[1.070, 1.110, -1, 1]], 1, 30, 0.003, C_KAYNAK,
          { metal: 0.12, rough: 0.86 });
yuzeyYama('kaynak_4', [[2.360, 2.400, -1, 1]], 1, 30, 0.003, C_KAYNAK,
          { metal: 0.12, rough: 0.86 });

// ---- SERVİS KAPAKLARI ------------------------------------------------------
// Aviyonik ve güdüm bölmesi kapakları. Kapı KANADI değil kapı HATTI: gövdeden
// 4 mm dışarıda, gövdeden hafif koyu.
yuzeyYama('kapak_1', [[-0.760, -0.180, 0.30, 0.62]], 6, 5, 0.004, C_KAYNAK,
          { metal: 0.15, rough: 0.72 });
yuzeyYama('kapak_2', [[-0.760, -0.180, -0.62, -0.30]], 6, 5, 0.004, C_KAYNAK,
          { metal: 0.15, rough: 0.72 });
yuzeyYama('kapak_3', [[0.220, 0.520, 0.34, 0.58]], 4, 4, 0.004, C_KAYNAK,
          { metal: 0.15, rough: 0.72 });
yuzeyYama('kapak_4', [[-2.320, -1.980, 0.34, 0.58]], 4, 4, 0.004, C_KAYNAK,
          { metal: 0.15, rough: 0.72 });

// ---- UZUNLAMASINA PANEL DİKİŞLERİ -----------------------------------------
// Gövde boyunca iki ince çizgi. Silindirin dönel simetrisini kırıp yuvarlaklığı
// okutuyorlar: tek tonlu bir tüp alçak bakışta DÜZ görünüyordu.
yuzeyYama('dikis_1', [[-2.930, 1.430, 0.470, 0.494]], 40, 1, 0.003, C_KAYNAK,
          { metal: 0.12, rough: 0.86 });
yuzeyYama('dikis_2', [[-2.930, 1.430, -0.470, -0.494]], 40, 1, 0.003, C_KAYNAK,
          { metal: 0.12, rough: 0.86 });

// ===========================================================================
// 6. KABLO KANALI (raceway) — gövdenin ÜST orta hattında
// ===========================================================================
// Gerçek balistik füzenin en tanıdık dış detayı: başlıktan kuyruğa uzanan,
// kablo demetini taşıyan yarım-oval kanal. Yandan bakışta gövdeye uzunlamasına
// bir sırt veriyor, tepeden bakışta füzenin ekseni okunuyor.
// LOFT: kesit yarı-oval, iki ucunda yatırılmış (havada duran bir çıta gibi
// bitmesin diye).
(function () {
    const X0 = -2.900, X1 = 1.380;
    const GEN = 0.085, YUK = 0.062;          // yarı genişlik / yükseklik
    const N = 30, M = 12;
    const halkalar = [];
    for (let i = 0; i <= N; i++) {
        const u = i / N, x = X0 + (X1 - X0) * u;
        // Uçlarda sönme: 0.18 uzunluğunda yumuşak iniş.
        const s = Math.min(1, ss(u / 0.06)) * Math.min(1, ss((1 - u) / 0.06));
        const rg = rGovde(x);
        const h = [];
        for (let j = 0; j < M; j++) {
            const th = Math.PI * (j / (M - 1));          // 0..pi, yarım oval
            const zz = GEN * s * Math.cos(th);
            const yy = rg - 0.012 + (YUK * s) * Math.sin(th);
            h.push([x, yy, zz]);
        }
        // Kapalı halka: üst yarım oval + gövdeye oturan taban.
        for (let j = M - 2; j >= 1; j--) {
            const th = Math.PI * (j / (M - 1));
            const zz = GEN * s * Math.cos(th);
            h.push([x, Math.sqrt(Math.max(0, rg * rg - zz * zz)) - 0.004, zz]);
        }
        halkalar.push(h);
    }
    loftKur('kablo_kanali', halkalar, C_KANAL, { metal: 0.22, rough: 0.66 });
})();

// ===========================================================================
// 7. KANATÇIKLAR — dört tane, X yerleşim
// ===========================================================================
// ⚠️ KESİT HER ŞEYDİR. 1.56 m açıklıklı, 0.05 m kalınlığında bir yüzeyi
// dikdörtgen kesitle (ya da düz bir kutuyla) yapmak "ilkokul çizimi" etkisi
// veriyor — motosiklette ve SİHA'da ölçülmüş ders. Burada kesit ALTIGEN
// (çift kama): keskin hücum kenarı, kısa düz orta bölüm, keskin firar kenarı.
// Süpersonik bir kanatçığın gerçek kesiti de budur (NACA profili DEĞİL: kamber
// ve yuvarlak hücum kenarı ses altı kanadın işi; balistik füze kanatçığı
// simetrik ve keskindir).
//
// PLANFORM: geriye ok. Hücum kenarı kökte x=−2.020, uçta x=−2.860 →
// süpürme açısı atan(0.960 / 0.650) = 55.9°. Kök veteri 1.480, uç veteri
// 0.450 → sivrilme oranı 0.30.
//
// ⚠️ KÖK GÖVDENİN İÇİNDE. Kök yarıçapı 0.300, gövde yarıçapı 0.460: kanatçık
// gövdenin 0.16 m içinden başlıyor. Yüzeyde bitseydi gövde kavisiyle kanatçık
// düzlemi arasında ışık sızdıran bir aralık kalırdı (kalınlıksız kabuk aks
// doğrultusundan görünmez tuzağının kardeşi).
function kanatKesit(r) {
    const u = (r - KAN_KOK_R) / (KAN_UC_R - KAN_KOK_R);
    const xOn = KAN_KOK_ON + (KAN_UC_ON - KAN_KOK_ON) * u;
    const xArka = KAN_KOK_ARKA + (KAN_UC_ARKA - KAN_KOK_ARKA) * u;
    const c = xOn - xArka;                       // veter (pozitif)
    const t = (KAN_KAL_KOK + (KAN_KAL_UC - KAN_KAL_KOK) * u) / 2;
    // Kesit noktaları (x, z) — z kalınlık yönü. Sıra kapalı halka.
    const p = [];
    const kama = [                                // [veter oranı, kalınlık oranı]
        [0.00, 0.00], [0.05, 0.46], [0.16, 0.86], [0.34, 1.00],
        [0.66, 1.00], [0.88, 0.62], [1.00, 0.14]
    ];
    for (let i = 0; i < kama.length; i++)
        p.push([xOn - c * kama[i][0], t * kama[i][1]]);
    for (let i = kama.length - 2; i >= 1; i--)
        p.push([xOn - c * kama[i][0], -t * kama[i][1]]);
    return p;
}
const KAN_R = [KAN_KOK_R, 0.380, 0.480, 0.590, 0.700, 0.800, 0.890, KAN_UC_R];

KAN_ACI.forEach(function (aci, k) {
    const a = aci * Math.PI / 180, ca = Math.cos(a), sa = Math.sin(a);
    // Kanatçık kanonik çerçevede (+y açıklık, z kalınlık) kurulup x ekseni
    // etrafında `aci` kadar döndürülüyor.
    function don(x, y, z) { return [x, y * ca - z * sa, y * sa + z * ca]; }

    const halkalar = KAN_R.map(function (r) {
        const kes = kanatKesit(r);
        return kes.map(function (q) { return don(q[0], r, q[1]); });
    });
    loftKur('kanatcik_' + (k + 1), halkalar, C_KANAT, { metal: 0.24, rough: 0.58 });

    // Hücum kenarı şeridi: kanatçığın ön kenarı boyunca ince açık bant.
    // Kanatçık siluetini uzaktan okutan tek işaret bu.
    const onH = KAN_R.map(function (r) {
        const kes = kanatKesit(r);
        // ilk üç nokta (burun) + ayna: ince bir kama
        const dilim = [kes[0], kes[1], kes[2], kes[kes.length - 1], kes[kes.length - 2]];
        return dilim.map(function (q) { return don(q[0], r * 1.0006, q[1] * 1.06); });
    });
    loftKur('kanatcik_on_' + (k + 1), onH, C_KANAT_ON,
            { metal: 0.30, rough: 0.40, kapaksiz: false });

    // KÖK PERDESİ (fillet): kanatçığın gövdeye girdiği yerdeki kaplama.
    // Olmasaydı 0.05 m kalınlığındaki bir levha 0.92 m çaplı bir silindire
    // hiçbir geçiş olmadan saplanıyordu.
    (function () {
        const N = 10, halk = [];
        for (let i = 0; i <= N; i++) {
            const u = i / N;
            const r = KAN_KOK_R + (0.470 - KAN_KOK_R) * u;
            const xOn = KAN_KOK_ON + 0.120 * (1 - u) * 0 + 0.140 * (1 - u);
            const xArka = KAN_KOK_ARKA - 0.060 * (1 - u);
            const t = (0.050 + 0.115 * (1 - u) * (1 - u)) / 2;
            const c = xOn - xArka;
            const h = [];
            const kama = [[0.00, 0.10], [0.10, 0.80], [0.40, 1.00],
                          [0.72, 1.00], [0.94, 0.62], [1.00, 0.12]];
            for (let j = 0; j < kama.length; j++)
                h.push(don(xOn - c * kama[j][0], r, t * kama[j][1]));
            for (let j = kama.length - 2; j >= 1; j--)
                h.push(don(xOn - c * kama[j][0], r, -t * kama[j][1]));
            halk.push(h);
        }
        loftKur('kanatcik_kok_' + (k + 1), halk, C_KANAT, { metal: 0.22, rough: 0.64 });
    })();

    // AKTÜATÖR MUHAFAZASI: kanatçık milinin gövde üstündeki kutusu. Gerçek
    // füzede kanatçıklar hareketlidir; tahrik mekanizması gövdenin dışına
    // taşar ve kanatçığın hemen ÖNÜNDE, aynı radyal düzlemde durur.
    // ⚠️ İLK KURULUMDA halka (y, z) İKİSİ DE aynı açının sinüs/kosinüsünden
    // türetiliyordu; kapalı dışbükey bir kesit değil KENDİ İÇİNE DÖNEN bir
    // eğri çıkıyordu ve gövdenin üstünde bıçak gibi koyu bir diken
    // görünüyordu (altı bakışta yakalandı). Doğrusu kablo kanalıyla AYNI
    // desen: üstte yarım oval, altta gövde yüzeyine oturan taban.
    (function () {
        const X0 = -2.420, X1 = -1.680;
        const GEN = 0.078, YUK = 0.058, N = 16, M = 11;
        const halk = [];
        for (let i = 0; i <= N; i++) {
            const u = i / N, x = X0 + (X1 - X0) * u;
            // Uçlarda sönüyor ama SIFIRA İNMİYOR: sıfır halka dejenere üçgen
            // ve NaN normal üretir.
            const sy = 0.10 + 0.90 * ss(Math.min(1, u / 0.20)) *
                              ss(Math.min(1, (1 - u) / 0.34));
            const rg = rGovde(x), h = [];
            for (let j = 0; j < M; j++) {
                const th = Math.PI * j / (M - 1);
                h.push(don(x, rg - 0.010 + YUK * sy * Math.sin(th),
                           GEN * sy * Math.cos(th)));
            }
            for (let j = M - 2; j >= 1; j--) {
                const th = Math.PI * j / (M - 1);
                const zz = GEN * sy * Math.cos(th);
                h.push(don(x, Math.sqrt(Math.max(0, rg * rg - zz * zz)) - 0.006, zz));
            }
            halk.push(h);
        }
        loftKur('aktuator_' + (k + 1), halk, C_KANAL, { metal: 0.24, rough: 0.62 });
    })();
});

// ===========================================================================
// 8. KUYRUK: TABAN PLAKASI + LÜLE
// ===========================================================================
// ⚠️ HALKA DİLİMİ / KAPALI KABUK, kısmi silindir DEĞİL. Kalınlıksız kabuk aks
// doğrultusundan bakınca saç teli inceliğine düşüp kayboluyor (bisiklet
// çamurluğunda ölçülmüş tuzak). Lülenin dışı ve içi AYRI iki kabuk.
(function () {
    // Taban plakası: kuyruk koniğinin ucunu kapatan HALKA.
    // ⚠️ İLK KURULUMDA DOLU SİLİNDİRDİ ve ölçüldü: lülenin tamamını
    // ÖRTÜYORDU. Lüle gömük (submerged, aşağıya bak), yani taban düzleminin
    // GERİSİNDE; önüne konan dolu disk arkadan bakışta koca bir koyu daireden
    // başka bir şey bırakmıyordu. Doğrusu delikli şekil + extrude.
    // ⚠️ `bevelEnabled: false` ŞART — THREE'nin bevelSize'ı konturu DIŞARI
    // iter (motokaravanda ölçülmüş tuzak) ve halkanın deliğini kapatırdı.
    (function () {
        const sh = new THREE.Shape();
        sh.absarc(0, 0, R_TABAN + 0.0015, 0, Math.PI * 2, false);
        const delik = new THREE.Path();
        delik.absarc(0, 0, 0.272, 0, Math.PI * 2, true);
        sh.holes.push(delik);
        const gt = new THREE.ExtrudeGeometry(sh, {
            depth: 0.030, bevelEnabled: false, curveSegments: 40
        });
        gt.rotateY(Math.PI / 2);
        gt.translate(X_TABAN, 0, 0);
        modelGroup.add(mesh(gt, C_LULE, { metal: 0.34, rough: 0.52,
                                          name: 'taban_plaka' }));
    })();

    // Lüle: taban düzleminden İÇERİ doğru daralan çan. Model boyu 7.300'de
    // kalsın diye lüle DIŞARI taşmıyor, GÖMÜK (submerged) — katı yakıtlı
    // SRBM'lerde de böyledir.
    // ⚠️ TEK KABUK + DoubleSide. İlk kurulumda iç ve dış İKİ KAPALI koni
    // vardı; içtekinin derin uçtaki YELPAZE kapağı (24 üçgen tek noktada)
    // 3/4 arka bakışta koyu oyuğun içinde ışın ışın parlıyordu. Doğrusu
    // kapaksız tek koni: dışarıdan bakan onun İÇ yüzeyini görüyor, boğaz
    // ayrı bir düz disk ile kapanıyor.
    const N = 12, kabuk = [];
    for (let i = 0; i <= N; i++) {
        const u = i / N;
        const x = X_TABAN + 0.030 + 0.280 * u;
        const r = 0.276 - 0.126 * ss(u);            // ağız 0.276 → boğaz 0.150
        const h = [];
        for (let j = 0; j < 26; j++) {
            const th = 2 * Math.PI * j / 26;
            h.push([x, r * Math.cos(th), r * Math.sin(th)]);
        }
        kabuk.push(h);
    }
    const ml_ = loftKur('lule_dis', kabuk, C_LULE, { metal: 0.40, rough: 0.44,
                                                     kapaksiz: true });
    ml_.material.side = THREE.DoubleSide;

    // Boğaz kapağı: koninin dip düzlemini kapatan koyu disk.
    const gi = new THREE.CircleGeometry(0.152, 26);
    gi.rotateY(-Math.PI / 2);
    gi.translate(X_TABAN + 0.312, 0, 0);
    const mi = mesh(gi, C_LULE_IC, { metal: 0.08, rough: 0.94, name: 'lule_ic' });
    mi.material.side = THREE.DoubleSide;
    modelGroup.add(mi);

    // Lüle bileziği: ağzın 5 cm içindeki işlenmiş yaka. Taban düzleminde
    // duran bir simit DENENDİ VE BIRAKILDI: plakanın delik kenarıyla eş
    // merkezli olduğu için z-kavgasına giriyor ve tabanın çevresini benekli
    // gösteriyordu (yukarıdaki kapak sorunuyla birlikte ölçüldü).
    const gb = new THREE.CylinderGeometry(0.262, 0.262, 0.036, 30, 1, true);
    gb.rotateZ(Math.PI / 2);
    gb.translate(X_TABAN + 0.062, 0, 0);
    const mb = mesh(gb, C_METAL, Object.assign({ name: 'lule_bilezik' }, METAL_MAL));
    mb.material.side = THREE.DoubleSide;
    modelGroup.add(mb);

    // Kuyruk halkası: kuyruk koniğinin omzundaki takviye bileziği.
    const gh = new THREE.TorusGeometry(rGovde(X_KUYRUK + 0.02) + 0.010, 0.018, 8, 30);
    gh.rotateY(Math.PI / 2);
    gh.translate(X_KUYRUK + 0.02, 0, 0);
    modelGroup.add(mesh(gh, C_KAYNAK, { metal: 0.2, rough: 0.75, name: 'kuyruk_halka' }));
})();

// ===========================================================================
// 9. AYRILMA BİLEZİĞİ + BURUN UCU
// ===========================================================================
(function () {
    // Başlık ile gövdenin birleştiği yerdeki ayrılma bileziği: iki kabuğun
    // uç uca geldiği düzlemi örtüyor.
    const g = new THREE.CylinderGeometry(R_GOV + 0.014, R_GOV + 0.014, 0.070, 32, 1, true);
    g.rotateZ(Math.PI / 2);
    g.translate(X_AYRIM, 0, 0);
    const m = mesh(g, C_METAL, Object.assign({ name: 'ayrilma_bilezik' }, METAL_MAL));
    m.material.side = THREE.DoubleSide;
    modelGroup.add(m);

    // Bileziğin iki yanındaki ince koyu kaynak çizgileri.
    [X_AYRIM - 0.048, X_AYRIM + 0.048].forEach(function (x, i) {
        const gg = new THREE.TorusGeometry(rGovde(x) + 0.006, 0.010, 6, 30);
        gg.rotateY(Math.PI / 2);
        gg.translate(x, 0, 0);
        modelGroup.add(mesh(gg, C_KAYNAK, { metal: 0.1, rough: 0.9,
                                            name: 'ayrilma_kaynak_' + (i + 1) }));
    });

    // BURUN UCU: ojun kesildiği yerdeki küçük küre — hem kesme izini örtüyor
    // hem gerçek bir küt uç veriyor. Ölçüldü: kutu x'e katkısı 0.000
    // (küre X_UC−0.012'de merkezli, yarıçapı 0.011 → en ileri nokta X_UC−0.001).
    const gu = new THREE.SphereGeometry(0.011, 10, 8);
    gu.translate(X_UC - 0.012, 0, 0);
    modelGroup.add(mesh(gu, C_KOYU, { metal: 0.3, rough: 0.45, name: 'burun_ucu' }));

    // Burun bileziği: başlığın ucundaki koyu bant (tapa/burun konisi ayrımı).
    const gk = new THREE.CylinderGeometry(rGovde(3.010) + 0.004, rGovde(3.120) + 0.004,
                                          0.110, 26, 1, true);
    gk.rotateZ(Math.PI / 2);
    gk.translate(3.065, 0, 0);
    const mk = mesh(gk, C_KOYU, { metal: 0.28, rough: 0.42, name: 'burun_bilezik' });
    mk.material.side = THREE.DoubleSide;
    modelGroup.add(mk);
})();

// ===========================================================================
// 10. KÜÇÜK PARÇALAR
// ===========================================================================
// Konformal anten çıtaları: gövdenin yanlarında, telemetri antenleri.
[[0.980, 0.640], [-0.320, 0.640], [-1.180, 0.640]].forEach(function (p, i) {
    const g = new THREE.BoxGeometry(0.300, 0.016, 0.070);
    const w = p[1];
    const q = nokta3(p[0], w), n = normal3(p[0], w);
    g.translate(0, 0, 0);
    const m = mesh(g, C_ANTEN, { metal: 0.2, rough: 0.55, name: 'anten_' + (i + 1) });
    m.position.set(q[0] + n[0] * 0.010, q[1] + n[1] * 0.010, q[2] + n[2] * 0.010);
    m.rotation.x = Math.atan2(q[2], q[1]) * -1 + Math.PI / 2;
    modelGroup.add(m);
    // Simetrik eşi (−z tarafı): aynalama modeli değiştirmesin diye ŞART.
    const m2 = mesh(g.clone(), C_ANTEN, { metal: 0.2, rough: 0.55,
                                          name: 'anten_' + (i + 4) });
    const q2 = nokta3(p[0], -w), n2 = normal3(p[0], -w);
    m2.position.set(q2[0] + n2[0] * 0.010, q2[1] + n2[1] * 0.010, q2[2] + n2[2] * 0.010);
    m2.rotation.x = Math.atan2(q2[2], q2[1]) * -1 + Math.PI / 2;
    modelGroup.add(m2);
});

// Göbek bağı (umbilical) konnektörü: gövdenin altında, fırlatmadan önce
// aracın kablosunun bağlandığı kapak. ALTA konuldu ki tepeden bakışta
// simetriyi bozmasın.
(function () {
    const g = new THREE.BoxGeometry(0.190, 0.055, 0.130);
    const w = 0.92;
    const q = nokta3(-0.900, w), n = normal3(-0.900, w);
    const m = mesh(g, C_KOYU, { metal: 0.3, rough: 0.5, name: 'gobek_bagi' });
    m.position.set(q[0] + n[0] * 0.020, q[1] + n[1] * 0.020, q[2] + n[2] * 0.020);
    modelGroup.add(m);
    const q2 = nokta3(-0.900, -w), n2 = normal3(-0.900, -w);
    const m2 = mesh(g.clone(), C_KOYU, { metal: 0.3, rough: 0.5, name: 'gobek_bagi_2' });
    m2.position.set(q2[0] + n2[0] * 0.020, q2[1] + n2[1] * 0.020, q2[2] + n2[2] * 0.020);
    modelGroup.add(m2);
})();

// Kaldırma kulakları: gövdenin üstünde, vinçle taşımak için. Dört tane,
// ikişer ikişer simetrik.
[[1.180, 1], [1.180, -1], [-2.040, 1], [-2.040, -1]].forEach(function (p, i) {
    const g = new THREE.TorusGeometry(0.042, 0.011, 6, 12, Math.PI);
    const w = p[1] * 0.22;
    const q = nokta3(p[0], w), n = normal3(p[0], w);
    g.rotateY(Math.PI / 2);
    const m = mesh(g, C_KAYNAK, { metal: 0.22, rough: 0.55,
                                  name: 'kaldirma_kulak_' + (i + 1) });
    m.position.set(q[0] + n[0] * 0.004, q[1] + n[1] * 0.004, q[2] + n[2] * 0.004);
    m.rotation.z = Math.atan2(n[1], n[0]) - Math.PI / 2;
    modelGroup.add(m);
});
