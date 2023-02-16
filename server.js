const express = require('express')
const expressGraphQL = require('express-graphql').graphqlHTTP
const {
    GraphQLSchema,
    GraphQLObjectType,
    GraphQLString,
    GraphQLList,
    GraphQLNonNull,
    GraphQLInt
} = require('graphql')

const app = express()

const books = [
    {id: 1, name: 'harry potter 1', authorId:1 },
    {id: 2, name: 'harry potter 2', authorId:1},
    {id: 3, name: 'harry potter 3', authorId:1},
    {id: 4, name: 'fellowship of the ring', authorId:2},
    {id: 5, name: 'the 2 towers', authorId: 2},
    {id: 6, name: 'the return of the king', authorId: 2},
    {id: 7, name: 'the way of shadows', authorId: 3},
    {id: 8, name: 'beyond the shadows', authorId: 3}
]

const authors = [
    {id: 1, name: 'j.k. rolling'},
    {id: 2, name: 'J. R. R. Tolkien'},
    {id: 3, name: 'janjan'}
]

const BookType = new GraphQLObjectType({
    name: 'Book',
    description: 'this is a book',
    fields: ()=>({
        id: {type:new GraphQLNonNull(GraphQLInt)},
        name: {type:new GraphQLNonNull(GraphQLString)},
        authorId: {type:new GraphQLNonNull(GraphQLInt)},
        author: {
            type: AuthorType,
            resolve: (book) => {
                return authors.find(author=>author.id===book.authorId)
            }
        }
    })
})

const AuthorType = new GraphQLObjectType({
    name: 'Author',
    description: 'this represnts a author of a book',
    fields: ()=>({
        id: {type: new GraphQLNonNull(GraphQLInt)},
        name: {type: new GraphQLNonNull(GraphQLString)},
        books: {
            type: new GraphQLList(BookType),
            resolve: (author) => {
                return books.filter(book => book.authorId === book.id)
            }
        }
    })
    
})


const RootQueryType = new GraphQLObjectType({
    name: 'Query',
    description: 'Root Query',
    fields: () => ({
        book: {
            type: BookType,
            description: 'A Single Book',
            args: {
                id: {type: GraphQLInt}
            },
            resolve: (parent, args) => books.find(book => book.id === args.id)
        },
        books: {
            type : new GraphQLList(BookType),
            description: 'List of All Books',
            resolve: () => books
        },
        author: {
            type : AuthorType,
            description: 'A Single Author',
            args: {
                id: {type: GraphQLInt}
            },
            resolve: (parent, args) => authors.find(author => author.id === args.id)
        },
        authors: {
            type : new GraphQLList(AuthorType),
            description: 'List of All Authors',
            resolve: () => authors
        },
        
    })
})


const RootMutationType = new GraphQLObjectType({
    name: 'Mutation',
    description: 'Root Mutation',
    fields: () => ({
        addBook: {
            type: BookType,
            description: 'Add a Book',
            args: {
                name: {type: new GraphQLNonNull(GraphQLString)},
                authorId: {type: new GraphQLNonNull(GraphQLInt)},
            },
            resolve: (parent, args) => {
                const book = {id: books.length+1, name: args.name, authorId: args.authorId}
                books.push(book)
                return book
            }
        },
        addAuthor: {
            type: AuthorType,
            description: 'Add a Author',
            args: {
                name: {type: new GraphQLNonNull(GraphQLString)},
            },
            resolve: (parent, args) => {
                const author = {id: authors.length+1, name: args.name}
                authors.push(author)
                return author
            }
        },
    })
})


const schema = new GraphQLSchema({
    query: RootQueryType,
    mutation: RootMutationType
})

app.use('/graphql', expressGraphQL({
    schema: schema,
    graphiql: true
}))

app.listen(5000., ()=>console.log('Server Running'))