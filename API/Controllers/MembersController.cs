using System.Security.Claims;
using API.Data;
using API.DTOs;
using API.Entities;
using API.Extensions;
using API.Helpers;
using API.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
namespace API.Controllers
{

    [Authorize]
    public class MembersController(IMemberRepository memberRepository, IPhotoService photoService) : BaseAPIController // a base class for an MVC controller without view support. It provides access to the HttpContext, ModelState, and other properties and methods that are useful for handling HTTP requests and generating responses.
    {
        [HttpGet]
        public async Task<ActionResult<IReadOnlyList<Member>>> GetMembers([FromQuery]
        MemberParams memberParams)
        {
            memberParams.CurrentMemberId = User.GetMemberId();
            return Ok(await memberRepository.GetMembersAsync(memberParams));
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

        [HttpPut]
        public async Task<ActionResult> UpdateMember(MemberUpdateDto memberUpdateDto)
        {
            var memberId = User.GetMemberId();

            var member = await memberRepository.GetMemberForUpdate(memberId);

            if (member == null) return BadRequest("Could not get member");

            member.DisplayName = memberUpdateDto.DisplayName ?? member.DisplayName;
            member.Description = memberUpdateDto.Description ?? member.Description;
            member.Country = memberUpdateDto.Country ?? member.Country;
            member.City = memberUpdateDto.City ?? member.City;
            

            member.User.DisplayName = memberUpdateDto.DisplayName ?? member.User.DisplayName;

           memberRepository.Update(member); //optional

            if (await memberRepository.SaveAllAsync()) return NoContent();

            return BadRequest("Failed to update member");

        }
    

    [HttpPost("add-photo")]
    public async Task<ActionResult<Photo>> AddPhoto([FromForm] IFormFile file)
        {
            var member = await memberRepository.GetMemberForUpdate(User.GetMemberId());

            if(member ==null) return BadRequest("Can't upload photo");

            var result = await photoService.UploadPhotoAsync(file);

            if(result.Error != null) return BadRequest(result.Error.Message);

            var photo = new Photo
            {
                Url = result.SecureUrl.AbsoluteUri,
                PublicId = result.PublicId,
                MemberId = User.GetMemberId()
            };

            if(member.ImageUrl == null)
            {
                member.ImageUrl = photo.Url;
                member.User.ImageUrl = photo.Url;
            }

            member.Photos.Add(photo);

            if(await memberRepository.SaveAllAsync()) return photo;

            return BadRequest("Problem in adding photos");
        }

    

    [HttpPut("set-main-photo/{photoId}")]
    public async Task<ActionResult> SetMainPhoto(int photoId)
        {
            var member = await memberRepository.GetMemberForUpdate(User.GetMemberId());

            if(member == null) return BadRequest("Can not get member from token");

            var photo = member.Photos.SingleOrDefault(x => x.Id == photoId);

            if(member.ImageUrl == photo?.Url || photo == null)
            {
                return BadRequest("Can not set this as main Image");
            }

            member.ImageUrl = photo.Url;
            member.User.ImageUrl = photo.Url;

            if(await memberRepository.SaveAllAsync()) return NoContent();

            return BadRequest("Problem in setting main photo");
        
        }

        [HttpDelete("delete-photo/{photoId}")]
        public async Task<ActionResult> DeletePhoto(int photoId)
        {
            var member = await memberRepository.GetMemberForUpdate(User.GetMemberId());

            if(member == null) return BadRequest("Can not get member from token");

            var photo = member.Photos.SingleOrDefault(x => x.Id == photoId);

            if(photo == null || photo.Url  == member.ImageUrl)
            {
                return BadRequest("Photo can not be deleted");
            }

            if(photo.PublicId != null)
            {
                var result = await photoService.DeletePhotoAsync(photo.PublicId);
                if(result.Error != null) return BadRequest(result.Error.Message); 
            }

            member.Photos.Remove(photo);
            if(await memberRepository.SaveAllAsync()) return Ok();

            return BadRequest("Problem deleting photo");
        }
    }
    
}

