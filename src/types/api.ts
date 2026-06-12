/**
 * API types shared by frontend and backend integrations
 * Next dev: keep these in sync with server contracts to minimize coupling.
 */

export type ResultType = 'project' | 'wildlife' | 'alert' | 'research';
export type HealthStatus = 'healthy' | 'stressed' | 'critical';

/**
 * Minimal result payload for listings (public-safe).
 * Backend: allow public/private field selection via `?fields=min|full`.
 */
export interface ResultItemDTO {
  id: string;
  type: ResultType;
  title: string;
  description: string;
  location?: string;
  health?: HealthStatus;
  confidence?: number; // 0..1
  thumbnailUrl?: string; // public-safe thumbnail
}

/**
 * Expanded details for a single result (private returns more data).
 * geometry: GeoJSON; public may be generalized/blurred.
 * media: use signed URLs/tokens for private; low-res previews public.
 */
export interface ResultDetailDTO extends ResultItemDTO {
  metadata?: Record<string, unknown>;
  media?: Array<{ url: string; kind: 'image' | 'video'; preview?: string }>;
  geometry?: { type: string; coordinates: unknown };
}

/**
 * Search response with pagination.
 * Backend: support `page` and `pageSize`; smaller defaults for public.
 */
export interface SearchResponseDTO {
  items: ResultItemDTO[];
  page: number;
  pageSize: number;
  total: number;
}