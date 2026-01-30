import React from 'react'
import { MediaFile } from '@/lib/supabase/media-client'
import { MediaPreview } from './media-preview'
import { Checkbox } from '../ui/checkbox'
import { Button } from '../ui/button'
import { Trash2 } from 'lucide-react'
import { useMediaStore } from '@/lib/contexts/media-store'
import { Skeleton } from '../ui/skeleton'

interface MediaGridProps {
  files: MediaFile[]
  selectedFiles: MediaFile[]
  isLoading: boolean
  allowMultiple: boolean
  onSelectFile: (file: MediaFile) => void
  onDeleteFile: (id: string) => void
}

export const MediaGrid: React.FC<MediaGridProps> = ({
  files,
  selectedFiles,
  isLoading,
  allowMultiple,
  onSelectFile,
  onDeleteFile
}) => {
  const { selectFile, deleteFile } = useMediaStore()

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {Array.from({ length: 10 }).map((_, index) => (
          <div key={index} className="space-y-2">
            <Skeleton className="aspect-video rounded-lg" />
            <Skeleton className="h-4 w-3/4" />
          </div>
        ))}
      </div>
    )
  }

  if (files.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-center">
        <p className="text-muted-foreground mb-4">No media files found</p>
        <p className="text-sm text-muted-foreground max-w-md">
          Upload your first media file to get started with your media library
        </p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
      {files.map((file) => {
        const isSelected = selectedFiles.some((f) => f.id === file.id)

        return (
          <div key={file.id} className="group relative">
            <div className="aspect-video rounded-lg overflow-hidden bg-muted">
              <MediaPreview file={file} className="w-full h-full object-cover" />
              {allowMultiple && (
                <div className="absolute top-2 left-2">
                  <Checkbox
                    checked={isSelected}
                    onCheckedChange={() => selectFile(file)}
                    className="rounded-sm border-2 border-white shadow-md"
                  />
                </div>
              )}
              <div className="absolute bottom-0 left-0 right-0 p-2 bg-linear-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                <p className="text-xs font-medium text-white truncate">{file.filename}</p>
              </div>
            </div>
            <div className="flex items-center justify-between mt-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => selectFile(file)}
                className="flex-1 text-xs"
              >
                Select
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => deleteFile(file.id)}
                className="text-destructive hover:text-destructive hover:bg-destructive/10"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )
      })}
    </div>
  )
}