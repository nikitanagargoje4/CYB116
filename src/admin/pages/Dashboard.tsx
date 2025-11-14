import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  FileText, 
  Eye, 
  Users, 
  TrendingUp,
  Search,
  MoreVertical,
  Edit,
  Calendar
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Link } from 'react-router-dom';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface BlogPost {
  id: number;
  title: string;
  excerpt: string;
  status: 'published' | 'draft';
  type: string;
  author: string;
  date: string;
  views: number;
}

export const Dashboard = () => {
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [contentTypeFilter, setContentTypeFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  useEffect(() => {
    const storedPosts = localStorage.getItem('adminBlogPosts');
    if (storedPosts) {
      setBlogPosts(JSON.parse(storedPosts));
    } else {
      const samplePosts: BlogPost[] = [
        {
          id: 1,
          title: 'How SMBs Can Reduce IT Costs by Moving Core Services to Cloud',
          excerpt: 'Small and medium businesses often face rising IT costs. Moving core services to the cloud...',
          status: 'published',
          type: 'Blog Post',
          author: 'Cybaem Tech Editorial Team',
          date: '2024-12-15',
          views: 1249
        },
        {
          id: 2,
          title: 'Case Study: Secure Microsoft 365 Migration for Global Consultancy',
          excerpt: 'Read how Cybaem Tech migrated a 300-user consultancy to Microsoft 365...',
          status: 'published',
          type: 'Case Study',
          author: 'Solutions Delivery Team',
          date: '2024-12-10',
          views: 856
        }
      ];
      localStorage.setItem('adminBlogPosts', JSON.stringify(samplePosts));
      setBlogPosts(samplePosts);
    }
  }, []);

  const filteredPosts = blogPosts.filter((post) => {
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         post.author.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesContentType = contentTypeFilter === 'all' || post.type === contentTypeFilter;
    const matchesStatus = statusFilter === 'all' || post.status === statusFilter;
    
    return matchesSearch && matchesContentType && matchesStatus;
  });

  const stats = [
    {
      title: 'Total Articles',
      value: blogPosts.length.toString(),
      change: '+12% from last month',
      icon: FileText,
      trend: 'up'
    },
    {
      title: 'Published This Month',
      value: blogPosts.filter(p => p.status === 'published').length.toString(),
      change: '+25% from last month',
      icon: Calendar,
      trend: 'up'
    },
    {
      title: 'Total Views',
      value: '15.2K',
      change: '+18% from last month',
      icon: Eye,
      trend: 'up'
    },
    {
      title: 'Active Authors',
      value: '6',
      change: '0% from last month',
      icon: Users,
      trend: 'neutral'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.title}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">
                  {stat.title}
                </CardTitle>
                <Icon className="h-4 w-4 text-gray-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className={`text-xs mt-1 ${
                  stat.trend === 'up' ? 'text-green-600' : 'text-gray-500'
                }`}>
                  {stat.change}
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Content Overview */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <CardTitle>Content Overview</CardTitle>
              <CardDescription>
                Manage your blog posts, case studies, white papers, and eBooks
              </CardDescription>
            </div>
            <Button asChild className="w-full sm:w-auto">
              <Link to="/admin/content">View All Content</Link>
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Search and Filter */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input 
                  placeholder="Search content..." 
                  className="pl-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Select value={contentTypeFilter} onValueChange={setContentTypeFilter}>
                <SelectTrigger className="w-full sm:w-[180px]">
                  <SelectValue placeholder="Content Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="Blog Post">Blog Post</SelectItem>
                  <SelectItem value="Case Study">Case Study</SelectItem>
                  <SelectItem value="White Paper">White Paper</SelectItem>
                  <SelectItem value="eBook">eBook</SelectItem>
                </SelectContent>
              </Select>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full sm:w-[180px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="published">Published</SelectItem>
                  <SelectItem value="draft">Draft</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Content List - Responsive */}
            <div className="space-y-3">
              {filteredPosts.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  No content found matching your filters.
                </div>
              ) : (
                filteredPosts.map((post) => (
                <div 
                  key={post.id}
                  className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <h3 className="font-medium text-gray-900 break-words">{post.title}</h3>
                      <Badge variant={post.status === 'published' ? 'default' : 'secondary'}>
                        {post.status}
                      </Badge>
                      <Badge variant="outline">{post.type}</Badge>
                    </div>
                    <p className="text-sm text-gray-600 mb-2 line-clamp-2">{post.excerpt}</p>
                    <div className="flex flex-wrap items-center gap-2 text-xs text-gray-500">
                      <span>By {post.author}</span>
                      <span className="hidden sm:inline">•</span>
                      <span>Published {post.date}</span>
                      <span className="hidden sm:inline">•</span>
                      <span>{post.views} views</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 justify-end sm:justify-start">
                    <Button variant="ghost" size="icon" asChild>
                      <Link to={`/admin/content/edit/${post.id}`}>
                        <Edit className="h-4 w-4" />
                      </Link>
                    </Button>
                    <Button variant="ghost" size="icon">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
