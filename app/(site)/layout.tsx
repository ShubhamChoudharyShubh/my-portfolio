import Footer from "../components/footer";
import { Navbar } from "../components/nav";

export default function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
