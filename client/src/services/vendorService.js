// src/services/vendorService.js
import { updateDocument, createDoc, fetchDoc } from "./firestoreHelpers";

/**
 * approveVendor
 * - sets vendors/{id}.status = "approved"
 * - sets users/{id}.status = "approved"
 * - records activity (vendor.activity) and vendor_activity collection
 */
export async function approveVendor(vendorId, adminUser) {
  // get vendor (optional)
  const vendor = await fetchDoc("vendors", vendorId);

  const nowISO = new Date().toISOString();

  await updateDocument("vendors", vendorId, {
    status: "approved",
    approvedBy: adminUser?.uid || null,
    approvedAt: nowISO,
    // merge activity client-side; alternate: keep server-side function to push array
    activity: [...(vendor.activity || []), {
      type: "approved",
      note: "Vendor approved by admin",
      adminId: adminUser?.uid,
      createdAt: nowISO,
    }],
  });

  // Update users collection for auth+rules consistency
  await updateDocument("users", vendorId, {
    role: "partner",
    status: "approved",
  });

  // record activity doc
  await createDoc("vendor_activity", null, {
    vendorId,
    type: "approved",
    note: `${adminUser?.email || adminUser?.uid} approved vendor`,
    adminId: adminUser?.uid,
    createdAt: nowISO,
  });

  // TODO: enqueue email notification to vendor (via Cloud Function) - later
}

/**
 * suspendVendor
 */
export async function suspendVendor(vendorId, adminUser, reason = "suspended") {
  const vendor = await fetchDoc("vendors", vendorId);

  const nowISO = new Date().toISOString();

  await updateDocument("vendors", vendorId, {
    status: "suspended",
    lastStatusChangedBy: adminUser?.uid,
    lastStatusChangedAt: nowISO,
    activity: [...(vendor.activity || []), {
      type: "suspended",
      note: reason,
      adminId: adminUser?.uid,
      createdAt: nowISO,
    }],
  });

  // Update users doc
  await updateDocument("users", vendorId, {
    status: "suspended",
  });

  await createDoc("vendor_activity", null, {
    vendorId,
    type: "suspended",
    note: reason,
    adminId: adminUser?.uid,
    createdAt: nowISO,
  });
}
