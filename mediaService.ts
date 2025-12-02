import { supabase } from './supabaseClient';
import { MediaItem } from './types';

const MEDIA_TABLE = 'media';
const LIKES_TABLE = 'likes';

export const mediaService = {
  // Fetch all media for the gallery
  async fetchAllMedia(): Promise<MediaItem[]> {
    try {
      const { data, error } = await supabase
        .from(MEDIA_TABLE)
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching media:', error);
        return [];
      }

      return (data || []).map(item => ({
        id: item.id,
        type: item.type,
        url: item.url,
        thumbnail: item.thumbnail,
        title: item.title,
        date: item.date,
        description: item.description,
        aspectRatio: item.aspect_ratio,
        uploadedBy: item.uploaded_by,
        createdAt: item.created_at,
        liked: item.liked || false,
        poeticCaption: item.poetic_caption,
      }));
    } catch (error) {
      console.error('Exception fetching media:', error);
      return [];
    }
  },

  // Save a new media item
  async saveMedia(item: MediaItem, userEmail?: string): Promise<MediaItem | null> {
    try {
      const { data, error } = await supabase
        .from(MEDIA_TABLE)
        .insert([
          {
            id: item.id,
            type: item.type,
            url: item.url,
            thumbnail: item.thumbnail,
            title: item.title,
            date: item.date,
            description: item.description,
            aspect_ratio: item.aspectRatio,
            uploaded_by: userEmail || 'anonymous',
            created_at: new Date().toISOString(),
            liked: false,
            poetic_caption: null,
          },
        ])
        .select()
        .single();

      if (error) {
        console.error('Error saving media:', error);
        return null;
      }

      return {
        id: data.id,
        type: data.type,
        url: data.url,
        thumbnail: data.thumbnail,
        title: data.title,
        date: data.date,
        description: data.description,
        aspectRatio: data.aspect_ratio,
        uploadedBy: data.uploaded_by,
        createdAt: data.created_at,
        liked: data.liked,
        poeticCaption: data.poetic_caption,
      };
    } catch (error) {
      console.error('Exception saving media:', error);
      return null;
    }
  },

  // Update like status
  async toggleLike(mediaId: string, liked: boolean): Promise<boolean> {
    try {
      const { error } = await supabase
        .from(MEDIA_TABLE)
        .update({ liked })
        .eq('id', mediaId);

      if (error) {
        console.error('Error updating like:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Exception updating like:', error);
      return false;
    }
  },

  // Save AI reflection caption
  async savePoetricCaption(mediaId: string, caption: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from(MEDIA_TABLE)
        .update({ poetic_caption: caption })
        .eq('id', mediaId);

      if (error) {
        console.error('Error saving caption:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Exception saving caption:', error);
      return false;
    }
  },

  // Delete media item
  async deleteMedia(mediaId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from(MEDIA_TABLE)
        .delete()
        .eq('id', mediaId);

      if (error) {
        console.error('Error deleting media:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Exception deleting media:', error);
      return false;
    }
  },
};
