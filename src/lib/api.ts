import { ResultDetailDTO, ResultItemDTO, SearchResponseDTO } from '@/types/api';
import { useAuth } from '@/context/AuthContext';

/**
 * Frontend API helpers (mocked). Next dev: replace bodies with real fetch calls.
 * Keep function signatures stable to avoid breaking callers.
 */

export async function performSearch(query: string, filters: Record<string, string | number | boolean> = {}, page = 1, isPrivate = false): Promise<SearchResponseDTO> {
  // TODO(back): GET /api/search?q=&filters=&page=&fields=min|full
  // Use `fields` to control public vs private payload shape
  void isPrivate;
  const items: ResultItemDTO[] = Array.from({ length: 12 }).map((_, i) => ({
    id: `${query || 'q'}-${page}-${i}`,
    type: (['project', 'wildlife', 'alert', 'research'] as const)[i % 4],
    title: `Result ${i + 1}: ${query || 'Insight'}`,
    description: 'Concise summary. Replace with server result excerpt.',
    location: ['Amazon', 'Congo Basin', 'Sumatra', 'Borneo'][i % 4],
    health: (['healthy', 'stressed', 'critical'] as const)[i % 3],
    confidence: 0.5 + (i % 5) * 0.1,
    thumbnailUrl: undefined,
  }));
  return { items, page, pageSize: 12, total: 240 };
}

export async function fetchResultDetails(id: string, isPrivate = false): Promise<ResultDetailDTO> {
  // TODO(back): GET /api/results/:id?fields=min|full
  // Public should omit precise geometry and high-res media
  void isPrivate;
  return {
    id,
    type: 'project',
    title: `Detail ${id}`,
    description: 'Server-provided detailed description.',
    location: 'Amazon',
    health: 'healthy',
    confidence: 0.9,
    metadata: { sample: true },
    geometry: { type: 'Point', coordinates: [0, 0] },
    media: [{ url: '/placeholder.svg', kind: 'image', preview: '/placeholder.svg' }],
  };
}

export async function fetchGeometry(id: string, precision: 'public' | 'private' = 'public') {
  // TODO(back): GET /api/results/:id/geometry?precision=public|private
  // Public: generalized/blurred geometry; Private: precise
  void precision; void id;
  return { type: 'Point', coordinates: [0, 0] };
}

export async function fetchMedia(id: string, isPrivate = false) {
  // TODO(back): GET /api/results/:id/media (use signed URLs when private)
  void isPrivate; void id;
  return [{ url: '/placeholder.svg', kind: 'image', preview: '/placeholder.svg' }];
}

export function hasAccess(feature: string, isLoggedIn: boolean) {
  // TODO(back): extend to role/plan-based checks
  return isLoggedIn;
}

export function normalizeQuery(q: string) {
  return q.trim().replace(/\s+/g, ' ');
}

export function parseFilters(searchParams: URLSearchParams) {
  const obj: Record<string, string> = {};
  searchParams.forEach((v, k) => { if (k !== 'q' && k !== 'ai') obj[k] = v; });
  return obj;
}