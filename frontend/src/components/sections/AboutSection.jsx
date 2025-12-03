import SocialIcons from '../SocialIcons'
import ViewCounter from '../ViewCounter'

function AboutSection({ personalInfo, aboutContent }) {
  return (
    <div className="resume-section-content">
      <h1 className="mb-0">
        {personalInfo.firstName}
        <span className="text-primary"> {personalInfo.lastName}</span>
      </h1>
      <div className="subheading mb-5">
        {personalInfo.location} · {personalInfo.phone} ·
        <a href={`mailto:${personalInfo.email}`}>{personalInfo.email}</a>
      </div>
      <p className="lead mb-5">{aboutContent.lead}</p>
      <SocialIcons />
      <ViewCounter />
    </div>
  )
}

export default AboutSection
