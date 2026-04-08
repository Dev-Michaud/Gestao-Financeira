// Tipos espelhando os modelos da WebAPI

export type Finalidade = 'Despesa' | 'Receita' | 'Ambas';
export type TipoTransacao = 'Despesa' | 'Receita';

export interface Pessoa {
  id: number;
  nome: string;
  idade: number;
}

export interface Categoria {
  id: number;
  descricao: string;
  finalidade: Finalidade;
}

export interface Transacao {
  id: number;
  descricao: string;
  valor: number;
  tipo: TipoTransacao;
  pessoa: { id: number; nome: string };
  categoria: { id: number; descricao: string; finalidade: Finalidade };
}

export interface TotalCategoria {
  id: number;
  descricao: string;
  finalidade: string;
  totalReceitas: number;
  totalDespesas: number;
  saldo: number;
}

export interface RelatorioResponse {
  categorias: TotalCategoria[];
  totaisGerais: {
    totalReceitas: number;
    totalDespesas: number;
    saldoLiquido: number;
  };
}
