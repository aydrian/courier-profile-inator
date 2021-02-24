import axios from "axios";

const BASE_URL = "https://discordapp.com";

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { botToken } = req.body;

    const user = await axios.get(`${BASE_URL}/api/users/@me`, {
      headers: { Authorization: `Bot ${botToken}` }
    });

    const guilds = await axios.get(`${BASE_URL}/api/users/@me/guilds`, {
      headers: { Authorization: `Bot ${botToken}` }
    });

    const { id, username, avatar } = user.data;

    res.status(200).json({
      id,
      username,
      avatar,
      guilds: guilds.data
    });
  } else {
    res.status(405).end();
  }
}
