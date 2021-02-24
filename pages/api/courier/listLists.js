import { CourierClient } from "@trycourier/courier";

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { authToken } = req.body;

    const client = CourierClient({ authorizationToken: authToken });

    const { items } = await client.lists.list().catch((ex) => {
      console.log(ex);
      res.status(500).end();
    });

    res.status(200).json(items);
  } else {
    res.status(405).end();
  }
}
