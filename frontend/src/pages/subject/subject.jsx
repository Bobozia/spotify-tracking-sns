import {
  createComputed,
  createEffect,
  createSignal,
  useContext,
} from "solid-js";
import { deleteData, getData, postData } from "../../getUserData";
import { A, useParams } from "@solidjs/router";
import Card from "../../components/userpage/main/card";
import heart from "../../assets/icons/heart.svg";
import filledHeart from "../../assets/icons/filledHeart.svg";
import { UserContext } from "../../contexts/UserContext";
import Comment from "../../components/userpage/main/comment";
import StarRating from "../../components/subjectpage/star-rating";
import SubjectBanner from "../../components/subjectpage/subjectbanner";
import calendar from "../../assets/icons/calendar.svg";
import { encodeSubjectName } from "../../encodeSubjectName";
import { AdminContext } from "../../contexts/AdminContext";

function Subject() {
  const { user } = useContext(UserContext);
  const { admin } = useContext(AdminContext);
  const [userRating, setUserRating] = createSignal(0);
  const params = useParams();
  const [subject, setSubject] = createSignal(params.subject);
  const [subjectData, setSubjectData] = createSignal(null);
  const [topSongs, setTopSongs] = createSignal(null);
  const [comments, setComments] = createSignal([]);
  const [comment, setComment] = createSignal("");
  const [popularInterval, setPopularInterval] = createSignal("week");
  const [isOpen, setIsOpen] = createSignal(false);
  const [listenersCount, setListenersCount] = createSignal(0);
  const [scrobbleCount, setScrobbleCount] = createSignal(0);
  const [avgRating, setAvgRating] = createSignal(0);
  const [songRecommendations, setSongRecommendations] = createSignal([]);
  const [artistRecommendations, setArtistRecommendations] = createSignal([]);

  const handleSelect = (interval) => {
    setPopularInterval(interval);
    setIsOpen(false);
  };

  const getInterval = (interval) => {
    switch (interval) {
      case "day":
        return new Date(new Date().setDate(new Date().getDate() - 1));
      case "week":
        return new Date(new Date().setDate(new Date().getDate() - 7));
      case "month":
        return new Date(new Date().setMonth(new Date().getMonth() - 1));
      case "year":
        return new Date(new Date().setFullYear(new Date().getFullYear() - 1));
      default:
        return new Date(new Date().setDate(new Date().getDate() - 7));
    }
  };

  const updateAvgRating = async () => {
    getSubjectData(popularInterval());
  };

  createEffect(() => {
    setSubject(params.subject);
  });

  createEffect(() => {
    if (subjectData() != null && subjectData()[`${subject()}Comments`])
      setComments(subjectData()[`${subject()}Comments`]);
  });

  createEffect(() => {
    if (
      subjectData() != null &&
      subjectData()[`${subject()}Ratings`].length > 0 &&
      user()
    ) {
      // check if user has rated this subject
      const userRating_ = subjectData()[`${subject()}Ratings`].filter(
        (rating) => rating.id_User === user().id
      );
      if (userRating_.length > 0) {
        setUserRating(userRating_[0].rating);
      }
    }
  });

  const getSubjectData = async (i) => {
    const data = await getData(`scrobbles/${subject()}/${params.name}`);
    setSubjectData(data[subject()]);
    console.log(subjectData());
    setListenersCount(data.listenersCount);
    setScrobbleCount(data.scrobbleCount);
    setAvgRating(data.avgRating);
    if (subject() === "artist") {
      const data_ = await postData("scrobbles/top-n-songs-by-artist", {
        artistId: subjectData().id,
        n: 5,
        start: getInterval(i),
        end: new Date(),
      });
      setTopSongs(data_.songs);
    }
  };

  createComputed(() => {
    getSubjectData(popularInterval());
  });

  const songIsFavourite = (song) => {
    if (user() && subjectData() != null && song.favouriteSongs) {
      if (song.favouriteSongs.some((record) => record.id_User === user().id))
        return true;
    }
    return false;
  };

  const handleEditFavouriteSong = async (song) => {
    if (songIsFavourite(song))
      await deleteData(`favourite-song/delete`, {
        songId: song.id,
      });
    else
      await postData(`favourite-song/create`, {
        songId: song.id,
      });
    getSubjectData(popularInterval());
  };

  const handleDeleteComment = (commentId) => {
    setComments(comments().filter((comment) => comment.id !== commentId));
  };

  const handleSendComment = async (e) => {
    e.preventDefault();
    if (comment()) {
      const res = await postData(`comments/${subject()}/create`, {
        comment: comment(),
        [`${subject()}Id`]: subjectData().id,
      });
      if (res.success) {
        setComments([res[`${subject()}Comment`], ...comments()]);
        setComment("");
      }
    }
  };

  const getSongRecommendations = async () => {
    if(subjectData() === null) return;
    const uri = `http://localhost:5217/api/spotify/songRecommendations`
      +`?artistId=${subjectData().album.artist.id_Artist_Spotify_API}`
      +`&songId=${subjectData().id_Song_Spotify_API}`;
    const response = await fetch(uri, {
    headers: {
      "Content-Type": "application/json",
    }
    });
    const data = await response.json();
    console.log(data);
    setSongRecommendations(data.songs);
  };

  const getArtistRecommendations = async () => {
    if(subjectData() === null) return;
    const uri = `http://localhost:5217/api/spotify/artistRecommendations`
      +`?artistId=${subjectData().id_Artist_Spotify_API}`;
    const response = await fetch(uri, {
    headers: {
      "Content-Type": "application/json",
    }
    });
    const data = await response.json();
    console.log(data);
    setArtistRecommendations(data.artists);
  }

  createEffect(() => {
    if(subject() === "song") { 
      getSongRecommendations();
    }else if(subject() === "artist") {
      getArtistRecommendations();
    }
  });



  const renderSongRecommendations = (songs) => {
    console.log(songs.length);
    if(songs.length === 0) return;
    return songs.map((song, index) => (
      <div 
        class="flex flex-row space-x-4 items-center"
      >
        <p>{index + 1}.</p>
        <a
          href={`https://open.spotify.com/track/${song.id}`}
          class="flex flex-row space-x-4 mt-2 mb-2 items-center"
        >
        <img
          src={song.cover}
          class="w-20 cursor-pointer"
        />
        <span
          
          class="hover:hover:text-slate-300"
        >
          {song.title}
        </span>
        </a>
      </div>
    ));
  };

  const renderArtistRecommendations = (artists) => {
    if(artists.length === 0) return;
    return( 
      <>
        <h1 class="text-2xl font-bold mt-5 mb-2 pl-5">Recommended artists</h1>
      {artists.map((artist, index) => (
        <div
          class="flex flex-row space-x-4 items-center"
        >
          <p>{index + 1}.</p>
          <a
            href={`https://open.spotify.com/artist/${artist.id}`}
            class="flex flex-row space-x-4 mt-2 mb-2 items-center"
          >
          <img
            src={artist.photo}
            class="w-20 cursor-pointer"
          />
          <span

            class="hover:hover:text-slate-300"
          >
            {artist.name}
          </span>
          </a>
        </div>))}
      </>
    );
  };

  const renderTopSongs = (songs) => {
    if (songs !== null) {
      return songs.map((song, index) => (
        <div class="flex flex-row space-x-4 mt-2 mb-2 items-center">
          <p>{index + 1}</p>
          <img
            src={`data:image/png;base64,${song.song.album.cover}`}
            class="w-20 cursor-pointer"
            onClick={() =>
              (window.location.href = `/song/${encodeSubjectName(
                song.song.title
              )}`)
            }
          />
          {user() && (
            <img
              src={songIsFavourite(song.song) ? filledHeart : heart}
              class="w-4 cursor-pointer"
              onClick={(e) => {
                e.preventDefault();
                handleEditFavouriteSong(song.song);
              }}
            />
          )}
          <a
            href={`/song/${encodeSubjectName(song.song.title)}`}
            class="hover:hover:text-slate-300"
          >
            {song.song.title}
          </a>
          <p>Count: {song.count}</p>
        </div>
      ));
    }
  };

  const renderSubject = (s) => {
    switch (subject()) {
      case "artist":
        return (
          <div class="">
            <div class="w-full">
              <SubjectBanner
                subjectImage={subjectData()?.photo}
                subjectSecondaryImage={subjectData()?.photo}
                primaryText={subjectData()?.name}
                secondaryText={""}
                scrobbleCount={scrobbleCount()}
                usersCount={listenersCount()}
                subject={subject()}
                id={subjectData().id_Artist_Spotify_API}
              />
            </div>
            <div class="mt-5 pt-2 pl-2">
              <div class="flex flex-row">
                <h1 class="text-2xl font-bold pl-4">Most listened songs</h1>
                <div class="relative">
                  <button
                    onClick={() => setIsOpen(!isOpen())}
                    class="h-10 ml-auto p-5 justify-center items-center flex hover:underline"
                  >
                    <span class="mr-2 text-lg capitalize font-bold">
                      {popularInterval}
                    </span>
                    <img src={calendar} alt="calendar" class="w-6 h-6" />
                  </button>
                  {isOpen() && (
                    <div class="absolute right-0 w-24 bg-white border rounded shadow-xl">
                      <button
                        onClick={() => handleSelect("day")}
                        class="w-full text-center block px-4 py-1 text-sm text-gray-700 hover:bg-slate-600 hover:text-white"
                      >
                        Day
                      </button>
                      <button
                        onClick={() => handleSelect("week")}
                        class="w-full text-center block px-4 py-1 text-sm text-gray-700 hover:bg-slate-600 hover:text-white"
                      >
                        Week
                      </button>
                      <button
                        onClick={() => handleSelect("month")}
                        class="w-full text-center block px-4 py-1 text-sm text-gray-700 hover:bg-slate-600 hover:text-white"
                      >
                        Month
                      </button>
                      <button
                        onClick={() => handleSelect("year")}
                        class="w-full text-center block px-4 py-1 text-sm text-gray-700 hover:bg-slate-600 hover:text-white"
                      >
                        Year
                      </button>
                    </div>
                  )}
                </div>
              </div>
              {renderTopSongs(topSongs())}
            </div>
            <div class=" pt-2 pl-2">
              <h1 class="text-2xl font-bold mt-5 mb-2 pl-5">Albums</h1>
              <div class="flex flex-row space-x-2 ml-2">
                {s.albums &&
                  s.albums.map((album) => (
                    <div class="w-[20%]">
                      <Card
                        cover={`data:image/png;base64,${album.cover}`}
                        mainText={album.name}
                        secText={""}
                        rating={album.rating}
                        subject="album"
                      />
                    </div>
                  ))}
              </div>
              {renderArtistRecommendations(artistRecommendations())}
            </div>
          </div>
        );
      case "album":
        return (
          <>
            <div class="w-full">
              <SubjectBanner
                subjectImage={subjectData()?.cover}
                subjectSecondaryImage={subjectData()?.cover}
                primaryText={subjectData()?.name}
                secondaryText={subjectData()?.artist.name}
                scrobbleCount={scrobbleCount()}
                usersCount={listenersCount()}
                subject={subject()}
                id={subjectData().id_Album_Spotify_API}
              />
            </div>
            <p>Songs:</p>
            {s.songs.map((song, index) => (
              <div class="flex flex-row space-x-2">
                <p>{index + 1}</p>
                {user() && (
                  <img
                    src={songIsFavourite(song) ? filledHeart : heart}
                    class="w-4 cursor-pointer"
                    onClick={(e) => {
                      e.preventDefault();
                      handleEditFavouriteSong(song);
                    }}
                  />
                )}
                <p>
                  <a
                    href={`/song/${encodeSubjectName(song.title)}`}
                    class="hover:text-slate-700"
                  >
                    {song.title}
                  </a>
                </p>
              </div>
            ))}
          </>
        );
      case "song":
        return (
          <div class="flex flex-col justify-between">
            <div class="w-full">
              <SubjectBanner
                subjectImage={subjectData()?.album.cover}
                subjectSecondaryImage={subjectData()?.album.cover}
                primaryText={subjectData()?.title}
                secondaryText={subjectData()?.album.artist.name}
                scrobbleCount={scrobbleCount()}
                usersCount={listenersCount()}
                subject={subject()}
                heart={songIsFavourite(subjectData()) ? "filledHeart" : "heart"}
                songId={subjectData().id}
                id={subjectData().id_Song_Spotify_API}
              />
            </div>
            <h1 class="text-2xl font-bold pl-4">Recommended songs</h1>
            {renderSongRecommendations(songRecommendations())}
          </div>
        );
      default:
        return null;
    }
  };
  return (
    <div class="w-full overflow-y-auto text-[#f2f3ea]">
      {subjectData() && renderSubject(subjectData())}
      {subjectData() != null && user() && (
        <StarRating
          rating={userRating()}
          avgRating={avgRating()}
          itemId={subjectData().id}
          subject={subject()}
          updateAvgRating={updateAvgRating}
        />
      )}
      <div class="pt-2 pl-2 pb-2 mr-2">
        <h1 class="text-2xl font-bold mt-5 mb-2 pl-5">Comments</h1>
        {user() && (
          <form onsubmit={handleSendComment} class="flex mb-4 mx-5">
            <input
              type="text"
              class="border border-slate-700 w-[100%] bg-slate-700"
              value={comment()}
              onInput={(e) => setComment(e.target.value)}
            />
            <button class="border border-slate-700 ml-4 p-4">Send</button>
          </form>
        )}
        {comments() != null &&
          comments().map((comment) => (
            <Comment
              avatar={comment.sender.avatar}
              comment={comment.content}
              username={comment.sender.userName}
              date={new Date(comment.creation_Date).toLocaleDateString()}
              loggedUser={user()}
              recipientId={comment.sender.id}
              onDelete={handleDeleteComment}
              commentId={comment.id}
              subject={subject()}
              isAdmin={admin() ? true : false}
            />
          ))}
      </div>
    </div>
  );
}

export default Subject;
