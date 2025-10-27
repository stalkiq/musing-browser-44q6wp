import { createRoot } from "react-dom/client"
import { BrowserRouter } from "react-router-dom"

import { AppWithBackend } from "./AppWithBackend"
import "./styles.css"

createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <AppWithBackend />
  </BrowserRouter>
)
