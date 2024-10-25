async function getData() {
  const res = await fetch('http://localhost:3000/api/weather', { cache: 'no-cache' });

  if (!res.ok) {
    console.log(await res.text());
    throw new Error('bruhmoji');
  }

  return res.json();
}

export default async function Home() {
  const data = await getData();

  return (
    <div>
      <h1 className='display-1' style={{ textAlign: "center", padding: "auto", margin: "auto", marginTop: "5%" }}>PikoWeatherer</h1>
      <br />
      <div style={{ textAlign: "center" }}>
        <WeatherData apiData={data} />
      </div>
      <br />
      <div style={{ textAlign: "center" }}>
        <a className="btn btn-primary" href="/score">Play Now!</a>
      </div>
    </div>);
}

// Component
function WeatherData({ apiData }) {
  // const currentDate = new Date().toJSON().slice(0, 10);

  const todayData = apiData[0];
  // do somethign special for `todayData`
  const future = apiData.slice(1, 7);

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
      {/* carousel */}
      <div className="container-sm">
        <div id="weatherCarousel" className="carousel slide">
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
                <div className='row' >
                  <div className='col' >
                    <div className='card' style={{ textAlign: "center" }}>
                      <i className={todayWIcon} style={{ fontSize: "150px" }}></i>
                      <div className='card-body' style={{ textAlign: "center" }}>
                        <div style={{ display: "inline-block", textAlign: "left" }}>
                          <h5><b>Today</b></h5>
                          <p className='card-title'><small className='text-body-secondary'>{todayData.date}</small></p>
                          <li className='card-text'>Temperature: {todayData.temperature}°F</li>
                          <li className='card-text'>Humidity: {todayData.humidity}%</li>
                          <li className='card-text'>Wind: {todayData.wind} mph</li>
                          <li className='card-text'>Rain Chance: {todayData.precipitation}%</li>
                          <li className='card-text'>Weather Condition: {todayData.weathercode}</li>
                        </div>
                      </div>
                      <div className='card-footer' style={{ textAlign: "center" }}>
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
              let weekday = {
                0: 'Monday', 1: 'Tuesday', 2: 'Wednesday', 3: 'Thursday', 4: 'Friday', 5: 'Saturday', 6: 'Sunday'
              };

              let apiDate = value.date;
              const d = new Date(apiDate);
              let day = weekday[d.getDay()];
              let weatherIcon = icon[value.weathercode];

              return (
                <div key={apiDate} className="carousel-item">
                  <div className='card' style={{ textAlign: "center" }}>
                    <i className={weatherIcon} style={{ fontSize: "150px" }}></i>
                    <div className='card-body' style={{ textAlign: "center" }}>
                      <div style={{ display: "inline-block", textAlign: "left" }}>
                        <h5><b>{day}</b></h5>
                        <p className='card-title'><small className='text-body-secondary'>{apiDate}</small></p>
                        <li className='card-text'>Temperature: {value.temperature}°F</li>
                        <li className='card-text'>Humidity: {value.humidity}%</li>
                        <li className='card-text'>Wind: {value.wind} mph</li>
                        <li className='card-text'>Rain Chance: {value.precipitation}%</li>
                        <li className='card-text'>Weather Condition: {value.weathercode}</li>
                      </div>
                    </div>
                    <div className='card-footer' style={{ textAlign: "center" }}>
                      <div className='row'>
                        <p className='card-text'>Judgement: <b>{value.judgement}</b></p>
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

      {/* <div className='container-fluid'>
        <div className='row justify-content-center'>
          <div className='col-sm-2'>
            <div className='card'>
              <div className='card-body'>
                <h5><b>Today</b></h5>
                <p className='card-title'><small className='text-body-secondary'>{todayData.date}</small></p>
                <li className='card-text'>Temperature: {todayData.temperature}°</li>
                <li className='card-text'>Humidity: {todayData.humidity}%</li>
                <li className='card-text'>Wind: {todayData.wind} mph</li>
                <li className='card-text'>Rain Chance: {todayData.precipitation}%</li>
                <li className='card-text'>Weather Condition: {todayData.weathercode}</li>
              </div>
              <div className='card-footer'>
                <div className='row justify-content-end'>
                  <p className='card-text'>Judgement: <b>{todayData.judgement}</b></p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div> */}

      {/* <div className='card-group'>
        {future.map((value) => {
          let weekday = {
            0: 'Monday', 1: 'Tuesday', 2: 'Wednesday', 3: 'Thursday', 4: 'Friday', 5: 'Saturday', 6: 'Sunday'
          };

          let apiDate = value.date;
          const d = new Date(apiDate);
          let day = weekday[d.getDay()];
          // if (apiDate === currentDate) {
          //   apiDate = 'Today';
          // }

          return (
            <div key={apiDate} className='card'>
              <div className='card-body'>
                <h5><b>{day}</b></h5>
                <p className='card-title'><small className='text-body-secondary'>{apiDate}</small></p>
                <li className='card-text'>Temperature: {value.temperature}°</li>
                <li className='card-text'>Humidity: {value.humidity}%</li>
                <li className='card-text'>Wind: {value.wind} mph</li>
                <li className='card-text'>Rain Chance: {value.precipitation}%</li>
                <li className='card-text'>Weather Condition: {value.weathercode}</li>
              </div>
              <div className='card-footer'>
                <div className='row justify-content-end'>
                  <p className='card-text'>Judgement: <b>{value.judgement}</b></p>
                </div>
              </div>
            </div>
          );
        })}
      </div> */}
    </>
  );
}