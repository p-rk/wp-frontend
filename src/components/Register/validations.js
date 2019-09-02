const validationProps = (error, errorMessage) => ({
    error,
    errorMessage
  });

  export const isBlank = (val) => {
    const trimmedVal = val.trim();
    if (!trimmedVal && trimmedVal.length === 0) {
      return true;
    }
    return false;
  };

  export const validateName = (value) => {
    if (isBlank(value)) {
      return validationProps(true, 'Please enter your name');
    } else if (value.length < 3) {
      return validationProps(true, 'Name should be atleast 3 characters');
    }
    return validationProps(false, '');
  };

  export const validateMobile = (value) => {
    if (/^[7-9]\d{9}$/.test(value)) {
      return validationProps(false, '');
    }
    return validationProps(true, 'Enter a valid mobile number');
  };

  export const validateEmail = (val) => {
    /* eslint-disable */
    if(/\S+@\S+\.\S+/.test(val)) return validationProps(false, '');
    return validationProps(true, 'Enter valid email address !');
    /* eslint-enable */
  };

  export const validateOption = val => {
    if (isBlank(val) || !val) {
      return validationProps(true, 'Please select an option');
    }
    return validationProps(false, '');
  };

  export const validatePassword = val => {
    if (val.length < 8) return validationProps(true, 'Password must contain atleast 8 characters');
    return validationProps(false, '');
  };

  export const validateTextInput = val => {
    if (isBlank(val) || !val) {
      return validationProps(true, 'Please type your message');
    } else if (val.length < 10) {
      return validationProps(true, 'Your message should be atleast 10 characters');
    }
    return validationProps(false, '');
  };

  export const validateOTP = val => {
    if (isBlank(val) || !val) {
      return validationProps(true, 'OTP can\'t be blank');
    } else if (val.length !== 5) {
      return validationProps(true, 'Invalid OTP.');
    }
    return validationProps(false, '');
  }
