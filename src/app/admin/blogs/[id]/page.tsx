"use client";

import { useParams } from "next/navigation";
import { BlogEditor } from "@/components/admin/BlogEditor";

export default function EditBlogPage() {
  const { id } = useParams<{ id: string }>();
  return <BlogEditor id={id} />;
}
