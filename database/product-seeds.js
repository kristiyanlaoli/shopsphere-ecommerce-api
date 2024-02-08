const products = [
  {
    name: 'Ultra HD 4K Television',
    category: 'Electronics',
    price: 500,
    in_stock: true,
    description: 'A 55 inch Ultra HD 4K Television with HDR and smart features.'
  },
  {
    name: 'Bluetooth Wireless Headphones',
    category: 'Electronics',
    price: 199.99,
    in_stock: true,
    description: 'Noise-cancelling, over-ear headphones with 20 hours battery life.'
  },
  {
    name: 'Espresso Coffee Machine',
    category: 'Home Appliances',
    price: 299.99,
    in_stock: false,
    description: 'Automatic espresso machine with built-in grinder.'
  },
  {
    name: 'Ergonomic Office Chair',
    category: 'Furniture',
    price: 159.99,
    in_stock: true,
    description: 'Comfortable ergonomic chair suitable for long working hours.'
  },
  {
    name: 'Smartphone with Dual Camera',
    category: 'Electronics',
    price: 499.99,
    in_stock: true,
    description: 'Latest model smartphone with 128GB storage and dual camera setup.'
  },
  {
    name: 'Stainless Steel Cookware Set',
    category: 'Kitchenware',
    price: 129.99,
    in_stock: true,
    description: '10-piece stainless steel cookware set including pots and pans.'
  },
  {
    name: 'Wireless Gaming Mouse',
    category: 'Electronics',
    price: 59.99,
    in_stock: false,
    description: 'High precision wireless gaming mouse with customizable buttons.'
  },
  {
    name: 'Yoga Mat',
    category: 'Fitness',
    price: 39.99,
    in_stock: true,
    description: 'Eco-friendly, non-slip yoga mat with carrying strap.'
  },
  {
    name: 'LED Desk Lamp',
    category: 'Office Supplies',
    price: 29.99,
    in_stock: true,
    description: 'Adjustable LED desk lamp with multiple brightness settings.'
  },
  {
    name: 'Electric Toothbrush',
    category: 'Personal Care',
    price: 89.99,
    in_stock: true,
    description: 'Rechargeable electric toothbrush with multiple brushing modes.'
  }
]

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
