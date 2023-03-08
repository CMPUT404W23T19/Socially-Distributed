import axios from "axios";

export const reqSignUp = (data) => {
  return axios({
    url: 'http://localhost:8000/auth/users/',
    method:'post',
    data
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