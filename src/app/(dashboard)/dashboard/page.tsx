// src/app/(dashboard)/dashboard/page.tsx
'use client';

import { Activity, ShieldCheck, Cpu, ArrowUpRight } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { StatsCards } from '@/components/dashboard/StatsCards';
import { AccessFeed } from '@/components/dashboard/AccessFeed';

export default function DashboardPage() {
  return (
    <div className="p-8 bg-slate-50 min-h-screen">
      {/* Barra de Status Operacional */}
      <div className="mb-8 flex items-center justify-between p-4 bg-[#004a99] rounded-xl text-white shadow-lg shadow-blue-900/20">
        <div className="flex items-center gap-4">
          <div className="p-2 bg-white/10 rounded-lg">
            <Activity className="h-6 w-6 text-white animate-pulse" />
          </div>
          <div>
            <h2 className="font-semibold text-lg">Sistema Syngate Ativo</h2>
            <p className="text-blue-200 text-sm">Monitoramento em tempo real operando com latência mínima.</p>
          </div>
        </div>
        <div className="hidden md:flex gap-6 border-l border-white/20 pl-6">
          <div className="text-center">
            <span className="block text-2xl font-bold">99.9%</span>
            <span className="text-[10px] uppercase tracking-wider text-blue-200">Uptime</span>
          </div>
        </div>
      </div>

      <div className="mb-8">
        <StatsCards />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Feed de Acessos */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
             <h3 className="text-lg font-bold text-slate-800">Fluxo de Acessos</h3>
             <button className="text-xs font-semibold text-[#f47920] flex items-center gap-1 hover:underline">
               Ver Relatório <ArrowUpRight className="h-3 w-3" />
             </button>
          </div>
          <Card className="border-none shadow-sm shadow-slate-200/50">
            <CardContent className="pt-6">
              <AccessFeed />
            </CardContent>
          </Card>
        </div>

        {/* Painel Lateral de Ferramentas */}
        <div className="space-y-6">
           <div className="p-6 bg-white rounded-xl border border-slate-200 shadow-sm">
             <div className="flex items-center gap-3 mb-4 text-[#004a99]">
               <ShieldCheck className="h-6 w-6" />
               <h3 className="font-bold">Segurança</h3>
             </div>
             <p className="text-sm text-slate-500 mb-6">Última auditoria de logs realizada recentemente.</p>
             <button className="w-full py-2 bg-[#f47920] hover:bg-[#d96b1c] text-white rounded-lg text-sm font-semibold transition-colors">
               Executar Auditoria
             </button>
           </div>

           <div className="p-6 bg-white rounded-xl border border-slate-200 shadow-sm">
             <div className="flex items-center gap-3 mb-4 text-[#004a99]">
               <Cpu className="h-6 w-6" />
               <h3 className="font-bold">Infraestrutura</h3>
             </div>
             <div className="space-y-3">
               <div className="flex justify-between text-sm">
                 <span className="text-slate-500">Servidor API</span>
                 <span className="font-medium text-emerald-600">Online</span>
               </div>
               <div className="flex justify-between text-sm">
                 <span className="text-slate-500">Banco de Dados</span>
                 <span className="font-medium text-emerald-600">Online</span>
               </div>
             </div>
           </div>
        </div>
      </div>
    </div>
  );
}