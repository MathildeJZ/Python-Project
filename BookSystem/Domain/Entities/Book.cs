namespace Domain.Entities;
public class Book
{
    public int Id { get; set;}
    public string Title { get; set; }
    public string Author { get; set; }
    public int Price { get; set; }
    public int Year { get; set; }
    public int Pages { get; set; }
    public string Publisher { get; set; }
}