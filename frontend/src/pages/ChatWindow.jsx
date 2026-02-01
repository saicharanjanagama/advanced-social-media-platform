import { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import styled from "styled-components";
import api from "../services/api";
import { useSocket } from "../hooks/useSocket";
import { useAuth } from "../context/AuthContext";

const ChatWindow = () => {
  const { chatId } = useParams();
  const navigate = useNavigate();
  const socket = useSocket();
  const { user } = useAuth();

  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  const bottomRef = useRef(null);

  /* ---------- Fetch messages ---------- */
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const { data } = await api.get(`/api/messages/${chatId}`);
        setMessages(data);
      } catch (err) {
        console.error("Failed to fetch messages", err);
      }
    };

    fetchMessages();
  }, [chatId]);

  /* ---------- Auto scroll ---------- */
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  /* ---------- Socket handlers ---------- */
  useEffect(() => {
    if (!socket) return;

    socket.emit("join-chat", chatId);

    const onNewMessage = (msg) => {
      // 🚫 Ignore own socket echo
      if (msg.sender._id === user._id) return;

      setMessages((prev) => [...prev, msg]);
    };

    const onTyping = ({ isTyping }) => {
      setIsTyping(isTyping);
    };

    socket.on("new-message", onNewMessage);
    socket.on("user-typing", onTyping);

    return () => {
      socket.off("new-message", onNewMessage);
      socket.off("user-typing", onTyping);
    };
  }, [socket, chatId, user._id]);

  /* ---------- Send message ---------- */
  const sendMessage = async () => {
    if (!text.trim()) return;

    try {
      const { data } = await api.post("/api/messages", {
        chatId,
        text
      });

      // ✅ optimistic add (only once)
      setMessages((prev) => [...prev, data]);
      setText("");

      socket.emit("typing", {
        chatId,
        isTyping: false
      });
    } catch (err) {
      console.error("Send message failed", err);
    }
  };

  return (
    <Wrapper>
      {/* HEADER */}
      <Header>
        <BackButton onClick={() => navigate(-1)}>← Back</BackButton>
        <Title>💬 Chat</Title>
      </Header>

      {/* MESSAGES */}
      <Messages>
        {messages.length === 0 && (
          <EmptyText>No messages yet. Say hi 👋</EmptyText>
        )}

        {messages.map((m) => (
          <Bubble key={m._id} mine={m.sender._id === user._id}>
            {m.text}
          </Bubble>
        ))}

        <div ref={bottomRef} />
      </Messages>

      {isTyping && <TypingText>Typing…</TypingText>}

      {/* INPUT */}
      <InputRow>
        <Input
          value={text}
          onChange={(e) => {
            setText(e.target.value);
            socket.emit("typing", {
              chatId,
              isTyping: true
            });
          }}
          onBlur={() =>
            socket.emit("typing", {
              chatId,
              isTyping: false
            })
          }
          placeholder="Type a message..."
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        />
        <Send onClick={sendMessage}>Send</Send>
      </InputRow>
    </Wrapper>
  );
};

export default ChatWindow;

/* ====================== STYLES ====================== */

const Wrapper = styled.div`
  max-width: 640px;
  margin: 20px auto;
  height: 80vh;
  display: flex;
  flex-direction: column;
  background: white;
  border-radius: 18px;
  box-shadow: 0 20px 40px -20px rgba(0,0,0,0.2);
  overflow: hidden;

  @media (max-width: 720px) {
    height: 100vh;
    margin: 0;
    border-radius: 0;
  }
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px 18px;
  background: #0f172a;
  color: white;
`;

const Title = styled.h3`
  margin: 0;
  font-size: 1rem;
`;

const BackButton = styled.button`
  background: none;
  border: none;
  color: white;
  font-size: 0.9rem;
  cursor: pointer;
`;

const Messages = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 14px;
  display: flex;
  flex-direction: column;
  background: #f8fafc;
`;

const Bubble = styled.div`
  max-width: 70%;
  padding: 10px 14px;
  margin-bottom: 8px;
  border-radius: 16px;
  font-size: 0.9rem;
  line-height: 1.4;

  background: ${({ mine }) => (mine ? "#4f46e5" : "#e5e7eb")};
  color: ${({ mine }) => (mine ? "white" : "black")};
  align-self: ${({ mine }) => (mine ? "flex-end" : "flex-start")};

  @media (max-width: 600px) {
    max-width: 85%;
    font-size: 0.85rem;
  }
`;

const InputRow = styled.div`
  display: flex;
  gap: 8px;
  padding: 12px;
  border-top: 1px solid #e5e7eb;

  @media (max-width: 600px) {
    gap: 6px;
  }
`;

const Input = styled.input`
  flex: 1;
  padding: 10px 14px;
  border-radius: 999px;
  border: 1px solid #c7d2fe;
  outline: none;

  &:focus {
    border-color: #6366f1;
  }
`;

const Send = styled.button`
  padding: 10px 18px;
  border-radius: 999px;
  border: none;
  background: #4f46e5;
  color: white;
  cursor: pointer;

  &:hover {
    background: #4338ca;
  }
`;

const TypingText = styled.small`
  font-size: 0.75rem;
  color: #64748b;
  padding: 6px 12px;
  background: #e5e7eb;
  border-radius: 999px;
  align-self: flex-start;
  margin: 6px 12px;
`;

const EmptyText = styled.p`
  text-align: center;
  color: #94a3b8;
  margin-top: 20px;
`;
