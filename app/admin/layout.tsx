import type { Metadata } from "next";
import Sidebar from "@/components/admin/Sidebar";

export const metadata: Metadata = {
  title: "FORMA CMS",
  robots: {
    index: false,
    follow: false,
  },
};

const wrapperStyle: React.CSSProperties = {
  display: "flex",
  minHeight: "100vh",
  backgroundColor: "#0a0a09",
};

const mainStyle: React.CSSProperties = {
  flex: 1,
  marginLeft: 220,
  minHeight: "100vh",
  backgroundColor: "#0a0a09",
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div style={wrapperStyle}>
      <Sidebar />
      <main style={mainStyle}>{children}</main>
    </div>
  );
}
