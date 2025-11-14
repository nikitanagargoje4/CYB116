import { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from 'sonner';
import { ArrowLeft, Save, Upload, Loader2 } from 'lucide-react';
import { api } from '../services/api';
import { RichTextEditor } from '../components/RichTextEditor';

interface BlogPost {
  id: number;
  title: string;
  slug?: string;
  tags?: string;
  excerpt: string;
  content: string;
  status: 'published' | 'draft';
  type: string;
  author: string;
  authorLinkedIn?: string;
  authorTitle?: string;
  authorPhoto?: string;
  date: string;
  views: number;
  image?: string;
}

export const ContentEditor = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = !!id;
  const fileInputRef = useRef<HTMLInputElement>(null);
  const authorPhotoInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadingAuthorPhoto, setUploadingAuthorPhoto] = useState(false);

  const [formData, setFormData] = useState<BlogPost>({
    id: Date.now(),
    title: '',
    slug: '',
    tags: '',
    excerpt: '',
    content: '',
    status: 'draft',
    type: 'Blog Post',
    author: 'admin (Rohan bhosale)',
    authorLinkedIn: '',
    authorTitle: 'CEO @ CybaemTech',
    authorPhoto: '',
    date: new Date().toISOString().split('T')[0],
    views: 0,
    image: ''
  });

  useEffect(() => {
    if (isEditing) {
      const fetchPost = async () => {
        try {
          const response = await api.blogs.getById(parseInt(id));
          if (response.success && response.data) {
            setFormData({
              id: response.data.id,
              title: response.data.title,
              slug: response.data.slug || '',
              tags: response.data.tags || '',
              excerpt: response.data.excerpt,
              content: response.data.content,
              status: response.data.status,
              type: response.data.type,
              author: response.data.author,
              authorLinkedIn: response.data.author_linkedin || '',
              authorTitle: response.data.author_title || '',
              authorPhoto: response.data.author_photo || '',
              date: response.data.created_at?.split('T')[0] || new Date().toISOString().split('T')[0],
              views: response.data.views || 0,
              image: response.data.featured_image || ''
            });
          }
        } catch (error) {
          console.error('Failed to load post:', error);
          toast.error('Failed to load post');
        }
      };
      fetchPost();
    }
  }, [id, isEditing]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (isEditing) {
        const response = await api.blogs.update(parseInt(id), formData);
        if (response.success) {
          toast.success('Post updated successfully!');
          navigate('/admin/content');
        } else {
          toast.error(response.message || 'Failed to update post');
        }
      } else {
        const response = await api.blogs.create(formData);
        if (response.success) {
          toast.success('Post created successfully!');
          navigate('/admin/content');
        } else {
          toast.error(response.message || 'Failed to create post');
        }
      }
    } catch (error) {
      console.error('Error saving post:', error);
      toast.error('An error occurred while saving the post');
    }
  };

  const handleChange = (field: keyof BlogPost, value: string) => {
    if (field === 'title') {
      setFormData(prev => ({
        ...prev,
        title: value,
        slug: prev.slug === '' || !isEditing ? value.replace(/\s+/g, '') : prev.slug
      }));
    } else {
      setFormData(prev => ({ ...prev, [field]: value }));
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file');
      return;
    }

    try {
      setUploading(true);
      const fileName = file.name.split('.')[0];
      const response = await api.media.uploadFile(file, fileName);
      
      if (response.success && response.data?.url) {
        setFormData(prev => ({ ...prev, image: response.data.url }));
        toast.success('Image uploaded successfully!');
      } else {
        toast.error(response.message || 'Failed to upload image');
      }
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('An error occurred while uploading the image');
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleAuthorPhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file');
      return;
    }

    try {
      setUploadingAuthorPhoto(true);
      const fileName = `author_${file.name.split('.')[0]}`;
      const response = await api.media.uploadFile(file, fileName);
      
      if (response.success && response.data?.url) {
        setFormData(prev => ({ ...prev, authorPhoto: response.data.url }));
        toast.success('Author photo uploaded successfully!');
      } else {
        toast.error(response.message || 'Failed to upload author photo');
      }
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('An error occurred while uploading the author photo');
    } finally {
      setUploadingAuthorPhoto(false);
      if (authorPhotoInputRef.current) {
        authorPhotoInputRef.current.value = '';
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-start gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate('/admin/content')} className="flex-shrink-0 mt-1">
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div className="flex-1 min-w-0">
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
            {isEditing ? 'Edit Post' : 'Create New Post'}
          </h1>
          <p className="text-sm sm:text-base text-gray-500 mt-1">
            {isEditing ? 'Update your blog post' : 'Write a new blog post'}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Post Content</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Title *</Label>
                  <Input
                    id="title"
                    placeholder="Enter post title"
                    value={formData.title}
                    onChange={(e) => handleChange('title', e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="slug">Manual URL</Label>
                  <Input
                    id="slug"
                    placeholder="e-commerce-platform-scaling (leave empty for auto-generated)"
                    value={formData.slug}
                    onChange={(e) => handleChange('slug', e.target.value)}
                  />
                  <p className="text-xs text-gray-500">
                    Custom URL slug for this post. Leave empty to auto-generate from title.
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="tags">Tags</Label>
                  <Input
                    id="tags"
                    placeholder="Cloud Migration, Finance, Digital Transformation"
                    value={formData.tags}
                    onChange={(e) => handleChange('tags', e.target.value)}
                  />
                  <p className="text-xs text-gray-500">
                    Add tags separated by commas (e.g., Cloud Migration, Finance, Digital Transformation)
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="excerpt">Excerpt *</Label>
                  <Textarea
                    id="excerpt"
                    placeholder="Brief description of your post"
                    value={formData.excerpt}
                    onChange={(e) => handleChange('excerpt', e.target.value)}
                    rows={3}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="content">Content *</Label>
                  <RichTextEditor
                    value={formData.content}
                    onChange={(value) => handleChange('content', value)}
                    placeholder="Write your post content here..."
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Post Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <Select value={formData.status} onValueChange={(value) => handleChange('status', value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="draft">Draft</SelectItem>
                      <SelectItem value="published">Published</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="type">Type</Label>
                  <Select value={formData.type} onValueChange={(value) => handleChange('type', value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Blog Post">Blog Post</SelectItem>
                      <SelectItem value="Case Study">Case Study</SelectItem>
                      <SelectItem value="White Paper">White Paper</SelectItem>
                      <SelectItem value="eBook">eBook</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="author">Author</Label>
                  <Input
                    id="author"
                    value={formData.author}
                    onChange={(e) => handleChange('author', e.target.value)}
                    placeholder="admin (Rohan bhosale)"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="authorLinkedIn">Author LinkedIn Profile</Label>
                  <Input
                    id="authorLinkedIn"
                    value={formData.authorLinkedIn}
                    onChange={(e) => handleChange('authorLinkedIn', e.target.value)}
                    placeholder="https://linkedin.com/in/username"
                  />
                  <p className="text-xs text-gray-500">
                    LinkedIn profile URL for the author (optional)
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="authorTitle">Author Position/Title</Label>
                  <Input
                    id="authorTitle"
                    value={formData.authorTitle}
                    onChange={(e) => handleChange('authorTitle', e.target.value)}
                    placeholder="CEO @ CybaemTech"
                  />
                  <p className="text-xs text-gray-500">
                    Author's position or title (e.g., "CEO @ CybaemTech")
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="authorPhoto">Author Photo</Label>
                  <div className="flex gap-2">
                    <Input
                      id="authorPhoto"
                      placeholder="https://example.com/author-photo.jpg"
                      value={formData.authorPhoto}
                      onChange={(e) => handleChange('authorPhoto', e.target.value)}
                      className="flex-1"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => authorPhotoInputRef.current?.click()}
                      disabled={uploadingAuthorPhoto}
                    >
                      {uploadingAuthorPhoto ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Upload className="h-4 w-4" />
                      )}
                    </Button>
                    <input
                      ref={authorPhotoInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleAuthorPhotoUpload}
                      className="hidden"
                    />
                  </div>
                  {formData.authorPhoto && (
                    <div className="mt-2">
                      <img 
                        src={formData.authorPhoto} 
                        alt="Author preview" 
                        className="w-16 h-16 rounded-full object-cover border-2 border-cyan-400"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                        }}
                      />
                    </div>
                  )}
                  <p className="text-xs text-gray-500">
                    Upload author's profile photo (optional, will display admin icon by default)
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="date">Date</Label>
                  <Input
                    id="date"
                    type="date"
                    value={formData.date}
                    onChange={(e) => handleChange('date', e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="image">Featured Image</Label>
                  <div className="flex gap-2">
                    <Input
                      id="image"
                      placeholder="https://example.com/image.jpg"
                      value={formData.image}
                      onChange={(e) => handleChange('image', e.target.value)}
                      className="flex-1"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => fileInputRef.current?.click()}
                      disabled={uploading}
                    >
                      {uploading ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Upload className="h-4 w-4" />
                      )}
                    </Button>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                  </div>
                  {formData.image && (
                    <div className="mt-2">
                      <img 
                        src={formData.image} 
                        alt="Preview" 
                        className="max-w-full h-32 object-cover rounded-md border"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                        }}
                      />
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            <div className="flex flex-col sm:flex-row gap-2">
              <Button type="submit" className="flex-1 w-full">
                <Save className="mr-2 h-4 w-4" />
                Submit
              </Button>
              <Button type="button" variant="outline" onClick={() => navigate('/admin/content')} className="w-full sm:w-auto">
                Cancel
              </Button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};
