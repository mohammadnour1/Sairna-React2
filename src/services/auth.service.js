import { client } from '@/api/client'
import { endpoints } from '@/api/endpoints'
import { mapAuthResponse, mapUser } from '@/api/mappers/user.mapper'

export async function login({ email, password }) {
  const { data } = await client.post(endpoints.login(), { email: email.trim().toLowerCase(), password })
  return mapAuthResponse(data)
}

export async function register({ name, email, password }) {
  const { data } = await client.post(endpoints.register(), {
    name: name.trim(),
    email: email.trim().toLowerCase(),
    password,
  })
  return mapAuthResponse(data)
}

export async function getMe() {
  const { data } = await client.get(endpoints.me())
  return mapUser(data)
}
