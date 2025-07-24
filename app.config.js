import "dotenv/config";

export default {
  expo: {
    name: "Daily Check App",
    slug: "daily-check-app",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/images/daily-check-app.png",
    scheme: "dailycheckapp",
    userInterfaceStyle: "automatic",
    newArchEnabled: true,
    ios: {
      supportsTablet: true
    },
    android: {
      package: "com.ada_loli.dailycheckapp",
      permissions: ["INTERNET", "RECEIVE_SMS", "READ_SMS", "SEND_SMS"],
      adaptiveIcon: {
        foregroundImage: "./assets/images/daily-check-app.png",
        backgroundColor: "#ffffff"
      },
      edgeToEdgeEnabled: true
    },
    web: {
      bundler: "metro",
      output: "static",
      favicon: "./assets/images/daily-check-app-fav-icon.png",
    },
    plugins: [
      "expo-router",
      [
        "expo-splash-screen",
        {
          image: "./assets/images/daily-check-app.png",
          imageWidth: 200,
          resizeMode: "contain",
          backgroundColor: "#ffffff"
        }
      ],
      [
        "expo-video",
        {
          "supportsBackgroundPlayback": true,
          "supportsPictureInPicture": true
        }
      ],
      "expo-web-browser"
    ],
    experiments: {
      typedRoutes: true
    },
    extra: {
      debugMode: process.env.DEBUG_MODE === "true",
      testEnv: process.env.TEST_ENV ?? "fallback-test",
      // Firebase
      firebaseApiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
      firebaseAuthDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
      firebaseProjectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
      firebaseStorageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
      firebaseMessagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
      firebaseAppId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID,
      firebaseMeasurementId: process.env.EXPO_PUBLIC_FIREBASE_MEASUREMENT_ID,
      // Email
      userEmail: process.env.EXPO_PUBLIC_EMAIL_USER,
      userPass: process.env.EXPO_PUBLIC_EMAIL_PASS,
      router: {
        // origin: false,
      },
      eas: {
        projectId: "74d8e8d1-5554-4427-a143-0ed11e031fcc"
      },
      
    },
    owner: "ada_loli"
  }
}
