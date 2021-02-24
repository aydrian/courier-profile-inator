import axios from "axios";

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { authToken } = req.body;

    const { status, data } = await axios.post(
      `https://api.courier.com/debug`,
      {},
      {
        headers: { Authorization: `Bearer ${authToken}` }
      }
    );

    if (status !== 200) {
      res.status(401).end();
    } else {
      res.status(200).json(data);
    }
  } else {
    res.status(405).end();
  }
}
