export default function SimplePage() {
  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>✅ サーバーは動作しています！</h1>
      <p>このページが表示されれば、Next.jsサーバーは正常に動作しています。</p>
      <p><a href="/">メインページに戻る</a></p>
      <hr style={{ margin: '20px 0' }} />
      <h2>診断情報</h2>
      <ul>
        <li>ページが読み込まれました</li>
        <li>サーバーは正常に動作しています</li>
      </ul>
    </div>
  )
}
