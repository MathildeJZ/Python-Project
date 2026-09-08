using Domain.Entities;

namespace Application.Interfaces;

public interface IBookRepository
{
    Task<Book?> Get(int id);
    Task<IEnumerable<Book>> GetAll();
    Task<Book> Add(Book book);
    Task<Book> Update(Book book);
    Task<bool> Delete(int id);
    Task<List<Book>> Search(string query);
}

