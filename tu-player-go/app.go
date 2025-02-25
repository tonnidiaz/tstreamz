package main

import (
	"context"
	"fmt"
	"net"
	"net/http"
	"os"
)

// Globall vars
var port int

// App struct
type App struct {
	ctx context.Context
}

// NewApp creates a new App application struct
func NewApp() *App {
	return &App{}
}

// startup is called when the app starts. The context is saved
// so we can call the runtime methods
func (a *App) startup(ctx context.Context) {
	a.ctx = ctx
	initServer()
}

// Greet returns a greeting for the given name
func (a *App) Greet(name string) string {
	return fmt.Sprintf("Hello %s, It's show time niggas!", name)
}

// Tu custom
func findAvailablePort(startPort int) int {
	for port := startPort; port <= startPort+10; port++ {
		ln, err := net.Listen("tcp", fmt.Sprintf(":%d", port))
		if err == nil {
			ln.Close()
			return port
		}
	}
	fmt.Println("No available ports found in range.")
	os.Exit(1)
	return 0
}

func initServer() {
	fmt.Println("Initializer")
	port = findAvailablePort(45874)
	http.HandleFunc("/files", func(w http.ResponseWriter, r *http.Request) {
		// localhost:3000/files?path=/path.to/file
		filePath := r.URL.Query().Get("path")
		fmt.Println("\nFilepath: \n", filePath)
		audioPath := filePath // Change this to your file path
		// audioPath := "C:\\Users\\User\\Music\\sample.mp3" // Windows (Use double backslashes)

		// Ensure file exists
		if _, err := os.Stat(audioPath); os.IsNotExist(err) {
			http.Error(w, "File not found", http.StatusNotFound)
			return
		}

		http.ServeFile(w, r, audioPath)
	})

	fmt.Printf("Serving audio at http://localhost:%d/audio\n", port)
	http.ListenAndServe(fmt.Sprintf(":%d", port), nil)

}

func (a *App) GetPort() int { return port }
