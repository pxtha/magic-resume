import {
  CmcSkill,
  CustomSection,
  CustomSectionGroup,
  Education,
  Experience,
  Language,
  Profile,
  Project,
  SectionKey,
  SectionWithItem,
  URL,
} from "@reactive-resume/schema";
import { cn, isEmptyString, isUrl, linearTransform } from "@reactive-resume/utils";
import get from "lodash.get";
import React, { Fragment } from "react";

import { useArtboardStore } from "../store/artboard";
import { TemplateProps } from "../types/template";
import { Picture } from "../components/picture";

const Header = () => {
  const basics = useArtboardStore((state) => state.resume.basics);

  return (
    <div className="py-5 relative flex w-full flex-col items-center justify-center space-y-2 pb-2 text-center">
      <div className="font-bold text-lg">CURRICULUM VITAE</div>
      <div className="flex gap-5">
        <div className="flex flex-col items-start">
          <div className="font-bold">PERSONAL DETAILS</div>
          <div className="self-end">Name</div>
          <div className="self-end">Nationality</div>
          <div className="self-end">Sex</div>
        </div>
        <div className="flex flex-col items-start">
          <div className="invisible">hidden</div>
          <div>{basics.name}</div>
          <div>{basics.nationality}</div>
          <div>{basics.sex}</div>
        </div>
      </div>
      {basics.customFields.map((item) => (
        <Fragment key={item.id}>
          <div className="flex items-center gap-x-1.5">
            <i className={cn(`ph ph-bold ph-${item.icon}`, "text-primary")} />
            <span>{[item.name, item.value].filter(Boolean).join(": ")}</span>
          </div>
          <div className="bg-text size-1 rounded-full last:hidden" />
        </Fragment>
      ))}
    </div>
  );
};

const Summary = () => {
  const section = useArtboardStore((state) => state.resume.sections.summary);

  if (!section.visible || isEmptyString(section.content)) return null;

  return (
    <section id={section.id}>
      <h4 className={`bg-[ p-4 text-center text-lg font-bold bg-[#EBE4EC]`}>PROFESSIONAL SUMMARY</h4>
      <main className={"relative space-y-2"}>
        <div
          className="absolute left-[-4.5px] top-[8px] hidden size-[8px] rounded-full bg-primary group-[.main]:block" />

        <div
          className="wysiwyg"
          style={{ columns: section.columns }}
          dangerouslySetInnerHTML={{ __html: section.content }}
        />
      </main>
    </section>
  );
};

type LinkProps = {
  url: URL;
  icon?: React.ReactNode;
  label?: string;
  className?: string;
};

const Link = ({ url, icon, label, className }: LinkProps) => {
  if (!isUrl(url.href)) return null;

  return (
    <div className="flex items-center gap-x-1.5">
      {icon ?? <i className="ph ph-bold ph-link text-primary" />}
      <a
        href={url.href}
        target="_blank"
        rel="noreferrer noopener nofollow"
        className={cn("inline-block", className)}
      >
        {label || url.label || url.href}
      </a>
    </div>
  );
};

type SectionProps<T> = {
  section: SectionWithItem<T> | CustomSectionGroup;
  children?: (item: T, index: number) => React.ReactNode;
  className?: string;
  urlKey?: keyof T;
  levelKey?: keyof T;
  summaryKey?: keyof T;
  keywordsKey?: keyof T;
};

const Section = <T,>({
  section,
  children,
  className,
  urlKey,
  levelKey,
  summaryKey,
  keywordsKey,
}: SectionProps<T>) => {
  if (!section.visible || !section.items.length) return null;
  const sectionHeader = (section: SectionKey) => {
    switch (section) {
      case "cmcSkills":
        return <div>
          <h4 className={`bg-[ p-4 text-center text-lg font-bold bg-[#EBE4EC]`}>TECHNOLOGY AND SOFTWARE SKILLS</h4>
          <div className="border border-[#C0C0C0] mt-3 p-3">
            <span className="font-bold">Level</span>
            :&nbsp;1-4 Aware (Basic, need to practice more); 5-7 Knowledgeable (Intermediate, can use it at work); 8-10 Proficient (Advanced, very good to use it at work)
          </div>
          <div className="grid grid-cols-12 border border-[#C0C0C0] text-center">
            <div className="col-span-8 text-lg font-bold">
              Competencies
            </div>
            <div className="col-span-4 text-lg font-bold border-[#C0C0C0] border-l-2">
              Level
            </div>
          </div>
        </div>
      case "experience":
        return <h4 className={`bg-[ p-4 text-center text-lg font-bold bg-[#EBE4EC]`}>WORK EXPERIENCE</h4>
      case "education":
      case "certifications":
        return <h4 className={`bg-[ p-4 text-center text-lg font-bold bg-[#EBE4EC]`}>EDUCATION & CERTIFICATIONS</h4>
      case "projects":
        return <h4 className={`bg-[ p-4 text-center text-lg font-bold bg-[#EBE4EC]`}>PROJECT LIST</h4>
      case "languages":
        return <h4 className={`bg-[ p-4 text-center text-lg font-bold bg-[#EBE4EC]`}>LANGUAGES</h4>
      default:
        return null;
    }
  }

  return (
    <section id={section.id} className="grid">
      {sectionHeader(section.id as SectionKey)}
      <div
        className="grid"
        style={{ gridTemplateColumns: `repeat(1, 1fr)` }}
      >
        {section.items
          .filter((item) => item.visible)
          .map((item, index) => {
            const url = (urlKey && get(item, urlKey)) as URL | undefined;
            const summary = (summaryKey && get(item, summaryKey, "")) as string | undefined;
            const keywords = (keywordsKey && get(item, keywordsKey, [])) as string[] | undefined;

            return (
              <div key={item.id} className={cn("space-y-2", className, 'w-full')}>
                <div>
                  {children?.(item as T, index)}
                  {url !== undefined && <Link url={url} />}
                </div>

                {/* {summary !== undefined && !isEmptyString(summary) && (
                  <div className="wysiwyg" dangerouslySetInnerHTML={{ __html: summary }} />
                )} */}

                {/* {keywords !== undefined && keywords.length > 0 && (
                  <p className="text-sm">{keywords.join(", ")}</p>
                )} */}
              </div>
            );
          })}
      </div>
    </section>
  );
};

const Profiles = () => {
  const section = useArtboardStore((state) => state.resume.sections.profiles);
  const fontSize = useArtboardStore((state) => state.resume.metadata.typography.font.size);

  return (
    <Section<Profile> section={section}>
      {(item) => (
        <div>
          {isUrl(item.url.href) ? (
            <Link
              url={item.url}
              label={item.username}
              icon={
                <img
                  className="ph"
                  width={fontSize}
                  height={fontSize}
                  alt={item.network}
                  src={`https://cdn.simpleicons.org/${item.icon}`}
                />
              }
            />
          ) : (
            <p>{item.username}</p>
          )}
          <p className="text-sm">{item.network}</p>
        </div>
      )}
    </Section>
  );
};

const Experience = () => {
  const section = useArtboardStore((state) => state.resume.sections.experience);
  return (
    <Section<Experience> section={section} urlKey="url" summaryKey="summary">
      {(item) => (
        <div className="grid grid-cols-12">
          <div className="col-span-4 border border-[#C0C0C0] p-3">{item.date}</div>
          <div className="col-span-8 border border-[#C0C0C0] p-3">
            <div>
              Company: {item.company}
            </div>
            <div>
              Job title: {item.position}
            </div>
          </div>
        </div>
      )}
    </Section>
  );
};

const Education = () => {
  const section = useArtboardStore((state) => state.resume.sections.education);

  return (
    <Section<Education> section={section} urlKey="url" summaryKey="summary">
      {(item) => (
        <div className="grid grid-cols-12">
          <div className="col-span-4 border border-[#C0C0C0] p-3">{item.date}</div>
          <div className="col-span-8 border border-[#C0C0C0] p-3">{item.institution}</div>
        </div>
      )}
    </Section>
  );
};

const Skills = () => {
  const section = useArtboardStore((state) => state.resume.sections.cmcSkills);

  const levelText = (level: number) => {
    const maxLevel = 10;

    if (level <= 4 && level >= 1) return `Aware ${level}/${maxLevel}`;
    else if (level <= 7 && level >= 5) return `Knowledgeable ${level}/${maxLevel}`;
    else if (level <= 10 && level >= 8) return `Proficient ${level}/${maxLevel}`;
    else return null;
  }

  return (
    <div>
      <Section<CmcSkill> section={section} levelKey="level" keywordsKey="keywords">
        {(item) => (
          <Fragment>
            <div className="border border-[#C0C0C0] p-3 text-center font-bold">{item.name}</div>
            <div className="grid grid-cols-12 ">
              {item.keywords.map((v, i) => (
                <Fragment key={v}>
                  <div className="col-span-8 border border-[#C0C0C0] p-3">{v}</div>
                  <div className="col-span-4 border border-[#C0C0C0] p-3 text-center">{levelText(+item.levelOfKeywords[i])}</div>
                </Fragment>
              ))}
            </div>
          </Fragment>
        )}
      </Section>
    </div>
  );
};

const Languages = () => {
  const section = useArtboardStore((state) => state.resume.sections.languages);

  const levelText: Record<number, string> = {
    1: "Beginner",
    2: "Intermediate",
    3: "Upper-Intermediate",
    4: "Advanced",
    5: "Proficiency"
  }

  return (
    <Section<Language> section={section} levelKey="level">
      {(item) => (
        <div className="grid grid-cols-12">
          <div className="col-span-4 border border-[#C0C0C0] p-3">{item.name}</div>
          <div className="col-span-3 border border-[#C0C0C0] p-3">{levelText[item.level]}</div>
          <div className="col-span-5 border border-[#C0C0C0] p-3">{item.description}</div>
        </div>
      )}
    </Section>
  );
};

const Projects = () => {
  const section = useArtboardStore((state) => state.resume.sections.projects);

  return (
    <Section<Project> section={section} urlKey="url" summaryKey="summary" keywordsKey="keywords">
      {(item, index) => (
        <div>
          <div className="font-bold text-lg py-3 capitalize">{index + 1}. {item.name} ({item.date})</div>
          <div className="grid grid-cols-12">
            <div className="col-span-4 border border-[#C0C0C0] p-3">Project Description</div>
            <div className="col-span-8 border border-[#C0C0C0] p-3">
              {item.summary !== undefined && !isEmptyString(item.summary) && (
                <div className="wysiwyg" dangerouslySetInnerHTML={{ __html: item.summary }} />
              )}
            </div>

            <div className="col-span-4 border border-[#C0C0C0] p-3">Team size</div>
            <div className="col-span-8 border border-[#C0C0C0] p-3">{item.size}</div>

            <div className="col-span-4 border border-[#C0C0C0] p-3">Responsibilities</div>
            <div className="col-span-8 border border-[#C0C0C0] p-3">{item.responsibilities}</div>

            <div className="col-span-4 border border-[#C0C0C0] p-3">Programming languages</div>
            <div className="col-span-8 border border-[#C0C0C0] p-3">{item.programmingLanguage}</div>

            <div className="col-span-4 border border-[#C0C0C0] p-3">Tools</div>
            <div className="col-span-8 border border-[#C0C0C0] p-3">{item.tools}</div>

            <div className="col-span-4 border border-[#C0C0C0] p-3">Platform, server and database</div>
            <div className="col-span-8 border border-[#C0C0C0] p-3">{item.platform}</div>

            <div className="col-span-4 border border-[#C0C0C0] p-3">Used technologies</div>
            <div className="col-span-8 border border-[#C0C0C0] p-3">{item.technologies}</div>
          </div>
        </div>
      )}
    </Section>
  );
};

const Custom = ({ id }: { id: string }) => {
  const section = useArtboardStore((state) => state.resume.sections.custom[id]);

  return (
    <Section<CustomSection>
      section={section}
      urlKey="url"
      summaryKey="summary"
      keywordsKey="keywords"
    >
      {(item) => (
        <div>
          <div>
            <div className="font-bold">{item.name}</div>
            <div>{item.description}</div>

            <div className="font-bold">{item.date}</div>
            <div>{item.location}</div>
          </div>
        </div>
      )}
    </Section>
  );
};

const mapSectionToComponent = (section: SectionKey) => {

  switch (section) {
    case "profiles":
      return <></>;
    case "summary":
      return <Summary />
    case "experience":
      return <Experience />;
    case "education":
    case "certifications":
      return <Education />;
    case "skills":
      return <Skills />;
    case "languages":
      return <Languages />;
    case "projects":
      return <Projects />;
    default:
      if (section.startsWith("custom.")) return <Custom id={section.split(".")[1]} />;

      return null;
  }
};

export const Cmc1 = ({ columns, isFirstPage = false }: TemplateProps) => {
  const [main, sidebar] = columns;

  return (
    <div className="p-3">
      {isFirstPage && (
        <div className="relative">
          <div className="sticky inset-x-0 top-0 h-[85px] w-full z-0 grid grid-cols-12">
            <div className="col-span-4">
              <img src="http://192.168.52.102:9000/default/logo.png" />
            </div>
            <div className="col-span-8 text-end text-xs">
              <p>Head Office: 8 & 9 th Floor, CMC Tower, 11 Duy Tan Street,</p>
              <p>Dich Vong Hau Ward, Hanoi City, Vietnam.</p>
              <p>Tel: 84.24 3212 3396 | Fax: 84.24 3212 9067|<Link url={{
                href: "www.cmc.com.vn",
                label: "www.cmc.com.vn"
              }} /></p>
            </div>
          </div>
          <Header />
        </div>
      )}

      {main.map((section) => (
        <Fragment key={section}>{mapSectionToComponent(section)}</Fragment>
      ))}

      {sidebar.map((section) => (
        <Fragment key={section}>{mapSectionToComponent(section)}</Fragment>
      ))}

      <footer className="bg-background">
        <div className="container grid pt-12">
          <div className="relative flex flex-col items-end justify-end">
            <div>
              <a href="https://www.digitalocean.com/?utm_medium=opensource&utm_source=Reactive-Resume">
                <img
                  src="http://192.168.52.102:9000/default/footer.png"
                  alt="Powered by DigitalOcean"
                  className="block dark:hidden"
                />
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};
