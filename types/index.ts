export interface DebateConfig {
  topic: string
  alicePosition: string
  rabbitPosition: string
  turns: number
}

export interface DebateMessage {
  speaker: 'alice' | 'rabbit'
  message: string
  timestamp: number
  isThinking?: boolean
}

export interface CharacterStatus {
  alice: number
  rabbit: number
}
