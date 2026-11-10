import { useState, useEffect, useDebugValue, useDeferredValue } from "react";
import { register, logIn, hearSession, logOut } from "./data/auth.js";
import { loadNotes, saveNote } from "./data/notes.js";

function LoginDemo() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [user, setUser] = useState(null);
  const [checking, setChecking] = useState(true);

  const [text, setText] = useState("");
  const [notes, setNotes] = useState([]);

  useEffect(() => {
    if (!user) return;

    loadNotes(user.uid)
      .then(setNotes)
      .catch((err) => setError(err.message));
  }, [user]);

  useEffect(() => {
    const stopHearing = hearSession((user) => {
      setUser(user);
      setChecking(false);
    });
    return stopHearing;
  }, []);

  async function save(e) {
    e.preventDefault();
    setError("");
    try {
      await saveNote(user.uid, text);
      setText("");
      setNotes(await loadNotes(user.uid));
    } catch (err) {
      setError(err.message);
    }
  }

  async function exit() {
    await logOut();
    setNotes([]);
  }

  // Función para entrar
  async function enter(e) {
    e.preventDefault();
    setError("");

    try {
      await logIn(email, password);
    } catch (err) {
      setError(err.code);
    }
  }

  // Función para crear cuenta
  async function createAccount() {
    setError("");
    try {
      await register(email, password);
    } catch (err) {
      setError(err.code);
    }
  }

  if (checking) {
    return <p>Loading...</p>;
  }

  if (!user) {
    return (
      <main>
        <h1>Login</h1>
        <form onSubmit={enter}>
          <input
            type="email"
            name="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
          />
          <input
            type="password"
            name="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
          />

          <button type="submit">Enter</button>
          <button typer="button" onClick={createAccount}>
            Create account
          </button>
        </form>

        {error && <p className="error" {...error}></p>}
      </main>
    );
  }

  // Retornamos nuestro componente
  return (
    <main>
      <h1>Hola, {user.email}</h1>
      <p>Tu uid: {user.uid}</p>
      <button onClick={exit}>Log out</button>

      <form onSubmit={save}>
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Write a note..."
        />
        <button type="submit" disabled={text.trim() === ""}>
          Save
        </button>
      </form>

      {error && <p className="error" {...error}></p>}

      <ul>
        {notes.map((note) => (
          <li key={note.id}>{note.text}</li>
        ))}
      </ul>
    </main>
  );
}

export default LoginDemo;
