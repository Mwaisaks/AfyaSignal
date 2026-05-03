\set ON_ERROR_STOP on

CREATE TEMP TABLE import_users (LIKE users INCLUDING DEFAULTS);
CREATE TEMP TABLE import_facilities (LIKE facilities INCLUDING DEFAULTS);
CREATE TEMP TABLE import_assessments (LIKE assessments INCLUDING DEFAULTS);
CREATE TEMP TABLE import_alerts (LIKE alerts INCLUDING DEFAULTS);

\copy import_users (id, created_at, email, facility, name, password, phone, role, village) FROM 'database/import/csv/users.csv' WITH (FORMAT csv, HEADER true, NULL '');
\copy import_facilities (id, available_beds, name, operating_hours, phone, sub_county, total_beds, village, manager_id) FROM 'database/import/csv/facilities.csv' WITH (FORMAT csv, HEADER true, NULL '');
\copy import_assessments (id, age_months, child_id, child_name, cough, cough_days, created_at, diarrhea, diarrhea_days, difficulty_breathing, fever, fever_days, lethargy, other_symptoms, parent_name, parent_phone, rash, referral_reason, respiratory_rate, seizures, temperature, triage_category, triage_explanation, village, vomiting, weight, chv_id, referral_facility_id) FROM 'database/import/csv/assessments.csv' WITH (FORMAT csv, HEADER true, NULL '');
\copy import_alerts (id, case_count, created_at, day_window, message, status, type, village) FROM 'database/import/csv/alerts.csv' WITH (FORMAT csv, HEADER true, NULL '');

INSERT INTO users (id, created_at, email, facility, name, password, phone, role, village)
SELECT id, created_at, email, facility, name, password, phone, role, village
FROM import_users
ON CONFLICT (email) DO UPDATE SET
    facility = EXCLUDED.facility,
    name = EXCLUDED.name,
    password = EXCLUDED.password,
    phone = EXCLUDED.phone,
    role = EXCLUDED.role,
    village = EXCLUDED.village;

INSERT INTO facilities (id, available_beds, name, operating_hours, phone, sub_county, total_beds, village, manager_id)
SELECT f.id, f.available_beds, f.name, f.operating_hours, f.phone, f.sub_county, f.total_beds, f.village, COALESCE(u.id, f.manager_id)
FROM import_facilities f
LEFT JOIN import_users iu ON iu.id = f.manager_id
LEFT JOIN users u ON u.email = iu.email
ON CONFLICT (id) DO UPDATE SET
    available_beds = EXCLUDED.available_beds,
    name = EXCLUDED.name,
    operating_hours = EXCLUDED.operating_hours,
    phone = EXCLUDED.phone,
    sub_county = EXCLUDED.sub_county,
    total_beds = EXCLUDED.total_beds,
    village = EXCLUDED.village,
    manager_id = EXCLUDED.manager_id;

INSERT INTO assessments (id, age_months, child_id, child_name, cough, cough_days, created_at, diarrhea, diarrhea_days, difficulty_breathing, fever, fever_days, lethargy, other_symptoms, parent_name, parent_phone, rash, referral_reason, respiratory_rate, seizures, temperature, triage_category, triage_explanation, village, vomiting, weight, chv_id, referral_facility_id)
SELECT a.id, a.age_months, a.child_id, a.child_name, a.cough, a.cough_days, a.created_at, a.diarrhea, a.diarrhea_days, a.difficulty_breathing, a.fever, a.fever_days, a.lethargy, a.other_symptoms, a.parent_name, a.parent_phone, a.rash, a.referral_reason, a.respiratory_rate, a.seizures, a.temperature, a.triage_category, a.triage_explanation, a.village, a.vomiting, a.weight, COALESCE(u.id, a.chv_id), a.referral_facility_id
FROM import_assessments a
LEFT JOIN import_users iu ON iu.id = a.chv_id
LEFT JOIN users u ON u.email = iu.email
ON CONFLICT (child_id) DO UPDATE SET
    age_months = EXCLUDED.age_months,
    child_name = EXCLUDED.child_name,
    cough = EXCLUDED.cough,
    cough_days = EXCLUDED.cough_days,
    diarrhea = EXCLUDED.diarrhea,
    diarrhea_days = EXCLUDED.diarrhea_days,
    difficulty_breathing = EXCLUDED.difficulty_breathing,
    fever = EXCLUDED.fever,
    fever_days = EXCLUDED.fever_days,
    lethargy = EXCLUDED.lethargy,
    other_symptoms = EXCLUDED.other_symptoms,
    parent_name = EXCLUDED.parent_name,
    parent_phone = EXCLUDED.parent_phone,
    rash = EXCLUDED.rash,
    referral_reason = EXCLUDED.referral_reason,
    respiratory_rate = EXCLUDED.respiratory_rate,
    seizures = EXCLUDED.seizures,
    temperature = EXCLUDED.temperature,
    triage_category = EXCLUDED.triage_category,
    triage_explanation = EXCLUDED.triage_explanation,
    village = EXCLUDED.village,
    vomiting = EXCLUDED.vomiting,
    weight = EXCLUDED.weight,
    chv_id = EXCLUDED.chv_id,
    referral_facility_id = EXCLUDED.referral_facility_id;

INSERT INTO alerts (id, case_count, created_at, day_window, message, status, type, village)
SELECT id, case_count, created_at, day_window, message, status, type, village
FROM import_alerts
ON CONFLICT (id) DO UPDATE SET
    case_count = EXCLUDED.case_count,
    created_at = EXCLUDED.created_at,
    day_window = EXCLUDED.day_window,
    message = EXCLUDED.message,
    status = EXCLUDED.status,
    type = EXCLUDED.type,
    village = EXCLUDED.village;

SELECT
    (SELECT COUNT(*) FROM import_users) AS imported_users,
    (SELECT COUNT(*) FROM import_facilities) AS imported_facilities,
    (SELECT COUNT(*) FROM import_assessments) AS imported_assessments,
    (SELECT COUNT(*) FROM import_alerts) AS imported_alerts;
