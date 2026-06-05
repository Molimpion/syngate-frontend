'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession } from '@/hooks/useSession';
import { 
  LayoutDashboard, 
  Users, 
  DoorOpen, 
  MonitorSmartphone, 
  FileText, 
  Settings 
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { PapelUsuario } from '@/types'; // Importando seu tipo

export function Sidebar() {
  const pathname = usePathname();
  const { session } = useSession();
  const papel = session?.papel;

  // Definição dos itens e quais papéis podem ver cada um
  const menuItems = [
    { name: 'Painel', href: '/dashboard', icon: LayoutDashboard, roles: ['ADMIN', 'GESTOR', 'PROFESSOR', 'ALUNO', 'PORTARIA'] },
    { name: 'Usuários', href: '/dashboard/usuarios', icon: Users, roles: ['ADMIN', 'GESTOR'] },
    { name: 'Salas', href: '/dashboard/salas', icon: DoorOpen, roles: ['ADMIN', 'GESTOR'] },
    { name: 'Dispositivos', href: '/dashboard/dispositivos', icon: MonitorSmartphone, roles: ['ADMIN', 'GESTOR'] },
    { name: 'Relatórios', href: '/dashboard/relatorios', icon: FileText, roles: ['ADMIN', 'GESTOR'] },
    { name: 'Configurações', href: '/dashboard/configuracoes', icon: Settings, roles: ['ADMIN'] },
  ];

  // Filtra os itens baseado no papel que veio da sessão
  const visibleItems = menuItems.filter(item => 
    !papel || item.roles.includes(papel as PapelUsuario)
  );

  return (
    <aside className="hidden w-64 flex-col border-r bg-card text-card-foreground md:flex">
      <div className="flex h-16 items-center justify-center border-b bg-primary">
        <h1 className="text-xl font-bold text-primary-foreground tracking-wider">
          SYNGATE
        </h1>
      </div>
      
      <nav className="flex-1 space-y-1 p-4 overflow-y-auto">
        {visibleItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
          
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-colors",
                isActive 
                  ? "bg-secondary text-secondary-foreground"
                  : "hover:bg-muted hover:text-foreground text-muted-foreground"
              )}
            >
              <item.icon className="h-5 w-5" />
              {item.name}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}