import axios from "axios";

export default async function handler(req, res) {
  const API_KEY = process.env.GOOGLE_MAPS_API_KEY;
  const { lat, lng, radius } = req.query;

  if (!lat || !lng || !radius) {
    return res.status(400).json({ error: "Missing parameters" });
  }

  try {
    const url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${lng}&radius=${radius}&type=mosque&keyword=cami&key=${API_KEY}`;
    const response = await axios.get(url);
    res.status(200).json(response.data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
