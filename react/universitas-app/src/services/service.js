import axios from "axios";

const API_URL = "http://localhost:8000/api/";

// ✅ Buat instance axios
const api = axios.create({
  baseURL: API_URL,
  timeout: 10000,
});

// ✅ Interceptor untuk logging
api.interceptors.response.use(
  (response) => {
    console.log("✅ API Success:", response.config.url, response.status);
    return response;
  },
  (error) => {
    console.error("❌ API Error:", error.config?.url);
    console.error("Details:", error.response);
    return Promise.reject(error);
  }
);

const authService = {
  register: async (formData) => {
    try {
      const payload = {
        email: formData.email.toLowerCase(),
        full_name: formData.full_name,
        major: formData.major,
        role: formData.role,
        password: formData.password,
        password_confirmation: formData.password_confirmation,
      };
      const res = await api.post("auth/register/", payload);
      return res.data;
    } catch (err) {
      throw err.response?.data || { message: err.message };
    }
  },

  login: async (email, password) => {
    try {
      console.log("🔐 Logging in:", email);
      const res = await api.post("auth/login/", {
        email: email.toLowerCase(),
        password,
      });

      if (res.data) {
        localStorage.setItem("user", JSON.stringify(res.data));
        console.log("💾 User saved:", res.data);
      }

      return res.data;
    } catch (err) {
      console.error("❌ Login error:", err);
      throw err.response?.data || { message: err.message };
    }
  },

  logout: () => {
    localStorage.removeItem("user");
    console.log("🚪 Logged out");
  },

  getCurrentUser: () => {
    try {
      const data = localStorage.getItem("user");
      if (!data) return null;
      const user = JSON.parse(data);
      return user;
    } catch (err) {
      console.error("❌ Parse error:", err);
      return null;
    }
  },
};

// ✅ Dashboard Service
const dashboardService = {
  getStudentDashboard: async () => {
    const user = authService.getCurrentUser();

    if (!user || user.role !== "student") {
      throw new Error("Unauthorized: Student access only.");
    }

    const url = `dashboard/student/?email=${encodeURIComponent(user.email)}`;
    const res = await api.get(url);
    return res.data;
  },

  getInstructorDashboard: async () => {
    const user = authService.getCurrentUser();

    if (!user || user.role !== "instructor") {
      throw new Error("Unauthorized: Instructor access only.");
    }

    // ✅ Tambahan validasi domain email
    if (!user.email.endsWith("@prasetiyamulya.ac.id")) {
      throw new Error("Access denied: Only @prasetiyamulya.ac.id emails are allowed.");
    }

    const url = `dashboard/instructor/?email=${encodeURIComponent(user.email)}`;
    const res = await api.get(url);
    return res.data;
  },
};

// ✅ Jangan lupa tutup objek sebelum export
export { authService, dashboardService };
