
export const usernameValidator = (username) => {

  const usernameRegex = /^[a-zA-Z0-9]+$/;
  if (username && username.length > 0) {  //if username is not undefined and length>0
    return !usernameRegex.test(username)
  }
};

export const validateEmail = (email) => {
  // const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  // const regex = /^[^\s@]+@[^\s@]+\.[a-zA-Z]{3,}$/;
  // const regex = /^[^\s@]+@(gmail\.com|yahoo\.com|outlook\.com)$/;
  const regex = /^[^\s@]+@gmail\.com$/;
  return regex.test(email);
};