import {
  IMAGES, MEMBERS, SESSIONS, ANNOUNCEMENTS, POSTS, POST_KINDS, RITUAL,
  memberById, sessionById, DEMO_TODAY,
} from './data.js';
import { getState, setState, resetDemo } from './store.js';
import { icon, mark, wordmark } from './icons.js';

const root = document.getElementById('root');
const layer = document.getElementById('layer');

/* ------------------------------------------------------------------ */
/* Helpers                                                             */
/* ------------------------------------------------------------------ */

const esc = (s = '') =>
  String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

const me = () => {
  const u = getState().user;
  if (!u) return null;
  return { id: 'me', name: u.name, last: '', role: u.role || 'Founder', bio: u.bio, photo: u.photo, since: u.since || 'Summer 2025', paddles: u.paddles || 0, you: true };
};

const person = (id) => (id === 'me' ? me() : memberById(id));

const isBooked = (sid) => getState().bookings.includes(sid);
const onSessionWaitlist = (sid) => getState().sessionWaitlists.includes(sid);

function attendeesOf(s) {
  const list = s.attendees.map(person).filter(Boolean);
  return isBooked(s.id) && me() ? [me(), ...list] : list;
}

const taken = (s) => s.attendees.length + (isBooked(s.id) ? 1 : 0);
const spotsLeft = (s) => Math.max(0, s.capacity - taken(s));
const isFull = (s) => spotsLeft(s) === 0 && !isBooked(s.id);

function avatar(p, size = 40, extra = '') {
  if (!p) return '';
  const initial = esc((p.name || '?').trim().charAt(0).toUpperCase());
  const img = p.photo ? `<img src="${esc(p.photo)}" alt="" loading="lazy" data-fallback>` : '';
  return `<span class="avatar ${extra}" style="--s:${size}px">${img}<span class="avatar-initial">${initial}</span></span>`;
}

function avatarStack(people, max = 5, size = 32) {
  const shown = people.slice(0, max);
  return `<span class="stack">${shown.map((p) => avatar(p, size)).join('')}</span>`;
}

function goingLine(s) {
  const people = attendeesOf(s);
  const names = people.filter((p) => !p.you).map((p) => p.name);
  if (isBooked(s.id)) {
    const others = people.length - 1;
    if (others <= 0) return "You're the first one in.";
    return `You, ${names[0]}${others > 1 ? ` and ${others - 1} other${others - 1 === 1 ? '' : 's'}` : ''}`;
  }
  if (names.length === 0) return 'Be the first one in.';
  if (names.length === 1) return `${names[0]} is going`;
  if (names.length === 2) return `${names[0]} and ${names[1]} are going`;
  return `${names[0]}, ${names[1]} and ${names.length - 2} others are going`;
}

const weatherIcon = (w, s = 18) => (w.icon === 'cloud' ? icon.cloud(s) : icon.sun(s));

function img(key, cls = '', alt = '') {
  const src = IMAGES[key] || key;
  return `<img class="${cls}" src="${esc(src)}" alt="${esc(alt)}" data-fallback>`;
}

// Hide any photo that fails to load so the colour field behind it shows instead.
document.addEventListener(
  'error',
  (e) => {
    const t = e.target;
    if (t && t.tagName === 'IMG' && t.hasAttribute('data-fallback')) t.classList.add('is-missing');
  },
  true,
);

/* ------------------------------------------------------------------ */
/* Router                                                              */
/* ------------------------------------------------------------------ */

function route() {
  const h = location.hash || '';
  if (!h.startsWith('#/')) return { name: 'landing' };
  const parts = h.slice(2).split('/').filter(Boolean);
  if (parts[0] === 'join') return { name: 'app', tab: 'sessions', redirect: true };
  if (parts[0] === 'app') {
    const tab = parts[1] || 'sessions';
    if (tab === 'sessions' && parts[2]) return { name: 'app', tab: 'session', id: parts[2] };
    return { name: 'app', tab };
  }
  return { name: 'landing' };
}

export const go = (hash) => {
  if (location.hash === hash) render();
  else location.hash = hash;
};

let lastRouteKey = '';
let communityFilter = 'all';
let composeKind = 'plans';

function render() {
  const r = route();
  const key = JSON.stringify(r);
  const routeChanged = key !== lastRouteKey;
  lastRouteKey = key;

  // Old sign-up links land in the member view: the demo is already signed in.
  if (r.redirect) {
    location.replace('#/app/sessions');
    return;
  }

  document.body.dataset.view = r.name;

  if (r.name === 'landing') {
    root.innerHTML = landingView();
    document.title = 'Pace | A sunset paddle community for founders';
  } else {
    root.innerHTML = appView(r);
    const titles = { sessions: 'Sessions', session: 'Paddle', community: 'Community', announcements: 'Announcements', profile: 'Profile' };
    document.title = `${titles[r.tab] || 'Pace'} | Pace`;
    if (r.tab === 'announcements') markAnnouncementsRead();
  }

  if (routeChanged) {
    window.scrollTo(0, 0);
    const pending = sessionStorage.getItem('pace.scrollTo');
    if (pending) {
      sessionStorage.removeItem('pace.scrollTo');
      requestAnimationFrame(() => document.getElementById(pending)?.scrollIntoView({ behavior: 'smooth', block: 'start' }));
    }
  }
}

window.addEventListener('hashchange', render);

/* ------------------------------------------------------------------ */
/* Landing                                                             */
/* ------------------------------------------------------------------ */

function landingView() {
  const memberCta = '#/app/sessions';
  const featured = ['maya', 'ethan', 'sarah', 'tomas'].map(memberById);

  return `
  <div class="landing">
    <section class="hero" aria-label="Pace">
      ${img('hero', 'hero-img', 'A pink and violet sky settling over the water at dusk')}
      <div class="hero-shade"></div>

      <header class="site-nav">
        <a href="#/" class="site-logo" aria-label="Pace home">${wordmark({ size: 26, tone: '#fff' })}</a>
        <nav class="site-links" aria-label="Sections">
          <button data-scroll="ritual">The ritual</button>
          <button data-scroll="community">Community</button>
          <button data-scroll="sessions">Sessions</button>
        </nav>
        <a class="btn btn-glass btn-sm" href="${memberCta}">See Pace as a member</a>
      </header>

      <div class="hero-inner">
        <div class="hero-mark">${mark({ size: 92, tone: '#fff' })}</div>
        <h1 class="hero-title">You work hard.<br>Come spend a couple hours outside.</h1>
        <p class="hero-copy">Pace is a stand-up paddleboard community for founders in Kitsilano. One sunset a week on the water with people building things a few blocks from you.</p>
        <div class="hero-actions">
          <button class="btn btn-light" data-scroll="waitlist">Join the Summer</button>
          <button class="btn btn-ghost-light" data-scroll="ritual">See how it works</button>
        </div>
      </div>

      <div class="hero-foot">
        <span>A paddleboard community for Kitsilano founders</span>
        <span>Thursdays and Sundays at sunset, Jericho Beach</span>
      </div>
    </section>

    <section class="philosophy" id="philosophy">
      <div class="wrap philosophy-grid">
        <h2 class="statement">Pace is for founders who care deeply about what they’re building, and don’t want it to become their entire life.</h2>
        <div class="philosophy-side">
          <ol class="cadence" aria-label="The Pace rhythm">
            <li><span>Work hard.</span></li>
            <li><span>Step away.</span></li>
            <li><span>Come back better.</span></li>
          </ol>
          <p>Rest isn’t the opposite of ambition. You don’t need another productivity system, or another founder meetup. You need a reason to step outside, and a few people who get it to step outside with.</p>
          <p class="quiet">Pace means rhythm, not speed.</p>
        </div>
      </div>
    </section>

    <section class="ritual" id="ritual">
      <div class="wrap">
        <div class="section-head on-dark">
          <h2>What a Thursday evening looks like.</h2>
          <p>Two and a half hours, loosely held. Founders drift between solitude and conversation on their own terms. Nobody runs an icebreaker and nobody pitches. The water does the social work.</p>
        </div>

        <ol class="sunpath" aria-label="A Pace evening, in order">
          ${RITUAL.map((step, i) => `
            <li class="sunpath-step" style="--i:${i}">
              <div class="sunpath-sky"><span class="sunpath-sun"></span></div>
              <div class="sunpath-time">${step.time} PM</div>
              <h3>${step.title}</h3>
              <p>${step.text}</p>
            </li>`).join('')}
        </ol>

        <figure class="ritual-photo">
          ${img('group', '', 'Paddleboarders silhouetted on the water at sunset')}
          <figcaption>
            <span class="shaka-chip">${icon.shaka(22)}</span>
            <span><strong>The shaka.</strong> When the group has spread out across the water, a raised shaka means one thing: come back together.</span>
          </figcaption>
        </figure>
      </div>
    </section>

    <section class="community" id="community">
      <div class="wrap">
        <div class="section-head">
          <h2>The activity is the front door.<br>The people are the reason you come back.</h2>
          <p>Founders building in Kitsilano: software companies on West 4th, a restaurant opening next spring, design studios and garage hardware startups, plus the first few people who joined them. Some come to talk shop, some come to be quiet. Nobody brings a pitch deck onto the water.</p>
        </div>
        <div class="people-row">
          ${featured.map((p) => `
            <article class="person">
              <div class="person-photo">${img(p.photo, '', '')}<span class="avatar-initial big">${esc(p.name[0])}</span></div>
              <h3>${esc(p.name)}</h3>
              <div class="person-role">${esc(p.role)}</div>
              <p>“${esc(p.bio)}”</p>
            </article>`).join('')}
        </div>
      </div>
    </section>

    <section class="timetable" id="sessions">
      <div class="wrap timetable-grid">
        <div class="section-head">
          <h2>Summer sessions</h2>
          <p>Same beach, same evenings, all summer long. Reserve a spot, see who’s coming, show up. Small groups on purpose.</p>
          <a class="text-link" href="${memberCta}">Book one in the member demo ${icon.arrowRight(16)}</a>
        </div>
        <div class="timetable-rows">
          ${[
            { day: 'Thursday', time: '6:30 PM', name: 'Sunset Paddle', spots: 12, note: 'The flagship. Out at 6:30, back after the sun goes down.' },
            { day: 'Sunday', time: '5:30 PM', name: 'Golden Hour Paddle', spots: 10, note: 'Shorter, slower, more swimming.' },
          ].map((r) => `
            <div class="tt-row">
              <div class="tt-when"><span class="tt-day">${r.day}</span><span class="tt-time">${r.time}</span></div>
              <div class="tt-what"><h3>${r.name}</h3><p>${r.note}</p></div>
              <div class="tt-meta"><span>${icon.pin(16)} Jericho Beach</span><span>${icon.people(16)} ${r.spots} spots</span></div>
            </div>`).join('')}
          <p class="fine">Sample schedule for the prototype. Real dates open with the waitlist.</p>
        </div>
      </div>
    </section>

    <section class="expect">
      <div class="wrap expect-grid">
        <div>
          <h2 class="h-small">What to expect</h2>
          <ul class="expect-list">
            <li>${icon.bag(20)}<span>Bring a swimsuit or comfortable clothes</span></li>
            <li>${icon.clock(20)}<span>Arrive a little early</span></li>
            <li>${icon.board(20)}<span>No paddleboarding experience required</span></li>
            <li>${icon.wave(20)}<span>Boards and gear are rented for you</span></li>
            <li>${icon.cloud(20)}<span>Sessions are weather dependent</span></li>
            <li>${icon.people(20)}<span>Come for the water. Stay for the people.</span></li>
          </ul>
        </div>
        <div class="partner">
          <h2 class="h-small">Where we paddle</h2>
          <p>Sessions launch from Jericho SUP at Jericho Beach, just west of Kits. Pace books boards for the group through their rental desk, the same way any group would.</p>
          <div class="partner-split">
            <div>
              <h3>Rented from Jericho SUP</h3>
              <ul><li>Boards, paddles and PFDs</li><li>Their usual safety briefing</li><li>A lesson, if you book one with them</li></ul>
            </div>
            <div>
              <h3>Run by Pace</h3>
              <ul><li>The group and the regular time</li><li>Booking boards for everyone</li><li>Who’s coming</li><li>Updates when the weather turns</li><li>The part after</li></ul>
            </div>
          </div>
          <p class="fine partner-note">Jericho SUP is where we rent boards. They aren’t a partner of Pace and haven’t endorsed it.</p>
        </div>
      </div>
    </section>

    <section class="family">
      <div class="wrap">
        <div class="section-head">
          <h2>One idea, a few places to practise it.</h2>
          <p>The water comes first. Over time, Pace will grow into the other places ambitious people forget to go.</p>
        </div>
        <div class="family-grid">
          ${[
            { k: 'drift', name: 'Pace on the Water', text: 'Paddleboarding, sunlight, solitude, conversation.', when: 'This summer' },
            { k: 'studio', name: 'Pace in the Studio', text: 'Restore: a class for mobility, breath and decompression.', when: 'Later' },
            { k: 'heat', name: 'Pace in the Heat', text: 'Sauna, cold plunge, stillness, and slow talk.', when: 'Later' },
            { k: 'away', name: 'Pace Away', text: 'Whistler weekends, surf trips, long hikes.', when: 'Someday' },
          ].map((f, i) => `
            <article class="family-item ${i === 0 ? 'is-now' : ''}">
              <div class="family-img">${img(f.k, '', '')}</div>
              <div class="family-when">${f.when}</div>
              <h3>${f.name}</h3>
              <p>${f.text}</p>
            </article>`).join('')}
        </div>
      </div>
    </section>

    <section class="waitlist" id="waitlist">
      ${img('dusk', 'waitlist-img', '')}
      <div class="waitlist-shade"></div>
      <div class="wrap waitlist-inner" id="waitlist-body">${waitlistBody()}</div>
    </section>

    <footer class="site-foot">
      <div class="wrap foot-grid">
        <div>${wordmark({ size: 22 })}<p class="foot-tag">A little less screen time. A little more horizon.</p></div>
        <div class="foot-links">
          <a href="${memberCta}">Member demo</a>
          <button data-scroll="waitlist">Join the Summer</button>
          <span>Vancouver, BC</span>
        </div>
        <p class="foot-fine">A prototype. Members, sessions and announcements are fictional. Pace is independent and not affiliated with Jericho SUP. Photography from Unsplash.</p>
      </div>
    </footer>
  </div>`;
}

function waitlistBody() {
  const email = getState().waitlist;
  if (email) {
    return `
      <div class="waitlist-done" role="status">
        <div class="done-mark">${mark({ size: 54, tone: '#fff' })}</div>
        <h2>You’re on the list.</h2>
        <p>We’ll send the first details to <strong>${esc(email)}</strong> when summer sessions open.</p>
        <div class="waitlist-next">
          <a class="btn btn-light" href="#/app/sessions">See Pace as a member</a>
          <button class="btn btn-ghost-light" data-action="waitlist-undo">Use a different email</button>
        </div>
      </div>`;
  }
  return `
    <h2>Come find your pace this summer.</h2>
    <p>Pace is for founders and early teams in Kitsilano. Join the waitlist and we’ll send the first sessions when they open. One email, maybe two.</p>
    <form class="waitlist-form" data-form="waitlist" novalidate>
      <label class="sr-only" for="wl-email">Email address</label>
      <input id="wl-email" name="email" type="email" inputmode="email" autocomplete="email" placeholder="Email address" required>
      <button class="btn btn-light" type="submit">Join the Summer</button>
    </form>
    <p class="form-error" id="wl-error" role="alert"></p>`;
}

let draft = { name: '', bio: '', photo: '' };

/* ------------------------------------------------------------------ */
/* Member app                                                          */
/* ------------------------------------------------------------------ */

const NAV = [
  { tab: 'sessions', label: 'Sessions', icon: 'sun' },
  { tab: 'community', label: 'Community', icon: 'people' },
  { tab: 'announcements', label: 'Announcements', short: 'Updates', icon: 'bell' },
  { tab: 'profile', label: 'Profile', icon: 'user' },
];

const unreadCount = () => ANNOUNCEMENTS.filter((a) => a.unread && !getState().read.includes(a.id)).length;

function appView(r) {
  const active = r.tab === 'session' ? 'sessions' : r.tab;
  const u = me();
  const unread = unreadCount();
  let body;
  switch (r.tab) {
    case 'session': body = sessionDetailView(r.id); break;
    case 'community': body = communityView(); break;
    case 'announcements': body = announcementsView(); break;
    case 'profile': body = profileView(); break;
    default: body = sessionsView();
  }

  const navItems = NAV.map((n) => `
    <a href="#/app/${n.tab}" class="nav-item ${active === n.tab ? 'is-active' : ''}" ${active === n.tab ? 'aria-current="page"' : ''}>
      ${icon[n.icon](22)}<span class="nav-label">${n.label}</span><span class="nav-short">${n.short || n.label}</span>
      ${n.tab === 'announcements' && unread ? `<span class="nav-dot" aria-label="${unread} unread">${unread}</span>` : ''}
    </a>`).join('');

  return `
  <div class="app">
    <aside class="sidebar">
      <a href="#/" class="sidebar-logo" aria-label="Pace site">${wordmark({ size: 24 })}</a>
      <nav class="sidebar-nav" aria-label="Member">${navItems}</nav>
      <div class="sidebar-foot">
        <div class="sidebar-weather">
          <span class="sw-label">Tonight at Jericho</span>
          <span class="sw-row">${icon.sun(18)} 22° clear</span>
          <span class="sw-row">${icon.sunset(18)} Sunset 8:47</span>
        </div>
        <a href="#/app/profile" class="sidebar-me">${avatar(u, 34)}<span><strong>${esc(u.name)}</strong><small>Your profile</small></span></a>
        <a href="#/" class="sidebar-back">${icon.arrowLeft(16)} Back to the site</a>
      </div>
    </aside>
    <header class="app-top">
      <a href="#/" aria-label="Pace site">${wordmark({ size: 22 })}</a>
      <a href="#/app/profile" aria-label="Your profile">${avatar(u, 32)}</a>
    </header>
    <main class="app-main" id="main">${body}</main>
    <nav class="tabbar" aria-label="Member">${navItems}</nav>
    <div class="demo-pill" title="Prototype">Sample member view, ${DEMO_TODAY}</div>
  </div>`;
}

/* ---- Sessions ---- */

function greeting() {
  const u = me();
  return `Good evening, ${esc(u.name)}.`;
}

function bookButton(s, size = '') {
  if (isBooked(s.id)) {
    return `<a class="btn btn-going ${size}" href="#/app/sessions/${s.id}">${icon.check(18)} You’re going</a>`;
  }
  if (isFull(s)) {
    return onSessionWaitlist(s.id)
      ? `<button class="btn btn-outline ${size}" data-action="session-waitlist" data-id="${s.id}">${icon.check(16)} On the waitlist</button>`
      : `<button class="btn btn-outline ${size}" data-action="session-waitlist" data-id="${s.id}">Join waitlist</button>`;
  }
  return `<button class="btn btn-dark ${size}" data-action="book" data-id="${s.id}">Book paddle</button>`;
}

function spotsLabel(s) {
  if (isFull(s)) return 'Full';
  const left = spotsLeft(s);
  return `${taken(s)} / ${s.capacity} spots${left <= 2 && !isBooked(s.id) ? `, ${left} left` : ''}`;
}

function sessionsView() {
  const tonight = SESSIONS[0];
  const rest = SESSIONS.slice(1);
  const w = tonight.weather;
  const changed = SESSIONS.find((s) => s.status === 'changed');

  return `
  <div class="page">
    <header class="page-head">
      <p class="page-kicker">${DEMO_TODAY}</p>
      <h1>${greeting()}</h1>
      <p class="page-sub">Here’s what’s happening on the water.</p>
    </header>

    <article class="tonight" data-href="#/app/sessions/${tonight.id}">
      <div class="tonight-media">
        ${img(tonight.image, '', 'Paddleboarders on the water at sunset')}
        <div class="tonight-shade"></div>
        <div class="tonight-top">
          <span class="tag tag-glow">${tonight.relative}</span>
          ${isBooked(tonight.id) ? `<span class="tag tag-going">${icon.check(14)} You’re going</span>` : ''}
        </div>
        <div class="tonight-title">
          <h2><a href="#/app/sessions/${tonight.id}">${tonight.name}</a></h2>
          <p>${tonight.day} ${tonight.time}, ${tonight.location}</p>
        </div>
      </div>
      <div class="tonight-body">
        <dl class="wx">
          <div><dt>${weatherIcon(w)} ${w.sky}</dt><dd>${w.temp}°C</dd></div>
          <div><dt>${icon.sunset(18)} Sunset</dt><dd>${w.sunset}</dd></div>
          <div><dt>${icon.wind(18)} Wind</dt><dd>${w.wind}</dd></div>
          <div><dt>${icon.wave(18)} Water</dt><dd>${w.water}</dd></div>
        </dl>
        <div class="tonight-foot">
          <button class="going" data-action="open-session" data-id="${tonight.id}" data-scroll-target="whos-coming">
            ${avatarStack(attendeesOf(tonight), 5, 34)}
            <span><strong>${goingLine(tonight)}</strong><small>${spotsLabel(tonight)}</small></span>
          </button>
          ${bookButton(tonight, 'btn-lg')}
        </div>
        <p class="tonight-note"><strong>${tonight.noteTitle}</strong> ${tonight.note}</p>
      </div>
    </article>

    ${changed ? `
    <a class="notice notice-change" href="#/app/sessions/${changed.id}">
      <span class="notice-icon">${icon.clock(20)}</span>
      <span><strong>${changed.day}’s paddle starts 15 minutes later.</strong> New start ${changed.time}. Meet at ${changed.meet}.</span>
      ${icon.arrowRight(18)}
    </a>` : ''}

    <section class="upcoming">
      <h2 class="h-section">Coming up</h2>
      <ul class="session-list">
        ${rest.map(sessionRow).join('')}
      </ul>
      <p class="fine center">Sessions open two weeks ahead. Pace books boards for the group at Jericho SUP.</p>
    </section>
  </div>`;
}

function sessionRow(s) {
  const w = s.weather;
  return `
  <li class="srow ${isBooked(s.id) ? 'is-booked' : ''}" data-href="#/app/sessions/${s.id}">
    <div class="srow-date"><span>${s.shortDay}</span><strong>${s.dateShort.split(' ')[1]}</strong><span>${s.dateShort.split(' ')[0]}</span></div>
    <div class="srow-main">
      <h3><a href="#/app/sessions/${s.id}">${s.name}</a></h3>
      <p class="srow-meta">
        <span>${s.status === 'changed' ? `<s>${s.originalTime}</s> ` : ''}${s.time}</span>
        <span>${s.location}</span>
        <span class="srow-wx">${weatherIcon(w, 16)} ${w.temp}°${w.early ? ' early forecast' : ''}</span>
      </p>
      ${s.status === 'changed' ? '<span class="tag tag-change">Starts 15 min later</span>' : ''}
      <div class="srow-people">${avatarStack(attendeesOf(s), 4, 26)}<span>${attendeesOf(s).length} going</span><span class="srow-spots">${spotsLabel(s)}</span></div>
    </div>
    <div class="srow-action">${bookButton(s, 'btn-sm')}</div>
  </li>`;
}

/* ---- Session detail ---- */

function sessionDetailView(id) {
  const s = sessionById(id);
  if (!s) {
    return `<div class="page"><a class="text-link back" href="#/app/sessions">${icon.arrowLeft(16)} All sessions</a><div class="empty"><h1>That paddle isn’t on the schedule.</h1><p>It may have been moved. Head back to see what’s coming up.</p><a class="btn btn-dark" href="#/app/sessions">See sessions</a></div></div>`;
  }
  const w = s.weather;
  const people = attendeesOf(s);
  const booked = isBooked(s.id);
  const ann = ANNOUNCEMENTS.find((a) => a.session === s.id);

  let status;
  if (booked) {
    status = `
      <div class="status status-going">
        <div class="status-line">${icon.check(20)}<div><strong>You’re going.</strong><span>Meet at Jericho SUP at ${s.meet}. See you on the water.</span></div></div>
        <div class="status-actions">
          <button class="btn btn-outline btn-sm" data-action="ics" data-id="${s.id}">${icon.download(16)} Add to calendar</button>
          <button class="btn btn-quiet btn-sm" data-action="cancel" data-id="${s.id}">Can’t make it?</button>
        </div>
      </div>`;
  } else if (isFull(s)) {
    status = `
      <div class="status status-full">
        <div class="status-line">${icon.people(20)}<div><strong>This one’s full.</strong><span>${onSessionWaitlist(s.id) ? 'You’re on the waitlist. We’ll let you know if a spot opens.' : 'Join the waitlist and we’ll tell you if a spot opens.'}</span></div></div>
        <div class="status-actions">${bookButton(s)}</div>
      </div>`;
  } else {
    status = `
      <div class="status">
        <div class="status-line">${icon.people(20)}<div><strong>${spotsLeft(s)} spot${spotsLeft(s) === 1 ? '' : 's'} left</strong><span>${taken(s)} of ${s.capacity} booked. Gear is included.</span></div></div>
        <div class="status-actions">${bookButton(s, 'btn-lg')}</div>
      </div>`;
  }

  return `
  <div class="page page-detail">
    <a class="text-link back" href="#/app/sessions">${icon.arrowLeft(16)} All sessions</a>

    <header class="detail-hero">
      ${img(s.image, '', '')}
      <div class="detail-shade"></div>
      <div class="detail-hero-text">
        <span class="tag tag-glow">${s.relative}</span>
        <h1>${s.name}</h1>
        <p>${s.day}, ${s.date}</p>
      </div>
    </header>

    <div class="detail-grid">
      <div class="detail-main">
        <dl class="facts">
          <div><dt>${icon.clock(18)} Time</dt><dd>${s.status === 'changed' ? `<s>${s.originalTime}</s> ` : ''}${s.time}<small>Meet ${s.meet}, back around ${s.end}</small></dd></div>
          <div><dt>${icon.pin(18)} Where</dt><dd>${s.location}<small>Jericho SUP, by the sailing centre</small></dd></div>
          <div><dt>${icon.people(18)} Group</dt><dd>${people.length} coming<small>${s.capacity} spots, kept small</small></dd></div>
        </dl>

        ${status}

        ${s.status === 'changed' ? `
          <div class="notice notice-change notice-block" role="note">
            <span class="notice-icon">${icon.clock(20)}</span>
            <span><strong>${s.noteTitle}</strong> ${s.note}</span>
          </div>` : `
          <div class="crew-note">
            <div class="crew-from">${mark({ size: 18 })}<span>From Pace</span></div>
            <h2>${s.noteTitle}</h2>
            <p>${s.note}</p>
            ${s.after ? `<p class="quiet">${s.after}</p>` : ''}
          </div>`}

        <section class="whos" id="whos-coming">
          <div class="whos-head">
            <h2 class="h-section">Who’s coming</h2>
            <span class="count">${people.length} ${people.length === 1 ? 'person' : 'people'}</span>
          </div>
          <ul class="attendees">
            ${people.map((p) => `
              <li>
                <button class="attendee" data-action="member" data-id="${p.id}">
                  ${avatar(p, 48)}
                  <span class="attendee-text"><strong>${esc(p.name)}${p.you ? ' <em>(you)</em>' : ''}</strong><span class="attendee-role">${esc(p.you ? 'Going' : p.role)}</span><span class="attendee-bio">${esc(p.bio || '')}</span></span>
                </button>
              </li>`).join('')}
          </ul>
          ${!booked && !isFull(s) ? `<p class="whos-nudge">There’s room for one more. ${bookButton(s, 'btn-sm')}</p>` : ''}
        </section>

        <section class="plan">
          <h2 class="h-section">The plan</h2>
          <ol class="plan-list">
            <li><span>${s.meet}</span><p>Meet at Jericho SUP. Your board is already booked under Pace.</p></li>
            <li><span>${s.time}</span><p>On the water together.</p></li>
            <li><span>Then</span><p>Drift. Paddle alone, pair up, sit, swim. Your call.</p></li>
            <li><span>${icon.shaka(18)}</span><p>Someone raises a shaka. Come back together for the sunset at ${w.sunset}.</p></li>
            <li><span>${s.end}</span><p>Boards back. Stay a little longer if you like.</p></li>
          </ol>
        </section>
      </div>

      <aside class="detail-side">
        <div class="side-card wx-card">
          <h2 class="h-mini">Forecast${w.early ? ' (early)' : ''}</h2>
          <div class="wx-big">${weatherIcon(w, 30)}<span class="wx-temp">${w.temp}°</span><span>${w.sky}</span></div>
          <dl class="wx-list">
            <div><dt>${icon.sunset(16)} Sunset</dt><dd>${w.sunset}</dd></div>
            <div><dt>${icon.wind(16)} Wind</dt><dd>${w.wind}</dd></div>
            <div><dt>${icon.wave(16)} Water</dt><dd>${w.water}</dd></div>
          </dl>
        </div>

        <div class="side-card">
          <h2 class="h-mini">What to bring</h2>
          <ul class="bring">
            <li>Swimsuit or clothes you don’t mind getting wet</li>
            <li>Towel and a warm layer for after</li>
            <li>Water and sunscreen</li>
            <li>Whatever you want to throw on afterward</li>
          </ul>
        </div>

        <div class="side-card partner-card">
          <h2 class="h-mini">Boards and gear</h2>
          <p>Pace books boards, paddles and PFDs for the group at Jericho SUP’s rental desk. Their staff give a short safety briefing to anyone new. Just show up.</p>
        </div>

        ${ann ? `
        <a class="side-card latest" href="#/app/announcements">
          <h2 class="h-mini">Latest update</h2>
          <strong>${ann.title}</strong>
          <p>${ann.body}</p>
          <small>Pace, ${ann.when}</small>
        </a>` : ''}
      </aside>
    </div>
  </div>`;
}

/* ---- Announcements ---- */

function markAnnouncementsRead() {
  const ids = ANNOUNCEMENTS.map((a) => a.id);
  const read = getState().read;
  if (ids.every((id) => read.includes(id))) return;
  // Leave them visibly "new" for this visit, clear the badge for the next one.
  setTimeout(() => {
    setState({ read: ids });
    const dot = document.querySelectorAll('.nav-dot');
    dot.forEach((d) => d.remove());
  }, 1200);
}

function announcementsView() {
  const read = getState().read;
  return `
  <div class="page page-narrow">
    <header class="page-head">
      <h1>Announcements</h1>
      <p class="page-sub">Practical updates from the Pace team. Nothing to reply to.</p>
    </header>
    <ol class="ann-list">
      ${ANNOUNCEMENTS.map((a) => {
        const s = a.session ? sessionById(a.session) : null;
        const isNew = a.unread && !read.includes(a.id);
        return `
        <li class="ann ${a.important ? 'ann-important' : ''}">
          <div class="ann-from">
            <span class="from-badge" aria-hidden="true">${mark({ size: 14, tone: '#fff' })}</span><span>Pace</span>
            <span class="ann-when">${a.when}</span>
            ${isNew ? '<span class="tag tag-new">New</span>' : ''}
          </div>
          <h2>${a.title}</h2>
          <p>${a.body}</p>
          ${s ? `<a class="text-link" href="#/app/sessions/${s.id}">${s.day}’s ${s.name.toLowerCase()} ${icon.arrowRight(16)}</a>` : ''}
        </li>`;
      }).join('')}
    </ol>
  </div>`;
}

/* ---- Community ---- */

const kindLabel = (id) => POST_KINDS.find((k) => k.id === id)?.label || '';

const joinVerb = { plans: 'Count me in', recs: 'I have one', building: 'I can help', giving: 'I’d love that', sharing: '' };
const joinedVerb = { plans: 'You’re in', recs: 'Noted', building: 'Offered', giving: 'Asked', sharing: '' };

function allPosts() {
  const mine = getState().posts.map((p) => ({ ...p, author: 'me' }));
  return [...mine, ...POSTS];
}

function communityView() {
  const posts = allPosts().filter((p) => communityFilter === 'all' || p.kind === communityFilter);
  const u = me();
  return `
  <div class="page page-narrow">
    <header class="page-head">
      <h1>Community</h1>
      <p class="page-sub">A notice board for the people you paddle with.</p>
    </header>

    <aside class="guideline">
      <div class="guideline-mark">${icon.shaka(22)}</div>
      <div>
        <strong>Keep it useful, human, and low-pressure.</strong>
        <p>Ask for help. Offer something useful. Make plans. Share something worth sharing. Pace isn’t a sales channel.</p>
      </div>
    </aside>

    <form class="composer" data-form="post">
      <div class="composer-row">
        ${avatar(u, 40)}
        <label class="sr-only" for="post-text">Write a post</label>
        <textarea id="post-text" rows="2" maxlength="280" placeholder="Ask, offer, or make a plan…" data-input="post"></textarea>
      </div>
      <div class="composer-foot">
        <div class="chips" role="radiogroup" aria-label="Kind of post">
          ${POST_KINDS.map((k) => `<button type="button" role="radio" aria-checked="${composeKind === k.id}" class="chip ${composeKind === k.id ? 'is-on' : ''}" data-action="compose-kind" data-kind="${k.id}">${k.label}</button>`).join('')}
        </div>
        <button class="btn btn-dark btn-sm" type="submit">Post</button>
      </div>
    </form>

    <div class="filter" role="tablist" aria-label="Filter posts">
      <button role="tab" aria-selected="${communityFilter === 'all'}" class="filter-btn ${communityFilter === 'all' ? 'is-on' : ''}" data-action="filter" data-kind="all">Everything</button>
      ${POST_KINDS.map((k) => `<button role="tab" aria-selected="${communityFilter === k.id}" class="filter-btn ${communityFilter === k.id ? 'is-on' : ''}" data-action="filter" data-kind="${k.id}">${k.label}</button>`).join('')}
    </div>

    <ul class="posts">
      ${posts.length ? posts.map(postItem).join('') : `<li class="empty-posts"><p>Nothing here yet. Start one. Someone’s probably wondering the same thing.</p></li>`}
    </ul>
  </div>`;
}

function postItem(p) {
  const a = person(p.author);
  if (!a) return '';
  const joined = !!getState().joined[p.id];
  const people = [...(joined ? ['me'] : []), ...(p.with || [])].map(person).filter(Boolean);
  const verb = joinVerb[p.kind];
  const mine = p.author === 'me';

  let withLine = '';
  if (people.length) {
    const names = people.map((x) => (x.you ? 'You' : x.name));
    const list = names.length <= 2 ? names.join(' and ') : `${names.slice(0, 2).join(', ')} and ${names.length - 2} more`;
    const plural = names.length > 1 || names[0] === 'You';
    const be = plural ? 'are' : 'is';
    const suffix = {
      plans: `${be} in`, recs: 'replied', building: 'offered to help', giving: `${be} interested`, sharing: 'felt this',
    }[p.kind];
    withLine = `<span class="post-with">${avatarStack(people, 3, 22)}<span>${list} ${suffix}</span></span>`;
  }

  return `
  <li class="post">
    <button class="post-avatar" data-action="member" data-id="${a.id}" aria-label="${esc(a.name)}">${avatar(a, 42)}</button>
    <div class="post-body">
      <div class="post-head">
        <strong>${esc(a.name)}</strong>
        <span class="post-role">${esc(a.you ? 'You' : a.role)}</span>
        <span class="post-when">${esc(p.when)}</span>
      </div>
      <span class="post-kind kind-${p.kind}">${kindLabel(p.kind)}</span>
      <p class="post-text">${esc(p.text)}</p>
      ${p.reply ? `<p class="post-reply">${esc(p.reply)}</p>` : ''}
      <div class="post-foot">
        ${withLine}
        ${mine
          ? `<button class="link-btn" data-action="delete-post" data-id="${p.id}">Remove</button>`
          : verb ? `<button class="link-btn ${joined ? 'is-on' : ''}" data-action="join-post" data-id="${p.id}" aria-pressed="${joined}">${joined ? `${icon.check(15)} ${joinedVerb[p.kind]}` : verb}</button>` : ''}
      </div>
    </div>
  </li>`;
}

/* ---- Profile ---- */

function profileView() {
  const u = me();
  const upcoming = SESSIONS.filter((s) => isBooked(s.id));
  const next = upcoming[0];
  const waiting = SESSIONS.filter((s) => onSessionWaitlist(s.id));

  return `
  <div class="page page-narrow">
    <section class="profile">
      <div class="profile-photo">${avatar(u, 112)}</div>
      <h1>${esc(u.name)}</h1>
      <p class="profile-role">${esc(u.role)}</p>
      <p class="profile-bio">${u.bio ? esc(u.bio) : '<span class="quiet">Add a line about what you’re working on lately.</span>'}</p>
      <p class="profile-since">${mark({ size: 14 })} Pace since ${esc(u.since)}</p>
      <button class="btn btn-outline btn-sm" data-action="edit-profile">${icon.edit(16)} Edit profile</button>
    </section>

    <dl class="profile-facts">
      <div><dt>Paddles</dt><dd>${u.paddles} paddle${u.paddles === 1 ? '' : 's'}</dd></div>
      <div><dt>Next</dt><dd>${next ? `<a href="#/app/sessions/${next.id}">${next.day}, ${next.name}</a>` : '<a href="#/app/sessions">Find a paddle</a>'}</dd></div>
    </dl>

    <section class="profile-section">
      <h2 class="h-section">Upcoming</h2>
      ${upcoming.length ? `
        <ul class="mini-sessions">
          ${upcoming.map((s) => `
            <li><a href="#/app/sessions/${s.id}">
              <span class="mini-date">${s.shortDay} ${s.dateShort}</span>
              <span class="mini-name">${s.name}<small>${s.time}, ${s.location}</small></span>
              ${icon.arrowRight(18)}
            </a></li>`).join('')}
        </ul>` : `
        <div class="empty-inline">
          <p>No paddles booked yet. Thursday’s looking good.</p>
          <a class="btn btn-dark btn-sm" href="#/app/sessions/${SESSIONS[0].id}">See tonight’s paddle</a>
        </div>`}
      ${waiting.length ? `<p class="fine">On the waitlist for ${waiting.map((s) => `${s.day} ${s.dateShort}`).join(', ')}.</p>` : ''}
    </section>

    <section class="profile-section">
      <h2 class="h-section">How Pace works</h2>
      <p class="quiet">No points, no streaks, no followers. Book a paddle, see who’s coming, show up. That’s the whole thing.</p>
    </section>

    <div class="profile-tools">
      <button class="link-btn" data-action="reset-demo">Reset the demo</button>
      <a class="link-btn" href="#/">${icon.arrowLeft(16)} Back to the site</a>
    </div>
  </div>`;
}

/* ------------------------------------------------------------------ */
/* Overlays: sheets, member cards, toasts                              */
/* ------------------------------------------------------------------ */

let lastFocus = null;

function openSheet(html, { label = 'Dialog', wide = false } = {}) {
  lastFocus = document.activeElement;
  layer.innerHTML = `
    <div class="scrim" data-action="close-sheet"></div>
    <div class="sheet ${wide ? 'sheet-wide' : ''}" role="dialog" aria-modal="true" aria-label="${esc(label)}">
      <button class="sheet-close" data-action="close-sheet" aria-label="Close">${icon.close(20)}</button>
      ${html}
    </div>`;
  layer.classList.add('is-open');
  document.body.classList.add('has-sheet');
  requestAnimationFrame(() => layer.querySelector('.sheet [data-autofocus], .sheet button:not(.sheet-close), .sheet input')?.focus());
}

function closeSheet() {
  layer.classList.remove('is-open');
  layer.innerHTML = '';
  document.body.classList.remove('has-sheet');
  lastFocus?.focus?.();
}

function toast(msg) {
  let t = document.getElementById('toast');
  if (!t) {
    t = document.createElement('div');
    t.id = 'toast';
    t.className = 'toast';
    t.setAttribute('role', 'status');
    document.body.appendChild(t);
  }
  t.textContent = msg;
  t.classList.add('is-on');
  clearTimeout(toast._t);
  toast._t = setTimeout(() => t.classList.remove('is-on'), 3200);
}

function bookSheet(s) {
  const w = s.weather;
  openSheet(`
    <div class="sheet-body">
      <p class="sheet-kicker">${s.relative}</p>
      <h2>Book ${s.day}’s paddle?</h2>
      <dl class="sheet-facts">
        <div><dt>${icon.calendar(18)}</dt><dd>${s.day}, ${s.date}<small>${s.status === 'changed' ? `<s>${s.originalTime}</s> ` : ''}${s.time}, meet at ${s.meet}</small></dd></div>
        <div><dt>${icon.pin(18)}</dt><dd>${s.location}<small>Jericho SUP, by the sailing centre</small></dd></div>
        <div><dt>${weatherIcon(w)}</dt><dd>${w.temp}°C, ${w.sky.toLowerCase()}<small>Sunset ${w.sunset}</small></dd></div>
      </dl>
      <p class="sheet-note">${icon.board(18)} Pace books your board, paddle and PFD at Jericho SUP. If plans change, cancel any time so someone else can come.</p>
      <div class="sheet-actions">
        <button class="btn btn-quiet" data-action="close-sheet">Not now</button>
        <button class="btn btn-dark btn-lg" data-action="confirm-book" data-id="${s.id}" data-autofocus>Book paddle</button>
      </div>
    </div>`, { label: `Book ${s.name}` });
}

function bookedSheet(s) {
  const people = attendeesOf(s).filter((p) => !p.you);
  openSheet(`
    <div class="sheet-body sheet-success">
      <div class="success-mark">${mark({ size: 64 })}</div>
      <h2>You’re in.</h2>
      <p class="success-when">${s.day} · ${s.time}<br>${s.location}</p>
      <p class="success-line">See you on the water.</p>
      ${people.length ? `
      <button class="going going-sheet" data-action="see-whos" data-id="${s.id}">
        ${avatarStack(people, 6, 34)}
        <span><strong>${people.length} other${people.length === 1 ? '' : 's'} coming</strong><small>${people.slice(0, 3).map((p) => p.name).join(', ')}${people.length > 3 ? '…' : ''}</small></span>
      </button>` : ''}
      <div class="sheet-actions stacked">
        <button class="btn btn-dark btn-lg" data-action="see-whos" data-id="${s.id}" data-autofocus>See who’s coming</button>
        <button class="btn btn-outline" data-action="ics" data-id="${s.id}">${icon.download(16)} Add to calendar</button>
      </div>
    </div>`, { label: "You're in" });
}

function cancelSheet(s) {
  openSheet(`
    <div class="sheet-body">
      <h2>Give up your spot?</h2>
      <p class="sheet-lede">${s.day}’s ${s.name.toLowerCase()} at ${s.time}. Someone on the waitlist will get it. No hard feelings, there’s always next week.</p>
      <div class="sheet-actions">
        <button class="btn btn-quiet" data-action="close-sheet" data-autofocus>Keep my spot</button>
        <button class="btn btn-outline btn-danger" data-action="confirm-cancel" data-id="${s.id}">Cancel my spot</button>
      </div>
    </div>`, { label: 'Cancel booking' });
}

function memberSheet(id) {
  const p = person(id);
  if (!p) return;
  const going = SESSIONS.filter((s) => attendeesOf(s).some((x) => x.id === p.id));
  openSheet(`
    <div class="sheet-body member-card">
      ${avatar(p, 96)}
      <h2>${esc(p.name)}</h2>
      <p class="member-role">${esc(p.you ? 'You' : p.role)}</p>
      ${p.bio ? `<p class="member-bio">“${esc(p.bio)}”</p>` : ''}
      <p class="member-since">${mark({ size: 13 })} Pace since ${esc(p.since)}</p>
      ${going.length ? `
        <div class="member-going">
          <h3 class="h-mini">On the water</h3>
          <ul>${going.map((s) => `<li><a href="#/app/sessions/${s.id}" data-action="close-sheet-nav">${s.day} ${s.dateShort} <span>${s.name}</span></a></li>`).join('')}</ul>
        </div>` : ''}
      ${p.you ? '' : '<p class="fine">Pace doesn’t do messages. Say hi on the water.</p>'}
    </div>`, { label: p.name });
}

function editProfileSheet() {
  const u = getState().user;
  draft = { ...draft, name: u.name, bio: u.bio || '', photo: u.photo || '' };
  openSheet(`
    <form class="sheet-body" data-form="edit-profile" novalidate>
      <h2>Edit profile</h2>
      <div class="photo-field">
        <label class="photo-pick" for="photo-input">
          <span class="photo-preview" id="photo-preview">${draft.photo ? `<img src="${draft.photo}" alt="Your photo">` : `<span class="photo-initial">${esc(draft.name.charAt(0))}</span>`}</span>
          <span class="photo-text"><strong>Change photo</strong><span>Square-ish works best.</span></span>
        </label>
        <input id="photo-input" type="file" accept="image/*" class="sr-only" data-input="photo">
      </div>
      <div class="field">
        <label for="e-name">First name</label>
        <input id="e-name" maxlength="24" value="${esc(draft.name)}" data-input="name">
      </div>
      <div class="field">
        <label for="f-bio">What are you working on lately?</label>
        <input id="f-bio" maxlength="90" value="${esc(draft.bio)}" data-input="bio">
        <span class="field-hint"><span>One line is plenty.</span><span id="bio-count">${draft.bio.length}/90</span></span>
      </div>
      <p class="form-error" id="profile-error" role="alert"></p>
      <div class="sheet-actions">
        <button type="button" class="btn btn-quiet" data-action="close-sheet">Cancel</button>
        <button type="submit" class="btn btn-dark">Save changes</button>
      </div>
    </form>`, { label: 'Edit profile' });
}

/* ------------------------------------------------------------------ */
/* Actions                                                             */
/* ------------------------------------------------------------------ */

function downloadICS(s) {
  const fmt = (iso) => iso.replace(/[-:]/g, '');
  const ics = [
    'BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//Pace//Prototype//EN', 'BEGIN:VEVENT',
    `UID:${s.id}@pace.prototype`,
    `DTSTART;TZID=America/Vancouver:${fmt(s.startISO)}`,
    `DTEND;TZID=America/Vancouver:${fmt(s.endISO)}`,
    `SUMMARY:Pace: ${s.name}`,
    `LOCATION:Jericho SUP\\, Jericho Beach\\, Vancouver`,
    `DESCRIPTION:Meet at ${s.meet}. Bring a swimsuit\\, towel and water. See you on the water.`,
    'END:VEVENT', 'END:VCALENDAR',
  ].join('\r\n');
  const a = document.createElement('a');
  a.href = URL.createObjectURL(new Blob([ics], { type: 'text/calendar' }));
  a.download = `pace-${s.id}.ics`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  toast('Added to your downloads. Open it to save to your calendar.');
}

function resizeImage(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = reject;
    reader.onload = () => {
      const im = new Image();
      im.onerror = reject;
      im.onload = () => {
        const size = 320;
        const c = document.createElement('canvas');
        c.width = size; c.height = size;
        const ctx = c.getContext('2d');
        const min = Math.min(im.width, im.height);
        ctx.drawImage(im, (im.width - min) / 2, (im.height - min) / 2, min, min, 0, 0, size, size);
        resolve(c.toDataURL('image/jpeg', 0.85));
      };
      im.src = reader.result;
    };
    reader.readAsDataURL(file);
  });
}

function scrollToId(id) {
  document.getElementById(id)?.scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'start' });
}

document.addEventListener('click', (e) => {
  const scrollBtn = e.target.closest('[data-scroll]');
  if (scrollBtn) {
    e.preventDefault();
    const id = scrollBtn.dataset.scroll;
    if (route().name !== 'landing') {
      sessionStorage.setItem('pace.scrollTo', id);
      go('#/');
    } else scrollToId(id);
    return;
  }

  const el = e.target.closest('[data-action]');
  if (el) {
    const { action, id } = el.dataset;
    switch (action) {
      case 'close-sheet': closeSheet(); return;
      case 'close-sheet-nav': closeSheet(); return; // the link itself navigates
      case 'waitlist-undo':
        setState({ waitlist: null });
        document.getElementById('waitlist-body').innerHTML = waitlistBody();
        document.getElementById('wl-email')?.focus();
        return;
      case 'book': bookSheet(sessionById(id)); return;
      case 'confirm-book': {
        const s = sessionById(id);
        if (!isBooked(id)) setState((st) => ({ bookings: [...st.bookings, id], sessionWaitlists: st.sessionWaitlists.filter((x) => x !== id) }));
        render();
        bookedSheet(s);
        return;
      }
      case 'see-whos': {
        closeSheet();
        const target = `#/app/sessions/${id}`;
        if (location.hash === target) scrollToId('whos-coming');
        else { sessionStorage.setItem('pace.scrollTo', 'whos-coming'); go(target); }
        return;
      }
      case 'open-session': {
        sessionStorage.setItem('pace.scrollTo', el.dataset.scrollTarget || '');
        go(`#/app/sessions/${id}`);
        return;
      }
      case 'cancel': cancelSheet(sessionById(id)); return;
      case 'confirm-cancel':
        setState((st) => ({ bookings: st.bookings.filter((x) => x !== id) }));
        closeSheet();
        render();
        toast('Your spot is open for someone else. See you next time.');
        return;
      case 'session-waitlist': {
        const on = onSessionWaitlist(id);
        setState((st) => ({ sessionWaitlists: on ? st.sessionWaitlists.filter((x) => x !== id) : [...st.sessionWaitlists, id] }));
        render();
        toast(on ? 'Taken off the waitlist.' : 'You’re on the waitlist. We’ll tell you if a spot opens.');
        return;
      }
      case 'ics': downloadICS(sessionById(id)); return;
      case 'member': memberSheet(id); return;
      case 'compose-kind':
        composeKind = el.dataset.kind;
        document.querySelectorAll('.composer .chip').forEach((c) => {
          const on = c.dataset.kind === composeKind;
          c.classList.toggle('is-on', on);
          c.setAttribute('aria-checked', on);
        });
        return;
      case 'filter': communityFilter = el.dataset.kind; render(); return;
      case 'join-post': {
        const joined = { ...getState().joined };
        if (joined[id]) delete joined[id]; else joined[id] = true;
        setState({ joined });
        render();
        return;
      }
      case 'delete-post':
        setState((st) => ({ posts: st.posts.filter((p) => p.id !== id) }));
        render();
        toast('Post removed.');
        return;
      case 'edit-profile': editProfileSheet(); return;
      case 'reset-demo':
        resetDemo();
        communityFilter = 'all';
        render();
        toast('Demo reset to the sample member.');
        return;
    }
  }

  // Whole-card navigation for session cards, without hijacking inner controls.
  const card = e.target.closest('[data-href]');
  if (card && !e.target.closest('a, button, input, textarea, label')) go(card.dataset.href);
});

document.addEventListener('input', (e) => {
  const t = e.target;
  const k = t.dataset?.input;
  if (!k) return;
  if (k === 'name' || k === 'bio') {
    draft[k] = t.value;
    if (k === 'bio') { const c = document.getElementById('bio-count'); if (c) c.textContent = `${t.value.length}/90`; }
    if (k === 'name' && !draft.photo) {
      const pi = document.querySelector('.photo-initial');
      if (pi) pi.innerHTML = t.value.trim() ? esc(t.value.trim().charAt(0).toUpperCase()) : icon.camera(26);
    }
  }
});

document.addEventListener('change', async (e) => {
  const t = e.target;
  if (t.dataset?.input !== 'photo' || !t.files?.[0]) return;
  try {
    draft.photo = await resizeImage(t.files[0]);
    const prev = document.getElementById('photo-preview');
    if (prev) prev.innerHTML = `<img src="${draft.photo}" alt="Your photo">`;
    const label = document.querySelector('.photo-text strong');
    if (label) label.textContent = 'Change photo';
  } catch {
    const err = document.getElementById('profile-error');
    if (err) err.textContent = 'That file couldn’t be read as an image. Try a JPG or PNG.';
  }
});

document.addEventListener('submit', (e) => {
  const form = e.target.closest('[data-form]');
  if (!form) return;
  e.preventDefault();
  const kind = form.dataset.form;

  if (kind === 'waitlist') {
    const input = form.querySelector('input');
    const v = input.value.trim();
    const err = document.getElementById('wl-error');
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v)) {
      err.textContent = 'Enter an email address like you@example.com.';
      input.setAttribute('aria-invalid', 'true');
      input.focus();
      return;
    }
    setState({ waitlist: v });
    const body = document.getElementById('waitlist-body');
    body.innerHTML = waitlistBody();
    body.querySelector('.waitlist-done')?.setAttribute('tabindex', '-1');
    body.querySelector('.waitlist-done')?.focus();
    return;
  }

  if (kind === 'edit-profile') {
    const name = draft.name.trim();
    if (!name) {
      document.getElementById('profile-error').textContent = 'Add your first name so people know who to say hi to.';
      form.querySelector('[data-input="name"]')?.focus();
      return;
    }
    const prev = getState().user || {};
    setState({ user: { ...prev, name, bio: draft.bio.trim(), photo: draft.photo } });
    closeSheet();
    render();
    toast('Profile saved.');
    return;
  }

  if (kind === 'post') {
    const ta = form.querySelector('textarea');
    const text = ta.value.trim();
    if (!text) { ta.focus(); ta.placeholder = 'Write something first: a question, an offer, a plan.'; return; }
    const post = { id: `me-${Date.now()}`, kind: composeKind, text, when: 'Just now', with: [] };
    setState((st) => ({ posts: [post, ...st.posts] }));
    communityFilter = 'all';
    render();
    toast('Posted to the board.');
  }
});

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && layer.classList.contains('is-open')) closeSheet();
  if ((e.key === 'Enter' || e.key === ' ') && e.target.matches?.('[data-href]')) { e.preventDefault(); go(e.target.dataset.href); }
});

render();
