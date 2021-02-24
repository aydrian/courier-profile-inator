import { CourierClient } from "@trycourier/courier";

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { authToken, recipientId, profile } = req.body;

    const client = CourierClient({ authorizationToken: authToken });

    await client
      .mergeProfile({
        recipientId,
        profile
      })
      .catch((ex) => {
        console.log(ex);
        res.status(500).end();
      });

    const { profile: mergedProfile } = await client
      .getProfile({
        recipientId
      })
      .catch((ex) => {
        console.log(ex);
        res.status(500).end();
      });

    res.status(200).json({ recipientId, profile: mergedProfile });
  } else {
    res.status(405).end();
  }
}
