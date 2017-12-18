package main

import (
	"database/sql"
	"fmt"
	"log"

	_ "github.com/lib/pq"
)

func main() {
	// http.Handle("/", http.FileServer(http.Dir("build")))

	// http.ListenAndServeTLS(":8080", "cert.pem", "key.pem", nil)
	connStr := "user=shyl password=rz9h19cg dbname=sis sslmode=disable"
	db, err := sql.Open("postgres", connStr)
	if err != nil {
		log.Fatal(err)
	}

	rows, err := db.Query("select * from users;")
	if err != nil {
		log.Fatal(err)
	}

	col, _ := rows.Columns()
	fmt.Println(col[0])
}
