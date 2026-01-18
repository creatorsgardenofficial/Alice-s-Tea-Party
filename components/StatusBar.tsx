'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import Image from 'next/image'
import type { CharacterStatus } from '@/types'

interface StatusBarProps {
  statuses: CharacterStatus
}

export default function StatusBar({ statuses }: StatusBarProps) {
  const [aliceImageError, setAliceImageError] = useState(false)

  return (
    <div className="bg-gradient-to-br from-gray-900/95 via-black/90 to-purple-900/95 backdrop-blur-sm rounded-2xl shadow-xl shadow-purple-900/50 p-5 mb-6 card-pattern border-2 border-purple-600 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 to-black/40 opacity-80" />
      <div className="space-y-4 relative z-10">
        <div>
          <div className="flex justify-between items-center mb-2">
            <span className="font-handwritten text-lg text-purple-300 flex items-center gap-2">
              <motion.span
                className="relative w-8 h-8 flex items-center justify-center"
                animate={{ 
                  rotate: [0, 10, -10, 0],
                  scale: [1, 1.05, 1]
                }}
                transition={{ 
                  duration: 3, 
                  repeat: Infinity, 
                  ease: "easeInOut" 
                }}
              >
                {!aliceImageError ? (
                  <Image
                    src="/alice.png"
                    alt="アリス"
                    width={32}
                    height={32}
                    className="object-contain"
                    unoptimized
                    onError={() => setAliceImageError(true)}
                  />
                ) : (
                  <span className="text-3xl">👧</span>
                )}
              </motion.span>
              アリスの確信度
            </span>
            <span className="font-retro text-xl text-purple-400 drop-shadow-[0_0_4px_rgba(147,51,234,0.8)]">
              {Math.round(statuses.alice)}%
            </span>
          </div>
          <div className="w-full bg-gray-800 rounded-full h-6 overflow-hidden border border-gray-700">
            <motion.div
              className="h-full bg-gradient-to-r from-purple-600 via-purple-700 to-purple-900 rounded-full relative overflow-hidden"
              initial={{ width: '100%' }}
              animate={{ width: `${statuses.alice}%` }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
            >
              <motion.div 
                className="h-full bg-gradient-to-r from-transparent via-white/30 to-transparent w-full"
                animate={{ x: ['-100%', '100%'] }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              />
            </motion.div>
          </div>
        </div>

        <div>
          <div className="flex justify-between items-center mb-2">
            <span className="font-handwritten text-lg text-red-300 flex items-center gap-2">
              <motion.span
                className="relative w-8 h-8 flex items-center justify-center"
                animate={{ 
                  rotate: [0, 10, -10, 0],
                  scale: [1, 1.05, 1]
                }}
                transition={{ 
                  duration: 3, 
                  repeat: Infinity, 
                  ease: "easeInOut" 
                }}
              >
                <span className="text-3xl">🐰</span>
              </motion.span>
              白うさぎの確信度
            </span>
            <span className="font-retro text-xl text-red-400 drop-shadow-[0_0_4px_rgba(239,68,68,0.8)]">
              {Math.round(statuses.rabbit)}%
            </span>
          </div>
          <div className="w-full bg-gray-800 rounded-full h-6 overflow-hidden border border-gray-700">
            <motion.div
              className="h-full bg-gradient-to-r from-red-600 via-red-700 to-red-900 rounded-full relative overflow-hidden"
              initial={{ width: '100%' }}
              animate={{ width: `${statuses.rabbit}%` }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
            >
              <motion.div 
                className="h-full bg-gradient-to-r from-transparent via-white/30 to-transparent w-full"
                animate={{ x: ['-100%', '100%'] }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              />
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}
