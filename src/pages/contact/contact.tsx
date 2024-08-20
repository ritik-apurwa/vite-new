import ContactForm from "./contact-form";

const Contact = () => {
  return (
    <div className="grid grid-rows-2 grid-cols-none lg:grid-cols-2 lg:grid-rows-none max-w-7xl mx-auto min-h-[80vh]">
      <div className="flex justify-center  items-center">
        <h1 className="t-text text-7xl noto-sans  capitalize">
          <span className="text-white font-bold">Ready to</span> <br />
          <span>Make e'm</span> <br />
          <span className="text-white font-bold">
            Say wow <span>?</span>
          </span>
        </h1>
      </div>
      <div className="h-full w-full flex justify-center items-center">
        <ContactForm />
      </div>

      {/* Or for editing an existing test */}
    </div>
  );
};

export default Contact;
