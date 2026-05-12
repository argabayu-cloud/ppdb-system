import Navbar from "@/components/navbar";
import Sidebar from "@/components/sidebar";
<<<<<<< HEAD
import Footer from "@/components/footer";
=======
>>>>>>> f4ba90b (feat: initialize global Tailwind CSS styles and Poppins font layouts for dashboard modules)

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
<<<<<<< HEAD
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar />

      <div className="flex pt-[52px] min-h-screen">
        <Sidebar />

        <main className="ml-52 flex-1 p-6 min-h-screen flex flex-col">
          <div className="flex-1">{children}</div>
          <Footer />
=======
    <div className="min-h-screen bg-slate-50 font-sans">
      <Navbar />

      <div className="flex pt-16">
        <Sidebar />

        <main className="flex-1 p-6">
          {children}
>>>>>>> f4ba90b (feat: initialize global Tailwind CSS styles and Poppins font layouts for dashboard modules)
        </main>
      </div>
    </div>
  );
}
