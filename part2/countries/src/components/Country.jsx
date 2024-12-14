import Weather from "./Weather";

const Country = ({ filteredCountries, weather }) => {
    const { name: { common: name }, capital, area, languages, flags } = filteredCountries[0];

    return (
        <div>
            <h2>{name}</h2>
            <div>capital {capital}</div>
            <div>area {area}</div>
            <p><b>languages:</b></p>
            <ul>{languages && Object.keys(languages).map(key => <li key={key}>{languages[key]}</li>)}</ul>
            {flags?.svg && <img src={flags.svg} alt={`The flag of ${name}`} style={{ maxWidth: "25%" }} />}
            <Weather weather={weather} capital={capital} />
        </div>
    );
}

export default Country;