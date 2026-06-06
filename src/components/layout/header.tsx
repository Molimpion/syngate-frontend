// src/components/layout/header.tsx
'use client';

import { useEffect, useState } from 'react';
import { useSession } from '@/hooks/useSession';
import { logoutAction } from '@/actions/auth';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { LogOut, User, Menu, Moon, Sun } from 'lucide-react';

interface HeaderProps {
  onMenuClick: () => void;
}

export function Header({ onMenuClick }: HeaderProps) {
  const { session } = useSession();
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    setIsDarkMode(document.documentElement.classList.contains('dark'));
  }, []);

  const toggleTheme = () => {
    const isDark = document.documentElement.classList.toggle('dark');
    setIsDarkMode(isDark);
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase();
  };

  return (
    <header className="h-16 border-b border-slate-200 bg-white flex items-center justify-between md:justify-end px-4 md:px-6 shadow-sm shrink-0">
      
      <button onClick={onMenuClick} className="md:hidden p-2 text-slate-600 hover:bg-slate-100 rounded-md">
        <Menu className="h-6 w-6" />
      </button>

      <div className="flex items-center gap-4 ml-auto">
        <button onClick={toggleTheme} className="p-2 text-slate-500 hover:bg-slate-100 rounded-full transition-colors">
          {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
        </button>

        <DropdownMenu>
          <DropdownMenuTrigger className="focus:outline-none">
            <div className="h-10 w-10 rounded-full border-2 border-[#f47920] bg-white flex items-center justify-center text-[#004a99] font-bold text-sm shadow-sm hover:bg-slate-50 transition-all cursor-pointer">
              {session?.nome ? getInitials(session.nome) : <User className="h-5 w-5" />}
            </div>
          </DropdownMenuTrigger>
          
          <DropdownMenuContent align="end" className="w-56 mt-2 border-slate-200">
            <DropdownMenuLabel>
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium text-slate-900">{session?.nome || 'Usuário'}</p>
                <p className="text-xs text-slate-500">Nível: {session?.papel}</p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => logoutAction()} className="text-red-600 focus:text-red-600 focus:bg-red-50 cursor-pointer font-medium">
              <LogOut className="mr-2 h-4 w-4" /> Sair do Sistema
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}