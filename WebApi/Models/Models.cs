namespace WebApi.Models;

public class Pessoa
{
    public int Id { get; set; }

    public string Nome { get; set; } = string.Empty;

    public int Idade { get; set; }

    public ICollection<Transacao> Transacoes { get; set; } = new List<Transacao>();
}

public class Categoria
{
    public int Id { get; set; }

    public string Descricao { get; set; } = string.Empty;

    public Finalidade Finalidade { get; set; }

    public ICollection<Transacao> Transacoes { get; set; } = new List<Transacao>();
}

public class Transacao
{
    public int Id { get; set; }

    public string Descricao { get; set; } = string.Empty;

    public decimal Valor { get; set; }

    public TipoTransacao Tipo { get; set; }

    public int CategoriaId { get; set; }
    public Categoria? Categoria { get; set; }

    public int PessoaId { get; set; }
    public Pessoa? Pessoa { get; set; }
}

public enum Finalidade
{
    Despesa,
    Receita,
    Ambas
}

public enum TipoTransacao
{
    Despesa,
    Receita
}
