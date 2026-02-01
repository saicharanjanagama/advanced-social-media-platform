import { useState } from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { useAuth } from "../context/AuthContext";

const Login = () => {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await login(email, password);
    } catch (err) {
      setError(err?.response?.data?.message || "Invalid credentials");
    }
  };

  return (
    <Wrapper>
      <Form onSubmit={submit}>
        <h2>Welcome Back</h2>
        <SubText>Login to continue</SubText>

        {error && <ErrorText>{error}</ErrorText>}

        <input
          type="email"
          placeholder="Email address"
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Password"
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button>Login</button>

        <FooterText>
          Don’t have an account? <Link to="/register">Register</Link>
        </FooterText>
      </Form>
    </Wrapper>
  );
};

export default Login;

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
  padding: 2.4rem;
  border-radius: 22px;
  box-shadow: 0 30px 50px -20px rgba(0,0,0,0.15);
  animation: fadeUp 0.4s ease;

  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
  }

  h2 {
    font-size: 1.6rem;
    margin-bottom: 0.4rem;
  }

  input {
    width: 100%;
    padding: 0.75rem;
    margin-bottom: 1.1rem;
    border-radius: 10px;
    border: 1px solid #c7d2fe;

    &:focus {
      border-color: #6366f1;
      box-shadow: 0 0 0 3px rgba(99,102,241,0.18);
    }
  }

  button {
    width: 100%;
    padding: 0.7rem;
    background: linear-gradient(135deg, #4f46e5, #6366f1);
    color: white;
    border: none;
    border-radius: 999px;
    cursor: pointer;

    &:hover {
      transform: translateY(-1px);
      box-shadow: 0 15px 30px rgba(79,70,229,0.35);
    }
  }

  @media (max-width: 500px) {
    padding: 1.8rem 1.4rem;
    border-radius: 16px;
  }

  h2 {
    font-size: 1.6rem;

    @media (max-width: 500px) {
      font-size: 1.4rem;
    }
  }
`;

const SubText = styled.p`
  color: #64748b;
  margin-bottom: 1.6rem;
`;

const ErrorText = styled.p`
  color: #dc2626;
  font-size: 0.85rem;
  margin-bottom: 0.8rem;
`;

const FooterText = styled.p`
  margin-top: 1.4rem;
  text-align: center;
  font-size: 0.85rem;

  a {
    color: #4f46e5;
    text-decoration: none;
    font-weight: 500;
  }
`;
