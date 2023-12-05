import { A } from "@solidjs/router";
import heartIcon from "../../../assets/icons/heart.svg";
import filledHeart from "../../../assets/icons/filledHeart.svg";
import Belmondo from "../../../assets/icons/belmondoblur.png";
import { createSignal, createEffect } from "solid-js";
import { deleteData, postData } from "../../../getUserData";
import { encodeSubjectName } from "../../../encodeSubjectName";

function ScrobbleRow(props) {
  const { title, artist, rating, date, album, songId, ...others } = props;
  const [heart, setHeart] = createSignal(props.heart);
  const [albumCover, setAlbumCover] = createSignal(null);

  const handleEditFavouriteSong = async () => {
    if (!songId) return;
    if (props.heart === "heart") {
      postData("favourite-song/create", {
        songId: songId,
      });
      setHeart("filledHeart");
    } else {
      deleteData("favourite-song/delete", {
        songId: songId,
      });
      setHeart("heart");
    }
    props.handleEditFavouriteSong(songId, heart());
  };

  createEffect(() => {
    if (props.albumCover.length !== 0)
      setAlbumCover(`data:image/png;base64,${props.albumCover}`);
    else setAlbumCover(Belmondo);
  }, [props.albumCover]);

  function formatTimeDifference(scrobbleDate) {
    const currentDate = new Date();
    const scrobbleDateObject = new Date(scrobbleDate);

    const timeDifference = currentDate - scrobbleDateObject;

    const seconds = Math.floor(timeDifference / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) {
      return `${days} day(s) ago`;
    } else if (hours > 0) {
      return `${hours} hour(s) ago`;
    } else if (minutes > 0) {
      return `${minutes} minute(s) ago`;
    } else {
      return `${seconds} second(s) ago`;
    }
  }

  if (title === "Your scrobbles")
    return (
      // <div class="text-[#f2f3ea] h-[100%] flex flex-row w-[100%] border border-[#3f4147] items-center hover:rounded-sm hover:border-slate-500 transition-all duration-150">
      //   <img
      //     class="mr-4 cursor-pointer max-w-[10%] hover:opacity-80 transition-all duration-150"
      //     src={albumCover()}
      //   />
      //   <div class="flex flex-grow max-w-[35%]">
      //     <span class="mr-4 cursor-pointer max-w-[10%] flex flex-grow">
      //       <img src={heartIcon} class="w-4" />
      //     </span>
      //     <span class="md:mr-4 cursor-pointer hover:text-slate-300 max-w-[30%] truncate">
      //       {title}
      //     </span>
      //   </div>
      //   <div class="flex flex-col md:flex-row max-w-[75%] md:justify-between md:items-center">
      //     <span class="md:mr-4 cursor-pointer hover:text-slate-300 truncate max-w-[30%]">
      //       {artist}
      //     </span>
      //     <span class="md:mr-4 md:max-w-[10%] text-yellow-400">{`5/5 \u2605`}</span>
      //     <span class="md:mr-4 cursor-default md:max-w-[15%]">
      //       {date ? formatTimeDifference(date) : ""}
      //     </span>
      //     <span class="mr-2 ml-4 cursor-pointer text-red-500 max-w-[5%]"></span>
      //   </div>
      // </div>
      <tr class="border border-black">
        <td class="w-1/12 border border-black"><img
          class="mr-4 cursor-pointer max-w-[10%] hover:opacity-80 transition-all duration-150"
          src={albumCover()}
        /></td>
        <td class="w-1/24 border border-black text-center"><img src={heartIcon} class="w-4" /></td>
        <td class="w-4/12 lg:max-w-[200px] md:max-w-[100px] sm:max-w-[60px] truncate border border-black">{title}</td>
        <td class="w-4/12 lg:max-w-[200px] md:max-w-[100px] sm:max-w-[60px] truncate border border-black">{artist}</td>
        <td class="w-1/24 border border-black text-center">{`5/5 \u2605`}</td>
        <td class="w-1/8 border border-black text-center" >{date ? formatTimeDifference(date) : ""}</td>
        <td class="w-1/24 border border-black text-center">X</td>
      </tr>
    );
  return (
    // <div class="text-[#f2f3ea] h-[100%] flex flex-row w-[100%] border border-[#3f4147] items-center hover:rounded-sm hover:border-slate-500 transition-all duration-150">
    //   <img
    //     class="mr-4 cursor-pointer max-w-[10%] hover:opacity-80 transition-all duration-150"
    //     src={albumCover()}
    //     onClick={() =>
    //       (window.location.href = `/song/${encodeSubjectName(title)}`)
    //     }
    //   />
    //   <div class="flex flex-grow max-w-[35%]">
    //     <span class="mr-4 cursor-pointer max-w-[10%] flex flex-grow">
    //       <img
    //         src={heart() === "heart" ? heartIcon : filledHeart}
    //         class="w-4"
    //         onClick={handleEditFavouriteSong}
    //       />
    //     </span>
    //     <span class="md:mr-4 cursor-pointer hover:text-slate-300 max-w-[30%] truncate">
    //       <A href={`/song/${encodeSubjectName(title)}`}>{title}</A>
    //     </span>
    //   </div>

    //   <div class="flex flex-col md:flex-row max-w-[75%] md:justify-between md:items-center">
    //     <span class="md:mr-4 cursor-pointer hover:text-slate-300 truncate max-w-[30%]">
    //       <A href={`/artist/${encodeSubjectName(artist)}`}>{artist}</A>
    //     </span>
    //     <span class="md:mr-4 cursor-pointer md:max-w-[10%] text-yellow-400">
    //       {rating ? `${rating}/5 \u2605` : `0/5 \u2605`}
    //     </span>
    //     <span class="md:mr-4 cursor-default md:max-w-[15%]">
    //       {date ? formatTimeDifference(date) : ""}
    //     </span>
    //     <span class="mr-2 ml-4 cursor-pointer text-red-500 max-w-[5%]">x</span>
    //   </div>
    // </div>
    <tr class="border border-black">
        <td class="w-1/12 ">
          <img
            class="mr-4 cursor-pointer hover:opacity-80 transition-all duration-150 aspect-square"
            src={albumCover()}
            onClick={() =>
              (window.location.href = `/song/${encodeSubjectName(title)}`)
            }
          />
      </td>
        <td class="text-center"><img
            src={heart() === "heart" ? heartIcon : filledHeart}
            class="w-5"
            onClick={handleEditFavouriteSong}
          /></td>
        <td class="w-4/12 lg:max-w-[150px] md:max-w-[100px] max-w-[60px] truncate  text-sm"><A href={`/song/${encodeSubjectName(title)}`}>{title}</A></td>
        <td class="w-4/12 lg:max-w-[150px] md:max-w-[100px] max-w-[60px] truncate  text-sm"><A href={`/artist/${encodeSubjectName(artist)}`}>{artist}</A></td>
        <td class="w-1/24  text-center text-xs">{rating ? `${rating}/5 \u2605` : `0/5 \u2605`}</td>
        <td class="w-1/8 text-center sm:text-xs text-[6px]" >{date.includes("Count") ? date : (date ? formatTimeDifference(date) : "")}</td>
        <td class="w-1/24  text-center text-red-500">{date.includes("Count") ? "" : "x"}</td>
      </tr>
  );
}
export default ScrobbleRow;
