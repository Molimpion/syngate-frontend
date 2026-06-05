"use client";

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { loginAction } from '@/actions/auth';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label'; // Puxando apenas o Label cru do Shadcn
import { toast } from 'sonner';

const loginSchema = z.object({
  email: z.string().email('E-mail inválido'),
  senha: z.string().min(6, 'Senha curta'),
});

type LoginForm = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter();
  
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', senha: '' },
  });

  async function onSubmit(data: LoginForm) {
    const result = await loginAction(data);
    if (result.success) router.push('/dashboard');
    else toast.error(result.error);
  }

  return (
    <div className="flex min-h-screen w-full bg-white lg:grid lg:grid-cols-2">
      
      {/* ========================================================
          COLUNA ESQUERDA: Área Institucional com Degradê
          ======================================================== */}
      <div className="relative hidden w-full flex-col justify-between overflow-hidden bg-gradient-to-br from-[#f47920] from-20% via-[#004a99] via-60% to-[#003d7d] p-12 lg:flex">
        
        {/* Efeitos de Luz sutis para dar profundidade ao degradê */}
        <div className="pointer-events-none absolute -left-20 -top-20 h-96 w-96 rounded-full bg-white/20 blur-[100px]" />
        <div className="pointer-events-none absolute -bottom-20 -right-20 h-[30rem] w-[30rem] rounded-full bg-black/20 blur-[120px]" />

        {/* Conteúdo Institucional */}
        <div className="relative z-10 mt-8">
          <h2 className="text-4xl font-bold tracking-tight text-white">Syngate.</h2>
          <p className="mt-4 max-w-md text-lg text-blue-50/90">
            Plataforma centralizada para gestão acadêmica e controle de acessos da CPA.
          </p>

          {/* Tópicos */}
          <div className="mt-16 space-y-8">
            
            <div className="flex items-center gap-5">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white/10 border border-white/10 text-white shadow-sm backdrop-blur-sm">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
              </div>
              <div>
                <h4 className="font-semibold text-white">Gestão Segura</h4>
                <p className="text-sm text-blue-100/80">Controle de acessos rigoroso e auditável.</p>
              </div>
            </div>

            <div className="flex items-center gap-5">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white/10 border border-white/10 text-white shadow-sm backdrop-blur-sm">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><line x1="3" y1="9" x2="21" y2="9"/><line x1="9" y1="21" x2="9" y2="9"/></svg>
              </div>
              <div>
                <h4 className="font-semibold text-white">Ambiente Integrado</h4>
                <p className="text-sm text-blue-100/80">Tudo o que você precisa em uma única tela.</p>
              </div>
            </div>

            <div className="flex items-center gap-5">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white/10 border border-white/10 text-white shadow-sm backdrop-blur-sm">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>
              </div>
              <div>
                <h4 className="font-semibold text-white">Alta Performance</h4>
                <p className="text-sm text-blue-100/80">Relatórios gerenciais e métricas em tempo real.</p>
              </div>
            </div>

          </div>
        </div>

        {/* Rodapé da coluna */}
        <div className="relative z-10 text-sm font-medium text-blue-200/50">
          © 2026 Senac Pernambuco. Todos os direitos reservados.
        </div>
      </div>

      {/* ========================================================
          COLUNA DIREITA: Área de Login
          ======================================================== */}
      <div className="flex items-center justify-center p-8">
        <div className="w-full max-w-[380px] space-y-8">
          
          <div>
            <h1 className="text-3xl font-semibold tracking-tight text-slate-900">Entrar</h1>
            <p className="mt-2 text-sm text-slate-500">Bem-vindo(a) de volta. Insira seus dados.</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            
            <div className="space-y-2">
              <Label 
                htmlFor="email" 
                className="text-[11px] font-bold uppercase tracking-wider text-slate-900"
              >
                E-mail
              </Label>
              <Input 
                id="email"
                type="email"
                className="h-12 rounded-md border border-slate-300 !bg-white text-slate-900 placeholder:text-slate-400 focus-visible:border-[#004a99] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#004a99] focus-visible:ring-offset-0" 
                placeholder="Usuario" 
                {...register('email')}
              />
              {errors.email && (
                <p className="text-xs font-medium text-red-500">{errors.email.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label 
                htmlFor="senha" 
                className="text-[11px] font-bold uppercase tracking-wider text-slate-900"
              >
                Senha
              </Label>
              <Input 
                id="senha"
                type="password" 
                className="h-12 rounded-md border border-slate-300 !bg-white text-slate-900 placeholder:text-slate-400 focus-visible:border-[#004a99] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#004a99] focus-visible:ring-offset-0" 
                placeholder="••••••••" 
                {...register('senha')}
              />
              {errors.senha && (
                <p className="text-xs font-medium text-red-500">{errors.senha.message}</p>
              )}
            </div>
            
            <Button 
              type="submit"
              className="mt-2 h-12 w-full rounded-md bg-[#f47920] font-bold text-white transition-all hover:bg-[#d96719]"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Verificando...' : 'Acessar Sistema'}
            </Button>
          </form>

          <div className="text-center">
            <button className="text-sm font-medium text-slate-900 transition-colors hover:text-[#004a99] hover:underline">
              Problemas com o acesso?
            </button>
          </div>

        </div>
      </div>

    </div>
  );
}