import { useEffect, useState, useCallback, useRef } from "react";
import styled from "styled-components";

import api from "../services/api";
import CreatePost from "../components/CreatePost";
import PostItem from "../components/PostItem";
import { useSocket } from "../hooks/useSocket";
import { useAuth } from "../context/AuthContext";
import ProfileSidebar from "../components/ProfileSidebar";
import PostSkeleton from "../components/PostSkeleton";

/* ======================
   STYLED COMPONENTS
====================== */

const PageWrapper = styled.div`
  background: #f8fafc;
  min-height: 100vh;
`;

const FeedContainer = styled.div`
  display: grid;
  grid-template-columns: 280px 1fr;
  max-width: 1100px;
  margin: 0 auto;
  gap: 24px;
  padding: 24px 16px;

  @media (max-width: 600px) {
    grid-template-columns: 1fr;
    gap: 16px;
    padding: 16px 12px;
  }
`;

const SidebarWrapper = styled.div`
  position: sticky;
  top: 90px;
  height: fit-content;

  @media (max-width: 600px) {
    position: static;
  }
`;

const FeedContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const FeedHeader = styled.div`
  background: white;
  padding: 16px 20px;
  border-radius: 16px;
  box-shadow: 0 10px 25px -10px rgba(0,0,0,0.12);
`;

const FeedTitle = styled.h2`
  margin: 0;
  font-size: 1.2rem;
  font-weight: 700;
`;

const Loader = styled.div`
  height: 1px;
`;

const EndText = styled.p`
  text-align: center;
  color: #64748b;
  font-size: 0.85rem;
  margin: 20px 0;
`;

/* ======================
   COMPONENT
====================== */

const Feed = () => {
  const { user } = useAuth();
  const socket = useSocket();

  const [posts, setPosts] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState("");
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);

  const postIdsRef = useRef(new Set());
  const loaderRef = useRef(null);

  /* ======================
     RESET ON LOGIN
  ====================== */
  useEffect(() => {
    if (!user) return;
    setPosts([]);
    postIdsRef.current.clear();
    setPage(1);
    setHasMore(true);
  }, [user]);

  /* ======================
     FETCH POSTS
  ====================== */
  const fetchPosts = useCallback(async () => {
    if (!user || loading || !hasMore) return;

    setLoading(true);
    try {
      const { data } = await api.get(
        `/api/posts?page=${page}&limit=5`
      );

      const unique = data.posts.filter((p) => {
        if (postIdsRef.current.has(p._id)) return false;
        postIdsRef.current.add(p._id);
        return true;
      });

      setPosts((prev) => [...prev, ...unique]);

      page >= data.totalPages
        ? setHasMore(false)
        : setPage((p) => p + 1);
    } catch (err) {
      console.error("Fetch failed", err);
    } finally {
      setLoading(false);
    }
  }, [user, page, hasMore, loading]);

  useEffect(() => {
    if (user) fetchPosts();
  }, [user, fetchPosts]);

  /* ======================
     INFINITE SCROLL
  ====================== */
  useEffect(() => {
    if (!hasMore || loading) return;

    const observer = new IntersectionObserver(
      ([entry]) => entry.isIntersecting && fetchPosts(),
      { threshold: 0.5 }
    );

    if (loaderRef.current) observer.observe(loaderRef.current);
    return () => observer.disconnect();
  }, [fetchPosts, hasMore, loading]);

  /* ======================
     SOCKET EVENTS (OTHER USERS ONLY)
  ====================== */
 /* ======================
   SOCKET EVENTS (SAFE)
====================== */
/* ======================
   SOCKET EVENTS + RESYNC
====================== */
useEffect(() => {
  if (!socket || !user) return;

  const onNewPost = ({ authorId }) => {
  if (authorId === user._id) return;

  console.log("🆕 Feed changed → requesting resync");
  socket.emit("resync-feed");
};



  const onLike = ({ postId, likesCount }) => {
    setPosts((prev) =>
      prev.map((p) =>
        p._id === postId ? { ...p, likes: Array(likesCount) } : p
      )
    );
  };

  const onUpdate = ({ post, actorId }) => {
  // 🚫 ignore self update (already optimistic)
  if (actorId === user._id) return;

  setPosts(prev =>
    prev.map(p => (p._id === post._id ? post : p))
  );
};


  const onDelete = ({ postId }) => {
    postIdsRef.current.delete(postId);
    setPosts((prev) => prev.filter((p) => p._id !== postId));
  };

  const onComment = ({ postId, comments }) => {
    setPosts((prev) =>
      prev.map((p) =>
        p._id === postId ? { ...p, comments } : p
      )
    );
  };

  const onResync = async () => {
    console.log("🔄 Resyncing feed");

    const { data } = await api.get("/api/posts?page=1&limit=5");

    postIdsRef.current.clear();
    data.posts.forEach((p) => postIdsRef.current.add(p._id));

    setPosts(data.posts);
    setPage(2);
    setHasMore(true);
  };

  socket.on("new-post", onNewPost);
  socket.on("post-liked", onLike);
  socket.on("post-updated", onUpdate);
  socket.on("post-deleted", onDelete);
  socket.on("comment-added", onComment);
  socket.on("resync-required", onResync);

  return () => {
    socket.off("new-post", onNewPost);
    socket.off("post-liked", onLike);
    socket.off("post-updated", onUpdate);
    socket.off("post-deleted", onDelete);
    socket.off("comment-added", onComment);
    socket.off("resync-required", onResync);
  };
}, [socket, user]);






  /* ======================
     UI
  ====================== */
  return (
    <PageWrapper>
      <FeedContainer>
        <SidebarWrapper>
          <ProfileSidebar />
        </SidebarWrapper>

        <FeedContent>
          <FeedHeader>
            <FeedTitle>📰 Live Feed</FeedTitle>
          </FeedHeader>

          {/* OPTIMISTIC CREATE */}
          <CreatePost
            onPostCreated={(post) => {
              setPosts((prev) => [post, ...prev]);
              postIdsRef.current.add(post._id);
            }}
          />

          {posts.map((post) => (
            <PostItem
              key={post._id}
              post={post}
              user={user}
              editingId={editingId}
              editText={editText}
              setEditText={setEditText}
              startEdit={(p) => {
                setEditingId(p._id);
                setEditText(p.content || "");
              }}
              cancelEdit={() => {
                setEditingId(null);
                setEditText("");
              }}
              saveEdit={async (id) => {
                setPosts((prev) =>
                  prev.map((p) =>
                    p._id === id ? { ...p, content: editText } : p
                  )
                );
                setEditingId(null);
                await api.put(`/api/posts/${id}`, { content: editText });
              }}
              handleDelete={async (id) => {
                if (!window.confirm("Delete post?")) return;
                setPosts((prev) => prev.filter((p) => p._id !== id));
                postIdsRef.current.delete(id);
                await api.delete(`/api/posts/${id}`);
              }}
              handleLike={async (id) => {
                setPosts((prev) =>
                  prev.map((p) =>
                    p._id === id
                      ? {
                          ...p,
                          likes: p.likes.includes(user._id)
                            ? p.likes.filter((l) => l !== user._id)
                            : [...p.likes, user._id]
                        }
                      : p
                  )
                );
                await api.put(`/api/posts/${id}/like`);
              }}
              addComment={async (id, text) => {
                const optimisticComment = {
                  _id: Date.now(),
                  text,
                  user: { _id: user._id, name: user.name },
                  createdAt: new Date()
                };

                setPosts((prev) =>
                  prev.map((p) =>
                    p._id === id
                      ? { ...p, comments: [optimisticComment, ...p.comments] }
                      : p
                  )
                );

                await api.post(`/api/posts/${id}/comments`, { text });
              }}
              renderMedia={(media) =>
                media?.url ? <img src={media.url} alt="" width="100%" /> : null
              }
            />
          ))}

          {loading && <PostSkeleton />}
          <Loader ref={loaderRef} />
          {!hasMore && <EndText>No more posts 🎉</EndText>}
        </FeedContent>
      </FeedContainer>
    </PageWrapper>
  );
};

export default Feed;
