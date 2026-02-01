import { useState } from "react";
import styled from "styled-components";
import api from "../services/api";

/* ======================
   STYLED COMPONENTS
====================== */

const Form = styled.form`
  background: white;
  padding: 16px;
  border-radius: 16px;
  box-shadow: 0 12px 25px -12px rgba(0,0,0,0.15);
  margin-bottom: 16px;
`;

const TextArea = styled.textarea`
  width: 100%;
  min-height: 90px;
  resize: none;
  padding: 12px 14px;
  border-radius: 12px;
  border: 1px solid #c7d2fe;
  font-size: 0.9rem;
  transition: all 0.2s ease;

  &:focus {
    border-color: #6366f1;
    box-shadow: 0 0 0 3px rgba(99,102,241,0.18);
  }
`;

const ActionsRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 10px;
`;

const FileInput = styled.input`
  font-size: 0.8rem;

  &::file-selector-button {
    padding: 6px 12px;
    border-radius: 999px;
    border: none;
    background: #eef2ff;
    color: #4f46e5;
    font-weight: 500;
    cursor: pointer;
    transition: background 0.2s ease;
  }

  &::file-selector-button:hover {
    background: #e0e7ff;
  }
`;

const SubmitButton = styled.button`
  padding: 8px 18px;
  border-radius: 999px;
  border: none;
  background: linear-gradient(135deg, #4f46e5, #6366f1);
  color: white;
  font-size: 0.85rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.25s ease;

  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 10px 25px rgba(79,70,229,0.35);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
  }
`;

const PreviewWrapper = styled.div`
  position: relative;
  margin-top: 12px;
`;

const Preview = styled.img`
  width: 100%;
  border-radius: 12px;
`;

const RemoveButton = styled.button`
  position: absolute;
  top: 8px;
  right: 8px;
  background: rgba(0,0,0,0.65);
  border: none;
  color: white;
  border-radius: 999px;
  padding: 4px 8px;
  cursor: pointer;
  font-size: 0.75rem;
`;

const ProgressText = styled.small`
  display: block;
  margin-top: 6px;
  color: #64748b;
  font-size: 0.75rem;
`;

/* ======================
   COMPONENT
====================== */

const CreatePost = ({ onPostCreated }) => {
  const [content, setContent] = useState("");
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    if (!selected) return;
    setFile(selected);
    setPreview(URL.createObjectURL(selected));
  };

  const removeFile = () => {
    setFile(null);
    setPreview(null);
  };

  const submit = async (e) => {
    e.preventDefault();
    if (!content && !file) return;

    const formData = new FormData();
    formData.append("content", content);
    if (file) formData.append("image", file);

    setLoading(true);
    setProgress(0);

    try {
      const { data } = await api.post("/api/posts", formData, {
        onUploadProgress: (e) => {
          if (!e.total) return;
          setProgress(Math.round((e.loaded * 100) / e.total));
        }
      });

      onPostCreated?.(data);

      setContent("");
      setFile(null);
      setPreview(null);
      setProgress(0);
    } catch (err) {
      console.error("Post failed", err.response?.data || err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form onSubmit={submit}>
      <TextArea
        placeholder="What's on your mind?"
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />

      {preview && (
        <PreviewWrapper>
          <Preview src={preview} alt="preview" />
          <RemoveButton type="button" onClick={removeFile}>
            ✕
          </RemoveButton>
        </PreviewWrapper>
      )}

      <ActionsRow>
        <FileInput
          type="file"
          accept="image/*,video/*"
          onChange={handleFileChange}
        />

        <SubmitButton disabled={loading}>
          {loading ? "Posting..." : "Post"}
        </SubmitButton>
      </ActionsRow>

      {loading && <ProgressText>{progress}% uploaded</ProgressText>}
    </Form>
  );
};

export default CreatePost;
