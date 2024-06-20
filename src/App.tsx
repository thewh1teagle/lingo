import "./globals.css";
import languages from "./assets/languages.json";
import { useState } from "react";
import { invoke } from "@tauri-apps/api/core";

function App() {
  const [srcText, setSrcText] = useState("");
  const [dstText, setDstText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [language, setLanguage] = useState("eng");

  async function translate() {
    setIsLoading(true);
    await invoke<string>("translate", { language });
    await new Promise((resolve) => setTimeout(resolve, 3000));
    setIsLoading(false);
    setDstText("result");
  }

  return (
    <div className="flex flex-col w-full p-5 gap-3">
      <h1>Lingo</h1>

      <textarea
        onChange={(e) => setSrcText(e.target.value)}
        value={srcText}
        className="textarea textarea-bordered"
        name=""
        id=""
      ></textarea>
      <select
        onChange={(e) => setLanguage(e.target.value)}
        value={language}
        className="select select-primary"
        name=""
        id=""
      >
        {Object.entries(languages).map(([name, code]) => (
          <option value={code}>{name}</option>
        ))}
      </select>
      <div>
        <button onClick={translate} className="btn btn-primary">
          {isLoading && (
            <span className="loading loading-spinner loading-xs"></span>
          )}
          Translate
        </button>
      </div>
      <textarea
        value={dstText}
        placeholder="Translation will be here..."
        className="textarea textarea-bordered"
        name=""
        id=""
      ></textarea>
    </div>
  );
}

export default App;
