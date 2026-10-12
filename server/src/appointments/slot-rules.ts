// The booking rules for an assessment slot, shared by the check before payment
// (POST /appointments/pay) and the booking after payment (create()), so the two
// can never disagree. Times are judged in Cairo.

export const SLOT_RULES = {
  firstStartMin: 9 * 60, // 09:00
  lastStartMin: 12 * 60, // 12:00 (the day closes at 12:30)
  stepMin: 30,
  maxPerSlot: 2,
  windowDays: 14, // bookable up to the end of today + 14 days (Cairo)
};

const cairo = new Intl.DateTimeFormat('en-US', {
  timeZone: 'Africa/Cairo',
  hour12: false,
  weekday: 'short',
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
  hour: '2-digit',
  minute: '2-digit',
});

/** Cairo calendar date (YYYY-MM-DD), weekday and time of an instant. */
export function cairoParts(d: Date) {
  const p = Object.fromEntries(
    cairo.formatToParts(d).map((x) => [x.type, x.value]),
  );
  const hour = Number(p.hour) % 24; // some engines print 24 for midnight
  return {
    date: `${p.year}-${p.month}-${p.day}`,
    weekday: p.weekday as string,
    hhmm: `${String(hour).padStart(2, '0')}:${p.minute}`,
    minutes: hour * 60 + Number(p.minute),
  };
}

function addDays(dateISO: string, days: number) {
  const [y, m, d] = dateISO.split('-').map(Number);
  return new Date(Date.UTC(y, m - 1, d + days)).toISOString().slice(0, 10);
}

/**
 * Returns the reason a slot can't be booked, or null when it can.
 * `closed` (admin-closed "HH:mm" times for the slot's Cairo date) is only
 * passed before payment; a parent who already paid is not refused for it.
 */
export function slotProblem(
  slot: Date,
  now: Date,
  closed?: Set<string>,
): string | null {
  if (isNaN(slot.getTime())) return 'Invalid slot date/time';
  if (slot.getTime() <= now.getTime()) return 'This time has already passed';
  const s = cairoParts(slot);
  if (s.weekday === 'Fri' || s.weekday === 'Sat') {
    return 'Appointments are not available on Friday or Saturday';
  }
  if (s.date > addDays(cairoParts(now).date, SLOT_RULES.windowDays)) {
    return 'Selected slot is outside the allowed scheduling window';
  }
  if (s.minutes % SLOT_RULES.stepMin !== 0) {
    return 'Slots must align to 30-minute intervals';
  }
  if (s.minutes < SLOT_RULES.firstStartMin || s.minutes > SLOT_RULES.lastStartMin) {
    return 'Slots must start between 09:00 and 12:00';
  }
  if (closed?.has(s.hhmm)) {
    return 'This time is closed. Please choose another time.';
  }
  return null;
}

/** Minutes a chosen slot is held while the parent pays (0 = holds off). */
export function holdMinutes(): number {
  const n = Number(process.env.SLOT_HOLD_MINUTES ?? 0);
  return Number.isFinite(n) && n > 0 ? n : 0;
}
