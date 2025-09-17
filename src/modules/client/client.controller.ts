import { Controller, Post, Get, Body, Query, Param, Patch, Delete } from '@nestjs/common'
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger'

import { ClientService } from './client.service'
import { Client } from './schemas/client.schema'
import { GetClientsDto } from './dto/get-clients.dto'
import { CreateClientDto } from './dto/create-client.dto'
import { IdDto, IdsDto } from 'src/shares/dtos/param.dto'
import ChangePasswordDto from './dto/change-password.dto'
import { SignUpByCodeDto } from './dto/sign-up-by-code.dto'
import { ForgotPasswordDto } from './dto/forgot-password.dto'
import { ResPagingDto } from 'src/shares/dtos/pagination.dto'
import { UserID } from 'src/shares/decorators/get-user-id.decorator'
import ChangePasswordByCodeDto from './dto/change-password-by-code.dto'

@ApiTags('Client')
@Controller('client')
export class ClientController {
  constructor(private readonly clientService: ClientService) {}

  @Get()
  @ApiBearerAuth()
  @ApiOperation({ summary: '[ Client ] Get all client' })
  async findAll(@Query() query: GetClientsDto): Promise<ResPagingDto<Client[]>> {
    return this.clientService.findAll(query)
  }

  @Post()
  @ApiOperation({ summary: '[ Client ] Create new client' })
  async createUser(@Body() createUserDto: CreateClientDto) {
    const user = await this.clientService.createClient(createUserDto)
    return { message: 'User created successfully', user }
  }

  @Delete(':id')
  @ApiOperation({ summary: '[ Client ] Delete client by ID' })
  async deleteClient(@Param('id') id: string): Promise<{ status: number; message: string }> {
    return this.clientService.deleteClientById(id)
  }

  @Post('sign-up')
  @ApiOperation({ summary: '[ Client ] Client Sign up with gmail' })
  async signUp(@Body() createClientDto: CreateClientDto): Promise<void> {
    await this.clientService.signUp(createClientDto)
  }

  @Post('change-password')
  @ApiOperation({ summary: '[ Client ] Change client password' })
  changePassword(@Body() changePasswordDto: ChangePasswordDto): Promise<void> {
    return this.clientService.changePassword(changePasswordDto)
  }

  @Post('verify-account')
  @ApiOperation({ summary: '[ Client ] Client Verification by code' })
  async signUpByCode(@Body() signUpByCodeDto: SignUpByCodeDto): Promise<void> {
    return this.clientService.signUpByCode(signUpByCodeDto)
  }

  @Post('verify-otp-forget')
  @ApiOperation({ summary: '[ Client ] Client verification by code from email' })
  async verifyOtpForget(@Body() changePasswordByCode: ChangePasswordByCodeDto): Promise<any> {
    return this.clientService.checkVerificationCode(changePasswordByCode)
  }

  @Post('forgot-password')
  @ApiOperation({ summary: '[ Client ] Client get code change password by send email' })
  forgotPassword(@Body() forgotPasswordDto: ForgotPasswordDto): Promise<void> {
    return this.clientService.forgotPassword(forgotPasswordDto)
  }

  @Post('change-password-by-code')
  @ApiOperation({ summary: '[ Client ] Client change password by code' })
  changePasswordByCode(@Body() changePasswordByCodeDto: ChangePasswordByCodeDto): Promise<void> {
    return this.clientService.changePasswordByCode(changePasswordByCodeDto)
  }

  @Patch(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: '[ Client ] Update client by ID' })
  async updateProduct(@Param() param: IdDto, @Body() body: CreateClientDto, @UserID() userId: string): Promise<void> {
    await this.clientService.updateById(param.id, body, userId)
  }
}
