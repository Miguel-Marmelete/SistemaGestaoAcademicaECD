<!DOCTYPE html>
<html>
<head>
<title>Confirm Admin Status</title>
</head>
<body>
<p>Hello,</p>
<p>Please click the link below to confirm your admin status:</p>
<a href="{{ url('/api/confirmAdmin/' . $token) }}">Confirm Admin Status</a>
</body>
</html>