import React from "react";
import {
  TiWeatherShower,
  TiWeatherWindyCloudy,
  TiWeatherCloudy,
} from "react-icons/ti";

const WeatherCard = ({
  loading,
  error,
  city,
  status,
  weatherIcon,
  temperature,
  wind,
  rain,
  cloudcover,
  currentDay,
  nextDays,
  nextDaysMaxTemp,
  nextDaysMinTemp,
}) => {
  return (
    <div className="text-gray-400 text-center sm:mt-32 sm:ml-autobg-gray-300 rounded-lg shadow-md sm:p-6 p-3 mx-auto w-full overflow-hidden sm:w-[50rem] bg-blue-100 sm:h-auto h-[100vh] dark:bg-gray-900">
      {loading && <p className="h-100vh">Loading...</p>}
      {!loading && error && <p>{error}</p>}
      {!loading && !error && (
        <>
          <h1 className="text-2xl mt-12">
            Right Now in{" "}
            <span className="text-bold text-3xl text-black ml-2 relative w-[max-content] font-mono before:absolute before:inset-0 before:animate-typewriter dark:text-white ">
              {city}
            </span>
            , it's {status} <br />
            <div className="flex flex-col items-center sm:flex-row sm:items-center   justify-center sm:gap-32 gap-12 mt-12 ">
              <div className="" style={{ fontSize: "6rem" }}>
                {weatherIcon}
              </div>
              <div>{temperature}°C</div>

              <div className="gap-2 flex-col items-center">
                <div className="flex gap-2 items-center">
                  <TiWeatherWindyCloudy />
                  <h1>{wind}km/hr</h1>
                </div>

                <div className="flex gap-2 items-center">
                  <TiWeatherShower />
                  <h1>{rain}%</h1>
                </div>

                <div className="flex gap-2 items-center">
                  <TiWeatherCloudy />
                  <h1>{cloudcover}%</h1>
                </div>
              </div>
            </div>
          </h1>

          <div className="flex items-center m-auto justify-center gap-12 mt-16">
            <div>{currentDay}</div>
          </div>
          <h2 className="sm:mt-48 mt-16"> Forecast This Week</h2>
          <div className="flex justify-center mt-4 gap-6">
            {nextDays.map((day, index) => (
              <div key={index} className="flex flex-col items-center">
                {index !== nextDays.length && (
                  <TiWeatherCloudy className="mb-2" />
                )}
                <span>{day}</span>
                <span>
                  {nextDaysMaxTemp[index]}° / {nextDaysMinTemp[index]}°
                </span>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default WeatherCard;
