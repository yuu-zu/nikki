const admin = require("firebase-admin");
const path = require("path");

let db;

function initializeFirebase() {
  if (admin.apps.length) {
    db = admin.firestore();
    return { admin, db };
  }

  const serviceAccountPath = process.env.FIREBASE_SERVICE_ACCOUNT_PATH
    ? path.resolve(process.cwd(), process.env.FIREBASE_SERVICE_ACCOUNT_PATH)
    : "";

  if (!serviceAccountPath) {
    throw new Error("Missing FIREBASE_SERVICE_ACCOUNT_PATH in environment.");
  }

  // Admin SDK lets the server manage Firebase Auth and Firestore safely.
  admin.initializeApp({
    credential: admin.credential.cert(require(serviceAccountPath)),
  });

  db = admin.firestore();
  return { admin, db };
}

module.exports = { initializeFirebase };
