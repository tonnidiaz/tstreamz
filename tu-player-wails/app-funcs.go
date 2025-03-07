package main

func (a *App) GetArgs() []string {
	return args
}

func (a *App) FileExists(file string) bool {
	return fileExists(file)
}
