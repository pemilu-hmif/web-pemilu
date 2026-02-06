import { createTRPCRouter } from "../../trpc";
import { adminConfigurationRouter } from "./configuration";

export const adminRouter = createTRPCRouter({
  configuration: adminConfigurationRouter,
});
