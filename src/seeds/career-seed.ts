import { DataSource } from "typeorm"
import { Career } from "../entities/career"

export const seedCareers = async (dataSource: DataSource) => {
  const repo = dataSource.getRepository(Career);

  const count = await repo.count();
  if (count > 0) {
    console.log("Careers already seeded");
    return;
  }
    const careers = [
        { name: 'Công nghệ thông tin', icon: '💻' },
        { name: 'Thiết kế đồ họa', icon: '🎨' },
        { name: 'Kế toán - Tài chính', icon: '📊' },
        { name: 'Quản trị kinh doanh', icon: '🏢' },
        { name: 'Giáo dục', icon: '📚' },
        { name: 'Y tế - Sức khỏe', icon: '🩺' },
        { name: 'Du lịch - Nhà hàng - Khách sạn', icon: '🏨' },
        { name: 'Marketing - Truyền thông', icon: '📣' },
        { name: 'Xây dựng', icon: '🏗️' },
        { name: 'Logistics - Vận chuyển', icon: '🚚' },
    ]

  await repo.save(careers);
  console.log("Seeded Careers successfully");
};
