import { Test, TestingModule } from '@nestjs/testing';
import { MailerResolver } from './mailer.resolver';
import { MailerService } from './mailer.service';

describe('MailerResolver', () => {
  let resolver: MailerResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MailerResolver, MailerService],
    }).compile();

    resolver = module.get<MailerResolver>(MailerResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
