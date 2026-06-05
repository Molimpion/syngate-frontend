'use client';

import { useSession } from '@/hooks/useSession';
import { logoutAction } from '@/actions/auth';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { LogOut, User } from 'lucide-react';
import { useTheme } from 'next-themes';
import { Moon, Sun } from 'lucide-react';

export function Header() {
  const { session } = useSession();
  const { setTheme, theme } = useTheme();

  return (
    <header className="flex h-16 items-center justify-between border-b bg-card px-6 shadow-sm">
      <div className="flex items-center gap-4">
        {/* Espaço para um botão de menu mobile no futuro */}
      </div>

      <div className="flex items-center gap-4">
        {/* Botão de Dark Mode */}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          className="rounded-full"
        >
          <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Alternar tema</span>
        </Button>

        {/* Dropdown do Perfil */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-8 w-8 rounded-full">
              <Avatar className="h-9 w-9 border-2 border-primary">
                <AvatarFallback className="bg-primary/10 text-primary font-bold">
                  {session?.papel?.charAt(0) || <User className="h-4 w-4" />}
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end" forceMount>
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">Minha Conta</p>
                <p className="text-xs leading-none text-muted-foreground">
                  Nível de Acesso: <span className="font-bold text-secondary">{session?.papel || 'Carregando...'}</span>
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => logoutAction()} className="text-destructive cursor-pointer">
              <LogOut className="mr-2 h-4 w-4" />
              <span>Sair do Sistema</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}