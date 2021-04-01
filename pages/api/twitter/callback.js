import Twitter from "twitter-lite";
const client = new Twitter({
  consumer_key: process.env.TWITTER_CONSUMER_KEY,
  consumer_secret: process.env.TWITER_CONSUMER_SECRET
});

export default async function handler(req, res) {
  const { oauth_token, oauth_verifier } = req.query;

  const response = await client.getAccessToken({
    oauth_verifier,
    oauth_token
  });

  const result = {
    oauth_token: response.oauth_token,
    oauth_token_secret: response.oauth_token_secret,
    user_id: response.user_id,
    handle: response.screen_name
  };
  console.log(result);
  res.redirect(
    `/twitter?oauth_token=${result.oauth_token}&oauth_token_secret=${result.oauth_token_secret}&user_id=${result.user_id}&handle=${result.handle}`
  );
}
