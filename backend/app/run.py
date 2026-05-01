from app import create_app
 
app = create_app()
 
if __name__ == "__main__":
    # debug=True enables auto-reload on file changes (development only)
    app.run(debug=True, port=5000)