import { useEffect } from "react";
import { auth, db } from "../src/services/firebaseConfig";
import { doc, getDoc, collection, getDocs } from "firebase/firestore";

export default function TestFirestore() {
  async function runTest() {
    try {
      console.log("🔥 AUTH USER UID:", auth.currentUser?.uid);

      // ---- TEST USER DOC ----
      const userRef = doc(db, "users", auth.currentUser.uid);
      const userSnap = await getDoc(userRef);

      // To fetch actual data for my firebase config and log to the console
      console.log(
        "🔥 FIREBASE CONFIG:",
        import.meta.env.VITE_FIREBASE_STORAGE_BUCKET
      );

      console.log(
        "🔥 FIRESTORE USER DOC:",
        userSnap.exists() ? userSnap.data() : "NO DOC FOUND"
      );

      // ---- TEST VENDORS READ ----
      const vendorsRef = collection(db, "vendors");
      const vendorDocs = await getDocs(vendorsRef);

      console.log(
        "🔥 VENDOR DOCS:",
        vendorDocs.docs.map((d) => d.data())
      );
    } catch (err) {
      console.error("🔥 TEST ERROR:", err);
    }
  }

  return (
    <div className="p-10">
      <button
        onClick={runTest}
        className="px-4 py-2 bg-green-600 text-white rounded"
      >
        Run Firestore Test
      </button>
    </div>
  );
}
