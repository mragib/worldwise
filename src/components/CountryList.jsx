import CountryItem from "./CountryItem";
import Spinner from "./Spinner";
import Message from "./Message";
import styles from "./CountryList.module.css";
import { useCity } from "../contexts/CitiesContext";

function CountryList() {
  const { cities, loading } = useCity();
  const countries = cities.reduce((arr, cur) => {
    if (!arr.map((el) => el.country).includes(cur.country))
      return [...arr, { country: cur.country, emoji: cur.emoji }];
    else return arr;
  }, []);

  if (loading) return <Spinner />;
  if (!cities.length)
    return <Message message="Please add a city by clicking on a map" />;
  return (
    <ul className={styles.countryList}>
      {countries.map((country, index) => (
        <CountryItem country={country} key={index} />
      ))}
    </ul>
  );
}

export default CountryList;
