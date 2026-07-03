import toast, { Toaster } from "react-hot-toast";
import PortfolioForm from "../../components/form/PortfolioForm";
import PortfolioInput from "../../components/form/PortfolioInput";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useRegisterUserMutation } from "../../redux/features/userApi";
import { verifyToken } from "../../utils/verifyToken";
import { useDispatch } from "react-redux";
import { setUser } from "../../redux/features/auth/authSlice";

const RegisterPage = () => {
  const [registerUser] = useRegisterUserMutation();
  const router = useRouter();
  const dispatch = useDispatch();

  const onSubmit = async (data) => {
    try {
      const res = await registerUser(data).unwrap();
      // console.log(res);

      const user = verifyToken(res.data.accessToken);

      if (res.success) {
        toast.success("User register successfully!");
        dispatch(setUser({ user: user, token: res.data.accessToken }));
        router.push("/");
      }
    } catch (error) {
      toast.error(error.message);
      console.error(error.message);
    }
  };

  return (
    <div className="md:flex justify-center items-center md:h-[100vh]">
      <Toaster />
      <div className="mt-6 bg-gray-50 w-[480px] h-[600px] rounded-md p-10 mx-auto shadow-md border-slate-950">
        <h2 className="text-xl sm:text-2xl font-bold text-center mb-2">
          Register Please
        </h2>
        <p className="text-sm text-gray-400 text-center mb-8">
          Sign up to access your account
        </p>
        <PortfolioForm onSubmit={onSubmit}>
          <PortfolioInput
            type="text"
            name="name"
            label="Username"
            placeholder="Enter Your Name ..."
          />
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
          <div className="flex items-center justify-center gap-4">
            <PortfolioInput
              type="text"
              name="contactNumber"
              label="Contact Number"
              placeholder="Your Contact Number ..."
            />
            <PortfolioInput
              type="text"
              name="address"
              label="Address"
              placeholder="Enter Your Address ..."
            />
          </div>
          <input
            type="submit"
            value="Register"
            className="btn btn-color border-none btn-block rounded-3xl mt-4"
          />
          <p className="text-center mt-2">
            <small>
              Already have an account Please{" "}
              <Link to="/login" className="text-color font-bold">
                Sign In
              </Link>
            </small>
          </p>
        </PortfolioForm>
      </div>
    </div>
  );
};

export default RegisterPage;
