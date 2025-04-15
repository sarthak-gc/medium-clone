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

type Blog = {
  blogId: string;
  title: string;
  content: string;
  authorId: string;
  reactions: number;
  createdAt: Date;
};
type Feed = {
  following: Blog[];
  global: Blog[];
};

export const useBlogStore = create<Feed[]>(() => [
  {
    following: [],
    global: [],
  },
]);
