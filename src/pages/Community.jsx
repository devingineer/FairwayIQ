import { useState, useEffect } from 'react'
import DashboardNav from '../components/dashboard/DashboardNav'
import PostCard from '../components/dashboard/PostCard'
import { supabase } from '../lib/supabase'

export default function Community() {
  const [posts, setPosts] = useState([])
  const [currentUser, setCurrentUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [content, setContent] = useState('')
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    async function init() {
      const { data: { user } } = await supabase.auth.getUser()
      setCurrentUser(user)
      await fetchPosts(user)
      setLoading(false)
    }
    init()

    // Real-time: prepend new posts from other users
    const channel = supabase
      .channel('posts')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'posts' }, payload => {
        setPosts(prev => {
          if (prev.find(p => p.id === payload.new.id)) return prev
          return [{ ...payload.new, like_count: 0, comment_count: 0, liked_by_me: false }, ...prev]
        })
      })
      .subscribe()

    return () => supabase.removeChannel(channel)
  }, [])

  async function fetchPosts(user) {
    const { data: postsData } = await supabase
      .from('posts')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(50)

    if (!postsData) return

    const postIds = postsData.map(p => p.id)

    const [{ data: likesData }, { data: commentsData }, { data: myLikes }] = await Promise.all([
      supabase.from('likes').select('post_id').in('post_id', postIds),
      supabase.from('comments').select('post_id').in('post_id', postIds),
      supabase.from('likes').select('post_id').in('post_id', postIds).eq('user_id', user.id),
    ])

    const likeCounts = (likesData || []).reduce((acc, l) => {
      acc[l.post_id] = (acc[l.post_id] || 0) + 1; return acc
    }, {})
    const commentCounts = (commentsData || []).reduce((acc, c) => {
      acc[c.post_id] = (acc[c.post_id] || 0) + 1; return acc
    }, {})
    const myLikeSet = new Set((myLikes || []).map(l => l.post_id))

    setPosts(postsData.map(p => ({
      ...p,
      like_count: likeCounts[p.id] || 0,
      comment_count: commentCounts[p.id] || 0,
      liked_by_me: myLikeSet.has(p.id),
    })))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (!content.trim() || submitting) return
    setSubmitting(true)
    const displayName = currentUser.user_metadata?.full_name || currentUser.email
    const { data, error } = await supabase
      .from('posts')
      .insert({ user_id: currentUser.id, display_name: displayName, content: content.trim() })
      .select()
      .single()
    if (!error) {
      setPosts(prev => [{ ...data, like_count: 0, comment_count: 0, liked_by_me: false }, ...prev])
      setContent('')
    }
    setSubmitting(false)
  }

  return (
    <div className="dash-layout">
      <DashboardNav />

      <div className="community-body">
        <form onSubmit={handleSubmit} className="create-post-card">
          <textarea
            className="create-post-input"
            value={content}
            onChange={e => setContent(e.target.value)}
            placeholder="Share a tip, highlight, or question with the FairwayIQ community..."
            rows={3}
          />
          <div className="create-post-footer">
            <span className="create-post-hint">Golf tips, session highlights, questions — all welcome.</span>
            <button type="submit" className="btn-primary" disabled={!content.trim() || submitting}>
              {submitting ? 'Posting...' : 'Post'}
            </button>
          </div>
        </form>

        <div className="feed-list">
          {loading ? (
            <div className="empty-state"><p>Loading feed...</p></div>
          ) : posts.length === 0 ? (
            <div className="empty-state">
              <p>No posts yet. Be the first to share something!</p>
            </div>
          ) : (
            posts.map(p => (
              <PostCard key={p.id} post={p} currentUser={currentUser} />
            ))
          )}
        </div>
      </div>
    </div>
  )
}
