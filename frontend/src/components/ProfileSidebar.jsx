import styled from "styled-components";
import { useRef } from "react";
import { useAuth } from "../context/AuthContext";
import AvatarUpload from "./AvatarUpload";

/* ======================
   STYLES
====================== */
const Sidebar = styled.div`
  background: white;
  padding: 20px;
  border-radius: 18px;
  box-shadow: 0 12px 30px -15px rgba(0,0,0,0.15);
  text-align: center;

  @media (max-width: 720px) {
    display: flex;
    align-items: center;
    gap: 14px;
    padding: 14px 16px;
    text-align: left;
    border-radius: 14px;
  }
`;


const AvatarWrapper = styled.div`
  position: relative;
  width: 96px;
  height: 96px;
  margin: 0 auto 12px;
  cursor: pointer;

  &:hover::after {
    content: "Change";
    position: absolute;
    inset: 0;
    background: rgba(0,0,0,0.45);
    color: white;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    font-size: 0.75rem;
    font-weight: 500;
  }

  @media (max-width: 600px) {
    width: 64px;
    height: 64px;
    margin: 0; /* 🔥 IMPORTANT */
    flex-shrink: 0;
  }
`;


const Avatar = styled.img`
  width: 100%;
  height: 100%;
  border-radius: 50%;
  object-fit: cover;
`;

const Info = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
`;


const Name = styled.h4`
  margin: 10px 0 2px;
  font-weight: 600;
  font-size: 0.95rem;

  @media (max-width: 600px) {
    margin-bottom: -10px;
    font-size: 0.9rem;
  }
`;

const Email = styled.p`
  font-size: 0.85rem;
  color: #64748b;

  @media (max-width: 600px) {
    font-size: 0.75rem;
  }
`;


const LogoutButton = styled.button`
  margin-top: 14px;
  width: 100%;
  padding: 8px 0;
  border-radius: 999px;
  background: #f1f5f9;
  font-size: 0.85rem;

  &:hover {
    background: #e2e8f0;
  }

  @media (max-width: 600px) {
    display: none;
  }
`;

/* ======================
   COMPONENT
====================== */
const ProfileSidebar = () => {
  const { user, logout } = useAuth();
  const triggerRef = useRef(null);

  if (!user) return null;

  const fallbackAvatar =
    "https://ui-avatars.com/api/?name=" +
    encodeURIComponent(user.name);

  return (
    <Sidebar>
      <AvatarWrapper onClick={() => triggerRef.current?.()}>
        <Avatar src={user.avatar?.url || fallbackAvatar} alt="avatar" />
      </AvatarWrapper>

      {/* Hidden uploader */}
      <AvatarUpload onTrigger={(fn) => (triggerRef.current = fn)} />

      <Info>
        <Name>{user.name}</Name>
        <Email>{user.email}</Email>
      </Info>

      <LogoutButton onClick={logout}>Logout</LogoutButton>
    </Sidebar>
  );
};

export default ProfileSidebar;
