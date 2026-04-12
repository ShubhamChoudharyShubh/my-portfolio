import Footer from "../components/footer";
import { Navbar } from "../components/nav";

export default function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="flex-auto min-w-0 mb-20 mt-2 px-6 sm:px-4 md:px-0 lg:mb-40 lg:mt-8 flex w-full flex-col max-w-2xl mx-auto overflow-hidden">
      <Navbar />
      {children}
      <Footer />
    </main>
  );
}
