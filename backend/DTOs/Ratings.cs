using System.ComponentModel.DataAnnotations;
using Models;

namespace DTOs;
public class NRatedItemsForUserRequest
{
    [Required]
    public int N { get; set; } = 1;
    [Required]
    public string Id { get; set; } = string.Empty;
}


public class NRatedItemsRequest
{
    [Required]
    public int N { get; set; } = 1;
}

public class RatedSong
{
    public Song Song { get; set; }
    public int Rating { get; set; } = 0;
}

public class NRatedUsersSongsResponse
{
    public List<RatedSong> RatedSongs { get; set; }
    public bool Success { get; set; }
}

public class RatedAlbum
{
    public Album Album { get; set; }
    public int Rating { get; set; } = 0;
}

public class RatedNUsersAlbumsResponse
{
    public List<RatedAlbum> RatedAlbums { get; set; }
    public bool Success { get; set; }
}

public class RatedArtist
{
    public Artist Artist { get; set; }
    public int Rating { get; set; } = 0;
}

public class RatedNUsersArtistsResponse
{
    public List<RatedArtist> RatedArtists { get; set; }
    public bool Success { get; set; }
}

public class AverageRatedSong
{
    public Song Song { get; set; }
    public double Rating { get; set; } = 0;
}

public class NRatedSongsResponse
{
    public List<AverageRatedSong> AverageRatedSongs { get; set; }
    public bool Success { get; set; }
}

public class AverageRatedAlbum
{
    public Album Album { get; set; }
    public double Rating { get; set; } = 0;
}

public class NRatedAlbumsResponse
{
    public List<AverageRatedAlbum> AverageRatedAlbums { get; set; }
    public bool Success { get; set; }
}

public class AverageRatedArtist
{
    public Artist Artist { get; set; }
    public double Rating { get; set; } = 0;
}

public class NRatedArtistsResponse
{
    public List<AverageRatedArtist> AverageRatedArtists { get; set; } = new List<AverageRatedArtist>();
    public bool Success { get; set; }
}

public class CreateRateItemRequest
{
    [Required]
    public string ItemId { get; set; } = string.Empty;
    [Required]
    public int Rating { get; set; } = 0;
}

public class CreateRateItemResponse
{
    public bool Success { get; set; }
    public string Message { get; set; } = string.Empty;
}

public class CreateRateSongResponse
{
    public bool Success { get; set; }
    public string Message { get; set; } = string.Empty;
    public SongRating SongRating { get; set; } = new SongRating();
}

public class HighestRatedSongsResponse
{
    public List<AverageRatedSong> HighestRatedSongs { get; set; } = new List<AverageRatedSong>();
    public bool Success { get; set; }
}

public class HighestRatedAlbumsResponse
{
    public List<AverageRatedAlbum> HighestRatedAlbums { get; set; } = new List<AverageRatedAlbum>();
    public bool Success { get; set; }
}

public class HighestRatedArtistsResponse
{
    public List<AverageRatedArtist> HighestRatedArtists { get; set; } = new List<AverageRatedArtist>();
    public bool Success { get; set; }
}

