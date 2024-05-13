const chat = ref<
  {
    isServer: boolean;
    message: string;
    name?: string;
    time?: string;
  }[]
>([]);
export const useChat = () => {
  const addMessage = ({ isServer, message, name, time }: any) => {
    chat.value.push({ isServer, message, name, time });
  };
  return { chat, addMessage };
};
