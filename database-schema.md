Database Schema for Alumni Portal (MVP)

# users
| Column | Type | Constraints |
|--------|------|-------------|
| id | UUID/INT | PRIMARY KEY |
| email | VARCHAR(255) | UNIQUE, NOT NULL |
| role | ENUM('user', 'admin') | DEFAULT 'user' |
| is_verified | BOOLEAN | DEFAULT false |
| is_active | BOOLEAN | DEFAULT true |
| created_at | TIMESTAMP | DEFAULT NOW() |
| updated_at | TIMESTAMP | DEFAULT NOW() |

# user_profiles
| Column | Type | Constraints |
|--------|------|-------------|
| id | UUID/INT | PRIMARY KEY |
| user_id | UUID/INT | FOREIGN KEY (users.id), UNIQUE |
| name | VARCHAR(255) | NOT NULL |
| about | TEXT | NULL |
| profile_picture_url | VARCHAR(500) | NULL |
| phone | VARCHAR(20) | NULL |
| preferred_time_to_connect | TEXT | NULL |
| preferred_way_to_connect | TEXT | NULL |
| social_media_links | TEXT | NULL |
| my_expertise | TEXT | NULL |
| created_at | TIMESTAMP | DEFAULT NOW() |
| updated_at | TIMESTAMP | DEFAULT NOW() |

# experiences
| Column | Type | Constraints |
|--------|------|-------------|
| id | UUID/INT | PRIMARY KEY |
| user_id | UUID/INT | FOREIGN KEY (users.id) |
| designation | VARCHAR(255) | NOT NULL |
| industry | VARCHAR(255) | NULL |
| company_name | VARCHAR(255) | NOT NULL |
| description | TEXT | NULL |
| start_date | DATE | NOT NULL |
| end_date | DATE | NULL |
| is_present | BOOLEAN | DEFAULT false |
| location_city | VARCHAR(100) | NULL |
| location_state | VARCHAR(100) | NULL |
| location_country | VARCHAR(100) | NULL |
| created_at | TIMESTAMP | DEFAULT NOW() |
| updated_at | TIMESTAMP | DEFAULT NOW() |

# education_certificates
| Column | Type | Constraints |
|--------|------|-------------|
| id | UUID/INT | PRIMARY KEY |
| user_id | UUID/INT | FOREIGN KEY (users.id) |
| type | ENUM('education', 'certificate') | NOT NULL |
| school | VARCHAR(255) | NULL |
| course | VARCHAR(255) | NOT NULL |
| degree_or_certificate_name | VARCHAR(255) | NOT NULL |
| start_date | DATE | NULL |
| end_date | DATE | NULL |
| is_present | BOOLEAN | DEFAULT false |
| description | TEXT | NULL |
| created_at | TIMESTAMP | DEFAULT NOW() |
| updated_at | TIMESTAMP | DEFAULT NOW() |

# skills
| Column | Type | Constraints |
|--------|------|-------------|
| id | UUID/INT | PRIMARY KEY |
| name | VARCHAR(100) | UNIQUE, NOT NULL |
| created_at | TIMESTAMP | DEFAULT NOW() |

# user_skills
| Column | Type | Constraints |
|--------|------|-------------|
| id | UUID/INT | PRIMARY KEY |
| user_id | UUID/INT | FOREIGN KEY (users.id) |
| skill_id | UUID/INT | FOREIGN KEY (skills.id) |
| created_at | TIMESTAMP | DEFAULT NOW() |

**Composite Unique**: (user_id, skill_id)

# otp_tokens
| Column | Type | Constraints |
|--------|------|-------------|
| id | UUID/INT | PRIMARY KEY |
| email | VARCHAR(255) | NOT NULL |
| token | VARCHAR(10) | NOT NULL |
| expires_at | TIMESTAMP | NOT NULL |
| is_used | BOOLEAN | DEFAULT false |
| created_at | TIMESTAMP | DEFAULT NOW() |

---

# Relationships
- users (1) → user_profiles (1)
- users (1) → experiences (N)
- users (1) → education_certificates (N)
- users (M) ↔ skills (N) via user_skills

