async function getData() {
  const res = await fetch('http://localhost:3000/weather')

  if (!res.ok) {
      console.log(await res.text())
    throw new Error('bruhmoji')
  }

  return res.json()
}

export default async function Home() {
  const stinkypoopoo = await getData()

  return (<div>
    <h1>PikoWeatherer</h1>
    <WeatherData apiData={stinkypoopoo} />
  </div>);
}

// Component
function WeatherData({ apiData }) {
  return (
    <>
      {apiData.map((value) => {
        return (
          <div key={value.date}> 
            <h2>{value.date}</h2>
            <li>Temperature: {value.temperature} degrees</li>
            <li>Humidity: {value.humidity}%</li>
            <li>Wind: {value.wind} mph</li>
            <li>Rain Chance: {value.precipitation}%</li>
            <li>Cloudiness: {value.weathercode}</li>
          </div>
        );
      })}
    </>
  )
}