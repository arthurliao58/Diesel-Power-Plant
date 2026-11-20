import http.server
import socketserver
import webbrowser
import os

PORT = 8000
DIRECTORY = os.path.dirname(os.path.abspath(__file__))

class Handler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=DIRECTORY, **kwargs)

def run():
    with socketserver.TCPServer(("", PORT), Handler) as httpd:
        url = f"http://localhost:{PORT}/index.html"
        print(f"=======================================================")
        print(f"柴油發電廠互動學習平台 (Diesel Power Plant Hub)")
        print(f"正在啟動伺服器: {url}")
        print(f"按 Ctrl+C 可停止伺服器")
        print(f"=======================================================")
        webbrowser.open(url)
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\n伺服器已安全停止。")

if __name__ == "__main__":
    run()
