import { Controller, Get, Query, Post, Body, Param, Delete, NotFoundException, Patch } from '@nestjs/common'
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger'
import { UserService } from './user.service'
import { GetUsersDto } from './dto/get-users.dto'
import { User } from './schemas/user.schema'
import { CreateUserDto } from './dto/create-user.dto'
import { ResPagingDto } from 'src/shares/dtos/pagination.dto'
import { UserAuth } from 'src/shares/decorators/http.decorators'
import { UserRole } from 'src/shares/enums/user.enum'
import { UpdateUserDto } from './dto/update-user.dto'
import { IdDto } from 'src/shares/dtos/param.dto'
import { DeleteUsersDto } from './dto/delete-users.dto'

@ApiTags('User')
@Controller('user')
export class UserController {
  constructor(private readonly usersService: UserService) {}

  @Get()
  @ApiBearerAuth()
  @ApiOperation({ summary: '[ User ] Get all user' })
  async findAll(@Query() query: GetUsersDto): Promise<ResPagingDto<User[]>> {
    return this.usersService.findAll(query)
  }

  @Get(':id')
  @ApiOperation({ summary: '[ User ] Get all user' })
  async activeUser(@Param('id') id: string): Promise<void> {
    return this.usersService.activeUser(id)
  }

  @Post()
  @ApiOperation({ summary: '[ User ] Create new user' })
  async createUser(@Body() createUserDto: CreateUserDto): Promise<void> {
    await this.usersService.createUserMail(createUserDto)
  }

  @Patch(':id')
  @ApiOperation({ summary: '[ User ]  Update user by ID' })
  async update(@Param() param: IdDto, @Body() updateUserDto: UpdateUserDto): Promise<void> {
    await this.usersService.updateUser(param.id, updateUserDto)
  }

  @Delete()
  @ApiOperation({ summary: '[ User ]  Delete user by ID' })
  async deleteUsers(@Body() deleteUsersDto: DeleteUsersDto): Promise<{ deletedCount: number }> {
    return this.usersService.deleteUsers(deleteUsersDto.ids)
  }
}
