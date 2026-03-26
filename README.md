# Facturalo Flutter Wrapper

Este proyecto envuelve la web extraída del APK dentro de un `WebView` de Flutter.

## Qué hace
- Carga `assets/web/index.html` localmente.
- Reemplaza `cordova.js` por `cordova_shim.js`.
- Incluye un `codemagic.yaml` para compilar:
  - Android APK
  - iOS sin code signing (`flutter build ios --no-codesign`)

## Qué NO hace todavía
Este wrapper NO recrea todos los plugins nativos Cordova. Los siguientes quedaron como _shim_ o fallback:
- Cámara
- Escáner de códigos
- Impresión Bluetooth
- Apertura de archivos
- Transferencias nativas de archivos

## Importante sobre iOS / IPA
No se puede generar un IPA instalable para iPhone o subir a App Store sin firma de Apple.

Lo máximo sin llaves es:
- compilar iOS con `--no-codesign`
- obtener `.app` / `.xcarchive`

Para obtener `.ipa` real necesitas:
- Apple Developer account
- certificado
- provisioning profile

## Siguiente paso sugerido
Si quieres una app iOS funcional, hay que reemplazar los `shim` por plugins Flutter reales, por ejemplo:
- cámara -> `image_picker`
- scanner -> `mobile_scanner`
- impresión -> plugin compatible con AirPrint o flujo PDF
- abrir archivos -> `open_filex`
