'use client'

import { useState } from 'react'
import { useQuery, useMutation } from 'convex/react'
import { api } from '@/convex/_generated/api'
import { Id } from '@/convex/_generated/dataModel'
import { Button } from '@/components/ui/button'
import { 
  MessageSquare, 
  Plus, 
  Trash2, 
  Menu,
  X,
  Edit2,
  Check
} from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'

interface ConversationSidebarProps {
  userId: string
  currentConversationId?: string
  onSelectConversation: (conversationId: string) => void
  onNewConversation: () => void
}

export function ConversationSidebar({
  userId,
  currentConversationId,
  onSelectConversation,
  onNewConversation,
}: ConversationSidebarProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editTitle, setEditTitle] = useState('')
  
  const conversations = useQuery(api.conversations.getUserConversations, {
    userId: userId as Id<"users">
  })
  
  const deleteConversation = useMutation(api.conversations.deleteConversation)
  const updateTitle = useMutation(api.conversations.updateConversationTitle)

  const handleDelete = async (conversationId: Id<"conversations">) => {
    if (confirm('Are you sure you want to delete this conversation?')) {
      await deleteConversation({ conversationId })
      if (conversationId === currentConversationId) {
        onNewConversation()
      }
    }
  }

  const handleUpdateTitle = async (conversationId: Id<"conversations">) => {
    if (editTitle.trim()) {
      await updateTitle({ 
        conversationId, 
        title: editTitle.trim() 
      })
    }
    setEditingId(null)
    setEditTitle('')
  }

  return (
    <>
      {/* Mobile Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="md:hidden fixed left-4 top-20 z-40 p-2 bg-white dark:bg-gray-800 rounded-md shadow-lg"
      >
        {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </button>

      {/* Sidebar */}
      <aside className={`
        fixed md:relative top-0 left-0 z-30
        w-72 h-screen bg-gray-50 dark:bg-gray-900 
        border-r border-gray-200 dark:border-gray-700
        transform transition-transform duration-200 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
        pt-16 md:pt-0
      `}>
        <div className="flex flex-col h-full">
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <Button 
              onClick={onNewConversation}
              className="w-full"
              variant="orange"
            >
              <Plus className="w-4 h-4 mr-2" />
              New Search
            </Button>
          </div>

          <div className="flex-1 overflow-y-auto">
            {conversations?.length === 0 ? (
              <div className="p-4 text-center text-gray-500 dark:text-gray-400">
                <MessageSquare className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">No conversations yet</p>
                <p className="text-xs mt-1">Start a new search to begin</p>
              </div>
            ) : (
              <div className="py-2">
                {conversations?.map((conversation) => (
                  <div
                    key={conversation._id}
                    className={`
                      group px-3 py-2 mx-2 rounded-md cursor-pointer
                      transition-colors duration-150
                      ${currentConversationId === conversation._id
                        ? 'bg-orange-100 dark:bg-orange-900/20'
                        : 'hover:bg-gray-100 dark:hover:bg-gray-800'
                      }
                    `}
                  >
                    {editingId === conversation._id ? (
                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          value={editTitle}
                          onChange={(e) => setEditTitle(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              handleUpdateTitle(conversation._id)
                            } else if (e.key === 'Escape') {
                              setEditingId(null)
                            }
                          }}
                          className="flex-1 px-2 py-1 text-sm bg-white dark:bg-gray-700 rounded border border-gray-300 dark:border-gray-600"
                          autoFocus
                        />
                        <button
                          onClick={() => handleUpdateTitle(conversation._id)}
                          className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded"
                        >
                          <Check className="w-4 h-4 text-green-600" />
                        </button>
                      </div>
                    ) : (
                      <div 
                        onClick={() => onSelectConversation(conversation._id)}
                        className="flex items-start justify-between"
                      >
                        <div className="flex-1 min-w-0">
                          <h3 className="text-sm font-medium text-gray-900 dark:text-white truncate">
                            {conversation.title}
                          </h3>
                          <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                            {conversation.lastMessage}
                          </p>
                          <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                            {formatDistanceToNow(new Date(conversation.updatedAt), { addSuffix: true })}
                          </p>
                        </div>
                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              setEditingId(conversation._id)
                              setEditTitle(conversation.title)
                            }}
                            className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded"
                          >
                            <Edit2 className="w-3 h-3" />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              handleDelete(conversation._id)
                            }}
                            className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded text-red-600"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </aside>

      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-20"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  )
}