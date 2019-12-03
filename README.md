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
