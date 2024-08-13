import { Request, Response } from "express";
import prisma from "../prisma/client";
import { Book } from "../models/book";
import { UserRole } from "../models/roles";
import { AddBookRequestBody, AuthenticatedRequest } from "src/types/request";
import { AddBookResponse } from "src/types/response";
import { ErrorResponse } from "src/types/errors";

export const addBook = async (
  req: AuthenticatedRequest<AddBookRequestBody>,
  res: Response<AddBookResponse | ErrorResponse>
) => {
  try {
    const { title, author, publicationDate, genres } = req.body;

    if (!req?.user || (req.user.role & UserRole.Admin) === 0) {
      return res.status(403).json({ message: "Insufficient permissions" });
    }

    const newBook = await prisma.book.create({
      data: {
        title,
        author,
        publicationDate: new Date(publicationDate),
        genres,
      },
    });

    res.status(200).json(newBook);
  } catch (error) {
    res.status(500).json({ message: "Error adding book" } as ErrorResponse);
  }
};

export const getBooks = async (req: Request, res: Response) => {
  try {
    const books = await prisma.book.findMany();
    res.status(200).json(books);
  } catch (error) {
    res.status(500).json({ message: "Error fetching books", error });
  }
};

export const getBookById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const book = await prisma.book.findUnique({ where: { id: Number(id) } });

    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }

    res.status(200).json(book);
  } catch (error) {
    res.status(500).json({ message: "Error fetching book", error });
  }
};

export const updateBook = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { title, author, publicationDate, genres }: Book = req.body;

    const book = await prisma.book.update({
      where: { id: Number(id) },
      data: {
        title,
        author,
        publicationDate: new Date(publicationDate),
        genres,
      },
    });

    res.status(200).json(book);
  } catch (error) {
    res.status(500).json({ message: "Error updating book", error });
  }
};

export const deleteBook = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    await prisma.book.delete({
      where: { id: Number(id) },
    });

    res.status(204).json({ message: "Book deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting book", error });
  }
};
