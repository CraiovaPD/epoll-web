/**
 * Namespace containing bit packing methods.
 */

/**
 * Set a flag on a bit bucket.
 */
export function setFlag (bucket: number, flag: number) : number {
  return bucket | flag;
}

/**
 * Unset a flag on a bit bucket.
 */
export function unsetFlag (bucket: number, flag: number) : number {
  return bucket & (~flag);
}

/**
 * Check if a flag is set on a bucket.
 */
export function isFlagSet (bucket: number, flag: number) : boolean {
  return ((bucket & flag) === flag);
}
