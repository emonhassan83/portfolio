import { useId } from "react";
import { emptyFor } from "./schemaUtils";

/**
 * Renders a form from a field schema. One generic engine for every portfolio section.
 *
 * Field: { name, label, type, help?, required?, options?, rows?, fields?, itemLabel?, newItem?, maxItems? }
 * Types: text | email | url | textarea | code | select | switch | list (string[]) |
 *        group (object; `fields`) | repeater (object[]; `fields`)
 */

const inputCls = "input input-bordered input-sm w-full";
const areaCls = "textarea textarea-bordered w-full text-sm leading-relaxed";

function Label({ htmlFor, field }) {
  return (
    <label htmlFor={htmlFor} className="mb-1 block text-xs font-semibold uppercase tracking-wider opacity-70">
      {field.label}
      {field.required && <span className="text-error"> *</span>}
    </label>
  );
}

function Help({ field }) {
  return field.help ? <p className="mt-1 text-xs opacity-60">{field.help}</p> : null;
}

function ListField({ id, field, value, onChange }) {
  // One entry per line; blank lines are dropped on save.
  const text = (value || []).join("\n");
  return (
    <textarea
      id={id}
      className={areaCls}
      rows={field.rows || Math.min(10, Math.max(3, (value || []).length + 1))}
      value={text}
      onChange={(e) => onChange(e.target.value.split("\n"))}
      onBlur={(e) => onChange(e.target.value.split("\n").map((s) => s.trim()).filter(Boolean))}
      placeholder="One entry per line"
    />
  );
}

function RepeaterField({ field, value, onChange }) {
  const items = value || [];
  const set = (next) => onChange(next);
  const move = (i, dir) => {
    const j = i + dir;
    if (j < 0 || j >= items.length) return;
    const next = [...items];
    [next[i], next[j]] = [next[j], next[i]];
    set(next);
  };
  const full = field.maxItems && items.length >= field.maxItems;

  return (
    <div className="space-y-3">
      {items.map((item, i) => (
        <fieldset key={i} className="rounded-lg border border-base-content/15 p-3">
          <legend className="px-1 text-xs font-semibold opacity-70">
            {field.itemLabel || "Item"} {i + 1}
            {field.titleField && item?.[field.titleField] ? ` — ${item[field.titleField]}` : ""}
          </legend>
          <div className="mb-2 flex justify-end gap-1">
            <button type="button" className="btn btn-ghost btn-xs" onClick={() => move(i, -1)} disabled={i === 0} aria-label="Move up">
              ↑
            </button>
            <button
              type="button"
              className="btn btn-ghost btn-xs"
              onClick={() => move(i, 1)}
              disabled={i === items.length - 1}
              aria-label="Move down"
            >
              ↓
            </button>
            <button
              type="button"
              className="btn btn-ghost btn-xs text-error"
              onClick={() => set(items.filter((_, k) => k !== i))}
              aria-label={`Remove ${field.itemLabel || "item"} ${i + 1}`}
            >
              Remove
            </button>
          </div>
          <Fields fields={field.fields} value={item} onChange={(v) => set(items.map((it, k) => (k === i ? v : it)))} />
        </fieldset>
      ))}
      <button
        type="button"
        className="btn btn-outline btn-xs"
        disabled={full}
        onClick={() => set([...items, field.newItem ? field.newItem() : emptyFor(field.fields)])}
      >
        + Add {field.itemLabel?.toLowerCase() || "item"}
      </button>
    </div>
  );
}

function Field({ field, value, onChange }) {
  const id = useId();

  if (field.type === "group") {
    return (
      <section className="rounded-xl border border-base-content/10 p-4 md:col-span-2">
        <h3 className="mb-3 text-sm font-bold">{field.label}</h3>
        {field.help && <p className="-mt-2 mb-3 text-xs opacity-60">{field.help}</p>}
        <Fields fields={field.fields} value={value || {}} onChange={onChange} />
      </section>
    );
  }

  if (field.type === "repeater") {
    return (
      <div className="md:col-span-2">
        <p className="mb-1 block text-xs font-semibold uppercase tracking-wider opacity-70">{field.label}</p>
        <Help field={field} />
        <div className="mt-2">
          <RepeaterField field={field} value={value} onChange={onChange} />
        </div>
      </div>
    );
  }

  if (field.type === "switch") {
    return (
      <div className="flex items-center gap-3">
        <input id={id} type="checkbox" className="toggle toggle-sm" checked={!!value} onChange={(e) => onChange(e.target.checked)} />
        <label htmlFor={id} className="text-sm">
          {field.label}
        </label>
      </div>
    );
  }

  const wide = ["textarea", "code", "list"].includes(field.type) || field.wide;

  return (
    <div className={wide ? "md:col-span-2" : ""}>
      <Label htmlFor={id} field={field} />
      {field.type === "list" ? (
        <ListField id={id} field={field} value={value} onChange={onChange} />
      ) : field.type === "textarea" || field.type === "code" ? (
        <textarea
          id={id}
          className={`${areaCls} ${field.type === "code" ? "font-mono text-xs" : ""}`}
          rows={field.rows || 3}
          value={value ?? ""}
          required={field.required}
          spellCheck={field.type !== "code"}
          onChange={(e) => onChange(e.target.value)}
        />
      ) : field.type === "select" ? (
        <select id={id} className="select select-bordered select-sm w-full" value={value ?? ""} onChange={(e) => onChange(e.target.value)}>
          {field.options.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      ) : (
        <input
          id={id}
          type={field.type === "url" ? "text" : field.type || "text"}
          inputMode={field.type === "url" ? "url" : undefined}
          className={inputCls}
          value={value ?? ""}
          required={field.required}
          placeholder={field.placeholder}
          onChange={(e) => onChange(e.target.value)}
        />
      )}
      <Help field={field} />
    </div>
  );
}

export default function Fields({ fields, value, onChange }) {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      {fields.map((f, i) => (
        <Field key={`${f.name}-${i}`} field={f} value={value?.[f.name]} onChange={(v) => onChange({ ...value, [f.name]: v })} />
      ))}
    </div>
  );
}
