import { useEffect } from "react";
import { create } from "zustand";

// model Blog {
//   blogId     String    @unique @default(uuid())
//   title      String
//   content    String
//   authorId   String
//   reactions  Int       @default(0)
//   createdAt  DateTime  @default(now())
//   updatedAt  DateTime  @updatedAt
//   visibility BlogType  @default(PRIVATE)
//   isDeleted  Boolean   @default(false)
//   Comment    Comment[] @relation("BlogComments")

//   User      User        @relation("UploadedBlogs", fields: [authorId], references: [userId])
//   Reactions Reactions[]
// }

type BlogT = {
  blogId: string;
  title: string;
  content: string;
  authorId: string;
  reactions: number;
  createdAt: Date;
};

export const useAppStore = create<BlogT>((set) => ({
  blogId: "123",
  title: "123",
  content: "124",
  authorId: "123",
  reactions: 123,
  createdAt: new Date(Date.now()),
}));
