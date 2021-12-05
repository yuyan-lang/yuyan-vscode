const { workspace, ExtensionContext } =require('vscode');
var path = require('path');

const {
  LanguageClient,
  LanguageClientOptions,
  ServerOptions,
  TransportKind
} =require('vscode-languageclient/node');

let client
function activate(context ) {
  // The server is implemented in node
//   let serverModule = context.asAbsolutePath(path.join('server', 'out', 'server.js'));
  // The debug options for the server
  // --inspect=6009: runs the server in Node's Inspector mode so VS Code can attach to the server for debugging
  let debugOptions = {}
  

  let yyPath = workspace.getConfiguration("yuyan").get("executablePath")
  if (!path.isAbsolute(yyPath)){
    yyPath = context.asAbsolutePath(yyPath)
  }
  console.log(yyPath)
  // If the extension is launched in debug mode then the debug server options are used
  // Otherwise the run options are used
  let serverOptions = {
    run: { command: yyPath + " lsp", transport: TransportKind.stdio },
    debug: {
      command: yyPath + " lsp",
      command: yyPath,
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

  // Start the client. This will also launch the server
  client.start();
}

function deactivate() {
  if (!client) {
    return undefined;
  }
  return client.stop();
}

module.exports = {
  activate,deactivate
}