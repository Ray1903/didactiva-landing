import { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";

export interface Course {
  id: number;
  fullname: string;
  shortname: string;
  summary: string;
  startdate: number;
  enddate: number;
  visible: boolean;
  categoryid: number;
  categoryname: string;
  format: string;
  numsections: number;
  courseimage: string | null;
  progress: number;
  hasprogress: boolean;
  isfavourite: boolean;
  hidden: boolean;
  showshortname: boolean;
  coursecategory: string;
  courseUrl: string;
  moodleUrl?: string;
}

export interface CoursesResponse {
  success: boolean;
  courses: Course[];
  total: number;
}

export function useCourses() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user, isAuthenticated } = useAuth();

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(true);
        setError(null);

        // Usar API autenticada si el usuario está logueado
        const apiUrl =
          isAuthenticated && user?.token
            ? `/api/courses/authenticated?token=${user.token}`
            : "/api/courses";

        const response = await fetch(apiUrl);
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Error al cargar los cursos");
        }

        if (data.success) {
          setCourses(data.courses);
        } else {
          throw new Error(data.message || "Error al procesar los cursos");
        }
      } catch (err) {
        console.error("Error fetching courses:", err);
        setError(err instanceof Error ? err.message : "Error desconocido");
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, [isAuthenticated, user?.token]);

  return { courses, loading, error };
}
