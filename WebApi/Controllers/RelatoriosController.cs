using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using WebApi.Data;
using WebApi.Models;

namespace WebApi.Controllers;

[ApiController]
[Route("api/relatorios")]
public class RelatoriosController : ControllerBase
{
    private readonly AppDbContext _db;

    public RelatoriosController(AppDbContext db) => _db = db;

    // GET /api/relatorios/categorias
    [HttpGet("categorias")]
    public async Task<IActionResult> TotaisPorCategoria()
    {
        var categorias = await _db.Categorias
            .Include(c => c.Transacoes)
            .ToListAsync();

        var itens = categorias.Select(c => new
        {
            c.Id,
            c.Descricao,
            Finalidade = c.Finalidade.ToString(),
            TotalReceitas = c.Transacoes
                .Where(t => t.Tipo == TipoTransacao.Receita)
                .Sum(t => t.Valor),
            TotalDespesas = c.Transacoes
                .Where(t => t.Tipo == TipoTransacao.Despesa)
                .Sum(t => t.Valor),
            Saldo = c.Transacoes
                .Where(t => t.Tipo == TipoTransacao.Receita).Sum(t => t.Valor) -
                c.Transacoes
                .Where(t => t.Tipo == TipoTransacao.Despesa).Sum(t => t.Valor)
        }).ToList();

        var totaisGerais = new
        {
            TotalReceitas = itens.Sum(i => i.TotalReceitas),
            TotalDespesas = itens.Sum(i => i.TotalDespesas),
            SaldoLiquido = itens.Sum(i => i.Saldo)
        };

        return Ok(new { Categorias = itens, TotaisGerais = totaisGerais });
    }
}
