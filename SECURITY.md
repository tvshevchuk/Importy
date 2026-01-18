# Security Policy

## Supported Versions

We take security seriously and provide security updates for the following versions of Importy:

| Version | Supported          |
| ------- | ------------------ |
| 0.1.x   | :white_check_mark: |
| < 0.1.0 | :x:                |

## Reporting a Vulnerability

If you discover a security vulnerability in Importy, please report it responsibly by following these steps:

### 1. **Do Not** Create Public Issues

Please **do not** report security vulnerabilities through public GitHub issues, discussions, or pull requests.

### 2. Report Privately

Send your security report to one of the following:

- **GitHub Security Advisory**: Use GitHub's private vulnerability reporting feature
- **Direct Message**: Contact the maintainer directly through GitHub

### 3. Include Detailed Information

When reporting a vulnerability, please include:

- **Description**: A clear description of the vulnerability
- **Impact**: Potential impact and severity assessment
- **Reproduction**: Step-by-step instructions to reproduce the issue
- **Environment**: Node.js version, operating system, and Importy version
- **Proof of Concept**: If applicable, include a minimal example
- **Suggested Fix**: If you have ideas for remediation

### 4. Response Timeline

- **Acknowledgment**: We will acknowledge receipt of your report within 2 business days
- **Initial Assessment**: We will provide an initial assessment within 5 business days
- **Updates**: We will keep you informed of our progress weekly
- **Resolution**: We aim to resolve critical vulnerabilities within 30 days

## Security Considerations

### Code Analysis Safety

Importy performs static analysis of JavaScript/TypeScript code. While this is generally safe, be aware of the following:

#### File System Access
- Importy reads files from the directories you specify
- It does not execute or modify your code
- It only analyzes import statements and AST structures
- Ensure you run Importy only on trusted codebases

#### AST Parsing
- Uses Babel parser for code analysis
- Maliciously crafted files could potentially cause parsing issues
- Large or deeply nested files may cause memory issues
- We recommend running with appropriate resource limits in CI/CD

### Input Validation

#### Directory Paths
- Validate directory paths before passing to Importy
- Avoid running on system directories or sensitive locations
- Use absolute paths when possible to prevent directory traversal

#### Library Names
- Library names are used in string matching and regex patterns
- Malicious library names could potentially cause ReDoS (Regular Expression Denial of Service)
- We sanitize inputs, but use caution with untrusted input

#### File Patterns
- Include/exclude patterns use glob matching
- Complex patterns may cause performance issues
- Validate patterns before use in automated environments

### Dependencies Security

We regularly audit our dependencies for known vulnerabilities:

#### Core Dependencies
- `@babel/parser`: Used for JavaScript/TypeScript parsing
- `@babel/traverse`: Used for AST traversal
- `commander`: Used for CLI argument parsing

#### Security Measures
- Regular dependency updates via Dependabot
- Automated security scanning in CI/CD
- Minimal dependency footprint
- Lock file integrity checks

### CI/CD Security

If using Importy in automated environments:

#### Permissions
- Grant minimal required file system permissions
- Avoid running with elevated privileges
- Use dedicated service accounts in CI/CD

#### Resource Limits
- Set appropriate memory and CPU limits
- Configure timeouts for large codebases
- Monitor resource usage in production

#### Secrets Management
- Don't pass sensitive information via command line arguments
- Use environment variables or secure configuration files
- Avoid logging sensitive paths or filenames

## Known Security Limitations

### 1. File System Race Conditions
- Importy doesn't lock files during analysis
- Concurrent file modifications may cause inconsistent results
- Not suitable for analyzing actively changing codebases

### 2. Memory Usage
- Large codebases may consume significant memory
- No built-in memory limits (relies on Node.js/system limits)
- Consider using `--concurrency` flag to limit parallel processing

### 3. Path Traversal
- Input validation prevents most path traversal attacks
- However, symbolic links are followed without restriction
- Be cautious when analyzing untrusted directory structures

## Best Practices

### For End Users

1. **Validate Input**: Always validate directory paths and library names
2. **Resource Limits**: Set appropriate limits in containerized environments
3. **Trusted Sources**: Only analyze code from trusted sources
4. **Regular Updates**: Keep Importy updated to the latest version
5. **Monitoring**: Monitor resource usage in automated environments

### For Developers

1. **Input Sanitization**: Sanitize all user inputs
2. **Error Handling**: Implement proper error handling for file operations
3. **Logging**: Avoid logging sensitive information
4. **Testing**: Include security-focused test cases
5. **Code Review**: Review security implications of changes

### For CI/CD Integration

```bash
# Example secure CI/CD usage
# Set resource limits
ulimit -m 1048576  # 1GB memory limit
timeout 300 importy --dir ./src --lib react --concurrency 2

# Use specific directories only
importy --dir ./src --lib lodash --exclude "**/node_modules/**"

# Save results securely
importy --dir ./src --lib axios --output /tmp/importy-results.json
chmod 600 /tmp/importy-results.json
```

## Security Checklist

Before using Importy in production environments:

- [ ] Updated to latest version
- [ ] Validated all input parameters
- [ ] Set appropriate resource limits
- [ ] Configured proper logging
- [ ] Tested with representative codebase
- [ ] Implemented error handling
- [ ] Secured output files
- [ ] Documented security procedures

## Vulnerability Disclosure Policy

### Our Commitment
- We will investigate all legitimate reports
- We will provide credit to researchers who report vulnerabilities responsibly
- We will coordinate with reporters on disclosure timing
- We will maintain transparency about security issues

### Public Disclosure
- Security fixes will be announced in release notes
- CVE numbers will be requested for significant vulnerabilities
- We will provide migration guidance for breaking security changes

## Security Resources

### External Resources
- [Node.js Security Best Practices](https://nodejs.org/en/docs/guides/security/)
- [npm Security Guidelines](https://docs.npmjs.com/security/)
- [OWASP Top 10](https://owasp.org/www-project-top-ten/)

### Internal Resources
- [Contributing Guidelines](CONTRIBUTING.md)
- [Code of Conduct](CODE_OF_CONDUCT.md)
- [Release Process](.github/RELEASE_PROCESS.md)

## Contact

For security-related questions or concerns:

- **Maintainer**: [@tvshevchuk](https://github.com/tvshevchuk)
- **Repository**: [https://github.com/tvshevchuk/Importy](https://github.com/tvshevchuk/Importy)

---

This security policy is effective as of the latest version and will be updated as needed. Last updated: 18.01.2026