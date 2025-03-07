package main

import (
	"fmt"
	"os"
)

func fileExists(filename string) bool {
	_, err := os.Stat(filename)
	return !os.IsNotExist(err)
}

func TuPrint(a ...any) {
	fmt.Println("\n[TU]", a)
}
