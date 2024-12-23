const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = 3000;

// Path to books.json
const booksFilePath = path.join(__dirname, "books.json");

// Middleware to parse JSON request body
app.use(express.json());

// In-memory array to store books
let books = [];

// Load books from books.json file
fs.readFile(booksFilePath, "utf8", (err, data) => {
  if (!err) {
    books = JSON.parse(data || "[]");
  }
});

// API to get all books
app.get("/books", (req, res) => {
  res.json(books);
});

// API to add a book
app.post("/books", (req, res) => {
  const { title, author, year } = req.body;

  if (!title || !author || !year) {
    return res
      .status(400)
      .json({ message: "All fields (title, author, year) are required." });
  }

  const newBook = { id: books.length + 1, title, author, year };
  books.push(newBook);

  // Update books.json file
  fs.writeFile(booksFilePath, JSON.stringify(books, null, 2), (err) => {
    if (err) {
      return res
        .status(500)
        .json({ message: "Failed to save the book to the file." });
    }
  });

  res.status(201).json({ message: "Book added successfully!", book: newBook });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
