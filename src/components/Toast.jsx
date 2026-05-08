import { useEffect, useState } from 'react'

export default function Toast({ message, onDone }) {
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    const hide = setTimeout(() => setVisible(false), 3000)
    const done = setTimeout(onDone, 3400)
    return () => { clearTimeout(hide); clearTimeout(done) }
  }, [onDone])

  return (
    <div className={`toast ${visible ? 'toast-in' : 'toast-out'}`}>
      {message}
    </div>
  )
}
