import React, { useState, useEffect } from 'react';
import { TiWeatherNight,TiWeatherPartlySunny, TiWeatherShower, TiWeatherWindyCloudy, TiWeatherCloudy } from "react-icons/ti";

const HomePage = () => {
    const [temperature, setTemperature] = useState(null);
    const [loading, setLoading] = useState(true);
    const [status, setStatus] = useState('');
    const [wind, setWind] = useState('');
    const [rain, setRain] = useState('');
    const [cloudcover, setCloudcover] = useState('');
    const [error, setError] = useState(null);
    const [weatherIcon, setWeatherIcon] = useState(null);
    const [currentDay, setCurrentDay] = useState(null);
    const [days] = useState(['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']);
    const [nextDays, setNextDays] = useState(['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']);
    const [nextDaysMaxTemp, setNextDaysMaxTemp] = useState('');
    const [nextDaysMinTemp, setNextDaysMinTemp] = useState('');
    const [cityLongitude, setCityLongitude] = useState(null);
    const [cityLatitude, setCityLatitude] = useState(null);
    const [city, setCity] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            try {
               
                const reverseGeocode = await fetch("https://api.geoapify.com/v1/geocode/search?text=Berlin&lang=en&limit=10&type=city&format=json&apiKey=f46b34a1e7154672a41385ed7cd2c03b");
                if (!reverseGeocode.ok) {
                    throw new Error(`Failed to fetch: ${reverseGeocode.status}`);
                }
                const responseGeolocations = await reverseGeocode.json();
    
               
                if (responseGeolocations.results) {
                    for (let i = 0; i < 12; i++) {
                        setTimeout(async () => {
                            const longitude = responseGeolocations.results[i].lon;
                            const latitude = responseGeolocations.results[i].lat;
                            const city = responseGeolocations.results[i].state;
    
                            console.log("City:", city);
                            setCity(city);
                            console.log("Longitude:", longitude);
                            setCityLongitude(longitude);
                            console.log("Latitude:", latitude);
                            setCityLatitude(latitude);
    
                           
                            const request = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,is_day,precipitation,rain,weather_code,cloud_cover,wind_speed_10m&daily=weather_code,temperature_2m_max,temperature_2m_min&timezone=Asia%2FSingapore`);
                            if (!request.ok) {
                                throw new Error(`Failed to fetch weather data: ${request.status}`);
                            }
                            const response = await request.json();
    
                           
                            if (response) {
                               
                                setTemperature(response.current.temperature_2m);
                                setRain(response.current.rain);
                                setCloudcover(response.current.cloud_cover);
                                setWind(response.current.wind_speed_10m);
    
                                const currentDate = new Date();
                                const today = currentDate.getDay();
                                setCurrentDay(days[today]);
                                setNextDays(nextDays.slice(today + 1).concat(nextDays.slice(0, 0).reverse()));
                                setNextDaysMaxTemp(response.daily.temperature_2m_max.slice(today + 1).concat(response.daily.temperature_2m_max.slice(0, 0).reverse()));
                                setNextDaysMinTemp(response.daily.temperature_2m_min.slice(today + 1).concat(response.daily.temperature_2m_min.slice(0, 0).reverse()));
    
                                
                                if (response.current.weather_code === 1 || response.current.weather_code === 0) {
                                    setStatus("Clear");
                                    setWeatherIcon(<TiWeatherNight className='animate-pulse invert'/>);
                                } else if (response.current.weather_code === 2 || response.current.weather_code === 3) {
                                    setStatus("Mainly clear");
                                    setWeatherIcon(<TiWeatherPartlySunny className='animate-pulse invert'/>);
                                } else if (response.current.weather_code === 4 || response.current.weather_code === 5) {
                                    setStatus("Partly Cloudy clear");
                                    setWeatherIcon(<TiWeatherNight className='animate-pulse invert'/>);
                                }
                             else {
                                setError("Error: No weather data received");
                            }}
                        }, i * 2000); 
                    }
                } else {
                    setError("Error: No geolocation data received");
                }
            } catch (error) {
                setError(`Error fetching data: ${error.message}`);
            } finally {
                setLoading(false);
            }
        };
    
        fetchData();
    }, []);
    

    return (
        <div className='text-gray-400 text-center  sm:mt-32  sm:ml-autobg-gray-300 rounded-lg shadow-md sm:p-6 p-3 mx-auto w-full overflow-hidden sm:w-[50rem] bg-blue-100 sm:h-auto h-[100vh] dark:bg-gray-900'>
            {loading && <p className='h-100vh'>Loading...</p>}
            {!loading && error && <p>{error}</p>}
            {!loading && !error && (
                <>
                    <h1 className='text-2xl mt-12'>
                        Right Now in <span className='text-bold text-3xl text-black ml-2 relative w-[max-content] font-mono before:absolute before:inset-0 before:animate-typewriter dark:text-white '>{city}</span>, it's {status} <br />

                        <div className='flex flex-col items-center sm:flex-row sm:items-center   justify-center sm:gap-32 gap-12 mt-12 '>
                            <div className='' style={{ fontSize: '6rem' }}>
                                {weatherIcon}
                            </div>
                            <div>
                                {temperature}°C
                            </div>

                            <div className='gap-2 flex-col items-center'>
                                <div className='flex gap-2 items-center'>
                                    <TiWeatherWindyCloudy />
                                    <h1>{wind}km/hr</h1>
                                </div>

                                <div className='flex gap-2 items-center'>
                                    <TiWeatherShower />
                                    <h1>{rain}%</h1>
                                </div>

                                <div className='flex gap-2 items-center'>
                                    <TiWeatherCloudy />
                                    <h1>{cloudcover}%</h1>
                                </div>
                            </div>
                        </div>
                    </h1>

                    <div className='flex items-center m-auto justify-center gap-12 mt-16'>
                        <div>
                            {currentDay}
                        </div>
                    </div>
       <h2 className='sm:mt-48 mt-16'> Forecast This Week</h2>
                    <div className='flex justify-center mt-4 gap-6'>
                        {nextDays.map((day, index) => (
                            <div key={index} className='flex flex-col items-center'>
                                {index !== nextDays.length && <TiWeatherCloudy className="mb-2" />}
                                <span>{day}</span>
                                <span>{nextDaysMaxTemp[index]}° / {nextDaysMinTemp[index]}°</span>
                            </div>
                        ))}
                    </div>
                </>
            )}
        </div>
    );
};

export default HomePage;
