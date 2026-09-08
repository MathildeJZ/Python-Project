using Microsoft.EntityFrameworkCore;
using Domain.Entities;

namespace Infrastructure.Data
{
    public class BookDbContext : DbContext
    {
        public BookDbContext(DbContextOptions<BookDbContext> options) : base(options)
        {
        }

        public DbSet<Book> Books { get; set; }
    }

}//opretterforbindelse ml api og Postgresql-db.
//Fortæller EF core at der er en tabel der hedder Books
//Controlleren kan hente,oprette, slette og opdaterer bøger i databasen.