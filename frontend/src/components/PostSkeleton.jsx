import styled, { keyframes } from "styled-components";

/* ======================
   ANIMATION
====================== */
const shimmer = keyframes`
  0% { background-position: -200px 0; }
  100% { background-position: calc(200px + 100%) 0; }
`;

/* ======================
   STYLES
====================== */
const SkeletonCard = styled.div`
  background: white;
  padding: 16px;
  border-radius: 18px;
  box-shadow: 0 12px 30px -15px rgba(0,0,0,0.12);
  margin-bottom: 16px;
`;

const SkeletonLine = styled.div`
  height: ${({ height }) => height || 12}px;
  width: ${({ width }) => width || "100%"};
  margin-bottom: ${({ mb }) => mb || 8}px;
  border-radius: 6px;
  background: linear-gradient(
    90deg,
    #f1f5f9 25%,
    #e5e7eb 37%,
    #f1f5f9 63%
  );
  background-size: 400px 100%;
  animation: ${shimmer} 1.4s ease infinite;
`;

/* ======================
   COMPONENT
====================== */
const PostSkeleton = () => {
  return (
    <SkeletonCard>
      <SkeletonLine width="40%" height={14} />
      <SkeletonLine />
      <SkeletonLine width="90%" />
      <SkeletonLine width="60%" mb={0} />
    </SkeletonCard>
  );
};

export default PostSkeleton;
