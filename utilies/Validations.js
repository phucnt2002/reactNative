//validate email
export const isValidEmail = (stringEmail) => {
    return (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(stringEmail))
}
    
//validate password
export const isValidPassword = (stringPassword) => {
    // Check if the password length is at least 8 characters
    if (stringPassword.length < 8) {
      return false;
    }
  
    // Check if the password contains at least 1 special character
    const specialCharactersRegex = /[!@#$%^&*(),.?":{}|<>]/;
    if (!specialCharactersRegex.test(stringPassword)) {
      return false;
    }
  
    // Check if the password contains at least 1 capital letter
    const capitalLetterRegex = /[A-Z]/;
    if (!capitalLetterRegex.test(stringPassword)) {
      return false;
    }
  
    // Check if the password contains at least 1 number
    const numberRegex = /[0-9]/;
    if (!numberRegex.test(stringPassword)) {
      return false;
    }
  
    return true; // All criteria are met
  };
  