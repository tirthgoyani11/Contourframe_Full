// Okçu — İNGİLİZ UZUN YAYLI OKÇUSU, tam gergin yayla, yürüyüş hâlinde.
// Historical Warfare grubunun ikinci turdan ilk modeli.
//
// ⚠️ ID `okcu`. `ok` (Arrow, Components) ve `ok-tabelasi` DOLU ve BAŞKA
// modeller; `okcu` boştu (95 modelin tamamı listelenip bakıldı).
// EN adı "Archer".
//
// ============================================================================
// REFERANS VE ÖLÇÜLERİN KAYNAĞI  (hiçbiri ezberden değil)
// ============================================================================
// Figür: 15. yy İngiliz uzun yaylı okçusu (Agincourt tipi teçhizat), yayın ve
// okun ölçüleri MARY ROSE batığından — uzun yayın bugüne ulaşan TEK büyük
// ölçülmüş topluluğu.
//
//  * BOY 1.710 m. Mary Rose mürettebatının iskeletten kestirilen ORTALAMA
//    boyu 1.71 m (Mary Rose Trust; tek tek okçularda 1.79 m'ye kadar çıkan
//    örnekler var). Klasik Yunan hopliti 1.705, modern piyade 1.800 —
//    üç figürün boyu üç ayrı popülasyondan geliyor, kopyalanmıyor.
//    ⚠️ Aynı kaynak okçuların GENİŞ OMUZLU olduğunu söylüyor ("marked
//    skeletal shoulder development"); gövde loftunun üst göğüs kesitleri
//    bu yüzden hoplitinkinden %6 geniş ve %19 derin yazıldı.
//
//  * UZUN YAY (warbow): 1.976 m. Mary Rose'dan çıkan 172 yayın ÖLÇÜLMÜŞ boy
//    aralığı 1 839 – 2 113 mm; 1.976 m bu aralığın tam ortası (ortalama
//    yayımlanmadığı için orta nokta alındı, uydurulmadı). Hepsi TEK PARÇA
//    PORSUK. Figürün boyunun 1.156 katı.
//    - Sap kesiti: 35 mm en × 33 mm derinlik (Mary Rose katalog ölçüsü,
//      D kesit). Uçlara doğru incelme oranı MODEL KARARI (katalogda yok):
//      13 mm × 12 mm.
//    - Çekiş kuvveti 65–175 lb, tepe 110 lb (kataloğun kendi dağılımı) —
//      geometriye girmiyor, .json açıklamasında duruyor.
//    - Porsuk yayın SIRTI diri odun (açık), KARNI öz odun (koyu): iki ayrı
//      mesh, iki ayrı renk. Tek parça porsuk yayın tanınır çizgisi bu.
//
//  * OK: 0.780 m. Mary Rose oklarının ölçülen boyu 667–880 mm, çoğunluk
//    715–845 mm. Sap çapı 11 mm MODEL KARARI.
//    - ÇEKİŞ BOYU 0.712 m. Mary Rose oklarından KESTİRİLEN iki çekiş
//      boyundan (712 mm ve 762 mm) KISA olanı seçildi; gerekçe ölçüldü:
//      1.710 m'lik figürün omuz→kavrama zinciri 0.620 m ve 0.712 m'lik
//      çekiş bu zinciri TAM AÇIYOR (gereken 0.6199 m). 762 mm'lik çekiş
//      kolu kopartırdı. Yani uzun yay tekniğinin bilinen özelliği — YAY
//      KOLU KİLİTLİ DÜZ — burada iddia değil, ölçüden çıkan sonuç.
//
//  * OKLUK (arrow bag): Mary Rose'da 24 delikli (½″) 17 adet DAİRESEL DERİ
//    ARA DİSK bulundu; disk keten bir torbanın ortasına dikiliydi, alt ucu
//    iple bağlanıp saman doldurulmuştu. Bir "sheaf" = 24 ok. Replika
//    ölçüsü 6¾″ = 0.171 m; disk çapı buradan.
//    ⚠️ 24 okun hepsi modellenmedi (mesh bütçesi): disk 24 delikli ölçüde
//    ama görünen ok sayısı 9.
//
//  * BİLEK KORUMASI (bracer): batıkta 24 adet, ağırlıklı olarak deri.
//
//  * GİYİM (Agincourt, dönem kronikleri): okçular çoğunlukla zırhsız,
//    "pourpoint" (kapitone jak) ve hose ile; başlık haşlanmış deriden ya da
//    demir çerçeveyle kaburgalanmış hasır bir takke ("huvette"/cappeline);
//    kemerde balta/kısa balta. Model buna uyuyor: kapitone jak, hose,
//    kaburgalı deri takke, kemerde balta.
//
// ============================================================================
// DURUŞ — NEDEN TAM GERGİN YAY, VE KANT NEDEN VAR
// ============================================================================
// ⚠️ Duruş kararı ÖLÇÜMLE alındı, göz kararıyla değil.
//
// 1) TAM GERGİN YAY. Gevşek (yalnız kurulu) bir yay tepeden ve uzaktan
//    kalınlığı kadar okunuyor: ince bir çubuk. Tam gergin yayda kollar
//    derin bir yaya bükülüyor ve kiriş V yapıyor — 20 pikselde bile
//    "yay" olarak okunan tek hâl bu. Ayrıca iki el de teçhizatta olduğu
//    için "serbest kol salınımı yok" şartı duruştan KENDİLİĞİNDEN çıkıyor
//    (mızraklı piyadedeki kalkan+mızrak ikilisiyle aynı gerekçe).
//
// 2) KANT (yayın yana yatırılması) = 35°. BU BİR MODEL KARARIDIR, tarihsel
//    iddia DEĞİL — dönem ikonografisinden doğrulanamadı, o yüzden kaynak
//    olarak sunulmuyor. Gerekçesi ÖLÇÜLDÜ (okcu_kant_tara.py, beş açı):
//        kant   kutu x/z        oran x/z   siluet m2   doluluk
//         0°    1.156 x 0.600     1.927      0.235      0.338
//        15°    1.156 x 0.600     1.927      0.252      0.364
//        25°    1.156 x 0.793     1.459      0.259      0.283
//        35°    1.156 x 1.068     1.083      0.266      0.215   <- SEÇİLEN
//        45°    1.156 x 1.311     0.882      0.272      0.180
//      KIYAS: piyade 1.954 / 0.448 · mızraklı piyade 2.673 / 0.183.
//    * 0° ve 15°'de yay gövdenin z açıklığının İÇİNDE kalıyor: oran 1.927,
//      modern piyadenin 1.954'ü ile fark %1.4 — tepeden AYIRT EDİLEMEZ.
//      Brief'in uyardığı risk tam olarak bu ve ölçüldü.
//    * 45°'de oran güzel (0.882) ama DOLULUK 0.180'e düşüyor ve mızraklı
//      piyadenin 0.183'üne çakışıyor — bu sefer öbür figüre yaklaşıyor.
//    * 35° iki sayıda da ikisinden UZAK duran tek açı: oran 1.083
//      (piyade 1.954, mızraklı 2.673), doluluk 0.215 (0.448 ve 0.183).
//    ⚠️ DENENDİ VE İŞE YARAMADI: siluetin PCA ana ekseninin yürüyüş yönüyle
//    yaptığı açı ayırt etmiyor (okçu 9.5°, piyade 8.5°, mızraklı 16.7°) —
//    eksen gövde kütlesine takılıyor, yayın ince yayı taşımıyor. Ayrımın
//    ölçüsü ORAN x/z ile DOLULUK ikilisi.
//    Kant YÖNÜ: üst kol yay eline (ham +z, üründe SOL) doğru yatıyor,
//    yani YÜZDEN UZAĞA. Ters yatsaydı üst kol çekiş dirseğinin ve yüzün
//    üstüne gelirdi.
//
// 3) OMUZ KUŞAĞI 72° DÖNDÜRÜLDÜ (kalça kare). Sebep geometrik ve ölçülü:
//    0.712 m'lik çekiş, yay eli ile çene arasındaki mesafeyi 0.712 m
//    yapmayı gerektiriyor; omuz kuşağı kare dururken yay omzu ile yay eli
//    arası 0.703 m çıkıyor ve 0.620 m'lik kol zincirine SIĞMIYOR. 72°'de
//    gereken uzunluk 0.6199 m — tam sınırda. Atıcı duruşu bir tercih değil,
//    çekiş boyunun zorunlu sonucu.
//
// ============================================================================
// MODERN `piyade` VE `mizrakli-piyade` İLE KARIŞMAMASI
// ============================================================================
// ÖLÇÜLDÜ (okcu_tepe_kiyas.py, üçü aynı koşuda, üçü de aynalanmış tepe
// bakışında):
//   model            kutu x / y / z          oran x/z  siluet m2  doluluk
//   okcu             1.156  2.205  1.068       1.083     0.266     0.215
//   mizrakli-piyade  2.428  1.826  0.908       2.673     0.404     0.183
//   piyade           1.010  1.800  0.517       1.954     0.234     0.448
// İki sayının İKİSİ birden ayırıyor:
//   * ORAN x/z — okçu YÜRÜYÜŞ YÖNÜNE DİK uzun (1.08), ötekiler yürüyüş
//     yönünde uzun (1.95 ve 2.67). Bu, tepeden bakınca "yayı olan" ile
//     "silahı ileri bakan" figürü ayıran şey.
//   * DOLULUK — okçu 0.215, piyade 0.448 (iki katından fazla dolu),
//     mızraklı piyade 0.183. Okçu piyadeden dolulukta, mızraklıdan oranda
//     ayrılıyor; iki figüre de aynı anda benzediği bir sayı yok.
// Siluetler yan yana: cikti/okcu-tepe-kiyas.png.
//
// ⚠️ ATEŞ ÇEVRİMİ EKLENDİ (2026-09-06). İlk kurulumda 'fire' YAZILMAMIŞTI ve
// gerekçesi üç zorluktu: kolları eğrilik zinciri hâline getirmek, çekiş kolunu
// her karede ters kinematikle çözmek, motorun namlu alevi + sarı mermisini
// bastırmak. Üçü de kütüphanenin başka yerlerinde çözülmüştü ve buraya
// alındılar:
//   * Eğrilik: kol ZİNCİR DEĞİL — yol tek parametreyle (PHI) her karede
//     yeniden yazılıyor, kadırganın kürek makinesinin deseni (§10-11).
//     Zincir olsaydı mafsal başına kesit yüzeyi açılırdı; kolun yay uzunluğu
//     böyle SABİT kalıyor (odun uzamıyor).
//   * Ters kinematik: çekiş kolu artık mafsal grubu (§9), aynı iki uzuvlu
//     çözüm bacaklardaki `_pyIK`'in kardeşi.
//   * Motorun ateş öğeleri: alev ve sarı mermi GİZLENİYOR (yayda barut yok);
//     mermi olarak OKUN KENDİSİ uçuyor — mancınık/koçbaşı/zıpkın kararı.
// ⚠️ 'fire' HAREKET modu yine YAZILMADI ve bu bilerek: o mod konumu geçişin
// %31.9-47.5'inde donduruyor. Ateş YETENEĞİ hareket modundan ayrı
// (`Studio3D.canFire`, ates_yetenek.py) — okçu oraya yazıldı, ateş kareleri
// yalnız BEKLEME dizisinden geliyor.
//
// ============================================================================
// PARÇA / GRUP SÖZLEŞMESİ (studio-3d.js `registerBehavior('okcu')`)
// ============================================================================
//   kalca_grup      : bütün figür. Davranış YALNIZ position.y yazar.
//   bacak_1/2       : kalça mafsalı. rotation.z = uyluk açısı (+ = ileri).
//   diz_1/2         : diz mafsalı (bacak_i'nin çocuğu). rotation.z = -diz bükümü.
//   ayak_1/2        : bilek mafsalı (diz_i'nin çocuğu). rotation.z = ayak eğimi.
//   omuz_grup       : omuz kuşağı + nişan grubu + ok. rotation.y = gövde
//                     karşı-dönüşü.
//   nisan_grup      : omuz_grup'un çocuğu, İKİ OMUZ MAFSALINDAN GEÇEN eksende.
//                     rotation.z = yay yükselişi (ateş kurulumu, `item.aimT`).
//                     İçinde: iki kol + bilek koruması + yay_kok.
//   cekis_omuz      : çekiş kolunun omuz mafsalı (nisan_grup'un çocuğu).
//   cekis_dirsek    : çekiş kolunun dirseği (cekis_omuz'un çocuğu).
//                     İkisi de ters kinematikle her karede çözülüyor.
//   yay_kok         : nisan_grup'un çocuğu; kant burada (rotation.x). Yayın
//                     bütün geometrisi bu grubun YEREL x-y DÜZLEMİNDE
//                     yazıldı — kant okun yönünü DEĞİŞTİRMİYOR (x ekseni
//                     etrafında dönüş x'i korur).
//   ok_grup         : omuz_grup'un DOĞRUDAN çocuğu (yay_kok'un değil): ok
//                     bırakılınca MODEL uzayında hedefe uçuyor.
//   userData.okcu   : bacak zincirinin ölçüleri (adım uzunluğu buradan çözülür)
//   userData.okcuYay: ateş çevriminin bütün geometrisi + `poz(d)` (§11).
//                     Davranış SAYI KOPYALAMIYOR, faz biliyor.
//
// ⚠️ 1/2 numaralandırması: bacak_1 = model +z tarafı, _2 = -z tarafı.
// ⚠️ HARİTA SOLDAN SAĞA AYNALIYOR (devir §5.3, det(projection) < 0). Bu yüzden
// YAY ham koordinatta +z omzunda, ÇEKİŞ ELİ -z tarafında kuruldu; ürün onları
// aynalayıp yayı SOL ele taşıyor — sağ elini kullanan okçunun gerçek düzeni.
// Düz bir THREE sahnesinde ters görünür, o NORMALDİR.
// ⚠️ YAYA HİÇBİR HARF/ARMA KONMADI (aynı gerekçe: aynada ters okunurdu).
//
// YÖN: burun +x, üst +y, taban y=0. Ölçüler gerçek metre.
//
// ============================================================================
// 0. RENKLER
// ============================================================================
// ⚠️ metalness KURALI (devir §5.1, iki uçlu): 0.85+ neredeyse SİYAH, ama
// metalness'i DÜŞÜRMEK açık renkte patlamayı ARTIRIR. Burada en riskli iki
// yüzey KİRİŞ (açık keten) ve TELEK (kaz teleği): ikisi de tepe bakışında
// model pikselinin küçük ama parlak bir kısmı. Palet parlaklik.py ile
// TARANDI — tek renk değil PALETİN TAMAMI (okcu_palet_tara.py):
//     palet     ortalama L   PARLAK L>230   TAM BEYAZ
//     KOYU        104.6         %0.0          %0.0
//     ORTA        117.8         %2.0          %0.0
//     MEVCUT      129.6         %2.8          %0.0    <- SEÇİLEN
//     ACIK        146.6         %8.4          %1.7
//     COKACIK     164.0        %12.7          %2.0
// Kıyas (devir §5.1): taksi %2, otobüs %13, motokaravan düzeltilmeden önce
// %80. MEVCUT palette TAM BEYAZ piksel SIFIR, yani hiçbir yüzey doymuyor.
// ⚠️ PAY TARAMASI (her sabit tek tek siyaha çekilip parlak piksel düşüşü
// okundu): parlak piksellerin %61.0'ı C_TUY, %33.4'ü C_KIRIS, %5.5'i
// C_KETEN — toplam %99.9. Jak, hose, deri, porsuk ve demir SIFIR katkı
// veriyor. Bu, brief'in uyardığı "tek/birkaç sabitten geliyor" deseninin
// ta kendisi; burada zararsız çünkü toplam %2.8 ve doyma yok.
// ⚠️ DEMİR metalness taraması (0.20'den 0.70'e): parlak piksel sayısı
// DEĞİŞMİYOR (hepsinde 3519), ortalama L yalnız 130.3 -> 128.7 kayıyor.
// Yani demirin metalness'i burada parlaklık kararı DEĞİL; 0.42/0.44 kardeş
// modellerle tutarlı olduğu için korundu.
const C_JAK     = '#6e7047';   // kapitone jak (pourpoint) — _TINT birincili
const C_JAK_K   = '#565939';   // jak kapitone kanalları / omuz bandı
const C_HOSE    = '#7b4c3c';   // yün hose (bacaklar)
const C_DERI    = '#6b543c';   // kemer, ayakkabı, okluk kayışı — ikincil
const C_DERI_K  = '#4b3b2b';   // koyu deri: takke, ara disk, taban
const C_KETEN   = '#a2977a';   // okluk torbası (keten)
const C_YAY     = '#6b4f2e';   // porsuk ÖZ odunu (yayın karnı)
const C_YAY_S   = '#ab9569';   // porsuk DİRİ odunu (yayın sırtı)
const C_KIRIS   = '#b8ab8c';   // kiriş (kenevir/keten)
const C_TUY     = '#a9a396';   // kaz teleği (fletching)
const C_DEMIR   = '#5f636a';   // bodkin uç, takke kaburgası, balta
const C_TEN     = '#ac8368';   // yüz, önkollar
const C_KOYU    = '#1d1e21';   // göz, derin oyuk

// ============================================================================
// 1. TEMEL ÖLÇÜLER — bacak zinciri buradan çıkıyor
// ============================================================================
const BOY       = 1.710;
const HIP_Y     = 0.906;   // femur başı (boyun %53'ü — antropometrik)
const HIP_Z     = 0.093;
const UYLUK     = 0.419;   // kalça → diz  (diz eklemi 0.285 x boy)
const BALDIR    = 0.406;   // diz → bilek
const BILEK_Y   = HIP_Y - UYLUK - BALDIR;   // = 0.081
const TABAN_DY  = -0.081;  // bilekten tabana; taban TAM y=0'da
const TOPUK_X   = -0.072;
const BURUN_X   = 0.184;   // ayak boyu 0.256 = boyun %15'i (ayakkabılı)
const AYAK_W    = 0.054;
const OMUZ_Y    = 1.344;
const OMUZ_Z    = 0.168;   // omuz yarı genişliği

// ---- atıcı duruşu: omuz kuşağının STATİK dönüşü -----------------------------
// 72°: 0.712 m'lik çekişin 0.620 m'lik kol zincirine sığdığı en küçük dönüş.
const PSI = 72 * Math.PI / 180;
const OMZ_X = 0.005;                                   // omuz ekseninin ileri ofseti
const OMZ_1 = [OMZ_X + OMUZ_Z * Math.sin(PSI), OMUZ_Y,  OMUZ_Z * Math.cos(PSI)];
const OMZ_2 = [OMZ_X - OMUZ_Z * Math.sin(PSI), OMUZ_Y, -OMUZ_Z * Math.cos(PSI)];

// ---- yay eli (kavrama) ve çekiş eli (çene çapası) --------------------------
const G_EL = [0.767, 1.448, -0.052];    // yayın sapı = yay elinin merkezi
const C_EL = [0.055, 1.448, -0.052];    // çapa: çenenin sağ yanı
const CEKIS = G_EL[0] - C_EL[0];        // = 0.712 m (Mary Rose kestirimi)

// ---- yay (Mary Rose) -------------------------------------------------------
const Y_BOY  = 1.976;              // ölçülen 1.839–2.113 aralığının ortası
const Y_YARI = Y_BOY / 2;          // bir kolun YAY UZUNLUĞU (0.988)
// Tam gergin yayda bir kolun toplam dönme açısı. Sabit eğrilik varsayımıyla
// uç konumu kapalı biçimde çıkıyor:
//   x(t) = -(s/PHI)(1-cos(PHI t)),  y(t) = (s/PHI) sin(PHI t),  t in [-1,1]
// PHI = 0.776 -> uç (-0.365, +0.892). Kiriş yarı açısı 21.7°, kurulu yayın
// uçtan uca boyu 1.784 m. (Kurulu-gevşek hâlde PHI 0.337 olurdu; model
// GERGİN hâli gösteriyor.)
// ⚠️ Y_PHI artık TAM ÇEKİŞTEKİ değer; ateş çevriminde değişken (§10-11).
// Eğrilik yarıçapı K = Y_YARI / PHI olduğu için ayrı sabit tutulmuyor.
const Y_PHI  = 0.776;
const KANT   = 35 * Math.PI / 180;

// ---- ok --------------------------------------------------------------------
const O_BOY  = 0.780;              // Mary Rose 667–880, çoğunluk 715–845
const O_R    = 0.0055;             // sap yarıçapı (MODEL KARARI)
const O_UC   = 0.056;              // bodkin uç boyu
const O_TUY  = 0.190;              // telek boyu

// ============================================================================
// 2. MONOTON KÜBİK EĞRİ (PCHIP) — otomobil.js §2 ile aynı gerekçe
// ============================================================================
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

// ============================================================================
// 3. LOFT MAKİNESİ (piyade.js / mizrakli-piyade.js ile aynı — insan gövdesi
//    kutu yığınıyla kurulmaz, devir §3)
// ============================================================================
function halkaNokta(s, a) {
    const ca = Math.cos(a), sa = Math.sin(a);
    const us = s.us == null ? 1.0 : s.us;
    const sx = ca < 0 ? -1 : 1, sz = sa < 0 ? -1 : 1;
    let x = s.d * sx * Math.pow(Math.abs(ca), us);
    const z = s.w * sz * Math.pow(Math.abs(sa), us);
    if (s.bomb) x += s.bomb * Math.max(0, ca) * Math.max(0, ca);
    if (s.yassi && x < 0) x *= s.yassi;
    return [x + (s.ox || 0), z + (s.oz || 0)];
}

function loft(ad, n, ist, renk, opts) {
    opts = opts || {};
    const P = [], IDX = [], M = ist.length;
    for (let i = 0; i < M; i++) {
        const s = ist[i];
        for (let j = 0; j < n; j++) {
            const p = halkaNokta(s, 2 * Math.PI * j / n);
            P.push(p[0], s.y, p[1]);
        }
    }
    for (let i = 0; i < M - 1; i++) {
        for (let j = 0; j < n; j++) {
            const j2 = (j + 1) % n;
            const a = i * n + j, b = i * n + j2;
            const c = (i + 1) * n + j, d2 = (i + 1) * n + j2;
            IDX.push(a, c, d2, a, d2, b);
        }
    }
    if (!opts.acikAlt) kapakEkle(P, IDX, ist[0], n, false);
    if (!opts.acikUst) kapakEkle(P, IDX, ist[M - 1], n, true);
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.Float32BufferAttribute(P, 3));
    geo.setIndex(IDX);
    geo.computeVertexNormals();
    const m = mesh(geo, renk, {
        metal: opts.metal == null ? 0.08 : opts.metal,
        rough: opts.rough == null ? 0.86 : opts.rough,
        flat: !!opts.flat, name: ad
    });
    (opts.ebeveyn || modelGroup).add(m);
    return m;
}

function kapakEkle(P, IDX, s, n, ust) {
    let mx = 0, mz = 0;
    const h = [];
    for (let j = 0; j < n; j++) { const p = halkaNokta(s, 2 * Math.PI * j / n); h.push(p); mx += p[0]; mz += p[1]; }
    const merkez = P.length / 3;
    P.push(mx / n, s.y, mz / n);
    const bas = merkez + 1;
    for (let j = 0; j < n; j++) P.push(h[j][0], s.y, h[j][1]);
    for (let j = 0; j < n; j++) {
        const a = bas + j, b = bas + (j + 1) % n;
        if (ust) IDX.push(merkez, b, a); else IDX.push(merkez, a, b);
    }
}

function istUret(y0, y1, N, eD, eW, opts) {
    opts = opts || {};
    const ist = [];
    for (let i = 0; i < N; i++) {
        const y = y0 + (y1 - y0) * i / (N - 1);
        ist.push({ y: y, d: eD(y), w: eW(y),
                   us: opts.eUs ? opts.eUs(y) : (opts.us == null ? 1.0 : opts.us),
                   ox: opts.eOx ? opts.eOx(y) : (opts.ox || 0),
                   oz: opts.oz || 0,
                   bomb: opts.eBomb ? opts.eBomb(y) : (opts.bomb || 0),
                   yassi: opts.yassi || 0 });
    }
    return ist;
}

// İKİ NOKTA ARASI UZUV — kol/bacak/kayış/kiriş. r = [[t, yarıçap, yassılık]].
function uzuv(ad, A, B, r, n, renk, opts) {
    opts = opts || {};
    const vx = B[0] - A[0], vy = B[1] - A[1], vz = B[2] - A[2];
    const L = Math.sqrt(vx * vx + vy * vy + vz * vz) || 1;
    const ux = vx / L, uy = vy / L, uz = vz / L;
    let ax = 0, ay = 0, az = 1;
    if (Math.abs(uz) > 0.9) { ax = 1; ay = 0; az = 0; }
    let ex = ay * uz - az * uy, ey = az * ux - ax * uz, ez = ax * uy - ay * ux;
    let e = Math.sqrt(ex * ex + ey * ey + ez * ez) || 1;
    ex /= e; ey /= e; ez /= e;
    const fx = uy * ez - uz * ey, fy = uz * ex - ux * ez, fz = ux * ey - uy * ex;
    const P = [], IDX = [], M = r.length;
    for (let i = 0; i < M; i++) {
        const t = r[i][0], rr = r[i][1], sq = r[i][2] == null ? 1 : r[i][2];
        const cx = A[0] + ux * L * t, cy = A[1] + uy * L * t, cz = A[2] + uz * L * t;
        for (let j = 0; j < n; j++) {
            const a = 2 * Math.PI * j / n, ca = Math.cos(a), sa = Math.sin(a);
            const p = rr * ca, q = rr * sa * sq;
            P.push(cx + ex * p + fx * q, cy + ey * p + fy * q, cz + ez * p + fz * q);
        }
    }
    for (let i = 0; i < M - 1; i++) {
        for (let j = 0; j < n; j++) {
            const j2 = (j + 1) % n;
            const a = i * n + j, b = i * n + j2;
            const c = (i + 1) * n + j, d2 = (i + 1) * n + j2;
            // ⚠️ SARIM: burada uclu (e, f, u) SAG ellidir (e x f = u), yani
            // halka u etrafinda CCW ilerliyor; CCW halkada (a, c, d2)
            // sirasinin normali U x T = -radyal, ICE bakar. Ayni sira bu
            // dosyanin loft'unda DOGRU calisiyor cunku oradaki halka +y
            // etrafinda CW yaziliyor. Sira ters cevrildi.
            IDX.push(a, d2, c, a, b, d2);
        }
    }
    for (let uc = 0; uc < 2; uc++) {
        const i = uc ? M - 1 : 0;
        const t = r[i][0];
        const cx = A[0] + ux * L * t, cy = A[1] + uy * L * t, cz = A[2] + uz * L * t;
        const merkez = P.length / 3;
        P.push(cx, cy, cz);
        const bas = merkez + 1;
        const rr = r[i][1], sq = r[i][2] == null ? 1 : r[i][2];
        for (let j = 0; j < n; j++) {
            const a = 2 * Math.PI * j / n;
            const p = rr * Math.cos(a), q = rr * Math.sin(a) * sq;
            P.push(cx + ex * p + fx * q, cy + ey * p + fy * q, cz + ez * p + fz * q);
        }
        for (let j = 0; j < n; j++) {
            const a = bas + j, b = bas + (j + 1) % n;
            // ⚠️ Kapaklar da yan yuzeylerle ayni sebeple ters.
            if (uc) IDX.push(merkez, a, b); else IDX.push(merkez, b, a);
        }
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.Float32BufferAttribute(P, 3));
    geo.setIndex(IDX);
    geo.computeVertexNormals();
    const m = mesh(geo, renk, {
        metal: opts.metal == null ? 0.08 : opts.metal,
        rough: opts.rough == null ? 0.86 : opts.rough, name: ad
    });
    (opts.ebeveyn || modelGroup).add(m);
    return m;
}

function kure(ad, r, pos, renk, opts) {
    opts = opts || {};
    const geo = new THREE.SphereGeometry(r, opts.seg || 12, opts.seg2 || 8);
    if (opts.olcek) geo.scale(opts.olcek[0], opts.olcek[1], opts.olcek[2]);
    geo.translate(pos[0], pos[1], pos[2]);
    const m = mesh(geo, renk, {
        metal: opts.metal == null ? 0.08 : opts.metal,
        rough: opts.rough == null ? 0.86 : opts.rough, name: ad
    });
    (opts.ebeveyn || modelGroup).add(m);
    return m;
}

function kutu(ad, sx, sy, sz, pos, renk, opts) {
    opts = opts || {};
    const geo = new THREE.BoxGeometry(sx, sy, sz);
    geo.translate(pos[0], pos[1], pos[2]);
    const m = mesh(geo, renk, {
        metal: opts.metal == null ? 0.30 : opts.metal,
        rough: opts.rough == null ? 0.55 : opts.rough,
        flat: opts.flat !== false, name: ad
    });
    (opts.ebeveyn || modelGroup).add(m);
    return m;
}

// ============================================================================
// 3b. DÜZLEMSEL YOL BOYUNCA SÜPÜRME — yayın kolları ve sırt şeridi
// ============================================================================
// ⚠️ NEDEN AYRI BİR MAKİNE: gergin yayın kolu SÜREKLİ EĞRİ bir çubuktur.
// `uzuv` yalnız iki nokta arasını düz süpürüyor; kavisi yakalamak için 20-30
// düz uzuv gerekirdi (20-30 ayrı mesh, ayrı ad, ayrı malzeme). Mızraklı
// piyade ajanının `donel()`i de burada işe yaramaz: yay DÖNEL değil, bir
// eğri boyunca süpürülmüş D kesiti.
//
// pts: [[x, y, rIc, rDis], ...]  — yay_kok'un YEREL x-y düzleminde.
//   rIc  = düzlem İÇİNDE yarı kalınlık (eğilme yönü = kesitin derinliği)
//   rDis = düzlem DIŞINDA yarı genişlik (yerel z = kesitin eni)
// Düzlem içi normal teğetten çıkıyor (n = (ty, -tx)); yayın SIRTI (dış taraf)
// +n yönünde. `ofsetOran` kesiti normal boyunca kaydırır — diri odun şeridi
// bununla sırtın üstüne oturuyor.
//
// ⚠️ MAKİNENİN KENDİSİ §10'A TAŞINDI (`kavisD`) ve DEĞİŞKEN oldu: ateş
// çevriminde yay gerilip boşaldığı için yol her karede yeniden çözülüyor,
// üçgen dizini sabit kalıyor. Sabit sürüm silindi — iki makine iki ayrı
// yerden aynı yayı kursaydı biri düzeltilince öteki bozulurdu.

// ============================================================================
// 4. GRUPLAR — pivot-ofset ikilisi (motorun _WHEELS.front mekanizması uzuvda
// KULLANILAMAZ: o her parçayı kendi merkezinde döndürür, uzuv ise mafsaldan)
// ============================================================================
const kalca = new THREE.Group(); kalca.name = 'kalca_grup';
modelGroup.add(kalca);

const omuz = new THREE.Group(); omuz.name = 'omuz_grup';
// Konumu (0,0,0): dönüş DÜŞEY eksende, x/z sıfır olmak ZORUNDA (orta hat).
kalca.add(omuz);

// ---- NİŞAN GRUBU (ateş, §12) ----------------------------------------------
// omuz_grup'un İÇİNDE, İKİ OMUZ MAFSALINDAN GEÇEN EKSENDE duran grup: yay
// YÜKSELİŞİ burada. İki omuz mafsalı da bu eksenin üstünde olduğu için
// yükselirken YERİNDE kalıyorlar — kol kökleri omuz kapaklarından ayrılmıyor
// (piyadenin `nisan_grup`u ile aynı gerekçe). `omuz_kapak_1/2` bilerek
// DIŞARIDA: onlar gövdenin omuz kuşağı, mafsalı örtmeye devam ederler.
// İÇİNDE: iki kol zinciri + bilek koruması + yay_kok (yay, kiriş).
// DIŞINDA: ok_grup (uçarken MODEL uzayında hareket ediyor, §11).
const nisan = new THREE.Group(); nisan.name = 'nisan_grup';
nisan.position.set(OMZ_X, OMUZ_Y, 0);
omuz.add(nisan);
// Model uzayındaki bir noktanın nişan grubundaki karşılığı. Ölçüler tek
// yerde (§1) yazılı kalsın diye çevirim burada yapılıyor.
function NL(p) { return [p[0] - OMZ_X, p[1] - OMUZ_Y, p[2]]; }

// Yay kökü: kant BURADA. x ekseni etrafındaki dönüş x'i koruduğu için ok
// (yerel +x) kanttan ETKİLENMİYOR — yay yatıyor, ok düz gidiyor.
const yayKok = new THREE.Group(); yayKok.name = 'yay_kok';
yayKok.position.set(NL(G_EL)[0], NL(G_EL)[1], NL(G_EL)[2]);
yayKok.rotation.x = KANT;
nisan.add(yayKok);

const bacaklar = [], dizler = [], ayaklar = [];
for (let i = 0; i < 2; i++) {
    const s = i === 0 ? 1 : -1;
    const b = new THREE.Group(); b.name = 'bacak_' + (i + 1);
    b.position.set(0, HIP_Y, s * HIP_Z);
    kalca.add(b);
    const d = new THREE.Group(); d.name = 'diz_' + (i + 1);
    d.position.set(0, -UYLUK, 0);
    b.add(d);
    const a = new THREE.Group(); a.name = 'ayak_' + (i + 1);
    a.position.set(0, -BALDIR, 0);
    d.add(a);
    bacaklar.push(b); dizler.push(d); ayaklar.push(a);
}

// Davranışın okuduğu zincir ölçüleri. TEK KAYNAK burası: adım uzunluğu ve
// zemin kilidi bu sayılardan çözülüyor, studio-3d.js'e kopyalanmıyor.
modelGroup.userData.okcu = {
    hipY: HIP_Y, hipZ: HIP_Z, uyluk: UYLUK, baldir: BALDIR,
    bilekY: BILEK_Y, tabanDy: TABAN_DY, topukX: TOPUK_X, burunX: BURUN_X,
    boy: BOY
};

// ============================================================================
// 5. GÖVDE — kesitten loft (kasık → boyun dibi). Bu yüzey KAPİTONE JAK'tır.
// ============================================================================
// ⚠️ Üst göğüs hoplitinkinden GENİŞ ve DERİN: Mary Rose okçularının belirgin
// omuz gelişimi kaynakta yazıyor, ve döndürülmüş omuz kapaklarının (x=0.165)
// gövdeye değmesi için ön yüzün 0.156'ya kadar gelmesi gerekiyordu.
// ⚠️ Alt uç 0.708'e kadar sivriltildi: düz kapakla biterse arkadan bakışta
// iki uyluk arasından o disk görünüyor (piyadede ölçülmüş tuzak).
const G_W = egriYap([
    [0.708, 0.041], [0.724, 0.073], [0.741, 0.098], [0.807, 0.140], [0.874, 0.161],
    [0.950, 0.154], [1.026, 0.142], [1.102, 0.146], [1.188, 0.160], [1.273, 0.174],
    [1.349, 0.184], [1.396, 0.174], [1.425, 0.136]
]);
const G_D = egriYap([
    [0.708, 0.039], [0.724, 0.066], [0.741, 0.086], [0.807, 0.110], [0.874, 0.120],
    [0.950, 0.116], [1.026, 0.108], [1.102, 0.113], [1.188, 0.126], [1.273, 0.138],
    [1.349, 0.148], [1.396, 0.140], [1.425, 0.104]
]);
const G_OX = egriYap([
    [0.708, 0.010], [0.741, 0.008], [0.874, 0.002], [1.026, 0.004], [1.188, 0.010],
    [1.349, 0.008], [1.425, 0.000]
]);
const G_US = egriYap([
    [0.708, 1.10], [0.741, 1.05], [0.874, 1.00], [1.026, 0.92], [1.188, 0.90],
    [1.349, 0.86], [1.425, 0.95]
]);
loft('jak', 24,
     istUret(0.708, 1.425, 16, G_D, G_W, { eOx: G_OX, eUs: G_US, yassi: 0.92 }),
     C_JAK, { ebeveyn: kalca, rough: 0.92, metal: 0.05 });

// Kasık köprüsü: gövde loftu bacak dipleriyle kesişsin diye (yoksa uyluk
// üstünde 2-3 cm'lik açık kalıyor ve siluette kopukluk okunuyor).
for (let i = 0; i < 2; i++) {
    kure('kasik_' + (i + 1), 0.084, [0.004, 0.882, (i ? -1 : 1) * 0.084], C_JAK,
         { ebeveyn: kalca, olcek: [1.12, 1.0, 1.0], rough: 0.92, metal: 0.05 });
}

// ---- jak eteği: kalçadan uyluk ortasına inen kısa etek ----------------------
// ⚠️ Hem uzunluğu hem genişliği SALINIMA GÖRE seçildi: uyluk 25° savrulduğunda
// y=0.83'te ön yüzeyi x=0.117'ye çıkıyor; etek orada 0.150 → uyluk eteği
// delmiyor.
const E_W = egriYap([[0.942, 0.159], [0.886, 0.173], [0.830, 0.185]]);
const E_D = egriYap([[0.942, 0.127], [0.886, 0.140], [0.830, 0.151]]);
loft('jak_etek', 22, istUret(0.830, 0.942, 5, E_D, E_W, { us: 0.95, ox: 0.006 }),
     C_JAK, { ebeveyn: kalca, rough: 0.92, metal: 0.05 });

// ---- KAPİTONE KANALLARI ----------------------------------------------------
// Pourpoint'in tanınır çizgisi düşey kapitone kanallarıdır. Altı ince şerit
// gövdenin ÖN yarısında, yüzeyin 4 mm dışında; içeride kalsalardı derinlik
// kavgasına girip beneklenirlerdi (trendeki cam bandı tuzağı).
// ⚠️ _TINT'in birincil listesine ALINMADILAR: jak boyanınca kanallar
// okunmaya devam etsin diye (mızraklı piyadede zirh_bel ile aynı gerekçe).
for (let k = 0; k < 6; k++) {
    const a = -0.66 + 1.32 * k / 5;
    const ca = Math.cos(a), sa = Math.sin(a);
    const ist = [];
    for (const yy of [0.968, 1.078, 1.188, 1.298]) {
        ist.push({ y: yy, d: 0.009, w: 0.011, us: 0.60,
                   ox: G_OX(yy) + (G_D(yy) + 0.004) * ca,
                   oz: (G_W(yy) + 0.004) * sa });
    }
    loft('jak_dikis_' + (k + 1), 6, ist, C_JAK_K,
         { ebeveyn: kalca, rough: 0.90, metal: 0.05 });
}
// Yaka bandı — jakın bittiği yeri çizmezsek jak ile boyun tek yüzey okunuyor.
loft('jak_yaka', 22, [
    { y: 1.396, d: 0.144, w: 0.178, us: 0.90, ox: 0.004 },
    { y: 1.412, d: 0.132, w: 0.164, us: 0.92, ox: 0.002 },
    { y: 1.428, d: 0.108, w: 0.140, us: 0.94, ox: 0.000 }
], C_JAK_K, { ebeveyn: kalca, rough: 0.90, metal: 0.05 });

// ---- kemer + balta ---------------------------------------------------------
// Kronik: "hatchets and axes hanging from their belts". Balta SOL kalçada
// (ham +z), okluk sağ kalçada — çekiş eli oklukla aynı tarafta olmalı.
loft('kemer', 22, [
    { y: 0.928, d: 0.138, w: 0.170, us: 0.90, ox: 0.006 },
    { y: 0.946, d: 0.144, w: 0.177, us: 0.90, ox: 0.006 },
    { y: 0.962, d: 0.138, w: 0.170, us: 0.90, ox: 0.006 }
], C_DERI, { ebeveyn: kalca, rough: 0.80, metal: 0.08 });
kutu('kemer_toka', 0.030, 0.042, 0.052, [0.150, 0.945, 0.010], C_DEMIR,
     { ebeveyn: kalca, metal: 0.42, rough: 0.36 });
// Balta SOL kalçada (ham +z). Sapı ve başı kemerin/uyluğun DIŞINDA:
// kemer yarı eni 0.177, uyluk dış yüzü 0.173 -> 0.196'da duruyor.
uzuv('balta_sap', [-0.056, 0.968, 0.196], [-0.030, 0.700, 0.216],
     [[0, 0.014, 0.65], [1, 0.013, 0.65]], 8, C_DERI_K,
     { ebeveyn: kalca, rough: 0.86, metal: 0.06 });
kutu('balta_bas', 0.100, 0.082, 0.026, [-0.062, 0.936, 0.206], C_DEMIR,
     { ebeveyn: kalca, metal: 0.42, rough: 0.34 });

// ============================================================================
// 6. OKLUK (arrow bag) — Mary Rose ara diski
// ============================================================================
// Keten torba + ORTASINDA dikili 24 delikli deri ara disk (replika ölçüsü
// 0.171 m). Torba sağ kalçada (ham -z), arkaya yatık; oklar yukarı-geriye
// bakıyor. Tepe siluetine gövdenin ARKASINDA ayrı bir kütle katıyor.
const OK_A = [-0.076, 0.700, -0.188];    // torbanın alt ucu
const OK_B = [-0.196, 1.026, -0.236];    // disk düzlemi (torbanın ağzı)
uzuv('okluk_torba', OK_A, OK_B,
     [[0.00, 0.052, 0.86], [0.35, 0.066, 0.88], [0.80, 0.074, 0.90],
      [1.00, 0.072, 0.92]], 12, C_KETEN,
     { ebeveyn: kalca, rough: 0.92, metal: 0.03 });
uzuv('okluk_disk', OK_B,
     [OK_B[0] - 0.026, OK_B[1] + 0.072, OK_B[2] - 0.010],
     [[0.00, 0.0855, 1.0], [1.00, 0.0855, 1.0]], 16, C_DERI_K,
     { ebeveyn: kalca, rough: 0.84, metal: 0.06 });
// Askı: sol omuzdan sağ kalçaya. Uçları gövde YÜZEYİNİN dışında başlıyor
// (y=1.330'da yarı en 0.180; 0.150'de başlasaydı jakın içinde kalırdı).
uzuv('okluk_kayis', [0.062, 1.336, 0.152], [-0.158, 1.018, -0.226],
     [[0, 0.015, 0.30], [0.5, 0.017, 0.28], [1, 0.015, 0.30]], 8, C_DERI,
     { ebeveyn: kalca, rough: 0.86, metal: 0.06 });
// Diskin üstünden çıkan oklar. 24'ün hepsi değil DOKUZU modellendi (mesh
// bütçesi); disk çapı yine de 24 delikli replikanın ölçüsünde.
for (let k = 0; k < 9; k++) {
    const a = 2 * Math.PI * k / 9;
    const rr = 0.052;
    const dx = Math.cos(a) * rr * 0.55, dz = Math.sin(a) * rr;
    const A = [OK_B[0] - 0.020 + dx, OK_B[1] + 0.056, OK_B[2] + dz];
    const B = [A[0] - 0.070, A[1] + 0.300, A[2] - 0.030];
    uzuv('okluk_ok_' + (k + 1), A, B, [[0, O_R, 1], [1, O_R, 1]], 5, C_DERI_K,
         { ebeveyn: kalca, rough: 0.84, metal: 0.04 });
    uzuv('okluk_tuy_' + (k + 1),
         [B[0] + 0.026, B[1] - 0.070, B[2] + 0.010], B,
         [[0.00, 0.018, 0.22], [0.45, 0.021, 0.20], [1.00, 0.009, 0.24]], 6,
         C_TUY, { ebeveyn: kalca, rough: 0.94, metal: 0.02 });
}

// ============================================================================
// 7. BOYUN + KAFA + DERİ TAKKE (huvette)
// ============================================================================
// Antropometri (1.710 m): diz 0.487 · kalça 0.906 · bel 1.026 · omuz 1.344 ·
// çene 1.459 · göz 1.558 · kafa tepesi 1.672.
loft('boyun', 14, [
    { y: 1.389, d: 0.051, w: 0.057, ox: 0.004 },
    { y: 1.430, d: 0.049, w: 0.053, ox: 0.008 },
    { y: 1.470, d: 0.051, w: 0.054, ox: 0.012 }
], C_TEN, { ebeveyn: kalca, rough: 0.74, metal: 0.05 });

const H_W = egriYap([
    [1.459, 0.049], [1.492, 0.064], [1.530, 0.074], [1.577, 0.078],
    [1.625, 0.074], [1.658, 0.055], [1.672, 0.027]
]);
const H_D = egriYap([
    [1.459, 0.059], [1.492, 0.076], [1.530, 0.087], [1.577, 0.092],
    [1.625, 0.087], [1.658, 0.064], [1.672, 0.030]
]);
loft('kafa', 18, istUret(1.459, 1.672, 10, H_D, H_W, { us: 1.05, ox: 0.012 }),
     C_TEN, { ebeveyn: kalca, rough: 0.72, metal: 0.05 });
// ⚠️ Yüz ayrıntılarının x'i GÖZ KARARIYLA yazılmadı: kafa loftunun o
// yükseklikteki ve o halka açısındaki yüzeyi hesaplanıp 3-20 mm dışına
// kondu. İçeride kalsalardı hiç görünmezlerdi (ilk kurulumda gözler
// yüzeyin 14 mm içindeydi).
kure('burun', 0.026, [0.096, 1.545, 0.008], C_TEN,
     { ebeveyn: kalca, olcek: [1.05, 0.80, 0.60], rough: 0.72, metal: 0.05 });
for (let i = 0; i < 2; i++) {
    kure('goz_' + (i + 1), 0.013, [0.094, 1.561, (i ? -1 : 1) * 0.036], C_KOYU,
         { ebeveyn: kalca, olcek: [0.55, 0.70, 1.25], rough: 0.55, metal: 0.12 });
}
// Sakal — çeneyi saran kısa kütle; yakın planda yüz boş kalmasın diye.
kure('sakal', 0.052, [0.050, 1.489, 0.000], C_DERI_K,
     { ebeveyn: kalca, olcek: [1.00, 0.70, 1.18], rough: 0.94, metal: 0.02 });

// ---- takke (huvette / cappeline) -------------------------------------------
// Kronik: "skull cap either of boiled leather or wickerwork ribbed with a
// steel frame". Kabuk haşlanmış deri, üstünde ÜÇ demir kaburga + alın bandı.
// ⚠️ Takkenin ALT KENARI 1.576'nın altına inemez: gözler 1.561'de ve y
// yarı ekseni 0.009, yani 1.570'e kadar çıkıyorlar. İlk kurulumda demir
// alın bandı 1.560-1.586 arasındaydı ve gözlerin TAM ÜSTÜNE oturup yüzü
// kapatıyordu (yakın planda görüldü). Band 16 mm yukarı alındı.
const TK_W = egriYap([
    [1.588, 0.089], [1.612, 0.086], [1.642, 0.078], [1.668, 0.060], [1.686, 0.028]
]);
const TK_D = egriYap([
    [1.588, 0.103], [1.612, 0.100], [1.642, 0.091], [1.668, 0.070], [1.686, 0.032]
]);
loft('takke', 18, istUret(1.588, 1.686, 7, TK_D, TK_W, { us: 1.04, ox: 0.012 }),
     C_DERI_K, { ebeveyn: kalca, rough: 0.66, metal: 0.10, acikAlt: true });
loft('takke_kenar', 18, [
    { y: 1.576, d: 0.104, w: 0.090, us: 1.04, ox: 0.012 },
    { y: 1.588, d: 0.108, w: 0.093, us: 1.04, ox: 0.012 },
    { y: 1.602, d: 0.103, w: 0.089, us: 1.04, ox: 0.012 }
], C_DEMIR, { ebeveyn: kalca, rough: 0.36, metal: 0.42 });
for (let k = 0; k < 3; k++) {
    const a = (k - 1) * 1.05;
    const ca = Math.cos(a), sa = Math.sin(a);
    uzuv('takke_kaburga_' + (k + 1),
         [0.012 + 0.112 * ca, 1.582, 0.098 * sa],
         [0.012 + 0.010 * ca, 1.692, 0.009 * sa],
         [[0, 0.011, 0.55], [0.6, 0.010, 0.50], [1, 0.008, 0.55]], 6, C_DEMIR,
         { ebeveyn: kalca, rough: 0.36, metal: 0.42 });
}

// ============================================================================
// 8. BACAKLAR — mafsal gruplarının İÇİNDE, yerel çerçevede
// ============================================================================
for (let i = 0; i < 2; i++) {
    const g = bacaklar[i], gd = dizler[i], ga = ayaklar[i];
    // Uyluk: kalça (y=0) → diz (y=-UYLUK). Hose giyili; dizin hemen üstünde
    // kas şişkinliği var, düz koni cansız durur.
    loft('ust_bacak_' + (i + 1), 16, [
        { y: -UYLUK - 0.010, d: 0.059, w: 0.056, us: 1.0 },
        { y: -UYLUK + 0.052, d: 0.064, w: 0.061, us: 1.0 },
        { y: -0.276,         d: 0.070, w: 0.067, us: 1.0 },
        { y: -0.181,         d: 0.076, w: 0.074, us: 1.0 },
        { y: -0.085,         d: 0.081, w: 0.079, us: 1.0 },
        { y:  0.018,         d: 0.083, w: 0.080, us: 1.0 },
        { y:  0.066,         d: 0.075, w: 0.073, us: 1.0 }
    ], C_HOSE, { ebeveyn: g, rough: 0.90, metal: 0.04 });
    // Baldır: diz (y=0) → bilek (y=-BALDIR).
    loft('alt_bacak_' + (i + 1), 16, [
        { y: -BALDIR - 0.006, d: 0.043, w: 0.041, us: 1.0 },
        { y: -BALDIR + 0.056, d: 0.046, w: 0.044, us: 1.0 },
        { y: -0.274,          d: 0.052, w: 0.049, us: 1.0 },
        { y: -0.190,          d: 0.060, w: 0.057, us: 1.0 },
        { y: -0.114,          d: 0.067, w: 0.064, us: 1.0, ox: -0.006 },
        { y: -0.052,          d: 0.066, w: 0.064, us: 1.0, ox: -0.004 },
        { y:  0.012,          d: 0.058, w: 0.056, us: 1.0 }
    ], C_HOSE, { ebeveyn: gd, rough: 0.90, metal: 0.04 });
    kure('diz_kure_' + (i + 1), 0.058, [0, 0, 0], C_HOSE,
         { ebeveyn: gd, olcek: [1.0, 0.95, 0.92], rough: 0.90, metal: 0.04 });

    // Ayakkabı (turnshoe): bilek (y=0) → taban (y=TABAN_DY).
    loft('ayak_et_' + (i + 1), 14, [
        { y: TABAN_DY + 0.016, d: 0.118, w: AYAK_W,         us: 0.80, ox: 0.052 },
        { y: TABAN_DY + 0.046, d: 0.113, w: AYAK_W - 0.002, us: 0.82, ox: 0.046 },
        { y:  0.000,           d: 0.088, w: 0.051,          us: 0.88, ox: 0.018 },
        { y:  0.034,           d: 0.053, w: 0.047,          us: 0.95, ox: -0.006 }
    ], C_DERI, { ebeveyn: ga, rough: 0.84, metal: 0.06 });
    // Taban: ayağın ALTINDAKİ ince levha. Zemin kilidi bunun köşelerini
    // ölçüyor (davranıştaki topuk/burun noktaları buradan geliyor).
    // ⚠️ Taban ölçüsü TOPUK_X/BURUN_X ile BİREBİR tutmak ZORUNDA:
    // ox - d = -0.072 = TOPUK_X, ox + d = 0.184 = BURUN_X.
    loft('ayakkabi_' + (i + 1), 14, [
        { y: TABAN_DY,         d: 0.1280, w: AYAK_W + 0.003, us: 0.55, ox: 0.0560 },
        { y: TABAN_DY + 0.011, d: 0.1300, w: AYAK_W + 0.005, us: 0.55, ox: 0.0560 },
        { y: TABAN_DY + 0.019, d: 0.1260, w: AYAK_W + 0.002, us: 0.60, ox: 0.0550 }
    ], C_DERI_K, { ebeveyn: ga, rough: 0.94, metal: 0.03 });
    kutu('ayakkabi_bag_' + (i + 1), 0.036, 0.010, 0.116, [0.020, -0.030, 0], C_DERI_K,
         { ebeveyn: ga, metal: 0.05, rough: 0.90 });
}

// ============================================================================
// 9. OMUZ KUŞAĞI — kollar (omuz_grup). ATICI DURUŞU: kuşak 72° döndürülmüş.
// ============================================================================
// ⚠️ İki el de teçhizatta olduğu için SERBEST KOL SALINIMI YOK. Yürüyüşün
// "karşı salınım" okuması OMUZ KUŞAĞININ dönüşünden geliyor (gerçek
// yürüyüşte de pelvis bir yöne, göğüs kafesi öbür yöne döner). Yay ve ok bu
// grupta olduğu için ikisi de GÖVDEYLE BİRLİKTE gidiyor ve eller
// teçhizattan hiç ayrılmıyor.
for (let i = 0; i < 2; i++) {
    const S = i === 0 ? OMZ_1 : OMZ_2;
    // ⚠️ NİŞAN GRUBUNUN DIŞINDA (omuz_grup'ta): yükseliş kolları kaldırırken
    // omuz kapakları yerinde kalıp mafsalı örtmeye devam ediyor.
    kure('omuz_kapak_' + (i + 1), 0.068, [S[0], S[1] + 0.006, S[2]],
         C_JAK, { ebeveyn: omuz, olcek: [1.00, 0.92, 1.00], rough: 0.90, metal: 0.05 });
}

// ---- YAY KOLU (ham +z, üründe SOL): dirsek kilitli düz --------------------
// |omuz → el| = 0.6199 m; kol zinciri 0.320 + 0.300 = 0.620. Yani dirsek
// zorunlu olarak DÜZ. Kirişin önkola çarpmaması için 10 mm aşağı kırıldı —
// bilek koruması (bracer) tam bu yüzden var.
// ⚠️ ATEŞ ÇEVRİMİNDE HİÇ KIMILDAMIYOR ve bu kurulum gereği: kavrama noktası
// (yay_kok'un orijini) ile omuz mafsalı AYNI grubun (nisan) içinde, ikisi de
// sabit. Bu yüzden yay kolu PİŞMİŞ geometri olarak kalıyor; yalnız çekiş kolu
// mafsal zinciri oldu.
const DIR_1 = [0.4756, 1.3877, -0.0017];
// ---- ÇEKİŞ KOLU (ham -z, üründe SAĞ): dirsek 44.9°, dışa ve geriye --------
// Çapa yüzde olduğu için el omuzdan yalnız 0.2365 m uzakta; iki uzuvlu
// zincir bunu ancak dirseği YANA savurarak kapatıyor (kapalı çözüm: eksene
// dik ofset 0.2847 m). Bu, tam gergin okçunun tepeden görünen imzasıdır ve
// tepe siluetine -z tarafından 0.33 m katkı veriyor.
const DIR_2 = [-0.0554, 1.4351, -0.3307];

// Yay kolu: PİŞMİŞ (nişan grubunun içinde, kendi çerçevesinde sabit).
// Üst kol JAK'ın kolu (kapitone), önkol ÇIPLAK: dönem tasvirlerinde okçular
// kollarını sıvamış görünür ve bilek koruması çıplak önkola takılır.
uzuv('ust_kol_1', NL(OMZ_1), NL(DIR_1),
     [[0, 0.060], [0.25, 0.056], [0.70, 0.048], [1, 0.044]], 14, C_JAK,
     { ebeveyn: nisan, rough: 0.90, metal: 0.05 });
kure('dirsek_1', 0.045, NL(DIR_1), C_TEN,
     { ebeveyn: nisan, rough: 0.74, metal: 0.05 });
uzuv('alt_kol_1', NL(DIR_1), NL(G_EL),
     [[0, 0.045], [0.35, 0.042], [0.80, 0.035], [1, 0.032]], 14, C_TEN,
     { ebeveyn: nisan, rough: 0.74, metal: 0.05 });
kure('el_1', 0.043, NL([G_EL[0] + 0.004, G_EL[1], G_EL[2]]), C_TEN,
     { ebeveyn: nisan, olcek: [1.10, 0.92, 0.86], rough: 0.72, metal: 0.05 });
// Bilek koruması (bracer) — batıkta 24 adet, ağırlıklı deri. Yay kolunda,
// kirişin geçtiği yerde.
uzuv('bilek_koruma', NL([0.586, 1.407, -0.032]), NL([0.706, 1.432, -0.045]),
     [[0, 0.049, 0.86], [1, 0.048, 0.86]], 10, C_DERI,
     { ebeveyn: nisan, rough: 0.80, metal: 0.08 });

// ---- ÇEKİŞ KOLU: MAFSAL ZİNCİRİ (ateş çevrimi ters kinematikle çözer) -----
// ⚠️ Yay kolundan farkı: çekiş eli bırakıştan sonra çapadan ayrılıp takip
// hareketine, oradan OKLUĞA ve tekrar kirişe gidiyor. Pişmiş bir uzuv bunu
// yapamaz; bacak zincirindeki desenin aynısı kuruldu (§8): mafsal GRUBU,
// geometri grubun YEREL +x'i boyunca.
// Uzunluklar OMZ_2/DIR_2/C_EL'den ÖLÇÜLÜYOR — ikinci bir yere sayı yazılmadı.
const CK_L1 = Math.hypot(DIR_2[0] - OMZ_2[0], DIR_2[1] - OMZ_2[1], DIR_2[2] - OMZ_2[2]);
const CK_L2 = Math.hypot(C_EL[0] - DIR_2[0], C_EL[1] - DIR_2[1], C_EL[2] - DIR_2[2]);
const cekisOmuz = new THREE.Group(); cekisOmuz.name = 'cekis_omuz';
cekisOmuz.position.set(NL(OMZ_2)[0], NL(OMZ_2)[1], NL(OMZ_2)[2]);
nisan.add(cekisOmuz);
const cekisDirsek = new THREE.Group(); cekisDirsek.name = 'cekis_dirsek';
cekisDirsek.position.set(CK_L1, 0, 0);
cekisOmuz.add(cekisDirsek);
// ⚠️ Kesitler DAİRESEL (uzuv'un üçüncü alanı yok = yassılık 1), yani uzvun
// kendi ekseni etrafındaki dönüşü GÖRÜNMEZ; +x boyunca kurmak duruşu birebir
// koruyor. Küre olan dirsek de yönsüz.
uzuv('ust_kol_2', [0, 0, 0], [CK_L1, 0, 0],
     [[0, 0.060], [0.25, 0.056], [0.70, 0.048], [1, 0.044]], 14, C_JAK,
     { ebeveyn: cekisOmuz, rough: 0.90, metal: 0.05 });
kure('dirsek_2', 0.045, [0, 0, 0], C_TEN,
     { ebeveyn: cekisDirsek, rough: 0.74, metal: 0.05 });
uzuv('alt_kol_2', [0, 0, 0], [CK_L2, 0, 0],
     [[0, 0.045], [0.35, 0.042], [0.80, 0.035], [1, 0.032]], 14, C_TEN,
     { ebeveyn: cekisDirsek, rough: 0.74, metal: 0.05 });
// ⚠️ Elin BASIKLIK eksenleri (1.10 x 0.92 x 0.86) artık ÖNKOLUN çerçevesinde,
// model çerçevesinde değil — 43 mm'lik bir kürede fark milimetre altı, ve
// fiziksel olarak doğrusu bu (el önkolla birlikte döner). 6 mm'lik geri ofset
// de önkol ekseni boyunca.
kure('el_2', 0.043, [CK_L2 - 0.006, 0, 0], C_TEN,
     { ebeveyn: cekisDirsek, olcek: [1.10, 0.92, 0.86], rough: 0.72, metal: 0.05 });
// DURUŞ AÇILARI: zincir kurulum pozunu BİREBİR versin diye iki kuaterniyon
// DIR_2 ve C_EL'den çözülüyor (davranış aynı çözümü ters kinematikle her
// karede tekrarlıyor; çapa noktasında sonuç aynı çıkmak ZORUNDA).
const CK_EX = new THREE.Vector3(1, 0, 0);
const CK_U1 = new THREE.Vector3(DIR_2[0] - OMZ_2[0], DIR_2[1] - OMZ_2[1],
                                DIR_2[2] - OMZ_2[2]).normalize();
const CK_U2 = new THREE.Vector3(C_EL[0] - DIR_2[0], C_EL[1] - DIR_2[1],
                                C_EL[2] - DIR_2[2]).normalize();
cekisOmuz.quaternion.setFromUnitVectors(CK_EX, CK_U1);
cekisDirsek.quaternion.setFromUnitVectors(
    CK_EX, CK_U2.clone().applyQuaternion(cekisOmuz.quaternion.clone().invert()));
// DİRSEK DÜZLEMİ (kutup vektörü). İki uzuvlu zincirde el konumu dirseği
// TEK BAŞINA belirlemez: omuz→el ekseni etrafında bir serbestlik kalıyor.
// Kutup, duruş pozundaki dirsek ofsetinin o eksene DİK bileşeni; davranış her
// karede aynı kutbu kullandığı için çapada zincir kurulum pozunu birebir
// veriyor ve dirsek çevrim boyunca aynı tarafta kalıyor (ters bükülmüyor).
const CK_KUTUP = (function () {
    const S = new THREE.Vector3(OMZ_2[0], OMZ_2[1], OMZ_2[2]);
    const ax = new THREE.Vector3(C_EL[0], C_EL[1], C_EL[2]).sub(S).normalize();
    const d = new THREE.Vector3(DIR_2[0], DIR_2[1], DIR_2[2]).sub(S);
    return d.addScaledVector(ax, -d.dot(ax)).normalize();
})();

// ============================================================================
// 10. YAY — Mary Rose porsuk uzun yayı, TAM GERGİN
// ============================================================================
// yay_kok'un YEREL x-y düzlemi. Sap (0,0); alt uç t=-1, üst uç t=+1.
// Sabit eğrilik: x(t) = -K(1-cos(PHI t)),  y(t) = K sin(PHI t),  K = s/PHI.
// Kesit sapta 0.035 x 0.033 (Mary Rose katalogu), uçta 0.013 x 0.012.
//
// ⚠️ ARTIK PHI DEĞİŞKEN (ateş çevrimi, §12). Kolun YAY UZUNLUĞU (Y_YARI)
// SABİT — odun uzamaz — ve tek parametre PHI: K = Y_YARI / PHI. Yani gerilme
// tek bir sayıyla sürülüyor ve kol her hâlde 0.988 m uzunlukta kalıyor.
// Yayın bütün geometrisi (kol, diri odun sırtı, kavrama sargısı) bu
// parametreden HER KARE yeniden yazılıyor; kadırganın kürek makinesiyle aynı
// desen (şablon + yaz, üçgen dizini sabit).
const Y_N = 30;

// Yolun bir noktası ve o noktadaki düzlem-içi normali.
// Teğet KAPALI BİÇİMDEN: d/dt (x, y) ~ (-sin(PHI t), cos(PHI t)), yani
// normal n = (ty, -tx) = (cos(PHI t), sin(PHI t)). (Eski kurulum teğeti sonlu
// farkla alıyordu; iç noktalarda çember yayında ikisi ÖZDEŞ, yalnız iki uç
// kesitinde 0.72° fark vardı — 17 mm'lik kesitte milimetre altı.)
function yayNokta(phi, t, q) {
    const K = Y_YARI / phi, a = phi * t;
    q[0] = -K * (1 - Math.cos(a)); q[1] = K * Math.sin(a);
    q[2] = Math.cos(a); q[3] = Math.sin(a);
    return q;
}
// ŞABLONDAN POZ YAZAN MAKİNE. sab: [[t, rIc, rDis, ofsetOran], ...]
// hedef: Float32Array((M*n + 2) * 3). Üçgen dizini DEĞİŞMİYOR.
function yayYaz(phi, sab, n, hedef) {
    const M = sab.length, q = [0, 0, 0, 0];
    let o = 0;
    for (let i = 0; i < M; i++) {
        const rIc = sab[i][1], rDis = sab[i][2], oo = sab[i][3] || 0;
        yayNokta(phi, sab[i][0], q);
        const nx = q[2], ny = q[3];
        const cx = q[0] + nx * oo * rIc, cy = q[1] + ny * oo * rIc;
        for (let j = 0; j < n; j++) {
            const th = 2 * Math.PI * j / n;
            const ci = Math.cos(th) * rIc, si = Math.sin(th) * rDis;
            hedef[o++] = cx + nx * ci; hedef[o++] = cy + ny * ci; hedef[o++] = si;
        }
    }
    for (let uc = 0; uc < 2; uc++) {
        const bas = (uc ? M - 1 : 0) * n;
        let mx = 0, my = 0, mz = 0;
        for (let j = 0; j < n; j++) {
            mx += hedef[(bas + j) * 3]; my += hedef[(bas + j) * 3 + 1];
            mz += hedef[(bas + j) * 3 + 2];
        }
        hedef[o++] = mx / n; hedef[o++] = my / n; hedef[o++] = mz / n;
    }
}
// Değişken kavis: şablonu PHI0'da yazıp meshi kurar, davranışın yeniden
// yazacağı her şeyi YAY_VERI'ye koyar.
const YAY_VERI = {};
function kavisD(ad, sab, n, renk, opts) {
    opts = opts || {};
    const M = sab.length, nv = M * n + 2;
    const pos = new Float32Array(nv * 3);
    yayYaz(Y_PHI, sab, n, pos);
    const IDX = [];
    for (let i = 0; i < M - 1; i++) {
        for (let j = 0; j < n; j++) {
            const j2 = (j + 1) % n;
            const a = i * n + j, b = i * n + j2;
            const c = (i + 1) * n + j, d2 = (i + 1) * n + j2;
            IDX.push(a, c, d2, a, d2, b);
        }
    }
    for (let uc = 0; uc < 2; uc++) {
        const bas = (uc ? M - 1 : 0) * n, merkez = M * n + uc;
        for (let j = 0; j < n; j++) {
            const a = bas + j, b = bas + (j + 1) % n;
            if (uc) IDX.push(merkez, b, a); else IDX.push(merkez, a, b);
        }
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    geo.setIndex(IDX);
    geo.computeVertexNormals();
    const m = mesh(geo, renk, {
        metal: opts.metal == null ? 0.06 : opts.metal,
        rough: opts.rough == null ? 0.80 : opts.rough, name: ad
    });
    // ⚠️ FRUSTUM AYIKLAMASI KAPALI: geometri her karede yeniden yazılıyor ama
    // boundingSphere kurulum pozundan kalıyor (kadırgadaki ölçülmüş tuzak).
    m.frustumCulled = false;
    yayKok.add(m);
    YAY_VERI[ad] = { mesh: m, sablon: sab, n: n, dizi: pos };
    return m;
}

// Kol şablonu: incelme sap kalınlığından uç kalınlığına, uçlara doğru hızlanan.
const YAY_SAB = [];
for (let i = 0; i <= Y_N; i++) {
    const t = -1 + 2 * i / Y_N, f = Math.abs(t);
    const k = f * f * (3 - 2 * f);
    YAY_SAB.push([t, 0.0165 - 0.0105 * k, 0.0175 - 0.0110 * k, 0]);
}
kavisD('yay', YAY_SAB, 8, C_YAY, { rough: 0.78, metal: 0.05 });
// DİRİ ODUN SIRTI: aynı yol, kesitin normal yönünde 0.80 oranında kaydırılmış
// ve yassıltılmış bir şerit. Sırt yüzeyinden 1-2 mm dışarı taşıyor, yani
// derinlik kavgası yok. Tek parça porsuk yayın tanınır iki tonu.
kavisD('yay_sirt', YAY_SAB.map(function (p) {
    return [p[0], p[1] * 0.58, p[2] * 0.64, 0.80];
}), 8, C_YAY_S, { rough: 0.74, metal: 0.06 });
// Kavrama sargısı (deri) — sapın ortasında. O da PHI ile yeniden yazılıyor:
// sapın eğriliği gerilmeyle değişiyor (fark 1 mm, ama iki yüzey aynı yoldan
// gelmezse sargı yayın içine gömülür).
const SARGI_SAB = [];
for (let i = 0; i <= 6; i++) SARGI_SAB.push([-0.075 + 0.150 * i / 6, 0.0195, 0.0205, 0]);
kavisD('yay_sargi', SARGI_SAB, 8, C_DERI, { rough: 0.88, metal: 0.05 });

// Boynuz kertikler (horn nocks) — kirişin oturduğu uçlar. Kolun UÇTAKİ
// teğeti boyunca 58 mm uzuyorlar. Geometri artık KENDİ grubunun +x'inde
// pişiyor, grup da her karede uca konup teğet açısına dönüyor: kesit
// dairesel DEĞİL (z'de 0.88 yassı) ama grubun yerel y'si her hâlde düzlem-içi
// normale oturduğu için duruş birebir korunuyor.
const boynuzGrup = [];
for (let i = 0; i < 2; i++) {
    const g = new THREE.Group(); g.name = 'boynuz_grup_' + (i + 1);
    yayKok.add(g);
    uzuv('yay_boynuz_' + (i + 1), [-0.026, 0, 0], [0.032, 0, 0],
         [[0, 0.012, 0.88], [0.55, 0.010, 0.88], [1, 0.005, 0.88]], 6, C_DERI_K,
         { ebeveyn: g, rough: 0.52, metal: 0.14 });
    boynuzGrup.push(g);
}

// ---- KİRİŞ: uçtan geze iki düz parça ---------------------------------------
// Çapa yerel (-0.712, 0, 0) — dünyada TAM olarak C_EL noktası (kant x'i
// koruyor). Kirişin yarı açısı bu üç noktadan 21.3° çıkıyor.
//
// ⚠️ KİRİŞİN YARI BOYU SABİT, ve bu ateş çevriminin TEK KISITI. Keten/kenevir
// kiriş uzamaz; gerilme boyunca "uç ile gez arası = KIRIS_L" denklemi PHI'yi
// çözüyor (zıpkın ajanının kiriş denkleminin TERSİ: orada kol açısı verilip
// gez konumu bulunuyordu, burada gez konumu verilip kol açısı bulunuyor).
// Sayı SERBEST DEĞİL — modelin tam gergin duruşundan ölçülüyor:
const GEZ = [-CEKIS, 0, 0];
const KIRIS_L = (function () {
    const q = [0, 0, 0, 0];
    yayNokta(Y_PHI, 1, q);
    return Math.hypot(q[0] + CEKIS, q[1]);
})();
// BRACE (kurulu ama çekilmemiş yay): kiriş DÜZ, yani gez tam uç hizasında.
// İki denklem: K sin(PHI) = KIRIS_L ve K = Y_YARI / PHI. Kapalı çözümü yok,
// ikili aramayla çözülüyor. ⚠️ Çıkan brace yüksekliği bir MODEL SONUCUDUR,
// tarihsel iddia değil: sabit eğrilikli kol varsayımı + uzamayan kiriş bunu
// veriyor. (Gerçek uzun yaylarda 0.15-0.19 m alıntılanır.)
const PHI_BRACE = (function () {
    let lo = 1e-4, hi = Y_PHI;
    for (let i = 0; i < 60; i++) {
        const m = (lo + hi) / 2;
        if ((Y_YARI / m) * Math.sin(m) > KIRIS_L) lo = m; else hi = m;
    }
    return (lo + hi) / 2;
})();
const BRACE_D = (function () {
    const q = [0, 0, 0, 0];
    yayNokta(PHI_BRACE, 1, q);
    return -q[0];
})();
// ÇEKİŞ (gez konumu d) -> KOL AÇISI. |uç(PHI) - (-d, 0)| = KIRIS_L.
// Monoton: d büyüdükçe PHI büyüyor. d = CEKIS'te tam Y_PHI çıkıyor.
// ⚠️ ARAMA ARALIĞI BRACE'İN ALTINA İNİYOR (0.02): bırakıştan sonra kiriş
// brace'i bir miktar GEÇİYOR (sönümlü salınım) ve o karelerde kol brace'ten
// daha DÜZ. Alt sınırı brace'e kilitleseydik taşan karelerde kol donardı.
// ⚠️ |uç - gez| PHI ile MONOTON AZALIYOR (K = Y_YARI/PHI küçülüyor, uç hem
// geriye hem içeri geliyor), yani ikili arama: mesafe hâlâ büyükse KÖK DAHA
// BÜYÜK PHI'de.
function yayPhi(d) {
    let lo = 0.02, hi = 2.4;
    const q = [0, 0, 0, 0];
    for (let i = 0; i < 44; i++) {
        const m = (lo + hi) / 2;
        yayNokta(m, 1, q);
        if (Math.hypot(q[0] + d, q[1]) > KIRIS_L) lo = m; else hi = m;
    }
    return (lo + hi) / 2;
}
// Kiriş parçaları BİRİM çubuk (+x, 0..1): davranış position + rotation.z +
// scale.x yazıyor. scale.x her karede KIRIS_L — sabit, çünkü kiriş uzamıyor.
for (let i = 0; i < 2; i++) {
    uzuv('kiris_' + (i ? 'alt' : 'ust'), [0, 0, 0], [1, 0, 0],
         [[0, 0.0026, 1], [1, 0.0026, 1]], 5, C_KIRIS,
         { ebeveyn: yayKok, rough: 0.86, metal: 0.05 });
}
// Gez sarımı: kirişin üstünde, gezle birlikte kayıyor (yalnız position.x).
uzuv('kiris_sarim', [GEZ[0], GEZ[1] + 0.040, 0], [GEZ[0], GEZ[1] - 0.040, 0],
     [[0, 0.0055, 1], [1, 0.0055, 1]], 6, C_DERI_K,
     { ebeveyn: yayKok, rough: 0.88, metal: 0.05 });

// ---- OK (kirişte, tam gergin) ---------------------------------------------
// Gez KİRİŞİN üstünde (yerel 0,0), uç yayın sapını 68 mm geçiyor; toplam
// 0.780 m. ⚠️ OK YAYIN İÇİNDEN GEÇEMEZ: sap yarı eni 0.0175, okun yarıçapı
// 0.0055, yani okun merkezinin sapta en az 0.023 yanda olması gerekiyor.
// Çözüm gerçeğin kendisi (archer's paradox): ok gezden uca doğru 30 mm
// yana açılıyor (2.2°) ve sapın hizasında 27.4 mm yanda kalıyor.
// Yön: yerel +z, yani ham +z, yani ÜRÜNDE SOL — sağ elini kullanan okçunun
// okunun geçtiği taraf.
// ⚠️ OK ARTIK KENDİ GRUBUNDA (`ok_grup`) ve o grup `omuz_grup`un DOĞRUDAN
// çocuğu, yay_kok'un değil. Sebep ateş çevrimi (§11): ok bırakıldıktan sonra
// MODEL uzayında hedefe uçuyor ve model +x'i zaten hedefe bakıyor
// (bekleme ateşinde rotationDeg = hedefin yönü). Grubun içinde geometri
// GEZE GÖRE pişiyor, grubun kurulum duruşu da tam olarak eski yerini veriyor:
//   eski (yay_kok içinde):  G_EL + Rx(KANT)·(OK_G + p)
//   yeni (omuz içinde):     C_EL + Rx(KANT)·p ,  C_EL = G_EL + OK_G
// Rx(KANT) x'i koruduğu için ikisi BİREBİR aynı nokta.
const OK_G = [-CEKIS, 0, 0];
const OK_U = [O_BOY - CEKIS, 0, 0.030];
const _od = [OK_U[0] - OK_G[0], 0, OK_U[2] - OK_G[2]];
const _oL = Math.sqrt(_od[0] * _od[0] + _od[2] * _od[2]);
function okN(s) { return [_od[0] * s / _oL, 0, _od[2] * s / _oL]; }

const okGrup = new THREE.Group(); okGrup.name = 'ok_grup';
okGrup.position.set(C_EL[0], C_EL[1], C_EL[2]);
okGrup.quaternion.setFromAxisAngle(new THREE.Vector3(1, 0, 0), KANT);
omuz.add(okGrup);

uzuv('ok_sap', okN(0.012), okN(_oL - O_UC + 0.006),
     [[0, O_R * 0.92, 1], [0.5, O_R, 1], [1, O_R * 0.94, 1]], 6, C_DERI_K,
     { ebeveyn: okGrup, rough: 0.84, metal: 0.05 });
// Bodkin uç: uzun, dar, kare kesitli (n=4).
uzuv('ok_ucu', okN(_oL - O_UC), okN(_oL),
     [[0.00, 0.0068, 1], [0.22, 0.0072, 1], [0.55, 0.0050, 1], [1.00, 0.0012, 1]],
     4, C_DEMIR, { ebeveyn: okGrup, rough: 0.34, metal: 0.44 });
kutu('ok_gez', 0.020, 0.014, 0.011, [0.006, 0, 0.0002], C_DERI_K,
     { ebeveyn: okGrup, metal: 0.05, rough: 0.86 });

// Üç kaz teleği, 120°. Telek boyu 0.190 m — dönem ok teleği uzundur ve tam
// çekişte okçunun yanağının hizasında durur.
(function () {
    const ux = _od[0] / _oL, uz = _od[2] / _oL;
    // Eksene dik iki birim vektör: e = (0,1,0) zaten dik, f = u x e.
    const ex = 0, ey = 1, ez = 0;
    const fx = -uz * ey, fy = 0, fz = ux * ey;     // u x e
    const kes = [[0.020, 0.28], [0.052, 1.00], [0.184, 1.00], [0.210, 0.20]];
    const r0 = O_R * 0.85, r1 = 0.023;
    for (let k = 0; k < 3; k++) {
        const a = Math.PI / 2 + 2 * Math.PI * k / 3;
        const ca = Math.cos(a), sa = Math.sin(a);
        const rx = ex * ca + fx * sa, ry = ey * ca + fy * sa, rz = ez * ca + fz * sa;
        const P = [], IDX = [];
        for (let i = 0; i < kes.length; i++) {
            const c = okN(kes[i][0]), hh = kes[i][1];
            P.push(c[0] + rx * r0, c[1] + ry * r0, c[2] + rz * r0);
            const rr = r0 + r1 * hh;
            P.push(c[0] + rx * rr, c[1] + ry * rr, c[2] + rz * rr);
        }
        for (let i = 0; i < kes.length - 1; i++) {
            const a0 = i * 2, b0 = i * 2 + 1, a1 = (i + 1) * 2, b1 = (i + 1) * 2 + 1;
            IDX.push(a0, a1, b1, a0, b1, b0);
        }
        const geo = new THREE.BufferGeometry();
        geo.setAttribute('position', new THREE.Float32BufferAttribute(P, 3));
        geo.setIndex(IDX);
        geo.computeVertexNormals();
        // Telek kalınlıksız bir levha: iki yüzü de görünmeli, yoksa bir
        // yandan bakınca kayboluyor (devir §5.2 "kalınlıksız kabuk").
        const m = mesh(geo, C_TUY, { metal: 0.02, rough: 0.94, flat: true,
                                     name: 'ok_tuy_' + (k + 1) });
        m.material.side = THREE.DoubleSide;
        okGrup.add(m);
    }
})();

// ============================================================================
// 11. ATEŞ ÇEVRİMİNİN GEOMETRİSİ — TEK KAYNAK BURASI
// ============================================================================
// ⚠️ studio-3d.js'e SAYI KOPYALANMIYOR. Davranış (registerBehavior('okcu'))
// yalnız FAZI (ne zaman ne kadar gerili) biliyor; "gerilme d iken yay, kiriş,
// boynuz ve gez nerede" sorusunun cevabı burada. Kadırganın kürek makinesiyle
// aynı sözleşme: model geometriyi, davranış zamanlamayı sahipleniyor.
//
// `poz(d)` çağrıldığı anda YAYIN BÜTÜN PARÇALARINI o gerilmeye yazar:
//   * yay / yay_sirt / yay_sargi  -> tepe noktaları yeniden yazılır (PHI'den)
//   * yay_boynuz_1/2              -> uçlara konur, teğet açısına döner
//   * kiris_ust / kiris_alt       -> uçtan geze, boyu KIRIS_L (sabit)
//   * kiris_sarim                 -> gezle birlikte kayar
// Kurulum duruşu da BU fonksiyonla yazılıyor (aşağıdaki poz(CEKIS) çağrısı),
// yani davranışın psi=0'da ürettiği poz ile kurulum pozu BİREBİR aynı sayılar.
const OK_Q = [0, 0, 0, 0];
const KIRIS = [modelGroup.getObjectByName('kiris_ust'),
               modelGroup.getObjectByName('kiris_alt')];
const KIRIS_SARIM = modelGroup.getObjectByName('kiris_sarim');
let OK_SON_D = null, OK_SON_PHI = Y_PHI;
function yayPoz(d) {
    if (OK_SON_D === d) return OK_SON_PHI;      // aynı poz iki kez istenmez
    OK_SON_D = d;
    const phi = yayPhi(d);
    OK_SON_PHI = phi;
    for (const ad in YAY_VERI) {
        const v = YAY_VERI[ad];
        yayYaz(phi, v.sablon, v.n, v.dizi);
        const pa = v.mesh.geometry.attributes.position;
        pa.needsUpdate = true;
        v.mesh.geometry.computeVertexNormals();
    }
    yayNokta(phi, 1, OK_Q);
    const ux = OK_Q[0], uy = OK_Q[1];
    // Teğet açısı: T = (-sin(PHI), cos(PHI)) -> aci = PHI + pi/2.
    // Alt kol üstün y-aynası; aynalanmış çerçeve o çerçevenin -acisidir
    // (kesit kendi ekseninde simetrik olduğu için dönüş yeterli).
    boynuzGrup[0].position.set(ux, uy, 0);
    boynuzGrup[0].rotation.z = phi + Math.PI / 2;
    boynuzGrup[1].position.set(ux, -uy, 0);
    boynuzGrup[1].rotation.z = -(phi + Math.PI / 2);
    for (let i = 0; i < 2; i++) {
        const s = i ? -1 : 1;
        const k = KIRIS[i];
        k.position.set(ux, s * uy, 0);
        k.rotation.z = Math.atan2(-s * uy, -d - ux);
        k.scale.set(KIRIS_L, 1, 1);
    }
    KIRIS_SARIM.position.x = CEKIS - d;
    return phi;
}
// KURULUM DURUŞU = tam çekiş. Aynı fonksiyon, aynı sayılar.
yayPoz(CEKIS);

// Davranışın okuduğu TEK KAYNAK (userData.okcu bacak zinciri, bu yay/ateş).
modelGroup.userData.okcuYay = {
    // --- yay ---
    phi0: Y_PHI, phiBrace: PHI_BRACE, kirisL: KIRIS_L,
    cekis: CEKIS, braceD: BRACE_D, kant: KANT, yariYay: Y_YARI,
    poz: yayPoz,                         // poz(d) -> phi   (tek yazma noktası)
    // --- çerçeve ---
    pivot: [OMZ_X, OMUZ_Y],              // nişan grubunun ekseni (model uzayı)
    gEl: G_EL.slice(), cEl: C_EL.slice(),
    omzC: OMZ_2.slice(),                 // çekiş omzu (model uzayı)
    kolL1: CK_L1, kolL2: CK_L2,
    kutup: [CK_KUTUP.x, CK_KUTUP.y, CK_KUTUP.z],
    // --- ok ---
    // ⚠️ `okUzun` GEZDEN UCA gerçek mesafe (0.78058), okun nominal boyu
    // (0.780) DEĞİL: paradoks açısı yüzünden ikisi 0.6 mm ayrı ve uçuşta
    // okun ucunu hedefe oturtan sayı bu.
    okBoy: O_BOY, okUzun: _oL,
    // gezden uca birim yön, yay_kok yereli (archer's paradox: 2.2° yanda)
    okYon: [_od[0] / _oL, 0, _od[2] / _oL],
    // --- okluk (yeni ok buradan alınıyor) ---
    // Ağız = ara diskin üstündeki ok demetinin ekseni; kavrama noktası
    // okların dışarı çıktığı yerin biraz üstü.
    oklukAgiz: [OK_B[0] - 0.020, OK_B[1] + 0.086, OK_B[2]],
    oklukYon: (function () {
        const v = new THREE.Vector3(-0.070, 0.300, -0.030).normalize();
        return [v.x, v.y, v.z];
    })(),
    boy: BOY
};
