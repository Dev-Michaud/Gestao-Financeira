using Microsoft.EntityFrameworkCore;
using WebApi.Models;

namespace WebApi.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

    public DbSet<Pessoa> Pessoas => Set<Pessoa>();
    public DbSet<Categoria> Categorias => Set<Categoria>();
    public DbSet<Transacao> Transacoes => Set<Transacao>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Pessoa>(e =>
        {
            e.Property(p => p.Nome).HasMaxLength(200).IsRequired();
            e.Property(p => p.Idade).IsRequired();

            e.HasMany(p => p.Transacoes)
             .WithOne(t => t.Pessoa)
             .HasForeignKey(t => t.PessoaId)
             .OnDelete(DeleteBehavior.Cascade);
        });

        modelBuilder.Entity<Categoria>(e =>
        {
            e.Property(c => c.Descricao).HasMaxLength(400).IsRequired();
            e.Property(c => c.Finalidade).HasConversion<string>().IsRequired();

            e.HasMany(c => c.Transacoes)
             .WithOne(t => t.Categoria)
             .HasForeignKey(t => t.CategoriaId)
             .OnDelete(DeleteBehavior.Restrict);
        });

        modelBuilder.Entity<Transacao>(e =>
        {
            e.Property(t => t.Descricao).HasMaxLength(400).IsRequired();
            e.Property(t => t.Valor).HasPrecision(18, 2).IsRequired();
            e.Property(t => t.Tipo).HasConversion<string>().IsRequired();
        });
    }
}
