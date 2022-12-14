import React, { useEffect, useState } from "react";
import "./App.css";
import tmdb from "./tmdb";
import MovieRow from "./components/MovieRow/MovieRow";
import FeaturedMovie from "./components/FeaturedMovies/FeaturedMovie";
import Header from "./components/Header/Header";
import Modal from "react-modal";
import CloseIcon from "@mui/icons-material/Close";
import { api } from "./api/api";

const customStyles = {
  content: {
    marginTop: 100,
    backgroundColor: "#111",
    padding: 36,
  },
};

type ListProps = {
  slug: string;
  title: string;
  items: any;
}

export default () => {
  const [movieList, setMovieList] = useState<ListProps[]>([]);
  const [featuredData, setFeaturedData] = useState({} as any);
  const [blackHeader, setBlackHeader] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [movieSelected, setMovieSelected] = useState({} as any);
  const [searchItem, setSearchItem] = useState<any>(null);
  const [resultSearch, setResultSearch] = useState(null);

  const handleModal = () => {
    setIsOpen(!isOpen);
  };

  const handleSelectedMovie = async (item: any) => {
    await tmdb
      .getMovieInfo(item.id, "movie")
      .then((res: any) => setMovieSelected(res));
  };

  useEffect(() => {
    const loadAll = async () => {
      //Pegando a lista TOTAL
      let list = await tmdb.getHomeList();
      setMovieList(list);

      //Pegando o Featured
      let originals = list.filter((i) => i.slug === "originals");
      let randomChosen = Math.floor(
        Math.random() * (originals[0]?.items?.results?.length - 1)
      );
      let chosen = originals[0].items.results[randomChosen];
      let chosenInfo = await tmdb.getMovieInfo(chosen.id, "tv");
      if (!chosenInfo) loadAll();
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
    if (searchItem && searchItem?.length > 2) {
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
      setResultSearch(null);
    }
  }, [searchItem]);

  return (
    <div className="page">
      <Header black={blackHeader} setSearchItem={setSearchItem} />

      {featuredData && <FeaturedMovie item={featuredData} />}

      <section className="lists">
        {resultSearch && resultSearch != null ? (
          <MovieRow
            title={"Resultado da pesquisa"}
            items={{ results: resultSearch }}
            handleModal={handleModal}
            handleSelectedMovie={handleSelectedMovie}
          />
        ) : (
          movieList.map((item, itemMovie, key: any) => (
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

      {movieList?.length <= 0 && (
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
        <div className="closeBtn">
          <button className="btnCloseModal" onClick={handleModal}>
            <CloseIcon />
          </button>
        </div>
        {movieSelected?.id ? (
          <div className="containerMovie">
            <section className="sectionItems">
              <div className="poster_wrapper true">
                <div className="poster">
                  <div className="image_content backdrop">
                    {movieSelected?.poster_path ? (
                      <img
                        src={`https://image.tmdb.org/t/p//w300_and_h450_bestv2${movieSelected.poster_path}`}
                        alt={movieSelected.original_title}
                      />
                    ) : (
                      <img
                        src="https://anthropology.utk.edu/wp-content/uploads/2016/03/NotAvailable.jpg"
                        alt="image notfound"
                      />
                    )}
                  </div>
                </div>
              </div>

              <div className="header_poster_wrapper true">
                <section>
                  <div
                    className="title ott_true"
                    style={{ margin: 36, color: "white" }}
                  >
                    <h2>
                      {movieSelected.title}
                      <span> ({movieSelected.release_date.split("-")[0]})</span>
                    </h2>

                    <div className="facts">
                      {movieSelected.genres.map((item: any, index: string | number)  => {
                        return (
                          <span>
                            {index !== 0 ? ", " : ""}
                            {item.name}
                          </span>
                        );
                      })}
                      <span> ??? {movieSelected.runtime}m</span>
                    </div>

                    <div className="avaliations" style={{ marginTop: 22 }}>
                      Avalia????o dos usu??rios{" "}
                      <span>
                        {movieSelected.vote_average.toFixed(2)} Pontos
                      </span>
                    </div>

                    <div className="tagline" style={{ marginTop: 22 }}>
                      "{movieSelected.tagline}"
                    </div>

                    <div className="sinopse" style={{ marginTop: 22 }}>
                      <h3>Sinopse</h3>
                      <p>{movieSelected.overview}</p>
                    </div>
                  </div>
                </section>
              </div>
            </section>
            <div className="companies">
              <h2>Produzido por</h2>
              {movieSelected.production_companies.map((item: any, index: number) => {
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
