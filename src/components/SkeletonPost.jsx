import React from 'react'

export default function SkeletonPost(){
  return (
    <div className="card overflow-hidden p-5 space-y-4 animate-pulse max-w-full mx-auto">
      <div className="flex items-center gap-3">
        <div className="w-11 h-11 bg-gradient-to-br from-indigo-100 to-cyan-100 rounded-full"></div>
        <div className="flex-1 space-y-2">
          <div className="h-3 bg-slate-200 rounded w-32"></div>
          <div className="h-2.5 bg-slate-200 rounded w-24"></div>
        </div>
      </div>
      <div className="h-52 bg-gradient-to-r from-slate-200 via-slate-100 to-slate-200 rounded-2xl"></div>
      <div className="space-y-2">
        <div className="h-3 bg-slate-200 rounded w-full"></div>
        <div className="h-3 bg-slate-200 rounded w-4/5"></div>
      </div>
      <div className="flex gap-2 pt-2">
        <div className="h-9 bg-slate-200 rounded-full w-16"></div>
        <div className="h-9 bg-slate-200 rounded-full w-16"></div>
        <div className="h-9 bg-slate-200 rounded-full w-16 ml-auto"></div>
      </div>
    </div>
  )
}

