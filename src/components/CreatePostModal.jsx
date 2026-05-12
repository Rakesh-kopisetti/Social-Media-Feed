import React, { useCallback, useEffect, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import imageCompression from 'browser-image-compression'
import axios from 'axios'
import { toast } from 'react-toastify'

// expose compression function for automated checks
window.compressImage = async (file) => {
  return await imageCompression(file, { maxSizeMB: 1, maxWidthOrHeight: 1024 })
}

export default function CreatePostModal({open, onClose, onCreated}){
  const [file, setFile] = useState(null)
  const [preview, setPreview] = useState(null)
  const [caption, setCaption] = useState('')
  const [submitting, setSubmitting] = useState(false)

  useEffect(()=>{
    if(!file){ setPreview(null); return }
    const url = URL.createObjectURL(file)
    setPreview(url)
    return ()=> URL.revokeObjectURL(url)
  },[file])

  const onDrop = useCallback(accepted=>{
    if(accepted[0]) setFile(accepted[0])
  },[])

  const {getRootProps, getInputProps} = useDropzone({onDrop, accept:{'image/*':[]}})

  async function handleSubmit(e){
    e.preventDefault()
    if(!file) return toast.error('Please select an image')
    if(!caption.trim()) return toast.error('Please add a caption')
    setSubmitting(true)
    try{
      const compressed = await window.compressImage(file)
      // For mock server, we'll upload by creating an object URL
      const imageUrl = URL.createObjectURL(compressed)
      const payload = { userId: 1, imageUrl, caption, likes: 0, isLiked:false }
      const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000'
      const res = await axios.post(`${API_BASE_URL}/posts`, payload)
      onCreated && onCreated(res.data)
      toast.success('🎉 Post created successfully!')
      onClose()
      setFile(null)
      setCaption('')
    }catch(e){
      toast.error('Failed to create post')
    }finally{ setSubmitting(false) }
  }

  if(!open) return null

  return (
    <div className="fixed inset-0 bg-slate-950/50 backdrop-blur-md flex items-center justify-center z-50 p-4">
      <form onSubmit={handleSubmit} className="bg-white rounded-3xl shadow-2xl shadow-indigo-200/50 w-full max-w-md overflow-hidden border border-white/70">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-gradient-to-r from-indigo-50 via-white to-cyan-50">
          <h3 className="text-xl font-bold text-slate-900">Create a Post</h3>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-500 hover:text-slate-700 transition-colors hover:bg-white rounded-full p-1"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-6 space-y-5">
          {/* Image Dropzone */}
          <div
            {...getRootProps()}
            className="border-2 border-dashed border-slate-300 rounded-2xl p-8 text-center cursor-pointer hover:border-indigo-500 hover:bg-indigo-50/40 transition-all duration-200"
          >
            <input {...getInputProps()} />
            {preview ? (
              <div className="space-y-3">
                <img src={preview} alt="preview" className="max-h-44 mx-auto rounded-2xl shadow-lg" />
                <p className="text-sm text-slate-600">Click to change</p>
              </div>
            ) : (
              <div className="space-y-2">
                <svg className="w-12 h-12 mx-auto text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <p className="font-medium text-slate-700">Drag image here</p>
                <p className="text-sm text-slate-500">or click to browse</p>
              </div>
            )}
          </div>

          {/* Caption Input */}
          <div>
            <label className="block text-sm font-semibold text-slate-900 mb-2">Caption</label>
            <textarea
              placeholder="What's on your mind?"
              value={caption}
              onChange={e=>setCaption(e.target.value)}
              maxLength={280}
              rows={3}
              className="w-full px-4 py-2.5 border border-slate-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none transition-all text-slate-900 placeholder-slate-500 bg-slate-50/80"
            />
            <p className="text-xs text-slate-500 mt-1.5 text-right">{caption.length}/280</p>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-gradient-to-r from-slate-50 to-indigo-50/40 border-t border-slate-200 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="btn-secondary"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={submitting}
            className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {submitting ? '📤 Posting...' : '✨ Post'}
          </button>
        </div>
      </form>
    </div>
  )
}

