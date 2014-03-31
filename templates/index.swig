<!DOCTYPE HTML>
<html lang="en-US">
    <head>
        <meta charset="UTF-8">
        <title>GitBook</title>
        <link rel="icon" href="static/images/icons/32.png">
        <link rel="stylesheet" href="static/style.css">
        <meta content="text/html; charset=utf-8" http-equiv="Content-Type">
        <meta name="description" content="">
        <meta name="keywords" content="" >
    </head>
    <body>
        <div class="wrapper">
            <div id="header">
                <div class="inner">
                    <h1>GitBook</h1>
                    <p class="intro">Read and Write beautiful book and tutorials today.</p>
                </div>
            </div>
            <div id="body">
                <div class="featured">
                    <div class="container">
                        <div class="row">
                            {% for book in featured %}
                            <div class="col-md-6">
                                <div class="book">
                                    <div class="content">
                                        <h3>{{ book.title }}</h3>
                                        <p>{{ book.description }}</p>
                                    </div>
                                    <a class="read" href="{{ book.url }}">read it</a>
                                </div>
                            </div>
                            {% endfor %}
                        </div>
                    </div>
                </div>
            </div>
            <div id="footer">
                <a href="https://github.com/GitbookIO">It's Open Source</a>
                <a href="/book/GitbookIO/about">About GitBook</a>
            </div>
        </div>
    </body>
</html>