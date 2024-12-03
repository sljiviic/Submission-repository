import { useState, useEffect } from 'react';
import Persons from './components/Persons';
import PersonForm from './components/PersonForm';
import Filter from './components/Filter';
import personService from './services/persons';

const App = () => {
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState('');
  const [newNumber, setNewNumber] = useState('');
  const [filter, setFilter] = useState('');

  useEffect(() => {
    personService.getAll()
      .then(initialPersons => {
        setPersons(initialPersons);
      })
      .catch(error => {
        console.error("Failed to fetch data:", error);
      });
  }, []);

  const personsList = !filter ? persons : persons.filter(person => {
    const lcName = person.name.toLowerCase();
    const lcFilter = filter.toLowerCase();
    return lcName.includes(lcFilter);
  });

  const findEqual = (arr, obj) => {
    return arr.find(item => item.name === obj.name);
  }

  const resetState = () => {
    setNewName('');
    setNewNumber('');
  }

  const addPerson = obj => {
    personService.create(obj)
      .then(returnedPerson => {
        setPersons(persons.concat(returnedPerson));
        resetState();
      })
      .catch(error => {
        console.error("Failed to create person:", error);
        alert("Error creating the person. Please try again.");
      });
  }

  const deletePerson = (obj, id) => {
    if (confirm(`Delete ${obj.name} ?`)) {
      personService.remove(id)
        .then(() => {
          setPersons(prevPersons => prevPersons.filter(p => p.id !== id))
        })
        .catch(error => {
          console.error("Failed to delete person:", error);
          alert("Error deleting the person. Please try again.");
        });
    }
  }

  const updatePerson = obj => {
    if (confirm(`${newName} is already added to phonebook, replace the old number with a new one?`)) {
      const changedPerson = { ...obj, number: newNumber };

      personService.update(obj.id, changedPerson)
        .then(returnedPerson => {
          setPersons(prevPersons => prevPersons.map(person => person.id === returnedPerson.id ? returnedPerson : person));
          resetState();
        })
        .catch(error => {
          console.error("Failed to replace person:", error);
          alert("Error replacing the person. Please try again.");
        });
    }
  }

  const handleNameChange = e => setNewName(e.target.value);
  const handleNumChange = e => setNewNumber(e.target.value);
  const handleFilterChange = e => setFilter(e.target.value);

  const handleFormSubmit = e => {
    e.preventDefault();

    if (!newName || !newNumber) {
      alert("Please provide both a name and a valid phone number.");
      return;
    }

    const personObj = { name: newName, number: newNumber };
    const duplicate = findEqual(persons, personObj);

    if (duplicate) {
      updatePerson(duplicate);
    } else {
      addPerson(personObj);
    }
  }

  const handlePersonDel = id => {
    const person = persons.find(p => p.id === id);

    deletePerson(person, id);
  }

  return (
    <div>
      <h2>Phonebook</h2>
      <Filter filter={filter} onChange={handleFilterChange} />
      <h2>add a new</h2>
      <PersonForm
        onSubmit={handleFormSubmit}
        newName={newName}
        newNumber={newNumber}
        handleNameChange={handleNameChange}
        handleNumChange={handleNumChange}
      />
      <h2>Numbers</h2>
      <Persons
        personsList={personsList}
        handlePersonDel={handlePersonDel}
      />
    </div>
  );
}

export default App;