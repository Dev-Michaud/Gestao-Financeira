import type { Categoria, Pessoa, RelatorioResponse, Transacao } from '../types';

const BASE = 'http://localhost:5000/api';

async function request<T>(url: string, options?: RequestInit): Promise<T> {
  const res = await fetch(url, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });

  if (!res.ok) {
    const msg = await res.text();
    throw new Error(msg || 'Erro na requisição');
  }

  if (res.status === 204) return undefined as T;

  return res.json();
}

export const pessoasApi = {
  listar: () => request<Pessoa[]>(`${BASE}/pessoas`),

  criar: (data: { nome: string; idade: number }) =>
    request<Pessoa>(`${BASE}/pessoas`, { method: 'POST', body: JSON.stringify(data) }),

  editar: (id: number, data: { nome: string; idade: number }) =>
    request<Pessoa>(`${BASE}/pessoas/${id}`, { method: 'PUT', body: JSON.stringify(data) }),

  deletar: (id: number) =>
    request<void>(`${BASE}/pessoas/${id}`, { method: 'DELETE' }),
};

export const categoriasApi = {
  listar: () => request<Categoria[]>(`${BASE}/categorias`),

  criar: (data: { descricao: string; finalidade: string }) =>
    request<Categoria>(`${BASE}/categorias`, { method: 'POST', body: JSON.stringify(data) }),
};

export const transacoesApi = {
  listar: () => request<Transacao[]>(`${BASE}/transacoes`),

  criar: (data: {
    descricao: string;
    valor: number;
    tipo: string;
    categoriaId: number;
    pessoaId: number;
  }) => request<Transacao>(`${BASE}/transacoes`, { method: 'POST', body: JSON.stringify(data) }),
};

export const relatoriosApi = {
  categorias: () => request<RelatorioResponse>(`${BASE}/relatorios/categorias`),
};
