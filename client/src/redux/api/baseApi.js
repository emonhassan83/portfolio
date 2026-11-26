import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { logout } from "../features/auth/authSlice";

/**
 * All calls go to /api on this origin (proxied to the backend by next.config.mjs).
 * The session lives in httpOnly cookies, so no token is ever read or stored here.
 * The custom header is the CSRF guard the server requires on writes.
 */
const rawBaseQuery = fetchBaseQuery({
  baseUrl: "/api",
  credentials: "same-origin",
  prepareHeaders: (headers) => {
    headers.set("X-Requested-With", "portfolio-dashboard");
    return headers;
  },
});

const NO_REFRESH = [
  "/auth/login",
  "/auth/login/verify",
  "/auth/login/2fa",
  "/auth/login/recover",
  "/auth/refresh-token",
  "/auth/logout",
];
let refreshing = null; // shared promise so parallel 401s trigger one refresh

const baseQueryWithRefresh = async (args, api, extraOptions) => {
  let result = await rawBaseQuery(args, api, extraOptions);
  const url = typeof args === "string" ? args : args.url;

  if (result.error?.status === 401 && !NO_REFRESH.includes(url)) {
    refreshing ??= Promise.resolve(
      rawBaseQuery({ url: "/auth/refresh-token", method: "POST" }, api, extraOptions)
    ).finally(() => {
      refreshing = null;
    });
    const refreshed = await refreshing;

    if (refreshed.data) {
      result = await rawBaseQuery(args, api, extraOptions);
    } else {
      api.dispatch(logout());
    }
  }
  return result;
};

const baseApi = createApi({
  reducerPath: "api",
  baseQuery: baseQueryWithRefresh,
  tagTypes: ["Auth", "Portfolio", "Messages"],
  endpoints: () => ({}),
});

/** Readable message from an RTK Query error. */
export const errorMessage = (error, fallback = "Something went wrong") =>
  error?.data?.errorSources?.find((e) => e.path)
    ? error.data.errorSources.map((e) => (e.path ? `${e.path}: ${e.message}` : e.message)).join(" · ")
    : error?.data?.message || error?.error || fallback;

export default baseApi;
