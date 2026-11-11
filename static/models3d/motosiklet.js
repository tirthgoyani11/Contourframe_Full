// Motosiklet — sokak (naked) motosikleti: yuvarlak far, açıkta motor bloğu,
// dik gidon, damla depo. Ulaşım temasının ikinci modeli.
//
// PARÇALAR (Studio3D bu adları arar, DEĞİŞTİRME):
//   direksiyon                  → GRUP. Dönen takımın tamamı: ön teker, ön
//                                 çamurluk, çatal, alt bacaklar, makas, gidon,
//                                 tutamaklar, aynalar, far. Dönme ekseni
//                                 userData.eksen'de (boyun borusu doğrultusu).
//   teker_on, teker_arka        → GRUP. Lastik + jant + göbek + 5 döküm kol +
//                                 fren diski (arkada ayrıca dişli) içinde;
//                                 _WHEELS grubu döndürünce hepsi birlikte
//                                 yuvarlanır. teker_on ayrıca direksiyon
//                                 grubunun içinde: hem yuvarlanır hem kırar.
//   depo, depo_burun, kuyruk,
//   camurluk_on, camurluk_arka  → RENK ALIR (_TINT). Motosikletin gövde rengi.
//                                 `kuyruk` sele tabanı + yan kapak + kuyruk
//                                 kütlesinin TAMAMI (yandan siluetten extrude).
//   sele, tutamak_1/2           → İKİNCİL RENK (_TINT.parts2, panelde "Seat").
//                                 Gövdeden AYRI seçilebiliyor; ikisi tek renk
//                                 olsaydı motosiklet tek parça gibi okunurdu.
//   *_lastik, *_jant, *_kol_*,
//   *_disk, motor_*, egzoz_*,
//   ayna_*, catal_*             → renk ALMAZ. Lastik siyah, motor koyu metal,
//                                 egzoz krom kalsın diye.
//
// YÖN: burun +x, üst +y, taban y=0. Ölçüler gerçek metre.
// ÖLÇÜ: teker yarıçapı 0.30, dingil arası 1.42, kutu ~2.06 x 1.19 x 0.78.
//
// BİSİKLETTEN NEDEN AYRIŞIYOR: ikisi de iki tekerli ve kütüphanede yan yana
// duracaklar. Ayrım geometride kuruldu — DÖKÜM JANT (5 kollu yıldız, bisikletin
// tel parmaklarına karşı), KALIN lastik, DEPO (bisikletde olmayan büyük kütle),
// MOTOR BLOĞU, EGZOZ ve AYNALAR. Aynalar tepeden bakışta iki belirgin nokta
// veriyor; bisikletde bu işi sepet yapıyordu.

// ---- renkler --------------------------------------------------------------
const GOVDE = '#8c2f2a';        // koyu kırmızı — _TINT varsayılanı
const LASTIK_RENK = '#1b1b1e';  // kütüphanedeki ortak lastik tonu
const JANT = '#6f757e';         // döküm jant: bisikletin parlak kromundan
                                // bilerek KOYU, iki model karışmasın diye
const KROM = '#a8afb8';
const MOTOR = '#4c5158';        // motor bloğu
const EGZOZ_RENK = '#b9c0c8';
const SIYAH = '#232326';        // sele, tutamak, lastik dışı koyu parçalar

// ---- ölçüler --------------------------------------------------------------
const R_TEKER = 0.30;
const LASTIK_ON = 0.052;        // ön lastik eti
const LASTIK_ARKA = 0.068;      // arka daha kalın (gerçekte de öyle)
const AKS_Y = R_TEKER;

const ARKA_X = -0.66;
const ON_X = 0.755;             // dingil arası 1.415

// Boyun borusu (direksiyon ekseni) — yaklaşık 23 derece rake
const BOYUN_A = [0.62, 0.60];
const BOYUN_U = [0.50, 0.88];

// ---- DİREKSİYON GRUBU -----------------------------------------------------
// Bisikletdeki desenin aynısı. Motorun _WHEELS.front mekanizması burada da
// KULLANILAMIYOR: o, listedeki her parçayı kendi merkezinden geçen dikey
// eksende ayrı ayrı döndürüyor; motosikletde dönen şey çatal + alt bacaklar +
// ön çamurluk + gidon + aynalar + far + ön teker BİRLİKTE, ve eksen boyun
// borusunun eğik ekseni.
//
// Dış grup pivota oturuyor, içteki grup aynı ötelemeyi geri alıyor ki parça
// koordinatları model uzayında kalsın.
const DIR_PIVOT = [BOYUN_A[0], BOYUN_A[1], 0];
const direksiyon = new THREE.Group();
direksiyon.name = 'direksiyon';
direksiyon.position.set(DIR_PIVOT[0], DIR_PIVOT[1], DIR_PIVOT[2]);
(function () {
    const dx = BOYUN_U[0] - BOYUN_A[0], dy = BOYUN_U[1] - BOYUN_A[1];
    const n = Math.sqrt(dx * dx + dy * dy);
    direksiyon.userData.eksen = [dx / n, dy / n, 0];
})();
const direksiyonIc = new THREE.Group();
direksiyonIc.position.set(-DIR_PIVOT[0], -DIR_PIVOT[1], -DIR_PIVOT[2]);
direksiyon.add(direksiyonIc);
modelGroup.add(direksiyon);

// Parçaların ekleneceği grup; aşağıda iki kez açıkça değiştiriliyor.
let HEDEF = modelGroup;

// ---- yardımcılar ----------------------------------------------------------
function boru(p1, p2, r, renk, ad, metal, puruz) {
    const a = new THREE.Vector3(p1[0], p1[1], p1[2] || 0);
    const b = new THREE.Vector3(p2[0], p2[1], p2[2] || 0);
    const d = new THREE.Vector3().subVectors(b, a);
    const m = mesh(new THREE.CylinderGeometry(r, r, d.length(), 12), renk, {
        metal: metal == null ? 0.35 : metal,
        rough: puruz == null ? 0.45 : puruz,
        name: ad
    });
    m.position.set((a.x + b.x) / 2, (a.y + b.y) / 2, (a.z + b.z) / 2);
    m.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), d.normalize());
    HEDEF.add(m);
    return m;
}
const kutu = (w, h, d) => new THREE.BoxGeometry(w, h, d);

// Yassılaştırılmış küre — depo, sele, ayna gibi kavisli kütleler için.
function elipsoit(ad, sx, sy, sz, x, y, z, renk, puruz, metal) {
    const m = mesh(new THREE.SphereGeometry(1, 18, 12), renk, {
        rough: puruz == null ? 0.5 : puruz,
        metal: metal == null ? 0.25 : metal,
        name: ad
    });
    m.scale.set(sx, sy, sz);
    m.position.set(x, y, z || 0);
    HEDEF.add(m);
    return m;
}

// ---- tekerlek --------------------------------------------------------------
// Bisikletdeki grup deseninin aynısı: grup rotation.x = π/2 ile yatırılıyor,
// rotation.y motora bırakılıyor. Fark JANT: burada tel parmak değil 5 KOLLU
// DÖKÜM jant — motosikletin gerçek jantı bu, ve kütüphanede bisikletle
// karışmamasını sağlıyor.
function tekerlek(ad, x, lastikEt, disliVar) {
    const g = new THREE.Group();
    g.name = ad;
    g.position.set(x, AKS_Y, 0);
    g.rotation.x = Math.PI / 2;

    const R_JANT = R_TEKER - lastikEt * 2 - 0.012;
    const EN = lastikEt * 2.0;          // lastik genişliği

    // Lastik: torus. Varsayılan XY düzleminde (ekseni +z), ekseni +y olmalı.
    const lastikGeo = new THREE.TorusGeometry(R_TEKER - lastikEt, lastikEt, 10, 30);
    lastikGeo.rotateX(Math.PI / 2);
    g.add(mesh(lastikGeo, LASTIK_RENK, { rough: 0.95, name: ad + '_lastik' }));

    // Jant: AÇIK uçlu silindir (kapaklı olsaydı kolları örterdi, rehber 6.2)
    const jant = mesh(new THREE.CylinderGeometry(R_JANT, R_JANT, EN * 0.9, 30, 1, true),
                      JANT, { metal: 0.6, rough: 0.35, name: ad + '_jant' });
    jant.material.side = THREE.DoubleSide;
    g.add(jant);

    // Göbek
    g.add(mesh(new THREE.CylinderGeometry(0.055, 0.055, EN * 0.95, 14), JANT,
               { metal: 0.55, rough: 0.4, name: ad + '_gobek' }));

    // 5 döküm kol. Tek sayı olduğu için ortadan geçen çubuk kullanılamıyor;
    // her kol göbekten dışarı uzanıyor. Açısal dağılım GEOMETRİYE işleniyor.
    for (let i = 0; i < 5; i++) {
        const uzun = R_JANT - 0.045;
        const geo = kutu(uzun, EN * 0.42, 0.062);
        geo.translate(uzun / 2 + 0.045, 0, 0);       // göbekten dışarı taşı
        geo.rotateY(i * Math.PI * 2 / 5);
        g.add(mesh(geo, JANT, { metal: 0.55, rough: 0.4, name: ad + '_kol_' + (i + 1) }));
    }

    // Fren diski: AÇIK uçlu ince halka, tekerin yanında.
    const disk = mesh(new THREE.CylinderGeometry(R_TEKER * 0.60, R_TEKER * 0.60,
                                                 0.010, 26, 1, true),
                      KROM, { metal: 0.75, rough: 0.25, name: ad + '_disk' });
    disk.material.side = THREE.DoubleSide;
    disk.position.y = EN * 0.75;
    g.add(disk);

    // Arka dişli: tekerin miline sabit, yani teker grubunda — dönüşü gerçek.
    if (disliVar) {
        const d = mesh(new THREE.CylinderGeometry(0.115, 0.115, 0.012, 22, 1, true),
                       JANT, { metal: 0.6, rough: 0.35, name: ad + '_disli' });
        d.material.side = THREE.DoubleSide;
        d.position.y = -EN * 0.80;
        g.add(d);
    }
    HEDEF.add(g);
    return g;
}

// ---- çamurluk --------------------------------------------------------------
// Halka dilimi extrude — bisikletde ölçülen ders: kısmi açık silindir
// kalınlıksız kabuk olduğu için aks doğrultusundan bakınca kayboluyordu.
function camurluk(ad, x, a0, a1, ic, dis, en) {
    const s = new THREE.Shape();
    s.absarc(0, 0, dis, a0, a1, false);
    s.absarc(0, 0, ic, a1, a0, true);
    const geo = new THREE.ExtrudeGeometry(s, {
        depth: en, bevelEnabled: false, curveSegments: 26
    });
    geo.translate(0, 0, -en / 2);
    const m = mesh(geo, GOVDE, { metal: 0.35, rough: 0.4, name: ad });
    m.position.set(x, AKS_Y, 0);
    HEDEF.add(m);
}

// ===========================================================================
// SABİT TAKIM
// ===========================================================================
HEDEF = modelGroup;

tekerlek('teker_arka', ARKA_X, LASTIK_ARKA, true);
// Arka çamurluk. İLK HALİ 18°-189° ARASIYDI, KISALTILDI: o kadar geniş yay
// tekerin önünden arkasına kadar inen ince bir çember gibi okunuyordu,
// çamurluk değil. Motosiklet çamurluğu tekerin üstünü ve arkasını kapatır,
// önüne inmez. Et kalınlığı da 0.022'den 0.032'ye çıkarıldı — ince bant
// harita ölçeğinde tel gibi kalıyordu.
camurluk('camurluk_arka', ARKA_X, Math.PI * 0.33, Math.PI * 1.03,
         R_TEKER + 0.026, R_TEKER + 0.058, 0.175);

// ---- şasi ----
// Boyun borusundan arkaya giden ana kiriş, aşağıdan motoru saran alt kiriş,
// selenin altındaki arka çatı.
// YÜKSEKLİKLER DÜŞÜRÜLDÜ: ilk halde arka şasi 0.78'de, sele 0.95'teydi ve
// aradaki 0.11'lik boşluk yüzünden sele havada duruyordu. Ayrıca gerçek bir
// naked motosikletde sele yüksekliği yaklaşık 0.85 m — ilk hâli fazla
// yüksekti, motosiklet uzun bacaklı görünüyordu.
boru(BOYUN_A, BOYUN_U, 0.042, MOTOR, 'sase_boyun', 0.5, 0.4);
boru([0.575, 0.775, 0.075], [0.02, 0.715, 0.115], 0.036, MOTOR, 'sase_ust_1', 0.5, 0.4);
boru([0.575, 0.775, -0.075], [0.02, 0.715, -0.115], 0.036, MOTOR, 'sase_ust_2', 0.5, 0.4);
boru([0.605, 0.585], [0.235, 0.315], 0.030, MOTOR, 'sase_alt', 0.5, 0.4);
boru([0.02, 0.715, 0.10], [-0.50, 0.790, 0.085], 0.024, MOTOR, 'sase_arka_1', 0.5, 0.4);
boru([0.02, 0.715, -0.10], [-0.50, 0.790, -0.085], 0.024, MOTOR, 'sase_arka_2', 0.5, 0.4);

// Salıncak: mil (-0.02, 0.375) → arka dingil. Amortisör tek, yatık (monoshock).
boru([-0.02, 0.375, 0.105], [ARKA_X, AKS_Y, 0.105], 0.030, MOTOR, 'salincak_1', 0.55, 0.35);
boru([-0.02, 0.375, -0.105], [ARKA_X, AKS_Y, -0.105], 0.030, MOTOR, 'salincak_2', 0.55, 0.35);
boru([-0.06, 0.700], [-0.315, 0.375], 0.032, KROM, 'amortisor', 0.6, 0.3);

// ---- motor ----
// Blok + öne eğik silindir kafası + soğutma kanatları. Motosikletin
// bisikletde olmayan en büyük kütlesi.
(function () {
    const blok = mesh(kutu(0.44, 0.32, 0.34), MOTOR,
                      { metal: 0.5, rough: 0.45, flat: true, name: 'motor_blok' });
    blok.position.set(0.235, 0.455, 0);
    modelGroup.add(blok);
    const kafa = mesh(kutu(0.26, 0.26, 0.30), MOTOR,
                      { metal: 0.5, rough: 0.45, flat: true, name: 'motor_silindir' });
    kafa.position.set(0.375, 0.665, 0);
    kafa.rotation.z = -0.22;                      // öne eğik
    modelGroup.add(kafa);
    for (let i = 0; i < 3; i++) {
        const k = mesh(kutu(0.28, 0.022, 0.325), KROM,
                       { metal: 0.5, rough: 0.4, name: 'motor_kanat_' + (i + 1) });
        k.position.set(0.372 - i * 0.012, 0.60 + i * 0.055, 0);
        k.rotation.z = -0.22;
        modelGroup.add(k);
    }
    // Kapak (debriyaj) — sağ yanda daire
    const kapak = mesh(new THREE.CylinderGeometry(0.115, 0.115, 0.035, 20), KROM,
                       { metal: 0.6, rough: 0.3, name: 'motor_kapak' });
    kapak.rotation.x = Math.PI / 2;
    kapak.position.set(0.19, 0.415, 0.175);
    modelGroup.add(kapak);
})();

// ---- egzoz ----
// Kafa altından çıkıp sağdan (−z) arkaya giden boru + susturucu.
boru([0.40, 0.545, -0.09], [0.20, 0.375, -0.13], 0.030, EGZOZ_RENK, 'egzoz_boru_1', 0.75, 0.25);
boru([0.20, 0.375, -0.13], [-0.16, 0.360, -0.155], 0.030, EGZOZ_RENK, 'egzoz_boru_2', 0.75, 0.25);
(function () {
    const s = mesh(new THREE.CylinderGeometry(0.062, 0.052, 0.42, 18), EGZOZ_RENK,
                   { metal: 0.8, rough: 0.22, name: 'susturucu' });
    s.position.set(-0.38, 0.415, -0.165);
    s.rotation.z = Math.PI / 2;
    s.rotation.y = 0.06;
    modelGroup.add(s);
})();

// ---- zincir ----
// Ön dişliden (salıncak milinin hemen önü) arka dişliye, sol yanda.
boru([0.02, 0.400, 0.13], [ARKA_X, AKS_Y + 0.108, 0.13], 0.011, SIYAH, 'zincir_ust', 0.4, 0.6);
boru([0.02, 0.325, 0.13], [ARKA_X, AKS_Y - 0.108, 0.13], 0.011, SIYAH, 'zincir_alt', 0.4, 0.6);

// ---- gövde: depo, sele, kuyruk, yan kapaklar ----
// BUNLAR TEK BİR HAT: boyun borusundan kuyruğa kadar kesintisiz bir üst
// çizgi olmalı. İlk denemede parçalar tek tek yerleştirildiği için sele
// havada, kuyruk kopuk ve yan paneller boşlukta duruyordu. Şimdi hepsi
// bilerek ÜST ÜSTE BİNDİRİLDİ:
//   depo   x 0.045 .. 0.555
//   sele   x -0.375 .. 0.075   (depo ile 0.03 örtüşür)
//   kuyruk x -0.610 .. -0.310  (sele ile 0.065 örtüşür)
//
// Depo daha MAT: ilk halde metal 0.45 / rough 0.35 idi ve üstünde tek bir
// parlak nokta çıkıyordu, boyalı sac değil plastik yumurta gibi duruyordu.
// BÜYÜTÜLDÜ: ilk halde depo kuyruk kütlesinin yanında küçük kalıyordu ve
// motosiklet "tekerlekli uzun kırmızı levha" gibi okunuyordu. Depo bu aracın
// görsel imzası; kuyruktan BASKIN olmalı.
elipsoit('depo', 0.275, 0.120, 0.200, 0.300, 0.865, 0, GOVDE, 0.55, 0.22);
elipsoit('depo_burun', 0.115, 0.088, 0.140, 0.495, 0.845, 0, GOVDE, 0.55, 0.22);

// ---- arka gövde ----
// TEK KATI KÜTLE. Üç deneme sele/kuyruk/yan-panel'i ayrı ayrı hizalamakla
// geçti ve üçünde de parçalar havada duran ayrı levhalar gibi okundu: kutu
// uçlarının matematiksel olarak örtüşmesi GÖRSEL sürekliliği vermiyor, çünkü
// aradaki ince boşluklar ve farklı yükseklikler gözde kopukluk yaratıyor.
//
// Doğrusu hizalanacak bir şey BIRAKMAMAK: sele tabanı + yan kapak + kuyruk
// tek bir gövde kütlesi (`kuyruk`), üstüne siyah sele pedi oturuyor. Kütle
// arka şasinin üstünden geçtiği için şasiyi de örtüyor — gerçek motosikletde
// de gövde sacı arka şasiyi kapatır. Ayrı `yan_panel` parçaları bu yüzden
// tamamen kaldırıldı.
(function () {
    // Kutu yerine YAN SİLUETTEN EXTRUDE: kutu her yerde aynı yükseklikte
    // olduğu için yandan düz bir levha gibi duruyordu. Siluet önde yüksek,
    // arkaya doğru daralan gerçek bir kuyruk veriyor. Teknik çamurluklarla
    // aynı; kapanış noktası ELLE çizilmiyor (kopya nokta pah tuzağı).
    // İNCELTİLDİ VE KISALTILDI: önceki hâli 0.655 uzunluğunda ve 0.14
    // kalınlığındaydı; deponun iki katı hacim kaplıyor ve motosikleti düz bir
    // levhaya çeviriyordu. Gerçek bir naked motosikletde kuyruk incedir ve
    // altı açıktır.
    // ÖLÇÜ İKİ KEZ AYARLANDI. Önce çok kalındı (0.14) ve motosikleti düz bir
    // levhaya çeviriyordu; sonra fazla inceltildi (0.09) ve bu sefer bıçak
    // ağzı gibi kaldı, sele de üstünde ayrı bir plaka gibi durdu. Şimdiki
    // hâli: önde 0.125, arkada 0.077 — dolgun ama daralan. Deponun büyümesi
    // de dengeyi düzeltti, kuyruk artık baskın kütle değil.
    const s = new THREE.Shape();
    s.moveTo(0.030, 0.775);
    s.lineTo(0.030, 0.900);
    s.lineTo(-0.300, 0.910);
    s.lineTo(-0.560, 0.885);
    s.lineTo(-0.538, 0.808);
    s.lineTo(-0.190, 0.778);
    const geo = new THREE.ExtrudeGeometry(s, { depth: 0.195, bevelEnabled: false });
    geo.translate(0, 0, -0.0975);
    const k = mesh(geo, GOVDE, { metal: 0.4, rough: 0.45, name: 'kuyruk' });
    modelGroup.add(k);

    // Sele pedi kuyruğun ÜST KENARINA oturuyor (kuyruk tepesi 0.900-0.910).
    const sele = mesh(kutu(0.34, 0.046, 0.210), SIYAH,
                      { rough: 0.9, metal: 0.0, flat: true, name: 'sele' });
    sele.position.set(-0.135, 0.925, 0);
    sele.rotation.z = -0.02;
    modelGroup.add(sele);

    const stop = mesh(kutu(0.042, 0.046, 0.098), '#7a1c18',
                      { rough: 0.35, name: 'stop' });
    stop.position.set(-0.568, 0.858, 0);
    modelGroup.add(stop);
})();

// Ayaklıklar
[1, -1].forEach((s, i) => {
    const a = mesh(kutu(0.055, 0.028, 0.13), KROM,
                   { metal: 0.6, rough: 0.35, name: 'ayaklik_' + (i + 1) });
    a.position.set(0.03, 0.335, s * 0.20);
    modelGroup.add(a);
});

// ===========================================================================
// DÖNEN TAKIM — direksiyonla birlikte kırar
// ===========================================================================
HEDEF = direksiyonIc;

tekerlek('teker_on', ON_X, LASTIK_ON, false);
// Ön çamurluk tekerin üstünü yakından sarar (hugger). Arka çamurlukla aynı
// ders: kısa ve etli, uzun ve ince değil.
camurluk('camurluk_on', ON_X, Math.PI * 0.16, Math.PI * 0.72,
         R_TEKER + 0.022, R_TEKER + 0.052, 0.140);

// Makas (üst tabla) — çatalı boyun borusuna bağlar.
(function () {
    const m = mesh(kutu(0.10, 0.045, 0.28), MOTOR,
                   { metal: 0.6, rough: 0.35, flat: true, name: 'makas' });
    m.position.set(0.535, 0.885, 0);
    m.rotation.z = 0.42;                          // boyun açısına yaslı
    direksiyonIc.add(m);
})();

// Çatal: üstte ince borular, altta kalın bacaklar (amortisör gövdesi).
boru([0.565, 0.905, 0.105], [0.675, 0.605, 0.105], 0.026, KROM, 'catal_1', 0.75, 0.22);
boru([0.565, 0.905, -0.105], [0.675, 0.605, -0.105], 0.026, KROM, 'catal_2', 0.75, 0.22);
boru([0.668, 0.625, 0.105], [ON_X, AKS_Y, 0.105], 0.036, MOTOR, 'alt_bacak_1', 0.55, 0.4);
boru([0.668, 0.625, -0.105], [ON_X, AKS_Y, -0.105], 0.036, MOTOR, 'alt_bacak_2', 0.55, 0.4);

// Far: yuvarlak, naked motosikletin imzası. Boyun borusunun önünde.
(function () {
    const govde = mesh(new THREE.CylinderGeometry(0.115, 0.098, 0.095, 22), SIYAH,
                       { metal: 0.4, rough: 0.45, name: 'far_govde' });
    govde.rotation.z = Math.PI / 2;               // ekseni +x'e çevir
    govde.position.set(0.615, 0.905, 0);
    direksiyonIc.add(govde);
    // Cam: hafif kabarık, öne bakar.
    const cam = mesh(new THREE.SphereGeometry(0.112, 20, 12), '#e8eef5',
                     { metal: 0.1, rough: 0.12, name: 'far' });
    cam.scale.set(0.30, 1, 1);
    cam.position.set(0.672, 0.905, 0);
    direksiyonIc.add(cam);
})();

// Gidon: dik, hafif geriye kıvrık — sokak motosikleti duruşu.
boru([0.520, 1.010, -0.085], [0.520, 1.010, 0.085], 0.019, KROM, 'gidon', 0.7, 0.25);
boru([0.520, 1.010, 0.085], [0.478, 1.028, 0.255], 0.017, KROM, 'gidon_kol_1', 0.7, 0.25);
boru([0.520, 1.010, -0.085], [0.478, 1.028, -0.255], 0.017, KROM, 'gidon_kol_2', 0.7, 0.25);
boru([0.474, 1.030, 0.262], [0.466, 1.033, 0.325], 0.024, SIYAH, 'tutamak_1', 0, 0.85);
boru([0.474, 1.030, -0.262], [0.466, 1.033, -0.325], 0.024, SIYAH, 'tutamak_2', 0, 0.85);

// Aynalar: sapı gidon ucundan yukarı-dışa, başı oval.
// Tepeden bakışta motosikleti okutan iki belirgin nokta bunlar.
[1, -1].forEach((s, i) => {
    boru([0.480, 1.035, s * 0.245], [0.452, 1.145, s * 0.318], 0.013, SIYAH,
         'ayna_sap_' + (i + 1), 0.5, 0.4);
    const a = mesh(new THREE.SphereGeometry(1, 14, 10), SIYAH,
                   { metal: 0.35, rough: 0.35, name: 'ayna_' + (i + 1) });
    a.scale.set(0.028, 0.048, 0.072);
    a.position.set(0.448, 1.158, s * 0.330);
    direksiyonIc.add(a);
});

HEDEF = modelGroup;   // dönen takım bitti

// ---- yan sehpa: BİLEREK YOK -----------------------------------------------
// Bisikletdeki gerekçenin aynısı: inik sehpa DURAN aracın hali, oysa bu model
// sürülüyor (tekerlekler yuvarlanıyor, viraja yatıyor). Sehpa "durunca inip
// kalkma" animasyonuyla birlikte gelmeli.
