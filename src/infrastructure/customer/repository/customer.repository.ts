import Customer from 'src/domain/customer/entity/customer';
import { CustomerRepositoryInterface } from 'src/domain/customer/repository/customer-repository.interface';

export default class CustomerRepository implements CustomerRepositoryInterface {
  async create(entity: Customer) {
    return;
  }

  async update(entity: Customer) {
    return;
  }

  async find(document: string) {
    return new Customer(123, 'abc');
  }
}
