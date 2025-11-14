import { useParams, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { Facebook, Instagram, Linkedin, Mail, MessageCircle, Share2, Loader2 } from "lucide-react";
import { toast } from "sonner";
import Header from "./Header";
import Footer from "./Footer";
import { API_BASE_URL } from "@/config/api";

interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  type: string;
  author: string;
  author_linkedin?: string;
  author_title?: string;
  author_photo?: string;
  featured_image: string;
  views: number;
  created_at: string;
  updated_at: string;
  tags?: string;
}

interface Comment {
  id: number;
  blog_post_id: number;
  name: string;
  email: string;
  comment: string;
  status: string;
  created_at: string;
}

const BlogPost = () => {
  const { slug, id } = useParams();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [toc, setToc] = useState<Array<{ text: string; id: string }>>([]);
  const [showShareMenu, setShowShareMenu] = useState(false);
  const [comments, setComments] = useState<Comment[]>([]);
  const [commentFormData, setCommentFormData] = useState({
    name: '',
    email: '',
    comment: ''
  });
  const [submittingComment, setSubmittingComment] = useState(false);
  const [authorPhotoError, setAuthorPhotoError] = useState(false);
  const [photoRetryKey, setPhotoRetryKey] = useState(0);

  // Reset author photo error and retry key when the photo URL changes
  useEffect(() => {
    setAuthorPhotoError(false);
    setPhotoRetryKey(0);
  }, [post?.author_photo]);

  // Retry loading author photo every 10 seconds if it failed
  useEffect(() => {
    if (!authorPhotoError || !post?.author_photo) return;
    
    const retryTimer = setTimeout(() => {
      setPhotoRetryKey(prev => prev + 1);
    }, 10000);
    
    return () => clearTimeout(retryTimer);
  }, [authorPhotoError, post?.author_photo]);

  // Fetch blog post from API (supports both slug and id)
  useEffect(() => {
    const fetchPost = async () => {
      if (!slug && !id) return;
      
      try {
        setLoading(true);
        // Use slug if available (new format), otherwise use id (legacy format)
        const queryParam = slug ? `slug=${encodeURIComponent(slug)}` : `id=${id}`;
        const response = await fetch(`${API_BASE_URL}/public-blogs.php?${queryParam}`);
        
        // Get response as text first, then try to parse as JSON
        const text = await response.text();
        let data;
        
        try {
          data = JSON.parse(text);
        } catch (parseError) {
          console.error('JSON parse error:', parseError);
          console.error('Response text:', text);
          throw new Error('Invalid response from server. Please check your database configuration.');
        }
        
        if (!response.ok) {
          throw new Error(data.error || data.message || 'Failed to fetch blog post');
        }
        
        if (data.success && data.data) {
          setPost(data.data);
        } else {
          setError(data.error || data.message || 'Blog post not found');
        }
      } catch (err) {
        console.error('Error fetching post:', err);
        setError(err instanceof Error ? err.message : 'Failed to load blog post');
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [slug, id]);

  // Fetch approved comments
  useEffect(() => {
    const fetchComments = async () => {
      if (!post?.id) return;
      
      try {
        const response = await fetch(`${API_BASE_URL}/comments.php?blog_id=${post.id}`);
        const data = await response.json();
        
        if (data.success && data.data) {
          setComments(data.data);
        }
      } catch (err) {
        console.error('Error fetching comments:', err);
      }
    };

    fetchComments();
  }, [post?.id]);

  // Handle comment form submission
  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!post?.id) return;
    
    setSubmittingComment(true);
    
    try {
      const response = await fetch(`${API_BASE_URL}/comments.php`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          blog_post_id: parseInt(post.id),
          name: commentFormData.name,
          email: commentFormData.email,
          comment: commentFormData.comment
        })
      });
      
      const data = await response.json();
      
      if (data.success) {
        toast.success(data.message || 'Comment submitted successfully! It will be visible after admin approval.');
        setCommentFormData({ name: '', email: '', comment: '' });
      } else {
        toast.error(data.message || 'Failed to submit comment');
      }
    } catch (err) {
      console.error('Error submitting comment:', err);
      toast.error('Failed to submit comment');
    } finally {
      setSubmittingComment(false);
    }
  };

  // Extract headings from content to build dynamic TOC
  useEffect(() => {
    if (post?.content) {
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = post.content;
      const headings = tempDiv.querySelectorAll('h2');
      const tocItems = Array.from(headings).map(heading => ({
        text: heading.textContent || '',
        id: heading.id || heading.textContent?.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '') || ''
      }));
      setToc(tocItems);
    }
  }, [post]);

  // Get current page URL
  const currentUrl = typeof window !== 'undefined' ? window.location.href : '';
  const postTitle = post?.title || '';
  const postExcerpt = post?.excerpt || '';

  // Share functions
  const shareOnFacebook = () => {
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(currentUrl)}`, '_blank', 'width=600,height=400');
  };

  const shareOnLinkedIn = () => {
    window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(currentUrl)}`, '_blank', 'width=600,height=400');
  };

  const shareOnWhatsApp = () => {
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(postTitle + ' - ' + currentUrl)}`, '_blank');
  };

  const shareViaEmail = () => {
    window.location.href = `mailto:?subject=${encodeURIComponent(postTitle)}&body=${encodeURIComponent(postExcerpt + '\n\n' + currentUrl)}`;
  };

  const shareOnInstagram = () => {
    // Instagram doesn't have a direct share URL, so we'll copy the link
    navigator.clipboard.writeText(currentUrl);
    alert('Link copied! You can now share it on Instagram.');
  };

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-[#0D0D0D]">
        <Header />
        <div className="container mx-auto py-16 text-center">
          <Loader2 className="w-12 h-12 animate-spin text-cyan-400 mx-auto mb-4" />
          <p className="text-gray-400">Loading article...</p>
        </div>
      </div>
    );
  }

  // Error or not found state
  if (error || !post) {
    return (
      <div className="min-h-screen bg-[#0D0D0D]">
        <Header />
        <div className="container mx-auto py-16 text-center">
          <h2 className="text-2xl font-bold mb-4 text-white">Blog post not found.</h2>
          <p className="text-gray-400">{error || 'The article you are looking for does not exist.'}</p>
          <Link to="/resources" className="inline-block mt-6 px-6 py-2 bg-cyan-400 text-black rounded hover:bg-cyan-300 transition">
            Back to Resources
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0D0D0D]">
      <Header />
      <main className="container mx-auto px-6 py-12 flex flex-col lg:flex-row gap-8">
        {/* Table of Contents Sidebar */}
        <aside className="w-full lg:w-64 mb-8 lg:mb-0">
          <div className="bg-gray-800/50 border border-gray-700 rounded p-4 sticky top-24">
            <h3 className="text-lg font-bold mb-4 text-white">Table of Contents</h3>
            {toc.length > 0 ? (
              <ul className="text-sm space-y-2">
                {toc.map((item, idx) => (
                  <li key={idx}>
                    <a href={`#${item.id}`} className="text-cyan-400 hover:text-cyan-300 hover:underline">{item.text}</a>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-400 text-sm">No sections available</p>
            )}
          </div>
        </aside>
        {/* Main Content */}
        <div className="flex-1">
          <h1 className="text-3xl font-bold mb-4 text-white">{post.title}</h1>
          
          {/* Author Info */}
          <div className="flex items-center gap-3 mb-4">
            <div className="relative w-12 h-12">
              {post.author_photo ? (
                <>
                  <img
                    key={`author-photo-${photoRetryKey}`}
                    src={post.author_photo} 
                    alt={post.author || "Author"} 
                    className={`w-12 h-12 rounded-full object-cover border-2 border-cyan-400 ${authorPhotoError ? 'hidden' : 'block'}`}
                    onError={() => setAuthorPhotoError(true)}
                    onLoad={() => setAuthorPhotoError(false)}
                  />
                  {authorPhotoError && (
                    <div className="w-12 h-12 rounded-full bg-cyan-400 flex items-center justify-center border-2 border-cyan-400">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-7 h-7 text-gray-900">
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z"/>
                      </svg>
                    </div>
                  )}
                </>
              ) : (
                <div className="w-12 h-12 rounded-full bg-cyan-400 flex items-center justify-center border-2 border-cyan-400">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-7 h-7 text-gray-900">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z"/>
                  </svg>
                </div>
              )}
            </div>
            <div>
              {post.author_linkedin ? (
                <a 
                  href={post.author_linkedin} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-white font-semibold hover:text-cyan-400 transition-colors duration-300 cursor-pointer"
                >
                  {post.author}
                </a>
              ) : (
                <div className="text-white font-semibold">
                  {post.author}
                </div>
              )}
              {post.author_title && (
                <div className="text-gray-400 text-sm">{post.author_title}</div>
              )}
            </div>
          </div>
          
          <div className="flex items-center gap-4 text-sm text-gray-400 mb-6">
            <span>{formatDate(post.created_at)}</span>
            <span>{post.views} views</span>
          </div>
          <div className="flex items-center gap-4 mb-6">
            <div className="flex items-center gap-1 text-gray-400 text-sm">
              <Share2 className="w-4 h-4" />
              <span>Share</span>
            </div>
            <div className="flex items-center gap-3">
              <button 
                onClick={shareOnFacebook}
                className="p-2 rounded-full bg-gray-800 hover:bg-blue-600 text-gray-400 hover:text-white transition-all duration-300 group"
                title="Share on Facebook"
              >
                <Facebook className="w-4 h-4" />
              </button>
              <button 
                onClick={shareOnInstagram}
                className="p-2 rounded-full bg-gray-800 hover:bg-gradient-to-r hover:from-purple-600 hover:to-pink-600 text-gray-400 hover:text-white transition-all duration-300"
                title="Share on Instagram"
              >
                <Instagram className="w-4 h-4" />
              </button>
              <button 
                onClick={shareOnWhatsApp}
                className="p-2 rounded-full bg-gray-800 hover:bg-green-600 text-gray-400 hover:text-white transition-all duration-300"
                title="Share on WhatsApp"
              >
                <MessageCircle className="w-4 h-4" />
              </button>
              <button 
                onClick={shareOnLinkedIn}
                className="p-2 rounded-full bg-gray-800 hover:bg-blue-700 text-gray-400 hover:text-white transition-all duration-300"
                title="Share on LinkedIn"
              >
                <Linkedin className="w-4 h-4" />
              </button>
              <button 
                onClick={shareViaEmail}
                className="p-2 rounded-full bg-gray-800 hover:bg-cyan-600 text-gray-400 hover:text-white transition-all duration-300"
                title="Share via Email"
              >
                <Mail className="w-4 h-4" />
              </button>
            </div>
          </div>
          <img src={post.featured_image || 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&q=80'} alt={post.title} className="w-full h-72 object-cover rounded mb-8" />
          <div className="prose prose-lg prose-invert mb-8 text-white [&_p]:text-white [&_h2]:text-white [&_h2]:font-bold [&_h2]:underline [&_h2]:decoration-cyan-400 [&_h2]:underline-offset-4 [&_h2]:mb-4 [&_h2]:mt-6 [&_li]:text-white [&_ul]:text-white" dangerouslySetInnerHTML={{ __html: post.content }} />
          {/* Tags Section */}
          {post.tags && post.tags.trim() !== '' && (
            <div className="bg-gray-800/50 border border-gray-700 rounded p-4 mt-8">
              <h4 className="text-lg font-semibold text-white mb-3">Tags</h4>
              <div className="flex flex-wrap gap-2">
                {post.tags.split(',').map((tag, index) => {
                  const trimmedTag = tag.trim();
                  return trimmedTag ? (
                    <span 
                      key={index}
                      className="bg-cyan-600 hover:bg-cyan-500 text-white text-sm px-3 py-1 rounded-full transition-colors cursor-pointer"
                    >
                      {trimmedTag}
                    </span>
                  ) : null;
                })}
              </div>
            </div>
          )}

          {/* Display Approved Comments */}
          {comments.length > 0 && (
            <div className="mt-12">
              <h3 className="text-2xl font-bold text-white mb-6">Comments ({comments.length})</h3>
              <div className="space-y-4">
                {comments.map((comment) => (
                  <div key={comment.id} className="bg-gray-800/50 border border-gray-700 rounded p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-10 h-10 rounded-full bg-cyan-500 flex items-center justify-center text-white font-semibold">
                        {comment.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <div className="font-semibold text-white">{comment.name}</div>
                        <div className="text-xs text-gray-400">
                          {new Date(comment.created_at).toLocaleDateString('en-US', { 
                            month: 'long', 
                            day: 'numeric', 
                            year: 'numeric' 
                          })}
                        </div>
                      </div>
                    </div>
                    <p className="text-gray-300 mt-2">{comment.comment}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Comment Section */}
          <div className="mt-12">
            <h3 className="text-2xl font-bold text-white mb-6">Leave a Comment</h3>
            <form onSubmit={handleCommentSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">
                    Name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    required
                    value={commentFormData.name}
                    onChange={(e) => setCommentFormData({ ...commentFormData, name: e.target.value })}
                    className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded text-white placeholder-gray-500 focus:outline-none focus:border-cyan-400 transition-colors"
                    placeholder="Your name"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    id="email"
                    required
                    value={commentFormData.email}
                    onChange={(e) => setCommentFormData({ ...commentFormData, email: e.target.value })}
                    className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded text-white placeholder-gray-500 focus:outline-none focus:border-cyan-400 transition-colors"
                    placeholder="your@email.com"
                  />
                </div>
              </div>
              <div>
                <label htmlFor="comment" className="block text-sm font-medium text-gray-300 mb-2">
                  Comment *
                </label>
                <textarea
                  id="comment"
                  rows={5}
                  required
                  value={commentFormData.comment}
                  onChange={(e) => setCommentFormData({ ...commentFormData, comment: e.target.value })}
                  className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded text-white placeholder-gray-500 focus:outline-none focus:border-cyan-400 transition-colors resize-none"
                  placeholder="Share your thoughts..."
                />
              </div>
              <button
                type="submit"
                disabled={submittingComment}
                className="px-6 py-3 bg-cyan-500 hover:bg-cyan-600 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-semibold rounded transition-colors duration-300 flex items-center gap-2"
              >
                {submittingComment ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  'Post Comment'
                )}
              </button>
            </form>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default BlogPost;
