'use client';
/* eslint-disable @typescript-eslint/no-explicit-any */

import React from 'react';
import { StyleSheet, View, SafeAreaView } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { WebView } from 'react-native-webview';

declare global {
  interface Window {
    TradingView: any;
  }
}

export default function Grafico() {
  const tradingViewConfig = {
    symbol: 'BTCUSDT',
    interval: 'D',
    timezone: 'Etc/UTC',
    theme: 'dark',
    style: '1',
    locale: 'pt',
    toolbar_bg: '#f1f3f6',
    enable_publishing: false,
    allow_symbol_change: true,
    details: true,
    hotlist: true,
    calendar: true,
    news: ['headlines'],
  };

  const tradingViewScript = `
    new TradingView.widget({
      "container_id": "tradingview_chart",
      "width": "100%",
      "height": "100%",
      "symbol": "${tradingViewConfig.symbol}",
      "interval": "${tradingViewConfig.interval}",
      "timezone": "${tradingViewConfig.timezone}",
      "theme": "${tradingViewConfig.theme}",
      "style": "${tradingViewConfig.style}",
      "locale": "${tradingViewConfig.locale}",
      "toolbar_bg": "${tradingViewConfig.toolbar_bg}",
      "enable_publishing": ${tradingViewConfig.enable_publishing},
      "allow_symbol_change": ${tradingViewConfig.allow_symbol_change},
      "details": ${tradingViewConfig.details},
      "hotlist": ${tradingViewConfig.hotlist},
      "calendar": ${tradingViewConfig.calendar},
    });
  `;

  const htmlContent = `
    <html>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <script type="text/javascript" src="https://s3.tradingview.com/tv.js"></script>
      </head>
      <body style="margin:0;padding:0;background:#111;">
        <div id="tradingview_chart" style="height:100vh;width:100vw;"></div>
        <script>${tradingViewScript}</script>
      </body>
    </html>
  `;

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />

      <View style={styles.chartContainer}>
        <WebView
          source={{ html: htmlContent }}
          style={styles.webview}
          javaScriptEnabled={true}
          domStorageEnabled={true}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#111',
  },
  chartContainer: {
    flex: 1,
  },
  webview: {
    flex: 1,
    backgroundColor: '#111',
  },
});
