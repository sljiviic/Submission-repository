import { useState, useEffect } from 'react';
import Persons from './components/Persons';
import PersonForm from './components/PersonForm';
import Filter from './components/Filter';
import axios from 'axios';

const App = () => {
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState('');
  const [newNumber, setNewNumber] = useState('');
  const [filter, setFilter] = useState('');

  useEffect(() => {
    axios
      .get('http://localhost:3001/persons')
      .then(response => {
        const fetchedPerson = response.data;
        setPersons(fetchedPerson);
      });
  }, []);

  const personsList = !filter ? persons : persons.filter(person => {
    const lcName = person.name.toLowerCase();
    const lcFilter = filter.toLowerCase();
    return lcName.includes(lcFilter);
  });

  const findEqual = (arr, obj) => {
    return arr.some(item => item.name === obj.name);
  }

  const resetState = () => {
    setNewName('');
    setNewNumber('');
  }

  const handleFormSubmit = e => {
    e.preventDefault();

    if (!newName || !newNumber) {
      return;
    }

    const newObj = { name: newName, number: newNumber, id: persons.length + 1 };

    if (findEqual(persons, newObj)) {
      alert(`${newName} is already added to phonebook`);
      return;
    }

    setPersons(persons.concat(newObj));
    resetState();
  }

  return (
    <div>
      <h2>Phonebook</h2>
      <Filter filter={filter} onChange={e => setFilter(e.target.value)} />
      <h2>add a new</h2>
      <PersonForm
        onSubmit={handleFormSubmit}
        newName={newName}
        newNumber={newNumber}
        handleNameChange={e => setNewName(e.target.value)}
        handleNumChange={e => setNewNumber(e.target.value)}
      />
      <h2>Numbers</h2>
      <Persons personsList={personsList} />
    </div>
  );
}

export default App;