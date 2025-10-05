// app/page.tsx
"use client";
import Image from "next/image";
import { useCourses } from "./hooks/useCourses";

export default function Home() {
  const { courses, loading, error } = useCourses();
  const moodleUrl = process.env.NEXT_PUBLIC_MOODLE_URL;

  return (
    <main className="bg-white">
      {/* Hero */}
      <section className="relative bg-gradient-to-l from-[#224383] to-[#1446AA] text-white py-20">
        <div className="container mx-auto px-6 text-center">
          <div className="mb-6">
            <span className="bg-[#00BFA5] text-white px-4 py-2 rounded-full text-sm font-semibold inline-block mb-4">
              DIPLOMADO DE IA EN SALUD
            </span>
            <span className="bg-[#673AB7] text-white px-4 py-2 rounded-full text-sm font-semibold inline-block ml-2 mb-4">
              PRINCIPIANTE
            </span>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold mb-4">
            La Comunidad de Profesionales de la Salud Expertos en IA
          </h1>
          <p className="text-lg mb-8 max-w-2xl mx-auto">
            Cursos prácticos que te permiten aprender desde el uso de ChatGPT y
            otros LLMs hasta análisis de datos y aplicaciones en salud.
          </p>
          <a
            href="#catalogo"
            className="bg-[#00BFA5] text-white font-semibold px-6 py-3 rounded-lg shadow hover:bg-[#00C853] transition-colors duration-200"
          >
            Explorar Cursos
          </a>
        </div>
      </section>

      {/* Catálogo */}
      <section id="catalogo" className="py-16 container mx-auto px-6">
        <h2 className="text-3xl font-bold text-[#2C205E] text-center mb-10">
          Cursos en línea
        </h2>

        {loading && (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1446AA]"></div>
            <span className="ml-3 text-[#2C205E]">Cargando cursos...</span>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
            <h3 className="text-red-800 font-semibold mb-2">
              Error al cargar los cursos
            </h3>
            <p className="text-red-600">{error}</p>
          </div>
        )}

        {!loading && !error && courses.length === 0 && (
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 text-center">
            <h3 className="text-gray-800 font-semibold mb-2">
              No hay cursos disponibles
            </h3>
            <p className="text-gray-600">No se encontraron cursos en Moodle.</p>
          </div>
        )}

        {!loading && !error && courses.length > 0 && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {courses.map((course) => (
              <div
                key={course.id}
                className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 border border-gray-100"
              >
                <div className="bg-gradient-to-br from-[#2C205E] to-[#3F2E7A] h-48 rounded-lg mb-4 flex items-center justify-center">
                  <span className="text-white text-lg font-semibold text-center px-4">
                    {course.shortname}
                  </span>
                </div>
                <h3 className="text-xl font-semibold text-[#2C205E] mt-4 mb-2">
                  {course.fullname}
                </h3>
                {course.summary && (
                  <p className="text-sm text-gray-600 mb-3 line-clamp-3">
                    {course.summary.replace(/<[^>]*>/g, "")}
                  </p>
                )}
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs text-gray-500">
                    {course.categoryname}
                  </span>
                  <span
                    className={`text-xs px-2 py-1 rounded-full ${
                      course.visible
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {course.visible ? "Disponible" : "No disponible"}
                  </span>
                </div>
                <div className="mt-4">
                  <span className="text-[#00C853] text-2xl font-bold">
                    Consultar precio
                  </span>
                  <span className="text-gray-500 text-sm ml-2">
                    (Contactar)
                  </span>
                </div>
                <div className="flex gap-2 mt-4">
                  <a
                    href={course.courseUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 bg-[#1446AA] text-white py-2 px-4 rounded-lg hover:bg-[#5A489B] transition-colors duration-200 text-center"
                  >
                    Abrir Curso
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
