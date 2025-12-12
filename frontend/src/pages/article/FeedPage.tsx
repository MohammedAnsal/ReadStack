import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../../components/layouts/Navbar";
import { articleService } from "../../services/api/article.api";
import { toast } from "react-hot-toast";
import type { Article } from "../../types/article.types";
import { getUserIdFromToken } from "../../utils/jwt.utils";

export const FeedPage = () => {
  const navigate = useNavigate();
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTag, setActiveTag] = useState<string | null>(null);
  const currentUserId = getUserIdFromToken();

  const tags = ["All", "Design", "AI", "Writing", "Product"];

  useEffect(() => {
    fetchArticles();
  }, []);

  const fetchArticles = async () => {
    try {
      setLoading(true);
      const response = await articleService.getFeed();
      if (response.success && response.articles) {
        setArticles(response.articles);
      }
    } catch (error) {
      console.error("Error fetching articles:", error);
      toast.error("Failed to load articles");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (articleId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!window.confirm("Are you sure you want to delete this article?")) {
      return;
    }

    try {
      await articleService.deleteArticle(articleId);
      toast.success("Article deleted successfully");
      fetchArticles();
    } catch (error) {
      console.error("Error deleting article:", error);
      toast.error("Failed to delete article");
    }
  };

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
    const contentObj = content as { content?: Array<{ content?: Array<{ text?: string }> }> };
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

  const calculateReadTime = (content: unknown): string => {
    const excerpt = getExcerpt(content);
    const words = excerpt.split(/\s+/).length;
    const minutes = Math.ceil(words / 200);
    return `${minutes} min read`;
  };

  const filtered =
    activeTag && activeTag !== "All"
      ? articles.filter((a) => a.category === activeTag)
      : articles;

  return (
    <main className="min-h-screen bg-white text-gray-900">
      {/* Hero */}
      <Navbar/>
      <section className="border-b border-gray-200 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <p className="text-sm uppercase tracking-[0.2em] text-gray-500">Feed</p>
          <h1 className="mt-3 text-4xl md:text-5xl font-bold text-black leading-tight">
            Discover stories from the community
          </h1>
          <p className="mt-3 text-lg text-gray-600 max-w-2xl">
            Curated reads to help you write better, think clearer, and stay inspired.
          </p>
        </div>
      </section>

      {/* Filters */}
      <section className="border-b border-gray-200 bg-white/80 backdrop-blur">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-wrap gap-2">
          {tags.map((tag) => {
            const active = activeTag === tag || (!activeTag && tag === "All");
            return (
              <button
                key={tag}
                onClick={() => setActiveTag(tag === "All" ? null : tag)}
                className={[
                  "px-4 py-2 rounded-full text-sm font-medium transition-colors",
                  active
                    ? "bg-black text-white shadow-sm"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200",
                ].join(" ")}
              >
                {tag}
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
            <p className="mt-4 text-gray-600">Loading articles...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center border border-dashed border-gray-300 rounded-2xl p-10">
            <p className="text-lg font-semibold text-gray-700 mb-2">No articles yet</p>
            <p className="text-gray-500 mb-6">
              When new stories arrive, they’ll appear here. Be the first to write one.
            </p>
            <Link
              to="/articles/create"
              className="inline-block px-6 py-3 bg-black text-white rounded-full text-sm font-semibold hover:bg-gray-800 transition-colors"
            >
              Write your first article
            </Link>
          </div>
        ) : (
          <div className="space-y-8">
            {filtered.map((article) => {
              const authorId = typeof article.author === "string" ? article.author : article.author._id;
              const authorName = typeof article.author === "string" ? "Unknown" : article.author.userName;
              const isOwner = currentUserId && authorId === currentUserId;
              return (
                <article
                  key={article._id}
                  className="border-b border-gray-200 pb-6 last:border-none"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <span className="font-semibold text-gray-800">
                        {authorName}
                      </span>
                      <span>•</span>
                      <span>{formatDate(article.createdAt)}</span>
                      <span>•</span>
                      <span>{calculateReadTime(article.content)}</span>
                      <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-[11px]">
                        {article.category}
                      </span>
                    </div>
                    {isOwner && (
                      <div className="flex gap-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/articles/${article._id}/edit`);
                          }}
                          className="px-3 py-1 text-xs font-medium text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-md transition-colors"
                        >
                          Edit
                        </button>
                        <button
                          onClick={(e) => handleDelete(article._id, e)}
                          className="px-3 py-1 text-xs font-medium text-red-600 hover:text-red-700 hover:bg-red-50 rounded-md transition-colors"
                        >
                          Delete
                        </button>
                      </div>
                    )}
                  </div>
                  <Link to={`/articles/${article._id}`} className="group block">
                    {article.featuredImage && (
                      <img
                        src={article.featuredImage}
                        alt={article.title}
                        className="w-full h-64 object-cover rounded-xl mb-4"
                      />
                    )}
                    <h2 className="text-2xl font-bold text-black group-hover:text-gray-700 transition-colors">
                      {article.title}
                    </h2>
                    <p className="mt-2 text-gray-600 line-clamp-2">
                      {getExcerpt(article.content)}
                    </p>
                  </Link>
                </article>
              );
            })}
          </div>
        )}
      </section>
    </main>
  );
};