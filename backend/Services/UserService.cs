using Data;
using System;
using DTOs;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Microsoft.OpenApi.Any;
using Models;


namespace Services;

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
        if (user != null)
        {
            var followers = await _context.Follows.Where(f => f.Id_Followed == user.Id).Select(f => new Follows
            {
                Id = f.Id,
                Id_Follower = f.Id_Follower,
                Id_Followed = f.Id_Followed
            }).ToListAsync();
            var following = await _context.Follows.Where(f => f.Id_Follower == user.Id).Select(f => new Follows
            {
                Id = f.Id,
                Id_Follower = f.Id_Follower,
                Id_Followed = f.Id_Followed
            }).ToListAsync();
            var profileComments = await _context.ProfileComments.Where(pc => pc.Id_Recipient == user.Id).OrderByDescending(pc => pc.Creation_Date).Include(s => s.Sender).Select(pc => new ProfileComments
            {
                Id = pc.Id,
                Comment = pc.Comment,
                Creation_Date = pc.Creation_Date,
                Id_Sender = pc.Id_Sender,
                Sender = new Sender
                {
                    Id = pc.Sender.Id,
                    UserName = pc.Sender.UserName,
                    ProfilePicture = pc.Sender.Avatar
                },
                Id_Recipient = pc.Id_Recipient,
            }).ToListAsync();
            var scrobbles = await _context.Scrobbles.Where(s => s.Id_User == user.Id).OrderByDescending(s => s.Scrobble_Date).Include(a => a.Song).ThenInclude(a => a.Album).ThenInclude(a => a.Artist).Select(s => new Scrobbles
            {
                Id = s.Id,
                Scrobble_Date = s.Scrobble_Date,
                Id_User = s.Id_User,
                Id_Song_Internal = s.Id_Song_Internal,
                Song = s.Song,
            }).ToListAsync();
            var ratedSongs = await _context.SongRatings.Where(sr => sr.Id_User == user.Id).OrderByDescending(sr => sr.Rating).Select(sr => new RatedSongs
            {
                Id_Song = sr.Song.Id,
                Rating = sr.Rating,
                Id_Song_Internal = sr.Id_Song_Internal,
                Song = sr.Song
            }).ToListAsync();
            var ratedAlbums = await _context.AlbumRatings.Where(ar => ar.Id_User == user.Id).OrderByDescending(ar => ar.Rating).Select(ar => new RatedAlbums
            {
                Id_Album = ar.Album.Id,
                Rating = ar.Rating,
                Id_Album_Internal = ar.Id_Album_Internal,
                Album = ar.Album
            }).ToListAsync();
            var ratedArtist = await _context.ArtistRatings.Where(ar => ar.Id_User == user.Id).OrderByDescending(ar => ar.Rating).Select(ar => new RatedArtists
            {
                Id_Artist = ar.Artist.Id,
                Rating = ar.Rating,
                Id_Artist_Internal = ar.Id_Artist_Internal,
                Artist = ar.Artist
            }).ToListAsync();
            var favouriteSongs = await _context.FavouriteSongs.Where(fs => fs.Id_User == user.Id).Select(fs => new FavouriteSongs
            {
                Id_Song = fs.Song.Id,
                Id_Song_Internal = fs.Id_Song_Internal,
                Song = fs.Song
            }).ToListAsync();
            var artistCount = await _context.Scrobbles.Where(s => s.Id_User == user.Id).Select(s => s.Song.Album.Artist).Distinct().CountAsync();
            var userData = new ProfileResponse
            {
                Id = user.Id,
                UserName = user.UserName,
                ProfilePicture = user.Avatar,
                Description = user.Bio,
                ArtistCount = artistCount,
                Followers = followers,
                Following = following,
                ProfileComments = profileComments,
                Scrobbles = scrobbles,
                RatedSongs = ratedSongs,
                RatedAlbums = ratedAlbums,
                RatedArtists = ratedArtist,
                FavouriteSongs = favouriteSongs,
                Creation_Date = user.Creation_Date
            };
            return userData;
        }
        return null;
    }


    public async Task<int> EditProfileData(string username, string Bio, string Avatar, string userId, List<string> roles)
    {
        var user = await _context.Users.FirstOrDefaultAsync(u => u.UserName == username);

        if (user == null) return 404;

        else if (roles.Contains("Admin") || user.Id == userId)
        {
            user.Bio = Bio;
            user.Avatar = Convert.FromBase64String(Avatar);
            try
            {
                await _context.SaveChangesAsync();
                return 200;
            }
            catch (DbUpdateException ex)
            {
                Console.WriteLine($"Error updating database: {ex}");
                return 400;
            }
        }
        else return 403;
    }

    public async Task<string> GetIdByUserName(string username)
    {
        var user = await _context.Users.FirstOrDefaultAsync(u => u.UserName == username);
        if (user != null)
        {
            return user.Id;
        }
        return null!;
    }
}