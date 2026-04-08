using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using WebApi.Data;
using WebApi.Models;

namespace WebApi.Controllers;

[ApiController]
[Route("api/pessoas")]
public class PessoasController : ControllerBase
{
    private readonly AppDbContext _db;

    public PessoasController(AppDbContext db) => _db = db;

    // GET /api/pessoas — lista todas as pessoas
    [HttpGet]
    public async Task<IActionResult> Listar()
    {
        var pessoas = await _db.Pessoas
            .Select(p => new { p.Id, p.Nome, p.Idade })
            .ToListAsync();

        return Ok(pessoas);
    }

    // POST /api/pessoas — cria uma nova pessoa
    [HttpPost]
    public async Task<IActionResult> Criar([FromBody] PessoaDto dto)
    {
        if (string.IsNullOrWhiteSpace(dto.Nome) || dto.Nome.Length > 200)
            return BadRequest("Nome é obrigatório e deve ter no máximo 200 caracteres.");

        if (dto.Idade < 0)
            return BadRequest("Idade inválida.");

        var pessoa = new Pessoa { Nome = dto.Nome, Idade = dto.Idade };
        _db.Pessoas.Add(pessoa);
        await _db.SaveChangesAsync();

        return CreatedAtAction(nameof(Listar), new { id = pessoa.Id },
            new { pessoa.Id, pessoa.Nome, pessoa.Idade });
    }

    // PUT /api/pessoas/{id} — edita uma pessoa existente
    [HttpPut("{id}")]
    public async Task<IActionResult> Editar(int id, [FromBody] PessoaDto dto)
    {
        var pessoa = await _db.Pessoas.FindAsync(id);
        if (pessoa is null) return NotFound("Pessoa não encontrada.");

        if (string.IsNullOrWhiteSpace(dto.Nome) || dto.Nome.Length > 200)
            return BadRequest("Nome é obrigatório e deve ter no máximo 200 caracteres.");

        if (dto.Idade < 0)
            return BadRequest("Idade inválida.");

        pessoa.Nome = dto.Nome;
        pessoa.Idade = dto.Idade;
        await _db.SaveChangesAsync();

        return Ok(new { pessoa.Id, pessoa.Nome, pessoa.Idade });
    }

    // DELETE /api/pessoas/{id} — remove a pessoa e suas transações (cascade)
    [HttpDelete("{id}")]
    public async Task<IActionResult> Deletar(int id)
    {
        var pessoa = await _db.Pessoas.FindAsync(id);
        if (pessoa is null) return NotFound("Pessoa não encontrada.");

        _db.Pessoas.Remove(pessoa);
        await _db.SaveChangesAsync();

        return NoContent();
    }
}
public record PessoaDto(string Nome, int Idade);
