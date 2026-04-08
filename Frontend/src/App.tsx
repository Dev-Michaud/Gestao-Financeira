import { useState } from 'react';
import './index.css';
import PessoasPage from './pages/PessoasPage';
import CategoriasPage from './pages/CategoriasPage';
import TransacoesPage from './pages/TransacoesPage';
import RelatorioPage from './pages/RelatorioPage';

type Pagina = 'pessoas' | 'categorias' | 'transacoes' | 'relatorio';

const nav: { id: Pagina; label: string; icon: string }[] = [
  { id: 'pessoas',    label: 'Pessoas',    icon: '' },
  { id: 'categorias', label: 'Categorias', icon: '' },
  { id: 'transacoes', label: 'Transações', icon: '' },
  { id: 'relatorio',  label: 'Relatório',  icon: '' },
];

export default function App() {
  const [pagina, setPagina] = useState<Pagina>('pessoas');

  return (
    <div className="layout">
      <aside className="sidebar">
        <div className="sidebar-brand">
          Gastos<br />Residenciais
          <span>controle financeiro</span>
        </div>
        {nav.map(item => (
          <button
            key={item.id}
            className={`nav-btn ${pagina === item.id ? 'active' : ''}`}
            onClick={() => setPagina(item.id)}
          >
            <span style={{ fontSize: 15 }}>{item.icon}</span>
            {item.label}
          </button>
        ))}
      </aside>
      <main className="main">
        {pagina === 'pessoas'    && <PessoasPage />}
        {pagina === 'categorias' && <CategoriasPage />}
        {pagina === 'transacoes' && <TransacoesPage />}
        {pagina === 'relatorio'  && <RelatorioPage />}
      </main>
    </div>
  );
}
