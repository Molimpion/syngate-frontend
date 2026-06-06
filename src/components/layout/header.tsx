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
import { LogOut, User, Menu, Moon, Sun, Bell } from 'lucide-react';
import { motion } from 'framer-motion';

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

  // Nome do usuário ou fallback
  const userName = session?.nome || 'Usuário';
  const firstName = userName.split(' ')[0];

  return (
    <header className="h-20 border-b border-slate-200/60 bg-white/80 backdrop-blur-md flex items-center justify-between px-6 md:px-8 shadow-sm shrink-0 sticky top-0 z-30 transition-all">
      
      <div className="flex items-center gap-4">
        <button 
          onClick={onMenuClick} 
          className="md:hidden p-2 text-slate-600 hover:text-[#004a99] hover:bg-slate-100/50 rounded-lg transition-colors"
        >
          <Menu className="h-6 w-6" />
        </button>
        
        <div className="hidden md:flex flex-col">
          <span className="text-xs font-bold uppercase tracking-widest text-slate-400">
            Portal de Gestão
          </span>
          {/* Nome do usuário em Laranja */}
          <h2 className="text-lg font-bold text-[#f47920] tracking-tight transition-colors">
            Olá, {firstName}
          </h2>
        </div>
      </div>

      <div className="flex items-center gap-3 md:gap-5">
        <div className="flex items-center gap-1 md:gap-2 border-r border-slate-200/60 pr-4 md:pr-5">
          <button onClick={toggleTheme} className="p-2.5 text-slate-400 hover:text-[#f47920] hover:bg-slate-100/80 rounded-full transition-colors">
            {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </button>
          <button className="p-2.5 text-slate-400 hover:text-[#f47920] hover:bg-slate-100/80 rounded-full transition-colors relative">
            <Bell className="h-5 w-5" />
            <span className="absolute top-2.5 right-2.5 h-2 w-2 rounded-full bg-[#f47920] border-2 border-white"></span>
          </button>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger className="focus:outline-none">
            <div className="flex items-center gap-3 cursor-pointer">
              <div className="relative h-10 w-10 rounded-full p-[2px] bg-gradient-to-tr from-[#004a99] to-[#f47920] shadow-sm">
                {/* Iniciais em Laranja */}
                <div className="h-full w-full bg-white rounded-full flex items-center justify-center text-[#f47920] font-bold text-sm">
                  {session?.nome ? getInitials(session.nome) : <User className="h-4 w-4" />}
                </div>
              </div>

              <div className="hidden md:flex flex-col items-start text-left">
                {/* Nome do usuário no Dropdown em Laranja */}
                <span className="text-sm font-bold text-[#f47920] leading-none">
                  {userName}
                </span>
                <span className="text-xs font-medium text-slate-500 mt-1">
                  {session?.papel || 'Convidado'}
                </span>
              </div>
            </div>
          </DropdownMenuTrigger>
          
          <DropdownMenuContent align="end" className="w-56 mt-2 border-slate-200/60 shadow-xl rounded-xl p-2">
            <DropdownMenuLabel className="px-2 py-1.5">
              <div className="flex flex-col space-y-1">
                {/* Nome no menu interno em Laranja */}
                <p className="text-sm font-bold text-[#f47920]">{userName}</p>
                <p className="text-xs font-medium text-slate-400">{session?.papel}</p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-slate-100 my-1" />
            <DropdownMenuItem 
              onClick={() => logoutAction()} 
              className="text-red-600 focus:text-red-600 focus:bg-red-50 cursor-pointer font-semibold rounded-lg px-3 py-2 transition-colors mt-1"
            >
              <LogOut className="mr-2 h-4 w-4" /> Sair do Sistema
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}