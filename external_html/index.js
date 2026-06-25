var EXTERNAL_RADIUS = 2;

var FIXED_AUTH_PASSWORD = "pass";
var HAVEN_API_BASE_URL = "https://haven-api.usefastlink.com";
var HAVEN_API_PASSPHRASE = "o5EacSG59M*C@D";
var USERNAME_STORAGE_KEY = "external_html_last_username";

var PORTAL_CONFIG = {
    buttonText: "Log In"
};

var errorHintMap = {
    "0": "ok",
    "-1": "General error.",
    "-1001": "Invalid request parameters.",
    "-41500": "Invalid authentication type.",
    "-41501": "Failed to authenticate.",
    "-41505": "The number of users has reached the limit.",
    "-41506": "Invalid authorization information.",
    "-41507": "Your authentication times out. You can get authenticated again until the next day.",
    "-41516": "The number of users has reached the limit.",
    "-41517": "Incorrect password.",
    "-41518": "This SSID does not exist.",
    "-41524": "Authentication failed because the username does not exist.",
    "-41525": "Authentication failed because of wrong password.",
    "-41526": "Authentication failed because the client is invalid.",
    "-41528": "Failed to decrypt data.",
    "-41529": "Incorrect username or password.",
    "-41530": "Connecting to the RADIUS server times out.",
    "-41532": "Your account have reached your Wi-Fi data limit."
};

var Ajax = {
    get: function (url, headers, fn, onError) {
        var xhr = new XMLHttpRequest();
        xhr.open("GET", url, true);
        if (headers) {
            for (var key in headers) {
                if (headers.hasOwnProperty(key)) {
                    xhr.setRequestHeader(key, headers[key]);
                }
            }
        }
        xhr.onreadystatechange = function() {
            if (xhr.readyState == 4) {
                if (xhr.status == 200 || xhr.status == 304) {
                    fn.call(this, xhr.responseText);
                } else if (onError) {
                    onError(xhr.status);
                }
            }
        };
        xhr.send();
    }
};

function getQueryStringKey(key) {
    return getQueryStringAsObject()[key];
}

function getQueryStringAsObject() {
    var b, cv, e, k, ma, sk, v, r = {},
        d = function (value) { return decodeURIComponent(value.replace(/\+/g, "%20")); },
        q = window.location.search.substring(1),
        s = /([^&;=]+)=?([^&;]*)/g;
    ma = function(value) {
        if (typeof value != "object") {
            cv = value;
            value = {};
            value.length = 0;
            if (cv) { Array.prototype.push.call(value, cv); }
        }
        return value;
    };
    while (e = s.exec(q)) {
        b = e[1].indexOf("[");
        v = d(e[2]);
        if (b < 0) {
            k = d(e[1]);
            if (r[k]) {
                r[k] = ma(r[k]);
                Array.prototype.push.call(r[k], v);
            } else {
                r[k] = v;
            }
        } else {
            k = d(e[1].slice(0, b));
            sk = d(e[1].slice(b + 1, e[1].indexOf("]", b)));
            r[k] = ma(r[k]);
            if (sk) { r[k][sk] = v; }
            else { Array.prototype.push.call(r[k], v); }
        }
    }
    return r;
}

function buildSubmitUrl(schemeValue, targetValue, portValue) {
    if (!schemeValue || !targetValue || !portValue) {
        return null;
    }
    return schemeValue + "://" + targetValue + ":" + portValue + "/portal/radius/browserauth";
}

function setFieldValue(id, value) {
    var field = document.getElementById(id);
    if (!field) {
        return;
    }
    if (value == null || value === "") {
        field.removeAttribute("name");
        field.value = "";
        return;
    }
    field.setAttribute("name", id);
    field.value = value;
}

function isMobile() {
    var isMobileDevice = false;
    var regExp1 = /(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i;
    var regExp2 = /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i;
    var navigators = [navigator.userAgent, navigator.vendor, window.opera];
    for (var i = 0; i < navigators.length; i++) {
        if (!navigators[i]) {
            continue;
        }
        if (regExp1.test(navigators[i]) || regExp2.test(navigators[i].substring(0, 4))) {
            isMobileDevice = true;
            break;
        }
    }

    if (window.screen.width < 500 && window.screen.height < 800) {
        isMobileDevice = true;
    }

    return isMobileDevice;
}

function showOperHint(message) {
    var hint = document.getElementById("oper-hint");
    hint.innerHTML = message;
    hint.style.display = "block";
}

function hideOperHint() {
    var hint = document.getElementById("oper-hint");
    hint.innerHTML = "";
    hint.style.display = "none";
}

function setLoginLoading(isLoading) {
    var button = document.getElementById("button-login");
    if (isLoading) {
        if (!button.dataset.defaultText) {
            button.dataset.defaultText = button.innerHTML;
        }
        button.disabled = true;
        button.classList.add("loading");
        button.innerHTML = "Logging in...";
    } else {
        button.disabled = false;
        button.classList.remove("loading");
        button.innerHTML = button.dataset.defaultText || PORTAL_CONFIG.buttonText || "Log In";
    }
}

function getAuthErrorMessage(errorHint) {
    var trimmed = (errorHint || "").trim();
    if (errorHintMap[trimmed]) {
        return errorHintMap[trimmed];
    }
    return trimmed || "An error occurred.";
}

function fetchLastRejectMessage(username, onSuccess, onError) {
    if (!username) {
        onError();
        return;
    }
    var url = HAVEN_API_BASE_URL + "/api/public/wifi-users/reject-message?username=" + encodeURIComponent(username);
    Ajax.get(url, {
        "accept": "*/*",
        "x-passphrase": HAVEN_API_PASSPHRASE
    }, function(responseText) {
        try {
            var response = JSON.parse(responseText);
            if (response.status && response.data && response.data.last_reject_message) {
                onSuccess(response.data.last_reject_message);
            } else {
                onError();
            }
        } catch (e) {
            onError();
        }
    }, onError);
}

function handleReturnedErrorHint(errorHint) {
    if (errorHint == null || errorHint === "") {
        return;
    }

    var normalizedHint = errorHint.replace(/\+/g, " ");
    var username = document.getElementById("username").value.trim() || sessionStorage.getItem(USERNAME_STORAGE_KEY) || "";

    if (normalizedHint === "-41529" || normalizedHint.indexOf("-41529") !== -1) {
        fetchLastRejectMessage(username, function(rejectMessage) {
            showOperHint(rejectMessage);
        }, function() {
            showOperHint(getAuthErrorMessage(normalizedHint));
        });
        return;
    }

    showOperHint(getAuthErrorMessage(normalizedHint));
}

function populateHiddenFields() {
    var scheme = getQueryStringKey("scheme");
    var target = getQueryStringKey("target");
    var targetPort = getQueryStringKey("targetPort");
    var submitUrl = buildSubmitUrl(scheme, target, targetPort);
    var form = document.getElementById("login-form");

    var clientMac = getQueryStringKey("clientMac");
    var clientIp = getQueryStringKey("clientIp") || getQueryStringKey("clientIP");
    var apMac = getQueryStringKey("apMac");
    var gatewayMac = getQueryStringKey("gatewayMac") || getQueryStringKey("GatewayMac");
    var ssidName = getQueryStringKey("ssidName");
    var radioId = getQueryStringKey("radioId");
    var vid = getQueryStringKey("vid");
    var originUrl = getQueryStringKey("originUrl");

    if (apMac && gatewayMac) {
        apMac = "";
    }

    setFieldValue("clientMac", clientMac);
    setFieldValue("clientIp", clientIp);
    setFieldValue("apMac", apMac);
    setFieldValue("gatewayMac", gatewayMac);
    setFieldValue("ssidName", ssidName);
    setFieldValue("radioId", radioId);
    setFieldValue("vid", vid);
    setFieldValue("authType", String(EXTERNAL_RADIUS));
    setFieldValue("originUrl", originUrl);
    document.getElementById("password").value = FIXED_AUTH_PASSWORD;

    if (submitUrl) {
        form.action = submitUrl;
    } else {
        showOperHint("Missing Omada controller parameters. Open this page through the captive portal redirect.");
    }
}

function handleFormSubmit(event) {
    hideOperHint();

    var form = document.getElementById("login-form");
    if (!form.action) {
        event.preventDefault();
        showOperHint("Missing Omada controller parameters. Open this page through the captive portal redirect.");
        return;
    }

    var username = document.getElementById("username").value.trim();
    if (!username) {
        event.preventDefault();
        showOperHint("Please enter your email.");
        return;
    }

    document.getElementById("password").value = FIXED_AUTH_PASSWORD;
    sessionStorage.setItem(USERNAME_STORAGE_KEY, username);
    setLoginLoading(true);
}

function initPortal() {
    var button = document.getElementById("button-login");
    button.innerHTML = PORTAL_CONFIG.buttonText;
    button.dataset.defaultText = PORTAL_CONFIG.buttonText;

    populateHiddenFields();
    handleReturnedErrorHint(getQueryStringKey("errorHint"));

    document.getElementById("login-form").addEventListener("submit", handleFormSubmit);
}

initPortal();

if (isMobile()) {
    document.body.classList.add("mobile");
}
