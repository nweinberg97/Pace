<p align="center"><img src="assets/icon-512.png" width="96" alt="Pace"></p>

# Pace

**You work hard. Come spend a couple hours outside.**

Pace is a stand-up paddleboard community for founders in Vancouver. Once or twice a week, a small group of founders and early team members meets at Jericho Beach at sunset and spends a couple of hours on the water. The activity is the front door. The people are the reason you come back.

## Live demo

**[nweinberg97.github.io/Pace](https://nweinberg97.github.io/Pace/)**

- Landing page: https://nweinberg97.github.io/Pace/
- Member experience: https://nweinberg97.github.io/Pace/#/app/sessions

The member demo opens already signed in as a sample member, so there's no sign-up step. Everything is filled with sample data.

> First-time setup: in the repo go to **Settings → Pages** and set **Source** to **GitHub Actions**. The included workflow deploys on every push to `main`.

## What's in the prototype

**Public site**
- Hero, philosophy, the evening ritual (Meet, Paddle, Drift, Regroup, Stay a little longer), the shaka, founder profiles, summer sessions, what to expect, where we paddle, and the future Pace family (Studio, Heat, Away)
- Working waitlist with validation and a confirmation state

**Member experience** (sample member, sample data)
- **Sessions:** tonight's paddle with weather, sunset, wind and water, who's going, and booking in two taps
- **Booking:** confirmation sheet, "You're in.", attendee list, add to calendar (.ics), cancel, and a waitlist for full sessions
- **Session detail:** time, place, forecast, notes, prominent schedule-change notices, who's coming, the plan, what to bring
- **Announcements:** practical updates from the Pace team
- **Community:** a low-pressure board for plans, recommendations, asks and offers, with posting, filters and "count me in"
- **Profile:** photo, name, one line, paddles, upcoming sessions. No points, streaks, badges or followers.

State (waitlist, bookings, posts, profile edits) is kept in the browser's localStorage. *Profile → Reset the demo* returns to the sample member. Members, sessions and announcements are fictional. The demo is set on a summer Thursday, August 6.

## About Jericho SUP

Sessions launch from Jericho SUP at Jericho Beach, and Pace books boards for the group through their rental desk. **Jericho SUP is not a confirmed partner of Pace** and hasn't endorsed it. It's simply where the sessions happen and where boards are rented.

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
js/store.js       sample member and local persisted state
js/icons.js       icons and the Pace mark
assets/           favicon, app icons, social image
```

## Credits

Photography from [Unsplash](https://unsplash.com), loaded from the Unsplash CDN. Type is Archivo via Google Fonts.
