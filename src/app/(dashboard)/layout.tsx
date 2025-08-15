import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";

import type { Metadata } from "next";
import { SiteHeader } from "@/components/site-header";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Home,
  SquareCheckBig,
  ClipboardList,
  BookOpen,
  Calendar,
  UserPen,
} from "lucide-react";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Calenme",
  description: "A way to organize the life",
};

const items = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: Home,
  },
  {
    title: "Tasks",
    url: "/tasks",
    icon: SquareCheckBig,
  },
  {
    title: "Assignments",
    url: "/assignments",
    icon: ClipboardList,
  },
  {
    title: "Courses",
    url: "/courses",
    icon: BookOpen,
  },
  {
    title: "Calendar",
    url: "#",
    icon: Calendar,
  },
  {
    title: "Profile",
    url: "/profile",
    icon: UserPen,
  },
];

export default async function RootLayout({
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
            <div className="flex flex-1 flex-col gap-4 p-4s max-sm:pb-17 ">
              <div className="fixed bottom-5 left-0 w-full flex justify-center sm:hidden z-50">
                <Tabs defaultValue="Dashboard" className="w-auto">
                  <TabsList className="bg-white/30 backdrop-blur-lg h-13">
                    {items.map((item) => (
                      <TabsTrigger
                        value={item.title}
                        asChild
                        key={item.title}
                        className="w-15"
                      >
                        <Link href={item.url}>
                          <item.icon />
                        </Link>
                      </TabsTrigger>
                    ))}
                  </TabsList>
                </Tabs>
              </div>
              {children}
            </div>
          </SidebarInset>
        </div>
      </SidebarProvider>
    </div>
  );
}
