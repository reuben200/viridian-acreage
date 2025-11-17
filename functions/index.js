/**
 * Firebase Functions entry file
 */
import { setGlobalOptions } from "firebase-functions/v2/options";
import { logger } from "firebase-functions";
import { onRequest } from "firebase-functions/v2/https";
import { auth, firestore } from "firebase-functions";
import { initializeApp, firestore as _firestore, auth as _auth } from "firebase-admin";

initializeApp();
const db = _firestore();

setGlobalOptions({ maxInstances: 10 });

export const createUserDoc = auth.user().onCreate(async (user) => {
  const userRef = db.collection("users").doc(user.uid);

  try {
    const existing = await userRef.get();
    if (existing.exists) {
      logger.info(`User document for ${user.uid} already exists.`);
      return null;
    }

    const userData = {
      name: user.displayName || "Unnamed User",
      email: user.email || "",
      role: "customer", // default role
      status: "Active",
      provider: user.providerData?.[0]?.providerId || "email",
      createdAt: new Date().toISOString(),
    };

    await userRef.set(userData);
    logger.info(`✅ Firestore doc created for ${user.uid}`);

    // Set custom claims (default role = customer)
    await _auth().setCustomUserClaims(user.uid, { role: "customer" });
    logger.info(`✅ Custom claims set for ${user.uid} as 'customer'`);
  } catch (error) {
    logger.error(`❌ Error creating Firestore doc for ${user.uid}:`, error);
  }

  return null;
});

export const deleteUserDoc = auth.user().onDelete(async (user) => {
  try {
    await db.collection("users").doc(user.uid).delete();
    logger.info(`🗑️ Deleted Firestore doc for ${user.uid}`);
  } catch (error) {
    logger.error(`❌ Error deleting Firestore doc for ${user.uid}:`, error);
  }
});

export const syncUserClaims = firestore
  .document("users/{userId}")
  .onUpdate(async (change, context) => {
    const { userId } = context.params;
    const before = change.before.data();
    const after = change.after.data();

    // Only update if the role actually changed
    if (before.role === after.role) return null;

    try {
      await _auth().setCustomUserClaims(userId, { role: after.role });
      logger.info(`🔄 Updated custom claims for ${userId} → ${after.role}`);
    } catch (error) {
      logger.error(`❌ Failed to update custom claims for ${userId}:`, error);
    }

    return null;
  });
export const helloWorld = onRequest((req, res) => {
  logger.info("Hello logs!", { structuredData: true });
  res.send("Hello from Firebase Functions!");
});