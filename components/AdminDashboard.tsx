import React, { useState, useEffect } from 'react';
import { Trash2, Search, BarChart3, Users, Image as ImageIcon, Heart, Loader2, ArrowLeft } from 'lucide-react';
import { MediaItem } from '../types';
import { mediaService } from '../mediaService';

interface AdminDashboardProps {
  onBack: () => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ onBack }) => {
  const [mediaItems, setMediaItems] = useState<MediaItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [stats, setStats] = useState({
    total: 0,
    liked: 0,
    withCaption: 0,
    unique_uploaders: new Set<string>(),
  });

  useEffect(() => {
    const loadMedia = async () => {
      setIsLoading(true);
      try {
        const items = await mediaService.fetchAllMedia();
        setMediaItems(items);
        
        // Calculate stats
        const likedCount = items.filter(item => item.liked).length;
        const captionCount = items.filter(item => item.poeticCaption).length;
        const uploaders = new Set(items.map(item => item.uploadedBy).filter(Boolean));
        
        setStats({
          total: items.length,
          liked: likedCount,
          withCaption: captionCount,
          unique_uploaders: uploaders,
        });
      } catch (error) {
        console.error('Failed to load media:', error);
      } finally {
        setIsLoading(false);
      }
    };
    loadMedia();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this memory?')) return;
    
    setDeleting(id);
    try {
      const success = await mediaService.deleteMedia(id);
      if (success) {
        setMediaItems(prev => prev.filter(item => item.id !== id));
        setStats(prev => ({
          ...prev,
          total: prev.total - 1,
          liked: prev.liked - (mediaItems.find(m => m.id === id)?.liked ? 1 : 0),
          withCaption: prev.withCaption - (mediaItems.find(m => m.id === id)?.poeticCaption ? 1 : 0),
        }));
      }
    } catch (error) {
      console.error('Failed to delete media:', error);
      alert('Failed to delete memory');
    } finally {
      setDeleting(null);
    }
  };

  const filteredMedia = mediaItems.filter(item =>
    item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (item.uploadedBy?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false)
  );

  return (
    <div className="min-h-screen bg-cream/50">
      {/* Header */}
      <nav className="sticky top-0 z-40 border-b border-sienna/10 bg-cream/90 px-6 py-4 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <div className="flex items-center gap-4">
            <button 
              onClick={onBack}
              className="rounded-full p-2 text-warmGray/60 hover:bg-sienna/10 hover:text-sienna"
            >
              <ArrowLeft size={20} />
            </button>
            <h1 className="font-serif text-2xl font-bold text-warmGray">Admin Dashboard</h1>
          </div>
        </div>
      </nav>

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Stats Cards */}
        <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-lg border border-sienna/10 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-sienna/70">Total Memories</p>
                <p className="mt-2 text-3xl font-bold text-warmGray">{stats.total}</p>
              </div>
              <ImageIcon size={32} className="text-sienna/20" />
            </div>
          </div>

          <div className="rounded-lg border border-sienna/10 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-sienna/70">Liked</p>
                <p className="mt-2 text-3xl font-bold text-warmGray">{stats.liked}</p>
              </div>
              <Heart size={32} className="fill-sienna/20 text-sienna/20" />
            </div>
          </div>

          <div className="rounded-lg border border-sienna/10 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-sienna/70">With Captions</p>
                <p className="mt-2 text-3xl font-bold text-warmGray">{stats.withCaption}</p>
              </div>
              <BarChart3 size={32} className="text-sienna/20" />
            </div>
          </div>

          <div className="rounded-lg border border-sienna/10 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-sienna/70">Contributors</p>
                <p className="mt-2 text-3xl font-bold text-warmGray">{stats.unique_uploaders.size}</p>
              </div>
              <Users size={32} className="text-sienna/20" />
            </div>
          </div>
        </div>

        {/* Search */}
        <div className="mb-8">
          <div className="relative">
            <input
              type="text"
              placeholder="Search by title, description, or uploader..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-lg border border-sienna/20 bg-white px-4 py-3 pl-12 text-warmGray placeholder-warmGray/30 focus:border-sienna focus:outline-none"
            />
            <Search className="absolute left-4 top-3.5 text-sienna/50" size={18} />
          </div>
        </div>

        {/* Media Table */}
        {isLoading ? (
          <div className="flex h-64 items-center justify-center">
            <Loader2 size={32} className="animate-spin text-sienna" />
          </div>
        ) : filteredMedia.length === 0 ? (
          <div className="rounded-lg border border-sienna/10 bg-white p-12 text-center">
            <ImageIcon size={48} className="mx-auto mb-4 text-sienna/20" />
            <p className="text-warmGray/50">No memories found</p>
          </div>
        ) : (
          <div className="overflow-x-auto rounded-lg border border-sienna/10 bg-white shadow-sm">
            <table className="w-full">
              <thead>
                <tr className="border-b border-sienna/10 bg-warmGray/5">
                  <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-sienna/70">Title</th>
                  <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-sienna/70">Uploader</th>
                  <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-sienna/70">Date</th>
                  <th className="px-6 py-4 text-center text-xs font-bold uppercase tracking-wider text-sienna/70">Liked</th>
                  <th className="px-6 py-4 text-center text-xs font-bold uppercase tracking-wider text-sienna/70">Caption</th>
                  <th className="px-6 py-4 text-center text-xs font-bold uppercase tracking-wider text-sienna/70">Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredMedia.map((item) => (
                  <tr key={item.id} className="border-b border-sienna/5 hover:bg-sienna/5 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <img src={item.thumbnail} alt={item.title} className="h-12 w-12 rounded object-cover" />
                        <div>
                          <p className="font-medium text-warmGray">{item.title}</p>
                          <p className="text-xs text-warmGray/60 truncate">{item.description}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-warmGray/80">{item.uploadedBy || 'Anonymous'}</td>
                    <td className="px-6 py-4 text-sm text-warmGray/80">
                      {new Date(item.date).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-center">
                      {item.liked ? (
                        <Heart size={16} className="mx-auto fill-sienna text-sienna" />
                      ) : (
                        <span className="text-xs text-warmGray/40">—</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-center">
                      {item.poeticCaption ? (
                        <span className="text-xs font-medium text-sienna">✓</span>
                      ) : (
                        <span className="text-xs text-warmGray/40">—</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <button
                        onClick={() => handleDelete(item.id)}
                        disabled={deleting === item.id}
                        className="rounded p-2 text-warmGray/50 hover:bg-red-50 hover:text-red-500 transition-colors disabled:opacity-50"
                        title="Delete memory"
                      >
                        {deleting === item.id ? (
                          <Loader2 size={16} className="animate-spin" />
                        ) : (
                          <Trash2 size={16} />
                        )}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {filteredMedia.length > 0 && (
          <p className="mt-4 text-xs text-warmGray/50">
            Showing {filteredMedia.length} of {mediaItems.length} memories
          </p>
        )}
      </main>
    </div>
  );
};

export default AdminDashboard;
