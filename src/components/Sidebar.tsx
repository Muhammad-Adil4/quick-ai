import { useClerk, useUser } from "@clerk/nextjs";
import {
  Eraser,
  FileText,
  Hash,
  House,
  LogOut,
  Scissors,
  SquarePen,
  Users,
  Image as IconImage,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

interface DataProps {
  sidebarOpen: boolean;
  setSidebarOpen: React.Dispatch<React.SetStateAction<boolean>>;
  
}

const navItems = [
  { to: "/ai", label: "Dashboard", Icon: House },
  { to: "/ai/write-article", label: "Write Article", Icon: SquarePen },
  { to: "/ai/blog-titles", label: "Blog Titles", Icon: Hash },
  { to: "/ai/generate-images", label: "Generate Images", Icon: IconImage },
  { to: "/ai/remove-background", label: "Remove Background", Icon: Eraser },
  { to: "/ai/remove-object", label: "Remove Object", Icon: Scissors },
  { to: "/ai/review-resume", label: "Review Resume", Icon: FileText },
  { to: "/ai/community", label: "Community", Icon: Users },
];

const Sidebar: React.FC<DataProps> = ({ sidebarOpen, setSidebarOpen }) => {
  const { user } = useUser();
  const { signOut, openUserProfile } = useClerk();
  const pathname = usePathname();

  const userPlan = (user?.publicMetadata?.plan as string) || "Free";

  return (
    <div
      className={`w-60 bg-white border-r border-gray-200 flex flex-col justify-between items-center max-sm:absolute top-14 bottom-0  
        ${sidebarOpen ? "translate-x-0" : "max-sm:-translate-x-full"}
        transition-all duration-300 ease-in-out`}
    >
      {/* Top section */}
      <div className="my-7 w-full flex flex-col items-center gap-2">
        {user?.imageUrl && (
          <Image
            src={user?.imageUrl || "/default.png"}
            alt="userProfile"
            width={48}
            height={48}
            className="rounded-full"
          />
        )}
        <h1 className="mt-1 text-center font-medium">{user?.fullName}</h1>

        {/* Navigation */}
        <div className="px-6 mt-5 text-sm font-medium w-full">
          {navItems.map(({ to, label, Icon }) => {
            const isActive = pathname === to;
            return (
              <Link
                href={to}
                key={to}
                onClick={() => setSidebarOpen(false)}
                className={`px-3.5 py-2.5 flex items-center gap-3 rounded transition-colors
                  ${
                    isActive
                      ? "bg-gradient-to-r from-[#3C81F6] to-[#9234EA] text-white"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
              >
                <Icon
                  className={`w-4 h-4 ${
                    isActive ? "text-white" : "text-gray-500"
                  }`}
                />
                {label}
              </Link>
            );
          })}
        </div>
      </div>

      {/* Footer */}
      <div className="w-full border-t border-gray-200 p-4 px-5 flex items-center justify-between">
        {/* Profile Button */}
        <button
          onClick={() => openUserProfile()}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition"
        >
          <Image
            src={user?.imageUrl || "/default.png"}
            alt="profile"
            width={28}
            height={28}
            className="rounded-full"
          />
          <span className="text-sm">Profile</span>
        </button>

        {/* Plan Badge */}
        <span className="px-3 py-1 text-xs font-medium rounded-full bg-gradient-to-r from-[#3C81F6] to-[#9234EA] text-white shadow">
          {userPlan}
        </span>

        {/* Logout Button */}
        <button
          onClick={() => signOut()}
          className="flex items-center gap-2 text-gray-500 hover:text-red-600 transition"
        >
          <LogOut className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
