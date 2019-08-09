/** @jsx jsx */
import { jsx } from "@emotion/core";
import React from "react";
import { Redirect } from "@reach/router";
import { useUser, useUserUpdater } from "../contexts/user";
import { login } from "../services/user";
import { Input, Button, Label } from "../components/Ui";
import image from "../assets/login-image.png";

function Login() {
  const user = useUser();
  const userUpdater = useUserUpdater();
  const [email, setEmail] = React.useState("@gmail.com");
  const [password, setPassword] = React.useState("123456");
  const [error, setError] = React.useState(null);

  if (user) return <Redirect to="/" noThrow />;

  function handleEmailChange(event) {
    setEmail(event.target.value);
  }

  function handlePasswordChange(event) {
    setPassword(event.target.value);
  }

  async function handleSubmit(event) {
    event.preventDefault();
    try {
      const { name, id, rol } = await login({ email, password });
      userUpdater({ type: "LOGIN", payload: { name, email, id, rol } });
    } catch (error) {
      setError(error.message);
    }
  }

  return (
    <main
      css={{ backgroundColor: "##F5F7FA", display: "flex", minHeight: "100vh" }}
    >
      <section
        css={{
          width: "90%",
          margin: "0 auto",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
          "@media (min-width: 1024px)": {
            width: "50%",
            margin: 0
          }
        }}
      >
        <header css={{ maxWidth: "360px", width: "100%" }}>
          <h1
            css={{
              color: "#19216C",
              fontSize: "2.5em",
              fontWeight: "700",
              margin: 0,
              marginBottom: "11px"
            }}
          >
            ShiftMe
          </h1>
          <h2
            css={{
              color: "#9AA5B1",
              fontSize: "1em",
              margin: 0,
              marginBottom: "34px"
            }}
          >
            Improve the work schedules of your hotel
          </h2>
        </header>
        <form
          onSubmit={handleSubmit}
          css={{ maxWidth: "360px", width: "100%" }}
        >
          <fieldset css={{ border: "none", marginBottom: "24px", padding: 0 }}>
            <Label htmlFor="email" styles={{ marginBottom: "6px" }}>
              Email
            </Label>
            <Input
              type="email"
              id="email"
              name="email"
              value={email}
              onChange={handleEmailChange}
            />
          </fieldset>
          <fieldset css={{ border: "none", padding: 0, marginBottom: "34px" }}>
            <Label htmlFor="password" styles={{ marginBottom: "6px" }}>
              Password
            </Label>
            <Input
              id="password"
              type="password"
              name="password"
              value={password}
              onChange={handlePasswordChange}
            />
          </fieldset>
          <Button>Sign In</Button>
          {error && (
            <div
              css={{
                color: "red",
                marginTop: "1rem"
              }}
            >
              Error: {error}
            </div>
          )}
        </form>
      </section>
      <section
        css={{
          width: "55%",
          justifyContent: "center",
          alignItems: "center",
          position: "relative",
          left: "-5%",
          display: "none",
          "@media (min-width: 1024px)": {
            display: "flex"
          }
        }}
      >
        <img
          alt="Woman scheduling in a big calendar"
          role="presentation"
          src={image}
          css={{ maxWidth: "100%", height: "100vh" }}
        />
      </section>
    </main>
  );
}

export default Login;
