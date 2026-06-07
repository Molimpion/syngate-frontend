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
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { LogOut, User, Menu, Moon, Sun, Bell } from 'lucide-react';

interface HeaderProps {
  onMenuClick: () => void;
}

export function Header({ onMenuClick }: HeaderProps) {
  const { session } = useSession();
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    // Lê o estado inicial do tema ao montar
    setIsDarkMode(document.documentElement.classList.contains('dark'));
  }, []);

  const toggleTheme = () => {
    const isDark = document.documentElement.classList.toggle('dark');
    setIsDarkMode(isDark);
  };

  const getInitials = (name: string) =>
    name.split(' ').map((n) => n[0]).slice(0, 2).join('').toUpperCase();

  const userName = session?.nome || 'Usuário';
  const firstName = userName.split(' ')[0];

  return (
    <header className={`
      h-20 shrink-0 sticky top-0 z-30
      flex items-center justify-between px-6 md:px-8
      border-b transition-colors duration-200
      ${isDarkMode
        ? 'bg-[#0d1f3c] border-[#1a3a6b] shadow-[0_1px_0_rgba(26,58,107,0.8)]'
        : 'bg-white/80 border-slate-200/60 shadow-sm backdrop-blur-md'
      }
    `}>

      {/* ── LADO ESQUERDO ──────────────────────────────────────── */}
      <div className="flex items-center gap-4">
        <button
          onClick={onMenuClick}
          className={`md:hidden p-2 rounded-lg transition-colors ${
            isDarkMode
              ? 'text-slate-300 hover:text-[#f47920] hover:bg-white/5'
              : 'text-slate-600 hover:text-[#004a99] hover:bg-slate-100/50'
          }`}
        >
          <Menu className="h-6 w-6" />
        </button>

        <div className="hidden md:flex flex-col">
          <span className={`text-xs font-bold uppercase tracking-widest ${
            isDarkMode ? 'text-slate-500' : 'text-slate-400'
          }`}>
            Portal de Gestão
          </span>
          <h2 className="text-lg font-bold text-[#f47920] tracking-tight">
            Olá, {firstName}
          </h2>
        </div>
      </div>

      {/* ── LADO DIREITO ───────────────────────────────────────── */}
      <div className="flex items-center gap-3 md:gap-5">

        {/* Botões de ação */}
        <div className={`flex items-center gap-1 md:gap-2 border-r pr-4 md:pr-5 ${
          isDarkMode ? 'border-white/10' : 'border-slate-200/60'
        }`}>
          <button
            onClick={toggleTheme}
            className={`p-2.5 rounded-full transition-colors ${
              isDarkMode
                ? 'text-slate-400 hover:text-[#f47920] hover:bg-white/5'
                : 'text-slate-400 hover:text-[#f47920] hover:bg-slate-100/80'
            }`}
            aria-label="Alternar tema"
          >
            {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </button>

          <button className={`p-2.5 rounded-full transition-colors relative ${
            isDarkMode
              ? 'text-slate-400 hover:text-[#f47920] hover:bg-white/5'
              : 'text-slate-400 hover:text-[#f47920] hover:bg-slate-100/80'
          }`}>
            <Bell className="h-5 w-5" />
            <span className={`absolute top-2.5 right-2.5 h-2 w-2 rounded-full bg-[#f47920] border-2 ${
              isDarkMode ? 'border-[#0d1f3c]' : 'border-white'
            }`} />
          </button>
        </div>

        {/* Avatar + Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger className="focus:outline-none">
            <div className="flex items-center gap-3 cursor-pointer">
              <div className="relative h-10 w-10 rounded-full p-[2px] bg-gradient-to-tr from-[#004a99] to-[#f47920] shadow-sm">
                <div className={`h-full w-full rounded-full flex items-center justify-center text-[#f47920] font-bold text-sm ${
                  isDarkMode ? 'bg-[#0d1f3c]' : 'bg-white'
                }`}>
                  {session?.nome ? getInitials(session.nome) : <User className="h-4 w-4" />}
                </div>
              </div>

              <div className="hidden md:flex flex-col items-start text-left">
                <span className="text-sm font-bold text-[#f47920] leading-none">
                  {userName}
                </span>
                <span className={`text-xs font-medium mt-1 ${
                  isDarkMode ? 'text-slate-400' : 'text-slate-500'
                }`}>
                  {session?.papel || 'Convidado'}
                </span>
              </div>
            </div>
          </DropdownMenuTrigger>

          <DropdownMenuContent
            align="end"
            className={`w-56 mt-2 shadow-xl rounded-xl p-2 border ${
              isDarkMode
                ? 'bg-[#0d1f3c] border-[#1a3a6b]'
                : 'bg-white border-slate-200/60'
            }`}
          >
            <DropdownMenuLabel className="px-2 py-1.5">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-bold text-[#f47920]">{userName}</p>
                <p className={`text-xs font-medium ${
                  isDarkMode ? 'text-slate-400' : 'text-slate-400'
                }`}>
                  {session?.papel}
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator className={isDarkMode ? 'bg-white/10 my-1' : 'bg-slate-100 my-1'} />
            <DropdownMenuItem
              onClick={() => logoutAction()}
              className="text-red-500 focus:text-red-500 focus:bg-red-500/10 cursor-pointer font-semibold rounded-lg px-3 py-2 transition-colors mt-1"
            >
              <LogOut className="mr-2 h-4 w-4" /> Sair do Sistema
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}