import { invoke } from "@tauri-apps/api/core";

export default function Settings() {
  return (
    <div>
      <h1>settings</h1>
      <button
        onClick={() => invoke("open_models_folder")}
        className="btn btn-primary"
      >
        Open models folder
      </button>
    </div>
  );
}
