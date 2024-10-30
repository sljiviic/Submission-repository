import { useState } from "react";

const StatisticLine = ({ text, count }) => (
  <tr>
    <th align="left" style={{ fontWeight: "normal" }}>{text}</th>
    <td>{count}</td>
  </tr>
);

const Statistics = ({ good, neutral, bad, total, average, positivePerc }) => {
  if (!total) {
    return <p>No feedback given</p>
  }

  return (
    <table>
      <tbody>
        <StatisticLine text="good" count={good} />
        <StatisticLine text="neutral" count={neutral} />
        <StatisticLine text="bad" count={bad} />
        <StatisticLine text="all" count={total} />
        <StatisticLine text="average" count={average} />
        <StatisticLine text="positive" count={positivePerc} />
      </tbody>
    </table>
  );
}

const Button = ({ text, onClick }) => (
  <button onClick={onClick}>{text}</button>
);

const App = () => {
  const [good, setGood] = useState(0);
  const [neutral, setNeutral] = useState(0);
  const [bad, setBad] = useState(0);

  const total = good + neutral + bad;
  const average = total ? (good - bad) / total : 0;
  const positivePerc = total ? `${(good * 100) / total} %` : "0 %";

  const handleClick = (category) => {
    return () => {
      switch (category) {
        case "good":
          setGood(g => g + 1);
          break;
        case "neutral":
          setNeutral(n => n + 1);
          break;
        case "bad":
          setBad(b => b + 1);
          break;
        default:
          console.warn('Unexpected category index');
      }
    };
  }

  return (
    <div>
      <h1>give feedback</h1>
      <Button text="good" onClick={handleClick("good")} />
      <Button text="neutral" onClick={handleClick("neutral")} />
      <Button text="bad" onClick={handleClick("bad")} />
      <h2>statistics</h2>
      <Statistics
        good={good}
        neutral={neutral}
        bad={bad}
        total={total}
        average={average}
        positivePerc={positivePerc}
      />
    </div>
  );
}

export default App;