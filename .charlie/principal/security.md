---
id: security
load: on_demand
version: 1.0.0
---

# Security

The rules that protect what we build and those who use it.

Security is not a feature. It is a property.
A product that works but is not secure does not work.

Security is everyone's responsibility.
The moment it becomes "the security team's problem," it is no one's problem.

Every security decision starts with three questions:
What are we protecting? From whom? What does failure look like?
Without these answers, every defense is a guess.

Read this before any work involving external services, authentication,
user data, or system boundaries.

---

## 1. Secrets Are Not Code

**Secrets belong in the environment. Never in the repository.**

A leaked secret is not a bug. It is a breach.
The moment a secret touches version control, assume it is compromised.

- API keys, tokens, passwords, certificates — none of these go in code, config files, or comments.
- Use environment variables or a secrets manager. No exceptions.
- Do not log secrets. Not even partially. Not even "for debugging."
- Provide a template showing what secrets are needed, with placeholder values only. Never commit the real values.
- If a secret is accidentally committed, rotate it immediately. Removing the commit is not enough — git history is permanent.

---

## 2. Trust Nothing External

**All input from outside the system boundary is hostile until validated.**

The attacker uses whatever you accept.
If you accept anything, the attacker can do anything.

- Validate, sanitize, and constrain all external input — user input, API responses, file uploads, URL parameters.
- Use allowlists over denylists. Reject unknown, accept known.
- Never construct SQL, shell commands, or HTML from raw input. Use parameterized queries, safe APIs, and templating engines.
- Do not deserialize untrusted data. Deserialization of external input is a remote code execution waiting to happen.
- Validate on the server. Client-side validation is UX, not security.
- Restrict cross-origin access explicitly. An open CORS policy is an open door.
- Treat external API responses as untrusted. They can be compromised, spoofed, or changed without notice.

---

## 3. Least Privilege

**Request only what is needed. Expose only what is required.**

Every unnecessary permission is an unnecessary attack surface.
The question is not "do we need this access now?"
It is "what happens if this access is compromised?"

- Services run with the minimum permissions required.
- APIs expose only the data the caller needs. No full objects when a subset suffices.
- File permissions, database roles, cloud IAM — always constrain to the narrowest scope.
- Do not use admin credentials for application logic. Ever.
- Isolate workloads. Containers, sandboxes, network segmentation — when a process is compromised, limit the blast radius.
- Tokens and sessions expire. If they do not expire, they will eventually be stolen.

---

## 4. Authentication and Authorization Are Separate

**Authentication proves who you are. Authorization decides what you can do. Never conflate them.**

"Logged in" does not mean "allowed."
A valid session proves identity. It does not grant permission.

- Do not implement your own cryptographic primitives. Use proven, maintained libraries for auth and encryption.
- Check authorization on every request. Not just the first.
- Server decides access. The client is a suggestion.
- Session management: secure flags, HttpOnly, SameSite. These are not optional.
- Password storage: bcrypt, scrypt, or argon2. Nothing else.
- Protect authentication endpoints against brute force. Rate limiting is not optional.
- Security-sensitive code demands additional review. Authentication, authorization, cryptography, data access control — these are not regular code changes.

---

## 5. Protect Data at Every Stage

**Data at rest, in transit, and in use — all three must be secured.**

There is no trusted network. Internal is not safe.
Every connection is authenticated and encrypted, or it is a liability.

Data is the target. Not the code. Not the infrastructure. The data.
Protecting code while leaving data exposed
is locking the door with the windows open.

- TLS everywhere. No exceptions for "internal" services.
- Encrypt sensitive data at rest. If the disk is stolen, the data is still safe.
- Classify data. Know which fields are PII, which are confidential, which are public.
- Log access to sensitive data. If you cannot answer "who accessed what, when" — your audit trail is broken.
- Do not expose sensitive data in URLs, error messages, or logs.
- Retention: do not keep data longer than needed. Data you do not have cannot be breached.

---

## 6. Dependencies Are Attack Surface

**Every dependency is code you did not write, running with your permissions.**

A supply chain attack does not need to find a bug in your code.
It just needs one compromised library in your dependency tree.

- Pin dependency versions. A floating version is an unreviewed code change.
- Review what you add. Read the package scope, permissions, and maintainer history before adopting.
- Fewer dependencies is more secure. If you can write it in 20 lines, do not import a package.
- Keep dependencies updated. Known vulnerabilities with available patches are negligence, not risk.
- Use lockfiles. Commit them. They are the snapshot of what you actually run.
- Secure the build pipeline. If the CI/CD is compromised, every deployment is compromised.

---

## 7. Fail Secure

**When something goes wrong, the system must default to the safe state.**

A crash is better than an open door.
When the auth service is down, the answer is "access denied" — not "access granted."

- Default deny. If the system cannot verify, it must reject.
- Defense in depth. No single layer is sufficient. When one defense fails — and it will — the next must hold.
- Error messages to users must not reveal system internals.
- Security-critical failures must be loud. Alert, log, and notify.
- Do not trust client-reported errors or status codes for security decisions.
- Security is not a one-time setup. Review, test, and audit continuously. A system that was secure last year is not necessarily secure today.
