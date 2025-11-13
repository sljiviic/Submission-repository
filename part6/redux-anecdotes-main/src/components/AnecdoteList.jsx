import { useDispatch, useSelector } from 'react-redux'
import { voteAnecdote } from '../reducers/anecdoteReducer'
import { setNotification } from '../reducers/notificationReducer'

const Anecdote = ({ anecdote, handleVote }) => {
  return (
    <div key={anecdote.id}>
      <div>{anecdote.content}</div>
      <div>
        has {anecdote.votes}
        <button onClick={handleVote}>vote</button>
      </div>
    </div>
  )
}

const AnecdoteList = () => {
  const dispatch = useDispatch()
  const anecdotes = useSelector(({ anecdotes, filter }) => {
    if (filter === '') return anecdotes

    return anecdotes.filter(anecdote => {
      const LcAnecdote = anecdote.content.toLowerCase()
      const LcFilter = filter.toLowerCase()
      return LcAnecdote.includes(LcFilter)
    })
  })

  const handleVoteAnecdote = anecdote => {
    dispatch(voteAnecdote(anecdote))
    dispatch(setNotification(`You've voted '${anecdote.content}'`, 5))
  }

  const anecdotesDesc = anecdotes.toSorted((a, b) => b.votes - a.votes)

  return (
    <div>
      {
        anecdotesDesc.map(anecdote => (
          <Anecdote
            key={anecdote.id}
            anecdote={anecdote}
            handleVote={() => {
              handleVoteAnecdote(anecdote)
            }}
          />
        ))
      }
    </div>
  )
}

export default AnecdoteList