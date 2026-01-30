import React from 'react'
import { MediaFile, mediaClient } from '@/lib/supabase/media-client'
import { Image as ImageIcon, FileText, FileSpreadsheet, File, Download } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface MediaPreviewProps {
  file: MediaFile
  className?: string
  showDownload?: boolean
}

export const MediaPreview: React.FC<MediaPreviewProps> = ({
  file,
  className,
  showDownload = false
}) => {
  const getFileIcon = () => {
    switch (file.file_type) {
      case 'image':
        return ImageIcon
      case 'pdf':
        return FileText
      case 'document':
        return FileText
      case 'spreadsheet':
        return FileSpreadsheet
      case 'presentation':
        return FileText
      default:
        return File
    }
  }

  const Icon = getFileIcon()

  const handleDownload = () => {
    const url = mediaClient.getPublicUrl(file.file_path)
    const link = document.createElement('a')
    link.href = url
    link.download = file.filename
    link.target = '_blank'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <div className={`relative ${className}`}>
      {file.file_type === 'image' ? (
        <img
          src={mediaClient.getPublicUrl(file.file_path)}
          alt={file.filename}
          className="w-full h-full object-cover"
          loading="lazy"
        />
      ) : (
        <div className="flex flex-col items-center justify-center w-full h-full text-muted-foreground bg-muted/50">
          <Icon className="h-12 w-12 mb-2 opacity-50" />
          <p className="text-xs text-center px-2 truncate">{file.filename}</p>
          <p className="text-xs text-muted-foreground mt-1">
            {(file.file_size / 1024 / 1024).toFixed(2)} MB
          </p>
        </div>
      )}

      {showDownload && (
        <div className="absolute bottom-2 right-2">
          <Button
            variant="secondary"
            size="sm"
            onClick={handleDownload}
            className="h-8 w-8 p-0"
          >
            <Download className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  )
}