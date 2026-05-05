import Sidebar from "@/components/sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex">
      
      {/* Sidebar */}
      <Sidebar />

      {/* Content */}
      <main className="flex-1 ml-52 p-6 pt-20">
        {children}
      </main>
    </div>
  );
}