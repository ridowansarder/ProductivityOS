import { LogOutIcon } from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
} from "@/components/ui/sidebar";
import { Separator } from "./ui/separator";
import { SignOutButton } from "@clerk/nextjs";
import { getOrCreateUser } from "@/lib/getOrCreateUser";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { ModeToggle } from "./ModeToggle";
import { SidebarMenuItems } from "./SidebarMenuItems"; // Import the new component

export async function DashboardSidebar() {
  const user = await getOrCreateUser();
  return (
    <Sidebar collapsible="icon">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="flex items-center justify-between">
            <p className="text-lg">ProductivityOS</p>
            <ModeToggle />

          </SidebarGroupLabel>
          <Separator className="my-3" />
          <SidebarGroupContent>
            <SidebarMenuItems />
            <SidebarMenu>
              <Separator className="my-3" />
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <Avatar className="h-8 w-8 rounded-lg">
                  <AvatarImage
                    src={user?.imageUrl || undefined}
                    alt={user?.name || ""}
                  />
                  <AvatarFallback className="rounded-lg">CN</AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">{user?.name}</span>
                  <span className="truncate text-xs">{user?.email}</span>
                </div>
              </div>
              <SidebarMenuButton asChild className="mt-3 cursor-pointer">
                <SignOutButton>
                  <div>
                    <LogOutIcon />
                    Sign out
                  </div>
                </SignOutButton>
              </SidebarMenuButton>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
