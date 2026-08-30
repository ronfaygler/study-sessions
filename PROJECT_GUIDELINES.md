# Project Guidelines

## Git Workflow Rules

### Branch Strategy
- **Create a new branch for each feature**
- Branch naming convention: `feature/feature-name` (e.g., `feature/login-endpoint`)
- Work on the feature branch until completion
- After feature is complete (code + tests passing + pushed to main), delete the feature branch

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

### Feature Development Process (TDD - Test-Driven Development)
1. **Create a new branch** for the feature: `git checkout -b feature/feature-name`
2. **Write tests first** (they will fail initially)
3. Implement the minimal code to make tests pass
4. Run all tests to ensure they pass
5. Write unit tests (with mocks) if not already done
6. Write integration tests (with real database) if not already done
7. Run all tests to ensure everything passes
8. Make a commit with descriptive message
9. Switch to main branch and pull latest changes: `git checkout main && git pull`
10. Switch back to feature branch: `git checkout feature/feature-name`
11. Rebase feature branch on main: `git rebase main`
12. Switch to main branch: `git checkout main`
13. Merge feature branch to main: `git merge feature/feature-name`
14. **Ask for approval before pushing**
15. Push to main: `git push`
16. Delete feature branch: `git branch -d feature/feature-name`

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
- **Test-Driven Development (TDD): Write tests first, then implement code**
- Clean git history with meaningful commits
