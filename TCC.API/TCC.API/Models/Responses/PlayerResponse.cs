namespace TCC.API.Models.Responses
{
    public class PlayerResponse
    {
        public string Id { get; set; }
        public string Name { get; set; }
        public bool Ready { get; set; }

        public PlayerResponse(string id, string name, bool ready)
        {
            Id = id;
            Name = name;
            Ready = ready;
        }
    }
}
