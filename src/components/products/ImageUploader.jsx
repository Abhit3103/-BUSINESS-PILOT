import { useCallback, useRef, useState } from 'react';
import { ImagePlus, Link2, Loader2, Trash2, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { uploadProductImage, isUploadConfigured } from '@/services/uploadService';
import { useToast } from '@/context/ToastContext';
import { cn } from '@/lib/utils';

export function ImageUploader({
  thumbnail,
  images = [],
  onThumbnailChange,
  onImagesChange,
}) {
  const toast = useToast();
  const fileRef = useRef(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [urlInput, setUrlInput] = useState('');
  const canUpload = isUploadConfigured();

  const handleFiles = useCallback(async (files) => {
    const list = Array.from(files || []).filter((f) => f.type.startsWith('image/'));
    if (!list.length) return;

    setUploading(true);
    try {
      const urls = [];
      for (let i = 0; i < list.length; i += 1) {
        const file = list[i];
        if (canUpload) {
          const url = await uploadProductImage(file, (p) => setProgress(p));
          urls.push(url);
        } else {
          toast.error('Configure VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY for uploads, or paste image URLs.');
          break;
        }
      }
      if (urls.length) {
        const next = [...images, ...urls];
        onImagesChange(next);
        if (!thumbnail) onThumbnailChange(urls[0]);
        toast.success(`${urls.length} image(s) added`);
      }
    } catch (err) {
      toast.error(err.message || 'Upload failed');
    } finally {
      setUploading(false);
      setProgress(0);
    }
  }, [canUpload, images, onImagesChange, onThumbnailChange, thumbnail, toast]);

  const onDrop = (e) => {
    e.preventDefault();
    handleFiles(e.dataTransfer.files);
  };

  const addUrl = () => {
    const url = urlInput.trim();
    if (!url) return;
    const next = [...images, url];
    onImagesChange(next);
    if (!thumbnail) onThumbnailChange(url);
    setUrlInput('');
    toast.success('Image URL added');
  };

  const removeImage = (url) => {
    const next = images.filter((u) => u !== url);
    onImagesChange(next);
    if (thumbnail === url) onThumbnailChange(next[0] || '');
  };

  return (
    <div className="space-y-4">
      <div
        onDragOver={(e) => e.preventDefault()}
        onDrop={onDrop}
        className={cn(
          'flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-zinc-700 bg-zinc-950/50 px-6 py-10 text-center transition-colors',
          'hover:border-orange-500/50 hover:bg-zinc-900/80',
        )}
      >
        <Upload className="mb-3 h-10 w-10 text-orange-400/80" />
        <p className="text-sm font-medium text-zinc-200">Drag & drop product images</p>
        <p className="mt-1 text-xs text-zinc-500">
          {canUpload ? 'Uploads to Supabase storage' : 'Supabase not configured — use URL input below'}
        </p>
        <Button
          type="button"
          variant="outline"
          className="mt-4 border-zinc-600"
          disabled={uploading}
          onClick={() => fileRef.current?.click()}
        >
          {uploading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <ImagePlus className="mr-2 h-4 w-4" />}
          {uploading ? `Uploading ${progress}%` : 'Choose files'}
        </Button>
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={(e) => handleFiles(e.target.files)}
        />
      </div>

      <div className="flex gap-2">
        <Input
          value={urlInput}
          onChange={(e) => setUrlInput(e.target.value)}
          placeholder="https://..."
          className="border-zinc-700 bg-zinc-950"
        />
        <Button type="button" variant="secondary" onClick={addUrl}>
          <Link2 className="mr-2 h-4 w-4" />
          Add URL
        </Button>
      </div>

      {thumbnail && (
        <div>
          <Label>Thumbnail (featured image)</Label>
          <div className="mt-2 flex items-center gap-3 rounded-xl border border-orange-500/30 bg-orange-500/5 p-3">
            <img src={thumbnail} alt="" className="h-16 w-16 rounded-lg object-cover" />
            <div className="min-w-0 flex-1">
              <p className="truncate text-xs text-zinc-400">{thumbnail}</p>
              <Button type="button" variant="ghost" size="sm" className="mt-1 text-red-400" onClick={() => onThumbnailChange('')}>
                Clear thumbnail
              </Button>
            </div>
          </div>
        </div>
      )}

      {images.length > 0 && (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {images.map((url) => (
            <div key={url} className="group relative overflow-hidden rounded-xl border border-zinc-800 bg-zinc-950">
              <img src={url} alt="" className="aspect-square w-full object-cover" />
              <div className="absolute inset-x-0 bottom-0 flex gap-1 bg-gradient-to-t from-black/80 to-transparent p-2 opacity-0 transition-opacity group-hover:opacity-100">
                <Button type="button" size="sm" variant="secondary" className="flex-1 text-xs" onClick={() => onThumbnailChange(url)}>
                  Set thumb
                </Button>
                <Button type="button" size="icon" variant="destructive" className="h-8 w-8" onClick={() => removeImage(url)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
