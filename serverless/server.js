const { ApolloServer } = require("@apollo/server");
const { startStandaloneServer } = require("@apollo/server/standalone");
const { TODO_LIST } = require("./makeData");

/**
 * Gera um número inteiro para utilizar de id
 */
function getRandomInt() {
  return Math.floor(Math.random() * 999);
}

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
    todoList: (_, { filter }) => {
      if (filter && filter.name) {
        return TODO_LIST.filter(item => item.name.includes(filter.name));
      }
      return TODO_LIST;
    },
  },
  Mutation: {
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
    updateItem: (_, { values: { id, name } }) => {
      try {
        const itemIndex = TODO_LIST.findIndex(item => item.id === id);
        if (itemIndex > -1) {
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

// Configuração para subir o backend
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
