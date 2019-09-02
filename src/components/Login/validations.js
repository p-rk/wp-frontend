export default function validate(values) {
    let errors = {};
    if (!values.email) {
      errors.email = 'Email address is required';
    } else if (!/\S+@\S+\.\S+/.test(values.email)) {
      errors.email = 'Email address is invalid';
    }
    if (!values.password) {
      errors.password = 'Password is required';
    }
    if (!values.mobile) {
        errors.mobile = 'Mobile Number is required';
      } else if (!/^[7-9]\d{9}$/.test(values.mobile)) {
        errors.mobile = 'Invalid Mobile Number';
      }
    return errors;
  };