'use client'

export default function MinimalPage() {
  return (
    <div style={{ 
      padding: '40px', 
      fontFamily: 'Arial, sans-serif',
      textAlign: 'center',
      maxWidth: '800px',
      margin: '0 auto'
    }}>
      <h1 style={{ color: '#4a5568', marginBottom: '20px' }}>
        ✅ 最小限のページ - 動作確認
      </h1>
      <p style={{ fontSize: '18px', marginBottom: '30px' }}>
        このページが表示されれば、Next.jsとReactは正常に動作しています。
      </p>
      <div style={{ 
        padding: '20px', 
        backgroundColor: '#f7fafc', 
        borderRadius: '8px',
        marginTop: '30px'
      }}>
        <h2>診断情報</h2>
        <ul style={{ textAlign: 'left', display: 'inline-block' }}>
          <li>✅ Next.js サーバー: 動作中</li>
          <li>✅ React: 正常</li>
          <li>✅ ページレンダリング: 正常</li>
        </ul>
      </div>
      <div style={{ marginTop: '30px' }}>
        <a 
          href="/" 
          style={{ 
            padding: '10px 20px',
            backgroundColor: '#667eea',
            color: 'white',
            textDecoration: 'none',
            borderRadius: '5px',
            display: 'inline-block'
          }}
        >
          メインページに戻る
        </a>
      </div>
    </div>
  )
}
