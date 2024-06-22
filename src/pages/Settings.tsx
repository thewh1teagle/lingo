import { invoke } from '@tauri-apps/api/core'
import { useNavigate } from 'react-router-dom'

export default function Settings() {
	const navigate = useNavigate()

	return (
		<div>
			<h1>settings</h1>
			<button onClick={() => invoke('open_models_folder')} className="btn btn-primary">
				Open models folder
			</button>
			<button className="btn" onClick={() => navigate('/')}>
				Home
			</button>
		</div>
	)
}
