// src/hooks/usePartnerships.js
import { useState, useEffect } from "react";
import {
  collection,
  query,
  orderBy,
  limit,
  startAfter,
  getDocs,
  where,
} from "firebase/firestore";
import { db } from "../services/firebaseConfig";

export default function usePartnerships(searchTerm = "") {
  const [partnerships, setPartnerships] = useState([]);
  const [lastDoc, setLastDoc] = useState(null);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const pageSize = 10;

  const fetchPartnerships = async (direction = "next", reset = false) => {
    setLoading(true);
    try {
      let baseQuery = query(
        collection(db, "partnerships"),
        orderBy("createdAt", "desc"),
        limit(pageSize)
      );

      if (searchTerm.trim()) {
        // Firestore doesn't support "OR" directly,
        // so we can search by a chosen field (e.g., businessName)
        baseQuery = query(
          collection(db, "partnerships"),
          where("businessName", ">=", searchTerm),
          where("businessName", "<=", searchTerm + "\uf8ff"),
          orderBy("businessName"),
          limit(pageSize)
        );
      }

      if (!reset && direction === "next" && lastDoc) {
        baseQuery = query(baseQuery, startAfter(lastDoc));
      }

      const snapshot = await getDocs(baseQuery);
      const docs = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

      setPartnerships(docs);
      setLastDoc(snapshot.docs[snapshot.docs.length - 1]);
      setHasMore(snapshot.docs.length === pageSize);
    } catch (err) {
      console.error("Error fetching partnerships:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPartnerships("next", true);
  }, [searchTerm]);

  return {
    partnerships,
    fetchPartnerships,
    loading,
    hasMore,
  };
}
