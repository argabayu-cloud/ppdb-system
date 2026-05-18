import Footer from "@/components/footer";
import NavbarAdmin from "@/components/navbarAdmin";
import SidebarAdmin from "@/components/sidebarAdmin";

export default function AdminSekolahLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      <NavbarAdmin />
      <SidebarAdmin />

      <main className="ml-64 pt-16 min-h-screen flex flex-col">
        <div className="flex-1 p-6">
          {children}
        </div>

        <Footer />
      </main>
    </div>
  );
}