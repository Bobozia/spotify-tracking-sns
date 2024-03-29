import { A } from "@solidjs/router";
import { encodeSubjectName } from "../../encodeSubjectName";

function ChartsRow(props) {
  const {
    photo,
    textMain,
    textSecondary,
    index,
    type,
    typeSecondary,
    ...other
  } = props;

  const handleClick = (event, subject, name) => {
    event.preventDefault();
    if (subject !== "" && name !== "")
      window.location.href = `/${subject}/${encodeSubjectName(name)}`;
  };

  return (
    <>
      <p class="w-8 md:hidden">{index + 1}.</p>
      <div class="flex flex-col md:flex-row items-center mb-4">
        <p class="w-8 hidden md:block">{index + 1}.</p>
        <img
          onClick={(event) => handleClick(event, type, textMain)}
          src={`data:image/png;base64,${photo}`}
          alt="cover"
          class="ml-2 w-20 h-20 rounded-md cursor-pointer"
        />
        <div class="ml-3 flex flex-col mx-auto">
          <p
            onClick={(event) => handleClick(event, type, textMain)}
            class="mr-2 truncate w-40 md:w-72 lg:w-56 xl:w-60 cursor-pointer text-lg"
          >
            {textMain}
          </p>
          <p
            onClick={(event) =>
              handleClick(event, typeSecondary, textSecondary)
            }
            class="mr-2 truncate w-40 md:w-72 lg:w-56 xl:w-60 cursor-pointer text-sm"
          >
            {textSecondary}
          </p>
        </div>
      </div>
    </>
  );
}

export default ChartsRow;
