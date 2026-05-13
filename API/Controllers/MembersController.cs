using API.Data;
using API.Entities;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
namespace API.Controllers;

[ApiController]
[Route("[controller]")]

public class MembersController(AppDbContext context): ControllerBase // a base class for an MVC controller without view support. It provides access to the HttpContext, ModelState, and other properties and methods that are useful for handling HTTP requests and generating responses.
{
    [HttpGet]

    public async Task<ActionResult<IReadOnlyList<AppUser>>> GetMembers()
    {
        var members = await context.Users.ToListAsync();
        return Ok(members);
        
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<AppUser>> GetMember(string id)
    {
        var member = await context.Users.FindAsync(id);
        if (member == null) return NotFound();
        return Ok(member);
    }
}