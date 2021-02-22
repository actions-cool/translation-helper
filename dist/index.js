module.exports =
/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ 7351:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {

"use strict";

var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
const os = __importStar(__nccwpck_require__(2087));
const utils_1 = __nccwpck_require__(5278);
/**
 * Commands
 *
 * Command Format:
 *   ::name key=value,key=value::message
 *
 * Examples:
 *   ::warning::This is the message
 *   ::set-env name=MY_VAR::some value
 */
function issueCommand(command, properties, message) {
    const cmd = new Command(command, properties, message);
    process.stdout.write(cmd.toString() + os.EOL);
}
exports.issueCommand = issueCommand;
function issue(name, message = '') {
    issueCommand(name, {}, message);
}
exports.issue = issue;
const CMD_STRING = '::';
class Command {
    constructor(command, properties, message) {
        if (!command) {
            command = 'missing.command';
        }
        this.command = command;
        this.properties = properties;
        this.message = message;
    }
    toString() {
        let cmdStr = CMD_STRING + this.command;
        if (this.properties && Object.keys(this.properties).length > 0) {
            cmdStr += ' ';
            let first = true;
            for (const key in this.properties) {
                if (this.properties.hasOwnProperty(key)) {
                    const val = this.properties[key];
                    if (val) {
                        if (first) {
                            first = false;
                        }
                        else {
                            cmdStr += ',';
                        }
                        cmdStr += `${key}=${escapeProperty(val)}`;
                    }
                }
            }
        }
        cmdStr += `${CMD_STRING}${escapeData(this.message)}`;
        return cmdStr;
    }
}
function escapeData(s) {
    return utils_1.toCommandValue(s)
        .replace(/%/g, '%25')
        .replace(/\r/g, '%0D')
        .replace(/\n/g, '%0A');
}
function escapeProperty(s) {
    return utils_1.toCommandValue(s)
        .replace(/%/g, '%25')
        .replace(/\r/g, '%0D')
        .replace(/\n/g, '%0A')
        .replace(/:/g, '%3A')
        .replace(/,/g, '%2C');
}
//# sourceMappingURL=command.js.map

/***/ }),

/***/ 2186:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {

"use strict";

var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
const command_1 = __nccwpck_require__(7351);
const file_command_1 = __nccwpck_require__(717);
const utils_1 = __nccwpck_require__(5278);
const os = __importStar(__nccwpck_require__(2087));
const path = __importStar(__nccwpck_require__(5622));
/**
 * The code to exit an action
 */
var ExitCode;
(function (ExitCode) {
    /**
     * A code indicating that the action was successful
     */
    ExitCode[ExitCode["Success"] = 0] = "Success";
    /**
     * A code indicating that the action was a failure
     */
    ExitCode[ExitCode["Failure"] = 1] = "Failure";
})(ExitCode = exports.ExitCode || (exports.ExitCode = {}));
//-----------------------------------------------------------------------
// Variables
//-----------------------------------------------------------------------
/**
 * Sets env variable for this action and future actions in the job
 * @param name the name of the variable to set
 * @param val the value of the variable. Non-string values will be converted to a string via JSON.stringify
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function exportVariable(name, val) {
    const convertedVal = utils_1.toCommandValue(val);
    process.env[name] = convertedVal;
    const filePath = process.env['GITHUB_ENV'] || '';
    if (filePath) {
        const delimiter = '_GitHubActionsFileCommandDelimeter_';
        const commandValue = `${name}<<${delimiter}${os.EOL}${convertedVal}${os.EOL}${delimiter}`;
        file_command_1.issueCommand('ENV', commandValue);
    }
    else {
        command_1.issueCommand('set-env', { name }, convertedVal);
    }
}
exports.exportVariable = exportVariable;
/**
 * Registers a secret which will get masked from logs
 * @param secret value of the secret
 */
function setSecret(secret) {
    command_1.issueCommand('add-mask', {}, secret);
}
exports.setSecret = setSecret;
/**
 * Prepends inputPath to the PATH (for this action and future actions)
 * @param inputPath
 */
function addPath(inputPath) {
    const filePath = process.env['GITHUB_PATH'] || '';
    if (filePath) {
        file_command_1.issueCommand('PATH', inputPath);
    }
    else {
        command_1.issueCommand('add-path', {}, inputPath);
    }
    process.env['PATH'] = `${inputPath}${path.delimiter}${process.env['PATH']}`;
}
exports.addPath = addPath;
/**
 * Gets the value of an input.  The value is also trimmed.
 *
 * @param     name     name of the input to get
 * @param     options  optional. See InputOptions.
 * @returns   string
 */
function getInput(name, options) {
    const val = process.env[`INPUT_${name.replace(/ /g, '_').toUpperCase()}`] || '';
    if (options && options.required && !val) {
        throw new Error(`Input required and not supplied: ${name}`);
    }
    return val.trim();
}
exports.getInput = getInput;
/**
 * Sets the value of an output.
 *
 * @param     name     name of the output to set
 * @param     value    value to store. Non-string values will be converted to a string via JSON.stringify
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function setOutput(name, value) {
    command_1.issueCommand('set-output', { name }, value);
}
exports.setOutput = setOutput;
/**
 * Enables or disables the echoing of commands into stdout for the rest of the step.
 * Echoing is disabled by default if ACTIONS_STEP_DEBUG is not set.
 *
 */
function setCommandEcho(enabled) {
    command_1.issue('echo', enabled ? 'on' : 'off');
}
exports.setCommandEcho = setCommandEcho;
//-----------------------------------------------------------------------
// Results
//-----------------------------------------------------------------------
/**
 * Sets the action status to failed.
 * When the action exits it will be with an exit code of 1
 * @param message add error issue message
 */
function setFailed(message) {
    process.exitCode = ExitCode.Failure;
    error(message);
}
exports.setFailed = setFailed;
//-----------------------------------------------------------------------
// Logging Commands
//-----------------------------------------------------------------------
/**
 * Gets whether Actions Step Debug is on or not
 */
function isDebug() {
    return process.env['RUNNER_DEBUG'] === '1';
}
exports.isDebug = isDebug;
/**
 * Writes debug message to user log
 * @param message debug message
 */
function debug(message) {
    command_1.issueCommand('debug', {}, message);
}
exports.debug = debug;
/**
 * Adds an error issue
 * @param message error issue message. Errors will be converted to string via toString()
 */
function error(message) {
    command_1.issue('error', message instanceof Error ? message.toString() : message);
}
exports.error = error;
/**
 * Adds an warning issue
 * @param message warning issue message. Errors will be converted to string via toString()
 */
function warning(message) {
    command_1.issue('warning', message instanceof Error ? message.toString() : message);
}
exports.warning = warning;
/**
 * Writes info to log with console.log.
 * @param message info message
 */
function info(message) {
    process.stdout.write(message + os.EOL);
}
exports.info = info;
/**
 * Begin an output group.
 *
 * Output until the next `groupEnd` will be foldable in this group
 *
 * @param name The name of the output group
 */
function startGroup(name) {
    command_1.issue('group', name);
}
exports.startGroup = startGroup;
/**
 * End an output group.
 */
function endGroup() {
    command_1.issue('endgroup');
}
exports.endGroup = endGroup;
/**
 * Wrap an asynchronous function call in a group.
 *
 * Returns the same type as the function itself.
 *
 * @param name The name of the group
 * @param fn The function to wrap in the group
 */
function group(name, fn) {
    return __awaiter(this, void 0, void 0, function* () {
        startGroup(name);
        let result;
        try {
            result = yield fn();
        }
        finally {
            endGroup();
        }
        return result;
    });
}
exports.group = group;
//-----------------------------------------------------------------------
// Wrapper action state
//-----------------------------------------------------------------------
/**
 * Saves state for current action, the state can only be retrieved by this action's post job execution.
 *
 * @param     name     name of the state to store
 * @param     value    value to store. Non-string values will be converted to a string via JSON.stringify
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function saveState(name, value) {
    command_1.issueCommand('save-state', { name }, value);
}
exports.saveState = saveState;
/**
 * Gets the value of an state set by this action's main execution.
 *
 * @param     name     name of the state to get
 * @returns   string
 */
function getState(name) {
    return process.env[`STATE_${name}`] || '';
}
exports.getState = getState;
//# sourceMappingURL=core.js.map

/***/ }),

/***/ 717:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {

"use strict";

// For internal use, subject to change.
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
// We use any as a valid input type
/* eslint-disable @typescript-eslint/no-explicit-any */
const fs = __importStar(__nccwpck_require__(5747));
const os = __importStar(__nccwpck_require__(2087));
const utils_1 = __nccwpck_require__(5278);
function issueCommand(command, message) {
    const filePath = process.env[`GITHUB_${command}`];
    if (!filePath) {
        throw new Error(`Unable to find environment variable for file command ${command}`);
    }
    if (!fs.existsSync(filePath)) {
        throw new Error(`Missing file at path: ${filePath}`);
    }
    fs.appendFileSync(filePath, `${utils_1.toCommandValue(message)}${os.EOL}`, {
        encoding: 'utf8'
    });
}
exports.issueCommand = issueCommand;
//# sourceMappingURL=file-command.js.map

/***/ }),

/***/ 5278:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

// We use any as a valid input type
/* eslint-disable @typescript-eslint/no-explicit-any */
Object.defineProperty(exports, "__esModule", ({ value: true }));
/**
 * Sanitizes an input into a string so it can be passed into issueCommand safely
 * @param input input to sanitize into a string
 */
function toCommandValue(input) {
    if (input === null || input === undefined) {
        return '';
    }
    else if (typeof input === 'string' || input instanceof String) {
        return input;
    }
    return JSON.stringify(input);
}
exports.toCommandValue = toCommandValue;
//# sourceMappingURL=utils.js.map

/***/ }),

/***/ 4087:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Context = void 0;
const fs_1 = __nccwpck_require__(5747);
const os_1 = __nccwpck_require__(2087);
class Context {
    /**
     * Hydrate the context from the environment
     */
    constructor() {
        this.payload = {};
        if (process.env.GITHUB_EVENT_PATH) {
            if (fs_1.existsSync(process.env.GITHUB_EVENT_PATH)) {
                this.payload = JSON.parse(fs_1.readFileSync(process.env.GITHUB_EVENT_PATH, { encoding: 'utf8' }));
            }
            else {
                const path = process.env.GITHUB_EVENT_PATH;
                process.stdout.write(`GITHUB_EVENT_PATH ${path} does not exist${os_1.EOL}`);
            }
        }
        this.eventName = process.env.GITHUB_EVENT_NAME;
        this.sha = process.env.GITHUB_SHA;
        this.ref = process.env.GITHUB_REF;
        this.workflow = process.env.GITHUB_WORKFLOW;
        this.action = process.env.GITHUB_ACTION;
        this.actor = process.env.GITHUB_ACTOR;
        this.job = process.env.GITHUB_JOB;
        this.runNumber = parseInt(process.env.GITHUB_RUN_NUMBER, 10);
        this.runId = parseInt(process.env.GITHUB_RUN_ID, 10);
    }
    get issue() {
        const payload = this.payload;
        return Object.assign(Object.assign({}, this.repo), { number: (payload.issue || payload.pull_request || payload).number });
    }
    get repo() {
        if (process.env.GITHUB_REPOSITORY) {
            const [owner, repo] = process.env.GITHUB_REPOSITORY.split('/');
            return { owner, repo };
        }
        if (this.payload.repository) {
            return {
                owner: this.payload.repository.owner.login,
                repo: this.payload.repository.name
            };
        }
        throw new Error("context.repo requires a GITHUB_REPOSITORY environment variable like 'owner/repo'");
    }
}
exports.Context = Context;
//# sourceMappingURL=context.js.map

/***/ }),

/***/ 5438:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {

"use strict";

var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.getOctokit = exports.context = void 0;
const Context = __importStar(__nccwpck_require__(4087));
const utils_1 = __nccwpck_require__(3030);
exports.context = new Context.Context();
/**
 * Returns a hydrated octokit ready to use for GitHub Actions
 *
 * @param     token    the repo PAT or GITHUB_TOKEN
 * @param     options  other options to set
 */
function getOctokit(token, options) {
    return new utils_1.GitHub(utils_1.getOctokitOptions(token, options));
}
exports.getOctokit = getOctokit;
//# sourceMappingURL=github.js.map

/***/ }),

/***/ 7914:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {

"use strict";

var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.getApiBaseUrl = exports.getProxyAgent = exports.getAuthString = void 0;
const httpClient = __importStar(__nccwpck_require__(9925));
function getAuthString(token, options) {
    if (!token && !options.auth) {
        throw new Error('Parameter token or opts.auth is required');
    }
    else if (token && options.auth) {
        throw new Error('Parameters token and opts.auth may not both be specified');
    }
    return typeof options.auth === 'string' ? options.auth : `token ${token}`;
}
exports.getAuthString = getAuthString;
function getProxyAgent(destinationUrl) {
    const hc = new httpClient.HttpClient();
    return hc.getAgent(destinationUrl);
}
exports.getProxyAgent = getProxyAgent;
function getApiBaseUrl() {
    return process.env['GITHUB_API_URL'] || 'https://api.github.com';
}
exports.getApiBaseUrl = getApiBaseUrl;
//# sourceMappingURL=utils.js.map

/***/ }),

/***/ 3030:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {

"use strict";

var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.getOctokitOptions = exports.GitHub = exports.context = void 0;
const Context = __importStar(__nccwpck_require__(4087));
const Utils = __importStar(__nccwpck_require__(7914));
// octokit + plugins
const core_1 = __nccwpck_require__(6762);
const plugin_rest_endpoint_methods_1 = __nccwpck_require__(3044);
const plugin_paginate_rest_1 = __nccwpck_require__(4193);
exports.context = new Context.Context();
const baseUrl = Utils.getApiBaseUrl();
const defaults = {
    baseUrl,
    request: {
        agent: Utils.getProxyAgent(baseUrl)
    }
};
exports.GitHub = core_1.Octokit.plugin(plugin_rest_endpoint_methods_1.restEndpointMethods, plugin_paginate_rest_1.paginateRest).defaults(defaults);
/**
 * Convience function to correctly format Octokit Options to pass into the constructor.
 *
 * @param     token    the repo PAT or GITHUB_TOKEN
 * @param     options  other options to set
 */
function getOctokitOptions(token, options) {
    const opts = Object.assign({}, options || {}); // Shallow clone - don't mutate the object provided by the caller
    // Auth
    const auth = Utils.getAuthString(token, opts);
    if (auth) {
        opts.auth = auth;
    }
    return opts;
}
exports.getOctokitOptions = getOctokitOptions;
//# sourceMappingURL=utils.js.map

/***/ }),

/***/ 9925:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
const http = __nccwpck_require__(8605);
const https = __nccwpck_require__(7211);
const pm = __nccwpck_require__(6443);
let tunnel;
var HttpCodes;
(function (HttpCodes) {
    HttpCodes[HttpCodes["OK"] = 200] = "OK";
    HttpCodes[HttpCodes["MultipleChoices"] = 300] = "MultipleChoices";
    HttpCodes[HttpCodes["MovedPermanently"] = 301] = "MovedPermanently";
    HttpCodes[HttpCodes["ResourceMoved"] = 302] = "ResourceMoved";
    HttpCodes[HttpCodes["SeeOther"] = 303] = "SeeOther";
    HttpCodes[HttpCodes["NotModified"] = 304] = "NotModified";
    HttpCodes[HttpCodes["UseProxy"] = 305] = "UseProxy";
    HttpCodes[HttpCodes["SwitchProxy"] = 306] = "SwitchProxy";
    HttpCodes[HttpCodes["TemporaryRedirect"] = 307] = "TemporaryRedirect";
    HttpCodes[HttpCodes["PermanentRedirect"] = 308] = "PermanentRedirect";
    HttpCodes[HttpCodes["BadRequest"] = 400] = "BadRequest";
    HttpCodes[HttpCodes["Unauthorized"] = 401] = "Unauthorized";
    HttpCodes[HttpCodes["PaymentRequired"] = 402] = "PaymentRequired";
    HttpCodes[HttpCodes["Forbidden"] = 403] = "Forbidden";
    HttpCodes[HttpCodes["NotFound"] = 404] = "NotFound";
    HttpCodes[HttpCodes["MethodNotAllowed"] = 405] = "MethodNotAllowed";
    HttpCodes[HttpCodes["NotAcceptable"] = 406] = "NotAcceptable";
    HttpCodes[HttpCodes["ProxyAuthenticationRequired"] = 407] = "ProxyAuthenticationRequired";
    HttpCodes[HttpCodes["RequestTimeout"] = 408] = "RequestTimeout";
    HttpCodes[HttpCodes["Conflict"] = 409] = "Conflict";
    HttpCodes[HttpCodes["Gone"] = 410] = "Gone";
    HttpCodes[HttpCodes["TooManyRequests"] = 429] = "TooManyRequests";
    HttpCodes[HttpCodes["InternalServerError"] = 500] = "InternalServerError";
    HttpCodes[HttpCodes["NotImplemented"] = 501] = "NotImplemented";
    HttpCodes[HttpCodes["BadGateway"] = 502] = "BadGateway";
    HttpCodes[HttpCodes["ServiceUnavailable"] = 503] = "ServiceUnavailable";
    HttpCodes[HttpCodes["GatewayTimeout"] = 504] = "GatewayTimeout";
})(HttpCodes = exports.HttpCodes || (exports.HttpCodes = {}));
var Headers;
(function (Headers) {
    Headers["Accept"] = "accept";
    Headers["ContentType"] = "content-type";
})(Headers = exports.Headers || (exports.Headers = {}));
var MediaTypes;
(function (MediaTypes) {
    MediaTypes["ApplicationJson"] = "application/json";
})(MediaTypes = exports.MediaTypes || (exports.MediaTypes = {}));
/**
 * Returns the proxy URL, depending upon the supplied url and proxy environment variables.
 * @param serverUrl  The server URL where the request will be sent. For example, https://api.github.com
 */
function getProxyUrl(serverUrl) {
    let proxyUrl = pm.getProxyUrl(new URL(serverUrl));
    return proxyUrl ? proxyUrl.href : '';
}
exports.getProxyUrl = getProxyUrl;
const HttpRedirectCodes = [
    HttpCodes.MovedPermanently,
    HttpCodes.ResourceMoved,
    HttpCodes.SeeOther,
    HttpCodes.TemporaryRedirect,
    HttpCodes.PermanentRedirect
];
const HttpResponseRetryCodes = [
    HttpCodes.BadGateway,
    HttpCodes.ServiceUnavailable,
    HttpCodes.GatewayTimeout
];
const RetryableHttpVerbs = ['OPTIONS', 'GET', 'DELETE', 'HEAD'];
const ExponentialBackoffCeiling = 10;
const ExponentialBackoffTimeSlice = 5;
class HttpClientError extends Error {
    constructor(message, statusCode) {
        super(message);
        this.name = 'HttpClientError';
        this.statusCode = statusCode;
        Object.setPrototypeOf(this, HttpClientError.prototype);
    }
}
exports.HttpClientError = HttpClientError;
class HttpClientResponse {
    constructor(message) {
        this.message = message;
    }
    readBody() {
        return new Promise(async (resolve, reject) => {
            let output = Buffer.alloc(0);
            this.message.on('data', (chunk) => {
                output = Buffer.concat([output, chunk]);
            });
            this.message.on('end', () => {
                resolve(output.toString());
            });
        });
    }
}
exports.HttpClientResponse = HttpClientResponse;
function isHttps(requestUrl) {
    let parsedUrl = new URL(requestUrl);
    return parsedUrl.protocol === 'https:';
}
exports.isHttps = isHttps;
class HttpClient {
    constructor(userAgent, handlers, requestOptions) {
        this._ignoreSslError = false;
        this._allowRedirects = true;
        this._allowRedirectDowngrade = false;
        this._maxRedirects = 50;
        this._allowRetries = false;
        this._maxRetries = 1;
        this._keepAlive = false;
        this._disposed = false;
        this.userAgent = userAgent;
        this.handlers = handlers || [];
        this.requestOptions = requestOptions;
        if (requestOptions) {
            if (requestOptions.ignoreSslError != null) {
                this._ignoreSslError = requestOptions.ignoreSslError;
            }
            this._socketTimeout = requestOptions.socketTimeout;
            if (requestOptions.allowRedirects != null) {
                this._allowRedirects = requestOptions.allowRedirects;
            }
            if (requestOptions.allowRedirectDowngrade != null) {
                this._allowRedirectDowngrade = requestOptions.allowRedirectDowngrade;
            }
            if (requestOptions.maxRedirects != null) {
                this._maxRedirects = Math.max(requestOptions.maxRedirects, 0);
            }
            if (requestOptions.keepAlive != null) {
                this._keepAlive = requestOptions.keepAlive;
            }
            if (requestOptions.allowRetries != null) {
                this._allowRetries = requestOptions.allowRetries;
            }
            if (requestOptions.maxRetries != null) {
                this._maxRetries = requestOptions.maxRetries;
            }
        }
    }
    options(requestUrl, additionalHeaders) {
        return this.request('OPTIONS', requestUrl, null, additionalHeaders || {});
    }
    get(requestUrl, additionalHeaders) {
        return this.request('GET', requestUrl, null, additionalHeaders || {});
    }
    del(requestUrl, additionalHeaders) {
        return this.request('DELETE', requestUrl, null, additionalHeaders || {});
    }
    post(requestUrl, data, additionalHeaders) {
        return this.request('POST', requestUrl, data, additionalHeaders || {});
    }
    patch(requestUrl, data, additionalHeaders) {
        return this.request('PATCH', requestUrl, data, additionalHeaders || {});
    }
    put(requestUrl, data, additionalHeaders) {
        return this.request('PUT', requestUrl, data, additionalHeaders || {});
    }
    head(requestUrl, additionalHeaders) {
        return this.request('HEAD', requestUrl, null, additionalHeaders || {});
    }
    sendStream(verb, requestUrl, stream, additionalHeaders) {
        return this.request(verb, requestUrl, stream, additionalHeaders);
    }
    /**
     * Gets a typed object from an endpoint
     * Be aware that not found returns a null.  Other errors (4xx, 5xx) reject the promise
     */
    async getJson(requestUrl, additionalHeaders = {}) {
        additionalHeaders[Headers.Accept] = this._getExistingOrDefaultHeader(additionalHeaders, Headers.Accept, MediaTypes.ApplicationJson);
        let res = await this.get(requestUrl, additionalHeaders);
        return this._processResponse(res, this.requestOptions);
    }
    async postJson(requestUrl, obj, additionalHeaders = {}) {
        let data = JSON.stringify(obj, null, 2);
        additionalHeaders[Headers.Accept] = this._getExistingOrDefaultHeader(additionalHeaders, Headers.Accept, MediaTypes.ApplicationJson);
        additionalHeaders[Headers.ContentType] = this._getExistingOrDefaultHeader(additionalHeaders, Headers.ContentType, MediaTypes.ApplicationJson);
        let res = await this.post(requestUrl, data, additionalHeaders);
        return this._processResponse(res, this.requestOptions);
    }
    async putJson(requestUrl, obj, additionalHeaders = {}) {
        let data = JSON.stringify(obj, null, 2);
        additionalHeaders[Headers.Accept] = this._getExistingOrDefaultHeader(additionalHeaders, Headers.Accept, MediaTypes.ApplicationJson);
        additionalHeaders[Headers.ContentType] = this._getExistingOrDefaultHeader(additionalHeaders, Headers.ContentType, MediaTypes.ApplicationJson);
        let res = await this.put(requestUrl, data, additionalHeaders);
        return this._processResponse(res, this.requestOptions);
    }
    async patchJson(requestUrl, obj, additionalHeaders = {}) {
        let data = JSON.stringify(obj, null, 2);
        additionalHeaders[Headers.Accept] = this._getExistingOrDefaultHeader(additionalHeaders, Headers.Accept, MediaTypes.ApplicationJson);
        additionalHeaders[Headers.ContentType] = this._getExistingOrDefaultHeader(additionalHeaders, Headers.ContentType, MediaTypes.ApplicationJson);
        let res = await this.patch(requestUrl, data, additionalHeaders);
        return this._processResponse(res, this.requestOptions);
    }
    /**
     * Makes a raw http request.
     * All other methods such as get, post, patch, and request ultimately call this.
     * Prefer get, del, post and patch
     */
    async request(verb, requestUrl, data, headers) {
        if (this._disposed) {
            throw new Error('Client has already been disposed.');
        }
        let parsedUrl = new URL(requestUrl);
        let info = this._prepareRequest(verb, parsedUrl, headers);
        // Only perform retries on reads since writes may not be idempotent.
        let maxTries = this._allowRetries && RetryableHttpVerbs.indexOf(verb) != -1
            ? this._maxRetries + 1
            : 1;
        let numTries = 0;
        let response;
        while (numTries < maxTries) {
            response = await this.requestRaw(info, data);
            // Check if it's an authentication challenge
            if (response &&
                response.message &&
                response.message.statusCode === HttpCodes.Unauthorized) {
                let authenticationHandler;
                for (let i = 0; i < this.handlers.length; i++) {
                    if (this.handlers[i].canHandleAuthentication(response)) {
                        authenticationHandler = this.handlers[i];
                        break;
                    }
                }
                if (authenticationHandler) {
                    return authenticationHandler.handleAuthentication(this, info, data);
                }
                else {
                    // We have received an unauthorized response but have no handlers to handle it.
                    // Let the response return to the caller.
                    return response;
                }
            }
            let redirectsRemaining = this._maxRedirects;
            while (HttpRedirectCodes.indexOf(response.message.statusCode) != -1 &&
                this._allowRedirects &&
                redirectsRemaining > 0) {
                const redirectUrl = response.message.headers['location'];
                if (!redirectUrl) {
                    // if there's no location to redirect to, we won't
                    break;
                }
                let parsedRedirectUrl = new URL(redirectUrl);
                if (parsedUrl.protocol == 'https:' &&
                    parsedUrl.protocol != parsedRedirectUrl.protocol &&
                    !this._allowRedirectDowngrade) {
                    throw new Error('Redirect from HTTPS to HTTP protocol. This downgrade is not allowed for security reasons. If you want to allow this behavior, set the allowRedirectDowngrade option to true.');
                }
                // we need to finish reading the response before reassigning response
                // which will leak the open socket.
                await response.readBody();
                // strip authorization header if redirected to a different hostname
                if (parsedRedirectUrl.hostname !== parsedUrl.hostname) {
                    for (let header in headers) {
                        // header names are case insensitive
                        if (header.toLowerCase() === 'authorization') {
                            delete headers[header];
                        }
                    }
                }
                // let's make the request with the new redirectUrl
                info = this._prepareRequest(verb, parsedRedirectUrl, headers);
                response = await this.requestRaw(info, data);
                redirectsRemaining--;
            }
            if (HttpResponseRetryCodes.indexOf(response.message.statusCode) == -1) {
                // If not a retry code, return immediately instead of retrying
                return response;
            }
            numTries += 1;
            if (numTries < maxTries) {
                await response.readBody();
                await this._performExponentialBackoff(numTries);
            }
        }
        return response;
    }
    /**
     * Needs to be called if keepAlive is set to true in request options.
     */
    dispose() {
        if (this._agent) {
            this._agent.destroy();
        }
        this._disposed = true;
    }
    /**
     * Raw request.
     * @param info
     * @param data
     */
    requestRaw(info, data) {
        return new Promise((resolve, reject) => {
            let callbackForResult = function (err, res) {
                if (err) {
                    reject(err);
                }
                resolve(res);
            };
            this.requestRawWithCallback(info, data, callbackForResult);
        });
    }
    /**
     * Raw request with callback.
     * @param info
     * @param data
     * @param onResult
     */
    requestRawWithCallback(info, data, onResult) {
        let socket;
        if (typeof data === 'string') {
            info.options.headers['Content-Length'] = Buffer.byteLength(data, 'utf8');
        }
        let callbackCalled = false;
        let handleResult = (err, res) => {
            if (!callbackCalled) {
                callbackCalled = true;
                onResult(err, res);
            }
        };
        let req = info.httpModule.request(info.options, (msg) => {
            let res = new HttpClientResponse(msg);
            handleResult(null, res);
        });
        req.on('socket', sock => {
            socket = sock;
        });
        // If we ever get disconnected, we want the socket to timeout eventually
        req.setTimeout(this._socketTimeout || 3 * 60000, () => {
            if (socket) {
                socket.end();
            }
            handleResult(new Error('Request timeout: ' + info.options.path), null);
        });
        req.on('error', function (err) {
            // err has statusCode property
            // res should have headers
            handleResult(err, null);
        });
        if (data && typeof data === 'string') {
            req.write(data, 'utf8');
        }
        if (data && typeof data !== 'string') {
            data.on('close', function () {
                req.end();
            });
            data.pipe(req);
        }
        else {
            req.end();
        }
    }
    /**
     * Gets an http agent. This function is useful when you need an http agent that handles
     * routing through a proxy server - depending upon the url and proxy environment variables.
     * @param serverUrl  The server URL where the request will be sent. For example, https://api.github.com
     */
    getAgent(serverUrl) {
        let parsedUrl = new URL(serverUrl);
        return this._getAgent(parsedUrl);
    }
    _prepareRequest(method, requestUrl, headers) {
        const info = {};
        info.parsedUrl = requestUrl;
        const usingSsl = info.parsedUrl.protocol === 'https:';
        info.httpModule = usingSsl ? https : http;
        const defaultPort = usingSsl ? 443 : 80;
        info.options = {};
        info.options.host = info.parsedUrl.hostname;
        info.options.port = info.parsedUrl.port
            ? parseInt(info.parsedUrl.port)
            : defaultPort;
        info.options.path =
            (info.parsedUrl.pathname || '') + (info.parsedUrl.search || '');
        info.options.method = method;
        info.options.headers = this._mergeHeaders(headers);
        if (this.userAgent != null) {
            info.options.headers['user-agent'] = this.userAgent;
        }
        info.options.agent = this._getAgent(info.parsedUrl);
        // gives handlers an opportunity to participate
        if (this.handlers) {
            this.handlers.forEach(handler => {
                handler.prepareRequest(info.options);
            });
        }
        return info;
    }
    _mergeHeaders(headers) {
        const lowercaseKeys = obj => Object.keys(obj).reduce((c, k) => ((c[k.toLowerCase()] = obj[k]), c), {});
        if (this.requestOptions && this.requestOptions.headers) {
            return Object.assign({}, lowercaseKeys(this.requestOptions.headers), lowercaseKeys(headers));
        }
        return lowercaseKeys(headers || {});
    }
    _getExistingOrDefaultHeader(additionalHeaders, header, _default) {
        const lowercaseKeys = obj => Object.keys(obj).reduce((c, k) => ((c[k.toLowerCase()] = obj[k]), c), {});
        let clientHeader;
        if (this.requestOptions && this.requestOptions.headers) {
            clientHeader = lowercaseKeys(this.requestOptions.headers)[header];
        }
        return additionalHeaders[header] || clientHeader || _default;
    }
    _getAgent(parsedUrl) {
        let agent;
        let proxyUrl = pm.getProxyUrl(parsedUrl);
        let useProxy = proxyUrl && proxyUrl.hostname;
        if (this._keepAlive && useProxy) {
            agent = this._proxyAgent;
        }
        if (this._keepAlive && !useProxy) {
            agent = this._agent;
        }
        // if agent is already assigned use that agent.
        if (!!agent) {
            return agent;
        }
        const usingSsl = parsedUrl.protocol === 'https:';
        let maxSockets = 100;
        if (!!this.requestOptions) {
            maxSockets = this.requestOptions.maxSockets || http.globalAgent.maxSockets;
        }
        if (useProxy) {
            // If using proxy, need tunnel
            if (!tunnel) {
                tunnel = __nccwpck_require__(4294);
            }
            const agentOptions = {
                maxSockets: maxSockets,
                keepAlive: this._keepAlive,
                proxy: {
                    proxyAuth: `${proxyUrl.username}:${proxyUrl.password}`,
                    host: proxyUrl.hostname,
                    port: proxyUrl.port
                }
            };
            let tunnelAgent;
            const overHttps = proxyUrl.protocol === 'https:';
            if (usingSsl) {
                tunnelAgent = overHttps ? tunnel.httpsOverHttps : tunnel.httpsOverHttp;
            }
            else {
                tunnelAgent = overHttps ? tunnel.httpOverHttps : tunnel.httpOverHttp;
            }
            agent = tunnelAgent(agentOptions);
            this._proxyAgent = agent;
        }
        // if reusing agent across request and tunneling agent isn't assigned create a new agent
        if (this._keepAlive && !agent) {
            const options = { keepAlive: this._keepAlive, maxSockets: maxSockets };
            agent = usingSsl ? new https.Agent(options) : new http.Agent(options);
            this._agent = agent;
        }
        // if not using private agent and tunnel agent isn't setup then use global agent
        if (!agent) {
            agent = usingSsl ? https.globalAgent : http.globalAgent;
        }
        if (usingSsl && this._ignoreSslError) {
            // we don't want to set NODE_TLS_REJECT_UNAUTHORIZED=0 since that will affect request for entire process
            // http.RequestOptions doesn't expose a way to modify RequestOptions.agent.options
            // we have to cast it to any and change it directly
            agent.options = Object.assign(agent.options || {}, {
                rejectUnauthorized: false
            });
        }
        return agent;
    }
    _performExponentialBackoff(retryNumber) {
        retryNumber = Math.min(ExponentialBackoffCeiling, retryNumber);
        const ms = ExponentialBackoffTimeSlice * Math.pow(2, retryNumber);
        return new Promise(resolve => setTimeout(() => resolve(), ms));
    }
    static dateTimeDeserializer(key, value) {
        if (typeof value === 'string') {
            let a = new Date(value);
            if (!isNaN(a.valueOf())) {
                return a;
            }
        }
        return value;
    }
    async _processResponse(res, options) {
        return new Promise(async (resolve, reject) => {
            const statusCode = res.message.statusCode;
            const response = {
                statusCode: statusCode,
                result: null,
                headers: {}
            };
            // not found leads to null obj returned
            if (statusCode == HttpCodes.NotFound) {
                resolve(response);
            }
            let obj;
            let contents;
            // get the result from the body
            try {
                contents = await res.readBody();
                if (contents && contents.length > 0) {
                    if (options && options.deserializeDates) {
                        obj = JSON.parse(contents, HttpClient.dateTimeDeserializer);
                    }
                    else {
                        obj = JSON.parse(contents);
                    }
                    response.result = obj;
                }
                response.headers = res.message.headers;
            }
            catch (err) {
                // Invalid resource (contents not json);  leaving result obj null
            }
            // note that 3xx redirects are handled by the http layer.
            if (statusCode > 299) {
                let msg;
                // if exception/error in body, attempt to get better error
                if (obj && obj.message) {
                    msg = obj.message;
                }
                else if (contents && contents.length > 0) {
                    // it may be the case that the exception is in the body message as string
                    msg = contents;
                }
                else {
                    msg = 'Failed request: (' + statusCode + ')';
                }
                let err = new HttpClientError(msg, statusCode);
                err.result = response.result;
                reject(err);
            }
            else {
                resolve(response);
            }
        });
    }
}
exports.HttpClient = HttpClient;


/***/ }),

/***/ 6443:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
function getProxyUrl(reqUrl) {
    let usingSsl = reqUrl.protocol === 'https:';
    let proxyUrl;
    if (checkBypass(reqUrl)) {
        return proxyUrl;
    }
    let proxyVar;
    if (usingSsl) {
        proxyVar = process.env['https_proxy'] || process.env['HTTPS_PROXY'];
    }
    else {
        proxyVar = process.env['http_proxy'] || process.env['HTTP_PROXY'];
    }
    if (proxyVar) {
        proxyUrl = new URL(proxyVar);
    }
    return proxyUrl;
}
exports.getProxyUrl = getProxyUrl;
function checkBypass(reqUrl) {
    if (!reqUrl.hostname) {
        return false;
    }
    let noProxy = process.env['no_proxy'] || process.env['NO_PROXY'] || '';
    if (!noProxy) {
        return false;
    }
    // Determine the request port
    let reqPort;
    if (reqUrl.port) {
        reqPort = Number(reqUrl.port);
    }
    else if (reqUrl.protocol === 'http:') {
        reqPort = 80;
    }
    else if (reqUrl.protocol === 'https:') {
        reqPort = 443;
    }
    // Format the request hostname and hostname with port
    let upperReqHosts = [reqUrl.hostname.toUpperCase()];
    if (typeof reqPort === 'number') {
        upperReqHosts.push(`${upperReqHosts[0]}:${reqPort}`);
    }
    // Compare request host against noproxy
    for (let upperNoProxyItem of noProxy
        .split(',')
        .map(x => x.trim().toUpperCase())
        .filter(x => x)) {
        if (upperReqHosts.some(x => x === upperNoProxyItem)) {
            return true;
        }
    }
    return false;
}
exports.checkBypass = checkBypass;


/***/ }),

/***/ 334:
/***/ ((__unused_webpack_module, exports) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({ value: true }));

async function auth(token) {
  const tokenType = token.split(/\./).length === 3 ? "app" : /^v\d+\./.test(token) ? "installation" : "oauth";
  return {
    type: "token",
    token: token,
    tokenType
  };
}

/**
 * Prefix token for usage in the Authorization header
 *
 * @param token OAuth token or JSON Web Token
 */
function withAuthorizationPrefix(token) {
  if (token.split(/\./).length === 3) {
    return `bearer ${token}`;
  }

  return `token ${token}`;
}

async function hook(token, request, route, parameters) {
  const endpoint = request.endpoint.merge(route, parameters);
  endpoint.headers.authorization = withAuthorizationPrefix(token);
  return request(endpoint);
}

const createTokenAuth = function createTokenAuth(token) {
  if (!token) {
    throw new Error("[@octokit/auth-token] No token passed to createTokenAuth");
  }

  if (typeof token !== "string") {
    throw new Error("[@octokit/auth-token] Token passed to createTokenAuth is not a string");
  }

  token = token.replace(/^(token|bearer) +/i, "");
  return Object.assign(auth.bind(null, token), {
    hook: hook.bind(null, token)
  });
};

exports.createTokenAuth = createTokenAuth;
//# sourceMappingURL=index.js.map


/***/ }),

/***/ 6762:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({ value: true }));

var universalUserAgent = __nccwpck_require__(5030);
var beforeAfterHook = __nccwpck_require__(3682);
var request = __nccwpck_require__(6234);
var graphql = __nccwpck_require__(8467);
var authToken = __nccwpck_require__(334);

function _objectWithoutPropertiesLoose(source, excluded) {
  if (source == null) return {};
  var target = {};
  var sourceKeys = Object.keys(source);
  var key, i;

  for (i = 0; i < sourceKeys.length; i++) {
    key = sourceKeys[i];
    if (excluded.indexOf(key) >= 0) continue;
    target[key] = source[key];
  }

  return target;
}

function _objectWithoutProperties(source, excluded) {
  if (source == null) return {};

  var target = _objectWithoutPropertiesLoose(source, excluded);

  var key, i;

  if (Object.getOwnPropertySymbols) {
    var sourceSymbolKeys = Object.getOwnPropertySymbols(source);

    for (i = 0; i < sourceSymbolKeys.length; i++) {
      key = sourceSymbolKeys[i];
      if (excluded.indexOf(key) >= 0) continue;
      if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue;
      target[key] = source[key];
    }
  }

  return target;
}

const VERSION = "3.2.5";

class Octokit {
  constructor(options = {}) {
    const hook = new beforeAfterHook.Collection();
    const requestDefaults = {
      baseUrl: request.request.endpoint.DEFAULTS.baseUrl,
      headers: {},
      request: Object.assign({}, options.request, {
        hook: hook.bind(null, "request")
      }),
      mediaType: {
        previews: [],
        format: ""
      }
    }; // prepend default user agent with `options.userAgent` if set

    requestDefaults.headers["user-agent"] = [options.userAgent, `octokit-core.js/${VERSION} ${universalUserAgent.getUserAgent()}`].filter(Boolean).join(" ");

    if (options.baseUrl) {
      requestDefaults.baseUrl = options.baseUrl;
    }

    if (options.previews) {
      requestDefaults.mediaType.previews = options.previews;
    }

    if (options.timeZone) {
      requestDefaults.headers["time-zone"] = options.timeZone;
    }

    this.request = request.request.defaults(requestDefaults);
    this.graphql = graphql.withCustomRequest(this.request).defaults(requestDefaults);
    this.log = Object.assign({
      debug: () => {},
      info: () => {},
      warn: console.warn.bind(console),
      error: console.error.bind(console)
    }, options.log);
    this.hook = hook; // (1) If neither `options.authStrategy` nor `options.auth` are set, the `octokit` instance
    //     is unauthenticated. The `this.auth()` method is a no-op and no request hook is registered.
    // (2) If only `options.auth` is set, use the default token authentication strategy.
    // (3) If `options.authStrategy` is set then use it and pass in `options.auth`. Always pass own request as many strategies accept a custom request instance.
    // TODO: type `options.auth` based on `options.authStrategy`.

    if (!options.authStrategy) {
      if (!options.auth) {
        // (1)
        this.auth = async () => ({
          type: "unauthenticated"
        });
      } else {
        // (2)
        const auth = authToken.createTokenAuth(options.auth); // @ts-ignore  ¯\_(ツ)_/¯

        hook.wrap("request", auth.hook);
        this.auth = auth;
      }
    } else {
      const {
        authStrategy
      } = options,
            otherOptions = _objectWithoutProperties(options, ["authStrategy"]);

      const auth = authStrategy(Object.assign({
        request: this.request,
        log: this.log,
        // we pass the current octokit instance as well as its constructor options
        // to allow for authentication strategies that return a new octokit instance
        // that shares the same internal state as the current one. The original
        // requirement for this was the "event-octokit" authentication strategy
        // of https://github.com/probot/octokit-auth-probot.
        octokit: this,
        octokitOptions: otherOptions
      }, options.auth)); // @ts-ignore  ¯\_(ツ)_/¯

      hook.wrap("request", auth.hook);
      this.auth = auth;
    } // apply plugins
    // https://stackoverflow.com/a/16345172


    const classConstructor = this.constructor;
    classConstructor.plugins.forEach(plugin => {
      Object.assign(this, plugin(this, options));
    });
  }

  static defaults(defaults) {
    const OctokitWithDefaults = class extends this {
      constructor(...args) {
        const options = args[0] || {};

        if (typeof defaults === "function") {
          super(defaults(options));
          return;
        }

        super(Object.assign({}, defaults, options, options.userAgent && defaults.userAgent ? {
          userAgent: `${options.userAgent} ${defaults.userAgent}`
        } : null));
      }

    };
    return OctokitWithDefaults;
  }
  /**
   * Attach a plugin (or many) to your Octokit instance.
   *
   * @example
   * const API = Octokit.plugin(plugin1, plugin2, plugin3, ...)
   */


  static plugin(...newPlugins) {
    var _a;

    const currentPlugins = this.plugins;
    const NewOctokit = (_a = class extends this {}, _a.plugins = currentPlugins.concat(newPlugins.filter(plugin => !currentPlugins.includes(plugin))), _a);
    return NewOctokit;
  }

}
Octokit.VERSION = VERSION;
Octokit.plugins = [];

exports.Octokit = Octokit;
//# sourceMappingURL=index.js.map


/***/ }),

/***/ 9440:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({ value: true }));

var isPlainObject = __nccwpck_require__(558);
var universalUserAgent = __nccwpck_require__(5030);

function lowercaseKeys(object) {
  if (!object) {
    return {};
  }

  return Object.keys(object).reduce((newObj, key) => {
    newObj[key.toLowerCase()] = object[key];
    return newObj;
  }, {});
}

function mergeDeep(defaults, options) {
  const result = Object.assign({}, defaults);
  Object.keys(options).forEach(key => {
    if (isPlainObject.isPlainObject(options[key])) {
      if (!(key in defaults)) Object.assign(result, {
        [key]: options[key]
      });else result[key] = mergeDeep(defaults[key], options[key]);
    } else {
      Object.assign(result, {
        [key]: options[key]
      });
    }
  });
  return result;
}

function removeUndefinedProperties(obj) {
  for (const key in obj) {
    if (obj[key] === undefined) {
      delete obj[key];
    }
  }

  return obj;
}

function merge(defaults, route, options) {
  if (typeof route === "string") {
    let [method, url] = route.split(" ");
    options = Object.assign(url ? {
      method,
      url
    } : {
      url: method
    }, options);
  } else {
    options = Object.assign({}, route);
  } // lowercase header names before merging with defaults to avoid duplicates


  options.headers = lowercaseKeys(options.headers); // remove properties with undefined values before merging

  removeUndefinedProperties(options);
  removeUndefinedProperties(options.headers);
  const mergedOptions = mergeDeep(defaults || {}, options); // mediaType.previews arrays are merged, instead of overwritten

  if (defaults && defaults.mediaType.previews.length) {
    mergedOptions.mediaType.previews = defaults.mediaType.previews.filter(preview => !mergedOptions.mediaType.previews.includes(preview)).concat(mergedOptions.mediaType.previews);
  }

  mergedOptions.mediaType.previews = mergedOptions.mediaType.previews.map(preview => preview.replace(/-preview/, ""));
  return mergedOptions;
}

function addQueryParameters(url, parameters) {
  const separator = /\?/.test(url) ? "&" : "?";
  const names = Object.keys(parameters);

  if (names.length === 0) {
    return url;
  }

  return url + separator + names.map(name => {
    if (name === "q") {
      return "q=" + parameters.q.split("+").map(encodeURIComponent).join("+");
    }

    return `${name}=${encodeURIComponent(parameters[name])}`;
  }).join("&");
}

const urlVariableRegex = /\{[^}]+\}/g;

function removeNonChars(variableName) {
  return variableName.replace(/^\W+|\W+$/g, "").split(/,/);
}

function extractUrlVariableNames(url) {
  const matches = url.match(urlVariableRegex);

  if (!matches) {
    return [];
  }

  return matches.map(removeNonChars).reduce((a, b) => a.concat(b), []);
}

function omit(object, keysToOmit) {
  return Object.keys(object).filter(option => !keysToOmit.includes(option)).reduce((obj, key) => {
    obj[key] = object[key];
    return obj;
  }, {});
}

// Based on https://github.com/bramstein/url-template, licensed under BSD
// TODO: create separate package.
//
// Copyright (c) 2012-2014, Bram Stein
// All rights reserved.
// Redistribution and use in source and binary forms, with or without
// modification, are permitted provided that the following conditions
// are met:
//  1. Redistributions of source code must retain the above copyright
//     notice, this list of conditions and the following disclaimer.
//  2. Redistributions in binary form must reproduce the above copyright
//     notice, this list of conditions and the following disclaimer in the
//     documentation and/or other materials provided with the distribution.
//  3. The name of the author may not be used to endorse or promote products
//     derived from this software without specific prior written permission.
// THIS SOFTWARE IS PROVIDED BY THE AUTHOR "AS IS" AND ANY EXPRESS OR IMPLIED
// WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF
// MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO
// EVENT SHALL THE COPYRIGHT OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT,
// INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING,
// BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE,
// DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY
// OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
// NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE,
// EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.

/* istanbul ignore file */
function encodeReserved(str) {
  return str.split(/(%[0-9A-Fa-f]{2})/g).map(function (part) {
    if (!/%[0-9A-Fa-f]/.test(part)) {
      part = encodeURI(part).replace(/%5B/g, "[").replace(/%5D/g, "]");
    }

    return part;
  }).join("");
}

function encodeUnreserved(str) {
  return encodeURIComponent(str).replace(/[!'()*]/g, function (c) {
    return "%" + c.charCodeAt(0).toString(16).toUpperCase();
  });
}

function encodeValue(operator, value, key) {
  value = operator === "+" || operator === "#" ? encodeReserved(value) : encodeUnreserved(value);

  if (key) {
    return encodeUnreserved(key) + "=" + value;
  } else {
    return value;
  }
}

function isDefined(value) {
  return value !== undefined && value !== null;
}

function isKeyOperator(operator) {
  return operator === ";" || operator === "&" || operator === "?";
}

function getValues(context, operator, key, modifier) {
  var value = context[key],
      result = [];

  if (isDefined(value) && value !== "") {
    if (typeof value === "string" || typeof value === "number" || typeof value === "boolean") {
      value = value.toString();

      if (modifier && modifier !== "*") {
        value = value.substring(0, parseInt(modifier, 10));
      }

      result.push(encodeValue(operator, value, isKeyOperator(operator) ? key : ""));
    } else {
      if (modifier === "*") {
        if (Array.isArray(value)) {
          value.filter(isDefined).forEach(function (value) {
            result.push(encodeValue(operator, value, isKeyOperator(operator) ? key : ""));
          });
        } else {
          Object.keys(value).forEach(function (k) {
            if (isDefined(value[k])) {
              result.push(encodeValue(operator, value[k], k));
            }
          });
        }
      } else {
        const tmp = [];

        if (Array.isArray(value)) {
          value.filter(isDefined).forEach(function (value) {
            tmp.push(encodeValue(operator, value));
          });
        } else {
          Object.keys(value).forEach(function (k) {
            if (isDefined(value[k])) {
              tmp.push(encodeUnreserved(k));
              tmp.push(encodeValue(operator, value[k].toString()));
            }
          });
        }

        if (isKeyOperator(operator)) {
          result.push(encodeUnreserved(key) + "=" + tmp.join(","));
        } else if (tmp.length !== 0) {
          result.push(tmp.join(","));
        }
      }
    }
  } else {
    if (operator === ";") {
      if (isDefined(value)) {
        result.push(encodeUnreserved(key));
      }
    } else if (value === "" && (operator === "&" || operator === "?")) {
      result.push(encodeUnreserved(key) + "=");
    } else if (value === "") {
      result.push("");
    }
  }

  return result;
}

function parseUrl(template) {
  return {
    expand: expand.bind(null, template)
  };
}

function expand(template, context) {
  var operators = ["+", "#", ".", "/", ";", "?", "&"];
  return template.replace(/\{([^\{\}]+)\}|([^\{\}]+)/g, function (_, expression, literal) {
    if (expression) {
      let operator = "";
      const values = [];

      if (operators.indexOf(expression.charAt(0)) !== -1) {
        operator = expression.charAt(0);
        expression = expression.substr(1);
      }

      expression.split(/,/g).forEach(function (variable) {
        var tmp = /([^:\*]*)(?::(\d+)|(\*))?/.exec(variable);
        values.push(getValues(context, operator, tmp[1], tmp[2] || tmp[3]));
      });

      if (operator && operator !== "+") {
        var separator = ",";

        if (operator === "?") {
          separator = "&";
        } else if (operator !== "#") {
          separator = operator;
        }

        return (values.length !== 0 ? operator : "") + values.join(separator);
      } else {
        return values.join(",");
      }
    } else {
      return encodeReserved(literal);
    }
  });
}

function parse(options) {
  // https://fetch.spec.whatwg.org/#methods
  let method = options.method.toUpperCase(); // replace :varname with {varname} to make it RFC 6570 compatible

  let url = (options.url || "/").replace(/:([a-z]\w+)/g, "{$1}");
  let headers = Object.assign({}, options.headers);
  let body;
  let parameters = omit(options, ["method", "baseUrl", "url", "headers", "request", "mediaType"]); // extract variable names from URL to calculate remaining variables later

  const urlVariableNames = extractUrlVariableNames(url);
  url = parseUrl(url).expand(parameters);

  if (!/^http/.test(url)) {
    url = options.baseUrl + url;
  }

  const omittedParameters = Object.keys(options).filter(option => urlVariableNames.includes(option)).concat("baseUrl");
  const remainingParameters = omit(parameters, omittedParameters);
  const isBinaryRequest = /application\/octet-stream/i.test(headers.accept);

  if (!isBinaryRequest) {
    if (options.mediaType.format) {
      // e.g. application/vnd.github.v3+json => application/vnd.github.v3.raw
      headers.accept = headers.accept.split(/,/).map(preview => preview.replace(/application\/vnd(\.\w+)(\.v3)?(\.\w+)?(\+json)?$/, `application/vnd$1$2.${options.mediaType.format}`)).join(",");
    }

    if (options.mediaType.previews.length) {
      const previewsFromAcceptHeader = headers.accept.match(/[\w-]+(?=-preview)/g) || [];
      headers.accept = previewsFromAcceptHeader.concat(options.mediaType.previews).map(preview => {
        const format = options.mediaType.format ? `.${options.mediaType.format}` : "+json";
        return `application/vnd.github.${preview}-preview${format}`;
      }).join(",");
    }
  } // for GET/HEAD requests, set URL query parameters from remaining parameters
  // for PATCH/POST/PUT/DELETE requests, set request body from remaining parameters


  if (["GET", "HEAD"].includes(method)) {
    url = addQueryParameters(url, remainingParameters);
  } else {
    if ("data" in remainingParameters) {
      body = remainingParameters.data;
    } else {
      if (Object.keys(remainingParameters).length) {
        body = remainingParameters;
      } else {
        headers["content-length"] = 0;
      }
    }
  } // default content-type for JSON if body is set


  if (!headers["content-type"] && typeof body !== "undefined") {
    headers["content-type"] = "application/json; charset=utf-8";
  } // GitHub expects 'content-length: 0' header for PUT/PATCH requests without body.
  // fetch does not allow to set `content-length` header, but we can set body to an empty string


  if (["PATCH", "PUT"].includes(method) && typeof body === "undefined") {
    body = "";
  } // Only return body/request keys if present


  return Object.assign({
    method,
    url,
    headers
  }, typeof body !== "undefined" ? {
    body
  } : null, options.request ? {
    request: options.request
  } : null);
}

function endpointWithDefaults(defaults, route, options) {
  return parse(merge(defaults, route, options));
}

function withDefaults(oldDefaults, newDefaults) {
  const DEFAULTS = merge(oldDefaults, newDefaults);
  const endpoint = endpointWithDefaults.bind(null, DEFAULTS);
  return Object.assign(endpoint, {
    DEFAULTS,
    defaults: withDefaults.bind(null, DEFAULTS),
    merge: merge.bind(null, DEFAULTS),
    parse
  });
}

const VERSION = "6.0.11";

const userAgent = `octokit-endpoint.js/${VERSION} ${universalUserAgent.getUserAgent()}`; // DEFAULTS has all properties set that EndpointOptions has, except url.
// So we use RequestParameters and add method as additional required property.

const DEFAULTS = {
  method: "GET",
  baseUrl: "https://api.github.com",
  headers: {
    accept: "application/vnd.github.v3+json",
    "user-agent": userAgent
  },
  mediaType: {
    format: "",
    previews: []
  }
};

const endpoint = withDefaults(null, DEFAULTS);

exports.endpoint = endpoint;
//# sourceMappingURL=index.js.map


/***/ }),

/***/ 558:
/***/ ((__unused_webpack_module, exports) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({ value: true }));

/*!
 * is-plain-object <https://github.com/jonschlinkert/is-plain-object>
 *
 * Copyright (c) 2014-2017, Jon Schlinkert.
 * Released under the MIT License.
 */

function isObject(o) {
  return Object.prototype.toString.call(o) === '[object Object]';
}

function isPlainObject(o) {
  var ctor,prot;

  if (isObject(o) === false) return false;

  // If has modified constructor
  ctor = o.constructor;
  if (ctor === undefined) return true;

  // If has modified prototype
  prot = ctor.prototype;
  if (isObject(prot) === false) return false;

  // If constructor does not have an Object-specific method
  if (prot.hasOwnProperty('isPrototypeOf') === false) {
    return false;
  }

  // Most likely a plain Object
  return true;
}

exports.isPlainObject = isPlainObject;


/***/ }),

/***/ 8467:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({ value: true }));

var request = __nccwpck_require__(6234);
var universalUserAgent = __nccwpck_require__(5030);

const VERSION = "4.6.0";

class GraphqlError extends Error {
  constructor(request, response) {
    const message = response.data.errors[0].message;
    super(message);
    Object.assign(this, response.data);
    Object.assign(this, {
      headers: response.headers
    });
    this.name = "GraphqlError";
    this.request = request; // Maintains proper stack trace (only available on V8)

    /* istanbul ignore next */

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }
  }

}

const NON_VARIABLE_OPTIONS = ["method", "baseUrl", "url", "headers", "request", "query", "mediaType"];
const GHES_V3_SUFFIX_REGEX = /\/api\/v3\/?$/;
function graphql(request, query, options) {
  if (typeof query === "string" && options && "query" in options) {
    return Promise.reject(new Error(`[@octokit/graphql] "query" cannot be used as variable name`));
  }

  const parsedOptions = typeof query === "string" ? Object.assign({
    query
  }, options) : query;
  const requestOptions = Object.keys(parsedOptions).reduce((result, key) => {
    if (NON_VARIABLE_OPTIONS.includes(key)) {
      result[key] = parsedOptions[key];
      return result;
    }

    if (!result.variables) {
      result.variables = {};
    }

    result.variables[key] = parsedOptions[key];
    return result;
  }, {}); // workaround for GitHub Enterprise baseUrl set with /api/v3 suffix
  // https://github.com/octokit/auth-app.js/issues/111#issuecomment-657610451

  const baseUrl = parsedOptions.baseUrl || request.endpoint.DEFAULTS.baseUrl;

  if (GHES_V3_SUFFIX_REGEX.test(baseUrl)) {
    requestOptions.url = baseUrl.replace(GHES_V3_SUFFIX_REGEX, "/api/graphql");
  }

  return request(requestOptions).then(response => {
    if (response.data.errors) {
      const headers = {};

      for (const key of Object.keys(response.headers)) {
        headers[key] = response.headers[key];
      }

      throw new GraphqlError(requestOptions, {
        headers,
        data: response.data
      });
    }

    return response.data.data;
  });
}

function withDefaults(request$1, newDefaults) {
  const newRequest = request$1.defaults(newDefaults);

  const newApi = (query, options) => {
    return graphql(newRequest, query, options);
  };

  return Object.assign(newApi, {
    defaults: withDefaults.bind(null, newRequest),
    endpoint: request.request.endpoint
  });
}

const graphql$1 = withDefaults(request.request, {
  headers: {
    "user-agent": `octokit-graphql.js/${VERSION} ${universalUserAgent.getUserAgent()}`
  },
  method: "POST",
  url: "/graphql"
});
function withCustomRequest(customRequest) {
  return withDefaults(customRequest, {
    method: "POST",
    url: "/graphql"
  });
}

exports.graphql = graphql$1;
exports.withCustomRequest = withCustomRequest;
//# sourceMappingURL=index.js.map


/***/ }),

/***/ 4193:
/***/ ((__unused_webpack_module, exports) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({ value: true }));

const VERSION = "2.10.0";

/**
 * Some “list” response that can be paginated have a different response structure
 *
 * They have a `total_count` key in the response (search also has `incomplete_results`,
 * /installation/repositories also has `repository_selection`), as well as a key with
 * the list of the items which name varies from endpoint to endpoint.
 *
 * Octokit normalizes these responses so that paginated results are always returned following
 * the same structure. One challenge is that if the list response has only one page, no Link
 * header is provided, so this header alone is not sufficient to check wether a response is
 * paginated or not.
 *
 * We check if a "total_count" key is present in the response data, but also make sure that
 * a "url" property is not, as the "Get the combined status for a specific ref" endpoint would
 * otherwise match: https://developer.github.com/v3/repos/statuses/#get-the-combined-status-for-a-specific-ref
 */
function normalizePaginatedListResponse(response) {
  const responseNeedsNormalization = "total_count" in response.data && !("url" in response.data);
  if (!responseNeedsNormalization) return response; // keep the additional properties intact as there is currently no other way
  // to retrieve the same information.

  const incompleteResults = response.data.incomplete_results;
  const repositorySelection = response.data.repository_selection;
  const totalCount = response.data.total_count;
  delete response.data.incomplete_results;
  delete response.data.repository_selection;
  delete response.data.total_count;
  const namespaceKey = Object.keys(response.data)[0];
  const data = response.data[namespaceKey];
  response.data = data;

  if (typeof incompleteResults !== "undefined") {
    response.data.incomplete_results = incompleteResults;
  }

  if (typeof repositorySelection !== "undefined") {
    response.data.repository_selection = repositorySelection;
  }

  response.data.total_count = totalCount;
  return response;
}

function iterator(octokit, route, parameters) {
  const options = typeof route === "function" ? route.endpoint(parameters) : octokit.request.endpoint(route, parameters);
  const requestMethod = typeof route === "function" ? route : octokit.request;
  const method = options.method;
  const headers = options.headers;
  let url = options.url;
  return {
    [Symbol.asyncIterator]: () => ({
      async next() {
        if (!url) return {
          done: true
        };
        const response = await requestMethod({
          method,
          url,
          headers
        });
        const normalizedResponse = normalizePaginatedListResponse(response); // `response.headers.link` format:
        // '<https://api.github.com/users/aseemk/followers?page=2>; rel="next", <https://api.github.com/users/aseemk/followers?page=2>; rel="last"'
        // sets `url` to undefined if "next" URL is not present or `link` header is not set

        url = ((normalizedResponse.headers.link || "").match(/<([^>]+)>;\s*rel="next"/) || [])[1];
        return {
          value: normalizedResponse
        };
      }

    })
  };
}

function paginate(octokit, route, parameters, mapFn) {
  if (typeof parameters === "function") {
    mapFn = parameters;
    parameters = undefined;
  }

  return gather(octokit, [], iterator(octokit, route, parameters)[Symbol.asyncIterator](), mapFn);
}

function gather(octokit, results, iterator, mapFn) {
  return iterator.next().then(result => {
    if (result.done) {
      return results;
    }

    let earlyExit = false;

    function done() {
      earlyExit = true;
    }

    results = results.concat(mapFn ? mapFn(result.value, done) : result.value.data);

    if (earlyExit) {
      return results;
    }

    return gather(octokit, results, iterator, mapFn);
  });
}

const composePaginateRest = Object.assign(paginate, {
  iterator
});

/**
 * @param octokit Octokit instance
 * @param options Options passed to Octokit constructor
 */

function paginateRest(octokit) {
  return {
    paginate: Object.assign(paginate.bind(null, octokit), {
      iterator: iterator.bind(null, octokit)
    })
  };
}
paginateRest.VERSION = VERSION;

exports.composePaginateRest = composePaginateRest;
exports.paginateRest = paginateRest;
//# sourceMappingURL=index.js.map


/***/ }),

/***/ 8883:
/***/ ((__unused_webpack_module, exports) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({ value: true }));

const VERSION = "1.0.3";

/**
 * @param octokit Octokit instance
 * @param options Options passed to Octokit constructor
 */

function requestLog(octokit) {
  octokit.hook.wrap("request", (request, options) => {
    octokit.log.debug("request", options);
    const start = Date.now();
    const requestOptions = octokit.request.endpoint.parse(options);
    const path = requestOptions.url.replace(options.baseUrl, "");
    return request(options).then(response => {
      octokit.log.info(`${requestOptions.method} ${path} - ${response.status} in ${Date.now() - start}ms`);
      return response;
    }).catch(error => {
      octokit.log.info(`${requestOptions.method} ${path} - ${error.status} in ${Date.now() - start}ms`);
      throw error;
    });
  });
}
requestLog.VERSION = VERSION;

exports.requestLog = requestLog;
//# sourceMappingURL=index.js.map


/***/ }),

/***/ 3044:
/***/ ((__unused_webpack_module, exports) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({ value: true }));

const Endpoints = {
  actions: {
    addSelectedRepoToOrgSecret: ["PUT /orgs/{org}/actions/secrets/{secret_name}/repositories/{repository_id}"],
    cancelWorkflowRun: ["POST /repos/{owner}/{repo}/actions/runs/{run_id}/cancel"],
    createOrUpdateOrgSecret: ["PUT /orgs/{org}/actions/secrets/{secret_name}"],
    createOrUpdateRepoSecret: ["PUT /repos/{owner}/{repo}/actions/secrets/{secret_name}"],
    createRegistrationTokenForOrg: ["POST /orgs/{org}/actions/runners/registration-token"],
    createRegistrationTokenForRepo: ["POST /repos/{owner}/{repo}/actions/runners/registration-token"],
    createRemoveTokenForOrg: ["POST /orgs/{org}/actions/runners/remove-token"],
    createRemoveTokenForRepo: ["POST /repos/{owner}/{repo}/actions/runners/remove-token"],
    createWorkflowDispatch: ["POST /repos/{owner}/{repo}/actions/workflows/{workflow_id}/dispatches"],
    deleteArtifact: ["DELETE /repos/{owner}/{repo}/actions/artifacts/{artifact_id}"],
    deleteOrgSecret: ["DELETE /orgs/{org}/actions/secrets/{secret_name}"],
    deleteRepoSecret: ["DELETE /repos/{owner}/{repo}/actions/secrets/{secret_name}"],
    deleteSelfHostedRunnerFromOrg: ["DELETE /orgs/{org}/actions/runners/{runner_id}"],
    deleteSelfHostedRunnerFromRepo: ["DELETE /repos/{owner}/{repo}/actions/runners/{runner_id}"],
    deleteWorkflowRun: ["DELETE /repos/{owner}/{repo}/actions/runs/{run_id}"],
    deleteWorkflowRunLogs: ["DELETE /repos/{owner}/{repo}/actions/runs/{run_id}/logs"],
    disableSelectedRepositoryGithubActionsOrganization: ["DELETE /orgs/{org}/actions/permissions/repositories/{repository_id}"],
    disableWorkflow: ["PUT /repos/{owner}/{repo}/actions/workflows/{workflow_id}/disable"],
    downloadArtifact: ["GET /repos/{owner}/{repo}/actions/artifacts/{artifact_id}/{archive_format}"],
    downloadJobLogsForWorkflowRun: ["GET /repos/{owner}/{repo}/actions/jobs/{job_id}/logs"],
    downloadWorkflowRunLogs: ["GET /repos/{owner}/{repo}/actions/runs/{run_id}/logs"],
    enableSelectedRepositoryGithubActionsOrganization: ["PUT /orgs/{org}/actions/permissions/repositories/{repository_id}"],
    enableWorkflow: ["PUT /repos/{owner}/{repo}/actions/workflows/{workflow_id}/enable"],
    getAllowedActionsOrganization: ["GET /orgs/{org}/actions/permissions/selected-actions"],
    getAllowedActionsRepository: ["GET /repos/{owner}/{repo}/actions/permissions/selected-actions"],
    getArtifact: ["GET /repos/{owner}/{repo}/actions/artifacts/{artifact_id}"],
    getGithubActionsPermissionsOrganization: ["GET /orgs/{org}/actions/permissions"],
    getGithubActionsPermissionsRepository: ["GET /repos/{owner}/{repo}/actions/permissions"],
    getJobForWorkflowRun: ["GET /repos/{owner}/{repo}/actions/jobs/{job_id}"],
    getOrgPublicKey: ["GET /orgs/{org}/actions/secrets/public-key"],
    getOrgSecret: ["GET /orgs/{org}/actions/secrets/{secret_name}"],
    getRepoPermissions: ["GET /repos/{owner}/{repo}/actions/permissions", {}, {
      renamed: ["actions", "getGithubActionsPermissionsRepository"]
    }],
    getRepoPublicKey: ["GET /repos/{owner}/{repo}/actions/secrets/public-key"],
    getRepoSecret: ["GET /repos/{owner}/{repo}/actions/secrets/{secret_name}"],
    getSelfHostedRunnerForOrg: ["GET /orgs/{org}/actions/runners/{runner_id}"],
    getSelfHostedRunnerForRepo: ["GET /repos/{owner}/{repo}/actions/runners/{runner_id}"],
    getWorkflow: ["GET /repos/{owner}/{repo}/actions/workflows/{workflow_id}"],
    getWorkflowRun: ["GET /repos/{owner}/{repo}/actions/runs/{run_id}"],
    getWorkflowRunUsage: ["GET /repos/{owner}/{repo}/actions/runs/{run_id}/timing"],
    getWorkflowUsage: ["GET /repos/{owner}/{repo}/actions/workflows/{workflow_id}/timing"],
    listArtifactsForRepo: ["GET /repos/{owner}/{repo}/actions/artifacts"],
    listJobsForWorkflowRun: ["GET /repos/{owner}/{repo}/actions/runs/{run_id}/jobs"],
    listOrgSecrets: ["GET /orgs/{org}/actions/secrets"],
    listRepoSecrets: ["GET /repos/{owner}/{repo}/actions/secrets"],
    listRepoWorkflows: ["GET /repos/{owner}/{repo}/actions/workflows"],
    listRunnerApplicationsForOrg: ["GET /orgs/{org}/actions/runners/downloads"],
    listRunnerApplicationsForRepo: ["GET /repos/{owner}/{repo}/actions/runners/downloads"],
    listSelectedReposForOrgSecret: ["GET /orgs/{org}/actions/secrets/{secret_name}/repositories"],
    listSelectedRepositoriesEnabledGithubActionsOrganization: ["GET /orgs/{org}/actions/permissions/repositories"],
    listSelfHostedRunnersForOrg: ["GET /orgs/{org}/actions/runners"],
    listSelfHostedRunnersForRepo: ["GET /repos/{owner}/{repo}/actions/runners"],
    listWorkflowRunArtifacts: ["GET /repos/{owner}/{repo}/actions/runs/{run_id}/artifacts"],
    listWorkflowRuns: ["GET /repos/{owner}/{repo}/actions/workflows/{workflow_id}/runs"],
    listWorkflowRunsForRepo: ["GET /repos/{owner}/{repo}/actions/runs"],
    reRunWorkflow: ["POST /repos/{owner}/{repo}/actions/runs/{run_id}/rerun"],
    removeSelectedRepoFromOrgSecret: ["DELETE /orgs/{org}/actions/secrets/{secret_name}/repositories/{repository_id}"],
    setAllowedActionsOrganization: ["PUT /orgs/{org}/actions/permissions/selected-actions"],
    setAllowedActionsRepository: ["PUT /repos/{owner}/{repo}/actions/permissions/selected-actions"],
    setGithubActionsPermissionsOrganization: ["PUT /orgs/{org}/actions/permissions"],
    setGithubActionsPermissionsRepository: ["PUT /repos/{owner}/{repo}/actions/permissions"],
    setSelectedReposForOrgSecret: ["PUT /orgs/{org}/actions/secrets/{secret_name}/repositories"],
    setSelectedRepositoriesEnabledGithubActionsOrganization: ["PUT /orgs/{org}/actions/permissions/repositories"]
  },
  activity: {
    checkRepoIsStarredByAuthenticatedUser: ["GET /user/starred/{owner}/{repo}"],
    deleteRepoSubscription: ["DELETE /repos/{owner}/{repo}/subscription"],
    deleteThreadSubscription: ["DELETE /notifications/threads/{thread_id}/subscription"],
    getFeeds: ["GET /feeds"],
    getRepoSubscription: ["GET /repos/{owner}/{repo}/subscription"],
    getThread: ["GET /notifications/threads/{thread_id}"],
    getThreadSubscriptionForAuthenticatedUser: ["GET /notifications/threads/{thread_id}/subscription"],
    listEventsForAuthenticatedUser: ["GET /users/{username}/events"],
    listNotificationsForAuthenticatedUser: ["GET /notifications"],
    listOrgEventsForAuthenticatedUser: ["GET /users/{username}/events/orgs/{org}"],
    listPublicEvents: ["GET /events"],
    listPublicEventsForRepoNetwork: ["GET /networks/{owner}/{repo}/events"],
    listPublicEventsForUser: ["GET /users/{username}/events/public"],
    listPublicOrgEvents: ["GET /orgs/{org}/events"],
    listReceivedEventsForUser: ["GET /users/{username}/received_events"],
    listReceivedPublicEventsForUser: ["GET /users/{username}/received_events/public"],
    listRepoEvents: ["GET /repos/{owner}/{repo}/events"],
    listRepoNotificationsForAuthenticatedUser: ["GET /repos/{owner}/{repo}/notifications"],
    listReposStarredByAuthenticatedUser: ["GET /user/starred"],
    listReposStarredByUser: ["GET /users/{username}/starred"],
    listReposWatchedByUser: ["GET /users/{username}/subscriptions"],
    listStargazersForRepo: ["GET /repos/{owner}/{repo}/stargazers"],
    listWatchedReposForAuthenticatedUser: ["GET /user/subscriptions"],
    listWatchersForRepo: ["GET /repos/{owner}/{repo}/subscribers"],
    markNotificationsAsRead: ["PUT /notifications"],
    markRepoNotificationsAsRead: ["PUT /repos/{owner}/{repo}/notifications"],
    markThreadAsRead: ["PATCH /notifications/threads/{thread_id}"],
    setRepoSubscription: ["PUT /repos/{owner}/{repo}/subscription"],
    setThreadSubscription: ["PUT /notifications/threads/{thread_id}/subscription"],
    starRepoForAuthenticatedUser: ["PUT /user/starred/{owner}/{repo}"],
    unstarRepoForAuthenticatedUser: ["DELETE /user/starred/{owner}/{repo}"]
  },
  apps: {
    addRepoToInstallation: ["PUT /user/installations/{installation_id}/repositories/{repository_id}"],
    checkToken: ["POST /applications/{client_id}/token"],
    createContentAttachment: ["POST /content_references/{content_reference_id}/attachments", {
      mediaType: {
        previews: ["corsair"]
      }
    }],
    createFromManifest: ["POST /app-manifests/{code}/conversions"],
    createInstallationAccessToken: ["POST /app/installations/{installation_id}/access_tokens"],
    deleteAuthorization: ["DELETE /applications/{client_id}/grant"],
    deleteInstallation: ["DELETE /app/installations/{installation_id}"],
    deleteToken: ["DELETE /applications/{client_id}/token"],
    getAuthenticated: ["GET /app"],
    getBySlug: ["GET /apps/{app_slug}"],
    getInstallation: ["GET /app/installations/{installation_id}"],
    getOrgInstallation: ["GET /orgs/{org}/installation"],
    getRepoInstallation: ["GET /repos/{owner}/{repo}/installation"],
    getSubscriptionPlanForAccount: ["GET /marketplace_listing/accounts/{account_id}"],
    getSubscriptionPlanForAccountStubbed: ["GET /marketplace_listing/stubbed/accounts/{account_id}"],
    getUserInstallation: ["GET /users/{username}/installation"],
    getWebhookConfigForApp: ["GET /app/hook/config"],
    listAccountsForPlan: ["GET /marketplace_listing/plans/{plan_id}/accounts"],
    listAccountsForPlanStubbed: ["GET /marketplace_listing/stubbed/plans/{plan_id}/accounts"],
    listInstallationReposForAuthenticatedUser: ["GET /user/installations/{installation_id}/repositories"],
    listInstallations: ["GET /app/installations"],
    listInstallationsForAuthenticatedUser: ["GET /user/installations"],
    listPlans: ["GET /marketplace_listing/plans"],
    listPlansStubbed: ["GET /marketplace_listing/stubbed/plans"],
    listReposAccessibleToInstallation: ["GET /installation/repositories"],
    listSubscriptionsForAuthenticatedUser: ["GET /user/marketplace_purchases"],
    listSubscriptionsForAuthenticatedUserStubbed: ["GET /user/marketplace_purchases/stubbed"],
    removeRepoFromInstallation: ["DELETE /user/installations/{installation_id}/repositories/{repository_id}"],
    resetToken: ["PATCH /applications/{client_id}/token"],
    revokeInstallationAccessToken: ["DELETE /installation/token"],
    scopeToken: ["POST /applications/{client_id}/token/scoped"],
    suspendInstallation: ["PUT /app/installations/{installation_id}/suspended"],
    unsuspendInstallation: ["DELETE /app/installations/{installation_id}/suspended"],
    updateWebhookConfigForApp: ["PATCH /app/hook/config"]
  },
  billing: {
    getGithubActionsBillingOrg: ["GET /orgs/{org}/settings/billing/actions"],
    getGithubActionsBillingUser: ["GET /users/{username}/settings/billing/actions"],
    getGithubPackagesBillingOrg: ["GET /orgs/{org}/settings/billing/packages"],
    getGithubPackagesBillingUser: ["GET /users/{username}/settings/billing/packages"],
    getSharedStorageBillingOrg: ["GET /orgs/{org}/settings/billing/shared-storage"],
    getSharedStorageBillingUser: ["GET /users/{username}/settings/billing/shared-storage"]
  },
  checks: {
    create: ["POST /repos/{owner}/{repo}/check-runs"],
    createSuite: ["POST /repos/{owner}/{repo}/check-suites"],
    get: ["GET /repos/{owner}/{repo}/check-runs/{check_run_id}"],
    getSuite: ["GET /repos/{owner}/{repo}/check-suites/{check_suite_id}"],
    listAnnotations: ["GET /repos/{owner}/{repo}/check-runs/{check_run_id}/annotations"],
    listForRef: ["GET /repos/{owner}/{repo}/commits/{ref}/check-runs"],
    listForSuite: ["GET /repos/{owner}/{repo}/check-suites/{check_suite_id}/check-runs"],
    listSuitesForRef: ["GET /repos/{owner}/{repo}/commits/{ref}/check-suites"],
    rerequestSuite: ["POST /repos/{owner}/{repo}/check-suites/{check_suite_id}/rerequest"],
    setSuitesPreferences: ["PATCH /repos/{owner}/{repo}/check-suites/preferences"],
    update: ["PATCH /repos/{owner}/{repo}/check-runs/{check_run_id}"]
  },
  codeScanning: {
    deleteAnalysis: ["DELETE /repos/{owner}/{repo}/code-scanning/analyses/{analysis_id}{?confirm_delete}"],
    getAlert: ["GET /repos/{owner}/{repo}/code-scanning/alerts/{alert_number}", {}, {
      renamedParameters: {
        alert_id: "alert_number"
      }
    }],
    getAnalysis: ["GET /repos/{owner}/{repo}/code-scanning/analyses/{analysis_id}"],
    getSarif: ["GET /repos/{owner}/{repo}/code-scanning/sarifs/{sarif_id}"],
    listAlertsForRepo: ["GET /repos/{owner}/{repo}/code-scanning/alerts"],
    listAlertsInstances: ["GET /repos/{owner}/{repo}/code-scanning/alerts/{alert_number}/instances"],
    listRecentAnalyses: ["GET /repos/{owner}/{repo}/code-scanning/analyses"],
    updateAlert: ["PATCH /repos/{owner}/{repo}/code-scanning/alerts/{alert_number}"],
    uploadSarif: ["POST /repos/{owner}/{repo}/code-scanning/sarifs"]
  },
  codesOfConduct: {
    getAllCodesOfConduct: ["GET /codes_of_conduct", {
      mediaType: {
        previews: ["scarlet-witch"]
      }
    }],
    getConductCode: ["GET /codes_of_conduct/{key}", {
      mediaType: {
        previews: ["scarlet-witch"]
      }
    }],
    getForRepo: ["GET /repos/{owner}/{repo}/community/code_of_conduct", {
      mediaType: {
        previews: ["scarlet-witch"]
      }
    }]
  },
  emojis: {
    get: ["GET /emojis"]
  },
  enterpriseAdmin: {
    disableSelectedOrganizationGithubActionsEnterprise: ["DELETE /enterprises/{enterprise}/actions/permissions/organizations/{org_id}"],
    enableSelectedOrganizationGithubActionsEnterprise: ["PUT /enterprises/{enterprise}/actions/permissions/organizations/{org_id}"],
    getAllowedActionsEnterprise: ["GET /enterprises/{enterprise}/actions/permissions/selected-actions"],
    getGithubActionsPermissionsEnterprise: ["GET /enterprises/{enterprise}/actions/permissions"],
    listSelectedOrganizationsEnabledGithubActionsEnterprise: ["GET /enterprises/{enterprise}/actions/permissions/organizations"],
    setAllowedActionsEnterprise: ["PUT /enterprises/{enterprise}/actions/permissions/selected-actions"],
    setGithubActionsPermissionsEnterprise: ["PUT /enterprises/{enterprise}/actions/permissions"],
    setSelectedOrganizationsEnabledGithubActionsEnterprise: ["PUT /enterprises/{enterprise}/actions/permissions/organizations"]
  },
  gists: {
    checkIsStarred: ["GET /gists/{gist_id}/star"],
    create: ["POST /gists"],
    createComment: ["POST /gists/{gist_id}/comments"],
    delete: ["DELETE /gists/{gist_id}"],
    deleteComment: ["DELETE /gists/{gist_id}/comments/{comment_id}"],
    fork: ["POST /gists/{gist_id}/forks"],
    get: ["GET /gists/{gist_id}"],
    getComment: ["GET /gists/{gist_id}/comments/{comment_id}"],
    getRevision: ["GET /gists/{gist_id}/{sha}"],
    list: ["GET /gists"],
    listComments: ["GET /gists/{gist_id}/comments"],
    listCommits: ["GET /gists/{gist_id}/commits"],
    listForUser: ["GET /users/{username}/gists"],
    listForks: ["GET /gists/{gist_id}/forks"],
    listPublic: ["GET /gists/public"],
    listStarred: ["GET /gists/starred"],
    star: ["PUT /gists/{gist_id}/star"],
    unstar: ["DELETE /gists/{gist_id}/star"],
    update: ["PATCH /gists/{gist_id}"],
    updateComment: ["PATCH /gists/{gist_id}/comments/{comment_id}"]
  },
  git: {
    createBlob: ["POST /repos/{owner}/{repo}/git/blobs"],
    createCommit: ["POST /repos/{owner}/{repo}/git/commits"],
    createRef: ["POST /repos/{owner}/{repo}/git/refs"],
    createTag: ["POST /repos/{owner}/{repo}/git/tags"],
    createTree: ["POST /repos/{owner}/{repo}/git/trees"],
    deleteRef: ["DELETE /repos/{owner}/{repo}/git/refs/{ref}"],
    getBlob: ["GET /repos/{owner}/{repo}/git/blobs/{file_sha}"],
    getCommit: ["GET /repos/{owner}/{repo}/git/commits/{commit_sha}"],
    getRef: ["GET /repos/{owner}/{repo}/git/ref/{ref}"],
    getTag: ["GET /repos/{owner}/{repo}/git/tags/{tag_sha}"],
    getTree: ["GET /repos/{owner}/{repo}/git/trees/{tree_sha}"],
    listMatchingRefs: ["GET /repos/{owner}/{repo}/git/matching-refs/{ref}"],
    updateRef: ["PATCH /repos/{owner}/{repo}/git/refs/{ref}"]
  },
  gitignore: {
    getAllTemplates: ["GET /gitignore/templates"],
    getTemplate: ["GET /gitignore/templates/{name}"]
  },
  interactions: {
    getRestrictionsForAuthenticatedUser: ["GET /user/interaction-limits"],
    getRestrictionsForOrg: ["GET /orgs/{org}/interaction-limits"],
    getRestrictionsForRepo: ["GET /repos/{owner}/{repo}/interaction-limits"],
    getRestrictionsForYourPublicRepos: ["GET /user/interaction-limits", {}, {
      renamed: ["interactions", "getRestrictionsForAuthenticatedUser"]
    }],
    removeRestrictionsForAuthenticatedUser: ["DELETE /user/interaction-limits"],
    removeRestrictionsForOrg: ["DELETE /orgs/{org}/interaction-limits"],
    removeRestrictionsForRepo: ["DELETE /repos/{owner}/{repo}/interaction-limits"],
    removeRestrictionsForYourPublicRepos: ["DELETE /user/interaction-limits", {}, {
      renamed: ["interactions", "removeRestrictionsForAuthenticatedUser"]
    }],
    setRestrictionsForAuthenticatedUser: ["PUT /user/interaction-limits"],
    setRestrictionsForOrg: ["PUT /orgs/{org}/interaction-limits"],
    setRestrictionsForRepo: ["PUT /repos/{owner}/{repo}/interaction-limits"],
    setRestrictionsForYourPublicRepos: ["PUT /user/interaction-limits", {}, {
      renamed: ["interactions", "setRestrictionsForAuthenticatedUser"]
    }]
  },
  issues: {
    addAssignees: ["POST /repos/{owner}/{repo}/issues/{issue_number}/assignees"],
    addLabels: ["POST /repos/{owner}/{repo}/issues/{issue_number}/labels"],
    checkUserCanBeAssigned: ["GET /repos/{owner}/{repo}/assignees/{assignee}"],
    create: ["POST /repos/{owner}/{repo}/issues"],
    createComment: ["POST /repos/{owner}/{repo}/issues/{issue_number}/comments"],
    createLabel: ["POST /repos/{owner}/{repo}/labels"],
    createMilestone: ["POST /repos/{owner}/{repo}/milestones"],
    deleteComment: ["DELETE /repos/{owner}/{repo}/issues/comments/{comment_id}"],
    deleteLabel: ["DELETE /repos/{owner}/{repo}/labels/{name}"],
    deleteMilestone: ["DELETE /repos/{owner}/{repo}/milestones/{milestone_number}"],
    get: ["GET /repos/{owner}/{repo}/issues/{issue_number}"],
    getComment: ["GET /repos/{owner}/{repo}/issues/comments/{comment_id}"],
    getEvent: ["GET /repos/{owner}/{repo}/issues/events/{event_id}"],
    getLabel: ["GET /repos/{owner}/{repo}/labels/{name}"],
    getMilestone: ["GET /repos/{owner}/{repo}/milestones/{milestone_number}"],
    list: ["GET /issues"],
    listAssignees: ["GET /repos/{owner}/{repo}/assignees"],
    listComments: ["GET /repos/{owner}/{repo}/issues/{issue_number}/comments"],
    listCommentsForRepo: ["GET /repos/{owner}/{repo}/issues/comments"],
    listEvents: ["GET /repos/{owner}/{repo}/issues/{issue_number}/events"],
    listEventsForRepo: ["GET /repos/{owner}/{repo}/issues/events"],
    listEventsForTimeline: ["GET /repos/{owner}/{repo}/issues/{issue_number}/timeline", {
      mediaType: {
        previews: ["mockingbird"]
      }
    }],
    listForAuthenticatedUser: ["GET /user/issues"],
    listForOrg: ["GET /orgs/{org}/issues"],
    listForRepo: ["GET /repos/{owner}/{repo}/issues"],
    listLabelsForMilestone: ["GET /repos/{owner}/{repo}/milestones/{milestone_number}/labels"],
    listLabelsForRepo: ["GET /repos/{owner}/{repo}/labels"],
    listLabelsOnIssue: ["GET /repos/{owner}/{repo}/issues/{issue_number}/labels"],
    listMilestones: ["GET /repos/{owner}/{repo}/milestones"],
    lock: ["PUT /repos/{owner}/{repo}/issues/{issue_number}/lock"],
    removeAllLabels: ["DELETE /repos/{owner}/{repo}/issues/{issue_number}/labels"],
    removeAssignees: ["DELETE /repos/{owner}/{repo}/issues/{issue_number}/assignees"],
    removeLabel: ["DELETE /repos/{owner}/{repo}/issues/{issue_number}/labels/{name}"],
    setLabels: ["PUT /repos/{owner}/{repo}/issues/{issue_number}/labels"],
    unlock: ["DELETE /repos/{owner}/{repo}/issues/{issue_number}/lock"],
    update: ["PATCH /repos/{owner}/{repo}/issues/{issue_number}"],
    updateComment: ["PATCH /repos/{owner}/{repo}/issues/comments/{comment_id}"],
    updateLabel: ["PATCH /repos/{owner}/{repo}/labels/{name}"],
    updateMilestone: ["PATCH /repos/{owner}/{repo}/milestones/{milestone_number}"]
  },
  licenses: {
    get: ["GET /licenses/{license}"],
    getAllCommonlyUsed: ["GET /licenses"],
    getForRepo: ["GET /repos/{owner}/{repo}/license"]
  },
  markdown: {
    render: ["POST /markdown"],
    renderRaw: ["POST /markdown/raw", {
      headers: {
        "content-type": "text/plain; charset=utf-8"
      }
    }]
  },
  meta: {
    get: ["GET /meta"],
    getOctocat: ["GET /octocat"],
    getZen: ["GET /zen"],
    root: ["GET /"]
  },
  migrations: {
    cancelImport: ["DELETE /repos/{owner}/{repo}/import"],
    deleteArchiveForAuthenticatedUser: ["DELETE /user/migrations/{migration_id}/archive", {
      mediaType: {
        previews: ["wyandotte"]
      }
    }],
    deleteArchiveForOrg: ["DELETE /orgs/{org}/migrations/{migration_id}/archive", {
      mediaType: {
        previews: ["wyandotte"]
      }
    }],
    downloadArchiveForOrg: ["GET /orgs/{org}/migrations/{migration_id}/archive", {
      mediaType: {
        previews: ["wyandotte"]
      }
    }],
    getArchiveForAuthenticatedUser: ["GET /user/migrations/{migration_id}/archive", {
      mediaType: {
        previews: ["wyandotte"]
      }
    }],
    getCommitAuthors: ["GET /repos/{owner}/{repo}/import/authors"],
    getImportStatus: ["GET /repos/{owner}/{repo}/import"],
    getLargeFiles: ["GET /repos/{owner}/{repo}/import/large_files"],
    getStatusForAuthenticatedUser: ["GET /user/migrations/{migration_id}", {
      mediaType: {
        previews: ["wyandotte"]
      }
    }],
    getStatusForOrg: ["GET /orgs/{org}/migrations/{migration_id}", {
      mediaType: {
        previews: ["wyandotte"]
      }
    }],
    listForAuthenticatedUser: ["GET /user/migrations", {
      mediaType: {
        previews: ["wyandotte"]
      }
    }],
    listForOrg: ["GET /orgs/{org}/migrations", {
      mediaType: {
        previews: ["wyandotte"]
      }
    }],
    listReposForOrg: ["GET /orgs/{org}/migrations/{migration_id}/repositories", {
      mediaType: {
        previews: ["wyandotte"]
      }
    }],
    listReposForUser: ["GET /user/migrations/{migration_id}/repositories", {
      mediaType: {
        previews: ["wyandotte"]
      }
    }],
    mapCommitAuthor: ["PATCH /repos/{owner}/{repo}/import/authors/{author_id}"],
    setLfsPreference: ["PATCH /repos/{owner}/{repo}/import/lfs"],
    startForAuthenticatedUser: ["POST /user/migrations"],
    startForOrg: ["POST /orgs/{org}/migrations"],
    startImport: ["PUT /repos/{owner}/{repo}/import"],
    unlockRepoForAuthenticatedUser: ["DELETE /user/migrations/{migration_id}/repos/{repo_name}/lock", {
      mediaType: {
        previews: ["wyandotte"]
      }
    }],
    unlockRepoForOrg: ["DELETE /orgs/{org}/migrations/{migration_id}/repos/{repo_name}/lock", {
      mediaType: {
        previews: ["wyandotte"]
      }
    }],
    updateImport: ["PATCH /repos/{owner}/{repo}/import"]
  },
  orgs: {
    blockUser: ["PUT /orgs/{org}/blocks/{username}"],
    cancelInvitation: ["DELETE /orgs/{org}/invitations/{invitation_id}"],
    checkBlockedUser: ["GET /orgs/{org}/blocks/{username}"],
    checkMembershipForUser: ["GET /orgs/{org}/members/{username}"],
    checkPublicMembershipForUser: ["GET /orgs/{org}/public_members/{username}"],
    convertMemberToOutsideCollaborator: ["PUT /orgs/{org}/outside_collaborators/{username}"],
    createInvitation: ["POST /orgs/{org}/invitations"],
    createWebhook: ["POST /orgs/{org}/hooks"],
    deleteWebhook: ["DELETE /orgs/{org}/hooks/{hook_id}"],
    get: ["GET /orgs/{org}"],
    getMembershipForAuthenticatedUser: ["GET /user/memberships/orgs/{org}"],
    getMembershipForUser: ["GET /orgs/{org}/memberships/{username}"],
    getWebhook: ["GET /orgs/{org}/hooks/{hook_id}"],
    getWebhookConfigForOrg: ["GET /orgs/{org}/hooks/{hook_id}/config"],
    list: ["GET /organizations"],
    listAppInstallations: ["GET /orgs/{org}/installations"],
    listBlockedUsers: ["GET /orgs/{org}/blocks"],
    listFailedInvitations: ["GET /orgs/{org}/failed_invitations"],
    listForAuthenticatedUser: ["GET /user/orgs"],
    listForUser: ["GET /users/{username}/orgs"],
    listInvitationTeams: ["GET /orgs/{org}/invitations/{invitation_id}/teams"],
    listMembers: ["GET /orgs/{org}/members"],
    listMembershipsForAuthenticatedUser: ["GET /user/memberships/orgs"],
    listOutsideCollaborators: ["GET /orgs/{org}/outside_collaborators"],
    listPendingInvitations: ["GET /orgs/{org}/invitations"],
    listPublicMembers: ["GET /orgs/{org}/public_members"],
    listWebhooks: ["GET /orgs/{org}/hooks"],
    pingWebhook: ["POST /orgs/{org}/hooks/{hook_id}/pings"],
    removeMember: ["DELETE /orgs/{org}/members/{username}"],
    removeMembershipForUser: ["DELETE /orgs/{org}/memberships/{username}"],
    removeOutsideCollaborator: ["DELETE /orgs/{org}/outside_collaborators/{username}"],
    removePublicMembershipForAuthenticatedUser: ["DELETE /orgs/{org}/public_members/{username}"],
    setMembershipForUser: ["PUT /orgs/{org}/memberships/{username}"],
    setPublicMembershipForAuthenticatedUser: ["PUT /orgs/{org}/public_members/{username}"],
    unblockUser: ["DELETE /orgs/{org}/blocks/{username}"],
    update: ["PATCH /orgs/{org}"],
    updateMembershipForAuthenticatedUser: ["PATCH /user/memberships/orgs/{org}"],
    updateWebhook: ["PATCH /orgs/{org}/hooks/{hook_id}"],
    updateWebhookConfigForOrg: ["PATCH /orgs/{org}/hooks/{hook_id}/config"]
  },
  packages: {
    deletePackageForAuthenticatedUser: ["DELETE /user/packages/{package_type}/{package_name}"],
    deletePackageForOrg: ["DELETE /orgs/{org}/packages/{package_type}/{package_name}"],
    deletePackageVersionForAuthenticatedUser: ["DELETE /user/packages/{package_type}/{package_name}/versions/{package_version_id}"],
    deletePackageVersionForOrg: ["DELETE /orgs/{org}/packages/{package_type}/{package_name}/versions/{package_version_id}"],
    getAllPackageVersionsForAPackageOwnedByAnOrg: ["GET /orgs/{org}/packages/{package_type}/{package_name}/versions"],
    getAllPackageVersionsForAPackageOwnedByTheAuthenticatedUser: ["GET /user/packages/{package_type}/{package_name}/versions"],
    getAllPackageVersionsForPackageOwnedByUser: ["GET /users/{username}/packages/{package_type}/{package_name}/versions"],
    getPackageForAuthenticatedUser: ["GET /user/packages/{package_type}/{package_name}"],
    getPackageForOrganization: ["GET /orgs/{org}/packages/{package_type}/{package_name}"],
    getPackageForUser: ["GET /users/{username}/packages/{package_type}/{package_name}"],
    getPackageVersionForAuthenticatedUser: ["GET /user/packages/{package_type}/{package_name}/versions/{package_version_id}"],
    getPackageVersionForOrganization: ["GET /orgs/{org}/packages/{package_type}/{package_name}/versions/{package_version_id}"],
    getPackageVersionForUser: ["GET /users/{username}/packages/{package_type}/{package_name}/versions/{package_version_id}"],
    restorePackageForAuthenticatedUser: ["POST /user/packages/{package_type}/{package_name}/restore"],
    restorePackageForOrg: ["POST /orgs/{org}/packages/{package_type}/{package_name}/restore"],
    restorePackageVersionForAuthenticatedUser: ["POST /user/packages/{package_type}/{package_name}/versions/{package_version_id}/restore"],
    restorePackageVersionForOrg: ["POST /orgs/{org}/packages/{package_type}/{package_name}/versions/{package_version_id}/restore"]
  },
  projects: {
    addCollaborator: ["PUT /projects/{project_id}/collaborators/{username}", {
      mediaType: {
        previews: ["inertia"]
      }
    }],
    createCard: ["POST /projects/columns/{column_id}/cards", {
      mediaType: {
        previews: ["inertia"]
      }
    }],
    createColumn: ["POST /projects/{project_id}/columns", {
      mediaType: {
        previews: ["inertia"]
      }
    }],
    createForAuthenticatedUser: ["POST /user/projects", {
      mediaType: {
        previews: ["inertia"]
      }
    }],
    createForOrg: ["POST /orgs/{org}/projects", {
      mediaType: {
        previews: ["inertia"]
      }
    }],
    createForRepo: ["POST /repos/{owner}/{repo}/projects", {
      mediaType: {
        previews: ["inertia"]
      }
    }],
    delete: ["DELETE /projects/{project_id}", {
      mediaType: {
        previews: ["inertia"]
      }
    }],
    deleteCard: ["DELETE /projects/columns/cards/{card_id}", {
      mediaType: {
        previews: ["inertia"]
      }
    }],
    deleteColumn: ["DELETE /projects/columns/{column_id}", {
      mediaType: {
        previews: ["inertia"]
      }
    }],
    get: ["GET /projects/{project_id}", {
      mediaType: {
        previews: ["inertia"]
      }
    }],
    getCard: ["GET /projects/columns/cards/{card_id}", {
      mediaType: {
        previews: ["inertia"]
      }
    }],
    getColumn: ["GET /projects/columns/{column_id}", {
      mediaType: {
        previews: ["inertia"]
      }
    }],
    getPermissionForUser: ["GET /projects/{project_id}/collaborators/{username}/permission", {
      mediaType: {
        previews: ["inertia"]
      }
    }],
    listCards: ["GET /projects/columns/{column_id}/cards", {
      mediaType: {
        previews: ["inertia"]
      }
    }],
    listCollaborators: ["GET /projects/{project_id}/collaborators", {
      mediaType: {
        previews: ["inertia"]
      }
    }],
    listColumns: ["GET /projects/{project_id}/columns", {
      mediaType: {
        previews: ["inertia"]
      }
    }],
    listForOrg: ["GET /orgs/{org}/projects", {
      mediaType: {
        previews: ["inertia"]
      }
    }],
    listForRepo: ["GET /repos/{owner}/{repo}/projects", {
      mediaType: {
        previews: ["inertia"]
      }
    }],
    listForUser: ["GET /users/{username}/projects", {
      mediaType: {
        previews: ["inertia"]
      }
    }],
    moveCard: ["POST /projects/columns/cards/{card_id}/moves", {
      mediaType: {
        previews: ["inertia"]
      }
    }],
    moveColumn: ["POST /projects/columns/{column_id}/moves", {
      mediaType: {
        previews: ["inertia"]
      }
    }],
    removeCollaborator: ["DELETE /projects/{project_id}/collaborators/{username}", {
      mediaType: {
        previews: ["inertia"]
      }
    }],
    update: ["PATCH /projects/{project_id}", {
      mediaType: {
        previews: ["inertia"]
      }
    }],
    updateCard: ["PATCH /projects/columns/cards/{card_id}", {
      mediaType: {
        previews: ["inertia"]
      }
    }],
    updateColumn: ["PATCH /projects/columns/{column_id}", {
      mediaType: {
        previews: ["inertia"]
      }
    }]
  },
  pulls: {
    checkIfMerged: ["GET /repos/{owner}/{repo}/pulls/{pull_number}/merge"],
    create: ["POST /repos/{owner}/{repo}/pulls"],
    createReplyForReviewComment: ["POST /repos/{owner}/{repo}/pulls/{pull_number}/comments/{comment_id}/replies"],
    createReview: ["POST /repos/{owner}/{repo}/pulls/{pull_number}/reviews"],
    createReviewComment: ["POST /repos/{owner}/{repo}/pulls/{pull_number}/comments"],
    deletePendingReview: ["DELETE /repos/{owner}/{repo}/pulls/{pull_number}/reviews/{review_id}"],
    deleteReviewComment: ["DELETE /repos/{owner}/{repo}/pulls/comments/{comment_id}"],
    dismissReview: ["PUT /repos/{owner}/{repo}/pulls/{pull_number}/reviews/{review_id}/dismissals"],
    get: ["GET /repos/{owner}/{repo}/pulls/{pull_number}"],
    getReview: ["GET /repos/{owner}/{repo}/pulls/{pull_number}/reviews/{review_id}"],
    getReviewComment: ["GET /repos/{owner}/{repo}/pulls/comments/{comment_id}"],
    list: ["GET /repos/{owner}/{repo}/pulls"],
    listCommentsForReview: ["GET /repos/{owner}/{repo}/pulls/{pull_number}/reviews/{review_id}/comments"],
    listCommits: ["GET /repos/{owner}/{repo}/pulls/{pull_number}/commits"],
    listFiles: ["GET /repos/{owner}/{repo}/pulls/{pull_number}/files"],
    listRequestedReviewers: ["GET /repos/{owner}/{repo}/pulls/{pull_number}/requested_reviewers"],
    listReviewComments: ["GET /repos/{owner}/{repo}/pulls/{pull_number}/comments"],
    listReviewCommentsForRepo: ["GET /repos/{owner}/{repo}/pulls/comments"],
    listReviews: ["GET /repos/{owner}/{repo}/pulls/{pull_number}/reviews"],
    merge: ["PUT /repos/{owner}/{repo}/pulls/{pull_number}/merge"],
    removeRequestedReviewers: ["DELETE /repos/{owner}/{repo}/pulls/{pull_number}/requested_reviewers"],
    requestReviewers: ["POST /repos/{owner}/{repo}/pulls/{pull_number}/requested_reviewers"],
    submitReview: ["POST /repos/{owner}/{repo}/pulls/{pull_number}/reviews/{review_id}/events"],
    update: ["PATCH /repos/{owner}/{repo}/pulls/{pull_number}"],
    updateBranch: ["PUT /repos/{owner}/{repo}/pulls/{pull_number}/update-branch", {
      mediaType: {
        previews: ["lydian"]
      }
    }],
    updateReview: ["PUT /repos/{owner}/{repo}/pulls/{pull_number}/reviews/{review_id}"],
    updateReviewComment: ["PATCH /repos/{owner}/{repo}/pulls/comments/{comment_id}"]
  },
  rateLimit: {
    get: ["GET /rate_limit"]
  },
  reactions: {
    createForCommitComment: ["POST /repos/{owner}/{repo}/comments/{comment_id}/reactions", {
      mediaType: {
        previews: ["squirrel-girl"]
      }
    }],
    createForIssue: ["POST /repos/{owner}/{repo}/issues/{issue_number}/reactions", {
      mediaType: {
        previews: ["squirrel-girl"]
      }
    }],
    createForIssueComment: ["POST /repos/{owner}/{repo}/issues/comments/{comment_id}/reactions", {
      mediaType: {
        previews: ["squirrel-girl"]
      }
    }],
    createForPullRequestReviewComment: ["POST /repos/{owner}/{repo}/pulls/comments/{comment_id}/reactions", {
      mediaType: {
        previews: ["squirrel-girl"]
      }
    }],
    createForTeamDiscussionCommentInOrg: ["POST /orgs/{org}/teams/{team_slug}/discussions/{discussion_number}/comments/{comment_number}/reactions", {
      mediaType: {
        previews: ["squirrel-girl"]
      }
    }],
    createForTeamDiscussionInOrg: ["POST /orgs/{org}/teams/{team_slug}/discussions/{discussion_number}/reactions", {
      mediaType: {
        previews: ["squirrel-girl"]
      }
    }],
    deleteForCommitComment: ["DELETE /repos/{owner}/{repo}/comments/{comment_id}/reactions/{reaction_id}", {
      mediaType: {
        previews: ["squirrel-girl"]
      }
    }],
    deleteForIssue: ["DELETE /repos/{owner}/{repo}/issues/{issue_number}/reactions/{reaction_id}", {
      mediaType: {
        previews: ["squirrel-girl"]
      }
    }],
    deleteForIssueComment: ["DELETE /repos/{owner}/{repo}/issues/comments/{comment_id}/reactions/{reaction_id}", {
      mediaType: {
        previews: ["squirrel-girl"]
      }
    }],
    deleteForPullRequestComment: ["DELETE /repos/{owner}/{repo}/pulls/comments/{comment_id}/reactions/{reaction_id}", {
      mediaType: {
        previews: ["squirrel-girl"]
      }
    }],
    deleteForTeamDiscussion: ["DELETE /orgs/{org}/teams/{team_slug}/discussions/{discussion_number}/reactions/{reaction_id}", {
      mediaType: {
        previews: ["squirrel-girl"]
      }
    }],
    deleteForTeamDiscussionComment: ["DELETE /orgs/{org}/teams/{team_slug}/discussions/{discussion_number}/comments/{comment_number}/reactions/{reaction_id}", {
      mediaType: {
        previews: ["squirrel-girl"]
      }
    }],
    deleteLegacy: ["DELETE /reactions/{reaction_id}", {
      mediaType: {
        previews: ["squirrel-girl"]
      }
    }, {
      deprecated: "octokit.reactions.deleteLegacy() is deprecated, see https://docs.github.com/v3/reactions/#delete-a-reaction-legacy"
    }],
    listForCommitComment: ["GET /repos/{owner}/{repo}/comments/{comment_id}/reactions", {
      mediaType: {
        previews: ["squirrel-girl"]
      }
    }],
    listForIssue: ["GET /repos/{owner}/{repo}/issues/{issue_number}/reactions", {
      mediaType: {
        previews: ["squirrel-girl"]
      }
    }],
    listForIssueComment: ["GET /repos/{owner}/{repo}/issues/comments/{comment_id}/reactions", {
      mediaType: {
        previews: ["squirrel-girl"]
      }
    }],
    listForPullRequestReviewComment: ["GET /repos/{owner}/{repo}/pulls/comments/{comment_id}/reactions", {
      mediaType: {
        previews: ["squirrel-girl"]
      }
    }],
    listForTeamDiscussionCommentInOrg: ["GET /orgs/{org}/teams/{team_slug}/discussions/{discussion_number}/comments/{comment_number}/reactions", {
      mediaType: {
        previews: ["squirrel-girl"]
      }
    }],
    listForTeamDiscussionInOrg: ["GET /orgs/{org}/teams/{team_slug}/discussions/{discussion_number}/reactions", {
      mediaType: {
        previews: ["squirrel-girl"]
      }
    }]
  },
  repos: {
    acceptInvitation: ["PATCH /user/repository_invitations/{invitation_id}"],
    addAppAccessRestrictions: ["POST /repos/{owner}/{repo}/branches/{branch}/protection/restrictions/apps", {}, {
      mapToData: "apps"
    }],
    addCollaborator: ["PUT /repos/{owner}/{repo}/collaborators/{username}"],
    addStatusCheckContexts: ["POST /repos/{owner}/{repo}/branches/{branch}/protection/required_status_checks/contexts", {}, {
      mapToData: "contexts"
    }],
    addTeamAccessRestrictions: ["POST /repos/{owner}/{repo}/branches/{branch}/protection/restrictions/teams", {}, {
      mapToData: "teams"
    }],
    addUserAccessRestrictions: ["POST /repos/{owner}/{repo}/branches/{branch}/protection/restrictions/users", {}, {
      mapToData: "users"
    }],
    checkCollaborator: ["GET /repos/{owner}/{repo}/collaborators/{username}"],
    checkVulnerabilityAlerts: ["GET /repos/{owner}/{repo}/vulnerability-alerts", {
      mediaType: {
        previews: ["dorian"]
      }
    }],
    compareCommits: ["GET /repos/{owner}/{repo}/compare/{base}...{head}"],
    createCommitComment: ["POST /repos/{owner}/{repo}/commits/{commit_sha}/comments"],
    createCommitSignatureProtection: ["POST /repos/{owner}/{repo}/branches/{branch}/protection/required_signatures", {
      mediaType: {
        previews: ["zzzax"]
      }
    }],
    createCommitStatus: ["POST /repos/{owner}/{repo}/statuses/{sha}"],
    createDeployKey: ["POST /repos/{owner}/{repo}/keys"],
    createDeployment: ["POST /repos/{owner}/{repo}/deployments"],
    createDeploymentStatus: ["POST /repos/{owner}/{repo}/deployments/{deployment_id}/statuses"],
    createDispatchEvent: ["POST /repos/{owner}/{repo}/dispatches"],
    createForAuthenticatedUser: ["POST /user/repos"],
    createFork: ["POST /repos/{owner}/{repo}/forks"],
    createInOrg: ["POST /orgs/{org}/repos"],
    createOrUpdateFileContents: ["PUT /repos/{owner}/{repo}/contents/{path}"],
    createPagesSite: ["POST /repos/{owner}/{repo}/pages", {
      mediaType: {
        previews: ["switcheroo"]
      }
    }],
    createRelease: ["POST /repos/{owner}/{repo}/releases"],
    createUsingTemplate: ["POST /repos/{template_owner}/{template_repo}/generate", {
      mediaType: {
        previews: ["baptiste"]
      }
    }],
    createWebhook: ["POST /repos/{owner}/{repo}/hooks"],
    declineInvitation: ["DELETE /user/repository_invitations/{invitation_id}"],
    delete: ["DELETE /repos/{owner}/{repo}"],
    deleteAccessRestrictions: ["DELETE /repos/{owner}/{repo}/branches/{branch}/protection/restrictions"],
    deleteAdminBranchProtection: ["DELETE /repos/{owner}/{repo}/branches/{branch}/protection/enforce_admins"],
    deleteBranchProtection: ["DELETE /repos/{owner}/{repo}/branches/{branch}/protection"],
    deleteCommitComment: ["DELETE /repos/{owner}/{repo}/comments/{comment_id}"],
    deleteCommitSignatureProtection: ["DELETE /repos/{owner}/{repo}/branches/{branch}/protection/required_signatures", {
      mediaType: {
        previews: ["zzzax"]
      }
    }],
    deleteDeployKey: ["DELETE /repos/{owner}/{repo}/keys/{key_id}"],
    deleteDeployment: ["DELETE /repos/{owner}/{repo}/deployments/{deployment_id}"],
    deleteFile: ["DELETE /repos/{owner}/{repo}/contents/{path}"],
    deleteInvitation: ["DELETE /repos/{owner}/{repo}/invitations/{invitation_id}"],
    deletePagesSite: ["DELETE /repos/{owner}/{repo}/pages", {
      mediaType: {
        previews: ["switcheroo"]
      }
    }],
    deletePullRequestReviewProtection: ["DELETE /repos/{owner}/{repo}/branches/{branch}/protection/required_pull_request_reviews"],
    deleteRelease: ["DELETE /repos/{owner}/{repo}/releases/{release_id}"],
    deleteReleaseAsset: ["DELETE /repos/{owner}/{repo}/releases/assets/{asset_id}"],
    deleteWebhook: ["DELETE /repos/{owner}/{repo}/hooks/{hook_id}"],
    disableAutomatedSecurityFixes: ["DELETE /repos/{owner}/{repo}/automated-security-fixes", {
      mediaType: {
        previews: ["london"]
      }
    }],
    disableVulnerabilityAlerts: ["DELETE /repos/{owner}/{repo}/vulnerability-alerts", {
      mediaType: {
        previews: ["dorian"]
      }
    }],
    downloadArchive: ["GET /repos/{owner}/{repo}/zipball/{ref}", {}, {
      renamed: ["repos", "downloadZipballArchive"]
    }],
    downloadTarballArchive: ["GET /repos/{owner}/{repo}/tarball/{ref}"],
    downloadZipballArchive: ["GET /repos/{owner}/{repo}/zipball/{ref}"],
    enableAutomatedSecurityFixes: ["PUT /repos/{owner}/{repo}/automated-security-fixes", {
      mediaType: {
        previews: ["london"]
      }
    }],
    enableVulnerabilityAlerts: ["PUT /repos/{owner}/{repo}/vulnerability-alerts", {
      mediaType: {
        previews: ["dorian"]
      }
    }],
    get: ["GET /repos/{owner}/{repo}"],
    getAccessRestrictions: ["GET /repos/{owner}/{repo}/branches/{branch}/protection/restrictions"],
    getAdminBranchProtection: ["GET /repos/{owner}/{repo}/branches/{branch}/protection/enforce_admins"],
    getAllStatusCheckContexts: ["GET /repos/{owner}/{repo}/branches/{branch}/protection/required_status_checks/contexts"],
    getAllTopics: ["GET /repos/{owner}/{repo}/topics", {
      mediaType: {
        previews: ["mercy"]
      }
    }],
    getAppsWithAccessToProtectedBranch: ["GET /repos/{owner}/{repo}/branches/{branch}/protection/restrictions/apps"],
    getBranch: ["GET /repos/{owner}/{repo}/branches/{branch}"],
    getBranchProtection: ["GET /repos/{owner}/{repo}/branches/{branch}/protection"],
    getClones: ["GET /repos/{owner}/{repo}/traffic/clones"],
    getCodeFrequencyStats: ["GET /repos/{owner}/{repo}/stats/code_frequency"],
    getCollaboratorPermissionLevel: ["GET /repos/{owner}/{repo}/collaborators/{username}/permission"],
    getCombinedStatusForRef: ["GET /repos/{owner}/{repo}/commits/{ref}/status"],
    getCommit: ["GET /repos/{owner}/{repo}/commits/{ref}"],
    getCommitActivityStats: ["GET /repos/{owner}/{repo}/stats/commit_activity"],
    getCommitComment: ["GET /repos/{owner}/{repo}/comments/{comment_id}"],
    getCommitSignatureProtection: ["GET /repos/{owner}/{repo}/branches/{branch}/protection/required_signatures", {
      mediaType: {
        previews: ["zzzax"]
      }
    }],
    getCommunityProfileMetrics: ["GET /repos/{owner}/{repo}/community/profile"],
    getContent: ["GET /repos/{owner}/{repo}/contents/{path}"],
    getContributorsStats: ["GET /repos/{owner}/{repo}/stats/contributors"],
    getDeployKey: ["GET /repos/{owner}/{repo}/keys/{key_id}"],
    getDeployment: ["GET /repos/{owner}/{repo}/deployments/{deployment_id}"],
    getDeploymentStatus: ["GET /repos/{owner}/{repo}/deployments/{deployment_id}/statuses/{status_id}"],
    getLatestPagesBuild: ["GET /repos/{owner}/{repo}/pages/builds/latest"],
    getLatestRelease: ["GET /repos/{owner}/{repo}/releases/latest"],
    getPages: ["GET /repos/{owner}/{repo}/pages"],
    getPagesBuild: ["GET /repos/{owner}/{repo}/pages/builds/{build_id}"],
    getParticipationStats: ["GET /repos/{owner}/{repo}/stats/participation"],
    getPullRequestReviewProtection: ["GET /repos/{owner}/{repo}/branches/{branch}/protection/required_pull_request_reviews"],
    getPunchCardStats: ["GET /repos/{owner}/{repo}/stats/punch_card"],
    getReadme: ["GET /repos/{owner}/{repo}/readme"],
    getRelease: ["GET /repos/{owner}/{repo}/releases/{release_id}"],
    getReleaseAsset: ["GET /repos/{owner}/{repo}/releases/assets/{asset_id}"],
    getReleaseByTag: ["GET /repos/{owner}/{repo}/releases/tags/{tag}"],
    getStatusChecksProtection: ["GET /repos/{owner}/{repo}/branches/{branch}/protection/required_status_checks"],
    getTeamsWithAccessToProtectedBranch: ["GET /repos/{owner}/{repo}/branches/{branch}/protection/restrictions/teams"],
    getTopPaths: ["GET /repos/{owner}/{repo}/traffic/popular/paths"],
    getTopReferrers: ["GET /repos/{owner}/{repo}/traffic/popular/referrers"],
    getUsersWithAccessToProtectedBranch: ["GET /repos/{owner}/{repo}/branches/{branch}/protection/restrictions/users"],
    getViews: ["GET /repos/{owner}/{repo}/traffic/views"],
    getWebhook: ["GET /repos/{owner}/{repo}/hooks/{hook_id}"],
    getWebhookConfigForRepo: ["GET /repos/{owner}/{repo}/hooks/{hook_id}/config"],
    listBranches: ["GET /repos/{owner}/{repo}/branches"],
    listBranchesForHeadCommit: ["GET /repos/{owner}/{repo}/commits/{commit_sha}/branches-where-head", {
      mediaType: {
        previews: ["groot"]
      }
    }],
    listCollaborators: ["GET /repos/{owner}/{repo}/collaborators"],
    listCommentsForCommit: ["GET /repos/{owner}/{repo}/commits/{commit_sha}/comments"],
    listCommitCommentsForRepo: ["GET /repos/{owner}/{repo}/comments"],
    listCommitStatusesForRef: ["GET /repos/{owner}/{repo}/commits/{ref}/statuses"],
    listCommits: ["GET /repos/{owner}/{repo}/commits"],
    listContributors: ["GET /repos/{owner}/{repo}/contributors"],
    listDeployKeys: ["GET /repos/{owner}/{repo}/keys"],
    listDeploymentStatuses: ["GET /repos/{owner}/{repo}/deployments/{deployment_id}/statuses"],
    listDeployments: ["GET /repos/{owner}/{repo}/deployments"],
    listForAuthenticatedUser: ["GET /user/repos"],
    listForOrg: ["GET /orgs/{org}/repos"],
    listForUser: ["GET /users/{username}/repos"],
    listForks: ["GET /repos/{owner}/{repo}/forks"],
    listInvitations: ["GET /repos/{owner}/{repo}/invitations"],
    listInvitationsForAuthenticatedUser: ["GET /user/repository_invitations"],
    listLanguages: ["GET /repos/{owner}/{repo}/languages"],
    listPagesBuilds: ["GET /repos/{owner}/{repo}/pages/builds"],
    listPublic: ["GET /repositories"],
    listPullRequestsAssociatedWithCommit: ["GET /repos/{owner}/{repo}/commits/{commit_sha}/pulls", {
      mediaType: {
        previews: ["groot"]
      }
    }],
    listReleaseAssets: ["GET /repos/{owner}/{repo}/releases/{release_id}/assets"],
    listReleases: ["GET /repos/{owner}/{repo}/releases"],
    listTags: ["GET /repos/{owner}/{repo}/tags"],
    listTeams: ["GET /repos/{owner}/{repo}/teams"],
    listWebhooks: ["GET /repos/{owner}/{repo}/hooks"],
    merge: ["POST /repos/{owner}/{repo}/merges"],
    pingWebhook: ["POST /repos/{owner}/{repo}/hooks/{hook_id}/pings"],
    removeAppAccessRestrictions: ["DELETE /repos/{owner}/{repo}/branches/{branch}/protection/restrictions/apps", {}, {
      mapToData: "apps"
    }],
    removeCollaborator: ["DELETE /repos/{owner}/{repo}/collaborators/{username}"],
    removeStatusCheckContexts: ["DELETE /repos/{owner}/{repo}/branches/{branch}/protection/required_status_checks/contexts", {}, {
      mapToData: "contexts"
    }],
    removeStatusCheckProtection: ["DELETE /repos/{owner}/{repo}/branches/{branch}/protection/required_status_checks"],
    removeTeamAccessRestrictions: ["DELETE /repos/{owner}/{repo}/branches/{branch}/protection/restrictions/teams", {}, {
      mapToData: "teams"
    }],
    removeUserAccessRestrictions: ["DELETE /repos/{owner}/{repo}/branches/{branch}/protection/restrictions/users", {}, {
      mapToData: "users"
    }],
    renameBranch: ["POST /repos/{owner}/{repo}/branches/{branch}/rename"],
    replaceAllTopics: ["PUT /repos/{owner}/{repo}/topics", {
      mediaType: {
        previews: ["mercy"]
      }
    }],
    requestPagesBuild: ["POST /repos/{owner}/{repo}/pages/builds"],
    setAdminBranchProtection: ["POST /repos/{owner}/{repo}/branches/{branch}/protection/enforce_admins"],
    setAppAccessRestrictions: ["PUT /repos/{owner}/{repo}/branches/{branch}/protection/restrictions/apps", {}, {
      mapToData: "apps"
    }],
    setStatusCheckContexts: ["PUT /repos/{owner}/{repo}/branches/{branch}/protection/required_status_checks/contexts", {}, {
      mapToData: "contexts"
    }],
    setTeamAccessRestrictions: ["PUT /repos/{owner}/{repo}/branches/{branch}/protection/restrictions/teams", {}, {
      mapToData: "teams"
    }],
    setUserAccessRestrictions: ["PUT /repos/{owner}/{repo}/branches/{branch}/protection/restrictions/users", {}, {
      mapToData: "users"
    }],
    testPushWebhook: ["POST /repos/{owner}/{repo}/hooks/{hook_id}/tests"],
    transfer: ["POST /repos/{owner}/{repo}/transfer"],
    update: ["PATCH /repos/{owner}/{repo}"],
    updateBranchProtection: ["PUT /repos/{owner}/{repo}/branches/{branch}/protection"],
    updateCommitComment: ["PATCH /repos/{owner}/{repo}/comments/{comment_id}"],
    updateInformationAboutPagesSite: ["PUT /repos/{owner}/{repo}/pages"],
    updateInvitation: ["PATCH /repos/{owner}/{repo}/invitations/{invitation_id}"],
    updatePullRequestReviewProtection: ["PATCH /repos/{owner}/{repo}/branches/{branch}/protection/required_pull_request_reviews"],
    updateRelease: ["PATCH /repos/{owner}/{repo}/releases/{release_id}"],
    updateReleaseAsset: ["PATCH /repos/{owner}/{repo}/releases/assets/{asset_id}"],
    updateStatusCheckPotection: ["PATCH /repos/{owner}/{repo}/branches/{branch}/protection/required_status_checks", {}, {
      renamed: ["repos", "updateStatusCheckProtection"]
    }],
    updateStatusCheckProtection: ["PATCH /repos/{owner}/{repo}/branches/{branch}/protection/required_status_checks"],
    updateWebhook: ["PATCH /repos/{owner}/{repo}/hooks/{hook_id}"],
    updateWebhookConfigForRepo: ["PATCH /repos/{owner}/{repo}/hooks/{hook_id}/config"],
    uploadReleaseAsset: ["POST /repos/{owner}/{repo}/releases/{release_id}/assets{?name,label}", {
      baseUrl: "https://uploads.github.com"
    }]
  },
  search: {
    code: ["GET /search/code"],
    commits: ["GET /search/commits", {
      mediaType: {
        previews: ["cloak"]
      }
    }],
    issuesAndPullRequests: ["GET /search/issues"],
    labels: ["GET /search/labels"],
    repos: ["GET /search/repositories"],
    topics: ["GET /search/topics", {
      mediaType: {
        previews: ["mercy"]
      }
    }],
    users: ["GET /search/users"]
  },
  secretScanning: {
    getAlert: ["GET /repos/{owner}/{repo}/secret-scanning/alerts/{alert_number}"],
    listAlertsForRepo: ["GET /repos/{owner}/{repo}/secret-scanning/alerts"],
    updateAlert: ["PATCH /repos/{owner}/{repo}/secret-scanning/alerts/{alert_number}"]
  },
  teams: {
    addOrUpdateMembershipForUserInOrg: ["PUT /orgs/{org}/teams/{team_slug}/memberships/{username}"],
    addOrUpdateProjectPermissionsInOrg: ["PUT /orgs/{org}/teams/{team_slug}/projects/{project_id}", {
      mediaType: {
        previews: ["inertia"]
      }
    }],
    addOrUpdateRepoPermissionsInOrg: ["PUT /orgs/{org}/teams/{team_slug}/repos/{owner}/{repo}"],
    checkPermissionsForProjectInOrg: ["GET /orgs/{org}/teams/{team_slug}/projects/{project_id}", {
      mediaType: {
        previews: ["inertia"]
      }
    }],
    checkPermissionsForRepoInOrg: ["GET /orgs/{org}/teams/{team_slug}/repos/{owner}/{repo}"],
    create: ["POST /orgs/{org}/teams"],
    createDiscussionCommentInOrg: ["POST /orgs/{org}/teams/{team_slug}/discussions/{discussion_number}/comments"],
    createDiscussionInOrg: ["POST /orgs/{org}/teams/{team_slug}/discussions"],
    deleteDiscussionCommentInOrg: ["DELETE /orgs/{org}/teams/{team_slug}/discussions/{discussion_number}/comments/{comment_number}"],
    deleteDiscussionInOrg: ["DELETE /orgs/{org}/teams/{team_slug}/discussions/{discussion_number}"],
    deleteInOrg: ["DELETE /orgs/{org}/teams/{team_slug}"],
    getByName: ["GET /orgs/{org}/teams/{team_slug}"],
    getDiscussionCommentInOrg: ["GET /orgs/{org}/teams/{team_slug}/discussions/{discussion_number}/comments/{comment_number}"],
    getDiscussionInOrg: ["GET /orgs/{org}/teams/{team_slug}/discussions/{discussion_number}"],
    getMembershipForUserInOrg: ["GET /orgs/{org}/teams/{team_slug}/memberships/{username}"],
    list: ["GET /orgs/{org}/teams"],
    listChildInOrg: ["GET /orgs/{org}/teams/{team_slug}/teams"],
    listDiscussionCommentsInOrg: ["GET /orgs/{org}/teams/{team_slug}/discussions/{discussion_number}/comments"],
    listDiscussionsInOrg: ["GET /orgs/{org}/teams/{team_slug}/discussions"],
    listForAuthenticatedUser: ["GET /user/teams"],
    listMembersInOrg: ["GET /orgs/{org}/teams/{team_slug}/members"],
    listPendingInvitationsInOrg: ["GET /orgs/{org}/teams/{team_slug}/invitations"],
    listProjectsInOrg: ["GET /orgs/{org}/teams/{team_slug}/projects", {
      mediaType: {
        previews: ["inertia"]
      }
    }],
    listReposInOrg: ["GET /orgs/{org}/teams/{team_slug}/repos"],
    removeMembershipForUserInOrg: ["DELETE /orgs/{org}/teams/{team_slug}/memberships/{username}"],
    removeProjectInOrg: ["DELETE /orgs/{org}/teams/{team_slug}/projects/{project_id}"],
    removeRepoInOrg: ["DELETE /orgs/{org}/teams/{team_slug}/repos/{owner}/{repo}"],
    updateDiscussionCommentInOrg: ["PATCH /orgs/{org}/teams/{team_slug}/discussions/{discussion_number}/comments/{comment_number}"],
    updateDiscussionInOrg: ["PATCH /orgs/{org}/teams/{team_slug}/discussions/{discussion_number}"],
    updateInOrg: ["PATCH /orgs/{org}/teams/{team_slug}"]
  },
  users: {
    addEmailForAuthenticated: ["POST /user/emails"],
    block: ["PUT /user/blocks/{username}"],
    checkBlocked: ["GET /user/blocks/{username}"],
    checkFollowingForUser: ["GET /users/{username}/following/{target_user}"],
    checkPersonIsFollowedByAuthenticated: ["GET /user/following/{username}"],
    createGpgKeyForAuthenticated: ["POST /user/gpg_keys"],
    createPublicSshKeyForAuthenticated: ["POST /user/keys"],
    deleteEmailForAuthenticated: ["DELETE /user/emails"],
    deleteGpgKeyForAuthenticated: ["DELETE /user/gpg_keys/{gpg_key_id}"],
    deletePublicSshKeyForAuthenticated: ["DELETE /user/keys/{key_id}"],
    follow: ["PUT /user/following/{username}"],
    getAuthenticated: ["GET /user"],
    getByUsername: ["GET /users/{username}"],
    getContextForUser: ["GET /users/{username}/hovercard"],
    getGpgKeyForAuthenticated: ["GET /user/gpg_keys/{gpg_key_id}"],
    getPublicSshKeyForAuthenticated: ["GET /user/keys/{key_id}"],
    list: ["GET /users"],
    listBlockedByAuthenticated: ["GET /user/blocks"],
    listEmailsForAuthenticated: ["GET /user/emails"],
    listFollowedByAuthenticated: ["GET /user/following"],
    listFollowersForAuthenticatedUser: ["GET /user/followers"],
    listFollowersForUser: ["GET /users/{username}/followers"],
    listFollowingForUser: ["GET /users/{username}/following"],
    listGpgKeysForAuthenticated: ["GET /user/gpg_keys"],
    listGpgKeysForUser: ["GET /users/{username}/gpg_keys"],
    listPublicEmailsForAuthenticated: ["GET /user/public_emails"],
    listPublicKeysForUser: ["GET /users/{username}/keys"],
    listPublicSshKeysForAuthenticated: ["GET /user/keys"],
    setPrimaryEmailVisibilityForAuthenticated: ["PATCH /user/email/visibility"],
    unblock: ["DELETE /user/blocks/{username}"],
    unfollow: ["DELETE /user/following/{username}"],
    updateAuthenticated: ["PATCH /user"]
  }
};

const VERSION = "4.12.0";

function endpointsToMethods(octokit, endpointsMap) {
  const newMethods = {};

  for (const [scope, endpoints] of Object.entries(endpointsMap)) {
    for (const [methodName, endpoint] of Object.entries(endpoints)) {
      const [route, defaults, decorations] = endpoint;
      const [method, url] = route.split(/ /);
      const endpointDefaults = Object.assign({
        method,
        url
      }, defaults);

      if (!newMethods[scope]) {
        newMethods[scope] = {};
      }

      const scopeMethods = newMethods[scope];

      if (decorations) {
        scopeMethods[methodName] = decorate(octokit, scope, methodName, endpointDefaults, decorations);
        continue;
      }

      scopeMethods[methodName] = octokit.request.defaults(endpointDefaults);
    }
  }

  return newMethods;
}

function decorate(octokit, scope, methodName, defaults, decorations) {
  const requestWithDefaults = octokit.request.defaults(defaults);
  /* istanbul ignore next */

  function withDecorations(...args) {
    // @ts-ignore https://github.com/microsoft/TypeScript/issues/25488
    let options = requestWithDefaults.endpoint.merge(...args); // There are currently no other decorations than `.mapToData`

    if (decorations.mapToData) {
      options = Object.assign({}, options, {
        data: options[decorations.mapToData],
        [decorations.mapToData]: undefined
      });
      return requestWithDefaults(options);
    }

    if (decorations.renamed) {
      const [newScope, newMethodName] = decorations.renamed;
      octokit.log.warn(`octokit.${scope}.${methodName}() has been renamed to octokit.${newScope}.${newMethodName}()`);
    }

    if (decorations.deprecated) {
      octokit.log.warn(decorations.deprecated);
    }

    if (decorations.renamedParameters) {
      // @ts-ignore https://github.com/microsoft/TypeScript/issues/25488
      const options = requestWithDefaults.endpoint.merge(...args);

      for (const [name, alias] of Object.entries(decorations.renamedParameters)) {
        if (name in options) {
          octokit.log.warn(`"${name}" parameter is deprecated for "octokit.${scope}.${methodName}()". Use "${alias}" instead`);

          if (!(alias in options)) {
            options[alias] = options[name];
          }

          delete options[name];
        }
      }

      return requestWithDefaults(options);
    } // @ts-ignore https://github.com/microsoft/TypeScript/issues/25488


    return requestWithDefaults(...args);
  }

  return Object.assign(withDecorations, requestWithDefaults);
}

function restEndpointMethods(octokit) {
  return endpointsToMethods(octokit, Endpoints);
}
restEndpointMethods.VERSION = VERSION;

exports.restEndpointMethods = restEndpointMethods;
//# sourceMappingURL=index.js.map


/***/ }),

/***/ 537:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({ value: true }));

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var deprecation = __nccwpck_require__(8932);
var once = _interopDefault(__nccwpck_require__(1223));

const logOnce = once(deprecation => console.warn(deprecation));
/**
 * Error with extra properties to help with debugging
 */

class RequestError extends Error {
  constructor(message, statusCode, options) {
    super(message); // Maintains proper stack trace (only available on V8)

    /* istanbul ignore next */

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }

    this.name = "HttpError";
    this.status = statusCode;
    Object.defineProperty(this, "code", {
      get() {
        logOnce(new deprecation.Deprecation("[@octokit/request-error] `error.code` is deprecated, use `error.status`."));
        return statusCode;
      }

    });
    this.headers = options.headers || {}; // redact request credentials without mutating original request options

    const requestCopy = Object.assign({}, options.request);

    if (options.request.headers.authorization) {
      requestCopy.headers = Object.assign({}, options.request.headers, {
        authorization: options.request.headers.authorization.replace(/ .*$/, " [REDACTED]")
      });
    }

    requestCopy.url = requestCopy.url // client_id & client_secret can be passed as URL query parameters to increase rate limit
    // see https://developer.github.com/v3/#increasing-the-unauthenticated-rate-limit-for-oauth-applications
    .replace(/\bclient_secret=\w+/g, "client_secret=[REDACTED]") // OAuth tokens can be passed as URL query parameters, although it is not recommended
    // see https://developer.github.com/v3/#oauth2-token-sent-in-a-header
    .replace(/\baccess_token=\w+/g, "access_token=[REDACTED]");
    this.request = requestCopy;
  }

}

exports.RequestError = RequestError;
//# sourceMappingURL=index.js.map


/***/ }),

/***/ 6234:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({ value: true }));

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var endpoint = __nccwpck_require__(9440);
var universalUserAgent = __nccwpck_require__(5030);
var isPlainObject = __nccwpck_require__(9062);
var nodeFetch = _interopDefault(__nccwpck_require__(467));
var requestError = __nccwpck_require__(537);

const VERSION = "5.4.14";

function getBufferResponse(response) {
  return response.arrayBuffer();
}

function fetchWrapper(requestOptions) {
  if (isPlainObject.isPlainObject(requestOptions.body) || Array.isArray(requestOptions.body)) {
    requestOptions.body = JSON.stringify(requestOptions.body);
  }

  let headers = {};
  let status;
  let url;
  const fetch = requestOptions.request && requestOptions.request.fetch || nodeFetch;
  return fetch(requestOptions.url, Object.assign({
    method: requestOptions.method,
    body: requestOptions.body,
    headers: requestOptions.headers,
    redirect: requestOptions.redirect
  }, requestOptions.request)).then(response => {
    url = response.url;
    status = response.status;

    for (const keyAndValue of response.headers) {
      headers[keyAndValue[0]] = keyAndValue[1];
    }

    if (status === 204 || status === 205) {
      return;
    } // GitHub API returns 200 for HEAD requests


    if (requestOptions.method === "HEAD") {
      if (status < 400) {
        return;
      }

      throw new requestError.RequestError(response.statusText, status, {
        headers,
        request: requestOptions
      });
    }

    if (status === 304) {
      throw new requestError.RequestError("Not modified", status, {
        headers,
        request: requestOptions
      });
    }

    if (status >= 400) {
      return response.text().then(message => {
        const error = new requestError.RequestError(message, status, {
          headers,
          request: requestOptions
        });

        try {
          let responseBody = JSON.parse(error.message);
          Object.assign(error, responseBody);
          let errors = responseBody.errors; // Assumption `errors` would always be in Array format

          error.message = error.message + ": " + errors.map(JSON.stringify).join(", ");
        } catch (e) {// ignore, see octokit/rest.js#684
        }

        throw error;
      });
    }

    const contentType = response.headers.get("content-type");

    if (/application\/json/.test(contentType)) {
      return response.json();
    }

    if (!contentType || /^text\/|charset=utf-8$/.test(contentType)) {
      return response.text();
    }

    return getBufferResponse(response);
  }).then(data => {
    return {
      status,
      url,
      headers,
      data
    };
  }).catch(error => {
    if (error instanceof requestError.RequestError) {
      throw error;
    }

    throw new requestError.RequestError(error.message, 500, {
      headers,
      request: requestOptions
    });
  });
}

function withDefaults(oldEndpoint, newDefaults) {
  const endpoint = oldEndpoint.defaults(newDefaults);

  const newApi = function (route, parameters) {
    const endpointOptions = endpoint.merge(route, parameters);

    if (!endpointOptions.request || !endpointOptions.request.hook) {
      return fetchWrapper(endpoint.parse(endpointOptions));
    }

    const request = (route, parameters) => {
      return fetchWrapper(endpoint.parse(endpoint.merge(route, parameters)));
    };

    Object.assign(request, {
      endpoint,
      defaults: withDefaults.bind(null, endpoint)
    });
    return endpointOptions.request.hook(request, endpointOptions);
  };

  return Object.assign(newApi, {
    endpoint,
    defaults: withDefaults.bind(null, endpoint)
  });
}

const request = withDefaults(endpoint.endpoint, {
  headers: {
    "user-agent": `octokit-request.js/${VERSION} ${universalUserAgent.getUserAgent()}`
  }
});

exports.request = request;
//# sourceMappingURL=index.js.map


/***/ }),

/***/ 9062:
/***/ ((__unused_webpack_module, exports) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({ value: true }));

/*!
 * is-plain-object <https://github.com/jonschlinkert/is-plain-object>
 *
 * Copyright (c) 2014-2017, Jon Schlinkert.
 * Released under the MIT License.
 */

function isObject(o) {
  return Object.prototype.toString.call(o) === '[object Object]';
}

function isPlainObject(o) {
  var ctor,prot;

  if (isObject(o) === false) return false;

  // If has modified constructor
  ctor = o.constructor;
  if (ctor === undefined) return true;

  // If has modified prototype
  prot = ctor.prototype;
  if (isObject(prot) === false) return false;

  // If constructor does not have an Object-specific method
  if (prot.hasOwnProperty('isPrototypeOf') === false) {
    return false;
  }

  // Most likely a plain Object
  return true;
}

exports.isPlainObject = isPlainObject;


/***/ }),

/***/ 5375:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({ value: true }));

var core = __nccwpck_require__(6762);
var pluginRequestLog = __nccwpck_require__(8883);
var pluginPaginateRest = __nccwpck_require__(4193);
var pluginRestEndpointMethods = __nccwpck_require__(3044);

const VERSION = "18.2.0";

const Octokit = core.Octokit.plugin(pluginRequestLog.requestLog, pluginRestEndpointMethods.restEndpointMethods, pluginPaginateRest.paginateRest).defaults({
  userAgent: `octokit-rest.js/${VERSION}`
});

exports.Octokit = Octokit;
//# sourceMappingURL=index.js.map


/***/ }),

/***/ 3682:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

var register = __nccwpck_require__(4670)
var addHook = __nccwpck_require__(5549)
var removeHook = __nccwpck_require__(6819)

// bind with array of arguments: https://stackoverflow.com/a/21792913
var bind = Function.bind
var bindable = bind.bind(bind)

function bindApi (hook, state, name) {
  var removeHookRef = bindable(removeHook, null).apply(null, name ? [state, name] : [state])
  hook.api = { remove: removeHookRef }
  hook.remove = removeHookRef

  ;['before', 'error', 'after', 'wrap'].forEach(function (kind) {
    var args = name ? [state, kind, name] : [state, kind]
    hook[kind] = hook.api[kind] = bindable(addHook, null).apply(null, args)
  })
}

function HookSingular () {
  var singularHookName = 'h'
  var singularHookState = {
    registry: {}
  }
  var singularHook = register.bind(null, singularHookState, singularHookName)
  bindApi(singularHook, singularHookState, singularHookName)
  return singularHook
}

function HookCollection () {
  var state = {
    registry: {}
  }

  var hook = register.bind(null, state)
  bindApi(hook, state)

  return hook
}

var collectionHookDeprecationMessageDisplayed = false
function Hook () {
  if (!collectionHookDeprecationMessageDisplayed) {
    console.warn('[before-after-hook]: "Hook()" repurposing warning, use "Hook.Collection()". Read more: https://git.io/upgrade-before-after-hook-to-1.4')
    collectionHookDeprecationMessageDisplayed = true
  }
  return HookCollection()
}

Hook.Singular = HookSingular.bind()
Hook.Collection = HookCollection.bind()

module.exports = Hook
// expose constructors as a named property for TypeScript
module.exports.Hook = Hook
module.exports.Singular = Hook.Singular
module.exports.Collection = Hook.Collection


/***/ }),

/***/ 5549:
/***/ ((module) => {

module.exports = addHook;

function addHook(state, kind, name, hook) {
  var orig = hook;
  if (!state.registry[name]) {
    state.registry[name] = [];
  }

  if (kind === "before") {
    hook = function (method, options) {
      return Promise.resolve()
        .then(orig.bind(null, options))
        .then(method.bind(null, options));
    };
  }

  if (kind === "after") {
    hook = function (method, options) {
      var result;
      return Promise.resolve()
        .then(method.bind(null, options))
        .then(function (result_) {
          result = result_;
          return orig(result, options);
        })
        .then(function () {
          return result;
        });
    };
  }

  if (kind === "error") {
    hook = function (method, options) {
      return Promise.resolve()
        .then(method.bind(null, options))
        .catch(function (error) {
          return orig(error, options);
        });
    };
  }

  state.registry[name].push({
    hook: hook,
    orig: orig,
  });
}


/***/ }),

/***/ 4670:
/***/ ((module) => {

module.exports = register;

function register(state, name, method, options) {
  if (typeof method !== "function") {
    throw new Error("method for before hook must be a function");
  }

  if (!options) {
    options = {};
  }

  if (Array.isArray(name)) {
    return name.reverse().reduce(function (callback, name) {
      return register.bind(null, state, name, callback, options);
    }, method)();
  }

  return Promise.resolve().then(function () {
    if (!state.registry[name]) {
      return method(options);
    }

    return state.registry[name].reduce(function (method, registered) {
      return registered.hook.bind(null, method, options);
    }, method)();
  });
}


/***/ }),

/***/ 6819:
/***/ ((module) => {

module.exports = removeHook;

function removeHook(state, name, method) {
  if (!state.registry[name]) {
    return;
  }

  var index = state.registry[name]
    .map(function (registered) {
      return registered.orig;
    })
    .indexOf(method);

  if (index === -1) {
    return;
  }

  state.registry[name].splice(index, 1);
}


/***/ }),

/***/ 6582:
/***/ ((module) => {

"use strict";


module.exports = Error.captureStackTrace || function (error) {
	var container = new Error();

	Object.defineProperty(error, 'stack', {
		configurable: true,
		get: function getStack() {
			var stack = container.stack;

			Object.defineProperty(this, 'stack', {
				value: stack
			});

			return stack;
		}
	});
};


/***/ }),

/***/ 8201:
/***/ ((module) => {

"use strict";


module.exports = collapse

// `collapse(' \t\nbar \nbaz\t') // ' bar baz '`
function collapse(value) {
  return String(value).replace(/\s+/g, ' ')
}


/***/ }),

/***/ 594:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";

var path = __nccwpck_require__(5622);
var fs = __nccwpck_require__(7758);
var osenv = __nccwpck_require__(4669);
var assign = __nccwpck_require__(7426);
var mkdirp = __nccwpck_require__(6186);
var uuid = __nccwpck_require__(9197);
var xdgBasedir = __nccwpck_require__(3522);
var osTmpdir = __nccwpck_require__(1284);
var writeFileAtomic = __nccwpck_require__(6750);
var dotProp = __nccwpck_require__(2042);

var user = (osenv.user() || uuid.v4()).replace(/\\/g, '');
var configDir = xdgBasedir.config || path.join(osTmpdir(), user, '.config');
var permissionError = 'You don\'t have access to this file.';
var defaultPathMode = parseInt('0700', 8);
var writeFileOptions = {mode: parseInt('0600', 8)};

function Configstore(id, defaults, opts) {
	opts = opts || {};

	var pathPrefix = opts.globalConfigPath ?
		path.join(id, 'config.json') :
		path.join('configstore', id + '.json');

	this.path = path.join(configDir, pathPrefix);

	this.all = assign({}, defaults || {}, this.all || {});
}

Configstore.prototype = Object.create(Object.prototype, {
	all: {
		get: function () {
			try {
				return JSON.parse(fs.readFileSync(this.path, 'utf8'));
			} catch (err) {
				// create dir if it doesn't exist
				if (err.code === 'ENOENT') {
					mkdirp.sync(path.dirname(this.path), defaultPathMode);
					return {};
				}

				// improve the message of permission errors
				if (err.code === 'EACCES') {
					err.message = err.message + '\n' + permissionError + '\n';
				}

				// empty the file if it encounters invalid JSON
				if (err.name === 'SyntaxError') {
					writeFileAtomic.sync(this.path, '', writeFileOptions);
					return {};
				}

				throw err;
			}
		},
		set: function (val) {
			try {
				// make sure the folder exists as it
				// could have been deleted in the meantime
				mkdirp.sync(path.dirname(this.path), defaultPathMode);

				writeFileAtomic.sync(this.path, JSON.stringify(val, null, '\t'), writeFileOptions);
			} catch (err) {
				// improve the message of permission errors
				if (err.code === 'EACCES') {
					err.message = err.message + '\n' + permissionError + '\n';
				}

				throw err;
			}
		}
	},
	size: {
		get: function () {
			return Object.keys(this.all || {}).length;
		}
	}
});

Configstore.prototype.get = function (key) {
	return dotProp.get(this.all, key);
};

Configstore.prototype.set = function (key, val) {
	var config = this.all;
	if (arguments.length === 1) {
		Object.keys(key).forEach(function (k) {
			dotProp.set(config, k, key[k]);
		});
	} else {
		dotProp.set(config, key, val);
	}
	this.all = config;
};

Configstore.prototype.has = function (key) {
	return dotProp.has(this.all, key);
};

Configstore.prototype.delete = Configstore.prototype.del = function (key) {
	var config = this.all;
	dotProp.delete(config, key);
	this.all = config;
};

Configstore.prototype.clear = function () {
	this.all = {};
};

module.exports = Configstore;


/***/ }),

/***/ 6750:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";

module.exports = writeFile
module.exports.sync = writeFileSync
module.exports._getTmpname = getTmpname // for testing

var fs = __nccwpck_require__(7758)
var chain = __nccwpck_require__(6029).chain
var MurmurHash3 = __nccwpck_require__(2527)
var extend = Object.assign || __nccwpck_require__(1669)._extend

var invocations = 0
function getTmpname (filename) {
  return filename + '.' +
    MurmurHash3(__filename)
      .hash(String(process.pid))
      .hash(String(++invocations))
      .result()
}

function writeFile (filename, data, options, callback) {
  if (options instanceof Function) {
    callback = options
    options = null
  }
  if (!options) options = {}
  fs.realpath(filename, function (_, realname) {
    _writeFile(realname || filename, data, options, callback)
  })
}
function _writeFile (filename, data, options, callback) {
  var tmpfile = getTmpname(filename)

  if (options.mode && options.chown) {
    return thenWriteFile()
  } else {
    // Either mode or chown is not explicitly set
    // Default behavior is to copy it from original file
    return fs.stat(filename, function (err, stats) {
      if (err || !stats) return thenWriteFile()

      options = extend({}, options)
      if (!options.mode) {
        options.mode = stats.mode
      }
      if (!options.chown && process.getuid) {
        options.chown = { uid: stats.uid, gid: stats.gid }
      }
      return thenWriteFile()
    })
  }

  function thenWriteFile () {
    chain([
      [writeFileAsync, tmpfile, data, options.mode, options.encoding || 'utf8'],
      options.chown && [fs, fs.chown, tmpfile, options.chown.uid, options.chown.gid],
      options.mode && [fs, fs.chmod, tmpfile, options.mode],
      [fs, fs.rename, tmpfile, filename]
    ], function (err) {
      err ? fs.unlink(tmpfile, function () { callback(err) })
        : callback()
    })
  }

  // doing this instead of `fs.writeFile` in order to get the ability to
  // call `fsync`.
  function writeFileAsync (file, data, mode, encoding, cb) {
    fs.open(file, 'w', options.mode, function (err, fd) {
      if (err) return cb(err)
      if (Buffer.isBuffer(data)) {
        return fs.write(fd, data, 0, data.length, 0, syncAndClose)
      } else if (data != null) {
        return fs.write(fd, String(data), 0, String(encoding), syncAndClose)
      } else {
        return syncAndClose()
      }
      function syncAndClose (err) {
        if (err) return cb(err)
        fs.fsync(fd, function (err) {
          if (err) return cb(err)
          fs.close(fd, cb)
        })
      }
    })
  }
}

function writeFileSync (filename, data, options) {
  if (!options) options = {}
  try {
    filename = fs.realpathSync(filename)
  } catch (ex) {
    // it's ok, it'll happen on a not yet existing file
  }
  var tmpfile = getTmpname(filename)

  try {
    if (!options.mode || !options.chown) {
      // Either mode or chown is not explicitly set
      // Default behavior is to copy it from original file
      try {
        var stats = fs.statSync(filename)
        options = extend({}, options)
        if (!options.mode) {
          options.mode = stats.mode
        }
        if (!options.chown && process.getuid) {
          options.chown = { uid: stats.uid, gid: stats.gid }
        }
      } catch (ex) {
        // ignore stat errors
      }
    }

    var fd = fs.openSync(tmpfile, 'w', options.mode)
    if (Buffer.isBuffer(data)) {
      fs.writeSync(fd, data, 0, data.length, 0)
    } else if (data != null) {
      fs.writeSync(fd, String(data), 0, String(options.encoding || 'utf8'))
    }
    fs.fsyncSync(fd)
    fs.closeSync(fd)
    if (options.chown) fs.chownSync(tmpfile, options.chown.uid, options.chown.gid)
    if (options.mode) fs.chmodSync(tmpfile, options.mode)
    fs.renameSync(tmpfile, filename)
  } catch (err) {
    try { fs.unlinkSync(tmpfile) } catch (e) {}
    throw err
  }
}


/***/ }),

/***/ 4532:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";

var captureStackTrace = __nccwpck_require__(6582);

function inherits(ctor, superCtor) {
	ctor.super_ = superCtor;
	ctor.prototype = Object.create(superCtor.prototype, {
		constructor: {
			value: ctor,
			enumerable: false,
			writable: true,
			configurable: true
		}
	});
}

module.exports = function createErrorClass(className, setup) {
	if (typeof className !== 'string') {
		throw new TypeError('Expected className to be a string');
	}

	if (/[^0-9a-zA-Z_$]/.test(className)) {
		throw new Error('className contains invalid characters');
	}

	setup = setup || function (message) {
		this.message = message;
	};

	var ErrorClass = function () {
		Object.defineProperty(this, 'name', {
			configurable: true,
			value: className,
			writable: true
		});

		captureStackTrace(this, this.constructor);

		setup.apply(this, arguments);
	};

	inherits(ErrorClass, Error);

	return ErrorClass;
};


/***/ }),

/***/ 8932:
/***/ ((__unused_webpack_module, exports) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({ value: true }));

class Deprecation extends Error {
  constructor(message) {
    super(message); // Maintains proper stack trace (only available on V8)

    /* istanbul ignore next */

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }

    this.name = 'Deprecation';
  }

}

exports.Deprecation = Deprecation;


/***/ }),

/***/ 2042:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";

var isObj = __nccwpck_require__(1389);

module.exports.get = function (obj, path) {
	if (!isObj(obj) || typeof path !== 'string') {
		return obj;
	}

	var pathArr = getPathSegments(path);

	for (var i = 0; i < pathArr.length; i++) {
		var descriptor = Object.getOwnPropertyDescriptor(obj, pathArr[i]) || Object.getOwnPropertyDescriptor(Object.prototype, pathArr[i]);
		if (descriptor && !descriptor.enumerable) {
			return;
		}

		obj = obj[pathArr[i]];

		if (obj === undefined || obj === null) {
			// `obj` is either `undefined` or `null` so we want to stop the loop, and
			// if this is not the last bit of the path, and
			// if it did't return `undefined`
			// it would return `null` if `obj` is `null`
			// but we want `get({foo: null}, 'foo.bar')` to equal `undefined` not `null`
			if (i !== pathArr.length - 1) {
				return undefined;
			}

			break;
		}
	}

	return obj;
};

module.exports.set = function (obj, path, value) {
	if (!isObj(obj) || typeof path !== 'string') {
		return;
	}

	var pathArr = getPathSegments(path);

	for (var i = 0; i < pathArr.length; i++) {
		var p = pathArr[i];

		if (!isObj(obj[p])) {
			obj[p] = {};
		}

		if (i === pathArr.length - 1) {
			obj[p] = value;
		}

		obj = obj[p];
	}
};

module.exports.delete = function (obj, path) {
	if (!isObj(obj) || typeof path !== 'string') {
		return;
	}

	var pathArr = getPathSegments(path);

	for (var i = 0; i < pathArr.length; i++) {
		var p = pathArr[i];

		if (i === pathArr.length - 1) {
			delete obj[p];
			return;
		}

		obj = obj[p];
	}
};

module.exports.has = function (obj, path) {
	if (!isObj(obj) || typeof path !== 'string') {
		return false;
	}

	var pathArr = getPathSegments(path);

	for (var i = 0; i < pathArr.length; i++) {
		obj = obj[pathArr[i]];

		if (obj === undefined) {
			return false;
		}
	}

	return true;
};

function getPathSegments(path) {
	var pathArr = path.split('.');
	var parts = [];

	for (var i = 0; i < pathArr.length; i++) {
		var p = pathArr[i];

		while (p[p.length - 1] === '\\' && pathArr[i + 1] !== undefined) {
			p = p.slice(0, -1) + '.';
			p += pathArr[++i];
		}

		parts.push(p);
	}

	return parts;
}


/***/ }),

/***/ 7994:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";


var stream = __nccwpck_require__(2413);

function DuplexWrapper(options, writable, readable) {
  if (typeof readable === "undefined") {
    readable = writable;
    writable = options;
    options = null;
  }

  stream.Duplex.call(this, options);

  if (typeof readable.read !== "function") {
    readable = (new stream.Readable(options)).wrap(readable);
  }

  this._writable = writable;
  this._readable = readable;
  this._waiting = false;

  var self = this;

  writable.once("finish", function() {
    self.end();
  });

  this.once("finish", function() {
    writable.end();
  });

  readable.on("readable", function() {
    if (self._waiting) {
      self._waiting = false;
      self._read();
    }
  });

  readable.once("end", function() {
    self.push(null);
  });

  if (!options || typeof options.bubbleErrors === "undefined" || options.bubbleErrors) {
    writable.on("error", function(err) {
      self.emit("error", err);
    });

    readable.on("error", function(err) {
      self.emit("error", err);
    });
  }
}

DuplexWrapper.prototype = Object.create(stream.Duplex.prototype, {constructor: {value: DuplexWrapper}});

DuplexWrapper.prototype._write = function _write(input, encoding, done) {
  this._writable.write(input, encoding, done);
};

DuplexWrapper.prototype._read = function _read() {
  var buf;
  var reads = 0;
  while ((buf = this._readable.read()) !== null) {
    this.push(buf);
    reads++;
  }
  if (reads === 0) {
    this._waiting = true;
  }
};

module.exports = function duplex2(options, writable, readable) {
  return new DuplexWrapper(options, writable, readable);
};

module.exports.DuplexWrapper = DuplexWrapper;


/***/ }),

/***/ 8950:
/***/ ((module) => {

// This file is generated by `build.js`.
module.exports = {
  cmn: /[\u2E80-\u2E99\u2E9B-\u2EF3\u2F00-\u2FD5\u3005\u3007\u3021-\u3029\u3038-\u303B\u3400-\u4DB5\u4E00-\u9FEF\uF900-\uFA6D\uFA70-\uFAD9]|[\uD840-\uD868\uD86A-\uD86C\uD86F-\uD872\uD874-\uD879][\uDC00-\uDFFF]|\uD869[\uDC00-\uDED6\uDF00-\uDFFF]|\uD86D[\uDC00-\uDF34\uDF40-\uDFFF]|\uD86E[\uDC00-\uDC1D\uDC20-\uDFFF]|\uD873[\uDC00-\uDEA1\uDEB0-\uDFFF]|\uD87A[\uDC00-\uDFE0]|\uD87E[\uDC00-\uDE1D]/g,
  Latin: /[A-Za-z\xAA\xBA\xC0-\xD6\xD8-\xF6\xF8-\u02B8\u02E0-\u02E4\u1D00-\u1D25\u1D2C-\u1D5C\u1D62-\u1D65\u1D6B-\u1D77\u1D79-\u1DBE\u1E00-\u1EFF\u2071\u207F\u2090-\u209C\u212A\u212B\u2132\u214E\u2160-\u2188\u2C60-\u2C7F\uA722-\uA787\uA78B-\uA7BF\uA7C2-\uA7C6\uA7F7-\uA7FF\uAB30-\uAB5A\uAB5C-\uAB64\uAB66\uAB67\uFB00-\uFB06\uFF21-\uFF3A\uFF41-\uFF5A]/g,
  Cyrillic: /[\u0400-\u0484\u0487-\u052F\u1C80-\u1C88\u1D2B\u1D78\u2DE0-\u2DFF\uA640-\uA69F\uFE2E\uFE2F]/g,
  Arabic: /[\u0600-\u0604\u0606-\u060B\u060D-\u061A\u061C\u061E\u0620-\u063F\u0641-\u064A\u0656-\u066F\u0671-\u06DC\u06DE-\u06FF\u0750-\u077F\u08A0-\u08B4\u08B6-\u08BD\u08D3-\u08E1\u08E3-\u08FF\uFB50-\uFBC1\uFBD3-\uFD3D\uFD50-\uFD8F\uFD92-\uFDC7\uFDF0-\uFDFD\uFE70-\uFE74\uFE76-\uFEFC]|\uD803[\uDE60-\uDE7E]|\uD83B[\uDE00-\uDE03\uDE05-\uDE1F\uDE21\uDE22\uDE24\uDE27\uDE29-\uDE32\uDE34-\uDE37\uDE39\uDE3B\uDE42\uDE47\uDE49\uDE4B\uDE4D-\uDE4F\uDE51\uDE52\uDE54\uDE57\uDE59\uDE5B\uDE5D\uDE5F\uDE61\uDE62\uDE64\uDE67-\uDE6A\uDE6C-\uDE72\uDE74-\uDE77\uDE79-\uDE7C\uDE7E\uDE80-\uDE89\uDE8B-\uDE9B\uDEA1-\uDEA3\uDEA5-\uDEA9\uDEAB-\uDEBB\uDEF0\uDEF1]/g,
  ben: /[\u0980-\u0983\u0985-\u098C\u098F\u0990\u0993-\u09A8\u09AA-\u09B0\u09B2\u09B6-\u09B9\u09BC-\u09C4\u09C7\u09C8\u09CB-\u09CE\u09D7\u09DC\u09DD\u09DF-\u09E3\u09E6-\u09FE]/g,
  Devanagari: /[\u0900-\u0950\u0955-\u0963\u0966-\u097F\uA8E0-\uA8FF]/g,
  jpn: /[\u3041-\u3096\u309D-\u309F]|\uD82C[\uDC01-\uDD1E\uDD50-\uDD52]|\uD83C\uDE00|[\u30A1-\u30FA\u30FD-\u30FF\u31F0-\u31FF\u32D0-\u32FE\u3300-\u3357\uFF66-\uFF6F\uFF71-\uFF9D]|\uD82C[\uDC00\uDD64-\uDD67]|[㐀-䶵一-龯]/g,
  kor: /[\u1100-\u11FF\u302E\u302F\u3131-\u318E\u3200-\u321E\u3260-\u327E\uA960-\uA97C\uAC00-\uD7A3\uD7B0-\uD7C6\uD7CB-\uD7FB\uFFA0-\uFFBE\uFFC2-\uFFC7\uFFCA-\uFFCF\uFFD2-\uFFD7\uFFDA-\uFFDC]/g,
  tel: /[\u0C00-\u0C0C\u0C0E-\u0C10\u0C12-\u0C28\u0C2A-\u0C39\u0C3D-\u0C44\u0C46-\u0C48\u0C4A-\u0C4D\u0C55\u0C56\u0C58-\u0C5A\u0C60-\u0C63\u0C66-\u0C6F\u0C77-\u0C7F]/g,
  tam: /[\u0B82\u0B83\u0B85-\u0B8A\u0B8E-\u0B90\u0B92-\u0B95\u0B99\u0B9A\u0B9C\u0B9E\u0B9F\u0BA3\u0BA4\u0BA8-\u0BAA\u0BAE-\u0BB9\u0BBE-\u0BC2\u0BC6-\u0BC8\u0BCA-\u0BCD\u0BD0\u0BD7\u0BE6-\u0BFA]|\uD807[\uDFC0-\uDFF1\uDFFF]/g,
  guj: /[\u0A81-\u0A83\u0A85-\u0A8D\u0A8F-\u0A91\u0A93-\u0AA8\u0AAA-\u0AB0\u0AB2\u0AB3\u0AB5-\u0AB9\u0ABC-\u0AC5\u0AC7-\u0AC9\u0ACB-\u0ACD\u0AD0\u0AE0-\u0AE3\u0AE6-\u0AF1\u0AF9-\u0AFF]/g,
  kan: /[\u0C80-\u0C8C\u0C8E-\u0C90\u0C92-\u0CA8\u0CAA-\u0CB3\u0CB5-\u0CB9\u0CBC-\u0CC4\u0CC6-\u0CC8\u0CCA-\u0CCD\u0CD5\u0CD6\u0CDE\u0CE0-\u0CE3\u0CE6-\u0CEF\u0CF1\u0CF2]/g,
  mal: /[\u0D00-\u0D03\u0D05-\u0D0C\u0D0E-\u0D10\u0D12-\u0D44\u0D46-\u0D48\u0D4A-\u0D4F\u0D54-\u0D63\u0D66-\u0D7F]/g,
  mya: /[\u1000-\u109F\uA9E0-\uA9FE\uAA60-\uAA7F]/g,
  ori: /[\u0B01-\u0B03\u0B05-\u0B0C\u0B0F\u0B10\u0B13-\u0B28\u0B2A-\u0B30\u0B32\u0B33\u0B35-\u0B39\u0B3C-\u0B44\u0B47\u0B48\u0B4B-\u0B4D\u0B56\u0B57\u0B5C\u0B5D\u0B5F-\u0B63\u0B66-\u0B77]/g,
  pan: /[\u0A01-\u0A03\u0A05-\u0A0A\u0A0F\u0A10\u0A13-\u0A28\u0A2A-\u0A30\u0A32\u0A33\u0A35\u0A36\u0A38\u0A39\u0A3C\u0A3E-\u0A42\u0A47\u0A48\u0A4B-\u0A4D\u0A51\u0A59-\u0A5C\u0A5E\u0A66-\u0A76]/g,
  amh: /[\u1200-\u1248\u124A-\u124D\u1250-\u1256\u1258\u125A-\u125D\u1260-\u1288\u128A-\u128D\u1290-\u12B0\u12B2-\u12B5\u12B8-\u12BE\u12C0\u12C2-\u12C5\u12C8-\u12D6\u12D8-\u1310\u1312-\u1315\u1318-\u135A\u135D-\u137C\u1380-\u1399\u2D80-\u2D96\u2DA0-\u2DA6\u2DA8-\u2DAE\u2DB0-\u2DB6\u2DB8-\u2DBE\u2DC0-\u2DC6\u2DC8-\u2DCE\u2DD0-\u2DD6\u2DD8-\u2DDE\uAB01-\uAB06\uAB09-\uAB0E\uAB11-\uAB16\uAB20-\uAB26\uAB28-\uAB2E]/g,
  tha: /[\u0E01-\u0E3A\u0E40-\u0E5B]/g,
  sin: /[\u0D82\u0D83\u0D85-\u0D96\u0D9A-\u0DB1\u0DB3-\u0DBB\u0DBD\u0DC0-\u0DC6\u0DCA\u0DCF-\u0DD4\u0DD6\u0DD8-\u0DDF\u0DE6-\u0DEF\u0DF2-\u0DF4]|\uD804[\uDDE1-\uDDF4]/g,
  ell: /[\u0370-\u0373\u0375-\u0377\u037A-\u037D\u037F\u0384\u0386\u0388-\u038A\u038C\u038E-\u03A1\u03A3-\u03E1\u03F0-\u03FF\u1D26-\u1D2A\u1D5D-\u1D61\u1D66-\u1D6A\u1DBF\u1F00-\u1F15\u1F18-\u1F1D\u1F20-\u1F45\u1F48-\u1F4D\u1F50-\u1F57\u1F59\u1F5B\u1F5D\u1F5F-\u1F7D\u1F80-\u1FB4\u1FB6-\u1FC4\u1FC6-\u1FD3\u1FD6-\u1FDB\u1FDD-\u1FEF\u1FF2-\u1FF4\u1FF6-\u1FFE\u2126\uAB65]|\uD800[\uDD40-\uDD8E\uDDA0]|\uD834[\uDE00-\uDE45]/g
}


/***/ }),

/***/ 9554:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";
// This file is generated by `build.js`


/* Load `trigram-utils`. */
var utilities = __nccwpck_require__(8683)

/* Load `expressions` (regular expressions matching
 * scripts). */
var expressions = __nccwpck_require__(8950)

/* Load `data` (trigram information per language,
 * per script). */
var data = __nccwpck_require__(7943)

/* Expose `detectAll` on `detect`. */
detect.all = detectAll

/* Expose `detect`. */
module.exports = detect

/* Maximum sample length. */
var MAX_LENGTH = 2048

/* Minimum sample length. */
var MIN_LENGTH = 10

/* The maximum distance to add when a given trigram does
 * not exist in a trigram dictionary. */
var MAX_DIFFERENCE = 300

/* Construct trigram dictionaries. */
;(function() {
  var languages
  var name
  var trigrams
  var model
  var script
  var weight

  for (script in data) {
    languages = data[script]

    for (name in languages) {
      model = languages[name].split('|')

      weight = model.length

      trigrams = {}

      while (weight--) {
        trigrams[model[weight]] = weight
      }

      languages[name] = trigrams
    }
  }
})()

/**
 * Get the most probable language for the given value.
 *
 * @param {string} value - The value to test.
 * @param {Object} options - Configuration.
 * @return {string} The most probable language.
 */
function detect(value, options) {
  return detectAll(value, options)[0][0]
}

/**
 * Get a list of probable languages the given value is
 * written in.
 *
 * @param {string} value - The value to test.
 * @param {Object} options - Configuration.
 * @return {Array.<Array.<string, number>>} An array
 *   containing language--distance tuples.
 */
function detectAll(value, options) {
  var settings = options || {}
  var minLength = MIN_LENGTH
  var only = [].concat(settings.whitelist || [], settings.only || [])
  var ignore = [].concat(settings.blacklist || [], settings.ignore || [])
  var script

  if (settings.minLength !== null && settings.minLength !== undefined) {
    minLength = settings.minLength
  }

  if (!value || value.length < minLength) {
    return und()
  }

  value = value.slice(0, MAX_LENGTH)

  /* Get the script which characters occur the most
   * in `value`. */
  script = getTopScript(value, expressions)

  /* One languages exists for the most-used script. */
  if (!(script[0] in data)) {
    /* If no matches occured, such as a digit only string,
     * or because the language is ignored, exit with `und`. */
    if (script[1] === 0 || !allow(script[0], only, ignore)) {
      return und()
    }

    return singleLanguageTuples(script[0])
  }

  /* Get all distances for a given script, and
   * normalize the distance values. */
  return normalize(
    value,
    getDistances(utilities.asTuples(value), data[script[0]], only, ignore)
  )
}

/**
 * Normalize the difference for each tuple in
 * `distances`.
 *
 * @param {string} value - Value to normalize.
 * @param {Array.<Array.<string, number>>} distances
 *   - List of distances.
 * @return {Array.<Array.<string, number>>} - Normalized
 *   distances.
 */
function normalize(value, distances) {
  var min = distances[0][1]
  var max = value.length * MAX_DIFFERENCE - min
  var index = -1
  var length = distances.length

  while (++index < length) {
    distances[index][1] = 1 - (distances[index][1] - min) / max || 0
  }

  return distances
}

/**
 * From `scripts`, get the most occurring expression for
 * `value`.
 *
 * @param {string} value - Value to check.
 * @param {Object.<RegExp>} scripts - Top-Scripts.
 * @return {Array} Top script and its
 *   occurrence percentage.
 */
function getTopScript(value, scripts) {
  var topCount = -1
  var topScript
  var script
  var count

  for (script in scripts) {
    count = getOccurrence(value, scripts[script])

    if (count > topCount) {
      topCount = count
      topScript = script
    }
  }

  return [topScript, topCount]
}

/**
 * Get the occurrence ratio of `expression` for `value`.
 *
 * @param {string} value - Value to check.
 * @param {RegExp} expression - Code-point expression.
 * @return {number} Float between 0 and 1.
 */
function getOccurrence(value, expression) {
  var count = value.match(expression)

  return (count ? count.length : 0) / value.length || 0
}

/**
 * Get the distance between an array of trigram--count
 * tuples, and multiple trigram dictionaries.
 *
 * @param {Array.<Array.<string, number>>} trigrams - An
 *   array containing trigram--count tuples.
 * @param {Object.<Object>} languages - multiple
 *   trigrams to test against.
 * @param {Array.<string>} only - Allowed languages; if
 *   non-empty, only included languages are kept.
 * @param {Array.<string>} ignore - Disallowed languages;
 *   included languages are ignored.
 * @return {Array.<Array.<string, number>>} An array
 *   containing language--distance tuples.
 */
function getDistances(trigrams, languages, only, ignore) {
  var distances = []
  var language

  languages = filterLanguages(languages, only, ignore)

  for (language in languages) {
    distances.push([language, getDistance(trigrams, languages[language])])
  }

  return distances.length === 0 ? und() : distances.sort(sort)
}

/**
 * Get the distance between an array of trigram--count
 * tuples, and a language dictionary.
 *
 * @param {Array.<Array.<string, number>>} trigrams - An
 *   array containing trigram--count tuples.
 * @param {Object.<number>} model - Object
 *   containing weighted trigrams.
 * @return {number} - The distance between the two.
 */
function getDistance(trigrams, model) {
  var distance = 0
  var index = -1
  var length = trigrams.length
  var trigram
  var difference

  while (++index < length) {
    trigram = trigrams[index]

    if (trigram[0] in model) {
      difference = trigram[1] - model[trigram[0]] - 1

      if (difference < 0) {
        difference = -difference
      }
    } else {
      difference = MAX_DIFFERENCE
    }

    distance += difference
  }

  return distance
}

/**
 * Filter `languages` by removing languages in
 * `ignore`, or including languages in `only`.
 *
 * @param {Object.<Object>} languages - Languages
 *   to filter
 * @param {Array.<string>} only - Allowed languages; if
 *   non-empty, only included languages are kept.
 * @param {Array.<string>} ignore - Disallowed languages;
 *   included languages are ignored.
 * @return {Object.<Object>} - Filtered array of
 *   languages.
 */
function filterLanguages(languages, only, ignore) {
  var filteredLanguages
  var language

  if (only.length === 0 && ignore.length === 0) {
    return languages
  }

  filteredLanguages = {}

  for (language in languages) {
    if (allow(language, only, ignore)) {
      filteredLanguages[language] = languages[language]
    }
  }

  return filteredLanguages
}

/**
 * Check if `language` can match according to settings.
 *
 * @param {string} language - Languages
 *   to filter
 * @param {Array.<string>} only - Allowed languages; if
 *   non-empty, only included languages are kept.
 * @param {Array.<string>} ignore - Disallowed languages;
 *   included languages are ignored.
 * @return {boolean} - Whether `language` can match
 */
function allow(language, only, ignore) {
  if (only.length === 0 && ignore.length === 0) {
    return true
  }

  return (
    (only.length === 0 || only.indexOf(language) !== -1) &&
    ignore.indexOf(language) === -1
  )
}

/* Create a single `und` tuple. */
function und() {
  return singleLanguageTuples('und')
}

/* Create a single tuple as a list of tuples from a given
 * language code. */
function singleLanguageTuples(language) {
  return [[language, 1]]
}

/* Deep regular sort on the number at `1` in both objects. */
function sort(a, b) {
  return a[1] - b[1]
}


/***/ }),

/***/ 1585:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";

const PassThrough = __nccwpck_require__(2413).PassThrough;

module.exports = opts => {
	opts = Object.assign({}, opts);

	const array = opts.array;
	let encoding = opts.encoding;
	const buffer = encoding === 'buffer';
	let objectMode = false;

	if (array) {
		objectMode = !(encoding || buffer);
	} else {
		encoding = encoding || 'utf8';
	}

	if (buffer) {
		encoding = null;
	}

	let len = 0;
	const ret = [];
	const stream = new PassThrough({objectMode});

	if (encoding) {
		stream.setEncoding(encoding);
	}

	stream.on('data', chunk => {
		ret.push(chunk);

		if (objectMode) {
			len = ret.length;
		} else {
			len += chunk.length;
		}
	});

	stream.getBufferedValue = () => {
		if (array) {
			return ret;
		}

		return buffer ? Buffer.concat(ret, len) : ret.join('');
	};

	stream.getBufferedLength = () => len;

	return stream;
};


/***/ }),

/***/ 1766:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";

const bufferStream = __nccwpck_require__(1585);

function getStream(inputStream, opts) {
	if (!inputStream) {
		return Promise.reject(new Error('Expected a stream'));
	}

	opts = Object.assign({maxBuffer: Infinity}, opts);

	const maxBuffer = opts.maxBuffer;
	let stream;
	let clean;

	const p = new Promise((resolve, reject) => {
		const error = err => {
			if (err) { // null check
				err.bufferedData = stream.getBufferedValue();
			}

			reject(err);
		};

		stream = bufferStream(opts);
		inputStream.once('error', error);
		inputStream.pipe(stream);

		stream.on('data', () => {
			if (stream.getBufferedLength() > maxBuffer) {
				reject(new Error('maxBuffer exceeded'));
			}
		});
		stream.once('error', error);
		stream.on('end', resolve);

		clean = () => {
			// some streams doesn't implement the `stream.Readable` interface correctly
			if (inputStream.unpipe) {
				inputStream.unpipe(stream);
			}
		};
	});

	p.then(clean, clean);

	return p.then(() => stream.getBufferedValue());
}

module.exports = getStream;
module.exports.buffer = (stream, opts) => getStream(stream, Object.assign({}, opts, {encoding: 'buffer'}));
module.exports.array = (stream, opts) => getStream(stream, Object.assign({}, opts, {array: true}));


/***/ }),

/***/ 6505:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

var querystring = __nccwpck_require__(1191);

var got = __nccwpck_require__(3798);
var safeEval = __nccwpck_require__(7380);
var token = __nccwpck_require__(7637);

var languages = __nccwpck_require__(2122);

function translate(text, opts) {
    opts = opts || {};

    var e;
    [opts.from, opts.to].forEach(function (lang) {
        if (lang && !languages.isSupported(lang)) {
            e = new Error();
            e.code = 400;
            e.message = 'The language \'' + lang + '\' is not supported';
        }
    });
    if (e) {
        return new Promise(function (resolve, reject) {
            reject(e);
        });
    }

    opts.from = opts.from || 'auto';
    opts.to = opts.to || 'en';

    opts.from = languages.getCode(opts.from);
    opts.to = languages.getCode(opts.to);

    return token.get(text).then(function (token) {
        var url = 'https://translate.google.com/translate_a/single';
        var data = {
            client: 't',
            sl: opts.from,
            tl: opts.to,
            hl: opts.to,
            dt: ['at', 'bd', 'ex', 'ld', 'md', 'qca', 'rw', 'rm', 'ss', 't'],
            ie: 'UTF-8',
            oe: 'UTF-8',
            otf: 1,
            ssel: 0,
            tsel: 0,
            kc: 7,
            q: text
        };
        data[token.name] = token.value;

        return url + '?' + querystring.stringify(data);
    }).then(function (url) {
        return got(url).then(function (res) {
            var result = {
                text: '',
                from: {
                    language: {
                        didYouMean: false,
                        iso: ''
                    },
                    text: {
                        autoCorrected: false,
                        value: '',
                        didYouMean: false
                    }
                },
                raw: ''
            };

            if (opts.raw) {
                result.raw = res.body;
            }

            var body = safeEval(res.body);
            body[0].forEach(function (obj) {
                if (obj[0]) {
                    result.text += obj[0];
                }
            });

            if (body[2] === body[8][0][0]) {
                result.from.language.iso = body[2];
            } else {
                result.from.language.didYouMean = true;
                result.from.language.iso = body[8][0][0];
            }

            if (body[7] && body[7][0]) {
                var str = body[7][0];

                str = str.replace(/<b><i>/g, '[');
                str = str.replace(/<\/i><\/b>/g, ']');

                result.from.text.value = str;

                if (body[7][5] === true) {
                    result.from.text.autoCorrected = true;
                } else {
                    result.from.text.didYouMean = true;
                }
            }

            return result;
        }).catch(function (err) {
            var e;
            e = new Error();
            if (err.statusCode !== undefined && err.statusCode !== 200) {
                e.code = 'BAD_REQUEST';
            } else {
                e.code = 'BAD_NETWORK';
            }
            throw e;
        });
    });
}

module.exports = translate;
module.exports.languages = languages;


/***/ }),

/***/ 2122:
/***/ ((module) => {

/**
 *
 * Generated from https://translate.google.com
 *
 * The languages that Google Translate supports (as of 5/15/16) alongside with their ISO 639-1 codes
 * See https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes
 */

var langs = {
    'auto': 'Automatic',
    'af': 'Afrikaans',
    'sq': 'Albanian',
    'am': 'Amharic',
    'ar': 'Arabic',
    'hy': 'Armenian',
    'az': 'Azerbaijani',
    'eu': 'Basque',
    'be': 'Belarusian',
    'bn': 'Bengali',
    'bs': 'Bosnian',
    'bg': 'Bulgarian',
    'ca': 'Catalan',
    'ceb': 'Cebuano',
    'ny': 'Chichewa',
    'zh-cn': 'Chinese Simplified',
    'zh-tw': 'Chinese Traditional',
    'co': 'Corsican',
    'hr': 'Croatian',
    'cs': 'Czech',
    'da': 'Danish',
    'nl': 'Dutch',
    'en': 'English',
    'eo': 'Esperanto',
    'et': 'Estonian',
    'tl': 'Filipino',
    'fi': 'Finnish',
    'fr': 'French',
    'fy': 'Frisian',
    'gl': 'Galician',
    'ka': 'Georgian',
    'de': 'German',
    'el': 'Greek',
    'gu': 'Gujarati',
    'ht': 'Haitian Creole',
    'ha': 'Hausa',
    'haw': 'Hawaiian',
    'iw': 'Hebrew',
    'hi': 'Hindi',
    'hmn': 'Hmong',
    'hu': 'Hungarian',
    'is': 'Icelandic',
    'ig': 'Igbo',
    'id': 'Indonesian',
    'ga': 'Irish',
    'it': 'Italian',
    'ja': 'Japanese',
    'jw': 'Javanese',
    'kn': 'Kannada',
    'kk': 'Kazakh',
    'km': 'Khmer',
    'ko': 'Korean',
    'ku': 'Kurdish (Kurmanji)',
    'ky': 'Kyrgyz',
    'lo': 'Lao',
    'la': 'Latin',
    'lv': 'Latvian',
    'lt': 'Lithuanian',
    'lb': 'Luxembourgish',
    'mk': 'Macedonian',
    'mg': 'Malagasy',
    'ms': 'Malay',
    'ml': 'Malayalam',
    'mt': 'Maltese',
    'mi': 'Maori',
    'mr': 'Marathi',
    'mn': 'Mongolian',
    'my': 'Myanmar (Burmese)',
    'ne': 'Nepali',
    'no': 'Norwegian',
    'ps': 'Pashto',
    'fa': 'Persian',
    'pl': 'Polish',
    'pt': 'Portuguese',
    'ma': 'Punjabi',
    'ro': 'Romanian',
    'ru': 'Russian',
    'sm': 'Samoan',
    'gd': 'Scots Gaelic',
    'sr': 'Serbian',
    'st': 'Sesotho',
    'sn': 'Shona',
    'sd': 'Sindhi',
    'si': 'Sinhala',
    'sk': 'Slovak',
    'sl': 'Slovenian',
    'so': 'Somali',
    'es': 'Spanish',
    'su': 'Sundanese',
    'sw': 'Swahili',
    'sv': 'Swedish',
    'tg': 'Tajik',
    'ta': 'Tamil',
    'te': 'Telugu',
    'th': 'Thai',
    'tr': 'Turkish',
    'uk': 'Ukrainian',
    'ur': 'Urdu',
    'uz': 'Uzbek',
    'vi': 'Vietnamese',
    'cy': 'Welsh',
    'xh': 'Xhosa',
    'yi': 'Yiddish',
    'yo': 'Yoruba',
    'zu': 'Zulu'
};
/**
 * Returns the ISO 639-1 code of the desiredLang – if it is supported by Google Translate
 * @param {string} desiredLang – the name or the code of the desired language
 * @returns {string|boolean} The ISO 639-1 code of the language or false if the language is not supported
 */
function getCode(desiredLang) {
    if (!desiredLang) {
        return false;
    }
    desiredLang = desiredLang.toLowerCase();

    if (langs[desiredLang]) {
        return desiredLang;
    }

    var keys = Object.keys(langs).filter(function (key) {
        if (typeof langs[key] !== 'string') {
            return false;
        }

        return langs[key].toLowerCase() === desiredLang;
    });

    return keys[0] || false;
}

/**
 * Returns true if the desiredLang is supported by Google Translate and false otherwise
 * @param desiredLang – the ISO 639-1 code or the name of the desired language
 * @returns {boolean}
 */
function isSupported(desiredLang) {
    return Boolean(getCode(desiredLang));
}

module.exports = langs;
module.exports.isSupported = isSupported;
module.exports.getCode = getCode;


/***/ }),

/***/ 7637:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

/**
 * Last update: 2016/06/26
 * https://translate.google.com/translate/releases/twsfe_w_20160620_RC00/r/js/desktop_module_main.js
 *
 * Everything between 'BEGIN' and 'END' was copied from the url above.
 */

var got = __nccwpck_require__(3798);
var Configstore = __nccwpck_require__(594);

/* eslint-disable */
// BEGIN

function sM(a) {
    var b;
    if (null !== yr)
        b = yr;
    else {
        b = wr(String.fromCharCode(84));
        var c = wr(String.fromCharCode(75));
        b = [b(), b()];
        b[1] = c();
        b = (yr = window[b.join(c())] || "") || ""
    }
    var d = wr(String.fromCharCode(116))
        , c = wr(String.fromCharCode(107))
        , d = [d(), d()];
    d[1] = c();
    c = "&" + d.join("") + "=";
    d = b.split(".");
    b = Number(d[0]) || 0;
    for (var e = [], f = 0, g = 0; g < a.length; g++) {
        var l = a.charCodeAt(g);
        128 > l ? e[f++] = l : (2048 > l ? e[f++] = l >> 6 | 192 : (55296 == (l & 64512) && g + 1 < a.length && 56320 == (a.charCodeAt(g + 1) & 64512) ? (l = 65536 + ((l & 1023) << 10) + (a.charCodeAt(++g) & 1023),
            e[f++] = l >> 18 | 240,
            e[f++] = l >> 12 & 63 | 128) : e[f++] = l >> 12 | 224,
            e[f++] = l >> 6 & 63 | 128),
            e[f++] = l & 63 | 128)
    }
    a = b;
    for (f = 0; f < e.length; f++)
        a += e[f],
            a = xr(a, "+-a^+6");
    a = xr(a, "+-3^+b+-f");
    a ^= Number(d[1]) || 0;
    0 > a && (a = (a & 2147483647) + 2147483648);
    a %= 1E6;
    return c + (a.toString() + "." + (a ^ b))
}

var yr = null;
var wr = function(a) {
    return function() {
        return a
    }
}
    , xr = function(a, b) {
    for (var c = 0; c < b.length - 2; c += 3) {
        var d = b.charAt(c + 2)
            , d = "a" <= d ? d.charCodeAt(0) - 87 : Number(d)
            , d = "+" == b.charAt(c + 1) ? a >>> d : a << d;
        a = "+" == b.charAt(c) ? a + d & 4294967295 : a ^ d
    }
    return a
};

// END
/* eslint-enable */

var config = new Configstore('google-translate-api');

var window = {
    TKK: config.get('TKK') || '0'
};

function updateTKK() {
    return new Promise(function (resolve, reject) {
        var now = Math.floor(Date.now() / 3600000);

        if (Number(window.TKK.split('.')[0]) === now) {
            resolve();
        } else {
            got('https://translate.google.com').then(function (res) {
                var code = res.body.match(/TKK=(.*?)\(\)\)'\);/g);

                if (code) {
                    eval(code[0]);
                    /* eslint-disable no-undef */
                    if (typeof TKK !== 'undefined') {
                        window.TKK = TKK;
                        config.set('TKK', TKK);
                    }
                    /* eslint-enable no-undef */
                }

                /**
                 * Note: If the regex or the eval fail, there is no need to worry. The server will accept
                 * relatively old seeds.
                 */

                resolve();
            }).catch(function (err) {
                var e = new Error();
                e.code = 'BAD_NETWORK';
                e.message = err.message;
                reject(e);
            });
        }
    });
}

function get(text) {
    return updateTKK().then(function () {
        var tk = sM(text);
        tk = tk.replace('&tk=', '');
        return {name: 'tk', value: tk};
    }).catch(function (err) {
        throw err;
    });
}

module.exports.get = get;


/***/ }),

/***/ 3798:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";

const EventEmitter = __nccwpck_require__(8614);
const http = __nccwpck_require__(8605);
const https = __nccwpck_require__(7211);
const PassThrough = __nccwpck_require__(2413).PassThrough;
const urlLib = __nccwpck_require__(8835);
const querystring = __nccwpck_require__(1191);
const duplexer3 = __nccwpck_require__(7994);
const isStream = __nccwpck_require__(1554);
const getStream = __nccwpck_require__(1766);
const timedOut = __nccwpck_require__(9478);
const urlParseLax = __nccwpck_require__(3194);
const lowercaseKeys = __nccwpck_require__(9662);
const isRedirect = __nccwpck_require__(4409);
const unzipResponse = __nccwpck_require__(9428);
const createErrorClass = __nccwpck_require__(4532);
const isRetryAllowed = __nccwpck_require__(841);
const Buffer = __nccwpck_require__(1867).Buffer;
const pkg = __nccwpck_require__(9248);

function requestAsEventEmitter(opts) {
	opts = opts || {};

	const ee = new EventEmitter();
	const requestUrl = opts.href || urlLib.resolve(urlLib.format(opts), opts.path);
	let redirectCount = 0;
	let retryCount = 0;
	let redirectUrl;

	const get = opts => {
		const fn = opts.protocol === 'https:' ? https : http;

		const req = fn.request(opts, res => {
			const statusCode = res.statusCode;

			if (isRedirect(statusCode) && opts.followRedirect && 'location' in res.headers && (opts.method === 'GET' || opts.method === 'HEAD')) {
				res.resume();

				if (++redirectCount > 10) {
					ee.emit('error', new got.MaxRedirectsError(statusCode, opts), null, res);
					return;
				}

				const bufferString = Buffer.from(res.headers.location, 'binary').toString();

				redirectUrl = urlLib.resolve(urlLib.format(opts), bufferString);
				const redirectOpts = Object.assign({}, opts, urlLib.parse(redirectUrl));

				ee.emit('redirect', res, redirectOpts);

				get(redirectOpts);

				return;
			}

			setImmediate(() => {
				const response = typeof unzipResponse === 'function' && req.method !== 'HEAD' ? unzipResponse(res) : res;
				response.url = redirectUrl || requestUrl;
				response.requestUrl = requestUrl;

				ee.emit('response', response);
			});
		});

		req.once('error', err => {
			const backoff = opts.retries(++retryCount, err);

			if (backoff) {
				setTimeout(get, backoff, opts);
				return;
			}

			ee.emit('error', new got.RequestError(err, opts));
		});

		if (opts.gotTimeout) {
			timedOut(req, opts.gotTimeout);
		}

		setImmediate(() => {
			ee.emit('request', req);
		});
	};

	get(opts);
	return ee;
}

function asPromise(opts) {
	return new Promise((resolve, reject) => {
		const ee = requestAsEventEmitter(opts);

		ee.on('request', req => {
			if (isStream(opts.body)) {
				opts.body.pipe(req);
				opts.body = undefined;
				return;
			}

			req.end(opts.body);
		});

		ee.on('response', res => {
			const stream = opts.encoding === null ? getStream.buffer(res) : getStream(res, opts);

			stream
				.catch(err => reject(new got.ReadError(err, opts)))
				.then(data => {
					const statusCode = res.statusCode;
					const limitStatusCode = opts.followRedirect ? 299 : 399;

					res.body = data;

					if (opts.json && res.body) {
						try {
							res.body = JSON.parse(res.body);
						} catch (e) {
							throw new got.ParseError(e, statusCode, opts, data);
						}
					}

					if (statusCode < 200 || statusCode > limitStatusCode) {
						throw new got.HTTPError(statusCode, opts);
					}

					resolve(res);
				})
				.catch(err => {
					Object.defineProperty(err, 'response', {value: res});
					reject(err);
				});
		});

		ee.on('error', reject);
	});
}

function asStream(opts) {
	const input = new PassThrough();
	const output = new PassThrough();
	const proxy = duplexer3(input, output);

	if (opts.json) {
		throw new Error('got can not be used as stream when options.json is used');
	}

	if (opts.body) {
		proxy.write = () => {
			throw new Error('got\'s stream is not writable when options.body is used');
		};
	}

	const ee = requestAsEventEmitter(opts);

	ee.on('request', req => {
		proxy.emit('request', req);

		if (isStream(opts.body)) {
			opts.body.pipe(req);
			return;
		}

		if (opts.body) {
			req.end(opts.body);
			return;
		}

		if (opts.method === 'POST' || opts.method === 'PUT' || opts.method === 'PATCH') {
			input.pipe(req);
			return;
		}

		req.end();
	});

	ee.on('response', res => {
		const statusCode = res.statusCode;

		res.pipe(output);

		if (statusCode < 200 || statusCode > 299) {
			proxy.emit('error', new got.HTTPError(statusCode, opts), null, res);
			return;
		}

		proxy.emit('response', res);
	});

	ee.on('redirect', proxy.emit.bind(proxy, 'redirect'));
	ee.on('error', proxy.emit.bind(proxy, 'error'));

	return proxy;
}

function normalizeArguments(url, opts) {
	if (typeof url !== 'string' && typeof url !== 'object') {
		throw new Error(`Parameter \`url\` must be a string or object, not ${typeof url}`);
	}

	if (typeof url === 'string') {
		url = url.replace(/^unix:/, 'http://$&');
		url = urlParseLax(url);

		if (url.auth) {
			throw new Error('Basic authentication must be done with auth option');
		}
	}

	opts = Object.assign(
		{
			protocol: 'http:',
			path: '',
			retries: 5
		},
		url,
		opts
	);

	opts.headers = Object.assign({
		'user-agent': `${pkg.name}/${pkg.version} (https://github.com/sindresorhus/got)`,
		'accept-encoding': 'gzip,deflate'
	}, lowercaseKeys(opts.headers));

	const query = opts.query;

	if (query) {
		if (typeof query !== 'string') {
			opts.query = querystring.stringify(query);
		}

		opts.path = `${opts.path.split('?')[0]}?${opts.query}`;
		delete opts.query;
	}

	if (opts.json && opts.headers.accept === undefined) {
		opts.headers.accept = 'application/json';
	}

	let body = opts.body;

	if (body) {
		if (typeof body !== 'string' && !(body !== null && typeof body === 'object')) {
			throw new Error('options.body must be a ReadableStream, string, Buffer or plain Object');
		}

		opts.method = opts.method || 'POST';

		if (isStream(body) && typeof body.getBoundary === 'function') {
			// Special case for https://github.com/form-data/form-data
			opts.headers['content-type'] = opts.headers['content-type'] || `multipart/form-data; boundary=${body.getBoundary()}`;
		} else if (body !== null && typeof body === 'object' && !Buffer.isBuffer(body) && !isStream(body)) {
			opts.headers['content-type'] = opts.headers['content-type'] || 'application/x-www-form-urlencoded';
			body = opts.body = querystring.stringify(body);
		}

		if (opts.headers['content-length'] === undefined && opts.headers['transfer-encoding'] === undefined && !isStream(body)) {
			const length = typeof body === 'string' ? Buffer.byteLength(body) : body.length;
			opts.headers['content-length'] = length;
		}
	}

	opts.method = (opts.method || 'GET').toUpperCase();

	if (opts.hostname === 'unix') {
		const matches = /(.+):(.+)/.exec(opts.path);

		if (matches) {
			opts.socketPath = matches[1];
			opts.path = matches[2];
			opts.host = null;
		}
	}

	if (typeof opts.retries !== 'function') {
		const retries = opts.retries;

		opts.retries = (iter, err) => {
			if (iter > retries || !isRetryAllowed(err)) {
				return 0;
			}

			const noise = Math.random() * 100;

			return ((1 << iter) * 1000) + noise;
		};
	}

	if (opts.followRedirect === undefined) {
		opts.followRedirect = true;
	}

	if (opts.timeout) {
		opts.gotTimeout = opts.timeout;
		delete opts.timeout;
	}

	return opts;
}

function got(url, opts) {
	try {
		return asPromise(normalizeArguments(url, opts));
	} catch (err) {
		return Promise.reject(err);
	}
}

const helpers = [
	'get',
	'post',
	'put',
	'patch',
	'head',
	'delete'
];

helpers.forEach(el => {
	got[el] = (url, opts) => got(url, Object.assign({}, opts, {method: el}));
});

got.stream = (url, opts) => asStream(normalizeArguments(url, opts));

for (const el of helpers) {
	got.stream[el] = (url, opts) => got.stream(url, Object.assign({}, opts, {method: el}));
}

function stdError(error, opts) {
	if (error.code !== undefined) {
		this.code = error.code;
	}

	Object.assign(this, {
		message: error.message,
		host: opts.host,
		hostname: opts.hostname,
		method: opts.method,
		path: opts.path
	});
}

got.RequestError = createErrorClass('RequestError', stdError);
got.ReadError = createErrorClass('ReadError', stdError);
got.ParseError = createErrorClass('ParseError', function (e, statusCode, opts, data) {
	stdError.call(this, e, opts);
	this.statusCode = statusCode;
	this.statusMessage = http.STATUS_CODES[this.statusCode];
	this.message = `${e.message} in "${urlLib.format(opts)}": \n${data.slice(0, 77)}...`;
});

got.HTTPError = createErrorClass('HTTPError', function (statusCode, opts) {
	stdError.call(this, {}, opts);
	this.statusCode = statusCode;
	this.statusMessage = http.STATUS_CODES[this.statusCode];
	this.message = `Response code ${this.statusCode} (${this.statusMessage})`;
});

got.MaxRedirectsError = createErrorClass('MaxRedirectsError', function (statusCode, opts) {
	stdError.call(this, {}, opts);
	this.statusCode = statusCode;
	this.statusMessage = http.STATUS_CODES[this.statusCode];
	this.message = 'Redirected 10 times. Aborting.';
});

module.exports = got;


/***/ }),

/***/ 7356:
/***/ ((module) => {

"use strict";


module.exports = clone

var getPrototypeOf = Object.getPrototypeOf || function (obj) {
  return obj.__proto__
}

function clone (obj) {
  if (obj === null || typeof obj !== 'object')
    return obj

  if (obj instanceof Object)
    var copy = { __proto__: getPrototypeOf(obj) }
  else
    var copy = Object.create(null)

  Object.getOwnPropertyNames(obj).forEach(function (key) {
    Object.defineProperty(copy, key, Object.getOwnPropertyDescriptor(obj, key))
  })

  return copy
}


/***/ }),

/***/ 7758:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

var fs = __nccwpck_require__(5747)
var polyfills = __nccwpck_require__(263)
var legacy = __nccwpck_require__(3086)
var clone = __nccwpck_require__(7356)

var util = __nccwpck_require__(1669)

/* istanbul ignore next - node 0.x polyfill */
var gracefulQueue
var previousSymbol

/* istanbul ignore else - node 0.x polyfill */
if (typeof Symbol === 'function' && typeof Symbol.for === 'function') {
  gracefulQueue = Symbol.for('graceful-fs.queue')
  // This is used in testing by future versions
  previousSymbol = Symbol.for('graceful-fs.previous')
} else {
  gracefulQueue = '___graceful-fs.queue'
  previousSymbol = '___graceful-fs.previous'
}

function noop () {}

function publishQueue(context, queue) {
  Object.defineProperty(context, gracefulQueue, {
    get: function() {
      return queue
    }
  })
}

var debug = noop
if (util.debuglog)
  debug = util.debuglog('gfs4')
else if (/\bgfs4\b/i.test(process.env.NODE_DEBUG || ''))
  debug = function() {
    var m = util.format.apply(util, arguments)
    m = 'GFS4: ' + m.split(/\n/).join('\nGFS4: ')
    console.error(m)
  }

// Once time initialization
if (!fs[gracefulQueue]) {
  // This queue can be shared by multiple loaded instances
  var queue = global[gracefulQueue] || []
  publishQueue(fs, queue)

  // Patch fs.close/closeSync to shared queue version, because we need
  // to retry() whenever a close happens *anywhere* in the program.
  // This is essential when multiple graceful-fs instances are
  // in play at the same time.
  fs.close = (function (fs$close) {
    function close (fd, cb) {
      return fs$close.call(fs, fd, function (err) {
        // This function uses the graceful-fs shared queue
        if (!err) {
          retry()
        }

        if (typeof cb === 'function')
          cb.apply(this, arguments)
      })
    }

    Object.defineProperty(close, previousSymbol, {
      value: fs$close
    })
    return close
  })(fs.close)

  fs.closeSync = (function (fs$closeSync) {
    function closeSync (fd) {
      // This function uses the graceful-fs shared queue
      fs$closeSync.apply(fs, arguments)
      retry()
    }

    Object.defineProperty(closeSync, previousSymbol, {
      value: fs$closeSync
    })
    return closeSync
  })(fs.closeSync)

  if (/\bgfs4\b/i.test(process.env.NODE_DEBUG || '')) {
    process.on('exit', function() {
      debug(fs[gracefulQueue])
      __nccwpck_require__(2357).equal(fs[gracefulQueue].length, 0)
    })
  }
}

if (!global[gracefulQueue]) {
  publishQueue(global, fs[gracefulQueue]);
}

module.exports = patch(clone(fs))
if (process.env.TEST_GRACEFUL_FS_GLOBAL_PATCH && !fs.__patched) {
    module.exports = patch(fs)
    fs.__patched = true;
}

function patch (fs) {
  // Everything that references the open() function needs to be in here
  polyfills(fs)
  fs.gracefulify = patch

  fs.createReadStream = createReadStream
  fs.createWriteStream = createWriteStream
  var fs$readFile = fs.readFile
  fs.readFile = readFile
  function readFile (path, options, cb) {
    if (typeof options === 'function')
      cb = options, options = null

    return go$readFile(path, options, cb)

    function go$readFile (path, options, cb) {
      return fs$readFile(path, options, function (err) {
        if (err && (err.code === 'EMFILE' || err.code === 'ENFILE'))
          enqueue([go$readFile, [path, options, cb]])
        else {
          if (typeof cb === 'function')
            cb.apply(this, arguments)
          retry()
        }
      })
    }
  }

  var fs$writeFile = fs.writeFile
  fs.writeFile = writeFile
  function writeFile (path, data, options, cb) {
    if (typeof options === 'function')
      cb = options, options = null

    return go$writeFile(path, data, options, cb)

    function go$writeFile (path, data, options, cb) {
      return fs$writeFile(path, data, options, function (err) {
        if (err && (err.code === 'EMFILE' || err.code === 'ENFILE'))
          enqueue([go$writeFile, [path, data, options, cb]])
        else {
          if (typeof cb === 'function')
            cb.apply(this, arguments)
          retry()
        }
      })
    }
  }

  var fs$appendFile = fs.appendFile
  if (fs$appendFile)
    fs.appendFile = appendFile
  function appendFile (path, data, options, cb) {
    if (typeof options === 'function')
      cb = options, options = null

    return go$appendFile(path, data, options, cb)

    function go$appendFile (path, data, options, cb) {
      return fs$appendFile(path, data, options, function (err) {
        if (err && (err.code === 'EMFILE' || err.code === 'ENFILE'))
          enqueue([go$appendFile, [path, data, options, cb]])
        else {
          if (typeof cb === 'function')
            cb.apply(this, arguments)
          retry()
        }
      })
    }
  }

  var fs$copyFile = fs.copyFile
  if (fs$copyFile)
    fs.copyFile = copyFile
  function copyFile (src, dest, flags, cb) {
    if (typeof flags === 'function') {
      cb = flags
      flags = 0
    }
    return fs$copyFile(src, dest, flags, function (err) {
      if (err && (err.code === 'EMFILE' || err.code === 'ENFILE'))
        enqueue([fs$copyFile, [src, dest, flags, cb]])
      else {
        if (typeof cb === 'function')
          cb.apply(this, arguments)
        retry()
      }
    })
  }

  var fs$readdir = fs.readdir
  fs.readdir = readdir
  function readdir (path, options, cb) {
    var args = [path]
    if (typeof options !== 'function') {
      args.push(options)
    } else {
      cb = options
    }
    args.push(go$readdir$cb)

    return go$readdir(args)

    function go$readdir$cb (err, files) {
      if (files && files.sort)
        files.sort()

      if (err && (err.code === 'EMFILE' || err.code === 'ENFILE'))
        enqueue([go$readdir, [args]])

      else {
        if (typeof cb === 'function')
          cb.apply(this, arguments)
        retry()
      }
    }
  }

  function go$readdir (args) {
    return fs$readdir.apply(fs, args)
  }

  if (process.version.substr(0, 4) === 'v0.8') {
    var legStreams = legacy(fs)
    ReadStream = legStreams.ReadStream
    WriteStream = legStreams.WriteStream
  }

  var fs$ReadStream = fs.ReadStream
  if (fs$ReadStream) {
    ReadStream.prototype = Object.create(fs$ReadStream.prototype)
    ReadStream.prototype.open = ReadStream$open
  }

  var fs$WriteStream = fs.WriteStream
  if (fs$WriteStream) {
    WriteStream.prototype = Object.create(fs$WriteStream.prototype)
    WriteStream.prototype.open = WriteStream$open
  }

  Object.defineProperty(fs, 'ReadStream', {
    get: function () {
      return ReadStream
    },
    set: function (val) {
      ReadStream = val
    },
    enumerable: true,
    configurable: true
  })
  Object.defineProperty(fs, 'WriteStream', {
    get: function () {
      return WriteStream
    },
    set: function (val) {
      WriteStream = val
    },
    enumerable: true,
    configurable: true
  })

  // legacy names
  var FileReadStream = ReadStream
  Object.defineProperty(fs, 'FileReadStream', {
    get: function () {
      return FileReadStream
    },
    set: function (val) {
      FileReadStream = val
    },
    enumerable: true,
    configurable: true
  })
  var FileWriteStream = WriteStream
  Object.defineProperty(fs, 'FileWriteStream', {
    get: function () {
      return FileWriteStream
    },
    set: function (val) {
      FileWriteStream = val
    },
    enumerable: true,
    configurable: true
  })

  function ReadStream (path, options) {
    if (this instanceof ReadStream)
      return fs$ReadStream.apply(this, arguments), this
    else
      return ReadStream.apply(Object.create(ReadStream.prototype), arguments)
  }

  function ReadStream$open () {
    var that = this
    open(that.path, that.flags, that.mode, function (err, fd) {
      if (err) {
        if (that.autoClose)
          that.destroy()

        that.emit('error', err)
      } else {
        that.fd = fd
        that.emit('open', fd)
        that.read()
      }
    })
  }

  function WriteStream (path, options) {
    if (this instanceof WriteStream)
      return fs$WriteStream.apply(this, arguments), this
    else
      return WriteStream.apply(Object.create(WriteStream.prototype), arguments)
  }

  function WriteStream$open () {
    var that = this
    open(that.path, that.flags, that.mode, function (err, fd) {
      if (err) {
        that.destroy()
        that.emit('error', err)
      } else {
        that.fd = fd
        that.emit('open', fd)
      }
    })
  }

  function createReadStream (path, options) {
    return new fs.ReadStream(path, options)
  }

  function createWriteStream (path, options) {
    return new fs.WriteStream(path, options)
  }

  var fs$open = fs.open
  fs.open = open
  function open (path, flags, mode, cb) {
    if (typeof mode === 'function')
      cb = mode, mode = null

    return go$open(path, flags, mode, cb)

    function go$open (path, flags, mode, cb) {
      return fs$open(path, flags, mode, function (err, fd) {
        if (err && (err.code === 'EMFILE' || err.code === 'ENFILE'))
          enqueue([go$open, [path, flags, mode, cb]])
        else {
          if (typeof cb === 'function')
            cb.apply(this, arguments)
          retry()
        }
      })
    }
  }

  return fs
}

function enqueue (elem) {
  debug('ENQUEUE', elem[0].name, elem[1])
  fs[gracefulQueue].push(elem)
}

function retry () {
  var elem = fs[gracefulQueue].shift()
  if (elem) {
    debug('RETRY', elem[0].name, elem[1])
    elem[0].apply(null, elem[1])
  }
}


/***/ }),

/***/ 3086:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

var Stream = __nccwpck_require__(2413).Stream

module.exports = legacy

function legacy (fs) {
  return {
    ReadStream: ReadStream,
    WriteStream: WriteStream
  }

  function ReadStream (path, options) {
    if (!(this instanceof ReadStream)) return new ReadStream(path, options);

    Stream.call(this);

    var self = this;

    this.path = path;
    this.fd = null;
    this.readable = true;
    this.paused = false;

    this.flags = 'r';
    this.mode = 438; /*=0666*/
    this.bufferSize = 64 * 1024;

    options = options || {};

    // Mixin options into this
    var keys = Object.keys(options);
    for (var index = 0, length = keys.length; index < length; index++) {
      var key = keys[index];
      this[key] = options[key];
    }

    if (this.encoding) this.setEncoding(this.encoding);

    if (this.start !== undefined) {
      if ('number' !== typeof this.start) {
        throw TypeError('start must be a Number');
      }
      if (this.end === undefined) {
        this.end = Infinity;
      } else if ('number' !== typeof this.end) {
        throw TypeError('end must be a Number');
      }

      if (this.start > this.end) {
        throw new Error('start must be <= end');
      }

      this.pos = this.start;
    }

    if (this.fd !== null) {
      process.nextTick(function() {
        self._read();
      });
      return;
    }

    fs.open(this.path, this.flags, this.mode, function (err, fd) {
      if (err) {
        self.emit('error', err);
        self.readable = false;
        return;
      }

      self.fd = fd;
      self.emit('open', fd);
      self._read();
    })
  }

  function WriteStream (path, options) {
    if (!(this instanceof WriteStream)) return new WriteStream(path, options);

    Stream.call(this);

    this.path = path;
    this.fd = null;
    this.writable = true;

    this.flags = 'w';
    this.encoding = 'binary';
    this.mode = 438; /*=0666*/
    this.bytesWritten = 0;

    options = options || {};

    // Mixin options into this
    var keys = Object.keys(options);
    for (var index = 0, length = keys.length; index < length; index++) {
      var key = keys[index];
      this[key] = options[key];
    }

    if (this.start !== undefined) {
      if ('number' !== typeof this.start) {
        throw TypeError('start must be a Number');
      }
      if (this.start < 0) {
        throw new Error('start must be >= zero');
      }

      this.pos = this.start;
    }

    this.busy = false;
    this._queue = [];

    if (this.fd === null) {
      this._open = fs.open;
      this._queue.push([this._open, this.path, this.flags, this.mode, undefined]);
      this.flush();
    }
  }
}


/***/ }),

/***/ 263:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

var constants = __nccwpck_require__(7619)

var origCwd = process.cwd
var cwd = null

var platform = process.env.GRACEFUL_FS_PLATFORM || process.platform

process.cwd = function() {
  if (!cwd)
    cwd = origCwd.call(process)
  return cwd
}
try {
  process.cwd()
} catch (er) {}

// This check is needed until node.js 12 is required
if (typeof process.chdir === 'function') {
  var chdir = process.chdir
  process.chdir = function (d) {
    cwd = null
    chdir.call(process, d)
  }
  if (Object.setPrototypeOf) Object.setPrototypeOf(process.chdir, chdir)
}

module.exports = patch

function patch (fs) {
  // (re-)implement some things that are known busted or missing.

  // lchmod, broken prior to 0.6.2
  // back-port the fix here.
  if (constants.hasOwnProperty('O_SYMLINK') &&
      process.version.match(/^v0\.6\.[0-2]|^v0\.5\./)) {
    patchLchmod(fs)
  }

  // lutimes implementation, or no-op
  if (!fs.lutimes) {
    patchLutimes(fs)
  }

  // https://github.com/isaacs/node-graceful-fs/issues/4
  // Chown should not fail on einval or eperm if non-root.
  // It should not fail on enosys ever, as this just indicates
  // that a fs doesn't support the intended operation.

  fs.chown = chownFix(fs.chown)
  fs.fchown = chownFix(fs.fchown)
  fs.lchown = chownFix(fs.lchown)

  fs.chmod = chmodFix(fs.chmod)
  fs.fchmod = chmodFix(fs.fchmod)
  fs.lchmod = chmodFix(fs.lchmod)

  fs.chownSync = chownFixSync(fs.chownSync)
  fs.fchownSync = chownFixSync(fs.fchownSync)
  fs.lchownSync = chownFixSync(fs.lchownSync)

  fs.chmodSync = chmodFixSync(fs.chmodSync)
  fs.fchmodSync = chmodFixSync(fs.fchmodSync)
  fs.lchmodSync = chmodFixSync(fs.lchmodSync)

  fs.stat = statFix(fs.stat)
  fs.fstat = statFix(fs.fstat)
  fs.lstat = statFix(fs.lstat)

  fs.statSync = statFixSync(fs.statSync)
  fs.fstatSync = statFixSync(fs.fstatSync)
  fs.lstatSync = statFixSync(fs.lstatSync)

  // if lchmod/lchown do not exist, then make them no-ops
  if (!fs.lchmod) {
    fs.lchmod = function (path, mode, cb) {
      if (cb) process.nextTick(cb)
    }
    fs.lchmodSync = function () {}
  }
  if (!fs.lchown) {
    fs.lchown = function (path, uid, gid, cb) {
      if (cb) process.nextTick(cb)
    }
    fs.lchownSync = function () {}
  }

  // on Windows, A/V software can lock the directory, causing this
  // to fail with an EACCES or EPERM if the directory contains newly
  // created files.  Try again on failure, for up to 60 seconds.

  // Set the timeout this long because some Windows Anti-Virus, such as Parity
  // bit9, may lock files for up to a minute, causing npm package install
  // failures. Also, take care to yield the scheduler. Windows scheduling gives
  // CPU to a busy looping process, which can cause the program causing the lock
  // contention to be starved of CPU by node, so the contention doesn't resolve.
  if (platform === "win32") {
    fs.rename = (function (fs$rename) { return function (from, to, cb) {
      var start = Date.now()
      var backoff = 0;
      fs$rename(from, to, function CB (er) {
        if (er
            && (er.code === "EACCES" || er.code === "EPERM")
            && Date.now() - start < 60000) {
          setTimeout(function() {
            fs.stat(to, function (stater, st) {
              if (stater && stater.code === "ENOENT")
                fs$rename(from, to, CB);
              else
                cb(er)
            })
          }, backoff)
          if (backoff < 100)
            backoff += 10;
          return;
        }
        if (cb) cb(er)
      })
    }})(fs.rename)
  }

  // if read() returns EAGAIN, then just try it again.
  fs.read = (function (fs$read) {
    function read (fd, buffer, offset, length, position, callback_) {
      var callback
      if (callback_ && typeof callback_ === 'function') {
        var eagCounter = 0
        callback = function (er, _, __) {
          if (er && er.code === 'EAGAIN' && eagCounter < 10) {
            eagCounter ++
            return fs$read.call(fs, fd, buffer, offset, length, position, callback)
          }
          callback_.apply(this, arguments)
        }
      }
      return fs$read.call(fs, fd, buffer, offset, length, position, callback)
    }

    // This ensures `util.promisify` works as it does for native `fs.read`.
    if (Object.setPrototypeOf) Object.setPrototypeOf(read, fs$read)
    return read
  })(fs.read)

  fs.readSync = (function (fs$readSync) { return function (fd, buffer, offset, length, position) {
    var eagCounter = 0
    while (true) {
      try {
        return fs$readSync.call(fs, fd, buffer, offset, length, position)
      } catch (er) {
        if (er.code === 'EAGAIN' && eagCounter < 10) {
          eagCounter ++
          continue
        }
        throw er
      }
    }
  }})(fs.readSync)

  function patchLchmod (fs) {
    fs.lchmod = function (path, mode, callback) {
      fs.open( path
             , constants.O_WRONLY | constants.O_SYMLINK
             , mode
             , function (err, fd) {
        if (err) {
          if (callback) callback(err)
          return
        }
        // prefer to return the chmod error, if one occurs,
        // but still try to close, and report closing errors if they occur.
        fs.fchmod(fd, mode, function (err) {
          fs.close(fd, function(err2) {
            if (callback) callback(err || err2)
          })
        })
      })
    }

    fs.lchmodSync = function (path, mode) {
      var fd = fs.openSync(path, constants.O_WRONLY | constants.O_SYMLINK, mode)

      // prefer to return the chmod error, if one occurs,
      // but still try to close, and report closing errors if they occur.
      var threw = true
      var ret
      try {
        ret = fs.fchmodSync(fd, mode)
        threw = false
      } finally {
        if (threw) {
          try {
            fs.closeSync(fd)
          } catch (er) {}
        } else {
          fs.closeSync(fd)
        }
      }
      return ret
    }
  }

  function patchLutimes (fs) {
    if (constants.hasOwnProperty("O_SYMLINK")) {
      fs.lutimes = function (path, at, mt, cb) {
        fs.open(path, constants.O_SYMLINK, function (er, fd) {
          if (er) {
            if (cb) cb(er)
            return
          }
          fs.futimes(fd, at, mt, function (er) {
            fs.close(fd, function (er2) {
              if (cb) cb(er || er2)
            })
          })
        })
      }

      fs.lutimesSync = function (path, at, mt) {
        var fd = fs.openSync(path, constants.O_SYMLINK)
        var ret
        var threw = true
        try {
          ret = fs.futimesSync(fd, at, mt)
          threw = false
        } finally {
          if (threw) {
            try {
              fs.closeSync(fd)
            } catch (er) {}
          } else {
            fs.closeSync(fd)
          }
        }
        return ret
      }

    } else {
      fs.lutimes = function (_a, _b, _c, cb) { if (cb) process.nextTick(cb) }
      fs.lutimesSync = function () {}
    }
  }

  function chmodFix (orig) {
    if (!orig) return orig
    return function (target, mode, cb) {
      return orig.call(fs, target, mode, function (er) {
        if (chownErOk(er)) er = null
        if (cb) cb.apply(this, arguments)
      })
    }
  }

  function chmodFixSync (orig) {
    if (!orig) return orig
    return function (target, mode) {
      try {
        return orig.call(fs, target, mode)
      } catch (er) {
        if (!chownErOk(er)) throw er
      }
    }
  }


  function chownFix (orig) {
    if (!orig) return orig
    return function (target, uid, gid, cb) {
      return orig.call(fs, target, uid, gid, function (er) {
        if (chownErOk(er)) er = null
        if (cb) cb.apply(this, arguments)
      })
    }
  }

  function chownFixSync (orig) {
    if (!orig) return orig
    return function (target, uid, gid) {
      try {
        return orig.call(fs, target, uid, gid)
      } catch (er) {
        if (!chownErOk(er)) throw er
      }
    }
  }

  function statFix (orig) {
    if (!orig) return orig
    // Older versions of Node erroneously returned signed integers for
    // uid + gid.
    return function (target, options, cb) {
      if (typeof options === 'function') {
        cb = options
        options = null
      }
      function callback (er, stats) {
        if (stats) {
          if (stats.uid < 0) stats.uid += 0x100000000
          if (stats.gid < 0) stats.gid += 0x100000000
        }
        if (cb) cb.apply(this, arguments)
      }
      return options ? orig.call(fs, target, options, callback)
        : orig.call(fs, target, callback)
    }
  }

  function statFixSync (orig) {
    if (!orig) return orig
    // Older versions of Node erroneously returned signed integers for
    // uid + gid.
    return function (target, options) {
      var stats = options ? orig.call(fs, target, options)
        : orig.call(fs, target)
      if (stats.uid < 0) stats.uid += 0x100000000
      if (stats.gid < 0) stats.gid += 0x100000000
      return stats;
    }
  }

  // ENOSYS means that the fs doesn't support the op. Just ignore
  // that, because it doesn't matter.
  //
  // if there's no getuid, or if getuid() is something other
  // than 0, and the error is EINVAL or EPERM, then just ignore
  // it.
  //
  // This specific case is a silent failure in cp, install, tar,
  // and most other unix tools that manage permissions.
  //
  // When running as root, or if other types of errors are
  // encountered, then it's strict.
  function chownErOk (er) {
    if (!er)
      return true

    if (er.code === "ENOSYS")
      return true

    var nonroot = !process.getuid || process.getuid() !== 0
    if (nonroot) {
      if (er.code === "EINVAL" || er.code === "EPERM")
        return true
    }

    return false
  }
}


/***/ }),

/***/ 2527:
/***/ ((module) => {

/**
 * @preserve
 * JS Implementation of incremental MurmurHash3 (r150) (as of May 10, 2013)
 *
 * @author <a href="mailto:jensyt@gmail.com">Jens Taylor</a>
 * @see http://github.com/homebrewing/brauhaus-diff
 * @author <a href="mailto:gary.court@gmail.com">Gary Court</a>
 * @see http://github.com/garycourt/murmurhash-js
 * @author <a href="mailto:aappleby@gmail.com">Austin Appleby</a>
 * @see http://sites.google.com/site/murmurhash/
 */
(function(){
    var cache;

    // Call this function without `new` to use the cached object (good for
    // single-threaded environments), or with `new` to create a new object.
    //
    // @param {string} key A UTF-16 or ASCII string
    // @param {number} seed An optional positive integer
    // @return {object} A MurmurHash3 object for incremental hashing
    function MurmurHash3(key, seed) {
        var m = this instanceof MurmurHash3 ? this : cache;
        m.reset(seed)
        if (typeof key === 'string' && key.length > 0) {
            m.hash(key);
        }

        if (m !== this) {
            return m;
        }
    };

    // Incrementally add a string to this hash
    //
    // @param {string} key A UTF-16 or ASCII string
    // @return {object} this
    MurmurHash3.prototype.hash = function(key) {
        var h1, k1, i, top, len;

        len = key.length;
        this.len += len;

        k1 = this.k1;
        i = 0;
        switch (this.rem) {
            case 0: k1 ^= len > i ? (key.charCodeAt(i++) & 0xffff) : 0;
            case 1: k1 ^= len > i ? (key.charCodeAt(i++) & 0xffff) << 8 : 0;
            case 2: k1 ^= len > i ? (key.charCodeAt(i++) & 0xffff) << 16 : 0;
            case 3:
                k1 ^= len > i ? (key.charCodeAt(i) & 0xff) << 24 : 0;
                k1 ^= len > i ? (key.charCodeAt(i++) & 0xff00) >> 8 : 0;
        }

        this.rem = (len + this.rem) & 3; // & 3 is same as % 4
        len -= this.rem;
        if (len > 0) {
            h1 = this.h1;
            while (1) {
                k1 = (k1 * 0x2d51 + (k1 & 0xffff) * 0xcc9e0000) & 0xffffffff;
                k1 = (k1 << 15) | (k1 >>> 17);
                k1 = (k1 * 0x3593 + (k1 & 0xffff) * 0x1b870000) & 0xffffffff;

                h1 ^= k1;
                h1 = (h1 << 13) | (h1 >>> 19);
                h1 = (h1 * 5 + 0xe6546b64) & 0xffffffff;

                if (i >= len) {
                    break;
                }

                k1 = ((key.charCodeAt(i++) & 0xffff)) ^
                     ((key.charCodeAt(i++) & 0xffff) << 8) ^
                     ((key.charCodeAt(i++) & 0xffff) << 16);
                top = key.charCodeAt(i++);
                k1 ^= ((top & 0xff) << 24) ^
                      ((top & 0xff00) >> 8);
            }

            k1 = 0;
            switch (this.rem) {
                case 3: k1 ^= (key.charCodeAt(i + 2) & 0xffff) << 16;
                case 2: k1 ^= (key.charCodeAt(i + 1) & 0xffff) << 8;
                case 1: k1 ^= (key.charCodeAt(i) & 0xffff);
            }

            this.h1 = h1;
        }

        this.k1 = k1;
        return this;
    };

    // Get the result of this hash
    //
    // @return {number} The 32-bit hash
    MurmurHash3.prototype.result = function() {
        var k1, h1;
        
        k1 = this.k1;
        h1 = this.h1;

        if (k1 > 0) {
            k1 = (k1 * 0x2d51 + (k1 & 0xffff) * 0xcc9e0000) & 0xffffffff;
            k1 = (k1 << 15) | (k1 >>> 17);
            k1 = (k1 * 0x3593 + (k1 & 0xffff) * 0x1b870000) & 0xffffffff;
            h1 ^= k1;
        }

        h1 ^= this.len;

        h1 ^= h1 >>> 16;
        h1 = (h1 * 0xca6b + (h1 & 0xffff) * 0x85eb0000) & 0xffffffff;
        h1 ^= h1 >>> 13;
        h1 = (h1 * 0xae35 + (h1 & 0xffff) * 0xc2b20000) & 0xffffffff;
        h1 ^= h1 >>> 16;

        return h1 >>> 0;
    };

    // Reset the hash object for reuse
    //
    // @param {number} seed An optional positive integer
    MurmurHash3.prototype.reset = function(seed) {
        this.h1 = typeof seed === 'number' ? seed : 0;
        this.rem = this.k1 = this.len = 0;
        return this;
    };

    // A cached object to use. This can be safely used if you're in a single-
    // threaded environment, otherwise you need to create new hashes to use.
    cache = new MurmurHash3();

    if (true) {
        module.exports = MurmurHash3;
    } else {}
}());


/***/ }),

/***/ 1389:
/***/ ((module) => {

"use strict";

module.exports = function (x) {
	var type = typeof x;
	return x !== null && (type === 'object' || type === 'function');
};


/***/ }),

/***/ 4409:
/***/ ((module) => {

"use strict";

module.exports = function (x) {
	if (typeof x !== 'number') {
		throw new TypeError('Expected a number');
	}

	return x === 300 ||
		x === 301 ||
		x === 302 ||
		x === 303 ||
		x === 305 ||
		x === 307 ||
		x === 308;
};


/***/ }),

/***/ 841:
/***/ ((module) => {

"use strict";


var WHITELIST = [
	'ETIMEDOUT',
	'ECONNRESET',
	'EADDRINUSE',
	'ESOCKETTIMEDOUT',
	'ECONNREFUSED',
	'EPIPE',
	'EHOSTUNREACH',
	'EAI_AGAIN'
];

var BLACKLIST = [
	'ENOTFOUND',
	'ENETUNREACH',

	// SSL errors from https://github.com/nodejs/node/blob/ed3d8b13ee9a705d89f9e0397d9e96519e7e47ac/src/node_crypto.cc#L1950
	'UNABLE_TO_GET_ISSUER_CERT',
	'UNABLE_TO_GET_CRL',
	'UNABLE_TO_DECRYPT_CERT_SIGNATURE',
	'UNABLE_TO_DECRYPT_CRL_SIGNATURE',
	'UNABLE_TO_DECODE_ISSUER_PUBLIC_KEY',
	'CERT_SIGNATURE_FAILURE',
	'CRL_SIGNATURE_FAILURE',
	'CERT_NOT_YET_VALID',
	'CERT_HAS_EXPIRED',
	'CRL_NOT_YET_VALID',
	'CRL_HAS_EXPIRED',
	'ERROR_IN_CERT_NOT_BEFORE_FIELD',
	'ERROR_IN_CERT_NOT_AFTER_FIELD',
	'ERROR_IN_CRL_LAST_UPDATE_FIELD',
	'ERROR_IN_CRL_NEXT_UPDATE_FIELD',
	'OUT_OF_MEM',
	'DEPTH_ZERO_SELF_SIGNED_CERT',
	'SELF_SIGNED_CERT_IN_CHAIN',
	'UNABLE_TO_GET_ISSUER_CERT_LOCALLY',
	'UNABLE_TO_VERIFY_LEAF_SIGNATURE',
	'CERT_CHAIN_TOO_LONG',
	'CERT_REVOKED',
	'INVALID_CA',
	'PATH_LENGTH_EXCEEDED',
	'INVALID_PURPOSE',
	'CERT_UNTRUSTED',
	'CERT_REJECTED'
];

module.exports = function (err) {
	if (!err || !err.code) {
		return true;
	}

	if (WHITELIST.indexOf(err.code) !== -1) {
		return true;
	}

	if (BLACKLIST.indexOf(err.code) !== -1) {
		return false;
	}

	return true;
};


/***/ }),

/***/ 1554:
/***/ ((module) => {

"use strict";


var isStream = module.exports = function (stream) {
	return stream !== null && typeof stream === 'object' && typeof stream.pipe === 'function';
};

isStream.writable = function (stream) {
	return isStream(stream) && stream.writable !== false && typeof stream._write === 'function' && typeof stream._writableState === 'object';
};

isStream.readable = function (stream) {
	return isStream(stream) && stream.readable !== false && typeof stream._read === 'function' && typeof stream._readableState === 'object';
};

isStream.duplex = function (stream) {
	return isStream.writable(stream) && isStream.readable(stream);
};

isStream.transform = function (stream) {
	return isStream.duplex(stream) && typeof stream._transform === 'function' && typeof stream._transformState === 'object';
};


/***/ }),

/***/ 9662:
/***/ ((module) => {

"use strict";

module.exports = function (obj) {
	var ret = {};
	var keys = Object.keys(Object(obj));

	for (var i = 0; i < keys.length; i++) {
		ret[keys[i].toLowerCase()] = obj[keys[i]];
	}

	return ret;
};


/***/ }),

/***/ 6186:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

var path = __nccwpck_require__(5622);
var fs = __nccwpck_require__(5747);
var _0777 = parseInt('0777', 8);

module.exports = mkdirP.mkdirp = mkdirP.mkdirP = mkdirP;

function mkdirP (p, opts, f, made) {
    if (typeof opts === 'function') {
        f = opts;
        opts = {};
    }
    else if (!opts || typeof opts !== 'object') {
        opts = { mode: opts };
    }
    
    var mode = opts.mode;
    var xfs = opts.fs || fs;
    
    if (mode === undefined) {
        mode = _0777
    }
    if (!made) made = null;
    
    var cb = f || function () {};
    p = path.resolve(p);
    
    xfs.mkdir(p, mode, function (er) {
        if (!er) {
            made = made || p;
            return cb(null, made);
        }
        switch (er.code) {
            case 'ENOENT':
                if (path.dirname(p) === p) return cb(er);
                mkdirP(path.dirname(p), opts, function (er, made) {
                    if (er) cb(er, made);
                    else mkdirP(p, opts, cb, made);
                });
                break;

            // In the case of any other error, just see if there's a dir
            // there already.  If so, then hooray!  If not, then something
            // is borked.
            default:
                xfs.stat(p, function (er2, stat) {
                    // if the stat fails, then that's super weird.
                    // let the original error be the failure reason.
                    if (er2 || !stat.isDirectory()) cb(er, made)
                    else cb(null, made);
                });
                break;
        }
    });
}

mkdirP.sync = function sync (p, opts, made) {
    if (!opts || typeof opts !== 'object') {
        opts = { mode: opts };
    }
    
    var mode = opts.mode;
    var xfs = opts.fs || fs;
    
    if (mode === undefined) {
        mode = _0777
    }
    if (!made) made = null;

    p = path.resolve(p);

    try {
        xfs.mkdirSync(p, mode);
        made = made || p;
    }
    catch (err0) {
        switch (err0.code) {
            case 'ENOENT' :
                made = sync(path.dirname(p), opts, made);
                sync(p, opts, made);
                break;

            // In the case of any other error, just see if there's a dir
            // there already.  If so, then hooray!  If not, then something
            // is borked.
            default:
                var stat;
                try {
                    stat = xfs.statSync(p);
                }
                catch (err1) {
                    throw err0;
                }
                if (!stat.isDirectory()) throw err0;
                break;
        }
    }

    return made;
};


/***/ }),

/***/ 1286:
/***/ ((module) => {

"use strict";


module.exports = nGram

nGram.bigram = nGram(2)
nGram.trigram = nGram(3)

// Factory returning a function that converts a value string to n-grams.
function nGram(n) {
  if (typeof n !== 'number' || isNaN(n) || n < 1 || n === Infinity) {
    throw new Error('`' + n + '` is not a valid argument for n-gram')
  }

  return grams

  // Create n-grams from a given value.
  function grams(value) {
    var nGrams = []
    var index

    if (value === null || value === undefined) {
      return nGrams
    }

    value = value.slice ? value : String(value)
    index = value.length - n + 1

    if (index < 1) {
      return nGrams
    }

    while (index--) {
      nGrams[index] = value.slice(index, index + n)
    }

    return nGrams
  }
}


/***/ }),

/***/ 467:
/***/ ((module, exports, __nccwpck_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({ value: true }));

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var Stream = _interopDefault(__nccwpck_require__(2413));
var http = _interopDefault(__nccwpck_require__(8605));
var Url = _interopDefault(__nccwpck_require__(8835));
var https = _interopDefault(__nccwpck_require__(7211));
var zlib = _interopDefault(__nccwpck_require__(8761));

// Based on https://github.com/tmpvar/jsdom/blob/aa85b2abf07766ff7bf5c1f6daafb3726f2f2db5/lib/jsdom/living/blob.js

// fix for "Readable" isn't a named export issue
const Readable = Stream.Readable;

const BUFFER = Symbol('buffer');
const TYPE = Symbol('type');

class Blob {
	constructor() {
		this[TYPE] = '';

		const blobParts = arguments[0];
		const options = arguments[1];

		const buffers = [];
		let size = 0;

		if (blobParts) {
			const a = blobParts;
			const length = Number(a.length);
			for (let i = 0; i < length; i++) {
				const element = a[i];
				let buffer;
				if (element instanceof Buffer) {
					buffer = element;
				} else if (ArrayBuffer.isView(element)) {
					buffer = Buffer.from(element.buffer, element.byteOffset, element.byteLength);
				} else if (element instanceof ArrayBuffer) {
					buffer = Buffer.from(element);
				} else if (element instanceof Blob) {
					buffer = element[BUFFER];
				} else {
					buffer = Buffer.from(typeof element === 'string' ? element : String(element));
				}
				size += buffer.length;
				buffers.push(buffer);
			}
		}

		this[BUFFER] = Buffer.concat(buffers);

		let type = options && options.type !== undefined && String(options.type).toLowerCase();
		if (type && !/[^\u0020-\u007E]/.test(type)) {
			this[TYPE] = type;
		}
	}
	get size() {
		return this[BUFFER].length;
	}
	get type() {
		return this[TYPE];
	}
	text() {
		return Promise.resolve(this[BUFFER].toString());
	}
	arrayBuffer() {
		const buf = this[BUFFER];
		const ab = buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength);
		return Promise.resolve(ab);
	}
	stream() {
		const readable = new Readable();
		readable._read = function () {};
		readable.push(this[BUFFER]);
		readable.push(null);
		return readable;
	}
	toString() {
		return '[object Blob]';
	}
	slice() {
		const size = this.size;

		const start = arguments[0];
		const end = arguments[1];
		let relativeStart, relativeEnd;
		if (start === undefined) {
			relativeStart = 0;
		} else if (start < 0) {
			relativeStart = Math.max(size + start, 0);
		} else {
			relativeStart = Math.min(start, size);
		}
		if (end === undefined) {
			relativeEnd = size;
		} else if (end < 0) {
			relativeEnd = Math.max(size + end, 0);
		} else {
			relativeEnd = Math.min(end, size);
		}
		const span = Math.max(relativeEnd - relativeStart, 0);

		const buffer = this[BUFFER];
		const slicedBuffer = buffer.slice(relativeStart, relativeStart + span);
		const blob = new Blob([], { type: arguments[2] });
		blob[BUFFER] = slicedBuffer;
		return blob;
	}
}

Object.defineProperties(Blob.prototype, {
	size: { enumerable: true },
	type: { enumerable: true },
	slice: { enumerable: true }
});

Object.defineProperty(Blob.prototype, Symbol.toStringTag, {
	value: 'Blob',
	writable: false,
	enumerable: false,
	configurable: true
});

/**
 * fetch-error.js
 *
 * FetchError interface for operational errors
 */

/**
 * Create FetchError instance
 *
 * @param   String      message      Error message for human
 * @param   String      type         Error type for machine
 * @param   String      systemError  For Node.js system error
 * @return  FetchError
 */
function FetchError(message, type, systemError) {
  Error.call(this, message);

  this.message = message;
  this.type = type;

  // when err.type is `system`, err.code contains system error code
  if (systemError) {
    this.code = this.errno = systemError.code;
  }

  // hide custom error implementation details from end-users
  Error.captureStackTrace(this, this.constructor);
}

FetchError.prototype = Object.create(Error.prototype);
FetchError.prototype.constructor = FetchError;
FetchError.prototype.name = 'FetchError';

let convert;
try {
	convert = __nccwpck_require__(2877).convert;
} catch (e) {}

const INTERNALS = Symbol('Body internals');

// fix an issue where "PassThrough" isn't a named export for node <10
const PassThrough = Stream.PassThrough;

/**
 * Body mixin
 *
 * Ref: https://fetch.spec.whatwg.org/#body
 *
 * @param   Stream  body  Readable stream
 * @param   Object  opts  Response options
 * @return  Void
 */
function Body(body) {
	var _this = this;

	var _ref = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
	    _ref$size = _ref.size;

	let size = _ref$size === undefined ? 0 : _ref$size;
	var _ref$timeout = _ref.timeout;
	let timeout = _ref$timeout === undefined ? 0 : _ref$timeout;

	if (body == null) {
		// body is undefined or null
		body = null;
	} else if (isURLSearchParams(body)) {
		// body is a URLSearchParams
		body = Buffer.from(body.toString());
	} else if (isBlob(body)) ; else if (Buffer.isBuffer(body)) ; else if (Object.prototype.toString.call(body) === '[object ArrayBuffer]') {
		// body is ArrayBuffer
		body = Buffer.from(body);
	} else if (ArrayBuffer.isView(body)) {
		// body is ArrayBufferView
		body = Buffer.from(body.buffer, body.byteOffset, body.byteLength);
	} else if (body instanceof Stream) ; else {
		// none of the above
		// coerce to string then buffer
		body = Buffer.from(String(body));
	}
	this[INTERNALS] = {
		body,
		disturbed: false,
		error: null
	};
	this.size = size;
	this.timeout = timeout;

	if (body instanceof Stream) {
		body.on('error', function (err) {
			const error = err.name === 'AbortError' ? err : new FetchError(`Invalid response body while trying to fetch ${_this.url}: ${err.message}`, 'system', err);
			_this[INTERNALS].error = error;
		});
	}
}

Body.prototype = {
	get body() {
		return this[INTERNALS].body;
	},

	get bodyUsed() {
		return this[INTERNALS].disturbed;
	},

	/**
  * Decode response as ArrayBuffer
  *
  * @return  Promise
  */
	arrayBuffer() {
		return consumeBody.call(this).then(function (buf) {
			return buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength);
		});
	},

	/**
  * Return raw response as Blob
  *
  * @return Promise
  */
	blob() {
		let ct = this.headers && this.headers.get('content-type') || '';
		return consumeBody.call(this).then(function (buf) {
			return Object.assign(
			// Prevent copying
			new Blob([], {
				type: ct.toLowerCase()
			}), {
				[BUFFER]: buf
			});
		});
	},

	/**
  * Decode response as json
  *
  * @return  Promise
  */
	json() {
		var _this2 = this;

		return consumeBody.call(this).then(function (buffer) {
			try {
				return JSON.parse(buffer.toString());
			} catch (err) {
				return Body.Promise.reject(new FetchError(`invalid json response body at ${_this2.url} reason: ${err.message}`, 'invalid-json'));
			}
		});
	},

	/**
  * Decode response as text
  *
  * @return  Promise
  */
	text() {
		return consumeBody.call(this).then(function (buffer) {
			return buffer.toString();
		});
	},

	/**
  * Decode response as buffer (non-spec api)
  *
  * @return  Promise
  */
	buffer() {
		return consumeBody.call(this);
	},

	/**
  * Decode response as text, while automatically detecting the encoding and
  * trying to decode to UTF-8 (non-spec api)
  *
  * @return  Promise
  */
	textConverted() {
		var _this3 = this;

		return consumeBody.call(this).then(function (buffer) {
			return convertBody(buffer, _this3.headers);
		});
	}
};

// In browsers, all properties are enumerable.
Object.defineProperties(Body.prototype, {
	body: { enumerable: true },
	bodyUsed: { enumerable: true },
	arrayBuffer: { enumerable: true },
	blob: { enumerable: true },
	json: { enumerable: true },
	text: { enumerable: true }
});

Body.mixIn = function (proto) {
	for (const name of Object.getOwnPropertyNames(Body.prototype)) {
		// istanbul ignore else: future proof
		if (!(name in proto)) {
			const desc = Object.getOwnPropertyDescriptor(Body.prototype, name);
			Object.defineProperty(proto, name, desc);
		}
	}
};

/**
 * Consume and convert an entire Body to a Buffer.
 *
 * Ref: https://fetch.spec.whatwg.org/#concept-body-consume-body
 *
 * @return  Promise
 */
function consumeBody() {
	var _this4 = this;

	if (this[INTERNALS].disturbed) {
		return Body.Promise.reject(new TypeError(`body used already for: ${this.url}`));
	}

	this[INTERNALS].disturbed = true;

	if (this[INTERNALS].error) {
		return Body.Promise.reject(this[INTERNALS].error);
	}

	let body = this.body;

	// body is null
	if (body === null) {
		return Body.Promise.resolve(Buffer.alloc(0));
	}

	// body is blob
	if (isBlob(body)) {
		body = body.stream();
	}

	// body is buffer
	if (Buffer.isBuffer(body)) {
		return Body.Promise.resolve(body);
	}

	// istanbul ignore if: should never happen
	if (!(body instanceof Stream)) {
		return Body.Promise.resolve(Buffer.alloc(0));
	}

	// body is stream
	// get ready to actually consume the body
	let accum = [];
	let accumBytes = 0;
	let abort = false;

	return new Body.Promise(function (resolve, reject) {
		let resTimeout;

		// allow timeout on slow response body
		if (_this4.timeout) {
			resTimeout = setTimeout(function () {
				abort = true;
				reject(new FetchError(`Response timeout while trying to fetch ${_this4.url} (over ${_this4.timeout}ms)`, 'body-timeout'));
			}, _this4.timeout);
		}

		// handle stream errors
		body.on('error', function (err) {
			if (err.name === 'AbortError') {
				// if the request was aborted, reject with this Error
				abort = true;
				reject(err);
			} else {
				// other errors, such as incorrect content-encoding
				reject(new FetchError(`Invalid response body while trying to fetch ${_this4.url}: ${err.message}`, 'system', err));
			}
		});

		body.on('data', function (chunk) {
			if (abort || chunk === null) {
				return;
			}

			if (_this4.size && accumBytes + chunk.length > _this4.size) {
				abort = true;
				reject(new FetchError(`content size at ${_this4.url} over limit: ${_this4.size}`, 'max-size'));
				return;
			}

			accumBytes += chunk.length;
			accum.push(chunk);
		});

		body.on('end', function () {
			if (abort) {
				return;
			}

			clearTimeout(resTimeout);

			try {
				resolve(Buffer.concat(accum, accumBytes));
			} catch (err) {
				// handle streams that have accumulated too much data (issue #414)
				reject(new FetchError(`Could not create Buffer from response body for ${_this4.url}: ${err.message}`, 'system', err));
			}
		});
	});
}

/**
 * Detect buffer encoding and convert to target encoding
 * ref: http://www.w3.org/TR/2011/WD-html5-20110113/parsing.html#determining-the-character-encoding
 *
 * @param   Buffer  buffer    Incoming buffer
 * @param   String  encoding  Target encoding
 * @return  String
 */
function convertBody(buffer, headers) {
	if (typeof convert !== 'function') {
		throw new Error('The package `encoding` must be installed to use the textConverted() function');
	}

	const ct = headers.get('content-type');
	let charset = 'utf-8';
	let res, str;

	// header
	if (ct) {
		res = /charset=([^;]*)/i.exec(ct);
	}

	// no charset in content type, peek at response body for at most 1024 bytes
	str = buffer.slice(0, 1024).toString();

	// html5
	if (!res && str) {
		res = /<meta.+?charset=(['"])(.+?)\1/i.exec(str);
	}

	// html4
	if (!res && str) {
		res = /<meta[\s]+?http-equiv=(['"])content-type\1[\s]+?content=(['"])(.+?)\2/i.exec(str);
		if (!res) {
			res = /<meta[\s]+?content=(['"])(.+?)\1[\s]+?http-equiv=(['"])content-type\3/i.exec(str);
			if (res) {
				res.pop(); // drop last quote
			}
		}

		if (res) {
			res = /charset=(.*)/i.exec(res.pop());
		}
	}

	// xml
	if (!res && str) {
		res = /<\?xml.+?encoding=(['"])(.+?)\1/i.exec(str);
	}

	// found charset
	if (res) {
		charset = res.pop();

		// prevent decode issues when sites use incorrect encoding
		// ref: https://hsivonen.fi/encoding-menu/
		if (charset === 'gb2312' || charset === 'gbk') {
			charset = 'gb18030';
		}
	}

	// turn raw buffers into a single utf-8 buffer
	return convert(buffer, 'UTF-8', charset).toString();
}

/**
 * Detect a URLSearchParams object
 * ref: https://github.com/bitinn/node-fetch/issues/296#issuecomment-307598143
 *
 * @param   Object  obj     Object to detect by type or brand
 * @return  String
 */
function isURLSearchParams(obj) {
	// Duck-typing as a necessary condition.
	if (typeof obj !== 'object' || typeof obj.append !== 'function' || typeof obj.delete !== 'function' || typeof obj.get !== 'function' || typeof obj.getAll !== 'function' || typeof obj.has !== 'function' || typeof obj.set !== 'function') {
		return false;
	}

	// Brand-checking and more duck-typing as optional condition.
	return obj.constructor.name === 'URLSearchParams' || Object.prototype.toString.call(obj) === '[object URLSearchParams]' || typeof obj.sort === 'function';
}

/**
 * Check if `obj` is a W3C `Blob` object (which `File` inherits from)
 * @param  {*} obj
 * @return {boolean}
 */
function isBlob(obj) {
	return typeof obj === 'object' && typeof obj.arrayBuffer === 'function' && typeof obj.type === 'string' && typeof obj.stream === 'function' && typeof obj.constructor === 'function' && typeof obj.constructor.name === 'string' && /^(Blob|File)$/.test(obj.constructor.name) && /^(Blob|File)$/.test(obj[Symbol.toStringTag]);
}

/**
 * Clone body given Res/Req instance
 *
 * @param   Mixed  instance  Response or Request instance
 * @return  Mixed
 */
function clone(instance) {
	let p1, p2;
	let body = instance.body;

	// don't allow cloning a used body
	if (instance.bodyUsed) {
		throw new Error('cannot clone body after it is used');
	}

	// check that body is a stream and not form-data object
	// note: we can't clone the form-data object without having it as a dependency
	if (body instanceof Stream && typeof body.getBoundary !== 'function') {
		// tee instance body
		p1 = new PassThrough();
		p2 = new PassThrough();
		body.pipe(p1);
		body.pipe(p2);
		// set instance body to teed body and return the other teed body
		instance[INTERNALS].body = p1;
		body = p2;
	}

	return body;
}

/**
 * Performs the operation "extract a `Content-Type` value from |object|" as
 * specified in the specification:
 * https://fetch.spec.whatwg.org/#concept-bodyinit-extract
 *
 * This function assumes that instance.body is present.
 *
 * @param   Mixed  instance  Any options.body input
 */
function extractContentType(body) {
	if (body === null) {
		// body is null
		return null;
	} else if (typeof body === 'string') {
		// body is string
		return 'text/plain;charset=UTF-8';
	} else if (isURLSearchParams(body)) {
		// body is a URLSearchParams
		return 'application/x-www-form-urlencoded;charset=UTF-8';
	} else if (isBlob(body)) {
		// body is blob
		return body.type || null;
	} else if (Buffer.isBuffer(body)) {
		// body is buffer
		return null;
	} else if (Object.prototype.toString.call(body) === '[object ArrayBuffer]') {
		// body is ArrayBuffer
		return null;
	} else if (ArrayBuffer.isView(body)) {
		// body is ArrayBufferView
		return null;
	} else if (typeof body.getBoundary === 'function') {
		// detect form data input from form-data module
		return `multipart/form-data;boundary=${body.getBoundary()}`;
	} else if (body instanceof Stream) {
		// body is stream
		// can't really do much about this
		return null;
	} else {
		// Body constructor defaults other things to string
		return 'text/plain;charset=UTF-8';
	}
}

/**
 * The Fetch Standard treats this as if "total bytes" is a property on the body.
 * For us, we have to explicitly get it with a function.
 *
 * ref: https://fetch.spec.whatwg.org/#concept-body-total-bytes
 *
 * @param   Body    instance   Instance of Body
 * @return  Number?            Number of bytes, or null if not possible
 */
function getTotalBytes(instance) {
	const body = instance.body;


	if (body === null) {
		// body is null
		return 0;
	} else if (isBlob(body)) {
		return body.size;
	} else if (Buffer.isBuffer(body)) {
		// body is buffer
		return body.length;
	} else if (body && typeof body.getLengthSync === 'function') {
		// detect form data input from form-data module
		if (body._lengthRetrievers && body._lengthRetrievers.length == 0 || // 1.x
		body.hasKnownLength && body.hasKnownLength()) {
			// 2.x
			return body.getLengthSync();
		}
		return null;
	} else {
		// body is stream
		return null;
	}
}

/**
 * Write a Body to a Node.js WritableStream (e.g. http.Request) object.
 *
 * @param   Body    instance   Instance of Body
 * @return  Void
 */
function writeToStream(dest, instance) {
	const body = instance.body;


	if (body === null) {
		// body is null
		dest.end();
	} else if (isBlob(body)) {
		body.stream().pipe(dest);
	} else if (Buffer.isBuffer(body)) {
		// body is buffer
		dest.write(body);
		dest.end();
	} else {
		// body is stream
		body.pipe(dest);
	}
}

// expose Promise
Body.Promise = global.Promise;

/**
 * headers.js
 *
 * Headers class offers convenient helpers
 */

const invalidTokenRegex = /[^\^_`a-zA-Z\-0-9!#$%&'*+.|~]/;
const invalidHeaderCharRegex = /[^\t\x20-\x7e\x80-\xff]/;

function validateName(name) {
	name = `${name}`;
	if (invalidTokenRegex.test(name) || name === '') {
		throw new TypeError(`${name} is not a legal HTTP header name`);
	}
}

function validateValue(value) {
	value = `${value}`;
	if (invalidHeaderCharRegex.test(value)) {
		throw new TypeError(`${value} is not a legal HTTP header value`);
	}
}

/**
 * Find the key in the map object given a header name.
 *
 * Returns undefined if not found.
 *
 * @param   String  name  Header name
 * @return  String|Undefined
 */
function find(map, name) {
	name = name.toLowerCase();
	for (const key in map) {
		if (key.toLowerCase() === name) {
			return key;
		}
	}
	return undefined;
}

const MAP = Symbol('map');
class Headers {
	/**
  * Headers class
  *
  * @param   Object  headers  Response headers
  * @return  Void
  */
	constructor() {
		let init = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : undefined;

		this[MAP] = Object.create(null);

		if (init instanceof Headers) {
			const rawHeaders = init.raw();
			const headerNames = Object.keys(rawHeaders);

			for (const headerName of headerNames) {
				for (const value of rawHeaders[headerName]) {
					this.append(headerName, value);
				}
			}

			return;
		}

		// We don't worry about converting prop to ByteString here as append()
		// will handle it.
		if (init == null) ; else if (typeof init === 'object') {
			const method = init[Symbol.iterator];
			if (method != null) {
				if (typeof method !== 'function') {
					throw new TypeError('Header pairs must be iterable');
				}

				// sequence<sequence<ByteString>>
				// Note: per spec we have to first exhaust the lists then process them
				const pairs = [];
				for (const pair of init) {
					if (typeof pair !== 'object' || typeof pair[Symbol.iterator] !== 'function') {
						throw new TypeError('Each header pair must be iterable');
					}
					pairs.push(Array.from(pair));
				}

				for (const pair of pairs) {
					if (pair.length !== 2) {
						throw new TypeError('Each header pair must be a name/value tuple');
					}
					this.append(pair[0], pair[1]);
				}
			} else {
				// record<ByteString, ByteString>
				for (const key of Object.keys(init)) {
					const value = init[key];
					this.append(key, value);
				}
			}
		} else {
			throw new TypeError('Provided initializer must be an object');
		}
	}

	/**
  * Return combined header value given name
  *
  * @param   String  name  Header name
  * @return  Mixed
  */
	get(name) {
		name = `${name}`;
		validateName(name);
		const key = find(this[MAP], name);
		if (key === undefined) {
			return null;
		}

		return this[MAP][key].join(', ');
	}

	/**
  * Iterate over all headers
  *
  * @param   Function  callback  Executed for each item with parameters (value, name, thisArg)
  * @param   Boolean   thisArg   `this` context for callback function
  * @return  Void
  */
	forEach(callback) {
		let thisArg = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : undefined;

		let pairs = getHeaders(this);
		let i = 0;
		while (i < pairs.length) {
			var _pairs$i = pairs[i];
			const name = _pairs$i[0],
			      value = _pairs$i[1];

			callback.call(thisArg, value, name, this);
			pairs = getHeaders(this);
			i++;
		}
	}

	/**
  * Overwrite header values given name
  *
  * @param   String  name   Header name
  * @param   String  value  Header value
  * @return  Void
  */
	set(name, value) {
		name = `${name}`;
		value = `${value}`;
		validateName(name);
		validateValue(value);
		const key = find(this[MAP], name);
		this[MAP][key !== undefined ? key : name] = [value];
	}

	/**
  * Append a value onto existing header
  *
  * @param   String  name   Header name
  * @param   String  value  Header value
  * @return  Void
  */
	append(name, value) {
		name = `${name}`;
		value = `${value}`;
		validateName(name);
		validateValue(value);
		const key = find(this[MAP], name);
		if (key !== undefined) {
			this[MAP][key].push(value);
		} else {
			this[MAP][name] = [value];
		}
	}

	/**
  * Check for header name existence
  *
  * @param   String   name  Header name
  * @return  Boolean
  */
	has(name) {
		name = `${name}`;
		validateName(name);
		return find(this[MAP], name) !== undefined;
	}

	/**
  * Delete all header values given name
  *
  * @param   String  name  Header name
  * @return  Void
  */
	delete(name) {
		name = `${name}`;
		validateName(name);
		const key = find(this[MAP], name);
		if (key !== undefined) {
			delete this[MAP][key];
		}
	}

	/**
  * Return raw headers (non-spec api)
  *
  * @return  Object
  */
	raw() {
		return this[MAP];
	}

	/**
  * Get an iterator on keys.
  *
  * @return  Iterator
  */
	keys() {
		return createHeadersIterator(this, 'key');
	}

	/**
  * Get an iterator on values.
  *
  * @return  Iterator
  */
	values() {
		return createHeadersIterator(this, 'value');
	}

	/**
  * Get an iterator on entries.
  *
  * This is the default iterator of the Headers object.
  *
  * @return  Iterator
  */
	[Symbol.iterator]() {
		return createHeadersIterator(this, 'key+value');
	}
}
Headers.prototype.entries = Headers.prototype[Symbol.iterator];

Object.defineProperty(Headers.prototype, Symbol.toStringTag, {
	value: 'Headers',
	writable: false,
	enumerable: false,
	configurable: true
});

Object.defineProperties(Headers.prototype, {
	get: { enumerable: true },
	forEach: { enumerable: true },
	set: { enumerable: true },
	append: { enumerable: true },
	has: { enumerable: true },
	delete: { enumerable: true },
	keys: { enumerable: true },
	values: { enumerable: true },
	entries: { enumerable: true }
});

function getHeaders(headers) {
	let kind = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'key+value';

	const keys = Object.keys(headers[MAP]).sort();
	return keys.map(kind === 'key' ? function (k) {
		return k.toLowerCase();
	} : kind === 'value' ? function (k) {
		return headers[MAP][k].join(', ');
	} : function (k) {
		return [k.toLowerCase(), headers[MAP][k].join(', ')];
	});
}

const INTERNAL = Symbol('internal');

function createHeadersIterator(target, kind) {
	const iterator = Object.create(HeadersIteratorPrototype);
	iterator[INTERNAL] = {
		target,
		kind,
		index: 0
	};
	return iterator;
}

const HeadersIteratorPrototype = Object.setPrototypeOf({
	next() {
		// istanbul ignore if
		if (!this || Object.getPrototypeOf(this) !== HeadersIteratorPrototype) {
			throw new TypeError('Value of `this` is not a HeadersIterator');
		}

		var _INTERNAL = this[INTERNAL];
		const target = _INTERNAL.target,
		      kind = _INTERNAL.kind,
		      index = _INTERNAL.index;

		const values = getHeaders(target, kind);
		const len = values.length;
		if (index >= len) {
			return {
				value: undefined,
				done: true
			};
		}

		this[INTERNAL].index = index + 1;

		return {
			value: values[index],
			done: false
		};
	}
}, Object.getPrototypeOf(Object.getPrototypeOf([][Symbol.iterator]())));

Object.defineProperty(HeadersIteratorPrototype, Symbol.toStringTag, {
	value: 'HeadersIterator',
	writable: false,
	enumerable: false,
	configurable: true
});

/**
 * Export the Headers object in a form that Node.js can consume.
 *
 * @param   Headers  headers
 * @return  Object
 */
function exportNodeCompatibleHeaders(headers) {
	const obj = Object.assign({ __proto__: null }, headers[MAP]);

	// http.request() only supports string as Host header. This hack makes
	// specifying custom Host header possible.
	const hostHeaderKey = find(headers[MAP], 'Host');
	if (hostHeaderKey !== undefined) {
		obj[hostHeaderKey] = obj[hostHeaderKey][0];
	}

	return obj;
}

/**
 * Create a Headers object from an object of headers, ignoring those that do
 * not conform to HTTP grammar productions.
 *
 * @param   Object  obj  Object of headers
 * @return  Headers
 */
function createHeadersLenient(obj) {
	const headers = new Headers();
	for (const name of Object.keys(obj)) {
		if (invalidTokenRegex.test(name)) {
			continue;
		}
		if (Array.isArray(obj[name])) {
			for (const val of obj[name]) {
				if (invalidHeaderCharRegex.test(val)) {
					continue;
				}
				if (headers[MAP][name] === undefined) {
					headers[MAP][name] = [val];
				} else {
					headers[MAP][name].push(val);
				}
			}
		} else if (!invalidHeaderCharRegex.test(obj[name])) {
			headers[MAP][name] = [obj[name]];
		}
	}
	return headers;
}

const INTERNALS$1 = Symbol('Response internals');

// fix an issue where "STATUS_CODES" aren't a named export for node <10
const STATUS_CODES = http.STATUS_CODES;

/**
 * Response class
 *
 * @param   Stream  body  Readable stream
 * @param   Object  opts  Response options
 * @return  Void
 */
class Response {
	constructor() {
		let body = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
		let opts = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

		Body.call(this, body, opts);

		const status = opts.status || 200;
		const headers = new Headers(opts.headers);

		if (body != null && !headers.has('Content-Type')) {
			const contentType = extractContentType(body);
			if (contentType) {
				headers.append('Content-Type', contentType);
			}
		}

		this[INTERNALS$1] = {
			url: opts.url,
			status,
			statusText: opts.statusText || STATUS_CODES[status],
			headers,
			counter: opts.counter
		};
	}

	get url() {
		return this[INTERNALS$1].url || '';
	}

	get status() {
		return this[INTERNALS$1].status;
	}

	/**
  * Convenience property representing if the request ended normally
  */
	get ok() {
		return this[INTERNALS$1].status >= 200 && this[INTERNALS$1].status < 300;
	}

	get redirected() {
		return this[INTERNALS$1].counter > 0;
	}

	get statusText() {
		return this[INTERNALS$1].statusText;
	}

	get headers() {
		return this[INTERNALS$1].headers;
	}

	/**
  * Clone this response
  *
  * @return  Response
  */
	clone() {
		return new Response(clone(this), {
			url: this.url,
			status: this.status,
			statusText: this.statusText,
			headers: this.headers,
			ok: this.ok,
			redirected: this.redirected
		});
	}
}

Body.mixIn(Response.prototype);

Object.defineProperties(Response.prototype, {
	url: { enumerable: true },
	status: { enumerable: true },
	ok: { enumerable: true },
	redirected: { enumerable: true },
	statusText: { enumerable: true },
	headers: { enumerable: true },
	clone: { enumerable: true }
});

Object.defineProperty(Response.prototype, Symbol.toStringTag, {
	value: 'Response',
	writable: false,
	enumerable: false,
	configurable: true
});

const INTERNALS$2 = Symbol('Request internals');

// fix an issue where "format", "parse" aren't a named export for node <10
const parse_url = Url.parse;
const format_url = Url.format;

const streamDestructionSupported = 'destroy' in Stream.Readable.prototype;

/**
 * Check if a value is an instance of Request.
 *
 * @param   Mixed   input
 * @return  Boolean
 */
function isRequest(input) {
	return typeof input === 'object' && typeof input[INTERNALS$2] === 'object';
}

function isAbortSignal(signal) {
	const proto = signal && typeof signal === 'object' && Object.getPrototypeOf(signal);
	return !!(proto && proto.constructor.name === 'AbortSignal');
}

/**
 * Request class
 *
 * @param   Mixed   input  Url or Request instance
 * @param   Object  init   Custom options
 * @return  Void
 */
class Request {
	constructor(input) {
		let init = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

		let parsedURL;

		// normalize input
		if (!isRequest(input)) {
			if (input && input.href) {
				// in order to support Node.js' Url objects; though WHATWG's URL objects
				// will fall into this branch also (since their `toString()` will return
				// `href` property anyway)
				parsedURL = parse_url(input.href);
			} else {
				// coerce input to a string before attempting to parse
				parsedURL = parse_url(`${input}`);
			}
			input = {};
		} else {
			parsedURL = parse_url(input.url);
		}

		let method = init.method || input.method || 'GET';
		method = method.toUpperCase();

		if ((init.body != null || isRequest(input) && input.body !== null) && (method === 'GET' || method === 'HEAD')) {
			throw new TypeError('Request with GET/HEAD method cannot have body');
		}

		let inputBody = init.body != null ? init.body : isRequest(input) && input.body !== null ? clone(input) : null;

		Body.call(this, inputBody, {
			timeout: init.timeout || input.timeout || 0,
			size: init.size || input.size || 0
		});

		const headers = new Headers(init.headers || input.headers || {});

		if (inputBody != null && !headers.has('Content-Type')) {
			const contentType = extractContentType(inputBody);
			if (contentType) {
				headers.append('Content-Type', contentType);
			}
		}

		let signal = isRequest(input) ? input.signal : null;
		if ('signal' in init) signal = init.signal;

		if (signal != null && !isAbortSignal(signal)) {
			throw new TypeError('Expected signal to be an instanceof AbortSignal');
		}

		this[INTERNALS$2] = {
			method,
			redirect: init.redirect || input.redirect || 'follow',
			headers,
			parsedURL,
			signal
		};

		// node-fetch-only options
		this.follow = init.follow !== undefined ? init.follow : input.follow !== undefined ? input.follow : 20;
		this.compress = init.compress !== undefined ? init.compress : input.compress !== undefined ? input.compress : true;
		this.counter = init.counter || input.counter || 0;
		this.agent = init.agent || input.agent;
	}

	get method() {
		return this[INTERNALS$2].method;
	}

	get url() {
		return format_url(this[INTERNALS$2].parsedURL);
	}

	get headers() {
		return this[INTERNALS$2].headers;
	}

	get redirect() {
		return this[INTERNALS$2].redirect;
	}

	get signal() {
		return this[INTERNALS$2].signal;
	}

	/**
  * Clone this request
  *
  * @return  Request
  */
	clone() {
		return new Request(this);
	}
}

Body.mixIn(Request.prototype);

Object.defineProperty(Request.prototype, Symbol.toStringTag, {
	value: 'Request',
	writable: false,
	enumerable: false,
	configurable: true
});

Object.defineProperties(Request.prototype, {
	method: { enumerable: true },
	url: { enumerable: true },
	headers: { enumerable: true },
	redirect: { enumerable: true },
	clone: { enumerable: true },
	signal: { enumerable: true }
});

/**
 * Convert a Request to Node.js http request options.
 *
 * @param   Request  A Request instance
 * @return  Object   The options object to be passed to http.request
 */
function getNodeRequestOptions(request) {
	const parsedURL = request[INTERNALS$2].parsedURL;
	const headers = new Headers(request[INTERNALS$2].headers);

	// fetch step 1.3
	if (!headers.has('Accept')) {
		headers.set('Accept', '*/*');
	}

	// Basic fetch
	if (!parsedURL.protocol || !parsedURL.hostname) {
		throw new TypeError('Only absolute URLs are supported');
	}

	if (!/^https?:$/.test(parsedURL.protocol)) {
		throw new TypeError('Only HTTP(S) protocols are supported');
	}

	if (request.signal && request.body instanceof Stream.Readable && !streamDestructionSupported) {
		throw new Error('Cancellation of streamed requests with AbortSignal is not supported in node < 8');
	}

	// HTTP-network-or-cache fetch steps 2.4-2.7
	let contentLengthValue = null;
	if (request.body == null && /^(POST|PUT)$/i.test(request.method)) {
		contentLengthValue = '0';
	}
	if (request.body != null) {
		const totalBytes = getTotalBytes(request);
		if (typeof totalBytes === 'number') {
			contentLengthValue = String(totalBytes);
		}
	}
	if (contentLengthValue) {
		headers.set('Content-Length', contentLengthValue);
	}

	// HTTP-network-or-cache fetch step 2.11
	if (!headers.has('User-Agent')) {
		headers.set('User-Agent', 'node-fetch/1.0 (+https://github.com/bitinn/node-fetch)');
	}

	// HTTP-network-or-cache fetch step 2.15
	if (request.compress && !headers.has('Accept-Encoding')) {
		headers.set('Accept-Encoding', 'gzip,deflate');
	}

	let agent = request.agent;
	if (typeof agent === 'function') {
		agent = agent(parsedURL);
	}

	if (!headers.has('Connection') && !agent) {
		headers.set('Connection', 'close');
	}

	// HTTP-network fetch step 4.2
	// chunked encoding is handled by Node.js

	return Object.assign({}, parsedURL, {
		method: request.method,
		headers: exportNodeCompatibleHeaders(headers),
		agent
	});
}

/**
 * abort-error.js
 *
 * AbortError interface for cancelled requests
 */

/**
 * Create AbortError instance
 *
 * @param   String      message      Error message for human
 * @return  AbortError
 */
function AbortError(message) {
  Error.call(this, message);

  this.type = 'aborted';
  this.message = message;

  // hide custom error implementation details from end-users
  Error.captureStackTrace(this, this.constructor);
}

AbortError.prototype = Object.create(Error.prototype);
AbortError.prototype.constructor = AbortError;
AbortError.prototype.name = 'AbortError';

// fix an issue where "PassThrough", "resolve" aren't a named export for node <10
const PassThrough$1 = Stream.PassThrough;
const resolve_url = Url.resolve;

/**
 * Fetch function
 *
 * @param   Mixed    url   Absolute url or Request instance
 * @param   Object   opts  Fetch options
 * @return  Promise
 */
function fetch(url, opts) {

	// allow custom promise
	if (!fetch.Promise) {
		throw new Error('native promise missing, set fetch.Promise to your favorite alternative');
	}

	Body.Promise = fetch.Promise;

	// wrap http.request into fetch
	return new fetch.Promise(function (resolve, reject) {
		// build request object
		const request = new Request(url, opts);
		const options = getNodeRequestOptions(request);

		const send = (options.protocol === 'https:' ? https : http).request;
		const signal = request.signal;

		let response = null;

		const abort = function abort() {
			let error = new AbortError('The user aborted a request.');
			reject(error);
			if (request.body && request.body instanceof Stream.Readable) {
				request.body.destroy(error);
			}
			if (!response || !response.body) return;
			response.body.emit('error', error);
		};

		if (signal && signal.aborted) {
			abort();
			return;
		}

		const abortAndFinalize = function abortAndFinalize() {
			abort();
			finalize();
		};

		// send request
		const req = send(options);
		let reqTimeout;

		if (signal) {
			signal.addEventListener('abort', abortAndFinalize);
		}

		function finalize() {
			req.abort();
			if (signal) signal.removeEventListener('abort', abortAndFinalize);
			clearTimeout(reqTimeout);
		}

		if (request.timeout) {
			req.once('socket', function (socket) {
				reqTimeout = setTimeout(function () {
					reject(new FetchError(`network timeout at: ${request.url}`, 'request-timeout'));
					finalize();
				}, request.timeout);
			});
		}

		req.on('error', function (err) {
			reject(new FetchError(`request to ${request.url} failed, reason: ${err.message}`, 'system', err));
			finalize();
		});

		req.on('response', function (res) {
			clearTimeout(reqTimeout);

			const headers = createHeadersLenient(res.headers);

			// HTTP fetch step 5
			if (fetch.isRedirect(res.statusCode)) {
				// HTTP fetch step 5.2
				const location = headers.get('Location');

				// HTTP fetch step 5.3
				const locationURL = location === null ? null : resolve_url(request.url, location);

				// HTTP fetch step 5.5
				switch (request.redirect) {
					case 'error':
						reject(new FetchError(`uri requested responds with a redirect, redirect mode is set to error: ${request.url}`, 'no-redirect'));
						finalize();
						return;
					case 'manual':
						// node-fetch-specific step: make manual redirect a bit easier to use by setting the Location header value to the resolved URL.
						if (locationURL !== null) {
							// handle corrupted header
							try {
								headers.set('Location', locationURL);
							} catch (err) {
								// istanbul ignore next: nodejs server prevent invalid response headers, we can't test this through normal request
								reject(err);
							}
						}
						break;
					case 'follow':
						// HTTP-redirect fetch step 2
						if (locationURL === null) {
							break;
						}

						// HTTP-redirect fetch step 5
						if (request.counter >= request.follow) {
							reject(new FetchError(`maximum redirect reached at: ${request.url}`, 'max-redirect'));
							finalize();
							return;
						}

						// HTTP-redirect fetch step 6 (counter increment)
						// Create a new Request object.
						const requestOpts = {
							headers: new Headers(request.headers),
							follow: request.follow,
							counter: request.counter + 1,
							agent: request.agent,
							compress: request.compress,
							method: request.method,
							body: request.body,
							signal: request.signal,
							timeout: request.timeout,
							size: request.size
						};

						// HTTP-redirect fetch step 9
						if (res.statusCode !== 303 && request.body && getTotalBytes(request) === null) {
							reject(new FetchError('Cannot follow redirect with body being a readable stream', 'unsupported-redirect'));
							finalize();
							return;
						}

						// HTTP-redirect fetch step 11
						if (res.statusCode === 303 || (res.statusCode === 301 || res.statusCode === 302) && request.method === 'POST') {
							requestOpts.method = 'GET';
							requestOpts.body = undefined;
							requestOpts.headers.delete('content-length');
						}

						// HTTP-redirect fetch step 15
						resolve(fetch(new Request(locationURL, requestOpts)));
						finalize();
						return;
				}
			}

			// prepare response
			res.once('end', function () {
				if (signal) signal.removeEventListener('abort', abortAndFinalize);
			});
			let body = res.pipe(new PassThrough$1());

			const response_options = {
				url: request.url,
				status: res.statusCode,
				statusText: res.statusMessage,
				headers: headers,
				size: request.size,
				timeout: request.timeout,
				counter: request.counter
			};

			// HTTP-network fetch step 12.1.1.3
			const codings = headers.get('Content-Encoding');

			// HTTP-network fetch step 12.1.1.4: handle content codings

			// in following scenarios we ignore compression support
			// 1. compression support is disabled
			// 2. HEAD request
			// 3. no Content-Encoding header
			// 4. no content response (204)
			// 5. content not modified response (304)
			if (!request.compress || request.method === 'HEAD' || codings === null || res.statusCode === 204 || res.statusCode === 304) {
				response = new Response(body, response_options);
				resolve(response);
				return;
			}

			// For Node v6+
			// Be less strict when decoding compressed responses, since sometimes
			// servers send slightly invalid responses that are still accepted
			// by common browsers.
			// Always using Z_SYNC_FLUSH is what cURL does.
			const zlibOptions = {
				flush: zlib.Z_SYNC_FLUSH,
				finishFlush: zlib.Z_SYNC_FLUSH
			};

			// for gzip
			if (codings == 'gzip' || codings == 'x-gzip') {
				body = body.pipe(zlib.createGunzip(zlibOptions));
				response = new Response(body, response_options);
				resolve(response);
				return;
			}

			// for deflate
			if (codings == 'deflate' || codings == 'x-deflate') {
				// handle the infamous raw deflate response from old servers
				// a hack for old IIS and Apache servers
				const raw = res.pipe(new PassThrough$1());
				raw.once('data', function (chunk) {
					// see http://stackoverflow.com/questions/37519828
					if ((chunk[0] & 0x0F) === 0x08) {
						body = body.pipe(zlib.createInflate());
					} else {
						body = body.pipe(zlib.createInflateRaw());
					}
					response = new Response(body, response_options);
					resolve(response);
				});
				return;
			}

			// for br
			if (codings == 'br' && typeof zlib.createBrotliDecompress === 'function') {
				body = body.pipe(zlib.createBrotliDecompress());
				response = new Response(body, response_options);
				resolve(response);
				return;
			}

			// otherwise, use response as-is
			response = new Response(body, response_options);
			resolve(response);
		});

		writeToStream(req, request);
	});
}
/**
 * Redirect code matching
 *
 * @param   Number   code  Status code
 * @return  Boolean
 */
fetch.isRedirect = function (code) {
	return code === 301 || code === 302 || code === 303 || code === 307 || code === 308;
};

// expose Promise
fetch.Promise = global.Promise;

module.exports = exports = fetch;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.default = exports;
exports.Headers = Headers;
exports.Request = Request;
exports.Response = Response;
exports.FetchError = FetchError;


/***/ }),

/***/ 7426:
/***/ ((module) => {

"use strict";
/*
object-assign
(c) Sindre Sorhus
@license MIT
*/


/* eslint-disable no-unused-vars */
var getOwnPropertySymbols = Object.getOwnPropertySymbols;
var hasOwnProperty = Object.prototype.hasOwnProperty;
var propIsEnumerable = Object.prototype.propertyIsEnumerable;

function toObject(val) {
	if (val === null || val === undefined) {
		throw new TypeError('Object.assign cannot be called with null or undefined');
	}

	return Object(val);
}

function shouldUseNative() {
	try {
		if (!Object.assign) {
			return false;
		}

		// Detect buggy property enumeration order in older V8 versions.

		// https://bugs.chromium.org/p/v8/issues/detail?id=4118
		var test1 = new String('abc');  // eslint-disable-line no-new-wrappers
		test1[5] = 'de';
		if (Object.getOwnPropertyNames(test1)[0] === '5') {
			return false;
		}

		// https://bugs.chromium.org/p/v8/issues/detail?id=3056
		var test2 = {};
		for (var i = 0; i < 10; i++) {
			test2['_' + String.fromCharCode(i)] = i;
		}
		var order2 = Object.getOwnPropertyNames(test2).map(function (n) {
			return test2[n];
		});
		if (order2.join('') !== '0123456789') {
			return false;
		}

		// https://bugs.chromium.org/p/v8/issues/detail?id=3056
		var test3 = {};
		'abcdefghijklmnopqrst'.split('').forEach(function (letter) {
			test3[letter] = letter;
		});
		if (Object.keys(Object.assign({}, test3)).join('') !==
				'abcdefghijklmnopqrst') {
			return false;
		}

		return true;
	} catch (err) {
		// We don't expect any of the above to throw, but better to be safe.
		return false;
	}
}

module.exports = shouldUseNative() ? Object.assign : function (target, source) {
	var from;
	var to = toObject(target);
	var symbols;

	for (var s = 1; s < arguments.length; s++) {
		from = Object(arguments[s]);

		for (var key in from) {
			if (hasOwnProperty.call(from, key)) {
				to[key] = from[key];
			}
		}

		if (getOwnPropertySymbols) {
			symbols = getOwnPropertySymbols(from);
			for (var i = 0; i < symbols.length; i++) {
				if (propIsEnumerable.call(from, symbols[i])) {
					to[symbols[i]] = from[symbols[i]];
				}
			}
		}
	}

	return to;
};


/***/ }),

/***/ 1223:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

var wrappy = __nccwpck_require__(2940)
module.exports = wrappy(once)
module.exports.strict = wrappy(onceStrict)

once.proto = once(function () {
  Object.defineProperty(Function.prototype, 'once', {
    value: function () {
      return once(this)
    },
    configurable: true
  })

  Object.defineProperty(Function.prototype, 'onceStrict', {
    value: function () {
      return onceStrict(this)
    },
    configurable: true
  })
})

function once (fn) {
  var f = function () {
    if (f.called) return f.value
    f.called = true
    return f.value = fn.apply(this, arguments)
  }
  f.called = false
  return f
}

function onceStrict (fn) {
  var f = function () {
    if (f.called)
      throw new Error(f.onceError)
    f.called = true
    return f.value = fn.apply(this, arguments)
  }
  var name = fn.name || 'Function wrapped with `once`'
  f.onceError = name + " shouldn't be called more than once"
  f.called = false
  return f
}


/***/ }),

/***/ 3406:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";

var os = __nccwpck_require__(2087);

function homedir() {
	var env = process.env;
	var home = env.HOME;
	var user = env.LOGNAME || env.USER || env.LNAME || env.USERNAME;

	if (process.platform === 'win32') {
		return env.USERPROFILE || env.HOMEDRIVE + env.HOMEPATH || home || null;
	}

	if (process.platform === 'darwin') {
		return home || (user ? '/Users/' + user : null);
	}

	if (process.platform === 'linux') {
		return home || (process.getuid() === 0 ? '/root' : (user ? '/home/' + user : null));
	}

	return home || null;
}

module.exports = typeof os.homedir === 'function' ? os.homedir : homedir;


/***/ }),

/***/ 1284:
/***/ ((module) => {

"use strict";

var isWindows = process.platform === 'win32';
var trailingSlashRe = isWindows ? /[^:]\\$/ : /.\/$/;

// https://github.com/nodejs/node/blob/3e7a14381497a3b73dda68d05b5130563cdab420/lib/os.js#L25-L43
module.exports = function () {
	var path;

	if (isWindows) {
		path = process.env.TEMP ||
			process.env.TMP ||
			(process.env.SystemRoot || process.env.windir) + '\\temp';
	} else {
		path = process.env.TMPDIR ||
			process.env.TMP ||
			process.env.TEMP ||
			'/tmp';
	}

	if (trailingSlashRe.test(path)) {
		path = path.slice(0, -1);
	}

	return path;
};


/***/ }),

/***/ 4669:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

var isWindows = process.platform === 'win32'
var path = __nccwpck_require__(5622)
var exec = __nccwpck_require__(3129).exec
var osTmpdir = __nccwpck_require__(1284)
var osHomedir = __nccwpck_require__(3406)

// looking up envs is a bit costly.
// Also, sometimes we want to have a fallback
// Pass in a callback to wait for the fallback on failures
// After the first lookup, always returns the same thing.
function memo (key, lookup, fallback) {
  var fell = false
  var falling = false
  exports[key] = function (cb) {
    var val = lookup()
    if (!val && !fell && !falling && fallback) {
      fell = true
      falling = true
      exec(fallback, function (er, output, stderr) {
        falling = false
        if (er) return // oh well, we tried
        val = output.trim()
      })
    }
    exports[key] = function (cb) {
      if (cb) process.nextTick(cb.bind(null, null, val))
      return val
    }
    if (cb && !falling) process.nextTick(cb.bind(null, null, val))
    return val
  }
}

memo('user', function () {
  return ( isWindows
         ? process.env.USERDOMAIN + '\\' + process.env.USERNAME
         : process.env.USER
         )
}, 'whoami')

memo('prompt', function () {
  return isWindows ? process.env.PROMPT : process.env.PS1
})

memo('hostname', function () {
  return isWindows ? process.env.COMPUTERNAME : process.env.HOSTNAME
}, 'hostname')

memo('tmpdir', function () {
  return osTmpdir()
})

memo('home', function () {
  return osHomedir()
})

memo('path', function () {
  return (process.env.PATH ||
          process.env.Path ||
          process.env.path).split(isWindows ? ';' : ':')
})

memo('editor', function () {
  return process.env.EDITOR ||
         process.env.VISUAL ||
         (isWindows ? 'notepad.exe' : 'vi')
})

memo('shell', function () {
  return isWindows ? process.env.ComSpec || 'cmd'
         : process.env.SHELL || 'bash'
})


/***/ }),

/***/ 6143:
/***/ ((module) => {

"use strict";

module.exports = function (url) {
	if (typeof url !== 'string') {
		throw new TypeError('Expected a string, got ' + typeof url);
	}

	url = url.trim();

	if (/^\.*\/|^(?!localhost)\w+:/.test(url)) {
		return url;
	}

	return url.replace(/^(?!(?:\w+:)?\/\/)/, 'http://');
};


/***/ }),

/***/ 1867:
/***/ ((module, exports, __nccwpck_require__) => {

/*! safe-buffer. MIT License. Feross Aboukhadijeh <https://feross.org/opensource> */
/* eslint-disable node/no-deprecated-api */
var buffer = __nccwpck_require__(4293)
var Buffer = buffer.Buffer

// alternative to using Object.keys for old browsers
function copyProps (src, dst) {
  for (var key in src) {
    dst[key] = src[key]
  }
}
if (Buffer.from && Buffer.alloc && Buffer.allocUnsafe && Buffer.allocUnsafeSlow) {
  module.exports = buffer
} else {
  // Copy properties from require('buffer')
  copyProps(buffer, exports)
  exports.Buffer = SafeBuffer
}

function SafeBuffer (arg, encodingOrOffset, length) {
  return Buffer(arg, encodingOrOffset, length)
}

SafeBuffer.prototype = Object.create(Buffer.prototype)

// Copy static methods from Buffer
copyProps(Buffer, SafeBuffer)

SafeBuffer.from = function (arg, encodingOrOffset, length) {
  if (typeof arg === 'number') {
    throw new TypeError('Argument must not be a number')
  }
  return Buffer(arg, encodingOrOffset, length)
}

SafeBuffer.alloc = function (size, fill, encoding) {
  if (typeof size !== 'number') {
    throw new TypeError('Argument must be a number')
  }
  var buf = Buffer(size)
  if (fill !== undefined) {
    if (typeof encoding === 'string') {
      buf.fill(fill, encoding)
    } else {
      buf.fill(fill)
    }
  } else {
    buf.fill(0)
  }
  return buf
}

SafeBuffer.allocUnsafe = function (size) {
  if (typeof size !== 'number') {
    throw new TypeError('Argument must be a number')
  }
  return Buffer(size)
}

SafeBuffer.allocUnsafeSlow = function (size) {
  if (typeof size !== 'number') {
    throw new TypeError('Argument must be a number')
  }
  return buffer.SlowBuffer(size)
}


/***/ }),

/***/ 7380:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

var vm = __nccwpck_require__(2184)

module.exports = function safeEval (code, context, opts) {
  var sandbox = {}
  var resultKey = 'SAFE_EVAL_' + Math.floor(Math.random() * 1000000)
  sandbox[resultKey] = {}
  code = resultKey + '=' + code
  if (context) {
    Object.keys(context).forEach(function (key) {
      sandbox[key] = context[key]
    })
  }
  vm.runInNewContext(code, sandbox, opts)
  return sandbox[resultKey]
}


/***/ }),

/***/ 4976:
/***/ ((module) => {


/*
usage:

// do something to a list of things
asyncMap(myListOfStuff, function (thing, cb) { doSomething(thing.foo, cb) }, cb)
// do more than one thing to each item
asyncMap(list, fooFn, barFn, cb)

*/

module.exports = asyncMap

function asyncMap () {
  var steps = Array.prototype.slice.call(arguments)
    , list = steps.shift() || []
    , cb_ = steps.pop()
  if (typeof cb_ !== "function") throw new Error(
    "No callback provided to asyncMap")
  if (!list) return cb_(null, [])
  if (!Array.isArray(list)) list = [list]
  var n = steps.length
    , data = [] // 2d array
    , errState = null
    , l = list.length
    , a = l * n
  if (!a) return cb_(null, [])
  function cb (er) {
    if (er && !errState) errState = er

    var argLen = arguments.length
    for (var i = 1; i < argLen; i ++) if (arguments[i] !== undefined) {
      data[i - 1] = (data[i - 1] || []).concat(arguments[i])
    }
    // see if any new things have been added.
    if (list.length > l) {
      var newList = list.slice(l)
      a += (list.length - l) * n
      l = list.length
      process.nextTick(function () {
        newList.forEach(function (ar) {
          steps.forEach(function (fn) { fn(ar, cb) })
        })
      })
    }

    if (--a === 0) cb_.apply(null, [errState].concat(data))
  }
  // expect the supplied cb function to be called
  // "n" times for each thing in the array.
  list.forEach(function (ar) {
    steps.forEach(function (fn) { fn(ar, cb) })
  })
}


/***/ }),

/***/ 1412:
/***/ ((module) => {

module.exports = bindActor
function bindActor () {
  var args = 
        Array.prototype.slice.call
        (arguments) // jswtf.
    , obj = null
    , fn
  if (typeof args[0] === "object") {
    obj = args.shift()
    fn = args.shift()
    if (typeof fn === "string")
      fn = obj[ fn ]
  } else fn = args.shift()
  return function (cb) {
    fn.apply(obj, args.concat(cb)) }
}


/***/ }),

/***/ 3660:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

module.exports = chain
var bindActor = __nccwpck_require__(1412)
chain.first = {} ; chain.last = {}
function chain (things, cb) {
  var res = []
  ;(function LOOP (i, len) {
    if (i >= len) return cb(null,res)
    if (Array.isArray(things[i]))
      things[i] = bindActor.apply(null,
        things[i].map(function(i){
          return (i===chain.first) ? res[0]
           : (i===chain.last)
             ? res[res.length - 1] : i }))
    if (!things[i]) return LOOP(i + 1, len)
    things[i](function (er, data) {
      if (er) return cb(er, res)
      if (data !== undefined) res = res.concat(data)
      LOOP(i + 1, len)
    })
  })(0, things.length) }


/***/ }),

/***/ 6029:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

/* unused reexport */ __nccwpck_require__(4976)
/* unused reexport */ __nccwpck_require__(1412)
exports.chain = __nccwpck_require__(3660)


/***/ }),

/***/ 9478:
/***/ ((module) => {

"use strict";


module.exports = function (req, time) {
	if (req.timeoutTimer) {
		return req;
	}

	var delays = isNaN(time) ? time : {socket: time, connect: time};
	var host = req._headers ? (' to ' + req._headers.host) : '';

	if (delays.connect !== undefined) {
		req.timeoutTimer = setTimeout(function timeoutHandler() {
			req.abort();
			var e = new Error('Connection timed out on request' + host);
			e.code = 'ETIMEDOUT';
			req.emit('error', e);
		}, delays.connect);
	}

	// Clear the connection timeout timer once a socket is assigned to the
	// request and is connected.
	req.on('socket', function assign(socket) {
		// Socket may come from Agent pool and may be already connected.
		if (!(socket.connecting || socket._connecting)) {
			connect();
			return;
		}

		socket.once('connect', connect);
	});

	function clear() {
		if (req.timeoutTimer) {
			clearTimeout(req.timeoutTimer);
			req.timeoutTimer = null;
		}
	}

	function connect() {
		clear();

		if (delays.socket !== undefined) {
			// Abort the request if there is no activity on the socket for more
			// than `delays.socket` milliseconds.
			req.setTimeout(delays.socket, function socketTimeoutHandler() {
				req.abort();
				var e = new Error('Socket timed out on request' + host);
				e.code = 'ESOCKETTIMEDOUT';
				req.emit('error', e);
			});
		}
	}

	return req.on('error', clear);
};


/***/ }),

/***/ 8683:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";


var trigram = __nccwpck_require__(1286).trigram
var collapse = __nccwpck_require__(8201)
var trim = __nccwpck_require__(4065)

var has = {}.hasOwnProperty

exports.clean = clean
exports.trigrams = getCleanTrigrams
exports.asDictionary = getCleanTrigramsAsDictionary
exports.asTuples = getCleanTrigramsAsTuples
exports.tuplesAsDictionary = getCleanTrigramTuplesAsDictionary

// Clean `value`/
// Removed general non-important (as in, for language detection) punctuation
// marks, symbols, and numbers.
function clean(value) {
  if (value === null || value === undefined) {
    return ''
  }

  return trim(
    collapse(String(value).replace(/[\u0021-\u0040]+/g, ' '))
  ).toLowerCase()
}

// Get clean, padded, trigrams.
function getCleanTrigrams(value) {
  return trigram(' ' + clean(value) + ' ')
}

// Get an `Object` with trigrams as its attributes, and their occurence count as
// their values.
function getCleanTrigramsAsDictionary(value) {
  var trigrams = getCleanTrigrams(value)
  var index = trigrams.length
  var dictionary = {}
  var trigram

  while (index--) {
    trigram = trigrams[index]

    if (has.call(dictionary, trigram)) {
      dictionary[trigram]++
    } else {
      dictionary[trigram] = 1
    }
  }

  return dictionary
}

// Get an `Array` containing trigram--count tuples from a given value.
function getCleanTrigramsAsTuples(value) {
  var dictionary = getCleanTrigramsAsDictionary(value)
  var tuples = []
  var trigram

  for (trigram in dictionary) {
    tuples.push([trigram, dictionary[trigram]])
  }

  tuples.sort(sort)

  return tuples
}

// Get an `Array` containing trigram--count tuples from a given value.
function getCleanTrigramTuplesAsDictionary(tuples) {
  var index = tuples.length
  var dictionary = {}
  var tuple

  while (index--) {
    tuple = tuples[index]
    dictionary[tuple[0]] = tuple[1]
  }

  return dictionary
}

// Deep regular sort on item at `1` in both `Object`s.
function sort(a, b) {
  return a[1] - b[1]
}


/***/ }),

/***/ 4065:
/***/ ((module, exports) => {


exports = module.exports = trim;

function trim(str){
  return str.replace(/^\s*|\s*$/g, '');
}

exports.left = function(str){
  return str.replace(/^\s*/, '');
};

exports.right = function(str){
  return str.replace(/\s*$/, '');
};


/***/ }),

/***/ 4294:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

module.exports = __nccwpck_require__(4219);


/***/ }),

/***/ 4219:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";


var net = __nccwpck_require__(1631);
var tls = __nccwpck_require__(4016);
var http = __nccwpck_require__(8605);
var https = __nccwpck_require__(7211);
var events = __nccwpck_require__(8614);
var assert = __nccwpck_require__(2357);
var util = __nccwpck_require__(1669);


exports.httpOverHttp = httpOverHttp;
exports.httpsOverHttp = httpsOverHttp;
exports.httpOverHttps = httpOverHttps;
exports.httpsOverHttps = httpsOverHttps;


function httpOverHttp(options) {
  var agent = new TunnelingAgent(options);
  agent.request = http.request;
  return agent;
}

function httpsOverHttp(options) {
  var agent = new TunnelingAgent(options);
  agent.request = http.request;
  agent.createSocket = createSecureSocket;
  agent.defaultPort = 443;
  return agent;
}

function httpOverHttps(options) {
  var agent = new TunnelingAgent(options);
  agent.request = https.request;
  return agent;
}

function httpsOverHttps(options) {
  var agent = new TunnelingAgent(options);
  agent.request = https.request;
  agent.createSocket = createSecureSocket;
  agent.defaultPort = 443;
  return agent;
}


function TunnelingAgent(options) {
  var self = this;
  self.options = options || {};
  self.proxyOptions = self.options.proxy || {};
  self.maxSockets = self.options.maxSockets || http.Agent.defaultMaxSockets;
  self.requests = [];
  self.sockets = [];

  self.on('free', function onFree(socket, host, port, localAddress) {
    var options = toOptions(host, port, localAddress);
    for (var i = 0, len = self.requests.length; i < len; ++i) {
      var pending = self.requests[i];
      if (pending.host === options.host && pending.port === options.port) {
        // Detect the request to connect same origin server,
        // reuse the connection.
        self.requests.splice(i, 1);
        pending.request.onSocket(socket);
        return;
      }
    }
    socket.destroy();
    self.removeSocket(socket);
  });
}
util.inherits(TunnelingAgent, events.EventEmitter);

TunnelingAgent.prototype.addRequest = function addRequest(req, host, port, localAddress) {
  var self = this;
  var options = mergeOptions({request: req}, self.options, toOptions(host, port, localAddress));

  if (self.sockets.length >= this.maxSockets) {
    // We are over limit so we'll add it to the queue.
    self.requests.push(options);
    return;
  }

  // If we are under maxSockets create a new one.
  self.createSocket(options, function(socket) {
    socket.on('free', onFree);
    socket.on('close', onCloseOrRemove);
    socket.on('agentRemove', onCloseOrRemove);
    req.onSocket(socket);

    function onFree() {
      self.emit('free', socket, options);
    }

    function onCloseOrRemove(err) {
      self.removeSocket(socket);
      socket.removeListener('free', onFree);
      socket.removeListener('close', onCloseOrRemove);
      socket.removeListener('agentRemove', onCloseOrRemove);
    }
  });
};

TunnelingAgent.prototype.createSocket = function createSocket(options, cb) {
  var self = this;
  var placeholder = {};
  self.sockets.push(placeholder);

  var connectOptions = mergeOptions({}, self.proxyOptions, {
    method: 'CONNECT',
    path: options.host + ':' + options.port,
    agent: false,
    headers: {
      host: options.host + ':' + options.port
    }
  });
  if (options.localAddress) {
    connectOptions.localAddress = options.localAddress;
  }
  if (connectOptions.proxyAuth) {
    connectOptions.headers = connectOptions.headers || {};
    connectOptions.headers['Proxy-Authorization'] = 'Basic ' +
        new Buffer(connectOptions.proxyAuth).toString('base64');
  }

  debug('making CONNECT request');
  var connectReq = self.request(connectOptions);
  connectReq.useChunkedEncodingByDefault = false; // for v0.6
  connectReq.once('response', onResponse); // for v0.6
  connectReq.once('upgrade', onUpgrade);   // for v0.6
  connectReq.once('connect', onConnect);   // for v0.7 or later
  connectReq.once('error', onError);
  connectReq.end();

  function onResponse(res) {
    // Very hacky. This is necessary to avoid http-parser leaks.
    res.upgrade = true;
  }

  function onUpgrade(res, socket, head) {
    // Hacky.
    process.nextTick(function() {
      onConnect(res, socket, head);
    });
  }

  function onConnect(res, socket, head) {
    connectReq.removeAllListeners();
    socket.removeAllListeners();

    if (res.statusCode !== 200) {
      debug('tunneling socket could not be established, statusCode=%d',
        res.statusCode);
      socket.destroy();
      var error = new Error('tunneling socket could not be established, ' +
        'statusCode=' + res.statusCode);
      error.code = 'ECONNRESET';
      options.request.emit('error', error);
      self.removeSocket(placeholder);
      return;
    }
    if (head.length > 0) {
      debug('got illegal response body from proxy');
      socket.destroy();
      var error = new Error('got illegal response body from proxy');
      error.code = 'ECONNRESET';
      options.request.emit('error', error);
      self.removeSocket(placeholder);
      return;
    }
    debug('tunneling connection has established');
    self.sockets[self.sockets.indexOf(placeholder)] = socket;
    return cb(socket);
  }

  function onError(cause) {
    connectReq.removeAllListeners();

    debug('tunneling socket could not be established, cause=%s\n',
          cause.message, cause.stack);
    var error = new Error('tunneling socket could not be established, ' +
                          'cause=' + cause.message);
    error.code = 'ECONNRESET';
    options.request.emit('error', error);
    self.removeSocket(placeholder);
  }
};

TunnelingAgent.prototype.removeSocket = function removeSocket(socket) {
  var pos = this.sockets.indexOf(socket)
  if (pos === -1) {
    return;
  }
  this.sockets.splice(pos, 1);

  var pending = this.requests.shift();
  if (pending) {
    // If we have pending requests and a socket gets closed a new one
    // needs to be created to take over in the pool for the one that closed.
    this.createSocket(pending, function(socket) {
      pending.request.onSocket(socket);
    });
  }
};

function createSecureSocket(options, cb) {
  var self = this;
  TunnelingAgent.prototype.createSocket.call(self, options, function(socket) {
    var hostHeader = options.request.getHeader('host');
    var tlsOptions = mergeOptions({}, self.options, {
      socket: socket,
      servername: hostHeader ? hostHeader.replace(/:.*$/, '') : options.host
    });

    // 0 is dummy port for v0.6
    var secureSocket = tls.connect(0, tlsOptions);
    self.sockets[self.sockets.indexOf(socket)] = secureSocket;
    cb(secureSocket);
  });
}


function toOptions(host, port, localAddress) {
  if (typeof host === 'string') { // since v0.10
    return {
      host: host,
      port: port,
      localAddress: localAddress
    };
  }
  return host; // for v0.11 or later
}

function mergeOptions(target) {
  for (var i = 1, len = arguments.length; i < len; ++i) {
    var overrides = arguments[i];
    if (typeof overrides === 'object') {
      var keys = Object.keys(overrides);
      for (var j = 0, keyLen = keys.length; j < keyLen; ++j) {
        var k = keys[j];
        if (overrides[k] !== undefined) {
          target[k] = overrides[k];
        }
      }
    }
  }
  return target;
}


var debug;
if (process.env.NODE_DEBUG && /\btunnel\b/.test(process.env.NODE_DEBUG)) {
  debug = function() {
    var args = Array.prototype.slice.call(arguments);
    if (typeof args[0] === 'string') {
      args[0] = 'TUNNEL: ' + args[0];
    } else {
      args.unshift('TUNNEL:');
    }
    console.error.apply(console, args);
  }
} else {
  debug = function() {};
}
exports.debug = debug; // for test


/***/ }),

/***/ 5030:
/***/ ((__unused_webpack_module, exports) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({ value: true }));

function getUserAgent() {
  if (typeof navigator === "object" && "userAgent" in navigator) {
    return navigator.userAgent;
  }

  if (typeof process === "object" && "version" in process) {
    return `Node.js/${process.version.substr(1)} (${process.platform}; ${process.arch})`;
  }

  return "<environment undetectable>";
}

exports.getUserAgent = getUserAgent;
//# sourceMappingURL=index.js.map


/***/ }),

/***/ 9428:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";

const PassThrough = __nccwpck_require__(2413).PassThrough;
const zlib = __nccwpck_require__(8761);

module.exports = res => {
	// TODO: use Array#includes when targeting Node.js 6
	if (['gzip', 'deflate'].indexOf(res.headers['content-encoding']) === -1) {
		return res;
	}

	const unzip = zlib.createUnzip();
	const stream = new PassThrough();

	stream.httpVersion = res.httpVersion;
	stream.headers = res.headers;
	stream.rawHeaders = res.rawHeaders;
	stream.trailers = res.trailers;
	stream.rawTrailers = res.rawTrailers;
	stream.setTimeout = res.setTimeout.bind(res);
	stream.statusCode = res.statusCode;
	stream.statusMessage = res.statusMessage;
	stream.socket = res.socket;

	unzip.on('error', err => {
		if (err.code === 'Z_BUF_ERROR') {
			stream.end();
			return;
		}

		stream.emit('error', err);
	});

	res.pipe(unzip).pipe(stream);

	return stream;
};


/***/ }),

/***/ 3194:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";

var url = __nccwpck_require__(8835);
var prependHttp = __nccwpck_require__(6143);

module.exports = function (x) {
	var withProtocol = prependHttp(x);
	var parsed = url.parse(withProtocol);

	if (withProtocol !== x) {
		parsed.protocol = null;
	}

	return parsed;
};


/***/ }),

/***/ 6290:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

var rb = __nccwpck_require__(6417).randomBytes;
module.exports = function() {
  return rb(16);
};


/***/ }),

/***/ 9197:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

//     uuid.js
//
//     Copyright (c) 2010-2012 Robert Kieffer
//     MIT License - http://opensource.org/licenses/mit-license.php

// Unique ID creation requires a high quality random # generator.  We feature
// detect to determine the best RNG source, normalizing to a function that
// returns 128-bits of randomness, since that's what's usually required
var _rng = __nccwpck_require__(6290);

// Maps for number <-> hex string conversion
var _byteToHex = [];
var _hexToByte = {};
for (var i = 0; i < 256; i++) {
  _byteToHex[i] = (i + 0x100).toString(16).substr(1);
  _hexToByte[_byteToHex[i]] = i;
}

// **`parse()` - Parse a UUID into it's component bytes**
function parse(s, buf, offset) {
  var i = (buf && offset) || 0, ii = 0;

  buf = buf || [];
  s.toLowerCase().replace(/[0-9a-f]{2}/g, function(oct) {
    if (ii < 16) { // Don't overflow!
      buf[i + ii++] = _hexToByte[oct];
    }
  });

  // Zero out remaining bytes if string was short
  while (ii < 16) {
    buf[i + ii++] = 0;
  }

  return buf;
}

// **`unparse()` - Convert UUID byte array (ala parse()) into a string**
function unparse(buf, offset) {
  var i = offset || 0, bth = _byteToHex;
  return  bth[buf[i++]] + bth[buf[i++]] +
          bth[buf[i++]] + bth[buf[i++]] + '-' +
          bth[buf[i++]] + bth[buf[i++]] + '-' +
          bth[buf[i++]] + bth[buf[i++]] + '-' +
          bth[buf[i++]] + bth[buf[i++]] + '-' +
          bth[buf[i++]] + bth[buf[i++]] +
          bth[buf[i++]] + bth[buf[i++]] +
          bth[buf[i++]] + bth[buf[i++]];
}

// **`v1()` - Generate time-based UUID**
//
// Inspired by https://github.com/LiosK/UUID.js
// and http://docs.python.org/library/uuid.html

// random #'s we need to init node and clockseq
var _seedBytes = _rng();

// Per 4.5, create and 48-bit node id, (47 random bits + multicast bit = 1)
var _nodeId = [
  _seedBytes[0] | 0x01,
  _seedBytes[1], _seedBytes[2], _seedBytes[3], _seedBytes[4], _seedBytes[5]
];

// Per 4.2.2, randomize (14 bit) clockseq
var _clockseq = (_seedBytes[6] << 8 | _seedBytes[7]) & 0x3fff;

// Previous uuid creation time
var _lastMSecs = 0, _lastNSecs = 0;

// See https://github.com/broofa/node-uuid for API details
function v1(options, buf, offset) {
  var i = buf && offset || 0;
  var b = buf || [];

  options = options || {};

  var clockseq = options.clockseq !== undefined ? options.clockseq : _clockseq;

  // UUID timestamps are 100 nano-second units since the Gregorian epoch,
  // (1582-10-15 00:00).  JSNumbers aren't precise enough for this, so
  // time is handled internally as 'msecs' (integer milliseconds) and 'nsecs'
  // (100-nanoseconds offset from msecs) since unix epoch, 1970-01-01 00:00.
  var msecs = options.msecs !== undefined ? options.msecs : new Date().getTime();

  // Per 4.2.1.2, use count of uuid's generated during the current clock
  // cycle to simulate higher resolution clock
  var nsecs = options.nsecs !== undefined ? options.nsecs : _lastNSecs + 1;

  // Time since last uuid creation (in msecs)
  var dt = (msecs - _lastMSecs) + (nsecs - _lastNSecs)/10000;

  // Per 4.2.1.2, Bump clockseq on clock regression
  if (dt < 0 && options.clockseq === undefined) {
    clockseq = clockseq + 1 & 0x3fff;
  }

  // Reset nsecs if clock regresses (new clockseq) or we've moved onto a new
  // time interval
  if ((dt < 0 || msecs > _lastMSecs) && options.nsecs === undefined) {
    nsecs = 0;
  }

  // Per 4.2.1.2 Throw error if too many uuids are requested
  if (nsecs >= 10000) {
    throw new Error('uuid.v1(): Can\'t create more than 10M uuids/sec');
  }

  _lastMSecs = msecs;
  _lastNSecs = nsecs;
  _clockseq = clockseq;

  // Per 4.1.4 - Convert from unix epoch to Gregorian epoch
  msecs += 12219292800000;

  // `time_low`
  var tl = ((msecs & 0xfffffff) * 10000 + nsecs) % 0x100000000;
  b[i++] = tl >>> 24 & 0xff;
  b[i++] = tl >>> 16 & 0xff;
  b[i++] = tl >>> 8 & 0xff;
  b[i++] = tl & 0xff;

  // `time_mid`
  var tmh = (msecs / 0x100000000 * 10000) & 0xfffffff;
  b[i++] = tmh >>> 8 & 0xff;
  b[i++] = tmh & 0xff;

  // `time_high_and_version`
  b[i++] = tmh >>> 24 & 0xf | 0x10; // include version
  b[i++] = tmh >>> 16 & 0xff;

  // `clock_seq_hi_and_reserved` (Per 4.2.2 - include variant)
  b[i++] = clockseq >>> 8 | 0x80;

  // `clock_seq_low`
  b[i++] = clockseq & 0xff;

  // `node`
  var node = options.node || _nodeId;
  for (var n = 0; n < 6; n++) {
    b[i + n] = node[n];
  }

  return buf ? buf : unparse(b);
}

// **`v4()` - Generate random UUID**

// See https://github.com/broofa/node-uuid for API details
function v4(options, buf, offset) {
  // Deprecated - 'format' argument, as supported in v1.2
  var i = buf && offset || 0;

  if (typeof(options) == 'string') {
    buf = options == 'binary' ? new Array(16) : null;
    options = null;
  }
  options = options || {};

  var rnds = options.random || (options.rng || _rng)();

  // Per 4.4, set bits for version and `clock_seq_hi_and_reserved`
  rnds[6] = (rnds[6] & 0x0f) | 0x40;
  rnds[8] = (rnds[8] & 0x3f) | 0x80;

  // Copy bytes to buffer, if provided
  if (buf) {
    for (var ii = 0; ii < 16; ii++) {
      buf[i + ii] = rnds[ii];
    }
  }

  return buf || unparse(rnds);
}

// Export public API
var uuid = v4;
uuid.v1 = v1;
uuid.v4 = v4;
uuid.parse = parse;
uuid.unparse = unparse;

module.exports = uuid;


/***/ }),

/***/ 2940:
/***/ ((module) => {

// Returns a wrapper function that returns a wrapped callback
// The wrapper function should do some stuff, and return a
// presumably different callback function.
// This makes sure that own properties are retained, so that
// decorations and such are not lost along the way.
module.exports = wrappy
function wrappy (fn, cb) {
  if (fn && cb) return wrappy(fn)(cb)

  if (typeof fn !== 'function')
    throw new TypeError('need wrapper function')

  Object.keys(fn).forEach(function (k) {
    wrapper[k] = fn[k]
  })

  return wrapper

  function wrapper() {
    var args = new Array(arguments.length)
    for (var i = 0; i < args.length; i++) {
      args[i] = arguments[i]
    }
    var ret = fn.apply(this, args)
    var cb = args[args.length-1]
    if (typeof ret === 'function' && ret !== cb) {
      Object.keys(cb).forEach(function (k) {
        ret[k] = cb[k]
      })
    }
    return ret
  }
}


/***/ }),

/***/ 3522:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";

var path = __nccwpck_require__(5622);
var osHomedir = __nccwpck_require__(3406);
var home = osHomedir();
var env = process.env;

exports.data = env.XDG_DATA_HOME ||
	(home ? path.join(home, '.local', 'share') : null);

exports.config = env.XDG_CONFIG_HOME ||
	(home ? path.join(home, '.config') : null);

exports.cache = env.XDG_CACHE_HOME || (home ? path.join(home, '.cache') : null);

exports.runtime = env.XDG_RUNTIME_DIR || null;

exports.dataDirs = (env.XDG_DATA_DIRS || '/usr/local/share/:/usr/share/').split(':');

if (exports.data) {
	exports.dataDirs.unshift(exports.data);
}

exports.configDirs = (env.XDG_CONFIG_DIRS || '/etc/xdg').split(':');

if (exports.config) {
	exports.configDirs.unshift(exports.config);
}


/***/ }),

/***/ 1713:
/***/ ((__unused_webpack_module, __unused_webpack_exports, __nccwpck_require__) => {

const core = __nccwpck_require__(2186);
const { Octokit } = __nccwpck_require__(5375);
const github = __nccwpck_require__(5438);
const franc = __nccwpck_require__(9554);
const translate = __nccwpck_require__(6505);

// **********************************************************
const token = core.getInput('token');
const octokit = new Octokit({ auth: `token ${token}` });
const context = github.context;

async function run() {
  try {
    const { owner, repo } = context.repo;
    if (
      (context.eventName === 'issues' || context.eventName === 'pull_request') &&
      context.payload.action == 'opened'
    ) {
      const isPR = context.eventName === 'pull_request';
      let number;
      let title;
      let body;
      if (!isPR) {
        number = context.payload.issue.number;
        title = context.payload.issue.title;
        body = context.payload.issue.body;
      } else {
        number = context.payload.pull_request.number;
        title = context.payload.pull_request.number;
        body = context.payload.pull_request.number;
      }

      if (!checkIsEn(title)) {
        const { text: newTitle } = await translate(title, { to: 'en' });
        core.info(`[translate] [title out: ${newTitle}]`);
        await octokit.issues.update({
          owner,
          repo,
          issue_number: number,
          title: newTitle,
        });
        core.info(`[update title] [number: ${number}]`);
      }

      if (!checkIsEn(body)) {
        const { text: newBody } = await translate(body, { to: 'en' });
        core.info(`[translate] [body out: ${newBody}]`);
        await octokit.issues.createComment({
          owner,
          repo,
          issue_number: number,
          body: newBody,
        });
        core.info(`[create comment] [number: ${number}]`);
      }
    } else {
      core.setFailed(
        'This Action now only support "issues" or "pull_request" "opened". If you need other, you can open a issue to https://github.com/actions-cool/translation-helper',
      );
    }
  } catch (error) {
    core.setFailed(error.message);
  }
}

function checkIsEn(body) {
  const result = franc(body);
  if (result === 'und' || result === undefined || result === null) {
    core.warning(`Some error. [check: ${check}] [${body}]`);
    return false;
  }
  core.info(`[CheckIsEn] [${body} is ${result}]`);
  return result === 'eng';
}

run();


/***/ }),

/***/ 2877:
/***/ ((module) => {

module.exports = eval("require")("encoding");


/***/ }),

/***/ 7943:
/***/ ((module) => {

"use strict";
module.exports = JSON.parse("{\"Latin\":{\"spa\":\" de|os |de | la|la | y | a |es |ón |ión|rec|ere|der| co|e l|el |en |ien|ent|cho|ech|ció|aci|o a|a p| el|al |a l|as |e d| en|ona|na |da |s d|nte| to|ad |ene|con| su| pr|tod| se|ho | pe|los|per|ers| lo| ti|cia|o d|n d|a t|cio|ida|res| es|tie|ion|rso|te | in|do |to |son|dad| re| li|e s|tad|que|pro|est|oda|men|nci| po|a e| qu|ue | un|ne |s y|lib|n e|su | na|s e|ia |nac|e e|tra|or | pa|ado|a d|nes|se |ra |a c|com|nal|por|er |a s|ual|rta| o |ber|les|one|rá |des|s p|dos|sta|ser|ter|ar |era|ibe|ert|ale| di|a a|nto|l d|del|ica|hos|o e|io |imi|oci|n c|s n|ant|cci|re |e c|y l|ame| as|mie|enc| so|o s|ici|las|par|s t|ndi| cu|ara|dic|bre|una|tos|ntr|l p|s l|e a|pre|cla|o t|a y|omo|man|y a|ial|so |nid|n l|n p| al|mo |e p|s s| ig|igu|gua|uma| fu|nta|y e|soc|o p|no |ali|ten|s a|ade|hum|ran|l t|n t|s c|ria|dis|d d| ca|cas|das|ada|ido|l e|y d|tiv|vid|mbr|a i| hu|fun|und|eli|s i| ma|nda|e i| ha|uni|nad|a u|sar|s o| ac|die|qui|rac|ndo| tr|ind| me|ori|tal|odo|ari|lid|esp|o y|tic|ca |un |esa|cti|cua|ier|ta |lar|ons|ont|iva|ide|med|edi|d y|ele|nos|ist|l m|s h|ecc|sti|tor| le|seg|cie|r e|n a|ito|ios|rse|ie |o i|a o|o l|pen|tri|rim|l y|ami|lig|erá|o c|rot|ote|mat|ond|ern|n s|e h|an |ect|lo |ibr|ple|sus|us \",\"eng\":\" th|the| an|he |nd |and|ion| of|of |tio| to|to |on | in|al |ati|igh|rig|ght| ri|or |ent|as |ll |is |ed |in | be|e r|ne |ver|one|s t|all|eve|t t| fr| ha| re|s a|ty |ery|d t| pr| or|e h| ev| co|ht |e a|ng |his|ts |yon|be |ing|ce |ryo| sh|n t|fre|ree|men|her|pro|has|nal|sha|es |nat|y a|for| hi|hal|n a|f t|nt | pe|n o|s o| fo|nce|d i|er |e s|res|ect|ons|ity|l b|ly |e e|ry |an |e o|ter|ers|e i| de|cti|hts|eed|edo|dom| wh|ona|re | no|l a| a |e p| un| as|ny |d f| wi|nit| na|nte| en|d a|any|ere|ith| di|e c|e t|st |y t|ns |ted|sta|per|th |man|ve |om |nti|s e|t o|ch | ar|d o|equ|soc|oci|wit|ess|ote|ial|rea| al| fu| on| so|uni|oth| ma| ac| se|enc| eq|qua|ual|ive|lit|thi|int| st|tat|r t|t a|y o|e w|hum|uma|und|led|cia|l o|e f| is|le |f h| by|by | la|ali|are|y i|con|te | wo|eas| hu|ave|o a|com| me|ic |r a|ge |f a|ms |whe| ch|en |n e|rot|tec|tit|s r| li|o t|ple|s d|rat|ate|t f|o o|wor| fa|hou|dis|t i|nda|nde|eli|anc|rom| su|cie|no |ary|inc|son|age|at |oms|oun|nst|s w|d w|ld |n p|nta|l p|tan|edu|n s|duc|itl|tle|whi|hic|ich|ble|o s|imi|min|law|aw |gni|iti| ot|g t|eme|se |e b|ntr|tra| pu|d n|s i|act|e d|ort| he|r s|cou|unt|pen|ily| ag|ces|rit|it |din|s f|hav|ind| ed|uca|cat|ren|ien|tho|ern|d e|omm\",\"por\":\"os |de | de| a | e |o d|to |ão | di|ent|da |ito|em | co|eit|as |dir|ire|es |rei| se|ção|ade|a p|e d|s d|dad|men|nte|do |s e| pe| pr|dos| to| da|o e| o |a a|o a|ess|tod|con| qu|que| do|e a|te |al |res|ida|m d| in|er | ou|sso| re| na|a s| po|uma| li|cia| te|pro|açã|e e|ar |a d|a t|ue | su| es|ou |s p|a e|tos|des|com|ra |ia |tem|no | pa|ame|nto|e p|is |est|oda|na |s o|tra|ões|das|pes|soa|o s|s n|o p|ser|s a| à |ais| as| em|o o|e o|ber|oa |o t|ado|a c|sua|ua | no|ter|man|e s| os|s s|e n|çõe|ica|lib|ibe|erd|rda|nci|odo|nal|so |ntr|or |ura|s t|o c|ona| so| ao|hum|ual|sta|ma |ons|a n|era|e t|pre|ara|r a|por| hu|cio|o à|ria|par|ind|e c|ran|gua| um|o i|a l|s c|ndi|m a| en|und|nos|e r|ano|aci|ion|soc|oci|nid|sen|raç| ac|ndo|nsi| ig|igu| fu|fun|m o|nac|per|ali|rec|ime|ont|açõ|int|r p| al|um | me|a i|s h|nta|rio|cçã|ere|pel|l d|a o| ex|pri|uni|ese|ada| ma|ant|ide|nda| fa|am |e f|lid|io |ém |ita|iva|omo|o r|esp|a f|m p|lic|ca |s f|naç|pod|ode|ver|a q|r e|tad|tiv|vid|e l|o q|r d|e i|seu|eli|mo |ecç|s i|ial|ing|ngu|s l| vi|ist|ta |eci|ênc|a m| ca|der|ido|ios| un|dis|cla|qua|se |ati|sti|r o|sid|roc| tr|sem|o n|ao |dam|ens|tur|ico|rot|ote|tec|sse|l e|ena|for| pl| ni|nin|gué|uém|não|ela|tro|ros|ias\",\"ind\":\"an |ang| da|ng | pe|ak | ke| me| se|ata|dan|kan| di| be|hak|ber|per|ran|nga|yan|eng| ya| ha|asa|men|gan|ara|nya|n p|n d|n k|a d| at|tan|at |ora|ala| ba|san|erh|ap |ya |rha|n b| ma|a s|pen|g b|eba|as |aan| or|ntu|uk |eti|tia|tas|aka|set|ban|n s| un|n y| te|ter|iap|tuk|k m|beb|bas|lam| de|n m|k a|keb|am |i d|ama|unt|ah |dal|end|n h|p o|den|sa |dak|mem|ika|ra |ebe|pun|ri |nda|ela|ma | sa|di |a m|n t|k d|ngg|n a|tau|asi| ti|eri|gar|man|ada|al |um |un |ari|au |lak|a p|ta |a b|ngs|ole| ne|neg|dar|ers|gsa|ida|leh|ert|k h|ana|sam|sia|i m|ia |dap|era|dil|ila|tid|eh |h d|atu|bat|uka|aha|a a|ai |g d|lan|tu |t d|uan| in|ena|har|sem|ser|kat|erl|apa|erb|uat|na |kum|g s|ung|nan|emp|rta|l d|mas|ega|n u| hu|ka |eni|pat|mba|adi| su|aga|ent|nta|huk|uku|rga|ndi|ind|i s|ar |sua|aku|rus|n i|ni |car|si |nny|han| la|in |u d|lah|ik |gga|ua |ian|ann|lai|usi|emb|rik|mer|erk|arg|emu|dun|dip|nas|lua|aru|ema|a u|min|mat|aya|kes|rak|eka|a t|rka|a k|iba|rbu|rma|yat|ini|ina|anu|nus|mua|s p|ut |lin| ta|us |ndu|da |pem|ami|sya|yar|nak|das|k s|kel|ese|mel| pu|ern|a n|aik|uar|t p|g p|ant|ili|dik| an|tin|ing|ipe|tak|iny|ain| um| ja|aks|sar|rse|aup|upu|seo|eor|g m|g t|dir|pel|ura|bai|aba|erd|eca|h p|kep|m m|jam|umu|mum\",\"fra\":\" de|es |de |ion|nt |et |tio| et|ent| la|la |e d|on |ne |oit|le |e l| le|s d|t d|ati|e p|roi|it | dr|dro| à | co|té |ns |te |e s|men|re | to|tou| l’|con|que|les| qu| so| pe|des|son|ons|s l| un| pr|ue |s e| pa|e c|ts |t l|onn| au|e a|e e|eme| li|ant|ont|out|ute|ers|res|t à| sa| a |ce |per|tre|a d|er |cti| en|ité|lib| re|en |ux |lle|rso| in| ou|un |à l|nne|nat|une|ou |n d|us |par|nte|ur | se| d’|dan|ans|s s|pro|e t|s p|r l|ire|a p|t p|its|és |ond|sa |a l|nce|é d| dé|nal|aux|omm|me |ert| fo| na|iqu|ect|ale| da| ce|t a|s a|mme|ibe|ber|rté|s c|e r|al |t e| po|our|com|san|qui|e n|ous|r d| ne|fon|au |e o|ell|ali|lit| es| ch|iss|tes|éra|air|s n| di|ter|ui | pl|ar |aut|ien|soc|oci|tra|rat|êtr|int|été|pou|du |est|éga|ran|ain|s o|eur|ona|rs |anc|n c|rai|pri|cla|age|nsi|e m|s t| do|bre|sur|ure|ut | êt| ét|à u|ge |ess|ser|ens| ma|cia|l e| su|n p|a c|ein|st |bli| du|ntr|rés|sen|ndi|ir |n t|a s|soi| ég|ine|l’h|nda|rit| ré|t c|s i|il |l’a|e q| te|é e|t s|qu’|ass|ais|cun|peu|ée |tat|ind|t q|u d|n a| ac|tés|idé|l n|ill| as|’en|ign|gal|hom|nta| fa|lig|ins| on|ie |rel|ote|t i|n s|sse| tr|n e|oir|ple|l’e|s é|ive|a r|rec|nna|ssa| mo|s u|uni|t ê|pré|act| vi|era|sid| nu|e f|pay|’ho|cat|leu|ten|rot|tec|s m\",\"deu\":\"en |er |der| un|nd |und|ein|ung|cht| de|ich|sch|ng | ge|ie |che| di|die|ech|rec|gen|ine|eit| re| da|ch |n d|ver|hen| zu|t d| au|ht | ha|lic|it |ten|rei| be|in | ei| in| ve|nde|auf|ede|den|n s|zu |uf |ter|ne |fre| je|jed|es | se| an|n u|and|sei|run| fr|at |s r|das|hei|hte|e u|ens|r h|nsc|as |nge| al|ere|hat|men|lle|nte|rde|t a|ese|ner| od|ode| we|g d|n g|all|t u|ers| so|d d|n a|nen|te |lei| vo|wer| gr|ben|ige|e a|ion| st|ege|le |cha| me|ren|n j|haf|aft| er|erk|bei|ent|erd| si|kei|tig|eih|ihe|r d|len|on |n i|lun| gl|chu|e s|ist|st |unt|ern|tli|gem|ges|ft |ati|tio|gru|end|ies|mit|eic|sen|r g|e e|ei | wi|n n| na|sta|gun|ite|n z|r s|gle|chl|lie|mei|em |uch|nat|n w|urc|rch|de |hre| sc|sse|ale|ach|r m|des|n e|spr|t w|r e|d f| ni| du|dur|nie| mi|ied|fen|int|dar|e f|e g|geh|e d|f g|t s|ang|ste|hab|abe|h a|n v|alt|tz |hli|sic|her|nun|eme|ruc|taa|aat|he |e m|erf|ans|geg| is|tun|pru|d g|arf|rf |n o|ndl|ehe|e b|h d|d s|dig|arb|wie|r b| ih|r w|nsp|ber|t i|r a|r v|igk|gke|bes|n r|str|gew|rbe|ema|e v|n h| ar|rt |ind|n f|ins|esc|ieß|ken|ger|eru|ffe|ell|han|igu|man|sam|t g|ohn|hul|rst|tra|rli|lte|hut|utz|ls |ebe|von|r o|e i|nne|etz|d a|rn |isc|sel| fa|one|son|et |aus|r i|det|da |raf|iem|e z|lan|sow\",\"jav\":\"ng |an |ang| ka|ing|kan| sa|ak |lan| la|hak| ha| pa| ma|ngg|ara|sa |abe|ne | in|ant|n k| ng|nin|tan|nga| an|ata|en |ran|man| ba|ban|ane|ong|ra |n u|hi |nth| da|ake|ke |thi|ung|uwo|won|ngs| uw|asa|ben|gsa|sab|ana|aka|beb|nan|a k|nda|g p|adi|at |awa|san|ni |pan| be|dan|eba|g k|e k|ani|bas|g s|dha|aya| pr|gan|mar|di |ya |wa |g u|n s|ta |a s| wa|arb|e h| na|a n|a l|n p|a b|yan| ut|n n|ah |asi| um|g d|as |han|g n| tu|dar|rbe|wen|ggo| di|dak|mat|sar|eni| un|und|iya|a a|k h|kab|ka |be |uma|art|ora|ngk|i h|ala|rta|n b| or|n m|gar|kar|yat|al |g b|na |a m|n i|ega|ina|kak|g a|pra| ta|gge|ger|ena|kat|kal|a p|i k|tum|oni|nya| ne|adh|g m|duw|uwe|dad|kas| pe| si|aga|uta|k k|pa |and|nun|i l|ngu|go |nal| ke|n a|uju|anu|ama|a d|i p|t m|er | li|per|iba|min|sak|apa|war|ha |pad|ggu|gay|ras|taw|ind|eng|a u|we | bi|n l|ali|awi|neg|awe|bak|g t|e p|ndu|bis| ku|ih |ase| me|iji|pri|bad|eh |i t|uwa|ron|ndh|mra|ar | pi|ur |isa|mba|sin|aba|g l|ebu|n t|ika|men|ini|lak|a w|arg|ku |ami|ayo|a i|nas|liy|e s| we|rib|ngl| ik|k b|e d|rga|rap|tin| lu|aku|bed|k a|h k|yom| as| nd|eka|il | te|umu|rak|ut |dil|i w|i s|jin|kon|jud|wae|ae |kap|uha|uto|tow|gka|umr|n d| ti|eda|gon|ona| mi|ate|mum|um |but|r k|wat|si |k p|k l|gaw\",\"vie\":\"ng |̣c |́c | qu| th|à |nh | ng|̣i | nh| va|và|̀n |uyê| ph| ca|quy|yề|ền|̀i | ch|̀nh| tr| cu|ngư|i n|gươ|ườ|ời|́t | gi| co|ác|̣t |ó |c t|ự |n t|cá|ông| kh|ượ|ợc| tư| đư|đươ|iệ|ìn|́i | ha| đê|i đ|có|gia| mo|mọ|ọi|như|pha|n n|củ|ủa|̉a |̣n | ba|n c|̀u |̃ng|ân |ều| bi|hôn|ất|tự|g t| vi|n đ|đề|t c| la| ti|nhâ| đô|u c|hiê|bả|ên | tô|hân| do|do |́ q|ch |̀ t| na|́n |ới|ay | hi|àn|̣ d| đi|g n|hay|há| mô|ội|hữ|uố|ốc|n v|̣p |́p |quô|thư| ho|nà|ị |́ch|̀ng|ào|̀o |̉n |ôn |i c| hô|c đ|i v|khô|c h|i t|g v| đa|mộ|ột|́ng|tro|ữn|ướ|ia |̣ng|ản|̉ng|h t|hư |ện|ộc|g c|ả | đo|̉ c|là|c c|n h|n b|hà|iế|̣ t| cô| vê|ức|t t|ã |hộ| vơ|iên|g đ|̉i | bâ|̀y |ớc|a c|̉m | sư|áp|ật|viê|vớ|hươ|tha|ực|h v|ron|ong|g b|qua|iá|̀ c|ể |h c|a m|ế |uậ|ảo|̉o |sự|o v|cho|phâ|n l| mi|hạ|côn|o c|̃ h| cư|ục|̀ n| hơ|i h|c q|á |ại|bị|cả|c n| lu|ín|h đ| xa|g h|độ|bấ| nư|m v|thô| tâ|tộ|hả|oà|áo|́o |ốn|ệ |thu|mì| du|̣ c|xã|c p|ải| hư|́ c|ho |y t|o n|n p|ở |hứ|iể|y đ|hấ|ối|chi|án|ề |́ t|ệc|cũ|ũn|tiê|hợ|ợp|o h|hoa|ày|ai |ết|̉ n|c b|đó| đâ|luâ|đố|kha|về|̉ t|c l|̀ đ|i b|nươ| bă|dụ|họ| ta|thê|tri|hí|́nh|g q|p q|n g|o t|c g|hự|yên|i l|́u |an | cơ\",\"ita\":\" di|to |ion| de| in|la |e d|ne |di | e |zio|re |le |ni |ell|one|lla|a d|rit|o d|itt|del| co|dir|iri|ti |ess|ent| al|azi|tto|te |i d|i i|ere|tà | pr|ndi|e l|ale|ind|o a|e e|gni|e i|nte|con|li |a s| un|i e|ogn|men|uo | og| ne|idu|ivi|e a|div|vid|duo| ha|tti| es|a p|no | li|za |pro|ato|all|sse|per|ser| so|i s| la| su|e p| pe|a l|na |ibe|ali| il|il |e n|lib|ber|e c|ia |ha |che|e s|o s|o e| qu|in |nza|ta |nto| ri|he |o i|oni|sta| o | a |o c|nel|e o|naz|so |o p|o h|gli| po|i u|ond|i p|ame|ers|i c|ver|ro |ri |era|un |lle|a c|ua | ch|ssi|una|el |i a|ert|rtà| l |a a|tat|ant|dis|ei |a e| si| ad|à e|nal| da| le|est|pri|nit|ter|ual| st|ona|are|ità|dei|cia|gua|anz|tut| pa|al | ed| re|sua|ono| na|uni|raz|si |ita|com|ist|man|ed |der|ad |i o|enz|soc|que|res| se|o o|ese| tu|i r|io |ett|à d|on |dic|sia|rso|se |uma|ani|rio|ari|ial|eri|ien|ll |oci|rat|tra|ich|pre|qua|do | um|a t|i l|zza|sci|tri|er |ico|pos|a n|ara|o n|son|att| fo|fon|nda|utt|par|nti|sti|nes|n c| i |chi|hia|iar|int|sen|e u|str|uzi|ati|a r|rop|opr|egu| me|ra |ann| ma| eg|ost|bil|isp|ues| no|ont|rà |tta|ina|ezz|l i|tal| ra|gio|nno|a i|d a|i m|ria| cu|ore|e r|izi|dev|tan|lit|cie|non|sso|sun|ite|ica|l d|ide|lia|cos|i n|nta|a f| is|l p|art\",\"tur\":\" ve| ha|ve |ler|lar|ir |in |hak| he|her|bir|arı|er |an |eri| bi|ya |r h|ak |ın |eti|iye|ası| ka|yet| ol|tle|ını|ara|eya|akk|kkı|etl|sın|na |esi|de |ek | ta|nda|ini| bu|rın|ile|vey|kla|rin|ne |e h|ır |ine|e k|ına|sin|dır|ere| sa|n h|ama|ınd|nın|mas| ge|le |ı v| va|erk|rke|lma|nma|lan| te|tin|akl|rle|nin|en |e m|ard|a v|ill| de|let|da |k h| me|aya| şa|k v| hü|riy|e b|kın|nı |et |dan|san|e d|var|rdı|kes|si |mil|e a| il|hür|ana|ret|dir| se|şah|mes|irl| mi|ola|bu |ürr|rri|n e|n i|kı |n v|mek| ma|mak|lle|lik|nsa|li |ı h| iş| ed| iç|n b|kar| ba|ala| hi|eli|ulu|a h|eme|re |e s|ni |e t|n k|a b|iş |rak|evl|e i|etm|ik |r ş|ar | eş|olm|un |hai|aiz|izd|zdi|im |dil|n t|nde| gö|ilm|lme|tir|mal|hiç|e g|unm|ma |ele|a i|e e|eşi|şit|ık |mel| et| ko|n s|ahs|i v|sı | an|el |yla|la |ili|r v|rı |anı|ede|ket| ya|lun|may|se |ins|tim|edi|siy|t v|içi|çin|a k|nla|r b|miş|i b|yan|ame|tme| da|bul|mem|eml|eke|mle| ki| ke|lek| in| di|din|uğu|n m|it |ser|ind| mü|arş|rşı|es |ger|a s|len| ay| ku|vle|erd|eye|ye |oru|nam|ken| uy|a m|ün |r a|i i|tür|i m|kor| so|al |hsı|cak|rme|nun|lam|eni|dev|rde|ri |mey|a d|i o|kim|ims|mse|end|ndi|rek|ahi|il |hay|lık|e v|iç |sız| öğ|öğr|ğre| bü|büt|ütü|tün|anl|alı|şma|k g|at |den|i s\",\"pol\":\" pr|nie| i |ie |pra| po|ani|raw|ia |nia|go |wie| do|ch |ego|iek|owi| ni|ści|ci |awo|a p|do | cz|ośc|ych| ma|ek |rze|prz| na|wo | za| w |ej |noś|czł|zło|eni| je|wa |łow|i p|wol|oln| lu|rod| ka|wsz| wo|lno|y c|ma |każ|ażd|ny |dy |o d|stw|owa|żdy| wy|rzy|ecz|sta| sw|e p|twa|czn|dzi|i w|szy|zys|na |ów |lub|ub |a w|k m|est| sp|kie|wan|ają| ws|pow|e w|spo|nyc|pos|rac|a i|cze|yst|ać |neg|sze|ne |mi |aro|ńst| ja|jak|o p|pod| z |acj|obo| ko|i i|nar|i n| ro|awa| ró|zy |dow|zen|zan|zne|zec|jąc|iej|cy |rów|nej|odn|nic|czy|o s|no |ony|aw |i z|ówn|odz|jeg|o w|edn|o z|aki|o o|a s| st|ni |bez|owo| in|ien|eńs|ami| or|dno|zie|mie| ob|kol|stę|tęp|i k|ez |w c|poł|ołe|łec|ym |orz|jed|o u| os|olw|lwi|wia|ka |owy|owe|y w| be|o n|jes|wob|wyc|a j| od|zna|inn|zyn|aln|któ|cji|ji |się|i s|raz|y s|lud| kr|ją |cza|zes|nik|st |swo|a o|sza|ora|icz|kra|a z|h p|i o|ost|roz|war|ara|że |lni|raj| si|ię |e o|a n|em |eka|stk|tki|pop|ą p|iec|ron|kow|odo|w p|peł|ełn|ran|wni|dni|ows|ech|gan|dów|zon|pie|a d|i l| kt|tór|ini|ejs| de|dek|ywa|iko|z w|god|ków|adz|dst|taw| to|trz|e i|ich|dzy|by |bod|iu |nan|h i|chn|zeń|y z|ano|udz|ieg|w z|ier|ale|a k|z p|zaw|ekl|kla|lar|any|du | zw| go|o r|to |az |y n|ods|ymi|ju |och|nau|wej|i m\",\"gax\":\"aa |an |uu | ka|ni |aan|umm|ii |mma|maa| wa|ti | fi|nam|ta |tti| na|saa| mi|fi |rga|i k|a n| qa|dha|iyy|oot|mir|irg|in |raa|qab|a i|kan|a k|isa|chu|akk|amu|aba|a f|huu|kam| ta|kka|amn|ami| is|a a|mni|att| bi|yaa|ach|yyu|yuu|ee |miy|wal|waa|ga |aat|ata|a e|tii|oo | ni| ee|moo|ba |ota| ak|a h| ga|i q| dh|daa|a m|haa|ama|i a|a b|yoo|ka |kaa| hi|aas|sum|u n| uu|arg| hu|man| ha| ar| ke| yo| ba|ees|i i|taa|uuf|uf |ada|iin|i f|rra|ani|a w|i w| ad|da |nya|a u|irr|na |hun|isu|hin| ma| ho|ess|und|i m|i b|bar|is |een|ana|mu |bu |i d| sa|f m|add|sa |eeg| ir|i h|n h|u a|aad| la|al |ala|udh|ira|hoj|kee|goo| ya|ook|abu|gac|mum|as |itt|nda|see|n t|n i|uum|n k|ra |rgo|ara|a q|ums|muu|mat|a d|nii|sii|ssa|ati|a g|asu|biy|yya|eef|haw| da| mo|tum|a t|u h|gar|uma|a s|n a|n b|baa|awa|nis|eny|u y|roo|mmo|gam|sat|abs|n m|tee|nna|eer|bir| ku| qo|bil|ili|lis|otu| to|kko|n w|ali|rum|msa|rka| fu|amm|gaa|aaf|era|ya | ye|yer|ero|oti|kun|un |jii|ald|i y|ant|suu|n d|tok|okk|ame|mee|nni|tan| am|lii|n u|aru|lee|gum|ddu|i g|u m|oji|ura|lda|lab|ila|laa|aal|n y|ef |chi|uud| qi|qix|dar|ark|dda|gal|u b| ji|jir|han|art|arb|asa|ega|tam|hii|ffa| se| bu|faa|ndi|n g|bat|oka|kar| mu|mur|aja|uun|naa|sad|a l|lam|ken|enn|u f|egu\",\"swh\":\"a k|wa |na | ya| ku|ya | na| wa|a m| ha|i y|a h|a n|ana|ki |aki|kwa| kw|hak| ka| ma|la |a w|tu |li |a u|ni |i k|a a|ila| ki|ali|a y|ati|za |ifa|ili| mt|ke | an|kil|kat|mtu|ake|ote|te |ma |ika|ka |we |a s|yo |i n|fa |ata|e k|ama|zi |u a|amb|ia |kut|ina|u w|azi| yo|i z|asi| za|o y|au |yak|uhu|ish|tik|ha |wat| au|u k|e a|mba|hur| bi|ara|sha|uru|mu | as| hi|u n|hi |ru |tai|aif|a b|hal|ayo|cha| uh|i h|yot| ch|awa|chi|atu|e n| zi|u y|ngi|mat|shi|ani|e y|sa |eri|ja |uli| am|ele|i a|end|o k| sh|ima|ami|oja|a t| ta| nc|nch|any|a j|ham|wan|ada|uta|i w|iki|ra |moj|ii |ari|kuw|uwa|ye | la| wo|o h| sa|ti |wak|she|iwe|kan|nay|eza|iri|iwa|fan|bu |i m|uto|lim|ao |her|ria|wen|kam|di | ja|jam| ni|ing|a l|wot|bin|amu|dha|o w|ahi|kaz|zo |da |adh|si | hu|ri |bil|e m|aka|e w|ang|ini|agu|sta|a z|kup|kul|lin|ind|ne |aji|zim|nya|kus|har|nye|asa|nad|dam|rik|iyo| ba|bar| nd|nde|ita|ta |gin|ine|uu |mwe|maa|ndi|kuf|o n|u h|i s|uzi|nga| ye|tah|sil|imu| ut|azo|esh|uni|taa|aar|rif|hii|wez|uba|wam|ush|mbo|bo |ibu|lez|wal|saw|kos|e b|a c| si|aza|tok|oka|tak|eng|dhi|ala|hir|yan|izo|ten|guz| mw|liw|ndo|oa |laz|aha|uku|ian|eli|mam|ua |ndw|zin|aba|pat|del|i b|ufu|nda|a i|mai|ais| um|man|ba |u m|kuh|zwa|sia|tan|taw|e i\",\"sun\":\"an |na |eun| ka|ng | sa|ana|ang| di| ha|ak |nga|hak|un |ung|keu| ba|anu| an|nu |a b| bo| je|a h|ata|asa|jeu|ina| ng|ara|nan|gan|sa |a k|awa|ah | na|n k|kan|aha|ga |a s|a p|ban| ma|a n|bog|oga|ing|sar| ku| pa|man|a a|ha |san|bae|ae |din|g s|sah|tan|aga|ra | si|ala|kat|n s| pe|ma | ti|per|aya|sin| te| pi| at|n a|aan|pan|lah|gar|n n|u d|ta |eu |kum|ari|ngs|ran|a d|n d|n b|gsa|a m|wa |ama|ku |ike|taw|n p|k h|al | ja|eba|bas|a t|at |ika|beb|asi|atu|pik|kab|una|nda|a j|e b|n h|nag|oh |aba|en |ila|g k|boh|aku|ngg|art|rta|abe|ar |ima|n j|um |di |usa|udu|geu|k a|adi|ola|sak|aca|u s|rim| ay|car|h k|aka|eh |teu|tin| me| po|ti |awe|ngt|sac|jen|u a|uma|ent|k n|gaw|law|dan|uku|ur |teh|h s|bar|aru|ate| hu|nar|n t|jal|aja|dil|ere|iba|ieu|pol|nya|ut |wan|are|mas|ake|upa|pa |yan|huk| so|nus|ngk| du|ura|tun|ya |mpa|isa|lan| ge| mi|u m|kal|uan|ern|tut|tay|h b|hna|kaw|kud|us |und|ena|n m|han|nte|lak| ie|ula|ka | ke|rup| tu|u k| nu|g n|umn|mna|h p|g d|u n|gta|ayu|yun|mba|gam| be|du | ta| wa|wat|eus|a u|ren|umu|i m|ri |eri|rik|u p|dit|ali|h a|k k|k d|ngu|rua|ua | da|amp|men|sal|nge| ra|sas|nas|ona| bi|ame|sab|alm|lma|ami|min|il |kas|ter|mum|rak|mer|ksa|k j|yat|wil|mar|eur|g b|war|gal|kaa|we |tur|e a|r k\",\"ron\":\" de|și | și|re | în|are|te |de |ea |ul |rep|le |dre|ept|e d| dr|ie |e a|ate|în |tul|ptu| sa| pr|e p|or | pe|la |e s|ori| la| co|lor| or|ii |rea|ce |tat|au | a |ați| ca|ent|ale| fi|ă a| ar|a s|ice|per|ers|uri| li|a d|al |ric| re|e c|e o|nă |i s|ei |tur|men|con| să|lib|ibe|ber|să |rso|tăț|ilo| ac|sau|pri|ăți|i a|i l|l l|car| in|ter|ție|lă |că |tea|a p|ții|soa|oan|ri |nal|in | al|e ș|i î|ril|ană|pre|ui |uni|e f|se |ile|ere|i d|ita| un|ert|e î|a o|ia |i c|fie|ele|ace|i ș|nte|tă |pen|ntr| se|a l|pro| că|ire|ală|eni|est| ni|ă d|lui|a c| cu|n c| nu|ona|sal| as|eri|naț|ând|ră | om| su|ecu|i p|rin|e n|ici|i n|nu |oat|inț|ni |tre| to|tor|ări|soc|oci|ste| na|iun| di| po|l d|va |ega|gal| tr|ă p|ulu|n m|ă î|a a|rec|res|i o| so|fi |sta|sa |uie| au|lit| ce| mo|din|ces|nic|int|nd |i e|cla|ara|ons| îm| eg|a î|rel|e l|ial|i f| fa|ță |leg|e e|tar|ra |ă f|a f|rar|iei|nit|ă c|tru|ru |u d|act|at |rtă|ți |nta|nde|eme|ntu|ame|reb|ebu|bui|toa|l c| o |ion|ă ș|dep|ali|ât |ili|ect|ite|i i|pli|n a|dec|rta|cu |împ|cți|ane|e r|văț|nt |u c|ța |l ș|cia|țio|ită|bil|r ș|poa|ca | st|t î|tri|riv|man|ne |omu|rie|rit|înv|nvă|ăță|mân|mod|od |rot| ma|cur|u a|oar|uma|a ș|rii|era| ex|tra|iil|ani|țiu|lic|t s|nța|eze|ta | va\",\"hau\":\"da | da|in |a k|ya |an |a d|a a| ya| ko| wa| a |sa |na | ha|a s|ta |kin|wan|wa | ta| ba|a y|a h|n d|n a|iya|ko |a t|ar |ma | na|yan| sa|ba |asa| za| ma|hak|a w| ka|ata|ama|akk|i d|a m| mu|su |owa|a z|iki| ƙa|nci|a b| ci|ai | sh|kow|anc|nsa|a ƙ|a c| su|shi|ka | ku| ga|ne |ani|ci |e d|kum|uma|‘ya|cik| du|uwa|ana| ‘y|i k|ali|ɗan| yi|ada|ƙas|aka|kki|utu|n y|hi |a n| ad| do| ra|mut|tar| ɗa| ab|nda|a g|man|nan|ars|cin|ane|and|n k|min|yi |i a|ke |sam|ins|a i|nin|yin|ki |tum|ni |aɗa|ann|e m|ami|dam|za |en |kan|um |yar|mi |duk|oka|n h| ja|dai|kam|ewa|mat|i y|nna|abi|ash|n s|waɗ|ida|am |re |ga |sar|kok|oki|una|mas|ra |i b|dun|uni|abu|a ‘| ƙu|n j|awa|ce |a r|e s|ara|a ɗ|san|li |aba|cew|she|ƙun|kar|ari|m n|niy| ai|aik|u d|kko|buw|n w| la| ne|rsa|zam|omi|rin|hal|bub|ubu|aya|a l|han|ban|o n|are|add|i m|zai| hu|me |bin|tsa|sas|i s|ake|n ‘| fa|kiy|n m|ans|dom| ce|r d|uns|ƙar| an|jam|ɗin|i w| am|n t|wat|ika|yya|nce|har|ame|gan|hen|n b|n ƙ|dok|fa | ki|yak|ray|abb|din|on |bay|aid|ayi|aci|dan|aur|ili|u k| al|rsu| ts|ukk|kka|aye|nsu|ayu|bba| id|ant|n r|o d|sun|tun|unc|sha| lo|lok|kac|aif|fi |gam|aga|un |lin|aɗi|yuw|aja|fan|i i|ace|uka|n i|war|riy|imi|sak| ir|yay|tab|bat|mar| iy|sab|nta|afi|o a| ak|bi \",\"fuv\":\"de | e |e n|nde| ha|la |e e|akk| ka| nd|ina| wa|al |hak|na | in|ndi|ɗo |kke|ii |di |aad|ade|um |ko |i h|ala| mu| ne|lla|ji |wal| jo|mum| fo|all|neɗ|eɗɗ| le| ko|e h|kal|taa|re |aaw| ng|e k|aa |e w|ee |ley|jog|ke |e m|laa|nnd|eed|e l|ɗɗo|aag|ol | ta|o k|kee|gu |ti |dee|a j|ogi|waa|m e|am |le |eji|ond|nga|gal| wo|ɓe |ɗe |e d|awa|gii|ede|eej| re|gol|aan| go|agu|i e|oti|ann|fot|eyd|e t|ɗee|naa|oto|ydi| po|pot|maa| he|een|i n|enn|ni |taw|a i|e j|e f|a k|goo|to |dim|der|ele| aa|o n| de| fa| ba|ngu|oot|er |dir|won|oor| sa|ngo|ka |ndo|i k|a n|ay |ota|a f|ima|e ɓ| to|i f|a e|tee|ren| ja|i w|wa |o f|fof|ore|eyɗ|yɗe|a w|too|ma |o t|awi|i m|kam|o e|hay|and|nan|ñaa|e y|of |eel|e s|hee|aak|nka| do|l e|e g|ira| la| so| ɓe|a t|dii|e i| te|tin|e r|e p|o w|ani|aar|are| na|ral| ña| yi|awo| ya|so |aam|i l| ho|oo |ooj|nng|nge|woo| ma|faw|kaa| mo|u m|und|dow|gaa|en |o i| li|lig|igg|e a|ita|e b| o | nj| mb|o h|nda|ude|ɗi | no|haa|a h| fe| di|iin|iti|tii|yan| tu|tuu|inn|ama|baa|iiɗ|den|tal|aaɗ|yim|imɓ|njo|edd|ine|nee| je|jey|lli|lit|uug|ugn|no |bel|go | hu|ank|je |do |guu| da|mii| ke|a d|ano|non|l n|y g| ɗu|gna|mɓe|ete|i a|wit|jaŋ|aŋd|ŋde| su|alt| ɗe|nna|a a| ɓa|ɓam|amt|tde|ago|l h|m t|ind|ɗɗa|aga|eɗe|ow \",\"bos\":\" pr| i |je |rav| na|pra|na |da |ma |ima| sv|a s|nje|a p| da| po|anj|a i|vo |ko |ja |va | u |ako|o i|no | za|ju |e s| im|avo|ti |sva|ava|o n|i p|li |ili|i s|ost|van|vak| ko|ih |ne |a u| sl|nja|jed| ne| dr|koj|ije|i d| bi|stv|im |u s| il|slo|lob|obo|bod| je| ra|pri|sti|vje| ob|a d|om |se | su|e i|a n| se|i i|dru|enj| os|a b|e p|voj|cij|u p|o d|a o|raz|su |i n|uje|ova|u i|edn| nj| od|i u|u o|lo |ran|lju|ni |jen|ovo|aci|iti|o p|a k|oje|žav|nos|dje|e o|bra|pre|a j|pro|ji |i o| ka|nih|bit|jeg| tr|tre|bud|u z|og |sta|drž|rža|e d|u n|pos|mij|elj|svo|reb| bu|avn|jem|ija|e b|ći |aro|rod|red|ba |a z|šti|ka |de |em |aju|iva|lje|ve |e u|jel|jer|bil|ilo| iz|eni|du | do| st|a t|za |tu |nar|tva|odn|gov| sa|nim|m i|e n|vim| ni|u d|o k|oji| sm|dna|ući|ist|i m|eba|ičn|vno| dj|oda|nak|e k|an |nov|sno|stu|aln|nst|eno|eđu|čno|ani|nom|olj|tiv|nac|ave|i b|smi|čov|ovj|osn|a r|nap|ovi|ans|dno|jan|nju|oja|nog|m s|edi|ara|oj |nu |kri| kr|odu|iko|lja|sto|rad|nik|tup| čo|jek|tvo| vj| mi|tel|obr|živ|tit|una|ego|pod|sam|o o|rug| op|nji|din| mo|vu | ov|h p|udu|riv|dst|te | te|a č|vni|svi|i v|ina|i t|ite|o s|u u|m n|zaš|ašt|itu|ak |dni|nic|nič|odr|vol|avi|g p| ta|rim|kla|e t|ao | vr|akv|tno|mje|duć|ona|ada|obi|eds\",\"hrv\":\" pr| i |je |rav|pra|ma | na|ima| sv|na |ti |a p|nje| po|a s|anj|a i|vo |ko |da |vat|va |no |o i| za|ja |i s|avo| im|sva| u |i p|e s| bi|tko|ju |o n|li |ili|van|ava| sl|ih |ije| dr|ne |ost|jed| ne|u s|ova|nja| os| da| ra| ko|slo|lob|obo|bod|atk|i d|koj|iti| il|stv|pri|im |om | ob| je| su|vje|i u|i n|e i|i i| ka|bit|dru|ati|se |voj|i o|a b|a o|ćen|ući|a n| se|o p|enj|edn|a u|sti| mo|ćav|lo |dje|raz| od|ran|u p|rod|a k|ni |su |mij|u i|svo|ako|a j|aro|drć|rća|pos|eno|e p|pre| nj|e o|ćiv|nar|ji |oje|e n|eni|nih|oda|ći |nov|bra|ra |nim|a d|avn|og |aju|iva|ovo|nos|i b|bil|sno|za |ovi|red|tva|a z|mor|ora|ka |sta|jem|pro|jen|u o|cij|ve |e d|jel|jer|ilo| do|osn|i m|odn| iz|nom|lju|em |lje| ni|aci|oji|o d|du | st|nit|elj|u z|jeg| sa|o o|m i|vno|vim|uje|e b|oj | dj|rad| sm|dna|nak|e k|an |stu|o s|tit|tu |aln|nst|eću|dno|gov|ani|juć|u d|m s|e u|a ć|u u|nju| bu|bud|te |ćov|ovj|tvo|a r|nap|šti|ist|ću |ans|m p|jan|nić|olj|u n|edi|ara|nu |o k|udu|ona|smi|odu|ada|oja|tup| ćo|jek| vj|ina| mi|tel|i v|obr|zaš|ašt|una|dni|ija|pod|sam|duć|rug| op| ta|nji|e m|oso|sob|h p|itk|svi|ite|elo|itu|meć|jim|odr|di |vol|avi|nog|štv|rim|din|kla|će |ao |tno| ći|kak|akv|ave|nac|lja|sto|obi| te|to |vi |ovn|vni|odi|lji\",\"nld\":\"en |de |an | de|van| va| en| he|ing|cht|der|ng |n d|n v|et |een|ech| ge|n e|ver|rec|nde| ee| re| be|ede|er |e v|gen|het|den| te|ten| op| in|n i| ve|lij| zi|zij|ere|eli|ijk|oor|ht |te |ens|n o|and|t o|ied|ijn| on|ke |op |eid| vo|jn |id |ond|in |sch| vr|n z|rde|aan| ie|aar|ren|men|rij|hei|ord|hte|eft| we|ft |n g|n w|or |n h|eef| me|wor|vri|t r|hee|al |le |of |ati| of|g v|lle|e b| wo|eni| aa|voo|r h|n a| al|nd |e o|n t|ege|erk|t h|jke| na|sta|at | da|e e|end|nat| st|nge|ste|e g|tie|n b|om |die|e r|r d|erw|ij |dig|e s| om|wel|t e|ige|ter|gel|ie |e m|re |t d| za|ers|ijh|jhe|d v|zal|nig|nie|bes|ns |e w|est|d e|g e|e n|ele| do|ge |vol|che|e d|ig |gin|eze|nst|ona|eke|cha|hap|dat|lke|e a| di|waa| to|min|jk |tel| gr|len|eme|lin|elk|ard|doo| wa|eve|ven|n s|str|gro|han|del|ich| ov|ove|n n|t v|tio|ion|wet|it |gem|ijd|met| zo|uit|aat|dez|ze |rin|e i|all|st |ach| ni|toe|n m|ies|es |taa|per|hed|heb|ebb|bbe|ien|sti| ma|nte|ale|kin|nin|mee|daa|el |ben|ema|man|s e|e h|esc|her|lan|ang|ete|g o|wer|is | er|pen|nsc|beg|igd|t g|ont|iet|tig|ron|tin|p v|r e|rwi|wij|ijs| hu|erm|nal|bij|eer|edi|ite|t a|t w|d o|naa|weg|iem|g d|teg|ert|arb|als|d z|tan|tre| la|ar |ame|js |rmi|t b|app|rwe| bi|t z|ker|eri|ken| an\",\"srp\":\" pr| i |rav|pra| na|na | sv|ma | po|je |da |ima|a p|ja |a i|vo |nje|ko |va |anj|ti |i p|ako| u |a s| da|avo|ju |i s|ost| za|o i|sva| im|vak|o n|e s|ava|nja| sl| ko|om |no | ne|ne |li |u s| dr|ili|a n|slo|obo|koj|ih |lob|bod|im |sti|stv|a o| il| bi|pri|a u| ra| je|og |jed|enj|e p|u p|van|ni |a d|i u|edn|iti|nos|a k|o d|ova|pro| su|i i| os|ran|sta|dru|e i|cij|se |rod| ob|i o|aju|e o|i n|ove| de|aci| ka|ovo| ni| od|ve | se|i d| st|m i|voj|avn|uje|eni|ija|dna|žav|u i|red|su |nov|odi|tva|e b|oja|što|lju|u o|ara|a b|ji |drž|rža|odn|jan|nim|poš|ošt|a j|ka |jen| ov|u u| nj|du |ave|osn|sno|šti|aro|raz|bit|a z|u z|de | iz|nih|o p|u d|e d|pre|vu |u n|lja| tr|tu |eđu|nar|gov|svo|bez|ičn|lje|e n|za |vno|lo |oji| sa|to |an |nak| me|čno|đen|vim|nac|oda|ani|me |iko|nik|ika|e k|pos| kr|tre|reb|nst|stu|e u|ku | do|ašt|tit|aln|dno|jeg|nom|olj|nog|m s| vr|o k|oj |čov|ans|ovi|o s|bra|te |tav|tup|eno|živ|zaš|em |i m|dni|šen|var|riv|rug|vol|avi|tan|štv|kao|ao | li|st |ilo|nju|sme|o j| sm| čo|odu|vre|dst|od |a t|kri| bu|bud| ve|ver|a r|m n|del|tvo|međ|oje|jem|m p|avl|vlj|ego|u v|pod|ena|ugi|la |jav|por| op|ruš|ušt|kom|edi|ba |kla| mo|oju|i b|kak|akv|rad|nu |vek|rim|gla|juć|ude|vni|eba|e r|svi|i v|itu|ter\",\"ckb\":\" he| û |ên | bi| ma|in | di|na |maf|an | ku|ku | de| ji|xwe|her|iya| xw|ya |kes|kir|rin|iri| ne|ji |bi |yên|afê|e b|de |tin|ke |iyê|e h|es |ye | we|er |di |we |i b|ê d|erk| na|î û| an|ina| be|yê |eye|rke|î y|nê |kî |diy|ete|hey|hem| ci|eke| li|wek|ber|fê |n d|li | bê| se|yî | te|ne |rî |sti|net|tew|yek|af |hev|yan|n b|kar| ki|re |e k|wî |i h| ew|n û|û b|aza|n k| wî| mi|î b|dan|e d|î a|ekî|a m| az|zad|mir|iro|rov|nav|n h|ser|est|a w|ara|bin|ewe|anê|adi|tê |be |emû|mû | yê| ya|ta |ast|tî |ev |ewl|s m|n m|wey| tu|wle| bo|bo | tê|n j| me|ê h|din|ras|î d|n n| da|n w|bat|wed|ema|ê b|cih|st | ge|iye|ing|ar |în |r k| ke| pê|îna|î h|ekh|khe|vî |ana|par|û m|ûna|civ|vak|n e|dî |nge|geh| ye|ê t|ê k|û a|fên|hî |e û|av |eyî|bûn|erb|î m|bik|ê m|a x|iva| re|e n|eyê|vê |ane|man|nên|ela|end| pa|erî|n x| ta|jî |ika|kê |a k|f û|f h|e j|î n|ra |ehî|tiy|tên|û h|a s|rbe|bes|mî |ari|eza| ni|nek|n a|ov |i n|erw|rwe|erd|aye|e e|riy| a |ike|ê x|ovî|û d|inê|etê|tem|yet|eta|ek |ê j|a n|e t|i d|zan|bê |anî|nîn| ra|ama|ere| hi|i a|tuk|uke|bib|lat|awa|u d|ibe|xeb|atê|i m|mal|nda|ewa|a d|a b|arî| ba|edi| hî|hîn|rti| za|ist|e m| wi|mam| şe| qa|qan|anû|nûn|asî|han| ên|a g|u h|tu |dew|let|are|ine|pêş|êr |e a|wel|ger\",\"yor\":\"ti | ní|ó̩ | è̩|ní | lá|̩n |o̩n|é̩ |wo̩|àn | e̩|kan|an |tó̩| tí|tí | kò|ò̩ | àw|̩tó|è̩ | àt|è̩t|bí |e̩n|àti|lát|áti| gb|lè̩| ló| ó |s̩e|àwo|gbo|̩nì|n l| a | tó|í è|ra | s̩|n t|ò̩k|tó |sí |kò̩|̩ka|o̩ | sí|ìyà|orí|ílè|ì k|̩‐è|dè |yàn|ni |̩ à|ún | or|èdè|jé̩|ríl|è̩‐|‐èd|í à|àbí|n à|nì |ò̩ò|̩ò̩|í ó| tà|tàb| ti|̩ t|jo̩|̩ l|̩e | wo|í ì|nìy|ó n| jé|ló | sì|kò |n è|wó̩|n n| bá|̩ s|rè̩|sì | fú|fún|í a| pé|̩ni| òm| kí|gbà| èn|ènì|pé |in |ba |òmì|nir|ira|ìí |ràn| ìg|ìgb|n o|bá |mìn|ìni|gba|kí |n e| rè|e̩ |̩ n|un |̩ p| o̩|í ò|nín|nú |fi |gbé|yé | ka|ínú|a k|bé̩|mo̩| fi|̩ ì|í i|ó s|i l|wà |o̩d|̩dò|dò̩|̩ o|bò |dá |i ì|bo̩|hun|i ò|o̩m|̩mo|̩ k|áà |̩wó|bo |àgb|ló̩| ò̩|ó j| bí| oh|ohu|í k|n s|írà|bà |ara| ìb|ogb|pò̩|ú ì|yìí|rú |kó̩|ó̩n|i t|̩ ò| lè|lè |̩ e|à t|à l|bog|a w|gé̩| yó|yóò|óò |ò l|̩gb|ò̩r|̩ y|í w|̩ f|í t| wà|ó̩w|yí |ó b|̩ a|ìké|i n|i è|láà|àbò|fin|wùj|ùjo|n k|í e|é̩n| òf|òfi| mì|mìí|ìír|jú |rin|̩é̩|i j|ó t| ar| ir| ná|náà| ìk|̩ b|i s|ú à| yì|kàn|irú|rí | i |è̩k|̩kó|fé̩|é à|i o|s̩é|̩ m| ìd|è̩d|̩dá|i à|àwù|à n|ú è|wù | èt|áyé|í g|í o| mú|a l|láb|ábé|̩è̩|ìn | kú|láì| àà|i g|bé |níp|ípa| ìm|níg|ígb|wò̩|báy|ké̩|mú |í n|de |è̩s|mó̩| dá|i a|dó̩|ó̩g| ni|i p| wó|ayé|ùn |̩ w|a n|n f|n ì|je̩|ò t|n g\",\"uzn\":\"lar|ish|an |ga |ar | va| bi|da |va |ir | hu|iga|sh |uqu|bir|shi|huq|quq|gan| ha| bo|ini|ng |a e|r b|ni | ta|lis|lik|ing|ida|oʻl|ili|ari|nin|on | in|ins|adi|nso|son|iy | oʻ|lan| ma|har|dir|hi |kin|ash|i b|boʻ| yo| mu|uqi|dan|ila|qig|ega|r i|qla|oʻz| eg|a b| er|erk|kla|qil|oli|ki |gad| ol|nli|lga|at |i h|a o|rki|oki|osh|lig|igi| qa|yok|ib |las|n m| ba| qi|n b|ara|atl|ri |iya| sh|ham|ala|lat|bil|in |r h|bos|a t|siy|a y|cha|n o|a h|ik |a s|inl|a q|yat|nis| et|eti|osi|h h|i v|ani|tla|til|mas|ʻli|asi|ati| qo|i m|ris|im |a i|uql|arn|rni|qar|ha |gi | da|sha|n h|i o|rch|mla|li |i t| xa|arc|bar|ʻz |hun|a a|rla| bu|a m|lin|lib|taʼ| tu| as|h v|tib|aro|un |tga|r v|ikl| be|mum|n q|ali| te|sid| to|mat|amd|mda|tas| ke|shu|lla|shg|hga|n e| ya|dam|aml|oya|xal|hla|ola|iri|irl|ill|rga|iro|tis| de|umk|mki| eʼ|ten|eng|rda| is| sa|gin|imo|tar|ush|ur |ayo|rak| so|alq| ki|aza|k b|oda|oʻr|a k|tni|ʻlg|n v|hda|nda|shq|hqa|zar|miy|i q| mi|mil|r t| si|ak |ada|rat|or |kat|era|siz|am |ch |aso|sos|yot|atn|shl|n t|nid|y t|ana|ti |rin|asl|bu |sin|dav|ilg|as |i y|ech|nga|lak|h k|ino|ʼti|gʻi|muh|a v|bor|uch|lim|a u|uni|lli|n i|uri|si |i e| ka| ch|a d| ja|ami|qon|na |rig|lma|ker|avl|vla|i a|dek|ekl|liy|aka| em|ema|eʼt\",\"zlm\":\"an |ang| ke| se|ng | da|ada|dan|ara| pe|ak | be|ran|ber| me|ah |nya|hak|per|n s|ata|ala|ya |a s|kan|asa|lah|n k| di|da |aan|gan|nga|dal|erh| ma|n d|eba|rha|a p| ha|kep|pad|yan|ap |ama| ba| ya|nda| te|ra |a b|tia|man|eng|a d|ora|men|iap|n p|ter|epa|san| or|eti|pen| ad| at|n a|a a|h b|set|tan|sia|tau|n t|n b|ta |dak| sa|sa |at |au |ela|apa|pa |beb|bas|p o|h d|n m|keb|end|aka|ega|a k|am |sam|ana|gar|k k|ban|ole|leh|neg| un|lam|di |g a|eh |n y|aha|han|a m|eri|any|ma | ti|a t|uan|mas|ngs|atu|seb|ebe|ing|ian|car|bag| ne|mem|kes|mat|gsa|ia |ika|i d|nan|asi|und| la|epe|ert|agi|emb|na |ers| de|emu|pem|ngg|anu|i m|ind|erk|ung|n h|tu |gi |kla|g b|pun|iha| in|nus|usi|tin|al |si |as |akl|dap|erl|era|sec|eca|i s|lan|bar|k m|ena|aya| as|sas|nny|rta|sem|awa| su|bol|rat|den|ini|ni | ta| he|hen| an|tar|g m|ai |kem|adi|had|in |ti |i k| bo|uka| ap|g t|ka |ann|ema|g s|ain|k h|rka|ri |n i|aga|un |ses|dun|enu|emp|elu|lai|kat|ent|nta|rsa|iad|ua |dia|ira|a n|mpu|ntu|uk |mel|k d|har|ker|dil|mar|h m|aja|ila|k a|mba|lua|i a|rak|uat|jua|rma| pu|t d|rga|i p|uma|ser|esi|ar |esa|nak|bah|rli|lin|ndu|dar|ari|ese|l d|ant|ngk| ol|sua|g d|ati|tuk|erm|saa|erj|rja|kea|raa|gam|g u|tik|ida|sek|eka|sat|i b|mbe|unt|dir|iri\",\"ibo\":\"a n|e n|ke | na|na | ọ | bụ|nwe| n |ere|ọ b|re |nye| nk|ya |la | nw| ik| ma|ye |e ọ|ike|a o|nke|ụ n|a m| ya|a ọ|ma |bụl|ụla|e i| on| a |iki|kik|ka |ony|ta |bụ |kwa|i n|a i| nd|di |a a|wa |wer|do | mm|dụ |e a|any|ha | ga| ok|e m| ob|he |ndi|e o|a e|ite|ọ n|rụ |hi |ga‐|mma|wu | dị|aka|ara|che|oke|o n|we |n o| ih|mad|adụ|obo|bod|odo|a g|te | ez|hị | ka|ụta|be | an|akw|zi |a‐e|dị | oh|gba|nya|u n|ihe| ak|me |i m|ala|ri | ọz|ghi|ohe|her| mb|ba | nt| si| iw|weg|pụt|ra |iri|chi|ụrụ|rị |zọ |oro|ro |iwu|a‐a|ụ ọ|ụ i| eb|ebe|e ị|a y| in|ezi|kpa|kpe|inw|mba|sit|ịrị|ile|le | ha|e e|bi |n e|chị| en| e |i ọ|asị|mak| ni|nil|ghị|si |ide|a u|o i|i o|i i|apụ|a s|e y|u o|ụ m|ahụ|hụ |a ụ|nkw|edo|n a|ru |ụ o|ozu|enw|ọzọ|kwu|gid|sor|egh|yer|tar|n i|pa |eny|uru|kwe|toz|ị o| mk|ama|de |uso|tu | im|ime| me|i a|ịch|ọ d| ịk|obi| ọn|hed| ọr|ọrụ| to| ch|gas|wet|mkp| kw|osi|a d| nh|nha|ọnọ|nọd| al| nc|nch|sir| o |n u|sịr|eta|u ọ|ị m|n ụ| us|nọ | ot|otu| gb|ọdụ|nwa|o m| ag|ali|lit|ọta|ega|ị n|e k|e s|ji |a k|ikp|ọch| ug|ban|ekọ|pe |nta|agb|na‐|n ọ|hu |i e|e g|a b|zu |chọ|u a|kwụ|ram|esi|uch|onw| nọ|ị k|u m|eme|wan|e h|dịg|ịgh|hịc|ugw|gwu| di|ich|cha| og|okp|kpu| nn|zụz|zụ |i ị|o y|ach| ng|pụr|ị e|a h|meg|nat|uwa\",\"ceb\":\"sa | sa|ng |ang| ka|an | pa|ga | ma|nga|pag| ng|a p|on |kat|a k|od |ug | ug|g m| an|ana|n s|ay |ata|ung|ngo|a m|atu|ala|san|ag |tun|g s|g k|d s|god|a s|ong| mg|mga|g p|n u|yon|pan|a a|usa|ing|tag|tan|una|mat|ali|aga|g u|han| us|nan|y k|man|ina|non|kin| na|lan|syo|a b|asa|nay|a i|n n| ta|awa|nas|taw| o |nsa|gaw|a n|agp|dun|iya|ban|isa|was| ad|adu| gi|ili|ini|asy|bis|nag|g a|a t|o s| bi|nah|lin| ki|al |sam|lay|ahi|nal| ba|ano| wa|wal|asu|agt| di|yan|ama|a u|n a|ags| iy|gan|n k|kan|him|kag|ya | un|gpa|kas|aha| su|g t|awh|wha|gsa|l n|agk|gka|a g|gla|kal|gal|ran|sud|ud |imo|d u|aba|aka|ika|ig |ngl|ipo|g d|ara|g n|uka|uns|uta|d n|og |i s|y s|kau|li |n o|aki|o p|kab| og|ot |mta|gik| si|n m|gpi| la|g i|aho|ayo|iin|ok |awo|hat|o a|gon|ip |a w|apa|lip|na |a h|bal|la |ad | ga| ti| hu|uba|wo |ati|uga|hon|hin|ma |sal| ub|agb|gba|nin| bu|buh|uha|t n|ahu|may|pin|as |ni |mak|ihi|abu|uma| in|say|d a| pi|dil| ni|ins| pu|agh|at |hun|but|aug|lak|bah|sak|o u|mal|s s|os |amt|t s|pod|sos|ngp|lam|aod|ila|a d|ami|k s|tin|ura|mo |agi|tra| at|bat|aan|ulo|iha|ha |n p|kar|oon|sya|ona|aya|in |inu| hi|it |agl|amb|mbo|mag|a l|ho |lao| al| il|iko|ngb|mah|lih|g b|gta|gtu|y p|rab|ato|tar|nab| re| so|osy|yal|aw |gda\",\"tgl\":\"ng |ang| pa|an |sa | sa|at | ka| ng| ma|ala|g p|apa| na|ata|pag|pan| at| an|ay |ara|ga |a p|tan|g m| mg|mga|n n|pat| ba|aya|n a|na |ama|g k|kar|awa|a k|lan|rap|gka|nga|n s|g n|g b|a a|aha| ta|agk|gan|asa|tao|aka|yan|ao |a m|may|man|kal|ing|nan|a s| la|aga|ban|ali|g a|ana|y m|kat|san|kan|pam|g i|ong|mag|a n|baw|o a|wat| y |isa|lay|y k|t t|ila|g s|in |kas|o y|aan| ay|ina|t n|t p|wal|ag |una|yon| it| o |nag|tay|pin|ili|ans|lal|ito|any|nsa|kak|a i|lah|mam|nta|nya|gal|hay|to |ant|aba|ran|agt|on |han|agp|kap| ga|t s| wa|gaw|o m|ya |as |g t|lip|y n|hat|g l|ung|ngk|no |gpa|lag|gta|t m|wa |yaa|ari|sal|a l|kai|pap|lin| pi|ita|ahi| is| di|agi|ipi|bat|mak|pun|a b|y s|aki|tat|la |hin|pah|yag|gay|o n|ags|iti|di |i n|sas| si|t a|al |a t|ika|mal|s n|ipu|t k|ais|hal|i a|sap|lit|od |ihi|alo|y p|ani|ig |par|ap | ip|tas|gin|gga|nin|uma|gsa|ano|ira|a g|nah|uka|syo| bu|ini|o s|nap|ngi|o p| ha|a h|mah|a o|li |ipa|uha|asy|lam|iba|aru|mba|g e|usa|lim|sam|pil| da|kin|duk|sin|dai|aig|igd|gdi|dig| tu|d n|ba |nas|pak|iga|kil|n o|nak|ad |lig|git|lab|ma |kab|nar|tag| ed|edu|aho|buh|and|nda|mas|pas| ib|it |ri |lun|ula|agb|g g|ain|pul|ino|gi |sar|g w|abu|s a|api|nil|iyo|siy|iya|anl|uli|aun|agg|amb|g d|ati| li|i m\",\"hun\":\" sz| a |en | va|és | és|min|ek | mi| jo|jog|ind|an |nek|sze|ság| az|gy |nde|ala|sza|den|az |a v|val|ele| el|mél|oga|egy|n a| eg|ga |zem|zab| me|emé|van|int|tel|aba|bad|tet|ak | te|tás| ne|gye|t a|ény|ély|tt |n s|ben|zet|ség|lam|meg|nak|ni |ete| se|lyn|yne|s a| al|let|z e|ra |et |agy|sen|eté|k j|tek|mel|kin|ok | ki|ez |hoz|oz |n m|re |vag|ett|emb|mbe|es | kö| le|nem|ell|em |ely|hog|ogy|s s|gok|atá|k a|nt |köz| ho|z a|hez|el |len|yen|ásá|ads|dsá|tés| em|a m|a s|nte| ál|k m|ás |a t|szt|áll|a h|y a|ogo|sem|ber|ban|enk|nki|nye|lap|t s|ese|ame|nyi|k é|ágo|ló |ág |t m|on | vé|i m|ami|ébe|s e|lat|lla|ly |mén|fel|tat|eri|lő |a n|eki|n v|yes|emz|mze|lle|a a| cs|át |kül|elő|l a|nd | ke|ég |i é|lis|vet|éte|ért|rés|yil|ésé|enl|szo| am|tar|art|alá|elé|a j| ny|koz|het|ész|ja |lem|nlő|ri |i j|s é|éle|ól |aló|kel| ha|ges|zás|más|s t|tár|s k|t é|vel|tko|zés|ése|se |tő |ot |ott|sít| fe|n k|lek|tte|olg|áza|ssá|e a|eve|szá|ti |n e|ül |zte|ána|zto|tos|árs|os |k k|eze|leh|ehe|t n|tes|kor|atk|del|t k|tot|ány|ége|fej|i v| né|ház|leg|k e|ll |nev|is |ába|t t|véd|éde|d a|zer|ere|kif|ife|téb|ny |ai | bi|biz|izt|i e|sül|lt |zat|at |elm| ar|arr|rra|sel|t e|ágá|s n|csa| mu|nél|it |esz| há|zas|ass|üle| ta|nyo|alk\",\"azj\":\" və|və |ər |lar| hə|in |ir | ol| hü|hüq|üqu| bi|quq|na |lər|də |hər| şə|bir|an |lik| tə|r b|mal|lma|ası|ini|r h|ən |şəx|əxs|qla|arı|a m|dir|ali|aq |uqu| ma|ilə|ın |una|yət| ya|ara|ikd|ar |əri|əsi|r ş|rin|əti|dən|nin|n h| az|yyə|sin| mü|tin|ni |zad|iyy| mə|ərə|mək|ün |nda|ət |i v|ını|nın|ndə|ə a|aza|rın|qun|olu| et| qa|lıq|ilm|kdi|lə |ə y|ək |lmə|ına|ind|olm|xs |mas|sın|lun| in|ə b|da |n t|əmi| bə|adl|dlı|n m|nə |q v|ya |tmə|bər| on|ə h|əya|sı |nun|etm|dan|inə|maq|un |raq|ə v| va|n a|n b|rlə|ə m|si |əra|n i|ınd| öz|anı|nma|ama|rı |ığı|li |il | al|ala| di|ə d|ik |irl|ins|lət|a b|bil|ıq |müd| sə|ə i|nı |nla|ələ|dil|alı|ə e|unm|n v|ola|asi|üda|ili| də|nsa|san|uql|ə o|xsi| he|uq |ətl|həm|əni|eyn|u v| da|tər|min|yin|kil|dır| bu|lan|iş | ha|məs| ki|mi |lığ|ə q|q h|i s|daf|afi|fiə|r v| iş| əs|sos|osi|sia|xal|alq| ta| as| ed|bu |heç|eç |rə |yan|ı h|kim|iyi|ı o|ina|siy|əsa|sas|a q|yar|lı |tün| is|ist| so|al |n ə|ifa|əmə|ə t|mil|ill|lıd|ıdı|ır |ədə|ıql|liy|tlə|a h|məz| bü|büt|ütü|iya|iə | üç|üçü|çün|t v|dax|axi|xil|r a|ılı|man|sil| se|seç|adə|ial|onu|öz | cə|miy|əyi|n e|edi| mi| nə|a v|mən|ril|əz |ild|rab|abə|şər|ğın|aya|zam| ni|ulm| xa|təh|əhs|hsi|i h|sti|qu |var|ad |tam|uğu|z h|qan|rəf|n d\",\"ces\":\" pr| a |ní | ne|prá|ráv|ost| sv| po|na |ho |ch | na|nos|o n|ání| ro|ti |vo |neb|má |ávo| má|ou | ka|kaž|ažd|ebo|bo | je| za|ždý|dý | př|svo|a s|sti| st|á p| v |vob|obo| sp|bod|pro| zá|rod|ých|ván|ý m|né | by|ení|ého|spo| ná|í a|ová|o p|roz|mi |ně |ter| li|a p|nár|áro| ja|jak|by |to |lid|u p| vš|ny |ím |í p|i a|a z|o v|kte|mu |at |odn| vy| ma| so|ví |zák|tní|a v|oli|li | kt|í n|kla|do |je |pod|en |em |byl|mí |áva|stá| do|t s|rov|í s|tví|vše|it |dní|o s| ve|pol|í b| bý|být|ýt | se|čin| k |sou|a n|stn|ran|vol|nou|ejn|nes|se |ci |nýc|du |ným|stv|žen|své|vé |ají|jeh|eho|va |mez|ním|ích|ým |ké |ečn|pří|u s|tát|i s|kol|ova|e s|ech|í v|ids| i |maj| to|nu |hra|ave|ole|i v|kon|m p|ému|y s|o z|eré| ze|o d| že|chn|ovn|len|dsk|lad|vat|chr| ta|m a| ab|aby|sta|pra|néh|esm|smí| ni|i n|že |ako| os|sob|aké|i p|st |rac|kdo|zem|m n|odu| ji|bez|ste|ákl|ens|ými|í m| vz|i k| oc|och|jí |oci|áln|lní|a m|dy |lně|vou|při|rav|leč| s |t v| či|čen|áv |slu|jin|oko|nez|tej|řís|stu|ské|ský|nit|ivo|a j|věd|iál| me|ezi|ven|oln|zen|í z|y b|zac|níc|ky |u a|a o|u k|inn|est| tr|svě|nik|ikd|í k| mu|u v|kéh|jno|jíc| dů| od|tup|ože|i j|odi|děl|ího|rok|anu|soc|ciá|ve |é v|něn|din| vo| pl|pln|vin|u o|h p|tak|adn|a t|cho|ává\",\"run\":\"ra |we |wa | mu|e a| n |se |a k|ira|ntu|tu | ku| um|ko |a i|mu |ye |hir|iri|mun|ing|unt|ere|ash|shi|a n|umu|zwa| bi|gu |ege|a a|za |teg|e k|ama|go |aba|uba|ngo| ba|o a| ar|ung|ish|ora|a m|e n| we|sho|na |ese| kw|nga|e m|mwe| ab|ugu|ate|ndi|kwi| gu|ger|riz|wes| at|di |u w|n u|yo |gih|ban|ngi|iza|e b|ara| am|ri |ka |a b|e i|hob|obo| ca|ro |u b|can|nke|ezw|a u| in|bor|bah|ahi|rez|iwe|gir|iki|igi|ihu|ke |ari|ang|aku|a g|hug|ank|ose|u n|o n|rwa| ak|and|kan| vy|ngu|nta| ub|aka|ran| nt|n i|ata|kur|kun|i n|ana| ko|e u|iye| ka|re |any|amw|ta |nye|uko|gin| zi|ite|era|ga |aha| ib| ng|n a|o u|o k| iv|ivy|ho | as|sha|o m|o b| bu|mak|ako|o i| ig|o z|o y| uk|ubu|aga|izw|i b|vyi|ba |aho|kir|nya| is|kub|hin| it|uri|gan|rik| im|u m|guk|bat|nge|kug|ani|vyo|ene|imi|imw| y |jwe|ze |agi|e c|u a|gek|ush|i i|uru|ham|uza|e y|ibi|amb|bur|ina|eme|i a|abi|ha | nk|eye|gus|ber|u g|no |rah|zi |w i|ma |tun|ind|ron|ras|wo |ne |wub| gi|gen|kiz|y i|kor|ura| zu|zub|zin|je |iro|mat|eko|bwa|ika| bo|bak|onk| ma|ugi|mbe|ihe| mw|eka|ukw|wir|ryo| ic|a z| ry|bwo| ag|yiw| ki|gis| yo|bik|ni |nka|rek| bw| ya|tse| ha| ah|umw|he |eng|bir|aro|ury|twa|ant|a c|tar|uki|mw |bih|ku |tan|bos|nde|uro|y a|utu| no|i y| yi|ya |puz|zam|eny\",\"plt\":\"ny |na |ana| ny|y f|a n|sy |aha|ra |a a| fa|n n|a m|y n|an | fi|tra|any| ma|han|nan|ara|y a| am|in |ka |y m|ami|olo| ts|min|lon| mi| sy| na|a t| ol|fan|a i| ha| iz|iza|man|ina|ona|aka|y h|ian|o a|a h|reh|a s|etr|het|a f|on |ire|fah|tsy|mba|ay |zan| hi| ar|ndr|ira|y o|y t|ehe| an|o h|y i|afa|ren|ran| zo|ena|dia|amb|amp|ala|zo |ika|y s| di|tan| az|y z|m p|rin|ia |n j| jo|jo | dr|a d|zy |ao |ry |and| ka|dre|mpi|rah|nen|haf|n d| ir|eo |elo| ta|omb|rai|oan|fa |am | pi|ene|ho | ho|ant|iny|itr|azo|dra|ava|tsa| to|tsi|zon|asa|van|a k|ari|ha |n i|mbe|ray|fia| fo|sa |ony|isy|ova|lal|ly |azy|o f|bel|lom|ham|mis|sam|zay| ra|oto|fir|ban|a r|nat|kan| vo| he|ito|ary|nin|iha| re|a e| ko|tok|fit| no|ita|iar|fot|nam|voa|isa|y v| sa|y r|o n|no |aly|mah|har|ain|kam|aza|n o|otr|eri|hev|oka|sia|ial|atr|y l| la|ila|oa |y d|ano|ata|its|tov|pia|y k|pan|fam|oko|aro|nto|pir| ao|ty |anj|nja|reo| as|o s|hia|o t|mpa|mit| eo|ais|sir|air|ba |tin| it|ver|ino|vah|vy |ton|tao|ank|era|rak|kon|a z|tot|ive|ame|aho|hoa|hit|ati|ity|o m|mik|a v|ani|ori|koa|hah|nga|dri|eha|dy | mo|oni| za|ato|bar|jak|n t|nao|end|eve|lah|aov|mia|izy|lan|nar|ria|ama| pa| mb|aln|lna|ifa|za |to |dro|va | in|ind|ehi|n k|iva|nta| va| al|via|rar\",\"qug\":\"una|ta | ka|na |ka |ash|cha|a k|ari|ish|kun|kta|pak|ana|hka|mi |shk|apa|ach|hay|akt|shp|man|ak | ch| ha|ata|rin|lla|tak|ita|ami|ama|aku| pa|har|pas|ayñ|yñi|ina| ma| ru|uku|sh |hpa|run|kuy|all|aka| tu|tuk|an |chi|yta|a c|chu|in |ñit|ris|a h|nka|nak|tap|kan| ki|ayt|pi |pa | sh|i k|nap|a p|pay|kaw|kam|nam|ayp|aws|wsa|a s|ank|nta|iri|uy |a t|hin|a m|ay | li|ant|kay|lia|nat|a r|shi|iak| wa|lak|uya|say|yuy|y r|ypa|kis|a a|hun| yu|n t|tam| ti|n k| ya|yay|lli|a w|hpi|api| al|un |yku|ipa|a i|iku|ayk|shu| sa|ush|pir|ich|kas|kat| il|huk|ill|a y|hu |rik|yac|a l|kac| ku|hik|tan|ypi|wan|ika|i c| ni|ima|ila|ink|ayl|yll|mac|nis| ta| wi|kus|i y|i p|n s|llu|tin|la |yan|kpi|awa|li | ri|may|tik|iks|lan| pi|aya|kin|yas|ksi|kll|kak|lat|aym|ura|war| ay|k h|uch|akp|sha|ukt|nch|h k|i t|ull|uma|mas|iya|kir| ii|h m|pip|n p|kik|iki|i s|kar|aki|riy|han|y h| su|mak|n m|tac|nal|nac| ña|k k|k t|k a|iwa|mam|i m|nki|yma|wil|his|pal|i i|asi|nmi|i w|sam|k l| hu|sum|pam|kap|k i|pan|iia|huc|ik | mu|mun|pik|was|k m|ma |hat| im|k r|akl|u t|ha |llp|a u|wak|has|anc| ak|imi|mal|y k|ian|iña|tar|yka| iñ|iñi| mi|n y|ywa|uyk|unk|a n|arm|rmi|h p|pur|akk|kim|san|ati|uti|uri| ar|sak|i a|hap|iyt|ayw|si |yar|las|lpa|ñaw|awp|wpa|i r\",\"mad\":\"an |eng|ban|ng | sa| ka|dha| ba|ren|ak |ang| se| ha|hak| dh|na | pa|adh|se |a s|aba|n s|ara|ngg|are|ha |aga|sa | or|sar|ore|asa|ana| ma|a k|aan|gi |ale| ag|gad|a b|n o|n k|ra |ala|eba|gan| ke|dhu|aja|ota|bas|man|dhi|n b|tab|ka |sab|ama|beb|abb|at |nga| ta|ggu|ako|pan|huw|uwi|wi | ot|san|a d|ata|eka|i h|bba|agi|ba |lak|hal|ong|kab|em |g a|lem|a o| pe| na|par|ane|ngs|nge|gar|a p|tan|gsa|a a|ran|ken|i s|guy|uy |k h|n p|n a|ada|al |apa| ga|on | an|g s|ta |kaa| e |e d|pon|nek|ssa|a m|kal|a e|e e| la|kat|ona|abe|nan|asi|jan|ate|lab|ri |sal|lan|i p|sad|aka|e a|a h|ari|ena| bi|oss|si |daj|i k| ng|har|gen|ton|e k|epo|ano|bad|car|n d|ar |era| be|nag|kon|g k|ase|nya|nos|n n|mat| kl|mas|ela| da| al|n t|uwa|wan|sae|pad|ggi| so|as |hi |adi|a n|i d|g e|k k|ne |oan|uan|k s|k a|e b|ah |ina|kla|ter|om |gap|le |koa|yat|per|neg|ega| ja|bi |abi|aha| ep|aon| as| mo|n h|i a|one| di|ma |kas|m p|di |aya|nto|int|n e|te |bat|epa|nda| ca|pam|e s|amp|to |dra|ann|oko|rga|nna|e p|g p|nta| ra|and|i b|nao|k d|pen|aen|ste|ila|yar|a t|mpo|ok |set|n m|k b|isa|kom|raj|arg|ika|bin|ant|ga |hid|idh|aju|i m|nas|kar|mos|ost| ho|lae|dil|t s|a l|das|rek|tad| a | po|ett|tto| to|bis| dr|jat|add| ko|ent|gam|e m|ndh|hig|iga|maj\",\"nya\":\"ndi|ali|a k|a m| ku| nd|wa |na |nth| mu|yen| al|ra |thu|se |hu |nse|di |a n|la | pa| wa|mun|unt|nga| la|a u|u a|e a| ma|za |ons|ace|ce | lo|iye|a l|idw|ang| ka|kha|liy|ens|li |ala|ira|pa |ene|i n|we |e m|era|ana|dwa|lo |hal|ulu|ko |dzi|iko|yo |o w| ci|a p|ga |chi| mo|o l|lu |o m|zik| um|moy|oyo|ufu|ner| an|and|iri|umo|ka |a a|dan|ena| uf|ful| nc|nch|hit|ito|to |a c|kuk|dwe| da|fun|wac| dz|e l|kap|ape|a z|e k|ti |u w|ere| za|lir|pen|aye|tha|kut|ro |mu |lid| zo|ofu|ing|i m|amu|mal|o c|kwa|mwa|so |o a|o n|i p|eza| mw|nso|iro|zo |i d|lin|ri |edw| a |i l| li|a d|kul|ati|uti|una|lan|i k|o k|ung|alo|dza|i c|o z|a b|uni|iki|lam|mul|ulo| ca|nkh|nzi|gan| na|ant|e n|san|tsa|wir|oli|u k|lon|dip|ipo|unz|yan|gwi|ca |ome| ko|aku|akh|pon|ngw|kir| po|uli|gwe|cit|mer|pan|kup|ame|mba|tsi|bun|ukh|ope|siy|iya| ya| am|han| bu|ama|bvo|vom|rez|lac| kw|men|u n|ao |pez| on|zid|osa|u o|i a|nda|e p|ne |ank|hun|o o|nik|ku |its|adz|u d|aka|diz| kh|ina|ezo|ndu|kho|okh|ya |awi|izo|ans|pat|eze|khu|zi |phu|kus|eka|o p| ad|mol|ets|sa |iza|kwe|wez| un|izi|oma|ma |oci|du |ula|ani|lok|haw|ika|ja |say|nji|jir|amb|ats|sid|mai|aik|mak|aph|i u|isa|lal|u m|ogw|no |oye|ukw|osi|sam| si|win| zi|ni |tse|si |e o|opa|emb| ba|ban\",\"zyb\":\"bou|aeu|enz|nz |eng|iz |ih |uz |uq |ing| bo|oux| di| ca|z g|dih|ux |ngh|cae|gen|euq|z c|ng |you|ung|ngz|ij | mi| gi|miz|aen| ge|z d| ci|gya| yi| de|ouj|uj | gu|cin|ien|ngj| mb|mbo|dae|zli|gij| se|j g|ang|z y|j d|ouz| cu| ba|nae|h g| da|yin|oz |de |z b|nzl|li |nj |x m|euz| cw| yo|iq |gz |q g|x b|yau|h c|vun|inh|ix | ga|cwy|wyo| nd|vei|nda| ro|rox|oxn|z m|i c|j b| si|wz |gh | gy|cun|gue|xna|unz|hoz|can|bau|ei |z h|yen| li|inz|dan|q c| hi|gj |uh | vu|faz|yie| bi|zci|hin|goz|uek| fa|gun|aej|ej |ya |nh | ae| go|au |ciz|den|h m|nq |ngq|ouq|gva|z s| do|ci | wn|q d|eix|h d|ekg|kgy|q s|hu |u d|j n|auj|j c|gai| ha|az |nhy|z l|gjs|jso|sou|ou |bin|sin|lij|h s|sev|eve|nei|q y|aiq|sen|h y| la|enj|ouh|i b|vih|din|q n|awz|j y|z r|enh|en |uen|bwn|wng|ozc|z n|anj|j s|liz|g g|g b|i d| ne|bae|awj|sei|eiq|hye|anz|oen|hix|zda|gak|ez |anh|u c|z v| ya|h f|x d|in |ghg|bie|enq|zsi|ghc|hci|siz|i g|n d|h b| du|cou|ngg|ngd|cuz|eiz| ho|dun|g c|law|j m| dw|env|nvi|dei|a d|ek |yaw|wn |giz|gzd|nzg|wnj|gda|ak |nde|auy|yuz|hgy| co|ujh|jhu|e c|hen|ujc|min|izy|g d|gzs|daw|aw |g y|ozg|ai |iuz|x l| na|iet|aih|gih|iuj|zbi|uyu|coz|sae|i m| he|zdi|dwg|q b| fu| ve|guh|iqg|qgy|yai|yoe| so|biu|vaq|aq |yun|izc| ra|cie|zge|n g\",\"kin\":\"ra | ku| mu|se |ntu|a k|tu |nga|umu|ye |li | um|mun|a n|unt|ira| n |ere|wa |we | gu|e n|mu |ko |a b|e a|o k|a u|a a|u b|e k|ose|uli|ro | ab|aba|gom|e b| ag|omb|ba |ugu|ang|o a|gu |mba| ib| ub|eng|ihu|za | bu|ama| by|hug| ba|o b|e u|kwi|ga |ash|ndi| ka|yo |e i|ren| cy| ak|iye| bi|re |ora|igi|gih|ban|ubu|di | nt| kw|gan|a g|aka|aga|nta|a m|iro|a i| am|ku |i m|ago|byo|ta |ka |cya|ibi|and|na |ali|uba|sha| bw|ili|yan|no |ese| ig|u m|o n|kan|ish|ana|sho|obo|era| we|ya |aci|i a|ura|wes|uko|e m|ran|o i|u w|uru|wo |kub|n a| im|ber|hob|bor|ure| no|ani|u a|gac|cir|o m|ush|bur|eke|ne |wiy|ara|nge|rwa|yos|e y| y |uga|bwa|ho |zo |ind|ane|mwe|iza|are|rag|ge |mo |bwo|bul|teg|ege|u k|u n|n i|ze |aha| uk|bye|anz| al| ki|bah|uha|ite|kug|gir|ngo|go |age|ger|u g|zir| ry|ugo|bih|akw|o g|guh|iki|bat|iby|gar|imi|mbe|y i|n u|ha |atu|mul|tan|eye|e c|kim| ni|shy|aho|tur|kir|ate|abo|je |bo | ng|u u|ata|o u|iko|gus| bo|bos| gi|a s|nir| ru|gek|i b|eza|i n|nzi|i i|rez|kur|ako|any| as|ung| se|bis|nya|o r|uki| ya|ngi|mat|eko|ugi| in|o y|kor|imw|rer|bak|yam|bit| ik|kar|ire|ige|shi|hin|ing|byi|nu |mug| at|yem|eme|gaz|irw|yer|rek|key|ihe|gen| ic|icy|hak|but|ets|tse|eze| ur| na|bag|awe|ubi| yi|i k|ezo|tek|ubw|rya|uza\",\"zul\":\"nge|oku|lo | ng|a n|ung|nga|le |lun| no|elo|la |wa |e n|ele|ntu|tu |gel|we |ngo| um|e u|thi|uth|ke |hi |ni |ezi|lek| ku|nom|ma |o n|onk|nke|pha|gok|a u|nel|ulu|unt|o l|kwe|oma|o e|ang|lul| uk|kul|a k|eni|uku| wo|kel|hla|mun| lo|ama| ne|ath|ho |umu|ela|won|elw|lwa|ban|a i|ule|zwe|ana| un|une|ing|lok|aka|elu|wen| kw|aba|tho|akh|khe|ala|gan|o y|enz|ko |thu|na |u u|a e|gen|i n|zin|kho|enk|kun|mal|alu|e k|lel| na|kat|e a|nku|eko|he |hak|lan|kwa| ez|o a|o o|kub|ane|ayo|yo |lwe|eth|obu| em|nzi| ok|okw|kut| ba|ile|ben|het|eki|nok|nye|ike|i k|so |isi|ise|esi| ab|mph|nhl| is|aph|fan|ga |isa|ini| ye|e i|nen|uba|ba |zi |hol|ka |ant| fu|fut|uhl|abe|and|do |ukh|kuk|eke|a a|kil|e w|the| ya|nda|za | im| in|olo|ekh|eli|ith|khu|eng|yok|nis|sa |kuh|o u|any|ye |e e|i w| ak|olu|ndl|a o| le|ne |ume|mel|eka|mth| ko|emp|isw|amb|emi|no |uny|iph|i i|zo |kuf|nay|ind|ezw|kuz|vik|alo|o w|hul|ebe|lin| yo|kan|eze|ndo|uph|hlo|yen|enh|phe|ufa|ake|ale|kug|fun|und|wez|li |seb|a l|ula|wam|din|ahl|nez|yez|nya|bus|bo |azw|o k|ink|kek|nan|i e|ola|izi|mbi|ili|han|kuv|ase|hel|hut|a y|kis|kuq|da |omp|swa|kup|nem|ano|phi| ol|azi|ubu|o i|kol|oko| el|e l|huk|ani|nje|sek|uke|lon|pho|kom|lak|kus|zis|ham|mba|izw|ulo|hun|i u|u n\",\"swe\":\" oc|och|ch |er |ing|för|ar |tt |en |ätt|nde| fö|rät|ill|et |and| en| ti| rä| de|til|het|ll |de |om |var|lig|gen| fr|ska|ell|nin|ng | ha|ter|as | in|ka |att|lle|der|und| i |sam|lla|fri|ghe|ens|all|ör |na |ler| at|ete|den| el| so| av|av |igh|r h|nva|la |r r|env|ga |tig|nsk|iga|har|t a|som| ut|tti|nge|t t|ion|a s|ns |a f| sk|a o|r s|män|an |är |isk|rna| st| si| vi| sa| al|t f|ra | be|a r| är| me|ati|n s|lan| va| an|med|tio|ern|nna|t e| un|äns|ta |nat|sta|ig | åt|ten|kli| gr|vis|t s| la|äll|one|änd|han| ge| li|ans|stä|ner|t i| må|gru|ver|rih|ihe| mä|sni|lik|n f| re|r a| na|må |ers|t o|ad |r e|da |det| vä|ent|run|rkl|kla|ri |h r|nom|kap|igt|gt |n e|dig|uta|tan|e s|dra|s f|ed |d f|lar|rin|ran|upp|erk|tta|ika|änn|r o|erv|rvi|kte|vid|a i|lag| på|g o|id |ari|s s|r u|lin| om|ro |a m|els|isn|del|sky|r d|e m|mot|ot |vil|på | mo|r m|str|örk|ndl|on |i o|nd |tni|n m|ber|nad|gan|örs|r f|kal|era|a d|dd |je |itt| up|sin|nga|täl|ras|n o|ärd|i s|r i|enn|a n|n a| hä|bet|ski|kil|n i|lse|rel|t b|g a|kyd|ydd|arj|rje|l v|s e|end|amt| fa|nas| så|inn|tat|per|t v|l a|int|tet|öra|e f|tra|r g|yck|r ä|vär|ege|arb|d e|re |nis|ap |ara|bar|l s|t l|lit|när|lke|h f|ckl|v s|rän|gar|ndr|mt |se |häl|h a|llm|lmä|ess|sa \",\"lin\":\"na | na| ya|ya |a m| mo|a b|to | ko| bo|li |o n| li|i n| pe|i y|ngo|a n|a y|ki | ba| ma|kok|pe |la |a l|zal|oki|ali|nso|oto|ala|ons|so |mot|a k|nyo|eng|kol|go | ny|yon|nge|o e|ang|eko|te |o y|olo|oko|ma |a e|iko|e m|e b|lik|ko |o a|ako| ye|ye |ong|mak|si |isa| ek|aza|lo |sal|ama| te|o p|bat| az|e n|oyo|ani|ela|sen|o m|a p|ta |ban|i k|amb|ni | es|yo |aka|mba|osa| oy|mi |a t|eli|lis|i p|i m|ba |mok| to|mbo|bok|isi| mi|ing|lon|ato|o b| nd|ge |bot|ota| ez|nga|nde|eza|o t|kan|ka |gel|e k|bo |ese|sa |lam|koz|den|oba|omb| po|ga |mos|kop|oli|e e|yan|bon|oka|kob|lin|bik|po |kos| lo|sam|e a| ’t|’te|kot|ti |ngi| bi|e y|omi|esa|i b| el|elo|lok|gom|som|i t|ate|ika|kam|ope|a s|kat|ati|ata|wa |iki|i e|bom|tal| ka|oza|o l|bos|zwa|ola|pes| se|oke|bek|o o|ndi|bal|nda|nza|oso|omo|lak|bak|mis| at|bis|sus|usu|su |osu|lib|and|ozw|asi|ele|tel|mu |i l|e t|ase|mol|mob| nz|kel|ene|ne |mbi|ami|aye|nis|a ’|tan|le |obo|baz|pon|wan| ep|yeb|kum|sem|emb|mal|gi |nya|ote|e l|oku|bas| ta| ak| ti|tin|ina|gis|opo|ana|mab|bol|u y|mat|ebi|oti|mib|obe|a o|san| so|mbe|be | mb|ibo| et|ike|da | en|ben|za |yok|eni|tey|bwa|bi |kom|i o|gob|mik|umb|se |eba|e p|ibe|ale|lel|boy|eta|i a|bu |ime|sik|mon|ona|mel|ose|mwa|sol|geb|ebe\",\"som\":\" ka|ay |ka |an |oo |uu |da |yo |aha| iy|ada|aan|iyo|a i| wa| in|sha| ah| u |a a| qo|ama| la|ga |hay| dh|ma |aad| xa|ah |a d| da|qof|in |aa |iya|a s|a w| si| oo|isa|eey|yah|xaq| le|ku |lee|u l| ku|taa| ma|la |dha|ta |aq |q u|eya|y i|ast|sta|a k|ha |of | wu|wux|uxu|xuu|kas|sa |u x|ara|doo|wax| am|iis|ro |a q|inu|nuu|ala|a x|o a|maa|nay| sh| qa|o i| aa|kal|le | lo|loo|f k|o d|ana|a u|o x| xu| xo| ba| uu|yad|iga|a l|si |dii|a m|yaa|gu |ash|u d|ale|ima|adk|aas| ca|o m|do |lag|add|na |lo |o k|san| is| so|adi| mi| fa|xor|dka|aqa|iin| he|aar|had|rka|a o|ado|dad|soo|mid|kar|aro|baa|qaa| ha|nta|o h|ad |u k|aga|dda| ga|hii| sa|u s| ay|har|axa|mad|n k|eed|quu|haa|daa|o q|aal|o s|n l|xuq|uqu|n i|id |hel|aya| ee| ho|nka|i k|uuq|nim|ina|ihi|elo|waa|dan|agu|ays|a h|saa|mar|ark|ya |ank|o w|naa|gga|ee |ax | bu|uqd|qda|rri|riy|n a| no|u h|n s|oon|lka|u a|laa|o l|ab |haq|uur|int| gu|ida|iri|lad|dhi|yih|ysa|dah|to |aam|ofk| xi|arc|rci|eli|ood|ool|orr|alk|goo|ayn|e u|n x|h q|asa|sag|a c|sho|ami|i a|n q|siy| ug|kii|o u| ta| ge|gel|agg|a g| di|ido| ji|hoo|a f|al |jee|dal|ago|ii |a b|mo |iir|ooc|bar| ci|caa|xir|ra |aqo|sig| mu|aba|oob|oba|u q|aaq|aab|sad| ra|cad|dar|imo|ar |y k|fka| du|xay|y d|ras|o c|ari\",\"hms\":\"ang|ngd|gd |ib | na|nan|ex |id | ji|ad |eb |nl |b n|d n|ud | li|jid| le|leb| ga|ot |anl|aot|d g|l l|b l| me|ob |x n|ngs|gs |mex|nd |d d| ne|jan|ul | ni| nj|nja| gu| zh|lib|l n|ong| gh|gao|b j|b g|nb |l g| je|jex|gan|ngb| ad|end|el |gb |han| sh|ub | da|d j|t n|d l| nh|nha|b m|is |d z|x g| ya| wu|she|l j|oul|il |nex| ch|b y|d s|gho|gue|uel|wud| gi|d y|hob|nis|d b|s g| zi|lie| yo|es |it |nx |ies|aob|gia| de|eib|you|ian| hu|s j|d m| ba|zib|oud|b d|chu|ut |t j| do|ol |at |hud|nen|hen|s n|iad|ab |zha|t g|dao| go| mi|enl|x j|enb|b z|hei|eit|nt |b s| ze|d c|al |inl| xi| se| re|ren|hao|d h| fa|ngx|gx |anb|gua|yad| ho|x z|fal|b w|nib|ix |b h|and|had|t l|x m|gou|d x|bao|ant|don| xa|yan|d p|s z|hib|anx|zhe|ox |l d| pu| du|dan|gha|od |s m|sen|xin|lil|hui|uib|uan| we| di|b x|oub|t h|hub|zhi|t z| ju| ge| ng|t m|hol|xan|pud|x l| ma|jul|eud|hea|l s|enx|l z|jil|zen|aos|os |s l|d r|dei|ngt|gt | yi| he| si|nga|heb|zho|hon|did|d a| lo|b a|x c|dud|b b|lou| bi|dou|geu|b c|d k|x a|d w|wei|x b|l h|x d| qi|bad|t w| bl|blo|aod| nd|nia|deb| ja| sa|eut|ax |eab|s a| bo|lol|sat|ngl|gl | to|l m| pa|pao|b f|lia|x s|heu|t s|che| ca|can|s w|s y|sib|mis|zei|ux | pi|x r|gon|t p|jib|iel|d f| cu|ghu|unb|t c|inb| ko|x x\",\"hnj\":\"it | zh| ni|ab |at | sh|ang|nit|os | do|uat|ox |ax |nx |ol |ob | nd|t d|x n|nf |zhi|as | ta|tab|ef |if |d n|ad | cu| mu|cua|uax|mua|uf |b n|ib |s d|dos|id |enx|hit|nb | lo|f n|t l|ngd|gd |inf|us | go|ux |ed |she|b d|t n|b z| ho| yi|x z|aob|l n|t z|ong| zi|ix |nda|d z|yao|uab|enb|ut | de|f g| dr|dol| yo|zhe| le|euf|x d|inx| ne|nen|das|dro|ngb|gb | ge|d s|s n|f z|uef|hox|len|b g|il |ud |nd |gox| ua| na| du|x j|f y|oux|x c|han|ndo|of |f h| ja| gu| ny|zha|s z| da|uad|heu|lob|shi|ik | bu| ji|hai|ged|od |b h|t g| ya|ngf|gf | hu|ex |bua|you|rou|nil|hen|yin|zhu|out|ous|nya|is |f d|enf|b c|af |dou|lol|nad| re| ha| xa|uk |t s| id|xan|sha|hua|jai|b y|aib| qi| la|s s|d d|l m|ot |hue| xi|x g|x l|ren| kh| dl|ait| ba|aod| zo| ju|jua|zif| nz| ga| di|bao|x y|b s|x s|xin|aof| li|b b|x m|x t|eb |b l|ngx|gx |dax|b t|hef|gua| be|las|d j|s t|hed|nzh|l d|t y|hif| pi|f b|d l| ib|t h|f l|hou|dus|hun|und|s l|t r|el |uas|gai|ngt|gt |hab|aos| mo| zu| bi|f t| za|d y|x h|aik|k n|end|aid|ros| gh|zos|pin|ak |s x|d g|f s|s y| ao|k z|s b|due|mol| fu|dex|iao|x b|hik|x i|deu|l b| bo|b k|s m| lb|lb | hl|lan|uaf|d b|zho|al |eut| ro|ub |et |t c|d m|x x|d h| ch|d p|f x|t b| nt| su|uak|zis|shu|t t|gha|yua| we|oud|gon|d t\",\"ilo\":\"ti |iti|an |nga| ng|ga | pa| it|en | ka| ke| ma|ana| a | ti|pan|ken|agi|ang|a n|a k|aya|gan|n a|int|n t|ali|lin|a m|dag|git|a a|i p|teg|a p|nte| na|man|awa|kal|da |ng |ada|ega|nag|way|na | da|n i|sa |i k|n k|ysa|n n|al |a i|no |add|aba| me|eys|i a|nna|dda|ngg|mey| sa|ann|pag|ya |gal| ba|mai| tu|gga|ung|i s|kad|yan|tun|nak|wen| ad|aka|aan|enn|nan| ag|asa|i n|wan| we|nno|yaw|i t|l m|ata| ta|ami|a t|apa|ong| si|li |i m|kas|aki|ina|ay | an|n d|ala|a s|g k|gpa|mak|eng|ili|n p|et |ara|at |ika|ipa|dad|ama|nai|g i|yon| aw|in |ao |toy|oy |ta |on |aen|ag |bab|ket|aik|ily|lya|sin|tao|ani|agp| ki|a d|bal|oma|ngi|uma|g a|i i|kin|naa|bae|o k|y n|daa|gil|o t|iwa|ags|pad| am|syo|i b|kab|sab|ida| um|mil|aga|gim|ar |ram|yto|san|tan|min|pap|n m|eg |agt|o n|a b|aar|asi|ino|nom|nia|n w| wa| de|dey|pam|i e|sal|bag|saa|iam|eyt|day|kit|ak |ed |gsa|lak|t n|ari|nay|kan|nat|t k|i l|i u|sap| gi|g n|aw |sia|o p|o i|dum|i g|to |uka|agb|bia|aib|lub|ubo|ged| li|apu|pul|lan|imo|mon|y a|ma |pak|ias|sta|den|i d| id|bas|kai|gin|i w|kap|ita|asy|kni|kar|bon|abi|ad |umi|ban|agk|akd| ar|mid|din|sar|iba|nnu|inn|o m|ibi|ing|ran|akn|nib|isu|abs|maa|kda|aip|as | la|o a|t i|idi|nto|lal|amm|aad|or |adu|kua|ais|nal|w k|ulo|y i\"},\"Cyrillic\":{\"rus\":\" пр| и |рав|ств| на|пра|го |ени|ове|во |ани| ка|ть | по| в | об|ия |лов| св|сво|на | че|о н|ело|ост| со|чел|ие |ого|ния|ет |ест|аво|ажд|ый | им|век|ние| не|льн|име|ова|ли |ать|т п|при|каж|и п| ра|или|обо|жды| до|ых |дый|ек |воб|бод|й ч|его|ва |ся |и и|мее|еет|но |и с|аци|ии |тва|ой |лен|то | ил|ных|к и|енн|ми |тво| бы| за|ию | вс|аль|о с|ом |о п|о в|и н|ван|сто|их |ьно|нов|ног|и в|про|ако|сти|ий |и о|бра|пол|ое |дол|олж|тор| во|раз|ти |я и|я в| ос|ным|нос|жен|все|и р| ег|не |ред|тел|ель|ей |сно|оди|о и|а и|чес|общ|тве|щес| ко|ним|има|как| ли| де|шен|нно|е д|пре|осу| от|тьс|ься|вле|нны|аст|осн|а с|одн|ран|бще|лжн|быт|ыть|сов|нию| ст|сту|ват|рес|е в|оль|ном|чен|иче| ни|ак |ым |что|стр|ден|туп|ду |а о|ля |зов|ежд|нар|род|е и| то|ны |вен|м и|рин|нац|вер|оже|ую | чт|она|обр|ь в|й и| ме|аро|ото|лич|нии|бес|есп|я п|х и|о б|ем |е м| мо|дос|ьны|тоя|еоб|ая | вы| ре|и к|кот|ное|под| та|жно|ста| го|гос|суд|ам |ава|я н| к |ав |авн|ход|льс|нст| бе|ово|и д|ели| дл|для|ной|вов|ами|ате|оро|дно|ен |печ|ече|ка |еск|ве |уще|в к|нен|мож|уда|о д|ю и|ции|ког|вно|оду|жде|и б|тра|сре|дст|от |ьст|е п|нал|пос|о о|вны|сем|азо|тер|соц|оци|циа|ь п|олн|так|кон|ите|обе|изн| др|дру|дов|е о| эт|х п|ни |еди|дин|му \",\"ukr\":\"на | пр| і |пра|рав| на|ння|ня | за|ого| по|го |ти |люд| лю|во | ко| ма|юди|льн|их |аво|о н| не|анн|дин| св|сво|кож|ожн|пов|енн|жна| до|ати|ина|ає |а л|ува|не | бу|обо|аці|має| як| ос| ви|є п| та|аль|або|них|ні |ть | ві|ови| аб|бо |а м|ере|і п|без|вин|при|о п|ног|іль|ми |ом |та |ою | бе|ста|воб|бод|до |ост|ті | в | об|ва |о в| що|ий |ся | сп|і с|від|нов|кон|и п|ств|инн|нан|ван| у |дно|она|ват|езп|пер|но |ій | де|ії |ідн|и і|сті|під|ист|нні|ако|ьно| мо|бут|ути|ід |род|і в|що |ава|тис|а з|вно|ну |и с|ої |і д|ду |а в|ів |аро| пе|ний|а п|му |соб|яко|спр|і н| рі|рів|чи |ним|ля |нар|лен| ін|у в|нен|ому|нац|ися|и д|ова|ав |і р| ст|ові|нос| пі|ють|сть|ово|про|одн|у п|віл|овн|вни| ро| її|її | вс|ном|і з| ра| су|мож|чен|ві |буд|іст|івн|оду|а о|ни |сно|ими|а с| со|ьни|роз|и з|зна|я і|о д|х п|е п|о с|и в|дер|ерж|им |чин|рац|ції|і б| од|а н|сі |сту|тер|ніх|ди |їх |нна|так|о з|я н|заб|зпе|у с|спі| ні|е б|ржа|осо|я п|в і|кла|то |а б|осн|рим|сві|віт| дл|для|тва|ами|зах|рес| ре|ков|тор|соц|оці|ціа|і м|ки |тан|абе|печ|ког|ага|гал|ту |ї о|е м|оже|же |удь|ніс|ара|руч|авн|и щ|ною|я в|всі|кої|ини|ь п|осв|і і|ахи|хис|іал|а і|оди|тво|жен|нь |нал|ваг|аги|ги |інш|лив|х в|заг|роб|піл|в я|ком|об |о у|жав|і о\",\"bos\":\" пр| и |рав| на|пра|на |да |ма |има| св|а с|а п| да| по|а и|је |во |ко |ва | у |ако|о и|но | за|е с| им|аво|ти |сва|ава|о н|и п|ли |или|и с|вак|ост| ко|их |не |а у| сл|вањ| не| др|ње |кој|ије|ња |и д| би|ств|им |у с|јед| ил|сло|лоб|обо|бод| је| ра|при|ање|вје| об|а д|ом |се | су|е и|ју | се|сти|и и|а б|дру| ос|е п|вој|циј|у п|о д|а о|раз|су |ања|а н|ује|ова|у и| од|и у|ло |едн|ни |у о|ово|аци|ити|о п|а к|оје|жав|нос|дје|е о|бра|пре|шти|а ј|про|и о| ка|них|бит| тр|тре| бу|буд|у з|ог |ста|ја |држ|ржа|е д|миј|сво|реб|авн|ија|и н|е б|ђи |пос|ту |аро|род|ред| ње|ба |а з|ка |де |ем |ају|ива|ве |е у|јер|бил|ило| из|ени|ду | до|а т|за |еђу|нар|тва|одн|њег|гов| са|ним|м и|вим| ни|у д|јел|о к|оји| см|дна|уђи| ст|алн|ист|и м|еба|ран|ичн|вно| дј|у н|ода|нак|е к|ан |нов|сно|сту|нст|ено|чно|ани|ном|е н|тив|нац|аве|и б|сми|чов|овј|осн|а р|нап|ови|анс|дно|оја|ног|м с|еди|ара|ој |ну |кри| кр|оду|ико|рад|ник|туп| чо|јек|тво| вј| ми|тељ|обр|жив|заш|ашт|тит|уна|его|под|сам|о о|руг|ји | мо|ву | ов|х п|уду|рив|ење|дст|те | те|а ч|вни|сви|и в|ина|и т|ра |ите|у у|иту|међ|ак |дни|ниц|њу |нич|одр|вољ|ави|г п| оп| та|рим|кла|е т|ао | вр|акв|тно|мје|дуђ|она|ада|сто|оби|едс|то |оди|о с|ку |риј|у м|од |ичк|вен\",\"srp\":\" пр| и |рав|пра| на|на |ма | по| св|да |има|а п|а и|во |ко |ва |ти |и п|ако| у |а с| да|аво|ост|и с| за|о и|сва| им|вак|је |е с|ава| сл|о н| ко|ња |ом |но | не|не |ли |у с| др|или|сло|обо|кој|их |лоб|бод|им |а н|сти|ств|а о|ју | ил| би|при|а у| ра| је|ог |јед|ње |е п|у п|ни |а д|и у|едн|ити|нос|а к|о д|ање|ова|про| су|и и| ос|вањ|ста|дру|е и|циј|се |род| об|и о|ања|ају|е о|ове| де|аци| ка|ово|ја | ни| од|ве | се|и д| ст|м и|авн|и н|ује|ени|ија|дна|жав|у и|ред|су |нов|оди|вој|тва|е б|оја|што|у о|ара|а б|држ|ржа|одн|ним|ран|пош|ошт|а ј|ка | ов|у у|ду |аве|осн|сно|шти|аро|раз|бит|а з|у з|ења|де | из|них|о п|у д|е д|пре|ву | тр|ту |еђу|нар|гов|без|ичн|за |вно|ло |у н|оји| са|то |ан |нак| ме| ње|чно|сво|вим|нац|ода|ји |ани|ме |ико|ник|ика|е к|пос| кр|тре|реб|нст|сту|е у|ку | до|ашт|тит|алн|дно|њег|ном|ног|м с| вр|о к|ој |чов|анс|ови|о с|бра|те |тав|туп|ено|жив|заш|ем |и м|дни|вар|рив|руг|вољ|ави|штв|е н|као|ао | ли|ст |ило|њу |сме|о ј| см| чо|оду|вре|дст|од |а т|кри| бу|буд|и в| ве|вер|а р|дел|тво|међ|оје|м п|ављ|его|под|ена|уги|ла |пор| оп|руш|ушт|ком|еди|ба |кла| мо|и б|как|акв|рад|ну |век|рим|гла|јућ|уде|вни|еба|е р|сви|м н|иту|тер|ист|а ч|пот|рем|ниц|у в|х п|ива|сам|о о| он|езб|збе\",\"uzn\":\"лар|ан |га |ар | ва| би|да |ва |ир | ҳу|ига|уқу|бир|ҳуқ|қуқ|ган| ҳа|ини|нг |р б|иш |ни | та|лик|инг|ида|а э|или|лиш|ари|нин|иши| ин|инс|он |ади|нсо|сон|ий |лан| ма|дир|кин|и б|ши | бў|ҳар|бўл| му|уқи|дан|ила|қиг|р и|қла| эг|эга| ўз|а б| эр|эрк|кла|қил|оли|ки |гад| ол|нли|лга|и ҳ|рки|лиг|иги| қа| ёк|ёки|иб |н м| ба| қи|н б|ри |ара|атл| бо|ҳам|лат|бил|ин |р ҳ|а т|ала|лаш|бош|ик |инл| эт|ш ҳ|а ҳ|и в|ниш|тла|эти|тил|мас|а қ|и м|оси|им |ат |уқл|арн|рни|қар|ани|а и|ўли|ги | да|н ҳ|риш|мла|ли |и т| ха|арч|рча|ча |бар|аси|ўз |а а|рла| бу|а м|лин|ати|ият|либ|таъ| ту| ас|тиб|аро|а о|ун |тга|р в|икл| бе|мум|н қ|али| те|сид|ш в|мат|амд|мда| ке|лла|шга|н э|дам|амл|хал|ола| қо|ири|ирл|илл|а ш|рга|иро| шу|тиш| де|умк|мки| эъ|тен|енг|а ў|рда| са|гин|имо|тар|а ё|ур |рак|алқ| ки|аза|к б|ода|сий|а к|тни|ўлг|н в|нда|шқа|зар|н о|и қ| ми|мил|р т| си|ак | ша|ор |кат|ера|сиз|ам |асо|сос|н ў|шла|н т|нид|ошқ|й т|ана|ти |рин|асл|бу |син|дав|илг| со|ас |нга|лак|ино|ъти|муҳ|а в|аш |бор|лим|уни|лли|н и|си |и э| ка| то|а д| жа|ами|қон|на |риг|лма|кер|авл|вла|и а|дек|екл|ят |ака| эм|эма|эът| ҳе|ҳеч|еч |ким|икд|кда|сит|лад|и ў| ни|ник|ага|и о|и с| уч|учу|чун|аъл|ъли|анл|аёт| иш|а у|ўзи|диг|ай |ада|оий|мия|тда|а с\",\"azj\":\" вә|вә |әр |лар| һә|ин |ир | ол| һү|һүг|үгу| би|гуг|на |ләр|дә |һәр| шә|бир|ан |лик| тә|р б|мал|лма|асы|ини|р һ|ән |шәх|әхс|гла|ары|а м|дир|али|аг |угу| ма|илә|ын |уна|јәт| ја|ара|икд|ар |әри|әси|р ш|рин|әти|дән|нин|н һ| аз|јјә|син| мү|тин|ни |зад|ијј| мә|әрә|мәк|үн |нда|әт |и в|ыны|нын|ндә|ә а|аза|рын|гун|олу| ет| га|лыг|илм|кди|лә |ә ј|әк |лмә|ына|инд|олм| ин|хс |мас|сын|лун|ә б|да |н т|әми| бә|адл|длы|н м|нә |г в|ја |тмә|бәр| он|ә һ|әја|сы |нун|етм|дан|инә|маг|ун |раг|ә в| ва|н а|н б|рлә|ә м|си |әра|н и|ынд| өз|аны|нма|инс|ама|ры |ығы|ли |ил | ал|ала| ди|ә д|ик |ирл|ләт|а б|бил|ыг |мүд| сә|ә и|ны |нла|әлә|дил|алы|ә е|унм|н в|ола|аси|үда|или| дә|нса|сан|угл|ә о|хси| һе|уг |әтл|һәм|әни|ејн|у в| да|тәр|мин|јин|кил|дыр| бу|лан|иш | һа|мәс| ки|ми |лығ|ә г|г һ|и с|даф|афи|фиә|р в| иш| әс|сос|оси|сиа|хал|алг| та| ас| ед|бу |һеч|еч |рә |јан|ы һ|ким|ији|ы о|ина|сиј|әса|сас|а г|јар|лы |түн| ис|ист| со|ал |н ә|ифа|әмә|ә т|мил|илл|лыд|ыды|ыр |әдә|ыгл|лиј|тлә|а һ|мәз| бү|бүт|үтү|ија|иә | үч|үчү|чүн|т в|дах|ахи|хил|р а|ылы|ман|сил| се|сеч|адә|иал|ону|өз | ҹә|миј|әји|н е|еди| ми| нә|а в|мән|рил|әз |илд|раб|абә|шәр|ғын|аја|зам| ни|улм| ха|тәһ|әһс|һси|и һ|сти|гу |вар|ад |там|уғу|з һ|ган|рәф|н д\",\"koi\":\"ны |ӧн | бы|да | пр|пра|лӧн| мо|рав| да|быд|лӧ |орт|мор|ӧм |аво|ӧй | ве|нӧй|ыд |ыс | не|сӧ |ын |тӧм|во |сь |эз |льн|ьнӧ|тны| ас|д м|ыны|м п| и |сьӧ| по| ӧт|то |бы | эм| кы|тлӧ|эм | от|аль|н э|вер|ртл| кӧ|ӧ в| ко|ерм|ств|воэ| до|тшӧ|ола|ылӧ|вол|ӧс |ы с|ліс|ісь|а с|ас |кыт|тво|кӧр| се|нет|ето|шӧм|ӧдн| ме|мед| ол|злӧ| вы|ӧ д|ӧ к|та |аци|ӧ б|вны|лас| на|з в|ӧрт| во|на |а в|ась|ыдӧ| сы|едб|дбы| вӧ|лан|рмӧ| оз|оз | сі|ытш|оэз|ӧтл|ы а|оти|тир|с о|олӧ| чу|ись| эт|ция|рты|тыс|ы б|кол|ы п| го|сет|кӧт|тӧг|ост|тӧн|н б| со| сь|рті|ӧтн|н н|дз | ке|кер|о с|мӧ |ӧ м| мы|ис |а д|ӧг |дӧс|ест|нӧ |пон|онд|ы н|сис|нац|итӧ|н п|суд| уд|удж|выл| ви|эта|н м| эз|ана|ӧны|с с|ть |орй|йын|сси|рре|рез|ьӧр|ті |сыл|ысл|нда|мӧд|з к|а п|с д|ӧр |чук|укӧ|рны|ӧмӧ|кин|рт |овн|ӧт |она|нал| об|ӧ о|отс|лӧт|й о| тӧ|тӧд|дны|асс|кон|слӧ|ы д|скӧ|с в|с м|ытӧ|езл| ло|быт|осу|эзл|кӧд| ум|умӧ|мӧл|ӧ п|асл|тра| ст|ь м|сьн|ьны|ь к| ов|код|сть|а н|ы к|тла|а к|ӧтч|дор|иал|а о| пы|н к|оль| за|аса| дз|нек|а м|н о|етӧ|ӧ н|ерн| сэ|ы м| де| чт|что|йӧ |ы ч|еки|поз|озь|езӧ|вес|ськ|исӧ|ӧтк|тко|рйӧ|ион|ннё|з д|ӧмы|тсӧ|са |кыд|енн|соц|оци|циа|й д|пыр|зын|нӧя|ӧя |зак|ако| мӧ| а |еск|а б|ан |тӧ |гос|уда|дар|арс|рст|рлӧ|ӧ с| ли|эсӧ|оля|мӧс|ӧсь|дек\",\"bel\":\" і | пр|пра|ава| на|на | па|рав|ць |ны |або|ва | аб|ацы|ае |аве| ча|анн|льн|ння| ма| св|ала|сва|не |чал|лав|ня |ых |ай |га | як|век|е п| ад|а н| не| ко|ага|пры|кож|ожн|а п| за|жны|ы ч|дна|бод|а а|цца|ца |ваб| ў |мае|ек |і п|ных|нне|пав|а с|асц|бо |ам |ста| са|ьна|ван| вы|одн|го |аць|наг|він| да|дзе|ара|мі |цыя|оўн|тва| ра|і а|то |ад |ств|аві|лен| ас|і с|най|аль|енн|і н|ці |аро|аво|рац|сці|пад|к м| яг|яго|іх |ама| бы|рым|род|і і|ым |энн|што| та|я а|нан|ана|нас| дз|ні | гэ|гэт|а ў|інн|а б|ыць|чын|да |оў | шт|ыі |а і|агу|які|ным|дзя|я п|цыі|і д|ьны|нар| у |ўна|оль| ўс|х п|нац|ыя |ах | ус|ымі|ля |амі|ыма| ні| гр|воў|ў і|адз|эта|іна|ход|о п| ка| ін|ы п|зна|нен|аба|быц|рад|ўле|чэн|ь с|чы |сам| ст|асн|і р|ду |аў |ера|ры |нал|жна|уль|рам| су|аны|кла|аюч|ючы|оду|ую |а р|ўны|маю|ука|кац| дл|для|ь у|пер|е і|нае|ако|і з|гра|адс|ыцц|яўл|і ў|яко|а з|кан| ро|роў|нст| шл|адн|ода|аса|аду|нав|вы |ы і| пе|і м|кі |але|х і|авя|алі|раб|мад|дст|жыц|раз|зе |нна|ані|х н|е м|ада|нні|ы ў|о н|дзі|я я|люб|аюц|бар|дук|ахо|а в|сац|авы|так|я ў|тан|зак|чна|заб|бес|я і|ваг|гул|ім |ган|зяр|ярж|ржа|жав|ве |е а|м п|ацц|од |ены| дэ|ну |у ш|нах|вол|а т|ога|о с| бе|інш|ака|усе|яна|ека|ка |сно|рас| рэ|ь п|ніч|чац|се |і к\",\"bul\":\" на|на | пр|то | и |рав|да | да|пра|а с|ва |ств|та |а п|ите|но |во |ени|а н|е н| за|о и|ото|ван| вс|не |ки |те | не|ове|о н| по|а и|ава|чов|ия |ане|ни | чо|ие |аво| св| об|а д|е п|век|ест|сво| им|има|и ч|ани|ост|и д|ние|все|тво|или|ли |и с|вот|а в|ма | ра|ват|и п|сек|еки|ек |а о|и н| в |е и| ил|ова|при| се|ето|ата|аци|воб|обо|бод|к и|пре|ат |оди|раз| съ| ос|а б| бъ|ред| ка| ко|лно|ния|о д|бъд|о п|се | от|за |о в|ъде|ята| е | тр|и и|о с|тел|и в|от |ран|е с|нит| де|ка |бра|ен |общ|де |алн|и о|ява|ият|ция|про| до|нег|его|а т|нов|ден|как|ато|ст | из|а ч|тря|ряб|ябв|бва|а р|а к|вен|о о|щес|а з|ено|гов|тве|нац|дър|ърж|ржа|е д|нос|лен|ежд|род|е о|и з|вит| та|зи |акв|ез |она|обр|нар|нот|иче|о т| ни|кат|т с| с |йст|авн| бе|осн|сно|вни|пол|рес|аро|кой|зак|е в|тва|нен|е т|ува| ли|ейс|жав|едв|стр| ст|без|вси|сич|ичк|чки|вид|си |жен|под|еоб|нст| те|ди |ри |сто|ган| дъ|а е|и к| че|ода| ср|сре|ака|чес|и р|и м|т н|одн|о р|лич|елн| ре|бще|ник|ели|че |дви|еме|ира|жда|кри|лни| си|са | то|ой | ме|оет|гра|ход|дру|ичн|еди|дос|ста|дей|я н| къ|ан |ико|чре|й н|ави|нал|пос|тъп|ра |азо|зов|рез|той| со|меж|тно|т в|и у|нет|нич|кон|клю|люч|нео|чит|ита|а у|а м|дно|оят|елс|лит|ине|таз|ази| мо|що |т и|изв|тви|чен\",\"kaz\":\"ен |не | құ|тар|ұқы| ба| қа|ға |ада|дам|құқ|ық | ад| бо|ына|ықт|қта| жә|ар |ың |ылы|жән|әне|мен| не|лық|на |р а|де |ін |ары|а қ| жа|ан | әр|қыл|ала|ара| ме|уға|н қ|еме|ның| де|іне|ам |асы|тан|лы |әр |да |ста|нды|еке|ығы| өз|ған|анд|ын | бі|мес| қо|бол|бас|ің |ды |етт|ып |ілі|н б|нде|ері|е қ|қық|бір|лар|алы|нем|есе|се |а ж|ы б| ке|тын| ар|е б|бар|ге |ост| ти|тиі|олы|ік |інд| та|аты|сы |е а|дық| бе|ы т|нда| те|ры |ғы |бос|ғын|луы|иіс|сын|рде|рын|еті|қығ|алу|іс |рін|іні|е ж|дар|ім |егі|н к|қар| ер|тті|н ж|ыры|аны|лға| са|уын|ынд|ыны|ы м|рға|ген|ей |тік|тер|нің|ана|уы |аза| от|нан| на|е н|гіз|тық|мыс|ы ә|мны|м б|өзі|сқа|қа |е т|ң қ|еге|ке |ард|нег|луғ|лан|амн|кін|і б|асқ|рал|ті |ру |айд|тта| же|а б|р м|рды|кет|аса|ді |өз |ама|дей|н н|тыр|ауд|ігі|лып| мү| ал|зін|лік|дай|мет|жас|бер|тең|арқ|рқы|а о|е ө|қам|елі|рлы|ы а|а т|дер|біл|р б|еле|қор|ден|тін|уда| тү| жү|кел|і т|ір |лге|ы ж|ең |а д|тты|оны|гін| ха|ркі|лде|е м|н т|түр|оға|ікт|кті|зде|жағ|уге|ауы|рыл|ұлт|лтт| ос|осы| то|ция|ы е|н а|ау | ау|ені| ел|н е|оты|шін|ыс |қты|імд| да|сіз|лма|кім|ң б|лім|қат|зі |орғ| әл|хал|ерк|ек |құр|тте|е д|ағд|ғда|елг| ас|ірі| ұл|ағы|амд|тал| со|рып|ылм|лін|ным|мас|сыз|дан|із |ірд|ай |гі |сты|ым‐|ң ж|с б\"},\"Arabic\":{\"arb\":\" ال|ية | في|في |الح| وا|وال| أو|ة ا|أو |الم|الت|لحق|حق |كل |لى |ان |ة و|الأ| لك|لكل|ن ا|ها |ق ف|ات |مة |اء |ما |و ا|ون |ته |الع|أن |ي ا|ي أ|شخص|ة ل|الإ| عل| أن|م ا|حري|الا|من |على|حقو|قوق|ت ا| شخ|لا |ق ا| لل|فرد|رد | أي|أي |رية| كا|د ا| ول| من| إل|خص |ا ا|وق |نسا|ل ف|ا ي|ه ا|ة أ|كان|ن ي|امة|جتم| حق|الق|ام |دة | لا|ل ش|إنس|سان|ين |ة م|اية|ن ت|ا ل|ذا | فر|ن أ|هذا|لة |اً | عن|ى ا|لتع|اسي| دو| حر|ع ا|ه ل|لك |ه و|ترا|له |ماع|د أ|ي ح|إلى|الج|الد|، و| با|ن و|ي ت|نون|لعا|مع | هذ|ة ع|لحر|يات|عية|ص ا| وي|لإن|لأس|أسا|ساس|سية|بال|ي و|حما|ماي| إن|الف|انو|ير |رام|ا و|عام|دول|مل |الو| مت| له|الب|ساو|ة ب|هم |ع ب|علي|ك ا|لقا|قان|تما|ة ت|ى أ|ول |ة ف|ا ب|اد |الر|ل و|ل ا|انت| قد|لجم|لمي|لتم|تمت|اعي|ليه|لمج|ه أ|ا ك|ال |لأم|لمت|لإع| يج|لدو|ق و|ريا|يه |رة |ن ل|دون|تمي|كرا|يد |ذلك| يع|ر ا|تعل|عال|تسا|لاد|اة |قدم|متع|تع |اجت| كل|مان|غير|اته|م و|مجت|تمع| مع|مم |لان|يجو|جوز|وز |عمل|دم |فيه|الض|ميي|ييز|متس| عا|أسر|ن م|معي|لات| مس|لاج|عن |ي إ|ليم|يم | أس| تع|يز |مية|جمي|ميع|الش|اعا|ة، |الس|شتر|لمس|لما|ني |لي |يها|ملا|ود |تي |لضم|ضما|اعت|ر و|اق |ي م|ي ي| بح| تم|تنا|أمم|تحد|حدة|إعل|علا|ه ع| جم|عة |م ب|ولم|الن|ل إ| به|ب ا|اوي|قد |أية|قيد|د ب|اك |وية|إلي|لزو|د م|مست|كاف|وله|ه ف| ذل| وس|لحم|نت | أم| مر|مرا| وأ| وع\",\"urd\":\"ور | او|اور|کے | کے| کی|یں | کا|کی | حق|ے ک|کا | کو|یا |نے | اس|سے |ئے |کو | ہے|میں| می|ے ا| کر| ان|وں | ہو|اس |ر ا| شخ|شخص|ی ا| جا| سے|حق |ہر |خص |ے م|ام | یا|ں ک|ہیں|سی | آز|آزا|زاد|ادی|ائے|ہ ا|ص ک|ا ح|جائ|ہے |کہ |ر ش|ت ک| پر|ی ک|م ک|۔ہر|پر |ا ج|ان |دی |س ک|ق ہ|ہے۔|ر م|ں ا|ی ح|و ا|ار |ری |ن ک|کسی|حقو|قوق| مع|ے گ|ی ج|وق | ہی|ر ک|سان|نی |کرن| حا| نہ|تی |ی ت| جو|ئی |انس|نسا| کہ|اپن|ل ک|جو | اپ|ے ب|یت |نہ |ہ ک| مل|ہو |می |ل ہ|رے |ی ش|رنے|ے ل|ے ہ| کس| ای|ا ا|۔ ا|حاص|اصل|صل |معا|نہی|ی م|وہ |یں۔| تع|انہ|ق ک|د ک|ی ب|ات |ملک|ایس|ی ہ| بن| قو|قوم|کیا|ے، |عاش|اشر|ر ہ| گا| دو|یہ |وام|دہ |ں م|ا م| من|بر |انی|ے۔ہ|ر ب|دار|ے ج| وہ| لئ|لئے| عا|اقو|قوا|مل |ائی|علا|اد |ی س| جس|ر ن|ے ح|ہ م|کر |و ت|لیم| و | قا|انو|ا ہ|جس |یوں| یہ|لک |ریق|ے۔ |نیا|تعل| گی|گی |ر پ|دوس|ی آ|یم |، ا| اق|وئی|یر |پنے|ے پ|م ا|گا۔|یاد| رک|علی| مس|ی، |ین |ن ا|انے|وری|ی ن|لاق|ر ع|ون |خلا| با|ا س| سک| دی| چا|رائ|ومی|ہ و|نا |اری| بر|رکھ|ندگ|دگی|ر س|رتی| بی| شا|س م|ق ح|ادا| مم| ہر|ا پ|و گ|وسر|سب | پو|قان|نون| بھ|ے خ|اف | اع| مر|یسے| پی|غیر|ے س|ال |ت ا|، م| مح|ں، |بنی| ذر|ذری|ریع|ہوں| عل|تما|مام|ونک|نکہ|دان|پنی|ر ح| ام|من |عام|پور| طر|ے ع|ائد|بھی|ھی | مت| مق|د ا| خل|لاف|اعل|کوئ| لی|و ک|ے ی|ا ک|ر آ|دیو|اں |چون|، چ|یاس|برا|کرے|ی ع|ر ج\",\"fas\":\" و | حق| با|که | که|ند | در|در |رد | دا|دار|از |هر | از|یت | هر|ر ک|حق |د ه|ای |ان |د و| را|ود |ین |یا |ارد|کس |ی و|را | یا| کس| بر|باش|د ک|ه ب| آز|آزا| خو|ه ا| اس|د ب|زاد|ار | آن|ق د|شد |حقو|قوق|ی ب|ه د|ده |وق |ید |ی ک|ر م|خود|ور |و ا|رای|اشد|ام |تما| اج|ری |ادی|س ح|دی |اید|است| ان|نه |و م|د ا|ر ا| بی|با |انه|ی ا|د، |ون | تا| هم| نم|ات |مای|ا ب|ایت|ر ب| بش| کن|انو|اسا| مر|ست | مو| مل|برا|وان|این|جتم| می|ورد| شو| ای|ن ا| اع| به|ت و|، ا|اجت|ماع|عی |ا م|ائی|ئی |و ب|نی |ملل|ت ا|و آ|آن |بشر| زن|ی، |کند|ن م|ن و|بای|شود|ی ی|های| من|شور| مس|کار|ت ب| بد|دان|اری|اعی|د آ|مل |ز آ|یگر|ی ر|ت م|مور| گر|گرد| مق|توا|ی م|علا|یه |ن ب|میت| شد| کش|کشو|ه و|ق م|د ش| مج| اح|ن ت|و د| حم|لی | کا|ت ک|هٔ |نون|مین|دیگ| عم|انی|ر خ|ه م| مت|ن ح|ی د|لام|رند|اه |نجا|بعی|نوا|ساس|ساو|د م| آم|ادا|وی |گی |هد |ا ک|اد |ی ح| مح| قا|قان|می |یده|مقا|لل |ر ش|ق و|اعل|ا د|شده|ع ا| بع|اسی|د ت|همه|سان|شر | عق|ر و|دگی|حما|ا ه|خوا|‌ها|ه‌ا| او|او |اده|اً |ر ت| دی|ومی| شر|نمی|بر | هی|هیچ|یر |ز ح|مند|بین|تی |جا |عقی|یتو|م و|مسا|و ت|سی |اوی|بهر|م م|ر د|انت|زش |ارن|زند|ندگ|و ه|رفت|رار|واه|ا ر| بو|تأ|أم|ٔمی|ران|عمو|موم|ی ن|اند|ل م|ردد|ه ح|عیت| فر| بم|دیه|ا ا|نما|آنج|کلی|احد|حدی|مال| تع|و ح|مرد|ت، |ملی|ق ا|واد|م ا|د د| خا| ار|اشن|شند\",\"zlm\":\" دا|ان |دان| بر| او|ن س|له | ڤر|كن |ن ك|دال|ن ا|ن د|رڠ |حق |يڠ | كڤ|ارا| يڠ|أن |تيا|ڤد |ورڠ|ڠن |اله|ياڤ| تر|ولي|ن ڤ|اور|كڤد|برح|رحق|ين |ستي|اڤ |را |ليه| ات|ه ب| ست|يه |اتا| عد|عدا|ن ب|تاو|ڤ ا|او |ن ت|بيب|يبس|سي | كب|ه د|ن م| من| سو| سا| حق|ق ك|اسا|سام| تي|ن ي|الم|لم | اي|ن، |رن |اتو| ما|د س| با|باڬ|نڬا|ڬار| مم|كبي|بسن|سن |اين|ڠ ع|ڽ س|چار| سب|ي د|ندق|د ڤ|اڽ |اڬي|سبا| ڤم| د |نسي|ا ڤ|هن |قله|يند|تا |ي ا|ام | بو|ڬي | نڬ|اون|تن |وان|ا س|مأن|أنس|ڠ ب| كس| سم| سچ|سچا|ا ب|بول| مأ|سيا|ساس|اسي| ڤڠ|بڠس| دڠ|دڠن| ڤو|ڤا |ت د|رتا| هن|هند|دقل|ي م| اس|ادي|نڽ |ات |تره|رها|هاد|ادڤ| لا|تي |ڤرل|مان|، ك|بار|ارڠ|ق م|ڤون|ون |، د|اي |اول|ق٢ |٢ د|ڠسا|تو |يكن|وين|ن ه|اكن|يأن|وڠن|دڤ |وا |ا د|ن٢ |نتو|وق | سس|ماس|اس |ه م|مرا|ندو| ان| بي| مڠ|ڠ٢ |ائن|رات|يك |حق٢|برس|اد |ي س| كو|مڤو|ري | مل|وات|واس|ڤمب|، ت| سر|سرت|امر|سمو|اڬا|رلي|لين|دوڠ|ل د|تار|ڠ م|، س|وند|ي ك|لوا|سوا|ارك|تيك|ڤري|رسا|ياد|ريك|ا، |ونت|ڠ ت|ترم|ڤرا|سأن|اڤا|ي ڤ|ا ا| در|رأن| ڤن|سوس|ورو|ڠ س|لائ| بڠ|٢ ب|توق|دير|يري|وكن|جوا|هار|ندي|ارأ|وه |كرج|ڠڬو|ي، |موا| كأ|اجر|جرن| به|بها| مر|راس| كم|و ك|نن |ڤرك|ندڠ|دڠ٢|ا م| سڤ|ا٢ |سات|ق ا|ڤ٢ |شته|تها|سال|ينڠ|سسي|وهن|مول|منو|وبو| دل|وار|كور|د ك|ا ك| ڤل|لاج|ڠ ا|مبي|نتي|تيڠ|وسي|يال|ال |انت|نتا|بس |هڽ |ن ح|ه ا|كڤر|ڠ د|م س\",\"skr\":\"تے |اں | تے|دے |دی |وں | دا| کو| حق|کوں|ے ا| دے|دا | دی|یاں| کی|ے ۔|یں |ہر | ۔ | ہے|ہے | وچ|کیت| ان|وچ | شخ|شخص|ال |ادی| حا|اصل| نا|ے م|خص |ں د|حق |حاص|صل |یا | ای|ل ہ|اتے|ق ح|ے و| ات|ں ک|سی |ہیں| مل|ی ت|نال| از|ازا|زاد| او|حقو|قوق|ار |ا ح| ۔ہ|۔ہر|ر ش|ے ج|ص ک|وق |دیا|نہ |یند|ندے| یا| کر|ئے | جو|کہی|ی د|انس|نسا|سان|وند|ی ا|یتے|و ڄ|ڻ د|یسی| وی|ا ا|ملک|ے ح|ے ک| ہو|ے ب|ں ا|ا و|ئی |ر ک|تی |آپڻ|وڻ |ندی| نہ|ویس| آپ| جی|اون| کن|انہ|ن ۔|جو |ی ن|ان | کہ|ری | تھ|ے ہ| ڄئ|۔ ا|ے ن|ی ۔|ڻے | ہر|ام |دہ |ں ت|ں و|ں م|تھی| من|کو |ی ح|کنو|نوں|ہاں| بچ|ے ت|رے |ون |ی ک|ور |ہکو|نی |یاد|ت د|یتا|ی ہ|نہا|ن د|اری|تا |لے |ڄئے|ے د| ہک| قو|پڻے|می |ی م|قوا|وام| ون|ق ت|اف |ل ک|اے | تع|ین |چ ا|خلا|ل ت|لک |ہو |ارے| و |انی|جیا|ے س| سا|ن ا|دار|یت |ی ج|ئو |ی و| اق|علا|کرڻ|ونڄ|ات | اے|ر ت|ق د|الا|ہوو| چا| رک|بچئ|چئو|وری| وس| لو| پو|پور|قنو|نون|ہ د|ے خ|ایہ|و ا|این| ڋو| خل|لاف|ڻ ک| جا| ۔ک| عز|عزت|ا ک| مع|ے ع|یر |قوم|ں آ|او |اد |ب د|ریا|مل |رکھ|وسی|سیب|یب |کاں| قن|اقو|رڻ |وئی|ں ج|ا ت|ل ا|زت |ت ت|ر ا| سی|لا |وے |ہی |ا م|ے ر|تعل|ں س| سم|یوڻ|ر ہ|ڻی |اوڻ|لوک|م م| مت|متح|تحد|حدہ|ایں| اع|ے ذ| جھ|جھی|کوئ|کار| کھ|ہ ا|ھین|م ت| کم| ہن|ہن |ی، |ں ب|د ا|سار|ن ک|علی|لیم|نڄے|ڄے |ی س|یہو|ھیو|ائد|و ک|ائی|ے ق| مط| سڱ|سڱد| ذر|ذری|ھیا|نے |کیو\",\"pbu\":\" د | او|او |په | په| چې|چې | حق|ي ا|ره |ې د|نه |و ا|و د|ه ا|هر |ه و| څو|ه د|ري |حق |ي چ| کښ|څوک|وک |وي | شي|له |غه |کښې|ښې | سر| لر|لري|و پ|ه پ|ټول|لو |يت |سره|کړي|ي۔ه|ه ک|ي، |ر څ| ټو|ق ل| له|يا | هغ| از|۔هر|د م|ازا| کړ|دي |هغه| کو|نو |د ا|حقو|قوق|زاد|ه ت| پر| وا|ولو|خه |ه ه| وي| څخ|يو |ه م| يا|ول |د د|څخه| دي|ه ش|کول|ي د|ته |ه ب|ګه |و ي|ړي |اد |و م|ونو|شي۔|د ه|دې |خپل|واد| مل| هي| نه| تر| تو|د پ|ک ح|ې پ|ان |ولن|ني |ه ح|يوا|تون| با|ادي| هر| يو| مس|ي و|ې ا|لي |ې و|ي پ|د ت|يد |امي|وقو|شي |ړي۔|دان|انه|وګه| عم|هيو| دا| دغ|قو |ي۔ |ه چ|ار | خپ|بشر|توګ|اند|هغو|لني|باي|ايد| ده|ه ن|وي،|و ه|، د|ي ح| بر|غو | تا|ين |ايت| شو|شوي|دغه|مي |م د|دهغ| من|و ح| لا| ډو|ډول|بعي|پل | بش| ته|اوي|ه ګ|د ب|نيز|پر |ده |و ت|انو|نون|ون |ومي|رو |هيڅ|يڅ |ي ت|علا|ه ي|ه ل|وم |کار|ساو|تر |وند|ونه|يه |ن ک|مين|موم|و ک|اتو| اع|اعل|لام|اره| ځا|مسا| ان|د ټ|ټه | ګټ|ي ش| بي| مح|قان| پي|و ر|اخل|تو |اسي|سي | وک|ديو|ځاي|عقي| ور|لان|ل ت|ه س|ې چ| وس|و س|وون| ژو|ژون|يز |وکړ|کي |ن ش|ندې|ک د| اس| قا| نو|عمو|لتو|و ب|پار|ولے|لے |ې ک| عق|۔هي|څ څ| را|بل | بل|وسي|ت ا|ر د| ار| هم|هم |دو |ي م|مان|اسا|رته|شري|ا د|ر م|ښوو| رو|ګټه| غو|ونک| وړ|مل | شخ|شخص| اج|د ق|تام|وق |ملت|و ن|من |و څ|ا ب|ن ا|قيد| چا|ل ه| تب|تبع|ر پ|حما| کا|د خ|ر س|اني|نځ \"},\"Devanagari\":{\"hin\":\"के |प्र| के| और|और |ों | का|कार| प्|का | को|ं क|या |ति |ार |को | है|िका|ने |है |्रत| अध|धिक|की |अधि|ा क| कि| की| सम|ें |व्य|्ति|क्त|से | व्|्यक|ा अ|में|मान|ि क| स्| मे|सी |न्त|े क| हो|ता |यक्|ै ।|क्ष|त्य|िक | कर| या|्य |भी | वि|रत्|ी स| जा|र स|्ये|येक|ेक |रों|स्व|िया|ा ज|त्र|क व|र ह| अन|्रा|ित |किस|ा स|िसी|ा ह| से|ना |र क| पर| सा|गा |देश| । | अप|ान |समा|्त |े स|्त्|ी क|ा प| ।प|वार| रा|न क|षा |अन्|।प्|था |ष्ट| मा|्षा|्वा|ारो|तन्| इस|े अ|ाप्|प्त|राष|ाष्|्ट्|ट्र|्वत|वतन| उस|राप|त ह|कि | सं|ं औ|हो | दे|किय|ा ।|े प|ार्| भी|करन| न |री |र अ|जाए|क स|ी प|िवा|सभी|्तर|अपन| नि| तथ|तथा|रा |यों|े व|ाओं|ओं |पर |सम्|्री|ीय |सके|व क| द्|द्व|ारा|िए | ऐस|रता| सभ|िक्|ो स|रक्|र प|माज|्या|होग|र उ|ा व|रने| जि|ं म|े म|ाव |ाएग| भा|पने| लि|स्थ|पूर|इस |त क|ाने|रूप|भाव|लिए|े ल|कृत|र्व|ा औ|ो प|द्ध| घो|घोष|श्य|ेश |। इ| रू|ूप |एगा|शिक|े ब|दी | उन|रीय|रति|ूर्|न्य|्ध |णा |ी र|ं स|र्य|य क|परा| पा|े औ|ी अ|ेशो|शों|ानव|ियो|म क| शि| सु|तर्|जो |्र |तिक|सार|चित| पू|ी भ|जिस|ा उ|दिय|राध|चार|र द|विश|स्त|ारी|परि| जन|वाह|नव | बु|म्म|ले |्म |र्ण| जो|ानू|नून|िश्|गी |साम|ोगा|रका|्रो|ोषण|षणा|ाना|ो क|े य| यह|चूं|ूंक|ंकि|अपर|कोई|ोई |ाह |ी म| ।क|ी न|ा ग|ध क|े ज|न स|बन्|निय|याद|ादी|्मा| सद|जीव|हित|य ह|कर |ास |ी ज|ाज |ं न|्था|ामा|कता\",\"mar\":\"्या|या |त्य|याच|चा | व |ण्य|प्र|कार|ाचा| प्|धिक|िका| अध|च्य|अधि|ार | आह|आहे|हे |ा अ| स्|्रत|स्व|्ये|ा क| कर|्वा|ता |ास | त्|ा स|त्र|ा व|िक |यां|ांच|वा |मान| या|्य | अस| का|रत्|ष्ट|येक|ल्य|र्य|र आ|ाहि|क्ष| सं| को|कोण|ामा|ाच्|ात | रा|ा न|ेका| सा|ून |ंत्| मा|चे |तंत|राष|ाष्|्ट्|ट्र|ने |े स|वात|करण| कि|किं|िंव|ंवा|व्य|ा प|कास|ना | मि| सम|क्त|ये |मिळ|समा|र्व|ातं|्र्|े प| जा|यास|व स|ोणत|ीय |ा आ|रण्|काम| दे|ांन|े क|ा म|रां| व्|्यक|हि |ान | पा|्षण|िळण| आप|ार्|ही |े अ|ा द|ली |ळण्|े व|ची | आण|ंच्| वि|ारा|्रा|ाही|मा |ा ह|द्ध|्री| नि|णे |ला | सर|सर्| नय|नये|ाचे|ी अ|्व |ंना|षण |आपल|ले |माज|बंध|ी प|्त |त क|लेल| हो|ील | शि|शिक|ध्य|ी स|आणि|णि |े ज|देश|न क|ानव|पाह|हिज|िजे|जे |रीय|क स|व त|यक्|ा ज|यात|िक्|त स|े आ|रक्|पल्|वी |संब|ंबं|न्य| ज्|ज्य|स्थ| के|्वत|असल| उप|य अ|क व|त्व|ीत |त व|केल|ाने|य क|णत्|ासा|रति|भाव|े त|व म|ेण्|िष्|साम|क आ|सार|कां|याय|साठ|ाठी|ठी |े य|ंचा|करत|रता|र व|्ती|ीने|याह|र्थ|च्छ|ी आ|स स|ोणा|संर|ंरक|त आ|ंधा|ायद|ी व|ेशा|ित | अश|जाह|हीर|तील|ा ब| अथ|अथव|थवा|ी म|स्त|ा त|ती |नवी|ाची|िवा|देण|याव|ांत|ण म|व आ|य व| हक|हक्|क्क|ा य|ेत |वस्|पूर|ूर्|ारण|द्य|ंचे|ेले|ेल्|कृत|शा |तीन| अर|अर्|्थी|थी |्रद|राध|यत्|ाला|तिष|ष्ठ|श्र|ण स|रून| आल|्ध |सले|े म| शा|्रक|रका|तिक|ाजि|जिक|्क |ाजा| इत|इतर|तो |साध\",\"mai\":\"ाक |प्र|कार|धिक|िका|ार | आʼ|आʼ |्रत|ेँ |्यक|क अ|िक |्ति| अध|व्य|अधि|क स| प्| व्|क्त|केँ|यक्|तिक|हि | स्|न्त|क व|मे |बाक| सम|मान|त्य|क्ष| छै|छैक|ेक |रत्|स्व|त्र|्ये|येक| अप|ष्ट|सँ |र छ|ैक।| वि| एह|वा |ित |ति |िके|ट्र| जा|्त्|राष|ाष्|्ट्| हो| सा| रा|्य | अन|अपन| कर|।प्|कोन| अछ|अछि|क आ|्वत|वतन|तन्| पर|था | को| वा|ताक|ार्|एहि|पन |ा आ|नहि| मा|्री|समा|नो |रता| दे|्षा|रक |देश|क प| नि| नह| कए| का|छि |न्य|्त |ि क| सं|ोनो| तथ|तथा|्वा|ारक|ान्|ल ज|ा स|ान |िवा|क ह|ीय |र आ| आ |्या|ँ क|वार|ता |ना |जाए| जे|करब| एक| आओ|आओर|ओर |ानव|परि|ँ अ|रीय|ा प|धार|ारण|स्थ|माज|साम|ामा|्रस|र्व|कएल|घोष|अन्|्तर|त क|स्त| सभ|्रा|रण |ँ स|द्ध|एबा|नक |ा अ|िक्|षा |रक्|क।प|ʼ स|चित|पूर|ʼ अ|यक |ाहि|रबा|क ज|कर | घो|ोषण|सम्|र प| हे|हेत|ेतु|तु |शिक|त अ| उप| अव|ूर्|एल |िमे|एहन|हन |षणा|ाधि|सभ |च्छ|अनु| शि|ेल |रूप|क क|भाव|प्त|्ध |ि ज|वक | सक|र अ|रति|निर|िर्|जाह|हो |ँ ए|े स|होए|चार|ण स|र्य|ि आ|सभक|्रक|ाजि|जिक|ाप्|र्ण|त स|क उ|रा |त आ|एत।|त ह| जन|ैक |विव|ोएत|वाध|क ब|री |न प| भा|य आ|राप| ओ |न व|ʼ प|्ण |न अ|कृत|िश्|ा व|कान|ारा|ि स|हु |रसं| उद|उद्|श्य|ाएत|िसँ|जे |ि घ|जेँ| कि|कि |ेश |केओ|ेओ |त्त|सार|क ए|रिव|वास|य प|्थि|विश|ओ व|यता|पर | भे|क ल|नवा| बी| सह|िष्|ि द| रू| ले| पए|पएब| अथ|अथव|थवा|क र|न स|हिम|ास |ए स|ि अ| दो|षाक| पू| द्|द्व|धक \",\"bho\":\" के|के |ार |े क|कार|धिक|िका|ओर | आओ|आओर| अध|अधि|े स|ा क|े अ| सं|र क| हो| मे|में|ें |र स|िक | कर|र ह|ा स| से|मान| सम|न क|रा |से |क्ष|े ब|नो |वे | चा|ता |्रा| रा|ति |खे |चाह|ष्ट| सा|राष|ाष्|प्र| का| मा|्ट्|ट्र|े आ| प्| सक| स्| जा| बा|पन |था |त क|ि क|कौन|ौनो|करे|होख| कौ|ेला|्त |ाति|ला |तथा| आप| ओक|आपन|रे |र म| तथ|सबह| हव|हवे|र आ|कर |ोखे|जा |े ओ|तिर|िर |बहि| ह।|ही |सके|केल|ना |हे | और|त्र|ान | खा|खात|।सब| पर|े म|े च|ा आ|षा |ावे|र ब|न स|ओकर|ी क| लो|ाहे|ल ज| सब|्षा|संग|ं क|ित |माज|मिल|े ज|रक्|हिं|िं |ा प|वे।|े ह|ाज |और |स्व|ंत्|ला।|ो स| नइ|नइख|इखे|हु |ानव|िया|्र |लोग|क स|समा|कान|क्त| जे|करा|्रत|े। | ओ |ी स|े न|्री|रीय|पर |े उ|ाही|ानू|नून|स्थ|े व|ाम |्वत|वतं|तंत|रता|केह|या |े ख|। स| सु|प्त| दे|े त|साम|र अ|ीय |र प|बा।|ा।स|सभे|भे | वि|योग|दी | आद|ून |ा म|्य |व्य|ए क|ेहु| या|री |र न| बि|राप|ाप्|ु क| मि|यता|आदि|दिम|मी |नवा|ाधि|े द|चार|ले | नि| पा|ोग | ही| दो|ादी|हि |तिक|पूर| इ |ा ह|्ति|ल ह|खल |ाव | अप| सभ|िमी|देश|ुक्| सह|शिक|िक्|ि म|जे |षण |ाजि|जिक|क आ|्तर|े प| उप|जाद|े भ|्या| जर|म क|ेकर| अं|े र|।के|न आ|सब |साथ|ंगठ|गठन|ठन |रो | जी|ा। |्म |ी ब|हो |न ह|े ल|न म|वाध|निय|ेश | शि|ज क| ले|ने |बा |संर|ंरक|्षण|ामा|य क|ास |उपय|पयो|दोस| आज|आजा| भी| उच|चित|र व| पू| घो|घोष| व्| शा|िल |ा।क| कई| को|होए|्थि\",\"nep\":\"को | र |कार|प्र|ार |ने |िका|क्त|्यक|धिक|व्य| गर| प्|्रत|अधि|्ति| अध| व्|यक्|मा |िक |ाई |त्य|न्त|लाई|मान| सम|त्र|गर्|र्न|क व|्ने| वा|वा | स्|रत्|र स|्ये|येक|ेक |छ ।|तिल|हरू|क्ष|ो स| वि|ा स|्त्|िला| । |स्व|हुन|ति | हु| मा| रा|ले |र छ| छ |ष्ट|समा|वतन|तन्|्ट्|ट्र| सं|ो अ|राष|ाष्|्वत|नेछ|ुने|ान |े अ|ता | का|्र |हरु|गरि|ाको|िने| अन|ना | नि|े छ| सा|क स|तिक|ित |नै |र र|रता|रू |था |ा र|कुन|ुनै|ा अ|स्त|्त | छै|छैन| तथ|तथा|ा प|ार्|वार| पर|ा व|एको|्षा|परि|रक्|। प|माज|रु |द्ध|का |्या|ो प|ामा|्रा|सको|ेछ | ला|धार|नि |ाहर|देश| यस|र ह|िवा|सबै|र म|भाव|्य |र व|रहर|रको|न अ|सम्|े र|संर|ंरक|अन्|ताक|्रि|्वा|ा भ|त र| कु| त्|री |ो व|न स|रिन|लाग|ारक|ानव| सब| शि|शिक|िक्|ै व|रिय|रा |ा न|पनि|ारा|श्य|ा त|्यस|यस्|ाउन|्न | अप|चार|ाव | भए|ारम| सु|ुद्|षा |ि र|रूक| सह|बाट|्षण|साम|्तर|िय |रति|ो आ|र प|ो ल|कान|द्व|ुक्|ान्| उप|द्द|ुन |ैन |ेछ।|ैन।|ारह| भे|ागि|गि |निज|वाह|्ध |र्य| आध|रमा|ा म|नको|बै |न ग|ाट |।प्|ाजि|जिक|त्प|िको|ाय |र त|ात्| उस|ूर्| अभ| अर|जको|स्थ| आव|त स|ित्| पन|िएक|्तो|तो | पा|ा ग| भन|ानु|परा|राध| छ।| मत|अपर|भेद|ि स|रुद|ो ह|रिव|रका|न्य| जन|यता|े स|र्म|ारी| दि|क अ|नमा|ूको|हित|ा क|क र|र अ|ा ब|उसक|पूर|त्व|र्द|सार|णको|युक|।कु|विध| घो|घोष| सक|भएक|नुन|्यह|ि व|ो भ| पु| मन|नी |विच| दे|राज|विर|िरु|काम|र न|यहर|िश्\"}}");

/***/ }),

/***/ 9248:
/***/ ((module) => {

"use strict";
module.exports = JSON.parse("{\"name\":\"got\",\"version\":\"6.7.1\",\"description\":\"Simplified HTTP requests\",\"license\":\"MIT\",\"repository\":\"sindresorhus/got\",\"maintainers\":[{\"name\":\"Sindre Sorhus\",\"email\":\"sindresorhus@gmail.com\",\"url\":\"sindresorhus.com\"},{\"name\":\"Vsevolod Strukchinsky\",\"email\":\"floatdrop@gmail.com\",\"url\":\"github.com/floatdrop\"}],\"engines\":{\"node\":\">=4\"},\"browser\":{\"unzip-response\":false},\"scripts\":{\"test\":\"xo && nyc ava\",\"coveralls\":\"nyc report --reporter=text-lcov | coveralls\"},\"files\":[\"index.js\"],\"keywords\":[\"http\",\"https\",\"get\",\"got\",\"url\",\"uri\",\"request\",\"util\",\"utility\",\"simple\",\"curl\",\"wget\",\"fetch\"],\"dependencies\":{\"create-error-class\":\"^3.0.0\",\"duplexer3\":\"^0.1.4\",\"get-stream\":\"^3.0.0\",\"is-redirect\":\"^1.0.0\",\"is-retry-allowed\":\"^1.0.0\",\"is-stream\":\"^1.0.0\",\"lowercase-keys\":\"^1.0.0\",\"safe-buffer\":\"^5.0.1\",\"timed-out\":\"^4.0.0\",\"unzip-response\":\"^2.0.1\",\"url-parse-lax\":\"^1.0.0\"},\"devDependencies\":{\"ava\":\"^0.17.0\",\"coveralls\":\"^2.11.4\",\"form-data\":\"^2.1.1\",\"get-port\":\"^2.0.0\",\"into-stream\":\"^3.0.0\",\"nyc\":\"^10.0.0\",\"pem\":\"^1.4.4\",\"pify\":\"^2.3.0\",\"tempfile\":\"^1.1.1\",\"xo\":\"*\"},\"xo\":{\"esnext\":true},\"ava\":{\"concurrency\":4}}");

/***/ }),

/***/ 2357:
/***/ ((module) => {

"use strict";
module.exports = require("assert");;

/***/ }),

/***/ 4293:
/***/ ((module) => {

"use strict";
module.exports = require("buffer");;

/***/ }),

/***/ 3129:
/***/ ((module) => {

"use strict";
module.exports = require("child_process");;

/***/ }),

/***/ 7619:
/***/ ((module) => {

"use strict";
module.exports = require("constants");;

/***/ }),

/***/ 6417:
/***/ ((module) => {

"use strict";
module.exports = require("crypto");;

/***/ }),

/***/ 8614:
/***/ ((module) => {

"use strict";
module.exports = require("events");;

/***/ }),

/***/ 5747:
/***/ ((module) => {

"use strict";
module.exports = require("fs");;

/***/ }),

/***/ 8605:
/***/ ((module) => {

"use strict";
module.exports = require("http");;

/***/ }),

/***/ 7211:
/***/ ((module) => {

"use strict";
module.exports = require("https");;

/***/ }),

/***/ 1631:
/***/ ((module) => {

"use strict";
module.exports = require("net");;

/***/ }),

/***/ 2087:
/***/ ((module) => {

"use strict";
module.exports = require("os");;

/***/ }),

/***/ 5622:
/***/ ((module) => {

"use strict";
module.exports = require("path");;

/***/ }),

/***/ 1191:
/***/ ((module) => {

"use strict";
module.exports = require("querystring");;

/***/ }),

/***/ 2413:
/***/ ((module) => {

"use strict";
module.exports = require("stream");;

/***/ }),

/***/ 4016:
/***/ ((module) => {

"use strict";
module.exports = require("tls");;

/***/ }),

/***/ 8835:
/***/ ((module) => {

"use strict";
module.exports = require("url");;

/***/ }),

/***/ 1669:
/***/ ((module) => {

"use strict";
module.exports = require("util");;

/***/ }),

/***/ 2184:
/***/ ((module) => {

"use strict";
module.exports = require("vm");;

/***/ }),

/***/ 8761:
/***/ ((module) => {

"use strict";
module.exports = require("zlib");;

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __nccwpck_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		if(__webpack_module_cache__[moduleId]) {
/******/ 			return __webpack_module_cache__[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		var threw = true;
/******/ 		try {
/******/ 			__webpack_modules__[moduleId].call(module.exports, module, module.exports, __nccwpck_require__);
/******/ 			threw = false;
/******/ 		} finally {
/******/ 			if(threw) delete __webpack_module_cache__[moduleId];
/******/ 		}
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat */
/******/ 	
/******/ 	__nccwpck_require__.ab = __dirname + "/";/************************************************************************/
/******/ 	// module exports must be returned from runtime so entry inlining is disabled
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	return __nccwpck_require__(1713);
/******/ })()
;