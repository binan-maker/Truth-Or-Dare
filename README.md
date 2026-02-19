
# Age Calculator App 🎂

A sleek, high-performance Age Calculator built with Expo and React Native. Features a modern dark UI and precise age statistics (Total months, weeks, days, hours, and next birthday countdown).

## 🚀 Getting Started

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Generate Native Folders**
   Since the `android` and `ios` directories are ignored, regenerate them locally:
   ```bash
   npx expo prebuild
   ```

3. **Run the App**
   *   **Android:** `npx expo run:android`
   *   **iOS:** `npx expo run:ios`
   *   **Development Server:** `npx expo start`

## 🛠 Project Structure
*   `app/` - Contains the main routing and screen logic via Expo Router.
*   `app.json` - Configuration for Expo and native build properties.
*   `babel.config.js` - Configured for Reanimated plugins.

## 🔐 Security Note
Ensure `keystore.properties` is added to your local environment but **never** committed to the repository.
