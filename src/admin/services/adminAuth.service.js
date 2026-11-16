import { adminClient } from '../api/adminClient'
import { adminEndpoints } from '../api/adminEndpoints'
import { mapAdminUser, unwrap } from '../api/mappers/admin.mappers'

/** POST /auth/login (LoginDto { email, password }) → { token, user } */
export async function adminLogin({ email, password }) {
  const { data } = await adminClient.post(adminEndpoints.login(), { email: email.trim().toLowerCase(), password })
  const body = unwrap(data)
  return {
    token: body?.accessToken ?? body?.token ?? body?.access_token ?? null,
    user: body?.user ? mapAdminUser(body.user) : null,
  }
}

/** GET /auth/me → the signed-in admin. */
export async function getAdminMe() {
  const { data } = await adminClient.get(adminEndpoints.me())
  const body = unwrap(data)
  return mapAdminUser(body?.user ?? body)
}
