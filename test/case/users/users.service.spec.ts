import { HttpStatus, InternalServerErrorException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { DeleteResult, Repository } from 'typeorm';
import { CreateUserDto } from '../../../src/users/dto/create-user.dto';
import { User } from '../../../src/users/entities/user.entity';
import { UsersController } from '../../../src/users/users.controller';
import { UsersService } from '../../../src/users/users.service';

describe('UsersService', () => {
  let service: UsersService;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useClass: Repository,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  describe('create()', () => {
    it('成功', () => {
      const dto: CreateUserDto = {
        name: 'テストユーザー',
      };

      jest.spyOn(service, 'create').mockImplementation(async (dto: CreateUserDto) => {
        const user: User = {
          id: 1,
          ...dto,
        };
        return user;
      });

      expect(service.create(dto)).resolves.toEqual({
        id: 1,
        ...dto,
      });
    });

    it('失敗 空文字', async () => {
      const dto: CreateUserDto = {
        name: '',
      };

      jest.spyOn(service, 'create').mockImplementation(async (dto: CreateUserDto) => {
        throw new InternalServerErrorException(`[${dto.name}]は不正なユーザー名です。`);
      });

      await expect(async () => {
        await service.create(dto);
      }).rejects.toThrow(InternalServerErrorException);
    });
  });

  describe('findAll()', () => {
    it('ユーザー一括取得の成功テスト', () => {
      const user: User = {
        id: 1,
        name: 'テストユーザー',
      };

      jest.spyOn(service, 'findAll').mockImplementation(async () => {
        return [user];
      });

      expect(service.findAll()).resolves.toEqual([user]);
    });

    it('ユーザーデータなし', () => {
      const user: User[] = [];

      jest.spyOn(service, 'findAll').mockImplementation(async () => {
        return user;
      });

      expect(service.findAll()).resolves.toEqual(user);
    });
  });

  describe('findOne()', () => {
    it('ユーザー取得', () => {
      const user: User = {
        id: 1,
        name: 'テストユーザー',
      };

      jest.spyOn(service, 'findOne').mockImplementation(async () => {
        return user;
      });

      expect(service.findOne(1)).resolves.toEqual(user);
    });

    it('ユーザー取得 データ該当なし', () => {
      jest.spyOn(service, 'findOne').mockRejectedValue({
        message: 'Forbidden: ユーザーが見つかりませんでした。',
        statusCode: HttpStatus.FORBIDDEN,
      });

      expect(service.findOne(2)).rejects.toEqual({
        message: 'Forbidden: ユーザーが見つかりませんでした。',
        statusCode: HttpStatus.FORBIDDEN,
      });
    });
  });

  describe('update()', () => {
    it('成功', () => {
      const dto: CreateUserDto = {
        name: 'ユーザーテスト2',
      };

      const user: User = {
        id: 1,
        name: 'ユーザーテスト2',
      };

      jest.spyOn(service, 'update').mockImplementation(async () => {
        return user;
      });

      expect(service.update(1, dto)).resolves.toEqual(user);
    });

    it('失敗', () => {
      jest.spyOn(service, 'update').mockRejectedValue({
        statusCode: 404,
        message: 'Not Found',
      });

      const dto: CreateUserDto = {
        name: '太郎2',
      };

      expect(service.update(2, dto)).rejects.toEqual({
        statusCode: 404,
        message: 'Not Found',
      });
    });
  });

  describe('remove()', () => {
    it('成功', () => {
      const result: DeleteResult = {
        raw: [],
        affected: 1,
      };

      jest.spyOn(service, 'remove').mockImplementation(async () => {
        return result;
      });

      expect(service.remove(1)).resolves.toEqual(result);
    });

    it('失敗', () => {
      jest.spyOn(service, 'remove').mockRejectedValue({
        statusCode: 404,
        message: 'Not Found',
      });

      expect(service.remove(2)).rejects.toEqual({
        statusCode: 404,
        message: 'Not Found',
      });
    });
  });
});
