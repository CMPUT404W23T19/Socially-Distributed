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
}

export const reqCreatePost = (data, userId) => {
  return axios({
    url: `http://localhost:8000/authors/${userId}/posts/`,
    method: 'post',
    data
  })
}

export const reqGetUserPosts = (userId) => {
  return axios({
    url:`http://localhost:8000/authors/${userId}/posts/`,
    method: 'get'
  })
}

export const reqGetAuthorsList = () => {
  return axios({
    url:`http://localhost:8000/authors/`,
    method:'get'
  })
}

export const reqDeletePost = (authorId, postId) => {
  return axios({
    url:`http://localhost:8000/authors/${authorId}/posts/${postId}`,
    method:'delete'
  })
}