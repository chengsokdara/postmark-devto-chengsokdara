export const PATHS = {
  API: {
    FIREBASE: {
      AUTH: {
        LOGIN: "/api/firebase/auth/login",
        LOGOUT: "/api/firebase/auth/logout",
      },
    },
  },
} as const;

export enum COLLECTIONS {
  PROFILES = "profiles",
}

export enum ROUTES {
  AUTH = "/auth",
  DASHBOARD = "/dashboard",
  HOME = "/",
}
