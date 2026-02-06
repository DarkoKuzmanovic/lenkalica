/**
 * Security validation utilities for content IDs, pagination, and user input
 */

/**
 * Validates that a content ID is safe to use in file paths.
 * Prevents path traversal attacks by only allowing alphanumeric characters, dashes, and underscores.
 *
 * @param id - The content ID to validate
 * @returns true if the ID is safe, false otherwise
 */
export function isSafeContentId(id: string): boolean {
  if (!id || typeof id !== "string") {
    return false;
  }

  // Only allow alphanumeric characters, dashes, and underscores
  // No dots, slashes, or other special characters that could enable path traversal
  const safeIdPattern = /^[a-zA-Z0-9_-]+$/;

  return safeIdPattern.test(id);
}

export interface PaginationParams {
  page: number;
  limit: number;
  totalPages?: number;
}

export interface PaginationOptions {
  defaultLimit?: number;
  maxLimit?: number;
  minLimit?: number;
}

/**
 * Parses and validates pagination parameters from URL search params.
 * Clamps values to safe ranges to prevent abuse.
 *
 * @param searchParams - URLSearchParams object from the request
 * @param options - Optional configuration for limits
 * @returns Validated pagination parameters
 */
export function parsePaginationParams(
  searchParams: URLSearchParams,
  options?: PaginationOptions,
): PaginationParams {
  const defaultLimit = options?.defaultLimit ?? 10;
  const maxLimit = options?.maxLimit ?? 100;
  const minLimit = options?.minLimit ?? 1;

  // Parse and validate page number
  const pageParam = searchParams.get("page");
  let page = parseInt(pageParam || "1", 10);

  // Clamp page to valid range (minimum 1)
  if (isNaN(page) || page < 1) {
    page = 1;
  }

  // Parse and validate limit
  const limitParam = searchParams.get("limit");
  let limit = parseInt(limitParam || String(defaultLimit), 10);

  // Clamp limit to valid range
  if (isNaN(limit) || limit < minLimit) {
    limit = minLimit;
  } else if (limit > maxLimit) {
    limit = maxLimit;
  }

  return { page, limit };
}

/**
 * Sanitizes a filename to prevent path traversal and injection attacks.
 * Removes or replaces dangerous characters.
 *
 * @param filename - The filename to sanitize
 * @returns Sanitized filename
 */
export function sanitizeFilename(filename: string): string {
  if (!filename || typeof filename !== "string") {
    throw new Error("Invalid filename");
  }

  // Remove null bytes
  if (filename.includes("\0")) {
    throw new Error("Filename contains null bytes");
  }

  // Remove path traversal sequences
  const sanitized = filename
    .replace(/\.\./g, "") // Remove ..
    .replace(/[\/\\]/g, "") // Remove slashes
    .replace(/^\.+/, "") // Remove leading dots
    .trim();

  // Ensure result is not empty after sanitization
  if (!sanitized) {
    throw new Error("Filename is empty after sanitization");
  }

  // Ensure filename doesn't start with an absolute path indicator
  if (sanitized.startsWith("/") || /^[A-Za-z]:/.test(sanitized)) {
    throw new Error("Absolute paths are not allowed");
  }

  return sanitized;
}

/**
 * Validates API key from request headers.
 * In production, this should check against environment variables.
 *
 * @param request - The incoming request
 * @returns true if authorized, false otherwise
 */
export function isAuthorized(request: Request): boolean {
  // In development, allow all requests
  if (process.env.NODE_ENV === "development") {
    return true;
  }

  // In production, check for API key
  const apiKey = request.headers.get("x-api-key");
  const validApiKey = process.env.API_KEY;

  // If no API key is configured, reject all write requests in production
  if (!validApiKey) {
    console.warn("API_KEY not configured - rejecting write request");
    return false;
  }

  return apiKey === validApiKey;
}
