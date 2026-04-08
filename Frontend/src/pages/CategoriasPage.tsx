import { useEffect, useState } from 'react';
import { categoriasApi } from '../services/api';
import type { Categoria } from '../types';

export default function CategoriasPage() {
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [descricao, setDescricao] = useState('');
  const [finalidade, setFinalidade] = useState('Despesa');
  const [erro, setErro] = useState('');

  useEffect(() => { carregar(); }, []);

  async function carregar() {
    setCategorias(await categoriasApi.listar());
  }

  async function criar() {
    setErro('');
    try {
      await categoriasApi.criar({ descricao, finalidade });
      setDescricao(''); setFinalidade('Despesa');
      carregar();
    } catch (e: any) { setErro(e.message); }
  }

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Categorias</h1>
        <p className="page-subtitle">Classifique as movimentações financeiras</p>
      </div>

      <div className="card">
        <p className="card-title">Nova categoria</p>
        <div className="form-row">
          <div className="field" style={{ flex: 1 }}>
            <label>Descrição</label>
            <input
              placeholder="Ex: Alimentação, Salário..."
              value={descricao}
              onChange={e => setDescricao(e.target.value)}
              maxLength={400}
            />
          </div>
          <div className="field">
            <label>Finalidade</label>
            <select value={finalidade} onChange={e => setFinalidade(e.target.value)}>
              <option value="Despesa">Despesa</option>
              <option value="Receita">Receita</option>
              <option value="Ambas">Ambas</option>
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
        <p className="card-title">{categorias.length} categoria{categorias.length !== 1 ? 's' : ''}</p>
        {categorias.length === 0 ? (
          <p className="empty">Nenhuma categoria cadastrada ainda.</p>
        ) : (
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Descrição</th>
                  <th>Finalidade</th>
                </tr>
              </thead>
              <tbody>
                {categorias.map(c => (
                  <tr key={c.id}>
                    <td className="mono" style={{ color: 'var(--muted)' }}>{c.id}</td>
                    <td>{c.descricao}</td>
                    <td>
                      <span className={`badge badge-${c.finalidade.toLowerCase()}`}>
                        {c.finalidade}
                      </span>
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
