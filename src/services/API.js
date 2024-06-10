import axiosInstance from "./request";

const getCityName = async (location) => {
  try {
    const result = await axiosInstance.get(
      `https://api.opencagedata.com/geocode/v1/json?q=${location.latitude}+${location.longitude}&key=${process.env.REACT_APP_GEOLOCATION_API_KEY}`
    );

    if (result.status == 200) {
      await getCurrentWeather(result.data?.results?.[0]?.components?.city);
      await getDailyWeather(result.data?.results?.[0]?.components?.city);
    } else {
      throw new Error("API erroe");
    }
  } catch (error) {
    console.warn("ERROR in getCityName", error);
  }
};
const getCurrentWeather = async (city) => {
  try {
    const result = await axiosInstance.get(
      `${process.env.REACT_APP_SERVER_URL}/weather?q=${city}&appid=${process.env.REACT_APP_API_KEY}`
    );

    if (result.status == 200) {
      // return result.data;
      console.log("getCurrentWeather", result.data.main);
    } else {
      throw new Error("API erroe");
    }
  } catch (error) {
    console.warn("ERROR in getCurrentWeather", error);
  }
};
const getDailyWeather = async (city) => {
  try {
    const result = await axiosInstance.get(
      `${process.env.REACT_APP_SERVER_URL}/forecast?q=${city}&appid=${process.env.REACT_APP_API_KEY}`
    );

    if (result.status == 200) {
      // return result.data;
      console.log("getDailyWeather", result.data.list);
    } else {
      throw new Error("API erroe");
    }
  } catch (error) {
    console.warn("ERROR in getDailyWeather", error);
  }
};

export { getCityName, getCurrentWeather, getDailyWeather };
