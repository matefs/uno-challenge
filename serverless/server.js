/**
 * @fileoverview Configuração e implementação do servidor Apollo para gerenciar uma lista TODO.
 * @module TodoServer
 */

const { ApolloServer } = require("@apollo/server");
const { startStandaloneServer } = require("@apollo/server/standalone");
const { TODO_LIST } = require("./makeData");

/**
 * Gera um número inteiro aleatório para utilizar como ID.
 *
 * @function
 * @returns {number} Um número inteiro aleatório entre 0 e 998.
 */
function getRandomInt() {
  return Math.floor(Math.random() * 999);
}

/**
 * Define o esquema GraphQL utilizando SDL (Schema Definition Language).
 *
 * @constant
 * @type {string}
 */
const typeDefs = `#graphql
  type Item {
    id: Int
    name: String
  }

  input ItemInput {
    id: Int
    name: String
  }

  input ItemFilter {
    id: Int
    name: String
  }

  type Query {
    todoList(filter: ItemFilter): [Item]
  }

  type Mutation {
    addItem(values: ItemInput): Boolean
    updateItem(values: ItemInput): Boolean
    deleteItem(id: Int!): Boolean
  }
`;

const resolvers = {
  Query: {
    /**
     * Retorna a lista de todos os itens ou filtra por nome.
     *
     * @function
     * @param {Object} _ - O objeto raiz (não utilizado).
     * @param {Object} args - Argumentos passados para a query.
     * @param {ItemFilter} args.filter - Filtro opcional para a busca.
     * @returns {Item[]} - Lista de itens TODO.
     */
    todoList: (_, { filter }) => {
      if (filter && filter.name) {
        return TODO_LIST.filter(item => item.name.includes(filter.name));
      }
      return TODO_LIST;
    },
  },
  Mutation: {
    /**
     * Adiciona um novo item à lista TODO.
     *
     * @function
     * @param {Object} _ - O objeto raiz (não utilizado).
     * @param {Object} args - Argumentos passados para a mutation.
     * @param {ItemInput} args.values - Valores do novo item.
     * @returns {boolean} - Retorna true se o item foi adicionado com sucesso, false caso contrário.
     */
    addItem: (_, { values: { name } }) => {
      name = name?.trim();
      const existingItem = TODO_LIST.find(item => item.name === name);

      if (existingItem) {
        return false;
      }

      try {
        const newItem = {
          id: getRandomInt(),
          name,
        };
        TODO_LIST.push(newItem);
        return true;
      } catch (error) {
        console.error(error);
        return false;
      }
    },

    /**
     * Atualiza o nome de um item existente na lista TODO.
     *
     * @function
     * @param {Object} _ - O objeto raiz (não utilizado).
     * @param {Object} args - Argumentos passados para a mutation.
     * @param {ItemInput} args.values - Valores para atualização.
     * @param {number} args.values.id - ID do item a ser atualizado.
     * @param {string} args.values.name - Novo nome para o item.
     * @returns {boolean} - Retorna true se a atualização foi bem-sucedida, false caso contrário.
     */
    updateItem: (_, { values: { id, name } }) => {
      try {
        const itemIndex = TODO_LIST.findIndex(item => item.id === id);
        if (itemIndex > -1) {
          name = name?.trim();
          const existingItem = TODO_LIST.find(item => item.name === name);
          if (existingItem) {
            return false;
          }

          TODO_LIST[itemIndex].name = name;
          return true;
        } else {
          throw new Error('Item não encontrado');
        }
      } catch (error) {
        console.error(error);
        return false;
      }
    },

    /**
     * Remove um item da lista TODO pelo seu ID.
     *
     * @function
     * @param {Object} _ - O objeto raiz (não utilizado).
     * @param {Object} args - Argumentos passados para a mutation.
     * @param {number} args.id - ID do item a ser removido.
     * @returns {boolean} - Retorna true se a remoção foi bem-sucedida, false caso contrário.
     */
    deleteItem: (_, { id }) => {
      try {
        const itemIndex = TODO_LIST.findIndex(item => item.id === id);
        if (itemIndex > -1) {
          TODO_LIST.splice(itemIndex, 1);
          return true;
        } else {
          throw new Error('Item não encontrado');
        }
      } catch (error) {
        console.error(error);
        return false;
      }
    },
  },
};

/**
 * Configuração e inicialização do servidor Apollo.
 *
 * @async
 * @function
 * @returns {Promise<void>} - Promessa que resolve quando o servidor estiver pronto.
 */
const startServer = async () => {
  const server = new ApolloServer({
    typeDefs,
    resolvers,
  });

  const { url } = await startStandaloneServer(server, {
    listen: { port: 4000 },
  });

  console.log(`🚀  Server ready at: ${url}`);
};

startServer();
