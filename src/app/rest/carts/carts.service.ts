import { Injectable, NotAcceptableException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cart } from '@app/rest/carts/entities/cart.entity';
import { UsersService } from '@app/rest/users/users.service';
import {
  UserServicePricingPlansService
} from '@app/rest/user-service-pricing-plans/user-service-pricing-plans.service';
import { AddItemToCartDto } from '@app/rest/carts/dto/add -item-to-cart.dto';
import { CartItemsService } from '@app/rest/cart-items/cart-items.service';
import { RemoveCartItemDto } from '@app/rest/carts/dto/remove -cart-item.dto';
import { CartItem } from '@app/rest/cart-items/entities/cart-item.entity';

@Injectable()
export class CartsService {
  constructor(
    @InjectRepository(Cart)
    private repo: Repository<Cart>,
    private readonly usersService: UsersService,
    private readonly pricingPlanService: UserServicePricingPlansService,
    private readonly cartItemService: CartItemsService
  ) {}

  async create(userId: number): Promise<Cart> {
    // Fetch the user with the userId
    const user = await this.usersService.findOne(userId);
    // Check if the user has a cart
    if (user.cart)
      throw new NotFoundException('User already has a cart');

    // Create a cart for the user
    const cart = this.repo.create({
      user
    });

    // Save the cart into the db
    return await this.repo.save(cart);
  }

  async addCartItem(addItemToCartDto: AddItemToCartDto, userId: number) {
    // Destructure createCartDto data
    const { pricingPlanId, quantity } = addItemToCartDto;

    // Fetch the user with the userId
    const user = await this.usersService.findOneDetailed(userId);

    // find the pricing plan with the pricingPlanId
    const pricingPlan = await this.pricingPlanService.findOne(pricingPlanId);
    // Check if the pricing plan was found
    if (!pricingPlan)
      throw new NotFoundException('Pricing plan not found');

    // Check if user has a cart
    if (!user.cart)
      throw new NotAcceptableException('User does not have a cart yet');

    // Check if the user has not item in cart, then an empty array is created to avoid
    if (!user.cart.items)
      user.cart.items = [];

      // Check if the pricingPlan already exist in the cart
      const cartItem = user.cart.items.find(item => item.pricingPlan.id === pricingPlanId);
      // declaring the updatedCartItem variable to hold the update response data
      let updatedCartItem: boolean | CartItem;
      // Check if the cartItem was found
      if (cartItem) {
        // Update the quantity of the cartItem
        updatedCartItem = await this.cartItemService.update(cartItem.id, { quantity: quantity, type: 'add' });
      } else {
        // Create a cart item entity
        updatedCartItem = await this.cartItemService.create({ pricingPlanId, quantity }, user.cart.id);
      }

    // Return the cartItem
    return updatedCartItem;
  }

  async findAllItems(userId: number) {
    // Find the user with the userId
    const user = await this.usersService.findOne(userId);
    // Check if the user has a cart
    if (!user.cart)
      throw new NotFoundException('Cart not found');



    return `This action returns all carts`;
  }

  async findUserCart(userId: number) {
    // Find the user with the userId
    const user = await this.usersService.findOneDetailed(userId);
    // Check if the user has a cart
    if (!user.cart)
      throw new NotFoundException('Cart not found');

    // Return the cart
    return user.cart;
  }

  async removeCartItem(removeCartItem: RemoveCartItemDto, userId: number): Promise<boolean> {
    // Destructure removeCartItem data
    const { pricingPlanId } = removeCartItem;

    // Find the user with the userId
    const user = await this.usersService.findOneDetailed(userId);
    // Check if the user has a cart
    if (!user.cart)
      throw new NotFoundException('Cart not found');

    // Find the cart item with the cartItemId
    const cartItem = user.cart.items.find(item => item.pricingPlan.id === pricingPlanId);
    // Check if the cart item was found
    if (!cartItem)
      throw new NotFoundException('Cart item not found');

    // Remove the cart item
    await this.cartItemService.remove(cartItem.id);
    // Return success message
    return true;
  }

  async subtractCartItemQuantity(removeCartItem: RemoveCartItemDto, userId: number): Promise<boolean | CartItem> {
    // Destructure removeCartItem data
    const { pricingPlanId } = removeCartItem;

    // Find the user with the userId
    const user = await this.usersService.findOneDetailed(userId);
    // Check if the user has a cart
    if (!user.cart)
      throw new NotFoundException('Cart not found');

    // Find the cart item with the pricingPlanId
    const cartItem = user.cart.items.find(item => item.pricingPlan.id === pricingPlanId);

    // Check if the cart item was found
    if (!cartItem)
      throw new NotFoundException('Cart item not found');
    // Update the quantity of the cartItem
    return await this.cartItemService.update(cartItem.id, { quantity: 1, type: 'subtract' });
  }

  async clearCart(userId: number): Promise<boolean> {
    // Find the user with the userId
    const user = await this.usersService.findOne(userId);
    // Check if the user has a cart
    if (!user.cart)
      throw new NotFoundException('Cart not found');

    // Remove all cart items
    await this.cartItemService.removeAll(user.cart.id);
    // Return success message
    return true;
  }
}
