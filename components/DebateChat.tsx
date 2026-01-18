'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import type { DebateMessage } from '@/types'

interface DebateChatProps {
  messages: DebateMessage[]
  isDebating: boolean
  finalComment: string
}

export default function DebateChat({ messages, isDebating, finalComment }: DebateChatProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const [aliceImageError, setAliceImageError] = useState(false)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, finalComment])

  const getCharacterStyle = (speaker: 'alice' | 'rabbit') => {
    if (speaker === 'alice') {
      return {
        bubble: 'bg-gradient-to-br from-gray-800 via-purple-900 to-black border-2 border-purple-600 shadow-lg shadow-purple-900/50',
        icon: '👧',
        iconImage: '/alice.png',
        name: 'アリス',
        textColor: 'text-purple-200',
      }
    } else {
      return {
        bubble: 'bg-gradient-to-br from-gray-900 via-red-900 to-black border-2 border-red-600 shadow-lg shadow-red-900/50',
        icon: '🐰',
        iconImage: null,
        name: '白うさぎ',
        textColor: 'text-red-200',
      }
    }
  }

  return (
    <div className="bg-gradient-to-br from-gray-900/95 via-black/90 to-purple-900/95 backdrop-blur-sm rounded-3xl shadow-2xl shadow-purple-900/50 p-6 md:p-8 min-h-[400px] max-h-[600px] overflow-y-auto border-2 border-purple-600 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-purple-600/20 to-black/40 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-40 h-40 bg-gradient-to-tr from-gray-800/30 to-purple-800/20 rounded-full blur-3xl" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(147,51,234,0.1),transparent_70%)] pointer-events-none" />
      <AnimatePresence>
        {messages.map((message, index) => {
          const style = getCharacterStyle(message.speaker)
          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className={`mb-4 relative z-10 ${message.speaker === 'alice' ? 'text-left' : 'text-right'}`}
            >
              <div className={`flex items-start gap-3 ${message.speaker === 'alice' ? 'flex-row' : 'flex-row-reverse'}`}>
                <motion.div
                  className="text-4xl relative w-12 h-12 flex items-center justify-center"
                  animate={message.isThinking ? {
                    rotate: [0, 15, -15, 10, -10, 0],
                    scale: [1, 1.1, 0.9, 1],
                  } : {
                    rotate: message.speaker === 'alice' ? [0, 5, -5, 0] : [0, -5, 5, 0],
                    scale: [1, 1.05, 1],
                  }}
                  transition={{
                    duration: message.isThinking ? 1.5 : 3,
                    repeat: message.isThinking ? Infinity : Infinity,
                    ease: "easeInOut"
                  }}
                  whileHover={{ scale: 1.2, rotate: 10 }}
                >
                  {message.speaker === 'alice' && style.iconImage && !aliceImageError ? (
                    <Image
                      src={style.iconImage}
                      alt="アリス"
                      width={48}
                      height={48}
                      className="object-contain"
                      unoptimized
                      onError={() => setAliceImageError(true)}
                    />
                  ) : (
                    <span>{style.icon}</span>
                  )}
                </motion.div>
                <div className={`flex-1 ${message.speaker === 'alice' ? '' : 'text-right'}`}>
                  <div className="text-sm font-handwritten text-gray-400 mb-1">
                    {style.name}
                  </div>
                  <motion.div 
                    className={`inline-block px-5 py-3 rounded-3xl ${style.bubble} ${style.textColor} font-handwritten text-base relative`}
                    initial={{ opacity: 0, scale: 0.8, rotate: message.speaker === 'alice' ? -2 : 2 }}
                    animate={{ opacity: 1, scale: 1, rotate: 0 }}
                    transition={{ duration: 0.3, ease: "easeOut" }}
                    whileHover={{ scale: 1.05, rotate: message.speaker === 'alice' ? 2 : -2 }}
                  >
                    <div className="relative z-10 whitespace-pre-wrap break-words text-left">
                      {message.message}
                    </div>
                    {message.speaker === 'alice' && (
                      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-purple-500/10 to-transparent rounded-3xl" />
                    )}
                    {message.speaker === 'rabbit' && (
                      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-red-500/10 to-transparent rounded-3xl" />
                    )}
                  </motion.div>
                </div>
              </div>
            </motion.div>
          )
        })}
      </AnimatePresence>

      {isDebating && (
        <motion.div
          animate={{ 
            opacity: [0.5, 1, 0.5],
            scale: [1, 1.05, 1],
            rotate: [0, 2, -2, 0]
          }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="text-center text-purple-400 font-handwritten text-xl mt-4 relative z-10"
        >
          <span className="inline-block">⚫ ディベート進行中... ⚫</span>
        </motion.div>
      )}

      {finalComment && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="mt-8 bg-gradient-to-br from-gray-800 via-orange-900 to-black border-2 border-orange-600 rounded-3xl shadow-2xl shadow-orange-900/50 relative overflow-hidden"
          style={{ maxHeight: '500px', display: 'flex', flexDirection: 'column' }}
        >
          <div className="flex items-center gap-3 p-4 border-b-2 border-orange-700 bg-gradient-to-r from-gray-900 to-orange-900 flex-shrink-0 relative z-10">
            <motion.span
              animate={{ rotate: [0, 15, -15, 0], scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="text-4xl"
            >
              🎩
            </motion.span>
            <span className="font-retro text-2xl text-orange-300 drop-shadow-[0_0_8px_rgba(251,146,60,0.8)]">マッドハッターの総評</span>
          </div>
          <div 
            className="overflow-y-auto p-6"
            style={{ 
              flex: '1 1 auto',
              minHeight: 0,
              maxHeight: '420px',
              WebkitOverflowScrolling: 'touch',
              overflowX: 'hidden'
            }}
          >
            <p className="font-handwritten text-lg text-orange-200 leading-relaxed whitespace-pre-wrap break-words pb-4">
              {finalComment}
            </p>
          </div>
        </motion.div>
      )}

      <div ref={messagesEndRef} />
    </div>
  )
}
