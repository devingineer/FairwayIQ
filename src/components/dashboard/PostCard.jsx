import { useState } from 'react'
import { supabase } from '../../lib/supabase'

function timeAgo(dateStr) {
  const diff = (Date.now() - new Date(dateStr)) / 1000
  if (diff < 60) return 'just now'
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`
  return `${Math.floor(diff / 86400)}d ago`
}

function Avatar({ name }) {
  const initials = name
    ? name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()
    : '?'
  return <div className="post-avatar">{initials}</div>
}

export default function PostCard({ post, currentUser }) {
  const [liked, setLiked] = useState(post.liked_by_me)
  const [likeCount, setLikeCount] = useState(post.like_count)
  const [comments, setComments] = useState([])
  const [showComments, setShowComments] = useState(false)
  const [commentText, setCommentText] = useState('')
  const [loadingComments, setLoadingComments] = useState(false)

  async function toggleLike() {
    if (liked) {
      await supabase.from('likes').delete().match({ post_id: post.id, user_id: currentUser.id })
      setLiked(false)
      setLikeCount(c => c - 1)
    } else {
      await supabase.from('likes').insert({ post_id: post.id, user_id: currentUser.id })
      setLiked(true)
      setLikeCount(c => c + 1)
    }
  }

  async function handleToggleComments() {
    if (!showComments && comments.length === 0) {
      setLoadingComments(true)
      const { data } = await supabase
        .from('comments')
        .select('*')
        .eq('post_id', post.id)
        .order('created_at', { ascending: true })
      setComments(data || [])
      setLoadingComments(false)
    }
    setShowComments(v => !v)
  }

  async function handleComment(e) {
    e.preventDefault()
    if (!commentText.trim()) return
    const displayName = currentUser.user_metadata?.full_name || currentUser.email
    const { data, error } = await supabase
      .from('comments')
      .insert({ post_id: post.id, user_id: currentUser.id, display_name: displayName, content: commentText.trim() })
      .select()
      .single()
    if (!error) {
      setComments(prev => [...prev, data])
      setCommentText('')
    }
  }

  return (
    <div className="post-card">
      <div className="post-header">
        <Avatar name={post.display_name} />
        <div className="post-meta">
          <span className="post-author">{post.display_name || 'Golfer'}</span>
          <span className="post-time">{timeAgo(post.created_at)}</span>
        </div>
      </div>

      <p className="post-content">{post.content}</p>

      <div className="post-actions">
        <button
          className={`post-action-btn ${liked ? 'post-action-liked' : ''}`}
          onClick={toggleLike}
        >
          {liked ? '♥' : '♡'} {likeCount > 0 && likeCount}
        </button>
        <button className="post-action-btn" onClick={handleToggleComments}>
          💬 {post.comment_count > 0 && post.comment_count} {showComments ? 'Hide' : 'Comment'}
        </button>
      </div>

      {showComments && (
        <div className="post-comments">
          {loadingComments ? (
            <p className="comments-loading">Loading...</p>
          ) : (
            comments.map(c => (
              <div key={c.id} className="comment">
                <Avatar name={c.display_name} />
                <div className="comment-body">
                  <span className="comment-author">{c.display_name || 'Golfer'}</span>
                  <span className="comment-text">{c.content}</span>
                </div>
              </div>
            ))
          )}
          <form onSubmit={handleComment} className="comment-form">
            <Avatar name={currentUser.user_metadata?.full_name || currentUser.email} />
            <input
              className="comment-input"
              value={commentText}
              onChange={e => setCommentText(e.target.value)}
              placeholder="Write a comment..."
            />
            <button type="submit" className="comment-submit" disabled={!commentText.trim()}>Post</button>
          </form>
        </div>
      )}
    </div>
  )
}
