"use client"

import React from "react"

import { useState, useRef } from "react"
import { Upload, Send, Plus, FileText, ImageIcon, Video, Music, File as FileIcon, Settings, MessageSquare } from "lucide-react"
import Link from "next/link"
import AppHeader from "@/components/app-header"

type Message = {
  id: number
  type: "user" | "admin"
  avatar: string
  name?: string
  text?: string
  time: string
  files?: { name: string; size: number; type: string }[]
}

export default function MessageBoardPage() {
  const [message, setMessage] = useState("")
  const [files, setFiles] = useState<File[]>([])
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [showSettingsModal, setShowSettingsModal] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      type: "user",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=user1",
      text: "我的订单状态是待发货，请问什么时候能处理？",
      time: "10:30",
    },
    {
      id: 2,
      type: "admin",
      avatar: "https://api.dicebear.com/7.x/bottts/svg?seed=platform",
      name: "Platform",
      text: "您好！针对您的订单状态问题，我们已将其标记为优先处理。我们的团队将在24小时内更新您的订单状态，并会通过邮件通知您具体发货时间。",
      time: "10:32",
    },
    {
      id: 3,
      type: "admin",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=support",
      name: "Support",
      text: "您的留言已发送。我们会在24小时内通过邮件回复您。请留意您的邮箱：support@platform.com。",
      time: "10:35",
    },
  ])

  const handleSendMessage = () => {
    if (message.trim() || files.length > 0) {
      const newMessage: Message = {
        id: messages.length + 1,
        type: "user",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=user1",
        text: message || undefined,
        time: new Date().toLocaleTimeString("zh-CN", { hour: "2-digit", minute: "2-digit" }),
        files:
          files.length > 0
            ? files.map((file) => ({
                name: file.name,
                size: file.size,
                type: file.type,
              }))
            : undefined,
      }
      setMessages([...messages, newMessage])
      setMessage("")
      setFiles([])
    }
  }

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
  }

  const getFileIcon = (type: string) => {
    if (type.startsWith("image/")) return <ImageIcon className="h-5 w-5 sm:h-6 sm:w-6" />
    if (type.startsWith("video/")) return <Video className="h-5 w-5 sm:h-6 sm:w-6" />
    if (type.startsWith("audio/")) return <Music className="h-5 w-5 sm:h-6 sm:w-6" />
    if (type.includes("pdf") || type.includes("document")) return <FileText className="h-5 w-5 sm:h-6 sm:w-6" />
    return <FileIcon className="h-5 w-5 sm:h-6 sm:w-6" />
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = e.target.files
    if (selectedFiles) {
      setFiles(Array.from(selectedFiles))
    }
  }

  const handleUploadClick = () => {
    fileInputRef.current?.click()
  }

  const removeFile = (index: number) => {
    setFiles(files.filter((_, i) => i !== index))
  }

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <AppHeader breadcrumbItems={[{ label: "待推广项目", href: "/select-product" }, { label: "留言板" }]} />

      <main className="flex-1 p-4 sm:p-6 md:p-8 pt-20 sm:pt-24">
        <div className="mx-auto max-w-4xl">
          <div className="rounded-xl sm:rounded-2xl bg-white p-4 sm:p-6 md:p-8 shadow-lg border-transparent border-0 mt-4 sm:mt-5">
            <div className="flex items-center justify-between mb-3 sm:mb-4">
              <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">留言板</h1>
              <button
                onClick={() => setShowSettingsModal(true)}
                className="flex h-10 w-10 items-center justify-center rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
                title="设置"
              >
                <Settings className="h-5 w-5" />
              </button>
            </div>
            <p className="mb-6 sm:mb-8 text-sm sm:text-base text-slate-600 leading-relaxed">
              有任何建议、疑问、申诉、反馈都可以发送给我们，我们的平台运营会及时回复您，并做到公平、公正处理任何问题。
            </p>

            {/* Messages */}
            <div className="mb-4 sm:mb-6 space-y-4 sm:space-y-6">
              {messages.map((msg) => (
                <div key={msg.id} className={`flex gap-2 sm:gap-4 ${msg.type === "user" ? "justify-end" : ""}`}>
                  {msg.type === "admin" && (
                    <div className="h-10 w-10 sm:h-12 sm:w-12 flex-shrink-0 overflow-hidden rounded-full bg-slate-100">
                      <img
                        src={msg.avatar || "/placeholder.svg"}
                        alt={msg.name}
                        className="h-full w-full object-cover"
                      />
                    </div>
                  )}
                  <div className={`max-w-[85%] sm:max-w-2xl ${msg.type === "user" ? "order-first" : ""}`}>
                    {msg.type === "admin" && <div className="mb-1 text-[10px] sm:text-xs text-slate-500">{msg.name}</div>}
                    
                    {msg.text && (
                      <div
                        className={`rounded-2xl px-4 sm:px-6 py-3 sm:py-4 ${
                          msg.type === "user"
                            ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white"
                            : "bg-slate-100 text-slate-900"
                        } ${msg.files && msg.files.length > 0 ? "mb-2" : ""}`}
                      >
                        <p className="text-sm sm:text-base leading-relaxed">{msg.text}</p>
                      </div>
                    )}

                    {msg.files && msg.files.length > 0 && (
                      <div className="space-y-2">
                        {msg.files.map((file, fileIndex) => (
                          <div
                            key={fileIndex}
                            className={`rounded-xl px-3 sm:px-4 py-2.5 sm:py-3 flex items-center gap-3 border ${
                              msg.type === "user"
                                ? "bg-blue-50 border-blue-200"
                                : "bg-white border-slate-200"
                            }`}
                          >
                            <div
                              className={`flex-shrink-0 h-10 w-10 sm:h-12 sm:w-12 rounded-lg flex items-center justify-center ${
                                msg.type === "user" ? "bg-blue-100 text-blue-600" : "bg-slate-100 text-slate-600"
                              }`}
                            >
                              {getFileIcon(file.type)}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="text-sm sm:text-base font-medium text-slate-900 truncate">
                                {file.name}
                              </div>
                              <div className="text-xs sm:text-sm text-slate-500">
                                {formatFileSize(file.size)}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    <div className={`mt-1 text-[10px] sm:text-xs text-slate-400 ${msg.type === "user" ? "text-right" : ""}`}>
                      {msg.time}
                    </div>
                  </div>
                  {msg.type === "user" && (
                    <div className="h-10 w-10 sm:h-12 sm:w-12 flex-shrink-0 overflow-hidden rounded-full bg-gradient-to-br from-blue-400 to-indigo-600">
                      <img src={msg.avatar || "/placeholder.svg"} alt="User" className="h-full w-full object-cover" />
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Message Input */}
            <div className="flex items-end gap-2 sm:gap-3 pt-4 sm:pt-6 border-t-0">
              <div className="flex-1 rounded-full border-2 border-slate-200 bg-white px-2 sm:px-4 py-2 sm:py-3 transition-colors focus-within:border-blue-400 flex items-center gap-2">
                <button
                  onClick={handleUploadClick}
                  className="flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-full text-slate-400 transition-colors hover:text-slate-600 hover:bg-slate-100 active:scale-95 flex-shrink-0"
                  title="上传文件"
                >
                  <Plus className="h-5 w-5 sm:h-6 sm:w-6" />
                </button>
                
                <input
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                  placeholder="在此输入消息..."
                  className="flex-1 bg-transparent text-sm sm:text-base text-slate-900 placeholder-slate-400 outline-none"
                />
              </div>
              
              {/* Hidden File Input */}
              <input
                ref={fileInputRef}
                type="file"
                multiple
                onChange={handleFileSelect}
                className="hidden"
                accept="*/*"
              />
              
              <button
                onClick={handleSendMessage}
                className="flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-full bg-gradient-to-r from-blue-500 to-blue-600 text-white transition-transform hover:scale-105 active:scale-95 flex-shrink-0"
              >
                <Send className="h-4 w-4 sm:h-5 sm:w-5" />
              </button>
            </div>

            {/* File List */}
            {files.length > 0 && (
              <div className="mt-3 sm:mt-4 flex flex-wrap gap-2">
                {files.map((file, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-2 bg-slate-100 rounded-full px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm text-slate-700"
                  >
                    <span className="truncate max-w-[200px] sm:max-w-xs">{file.name}</span>
                    <button
                      onClick={() => removeFile(index)}
                      className="text-slate-400 hover:text-slate-600 transition-colors"
                      title="删除文件"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white/50 text-center border-t-0 py-4 sm:py-5">
        <p className="text-xs sm:text-sm text-slate-600">© 2025 GrowthEngine. All rights reserved.</p>
      </footer>

      {showSettingsModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
          onClick={() => setShowSettingsModal(false)}
        >
          <div className="mx-4 w-full max-w-4xl rounded-2xl bg-white shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex h-[600px]">
              {/* Sidebar */}
              <aside className="w-64 border-r bg-slate-50 p-6 rounded-l-2xl">
                <div className="mb-8 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600">
                    <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M11.067 19.027a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z"
                      />
                    </svg>
                  </div>
                </div>

                <nav className="flex flex-col gap-1">
                  <button
                    onClick={() => setShowSettingsModal(true)}
                    className="flex items-center gap-3 rounded-lg px-3 py-2 text-left text-sm text-blue-600 bg-blue-50 font-medium"
                  >
                    <Settings className="h-5 w-5" />
                    <span>设置</span>
                  </button>

                  <Link
                    href="/message-board"
                    className="flex items-center gap-3 rounded-lg px-3 py-2 text-left text-sm text-slate-600 hover:bg-slate-100"
                  >
                    <MessageSquare className="h-5 w-5" />
                    <span>留言</span>
                  </Link>
                </nav>
              </aside>

              {/* Main Content */}
              <div className="flex-1 overflow-y-auto p-8">
                <div className="mb-8 flex items-center justify-between">
                  <h2 className="text-3xl font-bold text-slate-900">设置</h2>
                  <button
                    onClick={() => setShowSettingsModal(false)}
                    className="rounded-full p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
                  >
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                <div className="space-y-6">
                  {/* Account Management */}
                  <div className="rounded-xl border p-6">
                    <div className="flex items-start gap-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-100">
                        <svg className="h-6 w-6 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                          />
                        </svg>
                      </div>
                      <div className="flex-1">
                        <h3 className="mb-1 text-lg font-semibold text-slate-900">账号管理</h3>
                        <p className="text-sm text-slate-600">更新您的个人资料和密码</p>
                      </div>
                    </div>
                  </div>

                  {/* Notifications */}
                  <div className="rounded-xl border p-6">
                    <div className="flex items-start gap-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-100">
                        <svg className="h-6 w-6 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                          />
                        </svg>
                      </div>
                      <div className="flex-1">
                        <h3 className="mb-1 text-lg font-semibold text-slate-900">通知设置</h3>
                        <p className="text-sm text-slate-600">管理您的通知偏好和提醒</p>
                      </div>
                    </div>
                  </div>

                  {/* Privacy & Security */}
                  <div className="rounded-xl border p-6">
                    <div className="flex items-start gap-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-100">
                        <svg className="h-6 w-6 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                          />
                        </svg>
                      </div>
                      <div className="flex-1">
                        <h3 className="mb-1 text-lg font-semibold text-slate-900">隐私与安全</h3>
                        <p className="text-sm text-slate-600">保护您的账号和个人数据</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
