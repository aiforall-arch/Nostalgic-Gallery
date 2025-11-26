import React, { useState, useEffect, useRef } from 'react';
import { Search, Heart, LogOut, Download, X, Sparkles, User, Calendar, Plus, Upload, Loader2 } from 'lucide-react';
import { MediaItem } from '../types';
import { SAMPLE_MEDIA } from '../constants';
import { generatePoeticCaption } from '../geminiService';

interface GalleryProps {
  onLogout: () => void;
  userName: string;
}

export const Gallery: React.FC<GalleryProps> = ({ onLogout, userName }) => {
  // Initialize state with sample media so we can add to it
  const [mediaItems, setMediaItems] = useState<MediaItem[]>(SAMPLE_MEDIA);
  const [filter, setFilter] = useState('');
  const [selectedItem, setSelectedItem] = useState<MediaItem | null>(null);
  const [poeticCaption, setPoeticCaption] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  // Upload Modal State
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [uploadState, setUploadState] = useState({
    title: '',
    description: '',
    file: null as File | null,
    previewUrl: '',
    loading: false
  });
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const filteredMedia = mediaItems.filter(item => 
    item.title.toLowerCase().includes(filter.toLowerCase()) || 
    item.description.toLowerCase().includes(filter.toLowerCase())
  );

  const handleReminisce = async () => {
    if (!selectedItem) return;
    setIsGenerating(true);
    setPoeticCaption(null);
    try {
      const caption = await generatePoeticCaption(selectedItem.description);
      setPoeticCaption(caption);
    } catch (e) {
      console.error(e);
    } finally {
      setIsGenerating(false);
    }
  };

  useEffect(() => {
    if (!selectedItem) {
      setPoeticCaption(null);
    }
  }, [selectedItem]);

  // Handle file selection
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = (event) => {
        setUploadState(prev => ({
          ...prev,
          file,
          previewUrl: event.target?.result as string
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle uploading/saving the memory
  const handleUploadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadState.previewUrl || !uploadState.title) return;

    setUploadState(prev => ({ ...prev, loading: true }));

    // Simulate network delay and determine aspect ratio
    setTimeout(() => {
      const img = new Image();
      img.src = uploadState.previewUrl;
      img.onload = () => {
        // Simple aspect ratio detection
        let aspectRatio = 'aspect-square';
        const ratio = img.width / img.height;
        if (ratio > 1.25) aspectRatio = 'aspect-[3/2]';
        else if (ratio < 0.8) aspectRatio = 'aspect-[2/3]';

        const newItem: MediaItem = {
          id: Date.now().toString(),
          type: 'image',
          url: uploadState.previewUrl,
          thumbnail: uploadState.previewUrl,
          title: uploadState.title,
          date: new Date().toISOString(),
          description: uploadState.description || 'A new memory added to the collection.',
          aspectRatio,
        };

        setMediaItems(prev => [newItem, ...prev]);
        setUploadState({ title: '', description: '', file: null, previewUrl: '', loading: false });
        if (fileInputRef.current) fileInputRef.current.value = '';
        setIsUploadOpen(false);
      };
    }, 800);
  };

  const closeUploadModal = () => {
    setIsUploadOpen(false);
    setUploadState({ title: '', description: '', file: null, previewUrl: '', loading: false });
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="min-h-screen bg-cream/50">
      {/* Navbar */}
      <nav className="sticky top-0 z-40 border-b border-sienna/10 bg-cream/90 px-6 py-4 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <h2 className="font-serif text-2xl font-bold text-warmGray">Our Moments</h2>
          
          <div className="hidden md:flex items-center gap-6">
            <div className="relative">
              <input
                type="text"
                placeholder="Search memories..."
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="rounded-full border border-sienna/20 bg-white/50 px-4 py-2 pl-10 text-sm focus:border-sienna focus:outline-none"
              />
              <Search className="absolute left-3 top-2.5 text-sienna/50" size={16} />
            </div>
          </div>

          <div className="flex items-center gap-4">
             <div className="hidden sm:flex items-center gap-2 text-sm text-sienna">
                <User size={16} />
                <span>{userName}</span>
             </div>
             
             {/* Upload Button */}
             <button 
               onClick={() => setIsUploadOpen(true)}
               className="flex items-center gap-2 rounded-full bg-sienna px-4 py-2 text-sm text-white transition-all shadow-md hover:bg-sienna/90 hover:shadow-lg active:scale-95"
             >
               <Plus size={16} />
               <span className="hidden sm:inline">Add Memory</span>
             </button>

            <button onClick={onLogout} className="rounded-full p-2 text-warmGray/60 hover:bg-sienna/10 hover:text-sienna">
              <LogOut size={20} />
            </button>
          </div>
        </div>
        {/* Mobile Search */}
        <div className="mt-4 md:hidden">
            <div className="relative">
              <input
                type="text"
                placeholder="Search memories..."
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="w-full rounded-full border border-sienna/20 bg-white/50 px-4 py-2 pl-10 text-sm focus:border-sienna focus:outline-none"
              />
              <Search className="absolute left-3 top-2.5 text-sienna/50" size={16} />
            </div>
        </div>
      </nav>

      {/* Grid */}
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="columns-1 gap-6 sm:columns-2 lg:columns-3 xl:columns-4">
          {filteredMedia.map((item) => (
            <div 
              key={item.id} 
              onClick={() => setSelectedItem(item)}
              className="group relative mb-6 break-inside-avoid cursor-pointer overflow-hidden rounded-sm bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
            >
              <div className={`w-full overflow-hidden bg-gray-100 ${item.aspectRatio}`}>
                <img 
                  src={item.thumbnail} 
                  alt={item.title}
                  className="h-full w-full object-cover sepia-[0.25] transition-all duration-700 group-hover:scale-110 group-hover:sepia-0"
                  loading="lazy"
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                <div className="absolute bottom-0 left-0 p-4 text-white">
                  <h3 className="font-serif text-lg leading-tight">{item.title}</h3>
                  <p className="text-xs font-light opacity-80">{new Date(item.date).toLocaleDateString()}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {filteredMedia.length === 0 && (
          <div className="flex h-64 flex-col items-center justify-center text-warmGray/50">
            <Search size={48} className="mb-4 opacity-20" />
            <p>No memories found. Try a different search.</p>
          </div>
        )}
      </main>

      {/* Upload Modal */}
      {isUploadOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-warmGray/60 backdrop-blur-sm p-4 animate-fade-in">
          <div className="w-full max-w-lg rounded-lg bg-cream shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between border-b border-sienna/10 px-6 py-4 bg-white/50">
              <h3 className="font-serif text-xl font-medium text-warmGray">Add a Memory</h3>
              <button onClick={closeUploadModal} className="text-warmGray/50 hover:text-sienna">
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleUploadSubmit} className="p-6 space-y-6">
              {/* File Drop Area */}
              <div className="relative">
                {uploadState.previewUrl ? (
                  <div className="relative aspect-video w-full overflow-hidden rounded border border-sienna/10 bg-black/5 group">
                    <img 
                      src={uploadState.previewUrl} 
                      alt="Preview" 
                      className="h-full w-full object-contain"
                    />
                    <button 
                      type="button"
                      onClick={() => {
                         setUploadState(p => ({...p, file: null, previewUrl: ''}));
                         if (fileInputRef.current) fileInputRef.current.value = '';
                      }}
                      className="absolute right-2 top-2 rounded-full bg-white/80 p-1 text-warmGray opacity-0 group-hover:opacity-100 transition-opacity hover:text-red-500"
                    >
                      <X size={16} />
                    </button>
                  </div>
                ) : (
                  <label className="flex flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed border-sienna/20 py-12 text-warmGray/60 transition-colors hover:border-sienna/40 hover:bg-sienna/5 cursor-pointer">
                    <div className="rounded-full bg-sienna/10 p-3 text-sienna">
                      <Upload size={24} />
                    </div>
                    <span className="text-sm font-medium">Click to upload photo</span>
                    <span className="text-xs opacity-60">JPG, PNG up to 10MB</span>
                    <input 
                      ref={fileInputRef}
                      type="file" 
                      accept="image/*" 
                      className="hidden" 
                      onChange={handleFileSelect}
                    />
                  </label>
                )}
              </div>

              {/* Inputs */}
              <div className="space-y-4">
                <div>
                  <label className="mb-1 block text-xs font-bold uppercase tracking-wider text-sienna/70">Title</label>
                  <input 
                    type="text" 
                    value={uploadState.title}
                    onChange={(e) => setUploadState({...uploadState, title: e.target.value})}
                    placeholder="e.g., Summer Afternoon"
                    className="w-full rounded border border-sienna/20 bg-white px-3 py-2 text-warmGray placeholder-warmGray/30 focus:border-sienna focus:outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-bold uppercase tracking-wider text-sienna/70">Description</label>
                  <textarea 
                    value={uploadState.description}
                    onChange={(e) => setUploadState({...uploadState, description: e.target.value})}
                    placeholder="What made this moment special?"
                    className="h-24 w-full resize-none rounded border border-sienna/20 bg-white px-3 py-2 text-warmGray placeholder-warmGray/30 focus:border-sienna focus:outline-none"
                  />
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end gap-3 pt-2">
                <button 
                  type="button" 
                  onClick={closeUploadModal}
                  className="rounded px-4 py-2 text-sm font-medium text-warmGray/60 transition-colors hover:text-warmGray"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  disabled={!uploadState.previewUrl || !uploadState.title || uploadState.loading}
                  className="flex items-center gap-2 rounded bg-sienna px-6 py-2 text-sm font-medium text-white transition-all hover:bg-sienna/90 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {uploadState.loading ? <Loader2 size={16} className="animate-spin" /> : 'Add Memory'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Lightbox Modal */}
      {selectedItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-cream/95 backdrop-blur-sm p-4 animate-fade-in">
            <button 
                onClick={() => setSelectedItem(null)}
                className="absolute right-4 top-4 z-50 rounded-full bg-white/20 p-2 text-warmGray hover:bg-white/40 md:right-8 md:top-8"
            >
                <X size={24} />
            </button>

            <div className="relative flex max-h-full w-full max-w-6xl flex-col gap-8 overflow-hidden rounded-lg bg-white shadow-2xl md:flex-row">
                
                {/* Image Section */}
                <div className="flex-1 overflow-hidden bg-black/5 md:h-[80vh]">
                    <img 
                        src={selectedItem.url} 
                        alt={selectedItem.title} 
                        className="h-full w-full object-contain"
                    />
                </div>

                {/* Details Section */}
                <div className="flex flex-col justify-between p-6 md:w-96 md:border-l md:border-warmGray/10">
                    <div>
                        <div className="mb-6 flex items-start justify-between">
                            <div>
                                <h2 className="font-serif text-3xl text-warmGray">{selectedItem.title}</h2>
                                <div className="mt-2 flex items-center gap-2 text-sm text-sienna/80">
                                    <Calendar size={14} />
                                    <span>{new Date(selectedItem.date).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
                                </div>
                            </div>
                        </div>

                        <p className="mb-6 font-sans text-warmGray/80 leading-relaxed">
                            {selectedItem.description}
                        </p>

                        {/* AI Section */}
                        <div className="mb-6 rounded-lg border border-gold/30 bg-cream p-4">
                            <div className="mb-3 flex items-center justify-between">
                                <span className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-sienna">
                                    <Sparkles size={12} />
                                    AI Reflection
                                </span>
                                {!poeticCaption && (
                                    <button 
                                        onClick={handleReminisce}
                                        disabled={isGenerating}
                                        className="text-xs underline decoration-sienna underline-offset-4 hover:text-sienna disabled:opacity-50"
                                    >
                                        {isGenerating ? 'Thinking...' : 'Reminisce'}
                                    </button>
                                )}
                            </div>
                            
                            {isGenerating && (
                                <div className="space-y-2 animate-pulse">
                                    <div className="h-2 w-full rounded bg-sienna/10"></div>
                                    <div className="h-2 w-2/3 rounded bg-sienna/10"></div>
                                </div>
                            )}

                            {poeticCaption && (
                                <p className="animate-fade-in font-serif text-lg italic leading-relaxed text-warmGray">
                                    "{poeticCaption}"
                                </p>
                            )}
                            
                            {!isGenerating && !poeticCaption && (
                                <p className="text-xs text-warmGray/50 italic">
                                    Ask the gallery to write a memory for this moment.
                                </p>
                            )}
                        </div>
                    </div>

                    <div className="flex gap-4 border-t border-warmGray/10 pt-6">
                        <button className="flex flex-1 items-center justify-center gap-2 rounded border border-warmGray/20 py-3 text-sm font-medium transition-colors hover:bg-warmGray/5">
                            <Heart size={18} className="text-sienna" />
                            Like
                        </button>
                        <button className="flex flex-1 items-center justify-center gap-2 rounded bg-warmGray py-3 text-sm font-medium text-white transition-colors hover:bg-warmGray/90">
                            <Download size={18} />
                            Download
                        </button>
                    </div>
                </div>
            </div>
        </div>
      )}
    </div>
  );
};