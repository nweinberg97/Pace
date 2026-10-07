// Prototype state, persisted to localStorage so the demo survives refreshes.

const KEY = 'pace.prototype.v1';

const initial = () => ({
  waitlist: null, // email
  user: null, // { name, bio, photo, provider, joined }
  bookings: [], // session ids
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
    return { ...initial(), ...JSON.parse(raw) };
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

export function signOut() {
  state = { ...state, user: null };
  save();
}
