import { ApolloServer, gql } from "apollo-server";
import { ApolloServerPluginLandingPageGraphQLPlayground } from "apollo-server-core";
import { buildSubgraphSchema } from "@apollo/subgraph";


const typeDefs = gql`
    extend schema
        @link(url: "https://specs.apollo.dev/federation/v2.0",
            import: ["@key", "@shareable", "@inaccessible", "@override", "@external", "@provides", "@requires"  ])

    type Query {
        merchants: [Merchant]
    }

    type Merchant @key(fields: "id") {
        id: ID!
        name: String
        address: String
        acceptsBitcoin: Boolean
        latitude: Float
        longitude: Float
    }

    # Add merchants to the SuperGraph Me query  { 
    #   me { 
    #     merchants
    #   } 
    # } 
    type User @key(fields: "id")
    {
        id: ID! @external
        merchants: [Merchant]
    }
`;

const merchantsData = [
    { id: 1, name: "Three Forks", address: "111 Lavaca St, Austin, TX 78701", acceptsBitcoin: true, latitude: 30.26421, longitude: -97.74665 },
    { id: 2, name: "Shiners", address: "422 Congress Ave D, Austin, TX 78701", acceptsBitcoin: true, latitude: 30.26735, longitude: -97.74349 },

]

const resolvers = {
    Query: {
        merchants() {
            return merchantsData;
        }
    },
    //
    // The Me Query from the Galoy Subgraph (User > Merchant) is resolved here in the Merchants subgraph 
    // (via the SuperGraph):
    // Notice the separation of concerns bewteen microservices, i.e the Galoy core subgraph 
    // does not need to know anything about the Merchants subgraph. Hence separate teams or
    // even countries can work independently, Bitcoin Beach, Jungle, etc...
    //
    // query {
    //   me {
    //      id
    //      phone
    //      merchant {
    //        name
    //        address
    //      }
    // }
    User: {
        async merchants(parent, args, context, info) {
            return merchantsData;
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