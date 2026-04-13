import { createServerClient } from '@/lib/supabase/server'
import type { Project } from '@/types/project'

export async function GET() {
  const supabase = createServerClient()

  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .order('sort_order', { ascending: true })

  if (error) {
    console.error('[API /projects]', error)
    return Response.json({ error: 'Failed to fetch projects' }, { status: 500 })
  }

  return Response.json(data as Project[], {
    headers: {
      'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300',
    },
  })
}
