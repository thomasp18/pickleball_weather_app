'use client';
import { useState } from 'react';
import { OverlayTrigger, Toast, ToastContainer } from 'react-bootstrap';
import Button from 'react-bootstrap/Button';
import Tooltip from 'react-bootstrap/Tooltip';
import Error from './components/loading-and-error/error';
import Loading from './components/loading-and-error/loading';
import './mobile.css';
import useRequest from './utils/useRequest';

// Main component
export default function Home() {
  const {
    response: weather,
    error: weatherErr,
    loading: weatherLoading,
  } = useRequest('GET', '/api/weather');
  const {
    response: schedule,
    error: scheduleErr,
    loading: scheduleLoading,
    refetch,
  } = useRequest('GET', '/api/schedule');
  const [dateRequested, setDateRequested] = useState(null);
  const [showToast, setShowToast] = useState(false);
  const [dateToAdd, setDateToAdd] = useState(null);

  function scheduleDupe(date) {
    const dupe = (schedule) => {
      const { sdate } = schedule;
      const formatSdate = new Date(sdate.slice(0, 10) + 'T00:00:00.000-05:00').toDateString();
      return formatSdate === date.toDateString();
    };

    return schedule.some(dupe);
  }

  async function addDate(scheduleDate) {
    const url = '/api/schedule';

    if (scheduleDate === '') {
      return;
    }

    if (scheduleDupe(scheduleDate)) {
      setDateRequested('error');
      return;
    }

    try {
      const response = await fetch(url, {
        method: 'POST',
        body: JSON.stringify({ sdate: scheduleDate }),
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Response status: ${response.status}`);
      }

      refetch();
      setDateRequested('success');
    } catch (error) {
      console.error(error.message);
    }
  }

  async function undo(undoDate) {
    const url = '/api/schedule';
    let id = null;

    schedule.forEach((dates) => {
      if (dates.sdate.slice(0, 10) === undoDate.slice(0, 10)) {
        id = dates.id;
      }
    });

    try {
      const response = await fetch(url, {
        method: 'DELETE',
        body: JSON.stringify({ id }),
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Response status: ${response.status}`);
      }

      refetch();
    } catch (error) {
      console.error(error.message);
    }
  }

  if (weatherLoading || scheduleLoading) {
    return <Loading />;
  }

  if (weatherErr || scheduleErr) {
    return <Error />;
  }

  return (
    <div>
      <h1 className="display-1 text-center p-auto m-auto pt-2 title">PikoWeatherer</h1>
      <div className="text-center">
        <WeatherData
          weatherData={weather}
          addDate={addDate}
          setShowScheduleToast={setShowToast}
          dupe={scheduleDupe}
          setDateToAdd={setDateToAdd}
        />
      </div>
      <div className="text-center my-3">
        <a className="btn btn-primary" href="/score">
          Play Now!
        </a>
      </div>
      <ScheduleToast
        dateRequested={dateRequested}
        showScheduleToast={showToast}
        setShowScheduleToast={setShowToast}
        undoDate={undo}
        dateToAdd={dateToAdd}
      ></ScheduleToast>
    </div>
  );
}

const weekday = {
  1: 'Monday',
  2: 'Tuesday',
  3: 'Wednesday',
  4: 'Thursday',
  5: 'Friday',
  6: 'Saturday',
  0: 'Sunday',
};
const icon = {
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
// Displays the weather data in a more readable state
function WeatherData({ weatherData, addDate, setShowScheduleToast, dupe, setDateToAdd }) {
  return (
    <>
      {/* Weather data carousel */}
      <div className="container-sm my-3">
        <div id="weatherCarousel" className="carousel slide" data-bs-ride="false">
          <div className="carousel-inner">
            {weatherData.map((value, index) => {
              const apiDate = value.date;
              const d = new Date(apiDate + 'T00:00:00.000-05:00');
              const day = weekday[d.getDay()];
              const weatherIcon = icon[value.weathercode];
              const schedDate = () => {
                addDate(d);
                setDateToAdd(apiDate);
                setShowScheduleToast(true);
              };

              return (
                <div key={apiDate} className={`carousel-item ${index === 0 ? 'active' : ''}`}>
                  <div className={'card text-center'}>
                    <div className="card-body text-center">
                      <div className="container">
                        <div className="row align-items-center gx-4">
                          <div className="col text-end">
                            <i className={weatherIcon} style={{ fontSize: '100px' }}></i>
                          </div>
                          <div className="col text-start gx-1">
                            <h1 className="my-0">{index === 0 ? 'Today' : day}</h1>
                            <p className="text-body-secondary my-0">
                              <small>{apiDate}</small>
                            </p>
                            <h1 className="fw-bold my-0">{value.temperature}°F</h1>
                          </div>
                        </div>
                      </div>
                      <div style={{ display: 'inline-block', textAlign: 'left' }}>
                        <table className="table">
                          <tbody>
                            <tr>
                              <td>Humidity</td>
                              <td className="text-end fw-bold">{value.humidity}%</td>
                            </tr>
                            <tr>
                              <td>Wind</td>
                              <td className="text-end fw-bold">{value.wind} mph</td>
                            </tr>
                            <tr>
                              <td>Rain Chance</td>
                              <td className="text-end fw-bold">{value.precipitation}%</td>
                            </tr>
                            <tr>
                              <td>Condition</td>
                              <td className="text-end fw-bold">{value.weathercode}</td>
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
                          <Button type="button" onClick={schedDate}>
                            Schedule Date
                          </Button>
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
            data-bs-theme="primary"
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
            {weatherData.map((value, index) => {
              const d = new Date(value.date + 'T00:00:00.000-05:00');
              let day = weekday[d.getDay()];
              const judge = {
                kms: 'this is not peak',
                'this is peak piko weather': 'this is peak',
              };
              const scheduled = dupe(d);

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
                    variant={`${value.judgement !== 'kms' ? 'success' : ''}`}
                  >
                    <b>
                      {index === 0 ? 'Today' : day}{' '}
                      {scheduled ? <i className="bi bi-calendar-check"></i> : ''}
                    </b>
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

function ScheduleToast({
  dateRequested,
  showScheduleToast,
  setShowScheduleToast,
  undoDate,
  dateToAdd,
}) {
  const undoSchedDate = () => {
    undoDate(dateToAdd);
    setShowScheduleToast(false);
  };
  return (
    <ToastContainer className="position-fixed p-3" position="bottom-end">
      <Toast
        style={{ backgroundColor: 'rgba(33, 37, 41, 1)' }}
        onClose={() => setShowScheduleToast(false)}
        show={showScheduleToast}
        delay={6000}
        autohide
      >
        <Toast.Header>
          <strong className="me-auto">
            {dateRequested === 'success' ? 'Date scheduled' : 'Date already scheduled'}
          </strong>
        </Toast.Header>
        <Toast.Body style={{ whiteSpace: 'nowrap' }}>
          {dateRequested === 'success' ? (
            <div>
              <p>
                The date &apos;<b>{dateToAdd}</b>&apos; was added to the schedule!
              </p>
              <div>
                <Button className="mx-1" onClick={undoSchedDate}>
                  Undo
                </Button>
                <Button className="mx-1" href="/schedule">
                  Go to schedule <i className="bi bi-caret-right-fill"></i>
                </Button>
              </div>
            </div>
          ) : (
            <div>
              <p>This date is already scheduled.</p>
              <Button className="mx-1" href="/schedule">
                Go to schedule <i className="bi bi-caret-right-fill"></i>
              </Button>
            </div>
          )}
        </Toast.Body>
      </Toast>
    </ToastContainer>
  );
}

// (icons) https://icons.getbootstrap.com/
// (weather icons) https://icons.qweather.com/en/
