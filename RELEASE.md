# Releasing a new version on Twitch

## Local test

All new versions start in local test where the base URI is `https://localhost:8080/`, allowing a locally run version to be tested.

The "panel viewer path" should be `panel.html`, the "mobile viewer path" as `mobile.html`, and "video - fullscreen viewer path" as `video_overlay.html`.

Ensure that the allowlist for image domains is set to allow `https://www.alveussanctuary.org` for ambassador images, the allowlist for media domains is set to allow `https://fonts.googleapis.com/` for fonts, and that allowlist for URL fetching domains is set to include `wss://irc-ws.chat.twitch.tv:443`, `ws://irc-ws.chat.twitch.tv:80`, `irc://irc.chat.twitch.tv:6667`, `irc://irc.chat.twitch.tv:6697` to allow connecting to chat as well as `https://ext.alveus.gg` to allow fetching ambassador data.

## Hosted test

Once local testing is complete, a build can be created with `npm run build`, the files within the `build` directory compressed into a ZIP file (the files within, not folder itself), and uploaded to Twitch for testing.

With the assets hosted on Twitch, install the extension version on a test channel and verify that everything is working as expected when running from Twitch.

At this point, the commit being submitted to Twitch should be tagged via git. Do so with `git tag v<version>` if you're currently at the commit being used, or `git tag v<version> <commit>` if not. Once the tag is created, push it with `git push origin v<version>`.

## Submit for review

With the extension installed on a test channel, submit the extension for review, providing the URL for the channel to use for testing.

Include the walkthrough guide for the extension, with an updated changelog of what changed since the last version submitted:

<details>
<summary>Walkthrough guide and changelog template</summary>

```text
Note: "ambassadors" are the animals displayed in the extension (they are educational ambassadors for their species).

This extension displays information about ambassadors at Alveus Sanctuary within the Panel and Overlay view.
It is designed to be used by channels that are hosting collaboration streams at Alveus.
It allows viewers to explore more information about the ambassadors seen on the stream, at any time.
It allows the broadcaster/moderators to run chat commands to display information about specific ambassadors to everyone, as they are shown on stream.

This extension is made with React, and is bundled with Webpack.
Due to the nature (frequency and last-minute-ness) of collaboration streams, it is not tenable to maintain an access list and create new releases for each collaboration, so this is published as a global overlay.

Changelog:

    - <insert changes here>

External links:

    All links are related to Alveus Sanctuary, and can be found in the ambassador cards as well as the overlay welcome card.

    - Alveus Sanctuary website (homepage + ambassador pages)
    - Alveus Amazon Wishlist
    - Alveus Instagram
    - Alveus TikTok
    - Alveus Twitter
    - Extension GitHub (Open-source code for the extension, encouraging users to contribute to and improve the extension)

Allowlist explanations:

    - `https://fonts.googleapis.com/` Google Fonts, for loading fonts in the extension
    - `wss://irc-ws.chat.twitch.tv:443`, `ws://irc-ws.chat.twitch.tv:80`, `irc://irc.chat.twitch.tv:6667`, `irc://irc.chat.twitch.tv:6697` Twitch chat URLs, for the chatbot to connect to
    - `https://www.alveussanctuary.org` Alveus Sanctuary website, for fetching ambassador images
    - `https://ext.alveus.gg` Alveus Sanctuary website (cached API), for fetching ambassador data

Testing the Extension:

    - For overlay, mobile + panel: Click the buttons to explore the extension
    - For overlay: As a moderator or broadcaster, type `!welcome` in chat to trigger the welcome card, type `!snork` to trigger an ambassador card
```
</details>

## Release

The review process usually takes 1-2 weeks, and once approved, the extension can be released in the extension manager.
