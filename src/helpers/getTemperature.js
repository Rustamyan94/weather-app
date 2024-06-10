const getTemperature = (temp, format) => {
  if (format == "Fahrenheit") {
    return `${Math.floor(((temp - 273.15) * 9) / 5 + 32)}\u00B0F`;
  } else {
    return `${Math.floor(temp - 273.15)}\u00B0C`;
  }
};

export default getTemperature;
