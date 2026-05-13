using Microsoft.EntityFrameworkCore;
using API.Entities;
using System.Security.Cryptography.X509Certificates;
namespace API.Data;

public class AppDbContext(DbContextOptions options):DbContext(options)
{
    public DbSet<AppUser> Users {get; set;}  
    
}