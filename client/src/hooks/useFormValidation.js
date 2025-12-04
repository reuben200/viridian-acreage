import { useState } from "react";

/**
 * Custom hook for form validation
 * Provides email and password validation with error state management
 */
const useFormValidation = () => {
  const [errors, setErrors] = useState({});

  /**
   * Validates email format using regex
   * @param {string} email - Email address to validate
   * @returns {boolean} - True if valid email format
   */
  const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  /**
   * Validates password length
   * @param {string} password - Password to validate
   * @returns {boolean} - True if password meets minimum length
   */
  const validatePassword = (password) => {
    return password.length >= 6;
  };

  /**
   * Validates entire form and sets error messages
   * @param {Object} form - Form object with email and password
   * @returns {boolean} - True if form is valid
   */
  const validate = (form) => {
    const newErrors = {};

    if (!form.email) {
      newErrors.email = "Email is required";
    } else if (!validateEmail(form.email)) {
      newErrors.email = "Please enter a valid email";
    }

    if (!form.password) {
      newErrors.password = "Password is required";
    } else if (!validatePassword(form.password)) {
      newErrors.password = "Password must be at least 6 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /**
   * Clears a specific field error
   * @param {string} fieldName - Name of the field to clear error for
   */
  const clearError = (fieldName) => {
    setErrors((prev) => {
      const updated = { ...prev };
      delete updated[fieldName];
      return updated;
    });
  };

  /**
   * Clears all errors
   */
  const clearAllErrors = () => {
    setErrors({});
  };

  return {
    errors,
    validate,
    setErrors,
    clearError,
    clearAllErrors,
    validateEmail,
    validatePassword,
  };
};

export default useFormValidation;
