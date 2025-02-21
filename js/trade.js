document.addEventListener("DOMContentLoaded", function () {
    let totalBalance = parseFloat(localStorage.getItem("totalBalance")) || 100.0;
    let investedAmount = parseFloat(localStorage.getItem("investedAmount")) || 0.0;
    let profitLoss = parseFloat(localStorage.getItem("profitLoss")) || 0.0;
    let lastInvestedPrice = null;
    let investmentDirection = null;

    const balanceEl = document.getElementById("balance");
    const investedEl = document.getElementById("invested");
    const profitLossEl = document.getElementById("profit-loss");
    const user = localStorage.getItem("user");

    if (!user) {
        window.location.href = "login.html"; // Redirect to login page if not logged in
        return;
    }

    function updateUI() {
        balanceEl.textContent = totalBalance.toFixed(2);
        investedEl.textContent = investedAmount.toFixed(2);
        profitLossEl.textContent = profitLoss.toFixed(2);
        localStorage.setItem("totalBalance", totalBalance);
        localStorage.setItem("investedAmount", investedAmount);
        localStorage.setItem("profitLoss", profitLoss);
    }

    // Buy More Daddy Dollars (Fake Payment System)
    const paymentModal = document.getElementById("payment-modal");
    document.getElementById("buy-more").addEventListener("click", () => paymentModal.style.display = "flex");
    document.getElementById("close-payment").addEventListener("click", () => paymentModal.style.display = "none");

    document.getElementById("pay-now").addEventListener("click", function () {
        let amount = parseFloat(document.getElementById("payment-amount").value);
        if (amount > 0) {
            totalBalance += amount;
            updateUI();
            paymentModal.style.display = "none";
        }
    });

    // Prediction Modal
    const predictionModal = document.getElementById("prediction-modal");
    const predictionMessageDiv = document.createElement("div");  // Create prediction message div
    predictionMessageDiv.classList.add("message-div");
    predictionMessageDiv.style.display = "none"; // Initially hidden
    predictionMessageDiv.textContent = "You don't have enough Daddy Dollars to place a bet.";
    document.body.appendChild(predictionMessageDiv); // Append it to the body

    document.getElementById("predict").addEventListener("click", () => predictionModal.style.display = "flex");
    document.getElementById("close-prediction").addEventListener("click", () => predictionModal.style.display = "none");

    document.getElementById("predict-up").addEventListener("click", function () {
        handlePrediction("up");
    });

    document.getElementById("predict-down").addEventListener("click", function () {
        handlePrediction("down");
    });

    function handlePrediction(direction) {
        let amount = parseFloat(document.getElementById("investment-amount").value);
        if (amount > 0 && amount <= totalBalance) {
            investedAmount += amount;
            totalBalance -= amount;
            lastInvestedPrice = marketData[marketData.length - 1];
            investmentDirection = direction;
            updateUI();
            predictionModal.style.display = "none";
        } else {
            // Not enough funds, show the error message
            predictionMessageDiv.style.display = "block"; // Show message
            setTimeout(() => {
                predictionMessageDiv.style.display = "none"; // Hide message after 5 seconds
            }, 5000);
        }
    }

    // Withdraw Option
    const withdrawModal = document.getElementById("withdraw-modal");
    const messageDiv = document.createElement("div");  // Create message div
    messageDiv.classList.add("message-div");
    messageDiv.style.display = "none"; // Initially hidden
    messageDiv.textContent = "You don't have enough Daddy Dollars to recover your losses and withdraw.";
    document.body.appendChild(messageDiv); // Append it to the body

    document.getElementById("withdraw").addEventListener("click", () => withdrawModal.style.display = "flex");

    // Close Razorplay Modal (withdraw)
    document.getElementById("close-payment-w").addEventListener("click", () => {
        withdrawModal.style.display = "none"; // Close Razorplay Modal when cancel is clicked
    });

    document.getElementById("upi").addEventListener("click", function () {
        handleWithdraw();
        withdrawModal.style.display = "none";  // Close modal
    });

    document.getElementById("net-banking").addEventListener("click", function () {
        handleWithdraw();
        withdrawModal.style.display = "none";  // Close modal
    });

    // Handle Withdraw Logic: Compensate Loss from Daddy Dollars
    function handleWithdraw() {
        // Check if there's enough Daddy Dollars to cover the loss
        if (investedAmount > 0) {
            let requiredFunds = investedAmount + profitLoss;  // Amount to recover the loss
            if (totalBalance < requiredFunds) {
                // Not enough funds to cover the loss, show the error message
                messageDiv.style.display = "block"; // Show message
                setTimeout(() => {
                    messageDiv.style.display = "none"; // Hide message after 5 seconds
                }, 5000);
                return;
            } else {
                // Enough funds, proceed with withdrawal
                if (profitLoss < 0) {
                    // Recover loss from Daddy Dollars
                    totalBalance += investedAmount + profitLoss; // Add invested amount and subtract the loss
                } else {
                    totalBalance += investedAmount + profitLoss; // Add the profit normally
                }
                investedAmount = 0;
                profitLoss = 0;
                lastInvestedPrice = null;
                investmentDirection = null;
                updateUI();
            }
        }
    }

    // Graph Setup
    let ctx = document.getElementById("marketGraph").getContext("2d");
    let marketData = Array(20).fill(100);
    let graph = new Chart(ctx, {
        type: "line",
        data: {
            labels: Array(20).fill(""),
            datasets: [{
                label: "Daddy Dollar Value",
                data: marketData,
                borderColor: "#4A90E2",
                borderWidth: 2,
                tension: 0.3
            }]
        }
    });

    function updateGraph() {
        let lastPrice = marketData[marketData.length - 1];

        // 70% chance the market will move against the user's prediction
        let unfairChance = Math.random(); // Random number between 0 and 1
        let newValue;

        if (unfairChance < 0.7) {
            // 70% of the time, the market moves in the opposite direction
            if (investmentDirection === "up") {
                newValue = lastPrice - (Math.random() * 20); // Move down (opposite)
            } else if (investmentDirection === "down") {
                newValue = lastPrice + (Math.random() * 20); // Move up (opposite)
            } else {
                newValue = lastPrice + (Math.random() * 20 - 10); // Random movement
            }
        } else {
            // 30% of the time, the market moves in the predicted direction
            if (investmentDirection === "up") {
                newValue = lastPrice + (Math.random() * 20); // Move up (as predicted)
            } else if (investmentDirection === "down") {
                newValue = lastPrice - (Math.random() * 20); // Move down (as predicted)
            } else {
                newValue = lastPrice + (Math.random() * 20 - 10); // Random movement
            }
        }

        marketData.shift();
        marketData.push(newValue);
        graph.update();

        // Calculate Profit/Loss
        if (investedAmount > 0 && lastInvestedPrice !== null) {
            let priceChange = newValue - lastInvestedPrice;
            let changePercentage = (priceChange / lastInvestedPrice) * 100;
            let potentialProfitLoss = (investedAmount * changePercentage) / 100;

            if ((investmentDirection === "up" && newValue > lastInvestedPrice) ||
                (investmentDirection === "down" && newValue < lastInvestedPrice)) {
                profitLoss = parseFloat(potentialProfitLoss.toFixed(2)); 
            } else {
                profitLoss = parseFloat(-Math.abs(potentialProfitLoss).toFixed(2)); 
            }
            updateUI();
        }
    }

    setInterval(updateGraph, 1000);
    updateUI();
});
