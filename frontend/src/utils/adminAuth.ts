// Sends the admin's login token with every request the admin pages make to
// the API, and sends the admin back to the sign-in page when the server says
// the login has ended (401). Installed once by the Admin layout.
import axios from "axios";

const LOGIN_PAGE = "/lic-auth-v9v3tz";

// The admin pages reach the API through these addresses.
const API_BASES = [
  process.env.NEXT_PUBLIC_API_URL,
  "https://leaders-bf42.onrender.com",
  "http://localhost:3000",
]
  .filter((b): b is string => !!b)
  .map((b) => b.replace(/\/+$/, ""));

const isApi = (url: string) =>
  API_BASES.some((b) => url === b || url.startsWith(b + "/"));

const isLoginCall = (url: string) => /\/auth\/login(\?|$)/.test(url);

function readToken(): string | null {
  try {
    return sessionStorage.getItem("admin_token");
  } catch {
    return null;
  }
}

let leaving = false;

function sessionEnded() {
  if (leaving) return;
  leaving = true;
  try {
    if (sessionStorage.getItem("admin_token")) {
      sessionStorage.setItem("admin_session_ended", "true");
    }
    sessionStorage.removeItem("admin_token");
    sessionStorage.removeItem("admin_role");
  } catch {
    // storage blocked: still go to the sign-in page
  }
  window.location.href = LOGIN_PAGE;
}

let installed = false;

export function installAdminAuth() {
  if (installed || typeof window === "undefined") return;
  installed = true;

  // Pages that use axios (they always pass the full URL)
  axios.interceptors.request.use((config) => {
    const token = readToken();
    if (token && isApi(config.url ?? "")) {
      config.headers = config.headers ?? {};
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  });
  axios.interceptors.response.use(
    (response) => response,
    (error) => {
      const url: string = error?.config?.url ?? "";
      if (error?.response?.status === 401 && isApi(url) && !isLoginCall(url)) {
        sessionEnded();
      }
      return Promise.reject(error);
    },
  );

  // Pages that use fetch
  const realFetch = window.fetch.bind(window);
  window.fetch = async (input: RequestInfo | URL, init?: RequestInit) => {
    const url =
      typeof input === "string"
        ? input
        : input instanceof URL
          ? input.href
          : input.url;
    const token = readToken();
    if (token && isApi(url)) {
      const headers = new Headers(
        init?.headers ?? (input instanceof Request ? input.headers : undefined),
      );
      if (!headers.has("Authorization")) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      init = { ...init, headers };
    }
    const response = await realFetch(input, init);
    if (response.status === 401 && isApi(url) && !isLoginCall(url)) {
      sessionEnded();
    }
    return response;
  };
}
