import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { UserAuthContextProvider } from "./Context/userAuthContext";

import App from "./Components/App";
import Context from "./Context/Context";

const rootElement = document.getElementById("root");
const root = createRoot(rootElement);

root.render(
  <BrowserRouter>
    <UserAuthContextProvider>
      <Context>
        <App />
      </Context>
    </UserAuthContextProvider>
  </BrowserRouter>
);
