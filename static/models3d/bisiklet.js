// Bisiklet — şehir bisikleti: dik oturuş, çamurluklu, önde hasır sepet.
// Ulaşım temasının ilk modeli.
//
// PARÇALAR (Studio3D bu adları arar, DEĞİŞTİRME):
//   direksiyon                  → GRUP. Dönen takımın tamamı: ön teker, çatal,
//                                 ön çamurluk, boyun, gidon, tutamaklar, sepet.
//                                 Dönme ekseni userData.eksen'de (boyun
//                                 borusunun kendi doğrultusu).
//   aynakol_grup                → GRUP. Aynakol mili merkezli; iki kol, dişli
//                                 ve pedal yuvaları içinde. Davranış tekerin
//                                 dönüşünü dişli oranıyla (userData.oran)
//                                 çarpıp bu grubu döndürüyor.
//   pedal_yuva_1/2              → GRUP. Kolun ucunda; davranış ters döndürüp
//                                 pedalı YATAY tutuyor.
//   teker_on, teker_arka        → GRUP. Lastik + jant + göbek + parmaklar
//                                 içinde; _WHEELS grubu döndürünce hepsi
//                                 birlikte yuvarlanır. teker_on ayrıca
//                                 direksiyon grubunun içinde: hem yuvarlanır
//                                 hem kırar.
//   kadro_*, catal_1/2,
//   camurluk_on, camurluk_arka  → RENK ALIR (_TINT). Bisikletin gövde rengi.
//   *_lastik, *_jant, *_gobek,
//   *_parmak_*                  → renk ALMAZ. Lastik siyah, jant metal kalsın
//                                 diye: hepsi renk alsaydı bisiklet tek renk
//                                 bir siluete düşer ve TEPEDEN okunmaz olurdu.
//   sele, sele_burun,
//   gidon_tutamak_1/2           → İKİNCİL RENK (_TINT.parts2, panelde "Seat").
//                                 Deri takım; kadro renginden AYRI seçiliyor.
//   sepet_*, zincir, disli,
//   aynakol_*, pedal_*          → malzemesi kendi olan parçalar. Renk almaz.
//
// YÖN: burun +x (varsayılan duruşta ekranda sağa bakar), üst +y, taban y=0.
// ÖLÇÜ: gerçek metre — teker yarıçapı 0.34, dingil arası 1.09, kutu
// yaklaşık 1.86 x 1.07 x 0.60. sizeKm GENİŞLİĞİ ölçer, yani 1.86'yı.
//
// NEDEN ŞEHİR BİSİKLETİ: tema "ulaşım ve dolaşım". Yarış bisikleti spor,
// dağ bisikleti eğlence tarafında kalıyor; ulaşım aracı olan bisiklet bu.
//
// TEPEDEN OKUNURLUK: haritanın varsayılan bakışı tepeden ve bisiklet ince
// bir nesne. Telafi geometride: iki ÇAMURLUK (tepeden en geniş kütle),
// SEPET (kutu, tepeden net), geniş GİDON ve SELE. Bunlar olmasa tepeden
// yalnız iki ince halka görünürdü.

// ---- renkler --------------------------------------------------------------
const KADRO = '#2e6f6a';        // petrol yeşili — _TINT varsayılanı
const LASTIK_RENK = '#1b1b1e';  // zirhli-suv ile aynı lastik tonu (tutarlılık)
const JANT = '#8b9098';
const KROM = '#9aa1a9';
const DERI = '#4a2d15';         // sele + tutamak; buyutec'in ahşap tonu
const SEPET_RENK = '#7a5a2e';   // hasır. KOYU seçildi: 3B katmanın ışığı
                                // yukarı bakan yüzeyleri parlatıyor, açık
                                // ton beyaza yanıyor (rehber 6.3).
const ZINCIR = '#33373d';       // KOYU: ilk denemede açık griydi ve zincir
                                // kadronun arasında duran başıboş bir çubuk
                                // gibi okunuyordu. Koyulaşınca yağlı zincir
                                // hissi verip geri plana çekildi.

// ---- ölçüler --------------------------------------------------------------
const R_TEKER = 0.34;           // dış yarıçap (700c ≈ 0.35)
const LASTIK_ET = 0.036;        // lastiğin et kalınlığı
const R_JANT = 0.262;           // lastiğin iç kenarının hemen altı
const AKS_Y = R_TEKER;          // dingil yüksekliği — teker yere değsin

const ARKA_X = -0.53;
const ON_X = 0.56;              // çatal açısına göre hafif öne kaçık (rake)

// Kadro düğüm noktaları (yandan görünüş, z = 0)
const BB = [-0.05, 0.28];       // aynakol merkezi (bottom bracket)
const BOYUN_A = [0.46, 0.60];   // boyun borusu alt
const BOYUN_U = [0.375, 0.85];  // boyun borusu üst
const SELE_U = [-0.25, 0.80];   // sele borusu üst

// ---- DİREKSİYON GRUBU -----------------------------------------------------
// Bisikletde dönen şey tek başına ön teker DEĞİL: çatal, ön çamurluk, gidon
// ve gidona asılı sepet birlikte döner, hepsi de BOYUN BORUSUNUN eğik ekseni
// etrafında.
//
// Motorun _WHEELS.front mekanizması bunu yapamıyor: o, listedeki her parçayı
// KENDİ merkezinden geçen DİKEY eksende ayrı ayrı döndürüyor. Çatalı ve
// gidonu o listeye koysaydım her biri kendi merkezinde döner ve takım
// birbirinden ayrılırdı. Bu yüzden dönen her şey burada tek gruba konuyor;
// grubu 'bisiklet' davranışı (studio-3d.js registerBehavior) item.steerDeg
// ile döndürüyor.
//
// Grup boyun borusunun ALT ucuna oturuyor; içteki ikinci grup aynı öteleme
// kadar geri alıyor ki parça koordinatları model uzayında kalsın (yoksa
// bütün noktaları elle kaydırmak gerekirdi).
const DIR_PIVOT = [BOYUN_A[0], BOYUN_A[1], 0];
const direksiyon = new THREE.Group();
direksiyon.name = 'direksiyon';
direksiyon.position.set(DIR_PIVOT[0], DIR_PIVOT[1], DIR_PIVOT[2]);
// Eksen = boyun borusu alt→üst, birim. Yukarı baktığı için pozitif açı
// motorun yaw kuralıyla (saat yönü) aynı yöne kırıyor.
(function () {
    const dx = BOYUN_U[0] - BOYUN_A[0], dy = BOYUN_U[1] - BOYUN_A[1];
    const n = Math.sqrt(dx * dx + dy * dy);
    direksiyon.userData.eksen = [dx / n, dy / n, 0];
})();
const direksiyonIc = new THREE.Group();
direksiyonIc.position.set(-DIR_PIVOT[0], -DIR_PIVOT[1], -DIR_PIVOT[2]);
direksiyon.add(direksiyonIc);
modelGroup.add(direksiyon);

// Parçaların ekleneceği grup. Sabit takım için modelGroup, dönen takım için
// direksiyonIc. Aşağıda iki kez açıkça değiştiriliyor.
let HEDEF = modelGroup;

// ---- yardımcılar ----------------------------------------------------------
// İki nokta arasına boru koyar (zirhli-suv.js'teki rod deseni). Bisiklet
// baştan sona borulardan oluştuğu için asıl iş yükü burada.
function boru(p1, p2, r, renk, ad, metal, puruz) {
    const a = new THREE.Vector3(p1[0], p1[1], p1[2] || 0);
    const b = new THREE.Vector3(p2[0], p2[1], p2[2] || 0);
    const d = new THREE.Vector3().subVectors(b, a);
    const m = mesh(new THREE.CylinderGeometry(r, r, d.length(), 10), renk, {
        metal: metal == null ? 0.30 : metal,
        rough: puruz == null ? 0.45 : puruz,
        name: ad
    });
    m.position.set((a.x + b.x) / 2, (a.y + b.y) / 2, (a.z + b.z) / 2);
    m.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), d.normalize());
    HEDEF.add(m);
    return m;
}

const kutu = (w, h, d) => new THREE.BoxGeometry(w, h, d);

// ---- tekerlek --------------------------------------------------------------
// GRUP olarak kuruluyor. _WHEELS yuvarlanmayı `nesne.rotation.y = yol/yarıçap`
// ile yapıyor ve getObjectByName grupları da buluyor; lastik, jant, göbek ve
// parmaklar tek grupta olunca HEPSİ BİRLİKTE dönüyor. Ayrı meshler olsaydı
// her biri kendi merkezi etrafında dönerdi ve parmaklar lastikten kopardı.
//
// Grubun kendi rotation.x'i π/2: aks ±z'ye (sol-sağ) bakar. Euler XYZ
// sırasında Ry önce uygulanır, yani motorun yazdığı rotation.y tekerleği
// KENDİ mili etrafında döndürür; sonra Rx onu yatırır. Çocukların
// rotation.y'si serbest — motor yalnız adı verilen GRUBA dokunuyor.
function tekerlek(ad, x) {
    const g = new THREE.Group();
    g.name = ad;
    g.position.set(x, AKS_Y, 0);
    g.rotation.x = Math.PI / 2;

    // Lastik. Torus varsayılan olarak XY düzleminde (ekseni +z); ekseni +y
    // olmalı ki yuvarlanma doğru eksende olsun.
    const lastikGeo = new THREE.TorusGeometry(R_TEKER - LASTIK_ET, LASTIK_ET, 8, 30);
    lastikGeo.rotateX(Math.PI / 2);
    g.add(mesh(lastikGeo, LASTIK_RENK, { rough: 0.95, name: ad + '_lastik' }));

    // Jant: AÇIK uçlu silindir. Kapaklı olsaydı üst kapağı parmakları ve
    // arkasındaki her şeyi örterdi (rehber 6.2).
    const jant = mesh(
        new THREE.CylinderGeometry(R_JANT, R_JANT, 0.028, 30, 1, true),
        JANT, { metal: 0.55, rough: 0.35, name: ad + '_jant' });
    jant.material.side = THREE.DoubleSide;   // içeriden de görünsün
    g.add(jant);

    // Göbek
    g.add(mesh(new THREE.CylinderGeometry(0.030, 0.030, 0.082, 10), KROM,
               { metal: 0.5, rough: 0.35, name: ad + '_gobek' }));

    // Parmaklar: 3 çubuk = 6 parmak. Gerçek bisiklette 32 tane var ama
    // harita ölçeğinde ince teller titreşim (aliasing) gürültüsüne dönüşüyor;
    // kalın ve az parmak low-poly üslupla da tutarlı.
    for (let i = 0; i < 3; i++) {
        const p = mesh(kutu(R_JANT * 2 - 0.02, 0.011, 0.011), KROM,
                       { metal: 0.5, rough: 0.4, name: ad + '_parmak_' + (i + 1) });
        p.rotation.y = (i / 3) * Math.PI;
        g.add(p);
    }
    HEDEF.add(g);
    return g;
}

// ---- çamurluk --------------------------------------------------------------
// Tekerleğin üstünde kavisli bant.
//
// ÖNCE KISMİ AÇIK SİLİNDİRLE YAPILDI, BIRAKILDI: silindirin ekseni ±z'ye
// bakıyordu, yani yüzey KALINLIKSIZ bir kabuktu. Önden çizimde (bakış tam
// aks doğrultusunda) kabuk kenarından görülüyor ve saç teli inceliğinde bir
// çizgiye düşüyordu — parça listede vardı ama silüette tek piksel
// kaplamıyordu, "çamurluk yok" sandım.
//
// Doğrusu HALKA DİLİMİNİ kalınlık vererek extrude etmek: şekil zaten
// bisikletin yan düzleminde (XY), derinlik ±z'ye gidiyor. Böylece çamurluğun
// hem eni hem eti var, her açıdan katı görünüyor.
//
// TUZAK 6.1: iki yayın uçları FARKLI yarıçapta olduğu için kopya nokta
// çıkmıyor, kapanış Shape'e bırakılıyor. Pah KAPALI — ince halkada pah
// silueti şişirirdi.
const CAM_IC = R_TEKER + 0.026;    // lastiğin hemen üstü
const CAM_DIS = R_TEKER + 0.045;
function camurluk(ad, x, a0, a1) {
    const s = new THREE.Shape();
    s.absarc(0, 0, CAM_DIS, a0, a1, false);   // dış yay ileri
    s.absarc(0, 0, CAM_IC, a1, a0, true);     // iç yay geri
    const geo = new THREE.ExtrudeGeometry(s, {
        depth: 0.080, bevelEnabled: false, curveSegments: 26
    });
    geo.translate(0, 0, -0.080 / 2);          // genişlik iki yana eşit
    const m = mesh(geo, KADRO, { metal: 0.35, rough: 0.45, name: ad });
    m.position.set(x, AKS_Y, 0);
    HEDEF.add(m);
}

// ===========================================================================
// SABİT TAKIM — kadroya bağlı, direksiyonla dönmez
// ===========================================================================
HEDEF = modelGroup;

tekerlek('teker_arka', ARKA_X);
// Açı +x'ten saat yönünün TERSİNE: 0° ön, 90° tepe, 180° arka.
camurluk('camurluk_arka', ARKA_X, Math.PI * 0.17, Math.PI * 1.14);   // 31° → 205°

// ---- kadro ----
// Klasik elmas kadro. Üst boru ve alt boru boyun borusuna, sele borusu
// aynakola bağlanıyor; arkada iki çift ince boru dingile gidiyor.
// Boyun borusu SABİT: içindeki gaz borusu döner, boru kadronun parçasıdır.
boru(BOYUN_A, BOYUN_U, 0.023, KADRO, 'kadro_boyun');
boru([-0.25, 0.785], [0.385, 0.822], 0.021, KADRO, 'kadro_ust');
boru(BB, [0.450, 0.632], 0.025, KADRO, 'kadro_alt');
boru(BB, SELE_U, 0.022, KADRO, 'kadro_sele');
// arka üçgen: altta zincir bakımları, üstte sele bacakları
boru([BB[0], BB[1], 0.055], [ARKA_X, AKS_Y, 0.055], 0.014, KADRO, 'kadro_arka_alt_1');
boru([BB[0], BB[1], -0.055], [ARKA_X, AKS_Y, -0.055], 0.014, KADRO, 'kadro_arka_alt_2');
boru([-0.25, 0.775, 0.048], [ARKA_X, AKS_Y, 0.048], 0.012, KADRO, 'kadro_arka_ust_1');
boru([-0.25, 0.775, -0.048], [ARKA_X, AKS_Y, -0.048], 0.012, KADRO, 'kadro_arka_ust_2');

// ---- sele ----
boru(SELE_U, [-0.335, 1.022], 0.016, KROM, 'sele_borusu', 0.6, 0.3);
// Sele KUTUDAN DEĞİL, yassılaştırılmış küreden. Kutuyla yapılan ilk hali
// önden çizimde düz bir tahta gibi duruyordu; selenin karakteri kavisli
// olması. Arkada geniş oturma yeri, önde daralan burun: iki elipsoit.
function seleParca(ad, sx, sy, sz, x, y) {
    const m = mesh(new THREE.SphereGeometry(1, 16, 10), DERI,
                   { rough: 0.75, name: ad });
    m.scale.set(sx, sy, sz);
    m.position.set(x, y, 0);
    HEDEF.add(m);
}
seleParca('sele', 0.105, 0.027, 0.066, -0.352, 1.041);
seleParca('sele_burun', 0.088, 0.019, 0.026, -0.238, 1.036);

// ---- aktarma ----
// Aynakol, dişli, pedallar, zincir.
//
// AYNAKOL TAKIMI DA GRUP — direksiyonla aynı desen. Grubun merkezi aynakol
// mili (BB); dönen her şey (iki kol, dişli, pedal yuvaları) içinde. Davranış
// yalnız `aynakol_grup.rotation.z`'yi yazıyor.
//
// NEDEN _WHEELS'e EKLENMEDİ: _WHEELS listedeki her şeyi TEKER hızında
// döndürüyor (yol / teker yarıçapı). Gerçek bir aynakol bundan çok daha yavaş
// döner — zincir hızı iki dişlide aynı olduğu için oran arka dişli/ön dişli.
// Bu modelde 0.048 / 0.105 = 0.457, yani teker bir tur atarken aynakol
// 0.457 tur. Oranı MODELİN KENDİ geometrisinden türetip userData'ya yazıyoruz
// ki motor tarafında sabit tekrarlanmasın.
const R_DISLI = 0.105;      // ön dişli (aynakol) yarıçapı
const R_ARKA_DISLI = 0.048; // arka dişli yarıçapı

const aynakolGrup = new THREE.Group();
aynakolGrup.name = 'aynakol_grup';
aynakolGrup.position.set(BB[0], BB[1], 0);
aynakolGrup.userData.oran = R_ARKA_DISLI / R_DISLI;
modelGroup.add(aynakolGrup);

const disli = mesh(new THREE.CylinderGeometry(R_DISLI, R_DISLI, 0.010, 24, 1, true),
                   KROM, { metal: 0.6, rough: 0.3, name: 'disli' });
disli.material.side = THREE.DoubleSide;
disli.rotation.x = Math.PI / 2;
disli.position.set(0, 0, 0.055);
aynakolGrup.add(disli);

// Arka dişli tekerin miline sabit. Kendi ekseninde simetrik olduğu için
// döndürmenin görsel karşılığı yok, o yüzden teker grubuna alınmadı.
const arkaDisli = mesh(new THREE.CylinderGeometry(R_ARKA_DISLI, R_ARKA_DISLI, 0.010, 18, 1, true),
                       KROM, { metal: 0.6, rough: 0.3, name: 'arka_disli' });
arkaDisli.material.side = THREE.DoubleSide;
arkaDisli.rotation.x = Math.PI / 2;
arkaDisli.position.set(ARKA_X, AKS_Y, 0.055);
modelGroup.add(arkaDisli);

// Aynakollar karşılıklı (biri önde aşağı, öteki arkada yukarı) — duran bir
// bisikletde pedallar hep böyle durur. Bu açı BAŞLANGIÇ duruşu; grubun
// dönüşü bunun ÜSTÜNE biniyor.
const KOL = 0.17, KOL_ACI = -0.70;   // rad, öne-aşağı
function aynakol(ad, aci, z, yuvaAd, pedalAd) {
    const k = mesh(kutu(KOL, 0.026, 0.016), KROM,
                   { metal: 0.55, rough: 0.35, name: ad });
    k.position.set(Math.cos(aci) * KOL / 2, Math.sin(aci) * KOL / 2, z);
    k.rotation.z = aci;
    aynakolGrup.add(k);
    // Pedal KENDİ yuvasında: yuva kolun ucunda döner ama davranış onu ters
    // döndürüp YATAY tutuyor. Gerçek pedal da milinde serbesttir, ayakla
    // birlikte yatay kalır; kolla birlikte takla atsaydı yanlış olurdu.
    const yuva = new THREE.Group();
    yuva.name = yuvaAd;
    yuva.position.set(Math.cos(aci) * KOL, Math.sin(aci) * KOL,
                      z + (z > 0 ? 0.036 : -0.036));
    aynakolGrup.add(yuva);
    const p = mesh(kutu(0.088, 0.014, 0.046), ZINCIR, { rough: 0.7, name: pedalAd });
    yuva.add(p);
}
aynakol('aynakol_1', KOL_ACI, 0.075, 'pedal_yuva_1', 'pedal_1');
aynakol('aynakol_2', KOL_ACI + Math.PI, -0.075, 'pedal_yuva_2', 'pedal_2');

// Zincir: üst ve alt kol. Harita ölçeğinde iki ince boru yeterli, baklaları
// çizmek yalnız gürültü üretirdi.
boru([BB[0], BB[1] + 0.105, 0.055], [ARKA_X, AKS_Y + 0.048, 0.055], 0.008, ZINCIR, 'zincir', 0.4, 0.6);
boru([BB[0], BB[1] - 0.105, 0.055], [ARKA_X, AKS_Y - 0.048, 0.055], 0.008, ZINCIR, 'zincir_alt', 0.4, 0.6);

// ===========================================================================
// DÖNEN TAKIM — direksiyonla birlikte kırar
// ===========================================================================
HEDEF = direksiyonIc;

tekerlek('teker_on', ON_X);
camurluk('camurluk_on', ON_X, 0.14, Math.PI * 0.83);          // 8° → 149°

// çatal: boyun borusunun altından ön dingile, iki bacak
boru([BOYUN_A[0], BOYUN_A[1], 0.048], [ON_X, AKS_Y, 0.048], 0.016, KADRO, 'catal_1');
boru([BOYUN_A[0], BOYUN_A[1], -0.048], [ON_X, AKS_Y, -0.048], 0.016, KADRO, 'catal_2');

// ---- boyun + gidon ----
// Şehir bisikletinin geriye kıvrık gidonu: orta bar, iki kol, iki tutamak.
boru(BOYUN_U, [0.325, 0.985], 0.020, KROM, 'boyun', 0.6, 0.3);
boru([0.325, 0.995, -0.09], [0.325, 0.995, 0.09], 0.015, KROM, 'gidon', 0.6, 0.3);
boru([0.325, 0.995, 0.09], [0.255, 1.005, 0.225], 0.014, KROM, 'gidon_kol_1', 0.6, 0.3);
boru([0.325, 0.995, -0.09], [0.255, 1.005, -0.225], 0.014, KROM, 'gidon_kol_2', 0.6, 0.3);
boru([0.248, 1.006, 0.238], [0.224, 1.010, 0.288], 0.021, DERI, 'gidon_tutamak_1', 0, 0.8);
boru([0.248, 1.006, -0.238], [0.224, 1.010, -0.288], 0.021, DERI, 'gidon_tutamak_2', 0, 0.8);

// ---- sepet ----
// Gidona asılı olduğu için DÖNEN takımda: direksiyon kırınca sepet de döner.
//
// KONUM DÜZELTİLDİ: ilk halde merkez x=0.50'deydi ve arka paneli x=0.37'ye
// geliyordu — boyun borusunun üst ucu (x=0.375) ve boyun tam oradaydı, yani
// sepet bisikletin ön takımının İÇİNE giriyordu. Merkez 0.60'a alındı,
// arka panel 0.47'ye çekildi: boyun borusuyla arada 0.10 boşluk var.
// Yükseklik de 0.03 arttı ki çamurluğun tepesiyle (x=0.60'ta y≈0.72) arada
// belirgin bir aralık kalsın.
const S_X = 0.60, S_Y = 0.862, S_DERIN = 0.26, S_BOY = 0.185, S_EN = 0.28, S_ET = 0.012;
function sepetPanel(ad, w, h, d, x, y, z) {
    const m = mesh(kutu(w, h, d), SEPET_RENK, { rough: 0.85, name: ad });
    m.position.set(x, y, z);
    HEDEF.add(m);
}
sepetPanel('sepet_taban', S_DERIN, S_ET, S_EN, S_X, S_Y - S_BOY / 2, 0);
sepetPanel('sepet_on', S_ET, S_BOY, S_EN, S_X + S_DERIN / 2, S_Y, 0);
sepetPanel('sepet_arka', S_ET, S_BOY, S_EN, S_X - S_DERIN / 2, S_Y, 0);
sepetPanel('sepet_yan_1', S_DERIN, S_BOY, S_ET, S_X, S_Y, S_EN / 2);
sepetPanel('sepet_yan_2', S_DERIN, S_BOY, S_ET, S_X, S_Y, -S_EN / 2);
// Ağız kenarı: dört ince çıta. Kenarsız hali tepeden bakışta düz kahverengi
// bir kutuydu; çıta hem sepet olduğunu anlatıyor hem tepeden gelen ışıkta
// bir kenar çizgisi üretip kutuyu haritadan ayırıyor.
const SEPET_CITA = '#5f4622';
const S_UST = S_Y + S_BOY / 2;
function sepetCita(ad, w, d, x, z) {
    const m = mesh(kutu(w, 0.018, d), SEPET_CITA, { rough: 0.8, name: ad });
    m.position.set(x, S_UST, z);
    HEDEF.add(m);
}
sepetCita('sepet_cita_1', 0.020, S_EN + 0.016, S_X + S_DERIN / 2, 0);
sepetCita('sepet_cita_2', 0.020, S_EN + 0.016, S_X - S_DERIN / 2, 0);
sepetCita('sepet_cita_3', S_DERIN + 0.016, 0.020, S_X, S_EN / 2);
sepetCita('sepet_cita_4', S_DERIN + 0.016, 0.020, S_X, -S_EN / 2);
// Taşıyıcılar: üstte boyun borusuna kısa kol, altta çatala uzun payanda.
// Payandalar çamurluğun DIŞINDAN geçiyor (çamurluk ±0.040, payanda ±0.052).
boru([S_X - S_DERIN / 2 + 0.03, S_Y - S_BOY / 2, 0.085], [0.421, 0.715, 0.028],
     0.009, KROM, 'sepet_kol_1', 0.6, 0.3);
boru([S_X - S_DERIN / 2 + 0.03, S_Y - S_BOY / 2, -0.085], [0.421, 0.715, -0.028],
     0.009, KROM, 'sepet_kol_2', 0.6, 0.3);
boru([S_X + S_DERIN / 2 - 0.02, S_Y - S_BOY / 2, 0.095], [0.505, 0.475, 0.052],
     0.008, KROM, 'sepet_payanda_1', 0.6, 0.3);
boru([S_X + S_DERIN / 2 - 0.02, S_Y - S_BOY / 2, -0.095], [0.505, 0.475, -0.052],
     0.008, KROM, 'sepet_payanda_2', 0.6, 0.3);

HEDEF = modelGroup;   // dönen takım bitti

// ---- yan sehpa: BİLEREK YOK -----------------------------------------------
// İlk halde vardı, ÇIKARILDI. İki sebep:
//   1. Doğruluk. İnik sehpa duran bisikletin hali; bu model sürülüyor
//      (tekerlekler yuvarlanıyor). Sürerken inik duran bir sehpa yanlış.
//   2. Okunurluk. Aynakol, pedallar ve zincirin arasına giren üçüncü bir
//      çubuk alt bölgeyi çubuk yığınına çeviriyordu.
// Sehpanın yeri, "durunca inip kalkma" animasyonuyla birlikte gelmek.

// ---- sepette yazı yüzeyi: BİLEREK YOK --------------------------------------
// İlk halde sepetin iki yanında yazı/görsel düzlemi vardı ve çalışıyordu.
// Furkan "kullanışlı bir şey değil" dedi, kaldırıldı: harita ölçeğinde bir
// bisiklet sepetine yazılan yazı okunacak kadar büyük çıkmıyor, ve panelde
// bir denetim daha açmanın karşılığı yok. _YUZEY tablosundaki satır da
// kaldırıldı.
