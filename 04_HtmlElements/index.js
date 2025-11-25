document.addEventListener("DOMContentLoaded", () => {
    pageLoaded();
});

let txt1;
let txt2;
let btn;
let lblRes;

function pageLoaded() {
    txt1 = document.getElementById('txt1');
    txt2 = document.querySelector('#txt2'); //same thing as the others
    btn = document.getElementById('btnCalc');
    btn.addEventListener('click', () => {
        Calculate();
    });
    lblRes = document.getElementById('lblRes');

    // btn2 from original code
    const btn2 = document.getElementById("btn2");
    btn2.addEventListener("click", () => {
        // now appends to log, not replace
        print("btn2 clicked: " + btn2.id + " | " + btn2.innerText, true);
    });

    // log screen size on load + resize (for debug requirement)
    window.addEventListener("load", logScreenSize);
    window.addEventListener("resize", logScreenSize);
}

function Calculate() {
    let txt1Text = txt1.value;
    let num1 = parseInt(txt1Text);
    let txt2Text = txt2.value;
    let num2 = parseInt(txt2Text);

    let res = num1 + num2;
    lblRes.innerText = res;

    // log the calculation as an extra line in the textarea
    print("Calculate: " + num1 + " + " + num2 + " = " + res, true);
}

// UPDATED print: supports append
function print(msg, append) {
    //--Get TextArea Element Reference
    const ta = document.getElementById("output");

    if (!ta) {
        console.log(msg);
        return;
    }

    // if append is true → add line, else replace
    if (append) {
        if (ta.value.trim() !== "") {
            ta.value += "\n" + msg;
        } else {
            ta.value = msg;
        }
    } else {
        ta.value = msg;
    }
}

// DEBUG screen size + log (for "images per size + data in log")
function logScreenSize() {
    const w = window.innerWidth;
    let size = "";

    if (w < 768) {
        size = "mobile";
    } else if (w >= 768 && w < 992) {
        size = "tablet";
    } else {
        size = "desktop";
    }

    print("[DEBUG] Screen: " + size + " (width=" + w + ")", true);
}

// =============================================
// STEP 1: JS NATIVE TYPES, USEFUL TYPES & OPERATIONS
// =============================================
function demoNative() {
    let out = "=== STEP 1: NATIVE TYPES ===\n";

    // String
    const s = "Hello World";
    out += "\n[String] s = " + s;
    out += "\nLength: " + s.length;
    out += "\nUpper: " + s.toUpperCase();

    // Number
    const n = 42;
    out += "\n\n[Number] n = " + n;

    // Boolean
    const b = true;
    out += "\n\n[Boolean] b = " + b;

    // Date
    const d = new Date();
    out += "\n\n[Date] now = " + d.toISOString();

    // Array
    const arr = [1, 2, 3, 4];
    out += "\n\n[Array] arr = [" + arr.join(", ") + "]";
    out += "\nPush 5 → " + (arr.push(5), arr.join(", "));
    out += "\nMap x2 → " + arr.map(x => x * 2).join(", ");

    // Functions as variables
    const add = function (a, b) { return a + b; };
    out += "\n\n[Function as variable] add(3,4) = " + add(3, 4);

    // Callback
    function calc(a, b, fn) { return fn(a, b); }
    const result = calc(10, 20, (x, y) => x + y);
    out += "\n[Callback] calc(10,20, x+y ) = " + result;

    //Print to Log – replace previous content
    print(out, false);
}
