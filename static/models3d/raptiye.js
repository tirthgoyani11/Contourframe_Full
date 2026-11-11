// Raptiye — klasik plastik başlıklı raptiye (referans: ofis raptiyeleri).
// Silueti yukarıdan aşağıya: geniş şapka → ince bel → aşağı doğru AÇILAN
// etek → ince iğne. İğnenin ucu y=0'da, yani model kendi ucunun üstünde
// durur; haritaya oturunca gerçekten saplanmış görünür.
// Şapka, bel ve etek RENK ALIR (ann.modelColor); iğne metal kalır.
const golge = '#c0392b';        // plastik gövde taban tonu (renk buradan değişir)
const metal = '#d6d9de';

// CylinderGeometry(ustYaricap, altYaricap, yukseklik, dilim)
const cyl = (rt, rb, h, s) => new THREE.CylinderGeometry(rt, rb, h, s || 28);
const sph = (r, w, h) => new THREE.SphereGeometry(r, w || 28, h || 16);

// ---- iğne ucu: KONİ, sivri uç AŞAĞIDA (y=0). Döndürme YOK — alt yarıçap 0
//      zaten ucu aşağı getirir; döndürünce uç yukarı bakıyordu.
const uc = mesh(cyl(0.032, 0.0, 0.26, 14), metal, { metal: 0.8, rough: 0.3, name: 'igne_ucu' });
uc.position.set(0, 0.13, 0);
modelGroup.add(uc);

// ---- iğne şaftı: gövdeye göre kısa tutuldu (fotoğraftaki oran) ----
const saft = mesh(cyl(0.032, 0.032, 0.78, 14), metal, { metal: 0.8, rough: 0.3, name: 'igne' });
saft.position.set(0, 0.65, 0);
modelGroup.add(saft);

// ---- etek: aşağı doğru AÇILAN koni (raptiyenin bastırılan tabanı) ----
const etek = mesh(cyl(0.15, 0.40, 0.42, 28), golge, { rough: 0.32, name: 'etek' });
etek.position.set(0, 1.25, 0);
modelGroup.add(etek);

// ---- eteğin alt kenarı: keskin durmasın diye ince yuvarlatma ----
const etekKenar = mesh(cyl(0.40, 0.36, 0.06, 28), golge, { rough: 0.32, name: 'etek_kenar' });
etekKenar.position.set(0, 1.01, 0);
modelGroup.add(etekKenar);

// ---- bel: şapka ile etek arasındaki ince boyun ----
const bel = mesh(cyl(0.155, 0.15, 0.30, 24), golge, { rough: 0.32, name: 'bel' });
bel.position.set(0, 1.61, 0);
modelGroup.add(bel);

// ---- şapka: belden yukarı doğru AÇILAN geniş tabla ----
const baslik = mesh(cyl(0.46, 0.20, 0.20, 28), golge, { rough: 0.3, name: 'baslik' });
baslik.position.set(0, 1.86, 0);
modelGroup.add(baslik);

// ---- şapkanın üstü: yayvan kubbe (kenarlar yuvarlansın) ----
const baslikUst = mesh(sph(0.46, 28, 16), golge, { rough: 0.3, name: 'baslik_ust' });
baslikUst.scale.set(1, 0.34, 1);
baslikUst.position.set(0, 1.96, 0);
modelGroup.add(baslikUst);
