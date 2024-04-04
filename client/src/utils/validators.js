
export const usernameValidator = (username) => {

  const usernameRegex = /^[a-zA-Z0-9]+$/;
  if (username && username.length > 0) {  //if username is not undefined and length>0
    return !usernameRegex.test(username)
  }
};