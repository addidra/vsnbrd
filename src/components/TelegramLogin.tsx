import { useEffect } from "react";

declare global {
  interface Window {
    onTelegramAuth: (user: any) => void;
  }
}

const TelegramLogin = () => {
  useEffect(() => {
    // Define the Telegram authentication function
    window.onTelegramAuth = (user) => {
      console.log("User Data:", user);

      // Extract hash value
      const hashValue = user?.hash;
      console.log("Hash Value:", hashValue);

      alert(
        `Logged in as ${user.first_name} ${user.last_name} (ID: ${user.id} ${
          user.username ? ", @" + user.username : ""
        })`
      );
    };

    // Dynamically inject the Telegram login script
    const script = document.createElement("script");
    script.async = true;
    script.src = "https://telegram.org/js/telegram-widget.js?22";
    script.setAttribute("data-telegram-login", "addidra_bot");
    script.setAttribute("data-size", "large");
    script.setAttribute("data-onauth", "onTelegramAuth(user)");
    script.setAttribute("data-request-access", "write");

    document.body.appendChild(script);

    // Cleanup function (optional, removes script when component unmounts)
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return <div id="telegram-login-button"></div>;
};

export default TelegramLogin;
