import PropTypes from "react";
import styles from "./CountryItem.module.css";

CountryItem.propTypes = {
  country: PropTypes.object,
};

function CountryItem({ country }) {
  return (
    <li className={styles.countryItem}>
      <span>{country.emoji}</span>
      <span>{country.country}</span>
    </li>
  );
}

export default CountryItem;
