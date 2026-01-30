import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()

    const { searchParams } = new URL(request.url)
    const folder = searchParams.get('folder')
    const limit = parseInt(searchParams.get('limit') || '50')
    const offset = parseInt(searchParams.get('offset') || '0')

    const { data: { user }, error: userError } = await supabase.auth.getUser()

    if (userError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
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

    const { data: mediaFiles, error } = await query

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ data: mediaFiles || [] })
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()

    const formData = await request.formData()
    const file = formData.get('file') as File
    const folder = formData.get('folder') as string | undefined
    const isPublic = formData.get('isPublic') === 'true'

    const { data: { user }, error: userError } = await supabase.auth.getUser()

    if (userError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    const buffer = Buffer.from(await file.arrayBuffer())

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

    const filePath = generateFilePath(user.id, file.name, folder)
    const bucket = isPublic ? 'public' : 'private'

    const { error: uploadError } = await supabase.storage
      .from(bucket)
      .upload(filePath, buffer, {
        cacheControl: '3600',
        upsert: false
      })

    if (uploadError) {
      return NextResponse.json({ error: `Upload failed: ${uploadError.message}` }, { status: 500 })
    }

    const mediaFile = {
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
      return NextResponse.json({ error: `Failed to save media metadata: ${insertError.message}` }, { status: 500 })
    }

    return NextResponse.json({ data: mediaFile }, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const supabase = await createClient()

    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ error: 'ID is required' }, { status: 400 })
    }

    const { data: { user }, error: userError } = await supabase.auth.getUser()

    if (userError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { data: mediaFile, error: fetchError } = await supabase
      .from('media')
      .select('*')
      .eq('id', id)
      .eq('user_id', user.id)
      .single()

    if (fetchError || !mediaFile) {
      return NextResponse.json({ error: 'Media file not found' }, { status: 404 })
    }

    const bucket = mediaFile.is_public ? 'public' : 'private'
    const { error: storageError } = await supabase.storage
      .from(bucket)
      .remove([mediaFile.file_path])

    if (storageError) {
      return NextResponse.json({ error: `Failed to delete file from storage: ${storageError.message}` }, { status: 500 })
    }

    const { error: deleteError } = await supabase
      .from('media')
      .delete()
      .eq('id', id)
      .eq('user_id', user.id)

    if (deleteError) {
      return NextResponse.json({ error: `Failed to delete media metadata: ${deleteError.message}` }, { status: 500 })
    }

    return NextResponse.json({ message: 'Media file deleted successfully' })
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}