const apiUrl = 'http://localhost:3500'; // Adjust based on your backend

// Admin Login
document.getElementById('adminLoginForm')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('adminEmail').value;
    const password = document.getElementById('adminPassword').value;

    try {
        const response = await fetch(`${apiUrl}/admins/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }),
        });

        if (response.ok) {
            window.location.href = 'admin-dashboard.html';
        } else {
            document.getElementById('adminError').textContent = 'Invalid credentials';
        }
    } catch (error) {
        console.error('Error:', error);
    }
});

// Handle Customer Login
document.getElementById('customerLoginForm')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('customerEmail').value;
    const password = document.getElementById('customerPassword').value;

    try {
        const response = await fetch(`${apiUrl}/customers/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }),
        });

        if (response.ok) {
            window.location.href = 'customer-dashboard.html'; // Redirect on success
        } else {
            document.getElementById('customerError').textContent = 'Invalid credentials';
        }
    } catch (error) {
        console.error('Error:', error);
    }
});

// Handle Customer Registration
document.getElementById('customerRegistrationForm')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const name = document.getElementById('regName').value;
    const email = document.getElementById('regEmail').value;
    const password = document.getElementById('regPassword').value;
    const phone = document.getElementById('regPhone').value;
    const address = document.getElementById('regAddress').value;

    try {
        const response = await fetch(`${apiUrl}/customers/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, email, password, phone, address }),
        });

        if (response.ok) {
            alert('Registration successful! You can now log in.');
            window.location.href = 'login-customer.html'; // Redirect to login page
        } else {
            document.getElementById('registrationError').textContent = 'Registration failed. Please try again.';
        }
    } catch (error) {
        console.error('Error:', error);
    }
});
