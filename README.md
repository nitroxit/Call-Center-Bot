# Call Center Bot

### Functional Call Center Bot to Report Issues

_For a more detailed walkthorugh, see the [companion blog post here](https://developer.webex.com/blog/from-zero-to-webex-teams-chatbot-in-15-minutes)_

This is a fairly simple webex bot featuring the webex bot framework, which sends the user a form to submit issue reports they experience during phone calls to their team leads. The bot also features logging to mongodb, which can either be viewed via mongodb compass or via the build in webpage which lists out the logs.

## Prerequisites:

- [ ] node.js (v. 16.16.0)

- [ ] [Sign up for Webex Developer Account](https://developer.webex.com/signup)

---

## Steps to get the bot working

1. Create a Webex bot (save the API access token and username): https://developer.webex.com/my-apps/new/bot

2. Create a `.env` file

3. Edit `.env` with the following values:

- BOTTOKEN="Your bot token from step 1 here"
- PORT=7001 ( This can be changed to your preference)

4. Turn on your bot server with `npm start`

5. Create a space in Webex

6. Add the bot (by its username) to the space in Webex
