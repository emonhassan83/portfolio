import "./Skills.css";
import Skill from "./Skill";
import { useTheme } from "../../../lib/ThemeProvider";
import { useGetAllSkillsQuery } from "../../../redux/features/skillsApi";

const Skills = () => {
  const { theme } = useTheme(); //* use for dark and light themes
  const { data } = useGetAllSkillsQuery([
    { name: 'limit', value: 21 }
  ]);

  const sortedSkills = data?.data?.slice().sort((a, b) =>
    new Date(a.createdAt) - new Date(b.createdAt)
  );

  return (
    <section
      className={`skills section ${
        theme.mode === "dark" ? "dark-bg-color text-gray-100" : "bg-color"
      }`}
      id="skills"
    >
      <h2
        className={`section__title ${
          theme.mode === "dark" ? "text-gray-100" : "text__color"
        }`}
      >
        Skills
      </h2>
      <span className="section__subtitle">My technical level</span>
      <div className="skills__container container grid">
        {sortedSkills?.map((singleSkill, index) => (
          <Skill key={index} singleSkill={singleSkill} />
        ))}
      </div>
    </section>
  );
};

export default Skills;
