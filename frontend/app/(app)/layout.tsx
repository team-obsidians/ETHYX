import { Sidebar } from "@/components/shared/Sidebar";
import { Topbar } from "@/components/shared/Topbar";
import { BackgroundShell } from "@/components/shared/BackgroundShell";
import { AppFooter } from "@/components/shared/AppFooter";

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <BackgroundShell>
      <Sidebar />
      <Topbar />
      <main className="lg:pl-[240px] pt-[56px] min-h-screen relative z-10 flex flex-col overflow-x-hidden">
        <div className="flex-1 flex flex-col">
          {children}
        </div>
        <AppFooter />
      </main>
    </BackgroundShell>
  );
}
