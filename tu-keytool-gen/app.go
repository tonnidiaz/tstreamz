package main

import (
	"context"
	"encoding/json"
	"fmt"
	"os"
	"os/exec"
	"runtime"
	"strings"

	"github.com/wailsapp/wails/v2/pkg/menu"
	wailsRuntime "github.com/wailsapp/wails/v2/pkg/runtime"
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
	_menu := menu.Menu{}
	// Add menu
	wailsRuntime.MenuSetApplicationMenu(a.ctx, &_menu)
	// Init http server for serving files
	// initServer()
}

// domReady is called after front-end resources have been loaded
func (a App) domReady(ctx context.Context) {
	// Add your action here
}

// beforeClose is called when the application is about to quit,
// either by clicking the window close button or calling wailsRuntime.Quit.
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

func (a *App) CloseApp() {
	// res, _ := wailsRuntime.MessageDialog(a.ctx, wailsRuntime.MessageDialogOptions{
	// 	Type:    wailsRuntime.QuestionDialog,
	// 	Title:   "Close app",
	// 	Message: "Are you sure you want to close app?",
	// })
	// if res == "Yes" {
	wailsRuntime.Quit(a.ctx)
	// }
}

func (a *App) SelectSaveDir() *string {
	res, err := wailsRuntime.OpenDirectoryDialog(a.ctx, wailsRuntime.OpenDialogOptions{Title: "Select save folder"})
	if err != nil || len(res) == 0 {
		return nil
	}
	return &res
}

func (a *App) ExecCmd(cmdStr string) *string {
	TuPrint("Runnig command: [", cmdStr, "]...")
	// command starts with [sh, -c] for unix and [cmd, /C] for windows
	var sh string
	if runtime.GOOS == "windows" {
		sh = "cmd /C"
	} else {
		sh = "sh -c"
	}

	cmd := exec.Command(strings.Split(sh, " ")[0], strings.Split(sh, " ")[1], cmdStr)
	output, err := cmd.CombinedOutput()
	if err != nil {
		TuPrint("Error:", err.Error())
		errStr := err.Error()
		return &errStr
	}
	TuPrint("Command done. Output:")
	TuPrint(string(output))
	return nil
}

func (a *App) GenKeystore(data string) *string {
	// Returns nil if successful or an error message if failed
	// Convert string to json
	// Select save directory
	// Get the keystore full path and delete file if it already exists
	// Run command to generate new keystore
	ok := "ok"
	var dataJson map[string]any
	err := json.Unmarshal([]byte(data), &dataJson)
	if err != nil {
		TuPrint("Err:", err)
		msg := "Failed to convert to JSON"
		return &msg
	}

	saveDir := a.SelectSaveDir()
	TuPrint("SaveDir:", *saveDir)
	if saveDir == nil {
		return &ok
	}

	keystorePath := fmt.Sprintf("%s/%s.keystore", *saveDir, dataJson["keystore"])
	os.Remove(keystorePath)

	cmdStr := fmt.Sprintf(`keytool -genkeypair -v \
-keystore %s \
-alias %s \
-keyalg RSA \
-keysize 2048 \
-validity 10000 \
-dname "CN=%s, OU=%s, O=%s, L=%s, ST=%s, C=%s" \
-storepass %s \
-keypass %s`, keystorePath, dataJson["alias"], dataJson["cn"], dataJson["ou"], dataJson["o"], dataJson["l"], dataJson["st"], dataJson["c"], dataJson["pwd"], dataJson["pwd"])
	TuPrint("Generating keystore...")
	res := a.ExecCmd(cmdStr)
	TuPrint("Done generating keystore")
	return res

}
