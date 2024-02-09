import { faker } from '@faker-js/faker'
import bcrypt from 'bcrypt'
import { config } from 'dotenv'
import prisma from '../app/utils/prisma.js'

config()

const bcryptRound = Number(process.env.BCRYPT_ROUND)

async function main() {
  await prisma.user.deleteMany()

  const roles = await prisma.role.findMany()
  for (let i = 0; i < 5; i++) {
    await prisma.user.create({
      data: {
        email: faker.internet.email().toLowerCase(),
        name: faker.person.fullName(),
        password: bcrypt.hashSync('password', bcryptRound),
        role_id: roles[Math.floor(Math.random() * roles.length)].id
      }
    })
  }
}

main()
  .catch((e) => {
    throw e
  })
  .finally(async () => {
    await prisma.$disconnect()
  })