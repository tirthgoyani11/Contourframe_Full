// Zırhlı SUV — B6 sınıfı zırhlandırılmış tam boy arazi aracı. Modern Warfare
// grubunun onuncu modeli ve grubun tek TEKERLEKLİ, tek "sivil kasa" aracı.
//
// ⚠️ BU DOSYA SIFIRDAN YENİDEN YAZILDI. Önceki sürüm (eski parti,
// `models/zirhli-suv.js.YENIDEN-ONCE`) 51 mesh / 1256 üçgenden ibaretti ve
// gövdesi UÇ UCA DİZİLMİŞ ÜÇ KUTUYDU (alt gövde + kaput + kabin). Ölçüldü:
// kutu 4.590 x 2.955 x 2.300 — yani 4.6 metrelik bir araçta 2.96 metre
// yükseklik (antenler kutuyu şişiriyordu) ve teker çapı 1.00 m. Ayrıca dört
// mesh'in adı da `izgara_cubuk` idi; `_applyTint` `getObjectByName`
// kullandığı için onlardan yalnız İLKİ renk alabilirdi.
//
// GÖVDE MAKİNESİ: kesitten LOFT (devir §3). x ekseni boyunca 57 istasyonda
// ayrı ayrı hesaplanan KAPALI KESİTLER birbirine dikiliyor; her kesit dokuz
// parametreden üretiliyor ve her parametre x boyunca kendi monoton kübik
// (PCHIP) eğrisinden okunuyor. Makinenin FABRİKA biçimi (`loftYap(K)`)
// `askeri-kamyon.js`ten alındı — SUV tek gövdeli ama fabrika biçimi eğrileri
// tek bir nesnede topladığı için okunması kolay.
//
// ⚠️ Extrude ile kurulamazdı: ExtrudeGeometry'nin kesiti derinlik boyunca
// SABİTTİR. Bu araçta kaput 1.45 m, kabin 1.92 m, çamurluk 1.97 m genişliğinde
// ve çatı 1.60 m'ye daralıyor; tek bir yan siluetin itilmesi üçünü de aynı
// genişlikte yapardı. (Otomobilin ilk sürümü tam bu yüzden reddedilmişti.)
//
// ---------------------------------------------------------------------------
// REFERANS: TOYOTA LAND CRUISER 200 (J200, 2007-2021), B6 zırhlı gövde
// ---------------------------------------------------------------------------
// Neden bu araç: BM/AB misyonlarının, elçilik ve VIP koruma birliklerinin
// fiilî standart aracı; INKAS, The Armored Group ve Streit'in kataloglarında
// yıllardır BR6 seviyesinde satılıyor. Sınıfın öbür adayları (Suburban 2500,
// G-Wagen) bilerek elendi: Suburban 5.70 m ile sette zaten uzun olan askeri
// kamyona yaklaşıyor, G-Wagen ise 4.66 m ve KÖŞELİ — köşeli kutu kasa loft
// makinesinin anlatabildiği hiçbir şeyi kullanmıyor, üstelik ilk sürümün
// "üç kutu" hatasına geri dönmek olurdu.
//
// GERÇEK ÖLÇÜLER (kaynak: automoli.com J200 künyesi + ultimatespecs.com
// 4.5 D-4D V8 VXL künyesi + auto-data.net; üçü de aynı L/G/Y/dingil
// sayılarını veriyor — hiçbiri ezberden yazılmadı):
//   uzunluk 4950 mm · genişlik 1970 mm · yükseklik 1880 mm (1950 tavan raylı)
//   dingil arası 2850 mm · ÖN ÇIKMA 930 · ARKA ÇIKMA 1170  (930+2850+1170 ✓)
// ⚠️ MODELDE ÖN ÇIKMA 850 mm (2026-09-05, Furkan: "ön kısmı biraz uzun
// gibi"). Yani gövde sacı 4.950 değil 4.870 m. Kaynaktan BİLEREK sapılan
// tek ölçü budur; dingil arası, arka çıkma, izler ve teker yarıçapı
// künyedeki değerlerinde duruyor. Uygulaması §1'deki `onX` eşlemesi.
//   iz ön 1640 / arka 1635 mm · doruk açıklığı 225 mm
//   lastik 285/60 R18, jant 8J x 18 · boş ağırlık 2555-2665 kg (GVW 3300)
//   yaklaşma açısı 30° · ayrılma açısı 20°
//
// ⚠️ TEKER YARIÇAPI 0.400. 285/60 R18'in dış çapı 18x25.4 + 2x(285x0.60) =
// 457.2 + 342.0 = 799.2 mm → yarıçap 0.3996. `_WHEELS.radius` DA 0.400 olmak
// zorunda: motor kat edilen yolu yarıçapa bölerek yuvarlanmayı hesaplıyor.
// Eski tabloda 0.500 yazıyordu (eski modelin oyuncak ölçüsündeki tekeri);
// 0.400'lük gerçek lastikle 0.500 yazılsaydı teker %25 YAVAŞ dönerdi.
// (Otobüste 0.521 → 0.478, askeri kamyonda 0.630 düzeltmeleri aynı gerekçe.)
//
// ⚠️ EŞİK YÜKSEKLİKLERİ AÇILARDAN TÜRETİLDİ, GÖZ KARARI DEĞİL.
//   burun eşiği   = ön çıkma  x tan(30°) = 0.930 x 0.5774 = 0.537 (seri)
//   kuyruk eşiği  = arka çıkma x tan(20°) = 1.170 x 0.3640 = 0.426 (seri)
// KUYRUK: türetilen değere zırh paketinin takviyeli yayından gelen 45 mm
// yükseltme eklendi → 0.471, yani ayrılma açısı 20.0° yerine 21.9°.
// Yükseltmenin kazandırdığı pay tam olarak bu.
// BURUN: türetilen 0.537 + 0.045 = 0.582 ile ÖN YÜZ yalnız 0.56 m kalıyordu
// (ölçüldü) ve ızgara + far + takviyeli tampon o yüksekliğe sığmıyordu.
// Eşik 0.508'e İNDİRİLDİ; ön yüz 0.700 m oldu (kapak y 0.524..1.224,
// kesit_olc.js). Bedeli ölçüldü: yaklaşma açısı atan(0.508/0.930) = 28.7°,
// yani seri araçtan 1.3° DÜŞÜK. Bu, takviyeli tamponun gerçek dünyada da
// ödettiği bedeldir ve gizlenmedi.
// ⚠️ ÖN ÇIKMA 850'ye İNİNCE (2026-09-05) bu hesap da değişti: eşik yine
// 0.508 ama kaldıraç 0.850, yani atan(0.508/0.850) = 30.9°. Yaklaşma açısı
// seri aracın 30°'sinin ÜSTÜNE çıktı — kısaltmanın ölçülebilir kazancı bu.
//
// ---------------------------------------------------------------------------
// ZIRHLI SUV'U SİVİL SUV'DAN AYIRAN, MODELDE GÖRÜNEN YEDİ ŞEY
// ---------------------------------------------------------------------------
// (Kaynak: INKAS BR6 Land Cruiser tanıtımı — 7.62 mm tüfek + iki DM51 el
//  bombası; takviyeli süspansiyon, takviyeli kapı menteşeleri, yolcu
//  bölmesinin çevresi güçlendirilmiş, run-flat lastik, ağır hizmet jantı.
//  The Armored Group TLC 200 sayfası: çeki/tampon takviyesi, tavan kapağı,
//  taban zırhı, büyük fren diskleri.)
//   1. KÜÇÜLMÜŞ CAM ALANI. Seri araçta kapı camının açıklığı 0.46 m; burada
//      bel hattı 1.320'den 1.425'e KALDIRILDI ve cam üstü 1.755'e indirildi →
//      açıklık 0.330 m, yani %28 daha küçük. 40-50 mm kalınlığındaki balistik
//      camın çerçeveye sığması için gerçekte de böyle yapılıyor.
//   1b. CAM KORUMA KAFESİ (2026-09-04). Bütün camların önünde 24 mm'lik çelik
//      çubuk ızgarası (`kafes_cevre`, `kafes_boyuna`, `kafes_arka`). Aracın
//      "koruma aracı" olduğunu UZAKTAN söyleyen tek işaret; seçimi
//      `suv_kafes_olcek.py` ölçtü, bkz. §6.
//   2. KALIN DİREKLER. A/B/C/D direkleri gövde renginde DEĞİL koyu ve
//      camdan taşacak kadar geniş yazıldı (`direk_1/2`, dört bant tek mesh).
//   3. DÜZ VE KALIN CAM. `BOMBE` 0.004 (otomobilde 0.020): balistik cam
//      lamine ve DÜZ, bombeli değil. Camlar yüzeyden 0.030 dışarıda —
//      otomobilde 0.011 idi; aradaki 19 mm camın kalınlığı olarak okunuyor.
//   4. KABARIK KAPI KASALARI. `kapi_kasa_1..4`: kapı sacı gövde yüzeyinden
//      16 mm dışarıda duran ayrı panel. Zırh plakası kapı sacının içine
//      giriyor ve kapı gözle görülür biçimde şişiyor.
//   5. RUN-FLAT LASTİK + AĞIR ÇELİK JANT. Jant kollu döküm DEĞİL, DÜZ ÇELİK
//      disk (`jant_1..4`): sekiz havalandırma deliği, kalın bilezik, iri
//      poyra. Lastiğin iç kenarında run-flat destek halkası (`teker_*_runflat`)
//      görünüyor.
//   6. ARTIRILMIŞ YERDEN YÜKSEKLİK. Takviyeli yay 45 mm yükseltme veriyor;
//      kemer ağzının yarıçapı 0.500, lastik 0.400 → tekerin üstünde 100 mm
//      açık pay. Seri Land Cruiser'da bu pay 60 mm civarındadır.
//   7. TAVANDA ANTEN/FAR GRUBU + TAVAN KAPAĞI. Port-bagaj, alçak profilli
//      far grubu, iki kısa anten, köpekbalığı yüzgeci ve `cati_kapak`.
// Ayrıca: takviyeli ön/arka tampon ve DÖRT ÇEKİ NOKTASI (`ceki_on`,
// `ceki_arka`), taban zırhı (`alt_koruma`) ve gizli menteşeli kapıların
// conta/derz çizgisi (`kapi_derz`, menteşe GÖRÜNMÜYOR — zırhlı kapıda
// menteşe kasanın içine alınır).
//
// ---------------------------------------------------------------------------
// SİLUET — settekilerden neyle ayrılıyor
// ---------------------------------------------------------------------------
//   * askeri kamyon (7.37 m, 6x6, branda kasa): SUV 4.95 m ve TEK KÜTLE.
//   * tank / çoklu roketatar: paletli; SUV'da dört lastik ve kemer ağzı var.
//   * otomobil (Egea sedan, 4.53 x 1.79 x 1.50): SUV 1.97 m geniş, 1.93 m
//     yüksek ve tavanı 2.96 m boyunca DÜZ (Egea'da düz tavan 1.02 m).
//     Tepeden ölçüldü (suv_tepe_kiyas.py): siluet 9.86 m2 / doluluk 0.904;
//     sedan 8.14 m2 / 0.864, askeri kamyon 17.66 m2 / 0.847, tank
//     27.36 m2 / 0.674.
//     Tepeden bakışta SUV'un üstünü port-bagaj ve far grubu kaplıyor;
//     sedanın tavanı boş.
//   * motokaravan / otobüs: onlar tek kütle ve çok daha uzun.
//
// ⚠️ YAZI / ARMA YOK. Harita modeli soldan sağa AYNALIYOR (OKU.md; taksinin
// tepe lambasında "IXAT" çıkmıştı). Kapıya BM ya da polis yazısı koymak
// harflerin aynalanarak kurulmasını gerektirirdi; bu ölçekte bedeli hak
// etmiyor.
//
// ⚠️ İKİ TARAF DA SİMETRİK. Basamak, ayna, kapı, anten iki tarafta da var.
// Otobüs/motokaravan/kamyonda verilen kararın aynısı: model haritada
// serbestçe dönüyor, tek taraflı kurgu bakışların yarısında boş yan bırakır.
//
// PARÇALAR (Studio3D bu adları arar, DEĞİŞTİRME):
//   teker_1/2 → ÖN aks · teker_3/4 → ARKA aks (GRUP: lastik + run-flat halka)
//   jant_1/2  → ÖN jant · jant_3/4 → ARKA jant (GRUP: çelik disk + poyra)
//     ⚠️ Jant tekerin İÇİNDE değil, aynı konumda AYRI bir grup. Sebep:
//     `_WHEELS.parts` sekiz adı da sayıyor ve motor her birini ayrı ayrı
//     `rotation.y` ile döndürüyor; jant tekerin çocuğu olsaydı dönüş İKİ KEZ
//     uygulanırdı. Aynı konumdaki iki kardeş grup ise birlikte ve bir kez
//     dönüyor. `front` listesi de ikisini birden alıyor (motor her `front`
//     parçası için kendi konumunda bir direksiyon grubu kuruyor).
//   govde, ayna_govde_1/2, kapi_kasa_1..4 → BİRİNCİL RENK (_TINT.parts)
//   tampon_on, tampon_arka, camurluk_1..4, kaya_kizak_1/2 → İKİNCİL RENK
//   kafes_cevre, kafes_boyuna, kafes_arka → CAM KORUMA KAFESİ. ⚠️ HİÇBİR
//     TINT LİSTESİNDE DEĞİL: kafes çelik, gövde boyası değil; boyanınca
//     camın üstünde kırmızı bir ızgara kalırdı.
//
// KUTU (ÖLÇÜLDÜ): 4.973 x 2.202 x 2.158. x'teki 103 mm fazlalık takviyeli
// tampon ile çeki halkalarının kapağı geçen payı (gövde sacı 4.870); y tavan
// 1.925 + port-bagaj + 0.28 m'lik antenler; z gövde 1.970 + aynalar (gerçek
// Land Cruiser 200'ün aynalı genişliği 2.15 m).
// ⚠️ ÖNCEKİ KUTU 5.055 x 2.202 x 2.158 idi. Değişen tek eksen x: ön çıkmanın
// 80 mm kısalması kutuyu 82 mm kısalttı (%1.62). y ve z BİREBİR aynı kaldı —
// çamurluk flare'i artık gövdeden 30 mm dışarı taşıyor ama en dış noktası
// 1.015, aynalar 1.079'da olduğu için kutuya dokunmuyor.
// ⚠️ `maxHoriz = max(box.x, box.z)` = 4.973 (eskiden 5.055). Aynı `sizeKm`
// değerinde araç haritada %1.65 daha büyük görünür; kayıtlı projelerde başka
// etkisi yok.
// AĞIRLIK: 100 mesh / 14196 üçgen (flare süpürmesinden önce 100 / 13940,
// kafesten önce 97 / 13244). Kıyas: otomobil 84/12968, tank 87/11008,
// askeri kamyon 94/11884.
//
// YÖN: burun +x, üst +y, taban y=0. Ölçüler gerçek metre.

// ===========================================================================
// 0. RENKLER
// ===========================================================================
// ⚠️ AÇIK RENKTE PATLAMA TUZAĞI (motokaravanda %80, uçakta %78 tam beyaz
// ölçülmüştü) burada gövdede AÇILMIYOR: grafit (58,64,72) koyu bir ton.
// Ama tuzak TEK RENKTE DEĞİL PALETTE aranır — F-16'da tam beyaz piksellerin
// %85'i kanat ucu füzelerinden, fırkateynde %100'ü helikopter dairesinin
// çizgisinden geliyordu. Burada tepeden bakışta görünen açık şey FAR
// GRUBUNUN LENSİ; o yüzden lens beyaz değil (#aeb7bd) ve palet
// `parlaklik.py` ile taranıyor.
// ⚠️ metalness DÜŞÜK ama sıfır değil: 0'a indirmek difüzü (albedo x
// (1-metal)) tam açar. Zırhlı araç boyası mat: metal 0.40, rough 0.42.
const C_GOVDE   = '#4e5660';   // _TINT varsayılanı — grafit koruma aracı boyası
// ⚠️ TON VE PÜRÜZLÜLÜK ÖLÇÜLEREK SEÇİLDİ (`suv_govde_tara.py`). İlk kurulum
// '#3a4048' / rough 0.42 idi ve tepe bakışında ÇATI neredeyse siyah
// okunuyordu: düz çatıya aynasal lob gelmiyor, yalnız difüz kalıyor ve
// difüz = albedo x (1 - metalness). Haritanın ana bakışı yüksek eğimli,
// yani en çok görünen yüzey tam da o çatı. Altı ton denendi; tepe
// panelindeki ortalama parlaklık 59.0 → 80.2/255'e çıktı ve TAM BEYAZ
// piksel sayısı ALTISINDA DA DEĞİŞMEDİ (346, %0.14) — yani patlama riski
// gövdeden gelmiyor (palet taraması: %60 plakalar, %32 tavan far lensi,
// %8 far lensleri). Daha açık iki ton (#586069, #626a74) da güvenliydi
// ama koruma aracının koyu grafit kimliğinden uzaklaşıyordu.
// ⚠️ KAFES EKLENDİKTEN SONRA YENİDEN TARANDI (2026-09-04): tam beyaz 286
// piksel / %0.12 ve dağılım %65 tavan far lensi + %17.8 plakalar + %17.1 far
// lensleri. `C_KAFES` siyaha çevrilince tam beyaz sayısı HİÇ DEĞİŞMİYOR
// (286 → 286), yani paletteki en açık üçüncü ton olmasına rağmen kafesin
// patlamaya katkısı SIFIR.
const C_ZIRH    = '#23262a';   // _TINT ikincil varsayılanı — tampon/flare/kızak
const C_CAM     = '#10151b';   // balistik cam: kalın, koyu, az yansıtır
const C_DIREK   = '#0e1114';   // direk / cam çerçevesi karartması
const C_DERZ    = '#191d22';   // kapı derzi, conta çizgisi
const C_LASTIK  = '#191a1c';
const C_RUNFLAT = '#2e3236';   // run-flat destek halkası (kompozit)
const C_JANT    = '#4e545c';   // AĞIR ÇELİK JANT — krom değil, boyalı çelik
const C_JANT_K  = '#33383e';
const C_DIP     = '#0c0e11';   // davlumbaz, gölgeli oyuklar
const C_METAL   = '#767d86';   // çeki halkası, taban zırhı — donuk metal
const C_KOYU_M  = '#3c4249';   // ızgara içi, koyu metal
const C_FAR     = '#c4cdd6';
const C_FAR_IC  = '#333a42';
const C_STOP    = '#8f2b23';
const C_STOP_K  = '#521512';
const C_PLAKA   = '#c9cfd6';
const C_LENS    = '#aeb7bd';   // tavan far grubu lensi — BİLEREK beyaz değil
// CAM KORUMA KAFESİ (2026-09-04). Çelik çubuk: camın (#10151b) çok üstünde,
// gövdenin (#4e5660) bir tık üstünde bir ton. İkisinden de ayrılması gerek —
// gövde renginde olsaydı direklerin üstünde kaybolurdu, camla aynı tonda
// olsaydı kafes hiç okunmazdı. ⚠️ AÇIK RENK PATLAMASI: bu sabit paletteki EN
// AÇIK üçüncü şey; `suv_palet_tara.py` ile ölçüldü, tam beyaza katkısı sıfır.
const C_KAFES   = '#5a626c';

// ===========================================================================
// 1. TEMEL ÖLÇÜLER
// ===========================================================================
const KALDIR    = 0.045;    // takviyeli yaydan gelen yükseltme
const UZUN      = 2.475;    // yarı uzunluk → 4.950 m
const R_TEKER   = 0.400;    // 285/60 R18 → dış çap 799.2 mm
const R_JANT    = 0.229;    // 8J x 18 → jant çapı 457.2 mm
const LASTIK_GEN = 0.285;   // kesit genişliği 285 mm
const AKS_Y     = R_TEKER;
const ON_X      =  1.545;   // ön aks   (ön çıkma 930)
const ARKA_X    = -1.305;   // arka aks (arka çıkma 1170) → dingil arası 2850
const AKS_X     = [ARKA_X, ON_X];
const IZ_ON     = 0.820;    // iz ön 1640
const IZ_ARKA   = 0.8175;   // iz arka 1635
const YARI_EN   = 0.985;    // genişlik 1970
const CATI_Y    = 1.880 + KALDIR;   // 1.925 — tavan sacı
const KEMER_R   = 0.500;    // kemer ağzı — lastikten 100 mm açık (yükseltme)
const KEMER_ETEK = 0.110;   // ağzın uçlarının eşiğe inişi
const BOMBE     = 0.004;    // balistik cam DÜZ (otomobilde 0.020 idi)
const NV        = 22;       // yarı kesitteki örnek sayısı (halka 2*NV-2 = 42)

// ---- ÖN ÇIKMANIN KISALTILMASI ---------------------------------------------
// Furkan: "Arabanın ön kısmı biraz uzun gibi, hafif kısabilir."
// ⚠️ BU, KAYNAKTAN BİLEREK SAPMADIR. Land Cruiser 200'ün ön çıkması 930 mm
// ve gövde sacı 4.950 m; ikisi de yukarıdaki künyeden birebir alınmıştı.
// Burada çıkma 850 mm'ye indi, gövde sacı 4.870 m oldu. Dingil arası (2850),
// arka çıkma (1170), izler, teker yarıçapı ve kemer ağzı DEĞİŞMEDİ; yaklaşma
// açısı atan(0.508/0.850) = 30.9°'ye ÇIKIYOR (eskiden 28.7°, seri 30°).
//
// NASIL: ön aksın ÖNÜNDEKİ bölge x'te ON_ORAN ile sıkıştırılıyor. Şeklin
// kendisi korunuyor — burun konisi, ızgara, far, tampon aynı oranlarında
// kalıyor, yalnız hepsi akstan itibaren %8.6 yaklaşıyor. Alternatif "burnu
// kesip atmak" olurdu; o, dokuz eğrinin ucunu başka bir x'te kestiği için
// burun KESİTİNİ de değiştirirdi (kapak zarfı, ızgaranın sığdığı yükseklik).
//
// ⚠️ KEMER AĞZI SIKIŞTIRILMIYOR. `kemerUst` NİHAİ x ile hesaplanıyor, yani
// ağız aksın çevresinde TAM DAİRE kalıyor; lastik, jant, davlumbaz ve flare
// zaten aksa göre yazılı. Sıkıştırılsaydı ağız elipse dönüp yuvarlak
// davlumbazla arasında açıklık kalırdı. Sıkıştırılan şeyler: dokuz kesit
// EĞRİSİ (ters eşleme ile), istasyon listesi, kaput derzi ve ön yüz parçaları.
//
// ⚠️ KUTUYA ETKİSİ: `maxHoriz = max(box.x, box.z)` ölçeği belirliyor; box.x
// küçüldüğü için aynı `sizeKm` değerinde araç haritada bir tık daha geniş ve
// yüksek görünür. Oran ölçüldü, aşağıdaki KUTU notunda.
const ON_CIKMA0 = 0.930;                               // seri araçtaki ön çıkma
const ON_KISALT = 0.080;                               // kısaltma
const ON_ORAN   = (ON_CIKMA0 - ON_KISALT) / ON_CIKMA0; // 0.913978
const X_ON      = UZUN - ON_KISALT;                    // gövde sacının burnu
// Aksın önündeki x'i sıkıştırır (onX) / geri açar (onXTers). Aksın
// gerisinde ikisi de birim eşleme, yani kırılma noktası tam aksın üstünde.
function onX(x)     { return x <= ON_X ? x : ON_X + (x - ON_X) * ON_ORAN; }
function onXTers(x) { return x <= ON_X ? x : ON_X + (x - ON_X) / ON_ORAN; }

// Kesit parametresi v'nin bölüm sınırları:
//   A [0 .. VA]   taban (kemer ağzı ya da marşpiyel altı)
//   B [VA .. VB]  alt yanak: tabandan en geniş noktaya (süper-elips)
//   C [VB .. VC]  en geniş → bel: DİK kapı yüzeyi
//   D [VC .. VD]  bel → çatı kenarı (cam kuşağı, tumblehome)
//   E [VD .. 1]   çatı kubbesi, orta hatta kapanır
const VA = 0.045, VB = 0.290, VC = 0.545, VD = 0.790;

// ===========================================================================
// 2. MONOTON KÜBİK EĞRİ (PCHIP)
// ===========================================================================
// Catmull-Rom yerine Fritsch-Carlson: yerel uç noktalarda tegeti sıfırladığı
// için tavan çizgisi kaputun üstüne tümsek atmıyor (otomobilde ölçülmüştü).
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

// ===========================================================================
// 3. LOFT MAKİNESİ (askeri-kamyon.js'in fabrika biçimi, tek gövde için)
// ===========================================================================
function loftYap(K) {
    const VAk = K.VA, VBk = K.VB, VCk = K.VC, VDk = K.VD;

    function ucCarpani(x) {
        let f = 1;
        if (K.PAH_ON > 0) {
            const u = (x - (K.X_ON - K.PAH_ON)) / K.PAH_ON;
            if (u > 0) {
                f = Math.min(f, K.UC_ON + (1 - K.UC_ON) *
                    Math.sqrt(Math.max(0, 1 - u * u)));
            }
        }
        if (K.PAH_ARKA > 0) {
            const u = ((K.X_ARKA + K.PAH_ARKA) - x) / K.PAH_ARKA;
            if (u > 0) {
                f = Math.min(f, K.UC_ARKA + (1 - K.UC_ARKA) *
                    Math.sqrt(Math.max(0, 1 - u * u)));
            }
        }
        return f;
    }

    // Çamurluk kemerinin üst kenarı: lastikle EŞ MERKEZLİ daire (açıklık her
    // yerde aynı) ve uçlarında çeyrek elipsle eşiğe iniyor. Yarım daire tek
    // başına bırakılsaydı ağzın uçlarında dikey duvar kalırdı.
    function kemerUst(x) {
        const e = K.ESIK(x);
        if (!K.KEMER) return e;
        let y = e;
        for (let k = 0; k < K.KEMER.length; k++) {
            const dx = Math.abs(x - K.KEMER[k]);
            if (dx < K.KEMER_R) {
                y = Math.max(y, AKS_Y + Math.sqrt(K.KEMER_R * K.KEMER_R - dx * dx));
            } else if (dx < K.KEMER_R + K.KEMER_ETEK) {
                const u = (dx - K.KEMER_R) / K.KEMER_ETEK;
                y = Math.max(y, e + (AKS_Y - e) * Math.sqrt(Math.max(0, 1 - u * u)));
            }
        }
        return y;
    }

    function kesitPar(x) {
        const e = K.ESIK(x);
        let yA = kemerUst(x);
        let yO = K.Y_OMUZ(x);
        let yU = K.Y_UST(x);
        yA = Math.min(yA, yO - 0.030);
        let yB = Math.min(K.Y_BEL(x), yO + (yU - yO) * 0.92);
        let yC = Math.max(yB + 0.020, yU - K.KUBBE(x));
        const wO = K.W_OMUZ(x);
        const wB = Math.max(0.03, wO - K.D_BEL(x));
        let wC = Math.min(K.W_CATI(x), wB - 0.006);
        const pay = Math.min(1, Math.max(0, (yA - e) / K.PAY_BOL));
        const wRock = K.W_ESIK(x);
        let wA = wRock + (wO - 0.014 - wRock) * pay;
        wA = Math.min(wA, wO - 0.012);

        const f = ucCarpani(x);
        if (f < 1) {
            const yc = (yA + yU) / 2;
            yA = yc + (yA - yc) * f; yO = yc + (yO - yc) * f;
            yB = yc + (yB - yc) * f; yC = yc + (yC - yc) * f;
            yU = yc + (yU - yc) * f;
            return { yA: yA, wA: wA * f, yO: yO, wO: wO * f, yB: yB, wB: wB * f,
                     yC: yC, wC: wC * f, yU: yU };
        }
        return { yA: yA, wA: wA, yO: yO, wO: wO, yB: yB, wB: wB,
                 yC: yC, wC: wC, yU: yU };
    }

    function kesitNokta(P, v) {
        if (v <= VAk) return [P.wA * (v / VAk), P.yA];
        if (v <= VBk) {
            // Süper-elips çeyreği: (wA,yA) köşesinden çıkıp (wO,yO)'da DİKEY
            // tegetle biter. Üs küçüldükçe yanak marşpiyelden hemen açılıp
            // DİKLEŞİYOR — zırhlı gövdenin yanağı belirgin biçimde yassıdır.
            const t = (v - VAk) / (VBk - VAk), th = t * Math.PI / 2;
            return [P.wA + (P.wO - P.wA) * Math.pow(Math.sin(th), K.US_YANAK),
                    P.yO - (P.yO - P.yA) * Math.pow(Math.cos(th), K.US_YANAK)];
        }
        if (v <= VCk) {
            const t = (v - VBk) / (VCk - VBk);
            const e = t * t * (3 - 2 * t);
            return [P.wO + (P.wB - P.wO) * e, P.yO + (P.yB - P.yO) * t];
        }
        if (v <= VDk) {
            // Tumblehome: bel ile çatı kenarı arasında ikinci derece Bezier.
            // BOMBE 0.004 → yüzey neredeyse DÜZ (balistik cam düzdür).
            const t = (v - VCk) / (VDk - VCk), u = 1 - t;
            const cz = (P.wB + P.wC) / 2 + K.BOMBE, cy = (P.yB + P.yC) / 2;
            return [u * u * P.wB + 2 * u * t * cz + t * t * P.wC,
                    u * u * P.yB + 2 * u * t * cy + t * t * P.yC];
        }
        const t = (v - VDk) / (1 - VDk), th = t * Math.PI / 2;
        return [P.wC * Math.pow(Math.cos(th), K.US_CATI),
                P.yC + (P.yU - P.yC) * Math.pow(Math.sin(th), K.US_CATI)];
    }

    function nokta3(x, w) {
        const p = kesitNokta(kesitPar(x), 1 - Math.abs(w));
        return [x, p[1], (w < 0 ? -p[0] : p[0])];
    }

    function normal3(x, w) {
        const h = 0.0035;
        const hx = (x > K.X_ON - 0.004) ? -h : h;
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

    function vYukseklik(x, y) {
        const P = kesitPar(x);
        let a = 0, b = 1;
        for (let i = 0; i < 24; i++) {
            const m = (a + b) / 2;
            if (kesitNokta(P, m)[1] < y) a = m; else b = m;
        }
        return (a + b) / 2;
    }

    const NVk = K.NV, R_HALKA = 2 * NVk - 2;
    function halka(x) {
        const P = kesitPar(x), yarim = [];
        for (let i = 0; i < NVk; i++) yarim.push(kesitNokta(P, i / (NVk - 1)));
        const r = [];
        for (let i = 0; i < NVk; i++) r.push([yarim[i][1], yarim[i][0]]);
        for (let i = NVk - 2; i >= 1; i--) r.push([yarim[i][1], -yarim[i][0]]);
        return r;
    }

    function kur(ad, renk, opts) {
        const IST = K.IST, P = [], IDX = [];
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
        // Ön ve arka kapak: düz üçgen yelpaze. Halka köşeleri KOPYALANIYOR ki
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
        modelGroup.add(mesh(geo, renk, Object.assign({ name: ad }, opts)));
    }

    return { kesitPar: kesitPar, kesitNokta: kesitNokta, nokta3: nokta3,
             normal3: normal3, vYukseklik: vYukseklik, kur: kur };
}

// ---------------------------------------------------------------------------
// YÜZEYE OTURAN PANEL. Gövde yüzeyi x1..x2 ve a1..a2 aralığında yeniden
// örneklenip normal boyunca `disari` kadar ötelenir.
// Bant biçimi: [x1, x2, a1, a2]        → a, kesit parametresi w
//              [x1, x2, y1, y2, taraf] → a YÜKSEKLİK; her x'te o yüksekliğin
//                                        w'si aranıyor.
//              [x1, x2, a1, a2, 0, b1, b2] → YAMUK (konik) bant: a aralığı x
//                                        boyunca (a1,a2)'den (b1,b2)'ye
//                                        doğrusal geçiyor.
// ⚠️ YAMUK BİÇİM ÖN CAM İÇİN EKLENDİ (2026-09-04). Dikdörtgen bant `w`yi
// sabit tutuyor, `w`nin karşılığı olan GENİŞLİK ise kesitten geliyor; gövde
// kaputa doğru daraldığı için sabit-w bir ön cam ALTTA DAR ÜSTTE GENİŞ
// çıkıyordu (ölçüldü: alt 1.223 m, üst 1.336 m — gerçeğin tam tersi).
// ⚠️ KAVİSİN İÇİNDEN GEÇEN BANT `w` BİÇİMİNDE YAZILIR (otobüste ölçüldü: ön
// cam köşe bandı yükseklik biçiminde yazılınca yırtılıyordu).
// ⚠️ `nx` bandın x yönündeki, `nw` w yönündeki bölüntüsü — UZUN kenara ÇOK
// verilir; ters verilirse şerit kavisi takip edemeyip yüzeyin içine girer.
function yuzeyYama(G, ad, bantlar, nx, nw, disari, renk, opts) {
    opts = opts || {};
    const P = [], IDX = [];
    for (const bant of bantlar) {
        const x1 = bant[0], x2 = bant[1], a1 = bant[2], a2 = bant[3];
        const taraf = bant.length > 4 ? bant[4] : 0;
        const konik = bant.length > 6;
        const b1 = konik ? bant[5] : a1, b2 = konik ? bant[6] : a2;
        const taban = P.length / 3, S = nw + 1;
        for (let i = 0; i <= nx; i++) {
            const u = i / nx;
            const x = x1 + (x2 - x1) * u;
            const c1 = a1 + (b1 - a1) * u, c2 = a2 + (b2 - a2) * u;
            for (let j = 0; j <= nw; j++) {
                const a = c1 + (c2 - c1) * j / nw;
                const w = taraf ? taraf * (1 - G.vYukseklik(x, a)) : a;
                const p = G.nokta3(x, w), n = G.normal3(x, w);
                P.push(p[0] + n[0] * disari, p[1] + n[1] * disari,
                       p[2] + n[2] * disari);
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
        metal: opts.metal == null ? 0.30 : opts.metal,
        rough: opts.rough == null ? 0.42 : opts.rough, name: ad
    });
    m.material.side = THREE.DoubleSide;
    // Kalınlıksız paneller GÖLGE DÜŞÜRMEZ: gövdeye 5-30 mm mesafede
    // duruyorlar, gölge haritasında kendi gölgelerini gövdeye basıp benek
    // (acne) üretiyorlardı.
    m.castShadow = false;
    // ⚠️ Aynı yüzeye oturan panellerde DERİNLİK KAVGASI (trende ölçüldü:
    // castShadow=false hiç değiştirmemişti — z-tamponu, gölge değil).
    if (opts.katman) {
        m.material.polygonOffset = true;
        m.material.polygonOffsetFactor = -opts.katman;
        m.material.polygonOffsetUnits = -opts.katman;
    }
    modelGroup.add(m);
    return m;
}

// ---------------------------------------------------------------------------
// ÖN/ARKA YÜZ PARÇASI. ExtrudeGeometry şekli XY düzleminde kurup +Z'ye itiyor;
// yüz parçaları için şekil (z,y) düzleminde yazılıp +X'e itilmeli.
// ⚠️ Geometri `x`ten `x+derinlik`e uzanır; her parçanın `x+derinlik`i kapağı
// 5-30 mm GEÇMELİ, yoksa parça havada kalır ve kutu ölçüsü şişer.
// ⚠️ BEVEL KULLANILMIYOR — `bevelSize` konturu DIŞARI itiyor (motokaravanda
// ölçüldü: şekil 3.50'de yazılıyken kutu 3.530 çıktı). Köşe yuvarlaması
// konturun KENDİSİNE işleniyor.
function yuvarlakSekil(pts, r) {
    const s = new THREE.Shape(), n = pts.length;
    for (let i = 0; i < n; i++) {
        const p0 = pts[(i - 1 + n) % n], p1 = pts[i], p2 = pts[(i + 1) % n];
        const d1x = p1[0] - p0[0], d1y = p1[1] - p0[1];
        const d2x = p2[0] - p1[0], d2y = p2[1] - p1[1];
        const l1 = Math.sqrt(d1x * d1x + d1y * d1y) || 1;
        const l2 = Math.sqrt(d2x * d2x + d2y * d2y) || 1;
        const rr = Math.min(r, l1 / 2, l2 / 2);
        const ax = p1[0] - d1x / l1 * rr, ay = p1[1] - d1y / l1 * rr;
        const bx = p1[0] + d2x / l2 * rr, by = p1[1] + d2y / l2 * rr;
        if (i === 0) s.moveTo(ax, ay); else s.lineTo(ax, ay);
        s.quadraticCurveTo(p1[0], p1[1], bx, by);
    }
    s.closePath();
    return s;
}

function yuzParca(ad, pts, r, x, derinlik, renk, opts) {
    opts = opts || {};
    const q = pts.map(p => [-p[0], p[1]]);
    q.reverse();
    const geo = new THREE.ExtrudeGeometry(yuvarlakSekil(q, r), {
        depth: derinlik, bevelEnabled: false, curveSegments: 4
    });
    geo.rotateY(Math.PI / 2);
    geo.translate(x, 0, 0);
    const m = mesh(geo, renk, {
        metal: opts.metal == null ? 0.22 : opts.metal,
        rough: opts.rough == null ? 0.52 : opts.rough, name: ad
    });
    modelGroup.add(m);
    return m;
}

// ÖN YÜZ PARÇALARI İÇİN SARMALAYICI. Koordinatlar SERİ ARACIN (kısaltmadan
// önceki) burun düzleminde yazılmaya devam ediyor — §8'deki zarf ölçüleri ve
// `kesit_olc.js --z 2.475` çıktısı geçerliliğini korusun diye. Sarmalayıcı
// hem başlangıç x'ini hem DERİNLİĞİ aynı oranla taşıyor; `derinlik * ON_ORAN`
// tam olarak `onX(x + derinlik) - onX(x)`.
function yuzParcaOn(ad, pts, r, x, derinlik, renk, opts) {
    return yuzParca(ad, pts, r, onX(x), derinlik * ON_ORAN, renk, opts);
}

// ---------------------------------------------------------------------------
// ÇOK KUTULU TEK MESH. Port-bagaj çıtaları, kapı kolları, çeki halkaları gibi
// onlarca küçük kutu var; her biri ayrı mesh olsaydı çizim çağrısı sayısı
// katlanırdı. ⚠️ Bu aynı zamanda AD TUZAĞININ çözümü: `_applyTint`
// `getObjectByName` kullanıyor, aynı adlı meshlerden yalnız İLKİ renk alır.
// Kutu biçimi: [cx, cy, cz, sx, sy, sz]
function kutular(ad, liste, renk, opts) {
    const P = [], N = [], IDX = [];
    for (const b of liste) {
        const g = new THREE.BoxGeometry(b[3], b[4], b[5]);
        g.translate(b[0], b[1], b[2]);
        const pos = g.attributes.position.array;
        const nor = g.attributes.normal.array;
        const idx = g.index.array;
        const taban = P.length / 3;
        for (let i = 0; i < pos.length; i++) { P.push(pos[i]); N.push(nor[i]); }
        for (let i = 0; i < idx.length; i++) IDX.push(taban + idx[i]);
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.Float32BufferAttribute(P, 3));
    geo.setAttribute('normal', new THREE.Float32BufferAttribute(N, 3));
    geo.setIndex(IDX);
    const m = mesh(geo, renk, Object.assign({ name: ad }, opts || {}));
    modelGroup.add(m);
    return m;
}

// ===========================================================================
// 4. GÖVDENİN UZUNLAMASINA ÇİZGİLERİ
// ===========================================================================
// PROFİL (hepsi yükseltme dahil, gerçek metre):
//   burun 2.475 → ızgara üstü 1.180 · kaput 1.28 · KOKPİT 1.095
//   ön cam 1.095 → 0.760 (yatayla 58.9°, Land Cruiser'ın DİK ön camı)
//   DÜZ TAVAN 0.760 → -2.200  = 2.96 m  (aracın %60'ı)
//   arka cam 2.200 → -2.400 (yatayla 69.6°, neredeyse dikey bagaj kapağı)
// Egea'nın düz tavanı 1.02 m idi; SUV'u sedandan tepeden ayıran birinci şey
// bu 2.96 metrelik düz tavan.
const Y_UST = egriYap([
    [-2.475, 1.560], [-2.430, 1.762], [-2.380, 1.848], [-2.320, 1.895],
    [-2.240, 1.918], [-2.120, 1.927], [-1.600, 1.926], [-0.800, 1.925],
    [ 0.000, 1.925], [ 0.400, 1.925], [ 0.620, 1.921], [ 0.760, 1.878],
    [ 0.880, 1.660], [ 0.990, 1.420], [ 1.095, 1.306], [ 1.260, 1.296],
    [ 1.700, 1.290], [ 2.100, 1.278], [ 2.330, 1.262], [ 2.475, 1.240]
]);
// EŞİK: gövdenin alt kenarı (marşpiyel altı). Uçlardaki değerler yaklaşma
// (30°) ve ayrılma (20°) açılarından TÜRETİLDİ, + 45 mm yükseltme.
const ESIK = egriYap([
    [-2.475, 0.471], [-2.250, 0.468], [-1.900, 0.468], [-0.600, 0.470],
    [ 0.600, 0.470], [ 1.600, 0.474], [ 2.050, 0.490], [ 2.300, 0.503],
    [ 2.475, 0.508]
]);
// EN GENİŞ NOKTANIN YÜKSEKLİĞİ — çamurluk kabarıklığının merkezi.
const Y_OMUZ = egriYap([
    [-2.475, 0.790], [-2.250, 0.940], [-1.900, 1.000], [-1.305, 1.020],
    [-0.400, 1.010], [ 0.400, 1.010], [ 1.545, 1.020], [ 2.100, 0.980],
    [ 2.330, 0.892], [ 2.475, 0.800]
]);
// ÇATI/KAPUT KUBBESİNİN DERİNLİĞİ. Tavan neredeyse DÜZ (30 mm); kaputta ve
// bagaj kapağında daha derin.
const KUBBE = egriYap([
    [-2.475, 0.062], [-2.200, 0.045], [-1.800, 0.032], [-0.400, 0.030],
    [ 0.500, 0.030], [ 0.900, 0.038], [ 1.300, 0.055], [ 2.000, 0.058],
    [ 2.475, 0.062]
]);
// EN GENİŞ YARI GENİŞLİK. İki aksın üstünde 0.985'e (1970 mm) şişiyor.
const W_OMUZ = egriYap([
    [-2.475, 0.898], [-2.300, 0.945], [-2.000, 0.968], [-1.600, 0.980],
    [-1.305, 0.985], [-0.900, 0.966], [-0.200, 0.958], [ 0.600, 0.960],
    [ 1.150, 0.972], [ 1.545, 0.985], [ 1.950, 0.972], [ 2.250, 0.940],
    [ 2.475, 0.898]
]);
// BEL HATTI (yan camın dibi). ⚠️ ZIRHLI ARAÇTA YÜKSEK: seri Land Cruiser'da
// 1.320, burada 1.425. Balistik camın açıklığı bu yüzden küçülüyor.
const Y_BEL = egriYap([
    [-2.475, 1.230], [-2.300, 1.362], [-2.050, 1.420], [-1.600, 1.428],
    [-0.400, 1.425], [ 0.600, 1.425], [ 0.900, 1.410], [ 1.095, 1.330],
    [ 1.400, 1.262], [ 1.900, 1.222], [ 2.250, 1.180], [ 2.475, 1.120]
]);
// Bel hattında genişliğin omuzdan ne kadar içeri çekildiği.
// ⚠️ KAPUTUN DARLIĞI BURADAN GELİYOR, W_OMUZ'dan değil: W_OMUZ kaput
// bölgesinde de 0.97'de kalıyor çünkü ORASI ÇAMURLUK. Kaput, kesitin daha
// yukarısındaki wB = wO - D_BEL çizgisi (kabinde 0.020, kaputta 0.250).
const D_BEL = egriYap([
    [-2.475, 0.150], [-2.250, 0.062], [-1.900, 0.026], [-0.400, 0.020],
    [ 0.600, 0.020], [ 0.900, 0.048], [ 1.095, 0.150], [ 1.400, 0.235],
    [ 1.900, 0.252], [ 2.250, 0.250], [ 2.475, 0.246]
]);
// ÇATI KENARI GENİŞLİĞİ. Tavan 1.600 m (0.800 yarı) — bele göre yalnız
// 0.158 tumblehome. SUV'un yanı sedandan çok daha DİK.
const W_CATI = egriYap([
    [-2.475, 0.640], [-2.300, 0.722], [-2.050, 0.775], [-1.700, 0.795],
    [-0.400, 0.800], [ 0.500, 0.800], [ 0.760, 0.788], [ 1.000, 0.740],
    [ 1.200, 0.700], [ 1.700, 0.690], [ 2.100, 0.668], [ 2.475, 0.606]
]);
// MARŞPİYEL GENİŞLİĞİ (kesitin en altı).
const W_ESIK = egriYap([
    [-2.475, 0.856], [-2.200, 0.870], [-1.800, 0.878], [-0.600, 0.880],
    [ 0.600, 0.880], [ 1.800, 0.878], [ 2.200, 0.868], [ 2.475, 0.856]
]);

// İstasyonlar KEMER AĞIZLARINDA ve ön cam / bagaj kapağı kırılmalarında sık,
// düz bölümlerde seyrek. Kemer eğrisinin türevi ağzın uçlarında kırılıyor;
// orada seyrek örneklenirse yay köşe köşe çıkar.
const IST = (function () {
    const orta = [
        -2.415, -2.370, -2.320, -2.260, -2.190, -2.100, -2.000,
        -1.900, -1.820, -1.760, -1.700, -1.620, -1.520, -1.420,
        -1.305, -1.190, -1.090, -1.000, -0.910, -0.830,
        -0.600, -0.360, -0.100,  0.150,  0.400,
         0.560,  0.660,  0.760,  0.850,  0.940,  1.020,  1.095,
         1.180,  1.270,  1.360,  1.450,  1.545,  1.640,  1.740,
         1.840,  1.930,  2.010,  2.090,  2.170,  2.250,  2.330,  2.385
    ];
    // ⚠️ ÖN AKSIN ÖNÜNDEKİ İSTASYONLAR SIKIŞTIRILIR. `orta` listesi SERİ
    // aracın x'inde yazılı kalıyor (kaynaktaki ölçülerle kıyaslanabilsin
    // diye); `onX` onları nihai x'e taşıyor. Aksın gerisindekiler değişmiyor.
    // Burun pahının kendi istasyonları doğrudan nihai burundan türetiliyor.
    const PAH_ON = 0.085 * ON_ORAN, PAH_ARKA = 0.048;
    const on = [0.30, 0.55, 0.76, 0.91, 1.0].map(k => X_ON - PAH_ON + PAH_ON * k);
    const arka = [1.0, 0.91, 0.76, 0.55, 0.30].map(k => -UZUN + PAH_ARKA - PAH_ARKA * k);
    return arka.concat(orta.map(onX), on);
})();

// ⚠️ DOKUZ EĞRİYE TERS EŞLEME İLE GİRİLİYOR. İstasyonlar artık SIKIŞTIRILMIŞ
// x'te, eğriler ise seri aracın x'inde yazılı. `onXTers` ikisini bağlıyor:
// kesitin şekli x=2.395'te tam olarak eskiden x=2.475'te olan şekil.
// `KEMER` / `KEMER_R` bu eşlemeden GEÇMİYOR — kemer ağzı nihai x'te tam daire
// kalmak zorunda (gerekçe §1).
const _egriOn = function (f) { return function (x) { return f(onXTers(x)); }; };
const G = loftYap({
    X_ARKA: -UZUN, X_ON: X_ON,
    // Burun KÜT (zırhlı ızgara kovanı dik), bagaj kapağı neredeyse DİKEY.
    // ⚠️ PAH_ON da sıkıştırılıyor: pah burun şeklinin parçası.
    PAH_ON: 0.085 * ON_ORAN, UC_ON: 0.956,
    PAH_ARKA: 0.048, UC_ARKA: 0.978,
    VA: VA, VB: VB, VC: VC, VD: VD,
    // US_YANAK 0.44: yanak marşpiyelden hemen açılıp dikleşiyor (zırhlı
    // gövdenin yanı levha gibi yassıdır). US_CATI 0.50: tavan ortada DÜZ,
    // yalnız kenarları yuvarlak — SUV tavanı kubbe değildir.
    US_YANAK: 0.44, US_CATI: 0.50, BOMBE: BOMBE, PAY_BOL: 0.45,
    NV: NV, IST: IST,
    KEMER: AKS_X, KEMER_R: KEMER_R, KEMER_ETEK: KEMER_ETEK,
    ESIK: _egriOn(ESIK), Y_OMUZ: _egriOn(Y_OMUZ), Y_UST: _egriOn(Y_UST),
    Y_BEL: _egriOn(Y_BEL), KUBBE: _egriOn(KUBBE), W_OMUZ: _egriOn(W_OMUZ),
    W_CATI: _egriOn(W_CATI), W_ESIK: _egriOn(W_ESIK), D_BEL: _egriOn(D_BEL)
});
G.kur('govde', C_GOVDE, { metal: 0.40, rough: 0.52 });

// Model kodunun kendi ölçüm kancaları (kesit_olc.js bunları arıyor).
function kesitPar(x) { return G.kesitPar(x); }
function kesitNokta(P, v) { return G.kesitNokta(P, v); }
function nokta3(x, w) { return G.nokta3(x, w); }
function vYukseklik(x, y) { return G.vYukseklik(x, y); }

// YARI GENİŞLİKTEN `w` ÇÖZÜCÜ. `vYukseklik` yükseklikten w bulur; bu onun
// GENİŞLİK karşılığı.
// ⚠️ ÇATININ TEPESİNDE ZORUNLU. Kesitin E bölümü w'yi genişliğe
// z = wC·sin(πw/0.42)^0.5 ile bağlıyor, yani orta hatta yakın yerde eşleme
// aşırı doğrusal dışı: w=0.0125 gibi "ince" görünen bir aralık 0.48 metre
// genişliğe karşılık geliyor (ölçüldü). Kafes çubuklarının kalınlığı w
// cinsinden yazılamaz, metreden geri çözülmek zorunda.
function wIcin(x, z) {
    const P = G.kesitPar(x);
    let a = 0.00005, b = 0.9999;
    for (let i = 0; i < 40; i++) {
        const m = (a + b) / 2;
        if (G.kesitNokta(P, 1 - m)[0] > z) b = m; else a = m;
    }
    return (a + b) / 2;
}

// ===========================================================================
// 5. TEKERLEKLER
// ===========================================================================
// Grup deseni: grup rotation.x = π/2 ile yatırılıyor, rotation.y motora
// bırakılıyor. Sekizi de (dört teker + dört jant) modelGroup'un DOĞRUDAN
// çocuğu — motor ön olanları kendi direksiyon grubuna alırken `inner.add(sg)`
// yapıyor, daha derinde olsalardı yerlerinden sökülürlerdi.
//
// ⚠️ TEKER VE JANT AYRI KARDEŞ GRUPLAR, iç içe DEĞİL. Sözleşme
// (`_WHEELS.parts`) sekiz adı da sayıyor ve motor her birine ayrı ayrı
// `rotation.y = yol/yarıçap` yazıyor; jant tekerin çocuğu olsaydı dönüş iki
// kez uygulanırdı. İkisi de aynı konumda olduğu için birlikte dönüyorlar.
const RF_R = 0.300;   // run-flat destek halkasının yarıçapı (jantın üstünde)

function tekerlek(ad, jantAd, x, z) {
    const dis = (z > 0 ? 1 : -1);

    // ---- LASTİK grubu ----
    const g = new THREE.Group();
    g.name = ad;
    g.position.set(x, AKS_Y, z);
    g.rotation.x = Math.PI / 2;

    // Torusun kesiti daire olduğu için et kalınlığı genişliği de belirliyor;
    // 285/60 R18'in yanağı 171 mm, yani jantın %75'i → aks doğrultusunda
    // ölçekleniyor, kesit elipse dönüyor.
    const et = (R_TEKER - R_JANT) / 2;                 // 0.0855
    const lastik = new THREE.TorusGeometry(R_TEKER - et, et, 6, 20);
    lastik.rotateX(Math.PI / 2);
    lastik.scale(1, LASTIK_GEN / (et * 2), 1);
    // flatShading: 22 dilimde düz gölgeleme lastiğin sırtındaki takozları
    // ayırıyor — üçgen bedeli SIFIR (askeri kamyonda ölçüldü).
    g.add(mesh(lastik, C_LASTIK, { rough: 0.95, flat: true, name: ad + '_lastik' }));

    // RUN-FLAT DESTEK HALKASI: jant ile lastik arasında, iç yandan görünen
    // açık renkli kompozit bilezik. Zırhlı aracın en yakından okunan işareti.
    const rf = mesh(new THREE.CylinderGeometry(RF_R, RF_R, LASTIK_GEN * 0.52, 16, 1, true),
                    C_RUNFLAT, { metal: 0.18, rough: 0.72, name: ad + '_runflat' });
    rf.material.side = THREE.DoubleSide;
    g.add(rf);
    modelGroup.add(g);

    // ---- JANT grubu (aynı konumda ayrı kardeş) ----
    const j = new THREE.Group();
    j.name = jantAd;
    j.position.set(x, AKS_Y, z);
    j.rotation.x = Math.PI / 2;

    // Jant kovanı: AÇIK uçlu silindir.
    const kovan = mesh(new THREE.CylinderGeometry(R_JANT, R_JANT,
                                                  LASTIK_GEN * 0.88, 16, 1, true),
                       C_JANT_K, { metal: 0.30, rough: 0.52, name: jantAd + '_kovan' });
    kovan.material.side = THREE.DoubleSide;
    j.add(kovan);

    // AĞIR ÇELİK DİSK. Kollu döküm jant DEĞİL: zırhlı araçta jant, aracın
    // 4 tona çıkan ağırlığını ve run-flat halkasını taşıyan kalın çelik
    // disktir. Sekiz küçük havalandırma deliği şekle işleniyor (ayrı mesh
    // olsalardı dört tekerde otuz iki çizim çağrısı ederdi).
    const disk = new THREE.Shape();
    disk.absarc(0, 0, R_JANT * 0.97, 0, Math.PI * 2, false);
    for (let i = 0; i < 6; i++) {
        const a = i * Math.PI * 2 / 6 + Math.PI / 6;
        const delik = new THREE.Path();
        delik.absarc(Math.cos(a) * 0.148, Math.sin(a) * 0.148, 0.036,
                     0, Math.PI * 2, true);
        disk.holes.push(delik);
    }
    const diskGeo = new THREE.ExtrudeGeometry(disk, {
        depth: 0.026, bevelEnabled: false, curveSegments: 5
    });
    diskGeo.rotateX(-Math.PI / 2);
    diskGeo.translate(0, dis * (LASTIK_GEN * 0.40) - (dis > 0 ? 0 : 0.026), 0);
    j.add(mesh(diskGeo, C_JANT, { metal: 0.34, rough: 0.46, name: jantAd + '_disk' }));

    // Poyra kapağı: diskin ortasındaki iri göbek.
    const gobek = mesh(new THREE.CylinderGeometry(0.068, 0.076, 0.046, 9),
                       C_JANT_K, { metal: 0.32, rough: 0.50, name: jantAd + '_gobek' });
    gobek.position.y = dis * (LASTIK_GEN * 0.435);
    j.add(gobek);

    modelGroup.add(j);
}
// ⚠️ ADLANDIRMA SÖZLEŞMESİ (kayıtlı projeler buna bağlı): teker_1/2 = ÖN
// (direksiyon kırar), teker_3/4 = ARKA. jant_1..4 aynı sırada.
tekerlek('teker_1', 'jant_1', ON_X,   IZ_ON);
tekerlek('teker_2', 'jant_2', ON_X,  -IZ_ON);
tekerlek('teker_3', 'jant_3', ARKA_X,  IZ_ARKA);
tekerlek('teker_4', 'jant_4', ARKA_X, -IZ_ARKA);

// ===========================================================================
// 6. YÜZEYE OTURAN PANELLER — CAM KUŞAĞI VE KALIN DİREKLER
// ===========================================================================
// ⚠️ Sınırlar GÖZ KARARI DEĞİL. Kesit ölçüldü (kesit_olc.js, x=0):
//   bel (yB) 1.425 = v 0.545 = w 0.455 · çatı kenarı (yC) 1.895 = v 0.790 =
//   w 0.210. Cam bandı bu ikisinin ARASINDA, ama zırhlı araçta açıklık
//   küçültülmüş: alt kenar w 0.435 (y 1.463), üst kenar w 0.265 (y 1.790) →
//   AÇIKLIK 0.327 m. Camın üstünde 0.105 m boyalı çatı kuşağı kalıyor; seri
//   bir SUV'da orada yalnız 0.03 m ince bir çıta olurdu. Aradaki fark tam
//   olarak zırhın kapladığı yer.
const W_CAM_ALT = 0.435, W_CAM_UST = 0.265;

// ---------------------------------------------------------------------------
// ÖN CAM — YAMUĞU TERSTİ, ÖLÇÜLDÜ VE DÜZELTİLDİ (2026-09-04)
// ---------------------------------------------------------------------------
// İlk kurulum `[[1.076, 0.766, -0.107, 0.107]]` idi, yani `w` ALT VE ÜSTTE
// AYNI. `w` bir GENİŞLİK DEĞİL, kesitin çevresindeki parametre; karşılığı
// olan genişlik gövdenin o x'teki kesitinden geliyor. Gövde kaputa doğru
// daraldığı için (çatı kenarı yarı genişliği x=0.788'de 0.785, x=1.096'da
// 0.717 — ölçüldü) sabit-w bir bant camı ALTTA DAR ÜSTTE GENİŞ yapıyordu.
// `cam_on` mesh'i satır satır okundu (suv_cam_olc.js):
//     alt kenar (x 1.091) 1.223 m   ·   üst kenar (x 0.785) 1.336 m
// yani üst, alttan 113 mm GENİŞ. Gerçek araçta bunun TERSİ: ön cam en geniş
// yerini kaput birleşiminde (kokpit tabanı) alır, A direkleri yukarı doğru
// birbirine yaklaşır. Land Cruiser 200'de kaput sacı 1.45 m (modelde kaput
// üstü 1.434 ölçüldü), çatı 1.60 m (modelde 1.570) ve ön cam camı en geniş
// yerinde ~1.45 m — yani cam ALTTA kaput kenarına kadar gider, ÜSTTE tavan
// kenarından belirgin biçimde içeri çekilir.
// Yeni değerler METRE cinsinden yazılıyor ve `wIcin` ile w'ye çevriliyor:
//     alt 1.400 m (kaput üstü 1.434'ün 17 mm içinde — A direği ayağı)
//     üst 1.240 m (tavan kenarı 1.570'ten 165 mm içeride — kalın A direği)
// Yamuk bandı `yuzeyYama`nın konik biçimi taşıyor.
const ON_CAM_X_ALT = 1.076, ON_CAM_X_UST = 0.766;
const ON_CAM_Z_ALT = 0.700, ON_CAM_Z_UST = 0.620;   // YARI genişlikler
const ON_CAM_W_ALT = wIcin(ON_CAM_X_ALT, ON_CAM_Z_ALT);
const ON_CAM_W_UST = wIcin(ON_CAM_X_UST, ON_CAM_Z_UST);

// ÖN CAM: çatı kenarından çatı kenarına, orta hattın üstünden geçen bant.
// Kenarlarda gövde rengi kalıyor → A direği kendiliğinden çıkıyor, sonra
// üstüne koyu direk bandı biniyor.
// ⚠️ `disari` 0.030 (otomobilde 0.011): 40-50 mm'lik balistik cam gövde
// sacının belirgin biçimde DIŞINDA durur.
yuzeyYama(G, 'cam_on',
          [[ON_CAM_X_ALT, ON_CAM_X_UST, -ON_CAM_W_ALT, ON_CAM_W_ALT, 0,
            -ON_CAM_W_UST, ON_CAM_W_UST]],
          6, 12, 0.030, C_CAM, { metal: 0.30, rough: 0.22, katman: 1 });
// ⚠️ ARKA CAM YÜZEY YAMASI OLAMAZ — ÖLÇÜLDÜ VE DEĞİŞTİRİLDİ.
// İlk kurulumda `yuzeyYama` ile [[-2.185, -2.400, ±0.100]] bandı olarak
// yazılmıştı. Kutusu ölçüldü: y 1.829..1.952, yani 0.123 m'lik bir ŞERİT —
// bagaj camı değil, çatının arka kenarındaki bir çıta. Sebep: bagaj kapağı
// DİKEY, yani camı gövde kabuğunun üstünde değil UÇ KAPAĞININ üstünde
// duruyor; `w` parametresi ise kesitin ÇEVRESİNDE ilerliyor ve dikey bir
// yüzeyi tarayamıyor. (Otomobilin arka camı gerçekten eğik bir yüzeydi,
// orada yama doğruydu.) Doğrusu kapak üstüne oturan bir `yuzParca`.
// Koordinatlar ölçüldü (kesit_olc.js --z -2.475): kapak y 0.483..1.548;
// yarı genişlik y=1.10'da 0.762 · 1.25'te 0.722 · 1.35'te 0.683 ·
// 1.45'te 0.642. Cam bu zarfın içinde kalıyor.
yuzParca('cam_arka_cerceve',
         [[-0.722, 1.022], [0.722, 1.022], [0.682, 1.300], [0.622, 1.488],
          [-0.622, 1.488], [-0.682, 1.300]],
         0.030, -2.492, 0.052, C_DIREK, { metal: 0.16, rough: 0.55 });
yuzParca('cam_arka',
         [[-0.700, 1.040], [0.700, 1.040], [0.660, 1.300], [0.600, 1.470],
          [-0.600, 1.470], [-0.660, 1.300]],
         0.026, -2.504, 0.050, C_CAM, { metal: 0.30, rough: 0.22 });
// ARKA CAMIN KAFESİ. ⚠️ Burada `yuzeyYama` DEĞİL kutu kullanılıyor: cam
// gövde kabuğunun değil DÜZ UÇ KAPAĞININ üstünde duruyor (bir üstteki nota
// bak), yani yüzey parametresi yok. Camın dış yüzü x = -2.504; çubuklar
// -2.529..-2.503 arasında, yani 25 mm önünde. Kutunun en arka noktası
// reflektör (-2.534) olduğu için ölçü kutusu BÜYÜMÜYOR.
// Altı dikey (göz 0.20 m) + bir yatay (iki sıra, 0.21 m) → yine kare göz.
kutular('kafes_arka', [
    [-2.516, 1.255,  0.100, 0.026, 0.412, 0.024],
    [-2.516, 1.255, -0.100, 0.026, 0.412, 0.024],
    [-2.516, 1.255,  0.300, 0.026, 0.412, 0.024],
    [-2.516, 1.255, -0.300, 0.026, 0.412, 0.024],
    [-2.516, 1.255,  0.500, 0.026, 0.412, 0.024],
    [-2.516, 1.255, -0.500, 0.026, 0.412, 0.024],
    [-2.516, 1.255,  0.000, 0.026, 0.024, 1.302]
], C_KAFES, { metal: 0.34, rough: 0.55 });

// YAN CAMLAR. Kapı bölünmesi: ön kapı 0.640..-0.335, arka kapı -0.335..-1.285,
// arkasında çeyrek cam. Direkler bu sınırların üstüne biniyor.
[1, -1].forEach(function (s, i) {
    yuzeyYama(G, 'cam_yan_' + (i * 2 + 1),
              [[0.606, -0.292, s * W_CAM_ALT, s * W_CAM_UST]], 5, 8, 0.028,
              C_CAM, { metal: 0.30, rough: 0.22, katman: 1 });
    yuzeyYama(G, 'cam_yan_' + (i * 2 + 2),
              [[-0.420, -1.228, s * W_CAM_ALT, s * W_CAM_UST]], 5, 8, 0.028,
              C_CAM, { metal: 0.30, rough: 0.22, katman: 1 });
    // Çeyrek cam: D direğinin önünde, arkaya doğru daralan pencere.
    yuzeyYama(G, 'cam_ucgen_' + (i + 1),
              [[-1.360, -1.952, s * W_CAM_ALT, s * 0.292]], 5, 8, 0.028,
              C_CAM, { metal: 0.30, rough: 0.22, katman: 1 });

    // KALIN DİREKLER — dört direk TEK mesh (dört bant). Zırhlı araçta A/B/C/D
    // direkleri hem daha geniştir hem de gövde renginde değil koyu kalır.
    // ⚠️ nx=2 / nw=10: bandın UZUN kenarı w yönünde (direk dikey bir şerit).
    // Ters verilseydi şerit gövdenin kavisini takip edemeyip yüzeyin içine
    // girer ve kaybolurdu (otobüste ölçülmüştü).
    yuzeyYama(G, 'direk_' + (i + 1), [
        [ 0.762,  0.606, s * 0.451, s * 0.253],   // A direği (156 mm)
        [-0.280, -0.432, s * 0.451, s * 0.253],   // B direği (152 mm)
        [-1.216, -1.372, s * 0.451, s * 0.253],   // C direği (156 mm)
        [-1.940, -2.160, s * 0.451, s * 0.248]    // D direği (220 mm)
    ], 2, 10, 0.026, C_DIREK, { metal: 0.16, rough: 0.55, katman: 2 });

    // BEL KUŞAĞI: camın dibindeki koyu conta şeridi. Camın alt kenarını
    // çiziyor; olmasaydı cam gövdeye kaynamış gibi dururdu.
    yuzeyYama(G, 'bel_kusak_' + (i + 1),
              [[0.700, -2.160, s * 0.462, s * 0.442]], 20, 1, 0.030, C_DERZ,
              { metal: 0.12, rough: 0.70, katman: 3 });
});

// ---- CAM KORUMA KAFESİ ("# ızgarası") -------------------------------------
// ⚠️ İKİ ADAY VARDI, BİRİ ÖLÇÜMLE SEÇİLDİ.
//   (a) BÖLMELİ CAM: camı direk renginde ince çıtalarla bölmek. Gerçekçi
//       (zırhlı kapıda cam çoğu kez iki parçadır) ama çıtalar camla aynı
//       koyu ailede kalıyor; küçük ölçekte hiç kontrast üretmiyor, cam yine
//       tek bir siyah yarık olarak okunuyor.
//   (b) KORUMA KAFESİ: camın 14 mm önünde duran çelik çubuk ızgarası.
//       Çubuk açık (#5a626c), cam çok koyu (#10151b) — kontrast paletteki en
//       yükseklerden biri, yani ızgara küçülünce bile camın ORTALAMA TONUNU
//       yukarı çekiyor ve siyah yarık gri bir şeride dönüyor.
// (b) seçildi ve `suv_kafes_olcek.py` ile 32/24/16 piksellik gerçek kutu
// genişliğinde ölçüldü. Gerçek dayanağı da var: çatışma bölgesinde kullanılan
// zırhlı Land Cruiser'lara ve jandarma/polis zırhlılarına menteşeli tel/çubuk
// pencere koruması takılıyor; bu, aracın "koruma aracı" olduğunu uzaktan
// söyleyen tek işarettir.
//
// ⚠️ ÇUBUKLAR w CİNSİNDEN YAZILAMAZ. `w` kesitin çevresindeki parametre ve
// genişliğe eşlemesi doğrusal değil (çatının tepesinde w 0.0125 → 0.48 m).
// Ön camın çubukları bu yüzden METREDEN `wIcin` ile geri çözülüyor. Yan
// camlarda ise cam kuşağı zaten w'de düz bir şerit, orada sabit adım doğru.
//
// ⚠️ TEK ÇAĞRIDA TEK (nx, nw) ÇİFTİ VAR. Çubuklar iki mesh'e ayrıldı:
//   kafes_cevre  — kesitin ÇEVRESİNDE uzanan çubuklar (yan camda DİKEY, ön
//                  camda ENİNE): nx=1, nw=12.
//   kafes_boyuna — x ekseni BOYUNCA uzanan çubuklar (yan camda YATAY, ön
//                  camda DİKEY): nx=6, nw=1.
// Ters verilseydi şerit gövdenin kavisini takip edemeyip camın içine girer ve
// kaybolurdu (otobüste ölçülmüştü). Bölüntü camınkinden İNCE tutuldu (yan cam
// nw=8 iken kafes 12): kaba bölünen kiriş, ince bölünen camın kirişinin
// altında kalır.
const KAFES_ET = 0.024;               // 24 mm çelik lama
const KE = KAFES_ET / 2;
// 24 mm'nin YAN YÜZEYDEKİ w karşılığı: cam kuşağı w'de 0.435-0.265 = 0.170
// ve açıklığı 0.327 m → 1 w ≈ 1.92 m.
const KAFES_DW = KE / 1.924;
// [x1, x2, wAlt, wUst, aradaki dikey çubuk sayısı]. Göz kararı değil: hücre
// kenarı ~0.18 m hedeflendi, cam açıklığı 0.327 m ve tek yatay çubukla iki
// sıra → 0.15 m. Hücre kabaca KARE, "#" böyle okunuyor.
const KAFES_PENCERE = [
    [ 0.606, -0.292, W_CAM_ALT, W_CAM_UST, 4],   // ön kapı  (0.898 m → 5 göz)
    [-0.420, -1.228, W_CAM_ALT, W_CAM_UST, 3],   // arka kapı (0.808 m → 4 göz)
    [-1.360, -1.952, W_CAM_ALT, 0.292,     2]    // çeyrek cam (0.592 m → 3 göz)
];
const KAFES_CEVRE = [], KAFES_BOYUNA = [];
[1, -1].forEach(function (s) {
    KAFES_PENCERE.forEach(function (p) {
        const x1 = p[0], x2 = p[1], n = p[4] + 1;
        for (let k = 1; k < n; k++) {
            const xk = x1 + (x2 - x1) * k / n;
            KAFES_CEVRE.push([xk + KE, xk - KE, s * p[2], s * p[3]]);
        }
        const wm = (p[2] + p[3]) / 2;
        KAFES_BOYUNA.push([x1, x2, s * (wm + KAFES_DW), s * (wm - KAFES_DW)]);
    });
});
// ÖN CAM: beş boyuna çubuk (orta hat + ikişer yan) → altı göz; iki enine
// çubuk → üç sıra. Cam 1.40 x 0.65 m, göz ≈ 0.23 x 0.22 m.
[-0.667, -0.333, 0, 0.333, 0.667].forEach(function (f) {
    const uc = function (x, z) {
        const zc = Math.abs(f) * z, yan = f < 0 ? -1 : 1;
        return f === 0 ? [-wIcin(x, KE), wIcin(x, KE)]
                       : [yan * wIcin(x, zc - KE), yan * wIcin(x, zc + KE)];
    };
    const a = uc(ON_CAM_X_ALT, ON_CAM_Z_ALT), b = uc(ON_CAM_X_UST, ON_CAM_Z_UST);
    KAFES_BOYUNA.push([ON_CAM_X_ALT, ON_CAM_X_UST, a[0], a[1], 0, b[0], b[1]]);
});
[0.973, 0.870].forEach(function (xk) {
    const u = (xk - ON_CAM_X_ALT) / (ON_CAM_X_UST - ON_CAM_X_ALT);
    const w = ON_CAM_W_ALT + (ON_CAM_W_UST - ON_CAM_W_ALT) * u;
    KAFES_CEVRE.push([xk + KE, xk - KE, -w, w]);
});
// ⚠️ `disari` 0.042: cam 0.028-0.030'da, kafes onun 12-14 mm ÖNÜNDE. Kafes
// camın üstüne YAPIŞMIYOR — gerçek koruma ızgarası da gövdeden ayrık durur ve
// aradaki gölge çizgisi ızgarayı yakın planda görünür kılan şey.
// `katman: 5` cam kuşağındaki en dıştaki panel; derinlik kavgası ölçüldü.
yuzeyYama(G, 'kafes_cevre', KAFES_CEVRE, 1, 12, 0.042, C_KAFES,
          { metal: 0.34, rough: 0.55, katman: 5 });
yuzeyYama(G, 'kafes_boyuna', KAFES_BOYUNA, 6, 1, 0.042, C_KAFES,
          { metal: 0.34, rough: 0.55, katman: 5 });

// ---- KABARIK KAPI KASALARI ------------------------------------------------
// ⚠️ ZIRHLI SUV'UN EN AYIRT EDİCİ YÜZEYİ. Zırh plakası kapı sacının İÇİNE
// giriyor ve kapı gövde yüzeyinden 16 mm dışarı taşıyor. Ayrı panel olarak
// yazıldı ki kenarında gerçek bir ışık çizgisi oluşsun; kesitin içine
// işlenseydi (otomobilin karakter çizgisi gibi) yalnız yumuşak bir kabartı
// olurdu — burada istenen KESKİN kenar.
// Bu paneller BİRİNCİL RENK alıyor (_TINT.parts): gövdeyle aynı boyada.
[1, -1].forEach(function (s, i) {
    yuzeyYama(G, 'kapi_kasa_' + (i * 2 + 1),
              [[0.616, -0.352, s * 0.474, s * 0.648]], 10, 4, 0.016, C_GOVDE,
              { metal: 0.40, rough: 0.52, katman: 1 });
    yuzeyYama(G, 'kapi_kasa_' + (i * 2 + 2),
              [[-0.318, -1.268, s * 0.474, s * 0.648]], 10, 4, 0.016, C_GOVDE,
              { metal: 0.40, rough: 0.52, katman: 1 });
});

// ---- KAPI DERZİ / CONTA ÇİZGİSİ -------------------------------------------
// ⚠️ MENTEŞE GÖRÜNMÜYOR. Zırhlı kapıda menteşe kasanın içine alınır (INKAS
// "takviyeli kapı menteşeleri" maddesi); dışarıda yalnız contanın ince
// çizgisi kalır. Dikey ve yatay derzler AYRI MESH: `nx`/`nw` bandın uzun
// kenarına göre seçilmek zorunda ve `yuzeyYama` tek çağrıda tek çift alıyor.
[1, -1].forEach(function (s, i) {
    yuzeyYama(G, 'kapi_derz_dik_' + (i + 1), [
        [ 0.646,  0.634, s * 0.700, s * 0.452],
        [-0.329, -0.341, s * 0.700, s * 0.452],
        [-1.279, -1.291, s * 0.700, s * 0.452]
    ], 1, 10, 0.019, C_DERZ, { metal: 0.12, rough: 0.72, katman: 4 });
    yuzeyYama(G, 'kapi_derz_yatay_' + (i + 1),
              [[0.640, -1.285, s * 0.660, s * 0.652]], 22, 1, 0.019, C_DERZ,
              { metal: 0.12, rough: 0.72, katman: 4 });
});

// ===========================================================================
// 7. ÇAMURLUK KEMERİ: FLARE + DAVLUMBAZ
// ===========================================================================
// ⚠️ Kemer ağzının kenarı YÜZEY YAMASI OLAMAZ: kesitin v ∈ [0, VA] bölümü
// ağzın AŞAĞI bakan tavanıdır, dışarıdan hiç görünmez (otobüste ölçüldü).
// Doğrusu gövdenin DIŞINDA duran gerçek bir halka dilimi.
// Kemer dudağı yarıçapı 0.500 (AKS_Y 0.400 + KEMER_R); flare 0.498'den
// 0.586'ya, yani dudağın 2 mm altından başlayıp 86 mm üstüne taşıyor.
//
// ⚠️ FLARE GÖVDENİN YANAĞINI TAKİP EDER — ÖLÇÜLDÜ VE DEĞİŞTİRİLDİ.
// Eski hâli z'de SABİT bir dilimdi (iç yüz 0.942, dış yüz 0.984) ve "gövdenin
// en geniş yeri 0.985, flare tam hizasında bitiyor" diye yazılmıştı. Ama
// 0.985 yalnız OMUZ hizasındaki değer: gövdenin yarı genişliği kemer yayı
// boyunca 0.917 ile 0.985 arasında değişiyor. Ölçüldü (suv_camurluk_probu.js,
// aks başına ~340 örnek):
//   * yayın TEPESİNDE flare'in dış yüzü gövdenin 0.4-1.0 mm İÇİNDE. İki yüzey
//     neredeyse çakışık; derinlik tamponu hangisinin önde olduğuna kareden
//     kareye farklı karar veriyor ve yüzey TİTRİYOR. Furkan'ın gördüğü bu.
//   * örneklerin %89.7'sinde gövde yüzeyi dilimi ORTASINDAN kesiyor: flare'in
//     bir kısmı gömülü, bir kısmı dışarıda, kesişme çizgisi yüzeyde geziniyor.
//   * geo_kesisim.js: camurluk gövdeye 42.90 mm giriyor, gövde de flare'in
//     içine 20.35 mm.
// ⚠️ `material.polygonOffset` BURADA YANLIŞ ARAÇ. O, AYNI yüzeye oturan iki
// PANEL için (trende cam bandı, burada kafes/cam kuşağı). Burada birbirini
// KESEN iki katı var; ötelemek kesişme çizgisini kaydırır, kaldırmaz.
//
// YENİ HÂLİ: kesiti (yarıçap, gövdeden dışarı) düzleminde yazılmış KAPALI bir
// dörtgen, kemer yayı boyunca SÜPÜRÜLÜYOR. Her örnekte gövdenin o noktadaki
// yarı genişliği okunup z = ±(gövde + öteleme) yazılıyor: flare her yerde
// gövdenin 30 mm dışında duruyor, iç dudağı 12 mm gömülü. Ne çakışan yüzey
// kalıyor ne de gezinen kesişme çizgisi. En dış nokta 0.985 + 0.030 = 1.015;
// aynalar 1.079'da olduğu için kutu DEĞİŞMİYOR.
// ⚠️ KEMER AĞZININ İÇİNDE GÖVDE YOKTUR: kesitin v=0 noktası ağzın aşağı bakan
// tavanı ve orada yarı genişlik SIFIR (otobüste de ölçülmüştü). Ağzın altına
// düşen örnekler eşiğe kırpılıyor; kırpılmasaydı flare'in uçları orta hatta
// doğru içeri çökerdi. İlk ölçümde tam bu oldu, "gövde 0.0000" çıktı.
// ⚠️ SARIM İŞARETLİ HACİMLE DOĞRULANIYOR, göz kararıyla değil: süpürme yönü
// ile kesit yönü ters düşerse bütün üçgenler içe bakar ve parça arka yüz
// ayıklamasına takılıp KAYBOLUR (trenin ray süpürmesinde ölçülmüştü).
// ⚠️ `flat: true` — kesitin dört köşesi KESKİN kalsın diye. Yumuşak
// gölgelemede dörtgenin köşeleri ortalanıp flare bir kabartıya dönüşüyor.

// Gövdenin (x, y) noktasındaki yarı genişliği. Kemer ağzının içinde kesit
// yoktur; oradaki örnekler ağzın dudağına (yA) kırpılıyor.
function govdeYari(x, y) {
    const P = G.kesitPar(x);
    return G.kesitNokta(P, G.vYukseklik(x, Math.max(y, P.yA + 0.002)))[0];
}

// Kesit: [yarıçap, gövdeden dışarı öteleme]. Kapalı dörtgen — alt kenar
// (−0.012) gövdenin içinde, üst kenar (+0.030) dışında.
const FLARE_KESIT = [[0.498, -0.012], [0.514, 0.030],
                     [0.570,  0.030], [0.586, -0.012]];
const FLARE_A0 = -0.06, FLARE_A1 = Math.PI + 0.06, FLARE_N = 24;

AKS_X.forEach(function (ax, k) {
    [1, -1].forEach(function (s, i) {
        const M = FLARE_KESIT.length, P = [], IDX = [];
        for (let j = 0; j <= FLARE_N; j++) {
            const th = FLARE_A0 + (FLARE_A1 - FLARE_A0) * j / FLARE_N;
            const co = Math.cos(th), si = Math.sin(th);
            for (let m = 0; m < M; m++) {
                const x = ax + FLARE_KESIT[m][0] * co;
                const y = AKS_Y + FLARE_KESIT[m][0] * si;
                P.push(x, y, s * (govdeYari(x, y) + FLARE_KESIT[m][1]));
            }
        }
        for (let j = 0; j < FLARE_N; j++)
            for (let m = 0; m < M; m++) {
                const m2 = (m + 1) % M;
                const a = j * M + m, b = j * M + m2;
                const c = (j + 1) * M + m, d = (j + 1) * M + m2;
                IDX.push(a, c, d, a, d, b);
            }
        const son = FLARE_N * M;                       // uç kapakları
        for (let m = 1; m + 1 < M; m++) {
            IDX.push(0, m, m + 1);
            IDX.push(son, son + m + 1, son + m);
        }
        let hacim = 0;
        for (let t = 0; t < IDX.length; t += 3) {
            const a = IDX[t] * 3, b = IDX[t + 1] * 3, c = IDX[t + 2] * 3;
            hacim += (P[a] * (P[b + 1] * P[c + 2] - P[b + 2] * P[c + 1])
                    - P[a + 1] * (P[b] * P[c + 2] - P[b + 2] * P[c])
                    + P[a + 2] * (P[b] * P[c + 1] - P[b + 1] * P[c])) / 6;
        }
        if (hacim < 0)
            for (let t = 0; t < IDX.length; t += 3) {
                const g = IDX[t + 1]; IDX[t + 1] = IDX[t + 2]; IDX[t + 2] = g;
            }
        const geo = new THREE.BufferGeometry();
        geo.setAttribute('position', new THREE.Float32BufferAttribute(P, 3));
        geo.setIndex(IDX);
        geo.computeVertexNormals();
        modelGroup.add(mesh(geo, C_ZIRH, { metal: 0.20, rough: 0.72, flat: true,
                                           name: 'camurluk_' + (k * 2 + i + 1) }));
    });
    // ---- DAVLUMBAZ (kemerin içi) ----
    // ⚠️ Yay lastiğin İÇİNDE değil, lastikten HEMEN DIŞARIDA (0.408..0.494;
    // lastik 0.400, kemer dudağı 0.500). İçeride kalsaydı lastikle dudak
    // arasındaki 100 mm'lik boşluk açık kalır, kemer ağzından öbür tarafın
    // zemini görünürdü. ⚠️ Halka dilimi EXTRUDE ediliyor, kısmi silindir
    // DEĞİL: kalınlıksız kabuk aks doğrultusundan bakınca kayboluyor.
    [1, -1].forEach(function (s, i) {
        const sh = new THREE.Shape();
        sh.absarc(0, 0, 0.494, -0.12, Math.PI + 0.12, false);
        sh.absarc(0, 0, 0.408, Math.PI + 0.12, -0.12, true);
        const geo = new THREE.ExtrudeGeometry(sh, {
            depth: 0.640, bevelEnabled: false, curveSegments: 8
        });
        geo.translate(0, 0, s > 0 ? 0.330 : -0.970);
        geo.translate(ax, AKS_Y, 0);
        modelGroup.add(mesh(geo, C_DIP, { metal: 0.08, rough: 0.94,
                                          name: 'davlumbaz_' + (k * 2 + i + 1) }));
    });
});

// ---- MARŞPİYEL / KAYA KIZAĞI ----------------------------------------------
// Zırhlı SUV'da yan basamak dekoratif değil YAPISAL: gövdenin altındaki
// takviye kirişine bağlanan bir kızak. İki mesh (yan başına biri), her biri
// kızak + iki bağlantı ayağı.
[1, -1].forEach(function (s, i) {
    kutular('kaya_kizak_' + (i + 1), [
        [ 0.120, 0.436, s * 0.912, 2.180, 0.072, 0.150],
        [ 0.880, 0.492, s * 0.840, 0.090, 0.090, 0.130],
        [-0.640, 0.492, s * 0.840, 0.090, 0.090, 0.130]
    ], C_ZIRH, { metal: 0.22, rough: 0.68 });
});

// ---- TABAN ZIRHI ----------------------------------------------------------
// Düşük bakış açısında kemer ağzından altı görünmesin diye; aynı zamanda
// The Armored Group'un "blast-resistant flooring / skid plates" maddesi.
// Alt yüzü 0.278'de → doruk açıklığı 278 mm (seri 225 + 45 yükseltme = 270).
// ⚠️ PLAKA TEKERLERİN VE JANTLARIN İÇİNDEN GEÇİYORDU — ÖLÇÜLDÜ VE DÜZELTİLDİ.
// Eski hâli tek kutuydu (3.920 x 0.048 x 1.520, merkez 0.100/0.302/0), yani
// z ±0.760. Lastiğin iç yüzü ön 0.820−0.1425 = 0.6775, arka 0.6750; jant
// kovanının iç yüzü ön 0.820−0.1254 = 0.6946. Plaka dördünü de kesiyordu ve
// batma 11.60–13.63 mm ölçüldü (dört teker + dört jant). Plakanın yüksekliği
// (y 0.278..0.326) tam jantın orta bölgesine denk geliyor.
//
// ÇÖZÜM motokaravan/otomobil ile aynı: dikdörtgen yerine ÇENTİKLİ plan
// konturu, tek mesh, ad `taban` değişmedi.
//   * çentiksiz yarı genişlik 0.760 (eskisiyle aynı)
//   * çentikte 0.650 → arka lastiğin iç yüzüne 25.0 mm, jant kovanına
//     42.1 mm açıklık
//   * çentiğin akstan yarım boyu 0.500 = kemer dudağının yarıçapı. Lastik
//     plakanın yüksekliğinde akstan en fazla ±0.381 uzanıyor, yani 119 mm pay.
//   * ÖN ÇENTİK plakanın ucuna kadar açık: ön aks 1.545, çentik 1.045'te
//     başlıyor ve plaka 2.060'ta bitiyor — kapatılsaydı 15 mm'lik bir dil
//     kalırdı.
// ⚠️ Çentik davlumbaza/çamurluğa değmiyor: davlumbazın en alçak noktası
// y=0.341, çamurluğunki 0.365, plakanın üstü 0.326.
// ⚠️ ŞEKİL (x,z) düzleminde; `rotateX(-π/2)` şeklin y'sini model −z'sine,
// extrude derinliğini model +y'sine çeviriyor. Kontur z'de simetrik.
(function () {
    const X1 = -1.860, X2 = 2.060;  // plakanın x uçları (eskisiyle aynı)
    const W = 0.760;                // çentiksiz yarı genişlik (eskisiyle aynı)
    const D = 0.650;                // çentikte yarı genişlik
    const C = 0.500;                // çentiğin akstan yarım boyu
    const A1 = ARKA_X - C, B1 = ARKA_X + C;   // arka teker çentiği
    const A2 = ON_X - C;                      // ön çentik plakanın ucuna kadar
    const KON = [
        [X1, -W], [A1, -W], [A1, -D], [B1, -D], [B1, -W],
        [A2, -W], [A2, -D], [X2, -D],
        [X2,  D], [A2,  D], [A2,  W], [B1,  W],
        [B1,  D], [A1,  D], [A1,  W], [X1,  W]
    ];
    const sh = new THREE.Shape();
    sh.moveTo(KON[0][0], KON[0][1]);
    for (let i = 1; i < KON.length; i++) sh.lineTo(KON[i][0], KON[i][1]);
    sh.closePath();
    const geo = new THREE.ExtrudeGeometry(sh, { depth: 0.048, bevelEnabled: false });
    geo.rotateX(-Math.PI / 2);
    geo.translate(0, 0.278, 0);
    modelGroup.add(mesh(geo, C_DIP, { metal: 0.10, rough: 0.94, name: 'taban' }));
})();

// ---- KAPUT DERZİ ----------------------------------------------------------
// Kaputun iki YAN ayrım çizgisi + ön cam dibindeki ENİNE derz. Olmadan
// kaput ile çamurluk arasındaki geçiş tek bir yumuşak kütle gibi okunuyordu
// (yakın plan çiziminde görüldü).
// ⚠️ İKİ AYRI ÇAĞRI, tek çağrı DEĞİL: `nx` bandın x, `nw` ise w yönündeki
// bölüntüsü ve UZUN kenara çok verilmek zorunda. Yan derzler x'te 1.14 m ama
// w'de 0.010; enine derz tam tersi. Tek çağrıda birinin uzun kenarı iki
// parçaya bölünür ve şerit gövdenin kavisinin içine girip KAYBOLUR
// (otobüste ölçülmüştü).
[1, -1].forEach(function (s, i) {
    yuzeyYama(G, 'kaput_derz_yan_' + (i + 1),
              [[1.180, onX(2.330), s * 0.196, s * 0.208]], 16, 1, 0.005, C_DERZ,
              { metal: 0.10, rough: 0.80, katman: 2 });
});
yuzeyYama(G, 'kaput_derz_on', [[1.104, 1.120, -0.200, 0.200]], 1, 12, 0.005,
          C_DERZ, { metal: 0.10, rough: 0.80, katman: 2 });

// ===========================================================================
// 8. ÖN YÜZ
// ===========================================================================
// ⚠️ KOORDİNATLAR ÖLÇÜLDÜ (kesit_olc.js --z 2.475). Kapak y 0.528..1.220
// arasında; yarı genişlik y=0.54'te 0.836 · 0.68'de 0.848 · 0.76'da 0.849
// (en geniş) · 0.92'de 0.772 · 1.00'da 0.682 · 1.08'de 0.621 · 1.14'te 0.591.
// Her parça bu zarfın İÇİNDE kalıyor ki etrafında boyalı kenar görünsün.
// ⚠️ `yuzParca` geometriyi `x`ten `x+derinlik`e uzatır; her parçanın
// `x+derinlik`i kapağı 5-30 mm geçiyor, yoksa parça havada kalır.
//
// LAND CRUISER 200'ÜN YÜZÜ: ÜSTTE tek parça geniş ızgara ve onun iki yanında
// yatay farlar (hepsi aynı hizada, yüzü boydan boya kesen tek bir şerit);
// ALTTA kalın, düz tampon. Zırhlı yapımda tampon takviyeli ve içinde iki
// çeki halkası var.

// TAKVİYELİ ÖN TAMPON — İKİNCİL RENK (_TINT.parts2)
yuzParcaOn('tampon_on',
         [[-0.792, 0.542], [0.792, 0.542], [0.834, 0.640], [0.834, 0.836],
          [0.756, 0.936], [-0.756, 0.936], [-0.834, 0.836], [-0.834, 0.640]],
         0.045, 2.408, 0.082, C_ZIRH, { metal: 0.22, rough: 0.66 });
// Alt kayar zırh: tamponun altından öne çıkan koruma sacı.
yuzParcaOn('alt_koruma',
         [[-0.442, 0.452], [0.442, 0.452], [0.462, 0.528], [-0.462, 0.528]],
         0.030, 2.330, 0.132, C_METAL, { metal: 0.42, rough: 0.46 });
// IZGARA: tek parça geniş kovan + koyu iç + iki yatay çıta.
yuzParcaOn('izgara_cerceve',
         [[-0.398, 0.962], [0.398, 0.962], [0.398, 1.152], [-0.398, 1.152]],
         0.030, 2.396, 0.092, C_KOYU_M, { metal: 0.38, rough: 0.40 });
yuzParcaOn('izgara',
         [[-0.372, 0.980], [0.372, 0.980], [0.372, 1.134], [-0.372, 1.134]],
         0.022, 2.406, 0.086, '#111418', { metal: 0.28, rough: 0.66, flat: true });
yuzParcaOn('izgara_cita_1',
         [[-0.376, 1.020], [0.376, 1.020], [0.376, 1.048], [-0.376, 1.048]],
         0.010, 2.446, 0.048, '#5d646d', { metal: 0.40, rough: 0.38 });
yuzParcaOn('izgara_cita_2',
         [[-0.376, 1.076], [0.376, 1.076], [0.376, 1.104], [-0.376, 1.104]],
         0.010, 2.446, 0.048, '#5d646d', { metal: 0.40, rough: 0.38 });
// FARLAR: ızgaranın iki yanından çamurluk köşesine kadar yatay bloklar.
// Dış üst köşe kapağın zarfına göre İÇERİ çekildi (y=1.09'da zarf 0.615).
[1, -1].forEach(function (s, i) {
    yuzParcaOn('far_' + (i + 1),
             [[s * 0.408, 0.968], [s * 0.642, 0.982], [s * 0.604, 1.086],
              [s * 0.408, 1.120]],
             0.022, 2.388, 0.100, C_FAR_IC, { metal: 0.46, rough: 0.34 });
    yuzParcaOn('far_lens_' + (i + 1),
             [[s * 0.424, 0.984], [s * 0.618, 0.996], [s * 0.586, 1.072],
              [s * 0.424, 1.100]],
             0.018, 2.424, 0.070, C_FAR, { metal: 0.10, rough: 0.12 });
    // Sis / arazi lambaları — tamponun içinde.
    yuzParcaOn('sis_' + (i + 1),
             [[s * 0.560, 0.664], [s * 0.726, 0.664], [s * 0.726, 0.768],
              [s * 0.560, 0.768]],
             0.024, 2.452, 0.044, '#4a515a', { metal: 0.28, rough: 0.42 });
});
yuzParcaOn('plaka_on', [[-0.166, 0.796], [0.166, 0.796], [0.166, 0.912], [-0.166, 0.912]],
         0.010, 2.470, 0.028, C_PLAKA, { metal: 0.05, rough: 0.86 });
// ÇEKİ HALKALARI (ön). Zırhlı araç 4 tona çıktığı için gerçek çeki noktası
// tamponun içinden geçen kirişe bağlıdır ve dışarıda halka olarak görünür.
[1, -1].forEach(function (s, i) {
    const t = new THREE.TorusGeometry(0.052, 0.017, 4, 9);
    t.rotateY(Math.PI / 2);
    const m = mesh(t, C_METAL, { metal: 0.44, rough: 0.42,
                                 name: 'ceki_on_' + (i + 1) });
    m.position.set(onX(2.478), 0.628, s * 0.470);
    modelGroup.add(m);
});

// ===========================================================================
// 9. ARKA YÜZ
// ===========================================================================
// ⚠️ ÖLÇÜLDÜ (kesit_olc.js --z -2.475). Kapak y 0.490..1.541; yarı genişlik
// y=0.58'de 0.865 · 0.76'da 0.867 (en geniş) · 0.90'da 0.846 · 1.05'te 0.774
// · 1.20'de 0.723 · 1.35'te 0.672 · 1.45'te 0.631.
// Land Cruiser'ın stopları DİKEY ve köşelerde: bagaj kapağının yanından
// tampona kadar iniyorlar. Dikeyliği kapağın zarfına uyacak biçimde
// daraltıldı, yoksa üst köşeler gövdenin dışında kalırdı.
yuzParca('tampon_arka',
         [[-0.796, 0.500], [0.796, 0.500], [0.850, 0.596], [0.850, 0.716],
          [0.784, 0.782], [-0.784, 0.782], [-0.850, 0.716], [-0.850, 0.596]],
         0.045, -2.528, 0.080, C_ZIRH, { metal: 0.22, rough: 0.66 });
[1, -1].forEach(function (s, i) {
    yuzParca('stop_' + (i + 1),
             [[s * 0.572, 0.930], [s * 0.826, 0.930], [s * 0.776, 1.034],
              [s * 0.712, 1.182], [s * 0.636, 1.300], [s * 0.538, 1.300]],
             0.026, -2.502, 0.048, C_STOP, { metal: 0.24, rough: 0.24 });
    yuzParca('stop_ic_' + (i + 1),
             [[s * 0.596, 0.954], [s * 0.798, 0.954], [s * 0.752, 1.040],
              [s * 0.692, 1.166], [s * 0.626, 1.276], [s * 0.560, 1.276]],
             0.020, -2.516, 0.040, C_STOP_K, { metal: 0.10, rough: 0.36 });
    yuzParca('reflektor_' + (i + 1),
             [[s * 0.620, 0.578], [s * 0.762, 0.578], [s * 0.762, 0.652],
              [s * 0.620, 0.652]],
             0.018, -2.534, 0.030, '#8c2a24', { metal: 0.20, rough: 0.36 });
    const t = new THREE.TorusGeometry(0.048, 0.016, 4, 9);
    t.rotateY(Math.PI / 2);
    const m = mesh(t, C_METAL, { metal: 0.44, rough: 0.42,
                                 name: 'ceki_arka_' + (i + 1) });
    m.position.set(-2.520, 0.574, s * 0.452);
    modelGroup.add(m);
});
yuzParca('plaka_arka', [[-0.192, 0.826], [0.192, 0.826], [0.192, 0.948], [-0.192, 0.948]],
         0.010, -2.508, 0.030, C_PLAKA, { metal: 0.05, rough: 0.86 });
// Egzoz: tamponun altında, tek çıkış.
(function () {
    const e = mesh(new THREE.CylinderGeometry(0.042, 0.042, 0.130, 10, 1, true),
                   '#33383e', { metal: 0.30, rough: 0.55, name: 'egzoz' });
    e.material.side = THREE.DoubleSide;
    e.rotation.z = Math.PI / 2;
    e.position.set(-2.492, 0.474, -0.600);
    modelGroup.add(e);
})();

// ===========================================================================
// 10. TAVAN GRUBU — port-bagaj, far grubu, tavan kapağı, antenler
// ===========================================================================
// ⚠️ ANTENLER KISA (0.28 m). Eski modelde 0.90 m'lik iki whip anten vardı ve
// KUTUYU ŞİŞİRİYORDU: 4.59 m'lik araçta yükseklik 2.955 ölçülmüştü. Ölçek
// `maxHoriz` üzerinden gittiği için bu, haritada aracın üstünde bomboş bir
// yükseklik payı demek. Burada tepe 2.205'te kalıyor (kutu oranı 2.21/5.05).
// ⚠️ FAR GRUBUNUN LENSİ BEYAZ DEĞİL (#aeb7bd). Haritanın ana bakışı yüksek
// eğimli, yani tepe paneli en çok görünen yüzey; oraya konan tek bir açık
// renk sabiti tam beyaz piksellerin tamamını üretebiliyor (fırkateynde
// helikopter dairesinin çizgisi %100'ünü üretmişti).
kutular('port_bagaj', [
    // iki yan ray
    // ⚠️ Raylar çatının KENARINDA (z ±0.734), ortasında değil. İlk
    // kurulumda ±0.660'taydı ve tepe bakışında çatının %86'sını
    // çevreleyen bir levha gibi okunuyordu; gerçek tavan rayı çatı
    // sacının kenar kıvrımına oturur.
    [-0.850, 1.936, 0.734, 2.320, 0.044, 0.052],
    [-0.850, 1.936, -0.734, 2.320, 0.044, 0.052],
    // üç çapraz
    [ 0.150, 1.950, 0, 0.052, 0.032, 1.480],
    [-0.620, 1.950, 0, 0.052, 0.032, 1.480],
    [-1.390, 1.950, 0, 0.052, 0.032, 1.480],
    // arka uçtaki bagaj sepeti kenarı
    [-1.960, 1.950, 0, 0.052, 0.032, 1.460]
], '#1b1e22', { metal: 0.18, rough: 0.70 });
// TAVAN KAPAĞI (roof hatch) — The Armored Group listesindeki "roof hatches".
kutular('cati_kapak', [
    [0.010, 1.930, 0, 0.640, 0.034, 0.600],
    [0.010, 1.948, 0, 0.560, 0.024, 0.520]
], C_DIREK, { metal: 0.20, rough: 0.55 });
// ALÇAK PROFİLLİ FAR GRUBU: tavanın ön kenarında.
kutular('far_grubu', [[0.686, 1.952, 0, 0.130, 0.072, 1.260]], '#1b1e22',
        { metal: 0.20, rough: 0.60 });
kutular('far_grubu_lens', [[0.744, 1.952, 0, 0.028, 0.048, 1.170]], C_LENS,
        { metal: 0.10, rough: 0.26 });
// ARKA ÇATI SPOYLERİ (bagaj camının üstü).
kutular('kanat', [[-2.176, 1.944, 0, 0.150, 0.048, 1.300]], C_GOVDE,
        { metal: 0.40, rough: 0.52 });
// KISA ANTENLER + köpekbalığı yüzgeci.
[1, -1].forEach(function (s, i) {
    const a = mesh(new THREE.CylinderGeometry(0.007, 0.013, 0.280, 6),
                   '#0f1012', { metal: 0.20, rough: 0.60,
                                name: 'anten_' + (i + 1) });
    a.position.set(-1.900, 2.062, s * 0.420);
    modelGroup.add(a);
});
(function () {
    const sh = new THREE.Shape();
    sh.moveTo(-0.135, 0);
    sh.lineTo(0.115, 0);
    sh.quadraticCurveTo(0.060, 0.072, -0.024, 0.082);
    sh.quadraticCurveTo(-0.092, 0.086, -0.135, 0);
    const geo = new THREE.ExtrudeGeometry(sh, {
        depth: 0.058, bevelEnabled: false, curveSegments: 8
    });
    geo.translate(0, 0, -0.029);
    const f = mesh(geo, C_DIREK, { metal: 0.28, rough: 0.48, name: 'anten_kaide' });
    f.position.set(-1.560, 1.916, 0);
    modelGroup.add(f);
})();

// ===========================================================================
// 11. KÜÇÜK PARÇALAR — aynalar, kapı kolları
// ===========================================================================
// Aynalar KAPIDA, çatalda değil: dört tekerli araçta ayna direksiyonla
// DÖNMEZ. Ayna gövdesi BİRİNCİL RENK alıyor (_TINT.parts).
// ⚠️ Kutu genişliği aynalarla birlikte 2.16 m ölçülüyor; gerçek Land
// Cruiser 200'ün aynalı genişliği 2.15 m.
const AYNA_KOLU = [];
[1, -1].forEach(function (s, i) {
    const x = 0.582, y = 1.396;
    const w = s * (1 - G.vYukseklik(x, y));
    const p = G.nokta3(x, w), n = G.normal3(x, w);
    AYNA_KOLU.push(p);

    const kol = mesh(new THREE.BoxGeometry(0.062, 0.042, 0.086), C_DIREK,
                     { metal: 0.26, rough: 0.52, name: 'ayna_kol_' + (i + 1) });
    kol.position.set(p[0], p[1] - 0.012, p[2] + s * 0.032);
    modelGroup.add(kol);

    const kutu = new THREE.SphereGeometry(0.132, 10, 7);
    kutu.scale(0.66, 0.44, 0.68);
    const gov = mesh(kutu, C_GOVDE, { metal: 0.40, rough: 0.52,
                                      name: 'ayna_govde_' + (i + 1) });
    gov.position.set(p[0] - 0.014, p[1] + 0.016, p[2] + s * 0.046);
    gov.rotation.y = -s * 0.12;
    modelGroup.add(gov);

    const cam = new THREE.BoxGeometry(0.022, 0.084, 0.112);
    const ac = mesh(cam, C_CAM, { metal: 0.36, rough: 0.10,
                                  name: 'ayna_cam_' + (i + 1) });
    ac.position.set(p[0] - 0.078, p[1] + 0.018, p[2] + s * 0.050);
    ac.rotation.y = -s * 0.12;
    modelGroup.add(ac);
});

// KAPI KOLLARI: bel kuşağının hemen altında, tek mesh (dört kutu).
// ⚠️ Tek mesh olmasının sebebi AD TUZAĞI: dört ayrı mesh'e aynı adı vermek
// `_applyTint`in yalnız ilkini bulmasına yol açar; ayrı ad vermek de dört
// çizim çağrısı demek.
(function () {
    const liste = [];
    [1, -1].forEach(function (s) {
        [0.286, -0.694].forEach(function (kx) {
            const kw = s * (1 - G.vYukseklik(kx, 1.372));
            const kp = G.nokta3(kx, kw), kn = G.normal3(kx, kw);
            liste.push([kp[0] + kn[0] * 0.026, kp[1] + kn[1] * 0.026,
                        kp[2] + kn[2] * 0.026, 0.186, 0.038, 0.034]);
        });
    });
    kutular('kapi_kolu', liste, '#6d747d', { metal: 0.40, rough: 0.38 });
})();
