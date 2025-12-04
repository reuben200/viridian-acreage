// src/services/firestoreHelpers.js
import {
  collection,
  query,
  where,
  orderBy,
  limit,
  startAfter,
  onSnapshot,
  getDocs,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";
import { db } from "./firebaseConfig";

/* ============================================================
   BELOW IS THE UNIVERSAL COLLECTION FETCH HELPER
   Supports:
   - where()
   - orderBy()
   - search
   - pagination
   - realtime listeners
   - full error handling
   ============================================================ */
export async function fetchCollection({
  path,
  filters = [],
  sort = null,
  pageSize = 20,
  cursor = null,
  search = null,
  realtime = false,
  onData = null,
}) {
  try {
    let ref = collection(db, path);
    let constraints = [];

    // -----------------------------
    // APPLY FILTERS
    // -----------------------------
    filters.forEach((f) => {
      if (f.field && f.operator && f.value !== undefined) {
        constraints.push(where(f.field, f.operator, f.value));
      }
    });

    // -----------------------------
    // "SEARCH" QUERY
    // -----------------------------
    if (search?.value) {
      constraints.push(
        where(search.field, ">=", search.value),
        where(search.field, "<=", search.value + "\uf8ff")
      );
    }

    // -----------------------------
    // SORTING (required when using pagination)
    // -----------------------------
    if (sort) {
      constraints.push(orderBy(sort.field, sort.direction || "asc"));
    }

    // -----------------------------
    // PAGINATION
    // -----------------------------
    if (cursor) {
      if (!sort) {
        console.warn(
          "⚠ Firestore requires orderBy() when using startAfter(). Add a 'sort' parameter."
        );
      }
      constraints.push(startAfter(cursor));
    }

    // -----------------------------
    // LIMIT
    // -----------------------------
    constraints.push(limit(pageSize));

    const q = query(ref, ...constraints);

    // -----------------------------
    // REALTIME LISTENER
    // -----------------------------
    if (realtime) {
      return onSnapshot(
        q,
        (snapshot) => {
          const items = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          if (onData) onData(items);
        },
        (err) => console.error("🔥 Realtime Listener Error:", err)
      );
    }

    // -----------------------------
    // ONE-TIME FETCH
    // -----------------------------
    const snapshot = await getDocs(q);

    const lastDoc = snapshot.docs.length
      ? snapshot.docs[snapshot.docs.length - 1]
      : null;

    return {
      data: snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })),
      lastDoc,
    };
  } catch (err) {
    console.error(`🚨 Firestore Fetch Error (${path}):`, err);
    throw err;
  }
}

/* ============================================================
   SINGLE DOCUMENT HELPERS
   ============================================================ */
export async function fetchDoc(path, id) {
  try {
    const snap = await getDoc(doc(db, path, id));
    if (!snap.exists()) return null;
    return { id: snap.id, ...snap.data() };
  } catch (err) {
    console.error(`❌ Fetch doc failed: ${path}/${id}`, err);
    throw err;
  }
}

export async function createDoc(path, id, data) {
  try {
    return await setDoc(doc(db, path, id), data);
  } catch (err) {
    console.error(`❌ Create doc failed: ${path}/${id}`, err);
    throw err;
  }
}

export async function updateDocument(path, id, data) {
  try {
    return await updateDoc(doc(db, path, id), data);
  } catch (err) {
    console.error(`❌ Update failed: ${path}/${id}`, err);
    throw err;
  }
}

export async function deleteDocument(path, id) {
  try {
    return await deleteDoc(doc(db, path, id));
  } catch (err) {
    console.error(`❌ Delete failed: ${path}/${id}`, err);
    throw err;
  }
}

/* ============================================================
   FETCH USER ROLE (For routing & permissions)
   ============================================================ */
export async function fetchUserRole(uid) {
  try {
    const snap = await getDoc(doc(db, "users", uid));
    if (!snap.exists()) return null;

    const user = snap.data();

    return {
      role: user.role || "customer",
      status: user.status || "active",
    };
  } catch (err) {
    console.error("❌ Failed to fetch user role:", err);
    return null;
  }
}
