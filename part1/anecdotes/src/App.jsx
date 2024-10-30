import { useState } from 'react'

const Button = ({ text, onClick }) => (
  <button onClick={onClick}>{text}</button>
);

const Anecdote = ({ text, votes }) => (
  <>
    <p>{text}</p>
    <p>has {votes} votes</p>
  </>
);

const App = () => {
  const anecdotes = [
    'If it hurts, do it more often.',
    'Adding manpower to a late software project makes it later!',
    'The first 90 percent of the code accounts for the first 90 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.',
    'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
    'Premature optimization is the root of all evil.',
    'Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.',
    'Programming without an extremely heavy use of console.log is same as if a doctor would refuse to use x-rays or blood tests when diagnosing patients.',
    'The only way to go fast, is to go well.'
  ]

  const [selected, setSelected] = useState(0);
  const [points, setPoints] = useState(new Uint16Array(anecdotes.length));

  const handleNextBtn = () => {
    const randomIndex = Math.floor(Math.random() * anecdotes.length);
    setSelected(randomIndex);
  }

  const handleVoteBtn = () => {
    const copy = [...points];
    copy[selected]++;
    setPoints(copy)
  }

  const mostVotedIndex = points.indexOf(Math.max(...points));
  const mostVotedAnecdote = points[mostVotedIndex] > 0 ? anecdotes[mostVotedIndex] : "No votes yet";

  return (
    <div>
      <h1>Anecdote of the day</h1>
      <Anecdote text={anecdotes[selected]} votes={points[selected]} />
      <Button text="vote" onClick={handleVoteBtn} />
      <Button text="next anecdote" onClick={handleNextBtn} />
      <h2>Anecdote with most votes</h2>
      <p>{mostVotedAnecdote}</p>
    </div>
  )
}

export default App;