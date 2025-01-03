'use client';
import { useState } from 'react';
import { OverlayTrigger } from 'react-bootstrap';
import Button from 'react-bootstrap/Button';
import Tooltip from 'react-bootstrap/Tooltip';
import Error from './components/loading-and-error/error';
import Loading from './components/loading-and-error/loading';
import useRequest from './utils/useRequest';

// Main component
export default function Home() {
  const { response, error, loading } = useRequest('GET', '/api/weather');

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return <Error />;
  }

  return (
    <div>
      <h1 className="display-1 text-center p-auto m-auto pt-2">PikoWeatherer</h1>
      <div className="text-center">
        <WeatherData apiData={response} />
      </div>
      <div className="text-center my-3">
        <a className="btn btn-primary" href="/score">
          Play Now!
        </a>
      </div>
    </div>
  );
}

// Displays the weather data in a more readable state
function WeatherData({ apiData }) {
  // Seperate the API data from today and the rest of the week
  const todayData = apiData[0];
  const future = apiData.slice(1, 7);
  const [marked, setMarked] = useState(false);
  const markDay = marked ? 'marked' : '';

  let weekday = {
    0: 'Monday',
    1: 'Tuesday',
    2: 'Wednesday',
    3: 'Thursday',
    4: 'Friday',
    5: 'Saturday',
    6: 'Sunday',
  };

  let icon = {
    'Clear sky': 'qi-100',
    'Mainly clear': 'qi-102',
    'Partly cloudy': 'qi-103',
    Overcast: 'qi-104',
    Fog: 'qi-501',
    'Depositing Rime Fog': 'qi-2377',
    'Light drizzle': 'qi-309',
    'Moderate drizzle': 'qi-311',
    'Dense drizzle': 'qi-312',
    'Light freezing drizzle': 'qi-2214',
    'Dense freezing drizzle': 'qi-2214',
    'Slight rain': 'qi-305',
    'Moderate rain': 'qi-306',
    'Heavy rain': 'qi-307',
    'Light freezing rain': 'qi-313',
    'Heavy freezing rain': 'qi-313-fill',
    'Slight snow fall': 'qi-400',
    'Moderate snow fall': 'qi-401',
    'Heavy snow fall': 'qi-402',
    'Snow grains': 'qi-1040',
    'Slight rain showers': 'qi-300',
    'Moderate rain showers': 'qi-301',
    'Violent rain showers': 'qi-301-fill',
    'Slight snow showers': 'qi-406',
    'Heavy snow showers': 'qi-406-fill',
    'Slight or moderate thunderstorm': 'qi-303-fill',
    'Slight hail thunderstorm': 'qi-304',
    'Heavy hail thunderstorm': 'qi-304-fill',
  };
  let todayWIcon = icon[todayData.weathercode];

  return (
    <>
      {/* Weather data carousel */}
      <div className="container-sm my-3">
        <div id="weatherCarousel" className="carousel slide" data-bs-ride="false">
          <div className="carousel-inner">
            {apiData.map((value, index) => {
              let apiDate = value.date;
              const d = new Date(apiDate);
              let day = weekday[d.getDay()];
              let weatherIcon = icon[value.weathercode];

              return (
                <div key={apiDate} className={`carousel-item ${index === 0 ? 'active' : ''}`}>
                  <div className={`card text-center ${markDay}`}>
                    <i className={weatherIcon} style={{ fontSize: '150px' }}></i>
                    <div className="card-body text-center">
                      <div style={{ display: 'inline-block', textAlign: 'left' }}>
                        <h5 className="mb-0">
                          <b>{index === 0 ? 'Today' : day}</b>
                        </h5>
                        <p className="card-title mt-0">
                          <small className="text-body-secondary">{apiDate}</small>
                        </p>
                        <table className="table">
                          <tbody>
                            <tr>
                              <td>Temperature</td>
                              <td className="text-end">{value.temperature}°F</td>
                            </tr>
                            <tr>
                              <td>Humidity</td>
                              <td className="text-end">{value.humidity}%</td>
                            </tr>
                            <tr>
                              <td>Wind</td>
                              <td className="text-end">{value.wind} mph</td>
                            </tr>
                            <tr>
                              <td>Rain Chance</td>
                              <td className="text-end">{value.precipitation}%</td>
                            </tr>
                            <tr>
                              <td>Condition</td>
                              <td className="text-end">{value.weathercode}</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                    <div className="card-footer text-center">
                      <div className="row justify-content-center">
                        <div className="col-sm">
                          <p className="card-text">
                            Judgement: <b>{value.judgement}</b>
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          <button
            className="carousel-control-prev"
            type="button"
            data-bs-target="#weatherCarousel"
            data-bs-slide="prev"
          >
            <span className="carousel-control-prev-icon"></span>
            <span className="visually-hidden">Previous</span>
          </button>
          <button
            className="carousel-control-next"
            type="button"
            data-bs-target="#weatherCarousel"
            data-bs-slide="next"
          >
            <span className="carousel-control-next-icon"></span>
            <span className="visually-hidden">Next</span>
          </button>
        </div>
      </div>

      {/* Scroll menu for the weekdays */}
      <div className="container-sm">
        <div className="scrollmenu rounded">
          <div className="btn-group" role="group">
            {apiData.map((value, index) => {
              const d = new Date(value.date);
              let day = weekday[d.getDay()];
              const judge = {
                kms: 'this is not peak',
                'this is peak piko weather': 'this is peak',
              };

              return (
                <OverlayTrigger
                  key={value.date}
                  overlay={<Tooltip>{judge[value.judgement]}</Tooltip>}
                >
                  <Button
                    type="button"
                    className="btn-sm btn-secondary"
                    data-bs-target="#weatherCarousel"
                    data-bs-slide-to={index}
                    variant={`${value.judgement === 'kms' ? '' : 'success'}`}
                  >
                    <b>{index === 0 ? 'Today' : day}</b>
                    <h1>{value.temperature}°F</h1>
                  </Button>
                </OverlayTrigger>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
}

// (icons) https://icons.qweather.com/en/
