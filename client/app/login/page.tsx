"use client";

import Image from "next/image";
import { useState } from "react";

const usuarioMock = {
  email: "admin@liacli.com",
  senha: "123456",
};

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");
  const [sucesso, setSucesso] = useState("");
  const [mostrarSenha, setMostrarSenha] = useState(false);

  const handleLogin = () => {
    if (!email || !senha) {
      setErro("Preencha e-mail e senha.");
      setSucesso("");
      return;
    }

    if (email === usuarioMock.email && senha === usuarioMock.senha) {
      console.log("Login realizado");
      setErro("");
      setSucesso("Login realizado com sucesso!");
    } else {
      setErro("E-mail ou senha inválidos");
      setSucesso("");
    }
  };

  return (
    <main
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "24px",
        background:
          "radial-gradient(circle at top left, rgba(37,99,235,0.35), transparent 30%), radial-gradient(circle at bottom right, rgba(59,130,246,0.25), transparent 30%), linear-gradient(135deg, #071428 0%, #0b1f3a 45%, #13294b 100%)",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "430px",
          background: "rgba(255, 255, 255, 0.10)",
          border: "1px solid rgba(255, 255, 255, 0.18)",
          borderRadius: "28px",
          padding: "36px 30px",
          boxShadow: "0 20px 60px rgba(0, 0, 0, 0.35)",
          backdropFilter: "blur(18px)",
          WebkitBackdropFilter: "blur(18px)",
          color: "#ffffff",
        }}
      >
        <div style={{ textAlign: "center", marginBottom: "28px" }}>
          <div
            style={{
              width: "96px",
              height: "96px",
              margin: "0 auto 16px",
              borderRadius: "50%",
              background: "rgba(255,255,255,0.10)",
              border: "1px solid rgba(255,255,255,0.16)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              overflow: "hidden",
            }}
          >
            <Image
              src="/icons/funcionario-novo.png"
              alt="Ícone de funcionário"
              width={58}
              height={58}
              style={{
                objectFit: "contain",
              }}
            />
          </div>

          <h1
            style={{
              margin: 0,
              fontSize: "20px",
              fontWeight: 700,
              lineHeight: 1.2,
            }}
          >
            Login do Funcionário
          </h1>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
          <div>
            <label
              htmlFor="email"
              style={{
                display: "block",
                marginBottom: "8px",
                fontSize: "14px",
                color: "rgba(255,255,255,0.92)",
              }}
            >
              E-mail
            </label>

            <input
              id="email"
              type="email"
              placeholder="Digite seu e-mail"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setErro("");
                setSucesso("");
              }}
              style={{
                width: "100%",
                padding: "15px 16px",
                borderRadius: "16px",
                border: "1px solid rgba(255,255,255,0.14)",
                background: "rgba(255,255,255,0.12)",
                color: "#fff",
                outline: "none",
                fontSize: "15px",
              }}
            />
          </div>

          <div>
            <label
              htmlFor="senha"
              style={{
                display: "block",
                marginBottom: "8px",
                fontSize: "14px",
                color: "rgba(255,255,255,0.92)",
              }}
            >
              Senha
            </label>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                width: "100%",
                padding: "10px 12px",
                borderRadius: "16px",
                border: "1px solid rgba(255,255,255,0.14)",
                background: "rgba(255,255,255,0.12)",
                gap: "8px",
              }}
            >
              <input
                id="senha"
                type={mostrarSenha ? "text" : "password"}
                placeholder="Digite sua senha"
                value={senha}
                onChange={(e) => {
                  setSenha(e.target.value);
                  setErro("");
                  setSucesso("");
                }}
                style={{
                  flex: 1,
                  border: "none",
                  background: "transparent",
                  color: "#fff",
                  outline: "none",
                  fontSize: "15px",
                  padding: "5px 4px",
                }}
              />

              <button
                type="button"
                onClick={() => setMostrarSenha(!mostrarSenha)}
                aria-label={mostrarSenha ? "Ocultar senha" : "Mostrar senha"}
                title={mostrarSenha ? "Ocultar senha" : "Mostrar senha"}
                style={{
                  border: "none",
                  background: "transparent",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: "4px",
                  minWidth: "32px",
                  minHeight: "32px",
                }}
              >
                <Image
                  src="/icons/senha.png"
                  alt="Mostrar senha"
                  width={20}
                  height={20}
                  style={{
                    opacity: mostrarSenha ? 1 : 0.75,
                    objectFit: "contain",
                  }}
                />
              </button>
            </div>

            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                marginTop: "10px",
              }}
            >
              <button
                type="button"
                style={{
                  border: "none",
                  background: "transparent",
                  color: "rgba(255,255,255,0.72)",
                  fontSize: "13px",
                  cursor: "pointer",
                  padding: 0,
                }}
              >
                Esqueceu sua senha?
              </button>
            </div>
          </div>

          {erro && (
            <div
              style={{
                color: "#fecaca",
                background: "rgba(127, 29, 29, 0.35)",
                border: "1px solid rgba(252, 165, 165, 0.30)",
                padding: "12px 14px",
                borderRadius: "14px",
                fontSize: "14px",
              }}
            >
              {erro}
            </div>
          )}

          {sucesso && (
            <div
              style={{
                color: "#dcfce7",
                background: "rgba(20, 83, 45, 0.45)",
                border: "1px solid rgba(134, 239, 172, 0.35)",
                padding: "12px 14px",
                borderRadius: "14px",
                fontSize: "14px",
              }}
            >
              {sucesso}
            </div>
          )}

          <button
            type="button"
            onClick={handleLogin}
            style={{
              width: "100%",
              padding: "15px",
              borderRadius: "16px",
              border: "none",
              background: "linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)",
              color: "#fff",
              fontWeight: 700,
              fontSize: "16px",
              cursor: "pointer",
              boxShadow: "0 14px 30px rgba(37, 99, 235, 0.35)",
            }}
          >
            Entrar
          </button>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              margin: "6px 0",
            }}
          >
            <div
              style={{
                flex: 1,
                height: "1px",
                background: "rgba(255,255,255,0.15)",
              }}
            />
            <span
              style={{
                fontSize: "13px",
                color: "rgba(255,255,255,0.65)",
              }}
            >
              ou acesse com
            </span>
            <div
              style={{
                flex: 1,
                height: "1px",
                background: "rgba(255,255,255,0.15)",
              }}
            />
          </div>

          <div
            style={{
              display: "flex",
              justifyContent: "center",
              gap: "14px",
            }}
          >
            <button
              type="button"
              style={{
                width: "56px",
                height: "56px",
                borderRadius: "16px",
                border: "1px solid rgba(255,255,255,0.14)",
                background: "rgba(255,255,255,0.10)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
              }}
            >
              <Image
                src="/icons/google.png"
                alt="Google"
                width={28}
                height={28}
                style={{ objectFit: "contain" }}
              />
            </button>

            <button
              type="button"
              style={{
                width: "56px",
                height: "56px",
                borderRadius: "16px",
                border: "1px solid rgba(255,255,255,0.14)",
                background: "rgba(255,255,255,0.10)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
              }}
            >
              <Image
                src="/icons/github.png"
                alt="GitHub"
                width={28}
                height={28}
                style={{ objectFit: "contain" }}
              />
            </button>

            <button
              type="button"
              style={{
                width: "56px",
                height: "56px",
                borderRadius: "16px",
                border: "1px solid rgba(255,255,255,0.14)",
                background: "rgba(255,255,255,0.10)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
              }}
            >
              <Image
                src="/icons/facebook.png"
                alt="Facebook"
                width={28}
                height={28}
                style={{ objectFit: "contain" }}
              />
            </button>
          </div>

          <div
            style={{
              marginTop: "6px",
              textAlign: "center",
              fontSize: "14px",
              color: "rgba(255,255,255,0.75)",
            }}
          >
            Ainda não tem uma conta?{" "}
            <span
              style={{
                color: "#93c5fd",
                fontWeight: 700,
                cursor: "pointer",
              }}
            >
              Registre-se grátis
            </span>
          </div>

          <div
            style={{
              marginTop: "4px",
              textAlign: "center",
              fontSize: "13px",
              color: "rgba(255,255,255,0.65)",
            }}
          >
            Use o acesso mockado:
            <br />
            <strong>admin@liacli.com</strong> / <strong>123456</strong>
          </div>
        </div>
      </div>
    </main>
  );
}