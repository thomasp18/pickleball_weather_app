'use client';
import { useState, useEffect } from 'react';
import axios from 'axios';

// Gets the data from our API in the backend
const useAxios = () => {
  const [response, setResponse] = useState(null);
  const [error, setError] = useState('');
  const [loading, setloading] = useState(true);

  const fetchData = () => {
    axios
      .get('/api/weather', { cache: 'no-cache' })
      .then((res) => {
        setResponse(res.data);
      })
      .catch((err) => {
        setError(err);
      })
      .finally(() => {
        setloading(false);
      });
  };

  useEffect(() => {
    fetchData();
  }, []);

  // custom hook returns value
  return { response, error, loading };
};

// Main component
export default function Home() {
  const { response, error, loading } = useAxios();

  if (!error && !loading) {
    return (
      <div>
        <h1 className='display-1 text-center p-auto m-auto pt-2'>PikoWeatherer</h1>
        <br />
        <div className='text-center'>
          <WeatherData apiData={response} />
        </div>
        <br />
        <div className='text-center mt-2'>
          <a className="btn btn-primary" href="/score">Play Now!</a>
        </div>
      </div>);
  } else {
    console.log(error);
  }
}

// Displays the weather data in a more readable state
function WeatherData({ apiData }) {
  // Seperate the API data from today and the rest of the week
  const todayData = apiData[0];
  const future = apiData.slice(1, 7);
  const [marked, setMarked] = useState(false);
  const markDay = marked ? "marked" : "";

  let weekday = {
    0: 'Monday', 1: 'Tuesday', 2: 'Wednesday', 3: 'Thursday', 4: 'Friday', 5: 'Saturday', 6: 'Sunday'
  };

  let icon = {
    "Clear sky": "qi-100", "Mainly clear": "qi-102", "Partly cloudy": "qi-103", "Overcast": "qi-104", "Fog": "qi-501",
    "Depositing Rime Fog": "qi-2377", "Light drizzle": "qi-309", "Moderate drizzle": "qi-311", "Dense drizzle": "qi-312",
    "Light freezing drizzle": "qi-2214", "Dense freezing drizzle": "qi-2214",
    "Slight rain": "qi-305", "Moderate rain": "qi-306", "Heavy rain": "qi-307",
    "Light freezing rain": "qi-313", "Heavy freezing rain": "qi-313-fill",
    "Slight snow fall": "qi-400", "Moderate snow fall": "qi-401", "Heavy snow fall": "qi-402",
    "Snow grains": "qi-1040", "Slight rain showers": "qi-300", "Moderate rain showers": "qi-301", "Violent rain showers": "qi-301-fill",
    "Slight snow showers": "qi-406", "Heavy snow showers": "qi-406-fill", "Slight or moderate thunderstorm": "qi-303-fill",
    "Slight hail thunderstorm": "qi-304", "Heavy hail thunderstorm": "qi-304-fill"
  };
  let todayWIcon = icon[todayData.weathercode];

  return (
    <>
      {/* Weather data carousel */}
      <div className="container-sm">
        <div id="weatherCarousel" className="carousel slide" data-bs-ride="false">
          <div className="carousel-indicators">
            <button type="button" data-bs-target="#weatherCarousel" data-bs-slide-to="0" className="active" aria-current="true" aria-label="wd1"></button>
            <button type="button" data-bs-target="#weatherCarousel" data-bs-slide-to="1" aria-label="wd2"></button>
            <button type="button" data-bs-target="#weatherCarousel" data-bs-slide-to="2" aria-label="wd3"></button>
            <button type="button" data-bs-target="#weatherCarousel" data-bs-slide-to="3" aria-label="wd4"></button>
            <button type="button" data-bs-target="#weatherCarousel" data-bs-slide-to="4" aria-label="wd5"></button>
            <button type="button" data-bs-target="#weatherCarousel" data-bs-slide-to="5" aria-label="wd6"></button>
            <button type="button" data-bs-target="#weatherCarousel" data-bs-slide-to="6" aria-label="wd7"></button>
          </div>
          <div className="carousel-inner">
            <div className="carousel-item active">
              <div className='container-fluid'>
                <div className='row'>
                  <div className='col' >
                    <div className='card text-center'>
                      <i className={todayWIcon} style={{ fontSize: "150px" }}></i>
                      <div className='card-body text-center'>
                        <div style={{ display: "inline-block", textAlign: "left" }}>
                          <h5 className='mb-0'><b>Today</b></h5>
                          <p className="card-title mt-0"><small className='text-body-secondary'>{todayData.date}</small></p>
                          <li className='card-text'>Temperature: {todayData.temperature}°F</li>
                          <li className='card-text'>Humidity: {todayData.humidity}%</li>
                          <li className='card-text'>Wind: {todayData.wind} mph</li>
                          <li className='card-text'>Rain Chance: {todayData.precipitation}%</li>
                          <li className='card-text'>Weather Condition: {todayData.weathercode}</li>
                        </div>
                      </div>
                      <div className='card-footer text-center'>
                        <div className='row justify-content-end'>
                          <p className='card-text'>Judgement: <b>{todayData.judgement}</b></p>
                          <br />
                          <br />
                          <br />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {future.map((value) => {
              let apiDate = value.date;
              const d = new Date(apiDate);
              let day = weekday[d.getDay()];
              let weatherIcon = icon[value.weathercode];

              return (
                <div key={apiDate} className="carousel-item">
                  <div className={`card text-center ${markDay}`}>
                    <i className={weatherIcon} style={{ fontSize: "150px" }}></i>
                    <div className='card-body text-center'>
                      <div style={{ display: "inline-block", textAlign: "left" }}>
                        <h5 className='mb-0'><b>{day}</b></h5>
                        <p className='card-title mt-0'><small className='text-body-secondary'>{apiDate}</small></p>
                        <li className='card-text'>Temperature: {value.temperature}°F</li>
                        <li className='card-text'>Humidity: {value.humidity}%</li>
                        <li className='card-text'>Wind: {value.wind} mph</li>
                        <li className='card-text'>Rain Chance: {value.precipitation}%</li>
                        <li className='card-text'>Weather Condition: {value.weathercode}</li>
                      </div>
                    </div>
                    <div className='card-footer text-center'>
                      <div className='row justify-content-center'>
                        <div className="col-sm">
                          <p className='card-text'>Judgement: <b>{value.judgement}</b></p>
                        </div>
                        {/* <div className='col-sm'>
                          <button className="btn btn-secondary" onClick={() => setMarked(!marked)}>mark</button>
                        </div> */}
                        <br />
                        <br />
                        <br />
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          <button className="carousel-control-prev" type="button" data-bs-target="#weatherCarousel" data-bs-slide="prev">
            <span className="carousel-control-prev-icon" aria-hidden="true"></span>
            <span className="visually-hidden">Previous</span>
          </button>
          <button className="carousel-control-next" type="button" data-bs-target="#weatherCarousel" data-bs-slide="next">
            <span className="carousel-control-next-icon" aria-hidden="true"></span>
            <span className="visually-hidden">Next</span>
          </button>
        </div>
      </div>

      <br />

      {/* Scroll menu for the weekdays */}
      <div className='scrollmenu'>
        <div className="btn-group" role="group" aria-label="Basic example">
          {apiData.map((value, index) => {
            const d = new Date(value.date);
            let day = weekday[d.getDay()];

            return (
              <button key={value.date} type="button" className="btn btn-secondary" data-bs-target="#weatherCarousel" data-bs-slide-to={index}>
                <b>{day}</b>
                <h1>{value.temperature}°F</h1>
              </button>
            );
          })}
        </div>
      </div>
    </>
  );
}

// (icons) https://icons.qweather.com/en/