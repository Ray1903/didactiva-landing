import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const { username, password } = await request.json();

  if (!username || !password) {
    return NextResponse.json(
      { error: "Username and password are required" },
      { status: 400 }
    );
  }

  const moodleUrl = process.env.NEXT_PUBLIC_MOODLE_URL;
  const moodleToken = process.env.MOODLE_TOKEN;

  if (!moodleUrl || !moodleToken) {
    return NextResponse.json(
      { error: "Moodle configuration not found" },
      { status: 500 }
    );
  }

  const res = await fetch(`${moodleUrl}/login/token.php`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      username,
      password,
      service: "moodle_mobile_app",
    }),
  });

  const data = await res.json();
  return NextResponse.json(data);
}
