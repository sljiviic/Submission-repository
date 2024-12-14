const Weather = ({ weather, capital }) => {
    const { main: { temp: temperature } = "N/A", wind: { speed: windSpeed } = "N/A" } = weather || {};
    const weatherIcon = weather?.weather?.[0].icon;

    return (
        <div>
            <h3>Weather in {capital}</h3>
            <p>temperature {temperature} Celcius</p>
            {weatherIcon && <img src={`https://openweathermap.org/img/wn/${weatherIcon}@2x.png`} alt="Weather condition icon" />}
            <p>wind {windSpeed} m/s</p>
        </div>
    );
}

export default Weather;