import cookie from 'react-cookies'


/**
 * Get JWT token from cookie
 */
export const getJWTToken = () => {
  return cookie.load('accessToken')
}


export const setAccessToken = (token) => {
  cookie.save('accessToken', token)
}