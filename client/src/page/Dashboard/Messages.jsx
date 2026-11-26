import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { MdDeleteOutline, MdOutlineMail, MdSearch } from "react-icons/md";
import {
  useDeleteMessageMutation,
  useGetMessagesQuery,
  useUpdateMessageMutation,
} from "../../redux/features/messageApi";
import { errorMessage } from "../../redux/api/baseApi";

const STATUSES = ["new", "read", "replied", "archived"];
const BADGE = {
  new: "badge-primary",
  read: "badge-ghost",
  replied: "badge-success badge-outline",
  archived: "badge-neutral",
};
const PAGE_SIZE = 20;

const dateTime = new Intl.DateTimeFormat("en-GB", { dateStyle: "medium", timeStyle: "short" });
const formatDate = (value) => (value ? dateTime.format(new Date(value)) : "—");

/** Full message, tracking status, private note, reply and delete. */
const MessageDetail = ({ message, onClose }) => {
  const [updateMessage, { isLoading: saving }] = useUpdateMessageMutation();
  const [deleteMessage, { isLoading: deleting }] = useDeleteMessageMutation();
  const [note, setNote] = useState(message.note || "");

  useEffect(() => setNote(message.note || ""), [message._id, message.note]);

  const update = async (body, success) => {
    try {
      await updateMessage({ id: message._id, ...body }).unwrap();
      if (success) toast.success(success);
    } catch (err) {
      toast.error(errorMessage(err, "Could not update"));
    }
  };

  const remove = async () => {
    if (!window.confirm(`Delete the message from ${message.name}? This cannot be undone.`)) return;
    try {
      await deleteMessage(message._id).unwrap();
      toast.success("Message deleted");
      onClose();
    } catch (err) {
      toast.error(errorMessage(err, "Could not delete"));
    }
  };

  const replyHref = `mailto:${message.email}?subject=${encodeURIComponent("Re: your message on my portfolio")}`;

  return (
    <aside className="rounded-xl border border-base-content/15 bg-base-200 p-5" aria-label="Message details">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <h2 className="text-lg font-bold">{message.name}</h2>
          <a href={`mailto:${message.email}`} className="break-all font-mono text-sm text-primary hover:underline">
            {message.email}
          </a>
        </div>
        <button type="button" onClick={onClose} className="btn btn-ghost btn-sm" aria-label="Close details">
          ✕
        </button>
      </div>

      <dl className="mt-4 grid grid-cols-3 gap-3 text-xs">
        {[
          ["Received", message.createdAt],
          ["First read", message.readAt],
          ["Replied", message.repliedAt],
        ].map(([label, value]) => (
          <div key={label}>
            <dt className="font-mono uppercase tracking-wider opacity-60">{label}</dt>
            <dd className="mt-0.5">{formatDate(value)}</dd>
          </div>
        ))}
      </dl>

      <p className="mt-5 whitespace-pre-wrap break-words rounded-lg bg-base-100 p-4 text-sm leading-relaxed">{message.message}</p>

      <div className="mt-5 flex flex-wrap items-center gap-2">
        <a
          href={replyHref}
          onClick={() => update({ status: "replied" })}
          className="btn btn-primary btn-sm"
        >
          <MdOutlineMail className="h-4 w-4" /> Reply by email
        </a>
        <label className="flex items-center gap-2 text-sm">
          <span className="opacity-70">Status</span>
          <select
            value={message.status}
            disabled={saving}
            onChange={(e) => update({ status: e.target.value }, "Status updated")}
            className="select select-bordered select-sm"
          >
            {STATUSES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </label>
      </div>

      <form
        className="mt-5"
        onSubmit={(e) => {
          e.preventDefault();
          update({ note }, "Note saved");
        }}
      >
        <label className="block">
          <span className="mb-1 block text-xs font-semibold uppercase tracking-wider opacity-70">Private note</span>
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            maxLength={2000}
            rows={3}
            className="textarea textarea-bordered w-full text-sm"
            placeholder="Follow-up date, budget, what you agreed…"
          />
        </label>
        <div className="mt-2 flex justify-between gap-2">
          <button type="submit" className="btn btn-sm" disabled={saving || note === (message.note || "")}>
            Save note
          </button>
          <button type="button" onClick={remove} disabled={deleting} className="btn btn-ghost btn-sm text-error">
            <MdDeleteOutline className="h-4 w-4" /> Delete
          </button>
        </div>
      </form>
    </aside>
  );
};

/** Inbox for the home page contact form, with status tracking. */
const Messages = () => {
  const [status, setStatus] = useState("");
  const [search, setSearch] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [selectedId, setSelectedId] = useState(null);
  const [updateMessage] = useUpdateMessageMutation();

  // Waits for a pause in typing before searching.
  useEffect(() => {
    const t = setTimeout(() => {
      setSearchTerm(search.trim());
      setPage(1);
    }, 350);
    return () => clearTimeout(t);
  }, [search]);

  const params = { page: String(page), limit: String(PAGE_SIZE) };
  if (status) params.status = status;
  if (searchTerm) params.searchTerm = searchTerm;
  const { data, isLoading, isFetching, isError } = useGetMessagesQuery(params);

  const messages = data?.data || [];
  const meta = data?.meta;
  const counts = meta?.counts || {};
  const total = STATUSES.reduce((sum, s) => sum + (counts[s] || 0), 0);
  const selected = messages.find((m) => m._id === selectedId);

  const open = (m) => {
    setSelectedId(m._id);
    if (m.status === "new") updateMessage({ id: m._id, status: "read" });
  };

  const tabs = [["", "All", total], ...STATUSES.map((s) => [s, s, counts[s] || 0])];

  return (
    <div className="mx-auto max-w-6xl">
      <div className="mb-5 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Messages</h1>
          <p className="text-sm opacity-70">Everything sent through the contact form on the home page.</p>
        </div>
        <label className="input input-bordered input-sm flex w-full max-w-xs items-center gap-2">
          <MdSearch className="h-4 w-4 opacity-60" aria-hidden="true" />
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search name, email, text"
            className="grow bg-transparent outline-none"
            aria-label="Search messages"
          />
        </label>
      </div>

      <div role="tablist" className="mb-4 flex flex-wrap gap-2">
        {tabs.map(([value, label, count]) => (
          <button
            key={label}
            type="button"
            role="tab"
            aria-selected={status === value}
            onClick={() => {
              setStatus(value);
              setPage(1);
            }}
            className={`btn btn-sm capitalize ${status === value ? "btn-primary" : "btn-ghost border border-base-content/15"}`}
          >
            {label} <span className="font-mono opacity-70">{count}</span>
          </button>
        ))}
      </div>

      <div className={`grid gap-5 ${selected ? "lg:grid-cols-[minmax(0,1fr)_380px]" : ""}`}>
        <div className="overflow-x-auto rounded-xl border border-base-content/15">
          <table className="table table-sm">
            <thead className="text-base-content/70">
              <tr>
                <th>Received</th>
                <th>Name</th>
                <th>Email</th>
                <th>Message</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody className={isFetching ? "opacity-60" : ""}>
              {messages.map((m) => (
                <tr
                  key={m._id}
                  onClick={() => open(m)}
                  className={`cursor-pointer hover:bg-base-200 ${m._id === selectedId ? "bg-base-200" : ""} ${
                    m.status === "new" ? "font-semibold" : ""
                  }`}
                >
                  <td className="whitespace-nowrap font-mono text-xs">{formatDate(m.createdAt)}</td>
                  <td className="max-w-[10rem] truncate">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        open(m);
                      }}
                      className="text-left hover:text-primary"
                    >
                      {m.name}
                    </button>
                  </td>
                  <td className="max-w-[14rem] truncate font-mono text-xs">{m.email}</td>
                  <td className="max-w-[22rem] truncate opacity-80">{m.message}</td>
                  <td>
                    <span className={`badge badge-sm ${BADGE[m.status]}`}>{m.status}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {!isLoading && !messages.length && (
            <p className="p-8 text-center text-sm opacity-70">
              {isError ? "Could not load messages." : searchTerm || status ? "No messages match." : "No messages yet."}
            </p>
          )}
          {isLoading && <p className="p-8 text-center text-sm opacity-70">Loading…</p>}

          {meta?.totalPage > 1 && (
            <div className="flex items-center justify-between border-t border-base-content/10 px-4 py-2 text-sm">
              <span className="opacity-70">
                Page {meta.page} of {meta.totalPage} · {meta.total} messages
              </span>
              <div className="join">
                <button type="button" className="btn join-item btn-sm" disabled={page <= 1} onClick={() => setPage(page - 1)}>
                  Previous
                </button>
                <button
                  type="button"
                  className="btn join-item btn-sm"
                  disabled={page >= meta.totalPage}
                  onClick={() => setPage(page + 1)}
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>

        {selected && <MessageDetail message={selected} onClose={() => setSelectedId(null)} />}
      </div>
    </div>
  );
};

export default Messages;
