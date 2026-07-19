import React, {
  useEffect,
  useRef,
  useState,
} from 'react';

import {
  Calendar,
  Eye,
  User,
  X,
} from 'lucide-react';

import { incrementArticleViews } from '../articleViews';

interface Artikel {
  id: string | number;
  title: string;

  author?: string | null;
  content?: string | null;
  description?: string | null;

  created_at?: string | null;
  date?: string | null;

  thumbnail_url?: string | null;
  image?: string | null;
  image_url?: string | null;

  views?: number | null;
}

interface ArtikelPopupProps {
  article: Artikel | null;
  onClose: () => void;
}

/**
 * Membersihkan format HTML yang berasal dari editor artikel.
 *
 * Perbaikan yang dilakukan:
 * - Mengubah &nbsp; menjadi spasi biasa.
 * - Menghapus tab.
 * - Merapikan spasi berlebihan.
 * - Mengubah <br> di dalam paragraf menjadi spasi.
 */
const normalizeArticleHtml = (
  html: string,
): string => {
  if (
    typeof window === 'undefined' ||
    !html
  ) {
    return html;
  }

  const parser = new DOMParser();

  const parsedDocument =
    parser.parseFromString(
      html,
      'text/html',
    );

  /*
   * Mengganti <br> di dalam paragraf dengan spasi.
   * Ini mencegah baris artikel terlalu pendek
   * ketika menggunakan rata kanan-kiri.
   */
  parsedDocument
    .querySelectorAll('p br')
    .forEach((lineBreak) => {
      lineBreak.replaceWith(
        parsedDocument.createTextNode(' '),
      );
    });

  /*
   * Mengambil seluruh node teks untuk
   * membersihkan whitespace.
   */
  const walker =
    parsedDocument.createTreeWalker(
      parsedDocument.body,
      NodeFilter.SHOW_TEXT,
    );

  const textNodes: Text[] = [];

  while (walker.nextNode()) {
    textNodes.push(
      walker.currentNode as Text,
    );
  }

  textNodes.forEach((textNode) => {
    textNode.data = textNode.data
      .replace(/\u00a0/g, ' ')
      .replace(/\t/g, ' ')
      .replace(/[ ]{2,}/g, ' ');
  });

  return parsedDocument.body.innerHTML;
};

/**
 * Membersihkan paragraf teks biasa.
 */
const normalizePlainParagraph = (
  text: string,
): string => {
  return text
    .replace(/\u00a0/g, ' ')
    .replace(/\t/g, ' ')
    .replace(/[ ]{2,}/g, ' ')
    .trim();
};

export default function ArtikelPopup({
  article,
  onClose,
}: ArtikelPopupProps) {
  const [currentViews, setCurrentViews] =
    useState<number>(0);

  /*
   * Menyimpan ID artikel yang sudah dihitung.
   * Hal ini mencegah render ulang menambahkan
   * viewer lebih dari satu kali selama popup
   * masih terbuka.
   */
  const countedArticleIdRef =
    useRef<string | null>(null);

  /*
   * Menyimpan ID artikel yang sedang aktif.
   * Hasil request artikel lama tidak akan
   * mengubah jumlah viewer artikel baru.
   */
  const activeArticleIdRef =
    useRef<string | null>(null);

  useEffect(() => {
    if (!article?.id) {
      countedArticleIdRef.current = null;
      activeArticleIdRef.current = null;
      setCurrentViews(0);

      return;
    }

    const articleId = String(article.id);

    activeArticleIdRef.current = articleId;

    setCurrentViews(
      Number(article.views ?? 0),
    );

    /*
     * Jangan mencatat ulang jika artikel yang
     * sama masih terbuka dan komponen hanya
     * melakukan render ulang.
     */
    if (
      countedArticleIdRef.current ===
      articleId
    ) {
      return;
    }

    countedArticleIdRef.current =
      articleId;

    const recordArticleView =
      async (): Promise<void> => {
        try {
          const latestViews =
            await incrementArticleViews(
              articleId,
            );

          /*
           * Perbarui jumlah viewer hanya jika
           * artikel tersebut masih aktif.
           */
          if (
            activeArticleIdRef.current ===
            articleId
          ) {
            setCurrentViews(latestViews);
          }
        } catch (error) {
          console.error(
            'Gagal menambahkan viewer artikel:',
            error,
          );

          /*
           * Izinkan pencatatan ulang jika
           * penambahan viewer gagal.
           */
          if (
            activeArticleIdRef.current ===
            articleId
          ) {
            countedArticleIdRef.current =
              null;
          }
        }
      };

    void recordArticleView();
  }, [article?.id, article?.views]);

  /*
   * Menutup popup menggunakan tombol Escape
   * dan mencegah halaman belakang ikut scroll.
   */
  useEffect(() => {
    if (!article) {
      return;
    }

    const handleEscape = (
      event: KeyboardEvent,
    ): void => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    const previousOverflow =
      document.body.style.overflow;

    document.body.style.overflow =
      'hidden';

    document.addEventListener(
      'keydown',
      handleEscape,
    );

    return () => {
      document.body.style.overflow =
        previousOverflow;

      document.removeEventListener(
        'keydown',
        handleEscape,
      );
    };
  }, [article, onClose]);

  if (!article) {
    return null;
  }

  const formatDate = (
    dateString?: string | null,
  ): string => {
    if (!dateString) {
      return '-';
    }

    try {
      const date = new Date(dateString);

      if (Number.isNaN(date.getTime())) {
        return dateString;
      }

      return date.toLocaleDateString(
        'id-ID',
        {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        },
      );
    } catch {
      return dateString;
    }
  };

  const articleImage =
    article.thumbnail_url ||
    article.image_url ||
    article.image ||
    '';

  const articleDate =
    article.created_at ||
    article.date;

  const articleContent =
    article.content ||
    article.description ||
    '';

  const containsHtml =
    /<\/?[a-z][\s\S]*>/i.test(
      articleContent,
    );

  const cleanedHtmlContent =
    containsHtml
      ? normalizeArticleHtml(
          articleContent,
        )
      : '';

  const handleOverlayClick = (
    event: React.MouseEvent<HTMLDivElement>,
  ): void => {
    if (
      event.target === event.currentTarget
    ) {
      onClose();
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="article-popup-title"
      className="fixed inset-0 z-[100] bg-neutral-900/80 backdrop-blur-sm flex items-center justify-center p-0 md:p-6"
      onClick={handleOverlayClick}
    >
      <div
        className="bg-white w-full h-full md:max-w-6xl md:h-[95vh] md:rounded-[32px] overflow-hidden shadow-2xl relative animate-in zoom-in-95 duration-300 flex flex-col"
        onClick={(event) =>
          event.stopPropagation()
        }
      >
        {/* Tombol tutup */}
        <div className="absolute top-0 left-0 w-full p-4 flex justify-end z-20 pointer-events-none">
          <button
            type="button"
            onClick={onClose}
            aria-label="Tutup artikel"
            className="pointer-events-auto bg-black/30 hover:bg-black/50 text-white p-3 rounded-full backdrop-blur-md transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Kontainer yang dapat di-scroll */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden custom-scrollbar">
          {/* Gambar utama artikel */}
          {articleImage ? (
            <div className="w-full h-[40vh] md:h-[50vh] relative shrink-0 bg-neutral-200">
              <img
                src={articleImage}
                alt={article.title}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />

              <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-transparent" />
            </div>
          ) : (
            <div className="w-full h-40 md:h-52 bg-neutral-200 flex items-center justify-center text-neutral-400">
              Gambar artikel tidak tersedia
            </div>
          )}

          {/* Judul dan informasi artikel */}
          <div className="max-w-4xl mx-auto px-6 pt-10 md:pt-16 pb-8 md:pb-12 text-center">
            <h1
              id="article-popup-title"
              className="text-3xl md:text-5xl font-black font-display text-neutral-900 leading-tight mb-6"
            >
              {article.title}
            </h1>

            <div className="flex flex-wrap items-center justify-center gap-4 md:gap-6 text-sm font-semibold text-neutral-500 uppercase tracking-wider">
              {/* Penulis */}
              <span className="flex items-center gap-2">
                <span className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center">
                  <User className="w-4 h-4 text-amber-600" />
                </span>

                {article.author?.trim() ||
                  'JavaSpot'}
              </span>

              {/* Tanggal */}
              <span className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />

                {formatDate(articleDate)}
              </span>

              {/* Jumlah viewer */}
              <span className="flex items-center gap-2">
                <Eye className="w-4 h-4" />

                {currentViews.toLocaleString(
                  'id-ID',
                )}{' '}
                kali dibaca
              </span>
            </div>
          </div>

          {/* Pembatas */}
          <div className="max-w-3xl mx-auto w-full h-px bg-neutral-100 mb-10" />

          {/* Isi artikel */}
          <div className="max-w-4xl mx-auto px-6 md:px-12 pb-20">
            {!articleContent ? (
              <div className="py-12 text-center text-neutral-500">
                Isi artikel belum tersedia.
              </div>
            ) : containsHtml ? (
              <div
                className="
                  article-content
                  prose
                  prose-lg
                  prose-neutral
                  max-w-none
                  text-neutral-800
                  leading-relaxed
                  break-words
                  prose-headings:font-display
                  prose-headings:font-bold
                  prose-headings:text-left
                  prose-a:text-[#2c5340]
                  hover:prose-a:text-[#1e3c2e]
                  prose-img:rounded-2xl
                  prose-img:shadow-sm
                "
                dangerouslySetInnerHTML={{
                  __html:
                    cleanedHtmlContent,
                }}
              />
            ) : (
              <div className="article-content prose prose-lg prose-neutral max-w-none text-neutral-800 leading-relaxed space-y-6 break-words">
                {articleContent
                  .split(/\n+/)
                  .map(
                    (
                      paragraph,
                      index,
                    ) => {
                      const cleanedParagraph =
                        normalizePlainParagraph(
                          paragraph,
                        );

                      if (
                        !cleanedParagraph
                      ) {
                        return null;
                      }

                      return (
                        <p key={index}>
                          {cleanedParagraph}
                        </p>
                      );
                    },
                  )}
              </div>
            )}
          </div>
        </div>

        <style>{`
          /*
           * Teks rata kiri untuk layar kecil.
           * Tampilan ini lebih nyaman dibaca
           * dan tidak menimbulkan renggang besar.
           */
          .article-content p {
            margin-top: 0;
            margin-bottom: 1.5rem;
            text-align: left;
            text-align-last: left;
            white-space: normal;
            word-spacing: normal;
            overflow-wrap: break-word;
          }

          /*
           * Rata kanan-kiri hanya digunakan
           * pada layar tablet dan desktop.
           */
          @media (min-width: 768px) {
            .article-content p {
              text-align: justify;
              text-align-last: left;
            }
          }

          /*
           * Judul tidak ikut dibuat rata
           * kanan-kiri.
           */
          .article-content h1,
          .article-content h2,
          .article-content h3,
          .article-content h4,
          .article-content h5,
          .article-content h6 {
            text-align: left;
            text-align-last: left;
          }

          /*
           * Daftar lebih nyaman menggunakan
           * rata kiri.
           */
          .article-content ul,
          .article-content ol,
          .article-content li {
            text-align: left;
            text-align-last: left;
          }

          /*
           * Mencegah gambar artikel keluar
           * dari lebar kontainer.
           */
          .article-content img {
            max-width: 100%;
            height: auto;
          }

          /*
           * Tampilan scrollbar popup.
           */
          .custom-scrollbar::-webkit-scrollbar {
            width: 8px;
          }

          .custom-scrollbar::-webkit-scrollbar-track {
            background: #f5f5f5;
          }

          .custom-scrollbar::-webkit-scrollbar-thumb {
            background: #b8b8b8;
            border-radius: 9999px;
          }

          .custom-scrollbar::-webkit-scrollbar-thumb:hover {
            background: #888888;
          }
        `}</style>
      </div>
    </div>
  );
}