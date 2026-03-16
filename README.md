# APKURL Blocker - Full Stack Migration

This project has been expanded to include the **FastAPI ML Backend** and the **Kotlin Android Architecture**.

## 📂 Folder Structure

- `/backend`: The Python FastAPI server with ML inference logic.
- `/mobile_kotlin`: The Android Studio project structure (Kotlin, Room, Retrofit, Compose).
- `/src`, `/views`, etc.: The original React UI prototype (for reference).

## 🚀 How to use the Backend (FastAPI)

1. Navigate to the `backend` directory.
2. Install dependencies: `pip install -r requirements.txt`
3. Start the server: `python app/main.py`
4. The API will be available at `http://localhost:3000`.

## 📱 How to use the Android Code

1. Open **Android Studio**.
2. Create a new "Empty Compose Activity" project.
3. Copy the files from `/mobile_kotlin` into your project's `java/com/apkurl/blocker/` directory.
4. Add the following dependencies to your `build.gradle`:
   - Retrofit (Network)
   - Room (Database)
   - Navigation Compose
   - Coroutines

## 🧠 ML Model Training

The `backend/app/main.py` currently uses **Heuristic Logic** as a placeholder. To upgrade to real ML:
1. Train your models in VS Code using Scikit-learn.
2. Save them as `.pkl` files using `joblib`.
3. Load them in `main.py` using `joblib.load()`.
4. Replace the `analyze_url_logic` and `analyze_apk_logic` functions with `model.predict()`.

## 🛠 Integration

The Android app is pre-configured to talk to the FastAPI backend via Retrofit. Ensure your Android device/emulator can reach the server's IP address.
