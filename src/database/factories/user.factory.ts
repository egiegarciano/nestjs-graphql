import { setSeederFactory } from 'typeorm-extension';

import { Owner } from 'src/entities/owner.entity';
import * as bcrypt from 'bcrypt';

export default setSeederFactory(Owner, async (faker) => {
  const user = new Owner();

  const userPassword = await bcrypt.hash('password', 10);

  user.name = faker.name.firstName();
  user.email = faker.internet.email();
  user.password = userPassword;

  return user;
});
