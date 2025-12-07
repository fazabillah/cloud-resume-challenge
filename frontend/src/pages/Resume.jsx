import SideNav from '../components/SideNav'
import AboutSection from '../components/sections/AboutSection'
import SkillsSection from '../components/sections/SkillsSection'
import PortfolioProjectCard from '../components/cards/PortfolioProjectCard'
import ExperienceCard from '../components/cards/ExperienceCard'
import CertificationList from '../components/cards/CertificationList'
import EducationCard from '../components/cards/EducationCard'
import { personalInfo, aboutContent, resumeNavigation } from '../data/resumeData'
import skillsData from '../data/skillsData.json'
import projectsData from '../data/projectsData.json'
import experienceData from '../data/experienceData.json'
import certificationsData from '../data/certificationsData.json'
import educationData from '../data/educationData.json'
import useBodyClass from '../hooks/useBodyClass'

function Resume() {
  const navItems = resumeNavigation

  // Add 'has-sidebar' class to body for layout
  useBodyClass('has-sidebar')

  return (
    <>
      <SideNav navItems={navItems} brandText="Faza Billah" />

      <div className="container-fluid p-0">
        {/* About */}
        <section className="resume-section" id="about">
          <AboutSection personalInfo={personalInfo} aboutContent={aboutContent} />
        </section>
        <hr className="m-0" />

        {/* Technical Skills */}
        <section className="resume-section" id="skills">
          <div className="resume-section-content">
            <h2 className="mb-5">Technical Skills</h2>
            <SkillsSection skillCategories={skillsData.skillCategories} />
          </div>
        </section>
        <hr className="m-0" />

        {/* Certifications */}
        <section className="resume-section" id="certifications">
          <div className="resume-section-content">
            <h2 className="mb-5">Certifications & Training</h2>
            <CertificationList certifications={certificationsData} />
          </div>
        </section>
        <hr className="m-0" />

        {/* Project Portfolio */}
        <section className="resume-section" id="projects">
          <div className="resume-section-content">
            <h2 className="mb-5">Project Portfolio</h2>
            {projectsData.categories.map(category =>
              category.projects.map(project => (
                <PortfolioProjectCard key={project.id} project={project} />
              ))
            )}
          </div>
        </section>
        <hr className="m-0" />

        {/* Work Experience */}
        <section className="resume-section" id="experience">
          <div className="resume-section-content">
            <h2 className="mb-5">Work Experience</h2>
            {experienceData.positions.map(position => (
              <ExperienceCard key={position.id} position={position} />
            ))}
          </div>
        </section>
        <hr className="m-0" />

        {/* Education */}
        <section className="resume-section" id="education">
          <div className="resume-section-content">
            <h2 className="mb-5">Education</h2>
            {educationData.degrees.map(education => (
              <EducationCard key={education.id} education={education} />
            ))}
          </div>
        </section>
      </div>
    </>
  )
}

export default Resume
