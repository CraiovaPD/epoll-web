/**
 * Namespace holding various string helper methods.
 */

/**
 * Transform a phone to it's international representation.
 */
export function toInternationalPhone (phone: string) : string {
  if (/^07/i.test(phone))
    return `+4${phone}`;

  return phone;
}
