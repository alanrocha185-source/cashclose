export type Role = 'admin' | 'staff';

const ROLE_KEY = 'cashclose_role';

export function setRole(role: Role) {
    localStorage.setItem(ROLE_KEY, role);
}

export function getRole(): Role | null {
    return localStorage.getItem(ROLE_KEY) as Role | null;
}

export function isAdmin(role: Role) {
    return role === 'admin';
}

export function logout() {
    localStorage.removeItem(ROLE_KEY);
}
