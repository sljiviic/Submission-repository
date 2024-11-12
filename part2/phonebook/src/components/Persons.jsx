const SinglePerson = ({ person }) => <p>{person.name} {person.number}</p>;

const Persons = ({ personsList }) => {
    return (
        personsList.map(person =>
            <SinglePerson key={person.id} person={person} />
        )
    );
}

export default Persons;