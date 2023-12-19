export class userDto {
  id;
  email;
  isActivated;
  constructor(model) {
    this.id = model.id;
    this.email = model.email;
    this.isActivated = Boolean(model.IsActivated);
  }
}
