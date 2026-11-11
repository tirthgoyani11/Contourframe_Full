// Helikopter — SİVİL çok amaçlı (Airbus H145 / Bell 429 sınıfı).
// Ulaşım temasının modeli. Burun +x, üst +y, taban y=0. Ölçüler gerçek metre.
//
// ⚠️ KÜTÜPHANEDE ZATEN İKİ HELİKOPTER VAR ve bu ikisiyle KARIŞMAMASI ilk
// tasarım kısıtı. Ayrışma göz kararı değil, madde madde kuruldu:
//
//   chinook (CH-47)      : ÇİFT tandem rotor, iki ayrı pilon, 4 TEKERLEK,
//                          arka yükleme rampası, yan sponsonlar, kutu gövde.
//   saldiri-helikopteri  : TANDEM (kademeli) kanopi, çene topu + namlu,
//                          burun sensör küreleri, silah kanatları + roket
//                          kovanı + füzeler, 4 pal, TEKERLEKLİ iniş takımı.
//   BU MODEL             : TEK ana rotor + BEŞ pal, kuyruk rotoru, KIZAK
//                          (tekerlek YOK), yerden tavana kadar dolanan
//                          GENİŞ KOKPİT CAMI + çene camları, KAYAR YAN KAPI
//                          ve yolcu penceresi, yatay stabilizatör.
//                          Silah, zırh, taret, sensör topu YOK.
//   Renk de ayırıyor: ötekiler askeri zeytin yeşili, bu #2f6fb0 sivil mavi.
//
// ---------------------------------------------------------------------------
// GÖVDE NEDEN LOFT
// ---------------------------------------------------------------------------
// Otomobilde ölçüldü (bkz. DEVIR §4): bir ExtrudeGeometry'nin KESİTİ derinlik
// boyunca SABİTTİR, yani yanlar dümdüz, üst dümdüz, kenarlar keskin kalır.
// Helikopter gövdesi baştan sona kesit DEĞİŞTİREN bir şeydir: burunda küçük ve
// yuvarlak, kabinde geniş ve yassı yanaklı, motor güvertesinde tepesi
// tümsekli, kuyruk kirişinde ince ve NEREDEYSE DAİRESEL. Bu yüzden gövde,
// x ekseni boyunca 47 istasyonda ayrı ayrı hesaplanan kapalı kesitlerin
// dikilmesiyle kuruluyor. Kesitin altı parametresi (taban, tepe, omuz
// yüksekliği, yarı genişlik ve İKİ SÜPER-ELİPS ÜSSÜ) x boyunca kendi monoton
// kübik eğrisinden okunuyor.
//
// Üsleri de eğri yapmak, otomobilde olmayan tek eklemedir ve gerekliydi:
// kabinde üs 0.58 (yanak yassı, kapı yüzeyi levha gibi), kuyruk kirişinde 1.0
// (tam elips, boru). Tek sabit üs verilseydi ya kabin sabun kalıbı gibi
// yuvarlak ya kuyruk kirişi köşeli bir çubuk olurdu.
//
// ---------------------------------------------------------------------------
// KUTU — NEDEN TAM 11.0 x 11.0 DEĞİL (ÖLÇÜLDÜ, TASARIM KARARI)
// ---------------------------------------------------------------------------
// Ana rotor çapı 11.0 (pal ucu göbekten 5.5). Ama motor kutuyu modelin DURAN
// halinden ölçüyor ve BEŞ pal 72°'de duruyor: düzgün beşgenin sınır kutusu
// hiçbir açıda kare olmaz. Genişlik yönü ne olursa olsun 1.809R ile 1.902R
// arasında kalır, yani R=5.5 için en fazla 10.46 — 11.0 GEOMETRİK OLARAK
// ERİŞİLEMEZ. İki seçenekten:
//   (a) pali uzatıp kutuyu 11.0 yapmak → gerçek rotor çapı 11.57 olurdu,
//   (b) çapı 11.0'da tutup kutunun z'sini 10.45 kabul etmek.
// (b) seçildi: istenen ŞEY rotor çapıdır, kutu onun ölçüm gölgesidir.
// Pal fazı 0 seçildi (ilk pal +x'te): beş palin sin değerleri o fazda
// simetrik (0, ±0.951, ±0.588), yani kutu z'de ORTALI çıkıyor. 18° faz x'i
// ortalar ama z'yi 0.53 kaydırırdı ve _centerAndGround kutuya göre
// ortaladığı için GÖVDE yana kaçardı.
// Göbek x=0'da: kutu x'i tam 11.00 yapan tek konum ailesi (h ∈ [-1.05, 0]) ve
// içinden EN ÖNDEKİ. Bedeli mast'ın kabin arka duvarının ~1 m gerisinde,
// motor güvertesinin üstünde kalması — gerçek makinede de mast motor
// güvertesinin ön ucundadır, kabul edilebilir.
//
// ---------------------------------------------------------------------------
// PARÇA ADLARI (Studio3D bunları arar, DEĞİŞTİRME)
// ---------------------------------------------------------------------------
//   govde, dikey_kuyruk, yatay_stabilize_1/2  → RENK ALIR (_TINT)
//   cam_*                                     → koyu cam, renk almaz
//   pal_1..pal_5, kuyruk_pal_1..4             → AYRI ADLAR. _applyTint
//                                               getObjectByName kullanıyor,
//                                               aynı adlı meshlerden yalnız
//                                               İLKİ bulunur (üç kanatlı
//                                               pervanede ölçüldü).
//   userData.kizakKutu                        → davranış okur (aşağıda)
//
// ⚠️ YAZI YOK. Harita modeli soldan sağa aynalıyor (OKU.md), yazı ters çıkar.

// ===========================================================================
// 0. RENKLER
// ===========================================================================
const C_GOVDE  = '#2f6fb0';   // _TINT varsayılanı — sivil mavi
const C_CAM    = '#151c24';
const C_CERC   = '#20242a';   // cam çerçevesi / kapı ayrım çizgisi
const C_ROTOR  = '#2b2d31';   // pal
const C_GOBEK  = '#3a3d43';   // rotor göbeği
const C_KOYU   = '#15181c';   // egzoz içi, hava girişi ağzı
const C_KIZAK  = '#8d949c';   // kızak boruları — boyasız alüminyum
// ⚠️ KROM DİYE metalness 0.85+ VERİLMEZ. MeshStandardMaterial'da metalness
// difüz bileşeni söndürüyor ve sahnede environment map YOK; açı tutmayan
// yüzler kapkara çıkıyor (otomobilin ızgara çıtalarında ölçüldü). Düşük
// metalness + açık taban rengi hem parlıyor hem parçayı okutuyor.
const KROM_MAL = { metal: 0.45, rough: 0.26 };
const C_METAL  = '#a8afb7';
const C_KIRMIZI = '#c0392b';
const C_YESIL  = '#2f9e5c';
const C_FAR    = '#dde6ef';

// ===========================================================================
// 1. TEMEL ÖLÇÜLER
// ===========================================================================
const UZUN     = 5.5;     // yarı uzunluk → gövde 11.0 (kuyruk dahil)
const GEN      = 0.975;   // kabinde yarı genişlik → 1.95
const ROTOR_R  = 5.5;     // ana rotor yarıçapı → çap 11.0
const MAST_X   = 0.0;     // ana rotor mili (kutu gerekçesi yukarıda)
const GOBEK_Y  = 3.26;    // göbek merkezi
const TEPE_Y   = 3.45;    // rotor başlığının tepesi = modelin tepesi
const PAL_KOK  = 0.44;    // palin göbeğe bağlandığı yarıçap
const KT_X     = -4.50;   // kuyruk rotoru göbeği
const KT_Y     = 2.10;
const KT_Z     = 0.30;    // fin'in +z (sol) yüzünde
const KT_R     = 1.00;    // kuyruk rotoru yarıçapı → çap 2.0
const KIZAK_Z  = 1.15;    // kızak borularının z'si
const KIZAK_R  = 0.075;   // boru yarıçapı → taban y=0
const KIZAK_X1 = -0.60;   // kızak arka ucu
const KIZAK_X2 = 3.15;    // düz bölümün ön ucu (sonrası yukarı kıvrık)
const KIZAK_UC = 3.40;    // kıvrık ucun x'i

// Kesitin omuz (en geniş nokta) parametresi. v=0 karın ortası, v=1 tepe
// ortası; VO en geniş yer. w = 1 - v olduğu için |w|=0.56 omuz çizgisidir ve
// panelleri o çizgiye göre yazmak kolay.
const VO = 0.44;
const NV = 20;            // yarı kesitteki örnek sayısı (halka 2*NV-2 = 38)

// ===========================================================================
// 2. MONOTON KÜBİK EĞRİ (PCHIP)
// ===========================================================================
// Catmull-Rom denendi ve BIRAKILDI: kuyruk kirişinin gövdeye bağlandığı yerde
// eğim çok hızlı değiştiği için genişlik eğrisi kirişin üstünde tümsek
// atıyordu (taşma) — kiriş ortasında gövdeden geniş bir şişkinlik çıkıyordu.
// Fritsch-Carlson teğetleri yerel uç noktalarda sıfırlanır, taşma olmaz.
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

// ---- gövdenin uzunlamasına çizgileri --------------------------------------
// KARIN. Kabinde 0.52 (kızak çapraz bacakları oraya giriyor), kuyruk
// kirişinde 1.65'e kadar YÜKSELİYOR — helikopterin en tanıdık profil
// özelliği bu "kuyruk kalkışı"dır ve düz bir kutuyla anlatılamaz.
const Y_ALT = egriYap([
    [-5.50, 1.80], [-5.25, 1.72], [-4.90, 1.68], [-4.20, 1.64],
    [-3.40, 1.58], [-2.70, 1.52], [-2.10, 1.46], [-1.60, 1.26],
    [-1.10, 0.94], [-0.60, 0.70], [ 0.00, 0.60], [ 0.60, 0.55],
    [ 1.20, 0.52], [ 1.60, 0.52], [ 2.40, 0.53], [ 3.20, 0.56],
    [ 3.80, 0.62], [ 4.30, 0.72], [ 4.70, 0.84], [ 5.05, 1.02],
    [ 5.30, 1.22], [ 5.50, 1.42]
]);
// TEPE. Kabin tavanı 2.55'te DÜZ; motor güvertesinde 2.76'ya tümsek yapıp
// kuyruk kirişinde 2.02'ye iniyor. Tümsek gerçek: ana dişli kutusu ve iki
// turboşaft oraya oturur ve sivil helikopterin sırtındaki o kambur, askeri
// taarruz helikopterinin düz sırtından bakışta ayıran şeydir.
const Y_UST = egriYap([
    [-5.50, 1.94], [-5.25, 2.00], [-4.90, 2.02], [-4.20, 2.04],
    [-3.40, 2.08], [-2.70, 2.16], [-2.10, 2.28], [-1.60, 2.44],
    [-1.10, 2.60], [-0.60, 2.72], [ 0.00, 2.76], [ 0.60, 2.70],
    [ 1.20, 2.58], [ 1.60, 2.56], [ 2.40, 2.55], [ 3.20, 2.53],
    [ 3.80, 2.49], [ 4.30, 2.40], [ 4.70, 2.26], [ 5.05, 2.06],
    [ 5.30, 1.86], [ 5.50, 1.62]
]);
// EN GENİŞ NOKTANIN YÜKSEKLİĞİ. Kabinde 1.40 (bel hattının altı), kuyruk
// kirişinde kesitin tam ortası.
const Y_OMUZ = egriYap([
    [-5.50, 1.87], [-4.90, 1.85], [-4.20, 1.84], [-3.40, 1.83],
    [-2.70, 1.83], [-2.10, 1.80], [-1.60, 1.72], [-1.10, 1.58],
    [-0.60, 1.50], [ 0.00, 1.45], [ 0.60, 1.42], [ 1.20, 1.40],
    [ 2.40, 1.40], [ 3.20, 1.42], [ 3.80, 1.44], [ 4.30, 1.45],
    [ 4.70, 1.48], [ 5.05, 1.52], [ 5.30, 1.55], [ 5.50, 1.52]
]);
// YARI GENİŞLİK. 0.975 (=1.95 gövde) kabinde; kuyruk kirişinde 0.23.
// ⚠️ İlk sürümde daralma -0.6'dan -3.4'e YAYILMIŞTI ve yandan bakışta araç
// balık gibi tek bir mercek siluetine düşüyordu: kabin bitiyor, kiriş
// başlıyor sınırı hiç okunmuyordu. Gerçek makinede kabin arkasında motor
// güvertesi tam genişlikte kalır, sonra bir gövde genişliği kadar mesafede
// kiriş kalınlığına DÜŞER. Daralma o yüzden -0.6 ile -2.1 arasına toplandı.
const W_GOV = egriYap([
    [-5.50, 0.060], [-5.25, 0.200], [-4.90, 0.222], [-4.20, 0.238],
    [-3.40, 0.262], [-2.70, 0.288], [-2.10, 0.345], [-1.60, 0.470],
    [-1.10, 0.690], [-0.60, 0.850], [ 0.00, 0.905], [ 0.60, 0.945],
    [ 1.20, 0.970], [ 1.60, 0.975], [ 2.40, 0.975], [ 3.20, 0.958],
    [ 3.80, 0.920], [ 4.30, 0.830], [ 4.70, 0.680], [ 5.05, 0.460],
    [ 5.30, 0.260], [ 5.50, 0.060]
]);
// ALT SÜPER-ELİPS ÜSSÜ. Kabinde 0.58 → yanak karından hemen açılıp
// DİKLEŞİYOR (kapı yüzeyi levha gibi, kayar kapı oraya oturuyor).
// Kuyruk kirişinde 1.0 → tam elips, yani boru.
const N_ALT = egriYap([
    [-5.50, 1.00], [-3.40, 1.00], [-2.10, 0.94], [-1.10, 0.78],
    [-0.20, 0.62], [ 1.60, 0.58], [ 3.20, 0.62], [ 4.30, 0.80],
    [ 5.05, 0.95], [ 5.50, 1.00]
]);
// ÜST SÜPER-ELİPS ÜSSÜ. Kabinde 0.66 → tavan kubbesi yayvan; kuyrukta 1.0.
const N_UST = egriYap([
    [-5.50, 1.00], [-3.40, 1.00], [-2.10, 0.94], [-1.10, 0.82],
    [-0.20, 0.72], [ 1.60, 0.66], [ 3.20, 0.70], [ 4.30, 0.84],
    [ 5.05, 0.96], [ 5.50, 1.00]
]);

// ===========================================================================
// 3. KESİT
// ===========================================================================
function kesitPar(x) {
    const yA = Y_ALT(x), yU = Y_UST(x);
    let yO = Y_OMUZ(x);
    // Omuz iki uç arasında KALMALI, yoksa süper-elips ters dönüp kesit
    // kendi içine katlanıyor (burun ucunda gövde birkaç mm için düğümlendi).
    yO = Math.max(yA + 0.02, Math.min(yU - 0.02, yO));
    return { yA: yA, yU: yU, yO: yO, w: Math.max(0.02, W_GOV(x)),
             nA: N_ALT(x), nU: N_UST(x) };
}

// Yarı kesitin v parametresindeki noktası → [z, y]. v=0 karın ortası,
// v=1 tepe ortası, v=VO en geniş nokta.
function kesitNokta(P, v) {
    if (v <= VO) {
        const th = (v / VO) * Math.PI / 2;
        return [P.w * Math.pow(Math.sin(th), P.nA),
                P.yO - (P.yO - P.yA) * Math.pow(Math.cos(th), P.nA)];
    }
    const th = ((v - VO) / (1 - VO)) * Math.PI / 2;
    return [P.w * Math.pow(Math.cos(th), P.nU),
            P.yO + (P.yU - P.yO) * Math.pow(Math.sin(th), P.nU)];
}

// Yüzey noktası. w ∈ [-1,1]: 0 = tepe orta hattı, +1 = +z tarafında karın.
// (v = 1 - |w|.) Panelleri bu parametreyle yerleştirmek kolay: yan pencere
// w≈0.30..0.60, ön cam w≈±0.08..0.63.
function nokta3(x, w) {
    const p = kesitNokta(kesitPar(x), 1 - Math.abs(w));
    return [x, p[1], (w < 0 ? -p[0] : p[0])];
}

// Sayısal yüzey normali (dışa bakar). Paneller yüzeyden bu yönde ötelenir.
function normal3(x, w) {
    const h = 0.0035;
    const hx = (x > UZUN - 0.004) ? -h : h;
    const hw = (Math.abs(w) > 0.996) ? -h : h;
    const a = nokta3(x, w), b = nokta3(x + hx, w), c = nokta3(x, w + hw);
    const ux = b[0] - a[0], uy = b[1] - a[1], uz = b[2] - a[2];
    const vx = c[0] - a[0], vy = c[1] - a[1], vz = c[2] - a[2];
    let nx = uy * vz - uz * vy, ny = uz * vx - ux * vz, nz = ux * vy - uy * vx;
    const L = Math.sqrt(nx * nx + ny * ny + nz * nz) || 1;
    nx /= L; ny /= L; nz /= L;
    const P = kesitPar(x), yc = (P.yA + P.yU) / 2;
    if (ny * (a[1] - yc) + nz * a[2] < 0) { nx = -nx; ny = -ny; nz = -nz; }
    return [nx, ny, nz];
}

// Verilen yükseklikteki v (y, v ile monoton arttığı için ikili arama).
function vYukseklik(x, y) {
    const P = kesitPar(x);
    let a = 0, b = 1;
    for (let i = 0; i < 24; i++) {
        const m = (a + b) / 2;
        if (kesitNokta(P, m)[1] < y) a = m; else b = m;
    }
    return (a + b) / 2;
}

// ===========================================================================
// 4. GÖVDE KABUĞU (loft)
// ===========================================================================
// İstasyonlar KESİTİN HIZLI DEĞİŞTİĞİ yerlerde sık: burun (cam kavisi),
// kuyruk kirişinin gövdeden ayrıldığı yer (en sert daralma) ve motor
// güvertesi tümseği. Kirişin düz bölümünde kesit neredeyse hiç değişmiyor,
// sık örneklemek yalnız üçgen harcar.
const IST = [
    -5.500, -5.400, -5.250, -5.080, -4.900, -4.560, -4.200, -3.800,
    -3.400, -3.050, -2.700, -2.400, -2.100, -1.850, -1.600, -1.350,
    -1.100, -0.850, -0.600, -0.300,  0.000,  0.300,  0.600,  0.900,
     1.200,  1.600,  2.000,  2.400,  2.800,  3.200,  3.500,  3.800,
     4.050,  4.300,  4.500,  4.700,  4.880,  5.050,  5.180,  5.300,
     5.380,  5.440,  5.500
];
const R_HALKA = 2 * NV - 2;

function halka(x) {
    const P = kesitPar(x), yarim = [];
    for (let i = 0; i < NV; i++) yarim.push(kesitNokta(P, i / (NV - 1)));
    // 0 = karın ortası → +z tarafı yukarı → NV-1 = tepe ortası → -z tarafı
    // aşağı. Kapalı halka, kutup yok, bozuk üçgen yok.
    const r = [];
    for (let i = 0; i < NV; i++) r.push([yarim[i][1], yarim[i][0]]);
    for (let i = NV - 2; i >= 1; i--) r.push([yarim[i][1], -yarim[i][0]]);
    return r;
}

(function govdeKur() {
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
    // Ön/arka kapak: düz üçgen yelpaze. Halka köşeleri KOPYALANIYOR ki
    // computeVertexNormals kapağın normalini yan yüzeyinkiyle ortalamasın.
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
    modelGroup.add(mesh(geo, C_GOVDE, { metal: 0.34, rough: 0.40, name: 'govde' }));
})();

// ===========================================================================
// 5. YÜZEYE OTURAN PANELLER (cam, kapı dikişi, ray)
// ===========================================================================
// Gövde yüzeyi x1..x2 ve w1..w2 aralığında yeniden örnekleniyor ve normal
// boyunca `disari` kadar ötelenıyor. Panel gövdenin kavisine BİREBİR oturuyor;
// düz bir levha olsaydı kavisli yüzeyden yer yer batar yer yer havada kalırdı
// — helikopterin burnu neredeyse yarım küre olduğu için burada otomobildeki
// kadar bile hoşgörü yok.
//
// ⚠️ nx / nw: nx bandın X yönündeki, nw ise W yönündeki bölüntü sayısı.
// Bandın UZUN kenarına çok bölüntü verilmezse şerit yüzeyin kavisini takip
// edemeyip ortasından yüzeyin İÇİNE girer ve KAYBOLUR (otobüste ön cam köşe
// bandı bu yüzden yırtıldı). Dikey dikişlerde nx=1/nw=12, yatay dikişlerde
// nx=14/nw=1.
//
// Bant biçimi: [x1, x2, w1, w2]  ya da  [x1, x2, y1, y2, taraf] — ikincide
// a YÜKSEKLİK'tir ve her x'te o yüksekliğin w'si aranır. Kavisin İÇİNDEN
// geçen bantlar w biçiminde yazılır (tuzak listesi md.3).
function yuzeyYama(ad, bantlar, nx, nw, disari, renk, opts) {
    opts = opts || {};
    const P = [], IDX = [];
    for (const bant of bantlar) {
        const x1 = bant[0], x2 = bant[1], a1 = bant[2], a2 = bant[3];
        const taraf = bant.length > 4 ? bant[4] : 0;
        const taban = P.length / 3, S = nw + 1;
        for (let i = 0; i <= nx; i++) {
            const x = x1 + (x2 - x1) * i / nx;
            for (let j = 0; j <= nw; j++) {
                const a = a1 + (a2 - a1) * j / nw;
                const w = taraf ? taraf * (1 - vYukseklik(x, a)) : a;
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
        metal: opts.metal == null ? 0.3 : opts.metal,
        rough: opts.rough == null ? 0.35 : opts.rough, name: ad
    });
    m.material.side = THREE.DoubleSide;
    // Kalınlıksız paneller GÖLGE DÜŞÜRMEZ: gövdeye 8-12 mm mesafede
    // duruyorlar, gölge haritasında kendi gölgelerini gövdenin üstüne basıp
    // benek (acne) üretiyorlardı.
    m.castShadow = false;
    modelGroup.add(m);
    return m;
}

// ---- KOKPİT CAMI ----------------------------------------------------------
// Sivil helikopteri sivil yapan birinci şey. Askeri taarruz helikopterinde
// kanopi KADEMELİ ve DAR (tandem oturuş, iki ayrı küçük kutu); burada tek
// parça, YERDEN TAVANA dolanan geniş bir kavis var. Bant w=±0.085'ten
// başlıyor: aradaki şerit gövde renginde kalıyor ve ön cam ORTA DİREĞİ
// kendiliğinden çıkıyor (ayrı bir çıta koymaya gerek yok — koysaydık havada
// duran bir levha gibi okunurdu, motosiklet dersi).
// ⚠️ Sınır ±0.085 idi ve direk 49 cm çıkıyordu (kesit_olc ile ölçüldü):
// kubbe bölümünde z, w ile ÇOK YAVAŞ değişiyor (süper-elips), yani w'deki
// eşit adım tavanın ortasında büyük, kenarında minicik bir mesafeye karşılık
// geliyor. ±0.050, x=4.3'te 31 cm'lik gerçek bir direk bırakıyor.
[1, -1].forEach(function (s, i) {
    // İKİ BANT, tek dikdörtgen DEĞİL. Tek bant [3.88..5.42] x [0.05..0.635]
    // camı kokpitin TAVANINDA da sonuna kadar götürüyordu ve burun baştan
    // sona siyah bir kabarcık gibi okunuyordu. Gerçek makinede tavan camı
    // yalnız pilotun BAŞININ ÜSTÜNDE (öne bakış için); arkası boya.
    yuzeyYama('cam_on_' + (i + 1), [
        [3.88, 5.42, s * 0.200, s * 0.635],    // ön/yan yüz — tam boy
        [4.35, 5.42, s * 0.050, s * 0.200]     // tavan camı — yalnız öndeki
    ], 10, 8, 0.012, C_CAM, { metal: 0.35, rough: 0.16 });
    // ÇENE CAMI: pilotun ayaklarının altındaki aşağı bakış penceresi. Sivil
    // çok amaçlı helikopterin (arama-kurtarma, hasta nakli) imza penceresi;
    // askeri taarruzda o bölge zırh ve sensör topudur.
    yuzeyYama('cam_cene_' + (i + 1),
              [[4.16, 5.10, s * 0.700, s * 0.905]], 7, 5, 0.011, C_CAM,
              { metal: 0.35, rough: 0.16 });
    // KOKPİT KAPISI CAMI
    yuzeyYama('cam_kapi_' + (i + 1),
              [[3.10, 3.86, s * 0.330, s * 0.580]], 6, 7, 0.011, C_CAM,
              { metal: 0.35, rough: 0.16 });
    // KAYAR YAN KAPININ PENCERESİ (yolcu kabini)
    // ⚠️ Sınırlar 0.300-0.590 idi: kesit ölçümünde pencere y 1.17'den 2.28'e,
    // yani 1.11 m boyunda çıkıyor ve kabin OTOBÜS gibi okunuyordu.
    // 0.360-0.560 aralığı y 1.40-2.17, yani 0.77 m veriyor — gerçek oran bu.
    yuzeyYama('cam_yan_' + (i + 1),
              [[1.52, 2.90, s * 0.360, s * 0.560]], 9, 6, 0.011, C_CAM,
              { metal: 0.35, rough: 0.16 });
});

// ---- KAPI AYRIM ÇİZGİLERİ + KAYAR KAPI RAYI -------------------------------
// Kabinin yan yüzü yassı (alt üs 0.58) ve o yüzeyde başka hiçbir şey yok;
// dikişler olmasaydı 4 metrelik boş bir levha kalırdı — otobüste ölçülen
// tuzağın aynısı.
[1, -1].forEach(function (s, i) {
    // kokpit kapısı: ön kenar · arka kenar · alt kenar
    yuzeyYama('kapi_kokpit_' + (i + 1), [
        [3.02, 3.05, s * 0.235, s * 0.760],
        [3.94, 3.97, s * 0.235, s * 0.760]
    ], 1, 12, 0.006, C_CERC, { metal: 0.15, rough: 0.7 });
    yuzeyYama('kapi_kokpit_alt_' + (i + 1),
              [[3.02, 3.97, s * 0.760, s * 0.775]], 12, 1, 0.006, C_CERC,
              { metal: 0.15, rough: 0.7 });
    // kayar kapı: ön kenar (kokpit kapısının arkası) · arka kenar · alt kenar
    yuzeyYama('kapi_kayar_' + (i + 1), [
        [1.32, 1.35, s * 0.245, s * 0.790],
        [3.00, 3.03, s * 0.245, s * 0.790]
    ], 1, 12, 0.006, C_CERC, { metal: 0.15, rough: 0.7 });
    yuzeyYama('kapi_kayar_alt_' + (i + 1),
              [[1.32, 3.03, s * 0.790, s * 0.805]], 16, 1, 0.006, C_CERC,
              { metal: 0.15, rough: 0.7 });
    // KAYAR KAPININ RAYI. Kapının KAYAR olduğunu anlatan tek işaret bu:
    // menteşeli kapıda ray olmaz. Kapı geriye kaydığı için ray kapının arka
    // kenarından bir kapı boyu daha uzuyor.
    yuzeyYama('kapi_ray_' + (i + 1),
              [[1.30, 3.05, s * 0.232, s * 0.248]], 16, 1, 0.010, C_KIZAK,
              KROM_MAL);
});

// ===========================================================================
// 6. HACİMLİ PARÇALAR
// ===========================================================================
const cyl = (rt, rb, h, s) => new THREE.CylinderGeometry(rt, rb, h, s || 14);
const box = (w, h, d) => new THREE.BoxGeometry(w, h, d);

// İki nokta arasına silindir (kızak bacakları, kıvrık uçlar, antenler).
function boru(ad, p1, p2, r, renk, opts) {
    opts = opts || {};
    const a = new THREE.Vector3(p1[0], p1[1], p1[2]);
    const b = new THREE.Vector3(p2[0], p2[1], p2[2]);
    const d = new THREE.Vector3().subVectors(b, a);
    const m = mesh(cyl(r, r, d.length(), opts.seg || 10), renk, {
        metal: opts.metal == null ? 0.4 : opts.metal,
        rough: opts.rough == null ? 0.4 : opts.rough, name: ad
    });
    m.position.set((p1[0] + p2[0]) / 2, (p1[1] + p2[1]) / 2, (p1[2] + p2[2]) / 2);
    m.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), d.normalize());
    modelGroup.add(m);
    return m;
}

// Yassı, süpürülmüş yüzey (dikey kuyruk, stabilizatör, anten bıçağı).
// ⚠️ Kalınlıksız kabuk aks doğrultusundan görünmez (çamurlukta ölçüldü):
// tam yandan bakışta saç teli inceliğinde bir çizgiye düşer. Bu yüzden
// EXTRUDE, kalınlık gerçek.
function levha(ad, pts, kalin, renk, opts) {
    opts = opts || {};
    const s = new THREE.Shape();
    s.moveTo(pts[0][0], pts[0][1]);
    for (let i = 1; i < pts.length; i++) s.lineTo(pts[i][0], pts[i][1]);
    s.closePath();
    // ⚠️ bevelEnabled: false. THREE'nin bevelSize'ı konturu DIŞARI iter,
    // yani pahlı extrude istenen dış yüzeyi aşar (motokaravanda ölçüldü).
    const g = new THREE.ExtrudeGeometry(s, { depth: kalin, bevelEnabled: false, steps: 1 });
    g.translate(0, 0, -kalin / 2);
    const m = mesh(g, renk, {
        metal: opts.metal == null ? 0.3 : opts.metal,
        rough: opts.rough == null ? 0.45 : opts.rough,
        flat: !!opts.flat, name: ad
    });
    modelGroup.add(m);
    return m;
}

// ---- DİKEY KUYRUK (süpürülmüş) --------------------------------------------
// Tepesi 3.20; ana rotor göbeğinin (3.45) altında kalıyor ki tepeden bakışta
// rotor diskiyle çakışıp tek bir kütle gibi okunmasın.
// ⚠️ Kök kenarı (y 1.92-1.95) kirişin TEPESİNİN (2.02-2.05) ALTINDA: parçalar
// birbirine girsin. Matematiksel olarak değmek görsel sürekliliği vermiyor,
// üç ayrı havada duran levha gibi okunuyor (motosiklet dersi).
levha('dikey_kuyruk',
      [[-3.85, 1.95], [-4.60, 3.05], [-5.18, 3.20], [-5.50, 2.86], [-5.02, 1.92]],
      0.145, C_GOVDE, { metal: 0.34, rough: 0.40 });
// ALT YÜZGE (ventral fin): kuyruğun altında, kuyruk kirişini yerde korur.
levha('alt_yuzge',
      [[-4.35, 1.70], [-5.42, 1.02], [-5.50, 1.30], [-4.95, 1.74]],
      0.115, C_GOVDE, { metal: 0.34, rough: 0.40 });

// ---- YATAY STABİLİZATÖR + UÇ LEVHALARI ------------------------------------
// Kuyruk kirişinin iki yanında. Chinook'ta yok (tandem rotor dengeyi kendi
// kurar), saldırı helikopterinde tek parça kiriş üstünde; burada iki ayrı
// kanatçık + uç levhası, sivil hafif helikopterin tipik düzeni.
[1, -1].forEach(function (s, i) {
    const st = mesh(box(0.72, 0.085, 1.05), C_GOVDE,
                    { metal: 0.34, rough: 0.40, name: 'yatay_stabilize_' + (i + 1) });
    st.position.set(-3.30, 1.92, s * 0.72);
    st.rotation.x = s * 0.05;   // hafif dihedral
    modelGroup.add(st);
    // Uç levhası: 0.62 x 0.52 denendi, stabilizatörün üstünde duran mavi bir
    // kalas gibi okunuyordu. 0.50 x 0.38 ve stabilizatöre ORTALI.
    const uc = mesh(box(0.50, 0.38, 0.070), C_GOVDE,
                    { metal: 0.34, rough: 0.40, name: 'stabilize_uc_' + (i + 1) });
    uc.position.set(-3.32, 1.99, s * 1.21);
    modelGroup.add(uc);
});

// ---- MOTOR GÜVERTESİ: HAVA GİRİŞLERİ + EGZOZLAR ---------------------------
// Sırttaki tümseğin ne olduğunu anlatan iki detay. Yoksa kambur sebepsiz
// görünüyor.
[1, -1].forEach(function (s, i) {
    const gir = mesh(cyl(0.20, 0.20, 0.30, 12), C_KOYU,
                     { metal: 0.3, rough: 0.55, name: 'hava_girisi_' + (i + 1) });
    gir.rotation.z = Math.PI / 2;
    gir.rotation.y = -s * 0.12;
    gir.position.set(0.86, 2.60, s * 0.40);
    modelGroup.add(gir);
    // egzoz: geriye ve dışa bakan kısa boru
    const egz = mesh(cyl(0.155, 0.175, 0.42, 12), '#4a4d52',
                     { metal: 0.45, rough: 0.35, name: 'egzoz_' + (i + 1) });
    egz.rotation.z = Math.PI / 2;
    egz.rotation.y = s * 0.42;
    egz.position.set(-0.92, 2.50, s * 0.46);
    modelGroup.add(egz);
    const egzIc = mesh(cyl(0.115, 0.115, 0.06, 12), C_KOYU,
                       { rough: 0.9, name: 'egzoz_ic_' + (i + 1) });
    egzIc.rotation.z = Math.PI / 2;
    egzIc.rotation.y = s * 0.42;
    egzIc.position.set(-1.09, 2.42, s * 0.54);
    modelGroup.add(egzIc);
});
// Dişli kutusu kaportası (mast'ın oturduğu kaide)
const mgb = mesh(cyl(0.42, 0.52, 0.30, 16), '#454a52',
                 { metal: 0.4, rough: 0.4, name: 'disli_kaporta' });
mgb.position.set(MAST_X, 2.78, 0);
modelGroup.add(mgb);

// ===========================================================================
// 7. ANA ROTOR — BEŞ PAL
// ===========================================================================
// Pal sayısı ayrışmanın parçası: chinook'ta iki ayrı 3 palli rotor,
// saldırı helikopterinde 4 pal. Beş pal (H145'in yataksız rotoru) sivil
// makinenin işareti.
const mast = mesh(cyl(0.105, 0.125, 0.46, 12), C_METAL,
                  { metal: 0.45, rough: 0.3, name: 'rotor_mili' });
mast.position.set(MAST_X, 2.98, 0);
modelGroup.add(mast);

const rotor = spin({ pivot: [MAST_X, GOBEK_Y, 0], axis: 'y', rpm: 150 });
// Göbek + başlık: spin grubunun İÇİNDE (mil sabit, göbek döner).
const gobek = mesh(cyl(0.30, 0.32, 0.26, 16), C_GOBEK,
                   { metal: 0.4, rough: 0.35, name: 'rotor_gobek' });
rotor.add(gobek);
const baslik = mesh(cyl(0.16, 0.28, 0.20, 16), C_GOBEK,
                    { metal: 0.4, rough: 0.35, name: 'rotor_baslik' });
baslik.position.y = 0.09;   // tepesi 3.26 + 0.09 + 0.10 = 3.45 = modelin tepesi
rotor.add(baslik);
// Swashplate (hatve bileziği): göbeğin altındaki ince halka.
const bilezik = mesh(cyl(0.34, 0.34, 0.07, 16), C_METAL,
                     { metal: 0.45, rough: 0.3, name: 'rotor_bilezik' });
bilezik.position.y = -0.20;
rotor.add(bilezik);

for (let i = 0; i < 5; i++) {
    // ⚠️ FAZ 0: ilk pal +x'te. Beşgenin sin değerleri bu fazda simetrik,
    // yani duran modelin kutusu z'de ORTALI çıkıyor (dosya başındaki not).
    const a = i * 2 * Math.PI / 5;
    // Pal kalınlığı 0.09: kalınlıksız levha tepeden bakışta ve dönerken
    // kayboluyor (ölçülmüş tuzak md.4). 0.34 veter ile birlikte üstten
    // rahat okunuyor ama yandan da gerçek bir kanat kesiti kadar ince.
    // ⚠️ HATVE (feathering) GEOMETRİYE İŞLENİYOR, mesh.rotation ile DEĞİL.
    // Euler XYZ sırasında Rx en DIŞTA uygulanır; `rotation.x = 0.055` palin
    // kendi uzun ekseni yerine MODELİN x ekseni etrafında dönerdi ve +z'ye
    // bakan palin ucu 0.30 birim havalanıp kutunun y'sini 3.45'ten 3.56'ya
    // çıkarırdı (ölçüldü). Geometri üzerinde rotateX → translate → rotateY
    // sırası bu belirsizliği tamamen kaldırıyor.
    const bg = box(ROTOR_R - PAL_KOK, 0.09, 0.34);
    const rm = (PAL_KOK + ROTOR_R) / 2;
    bg.rotateX(0.055);
    bg.translate(rm, 0, 0);
    bg.rotateY(-a);
    const bl = mesh(bg, C_ROTOR,
                    { metal: 0.15, rough: 0.55, name: 'pal_' + (i + 1) });
    rotor.add(bl);
    // KÖK MANŞONU: palin göbeğe girdiği yer. Beş palin her birine AYRI ad
    // (aynı ad verilseydi _applyTint yalnız ilkini bulurdu — üç kanatlı
    // pervanede ölçüldü; burada renk almasa da kural aynı kalsın).
    const kok = mesh(cyl(0.075, 0.075, 0.30, 8), C_METAL,
                     { metal: 0.45, rough: 0.3, name: 'pal_kok_' + (i + 1) });
    kok.rotation.z = Math.PI / 2;
    kok.rotation.y = -a;
    kok.position.set(Math.cos(a) * 0.30, 0, Math.sin(a) * 0.30);
    rotor.add(kok);
}

// ===========================================================================
// 8. KUYRUK ROTORU
// ===========================================================================
// Ekseni YANAL (z): kuyruk rotoru gövdeyi döndüren torku dengeler, bu yüzden
// itişi yana bakar. spin({axis:'z'}) tam bunu veriyor.
const ktMil = mesh(cyl(0.075, 0.075, 0.26, 10), C_METAL,
                   { metal: 0.45, rough: 0.3, name: 'kuyruk_mili' });
ktMil.rotation.x = Math.PI / 2;
ktMil.position.set(KT_X, KT_Y, KT_Z - 0.10);
modelGroup.add(ktMil);

const ktRotor = spin({ pivot: [KT_X, KT_Y, KT_Z], axis: 'z', rpm: 620 });
const ktGobek = mesh(cyl(0.13, 0.13, 0.13, 12), C_GOBEK,
                     { metal: 0.4, rough: 0.35, name: 'kuyruk_gobek' });
ktGobek.rotation.x = Math.PI / 2;
ktRotor.add(ktGobek);
for (let i = 0; i < 4; i++) {
    const a = i * Math.PI / 2;
    // Paller xy düzleminde (pivot'a göre). Uzunluk KT_R - 0.12 kök payı.
    const bl = mesh(box(KT_R - 0.12, 0.19, 0.055), C_ROTOR,
                    { metal: 0.15, rough: 0.55, name: 'kuyruk_pal_' + (i + 1) });
    const rm = (0.12 + KT_R) / 2;
    bl.position.set(Math.cos(a) * rm, Math.sin(a) * rm, 0);
    bl.rotation.z = a;
    ktRotor.add(bl);
}

// ===========================================================================
// 9. KIZAKLAR (TEKERLEK YOK — ayrışmanın ikinci maddesi)
// ===========================================================================
// chinook'ta 4 tekerlek, saldırı helikopterinde 2 + kuyruk tekeri var.
// Sivil hafif helikopter kızakla iner. Kızak modeli aynı zamanda uçuş
// duruşunun temas kutusunu veriyor (davranış bölümüne bak).
[1, -1].forEach(function (s, i) {
    const z = s * KIZAK_Z;
    // düz boru
    boru('kizak_boru_' + (i + 1), [KIZAK_X1, KIZAK_R, z], [KIZAK_X2, KIZAK_R, z],
         KIZAK_R, C_KIZAK, Object.assign({ seg: 12 }, KROM_MAL));
    // öndeki yukarı kıvrık uç — kızağın tanınma işareti
    boru('kizak_uc_' + (i + 1), [KIZAK_X2 - 0.02, KIZAK_R, z], [KIZAK_UC, 0.42, z],
         KIZAK_R * 0.92, C_KIZAK, Object.assign({ seg: 10 }, KROM_MAL));
    // arka uçtaki kapak (boru ağzı açık kalmasın)
    const kap = mesh(new THREE.SphereGeometry(KIZAK_R, 10, 8), C_KIZAK,
                     Object.assign({ name: 'kizak_kapak_' + (i + 1) }, KROM_MAL));
    kap.position.set(KIZAK_X1, KIZAK_R, z);
    modelGroup.add(kap);
    // ÇAPRAZ BACAKLAR. Uçları gövdenin İÇİNDE bitiyor (y 0.72, z ±0.40):
    // matematiksel olarak değmek görsel sürekliliği vermiyor, parçalar
    // birbirine GİRMELİ (motosiklet dersi). Karın o x'lerde 0.52-0.55.
    boru('kizak_bacak_on_' + (i + 1), [2.45, KIZAK_R, z], [2.28, 0.72, s * 0.40],
         0.055, C_KIZAK, Object.assign({ seg: 8 }, KROM_MAL));
    boru('kizak_bacak_arka_' + (i + 1), [0.55, KIZAK_R, z], [0.72, 0.72, s * 0.40],
         0.055, C_KIZAK, Object.assign({ seg: 8 }, KROM_MAL));
    // basamak: kayar kapının önünde, kızağın üstünde
    const bas = mesh(box(0.62, 0.045, 0.20), '#6f757c',
                     { metal: 0.4, rough: 0.5, name: 'basamak_' + (i + 1) });
    bas.position.set(1.62, 0.34, s * 1.02);
    modelGroup.add(bas);
    boru('basamak_kol_' + (i + 1), [1.62, KIZAK_R, z], [1.62, 0.34, s * 1.02],
         0.030, C_KIZAK, Object.assign({ seg: 6 }, KROM_MAL));
});

// ===========================================================================
// 10. KÜÇÜK PARÇALAR
// ===========================================================================
// İNİŞ FARI. Burnun altında, YARISI karnın dışında: karın x=4.80'de 0.882
// (kesit_olc ile ölçüldü), merkez 0.84 ve yarıçap 0.115 → alt yarısı taşıyor.
// Tamamen
// içeride bıraksaydık hiç görünmezdi, tamamen dışarıda bıraksaydık havada
// duran bir disk olurdu.
const far = mesh(cyl(0.115, 0.115, 0.07, 14), C_FAR,
                 { metal: 0.2, rough: 0.15, name: 'far' });
far.rotation.z = Math.PI / 2;   // ekseni +x → disk öne bakar
far.position.set(4.80, 0.84, 0);
modelGroup.add(far);
// Seyir lambaları: +z SOL taraf (motorun kuralı: sağ taraf -z) → kırmızı.
const lmpS = mesh(new THREE.SphereGeometry(0.075, 10, 8), C_KIRMIZI,
                  { metal: 0.2, rough: 0.25, name: 'seyir_lambasi_1' });
lmpS.position.set(2.30, 1.40, 0.985);
modelGroup.add(lmpS);
const lmpG = mesh(new THREE.SphereGeometry(0.075, 10, 8), C_YESIL,
                  { metal: 0.2, rough: 0.25, name: 'seyir_lambasi_2' });
lmpG.position.set(2.30, 1.40, -0.985);
modelGroup.add(lmpG);
// Çakar (anti-collision) — kuyruk kirişinin sırtında
const cakar = mesh(cyl(0.055, 0.070, 0.11, 10), C_KIRMIZI,
                   { metal: 0.2, rough: 0.25, name: 'cakar' });
cakar.position.set(-2.20, 2.28, 0);
modelGroup.add(cakar);
// Anten bıçağı — kirişin altında. Üst kenarı karnın (x=-2.3'te 1.49) ÜSTÜNDE
// kalsın diye 1.56: aksi hâlde kirişin altında havada duruyor.
levha('anten', [[-2.30, 1.56], [-2.62, 1.56], [-2.52, 1.36], [-2.36, 1.36]],
      0.045, '#2a2d32', { metal: 0.3, rough: 0.5 });
// PITOT TÜPÜ KALDIRILDI (Furkan: "sol camdan ince bir çubuk çıkıyor, onu
// kaldır"). Eski hâli: `boru('pitot', [4.95,1.93,0.30], [5.42,1.90,0.30],
// 0.022, ...)`. Kökü gövdenin içindeydi, ucu burnun daralmasıyla dışarı
// çıkıyordu — ama çıktığı yer BOYA DEĞİL CAMDI: ön cam bandı |w| 0.200-0.635
// aralığını kaplıyor ve tüpün geçtiği (y≈1.91, z=0.30) noktası tam onun
// ortası. Çubuk camın içinden fışkırıyor gibi okunuyordu.
// ⚠️ YERİNE OTURTMA DENENDİ VE BIRAKILDI, sebebi burada dursun ki bir
// sonraki oturum aynı yolu tekrar aramasın: burun DIŞBÜKEY ve hızlı
// alçalıyor (sırt x=5.05'te 2.060, x=5.45'te 1.682). Düz bir çubuk konveks
// bir yüzeye ne paralel oturuyor ne de ucu havada kalmadan uzanıyor —
// ölçüldü: sırt boyunca 0.40 m'lik bir kiriş ortada 34 mm gömülü, uçlarda
// 53 mm havada kalıyor. Gerçek burun pitot'ları bu yüzden kısa bir DİREĞE
// oturur; o da tek parça değil iki parça demek. Camdan geçmeyen tek boya
// şeridi (ön cam altı ile çene camı arası, |w| 0.635-0.700) yalnız 74-164 mm
// genişlikte ve orada duran bir çubuk pitot değil, bordo çıtası gibi
// okunuyordu. 11 m'lik makinede 44 mm çaplı bir tüpün haritada taşıdığı
// bilgi bu bedeli hak etmiyor.
// KAPI KOLLARI. Pencerenin (|w| 0.36-0.56) hemen ALTINDA: |w| büyüdükçe
// kesitte AŞAĞI iniliyor (v = 1-|w|). 0.66 önce denendi, kol y=0.94'e
// düşüyordu (kapı 0.66-2.39 arası, yani neredeyse dibe); 0.58 kolu y=1.23'e,
// pencerenin 17 cm altına koyuyor.
// Yüzeyin kendi noktası ve normali okunuyor, göz kararı koordinat değil.
[1, -1].forEach(function (s, i) {
    const p = nokta3(2.86, s * 0.58);
    const n = normal3(2.86, s * 0.58);
    const kol = mesh(box(0.20, 0.055, 0.05), '#6f757c',
                     { metal: 0.4, rough: 0.4, name: 'kapi_kol_' + (i + 1) });
    kol.position.set(p[0] + n[0] * 0.03, p[1] + n[1] * 0.03, p[2] + n[2] * 0.03);
    modelGroup.add(kol);
});
// Ayna kolu YOK, silah YOK, sensör topu YOK: ikisi de askeri helikopterlerin
// işareti ve bu modelin ayrışma listesinde "olmayacaklar" tarafında.

// ===========================================================================
// 11. DAVRANIŞ İÇİN GEOMETRİ BİLGİSİ
// ===========================================================================
// Motor genel kalsın diye geometri modelden gelir, davranış yalnız okur
// (DEVIR §5.3). Burada verilen şey KIZAKLARIN YERE DEĞDİĞİ DİKDÖRTGEN:
// helikopter burnu aşağı eğilince davranış bu dikdörtgenin en alçak köşesini
// hesaplayıp modeli o kadar kaldırıyor, yani kızak zeminin altına GİRMİYOR.
// Kutu köşeleriyle yapılamazdı: AABB'nin (5.5, 0) köşesi gerçek geometride
// yok (orada burun 1.42'de) ve model gereksiz yere 0.86 birim havalanırdı.
modelGroup.userData.kizakKutu = {
    x1: KIZAK_X1, x2: KIZAK_UC, z1: -KIZAK_Z, z2: KIZAK_Z
};
