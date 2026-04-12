import Footer from "../components/footer";
import { Navbar } from "../components/nav";
import { AnalyticsTracker } from "../components/analytics-tracker";

export default function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="flex-auto min-w-0 mt-2 md:mt-6 flex w-full flex-col px-6 sm:px-4 md:px-0 max-w-2xl overflow-hidden">
      <AnalyticsTracker />
      <Navbar />
      {children}
      <Footer />
    </main>
  );
}
