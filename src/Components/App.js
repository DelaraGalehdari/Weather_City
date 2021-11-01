import React, { useState } from "react";
import Search from "./Search";
import "../Css/App.css";
const App = () => {
  const [day, setDay] = useState("day");
  const handleChange = (val) => {
    setDay(val);
  };

  return (
    <div className={day === "day" ? "page-container" : "page-container night"}>
      <Search handleChange={handleChange} />
    </div>
  );
};
export default App;
