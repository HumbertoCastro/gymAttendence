import React, { useState, FormEvent } from "react";
import { logInWithEmailAndPassword } from "../../firebase-config";
import "./Login.css";

interface loginInterface {
  callbackEmail: (email: string) => void;
  setLogged: (email: string) => void;
}

const Login: React.FC<loginInterface> = ({ callbackEmail, setLogged }) => {
  const [email, setEmail] = useState<string>("");
  const [senha, setSenha] = useState<string>("");
  const [mensagem, setMensagem] = useState<string>("");

  const verificarEmailSenha = async (event: FormEvent<HTMLButtonElement>) => {
    event.preventDefault();
    if (email.length < 8) {
      setMensagem("O email deve ter no mínimo 8 caracteres.");
    } else if (senha.length < 6) {
      setMensagem("A senha deve ter no mínimo 6 caracteres.");
    } else if (!/[A-Z]/.test(senha)) {
      setMensagem("A senha deve conter pelo menos uma letra maiúscula.");
    } else {
      try {
        const res = await logInWithEmailAndPassword(email, senha);
        console.log(res)
        if (res.email) {
          callbackEmail(res.email)
          setLogged(res.email)
        } else {
          setMensagem("E-mail ou senha podem estar errados");
        }
      } catch (e) {
        setMensagem("Email or Password may be wrong");
        console.error(e);
      }
    }
  };

  return (
    <form className="form">
      <p id="heading">Entre com seu E-mail e Senha</p>
      <div className="field">
        <input
          placeholder="Email"
          className="input-field"
          type="email"
          onChange={({ target: { value } }) => setEmail(value)}
        />
      </div>
      <div className="field">
        <input
          placeholder="Password"
          className="input-field"
          type="password"
          onChange={({ target: { value } }) => setSenha(value)}
        />
      </div>
      <div className="btn">
        <button className="login" onClick={verificarEmailSenha}>
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Login&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
        </button>
      </div>
      <p style={{ color: 'white' }} >{mensagem}</p>
    </form>
  );
};

export default Login;
