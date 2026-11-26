// ==========================================================================
// Practical 3: JavaScript Programming Fundamentals
// Student ID: 26DIT029 | Class: IT-B
// Secure Bank Ltd. - Client-Side Banking Calculator Utilities
// ==========================================================================

// Variable Scope Demonstration (Task 2)
const BANK_NAME = "Secure Bank Ltd.";
var globalBranch = "CHARUSAT Branch";
let dailyTransactionCount = 0;

function demonstrateVariableScope() {
    var functionScopedVar = "Accessible throughout the function";
    if (true) {
        let blockScopedLet = "Only visible within this if-block";
        const blockScopedConst = "Immutable block-level constant";
        console.log("Inside block:", blockScopedLet, "|", blockScopedConst);
    }
    console.log("Inside function:", functionScopedVar);
    console.log("Global constants:", BANK_NAME, "|", globalBranch);
}
demonstrateVariableScope();

// 1. Loan Eligibility Checker (Decision-Making & Logical Operators)
function checkLoanEligibility() {
    const name = document.getElementById("customerName").value.trim();
    const income = parseFloat(document.getElementById("income").value);
    const loanAmount = parseFloat(document.getElementById("loanAmount").value);
    const output = document.getElementById("output");

    if (!name || isNaN(income) || isNaN(loanAmount) || income <= 0 || loanAmount <= 0) {
        output.innerHTML = "<p style='color:red;'>⚠️ Please enter valid customer name, positive income, and loan amount.</p>";
        return;
    }

    // Maximum permissible loan: 30x monthly income
    const maxEligibleLoan = income * 30;
    let status = "";
    let remarks = "";

    if (income >= 50000 && loanAmount <= maxEligibleLoan) {
        status = "Approved (High Priority)";
        remarks = "Excellent income profile. Full requested loan amount is approved.";
    } else if (income >= 25000 && loanAmount <= maxEligibleLoan) {
        status = "Approved (Standard)";
        remarks = "Satisfactory income profile. Loan approved with standard collateral.";
    } else if (income < 25000) {
        status = "Rejected";
        remarks = "Monthly income is below the minimum eligibility threshold of ₹25,000.";
    } else {
        status = "Partially Eligible";
        remarks = `Requested loan ₹${loanAmount.toLocaleString()} exceeds permissible limit. Maximum eligible loan is ₹${maxEligibleLoan.toLocaleString()}.`;
    }

    dailyTransactionCount++;
    output.innerHTML = `
        <div class="result-box">
            <h4>📋 Loan Eligibility Assessment</h4>
            <p><strong>Customer:</strong> ${name}</p>
            <p><strong>Monthly Income:</strong> ₹${income.toLocaleString()}</p>
            <p><strong>Loan Requested:</strong> ₹${loanAmount.toLocaleString()}</p>
            <p><strong>Status:</strong> <span class="badge ${status.startsWith('Approved') ? 'approved' : 'rejected'}">${status}</span></p>
            <p><strong>Remarks:</strong> ${remarks}</p>
        </div>
    `;
}

// 2. EMI Calculator (Arithmetic Operators & Reusable Functions)
function computeEMI(principal, annualRate, tenureYears) {
    const monthlyRate = (annualRate / 12) / 100;
    const totalMonths = tenureYears * 12;
    if (monthlyRate === 0) return principal / totalMonths;
    const factor = Math.pow(1 + monthlyRate, totalMonths);
    return (principal * monthlyRate * factor) / (factor - 1);
}

function calculateEMI() {
    const principal = parseFloat(document.getElementById("loanAmount").value);
    const annualRate = parseFloat(document.getElementById("interestRate").value);
    const tenureYears = parseFloat(document.getElementById("loanYears").value);
    const output = document.getElementById("output");

    if (isNaN(principal) || isNaN(annualRate) || isNaN(tenureYears) || principal <= 0 || annualRate <= 0 || tenureYears <= 0) {
        output.innerHTML = "<p style='color:red;'>⚠️ Please enter valid loan amount, interest rate, and tenure.</p>";
        return;
    }

    const emi = computeEMI(principal, annualRate, tenureYears);
    const totalPayment = emi * (tenureYears * 12);
    const totalInterest = totalPayment - principal;

    dailyTransactionCount++;
    output.innerHTML = `
        <div class="result-box">
            <h4>📊 Loan Repayment Breakdown (EMI)</h4>
            <p><strong>Principal Amount:</strong> ₹${principal.toLocaleString()}</p>
            <p><strong>Annual Rate:</strong> ${annualRate}%</p>
            <p><strong>Tenure:</strong> ${tenureYears} Years (${tenureYears * 12} Months)</p>
            <hr>
            <p><strong>Monthly EMI:</strong> ₹${emi.toFixed(2)}</p>
            <p><strong>Total Interest Payable:</strong> ₹${totalInterest.toFixed(2)}</p>
            <p><strong>Total Repayment Amount:</strong> ₹${totalPayment.toFixed(2)}</p>
        </div>
    `;
}

// 3. Simple Interest Calculator
function calculateSimpleInterest() {
    const principal = parseFloat(document.getElementById("loanAmount").value);
    const annualRate = parseFloat(document.getElementById("interestRate").value);
    const tenureYears = parseFloat(document.getElementById("loanYears").value);
    const output = document.getElementById("output");

    if (isNaN(principal) || isNaN(annualRate) || isNaN(tenureYears) || principal <= 0 || annualRate <= 0 || tenureYears <= 0) {
        output.innerHTML = "<p style='color:red;'>⚠️ Please enter valid principal amount, interest rate, and tenure.</p>";
        return;
    }

    const simpleInterest = (principal * annualRate * tenureYears) / 100;
    const totalAmount = principal + simpleInterest;

    output.innerHTML = `
        <div class="result-box">
            <h4>💰 Simple Interest Estimation</h4>
            <p><strong>Principal:</strong> ₹${principal.toLocaleString()}</p>
            <p><strong>Rate:</strong> ${annualRate}% per annum</p>
            <p><strong>Time:</strong> ${tenureYears} Years</p>
            <p><strong>Simple Interest:</strong> ₹${simpleInterest.toFixed(2)}</p>
            <p><strong>Maturity Amount:</strong> ₹${totalAmount.toFixed(2)}</p>
        </div>
    `;
}

// 4. Account Information Display (Switch Statement)
function displayAccountInfo() {
    const accountType = document.getElementById("accountType").value;
    const output = document.getElementById("output");
    let info = "";

    switch (accountType) {
        case "savings":
            info = "Savings Account: Offers 4.0% annual interest, unlimited debit transactions, zero maintainance fees for students.";
            break;
        case "current":
            info = "Current Account: Designed for business entities with free overdraft facility, priority processing, and daily limits up to ₹5,00,000.";
            break;
        case "fixed":
            info = "Fixed Deposit (FD): High returns of 7.25% p.a., flexible tenure from 7 days to 10 years, compounding quarterly.";
            break;
        default:
            info = "Invalid account type selected.";
    }

    output.innerHTML = `
        <div class="result-box">
            <h4>🏦 Account Details & Specifications</h4>
            <p>${info}</p>
        </div>
    `;
}

// 5. Year-by-Year Compound Growth Table (Iterative Loop - for loop)
function generateInterestTable() {
    const deposit = parseFloat(document.getElementById("depositAmount").value);
    const rate = parseFloat(document.getElementById("interestRate").value) || 7.0;
    const years = parseInt(document.getElementById("loanYears").value) || 5;
    const output = document.getElementById("output");

    if (isNaN(deposit) || deposit <= 0) {
        output.innerHTML = "<p style='color:red;'>⚠️ Please enter a valid deposit amount.</p>";
        return;
    }

    let tableHtml = `
        <div class="result-box">
            <h4>📈 Projected Compound Growth Over ${years} Years (${rate}% p.a.)</h4>
            <table border="1" cellpadding="6" style="width:100%; border-collapse: collapse; margin-top:10px;">
                <tr style="background:#004085; color:white;">
                    <th>Year</th>
                    <th>Opening Balance (₹)</th>
                    <th>Interest Earned (₹)</th>
                    <th>Closing Balance (₹)</th>
                </tr>
    `;

    let balance = deposit;
    for (let yr = 1; yr <= years; yr++) {
        let interest = balance * (rate / 100);
        let closing = balance + interest;
        tableHtml += `
            <tr>
                <td>Year ${yr}</td>
                <td>₹${balance.toFixed(2)}</td>
                <td>₹${interest.toFixed(2)}</td>
                <td>₹${closing.toFixed(2)}</td>
            </tr>
        `;
        balance = closing;
    }

    tableHtml += `
            </table>
            <p style="margin-top:10px;">Total transactions evaluated today: <strong>${dailyTransactionCount}</strong></p>
        </div>
    `;

    output.innerHTML = tableHtml;
}
