<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>@yield('title')</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #f4f4f4;
            margin: 0;
            padding: 0;
        }

        .email-container {
            background-color: #ffffff;
            max-width: 600px;
            margin: 20px auto;
            padding: 20px;
            border-radius: 10px;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
        }

        .email-header {
            background-color: #007bff;
            color: #ffffff;
            text-align: center;
            padding: 10px 0;
            border-radius: 10px 10px 0 0;
        }

        .email-body {
            padding: 20px;
        }

        .email-footer {
            background-color: #f4f4f4;
            text-align: center;
            padding: 10px 0;
            border-radius: 0 0 10px 10px;
        }
    </style>
</head>

<body>
    @yield('content')
</body>

</html>
