import { NextResponse } from 'next/server'
import { getViews, incrementViews } from '@/lib/db'

export async function POST(request: Request) {
  try {
    const { slug } = await request.json()
    
    if (!slug) {
      return NextResponse.json({ error: 'Slug is required' }, { status: 400 })
    }

    const views = await incrementViews(slug)
    return NextResponse.json({ views })
  } catch (error) {
    console.error('Error updating views:', error)
    return NextResponse.json(
      { error: 'Failed to update views' },
      { status: 500 }
    )
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const slug = searchParams.get('slug')

    if (!slug) {
      return NextResponse.json({ error: 'Slug is required' }, { status: 400 })
    }

    const views = await getViews(slug)
    return NextResponse.json({ views })
  } catch (error) {
    console.error('Error getting views:', error)
    return NextResponse.json(
      { error: 'Failed to get views' },
      { status: 500 }
    )
  }
}
