import React, { useEffect, useState } from 'react'
import axios from 'axios'
import PostCard from '../components/PostCard'
import CreatePostModal from '../components/CreatePostModal'
import SkeletonPost from '../components/SkeletonPost'

const PAGE_LIMIT = 10
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000'

export default function Feed(){
  const [allPosts, setAllPosts] = useState([])
  const [displayedPosts, setDisplayedPosts] = useState([])
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)

  useEffect(()=>{
    async function fetchAll(){
      try{
        const res = await axios.get(`${API_BASE_URL}/posts`)
        setAllPosts(res.data)
        setDisplayedPosts(res.data.slice(0, PAGE_LIMIT))
        setPage(1)
      }catch(e){
        console.error('Failed to fetch posts', e)
      }finally{
        setLoading(false)
      }
    }

    fetchAll()
  },[])

  function handleLoadMore(){
    const nextPage = page + 1
    const start = (nextPage - 1) * PAGE_LIMIT
    const end = start + PAGE_LIMIT

    if(start < allPosts.length){
      setDisplayedPosts(prev => [...prev, ...allPosts.slice(start, end)])
      setPage(nextPage)
    }
  }

  const hasMore = displayedPosts.length < allPosts.length

  useEffect(()=>{
    function onScroll(){
      const el = document.documentElement
      if(window.innerHeight + el.scrollTop + 100 >= el.scrollHeight){
        if(!loading && hasMore) handleLoadMore()
      }
    }

    window.addEventListener('scroll', onScroll)
    return ()=>window.removeEventListener('scroll', onScroll)
  },[loading, hasMore, displayedPosts, allPosts, page])

  return (
    <main className="min-h-screen">
      <div className="sticky top-16 z-40 border-b border-white/70 bg-white/75 backdrop-blur-xl">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 py-4">
          <div className="rounded-3xl border border-white/70 bg-white/80 px-5 py-4 shadow-lg shadow-indigo-100/60 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-indigo-500">Central feed</p>
              <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Your Feed</h1>
              <p className="text-slate-600 text-sm">{allPosts.length} posts total</p>
            </div>
            <button onClick={()=>setShowModal(true)} className="btn-primary flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              <span>Create Post</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8">
        <div className="mb-6 rounded-3xl border border-white/70 bg-white/70 backdrop-blur px-5 py-5 shadow-lg shadow-slate-200/50">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-cyan-600">Curated timeline</p>
              <h2 className="text-xl font-semibold text-slate-900">A clean, centered view of your latest moments</h2>
            </div>
            <div className="inline-flex items-center gap-2 rounded-full bg-indigo-50 px-3 py-2 text-sm text-indigo-700 border border-indigo-100 w-fit">
              <span className="h-2 w-2 rounded-full bg-emerald-500"></span>
              Live updates enabled
            </div>
          </div>
        </div>

        {loading && displayedPosts.length === 0 ? (
          <div className="space-y-4">
            {[1,2,3].map(i => <SkeletonPost key={i}/>) }
          </div>
        ) : displayedPosts.length > 0 ? (
          <div className="space-y-4">
            {displayedPosts.map(post => (
              <PostCard
                key={post.id}
                post={post}
                onUpdate={updated=>{
                  setDisplayedPosts(prev=>prev.map(p=>p.id===updated.id?updated:p))
                }}
              />
            ))}
            {hasMore && (
              <div className="flex justify-center py-8">
                <div className="flex flex-col items-center gap-3 rounded-2xl bg-white/70 backdrop-blur px-6 py-4 border border-slate-200/80 shadow-sm">
                  <div className="animate-spin">
                    <svg className="w-8 h-8 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                  </div>
                  <p className="text-slate-600">Loading more posts...</p>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="card p-12 text-center">
            <svg className="w-16 h-16 mx-auto text-indigo-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            <p className="text-slate-600 text-lg">No posts yet. Be the first to share!</p>
          </div>
        )}
      </div>

      <CreatePostModal
        open={showModal}
        onClose={()=>setShowModal(false)}
        onCreated={post=>{
          setDisplayedPosts(prev=>[post,...prev])
          setAllPosts(prev=>[post,...prev])
        }}
      />
    </main>
  )
}