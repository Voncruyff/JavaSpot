import { supabase } from './lib/supabase';

export async function incrementArticleViews(
  articleId: string,
): Promise<number> {
  const { data, error } = await supabase.rpc(
    'increment_article_views',
    {
      p_article_id: articleId,
    },
  );

  if (error) {
    throw new Error(
      `Gagal menambah jumlah pembaca: ${error.message}`,
    );
  }

  return Number(data ?? 0);
}