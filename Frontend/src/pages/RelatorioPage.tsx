import { useEffect, useState } from 'react';
import { relatoriosApi } from '../services/api';
import type { RelatorioResponse } from '../types';

export default function RelatorioPage() {
  const [relatorio, setRelatorio] = useState<RelatorioResponse | null>(null);

  useEffect(() => { relatoriosApi.categorias().then(setRelatorio); }, []);

  if (!relatorio) return <div><div className="page-header"><h1 className="page-title">Relatório</h1></div><p style={{ color: 'var(--muted)' }}>Carregando...</p></div>;

  const { categorias, totaisGerais } = relatorio;

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Relatório</h1>
        <p className="page-subtitle">Totais por categoria e saldo geral</p>
      </div>

      {/* Cards de totais gerais */}
      <div className="summary-grid">
        <div className="summary-card">
          <p className="s-label">Total Receitas</p>
          <p className="s-value val-positive">R$ {totaisGerais.totalReceitas.toFixed(2)}</p>
        </div>
        <div className="summary-card">
          <p className="s-label">Total Despesas</p>
          <p className="s-value val-negative">R$ {totaisGerais.totalDespesas.toFixed(2)}</p>
        </div>
        <div className="summary-card">
          <p className="s-label">Saldo Líquido</p>
          <p className={`s-value ${totaisGerais.saldoLiquido >= 0 ? 'val-positive' : 'val-negative'}`}>
            R$ {totaisGerais.saldoLiquido.toFixed(2)}
          </p>
        </div>
      </div>

      {/* Tabela por categoria */}
      <div className="card">
        <p className="card-title">Por categoria</p>
        {categorias.length === 0 ? (
          <p className="empty">Nenhuma categoria com transações.</p>
        ) : (
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Categoria</th><th>Finalidade</th><th>Receitas</th><th>Despesas</th><th>Saldo</th>
                </tr>
              </thead>
              <tbody>
                {categorias.map(c => (
                  <tr key={c.id}>
                    <td>{c.descricao}</td>
                    <td><span className={`badge badge-${c.finalidade.toLowerCase()}`}>{c.finalidade}</span></td>
                    <td className="mono val-positive">R$ {c.totalReceitas.toFixed(2)}</td>
                    <td className="mono val-negative">R$ {c.totalDespesas.toFixed(2)}</td>
                    <td className={`mono ${c.saldo >= 0 ? 'val-positive' : 'val-negative'}`}>
                      R$ {c.saldo.toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr>
                  <td colSpan={2} style={{ color: 'var(--muted)', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Total Geral</td>
                  <td className="mono val-positive">R$ {totaisGerais.totalReceitas.toFixed(2)}</td>
                  <td className="mono val-negative">R$ {totaisGerais.totalDespesas.toFixed(2)}</td>
                  <td className={`mono ${totaisGerais.saldoLiquido >= 0 ? 'val-positive' : 'val-negative'}`}>
                    R$ {totaisGerais.saldoLiquido.toFixed(2)}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
