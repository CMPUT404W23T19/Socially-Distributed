import axios from "axios";
import { getJWTToken } from "../components/utils/cookieStorage";
export const reqSignUp = (data) => {
  return axios({
    url: 'http://localhost:8000/auth/users/',
    method: 'post',
    data
  })
}

export const reqLogin = (data) => {
  return axios({
    url: 'http://localhost:8000/auth/jwt/create/',
    method: 'post',
    data
  })
}

export const reqUserId = () => {
  return axios({
    url: 'http://localhost:8000/auth/users/me',
    method: 'get',
    headers: {
      Authorization: `Token ${getJWTToken()}`,
    }
  })
}

export const reqUserProfile = (userId) => {
  return axios({
    url: `http://localhost:8000/authors/${userId}`,
    method: 'get'
  })
}

export const reqEditUserProfile = (userId, data) => {
  return axios({
    url: `http://localhost:8000/authors/${userId}/`,
    method: 'post',
    data
  })
  // return 
    // data:{
    // display_name: "test125EditProfile"
    // github: "userGithub125"
    // host: "http://127.0.0.1:8000"
    // id: "http://127.0.0.1:8000/authors/4"
    // profile_image : null
    // type: "author"
    // url: "http://127.0.0.1:8000/authors/4"
    // }
}
export const reqCreatePost = (data, userId) => {
  return axios({
    url: `http://localhost:8000/authors/${userId}/posts/`,
    method: 'post',
    data
  })
}

// an get url and host from api: get, http://localhost:8000/authors/{author_id}/

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