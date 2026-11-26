/** Empty value for a set of schema fields (used for new items and repeater rows). */
export function emptyFor(fields) {
  const item = {};
  for (const f of fields) {
    if (f.type === "switch") item[f.name] = false;
    else if (f.type === "list" || f.type === "repeater") item[f.name] = [];
    else if (f.type === "group") item[f.name] = emptyFor(f.fields);
    else if (f.type === "select") item[f.name] = f.options?.[0]?.value ?? "";
    else item[f.name] = "";
  }
  return item;
}

/** Keeps only the keys the schema declares (drops _id, timestamps, …) and tidies list fields. */
export function pickBySchema(fields, value) {
  const out = {};
  for (const f of fields) {
    const v = value?.[f.name];
    if (f.type === "group") out[f.name] = pickBySchema(f.fields, v || {});
    else if (f.type === "repeater") out[f.name] = (v || []).map((item) => pickBySchema(f.fields, item));
    else if (f.type === "list") out[f.name] = (v || []).map((s) => String(s).trim()).filter(Boolean);
    else if (f.type === "switch") out[f.name] = !!v;
    else out[f.name] = v ?? "";
  }
  return out;
}
