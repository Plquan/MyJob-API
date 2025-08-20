import dataSource from "../orm-config";
import { seedCareers } from "./career-seed";
import { seedDistricts } from "./district-seed";
import { seedFunctions } from "./function-seed";
import { seedProvinces } from "./province-seed";

const runAllSeeds = async () => {
  try {
    await dataSource.initialize();
    console.log("DataSource initialized");

    await seedProvinces(dataSource)
    await seedDistricts(dataSource)
    await seedFunctions(dataSource)
    await seedCareers(dataSource)

    await dataSource.destroy();
    console.log("All seeds completed");
  } catch (error) {
    console.error("Error running seeds:", error);
  }
};

runAllSeeds();
