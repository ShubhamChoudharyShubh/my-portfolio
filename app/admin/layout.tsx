export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="mx-auto w-full max-w-[900px] px-6 pb-20 pt-6 sm:px-4 md:px-0">
      {children}
    </div>
  );
}
