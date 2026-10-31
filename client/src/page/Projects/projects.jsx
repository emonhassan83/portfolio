
import { useTheme } from "../../lib/ThemeProvider";
import { useGetAllProjectsQuery } from "../../redux/features/projectApi";
import "../../components/Home/Portfolio/Portfolio.css";
import PortfolioCard from "../../components/Home/Portfolio/PortfolioCard";

const ProjectsPage = () => {
  const { data } = useGetAllProjectsQuery();
  console.log(data);
  const { theme } = useTheme(); //* use for dark and light themes

  return (
    <section
      className={`portfolio section ${
        theme.mode === "dark"
          ? "dark-bg-color text-gray-100"
          : "bg-color title__color"
      }`}
      id="portfolio"
    >
      <h2
        className={`section__title ${
          theme.mode === "dark" ? "text-gray-100" : "text__color"
        }`}
      >
        All Projects
      </h2>
      <span className="section__subtitle">My recent all work</span>

      <div className="portfolio__container container">
        {
            data?.data?.length> 0 && data?.data?.map((project) => <PortfolioCard key={project._id} project={project}/>)
        }
      </div>
    </section>
  );
};

export default ProjectsPage;
