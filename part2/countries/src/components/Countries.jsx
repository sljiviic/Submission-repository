import Country from "./Country";

const Countries = ({ filteredCountries, handleClick, weather }) => {
    const filterLength = filteredCountries.length

    if (filterLength > 10) return <div>Too many matches, specify another filter</div>;
    if (filterLength > 1) return (
        <>
            {filteredCountries.map(country =>
                <div key={country.name.common}>
                    <span>{country.name.common} </span>
                    <button type="button" onClick={() => { handleClick(country.name.common) }}>show</button>
                </div>
            )}
        </>
    );
    if (filterLength === 1) return <Country filteredCountries={filteredCountries} weather={weather} />;

    return null;
}

export default Countries;