<p align="center"><img src="assets/icon-512.png" width="96" alt="Pace"></p>

# Pace

**You work hard. Come spend a couple hours outside.**

Pace is a social wellness experience for ambitious people who want to slow down without checking out. The first ritual is a weekly sunset stand-up paddle at Jericho Beach in Vancouver, run in partnership with Jericho SUP. The activity is the front door. The people are the reason you come back.

## Live demo

**[nweinberg97.github.io/pace](https://nweinberg97.github.io/pace/)**

- Landing page: https://nweinberg97.github.io/pace/
- Straight into the member experience: https://nweinberg97.github.io/pace/#/join

> First-time setup: in the repo go to **Settings → Pages**, set **Source** to *Deploy from a branch*, branch **main**, folder **/ (root)**, and save. The link above goes live a minute later.

## What's in the prototype

**Public site**
- Hero, philosophy, the evening ritual (Meet → Paddle → Drift → Regroup → Stay a little longer), the shaka, members, summer sessions, what to expect, the Jericho SUP partnership, and the future Pace family (Studio, Heat, Away)
- Working waitlist with validation and a confirmation state

**Member experience**
- Simulated sign-in (Google, Apple, LinkedIn), a three-field profile (photo, first name, “what are you working on lately?”), and a welcome screen
- **Sessions** — tonight's paddle with weather, sunset, wind and water; who's going; book in two taps
- **Booking** — confirmation sheet, “You're in.”, attendee list, add-to-calendar (.ics), cancel, and a waitlist for full sessions
- **Session detail** — time, place, forecast, notes from the crew, prominent schedule-change notices, who's coming, the plan, what to bring
- **Announcements** — human updates from Pace and the Jericho SUP crew
- **Community** — a low-pressure board for plans, recommendations, asks and offers; post, filter, “count me in”
- **Profile** — photo, name, one line, upcoming paddles. No points, streaks, badges or followers.

All state (waitlist, profile, bookings, posts) is kept in the browser's localStorage. *Profile → Reset the demo* starts over. Members, sessions and announcements are fictional; the demo is set on a summer Thursday, August 6.

## Running locally

No build step and no dependencies.

```bash
python3 -m http.server 8000
# open http://localhost:8000
```

## Structure

```
index.html        page shell, fonts, favicon
styles.css        the whole design system
js/app.js         router, views, interactions
js/data.js        members, sessions, announcements, posts
js/store.js       local persisted state
js/icons.js       icons and the Pace mark
assets/           favicon, app icons, social image
```

## Credits

Photography from [Unsplash](https://unsplash.com) (Clark Gu, Ethan Brooke, Snow Sea, Krzysztof Kowalik, Michael Henry, Tori Nefores, Jordan Steranka and others), loaded from the Unsplash CDN. Type is Archivo via Google Fonts.
