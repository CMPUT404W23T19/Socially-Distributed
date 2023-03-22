import axios from "axios";
import { getJWTToken } from "../components/utils/cookieStorage";

const host = 'http://localhost:8000'
export const reqSignUp = (data) => {
  return axios({
    url: `${host}/auth/users/`,
    method: 'post',
    data
  })
}

export const reqLogin = (data) => {
  return axios({
    url: `${host}/auth/jwt/create/`,
    method: 'post',
    data
  })
}

export const reqUserId = () => {
  return axios({
    url: `${host}/auth/users/me`,
    method: 'get',
    headers: {
      Authorization: `Token ${getJWTToken()}`,
    }
  })
}

export const reqUserProfile = (userId) => {
  return axios({
    url: `${host}/authors/${userId}`,
    method: 'get'
  })
}

export const reqEditUserProfile = (userId, data) => {
  return axios({
    url: `${host}/authors/${userId}/`,
    method: 'post',
    data
  })
}

export const reqCreatePost = (data, userId) => {
  return axios({
    url: `${host}/authors/${userId}/posts/`,
    method: 'post',
    data
  })
}

export const reqGetUserPosts = (userId) => {
  return axios({
    url:`${host}/authors/${userId}/posts/`,
    method: 'get'
  })
}

export const reqGetAuthorsList = () => {
  return axios({
    url:`${host}/authors/`,
    method:'get'
  })
}

export const reqDeletePost = (authorId, postId) => {
  return axios({
    url:`${host}/authors/${authorId}/posts/${postId}`,
    method:'delete'
  })
}

export const reqModifyPost = (authorId, postId) => {
  return axios({
    url:`${host}/authors/${authorId}/posts/${postId}`,
    method:'put'
  })
}

export const reqGetFollowersList = (authorId) => {
  return axios({
    url:`${host}/authors/${authorId}/followers`,
    method:'get'
  })
}

export const reqFollowOthers = (data, authorId, friendId) => {
  return axios({
    url:`${host}/authors/${authorId}/followers/${friendId}`,
    method:'put',
    data
  })
}