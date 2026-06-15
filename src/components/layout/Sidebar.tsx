"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import {
  LayoutDashboard,
  CheckSquare,
  DollarSign,
  Users,
  Star,
  Clock,
  Gift,
  Image,
  Music,
  Plane,
  PartyPopper,
  ShoppingBag,
  Grid3X3,
  Bot,
  LogOut,
  Heart,
  X,
  Plug,
  Settings,
} from "lucide-react";

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Checklist", href: "/checklist", icon: CheckSquare },
  { name: "Orçamento", href: "/budget", icon: DollarSign },
  { name: "Convidados", href: "/guests", icon: Users },
  { name: "Fornecedores", href: "/vendors", icon: Star },
  { name: "Cronograma", href: "/timeline", icon: Clock },
  { name: "Lista de Presentes", href: "/gifts", icon: Gift },
  { name: "Inspirações", href: "/inspiration", icon: Image },
  { name: "Música", href: "/music", icon: Music },
  { name: "Lua de Mel", href: "/honeymoon", icon: Plane },
  { name: "Despedida", href: "/bachelorette", icon: PartyPopper },
  { name: "Enxoval", href: "/trousseau", icon: ShoppingBag },
  { name: "Mesas", href: "/seating", icon: Grid3X3 },
  { name: "IA Assistente", href: "/ai-assistant", icon: Bot },
  { name: "Integrações", href: "/integrations", icon: Plug },
];

interface SidebarProps {
  onClose?: () => void;
}

export default function Sidebar({ onClose }: SidebarProps) {
  const pathname = usePathname();
  const { data: session } = useSession();
  const userRole = (session?.user as any)?.role ?? 'user';

  return (
    <div className="flex flex-col h-full bg-white border-r border-stone-100">
      {/* Logo */}
      <div className="flex items-center justify-between px-5 py-5 border-b border-stone-100">
        <Link href="/dashboard" className="flex items-center gap-2">
          <Heart className="w-6 h-6 text-rose-500 fill-rose-500" />
          <span className="font-bold text-rose-600 text-lg">Até o Altar</span>
        </Link>
        {onClose && (
          <button onClick={onClose} className="lg:hidden text-stone-400 hover:text-stone-600">
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        {navigation.map((item) => {
          const active = pathname === item.href || pathname.startsWith(item.href + "/");
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onClose}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                active
                  ? "bg-rose-50 text-rose-600"
                  : "text-stone-600 hover:bg-stone-50 hover:text-stone-800"
              }`}
            >
              <item.icon className={`w-4 h-4 flex-shrink-0 ${active ? "text-rose-500" : "text-stone-400"}`} />
              {item.name}
            </Link>
          );
        })}
      </nav>

      {/* Admin link */}
      {(userRole === 'owner' || userRole === 'admin') && (
        <div className="px-3 pb-2">
          <hr className="border-stone-100 mb-2" />
          <Link
            href="/admin"
            onClick={onClose}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
              pathname?.startsWith('/admin')
                ? 'bg-purple-50 text-purple-700'
                : 'text-purple-600 hover:bg-purple-50'
            }`}
          >
            <Settings className="w-4 h-4 flex-shrink-0" />
            Painel Admin
          </Link>
        </div>
      )}

      {/* Sign out */}
      <div className="px-3 py-4 border-t border-stone-100">
        <button
          onClick={() => signOut({ callbackUrl: "/" })}
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-stone-500 hover:bg-stone-50 hover:text-stone-700 w-full transition-all"
        >
          <LogOut className="w-4 h-4 text-stone-400" />
          Sair
        </button>
      </div>
    </div>
  );
}
