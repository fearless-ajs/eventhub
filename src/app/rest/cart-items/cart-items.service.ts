import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCartItemDto } from './dto/create-cart-item.dto';
import { UpdateCartItemDto } from './dto/update-cart-item.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import { CartItem } from '@app/rest/cart-items/entities/cart-item.entity';
import { AddItemToCartDto } from '@app/rest/carts/dto/add -item-to-cart.dto';

@Injectable()
export class CartItemsService {
  constructor(
    @InjectRepository(CartItem)
    private repo: Repository<CartItem>,
    private readonly entityManager: EntityManager,

  ) {}

  async create(addItemToCart: AddItemToCartDto, cartId: number) {
    //destructure createUserServicePricingPlanDto data
    const { pricingPlanId, quantity} = addItemToCart;

    // find the cart using entity Manager
    const cart = await this.entityManager.findOneBy('Cart', { id: cartId });
    // Check if the cart exists
    if (!cart)
      throw new NotFoundException('Cart not found');

    // Find pricing plan using entity Manager
    const pricingPlan = await this.entityManager.findOneBy('UserServicePricingPlan', { id: pricingPlanId });
    // Check if the pricing plan exists
    if (!pricingPlan)
      throw new NotFoundException('Pricing plan not found');

    // Create the cart item entity
    const cartItem = this.repo.create({
      cart,
      pricingPlan,
      quantity
    });
    // Save the cart item into the db
    return await this.repo.save(cartItem);
  }

  findAll(cartId: number) {
    // Find cart items with query builder using the cartId, then join the pricing plan
    return this.repo.createQueryBuilder('cartItem')
      .leftJoinAndSelect('cartItem.pricingPlan', 'pricingPlan')
      .leftJoinAndSelect('pricingPlan.service', 'service')
      .where('cartItem.cartId = :cartId', { cartId })
  }

  async findOne(id: number, throwError: boolean = true) {
    // Find the cart item with the id with query builder, then join the pricing plan and service
    const cartItem = await this.repo.createQueryBuilder('cartItem')
      .leftJoinAndSelect('cartItem.pricingPlan', 'pricingPlan')
      .leftJoinAndSelect('pricingPlan.service', 'service')
      .where('cartItem.id = :id', { id })
      .getOne();

    // Check if the cart item was found
    if (!cartItem && throwError)
      throw new NotFoundException('Cart item not found');

    // Return the cart item
    return cartItem;
  }

  async update(id: number, updateCartItemDto: UpdateCartItemDto): Promise<boolean | CartItem> {
    // destructuring updateCartItemDto data
    const { quantity, type  } = updateCartItemDto;

    // Find the cart item with the id
    const cartItem = await this.repo.findOneBy({ id });
    // Check if the cart item was found
    if (!cartItem)
      throw new NotFoundException('Cart item not found');

    // Update the cart item quantity
    //check if the type is 'add' or 'subtract'
    if (type === 'add') {
      cartItem.quantity += quantity;
    } else {
      if (cartItem.quantity == 1 || quantity >= cartItem.quantity) {
        // Remove the cart item
        await this.repo.remove(cartItem);
        return true;
      }
      cartItem.quantity -= quantity;
    }

    // Save the cart item
    return await this.repo.save(cartItem);
  }

  async remove(id: number) {
    // Find the cart item with the id
    const cartItem = await this.repo.findOneBy({ id });
    // Check if the cart item was found
    if (!cartItem)
      throw new NotFoundException('Cart item not found');

    // Remove the cart item
    return await this.repo.remove(cartItem);
  }

  async removeAll(cartId: number) {
    // Find the cart items with the cartId using query builder
    const cartItems = await this.repo.createQueryBuilder('cartItem')
      .where('cartItem.cartId = :cartId', { cartId })
      .getMany();

    // Remove all the cart items
    return await this.repo.remove(cartItems);
  }
}
