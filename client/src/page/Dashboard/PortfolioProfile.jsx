import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import {
  useGetPortfolioProfileQuery,
  useImportPortfolioMutation,
  useUpdatePortfolioProfileMutation,
} from "../../redux/features/portfolioApi";
import { errorMessage } from "../../redux/api/baseApi";
import Fields from "../../components/Dashboard/Portfolio/SchemaForm";
import { pickBySchema } from "../../components/Dashboard/Portfolio/schemaUtils";
import { profilePayloadSchema, profileSchema } from "../../components/Dashboard/Portfolio/schemas";
import { toImportPayload } from "../../lib/portfolioContent";

/** Hero, about, contact, links, SEO and the reference architecture: the profile singleton. */
const PortfolioProfile = () => {
  const { data, isLoading, isError, error } = useGetPortfolioProfileQuery();
  const [save, { isLoading: saving }] = useUpdatePortfolioProfileMutation();
  const [importAll, { isLoading: importing }] = useImportPortfolioMutation();
  const [value, setValue] = useState(null);
  const doc = data?.data;

  useEffect(() => {
    if (doc) setValue(doc);
  }, [doc]);

  const onSave = async (e) => {
    e.preventDefault();
    // `terminal` is not edited here (not shown in the current design) but is kept as stored.
    const body = { ...pickBySchema(profilePayloadSchema, value), terminal: value.terminal || [] };
    try {
      await save(body).unwrap();
      toast.success("Saved — the home page updates within seconds");
    } catch (err) {
      toast.error(errorMessage(err, "Save failed"));
    }
  };

  const onImport = async () => {
    if (!window.confirm("Import the current site content (profile, experience, projects, stack, practices, credentials) into the database?")) return;
    try {
      await importAll(toImportPayload()).unwrap();
      toast.success("Content imported. Every section is now editable.");
    } catch (err) {
      toast.error(errorMessage(err, "Import failed"));
    }
  };

  if (isLoading) return <span className="loading loading-spinner" aria-label="Loading" />;
  if (isError) return <p className="text-error">{errorMessage(error, "Could not load the profile")}</p>;

  if (!doc) {
    return (
      <div className="mx-auto max-w-2xl rounded-xl border border-base-content/15 p-8 text-center">
        <h2 className="text-xl font-bold">Portfolio content is not in the database yet</h2>
        <p className="mt-2 text-sm opacity-70">
          The home page is currently showing the built-in content from <code>src/data/portfolio.js</code>. Import it once to make
          every section editable here. Import only runs on an empty database.
        </p>
        <button type="button" className="btn btn-primary btn-sm mt-6" onClick={onImport} disabled={importing}>
          {importing ? "Importing…" : "Import current content"}
        </button>
      </div>
    );
  }

  if (!value) return null;

  return (
    <form onSubmit={onSave} className="mx-auto max-w-4xl space-y-6">
      <div className="sticky top-0 z-10 -mx-5 flex flex-wrap items-center justify-between gap-3 border-b border-base-content/10 bg-base-100 px-5 py-3">
        <div>
          <h2 className="text-xl font-bold">Profile &amp; hero</h2>
          <p className="text-sm opacity-60">Hero, about, contact, links, SEO and the reference architecture.</p>
        </div>
        <div className="flex gap-2">
          <a href="/" target="_blank" rel="noopener noreferrer" className="btn btn-ghost btn-sm">
            View site ↗
          </a>
          <button type="submit" className="btn btn-primary btn-sm" disabled={saving}>
            {saving ? "Saving…" : "Save changes"}
          </button>
        </div>
      </div>
      <Fields fields={profileSchema} value={value} onChange={setValue} />
      <div className="flex justify-end border-t border-base-content/10 pt-4">
        <button type="submit" className="btn btn-primary btn-sm" disabled={saving}>
          {saving ? "Saving…" : "Save changes"}
        </button>
      </div>
    </form>
  );
};

export default PortfolioProfile;
