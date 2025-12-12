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

const SingleArticle = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
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
        setArticle(response.article);
        console.log(article);
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
    if (!window.confirm("Are you sure you want to delete this article?")) {
      return;
    }

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

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
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
      <main className="min-h-screen bg-white">
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
      <main className="min-h-screen bg-white">
        <Navbar />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <p className="text-lg font-semibold text-gray-700 mb-2">
              Article not found
            </p>
            <Link
              to="/articles/feed"
              className="text-blue-600 hover:text-blue-700"
            >
              Back to feed
            </Link>
          </div>
        </div>
      </main>
    );
  }

  const authorId =
    typeof article.author === "string" ? article.author : article.author._id;
  const authorName =
    typeof article.author === "string" ? "Unknown" : article.author.userName;
  const isOwner = currentUserId && authorId === currentUserId;

  return (
    <main className="min-h-screen bg-white text-gray-900">
      <Navbar />
      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Header */}
        <header className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <span className="font-semibold text-gray-800">{authorName}</span>
              <span>•</span>
              <span>{formatDate(article.createdAt)}</span>
              <span>•</span>
              <span>{calculateReadTime(article.content)}</span>
              <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs">
                {article.category}
              </span>
            </div>
            {isOwner && (
              <div className="flex gap-2">
                <button
                  onClick={() => navigate(`/articles/${article._id}/edit`)}
                  className="px-4 py-2 text-sm font-medium text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-md transition-colors"
                >
                  Edit
                </button>
                <button
                  onClick={handleDelete}
                  disabled={isDeleting}
                  className="px-4 py-2 text-sm font-medium text-red-600 hover:text-red-700 hover:bg-red-50 rounded-md transition-colors disabled:opacity-50"
                >
                  {isDeleting ? "Deleting..." : "Delete"}
                </button>
              </div>
            )}
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-black leading-tight mb-4">
            {article.title}
          </h1>
        </header>

        {/* Featured Image */}
        {article.featuredImage && (
          <div className="mb-8">
            <img
              src={article.featuredImage}
              alt={article.title}
              className="w-full h-auto rounded-xl object-cover"
            />
          </div>
        )}

        {/* Content */}
        <div className="border border-gray-200 rounded-xl shadow-sm bg-white overflow-hidden">
          <EditorContent editor={editor} />
        </div>

        {/* Footer */}
        <footer className="mt-12 pt-8 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <Link
              to="/articles/feed"
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              ← Back to feed
            </Link>
            <div className="flex items-center gap-4 text-sm text-gray-500">
              <span>{article.likes.length} likes</span>
              <span>•</span>
              <span>{article.dislikes.length} dislikes</span>
            </div>
          </div>
        </footer>
      </article>
    </main>
  );
};

export default SingleArticle;
