import { useState } from "react";
import { login } from "../services/apiAuth";
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { IoMdClose } from "react-icons/io";

function Login({ isLoggedIn, setIsLoggedIn, setShowLoginForm }) {
  const [form, setForm] = useState({ email: "", password: "" });

  const { mutate, isPending } = useMutation({
    mutationFn: (form) => login(form),
    onSuccess: () => {
      setIsLoggedIn(true);
      toast.success(" Login Successful");
    },
    onError: () => {
      toast.error("Provided credentials are incorrect");
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.email || !form.password) {
      return;
    }

    mutate(form);
  };
  if (!isLoggedIn) {
    return (
      <>
        <div className="overlay"></div>
        <div className="Login">
          <div className="closeLoginPage">
            {" "}
            <IoMdClose
              onClick={() => setShowLoginForm(false)}
              size={30}
              style={{ cursor: "pointer", position: "absolute", top: "10px", right: "10px" }}
            />
          </div>
          <h1>Login to your account</h1>
          <form onSubmit={handleSubmit}>
            <label htmlFor="email">Email</label>
            <input
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              placeholder=" enter your email"
              required
              autoComplete="on"
            />
            <label htmlFor="password">Password</label>
            <input
              type="password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              placeholder="enter your password"
              required
            />
            <button disabled={isPending} type="submit">
              {isPending ? "Logging in..." : "Login"}
            </button>
          </form>
        </div>
      </>
    );
  }
}

export default Login;
