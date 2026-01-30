import React, { useEffect, useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { MediaGrid } from './media-grid'
import { FileUploader } from './file-uploader'
import { useMediaStore } from '@/lib/contexts/media-store'
import { Alert, AlertDescription } from '@/components/ui/alert'

interface MediaModalProps {
  isOpen: boolean
  onClose: () => void
  onSelect: (files: any[]) => void
  allowMultiple?: boolean
  allowedTypes?: string[]
  maxSize?: number
}

export const MediaModal: React.FC<MediaModalProps> = ({
  isOpen,
  onClose,
  onSelect,
  allowMultiple = false,
  allowedTypes,
  maxSize
}) => {
  const {
    mediaFiles,
    selectedFiles,
    isLoading,
    isUploading,
    uploadProgress,
    error,
    loadMediaFiles,
    openModal,
    closeModal,
    clearError
  } = useMediaStore()

  const [activeTab, setActiveTab] = useState<'library' | 'upload'>('library')

  useEffect(() => {
    if (isOpen) {
      loadMediaFiles()
    }
  }, [isOpen, loadMediaFiles])

  useEffect(() => {
    if (isOpen) {
      openModal()
    } else {
      closeModal()
    }
  }, [isOpen, openModal, closeModal])

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => clearError(), 5000)
      return () => clearTimeout(timer)
    }
  }, [error, clearError])

  const handleSelect = () => {
    onSelect(selectedFiles)
    closeModal()
    onClose()
  }

  const handleUploadSuccess = () => {
    setActiveTab('library')
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">Media Library</DialogTitle>
        </DialogHeader>

        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="flex items-center gap-2 mb-4">
          <Button
            variant={activeTab === 'library' ? 'default' : 'ghost'}
            onClick={() => setActiveTab('library')}
            className="flex-1"
          >
            Library
          </Button>
          <Button
            variant={activeTab === 'upload' ? 'default' : 'ghost'}
            onClick={() => setActiveTab('upload')}
            className="flex-1"
          >
            Upload
          </Button>
        </div>

        <div className="flex-1 overflow-auto">
          {activeTab === 'library' && (
            <MediaGrid
              files={mediaFiles}
              selectedFiles={selectedFiles}
              isLoading={isLoading}
              allowMultiple={allowMultiple}
              onSelectFile={() => {}}
              onDeleteFile={() => {}}
            />
          )}
          {activeTab === 'upload' && (
            <FileUploader
              onUploadSuccess={handleUploadSuccess}
              allowedTypes={allowedTypes}
              maxSize={maxSize}
              isLoading={isUploading}
              uploadProgress={uploadProgress}
            />
          )}
        </div>

        <DialogFooter>
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button
            onClick={handleSelect}
            disabled={selectedFiles.length === 0 || isLoading}
          >
            Select {selectedFiles.length} File{selectedFiles.length !== 1 ? 's' : ''}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}