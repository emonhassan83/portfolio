import Link from "next/link";
import { useRouter } from "next/navigation";
import PortfolioForm from "../../components/form/PortfolioForm";
import toast, { Toaster } from "react-hot-toast";
import PortfolioInput from "../../components/form/PortfolioInput";
import { useLoginMutation } from "../../redux/features/auth/authApi";
import { useDispatch } from "react-redux";
import { setUser } from "../../redux/features/auth/authSlice";
import { verifyToken } from "../../utils/verifyToken";

const LoginPage = () => {
  const [login] = useLoginMutation();
  const router = useRouter();
  const dispatch = useDispatch();

  const onSubmit = async (data) => {
    try {
      const res = await login(data).unwrap();
      // console.log(res);
      
      const user = verifyToken(res.data.accessToken);

      if (res.success) {
        toast.success("User login successfully!");
        dispatch(setUser({ user: user, token: res.data.accessToken }));
        if (user.role === "admin") {
          router.push("/dashboard/manage-projects");
        } else {
          router.push("/");
        }
      }
    } catch (error) {
      toast.error(error.message);
      console.error(error.message);
    }
  };

  return (
    <div className="md:flex justify-center items-center md:h-[100vh]">
      <Toaster />
      <div className="mt-6 bg-gray-50 w-[480px] h-[460px] rounded-md p-10 mx-auto shadow-md border-slate-950">
        <h2 className="text-xl sm:text-2xl font-bold text-center mb-2">
          Login Please
        </h2>
        <p className="text-sm text-gray-400 text-center mb-8">
          Sign in to access your account
        </p>
        <PortfolioForm onSubmit={onSubmit}>
          <PortfolioInput
            type="email"
            name="email"
            label="Username Or Email"
            placeholder="Enter Your Email ..."
          />
          <PortfolioInput
            type="password"
            name="password"
            label="Password"
            placeholder="Enter Your Password ..."
          />
          <input
            type="submit"
            value="Login"
            className="btn btn-color border-none btn-block rounded-3xl mt-4"
          />
          <p className="text-center mt-2">
            <small>
              New to here Please{" "}
              <Link to="/register" className="text-color font-bold">
                Sign Up
              </Link>
            </small>
          </p>
        </PortfolioForm>
      </div>
    </div>
  );
};

export default LoginPage;
