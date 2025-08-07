export type Message = {
  messageId: string;
  sender: string;
  message: string;
  postedAt: string;
};

export type MessagesRes = {
  items: Message[];
};

export type PostMessageParams = {
  message: string;
};

export type SendMessageResponse = {
  message: Message;
  success: boolean;
}; 
