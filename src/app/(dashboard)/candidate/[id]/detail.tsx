import { renderValue } from "@/utils/render";

type CandidateDetailPropType = {
  data?: Record<string, any> | null;
  title: string;
};

export function CandidateDetail({ data, title }: CandidateDetailPropType) {
  if (!data) return null;

  return (
    <div className="card">
      <div className="card-body">
        <h2 className="card-title text-2xl">{title}</h2>
        <div className="columns-1 mt-3 xl:columns-2">
          {Object.entries(data).map(([key, value]) => {
            if (key === "id") return null;
            if (!value) return null;
            return (
              <div
                key={key}
                className="break-inside-avoid bg-base-300 p-3 mb-3 rounded-lg break-words"
              >
                <div className="text-lg font-bold capitalize whitespace-nowrap">
                  {key.replace(/([A-Z])/g, " $1")}:
                </div>
                <div className="text-base-content/60">{renderValue(value)}</div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
