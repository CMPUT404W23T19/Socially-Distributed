export const getTime = (isoString) => {
  const date = new Date(isoString);
  const edmontonOffset = -6 * 60;
  const edmontonTime = new Date(date.getTime() + edmontonOffset * 60 * 1000);
  const year = edmontonTime.getFullYear();
  const month = edmontonTime.getMonth() + 1;
  const day = edmontonTime.getDate();
  const hour = edmontonTime.getHours();
  const minute = edmontonTime.getMinutes();
  const second = edmontonTime.getSeconds();
  const edmontonTimeString = `${month.toString().padStart(2, '0')}/${day.toString().padStart(2, '0')} ${year}`;
  return edmontonTimeString
}


export const getUserIdFromUrl = (url) => {
  const uuidPattern = /[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}/;
  const match = url.match(uuidPattern);
  return match ? match[0] : null
}

export const getPostIdFromUrl = (url) => {
  const urlParts = url.split('/');
  const postid = urlParts[urlParts.length - 1];
  return postid
}

export const getPostIdFromCommentUrl = (url) => {
  const regex = /\/posts\/([\w-]+)/;
  const match = url.match(regex);

  if (match) {
    const postId = match[1];
    return postId
  } else {
    return ''
  }

}