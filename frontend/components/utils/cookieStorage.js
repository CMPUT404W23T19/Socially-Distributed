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

export const getCookieUserId = () => {
  return cookie.load('userId')
}

export const setCookieUserId = (id) => {
  return cookie.save('userId', id)
}

export const clearInfo = () => {
  cookie.remove('userId');
  cookie.remove('accessToken');
}