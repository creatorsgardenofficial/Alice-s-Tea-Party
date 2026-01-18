import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { 
      character, 
      topic = 'お金と時間どちらが大切なのか',
      alicePosition = '時間の方が大切。なぜならば、お金があっても時間がなくては、そのお金は使えない。時間さえあれば、十分な時間を使って、なんでも叶えることができる。',
      rabbitPosition = 'お金の方が大切。なぜならば、時間がいくらあっても、お金がなければ活動できることは限られてしまう。お金さえあれば、短い時間でも有意義に過ごすことができる。',
      conversationHistory, 
      statuses 
    } = body

    const apiKey = process.env.OPENAI_API_KEY
    let responseText = ''

    console.log('[Final-Comment] APIキーの確認:', apiKey ? `設定済み (${apiKey.substring(0, 10)}...)` : '未設定 - モックデータを使用')

    const prompts: Record<string, string> = {
      alice: `あなたは「不思議の国のアリス」のアリスです。語尾は「〜なのよ」「〜かしら？」を使ってください。

議題：${topic}
あなたの主張：${alicePosition}
白うさぎの主張：${rabbitPosition}

ディベートが終わりました。あなたの確信度は${statuses.alice}%、白うさぎの確信度は${statuses.rabbit}%です。

**40文字以内で端的に**感想を一言で述べてください。例：「あなたの言葉、少しだけ心が動いたわ」`,

      rabbit: `あなたは「不思議の国のアリス」の白うさぎです。語尾は「〜ですぞ」「〜ですって」「〜でございます」を使ってください。

議題：${topic}
あなたの主張：${rabbitPosition}
アリスの主張：${alicePosition}

ディベートが終わりました。あなたの確信度は${statuses.rabbit}%、アリスの確信度は${statuses.alice}%です。

**40文字以内で端的に**感想を一言で述べてください。例：「ふぅ、あなたの考えも悪くないですねぇ」`,

      hatter: `あなたは「不思議の国のアリス」のマッドハッターです。テンションが高く、皮肉交じりの狂気的トーンで話してください。しかし、最終的には論理的な判断を下すことができる存在でもあります。

【ディベートの経緯】
議題：${topic}
アリスの主張：${alicePosition}
白うさぎの主張：${rabbitPosition}

【会話履歴】
${conversationHistory.map((msg: any) => {
  const name = msg.speaker === 'alice' ? 'アリス' : '白うさぎ'
  return `${name}：「${msg.message}」`
}).join('\n')}

【最終結果】
アリスの確信度：${statuses.alice}%
白うさぎの確信度：${statuses.rabbit}%

【あなたの役割】
このディベートを聞いて、どちらの意見がより正しいと思うのか、その理由を明確に述べてジャッジしてください。

【重要】
${statuses.alice === statuses.rabbit 
  ? 'アリスと白うさぎの確信度が同じです。この場合は「どちらの意見も正しい」と判断してください。' 
  : statuses.alice > statuses.rabbit 
  ? 'アリスの確信度が高いです。アリスの意見が正しいと判断してください。' 
  : '白うさぎの確信度が高いです。白うさぎの意見が正しいと判断してください。'}

【指示】
1. マッドハッターらしい狂気的な口調で始めてください
2. アリスと白うさぎの主張を簡潔に要約してください
3. ${statuses.alice === statuses.rabbit 
  ? '「どちらの意見も正しい」と明確に述べてください' 
  : statuses.alice > statuses.rabbit 
  ? '「アリスの意見が正しいと思う」と明確にジャッジしてください' 
  : '「白うさぎの意見が正しいと思う」と明確にジャッジしてください'}
4. その理由を具体的に述べてください（150文字程度、完全に文を終えること）

【例】
${statuses.alice === statuses.rabbit 
  ? '「はっはっは！素晴らしい狂気でしたねぇ！アリスは『時間の方が大切』と語り、白うさぎは『お金の方が大切』と訴えました。どちらの意見も正しいと思います。なぜなら、時間とお金はそれぞれ異なる価値を持ち、状況によってどちらが重要かは変わるからです。」'
  : statuses.alice > statuses.rabbit
  ? '「はっはっは！素晴らしい狂気でしたねぇ！アリスは『時間の方が大切』と語り、白うさぎは『お金の方が大切』と訴えました。アリスの意見が正しいと思います。なぜなら、時間は有限で取り戻せないが、お金は後から稼ぐことができるからです。」'
  : '「はっはっは！素晴らしい狂気でしたねぇ！アリスは『時間の方が大切』と語り、白うさぎは『お金の方が大切』と訴えました。白うさぎの具体例と論理展開がより説得力がありました。白うさぎの意見が正しいと思います。なぜなら、お金があれば短い時間でも有意義に過ごせるからです。」'}`,
    }

    if (apiKey) {
      console.log('[Final-Comment] OpenAI APIを呼び出し中...')
      try {
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`,
          },
          body: JSON.stringify({
            model: 'gpt-4o-mini',
            messages: [
              { role: 'system', content: prompts[character] },
            ],
            temperature: 0.9,
            max_tokens: 300, // 総評を完全に表示するために増加
          }),
        })

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}))
          console.error('[Final-Comment] OpenAI APIエラー:', response.status, errorData)
          throw new Error(`OpenAI API error: ${response.status}`)
        }

        const data = await response.json()
        responseText = data.choices[0]?.message?.content || '...'
        console.log('[Final-Comment] OpenAI API成功:', responseText)
        console.log('[Final-Comment] 応答の長さ:', responseText.length, '文字')
        console.log('[Final-Comment] finish_reason:', data.choices[0]?.finish_reason)
      } catch (error) {
        console.error('[Final-Comment] OpenAI API呼び出しエラー:', error)
        // エラーが発生した場合、モックデータにフォールバック
        console.log('[Final-Comment] モックデータにフォールバック')
        const mockComments: Record<string, string[]> = {
          alice: [
            `あなたの言葉、少しだけ心が動いたわ。でも、まだ「${alicePosition}」と思っているのよ。`,
            `ふふ、面白いディベートだったわね。でも、やっぱり${alicePosition}という考えは変わらないわ。`,
            `あなたの言い分も分かるけど、私の「${alicePosition}」という考えが正しいのよ。`,
          ],
          rabbit: [
            `ふぅ、あなたの考えも悪くないですねぇ。でも、${rabbitPosition}ですぞ！`,
            `素晴らしい議論でしたって！それでも、${rabbitPosition}というのが真実ですぞ！`,
            `なるほど、興味深いお話でございます。しかし、${rabbitPosition}が正しいのですぞ！`,
          ],
          hatter: statuses.alice === statuses.rabbit ? [
            `はっはっは！素晴らしい狂気でしたねぇ！アリスは「${alicePosition}」と語り、白うさぎは「${rabbitPosition}」と訴えました。どちらの意見も正しいと思います。なぜなら、時間とお金はそれぞれ異なる価値を持ち、状況によってどちらが重要かは変わるからです。`,
            `はっはっは！「${alicePosition}」と「${rabbitPosition}」、どちらも狂気の極みですねぇ！どちらの意見も正しいと思います。それぞれの主張に説得力があり、一概にどちらが優れているとは言えません。`,
            `はっはっは！面白いディベートでしたねぇ！アリスも白うさぎも素晴らしい論点を提示しました。どちらの意見も正しいと思います。なぜなら、どちらも状況によっては真実となり得るからです。`,
          ] : statuses.alice > statuses.rabbit ? [
            `はっはっは！素晴らしい狂気でしたねぇ！アリスは「${alicePosition}」と語り、白うさぎは「${rabbitPosition}」と訴えました。アリスの意見が正しいと思います。具体例と論理展開がより説得力がありました。`,
            `はっはっは！「${alicePosition}」と「${rabbitPosition}」、どちらも狂気の極みですねぇ！アリスの意見が正しいと思います。哲学的な視点が深く、本質を捉えていました。`,
            `はっはっは！面白いディベートでしたねぇ！アリスの主張の方がより論理的で説得力がありました。アリスの意見が正しいと思います。`,
          ] : [
            `はっはっは！素晴らしい狂気でしたねぇ！アリスは「${alicePosition}」と語り、白うさぎは「${rabbitPosition}」と訴えました。白うさぎの意見が正しいと思います。具体例と論理展開がより説得力がありました。`,
            `はっはっは！「${alicePosition}」と「${rabbitPosition}」、どちらも狂気の極みですねぇ！白うさぎの意見が正しいと思います。実践的な視点が深く、本質を捉えていました。`,
            `はっはっは！面白いディベートでしたねぇ！白うさぎの主張の方がより論理的で説得力がありました。白うさぎの意見が正しいと思います。`,
          ],
        }
        const comments = mockComments[character] || ['...']
        responseText = comments[Math.floor(Math.random() * comments.length)]
      }
    } else {
      console.log('[Final-Comment] モックデータを使用')
      // モックデータ - ユーザーの入力内容を反映
      const mockComments: Record<string, string[]> = {
        alice: [
          `あなたの言葉、少しだけ心が動いたわ。でも、まだ「${alicePosition}」と思っているのよ。`,
          `ふふ、面白いディベートだったわね。でも、やっぱり${alicePosition}という考えは変わらないわ。`,
          `あなたの言い分も分かるけど、私の「${alicePosition}」という考えが正しいのよ。`,
        ],
        rabbit: [
          `ふぅ、あなたの考えも悪くないですねぇ。でも、${rabbitPosition}ですぞ！`,
          `素晴らしい議論でしたって！それでも、${rabbitPosition}というのが真実ですぞ！`,
          `なるほど、興味深いお話でございます。しかし、${rabbitPosition}が正しいのですぞ！`,
        ],
        hatter: statuses.alice === statuses.rabbit ? [
          `はっはっは！素晴らしい狂気でしたねぇ！アリスは「${alicePosition}」と語り、白うさぎは「${rabbitPosition}」と訴えました。どちらの意見も正しいと思います。なぜなら、時間とお金はそれぞれ異なる価値を持ち、状況によってどちらが重要かは変わるからです。`,
          `はっはっは！「${alicePosition}」と「${rabbitPosition}」、どちらも狂気の極みですねぇ！どちらの意見も正しいと思います。それぞれの主張に説得力があり、一概にどちらが優れているとは言えません。`,
          `はっはっは！面白いディベートでしたねぇ！アリスも白うさぎも素晴らしい論点を提示しました。どちらの意見も正しいと思います。なぜなら、どちらも状況によっては真実となり得るからです。`,
        ] : statuses.alice > statuses.rabbit ? [
          `はっはっは！素晴らしい狂気でしたねぇ！アリスは「${alicePosition}」と語り、白うさぎは「${rabbitPosition}」と訴えました。アリスの意見が正しいと思います。具体例と論理展開がより説得力がありました。`,
          `はっはっは！「${alicePosition}」と「${rabbitPosition}」、どちらも狂気の極みですねぇ！アリスの意見が正しいと思います。哲学的な視点が深く、本質を捉えていました。`,
          `はっはっは！面白いディベートでしたねぇ！アリスの主張の方がより論理的で説得力がありました。アリスの意見が正しいと思います。`,
        ] : [
          `はっはっは！素晴らしい狂気でしたねぇ！アリスは「${alicePosition}」と語り、白うさぎは「${rabbitPosition}」と訴えました。白うさぎの意見が正しいと思います。具体例と論理展開がより説得力がありました。`,
          `はっはっは！「${alicePosition}」と「${rabbitPosition}」、どちらも狂気の極みですねぇ！白うさぎの意見が正しいと思います。実践的な視点が深く、本質を捉えていました。`,
          `はっはっは！面白いディベートでしたねぇ！白うさぎの主張の方がより論理的で説得力がありました。白うさぎの意見が正しいと思います。`,
        ],
      }

      const comments = mockComments[character] || ['...']
      responseText = comments[Math.floor(Math.random() * comments.length)]
    }

    return NextResponse.json({
      message: responseText,
    })
  } catch (error) {
    console.error('APIエラー:', error)
    return NextResponse.json(
      { error: 'コメント生成に失敗しました' },
      { status: 500 }
    )
  }
}
