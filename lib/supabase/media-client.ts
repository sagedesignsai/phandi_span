import { createClient } from './client'

export interface MediaFile {
  id: string
  user_id: string
  filename: string
  file_path: string
  file_size: number
  file_type: string
  mime_type: string
  thumbnail_url?: string
  is_public: boolean
  created_at: string
  updated_at: string
}

export interface UploadMediaOptions {
  file: File
  folder?: string
  isPublic?: boolean
  onProgress?: (progress: number) => void
}

export interface MediaClient {
  upload: (options: UploadMediaOptions) => Promise<MediaFile>
  delete: (id: string) => Promise<void>
  list: (options?: { folder?: string; limit?: number; offset?: number }) => Promise<MediaFile[]>
  getById: (id: string) => Promise<MediaFile | null>
  getPublicUrl: (filePath: string) => string
  getThumbnailUrl: (filePath: string) => string
  update: (id: string, updates: Partial<MediaFile>) => Promise<MediaFile>
  getByType: (type: string, options?: { limit?: number; offset?: number }) => Promise<MediaFile[]>
  getByDateRange: (startDate: string, endDate: string, options?: { limit?: number; offset?: number }) => Promise<MediaFile[]>
  getCount: (options?: { folder?: string; type?: string }) => Promise<number>
  bulkDelete: (ids: string[]) => Promise<void>
  search: (query: string, options?: { limit?: number; offset?: number }) => Promise<MediaFile[]>
}
export function createMediaClient(): MediaClient {
  const supabase = createClient()

  const getFileExtension = (filename: string): string => {
    return filename.split('.').pop()?.toLowerCase() || ''
  }

  const getFileType = (mimeType: string): string => {
    if (mimeType.startsWith('image/')) return 'image'
    if (mimeType.startsWith('application/pdf')) return 'pdf'
    if (mimeType.startsWith('application/msword') || mimeType.includes('word')) return 'document'
    if (mimeType.includes('excel') || mimeType.includes('spreadsheet')) return 'spreadsheet'
    if (mimeType.includes('powerpoint') || mimeType.includes('presentation')) return 'presentation'
    if (mimeType.startsWith('text/')) return 'text'
    return 'other'
  }

  const generateFilePath = (userId: string, filename: string, folder?: string): string => {
    const timestamp = Date.now()
    const randomStr = Math.random().toString(36).substring(2, 8)
    const safeFilename = filename.replace(/[^a-zA-Z0-9_\-.]/g, '_')
    const path = folder ? `${userId}/${folder}/${timestamp}-${randomStr}-${safeFilename}` : `${userId}/${timestamp}-${randomStr}-${safeFilename}`
    return path
  }

  const upload: MediaClient['upload'] = async ({
    file,
    folder,
    isPublic = false,
    onProgress
  }) => {
    const {
      data: { user },
      error: userError
    } = await supabase.auth.getUser()

    if (userError || !user) {
      throw new Error('User not authenticated')
    }

    const filePath = generateFilePath(user.id, file.name, folder)
    const bucket = isPublic ? 'public' : 'private'

    const { error: uploadError } = await supabase.storage
      .from(bucket)
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      })

    if (uploadError) {
      throw new Error(`Upload failed: ${uploadError.message}`)
    }

    const mediaFile: MediaFile = {
      id: crypto.randomUUID(),
      user_id: user.id,
      filename: file.name,
      file_path: filePath,
      file_size: file.size,
      file_type: getFileType(file.type),
      mime_type: file.type,
      is_public: isPublic,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }

    const { error: insertError } = await supabase
      .from('media')
      .insert(mediaFile)
      .select()

    if (insertError) {
      await supabase.storage.from(bucket).remove([filePath])
      throw new Error(`Failed to save media metadata: ${insertError.message}`)
    }

    return mediaFile
  }

  const deleteMedia: MediaClient['delete'] = async (id) => {
    const {
      data: { user },
      error: userError
    } = await supabase.auth.getUser()

    if (userError || !user) {
      throw new Error('User not authenticated')
    }

    const { data: mediaFile, error: fetchError } = await supabase
      .from('media')
      .select('*')
      .eq('id', id)
      .eq('user_id', user.id)
      .single()

    if (fetchError || !mediaFile) {
      throw new Error('Media file not found')
    }

    const bucket = mediaFile.is_public ? 'public' : 'private'
    const { error: storageError } = await supabase.storage
      .from(bucket)
      .remove([mediaFile.file_path])

    if (storageError) {
      throw new Error(`Failed to delete file from storage: ${storageError.message}`)
    }

    const { error: deleteError } = await supabase
      .from('media')
      .delete()
      .eq('id', id)
      .eq('user_id', user.id)

    if (deleteError) {
      throw new Error(`Failed to delete media metadata: ${deleteError.message}`)
    }
  }

  const list: MediaClient['list'] = async ({ folder, limit = 50, offset = 0 } = {}) => {
    const {
      data: { user },
      error: userError
    } = await supabase.auth.getUser()

    if (userError || !user) {
      throw new Error('User not authenticated')
    }

    let query = supabase
      .from('media')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1)

    if (folder) {
      query = query.ilike('file_path', `%${folder}%`)
    }

    const { data, error } = await query

    if (error) {
      throw new Error(`Failed to fetch media files: ${error.message}`)
    }

    return data || []
  }

  const getById: MediaClient['getById'] = async (id) => {
    const {
      data: { user },
      error: userError
    } = await supabase.auth.getUser()

    if (userError || !user) {
      throw new Error('User not authenticated')
    }

    const { data, error } = await supabase
      .from('media')
      .select('*')
      .eq('id', id)
      .eq('user_id', user.id)
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        return null
      }
      throw new Error(`Failed to fetch media file: ${error.message}`)
    }

    return data
  }

  const getPublicUrl: MediaClient['getPublicUrl'] = (filePath) => {
    const { data } = supabase.storage.from('public').getPublicUrl(filePath)
    return data.publicUrl
  }

  const getThumbnailUrl: MediaClient['getThumbnailUrl'] = (filePath) => {
    return getPublicUrl(filePath)
  }

  const update: MediaClient['update'] = async (id, updates) => {
    const {
      data: { user },
      error: userError
    } = await supabase.auth.getUser()

    if (userError || !user) {
      throw new Error('User not authenticated')
    }

    const { data, error } = await supabase
      .from('media')
      .update(updates)
      .eq('id', id)
      .eq('user_id', user.id)
      .select()

    if (error) {
      throw new Error(`Failed to update media file: ${error.message}`)
    }

    return data[0]
  }

  const getByType: MediaClient['getByType'] = async (type, { limit = 50, offset = 0 } = {}) => {
    const {
      data: { user },
      error: userError
    } = await supabase.auth.getUser()

    if (userError || !user) {
      throw new Error('User not authenticated')
    }

    const { data, error } = await supabase
      .from('media')
      .select('*')
      .eq('user_id', user.id)
      .eq('file_type', type)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1)

    if (error) {
      throw new Error(`Failed to fetch media files by type: ${error.message}`)
    }

    return data || []
  }

  const getByDateRange: MediaClient['getByDateRange'] = async (startDate, endDate, { limit = 50, offset = 0 } = {}) => {
    const {
      data: { user },
      error: userError
    } = await supabase.auth.getUser()

    if (userError || !user) {
      throw new Error('User not authenticated')
    }

    const { data, error } = await supabase
      .from('media')
      .select('*')
      .eq('user_id', user.id)
      .gte('created_at', startDate)
      .lte('created_at', endDate)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1)

    if (error) {
      throw new Error(`Failed to fetch media files by date range: ${error.message}`)
    }

    return data || []
  }

  const getCount: MediaClient['getCount'] = async ({ folder, type } = {}) => {
    const {
      data: { user },
      error: userError
    } = await supabase.auth.getUser()

    if (userError || !user) {
      throw new Error('User not authenticated')
    }

    let query = supabase
      .from('media')
      .select('id')
      .eq('user_id', user.id)

    if (folder) {
      query = query.ilike('file_path', `%${folder}%`)
    }

    if (type) {
      query = query.eq('file_type', type)
    }

    const { data, error } = await query

    if (error) {
      throw new Error(`Failed to count media files: ${error.message}`)
    }

    return data.length
  }

  const bulkDelete: MediaClient['bulkDelete'] = async (ids) => {
    const {
      data: { user },
      error: userError
    } = await supabase.auth.getUser()

    if (userError || !user) {
      throw new Error('User not authenticated')
    }

    for (const id of ids) {
      const { data: mediaFile, error: fetchError } = await supabase
        .from('media')
        .select('*')
        .eq('id', id)
        .eq('user_id', user.id)
        .single()

      if (fetchError || !mediaFile) {
        continue
      }

      const bucket = mediaFile.is_public ? 'public' : 'private'
      await supabase.storage.from(bucket).remove([mediaFile.file_path])

      await supabase
        .from('media')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id)
    }
  }

  const search: MediaClient['search'] = async (query, { limit = 50, offset = 0 } = {}) => {
    const {
      data: { user },
      error: userError
    } = await supabase.auth.getUser()

    if (userError || !user) {
      throw new Error('User not authenticated')
    }

    const { data, error } = await supabase
      .from('media')
      .select('*')
      .eq('user_id', user.id)
      .or(`filename.ilike.%${query}%,file_path.ilike.%${query}%,file_type.ilike.%${query}%`)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1)

    if (error) {
      throw new Error(`Failed to search media files: ${error.message}`)
    }

    return data || []
  }

  return {
    upload,
    delete: deleteMedia,
    list,
    getById,
    getPublicUrl,
    getThumbnailUrl,
    update,
    getByType,
    getByDateRange,
    getCount,
    bulkDelete,
    search
  }
}

export const mediaClient = createMediaClient()