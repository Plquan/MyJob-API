import dataSource from "../ormconfig";

import { seedProvinces } from "./Province.seed";
import { seedGroupRoles } from "./GroupRole.seed";

const runAllSeeds = async () => {
  try {
    await dataSource.initialize();
    console.log("DataSource initialized");

    await seedProvinces(dataSource);
    await seedGroupRoles(dataSource);

    await dataSource.destroy();
    console.log("All seeds completed");
  } catch (error) {
    console.error("Error running seeds:", error);
  }
};

runAllSeeds();
