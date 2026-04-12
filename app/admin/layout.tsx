export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="w-full min-h-screen bg-neutral-50 dark:bg-neutral-950">
      {children}
    </div>
  );
}
