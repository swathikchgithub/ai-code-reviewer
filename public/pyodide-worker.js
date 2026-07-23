// Runs user-submitted Python in an isolated Web Worker via Pyodide (WebAssembly).
// Isolated from the main thread so a long/infinite loop in the reviewed code
// can't freeze the page; the main thread can still forcibly terminate() this
// worker even if it's stuck in a synchronous loop.
//
// Must be loaded as a module worker (`new Worker(url, { type: "module" })`) —
// Pyodide ships pyodide.mjs as an ES module and no longer supports being
// pulled into a classic worker via importScripts().

import { loadPyodide } from 'https://cdn.jsdelivr.net/pyodide/v314.0.2/full/pyodide.mjs';

const PYODIDE_CDN_BASE = 'https://cdn.jsdelivr.net/pyodide/v314.0.2/full/';

let pyodideReadyPromise = null;

function loadPyodideOnce() {
  if (!pyodideReadyPromise) {
    pyodideReadyPromise = loadPyodide({ indexURL: PYODIDE_CDN_BASE });
  }
  return pyodideReadyPromise;
}

self.onmessage = async (event) => {
  const { code } = event.data;
  const start = performance.now();
  let stdout = '';
  let stderr = '';
  let error = null;

  try {
    const pyodide = await loadPyodideOnce();
    stdout = '';
    stderr = '';
    pyodide.setStdout({ batched: (msg) => { stdout += msg + '\n'; } });
    pyodide.setStderr({ batched: (msg) => { stderr += msg + '\n'; } });
    await pyodide.runPythonAsync(code);
  } catch (err) {
    error = err && err.message ? err.message : String(err);
  }

  self.postMessage({
    stdout,
    stderr,
    error,
    durationMs: Math.round(performance.now() - start),
  });
};
