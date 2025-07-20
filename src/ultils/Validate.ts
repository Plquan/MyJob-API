import { validate } from "class-validator";

async function isValid(dto: object): Promise<boolean> {
  const errors = await validate(dto);
  return errors.length === 0;
}
export default isValid