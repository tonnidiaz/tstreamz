package main

import (
	"encoding/json"
	"fmt"
	"net"
	"net/http"
	"os"

	"github.com/gorilla/websocket"
)

var port int

var upgrader = websocket.Upgrader{
	CheckOrigin: func(r *http.Request) bool { return true },
}

func handleConnections(w http.ResponseWriter, r *http.Request) {
	// Upgrade HTTP request to WebSocket
	conn, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		fmt.Println("Error upgrading to WebSocket:", err)
		return
	}
	defer conn.Close()

	fmt.Println("Client connected!")

	// Listen for messages from the client
	for {
		messageType, msg, err := conn.ReadMessage()
		if err != nil {
			fmt.Println("Read error:", err)
			break
		}

		var msgJson map[string]any

		err2 := json.Unmarshal([]byte(msg), &msgJson)
		if err2 != nil {
			fmt.Println("Error parsing json", err2)
			return
		}
		ev, ok := msgJson["ev"].(string) // Extract as string
		if !ok {
			fmt.Println("Err: Need to specify ev key")
			return
		}
		data, ok := msgJson["data"]
		if !ok {
			fmt.Println("No data key")
		}
		fmt.Println("Event:", ev, " ")
		fmt.Printf("Data type = %T\n", data)
		if ev == "GetFileSz" {
			handleGetFileSz(conn, &messageType, &data)
		}
		// fmt.Printf("Received: (%T) %s\n", msg, msg)

		// Echo message back to the client
		// err = conn.WriteMessage(messageType, msg)
		// if err != nil {
		// 	fmt.Println("Write error:", err)
		// 	break
		// }
	}
}

func main() {
	fmt.Printf("Tu Golang Lib: %d\n\n", port)
	http.HandleFunc("/ws", handleConnections)

	fmt.Println("WebSocket server started on port", port)
	err := http.ListenAndServe(fmt.Sprintf(":%d", port), nil)
	if err != nil {
		fmt.Println("Error starting server:", err)
	}
}

// Check if a port is available and return the first open port
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

func init() {
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

	fmt.Printf("Serving audio at http://localhost:%d/files\n", port)
	// http.ListenAndServe(fmt.Sprintf(":%d", port), nil)

}
