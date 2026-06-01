using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace API.Entities
{
    public class Member
    {
        public string Id { get; set; } = null!;

        public DateOnly DateOfBirth { get; set; }

        public string? ImageUrl { get; set; }

        public required string DisplayName { get; set; }

        public DateTime Created { get; set; } = DateTime.UtcNow;

        public DateTime LastActive { get; set; } = DateTime.UtcNow;

        public required string Gender { get; set; }
        
        public string? Description { get; set; }

        public required string City { get; set; }

        public required string Country { get; set; }

        // Navigational property to associate the member with a user

        [JsonIgnore] // to prevent circular reference during JSON serialization
        public List<Photo> Photos { get; set; } = [];

        [JsonIgnore] // to prevent circular reference during JSON serialization
        [ForeignKey(nameof(Id))]  // data annotation to specify that the Id property is the foreign key
        public AppUser User { get; set; } = null!;

    }
}