async function getData() {
  const res = await fetch('http://localhost:3000/api/weather', { cache: "no-cache" })

  if (!res.ok) {
    console.log(await res.text())
    throw new Error('bruhmoji')
  }

  return res.json()
}

export default async function Home() {
  const data = await getData()

  return (
    <div>
      <h1 className="title">PikoWeatherer</h1>
      <br />
      <div>
        <WeatherData apiData={data} />
      </div>
    </div>);
}

// Component
function WeatherData({ apiData }) {
  // const currentDate = new Date().toJSON().slice(0, 10);

  const todayData = apiData[0]
  // do somethign special for `todayData`
  const future = apiData.slice(1, 7)

  return (
    <>
      <div className="row justify-content-center">
        <div className="col-sm-2">
          <div className="card">
            <div className="card-body">
              <h2><b>Today</b><i className="qi-100"></i></h2>
              <p className="card-title"><small className="text-body-secondary">{todayData.date}</small></p>
              <li className="card-text">Temperature: {todayData.temperature}°</li>
              <li className="card-text">Humidity: {todayData.humidity}%</li>
              <li className="card-text">Wind: {todayData.wind} mph</li>
              <li className="card-text">Rain Chance: {todayData.precipitation}%</li>
              <li className="card-text">Weather Condition: {todayData.weathercode}</li>
            </div>
            <div className="card-footer">
              <div className="row justify-content-end">
                <p className="card-text">Judgement: <b>{todayData.judgement}</b></p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <br />

      <div className="card-group">
        {future.map((value) => {
          let weekday = {
            0: "Monday", 1: "Tuesday", 2: "Wednesday", 3: "Thursday", 4: "Friday", 5: "Saturday", 6: "Sunday"
          }

          let apiDate = value.date;
          const d = new Date(apiDate)
          let day = weekday[d.getDay()]
          // if (apiDate === currentDate) {
          //   apiDate = "Today";
          // }

          return (
            <div key={apiDate} className="card">
              {/* <img src="..." class="card-img-top" alt="..."></img> */}
              <div className="card-body">
                <h2><b>{day}</b></h2>
                <p className="card-title"><small className="text-body-secondary">{apiDate}</small></p>
                <li className="card-text">Temperature: {value.temperature}°</li>
                <li className="card-text">Humidity: {value.humidity}%</li>
                <li className="card-text">Wind: {value.wind} mph</li>
                <li className="card-text">Rain Chance: {value.precipitation}%</li>
                <li className="card-text">Weather Condition: {value.weathercode}</li>
              </div>
              <div className="card-footer">
                <div className="row justify-content-end">
                  <p className="card-text">Judgement: <b>{value.judgement}</b></p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </>
  )
}