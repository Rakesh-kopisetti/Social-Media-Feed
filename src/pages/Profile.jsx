import React, { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import axios from 'axios'
import PostCard from '../components/PostCard'
import SkeletonPost from '../components/SkeletonPost'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000'

export default function Profile(){
  const { userId } = useParams()
  const [posts, setPosts] = useState([])
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(()=>{
    async function fetchUserAndPosts() {
      try {
        const [postsRes, usersRes] = await Promise.all([
          axios.get(`${API_BASE_URL}/posts`),
          axios.get(`${API_BASE_URL}/users`)
        ])
        // Filter client-side (JSON Server v1 workaround)
        const userPosts = postsRes.data.filter(p => p.userId === parseInt(userId))
        const userInfo = usersRes.data.find(u => u.id === parseInt(userId))
        setPosts(userPosts)
        setUser(userInfo)
      } catch(e) {
        console.error('Failed to fetch profile', e)
      } finally {
        setLoading(false)
      }
    }
    fetchUserAndPosts()
  },[userId])

  if(loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
        <div className="space-y-4">
          {[1,2,3].map(i => <SkeletonPost key={i}/>)}
        </div>
      </div>
    )
  }

  return (
    <main className="min-h-screen">
      {/* Profile Header */}
      <div className="bg-gradient-to-r from-indigo-700 via-blue-600 to-cyan-500 h-36"></div>
      
      <div className="max-w-2xl mx-auto px-4 sm:px-6">
        {user && (
          <div className="bg-white/95 backdrop-blur rounded-3xl border border-slate-200/80 shadow-xl shadow-slate-200/60 -mt-16 mb-8 p-6 relative">
            <div className="flex flex-col sm:flex-row items-start sm:items-end gap-6">
              <div className="w-32 h-32 bg-gradient-to-br from-indigo-600 via-blue-600 to-cyan-500 rounded-full flex items-center justify-center text-white text-4xl font-bold border-4 border-white shadow-xl shadow-indigo-200/60">
                {user.username.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1">
                <h1 className="text-3xl font-bold text-slate-900">{user.username}</h1>
                <p className="text-slate-600">@{user.username}</p>
                <div className="mt-4 flex gap-3 text-sm flex-wrap">
                  <div className="px-3 py-2 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-100">
                    <span className="font-bold">{posts.length}</span>
                    <span className="ml-1">Posts</span>
                  </div>
                  <div className="px-3 py-2 rounded-full bg-cyan-50 text-cyan-700 border border-cyan-100">
                    <span className="font-bold">0</span>
                    <span className="ml-1">Followers</span>
                  </div>
                </div>
              </div>
              <Link
                to="/"
                className="btn-secondary self-start sm:self-auto"
              >
                Back to Feed
              </Link>
            </div>
          </div>
        )}

        {/* Posts Section */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-6 flex-wrap gap-2">
            <h2 className="text-2xl font-bold text-slate-900">Posts by {user?.username}</h2>
            <span className="text-sm text-slate-500">Clean layout, focused content</span>
          </div>
          
          {posts.length > 0 ? (
            <div className="space-y-4">
              {posts.map(post => (
                <PostCard
                  key={post.id}
                  post={post}
                  onUpdate={updated=>{
                    setPosts(prev=>prev.map(p=>p.id===updated.id?updated:p))
                  }}
                />
              ))}
            </div>
          ) : (
            <div className="card p-12 text-center">
              <svg className="w-16 h-16 mx-auto text-indigo-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <p className="text-slate-600 text-lg">No posts yet</p>
            </div>
          )}
        </div>
      </div>
    </main>
  )
}
