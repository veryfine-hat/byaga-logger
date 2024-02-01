/**
 * Normalizes a property name.
 *
 * This function takes a property name as a string and returns a normalized version of it.
 * The normalization process includes:
 * - Replacing uppercase characters with their lowercase equivalents, preceded by an underscore.
 * - Replacing hyphens with underscores.
 * - Converting the entire string to lowercase.
 *
 * @param {string} propertyName - The property name to normalize.
 * @returns {string} - The normalized property name.
 */
export function normalizePropertyName(propertyName:string) :string {
  return propertyName
    .replace(/[A-Z]/g, (c, idx, str) => {
      if (idx === 0) return c; // First character
      if (str[idx - 1] === '.')  return c // Next level
      if (/[A-Z]/.test(str[idx - 1])) return c // Acronyms
      if (str[idx - 1] === '_') return c; // no __

      return '_' + c
    })
    .replace(/-/g, "_")
    .toLowerCase()
}