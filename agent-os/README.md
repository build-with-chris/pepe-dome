# Agent-OS: PEPE Dome Project Management

This directory contains all project planning, specifications, and task tracking for the Pepe Dome platform.

## Directory Structure

```
agent-os/
├── product/              # Product-level documentation
│   ├── mission.md        # Product vision and strategy
│   ├── roadmap.md        # Phased development plan
│   └── tech-stack.md     # Technical architecture decisions
├── specs/                # Feature specifications
│   ├── hub-ecosystem-integration.md       # Main spec for hub feature
│   └── hub-ecosystem-integration-tasks.md # Detailed task breakdown
└── README.md             # This file
```

## Current Specs

### Complete Site Rebuild (ACTIVE)
**File**: [specs/complete-site-rebuild.md](specs/complete-site-rebuild.md)
**Status**: Ready for Implementation
**Priority**: Critical

Complete rebuild of the Pepe Dome platform with a clean, consistent design system implementation and fully functional admin area using shadcn/ui components.

**Key Features**:
- Design system reset (fix all broken CSS variables)
- Rebuild all public pages (Home, Events, News, Newsletter, About)
- Complete admin area with shadcn/ui (Events CRUD, Articles CRUD, Newsletters, Subscribers)
- Role-based access control (3 Clerk user groups: Super Admin, Editor, Viewer)
- Mobile-responsive and accessible throughout

**Tasks**: [specs/complete-site-rebuild-tasks.md](specs/complete-site-rebuild-tasks.md)
- **Total**: 69 tasks
- **Completed**: 0
- **Estimated Duration**: 8 days

---

### Hub Ecosystem Integration (ON HOLD)
**File**: [specs/hub-ecosystem-integration.md](specs/hub-ecosystem-integration.md)
**Status**: On Hold (waiting for site rebuild)
**Priority**: High

Transforms Pepe Dome into a central hub connecting three PEPE properties with unified calendar, editorial layout, and cross-site navigation.

**Key Features**:
- Hub hero with DotCloud particle animation and floating logos
- Unified calendar for events, classes, workshops across all properties
- Editorial layout with event-article linking
- Mobile-optimized calendar with detail views
- Admin UI with OpenAI-powered German content generation

**Tasks**: [specs/hub-ecosystem-integration-tasks.md](specs/hub-ecosystem-integration-tasks.md)
- **Total**: 78 tasks
- **Completed**: 3
- **In Progress**: 1
- **Estimated Duration**: 5 weeks

## How to Use

### For Developers

1. **Read the Spec**: Start with the main spec file to understand requirements
2. **Review Tasks**: Check the tasks file for detailed implementation steps
3. **Update Progress**: Mark tasks as completed as you work
4. **Ask Questions**: Add open questions to spec files as they arise

### For Product/Planning

1. **Product Docs**: Review `product/` folder for vision and roadmap
2. **Specs**: Each feature has a detailed spec in `specs/`
3. **Dependencies**: Check spec files for technical dependencies
4. **Timeline**: Task files include time estimates

### For AI Agents

When using the agent-os system:

```bash
# To work on a feature
/write-spec          # Create a new spec
/shape-spec          # Refine requirements through questions
/implement-spec      # Begin implementation following tasks.md
/verify-spec         # Verify implementation matches spec
```

## Workflow

### 1. Planning Phase
- Create spec document in `specs/`
- Define user stories, requirements, technical architecture
- List success criteria and dependencies

### 2. Task Breakdown
- Create companion `-tasks.md` file
- Break spec into actionable tasks
- Estimate time for each task
- Organize by phase/priority

### 3. Implementation
- Work through tasks sequentially or by priority
- Update task status as you progress
- Document decisions and blockers in spec

### 4. Verification
- Check success criteria from spec
- Verify all tasks are completed
- Update product roadmap

## Current Status

### Completed Work
- ✅ Design system integration (Phase 1)
- ✅ Logo update and brand identity
- ✅ Component library creation
- ✅ DotCloud module import (partial)

### In Progress
- 🔄 DotCloud component for Next.js

### Next Up
- Database schema setup
- Hub hero component
- Calendar system

## Related Documentation

- [DESIGN_SYSTEM.md](../DESIGN_SYSTEM.md) - Complete design system guide
- [COMPONENT_LIBRARY.md](../COMPONENT_LIBRARY.md) - React component usage
- [CLAUDE.md](../CLAUDE.md) - Original PRD

## Best Practices

1. **One Spec Per Feature**: Keep specs focused and manageable
2. **Detailed Tasks**: Break down work into < 1 day tasks
3. **Clear Success Criteria**: Define "done" upfront
4. **Update as You Go**: Keep docs current with implementation
5. **Link Everything**: Reference related docs and files

## Questions?

- Check the spec file for open questions
- Review related documentation
- Ask the development team
- Update this README if structure changes
