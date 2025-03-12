package main

import (
	"embed"
	"os"

	"github.com/wailsapp/wails/v2"
	"github.com/wailsapp/wails/v2/pkg/options"
	"github.com/wailsapp/wails/v2/pkg/options/assetserver"
	"github.com/wailsapp/wails/v2/pkg/options/linux"
	"github.com/wailsapp/wails/v2/pkg/options/windows"
)

//go:embed all:frontend/dist
var assets embed.FS

//go:embed build/tu-player.png
var icon []byte

func main() {
	// Create an instance of the app structure
	app := NewApp()
	argsWithoutProg := os.Args[1:]

	if len(argsWithoutProg) != 0 {
		TuPrint("launchArgs", argsWithoutProg)
		args = argsWithoutProg
	}
	// Create application with options
	err := wails.Run(&options.App{
		Title:  "Tu player",
		Width:  1024,
		Height: 768,
		AssetServer: &assetserver.Options{
			Assets: assets,
		},
		BackgroundColour: &options.RGBA{R: 27, G: 38, B: 54, A: 1},
		OnStartup:        app.startup,
		OnDomReady:       app.domReady,
		OnShutdown:       app.shutdown,
		OnBeforeClose:    app.beforeClose,
		Linux:            &linux.Options{Icon: icon},
		Windows:          &windows.Options{},
		Bind: []interface{}{
			app,
		},
		Frameless:       true,
		CSSDragProperty: "widows",
		CSSDragValue:    "1",
	})

	if err != nil {
		println("Error:", err.Error())
	}
}
