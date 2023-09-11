using Data;
using DTOs;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Microsoft.OpenApi.Any;
using Models;


namespace Helpers;

public class UserService
{
    private readonly DatabaseContext _context;

    public UserService(DatabaseContext context)
    {
        _context = context;
    }

    public async Task<ProfileResponse> FetchProfileData(string username)
    {
        var user = await _context.Users.FirstOrDefaultAsync(u => u.UserName == username);
        if(user != null)
        {
            var userData = new ProfileResponse
            {
                Id = user.Id,
                UserName = user.UserName,
                ProfilePicture = user.Avatar,
                Description = user.Bio,
                Followers = await _context.Follows.Where(f => f.Id_Followed == user.Id).ToListAsync(),
                Following = await _context.Follows.Where(f => f.Id_Follower == user.Id).ToListAsync(),
                ProfileComments = await _context.ProfileComments.Where(pc => pc.Id_Recipient == user.Id).ToListAsync()
            };
            return userData;
        }
        return null;
    }
}