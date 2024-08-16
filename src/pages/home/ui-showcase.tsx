import blogpicture from "@/assets/icons/hudai-gayiran-1w8d1LX8XRc-unsplash.jpg";
import {
  AlertCircle,
  Edit2,
  Flag,
  MessageCircle,
  MoreVertical,
  Paperclip,
  ReplyIcon,
  Upload,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface HighlightedBoxProps {
  highlightcolor: string;
  text: string;
  highlightTextcolor: string;
}

const HighlightedBox = ({
  highlightcolor,
  highlightTextcolor,
  text,
}: HighlightedBoxProps) => {
  return (
    <div
      className={`${highlightcolor} min-w-10 min-h-12 flex justify-center items-center size-auto`}
    >
      <span className={`${highlightTextcolor}   font-bold text-2xl`}>
        {text}
      </span>
    </div>
  );
};

const Header = () => {
  return (
    <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6 mb-8">
      <div className="size-20 bg-primary header-shadow items-center justify-center flex">
        <span className="text-primary-foreground text-6xl text-center">e</span>
      </div>
      <div className="text-center sm:text-left">
        <h1 className="text-4xl sm:text-6xl text-foreground">ELEMENTS</h1>
        <p className="text-muted-foreground">Widget Collection</p>
      </div>
    </div>
  );
};

const UiShowCase = () => {
  return (
   <div className="dark:bg-zinc-900/50">
     <section className="relative grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-4 sm:p-8 max-w-7xl mx-auto min-h-screen  text-foreground">
      <div className="col-span-full mb-8">
        <Header />
      </div>
      <div className="flex flex-col justify-end gap-6">
        <BlogShow />
        <CardShow />
      </div>
      <div className="flex flex-col gap-6">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-end gap-4">
          <UploadButton />
          <DropDownButtons />
        </div>

        <DashBoardDesign />
        <DashBoardDesignFull />
        <AlertDialog />
      </div>
      <div className="flex flex-col gap-6">
        <StartConversation />
        <CreateNewBoard />
      </div>
    </section>
   </div>
  );
};

export default UiShowCase;

const BlogShow = () => {
  return (
    <div className="p-6 border-2 rounded-lg shadow-md bg-card text-card-foreground">
      <span className="text-sm text-gray-500">widget</span>
      <h1 className="text-2xl font-bold text-blue-300/60 mt-2 mb-4">
        Here is nice long blog title
      </h1>
      <p className="text-gray-600 mb-4">You are about to undo this action</p>
      <div className=" grid grid-cols-2 space-x-4">
        <button className="text-gray-500 text-start ">Maybe later</button>
        <button className="text-yellow-500 text-end">Read now</button>
      </div>
    </div>
  );
};

const CardShow = () => {
  return (
    <div className="rounded-lg shadow-md border-2 overflow-hidden bg-card">
      <div className="h-40 w-full">
        <img
          src={blogpicture}
          alt="Random"
          className="w-full h-full object-cover object-bottom"
        />
      </div>
      <div className="p-3">
        <h1 className="text-xl text-center font-semibold">Title</h1>
        <p className="text-gray-600 mb-2 text-center">Take an action</p>
        <Button
          variant="outline"
          className="border-indigo-600 w-full rounded-none text-indigo-600"
        >
          Create board
        </Button>
      </div>
    </div>
  );
};

const DropDownButtons = () => {
  return (
    <div className="p-4 rounded-lg border shadow-md space-y-2 bg-card text-card-foreground">
      <div className="flex items-center space-x-2 ">
        <ReplyIcon className="text-indigo-600" size={20} />
        <span className="text-indigo-600">Reply</span>
      </div>
      <div className="flex items-center text-gray-500 space-x-2 ">
        <Edit2 className="" size={20} />
        <span>Edit</span>
      </div>
      <div className="flex items-center space-x-2 text-gray-500">
        <Flag size={20} />
        <span>Flag</span>
      </div>
    </div>
  );
};

const UploadButton = () => {
  return (
    <div className="bg-primary text-primary-foreground size-20 rounded-lg flex flex-col items-center justify-center">
      <Upload size={24} className="text-white mb-2" />
      <h1 className="text-text-white font-semibold">Upload</h1>
    </div>
  );
};

const StartConversation = () => {
  return (
    <div className="p-6 rounded-lg border-2 shadow-md space-y-4 bg-card text-card-foreground">
      <h1 className="text-2xl font-bold">Start a conversation</h1>
      <div>
        <Label htmlFor="to">To</Label>
        <Input id="to" type="text" placeholder="Enter recipient" />
      </div>

      <Textarea placeholder="Start a conversation" />
      <div className="flex justify-between">
        <Button variant="outline" className="" size="icon">
          <Paperclip size={20} />
        </Button>
        <Button className="bg-green-500 text-whites rounded-none">Post</Button>
      </div>
    </div>
  );
};

const AlertDialog = () => {
  return (
    <div className="p-6 rounded-lg shadow-md border-2 bg-card text-card-foreground">
      <h1 className="text-xl font-semibold mb-2">Dismiss the alert</h1>
      <p className="text-gray-600 mb-4">
        You are about to undo the last action
      </p>
      <div className="flex space-x-4">
        <Button variant="destructive">Yes</Button>
        <Button variant="outline">No</Button>
      </div>
    </div>
  );
};

const DashBoardDesign = () => {
  return (
    <div className="border p-2 rounded-lg shadow-md flex items-center bg-card text-card-foreground">
      <div className="w-1 bg-indigo-600 h-12 mr-4"></div>
      <div className="flex-grow">
        <h3 className="font-semibold">Dashboard Design</h3>
        <p className="text-gray-500">@ui/ux</p>
      </div>
      <div className="flex space-x-2">
        {/* <MessageCircle size={20} className="text-gray-400" /> */}
        <MoreVertical size={20} className="text-gray-400" />
      </div>
    </div>
  );
};
const DashBoardDesignFull = () => {
  return (
    <div className="flex flex-col gap-y-4 bg-card text-card-foreground p-4 rounded-lg shadow-md">
      <div className=" border p-4 rounded-lg shadow-md flex items-center">
        <div className="w-1 bg-indigo-600 h-16 mr-4"></div>
        <div className="flex-grow">
          <h3 className="font-semibold">Dashboard Design</h3>
          <p className="text-gray-500">@ui/ux</p>
        </div>
        <div className="flex space-x-2">
          <MessageCircle size={20} className="text-gray-400" />
          <MoreVertical size={20} className="text-gray-400" />
        </div>
      </div>
      <div className="flex flex-row justify-between">
        <span className="text-gray-500">activites</span>
        <span className="size-8 rounded-full flex justify-center items-center font-bold bg-indigo-500/40 p-3">
          12
        </span>
      </div>
      <div className="flex justify-start">
        <div className="bg-indigo-600/40 flex px-4 py-2 flex-row justify-center items-center gap-x-2">
          <MessageCircle size={20} className="text-gray-400" />
          <span>12</span>
        </div>
      </div>

      <div className="flex flex-row justify-between">
        <span className="text-gray-500">people working</span>
        <span className="size-8 rounded-full flex justify-center items-center font-bold bg-indigo-500/40 p-3">
          7
        </span>
      </div>
      <div className="flex flex-row gap-x-2">
        <HighlightedBox
          highlightTextcolor="text-white"
          highlightcolor="bg-indigo-200/40"
          text="+"
        />
        <HighlightedBox
          highlightTextcolor="text-white"
          highlightcolor="bg-rose-400/40"
          text="K"
        />

        <HighlightedBox
          highlightTextcolor="text-white"
          highlightcolor="bg-indigo-300/70"
          text="T"
        />
        <HighlightedBox
          highlightTextcolor="text-white"
          highlightcolor="bg-red-600/30"
          text="D"
        />
        <HighlightedBox
          highlightTextcolor="text-white"
          highlightcolor="bg-sky-600/40"
          text="B"
        />
        <HighlightedBox
          highlightTextcolor="text-yellow-400"
          highlightcolor="bg-yellow-600/40"
          text="M"
        />
        <HighlightedBox
          highlightTextcolor="text-white"
          highlightcolor="bg-indigo-500/30"
          text="+2"
        />
      </div>
    </div>
  );
};
const CreateNewBoard = () => {
  return (
    <div className="p-6 rounded-lg border shadow-md space-y-4 bg-card text-card-foreground">
      <div>
        <Input id="board-id" type="text" placeholder="Board ID" />
      </div>
      <div>
        <Label htmlFor="board-id">
          Board ID{" "}
          <AlertCircle size={16} className="inline text-gray-400 ml-1" />
        </Label>
        <Input type="text" className="mt-2" placeholder="@appdesign" />
        <span id="message" className="text-green-500/70 text-xs">
          Good work Ritik, nice to go!
        </span>
      </div>
      <div>
        <p className="text-gray-600 mb-2">Or add an existing board</p>
        <div className="flex space-x-2">
          <Button variant="outline" size="sm">
            @web
          </Button>
          <Button variant="default" size="sm">
            @ui/ux
          </Button>
        </div>
      </div>
      <div>
        <Label htmlFor="add-people">Add People</Label>
        <div className="relative">
          <Input
            id="add-people"
            type="text"
            className="mt-2"
            placeholder="Enter email"
          />
          <div className="absolute   right-1 flex justify-center items-center top-1 ">
            <Button className="size-[98%] bg-green-500 w-20 h-7">Invite</Button>
          </div>
        </div>
      </div>
      <div>
        <div className="w-20 flex flex-row gap-x-3 h-10">
          <HighlightedBox
            highlightTextcolor="text-indigo-600/60"
            highlightcolor="bg-teal-600/30"
            text="A"
          />
          <HighlightedBox
            highlightTextcolor="text-white-600/80"
            highlightcolor="bg-indigo-600/30"
            text="R"
          />
        </div>
      </div>
      <Button className="w-full">Create Board</Button>
    </div>
  );
};
