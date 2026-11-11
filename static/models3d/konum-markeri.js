// Konum markerı — klasik harita işareti. 2B siluete kalınlık verilmiş hali
// (3B ok ile aynı mantık), ama DİK duruyor: sivri uç haritada, top yukarıda.
// Referans: klasik kırmızı 3B pin.
//
// PARÇALAR (Studio3D bu adları arar, DEĞİŞTİRME):
//   marker → tek parça gövde. RENK ALIR (ann.modelColor).
//
// DELİK GERÇEK: şeklin içine delik olarak açıldı, dolgu değil. Ortasından
// arkası görünüyor, referanstaki gibi.
//
// YÜZÜ ±z'ye bakar. Haritada model ±z'si kameraya dönük eksen olduğu için
// varsayılan duruşta marker yüzünü gösteriyor.
//
// UÇ MERKEZDE: sivri uç modelin (0,0) noktasında ve tabanda, yani marker
// gerçekten işaret ettiği noktayı gösteriyor. Kutuya göre ortalama burada
// yanlış olurdu, merkez topun içine kayardı.
modelGroup.userData.noCenter = true;

const govdeRenk = '#e74c3c';

const TOP_M = 1.32;      // topun merkezi (uçtan yükseklik)
const TOP_R = 0.66;      // topun yarıçapı
const DELIK_R = 0.345;   // ortadaki deliğin yarıçapı
const KALIN = 0.30;      // kalınlık (pah hariç)
const PAH = 0.07;        // kenar pahı — referanstaki yuvarlak kenar

// Damla silueti: uçtan (0,0) topa TEĞET giden iki kenar, sonra topun yayı.
// Teğet noktası uçtan topun merkezine olan uzaklıktan çıkar, böylece gövde
// ile top arasında kırık olmuyor.
const d = Math.sqrt(TOP_M * TOP_M - TOP_R * TOP_R);
const alfa = Math.asin(TOP_R / TOP_M);
const teget = { x: d * Math.sin(alfa), y: d * Math.cos(alfa) };
const tegetAci = Math.atan2(teget.y - TOP_M, teget.x);   // top merkezine göre

// SAG KENARI ELLE CIZME. Once "uctan sag teget noktasina lineTo, sonra
// yay" diye yazilmisti ve tam o birlesme noktasinda siluette diken vardi:
// lineTo'nun bitis noktasi ile yayin baslangic noktasi ayni yer ama kayan
// noktada birebir esit degil, arada sifira yakin uzunlukta bir kenar
// kaliyor. Pah (bevel) o kenarin yonunu hesaplayamayip vertexi savuruyor.
// Sol tarafta sorun yoktu, cunku orada yay BITIP cizgi basliyor.
// Cozum: sag kenari hic cizmemek. Yay ile ucu birlestiren kapanis kenarini
// Shape kendisi ekliyor, yani o nokta yayin kendi noktasi -- kopya yok.
const sekil = new THREE.Shape();
sekil.absarc(0, TOP_M, TOP_R, tegetAci, Math.PI - tegetAci, false);   // topun yayı
sekil.lineTo(0, 0);                                                   // sol kenar, sivri uç

const delik = new THREE.Path();
delik.absarc(0, TOP_M, DELIK_R, 0, Math.PI * 2, true);
sekil.holes.push(delik);

const geo = new THREE.ExtrudeGeometry(sekil, {
    depth: KALIN, bevelEnabled: true,
    bevelThickness: PAH, bevelSize: PAH, bevelSegments: 3,
    curveSegments: 48
});
geo.translate(0, 0, -KALIN / 2);        // kalınlık iki yana eşit dağılsın

const govde = mesh(geo, govdeRenk, { rough: 0.5, name: 'marker' });
modelGroup.add(govde);
