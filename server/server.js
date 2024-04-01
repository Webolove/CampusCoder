const express = require("express");
const bodyParser = require('body-parser');
const cors = require("cors");
const { exec, spawn } = require('child_process');
const fs = require('fs');

const app = express();

app.use(cors({
  origin: "http://localhost:3000",
  credentials: true,
}));
app.use(express.json());

app.post("/compile", (req, res) => {
  const userCode = req.body.code;
  const language = req.body.language;
  const input = req.body.input;
  let fileName, compiledFileName, compileCommand, runCommand;

  if (language == 'Python') {
    fileName = 'user_code.py';
    runCommand = `python ${fileName}`;
  } else {
    switch (language) {
      case 'C++':
        fileName = 'user_code.cpp';
        compiledFileName = 'cppProg';
        compileCommand = `g++ ${fileName} -o ${compiledFileName}`;
        runCommand = `${compiledFileName}.exe`;
        break;

      case 'Java':
        fileName = 'UserClass.java';
        compiledFileName = 'UserClass';
        compileCommand = `javac ${fileName}`;
        runCommand = `java ${compiledFileName}.java`;
        break;

      default:
        return res.status(400).json({ error: 'Unsupported language', message: 'The specified language is not supported.' });
    }
  }
  fs.writeFileSync(fileName, userCode);


  if (compileCommand) {
    exec(compileCommand, (compileError, compileStdout, compileStderr) => {
      if (compileError) {
        console.error('Compilation Error:', compileStderr);
        return res.status(500).json({ error: 'Compilation Error', message: compileStderr });
      }
      console.log('Compilation Successful:', compileStdout);
      executeCode(runCommand, input, res, language, compiledFileName);
    });
  } else {
    executeCode(runCommand, input, res, language, compiledFileName);
  }
});

// function deleteExecutableFile(language, compiledFileName) {
//   if (language !== 'Python') {
//     fs.unlinkSync(compiledFileName); // Delete the executable file
//   }
// }

function executeCode(runCommand, input, res, language, compiledFileName) {
  const childProcess = spawn(runCommand, [], { shell: true });
  const executionTimeOut = 3200;

  if (input) {
    childProcess.stdin.write(input);
    childProcess.stdin.end();
  }

  let output = '';
  let executionTimedOut = false;

  let timer = setTimeout(() => {
    childProcess.kill();
    // deleteExecutableFile(language, compiledFileName);
    executionTimedOut = true;
  }, executionTimeOut);

  childProcess.stdout.on('data', (data) => {
    output += data.toString();
  });

  childProcess.stderr.on('data', (data) => {
    output += data.toString();
  });

  childProcess.on('close', (code) => {
    clearTimeout(timer);
    // deleteExecutableFile(language, compiledFileName);
    if (executionTimedOut)
      res.status(400).json({ error: 'Execution Timeout', message: 'Your code exceeded the anticipated time frame.' });
    else
      res.json({ output, exitCode: code });
  });
}

const port = 8000;

app.listen(port, () => {
  console.log(`Server is running at : http://localhost:${port}.`);
});