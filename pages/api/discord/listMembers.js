import axios from "axios";

const BASE_URL = "https://discordapp.com";

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { botToken, guildId } = req.body;

    const { data } = await axios
      .get(`${BASE_URL}/api/guilds/${guildId}/members`, {
        headers: { Authorization: `Bot ${botToken}` },
        params: {
          limit: 100
        }
      })
      .catch((err) => {
        console.log(err);
      });

    const members = data.map(({ nick, user }) => {
      return {
        nick,
        user
      };
    });
    console.log(members);

    res.status(200).json(members);
  } else {
    res.status(405).end();
  }
}
