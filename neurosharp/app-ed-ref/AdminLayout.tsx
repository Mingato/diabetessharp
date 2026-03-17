import { ReactNode } from "react";
import { useLocation } from "wouter";
import { useAdmin } from "@/contexts/AdminContext";
import {
  LayoutDashboard,
  Users,
  BarChart3,
  ScrollText,
  LogOut,
  Zap,
  ShieldCheck,
  Settings,
  MessageSquare,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const navItems = [
  { href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/users", label: "Users", icon: Users },
  { href: "/admin/revenue", label: "Revenue", icon: BarChart3 },
  { href: "/admin/support", label: "Support", icon: MessageSquare },
  { href: "/admin/audit", label: "Audit Log", icon: ScrollText },
  { href: "/admin/settings", label: "Settings", icon: Settings },
];

export function AdminLayout({ children }: { children: ReactNode }) {
  const [location, navigate] = useLocation();
  const { username, logout } = useAdmin();

  const handleLogout = () => {
    logout();
    navigate("/admin/login");
  };

  return (
    <div className="flex min-h-screen bg-[#0a0a0f]">
      {/* Sidebar */}
      <aside className="w-60 shrink-0 border-r border-white/10 flex flex-col">
        {/* Logo */}
        <div className="flex items-center gap-3 px-5 py-5 border-b border-white/10">
          <div className="w-9 h-9 rounded-lg bg-amber-500 flex items-center justify-center">
            <Zap className="w-5 h-5 text-black" />
          </div>
          <div>
            <div className="text-white font-bold text-sm leading-tight">Vigronex</div>
            <div className="text-amber-500 text-xs font-medium flex items-center gap-1">
              <ShieldCheck className="w-3 h-3" /> Admin Panel
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-1">
          {navItems.map(({ href, label, icon: Icon }) => {
            const active = location.startsWith(href);
            return (
              <button
                key={href}
                onClick={() => navigate(href)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  active
                    ? "bg-amber-500/15 text-amber-400"
                    : "text-white/60 hover:text-white hover:bg-white/5"
                }`}
              >
                <Icon className="w-4 h-4 shrink-0" />
                {label}
              </button>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="px-4 py-4 border-t border-white/10">
          <div className="text-xs text-white/40 mb-2 truncate">Logged in as <span className="text-white/70">{username}</span></div>
          <Button variant="ghost" size="sm" className="w-full justify-start text-red-400 hover:text-red-300 hover:bg-red-500/10 px-2" onClick={handleLogout}>
            <LogOut className="w-4 h-4 mr-2" /> Sign Out
          </Button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  );
}
