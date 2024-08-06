function validateName(name) {
    const regex = /^[A-Za-z]{2,20}$/;
    if (!regex.test(name)) {
      return 'Name should be between 2 and 20 characters.';
    }
    return null;
  }
  
  function validateEmail(email) {
    const regex = /[a-z0-9]+@[a-z]+\.[a-z]{2,3}/;
    if (!regex.test(email)) {
      return 'Email format is invalid.';
    }
    return null;
  }
  
  function validateAge(age) {
    if (typeof age !== 'number' || age <= 0 || age > 120) {
      return 'Age shpuld be a number between 1 and 120.';
    }
    return null;
  }
  
  function validateGender(gender) {
    const validGenders = ['male', 'female', 'other'];
    if (!validGenders.includes(gender.toLowerCase())) {
      return 'Gender should be between male, female, other.';
    }
    return null;
  }
  
  function validateIsActive(isActive) {
    if (typeof isActive !== 'boolean') {
      return 'isActive is a boolean value.';
    }
    return null;
  }

  // function validatePassword(password) {
  //     const regex = /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&-+=()])(?=\\S+$).{8, 20}$/
  //     if (!regex.test(password)) {
  //       return 'Password format mismatch.';
  //     }
  //     return null
  // }
  
  function validateAddress(address) {
    const { addressLine1, addressLine2, city, pincode } = address;
    if (
      typeof addressLine1 !== 'string' ||
      addressLine1.length === 0 ||
      typeof addressLine2 !== 'string' ||
      typeof city !== 'string' ||
      city.length === 0 ||
      !/^[0-9]{5,6}$/.test(pincode)
    ) {
      return 'Address is invalid.';
    }
    return null;
  }
  
  function validateHobbies(hobbies) {
    if (!Array.isArray(hobbies) || !hobbies.every(hobby => typeof hobby === 'string')) {
      return 'Hobbies is an array of strings only.';
    }
    return null;
  }
  
  function validateUser(user) {
    const errors = [];
  
    const nameError = validateName(user.firstname);
    if (nameError) 
      errors.push({ field: 'firstname', message: nameError });
  
    const lastnameError = validateName(user.lastname);
    if (lastnameError)
       errors.push({ field: 'lastname', message: lastnameError });
  
    const emailError = validateEmail(user.email);
    if (emailError)
       errors.push({ field: 'email', message: emailError });
  
    const ageError = validateAge(user.age);
    if (ageError)
       errors.push({ field: 'age', message: ageError });
  
    const genderError = validateGender(user.gender);
    if (genderError)
       errors.push({ field: 'gender', message: genderError });
  
    const isActiveError = validateIsActive(user.isActive);
    if (isActiveError) 
      errors.push({ field: 'isActive', message: isActiveError });
  
    const addressError = validateAddress(user.address);
    if (addressError)
       errors.push({ field: 'address', message: addressError });
  
    const hobbiesError = validateHobbies(user.hobbies);
    if (hobbiesError)
       errors.push({ field: 'hobbies', message: hobbiesError });
    
  
    return {
      isValid: errors.length == 0,
      errors,
    };
  }
  
  
  module.exports = {
    validateName,
    validateEmail,
    // validatePassword,
    validateAge,
    validateGender,
    validateIsActive,
    validateAddress,
    validateHobbies,
    validateUser,
    
  };
  