import { useParams } from "react-router-dom";
import { MovieDetails } from "@/features/movie-details";
import { NotFound } from "@/shared/ui/not-found";

export default function MovieDetailsPage() {
  const { id } = useParams<{ id: string }>();

  if (!id) return <NotFound title="Invalid movie id" />;


  return <MovieDetails id={id} />;
}