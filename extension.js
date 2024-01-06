const { workspace, ExtensionContext, languages, commands} =require('vscode');
const vscode = require('vscode')
var path = require('path');
const { exec } = require('child_process');

const {
  LanguageClient,
  LanguageClientOptions,
  ServerOptions,
  TransportKind
} =require('vscode-languageclient/node');

let client
function activate(context ) {
  // languages.registerOnTypeFormattingEditProvider("yuyan", 
  // {
  //   provideOnTypeFormattingEdits: function (model, position, ch, options, token) {
	// 	console.log("inside provideOnTypeFormattingEdits");
	// 	return [
	// 		{
	// 		  range: {
	// 			startLineNumber: position.line,
	// 			startColumn: position.character-1,
	// 			endLineNumber: position.line,
	// 			endColumn: position.character
	// 		  },
	// 		  text: (() => {
  //         switch(ch){
  //           case '（':
  //           case '(':
  //             return '「'
  //           case '）':
  //           case ')':
  //             return '」'
  //           case '`':
  //             return '『'
  //           case '\'':
  //             return '』';
  //           default:
  //             return "BUG!!! in vscode extension"
  //         }
  //       })()
	// 		}
	// 	]
  //   }
  // }, "（", ["(", "）", ")", "`", "'"]
  //   ); 

  // The server is implemented in node
//   let serverModule = context.asAbsolutePath(path.join('server', 'out', 'server.js'));
  // The debug options for the server
  // --inspect=6009: runs the server in Node's Inspector mode so VS Code can attach to the server for debugging
  let debugOptions = {}
  let yyPath = workspace.getConfiguration("yuyan").get("executablePath")
  if (yyPath=="") {
    yyPath = "yy"
  } else if (!path.isAbsolute(yyPath)){
    yyPath = path.join(workspace.workspaceFolders[0].uri.fsPath, yyPath)
  }
  console.log(yyPath)
  // If the extension is launched in debug mode then the debug server options are used
  // Otherwise the run options are used
  let serverOptions = {
    run: { command: yyPath, args:["lsp"], transport: TransportKind.stdio },
    debug: {
      command: yyPath, args:["lsp"],
      transport: TransportKind.stdio,
      options: debugOptions
    }
  };

  // Options to control the language client
  let clientOptions = {
    // Register the server for plain text documents
    documentSelector: [{ scheme: 'file', language: 'yuyan' }],
    synchronize: {
      // Notify the server about file changes to '.clientrc files contained in the workspace
    //   fileEvents: workspace.createFileSystemWatcher('**/.clientrc')
    }
  };

  // Create the language client and start the client.
   client = new LanguageClient(
    'yuyan',
    'Yuyan',
    serverOptions,
    clientOptions
  );

  const restartDisposable = commands.registerCommand('yuyan.restartyuyanlsp', () => {
		// The code you place here will be executed every time your command is executed

		// Display a message box to the user
    client.restart();
	});

	context.subscriptions.push(restartDisposable);

  // Start the client. This will also launch the server
  client.start();
}
const showTreeDisposable = commands.registerCommand('yuyan.debugshowtree', () => {
  // Get the active text editor
  const editor = vscode.window.activeTextEditor;
  
  if (editor) {
      // Get the file path of the active document
      const filePath = editor.document.fileName;

      // Run the command `./yy_bs debug showtree <file-path>`
      const command = `./yy_bs debug showtree "${filePath}"`;

      exec(command, (error, stdout, stderr) => {
          if (error) {
              vscode.window.showErrorMessage(`Error running command: ${error.message}`);
              return;
          }

          // Create a new output channel for the results
          const outputChannel = vscode.window.createOutputChannel('YY Debug ShowTree');
          outputChannel.show();

          // Display the stdout in the output channel
          outputChannel.appendLine(stdout);

          // Handle errors in stderr if any
          if (stderr) {
              outputChannel.appendLine(`Error: ${stderr}`);
          }
      });
  } else {
      vscode.window.showErrorMessage('No active text editor');
  }
});

const showTreesDisposable = commands.registerCommand('yuyan.debugshowtrees', () => {
  // Get the active text editor
  const editor = vscode.window.activeTextEditor;
  
  if (editor) {
      // Get the file path of the active document
      const filePath = editor.document.fileName;

      // Run the command `./yy_bs debug showtree <file-path>`
      const command = `./yy_bs debug showtrees "${filePath}"`;

      exec(command, (error, stdout, stderr) => {
          if (error) {
              vscode.window.showErrorMessage(`Error running command: ${error.message}`);
              return;
          }

          // Create a new output channel for the results
          const outputChannel = vscode.window.createOutputChannel('YY Debug ShowTree');
          outputChannel.show();

          // Display the stdout in the output channel
          outputChannel.appendLine(stdout);

          // Handle errors in stderr if any
          if (stderr) {
              outputChannel.appendLine(`Error: ${stderr}`);
          }
      });
  } else {
      vscode.window.showErrorMessage('No active text editor');
  }
});

function deactivate() {
  if (!client) {
    return undefined;
  }
  return client.stop();
}


module.exports = {
  activate,deactivate
}