// Ok tabelası — direğe çakılı, ucu sivri yön levhası. Üstüne yazı ve
// görsel gelir, levhanın rengi değişir.
//
// PARÇALAR (Studio3D bu adları arar, DEĞİŞTİRME):
//   direk        → ahşap direk, alt ucu sivri (saplanma animasyonu için).
//   tabela_govde → levhanın koyu çekirdeği; iki yüzün etrafında çerçeve
//                  gibi görünür. RENK ALMAZ, çerçeve her renkte kalsın diye.
//   tabela       → ÖN yüz. RENK ALIR (ann.modelColor).
//   tabela_arka  → ARKA yüz. RENK ALIR.
//   yuzey_on     → ön yüzdeki yazı/görsel düzlemi.
//   yuzey_arka   → arka yüzdeki yazı/görsel düzlemi (180° dönük, yani
//                  arkadan bakınca da yazı düz okunur).
//
// YAZI NEDEN İKİ YÜZDE: levha dikey duruyor ve haritada kamera yönü
// kullanıcıya bağlı. Tek yüze yazsaydık objeyi çevirdiğinde yazı
// kaybolurdu. Gerçek yön tabelalarında da iki yüz yazılıdır.
//
// MERKEZ: direğin kökü. Varsayılan kutu-ortalama burada yanlış olurdu,
// çünkü levha tek yöne taşıyor ve merkez direkten kayardı — işaret ise
// direğin dikildiği noktadır.
modelGroup.userData.noCenter = true;

const ahsap = '#6b4a2b';        // direk
const cekirdek = '#4a3320';     // levha çekirdeği / çerçeve
const yuzRenk = '#c9a063';      // levha yüzü (renk alır)

// ---- ölçüler ----
const BOY = 0.54;               // levha yüksekliği
const X0 = -0.17;               // levhanın direkten geride kalan ucu
const X1 = 1.63;                // dikdörtgen kısmın bittiği yer
const UC = 0.40;                // sivri ucun uzunluğu
const KAL = 0.075;              // çekirdek kalınlığı
const PAY = 0.055;              // yüzün çerçeveden içeri payı
const YUKSEK = 1.70;            // levha merkezinin yüksekliği

// Ok çokgeni: +x yönüne sivri. Varsayılan duruşta ok SAĞA bakar.
function okSekli(x0, x1, uc, h) {
    const s = new THREE.Shape();
    s.moveTo(x0, -h);
    s.lineTo(x1, -h);
    s.lineTo(x1 + uc, 0);
    s.lineTo(x1, h);
    s.lineTo(x0, h);
    s.closePath();
    return s;
}
const cikar = (sekil, derinlik) =>
    new THREE.ExtrudeGeometry(sekil, { depth: derinlik, bevelEnabled: false })
        .translate(0, 0, -derinlik / 2);

// ---- direk ----
const govde = mesh(new THREE.CylinderGeometry(0.072, 0.072, 1.96, 16), ahsap,
                   { rough: 0.9, name: 'direk' });
govde.position.set(0, 0.18 + 0.98, 0);
modelGroup.add(govde);

// Alt uç sivri: kazık gibi. cyl(üst, alt, boy) — alt yarıçap 0 verilince
// uç zaten AŞAĞI bakar, ayrıca çevirmeye gerek yok.
const uc = mesh(new THREE.CylinderGeometry(0.072, 0, 0.18, 16), ahsap,
                { rough: 0.9, name: 'direk_uc' });
uc.position.set(0, 0.09, 0);
modelGroup.add(uc);

const sapka = mesh(new THREE.CylinderGeometry(0.085, 0.085, 0.05, 16), cekirdek,
                   { rough: 0.85, name: 'direk_sapka' });
sapka.position.set(0, 2.16, 0);
modelGroup.add(sapka);

// ---- levha ----
const levha = new THREE.Group();
levha.name = 'tabelaGrup';
levha.position.set(0, YUKSEK, 0);
modelGroup.add(levha);

const cekGeo = cikar(okSekli(X0, X1, UC, BOY / 2), KAL);
const cek = mesh(cekGeo, cekirdek, { rough: 0.88, name: 'tabela_govde' });
levha.add(cek);

// İki yüz: çekirdeğin biraz içinden, biraz önünde/arkasında. Aradaki fark
// çerçeveyi verir; çerçeve renk almadığı için levha hangi renge boyanırsa
// boyansın kenarı belli kalır.
const ic = BOY / 2 - PAY;
const yuzKal = 0.014;
const on = mesh(cikar(okSekli(X0 + PAY, X1 - PAY * 0.6, UC, ic), yuzKal), yuzRenk,
                { rough: 0.82, name: 'tabela' });
on.position.set(0, 0, KAL / 2 + yuzKal / 2);
levha.add(on);

const arka = mesh(cikar(okSekli(X0 + PAY, X1 - PAY * 0.6, UC, ic), yuzKal), yuzRenk,
                  { rough: 0.82, name: 'tabela_arka' });
arka.position.set(0, 0, -(KAL / 2 + yuzKal / 2));
levha.add(arka);

// ---- yazı/görsel düzlemleri ----
// Şeffaf başlar; Studio3D dokuyu buraya bağlar (doku yokken görünmez).
// En/boy oranı 4:1 — Studio3D'nin bu model için ürettiği tuvalle aynı,
// yoksa yazı yayılır.
const YZ_BOY = (BOY / 2 - PAY) * 2 * 0.86;
const YZ_EN = YZ_BOY * 4;
const YZ_X = (X0 + X1) / 2;
const YZ_Z = KAL / 2 + yuzKal + 0.006;

// DOKU 180 DERECE DÖNÜK GELİR — ÖLÇÜLDÜ. Sahnenin yerleştirme yolunda bir
// aynalama var: tuvalin sol üst köşesine yeşil, sağ altına mavi kare basıp
// haritada baktık, yeşil sağ altta çıktı (iki eksen de ters). Düz duran
// kare notta bu, "aynalı + baş aşağı" birleşimi tam olarak dikey çevirmeye
// eşit olduğu için doku flipY'siyle örtülüyordu; dik duran levhada
// örtüşmüyor. Telafi düzlemin KENDİ ekseninde 180 derece dönüş: yansıma
// değil, gerçek dönüş — normal ve sarım bozulmaz.
function yaziDuzlemi(ad, arkaMi) {
    const m = mesh(new THREE.PlaneGeometry(YZ_EN, YZ_BOY), '#ffffff', { rough: 1, name: ad });
    m.material.transparent = true;
    m.material.opacity = 0;                    // doku gelene kadar görünmez
    m.material.depthWrite = false;             // levhayla z-kavgası olmasın
    m.castShadow = false;                      // kendi gölgesini levhaya düşürmesin
    m.position.set(YZ_X, 0, arkaMi ? -YZ_Z : YZ_Z);
    m.rotation.z = Math.PI;                    // yukarıdaki 180 derece telafisi
    if (arkaMi) m.rotation.y = Math.PI;        // arkadan bakınca yazı düz okunsun
    levha.add(m);
}
yaziDuzlemi('yuzey_on', false);
yaziDuzlemi('yuzey_arka', true);
