import { NextRequest, NextResponse } from 'next/server'

// 発言の強さを評価する関数（相手の発言を評価するためにも使用）
function evaluateMessageStrength(message: string): number {
  let strength = 0
  
  // 根拠の提示
  const evidenceKeywords = [/理由/, /証拠/, /論理的/, /根拠/, /事実/, /データ/, /例/, /実例/, /証明/]
  const hasEvidence = evidenceKeywords.some(pattern => pattern.test(message))
  if (hasEvidence) strength += 2
  
  // 問題点の指摘
  const critiqueKeywords = [/矛盾/, /破綻/, /誤り/, /間違い/, /弱い/, /不足/, /欠陥/, /問題/]
  const hasCritique = critiqueKeywords.some(pattern => pattern.test(message))
  if (hasCritique) strength += 2
  
  // 明確な主張
  const positionKeywords = [/というのが/, /こそ/, /が正しい/, /が真実/, /が重要/, /が本質/]
  const hasPosition = positionKeywords.some(pattern => pattern.test(message))
  if (hasPosition) strength += 1
  
  // 適切な長さ（30-60文字）
  const messageLength = message.length
  if (messageLength >= 30 && messageLength <= 60) {
    strength += 1
  } else if (messageLength < 20 || messageLength > 80) {
    strength -= 1
  }
  
  // テンプレート的な表現は減点
  const templatePatterns = [/だって、.*の本質を考えれば/, /ですぞ！.*を考えれば/, /結局、.*については/]
  const isTemplate = templatePatterns.some(pattern => pattern.test(message))
  if (isTemplate) strength -= 2
  
  return strength
}

// 発言内容を分析してスコアを計算する関数（自分の発言と相手の発言の両方を考慮）
function calculateScoreChange(
  message: string,
  conversationHistory: any[],
  currentSpeaker: 'alice' | 'rabbit',
  opponentPosition: string
): number {
  let score = 0
  
  // 1. 発言の長さ評価（30-60文字が最適、短すぎる/長すぎる場合は減点）
  const messageLength = message.length
  if (messageLength >= 30 && messageLength <= 60) {
    score += 2 // 適切な長さ
  } else if (messageLength >= 20 && messageLength < 30) {
    score += 1 // やや短い
  } else if (messageLength > 60 && messageLength <= 80) {
    score += 1 // やや長い
  } else if (messageLength < 15) {
    score -= 2 // 短すぎる
  } else if (messageLength > 80) {
    score -= 1 // 長すぎる
  }
  
  // 2. 相手の発言への言及（「と言いましたが」「と言いましたけど」など）
  const mentionPatterns = [
    /と言いましたが/,
    /と言いましたけど/,
    /と言ったが/,
    /と言ったけど/,
    /という発言/,
    /という主張/,
    /という意見/,
    /という考え/
  ]
  const hasMention = mentionPatterns.some(pattern => pattern.test(message))
  if (hasMention) {
    score += 3 // 相手の発言を引用している
  }
  
  // 3. 根拠の提示（「理由」「証拠」「論理的」「根拠」「事実」など）
  const evidenceKeywords = [
    /理由/,
    /証拠/,
    /論理的/,
    /根拠/,
    /事実/,
    /データ/,
    /例/,
    /実例/,
    /証明/
  ]
  const hasEvidence = evidenceKeywords.some(pattern => pattern.test(message))
  if (hasEvidence) {
    score += 2 // 根拠を提示している
  }
  
  // 4. 問題点の指摘（「矛盾」「破綻」「誤り」「間違い」「弱い」など）
  const critiqueKeywords = [
    /矛盾/,
    /破綻/,
    /誤り/,
    /間違い/,
    /弱い/,
    /不足/,
    /欠陥/,
    /問題/
  ]
  const hasCritique = critiqueKeywords.some(pattern => pattern.test(message))
  if (hasCritique) {
    score += 2 // 問題点を指摘している
  }
  
  // 5. 自分の主張の再提示（自分の立場を明確に述べている）
  const positionKeywords = [
    /というのが/,
    /こそ/,
    /が正しい/,
    /が真実/,
    /が重要/,
    /が本質/
  ]
  const hasPosition = positionKeywords.some(pattern => pattern.test(message))
  if (hasPosition) {
    score += 1 // 自分の主張を明確に述べている
  }
  
  // 6. 会話履歴との関連性（相手の直前の発言を参照しているか）
  if (conversationHistory.length > 0) {
    const lastMessage = conversationHistory[conversationHistory.length - 1]
    if (lastMessage && lastMessage.speaker !== currentSpeaker) {
      // 相手の直前の発言のキーワードを抽出
      const lastMessageWords = lastMessage.message.split(/[、。！？\s]/).filter((w: string) => w.length > 2)
      const referencesLastMessage = lastMessageWords.some((word: string) => 
        message.includes(word) && word.length >= 3
      )
      if (referencesLastMessage) {
        score += 2 // 直前の発言を参照している
      }
    }
  }
  
  // 7. テンプレート的な表現の検出（減点）
  const templatePatterns = [
    /だって、.*の本質を考えれば/,
    /ですぞ！.*を考えれば/,
    /結局、.*については/,
    /ふぅ、.*については/
  ]
  const isTemplate = templatePatterns.some(pattern => pattern.test(message))
  if (isTemplate) {
    score -= 3 // テンプレート的な表現は減点
  }
  
  // 8. 相手の発言の強さを評価し、それに対する反応の質を評価
  if (conversationHistory.length > 0) {
    const lastMessage = conversationHistory[conversationHistory.length - 1]
    if (lastMessage && lastMessage.speaker !== currentSpeaker) {
      const opponentMessageStrength = evaluateMessageStrength(lastMessage.message)
      const myMessageStrength = evaluateMessageStrength(message)
      
      // 相手の発言が強い場合、それに対する適切な反論ができれば高スコア
      if (opponentMessageStrength >= 3) {
        // 相手が強い発言をした場合、それに対する反論の質が重要
        if (myMessageStrength >= 3) {
          score += 3 // 強い発言に対して強い反論ができた
        } else if (myMessageStrength >= 1) {
          score += 1 // 中程度の反論
        } else {
          score -= 2 // 弱い反論は減点
        }
      } else if (opponentMessageStrength >= 1) {
        // 相手が中程度の発言をした場合
        if (myMessageStrength >= 3) {
          score += 2 // 中程度の発言に対して強い反論ができた
        } else if (myMessageStrength >= 1) {
          score += 1 // 中程度の反論
        }
      } else {
        // 相手が弱い発言をした場合、それを見抜いて指摘できれば高スコア
        if (myMessageStrength >= 3) {
          score += 2 // 弱い発言を見抜いて強く反論できた
        } else if (hasCritique && hasMention) {
          score += 1 // 弱い発言を指摘できた
        }
      }
      
      // 相手の発言を直接引用して反論できているか
      const opponentWords = lastMessage.message.split(/[、。！？\s]/).filter((w: string) => w.length >= 3)
      const directlyRefutes = opponentWords.some((word: string) => 
        message.includes(word) && (hasCritique || hasEvidence)
      )
      if (directlyRefutes) {
        score += 2 // 相手の発言を直接引用して反論している
      }
    }
  }
  
  // 9. 自分の発言の総合的な強さを評価
  const myMessageStrength = evaluateMessageStrength(message)
  score += myMessageStrength * 0.5 // 自分の発言の強さを反映
  
  // スコアを-5から+5の範囲に正規化
  const normalizedScore = Math.max(-5, Math.min(5, Math.round(score * 0.6)))
  
  // ランダム要素を少し加える（±0.3の範囲）
  const randomFactor = (Math.random() * 2 - 1) * 0.3
  const finalScore = normalizedScore + randomFactor
  
  return Math.max(-5, Math.min(5, Math.round(finalScore * 10) / 10))
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      topic,
      alicePosition,
      rabbitPosition,
      conversationHistory,
      currentSpeaker,
      turn,
      totalTurns,
    } = body

    // 会話履歴を構築（前回の発言を含む）
    // 最後の数件のみを送信（コンテキストウィンドウの節約）
    const recentHistory = conversationHistory.slice(-10) // 直近10件に増やしました（より多くのコンテキスト）
    
    // 会話履歴をChatGPTのメッセージ形式に変換
    // アリス = user、白うさぎ = assistant として扱う
    const messages = recentHistory.map((msg: any) => {
      const role = msg.speaker === 'alice' ? 'user' : 'assistant'
      // 発言内容をそのまま使用
      return {
        role: role,
        content: msg.message
      }
    })
    
    // 相手の直前の発言を取得（会話履歴から）
    // 最後の発言が相手のものか確認
    let opponentLastMessage = null
    if (recentHistory.length > 0) {
      const lastMessage = recentHistory[recentHistory.length - 1]
      if (lastMessage.speaker !== currentSpeaker) {
        opponentLastMessage = lastMessage.message
      } else if (recentHistory.length > 1) {
        // 最後が自分なら、その前の相手の発言を取得
        opponentLastMessage = recentHistory[recentHistory.length - 2].message
      }
    }
    
    // システムプロンプトを作成（会話履歴を必ず使うことを強調）
    // 会話履歴がある場合とない場合で処理を分ける
    const hasHistory = messages.length > 0
    
    let systemPrompt = ''
    
    if (hasHistory) {
      // 会話履歴がある場合：非常に強力なプロンプトにする
      systemPrompt = currentSpeaker === 'alice'
        ? `あなたは「不思議の国のアリス」のアリスです。語尾は「〜なのよ」「〜かしら？」「〜よね」を使ってください。

議題：${topic}
あなたの主張：${alicePosition}
白うさぎの主張：${rabbitPosition}

【絶対に守るべきルール】
1. **相手の最後の発言を必ず分析し、その論点や根拠を理解してください**
2. **相手の発言の弱点、矛盾点、または論理的な欠陥を指摘してください**
3. **自分の主張「${alicePosition}」を裏付ける具体的な根拠（理由、例、論理）を示してください**
4. 発言の一部を引用して言及してください（例：「白うさぎが『○○』と言ったけど、それは△△という理由で間違っているのよ」）
5. **相手を呼ぶ際は「白うさぎ」と呼び捨てにしてください。「白うさぎさん」などの敬称は使わないでください**
6. テンプレート的な表現は完全に禁止
7. **必ず60文字以内で端的に応答してください**

【応答の構造】
- 相手の発言の引用または言及
- その発言の問題点の指摘（論理的欠陥、矛盾、根拠不足など）
- 自分の主張を裏付ける具体的な根拠

【禁止事項】
- 相手の発言を無視すること
- 根拠のない主張をすること
- テンプレート的な表現を使うこと
- 長い説明をすること（60文字以内）`
        : `あなたは「不思議の国のアリス」の白うさぎです。語尾は「〜ですぞ」「〜ですって」「〜でございます」を使ってください。

議題：${topic}
あなたの主張：${rabbitPosition}
アリスの主張：${alicePosition}

【絶対に守るべきルール】
1. **相手の最後の発言を必ず分析し、その論点や根拠を理解してください**
2. **相手の発言の弱点、矛盾点、または論理的な欠陥を指摘してください**
3. **自分の主張「${rabbitPosition}」を裏付ける具体的な根拠（理由、例、論理）を示してください**
4. 発言の一部を引用して言及してください（例：「アリスが『○○』と言いましたが、それは△△という理由で間違っていますぞ」）
5. **相手の発言を引用する際は「と言いましたが」「と言いましたけど」を使用してください。「と言ったが」「と言ったけど」は使わないでください**
6. **相手を呼ぶ際は「アリス」と呼び捨てにしてください。「アリスさん」などの敬称は使わないでください**
7. テンプレート的な表現は完全に禁止
8. **必ず60文字以内で端的に応答してください**

【応答の構造】
- 相手の発言の引用または言及
- その発言の問題点の指摘（論理的欠陥、矛盾、根拠不足など）
- 自分の主張を裏付ける具体的な根拠

【禁止事項】
- 相手の発言を無視すること
- 根拠のない主張をすること
- テンプレート的な表現を使うこと
- 長い説明をすること（60文字以内）`
    } else {
      // 会話履歴がない場合（最初の発言）
      systemPrompt = currentSpeaker === 'alice'
        ? `あなたは「不思議の国のアリス」のアリスです。語尾は「〜なのよ」「〜かしら？」「〜よね」を使ってください。

議題：${topic}
あなたの主張：${alicePosition}
白うさぎの主張：${rabbitPosition}

これからディベートを始めます。あなたの主張「${alicePosition}」について、**60文字以内で端的に**述べてください。

【重要】相手を呼ぶ際は「白うさぎ」と呼び捨てにしてください。「白うさぎさん」などの敬称は使わないでください。`
        : `あなたは「不思議の国のアリス」の白うさぎです。語尾は「〜ですぞ」「〜ですって」「〜でございます」を使ってください。

議題：${topic}
あなたの主張：${rabbitPosition}
アリスの主張：${alicePosition}

これからディベートを始めます。あなたの主張「${rabbitPosition}」について、**60文字以内で端的に**述べてください。

【重要】
- 相手を呼ぶ際は「アリス」と呼び捨てにしてください。「アリスさん」などの敬称は使わないでください
- 相手の発言を引用する際は「と言いましたが」「と言いましたけど」を使用してください。「と言ったが」「と言ったけど」は使わないでください`
    }

    // OpenAI API呼び出し（環境変数がない場合はモックデータを使用）
    const apiKey = process.env.OPENAI_API_KEY
    let responseText = ''
    let scoreChange = 0

    if (apiKey) {
      try {
        // メッセージ配列を構築（会話履歴を確実に含める）
        // 重要：会話履歴がある場合、最後の発言をuserメッセージとして明示的に追加
        let fullMessages: Array<{ role: 'system' | 'user' | 'assistant'; content: string }> = [
          { role: 'system', content: systemPrompt },
        ]
        
        if (hasHistory && messages.length > 0) {
          // 会話履歴がある場合：会話履歴を完全に再構築
          // 重要：最後の発言をuserメッセージとして明示的に送信し、応答を求める
          
          const lastMessage = messages[messages.length - 1]
          
          // 最後の発言より前の会話履歴（直近4件まで）
          const previousMessages = messages.slice(-6, -1) // 最後から2番目から6件前まで
          
          // メッセージ配列を構築：system -> 会話履歴 -> 最後の発言（user）-> 応答を求める指示
          fullMessages = [
            fullMessages[0], // system
            ...previousMessages, // 会話履歴（最後の発言以外）
            { 
              role: 'user', 
              content: `相手が以下のように言いました：「${lastMessage.content}」

この発言に対して、以下を必ず含めて**60文字以内で端的に**反応してください：
1. 相手の発言の引用または言及（白うさぎの場合は「と言いましたが」「と言いましたけど」を使用。「と言ったが」「と言ったけど」は使わない）
2. その発言の問題点（論理的欠陥、矛盾、根拠不足など）の指摘
3. 自分の主張を裏付ける具体的な根拠（理由、例、論理）

単なる反論ではなく、論理的な根拠を持った反論をしてください。`
            }
          ]
        } else {
          // 会話履歴がない場合（最初の発言）
          // メッセージ履歴は空のまま
        }
        
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`,
          },
          body: JSON.stringify({
            model: 'gpt-4o-mini',
            messages: fullMessages,
            temperature: 1.5, // より創造的に
            max_tokens: 100, // 短く端的に（60文字以内）
            presence_penalty: 1.5, // 同じトピックの繰り返しをさらに強く防ぐ
            frequency_penalty: 1.5, // 同じ表現の繰り返しをさらに強く防ぐ
            top_p: 0.95, // より多様な応答を促す
          }),
        })

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}))
          throw new Error(`OpenAI API error: ${response.status}`)
        }

        const data = await response.json()
        responseText = data.choices[0]?.message?.content || '...'
        
        // テンプレート的な応答を検出
        const templatePatterns = [
          `${alicePosition}だって、${topic}の本質を考えれば`,
          `${rabbitPosition}ですぞ！${topic}を考えれば`,
          `だって、${topic}について考えると`,
          `結局、${topic}については`,
          `ふぅ、${topic}については、${rabbitPosition}こそが真実なのですぞ！`,
        ]
        const isTemplate = templatePatterns.some(pattern => responseText.includes(pattern))
        
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error)
        
        // エラーが発生した場合、会話履歴を考慮したモックデータにフォールバック
        
        // 会話履歴がある場合は、最後の発言を参照する
        if (hasHistory && messages.length > 0) {
          const lastMessage = messages[messages.length - 1]
          const lastMessageText = lastMessage.content
          
          // 最後の発言のキーワードを抽出（最初の20-30文字）
          const keyPart = lastMessageText.substring(0, Math.min(40, lastMessageText.length))
          
          // 最後の発言に基づいた応答を生成（根拠のある反論・60文字以内）
          const keyPartShort = keyPart.substring(0, Math.min(12, keyPart.length))
          const variations = [
            {
              alice: `「${keyPartShort}」は根拠が弱いのよ。${alicePosition}の方が論理的よ。`,
              rabbit: `「${keyPartShort}」は矛盾していますぞ。${rabbitPosition}が正しいですって！`
            },
            {
              alice: `「${keyPartShort}」という主張、論理的に破綻してるの。${alicePosition}よ。`,
              rabbit: `「${keyPartShort}」は根拠不足ですぞ。${rabbitPosition}こそ真実ですって！`
            },
            {
              alice: `「${keyPartShort}」は事実と違うのよ。${alicePosition}という証拠があるの。`,
              rabbit: `「${keyPartShort}」は誤りですぞ。${rabbitPosition}という理由で正しいですって！`
            }
          ]
          
          const variation = variations[turn % variations.length]
          responseText = currentSpeaker === 'alice' ? variation.alice : variation.rabbit
        } else {
          // 最初の発言（60文字以内）
          const mockResponses = {
            alice: [
              `${alicePosition}だって、${topic}の本質を考えれば当然なのよ！`,
            ],
            rabbit: [
              `${rabbitPosition}ですぞ！${topic}を考えれば明らかですって！`,
            ]
          }
          const responses = mockResponses[currentSpeaker as 'alice' | 'rabbit']
          responseText = responses[0] || `...考えています☕（${topic}について）`
        }
      }
    } else {
      // モックデータ（APIキーがない場合）- 会話履歴を考慮
      if (hasHistory && messages.length > 0) {
        const lastMessage = messages[messages.length - 1]
        const lastMessageText = lastMessage.content
        
        // 最後の発言のキーワードを抽出
        const keyPart = lastMessageText.substring(0, Math.min(40, lastMessageText.length))
        
        // 最後の発言に基づいた応答を生成（根拠のある反論・60文字以内）
        const keyPartShort = keyPart.substring(0, Math.min(12, keyPart.length))
        const variations = [
          {
            alice: `「${keyPartShort}」は根拠が弱いのよ。${alicePosition}の方が論理的よ。`,
            rabbit: `「${keyPartShort}」は矛盾していますぞ。${rabbitPosition}が正しいですって！`
          },
          {
            alice: `「${keyPartShort}」という主張、論理的に破綻してるの。${alicePosition}よ。`,
            rabbit: `「${keyPartShort}」は根拠不足ですぞ。${rabbitPosition}こそ真実ですって！`
          },
          {
            alice: `「${keyPartShort}」は事実と違うのよ。${alicePosition}という証拠があるの。`,
            rabbit: `「${keyPartShort}」は誤りですぞ。${rabbitPosition}という理由で正しいですって！`
          }
        ]
        
        const variation = variations[turn % variations.length]
        responseText = currentSpeaker === 'alice' ? variation.alice : variation.rabbit
      } else {
        // 最初の発言（60文字以内）
        const mockResponses = {
          alice: [
            `${alicePosition}だって、${topic}の本質を考えれば当然なのよ！`,
          ],
          rabbit: [
            `${rabbitPosition}ですぞ！${topic}を考えれば明らかですって！`,
          ]
        }
        const responses = mockResponses[currentSpeaker as 'alice' | 'rabbit']
        responseText = responses[0] || `...考えています☕（${topic}について）`
      }
    }

    // 発言内容に基づいたスコア計算
    const opponentPosition = currentSpeaker === 'alice' ? rabbitPosition : alicePosition
    scoreChange = calculateScoreChange(
      responseText,
      conversationHistory,
      currentSpeaker,
      opponentPosition
    )

    return NextResponse.json({
      message: responseText,
      scoreChange,
      isFromAPI: !!apiKey && responseText !== '', // APIが使われたかどうかのフラグ
    })
  } catch (error) {
    return NextResponse.json(
      { error: 'ディベート生成に失敗しました' },
      { status: 500 }
    )
  }
}
