# Contributing to Doyo

Thank you for interest in contributing to Doyo! We welcome contributions from the community. This document provides guidelines to help you contribute effectively.

## Code of Conduct

Please review our [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md) before contributing.

## Ways to Contribute

- **Report Bugs** - Find a bug? Open an issue with details
- **Suggest Features** - Have an idea? Share it in discussions
- **Fix Bugs** - Submit PRs for existing issues
- **Implement Features** - Work on approved feature requests
- **Improve Documentation** - Help us document better
- **Write Tests** - Increase test coverage

## Getting Started

1. **Fork the Repository**
   ```bash
   git clone https://github.com/YOUR_USERNAME/doyo.git
   cd doyo
   ```

2. **Set Up Development Environment**
   ```bash
   # Follow DEVELOPMENT.md for setup
   ```

3. **Create a Branch**
   ```bash
   git checkout -b feature/your-feature-name
   # or
   git checkout -b fix/your-bug-fix
   ```

4. **Make Changes**
   - Write clean, well-commented code
   - Follow the existing code style
   - Add tests for new features
   - Update documentation as needed

5. **Test Your Changes**
   ```bash
   # Backend tests
   cd backend
   pytest

   # Frontend tests
   cd frontend
   npm test

   # Linting
   cd backend && black . && flake8 .
   cd ../frontend && npm run lint
   ```

6. **Commit Changes**
   ```bash
   git add .
   git commit -m "type: clear, concise description"
   ```

   **Commit Types:**
   - `feat:` - New feature
   - `fix:` - Bug fix
   - `docs:` - Documentation
   - `style:` - Code style (formatting)
   - `refactor:` - Code reorganization
   - `perf:` - Performance improvement
   - `test:` - Tests
   - `chore:` - Build, dependencies

7. **Push & Create Pull Request**
   ```bash
   git push origin feature/your-feature-name
   ```
   Then open a PR on GitHub with a clear description

## Pull Request Guidelines

### PR Title
- Use conventional commits format: `type: description`
- Keep it concise and descriptive
- Example: `feat: add email verification flow`

### PR Description
Include:
- **What:** Description of changes
- **Why:** Problem being solved
- **How:** Implementation approach
- **Testing:** How to test the changes
- **Screenshots:** For UI changes (optional)

### Example PR
```markdown
## What
Implement email verification for user registration

## Why
Prevent spam signups and verify user email ownership

## How
- Add EmailVerification model
- Add verification endpoint
- Add email sending task
- Add verification tests

## Testing
1. Register with email
2. Check email for verification link
3. Click link to verify
4. User should be marked verified

## Screenshots
[Screenshot of verification email]
```

### PR Checklist
- [ ] Tests added/updated
- [ ] Documentation updated
- [ ] Code follows project style
- [ ] No breaking changes (or documented)
- [ ] Commits are squashed/meaningful

## Code Style

### Backend (Python)

**Follow PEP 8 via Black formatter:**
```bash
black .
flake8 .
```

**Example:**
```python
# Good
def get_user_orders(user_id: int) -> QuerySet:
    """Get all orders for a specific user."""
    return Order.objects.filter(user_id=user_id).select_related('provider')

# Bad
def get_user_orders(userid):
    return Order.objects.filter(user_id=userid)
```

**Django Best Practices:**
- Use model methods for business logic
- Keep views slim (use services)
- Write descriptive docstrings
- Use type hints
- Add tests for all features

### Frontend (TypeScript/React)

**Use Prettier formatter:**
```bash
npm run format
```

**Example:**
```typescript
// Good
interface UserProfile {
  id: string;
  email: string;
  firstName: string;
  isProvider: boolean;
}

const getUserProfile = async (userId: string): Promise<UserProfile> => {
  const response = await fetch(`/api/users/${userId}`);
  return response.json();
};

// Bad
const get_user_profile = async (userId) => {
  const response = await fetch('/api/users/' + userId);
  return await response.json();
};
```

**React Best Practices:**
- Use functional components with hooks
- Keep components small and focused
- Prop validation with TypeScript
- Meaningful component names
- Add unit tests

## Testing

### Backend Tests
```bash
cd backend

# Run all tests
pytest

# Run specific test
pytest apps/users/tests/test_models.py::TestCustomUser

# With coverage
pytest --cov=apps --cov-report=html

# With markers
pytest -m "slow"
```

**Test Structure:**
```python
# tests/test_models.py
import pytest
from apps.users.models import CustomUser

class TestCustomUser:
    @pytest.fixture
    def user(self, db):
        return CustomUser.objects.create_user(
            email='test@example.com',
            password='testpass123'
        )
    
    def test_user_creation(self, db):
        user = CustomUser.objects.create_user(
            email='new@example.com',
            password='testpass123'
        )
        assert user.email == 'new@example.com'
    
    def test_user_string_representation(self, user):
        assert str(user) == user.email
```

### Frontend Tests
```bash
cd frontend

# Run all tests
npm test

# Run specific test
npm test -- users.test.ts

# With coverage
npm test -- --coverage
```

## Documentation

### Update When:
- Adding new features
- Changing APIs
- Modifying architecture
- Adding environment variables

### Documentation Files:
- `README.md` - Project overview
- `DEVELOPMENT.md` - Setup & development
- `docs/` - Detailed docs
- Code comments - Complex logic
- Docstrings - Functions/classes

## Reporting Issues

### Bug Report Template
```markdown
**Describe the bug**
Clear description of what the bug is

**Steps to Reproduce**
1. Navigate to...
2. Click on...
3. Observe...

**Expected Behavior**
What should happen

**Actual Behavior**
What actually happened

**Environment**
- OS: [e.g., macOS 14.0]
- Python: [e.g., 3.11.0]
- Node: [e.g., 20.0.0]

**Additional Context**
Error messages, screenshots, etc.
```

### Feature Request Template
```markdown
**Describe the feature**
Clear description of the feature

**Use Case**
Why this feature is needed

**Proposed Solution**
How it should work

**Alternatives Considered**
Other approaches

**Additional Context**
Examples, mockups, references
```

## Review Process

1. **Automated Checks**
   - Tests must pass
   - Code coverage ≥ 80%
   - Linting must pass

2. **Code Review**
   - At least 1 maintainer review
   - Discussions on changes
   - Suggestions for improvement

3. **Approval & Merge**
   - PR must be approved
   - Branch must be up to date
   - All checks must pass
   - Merge to main branch

## Commit Guidelines

### Good Commit Messages
```
feat: add password reset functionality

- Add PasswordReset model
- Add reset email endpoint
- Add frontend form
- Add tests for reset flow
- Update documentation
```

### Bad Commit Messages
```
fixed stuff
updates
WIP
```

## Release Process

1. **Versioning:** Follow [Semantic Versioning](https://semver.org/)
   - MAJOR.MINOR.PATCH (e.g., 1.0.0)

2. **CHANGELOG:** Update before release
   ```markdown
   ## [1.1.0] - 2026-02-25
   ### Added
   - New feature X
   
   ### Fixed
   - Bug Y
   ```

3. **Tag Release:**
   ```bash
   git tag -a v1.1.0 -m "Release version 1.1.0"
   git push origin v1.1.0
   ```

## Questions?

- **Discussions:** GitHub Discussions
- **Issues:** GitHub Issues
- **Email:** contact@doyo.io

## Thank You!

Your contributions make Doyo better! 🎉

---

**Last Updated:** February 25, 2026
