'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession } from '@/hooks/useSession';
import { 
  Activity, Users, DoorOpen, Network, BarChart3, Settings2, X 
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface SidebarProps {
  isMobileOpen: boolean;
  setIsMobileOpen: (open: boolean) => void;
}

export function Sidebar({ isMobileOpen, setIsMobileOpen }: SidebarProps) {
  const pathname = usePathname();
  const { session } = useSession();
  const papel = session?.papel;

  const menuItems = [
    { name: 'Painel', href: '/dashboard', icon: Activity, roles: ['ALUNO', 'PROFESSOR', 'FUNCIONARIO', 'COORDENADOR', 'GESTOR', 'VISITANTE'], group: 'Menu' },
    { name: 'Usuários', href: '/dashboard/usuarios', icon: Users, roles: ['GESTOR', 'COORDENADOR'], group: 'Administração' },
    { name: 'Salas', href: '/dashboard/salas', icon: DoorOpen, roles: ['GESTOR', 'COORDENADOR'], group: 'Administração' },
    { name: 'Dispositivos', href: '/dashboard/dispositivos', icon: Network, roles: ['GESTOR'], group: 'Administração' },
    { name: 'Relatórios', href: '/dashboard/relatorios', icon: BarChart3, roles: ['GESTOR', 'COORDENADOR'], group: 'Administração' },
    { name: 'Configurações', href: '/dashboard/configuracoes', icon: Settings2, roles: ['GESTOR'], group: 'Administração' },
  ];

  const visibleItems = menuItems.filter(item => papel && item.roles.includes(papel));

  return (
    <aside 
      className={cn(
        "fixed inset-y-0 left-0 z-50 w-64 flex-col bg-gradient-to-b from-[#004a99] to-[#002f63] text-white transform transition-transform duration-300 ease-in-out md:relative md:translate-x-0 flex shrink-0",
        isMobileOpen ? "translate-x-0" : "-translate-x-full"
      )}
    >
      {/* Branding */}
      <div className="flex h-16 items-center justify-between px-6 border-b border-white/10 shrink-0">
        <span className="text-xl font-bold tracking-widest text-white/90">SYNGATE</span>
        <button onClick={() => setIsMobileOpen(false)} className="md:hidden text-blue-200 hover:text-white p-1">
          <X className="h-6 w-6" />
        </button>
      </div>
      
      <nav className="flex-1 p-4 space-y-8 overflow-y-auto">
        {['Menu', 'Administração'].map(groupName => {
          const items = visibleItems.filter(i => i.group === groupName);
          if (items.length === 0) return null;

          return (
            <div key={groupName}>
              <p className="px-3 text-[10px] font-bold text-blue-300 uppercase tracking-widest mb-3 opacity-70">
                {groupName}
              </p>
              <div className="space-y-1.5">
                {items.map((item) => {
                  const isActive = pathname === item.href;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setIsMobileOpen(false)}
                      className={cn(
                        "group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-300 ease-out",
                        isActive 
                          ? "bg-white/10 text-white border-l-4 border-[#f47920] shadow-[0_0_15px_rgba(244,121,32,0.3)]" 
                          : "text-blue-100 hover:bg-white/10 hover:text-white hover:translate-x-2"
                      )}
                    >
                      <item.icon 
                        className={cn(
                          "h-5 w-5 transition-colors duration-300", 
                          isActive ? "text-[#f47920]" : "text-blue-300 group-hover:text-[#f47920]"
                        )} 
                      />
                      {item.name}
                    </Link>
                  );
                })}
              </div>
            </div>
          );
        })}
      </nav>
    </aside>
  );
}