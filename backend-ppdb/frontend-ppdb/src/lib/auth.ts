export function getToken() {
  return typeof window !== 'undefined' ? localStorage.getItem('token') : null
}

export function setToken(token: string) {
  if (typeof window !== 'undefined') {
    localStorage.setItem('token', token)
  }
}

export function clearToken() {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('token')
  }
}
