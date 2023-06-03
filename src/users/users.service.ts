import {
  HttpException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(@InjectRepository(User) private userRepository: Repository<User>) {}

  async create({ name }: CreateUserDto): Promise<User> {
    if (!name) {
      throw new InternalServerErrorException(`[${name}]は不正なユーザー名です。`);
    }

    return await this.userRepository
      .save({
        name: name,
      })
      .catch((e) => {
        throw new InternalServerErrorException(`[${e.message}]：ユーザーの登録に失敗しました。`);
      });
  }

  async findAll(): Promise<User[]> {
    return await this.userRepository.find().catch(() => {
      throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
    });
  }

  async findOne(id: number): Promise<User> {
    return await this.userRepository
      .findOne({
        where: { id: id },
      })
      .then((res) => {
        if (!res) {
          throw new HttpException(
            'Forbidden: ユーザーが見つかりませんでした。',
            HttpStatus.FORBIDDEN,
          );
        }
        return res;
      });
  }

  async update(id: number, createUserDto: UpdateUserDto): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id: id } });
    if (!user) {
      throw new NotFoundException();
    }

    user.name = createUserDto.name;
    return await this.userRepository.save(user);
  }

  async remove(id: number): Promise<DeleteResult> {
    const user = await this.userRepository.findOne({ where: { id: id } });
    if (!user) {
      throw new NotFoundException();
    }
    return await this.userRepository.delete(user);
  }
}
