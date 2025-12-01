const express = require('express');
const cors = require('cors');
const path = require('path');

// Portal 1: Basic
const app1 = express();
app1.use(cors());
app1.use(express.urlencoded({ extended: true }));
app1.use(express.json());

app1.get('/login', (req, res) => {
    res.send(`
        <html>
            <head><title>Portal 1 Login</title></head>
            <body>
                <h1>Login</h1>
                <form action="/login" method="POST">
                    <input type="text" id="user" name="username" placeholder="Username"><br>
                    <input type="password" id="pass" name="password" placeholder="Password"><br>
                    <button type="submit" id="loginButton">Login</button>
                </form>
            </body>
        </html>
    `);
});

app1.post('/login', (req, res) => {
    res.redirect('/pay');
});

app1.get('/pay', (req, res) => {
    res.send(`
        <html>
            <head><title>Portal 1 Pay</title></head>
            <body>
                <h1>Pay Invoice</h1>
                <form action="/pay" method="POST">
                    <input type="text" id="invoice" name="invoice_number" placeholder="Invoice Number"><br>
                    <input type="text" id="amount" name="amount" placeholder="Amount"><br>
                    <input type="text" id="card" name="card_number" placeholder="Card Number"><br>
                    <button type="submit" id="submit">Pay Now</button>
                </form>
            </body>
        </html>
    `);
});

app1.post('/pay', (req, res) => {
    res.send(`
        <html>
            <body>
                <h1>Payment submitted</h1>
                <div id="confirmationNumber">CNF-${Math.floor(Math.random() * 10000)}</div>
            </body>
        </html>
    `);
});

app1.listen(4001, () => console.log('Portal 1 running on 4001'));

// Portal 2: Modal Heavy
const app2 = express();
app2.use(cors());
app2.use(express.urlencoded({ extended: true }));
app2.use(express.json());

app2.get('/login', (req, res) => {
     res.send(`
        <html>
            <head><title>Portal 2 Login</title></head>
            <body>
                <h1>Login</h1>
                <form action="/login" method="POST">
                    <input type="text" id="u" name="username" placeholder="Username"><br>
                    <input type="password" id="p" name="password" placeholder="Password"><br>
                    <button type="submit" id="btn-login">Login</button>
                </form>
            </body>
        </html>
    `);
});

app2.post('/login', (req, res) => {
    res.redirect('/dashboard');
});

app2.get('/dashboard', (req, res) => {
    res.send(`
        <html>
            <head>
                <title>Portal 2 Dashboard</title>
                <style>
                    #modal { display: none; position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); background: white; border: 1px solid black; padding: 20px; }
                    #overlay { display: none; position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.5); }
                </style>
            </head>
            <body>
                <h1>Dashboard</h1>
                <button id="pay-btn" onclick="document.getElementById('modal').style.display='block';document.getElementById('overlay').style.display='block'">Make Payment</button>
                
                <div id="overlay"></div>
                <div id="modal">
                    <h2>Payment Details</h2>
                    <form action="/pay" method="POST">
                        <input type="text" name="invoice" placeholder="Invoice"><br>
                        <input type="text" name="amount" placeholder="Amount"><br>
                        <input type="text" name="card" placeholder="Card"><br>
                        <input type="checkbox" id="terms"> I accept terms<br>
                        <button type="submit">Submit</button>
                    </form>
                </div>
            </body>
        </html>
    `);
});

app2.post('/pay', (req, res) => {
     res.send(`
        <html>
            <body>
                <h1>Processing...</h1>
                <script>
                    setTimeout(() => {
                        const div = document.createElement('div');
                        div.attachShadow({mode: 'open'}).innerHTML = '<p>Confirmation: <span id="conf">SECURE-999</span></p>';
                        document.body.appendChild(div);
                    }, 1000);
                </script>
            </body>
        </html>
    `);
});

app2.listen(4002, () => console.log('Portal 2 running on 4002'));

// Portal 3: Semantic Challenge
const app3 = express();
app3.use(cors());
app3.use(express.urlencoded({ extended: true }));
app3.use(express.json());

app3.get('/login', (req, res) => {
    res.send(`
        <html>
            <head><title>Portal 3</title></head>
            <body>
                <div>
                    <span>User ID</span>
                    <input type="text" class="input-field-1">
                </div>
                <div>
                    <span>Passcode</span>
                    <input type="password" class="input-field-2">
                </div>
                <div class="btn-group">
                    <div class="clickable" onclick="document.forms[0].submit()">Enter</div>
                </div>
                <form action="/login" method="POST" style="display:none"></form>
            </body>
        </html>
    `);
});

app3.post('/login', (req, res) => {
    res.redirect('/bill-pay');
});

app3.get('/bill-pay', (req, res) => {
    res.send(`
        <html>
            <head><title>Portal 3 Bill Pay</title></head>
            <body>
                <div class="payment-form">
                    <div class="row">
                        <label>Bill Reference</label>
                        <input type="text" name="ref">
                    </div>
                    <div class="row">
                        <label>Total to Pay</label>
                        <input type="text" name="amt">
                    </div>
                    <div class="row">
                        <label>Credit Card</label>
                        <input type="text" name="cc">
                    </div>
                    <button onclick="submitForm()">Process</button>
                </div>
                <script>
                    function submitForm() {
                        document.body.innerHTML = '<h1>Payment Received</h1><div class="receipt">RCPT-' + Date.now() + '</div>';
                    }
                </script>
            </body>
        </html>
    `);
});

app3.listen(4003, () => console.log('Portal 3 running on 4003'));
