import { useState } from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { useAuth } from "../context/AuthContext";

const Register = () => {
  const { register } = useAuth();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await register(form.name, form.email, form.password);
    } catch {
      setError("Registration failed. Try again.");
    }
  };

  return (
    <Wrapper>
      <Form onSubmit={submit}>
        <Title>Create Account</Title>
        <SubText>Join the community 🚀</SubText>

        {error && <ErrorText>{error}</ErrorText>}

        <Input
          placeholder="Full name"
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          required
        />

        <Input
          type="email"
          placeholder="Email address"
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          required
        />

        <Input
          type="password"
          placeholder="Password"
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          required
        />

        <SubmitBtn>Create Account</SubmitBtn>

        <FooterText>
          Already have an account? <Link to="/">Login</Link>
        </FooterText>
      </Form>
    </Wrapper>
  );
};

export default Register;

/* ======================
   STYLES
====================== */

const Wrapper = styled.div`
  min-height: 90vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
`;

const Form = styled.form`
  width: 100%;
  max-width: 420px;
  background: white;
  padding: 2.6rem;
  border-radius: 22px;
  box-shadow: 0 30px 50px -20px rgba(0, 0, 0, 0.15);
  animation: slideUp 0.35s ease;

  @keyframes slideUp {
    from {
      opacity: 0;
      transform: translateY(12px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

const Title = styled.h2`
  font-size: 1.6rem;
  font-weight: 700;
  margin-bottom: 0.35rem;
`;

const SubText = styled.p`
  color: #64748b;
  margin-bottom: 1.6rem;
  font-size: 0.9rem;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.75rem;
  margin-bottom: 1.15rem;
  border-radius: 10px;
  border: 1px solid #c7d2fe;
  font-size: 0.9rem;
  transition: all 0.2s ease;

  &:focus {
    border-color: #6366f1;
    box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.18);
  }
`;

const SubmitBtn = styled.button`
  width: 100%;
  padding: 0.7rem;
  margin-top: 0.4rem;
  background: linear-gradient(135deg, #4f46e5, #6366f1);
  color: white;
  border: none;
  border-radius: 999px;
  font-size: 0.95rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.25s ease;

  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 15px 30px rgba(79, 70, 229, 0.35);
  }
`;

const ErrorText = styled.p`
  color: #dc2626;
  font-size: 0.85rem;
  margin-bottom: 0.8rem;
`;

const FooterText = styled.p`
  margin-top: 1.6rem;
  text-align: center;
  font-size: 0.85rem;
  color: #475569;

  a {
    color: #4f46e5;
    font-weight: 500;
    text-decoration: none;

    &:hover {
      text-decoration: underline;
    }
  }
`;
