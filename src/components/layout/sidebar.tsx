'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  Users, 
  DoorOpen, 
  MonitorSmartphone, 
  FileText, 
  Settings 
} from 'lucide-react';
import { cn } from '@/lib/utils';

const menuItems = [
  { name: 'Painel', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Usuários', href: '/dashboard/usuarios', icon: Users },
  { name: 'Salas', href: '/dashboard/salas', icon: DoorOpen },
  { name: 'Dispositivos', href: '/dashboard/dispositivos', icon: MonitorSmartphone },
  { name: 'Relatórios', href: '/dashboard/relatorios', icon: FileText },
  { name: 'Configurações', href: '/dashboard/configuracoes', icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden w-64 flex-col border-r bg-card text-card-foreground md:flex">
      <div className="flex h-16 items-center justify-center border-b bg-primary">
        {/* Azul Senac no Fundo do Logo */}
        <h1 className="text-xl font-bold text-primary-foreground tracking-wider">
          SYNGATE
        </h1>
      </div>
      
      <nav className="flex-1 space-y-1 p-4 overflow-y-auto">
        {menuItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
          
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-colors",
                isActive 
                  ? "bg-secondary text-secondary-foreground" // Laranja Senac quando ativo
                  : "hover:bg-muted hover:text-foreground text-muted-foreground"
              )}
            >
              <item.icon className={cn("h-5 w-5", isActive ? "text-secondary-foreground" : "text-muted-foreground")} />
              {item.name}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}