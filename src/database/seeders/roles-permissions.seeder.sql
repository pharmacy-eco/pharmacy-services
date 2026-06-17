START TRANSACTION;

INSERT INTO roles (name, code, status, created_by, updated_by)
SELECT 'Admin', 'admin', 1, NULL, NULL
WHERE NOT EXISTS (
    SELECT 1 FROM roles WHERE code = 'admin'
);

INSERT INTO roles (name, code, status, created_by, updated_by)
SELECT 'User', 'user', 1, NULL, NULL
WHERE NOT EXISTS (
    SELECT 1 FROM roles WHERE code = 'user'
);

INSERT INTO permissions (name, code, slug, parent_id, status, created_by, updated_by)
SELECT 'Quản lý user', 'manage_user', 'quan-ly-user', NULL, 1, NULL, NULL
WHERE NOT EXISTS (
    SELECT 1 FROM permissions WHERE code = 'manage_user'
);

INSERT INTO permissions (name, code, slug, parent_id, status, created_by, updated_by)
SELECT 'Quản lý role', 'manage_role', 'quan-ly-role', NULL, 1, NULL, NULL
WHERE NOT EXISTS (
    SELECT 1 FROM permissions WHERE code = 'manage_role'
);

INSERT INTO permissions (name, code, slug, parent_id, status, created_by, updated_by)
SELECT 'Quản lý permission', 'manage_permission', 'quan-ly-permission', NULL, 1, NULL, NULL
WHERE NOT EXISTS (
    SELECT 1 FROM permissions WHERE code = 'manage_permission'
);

INSERT INTO role_has_permissions (role_id, permission_id)
SELECT r.id, p.id
FROM roles r
JOIN permissions p ON p.code IN ('manage_user', 'manage_role', 'manage_permission')
WHERE r.code = 'admin'
  AND NOT EXISTS (
      SELECT 1
      FROM role_has_permissions rhp
      WHERE rhp.role_id = r.id
        AND rhp.permission_id = p.id
  );

COMMIT;
