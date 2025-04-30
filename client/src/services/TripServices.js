import { https } from "../helpers/https";

export default async function getGeneratedTrip(prompt) {
  try {
    const { data } = await https.get(`/trips?prompt=${prompt}`);
    return data.result;
  } catch (error) {
    console.log(error);
  }
}
