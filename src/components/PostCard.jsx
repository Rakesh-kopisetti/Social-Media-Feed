import React, { useState } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'

function ErrorBoundary({children}){
  try{
    return children
  }catch(e){
    return (
      <div className="card p-6 border border-rose-200 bg-rose-50">
        <div className="flex items-center gap-2 text-rose-700">
          <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
          </svg>
          <span className="font-medium text-sm">Failed to load post</span>
        </div>
      </div>
    )
  }
}

export default function PostCard({post, onUpdate}){
  const [isLiked, setIsLiked] = useState(post.isLiked)
  const [likes, setLikes] = useState(post.likes)
  const [saving, setSaving] = useState(false)

  async function toggleLike(){
    const prevLiked = isLiked
    const prevCount = likes
    setIsLiked(!prevLiked)
    setLikes(prevLiked?likes-1:likes+1)
    try{
      setSaving(true)
      const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000'
      await axios.patch(`${API_BASE_URL}/posts/${post.id}`, { isLiked: !prevLiked, likes: prevLiked?likes-1:likes+1 })
      onUpdate && onUpdate({...post, isLiked:!prevLiked, likes: prevLiked?likes-1:likes+1})
    }catch(e){
      setIsLiked(prevLiked)
      setLikes(prevCount)
      toast.error('Failed to update like')
    }finally{setSaving(false)}
  }

  return (
    <ErrorBoundary>
      <div className="card overflow-hidden group max-w-full mx-auto">
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-100 flex items-center gap-3 bg-gradient-to-r from-white via-slate-50 to-indigo-50/70">
          <div className="w-11 h-11 bg-gradient-to-br from-indigo-600 via-blue-600 to-cyan-500 rounded-full flex items-center justify-center text-white font-semibold text-sm shadow-md shadow-indigo-200/60">
            U{String(post.userId).charAt(0)}
          </div>
          <div>
            <p className="font-semibold text-slate-900 text-sm">User {post.userId}</p>
            <p className="text-xs text-slate-500">@user{post.userId}</p>
          </div>
        </div>

        {/* Image */}
        <div className="relative bg-slate-200 overflow-hidden">
          <img 
            src={post.imageUrl} 
            alt="post" 
            className="w-full aspect-[4/3] object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </div>

        {/* Content */}
        <div className="px-5 py-4 space-y-3 bg-gradient-to-b from-white to-slate-50/70">
          <p className="text-slate-700 leading-relaxed text-[15px]">{post.caption}</p>

          {/* Actions */}
          <div className="flex items-center gap-3 pt-3 border-t border-slate-100">
            <button
              onClick={toggleLike}
              disabled={saving}
              className="flex items-center gap-2 group cursor-pointer transition-all duration-200"
            >
              <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200 ${
                isLiked 
                  ? 'bg-rose-100' 
                  : 'bg-slate-100 group-hover:bg-rose-50'
              }`}>
                <span className={`text-lg transition-transform duration-200 ${
                  isLiked 
                    ? 'text-rose-500 scale-125' 
                    : 'text-slate-600 group-hover:scale-110'
                }`}>
                  {isLiked ? '❤️' : '🤍'}
                </span>
              </div>
              <span className={`font-semibold text-sm transition-colors ${
                isLiked ? 'text-rose-600' : 'text-slate-700 group-hover:text-slate-900'
              }`}>
                {likes}
              </span>
            </button>

            <button className="flex items-center gap-2 text-slate-600 hover:text-indigo-600 transition-colors group">
              <div className="w-10 h-10 rounded-full bg-slate-100 group-hover:bg-indigo-100 flex items-center justify-center transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
            </button>

            <button className="flex items-center gap-2 text-slate-600 hover:text-emerald-600 transition-colors group ml-auto">
              <div className="w-10 h-10 rounded-full bg-slate-100 group-hover:bg-emerald-100 flex items-center justify-center transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
              </div>
            </button>
          </div>
        </div>
      </div>
    </ErrorBoundary>
  )
}
