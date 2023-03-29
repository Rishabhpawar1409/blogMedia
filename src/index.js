import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { UserAuthContextProvider } from "./Context/userAuthContext";

import App from "./Components/App";

const rootElement = document.getElementById("root");
const root = createRoot(rootElement);

root.render(
  <BrowserRouter>
    <UserAuthContextProvider>
      <App />
    </UserAuthContextProvider>
  </BrowserRouter>
);
