'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import DebateForm from '@/components/DebateForm'
import DebateChat from '@/components/DebateChat'
import StatusBar from '@/components/StatusBar'
import type { DebateConfig, DebateMessage, CharacterStatus } from '@/types'

export default function Home() {
  const [debateConfig, setDebateConfig] = useState<DebateConfig | null>(null)
  const [messages, setMessages] = useState<DebateMessage[]>([])
  const [statuses, setStatuses] = useState<CharacterStatus>({
    alice: 100,
    rabbit: 100,
  })
  const [isDebating, setIsDebating] = useState(false)
  const [finalComment, setFinalComment] = useState<string>('')
  const [error, setError] = useState<string>('')

  const handleStartDebate = async (config: DebateConfig) => {
    console.log('handleStartDebate呼び出し:', config)
    setDebateConfig(config)
    setMessages([])
    setStatuses({ alice: 100, rabbit: 100 })
    setFinalComment('')
    setError('')
    setIsDebating(true)
    console.log('状態更新完了')

    // ディベートを開始
    const debateMessages: DebateMessage[] = []
    let currentStatuses = { alice: 100, rabbit: 100 }

    try {
      for (let i = 0; i < config.turns; i++) {
        const isAliceTurn = i % 2 === 0
        const speaker = isAliceTurn ? 'alice' : 'rabbit'
        
        // 思考中メッセージ
        debateMessages.push({
          speaker,
          message: '……考えています☕',
          isThinking: true,
          timestamp: Date.now(),
        })
        setMessages([...debateMessages])
        await new Promise(resolve => setTimeout(resolve, 2000))

        // API呼び出しで発言を生成
        console.log(`[${i + 1}/${config.turns}] API呼び出し:`, speaker)
        const response = await fetch('/api/debate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            topic: config.topic,
            alicePosition: config.alicePosition,
            rabbitPosition: config.rabbitPosition,
            conversationHistory: debateMessages.filter(m => !m.isThinking),
            currentSpeaker: speaker,
            turn: i + 1,
            totalTurns: config.turns,
          }),
        })

        console.log('APIレスポンス:', response.status, response.statusText)

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({ error: 'Unknown error' }))
          console.error('APIエラー:', errorData)
          throw new Error(errorData.error || `API error: ${response.status}`)
        }

        const data = await response.json()
        console.log('APIレスポンスデータ:', data)
        
        // API使用状況を確認
        if (data.isFromAPI) {
          console.log('✅✅✅ APIが使用されています！応答:', data.message.substring(0, 50) + '...')
        } else {
          console.warn('⚠️⚠️⚠️ モックデータが使用されています！応答:', data.message.substring(0, 50) + '...')
        }
        
        const newMessage: DebateMessage = {
          speaker,
          message: data.message,
          timestamp: Date.now(),
          isThinking: false,
        }

        debateMessages[debateMessages.length - 1] = newMessage
        setMessages([...debateMessages])

        // ステータス更新
        const scoreChange = data.scoreChange || 0
        if (isAliceTurn) {
          currentStatuses.alice = Math.max(0, Math.min(100, currentStatuses.alice + scoreChange))
          currentStatuses.rabbit = Math.max(0, Math.min(100, currentStatuses.rabbit - scoreChange))
        } else {
          currentStatuses.rabbit = Math.max(0, Math.min(100, currentStatuses.rabbit + scoreChange))
          currentStatuses.alice = Math.max(0, Math.min(100, currentStatuses.alice - scoreChange))
        }
        setStatuses({ ...currentStatuses })

        // 次の発言までの待機時間
        await new Promise(resolve => setTimeout(resolve, 3000))
      }

      // ディベート終了後の感想
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      const aliceFinalResponse = await fetch('/api/final-comment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          character: 'alice',
          topic: config.topic,
          alicePosition: config.alicePosition,
          rabbitPosition: config.rabbitPosition,
          conversationHistory: debateMessages.filter(m => !m.isThinking),
          statuses: currentStatuses,
        }),
      })
      if (!aliceFinalResponse.ok) throw new Error('アリスの感想生成に失敗しました')
      const aliceFinal = await aliceFinalResponse.json()
      debateMessages.push({
        speaker: 'alice',
        message: aliceFinal.message,
        timestamp: Date.now(),
        isThinking: false,
      })
      setMessages([...debateMessages])
      await new Promise(resolve => setTimeout(resolve, 2000))

      const rabbitFinalResponse = await fetch('/api/final-comment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          character: 'rabbit',
          topic: config.topic,
          alicePosition: config.alicePosition,
          rabbitPosition: config.rabbitPosition,
          conversationHistory: debateMessages.filter(m => !m.isThinking),
          statuses: currentStatuses,
        }),
      })
      if (!rabbitFinalResponse.ok) throw new Error('白うさぎの感想生成に失敗しました')
      const rabbitFinal = await rabbitFinalResponse.json()
      debateMessages.push({
        speaker: 'rabbit',
        message: rabbitFinal.message,
        timestamp: Date.now(),
        isThinking: false,
      })
      setMessages([...debateMessages])
      await new Promise(resolve => setTimeout(resolve, 2000))

      // マッドハッターの総評
      const hatterResponse = await fetch('/api/final-comment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          character: 'hatter',
          topic: config.topic,
          alicePosition: config.alicePosition,
          rabbitPosition: config.rabbitPosition,
          conversationHistory: debateMessages.filter(m => !m.isThinking),
          statuses: currentStatuses,
        }),
      })
      if (!hatterResponse.ok) throw new Error('マッドハッターの総評生成に失敗しました')
      const hatterFinal = await hatterResponse.json()
      setFinalComment(hatterFinal.message)

      setMessages([...debateMessages])
      console.log('ディベート完了')
    } catch (error) {
      console.error('ディベートエラー:', error)
      const errorMessage = error instanceof Error ? error.message : 'ディベート中にエラーが発生しました'
      setError(errorMessage)
      alert('エラー: ' + errorMessage)
    } finally {
      setIsDebating(false)
      console.log('ディベート終了')
    }
  }

  const handleReset = () => {
    setDebateConfig(null)
    setMessages([])
    setStatuses({ alice: 100, rabbit: 100 })
    setFinalComment('')
    setError('')
    setIsDebating(false)
  }

  return (
    <main className="min-h-screen p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <motion.h1 
          className="text-4xl md:text-6xl font-bold text-center mb-8 font-handwritten text-purple-300 drop-shadow-[0_0_12px_rgba(147,51,234,0.8)] relative"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <motion.span
            className="inline-block"
            animate={{ rotate: [0, 5, -5, 0], filter: ['brightness(1)', 'brightness(1.2)', 'brightness(1)'] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          >
            ⚫ アリスのお茶会 ⚫
          </motion.span>
          <motion.span 
            className="block text-2xl md:text-3xl mt-2 font-retro text-purple-400 drop-shadow-[0_0_8px_rgba(147,51,234,0.6)]"
            animate={{ scale: [1, 1.05, 1], opacity: [0.8, 1, 0.8] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          >
            AIディベート
          </motion.span>
        </motion.h1>

        {!debateConfig ? (
          <DebateForm onStart={handleStartDebate} />
        ) : (
          <>
            <StatusBar statuses={statuses} />
            {error && (
              <div className="mb-4 p-4 bg-red-900/80 border-2 border-red-600 rounded-lg text-red-200 font-handwritten shadow-lg shadow-red-900/50">
                {error}
              </div>
            )}
            <DebateChat 
              messages={messages} 
              isDebating={isDebating}
              finalComment={finalComment}
            />
            {!isDebating && (
              <motion.button
                onClick={handleReset}
                className="mt-8 mx-auto block px-8 py-4 bg-gradient-to-r from-purple-800 via-purple-900 to-black text-white rounded-2xl font-handwritten text-xl shadow-2xl shadow-purple-900/50 relative overflow-hidden border-2 border-purple-600"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                  animate={{ x: ['-100%', '100%'] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                />
                <span className="relative z-10">⚫ 新しいディベートを始める 🎩</span>
              </motion.button>
            )}
          </>
        )}
      </div>
    </main>
  )
}
