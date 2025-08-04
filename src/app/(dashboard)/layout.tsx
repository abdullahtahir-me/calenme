import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";

import type { Metadata } from "next";
import { SiteHeader } from "@/components/site-header";

export const metadata: Metadata = {
  title: "Calenme",
  description: "A way to organize the life",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="[--header-height:calc(--spacing(14))]">
      <SidebarProvider className="flex flex-col">
        <SiteHeader />
        <div className="flex flex-1">
          <AppSidebar />
          <SidebarInset>
            <div className="flex flex-1 flex-col gap-4 p-4s">{children}</div>
          </SidebarInset>
        </div>
      </SidebarProvider>
    </div>
  );
}
