export default function Header({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="bg-white p-4 border-b border-dark-color">
      <h1 className="text-xl">{title}</h1>
      <p>{description}</p>
    </div>
  );
}
