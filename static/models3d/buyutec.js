// Büyüteç — haritanın üstünde YATIK duran gerçek büyüteç: pirinç çember,
// içinde kavisli cam, ahşap tornalı sap.
//
// PARÇALAR (Studio3D bu adları arar, DEĞİŞTİRME):
//   cerceve, cerceve_ic, sap, bilezik → metal parçalar. RENK ALIR.
//   tutamak → ahşap sap. Renk almaz, ahşap kalsın diye.
//   cam     → mercek. Yarı saydam, renk almaz, gölge de düşürmez
//             (saydam cam zemine koyu bir daire bırakmasın diye).
//
// NEDEN YATIK: harita zaten yerde ve büyüteç haritaya bakan bir alet.
// Tepeden bakışta (varsayılan kamera) klasik büyüteç silueti görünüyor,
// kamera yatınca da çemberin ve sapın hacmi ortaya çıkıyor.
//
// Önceki hali 2B siluetten kalınlık verilmiş "arama ikonu"ydu; bu haliyle
// çember gerçek bir halka (torus), cam kavisli, sap tornalı.
const pirinc = '#c9a227';
const pirincKoyu = '#a8861d';
const ahsap = '#4a2d15';   // KOYU secildi: 3B katmanin isigi yukari bakan
                           // yuzeyleri parlatiyor, acik ton beyaza yaniyor
const camRenk = '#dbeeff';

const R = 0.82;          // çemberin merkez yarıçapı
const BORU = 0.075;      // çemberin et kalınlığı
const CAM_R = 0.79;      // merceğin yarıçapı
const EKSEN = BORU;      // her şeyin ekseni bu yükseklikte (çember yere değer)

const cyl = (rt, rb, h, s) => new THREE.CylinderGeometry(rt, rb, h, s || 28);

// ---- çember ----
// Torus varsayılan olarak XY düzleminde; x'te 90 derece çevirince YATIYOR.
const cember = mesh(new THREE.TorusGeometry(R, BORU, 16, 64), pirinc,
                    { metal: 0.55, rough: 0.22, name: 'cerceve' });
cember.rotation.x = Math.PI / 2;
cember.position.set(0, EKSEN, 0);
modelGroup.add(cember);

// Camı tutan iç bilezik: çemberin içinde ince bir bant.
// AÇIK silindir (son parametre): kapaklı olsaydı üst kapağı merceğin
// görüntüsünü tamamen örterdi -- mercek düz renk bir daire gibi çıkıyordu.
const icBant = mesh(
    new THREE.CylinderGeometry(R - BORU * 0.55, R - BORU * 0.55, BORU * 1.25, 64, 1, true),
    pirincKoyu, { metal: 0.5, rough: 0.3, name: 'cerceve_ic' });
icBant.material.side = THREE.DoubleSide;        // içeriden de görünsün
icBant.position.set(0, EKSEN, 0);
modelGroup.add(icBant);

// ---- mercek ----
// Küre yassılaştırılınca iki yüzü de KAVİSLİ oluyor (biconvex), yani düz
// bir diskten farklı olarak ışığı kenarda kırıyormuş gibi duruyor.
// Kabarma çemberin et kalınlığından az: büyüteç camın üstüne değil
// ÇEMBERİN üstüne oturuyor.
const cam = mesh(new THREE.SphereGeometry(CAM_R, 48, 24), camRenk,
                 { metal: 0.05, rough: 0.08, name: 'cam' });
cam.scale.set(1, 0.085, 1);
cam.position.set(0, EKSEN, 0);
cam.material.transparent = true;
cam.material.opacity = 0.30;    // sade yarı saydam cam    // ALTTAKI GORUNTUYU YIKAMASIN: cam yalnizca
                               // parlama/kavis hissi versin, buyutulmus harita
                               // net kalsin
cam.castShadow = false;          // saydam cam zemine koyu daire bırakmasın
modelGroup.add(cam);

// ---- sap ----
// Çemberin kenarından çıkan metal çubuk, sonra bilezik, sonra ahşap tutamak.
const CUBUK_BAS = R + BORU * 0.4;
const CUBUK_BOY = 0.34;
const cubuk = mesh(cyl(0.055, 0.055, CUBUK_BOY, 20), pirinc,
                   { metal: 0.55, rough: 0.25, name: 'sap' });
cubuk.rotation.z = -Math.PI / 2;                       // ekseni +x'e çevir
cubuk.position.set(CUBUK_BAS + CUBUK_BOY / 2, EKSEN, 0);
modelGroup.add(cubuk);

const BILEZIK_X = CUBUK_BAS + CUBUK_BOY;
const bilezik = mesh(cyl(0.095, 0.085, 0.13, 24), pirincKoyu,
                     { metal: 0.6, rough: 0.2, name: 'bilezik' });
bilezik.rotation.z = -Math.PI / 2;
bilezik.position.set(BILEZIK_X + 0.065, EKSEN, 0);
modelGroup.add(bilezik);

// Ahşap tutamak: torna profili (lathe). Profil kendi ekseninde y'de kurulup
// z'de çevriliyor, böylece sap +x doğrultusunda uzuyor.
const profil = [
    [0.052, 0.00], [0.080, 0.05], [0.082, 0.16], [0.112, 0.28],
    [0.118, 0.60], [0.110, 0.92], [0.130, 1.04], [0.118, 1.16],
    [0.078, 1.26], [0.028, 1.31], [0.000, 1.32]
].map(p => new THREE.Vector2(p[0], p[1]));
const tutamak = mesh(new THREE.LatheGeometry(profil, 32), ahsap,
                     { rough: 0.75, name: 'tutamak' });
tutamak.rotation.z = -Math.PI / 2;
tutamak.position.set(BILEZIK_X + 0.12, EKSEN, 0);
modelGroup.add(tutamak);
