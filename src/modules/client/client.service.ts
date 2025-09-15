import { CACHE_MANAGER, Inject, Injectable, BadRequestException, NotFoundException, HttpStatus } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Client, ClientDocument } from './schemas/client.schema'
import mongoose, { Model, Mongoose } from 'mongoose'
import { MailService } from '../mail/mail.service'
import { SignUpCacheInterface, SignUpDto } from './dto/sign-up.dto'
import { randomCodeNumber } from 'src/shares/helpers/utils'
import { GetClientDto } from './dto/get-client.dto'
import { Cache } from 'cache-manager'
import { SignUpByCodeDto } from './dto/sign-up-by-code.dto'
import { FORGOT_PASSWORD_CACHE, FORGOT_PASSWORD_EXPIRY, SIGN_UP_CACHE, SIGN_UP_EXPIRY } from '../auth/auth.constants'
import { httpErrors } from 'src/shares/exceptions'
import { CreateClientDto } from './dto/create-client.dto'
import { ClientRole, ClientStatus } from 'src/shares/enums/client.enum'
import { CacheForgotPassword, ForgotPasswordDto } from './dto/forgot-password.dto'
import ChangePasswordByCodeDto from './dto/change-password-by-code.dto'
import ChangePasswordDto from './dto/change-password.dto'
import { generateHash, validateHash } from 'src/shares/helpers/bcrypt'
import { GetClientByPhoneOrderDto, GetClientsDto, GetPaymentByClientDto } from './dto/get-clients.dto'
import { ResPagingDto } from 'src/shares/dtos/pagination.dto'
import { UserFacebookInfoDto } from '../auth/dto/user-facebook-info.dto'
import { UserGoogleInfoDto } from '../auth/dto/user-google-info.dto'
import { User, UserDocument } from '../user/schemas/user.schema'
import { UserRole } from 'src/shares/enums/user.enum'
import { IdsDto } from 'src/shares/dtos/param.dto'
@Injectable()
export class ClientService {
  constructor(
    @InjectModel(Client.name) private clientModel: Model<ClientDocument>,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private mailService: MailService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache
  ) {}

  async findOne(condition: GetClientDto, selectPassword = false): Promise<Client> {
    if (selectPassword) {
      return this.clientModel.findOne(condition).select('+password')
    }
    return this.clientModel.findOne(condition)
  }

  async findById(_id: string): Promise<Client> {
    return this.clientModel.findById(_id).exec()
  }

  async signUp(createClientDto: CreateClientDto | null): Promise<void> {
    const { email, password, name, birthday, zip_code, address, gender, phone } = createClientDto
    const client = await this.findOne({ $or: [{ email: email }, { phone: phone }] } as any)
    if (client && client.is_verify) {
      throw new BadRequestException('EMAIL_ALREADY_EXIT')
    }
    const code = randomCodeNumber(6)
    const { hashPassword } = await generateHash(password)
    await this.mailService.sendSignUpEmail({ email, code, name, password: hashPassword, birthday, gender })
  }

  async signUpEmail(signUpDto: SignUpDto): Promise<void> {
    const { email, password, name, birthday, gender } = signUpDto
    const user = await this.findOne({ email: email })
    if (user) {
      throw new BadRequestException('The email already exist!')
    }
    const code = randomCodeNumber(6)
    const { hashPassword } = await generateHash(password)
    await this.mailService.sendSignUpEmail({ email, code, name, password: hashPassword, birthday, gender })
  }
  async deleteClientById(clientId: string): Promise<{ status: number; message: string }> {
    const client = await this.clientModel.findById(clientId)
    if (!client) {
      throw new NotFoundException('Client not found')
    }
    client.deleted = true
    await client.save()
    return {
      status: HttpStatus.OK,
      message: `Client with ID ${clientId} deleted successfully`,
    }
  }

  async signUpByCode(signUpByCodeDto: SignUpByCodeDto): Promise<void> {
    const { code, email } = signUpByCodeDto
    const verifyClientCache = await this.cacheManager.get<string>(`${SIGN_UP_CACHE}${email}`)
    if (!verifyClientCache) {
      throw new BadRequestException(httpErrors.CLIENT_EMAIL_VERIFY_FAIL)
    }
    const signUpInfo: SignUpCacheInterface = JSON.parse(verifyClientCache)
    if (signUpInfo.attempt > 4) {
      throw new BadRequestException(httpErrors.CLIENT_CODE_INVALID)
    }
    if (code != signUpInfo.code) {
      await this.cacheManager.set<string>(`${SIGN_UP_CACHE}${email}`, JSON.stringify({ ...signUpInfo, attempt: signUpInfo.attempt + 1 }), {
        ttl: SIGN_UP_EXPIRY,
      })
      throw new BadRequestException(httpErrors.CLIENT_EXPIRED_CODE)
    }
    if (signUpInfo.code !== code) {
      throw new BadRequestException(httpErrors.CLIENT_EMAIL_VERIFY_FAIL)
    }
    const { name, password, gender, birthday } = signUpInfo
    await this.createClientSignUpByCode({ email, name, password, gender, birthday })
  }

  async createClientSignUpByCode(createClientDto: CreateClientDto): Promise<Client> {
    const { email, password, name, gender } = createClientDto
    const client = await this.clientModel.findOne({ email })
    if (client) {
      throw new BadRequestException(httpErrors.CLIENT_EXISTED)
    }
    return this.clientModel.create({
      ...createClientDto,
      password,
      status: ClientStatus.ACTIVE,
      is_verify: true,
      name,
      gender,
      code: this.generateRandomHalloCode(),
    })
  }
  generateRandomHalloCode(): string {
    const currentYear = new Date().getFullYear()
    const currentMonth = ('0' + (new Date().getMonth() + 1)).slice(-2)
    const randomSuffix = Math.floor(Math.random() * 1000)
      .toString()
      .padStart(3, '0')
    const halloCode = `HALLO${currentYear}${currentMonth}${randomSuffix}`
    return halloCode
  }

  async createClient(createClientDto: CreateClientDto): Promise<Client> {
    const { email, password = '123', source_id, pancake } = createClientDto
    const existingClient = await this.clientModel.findOne({ pancake })
    const { hashPassword } = await generateHash(password)
    if (existingClient) {
      await this.clientModel.updateOne(
        { _id: existingClient._id },
        {
          ...createClientDto,
          password: hashPassword,
          source_id: new mongoose.Types.ObjectId(source_id),
        }
      )
      return this.clientModel.findById(existingClient._id)
    }
    const generatePaymentCode = async (): Promise<string> => {
      let code: string
      let isExist = true
      while (isExist) {
        code = Math.floor(100000 + Math.random() * 900000).toString()
        const existingClient = await this.clientModel.findOne({ payment_code: code }).lean()
        if (!existingClient) {
          isExist = false
        }
      }
      return code
    }
    const payment_code = await generatePaymentCode()
    return this.clientModel.create({
      ...createClientDto,
      code: this.generateRandomHalloCode(),
      password: hashPassword,
      payment_code,
      source_id: new mongoose.Types.ObjectId(source_id),
      status: ClientStatus.ACTIVE,
    })
  }

  async updateById(_id: string, dto: CreateClientDto, userId: string): Promise<void> {
    const client = await this.clientModel.findById(_id)
    if (!client) {
      throw new BadRequestException()
    }
    await this.clientModel.findOneAndUpdate({ _id }, { ...dto, update_by: userId, status: dto.status }, { new: true })
  }

  async forgotPassword(forgotPasswordDto: ForgotPasswordDto): Promise<void> {
    const { email } = forgotPasswordDto
    const client = await this.clientModel.findOne({ email })
    if (!client) {
      throw new BadRequestException(httpErrors.CLIENT_EMAIL_CONFIRM_NOT_FOUND)
    }

    await this.mailService.sendForgotPasswordEmailJob(email)
  }

  async changePasswordByCode(changePasswordByCode: ChangePasswordByCodeDto): Promise<void> {
    const { verifyCode, password, email } = changePasswordByCode
    const clientId = await this.checkVerificationCode(verifyCode, email)
    const { hashPassword } = await generateHash(password)
    await this.clientModel.updateOne({ _id: clientId }, { password: hashPassword, name: 'hkt' })
  }

  async checkVerificationCode(verifyCode: string, email: string): Promise<Client> {
    const client = await this.clientModel.findOne({ email })
    if (!client) {
      throw new BadRequestException(httpErrors.CLIENT_EMAIL_CONFIRM_NOT_FOUND)
    }
    const verifyClientCache = await this.cacheManager.get<string>(`${FORGOT_PASSWORD_CACHE}${email}`)
    if (!verifyClientCache) {
      throw new BadRequestException()
    }
    const forgotPasswordInfo: CacheForgotPassword = JSON.parse(verifyClientCache)

    if (forgotPasswordInfo.attempt > 4) {
      throw new BadRequestException(httpErrors.CLIENT_CODE_INVALID)
    }

    if (verifyCode != forgotPasswordInfo.code) {
      await this.cacheManager.set<string>(
        `${FORGOT_PASSWORD_CACHE}${email}`,
        JSON.stringify({ ...forgotPasswordInfo, attempt: forgotPasswordInfo.attempt + 1 }),
        {
          ttl: FORGOT_PASSWORD_EXPIRY,
        }
      )
      throw new BadRequestException(httpErrors.CLIENT_EXPIRED_CODE)
    }

    return client
  }

  async changePassword(changePasswordDto: ChangePasswordDto): Promise<void> {
    const { email, password, newPassword } = changePasswordDto
    const user = await this.clientModel.findOne({ email })
    const validatePassword = await validateHash(password, user?.password || '')
    if (!user || !validatePassword) {
      throw new BadRequestException(httpErrors.USER_WRONG_PASSWORD)
    }
    const { hashPassword } = await generateHash(newPassword)
    await this.clientModel.updateOne({ _id: user.id }, { password: hashPassword })
  }

  async findAll(getUsersDto: GetClientsDto): Promise<ResPagingDto<Client[]>> {
    const { sort, page, limit, id, name, phone, pancake, code, email, role, start_date, end_date, cust_id, payment_code } = getUsersDto
    const query: any = { deleted: false }
    if (id || name) {
      query.$or = []
      if (id && mongoose.Types.ObjectId.isValid(id)) {
        query.$or.push({ _id: new mongoose.Types.ObjectId(id) })
      }
      if (name) {
        query.$or.push({ name: { $regex: name.trim(), $options: 'i' } })
      }
      if (query.$or.length === 0) {
        delete query.$or
      }
    }
    if (phone) {
      query.phone = phone.trim()
    }
    if (payment_code) {
      query.payment_code = payment_code.trim()
    }
    if (pancake) {
      query.pancake = pancake.trim()
    }
    if (code) {
      query.code = code.trim()
    }
    if (email) {
      query.email = email.trim()
    }

    if (role) {
      query.role = { $in: [role] }
    }

    if (start_date && end_date) {
      query['createdAt'] = { $gte: new Date(start_date), $lte: new Date(end_date) }
    } else if (start_date) {
      query['createdAt'] = { $gte: new Date(start_date) }
    } else if (end_date) {
      query['createdAt'] = { $lte: new Date(end_date) }
    }

    const [result, total] = await Promise.all([
      this.clientModel
        .find(query)
        .skip((page - 1) * limit)
        .limit(limit)
        .sort({ _id: -1 }),
      this.clientModel.find(query).countDocuments(),
    ])

    return {
      result,
      total,
      lastPage: Math.ceil(total / limit),
    }
  }

  async findOrCreateFacebookUser(profile: UserFacebookInfoDto): Promise<Client> {
    const client = await this.clientModel.findOne({ facebook_id: profile.id })

    if (client) {
      return this.clientModel.findByIdAndUpdate(
        client._id,
        {
          image_url: profile.picture.data.url,
          lastLoginAt: new Date(),
        },
        { new: true }
      )
    }

    return this.clientModel.create({
      facebook_id: profile.id,
      code: this.generateRandomHalloCode(),
      name: `${profile.first_name} ${profile.last_name}`,
      image_url: profile.picture.data.url,
      role: ClientRole.khach_hang,
      last_login_at: new Date(),
      status: ClientStatus.ACTIVE,
      is_verify: true,
    })
  }

  async findOrCreateGoogleUser(profile: UserGoogleInfoDto): Promise<Client> {
    const { sub, picture, given_name, family_name, email } = profile.data
    const client = await this.clientModel.findOne({ google_id: sub })

    if (client) {
      return this.clientModel.findByIdAndUpdate(
        client._id,
        {
          image_url: picture,
          last_login_at: new Date(),
          email,
        },
        { new: true }
      )
    }

    return this.clientModel.create({
      google_id: sub,
      code: this.generateRandomHalloCode(),
      name: `${given_name} ${family_name}`,
      image_url: picture,
      role: ClientRole.khach_hang,
      last_login_at: new Date(),
      email,
      status: ClientStatus.ACTIVE,
      is_verify: true,
    })
  }

  getPipelineClientPayment(query: GetPaymentByClientDto): any[] {
    const match = {}
    if (query.id) {
      match['_id'] = new mongoose.Types.ObjectId(query.id)
    }
    if (query.customer_code) {
      match['code'] = query.customer_code
    }
    if (query.pancake) {
      match['pancake'] = query.pancake
    }
    return [
      {
        $match: match,
      },
      {
        $lookup: {
          from: 'smartpit',
          localField: '_id',
          foreignField: 'client_id',
          as: 'client_smartpit',
        },
      },
      {
        $lookup: {
          from: 'payment',
          localField: '_id',
          foreignField: 'client_id',
          as: 'payment_client',
        },
      },
      {
        $addFields: {
          payment_buy: {
            $arrayElemAt: [
              {
                $filter: {
                  input: '$payment_client',
                  as: 'payment_buy',
                  cond: {
                    $eq: ['$$payment_buy.type', 'Mua hàng'],
                  },
                },
              },
              0,
            ],
          },
        },
      },
      {
        $addFields: {
          payment_monthly: {
            $arrayElemAt: [
              {
                $filter: {
                  input: '$payment_client',
                  as: 'payment_monthly',
                  cond: {
                    $eq: ['$$payment_monthly.type', 'Gia hạn'],
                  },
                },
              },
              0,
            ],
          },
        },
      },
      {
        $addFields: {
          payment_cskh: {
            $arrayElemAt: [
              {
                $filter: {
                  input: '$payment_client',
                  as: 'payment_cskh',
                  cond: {
                    $eq: ['$$payment_cskh.type', 'Chăm sóc khách hàng'],
                  },
                },
              },
              0,
            ],
          },
        },
      },
      {
        $project: {
          payment_client: 0,
        },
      },
    ]
  }
  async deleteClients(ids: any, delete_by: string): Promise<void> {
    await Promise.all(
      ids.map(async (_id: any) => {
        const client = await this.clientModel.findById(_id)
        if (!client) {
          throw new BadRequestException('Không tìm thấy khách hàng!')
        }
        await this.clientModel.findOneAndUpdate({ _id }, { deleted: true })
      })
    )
  }
}
