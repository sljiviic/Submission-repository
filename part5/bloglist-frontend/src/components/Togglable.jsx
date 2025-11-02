import { useState, useImperativeHandle } from 'react'

const Togglable = ({ children, ref, buttonLabel }) => {
  const [isVisible, setIsVisible] = useState(false)

  useImperativeHandle(ref, () => {
    return {
      toggleVisibility
    }
  })

  const toggleVisibility = () => {
    setIsVisible(!isVisible)
  }

  return (
    <div>
      <div style={{ display: isVisible ? '' : 'none' }}>
        {children}
      </div>
      <button onClick={toggleVisibility}>{isVisible ? 'cancel' : buttonLabel}</button>
    </div>
  )
}

export default Togglable