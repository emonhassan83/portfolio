import { FiGithub } from "react-icons/fi";
import { getContributions } from "../../lib/githubContributions";
import Reveal from "./ui/Reveal";

const utc = (date) => new Date(`${date}T00:00:00Z`);
const dayLabel = new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "short", year: "numeric", timeZone: "UTC" });
const monthLabel = new Intl.DateTimeFormat("en-GB", { month: "short", timeZone: "UTC" });
const num = new Intl.NumberFormat("en-US");

/** Live GitHub contribution heatmap for the last year (server component; renders nothing if GitHub can't be read). */
export default async function Contributions({ githubUser }) {
  if (!githubUser) return null;
  const data = await getContributions(githubUser);
  if (!data) return null;

  const { total, days } = data;
  const activeDays = days.filter((d) => d.count > 0).length;
  const perWeek = Math.round(total / (days.length / 7));
  const offset = utc(days[0].date).getUTCDay(); // blank cells before the first day (weeks start on Sunday)
  const weeks = Math.ceil((offset + days.length) / 7);

  // Month name above the first week that starts in a new month
  const months = [];
  for (let w = 0; w < weeks; w++) {
    const first = days[Math.max(0, w * 7 - offset)];
    const month = monthLabel.format(utc(first.date));
    if (!months.length || months[months.length - 1].month !== month) months.push({ week: w, month });
  }
  // The first label is dropped when its month has only a sliver of a column, to avoid overlap
  if (months.length > 1 && months[1].week - months[0].week < 3) months.shift();

  const columns = { gridTemplateColumns: `repeat(${weeks}, minmax(0, 1fr))` };
  const stats = [
    [num.format(total), "total contributions"],
    [num.format(perWeek), "avg / week"],
    [num.format(activeDays), "active days"],
  ];

  return (
    <Reveal className="bk-card mb-4 p-5 sm:p-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <FiGithub aria-hidden="true" className="bk-accent h-6 w-6 shrink-0" />
          <div>
            <p className="font-display text-xl font-semibold text-bk-fg sm:text-2xl">
              {num.format(total)} contributions in the last year
            </p>
            <p className="bk-mono text-bk-dim">@{githubUser}</p>
          </div>
        </div>
        <p className="bk-mono flex items-center gap-1.5 text-bk-dim" aria-hidden="true">
          less
          {[0, 1, 2, 3, 4].map((l) => (
            <span key={l} className="bk-contrib-cell h-2.5 w-2.5" data-level={l} />
          ))}
          more
        </p>
      </div>

      <div className="mt-6 overflow-x-auto pb-1">
        <div className="min-w-[680px]">
          <div className="bk-mono mb-1.5 grid gap-[3px] text-[10px] text-bk-dim" style={columns} aria-hidden="true">
            {months.map((m) => (
              <span key={`${m.month}-${m.week}`} style={{ gridColumnStart: m.week + 1 }} className="whitespace-nowrap">
                {m.month}
              </span>
            ))}
          </div>
          <div
            role="img"
            aria-label={`${num.format(total)} GitHub contributions in the last year, on ${activeDays} active days.`}
            className="grid grid-flow-col grid-rows-7 gap-[3px]"
            style={columns}
          >
            {days.map((d, i) => (
              <span
                key={d.date}
                className="bk-contrib-cell aspect-square"
                data-level={d.level}
                style={i === 0 && offset ? { gridRowStart: offset + 1 } : undefined}
                title={`${d.count === 0 ? "No" : num.format(d.count)} contribution${d.count === 1 ? "" : "s"} on ${dayLabel.format(utc(d.date))}`}
              />
            ))}
          </div>
        </div>
      </div>

      <dl className="mt-6 grid grid-cols-3 gap-4 border-t border-bk-line pt-5">
        {stats.map(([value, label]) => (
          <div key={label} className="text-center">
            <dt className="sr-only">{label}</dt>
            <dd>
              <span className="bk-accent block font-display text-3xl font-medium sm:text-4xl">{value}</span>
              <span className="mt-1 block font-mono text-[10px] uppercase tracking-[0.2em] text-bk-muted">{label}</span>
            </dd>
          </div>
        ))}
      </dl>
    </Reveal>
  );
}
