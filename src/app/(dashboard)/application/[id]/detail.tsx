type ApplicationDetailPropType = {
  data?: Record<string, any> | null;
  title: string;
};

export function ApplicationDetail({ data, title }: ApplicationDetailPropType) {
  if (!data) return null;

  return (
    <div className="card">
      <div className="card-body">
        <h2 className="card-title text-lg">{title}</h2>

        <div className="flex flex-wrap gap-4 mt-4 text-sm">
          {Object.entries(data).map(([key, value]) => {
            if (key === "id" || key === "candidateId") return null;
            return (
              <div
                key={key}
                className="bg-base-300 p-3 rounded-lg break-words flex-grow basis-full xl:basis-[48%]"
              >
                <div className="font-bold capitalize mb-1 whitespace-nowrap">
                  {key.replace(/([A-Z])/g, " $1")}:
                </div>
                <div className="text-base-content/70">{renderValue(value)}</div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

const renderValue = (value: any): React.ReactNode => {
  if (value == null) return "N/A";

  if (typeof value === "boolean") return value ? "Yes" : "No";

  if (value instanceof Date) return value.toDateString();

  if (Array.isArray(value)) {
    if (value.length === 0) return "[]";
    return (
      <ul className="list-disc list-inside space-y-1">
        {value.map((item, idx) => (
          <li key={idx} className="text-sm">
            {renderValue(item)}
          </li>
        ))}
      </ul>
    );
  }

  if (typeof value === "object") {
    const entries = Object.entries(value);
    if (entries.length === 0) return "{}";
    return (
      <ul className="space-y-1">
        {entries.map(([key, val]) => (
          <li key={key} className="text-sm">
            <strong className="capitalize">{key}:</strong> {renderValue(val)}
          </li>
        ))}
      </ul>
    );
  }

  return String(value);
};
