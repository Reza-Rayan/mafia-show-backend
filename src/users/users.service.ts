import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { UserRole } from 'src/enums/User-Role.enum';
import { SearchUserDTO } from './dto/search-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const existUser = await this.userRepository.findOne({
      where: { phone: createUserDto.phone },
    });
    if (existUser) {
      throw new ConflictException('حساب کاربری این شماره وجود دارد.');
    }
    const newUser = this.userRepository.create({
      ...createUserDto,
      role: UserRole.PLAYER,
    });
    return await this.userRepository.save(newUser);
  }

  async findAll(searchUserDTO: SearchUserDTO) {
    const { name, role } = searchUserDTO;

    const queryBuilder = this.userRepository.createQueryBuilder('user');

    // Apply filters based on the DTO
    if (name) {
      queryBuilder.andWhere('LOWER(user.name) LIKE :name', {
        name: `%${name.toLowerCase()}%`,
      });
    }
    if (role) {
      queryBuilder.andWhere('user.role = :role', { role: role.toLowerCase() });
    }

    const users = await queryBuilder.getMany();

    if (users.length === 0) {
      throw new NotFoundException('کاربری وجود ندارد');
    }

    return users;
  }

  async findOne(id: string) {
    const user = await this.userRepository.findOne({ where: { id } });

    if (!user) {
      throw new NotFoundException('کاربر مورد نظر وجود ندارد');
    }
    return user;
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    const user = await this.userRepository.findOne({ where: { id } });

    if (!user) {
      throw new NotFoundException('کاربر مورد نظر وجود ندارد');
    }

    // Update the user data with the provided DTO
    Object.assign(user, updateUserDto);

    // Save the updated user back to the database
    return await this.userRepository.save(user);
  }

  async remove(id: string) {
    const user = await this.userRepository.findOne({ where: { id } });

    if (!user) {
      throw new NotFoundException('کاربر مورد نظر وجود ندارد');
    }

    await this.userRepository.delete(id);

    return { message: `کاربر با آیدی ${id} حذف شد.` };
  }

  // Request of User ro be provider
  async changeRoleToPending(id: string) {
    const user = await this.userRepository.findOne({ where: { id } });

    if (!user) {
      throw new NotFoundException('کاربر مورد نظر وجود ندارد');
    }

    // Check if the user already has the "PENDING" role or another conflicting role
    if (user.role === UserRole.PENDING) {
      throw new ConflictException(
        'کاربر در حال حاضر درخواست ارائه دهنده دارد.',
      );
    }

    // Update the user role to "PENDING"
    user.role = UserRole.PENDING;
    this.userRepository.save(user);

    return { message: 'درخواست شما با موفقیت ارسال شد. منتظر بمانید' };
  }
  // End here

  // Accept Request of user to be provider
  async acceptPendingUser(id: string) {
    const user = await this.userRepository.findOne({
      where: { id, role: UserRole.PENDING },
    });

    if (!user) {
      throw new NotFoundException(
        'کاربری با وضعیت در حال انتظار و آیدی مشخص وجود ندارد.',
      );
    }

    // Change the user's role to PROVIDER
    user.role = UserRole.PROVIDER;

    // Save the updated user
    await this.userRepository.save(user);

    return user;
  }
  // End here
}
