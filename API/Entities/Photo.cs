using System.Text.Json.Serialization;

namespace API.Entities
{
    public class Photo
    {
        public int Id { get; set; }
        public required string Url { get; set; }
        public string? PublicId { get; set; }

        //Navigational property to associate the photo with a member

        [JsonIgnore] // to prevent circular reference during JSON serialization
        public Member Member { get; set; } = null!;

       public string MemberId { get; set; } = null!;

    }
    }
    