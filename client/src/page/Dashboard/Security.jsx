import { useState } from "react";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import toast from "react-hot-toast";
import {
  useChangePasswordMutation,
  useGetMeQuery,
  useRemoveSecurityQuestionMutation,
  useSetSecurityQuestionMutation,
} from "../../redux/features/auth/authApi";
import TwoFactorSettings from "../../components/Dashboard/TwoFactorSettings";
import { logout } from "../../redux/features/auth/authSlice";
import { errorMessage } from "../../redux/api/baseApi";

const SUGGESTIONS = [
  "What was the name of your first pet?",
  "Which street did you grow up on?",
  "What was the first programming language you learned?",
  "What is the name of the teacher who influenced you most?",
];

/** Two-factor authentication, the recovery security question and password change. */
const Security = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const { data } = useGetMeQuery();
  const me = data?.data;
  const twoFactor = !!me?.twoFactorEnabled;
  const [setQuestion, { isLoading: savingQuestion }] = useSetSecurityQuestionMutation();
  const [removeQuestion, { isLoading: removingQuestion }] = useRemoveSecurityQuestionMutation();
  const [changePassword, { isLoading: changing }] = useChangePasswordMutation();
  const [question, setQuestionText] = useState("");

  const onQuestion = async (e) => {
    e.preventDefault();
    const formEl = e.currentTarget;
    const form = new FormData(formEl);
    const proof = { currentPassword: form.get("currentPassword"), ...(twoFactor ? { code: form.get("code") } : {}) };

    if (e.nativeEvent.submitter?.value === "remove") {
      try {
        await removeQuestion(proof).unwrap();
        toast.success("Security question removed");
        formEl.reset();
        setQuestionText("");
      } catch (err) {
        toast.error(errorMessage(err, "Could not remove"));
      }
      return;
    }

    if (form.get("answer") !== form.get("confirmAnswer")) {
      toast.error("The answers do not match");
      return;
    }
    try {
      await setQuestion({
        ...proof,
        question: form.get("question"),
        answer: form.get("answer"),
      }).unwrap();
      toast.success(
        twoFactor ? "Security question saved for account recovery." : "Security question saved. It will be asked at every sign in."
      );
      formEl.reset();
      setQuestionText("");
    } catch (err) {
      toast.error(errorMessage(err, "Could not save"));
    }
  };

  const onPassword = async (e) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    if (form.get("newPassword") !== form.get("confirmPassword")) {
      toast.error("The new passwords do not match");
      return;
    }
    try {
      await changePassword({ oldPassword: form.get("oldPassword"), newPassword: form.get("newPassword") }).unwrap();
      toast.success("Password changed. Sign in again.");
      dispatch(logout());
      router.replace("/dashboard/login");
    } catch (err) {
      toast.error(errorMessage(err, "Could not change password"));
    }
  };

  return (
    <div className="mx-auto max-w-2xl space-y-8">
      <TwoFactorSettings me={me} />

      <section className="rounded-xl border border-base-content/15 p-6">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
          <h2 className="text-lg font-bold">Security question (optional)</h2>
          <span className={`badge ${me?.hasSecurityQuestion ? "badge-success" : "badge-ghost"}`}>
            {me?.hasSecurityQuestion ? "set" : "not set"}
          </span>
        </div>
        <p className="mb-5 text-sm opacity-70">
          {twoFactor
            ? "Recovery option: if you lose your authenticator and backup codes, your password plus this answer signs you in and turns two-factor off. Leave it unset if you would rather rely on backup codes alone."
            : "Until two-factor is on, sign in asks this question after your password. Once two-factor is on it becomes a recovery option only."}{" "}
          Answers are stored hashed and are not case-sensitive. Pick something only you know that cannot be found online.
        </p>
        <form onSubmit={onQuestion} className="space-y-4">
          <label className="block">
            <span className="mb-1 block text-xs font-semibold uppercase tracking-wider opacity-70">Question</span>
            <input
              name="question"
              list="question-suggestions"
              required
              minLength={8}
              maxLength={200}
              value={question}
              onChange={(e) => setQuestionText(e.target.value)}
              className="input input-bordered input-sm w-full"
              placeholder="Write your own or pick a suggestion"
            />
            <datalist id="question-suggestions">
              {SUGGESTIONS.map((s) => (
                <option key={s} value={s} />
              ))}
            </datalist>
          </label>
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block">
              <span className="mb-1 block text-xs font-semibold uppercase tracking-wider opacity-70">Answer</span>
              <input name="answer" type="password" required minLength={3} maxLength={200} autoComplete="off" className="input input-bordered input-sm w-full" />
            </label>
            <label className="block">
              <span className="mb-1 block text-xs font-semibold uppercase tracking-wider opacity-70">Confirm answer</span>
              <input name="confirmAnswer" type="password" required minLength={3} maxLength={200} autoComplete="off" className="input input-bordered input-sm w-full" />
            </label>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block">
              <span className="mb-1 block text-xs font-semibold uppercase tracking-wider opacity-70">Current password</span>
              <input name="currentPassword" type="password" required autoComplete="current-password" className="input input-bordered input-sm w-full" />
            </label>
            {twoFactor && (
              <label className="block">
                <span className="mb-1 block text-xs font-semibold uppercase tracking-wider opacity-70">Authenticator or backup code</span>
                <input name="code" required autoComplete="one-time-code" maxLength={16} className="input input-bordered input-sm w-full" />
              </label>
            )}
          </div>
          <div className="flex flex-wrap gap-2">
            <button type="submit" className="btn btn-primary btn-sm" disabled={savingQuestion || removingQuestion}>
              {savingQuestion ? "Saving…" : me?.hasSecurityQuestion ? "Replace question" : "Save security question"}
            </button>
            {me?.hasSecurityQuestion && (
              <button
                type="submit"
                value="remove"
                formNoValidate
                className="btn btn-ghost btn-sm"
                disabled={savingQuestion || removingQuestion}
              >
                {removingQuestion ? "Removing…" : "Remove question"}
              </button>
            )}
          </div>
        </form>
      </section>

      <section className="rounded-xl border border-base-content/15 p-6">
        <h2 className="mb-1 text-lg font-bold">Change password</h2>
        <p className="mb-5 text-sm opacity-70">At least 8 characters. Changing it signs out every session, including this one.</p>
        <form onSubmit={onPassword} className="space-y-4">
          <label className="block">
            <span className="mb-1 block text-xs font-semibold uppercase tracking-wider opacity-70">Current password</span>
            <input name="oldPassword" type="password" required autoComplete="current-password" className="input input-bordered input-sm w-full" />
          </label>
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block">
              <span className="mb-1 block text-xs font-semibold uppercase tracking-wider opacity-70">New password</span>
              <input name="newPassword" type="password" required minLength={8} maxLength={128} autoComplete="new-password" className="input input-bordered input-sm w-full" />
            </label>
            <label className="block">
              <span className="mb-1 block text-xs font-semibold uppercase tracking-wider opacity-70">Confirm new password</span>
              <input name="confirmPassword" type="password" required minLength={8} maxLength={128} autoComplete="new-password" className="input input-bordered input-sm w-full" />
            </label>
          </div>
          <button type="submit" className="btn btn-sm" disabled={changing}>
            {changing ? "Changing…" : "Change password"}
          </button>
        </form>
      </section>
    </div>
  );
};

export default Security;
