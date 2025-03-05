package main

import (
	"context"
	"fmt"
	"net"
	"net/http"
	"os"
	"slices"
	"strings"

	"github.com/wailsapp/wails/v2/pkg/runtime"
)

// App struct
type App struct {
	ctx context.Context
}

// NewApp creates a new App application struct
func NewApp() *App {
	return &App{}
}

// startup is called at application startup
func (a *App) startup(ctx context.Context) {
	// Perform your setup here
	a.ctx = ctx
	// Init http server for serving files
	initServer()
}

// domReady is called after front-end resources have been loaded
func (a App) domReady(ctx context.Context) {
	// Add your action here
}

// beforeClose is called when the application is about to quit,
// either by clicking the window close button or calling runtime.Quit.
// Returning true will cause the application to continue, false will continue shutdown as normal.
func (a *App) beforeClose(ctx context.Context) (prevent bool) {
	return false
}

// shutdown is called at application termination
func (a *App) shutdown(ctx context.Context) {
	// Perform your teardown here
}

// Greet returns a greeting for the given name
func (a *App) Greet(name string) string {
	return fmt.Sprintf("Hello %s, It's show time!", name)
}

// Tu
var port = 0

// Check if a port is available and return the first open port
func findAvailablePort(startPort int) int {
	for port := startPort; port <= startPort+50; port++ {
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
	fmt.Println("Init HTTP SERVER...")
	port = findAvailablePort(45874)
	http.HandleFunc("/files", func(w http.ResponseWriter, r *http.Request) {
		// localhost:3000/files?path=/path.to/file
		filePath := r.URL.Query().Get("path")
		// fmt.Println("\nFilepath: \n", filePath)
		audioPath := filePath // Change this to your file path
		// audioPath := "C:\\Users\\User\\Music\\sample.mp3" // Windows (Use double backslashes)

		// Ensure file exists
		if _, err := os.Stat(audioPath); os.IsNotExist(err) {
			http.Error(w, "File not found", http.StatusNotFound)
			return
		}

		http.ServeFile(w, r, audioPath)
	})

	fmt.Printf("Serving files at http://localhost:%d/files\n", port)
	http.ListenAndServe(fmt.Sprintf(":%d", port), nil)

}

func (a *App) GetPort() int {
	return port
}

func (a *App) ImportVideo() string {
	file, err := runtime.OpenFileDialog(a.ctx, runtime.OpenDialogOptions{
		Title: "Open video",
		Filters: []runtime.FileFilter{{
			DisplayName: "Video files",
			Pattern:     "*." + strings.Join(videoExtensions, ";*."), //"*.mp4;*.avi;*.mkv;*.ts",
		}},
	})
	if err != nil {
		fmt.Println("Failed to open file")
		return ""
	}
	return file
}

type VidThumb struct {
	Filename string `json:"filename"`
	Thumb    string `json:"thumb"`
}

// Gets other videos in directory and generate their thumbnails
func (a *App) GenThumbnails(dir string) []VidThumb {

	dummyThumb := "/USB/Operation Fortune Ruse De Guerre (2023) [720p] [BluRay] [YTS.MX]/www.YTS.MX.jpg"
	// First check if dir exists
	res, err := os.ReadDir(dir)
	if err != nil {
		fmt.Println(dir, "Does not exist")
		return nil
	}

	var vidThumbs []VidThumb

	for _, file := range res {
		slicedFilename := strings.Split(file.Name(), ".")
		ext := slicedFilename[len(slicedFilename)-1]
		if file.IsDir() || !slices.Contains(videoExtensions, ext) {
			continue
		}
		vidThumbs = append(vidThumbs, VidThumb{Filename: fmt.Sprintf("%s/%s", dir, file.Name()), Thumb: dummyThumb})
	}
	return vidThumbs
}

func (a *App) CloseApp() {
	res, _ := runtime.MessageDialog(a.ctx, runtime.MessageDialogOptions{
		Type:    runtime.QuestionDialog,
		Title:   "Close app",
		Message: "Are you sure you want to close app?",
	})
	if res == "Yes" {
		runtime.Quit(a.ctx)
	}
}
