import { useState, useRef, useEffect } from 'react';
import Editor from '@monaco-editor/react';
import api from '../lib/axios';
import { Play, Terminal, ChevronDown, Loader2, AlertCircle, CheckCircle2 } from 'lucide-react';

const LANGUAGES = [
    { id: 63, name: 'JavaScript', value: 'javascript', monacoLang: 'javascript' },
    { id: 71, name: 'Python 3', value: 'python', monacoLang: 'python' },
    { id: 54, name: 'C++', value: 'cpp', monacoLang: 'cpp' },
    { id: 50, name: 'C', value: 'c', monacoLang: 'c' },
    { id: 62, name: 'Java', value: 'java', monacoLang: 'java' },
];

// Extract function name and params from JS starter code
function parseFunctionSignature(jsCode) {
    if (!jsCode) return { name: 'solution', params: [] };
    // Match: function name(params) or class Name
    const funcMatch = jsCode.match(/function\s+(\w+)\s*\(([^)]*)\)/);
    if (funcMatch) {
        const name = funcMatch[1];
        const params = funcMatch[2].split(',').map(p => p.trim()).filter(Boolean);
        return { name, params };
    }
    const classMatch = jsCode.match(/class\s+(\w+)/);
    if (classMatch) {
        return { name: classMatch[1], params: [], isClass: true };
    }
    return { name: 'solution', params: [] };
}

// Generate language-specific starter code from the JS starter
function generateStarterCode(language, jsStarterCode) {
    if (!jsStarterCode) {
        const defaults = {
            javascript: '// JavaScript\nconsole.log("Hello, World!");',
            python: '# Python 3\nprint("Hello, World!")',
            cpp: '#include <iostream>\nusing namespace std;\n\nint main() {\n    cout << "Hello, World!" << endl;\n    return 0;\n}',
            c: '#include <stdio.h>\n\nint main() {\n    printf("Hello, World!\\n");\n    return 0;\n}',
            java: 'public class Main {\n    public static void main(String[] args) {\n        System.out.println("Hello, World!");\n    }\n}',
        };
        return defaults[language] || defaults.javascript;
    }

    if (language === 'javascript') return jsStarterCode;

    const { name, params, isClass } = parseFunctionSignature(jsStarterCode);

    if (isClass) {
        switch (language) {
            case 'python':
                return `class ${name}:\n    def __init__(self):\n        # your code here\n        pass\n\n    # Add methods here\n`;
            case 'cpp':
                return `#include <iostream>\n#include <vector>\n#include <unordered_map>\nusing namespace std;\n\nclass ${name} {\npublic:\n    ${name}() {\n        // your code here\n    }\n};\n`;
            case 'c':
                return `#include <stdio.h>\n#include <stdlib.h>\n\n// Implement ${name} using structs and functions\ntypedef struct {\n    // your fields here\n} ${name};\n`;
            case 'java':
                return `import java.util.*;\n\nclass ${name} {\n    public ${name}() {\n        // your code here\n    }\n}\n`;
            default:
                return jsStarterCode;
        }
    }

    const pyParams = params.join(', ');
    const cppParams = params.map(p => `auto ${p}`).join(', ');
    const cParams = params.map(p => `int ${p}`).join(', ');
    const javaParams = params.map(p => `Object ${p}`).join(', ');

    switch (language) {
        case 'python':
            return `def ${name}(${pyParams}):\n    # your code here\n    pass\n`;
        case 'cpp':
            return `#include <iostream>\n#include <vector>\n#include <string>\n#include <unordered_map>\n#include <algorithm>\nusing namespace std;\n\nauto ${name}(${cppParams}) {\n    // your code here\n}\n`;
        case 'c':
            return `#include <stdio.h>\n#include <stdlib.h>\n#include <string.h>\n#include <stdbool.h>\n\nint ${name}(${cParams}) {\n    // your code here\n    return 0;\n}\n`;
        case 'java':
            return `import java.util.*;\n\npublic class Main {\n    public static Object ${name}(${javaParams}) {\n        // your code here\n        return null;\n    }\n\n    public static void main(String[] args) {\n        // test your solution here\n    }\n}\n`;
        default:
            return jsStarterCode;
    }
}

const CodeEditor = ({ initialCode, onRunSuccess }) => {
    const [language, setLanguage] = useState(LANGUAGES[0]);
    const [code, setCode] = useState(initialCode || generateStarterCode('javascript', null));
    const [stdin, setStdin] = useState('');
    const [output, setOutput] = useState(null);
    const [isRunning, setIsRunning] = useState(false);
    const [showInput, setShowInput] = useState(false);
    const [showLangMenu, setShowLangMenu] = useState(false);
    const editorRef = useRef(null);
    const dropdownRef = useRef(null);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setShowLangMenu(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleEditorMount = (editor) => {
        editorRef.current = editor;
    };

    const handleLanguageChange = (langValue) => {
        const newLang = LANGUAGES.find(l => l.value === langValue);
        if (newLang) {
            setLanguage(newLang);
            // Always regenerate the starter code for the new language
            const newCode = generateStarterCode(newLang.value, initialCode);
            setCode(newCode);
            setShowLangMenu(false);
        }
    };

    const handleRun = async () => {
        setIsRunning(true);
        setOutput(null);

        try {
            const { data } = await api.post('/code/run', {
                language_id: language.id,
                source_code: code,
                stdin: stdin,
            });

            setOutput(data);

            if (data.status?.id === 3 && onRunSuccess) {
                onRunSuccess();
            }
        } catch (error) {
            const errMsg = error.response?.data?.message || error.message || 'Unknown error';
            setOutput({
                stderr: errMsg,
                status: { id: 0, description: 'Error' },
            });
        } finally {
            setIsRunning(false);
        }
    };

    const getStatusIcon = () => {
        if (!output) return null;
        const statusId = output.status?.id;
        if (statusId === 3) return <CheckCircle2 className="h-4 w-4 text-emerald-400" />;
        return <AlertCircle className="h-4 w-4 text-red-400" />;
    };

    const getStatusColor = () => {
        if (!output) return '';
        return output.status?.id === 3 ? 'text-emerald-400' : 'text-red-400';
    };

    const getOutputText = () => {
        if (!output) return '';
        const parts = [];
        if (output.compile_output) parts.push(`Compilation:\n${output.compile_output}`);
        if (output.stdout) parts.push(output.stdout);
        if (output.stderr) parts.push(`Error:\n${output.stderr}`);
        if (output.message) parts.push(output.message);
        if (parts.length === 0) parts.push('No output');
        return parts.join('\n');
    };

    return (
        <div className="flex flex-col h-full gap-3">
            {/* Editor Panel */}
            <div className="flex-1 bg-card border border-border/30 rounded-xl flex flex-col overflow-hidden min-h-0">
                {/* Editor Header */}
                <div className="bg-accent/30 border-b border-border/30 px-4 py-2 flex justify-between items-center flex-shrink-0">
                    <div className="flex items-center gap-3">
                        {/* macOS dots */}
                        <div className="flex gap-1.5">
                            <div className="w-3 h-3 rounded-full bg-red-500/60" />
                            <div className="w-3 h-3 rounded-full bg-amber-500/60" />
                            <div className="w-3 h-3 rounded-full bg-emerald-500/60" />
                        </div>

                        {/* Language Selector - Custom Dropdown */}
                        <div className="relative" ref={dropdownRef}>
                            <button
                                onClick={() => setShowLangMenu(!showLangMenu)}
                                className="flex items-center gap-2 bg-black border border-border/40 rounded-lg pl-3 pr-2 py-1.5 text-xs font-medium text-foreground cursor-pointer hover:border-primary/50 transition-colors focus:outline-none focus:ring-1 focus:ring-primary/50"
                            >
                                {language.name}
                                <ChevronDown className={`h-3 w-3 text-muted-foreground transition-transform ${showLangMenu ? 'rotate-180' : ''}`} />
                            </button>

                            {showLangMenu && (
                                <div className="absolute top-full left-0 mt-1 bg-black border border-border/40 rounded-lg overflow-hidden shadow-xl shadow-black/50 z-50 min-w-[140px]">
                                    {LANGUAGES.map(lang => (
                                        <button
                                            key={lang.value}
                                            onClick={() => handleLanguageChange(lang.value)}
                                            className={`w-full text-left px-3 py-2 text-xs font-medium transition-colors ${language.value === lang.value
                                                    ? 'bg-primary/15 text-primary'
                                                    : 'text-foreground hover:bg-white/5'
                                                }`}
                                        >
                                            {lang.name}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        {/* Custom Input Toggle */}
                        <button
                            onClick={() => setShowInput(!showInput)}
                            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all border ${showInput
                                ? 'bg-primary/10 border-primary/30 text-primary'
                                : 'bg-black border-border/40 text-muted-foreground hover:border-primary/50'
                                }`}
                        >
                            Custom Input
                        </button>

                        {/* Run Button */}
                        <button
                            onClick={handleRun}
                            disabled={isRunning}
                            className="inline-flex items-center px-4 py-1.5 bg-primary text-black rounded-lg text-xs font-semibold hover:bg-lime-400 transition-all shadow-md shadow-primary/20 disabled:opacity-60 disabled:cursor-not-allowed"
                        >
                            {isRunning ? (
                                <Loader2 className="h-3.5 w-3.5 mr-1.5 animate-spin" />
                            ) : (
                                <Play className="h-3.5 w-3.5 mr-1.5" />
                            )}
                            {isRunning ? 'Running...' : 'Run Code'}
                        </button>
                    </div>
                </div>

                {/* Monaco Editor */}
                <div className="flex-1 min-h-0">
                    <Editor
                        height="100%"
                        language={language.monacoLang}
                        value={code}
                        onChange={(value) => setCode(value || '')}
                        onMount={handleEditorMount}
                        theme="vs-dark"
                        options={{
                            fontSize: 14,
                            fontFamily: "'JetBrains Mono', 'Fira Code', 'Cascadia Code', Consolas, monospace",
                            minimap: { enabled: false },
                            scrollBeyondLastLine: false,
                            padding: { top: 16, bottom: 16 },
                            lineNumbers: 'on',
                            roundedSelection: true,
                            automaticLayout: true,
                            tabSize: 4,
                            wordWrap: 'on',
                            suggestOnTriggerCharacters: true,
                            formatOnPaste: true,
                            cursorBlinking: 'smooth',
                            cursorSmoothCaretAnimation: 'on',
                            smoothScrolling: true,
                            renderLineHighlight: 'all',
                            bracketPairColorization: { enabled: true },
                        }}
                    />
                </div>

                {/* Custom Input Area (collapsible) */}
                {showInput && (
                    <div className="border-t border-border/30 bg-background/30">
                        <div className="px-4 py-2 flex items-center gap-2 border-b border-border/20">
                            <span className="text-xs font-medium text-muted-foreground">stdin</span>
                        </div>
                        <textarea
                            value={stdin}
                            onChange={(e) => setStdin(e.target.value)}
                            placeholder="Enter custom input here..."
                            className="w-full p-3 bg-transparent text-sm font-mono text-foreground resize-none focus:outline-none h-20"
                            spellCheck="false"
                        />
                    </div>
                )}
            </div>

            {/* Output Panel */}
            <div className="h-40 bg-card border border-border/30 rounded-xl overflow-hidden flex flex-col flex-shrink-0">
                <div className="bg-accent/30 border-b border-border/30 px-4 py-2 flex items-center justify-between flex-shrink-0">
                    <div className="flex items-center gap-2">
                        <Terminal className="h-3.5 w-3.5 text-muted-foreground" />
                        <span className="text-xs font-medium text-muted-foreground">Output</span>
                    </div>
                    {output && (
                        <div className="flex items-center gap-2">
                            {getStatusIcon()}
                            <span className={`text-xs font-medium ${getStatusColor()}`}>
                                {output.status?.description || 'Unknown'}
                            </span>
                            {output.time && (
                                <span className="text-xs text-muted-foreground">
                                    {output.time}s · {Math.round((output.memory || 0) / 1024)}MB
                                </span>
                            )}
                        </div>
                    )}
                </div>
                <pre className="flex-1 p-4 overflow-y-auto font-mono text-xs text-muted-foreground whitespace-pre-wrap">
                    {isRunning ? (
                        <span className="flex items-center gap-2 text-primary">
                            <Loader2 className="h-3 w-3 animate-spin" />
                            Executing code...
                        </span>
                    ) : output ? (
                        getOutputText()
                    ) : (
                        <span className="text-muted-foreground/50">Run your code to see output...</span>
                    )}
                </pre>
            </div>
        </div>
    );
};

export default CodeEditor;
