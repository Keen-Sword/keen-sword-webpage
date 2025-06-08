import socket
import urllib.parse
import os
import mimetypes

HOST = '127.0.0.1'
PORT = 8080
RUNNING = True

#############################################
### THIS IS A VERY VERY UGLY TEST SERVER! ###
#############################################
#          Do not use it please :3          #
#############################################

def serve_file(fp: str, error: bool=False) -> bytes | None:
    content_type, _ = mimetypes.guess_type(fp)

    if os.path.isfile(fp):
        with open(fp, "rb") as f:
            body = f.read()

        if error:
            return f"HTTP/1.1 404 Not Found\r\nContent-Type: {content_type}\r\n\r\n".encode() + body
        return f"HTTP/1.1 200 OK\r\nContent-Type: {content_type}\r\n\r\n".encode() + body
    else:
        return None

def handle_get_requests(path: str) -> bytes:
    file_path = os.path.join('./', path)
    if not os.path.splitext(path)[1]:
        file_path += ".html"

    response = serve_file(file_path)

    if path == "":
        return serve_file("index.html") # type: ignore
    if response == None:
        return serve_file("404.html", True) # type: ignore
    return response

def handle_head_requests(path: str) -> bytes:
    file_path = os.path.join('./', path)

    if not os.path.splitext(path)[1]:
        file_path += ".html"
    if path == "":
        file_path = "index.html"
    if not os.path.exists(file_path):
        file_path = "404.html"
        if not os.path.exists(file_path):
            return b"HTTP/1.1 404 Not Found\r\nContent-Length: 0\r\n\r\n"

    size = os.path.getsize(file_path)
    return f"HTTP/1.1 200 OK\r\nContent-Length: {size}\r\n\r\n".encode()

def handle_request(request: str) -> bytes:
    try:
        lines = request.split("\r\n")
        method, path, _ = lines[0].split()
        path = urllib.parse.unquote(path).lstrip('/').split('?')[0]

        try:
            print(f"Serving: {' '.join(lines[0:3])}")
        except:
            pass

        if method == "GET":
            return handle_get_requests(path)
        if method == "HEAD":
            return handle_get_requests(path)
        else:
            return f"HTTP/1.1 405 Method Not Allowed\r\nContent-Type: text/plain".encode()
    except Exception as e:
        print(e)
        return f"HTTP/1.1 500 Internal Server Error\r\nContent-Type: text/plain".encode()

with socket.socket(socket.AF_INET, socket.SOCK_STREAM, 0) as server_socket:
    server_socket.bind((HOST, PORT))
    server_socket.listen(1)

    print(f"\nServing on http://{HOST}:{PORT}\n")

    while RUNNING:
        client_socket, _ = server_socket.accept()

        with client_socket:
            request = client_socket.recv(1024).decode()
            response = handle_request(request)
            client_socket.sendall(response)