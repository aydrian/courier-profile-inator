import Twitter from "twitter-lite";
const client = new Twitter({
  consumer_key: process.env.TWITTER_CONSUMER_KEY,
  consumer_secret: process.env.TWITER_CONSUMER_SECRET
});

export default async function handler(req, res) {
  const { oauth_token, oauth_token_secret } = await client.getRequestToken(
    "https://courier-profile-inator.netlify.app/api/twitter/callback"
  );

  res.redirect(
    `https://api.twitter.com/oauth/authenticate?oauth_token=${oauth_token}`
  );
}
