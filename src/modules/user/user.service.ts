import { BadRequestException, Inject, Injectable, CACHE_MANAGER, NotFoundException } from '@nestjs/common'
import { Cache } from 'cache-manager'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { User, UserDeleted, UserDeletedDocument, UserDocument } from './schemas/user.schema'
import { UserRole, UserStatus } from 'src/shares/enums/user.enum'
import { GetUsersDto } from './dto/get-users.dto'
import { GetUserDto } from './dto/get-user.dto'
import { httpErrors } from 'src/shares/exceptions'
import { generateHash } from 'src/shares/helpers/bcrypt'
import { CreateUserDto } from './dto/create-user.dto'
import { MailService } from '../mail/mail.service'
import { ResPagingDto } from 'src/shares/dtos/pagination.dto'
import { randomCodeNumber } from 'src/shares/helpers/utils'
import { EmailService } from 'src/shares/helpers/mail.helpers'
import { UpdateUserDto } from './dto/update-user.dto'

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private mailService: EmailService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    @InjectModel(UserDeleted.name) private clientDeleteModel: Model<UserDeletedDocument>,
  ) { }

  async createUser(createUserDto: CreateUserDto): Promise<UserDocument> {
    const { email, password } = createUserDto
    const user = await this.userModel.findOne({ email })
    if (user) {
      throw new BadRequestException(httpErrors.ACCOUNT_EXISTED)
    }
    const { hashPassword } = await generateHash(password)

    return this.userModel.create({ ...createUserDto, password: hashPassword, status: UserStatus.ACTIVE, role: UserRole.cong_tac_vien })
  }

  async deleteById(id: string): Promise<void> {
    await this.userModel.findByIdAndDelete(id).exec();
  }
  async createDeletedUser(user: CreateUserDto): Promise<any> {
    const deletedClient = new this.clientDeleteModel({
      ...user,
      deleted_at: new Date()
    });
    return deletedClient.save();
  }

  async updateUser(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.userModel.findByIdAndUpdate(id, updateUserDto, {
      new: true, // Trả về dữ liệu mới sau khi cập nhật
      runValidators: true, // Chạy trình xác thực trên DTO
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    return user;
  }

  async activeUser(id: string): Promise<void> {
    const user = await this.userModel.findOne({ code: id })
    if (user) {
      await this.userModel.findByIdAndUpdate(
        user,
        { is_verify: true }
      );
    }
  }

  async createUserMail(createUserDto: CreateUserDto): Promise<void> {
    const { email, password } = createUserDto
    const code = randomCodeNumber(10)
    const user = await this.userModel.findOne({ email })
    if (user) {
      throw new BadRequestException(httpErrors.ACCOUNT_EXISTED)
    }
    const { hashPassword } = await generateHash(password)

    // await this.mailService.sendSignUpEmail({ email, code })
    await this.userModel.create({ ...createUserDto, password: hashPassword, status: UserStatus.ACTIVE, is_verify: true })

  }

  async findAll(getUsersDto: GetUsersDto): Promise<ResPagingDto<User[]>> {
    const { sort, page, limit, id, name, email, full_name } = getUsersDto
    const query: any = {}

    if (id) {
      query._id = id
    }
    if (email) {
      query.email = email;
  } else {
      // query.email = { $ne: 'admin' };
  }

    if (name) {
      query.name = name
    }
    if (full_name) {
      query.name = full_name
    }

    const [result, total] = await Promise.all([
      this.userModel
        .find(query)
        .skip((page - 1) * limit)
        .limit(limit)
        .sort({ createdAt: sort }),
      this.userModel.find(query).countDocuments(),
    ])

    return {
      result,
      total,
      lastPage: Math.ceil(total / limit),
    }
  }

  async findOne(condition: GetUserDto, selectPassword = false): Promise<UserDocument> {
    if (selectPassword) {
      return this.userModel.findOne(condition).select('+password').lean()
    }
    return this.userModel.findOne(condition).select('-password').lean()
  }

  async findById(_id: string): Promise<any> {
    return this.userModel.findById({ _id }).select('-password').lean()
  }

  async deleteUsers(ids: string[]): Promise<{ deletedCount: number }> {
    const result = await this.userModel.deleteMany({ _id: { $in: ids } });

    if (result.deletedCount === 0) {
      throw new NotFoundException('No users found for the provided IDs');
    }

    return { deletedCount: result.deletedCount };
  }
}
