import { supabase } from './supabase';

export interface TrendingDestination {
  id: string;
  name: string;
  category?: string | null;
  location?: string | null;
  province?: string | null;
  city?: string | null;
  description?: string | null;
  image_url?: string | null;
  rating?: number | null;
  created_at?: string | null;
}

interface TrendingRow {
  destination_id: string;
  position: number;
}

export async function getTrendingDestinations(
  limit?: number,
): Promise<TrendingDestination[]> {
  let query = supabase
    .from('trending_destinations')
    .select('destination_id, position')
    .order('position', {
      ascending: true,
    });

  if (
    typeof limit === 'number' &&
    limit > 0
  ) {
    query = query.limit(limit);
  }

  const {
    data: trendingRows,
    error: trendingError,
  } = await query;

  if (trendingError) {
    throw new Error(
      `Gagal mengambil daftar trending: ${trendingError.message}`,
    );
  }

  const ids = (
    (trendingRows ?? []) as TrendingRow[]
  ).map((row) =>
    String(row.destination_id),
  );

  if (ids.length === 0) {
    return [];
  }

  const {
    data: destinationRows,
    error: destinationError,
  } = await supabase
    .from('destinations')
    .select('*')
    .in('id', ids);

  if (destinationError) {
    throw new Error(
      `Gagal mengambil destinasi trending: ${destinationError.message}`,
    );
  }

  const destinationMap = new Map<
    string,
    TrendingDestination
  >(
    (destinationRows ?? []).map(
      (destination) => [
        String(destination.id),
        destination as TrendingDestination,
      ],
    ),
  );

  return ids
    .map((id) => destinationMap.get(id))
    .filter(
      (
        destination,
      ): destination is TrendingDestination =>
        Boolean(destination),
    );
}