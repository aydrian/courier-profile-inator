import { CourierClient } from "@trycourier/courier";

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { authToken, recipientId, lists } = req.body;

    const client = CourierClient({ authorizationToken: authToken });

    for (let list of lists) {
      await client.lists.subscribe(list, recipientId).catch((ex) => {
        console.log(`Could not subscribe ${recipientId} to ${list}: `, ex);
      });
    }

    res.status(204).end();
  } else {
    res.status(405).end();
  }
}
