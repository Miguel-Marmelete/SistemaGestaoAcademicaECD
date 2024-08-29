<!DOCTYPE html>
<html>
<head>
    <title>New Professor Registration</title>
</head>
<body>
    <p>Hello Admin,</p>
    <p>A new professor has verified their email address:</p>
    <p>Name: {{ $pendingProfessor->name }}</p>
    <p>Email: {{ $pendingProfessor->email }}</p>
    <a href="{{ url('/api/approve-professor/' . $pendingProfessor->verification_token) }}">Aprove professor</a>
</body>
</html>
