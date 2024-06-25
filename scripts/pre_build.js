import { $ } from 'bun'
import fs from 'fs/promises'
import os from 'os'
import path from 'path'

const originalCWD = process.cwd()
// Change CWD to src-tauri
process.chdir(path.join(__dirname, '../desktop/src-tauri'))
const platform = {
	win32: 'windows',
	darwin: 'macos',
	linux: 'linux',
}[os.platform()]
const cwd = process.cwd()

const config = {
	openblasRealname: 'openblas',
	windows: {
		openBlasName: 'OpenBLAS-0.3.26-x64',
		openBlasUrl: 'https://github.com/OpenMathLib/OpenBLAS/releases/download/v0.3.26/OpenBLAS-0.3.26-x64.zip',

	}
}

// Export for Github actions
const exports = {
	openBlas: path.join(cwd, config.openblasRealname, "include"),
}

if (platform == 'windows') {
	// Setup OpenBlas
	if (!(await fs.exists(config.openblasRealname))) {
		await $`C:\\msys64\\usr\\bin\\wget.exe -nc --show-progress ${config.windows.openBlasUrl} -O ${config.windows.openBlasName}.zip`
		await $`"C:\\Program Files\\7-Zip\\7z.exe" x ${config.windows.openBlasName}.zip -o${config.openblasRealname}`
		await $`rm ${config.windows.openBlasName}.zip`
		fs.cp(path.join(config.openblasRealname, 'include'), path.join(config.openblasRealname, 'lib'), { recursive: true, force: true })
		// It tries to link only openblas.lib but our is libopenblas.lib`
		fs.cp(path.join(config.openblasRealname, 'lib/libopenblas.lib'), path.join(config.openblasRealname, 'lib/openblas.lib'))
	}
}

// Development hints
if (!process.env.GITHUB_ENV) {
    console.log('\nCommands to build 🔨:')
    if (originalCWD != cwd) {
		// Get relative path to desktop folder
		const relativePath = path.relative(originalCWD, path.join(cwd, '..'))
		console.log(`cd ${relativePath}`)
	}
    console.log('bun install')
    if (platform == 'windows') {
        console.log(`$env:OPENBLAS_INCLUDE_DIR = "${exports.openBlas}"`)
    }
	console.log('bunx tauri build')
}

// Config Github ENV
if (process.env.GITHUB_ENV) {
    if (platform == 'windows') {
		const openblas = `OPENBLAS_INCLUDE_DIR=${exports.openBlas}\n`
		console.log('Adding ENV', openblas)
		await fs.appendFile(process.env.GITHUB_ENV, openblas)
    }
}

// --dev or --build
const action = process.argv?.[2]
if (action?.includes('--build' || action.includes('--dev'))) {
    await $`bun install`
	await $`bunx tauri ${action.includes('--dev') ? 'dev' : 'build'}`
}