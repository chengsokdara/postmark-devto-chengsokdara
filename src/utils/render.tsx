export function renderValue(value: any): React.ReactNode {
  if (!value) return "N/A";

  if (typeof value === "boolean") return value ? "Yes" : "No";

  if (value instanceof Date) return value.toLocaleString();

  if (Array.isArray(value)) {
    if (value.length === 0) return "N/A";
    return (
      <ul className="space-y-1">
        {value.map((item, idx) => (
          <li key={idx} className="text-sm font-light">
            {renderValue(item)}
          </li>
        ))}
      </ul>
    );
  }

  if (typeof value === "object") {
    const entries = Object.entries(value);
    if (entries.length === 0) return "N/A";
    return (
      <ul className="space-y-3">
        {entries.map(([key, val]) => {
          if (!val) return null;
          return (
            <li key={key} className="text-md">
              <strong className="text-base-content capitalize font-bold">
                {key}:
              </strong>{" "}
              {renderValue(val)}
            </li>
          );
        })}
      </ul>
    );
  }

  return String(value);
}
