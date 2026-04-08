import { useEffect, useState } from 'react';
import { pessoasApi } from '../services/api';
import type { Pessoa } from '../types';

export default function PessoasPage() {
  const [pessoas, setPessoas] = useState<Pessoa[]>([]);
  const [nome, setNome] = useState('');
  const [idade, setIdade] = useState('');
  const [editando, setEditando] = useState<Pessoa | null>(null);
  const [erro, setErro] = useState('');

  useEffect(() => { carregar(); }, []);

  async function carregar() {
    setPessoas(await pessoasApi.listar());
  }

  async function salvar() {
    setErro('');
    try {
      if (editando) {
        await pessoasApi.editar(editando.id, { nome, idade: Number(idade) });
        setEditando(null);
      } else {
        await pessoasApi.criar({ nome, idade: Number(idade) });
      }
      setNome(''); setIdade('');
      carregar();
    } catch (e: any) { setErro(e.message); }
  }

  function iniciarEdicao(p: Pessoa) {
    setEditando(p); setNome(p.nome); setIdade(String(p.idade)); setErro('');
  }

  async function deletar(id: number) {
    if (!confirm('Deletar esta pessoa e todas as suas transações?')) return;
    await pessoasApi.deletar(id);
    carregar();
  }

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Pessoas</h1>
        <p className="page-subtitle">Gerencie as pessoas do controle financeiro</p>
      </div>

      {/* Formulário */}
      <div className="card">
        <p className="card-title">{editando ? 'Editar pessoa' : 'Nova pessoa'}</p>
        <div className="form-row">
          <div className="field" style={{ flex: 1 }}>
            <label>Nome</label>
            <input
              placeholder="Nome completo"
              value={nome}
              onChange={e => setNome(e.target.value)}
              maxLength={200}
            />
          </div>
          <div className="field">
            <label>Idade</label>
            <input
              type="number"
              placeholder="0"
              value={idade}
              onChange={e => setIdade(e.target.value)}
              style={{ width: 90 }}
            />
          </div>
          <div className="field">
            <label style={{ visibility: 'hidden' }}>_</label>
            <div style={{ display: 'flex', gap: 8 }}>
              <button className="btn btn-primary" onClick={salvar}>
                {editando ? 'Salvar' : 'Adicionar'}
              </button>
              {editando && (
                <button className="btn btn-ghost" onClick={() => { setEditando(null); setNome(''); setIdade(''); }}>
                  Cancelar
                </button>
              )}
            </div>
          </div>
        </div>
        {erro && <p className="error-msg">{erro}</p>}
      </div>

      {/* Tabela */}
      <div className="card">
        <p className="card-title">{pessoas.length} pessoa{pessoas.length !== 1 ? 's' : ''}</p>
        {pessoas.length === 0 ? (
          <p className="empty">Nenhuma pessoa cadastrada ainda.</p>
        ) : (
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Nome</th>
                  <th>Idade</th>
                  <th>Status</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {pessoas.map(p => (
                  <tr key={p.id}>
                    <td className="mono" style={{ color: 'var(--muted)' }}>{p.id}</td>
                    <td>{p.nome}</td>
                    <td className="mono">{p.idade}</td>
                    <td>
                      {p.idade < 18
                        ? <span className="badge badge-despesa">Menor de idade</span>
                        : <span className="badge badge-receita">Adulto</span>}
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: 6 }}>
                        <button className="btn btn-edit" onClick={() => iniciarEdicao(p)}>Editar</button>
                        <button className="btn btn-danger" onClick={() => deletar(p.id)}>Deletar</button>
                      </div>
                    </td>
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
