import React, { useEffect, useState } from "react";
import { MessageSquare, X, Minimize2, Maximize2 } from "lucide-react";
import { useChatStore } from "../store/chatStore";

interface ChatBoxProps {
  username: string;
}

export const ChatBox: React.FC<ChatBoxProps> = ({ username }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [message, setMessage] = useState("");
  const {
    messages = [],
    fetchMessages,
    addMessage,
    deleteMessage,
  } = useChatStore();

  useEffect(() => {
    if (isOpen) fetchMessages();
  }, [isOpen, fetchMessages]);

  const handleSend = async () => {
    if (message.trim()) {
      await addMessage(username, message);
      setMessage("");
    }
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 right-4 bg-indigo-600 text-white p-3 rounded-full shadow-lg"
      >
        <MessageSquare />
      </button>
    );
  }

  return (
    <div
      className={`fixed bottom-4 right-4 bg-white rounded-lg shadow-lg w-80 ${
        isMinimized ? "h-12" : "h-96"
      }`}
    >
      <div className="flex justify-between items-center p-3 border-b">
        <h3 className="font-bold">Chat</h3>
        <div className="flex space-x-2">
          <button
            onClick={() => setIsMinimized(!isMinimized)}
            className="text-gray-500 hover:text-gray-700"
          >
            {isMinimized ? <Maximize2 size={18} /> : <Minimize2 size={18} />}
          </button>
          <button
            onClick={() => setIsOpen(false)}
            className="text-gray-500 hover:text-gray-700"
          >
            <X size={18} />
          </button>
        </div>
      </div>

      {!isMinimized && (
        <>
          <div className="p-3 h-64 overflow-y-auto">
            {Array.isArray(messages) &&
              messages.map((msg, index) => (
                <div
                  key={msg.id || `message-${index}`}
                  className={`mb-2 ${
                    msg.sender === username ? "text-right" : "text-left"
                  }`}
                >
                  <div
                    className={`inline-block p-2 rounded-lg ${
                      msg.sender === username
                        ? "bg-indigo-600 text-white"
                        : "bg-gray-200"
                    }`}
                  >
                    <p className="text-sm font-bold">{msg.sender}</p>
                    <p>{msg.content}</p>
                    {msg.sender === username && msg.id && (
                      <button
                        onClick={() => deleteMessage(msg.id, username)}
                        className="text-xs text-gray-300 hover:text-white mt-1"
                      >
                        Delete
                      </button>
                    )}
                  </div>
                </div>
              ))}
          </div>
          <div className="p-3 border-t">
            <div className="flex space-x-2">
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="flex-1 p-2 border rounded"
                placeholder="Type a message..."
                onKeyPress={(e) => e.key === "Enter" && handleSend()}
              />
              <button
                onClick={handleSend}
                className="bg-indigo-600 text-white px-4 rounded hover:bg-indigo-700"
              >
                Send
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
