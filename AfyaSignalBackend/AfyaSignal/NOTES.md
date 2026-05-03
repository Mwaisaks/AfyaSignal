## Spring Security

app is using a stateless JWT security approach.

That is the right approach for your kind of app: a React frontend/mobile-style client talking to a
Spring Boot API.

How Security Works In Your App
Your security flow is:

1. User logs in through:

POST /api/auth/login

2. AfyaSignal/src/main/java/com/mwaisaka/AfyaSignal/service/impl/AuthServiceImpl.java:1 checks:
    - Does the email exist in PostgreSQL?
    - Does the password match the stored BCrypt hash?
3. If valid, AfyaSignal/src/main/java/com/mwaisaka/AfyaSignal/security/JwtService.java:1 creates a
   JWT containing:
    - user ID
    - email
    - role
    - expiry time
4. The frontend stores that token and sends it on protected requests:

Authorization: Bearer <token>

5. AfyaSignal/src/main/java/com/mwaisaka/AfyaSignal/security/JwtAuthFilter.java:1 checks the token on
   every request.
6. If the token is valid, Spring knows who the user is and what role they have.
7. Your controllers then enforce role-based access using @PreAuthorize, for example:

@PreAuthorize("hasRole('CHV')")

So your app has both:

- Authentication: “Who are you?”
- Authorization: “Are you allowed to do this?”

What You’re Doing Well
You are doing several things correctly:

- Using JWTs for an API backend.
- Disabling form login and HTTP Basic auth.
- Disabling sessions with STATELESS.
- Disabling CSRF, which is reasonable for a stateless Bearer-token API.
- Hashing passwords with BCrypt.
- Loading users from PostgreSQL instead of using Spring’s generated password.
- Using @PreAuthorize for role-based access.
- Keeping /api/auth/** public and protecting everything else.
- Allowing Swagger only explicitly.

This is a solid foundation.

Good Practices You Should Keep In Mind
A few things I would improve or watch as the app grows:

1. Do not use the fallback JWT secret in production.

This is okay for local dev:

app.jwt.secret=${JWT_SECRET:...}

But in production, always provide JWT_SECRET from the environment.

2. Disable Swagger in production.

Swagger is useful locally, but for production you usually want:

springdoc.api-docs.enabled=false
springdoc.swagger-ui.enabled=false

Or enable it only in a dev profile.

3. Be careful with ownership rules.

Right now, roles are checked. That is good.

But some endpoints may still need ownership checks. For example, a CHV should probably only view
assessments they submitted, not every assessment by ID.

So role checks answer:

Is this user a CHV?

Ownership checks answer:

Is this assessment owned by this CHV?

For real deployments, you want both.

4. Return clean JSON errors for 401 and 403.

Right now Spring can return default responses. Later, add custom handlers so clients get consistent
JSON like:

{
"error": "Unauthorized",
"message": "Missing or invalid token"
}

5. Keep JWT expiry reasonably short.

Your token expiry is currently configurable. Good.

For production, avoid very long-lived access tokens. A common setup is:

- short-lived access token
- refresh token if needed

For your current version, one JWT is fine.

Rule Of Thumb For Spring Boot Security
Use this mental model:

1. If you are building a server-rendered web app:
    - Use sessions.
    - Use form login.
    - Keep CSRF enabled.
2. If you are building an API for React/mobile:
    - Use JWT or another token-based system.
    - Disable form login.
    - Disable HTTP Basic unless specifically needed.
    - Use stateless sessions.
    - Disable CSRF if tokens are sent in the Authorization header.
3. Always separate:
    - Authentication: login, password checking, token creation.
    - Authorization: role checks, ownership checks, permissions.
4. Store users in the database.
    - Never rely on Spring’s generated password except for quick experiments.
5. Hash passwords.
    - Use BCrypt or Argon2.
    - Never store plain passwords.
6. Protect by default.
    - Public endpoints should be explicitly listed.
    - Everything else should require authentication.

Your app is already following this pattern well. The main next security improvement would be adding
ownership checks for sensitive records like assessments.