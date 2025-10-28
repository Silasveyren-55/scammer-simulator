# Contributing to Scammer Simulator

Thank you for your interest in contributing to Scammer Simulator! This document provides guidelines and instructions for contributing to the project.

## Code of Conduct

- Be respectful and professional in all interactions
- Use this tool only for authorized security testing
- Report security vulnerabilities responsibly
- Respect the privacy and security of others

## Getting Started

### 1. Fork the Repository

Click the "Fork" button on GitHub to create your own copy of the repository.

### 2. Clone Your Fork

```bash
git clone https://github.com/your-username/scammer-simulator.git
cd scammer-simulator
```

### 3. Create a Feature Branch

```bash
git checkout -b feature/your-feature-name
```

Use descriptive branch names like:
- `feature/add-proxy-support`
- `fix/cors-issue`
- `docs/update-readme`

## Development Setup

### Backend

```bash
cd backend
npm install
npm run dev
```

### Frontend

In another terminal:

```bash
cd frontend
npm install
npm run dev
```

## Making Changes

### Code Style

- Use consistent indentation (2 spaces)
- Follow existing code patterns
- Add comments for complex logic
- Keep functions small and focused

### Commit Messages

Write clear, descriptive commit messages:

```
feat: add proxy support for distributed testing
fix: resolve CORS issue with frontend
docs: update installation instructions
```

Use these prefixes:
- `feat:` for new features
- `fix:` for bug fixes
- `docs:` for documentation
- `style:` for code style changes
- `refactor:` for code refactoring
- `test:` for test additions

### Testing

Before submitting:
1. Test your changes locally
2. Verify both backend and frontend work
3. Check for console errors
4. Test with different scenarios

## Submitting Changes

### 1. Push to Your Fork

```bash
git push origin feature/your-feature-name
```

### 2. Create a Pull Request

1. Go to the original repository
2. Click "New Pull Request"
3. Select your branch
4. Fill in the PR template with:
   - Description of changes
   - Related issues
   - Testing performed
   - Screenshots (if applicable)

### 3. PR Review Process

- Maintainers will review your code
- Address any feedback or requested changes
- Once approved, your PR will be merged

## Reporting Issues

### Bug Reports

Include:
- Clear description of the bug
- Steps to reproduce
- Expected vs actual behavior
- Screenshots or error logs
- Your environment (OS, Node version, etc.)

### Feature Requests

Include:
- Clear description of the feature
- Use cases and benefits
- Possible implementation approach
- Any related issues

## Documentation

### Updating README

- Keep it clear and concise
- Update examples if behavior changes
- Add new features to the features list
- Update API documentation

### Adding Comments

- Explain the "why", not just the "what"
- Use clear, professional language
- Keep comments up-to-date with code changes

## Project Structure

```
scammer-simulator/
├── backend/
│   ├── index.js          # Main server file
│   ├── package.json      # Dependencies
│   └── Dockerfile        # Docker configuration
├── frontend/
│   ├── src/
│   │   ├── App.jsx       # Main component
│   │   ├── App.css       # Styling
│   │   └── main.jsx      # Entry point
│   ├── package.json      # Dependencies
│   └── Dockerfile        # Docker configuration
├── README.md             # Documentation
├── LICENSE               # MIT License
└── docker-compose.yml    # Docker Compose config
```

## Areas for Contribution

### High Priority

- [ ] Proxy support for distributed testing
- [ ] CAPTCHA detection and handling
- [ ] Advanced bot detection testing
- [ ] Performance optimizations

### Medium Priority

- [ ] Additional attack vectors
- [ ] Analytics dashboard
- [ ] Scheduled testing
- [ ] Multi-language support

### Low Priority

- [ ] UI/UX improvements
- [ ] Additional documentation
- [ ] Example test cases
- [ ] Community tools

## Security Considerations

When contributing:

1. **Never commit sensitive data** (API keys, passwords, etc.)
2. **Use environment variables** for configuration
3. **Validate all inputs** in backend endpoints
4. **Sanitize outputs** in frontend
5. **Keep dependencies updated** for security patches
6. **Report vulnerabilities privately** to maintainers

## Questions?

- Check existing issues and discussions
- Ask in pull request comments
- Open a new discussion for general questions

## Recognition

Contributors will be recognized in:
- README.md contributors section
- Release notes
- GitHub contributors page

Thank you for contributing to making Scammer Simulator better!
