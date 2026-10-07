// Prototype state, persisted to localStorage so the demo survives refreshes.

const KEY = 'pace.prototype.v3';

// The demo opens as a member who has already signed up, so visitors can go
// straight to the product instead of filling in a profile.
export const SAMPLE_MEMBER = {
  name: 'Mark',
  bio: 'Building products, experimenting with ideas, trying to spend more time outside.',
  photo: '',
  role: 'Founder',
  since: 'Summer 2025',
  paddles: 6,
};

const initial = () => ({
  waitlist: null, // email
  user: { ...SAMPLE_MEMBER },
  bookings: ['sun-aug-9'], // session ids; Sunday is already booked, tonight is open to try
  sessionWaitlists: [], // session ids where the member asked to be told about an opening
  posts: [], // member-authored community posts
  joined: {}, // postId -> true ("count me in" / "I can help")
  read: [], // announcement ids
});

let state = load();
const listeners = new Set();

function load() {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return initial();
    const saved = JSON.parse(raw);
    return { ...initial(), ...saved, user: saved.user || { ...SAMPLE_MEMBER } };
  } catch {
    return initial();
  }
}

function save() {
  try {
    localStorage.setItem(KEY, JSON.stringify(state));
  } catch {
    /* storage can be full or blocked; the prototype keeps working in memory */
  }
}

export const getState = () => state;

export function setState(patch) {
  state = { ...state, ...(typeof patch === 'function' ? patch(state) : patch) };
  save();
  listeners.forEach((fn) => fn(state));
}

export const subscribe = (fn) => listeners.add(fn);

export function resetDemo() {
  const waitlist = state.waitlist;
  state = { ...initial(), waitlist };
  save();
}
