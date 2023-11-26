module.exports = class userDto {
  email;
  id;
  isActivated;
  constructor(model) {
    this.email = model.email;
    this.id = model._id; //ВОПРОС с подчеркиванием или нет(смотря что вернет sql)
    this.isActivated = model.isActivated;
  }
};
