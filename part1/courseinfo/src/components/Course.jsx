const Total = ({ course: { parts } }) => {
    const total = parts.reduce((acc, item) => acc + item.exercises, 0)

    return <p><b>total of {total} exercises</b></p>
}

const Part = ({ part, exercises }) => <p> {part} {exercises} </p>;

const Content = ({ course: { parts } }) => {
    return (
        <>
            {parts.map(part => (
                <Part
                    key={part.id}
                    part={part.name}
                    exercises={part.exercises}
                />
            ))}

        </>
    )
}

const Header = ({ course: { name } }) => <h2>{name}</h2>;

const Course = ({ course }) => (
    <div>
        <h1>Web development curriculum</h1>
        <Header course={course} />
        <Content course={course} />
        <Total course={course} />
    </div>
);

export default Course;