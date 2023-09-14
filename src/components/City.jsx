import { useParams, useSearchParams } from "react-router-dom";
import styles from "./City.module.css";
import { useEffect, useState } from "react";
import { useCities } from "../contexts/CitiesContext";

const formatDate = (date) =>
  new Intl.DateTimeFormat("en", {
    day: "numeric",
    month: "long",
    year: "numeric",
    weekday: "long",
  }).format(new Date(date));

function City() {
  const { cities } = useCities();
  const { id } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();

  const lat = searchParams.get("lat");
  const lng = searchParams.get("lng");
  const currentCity = cities.find((city) => city.id == id) || [];
  const { cityName, emoji, date, notes } = currentCity;

  return (
    <>
      <h1>
        {cityName} {emoji}
      </h1>
      {lat} , {lng}
    </>
  );
}

export default City;
