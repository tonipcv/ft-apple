import "dotenv/config";

export default {
  expo: {
    name: "FIP",
    slug: "fip",
    version: "1.0.4", // Versão do app
    ios: {
      bundleIdentifier: "com.k17.ft", // Deve corresponder ao registrado no Apple Developer
      buildNumber: "21",
      icon: "./assets/icon.png", // Caminho para o ícone do iOS
    },
    extra: {
      supabaseUrl: process.env.EXPO_PUBLIC_SUPABASE_URL || "https://hzqhyzwzrblcjdgjmash.supabase.co",
      supabaseAnonKey: process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh6cWh5end6cmJsY2pkZ2ptYXNoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mjk4NjE0NDAsImV4cCI6MjA0NTQzNzQ0MH0.T4Lt6Ci7Yro_SF6K4mXfavstyojL3BCfcDvRNJkSY3E",
      eas: {
        projectId: "8ac81449-a4df-454a-b543-b36cecc92b39", // Mantém o projectId do EAS
      },
    },
  },
};
