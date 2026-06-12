using System.Security.Claims;

namespace API.Extensions;

public static class  ClaimsPrincipalExtesions
{
    public static string GetMemberId(this ClaimsPrincipal user)
    {
        return user.FindFirstValue(ClaimTypes.NameIdentifier) 
        ?? throw new Exception("Can't get memberId from token");
    } 
}