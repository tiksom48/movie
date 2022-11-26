import React from "react";
import "./Header.css";
const gifmovie = require("../../img/funmoviegif.gif")

type HeaderProps ={ 
  black: boolean,
  setSearchItem: (item: any) => void
}

export default ({ black, setSearchItem }: HeaderProps) => {
  return (
    <header className={black ? "black" : ""}>
      <div className="header--logo">
        <a href="/">
          <img src={gifmovie} alt="FunMovie" />
        </a>
      </div>

      <input
        className="search"
        type="text"
        placeholder="Pesquisa🔎"
        onChange={(e) => {
          setSearchItem(e.target.value);
        }}
      />
    </header>
  );
};
