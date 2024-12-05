'use client';
import { ListGroup, OverlayTrigger } from 'react-bootstrap';
import Button from 'react-bootstrap/Button';
import Tooltip from 'react-bootstrap/Tooltip';
import Error from './components/loading-and-error/error';
import Loading from './components/loading-and-error/loading';
import './mobile.css';
import useRequest from './utils/useRequest';

// Main component
export default function Home() {
  const { response: weather, error: weatherErr, loading: weatherLoading } = useRequest('GET', '/api/weather');
  const { response: schedule, error: scheduleErr, loading: scheduleLoading } = useRequest('GET', '/api/schedule');

  if (weatherLoading || scheduleLoading) {
    return <Loading />;
  }

  if (weatherErr || scheduleErr) {
    return <Error />;
  }

  return (
    <div>
      <h1 className='display-1 text-center p-auto m-auto pt-2'>PikoWeatherer</h1>
      <br />
      <div className='text-center'>
        <WeatherData weatherData={weather} scheduleData={schedule}/>
      </div>
      <br />
      <div className='text-center mt-2 mb-4'>
        <a className="btn btn-primary" href="/score">Play Now!</a>
      </div>
    </div>);
}

// Displays the weather data in a more readable state
function WeatherData({ weatherData, scheduleData }) {
  let weekday = {
    1: 'Monday', 2: 'Tuesday', 3: 'Wednesday', 4: 'Thursday', 5: 'Friday', 6: 'Saturday', 0: 'Sunday'
  };

  let icon = {
    'Clear sky': 'qi-100', 'Mainly clear': 'qi-102', 'Partly cloudy': 'qi-103', 'Overcast': 'qi-104', 'Fog': 'qi-501',
    'Depositing Rime Fog': 'qi-2377', 'Light drizzle': 'qi-309', 'Moderate drizzle': 'qi-311', 'Dense drizzle': 'qi-312',
    'Light freezing drizzle': 'qi-2214', 'Dense freezing drizzle': 'qi-2214',
    'Slight rain': 'qi-305', 'Moderate rain': 'qi-306', 'Heavy rain': 'qi-307',
    'Light freezing rain': 'qi-313', 'Heavy freezing rain': 'qi-313-fill',
    'Slight snow fall': 'qi-400', 'Moderate snow fall': 'qi-401', 'Heavy snow fall': 'qi-402',
    'Snow grains': 'qi-1040', 'Slight rain showers': 'qi-300', 'Moderate rain showers': 'qi-301', 'Violent rain showers': 'qi-301-fill',
    'Slight snow showers': 'qi-406', 'Heavy snow showers': 'qi-406-fill', 'Slight or moderate thunderstorm': 'qi-303-fill',
    'Slight hail thunderstorm': 'qi-304', 'Heavy hail thunderstorm': 'qi-304-fill'
  };

  async function AddDate(scheduleDate) {
    if (scheduleDate === '') {
      return;
    }
  
    const url = '/api/schedule';
    let duplicate = false;
  
    scheduleData.forEach((scheduleData) => {
      const { sdate } = scheduleData;
      const formatSdate = new Date(sdate.slice(0, 10) + 'T00:00:00.000-05:00').toDateString();
      
      if (formatSdate === scheduleDate.toDateString()) {
        duplicate = true;
      }
    });
  
    if (duplicate) {
      return;
    }
  
    try {
      const response = await fetch(url, {
        method: 'POST',
        body: JSON.stringify({ 'sdate': scheduleDate }),
        headers: {
          'Content-Type': 'application/json',
        },
      });
  
      if (!response.ok) {
        throw new Error(`Response status: ${response.status}`);
      }
      
    } catch (error) {
      console.error(error.message);
    };
  }

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
            {weatherData.map((value, index) => {
              let apiDate = value.date;
              const d = new Date(apiDate + 'T00:00:00.000-05:00');
              let day = weekday[d.getDay()];
              let weatherIcon = icon[value.weathercode];

              return (
                <div key={apiDate} className={`carousel-item ${index === 0 ? 'active' : ''}`}>
                  <div className='card text-center'>
                    <i className={`mb-0 ${weatherIcon}`} style={{ fontSize: '150px' }}></i>
                    <div className='card-body text-center'>
                      <div className='d-inline-block weather'>
                        <h5 className='text-center fs-3 mt-0 mb-0'><b>{index === 0 ? 'Today' : day}</b></h5>
                        <p className='card-title text-center mt-0 mb-0'><small className='text-body-secondary'>{apiDate}</small></p>
                        <p className='card-text text-center fs-3 mt-0 mb-0'><b>{value.temperature}°F</b></p>
                        <ListGroup variant="flush">
                          <ListGroup.Item className='card-text'>
                            <div className='float-start'>Humidity: </div>
                            <div className='float-end'><b className='text-end'>{value.humidity}%</b></div>
                          </ListGroup.Item>
                          <ListGroup.Item className='card-text'>
                            <div className='float-start'>Wind:</div>
                            <div className='float-end'><b>{value.wind} mph</b></div>
                          </ListGroup.Item>
                          <ListGroup.Item className='card-text'>
                            <div className='float-start'>Rain Chance: </div>
                            <div className='float-end'><b>{value.precipitation}%</b></div>
                          </ListGroup.Item>
                          <ListGroup.Item className='card-text'>
                            <div className='float-start'>Forecast: </div>
                            <div className='float-end'><b>{value.weathercode}</b></div>
                          </ListGroup.Item>
                        </ListGroup>
                      </div>
                    </div>
                    <div className='card-footer text-center'>
                      <div className='row justify-content-center'>
                        <div className="col-sm pb-5">
                          <p className='card-text'>Judgement: <b>{value.judgement}</b></p>
                          <Button type='button' onClick={() => AddDate(d)}>Schedule Date</Button>
                        </div>
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
          {weatherData.map((value, index) => {
            const d = new Date(value.date + 'T00:00:00.000-05:00');
            let day = weekday[d.getDay()];
            const judge = {
              'kms': 'this is not peak',
              'this is peak piko weather': 'this is peak'
            };

            return (
              <OverlayTrigger
                key={value.date}
                overlay={<Tooltip>{judge[value.judgement]}</Tooltip>}
              >
                <Button
                  type="button"
                  className="btn btn-secondary"
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
    </>
  );
}

// (icons) https://icons.qweather.com/en/