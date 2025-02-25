package main

func ToSlice[T any](inp *[]any) []T {
	_interface := *inp
	out := make([]T, len(_interface))
	for i, v := range _interface {
		out[i] = v.(T)
	}
	return out
}
