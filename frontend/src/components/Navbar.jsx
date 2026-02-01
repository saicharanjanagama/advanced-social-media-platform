import { Link, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { useAuth } from "../context/AuthContext";
import { useNotifications } from "../context/NotificationContext";
import { useState } from "react";

const Navbar = () => {
  const { user, logout } = useAuth();
  const { notifications, clearNotifications } = useNotifications();
  const navigate = useNavigate();

  const [open, setOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const handleNotificationClick = (notif) => {
    setOpen(false);
    clearNotifications();

    if (notif.type === "message") {
      navigate(`/chat/${notif.chatId}`);
    } else {
      navigate("/feed");
    }
  };

  return (
    <Nav>
      <Brand>
        <Logo>🚀</Logo>
        SocialApp
      </Brand>

      <NavLinks>
        {!user ? (
          <>
            <NavLink to="/">Login</NavLink>
            <PrimaryLink to="/register">Register</PrimaryLink>
          </>
        ) : (
          <>
            {/* 🔔 NOTIFICATIONS */}
            <NotificationWrapper>
              <Bell onClick={() => setOpen((p) => !p)}>🔔</Bell>

              {notifications.length > 0 && (
                <Badge>{notifications.length}</Badge>
              )}

              {open && (
                <Dropdown>
                  {notifications.length === 0 && (
                    <Empty>No notifications</Empty>
                  )}

                  {notifications.map((n, i) => (
                    <NotifItem
                      key={i}
                      onClick={() => handleNotificationClick(n)}
                    >
                      {n.type === "like" && "❤️ Someone liked your post"}
                      {n.type === "comment" && "💬 New comment on your post"}
                      {n.type === "message" && "📩 New message"}
                    </NotifItem>
                  ))}
                </Dropdown>
              )}
            </NotificationWrapper>

            {/* 💬 CHATS */}
            <ChatLink to="/chats">💬</ChatLink>

            <UserBadge>👋 {user.name}</UserBadge>
            <LogoutBtn onClick={handleLogout}>Logout</LogoutBtn>
          </>
        )}
      </NavLinks>
    </Nav>
  );
};

export default Navbar;

/* ======================
   STYLES
====================== */

const Nav = styled.nav`
  background: rgba(2, 6, 23, 0.9);
  padding: 0.75rem 1.2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: sticky;
  top: 0;
  z-index: 100;
  backdrop-filter: blur(12px);

  @media (max-width: 600px) {
    padding: 0.6rem 0.8rem;
  }
`;

const Brand = styled.div`
  display: flex;
  align-items: center;
  gap: 0.45rem;
  font-weight: 800;
  font-size: 1.25rem;
  color: white;
`;

const Logo = styled.span`
  font-size: 1.35rem;
`;

const NavLinks = styled.div`
  display: flex;
  align-items: center;
  gap: 0.6rem;

  @media (max-width: 600px) {
    gap: 0.4rem;
  }
`;

const linkStyles = `
  text-decoration: none;
  font-size: 0.9rem;
  font-weight: 500;
  color: #e5e7eb;
  padding: 0.45rem 0.9rem;
  border-radius: 999px;
  transition: all 0.2s ease;

  &:hover {
    background: rgba(255,255,255,0.12);
    color: white;
  }
`;

const NavLink = styled(Link)`
  ${linkStyles}
`;

const PrimaryLink = styled(Link)`
  ${linkStyles}
  background: linear-gradient(135deg, #6366f1, #4f46e5);
  color: white;
`;

const LogoutBtn = styled.button`
  background: linear-gradient(135deg, #dc2626, #ef4444);
  border: none;
  padding: 0.45rem 1rem;
  border-radius: 999px;
  color: white;
  cursor: pointer;
`;

const UserBadge = styled.span`
  font-size: 0.9rem;
  color: #e5e7eb;
  background: rgba(255,255,255,0.08);
  padding: 0.35rem 0.8rem;
  border-radius: 999px;

  @media (max-width: 600px) {
    display: none; /* hide username on mobile */
  }
`;

const NotificationWrapper = styled.div`
  position: relative;
`;

const Bell = styled.span`
  font-size: 1.2rem;
  cursor: pointer;
`;

const Badge = styled.span`
  position: absolute;
  top: -6px;
  right: -8px;
  background: #ef4444;
  color: white;
  border-radius: 999px;
  padding: 2px 6px;
  font-size: 0.65rem;
  font-weight: 700;
`;

const Dropdown = styled.div`
  position: absolute;
  top: 36px;
  right: 0;
  background: white;
  width: 260px;
  border-radius: 12px;
  box-shadow: 0 10px 25px rgba(0,0,0,0.18);
  overflow: hidden;
  z-index: 200;
`;

const NotifItem = styled.div`
  padding: 10px 14px;
  font-size: 0.85rem;
  cursor: pointer;

  &:hover {
    background: #f1f5f9;
  }
`;

const Empty = styled.p`
  padding: 12px;
  text-align: center;
  font-size: 0.8rem;
  color: #64748b;
`;

const ChatLink = styled(Link)`
  font-size: 1.1rem;
  text-decoration: none;
  padding: 6px 10px;
  border-radius: 999px;
  background: rgba(255,255,255,0.08);
  color: white;

  &:hover {
    background: rgba(255,255,255,0.18);
  }
`;
