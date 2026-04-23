import { UserSession } from '../models/crm.models';

const SESSION_KEY = 'freightflow-session';

export function readSession(): UserSession | null {
  if (typeof localStorage === 'undefined') {
    return null;
  }

  const raw = localStorage.getItem(SESSION_KEY);
  if (!raw) {
    return null;
  }

  try {
    return JSON.parse(raw) as UserSession;
  } catch {
    return null;
  }
}

export function writeSession(session: UserSession | null): void {
  if (typeof localStorage === 'undefined') {
    return;
  }

  if (!session) {
    localStorage.removeItem(SESSION_KEY);
    return;
  }

  localStorage.setItem(SESSION_KEY, JSON.stringify(session));
}
