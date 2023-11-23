import CityItem from "./CityItem";
import styles from "./CityList.module.css";
import Spinner from "./Spinner";
import Message from "./Message";
import { useCity } from "../contexts/CitiesContext";

function CityList() {
  const { cities, loading } = useCity();
  if (loading) return <Spinner />;
  if (!cities.length)
    return <Message message="Please add a city by clicking on a map" />;
  return (
    <ul className={styles.cityList}>
      {cities.map((city) => (
        <CityItem city={city} key={city.id} />
      ))}
    </ul>
  );
}

export default CityList;
