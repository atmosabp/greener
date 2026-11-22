import { useState } from "react";

function greeting() {
  const hour = new Date().getHours();

  if (hour < 5) return "Boa madrugada"
  if (hour < 12) return "Bom dia";
  if (hour < 18) return "Boa tarde";
  return "Boa noite";
}

export default function Greeting() {
  const [userName, _setUserName] = useState<string>(() => {
    const storedUser = localStorage.getItem("user");
    if (!storedUser) return "usuário";
    try {
      const parsedUser = JSON.parse(storedUser);
      return parsedUser.name || "usuário";
    } catch (e) {
      return "usuário";
    }
  }); 
  
  return (
    <h1>
      {greeting()}, {userName}.
    </h1>
  );
}
