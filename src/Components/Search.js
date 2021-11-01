import React, { useState, useEffect } from "react";
import axios from "axios";
import "../Css/Search.css";

import moment from "moment-timezone";

const Search = ({ handleChange }) => {
  const [city, setCity] = useState("");
  const [temp, setTemp] = useState();
  const [image, setImage] = useState("");
  const [timeCity, setTimeCity] = useState("");
  const [sunrise, setSunrise] = useState();
  const [sunset, setSunset] = useState();
  const [tz, setTz] = useState();
  const [imgIcon, setImgIcon] = useState("");
  const [isAlert, setIsAlert] = useState(false);

  const fetch = async (city) => {
    try {
      setIsAlert(false);
      const response = await axios.get(
        `http://api.openweathermap.org/data/2.5/weather?q=${city}&appid=328ba4f65c725659172a0a02432e7357`
      );
      //   console.log("data", response);
      setSunrise(response.data.sys.sunrise);
      setSunset(response.data.sys.sunset);
      setTemp(Math.round(response.data.main.temp - 273.15) + `°c`);
      setImage(response.data.weather[0].icon);
      setTimeCity(response.data.dt);

      const lat = response.data.coord.lat;
      const lon = response.data.coord.lon;

      //fetch data from api for getting timezone
      const responseLat = await axios.get(
        `http://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=hourly,daily&appid=328ba4f65c725659172a0a02432e7357`
      );
      setTz(responseLat.data.timezone);
      const time = moment.tz(moment(), responseLat.data.timezone).format();

      let TimeCon = Math.round(Date.parse(time)) / 1000;

      setTimeCity(TimeCon);
    } catch (error) {
      console.log("err", error);
      setIsAlert(true);
      setTimeout(() => {
        document.getElementById("alertDiv").style.display = "none";
      }, 3000);
      setCity("");
      setImgIcon("");
      setSunset("");
      setSunrise("");
      setTemp("");
      setTimeCity("");
    }
  };
  //getting image
  useEffect(() => {
    if (image !== "") {
      let ul = `http://openweathermap.org/img/wn/${image}@2x.png`;
      setImgIcon(ul);
    }
  }, [image]);

  const convertTZ = (date, tzString) => {
    return new Date(
      (typeof date === "string" ? new Date(date) : date).toLocaleString(
        "en-US",
        { timeZone: tzString }
      )
    );
  };

  const calcDayOrNight = (val) => {
    let a = "";
    if (val === "") return;
    else if (val >= sunrise && val < sunset) {
      a = moment.unix(sunset)._d;
      return (
        "Sunset at " +
        convertTZ(a, tz).getHours() +
        ":" +
        convertTZ(a, tz).getMinutes()
      );
    } else {
      a = moment.unix(sunrise)._d;

      return (
        "Sunrise at " +
        convertTZ(a, tz).getHours() +
        ":" +
        convertTZ(a, tz).getMinutes()
      );
    }
  };

  // to send data to App component
  useEffect(() => {
    if (timeCity === "") handleChange("day");
    else if (timeCity >= sunrise && timeCity < sunset) {
      handleChange("day");
    } else {
      handleChange("night");
    }
  }, [timeCity]);

  // to set the city state on user input
  const addCity = (e) => {
    setCity(e.target.value);
  };

  //to close alert pop-up
  const closeAlert = () => {
    document.getElementById("alertDiv").style.display = "none";
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
        />
        <button onClick={() => fetch(city)}>search</button>
      </div>
      <div className="show-weather">
        <div className="show-temp">{temp} </div>
        <div className="show-img">
          <img src={imgIcon} alt="" />
        </div>
      </div>
      <div className="show-sun">
        <span>{calcDayOrNight(timeCity)}</span>
      </div>
    </div>
  );
};
export default Search;
