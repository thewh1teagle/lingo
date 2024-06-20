import { invoke } from "@tauri-apps/api/core";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import * as config from "../config";
import { listen } from "@tauri-apps/api/event";

export default function Setup() {
  const [progress, setProgress] = useState<number | null>(null);
  const navigate = useNavigate();

  async function downloadModel() {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    await invoke<string>("download_model", {
      filename: config.modelFilename,
      url: config.modelURL,
    });
    navigate("/");
  }

  async function listenForProgress() {
    await listen<[number, number]>("download_progress", (event) => {
      const [part, total] = event.payload;
      setProgress((part / total) * 100);
    });
  }

  useEffect(() => {
    listenForProgress();
    downloadModel();
  }, []);

  return (
    <div>
      <h1>Downloading model...</h1>
      <progress
        className="progress progress-primary w-56"
        value={progress ?? 0}
        max="100"
      ></progress>
    </div>
  );
}
