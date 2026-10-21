package com.learncoding.app;

import android.app.Activity;
import android.graphics.Color;
import android.net.Uri;
import android.os.Bundle;
import android.speech.tts.TextToSpeech;
import android.view.View;
import android.webkit.JavascriptInterface;
import android.webkit.WebResourceRequest;
import android.webkit.WebResourceResponse;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.widget.Toast;
import java.io.InputStream;
import java.util.Locale;

/** Zeigt die LearnCoding-Web-App, die komplett in der APK steckt (kein Internet nötig). */
public class MainActivity extends Activity {
    // Fester https-Ursprung, damit der Lernfortschritt (localStorage) zuverlässig gespeichert wird.
    private static final String HOST = "appassets.androidplatform.net";
    private WebView web;
    private TextToSpeech tts;
    private boolean ttsReady;
    private boolean warnedMissingVoice;

    @Override
    protected void onCreate(Bundle state) {
        super.onCreate(state);
        getWindow().setStatusBarColor(Color.WHITE);
        getWindow().setNavigationBarColor(Color.WHITE);
        getWindow().getDecorView().setSystemUiVisibility(View.SYSTEM_UI_FLAG_LIGHT_STATUS_BAR);

        web = new WebView(this);
        web.setBackgroundColor(Color.parseColor("#F7F8FC"));
        WebSettings s = web.getSettings();
        s.setJavaScriptEnabled(true);
        s.setDomStorageEnabled(true);
        s.setTextZoom(100);
        s.setUserAgentString(s.getUserAgentString() + " LearnCodingApp");

        // Vorlesen: Die Web-App ruft window.LearnCodingNative.speak(text, lang) auf.
        tts = new TextToSpeech(this, new TextToSpeech.OnInitListener() {
            @Override
            public void onInit(int status) {
                ttsReady = status == TextToSpeech.SUCCESS;
            }
        });
        web.addJavascriptInterface(new SpeechBridge(), "LearnCodingNative");

        web.setWebViewClient(new WebViewClient() {
            @Override
            public WebResourceResponse shouldInterceptRequest(WebView view, WebResourceRequest request) {
                Uri url = request.getUrl();
                if (!HOST.equals(url.getHost())) return null;
                String path = url.getPath();
                if (path == null || path.equals("/")) path = "/index.html";
                try {
                    InputStream in = getAssets().open("www" + path);
                    return new WebResourceResponse(mimeType(path), "utf-8", in);
                } catch (Exception e) {
                    return new WebResourceResponse("text/plain", "utf-8", 404, "Not Found", null, null);
                }
            }

            @Override
            @SuppressWarnings("deprecation")
            public boolean shouldOverrideUrlLoading(WebView view, String url) {
                return !HOST.equals(Uri.parse(url).getHost());
            }
        });

        setContentView(web);
        if (state != null) web.restoreState(state);
        else web.loadUrl("https://" + HOST + "/index.html");
    }

    private class SpeechBridge {
        @JavascriptInterface
        public void speak(final String text, final String lang) {
            runOnUiThread(new Runnable() { public void run() {
                if (!ttsReady) {
                    Toast.makeText(MainActivity.this, "Sprachausgabe startet noch – bitte gleich noch einmal tippen.", Toast.LENGTH_SHORT).show();
                    return;
                }
                int r = tts.setLanguage(Locale.forLanguageTag(lang));
                if (r == TextToSpeech.LANG_MISSING_DATA || r == TextToSpeech.LANG_NOT_SUPPORTED) {
                    if (!warnedMissingVoice) {
                        warnedMissingVoice = true;
                        Toast.makeText(MainActivity.this, "Keine japanische Stimme installiert. Einstellungen → Sprachausgabe → Sprachdaten installieren.", Toast.LENGTH_LONG).show();
                    }
                    return;
                }
                tts.setSpeechRate(0.85f);
                tts.speak(text, TextToSpeech.QUEUE_FLUSH, null, "lc");
            }});
        }

        @JavascriptInterface
        public void stop() {
            runOnUiThread(new Runnable() { public void run() {
                if (tts != null) tts.stop();
            }});
        }
    }

    @Override
    protected void onDestroy() {
        if (tts != null) tts.shutdown();
        super.onDestroy();
    }

    private static String mimeType(String path) {
        if (path.endsWith(".html")) return "text/html";
        if (path.endsWith(".js")) return "application/javascript";
        if (path.endsWith(".ttf")) return "font/ttf";
        if (path.endsWith(".png")) return "image/png";
        if (path.endsWith(".webmanifest") || path.endsWith(".json")) return "application/json";
        return "application/octet-stream";
    }

    @Override
    protected void onSaveInstanceState(Bundle out) {
        super.onSaveInstanceState(out);
        web.saveState(out);
    }

    @Override
    public void onBackPressed() {
        if (web.canGoBack()) web.goBack();
        else super.onBackPressed();
    }
}
