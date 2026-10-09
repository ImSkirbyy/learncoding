#!/usr/bin/env bash
# Baut LearnCoding.apk aus dem Web-Ordner (build_webapp.py) – ohne Android Studio.
# Benötigt (Ubuntu): apt install aapt apksigner dalvik-exchange android-sdk-platform-23 zipalign openjdk-17-jdk
# Aufruf: ./build.sh <webapp-ordner> <ausgabe.apk>
set -euo pipefail
cd "$(dirname "$0")"
WEB="$1"; OUT="$2"
JAR=/usr/lib/android-sdk/platforms/android-23/android.jar
rm -rf build && mkdir -p build/obj build/assets
cp -r "$WEB" build/assets/www
javac -source 8 -target 8 -bootclasspath "$JAR" -Xlint:-options -d build/obj src/com/learncoding/app/*.java
dalvik-exchange --dex --output=build/classes.dex build/obj
aapt package -f -M AndroidManifest.xml -S res -A build/assets -I "$JAR" -F build/unaligned.apk
(cd build && aapt add unaligned.apk classes.dex >/dev/null)
zipalign -f -p 4 build/unaligned.apk build/aligned.apk
if [ ! -f learncoding.keystore ]; then
  keytool -genkeypair -keystore learncoding.keystore -storepass learncoding -keypass learncoding \
    -alias learncoding -keyalg RSA -keysize 2048 -validity 10000 -dname "CN=LearnCoding" >/dev/null 2>&1
fi
apksigner sign --ks learncoding.keystore --ks-pass pass:learncoding --ks-key-alias learncoding --out "$OUT" build/aligned.apk
apksigner verify "$OUT" && echo "Fertig: $OUT"
