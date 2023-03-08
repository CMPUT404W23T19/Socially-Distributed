import cookie from 'react-cookies'

export const setAccessToken = (token) => {
  cookie.save('accessToken', token)
}