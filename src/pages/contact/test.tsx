const ContactForm = () => {
    const [focusedInput, setFocusedInput] = useState<string | null>(null);
    const [inputValues, setInputValues] = useState({
      name: "",
      message: "",
    });
  
    const handleFocus = (inputName: string) => {
      setFocusedInput(inputName);
    };
  
    const handleBlur = (inputName: string) => {
      if (inputValues[inputName as keyof typeof inputValues] === "") {
        setFocusedInput(null);
      }
    };
  
    const handleChange = (
      e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
      const { name, value } = e.target;
      setInputValues((prevValues) => ({
        ...prevValues,
        [name]: value,
      }));
    };
  
    return (
      <div className="flex flex-col max-w-sm mx-auto gap-y-5">
        <div className="flex flex-col relative">
          <motion.label
            className="absolute left-2 pointer-events-none text-gray-500"
            initial={{ y: 0, x: 0 }}
            animate={{
              y: focusedInput === "name" || inputValues.name ? -24 : 0,
              scale: focusedInput === "name" || inputValues.name ? 0.75 : 1,
              x: focusedInput === "name" || inputValues.name ? -10 : 0,
            }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            htmlFor="name"
          >
            Name
          </motion.label>
          <div className="relative">
            <Input
              id="name"
              name="name"
              autoComplete="off"
              className="border-x-0 bg-black focus:outline-none border-t-0 border-b-2 rounded-none focus-visible:ring-0 border-gray-500 pt-6"
              type="text"
              onFocus={() => handleFocus("name")}
              onBlur={() => handleBlur("name")}
              onChange={handleChange}
              value={inputValues.name}
            />
            <span
              className={`absolute bottom-0 left-0 w-full h-0.5 bg-indigo-400 transition-transform ${
                focusedInput === "name" || inputValues.name
                  ? "transform scale-x-100"
                  : "transform scale-x-0"
              }`}
              style={{
                transition: "transform 0.3s ease",
                transformOrigin: "center",
              }}
            />
          </div>
        </div>
        <div className="flex flex-col relative">
          <motion.label
            className="absolute left-2 pointer-events-none text-gray-500"
            initial={{ y: 0, x: 0 }}
            animate={{
              y: focusedInput === "message" || inputValues.message ? -24 : 0,
              scale: focusedInput === "message" || inputValues.message ? 0.75 : 1,
              x: focusedInput === "message" || inputValues.message ? -10 : 0,
            }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            htmlFor="message"
          >
            Message
          </motion.label>
          <div className="relative">
            <Textarea
              id="message"
              name="message"
              className="border-x-0 bg-black rounded-none border-t-0 border-b-2 focus-visible:ring-0 border-gray-500 pt-6"
              onFocus={() => handleFocus("message")}
              onBlur={() => handleBlur("message")}
              onChange={handleChange}
              value={inputValues.message}
            />
            <span
              className={`absolute bottom-0 left-0 w-full h-0.5 bg-indigo-400 transition-transform ${
                focusedInput === "message" || inputValues.message
                  ? "transform scale-x-100"
                  : "transform scale-x-0"
              }`}
              style={{
                transition: "transform 0.3s ease",
                transformOrigin: "center",
              }}
            />
          </div>
        </div>
      </div>
    );
  };