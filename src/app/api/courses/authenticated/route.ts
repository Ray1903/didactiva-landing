import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const token = searchParams.get("token");

    if (!token) {
      return NextResponse.json({ error: "Token is required" }, { status: 400 });
    }

    const moodleUrl = process.env.MOODLE_URL;
    const moodleToken = process.env.MOODLE_TOKEN;

    if (!moodleUrl || !moodleToken) {
      return NextResponse.json(
        { error: "Moodle configuration not found" },
        { status: 500 }
      );
    }

    // Preparar los datos para la petición a Moodle
    const formData = new URLSearchParams();
    formData.append("wstoken", moodleToken);
    formData.append("wsfunction", "core_course_get_courses");
    formData.append("moodlewsrestformat", "json");

    // Hacer la petición a Moodle
    const response = await fetch(moodleUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`Moodle API error: ${response.status}`);
    }

    const courses = await response.json();

    // Verificar si hay error en la respuesta de Moodle
    if (courses.errorcode) {
      throw new Error(`Moodle error: ${courses.message || "Unknown error"}`);
    }

    // Filtrar y formatear los cursos con URLs autenticadas
    const formattedCourses = courses
      .filter((course: any) => course.id > 1) // Excluir el curso del sitio (id=1)
      .map((course: any) => ({
        id: course.id,
        fullname: course.fullname,
        shortname: course.shortname,
        summary: course.summary || "",
        startdate: course.startdate,
        enddate: course.enddate,
        visible: course.visible,
        categoryid: course.categoryid,
        categoryname: course.categoryname || "",
        format: course.format,
        numsections: course.numsections,
        courseimage: course.courseimage || null,
        progress: course.progress || 0,
        hasprogress: course.hasprogress || false,
        isfavourite: course.isfavourite || false,
        hidden: course.hidden || false,
        showshortname: course.showshortname || false,
        coursecategory: course.coursecategory || "",
        // URL del curso con token de autenticación
        courseUrl: `http://localhost/didactiva/course/view.php?id=${course.id}&wstoken=${token}`,
        // URL de Moodle con token
        moodleUrl: `http://localhost/didactiva/?wstoken=${token}`,
      }))
      .sort((a: any, b: any) => a.fullname.localeCompare(b.fullname));

    return NextResponse.json({
      success: true,
      courses: formattedCourses,
      total: formattedCourses.length,
    });
  } catch (error) {
    console.error("Error fetching authenticated courses from Moodle:", error);
    return NextResponse.json(
      {
        error: "Failed to fetch courses",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
