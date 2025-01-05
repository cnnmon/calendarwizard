export default function Icon({
  emoji,
  title,
  onClick,
}: {
  emoji: string;
  title: string;
  onClick: () => void;
}) {
  return (
    <div
      className="hover:cursor-pointer hover:bg-black p-1 text-center group"
      onClick={onClick}
    >
      <p className="text-4xl">{emoji}</p>
      <p className="font-bold group-hover:text-white">{title}</p>
    </div>
  );
}
