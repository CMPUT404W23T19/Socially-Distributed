export const getTime = (isoString) => {
  const date = new Date(isoString);
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const hours = date.getHours();
  const minutes = date.getMinutes();
  return `${month}/${day}/${year} ${hours}:${minutes}`
}


export const getUserIdFromUrl = (url) => {
  const regex = /\/(\d+)\/?$/
  const match = url.match(regex)
  return match ? parseInt(match[1]) : null
}

export const getPostIdFromUrl = (url) => {
  const urlParts = url.split('/');
  const postid = urlParts[urlParts.length - 1];
  return postid
}