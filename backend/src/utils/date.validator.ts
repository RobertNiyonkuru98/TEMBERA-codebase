import { BadRequestError } from "./http-error";

/**
 * Normalize date input to ISO-8601 DateTime format required by Prisma
 * @param input - Date string in any parseable format (e.g., "2026-03-17" or "2026-03-17T10:30:00Z")
 * @returns ISO-8601 formatted datetime string
 * @throws Error if date is invalid or unparseable
 */
export function normalizeDate(input: unknown): string {
  if (!input || typeof input !== "string") {
    throw new Error("Date input must be a non-empty string.");
  }

  const trimmedInput = input.trim();
  const date = new Date(trimmedInput);

  if (isNaN(date.getTime())) {
    throw new BadRequestError(
      `Invalid date format "${trimmedInput}". Expected ISO-8601 compatible input (e.g., "2026-03-17" or "2026-03-17T10:30:00Z").`
    );
  }

  return date.toISOString();
}

/**
 * Validate that a date string is parseable without throwing
 * @param input - Date string to validate
 * @returns true if valid, false otherwise
 */
export function isValidDate(input: unknown): boolean {
  if (!input || typeof input !== "string") {
    return false;
  }

  const date = new Date(input);
  return !isNaN(date.getTime());
}
