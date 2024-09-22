import ChatBot from "react-chatbotify";

const MyChatBot = () => {
  const flow = {
    start: {
      message: "What is your age?",
      path: "end",
    },
    end: {
      message: (params) => `I see you are ${params.userInput}!`,
      chatDisabled: true,
    },
  };
  return <ChatBot flow={flow} />;
  //   return "hello";
};

export default MyChatBot;
