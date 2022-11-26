import React from "react";
import "./FeaturedMovie.css";

type ItemProps = {
  first_air_date: Date,
  genres: any,
  overview: String,
  original_name: String,
  backdrop_path: String,
  vote_average: number,
  number_of_seasons: number,
  homepage: string;
}

type FeaturedProps ={
  item: ItemProps;
}

export default ({ item }: FeaturedProps) => {
  console.log(item)
  let firstDate = new Date(item.first_air_date);
  let genres = [] as any;
  for (let i in item.genres) {
    genres.push(item?.genres[i].name);
  }
console.log(item)
  let description = item.overview;
  if (description?.length > 200) {
    description = description.substring(0, 200) + "...";
  }

  return (
    <section
      className="featured"
      style={{
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundImage: `url(https://image.tmdb.org/t/p/original${item.backdrop_path})`,
      }}
    >
      <div className="featured--vertical">
        <div className="featured--horizontal">
          <div className="featured--name">{item.original_name}</div>
          <div className="featured--info">
            <div className="featured--points">{item.vote_average} pontos</div>
            <div className="featured--year">{firstDate.getFullYear()}</div>
            <div className="featured--seasons">
              {item.number_of_seasons} temporada
              {item.number_of_seasons !== 1 ? "s" : ``}
            </div>
          </div>
          <div className="featured--description">{description}</div>
          <div className="featured--buttons">
            <a href={item.homepage} target="_blank" className="featured--watchbutton">
              ► Assistir
            </a>
          </div>
          <div className="featured--genres">
            <strong>Gêneros:</strong> {genres.join(", ")}
          </div>
        </div>
      </div>
    </section>
  );
};
