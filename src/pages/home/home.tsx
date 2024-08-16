import { Button } from "@/components/ui/button";
import { SignInButton } from "@clerk/clerk-react";
import { Link } from "react-router-dom";
import UiShowCase from "./ui-showcase";
import Skills from "./skills";

const Home = () => {
  return (
    <>
      <Intro />
      <UiShowCase />
      <Skills/>
    </>
  );
};

export default Home;

const Intro = () => {
  return (
    <section className="w-full max-w-7xl flex py-10 justify-center gap-y-10 flex-col items-center mx-auto">
      <div className="prose prose-base dark:prose-invert prose-h1:min-w-full prose-h1:m-1  lg:prose-xl   w-full">
        <h1 className="w-full   text-center">
          Oragnize, Share & Collaborate with ease.
        </h1>
        <p className="text-center">
          Save and organize your code snippets in the cloud. Single Page Website
          , Eccormerse Apps, and much more.
        </p>
      </div>
      <div className="w-full mx-auto gap-4 flex justify-center flex-col">
        <div className="flex flex-row justify-center gap-x-2">
          <p className="text-center underline text-gray-600 dark:text-gray-400">
            Get Started for Free Or Hire me{" "}
          </p>

          <Link className="underline" to="/admin">
            Admin
          </Link>
        </div>
        <div className="grid grid-cols-2 max-w-xl mx-auto gap-x-4">
          <Button asChild variant="default" size="lg">
            <SignInButton />
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link to="/about">Know More</Link>
          </Button>
        </div>
      </div>
    </section>
  );
};
