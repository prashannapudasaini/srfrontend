// frontend/src/services/auth.js

// Hardcode your backend API URL (adjust to your actual backend)
// frontend/src/services/auth.js

const API_BASE_URL = 'http://localhost/sita-ram-dairy/backend/api';

/**
 * Login user with email/phone and password
 * @param {Object} credentials - { email, password } or { loginId, password }
 * @returns {Promise<Object>} - { success, user?, token?, error? }
 */
export const loginUser = async (credentials) => {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/login.php`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials)
    });

    const data = await response.json();

    if (response.ok && data.status === 'success') {
      return {
        success: true,
        user: data.data.user,
        token: data.data.token
      };
    } else {
      return {
        success: false,
        error: data.message || 'Invalid credentials'
      };
    }
  } catch (error) {
    console.error('Login API error:', error);
    return {
      success: false,
      error: 'Network error. Please check your connection.'
    };
  }
};

/**
 * Register a new user
 * @param {Object} userData - { name, email, phone, address, password }
 * @returns {Promise<Object>} - { success, message?, error?, fieldErrors? }
 */
export const registerUser = async (userData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/register.php`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData)
    });

    const data = await response.json();

    if (response.ok && data.status === 'success') {
      return {
        success: true,
        message: data.message || 'Account created successfully!'
      };
    } else if (response.status === 422 && data.errors) {
      return {
        success: false,
        error: data.message || 'Validation failed',
        fieldErrors: data.errors
      };
    } else if (response.status === 409) {
      return {
        success: false,
        error: data.message || 'User already exists'
      };
    } else {
      return {
        success: false,
        error: data.message || 'Registration failed. Please try again.'
      };
    }
  } catch (error) {
    console.error('Registration API error:', error);
    return {
      success: false,
      error: 'Network error. Please check your connection.'
    };
  }
};

/**
 * Logout user (clears local storage only)
 * @returns {Promise<Object>} - { success: true, message }
 */
export const logoutUser = async () => {
  localStorage.removeItem('sitaRamToken');
  localStorage.removeItem('sitaRamUser');
  localStorage.removeItem('cartItems');
  localStorage.removeItem('sitaRamCart');
  return { success: true, message: 'Logged out securely' };
};