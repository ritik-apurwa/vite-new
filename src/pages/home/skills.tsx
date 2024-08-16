import { frontendSkills, mainSkills, SkillCardProps } from "@/assets/data";
import AutoScrollComponent from "@/components/providers/auto-scroll/auto-scroll-com";

const SkillCard = ({ img, title, description }: SkillCardProps) => (
  <div className="m-2 p-4 shadow rounded">
    <div className="flex w-full items-center justify-center overflow-hidden">
      <img src={img} className="object-cover size-16" alt={title} />
    </div>
    <h3 className="text-lg text-center font-bold">{title}</h3>
    <p className="text-center text-xs">{description}</p>
  </div>
);

const Skills = () => {
  return (
    <section className="h-screen skills-g min-h-screen grid-rows-2 md:grid-cols-2 max-h-[1000px]  py-10 ">
      <div className="flex w-full justify-center">
        <div className="prose w-full prose-base dark:prose-invert lg:prose-lg">
          <h1 className="text-center">You don't need more than this</h1>
          <p>
            Lorem ipsum dolor, sit amet consectetur adipisicing elit. Quas
            incidunt ipsum voluptatibus consequuntur recusandae tenetur nulla,
            veritatis omnis est cum?
          </p>
        </div>
      </div>
      <div id="add-blur" className=" w-screen max-w-2xl mx-auto">
        <AutoScrollComponent
          slides={frontendSkills.map((skill) => (
            <SkillCard
              key={skill.id}
              id={skill.id}
              title={skill.title}
              img={skill.img}
              description={skill.description}
            />
          ))}
          direction="forward"
          options={{ startIndex: 1 }}
        />
        <AutoScrollComponent
          slides={mainSkills.map((skill) => (
            <SkillCard
              key={skill.id}
              id={skill.id}
              title={skill.title}
              img={skill.img}
              description={skill.description}
            />
          ))}
          direction="backward"
          options={{ startIndex: 1, axis: "x" }}
        />
      </div>
    </section>
  );
};

export default Skills;
