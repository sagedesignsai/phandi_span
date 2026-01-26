# Career Profile Context Migration

## Changes Made

### 1. Schema Update (`lib/models/career-profile.ts`)
- **Merged job preferences into Career Profile Context**
- Added `jobSearch` section containing:
  - `jobTypes`: Employment types (full-time, part-time, contract, remote)
  - `industries`: Target industries
  - `locations`: Preferred work locations (SA cities)
  - `experienceLevel`: Career level (Entry/Mid/Senior/Executive)
  - `technicalSkills`: Key technical skills for matching
  - `salaryRange`: Min/max salary expectations (ZAR)
  - `preferredSources`: Job boards to search (Indeed, LinkedIn)
  - `autoApply`: Auto-application settings (enabled, threshold)

- **Simplified workPreferences**:
  - Removed duplicates now in `jobSearch`
  - Kept only: `workType` (remote/hybrid/onsite), `willingToRelocate`

- **Removed**: `industryExpertise` (merged into `jobSearch.industries`)

### 2. Database Migration (`supabase/migrations/010_merge_job_preferences_to_context.sql`)
- Adds default `jobSearch` structure to existing career profile contexts
- Preserves `job_preferences` table for backward compatibility (deprecated)

### 3. UI Updates (`components/career/profile-editor.tsx`)
- **New "Job Search" tab** (first tab) with:
  - Job types selector (badges)
  - Industries selector (badges)
  - Locations selector (SA cities, badges)
  - Experience level dropdown
  - Salary range inputs (ZAR)
  - Technical skills input with add/remove
  
- Updated all field paths to use `context_data.*` structure
- 5 tabs total: Job Search, Goals, Preferences, Profile, Skills & More

### 4. API Route (`app/api/career-profiles/[id]/context/route.ts`)
- Created GET/PUT endpoints for career profile context
- Handles authentication and authorization
- Uses Supabase client for data operations

### 5. Page Updates (`app/dashboard/careers/[id]/profile/page.tsx`)
- Removed dependency on local resume storage
- Directly uses career profile context from database
- Simplified save handler to only update context_data

## Benefits

1. **Single Source of Truth**: All career context in one place
2. **Better Job Matching**: Complete context available for AI algorithms
3. **Career-Scoped Preferences**: Different settings per career profile
4. **Simplified UX**: One form instead of separate job preferences
5. **Cleaner Architecture**: Eliminates data duplication

## Migration Path

1. ✅ Update schema with jobSearch section
2. ✅ Create database migration
3. ✅ Update UI components
4. ✅ Create API endpoints
5. ⏳ Run migration: `supabase migration up`
6. ⏳ Test profile editor with new fields
7. ⏳ Update job matching logic to read from career context
8. ⏳ Deprecate job_preferences table

## Next Steps

1. Apply the database migration
2. Test the profile editor UI
3. Update job matching/search logic to use `context_data.jobSearch`
4. Migrate existing `job_preferences` data (if any)
5. Remove job preferences form and routes
