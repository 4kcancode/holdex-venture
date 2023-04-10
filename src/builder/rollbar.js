// Custom rollup plugin for uploading rollbar deploys
import FormData from 'form-data'
import { existsSync, readFileSync } from 'fs'
import { resolve } from 'path'
import glob from 'fast-glob'
import fetch from 'node-fetch'

const ROLLBAR_ENDPOINT = 'https://api.rollbar.com/api/1/sourcemap'


async function uploadSourcemap(form, { filename, rollbarEndpoint, silent, baseUrl }) {
    const errMessage = `Failed to upload ${filename} to Rollbar`

    let res
    try {
        res = await fetch(rollbarEndpoint, {
            method: 'POST',
            body: form
        })
    } catch (err) {
        // Network or operational errors
        throw new Error(err, errMessage)
    }

    // 4xx or 5xx response
    if (!res.ok) {
        // Attempt to parse error details from response
        let details
        try {
            const body = await res.json()
            details = body?.message ?? `${res.status} - ${res.statusText}`
        } catch (parseErr) {
            details = `${res.status} - ${res.statusText}`
        }

        throw new Error(`${errMessage}: ${details}`)
    }

    // Success
    if (!silent) {
        console.info(`Uploaded ${filename} to Rollbar for ${baseUrl} domain`)
    }
}

export default function rollbarSourcemaps({
    accessToken,
    version,
    baseUrl,
    silent = false,
    rollbarEndpoint = ROLLBAR_ENDPOINT,
    ignoreUploadErrors = true,
    base = '/',
    outputDir = '.svelte-kit'
}) {
    return {
        localProps: {
            accessToken,
            version,
            baseUrl,
            silent,
            rollbarEndpoint
        },
        name: 'vite-plugin-rollbar',
        async writeBundle() {
            if (!accessToken || !baseUrl) return;

            const files = await glob('./**/*.map', { cwd: outputDir })
            const sourcemaps = files
                .map((file) => {
                    const sourcePath = file.replace(/\.map$/, '')
                    const sourceFilename = resolve(outputDir, sourcePath)

                    if (!existsSync(sourceFilename)) {
                        console.error(`No corresponding source found for '${file}'`, true)
                        return null
                    }

                    const sourcemapLocation = resolve(outputDir, file)

                    try {
                        return {
                            content: readFileSync(sourcemapLocation, 'utf8'),
                            sourcemap_url: sourcemapLocation,
                            original_file: `${base}${sourcePath}`
                        }
                    } catch (error) {
                        console.error(`Error reading sourcemap file ${sourcemapLocation}: ${error}`, true)
                        return null
                    }
                })
                .filter((sourcemap) => sourcemap !== null)

            if (!sourcemaps.length) return

            try {
                await Promise.all(
                    sourcemaps.map((asset) => {
                        const form = new FormData()

                        form.append('access_token', accessToken)
                        form.append('version', version)
                        form.append('minified_url', `${baseUrl}${asset.original_file}`)
                        form.append('source_map', asset.content, {
                            filename: asset.original_file,
                            contentType: 'application/json'
                        })

                        return uploadSourcemap(form, {
                            filename: asset.original_file,
                            rollbarEndpoint,
                            silent,
                            baseUrl
                        })
                    })
                )
            } catch (error) {
                if (ignoreUploadErrors) {
                    console.error('Uploading sourcemaps to Rollbar failed: ', error)
                    return
                }
                throw error
            }
        }
    }
}