const { spawn } = require('child_process');
const path = require('path');

function runPythonOCR(filePath) {
  const scriptPath = path.resolve('/Users/user/Documents/Elad/OCR/main.py');
  const pythonPath = path.resolve('/Users/user/Documents/Elad/OCR/.venv/bin/python');
  const python = spawn(pythonPath, [scriptPath, filePath]);

  let output = '';
  let error = '';

  const promise = new Promise((resolve, reject) => {
    python.stdout.on('data', (data) => {
      output += data.toString();
    });

    python.stderr.on('data', (data) => {
      console.error('[PYTHON STDERR]:', data.toString());
      error += data.toString();
    });

    python.on('close', (code) => {
      console.log('[PYTHON EXIT CODE]:', code);
      if (code !== 0) {
        return reject(`Process exited with code ${code}`);
      }

      try {
        const jsonOutput = JSON.parse(output.trim());
        resolve(jsonOutput);
      } catch (err) {
        console.error('[PYTHON OUTPUT PARSE ERROR]:', output);
        reject('Invalid JSON returned from Python');
      }
    });
  });

  return { promise, process: python };
}

module.exports = runPythonOCR;
