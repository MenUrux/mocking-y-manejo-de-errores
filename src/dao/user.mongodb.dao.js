import UserModel from "./models/user.model.js";

export default class UserMongoDbDao {
    static async get(criteria = {}, opts = {}) {
        return UserModel.find(criteria, opts);
    }
    static async getById(uid) {
        return UserModel.findById(uid);
    }
    static async create(data) {
        return UserModel.create(data);
    }
    static async updateById(uid, data) {
        const criteria = { _id: uid };
        const operation = { $set: data }
        return UserModel.updateOne(criteria, operation);
    }
    static async deleteById(uid) {
        const criteria = { _id: uid };
        return UserModel.deleteOne(criteria);
    }

}