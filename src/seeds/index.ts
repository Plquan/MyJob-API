import dataSource from "../ormconfig";

import { seedProvinces } from "./Province.seed";
import { seedDistricts } from "./District.seed";

const runAllSeeds = async () => {
  try {
    await dataSource.initialize();
    console.log("DataSource initialized");

    await seedProvinces(dataSource);
    await seedDistricts(dataSource);

    await dataSource.destroy();
    console.log("All seeds completed");
  } catch (error) {
    console.error("Error running seeds:", error);
  }
};

runAllSeeds();
