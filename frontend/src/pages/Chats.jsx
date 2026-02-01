import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";

const Chats = () => {
  const { user } = useAuth();
  const [chats, setChats] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchChats = async () => {
      try {
        const { data } = await api.get("/api/chats");
        setChats(data);
      } catch (err) {
        console.error("Failed to fetch chats", err);
      }
    };

    fetchChats();
  }, []);

  const openChat = async (otherUserId) => {
    try {
      const { data } = await api.post("/api/chats", {
        userId: otherUserId
      });

      navigate(`/chat/${data._id}`);
    } catch (err) {
      console.error("Failed to open chat", err);
    }
  };

  return (
    <Page>
      <Header>
        <Back onClick={() => navigate(-1)}>←</Back>
        <Title>Chats</Title>
      </Header>

      <List>
        {chats.length === 0 && (
          <EmptyText>No chats yet. Start a conversation 👋</EmptyText>
        )}

        {chats.map((chat) => {
          const otherUser = chat.users.find(
            (u) => u._id !== user._id
          );

          if (!otherUser) return null;

          return (
            <ChatItem
              key={chat._id}
              onClick={() => openChat(otherUser._id)}
            >
              <Avatar
                src={
                  otherUser.avatar?.url ||
                  `https://ui-avatars.com/api/?name=${otherUser.name}`
                }
              />

              <Info>
                <Name>{otherUser.name}</Name>
                {chat.latestMessage ? (
                  <LastMessage>
                    {chat.latestMessage.text.slice(0, 40)}…
                  </LastMessage>
                ) : (
                  <LastMessage muted>No messages yet</LastMessage>
                )}
              </Info>
            </ChatItem>
          );
        })}
      </List>
    </Page>
  );
};

export default Chats;

/* ====================== STYLES ====================== */

const Page = styled.div`
/* border: 2px solid red; */
  max-width: 640px;
  height: 80vh;
  margin: 20px auto;
  background: #f8fafc;
  border-radius: 18px;
  box-shadow: 0 25px 50px -25px rgba(0,0,0,0.2);
  overflow: hidden;

  @media (max-width: 600px) {
    height: calc(100vh - 60px);
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

const Back = styled.button`
  background: none;
  border: none;
  color: white;
  font-size: 1.2rem;
  cursor: pointer;
`;

const Title = styled.h3`
  margin: 0;
  font-size: 1rem;
  font-weight: 600;
`;

const List = styled.div`
  padding: 12px;
`;

const ChatItem = styled.div`
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 12px 14px;
  border-radius: 14px;
  cursor: pointer;
  background: white;
  margin-bottom: 10px;
  transition: all 0.15s ease;

  &:hover {
    background: #eef2ff;
    transform: translateY(-1px);
  }
`;

const Avatar = styled.img`
  width: 46px;
  height: 46px;
  border-radius: 50%;
  object-fit: cover;
`;

const Info = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
`;

const Name = styled.span`
  font-weight: 600;
  font-size: 0.9rem;
`;

const LastMessage = styled.small`
  color: ${({ muted }) => (muted ? "#94a3b8" : "#64748b")};
  font-size: 0.75rem;
`;

const EmptyText = styled.p`
  text-align: center;
  color: #94a3b8;
  margin-top: 40px;
  font-size: 0.85rem;
`;
