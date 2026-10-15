# UniNotes — University Notes Marketplace

A peer-to-peer notes marketplace for university students. Sellers list their class notes or past exams; buyers browse by course and can buy at the listed price or make a counter-offer. Contact details are exchanged via the notification system so payment is arranged directly between buyer and seller — no payment processing happens on the site.

---

## Features

- **Buy notes** — browse listings by course code and type (Class Notes or Mock Test / Past Exam), then purchase at the listed price or make a counter-offer
- **Sell notes** — create a listing in four guided steps: select course, choose type, add a description and price, then review and submit
- **Counter-offer flow** — buyers can propose a lower price; sellers see the offer in their notifications and can accept or decline with one click
- **Gmail / Google login** — sign in instantly with your Google account, or register with a university `.edu` email and password
- **Real-time notifications** — in-app notification feed powered by Firestore `onSnapshot`; sellers are notified when someone buys or makes a counter-offer, and buyers are notified when their offer is accepted or declined
- **No payment processing on site** — the marketplace only facilitates the connection; buyer and seller email addresses are shared via notifications so they can arrange payment and file transfer directly

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend framework | React 18 |
| Build tool | Vite |
| Authentication | Firebase Auth (Google + Email/Password) |
| Database | Firebase Firestore |
| Styling | Tailwind CSS v4 (via `@tailwindcss/vite`) |

---

## Setup Instructions

### 1. Clone the repo

```bash
git clone <repo-url>
cd university-notes-marketplace
```

### 2. Install dependencies

```bash
npm install
```

### 3. Create a Firebase project

Go to [https://console.firebase.google.com](https://console.firebase.google.com) and create a new project.

### 4. Enable Authentication providers

Inside your Firebase project:

1. Open **Authentication** in the left sidebar
2. Click **Get started**, then go to the **Sign-in method** tab
3. Enable **Google** (set a support email when prompted)
4. Enable **Email/Password**

### 5. Create a Firestore database

1. Open **Firestore Database** in the left sidebar
2. Click **Create database** and choose **Start in test mode**
3. Once created, go to the **Rules** tab and replace the default rules with the contents of `src/firebase/firestore.rules`
4. Click **Publish**

### 6. Copy your Firebase config

1. In your Firebase project, go to **Project Settings** (the gear icon)
2. Under **Your apps**, click **Web** (`</>`) and register an app if you haven't already
3. Copy the `firebaseConfig` object values

### 7. Paste the config into the project

Open `src/firebase/config.js` and replace the placeholder values with your real config:

```js
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
}
```

### 8. Start the development server

```bash
npm run dev
```

The app will be available at `http://localhost:5173`.

---

## Counter-Offer Flow

1. A buyer browses to a listing and clicks **Make a Counter Offer**
2. The buyer enters a price lower than the listed price and submits
3. The seller receives a real-time notification showing the offered amount and the buyer's email, with **Accept** and **Decline** buttons
4. If the seller accepts, the buyer is notified and both parties have each other's email addresses to arrange the exchange directly
5. If the seller declines, the buyer is notified and can try a different price or buy at the full listed price

---

## Payments

Payments are arranged directly between buyer and seller — the site only facilitates the connection. Once a purchase or counter-offer is accepted, both parties receive each other's email addresses via the notification system and can arrange payment (e.g. PayPal, bank transfer) and file delivery privately.
