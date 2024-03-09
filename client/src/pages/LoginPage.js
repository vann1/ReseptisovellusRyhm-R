import React, { useEffect, useState } from "react";
import LoginForm from "../components/LoginForm";
//testiwqeqw
const LoginPage = () => {
  const [virheViesti, setVirheViesti] = useState("");

  const handleLogin = async (email, password) => {
    setVirheViesti("");
    try {
      const response = await fetch("http://localhost:3001/api/user/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();

      if (response.ok) {
        console.log("onnistui!");
        console.log(data);
      } else {
        setVirheViesti("Käyttäjätunnus tai salasana väärä");
        throw new Error(data.error);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };
  return (
    <div>
      <h1>Kirjaudu</h1>
      <LoginForm virheViesti={virheViesti} onLogin={handleLogin}></LoginForm>
    </div>
  );
};

export { LoginPage };
