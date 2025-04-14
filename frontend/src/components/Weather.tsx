import React, { useEffect, useState } from "react";
import axios from "axios";

const Weather: React.FC = () => {
    const [weather, setWeather] = useState<string | null>(null);
    const [iconUrl, setIconUrl] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [latitude, setLatitude] = useState<number | null>(null);
    const [longitude, setLongitude] = useState<number | null>(null);

    const weatherUrl = latitude && longitude ? `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=5daebeeb5d5640afadd0fc87939bc8d8` : "";

    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setLatitude(position.coords.latitude);
                    setLongitude(position.coords.longitude);
                },
                (err) => {
                    setError("Unable to retrieve location");
                    setLoading(false);
                }
            );
        } else {
            setError("Geolocation is not supported by this browser.");
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        if (latitude && longitude) {
            axios
                .get(weatherUrl)
                .then((response) => {

                    setWeather(`${Math.round((response.data.main.temp - 273.15) * (9 / 5) + 32)}°F`);
                    setIconUrl(`https://openweathermap.org/img/wn/${response.data.weather[0].icon}@2x.png`);
                    setLoading(false);
                })
                .catch((err) => {
                    setError("Failed to fetch weather data");
                    setLoading(false);
                });
        }
    }, [latitude, longitude, weatherUrl]);

    return (
        <div>
            {loading ? (
                <span>Loading weather...</span>
            ) : error ? (
                <span>{error}</span>
            ) : (
                <div className="flex flex-col items-center">
                    {iconUrl && <img src={iconUrl} alt="Weather Icon" className="weather-icon" />}
                    <span className="text-xl font-bold">{weather}</span>
                </div>
            )}
        </div>
    );
};

export default Weather;