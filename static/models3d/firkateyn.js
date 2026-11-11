// Fırkateyn — modern stealth fırkateyn, TCG İSTANBUL (F-515) / İ sınıfı.
// Modern Warfare temasının dokuzuncu modeli.
//
// ÖLÇÜLERİN KAYNAĞI (ezberden değil, iki bağımsız kaynaktan doğrulandı):
//   en.wikipedia.org/wiki/Istanbul-class_frigate  ve
//   en.wikipedia.org/wiki/TCG_Istanbul_(F_515)
//     tam boy 113.2 m · genişlik 14.40 m · su çekimi 4.05 m · 3.100 ton
//     1 x 76 mm OTO Melara Super Rapid (baş güvertede)
//     16 hücreli MiDLAS dikey fırlatma sistemi (topun hemen kıçında)
//     16 x ATMACA gemisavar (dörtlü kapsüllerde, orta gövdede)
//     1 x 35 mm ASELSAN GÖKDENİZ CIWS (hangar çatısında, KIÇA bakar)
//     uçuş güvertesi + hangar (S-70B Seahawk), 2 x RHIB
//     CENK-S AESA arama radarı: DÖNEN antenli (bu yüzden spin var)
//   usni.org (Proceedings, Ekim 2024) ve navalnews: "radar kesiti
//     küçültülmüş" — akustik/kızılötesi/manyetik imza da.
//
// MODELDE 1 birim = 1 GERÇEK METRE.
// YÖN: pruva +x, üst +y, taban y=0 (OMURGA). Su hattı y=4.05 -- yani
// teknenin su altı kısmı da modelde, tıpkı yolcu-gemisi gibi.
// KUTU (ÖLÇÜLDÜ): 113.200 x 31.940 x 14.400.  88 mesh / 11122 üçgen /
// 1 spinner (dönen arama radarı). Aynı adlı mesh YOK.
// ÖLÇÜLEN AÇILAR: tumblehome orta gövdede 12.9-13.6 derece (tepe 13.60,
// x=-20'de), baş bodoslama düşeyden 32.0 derece öne eğik (su hattındaki
// en ön nokta x=51.00, güverte hizasındaki x=56.60).
//
// ===========================================================================
// SİVİL YOLCU GEMİSİNDEN NEREDE AYRIŞIYOR (tepeden karışmama şartı)
// ===========================================================================
// Kruvaziyer (yolcu-gemisi) 160 x 24.0 m, tepeden bakınca gövdenin
// neredeyse tamamı BEYAZ üst yapı; kimliği kat kat balkon, filika sırası
// ve havuz veriyor. Fırkateyn onun tam tersine kuruldu:
//   1. ORAN. 113.2 / 14.40 = 7.86 narinlik; kruvaziyerde 160 / 24.0 = 6.67.
//      Fırkateyn hem daha kısa hem ORANTILI OLARAK daha ince.
//   2. KESİT. Kruvaziyerin bordası su hattından güverteye DIŞA açılıyor
//      (flare, baş dalgasını dışarı atmak için). Fırkateynin bordası
//      su hattının hemen üstündeki KNUCKLE'dan sonra İÇE eğiliyor
//      (tumblehome, orta gövdede ÖLÇÜLDÜ: 12.9-13.6 derece) — RCS'i düşüren
//      tek en belirgin çizgi bu ve kesitten loft olmadan ÜRETİLEMEZ.
//   3. ÜST YAPI. Kruvaziyerde yedi kat düz DİKEY beyaz duvar. Burada üç
//      kademe ve hepsi KESİK PİRAMİT: duvarlar içe eğimli, uçlar pahlı.
//      Aynı gerekçe (RCS) hem tekneye hem üst yapıya uygulanıyor.
//   4. TEPEDEN OKUNAN LEKELER. Kruvaziyerde ortada MAVİ dikdörtgen havuz.
//      Burada kıç yarının tamamı boş KOYU uçuş güvertesi ve ortasında
//      AÇIK BİR DAİRE (helikopter dairesi). Kruvaziyerin yorumunda
//      "askerî gemilerin helikopter dairesiyle karışmasın diye havuz
//      DİKDÖRTGEN ve mavi" yazıyor — ayrım burada bilerek karşılıklı.
//   5. TEK TON. Kruvaziyeri kruvaziyer yapan koyu tekne + beyaz üst yapı
//      ikilisi. Fırkateyn baştan sona TEK savaş grisi; ikinci renk yalnız
//      GÜVERTELER (yatay yüzeyler), yani siluet tek parça okunuyor.
//   6. SİLAH VAR, FİLİKA YOK. Baş güvertede top kulesi, arkasında 16
//      hücreli VLS, orta gövdede eğik ATMACA kapsülleri, hangar çatısında
//      CIWS, kapalı direkte DÖNEN radar.
//
// ===========================================================================
// PARÇALAR (Studio3D bu adları arar, DEĞİŞTİRME)
// ===========================================================================
//   govde, ust_01/02/03, hangar, baca, direk_alt/ust, kopru_kanat_*,
//   dalga_kiran, vls_kaide, taret, taret_ust   -> BİRİNCİL renk (savaş grisi)
//   guverte, ucus_guverte, *_cati              -> İKİNCİL renk ('Decks')
//   taret + taret_ust + namlu + namlu_agiz     -> _TURRETS grubu, pivot [37, 0]
//   radar_anten                                -> spin() grubunun içinde
// ⚠️ AYNI ADLI İKİ MESH YAPMA: _applyTint getObjectByName kullanıyor,
//    yalnız İLKİ renk alır (ölçülmüş tuzak).

// ===========================================================================
// 0. RENKLER
// ===========================================================================
// ⚠️ YATAY YÜZEY DÜŞEY YÜZEYDEN KOYU. Haritanın ana bakışı tepeden,
// motorun ışığı yukarıdan: yatay yüzeyler ışığın tamamını alıyor.
// Motokaravanda (#d5d1c6 çatı tepeden TAM BEYAZ) ve uçakta ölçülmüştü.
// Burada güverteler üst yapı duvarından bilerek 2-3 kademe koyu.
// ⚠️ metalness 0.85+ neredeyse SİYAH (environment map yok); ama
// metalness'i DÜŞÜRMEK de açık renkte patlamayı ARTIRIYOR
// (difüz = albedo x (1-metalness)). Gri gövdede 0.18-0.30 aralığı.
const C_GOVDE   = '#6e7681';   // tekne + üst yapı (BİRİNCİL renk varsayılanı)
const C_UST     = '#79818c';   // üst yapı duvarı (DÜŞEY -- bir tık açık)
const C_GUV     = '#4f5760';   // ana güverte (YATAY, İKİNCİL renk varsayılanı)
const C_UCUS    = '#3f464e';   // uçuş güvertesi (YATAY, en koyu)
// ⚠️ #c3c7c9 DEĞİL. Palet taraması (firkateyn_palet_tara.py sucbulma)
// tam beyaz piksellerin %100'ünün TEK BAŞINA bu sabitten geldiğini
// gösterdi -- F-16'daki desenin aynısı (orada %85'ti). Eşik keskin:
// #aab0b4'te hâlâ 1028 tam beyaz piksel var, #9ba1a5'te 0. Parlak
// (L>230) piksel sayısı ÜÇÜNDE DE 1040, yani daire hâlâ geminin en
// parlak lekesi; yalnız kırpmayı bıraktı.
const C_CIZGI   = '#9ba1a5';   // helikopter dairesi ve güverte çizgileri
const C_CAM     = '#161c23';   // köprüüstü camı
const C_KOYU    = '#2c323a';   // oyuk, ızgara, kapı, egzoz ağzı
const C_SU_HAT  = '#23272c';   // su hattı bandı (boot top)
const C_KARINA  = '#5e332c';   // su altı zehirli boyası (anti-fouling)
// ⚠️ C_KOPUK ('#666f7c') KALDIRILDI — köpük şeridinin kendisi
//    kaldırıldı, gerekçesi ve ölçümü §7'de. Renk seçilirken ölçülen
//    süpürme burada kalsın, çünkü asıl dersi veriyor: levha YATAY olduğu
//    için hex koyulaştıkça bile parlak kalıyordu.
//      #7d8894 -> L241 · #6f7a86 -> 219 · #666f7c -> 202 · #57616c -> 177
//    (aynı karede gövde L=120-135). Yani rengi koyulatmak kusuru çözmüyor,
//    çözen tek şey levhanın kendisini kaldırmak.
const C_MUHIM   = '#5c646d';   // ATMACA kapsülleri, torpido kovanları
const C_BOT     = '#39404a';   // RHIB
const C_KROM    = '#aeb6bf';   // anten, korkuluk
const KROM_MAL  = { metal: 0.42, rough: 0.30 };
const C_PERVANE = '#9a8b63';   // bronz pervane

// ===========================================================================
// 1. TEMEL ÖLÇÜLER (hepsi gerçek metre, kaynak yukarıda)
// ===========================================================================
const UZUN    = 56.60;   // yarı boy -> 113.2 m
const YARI_EN =  7.20;   // yarı genişlik -> 14.40 m
const SU      =  4.05;   // su çekimi -> su hattının y'si
const GUV_ORTA = 9.70;   // orta gövdede güverte kenarı (freeboard 5.65 m)
const D01     = 9.90;    // 01 güvertesi (üst yapının oturduğu kot)
const D02     = 12.60;
const D03     = 15.20;   // köprüüstü güvertesi
const KOPRU_UST = 17.90; // köprü çatısı
const DIREK_TEPE = 30.40;
const TEPE    = 32.00;   // modelin en yüksek noktası (radar mili)
const TARET_X = 37.00;   // 76 mm topun dönme ekseni (_TURRETS pivotu)

// ===========================================================================
// 2. MONOTON KÜBİK EĞRİ (PCHIP)
// ===========================================================================
// otomobil.js/yolcu-gemisi.js'ten. Catmull-Rom BIRAKILMIŞTI: eğim çok
// değişen yerlerde taşma yapıp çizgiyi komşusunun üstüne tümsek attırıyor.
// Burada kritik: pruva bölgesinde yarı genişlik 12 metrede 4.05'ten
// 0.18'e iniyor, taşan bir eğri tekneyi dışa şişirir ve kutu bozulur.
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

// ---- teknenin uzunlamasına çizgileri --------------------------------------
// KNUCKLE YARI GENİŞLİĞİ — kesitin EN GENİŞ noktası, yani geminin
// genişliğini bu eğri tanımlıyor (tepe 7.20 = 14.40 m). Kruvaziyerde en
// geniş nokta GÜVERTE KENARI idi; burada su hattının 1.4 m üstündeki
// kırım hattı. Aradaki fark tumblehome'un ta kendisi.
const W_KNK = egriYap([
    [-56.6, 6.35], [-54.0, 6.66], [-50.0, 6.95], [-44.0, 7.12],
    [-34.0, 7.20], [ -6.0, 7.20], [  6.0, 7.18], [ 16.0, 7.05],
    [ 26.0, 6.70], [ 34.0, 6.10], [ 40.0, 5.20], [ 45.0, 4.05],
    [ 49.0, 2.80], [ 52.0, 1.70], [ 54.5, 0.90], [ 56.0, 0.40],
    [ 56.6, 0.18]
]);
// KNUCKLE YÜKSEKLİĞİ. Su hattının (4.05) hemen üstünde; başa doğru
// sheer ile birlikte yükseliyor.
const Y_KNK = egriYap([
    [-56.6, 5.15], [-40.0, 5.25], [-10.0, 5.35], [ 10.0, 5.55],
    [ 26.0, 6.10], [ 38.0, 7.30], [ 46.0, 9.00], [ 52.0, 11.00],
    [ 56.6, 12.60]
]);
// GÜVERTE KENARI YÜKSEKLİĞİ (SHEER). Kıçta 9.10, ortada 9.70, pruvada
// 13.00 -> baş tarafta 8.95 m freeboard. Kruvaziyerde bu çizgi tamamen
// DÜZDÜ (GUVERTE = 17.0 sabit); fırkateynin yandan silueti sheer'den
// çıkıyor ve güverte levhası da bu eğriyi izlemek zorunda (bkz. §5).
const Y_GUV = egriYap([
    [-56.6, 9.10], [-30.0, 9.30], [  0.0, 9.70], [ 24.0, 10.40],
    [ 40.0, 11.40], [ 50.0, 12.30], [ 56.6, 13.00]
]);
// TUMBLEHOME — güverte kenarının knuckle'dan NE KADAR içeride olduğu.
// Orta gövdede 1.00 m. ÖLÇÜLDÜ (kesit parametrelerinden, aci =
// atan((wN-wD)/(yD-yN))): x=-40'ta 13.06, x=-20'de 13.60, x=0'da 13.16,
// x=+10'da 12.87, x=+30'da 11.38 derece. Uçlarda sıfıra iniyor (orada
// zaten genişlik yok).
const TUMBLE = egriYap([
    [-56.6, 0.55], [-40.0, 0.92], [-10.0, 1.00], [ 10.0, 1.00],
    [ 26.0, 0.92], [ 38.0, 0.70], [ 46.0, 0.40], [ 52.0, 0.16],
    [ 56.6, 0.03]
]);
// OMURGA (kesitin en alt noktası). Ortada 0 = modelin tabanı.
// ⚠️ PRUVA BURADAN ÇIKIYOR, ayrı bir bodoslama parçası YOK. ÖLÇÜLDÜ
// (ikili aramayla Y_OMURGA(x) = SU çözülerek): teknenin su hattındaki
// en ön noktası x=51.00, güverte hizasındaki x=56.60; yatay 5.60 m,
// düşey 8.95 m -> baş bodoslama düşeyden 32.0 derece ÖNE EĞİK.
// Kıçta omurga 2.85'e çıkıyor ve orada transom DÜZ kesiliyor.
const Y_OMURGA = egriYap([
    [-56.6, 2.85], [-53.0, 1.70], [-48.0, 0.70], [-42.0, 0.18],
    [-30.0, 0.00], [  8.0, 0.00], [ 22.0, 0.10], [ 32.0, 0.45],
    [ 40.0, 1.20], [ 46.0, 2.35], [ 50.0, 3.55], [ 52.5, 5.10],
    [ 54.5, 7.40], [ 55.8, 9.60], [ 56.6, 11.20]
]);
// DÜZ DİP YARI GENİŞLİĞİ. Ortada geniş, pruvada sıfıra yaklaşıyor -> orada
// kesit derin V oluyor (fırkateynin hızlı gövdesi).
const W_DIP = egriYap([
    [-56.6, 3.20], [-48.0, 3.80], [-38.0, 4.05], [-10.0, 4.10],
    [ 10.0, 3.85], [ 24.0, 3.10], [ 34.0, 2.10], [ 42.0, 1.05],
    [ 48.0, 0.35], [ 52.0, 0.10], [ 56.6, 0.04]
]);
// SİNTİNE KIVRIMININ Bezier denetim noktaları (dip -> knuckle).
// ⚠️ SÜPER-ELİPS DENENİP BIRAKILMIŞTI (yolcu-gemisi §2): sin/cos üssüyle
// yazılan çeyrek HER ZAMAN dışbükey çıkıyor, pruvadaki DÜZ V kenarı
// üretilemiyor. Kuadratik Bezier'de denetim noktası köşegene gelince eğri
// DÜZ ÇİZGİye iniyor: kz≈ky -> V, kz büyük + ky küçük -> yuvarlak sintine.
const KZ = egriYap([
    [-56.6, 0.82], [-40.0, 0.86], [  0.0, 0.86], [ 24.0, 0.78],
    [ 38.0, 0.62], [ 48.0, 0.52], [ 56.6, 0.50]
]);
const KY = egriYap([
    [-56.6, 0.16], [-40.0, 0.13], [  0.0, 0.13], [ 24.0, 0.20],
    [ 38.0, 0.36], [ 48.0, 0.46], [ 56.6, 0.50]
]);
// GÜVERTE KENARI = knuckle - tumblehome. Güverte levhası, korkuluk ve
// köpük bu eğriden okunuyor.
function W_GUV(x) { return Math.max(0.04, W_KNK(x) - TUMBLE(x)); }

// ⚠️ `G_KOPUK` (köpüğün tekneden dışarı taşma eğrisi) KALDIRILDI.
// Köpük şeridinin kendisi kaldırıldığı için tek kullanıcısı kalmadı;
// gerekçe ve ölçüm §7'de. Geri getirilecekse eski değerler:
//   [-56,0.40] [-52,0.30] [-48,0.17] [-44,0.05] [-38,0.00]
//   [30,0.00] [38,0.14] [43,0.34] [47,0.52] [49.5,0.55] [51,0.50]
// ⚠️ O eğri yazılırken ölçülmüş iki kısıt hâlâ geçerlidir:
//   1. Taşma güvertedeki (knuckle) yarı genişliğe değil, teknenin SU
//      HATTINDAKİ yarı genişliğine eklenmeli. İlk kurulumda knuckle'a
//      eklenmişti; baş bodoslama öne eğik olduğu için x=47.5'te gerçek
//      taşma 3.467 m (hedefin 2.6 katı) çıktı ve x>=51.5'te levha
//      pruvadan tamamen kopup havada asılı kaldı.
//   2. (gövde_su_hattı + taşma) 7.20'yi AŞMAMALI; aşarsa kutunun z ölçüsü
//      büyür ve "genişlik 14.40" iddiası yalan olur (yolcu-gemisinde ilk
//      kurulumda tam bu olmuş, z 24.43 çıkmıştı).

// ===========================================================================
// 3. KESİT
// ===========================================================================
// Üç bölüm:
//   A [0 .. VA]   düz dip: orta hattan dip genişliğine
//   B [VA .. VB]  sintine kıvrımı: dipten KNUCKLE'a (Bezier)
//   C [VB .. 1]   TUMBLEHOME BORDA: knuckle'dan güverte kenarına DÜZ
//                 çizgi. Kruvaziyerde burası dışa açılan bir Bezier'di;
//                 burada DÜZ olması şart -- düz yüzey radar kesitini
//                 düşüren şeyin kendisi ve tepeden bakışta borda tek
//                 parça bir düzlem olarak okunuyor.
const VA = 0.08, VB = 0.42;

function kesitPar(x) {
    const yK = Y_OMURGA(x);
    const yN = Math.max(yK + 0.05, Y_KNK(x));
    const yD = Math.max(yN + 0.05, Y_GUV(x));
    const wN = W_KNK(x);
    const wD = Math.max(0.04, wN - TUMBLE(x));
    // Düz dip knuckle'dan dar olmak zorunda, yoksa kesit kendi içine döner.
    const wK = Math.min(W_DIP(x), wN * 0.90);
    return { yK: yK, yN: yN, yD: yD, wK: wK, wN: wN, wD: wD,
             kz: KZ(x), ky: KY(x) };
}

// Yarı kesitin v parametresindeki noktası -> [z, y].
// v: 0 = omurga orta hattı, 1 = güverte kenarı. y v ile MONOTON artıyor
// (A bölümünde sabit, B'de Bezier ky in (0,1) ile artan, C'de doğrusal
// artan); vYukseklik'in ikili araması buna dayanıyor.
function kesitNokta(P, v) {
    if (v <= VA) return [P.wK * (v / VA), P.yK];
    if (v <= VB) {
        const t = (v - VA) / (VB - VA), u = 1 - t;
        const cz = P.wK + (P.wN - P.wK) * P.kz;
        const cy = P.yK + (P.yN - P.yK) * P.ky;
        return [u * u * P.wK + 2 * u * t * cz + t * t * P.wN,
                u * u * P.yK + 2 * u * t * cy + t * t * P.yN];
    }
    const t = (v - VB) / (1 - VB);
    return [P.wN + (P.wD - P.wN) * t, P.yN + (P.yD - P.yN) * t];
}

// Yüzey noktası. w in [-1,1]: |w| = v, işaret hangi borda.
// ⚠️ ŞERİTLER BU PARAMETREYLE YAZILIYOR, "y" ile değil (otobüste ön cam
// köşe bandı sabit y ile yazıldığı için kavisin içine girip yırtılmıştı).
function nokta3(x, w) {
    const p = kesitNokta(kesitPar(x), Math.abs(w));
    return [x, p[1], (w < 0 ? -p[0] : p[0])];
}

// Sayısal yüzey normali (dışa bakar). Şeritler yüzeyden bu yönde ötelenir.
function normal3(x, w) {
    const h = 0.02;
    const hx = (x > UZUN - 0.05) ? -h : (x < -UZUN + 0.05 ? h : h);
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
// ⚠️ ÖRNEK SAYISI ÖLÇÜLEREK SEÇİLDİ. NV=15/ND=4/32 istasyon ile gövde
// 2048 üçgen ediyordu ve toplam 6976'da kalıyordu (kalite çıtası:
// otomobil 12968, tank 11008). Üçgeni detay parçasına değil TEKNEYE
// vermek doğrusu: modelin görülen yüzeyinin çoğu tekne kabuğu ve
// tumblehome'un düzgün okunması kesit çözünürlüğüne bağlı.
const NV = 19;    // yarı kesitteki örnek sayısı
const ND = 5;     // güverte geçişinin bölüntüsü
const R_HALKA = 2 * NV + ND - 2;   // 41

// İstasyonlar pruvada ve kıçta SIK, orta gövdede seyrek: kesit orta
// gövdede neredeyse hiç değişmiyor, oraya istasyon koymak yalnız üçgen
// harcar; pruvada ise yarı genişlik 12 metrede 4.05'ten 0.18'e iniyor.
const IST = [
    -56.6, -56.1, -55.4, -54.5, -53.4, -52.2, -51.0, -49.6, -48.0,
    -46.2, -44.2, -42.0, -39.5, -36.5, -33.0, -29.0, -24.0, -18.0,
    -11.0,  -4.0,   4.0,  11.0,  17.0,  22.0,  26.5,  30.5,  34.0,
     37.0,  39.8,  42.2,  44.2,  46.0,  47.6,  49.0,  50.2,  51.3,
     52.3,  53.2,  54.0,  54.8,  55.5,  56.1,  56.6
];

function halka(x) {
    const P = kesitPar(x), yarim = [];
    for (let i = 0; i < NV; i++) yarim.push(kesitNokta(P, i / (NV - 1)));
    // 0 = omurga orta hattı -> +z bordası yukarı -> güverte kenarı ->
    // güverte üstünden karşıya -> -z bordası aşağı. Kapalı halka, kutup
    // yok, bozuk üçgen yok. Güverte KAPALI: tekne içi boş kabuk değil,
    // kapalı bir katı -- tepeden bakışta içi görünmesin diye.
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
    // ortalamasın -- ortalasaydı transomun keskin kenarı yumuşayıp kıç
    // "eriyik" görünürdü. Fırkateynin transomu KESKİN kesiktir.
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
    modelGroup.add(mesh(geo, C_GOVDE, { metal: 0.22, rough: 0.50, name: 'govde' }));
})();

// ===========================================================================
// 5. GENEL YARDIMCILAR
// ===========================================================================
// ---- 5a. KUTU YIĞINI: çok sayıda küçük kutuyu TEK mesh'te toplar --------
// Mesh sayısı ekonomisi. 16 VLS kapağı 16 ayrı mesh olsaydı yalnız o
// 16 mesh harcardı; burada hepsi tek geometri (kapak başına 12 üçgen).
// ⚠️ Ayrıca _applyTint'in "aynı adlı meshlerden yalnız ilki renk alır"
// tuzağını kökten çözüyor: tek ad, tek mesh.
const KUTU_YUZ = [[4, 5, 6], [4, 6, 7], [1, 0, 3], [1, 3, 2],
                  [1, 2, 6], [1, 6, 5], [0, 4, 7], [0, 7, 3],
                  [7, 6, 2], [7, 2, 3], [0, 1, 5], [0, 5, 4]];
function kutuGeo(kutular) {
    const P = [], IDX = [];
    for (const b of kutular) {
        const hx = b[3] / 2, hy = b[4] / 2, hz = b[5] / 2;
        const v = [[-hx, -hy, -hz], [hx, -hy, -hz], [hx, hy, -hz], [-hx, hy, -hz],
                   [-hx, -hy,  hz], [hx, -hy,  hz], [hx, hy,  hz], [-hx, hy,  hz]];
        const t = P.length / 3;
        for (const q of v) P.push(b[0] + q[0], b[1] + q[1], b[2] + q[2]);
        for (const f of KUTU_YUZ) IDX.push(t + f[0], t + f[1], t + f[2]);
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.Float32BufferAttribute(P, 3));
    g.setIndex(IDX);
    g.computeVertexNormals();
    return g;
}
function kutular(ad, liste, renk, opts) {
    opts = opts || {};
    const m = mesh(kutuGeo(liste), renk, {
        flat: opts.flat !== false,
        rough: opts.rough == null ? 0.70 : opts.rough,
        metal: opts.metal == null ? 0.18 : opts.metal, name: ad });
    modelGroup.add(m);
    return m;
}

// ---- 5b. KESİK PİRAMİT (frustum) — içe eğimli düz bordalı blok ----------
// RCS'i düşüren üst yapının makinesi. Plan bir [x, yarıGenişlik] listesi;
// TABANDA o plan, TEPEDE aynı planın yanlardan `icZ`, uçlardan `icX`
// daraltılmış hâli. Aradaki yüzeyler DÜZ ve EĞİK çıkıyor.
//
// ⚠️ NEDEN ExtrudeGeometry DEĞİL: extrude'un kesiti derinlik boyunca
// SABİTTİR (devir §3, "Tofaş Şahin" dersi). Kruvaziyerin üst yapısında
// bu doğruydu (duvarlar gerçekten dik); burada duvarların EĞİK olması
// modelin bütün gerekçesi.
// ⚠️ Plan noktaları DOĞRUSAL bağlanıyor (çeyrek-elips değil): pahlı köşe
// istiyoruz, yuvarlak değil. Uçların yarı genişliği 0 verilmiyor -- 0
// olsaydı orada bozuk (sıfır alanlı) üçgenler ve çöp normaller çıkardı.
function frustum(ad, plan, y0, h, icX, icZ, renk, opts) {
    opts = opts || {};
    const n = plan.length;
    const xa = plan[0][0], xo = plan[n - 1][0];
    const P = [], IDX = [];
    function halkaYaz(y, kx, kz) {
        for (let i = 0; i < n; i++) {
            const u = (plan[i][0] - xa) / (xo - xa);
            P.push(xa + kx + (xo - kx - (xa + kx)) * u, y,
                   Math.max(0.06, plan[i][1] - kz));
        }
        for (let i = n - 1; i >= 0; i--) {
            const u = (plan[i][0] - xa) / (xo - xa);
            P.push(xa + kx + (xo - kx - (xa + kx)) * u, y,
                   -Math.max(0.06, plan[i][1] - kz));
        }
    }
    const R = 2 * n;
    halkaYaz(y0, 0, 0);
    halkaYaz(y0 + h, icX, icZ);
    // ⚠️ SARIM: halka (x, z) duzleminde +y etrafinda CCW yaziliyor
    // (once +z bordasi -x'ten +x'e, sonra -z bordasi geri). CCW halkada
    // (j, R+j, R+j2) sirasinin normali U x T = -radyal, yani ICE bakar ve
    // butun yan yuzeyler arka-yuz olur: kamera onlari ayiklayip KARSI
    // duvarin icini gosterir. Sira ters yazildi. Kapaklar asagida ZATEN
    // dogruydu; degistirilmedi.
    for (let j = 0; j < R; j++) {
        const j2 = (j + 1) % R;
        IDX.push(j, R + j2, R + j, j, j2, R + j2);
    }
    // Alt ve üst kapak: merkez etrafında yelpaze.
    for (const [taban, y, onYuz] of [[0, y0, false], [R, y0 + h, true]]) {
        let mx = 0, mz = 0;
        for (let j = 0; j < R; j++) { mx += P[(taban + j) * 3]; mz += P[(taban + j) * 3 + 2]; }
        const c = P.length / 3;
        P.push(mx / R, y, mz / R);
        for (let j = 0; j < R; j++) {
            const a = taban + j, b = taban + (j + 1) % R;
            if (onYuz) IDX.push(c, a, b); else IDX.push(c, b, a);
        }
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.Float32BufferAttribute(P, 3));
    geo.setIndex(IDX);
    geo.computeVertexNormals();
    const m = mesh(geo, renk, {
        flat: opts.flat !== false,
        rough: opts.rough == null ? 0.62 : opts.rough,
        metal: opts.metal == null ? 0.20 : opts.metal, name: ad });
    modelGroup.add(m);
    return m;
}

// ---- 5c. GÜVERTE ŞERİDİ — sheer'i izleyen ince levha --------------------
// ⚠️ Kruvaziyerde güverte düz bir ExtrudeGeometry idi çünkü orada güverte
// hattı DÜZDÜ. Fırkateynde sheer var (baş 3.3 m yukarıda); düz bir levha
// baş tarafta teknenin İÇİNE gömülür, kıçta HAVADA kalırdı. Bu yüzden
// güverte, Y_GUV eğrisini izleyen bir SÜPÜRME.
// ⚠️ Genişlik W_GUV'dan okunuyor, ayrı bir plan makinesinden DEĞİL
// (yolcu-gemisi §8'de ölçülmüş tuzak: plan makinesi teknenin DIŞINA
// taşıyordu).
function guverteSerit(ad, x1, x2, pay, dy, kalin, N, renk, opts) {
    opts = opts || {};
    const P = [], IDX = [];
    for (let i = 0; i <= N; i++) {
        const x = x1 + (x2 - x1) * i / N;
        const w = Math.max(0.06, W_GUV(x) - pay), y = Y_GUV(x) + dy;
        P.push(x, y + kalin,  w);
        P.push(x, y,          w);
        P.push(x, y,         -w);
        P.push(x, y + kalin, -w);
    }
    // ⚠️ SARIM: dortlu kesit (y, z) duzleminde +x etrafinda CCW; frustum
    // ile AYNI hata. (a, a+4, b+4) ICE bakiyordu. Uc kapaklari (asagida)
    // dogruydu, degistirilmedi.
    for (let i = 0; i < N; i++) {
        for (let j = 0; j < 4; j++) {
            const a = i * 4 + j, b = i * 4 + (j + 1) % 4;
            IDX.push(a, b + 4, a + 4, a, b, b + 4);
        }
    }
    // uçlar
    IDX.push(0, 2, 1, 0, 3, 2);
    const s = N * 4;
    IDX.push(s, s + 1, s + 2, s, s + 2, s + 3);
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.Float32BufferAttribute(P, 3));
    geo.setIndex(IDX);
    geo.computeVertexNormals();
    const m = mesh(geo, renk, {
        flat: opts.flat !== false,
        rough: opts.rough == null ? 0.80 : opts.rough,
        metal: opts.metal == null ? 0.12 : opts.metal, name: ad });
    modelGroup.add(m);
    return m;
}

// ---- 5d. TEKNE YÜZEYİNE OTURAN ŞERİT (yuzeyYama) ------------------------
// otomobil.js'teki makinenin gemi sürümü. Bant [x1, x2, y1, y2, taraf]
// biçiminde YÜKSEKLİK olarak yazılıyor; her x'te o yüksekliğin v'si
// aranıyor. Sabit v ile yazılsalardı şeritler pruvaya doğru YUKARI
// kayardı (kesit orada kısaldığı için aynı v çok daha yüksek bir noktaya
// denk geliyor).
// ⚠️ nx / nw: nx bandın UZUN kenarındaki (x) bölüntü, nw İNCE kenarındaki.
// Ters verilirse şerit yüzeyin kavisini takip edemeyip teknenin içine
// girer ve KAYBOLUR. Buradaki bantlar 90-100 m uzunluğunda ve 1-2.5 m
// yüksekliğinde: nx BÜYÜK, nw KÜÇÜK.
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
        metal: opts.metal == null ? 0.18 : opts.metal,
        rough: opts.rough == null ? 0.55 : opts.rough, name: ad });
    m.material.side = THREE.DoubleSide;
    // Kalınlıksız paneller GÖLGE DÜŞÜRMEZ: tekneye 5 cm mesafede
    // duruyorlar, gölge haritasında kendi gölgelerini teknenin üstüne
    // basıp benek üretiyorlardı (trende ölçülmüştü).
    m.castShadow = false;
    modelGroup.add(m);
    return m;
}

// ===========================================================================
// 6. TEKNE ŞERİTLERİ — su altı boyası + su hattı bandı
// ===========================================================================
// ⚠️ x ARALIKLARI OMURGAYA GÖRE SEÇİLDİ. Kruvaziyerde ölçülmüş tuzak:
// omurga pruvaya doğru yükseldiği için bandın istenen yüksekliği teknenin
// ALTINDA kalıyor, vYukseklik tabana yapışıp bandı omurga hattına
// tırmandırıyor. Bantlar omurganın hâlâ alt sınırın altında olduğu yere
// kadar sürüyor: karina x in [-42, 34] (orada Y_OMURGA <= 0.80 < 1.10),
// su hattı x in [-52, 44] (orada Y_OMURGA <= 1.95 < 3.55).
[1, -1].forEach(function (s, i) {
    // SU ALTI ZEHİRLİ BOYASI. Model tabanı omurga olduğu için gemi
    // haritada su altı gövdesiyle birlikte duruyor; bu bant onu bir
    // "gemi" yapan şey (grinin devamı olsaydı tekne dipsiz görünürdü).
    // ⚠️ ALT SINIR 0.20: ilk kurulumda 1.10 idi ve yandan bakışta
    // su altı gövdesinin yalnız ÜST ŞERİDİ kırmızı çıkıyordu, altı gri
    // kalıyordu -- gemi "kırmızı çizgili gri bir tekne" gibi
    // okunuyordu. 0.20'de bant omurganın altına kadar sarılıyor;
    // omurganın yükseldiği yerlerde vYukseklik zaten tabana yapışıp
    // bandı omurga hattında tutuyor (istenen davranış).
    yuzeyYama('karina_' + (i + 1),
              [[-48.0, 40.0, 0.20, 3.55, s]], 44, 4, 0.05, C_KARINA,
              { metal: 0.06, rough: 0.85 });
    // SU HATTI BANDI (boot top). Renk ALMAZ: kullanıcı gövdeyi boyadığında
    // geminin nereye kadar suya girdiği okunmaya devam etsin.
    yuzeyYama('su_hatti_' + (i + 1),
              [[-52.0, 44.0, 3.55, 4.45, s]], 56, 1, 0.05, C_SU_HAT,
              { metal: 0.10, rough: 0.72 });
});

// ===========================================================================
// 7. KÖPÜK — KALDIRILDI (2026-09-07)
// ===========================================================================
// Burada bir "baş dalgası / dümen suyu" şeridi vardı: y = SU + 0.25
// kotunda, x = -56.0..51.0 boyunca uzanan, SIFIR KALINLIKTA, `DoubleSide`
// iki levha (`kopuk_1`, `kopuk_2`). Yusuf aynı modelde ÜÇ TUR üst üste
// "gemini altında beyaz bir şey var" / "kesit hâlâ duruyor" dedi.
//
// KÖK SEBEP — yolcu gemisindeki `kopuk_1/2` ve bu modeldeki
// `sintine_omurga` ile BİREBİR aynı kusur sınıfı (bkz. §16 ve OKU.md):
// levha TAM YATAY (tek y kotu, kesit yok), `DoubleSide` + `computeVertexNormals`
// yüzünden THREE arka yüzün normalini çevirdiği için HER İKİ taraftan da
// tam aydınlık. Anahtar ışık yukarıdan geldiğinden yatay yüzey ışığın
// tamamını alıyor; gövdedeki gibi bir gölge geçişi hiç yok. Sonuç:
// tekneden kopuk, keskin kenarlı parlak bir hat — koyu su hattı bandının
// (`su_hatti_*`) hemen üstünde durduğu için "şeridin üzerindeki beyaz
// şerit", baş ve kıçta bordadan taştığı yerde de siluetin dışına çıkıp
// İKİNCİ BİR BAŞ BODOSLAMA gibi okunuyor.
//
// ⚠️ İKİ ÖNCEKİ TUR BU MADDEYİ KAPATTIĞINI SANDI. İlki taşmayı knuckle
// yerine su hattı genişliğinden hesapladı (ölçüm doğruydu: pruvadaki
// kopuk levha gitti); ikincisi kusuru `sintine_omurga`ya atfetti ve onu
// kapalı katıya çevirdi (o da gerçek bir kusurdu ve düzeldi). Ama şeridin
// KENDİSİ — orta gövdede teknenin içinde, baş/kıçta dışında — duruyordu.
//
// ⚠️ TEZGÂH IŞIĞI VE `parlaklik.py` BU KUSURA KÖR (DEVİR §4.3): tepe luma
// 250 eşiğini hiç geçmiyor. Teşhis ancak GERÇEK STUDIO karesinde,
// mesh'e atamalı kimlik pasıyla konulabiliyor (`gemi_studio_probu.py`).
//
// NEDEN DÜZELTİLMEDİ DE KALDIRILDI: `sintine_omurga` reçetesi (kapalı
// katıya çevir, `FrontSide`, sarımı türet) burada işe yaramaz. Şeridin
// orta gövdedeki kısmı zaten teknenin içinde ve görünmüyor; geriye kalan
// tek görsel katkısı baş/kıçtaki taşma, yani ŞİKÂYETİN KENDİSİ. Katıya
// çevirmek onu gölgeli bir ikinci bodoslama yapardı. Yusuf'un isteği de
// birebir "onu kaldır".
//
// KUTU DEĞİŞMEDİ ve değişemezdi: şerit x -56.0..51.0 (tekne -56.2..57.0
// içinde), z |YARI_EN| ile kırpılıyordu, y 8.25 (0..32 içinde).
//

// ===========================================================================
// 8. GÜVERTELER
// ===========================================================================
// Teknenin kapalı üst yüzü gövde grisi. Onun üstüne 0.35 içeriden başlayan
// koyu bir döşeme oturuyor: kalan gri çerçeve PARAPET olarak okunuyor ve
// tepeden bakışta geminin dış hattını çiziyor.
guverteSerit('guverte', -29.5, 56.1, 0.35, 0.06, 0.16, 34, C_GUV);
// UÇUŞ GÜVERTESİ — kıç yarının tamamı. Daha KOYU ve boş: tepeden bakışta
// kruvaziyerin balkon/havuz dolu kıçının tam tersi.
guverteSerit('ucus_guverte', -55.9, -29.5, 0.35, 0.06, 0.20, 14, C_UCUS);

// HELİKOPTER DAİRESİ. Tepeden bakışta fırkateyni fırkateyn yapan tek
// leke. Kruvaziyerin yorumunda "havuz, askerî gemilerin helikopter
// dairesiyle karışmasın diye DİKDÖRTGEN ve mavi" yazıyor -- ayrım
// karşılıklı ve bilerek.
(function ucusIsaret() {
    const yD = Y_GUV(-42.5) + 0.28;
    const g = new THREE.RingGeometry(3.85, 4.55, 30);
    g.rotateX(-Math.PI / 2);
    g.translate(-42.5, yD, 0);
    const m = mesh(g, C_CIZGI, { rough: 0.85, metal: 0.05, name: 'ucus_daire' });
    m.material.side = THREE.DoubleSide;
    m.castShadow = false;
    // ⚠️ AYNI YÜZEYE OTURAN PANELDE DERİNLİK KAVGASI: uçuş güvertesinin
    // üst yüzü 0.02 m altta. castShadow=false bunu ÇÖZMEZ (z-tamponu,
    // gölge değil) -- polygonOffset şart, katman katman (trende ölçüldü).
    m.material.polygonOffset = true;
    m.material.polygonOffsetFactor = -2;
    m.material.polygonOffsetUnits = -2;
    modelGroup.add(m);
    // İniş hattı: dairenin içinden kıça uzanan kılavuz çizgi.
    const c = kutular('ucus_cizgi', [[-49.0, yD, 0, 9.0, 0.02, 0.34]],
                      C_CIZGI, { rough: 0.85, metal: 0.05 });
    c.castShadow = false;
    c.material.polygonOffset = true;
    c.material.polygonOffsetFactor = -3;
    c.material.polygonOffsetUnits = -3;
})();

// ===========================================================================
// 9. BAŞ GÜVERTE — 76 mm TOP, VLS, DALGA KIRAN
// ===========================================================================
// 9a. TOP KULESİ (76 mm OTO Melara Super Rapid).
// ⚠️ _TURRETS PARÇALARI PRİMİTİF OLMAK ZORUNDA. Motor taret parçalarını
// pivota taşırken `o.position.x -= pivot[0]` yazıyor (studio-3d.js:1087),
// yani parçanın geometrisi KENDİ ORİJİNİNDE merkezli olmalı. Bu yüzden
// kule gövdesi de yerel koordinatta kuruldu ve position ile yerine
// konuldu; tepe noktaları mutlak x ile yazılsaydı taret 37 m kayardı.
(function topKulesi() {
    const yG = Y_GUV(TARET_X) + 0.22;    // baş güverte kotu (11.15 civarı)
    // Kaide halkası (barbet) -- kule bunun üstünde döner.
    kutular('taret_kaide', [[TARET_X, yG + 0.30, 0, 4.30, 0.60, 4.30]],
            C_UST, { rough: 0.66 });
    // Kule gövdesi: pahlı, içe eğimli sekizgen prizma (stealth kalkanı).
    // Kendi orijininde kuruluyor (bkz. yukarıdaki uyarı).
    const plan = [], N = 8;
    const P = [], IDX = [];
    const yAlt = 0, yUst = 2.05, rAlt = 2.10, rUst = 1.32;
    for (let i = 0; i < N; i++) {
        const a = (i + 0.5) * 2 * Math.PI / N;
        plan.push([Math.cos(a), Math.sin(a)]);
    }
    for (const p of plan) P.push(p[0] * rAlt, yAlt, p[1] * rAlt);
    for (const p of plan) P.push(p[0] * rUst, yUst, p[1] * rUst * 0.86);
    for (let i = 0; i < N; i++) {
        const j = (i + 1) % N;
        IDX.push(i, N + i, N + j, i, N + j, j);
    }
    // ⚠️ SARIM: burada halka (cos a, sin a) ile +y etrafinda CW yaziliyor,
    // o yuzden YAN yuzeyler (yukarida) dogru. Ters olan KAPAKLARDI: CW
    // halkada (c, j, j+1) yelpazesinin normali -y'dir; alt kapak onu
    // istiyor, ust kapak tersini. Ikisi de yer degistirdi.
    const c1 = P.length / 3; P.push(0, yAlt, 0);
    for (let i = 0; i < N; i++) IDX.push(c1, i, (i + 1) % N);
    const c2 = P.length / 3; P.push(0, yUst, 0);
    for (let i = 0; i < N; i++) IDX.push(c2, N + (i + 1) % N, N + i);
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.Float32BufferAttribute(P, 3));
    g.setIndex(IDX);
    g.computeVertexNormals();
    const t = mesh(g, C_GOVDE, { flat: true, rough: 0.58, metal: 0.24, name: 'taret' });
    t.position.set(TARET_X, yG + 0.60, 0);
    modelGroup.add(t);
    // Kule kapağı KOYU: tepeden bakışta baş yarısındaki tek koyu daire,
    // geminin hangi ucunun pruva olduğunu bu söylüyor.
    const k = mesh(new THREE.CylinderGeometry(1.34, 1.34, 0.18, 8), C_KOYU,
                   { flat: true, rough: 0.80, name: 'taret_ust' });
    k.position.set(TARET_X, yG + 0.60 + 2.10, 0);
    modelGroup.add(k);
    // NAMLU. Adı TAM `namlu`: motor ağız alevini
    // inner.getObjectByName('namlu') ile buluyor (studio-3d.js:1022).
    const n = mesh(new THREE.CylinderGeometry(0.20, 0.26, 5.60, 10), C_KROM,
                   Object.assign({ name: 'namlu' }, KROM_MAL));
    n.rotation.z = -Math.PI / 2;
    n.position.set(TARET_X + 3.10, yG + 1.72, 0);
    modelGroup.add(n);
    const na = mesh(new THREE.CylinderGeometry(0.28, 0.28, 0.70, 10), C_KOYU,
                    { rough: 0.7, name: 'namlu_agiz' });
    na.rotation.z = -Math.PI / 2;
    na.position.set(TARET_X + 6.10, yG + 1.72, 0);
    modelGroup.add(na);
})();

// 9b. DALGA KIRAN — topun hemen önünde, V biçimli alçak duvar.
// Gerçek fırkateynde baş güverteye binen suyu topun üstünden atmak için.
frustum('dalga_kiran',
        [[43.6, 0.20], [45.6, 2.65], [46.4, 3.55], [47.2, 3.55]],
        Y_GUV(45.5) + 0.20, 1.05, 0.10, 0.28, C_GOVDE, { rough: 0.66 });

// 9c. 16 HÜCRELİ MiDLAS DİKEY FIRLATMA SİSTEMİ.
// Topun hemen kıçında, güverteden 1.5 m yükselen bir platform ve üstünde
// 4x4 koyu kapak ızgarası. Kruvaziyerde bunun karşılığı yok; tepeden
// bakışta baş yarıyı okutan ikinci işaret bu.
(function vls() {
    const yG = Y_GUV(26.5) + 0.22;
    frustum('vls_kaide',
            [[20.5, 2.30], [21.8, 3.40], [31.2, 3.40], [32.5, 2.30]],
            yG, 1.45, 0.55, 0.42, C_GOVDE, { rough: 0.64 });
    const kap = [];
    for (let i = 0; i < 4; i++)
        for (let j = 0; j < 4; j++)
            kap.push([22.6 + i * 2.30, yG + 1.47, -2.10 + j * 1.40,
                      1.90, 0.10, 1.06]);
    const m = kutular('vls_kapak', kap, C_KOYU, { rough: 0.55, metal: 0.30 });
    m.castShadow = false;
})();

// 9d. BAŞ GÜVERTE TEÇHİZATI — ırgat, baba, demir loçası, gönder.
kutular('bocurgat', [[50.5, Y_GUV(50.5) + 0.35, -1.90, 2.10, 0.90, 1.50],
                     [50.5, Y_GUV(50.5) + 0.35, 1.90, 2.10, 0.90, 1.50]],
        C_UST, { rough: 0.72 });
kutular('baba_bas', [[53.6, Y_GUV(53.6) + 0.28, -1.05, 0.75, 0.62, 0.55],
                     [53.6, Y_GUV(53.6) + 0.28,  1.05, 0.75, 0.62, 0.55],
                     [-52.5, Y_GUV(-52.5) + 0.28, -3.20, 0.75, 0.62, 0.55],
                     [-52.5, Y_GUV(-52.5) + 0.28,  3.20, 0.75, 0.62, 0.55]],
        C_KOYU, { rough: 0.78 });
(function gonderler() {
    const b = mesh(new THREE.CylinderGeometry(0.10, 0.16, 4.20, 8), C_KROM,
                   Object.assign({ name: 'gonder_bas' }, KROM_MAL));
    b.position.set(55.4, Y_GUV(55.4) + 2.15, 0);
    modelGroup.add(b);
    const k = mesh(new THREE.CylinderGeometry(0.09, 0.15, 3.60, 8), C_KROM,
                   Object.assign({ name: 'gonder_kic' }, KROM_MAL));
    k.position.set(-55.6, Y_GUV(-55.6) + 1.85, 0);
    modelGroup.add(k);
})();

// ===========================================================================
// 10. ÜST YAPI — ÜÇ KADEME, HEPSİ İÇE EĞİMLİ
// ===========================================================================
// Kademe planları pahlı sekizgen: ön ve arka uçlar sivri değil KESİK.
// icX/icZ değerleri eğimi veriyor; 01 güvertesinde 2.70 m yükselişte
// 0.62 m içeri = 12.9 derece, teknenin tumblehome'uyla AYNI açı (siluet
// tek bir düzlem gibi okunsun diye bilerek eşitlendi).
const P01 = [[-9.0, 2.90], [-7.2, 5.20], [2.0, 5.20], [10.0, 5.20],
             [16.6, 5.20], [18.4, 3.90], [19.4, 2.20]];
const P02 = [[-7.4, 2.55], [-5.8, 4.55], [2.0, 4.55], [9.5, 4.55],
             [15.4, 4.55], [17.0, 3.35], [17.9, 1.90]];
const P03 = [[ 1.6, 2.20], [ 3.0, 4.00], [7.0, 4.00], [11.0, 4.00],
             [14.2, 4.00], [15.8, 2.95], [16.6, 1.70]];
frustum('ust_01', P01, D01, D02 - D01, 0.75, 0.62, C_UST, { rough: 0.60 });
frustum('ust_02', P02, D02, D03 - D02, 0.70, 0.58, C_UST, { rough: 0.60 });
frustum('ust_03', P03, D03, KOPRU_UST - D03, 0.70, 0.56, C_UST, { rough: 0.60 });

// Açıkta kalan çatılar — KOYU (tepeden bakışta beyaza yanan yatay yüzey
// bırakma kuralı; motokaravan ve kruvaziyerde ölçülmüştü).
frustum('ust_01_cati', [[-8.6, 2.75], [-6.9, 5.02], [16.3, 5.02], [18.0, 3.75], [19.0, 2.10]],
        D02, 0.14, 0.05, 0.03, C_GUV, { rough: 0.82, metal: 0.10 });
frustum('ust_02_cati', [[-7.0, 2.40], [-5.5, 4.38], [15.1, 4.38], [16.6, 3.20], [17.5, 1.80]],
        D03, 0.14, 0.05, 0.03, C_GUV, { rough: 0.82, metal: 0.10 });
frustum('kopru_cati', [[1.9, 2.05], [3.3, 3.80], [13.9, 3.80], [15.4, 2.80], [16.2, 1.60]],
        KOPRU_UST, 0.16, 0.05, 0.03, C_GUV, { rough: 0.82, metal: 0.10 });

// KÖPRÜÜSTÜ CAMI — öne ve yanlara sarılan, İÇE EĞİK bant. Gerçek
// fırkateynde köprü camları da eğik (hem RCS hem güneş yansıması).
// ⚠️ Cam bandı üst yapının 0.10 DIŞINDA: aynı düzlemde olsaydı derinlik
// kavgası çıkardı (trende ölçülmüş tuzak).
frustum('kopru_cam',
        [[8.6, 4.10], [10.0, 4.12], [14.3, 4.12], [15.9, 3.05], [16.7, 1.80]],
        D03 + 0.95, 1.35, 0.36, 0.30, C_CAM, { rough: 0.28, metal: 0.32 });

// KÖPRÜ KANATLARI — gerçek fırkateynde borda hizasına kadar taşar
// (kaptan yanaşırken bordayı görecek). Dış uç 6.05 < 7.20, yani kutuyu
// büyütmüyor.
frustum('kopru_kanat_1', [[9.0, 6.05], [10.2, 6.05], [13.2, 6.05], [13.8, 5.60]],
        D03 + 0.30, 1.85, 0.16, -0.30, C_UST, { rough: 0.62 });
frustum('kopru_kanat_2', [[9.0, -3.55], [10.2, -3.55], [13.2, -3.55], [13.8, -3.10]],
        D03 + 0.30, 1.85, 0.16, 0.30, C_UST, { rough: 0.62 });

// ===========================================================================
// 11. KAPALI (ENTEGRE) DİREK
// ===========================================================================
// Fırkateynin en tanıdık çizgisi. Kruvaziyerin radar direği İNCE BİR
// BORU idi; buradaki kapalı direk piramit gövdeli bir KÜTLE ve üst yapıya
// kaynaşıyor. Üç kademe: geniş taban, dar orta, mil.
// ⚠️ DİREK TABANI 02 ÇATISINA OTURUR — ilk kurulumda `KOPRU_UST - 1.20`
// (16.70) yazılıydı: yazan, direğin altında köprü bloğunun (ust_03) olduğunu
// varsaymış. Ama ust_03 **x = 1.6'da başlıyor**, direk ise x = -3.4'e kadar
// KIÇA uzanıyor; o 5 metrelik bölümün altında hiçbir şey yoktu.
// Ölçüldü (bosluk_olc.js): direk_alt'ın alt yüzü ile altındaki ilk yüzey
// (ust_02_cati, tepesi 15.34) arasında ortanca **1.360 m** boşluk, temas eden
// örnek 0/24. Yandan bakıldığında direğin altından karşı taraf görünüyordu.
// Düzeltme: taban 02 çatısının TEPESİNE (D03 + 0.14) indirildi; tepe kotu
// (21.90) ve tepe planı DEĞİŞMEDİ (icX/icZ mutlak daraltma), yani direk_ust
// aynı yere oturuyor. Eğim 9.8°'den 7.8°'ye yumuşuyor.
frustum('direk_alt', [[-3.4, 1.85], [-2.1, 3.15], [2.4, 3.15], [3.6, 1.85]],
        D03 + 0.14, (KOPRU_UST + 4.00) - (D03 + 0.14), 0.85, 0.90,
        C_UST, { rough: 0.60 });
frustum('direk_ust', [[-2.4, 1.05], [-1.5, 2.05], [1.8, 2.05], [2.7, 1.05]],
        KOPRU_UST + 4.00, 4.60, 0.60, 0.62, C_UST, { rough: 0.60 });
// Direğin yüzlerindeki sabit dizi antenler (ESM/IFF). Yüzeyden 0.12
// dışarıda; içinde kalsalardı hiç görünmezlerdi.
kutular('anten_dizi',
        [[ 1.30, KOPRU_UST + 2.30, 2.55, 2.30, 2.10, 0.16],
         [ 1.30, KOPRU_UST + 2.30, -2.55, 2.30, 2.10, 0.16],
         [ 3.05, KOPRU_UST + 2.30, 0, 0.16, 2.10, 2.30]],
        C_KOYU, { rough: 0.45, metal: 0.30 });
// Direk mili + CENK-S yatağı.
// ⚠️ MİL DİREĞE OTURUR. İlk kurulumda mil 28.20'de başlıyordu, direğin
// tepesi ise 26.50'de bitiyordu: radar takımının tamamı **1.700 m HAVADA**
// duruyordu (bosluk_olc.js: direk_mil ortanca boşluk 1.700 m, temas eden
// örnek 0/30). Yusuf'un "radarın bağlı olduğu kule gemiye bitişik değil,
// biraz havada" dediği şey buydu.
// Milin tabanı artık direk_ust'un tepe kotuyla BİREBİR aynı düzlemde
// (26.50) ve taban yarıçapı 0.62 -- direğin tepe yüzü orada x[-1.80, 2.10],
// yarı genişlik 1.43, yani daire tümüyle yüzeyin içinde. İki kapak
// sırt sırta (mil aşağı, direk yukarı bakıyor) olduğu için derinlik
// kavgası yok; iç içe geçme de yok.
(function direkTepe() {
    const UST_TEPE = KOPRU_UST + 4.00 + 4.60;      // direk_ust'un tepesi = 26.50
    const MIL_H = DIREK_TEPE - UST_TEPE;           // 3.90
    const m = mesh(new THREE.CylinderGeometry(0.22, 0.62, MIL_H, 10), C_UST,
                   { rough: 0.5, metal: 0.25, name: 'direk_mil' });
    m.position.set(0.15, UST_TEPE + MIL_H / 2, 0);
    modelGroup.add(m);
    const y = mesh(new THREE.CylinderGeometry(0.62, 0.62, 0.42, 12), C_KOYU,
                   { rough: 0.6, name: 'radar_yatak' });
    y.position.set(0.15, DIREK_TEPE + 0.05, 0);
    modelGroup.add(y);
})();
// ---- DÖNEN ARAMA RADARI (CENK-S) ----
// ⚠️ Kruvaziyerde dönen radar BİLEREK konulmamıştı: "spin() eklenen model
// motor tarafından animasyonlu sayılır ve limanda duran gemi bile her kare
// yeniden çizilir". Burada o bedel ZATEN ÖDENİYOR -- fırkateynin viraj
// yatması için registerBehavior('firkateyn') var, yani model her kare
// çiziliyor; spin marjinal maliyet getirmiyor. Ve kaynak doğrulandı:
// CENK-S "dönen antenli" bir AESA. Sivil gemiden ayrışmanın da en ucuz yolu.
// rpm 24: gerçek hava arama radarı 15-30 dev/dk. tSec MUTLAK olduğu için
// dışa aktarma deterministik (motor `tSec * w` yazıyor, biriktirme yok).
(function radar() {
    const g = spin({ pivot: [0.15, DIREK_TEPE + 0.30, 0], axis: 'y', rpm: 24 });
    // ⚠️ Bu meshler pivota GÖRE konumlanır (grup pivotta duruyor).
    const a = mesh(kutuGeo([[0, 0.62, 0, 0.34, 1.24, 4.60],
                            [0, 0.10, 0, 1.40, 0.30, 1.40]]), C_KROM,
                   Object.assign({ flat: true, name: 'radar_anten' }, KROM_MAL));
    g.add(a);
})();
// Uydu haberleşme radomları (küre) — direğin iki yanında.
(function radom() {
    for (let s = -1; s <= 1; s += 2) {
        const r = mesh(new THREE.SphereGeometry(0.95, 12, 8), C_UST,
                       { rough: 0.55, name: 'radom_' + (s < 0 ? 1 : 2) });
        r.position.set(-1.20, KOPRU_UST + 3.20, s * 3.05);
        modelGroup.add(r);
    }
})();
// Atış kontrol / elektro-optik taret (köprü çatısında, öne bakar).
(function eo() {
    const k = mesh(new THREE.CylinderGeometry(0.66, 0.80, 0.95, 10), C_UST,
                   { rough: 0.5, name: 'eo_taret' });
    k.position.set(13.4, KOPRU_UST + 0.62, 0);
    modelGroup.add(k);
    const c = mesh(new THREE.BoxGeometry(0.30, 0.52, 0.92), C_CAM,
                   { flat: true, rough: 0.25, metal: 0.32, name: 'eo_cam' });
    c.position.set(14.02, KOPRU_UST + 0.66, 0);
    modelGroup.add(c);
})();

// ===========================================================================
// 12. ORTA GÖVDE — ATMACA, RHIB, TORPİDO, CIWS TAMAMLAYICILARI
// ===========================================================================
// 12a. ATMACA GEMİSAVAR KAPSÜLLERİ — dört dörtlü paket, orta gövdede,
// KIÇA doğru eğik (gerçek yerleşimde de bacayla hangar arasında ve
// yükselişli). Tepeden bakışta gövdenin ortasındaki iki eğik blok.
(function atmaca() {
    for (let s = -1; s <= 1; s += 2) {
        const g = new THREE.Group();
        const paket = kutuGeo([[0, 0, -0.85, 6.30, 1.42, 1.55],
                               [0, 0,  0.85, 6.30, 1.42, 1.55],
                               [0, 1.46, -0.85, 6.30, 1.42, 1.55],
                               [0, 1.46,  0.85, 6.30, 1.42, 1.55]]);
        const m = mesh(paket, C_MUHIM,
                       { flat: true, rough: 0.62, metal: 0.22,
                         name: 'atmaca_' + (s < 0 ? 1 : 2) });
        // Yükseliş açısı 34 derece, kıça doğru; ayrıca 12 derece dışa açık.
        m.rotation.z = 34 * Math.PI / 180;
        m.rotation.y = s * 12 * Math.PI / 180;
        m.position.set(-13.0, D01 + 1.40, s * 4.10);
        modelGroup.add(m);
    }
    // Kapsül kaidesi.
    kutular('atmaca_kaide',
            [[-13.0, D01 + 0.30, -4.10, 6.60, 0.60, 3.60],
             [-13.0, D01 + 0.30,  4.10, 6.60, 0.60, 3.60]],
            C_UST, { rough: 0.68 });
})();

// 12b. RHIB (2 adet) — borda oyuklarında, mataforalı.
(function botlar() {
    for (let s = -1; s <= 1; s += 2) {
        const i = s < 0 ? 1 : 2;
        kutular('bot_yuva_' + i,
                [[-2.5, D01 + 1.15, s * 5.55, 8.20, 2.30, 0.35]],
                C_KOYU, { rough: 0.8 });
        const b = mesh(kutuGeo([[0, 0, 0, 6.60, 1.05, 1.90],
                                [1.90, 0.62, 0, 2.20, 0.65, 1.30]]), C_BOT,
                       { flat: true, rough: 0.6, name: 'bot_' + i });
        b.position.set(-2.5, D01 + 1.10, s * 4.95);
        modelGroup.add(b);
        const d = mesh(new THREE.CylinderGeometry(0.16, 0.16, 3.40, 8), C_KROM,
                       Object.assign({ name: 'matafora_' + i }, KROM_MAL));
        d.rotation.x = Math.PI / 2;
        d.position.set(-5.6, D01 + 2.60, s * 5.10);
        modelGroup.add(d);
    }
})();

// 12c. 324 mm ÜÇLÜ TORPİDO KOVANLARI — hangar önünde, yanlara bakar.
(function torpido() {
    for (let s = -1; s <= 1; s += 2) {
        const t = mesh(kutuGeo([[0, 0, 0, 1.05, 1.05, 3.30],
                                [0, 0.98, 0, 1.05, 1.05, 3.30],
                                [1.02, 0.49, 0, 1.05, 1.05, 3.30]]), C_MUHIM,
                       { flat: true, rough: 0.6, name: 'torpido_' + (s < 0 ? 1 : 2) });
        t.rotation.y = s * 22 * Math.PI / 180;
        t.position.set(-19.5, D01 + 0.85, s * 4.65);
        modelGroup.add(t);
    }
})();

// 12d. CHAFF / ALDATICI ATICILAR — köprü kanadı hizasında, dışa eğik.
kutular('chaff',
        [[6.2, D02 + 0.85, -5.15, 1.30, 1.55, 1.10],
         [6.2, D02 + 0.85,  5.15, 1.30, 1.55, 1.10],
         [-8.4, D02 + 0.85, -4.55, 1.30, 1.55, 1.10],
         [-8.4, D02 + 0.85,  4.55, 1.30, 1.55, 1.10]],
        C_UST, { rough: 0.68 });

// 12e. 25 mm UZAKTAN KUMANDALI SİLAH İSTASYONLARI (SMASH) — 01 güvertesinde.
(function rws() {
    for (let s = -1; s <= 1; s += 2) {
        const i = s < 0 ? 1 : 2;
        const k = mesh(new THREE.CylinderGeometry(0.52, 0.62, 0.70, 8), C_UST,
                       { flat: true, rough: 0.65, name: 'rws_kaide_' + i });
        k.position.set(20.4, D01 + 0.35, s * 3.10);
        modelGroup.add(k);
        const g = mesh(kutuGeo([[0, 0, 0, 1.05, 0.75, 0.95],
                                [0.95, 0.06, 0, 1.60, 0.16, 0.16]]), C_KOYU,
                       { flat: true, rough: 0.55, name: 'rws_' + i });
        g.position.set(20.4, D01 + 1.05, s * 3.10);
        modelGroup.add(g);
    }
})();

// ===========================================================================
// 13. BACA — içe eğimli, kıça yatık, ızgaralı
// ===========================================================================
// Kruvaziyerin bacası GENİŞ ve YATIK bir kütleydi. Fırkateyninki DAR ve
// köşeli; çıkışlar kızılötesi imzayı düşürmek için bacanın içine gömülü
// (gerçekte de öyle) ve tepeden koyu iki oval olarak okunuyor.
frustum('baca', [[-11.6, 1.75], [-10.4, 3.05], [-6.6, 3.05], [-5.4, 1.75]],
        D02, 6.20, 0.95, 0.72, C_UST, { rough: 0.58 });
kutular('baca_agiz',
        [[-8.5, D02 + 6.15, -1.15, 3.10, 0.30, 1.35],
         [-8.5, D02 + 6.15,  1.15, 3.10, 0.30, 1.35]],
        C_KOYU, { rough: 0.90, metal: 0.05 });
// Baca ızgaraları (yan yüzeydeki hava alışları).
kutular('baca_izgara',
        [[-8.5, D02 + 2.60, -2.42, 3.40, 2.20, 0.14],
         [-8.5, D02 + 2.60,  2.42, 3.40, 2.20, 0.14]],
        C_KOYU, { rough: 0.9, metal: 0.05 });

// ===========================================================================
// 14. HANGAR + UÇUŞ GÜVERTESİ TEÇHİZATI
// ===========================================================================
// Hangar da içe eğimli (üst yapının devamı). Kıç yüzü uçuş güvertesine
// bakan büyük KAPI: tepeden değil ama 3/4 arka bakışta fırkateyni
// fırkateyn yapan detay.
frustum('hangar', [[-30.6, 2.60], [-29.2, 4.85], [-16.4, 4.85], [-15.0, 3.20]],
        D01, D03 - D01, 0.80, 0.95, C_UST, { rough: 0.60 });
frustum('hangar_cati', [[-30.2, 2.45], [-28.9, 4.65], [-16.2, 4.65], [-14.8, 3.05]],
        D03, 0.16, 0.05, 0.03, C_GUV, { rough: 0.82, metal: 0.10 });
kutular('hangar_kapi', [[-30.35, D01 + 2.30, 0, 0.30, 4.40, 6.20]],
        C_KOYU, { rough: 0.75 });
// Hangar çatısında 35 mm GÖKDENİZ CIWS — KIÇA bakar (kaynakta öyle).
(function ciws() {
    const k = mesh(new THREE.CylinderGeometry(1.05, 1.25, 0.55, 10), C_UST,
                   { flat: true, rough: 0.65, name: 'ciws_kaide' });
    k.position.set(-26.0, D03 + 0.44, 0);
    modelGroup.add(k);
    const g = mesh(kutuGeo([[0, 0, 0, 2.20, 1.35, 1.90],
                            [-0.55, 0.72, 0, 1.30, 0.90, 2.30]]), C_UST,
                   { flat: true, rough: 0.6, name: 'ciws_govde' });
    g.position.set(-26.0, D03 + 1.35, 0);
    modelGroup.add(g);
    const n = mesh(new THREE.CylinderGeometry(0.15, 0.17, 3.10, 8), C_KROM,
                   Object.assign({ name: 'ciws_namlu' }, KROM_MAL));
    n.rotation.z = Math.PI / 2 + 0.20;
    n.position.set(-28.2, D03 + 1.85, 0);
    modelGroup.add(n);
})();
// Uçuş güvertesi aydınlatma direkleri + kıç direği.
kutular('ucus_lamba',
        [[-33.5, Y_GUV(-33.5) + 0.80, -5.20, 0.35, 1.30, 0.35],
         [-33.5, Y_GUV(-33.5) + 0.80,  5.20, 0.35, 1.30, 0.35],
         [-52.0, Y_GUV(-52.0) + 0.80, -4.30, 0.35, 1.30, 0.35],
         [-52.0, Y_GUV(-52.0) + 0.80,  4.30, 0.35, 1.30, 0.35]],
        C_KOYU, { rough: 0.8 });
// Can salı kapsülleri (silindir), hangar bordalarında.
(function salLar() {
    for (let s = -1; s <= 1; s += 2) {
        const i = s < 0 ? 1 : 2;
        const P = [];
        for (let k = 0; k < 3; k++) P.push([-18.0 - k * 2.40, 0, 0, 1.30, 0.95, 2.05]);
        const m = mesh(kutuGeo(P), C_KOYU,
                       { flat: true, rough: 0.7, name: 'can_sali_' + i });
        m.position.set(0, D01 + 1.15, s * 5.30);
        modelGroup.add(m);
    }
})();

// ===========================================================================
// 15. KORKULUKLAR
// ===========================================================================
// Güverte kenarını çizen ince dizi. Tepeden bakışta geminin dış hattını
// belirginleştiriyor, yandan da "boş güverte" hissini kırıyor.
// ⚠️ Tek mesh'te toplandı (§5a): ayrı ayrı olsaydı 60'tan fazla mesh.
(function korkuluk() {
    function dizi(x1, x2, n, dy) {
        const L = [];
        for (let s = -1; s <= 1; s += 2) {
            for (let i = 0; i <= n; i++) {
                const x = x1 + (x2 - x1) * i / n;
                const w = W_GUV(x) - 0.18, y = Y_GUV(x) + dy;
                L.push([x, y + 0.55, s * w, 0.10, 1.10, 0.10]);
            }
            // iki yatay küpeşte
            for (let i = 0; i < n; i++) {
                const xa = x1 + (x2 - x1) * i / n, xb = x1 + (x2 - x1) * (i + 1) / n;
                const xm = (xa + xb) / 2;
                const wm = W_GUV(xm) - 0.18, ym = Y_GUV(xm) + dy;
                const uz = Math.abs(xb - xa) + 0.05;
                L.push([xm, ym + 1.05, s * wm, uz, 0.09, 0.09]);
                L.push([xm, ym + 0.62, s * wm, uz, 0.09, 0.09]);
            }
        }
        return L;
    }
    const L = dizi(34.0, 54.5, 9, 0.14).concat(dizi(-54.0, -31.5, 9, 0.16));
    const m = kutular('korkuluk', L, C_KROM,
                      Object.assign({ flat: true }, KROM_MAL));
    m.castShadow = false;    // ince çubuklar gölge haritasında benek üretiyor
})();

// ===========================================================================
// 16. SU ALTI — pervaneler, şaftlar, dümenler, sintine omurgaları
// ===========================================================================
// Model tabanı omurga olduğu için gemi haritada su altı gövdesiyle
// duruyor; alçak açılı bakışta bunlar görünüyor ve gemiyi "yüzen bir
// kutu" olmaktan çıkarıyor. Hepsi omurga hattının ÜSTÜNDE kalıyor
// (kıçta omurga 0.7-2.9 arasında yükseliyor), yani kutunun y tabanını
// AŞAĞI ÇEKMİYORLAR -- ölçüldü, kutu min y = 0.
(function suAlti() {
    for (let s = -1; s <= 1; s += 2) {
        const i = s < 0 ? 1 : 2;
        // ⚠️ PERVANE YARIÇAPI KUTUNUN TABANINA GÖRE SEÇİLDİ. İlk kurulumda
        // y=1.05'te 1.70 yarıçaplıydı ve ÖLÇÜLDÜ: kutu min y = -0.5668,
        // yani pervane omurga hattının 57 cm altına iniyordu. _centerAndGround
        // tabanı y=0'a oturttuğu için bütün gemi 57 cm havaya kalkıyor ve
        // kutu y'si 32.51'e çıkıyordu. Mil 2.20'ye kaldırıldı, yarıçap
        // 1.55'e indi -> pervane ucu y=0.65, omurganın üstünde.
        const sa = mesh(new THREE.CylinderGeometry(0.34, 0.28, 7.40, 8), C_KROM,
                        Object.assign({ name: 'saft_' + i }, KROM_MAL));
        sa.rotation.z = Math.PI / 2;
        sa.position.set(-45.0, 2.20, s * 2.35);
        modelGroup.add(sa);
        const pv = mesh(new THREE.CylinderGeometry(0.16, 1.55, 0.52, 12), C_PERVANE,
                        { flat: true, metal: 0.55, rough: 0.35, name: 'pervane_' + i });
        pv.rotation.z = Math.PI / 2;
        pv.position.set(-48.9, 2.20, s * 2.45);
        modelGroup.add(pv);
        const dm = mesh(kutuGeo([[0, 0, 0, 3.10, 2.40, 0.42]]), C_GOVDE,
                        { flat: true, rough: 0.6, name: 'dumen_' + i });
        dm.position.set(-51.8, 2.45, s * 2.45);
        modelGroup.add(dm);
    }
    // SİNTİNE OMURGALARI (bilge keel) — yalpayı söndüren kanatlar.
    //
    // ⚠️ "GEMİNİN ORTASINDAKİ KESİT" BURASIYDI. İlk kurulumda kanat SIFIR
    // KALINLIKTA, `DoubleSide` bir levhaydı ve gemiyi x = -22 .. +14 arasında,
    // yani TAM ORTASINDA, uçları dik kesik düz bir şerit olarak sarıyordu.
    // Üç sebep birlikte onu "gemiyi kesen bir düzlem" gibi okutuyordu:
    //   1) Levhanın yüzü yataydan yalnız 32° eğik (kesit normali (0, -0.535,
    //      0.845), levhanın kendi normali (0, 0.845, 0.535)) -- yani NEREDEYSE
    //      YATAY bir raf. Anahtar ışık ona tam vuruyor.
    //   2) `DoubleSide` + `computeVertexNormals`: THREE arka yüzün normalini
    //      çevirdiği için levha her iki taraftan da TAM AYDINLIK; gövdedeki
    //      gibi bir gölge geçişi hiç yok, tekneden kopuk parlak bir dilim
    //      gibi duruyor. (Yolcu gemisindeki beyaz `kopuk_2` levhasıyla
    //      birebir aynı kusur sınıfı -- DEVIR §4.3.)
    //   3) Uçları dik kesikti; şerit hiçbir yere karışmadan bitiyordu.
    // ⚠️ Önceki tur bu maddeyi KÖPÜK ŞERİDİ sanıp onu düzeltmişti; ölçüm
    //    (kopuk_disari.js) orta gövdede köpüğün dışarıda 0.00 m² olduğunu
    //    gösteriyor, yani teşhis yanlıştı. Kusur bu kanattı.
    //
    // DÜZELTME: kanat KAPALI BİR KATI. Dikdörtgen kesit (derinlik × kalınlık)
    // x boyunca süpürülüyor, iki uçta kapak var; kökü tekneye 0.06 gömülü
    // (çatlak kalmasın), uçlarda derinlik smoothstep ile sıfıra iniyor
    // (gerçek sintine omurgaları da uçlarda faired'dır). `side` varsayılan
    // FrontSide: artık normal gölgeleniyor.
    // ⚠️ Derinlik 0.58 -> 0.38: kaynağa sadakat okunabilirliğin önüne
    //    geçmiyor (Furkan kuralı).
    // ⚠️ v = 0.24 ÖLÇÜLEREK seçildi (değişmedi). 0.30 + 0.62 payla kanat
    //    kutuyu 7.202'ye itiyordu; 0.24'te dışa taşma 0.47 m ve toplam 6.58,
    //    knuckle'ın 0.62 m içinde. Yeni derinlikle taşma daha da küçük.
    for (let s = -1; s <= 1; s += 2) {
        const P = [], IDX = [], N = 24, x1 = -22.0, x2 = 14.0;
        const DER = 0.38, KAL = 0.13, KOK = 0.06, UC = 0.22;
        for (let k = 0; k <= N; k++) {
            const u = k / N, x = x1 + (x2 - x1) * u;
            // Uçlarda derinlik smoothstep ile 0.02'ye iner (sıfır alanlı
            // üçgen çıkmasın diye tam sıfır değil).
            let e = Math.min(u, 1 - u) / UC;
            e = e >= 1 ? 1 : e * e * (3 - 2 * e);
            const der = 0.02 + (DER - 0.02) * e;
            const v = 0.24;                                   // sintine kıvrımı
            const p = kesitNokta(kesitPar(x), v), n = normal3(x, s * v);
            // Sağ elli çerçeve: eX × eD = eT  (eD dışa, eT kalınlık ekseni).
            const dy = n[1], dz = n[2], ty = -n[2], tz = n[1];
            const h = KAL / 2;
            // Halka sırası: kök+t, uç+t, uç-t, kök-t  (bkz. aşağıdaki sarım notu)
            P.push(x, p[1] - dy * KOK + ty * h, s * p[0] - dz * KOK + tz * h);
            P.push(x, p[1] + dy * der + ty * h, s * p[0] + dz * der + tz * h);
            P.push(x, p[1] + dy * der - ty * h, s * p[0] + dz * der - tz * h);
            P.push(x, p[1] - dy * KOK - ty * h, s * p[0] - dz * KOK - tz * h);
        }
        // ⚠️ SARIM TÜRETİLDİ, kopyalanmadı (DEVIR §4.2). Süpürme ekseni +x;
        // halka (eD, eT) düzleminde SAAT YÖNÜNDE yazılıyor. Yan yüzde
        // (a_j, b_j, a_j+1) sırasının normali eT × eX = eD, yani DIŞA.
        for (let k = 0; k < N; k++) {
            const a = k * 4, b = (k + 1) * 4;
            for (let j = 0; j < 4; j++) {
                const j2 = (j + 1) % 4;
                IDX.push(a + j, b + j, a + j2, a + j2, b + j, b + j2);
            }
        }
        // Kapaklar: yelpaze. Baş kapakta (x en küçük) dışarısı -x, kıç
        // kapağında +x; bu yüzden sıralar birbirinin tersi.
        for (const [taban, onYuz] of [[0, false], [N * 4, true]]) {
            let my = 0, mz = 0;
            for (let j = 0; j < 4; j++) {
                my += P[(taban + j) * 3 + 1]; mz += P[(taban + j) * 3 + 2];
            }
            const c = P.length / 3;
            P.push(P[taban * 3], my / 4, mz / 4);
            for (let j = 0; j < 4; j++) {
                const q = taban + j, r = taban + (j + 1) % 4;
                if (onYuz) IDX.push(c, r, q); else IDX.push(c, q, r);
            }
        }
        const g = new THREE.BufferGeometry();
        g.setAttribute('position', new THREE.Float32BufferAttribute(P, 3));
        g.setIndex(IDX);
        g.computeVertexNormals();
        const m = mesh(g, C_KARINA, { flat: true, rough: 0.85, metal: 0.06,
                                      name: 'sintine_omurga_' + (s < 0 ? 1 : 2) });
        m.castShadow = false;
        modelGroup.add(m);
    }
})();

// ===========================================================================
// 17. KNUCKLE ŞERİDİ — kırım hattını izleyen koyu bant
// ===========================================================================
// ⚠️ SABİT y İLE YAZILAMAZ. Knuckle yüksekliği x boyunca 5.15'ten
// 12.60'a çıkıyor; `yuzeyYama`nın [y1, y2] bandı bunu takip edemez ve
// şerit baş tarafta kırım hattının altında kalırdı. Bu yüzden şerit
// doğrudan KESİT PARAMETRESİNDEN (v = VB, yani knuckle'ın kendisi)
// süpürülüyor -- otobüsteki "bantlar w ile yazılır, y ile değil"
// dersinin aynısı.
(function knuckleSerit() {
    for (let s = -1; s <= 1; s += 2) {
        // ⚠️ N ve PAY ÖLÇÜLEREK BÜYÜTÜLDÜ. N=34 / pay 0.045 ile şerit
        // baş bölgesinde teknenin İÇİNE giriyordu (önden bakışta testere
        // dişi): orada kesit 3 metrede belirgin daralıyor, ardışık iki
        // istasyonu birleştiren KİRİŞ kavisi kesip gövdenin içinde
        // kalıyor. Aynı tuzak deniz rotasında da ölçülmüştü ("örnek
        // sayısı rotanın çözünürlüğüdür"). N=70 -> istasyon aralığı
        // 1.5 m, pay 0.075.
        const P = [], IDX = [], N = 70, x1 = -54.5, x2 = 49.0;
        for (let k = 0; k <= N; k++) {
            const x = x1 + (x2 - x1) * k / N;
            const pa = kesitNokta(kesitPar(x), VB - 0.060);
            const pb = kesitNokta(kesitPar(x), VB + 0.028);
            const n = normal3(x, s * VB);
            // ⚠️ z YARI_EN'e KIRPILIYOR. Kirişten kaçmak için payı 0.075'e
            // çıkarınca kutu z'si 14.456'ya (7.228 yarı) fırladı: knuckle
            // kesitin EN GENİŞ yeri, dışa öteleme oradan taşıyor. Loft
            // yüzeyi kirişlerle çizildiği için zaten gerçek 7.20'ye
            // varmıyor (örneklenen tepe 6.963); şeridi 7.20'ye kırpmak
            // hem geminin GERÇEK genişliğini koruyor hem şeridi yüzeyin
            // dışında tutuyor.
            const za = s * pa[0] + n[2] * 0.075, zb = s * pb[0] + n[2] * 0.075;
            P.push(x, pa[1] + n[1] * 0.075, Math.max(-YARI_EN, Math.min(YARI_EN, za)));
            P.push(x, pb[1] + n[1] * 0.075, Math.max(-YARI_EN, Math.min(YARI_EN, zb)));
        }
        for (let k = 0; k < N; k++) {
            const a = k * 2;
            IDX.push(a, a + 2, a + 3, a, a + 3, a + 1);
        }
        const g = new THREE.BufferGeometry();
        g.setAttribute('position', new THREE.Float32BufferAttribute(P, 3));
        g.setIndex(IDX);
        g.computeVertexNormals();
        const m = mesh(g, C_KOYU, { rough: 0.6, metal: 0.22,
                                    name: 'knuckle_' + (s < 0 ? 1 : 2) });
        m.material.side = THREE.DoubleSide;
        m.castShadow = false;
        modelGroup.add(m);
    }
})();

// ===========================================================================
// 18. BAŞ SONAR KUBBESİ
// ===========================================================================
// Gövdeye monteli sonar; forefoot'un altındaki şişkinlik. Alçak açılı
// bakışta geminin su altı hattını "kutu" olmaktan çıkaran şey.
// ⚠️ Kutunun tabanını AŞAĞI ÇEKMEMELİ: merkez y=2.00, yarı yükseklik
// 1.55 -> en alt nokta 0.45 > 0 (pervanede yapılan hatanın tekrarı
// olmasın diye önden hesaplandı).
(function sonar() {
    const g = new THREE.SphereGeometry(1.0, 14, 9);
    g.scale(4.30, 1.55, 1.32);
    g.translate(44.2, 2.00, 0);
    modelGroup.add(mesh(g, C_GOVDE, { rough: 0.55, metal: 0.20, name: 'sonar_kubbe' }));
})();

// ===========================================================================
// 19. UÇUŞ GÜVERTESİ IZGARASI VE EMNİYET AĞLARI
// ===========================================================================
// Gerçek uçuş güvertesinde helikopterin bağlandığı bağlama noktaları
// ızgara hâlinde dizilidir. Tepeden bakışta koyu güverteyi dokulandıran
// ve onu "boş bir levha" olmaktan çıkaran şey bu (tek mesh, §5a).
(function ucusIzgara() {
    const L = [];
    for (let i = 0; i < 9; i++) {
        const x = -53.0 + i * 2.70;
        const w = W_GUV(x) - 1.30, y = Y_GUV(x) + 0.28;
        for (let j = -2; j <= 2; j++)
            L.push([x, y, j * w / 2.2, 0.42, 0.03, 0.42]);
    }
    const m = kutular('ucus_izgara', L, C_KOYU, { rough: 0.9, metal: 0.05 });
    m.castShadow = false;
    m.material.polygonOffset = true;
    m.material.polygonOffsetFactor = -1;
    m.material.polygonOffsetUnits = -1;
})();
// EMNİYET AĞLARI — uçuş güvertesinin dışına sarkan katlanır platformlar.
(function emniyetAg() {
    const L = [];
    for (let s = -1; s <= 1; s += 2)
        for (let i = 0; i < 7; i++) {
            const x = -52.5 + i * 3.40;
            L.push([x, Y_GUV(x) - 0.12, s * (W_GUV(x) + 0.28), 2.90, 0.10, 0.90]);
        }
    const m = kutular('emniyet_ag', L, C_KOYU, { rough: 0.9, metal: 0.05 });
    m.castShadow = false;
})();

// ===========================================================================
// 20. ÜST YAPI KAPLARI, LOMBOZLARI VE GÜVERTE TEÇHİZATI
// ===========================================================================
// Düz bir üst yapı duvarı 30 metrelik boş bir levhaya düşer (otobüste
// ölçülmüş "düz yan yüz" hatası). Kapı ve lomboz dizisi hem ölçek veriyor
// hem yandan bakışta katları ayırıyor. Duvar İÇE EĞİK olduğu için
// panellerin z'si her katta ayrı hesaplandı; aynı z verilseydi üst kat
// panelleri duvarın içine gömülürdü (derinlik kavgası).
(function ustYapiPanel() {
    const L = [];
    const katlar = [[D01 + 1.35, 5.20 - 0.62 * 0.50, -6.0, 14.0],
                    [D02 + 1.30, 4.55 - 0.58 * 0.50, -4.5, 13.0],
                    [D03 + 0.55, 4.00 - 0.56 * 0.20,  4.0, 12.0]];
    for (const k of katlar) {
        const y = k[0], w = k[1] + 0.09;
        const n = Math.max(2, Math.round((k[3] - k[2]) / 2.2));
        for (let s = -1; s <= 1; s += 2)
            for (let i = 0; i <= n; i++)
                L.push([k[2] + (k[3] - k[2]) * i / n, y, s * w, 0.78, 0.62, 0.10]);
    }
    // Hangar bordalarındaki iki kapı.
    for (let s = -1; s <= 1; s += 2)
        L.push([-22.5, D01 + 1.25, s * 4.44, 1.10, 2.20, 0.12]);
    const m = kutular('ust_panel', L, C_CAM, { rough: 0.35, metal: 0.30 });
    m.castShadow = false;
})();
// Güverte havalandırmaları, ambar kapakları ve halat makaraları.
kutular('guverte_techizat',
        [[ 33.0, Y_GUV(33.0) + 0.35, -3.90, 2.20, 0.55, 1.10],
         [ 33.0, Y_GUV(33.0) + 0.35,  3.90, 2.20, 0.55, 1.10],
         [ 18.0, D01 + 0.40, -4.60, 2.60, 0.70, 1.20],
         [ 18.0, D01 + 0.40,  4.60, 2.60, 0.70, 1.20],
         [-32.6, Y_GUV(-32.6) + 0.45, -4.30, 1.60, 0.80, 1.30],
         [-32.6, Y_GUV(-32.6) + 0.45,  4.30, 1.60, 0.80, 1.30],
         [-36.5, Y_GUV(-36.5) + 0.28, 0, 1.90, 0.42, 1.90],
         [ 46.5, Y_GUV(46.5) + 0.28, 0, 2.20, 0.42, 1.60]],
        C_UST, { rough: 0.72 });
// DEMİR VE LOÇA — pruvanın iki yanında, bordaya gömülü.
(function demir() {
    const L = [];
    for (let s = -1; s <= 1; s += 2) {
        const x = 51.5, v = vYukseklik(x, Y_GUV(x) - 2.10);
        const p = nokta3(x, s * v), n = normal3(x, s * v);
        L.push([p[0], p[1], p[2] + n[2] * 0.10, 1.90, 1.35, 0.22]);
        L.push([p[0] - 0.30, p[1] + 0.10, p[2] + n[2] * 0.22, 1.15, 0.85, 0.16]);
    }
    const m = kutular('demir', L, C_KOYU, { rough: 0.8 });
    m.castShadow = false;
})();

// ===========================================================================
// 21. DİREK ÜSTÜ ANTENLER VE SEREN
// ===========================================================================
// Kapalı direğin üstünde kalan ince teçhizat: seren kolları, çanak
// besleyiciler ve dikey kırbaç antenler. Hepsi tek mesh (§5a).
(function direkTechizat() {
    const L = [];
    // seren (yardarm)
    L.push([0.15, KOPRU_UST + 7.40, 0, 0.26, 0.26, 8.20]);
    L.push([0.15, KOPRU_UST + 7.40, -4.00, 0.90, 0.55, 0.55]);
    L.push([0.15, KOPRU_UST + 7.40,  4.00, 0.90, 0.55, 0.55]);
    // kırbaç antenler
    for (let i = 0; i < 4; i++) {
        const s = i < 2 ? -1 : 1, x = -1.9 + (i % 2) * 3.6;
        L.push([x, KOPRU_UST + 6.10, s * 2.30, 0.12, 3.30, 0.12]);
    }
    // seyir radarı (küçük, sabit)
    L.push([0.15, DIREK_TEPE - 3.10, 0, 0.24, 0.90, 2.60]);
    kutular('direk_techizat', L, C_KROM,
            Object.assign({ flat: true }, KROM_MAL)).castShadow = false;
})();
