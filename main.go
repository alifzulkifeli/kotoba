package main

import (
	"log"
	"net/http"
)

func home(w http.ResponseWriter, r *http.Request) {

	if r.URL.Path != "/" {
		http.NotFound(w, r)
		return
	}
	w.Write([]byte("Hello from kotoba"))
}

func kotobaAdd(w http.ResponseWriter, r *http.Request) {

	if r.Method != "POST" {
		w.Header().Set("Allow", "POST")

		// this works but dont use it
		// w.WriteHeader(405)
		// w.Write([]byte("method not allowed"))
		// use this instead
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)

		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.Write([]byte(`{"name":"Alex"}`))

}

func kotobaView(w http.ResponseWriter, r *http.Request) {
	w.Write([]byte("View a kotoba"))
}

func main() {
	mux := http.NewServeMux()
	mux.HandleFunc("/", home)
	mux.HandleFunc("/kotoba/add", kotobaAdd)
	mux.HandleFunc("/kotoba/view", kotobaView)

	log.Print("Starting server on port :4000")
	err := http.ListenAndServe(":4000", mux)
	log.Fatal(err)
}
