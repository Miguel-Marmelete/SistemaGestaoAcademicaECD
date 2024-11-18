<!DOCTYPE html>
<html>
<head>
    <title>Verify Your Email Address</title>
</head>
<body>
    <p>Hello,</p>
    <p>Please click the link below to verify your email address:</p>
    <a href="{{ config('app.url') }}/api/verify-email/{{ $token }}">Verify Email</a>
</body>
</html>
