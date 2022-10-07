const defaultJsContent = '// __webpack_require__.r(__webpack_exports__);\n' +
'// /* harmony import */ var monaco_editor__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! monaco-editor */ "../node_modules/monaco-editor/esm/vs/editor/editor.main.js");\n' +
'\n' +
'\n' +
'// self.MonacoEnvironment = {\n' +
'// \tgetWorkerUrl: function (moduleId, label) {\n' +
"// \t\tif (label === 'json') {\n" +
"// \t\t\treturn './json.worker.bundle.js';\n" +
'// \t\t}\n' +
"// \t\tif (label === 'css' || label === 'scss' || label === 'less') {\n" +
"// \t\t\treturn './css.worker.bundle.js';\n" +
'// \t\t}\n' +
"// \t\tif (label === 'html' || label === 'handlebars' || label === 'razor') {\n" +
"// \t\t\treturn './html.worker.bundle.js';\n" +
'// \t\t}\n' +
"// \t\tif (label === 'typescript' || label === 'javascript') {\n" +
"// \t\t\treturn './ts.worker.bundle.js';\n" +
'// \t\t}\n' +
"// \t\treturn './editor.worker.bundle.js';\n" +
'// \t}\n' +
'// };\n' +
'\n' +
'// const initDenkui = () => {\n' +
'// \tif (window.denkui === undefined) {\n' +
'// \t\twindow.denkui = {}\n' +
'// \t}\n' +
'// }\n' +
'\n' +
'// const denkSetKeyValue = (key, value) => {\n' +
'// \tinitDenkui()\n' +
'// \twindow.denkui[key] = value\n' +
'// }\n' +
'\n' +
'// const denkGetKey = (key) => {\n' +
'// \tinitDenkui()\n' +
'// \treturn window.denkui[key]\n' +
'// }\n' +
'\n' +
'// window.denkGetKey = (name) => {\n' +
'// \tconst res = denkGetKey(name)\n' +
"// \tconsole.info('window.denkGetKey ', name, res)\n" +
'// \treturn res\n' +
'// }\n' +
'// window.denkSetKeyValue = (name, value) => {\n' +
"// \tconsole.info('window.denkSetKeyValue', name, value)\n" +
'// \tdenkSetKeyValue(name, value)\n' +
'// }\n' +
'\n' +
"// // window.denkSetKeyValue('editor', codeEditor)\n" +
"// window.denkSetKeyValue('monaco', monaco_editor__WEBPACK_IMPORTED_MODULE_0__)\n" +
'// window.denkAllKeys = () => {\n' +
'// \tinitDenkui()\n' +
'// \tconst res = []\n' +
'// \tfor (let x in window.denkui) {\n' +
'// \t\tres.push(x)\n' +
'// \t}\n' +
'// \treturn res\n' +
'// }\n' +
'\n' +
'// const sendIpcMessage = (data) => {\n' +
'// \ttry {\n' +
'// \t\twindow.webkit.messageHandlers.ipcRender.postMessage(data)\n' +
'// \t} catch (err) {\n' +
'// \t\tconsole.error(err)\n' +
'// \t}\n' +
'// }\n' +
'\n' +
'// const prepareInjectJs = async () => {\n' +
"// \tif (denkGetKey('prepareInjectJsResolve')) {\n" +
"// \t\treturn Promise.reject('already loading')\n" +
'// \t}\n' +
'// \treturn new Promise((resolve, reject) => {\n' +
'// \t\tsetTimeout(() => {\n' +
"// \t\t\treject(new Error('timeout prepareInjectJs'))\n" +
'// \t\t}, 1000);\n' +
"// \t\tdenkSetKeyValue('prepareInjectJsResolve', resolve);\n" +
'// \t\tsendIpcMessage({\n' +
"// \t\t\tname: 'prepareInjectJs'\n" +
'// \t\t})\n' +
'// \t})\n' +
'// }\n' +
'\n' +
"// window.denkSetKeyValue('sendIpcMessage', sendIpcMessage)\n" +
'\n' +
"// const editorContainerHolder = document.getElementById('editor_container_holder')\n" +
'\n' +
'// const defaultEditorOption = {\n' +
"// \tvalue: ['defaultEditorOption'].join('\\\n" +
"// '),\n" +
"// \tlanguage: 'javascript'\n" +
'// }\n' +
'\n' +
'\n' +
'// {\n' +
'// \tconst monaco = window.denkGetKey("monaco");\n' +
'// \t// Register a new language\n' +
'// \tmonaco.languages.register({ id: "markdown" });\n' +
'\n' +
'// \t// Register a tokens provider for the language\n' +
'// \tmonaco.languages.setMonarchTokensProvider("markdown", {\n' +
'// \t\ttokenizer: {\n' +
'// \t\t\troot: [\n' +
'// \t\t\t\t[/- .*?\\[DONE\\]/, "custom-done"],\n' +
'// \t\t\t\t[/\\---/, "custom-title-bar"],\n' +
'// \t\t\t\t[/^(title) ?: ?(.*)/, "custom-title-bar"],\n' +
'// \t\t\t\t[/^(date) ?: ?(.*)/, "custom-title-bar"],\n' +
'// \t\t\t\t[/^(tags) ?: ?(.*)/, "custom-title-bar"],\n' +
'// \t\t\t\t[/^#{1,6} .*/, "custom-header"],\n' +
'// \t\t\t\t[/- .*? /, "custom-list-item"],\n' +
'// \t\t\t\t[/\\*\\*.*\\*\\*/, "custom-blod"],\n' +
'// \t\t\t\t[/\\*.*\\*/, "custom-italic"],\n' +
'// \t\t\t\t[/\\[error.*/, "custom-error"],\n' +
'// \t\t\t\t[/\\d/, "custom-number"],\n' +
'// \t\t\t\t[/\\[notice.*/, "custom-notice"],\n' +
'// \t\t\t\t[/\\[info.*/, "custom-info"],\n' +
'// \t\t\t\t[/\\[[a-zA-Z 0-9:]+\\]/, "custom-date"],\n' +
'// \t\t\t\t[/const/, "custom-date"],\n' +
'// \t\t\t\t[/".*?"/, "custom-date"],\n' +
'\n' +
'// \t\t\t],\n' +
'// \t\t},\n' +
'// \t});\n' +
'\n' +
'// \t// Define a new theme that contains only rules that match this language\n' +
'// \tmonaco.editor.defineTheme("myCoolTheme", {\n' +
'// \t\tbase: "vs",\n' +
'// \t\tinherit: true,\n' +
'// \t\trules: [\n' +
'// \t\t\t{ token: "custom-done", foreground: "aaaaaa" },\n' +
'// \t\t\t{ token: "custom-info", foreground: "808080" },\n' +
'// \t\t\t{ token: "custom-title-bar", foreground: "808080" },\n' +
'// \t\t\t{ token: "custom-header", foreground: "ffbcd4" },\n' +
'// \t\t\t{ token: "custom-list-item", foreground: "FFA500" },\n' +
'// \t\t\t{ token: "custom-title-bar", foreground: "808080" },\n' +
'// \t\t\t{ token: "custom-blod", foreground: "00aaff", fontStyle: "bold" },\n' +
'// \t\t\t{ token: "custom-italic", foreground: "ffaabb", fontStyle: "italic" },\n' +
'// \t\t\t{ token: "custom-error", foreground: "ff0000", fontStyle: "bold" },\n' +
'// \t\t\t{ token: "custom-number", foreground: "aa0000" },\n' +
'// \t\t\t{ token: "custom-notice", foreground: "FFA500" },\n' +
'// \t\t\t{ token: "custom-date", foreground: "008800" },\n' +
'// \t\t],\n' +
'// \t\tcolors: {\n' +
'// \t\t\t"editor.foreground": "#000000",\n' +
'// \t\t},\n' +
'// \t});\n' +
'\n' +
'\n' +
'// \tconst initCodeLens = (editor) => {\n' +
'\n' +
'// \t}\n' +
'\n' +
'\n' +
'// \tconst initCommands = (editor) => {\n' +
'\n' +
'// \t\teditor.addAction({\n' +
'// \t\t\t// An unique identifier of the contributed action.\n' +
"// \t\t\tid: 'save',\n" +
'\n' +
'// \t\t\t// A label of the action that will be presented to the user.\n' +
"// \t\t\tlabel: 'save!!!',\n" +
'\n' +
'// \t\t\t// An optional array of keybindings for the action.\n' +
'// \t\t\tkeybindings: [\n' +
'// \t\t\t\tmonaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS\n' +
'// \t\t\t],\n' +
'\n' +
'// \t\t\t// A precondition for this action.\n' +
'// \t\t\tprecondition: null,\n' +
'\n' +
'// \t\t\t// A rule to evaluate on top of the precondition in order to dispatch the keybindings.\n' +
'// \t\t\tkeybindingContext: null,\n' +
'\n' +
"// \t\t\tcontextMenuGroupId: 'navigation',\n" +
'\n' +
'// \t\t\tcontextMenuOrder: 1.5,\n' +
'\n' +
'// \t\t\t// Method that will be executed when the action is triggered.\n' +
'// \t\t\t// @param editor The editor instance is passed in as a convenience\n' +
'// \t\t\trun: function (ed) {\n' +
"// \t\t\t\twindow.denkGetKey('sendIpcMessage')({\n" +
"// \t\t\t\t\tname: 'editorSave'\n" +
'// \t\t\t\t})\n' +
'// \t\t\t}\n' +
'// \t\t});\n' +
'\n' +
'// \t\teditor.addAction({\n' +
'// \t\t\t// An unique identifier of the contributed action.\n' +
"// \t\t\tid: 'refresh',\n" +
'\n' +
'// \t\t\t// A label of the action that will be presented to the user.\n' +
"// \t\t\tlabel: 'refresh',\n" +
'\n' +
'// \t\t\t// An optional array of keybindings for the action.\n' +
'// \t\t\tkeybindings: [\n' +
'// \t\t\t\tmonaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyR\n' +
'// \t\t\t],\n' +
'\n' +
'// \t\t\t// A precondition for this action.\n' +
'// \t\t\tprecondition: null,\n' +
'\n' +
'// \t\t\t// A rule to evaluate on top of the precondition in order to dispatch the keybindings.\n' +
'// \t\t\tkeybindingContext: null,\n' +
'\n' +
"// \t\t\tcontextMenuGroupId: 'navigation',\n" +
'\n' +
'// \t\t\tcontextMenuOrder: 1.5,\n' +
'\n' +
'// \t\t\t// Method that will be executed when the action is triggered.\n' +
'// \t\t\t// @param editor The editor instance is passed in as a convenience\n' +
'// \t\t\trun: function (ed) {\n' +
'// \t\t\t\tlocation.reload(false)\n' +
'// \t\t\t}\n' +
'// \t\t});\n' +
'// \t}\n' +
'\n' +
"// \twindow.denkSetKeyValue('onEditorCreate', (editor) => {\n" +
"// \t\tconsole.info('onEditorCreate', editor)\n" +
'// \t\tinitCodeLens(editor)\n' +
'// \t\tinitCommands(editor)\n' +
'// \t})\n' +
'\n' +
'// \t// Register a completion item provider for the new language\n' +
'// \tmonaco.languages.registerCompletionItemProvider("markdown", {\n' +
'// \t\tprovideCompletionItems: () => {\n' +
'// \t\t\tvar suggestions = [];\n' +
'\n' +
'// \t\t\tconst headerMaxLv = 6;\n' +
'// \t\t\tlet headerPrefix = "";\n' +
'// \t\t\tfor (let x = 1; x <= headerMaxLv; x++) {\n' +
'// \t\t\t\theaderPrefix += "#";\n' +
'// \t\t\t\tsuggestions.push({\n' +
'// \t\t\t\t\tlabel: "_#" + x,\n' +
'// \t\t\t\t\tkind: monaco.languages.CompletionItemKind.Text,\n' +
'// \t\t\t\t\tinsertText: headerPrefix + " ${1:header}",\n' +
'// \t\t\t\t\tinsertTextRules:\n' +
'// \t\t\t\t\t\tmonaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,\n' +
'// \t\t\t\t\tdocumentation: "Header levele " + x,\n' +
'// \t\t\t\t});\n' +
'// \t\t\t}\n' +
'// \t\t\treturn { suggestions: suggestions };\n' +
'// \t\t},\n' +
'// \t});\n' +
'// }\n' +
'\n' +
'\n' +
'// window.onload = () => {\n' +
"// \tconsole.info('editor window onload()')\n" +
'\n' +
'// \tnew Promise((resolve, reject) => {\n' +
"// \t\tconsole.info('wait inject js')\n" +
"// \t\t// window.denkSetKeyValue('windowOnloadResolve', resolve)\n" +
'// \t\tresolve()\n' +
'// \t}).then(res => {\n' +
'\n' +
'// \t}).finally(() => {\n' +
'// \t\tprepareInjectJs()\n' +
'// \t})\n' +
'// }\n' +
'\n' +
'// for (let x in window) {\n' +
'// \tif (x.startsWith("denk")) {\n' +
'// \t\tconsole.info(x);\n' +
'// \t}\n' +
'// }\n' +
'// // console.info(window)\n' +
'// // ["monaco", "clearEditor", "createEditorFunc", "sendIpcMessage", "windowOnloadResolve", "prepareInjectJsResolve"]\n' +
'// console.info(window.denkAllKeys());\n' +
'\n' +
'// const getOption = (filePath = "") => {\n' +
'// \tlet myOption = {};\n' +
'// \tif (filePath.endsWith(".js")) {\n' +
'// \t\tmyOption.language = "javascript";\n' +
'// \t}\n' +
'\n' +
'\n' +
'// \tif (filePath.endsWith(".md")) {\n' +
'// \t\tmyOption.theme = "myCoolTheme";\n' +
'// \t\tmyOption.language = "markdown";\n' +
'// \t}\n' +
'\n' +
'// \treturn {\n' +
'// \t\tlanguage: "javascript",\n' +
'// \t\t...myOption,\n' +
'// \t};\n' +
'// };\n' +
'\n' +
'// const getEditor = (filePath = "") => {\n' +
'// \tconst id = "editor" + filePath;\n' +
'// \tlet editor = window.denkGetKey(id);\n' +
'// \tlet editorView = document.getElementById(id);\n' +
'// \tif (!editor) {\n' +
'// \t\tconst holder = document.getElementById("editor_container_holder");\n' +
'// \t\tif (!holder) {\n' +
'// \t\t\tthrow new Error("error");\n' +
'// \t\t}\n' +
'// \t\tif (!editorView) {\n' +
'// \t\t\teditorView = document.createElement("div");\n' +
'// \t\t\teditorView.style.width = "100%";\n' +
'// \t\t\teditorView.style.height = "100%";\n' +
'// \t\t\teditorView.id = id;\n' +
'// \t\t\teditorView.className = "editor_view";\n' +
'// \t\t\tholder.appendChild(editorView);\n' +
'// \t\t}\n' +
'// \t\tconst monaco = window.denkGetKey("monaco");\n' +
'// \t\teditor = monaco.editor.create(editorView, getOption(filePath));\n' +
'// \t\twindow.denkSetKeyValue(id, editor);\n' +
'\n' +
"// \t\tconst onEditorCreate = window.denkGetKey('onEditorCreate')\n" +
"// \t\tif (onEditorCreate && typeof onEditorCreate === 'function') {\n" +
'// \t\t\tonEditorCreate(editor)\n' +
'// \t\t}\n' +
'\n' +
'// \t}\n' +
'// \tfor (\n' +
'// \t\tlet x = 0;\n' +
'// \t\tx < document.getElementsByClassName("editor_view").length;\n' +
'// \t\tx++\n' +
'// \t) {\n' +
'// \t\tdocument.getElementsByClassName("editor_view")[x].style.display =\n' +
'// \t\t\t"none";\n' +
'// \t}\n' +
'// \teditorView.style.display = "";\n' +
'\n' +
'// \treturn editor;\n' +
'// };\n' +
'\n' +
'// window.denkSetKeyValue("insertIntoEditor", (content, filePath) => {\n' +
"// \tconsole.info('insertIntoEditor', content, filePath)\n" +
'// \tgetEditor(filePath).setValue(content);\n' +
'// });\n' +
'\n' +
'\n' +
"// console.info('version 12')\n" +
'\n' +
'\n' +
'// //# sourceURL=webpack://browser-esm-webpack/./index.js?'


const injectJsContent = 'console.info("DENKUI_EDITOR_INJECT start");\n' +
'\n' +
"window.denkSetKeyValue('getEditorByFilePath', (filePath) => {\n" +
"    let editor = window.denkGetKey('editor' + filePath)\n" +
"    console.info('getEditorByFilePath editor' , editor)\n" +
'    if (!editor) {\n' +
"        editor = window.denkGetKey('editor' + 'new')\n" +
"        console.info('getEditorByFilePath editor from new' , editor)\n" +
'    } \n' +
'\n' +
'    if (editor) {\n' +
"        console.error('editor is null', window.denkAllKeys())\n" +
'    } else {\n' +
"        window.denkSetKeyValue('editor' + filePath, editor)\n" +
'    }\n' +
'    \n' +
'    return editor\n' +
'})\n' +
'\n' +
'const getOption = (filePath = "") => {\n' +
'    let myOption = {};\n' +
'    if (filePath.endsWith(".js")) {\n' +
'        myOption.language = "javascript";\n' +
'    }\n' +
'\n' +
'\n' +
'    if (filePath.endsWith(".md")) {\n' +
'        myOption.theme = "myCoolTheme";\n' +
'        myOption.language = "markdown";\n' +
'    }\n' +
'\n' +
'    return {\n' +
'        language: "javascript",\n' +
'        ...myOption,\n' +
'    };\n' +
'};\n' +
'\n' +
'const getEditor = (filePath = "") => {\n' +
'    const id = "editor" + filePath;\n' +
'    let editor = window.denkGetKey(id);\n' +
'    let editorView = document.getElementById(id);\n' +
'    if (!editor) {\n' +
'        const holder = document.getElementById("editor_container_holder");\n' +
'        if (!holder) {\n' +
'            throw new Error("error");\n' +
'        }\n' +
'        if (!editorView) {\n' +
'            editorView = document.createElement("div");\n' +
'            editorView.style.width = "100%";\n' +
'            editorView.style.height = "100%";\n' +
'            editorView.id = id;\n' +
'            editorView.className = "editor_view";\n' +
'            holder.appendChild(editorView);\n' +
'        }\n' +
'        const monaco = window.denkGetKey("monaco");\n' +
'        editor = monaco.editor.create(editorView, getOption(filePath));\n' +
'        window.denkSetKeyValue(id, editor);\n' +
'\n' +
"        const onEditorCreate = window.denkGetKey('onEditorCreate')\n" +
"        if (onEditorCreate && typeof onEditorCreate === 'function') {\n" +
'            onEditorCreate(editor)\n' +
'        }\n' +
'\n' +
'    }\n' +
'    for (\n' +
'        let x = 0;\n' +
'        x < document.getElementsByClassName("editor_view").length;\n' +
'        x++\n' +
'    ) {\n' +
'        document.getElementsByClassName("editor_view")[x].style.display =\n' +
'            "none";\n' +
'    }\n' +
'    editorView.style.display = "";\n' +
'\n' +
'    return editor;\n' +
'};\n' +
'\n' +
"denkSetKeyValue('getEditorFunc', getEditor)\n" +
'\n' +
'window.denkSetKeyValue("insertIntoEditor", (content, filePath) => {\n' +
"    console.info('insertIntoEditor', content, filePath)\n" +
"    const targetEditor = window.denkGetKey('getEditorFunc')(filePath)\n" +
'    if (targetEditor.getValue().trim() === "")\n' +
'        targetEditor.setValue(content)\n' +
'});\n' +
'{\n' +
'    const windowOnloadResolve = window.denkGetKey("windowOnloadResolve");\n' +
'\n' +
'    if (windowOnloadResolve) {\n' +
'        windowOnloadResolve();\n' +
'    }\n' +
'\n' +
'    const monaco = window.denkGetKey("monaco");\n' +
'    // Register a new language\n' +
'    monaco.languages.register({ id: "markdown" });\n' +
'\n' +
'    // Register a tokens provider for the language\n' +
'    monaco.languages.setMonarchTokensProvider("markdown", {\n' +
'        tokenizer: {\n' +
'            root: [\n' +
'                [/- .*?\\[DONE\\]/, "custom-done"],\n' +
'                [/\\---/, "custom-title-bar"],\n' +
'                [/^(title) ?: ?(.*)/, "custom-title-bar"],\n' +
'                [/^(date) ?: ?(.*)/, "custom-title-bar"],\n' +
'                [/^(tags) ?: ?(.*)/, "custom-title-bar"],\n' +
'                [/^#{1,6} .*/, "custom-header"],\n' +
'                [/- .*? /, "custom-list-item"],\n' +
'                [/\\*\\*.*\\*\\*/, "custom-blod"],\n' +
'                [/\\*.*\\*/, "custom-italic"],\n' +
'                [/\\[error.*/, "custom-error"],\n' +
'                [/\\d/, "custom-number"],\n' +
'                [/\\[notice.*/, "custom-notice"],\n' +
'                [/\\[info.*/, "custom-info"],\n' +
'                [/\\[[a-zA-Z 0-9:]+\\]/, "custom-date"],\n' +
'                [/const/, "custom-date"],\n' +
'                [/".*?"/, "custom-date"],\n' +
'\n' +
'            ],\n' +
'        },\n' +
'    });\n' +
'\n' +
'    // Define a new theme that contains only rules that match this language\n' +
'    monaco.editor.defineTheme("myCoolTheme", {\n' +
'        base: "vs",\n' +
'        inherit: true,\n' +
'        rules: [\n' +
'            { token: "custom-done", foreground: "aaaaaa" },\n' +
'            { token: "custom-info", foreground: "808080" },\n' +
'            { token: "custom-title-bar", foreground: "808080" },\n' +
'            { token: "custom-header", foreground: "ffbcd4" },\n' +
'            { token: "custom-list-item", foreground: "FFA500" },\n' +
'            { token: "custom-title-bar", foreground: "808080" },\n' +
'            { token: "custom-blod", foreground: "00aaff", fontStyle: "bold" },\n' +
'            { token: "custom-italic", foreground: "ffaabb", fontStyle: "italic" },\n' +
'            { token: "custom-error", foreground: "ff0000", fontStyle: "bold" },\n' +
'            { token: "custom-number", foreground: "aa0000" },\n' +
'            { token: "custom-notice", foreground: "FFA500" },\n' +
'            { token: "custom-date", foreground: "008800" },\n' +
'        ],\n' +
'        colors: {\n' +
'            "editor.foreground": "#000000",\n' +
'        },\n' +
'    });\n' +
'\n' +
'\n' +
'    const initCodeLens = (editor) => {\n' +
"        console.info('initCodeLens')\n" +
'\n' +
'        // monaco.languages.registerCodeLensProvider("javascript", codeLensProvider);\n' +
'        // monaco.languages.registerCodeLensProvider("markdown", codeLensProvider);\n' +
'    };\n' +
'\n' +
'\n' +
'    const initCommands = (editor) => {\n' +
'\n' +
'        editor.addAction({\n' +
'            // An unique identifier of the contributed action.\n' +
"            id: 'save',\n" +
'\n' +
'            // A label of the action that will be presented to the user.\n' +
"            label: 'save!!!',\n" +
'\n' +
'            // An optional array of keybindings for the action.\n' +
'            keybindings: [\n' +
'                monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS\n' +
'            ],\n' +
'\n' +
'            // A precondition for this action.\n' +
'            precondition: null,\n' +
'\n' +
'            // A rule to evaluate on top of the precondition in order to dispatch the keybindings.\n' +
'            keybindingContext: null,\n' +
'\n' +
"            contextMenuGroupId: 'navigation',\n" +
'\n' +
'            contextMenuOrder: 1.5,\n' +
'\n' +
'            // Method that will be executed when the action is triggered.\n' +
'            // @param editor The editor instance is passed in as a convenience\n' +
'            run: function (ed) {\n' +
"                window.denkGetKey('sendIpcMessage')( {\n" +
"                    name: 'editorSave'\n" +
'                })\n' +
'            }\n' +
'        });\n' +
'\n' +
'        editor.addAction({\n' +
'            // An unique identifier of the contributed action.\n' +
"            id: 'refresh',\n" +
'\n' +
'            // A label of the action that will be presented to the user.\n' +
"            label: 'refresh',\n" +
'\n' +
'            // An optional array of keybindings for the action.\n' +
'            keybindings: [\n' +
'                monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyR\n' +
'            ],\n' +
'\n' +
'            // A precondition for this action.\n' +
'            precondition: null,\n' +
'\n' +
'            // A rule to evaluate on top of the precondition in order to dispatch the keybindings.\n' +
'            keybindingContext: null,\n' +
'\n' +
"            contextMenuGroupId: 'navigation',\n" +
'\n' +
'            contextMenuOrder: 1.5,\n' +
'\n' +
'            // Method that will be executed when the action is triggered.\n' +
'            // @param editor The editor instance is passed in as a convenience\n' +
'            run: function (ed) {\n' +
'               location.reload(false)\n' +
'            }\n' +
'        });\n' +
'    }\n' +
'\n' +
"    window.denkSetKeyValue('onEditorCreate', (editor) => {\n" +
"        console.info('onEditorCreate', editor)\n" +
'        initCodeLens(editor)\n' +
'        initCommands(editor)\n' +
"        denkSetKeyValue('editornew', editor)\n" +
'    })\n' +
'\n' +
'    // Register a completion item provider for the new language\n' +
'    monaco.languages.registerCompletionItemProvider("markdown", {\n' +
'        provideCompletionItems: () => {\n' +
'            var suggestions = [];\n' +
'\n' +
'            const headerMaxLv = 6;\n' +
'            let headerPrefix = "";\n' +
'            for (let x = 1; x <= headerMaxLv; x++) {\n' +
'                headerPrefix += "#";\n' +
'                suggestions.push({\n' +
'                    label: "_#" + x,\n' +
'                    kind: monaco.languages.CompletionItemKind.Text,\n' +
'                    insertText: headerPrefix + " ${1:header}",\n' +
'                    insertTextRules:\n' +
'                        monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,\n' +
'                    documentation: "Header levele " + x,\n' +
'                });\n' +
'            }\n' +
'            return { suggestions: suggestions };\n' +
'        },\n' +
'    });\n' +
'\n' +
'    const prepareInjectJsResolve = window.denkGetKey("prepareInjectJsResolve");\n' +
'    if (prepareInjectJsResolve) {\n' +
'        prepareInjectJsResolve();\n' +
'    }\n' +
'}'


const defaultJsContents: string[] = []


export default {
    defaultJsContent,
    defaultJsContents,
    injectJsContent
};