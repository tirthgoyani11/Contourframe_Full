// 3B yazı — kullanıcının yazdığı metin gerçek geometriye dönüşür.
//
// BU DOSYA BİLEREK BOŞ. Geometriyi Studio3D kuruyor (_YAZI3B tablosu ve
// _applyText3D): metin annotation'da duruyor ve her değiştiğinde harflerin
// konturlarından yeniden extrude ediliyor. Model kodu burada çalıştığı
// sırada metni bilmiyor, ayrıca font verisine de erişimi yok (model kodu
// yalnız THREE, modelGroup, mesh, Math, spin alıyor).
//
// PARÇA ADI: 'yazi' — renk o parçaya uygulanıyor (ann.modelColor).
// Metin boşken varsayılan "TEXT" görünür.
