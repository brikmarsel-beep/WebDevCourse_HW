document.addEventListener("DOMContentLoaded", () => {
    pageLoaded();
});

let txt1, txt2, ddlOp, btn, lblRes, txtResultLine;

function pageLoaded() {
    txt1 = document.getElementById('txt1');
    txt2 = document.getElementById('txt2');
    ddlOp = document.getElementById('ddlOp');
    btn = document.getElementById('btnCalc');
    lblRes = document.getElementById('lblRes');
    txtResultLine = document.getElementById('txtResultLine');

    if (btn) {
        btn.addEventListener('click', () => {
            calculate();
        });
    }

    // validate while typing
    txt1.addEventListener("input", () => validateInput(txt1));
    txt2.addEventListener("input", () => validateInput(txt2));
}

// ============= CALCULATE =============
function calculate() {
    const valid1 = validateInput(txt1);
    const valid2 = validateInput(txt2);

    if (!valid1 || !valid2) {
        lblRes.value = "";
        txtResultLine.value = "יש להזין מספרים בלבד.";
        print("ערכים לא תקינים – החישוב בוטל.", true);
        return;
    }

    const num1 = parseFloat(txt1.value);
    const num2 = parseFloat(txt2.value);
    const op = ddlOp.value;

    let result;
    let symbol;

    switch (op) {
        case "add":
            result = num1 + num2;
            symbol = "+";
            break;
        case "sub":
            result = num1 - num2;
            symbol = "-";
            break;
        case "mul":
            result = num1 * num2;
            symbol = "*";
            break;
        case "div":
            symbol = "/";
            result = (num2 === 0) ? "∞" : num1 / num2;
            break;
    }

    lblRes.value = result;
    txtResultLine.value = `${num1} ${symbol} ${num2} = ${result}`;

    print(`[מחשבון] ${num1} ${symbol} ${num2} = ${result}`, true);
}

// ============= VALIDATION =============
function isNumeric(value) {
    return value.trim() !== "" && !isNaN(value);
}

function validateInput(inputEl) {
    const ok = isNumeric(inputEl.value);
    inputEl.classList.remove("is-valid", "is-invalid");
    inputEl.classList.add(ok ? "is-valid" : "is-invalid");
    return ok;
}

// ============= PRINT FUNCTION =============
function print(msg, append) {
    const ta = document.getElementById("output");
    if (!ta) return;

    if (append) {
        if (ta.value.trim() !== "") ta.value += "\n";
        ta.value += msg;
    } else {
        ta.value = msg;
    }
}
