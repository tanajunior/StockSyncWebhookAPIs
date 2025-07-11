# StockSync Pro by Junior


## 🚀 Just launched "StockSync Pro App" – a quick and simple real-time inventory management App!

Ever wondered how modern apps provide instant updates and seamless experiences? It often comes down to the powerful duo of APIs and Webhooks.

In this simple app "StockSync Pro ," I've implemented:
### APIs for all direct, on-demand actions: adding, editing, deleting products, and creating new orders. This is like your app "asking" the server for specific tasks.

### Webhooks (simulated via Firebase Firestore's real-time capabilities and internal triggers) for instant, event-driven updates. Think of it as the server "telling" your app immediately when a supplier order status changes or stock levels drop critically low.

Why is this crucial for "quick functionality"?
This synergy eliminates constant "polling" (where your app repeatedly asks the server for updates), drastically improving efficiency, reducing server load, and delivering a truly real-time, responsive user experience. Your app reacts instantly to what's happening, whether it's a user action or an external event!

Built with React, styled with Tailwind CSS, powered by Firebase Firestore for the backend, and deployed on Firebase Hosting (GCP). This project was a simple dive into building robust, modern web applications.

Check it out and let me know your thoughts! What real-time features are you most excited about in apps today?

#WebDevelopment #PWA #ReactJS #APIs #Webhooks #Firebase #GCP #InventoryManagement #RealTimeApps #JuniorDeveloper

## Real-time Inventory Management PWA: Demonstrating API & Webhook Synergy

![StockSync Pro by Junior Screenshot](./images/screenshot.png)  
*(**Important:** Replace `./images/screenshot.png` with the actual path to your screenshot once you upload it to your GitHub repository.)*

---

## Table of Contents

- [Introduction](#introduction)
- [Features](#features)
- [Technologies Used](#technologies-used)
- [Core Concepts Demonstrated](#core-concepts-demonstrated)
- [Getting Started (Local Development)](#getting-started-local-development)
  - [Prerequisites](#prerequisites)
  - [Cloning the Repository](#cloning-the-repository)
  - [Installing Dependencies](#installing-dependencies)
  - [Firebase Project Setup](#firebase-project-setup)
  - [Running the App Locally](#running-the-app-locally)
- [Deployment (Firebase Hosting)](#deployment-firebase-hosting)
  - [Firebase CLI Installation](#firebase-cli-installation)
  - [Firebase CLI Login](#firebase-cli-login)
  - [Initialize Firebase Hosting](#initialize-firebase-hosting)
  - [Build for Production](#build-for-production)
  - [Deploy to Firebase Hosting](#deploy-to-firebase-hosting)
- [Usage](#usage)
- [Future Enhancements](#future-enhancements)
- [License](#license)
- [Acknowledgments](#acknowledgments)

---

## Introduction

**StockSync Pro by Junior** is a Progressive Web Application (PWA) designed to illustrate the powerful and efficient collaboration between traditional **APIs** and **Webhooks** in building a real-time inventory management system. 

This application allows users to manage product stock, track supplier orders, and receive instant alerts for low inventory levels.

> The core idea is to demonstrate how APIs handle user-initiated actions, while webhooks (simulated in this project) provide event-driven updates—ensuring data is always fresh and responsive.

---

## Features

- **Product Management (API-driven):**
  - Add, edit, or delete products.
  - Adjust stock levels manually.

- **Supplier Order Tracking (Webhook-simulated):**
  - Create simulated supplier orders.
  - Simulate webhook updates (e.g., shipped, delivered, canceled).

- **Real-time Alerts (Internal Webhook-like Trigger):**
  - Instant alerts when stock drops below threshold.
  - Mark notifications as read.

- **Responsive Design:** Mobile, tablet, and desktop friendly.

- **Live Data Synchronization:** Changes reflect instantly across UI.

---

## Technologies Used

### Frontend
- [React](https://react.dev/)
- [Vite](https://vitejs.dev/)
- [Tailwind CSS](https://tailwindcss.com/)

### Backend & Realtime Database
- [Firebase Firestore](https://firebase.google.com/docs/firestore)
- [Firebase Authentication](https://firebase.google.com/docs/auth)

### Deployment
- [Firebase Hosting](https://firebase.google.com/docs/hosting)

### Dev Tools
- [Git](https://git-scm.com/)
- [GitHub](https://github.com/)

---

## Core Concepts Demonstrated

### APIs
Used for all user-driven operations like:
- Creating, editing, deleting products.
- Adjusting stock.

### Webhooks
Simulated to mimic external services:
- Supplier order status updates.
- Trigger real-time database updates and UI refresh.

### Real-time Sync
- Firestore `onSnapshot` used to reflect all backend changes instantly in the frontend.

---

## Getting Started (Local Development)

### Prerequisites

- [Node.js & npm](https://nodejs.org/)
- [Git](https://git-scm.com/downloads)
- [VS Code](https://code.visualstudio.com/)

### Cloning the Repository

```bash
git clone https://github.com/YOUR_USERNAME/stock-sync-pro-junior.git
cd stock-sync-pro-junior
```

### Installing Dependencies

```bash
npm install
```

---

## Firebase Project Setup

### Create a Firebase Project

1. Visit [Firebase Console](https://console.firebase.google.com/)
2. Click "Add Project"
3. Name it something like `stocksyncpro-junior`
4. Disable Google Analytics (optional)

### Add Web App

1. Click the `</>` icon to add a new Web App
2. Name it e.g., `stock-sync-pro-web`
3. Do **NOT** check Firebase Hosting
4. Copy the generated `firebaseConfig` object

### Enable Firestore

1. Go to **Build > Firestore Database**
2. Click "Create database" > Start in test mode
3. Choose a region

### Enable Anonymous Auth

1. Navigate to **Build > Authentication**
2. Under the **Sign-in method** tab, enable **Anonymous**

### Update `src/App.jsx`

Replace the placeholder `firebaseConfig` with your actual one:

```js
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID",
  measurementId: "YOUR_MEASUREMENT_ID"
};
```

---

## Running the App Locally

```bash
npm run dev
```

Open `http://localhost:5173/` in your browser.

---

## Deployment (Firebase Hosting)

### Firebase CLI Installation

```bash
npm install -g firebase-tools
```

### Login

```bash
firebase login
```

Follow the browser prompts.

### Initialize Firebase Hosting

```bash
firebase init
```

Select the following options during setup:

- ✅ Hosting
- ✅ Use an existing project
- 📁 Public directory: `dist`
- ✅ Configure as a single-page app: Yes
- ❌ Overwrite `index.html`: No

### Build for Production

```bash
npm run build
```

### Deploy to Firebase

```bash
firebase deploy --only hosting
```

Visit the "Hosting URL" shown in the terminal.

---

## Usage

### Inventory Tab
- **Add New Product (API)**: Adds a new product.
- **Edit**: Modify product details.
- **Adjust Stock**: Triggers alerts if stock is low.
- **Delete**: Removes product.

### Supplier Orders Tab
- **Add Simulated Order**: Creates a dummy order.
- **Simulate Webhook Update**: Updates order status in real time.

### Alerts Tab
- Real-time low stock notifications.
- Mark notifications as read.

---

## Future Enhancements

- ✅ Full Auth System (Email, Google)
- ✅ Real Webhook Endpoints using Firebase Functions
- ✅ Offline Support using Service Workers
- ✅ Push Notifications for alerts
- ✅ Charts & Analytics
- ✅ Filter/Search functionality

---


---

## Acknowledgments


Powered by **React**, **Vite**, **Tailwind CSS**, and **Firebase**.
