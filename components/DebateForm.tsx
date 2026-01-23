'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import type { DebateConfig } from '@/types'

interface DebateFormProps {
  onStart: (config: DebateConfig) => void
}

export default function DebateForm({ onStart }: DebateFormProps) {
  const [topic, setTopic] = useState('')
  const [alicePosition, setAlicePosition] = useState('')
  const [rabbitPosition, setRabbitPosition] = useState('')
  const [turns, setTurns] = useState(10)

  const handleTurnsChange = (value: number) => {
    // 2以上、20以下の範囲に制限
    const adjustedValue = Math.max(2, Math.min(20, value))
    setTurns(adjustedValue)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    try {
      onStart({
        topic,
        alicePosition,
        rabbitPosition,
        turns,
      })
    } catch (error) {
      alert('エラーが発生しました: ' + (error instanceof Error ? error.message : 'Unknown error'))
    }
  }

  return (
    <div className="bg-gradient-to-br from-gray-900/95 via-black/90 to-purple-900/95 backdrop-blur-sm rounded-3xl shadow-2xl shadow-purple-900/50 p-6 md:p-8 tea-cup-pattern border-2 border-purple-600 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-purple-900/30 to-black/50 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-gray-800/40 to-purple-800/30 rounded-full blur-3xl" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(147,51,234,0.15),transparent_70%)] pointer-events-none" />
      <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
        <div>
          <label className="block text-lg font-handwritten text-gray-300 mb-2">
            議題
          </label>
          <input
            type="text"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border-2 border-purple-600 focus:border-purple-400 focus:outline-none font-handwritten text-lg bg-gray-800/90 text-gray-200 shadow-md transition-all hover:shadow-lg hover:shadow-purple-900/50"
            placeholder="例：お金と時間どちらが大切なのか"
            required
          />
        </div>

        <div>
          <label className="block text-lg font-handwritten text-gray-300 mb-2">
            アリスの主張
          </label>
          <textarea
            value={alicePosition}
            onChange={(e) => setAlicePosition(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border-2 border-purple-600 focus:border-purple-400 focus:outline-none font-handwritten text-lg bg-gray-800/90 text-gray-200 shadow-md transition-all hover:shadow-lg hover:shadow-purple-900/50 min-h-[100px]"
            placeholder="例：時間の方が大切"
            required
          />
        </div>

        <div>
          <label className="block text-lg font-handwritten text-gray-300 mb-2">
            白うさぎの主張
          </label>
          <textarea
            value={rabbitPosition}
            onChange={(e) => setRabbitPosition(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border-2 border-red-600 focus:border-red-400 focus:outline-none font-handwritten text-lg bg-gray-800/90 text-gray-200 shadow-md transition-all hover:shadow-lg hover:shadow-red-900/50 min-h-[100px]"
            placeholder="例：お金の方が大切"
            required
          />
        </div>

        <div>
          <label className="block text-lg font-handwritten text-gray-300 mb-2">
            対話回数
          </label>
          <select
            value={turns}
            onChange={(e) => handleTurnsChange(parseInt(e.target.value) || 10)}
            className="w-full px-4 py-3 rounded-xl border-2 border-purple-600 focus:border-purple-400 focus:outline-none font-handwritten text-lg bg-gray-800/90 text-gray-200 shadow-md transition-all hover:shadow-lg hover:shadow-purple-900/50 appearance-none cursor-pointer"
            required
          >
            {Array.from({ length: 19 }, (_, i) => i + 2).map((num) => (
              <option key={num} value={num} className="bg-gray-800 text-gray-200">
                {num}回
              </option>
            ))}
          </select>
          <p className="text-sm text-gray-400 mt-1">※ 2回以上20回以下で選択可能です</p>
        </div>

        <motion.button
          type="submit"
          className="w-full py-4 bg-gradient-to-r from-purple-800 via-purple-900 to-black text-white rounded-2xl font-retro text-xl shadow-2xl shadow-purple-900/50 relative overflow-hidden border-2 border-purple-600"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.98 }}
        >
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
            animate={{ x: ['-100%', '100%'] }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          />
          <span className="relative z-10">⚫ お茶会を始める 🎩 ⚫</span>
        </motion.button>
      </form>
    </div>
  )
}
