export default function Box({
  children,
  title,
}: {
  children: React.ReactNode;
  title: string;
}) {
  return (
    <div className="border">
      <p className="mt-[-10px] bg-gray-100 w-fit px-2 ml-2">{title}</p>
      <div className="px-4 pb-4 pt-2 overflow-y-auto">{children}</div>
    </div>
  );
}
