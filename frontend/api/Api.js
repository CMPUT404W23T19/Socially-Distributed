import axios from "axios";

export const reqSignUp = (data) => {
  return axios({
    url: 'http://localhost:8000/auth/users/',
    method:'post',
    data
  })
}