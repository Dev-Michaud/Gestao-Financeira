import { useEffect, useState } from 'react';
import { transacoesApi, pessoasApi, categoriasApi } from '../services/api';
import type { Categoria, Pessoa, Transacao, TipoTransacao } from '../types';

export default function TransacoesPage() {
  const [transacoes, setTransacoes] = useState<Transacao[]>([]);
  const [pessoas, setPessoas] = useState<Pessoa[]>([]);
  const [categorias, setCategorias] = useState<Categoria[]>([]);

  const [descricao, setDescricao] = useState('');
  const [valor, setValor] = useState('');
  const [tipo, setTipo] = useState<TipoTransacao>('Despesa');
  const [pessoaId, setPessoaId] = useState('');
  const [categoriaId, setCategoriaId] = useState('');
  const [erro, setErro] = useState('');

  useEffect(() => {
    carregar();
    pessoasApi.listar().then(setPessoas);
    categoriasApi.listar().then(setCategorias);
  }, []);

  async function carregar() {
    setTransacoes(await transacoesApi.listar());
  }

  // Filtra categorias compatíveis com o tipo selecionado
  const categoriasFiltradas = categorias.filter(c =>
    c.finalidade === 'Ambas' || c.finalidade === tipo
  );

  async function criar() {
    setErro('');
    try {
      await transacoesApi.criar({
        descricao, valor: Number(valor), tipo,
        pessoaId: Number(pessoaId), categoriaId: Number(categoriaId),
      });
      setDescricao(''); setValor(''); setCategoriaId('');
      carregar();
    } catch (e: any) { setErro(e.message); }
  }

  const totalReceitas = transacoes.filter(t => t.tipo === 'Receita').reduce((s, t) => s + t.valor, 0);
  const totalDespesas = transacoes.filter(t => t.tipo === 'Despesa').reduce((s, t) => s + t.valor, 0);

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Transações</h1>
        <p className="page-subtitle">Registre receitas e despesas</p>
      </div>

      {/* Resumo rápido */}
      {transacoes.length > 0 && (
        <div className="summary-grid" style={{ gridTemplateColumns: 'repeat(2,1fr)', marginBottom: 24 }}>
          <div className="summary-card">
            <p className="s-label">Total Receitas</p>
            <p className="s-value val-positive">R$ {totalReceitas.toFixed(2)}</p>
          </div>
          <div className="summary-card">
            <p className="s-label">Total Despesas</p>
            <p className="s-value val-negative">R$ {totalDespesas.toFixed(2)}</p>
          </div>
        </div>
      )}

      <div className="card">
        <p className="card-title">Nova transação</p>
        <div className="form-row">
          <div className="field" style={{ flex: 1, minWidth: 160 }}>
            <label>Descrição</label>
            <input placeholder="Descrição" value={descricao} onChange={e => setDescricao(e.target.value)} maxLength={400} />
          </div>
          <div className="field">
            <label>Valor (R$)</label>
            <input type="number" placeholder="0,00" value={valor} onChange={e => setValor(e.target.value)} style={{ width: 110 }} />
          </div>
          <div className="field">
            <label>Tipo</label>
            <select value={tipo} onChange={e => { setTipo(e.target.value as TipoTransacao); setCategoriaId(''); }}>
              <option value="Despesa">Despesa</option>
              <option value="Receita">Receita</option>
            </select>
          </div>
          <div className="field">
            <label>Pessoa</label>
            <select value={pessoaId} onChange={e => setPessoaId(e.target.value)}>
              <option value="">Selecionar...</option>
              {pessoas.map(p => <option key={p.id} value={p.id}>{p.nome} ({p.idade}a)</option>)}
            </select>
          </div>
          <div className="field">
            <label>Categoria</label>
            <select value={categoriaId} onChange={e => setCategoriaId(e.target.value)}>
              <option value="">Selecionar...</option>
              {categoriasFiltradas.map(c => <option key={c.id} value={c.id}>{c.descricao}</option>)}
            </select>
          </div>
          <div className="field">
            <label style={{ visibility: 'hidden' }}>_</label>
            <button className="btn btn-primary" onClick={criar}>Adicionar</button>
          </div>
        </div>
        {erro && <p className="error-msg">{erro}</p>}
      </div>

      <div className="card">
        <p className="card-title">{transacoes.length} transaç{transacoes.length !== 1 ? 'ões' : 'ão'}</p>
        {transacoes.length === 0 ? (
          <p className="empty">Nenhuma transação registrada ainda.</p>
        ) : (
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>#</th><th>Descrição</th><th>Valor</th><th>Tipo</th><th>Pessoa</th><th>Categoria</th>
                </tr>
              </thead>
              <tbody>
                {transacoes.map(t => (
                  <tr key={t.id}>
                    <td className="mono" style={{ color: 'var(--muted)' }}>{t.id}</td>
                    <td>{t.descricao}</td>
                    <td className={`mono ${t.tipo === 'Receita' ? 'val-positive' : 'val-negative'}`}>
                      {t.tipo === 'Receita' ? '+' : '-'} R$ {t.valor.toFixed(2)}
                    </td>
                    <td><span className={`badge badge-${t.tipo.toLowerCase()}`}>{t.tipo}</span></td>
                    <td>{t.pessoa.nome}</td>
                    <td style={{ color: 'var(--muted)' }}>{t.categoria.descricao}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
