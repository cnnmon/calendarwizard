export default function DateSelector({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div className="flex gap-2">
      <p className="w-1/2">{label}</p>
      <input
        required
        type="date"
        className="w-1/2 border px-2"
        value={value === "" ? "" : new Date(value).toISOString().split("T")[0]}
        onChange={(e) => {
          onChange(
            e.target.value === "" ? "" : new Date(e.target.value).toISOString()
          );
        }}
      />
    </div>
  );
}
