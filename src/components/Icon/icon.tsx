export default function Icon({
  emoji,
  title,
  onClick,
  isDisabled,
}: {
  emoji: string;
  title: string;
  onClick: () => void;
  isDisabled: boolean;
}) {
  return (
    <div
      className={`p-1 text-center group no-drag ${
        isDisabled
          ? "opacity-50 cursor-not-allowed"
          : "hover:cursor-pointer hover:bg-black"
      }`}
      onClick={isDisabled ? undefined : onClick}
    >
      <p className="text-4xl">{emoji}</p>
      <p
        className={`font-bold ${
          isDisabled ? "text-gray-500" : "group-hover:text-white"
        }`}
      >
        {title}
      </p>
    </div>
  );
}
