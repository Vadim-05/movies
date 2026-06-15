import { Routes, Route } from 'react-router-dom'
import { Layout } from '@/app/layouts/Layout'
import HomePage from '@/pages/home';
import MovieDetailsPage from '@/pages/movie-details';
import CreateMoviePage from '@/pages/movie-create';
import EditMoviePage from '@/pages/movie-edit';

export function MainRouter() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="movie/:id" element={<MovieDetailsPage />} />
        <Route
          path="/movie/create"
          element={<CreateMoviePage />}
        />
         <Route
          path="/movie/edit/:id"
          element={<EditMoviePage />}
        /> 
      </Route>
    </Routes>
  )
}