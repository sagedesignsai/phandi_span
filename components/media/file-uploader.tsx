import React, { useState } from 'react'
import { Upload, X, FileText } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { useMediaStore } from '@/lib/contexts/media-store'
import { useDropzone, Accept } from 'react-dropzone'

interface FileUploaderProps {
  onUploadSuccess?: () => void
  allowedTypes?: string[]
  maxSize?: number
  isLoading?: boolean
  uploadProgress?: number
}

export const FileUploader: React.FC<FileUploaderProps> = ({
  onUploadSuccess,
  allowedTypes,
  maxSize = 10 * 1024 * 1024, // 10MB default
  isLoading = false,
  uploadProgress = 0
}) => {
  const { uploadFile } = useMediaStore()
  const [selectedFiles, setSelectedFiles] = useState<File[]>([])
  const [uploadError, setUploadError] = useState<string | null>(null)

  const {
    getRootProps,
    getInputProps,
    isDragActive,
    open,
    fileRejections,
    acceptedFiles
  } = useDropzone({
    accept: allowedTypes ? allowedTypes.join(',') : undefined as any,
    maxSize,
    onDropAccepted: (files) => {
      const validFiles: File[] = []
      const errors: string[] = []

      files.forEach((file) => {
        const error = validateFile(file)
        if (error) {
          errors.push(`${file.name}: ${error}`)
        } else {
          validFiles.push(file)
        }
      })

      if (errors.length > 0) {
        setUploadError(errors.join('\n'))
      }

      setSelectedFiles(validFiles)
    },
    onDropRejected: (rejectedFiles) => {
      const errors: string[] = []

      rejectedFiles.forEach((fileRejection) => {
        const file = fileRejection.file
        const error = fileRejection.errors[0]
        if (error.code === 'file-too-large') {
          errors.push(`${file.name}: File size exceeds ${(maxSize / 1024 / 1024).toFixed(0)}MB limit`)
        } else if (error.code === 'file-invalid-type') {
          errors.push(`${file.name}: File type not allowed`)
        } else {
          errors.push(`${file.name}: ${error.message}`)
        }
      })

      if (errors.length > 0) {
        setUploadError(errors.join('\n'))
      }
    }
  })

  const validateFile = (file: File): string | null => {
    if (allowedTypes && !allowedTypes.some((type) => file.type.match(type))) {
      return 'File type not allowed'
    }

    if (file.size > maxSize) {
      return `File size exceeds ${(maxSize / 1024 / 1024).toFixed(0)}MB limit`
    }

    return null
  }

  const handleRemoveFile = (index: number) => {
    setSelectedFiles(selectedFiles.filter((_, i) => i !== index))
  }

  const handleUpload = async () => {
    setUploadError(null)

    try {
      for (const file of selectedFiles) {
        await uploadFile(file)
      }

      setSelectedFiles([])
      onUploadSuccess?.()
    } catch (error) {
      setUploadError(error instanceof Error ? error.message : 'Failed to upload files')
    }
  }

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`
  }

  return (
    <div className="space-y-4">
      <div
        {...getRootProps()}
        className={`border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center cursor-pointer hover:border-primary/50 transition-colors ${
          isDragActive ? 'border-primary/50 bg-primary/5' : ''
        }`}
      >
        <Upload className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
        <p className="text-lg font-medium">Drop files here or click to upload</p>
        <p className="text-sm text-muted-foreground mt-2">
          {allowedTypes ? 'Allowed file types: ' + allowedTypes.join(', ') : 'All file types accepted'}
        </p>
        <p className="text-sm text-muted-foreground">
          Max file size: {(maxSize / 1024 / 1024).toFixed(0)}MB
        </p>
        <input {...getInputProps()} />
      </div>

      <Button
        onClick={open}
        className="hidden"
      >
        Open File Dialog
      </Button>

      {acceptedFiles.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Selected Files</h3>
          <div className="space-y-2">
            {acceptedFiles.map((file, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                <div className="flex items-center gap-3">
                  <FileText className="h-5 w-5 text-muted-foreground" />
                  <div className="flex-1">
                    <p className="text-sm font-medium">{file.name}</p>
                    <p className="text-xs text-muted-foreground">{formatFileSize(file.size)}</p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleRemoveFile(index)}
                  className="text-muted-foreground hover:text-destructive"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>

          <Button
            onClick={handleUpload}
            disabled={isLoading || acceptedFiles.length === 0}
            className="w-full"
          >
            {isLoading ? 'Uploading...' : `Upload ${acceptedFiles.length} File${acceptedFiles.length !== 1 ? 's' : ''}`}
          </Button>

          {isLoading && (
            <div className="space-y-2">
              <Progress value={uploadProgress} className="h-2" />
              <p className="text-sm text-muted-foreground text-center">
                Uploading: {uploadProgress}%
              </p>
            </div>
          )}
        </div>
      )}

      {fileRejections.length > 0 && (
        <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
          <p className="text-sm text-destructive whitespace-pre-line">
            {fileRejections.map((fileRejection) => {
              const file = fileRejection.file
              const error = fileRejection.errors[0]
              if (error.code === 'file-too-large') {
                return `${file.name}: File size exceeds ${(maxSize / 1024 / 1024).toFixed(0)}MB limit`
              } else if (error.code === 'file-invalid-type') {
                return `${file.name}: File type not allowed`
              } else {
                return `${file.name}: ${error.message}`
              }
            }).join('\n')}
          </p>
        </div>
      )}

      {uploadError && (
        <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
          <p className="text-sm text-destructive whitespace-pre-line">{uploadError}</p>
        </div>
      )}
    </div>
  )
}
