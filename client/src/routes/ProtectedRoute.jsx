import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { useGetMeQuery } from "../redux/features/auth/authApi";
import { logout, setUser } from "../redux/features/auth/authSlice";

/**
 * Asks the server whether the session cookie is valid (and refreshes it if the
 * access token expired). Only admins get into the dashboard.
 */
const ProtectedRoute = ({ children }) => {
  const router = useRouter();
  const dispatch = useDispatch();
  const { data, isLoading, isError } = useGetMeQuery(undefined, { refetchOnMountOrArgChange: true });
  const user = data?.data;
  const allowed = user?.role === "admin";

  useEffect(() => {
    if (user) dispatch(setUser(user));
    if (isError || (user && !allowed)) {
      dispatch(logout());
      router.replace("/dashboard/login");
    }
  }, [user, allowed, isError, dispatch, router]);

  if (isLoading || !allowed) {
    return (
      <div className="flex min-h-screen items-center justify-center" role="status">
        <span className="loading loading-spinner loading-md" aria-label="Checking session" />
      </div>
    );
  }

  return children;
};

export default ProtectedRoute;
