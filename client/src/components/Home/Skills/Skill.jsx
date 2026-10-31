import { useTheme } from "../../../lib/ThemeProvider";


const Skill = ({ singleSkill }) => {
  const { image, name } = singleSkill;
  const { theme } = useTheme(); // use for dark and light themes

  return (
    <div className="skill__box">
      <div className="skill__img">
      <img src={image} alt="Skill Image" />
      </div>
      <h2 className={`skill__description ${
            theme.mode === "dark" ? "text-gray-100" : "text__color"
          }`}>{name}</h2>
    </div>
  );
};

export default Skill;