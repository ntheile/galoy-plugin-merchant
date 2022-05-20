import { ApolloServer, gql } from "apollo-server";
import { ApolloServerPluginLandingPageGraphQLPlayground } from "apollo-server-core";
import { buildSubgraphSchema } from "@apollo/subgraph";


const typeDefs = gql`
    extend schema
        @link(url: "https://specs.apollo.dev/federation/v2.0",
            import: ["@key", "@shareable"])

    type Query {
        merchants: [Merchant]
    }

    type Merchant @key(fields: "id") {
        id: ID!
        name: String
        address: String
        acceptsBitcoin: Boolean
    }

    # Add merchants to the SuperGraph Me query  { 
    #   me { 
    #     merchants
    #   } 
    # } 
    extend type User @key(fields: "id") {
        id: ID!
        merchants: [Merchant]
    }
`;

const resolvers = {
    Query: {
        merchants() {
            return [
                { id: 1, name: "Three Forks", address: "111 Lavaca St, Austin, TX 78701", acceptsBitcoin: true },
                { id: 2, name: "Shiners", address: "422 Congress Ave D, Austin, TX 78701", acceptsBitcoin: true },

            ]
        }
    }
};

const server = new ApolloServer({
    schema: buildSubgraphSchema({typeDefs,resolvers}),
    plugins: [ApolloServerPluginLandingPageGraphQLPlayground()],
});

server.listen(4003).then(({ url }) => {
    console.log(`🚀 Merchants Server ready at ${url} `);
});