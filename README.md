StockSync Pro by Junior
Real-time Inventory Management PWA: Demonstrating API & Webhook Synergy
(Important: Replace ./images/screenshot.png with the actual path to your screenshot once you upload it to your GitHub repository. For example, create an images folder in your repo and put your screenshot there.)

Table of Contents
Introduction

Features

Technologies Used

Core Concepts Demonstrated

Getting Started (Local Development)

Prerequisites

Cloning the Repository

Installing Dependencies

Firebase Project Setup

Running the App Locally

Deployment (Firebase Hosting)

Firebase CLI Installation

Firebase CLI Login

Initialize Firebase Hosting

Build for Production

Deploy to Firebase Hosting

Usage

Future Enhancements

License

Acknowledgments

Introduction
StockSync Pro by Junior is a Progressive Web Application (PWA) designed to illustrate the powerful and efficient collaboration between traditional APIs and Webhooks in building a real-time inventory management system. This application allows users to manage product stock, track supplier orders, and receive instant alerts for low inventory levels.

The core idea is to showcase how APIs handle direct user-initiated actions, while webhooks (simulated in this project) provide immediate, event-driven updates, ensuring the application's data is always fresh and responsive without constant manual refreshing.

Features
Product Management (API-driven):

Add new products with name, SKU, current stock, and minimum stock threshold.

Edit existing product details.

Delete products from inventory.

Manually adjust product stock levels.

Supplier Order Tracking (Webhook-simulated):

Add simulated supplier orders for products.

Simulate webhook notifications from a "supplier" to update order statuses (e.g., pending, shipped, delivered, cancelled) in real-time.

Real-time Alerts (Internal Webhook-like Trigger):

Receive instant notifications when a product's stock falls below its predefined minimum threshold.

Mark notifications as read.

Responsive Design: Optimized for various screen sizes (mobile, tablet, desktop).

Real-time Data Synchronization: All data changes are reflected instantly across the application.

Technologies Used
Frontend:

React: A JavaScript library for building user interfaces.

Vite: A fast build tool for modern web projects.

Tailwind CSS: A utility-first CSS framework for rapid UI development.

Backend & Database:

Firebase Firestore: A flexible, scalable NoSQL cloud database for real-time data synchronization.

Firebase Authentication: Used for anonymous user authentication to manage private user data.

Deployment:

Firebase Hosting (Google Cloud Platform): For fast, secure, and reliable hosting of web applications.

Version Control:

Git: Distributed version control system.

GitHub: Platform for hosting Git repositories.

Core Concepts Demonstrated
APIs (Application Programming Interfaces):

Represent direct, client-initiated requests to a server to perform operations (e.g., CREATE, READ, UPDATE, DELETE products).

In StockSync Pro, adding a product or manually adjusting stock are examples of API-driven interactions.

Webhooks:

Act as a "push" mechanism where a server or service sends an automated notification to a predefined URL (your application's backend) when a specific event occurs.

In this project, supplier order status updates are simulated webhooks. When the status changes, the database is updated, and the UI instantly reflects it.

Low stock alerts are an example of an internal webhook-like trigger, where an event within the system (stock dropping) initiates a real-time notification.

Real-time Data:

Firebase Firestore's onSnapshot listeners are heavily utilized to provide immediate updates to the UI whenever data in the database changes, effectively mimicking the real-time nature that webhooks enable.

Getting Started (Local Development)
Follow these steps to get a local copy of the project up and running on your machine.

Prerequisites
Before you begin, ensure you have the following installed:

Node.js & npm: Download from https://nodejs.org/ (LTS version recommended).

Verify installation: node -v and npm -v

Git: Download from https://git-scm.com/downloads.

Verify installation: git --version

Code Editor: Visual Studio Code (VS Code) is highly recommended.

Cloning the Repository
Open your terminal or command prompt.

Navigate to the directory where you want to store your project.

Clone the repository:

git clone https://github.com/YOUR_USERNAME/stock-sync-pro-junior.git

(Replace YOUR_USERNAME with your actual GitHub username)

Navigate into the project directory:

cd stock-sync-pro-junior

Installing Dependencies
Once inside the project directory, install all the necessary Node.js packages:

npm install

Firebase Project Setup
This project uses Firebase for its backend (Firestore database and Authentication).

Create a Firebase Project:

Go to Firebase Console.

Click "Add project" and follow the prompts (e.g., stocksyncpro-junior). Disable Google Analytics if desired.

Add a Web App:

In your Firebase project, click the </> (Web) icon to add a new web app.

Register the app (e.g., stock-sync-pro-web). Do NOT check Firebase Hosting here.

You'll get your firebaseConfig object. Copy this object.

Enable Firestore Database:

In the Firebase Console, navigate to Build > Firestore Database.

Click "Create database" and select "Start in test mode" (for development purposes). Choose a region close to you.

Enable Anonymous Authentication:

In the Firebase Console, navigate to Build > Authentication.

Go to the "Sign-in method" tab.

Enable the "Anonymous" sign-in provider.

Update src/App.jsx with your firebaseConfig:

Open src/App.jsx in your code editor.

Locate the firebaseConfig constant near the top of the file.

Replace the placeholder firebaseConfig object with the actual one you copied from your Firebase project. It should look like this:

const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID",
  measurementId: "YOUR_MEASUREMENT_ID"
};

(Note: If running in a Canvas environment, the __firebase_config variable might be automatically provided, making this manual step unnecessary. For local development, it's required.)

Running the App Locally
In your terminal, within the stock-sync-pro-junior directory, start the development server:

npm run dev

Open your web browser and navigate to the URL displayed in the terminal (usually http://localhost:5173/).

Deployment (Firebase Hosting)
To deploy your application to the internet using Firebase Hosting:

Firebase CLI Installation
If you haven't already, install the Firebase CLI globally:

npm install -g firebase-tools

Firebase CLI Login
Log in to your Google account via the Firebase CLI:

firebase login

Follow the browser prompts to authenticate.

Initialize Firebase Hosting
Navigate to your stock-sync-pro-junior project directory in the terminal and initialize Firebase for hosting:

firebase init

Follow the prompts carefully:

"Are you ready to proceed?": Y

"Which Firebase features...?": Select "Hosting" (use spacebar to select, Enter to confirm).

"Please select an option:": Choose "Use an existing project".

"Select a default Firebase project...": Select your stocksyncpro-junior project from the list.

"What do you want to use as your public directory?": Type dist and press Enter. (This is crucial for Vite/React builds).

"Configure as a single-page app (rewrite all URLs to /index.html)?": Y

"Set up automatic builds and deploys with GitHub?": N (for manual deployment; can be set up later for CI/CD).

"File dist/index.html already exists. Overwrite?": N (do not overwrite your built index.html).

Build for Production
Before deploying, create the optimized production build of your React app:

npm run build

This will generate the dist folder containing your deployable assets.

Deploy to Firebase Hosting
Finally, deploy your built application:

firebase deploy --only hosting

The terminal will provide a "Hosting URL" (e.g., https://your-project-id.web.app) once the deployment is complete. Visit this URL in your browser to see your live application!

Usage
Inventory Tab:

Click "Add New Product (API)" to add items.

Use "Edit" to modify product details.

Use "Adjust Stock" to change quantities. If stock goes below the threshold, an alert will be triggered.

Use "Delete" to remove products.

Supplier Orders Tab:

Click "Add Simulated Order (API)" to create a new order.

Click "Simulate Webhook Update" next to an order to change its status and see the real-time update.

Alerts Tab:

Monitor real-time low stock notifications triggered by stock adjustments.

Future Enhancements
Full User Authentication: Implement email/password or social logins using Firebase Authentication for personalized inventories.

Backend Webhooks: Set up actual Firebase Cloud Functions to receive webhooks from a mock external service (e.g., a payment gateway or a real supplier API) to update data.

Advanced UI/UX: Add filtering, sorting, search functionality, and more detailed product/order views.

Offline Support: Enhance PWA capabilities with more robust offline caching strategies using Service Workers.

Push Notifications: Implement browser push notifications so users receive alerts even when the app is not open.

Data Visualization: Add charts or graphs to visualize inventory trends.

License
This project is open-source and available under the MIT License.

Acknowledgments
Built with guidance from Google's AI models.

Powered by React, Vite, Tailwind CSS, and Firebase.
