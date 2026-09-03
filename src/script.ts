import "dotenv/config";
import { db } from "./prisma/db";

async function main() {
  const user = await db.orm.users.where({ email: "existing@example.com" }).first();
  console.log(user);

  await db.close();
}

main().catch((error) => {
  console.error(error);
  process.exit(1);  
});