import { useState, useEffect } from 'react';
import Persons from './components/Persons';
import PersonForm from './components/PersonForm';
import Filter from './components/Filter';
import Notification from './components/Notification';
import personService from './services/persons';

const App = () => {
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState('');
  const [newNumber, setNewNumber] = useState('');
  const [filter, setFilter] = useState('');
  const [message, setMessage] = useState({ msg: null, type: null });

  useEffect(() => {
    personService.getAll()
      .then(initialPersons => {
        setPersons(initialPersons);
      })
      .catch(error => {
        console.error("Failed to fetch data:", error);
      });
  }, []);

  useEffect(() => {
    if (message.msg) {
      const timeout = setTimeout(() => {
        setMessage({ msg: null, type: null });
      }, 5000)

      return () => clearTimeout(timeout);
    }
  }, [message])

  const personsList = !filter ? persons : persons.filter(person => {
    const lcName = person.name.toLowerCase();
    const lcFilter = filter.toLowerCase();
    return lcName.includes(lcFilter);
  });

  const findPersonByName = (arr, obj) => {
    return arr.find(item => item.name === obj.name);
  }

  const resetForm = () => {
    setNewName('');
    setNewNumber('');
  }

  const addPerson = obj => {
    personService.create(obj)
      .then(returnedPerson => {
        setPersons(persons.concat(returnedPerson));
        setMessage({ msg: `Added ${obj.name}`, type: 1 });
      })
      .catch(error => {
        console.error("Failed to create person:", error);
        setMessage({ msg: `Error creating the person. Please try again.`, type: 0 });
      });
  }

  const deletePerson = id => {
    const person = persons.find(p => p.id === id);
    if (!person) return;

    const confirmed = confirm(`Delete ${person.name} ?`);
    if (!confirmed) return;

    personService.remove(id)
      .then(() => {
        setPersons(prevPersons => prevPersons.filter(p => p.id !== id))
      })
      .catch(error => {
        console.error("Failed to delete person:", error);
        setMessage({ msg: `Information of ${person.name} has already been removed from server`, type: 0 });
        setPersons(prevPersons => prevPersons.filter(p => p.id !== id));
      });
  }

  const updatePerson = obj => {
    const confirmed = confirm(`${newName} is already added to phonebook, replace the old number with a new one?`);
    if (!confirmed) return;

    const changedPerson = { ...obj, number: newNumber };

    personService.update(obj.id, changedPerson)
      .then(returnedPerson => {
        setPersons(prevPersons => prevPersons.map(person => person.id === returnedPerson.id ? returnedPerson : person));
        setMessage({ msg: `${changedPerson.name}'s number is replaced with ${changedPerson.number}`, type: 1 });
      })
      .catch(error => {
        console.error("Failed to replace person:", error);
        setMessage({ msg: `Error replacing the person. Please try again.`, type: 0 });
      });

  }

  const handleNameChange = e => setNewName(e.target.value);
  const handleNumChange = e => setNewNumber(e.target.value);
  const handleFilterChange = e => setFilter(e.target.value);

  const handleFormSubmit = e => {
    e.preventDefault();

    if (!newName || !newNumber) return;

    const personObj = { name: newName, number: newNumber };
    const duplicate = findPersonByName(persons, personObj);

    if (duplicate) {
      updatePerson(duplicate);
      resetForm();
    } else {
      addPerson(personObj);
      resetForm();
    }
  }

  const handlePersonDel = id => {
    deletePerson(id);
  }

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={message} />
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