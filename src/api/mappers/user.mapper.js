/** Raw: { id, name, email, role, createdAt } → User */
export function mapUser(raw) {
  if (!raw) return null
  return {
    id: Number(raw.id),
    name: raw.name ?? '',
    email: raw.email ?? '',
    role: raw.role ?? 'USER',
    createdAt: raw.createdAt ?? null,
  }
}

/** Raw login/register response: { accessToken, tokenType, portal, user } */
export function mapAuthResponse(raw) {
  return {
    token: raw?.accessToken ?? raw?.token ?? null,
    user: mapUser(raw?.user),
  }
}
