import { DataSource } from "typeorm";
import { Feature } from "../entity/Feature";

export const seedFeatures = async (dataSource: DataSource) => {
  const featureRepo = dataSource.getRepository(Feature);

  const count = await featureRepo.count();
  if (count > 0) {
    console.log("Features already seeded");
    return;
  }

  const features = [
    // Branding features
    {
      code: "BRANDING_BANNER",
      name: "Hiển thị banner thương hiệu",
    },
    {
      code: "SPONSORED_EMPLOYER",
      name: "Gắn nhãn nhà tuyển dụng nổi bật",
    },

    // CV_ACCESS features
    {
      code: "VIEW_CV",
      name: "Xem CV ứng viên",
    },
    {
      code: "SEARCH_CANDIDATE",
      name: "Tìm kiếm ứng viên",
    },

    // Recruitment features
    {
      code: "POST_JOB",
      name: "Đăng tin tuyển dụng",
    },
    {
      code: "TAG_SKILL",
      name: "Gắn kỹ năng nổi bật",
    },
    {
      code: "FRESH_EVERY_WEEK",
      name: "Làm mới tin mỗi tuần",
    },
    {
      code: "TOP_SEARCH",
      name: "Ưu tiên Top Search",
    },
  ];

  await featureRepo.save(features);
  console.log("Seeded Features");
};
