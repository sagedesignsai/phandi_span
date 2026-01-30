import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { MediaModal } from './media-modal'
import { MediaFile } from '@/lib/supabase/media-client'
import { Upload } from 'lucide-react'

interface MediaSelectorProps {
  buttonText?: string
  allowMultiple?: boolean
  allowedTypes?: string[]
  maxSize?: number
  onSelect: (files: MediaFile[]) => void
}

export const MediaSelector: React.FC<MediaSelectorProps> = ({
  buttonText = 'Select Media',
  allowMultiple = false,
  allowedTypes,
  maxSize,
  onSelect
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false)

  const handleSelect = (files: MediaFile[]) => {
    onSelect(files)
    setIsModalOpen(false)
  }

  return (
    <>
      <Button onClick={() => setIsModalOpen(true)} className="flex items-center gap-2">
        <Upload className="h-4 w-4" />
        {buttonText}
      </Button>

      <MediaModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSelect={handleSelect}
        allowMultiple={allowMultiple}
        allowedTypes={allowedTypes}
        maxSize={maxSize}
      />
    </>
  )
}