import { createClient } from '@supabase/supabase-js'

if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
  throw new Error('Missing NEXT_PUBLIC_SUPABASE_URL')
}

if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
  throw new Error('Missing SUPABASE_SERVICE_ROLE_KEY')
}

// 创建 Supabase 客户端
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

export async function getViews(slug: string): Promise<number> {
  try {
    const { data, error } = await supabase
      .from('page_views')
      .select('views')
      .eq('slug', slug)
      .single()

    if (error) {
      console.error('Error fetching views:', error)
      return 0
    }

    return data?.views || 0
  } catch (error) {
    console.error('Error fetching views:', error)
    return 0
  }
}

export async function incrementViews(slug: string): Promise<number> {
  try {
    // 首先尝试更新现有记录
    const { data: existingData, error: selectError } = await supabase
      .from('page_views')
      .select('views')
      .eq('slug', slug)
      .single()

    if (selectError && selectError.code !== 'PGRST116') { // PGRST116 是"没有找到记录"的错误
      console.error('Error checking existing views:', selectError)
      return 0
    }

    if (existingData) {
      // 如果记录存在，更新它
      const { data, error: updateError } = await supabase
        .from('page_views')
        .update({ views: existingData.views + 1 })
        .eq('slug', slug)
        .select('views')
        .single()

      if (updateError) {
        console.error('Error updating views:', updateError)
        return existingData.views
      }

      return data?.views || existingData.views
    } else {
      // 如果记录不存在，创建新记录
      const { data, error: insertError } = await supabase
        .from('page_views')
        .insert([{ slug, views: 1 }])
        .select('views')
        .single()

      if (insertError) {
        console.error('Error inserting views:', insertError)
        return 0
      }

      return data?.views || 1
    }
  } catch (error) {
    console.error('Error incrementing views:', error)
    return 0
  }
}
