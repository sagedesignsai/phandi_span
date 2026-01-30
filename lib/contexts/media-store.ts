import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { MediaFile, mediaClient } from '../supabase/media-client'

interface MediaState {
  mediaFiles: MediaFile[]
  selectedFiles: MediaFile[]
  isLoading: boolean
  isUploading: boolean
  uploadProgress: number
  error: string | null
  isModalOpen: boolean
}

interface MediaActions {
  loadMediaFiles: () => Promise<void>
  uploadFile: (file: File, folder?: string, isPublic?: boolean) => Promise<MediaFile>
  deleteFile: (id: string) => Promise<void>
  selectFile: (file: MediaFile) => void
  deselectFile: (file: MediaFile) => void
  selectAllFiles: () => void
  deselectAllFiles: () => void
  openModal: () => void
  closeModal: () => void
  clearError: () => void
}

export const useMediaStore = create<MediaState & MediaActions>()(
  persist(
    (set, get) => ({
      mediaFiles: [],
      selectedFiles: [],
      isLoading: false,
      isUploading: false,
      uploadProgress: 0,
      error: null,
      isModalOpen: false,

      loadMediaFiles: async () => {
        try {
          set({ isLoading: true, error: null })
          const files = await mediaClient.list()
          set({ mediaFiles: files, isLoading: false })
        } catch (error) {
          set({ error: error instanceof Error ? error.message : 'Failed to load media files', isLoading: false })
        }
      },

      uploadFile: async (file: File, folder?: string, isPublic?: boolean) => {
        try {
          set({ isUploading: true, uploadProgress: 0, error: null })
          const mediaFile = await mediaClient.upload({ file, folder, isPublic })
          set((state) => ({
            mediaFiles: [mediaFile, ...state.mediaFiles],
            isUploading: false,
            uploadProgress: 100
          }))
          return mediaFile
        } catch (error) {
          set({ error: error instanceof Error ? error.message : 'Failed to upload file', isUploading: false })
          throw error
        }
      },

      deleteFile: async (id: string) => {
        try {
          set({ error: null })
          await mediaClient.delete(id)
          set((state) => ({
            mediaFiles: state.mediaFiles.filter((file) => file.id !== id),
            selectedFiles: state.selectedFiles.filter((file) => file.id !== id)
          }))
        } catch (error) {
          set({ error: error instanceof Error ? error.message : 'Failed to delete file' })
        }
      },

      selectFile: (file: MediaFile) => {
        set((state) => {
          const isSelected = state.selectedFiles.some((f) => f.id === file.id)
          if (isSelected) {
            return { selectedFiles: state.selectedFiles.filter((f) => f.id !== file.id) }
          }
          return { selectedFiles: [...state.selectedFiles, file] }
        })
      },

      deselectFile: (file: MediaFile) => {
        set((state) => ({
          selectedFiles: state.selectedFiles.filter((f) => f.id !== file.id)
        }))
      },

      selectAllFiles: () => {
        set((state) => ({ selectedFiles: [...state.mediaFiles] }))
      },

      deselectAllFiles: () => {
        set({ selectedFiles: [] })
      },

      openModal: () => {
        set({ isModalOpen: true })
      },

      closeModal: () => {
        set({ isModalOpen: false, selectedFiles: [] })
      },

      clearError: () => {
        set({ error: null })
      }
    }),
    {
      name: 'media-store',
      partialize: (state) => ({
        isModalOpen: state.isModalOpen
      })
    }
  )
)