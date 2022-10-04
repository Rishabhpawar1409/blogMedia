import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { UserAuthContextProvider } from "./Context/userAuthContext";

import App from "./Components/App";
import Context from "./Context/Context";

const rootElement = document.getElementById("root");
const root = createRoot(rootElement);

root.render(
  <BrowserRouter>
    <StrictMode>
      <UserAuthContextProvider>
        <Context>
          <App />
        </Context>
      </UserAuthContextProvider>
    </StrictMode>
  </BrowserRouter>
);
