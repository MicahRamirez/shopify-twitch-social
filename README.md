Heavily inspired by https://github.com/zeit/next.js/tree/canary/examples/custom-server-typescript

Web app for shopify admin to be used in concert with template changes...

### How to install Login With Twitch Button

LWT for shopify stores will be using the OAuth2 implicit flow. This flow gives us sufficient access in order to determine for a twitch user, how long the user has been subscribed to the store owner.

First step in onboarding a client is designing and installing the Login with Twitch button. Ideally this is as complicated as adding the twitch svg into the template's assets, creating a button around the svg, and integrating it into the stores navigation.

There could be different rulesets, like showing the twitch users icon, etc but these are good future goals.

After the oauth flow is complete, the user is redirecting back to the shopify store with an access token.

WIP:

- From here, js + liquid templates will be utilized to visually stylize exclusive merch from the streamer.
- The admin UI will determine what merch is exclusive or not.

### Authenticating the Embedded App

Install ngrok with brew.
Start an ngrok session served on the port that your website is served on (default for this proj is 3000)
Register the auth callback here, under _Whitelisted redirection URL(s)_

- Url containing the app's redirect config https://partners.shopify.com/1248838/apps/3255025/edit
- https://<NGROK_URL>/auth/callback

https://YOUR_NGROK_ADDRESS.io/auth?shop=kusora.myshopify.com
ね
