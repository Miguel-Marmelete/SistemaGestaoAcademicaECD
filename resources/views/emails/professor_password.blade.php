<!DOCTYPE html>
<html>
<head>
    <title>Your Account Password</title>
</head>
<body>
    <h1>Welcome, {{ $professor->name }}!</h1>
    <p>Your account has been created in our system. Here are your login details:</p>
    <p>Email: {{ $professor->email }}</p>
    <p>Password: {{ $password }}</p>
    <p>Please login and change your password as soon as possible.</p>
</body>
</html>