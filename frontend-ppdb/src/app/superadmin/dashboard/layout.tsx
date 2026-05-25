import FooterSuperAdmin from "@/components/footer";
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

      <main className="ml-60 flex min-h-screen flex-col pt-16">
        <div className="flex-1 p-6">{children}</div>
        <FooterSuperAdmin />
      </main>
    </div>
  );
}