import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { empresaService } from '@/lib/api';
import type { Empresa, EmpresaCreateData, EmpresaUpdateData } from '@/types';

export function useEmpresas(params?: {
  limit?: number;
  offset?: number;
  activo?: boolean;
  plan?: string;
  search?: string;
}) {
  return useQuery({
    queryKey: ['empresas', params],
    queryFn: async () => {
      const response = await empresaService.getAll(params);
      return response.data;
    },
  });
}

export function useEmpresa(id: number) {
  return useQuery({
    queryKey: ['empresa', id],
    queryFn: async () => {
      const response = await empresaService.getById(id);
      return response.data;
    },
    enabled: !!id && id > 0,
  });
}

export function useEmpresaByRuc(ruc: string) {
  return useQuery({
    queryKey: ['empresa', 'ruc', ruc],
    queryFn: async () => {
      const response = await empresaService.getByRuc(ruc);
      return response.data;
    },
    enabled: !!ruc && ruc.length > 0,
  });
}

export function useCreateEmpresa() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: EmpresaCreateData) => empresaService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['empresas'] });
    },
  });
}

export function useUpdateEmpresa() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: EmpresaUpdateData }) =>
      empresaService.update(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['empresas'] });
      queryClient.invalidateQueries({ queryKey: ['empresa', variables.id] });
      queryClient.invalidateQueries({ queryKey: ['empresa', 'ruc'] });
    },
  });
}

export function useEmpresaUsers(empresaId: number, params?: {
  limit?: number;
  offset?: number;
}) {
  return useQuery({
    queryKey: ['empresa', empresaId, 'usuarios', params],
    queryFn: async () => {
      const response = await empresaService.getUsers(empresaId, params);
      return response.data;
    },
    enabled: !!empresaId && empresaId > 0,
  });
}

export function useEmpresasCount(params?: { activo?: boolean }) {
  return useQuery({
    queryKey: ['empresas', 'count', params],
    queryFn: async () => {
      const response = await empresaService.count(params);
      return response.data;
    },
  });
}

