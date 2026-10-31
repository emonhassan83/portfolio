import { useSelector } from "react-redux";
import { useCurrentToken } from "../redux/features/auth/authSlice";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const ProtectedRoute = ({ children }) => {
  const token = useSelector(useCurrentToken);
  const router = useRouter();

  useEffect(() => {
    if (!token) {
      router.replace("/login");
    }
  }, [token, router]);

  if (!token) {
    return null;
  }

  return children;
};

export default ProtectedRoute;
