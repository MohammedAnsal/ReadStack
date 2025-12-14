import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import Image from "@tiptap/extension-image";
import { articleService } from "../../services/api/article.api";
import { toast } from "react-hot-toast";
import type { Article } from "../../types/article.types";
import { getUserIdFromToken } from "../../utils/jwt.utils";
import Navbar from "../../components/layouts/Navbar";
import { ConfirmationModal } from "../../components/common/ConfirmationModal";

const SingleArticle = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isInteracting, setIsInteracting] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showBlockModal, setShowBlockModal] = useState(false);
  const currentUserId = getUserIdFromToken();

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3],
        },
        bulletList: {
          keepMarks: true,
          keepAttributes: false,
        },
        orderedList: {
          keepMarks: true,
          keepAttributes: false,
        },
        blockquote: {
          HTMLAttributes: {
            class: "border-l-4 border-gray-300 pl-4 italic my-4",
          },
        },
      }),
      Underline,
      Image.configure({
        HTMLAttributes: { class: "rounded-lg my-4 max-h-96 object-cover" },
        inline: false,
      }),
    ],
    content: "",
    editable: false,
    editorProps: {
      attributes: {
        class:
          "prose prose-lg max-w-none focus:outline-none text-gray-900 px-4 py-3",
      },
    },
  });

  useEffect(() => {
    if (id) {
      fetchArticle();
    }
  }, [id]);

  useEffect(() => {
    if (article && editor) {
      editor.commands.setContent(article.content as any);
    }
  }, [article, editor]);

  const fetchArticle = async () => {
    if (!id) return;
    try {
      setLoading(true);
      const response = await articleService.getArticle(id);
      if (response.article) {
        // Check if article is blocked by current user
        const isBlocked =
          currentUserId && response.article.blockedBy.includes(currentUserId);
        if (isBlocked) {
          toast.error("This article is blocked");
          navigate("/articles/feed");
          return;
        }
        setArticle(response.article);
      } else {
        toast.error("Article not found");
        navigate("/articles/feed");
      }
    } catch (error) {
      console.error("Error fetching article:", error);
      toast.error("Failed to load article");
      navigate("/articles/feed");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!id) return;

    setShowDeleteModal(false);
    try {
      setIsDeleting(true);
      await articleService.deleteArticle(id);
      toast.success("Article deleted successfully");
      navigate("/articles/feed");
    } catch (error) {
      console.error("Error deleting article:", error);
      toast.error("Failed to delete article");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleDeleteClick = () => {
    setShowDeleteModal(true);
  };

  const handleLike = async () => {
    if (!id || isInteracting || !currentUserId) return;

    try {
      setIsInteracting(true);
      const response = await articleService.likeArticle(id);
      if (response.success && response.article) {
        setArticle(response.article);
        toast.success("Like updated");
      }
    } catch (error) {
      console.error("Error liking article:", error);
      toast.error("Failed to like article");
    } finally {
      setIsInteracting(false);
    }
  };

  const handleDislike = async () => {
    if (!id || isInteracting || !currentUserId) return;

    try {
      setIsInteracting(true);
      const response = await articleService.dislikeArticle(id);
      if (response.success && response.article) {
        setArticle(response.article);
        toast.success("Dislike updated");
      }
    } catch (error) {
      console.error("Error disliking article:", error);
      toast.error("Failed to dislike article");
    } finally {
      setIsInteracting(false);
    }
  };

  const handleBlock = async () => {
    if (!id || isInteracting || !currentUserId) return;

    setShowBlockModal(false);
    try {
      setIsInteracting(true);
      const response = await articleService.toggleBlock(id);
      if (response.success && response.article) {
        const isBlocked = response.article.blockedBy.includes(currentUserId);
        if (isBlocked) {
          toast.success("Article blocked. Redirecting to feed...");
          setTimeout(() => {
            navigate("/articles/feed");
          }, 1000);
        } else {
          setArticle(response.article);
          toast.success("Article unblocked");
        }
      }
    } catch (error) {
      console.error("Error blocking article:", error);
      toast.error("Failed to block article");
    } finally {
      setIsInteracting(false);
    }
  };

  const handleBlockClick = () => {
    if (!id || isInteracting || !currentUserId) return;
    setShowBlockModal(true);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
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

  if (loading) {
    return (
      <main className="min-h-screen bg-linear-to-br from-gray-50 via-white to-gray-50">
        <Navbar />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading article...</p>
          </div>
        </div>
      </main>
    );
  }

  if (!article) {
    return (
      <main className="min-h-screen bg-linear-to-br from-gray-50 via-white to-gray-50">
        <Navbar />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <p className="text-lg font-semibold text-gray-700 mb-2">
              Article not found
            </p>
            <Link
              to="/articles/feed"
              className="text-blue-600 hover:text-blue-700 font-medium transition-colors"
            >
              ← Back to feed
            </Link>
          </div>
        </div>
      </main>
    );
  }

  const authorId =
    typeof article.author === "string" ? article.author : article.author._id;
  const authorName = getAuthorName(article.author);

  const isOwner = currentUserId && authorId === currentUserId;
  const isLiked = currentUserId && article.likes.includes(currentUserId);
  const isDisliked = currentUserId && article.dislikes.includes(currentUserId);
  const isBlocked = currentUserId && article.blockedBy.includes(currentUserId);

  return (
    <main className="min-h-screen bg-linear-to-br from-gray-50 via-white to-gray-50 text-gray-900">
      <Navbar />
      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 animate-fade-in">
        {/* Header */}
        <header className="mb-8">
          <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
            <div className="flex items-center gap-2 text-sm text-gray-500 flex-wrap">
              <span className="font-semibold text-gray-800">{authorName}</span>
              <span>•</span>
              <span>{formatDate(article.createdAt)}</span>
              <span>•</span>
              <span>{calculateReadTime(article.content)}</span>
              <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium">
                {article.category}
              </span>
            </div>
            {isOwner && (
              <div className="flex gap-3">
                {isOwner && (
                  <span className="px-2 py-2 text-xs font-semibold text-green-700 bg-green-100 border border-green-200 rounded-full">
                    Written by you
                  </span>
                )}

                <button
                  onClick={() => navigate(`/articles/${article._id}/edit`)}
                  className="px-4 py-2 text-sm font-medium text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-all duration-300 transform hover:scale-105 active:scale-95"
                >
                  Edit
                </button>
                <button
                  onClick={handleDeleteClick}
                  disabled={isDeleting}
                  className="px-4 py-2 text-sm font-medium text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-all duration-300 transform hover:scale-105 active:scale-95 disabled:opacity-50"
                >
                  {isDeleting ? "Deleting..." : "Delete"}
                </button>
              </div>
            )}
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-black leading-tight mb-4 animate-slide-down">
            {article.title}
          </h1>
        </header>

        {/* Featured Image */}
        {article.featuredImage && (
          <div className="mb-8 rounded-xl overflow-hidden shadow-lg animate-fade-in-up">
            <img
              src={article.featuredImage}
              alt={article.title}
              className="w-full h-auto object-cover"
            />
          </div>
        )}

        {/* Content */}
        <div className="border border-gray-200 rounded-xl shadow-sm bg-white overflow-hidden mb-8 animate-fade-in-up-delay">
          <EditorContent editor={editor} />
        </div>

        {/* Interaction Buttons */}
        <div className="flex flex-wrap items-center justify-between gap-4 p-6 bg-white border border-gray-200 rounded-xl shadow-sm animate-fade-in-up-delay-2">
          <div className="flex items-center gap-3 flex-wrap">
            {/* Like Button */}
            <button
              onClick={handleLike}
              disabled={isInteracting || !currentUserId}
              className={[
                "flex items-center gap-2 px-5 py-3 rounded-full text-sm font-medium transition-all duration-300 transform hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed",
                isLiked
                  ? "bg-red-50 text-red-600 hover:bg-red-100 border-2 border-red-200 shadow-sm"
                  : "bg-gray-50 text-gray-600 hover:bg-gray-100 border-2 border-gray-200",
              ].join(" ")}
            >
              <svg
                className={`w-5 h-5 transition-all duration-300 ${
                  isLiked ? "fill-red-600 scale-110" : "fill-none"
                }`}
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
              <span className="font-semibold">{article.likes.length}</span>
            </button>

            {/* Dislike Button */}
            <button
              onClick={handleDislike}
              disabled={isInteracting || !currentUserId}
              className={[
                "flex items-center gap-2 px-5 py-3 rounded-full text-sm font-medium transition-all duration-300 transform hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed",
                isDisliked
                  ? "bg-gray-800 text-white hover:bg-gray-900 border-2 border-gray-900 shadow-sm"
                  : "bg-gray-50 text-gray-600 hover:bg-gray-100 border-2 border-gray-200",
              ].join(" ")}
            >
              <svg
                className={`w-5 h-5 transition-all duration-300 ${
                  isDisliked ? "rotate-180 scale-110" : ""
                }`}
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
              <span className="font-semibold">{article.dislikes.length}</span>
            </button>
          </div>

          {/* Block Button (for all users) */}
          {currentUserId && (
            <button
              onClick={handleBlockClick}
              disabled={isInteracting}
              className={[
                "flex items-center gap-2 px-5 py-3 rounded-full text-sm font-medium transition-all duration-300 transform hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed",
                isBlocked
                  ? "bg-green-50 text-green-700 hover:bg-green-100 border-2 border-green-200 shadow-sm"
                  : "bg-orange-50 text-orange-700 hover:bg-orange-100 border-2 border-orange-200",
              ].join(" ")}
            >
              <svg
                className="w-5 h-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                {isBlocked ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"
                  />
                )}
              </svg>
              <span>{isBlocked ? "Unblock" : "Block Article"}</span>
            </button>
          )}
        </div>

        {/* Footer */}
        <footer className="mt-8 pt-6 border-t border-gray-200">
          <Link
            to="/articles/feed"
            className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium transition-colors duration-200 group"
          >
            <svg
              className="w-5 h-5 transform group-hover:-translate-x-1 transition-transform duration-200"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            Back to feed
          </Link>
        </footer>
      </article>

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDelete}
        title="Delete Article"
        message="Are you sure you want to delete this article? This action cannot be undone and the article will be permanently removed."
        confirmText="Delete Article"
        confirmButtonColor="red"
        isLoading={isDeleting}
        loadingText="Deleting..."
        icon={
          <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full">
            <svg
              className="w-8 h-8 text-red-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>
        }
      />

      {/* Block Confirmation Modal */}
      <ConfirmationModal
        isOpen={showBlockModal}
        onClose={() => setShowBlockModal(false)}
        onConfirm={handleBlock}
        title={isBlocked ? "Unblock Article" : "Block Article"}
        message={
          isBlocked
            ? "Are you sure you want to unblock this article? You will be able to see it in your feed again."
            : "Are you sure you want to block this article? It will be hidden from your feed and you'll be redirected back to the feed page."
        }
        confirmText={isBlocked ? "Unblock Article" : "Block Article"}
        confirmButtonColor={isBlocked ? "green" : "orange"}
        isLoading={isInteracting}
        loadingText="Processing..."
        icon={
          <div
            className={`flex items-center justify-center w-16 h-16 mx-auto mb-4 rounded-full ${
              isBlocked ? "bg-green-100" : "bg-orange-100"
            }`}
          >
            <svg
              className={`w-8 h-8 ${
                isBlocked ? "text-green-600" : "text-orange-600"
              }`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              {isBlocked ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"
                />
              )}
            </svg>
          </div>
        }
      />

      {/* Custom Styles */}
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

        .animate-fade-in-up {
          animation: fade-in-up 0.6s ease-out;
        }

        .animate-fade-in-up-delay {
          animation: fade-in-up 0.6s ease-out 0.2s both;
        }

        .animate-fade-in-up-delay-2 {
          animation: fade-in-up 0.6s ease-out 0.4s both;
        }

      `}</style>
    </main>
  );
};

export default SingleArticle;
