const SinglePerson = ({ person, handlePersonDel }) => (
    <div>
        <span>{person.name} {person.number} </span>
        <button onClick={() => handlePersonDel(person.id)}>delete</button>
    </div>
);

const Persons = ({ personsList, handlePersonDel }) => {
    return (
        personsList.map(person =>
            <SinglePerson
                key={person.id}
                person={person}
                handlePersonDel={handlePersonDel}
            />
        )
    );
}

export default Persons;