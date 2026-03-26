import 'dart:async';

import 'package:flutter/foundation.dart';
import 'package:flutter/material.dart';
import 'package:webview_flutter/webview_flutter.dart';

void main() {
  WidgetsFlutterBinding.ensureInitialized();
  runApp(const FacturaloApp());
}

class FacturaloApp extends StatelessWidget {
  const FacturaloApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      debugShowCheckedModeBanner: false,
      title: 'Facturalo',
      theme: ThemeData(useMaterial3: true, colorSchemeSeed: Colors.blue),
      home: const FacturaloWebViewPage(),
    );
  }
}

class FacturaloWebViewPage extends StatefulWidget {
  const FacturaloWebViewPage({super.key});

  @override
  State<FacturaloWebViewPage> createState() => _FacturaloWebViewPageState();
}

class _FacturaloWebViewPageState extends State<FacturaloWebViewPage> {
  late final WebViewController _controller;
  bool _loading = true;
  String? _lastError;

  @override
  void initState() {
    super.initState();
    _controller = WebViewController()
      ..setJavaScriptMode(JavaScriptMode.unrestricted)
      ..setBackgroundColor(Colors.white)
      ..setNavigationDelegate(
        NavigationDelegate(
          onPageStarted: (_) => setState(() => _loading = true),
          onPageFinished: (_) => setState(() => _loading = false),
          onWebResourceError: (error) {
            setState(() {
              _lastError = '${error.errorCode}: ${error.description}';
              _loading = false;
            });
          },
        ),
      )
      ..loadFlutterAsset('assets/web/index.html');
  }

  Future<void> _reload() async {
    setState(() {
      _lastError = null;
      _loading = true;
    });
    await _controller.loadFlutterAsset('assets/web/index.html');
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: SafeArea(
        child: Stack(
          children: [
            WebViewWidget(controller: _controller),
            if (_loading) const LinearProgressIndicator(minHeight: 2),
            if (_lastError != null)
              Align(
                alignment: Alignment.bottomCenter,
                child: Container(
                  width: double.infinity,
                  margin: const EdgeInsets.all(12),
                  padding: const EdgeInsets.all(12),
                  decoration: BoxDecoration(
                    color: Colors.black87,
                    borderRadius: BorderRadius.circular(12),
                  ),
                  child: Column(
                    mainAxisSize: MainAxisSize.min,
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      const Text(
                        'La app cargó con errores',
                        style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold),
                      ),
                      const SizedBox(height: 6),
                      Text(
                        _lastError!,
                        style: const TextStyle(color: Colors.white70),
                      ),
                      const SizedBox(height: 10),
                      FilledButton(
                        onPressed: _reload,
                        child: const Text('Recargar'),
                      ),
                    ],
                  ),
                ),
              ),
          ],
        ),
      ),
    );
  }
}
