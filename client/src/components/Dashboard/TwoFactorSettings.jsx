import { useEffect, useState } from "react";
import QRCode from "qrcode";
import toast from "react-hot-toast";
import {
  useDisableTwoFactorMutation,
  useEnableTwoFactorMutation,
  useRegenerateBackupCodesMutation,
  useSetupTwoFactorMutation,
} from "../../redux/features/auth/authApi";
import { errorMessage } from "../../redux/api/baseApi";

const labelCls = "mb-1 block text-xs font-semibold uppercase tracking-wider opacity-70";
const inputCls = "input input-bordered input-sm w-full";

/** Backup codes are returned by the server exactly once, so they stay on screen until dismissed. */
const BackupCodes = ({ codes, onDone }) => {
  const text = codes.join("\n");

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success("Backup codes copied");
    } catch {
      toast.error("Could not copy. Select the codes and copy them manually.");
    }
  };

  const download = () => {
    const url = URL.createObjectURL(new Blob([`Portfolio dashboard backup codes\n\n${text}\n`], { type: "text/plain" }));
    const link = document.createElement("a");
    link.href = url;
    link.download = "portfolio-backup-codes.txt";
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div role="status" className="rounded-lg border border-warning/50 bg-warning/10 p-4">
      <h3 className="font-bold">Save your backup codes</h3>
      <p className="mt-1 text-sm opacity-80">
        Each code signs you in once if you lose your phone. They will not be shown again, so store them somewhere safe and
        offline.
      </p>
      <ul className="my-4 grid grid-cols-2 gap-2 font-mono text-sm">
        {codes.map((code) => (
          <li key={code} className="rounded bg-base-200 px-3 py-1.5 text-center tracking-wider">
            {code}
          </li>
        ))}
      </ul>
      <div className="flex flex-wrap gap-2">
        <button type="button" className="btn btn-sm" onClick={copy}>
          Copy
        </button>
        <button type="button" className="btn btn-sm" onClick={download}>
          Download .txt
        </button>
        <button type="button" className="btn btn-primary btn-sm" onClick={onDone}>
          I have saved them
        </button>
      </div>
    </div>
  );
};

/** Authenticator app (TOTP) enrolment, backup codes and switching two-factor off. */
const TwoFactorSettings = ({ me }) => {
  const [setup, { isLoading: starting }] = useSetupTwoFactorMutation();
  const [enable, { isLoading: enabling }] = useEnableTwoFactorMutation();
  const [disable, { isLoading: disabling }] = useDisableTwoFactorMutation();
  const [regenerate, { isLoading: regenerating }] = useRegenerateBackupCodesMutation();

  const [enrolment, setEnrolment] = useState(null); // { secret, otpauthUrl }
  const [qr, setQr] = useState("");
  const [backupCodes, setBackupCodes] = useState(null);
  const enabled = !!me?.twoFactorEnabled;

  // The QR code is drawn in the browser, so the secret is never sent to a third party.
  useEffect(() => {
    if (!enrolment) return setQr("");
    let current = true;
    QRCode.toDataURL(enrolment.otpauthUrl, { margin: 1, width: 200 })
      .then((url) => current && setQr(url))
      .catch(() => current && setQr(""));
    return () => {
      current = false;
    };
  }, [enrolment]);

  const onStart = async (e) => {
    e.preventDefault();
    const formEl = e.currentTarget;
    try {
      const res = await setup({ currentPassword: new FormData(formEl).get("currentPassword") }).unwrap();
      setEnrolment(res.data);
      formEl.reset();
    } catch (err) {
      toast.error(errorMessage(err, "Could not start setup"));
    }
  };

  const onConfirm = async (e) => {
    e.preventDefault();
    try {
      const res = await enable({ code: new FormData(e.currentTarget).get("code") }).unwrap();
      setEnrolment(null);
      setBackupCodes(res.data.backupCodes);
      toast.success("Two-factor authentication is on");
    } catch (err) {
      toast.error(errorMessage(err, "Could not verify the code"));
    }
  };

  // One form, two actions: the clicked button decides which one runs.
  const onManage = async (e) => {
    e.preventDefault();
    const formEl = e.currentTarget;
    const form = new FormData(formEl);
    const payload = { currentPassword: form.get("currentPassword"), code: form.get("code") };
    const turnOff = e.nativeEvent.submitter?.value === "disable";
    try {
      if (turnOff) {
        await disable(payload).unwrap();
        setBackupCodes(null);
        toast.success("Two-factor authentication is off");
      } else {
        const res = await regenerate(payload).unwrap();
        setBackupCodes(res.data.backupCodes);
        toast.success("New backup codes generated");
      }
      formEl.reset();
    } catch (err) {
      toast.error(errorMessage(err, turnOff ? "Could not turn it off" : "Could not generate codes"));
    }
  };

  return (
    <section className="rounded-xl border border-base-content/15 p-6">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
        <h2 className="text-lg font-bold">Two-factor authentication</h2>
        <span className={`badge ${enabled ? "badge-success" : "badge-warning"}`}>{enabled ? "on" : "off"}</span>
      </div>
      <p className="mb-5 text-sm opacity-70">
        After your password, sign in asks for a 6-digit code from an authenticator app such as Google Authenticator. Backup
        codes cover a lost phone.
      </p>

      {backupCodes && (
        <div className="mb-5">
          <BackupCodes codes={backupCodes} onDone={() => setBackupCodes(null)} />
        </div>
      )}

      {!enabled && !enrolment && (
        <form onSubmit={onStart} className="space-y-4">
          <label className="block">
            <span className={labelCls}>Current password</span>
            <input name="currentPassword" type="password" required autoComplete="current-password" className={inputCls} />
          </label>
          <button type="submit" className="btn btn-primary btn-sm" disabled={starting}>
            {starting ? "Starting…" : "Set up authenticator app"}
          </button>
        </form>
      )}

      {!enabled && enrolment && (
        <form onSubmit={onConfirm} className="space-y-4">
          <ol className="list-decimal space-y-1 pl-5 text-sm">
            <li>Open your authenticator app and add an account.</li>
            <li>Scan the QR code, or type the key in manually.</li>
            <li>Enter the 6-digit code the app shows.</li>
          </ol>
          <div className="flex flex-wrap items-center gap-5">
            {qr ? (
              <img src={qr} alt="QR code for your authenticator app" width={200} height={200} className="rounded bg-white p-2" />
            ) : (
              <div className="flex h-[200px] w-[200px] items-center justify-center rounded border border-base-content/15 text-xs opacity-60">
                QR code unavailable. Use the key.
              </div>
            )}
            <div className="min-w-0 flex-1">
              <span className={labelCls}>Setup key</span>
              <code className="block break-all rounded bg-base-200 px-3 py-2 text-sm tracking-wider">
                {enrolment.secret.match(/.{1,4}/g).join(" ")}
              </code>
              <p className="mt-2 text-xs opacity-60">Time-based, 6 digits, 30 seconds.</p>
            </div>
          </div>
          <label className="block max-w-xs">
            <span className={labelCls}>Code from the app</span>
            <input
              name="code"
              required
              inputMode="numeric"
              autoComplete="one-time-code"
              pattern="[0-9 ]{6,7}"
              maxLength={7}
              className={inputCls}
              placeholder="000000"
            />
          </label>
          <div className="flex gap-2">
            <button type="submit" className="btn btn-primary btn-sm" disabled={enabling}>
              {enabling ? "Verifying…" : "Turn on two-factor"}
            </button>
            <button type="button" className="btn btn-ghost btn-sm" onClick={() => setEnrolment(null)}>
              Cancel
            </button>
          </div>
        </form>
      )}

      {enabled && (
        <form onSubmit={onManage} className="space-y-4">
          <p className="text-sm">
            Backup codes left: <strong>{me?.backupCodesRemaining ?? 0}</strong>
            {(me?.backupCodesRemaining ?? 0) <= 3 && <span className="ml-2 text-warning">Generate a new set soon.</span>}
          </p>
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block">
              <span className={labelCls}>Current password</span>
              <input name="currentPassword" type="password" required autoComplete="current-password" className={inputCls} />
            </label>
            <label className="block">
              <span className={labelCls}>Authenticator or backup code</span>
              <input name="code" required autoComplete="one-time-code" maxLength={16} className={inputCls} />
            </label>
          </div>
          <div className="flex flex-wrap gap-2">
            <button type="submit" value="regenerate" className="btn btn-sm" disabled={regenerating || disabling}>
              {regenerating ? "Generating…" : "Generate new backup codes"}
            </button>
            <button type="submit" value="disable" className="btn btn-outline btn-error btn-sm" disabled={regenerating || disabling}>
              {disabling ? "Turning off…" : "Turn off two-factor"}
            </button>
          </div>
        </form>
      )}
    </section>
  );
};

export default TwoFactorSettings;
