import { useRef, useState, useEffect } from "react";
import { useNavigate, Link, useParams } from "react-router-dom";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import Placeholder from "@tiptap/extension-placeholder";
import Image from "@tiptap/extension-image";
import { toast } from "react-hot-toast";
import { articleService } from "../../services/api/article.api";

const ToolbarButton = ({
  onClick,
  active,
  children,
  disabled = false,
}: {
  onClick: () => void;
  active?: boolean;
  children: React.ReactNode;
  disabled?: boolean;
}) => (
  <button
    type="button"
    onClick={onClick}
    disabled={disabled}
    className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all duration-200 ${
      active
        ? "bg-blue-600 text-white shadow-sm font-semibold"
        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
    } ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
  >
    {children}
  </button>
);

const EditArticle = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [title, setTitle] = useState("");
  const [tag, setTag] = useState("");
  const [featuredImageFile, setFeaturedImageFile] = useState<File | null>(null);
  const [featuredImagePreview, setFeaturedImagePreview] = useState<
    string | null
  >(null);
  const [existingImageUrl, setExistingImageUrl] = useState<string | null>(null);
  const [existingImageId, setExistingImageId] = useState<string | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [, setEditorState] = useState(0);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

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
      Placeholder.configure({
        placeholder: "Write your story...",
      }),
    ],
    content: "",
    editorProps: {
      attributes: {
        class:
          "prose prose-lg max-w-none min-h-[400px] focus:outline-none text-gray-900 px-4 py-3",
      },
    },
    onUpdate: () => {
      setEditorState((prev) => prev + 1);
    },
    onSelectionUpdate: () => {
      setEditorState((prev) => prev + 1);
    },
  });

  useEffect(() => {
    const fetchArticle = async () => {
      if (!id) {
        toast.error("Article ID is required");
        navigate("/articles/feed");
        return;
      }

      try {
        setIsLoading(true);
        const response = await articleService.getArticle(id);
        if (response.success && response.article) {
          const article = response.article;
          setTitle(article.title);
          setTag(article.category);
          
          // Set existing image if available
          if (article.featuredImage) {
            setExistingImageUrl(article.featuredImage);
            setExistingImageId(article.featuredImageId || null);
            setFeaturedImagePreview(article.featuredImage);
          }

          // Set editor content
          if (article.content && editor) {
            editor.commands.setContent(article.content);
          }
        } else {
          toast.error("Article not found");
          navigate("/articles/feed");
        }
      } catch (error: any) {
        console.error("Error fetching article:", error);
        toast.error(error.message || "Failed to load article");
        navigate("/articles/feed");
      } finally {
        setIsLoading(false);
      }
    };

    fetchArticle();
  }, [id, navigate, editor]);

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      e.target.value = "";
      return;
    }

    // Validate file size (10MB)
    if (file.size > 10 * 1024 * 1024) {
      toast.error("Image size must be less than 10MB");
      e.target.value = "";
      return;
    }

    // Store file and create preview
    setFeaturedImageFile(file);
    const reader = new FileReader();
    reader.onload = () => {
      setFeaturedImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  };

  const removeFeaturedImage = () => {
    setFeaturedImageFile(null);
    setFeaturedImagePreview(null);
    setExistingImageUrl(null);
    setExistingImageId(null);
  };

  const onUpdate = async () => {
    const content = editor?.getJSON();
    if (!title.trim()) {
      toast.error("Title is required");
      return;
    }
    if (!content) {
      toast.error("Write something before updating");
      return;
    }

    if (!id) {
      toast.error("Article ID is required");
      return;
    }

    setIsUpdating(true);
    try {
      let featuredImageUrl: string | null = null;
      let featuredImageId: string | null = null;

      // If a new image file is selected, upload it
      if (featuredImageFile) {
        try {
          const uploadResponse = await articleService.uploadImage(
            featuredImageFile
          );
          if (uploadResponse.success) {
            featuredImageUrl = uploadResponse.url;
            featuredImageId = uploadResponse.publicId;
          } else {
            throw new Error(uploadResponse.message || "Failed to upload image");
          }
        } catch (error) {
          console.error("Image upload error", error);
          toast.error("Failed to upload image. Please try again.");
          setIsUpdating(false);
          return;
        }
      } else if (existingImageUrl) {
        // Keep existing image if no new one is selected
        featuredImageUrl = existingImageUrl;
        featuredImageId = existingImageId;
      }

      // Update article
      await articleService.updateArticle(id, {
        title: title.trim(),
        category: tag || "General",
        content,
        featuredImage: featuredImageUrl,
        featuredImageId: featuredImageId,
      });

      toast.success("Article updated successfully");
      navigate(`/articles/${id}`);
    } catch (error) {
      console.error("Update error", error);
      toast.error("Failed to update article");
    } finally {
      setIsUpdating(false);
    }
  };

  if (isLoading) {
    return (
      <main className="min-h-screen bg-gray-50 text-gray-900">
        <header className="border-b border-gray-200 bg-white sticky top-0 z-20 shadow-sm">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <Link
              to="/articles/feed"
              className="text-xl font-bold text-black hover:opacity-80 transition-opacity"
            >
              ReadStack
            </Link>
          </div>
        </header>
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading article...</p>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 text-gray-900">
      <header className="border-b border-gray-200 bg-white sticky top-0 z-20 shadow-sm">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <Link
            to="/articles/feed"
            className="text-xl font-bold text-black hover:opacity-80 transition-opacity"
          >
            ReadStack
          </Link>
          <div className="flex gap-3">
            <button
              onClick={() => navigate(-1)}
              className="px-4 py-2 rounded-full text-sm font-medium bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={onUpdate}
              disabled={isUpdating}
              className="px-4 py-2 rounded-full text-sm font-semibold bg-black text-white hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isUpdating ? "Updating..." : "Update"}
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Featured Image Section - At Top */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Featured Image
          </label>
          {featuredImagePreview ? (
            <div className="relative group">
              <div className="border-2 border-gray-200 rounded-xl overflow-hidden bg-gray-100">
                <img
                  src={featuredImagePreview}
                  alt="Featured"
                  className="w-full h-64 object-cover"
                />
              </div>
              <button
                onClick={removeFeaturedImage}
                className="absolute top-2 right-2 bg-red-500 text-white px-3 py-1.5 rounded-md text-sm font-medium hover:bg-red-600 transition-colors opacity-0 group-hover:opacity-100"
              >
                Remove
              </button>
            </div>
          ) : (
            <div
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center cursor-pointer hover:border-gray-400 hover:bg-gray-50 transition-colors"
            >
              <svg
                className="mx-auto h-12 w-12 text-gray-400"
                stroke="currentColor"
                fill="none"
                viewBox="0 0 48 48"
              >
                <path
                  d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <p className="mt-2 text-sm text-gray-600">
                Click to upload featured image
              </p>
              <p className="text-xs text-gray-500 mt-1">
                PNG, JPG, GIF up to 10MB
              </p>
            </div>
          )}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleImageSelect}
            disabled={isUpdating}
          />
        </div>

        {/* Title & Tag */}
        <div className="mb-6 space-y-4">
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Article title"
            className="w-full text-3xl md:text-4xl font-bold text-black placeholder:text-gray-400 focus:outline-none bg-transparent"
          />
          <select
            value={tag}
            onChange={(e) => setTag(e.target.value)}
            className="px-4 py-2 rounded-lg border border-gray-300 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
          >
            <option value="">Select a tag</option>
            <option value="Design">Design</option>
            <option value="AI">AI</option>
            <option value="Writing">Writing</option>
            <option value="Product">Product</option>
            <option value="Technology">Technology</option>
            <option value="Business">Business</option>
            <option value="Science">Science</option>
            <option value="Health">Health</option>
            <option value="Education">Education</option>
            <option value="Marketing">Marketing</option>
            <option value="Finance">Finance</option>
            <option value="Travel">Travel</option>
            <option value="Food">Food</option>
            <option value="Sports">Sports</option>
            <option value="Entertainment">Entertainment</option>
          </select>
        </div>

        {/* Toolbar */}
        <div className="sticky top-16 z-10 bg-white/95 backdrop-blur-sm border border-gray-200 rounded-lg px-4 py-3 mb-4 flex flex-wrap gap-2 shadow-sm">
          <ToolbarButton
            onClick={() => {
              editor?.chain().focus().toggleBold().run();
              setEditorState((prev) => prev + 1);
            }}
            active={editor?.isActive("bold")}
            disabled={!editor}
          >
            <strong>B</strong>
          </ToolbarButton>
          <ToolbarButton
            onClick={() => {
              editor?.chain().focus().toggleItalic().run();
              setEditorState((prev) => prev + 1);
            }}
            active={editor?.isActive("italic")}
            disabled={!editor}
          >
            <em>I</em>
          </ToolbarButton>
          <ToolbarButton
            onClick={() => {
              editor?.chain().focus().toggleUnderline().run();
              setEditorState((prev) => prev + 1);
            }}
            active={editor?.isActive("underline")}
            disabled={!editor}
          >
            <u>U</u>
          </ToolbarButton>
          <div className="w-px h-6 bg-gray-300 mx-1" />
          <ToolbarButton
            onClick={() => {
              editor?.chain().focus().toggleHeading({ level: 1 }).run();
              setEditorState((prev) => prev + 1);
            }}
            active={editor?.isActive("heading", { level: 1 })}
            disabled={!editor}
          >
            H1
          </ToolbarButton>
          <ToolbarButton
            onClick={() => {
              editor?.chain().focus().toggleHeading({ level: 2 }).run();
              setEditorState((prev) => prev + 1);
            }}
            active={editor?.isActive("heading", { level: 2 })}
            disabled={!editor}
          >
            H2
          </ToolbarButton>
          <div className="w-px h-6 bg-gray-300 mx-1" />
          <ToolbarButton
            onClick={() => {
              editor?.chain().focus().toggleBulletList().run();
              setEditorState((prev) => prev + 1);
            }}
            active={editor?.isActive("bulletList")}
            disabled={!editor}
          >
            Bullet
          </ToolbarButton>
          <ToolbarButton
            onClick={() => {
              editor?.chain().focus().toggleOrderedList().run();
              setEditorState((prev) => prev + 1);
            }}
            active={editor?.isActive("orderedList")}
            disabled={!editor}
          >
            Ordered
          </ToolbarButton>
          <ToolbarButton
            onClick={() => {
              editor?.chain().focus().toggleBlockquote().run();
              setEditorState((prev) => prev + 1);
            }}
            active={editor?.isActive("blockquote")}
            disabled={!editor}
          >
            Quote
          </ToolbarButton>
          <ToolbarButton
            onClick={() => {
              editor?.chain().focus().toggleCodeBlock().run();
              setEditorState((prev) => prev + 1);
            }}
            active={editor?.isActive("codeBlock")}
            disabled={!editor}
          >
            Code
          </ToolbarButton>
        </div>

        {/* Editor */}
        <div className="border border-gray-200 rounded-xl shadow-sm bg-white overflow-hidden">
          <EditorContent editor={editor} />
        </div>
      </div>
    </main>
  );
};

export default EditArticle;
