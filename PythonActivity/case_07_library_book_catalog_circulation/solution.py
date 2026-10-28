#!/usr/bin/env python3
"""
Case Study 07: Public Library Catalog, Search & Overdue Fine Circulation System
Author: Student (PythonActivity Repository)
Purpose: Manages catalog search, loan transactions, renewal restrictions,
         and progressive overdue late fine matrices.
"""

from typing import List, Dict, Optional

class Book:
    def __init__(self, isbn: str, title: str, author: str, category: str):
        self.isbn = isbn
        self.title = title
        self.author = author
        self.category = category
        self.status = "AVAILABLE"
        self.borrower_id: Optional[str] = None
        self.due_day: Optional[int] = None
        self.renewal_count = 0

class Patron:
    def __init__(self, patron_id: str, name: str):
        self.patron_id = patron_id
        self.name = name
        self.borrowed_isbns: List[str] = []
        self.accumulated_fines: float = 0.0

class LibrarySystem:
    def __init__(self):
        self.catalog: Dict[str, Book] = {}
        self.patrons: Dict[str, Patron] = {}

    def add_book(self, book: Book):
        self.catalog[book.isbn] = book

    def register_patron(self, patron: Patron):
        self.patrons[patron.patron_id] = patron

    def search_books(self, query: str) -> List[Book]:
        q = query.lower()
        return [
            b for b in self.catalog.values() 
            if q in b.title.lower() or q in b.author.lower() or q == b.isbn
        ]

    def checkout_book(self, patron_id: str, isbn: str, current_day: int = 1) -> str:
        patron = self.patrons.get(patron_id)
        book = self.catalog.get(isbn)

        if not patron or not book:
            raise KeyError("Invalid Patron ID or ISBN")
        if patron.accumulated_fines > 10.0:
            raise PermissionError(f"Borrowing blocked: {patron.name} has ${patron.accumulated_fines:.2f} in unpaid fines.")
        if len(patron.borrowed_isbns) >= 5:
            raise ValueError("Max 5 books can be borrowed concurrently.")
        if book.status != "AVAILABLE":
            raise ValueError(f"Book '{book.title}' is currently {book.status}.")

        book.status = "BORROWED"
        book.borrower_id = patron_id
        book.due_day = current_day + 14
        book.renewal_count = 0
        patron.borrowed_isbns.append(isbn)
        return f"Successfully checked out '{book.title}'. Due on day {book.due_day}."

    def calculate_fine(self, days_late: int) -> float:
        """Progressive fine matrix: Grace 1d, $0.25/day up to 7d, $0.50/day beyond, Max $20."""
        if days_late <= 1:
            return 0.0
        if days_late <= 7:
            fine = days_late * 0.25
        else:
            fine = (7 * 0.25) + ((days_late - 7) * 0.50)
        return round(min(20.00, fine), 2)

    def return_book(self, isbn: str, return_day: int) -> Dict:
        book = self.catalog.get(isbn)
        if not book or book.status != "BORROWED":
            raise ValueError("Item was not borrowed.")
        
        patron = self.patrons[book.borrower_id]
        days_late = max(0, return_day - book.due_day)
        fine_incurred = self.calculate_fine(days_late)

        patron.accumulated_fines += fine_incurred
        patron.borrowed_isbns.remove(isbn)
        book.status = "AVAILABLE"
        book.borrower_id = None
        book.due_day = None

        return {
            "book_title": book.title,
            "patron_name": patron.name,
            "days_late": days_late,
            "fine_incurred": fine_incurred,
            "patron_total_unpaid": patron.accumulated_fines
        }

def run_case_study():
    lib = LibrarySystem()
    lib.add_book(Book("978-0134685991", "Effective Java", "Joshua Bloch", "Computer Science"))
    lib.add_book(Book("978-0262033848", "Introduction to Algorithms", "Thomas H. Cormen", "Computer Science"))
    lib.add_book(Book("978-0596517748", "JavaScript: The Good Parts", "Douglas Crockford", "Computer Science"))
    
    lib.register_patron(Patron("PAT-101", "Meera Krishnan"))
    lib.register_patron(Patron("PAT-102", "Alex Mercer"))

    print("=" * 80)
    print(" PUBLIC LIBRARY CATALOG & CIRCULATION AUDIT")
    print("=" * 80)
    print("1. Searching Catalog for keyword 'Algorithms'...")
    search_res = lib.search_books("Algorithms")
    for b in search_res:
        print(f"   Found: [{b.isbn}] '{b.title}' by {b.author} - Status: {b.status}")

    print("
2. Meera checking out 'Introduction to Algorithms' on Day 1...")
    msg = lib.checkout_book("PAT-101", "978-0262033848", current_day=1)
    print(f"   -> {msg}")

    print("
3. Simulating late return on Day 28 (13 days overdue)...")
    ret = lib.return_book("978-0262033848", return_day=28)
    print(f"   -> Title Returned   : {ret['book_title']}")
    print(f"   -> Overdue Days     : {ret['days_late']} days")
    print(f"   -> Late Fine Levied : ${ret['fine_incurred']:.2f}")
    print(f"   -> Patron Outstanding Balance : ${ret['patron_total_unpaid']:.2f}")
    print("=" * 80)

if __name__ == "__main__":
    run_case_study()
