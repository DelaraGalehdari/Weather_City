import React, { useState, useEffect } from "react";
import ShowData from "./ShowData";
import axios from "axios";
import "../Css/Search.css";
import moment from "moment-timezone";

const Search = ({ handleChange }) => {
  const [city, setCity] = useState("");
  const [tz, setTz] = useState();
  const [imgIcon, setImgIcon] = useState("");
  const [isAlert, setIsAlert] = useState(false);
  const [weatherInfo, setWeatherInfo] = useState({
    sunrise: "",
    sunset: "",
    timeCity: "",
    temp: "",
    image: "",
  });

  const fetch = async (city) => {
    try {
      setIsAlert(false);
      const response = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=328ba4f65c725659172a0a02432e7357`
      );

      setWeatherInfo((weatherInfo.sunrise = response.data.sys.sunrise));
      setWeatherInfo((weatherInfo.sunset = response.data.sys.sunset));
      setWeatherInfo(
        (weatherInfo.temp = Math.round(response.data.main.temp - 273.15) + `°c`)
      );
      setWeatherInfo((weatherInfo.image = response.data.weather[0].icon));
      setWeatherInfo((weatherInfo.timeCity = response.data.dt));

      const lat = response.data.coord.lat;
      const lon = response.data.coord.lon;

      //fetch data from api for getting timezone
      const responseLat = await axios.get(
        `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=hourly,daily&appid=328ba4f65c725659172a0a02432e7357`
      );
      setTz(responseLat.data.timezone);

      const time = moment.tz(moment(), responseLat.data.timezone).format();

      let TimeCon = Math.round(Date.parse(time)) / 1000;
      setWeatherInfo({ ...weatherInfo, timeCity: TimeCon });
    } catch (error) {
      console.log("err", error);
      setIsAlert(true);
      setTimeout(() => {
        document.getElementById("alertDiv").style.display = "none";
      }, 3000);

      setCity("");
      setWeatherInfo({});
    }
  };
  //getting image
  useEffect(() => {
    try {
      if (weatherInfo.image !== "") {
        let ul = `https://openweathermap.org/img/wn/${weatherInfo.image}@2x.png`;
        setImgIcon(ul);
      }
    } catch (error) {
      console.log("err", error);
    }
  }, [weatherInfo.image]);

  // to send data to App component
  useEffect(() => {
    console.warn = () => {};
    if (weatherInfo.timeCity === "") {
      handleChange("day");
    } else if (
      weatherInfo.timeCity >= weatherInfo.sunrise &&
      weatherInfo.timeCity < weatherInfo.sunset
    ) {
      handleChange("day");
    } else {
      handleChange("night");
    }
  }, [
    weatherInfo.timeCity,
    weatherInfo.sunrise,
    weatherInfo.sunset,
    handleChange,
  ]);

  // to set the city state on user input
  const addCity = (e) => {
    setCity(e.target.value);
  };

  //to close alert pop-up
  const closeAlert = () => {
    document.getElementById("alertDiv").style.display = "none";
  };
  const enterPressed = (event) => {
    var code = event.keyCode || event.which;
    if (code === 13) {
      fetch(city);
    }
  };

  return (
    <div className="search-container">
      {isAlert ? (
        <div className="alert" id="alertDiv">
          <span className="closebutton" onClick={() => closeAlert()}>
            &times;
          </span>
          <strong>Alert!</strong> Please enter a valid city!
        </div>
      ) : (
        ""
      )}

      <div className="search-city">
        <input
          className="search"
          type="text"
          placeholder="City..."
          value={city}
          onChange={(e) => addCity(e)}
          onKeyPress={enterPressed.bind()}
        />
        <button onClick={() => fetch(city)}>search</button>
      </div>
      {!isAlert ? (
        <ShowData icon={imgIcon} weatherInfo={weatherInfo} tz={tz} />
      ) : (
        ""
      )}
    </div>
  );
};
export default Search;
