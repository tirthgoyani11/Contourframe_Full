// 3B ok — yere yatık, kalınlığı olan yön oku. Tek ayarı rengi.
//
// PARÇALAR (Studio3D bu adları arar, DEĞİŞTİRME):
//   ok        → okun gövdesi. RENK ALIR (ann.modelColor).
//
// YÖN: uç +x'e bakar, yani varsayılan duruşta ok SAĞA gider. Yön, objenin
// kendi dönüş (yaw) ayarıyla veriliyor, modelde ayrı bir alan yok.
//
// Ok YATIK duruyor: haritanın varsayılan bakışı tepeden ve yatık ok her
// açıdan okunuyor. Kalınlık gerçek, yani gölgesi de var.
const okRenk = '#c0392b';

const UZUNLUK = 2.40;    // toplam boy (kuyruktan uca)
const SAP_EN = 0.52;     // gövdenin eni
const BAS_EN = 1.02;     // uç üçgeninin eni
const BAS_BOY = 0.82;    // uç üçgeninin boyu
const KALIN = 0.15;      // yükseklik

// Ok çokgeni XY düzleminde kurulur, sonra yere yatırılır.
function okSekli(uzunluk, sapEn, basEn, basBoy) {
    const x1 = uzunluk / 2;            // uç
    const x0 = -uzunluk / 2;           // kuyruk
    const xb = x1 - basBoy;            // gövde ile başın birleştiği yer
    const s = new THREE.Shape();
    s.moveTo(x0, -sapEn / 2);
    s.lineTo(xb, -sapEn / 2);
    s.lineTo(xb, -basEn / 2);
    s.lineTo(x1, 0);
    s.lineTo(xb, basEn / 2);
    s.lineTo(xb, sapEn / 2);
    s.lineTo(x0, sapEn / 2);
    s.closePath();
    return s;
}

// Şekli kalınlaştırıp yere yatırır: kalınlık +y'ye (yukarı) doğru olur.
function yatikCikar(sekil, kalinlik, pah) {
    const g = new THREE.ExtrudeGeometry(sekil, {
        depth: kalinlik,
        bevelEnabled: pah > 0,
        bevelThickness: pah, bevelSize: pah, bevelSegments: 2
    });
    g.rotateX(-Math.PI / 2);
    return g;
}

// ---- okun kendisi ----
const ok = mesh(yatikCikar(okSekli(UZUNLUK, SAP_EN, BAS_EN, BAS_BOY), KALIN, 0.028),
                okRenk, { rough: 0.68, name: 'ok' });
modelGroup.add(ok);
