using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using WebApi.Data;
using WebApi.Models;

namespace WebApi.Controllers;

[ApiController]
[Route("api/transacoes")]
public class TransacoesController : ControllerBase
{
    private readonly AppDbContext _db;

    public TransacoesController(AppDbContext db) => _db = db;

    // GET /api/transacoes — lista todas as transações com dados de pessoa e categoria
    [HttpGet]
    public async Task<IActionResult> Listar()
    {
        var transacoes = await _db.Transacoes
            .Include(t => t.Pessoa)
            .Include(t => t.Categoria)
            .Select(t => new
            {
                t.Id,
                t.Descricao,
                t.Valor,
                t.Tipo,
                Pessoa = new { t.Pessoa!.Id, t.Pessoa.Nome },
                Categoria = new { t.Categoria!.Id, t.Categoria.Descricao, t.Categoria.Finalidade }
            })
            .ToListAsync();

        return Ok(transacoes);
    }

    // POST /api/transacoes — cria uma transação aplicando as regras de negócio
    [HttpPost]
    public async Task<IActionResult> Criar([FromBody] TransacaoDto dto)
    {
        if (string.IsNullOrWhiteSpace(dto.Descricao) || dto.Descricao.Length > 400)
            return BadRequest("Descrição é obrigatória e deve ter no máximo 400 caracteres.");

        if (dto.Valor <= 0)
            return BadRequest("O valor deve ser positivo.");

        var pessoa = await _db.Pessoas.FindAsync(dto.PessoaId);
        if (pessoa is null)
            return BadRequest("Pessoa não encontrada.");

        var categoria = await _db.Categorias.FindAsync(dto.CategoriaId);
        if (categoria is null)
            return BadRequest("Categoria não encontrada.");

        if (pessoa.Idade < 18 && dto.Tipo == TipoTransacao.Receita)
            return BadRequest("Menores de idade só podem registrar transações do tipo Despesa.");

        var incompativel =
            (dto.Tipo == TipoTransacao.Despesa && categoria.Finalidade == Finalidade.Receita) ||
            (dto.Tipo == TipoTransacao.Receita && categoria.Finalidade == Finalidade.Despesa);

        if (incompativel)
            return BadRequest(
                $"Categoria com finalidade '{categoria.Finalidade}' " +
                $"não é compatível com transação do tipo '{dto.Tipo}'.");

        var transacao = new Transacao
        {
            Descricao = dto.Descricao,
            Valor = dto.Valor,
            Tipo = dto.Tipo,
            CategoriaId = dto.CategoriaId,
            PessoaId = dto.PessoaId
        };

        _db.Transacoes.Add(transacao);
        await _db.SaveChangesAsync();

        return CreatedAtAction(nameof(Listar), new { id = transacao.Id },
            new { transacao.Id, transacao.Descricao, transacao.Valor, transacao.Tipo });
    }
}

public record TransacaoDto(
    string Descricao,
    decimal Valor,
    TipoTransacao Tipo,
    int CategoriaId,
    int PessoaId);
