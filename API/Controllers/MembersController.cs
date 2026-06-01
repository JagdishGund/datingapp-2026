using API.Data;
using API.Entities;
using API.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
namespace API.Controllers
{

[Authorize]
public class MembersController(IMemberRepository memberRepository): BaseAPIController // a base class for an MVC controller without view support. It provides access to the HttpContext, ModelState, and other properties and methods that are useful for handling HTTP requests and generating responses.
{
    [HttpGet]
    public async Task<ActionResult<IReadOnlyList<Member>>> GetMembers()
    {
       return Ok(await memberRepository.GetMembersAsync());
        
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<Member>> GetMember(string id)
    {
        var member = await memberRepository.GetMemberByIdAsync(id);
        if (member == null) return NotFound();
        return Ok(member);
    }

    [HttpGet("{id}/photos")]
    public async Task<ActionResult<IReadOnlyList<Photo>>> GetMemberPhotos(string id)
    {
        return Ok(await memberRepository.GetPhotosForMemberAsync(id));
    }
}
}
    
