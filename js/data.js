// Pace prototype data.
// Everything here is fictional. The demo is set on a summer Thursday in August.

const U = (id, w = 1600) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=80`;

export const IMAGES = {
  hero: U('1707489636403-c539c2cdc101', 2400), // pink sky over the water (Clark Gu)
  dusk: U('1554887608-3445034324bc', 2000), // purple dusk shoreline (Ethan Brooke)
  stillWater: U('1610690699784-f037ec27a65f', 2000), // pink + grey sunset water (Snow Sea)
  group: U('1557151498-af2467d6f7f4', 1800), // paddleboard silhouettes (Krzysztof Kowalik)
  solo: U('1506223064838-a9dff537fe98', 1600), // solo paddler, golden hour (Michael Henry)
  drift: U('1515409116264-67afef5e27a7', 1600), // paddler at sunset (Tori Nefores)
  fog: U('1635997504434-b997d9f47c48', 1600), // misty calm paddle (Jordan Steranka)
  studio: U('1599447332412-6bc6830c815a', 1200),
  heat: U('1660735698223-23a4edefa264', 1200),
  away: U('1639519126294-1b794052f1f6', 1200),
};

const face = (id) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&crop=faces&w=600&h=750&q=80`;

// Everyone here is a founder (or one of the first people on a founding team)
// building something in Kitsilano.
export const MEMBERS = [
  {
    id: 'maya', name: 'Maya', last: 'Chen', role: 'Founder, design tools',
    bio: 'Building tools that make work feel a little more human. Works out of a studio on West 4th.',
    photo: face('1612994451093-c6791c8989cd'), since: 'Summer 2025', paddles: 14,
  },
  {
    id: 'ethan', name: 'Ethan', last: 'Brooks', role: 'Founder, fintech',
    bio: 'Currently figuring out how to build a company without living inside it. Lives two blocks from Kits Beach.',
    photo: face('1511200088071-be841f02c32e'), since: 'Summer 2025', paddles: 11,
  },
  {
    id: 'sarah', name: 'Sarah', last: 'Okafor', role: 'Solo founder, B2B software',
    bio: 'Building billing software for small agencies. Usually somewhere between Kits Beach and a spreadsheet.',
    photo: face('1544507888-56d73eb6046e'), since: 'Summer 2025', paddles: 9,
  },
  {
    id: 'jonah', name: 'Jonah', last: 'Levi', role: 'Co-founder, climate tech',
    bio: 'Building battery-monitoring software in a garage off Macdonald. Keeps a standing Thursday on the water.',
    photo: face('1532032877540-0793b44545a2'), since: 'Summer 2026', paddles: 6,
  },
  {
    id: 'priya', name: 'Priya', last: 'Raman', role: 'Founder, developer tools',
    bio: 'Building developer tools for tiny teams from a desk on West 4th. Bad at sitting still.',
    photo: face('1770920069344-2047a8354621'), since: 'Summer 2025', paddles: 12,
  },
  {
    id: 'alex', name: 'Alex', last: 'Moreau', role: 'Founding engineer',
    bio: 'First engineer at a seed-stage startup on West 4th. Fixes old bikes for fun.',
    photo: face('1522529599102-193c0d76b5b6'), since: 'Summer 2026', paddles: 4,
  },
  {
    id: 'lena', name: 'Lena', last: 'Fischer', role: 'Co-founder, proptech',
    bio: 'Building software for small landlords from an office above a bike shop on West Broadway.',
    photo: face('1765828593108-486f4c75ad43'), since: 'Summer 2026', paddles: 5,
  },
  {
    id: 'tomas', name: 'Tomás', last: 'Rivera', role: 'Founder, logistics software',
    bio: 'Building routing software for local delivery fleets from a West 4th co-working space. Brings snacks to every paddle.',
    photo: face('1591346956484-a30108152a87'), since: 'Summer 2025', paddles: 10,
  },
  {
    id: 'hana', name: 'Hana', last: 'Sato', role: 'Founder, research software',
    bio: 'Building tools for user researchers from a café on Yew Street. Throws pots on weekends.',
    photo: face('1762344352930-1e459b3e8c88'), since: 'Summer 2026', paddles: 3,
  },
  {
    id: 'daniel', name: 'Daniel', last: 'Park', role: 'Founder, health tech',
    bio: 'Left the ER to build scheduling tools for night-shift nurses. Early swims at Kits Pool keep me sane.',
    photo: face('1492562080023-ab3db95bfbce'), since: 'Summer 2026', paddles: 7,
  },
  {
    id: 'noor', name: 'Noor', last: 'Haddad', role: 'Founder, creator tools',
    bio: 'Building an app that helps newsletter writers get paid. Works from her Kits apartment.',
    photo: face('1759873821395-c29de82a5b99'), since: 'Summer 2025', paddles: 8,
  },
  {
    id: 'will', name: 'Will', last: 'Thompson', role: 'Co-founder, energy software',
    bio: 'Building software that helps homeowners switch to heat pumps, out of a Kits garage. Learning to be off on weekends.',
    photo: face('1527980965255-d3b416303d12'), since: 'Summer 2026', paddles: 2,
  },
];

export const memberById = (id) => MEMBERS.find((m) => m.id === id);

// The demo "today" is Thursday, August 6.
export const DEMO_TODAY = 'Thursday, August 6';

export const SESSIONS = [
  {
    id: 'thu-aug-6',
    name: 'Sunset Paddle',
    day: 'Thursday', shortDay: 'Thu', date: 'August 6', dateShort: 'Aug 6',
    relative: 'Tonight',
    time: '6:30 PM', meet: '6:15 PM', end: '8:45 PM',
    startISO: '2026-08-06T18:30:00', endISO: '2026-08-06T20:45:00',
    location: 'Jericho Beach',
    capacity: 12,
    attendees: ['maya', 'jonah', 'priya', 'alex', 'sarah', 'tomas', 'hana', 'daniel'],
    weather: { temp: 22, sky: 'Clear', sunset: '8:47 PM', wind: '6 km/h W', water: 'Calm', icon: 'sun' },
    image: 'group',
    status: 'on',
    noteTitle: "Tonight's looking good.",
    note: "Water conditions are calm and the forecast is clear. We'll meet at Jericho SUP at 6:15 before heading out at 6:30.",
    after: 'A few of us are grabbing tacos on Fourth after. Come if you like.',
  },
  {
    id: 'sun-aug-9',
    name: 'Golden Hour Paddle',
    day: 'Sunday', shortDay: 'Sun', date: 'August 9', dateShort: 'Aug 9',
    relative: 'Sunday',
    time: '5:30 PM', meet: '5:15 PM', end: '7:45 PM',
    startISO: '2026-08-09T17:30:00', endISO: '2026-08-09T19:45:00',
    location: 'Jericho Beach',
    capacity: 10,
    attendees: ['ethan', 'lena', 'noor', 'will', 'maya', 'daniel'],
    weather: { temp: 24, sky: 'Mostly sunny', sunset: '8:42 PM', wind: '9 km/h NW', water: 'Light chop', icon: 'sun' },
    image: 'solo',
    status: 'on',
    noteTitle: 'A slower one.',
    note: "Sunday paddles are a little shorter and a lot lazier. Bring a towel if you think you'll swim. You will.",
    after: 'Tomás is bringing peaches. No one asked him to.',
  },
  {
    id: 'tue-aug-11',
    name: 'Sunset Paddle',
    day: 'Tuesday', shortDay: 'Tue', date: 'August 11', dateShort: 'Aug 11',
    relative: 'Tuesday',
    time: '6:45 PM', originalTime: '6:30 PM', meet: '6:30 PM', end: '8:50 PM',
    startISO: '2026-08-11T18:45:00', endISO: '2026-08-11T20:50:00',
    location: 'Jericho Beach',
    capacity: 12,
    attendees: ['sarah', 'ethan', 'priya', 'lena', 'tomas', 'noor', 'alex', 'will', 'hana'],
    weather: { temp: 19, sky: 'Partly cloudy', sunset: '8:39 PM', wind: '14 km/h W, easing', water: 'Choppy early', icon: 'cloud' },
    image: 'fog',
    status: 'changed',
    noteTitle: 'Starting 15 minutes later.',
    note: "The wind is forecast to ease around 6:30, so we're pushing the start to 6:45 PM. Meet at Jericho SUP at 6:30. Everything else is the same.",
    after: 'Still on for the regroup at the shaka.',
  },
  {
    id: 'thu-aug-13',
    name: 'Sunset Paddle',
    day: 'Thursday', shortDay: 'Thu', date: 'August 13', dateShort: 'Aug 13',
    relative: 'Next Thursday',
    time: '6:30 PM', meet: '6:15 PM', end: '8:40 PM',
    startISO: '2026-08-13T18:30:00', endISO: '2026-08-13T20:40:00',
    location: 'Jericho Beach',
    capacity: 12,
    attendees: ['maya', 'ethan', 'jonah', 'priya', 'alex', 'tomas', 'noor', 'daniel', 'lena', 'sarah', 'will'],
    weather: { temp: 21, sky: 'Clear', sunset: '8:35 PM', wind: '7 km/h W', water: 'Calm', icon: 'sun', early: true },
    image: 'drift',
    status: 'on',
    noteTitle: 'The Perseids are out.',
    note: "Meteor shower peaks this week. We'll stay on the beach a little longer after the sunset if the sky is clear.",
    after: 'Bring a layer for after dark.',
  },
  {
    id: 'sun-aug-16',
    name: 'Golden Hour Paddle',
    day: 'Sunday', shortDay: 'Sun', date: 'August 16', dateShort: 'Aug 16',
    relative: 'Sunday after next',
    time: '5:30 PM', meet: '5:15 PM', end: '7:45 PM',
    startISO: '2026-08-16T17:30:00', endISO: '2026-08-16T19:45:00',
    location: 'Jericho Beach',
    capacity: 10,
    attendees: ['maya', 'sarah', 'jonah', 'priya', 'lena', 'tomas', 'hana', 'noor', 'daniel', 'ethan'],
    weather: { temp: 23, sky: 'Sunny', sunset: '8:28 PM', wind: '8 km/h NW', water: 'Calm', icon: 'sun', early: true },
    image: 'stillWater',
    status: 'full',
    noteTitle: 'This one filled up fast.',
    note: "We keep groups small so the evening stays easy. Add yourself to the waitlist and we'll let you know if a spot opens.",
    after: '',
  },
];

export const sessionById = (id) => SESSIONS.find((s) => s.id === id);

export const ANNOUNCEMENTS = [
  {
    id: 'a1', from: 'pace', kind: 'Session update', session: 'thu-aug-6',
    title: 'Thursday paddle update',
    body: "Looks like a beautiful evening. We're still on for 6:30 PM. Meet at Jericho SUP at 6:15 and grab a board.",
    when: 'Today, 2:10 PM', unread: true,
  },
  {
    id: 'a2', from: 'pace', kind: 'Small change', session: 'tue-aug-11', important: true,
    title: 'Small change for Tuesday',
    body: "Tuesday's paddle will start 15 minutes later due to conditions. Wind is expected to ease by 6:30, so we'll launch at 6:45 PM. We've moved our board booking with Jericho SUP to match.",
    when: 'Today, 11:40 AM', unread: true,
  },
  {
    id: 'a3', from: 'pace', kind: 'Reminder',
    title: 'What to bring',
    body: 'Swimsuit, towel, water, sunscreen, and whatever you want to throw on afterward. Boards, paddles and PFDs are rented from Jericho SUP and booked by us.',
    when: 'Tuesday',
  },
  {
    id: 'a4', from: 'pace', kind: 'Community',
    title: 'Welcome to the summer',
    body: 'A few new founders joined this week. Say hi when you see them on the water. Hana, Will and Alex, glad you’re here.',
    when: 'Monday',
  },
  {
    id: 'a5', from: 'pace', kind: 'Ritual',
    title: 'About the shaka',
    body: "When the group spreads out, someone will eventually raise a shaka. It just means come back together. No whistles, no rush. Paddle over when you're ready.",
    when: 'Last week',
  },
  {
    id: 'a6', from: 'pace', kind: 'Rentals',
    title: 'How boards work',
    body: "We book boards for the group through Jericho SUP's rental desk, so you don't need to reserve anything yourself. Their staff run a short safety briefing for anyone new. Everyone gets a leash and a PFD.",
    when: 'Last week',
  },
];

export const POST_KINDS = [
  { id: 'plans', label: 'Paddle plans' },
  { id: 'recs', label: 'Recommendations' },
  { id: 'building', label: 'Building' },
  { id: 'giving', label: 'Giving' },
  { id: 'sharing', label: 'Just sharing' },
];

export const POSTS = [
  {
    id: 'p1', author: 'jonah', kind: 'plans', when: '35 min ago',
    text: 'Anyone else heading down a little early Thursday? Thinking 5:45 for a swim first.',
    with: ['priya', 'alex'],
  },
  {
    id: 'p2', author: 'noor', kind: 'recs', when: '2 hr ago',
    text: 'Anyone have a good spot for food around Kits after a paddle? Somewhere you can show up a bit salty.',
    with: ['tomas'],
    reply: 'Tomás: the taco place on West 4th. Patio, no dress code, very salty-friendly.',
  },
  {
    id: 'p3', author: 'ethan', kind: 'building', when: '5 hr ago',
    text: "I'm looking for someone who knows a lot about early-stage hiring. Would love a recommendation, or a coffee.",
    with: ['sarah'],
  },
  {
    id: 'p4', author: 'sarah', kind: 'giving', when: 'Yesterday',
    text: 'I have two extra tickets for Bard on the Beach on Saturday if anyone wants them. Shipped a big release this week and I’m taking the night off.',
    with: [],
  },
  {
    id: 'p5', author: 'hana', kind: 'sharing', when: 'Yesterday',
    text: 'First paddle of the season tonight. Did not fall in. Fell in on the way back. Worth it.',
    with: ['maya', 'daniel', 'lena'],
  },
  {
    id: 'p6', author: 'tomas', kind: 'giving', when: '2 days ago',
    text: "Looking for six founders to try a beta of our new app and tell me what’s broken. Wednesday at 7 at the West 4th office, pizza on me.",
    with: ['noor', 'will', 'jonah'],
  },
  {
    id: 'p7', author: 'lena', kind: 'recs', when: '3 days ago',
    text: 'Good dry bag recommendations? My phone has survived two capsizes on luck alone.',
    with: [],
    reply: 'Daniel: Sea to Summit, the 5L one. Fits keys, phone, and a sandwich.',
  },
  {
    id: 'p8', author: 'priya', kind: 'building', when: '4 days ago',
    text: "Running a small, free workshop on naming things for anyone starting a company. Saturday morning at a café on West 4th. Not selling anything, promise.",
    with: ['will'],
  },
  {
    id: 'p9', author: 'will', kind: 'plans', when: '5 days ago',
    text: 'Driving up to Joffre Lakes on Saturday the 15th. Two seats in the car if anyone wants a hike.',
    with: ['alex'],
  },
  {
    id: 'p10', author: 'maya', kind: 'sharing', when: '1 week ago',
    text: "Sat on my board for twenty minutes last Thursday and didn't think about work once. Writing that down so I remember it's possible.",
    with: ['ethan', 'hana', 'noor', 'sarah'],
  },
];

export const RITUAL = [
  { time: '6:15', title: 'Meet', text: 'Find the group at Jericho SUP. Grab a board, a paddle, and whoever is standing nearby.' },
  { time: '6:30', title: 'Paddle', text: 'Out past the moorings together. Fast or slow, nobody is keeping score.' },
  { time: '7:15', title: 'Drift', text: 'The group loosens. Paddle alone for a while, or pair up and talk about what you’re building. Sit down. Swim.' },
  { time: '8:15', title: 'Regroup', text: 'Someone raises a shaka. It means come back together. Watch the sun go down from the water.' },
  { time: '8:50', title: 'Stay a little longer', text: "Boards back, towels out. Food is optional. Staying usually isn't." },
];
