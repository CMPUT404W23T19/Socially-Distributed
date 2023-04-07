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
  return "00000000-0000-0000-0000-" + cookie.load('userId').padStart(12, '0')
}

export const setCookieUserId = (id) => {
  return cookie.save('userId', id)
}

export const clearInfo = () => {
  cookie.remove('userId');
  cookie.remove('accessToken');
}