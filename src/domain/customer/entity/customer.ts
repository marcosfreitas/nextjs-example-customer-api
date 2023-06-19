import {
  BadRequestException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { isUUID } from 'class-validator';
import { randomUUID } from 'crypto';
import { UUID } from 'crypto';

export default class Customer {
  private _uuid: UUID;
  private _document: number;
  private _name = '';

  constructor(document: number, name: string) {
    this._uuid = randomUUID();
    this._document = document;
    this._name = name;
    this.validate();
  }

  get document(): number {
    return this._document;
  }

  get name(): string {
    return this._name;
  }

  get uuid(): UUID {
    return this._uuid;
  }

  validate() {
    if (!isUUID(this._uuid, '4')) {
      throw new UnprocessableEntityException(
        'Could not generate the correct UUID for the Customer',
      );
    }

    if (this._document <= 0 || this._document.toString().length === 0) {
      throw new BadRequestException(
        'Document property is required for the Customer',
      );
    }

    if (this._name.length === 0) {
      throw new BadRequestException(
        'Name property is required for the Customer',
      );
    }
  }

  changeName(name: string) {
    this._name = name;
    this.validate();
  }

  changeDocument(document: number) {
    this._document = document;
    this.validate();
  }

  toObject() {
    return {
      uuid: this._uuid,
      document: this._document,
      name: this._name,
    };
  }
}
