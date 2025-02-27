import "dotenv/config";

export default {
  expo: {
    name: "FIP",
    slug: "fip",
    version: "1.0.8",
    orientation: "portrait",
    icon: "./assets/icon.png",
    userInterfaceStyle: "light",
    splash: {
      resizeMode: "contain",
      backgroundColor: "#ffffff"
    },
    assetBundlePatterns: [
      "**/*"
    ],
    ios: {
      bundleIdentifier: "com.k17.ft",
      buildNumber: "29",
      icon: "./assets/icon.png",
      infoPlist: {
        UIBackgroundModes: ["fetch", "remote-notification"],
        NSAppTransportSecurity: {
          NSAllowsArbitraryLoads: true
        }
      },
      simulator: {
        deviceId: "0554E743-5122-48AB-9164-2E24995B1039"
      }
    },
    android: {
      package: "com.k17.ft",
      versionCode: 21,
      adaptiveIcon: {
        foregroundImage: "./assets/icon.png",
        backgroundColor: "#ffffff"
      }
    },
    extra: {
      supabaseUrl: process.env.EXPO_PUBLIC_SUPABASE_URL || "https://hzqhyzwzrblcjdgjmash.supabase.co",
      supabaseAnonKey: process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh6cWh5end6cmJsY2pkZ2ptYXNoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mjk4NjE0NDAsImV4cCI6MjA0NTQzNzQ0MH0.T4Lt6Ci7Yro_SF6K4mXfavstyojL3BCfcDvRNJkSY3E",
      eas: {
        projectId: "8ac81449-a4df-454a-b543-b36cecc92b39"
      }
    }
  }
};
