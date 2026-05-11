import NavbarSuperAdmin from "@/components/navbarSuperAdmin";
import SidebarSuperAdmin from "@/components/sidebarSuperAdmin";

export default function SuperAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <NavbarSuperAdmin />
      <div className="flex pt-[52px] min-h-screen">
        <SidebarSuperAdmin />
        <main className="ml-52 flex-1 p-6 min-h-screen">
          {children}
        </main>
      </div>
    </div>
  );
}