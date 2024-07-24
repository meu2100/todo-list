"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    let transaction;

    try {
      transaction = await queryInterface.sequelize.transaction();

      const salt = await bcrypt.genSalt(10);
      const hash = await bcrypt.hash("password", salt);

      await queryInterface.bulkInsert(
        "Users",
        [
          {
            id: 1,
            name: "user1",
            mail: "user1@example.com",
            password: hash,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        ],
        { transaction }
      );
      await queryInterface.bulkInsert(
        "Todos",
        Array.from({ length: 10 }).map((_, i) => ({
          name: `todo-${i}`,
          userId: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
        })),
        { transaction }
      );

      await transaction.commit();
    } catch (error) {
      if (transaction) await transaction.rollback();
    }
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("Users", null);
  },
};
