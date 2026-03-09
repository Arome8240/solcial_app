# Monorepo Migration Guide

This document explains the migration from separate repositories to a monorepo structure.

## What Changed

### Before (Separate Repos)
```
solcial/                    # Mobile app repo
├── .git/
├── app/
├── components/
└── ...

solcial-backend/            # Backend repo
├── .git/
├── src/
└── ...
```

### After (Monorepo)
```
solcial/                    # Single monorepo
├── .git/                   # Single git repository
├── apps/
│   ├── mobile/            # Mobile app (formerly solcial/)
│   └── backend/           # Backend API (formerly solcial-backend/)
├── packages/              # Shared packages (future)
├── package.json           # Root package.json
├── pnpm-workspace.yaml    # Workspace configuration
└── README.md
```

## Migration Steps Completed

1. ✅ Removed `.git` folders from both projects
2. ✅ Created monorepo structure with `apps/` and `packages/` directories
3. ✅ Moved mobile app to `apps/mobile/`
4. ✅ Moved backend to `apps/backend/`
5. ✅ Created root `package.json` with workspace configuration
6. ✅ Created `pnpm-workspace.yaml` for pnpm workspaces
7. ✅ Initialized new git repository with `main` as default branch
8. ✅ Created initial commit

## Git Configuration

- **Default Branch**: `main`
- **Repository**: Single git repository at root level
- **Commit**: Initial commit with all code

## Working with the Monorepo

### Install Dependencies

```bash
# Install all dependencies
pnpm install

# Or install for specific app
cd apps/mobile && pnpm install
cd apps/backend && pnpm install
```

### Run Applications

```bash
# From root
pnpm mobile          # Start mobile app
pnpm backend         # Start backend

# Or from app directory
cd apps/mobile && pnpm start
cd apps/backend && pnpm start:dev
```

### Add Dependencies

```bash
# Add to mobile app
pnpm --filter mobile add <package>

# Add to backend
pnpm --filter backend add <package>

# Add to root (dev dependencies)
pnpm add -D -w <package>
```

### Git Workflow

```bash
# Create feature branch
git checkout -b feature/my-feature

# Make changes
git add .
git commit -m "feat: add new feature"

# Push to remote
git push origin feature/my-feature
```

## Benefits of Monorepo

1. **Single Source of Truth**: All code in one repository
2. **Easier Code Sharing**: Share types, utilities between apps
3. **Atomic Commits**: Changes across apps in single commit
4. **Simplified CI/CD**: Single pipeline for all apps
5. **Better Collaboration**: Easier to see full picture
6. **Consistent Tooling**: Shared configs and dependencies

## Next Steps

1. Set up remote repository (GitHub/GitLab)
2. Configure CI/CD pipelines
3. Create shared packages in `packages/` directory
4. Update deployment configurations
5. Update team documentation

## Old Directories

The original `solcial-backend/` directory still exists outside the monorepo.
You can safely delete it after verifying everything works:

```bash
# Verify monorepo works first, then:
rm -rf ../solcial-backend
```

## Questions?

See `CONTRIBUTING.md` for development guidelines or reach out to the team.
