using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using WebApi.Data;
using WebApi.Models;

namespace WebApi.Controllers;

[ApiController]
[Route("api/categorias")]
public class CategoriasController : ControllerBase
{
    private readonly AppDbContext _db;

    public CategoriasController(AppDbContext db) => _db = db;

    // GET /api/categorias — lista todas as categorias
    [HttpGet]
    public async Task<IActionResult> Listar()
    {
        var categorias = await _db.Categorias
            .Select(c => new { c.Id, c.Descricao, c.Finalidade })
            .ToListAsync();

        return Ok(categorias);
    }

    // POST /api/categorias — cria uma nova categoria
    [HttpPost]
    public async Task<IActionResult> Criar([FromBody] CategoriaDto dto)
    {
        if (string.IsNullOrWhiteSpace(dto.Descricao) || dto.Descricao.Length > 400)
            return BadRequest("Descrição é obrigatória e deve ter no máximo 400 caracteres.");

        if (!Enum.IsDefined(typeof(Finalidade), dto.Finalidade))
            return BadRequest("Finalidade inválida. Use: Despesa, Receita ou Ambas.");

        var categoria = new Categoria { Descricao = dto.Descricao, Finalidade = dto.Finalidade };
        _db.Categorias.Add(categoria);
        await _db.SaveChangesAsync();

        return CreatedAtAction(nameof(Listar), new { id = categoria.Id },
            new { categoria.Id, categoria.Descricao, categoria.Finalidade });
    }
}

public record CategoriaDto(string Descricao, Finalidade Finalidade);
