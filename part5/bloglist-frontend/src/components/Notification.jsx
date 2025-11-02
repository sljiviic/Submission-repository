const Notification = ({ notification: { message, type } }) => {
  if (!message) return null

  const color = type ? 'green' : 'red'

  const style = {
    color,
    backgroundColor: '#D3D3D3',
    borderRadius: 5,
    marginBottom: '10px',
    padding: '10px',
    fontSize: 20,
    border: `3px solid ${color}`
  }

  return (
    <div style={style}>
      <p style={{ margin: 0 }}>{message}</p>
    </div>
  )
}

export default Notification