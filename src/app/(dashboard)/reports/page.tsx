'use client';

import { Suspense, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { DownloadCloud } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { reportsService } from '@/services/reports.service';
import { ReportsFilter } from '@/components/reports/ReportsFilter';
import { ReportsTable } from '@/components/reports/ReportsTable';
import { toast } from 'sonner';

function ReportsContent() {
  const searchParams = useSearchParams();
  const [isExporting, setIsExporting] = useState(false);

  const filters = {
    dataInicio: searchParams.get('dataInicio') || undefined,
    dataFim: searchParams.get('dataFim') || undefined,
    status: searchParams.get('status') || undefined,
  };

  const { data, isLoading } = useQuery({
    queryKey: ['reports', filters],
    queryFn: () => reportsService.getDashboard(filters),
    staleTime: 5 * 60 * 1000, // 5 minutos de cache (alinhado com Redis)
  });

  const handleExport = async () => {
    setIsExporting(true);
    toast.info('Iniciando download do CSV...');
    try {
      await reportsService.exportCSV(filters);
      toast.success('Download concluído!');
    } catch {
      toast.error('Erro ao exportar arquivo.');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-slate-800">Relatórios e Auditoria</h1>
        <Button 
          onClick={handleExport} 
          disabled={isExporting || isLoading || !data?.data?.detalhes?.length} 
          className="bg-[#004a99] hover:bg-[#003d7d] text-white"
        >
          <DownloadCloud className="h-4 w-4 mr-2" /> 
          {isExporting ? 'Gerando...' : 'Exportar CSV'}
        </Button>
      </div>

      <ReportsFilter />

      {isLoading ? (
        <div className="text-center py-10 text-slate-500">Carregando logs...</div>
      ) : (
        <ReportsTable logs={data?.data?.detalhes || []} />
      )}
    </div>
  );
}

export default function ReportsPage() {
  return (
    <Suspense fallback={<div className="p-6">Carregando interface...</div>}>
      <ReportsContent />
    </Suspense>
  );
}