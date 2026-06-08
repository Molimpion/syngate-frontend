'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession } from '@/hooks/useSession';
import { 
  Activity, Users, DoorOpen, Network, BarChart3, Settings2, X, Clock3, User
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

interface SidebarProps {
  isMobileOpen: boolean;
  setIsMobileOpen: (open: boolean) => void;
}

export function Sidebar({ isMobileOpen, setIsMobileOpen }: SidebarProps) {
  const pathname = usePathname();
  const { session } = useSession();
  const papel = session?.papel;
  
  const [isCollapsed, setIsCollapsed] = useState(true);

  const menuItems = [
    { name: 'Painel',        href: '/dashboard',     icon: Activity,  roles: ['ALUNO', 'PROFESSOR', 'FUNCIONARIO', 'COORDENADOR', 'GESTOR', 'VISITANTE'], group: 'Menu' },
    { name: 'Perfil',        href: '/perfil',        icon: User,      roles: ['ALUNO', 'PROFESSOR', 'FUNCIONARIO', 'COORDENADOR', 'GESTOR', 'VISITANTE'], group: 'Menu' },
    { name: 'Usuários',      href: '/usuarios',      icon: Users,     roles: ['GESTOR', 'COORDENADOR'], group: 'Administração' },
    { name: 'Turnos',        href: '/turnos',        icon: Clock3,    roles: ['GESTOR', 'COORDENADOR'], group: 'Administração' },
    { name: 'Salas',         href: '/salas',         icon: DoorOpen,  roles: ['GESTOR', 'COORDENADOR'], group: 'Administração' },
    { name: 'Dispositivos',  href: '/devices',       icon: Network,   roles: ['GESTOR', 'COORDENADOR'], group: 'Administração' },
    { name: 'Relatórios',    href: '/reports',       icon: BarChart3, roles: ['GESTOR', 'COORDENADOR'], group: 'Administração' },
    { name: 'Configurações', href: '/configuracoes', icon: Settings2, roles: ['GESTOR'],                group: 'Administração' },
  ];

  const visibleItems = menuItems.filter(item => papel && item.roles.includes(papel));

  return (
    <aside 
      onMouseEnter={() => setIsCollapsed(false)}
      onMouseLeave={() => setIsCollapsed(true)}
      className={cn(
        "fixed inset-y-0 left-0 z-50 flex-col bg-[var(--color-sidebar)] text-white transform transition-all duration-300 ease-in-out md:relative flex shrink-0 overflow-hidden border-r border-[var(--color-sidebar-border)]",
        isMobileOpen ? "translate-x-0 w-64" : "-translate-x-full md:translate-x-0",
        !isMobileOpen && isCollapsed ? "md:w-20" : "md:w-64"
      )}
    >
      <div 
        className="absolute right-0 bottom-0 h-56 w-full opacity-90 pointer-events-none z-0 transition-all duration-300"
        style={{
          clipPath: 'polygon(0 100%, 100% 100%, 100% 70%, 0 0)',
          background: 'linear-gradient(to top right, #d8540d 0%, #f47920 8%, transparent 76%)',
          boxShadow: 'inset 0 0 20px rgba(244,121,32,0.5)'
        }}
      />
      <div
        className="absolute inset-0 opacity-[0.05] pointer-events-none z-0"
        style={{
          backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)',
          backgroundSize: '24px 24px',
        }}
      />

      <div className={cn(
        "relative z-10 flex h-20 items-center border-b border-white/10 shrink-0 bg-transparent transition-all duration-300",
        isCollapsed ? "justify-center px-0" : "justify-between px-6"
      )}>
        <span className={cn(
          "font-bold tracking-tight text-white transition-all duration-300 overflow-hidden whitespace-nowrap",
          isCollapsed ? "text-2xl" : "text-xl"
        )}>
          {isCollapsed ? "S" : "Syngate"}
          <span className="text-[#f47920]">.</span>
        </span>
        
        <button 
          onClick={() => setIsMobileOpen(false)} 
          className="md:hidden text-white/70 hover:text-white p-1 transition-colors rounded-md hover:bg-white/5"
        >
          <X className="h-6 w-6" />
        </button>
      </div>
      
      <nav className="relative z-10 flex-1 py-6 space-y-7 overflow-y-auto overflow-x-hidden [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-thumb]:bg-white/10 [&::-webkit-scrollbar-thumb]:rounded-full">
        {['Menu', 'Administração'].map(groupName => {
          const items = visibleItems.filter(i => i.group === groupName);
          if (items.length === 0) return null;

          return (
            <div key={groupName} className="space-y-2 px-3">
              <p className={cn(
                "text-[10px] font-bold text-white/40 uppercase tracking-widest transition-all duration-300",
                isCollapsed ? "text-center" : "px-3"
              )}>
                {isCollapsed ? "•••" : groupName}
              </p>
              
              <div className="space-y-1">
                {items.map((item) => {
                  const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setIsMobileOpen(false)}
                      className="block relative"
                    >
                      <motion.div
                        whileHover={{ x: isCollapsed ? 0 : 4 }}
                        whileTap={{ scale: 0.95 }}
                        className={cn(
                          "group flex items-center rounded-lg text-sm font-medium transition-colors relative z-10 overflow-hidden",
                          isCollapsed ? "justify-center h-11 w-11 mx-auto" : "px-3 py-2.5 w-full",
                          isActive 
                            ? "text-white font-semibold" 
                            : "text-white/70 hover:text-white hover:bg-white/5"
                        )}
                      >
                        {isActive && (
                          <motion.div
                            layoutId="activeSidebarTab"
                            className={cn("absolute inset-0 bg-white/10", isCollapsed ? "rounded-lg" : "rounded-lg border-l-4 border-[#f47920]")}
                            initial={false}
                            transition={{ type: "spring", stiffness: 350, damping: 30 }}
                          />
                        )}
                        <item.icon className={cn("h-[18px] w-[18px] relative z-10 shrink-0", isActive ? "text-[#f47920]" : "text-white/40")} />
                        <span className={cn(
                          "relative z-10 tracking-wide whitespace-nowrap overflow-hidden transition-all duration-300",
                          isCollapsed ? "max-w-0 opacity-0 ml-0" : "max-w-[150px] opacity-100 ml-3"
                        )}>
                          {item.name}
                        </span>
                      </motion.div>
                    </Link>
                  );
                })}
              </div>
            </div>
          );
        })}
      </nav>

      <div className="relative z-10 p-4 text-center mt-auto pb-6">
        <p className="text-[10px] text-white/80 tracking-widest uppercase font-bold whitespace-nowrap overflow-hidden transition-all duration-300">
          {isCollapsed ? "PE" : "Senac PE · 2026"}
        </p>
      </div>
    </aside>
  );
}