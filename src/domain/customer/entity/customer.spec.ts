import { BadRequestException } from '@nestjs/common';
import Customer from './customer';
import { isUUID } from 'class-validator';

describe('Customer Unit Tests', () => {
  describe('when creating a new instance', () => {
    it('Should have a valid generated UUID v4', () => {
      const customer = new Customer(4527, 'Gunter');
      expect(isUUID(customer.uuid, '4')).toBe(true);
    });

    it('Should throw error when document is empty', () => {
      expect(() => {
        new Customer(0, 'Gunter');
      }).toThrowError(BadRequestException);
    });

    it('Should throw error when name is empty', () => {
      expect(() => {
        new Customer(456789, '');
      }).toThrowError(BadRequestException);
    });
  });

  describe('changeName', () => {
    it('should change name correctly', () => {
      const customer = new Customer(123456, 'Maria');
      customer.changeName('Maria Flor');
      expect(customer.name).toBe('Maria Flor');
    });
  });

  describe('changeDocument', () => {
    it('should change document correctly', () => {
      const customer = new Customer(123456, 'Maria');
      customer.changeDocument(10001);
      expect(customer.document).toBe(10001);
    });
  });
});
