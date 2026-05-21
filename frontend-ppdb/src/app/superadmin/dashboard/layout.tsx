import NavbarSuperAdmin from "@/components/navbarSuperAdmin";
import SidebarSuperAdmin from "@/components/sidebarSuperAdmin";

export default function SuperAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      <NavbarSuperAdmin />
      <SidebarSuperAdmin />

      <main className="ml-60 pt-16 min-h-screen">
        <div className="p-6">{children}</div>
      </main>
    </div>
  );
}