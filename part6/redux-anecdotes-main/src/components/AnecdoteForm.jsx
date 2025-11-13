import { useDispatch } from 'react-redux'
import { appendAnecdote } from '../reducers/anecdoteReducer'
import { setNotification } from '../reducers/notificationReducer'

const AnecdoteForm = () => {
  const dispatch = useDispatch()

  const handleAddAnecdote = e => {
    e.preventDefault()

    const content = e.target.anecdote.value
    e.target.anecdote.value = ''

    dispatch(appendAnecdote(content))
    dispatch(setNotification(`You've created '${content}'`, 5))
  }

  return (
    <form onSubmit={handleAddAnecdote}>
      <div>
        <input name='anecdote' />
      </div>
      <button>create</button>
    </form>
  )
}

export default AnecdoteForm