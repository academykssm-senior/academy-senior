# Data Model — AcadeMY Senior

This is a **preliminary conceptual data model**. It describes the entities, relationships, and data boundaries at an intent level only.

**This document is not:**
- A database schema
- Migration SQL
- A Supabase table definition

No tables have been created. No migrations have been written. The purpose of this document is to guide future schema design and surface decisions that need to be made before building begins.

Unresolved questions are marked **TBD**.

---

## Identifiers: UUID vs slug

Database records use **two identities**. They are not interchangeable.

| Identity | Where it lives | Purpose |
|---|---|---|
| UUID | Supabase primary / foreign keys | Relational identity, joins, RLS |
| Stable slug | Manifests, routes, application code | Public / curriculum identity |

**Rule:** Routes, curriculum manifests, and application code use stable slugs (`chemistry`, `chapter-02`). Supabase relational tables use UUID primary keys and UUID foreign keys.

Do **not** replace app slugs with UUIDs.  
Do **not** expose UUIDs in student-facing routes.

Example:

```
Subject
  id   = UUID          (database)
  slug = "chemistry"   (app / public)

Chapter
  id         = UUID
  subject_id = UUID    (FK → Subject.id)
  slug       = "chapter-02"
```

Progress and content loading in the application still address work by slug identity (`form` + `subjectId` + `chapterId` + `toolId` + `activityId` + `language`). A later database row may store both the UUID and a copy of those slugs, or resolve slugs to UUIDs at write time.

---

## Data Boundary: Shared Identity vs. Senior-Specific

A core principle is that **who a student is** (identity) is separate from **what a student has done in Senior** (learning data). This separation enables a future shared AcadeMY identity across Junior and Senior without merging application-specific data.

```
┌─────────────────────────────────────────────────────────┐
│                  Shared Identity Layer                  │
│  (eventually shared across Junior and Senior)           │
│                                                         │
│  User · Profile · Form Level · Language Preference      │
└────────────────────────┬────────────────────────────────┘
                         │ 1 student
                         │
┌────────────────────────▼────────────────────────────────┐
│               Senior Learning Data                      │
│  (scoped to this application only)                      │
│                                                         │
│  Progress · Flashcard State · Quiz History              │
│  XP · Missions · Companion · Notes Bookmarks            │
└─────────────────────────────────────────────────────────┘
```

---

## Shared Identity Entities

These entities belong to the identity layer. They will eventually be shared with Junior. Where they live (shared Supabase project, dedicated auth service, etc.) is **TBD-002 / TBD-003** in `docs/DECISIONS.md`.

### User
The authenticated account.

| Field | Type | Notes |
|---|---|---|
| id | uuid | Primary key; Supabase Auth UID |
| email | string | Unique; used for login |
| created_at | timestamp | Account creation time |
| last_sign_in_at | timestamp | Last successful login |

### Profile
Student-facing identity and preferences.

| Field | Type | Notes |
|---|---|---|
| id | uuid | FK → User.id |
| display_name | string | Student's chosen name |
| avatar_url | string (nullable) | Profile image URL |
| form_level | enum: 4, 5 | Current form year |
| language_preference | enum: bm, en | Application language ids. DLP is the student-facing label for `en` |
| created_at | timestamp | |
| updated_at | timestamp | |

---

## Senior Content Entities

These entities represent the learning content catalogue. Content is authored/managed (likely by admin/teacher roles — TBD) and consumed by students.

### Subject
A curriculum subject (e.g. Matematik, Biology, Physics).

| Field | Type | Notes |
|---|---|---|
| id | uuid | Primary key |
| slug | string | Unique public id (`chemistry`). Used in routes and manifests |
| name_bm | string | Subject name in BM |
| name_en | string | Subject name in English (DLP) |
| form_level | enum: 4, 5 | Which form this subject belongs to |
| language_stream | enum: BM, DLP, both | Display stream; app language ids remain `bm` / `en` |
| icon_url | string (nullable) | Visual icon for the subject card |
| sort_order | integer | Display ordering |
| is_active | boolean | Whether visible to students |

### Chapter
A chapter within a subject.

| Field | Type | Notes |
|---|---|---|
| id | uuid | Primary key |
| subject_id | uuid | FK → Subject.id |
| slug | string | Unique per subject (`chapter-02`). Used in routes and manifests |
| title_bm | string | Chapter title in BM |
| title_en | string | Chapter title in English |
| chapter_number | integer | Ordering within the subject |
| is_active | boolean | Whether visible to students |

### Note
A study note document within a chapter.

| Field | Type | Notes |
|---|---|---|
| id | uuid | Primary key |
| chapter_id | uuid | FK → Chapter.id |
| title_bm | string | |
| title_en | string | |
| content_bm | text/richtext | Note body in BM |
| content_en | text/richtext | Note body in English |
| sort_order | integer | |
| is_active | boolean | |

### FlashcardDeck
A set of flashcards for a chapter.

| Field | Type | Notes |
|---|---|---|
| id | uuid | Primary key |
| chapter_id | uuid | FK → Chapter.id |
| title_bm | string | |
| title_en | string | |
| is_active | boolean | |

### Flashcard
An individual flashcard within a deck.

| Field | Type | Notes |
|---|---|---|
| id | uuid | Primary key |
| deck_id | uuid | FK → FlashcardDeck.id |
| front_bm | string | Front face in BM |
| front_en | string | Front face in English |
| back_bm | string | Back face in BM |
| back_en | string | Back face in English |
| sort_order | integer | |

### Quiz
A quiz assessment for a chapter.

| Field | Type | Notes |
|---|---|---|
| id | uuid | Primary key |
| chapter_id | uuid | FK → Chapter.id |
| title_bm | string | |
| title_en | string | |
| passing_score | integer | Minimum score to pass (percentage) |
| xp_reward | integer | XP awarded on completion |
| is_active | boolean | |

### QuizQuestion
An individual question within a quiz.

| Field | Type | Notes |
|---|---|---|
| id | uuid | Primary key |
| quiz_id | uuid | FK → Quiz.id |
| question_bm | string | Question text in BM |
| question_en | string | Question text in English |
| question_type | enum: mcq, true_false | TBD — expand as needed |
| sort_order | integer | |

### QuizOption
An answer option for an MCQ question.

| Field | Type | Notes |
|---|---|---|
| id | uuid | Primary key |
| question_id | uuid | FK → QuizQuestion.id |
| option_text_bm | string | |
| option_text_en | string | |
| is_correct | boolean | |
| sort_order | integer | |

---

## Senior Learning Progress Entities

These entities record what a student has done. They are Senior-specific and must be RLS-protected (students see only their own records).

### ChapterProgress
Tracks a student's progress through a chapter.

| Field | Type | Notes |
|---|---|---|
| id | uuid | Primary key |
| student_id | uuid | FK → User.id |
| chapter_id | uuid | FK → Chapter.id |
| notes_viewed | boolean | Has opened the notes |
| flashcards_completed | boolean | Has completed the flashcard deck |
| quiz_completed | boolean | Has completed the quiz |
| quiz_score | integer (nullable) | Score of last quiz attempt |
| completion_percentage | integer | 0–100 derived summary |
| last_accessed_at | timestamp | |
| created_at | timestamp | |
| updated_at | timestamp | |

### FlashcardProgress
Tracks spaced-repetition state per card per student.

| Field | Type | Notes |
|---|---|---|
| id | uuid | Primary key |
| student_id | uuid | FK → User.id |
| flashcard_id | uuid | FK → Flashcard.id |
| confidence_level | enum: again, hard, good, easy | SRS confidence rating |
| next_review_at | timestamp | When to show the card again |
| review_count | integer | Total times reviewed |
| last_reviewed_at | timestamp | |

**Note:** Full SRS algorithm (e.g. SM-2 or similar) is TBD.

### QuizAttempt
Records each quiz attempt by a student.

| Field | Type | Notes |
|---|---|---|
| id | uuid | Primary key |
| student_id | uuid | FK → User.id |
| quiz_id | uuid | FK → Quiz.id |
| score | integer | Score achieved (percentage) |
| passed | boolean | Whether passing_score was met |
| xp_awarded | integer | XP given for this attempt |
| started_at | timestamp | |
| completed_at | timestamp (nullable) | Null if attempt abandoned |

### StudentXP
Tracks total and subject-level XP per student.

| Field | Type | Notes |
|---|---|---|
| id | uuid | Primary key |
| student_id | uuid | FK → User.id |
| subject_id | uuid (nullable) | FK → Subject.id; null = total XP |
| xp_total | integer | Accumulated XP |
| level | integer | Derived from xp_total (thresholds TBD) |
| updated_at | timestamp | |

**Note:** XP level thresholds and progression curve are TBD.

---

## Out of Scope for First Slice (Future Entities — TBD)

The following entities are planned but not needed for the first vertical slice. They are listed here for awareness only.

| Entity | Feature |
|---|---|
| Video | Notes/Videos feature |
| MindMap | Mind map feature |
| Mission | Missions feature |
| MissionProgress | Missions feature |
| Companion | Companion system |
| StudentCompanion | Companion system |
| AIConversation | Ace / Cikgu AI |
| Notification | Push / in-app notifications |
| TeacherProfile | Teacher/admin roles |
| ClassGroup | Class grouping for teacher analytics |

---

## Unresolved Data Model Decisions

| # | Decision | Blocking |
|---|---|---|
| TBD-DB-1 | Which Supabase project owns the shared identity tables | Shared identity implementation |
| TBD-DB-2 | SRS algorithm for flashcard spaced repetition (SM-2 or alternative) | FlashcardProgress schema |
| TBD-DB-3 | XP level thresholds and progression formula | StudentXP.level calculation |
| TBD-DB-4 | Whether quiz question images are stored in Supabase Storage or external CDN | QuizQuestion schema |
| TBD-DB-5 | Note content format — rich text (HTML/Markdown/Tiptap JSON) | Note.content fields |
| TBD-DB-6 | Teacher/admin role model and access control design | Teacher features, RLS policies |
| TBD-DB-7 | Audit logging requirements for student data | Compliance, analytics |
| TBD-DB-8 | Data retention and deletion policy for student records | PDPA / privacy compliance |
