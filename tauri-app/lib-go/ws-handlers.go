package main

import (
	"encoding/json"
	"fmt"
	"os"

	"github.com/gorilla/websocket"
)

func GetFileSz(data *[]string) []IGetFileSzRet {
	fmt.Println("[getFileSz]")
	files := *data

	var res []IGetFileSzRet

	for _, file := range files {
		info, err := os.Stat(file)
		if err != nil {
			println(err)
			continue
		}

		res = append(res, IGetFileSzRet{Name: file, Sz: float64(info.Size())})
		// fmt.Println(info.Size())
	}

	return res

}

func handleGetFileSz(conn *websocket.Conn, messageType *int, data *any) {
	_d, _ := (*data).([]any)
	_data := ToSlice[string](&_d)
	filesInfo := GetFileSz(&_data)
	parsedData, err := json.Marshal(filesInfo)
	if err != nil {
		fmt.Println("Error sending data via Ws", err)
		return
	}

	conn.WriteMessage(websocket.TextMessage, parsedData)
}
