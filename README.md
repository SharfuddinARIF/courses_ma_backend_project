//============ API Testing====================//

1. Authentication Endpoints (/api/auth)

*AUTH-1----(POST)-----/api/auth/register----------(Successful registration-201/ Attempt to register with an existing email-400)

*AUTH-2----(POST)-----/api/auth/login----------(Successful login-200// login with invalid password-400 //login with an unregistered email--)


2. User Endpoints (/api/users)

GET,/api/users/me,Get the profile details of the authenticated user.,Private (Any Role)
PUT,/api/users/me,"Update the authenticated user's profile (e.g., name).",Private (Any Role)
GET,/api/users,Get a list of all registered users.,Private (Admin Only)

3. Courses endpoint

Method,Endpoint,Description,Access

GET,/api/courses,"Get all published courses (supports search ?q, filter ?category, and pagination).",Public
POST,/api/courses,Create a new course (requires image file upload).,"Private (Instructor, Admin)"
GET,/api/courses/:id,Get details for a single course by ID.,Public
PUT,/api/courses/:id,Update a specific course (allows updating course details and replacing the image).,Private (Owner or Admin)
DELETE,/api/courses/:id,Delete a specific course.,Private (Owner or Admin)
POST,/api/courses/:id/enroll,Enroll the authenticated user into a course.,"Private (Student, Admin)"



////////////////Every things is good to go////////////////////