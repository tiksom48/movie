import React, { useEffect, useState } from "react";
import "./App.css";
import tmdb from "./tmdb";
import MovieRow from "./components/MovieRow";
import FeaturedMovie from "./components/FeaturedMovie";
import Header from "./components/Header";
import Modal from "react-modal";
import CloseIcon from "@mui/icons-material/Close";

const customStyles = {
  content: {
    marginTop: 100,
    backgroundColor: "#111",
    padding: 36,
  },
};

export default () => {
  const [movieList, setMovieList] = useState([]);
  const [featuredData, setFeaturedData] = useState(null);
  const [blackHeader, setBlackHeader] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [movieSelected, setMovieSelected] = useState({});
  const [searchItem, setSearchItem] = useState(null);
  const [resultSearch, setResultSearch] = useState(null);

  const handleModal = () => {
    setIsOpen(!isOpen);
  };

  const handleSelectedMovie = async (item) => {
    await tmdb
      .getMovieInfo(item.id, "movie")
      .then((res) => setMovieSelected(res));
  };

  useEffect(() => {
    const loadAll = async () => {
      //Pegando a lista TOTAL
      let list = await tmdb.getHomeList();
      setMovieList(list);

      //Pegando o Featured
      let originals = list.filter((i) => i.slug === "originals");
      let randomChosen = Math.floor(
        Math.random() * (originals[0].items.results.length - 1)
      );
      let chosen = originals[0].items.results[randomChosen];
      let chosenInfo = await tmdb.getMovieInfo(chosen.id, "tv");
      if (!chosenInfo.backdrop_path) loadAll();
      setFeaturedData(chosenInfo);
    };

    loadAll();
  }, []);

  useEffect(() => {
    const scrollListener = () => {
      if (window.scrollY > 10) {
        setBlackHeader(true);
      } else {
        setBlackHeader(false);
      }
    };

    window.addEventListener("scroll", scrollListener);
    return () => {
      window.removeEventListener("scroll", scrollListener);
    };
  }, []);

  useEffect(() => {
    if (movieSelected?.id) {
      console.log(movieSelected);
      handleModal();
    }
  }, [movieSelected]);

  useEffect(() => {
    if (searchItem?.length > 2) {
      setTimeout(() => {
        const endpoint = `https://api.themoviedb.org/3/search/movie?api_key=4eefae54393dcb3c2ed71eca814368c5&language=en-US&query=${encodeURIComponent(
          searchItem
        )}`;

        fetch(endpoint)
          .then((response) => response.json())
          .then((json) => {
            // API doesn't actually throw an error if no API key
            if (!json?.results) {
              throw new Error(json?.statusMessage ?? "Error");
            }
            setResultSearch(json.results);
            // replace state on page 1 of a new search
            // otherwise append to exisiting
          })
          .catch((error) => console.error("Error:", error));
      }, 500);
    } else {
      setResultSearch({});
    }
  }, [searchItem]);

  return (
    <div className="page">
      <Header black={blackHeader} setSearchItem={setSearchItem} />

      {featuredData && <FeaturedMovie item={featuredData} />}

      <section className="lists">
        {resultSearch?.length ? (
          <MovieRow
            title={"Resultado da pesquisa"}
            items={{ results: resultSearch }}
            handleModal={handleModal}
            handleSelectedMovie={handleSelectedMovie}
          />
        ) : (
          movieList.map((item, itemMovie, key) => (
            <MovieRow
              key={key}
              title={item.title}
              items={item.items}
              handleModal={handleModal}
              handleSelectedMovie={handleSelectedMovie}
            />
          ))
        )}
      </section>
      <footer>
        Projeto desenvolvido por{" "}
        <a href="https://www.linkedin.com/in/jonathanpatrich/">
          Jonathan Patrich
        </a>
      </footer>

      {movieList.length <= 0 && (
        <div className="loading">
          <img
            src="https://media.tenor.com/9CqTZoKN-KsAAAAC/loading-windows.gif"
            alt="Carregando"
          />
        </div>
      )}
      <Modal
        isOpen={isOpen}
        onRequestClose={handleModal}
        onAfterClose={() => {
          setMovieSelected({});
        }}
        style={customStyles}
      >
        <div class="closeBtn">
          <button class="btnCloseModal" onClick={handleModal}>
            <CloseIcon />
          </button>
        </div>
        {movieSelected?.id ? (
          <div class="containerMovie">
            <section class="sectionItems">
              <div class="poster_wrapper true">
                <div class="poster">
                  <div class="image_content backdrop">
                    <img
                      src={`https://image.tmdb.org/t/p//w300_and_h450_bestv2${movieSelected.poster_path}`}
                      alt={movieSelected.original_title}
                    />
                  </div>
                </div>
              </div>

              <div class="header_poster_wrapper true">
                <section>
                  <div
                    class="title ott_true"
                    style={{ margin: 36, color: "white" }}
                  >
                    <h2>
                      {movieSelected.title}
                      <span> ({movieSelected.release_date.split("-")[0]})</span>
                    </h2>

                    <div class="facts">
                      {movieSelected.genres.map((item, index) => {
                        return (
                          <span>
                            {index !== 0 ? ", " : ""}
                            {item.name}
                          </span>
                        );
                      })}
                      <span> ● {movieSelected.runtime}m</span>
                    </div>

                    <div class="avaliations" style={{ marginTop: 22 }}>
                      Avaliação dos usuários{" "}
                      <span>
                        {movieSelected.vote_average.toFixed(2)} Pontos
                      </span>
                    </div>

                    <div class="tagline" style={{ marginTop: 22 }}>
                      "{movieSelected.tagline}"
                    </div>

                    <div class="sinopse" style={{ marginTop: 22 }}>
                      <h3>Sinopse</h3>
                      <p>{movieSelected.overview}</p>
                    </div>
                  </div>
                </section>
              </div>
            </section>
            <div class="companies">
              <h2>Produzido por</h2>
              {movieSelected.production_companies.map((item, index) => {
                return (
                  <span>
                    {index !== 0 ? ", " : ""}
                    {item.name}
                  </span>
                );
              })}
            </div>
          </div>
        ) : (
          <div className="loading">
            <img
              src="https://media.tenor.com/9CqTZoKN-KsAAAAC/loading-windows.gif"
              alt="Carregando"
              id="imgModal"
            />
          </div>
        )}
      </Modal>
    </div>
  );
};
