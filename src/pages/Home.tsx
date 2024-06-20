import languages from "../assets/languages.json";
import { useEffect, useState } from "react";
import { invoke } from "@tauri-apps/api/core";
import { useNavigate } from "react-router-dom";
import { useLocalStorage } from "usehooks-ts";

type TranslateResponse = [string, number][]; // line, score

export default function Home() {
  const [srcText, setSrcText] = useState("");
  const [dstText, setDstText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [language, setLanguage] = useLocalStorage("prefs_language", languages["english"]);
  const navigate = useNavigate();
  const [modelPath, setModelPath] = useState<null | string>(null);

  async function translate() {
    setIsLoading(true);
    const resp = await invoke<TranslateResponse>("translate", {
      language,
      modelPath,
      text: srcText,
    });
    console.log("resp => ", resp);
    setIsLoading(false);
    setDstText(
      resp
        .map(([line, _score]) => {
          line = line.replace("<unk>", "");
          line = line.replace("<s>", "");
          line = line.replace("</s>", "");
          return line;
        })
        .join("\n")
    );
  }

  async function getModelPath() {
    const modelPathResult = await invoke<string | null>("get_model_path");
    if (!modelPathResult) {
      navigate("/setup");
    }
    setModelPath(modelPathResult);
  }

  useEffect(() => {
    getModelPath();
  }, []);

  return (
    <div className="flex flex-col w-full p-5 gap-3">
      <h1>Lingo</h1>

      <div>
        <button onClick={() => navigate("/settings")} className="btn btn-ghost">
          settings
        </button>
      </div>

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
