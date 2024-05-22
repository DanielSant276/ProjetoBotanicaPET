namespace TCC.API.Models.Responses
{
    public class GeneratedNumbersResponse
    {
        public string DrawnNumbers { get; set; }

        public string BoardId { get; set; }

        public GeneratedNumbersResponse(string drawnNumbers, string boardId)
        {
            DrawnNumbers = drawnNumbers;
            BoardId = boardId;
        }
    }
}
