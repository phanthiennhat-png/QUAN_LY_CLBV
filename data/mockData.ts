
import { CriterionGroup, ScoringType } from '../types';

export const INITIAL_DATA: CriterionGroup[] = [
  {
    id: 'group-1',
    name: 'Nhóm A – Quản trị & Vận hành',
    department: 'Khoa Nội',
    criteria: [
      {
        id: 'criterion-1-1',
        name: 'Quản lý hồ sơ bệnh án',
        subItems: [
          {
            id: 'sub-1-1-1',
            description: 'Hồ sơ được điền đầy đủ thông tin hành chính.',
            scoringGuide: 'Kiểm tra các trường thông tin bắt buộc.',
            scoringType: ScoringType.PASS_FAIL,
            weight: 10,
          },
          {
            id: 'sub-1-1-2',
            description: 'Chữ ký bác sĩ và dấu mộc hợp lệ.',
            scoringGuide: 'Đối chiếu chữ ký và mộc với mẫu đã đăng ký.',
            scoringType: ScoringType.YES_NO,
            weight: 5,
          },
        ],
      },
    ],
  },
  {
    id: 'group-2',
    name: 'Nhóm B – Chăm sóc người bệnh',
    department: 'Khoa Ngoại',
    criteria: [
      {
        id: 'criterion-2-1',
        name: 'Tuân thủ quy trình rửa tay',
        subItems: [
          {
            id: 'sub-2-1-1',
            description: 'Thực hiện rửa tay trước khi tiếp xúc bệnh nhân.',
            scoringGuide: 'Quan sát trực tiếp.',
            scoringType: ScoringType.PASS_FAIL,
            weight: 15,
          },
        ],
      },
      {
        id: 'criterion-2-2',
        name: 'Giao tiếp với người bệnh',
        subItems: [
          {
            id: 'sub-2-2-1',
            description: 'Thái độ giao tiếp thân thiện, tôn trọng.',
            scoringGuide: 'Đánh giá dựa trên phản hồi của người bệnh và quan sát.',
            scoringType: ScoringType.SCALE_10,
            weight: 10,
             score: {
              status: 8,
              date: '2023-10-26',
              notes: 'Giao tiếp tốt, cần phát huy.',
              evidence: [],
            },
          },
        ],
      },
    ],
  },
];
