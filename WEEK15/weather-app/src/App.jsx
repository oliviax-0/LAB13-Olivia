import { useState } from "react";
import axios from "axios";

function App() {
  const [city, setCity] = useState("");
  const [day, setDay] = useState("");
  const [weather, setWeather] = useState(null);
  const [history, setHistory] = useState([]);
  const [selectedDay, setSelectedDay] = useState(null);
  const [selectedCity, setSelectedCity] = useState("");

  const API_KEY = "bf6f93d3e37e4bb4ad763918252011";

  const getWeather = async () => {
    if (!city) return alert("Masukkan nama kota");
    if (!day || day < 1 || day > 14)
      return alert("Masukkan jumlah hari antara 1-14");

    try {
      const response = await axios.get(
        `http://api.weatherapi.com/v1/forecast.json?key=${API_KEY}&q=${city}&days=${day}&aqi=no`
      );
      setWeather(response.data);
      setSelectedDay(null); // Reset selected day when getting new weather data
      setSelectedCity(city); // Set the selected city when getting new weather data

      // Add to history only if not already exists (distinct)
      if (!history.includes(city)) {
        setHistory((prevHistory) => [...prevHistory, city]);
      }
    } catch (err) {
      alert("Kota tidak ditemukan");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center fonts-sans">
      <h1 className="text-3xl font-semibold text-blue-600 mb-8">
        Pengecek Cuaca
      </h1>
      <div className="mb-6 flex flex-col space-y-4 w-80">
        <input
          type="text"
          placeholder="Masukkan nama kota"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <select
          value={day}
          onChange={(e) => setDay(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
        >
          <option value="">Pilih jumlah hari</option>
          {[...Array(14)].map((_, i) => (
            <option key={i + 1} value={i + 1}>
              {i + 1} hari
            </option>
          ))}
        </select>
      </div>
      <button
        onClick={getWeather}
        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none"
      >
        Cek Cuaca
      </button>
      {weather && (
        <div className="mt-8 w-full max-w-4xl">
          <h2 className="text-2xl font-semibold mb-6 text-center">
            {weather.location.name}, {weather.location.country}
          </h2>

          {/* Current Weather */}
          <div className="mb-6 p-6 bg-white rounded-md shadow-md text-center">
            <h3 className="text-xl font-semibold mb-2">Cuaca Hari Ini</h3>
            <p className="text-xl">Suhu: {weather.current.temp_c}°C</p>
            <p className="text-xl">Kondisi: {weather.current.condition.text}</p>
            <img
              src={weather.current.condition.icon}
              alt={weather.current.condition.text}
              className="mx-auto mt-4"
            />
          </div>

          {/* Forecast Days */}
          <div className="flex flex-col gap-4">
            {weather.forecast.forecastday.map((dayData, index) => (
              <div key={index}>
                <div
                  onClick={() =>
                    setSelectedDay(selectedDay === index ? null : index)
                  }
                  className={`p-4 bg-white rounded-md shadow-md text-center cursor-pointer transition-all hover:shadow-lg ${
                    selectedDay === index ? "ring-2 ring-blue-500" : ""
                  }`}
                >
                  <div className="flex items-center justify-center gap-4">
                    <div>
                      <h4 className="font-semibold mb-2">{dayData.date}</h4>
                      <img
                        src={dayData.day.condition.icon}
                        alt={dayData.day.condition.text}
                        className="mx-auto"
                      />
                    </div>
                    <div className="text-left">
                      <p className="text-sm">{dayData.day.condition.text}</p>
                      <p className="text-sm mt-2">
                        Max: {dayData.day.maxtemp_c}°C
                      </p>
                      <p className="text-sm">Min: {dayData.day.mintemp_c}°C</p>
                      <p className="text-xs text-gray-600 mt-1">
                        Hujan: {dayData.day.daily_chance_of_rain}%
                      </p>
                    </div>
                    <div className="ml-auto">
                      <p className="text-xs text-blue-600 font-semibold">
                        {selectedDay === index ? "▲" : "▼"}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Hourly Forecast - directly under the day card */}
                {selectedDay === index && (
                  <div className="mt-2 p-4 bg-gray-50 rounded-md">
                    <h4 className="text-lg font-semibold mb-3 text-center">
                      Cuaca Per Jam
                    </h4>
                    <div className="grid grid-cols-3 md:grid-cols-6 lg:grid-cols-8 gap-2 max-h-80 overflow-y-auto">
                      {dayData.hour.map((hourData, hourIndex) => (
                        <div
                          key={hourIndex}
                          className="p-2 bg-white rounded-md text-center border border-gray-200"
                        >
                          <p className="font-semibold text-xs">
                            {new Date(hourData.time).toLocaleTimeString(
                              "id-ID",
                              {
                                hour: "2-digit",
                                minute: "2-digit",
                              }
                            )}
                          </p>
                          <img
                            src={hourData.condition.icon}
                            alt={hourData.condition.text}
                            className="mx-auto w-10 h-10"
                          />
                          <p className="text-sm font-semibold">
                            {hourData.temp_c}°C
                          </p>
                          <p className="text-xs text-blue-600">
                            💧 {hourData.chance_of_rain}%
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {history.length > 0 && (
        <div className="mt-8 w-80">
          <h3 className="text-xl font-semibold mb-4">Riwayat Pencarian:</h3>
          <ul className="space-y-2">
            {history.map((item, index) => (
              <li key={index}>
                <button
                  onClick={() => {
                    setCity(item);
                    getWeather();
                  }}
                  className={`w-full text-left px-4 py-2 rounded-md transition-colors ${
                    selectedCity === item
                      ? "bg-blue-600 text-white"
                      : "bg-white text-gray-700 hover:bg-blue-100"
                  }`}
                >
                  {item}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
export default App;
