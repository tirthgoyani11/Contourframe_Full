// Ünlem — 2B siluete kalınlık verilmiş hali (3B ok, konum markerı ve
// diğer sembollerle aynı mantık). Dik durur, yüzü ±z'ye bakar.
//
// PARÇALAR (Studio3D bu adları arar, DEĞİŞTİRME):
//   unlem → tek parça gövde. RENK ALIR (ann.modelColor).
//
// ŞEKİL NEREDEN GELİYOR: harfin konturu, projenin kendi yazı tipinden
// (static/fonts/SpaceGrotesk-Bold.ttf, OFL) çıkarılıp buraya gömüldü.
// Önce şekli elle (yay + çubuk + nokta) kurmuştuk, amatör duruyordu:
// kalem kalınlığı her yerde aynıydı, uçlar düz kesikti, kâse ile kuyruk
// oranları tutmuyordu. Tipografın çizdiği kontur bunların hepsini çözüyor.
// Üretim: scratchpad/harf_kontur.py '!' unlem
//
// Noktalar 2.06 birim boya göre ölçeklendi, x'te ortalandı, tabanı y=0.
// Konturların hiçbiri delik değil (ikisi de aynı yönde dönüyor).
const renk = '#e8b923';

const KALIN = 0.26;      // derinlik (pah hariç)
const PAH = 0.05;        // kenar pahı

const KONTUR = [
    [[-0.1846,0.7040],[-0.1846,2.0600],[0.1846,2.0600],[0.1846,0.7040]],
    [[0.0029,0.0000],[-0.0204,0.0008],[-0.0429,0.0031],[-0.0646,0.0069],[-0.0855,0.0122],[-0.1057,0.0191],[-0.1250,0.0275],[-0.1436,0.0375],[-0.1615,0.0489],[-0.1785,0.0619],[-0.1947,0.0765],[-0.2098,0.0922],[-0.2233,0.1088],[-0.2352,0.1264],[-0.2455,0.1448],[-0.2543,0.1641],[-0.2614,0.1843],[-0.2669,0.2054],[-0.2709,0.2274],[-0.2733,0.2503],[-0.2741,0.2741],[-0.2733,0.2979],[-0.2709,0.3208],[-0.2669,0.3428],[-0.2614,0.3639],[-0.2543,0.3841],[-0.2455,0.4034],[-0.2352,0.4218],[-0.2233,0.4394],[-0.2098,0.4560],[-0.1947,0.4717],[-0.1785,0.4862],[-0.1615,0.4992],[-0.1436,0.5107],[-0.1250,0.5207],[-0.1057,0.5291],[-0.0855,0.5359],[-0.0646,0.5413],[-0.0429,0.5451],[-0.0204,0.5474],[0.0029,0.5482],[0.0256,0.5474],[0.0475,0.5451],[0.0688,0.5413],[0.0892,0.5359],[0.1089,0.5291],[0.1279,0.5207],[0.1461,0.5107],[0.1635,0.4992],[0.1802,0.4862],[0.1962,0.4717],[0.2110,0.4560],[0.2242,0.4394],[0.2359,0.4218],[0.2460,0.4034],[0.2546,0.3841],[0.2616,0.3639],[0.2671,0.3428],[0.2710,0.3208],[0.2733,0.2979],[0.2741,0.2741],[0.2733,0.2503],[0.2710,0.2274],[0.2671,0.2054],[0.2616,0.1843],[0.2546,0.1641],[0.2460,0.1448],[0.2359,0.1264],[0.2242,0.1088],[0.2110,0.0922],[0.1962,0.0765],[0.1802,0.0619],[0.1635,0.0489],[0.1461,0.0375],[0.1279,0.0275],[0.1089,0.0191],[0.0892,0.0122],[0.0688,0.0069],[0.0475,0.0031],[0.0256,0.0008]]
];

const sekiller = KONTUR.map(k => {
    const s = new THREE.Shape();
    s.moveTo(k[0][0], k[0][1]);
    for (let i = 1; i < k.length; i++) s.lineTo(k[i][0], k[i][1]);
    return s;                                   // kapanış otomatik, kopya nokta yok
});

const geo = new THREE.ExtrudeGeometry(sekiller, {
    depth: KALIN, bevelEnabled: true,
    bevelThickness: PAH, bevelSize: PAH, bevelSegments: 3
});
geo.translate(0, 0, -KALIN / 2);                // kalınlık iki yana eşit dağılsın

const govde = mesh(geo, renk, { rough: 0.55, name: 'unlem' });
modelGroup.add(govde);
