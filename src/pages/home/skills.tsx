import { frontendSkills, SkillCardProps } from "@/assets/data";
import AutoScrollComponent from "@/components/providers/auto-scroll/auto-scroll-com";

const SkillCard = ({ img, title }: SkillCardProps) => (
  <div className="m-2 p-10 shadow rounded">
    <div className="flex w-full items-center justify-center overflow-hidden">
      <img src={img} className="object-cover size-24" alt={title} />
    </div>
    <h3 className="text-lg text-center mt-4 text-gray-700 font-bold">
      {title}
    </h3>
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
      <div id="add-blur" className=" w-screen max-w-7xl container mx-auto">
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
      </div>
    </section>
  );
};

export default Skills;
