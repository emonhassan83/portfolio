import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { useDispatch } from "react-redux";
import {
  useLoginMutation,
  useRecoverLoginMutation,
  useVerifyLoginMutation,
  useVerifyTwoFactorMutation,
} from "../../redux/features/auth/authApi";
import { setUser } from "../../redux/features/auth/authSlice";
import { errorMessage } from "../../redux/api/baseApi";

const DASHBOARD = "/dashboard/portfolio";
const SECURITY = "/dashboard/security";

const inputCls =
  "w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2.5 text-sm text-white placeholder-white/30 outline-none transition focus:border-[#d6ff4b] focus:ring-1 focus:ring-[#d6ff4b]";

/** Password field with a show/hide toggle. */
const PasswordInput = (props) => {
  const [visible, setVisible] = useState(false);
  const Icon = visible ? FiEyeOff : FiEye;
  return (
    <span className="relative block">
      <input {...props} type={visible ? "text" : "password"} className={`${inputCls} pr-11`} />
      <button
        type="button"
        onClick={() => setVisible((v) => !v)}
        aria-label={visible ? "Hide password" : "Show password"}
        aria-pressed={visible}
        className="absolute inset-y-0 right-0 flex w-11 items-center justify-center text-white/50 transition hover:text-[#d6ff4b] focus-visible:text-[#d6ff4b] focus-visible:outline-none"
      >
        <Icon aria-hidden="true" className="h-4 w-4" />
      </button>
    </span>
  );
};

/**
 * Two-step sign in: password, then a code from the authenticator app (or a
 * one-time backup code). Accounts without an authenticator fall back to their
 * security question. The server only sets the session cookie after both steps pass.
 */
const LoginPage = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const [login, { isLoading: checkingPassword }] = useLoginMutation();
  const [verify, { isLoading: checkingAnswer }] = useVerifyLoginMutation();
  const [verifyCode, { isLoading: checkingCode }] = useVerifyTwoFactorMutation();
  const [recover, { isLoading: recovering }] = useRecoverLoginMutation();

  const [step, setStep] = useState("password"); // "password" | "totp" | "recover" | "challenge"
  const [challenge, setChallenge] = useState(null); // { challengeToken, question?, recoveryQuestion? }
  const [useBackupCode, setUseBackupCode] = useState(false);
  const [error, setError] = useState("");

  const finish = (user, to = DASHBOARD) => {
    dispatch(setUser(user));
    router.replace(user.role === "admin" ? to : "/");
  };

  // An expired challenge or a lockout means starting again from the password.
  const failStep = (err, fallback) => {
    const msg = errorMessage(err, fallback);
    setError(msg);
    if (/expired|too many/i.test(msg)) {
      setStep("password");
      setChallenge(null);
    }
  };

  const onPassword = async (e) => {
    e.preventDefault();
    setError("");
    const form = new FormData(e.currentTarget);
    try {
      const res = await login({ email: form.get("email"), password: form.get("password") }).unwrap();
      if (res.data.step === "totp" || res.data.step === "challenge") {
        setChallenge(res.data);
        setUseBackupCode(false);
        setStep(res.data.step);
      } else {
        finish(res.data.user);
      }
    } catch (err) {
      setError(errorMessage(err, "Sign in failed"));
    }
  };

  const onAnswer = async (e) => {
    e.preventDefault();
    setError("");
    const form = new FormData(e.currentTarget);
    try {
      const res = await verify({ challengeToken: challenge.challengeToken, answer: form.get("answer") }).unwrap();
      finish(res.data.user);
    } catch (err) {
      failStep(err, "Verification failed");
    }
  };

  const onCode = async (e) => {
    e.preventDefault();
    setError("");
    const form = new FormData(e.currentTarget);
    try {
      const res = await verifyCode({ challengeToken: challenge.challengeToken, code: form.get("code") }).unwrap();
      // A spent backup code is a prompt to check how many are left.
      finish(res.data.user, res.data.usedBackupCode ? SECURITY : DASHBOARD);
    } catch (err) {
      failStep(err, "Verification failed");
    }
  };

  const onRecover = async (e) => {
    e.preventDefault();
    setError("");
    const form = new FormData(e.currentTarget);
    try {
      const res = await recover({ challengeToken: challenge.challengeToken, answer: form.get("answer") }).unwrap();
      finish(res.data.user, SECURITY);
    } catch (err) {
      failStep(err, "Recovery failed");
    }
  };

  const goTo = (next) => {
    setStep(next);
    setError("");
  };

  const errorBox = error && (
    <p role="alert" className="rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-300">
      {error}
    </p>
  );
  const linkCls = "text-xs text-white/60 underline underline-offset-4 hover:text-[#d6ff4b]";
  const backCls = "rounded-lg border border-white/15 px-4 py-2.5 text-sm text-white/70 hover:border-white/40";
  const submitCls =
    "flex-1 rounded-lg bg-[#d6ff4b] px-4 py-2.5 text-sm font-semibold text-black transition hover:brightness-110 disabled:opacity-60";

  const back = () => {
    setStep("password");
    setChallenge(null);
    setError("");
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#0b0b0a] px-4 py-10 font-mono text-white">
      <div className="w-full max-w-md">
        <Link href="/" className="mb-6 inline-block text-xs uppercase tracking-[0.2em] text-white/50 hover:text-[#d6ff4b]">
          ← back to site
        </Link>

        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 shadow-2xl sm:p-8">
          <div className="mb-6 flex items-center justify-between text-[0.7rem] uppercase tracking-[0.2em] text-white/50">
            <span>auth / dashboard</span>
            <span aria-hidden="true">
              step {step === "password" ? "1" : "2"} / 2
            </span>
          </div>

          <ol className="mb-6 grid grid-cols-2 gap-2" aria-label="Sign in progress">
            {["password", "challenge"].map((s, i) => (
              <li
                key={s}
                aria-current={(step === "password") === (s === "password") ? "step" : undefined}
                className={`h-1 rounded-full ${s === "password" || step !== "password" ? "bg-[#d6ff4b]" : "bg-white/10"}`}
              >
                <span className="sr-only">{i === 0 ? "Password" : "Second step"}</span>
              </li>
            ))}
          </ol>

          {step === "password" ? (
            <form onSubmit={onPassword} className="space-y-4" noValidate>
              <div>
                <h1 className="font-sans text-2xl font-semibold">Sign in</h1>
                <p className="mt-1 text-sm text-white/50">Admin access to the portfolio dashboard.</p>
              </div>
              <label className="block">
                <span className="mb-1.5 block text-xs uppercase tracking-wider text-white/60">Email</span>
                <input name="email" type="email" required autoComplete="username" className={inputCls} placeholder="you@example.com" />
              </label>
              <label className="block">
                <span className="mb-1.5 block text-xs uppercase tracking-wider text-white/60">Password</span>
                <PasswordInput name="password" required autoComplete="current-password" placeholder="••••••••" />
              </label>
              {error && (
                <p role="alert" className="rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-300">
                  {error}
                </p>
              )}
              <button
                type="submit"
                disabled={checkingPassword}
                className="w-full rounded-lg bg-[#d6ff4b] px-4 py-2.5 text-sm font-semibold text-black transition hover:brightness-110 disabled:opacity-60"
              >
                {checkingPassword ? "Checking…" : "Continue →"}
              </button>
            </form>
          ) : step === "totp" ? (
            <form onSubmit={onCode} className="space-y-4" noValidate>
              <div>
                <h1 className="font-sans text-2xl font-semibold">Two-factor code</h1>
                <p className="mt-1 text-sm text-white/50">
                  {useBackupCode
                    ? "Enter one of your backup codes. Each code works once."
                    : "Enter the 6-digit code from your authenticator app."}
                </p>
              </div>
              <label className="block">
                <span className="mb-1.5 block text-xs uppercase tracking-wider text-white/60">
                  {useBackupCode ? "Backup code" : "Authentication code"}
                </span>
                <input
                  key={useBackupCode ? "backup" : "totp"}
                  name="code"
                  required
                  autoFocus
                  autoComplete="one-time-code"
                  inputMode={useBackupCode ? "text" : "numeric"}
                  maxLength={useBackupCode ? 16 : 7}
                  className={`${inputCls} tracking-[0.3em]`}
                  placeholder={useBackupCode ? "XXXXX-XXXXX" : "000000"}
                />
              </label>
              {errorBox}
              <div className="flex gap-3">
                <button type="button" onClick={back} className={backCls}>
                  Back
                </button>
                <button type="submit" disabled={checkingCode} className={submitCls}>
                  {checkingCode ? "Verifying…" : "Verify & enter"}
                </button>
              </div>
              <div className="flex flex-wrap justify-between gap-2 pt-1">
                <button type="button" onClick={() => setUseBackupCode((v) => !v)} className={linkCls}>
                  {useBackupCode ? "Use the authenticator app" : "Use a backup code"}
                </button>
                {challenge?.recoveryQuestion && (
                  <button type="button" onClick={() => goTo("recover")} className={linkCls}>
                    Lost your device?
                  </button>
                )}
              </div>
            </form>
          ) : step === "recover" ? (
            <form onSubmit={onRecover} className="space-y-4" noValidate>
              <div>
                <h1 className="font-sans text-2xl font-semibold">Account recovery</h1>
                <p className="mt-1 text-sm text-white/50">
                  Answering your security question signs you in, turns two-factor off and signs out every other session. Set
                  it up again straight away.
                </p>
              </div>
              <div className="rounded-lg border border-white/10 bg-black/40 px-3 py-3 text-sm">
                <span className="text-[#d6ff4b]">?</span> {challenge?.recoveryQuestion}
              </div>
              <label className="block">
                <span className="mb-1.5 block text-xs uppercase tracking-wider text-white/60">Your answer</span>
                <PasswordInput name="answer" required autoFocus autoComplete="off" placeholder="Not case-sensitive" />
              </label>
              {errorBox}
              <div className="flex gap-3">
                <button type="button" onClick={() => goTo("totp")} className={backCls}>
                  Back
                </button>
                <button type="submit" disabled={recovering} className={submitCls}>
                  {recovering ? "Checking…" : "Recover account"}
                </button>
              </div>
            </form>
          ) : (
            <form onSubmit={onAnswer} className="space-y-4" noValidate>
              <div>
                <h1 className="font-sans text-2xl font-semibold">One more check</h1>
                <p className="mt-1 text-sm text-white/50">Answer your security question. This request expires in 5 minutes.</p>
              </div>
              <div className="rounded-lg border border-white/10 bg-black/40 px-3 py-3 text-sm">
                <span className="text-[#d6ff4b]">?</span> {challenge?.question}
              </div>
              <label className="block">
                <span className="mb-1.5 block text-xs uppercase tracking-wider text-white/60">Your answer</span>
                <PasswordInput name="answer" required autoFocus autoComplete="off" placeholder="Not case-sensitive" />
              </label>
              {error && (
                <p role="alert" className="rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-300">
                  {error}
                </p>
              )}
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={back}
                  className="rounded-lg border border-white/15 px-4 py-2.5 text-sm text-white/70 hover:border-white/40"
                >
                  Back
                </button>
                <button
                  type="submit"
                  disabled={checkingAnswer}
                  className="flex-1 rounded-lg bg-[#d6ff4b] px-4 py-2.5 text-sm font-semibold text-black transition hover:brightness-110 disabled:opacity-60"
                >
                  {checkingAnswer ? "Verifying…" : "Verify & enter"}
                </button>
              </div>
            </form>
          )}
        </div>

        <p className="mt-4 text-center text-[0.7rem] text-white/30">
          5 failed attempts lock the account for 15 minutes.
        </p>
      </div>
    </main>
  );
};

export default LoginPage;
