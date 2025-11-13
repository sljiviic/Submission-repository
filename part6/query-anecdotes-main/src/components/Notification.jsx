import { useContext, useEffect } from 'react'
import NotificationContext from '../NotificationContext'

const Notification = () => {
  const { notification, notificationDispatch } = useContext(NotificationContext)

  useEffect(() => {
    let timerID
    if (notification) {
      timerID = setTimeout(() => {
        notificationDispatch({ type: 'RESET' })
      }, 5000)
    }

    return () => clearTimeout(timerID)
  }, [notification, notificationDispatch])

  const style = {
    border: 'solid',
    padding: 10,
    borderWidth: 1,
    marginBottom: 5
  }

  if (!notification) return null

  return (
    <div style={style}>
      {notification}
    </div>
  )
}

export default Notification
