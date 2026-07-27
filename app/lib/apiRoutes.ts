const API = {
  AUTH: {
    LOGIN: "/auth/login",
    LOGOUT: "/auth/logout",
    PROFILE: "/auth/profile",
  },

  EMPLOYEE: {
    LIST: "/employees",
    CREATE: "/employees",
    GET: (id: number | string) => `/employees/${id}`,
    UPDATE: (id: number | string) => `/employees/${id}`,
    DELETE: (id: number | string) => `/employees/${id}`,
  },

  ROLE: {
    LIST: "/role",
    CREATE: "/role",
    GET: (id: number | string) => `/role/${id}`,
    UPDATE: (id: number | string) => `/role/${id}`,
    DELETE: (id: number | string) => `/role/${id}`,
  },

  MASTER: {
    DROPDOWN: "/master",
  },
};

export default API;