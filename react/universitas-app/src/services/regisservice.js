import axios from "axios";

const API_URL = "http://localhost:8000/api/auth/";

const registrationService = {
  /**
   * Send user registration data to Django /register/ endpoint
   * @param {object} formData - Registration form data
   */
  register: async (formData) => {
    try {
      console.log("Attempting register with:", {
        email: formData.email,
        role: formData.role,
        major: formData.major,
      });

      // Auto-generate username from email (part before @)
      const username = formData.email.split("@")[0].toLowerCase();

      // Prepare payload
      const payload = {
        username: username,
        email: formData.email.toLowerCase().trim(),
        full_name: formData.full_name.trim(),
        major: formData.major,
        role: formData.role,
        password: formData.password,
        password_confirmation: formData.password_confirmation,
      };

      const response = await axios.post(`${API_URL}register/`, payload, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      console.log("Register response:", response.data);
      return response.data;
    } catch (error) {
      console.error("Register error:", error.response || error);

      // Throw error data to be handled by the form component
      if (error.response && error.response.data) {
        throw error.response.data;
      } else if (error.message) {
        throw { detail: error.message };
      } else {
        throw { detail: "Network error. Please check your connection." };
      }
    }
  },
};

export default registrationService;
