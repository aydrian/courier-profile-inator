import axios from "axios";

const BASE_URL = "https://discordapp.com";

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { botToken, guildId } = req.body;

    const channels = await axios
      .get(`${BASE_URL}/api/guilds/${guildId}/channels`, {
        headers: { Authorization: `Bot ${botToken}` }
      })
      .catch((err) => {
        console.log(err);
      });

    console.log(channels);

    res.status(200).json(channels.data);
  } else {
    res.status(405).end();
  }
}
