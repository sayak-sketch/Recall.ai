# Recall.ai 🧠

> **A Cognitive Memory Assistant powered by Google Gemini 3**
> *Winner/Entrant for Gemini Developer Competition 2026*

Recall.ai is a privacy-first Progressive Web App (PWA) designed to assist individuals with early-stage Alzheimer's, mild cognitive impairment, or just everyday forgetfulness. It acts as a secure "external working memory," allowing users to query their recent physical surroundings using natural language.

![Recall.ai Banner](public/favicon.ico) 
*(Replace this with a screenshot of your app interface if available)*

## 🚀 Key Features

* **🔒 Privacy-First "Rolling Buffer":**
    * Records video frames locally to device RAM (Circular Queue).
    * **Zero Cloud Uploads** during recording. Video is only processed when a specific question is asked.
    * **Auto-Wipe:** Old footage (older than 15 mins) is permanently deleted from memory automatically.
* **🗣️ Natural Language Recall:**
    * Ask questions like *"Where did I put my glasses?"* or *"Did I take my medicine?"*
    * Powered by **Google Gemini 1.5/2.0 Flash**, optimized for high-speed multimodal reasoning.
* **🤝 Care-Oriented Persona:**
    * The AI is prompted to be warm, spatial, and non-technical, specifically tuned for users needing cognitive support.
* **📱 PWA Ready:**
    * Installable on iOS and Android.
    * Works with local camera hardware via the MediaDevices API.

## 🛠️ Tech Stack

* **Framework:** [Next.js 14](https://nextjs.org/) (App Router, Server Actions)
* **AI Model:** Google Gemini 1.5 Flash / 2.0 Flash Experimental
* **Styling:** Tailwind CSS (Glassmorphism UI)
* **Deployment:** Vercel (Edge Network)
* **State Management:** React Hooks (`useVideoMemory` custom hook)

## ⚡️ Getting Started Locally

### Prerequisites
* Node.js 18+ installed.
* A Google AI Studio API Key.

### Installation

1.  **Clone the repository:**
    ```bash
    git clone [https://github.com/yourusername/recall-ai.git](https://github.com/yourusername/recall-ai.git)
    cd recall-ai
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Configure Environment:**
    Create a `.env.local` file in the root directory:
    ```env
    GEMINI_API_KEY=your_google_ai_studio_key_here
    ```

4.  **Run the development server:**
    ```bash
    npm run dev
    ```

5.  **Open in Browser:**
    Navigate to `http://localhost:3000`.

    > **Note:** Camera access requires a secure context (`https` or `localhost`). To test on mobile, deploy to Vercel.

## 📦 Deployment

This project is optimized for **Vercel**.

1.  Push your code to GitHub.
2.  Import the project into Vercel.
3.  **Crucial:** Add your `GEMINI_API_KEY` in the Vercel Project Settings > Environment Variables.
4.  Click **Deploy**.

## 🛡️ Privacy & Ethics

Recall.ai was built with **Safety by Design**:
* **No Database:** We do not store user video logs on any server.
* **Ephemeral Memory:** Data lives in the browser tab's RAM. Closing the tab wipes the memory instantly.
* **User Control:** The "Eye" indicator clearly shows when the buffer is filling, and users must explicitly press "Record".

## 📄 License

This project is open-source and available under the [MIT License](LICENSE).

---

*Built with ❤️ for the Gemini Hackathon.*