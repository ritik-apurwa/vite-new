import { frontendSkills, SkillCardProps } from "@/assets/data";
import FadeImageCarousel from "@/components/providers/auto-scroll/fade-image-carousel";

const ContactPage = () => {
  const SkillCard = ({ img }: SkillCardProps) => {
    return (
      <div className="flex justify-center items-center h-full w-full">
        <img src={img} className="w-full object-cover h-auto max-h-40" alt="" />
      </div>
    );
  };

  return (
    <div className="w-full h-screen flex flex-col items-center justify-center space-y-8">
      <div className="w-full max-w-4xl">
        <FadeImageCarousel
          slides={frontendSkills.map((item) => (
            <SkillCard key={item.id} {...item} />
          ))}
          options={{ startIndex: 1 }}
        />
      </div>
      <div className="text-center max-w-2xl">
        <p>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Aspernatur
          vitae debitis est sit doloremque harum, dolore facilis minus.
          Molestiae, ipsam.
        </p>
      </div>
    </div>
  );
};

export default ContactPage;
