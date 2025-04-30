import { https } from "../helpers/https";

export async function getGeneratedTrip(prompt) {
  try {
    const { data } = await https.get(
      `/trips?prompt=${encodeURIComponent(prompt)}`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
      }
    );
    return data.result;
  } catch (error) {
    console.log(error);
  }
}

export async function getPlacesTrip(prompt) {
  try {
    const { data } = await https.get(`/places?query=${prompt}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
      },
    });
    return data;
  } catch (error) {
    console.log(error);
  }
}
