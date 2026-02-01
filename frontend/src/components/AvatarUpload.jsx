import { useRef, useState } from "react";
import styled from "styled-components";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";

/* ======================
   STYLES
====================== */
const HiddenInput = styled.input`
  display: none;
`;

const StatusText = styled.small`
  display: block;
  margin-top: 6px;
  color: #64748b;
  font-size: 0.75rem;
`;

/* ======================
   COMPONENT
====================== */
const AvatarUpload = ({ onTrigger }) => {
  const { updateAvatar } = useAuth();
  const [loading, setLoading] = useState(false);
  const fileRef = useRef(null);

  // expose trigger to parent
  const openPicker = () => {
    if (fileRef.current && !loading) {
      fileRef.current.click();
    }
  };

  // allow parent to trigger click
  if (onTrigger) onTrigger(openPicker);

  const upload = async (file) => {
    if (!file) return;

    const formData = new FormData();
    formData.append("avatar", file);

    setLoading(true);
    try {
      const { data } = await api.put("/api/users/avatar", formData);
      updateAvatar(data.avatar); // updates context immediately
    } catch (err) {
      console.error("Avatar upload failed", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <HiddenInput
        ref={fileRef}
        type="file"
        accept="image/*"
        onChange={(e) => upload(e.target.files[0])}
      />

      {loading && <StatusText>Uploading...</StatusText>}
    </>
  );
};

export default AvatarUpload;
