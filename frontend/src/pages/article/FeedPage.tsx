import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Navbar from "../../components/layouts/Navbar";
import { articleService } from "../../services/api/article.api";
import { userService } from "../../services/api/user.api";
import { toast } from "react-hot-toast";
import type { Article } from "../../types/article.types";
import { getUserIdFromToken } from "../../utils/jwt.utils";

export const FeedPage = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTag, setActiveTag] = useState<string | null>(null);
  const [userPreferences, setUserPreferences] = useState<string[]>([]);
  const currentUserId = getUserIdFromToken();

  // Get unique tags from articles and user preferences
  const getAvailableTags = () => {
    const articleCategories = new Set<string>();
    articles.forEach((article) => {
      if (article.category) {
        articleCategories.add(article.category);
      }
    });

    // Combine user preferences and article categories, prioritize user preferences
    const allTags = new Set<string>();
    userPreferences.forEach((pref) => {
      if (articleCategories.has(pref)) {
        allTags.add(pref);
      }
    });
    articleCategories.forEach((cat) => allTags.add(cat));

    return ["All", ...Array.from(allTags).sort()];
  };

  const tags = getAvailableTags();

  useEffect(() => {
    const initializeData = async () => {
      await fetchUserPreferences();
      await fetchArticles();
    };
    initializeData();
  }, []);

  const fetchUserPreferences = async () => {
    try {
      const response = await userService.getProfile();
      if (response.success && response.user?.preferences) {
        setUserPreferences(response.user.preferences);
      }
    } catch (error) {
      // Silently fail - user might not be logged in or preferences might not be set
      console.log("Could not fetch user preferences");
    }
  };

  const fetchArticles = async () => {
    try {
      setLoading(true);
      const response = await articleService.getFeed();
      console.log(response);
      if (response.success && response.articles) {
        // Filter out articles blocked by current user (client-side backup)
        let filteredArticles = currentUserId
          ? response.articles.filter(
              (article) => !article.blockedBy.includes(currentUserId)
            )
          : response.articles;

        setArticles(filteredArticles);
      }
    } catch (error) {
      console.error("Error fetching articles:", error);
      toast.error("Failed to load articles");
    } finally {
      setLoading(false);
    }
  };

  // Sort articles when preferences change
  useEffect(() => {
    if (articles.length > 0 && userPreferences.length > 0) {
      setArticles((prevArticles) => {
        const sorted = [...prevArticles].sort((a, b) => {
          const aInPreferences = userPreferences.includes(a.category);
          const bInPreferences = userPreferences.includes(b.category);

          if (aInPreferences && !bInPreferences) return -1;
          if (!aInPreferences && bInPreferences) return 1;

          // If both are in preferences or both are not, maintain original order
          return 0;
        });
        return sorted;
      });
    }
  }, [userPreferences]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "Yesterday";
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  };

  const getExcerpt = (content: unknown): string => {
    if (!content || typeof content !== "object") return "";
    const contentObj = content as {
      content?: Array<{ content?: Array<{ text?: string }> }>;
    };
    if (!contentObj.content || !Array.isArray(contentObj.content)) return "";

    let text = "";
    for (const node of contentObj.content) {
      if (node.content && Array.isArray(node.content)) {
        for (const item of node.content) {
          if (item.text) {
            text += item.text + " ";
            if (text.length > 150) break;
          }
        }
      }
      if (text.length > 150) break;
    }
    return text.trim().substring(0, 150) + (text.length > 150 ? "..." : "");
  };

  const getAuthorName = (author: Article["author"]) => {
    if (typeof author === "string") {
      return "Unknown author";
    }

    const first = author.firstName ?? "";
    const last = author.lastName ?? "";

    return `${first} ${last}`.trim() || "Unknown author";
  };
  const calculateReadTime = (content: unknown): string => {
    if (!content || typeof content !== "object") return "1 min read";
    const contentObj = content as {
      content?: Array<{ content?: Array<{ text?: string }> }>;
    };
    if (!contentObj.content || !Array.isArray(contentObj.content))
      return "1 min read";

    let text = "";
    for (const node of contentObj.content) {
      if (node.content && Array.isArray(node.content)) {
        for (const item of node.content) {
          if (item.text) {
            text += item.text + " ";
          }
        }
      }
    }
    const words = text.trim().split(/\s+/).length;
    const minutes = Math.ceil(words / 200);
    return `${minutes} min read`;
  };

  const filtered =
    activeTag && activeTag !== "All"
      ? articles.filter((a) => a.category === activeTag)
      : articles;

  return (
    <main className="min-h-screen bg-linear-to-br from-gray-50 via-white to-gray-50 text-gray-900">
      {/* Hero */}
      <Navbar />
      <section className="border-b border-gray-200 bg-white/80 backdrop-blur-sm">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 animate-fade-in">
          <p className="text-sm uppercase tracking-[0.2em] text-gray-500 animate-slide-down">
            Feed
          </p>
          <h1 className="mt-3 text-4xl md:text-5xl font-bold text-black leading-tight animate-slide-down-delay">
            Discover stories from the community
          </h1>
          <p className="mt-3 text-lg text-gray-600 max-w-2xl animate-slide-down-delay-2">
            Curated reads to help you write better, think clearer, and stay
            inspired.
          </p>
        </div>
      </section>

      {/* Filters */}
      <section className="border-b border-gray-200 bg-white/60 backdrop-blur sticky top-0 z-10 transition-all duration-300">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-wrap gap-2">
          {tags.map((tag, index) => {
            const active = activeTag === tag || (!activeTag && tag === "All");
            const isPreferred = userPreferences.includes(tag);
            return (
              <button
                key={tag}
                onClick={() => setActiveTag(tag === "All" ? null : tag)}
                style={{ animationDelay: `${index * 50}ms` }}
                className={[
                  "px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 transform hover:scale-105 active:scale-95 relative",
                  active
                    ? "bg-black text-white shadow-md shadow-black/10"
                    : isPreferred
                    ? "bg-blue-100 text-blue-700 hover:bg-blue-200 hover:shadow-sm border border-blue-300"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200 hover:shadow-sm",
                ].join(" ")}
                title={isPreferred ? "Your preferred category" : ""}
              >
                {tag}
                {isPreferred && !active && (
                  <span className="absolute -top-1 -right-1 w-2 h-2 bg-blue-500 rounded-full"></span>
                )}
              </button>
            );
          })}
        </div>
      </section>

      {/* Feed List */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {loading ? (
          <div className="text-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto"></div>
            <p className="mt-4 text-gray-600 animate-pulse">
              Loading articles...
            </p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center border border-dashed border-gray-300 rounded-2xl p-10 animate-fade-in">
            <p className="text-lg font-semibold text-gray-700 mb-2">
              No articles yet
            </p>
            <p className="text-gray-500 mb-6">
              When new stories arrive, they'll appear here. Be the first to
              write one.
            </p>
            <Link
              to="/articles/create"
              className="inline-block px-6 py-3 bg-black text-white rounded-full text-sm font-semibold hover:bg-gray-800 transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl"
            >
              Write your first article
            </Link>
          </div>
        ) : (
          <div className="space-y-8">
            {filtered.map((article, index) => {
              const authorId =
                typeof article.author === "string"
                  ? article.author
                  : article.author._id;
              const authorName = getAuthorName(article.author);

              const isOwner = currentUserId && authorId === currentUserId;

              return (
                <article
                  key={article._id}
                  style={{ animationDelay: `${index * 100}ms` }}
                  className="border border-gray-200 rounded-2xl p-6 bg-white shadow-sm hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 animate-fade-in-up group"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2 text-xs text-gray-500 flex-wrap">
                      <span className="font-semibold text-gray-800">
                        {authorName}
                      </span>
                      <span>•</span>
                      <span>{formatDate(article.createdAt)}</span>
                      <span>•</span>
                      <span>{calculateReadTime(article.content)}</span>
                      <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-[11px] font-medium">
                        {article.category}
                      </span>
                    </div>
                    {isOwner && (
                      <span className="px-3 py-1 text-xs font-semibold text-green-700 bg-green-100 border border-green-200 rounded-full">
                        Written by you
                      </span>
                    )}
                  </div>

                  <Link
                    to={`/articles/${article._id}`}
                    className="group/link block"
                  >
                    {article.featuredImage && (
                      <div className="overflow-hidden rounded-xl mb-4 group-hover:shadow-md transition-shadow duration-300">
                        <img
                          src={article.featuredImage}
                          alt={article.title}
                          className="w-full h-64 object-cover group-hover/link:scale-105 transition-transform duration-500"
                        />
                      </div>
                    )}
                    <h2 className="text-2xl font-bold text-black group-hover/link:text-gray-700 transition-colors duration-200 mb-2">
                      {article.title}
                    </h2>
                    <p className="mt-2 text-gray-600 line-clamp-2 group-hover/link:text-gray-700 transition-colors duration-200">
                      {getExcerpt(article.content)}
                    </p>
                  </Link>

                  {/* Stats Display */}
                  <div className="mt-4 pt-4 border-t border-gray-100 flex items-center gap-4 text-sm text-gray-500">
                    <div className="flex items-center gap-2">
                      <svg
                        className="w-4 h-4 text-red-500"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                        />
                      </svg>
                      <span className="font-semibold text-gray-700">
                        {article.likes.length}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <svg
                        className="w-4 h-4 text-gray-600 rotate-180"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                        />
                      </svg>
                      <span className="font-semibold text-gray-700">
                        {article.dislikes.length}
                      </span>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>

      {/* Add Custom Styles */}
      <style>{`
        @keyframes fade-in {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes slide-down {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-in {
          animation: fade-in 0.6s ease-out;
        }

        .animate-slide-down {
          animation: slide-down 0.6s ease-out;
        }

        .animate-slide-down-delay {
          animation: slide-down 0.6s ease-out 0.1s both;
        }

        .animate-slide-down-delay-2 {
          animation: slide-down 0.6s ease-out 0.2s both;
        }

        .animate-fade-in-up {
          animation: fade-in-up 0.5s ease-out both;
        }
      `}</style>
    </main>
  );
};
