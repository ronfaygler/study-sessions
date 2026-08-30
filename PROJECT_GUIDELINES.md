# Project Guidelines

## Git Workflow Rules

### Commit Strategy
- **Make a commit after completing each feature/endpoint**
- Each commit should include:
  - The complete function/endpoint implementation
  - Unit tests for the feature
  - Integration tests for database operations
  - Any necessary schema changes

### Git Push Rules
- **NEVER push to GitHub without explicit approval**
- After completing a feature and making a commit, ask for approval before pushing
- Wait for user confirmation before running `git push`

### Commit Message Guidelines
- **Never mention AI in commit messages**
- Use clear, descriptive messages about what was actually implemented
- Examples:
  - "Add user registration endpoint with validation"
  - "Implement login with JWT authentication"
  - "Add unit tests for auth controller"

## Development Workflow

### Feature Development Process
1. Implement the feature/endpoint
2. Write unit tests (with mocks)
3. Write integration tests (with real database)
4. Run all tests to ensure they pass
5. Make a commit with descriptive message
6. **Ask for approval before pushing**
7. Push only after user confirms

### Testing Requirements
- Every new feature must have:
  - Unit tests for business logic validation
  - Integration tests for database operations
  - Tests should cover both success and error cases

## Project Structure Notes

### Backend
- ES modules (`"type": "module"`)
- PostgreSQL database with test database
- Jest for testing with `NODE_ENV=test`
- Test database config in `tests/.env.test`

### Important Files
- `src/db.js` - Database connection with environment-based config
- `tests/.env.test` - Test database credentials (gitignored)
- `.env` - Production database credentials (gitignored)

## Remember
- Always ask before git operations
- No AI mentions in commits
- Test-driven approach for new features
- Clean git history with meaningful commits
