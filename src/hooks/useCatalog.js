"use client";
import { useQuery } from "@tanstack/react-query";

// Live catalog from the API, shared by search suggestions and the bag.
export const useCatalog = () =>
  useQuery({
    queryKey: ["products"],
    queryFn: async () => {
      const res = await fetch("/api/products");
      if (!res.ok) throw new Error("Could not load products");
      return res.json();
    },
  });
