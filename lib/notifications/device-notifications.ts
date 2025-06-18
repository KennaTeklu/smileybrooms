// lib/notifications/device-notifications.ts

export async function sendNotification(token: string) {
  try {
    const message = {
      notification: {
        title: "😊smileybrooms.com is waiting for you!",
        body: "Click to view your smileybrooms.com dashboard.",
      },
      token: token,
    }

    // Send the message to Firebase
    const response = await admin.messaging().send(message)
    console.log("Successfully sent message:", response)
  } catch (error) {
    console.log("Error sending message:", error)
  }
}

import * as admin from "firebase-admin"

// Initialize Firebase Admin SDK (if not already initialized)
if (!admin.apps.length) {
  try {
    const serviceAccount = require("../../serviceAccountKey.json")
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    })
  } catch (error: any) {
    console.log("Firebase Admin initialization error", error.stack)
  }
}
