export default function Loading() {
  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      minHeight: '100vh',
      flexDirection: 'column',
      fontFamily: 'Arial'
    }}>
      <h1>読み込み中...</h1>
      <p>少しお待ちください</p>
    </div>
  )
}
