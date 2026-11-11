// Kare kağıt not — haritanın üstüne yapıştırılmış kare not kâğıdı.
// Yassı durur (yerde), üstüne yazı ve/veya görsel gelir.
//
// PARÇALAR (Studio3D bu adları arar, DEĞİŞTİRME):
//   kagit      → kâğıdın gövdesi. RENK ALIR (ann.modelColor).
//   kagit_kenar→ alt kenar gölgesi, kâğıdın kalktığı izlenimi. RENK ALIR.
//   yuzey      → yazı/görsel dokusunun bindiği ince düzlem. Şeffaf başlar;
//                Studio3D metni ve görseli buraya çizer.
//
// Yüzey düzlemi +y'ye bakar (yassı). Haritada +y yukarı olduğu için not
// yerde duruyor ve yukarıdan okunuyor.
// NOT: kâğıdın üst yüzü ışığa tam dönük olduğu için AÇIK renkler beyaza
// yanıyor (yayınık aydınlatma 1'i aşıyor). Varsayılan ton bu yüzden
// bilerek koyu tutuldu; renk değiştirilince de aynı kural geçerli, çok
// açık tonlar üstten beyaz görünür.
const kagitRenk = '#d9c26a';     // varsayılan not sarısı
const kenarRenk = '#b8a052';

const EN = 2.0;                  // kare kenarı
const KALINLIK = 0.028;          // BİR yaprak; Studio3D kaç yaprak olduğunu ölçekle verir
const PAY = 0.09;                // yazı alanının kenar boşluğu

// Kâğıt, kenarı ve yazı yüzeyi TEK GRUPTA: kalınlık bu grubun Y ölçeğiyle
// veriliyor (Studio3D, ann.noteThickness). Yüzey de grubun içinde olduğu
// için kâğıt kalınlaşınca yazı kendiliğinden üstte kalıyor.
const kagitGrup = new THREE.Group();
kagitGrup.name = 'kagitGrup';
modelGroup.add(kagitGrup);

// ---- kâğıt gövdesi ----
const kagit = mesh(new THREE.BoxGeometry(EN, KALINLIK, EN), kagitRenk,
                   { rough: 0.92, name: 'kagit' });
kagit.position.set(0, KALINLIK / 2, 0);
kagitGrup.add(kagit);

// ---- alt kenar: kâğıdın kalınlığını belli eden ince şerit ----
const kenar = mesh(new THREE.BoxGeometry(EN * 1.005, KALINLIK * 0.45, EN * 1.005), kenarRenk,
                   { rough: 0.95, name: 'kagit_kenar' });
kenar.position.set(0, KALINLIK * 0.22, 0);
kagitGrup.add(kenar);

// ---- yazı/görsel yüzeyi: kâğıdın hemen üstünde ince düzlem ----
// Şeffaf materyal; Studio3D dokuyu buraya bağlar. Doku yokken görünmez.
const yuzeyGeo = new THREE.PlaneGeometry(EN - PAY * 2, EN - PAY * 2);
yuzeyGeo.rotateX(-Math.PI / 2);                 // düzlem yassı, yüzü +y
const yuzey = mesh(yuzeyGeo, '#ffffff', { rough: 1, name: 'yuzey' });
yuzey.material.transparent = true;
yuzey.material.opacity = 0;                     // doku gelene kadar görünmez
yuzey.material.depthWrite = false;              // kâğıtla z-kavgası olmasın
yuzey.castShadow = false;                       // kendi gölgesini kâğıda düşürmesin
yuzey.position.set(0, KALINLIK + 0.006, 0);
kagitGrup.add(yuzey);
