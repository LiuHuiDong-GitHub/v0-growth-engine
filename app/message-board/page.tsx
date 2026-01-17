"use client"

import { useState } from "react"
import { Upload, Send } from "lucide-react"
import AppHeader from "@/components/app-header"

export default function MessageBoardPage() {
  const [message, setMessage] = useState("")
  const [messages, setMessages] = useState([
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
    if (message.trim()) {
      const newMessage = {
        id: messages.length + 1,
        type: "user",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=user1",
        text: message,
        time: new Date().toLocaleTimeString("zh-CN", { hour: "2-digit", minute: "2-digit" }),
      }
      setMessages([...messages, newMessage])
      setMessage("")
    }
  }

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <AppHeader breadcrumbItems={[{ label: "待推广项目", href: "/select-product" }, { label: "留言板" }]} />

      <main className="flex-1 p-8 pt-24">
        <div className="mx-auto max-w-4xl">
          <div className="rounded-2xl bg-white p-8 shadow-lg border-transparent border-0 px-7 py-7 mt-5">
            <h1 className="mb-4 text-3xl font-bold text-slate-900">留言板</h1>
            <p className="mb-8 text-slate-600 leading-relaxed">
              有任何建议、疑问、申诉、反馈都可以发送给我们，我们的平台运营会及时回复您，并做到公平、公正处理任何问题。
            </p>

            {/* Messages */}
            <div className="mb-6 space-y-6">
              {messages.map((msg) => (
                <div key={msg.id} className={`flex gap-4 ${msg.type === "user" ? "justify-end" : ""}`}>
                  {msg.type === "admin" && (
                    <div className="h-12 w-12 flex-shrink-0 overflow-hidden rounded-full bg-slate-100">
                      <img
                        src={msg.avatar || "/placeholder.svg"}
                        alt={msg.name}
                        className="h-full w-full object-cover"
                      />
                    </div>
                  )}
                  <div className={`max-w-2xl ${msg.type === "user" ? "order-first" : ""}`}>
                    {msg.type === "admin" && <div className="mb-1 text-xs text-slate-500">{msg.name}</div>}
                    <div
                      className={`rounded-2xl px-6 py-4 ${
                        msg.type === "user"
                          ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white"
                          : "bg-slate-100 text-slate-900"
                      }`}
                    >
                      <p className="leading-relaxed">{msg.text}</p>
                    </div>
                    <div className={`mt-1 text-xs text-slate-400 ${msg.type === "user" ? "text-right" : ""}`}>
                      {msg.time}
                    </div>
                  </div>
                  {msg.type === "user" && (
                    <div className="h-12 w-12 flex-shrink-0 overflow-hidden rounded-full bg-gradient-to-br from-blue-400 to-indigo-600">
                      <img src={msg.avatar || "/placeholder.svg"} alt="User" className="h-full w-full object-cover" />
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Message Input */}
            <div className="flex items-end gap-3 pt-6 border-t-0">
              
              <div className="flex-1 rounded-full border-2 border-slate-200 bg-white px-6 py-3 transition-colors focus-within:border-blue-400">
                <input
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                  placeholder="在此输入消息..."
                  className="w-full bg-transparent text-slate-900 placeholder-slate-400 outline-none"
                />
              </div>
              <button
                onClick={handleSendMessage}
                className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-r from-blue-500 to-blue-600 text-white transition-transform hover:scale-105 active:scale-95"
              >
                <Send className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white/50 text-center border-t-0 py-5">
        <p className="text-sm text-slate-600">© 2025 GrowthEngine. All rights reserved.</p>
      </footer>
    </div>
  )
}
