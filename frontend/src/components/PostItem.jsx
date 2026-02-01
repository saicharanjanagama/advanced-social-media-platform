import React, { useState, useRef, useEffect } from "react";
import styled from "styled-components";
import api from "../services/api";
import { useNavigate } from "react-router-dom";

/* ======================
   STYLED COMPONENTS
====================== */

const Card = styled.div`
  background: white;
  border-radius: 18px;
  padding: 16px;
  box-shadow: 0 12px 30px -15px rgba(0,0,0,0.15);
  margin-bottom: 16px;

  @media (max-width: 600px) {
    padding: 14px;
    border-radius: 14px;
  }
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const HeaderRight = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  position: relative;
`;

const Author = styled.div`
  font-weight: 600;
  font-size: 0.95rem;
`;

const Timestamp = styled.small`
  color: #64748b;
  font-size: 0.75rem;
`;

const MenuButton = styled.button`
  background: none;
  border: none;
  font-size: 1.1rem;
  cursor: pointer;
  padding: 4px;
  border-radius: 50%;

  &:hover {
    background: #f1f5f9;
  }
`;

const Dropdown = styled.div`
  position: absolute;
  top: 22px;
  right: 0;
  background: white;
  border-radius: 10px;
  box-shadow: 0 12px 25px rgba(0,0,0,0.15);
  overflow: hidden;
  z-index: 10;
`;

const DropdownItem = styled.button`
  width: 100%;
  padding: 8px 14px;
  background: none;
  border: none;
  font-size: 0.85rem;
  text-align: left;
  cursor: pointer;

  &:hover {
    background: #f1f5f9;
  }
`;

const Content = styled.p`
  margin: 12px 0;
  line-height: 1.6;
  font-size: 0.95rem;

  @media (max-width: 600px) {
    font-size: 0.9rem;
  }
`;

const TextArea = styled.textarea`
  width: 100%;
  margin-top: 8px;
  padding: 10px;
  border-radius: 10px;
  border: 1px solid #c7d2fe;

  &:focus {
    border-color: #6366f1;
    box-shadow: 0 0 0 3px rgba(99,102,241,0.18);
  }
`;

const MediaWrapper = styled.div`
  margin-top: 10px;
  border-radius: 14px;
  overflow: hidden;
  background: #f1f5f9;

  img,
  video {
    width: 100%;
    height: auto;
    display: block;
    object-fit: cover;
  }
`;

const ActionRow = styled.div`
  display: flex;
  gap: 10px;
  margin-top: 10px;
`;

const ActionButton = styled.button`
  background: #f1f5f9;
  border: none;
  padding: 6px 12px;
  border-radius: 999px;
  font-size: 0.8rem;
  cursor: pointer;

  &:hover {
    background: #e2e8f0;
  }
`;

const Comments = styled.div`
  margin-top: 14px;
  border-top: 1px solid #e5e7eb;
  padding-top: 10px;
`;

const CommentItem = styled.div`
  font-size: 0.85rem;
  margin-bottom: 6px;

  strong {
    font-weight: 600;
  }
`;

const CommentInput = styled.input`
  width: 100%;
  padding: 8px 10px;
  border-radius: 999px;
  border: 1px solid #c7d2fe;
  font-size: 0.8rem;

  &:focus {
    border-color: #6366f1;
  }
`;

/* ======================
   COMPONENT
====================== */

const PostItem = ({
  post,
  user,
  editingId,
  editText,
  setEditText,
  startEdit,
  cancelEdit,
  saveEdit,
  handleDelete,
  handleLike,
  addComment,
  renderMedia
}) => {
  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);
  const navigate = useNavigate();

  /* Close dropdown on outside click */
  useEffect(() => {
    const close = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);

  return (
    <Card>
      <Header>
        <Author>{post.user?.name}</Author>

        <HeaderRight ref={menuRef}>
          <Timestamp>
            {new Date(post.createdAt).toLocaleString()}
          </Timestamp>

          <MenuButton onClick={() => setOpen((p) => !p)}>
            ⋮
          </MenuButton>

          {open && (
            <Dropdown>
              {/* ✏️ Edit (only owner) */}
              {user?._id === post.user?._id && (
                <DropdownItem
                  onClick={() => {
                    startEdit(post);
                    setOpen(false);
                  }}
                >
                  ✏️ Edit
                </DropdownItem>
              )}

              {/* 🗑️ Delete (only owner) */}
              {user?._id === post.user?._id && (
                <DropdownItem
                  onClick={() => {
                    handleDelete(post._id);
                    setOpen(false);
                  }}
                >
                  🗑️ Delete
                </DropdownItem>
              )}

              {/* 💬 Message (only other users) */}
              {user?._id !== post.user?._id && (
                <DropdownItem
                  onClick={async () => {
                    try {
                      const { data } = await api.post("/api/chats", {
                        userId: post.user._id
                      });
                      navigate(`/chat/${data._id}`);
                    } catch (err) {
                      console.error("Failed to start chat", err);
                    } finally {
                      setOpen(false);
                    }
                  }}
                >
                  💬 Message
                </DropdownItem>
              )}
            </Dropdown>
          )}
        </HeaderRight>
      </Header>

      {/* ✏️ Edit Mode */}
      {editingId === post._id ? (
        <>
          <TextArea
            value={editText}
            onChange={(e) => setEditText(e.target.value)}
          />
          <ActionRow>
            <ActionButton onClick={() => saveEdit(post._id)}>
              💾 Save
            </ActionButton>
            <ActionButton onClick={cancelEdit}>
              ❌ Cancel
            </ActionButton>
          </ActionRow>
        </>
      ) : (
        post.content && <Content>{post.content}</Content>
      )}

      {/* 📎 Media */}
      {post.media && (
        <MediaWrapper>
          {renderMedia(post.media)}
        </MediaWrapper>
      )}

      {/* ❤️ Like */}
      <ActionRow>
        <ActionButton onClick={() => handleLike(post._id)}>
          ❤️ {post.likes?.length || 0}
        </ActionButton>
      </ActionRow>

      {/* 💬 Comments */}
      <Comments>
        {post.comments?.map((c, i) => (
          <CommentItem key={i}>
            <strong>{c.user?.name}:</strong> {c.text}
          </CommentItem>
        ))}

        <CommentInput
          placeholder="Add a comment…"
          onKeyDown={(e) => {
            if (e.key === "Enter" && e.target.value.trim()) {
              addComment(post._id, e.target.value);
              e.target.value = "";
            }
          }}
        />
      </Comments>
    </Card>
  );
};

export default React.memo(PostItem);
