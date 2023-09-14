// "https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=0&longitude=0"
import styles from "./Form.module.css";
import { useEffect, useReducer } from "react";
import { useUrlLocation } from "../hooks/useUrlLocation";

import Button from "./Button";
import ButtonBack from "./ButtonBack";
import Spinner from "./Spinner";
import Message from "./Message";

export function convertToEmoji(countryCode) {
  const codePoints = countryCode
    .toUpperCase()
    .split("")
    .map((char) => 127397 + char.charCodeAt());
  return String.fromCodePoint(...codePoints);
}

const BASE_URL = "https://api.bigdatacloud.net/data/reverse-geocode-client";

const initialState = {
  cityName: "",
  country: "",
  date: new Date(),
  notes: "",
  error: "",
  emoji: "",
  isLoading: true,
};

const reducer = (state, action) => {
  switch (action.type) {
    case "start":
      return { ...state, isLoading: true, error: "" };
    case "dataRecieved":
      const data = action.payload;
      return {
        ...state,
        cityName: data.city || data.locality || "",
        country: data.countryName,
        emoji: convertToEmoji(data.countryCode),
      };
    case "error":
      return { ...state, error: action.payload };

    case "finished":
      return { ...state, isLoading: false };

    case "setCity":
      return { ...state, cityName: action.payload };
    case "setDate":
      return { ...state, date: action.payload };
    case "setNotes":
      return { ...state, notes: action.payload };
    default:
      throw new Error("Invalid action");
  }
};

function Form() {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [lat, lng] = useUrlLocation();

  const { cityName, country, date, notes, isLoading, error, emoji } = state;

  useEffect(() => {
    const fetchCityData = async () => {
      try {
        dispatch({ type: "start" });

        const res = await fetch(`${BASE_URL}?latitude=${lat}&longitude=${lng}`);
        const data = await res.json();
        console.log(data.countryCode);
        if (!data.countryCode)
          throw new Error(
            "That doesn't seem to be a city, Click somewhere else!"
          );

        dispatch({ type: "dataRecieved", payload: data });
      } catch (e) {
        dispatch({ type: "error", payload: e.message });
      } finally {
        dispatch({ type: "finished" });
      }
    };
    fetchCityData();
  }, [lat, lng]);

  if (isLoading) return <Spinner />;
  if (error) return <Message message={error} />;

  return (
    <form className={styles.form}>
      <div className={styles.row}>
        <label htmlFor="cityName">City name</label>
        <input
          id="cityName"
          onChange={(e) =>
            dispatch({ type: "setCity", payload: e.target.value })
          }
          value={cityName}
        />
        <span className={styles.flag}>{emoji}</span>
      </div>

      <div className={styles.row}>
        <label htmlFor="date">When did you go to {cityName}?</label>
        <input
          id="date"
          onChange={(e) =>
            dispatch({ type: "setDate", payload: e.target.value })
          }
          value={date}
        />
      </div>

      <div className={styles.row}>
        <label htmlFor="notes">Notes about your trip to {cityName}</label>
        <textarea
          id="notes"
          onChange={(e) =>
            dispatch({ type: "setNotes", payload: e.target.value })
          }
          value={notes}
        />
      </div>

      <div className={styles.buttons}>
        <Button type="primary">Add</Button>
        <ButtonBack />
      </div>
    </form>
  );
}

export default Form;
