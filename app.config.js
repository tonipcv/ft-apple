module.exports = {
  expo: {
    name: "FIP",
    slug: "FIP",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/icon.png",
    userInterfaceStyle: "light",
    splash: {
      image: "./assets/splash.png",
      resizeMode: "contain",
      backgroundColor: "#ffffff"
    },
    assetBundlePatterns: [
      "**/*"
    ],
    ios: {
      supportsTablet: true,
      bundleIdentifier: "com.yourcompany.fip"
    },
    android: {
      adaptiveIcon: {
        foregroundImage: "./assets/adaptive-icon.png",
        backgroundColor: "#ffffff"
      },
      package: "com.yourcompany.fip"
    },
    web: {
      favicon: "./assets/favicon.png"
    },
    extra: {
      supabaseUrl: "https://hzqhyzwzrblcjdgjmash.supabase.co",
      supabaseAnonKey: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh6cWh5end6cmJsY2pkZ2ptYXNoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mjk4NjE0NDAsImV4cCI6MjA0NTQzNzQ0MH0.T4Lt6Ci7Yro_SF6K4mXfavstyojL3BCfcDvRNJkSY3E"
    }
  }
}; 