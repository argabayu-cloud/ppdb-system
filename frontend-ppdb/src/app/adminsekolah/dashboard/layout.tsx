import NavbarAdmin from "@/components/navbarAdmin";
import SidebarAdmin from "@/components/sidebarAdmin";
import Footer from "@/components/footer";

export default function AdminSekolahLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <NavbarAdmin />

      <div className="flex pt-[52px] min-h-screen">
        <SidebarAdmin />

        <main className="ml-52 flex-1 p-6 min-h-screen flex flex-col">
          <div className="flex-1">{children}</div>
          <Footer />
        </main>
      </div>
    </div>
  );
}