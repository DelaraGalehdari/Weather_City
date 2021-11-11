import React from "react";
import moment from "moment-timezone";

const ShowData = ({ weatherInfo, icon, tz }) => {
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
    else if (val >= weatherInfo.sunrise && val < weatherInfo.sunset) {
      a = moment.unix(weatherInfo.sunset)._d;
      return (
        "Sunset at " +
        convertTZ(a, tz).getHours() +
        ":" +
        convertTZ(a, tz).getMinutes()
      );
    } else {
      a = moment.unix(weatherInfo.sunrise)._d;

      return (
        "Sunrise at " +
        convertTZ(a, tz).getHours() +
        ":" +
        convertTZ(a, tz).getMinutes()
      );
    }
  };

  return (
    <div className="container-show">
      <div className="show-weather">
        <div className="show-temp">{weatherInfo.temp} </div>
        <div className="show-img">
          <img src={icon} alt="" />
        </div>
      </div>
      <div className="show-sun">
        <span>{calcDayOrNight(weatherInfo.timeCity)}</span>
      </div>
      <div className="timezone">{tz}</div>
    </div>
  );
};
export default ShowData;
