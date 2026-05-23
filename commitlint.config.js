module.exports = {
    extends: ['@commitlint/config-conventional'],
    rules: {
        'type-enum': [
            2,
            'always',
            [
                'feat', // Tính năng mới
                'fix', // Sửa lỗi
                'docs', // Chỉnh sửa tài liệu
                'refactor', // Cải thiện code (không thay đổi tính năng)
                'perf', // Cải thiện hiệu suất
                'test', // Bổ sung/chỉnh sửa test
                'chore', // Công việc lặt vặt (chạy lệnh, CI/CD...)
            ],
        ],
        // 'subject-case': [2, 'always', 'sentence-case'],
        'subject-case': [0],
    },
};
