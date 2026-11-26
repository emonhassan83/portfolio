import { useState } from "react";
import toast from "react-hot-toast";
import {
  useCreatePortfolioItemMutation,
  useDeletePortfolioItemMutation,
  useGetPortfolioItemsQuery,
  useReorderPortfolioItemsMutation,
  useUpdatePortfolioItemMutation,
} from "../../../redux/features/portfolioApi";
import { errorMessage } from "../../../redux/api/baseApi";
import Fields from "./SchemaForm";
import { emptyFor, pickBySchema } from "./schemaUtils";
import { resources } from "./schemas";

/**
 * List / create / edit / delete / reorder / publish for one portfolio collection.
 * Every write is validated again by the server; the home page refreshes on save.
 */
export default function ResourceManager({ resource }) {
  const config = resources[resource];
  const { data, isLoading, isError, error } = useGetPortfolioItemsQuery(resource);
  const [createItem, { isLoading: creating }] = useCreatePortfolioItemMutation();
  const [updateItem, { isLoading: updating }] = useUpdatePortfolioItemMutation();
  const [deleteItem] = useDeletePortfolioItemMutation();
  const [reorder, { isLoading: reordering }] = useReorderPortfolioItemsMutation();

  const [editing, setEditing] = useState(null); // { id: string|null, value: object }
  const items = data?.data || [];

  const startNew = () => setEditing({ id: null, value: { ...emptyFor(config.fields), ...(config.defaults || {}) } });
  const startEdit = (item) => setEditing({ id: item._id, value: item });

  const save = async (e) => {
    e.preventDefault();
    const body = pickBySchema(config.fields, editing.value);
    try {
      if (editing.id) await updateItem({ resource, id: editing.id, body }).unwrap();
      else await createItem({ resource, body }).unwrap();
      toast.success("Saved — the home page updates within seconds");
      setEditing(null);
    } catch (err) {
      toast.error(errorMessage(err, "Save failed"));
    }
  };

  const remove = async (item) => {
    const { title } = config.describe(item);
    if (!window.confirm(`Delete “${title}”? This cannot be undone.`)) return;
    try {
      await deleteItem({ resource, id: item._id }).unwrap();
      toast.success("Deleted");
    } catch (err) {
      toast.error(errorMessage(err, "Delete failed"));
    }
  };

  const togglePublish = async (item) => {
    const body = { ...pickBySchema(config.fields, item), isPublished: !item.isPublished };
    try {
      await updateItem({ resource, id: item._id, body }).unwrap();
      toast.success(body.isPublished ? "Published" : "Hidden from the site");
    } catch (err) {
      toast.error(errorMessage(err, "Update failed"));
    }
  };

  const move = async (index, dir) => {
    const j = index + dir;
    if (j < 0 || j >= items.length) return;
    const ids = items.map((i) => i._id);
    [ids[index], ids[j]] = [ids[j], ids[index]];
    try {
      await reorder({ resource, ids }).unwrap();
    } catch (err) {
      toast.error(errorMessage(err, "Reorder failed"));
    }
  };

  if (editing) {
    return (
      <form onSubmit={save} className="mx-auto max-w-4xl space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-xl font-bold">
            {editing.id ? `Edit ${config.singular.toLowerCase()}` : `New ${config.singular.toLowerCase()}`}
          </h2>
          <div className="flex gap-2">
            <button type="button" className="btn btn-ghost btn-sm" onClick={() => setEditing(null)}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary btn-sm" disabled={creating || updating}>
              {creating || updating ? "Saving…" : "Save"}
            </button>
          </div>
        </div>
        <Fields fields={config.fields} value={editing.value} onChange={(value) => setEditing({ ...editing, value })} />
        <div className="flex justify-end gap-2 border-t border-base-content/10 pt-4">
          <button type="button" className="btn btn-ghost btn-sm" onClick={() => setEditing(null)}>
            Cancel
          </button>
          <button type="submit" className="btn btn-primary btn-sm" disabled={creating || updating}>
            {creating || updating ? "Saving…" : "Save"}
          </button>
        </div>
      </form>
    );
  }

  return (
    <div className="mx-auto max-w-4xl">
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold">{config.title}</h2>
          <p className="text-sm opacity-60">Order here is the order on the home page. Hidden items stay saved.</p>
        </div>
        <button type="button" className="btn btn-primary btn-sm" onClick={startNew}>
          + New {config.singular.toLowerCase()}
        </button>
      </div>

      {isLoading && <span className="loading loading-spinner" aria-label="Loading" />}
      {isError && <p className="text-error">{errorMessage(error, "Could not load items")}</p>}
      {!isLoading && !isError && items.length === 0 && (
        <p className="rounded-lg border border-dashed border-base-content/20 p-6 text-center text-sm opacity-70">
          Nothing here yet. Add the first {config.singular.toLowerCase()}, or import the defaults from Profile &amp; hero.
        </p>
      )}

      <ol className="space-y-2">
        {items.map((item, index) => {
          const { title, meta } = config.describe(item);
          return (
            <li
              key={item._id}
              className={`flex flex-wrap items-center gap-3 rounded-lg border border-base-content/10 p-3 ${item.isPublished ? "" : "opacity-60"}`}
            >
              <span className="w-6 text-center font-mono text-xs opacity-60">{String(index + 1).padStart(2, "0")}</span>
              <div className="min-w-0 flex-1">
                <p className="truncate font-medium">{title}</p>
                {meta && <p className="truncate text-xs opacity-60">{meta}</p>}
              </div>
              <span className={`badge badge-sm ${item.isPublished ? "badge-success" : "badge-ghost"}`}>
                {item.isPublished ? "live" : "hidden"}
              </span>
              <div className="flex gap-1">
                <button type="button" className="btn btn-ghost btn-xs" disabled={index === 0 || reordering} onClick={() => move(index, -1)} aria-label={`Move ${title} up`}>
                  ↑
                </button>
                <button
                  type="button"
                  className="btn btn-ghost btn-xs"
                  disabled={index === items.length - 1 || reordering}
                  onClick={() => move(index, 1)}
                  aria-label={`Move ${title} down`}
                >
                  ↓
                </button>
                <button type="button" className="btn btn-ghost btn-xs" onClick={() => togglePublish(item)}>
                  {item.isPublished ? "Hide" : "Publish"}
                </button>
                <button type="button" className="btn btn-outline btn-xs" onClick={() => startEdit(item)}>
                  Edit
                </button>
                <button type="button" className="btn btn-ghost btn-xs text-error" onClick={() => remove(item)}>
                  Delete
                </button>
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
