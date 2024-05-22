namespace TCC.API.Models
{
    public class GameStorage
    {
        private readonly Dictionary<string, IList<int>> _sortedNumbers = new Dictionary<string, IList<int>>();
        private readonly Dictionary<string, int> _sortedNumberIndex = new Dictionary<string, int>();
        private readonly Dictionary<string, bool> _roomStarted = new Dictionary<string, bool>();

        public IList<int> GetNumbers(string roomId)
        {
            if (!_sortedNumbers.ContainsKey(roomId))
            {
                _sortedNumbers[roomId] = new List<int>();
            }

            return _sortedNumbers[roomId];
        }

        public void SetNumbers(string roomId, IList<int> numbers)
        {
            _sortedNumbers[roomId] = numbers;
        }

        public int GetNumber(string roomId, int index)
        {
            return _sortedNumbers[roomId][index];
        }

        public void SetRoomDrawIndex(string roomId, int index)
        {
            _sortedNumberIndex[roomId] = index;
        }

        public int GetRoomDrawIndex(string roomId)
        {
            return _sortedNumberIndex[roomId];
        }

        public bool CheckAlreadyStartedRoom(string roomId)
        {
            return _roomStarted.ContainsKey(roomId);
        }

        public void SetStartedRoom(string roomId)
        {
            _roomStarted[roomId] = true;
        }
    }
}
