'use client'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <div style={{ 
      padding: '20px', 
      fontFamily: 'Arial',
      maxWidth: '800px',
      margin: '0 auto'
    }}>
      <h1 style={{ color: 'red' }}>エラーが発生しました</h1>
      <p>{error.message || '予期しないエラーが発生しました'}</p>
      <button 
        onClick={reset}
        style={{
          padding: '10px 20px',
          backgroundColor: '#0070f3',
          color: 'white',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer',
          marginTop: '20px'
        }}
      >
        再試行
      </button>
    </div>
  )
}
