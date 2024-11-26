namespace TCC.API.Models.Responses
{
    public class PlayerPointsResponse
    {
        public string PlayerName { get; set; }

        public string PlayerId { get; set; }

        public int PlayerPoint { get; set; }

        public PlayerPointsResponse(string playerName, string playerId, int playerPoint)
        {
            PlayerName = playerName;
            PlayerId = playerId;
            PlayerPoint = playerPoint;
        }
    }
}
