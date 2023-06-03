import { HttpStatus } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { DeleteResult, Repository } from 'typeorm';
import { User } from '../../../src/users/entities/user.entity';
import { UsersController } from '../../../src/users/users.controller';
import { UsersService } from '../../../src/users/users.service';

describe('UsersController', () => {
  let controller: UsersController;
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

    controller = module.get<UsersController>(UsersController);
    service = module.get<UsersService>(UsersService);
  });

  describe('create()', () => {
    it('成功', () => {
      const dto: CreateUserDto = {
        name: 'ユーザーテスト',
      };

      jest.spyOn(service, 'create').mockImplementation(async (dto: CreateUserDto) => {
        const user: User = {
          id: 1,
          ...dto,
        };
        return user;
      });

      expect(controller.create(dto)).resolves.toEqual({
        id: 1,
        ...dto,
      });
    });
  });

  describe('findAll()', () => {
    it('成功', () => {
      const user: User = {
        id: 1,
        name: 'ユーザーテスト',
      };

      jest.spyOn(service, 'findAll').mockImplementation(async () => {
        return [user];
      });

      expect(controller.findAll()).resolves.toEqual([user]);
    });
    it('ユーザーなし', () => {
      const user: User[] = [];

      jest.spyOn(service, 'findAll').mockImplementation(async () => {
        return user;
      });

      expect(controller.findAll()).resolves.toEqual(user);
    });
  });

  describe('findOne()', () => {
    it('成功', () => {
      const user: User = {
        id: 1,
        name: 'ユーザーテスト',
      };

      jest.spyOn(service, 'findOne').mockImplementation(async () => {
        return user;
      });

      expect(controller.findOne(1)).resolves.toEqual(user);
    });

    it('ユーザーなし', () => {
      jest.spyOn(service, 'findOne').mockRejectedValue({
        message: 'Forbidden: ユーザーが見つかりませんでした。',
        statusCode: HttpStatus.FORBIDDEN,
      });

      expect(controller.findOne(2)).rejects.toEqual({
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

      expect(controller.update('1', dto)).resolves.toEqual(user);
    });

    it('失敗', () => {
      jest.spyOn(service, 'update').mockRejectedValue({
        statusCode: 404,
        message: 'Not Found',
      });

      const dto: CreateUserDto = {
        name: 'ユーザーテスト2',
      };

      expect(controller.update('2', dto)).rejects.toEqual({
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

      expect(controller.remove('1')).resolves.toEqual(result);
    });

    it('失敗', () => {
      jest.spyOn(service, 'remove').mockRejectedValue({
        statusCode: 404,
        message: 'Not Found',
      });

      expect(controller.remove('2')).rejects.toEqual({
        statusCode: 404,
        message: 'Not Found',
      });
    });
  });
});
