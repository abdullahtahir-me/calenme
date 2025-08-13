"use client";
import { Bell, ConciergeBellIcon, Moon, SidebarIcon, Sun } from "lucide-react";
import avatar1 from "@/assets/images/1.jpg";
import avatar2 from "@/assets/images/2.jpg";
import avatar3 from "@/assets/images/3.jpg";
import avatar4 from "@/assets/images/4.jpg";
import avatar5 from "@/assets/images/5.jpg";
import avatar6 from "@/assets/images/6.jpg";
import avatar7 from "@/assets/images/7.jpg";
import avatar8 from "@/assets/images/8.jpg";
import avatar9 from "@/assets/images/9.jpg";
import avatar10 from "@/assets/images/10.jpg";
import { useRouter } from "next/navigation";
import { SearchForm } from "@/components/search-form";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { useSidebar } from "@/components/ui/sidebar";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { useEffect, useMemo, useState } from "react";
import { StaticImageData } from "next/image";

export function SiteHeader() {
  const [avaIndex, setAvaIndex] = useState<string | null>(null);
  const [darkMode, setDarkMode] = useState(false);
  const { toggleSidebar } = useSidebar();
  useEffect(() => {
    const isDark = document.documentElement.classList.contains("dark");
    setDarkMode(isDark);
  }, []);
  useEffect(() => {
    const getAvatar = async () => {
      try {
        const response = await fetch("/api/profile?query=avatar");
        if (!response.ok) {
          throw new Error("Avatar failed to load");
        }
        const data = await response.json();
        if (Array.isArray(data) && data.length > 0 && data[0].avatar_index) {
        setAvaIndex(String(data[0].avatar_index));
      } else {
        throw new Error("Invalid avatar data format received from API.");
      }
      } catch (error) {
        console.error(error);
        setAvaIndex("1");
      }
    };
    getAvatar();
  }, []);
  
  
  const router = useRouter();
  const handleSignout = async () => {
    const response = await fetch("/api/auth/logout", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });
    router.push("/login");
    router.refresh(); // Impo
  };
  const toggleDarkMode = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    
    if (newDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  };


  const avatars = useMemo(()=>[
    { avatarIndex: "1", src: avatar1 },
    { avatarIndex: "2", src: avatar2 },
    { avatarIndex: "3", src: avatar3 },
    { avatarIndex: "4", src: avatar4 },
    { avatarIndex: "5", src: avatar5 },
    { avatarIndex: "6", src: avatar6 },
    { avatarIndex: "7", src: avatar7 },
    { avatarIndex: "8", src: avatar8 },
    { avatarIndex: "9", src: avatar9 },
    { avatarIndex: "10", src: avatar10 },
  ],[]);
  const currentAvatarSrc = useMemo(() => {
    if (avaIndex === null) return null;
    const found = avatars.find(a => a.avatarIndex === avaIndex);
    return found ? found.src : avatars[0].src; // Fallback to the first avatar's src
  }, [avaIndex, avatars]);


  return (
    <header className="bg-background sticky top-0 z-50 flex w-full items-center border-b">
      <div className="flex h-(--header-height) w-full items-center justify-between gap-2 px-4">
        <div className="flex gap-2">
          <Button
            className="h-8 w-8 max-sm:hidden"
            variant="ghost"
            size="icon"
            onClick={toggleSidebar}
          >
            <SidebarIcon />
          </Button>
          <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">
            Lag Gae Guru
          </h3>
        </div>
        <SearchForm className="w-auto hidden md:w-2/6 md:inline-block" />
        <div className="flex gap-2">
          <Button variant="ghost">
            <Bell />
          </Button>
          <Button variant="ghost" size="sm" onClick={toggleDarkMode}>
            {darkMode ? (
              <Sun className="h-4 w-4" />
            ) : (
              <Moon className="h-4 w-4" />
            )}
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Avatar>
                {currentAvatarSrc && (
                    <AvatarImage src={currentAvatarSrc.src} alt="User Avatar" />
                  )}
                <AvatarFallback>AT</AvatarFallback>
              </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={handleSignout}>
                Sign Out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
