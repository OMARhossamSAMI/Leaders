// Helpers for reading Paymob's transaction inquiry response.

/** Paymob may answer the inquiry with one transaction or a list of them. */
export function firstTransaction(data: any): any {
  return Array.isArray(data) ? data[0] : data;
}

/**
 * A transaction counts as paid only when Paymob says it succeeded and it is
 * not still pending, voided or refunded. A declined card comes back with
 * success: false and pending: false, so "not pending" alone is not enough.
 */
export function isPaidTransaction(trx: any): boolean {
  return (
    trx?.success === true &&
    trx?.pending !== true &&
    trx?.is_voided !== true &&
    trx?.is_refunded !== true
  );
}
