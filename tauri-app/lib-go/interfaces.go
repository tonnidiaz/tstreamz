package main

type IGetFileSzRet struct {
	Name string  `json:"name"`
	Sz   float64 `json:"sz"`
}

type IWsMessage struct {
	ev   string
	data any
}
