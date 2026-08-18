import { createClient } from './supabase'
import type { Lesson } from '@/types'

export async function getLessonsForWeek(weekKey: string): Promise<Lesson[]> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('lessons')
    .select('*')
    .eq('week_key', weekKey)
    .order('day', { ascending: true })
    .order('start_time', { ascending: true })

  if (error) {
    console.error('Error fetching lessons:', error)
    return []
  }
  return data || []
}

export async function createLesson(lesson: Omit<Lesson, 'id' | 'created_at'>): Promise<Lesson | null> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('lessons')
    .insert(lesson)
    .select()
    .single()

  if (error) {
    console.error('Error creating lesson:', error)
    return null
  }
  return data
}

export async function updateLesson(id: string, lesson: Partial<Lesson>): Promise<Lesson | null> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('lessons')
    .update(lesson)
    .eq('id', id)
    .select()
    .single()

  if (error) {
    console.error('Error updating lesson:', error)
    return null
  }
  return data
}

export async function deleteLesson(id: string): Promise<boolean> {
  const supabase = createClient()
  const { error } = await supabase
    .from('lessons')
    .delete()
    .eq('id', id)

  if (error) {
    console.error('Error deleting lesson:', error)
    return false
  }
  return true
}

export async function getShareCodes() {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('share_codes')
    .select('*')
    .eq('is_active', true)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching share codes:', error)
    return []
  }
  return data || []
}

export async function createShareCode(code: string, label?: string) {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('share_codes')
    .insert({ code, label: label || 'Freigabe-Link', is_active: true })
    .select()
    .single()

  if (error) {
    console.error('Error creating share code:', error)
    return null
  }
  return data
}

export async function validateShareCode(code: string): Promise<boolean> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('share_codes')
    .select('id, is_active, expires_at')
    .eq('code', code)
    .eq('is_active', true)
    .single()

  if (error || !data) return false

  // Check expiry
  if (data.expires_at && new Date(data.expires_at) < new Date()) return false

  return true
}
