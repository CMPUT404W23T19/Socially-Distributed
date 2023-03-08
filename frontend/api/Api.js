import axios from "axios";
import { getJWTToken } from "../components/utils/cookieStorage";
export const reqSignUp = (data) => {
  return axios({
    url: 'http://localhost:8000/auth/users/',
    method:'post',
    data
  })
}

export const reqLogin = (data) => {
  return axios({
    url: 'http://localhost:8000/auth/jwt/create/',
    method:'post',
    data
  })
}

export const reqUserId = () => {
  return axios({
    url:'http://localhost:8000/auth/users/me',
    method:'get',
    headers:{
      Authorization: `Token ${getJWTToken()}`,
    }
  })
}

export const reqUserProfile = (userId) => {
  return axios({
    url:`http://localhost:8000/authors/${userId}`,
    method:'get'
  })
}

// export const reqSignUp = (data) => {
//   return fetch('http://localhost:8000/auth/users/', {
//     method: 'POST',
//     headers: {
//         'Content-Type': 'application/json'
//     },
//     body: JSON.stringify(data),
//     mode:'cors'
//   }).then((response) => {
//     console.log(response);
//     return response
//   })
//   .catch((e) => {
//     throw e
//   })
// } 