import { useState, useEffect } from "react";
import axios from "axios";
import Search from "./components/Search";
import Countries from "./components/Countries";

const apiKey = import.meta.env.VITE_SOME_KEY;

const App = () => {
    const [search, setSearch] = useState('');
    const [countries, setCountries] = useState([]);
    const [weather, setWeather] = useState({});

    useEffect(() => {
        axios.get('https://studies.cs.helsinki.fi/restcountries/api/all')
            .then(res => setCountries(res.data))
            .catch(err => console.error("Failed to fetch countries: ", err));
    }, [])

    useEffect(() => {
        if (filteredCountries.length === 1) {
            const city = filteredCountries[0].capital;

            if (!city) return;
            axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`)
                .then(res => setWeather(res.data))
                .catch(err => {
                    console.error("Failed to fetch weather data: ", err);
                    setWeather({});
                });
        }
    }, [search])

    const filteredCountries = !search || countries.length === 0 ? [] : countries.filter(country => {
        const countryName = [country.name.common, country.name.official];
        const lcSearch = search.toLowerCase()
        return (countryName.some(name => name.toLowerCase().includes(lcSearch)));
    });

    const handleChange = e => setSearch(e.target.value);
    const handleClick = search => setSearch(search);

    return (
        <div>
            <Search
                id='search'
                text='find countries '
                value={search}
                onChange={handleChange}
            />
            <Countries
                filteredCountries={filteredCountries}
                handleClick={handleClick}
                weather={weather}
            />
        </div>
    );
}

export default App;